<?php


class gestion_comercial extends Controller {
        public $view;

    function __construct() {
        parent::__construct();
        session_start();
        if (empty($_SESSION["id_user"])) {
            // Si no hay una sesión activa, redirigir a la página de inicio de sesión
            $this->view->message = 'Por favor inicie sesión para acceder al sistema.';
            $this->redirectToLogin();
        }
    }

    private function redirectToLogin() {
        $loginUrl = self::getURL() . 'login';
        header("Location: $loginUrl");
     exit();
    }


    public function index(): void {
        Model::exists('user');

        Model::exists('consulta_rif');

        // Agregar sessionLifetime a la respuesta
        if (isset($_SESSION['session_lifetime'])) {
            $this->view->sessionLifetime = $_SESSION['session_lifetime'];
        } else {
            $this->view->sessionLifetime = null; // O un valor predeterminado si es necesario
        }

        // Obtener el ID de usuario de la sesión
        $usuario_id = Session::get('id_user');

        // Validar sesiones expiradas
        $this->validataExpiresSessions($usuario_id);

        // Incorporates the FrontEnd Controller
        $this->view->js = array('gestion_comercial/js/frontEnd.js');
        $this->view->render('gestion_comercial/index', 1);
    }

    private function validataExpiresSessions($usuario_id) {
        $usuarioModel = new consulta_rifModel();
        // Obtener la fecha y hora actual
        $ahora = date('Y-m-d H:i:s');
        // Obtener las sesiones expiradas del usuario
        $expires_session = $usuarioModel->GetExpiredSessions($usuario_id, $ahora);
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