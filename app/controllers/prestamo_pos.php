<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
require_once __DIR__ . "/../../libs/session.php";
require_once __DIR__ . "/../../libs/Controller.php";

session_start();

class prestamo_pos extends Controller {

    public $view;

    function __construct() {
        parent::__construct();

        if (empty($_SESSION["id_user"])) {
            header('Location: ' . self::getURL() . 'login');
            exit();
        }

        Model::exists('user');

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
        if (isset($_SESSION['session_lifetime'])) {
            $this->view->sessionLifetime = $_SESSION['session_lifetime'];
        } else {
            $this->view->sessionLifetime = null;
        }

        $this->view->js = array('prestamo_pos/js/frontEnd.js');
        $this->view->render('prestamo_pos/index', 1);
    }
}
?>
