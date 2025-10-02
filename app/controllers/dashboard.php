<?php
require_once __DIR__ . "/../../libs/session.php";
require_once __DIR__ . "/../../libs/Controller.php";

session_start();

class dashboard extends Controller {

    private $db;

    private $userModel; 

    function __construct() {
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database); // Ensure getInstance() returns a PgSql\Connection

        if (empty($_SESSION["id_user"])) {
            $this->db->closeConnection(); 
            header('Location: ' . self::getURL() . 'login');
            exit();
        }

       try {
            Model::exists('user');
            $this->userModel = new UserModel();
        } catch (Exception $e) {
            error_log("Error al cargar UserModel: " . $e->getMessage());
            $this->db->closeConnection();
            header('Location: ' . self::getURL() . 'login');
            exit();
        } 
        
        // Solo validar sesión si es una petición AJAX o cada 5 minutos
        $shouldValidateSession = (
            !empty($_SERVER['HTTP_X_REQUESTED_WITH']) || 
            !isset($_SESSION['last_session_check']) || 
            (time() - $_SESSION['last_session_check']) > 1800 // 30 minutos
        );
        
        if ($shouldValidateSession && isset($_SESSION['id_user']) && isset($_SESSION['session_id'])) {
            $model = new UserModel();
            if (!$model->IsSessionActuallyActive($_SESSION['session_id'], $_SESSION['id_user'])) {
                session_unset();                
                setcookie(session_name(), '', time() - 3600, '/');
                header('Location: ' . self::getURL() . 'login');
                exit();
            }
            $_SESSION['last_session_check'] = time();
        }
    }

    function index() {
        Model::exists('login');

        // Agregar sessionLifetime a la respuesta
        if (isset($_SESSION['session_lifetime'])) {
            $this->view->sessionLifetime = $_SESSION['session_lifetime'];
        } else {
            $this->view->sessionLifetime = null; // O un valor predeterminado si es necesario
        }
               
        // Obtener el ID de usuario de la sesión
        $usuario_id = Session::get('id_user');
       
        //var_dump($usuario_id, $_SESSION['session_lifetime']);
        // Validar sesiones expiradas
        $this->validataExpiresSessions($usuario_id);
    
         //Incorpora el FrontEnd Controller
      $this->view->js=array('dashboard/js/frontEnd.js');
      $this->view->render('/dashboard/index',1);
    }

    private function validataExpiresSessions($usuario_id) {
        $usuarioModel = new loginModel();
        // Obtener la fecha y hora actual
        $ahora = date('Y-m-d H:i:s');
        // Obtener las sesiones expiradas del usuario
        $expires_session = $usuarioModel->GetExpiredSessions($usuario_id, $ahora);

        if ($expires_session && $expires_session['numRows'] > 0) {
            $this->view->expired_sessions = true;
            $this->view->message = 'Su sesión está a punto de expirar.';
            $this->view->redirect = 'login';
            $this->view->usuario_id = $usuario_id;
        } else {
            $this->view->expired_sessions = false;
        }

    }
}
?>