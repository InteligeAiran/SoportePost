<?php
class Dashboard extends Controller {
        public $view;

    public function __construct() {
        parent::__construct();
    }

    public function index(): void {
        session_start();
        Model::exists('dashboard');

        // Incorporates the FrontEnd Controller
        $this->view->js = array('SuperAdmin/dashboard/js/frontEnd.js');
        $this->view->render('SuperAdmin/dashboard/index', 1);
    }
}
?>
