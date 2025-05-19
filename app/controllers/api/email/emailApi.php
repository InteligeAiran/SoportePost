<?php
namespace App\Controllers\Api\email; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/View.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../repositories/EmailRepository.php';
require_once __DIR__ . '/../../../Services/EmailServices.php';
require_once __DIR__ . '/../../../views/login/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../../../views/login/PHPMailer/Exception.php'; 
require_once __DIR__ . '/../../../views/login/PHPMailer/SMTP.php'; 
require_once __DIR__ . '/../../../../config/paths.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

Use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use App\Repositories\EmailRepository;
use Controller;
use DatabaseCon;
use App\Services\EmailService;


class email extends Controller {
    private $db;
    private $emailService; // Service for handling email operations

    function __construct() {
        parent::__construct();
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
        $this->emailService = new EmailService(); // Initialize the email service
    }

    public function processApi($urlSegments) {
        $method = $_SERVER['REQUEST_METHOD'];
        if (isset($urlSegments[1])) {
            $action = $urlSegments[1];
            switch ($action) {
                case 'checkEmail':
                    // Manejo de la verificación de correo electrónico
                    $this->handleEmail();
                break;

                case 'resetPassword':
                        // Manejo del login
                    $this->handleRestorePassword();
                break;

                case'send_ticket1':
                    // Manejo del envío de ticket
                    $this->handleSendTicket1();
                break;

                case 'send_ticket2':
                    // Manejo del envío de ticket
                    $this->handleSendTicket2();
                break;

                case 'consultationHistorial':
                    $this->handleconsultationHistorial();
                break;

                case 'GetImageExo':
                    if ($method === 'GET') {
                        //var_dump($_POST); // Para depuración
                        $this->handleGetImageExo();
                    } else {
                        $this->response(['error' => 'Método no permitido para /api/GetImageExo'], 405);
                    }
                break;

                default:
                    $this->response(['error' => 'Acción no encontrada en email'], 404);
                break;
            }
        } else {
            $this->response(['error' => 'Acción no especificada en email'], 400);
        }
    }

    // Mueve aquí todas tus funciones handleSearchRif, handleSearchSerialData, etc.
    // Asegúrate de que utilicen las propiedades de la clase ($this->db, etc.)
    // Ejemplo:
    
    private function response($data, $status = 200) {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit();
    }

   public function handleEmail(){
        $email = isset($_POST['email']) ? $_POST['email'] : '';
        $repository = new EmailRepository(); // Inicializa el LoginRepository aquí

        if($email != '') {
            $result = $repository->GetEmailUser($email);
            if ($result > 0) {
                $this->response([ 'success' => true, 'message' => 'Correo Verificado', 'color'   => 'green']);
            }else{
                $this->response(['success' => false, 'message' => 'Correo No Existe', 'color'=> 'red']);
            }
        }else{
            $this->response(['success' => false, 'message' => 'Campo vacíos', 'color'=> 'red']);
        }
    }

    public function handleRestorePassword(){
        $email = isset($_POST['email']) ? $_POST['email'] : '';
        $repository = new EmailRepository();

        if($email != '') {
            $result  = $repository->GetEmailUserData($email);
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
                    $repository->ChangePassForCode($email, $codigo);
                    $repository->UpdateStatusTo1($email);
                    $repository->UpdateTimePass($email);
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

    public function handleSendTicket1(){
        $repository = new EmailRepository();

            $result  = $repository->GetEmailCoorData();
            $email   = $result['email']; //EL GMAIL DEL COORDINADOR 
            $nombre  = $result['full_name']; // EL NOMBRE DEL COORDINADOR
            $result1 = $repository->GetDataTicket1();
            $nombre_tecnico   = $result1['full_name_tecnico']; 
            $ticketNivelFalla = $result1['id_level_failure'];
            $ticketfinished   = $result1['create_ticket'];
            $ticketstatus     = $result1['name_status_ticket'];
            $ticketprocess    = $result1['name_process_ticket'];
            $ticketaccion     = $result1['name_accion_ticket'];
            $ticketserial     = $result1['serial_pos'];

            $result2 = $repository->GetClientInfo($ticketserial);
          //$clientName = $result2['razonsocial'];
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
                            background-color: #003594;
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
                            <li class="info-item"><strong>RIF Cliente:</strong> '.$clientRif.'</li>
                            <li class="info-item"><strong>Serial POS:</strong> '.$ticketserial.'</li>
                            <li class="info-item"><strong>Nivel Falla:</strong> '.$ticketNivelFalla.'</li>
                            <li class="info-item"><strong>Fecha de Finalización:</strong> '.$ticketfinished.'</li>
                            <li class="info-item"><strong>Estatus:</strong> '.$ticketstatus.'</li>
                            <li class="info-item"><strong>Acción:</strong> '.$ticketaccion.'</li>
                        </ul>
                            <p><a href="http://10.225.1.136/SoportePost/consultationGeneral?Serial='.$ticketserial.'&Proceso='.$ticketprocess.'" style="color: #007bff; text-decoration: none; ">Ver el historial completo del ticket</a></p>
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
                    $this->response(['success' => true, 'message' => 'Se ha enviado un   Aviso a su correo electrónico.', 'color' => 'green']);
                } else {
                    var_dump($email, $subject, $body);

                    $this->response(['success' => false, 'message' => 'Error al enviar el correo.', 'color' => 'red']);
                }
            } else {
            $this->response(['success' => false, 'message' => 'Correo No Existe', 'color'=> 'red']);
        }
    }

