<?php
/**
 * SoportePost - Script de Prueba de Rate Limiting
 * Ejecuta este archivo en tu navegador (http://localhost/SoportePost/test_rate.php)
 * o desde la consola (C:\xampp\php\php.exe test_rate.php)
 */
header('Content-Type: text/plain; charset=utf-8');

// Obtener la IP actual del cliente que ejecuta el script
$ip = $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
// Si hay varias IPs en X-Forwarded-For, tomar la primera
if (strpos($ip, ',') !== false) {
    $ip = trim(explode(',', $ip)[0]);
}

$route = 'api/users/access';
$hash = md5($ip . '_' . $route);
$limit_file = __DIR__ . '/tmp/rate_limit/' . $hash . '.json';

// Limpiar registros previos para que la prueba empiece limpia
if (file_exists($limit_file)) {
    @unlink($limit_file);
}

// Obtener la URL base dinámicamente
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
if (php_sapi_name() === 'cli') {
    $host = 'localhost';
    $base_dir = '/SoportePost';
} else {
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $script_name = $_SERVER['SCRIPT_NAME'] ?? '/SoportePost/test_rate.php';
    $base_dir = dirname($script_name);
    // Reemplazar barras invertidas en Windows
    $base_dir = str_replace('\\', '/', $base_dir);
    $base_dir = ($base_dir === '/') ? '' : $base_dir;
}

$url = $protocol . '://' . $host . $base_dir . '/api/users/access';

echo "=========================================================\n";
echo " PROBANDO LIMITACIÓN DE TASA (RATE LIMITING) EN SOPORTEPOST\n";
echo "=========================================================\n";
echo "IP del Cliente detectada: $ip\n";
echo "Ruta de la API probada: $url\n";
echo "Límite establecido para login: 10 peticiones por minuto.\n";
echo "Enviando 12 solicitudes seguidas...\n";
echo "---------------------------------------------------------\n\n";

function realizar_peticion($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'username' => 'rate_test_user',
        'password' => 'rate_test_pass'
    ]));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $http_code,
        'response' => $response
    ];
}

for ($i = 1; $i <= 12; $i++) {
    $resultado = realizar_peticion($url);
    echo "Solicitud #$i -> Código de Respuesta HTTP: " . $resultado['code'] . "\n";
    
    if ($resultado['code'] === 429) {
        echo "\n[OK] ¡La limitación de tasa funciona correctamente!\n";
        echo "La solicitud #$i fue bloqueada con 429 Too Many Requests.\n";
        echo "Detalle de respuesta JSON:\n" . $resultado['response'] . "\n";
        break;
    }
    
    // Pequeña pausa para no saturar el socket local
    usleep(50000); 
}

echo "\n---------------------------------------------------------\n";
echo "Fin de la prueba.\n";
echo "=========================================================\n";
