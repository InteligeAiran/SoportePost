<?php
class consultationGeneral extends Controller {
        public $view;

    function __construct() {
        parent::__construct();
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
        session_start();;
        Model::exists('consultationGeneral');

        // Incorporates the FrontEnd Controller
        $this->view->js = array('consultationGeneral/js/frontEnd.js');
        $this->view->render('consultationGeneral/index', 1);
    }
}
?>