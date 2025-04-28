<?php
class Error1 extends Controller {
    function __construct() {
        parent::__construct();
    }

    function index() {
        http_response_code(404);
        echo '<!DOCTYPE html>';
        echo '<html lang="es">';
        echo '<head>';
        echo '    <meta charset="UTF-8">';
        echo '    <meta name="viewport" content="width=device-width, initial-scale=1.0">';
        echo '    <title>Error 404 - Página no encontrada</title>';
        echo '    <style>';
        echo '        body { font-family: sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }';
        echo '        .error-container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center; }';
        echo '        h1 { color: #e74c3c; margin-bottom: 10px; }';
        echo '        p { color: #777; margin-bottom: 20px; }';
        echo '        a { color: #3498db; text-decoration: none; }';
        echo '        a:hover { text-decoration: underline; }';
        echo '    </style>';
        echo '</head>';
        echo '<body>';
        echo '    <div class="error-container">';
        echo '        <h1>¡Oops! Página no encontrada</h1>';
        echo '        <p>La URL que has solicitado no existe en este servidor.</p>';
        echo '        <p><a href="http://10.225.1.136/SoportePost/">Volver a la página principal</a></p>';
        echo '    </div>';
        echo '</body>';
        echo '</html>';
        return false;
    }
}
?>