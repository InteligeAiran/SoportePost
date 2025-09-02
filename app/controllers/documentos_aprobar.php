<?php
require_once __DIR__ . "/../../libs/session.php";
require_once __DIR__ . "/../../libs/Controller.php";

session_start();

class documentos_aprobar extends Controller {

    private $userModel; 

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

        Model::exists('user'); // Si Model::exists() carga la clase, esto es bueno.
        Model::exists('reports');
        $this->userModel = new UserModel(); 
        
    
        if (isset($_SESSION['id_user']) && isset($_SESSION['session_id'])) {
            $model = new UserModel(); // O pásalo por inyección de dependencias
            // Verifica si la sesión actual del navegador está activa en la DB
            // Verifica si la sesión actual del navegador sigue siendo activa en la DB
            if (!$model->IsSessionActuallyActive($_SESSION['session_id'], $_SESSION['id_user'])) {
                // La sesión no es activa en la DB (fue invalidada por otro login)
                
                session_unset();     // Elimina todas las variables de sesión
                session_destroy();   // Destruye la sesión actual
                setcookie(session_name(), '', time() - 3600, '/'); // Borra la cookie de sesión del navegador
                
                // Redirige al usuario al login con un mensaje
                header('Location: login'); // O una URL de login con un mensaje
                exit();
            }
        } else if (!isset($_SESSION['id_user']) && !empty($_COOKIE[session_name()])) {
            // Si la cookie de sesión existe pero PHP no cargó una sesión (ej. sesión destruida), forzar logout.
            session_unset();
            session_destroy();
            setcookie(session_name(), '', time() - 3600, '/');
            header('Location: /login.php?message=session_invalid');
            exit();
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
      $this->view->js=array('documentos_aprobar/js/frontEnd.js');
      $this->view->render('/documentos_aprobar/index',1);
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