<?php

require_once 'app/models/loginModel.php';
require_once 'app/models/userModel.php';
require_once 'app/models/emailModel.php';
require_once __DIR__ . "/../../libs/Controller.php";
require_once 'libs/database_cn.php';
require_once 'libs/View.php';
require_once 'libs/database.php';
require_once 'app/repositories/LoginRepository.php';
require_once 'app/repositories/UserRepository.php';
require_once 'app/repositories/EmailRepository.php';
require_once 'app/repositories/technicalConsultionRepository.php';
require_once __DIR__ . '/../../config/paths.php';
require_once __DIR__ . '/../Services/EmailServices.php';
require_once __DIR__ . '/../views/login/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../views/login/PHPMailer/Exception.php'; 
require_once __DIR__ . '/../views/login/PHPMailer/SMTP.php'; 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

Use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use App\Repositories\UserRepository;
use App\Repositories\LoginRepository;
use App\Repositories\technicalConsultionRepository;
use App\Repositories\EmailRepository;
use App\Services\EmailService;


class Api extends Controller {
    private $db;
    private $loginRepository; // Asegúrate de instanciarlo si lo usas en handleLogin
    private $emailService; // Define the emailService property

    private $emailRepository;


    function __construct() {
        parent::__construct();
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
        // $this->userRepository = new UserRepository(); // Instancia el UserRepository aquí si lo vas a usar
        $this->loginRepository = new LoginRepository();
        $this->emailService    = new EmailService();
        $this->emailRepository = new EmailRepository();
    }

    public function processApi($urlSegments) {
        $method = $_SERVER['REQUEST_METHOD'];

        // Enrutamiento basado en los segmentos de la URL
        if (isset($urlSegments[0])) {
            switch ($urlSegments[0]) {

                /* LOGIN */
                    case 'users':
                        // Pasar los segmentos de la URL a la función handleUsers
                        // y manejar la lógica de obtención de usuarios
                        $this->handleUsers($method, $urlSegments); 
                    break;

                    case 'login':
                        // El método POST para login puede seguir como está
                        $this->handleLogin(); 
                    break;

                    /*case 'logout':
                        // Manejo de la sesión de cierre de sesión
                        session_start();
                        session_destroy();
                        $this->response(['success' => true, 'message' => 'Sesión cerrada correctamente'], 200);
                    break;*/

                    case 'checkPass':
                        // Manejo de la verificación de contraseña
                        $this->handlePassword();
                    break;

                    case 'checkUser':
                        // Manejo de la verificación de nombre de usuario
                        $this->handleUsername();
                    break;

                    case 'checkEmail':
                        // Manejo de la verificación de correo electrónico
                        $this->handleEmail();
                    break;

                    // **NUEVO ENDPOINT PARA ENVIAR EL CORREO**
                    case 'email':
                        if (isset($urlSegments[1])) {
                            if ($urlSegments[1] === 'restore_password') {
                                if ($method === 'POST') {
                                    $this->handleRestorePassword();
                                } else {
                                    $this->response(['error' => 'Método no permitido para /api/email/restore_password'], 405);
                                }
                            } elseif ($urlSegments[1] === 'send_ticket1') {
                                if ($method === 'POST') { // Asumo que send_ticket también es POST
                                    $this->handleSendTicket1();
                                } else {
                                    $this->response(['error' => 'Método no permitido para /api/email/send_ticket1'], 405);
                                }
                            } else {
                                $this->response(['error' => 'Método de correo no encontrado: ' . $urlSegments[1]], 404);
                            }
                        } else {
                            $this->response(['error' => 'Acción de correo no especificada'], 400); // Si solo viene /api/email/
                        }
                    break;
                /*END LOGIN*/

                /*CONSULTA RIF*/ 
                    case 'SearchRif':
                        // Manejo de la búsqueda de RIF
                        $this->handleSearchRif();
                    break;

                    case 'SearchSerial':
                        // Manejo de la búsqueda de serial
                        $this->handleSearchSerial();
                    break;

                    case 'GetPhoto':
                        // Manejo de la obtención de foto
                        $this->handleGetPhoto();
                    break;

                    case 'ValidateRif':
                        $this->handleVlidateRif();
                    break;

                    case 'ValidateRif1':
                        $this->handleValidateRif1();
                    break;

                    case 'SaveDataFalla':
                        $this->handleSaveFalla1();
                    break;

                    case 'SaveDataFalla2':
                        $this->handleSaveFalla2();
                    break;

                    case 'GetPosSerials':
                        $this->handlePosSerials();
                    break;

                    case 'GetPosSerials1':
                        $this->handlePosSerials1();
                    break;

                    case 'GetUltimateTicket':
                        $this->handleGetUltimateTicket();
                    break;

                    case 'GetInstallPosDate':
                        $this->handGetInstallPosDate();
                    break;

                    case 'GetCoordinador':
                        $this->handleGetCoordinator();
                    break;

                    case 'GetFailure2':
                        $this->handleGetFailure2();
                    break;

                    case 'GetFailure1':
                        $this->handleGetFailure1();
                    break;
                /*END CONSULTA RIF*/
                default:
                    $this->response(['error' => 'Recurso no encontrado'], 404);
                break;
            }
        } else {
            $this->response(['error' => 'Recurso no especificado'], 400);
        }
    }