    public function handleSendTicket2(){
        $repository = new EmailRepository();
        $id_coordinador = isset($_POST['id_coordinador']) ? $_POST['id_coordinador'] : '';
           // var_dump($id_coordinador);
            $result  = $repository->GetEmailCoorDataById($id_coordinador);
            $email   = $result['email']; //EL GMAIL DEL COORDINADOR
            $nombre  = $result['full_name']; // EL NOMBRE DEL COORDINADOR
            $result1 = $repository->GetDataTicket2();
            $nombre_tecnico   = $result1['full_name_tecnico']; 
            $ticketNivelFalla = $result1['id_level_failure'];
            $ticketfinished   = $result1['create_ticket'];
            $ticketstatus     = $result1['name_status_ticket'];
            $ticketprocess    = $result1['name_process_ticket'];
            $ticketaccion     = $result1['name_accion_ticket'];
            $ticketserial     = $result1['serial_pos'];

            $result2 = $repository->GetClientInfo($ticketserial);
            $clientName = $result2['razonsocial'];
            $clientRif  = $result2['coddocumento'];
            
            if ($result > 0) {

                $subject = 'Notificación de Ticket Asignado';
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
                            background-color: #003594;
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
                            <h2 class="ticket-title">¡Ticket Asignado!</h2>
                        </div>
                        <p class="greeting">Hola, '.$nombre.'</p>
                        <p style="color: #495057; font-size: 1.1em; margin-bottom: 20px;">Nos complace informarle que el Técnico <strong>' . $nombre_tecnico . '</strong> Te ha asignado el siguiente ticket:</p>
                        <ul class="info-list">
                            <li class="info-item"><strong>RIF Cliente:</strong> '.$clientRif.'</li>
                            <li class="info-item"><strong>Nombre Cliente:</strong> '.$clientName.'</li>
                            <li class="info-item"><strong>Serial POS:</strong> '.$ticketserial.'</li>
                            <li class="info-item"><strong>Nivel Falla:</strong> '.$ticketNivelFalla.'</li>
                            <li class="info-item"><strong>Fecha de Finalización:</strong> '.$ticketfinished.'</li>
                            <li class="info-item"><strong>Estatus:</strong> '.$ticketstatus.'</li>
                            <li class="info-item"><strong>Acción:</strong> '.$ticketaccion.'</li>
                        </ul>
                            <p><a href="http://10.225.1.136/SoportePost/consultationGeneral?Serial='.$ticketserial.'&Proceso='.$ticketprocess.'" style="color: #007bff; text-decoration: none; ">Ver el historial completo del ticket</a></p>
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

    public function handleconsultationHistorial(): void{
        $serial  = isset($_POST['serial']) ? $_POST['serial'] : '';
        $proceso = isset($_POST['proceso']) ? $_POST['proceso'] : '';
        $repository   = new EmailRepository(); // Inicializa el repositorio
        $result  = $repository->GetDataTicketConCliente(); // Llama a la función del repositoryo
   
        if ($serial != '' && $proceso != '') {
            if($result){
                $this->response(['success' => true, 'data' => $result], 200); 
            }else{
                $this->response(['success' => false, 'message' => 'No se encontraron datos', 'historial' => []], 404); // Código de estado 404 Not Found
            }
        }else{
            $this->response(['success' => false, 'message' => 'Hay campos vacios'], 400); // Código de estado 404 Not Found
        }
    }

    private function handleGetImageExo() {
        $imageId = $_GET['id'];
        $emailRepository = new EmailRepository();
        $imagenData = $emailRepository->GetDataImage($imageId);
    
        if ($imagenData && isset($imagenData['exo']) && isset($imagenData['mime_type'])) {
            $base64Data = $imagenData['exo']; // Ya está en Base64
            $mimeType = $imagenData['mime_type'];
            $dataURI = 'data:' . $mimeType . ';base64,' . $base64Data;
                    //var_dump($imagenData); // Para depuración

    
                    header('Content-Type: ' . $imagenData['mime_type']); // Asegúrate de que esta línea se ejecute
                    echo $dataURI;
            exit();
        } else {
            $this->response(['success' => false, 'message' => 'Datos de imagen no encontrados en la base de datos'], 404);
        }
    }
    // ... otras funciones handleSearchSerialData, etc.
}
?>