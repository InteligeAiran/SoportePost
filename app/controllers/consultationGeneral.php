<?php
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