    private function handleLogin() {
        $username = isset($_POST['username']) ? trim($_POST['username']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';
        $password = sha1(md5($password)); // Asegúrate de que el hash sea el correcto
        $model = new LoginRepository(); // Inicializa el LoginRepository aquí

        if (!empty($username) && !empty($password)) {
            //var_dump($username, $password); // Para depuración
            $userExists = $model->GetUsernameUser($username);
            if ($userExists > 0) {
                $passwordMatch = $model->GetPasswordUser($username, $password);
                if ($passwordMatch > 0) {
                    $userData = $model->GetUserData($username, $password);
                    //var_dump($userData); // Para depuración
                    if ($userData['status'] != 3 && $userData['status'] != 4) {
                        $_SESSION["cedula"]     = $userData['cedula'];
                        $_SESSION['id_user']    = (int) $userData['id_user'];
                        $_SESSION["usuario"]    = $userData['usuario'];
                        $_SESSION["nombres"]    = $userData['nombres'];
                        $_SESSION["apellidos"]  = $userData['apellidos'];
                        $_SESSION["correo"]     = $userData['correo'];
                        $_SESSION['d_rol']      = (int) $userData['codtipousuario'];
                        $_SESSION['name_rol']   = $userData['name_rol'];
                        $_SESSION['status']     = (int) $userData['status'];
                        //var_dump($userData);
                        $session_lifetime = 300; 
                        // Ejemplo: 1200 SEGUNDO = 20 minutos en segundos
                        // Ejemplo: 1800 SEGUNDO = 30 minutos en segundos
                        // Ejemplo: 3600 SEGUNDO = 1 hora en segundos
                        // Ejemplo: 300 SEGUNDO  = 5 minutos en segundos  
                                                
                        $_SESSION['session_lifetime'] = $session_lifetime;

                        // Regenerar el ID de sesión antes de usar session_id()
                        session_regenerate_id(true);
                        // Configurar la zona horaria a Venezuela (Caracas)
                        date_default_timezone_set('America/Caracas');
                        // Generar id_session
                        $session_id = session_id();
                        $_SESSION["session_id"] = $session_id;
                        // Obtener datos adicionales
                        $start_date = date('Y-m-d H:i:s');
                        $user_agent = $_SERVER['HTTP_USER_AGENT'];
                        $ip_address = $_SERVER['REMOTE_ADDR'];
                        $active = 1;
                        $expiry_time_unix = time() + $session_lifetime;
                        $expiry_time = date('Y-m-d H:i:s', $expiry_time_unix); // Convertir a formato DATETIME

                        // Asegúrate de que GetSession en tu modelo LoginRepository tome el id_user correctamente
                        $result9 = $model->GetSession($session_id);
                        
                        if($result9 > 0){
                            $this->response([
                                'success' => false,
                                'message' => 'Ya existe una sesión activa para este usuario.',
                                'redirect' => 'login'
                            ], 409); // Código de estado 409 Conflict
                        } else {
                            $insertResult = $model->InsertSession($session_id, $start_date,  $user_agent, $ip_address, $active, $expiry_time);
                            if ($insertResult) {
                                $redirectURL = '';
                                switch ($userData['codtipousuario']) {
                                    case 1: $redirectURL = 'dashboard'; break;
                                    case 2: $redirectURL = 'dashboard2'; break;
                                    case 3: $redirectURL = 'dashboard3'; break;
                                    case 4: $redirectURL = 'dashboard4'; break;
                                    case 5: $redirectURL = 'dashboard5'; break;
                                }
                                $model->UpdateTryPassTo0($username);
                                $this->response([
                                    'success' => true,
                                    'message' => 'Inicio de sesión exitoso',
                                    'redirect' => $redirectURL,
                                    'session_lifetime' => $_SESSION['session_lifetime'],
                                    'session_id' => $_SESSION["session_id"]
                                ], 200);
                            } else {
                                $this->response(['error' => 'Error al guardar la información de la sesión'], 500);
                            }
                        }
                    } else {
                        $this->response(['success' => false, 'message' => 'Usuario inactivo o bloqueado'], 401);
                    }
                } else {
                    $model->UpdateTryPass($username);
                    $attempts = $model->GetTryPass($username);
                    if ($attempts <= 3) {
                        $this->response(['success' => false, 'message' => 'Contraseña incorrecta. Intentos restantes: ' . (3 - $attempts)], 401);
                    } else {
                        $model->UpdateStatusTo4($username);
                        $this->response(['success' => false, 'message' => 'Usuario bloqueado por intentos fallidos'], 403);
                    }
                }
            } else {
                $this->response(['success' => false, 'message' => 'Usuario no existe'], 401);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Usuario o contraseña están vacíos'], 400);
        }
    }

    private function handlePassword(){
        $username = isset($_POST['username']) ? $_POST['username'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';
        $password = sha1(md5($password)); // Asegúrate de que el hash sea el correcto
        //var_dump($password); // Para depuración
        $model = new LoginRepository(); // Inicializa el LoginRepository aquí

        if ($password != '') {
            $result = $model->GetPasswordUser( $username,$password);
            if ($result > 0) {
                $this->response(['success' => true,'message' => 'La clave coincide con el usuario', 'color'   => 'green']);
            } else {
                $this->response(['success' => false,'message' => 'No coincide con el usuario','color'=> 'red']);
            }
        } else {
            $this->response(['success' => false,'message' => 'Usuario o contraseña están vacíos','color'=> 'red']);
        }
    }

    public function handleUsername(){
        $username = isset($_POST['username']) ? $_POST['username'] : '';
        $model = new LoginRepository(); // Inicializa el LoginRepository aquí

        if($username != '') {
            $result = $model->GetUsernameUser($username);
            if ($result > 0) {
                $this->response(['success' => true, 'message' => 'Usuario Verificado', 'color'   => 'green']);
            }else{
                $this->response(['success' => false, 'message' => 'Usuario No Existe', 'color'=> 'red']);
            }
        }else{
            $this->response(['success' => false, 'message' => 'Campo vacíos', 'color'=> 'red']);
        }
    }

    public function handleEmail(){
        $email = isset($_POST['email']) ? $_POST['email'] : '';
        $model = new EmailRepository(); // Inicializa el LoginRepository aquí

        if($email != '') {
            $result = $model->GetEmailUser($email);
            if ($result > 0) {
                $this->response([ 'success' => true, 'message' => 'Correo Verificado', 'color'   => 'green']);
            }else{
                $this->response(['success' => false, 'message' => 'Correo No Existe', 'color'=> 'red']);
            }
        }else{
            $this->response(['success' => false, 'message' => 'Campo vacíos', 'color'=> 'red']);
        }
    }

    public function handleSendTicket1(){
        $model = new EmailRepository();

            $result  = $model->GetEmailCoorData();
            $email   = $result['email']; //EL GMAIL DEL COORDINADOR 
            $nombre  = $result['full_name']; // EL NOMBRE DEL COORDINADOR
            $result1 = $model->GetDataTicket1();
            $nombre_tecnico   = $result1['full_name_tecnico']; 
            $ticketId         = $result1['id_ticket'];
            $ticketfailure    = $result1['name_failure'];
            $ticketNivelFalla = $result1['id_level_failure'];
            $ticketfinished   = $result1['create_ticket'];
            $ticketstatus     = $result1['name_status_ticket'];
            $ticketprocess    = $result1['name_process_ticket'];
            $ticketaccion     = $result1['name_accion_ticket'];
            $ticketserial     = $result1['serial_pos'];

            $result2 = $model->GetClientInfo($ticketserial);
            $clientName = $result2['razonsocial'];
            $clientRif  = $result2['coddocumento'];
            
            if ($result > 0) {

                $subject = 'Notificación de Ticket Finalizado';
                $body = '
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Ticket Finalizado</title>
                    <style>
                        body {
                            font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f8f9fa;
                            padding: 30px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            margin: 0;
                        }
                        .ticket-container {
                            background-color: #fff;
                            border: 1px solid #ced4da;
                            border-radius: 10px;
                            padding: 30px;
                            max-width: 600px;
                            width: 100%;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                        }
                        .ticket-header {
                            background-color: #007bff;
                            color: #fff;
                            padding: 20px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                            margin-bottom: 25px;
                        }
                        .ticket-title {
                            font-size: 1.8em;
                            margin-bottom: 10px;
                            font-weight: bold;
                        }
                        .greeting {
                            margin-bottom: 20px;
                            color: #495057;
                            font-size: 1.1em;
                        }
                        .info-list {
                            list-style: none;
                            padding-left: 0;
                            margin-bottom: 20px;
                        }
                        .info-item {
                            margin-bottom: 12px;
                            color: #343a40;
                            font-size: 1em;
                            display: flex;
                            align-items: baseline;
                        }
                        .info-item strong {
                            font-weight: bold;
                            color: #007bff;
                            margin-right: 10px;
                            width: 150px; /* Ajusta el ancho según necesites */
                            display: inline-block;
                        }
                        .footer {
                            text-align: center;
                            margin-top: -12px;
                            color: #6c757d;
                            font-size: 0.9em;
                        }
                        .logo {
                            display: block;
                            margin: 20px auto 0;
                            max-width: 150px;
                            margin-top: -40px;
                        }
                        hr {
                            border-top: 1px solid #dee2e6;
                            margin: 20px 0;
                            margin-top: -50px;
                        }
                    </style>
                </head>
                <body>
                    <div class="ticket-container">
                        <div class="ticket-header">
                            <h2 class="ticket-title">¡Ticket Finalizado!</h2>
                        </div>
                        <p class="greeting">Hola, '.$nombre.'</p>
                        <p style="color: #495057; font-size: 1.1em; margin-bottom: 20px;">Nos complace informarle que el Técnico <strong>' . $nombre_tecnico . '</strong> ha finalizado el siguiente ticket:</p>
                        <ul class="info-list">
                            <li class="info-item"><strong>Razón Social Cliente:</strong> '.$clientName.'</li>
                            <li class="info-item"><strong>RIF Cliente:</strong> '.$clientRif.'</li>
                            <li class="info-item"><strong>Serial POS:</strong> '.$ticketserial.'</li>
                            <li class="info-item"><strong>ID del Ticket:</strong> '.$ticketId.'</li>
                            <li class="info-item"><strong>Falla:</strong> '.$ticketfailure.'</li>
                            <li class="info-item"><strong>Nivel Falla:</strong> '.$ticketNivelFalla.'</li>
                            <li class="info-item"><strong>Fecha de Finalización:</strong> '.$ticketfinished.'</li>
                            <li class="info-item"><strong>Estatus:</strong> '.$ticketstatus.'</li>
                            <li class="info-item"><strong>Proceso de:</strong> '.$ticketprocess.'</li>
                            <li class="info-item"><strong>Acción:</strong> '.$ticketaccion.'</li>
                        </ul>
                        <p><a href="localhost/SoportePost/consulta_rif" style="color: #007bff; text-decoration: none;">Ver el historial completo del ticket</a></p>
                        <hr>
                        <p class="footer" >Atentamente,</p>
                        <p class="footer">El equipo de InteliSoft</p>
                        ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo">' : '') . '
                    </div>
                </body>
                </html>
                ';
                $embeddedImages = [];
                if (defined('FIRMA_CORREO')) {
                    $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
                }

                if ($this->emailService->sendEmail($email, $subject, $body, [], $embeddedImages)){
                    $this->response(['success' => true, 'message' => 'Se ha enviado un código de restablecimiento a su correo electrónico.', 'color' => 'green']);
                } else {
                    $this->response(['success' => false, 'message' => 'Error al enviar el correo.', 'color' => 'red']);
                }
            } else {
            $this->response(['success' => false, 'message' => 'Correo No Existe', 'color'=> 'red']);
        }
    }

    public function handleRestorePassword(){
        $email = isset($_POST['email']) ? $_POST['email'] : '';
        $model = new EmailRepository();

        if($email != '') {
            $result  = $model->GetEmailUserData($email);
            $nombre = $result;
            if ($result > 0) {
                // Generar código
                $longitud = 6;
                $caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                $codigo = '';
                for ($i = 0; $i < $longitud; $i++) {
                    $codigo .= $caracteres[rand(0, strlen($caracteres) - 1)];
                }

                $subject = 'Restablece tu contraseña';
                $body = '
                    <h2 style = "color: #3f85ff; font-size: 23px; text-align: center; margin-bottom: 20px;">Restablecer Contraseña</h2>
                    <strong><p style = " margin-bottom: 15px;">Hola, '.$nombre.'</p></strong>
                    <strong><p>Recibimos una solicitud para restablecer tu contraseña.</p></strong>
                    <strong><p>Para restablecer tu contraseña, utiliza el siguiente código: <span style = "background-color: #3f85ff; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 3.2em; text-align: center; margin: 22px auto; width: 200px; height: 50px; display: block; width: fit-content; border: 1px solid #000000;" class = "code">'.$codigo.'</span></p><strong>
                    <p style = "text-align: center; color: red; font-size: 0.9em;">Este código será su contraseña. Cambie nuevamente al iniciar Sesión.</p>
                    <p style = "text-align: center; color: #777; font-size: 0.9em;">ATT: InteliSoft</p>';

                $embeddedImages = [];
                if (defined('FIRMA_CORREO')) {
                    $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
                    $body .= '<img src="cid:imagen_adjunta" alt="Logo de la empresa" style="display: block; margin: 0 auto; width: 150px;">';
                }

                if ($this->emailService->sendEmail($email, $subject, $body, [], $embeddedImages)) {
                    $model->ChangePassForCode($email, $codigo);
                    $model->UpdateStatusTo1($email);
                    $model->UpdateTimePass($email);
                    $this->response(['success' => true, 'message' => 'Se ha enviado un código de restablecimiento a su correo electrónico.', 'color' => 'green']);
                } else {
                    $this->response(['success' => false, 'message' => 'Error al enviar el correo.', 'color' => 'red']);
                }

            } else {
                $this->response(['success' => false, 'message' => 'Correo No Existe', 'color'=> 'red']);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Campo vacíos', 'color'=> 'red']);
        }
    }


    private function response($data, $status = 200) {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit();
    }

    function handleUsers($method, $urlSegments) {
        // var_dump($model); // Para depuración     
        switch ($method) {
            case 'GET':
                if (isset($urlSegments[1]) && is_numeric($urlSegments[1])) {
                    $this->GetUserById($urlSegments[1]); // Obtener usuario por ID
                } else {
                    $this->getAllUsers(); // Obtener todos los usuarios
                }
                break;
            default:
                $this->response(['error' => 'Método no permitido para /api/users'], 405);
                break;
        }
    }

    function getAllUsers() {
        $model = new UserRepository();
        $users = $model->getAllUsers(); // Obtiene el array de usuarios directamente
    
        if ($users !== null) {
            echo json_encode($users);
        } else {
            $this->response(['error' => 'Error al obtener los usuarios'], 500);
        }
    }

    function GetUserById($id) {
        $model = new UserRepository();
        $user = $model->GetUserById($id);
        if ($user !== null) {
            echo json_encode($user);
        } else {
            $this->response(['error' => 'Usuario no encontrado'], 404);
        }
    }
    
    public function handleSearchRif(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $model = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        $result = $model->SearchRif($rif);

        if (!empty($result)) {
            $this->response(['success' => true, 'rif' => $result], 200);
        } else {
            $this->response([ 'success' => false, 'message' => 'No se encontraron usuarios'], status: 404);
        }
    }

    public function handleSearchSerial(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $model = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        $result = $model->SearchSerial($serial);
        //var_dump($result);

        if (!empty($result)) {
            $this->response([ 'success' => true, 'serial' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontraron usuarios'], 404);
        }
    }

    public function handleGetPhoto(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $model = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        $result = $model->SearchtypePos($serial);
        if ($result !== false) {
            $codmodelopos = $result;
            //var_dump($codmodelopos);

            /*  AGREGAR CSS */
            $claseImagen = "imagen-predeterminada"; // Valor predeterminado
            switch ($codmodelopos) {
                case 1:
                    $nombreArchivo = "ingenico-ict220.png";
                    $claseImagen = "ingenico-ict220";
                break;

                case 2:
                    $nombreArchivo = "ingenico-ict250.png";
                    $claseImagen = "ingenico-ict250";
                break;

                case 3:
                    $nombreArchivo = "ingenico-iwl220.png";
                    $claseImagen = "ingenico-iwl220";
                break;

                case 11:
                    $nombreArchivo = "move-2500.png";
                    $claseImagen = "move-2500";
                break;

                case 14:
                    $nombreArchivo = "sunmi-P2.png";
                    $claseImagen = "sunmi-P2";
                break;

                case 15:
                    $nombreArchivo = "sunmi-P2mini.png";
                    $claseImagen = "sunmi-P2mini";
                break;

                case 17:
                    $nombreArchivo = "sunmi-P2SE.png";
                    $claseImagen = "sunmi-P2SE";
                break;

                case 22:
                    $nombreArchivo = "Kozen-P10.png";
                    $claseImagen = "Kozen-P10";
                break;

                default:
                $nombreArchivo = "mantainment.png";

                break;
            }
            /* ENDF AGREGAR CSS */

            $rutaImagen = __DIR__ . "/../public/img/consulta_rif/POS/" . $nombreArchivo; // Ruta absoluta
            $tipoImagen = mime_content_type($rutaImagen);
            $datosImagen = file_get_contents($rutaImagen);
            $imagenBase64 = base64_encode($datosImagen);
            $srcImagen = "data:" . $tipoImagen . ";base64," . $imagenBase64;

            $this->response(['success' => true, 'id_tipopos' => $codmodelopos, 'rutaImagen' => $srcImagen, 'claseImagen' => $claseImagen ], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener el tipo del POS'], 404);
        }
    }

    public function handleVlidateRif(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $model = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        if ($rif != '') {
            $result = $model->VerifingClient($rif);

            if ($result) {
                $this->response(['success' => true, 'message' => 'El RIF Verificado', 'color' => 'green', 'rif' => $result]);
            } else {
                $this->response(['success' => false, 'message' => 'El RIF No Existe', 'color'=> 'red'], 404);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error: RIF no proporcionado', 'color'=> 'red'], 400); // Puedes usar 400 Bad Request para este caso
        }
    }

    public function handleValidateRif1(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $model = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        if ($rif != '') {
            $result = $model->VerifingClient($rif);

            if ($result) {
                $this->response(['success' => true, 'message' => 'El RIF Verificado', 'color' => 'green', 'rif' => $result]);
            } else {
                $this->response(['success' => false, 'message' => 'El RIF No Existe', 'color'=> 'red'], 404);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error: RIF no proporcionado', 'color'=> 'red'], 400); // Puedes usar 400 Bad Request para este caso
        }
    }

    public function handleSaveFalla1(){
        $id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : '';
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $falla = isset($_POST['falla']) ? $_POST['falla'] : '';
        $nivelFalla = isset($_POST['nivelFalla']) ? $_POST['nivelFalla'] : '';
        $model = new technicalConsultionRepository(); // Inicializa el repositorio
        //var_dump($id_user, $serial, $falla, $nivelFalla);
        if($serial != '' && $falla != '' && $nivelFalla != ''){     
            $result = $model->SaveDataFalla($serial, $falla, $nivelFalla, $id_user);
            //var_dump($result); // Para depuración
            if ($result) {
                $this->response(['success' => true, 'message' => 'Se guardaron los datos del Ticket correctamente.'], 200); // Código de estado 200 OK por defecto
            } else {
                $this->response(['success' => false, 'message' => 'Error al guardar los datos de falla.'], 500); // Código de estado 500 Internal Server Error
            }
        } else{
            $this->response(['success'=> false, 'message'=> 'Hay un campo vacio.'], 400); // Código de estado 400 Bad Request
        }
    }

    public function handleSaveFalla2(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $descripcion = isset($_POST['descrpFailure']) ? $_POST['descrpFailure'] : '';
        $coordinador = isset($_POST['coordinador']) ? $_POST['coordinador'] : '';
        $nivelFalla = isset($_POST['nivelFalla']) ? $_POST['nivelFalla'] : '';
        $id_status_payment = isset($_POST['id_status_payment']) ? $_POST['id_status_payment'] : '';
        $rutaEnvio = null;
        $rutaExo = null;
        $rutaAnticipo = null;
    
        $model = new technicalConsultionRepository(); // Inicializa el repositorio
    
        if (!empty($serial)) {
            if (!empty($descripcion)) {
                if (!empty($coordinador)) {
                    // Guardar archivo de envío
                    if (isset($_FILES['archivoEnvio']) && $_FILES['archivoEnvio']['error'] === UPLOAD_ERR_OK) {
                        $archivo = $_FILES['archivoEnvio'];
                        $nombreArchivo = uniqid() . '_' . $archivo['name'];
                        $rutaArchivo = 'C:\\Users\\Airan Bracamonte\\Downloads\\' . $nombreArchivo; // Reemplaza con tu ruta
    
                        if (move_uploaded_file($archivo['tmp_name'], $rutaArchivo)) {
                            $rutaEnvio = $rutaArchivo;
                        } else {
                            $this->response(['success' => false, 'message' => 'Error al guardar el archivo de envío.'], 500);
                            return;
                        }
                    }
    
                    // Guardar archivo de exoneración (si se envió)
                    if (isset($_FILES['archivoExoneracion']) && $_FILES['archivoExoneracion']['error'] === UPLOAD_ERR_OK) {
                        $archivoExo = $_FILES['archivoExoneracion'];
                        $nombreArchivoExo = uniqid() . '_' . $archivoExo['name'];
                        $rutaArchivoExo = 'C:\\Users\\Airan Bracamonte\\Downloads\\' . $nombreArchivoExo; // Reemplaza con tu ruta
    
                        if (move_uploaded_file($archivoExo['tmp_name'], $rutaArchivoExo)) {
                            $rutaExo = $rutaArchivoExo;
                        } else {
                            $this->response(['success' => false, 'message' => 'Error al guardar el archivo de exoneración.'], 500);
                            return;
                        }
                    }
    
                    // Guardar archivo de anticipo (si se envió)
                    if (isset($_FILES['archivoAnticipo']) && $_FILES['archivoAnticipo']['error'] === UPLOAD_ERR_OK) {
                        $archivoAnticipo = $_FILES['archivoAnticipo'];
                        $nombreArchivoAnticipo = uniqid() . '_' . $archivoAnticipo['name'];
                        $rutaArchivoAnticipo = 'C:\\Users\\Airan Bracamonte\\Downloads\\' . $nombreArchivoAnticipo; // Reemplaza con tu ruta
    
                        if (move_uploaded_file($archivoAnticipo['tmp_name'], $rutaArchivoAnticipo)) {
                            $rutaAnticipo = $rutaArchivoAnticipo;
                        } else {
                            $this->response(['success' => false, 'message' => 'Error al guardar el archivo de anticipo.'], 500);
                            return;
                        }
                    }
    
                    $result = $model->SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaEnvio, $id_status_payment, $rutaExo, $rutaAnticipo);
    
                    if ($result) {
                        $this->response(['success' => true, 'message' => 'Datos guardados con éxito.'], 200);
                    } else {
                        $this->response(['success' => false, 'message' => 'Error al guardar los datos de la falla.'], 500);
                    }
                } else {
                    $this->response(['success' => false, 'message' => 'El campo Coordinador no puede estar vacío.'], 400);
                }
            } else {
                $this->response(['success' => false, 'message' => 'El campo Descripción de la Falla no puede estar vacío.'], 400);
            }
        } else {
            $this->response(['success' => false, 'message' => 'El campo Serial no puede estar vacío.'], 400);
        }
    }

    public function  handlePosSerials(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $model = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($rif != '') {
            $result = $model->GetPosSerialsByRif($rif); // Llama a la función del modelo
            if ($result) {
                $this->response(['success' => true, 'serials' => $result], 200); // Devuelve el array de seriales
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron seriales para el RIF proporcionado.', 'serials' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'RIF no proporcionado.', 'serials' => []], 400); // Código de estado 400 Bad Request
        }
    }

    public function handlePosSerials1(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $model = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($rif != '') {
            $result = $model->GetPosSerialsByRif($rif); // Llama a la función del modelo
            if ($result) {
                $this->response(['success' => true, 'serials' => $result], 200); // Devuelve el array de seriales
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron seriales para el RIF proporcionado.', 'serials' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'RIF no proporcionado.', 'serials' => []], 400); // Código de estado 400 Bad Request
        }
    }

    public function handleGetUltimateTicket(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $model = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($serial != '') {
            $result = $model->UltimateDateTicket($serial);

            $this->response(['success' => true, 'fecha' => $result], 200); // Código de estado 200 OK por defecto
        } else {
            $this->response(['success' => true, 'message' => 'No tiene ticket', 'fecha' => null], 400); // Código de estado 200 OK
        }
    }

    public function handGetInstallPosDate(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';

        $model = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($serial != '') {
            $result = $model->InstallDatePOS($serial);

            $this->response(['success' => true, 'fecha' => $result], 200); // Código de estado 200 OK por defecto
        } else {
            $this->response(['success' => true, 'message' => 'No tiene ticket', 'fecha' => null], 400);
        }
    }
    
    public function handleGetCoordinator(){
        $model = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $model->GetCoordinator();
    
        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'coordinadores' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay coordinadores disponibles o No ha seleccionado ningun coordinador'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los coordinadores'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }

    public function handleGetFailure2(){
        $model = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $model->GetFailure2();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'failures' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay fallas disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener las fallas'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar una falla']);
    }

    public function handleGetFailure1(){
        $model = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $model->GetFailure1();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'failures' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay fallas disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener las fallas'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar una falla']); 
    }
}
?>