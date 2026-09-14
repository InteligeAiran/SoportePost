<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 *
 * Modulo "Afiliaciones Suiche 7B": listado de comercios ya afiliados por
 * Inteligensa (banco/razon social/seriales/telefono/agente). El registro
 * en si se hace desde consulta_rif (boton "Registrar Afiliacion Suiche 7B"
 * en el modal de detalles del POS); este modulo es solo de consulta.
 * Visibilidad gobernada por sub_modules/tblpermisosubmodulos, igual que
 * el resto de los modulos del sistema.
 */

require_once __DIR__ . "/../../libs/session.php";
require_once __DIR__ . "/../../libs/Controller.php";

session_start();

class suiche7b_registros extends Controller {

    public $view;

    public $userModel;

    function __construct() {
        parent::__construct();

        if (empty($_SESSION["id_user"])) {
            header('Location: ' . self::getURL() . 'login');
            exit();
        }

        Model::exists('user');
        $this->userModel = new UserModel();

        if (isset($_SESSION['id_user']) && isset($_SESSION['session_id'])) {
            $model = new UserModel();
            if (!$model->IsSessionActuallyActive($_SESSION['session_id'], $_SESSION['id_user'])) {
                session_unset();
                session_destroy();
                setcookie(session_name(), '', time() - 3600, '/');
                header('Location: login');
                exit();
            }
        } else if (!isset($_SESSION['id_user']) && !empty($_COOKIE[session_name()])) {
            session_unset();
            session_destroy();
            setcookie(session_name(), '', time() - 3600, '/');
            header('Location: ' . self::getURL() . 'login');
            exit();
        }
    }

    public function index(): void {
        Model::exists('login');

        if (isset($_SESSION['session_lifetime'])) {
            $this->view->sessionLifetime = $_SESSION['session_lifetime'];
        } else {
            $this->view->sessionLifetime = null;
        }

        $usuario_id = Session::get('id_user');
        $this->validataExpiresSessions($usuario_id);

        $this->view->js = array('suiche7b_registros/js/frontEnd.js');
        $this->view->render('suiche7b_registros/index', 1);
    }

    private function validataExpiresSessions($usuario_id) {
        $usuarioModel = new loginModel();
        $ahora = date('Y-m-d H:i:s');
        $expires_session = $usuarioModel->GetExpiredSessions($usuario_id, $ahora);

        if ($expires_session && $expires_session['numRows'] > 0) {
            for ($i = 0; $i < $expires_session['numRows']; $i++) {
                $this->view->expired_sessions = true;
                $this->view->message = 'Su sesión está a punto de expirar.';
                $this->view->redirect = 'login';
                $this->view->usuario_id = $usuario_id;
            }
        } else {
            $this->view->expired_sessions = false;
        }
    }
}
?>
