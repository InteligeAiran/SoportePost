<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
class consultationGeneral extends Controller {
        public $view;

    function __construct() {
        parent::__construct();
    }

    public function index(): void {
        session_start();;
        Model::exists('consultationGeneral');

        // Incorporates the FrontEnd Controller
        $this->view->js = array('consultationGeneral/js/frontEnd.js');
        $this->view->render('consultationGeneral/index', 1);
    }
}
?>