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
        require 'app/controllers/api.php';
        $controller = new Api();
        $controller->processApi($urlSegments); // Cambiar el nombre de la función
        return false; // Detener el procesamiento del Bootstrap para URLs normales}
    }
    function error1(){
        require 'app/controllers/error.php';
        $controller = new Error1();
        $controller->index();
        return false;
    }
}
?>