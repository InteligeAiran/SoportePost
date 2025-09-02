<?php
require_once __DIR__ . "/../../libs/session.php";
require_once __DIR__ . "/../../libs/Controller.php";

session_start();

class domiciliacion extends Controller {

    function __construct() {
        parent::__construct();
        if (empty($_SESSION["id_user"])) {
            // Si no hay una sesión activa, redirigir a la página de inicio de sesión
            // Set the message to be displayed
            $this->view->message = 'Por favor inicie sesión para acceder al sistema.';
            $this->view->redirectURL = self::getURL() . 'login'; // URL for JavaScript redirection
            // Load a specific view that will display the message and then redirect
            exit(); // Stop further execution of the dashboard controller
        }
    }

    function index() {
        Model::exists('login');

        // Agregar sessionLifetime a la respuesta
        if (isset($_SESSION['session_lifetime'])) {
            $this->view->sessionLifetime = $_SESSION['session_lifetime'];
        } else {
            $this->view->sessionLifetime = null; // O un valor predeterminado si es necesario
        }
               
        // Obtener el ID de usuario de la sesión
        $usuario_id = Session::get('id_user');
       
        //var_dump($usuario_id, $_SESSION['session_lifetime']);
        // Validar sesiones expiradas
        $this->validataExpiresSessions($usuario_id);
    
         //Incorpora el FrontEnd Controller
      $this->view->js=array('domiciliacion/js/frontEnd.js');
      $this->view->render('domiciliacion/index',1);
    }

    /*private function validataExpiresSessions($usuario_id) {
        $usuarioModel = new loginModel();
        // Obtener la fecha y hora actual
        $ahora = date('Y-m-d H:i:s');
        // Obtener las sesiones expiradas del usuario
        $expires_session = $usuarioModel->GetExpiredSessions($usuario_id, $ahora);
        // Verificar si hay sesiones expiradas
        if ($expires_session && $expires_session['numRows'] > 0) {
            for ($i=0; $i < $expires_session['numRows']; $i++) { 
                $session = pg_fetch_assoc($expires_session['query'], $i); 
                // Realizar las acciones necesarias para las sesiones expiradas
                // Ejemplo: Actualizar el estado de la sesión
                $usuarioModel->UpdateSessionExpired($session['id_session']);
            }
            // Redirigir a la página de inicio de sesión
            header('Location: ' . self::getURL());
        }
    }*/

    private function validataExpiresSessions($usuario_id) {
        $usuarioModel = new loginModel();
        // Obtener la fecha y hora actual
        $ahora = date('Y-m-d H:i:s');
        // Obtener las sesiones expiradas del usuario
        $expires_session = $usuarioModel->GetExpiredSessions($usuario_id, $ahora);
        //var_dump($expires_session);
        // Verificar si hay sesiones expiradas
        if ($expires_session && $expires_session['numRows'] > 0) {
            for ($i = 0; $i < $expires_session['numRows']; $i++) {
                $session = pg_fetch_assoc($expires_session['query'], $i);
                // Realizar las acciones necesarias para las sesiones expiradas
                // Ejemplo: Actualizar el estado de la sesión
                $usuarioModel->UpdateSessionExpired($session['id_session']);
            }
            // Pasar los datos a la vista
            $this->view->expired_sessions = true;
            $this->view->message = 'Por su seguridad la seccion fue cerrada.';
            $this->view->redirect = 'login';
            $this->view->usuario_id = $usuario_id;
        } else {
            // Pasar datos por defecto a la vista
            $this->view->expired_sessions = false;
        }
    }
}
?>