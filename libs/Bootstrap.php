<?php
class Bootstrap{
    function __construct(){
        $url = isset($_GET['url']) ? $_GET['url'] : null;
        $url = rtrim($url, '/');
        $url = explode('/',$url);

         // --- ENRUTAMIENTO PARA LA API ---
        if (isset($url[0]) && $url[0] === 'api') {
            $this->routeApi(array_slice($url, 1));
            exit; // Detener el procesamiento del Bootstrap para URLs normales
        }

        if(empty($url[0])){
            require 'app/controllers/login.php';
            $controller = new login();
            $controller->index();
            exit;
        }

        $controller_path = 'app/controllers/'.$url[0];
        $file = $controller_path.'.php';

        if (is_dir($controller_path)) {
            $file = $controller_path . '/index.php';
            if (file_exists($file)) {
                require $file;
                $controllerName = strtolower($url[0]); // Or a more specific naming convention
                try {
                    // Assuming your main dashboard controller inside the folder is named similarly
                    $controller = new $controllerName();
                    // You might need to adjust how you call methods based on further URL segments
                    if(isset($url[1]) && method_exists($controller, $url[1])){
                        if(isset($url[2])){
                            $controller->{$url[1]}($url[2]);
                        } else {
                            $controller->{$url[1]}();
                        }
                    } else {
                        $controller->index(); // Default method in the dashboard controller
                    }
                } catch (Throwable $e) {
                    $this->error1();
                    return false;
                }
                return;
            }
        }

        if(file_exists($file)){
            //Requiere del Archivo
            try {
                require $file;
                $controller = new $url[0];
                $controller->loadModel($url[0]);
                //Llamar a la pagina de Error
                if(isset($url[1])){
                    if(method_exists($controller,$url[1])){
                        if(isset($url[2])){
                            $controller->{$url[1]}($url[2]);
                        } else {
                            $controller->{$url[1]}();
                        }
                    }else{
                        $this->error1();
                    }
                }else{
                    $controller->index();
                }
            } catch (Throwable $e) {
                $this->error1();
                return false;
            }
        } else {
            $this->error1();
        }
    }

    private function routeApi($urlSegments) {
        if (isset($urlSegments[0])) {
            $apiFolder = 'app/controllers/api/';
            $controllerName = strtolower($urlSegments[0]);
            $controllerFile = $apiFolder . $controllerName . '/' . $controllerName . 'Api.php';

            if (file_exists($controllerFile)) {
                // Incluimos el archivo del controlador
                require $controllerFile;

                // Construimos el namespace basado en la estructura de carpetas
                $namespace = 'App\\Controllers\\Api\\' . ucfirst($controllerName);

                // Inferimos el nombre de la clase del nombre del archivo (quitando "Api")
                $classNameBase = ucfirst($controllerName);
                $classNameWithNamespace = $namespace . '\\' . $classNameBase;

                // Verificamos si la clase con el namespace existe
                if (class_exists($classNameWithNamespace)) {
                    try {
                        $controller = new $classNameWithNamespace();

                        if (isset($urlSegments[1]) && method_exists($controller, $urlSegments[1])) {
                            $method = $urlSegments[1];
                            $params = array_slice($urlSegments, 2);
                            call_user_func_array([$controller, $method], $params);
                        } else {
                            $controller->processApi($urlSegments); // Fallback si no hay un método específico
                        }
                    } catch (\Throwable $e) {
                        echo "Error al instanciar el controlador: " . $e->getMessage();
                    }
                } else {
                    echo "Clase con namespace no encontrada: " . $classNameWithNamespace;
                }
            } else {
                require 'app/controllers/error.php';
                $controller = new Error1();
                $controller->index();
            }
        } else {
            require 'app/controllers/error.php';
            $controller = new Error1();
            $controller->index();
        }
        return false;
    }

    function error1(){
        require 'app/controllers/error.php';
        $controller = new Error1();
        $controller->index();
        return false;
    }
}
?>