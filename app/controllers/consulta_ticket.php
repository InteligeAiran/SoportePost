<?php

require_once __DIR__ . "/../../libs/session.php";
require_once __DIR__ . "/../../libs/Controller.php";

session_start();;
class consulta_ticket extends Controller {
        public $view;

    public function __construct() {
        parent::__construct();
    }

    public function index(): void {
        Model::exists('consulta_rif');
        Model::exists('reports');

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
        $this->view->js = array('consulta_ticket/js/frontEnd.js');
        $this->view->render('consulta_ticket/index', 1);
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
