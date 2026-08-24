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

class monitoreo_usuarios extends Controller {

    function __construct() {
        parent::__construct();

        if (empty($_SESSION["id_user"])) {
            header('Location: ' . self::getURL() . 'login');
            exit();
        }

        // Módulo de auditoría — solo SuperAdmin.
        if ((int)($_SESSION['id_rol'] ?? 0) !== 1) {
            header('Location: ' . self::getURL() . 'dashboard');
            exit();
        }
    }

    public function index(): void {
        $this->view->js = array('monitoreo_usuarios/js/frontEnd.js');
        $this->view->render('monitoreo_usuarios/index', 1);
    }
}
?>
