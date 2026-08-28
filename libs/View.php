<?php   //Vista del Controlador
#[\AllowDynamicProperties]
class View {
    public $js;
    public $css;
    public $expired_sessions;
    public $message;
    public $redirect;
    public $usuario_id;

    public $modelViews;
    public $sessionLifetime;

    public $redirectURL;

      function __construct(){
      	//Constructor de view
      }

      // Cache-busting genérico para cualquier archivo estático del proyecto
      // (JS, CSS): usa la fecha de última modificación en disco como versión,
      // así el navegador (o cualquier proxy/CDN intermedio) siempre sirve el
      // archivo actualizado después de un deploy, sin depender de que el
      // usuario limpie caché manualmente. $relativePathFromRoot es relativo
      // a la raíz del proyecto (ROOT), ej. 'app/plugins/css/General.css'.
      public function staticAssetVersion($relativePathFromRoot){
          $fsPath = ROOT . $relativePathFromRoot;
          return file_exists($fsPath) ? filemtime($fsPath) : time();
      }

      // Igual que staticAssetVersion(), pero para los <script> de cada módulo,
      // cuya ruta ya viene relativa a app/views/ (ej. 'pendiente_entrega/js/frontEnd.js').
      public function assetVersion($relativePath){
          return $this->staticAssetVersion('app/views/' . $relativePath);
      }

      public function render($name,$noInclude = false){
        // SEGURIDAD: Iniciar la sesión si no está iniciada para obtener el token CSRF actual
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $csrfToken = $_SESSION['csrf_token'] ?? '';
        
        // SEGURIDAD: Inyectar automáticamente el token CSRF en el objeto global 'window' e interceptar
        // todas las peticiones asíncronas salientes (XHR, Fetch, y jQuery AJAX) para incluir la cabecera X-CSRF-TOKEN.
        echo '<script>
            window.CSRF_TOKEN = ' . json_encode($csrfToken) . ';
            (function() {
                // 1. Interceptar solicitudes de XMLHttpRequest (AJAX tradicional / vanilla JS)
                const originalOpen = XMLHttpRequest.prototype.open;
                const originalSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.open = function(method, url, ...args) {
                    this._method = method;
                    this._url = url;
                    return originalOpen.apply(this, [method, url, ...args]);
                };
                XMLHttpRequest.prototype.send = function(body) {
                    const method = (this._method || "GET").toUpperCase();
                    // Solo inyectar token en peticiones de modificación (POST, PUT, DELETE, etc.)
                    if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
                        if (window.CSRF_TOKEN) {
                            this.setRequestHeader("X-CSRF-TOKEN", window.CSRF_TOKEN);
                        }
                    }
                    return originalSend.apply(this, [body]);
                };

                // 2. Interceptar la API nativa de Fetch (utilizada por frameworks y librerías modernas)
                const originalFetch = window.fetch;
                window.fetch = async function(resource, config = {}) {
                    const method = (config.method || "GET").toUpperCase();
                    if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
                        if (window.CSRF_TOKEN) {
                            if (!config.headers) {
                                config.headers = {};
                            }
                            if (config.headers instanceof Headers) {
                                config.headers.set("X-CSRF-TOKEN", window.CSRF_TOKEN);
                            } else {
                                config.headers["X-CSRF-TOKEN"] = window.CSRF_TOKEN;
                            }
                        }
                    }
                    return originalFetch(resource, config);
                };

                // 3. Configurar ajaxSetup de jQuery tan pronto como esté cargada la librería en la página
                const checkJQuery = setInterval(function() {
                    if (typeof jQuery !== "undefined") {
                        clearInterval(checkJQuery);
                        jQuery.ajaxSetup({
                            beforeSend: function(xhr, settings) {
                                const method = (settings.type || "GET").toUpperCase();
                                if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
                                    xhr.setRequestHeader("X-CSRF-TOKEN", window.CSRF_TOKEN);
                                }
                            }
                        });
                    }
                }, 50);
                // Detener el intervalo si no se carga jQuery después de 10 segundos
                setTimeout(function() { clearInterval(checkJQuery); }, 10000);
            })();
        </script>';

      	if($noInclude == true){
           require 'app/views/'.$name.'.php';
      	}
      	else{
           require 'app/views/core/index/header.php';
      	   require 'app/views/core/'.$name.'.php';
      	   require 'app/views/core/index/footer.php';
      	}
      }  
   }
      
?>