<?php
/**
 * SoportePost - Sistema de Gestión de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raíz del proyecto
 */

class Controller {
  public $model;
  public $view;
      
  function __construct(){
    // SEGURIDAD: Iniciar la sesión si no está iniciada para poder usar variables de sesión (como tokens de seguridad)
    if (session_status() === PHP_SESSION_NONE) {
      session_start();
    }
    // SEGURIDAD: Generar un token CSRF único para la sesión actual si no existe aún
    if (empty($_SESSION['csrf_token'])) {
      $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    // SEGURIDAD: Ejecutar verificación de límite de peticiones (Rate Limiting) y validación de tokens CSRF
    $this->checkRateLimit();
    $this->validateCSRFToken();

    $this->view = new View();
  }

  /**
   * SEGURIDAD: Control de tasa de peticiones (Rate Limiting)
   * Limita la cantidad de llamadas entrantes por IP y endpoint a través de archivos temporales en tmp/rate_limit.
   * Evita ataques de fuerza bruta o abuso de la API de manera simple y eficiente.
   */
  private function checkRateLimit() {
    $url = $_GET['url'] ?? '';
    $url = rtrim($url, '/');
    $urlSegments = explode('/', $url);

    // Solo aplicar rate limiting a las rutas que correspondan a la API (empiezan por 'api')
    if (isset($urlSegments[0]) && strtolower($urlSegments[0]) === 'api') {
      $route = implode('/', array_map('strtolower', $urlSegments));

      // 1. Configuración de ventanas de tiempo y límites de peticiones por ruta
      $window = 60; // Ventana de tiempo en segundos (1 minuto)
      $limit = 100; // Límite por defecto para cualquier endpoint general de la API

      if ($route === 'api/users/access') {
        $limit = 10; // Límite estricto de 10 intentos de inicio de sesión por minuto
      } elseif (stripos($route, 'upload') !== false) {
        $limit = 10; // Límite estricto de 10 cargas de archivos por minuto
      }

      // 2. Obtener la IP real del cliente
      $ip = $this->getClientIP();

      // 3. Crear el directorio temporal de rate limit en la raíz si no existe
      $dir = ROOT . 'tmp/rate_limit';
      if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
      }

      // 4. Generar un archivo único basado en el hash MD5 de la IP y la ruta consultada
      $filename = $dir . DIRECTORY_SEPARATOR . md5($ip . '_' . $route) . '.json';
      $now = time();

      // 5. Leer los timestamps de peticiones anteriores almacenados en disco
      $timestamps = [];
      if (file_exists($filename)) {
        $data = @file_get_contents($filename);
        if ($data) {
          $timestamps = json_decode($data, true) ?: [];
        }
      }

      // Filtrar y conservar solo las peticiones que ocurrieron dentro de la ventana de tiempo actual
      $timestamps = array_filter($timestamps, function($t) use ($now, $window) {
        return ($now - $t) < $window;
      });

      // 6. Si se excede el límite permitido, denegar el acceso devolviendo código HTTP 429
      if (count($timestamps) >= $limit) {
        // Encontrar el timestamp más antiguo en la ventana para calcular cuánto falta para desbloquearse
        $oldest = min($timestamps);
        $retryAfter = $window - ($now - $oldest);
        if ($retryAfter < 1) $retryAfter = 1;

        header('Content-Type: application/json');
        header("Retry-After: $retryAfter");
        http_response_code(429);
        echo json_encode([
          'success' => false,
          'error' => 'Too many requests. Please try again later.',
          'retry_after' => $retryAfter
        ]);
        exit();
      }

      // 7. Registrar la petición actual agregando el timestamp y guardar en disco con bloqueo exclusivo
      $timestamps[] = $now;
      @file_put_contents($filename, json_encode(array_values($timestamps)), LOCK_EX);
    }
  }

  /**
   * Obtiene la dirección IP real del cliente considerando proxies o balanceadores de carga
   */
  private function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ipList[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
  }

  /**
   * SEGURIDAD: Validación de tokens CSRF
   * Protege los endpoints mutadores (POST, PUT, DELETE, PATCH) asegurando que provengan de formularios
   * o solicitudes legítimas del frontend que contengan el token CSRF correcto.
   */
  private function validateCSRFToken() {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    // Solo validar peticiones de modificación (POST, PUT, DELETE, PATCH)
    if (in_array(strtoupper($method), ['POST', 'PUT', 'DELETE', 'PATCH'])) {
      $url = $_GET['url'] ?? '';
      $url = rtrim($url, '/');
      $urlSegments = explode('/', $url);
      
      // Excluir endpoints públicos o de login que no requieren token CSRF previo
      $route = implode('/', array_map('strtolower', $urlSegments));
      $exemptions = [
        'api/users/access',
        'api/users/checkuser',
        'api/users/getemailbyusername',
        'api/users/logout',
        'api/email/resetpassword',
        'api/email/checkemail'
      ];
      
      if (in_array($route, $exemptions)) {
        return true;
      }

      // Si la acción (último segmento del URL) empieza por get, search, validate o check,
      // se exime de la validación CSRF por tratarse de operaciones de lectura de datos.
      $action = end($urlSegments);
      if ($action) {
        $actionLower = strtolower($action);
        foreach (['get', 'search', 'validate', 'check'] as $prefix) {
          if (strpos($actionLower, $prefix) === 0) {
            return true;
          }
        }
      }
      
      // Buscar el token enviado en la cabecera HTTP o en los campos del cuerpo POST
      $clientToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
      
      if (!$clientToken && isset($_POST['csrf_token'])) {
        $clientToken = $_POST['csrf_token'];
      }
      
      $sessionToken = $_SESSION['csrf_token'] ?? null;
      
      // Comparar de manera segura a nivel de bytes el token del cliente contra el de la sesión
      if (!$sessionToken || !$clientToken || !hash_equals($sessionToken, $clientToken)) {
        header('Content-Type: application/json');
        http_response_code(403);
        echo json_encode([
          'success' => false,
          'error' => 'CSRF token validation failed. Request blocked.'
        ]);
        exit();
      }
    }
    return true;
  }

  public function loadModel($name){
    $path = 'app/models/'.$name.'_model.php';
    if(file_exists($path)){
      require 'app/models/'.$name.'_model.php';
      $modelName = $name.'_Model';
      $this->model = new $modelName();
    }
  }

  public static function exists($controllername){
    $fullpath = self::getFullpath($controllername);
    $found=false;
    $existe = 'no existe';
    if(file_exists($fullpath)){
      include $fullpath;
    }
  }

  public static function getFullpath($controllername){
    return ROOT."app/controllers/".$controllername.".php";
  }

  public function loadModelNew($modulo,$modelpath){     
    $path = 'app/views/'.$modulo.'/models/'.$modelpath.'Model.php';
    if(file_exists($path)){
      require $path;
      $class = $modelpath.'Model';
      $this->view->modelViews = new $class;
    }
  }//end 

  public static function getURL() {
    $arrayURL = explode("/", $_SERVER['SCRIPT_NAME']);
    $file = $arrayURL[1];
    //$url = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['HTTP_HOST'] . "/" . $file . "/";
    
    // Detección robusta de protocolo
    $protocol = 'http://';
    if ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') || 
        (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
        (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'soportepost.intelipunto.com') !== false)) {
        $protocol = 'https://';
    }
    
    // Original: $url = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['HTTP_HOST'] . "/" . $file . "/";
    $url = $protocol . $_SERVER['HTTP_HOST'] . "/" . $file . "/";
    return $url;
  }
}
?>