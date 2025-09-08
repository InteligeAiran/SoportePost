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

                case 'send_end_ticket':
                    // Manejo del envío de ticket final
                    $this->handleSendEndTicket();
                break;

                case 'send_devolution_ticket':
                    // Manejo del envío de ticket de devolución
                    $this->handleSendDevolutionTicket();
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

                case 'send_reject_document':
                    // Manejo del envío de ticket de rechazo de documento
                    $this->handleSendRejectDocument();
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

    public function handleSendTicket1() {
        $repository = new EmailRepository();

        // 1. Get Coordinator's Data
        $result = $repository->GetEmailCoorData();
        $email_coordinator = $result['email'];
        $nombre_coordinator = $result['full_name'];

        // 2. Get Ticket Data
        $result1 = $repository->GetDataTicket1();
        $nombre_tecnico_ticket = $result1['full_name_tecnico']; // Name of the technician as stored in the ticket
        $ticketNivelFalla = $result1['id_level_failure'];
        $name_failure = $result1['name_failure'];
        $ticketfinished = $result1['create_ticket'];
        $ticketstatus = $result1['name_status_ticket'];
        $ticketprocess = $result1['name_process_ticket'];
        $ticketaccion = $result1['name_accion_ticket'];
        $ticketserial = $result1['serial_pos'];
        $ticketnro = $result1['nro_ticket'];
        // 3. Get Client Information
        $result2 = $repository->GetClientInfo($ticketserial);
        $clientRif = $result2['coddocumento'];

        // 4. Get Technician's Email and Full Name from User Data (using their ID)
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $result_tecnico = $repository->GetEmailUserDataById($id_user);
        $email_tecnico = $result_tecnico['user_email'];
        $nombre_tecnico_full = $result_tecnico['full_name']; // Full name of the technician from their user profile

        // Check if we have essential data for both
        if (($result > 0 && !empty($email_coordinator)) && ($result_tecnico && !empty($email_tecnico))) {

            $subject = 'Notificación de Ticket Finalizado';

            // Base HTML structure for the email
            $base_body_html = '
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
                        background-color: #0035F6;
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
                        width: 150px;
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
                    <p class="greeting">Hola, [NOMBRE_DESTINATARIO]</p>
                    <p style="color: #495057; font-size: 1.1em; margin-bottom: 20px;">[MENSAJE_PRINCIPAL]</p>
                    <ul class="info-list">
                        <li class="info-item"><strong>Nro. Ticket:</strong> ' . $ticketnro . '</li>
                        <li class="info-item"><strong>RIF Cliente:</strong> ' . $clientRif . '</li>
                        <li class="info-item"><strong>Serial POS:</strong> ' . $ticketserial . '</li>
                        <li class="info-item"><strong>Nivel Falla:</strong> ' . $ticketNivelFalla . '</li>
                        <li class="info-item"><strong>Falla: </strong> ' . $name_failure . '</li>
                        <li class="info-item"><strong>Fecha de Cierre:</strong> ' . $ticketfinished . '</li>
                        <li class="info-item"><strong>Estatus:</strong><span style=" color: red;">' . $ticketstatus . '</li></span>
                        <li class="info-item"><strong>Acción:</strong> ' . $ticketaccion . '</li>
                    </ul>
                    <p><a href="http://localhost/SoportePost/consultationGeneral?Serial=' . $ticketserial . '&Proceso=' . $ticketprocess . '&id_level_failure=' . $ticketNivelFalla . '" style="color: #007bff; text-decoration: none; ">Ver el historial completo del ticket</a></p>
                    <hr>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="link-button" style = "color: white;">
                            Ver Detalles del Ticket
                        </a>
                    </p>

                    ' . (defined('FIRMA_CORREO') ? '<div class="logo-container"><img style = "margin-left: 28%; margin-top: 3%;" src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo"></div>' : '') . '

                    <div class="footer" style = "margin-top: -9%; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                        <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                        <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            ';

            $embeddedImages = [];
            if (defined('FIRMA_CORREO')) {
                $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
            }

            // --- Send Email to Coordinator ---
            $message_coordinator = 'Nos complace informarle que el Técnico <strong>' . $nombre_tecnico_ticket . '</strong> ha finalizado el siguiente ticket:';
            $body_coordinator = str_replace(
                ['[NOMBRE_DESTINATARIO]', '[MENSAJE_PRINCIPAL]'],
                [$nombre_coordinator, $message_coordinator],
                $base_body_html
            );

            $coordinator_email_sent = $this->emailService->sendEmail($email_coordinator, $subject, $body_coordinator, [], $embeddedImages);

            // --- Send Email to Technician ---
            $message_tecnico = 'Le informamos que ha cerrado exitosamente el siguiente ticket:';
            $body_tecnico = str_replace(
                ['[NOMBRE_DESTINATARIO]', '[MENSAJE_PRINCIPAL]'],
                [$nombre_tecnico_full, $message_tecnico],
                $base_body_html
            );

            $tecnico_email_sent = $this->emailService->sendEmail($email_tecnico, $subject, $body_tecnico, [], $embeddedImages);

            // --- Handle Responses ---
            if ($coordinator_email_sent && $tecnico_email_sent) {
                $this->response(['success' => true, 'message' => 'Se ha enviado un aviso a los correos electrónicos del coordinador y del técnico.', 'color' => 'green']);
            } elseif ($coordinator_email_sent) {
                $this->response(['success' => false, 'message' => 'El correo al coordinador se envió correctamente, pero hubo un error al enviar el correo al técnico.', 'color' => 'orange']);
            } elseif ($tecnico_email_sent) {
                $this->response(['success' => false, 'message' => 'El correo al técnico se envió correctamente, pero hubo un error al enviar el correo al coordinador.', 'color' => 'orange']);
            } else {
                $this->response(['success' => false, 'message' => 'Hubo un error al enviar los correos electrónicos al coordinador y al técnico.', 'color' => 'red']);
            }

        } else {
            $this->response(['success' => false, 'message' => 'No se pudo obtener la información necesaria (correo del coordinador o del técnico).', 'color' => 'red']);
        }
    }

    public function handleSendTicket2() {
            $repository = new EmailRepository(); // Inicialización aquí si no se hace en el constructor

            // 1. Obtener ID del coordinador desde el POST y sus datos
            $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';

            // EMAIL DEL AREA
            $result_email_area = $repository->GetEmailArea();

            // Si no se encuentra información del coordinador, no podemos continuar
            if (!$result_email_area) {
                $this->response(['success' => false, 'message' => 'Correo del coordinador no existe o no se encontraron datos.', 'color' => 'red']);
                return; // Salir de la función
            }

            $email_area = $result_email_area['email_area']; // El Gmail del AREA
            $nombre_area = $result_email_area['name_area']; // El nombre del AREA

            // 2. Obtener datos del ticket
            $result_ticket = $repository->GetDataTicket2();
            // Verifica si se obtuvieron datos del ticket. Si no, algo anda mal.
            if (!$result_ticket) {
                $this->response(['success' => false, 'message' => 'No se encontraron datos del ticket.', 'color' => 'red']);
                return;
            }

            $nombre_tecnico_ticket = $result_ticket['full_name_tecnico'];
            $ticketNivelFalla = $result_ticket['id_level_failure'];
            $name_failure = $result_ticket['name_failure'];
            $ticketfinished = $result_ticket['create_ticket'];
            $ticketstatus = $result_ticket['name_status_ticket'];
            $ticketprocess = $result_ticket['name_process_ticket'];
            $ticketaccion = $result_ticket['name_accion_ticket'];
            $ticketserial = $result_ticket['serial_pos'];
            $ticketnro = $result_ticket['nro_ticket'] ?? 'N/A'; // Asegúrate de que este campo exista en tu base de datos
            $ticketpaymnet = $result_ticket['name_status_payment'];

            // Funcion para obtener el id del ticket con el nro de ticket
            $resultgetid_ticket = $repository->GetTicketId($ticketnro);
            $ticketid = $resultgetid_ticket['get_ticket_id'];

            // Funcion para obtener el nobre de la coordinacion por el id_ticket
            $resultCoordinacion = $repository->GetCoordinacion($ticketid);
            $name_coordinador = $resultCoordinacion['get_department_name']?? 'N/A';

            $embeddedImages = [];
            if (defined('FIRMA_CORREO')) {
                $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
            }

            // 3. Obtener información del cliente
            $result_client = $repository->GetClientInfo($ticketserial);
            $clientName = $result_client['razonsocial'] ?? 'N/A'; // Usar null coalescing para seguridad
            $clientRif = $result_client['coddocumento'] ?? 'N/A';

           $subject_coordinador = 'Notificación de Ticket Asignado';
           $body_coordinador = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Notificación de Ticket</title>
                <style>
                    /* Estilos generales para compatibilidad */
                    body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
                    .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-top: 5px solid #0035F6; }
                    .header { text-align: center; padding-bottom: 20px; }
                    .header h1 { color: #0035F6; font-size: 24px; margin: 0; }
                    .ticket-info { margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; }
                    .info-row { margin-bottom: 15px; }
                    .info-label { color: #555; font-weight: bold; width: 140px; display: inline-block; }
                    .info-value { color: #333; }
                    .status-badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-weight: bold; color: #fff; text-align: center; }
                    .status-badge-open { background-color: #007bff; }
                    .status-badge-proceso { background-color: #28a745; }
                    .status-badge-closed { background-color: #dc3545; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
                    .link-button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Nueva Asignación de Ticket</h1>
                        <p style="color: #666; font-size: 16px; margin: 10px 0 0;">Hola, <strong><span style="color: black;">Gerencia de ' . htmlspecialchars($nombre_area) . '</strong></span>.</p>
                    </div>
                    <p style="color: #444; font-size: 15px; line-height: 1.6;">
                        El técnico u operador <strong><span style="color: black;">' . htmlspecialchars($nombre_tecnico_ticket) . '</strong></span> ha creado el siguiente ticket para su gestión.
                    </p>
                    
                    <div class="ticket-info">
                        <div class="info-row">
                            <span class="info-label" style="color: black;">🎫  Nro. de Ticket:</span>
                            <span class="info-value" style="font-size: 1.2em; color: #0035F6; font-weight: bold;">' . htmlspecialchars($ticketnro) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">📅  Fecha de Creación:</span>
                            <span class="info-value">' . htmlspecialchars($ticketfinished) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">🏢  RIF Cliente:</span>
                            <span class="info-value">' . htmlspecialchars($clientRif) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">🏢  Razón Social:</span>
                            <span class="info-value">' . htmlspecialchars($clientName) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">⚙️  Serial POS:</span>
                            <span class="info-value">' . htmlspecialchars($ticketserial) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">🔍  Nivel de Falla:</span>
                            <span class="info-value">' . htmlspecialchars($ticketNivelFalla) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">❌  Falla Reportada:</span>
                            <span class="info-value">' . htmlspecialchars($name_failure) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">🔄  Estatus Ticket:</span>
                            <span class="status-badge status-badge-open">' . htmlspecialchars($ticketstatus) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">💰  Estatus Pago:</span>
                            <span class="info-value">' . htmlspecialchars($ticketpaymnet) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">📋  Acción Ticket:</span>
                            <span class="info-value">' . htmlspecialchars($ticketaccion) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label" style="color: black;">🧑‍💻  Coordinación</span>
                            <span class="info-value">' . htmlspecialchars($name_coordinador) . '</span>
                        </div>    
                    </div>

                    <p style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="link-button" style = "color: white;">
                            Ver Detalles del Ticket
                        </a>
                    </p>

                    ' . (defined('FIRMA_CORREO') ? '<div class="logo-container"><img style = "margin-left: 21%; margin-top: -10%; width: 58%;" src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo"></div>' : '') . '

                    <div class="footer" style = "margin-top: -10%; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                        <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                        <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            ';

            
            $mensaje_final = ''; // Variable para mensajes de error
            $correo_tecnico_enviado = false; // Variable para verificar si el correo al técnico

            $correo_coordinador_enviado = false;
            if ($this->emailService->sendEmail($email_area, $subject_coordinador, $body_coordinador, [], $embeddedImages)) {
                // --- Configuración y envío del correo para el TÉCNICO ---
                $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
                $result_tecnico = $repository->GetEmailUserDataById($id_user); // Asegúrate de que este método exista

                if ($result_tecnico && !empty($result_tecnico['user_email'])) {
                    $email_tecnico = $result_tecnico['user_email'] ?? ''; // El correo del técnico
                    $nombre_tecnico = $result_tecnico['full_name'] ?? 'Técnico'; // Valor por defecto si no hay nombre

                    $subject_tecnico = 'Actualización sobre Ticket Gestionado';
                    $body_tecnico = '
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Actualización de Ticket</title>
            <style>
                body {
                    font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f7f6;
                    margin: 0;
                    padding: 0;
                }
                .ticket-container {
                    background-color: #fff;
                    border: 1px solid #ced4da;
                    border-radius: 8px;
                    padding: 30px;
                    max-width: 600px;
                    margin: 20px auto;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    border-top: 5px solid #0035F6;
                }
                .ticket-header {
                    background-color: #003594; /* Color azul de tu diseño */
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
                    display: flex; /* Para alinear el label y el valor */
                    align-items: baseline;
                }
                .info-item strong {
                    font-weight: bold;
                    color: #007bff; /* Un azul para los títulos de los campos */
                    margin-right: 10px;
                    width: 150px; /* Ancho fijo para alinear los dos puntos */
                    display: inline-block;
                }
                .footer {
                    text-align: center;
                    margin-top: -12px; /* Ajuste para el espacio entre el último párrafo y la firma */
                    color: #6c757d;
                    font-size: 0.9em;
                }
                .logo {
                    display: block;
                    margin: 20px auto 0;
                    max-width: 150px;
                    margin-top: -40px; /* Ajuste para acercar el logo al footer */
                }
                hr {
                    border-top: 1px solid #dee2e6;
                    margin: 20px 0;
                    margin-top: -50px; /* Ajuste para acercar la línea divisoria */
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                .link-button { 
                            display: inline-block; 
                            padding: 12px 25px; 
                            background-color: #007bff; 
                            color: #ffffff; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            margin-top: 20px; 
                            font-weight: bold;
                            transition: background-color 0.3s ease;
                        }
                        .link-button:hover { 
                            background-color: #0056b3; 
                            text-decoration: none; 
                        }
            </style>
        </head>
        <body>
            <div class="ticket-container">
                <div class="ticket-header">
                    <h2 class="ticket-title">¡Ticket Creado!</h2>
                </div>
                <p class="greeting">Hola, <span style = "color: black;"><strong>' . htmlspecialchars($nombre_tecnico) . '</strong></span></p>
                <p style="color: #495057; font-size: 1.1em; margin-bottom: 20px;">Te informamos que el ticket asociado al serial <span style = "color: black;"><strong>' . htmlspecialchars($ticketserial) . '</strong></span>, que gestionaste, ha sido <span style = "color: black;"><strong>Creado con Éxito</strong></span> y se ha notificado al área de <span style = "color: black;"><strong>' . htmlspecialchars($nombre_area) . '</strong></span>.</p>
                <ul class="info-list">
                    <li class="info-item"><strong> 🎫  Nro. Ticket:</strong> ' . htmlspecialchars($ticketnro) . '</li>
                    <li class="info-item"><strong> 🏢  RIF Cliente:</strong> ' . htmlspecialchars($clientRif) . '</li>
                    <li class="info-item"><strong> 🏢  Razón Social:</strong> ' . htmlspecialchars($clientName) . '</li>
                    <li class="info-item"><strong> ⚙️  Serial POS:</strong> ' . htmlspecialchars($ticketserial) . '</li>
                    <li class="info-item"><strong> 🔍  Nivel Falla:</strong> ' . htmlspecialchars($ticketNivelFalla ?? 'N/A') . '</li> 
                    <li class ="info-item"><strong> ❌  Falla:</strong> '. htmlspecialchars($name_failure ?? 'N/A') . '</li> 
                    <li class="info-item"><strong> 🔄  Estatus:</strong><span style=" color: #28a745;">'. htmlspecialchars($ticketstatus).'</span></li>
                    <li class="info-item"><strong> 📋  Acción:</strong> '. htmlspecialchars($ticketaccion ?? 'N/A') . '</li> 
                    <li class="info-item"><strong> 📅  Fecha de Creacion:</strong> ' . htmlspecialchars($ticketfinished) . '</li>
                    <li class="info-item"><strong>💰   Estatus Carga Documento:</strong> <span style= "color: darkblue;">'. htmlspecialchars($ticketpaymnet).'</span></li>
                </ul>
                <hr>
                <p style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="link-button" style = "color: white;">
                            Ver Detalles del Ticket
                        </a>
                    </p>

                    ' . (defined('FIRMA_CORREO') ? '<div class="logo-container"><img style = "margin-left: 38%; margin-top: -10%; width: 70%;" src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo"></div>' : '') . '

                    <div class="footer" style = "margin-top: -9%; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                        <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                        <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                    </div>
                    </div>
            </div>
        </body>
        </html>
    ';

    $embeddedImages1 = [];
            if (defined('FIRMA_CORREO')) {
                $embeddedImages1['imagen_adjunta'] = FIRMA_CORREO;
            }

                    if ($this->emailService->sendEmail($email_tecnico, $subject_tecnico, $body_tecnico, [], $embeddedImages1)) {
                        $correo_tecnico_enviado = true;
                    }
                } else {
                    $mensaje_final .= "No se pudo obtener el correo del técnico con el ID de sesión. ";
                }
            } else {
                $mensaje_final .= "El ID de usuario del técnico no se encontró en la sesión. ";
            }

            // --- Verificar si ambos correos fueron enviados ---

            // --- Definir la respuesta final basada en el estado de ambos envíos ---
            if ($correo_coordinador_enviado && $correo_tecnico_enviado) {
                $this->response(['success' => true, 'message' => 'Correos enviados exitosamente al coordinador y al técnico.', 'color' => 'green']);
            } elseif ($correo_coordinador_enviado) {
                $this->response(['success' => true, 'message' => 'Correo enviado al coordinador. ' . $mensaje_final . 'No se pudo enviar al técnico.', 'color' => 'orange']);
            } elseif ($correo_tecnico_enviado) {
                // Esto es un caso poco probable si el coordinador es el primero en procesarse.
                $this->response(['success' => false, 'message' => 'Error al enviar el correo al coordinador. Correo del técnico enviado. ' . $mensaje_final, 'color' => 'red']);
            } else {
                $this->response(['success' => false, 'message' => 'Error al enviar ambos correos. ' . $mensaje_final, 'color' => 'red']);
            }
    }

     public function handleSendEndTicket() {
        $repository = new EmailRepository();

        // 1. Obtener ID del coordinador desde el POST y sus datos

        // EMAIL DEL AREA
        $result_email_area = $repository->GetEmailArea();

        // Si no se encuentra información del coordinador, no podemos continuar
        if (!$result_email_area) {
            $this->response(['success' => false, 'message' => 'Correo del coordinador no existe o no se encontraron datos.', 'color' => 'red']);
            return; // Salir de la función
        }

        $email_area = $result_email_area['email_area']; // El Gmail del AREA
        $nombre_area = $result_email_area['name_area']; // El nombre del AREA

        // 2. Obtener datos del ticket cerrado
        $result_ticket = $repository->GetDataTicketClosed();
        if (!$result_ticket) {
            $this->response(['success' => false, 'message' => 'No se encontraron datos del ticket.', 'color' => 'red']);
            return;
        }

        $nombre_tecnico_ticket = $result_ticket['full_name_tecnico'];
        $ticketNivelFalla = $result_ticket['id_level_failure'];
        $name_failure = $result_ticket['name_failure'];
        $ticketfinished = $result_ticket['create_ticket'];
        $ticketstatus = $result_ticket['name_status_ticket'];
        $ticketprocess = $result_ticket['name_process_ticket'];
        $ticketaccion = $result_ticket['name_accion_ticket'];
        $ticketserial = $result_ticket['serial_pos'];
        $ticketnro = $result_ticket['nro_ticket'] ?? 'N/A';
        $ticketpayment = $result_ticket['name_status_payment'];
        $ticketdomiciliacion = $result_ticket['name_status_domiciliacion'] ?? 'N/A';
        $ticketlab = $result_ticket['name_status_lab'] ?? 'N/A';
        $fecha_entrega = $result_ticket['date_delivered'] ?? 'N/A';
        $comentario_entrega = $result_ticket['customer_delivery_comment'] ?? 'N/A';

         // Funcion para obtener el id del ticket con el nro de ticket
        $resultgetid_ticket = $repository->GetTicketId($ticketnro);
        $ticketid = $resultgetid_ticket['get_ticket_id'];

            // Funcion para obtener el nobre de la coordinacion por el id_ticket
        $resultCoordinacion = $repository->GetCoordinacion($ticketid);
        $name_coordinador = $resultCoordinacion['get_department_name']?? 'N/A';

        // 3. Obtener información del cliente
        $result_client = $repository->GetClientInfo($ticketserial);
        $clientName = $result_client['razonsocial'] ?? 'N/A';
        $clientRif = $result_client['coddocumento'] ?? 'N/A';

        // 4. Obtener datos del técnico
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $result_tecnico = $repository->GetEmailUserDataById($id_user);
        $email_tecnico = $result_tecnico['user_email'] ?? '';
        $nombre_tecnico = $result_tecnico['full_name'] ?? 'Técnico';

        // --- Configuración y envío del correo para el COORDINADOR ---
        $subject_coordinador = 'Notificación de Ticket Cerrado';
        $body_coordinador = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ticket Cerrado</title>
                <style>
                    body { font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 20px; margin: 0; }
                    .email-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                    .ticket-container { background-color: #fff; border: 1px solid #ced4da; border-radius: 10px; padding: 30px; max-width: 600px; width: 100%; margin-left: 26%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); }
                    .ticket-header { background-color: #28a745; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin-bottom: 25px; }
                    .ticket-title { font-size: 1.8em; margin-bottom: 10px; font-weight: bold; }
                    .greeting { margin-bottom: 20px; color: #495057; font-size: 1.1em; text-align: center; }
                    .message { color: #495057; font-size: 1.1em; margin-bottom: 20px; text-align: center; }
                    .info-list { list-style: none; padding-left: 0; margin-bottom: 20px; }
                    .info-item { margin-bottom: 12px; color: #343a40; font-size: 1em; display: flex; align-items: baseline; }
                    .info-item strong { font-weight: bold; color: #007bff; margin-right: 10px; width: 150px; display: inline-block; }
                    .link-section { text-align: center; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6c757d; font-size: 0.9em; }
                    .logo { display: block; margin: 20px auto 0; max-width: 50%; }
                    hr { border-top: 1px solid #dee2e6; margin: 20px 0; }
                    .status-closed { color: #28a745; font-weight: bold; }
                    .status-pending { color: #ffc107; font-weight: bold; }
                    .link-button { 
                        display: inline-block; 
                        padding: 12px 25px; 
                        background-color: #007bff; 
                        color: #ffffff; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        margin-top: 20px; 
                        font-weight: bold;
                        transition: background-color 0.3s ease;
                    }
                    .link-button:hover { 
                        background-color: #0056b3; 
                        text-decoration: none; 
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="ticket-container">
                        <div class="ticket-header">
                            <h2 class="ticket-title">✅ ¡Ticket Cerrado! ✅</h2>
                        </div>
                        <p class="greeting">Hola, Coordinación de <strong><span style = "color: black;">' . htmlspecialchars($name_coordinador) . '</p></strong></span>
                        <p class="message">Nos complace informarle que el Técnico <strong><span style = "color: black;">' . htmlspecialchars($nombre_tecnico_ticket) . '</span></strong> ha <strong><span style = "color: black;">cerrado exitosamente</span></strong> el siguiente ticket:</p>
            <ul class="info-list">
                <li class="info-item"><strong>Nro. Ticket:</strong> ' . htmlspecialchars($ticketnro) . '</li>
                <li class="info-item"><strong>RIF Cliente:</strong> ' . htmlspecialchars($clientRif) . '</li>
                <li class="info-item"><strong>Nombre Cliente:</strong> ' . htmlspecialchars($clientName) . '</li>
                <li class="info-item"><strong>Serial POS:</strong> ' . htmlspecialchars($ticketserial) . '</li>
                <li class="info-item"><strong>Nivel Falla:</strong> ' . htmlspecialchars($ticketNivelFalla) . '</li>
                <li class="info-item"><strong>Falla:</strong> ' . htmlspecialchars($name_failure) . '</li>
                <li class="info-item"><strong>Fecha de Creación:</strong> ' . htmlspecialchars($ticketfinished) . '</li>
                <li class="info-item"><strong>Fecha de Entrega:</strong> ' . htmlspecialchars($fecha_entrega) . '</li>
                <li class="info-item"><strong>Estatus:</strong> <span class="status-closed">' . htmlspecialchars($ticketstatus) . '</span></li>
                <li class="info-item"><strong>Acción:</strong> ' . htmlspecialchars($ticketaccion) . '</li>
                <li class="info-item"><strong>Estatus Carga Documento:</strong> <span>' . htmlspecialchars($ticketpayment) . '</span></li>
                <li class="info-item"><strong>Estado de Domiciliación:</strong> ' . htmlspecialchars($ticketdomiciliacion) . '</li>
                <li class="info-item"><strong>Estado del Laboratorio:</strong> ' . htmlspecialchars($ticketlab) . '</li>
                <li class="info-item"><strong>Comentario de Entrega:</strong> ' . htmlspecialchars($comentario_entrega) . '</li>
            </ul>
                            <hr>

                        <div class="link-section">
                            <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="link-button" style = "color: white;">
                                Ver Detalles del Ticket
                            </a>
                        </div>

                        ' . (defined('FIRMA_CORREO') ? '<img st src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo">' : '') . '

                        <div class="footer" style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                            <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                            <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        ';

        $embeddedImages = [];
        if (defined('FIRMA_CORREO')) {
            $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
        }

        $correo_coordinador_enviado = false;
        $correo_tecnico_enviado = false;
        $mensaje_final = '';

        // Enviar correo al coordinador
        if ($this->emailService->sendEmail($email_area, $subject_coordinador, $body_coordinador, [], $embeddedImages)) {
            $correo_coordinador_enviado = true;
        }

        // Enviar correo al técnico
        if ($email_tecnico && $result_tecnico) {
            $subject_tecnico = 'Ticket Cerrado Exitosamente';
            $body_tecnico = '
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Ticket Cerrado</title>
                    <style>
                        body { font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 20px; margin: 0; }
                        .email-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                        .ticket-container { background-color: #fff; border: 1px solid #ced4da; border-radius: 10px; padding: 30px; max-width: 600px; width: 100%; margin-left: 26%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); }
                        .ticket-header { background-color: #28a745; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin-bottom: 25px; }
                        .ticket-title { font-size: 1.8em; margin-bottom: 10px; font-weight: bold; }
                        .greeting { margin-bottom: 20px; color: #495057; font-size: 1.1em; text-align: center; }
                        .message { color: #495057; font-size: 1.1em; margin-bottom: 20px; text-align: center; }
                        .info-list { list-style: none; padding-left: 0; margin-bottom: 20px; }
                        .info-item { margin-bottom: 12px; color: #343a40; font-size: 1em; display: flex; align-items: baseline; }
                        .info-item strong { font-weight: bold; color: #007bff; margin-right: 10px; width: 150px; display: inline-block; }
                        .link-section { text-align: center; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 20px; color: #6c757d; font-size: 0.9em; }
                        .logo { display: block; margin: 20px auto 0; max-width: 50%; }
                        hr { border-top: 1px solid #dee2e6; margin: 20px 0; }
                        .status-closed { color: #28a745; font-weight: bold; }
                        .link-button { 
                            display: inline-block; 
                            padding: 12px 25px; 
                            background-color: #007bff; 
                            color: #ffffff; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            margin-top: 20px; 
                            font-weight: bold;
                            transition: background-color 0.3s ease;
                        }
                        .link-button:hover { 
                            background-color: #0056b3; 
                            text-decoration: none; 
                        }
                    </style>
                </head>
                <body>
                    <div class="email-wrapper">
                        <div class="ticket-container">
                            <div class="ticket-header">
                                <h2 class="ticket-title">✅ ¡Ticket Cerrado! ✅</h2>
                            </div>
                            <p class="greeting">Hola, técnico <strong><span style = "color: black;">' . htmlspecialchars($nombre_tecnico) . '</strong></span></p>
                            <p class="message">¡Felicitaciones! Has <strong><span style = "color: black;">cerrado exitosamente</strong></span> el siguiente ticket:</p>
                        <ul class="info-list">
                            <li class="info-item"><strong>Nro. Ticket:</strong> ' . htmlspecialchars($ticketnro) . '</li>
                            <li class="info-item"><strong>RIF Cliente:</strong> ' . htmlspecialchars($clientRif) . '</li>
                            <li class="info-item"><strong>Nombre Cliente:</strong> ' . htmlspecialchars($clientName) . '</li>
                            <li class="info-item"><strong>Serial POS:</strong> ' . htmlspecialchars($ticketserial) . '</li>
                            <li class="info-item"><strong>Nivel Falla:</strong> ' . htmlspecialchars($ticketNivelFalla) . '</li>
                            <li class="info-item"><strong>Falla:</strong> ' . htmlspecialchars($name_failure) . '</li>
                            <li class="info-item"><strong>Fecha de Creación:</strong> ' . htmlspecialchars($ticketfinished) . '</li>
                            <li class="info-item"><strong>Fecha de Entrega:</strong> ' . htmlspecialchars($fecha_entrega) . '</li>
                            <li class="info-item"><strong>Estatus:</strong> <span class="status-closed">' . htmlspecialchars($ticketstatus) . '</span></li>
                            <li class="info-item"><strong>Acción:</strong> ' . htmlspecialchars($ticketaccion) . '</li>
                            <li class="info-item"><strong>Comentario de Entrega:</strong> ' . htmlspecialchars($comentario_entrega) . '</li>
                        </ul>
                                        <hr>

                            <div class="link-section">
                                <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="link-button" style = "color: white;">
                                    Ver Detalles del Ticket
                                </a>
                            </div>

                            ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo">' : '') . '

                            <div class="footer" style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                                <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                                <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            ';

            if ($this->emailService->sendEmail($email_tecnico, $subject_tecnico, $body_tecnico, [], $embeddedImages)) {
                $correo_tecnico_enviado = true;
            }
        }

        // --- Verificar si ambos correos fueron enviados ---
        if ($correo_coordinador_enviado && $correo_tecnico_enviado) {
            $this->response(['success' => true, 'message' => 'Correos enviados exitosamente al coordinador y al técnico.', 'color' => 'green']);
        } elseif ($correo_coordinador_enviado) {
            $this->response(['success' => true, 'message' => 'Correo enviado al coordinador. No se pudo enviar al técnico.', 'color' => 'orange']);
        } elseif ($correo_tecnico_enviado) {
            $this->response(['success' => false, 'message' => 'Error al enviar el correo al coordinador. Correo del técnico enviado.', 'color' => 'red']);
        } else {
            $this->response(['success' => false, 'message' => 'Error al enviar ambos correos.', 'color' => 'red']);
        }
    }

    public function handleSendDevolutionTicket() {
    $repository = new EmailRepository();

    // 1. Obtener ID del coordinador desde el POST y sus datos
    $id_coordinador = isset($_POST['id_coordinador']) ? $_POST['id_coordinador'] : '';
    $result_coordinador = $repository->GetEmailCoorDataById($id_coordinador);

    // Si no se encuentra información del coordinador, no podemos continuar
    if (!$result_coordinador) {
        $this->response(['success' => false, 'message' => 'Correo del coordinador no existe o no se encontraron datos.', 'color' => 'red']);
        return;
    }

    $email_coordinador = $result_coordinador['email'];
    $nombre_coordinador = $result_coordinador['full_name'];

    // 2. Obtener datos del ticket cerrado
    $result_ticket = $repository->GetDataTicketClosed();
    if (!$result_ticket) {
        $this->response(['success' => false, 'message' => 'No se encontraron datos del ticket.', 'color' => 'red']);
        return;
    }

    $nombre_tecnico_ticket = $result_ticket['full_name_tecnico'];
    $ticketNivelFalla = $result_ticket['id_level_failure'];
    $name_failure = $result_ticket['name_failure'];
    $ticketfinished = $result_ticket['create_ticket'];
    $ticketstatus = $result_ticket['name_status_ticket'];
    $ticketprocess = $result_ticket['name_process_ticket'];
    $ticketaccion = $result_ticket['name_accion_ticket'];
    $ticketserial = $result_ticket['serial_pos'];
    $ticketnro = $result_ticket['nro_ticket'] ?? 'N/A';
    $ticketpayment = $result_ticket['name_status_payment'];
    $ticketdomiciliacion = $result_ticket['name_status_domiciliacion'] ?? 'N/A';
    $ticketlab = $result_ticket['name_status_lab'] ?? 'N/A';
    $fecha_entrega = $result_ticket['date_end_ticket'] ?? 'N/A';
    $comentario_entrega =  $result_ticket['comment_devolution'] ?? 'Sin comentarios';

    // 3. Obtener información del cliente
    $result_client = $repository->GetClientInfo($ticketserial);
    $clientName = $result_client['razonsocial'] ?? 'N/A';
    $clientRif = $result_client['coddocumento'] ?? 'N/A';

    // 4. Obtener datos del técnico
    $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
    $result_tecnico = $repository->GetEmailUserDataById($id_user);
    $email_tecnico = $result_tecnico['user_email'] ?? '';
    $nombre_tecnico = $result_tecnico['full_name'] ?? 'Técnico';

    // --- Configuración y envío del correo para el COORDINADOR ---
    $subject_coordinador = 'Notificación de Ticket Cerrado por Devolucion';
    $body_coordinador = '
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket Cerrado</title>
            <style>
                body { font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 30px; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
                .ticket-container { background-color: #fff; border: 1px solid #ced4da; border-radius: 10px; padding: 30px; max-width: 600px; width: 100%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); }
                .ticket-header { background-color: #1788ecff; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin-bottom: 25px; }
                .ticket-title { font-size: 1.8em; margin-bottom: 10px; font-weight: bold; }
                .greeting { margin-bottom: 20px; color: #495057; font-size: 1.1em; }
                .info-list { list-style: none; padding-left: 0; margin-bottom: 20px; }
                .info-item { margin-bottom: 12px; color: #343a40; font-size: 1em; display: flex; align-items: baseline; }
                .info-item strong { font-weight: bold; color: #007bff; margin-right: 10px; width: 150px; display: inline-block; }
                .footer { text-align: center; margin-top: -12px; color: #6c757d; font-size: 0.9em; }
                .logo { display: block; margin: 20px auto 0; max-width: 150px; margin-top: -40px; }
                hr { border-top: 1px solid #dee2e6; margin: 20px 0; margin-top: -50px; }
                .status-closed { color: #28a745; font-weight: bold; }
                .status-pending { color: #ffc107; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="ticket-container">
                <div class="ticket-header">
                    <h2 class="ticket-title">↩️ ¡Ticket Devuelto! ↩️</h2>
                </div>
                <p class="greeting">Hola, ' . htmlspecialchars($nombre_coordinador) . '</p>
                <p style="color: #495057; font-size: 1.1em; margin-bottom: 20px;">Nos complace informarle que el Técnico <strong>' . htmlspecialchars($nombre_tecnico_ticket) . '</strong> ha <strong>Devuelto el Pos exitosamente</strong> el siguiente ticket:</p>
                <ul class="info-list">
                    <li class="info-item"><strong>Nro. Ticket:</strong> ' . htmlspecialchars($ticketnro) . '</li>
                    <li class="info-item"><strong>RIF Cliente:</strong> ' . htmlspecialchars($clientRif) . '</li>
                    <li class="info-item"><strong>Nombre Cliente:</strong> ' . htmlspecialchars($clientName) . '</li>
                    <li class="info-item"><strong>Serial POS:</strong> ' . htmlspecialchars($ticketserial) . '</li>
                    <li class="info-item"><strong>Nivel Falla:</strong> ' . htmlspecialchars($ticketNivelFalla) . '</li>
                    <li class="info-item"><strong>Falla:</strong> ' . htmlspecialchars($name_failure) . '</li>
                    <li class="info-item"><strong>Fecha de Creación:</strong> ' . htmlspecialchars($ticketfinished) . '</li>
                    <li class="info-item"><strong>Fecha de Entrega:</strong> ' . htmlspecialchars($fecha_entrega) . '</li>
                    <li class="info-item"><strong>Estatus:</strong> <span class="status-closed">' . htmlspecialchars($ticketstatus) . '</span></li>
                    <li class="info-item"><strong>Acción:</strong> ' . htmlspecialchars($ticketaccion) . '</li>
                    <li class="info-item"><strong>Estatus Carga Documento:</strong> <span>' . htmlspecialchars($ticketpayment) . '</span></li>
                    <li class="info-item"><strong>Estado de Domiciliación:</strong> ' . htmlspecialchars($ticketdomiciliacion) . '</li>
                    <li class="info-item"><strong>Estado del Laboratorio:</strong> ' . htmlspecialchars($ticketlab) . '</li>
                    <li class="info-item"><strong>Comentario Devolución:</strong> ' . htmlspecialchars($comentario_entrega) . '</li>
                </ul>
                <p><a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" style="color: #007bff; text-decoration: none; ">Ver el historial completo del ticket</a></p>
                <hr>
                <p style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="link-button" style = "color: white;">
                            Ver Detalles del Ticket
                        </a>
                    </p>

                    ' . (defined('FIRMA_CORREO') ? '<div class="logo-container"><img style = "margin-left: 28%; margin-top: 3%;" src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo"></div>' : '') . '

                    <div class="footer" style = "margin-top: -9%; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                        <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                        <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                    </div>
            </div>
        </body>
        </html>
    ';

    $embeddedImages = [];
    if (defined('FIRMA_CORREO')) {
        $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
    }

    $correo_coordinador_enviado = false;
    $correo_tecnico_enviado = false;
    $mensaje_final = '';

    // Enviar correo al coordinador
    if ($this->emailService->sendEmail($email_coordinador, $subject_coordinador, $body_coordinador, [], $embeddedImages)) {
        $correo_coordinador_enviado = true;
    }

    // Enviar correo al técnico
    if ($email_tecnico && $result_tecnico) {
        $subject_tecnico = 'Ticket Devuelto Exitosamente';
        $body_tecnico = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ticket Cerrado</title>
                <style>
                    body { font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 30px; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
                    .ticket-container { background-color: #fff; border: 1px solid #ced4da; border-radius: 10px; padding: 30px; max-width: 600px; width: 100%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); }
                    .ticket-header { background-color: #1788ecff; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin-bottom: 25px; }
                    .ticket-title { font-size: 1.8em; margin-bottom: 10px; font-weight: bold; }
                    .greeting { margin-bottom: 20px; color: #495057; font-size: 1.1em; }
                    .info-list { list-style: none; padding-left: 0; margin-bottom: 20px; }
                    .info-item { margin-bottom: 12px; color: #343a40; font-size: 1em; display: flex; align-items: baseline; }
                    .info-item strong { font-weight: bold; color: #007bff; margin-right: 10px; width: 150px; display: inline-block; }
                    .footer { text-align: center; margin-top: -12px; color: #6c757d; font-size: 0.9em; }
                    .logo { display: block; margin: 20px auto 0; max-width: 150px; margin-top: -40px; }
                    hr { border-top: 1px solid #dee2e6; margin: 20px 0; margin-top: -50px; }
                    .status-closed { color: #28a745; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="ticket-container">
                    <div class="ticket-header">
                        <h2 class="ticket-title">↩️ ¡Ticket Devuelto! ↩️</h2>
                    </div>
                    <p class="greeting">Hola, ' . htmlspecialchars($nombre_tecnico) . '</p>
                    <p style="color: #495057; font-size: 1.1em; margin-bottom: 20px;">¡Felicitaciones! Has <strong>Devuelto el Pos exitosamente</strong> asociado al siguiente ticket:</p>
                    <ul class="info-list">
                        <li class="info-item"><strong>Nro. Ticket:</strong> ' . htmlspecialchars($ticketnro) . '</li>
                        <li class="info-item"><strong>RIF Cliente:</strong> ' . htmlspecialchars($clientRif) . '</li>
                        <li class="info-item"><strong>Nombre Cliente:</strong> ' . htmlspecialchars($clientName) . '</li>
                        <li class="info-item"><strong>Serial POS:</strong> ' . htmlspecialchars($ticketserial) . '</li>
                        <li class="info-item"><strong>Nivel Falla:</strong> ' . htmlspecialchars($ticketNivelFalla) . '</li>
                        <li class="info-item"><strong>Falla:</strong> ' . htmlspecialchars($name_failure) . '</li>
                        <li class="info-item"><strong>Fecha de Creación:</strong> ' . htmlspecialchars($ticketfinished) . '</li>
                        <li class="info-item"><strong>Fecha de Entrega:</strong> ' . htmlspecialchars($fecha_entrega) . '</li>
                        <li class="info-item"><strong>Estatus:</strong> <span class="status-closed">' . htmlspecialchars($ticketstatus) . '</span></li>
                        <li class="info-item"><strong>Acción:</strong> ' . htmlspecialchars($ticketaccion) . '</li>
                        <li class="info-item"><strong>Comentario Devolución:</strong> ' . htmlspecialchars($comentario_entrega) . '</li>
                    </ul>
                    <p><a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" style="color: #007bff; text-decoration: none; ">Ver el historial completo del ticket</a></p>
                    <hr>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="link-button" style = "color: white;">
                            Ver Detalles del Ticket
                        </a>
                    </p>

                    ' . (defined('FIRMA_CORREO') ? '<div class="logo-container"><img style = "margin-left: 28%; margin-top: 3%;" src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo"></div>' : '') . '

                    <div class="footer" style = "margin-top: -9%; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                        <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                        <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        ';

        if ($this->emailService->sendEmail($email_tecnico, $subject_tecnico, $body_tecnico, [], $embeddedImages)) {
            $correo_tecnico_enviado = true;
        }
    }

    // --- Verificar si ambos correos fueron enviados ---
    if ($correo_coordinador_enviado && $correo_tecnico_enviado) {
        $this->response(['success' => true, 'message' => 'Correos enviados exitosamente al coordinador y al técnico.', 'color' => 'green']);
    } elseif ($correo_coordinador_enviado) {
        $this->response(['success' => true, 'message' => 'Correo enviado al coordinador. No se pudo enviar al técnico.', 'color' => 'orange']);
    } elseif ($correo_tecnico_enviado) {
        $this->response(['success' => false, 'message' => 'Error al enviar el correo al coordinador. Correo del técnico enviado.', 'color' => 'red']);
    } else {
        $this->response(['success' => false, 'message' => 'Error al enviar ambos correos.', 'color' => 'red']);
    }
    }

    public function handleconsultationHistorial(): void{
        $serial  = isset($_POST['serial']) ? $_POST['serial'] : '';
        $proceso = isset($_POST['proceso']) ? $_POST['proceso'] : '';
        $id_level_failure = isset($_POST['id_level_failure']) ? $_POST['id_level_failure'] : '';
        
        $repository   = new EmailRepository(); // Inicializa el repositorio
        if ($serial != '' && $proceso != '') {
        $result  = $repository->GetDataTicketConCliente($serial, $id_level_failure); // Llama a la función del repositoryo

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

   public function handleSendRejectDocument(){
        $repository = new EmailRepository(); // Inicialización aquí si no se hace en el constructor

        // 1. Obtener ID del coordinador desde el POST y sus datos
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $documentType = isset($_POST['documentType']) ? $_POST['documentType'] : '';

        // EMAIL DEL AREA
        $result_email_area = $repository->GetEmailArea();

        // Si no se encuentra información del coordinador, no podemos continuar
        if (!$result_email_area) {
            $this->response(['success' => false, 'message' => 'Correo del coordinador no existe o no se encontraron datos.', 'color' => 'red']);
            return; // Salir de la función
        }

        $email_area = $result_email_area['email_area']; // El Gmail del AREA
        $nombre_area = $result_email_area['name_area']; // El nombre del AREA

        // 2. Obtener datos del ticket
        $result_ticket = $repository->GetDataTicket2();
        // Verifica si se obtuvieron datos del ticket. Si no, algo anda mal.
        if (!$result_ticket) {
            $this->response(['success' => false, 'message' => 'No se encontraron datos del ticket.', 'color' => 'red']);
            return;
        }

        $result_email_areaAdmin = $repository->GetEmailAreaAdmin();
        $email_area_admin = $result_email_areaAdmin['email_area'];
        $name_area_admin = $result_email_areaAdmin['name_area'];

        $nombre_tecnico_ticket = $result_ticket['full_name_tecnico'];
        $ticketNivelFalla = $result_ticket['id_level_failure'];
        $name_failure = $result_ticket['name_failure'];
        $ticketfinished = $result_ticket['create_ticket'];
        $ticketstatus = $result_ticket['name_status_ticket'];
        $ticketprocess = $result_ticket['name_process_ticket'];
        $ticketaccion = $result_ticket['name_accion_ticket'];
        $ticketserial = $result_ticket['serial_pos'];
        $ticketnro = $result_ticket['nro_ticket'] ?? 'N/A';
        $ticketpaymnet = $result_ticket['name_status_payment'];

        // Funcion para obtener el id del ticket con el nro de ticket
        $resultgetid_ticket = $repository->GetTicketId($ticketnro);
        $ticketid = $resultgetid_ticket['get_ticket_id'];

        // Funcion para obtener el nobre de la coordinacion por el id_ticket
        $resultCoordinacion = $repository->GetCoordinacion($ticketid);
        $name_coordinador = $resultCoordinacion['get_department_name'];

        //Funcion para traer los datos del documento rechazado
        $resultDocumentoRechazado = $repository->GetDocumentoRechazado($ticketnro);
        $motivoTexto = $resultDocumentoRechazado['name_motivo_rechazo'];
        $documentType = $resultDocumentoRechazado['document_type'];
        $idrejectby = $resultDocumentoRechazado['changed_by']?? 'N/A';
        $rejectedBy = $resultDocumentoRechazado['usuario_gestion'];
        $ticketdatereject = $resultDocumentoRechazado['fecha_rechazo'];

        // Datos del que gestionó el ticket
        $result_tecnico = $repository->GetEmailUser1gestionDataById( $ticketid, $documentType);
        $email_tecnico = $result_tecnico['user_email'] ?? '';
        $nombre_tecnico = $result_tecnico['full_name'] ?? 'Técnico';
        $id_rol = $result_tecnico['id_rolusr'] ?? '';
        $name_rol = $result_tecnico['name_rol'] ?? '';

        // Datos del que rechazó el documento
        $resultUserreject = $repository->resultUserreject($idrejectby);
        $rolTecnico = $resultUserreject['name_rol'];
        $idrol = $resultUserreject['id_rol'];
        $nombre_person_reject = $resultUserreject['full_name'];
        $email_person_reject = $resultUserreject['email'];

        $embeddedImages = [];
        if (defined('FIRMA_CORREO')) {
            $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
        }

        // 3. Obtener información del cliente
        $result_client = $repository->GetClientInfo($ticketserial);
        $clientName = $result_client['razonsocial'] ?? 'N/A';
        $clientRif = $result_client['coddocumento'] ?? 'N/A';

        // ========== CORREO 1: PARA COORDINACIÓN ==========
        $subject_coordinador = 'Documento RECHAZADO  Ticket ' . $ticketnro;
        $body_coordinador = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Documento Rechazado</title>
            <style>
            body{margin:0;padding:0;background:#f6f8fb;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
            .container{max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.08);overflow:hidden;border-top:6px solid #dc3545}
            .header{background:linear-gradient(135deg,#ff6b6b,#dc3545);color:#fff;text-align:center;padding:22px}
            .header h1{margin:0;font-size:22px}
            .pill{display:inline-block;background:#fff;color:#dc3545;border-radius:999px;padding:6px 12px;font-weight:700;margin-top:10px}
            .section{padding:22px}
            .row{margin-bottom:12px}
            .label{display:inline-block;width:165px;color:#6b7280;font-weight:600}
            .value{color:#111827}
            .badge{display:inline-block;padding:4px 10px;border-radius:999px;color:#fff;font-weight:700}
            .badge-warning{background:#f59e0b}
            .alert{background:#fff3f3;border:1px solid #ffe0e0;color:#b91c1c;border-radius:10px;padding:14px;margin:14px 0}
            .btn{display:inline-block;background:#0035F6;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;margin-top:12px}
            .footer{background:#f3f4f6;text-align:center;color:#6b7280;font-size:12px;padding:14px 10px}
            .logo{display:block;margin:20px auto 0;max-width:150px}
            .note{background:#e3f2fd;border:1px solid #90caf9;color:#1565c0;border-radius:10px;padding:14px;margin:14px 0;font-weight:500}
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <h1>Documento Rechazado</h1>
                <div class="pill">Ticket ' . htmlspecialchars($ticketnro) . '</div>
                </div>

                <div class="section">
                <div class="alert"><strong>Motivo del rechazo:</strong> ' . htmlspecialchars($motivoTexto) . '</div>
                <div class="row"><span class="label">Documento:</span> <span class="value"><strong>' . htmlspecialchars($documentType) . '</strong></span></div>
                <div class="row"><span class="label">Rechazado por:</span> <span class="value">' . htmlspecialchars($rejectedBy) . '</span></div>
                <div class="row"><span class="label">Fecha:</span> <span class="value">' . htmlspecialchars($ticketdatereject) . '</span></div>

                <div class="note">
                    <strong>📢 Nota:</strong> Se le ha avisado al técnico <strong>' . htmlspecialchars($nombre_tecnico) . '</strong> para que cargue el documento correspondiente.
                </div>

                <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0">

                <div class="row"><span class="label">RIF Cliente:</span> <span class="value">' . htmlspecialchars($clientRif) . '</span></div>
                <div class="row"><span class="label">Razón Social:</span> <span class="value">' . htmlspecialchars($clientName) . '</span></div>
                <div class="row"><span class="label">Serial POS:</span> <span class="value">' . htmlspecialchars($ticketserial) . '</span></div>
                <div class="row"><span class="label">Estatus Ticket:</span> <span class="value"><span class="badge badge-warning">' . htmlspecialchars($ticketstatus) . '</span></span></div>

                <p style="text-align:center;margin-top:16px">
                    <a class="btn" href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '" style = "color: white;">Ver historial del ticket</a>
                </p>
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo" class="logo">' : '') . '
                </div>

                <div class="footer" style = "margin-top: -9%; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                    <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                </div>
            </div>
            </body>
            </html>
        ';

        // ========== CORREO 2: PARA LA PERSONA QUE RECHAZÓ ==========
        $subject_persona_reject = 'Has rechazado un documento - Ticket ' . $ticketnro;
        $body_persona_reject = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Documento Rechazado</title>
            <style>
            body{margin:0;padding:0;background:#f6f8fb;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
            .container{max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.08);overflow:hidden;border-top:6px solid #10b981}
            .header{background:linear-gradient(135deg,#34d399,#10b981);color:#fff;text-align:center;padding:22px}
            .header h1{margin:0;font-size:22px}
            .pill{display:inline-block;background:#fff;color:#10b981;border-radius:999px;padding:6px 12px;font-weight:700;margin-top:10px}
            .section{padding:22px}
            .row{margin-bottom:12px}
            .label{display:inline-block;width:165px;color:#6b7280;font-weight:600}
            .value{color:#111827}
            .badge{display:inline-block;padding:4px 10px;border-radius:999px;color:#fff;font-weight:700}
            .badge-success{background:#10b981}
            .alert{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;border-radius:10px;padding:14px;margin:14px 0}
            .btn{display:inline-block;background:#0035F6;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;margin-top:12px}
            .footer{background:#f3f4f6;text-align:center;color:#6b7280;font-size:12px;padding:14px 10px}
            .logo{display:block;margin:20px auto 0;max-width:150px}
            .note{background:#e8f5e8;border:1px solid #a5d6a7;color:#2e7d32;border-radius:10px;padding:14px;margin:14px 0;font-weight:500}
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <h1>Documento Rechazado</h1>
                <div class="pill">Ticket ' . htmlspecialchars($ticketnro) . '</div>
                </div>

                <div class="section">
                <p>Hola, <strong>' . htmlspecialchars($nombre_person_reject) . '</strong>.</p>
                <div class="alert"><strong>Has rechazado el documento:</strong> ' . htmlspecialchars($documentType) . '<br><strong>Motivo:</strong> ' . htmlspecialchars($motivoTexto) . '</div>
                <div class="row"><span class="label">Fecha:</span> <span class="value">' . htmlspecialchars($ticketdatereject) . '</span></div>

                <div class="note">
                    <strong>📢 Nota:</strong> Se le ha informado al técnico para que cargue el documento correspondiente.
                </div>

                <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0">

                <div class="row"><span class="label">RIF Cliente:</span> <span class="value">' . htmlspecialchars($clientRif) . '</span></div>
                <div class="row"><span class="label">Razón Social:</span> <span class="value">' . htmlspecialchars($clientName) . '</span></div>
                <div class="row"><span class="label">Serial POS:</span> <span class="value">' . htmlspecialchars($ticketserial) . '</span></div>
                <div class="row"><span class="label">Estatus Ticket:</span> <span class="value"><span class="badge badge-success">' . htmlspecialchars($ticketstatus) . '</span></span></div>

                <p style="text-align:center;margin-top:16px">
                    <a class="btn" href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '" style = "color: white;">Ver historial del ticket</a>
                </p>
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo" class="logo">' : '') . '
                </div>

                <div class="footer" style = "margin-top: -9%; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                    <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                </div>
            </div>
            </div>
            </body>
            </html>
        ';

        // ========== CORREO 3: PARA EL TÉCNICO QUE GESTIONÓ ==========
        $subject_tecnico = 'Se rechazó un documento del Ticket ' . $ticketnro;
        $body_tecnico = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Documento Rechazado</title>
            <style>
            body{margin:0;padding:0;background:#f6f8fb;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
            .container{max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.08);overflow:hidden;border-top:6px solid #f59e0b}
            .header{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#111827;text-align:center;padding:22px}
            .header h1{margin:0;font-size:22px}
            .pill{display:inline-block;background:#111827;color:#fff;border-radius:999px;padding:6px 12px;font-weight:700;margin-top:10px}
            .section{padding:22px}
            .row{margin-bottom:12px}
            .label{display:inline-block;width:165px;color:#6b7280;font-weight:600}
            .value{color:#111827}
            .alert{background:#fff8e1;border:1px solid #ffe8a3;color:#92400e;border-radius:10px;padding:14px;margin:14px 0}
            .btn{display:inline-block;background:#0035F6;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;margin-top:12px}
            .footer{background:#f3f4f6;text-align:center;color:#6b7280;font-size:12px;padding:14px 10px}
            .logo{display:block;margin:20px auto 0;max-width:150px}
            .note{background:#fff3e0;border:1px solid #ffcc02;color:#e65100;border-radius:10px;padding:14px;margin:14px 0;font-weight:500}
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <h1>Aviso para Técnico</h1>
                <div class="pill">Ticket ' . htmlspecialchars($ticketnro) . '</div>
                </div>

                <div class="section">
                <p>Hola, <strong>' . htmlspecialchars($nombre_tecnico) . '</strong>.</p>
                <div class="alert"><strong>Se rechazó el documento:</strong> ' . htmlspecialchars($documentType) . '<br><strong>Motivo:</strong> ' . htmlspecialchars($motivoTexto) . '</div>
                <div class="row"><span class="label">Rechazado por:</span> <span class="value">' . htmlspecialchars($rejectedBy) . '</span></div>
                <div class="row"><span class="label">Fecha:</span> <span class="value">' . htmlspecialchars($ticketdatereject) . '</span></div>

                <div class="note">
                    <strong>⚠️ IMPORTANTE:</strong> DEBES CARGAR EL DOCUMENTO CORRESPONDIENTE.
                </div>

                <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0">

                <div class="row"><span class="label">RIF Cliente:</span> <span class="value">' . htmlspecialchars($clientRif) . '</span></div>
                <div class="row"><span class="label">Razón Social:</span> <span class="value">' . htmlspecialchars($clientName) . '</span></div>
                <div class="row"><span class="label">Serial POS:</span> <span class="value">' . htmlspecialchars($ticketserial) . '</span></div>

                <p style="text-align:center;margin-top:16px">
                    <a class="btn" href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '" style = "color: white;">Ver historial del ticket</a>
                </p>
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo" class="logo">' : '') . '
                </div>

               <div class="footer" style = "margin-top: -9%; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                    <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                    </div>
            </div>
            </div>
            </body>
            </html>
        ';

        // ========== CORREO 4: PARA ADMINISTRACIÓN (SOLO SI idrol == 5) ==========
        $subject_admin = 'Usuario de Administración rechazó documento - Ticket ' . $ticketnro;
        $body_admin = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Documento Rechazado por Administración</title>
            <style>
            body{margin:0;padding:0;background:#f6f8fb;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
            .container{max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.08);overflow:hidden;border-top:6px solid #8b5cf6}
            .header{background:linear-gradient(135deg,#a78bfa,#8b5cf6);color:#fff;text-align:center;padding:22px}
            .header h1{margin:0;font-size:22px}
            .pill{display:inline-block;background:#fff;color:#8b5cf6;border-radius:999px;padding:6px 12px;font-weight:700;margin-top:10px}
            .section{padding:22px}
            .row{margin-bottom:12px}
            .label{display:inline-block;width:165px;color:#6b7280;font-weight:600}
            .value{color:#111827}
            .badge{display:inline-block;padding:4px 10px;border-radius:999px;color:#fff;font-weight:700}
            .badge-admin{background:#8b5cf6}
            .alert{background:#faf5ff;border:1px solid #e9d5ff;color:#7c3aed;border-radius:10px;padding:14px;margin:14px 0}
            .btn{display:inline-block;background:#0035F6;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;margin-top:12px}
            .footer{background:#f3f4f6;text-align:center;color:#6b7280;font-size:12px;padding:14px 10px}
            .logo{display:block;margin:20px auto 0;max-width:150px}
            .note{background:#f3e5f5;border:1px solid #ce93d8;color:#7b1fa2;border-radius:10px;padding:14px;margin:14px 0;font-weight:500}
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <h1>Documento Rechazado por Administración</h1>
                <div class="pill">Ticket ' . htmlspecialchars($ticketnro) . '</div>
                </div>

                <div class="section">
                <div class="alert"><strong>El usuario <span style="color:#7c3aed;">' . htmlspecialchars($nombre_person_reject) . '</span> del área de Administración ha rechazado este documento.</strong></div>
                <div class="row"><span class="label">Documento:</span> <span class="value"><strong>' . htmlspecialchars($documentType) . '</strong></span></div>
                <div class="row"><span class="label">Motivo:</span> <span class="value">' . htmlspecialchars($motivoTexto) . '</span></div>
                <div class="row"><span class="label">Usuario Administración:</span> <span class="value">' . htmlspecialchars($rejectedBy) . '</span></div>
                <div class="row"><span class="label">Fecha:</span> <span class="value">' . htmlspecialchars($ticketdatereject) . '</span></div>

                <div class="note">
                    <strong>📢 Nota:</strong> Se le ha informado al técnico y al área de operaciones.
                </div>

                <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0">

                <div class="row"><span class="label">RIF Cliente:</span> <span class="value">' . htmlspecialchars($clientRif) . '</span></div>
                <div class="row"><span class="label">Razón Social:</span> <span class="value">' . htmlspecialchars($clientName) . '</span></div>
                <div class="row"><span class="label">Serial POS:</span> <span class="value">' . htmlspecialchars($ticketserial) . '</span></div>
                <div class="row"><span class="label">Estatus Ticket:</span> <span class="value"><span class="badge badge-admin">' . htmlspecialchars($ticketstatus) . '</span></span></div>

                <p style="text-align:center;margin-top:16px">
                    <a class="btn" href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '" style = "color: white;">Ver historial del ticket</a>
                </p>
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo" class="logo">' : '') . '
                </div>

                <div class="footer" style = "margin-top: -9%; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                    <p style="margin-top: 5px;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                </div>
            </div>
            </body>
            </html>
        ';

        // Variables de control
        $correo_coordinador_enviado = false;
        $correo_persona_reject_enviado = false;
        $correo_tecnico_enviado = false;
        $correo_admin_enviado = false;
        $mensaje_final = '';

        // Enviar correo al coordinador
        if ($this->emailService->sendEmail($email_area, $subject_coordinador, $body_coordinador, [], $embeddedImages)) {
            $correo_coordinador_enviado = true;
        }

        // Enviar correo a la persona que rechazó
        if ($email_person_reject && $resultUserreject) {
            if ($this->emailService->sendEmail($email_person_reject, $subject_persona_reject, $body_persona_reject, [], $embeddedImages)) {
                $correo_persona_reject_enviado = true;
            }
        }

        // Enviar correo al técnico que gestionó
        if ($email_tecnico && $result_tecnico) {
            if ($this->emailService->sendEmail($email_tecnico, $subject_tecnico, $body_tecnico, [], $embeddedImages)) {
                $correo_tecnico_enviado = true;
            }
        }

        // Enviar correo a administración SOLO si el que rechazó es de administración (idrol == 5)
        if ($idrol == 5 && $email_area_admin && $result_email_areaAdmin) {
            if ($this->emailService->sendEmail($email_area_admin, $subject_admin, $body_admin, [], $embeddedImages)) {
                $correo_admin_enviado = true;
            }
        }

        // Respuesta final
        $correos_enviados = [];
        if ($correo_coordinador_enviado) $correos_enviados[] = 'coordinación';
        if ($correo_persona_reject_enviado) $correos_enviados[] = 'persona que rechazó';
        if ($correo_tecnico_enviado) $correos_enviados[] = 'técnico';
        if ($correo_admin_enviado) $correos_enviados[] = 'administración';

        $total_correos = count($correos_enviados);
        $correos_esperados = ($idrol == 5) ? 4 : 3;

        if ($total_correos == $correos_esperados) {
            $mensaje = ($idrol == 5) 
                ? 'Correos enviados exitosamente a coordinación, persona que rechazó, técnico y administración.' 
                : 'Correos enviados exitosamente a coordinación, persona que rechazó y técnico.';
            $this->response(['success' => true, 'message' => $mensaje, 'color' => 'green']);
        } elseif ($total_correos > 0) {
            $this->response(['success' => true, 'message' => 'Correos enviados a: ' . implode(', ', $correos_enviados) . '.', 'color' => 'orange']);
        } else {
            $this->response(['success' => false, 'message' => 'Error al enviar todos los correos.', 'color' => 'red']);
        }
    }
}
?>