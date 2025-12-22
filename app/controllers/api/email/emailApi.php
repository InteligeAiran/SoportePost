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

use PHPMailer\PHPMailer\PHPMailer;
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
                        // Manejo del Recuperar contrasena
                    $this->handleRestorePassword();
                break;

                case 'send_ticket1':
                    // Manejo del envío de ticket finalizado de nivel 1
                    $this->handleSendTicket1();
                break;

                case 'send_ticket2':
                    // Manejo del envío de ticket nivel 2 como procesado (tecnico) y abierto coordinador
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

                case 'send_reassignment_email':
                    $this->handlesend_reassignment_email();
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
                    <strong><p>Solicitaste restablecer tu contraseña.</p></strong>
                    <strong><p>Ingresa el siguiente código para crear una nueva:  <span style = "background-color: #3f85ff; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 3.2em; text-align: center; margin: 22px auto; width: 200px; height: 50px; display: block; width: fit-content; border: 1px solid #000000;" class = "code">'.$codigo.'</span></p><strong>
                    <p style = "text-align: center; color: red; font-size: 0.9em;">Este código será su contraseña. Cambie nuevamente al iniciar Sesión.</p>
                    <p style = "text-align: center; color: #777; font-size: 0.9em;">ATT: InteliSoft</p>';

                $embeddedImages = [];
                if (defined('FIRMA_CORREO')) {
                    $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
                    $body .= '<img src="cid:imagen_adjunta" alt="Logo de la empresa" style="display: block; margin: 0 auto; width: 150px;">';
                }

                // NO ME ENVIABA EL CORREO Y LE PUSE UN ! ANTES DE $this->emailService->sendEmail($email, $subject, $body, [], $embeddedImages PARA QUE FUNCIONE
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
        $description_failure = $result1['description_falla1'];
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

            $subject = 'Ticket Nro. ' . $ticketnro . ' - Notificación de Cierre Exitoso';

        // Estructura HTML del Correo (Elegante y Empresarial)
        $base_body_html = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ticket Finalizado</title>
            </head>
            <body style="font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0;">
                <center>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f8f9fa;">
                    <tr>
                        <td align="center" style="padding: 30px 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                                
                                <tr>
                                    <td align="center" style="padding: 25px 20px; background-color: #003594; border-radius: 10px 10px 0 0; color: #ffffff;">
                                        <h1 style="font-size: 26px; margin: 0; font-weight: 600;">✅ TICKET FINALIZADO</h1>
                                        <p style="font-size: 15px; margin: 5px 0 0 0; opacity: 0.9;">Gestión de Soporte Técnico | InteliSoft</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 40px 40px 20px 40px; color: #333333; font-size: 16px;">
                                        <p style="margin-bottom: 25px;">Estimado(a), <strong style="color: #003594;">[NOMBRE_DESTINATARIO]</strong></p>
                                        <p style="margin-bottom: 30px; line-height: 1.6;">[MENSAJE_PRINCIPAL]</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 40px;">
                                        <table border="0" cellpadding="12" cellspacing="0" width="100%" style="background-color: #f4f6f8; border: 1px solid #e9ecef; border-radius: 8px;">
                                            <tr>
                                                <td colspan="2" style="background-color: #e9ecef; border-bottom: 1px solid #dcdcdc; border-radius: 8px 8px 0 0;">
                                                    <p style="font-size: 15px; font-weight: bold; color: #003594; margin: 0;">📋 RESUMEN DEL SERVICIO</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="35%" style="font-weight: 600; color: #555555; font-size: 14px; border-bottom: 1px dotted #e0e0e0;">Nro. Ticket:</td>
                                                <td width="65%" style="color: #333333; font-size: 14px; font-weight: bold; border-bottom: 1px dotted #e0e0e0;">' . $ticketnro . '</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: 600; color: #555555; font-size: 14px; border-bottom: 1px dotted #e0e0e0;">RIF Cliente:</td>
                                                <td style="color: #333333; font-size: 14px; border-bottom: 1px dotted #e0e0e0;">' . $clientRif . '</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: 600; color: #555555; font-size: 14px; border-bottom: 1px dotted #e0e0e0;">Serial POS:</td>
                                                <td style="color: #333333; font-size: 14px; border-bottom: 1px dotted #e0e0e0;">' . $ticketserial . '</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: 600; color: #555555; font-size: 14px; border-bottom: 1px dotted #e0e0e0;">Falla Reportada:</td>
                                                <td style="color: #333333; font-size: 14px; border-bottom: 1px dotted #e0e0e0;">' . $name_failure . ' (Nivel ' . $ticketNivelFalla . ')</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: 600; color: #555555; font-size: 14px; border-bottom: 1px dotted #e0e0e0;">Acción:</td>
                                                <td style="color: #333333; font-size: 14px; border-bottom: 1px dotted #e0e0e0;">' . $ticketaccion . '</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: 600; color: #555555; font-size: 14px;">Fecha de Cierre:</td>
                                                <td style="color: #333333; font-size: 14px;">' . $ticketfinished . '</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-top: 15px;">
                                                    <p style="font-weight: bold; color: #003594; margin-bottom: 5px; font-size: 15px;">Estatus Final:</p>
                                                    <span style="display: inline-block; padding: 5px 12px; border-radius: 4px; background-color: #d4edda; color: #155724; font-weight: bold; font-size: 14px;">' . strtoupper($ticketstatus) . '</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 30px 40px 20px 40px; color: #333333; font-size: 14px;">
                                        <p style="font-weight: bold; color: #003594; margin-bottom: 8px; font-size: 15px;">✍️ Descripción de la Falla:</p>
                                        <p style="margin-top: 0; padding: 12px; border-left: 4px solid #003594; background-color: #f9f9f9; border-radius: 0 4px 4px 0; line-height: 1.5;">' . (empty($description_failure) ? 'Sin descripción detallada registrada por el técnico.' : $description_failure) . '</p>
                                    </td>
                                </tr>';

                                /*<tr>
                                    <td align="center" style="padding: 10px 40px 40px 40px;">
                                        <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" 
                                        style="background-color: #003594; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
                                            🔍 VER EL HISTORIAL COMPLETO
                                        </a>
                                    </td>
                                </tr>*/

                                //PARA DESCOMENTAR SOLO QUITAR LA VARIABLE DE ABAJO Y EL ' 

                               $base_body_html .= '<tr>
                                    <td align="center" style="padding: 25px 40px; background-color: #f4f6f8; border-top: 1px solid #e9ecef; border-radius: 0 0 10px 10px; color: #666666; font-size: 12px;">
                                        ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo InteliSoft" style="max-width: 120px; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">' : '') . '
                                        <p style="margin: 5px 0;"><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                                        <p style="margin: 5px 0;">Este es un correo automático. Por favor, no responda a este mensaje.</p>
                                        <p style="margin: 5px 0;">&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                </center>
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
        try {
            // Log para verificar que se está ejecutando la función correcta
            error_log("EJECUTANDO handleSendTicket2 - " . date('Y-m-d H:i:s'));
            
            $repository = new EmailRepository();

            // 1. Validar datos de entrada
            $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
            if (empty($id_user)) {
                $this->response(['success' => false, 'message' => 'ID de usuario requerido.', 'color' => 'red']);
                return;
            }

            // 2. Obtener datos del área de coordinación
            $result_email_area = $repository->GetEmailArea();
            if (!$result_email_area) {
                error_log("ERROR: No se encontraron datos del área de coordinación");
                $this->response(['success' => false, 'message' => 'Correo del coordinador no existe o no se encontraron datos.', 'color' => 'red']);
                return;
            }

            $email_area = $result_email_area['email_area'] ?? '';
            $nombre_area = $result_email_area['name_area'] ?? 'Coordinación';
            
            if (empty($email_area)) {
                error_log("ERROR: El correo del área de coordinación está vacío");
                $this->response(['success' => false, 'message' => 'El correo del coordinador está vacío.', 'color' => 'red']);
                return;
            }
            
            error_log("EMAIL AREA COORDINACION: " . $email_area);

            // 3. Obtener datos del ticket
            $result_ticket = $repository->GetDataTicket2();
            if (!$result_ticket) {
                error_log("ERROR: No se encontraron datos del ticket nivel 2");
                $this->response(['success' => false, 'message' => 'No se encontraron datos del ticket.', 'color' => 'red']);
                return;
            }
            
            error_log("DATOS TICKET OBTENIDOS: " . print_r($result_ticket, true));

            // Preparar datos del ticket
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
            $ticketdomiciliacion = $result_ticket['name_status_domiciliacion'] ?? 'N/A';

            // Obtener datos adicionales
            $resultgetid_ticket = $repository->GetTicketId($ticketnro);
            $ticketid = $resultgetid_ticket['get_ticket_id'];
            $resultCoordinacion = $repository->GetCoordinacion($ticketid);
            $name_coordinador = $resultCoordinacion['get_department_name'] ?? 'N/A';

            // 4. Obtener información del cliente
            $result_client = $repository->GetClientInfo($ticketserial);
            $clientName = $result_client['razonsocial'] ?? 'N/A';
            $clientRif = $result_client['coddocumento'] ?? 'N/A';

            // Preparar imágenes embebidas
            $embeddedImages = [];
            if (defined('FIRMA_CORREO')) {
                $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
            }

            // 5. Enviar correo a COORDINACIÓN (Estilo Ejecutivo - Jerarquía Alta)
            $subject_coordinador = '🎯 NOTIFICACIÓN EJECUTIVA - Ticket Creado';
            $body_coordinador = $this->getCoordinatorEmailBodyForCreation(
                $nombre_area, 
                $nombre_tecnico_ticket, 
                $ticketnro, 
                $clientRif, 
                $clientName, 
                $ticketserial, 
                $ticketNivelFalla, 
                $name_failure, 
                $ticketfinished, 
                $ticketaccion, 
                $ticketstatus,
                $ticketprocess,
                $ticketpaymnet,
                $ticketdomiciliacion
            );

            
            // 6. Enviar correos según jerarquía
            $results = [
                'coordinador' => false,
                'tecnico' => false,
                'messages' => []
            ];
            
            // Enviar correo a COORDINACIÓN (Jerarquía Alta - Estilo Ejecutivo)
            error_log("INTENTANDO ENVIAR CORREO A COORDINADOR: " . $email_area);
            error_log("ASUNTO COORDINADOR: " . $subject_coordinador);
            $results['coordinador'] = $this->emailService->sendEmail($email_area, $subject_coordinador, $body_coordinador, [], $embeddedImages);
            
            // Log para verificar envío
            if (!$results['coordinador']) {
                $error_coordinador = $this->emailService->getLastError();
                error_log("ERROR AL ENVIAR CORREO COORDINADOR: " . $error_coordinador);
                $results['messages'][] = "Error al enviar correo a coordinación: " . $error_coordinador;
            } else {
                error_log("CORREO COORDINADOR ENVIADO: SI");
            }
            
            // Enviar correo a TÉCNICO (Jerarquía Operativa - Estilo Técnico)
            $result_tecnico = $repository->GetEmailUserDataById($id_user);
            error_log("DATOS TECNICO OBTENIDOS: " . ($result_tecnico ? 'SI' : 'NO'));
            if ($result_tecnico && !empty($result_tecnico['user_email'])) {
                $email_tecnico = $result_tecnico['user_email'];
                $nombre_tecnico = $result_tecnico['full_name'] ?? 'Técnico';
                
                error_log("INTENTANDO ENVIAR CORREO A TECNICO: " . $email_tecnico);

                // Template para TÉCNICO (Estilo Técnico - Jerarquía Operativa)
                $subject_tecnico = '✅ CONFIRMACIÓN TÉCNICA - Ticket Procesado';
                
                $body_tecnico = $this->getTechnicianEmailBody(
                    $nombre_tecnico,
                    $nombre_area,
                    $ticketnro, 
                    $clientRif, 
                    $clientName, 
                    $ticketserial, 
                    $ticketNivelFalla, 
                    $name_failure, 
                    $ticketfinished, 
                    $ticketaccion, 
                    $ticketpaymnet, 
                    $ticketstatus,
                    $ticketprocess,
                    $ticketdomiciliacion
                );

                $results['tecnico'] = $this->emailService->sendEmail($email_tecnico, $subject_tecnico, $body_tecnico, [], $embeddedImages);
                
                // Log para verificar envío
                if (!$results['tecnico']) {
                    $error_tecnico = $this->emailService->getLastError();
                    error_log("ERROR AL ENVIAR CORREO TECNICO: " . $error_tecnico);
                    $results['messages'][] = "Error al enviar correo al técnico: " . $error_tecnico;
                } else {
                    error_log("CORREO TECNICO ENVIADO: SI");
                }
            } else {
                $results['messages'][] = "No se pudo obtener el correo del técnico.";
                error_log("ERROR: No se pudo obtener el correo del técnico. ID_USER: " . $id_user);
                if ($result_tecnico) {
                    error_log("DATOS TECNICO: " . print_r($result_tecnico, true));
                }
            }

            // 6. Enviar correo a ADMINISTRACIÓN (Jerarquía Administrativa - Estilo de Notificación)
            $results['admin'] = false; // Inicializar
            $result_email_areaAdmin = $repository->GetEmailAreaAdmin();
            $email_area_admin = $result_email_areaAdmin['email_area'] ?? '';
            $name_area_admin = $result_email_areaAdmin['name_area'] ?? 'Administración';
            
            if (!empty($email_area_admin)) {
                error_log("INTENTANDO ENVIAR CORREO A ADMINISTRACION: " . $email_area_admin);
                $subject_admin = '📋 NOTIFICACIÓN ADMINISTRATIVA - Revisar Domiciliación del Ticket';
                $body_admin = $this->getAdminEmailBodyForTicketCreation(
                    $name_area_admin,
                    $nombre_tecnico_ticket,
                    $ticketnro,
                    $clientRif,
                    $clientName,
                    $ticketserial,
                    $ticketNivelFalla,
                    $name_failure,
                    $ticketfinished,
                    $ticketaccion,
                    $ticketstatus,
                    $ticketprocess,
                    $ticketpaymnet,
                    $ticketdomiciliacion
                );
                $results['admin'] = $this->emailService->sendEmail($email_area_admin, $subject_admin, $body_admin, [], $embeddedImages);

                if (!$results['admin']) {
                    $error_admin = $this->emailService->getLastError();
                    error_log("ERROR AL ENVIAR CORREO ADMINISTRACION: " . $error_admin);
                    $results['messages'][] = "Error al enviar correo a administración: " . $error_admin;
                } else {
                    error_log("CORREO ADMINISTRACION ENVIADO: SI");
                }
            } else {
                $results['messages'][] = "El correo del área de administración está vacío.";
                error_log("ERROR: El correo del área de administración está vacío.");
            }

            // 7. Responder según resultados
            $coordinador = $results['coordinador'];
            $tecnico = $results['tecnico'];
            $admin_sent = $results['admin'];
            $messages = implode(' ', $results['messages']);
            
            // Obtener errores detallados del EmailService
            $error_coordinador = $this->emailService->getLastError();
            $error_detalle = !empty($error_coordinador) ? " Detalle: " . $error_coordinador : "";
            
            if ($coordinador && $tecnico && $admin_sent) {
                $this->response(['success' => true, 'message' => 'Correos enviados exitosamente a coordinación, técnico y administración.', 'color' => 'green']);
            } elseif ($coordinador && $tecnico) {
                $this->response(['success' => true, 'message' => 'Correos enviados a coordinación y técnico. ' . $messages, 'color' => 'orange']);
            } elseif ($coordinador && $admin_sent) {
                $this->response(['success' => true, 'message' => 'Correos enviados a coordinación y administración. ' . $messages, 'color' => 'orange']);
            } elseif ($tecnico && $admin_sent) {
                $this->response(['success' => true, 'message' => 'Correos enviados a técnico y administración. ' . $messages, 'color' => 'orange']);
            } elseif ($coordinador) {
                $this->response(['success' => true, 'message' => 'Correo enviado a coordinación. ' . $messages, 'color' => 'orange']);
            } elseif ($tecnico) {
                $this->response(['success' => false, 'message' => 'Error al enviar correo a coordinación. Correo del técnico enviado. ' . $messages . $error_detalle, 'color' => 'red']);
            } elseif ($admin_sent) {
                $this->response(['success' => false, 'message' => 'Error al enviar correos a coordinación y técnico. Correo a administración enviado. ' . $messages . $error_detalle, 'color' => 'red']);
            } else {
                error_log("ERROR COMPLETO: Coordinador=" . ($coordinador ? 'SI' : 'NO') . ", Tecnico=" . ($tecnico ? 'SI' : 'NO') . ", Admin=" . ($admin_sent ? 'SI' : 'NO') . ", Messages=" . $messages);
                $this->response(['success' => false, 'message' => 'Error al enviar todos los correos. ' . $messages . $error_detalle, 'color' => 'red', 'debug' => [
                    'coordinador_sent' => $coordinador,
                    'tecnico_sent' => $tecnico,
                    'admin_sent' => $admin_sent,
                    'email_area' => $email_area ?? 'N/A',
                    'email_tecnico' => $email_tecnico ?? 'N/A',
                    'email_admin' => $email_area_admin ?? 'N/A',
                    'error_detail' => $error_coordinador
                ]]);
            }
            
        } catch (Exception $e) {
            $this->response(['success' => false, 'message' => 'Error interno: ' . $e->getMessage(), 'color' => 'red']);
            }
    }

    public function handleSendEndTicket() {
    $repository = new EmailRepository();

    // 1. Obtener ID del coordinador desde el POST y sus datos
    $result_email_area = $repository->GetEmailArea();

    // Si no se encuentra información del coordinador, no podemos continuar
    if (!$result_email_area) {
        $this->response(['success' => false, 'message' => 'Correo del coordinador no existe o no se encontraron datos.', 'color' => 'red']);
        return;
    }

    $email_area = $result_email_area['email_area'];
    $nombre_area = $result_email_area['name_area'];

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

    // Funcion para obtener el nombre de la coordinacion por el id_ticket
    $resultCoordinacion = $repository->GetCoordinacion($ticketid);
    $name_coordinador = $resultCoordinacion['get_department_name'] ?? 'N/A';

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
    $subject_coordinador = '🎯 NOTIFICACIÓN EJECUTIVA - Ticket Cerrado';
    $body_coordinador = '
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificación Ejecutiva - Ticket Cerrado</title>
            <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: #003594; color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 30px; }
            .greeting { font-size: 16px; color: #333; margin-bottom: 20px; text-align: center; }
            .message { font-size: 15px; color: #666; margin-bottom: 25px; text-align: center; line-height: 1.5; }
            .info-card { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; margin: 20px 0; }
            .info-title { font-size: 18px; font-weight: bold; color: #003594; margin-bottom: 15px; text-align: center; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { background: white; padding: 12px; border-radius: 4px; border-left: 3px solid #003594; }
            .info-label { font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
            .info-value { font-size: 14px; color: #333; font-weight: 500; }
            .status-badge { display: inline-block; background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-top: 15px; }
            .button { display: inline-block; background: #003594; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; }
            .logo { max-width: 150px; margin: 10px 0; }
            @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } .content { padding: 20px; } }
            </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
                <h1>🏁 TICKET CERRADO</h1>
                <p>Notificación Ejecutiva de Finalización</p>
                        </div>
            <div class="content">
                <div class="greeting">
                    Estimado/a <strong>Coordinación de ' . htmlspecialchars($name_coordinador) . '</strong>
                </div>
                <div class="message">
                    Nos complace informar que el técnico <strong>' . htmlspecialchars($nombre_tecnico_ticket) . '</strong> 
                    ha <strong style="color: #28a745;">CERRADO EXITOSAMENTE</strong> el siguiente ticket:
                </div>
                <div class="info-card">
                    <div class="info-title">📊 Resumen Ejecutivo</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">🎫 Número de Ticket</div>
                            <div class="info-value" style="color: #003594; font-weight: bold; font-size: 16px;">' . htmlspecialchars($ticketnro) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">🏢 RIF Cliente</div>
                            <div class="info-value">' . htmlspecialchars($clientRif) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">🏢 Razón Social</div>
                            <div class="info-value">' . htmlspecialchars($clientName) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">⚙️ Serial POS</div>
                            <div class="info-value" style="font-family: monospace; background: #e9ecef; padding: 4px 8px; border-radius: 3px;">' . htmlspecialchars($ticketserial) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">🔍 Nivel de Falla</div>
                            <div class="info-value">' . htmlspecialchars($ticketNivelFalla) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">❌ Falla Reportada</div>
                            <div class="info-value">' . htmlspecialchars($name_failure) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">📅 Fecha de Creación</div>
                            <div class="info-value">' . htmlspecialchars($ticketfinished) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">📦 Fecha de Entrega</div>
                            <div class="info-value">' . htmlspecialchars($fecha_entrega) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">💰 Estatus de Pago</div>
                            <div class="info-value">' . htmlspecialchars($ticketpayment) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">🏠 Estatus Domiciliación</div>
                            <div class="info-value">' . htmlspecialchars($ticketdomiciliacion) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">🔬 Estatus Laboratorio</div>
                            <div class="info-value">' . htmlspecialchars($ticketlab) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">💬 Comentario de Entrega</div>
                            <div class="info-value">' . htmlspecialchars($comentario_entrega) . '</div>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <span class="status-badge">✅ ' . htmlspecialchars($ticketstatus) . '</span>
                    </div>
                </div>';
                /*<div style="text-align: center;">
                    <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="button">
                        📋 Ver Detalles Completos
                    </a>
                        </div>
                </div>*/
                        
            $body_coordinador .= '<div class="footer">
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo">' : '') . '
                <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                            <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                            <p>&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                        </div>
        </div>
        </body>
    </html>';

    $embeddedImages = [];
    if (defined('FIRMA_CORREO')) {
        $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
    }

    $correo_coordinador_enviado = false;
    $correo_tecnico_enviado = false;

    // Enviar correo al coordinador
    if ($this->emailService->sendEmail($email_area, $subject_coordinador, $body_coordinador, [], $embeddedImages)) {
        $correo_coordinador_enviado = true;
    }

    // Enviar correo al técnico
    if ($email_tecnico && $result_tecnico) {
        $subject_tecnico = '✅ CONFIRMACIÓN TÉCNICA - Ticket Cerrado Exitosamente';
        $body_tecnico = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación Técnica - Ticket Cerrado</title>
                <style>
                body { font-family: Arial, sans-serif; background: #f0f8ff; margin: 0; padding: 20px; }
                .container { max-width: 550px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .header { background: #00b894; color: white; padding: 25px; text-align: center; }
                .header h1 { margin: 0; font-size: 22px; font-weight: bold; }
                .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; }
                .content { padding: 25px; }
                .greeting { font-size: 16px; color: #333; margin-bottom: 15px; text-align: center; font-weight: 500; }
                .message { font-size: 15px; color: #666; margin-bottom: 20px; text-align: center; line-height: 1.5; }
                .info-list { list-style: none; padding: 0; margin: 20px 0; }
                .info-item { background: #f8f9fa; margin: 8px 0; padding: 12px 15px; border-radius: 6px; border-left: 4px solid #00b894; }
                .info-label { font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
                .info-value { font-size: 14px; color: #333; font-weight: 500; }
                .status-badge { display: inline-block; background: #00b894; color: white; padding: 6px 12px; border-radius: 15px; font-size: 13px; font-weight: bold; margin-top: 10px; }
                .button { display: inline-block; background: #00b894; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0; font-size: 14px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 11px; border-top: 1px solid #e9ecef; }
                .logo { max-width: 120px; margin: 8px 0; }
                </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                    <h1>✅ ¡COMPLETADO!</h1>
                    <p>Confirmación de Cierre de Ticket</p>
                            </div>
                <div class="content">
                    <div class="greeting">
                        Hola, <strong>' . htmlspecialchars($nombre_tecnico) . '</strong>
                    </div>
                    <div class="message">
                        ¡Excelente trabajo! Has <strong style="color: #00b894;">CERRADO EXITOSAMENTE</strong> el siguiente ticket:
                    </div>
                    <ul class="info-list">
                        <li class="info-item">
                            <div class="info-label">🎫 Número de Ticket</div>
                            <div class="info-value" style="color: #00b894; font-weight: bold; font-size: 16px;">' . htmlspecialchars($ticketnro) . '</div>
                        </li>
                        <li class="info-item">
                            <div class="info-label">🏢 Cliente</div>
                            <div class="info-value">' . htmlspecialchars($clientName) . ' (' . htmlspecialchars($clientRif) . ')</div>
                        </li>
                        <li class="info-item">
                            <div class="info-label">⚙️ Serial POS</div>
                            <div class="info-value" style="font-family: monospace; background: #e9ecef; padding: 3px 6px; border-radius: 3px;">' . htmlspecialchars($ticketserial) . '</div>
                        </li>
                        <li class="info-item">
                            <div class="info-label">🔍 Nivel de Falla</div>
                            <div class="info-value">' . htmlspecialchars($ticketNivelFalla) . '</div>
                        </li>
                        <li class="info-item">
                            <div class="info-label">❌ Falla Diagnosticada</div>
                            <div class="info-value">' . htmlspecialchars($name_failure) . '</div>
                        </li>
                        <li class="info-item">
                            <div class="info-label">📅 Fecha de Creación</div>
                            <div class="info-value">' . htmlspecialchars($ticketfinished) . '</div>
                        </li>
                        <li class="info-item">
                            <div class="info-label">📦 Fecha de Entrega</div>
                            <div class="info-value">' . htmlspecialchars($fecha_entrega) . '</div>
                        </li>
                        <li class="info-item">
                            <div class="info-label">💬 Comentario Final</div>
                            <div class="info-value">' . htmlspecialchars($comentario_entrega) . '</div>
                        </li>
                    </ul>
                    <div style="text-align: center;">
                        <span class="status-badge">✅ ' . htmlspecialchars($ticketstatus) . '</span>
                    </div>';

                    /*<div style="text-align: center;">
                        <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="button">
                        📋 Ver Detalles del Ticket
                        </a>
                    </div>
                    </div>*/

                    $body_tecnico .= '<div class="footer">
                    ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo">' : '') . '
                    <p><strong>Sistema de Tickets Técnicos - InteliSoft</strong></p>
                    <p>Correo automático de confirmación técnica.</p>
                                <p>&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                            </div>
            </div>
            </body>
        </html>';

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
        $comentario_entrega =  $result_ticket['comment_devolution'] ?? 'Sin comentarios';

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
        $subject_coordinador = '🎯 NOTIFICACIÓN EJECUTIVA - Ticket por Devolución';
        $body_coordinador = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificación Ejecutiva - Ticket Devuelto</title>
                <style>
                body { 
                    font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0; 
                    padding: 40px 20px; 
                    min-height: 100vh;
                }
                .executive-container { 
                    max-width: 700px; 
                    margin: 0 auto; 
                    background: white; 
                    border-radius: 20px; 
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }
                .executive-header { 
                    background: linear-gradient(135deg, #003594 0%, #0066cc 100%);
                    color: white; 
                    padding: 40px 30px; 
                    text-align: center; 
                    position: relative;
                }
                .executive-header::before {
                    content: \'\';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
                }
                .executive-title { 
                    font-size: 2.2em; 
                    margin: 0 0 10px 0; 
                    font-weight: 800; 
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .executive-subtitle { 
                    font-size: 1.1em; 
                    opacity: 0.9; 
                    margin: 0;
                }
                .executive-content { 
                    padding: 40px 30px; 
                }
                .greeting { 
                    font-size: 1.3em; 
                    color: #003594; 
                    margin-bottom: 30px; 
                    font-weight: 600;
                    text-align: center;
                }
                .ticket-summary { 
                    background: #f8fafc; 
                    border: 2px solid #e2e8f0; 
                    border-radius: 15px; 
                    padding: 25px; 
                    margin: 25px 0;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                }
                .summary-title { 
                    color: #003594; 
                    font-size: 1.4em; 
                    font-weight: 700; 
                    margin: 0 0 20px 0; 
                    text-align: center;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #e2e8f0;
                }
                .info-grid { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 15px; 
                }
                .info-item { 
                    background: white; 
                    padding: 12px 15px; 
                    border-radius: 8px; 
                    border-left: 4px solid #0066cc;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .info-label { 
                    font-weight: 600; 
                    color: #666; 
                    font-size: 0.9em; 
                    margin-bottom: 5px; 
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .info-value { 
                    color: #333; 
                    font-weight: 700; 
                    font-size: 1.1em; 
                }
                .status-badge { 
                                display: inline-block; 
                    padding: 8px 16px; 
                    border-radius: 25px; 
                    font-weight: 600; 
                    font-size: 0.9em;
                }
                .status-devolution { 
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                    color: white; 
                }
                .action-button { 
                    display: inline-block; 
                    background: linear-gradient(135deg, #0066cc 0%, #003594 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    border-radius: 10px; 
                                text-decoration: none; 
                    font-weight: 600; 
                    font-size: 1.1em;
                    box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
                    transition: all 0.3s ease;
                }
                .action-button:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
                                text-decoration: none; 
                    color: white;
                }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; }
                .logo { max-width: 150px; margin: 10px 0; }
                .logo-header img { 
                    max-width: 150px; 
                    height: auto;
                            }
                </style>
            </head>
            <body>
            <div class="executive-container">
                <div class="executive-header">
                    <h1 class="executive-title">↩️ TICKET DEVUELTO</h1>
                    <p class="executive-subtitle">Notificación Ejecutiva de Devolución</p>
                    </div>
                <div class="executive-content">
                    <div class="greeting">
                        Estimado/a <strong>Coordinación de ' . htmlspecialchars($name_coordinador) . '</strong>
                    </div>
                    <p style="font-size: 1.2em; color: #495057; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                        Nos complace informar que el técnico <strong style="color: #003594;">' . htmlspecialchars($nombre_tecnico_ticket) . '</strong> 
                        ha <strong style="color: #28a745;">DEVUELTO EXITOSAMENTE</strong> el equipo POS asociado al siguiente ticket:
                    </p>
                    <div class="ticket-summary">
                        <h3 class="summary-title">📊 Resumen Ejecutivo del Ticket Devuelto</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">🎫 Número de Ticket</span>
                                <span class="info-value" style="color: #003594; font-weight: 700; font-size: 1.3em;">' . htmlspecialchars($ticketnro) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">🏢 RIF Cliente</span>
                                <span class="info-value">' . htmlspecialchars($clientRif) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">🏢 Razón Social</span>
                                <span class="info-value">' . htmlspecialchars($clientName) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">⚙️ Serial POS</span>
                                <span class="info-value" style="font-family: monospace; background: #e9ecef; padding: 4px 8px; border-radius: 4px;">' . htmlspecialchars($ticketserial) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">🔍 Nivel de Falla</span>
                                <span class="info-value">' . htmlspecialchars($ticketNivelFalla) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">❌ Falla Reportada</span>
                                <span class="info-value">' . htmlspecialchars($name_failure) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">📅 Fecha de Creación</span>
                                <span class="info-value">' . htmlspecialchars($ticketfinished) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">📦 Fecha de Entrega</span>
                                <span class="info-value">' . htmlspecialchars($fecha_entrega) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">💰 Estatus de Pago</span>
                                <span class="info-value">' . htmlspecialchars($ticketpayment) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">🏠 Estatus Domiciliación</span>
                                <span class="info-value">' . htmlspecialchars($ticketdomiciliacion) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">🔬 Estatus Laboratorio</span>
                                <span class="info-value">' . htmlspecialchars($ticketlab) . '</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">💬 Comentario Devolución</span>
                                <span class="info-value">' . htmlspecialchars($comentario_entrega) . '</span>
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 20px;">
                            <span class="status-badge status-devolution">
                                ✅ ' . htmlspecialchars($ticketstatus) . '
                            </span>
                        </div>
                    </div>';
                        /*<div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="action-button">
                                📋 Ver Detalles Completos del Ticket
                            </a>
                        </div>
                    </div>*/

                $body_coordinador .= '<div class="footer">
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo">' : '') . '
                <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                            <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                <p>&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                        </div>
                </div>
            </body>
        </html>';

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
            $subject_tecnico = '✅ CONFIRMACIÓN TÉCNICA - Equipo POS Devuelto Exitosamente';
            $body_tecnico = '
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación Técnica - Equipo Devuelto</title>
                    <style>
                    body { 
                        font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; 
                        background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
                        margin: 0; 
                        padding: 40px 20px; 
                        min-height: 100vh;
                    }
                    .technical-container { 
                        max-width: 650px; 
                        margin: 0 auto; 
                        background: white; 
                        border-radius: 15px; 
                        overflow: hidden;
                        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                    }
                    .technical-header { 
                        background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
                        color: white; 
                        padding: 35px 25px; 
                        text-align: center; 
                        position: relative;
                    }
                    .technical-header::before {
                        content: \'\';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 3px;
                        background: linear-gradient(90deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%);
                    }
                    .technical-title { 
                        font-size: 1.8em; 
                        margin: 0 0 8px 0; 
                        font-weight: 700; 
                        text-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    }
                    .technical-subtitle { 
                        font-size: 1em; 
                        opacity: 0.9; 
                        margin: 0;
                    }
                    .technical-content { 
                        padding: 35px 25px; 
                    }
                    .greeting { 
                        font-size: 1.2em; 
                        color: #00b894; 
                        margin-bottom: 25px; 
                        font-weight: 600;
                        text-align: center;
                    }
                    .ticket-details { 
                        background: #f8fffe; 
                        border: 2px solid #d1f2eb; 
                        border-radius: 12px; 
                        padding: 20px; 
                        margin: 20px 0;
                        box-shadow: 0 3px 6px rgba(0,0,0,0.05);
                    }
                    .details-title { 
                        color: #00b894; 
                        font-size: 1.2em; 
                        font-weight: 700; 
                        margin: 0 0 15px 0; 
                        text-align: center;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #d1f2eb;
                    }
                    .details-list { 
                        list-style: none; 
                        padding: 0; 
                        margin: 0;
                    }
                    .details-item { 
                        background: white; 
                        margin-bottom: 8px; 
                        padding: 10px 15px; 
                        border-radius: 6px; 
                        border-left: 3px solid #00b894;
                        display: flex;
                        align-items: center;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    }
                    .details-label { 
                        font-weight: 600; 
                        color: #666; 
                        font-size: 0.9em; 
                        margin-right: 15px; 
                        min-width: 140px;
                        flex-shrink: 0;
                    }
                    .details-value { 
                        color: #333; 
                        font-weight: 600; 
                        font-size: 1em; 
                        flex: 1;
                    }
                    .status-indicator { 
                                display: inline-block; 
                        padding: 6px 12px; 
                        border-radius: 20px; 
                        font-weight: 600; 
                        font-size: 0.8em;
                    }
                    .status-success { 
                        background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); 
                        color: white; 
                    }
                    .action-button { 
                        display: inline-block; 
                        background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); 
                        color: white; 
                                padding: 12px 25px; 
                        border-radius: 8px; 
                                text-decoration: none; 
                        font-weight: 600; 
                        font-size: 1em;
                        box-shadow: 0 3px 10px rgba(0, 184, 148, 0.3);
                        transition: all 0.3s ease;
                    }
                    .action-button:hover { 
                        transform: translateY(-1px); 
                        box-shadow: 0 4px 15px rgba(0, 184, 148, 0.4);
                                text-decoration: none; 
                        color: white;
                    }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; }
                    .logo { max-width: 150px; margin: 10px 0; }
                    .logo-section img { 
                        max-width: 120px; 
                        height: auto;
                    }
                    .code-style {
                        font-family: monospace;
                        background: #e8f5e8;
                        padding: 2px 6px;
                        border-radius: 3px;
                        color: #2d5016;
                            }
                    </style>
                </head>
                <body>
                <div class="technical-container">
                    <div class="technical-header">
                        <h1 class="technical-title">✅ EQUIPO DEVUELTO</h1>
                        <p class="technical-subtitle">Confirmación Técnica de Devolución</p>
                        </div>
                    <div class="technical-content">
                        <div class="greeting">
                            Hola, <strong>' . htmlspecialchars($nombre_tecnico) . '</strong>
                        </div>
                        <p style="font-size: 1.1em; color: #495057; line-height: 1.5; text-align: center; margin-bottom: 25px;">
                            ¡Excelente trabajo! Has <strong style="color: #00b894;">DEVUELTO EXITOSAMENTE</strong> el equipo POS y 
                            se ha notificado a la Coordinación de<strong style="color: #003594;">' . htmlspecialchars($name_coordinador) . '</strong>.
                        </p>
                        <div class="ticket-details">
                            <h3 class="details-title">🔧 Detalles Técnicos del Ticket</h3>
                            <ul class="details-list">
                                <li class="details-item">
                                    <span class="details-label">🎫 Número de Ticket:</span>
                                    <span class="details-value code-style">' . htmlspecialchars($ticketnro) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">🏢 RIF Cliente:</span>
                                    <span class="details-value">' . htmlspecialchars($clientRif) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">🏢 Razón Social:</span>
                                    <span class="details-value">' . htmlspecialchars($clientName) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">⚙️ Serial POS:</span>
                                    <span class="details-value code-style">' . htmlspecialchars($ticketserial) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">🔍 Nivel de Falla:</span>
                                    <span class="details-value">' . htmlspecialchars($ticketNivelFalla) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">❌ Falla Reportada:</span>
                                    <span class="details-value">' . htmlspecialchars($name_failure) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">📅 Fecha de Creación:</span>
                                    <span class="details-value">' . htmlspecialchars($ticketfinished) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">📦 Fecha de Entrega:</span>
                                    <span class="details-value">' . htmlspecialchars($fecha_entrega) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">📋 Acción del Ticket:</span>
                                    <span class="details-value">' . htmlspecialchars($ticketaccion) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">💰 Estatus de Pago:</span>
                                    <span class="details-value">' . htmlspecialchars($ticketpayment) . '</span>
                                </li>
                                <li class="details-item">
                                    <span class="details-label">💬 Comentario Devolución:</span>
                                    <span class="details-value">' . htmlspecialchars($comentario_entrega) . '</span>
                                </li>
                        </ul>
                            <div style="text-align: center; margin-top: 15px;">
                                <span class="status-indicator status-success">
                                    ✅ ' . htmlspecialchars($ticketstatus) . '
                                </span>
                            </div>
                        </div>';

                        /*<div style="text-align: center; margin: 25px 0;">
                            <a href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '&id_level_failure=' . urlencode($ticketNivelFalla) . '" class="action-button">
                                🔍 Ver Detalles del Ticket
                            </a>
                        </div>
                        </div>*/

            $body_tecnico .= '<div class="footer">
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo">' : '') . '
                <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                            <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                <p>&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
            </html>';

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
        $nroTicket = isset($_POST['nroTicket']) ? $_POST['nroTicket'] : ''; // ✅ OBTENER EL NRO TICKET CORRECTO
        $ticketId = isset($_POST['ticketId']) ? $_POST['ticketId'] : ''; 

        // EMAIL DEL AREA
        $result_email_area = $repository->GetEmailArea();

        // Si no se encuentra información del coordinador, no podemos continuar
        if (!$result_email_area) {
            $this->response(['success' => false, 'message' => 'Correo del coordinador no existe o no se encontraron datos.', 'color' => 'red']);
            return; // Salir de la función
        }

        $email_area = $result_email_area['email_area']; // El Gmail del AREA
        $nombre_area = $result_email_area['name_area']; // El nombre del AREA
        
        // Ahora obtener los datos del ticket usando el ID
        $result_ticket = $repository->GetTicketDataById($ticketId);
        // Verifica si se obtuvieron datos del ticket. Si no, algo anda mal.
        if (!$result_ticket) {
            $this->response(['success' => false, 'message' => 'No se encontraron datos del ticket.', 'color' => 'red']);
            return;
        }

        $result_email_areaAdmin = $repository->GetEmailAreaAdmin();
        $email_area_admin = $result_email_areaAdmin['email_area'] ?? '';
        $name_area_admin = $result_email_areaAdmin['name_area'] ?? '';

        $nombre_tecnico_ticket = $result_ticket['full_name_tecnico'] ?? 'N/A';
        $ticketNivelFalla = $result_ticket['id_level_failure'] ?? 'N/A';
        $name_failure = $result_ticket['name_failure'] ?? 'N/A';
        $ticketfinished = $result_ticket['create_ticket'] ?? 'N/A';
        $ticketstatus = $result_ticket['name_status_ticket'] ?? 'N/A';
        $ticketprocess = $result_ticket['name_process_ticket'] ?? 'N/A';
        $ticketaccion = $result_ticket['name_accion_ticket'] ?? 'N/A';
        $ticketserial = $result_ticket['serial_pos'] ?? 'N/A';
        $ticketnro = $result_ticket['nro_ticket'] ?? 'N/A';
        $ticketpaymnet = $result_ticket['name_status_payment'] ?? 'N/A';

        // ✅ El ticketid ya se obtuvo arriba usando el nroTicket correcto

        // Funcion para obtener el nobre de la coordinacion por el id_ticket
        $resultCoordinacion = $repository->GetCoordinacion($ticketId);
        $name_coordinador = $resultCoordinacion['get_department_name'] ?? 'N/A';

        //Funcion para traer los datos del documento rechazado usando el nroTicket correcto
        $resultDocumentoRechazado = $repository->GetDocumentoRechazado($nroTicket);
        
        // 🔍 DEBUG: Resultado GetDocumentoRechazado
        error_log("Resultado GetDocumentoRechazado: " . print_r($resultDocumentoRechazado, true));

        // ✅ Validar que se obtuvieron datos del documento rechazado
        if (!$resultDocumentoRechazado) {
            $this->response(['success' => false, 'message' => 'No se encontraron datos del documento rechazado.', 'color' => 'red']);
            return;
        }
        
        $motivoTexto = $resultDocumentoRechazado['name_motivo_rechazo'] ?? 'N/A';
        $documentType = $resultDocumentoRechazado['document_type'] ?? 'N/A';
        $idrejectby = $resultDocumentoRechazado['changed_by'] ?? 'N/A';
        $rejectedBy = $resultDocumentoRechazado['usuario_gestion'] ?? 'N/A';
        $ticketdatereject = $resultDocumentoRechazado['fecha_rechazo'] ?? 'N/A';

        // Datos del que gestionó el ticket
        $result_tecnico = $repository->GetEmailUser1gestionDataById( $ticketId, $documentType);
        $email_tecnico = $result_tecnico['user_email'] ?? '';
        $nombre_tecnico = $result_tecnico['full_name'] ?? 'Técnico';
        $id_rol = $result_tecnico['id_rolusr'] ?? '';
        $name_rol = $result_tecnico['name_rol'] ?? '';

        // Datos del que rechazó el documento
        $resultUserreject = $repository->resultUserreject($idrejectby);
        
        // ✅ Validar que se obtuvieron datos del usuario que rechazó
        if (!$resultUserreject) {
            $this->response(['success' => false, 'message' => 'No se encontraron datos del usuario que rechazó.', 'color' => 'red']);
            return;
        }
        
        $rolTecnico = $resultUserreject['name_rol'] ?? 'N/A';
        $idrol = $resultUserreject['id_rol'] ?? 'N/A';
        $nombre_person_reject = $resultUserreject['full_name'] ?? 'N/A';
        $email_person_reject = $resultUserreject['email'] ?? 'N/A';

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
            .footer{background:#f8f9fa;padding:20px;text-align:center;color:#666;font-size:12px;border-top:1px solid #e9ecef}
            .logo{max-width:150px;margin:10px 0}
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
                <div class="row"><span class="label">Estatus Ticket:</span> <span class="value"><span class="badge badge-warning">' . htmlspecialchars($ticketstatus) . '</span></span></div>';

                /*<p style="text-align:center;margin-top:16px">
                    <a class="btn" href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '" style = "color: white;">Ver historial del ticket</a>
                </p>*/

            $body_coordinador .= '<div class="footer">
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo">' : '') . '
                <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                <p>&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
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
            .footer{background:#f8f9fa;padding:20px;text-align:center;color:#666;font-size:12px;border-top:1px solid #e9ecef}
            .logo{max-width:150px;margin:10px 0}
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
                <div class="row"><span class="label">Estatus Ticket:</span> <span class="value"><span class="badge badge-success">' . htmlspecialchars($ticketstatus) . '</span></span></div>';

                /*<p style="text-align:center;margin-top:16px">
                    <a class="btn" href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '" style = "color: white;">Ver historial del ticket</a>
                </p>*/

            $body_persona_reject .= '<div class="footer">
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo">' : '') . '
                <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                <p>&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
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
            .footer{background:#f8f9fa;padding:20px;text-align:center;color:#666;font-size:12px;border-top:1px solid #e9ecef}
            .logo{max-width:150px;margin:10px 0}
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
                <div class="row"><span class="label">Serial POS:</span> <span class="value">' . htmlspecialchars($ticketserial) . '</span></div>';

                /*<p style="text-align:center;margin-top:16px">
                    <a class="btn" href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '" style = "color: white;">Ver historial del ticket</a>
                </p>*/

            $body_tecnico .= '<div class="footer">
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo">' : '') . '
                <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                <p>&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
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
            .footer{background:#f8f9fa;padding:20px;text-align:center;color:#666;font-size:12px;border-top:1px solid #e9ecef}
            .logo{max-width:150px;margin:10px 0}
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
                <div class="row"><span class="label">Estatus Ticket:</span> <span class="value"><span class="badge badge-admin">' . htmlspecialchars($ticketstatus) . '</span></span></div>';
                
                /*<p style="text-align:center;margin-top:16px">
                    <a class="btn" href="http://localhost/SoportePost/consultationGeneral?Serial=' . urlencode($ticketserial) . '&Proceso=' . urlencode($ticketprocess) . '" style = "color: white;">Ver historial del ticket</a>
                </p>*/

            $body_admin .= '<div class="footer">
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo">' : '') . '
                <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                <p>&copy; ' . date("Y") . ' InteliSoft. Todos los derechos reservados.</p>
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
        if ((int)$idrol == 5 && $email_area_admin && $result_email_areaAdmin) {
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
        $correos_esperados = ((int)$idrol == 5) ? 4 : 3;

        if ($total_correos == $correos_esperados) {
            $mensaje = ((int)$idrol == 5) 
                ? 'Correos enviados exitosamente a coordinación, persona que rechazó, técnico y administración.' 
                : 'Correos enviados exitosamente a coordinación, persona que rechazó y técnico.';
            $this->response(['success' => true, 'message' => $mensaje, 'color' => 'green']);
        } elseif ($total_correos > 0) {
            $this->response(['success' => true, 'message' => 'Correos enviados a: ' . implode(', ', $correos_enviados) . '.', 'color' => 'orange']);
        } else {
            $this->response(['success' => false, 'message' => 'Error al enviar todos los correos.', 'color' => 'red']);
        }
    }

    public function handlesend_reassignment_email() {
    $repository = new EmailRepository();
    
    // Obtener parámetros del POST
    $ticketId = isset($_POST['ticket_id']) ? $_POST['ticket_id'] : '';
    $oldTechnicianId = isset($_POST['old_technician_id']) ? $_POST['old_technician_id'] : '';
    $newTechnicianId = isset($_POST['new_technician_id']) ? $_POST['new_technician_id'] : '';

    if (empty($ticketId) || empty($oldTechnicianId) || empty($newTechnicianId)) {
        $this->response(['success' => false, 'message' => 'Faltan parámetros requeridos (ticket_id, old_technician_id, new_technician_id).', 'color' => 'red']);
        return;
    }

    try {
        // Obtener datos del ticket
        $ticketData = $repository->GetTicketDataById($ticketId);
        if (!$ticketData) {
            $this->response(['success' => false, 'message' => 'No se encontraron datos del ticket.', 'color' => 'red']);
            return;
        }

        // Obtener datos del técnico anterior
        $oldTechnicianData = $repository->GetEmailUserDataById($oldTechnicianId);
        if (!$oldTechnicianData) {
            $this->response(['success' => false, 'message' => 'No se encontraron datos del técnico anterior.', 'color' => 'red']);
            return;
        }

        // Obtener datos del nuevo técnico
        $newTechnicianData = $repository->GetEmailUserDataById($newTechnicianId);
        if (!$newTechnicianData) {
            $this->response(['success' => false, 'message' => 'No se encontraron datos del nuevo técnico.', 'color' => 'red']);
            return;
        }

        // Preparar imágenes embebidas
        $embeddedImages = [];
        if (defined('FIRMA_CORREO')) {
            $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
        }

        $correosEnviados = 0;
        $totalCorreos = 0;

        // 1. ENVIAR CORREO AL TÉCNICO ANTERIOR
        $totalCorreos++;
        $subjectPrevious = 'Notificación de Reasignación de Ticket';
        
        $bodyPrevious = '
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reasignación de Ticket</title>
            <style>
                body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-top: 5px solid #dc3545; }
                .header { text-align: center; padding-bottom: 20px; }
                .header h1 { color: #dc3545; font-size: 24px; margin: 0; }
                .ticket-info { margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; }
                .info-row { margin-bottom: 15px; }
                .info-label { color: #555; font-weight: bold; width: 140px; display: inline-block; }
                .info-value { color: #333; }
                .ticket-number { background-color: #e0f7fa; color: #007bff; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
                .new-technician { background-color: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; }
                .logo { max-width: 150px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Ticket Reasignado</h1>
                    <p>Estimado/a <strong>' . htmlspecialchars($oldTechnicianData['full_name']) . '</strong>,</p>
                </div>
                
                <div class="ticket-info">
                    <p>Le informamos que el siguiente ticket ha sido reasignado a otro técnico:</p>
                    
                    <div class="info-row">
                        <span class="info-label">Número de Ticket:</span>
                        <span class="info-value"><span class="ticket-number">' . htmlspecialchars($ticketData['nro_ticket']) . '</span></span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Serial POS:</span>
                        <span class="info-value">' . htmlspecialchars($ticketData['serial_pos'] ?? 'N/A') . '</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Cliente:</span>
                        <span class="info-value">' . htmlspecialchars($ticketData['razonsocial'] ?? 'N/A') . '</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">RIF Cliente:</span>
                        <span class="info-value">' . htmlspecialchars($ticketData['rif'] ?? 'N/A') . '</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Nuevo Técnico:</span>
                        <span class="info-value"><span class="new-technician">' . htmlspecialchars($newTechnicianData['full_name']) . '</span></span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Fecha de Reasignación:</span>
                        <span class="info-value">' . date('d/m/Y H:i:s') . '</span>
                    </div>
                </div>
                
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo">' : '') . '
                
                <div class="footer">
                    <p>Este es un mensaje automático del sistema de Soporte Post-Venta.</p>
                    <p>Por favor, no responda a este correo.</p>
                </div>
            </div>
        </body>
        </html>';

        // Enviar correo al técnico anterior
        if ($this->emailService->sendEmail($oldTechnicianData['user_email'], $subjectPrevious, $bodyPrevious, [], $embeddedImages)) {
            $correosEnviados++;
        }

        // 2. ENVIAR CORREO AL NUEVO TÉCNICO
        $totalCorreos++;
        $subjectNew = 'Nueva Asignación de Ticket';
        
        $bodyNew = '
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nueva Asignación de Ticket</title>
            <style>
                body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-top: 5px solid #28a745; }
                .header { text-align: center; padding-bottom: 20px; }
                .header h1 { color: #28a745; font-size: 24px; margin: 0; }
                .ticket-info { margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px; }
                .info-row { margin-bottom: 15px; }
                .info-label { color: #555; font-weight: bold; width: 140px; display: inline-block; }
                .info-value { color: #333; }
                .ticket-number { background-color: #e0f7fa; color: #007bff; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
                .status-badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-weight: bold; color: #fff; text-align: center; }
                .status-badge-assigned { background-color: #007bff; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; }
                .logo { max-width: 150px; margin: 10px 0; }
                .attention-message { text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #28a745; border-radius: 4px; }
                .attention-message p { margin: 0; font-weight: bold; color: #28a745; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nueva Asignación de Ticket</h1>
                    <p>Estimado/a <strong>' . htmlspecialchars($newTechnicianData['full_name']) . '</strong>,</p>
                </div>
                
                <div class="ticket-info">
                    <p>Le informamos que se le ha asignado un nuevo ticket para su atención:</p>
                    
                    <div class="info-row">
                        <span class="info-label">Número de Ticket:</span>
                        <span class="info-value"><span class="ticket-number">' . htmlspecialchars($ticketData['nro_ticket']) . '</span></span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Serial POS:</span>
                        <span class="info-value">' . htmlspecialchars($ticketData['serial_pos'] ?? 'N/A') . '</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Cliente:</span>
                        <span class="info-value">' . htmlspecialchars($ticketData['razonsocial'] ?? 'N/A') . '</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">RIF Cliente:</span>
                        <span class="info-value">' . htmlspecialchars($ticketData['rif'] ?? 'N/A') . '</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Modelo POS:</span>
                        <span class="info-value">' . htmlspecialchars($ticketData['name_modelopos'] ?? 'N/A') . '</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Estatus del Ticket:</span>
                        <span class="info-value"><span class="status-badge status-badge-assigned">Asignado al Técnico</span></span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Fecha de Asignación:</span>
                        <span class="info-value">' . date('d/m/Y H:i:s') . '</span>
                    </div>
                </div>
                
                <div class="attention-message">
                    <p>Por favor, proceda a revisar y atender este ticket lo antes posible.</p>
                </div>
                
                ' . (defined('FIRMA_CORREO') ? '<img src="cid:imagen_adjunta" alt="Logo de la empresa" class="logo">' : '') . '
                
                <div class="footer">
                    <p>Este es un mensaje automático del sistema de Soporte Post-Venta.</p>
                    <p>Por favor, no responda a este correo.</p>
                </div>
            </div>
        </body>
        </html>';

        // Enviar correo al nuevo técnico
        if ($this->emailService->sendEmail($newTechnicianData['user_email'], $subjectNew, $bodyNew, [], $embeddedImages)) {
            $correosEnviados++;
        }

        // Respuesta final
        if ($correosEnviados == $totalCorreos) {
            $this->response(['success' => true, 'message' => 'Correos de reasignación enviados exitosamente a ambos técnicos.', 'color' => 'green']);
        } elseif ($correosEnviados > 0) {
            $this->response(['success' => true, 'message' => "Se enviaron {$correosEnviados} de {$totalCorreos} correos de reasignación.", 'color' => 'orange']);
        } else {
            $this->response(['success' => false, 'message' => 'Error al enviar los correos de reasignación.', 'color' => 'red']);
        }

    } catch (Exception $e) {
        error_log('Error en handlesend_reassignment_email: ' . $e->getMessage());
        $this->response(['success' => false, 'message' => 'Error interno del servidor.', 'color' => 'red']);
        }
    }

    private function getCoordinatorEmailBodyForCreation($nombre_area, $nombre_tecnico_ticket, $ticketnro, $clientRif, $clientName, $ticketserial, $ticketNivelFalla, $name_failure, $ticketfinished, $ticketaccion, $ticketstatus, $ticketprocess,  $ticketpaymnet, $ticketdomiciliacion) {
        // Asegurar que el nivel solo contenga el número, sin "Nivel" duplicado
        $nivelValue = htmlspecialchars($ticketNivelFalla);
        // Si el valor ya contiene "Nivel", extraer solo el número
        if (preg_match('/Nivel\s*(\d+)/i', $nivelValue, $matches)) {
            $nivelValue = $matches[1]; // Solo el número
        } elseif (preg_match('/(\d+)/', $nivelValue, $matches)) {
            $nivelValue = $matches[1]; // Solo el número si hay uno
        }
        
        $map = [
            'ticket' => htmlspecialchars($ticketnro),
            'rif' => htmlspecialchars($clientRif),
            'razon' => htmlspecialchars($clientName),
            'serial' => htmlspecialchars($ticketserial),
            'falla' => htmlspecialchars($name_failure),
            'nivel' => $nivelValue, // Solo el número
            'fecha' => htmlspecialchars($ticketfinished),
            'accion' => htmlspecialchars($ticketaccion),
            'status' => htmlspecialchars($ticketstatus),
            'pago' => htmlspecialchars($ticketpaymnet),
            'domi' => htmlspecialchars($ticketdomiciliacion),
            'area' => htmlspecialchars($nombre_area),
            'tecnico' => htmlspecialchars($nombre_tecnico_ticket)
        ];
        $serialUrl = urlencode($ticketserial);
        $processUrl = urlencode($ticketprocess);
        $nivelUrl = urlencode($ticketNivelFalla);
        $currentYear = date("Y");
        
        // Preparar el logo HTML si está definido
        $logoHtml = '';
        if (defined('FIRMA_CORREO')) {
            $logoHtml = '<div class="logo-container"><img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo"></div>';
        }

        return <<<HTML
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificación Ejecutiva - Ticket Creado</title>
            <style>
        body{
            margin:0;
            padding:30px 0;
            background:#f1f5f9;
            font-family:'Inter','Segoe UI',sans-serif;
        }
        .card{
            background:#ffffff;
            max-width:650px;
            margin:0 auto;
            border-radius:24px;
            box-shadow:0 25px 80px rgba(15,23,42,0.12);
            overflow:hidden;
        }
        .header{
            background:linear-gradient(135deg,#003594 0%,#005cd3 100%);
            color:#ffffff;
            padding:30px;
            text-align:center;
        }
        .header h1{
            margin:0;
            font-size:26px;
            letter-spacing:0.5px;
        }
        .header p{
            margin:6px 0 0;
            font-size:15px;
            opacity:0.85;
        }
        .body{
            padding:30px 34px 24px;
        }
        .hello{
            text-align:center;
            font-size:17px;
            color:#0f172a;
            margin-bottom:22px;
        }
        .hello span{
            color:#003594;
            font-weight:700;
        }
        .hero-badge{
            background:#eff4ff;
            border:1px solid rgba(51,65,85,0.12);
            border-radius:18px;
            padding:14px 18px;
            text-align:center;
            font-size:14px;
            color:#475569;
            margin-bottom:28px;
        }
        .detail{
            display:flex;
            align-items:center;
            padding:14px 0;
            border-bottom:1px solid #edf2f7;
        }
        .detail:last-child{
            border-bottom:none;
        }
        .icon{
            width:45px;
            height:45px;
            border-radius:14px;
            background:#f8fafc;
            display:flex;
            align-items:center;
            justify-content:center;
            margin-right:14px;
            font-size:22px;
        }
        .label{
            font-size:12px;
            letter-spacing:0.6px;
            text-transform:uppercase;
            color:#94a3b8;
            margin-bottom:3px;
        }
        .value{
            font-size:16px;
            color:#0f172a;
            font-weight:600;
        }
        .value-serial{
            font-family:"JetBrains Mono","Courier New",monospace;
            font-size:15px;
            background:#f1f5f9;
            padding:4px 10px;
            border-radius:8px;
            color:#0f172a;
        }
        .status-row{
            display:flex;
            gap:12px;
            flex-wrap:wrap;
            margin:24px 0 6px;
            width:100%;
        }
        .status-pill{
            flex:1 1 calc(33.333% - 8px);
            min-width:180px;
            max-width:100%;
            background:#eff6ff;
            border-radius:18px;
            padding:13px 18px;
            display:flex;
            flex-direction:column;
            border:1px solid rgba(59,130,246,0.16);
            box-sizing:border-box;
            word-wrap:break-word;
            overflow-wrap:break-word;
        }
        .status-pill strong{
            color:#1d4ed8;
            font-size:11px;
            letter-spacing:0.5px;
            word-wrap:break-word;
            overflow-wrap:break-word;
            margin-right: 8%;
        }
        .status-pill span{
            color:#0f172a;
            font-weight:700;
            font-size:11px;
            word-wrap:break-word;
            overflow-wrap:break-word;
            line-height:1.4;
            hyphens:auto;
        }
        .button{
            display:block;
            margin:30px auto 10px;
            width:80%;
            max-width:320px;
            text-decoration:none;
            text-align:center;
            background:linear-gradient(135deg,#007bff,#0056b3);
            color:#ffffff;
            padding:15px;
            border-radius:999px;
            font-weight:600;
            letter-spacing:0.4px;
            box-shadow:0 15px 25px rgba(37,99,235,0.25);
        }
        .logo-container{
            text-align:center;
            margin:30px 0 20px;
        }
        .logo{
            max-width: 50%;
            height:auto;
            display:block;
            margin:0 auto;
            margin-top: -5px;
            margin-top: -25%;
        }
        .footer{
            padding:20px;
            text-align:center;
            font-size:12px;
            color:#94a3b8;
            background:#f8fafc;
            margin-top: -17%;
        }
        @media(max-width:580px){
            .body{padding:24px 20px;}
            .detail{flex-direction:column; align-items:flex-start;}
            .icon{margin-bottom:10px;}
            .status-row{flex-direction:column;}
            .status-pill{
                flex:1 1 100%;
                min-width:100%;
                max-width:100%;
            }
            .hero-badge{font-size:13px;}
        }
            </style>
        </head>
        <body>
    <div class="card">
        <div class="header">
            <h1>Ticket creado correctamente</h1>
            <p>Notificación Ejecutiva para Coordinación</p>
                </div>
        <div class="body">
            <div class="hello">Hola, <span>Gerencia de {$map['area']}</span></div>
            <div class="hero-badge">
                El técnico <strong>{$map['tecnico']}</strong> registró un nuevo ticket. A continuación se detalla la información más relevante.
                    </div>
            <div class="detail">
                <div class="icon">🎫</div>
                <div>
                    <div class="label">Número de Ticket</div>
                    <div class="value">#{$map['ticket']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">🏢</div>
                <div>
                    <div class="label">RIF / Razón Social</div>
                    <div class="value">{$map['rif']} &mdash; {$map['razon']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">🔧</div>
                <div>
                    <div class="label">Serial del Dispositivo</div>
                    <div class="value value-serial">{$map['serial']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">🚨</div>
                <div>
                    <div class="label">Nivel / Falla Reportada</div>
                    <div class="value">Nivel {$map['nivel']} &nbsp;|&nbsp; {$map['falla']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">📅</div>
                <div>
                    <div class="label">Fecha de Creación</div>
                    <div class="value">{$map['fecha']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">📝</div>
                <div>
                    <div class="label">Acción del Ticket</div>
                    <div class="value">{$map['accion']}</div>
                        </div>
                        </div>

            <div class="status-row">
                <div class="status-pill">
                    <strong>Estatus del Ticket</strong>
                    <span>{$map['status']}</span>
                    </div>
                <div class="status-pill">
                    <strong>Estatus de Pago</strong>
                    <span>{$map['pago']}</span>
                    </div>
                <div class="status-pill">
                    <strong>Estatus Domiciliación</strong>
                    <span>{$map['domi']}</span>
                </div>
            </div>

            <!--a class="button" href="http://localhost/SoportePost/consultationGeneral?Serial={$serialUrl}&Proceso={$processUrl}&id_level_failure={$nivelUrl}">
                Ver seguimiento completo del ticket
            </a-->
            {$logoHtml}
                </div>
                <div class="footer">
                    <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
            <p>&copy; {$currentYear} InteliSoft. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
</html>
HTML;
    }

    private function getTechnicianEmailBody($nombre_tecnico, $nombre_area, $ticketnro, $clientRif, $clientName, $ticketserial, $ticketNivelFalla, $name_failure, $ticketfinished, $ticketaccion, $ticketpaymnet, $ticketstatus, $ticketprocess, $ticketdomiciliacion) {
        // Asegurar que el nivel solo contenga el número, sin "Nivel" duplicado
        $nivelValue = htmlspecialchars($ticketNivelFalla);
        // Si el valor ya contiene "Nivel", extraer solo el número
        if (preg_match('/Nivel\s*(\d+)/i', $nivelValue, $matches)) {
            $nivelValue = $matches[1]; // Solo el número
        } elseif (preg_match('/(\d+)/', $nivelValue, $matches)) {
            $nivelValue = $matches[1]; // Solo el número si hay uno
        }
        
        $map = [
            'ticket' => htmlspecialchars($ticketnro),
            'rif' => htmlspecialchars($clientRif),
            'razon' => htmlspecialchars($clientName),
            'serial' => htmlspecialchars($ticketserial),
            'falla' => htmlspecialchars($name_failure),
            'nivel' => $nivelValue, // Solo el número
            'fecha' => htmlspecialchars($ticketfinished),
            'accion' => htmlspecialchars($ticketaccion),
            'status' => htmlspecialchars($ticketstatus),
            'pago' => htmlspecialchars($ticketpaymnet),
            'domi' => htmlspecialchars($ticketdomiciliacion),
            'tecnico' => htmlspecialchars($nombre_tecnico),
            'area' => htmlspecialchars($nombre_area)
        ];
        $serialUrl = urlencode($ticketserial);
        $processUrl = urlencode($ticketprocess);
        $nivelUrl = urlencode($ticketNivelFalla);
        $currentYear = date("Y");
        
        // Preparar el logo HTML si está definido
        $logoHtml = '';
        if (defined('FIRMA_CORREO')) {
            $logoHtml = '<div class="logo-container"><img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo"></div>';
        }

        return <<<HTML
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación Técnica - Ticket Procesado</title>
            <style>
        body{
            margin:0;
            padding:30px 0;
            background:linear-gradient(135deg,#00b894 0%,#00a085 100%);
            font-family:'Inter','Segoe UI',sans-serif;
        }
        .card{
            background:#ffffff;
            max-width:650px;
            margin:0 auto;
            border-radius:24px;
            box-shadow:0 25px 80px rgba(0,0,0,0.15);
            overflow:hidden;
        }
        .header{
            background:linear-gradient(135deg,#00b894 0%,#00a085 100%);
            color:#ffffff;
            padding:30px;
            text-align:center;
        }
        .header h1{
            margin:0;
            font-size:26px;
            letter-spacing:0.5px;
        }
        .header p{
            margin:6px 0 0;
            font-size:15px;
            opacity:0.9;
        }
        .body{
            padding:30px 34px 24px;
        }
        .hello{
            text-align:center;
            font-size:17px;
            color:#0f172a;
            margin-bottom:22px;
        }
        .hello span{
            color:#00b894;
            font-weight:700;
        }
        .hero-badge{
            background:#e8f5e9;
            border:1px solid rgba(0,184,148,0.2);
            border-radius:18px;
            padding:14px 18px;
            text-align:center;
            font-size:14px;
            color:#2e7d32;
            margin-bottom:28px;
        }
        .detail{
            display:flex;
            align-items:center;
            padding:14px 0;
            border-bottom:1px solid #edf2f7;
        }
        .detail:last-child{
            border-bottom:none;
        }
        .icon{
            width:45px;
            height:45px;
            border-radius:14px;
            background:#f0fdf4;
            display:flex;
            align-items:center;
            justify-content:center;
            margin-right:14px;
            font-size:22px;
        }
        .label{
            font-size:12px;
            letter-spacing:0.6px;
            text-transform:uppercase;
            color:#94a3b8;
            margin-bottom:3px;
        }
        .value{
            font-size:16px;
            color:#0f172a;
            font-weight:600;
        }
        .value-serial{
            font-family:"JetBrains Mono","Courier New",monospace;
            font-size:15px;
            background:#f1f5f9;
            padding:4px 10px;
            border-radius:8px;
            color:#0f172a;
        }
        .status-row{
            display:flex;
            gap:12px;
            flex-wrap:wrap;
            margin:24px 0 6px;
            width:100%;
        }
        .status-pill{
            flex:1 1 calc(33.333% - 8px);
            min-width:180px;
            max-width:100%;
            background:#e8f5e9;
            border-radius:18px;
            padding:13px 18px;
            display:flex;
            flex-direction:column;
            border:1px solid rgba(0,184,148,0.2);
            box-sizing:border-box;
            word-wrap:break-word;
            overflow-wrap:break-word;
        }
        .status-pill strong{
            color:#00b894;
            font-size:11px;
            letter-spacing:0.5px;
            word-wrap:break-word;
            overflow-wrap:break-word;
            margin-right:8%;
        }
        .status-pill span{
            color:#0f172a;
            font-weight:700;
            font-size:11px;
            word-wrap:break-word;
            overflow-wrap:break-word;
            line-height:1.4;
            hyphens:auto;
        }
        .button{
            display:block;
            margin:30px auto 10px;
            width:80%;
            max-width:320px;
            text-decoration:none;
            text-align:center;
            background:linear-gradient(135deg,#00b894,#00a085);
            color:#ffffff;
            padding:15px;
            border-radius:999px;
            font-weight:600;
            letter-spacing:0.4px;
            box-shadow:0 15px 25px rgba(0,184,148,0.25);
        }
        .logo-container{
            text-align:center;
            margin:30px 0 20px;
        }
        .logo{
            max-width:50%;
            height:auto;
            display:block;
            margin:0 auto;
            margin-top:-5px;
            margin-top:-25%;
        }
        .footer{
            padding:20px;
            text-align:center;
            font-size:12px;
            color:#94a3b8;
            background:#f8fafc;
            margin-top:-17%;
        }
        @media(max-width:580px){
            .body{padding:24px 20px;}
            .detail{flex-direction:column; align-items:flex-start;}
            .icon{margin-bottom:10px;}
            .status-row{flex-direction:column;}
            .status-pill{
                flex:1 1 100%;
                min-width:100%;
                max-width:100%;
            }
            .hero-badge{font-size:13px;}
                }
            </style>
        </head>
        <body>
    <div class="card">
        <div class="header">
            <h1>✅ Ticket procesado correctamente</h1>
            <p>Confirmación Técnica</p>
                </div>
        <div class="body">
            <div class="hello">Hola, <span>{$map['tecnico']}</span></div>
            <div class="hero-badge">
                Tu ticket ha sido <strong>PROCESADO EXITOSAMENTE</strong> y se ha notificado al área de <strong>{$map['area']}</strong>.
                    </div>
            <div class="detail">
                <div class="icon">🎫</div>
                <div>
                    <div class="label">Número de Ticket</div>
                    <div class="value">#{$map['ticket']}</div>
                    </div>
            </div>
            <div class="detail">
                <div class="icon">🏢</div>
                <div>
                    <div class="label">RIF / Razón Social</div>
                    <div class="value">{$map['rif']} &mdash; {$map['razon']}</div>
                </div>
            </div>
            <div class="detail">
                <div class="icon">🔧</div>
                <div>
                    <div class="label">Serial del Dispositivo</div>
                    <div class="value value-serial">{$map['serial']}</div>
                </div>
            </div>
            <div class="detail">
                <div class="icon">🚨</div>
                <div>
                    <div class="label">Nivel / Falla Reportada</div>
                    <div class="value">Nivel {$map['nivel']} &nbsp;|&nbsp; {$map['falla']}</div>
                </div>
            </div>
            <div class="detail">
                <div class="icon">📅</div>
                <div>
                    <div class="label">Fecha de Creación</div>
                    <div class="value">{$map['fecha']}</div>
                </div>
            </div>
            <div class="detail">
                <div class="icon">📝</div>
                <div>
                    <div class="label">Acción del Ticket</div>
                    <div class="value">{$map['accion']}</div>
                        </div>
                    </div>
                    
            <div class="status-row">
                <div class="status-pill">
                    <strong>Estatus del Ticket</strong>
                    <span>{$map['status']}</span>
                </div>
                <div class="status-pill">
                    <strong>Estatus de Pago</strong>
                    <span>{$map['pago']}</span>
                </div>
                <div class="status-pill">
                    <strong>Estatus Domiciliación</strong>
                    <span>{$map['domi']}</span>
                    </div>
                </div>
                
            <!--a class="button" href="http://localhost/SoportePost/consultationGeneral?Serial={$serialUrl}&Proceso={$processUrl}&id_level_failure={$nivelUrl}">
                Ver seguimiento completo del ticket
            </a-->
            {$logoHtml}
        </div>
                <div class="footer">
                    <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
            <p>&copy; {$currentYear} InteliSoft. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
</html>
HTML;
    }

    private function getAdminEmailBodyForTicketCreation($nombre_area_admin, $nombre_tecnico_ticket, $ticketnro, $clientRif, $clientName, $ticketserial, $ticketNivelFalla, $name_failure, $ticketfinished, $ticketaccion, $ticketstatus, $ticketprocess, $ticketpaymnet, $ticketdomiciliacion) {
        // Asegurar que el nivel solo contenga el número, sin "Nivel" duplicado
        $nivelValue = htmlspecialchars($ticketNivelFalla);
        // Si el valor ya contiene "Nivel", extraer solo el número
        if (preg_match('/Nivel\s*(\d+)/i', $nivelValue, $matches)) {
            $nivelValue = $matches[1]; // Solo el número
        } elseif (preg_match('/(\d+)/', $nivelValue, $matches)) {
            $nivelValue = $matches[1]; // Solo el número si hay uno
        }
        
        $map = [
            'ticket' => htmlspecialchars($ticketnro),
            'rif' => htmlspecialchars($clientRif),
            'razon' => htmlspecialchars($clientName),
            'serial' => htmlspecialchars($ticketserial),
            'falla' => htmlspecialchars($name_failure),
            'nivel' => $nivelValue, // Solo el número
            'fecha' => htmlspecialchars($ticketfinished),
            'accion' => htmlspecialchars($ticketaccion),
            'status' => htmlspecialchars($ticketstatus),
            'pago' => htmlspecialchars($ticketpaymnet),
            'domi' => htmlspecialchars($ticketdomiciliacion),
            'area_admin' => htmlspecialchars($nombre_area_admin),
            'tecnico' => htmlspecialchars($nombre_tecnico_ticket)
        ];
        $currentYear = date("Y");
        $logoHtml = '';
        if (defined('FIRMA_CORREO')) {
            $logoHtml = '<div class="logo-container"><img src="cid:imagen_adjunta" alt="Logo InteliSoft" class="logo"></div>';
        }

        return <<<HTML
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificación Administrativa - Revisar Domiciliación</title>
            <style>
        body{
            margin:0;
            padding:30px 0;
            background:#f8f9fa;
            font-family:'Inter','Segoe UI',sans-serif;
        }
        .card{
            background:#ffffff;
            max-width:650px;
            margin:0 auto;
            border-radius:24px;
            box-shadow:0 25px 80px rgba(0,0,0,0.12);
            overflow:hidden;
        }
        .header{
            background:linear-gradient(135deg,#6f42c1 0%,#8a2be2 100%);
            color:#ffffff;
            padding:30px;
            text-align:center;
        }
        .header h1{
            margin:0;
            font-size:26px;
            letter-spacing:0.5px;
        }
        .header p{
            margin:6px 0 0;
            font-size:15px;
            opacity:0.85;
        }
        .body{
            padding:30px 34px 24px;
        }
        .hello{
            text-align:center;
            font-size:17px;
            color:#0f172a;
            margin-bottom:22px;
        }
        .hello span{
            color:#6f42c1;
            font-weight:700;
        }
        .hero-badge{
            background:#f3e5f5;
            border:1px solid rgba(111,66,193,0.2);
            border-radius:18px;
            padding:14px 18px;
            text-align:center;
            font-size:14px;
            color:#6f42c1;
            margin-bottom:28px;
        }
        .detail{
            display:flex;
            align-items:center;
            padding:14px 0;
            border-bottom:1px solid #edf2f7;
        }
        .detail:last-child{
            border-bottom:none;
        }
        .icon{
            width:45px;
            height:45px;
            border-radius:14px;
            background:#f8f0fc;
            display:flex;
            align-items:center;
            justify-content:center;
            margin-right:14px;
            font-size:22px;
        }
        .label{
            font-size:12px;
            letter-spacing:0.6px;
            text-transform:uppercase;
            color:#94a3b8;
            margin-bottom:3px;
        }
        .value{
            font-size:16px;
            color:#0f172a;
            font-weight:600;
        }
        .value-serial{
            font-family:"JetBrains Mono","Courier New",monospace;
            font-size:15px;
            background:#f1f5f9;
            padding:4px 10px;
            border-radius:8px;
            color:#0f172a;
        }
        .status-row{
            display:flex;
            gap:12px;
            flex-wrap:wrap;
            margin:24px 0 6px;
            width:100%;
        }
        .status-pill{
            flex:1 1 calc(33.333% - 8px);
            min-width:180px;
            max-width:100%;
            background:#f3e5f5;
            border-radius:18px;
            padding:13px 18px;
            display:flex;
            flex-direction:column;
            border:1px solid rgba(111,66,193,0.2);
            box-sizing:border-box;
            word-wrap:break-word;
            overflow-wrap:break-word;
        }
        .status-pill strong{
            color:#6f42c1;
            font-size:11px;
            letter-spacing:0.5px;
            word-wrap:break-word;
            overflow-wrap:break-word;
            margin-right:8%;
        }
        .status-pill span{
            color:#0f172a;
            font-weight:700;
            font-size:11px;
            word-wrap:break-word;
            overflow-wrap:break-word;
            line-height:1.4;
            hyphens:auto;
        }
        .attention-box{
            background:#f0e6fa;
            border:2px solid #d8bcfc;
            border-radius:12px;
            padding:20px;
            margin-top:25px;
            text-align:center;
        }
        .attention-box p{
            margin:0;
            font-size:1.1em;
            color:#6f42c1;
            font-weight:600;
            line-height:1.5;
        }
        .logo-container{
            text-align:center;
            margin:30px 0 20px;
        }
        .logo{
            max-width:50%;
            height:auto;
            display:block;
            margin:0 auto;
            margin-top:-5px;
            margin-top:-25%;
        }
        .footer{
            padding:20px;
            text-align:center;
            font-size:12px;
            color:#94a3b8;
            background:#f8fafc;
            margin-top:-17%;
        }
        @media(max-width:580px){
            .body{padding:24px 20px;}
            .detail{flex-direction:column; align-items:flex-start;}
            .icon{margin-bottom:10px;}
            .status-row{flex-direction:column;}
            .status-pill{
                flex:1 1 100%;
                min-width:100%;
                max-width:100%;
            }
            .hero-badge{font-size:13px;}
        }
            </style>
        </head>
        <body>
    <div class="card">
        <div class="header">
            <h1>Revisar Domiciliación</h1>
            <p>Notificación Administrativa</p>
                </div>
        <div class="body">
            <div class="hello">Hola, <span>Área de {$map['area_admin']}</span></div>
            <div class="hero-badge">
                El técnico <strong>{$map['tecnico']}</strong> ha registrado un nuevo ticket. Por favor, revise la domiciliación asociada.
                    </div>
            <div class="detail">
                <div class="icon">🎫</div>
                <div>
                    <div class="label">Número de Ticket</div>
                    <div class="value">#{$map['ticket']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">🏢</div>
                <div>
                    <div class="label">RIF / Razón Social</div>
                    <div class="value">{$map['rif']} &mdash; {$map['razon']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">🔧</div>
                <div>
                    <div class="label">Serial del Dispositivo</div>
                    <div class="value value-serial">{$map['serial']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">🚨</div>
                <div>
                    <div class="label">Nivel / Falla Reportada</div>
                    <div class="value">Nivel {$map['nivel']} &nbsp;|&nbsp; {$map['falla']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">📅</div>
                <div>
                    <div class="label">Fecha de Creación</div>
                    <div class="value">{$map['fecha']}</div>
                            </div>
                            </div>
            <div class="detail">
                <div class="icon">📝</div>
                <div>
                    <div class="label">Acción del Ticket</div>
                    <div class="value">{$map['accion']}</div>
                        </div>
                        </div>

            <div class="status-row">
                <div class="status-pill">
                    <strong>Estatus del Ticket</strong>
                    <span>{$map['status']}</span>
                    </div>
                <div class="status-pill">
                    <strong>Estatus de Pago</strong>
                    <span>{$map['pago']}</span>
                    </div>
                <div class="status-pill">
                    <strong>Estatus Domiciliación</strong>
                    <span>{$map['domi']}</span>
                </div>
            </div>

            <div class="attention-box">
                <p><strong>¡Atención!</strong> Por favor, verifique el estatus de domiciliación de este ticket.</p>
            </div>

            {$logoHtml}
                </div>
                <div class="footer">
                    <p><strong>Sistema de Gestión de Tickets - InteliSoft</strong></p>
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
            <p>&copy; {$currentYear} InteliSoft. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
</html>
HTML;
    }
}
?>