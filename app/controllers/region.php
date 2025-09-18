<?php
require_once __DIR__ . "/../../libs/session.php";
require_once __DIR__ . "/../../libs/Controller.php";

session_start();


class region extends Controller {
    public $view;

    public $userModel;

    function __construct() {
        parent::__construct();

        if (empty($_SESSION["id_user"])) {
            // Redirigir siempre con header para evitar respuestas vacías
            header('Location: ' . self::getURL() . 'login');
            exit();
        }

        Model::exists('user'); // Si Model::exists() carga la clase, esto es bueno.
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
            header('Location: ' . self::getURL() . 'login');
            exit();
        }
    }

    public function index(): void {
        Model::exists('consulta_rif');
        Model::exists('login');

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
        $this->view->js = array('gestion_regions/js/frontEnd.js');
        $this->view->render('gestion_regions/index', 1);
    }

    private function validataExpiresSessions($usuario_id) {
        $usuarioModel = new loginModel();
        // Obtener la fecha y hora actual
        $ahora = date('Y-m-d H:i:s');
        // Obtener las sesiones expiradas del usuario
        $expires_session = $usuarioModel->GetExpiredSessions($usuario_id, $ahora);

        // Verificar si hay sesiones expiradas
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