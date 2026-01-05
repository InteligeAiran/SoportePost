<?php
namespace App\Controllers\Api\reportes; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/View.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../repositories/ReportRepository.php';
require_once __DIR__ . '/../../../repositories/UserRepository.php';
require_once __DIR__ . '/../../../repositories/EmailRepository.php';
require_once __DIR__ . '/../../../repositories/technicalConsultionRepository.php';
require_once __DIR__ . '/../../../Services/EmailServices.php';

require_once __DIR__ . '/../../../../config/paths.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Repositories\ReportRepository;
use App\Repositories\UserRepository;
use App\Repositories\EmailRepository;
use App\Repositories\technicalConsultionRepository;
use App\Services\EmailService;
use Controller;
use DatabaseCon;
use Exception;

class reportes extends Controller {
    private $db;
    private $emailService; // Service for handling email operations
    // ... otras propiedades que necesites

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
                case 'SearchRegionData':
                    $this->handleSearchRegionData();
                break;

                case 'SearchRifData':
                    $this->handleSearchRifData();
                break;

                case 'SearchSerialData':
                    $this->handleSearchSerialData();
                break;

                case 'SearchRangeDate':
                    $this->handleSearchRangeData();
                break;

                case 'getDomiciliacionTickets':
                    $this->handlegetDomiciliacionTickets();
                break;

                case 'getTicketAbiertoCount':
                    $this->handlegetgetTicketAbiertoCount();
                break;

                case 'getTicketsResueltosCount':
                    $this->handlegetTicketsResueltosCount();
                break;

                case 'getTicketsTotalCount':
                    $this->handlegetTicketsTotalCount();
                break;

                case 'getTicketPercentage':
                    $this->handleGetTicketPercentage();
                break;

                case 'getTicketsResueltosPercentage':
                    $this->handleGetTicketsResueltosPercentage();
                break;

                case 'getTotalTicketsInProcess':
                    $this->handlegetTotalTicketsInProcess();
                break;

                case 'GetTicketDataFinal':
                    $this->handleGetTicketDataFinal();
                break;
                
                case 'uploadDocument':
                    $this->uploadDocument();
                break;

                case 'uploadDocumentnNew':
                    $this->uploadDocumentnNew();
                break;

                case 'uploadDocumentTec':
                    $this->uploadDocumentTec();
                break;

                case 'getDocument':
                    $this->getDocument();
                break;

                case 'GetMonthlyTicketDetails':
                    $this->GetMonthlyTicketDetails();
                break;

                case 'GetIndividualTicketDetails':
                    $this->GetIndividualTicketDetails();
                break;

                case 'GetMonthlyCreatedTicketsForChart':
                    $this->GetMonthlyCreatedTicketsForChart();
                break;

                case 'GetMonthlyTicketPercentageChange':
                    $this->GetMonthlyTicketPercentageChange();
                break;

                case 'GetMonthlyCreatedTicketsForChartForState':
                    $this->GetMonthlyCreatedTicketsForChartForState();
                break;

                case 'GetRegionsTicketDetails':
                    $this->GetRegionsTicketDetails();
                break;

                case 'GetIndividualTicketDetailsByRegion':
                    $this->GetIndividualTicketDetailsByRegion();
                break;

                case 'getTicketsSendTallerTotalCount':
                    $this->handleGgetTicketsSendTallerTotalCount();
                break;

                case 'getTotalTicketsPercentageSendToTaller':
                    $this->handlegetTotalTicketsPercentageSendToTaller();
                break;

                case 'GetTicketOpenDetails':
                    $this->handleGetTicketOpenDetails();
                break;

                case 'GetResolveTicketsForCard':
                    $this->handleGetResolveTicketsForCard();
                break;

                case 'GetTallerTicketsForCard':
                    $this->handleGetTallerTicketsForCard();
                break;

                case 'GetTicketsPendienteReparacion':
                    $this->handleGetTicketsPendienteReparacion();
                break;

                case 'getTicketsProcessReparacionCount':
                    $this->handlegetTicketsProcessReparacionCount();
                break;

                case 'getTicketsReparadosCount':
                    $this->handleGetTicketsReparadosCount();
                break;

                case 'GetTicketsYaEstanReparados':
                    $this->handleGetTicketsReparado();
                break;

                case 'GetTicketsPendientesPorRepuestos':
                    $this->handleGetTicketsPendientesPorRepuestos();
                break;

                case 'getTicketPendienteRepuestoCount':
                    $this->handlegetTicketPendienteRepuestoCount();
                break;

                case 'getTicketIrreparablesCount':
                    $this->handleGetTicketIrreparablesCount();
                break;

                case 'GetTicketsIrreparables':
                    $this->handleGetTicketsIrreparables();
                break;

                case 'getTotalTicketsPercentageinprocess':
                    $this->handlegetTotalTicketsPercentageinprocess();
                break;
                
                case 'GetTicketsInProcess':
                    $this->handleGetTicketsInProcess();
                break;

                case 'GetTicketTimeline' :
                    $this->handleGetTicketTimeline();
                break;

                case 'tickets-pending-document-approval':
                    $this->ticketsPendingDocumentApproval();
                break;

                case 'GetTicketDataRegion':
                    $this->GetTicketDataRegion();
                break;

                case 'SaveComponents':
                    $this->SaveComponents();
                break;

                case 'SearchEstatusData':
                    $this->SearchEstatusData();
                break;

                case 'getTicketsgestioncomercialPorcent':
                    $this->getTicketsgestioncomercialPorcent();
                break;

                case 'getTicketGestionComercialCount':
                    $this->getTicketGestionComercialCount();
                break;

                case 'getTicketEntregadoCliente':
                    $this->handlegetTicketEntregadoCliente();
                break;

                case 'GetTicketCounts':
                    $this->handleGetTicketCounts();
                break;

                case 'GetDetalleTicketComercial':
                    $this->handleGetDetalleTicketComercial();
                break;

                case 'GetTicketEntregadoClienteDetails':
                    $this->handleEntregadoClienteDetails();

                case 'SearchBancoData':
                    $this->handleSearchBancoData();
                break;

                default:
                    $this->response(['error' => 'Acción no encontrada en access'], 404);
                break;
            }
        } else {
            $this->response(['error' => 'Acción no especificada en access'], 400);
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

    private function handleSearchRegionData() {
        $id_region = isset($_POST['id_region'])? $_POST['id_region'] : null;
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;
        $idtipouser = isset($_POST['idtipouser'])? $_POST['idtipouser'] : null;

        $repository = new ReportRepository(); // Inicializa el repositorio
        $result = $repository->GetAllDataTicket($id_region,$id_user,$idtipouser);
        //var_dump($result);

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay usuarios disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los usuarios'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Usuario']);
    }

    public function handleSearchRifData(){
        $rif = isset($_POST['rif'])? $_POST['rif'] : null;
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;
        $idtipouser = isset($_POST['idtipouser'])? $_POST['idtipouser'] : null;

        $repository = new ReportRepository(); // Inicializa el repositorio
        $result = $repository->SearchRif($rif,$id_user,$idtipouser);

         if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay rif disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los rif'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Coloque un rif']);
    }

    public function handleSearchSerialData(){
        $serial = isset($_POST['serial'])? $_POST['serial'] : null;
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;
        $idtipouser = isset($_POST['idtipouser'])? $_POST['idtipouser'] : null;

        $repository = new ReportRepository(); // Inicializa el repositorio
        $result = $repository->SearchSerial($serial,$id_user,$idtipouser);

        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay serial disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los serial'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Coloque un serial']);
    }

    public function handleSearchRangeData(){
        $repository = new ReportRepository();
        $ini_date = isset($_POST['initial'])? $_POST['initial'] : null;
        $end_date = isset($_POST['second'])? $_POST['second'] : null; 
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;
        $idtipouser = isset($_POST['idtipouser'])? $_POST['idtipouser'] : null;

        $result = $repository->SearchRangeData($ini_date, $end_date, $id_user, $idtipouser);
        if($ini_date !== null && $end_date !== null) {
            if ($result) {
                $this->response(['success' => true, 'ticket' => $result], 200);
            }else{
                $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Tickets Abiertos por Mes.'], 500);
            }
        }else{
            $this->response(['success' => false,'message' => 'Debe ingresar una fecha.'], 400);
        }
    }

    public function handlegetDomiciliacionTickets(){
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;
        $repository = new ReportRepository(); // Inicializa el repositorio
        $result = $repository->getDomiciliacionTickets($id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'tickets' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handlegetgetTicketAbiertoCount(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->getTicketabiertoCount($id_rol, $id_user);
        if ($result !== null) {
            $this->response(['success' => true, 'count' => $result], 200);
        } else {
            $this->response(['success' => false, 'userCount' => 0], 200);
        }
        $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Tickets Abiertos.'], 500);
    }

    public function handlegetTicketsResueltosCount(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->getTicketsResueltosCount($id_rol, $id_user);
        if ($result) {
            $this->response(['success' => true, 'count' => $result], 200);
        } else {
            $this->response(['success' => false, 'userCount' => 0], 200);
        }
        $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Tickets Resueltos.'], 500);
    }

    public function handlegetTicketsTotalCount(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['user_id'])? $_POST['user_id'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->getTicketsTotalCount($id_rol, $id_user);
        if ($result) {
            $this->response(['success' => true, 'count' => $result], 200);
        } else {
            $this->response(['success' => false, 'userCount' => 0], 200);
        }
        $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Total de Tickets.'], 500);
    }

    // Luego, crea la función handleGetTicketPercentage
    public function handleGetTicketPercentage(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['user_id'])? $_POST['user_id'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->getTicketPercentageData($id_rol, $id_user);
        if ($result) {
            $this->response(['success' => true, 'count' => $result], 200);
        } else {
            $this->response(['success' => false, 'userCount' => 0], 200);
        }
        $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Total de Tickets.'], 500);
    }

    public function handleGetTicketsResueltosPercentage(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->getTicketsResueltosPercentageData($id_rol, $id_user);

        if ($result) {
            $this->response(['success' => true, 'count' => $result], 200);
        } else {
            $this->response(['success' => false, 'userCount' => 0], 200);
        }
        $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Total de Tickets.'], 500);
    }

    public function handleGetTicketDataFinal(){
        $repository = new ReportRepository();
        $result = $repository->getTicketDataFinal();
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function uploadDocument(){
        // 1. Instancia el repositorio para interactuar con la base de datos
        $repository = new ReportRepository();

        // 2. Obtiene los datos del POST y FILES
        $id_ticket = isset($_POST['ticket_id']) ? $_POST['ticket_id'] : null;
        $file = isset($_FILES['document_file']) ? $_FILES['document_file'] : null;
        $document_type = isset($_POST['document_type']) ? $_POST['document_type'] : null;
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : null;
        $nro_ticket = isset($_POST['nro_ticket'])? $_POST['nro_ticket'] : null;

        //var_dump($id_ticket, $file, $document_type, $id_user, $nro_ticket);


        // 3. Validación inicial de la solicitud
        if (!$id_ticket || !$file || $file['error'] !== UPLOAD_ERR_OK || !$document_type || !$id_user) {
            $errorMessage = 'Error en la subida: ';
            if (!$id_ticket) $errorMessage .= 'ID de ticket no proporcionado. ';
            if (!$id_user) $errorMessage .= 'ID de usuario no proporcionado. ';
            if (!$file) $errorMessage .= 'Archivo no proporcionado. ';
            if (!$document_type) $errorMessage .= 'Tipo de documento no proporcionado. ';
            if ($file && $file['error'] !== UPLOAD_ERR_OK) {
                $errorMessage .= 'Error de subida del archivo. Código de error: ' . $file['error'];
            }
            $this->response(['success' => false, 'message' => $errorMessage], 400);
            return;
        }
        
        // 4. Procesa la información del archivo
        $originalDocumentName = basename($file['name']);
        $documentSize = $file['size'];
        $documentType = $file['type'];
        $mimeTypeFromFrontend = isset($_POST['mime_type']) ? $_POST['mime_type'] : $documentType;

        // 5. Obtiene el serial del ticket
        $ticketDetails = $repository->getTicketDetailsById($id_ticket);
        if (!$ticketDetails || !isset($ticketDetails[0]['serial'])) {
            $this->response(['success' => false, 'message' => 'No se pudo obtener el serial del ticket. Por favor, asegúrese de que el ticket existe.'], 500);
            return;
        }
        $serial = $ticketDetails[0]['serial'];

        // 6. Configura y crea la estructura de carpetas
        $cleanSerial = preg_replace("/[^a-zA-Z0-9_-]/", "_", $serial);
        $baseUploadDir = UPLOAD_BASE_DIR;
        $serialUploadDir = $baseUploadDir . $cleanSerial . DIRECTORY_SEPARATOR;
        $ticketUploadDir = $serialUploadDir . $nro_ticket . DIRECTORY_SEPARATOR;
        if (!is_dir($baseUploadDir)) {
            if (!mkdir($baseUploadDir, 0755, true)) {
                error_log("Error al crear el directorio base: " . $baseUploadDir);
                $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (base).'], 500);
                return;
            }
        }
        if (!is_dir($serialUploadDir)) {
            if (!mkdir($serialUploadDir, 0755, true)) {
                error_log("Error al crear el directorio del serial: " . $serialUploadDir);
                $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (serial).'], 500);
                return;
            }
        }
        if (!is_dir($ticketUploadDir)) {
            if (!mkdir($ticketUploadDir, 0755, true)) {
                error_log("Error al crear el directorio del ticket: " . $ticketUploadDir);
                $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (ticket).'], 500);
                return;
            }
        }
        
        // Ahora creamos el subdirectorio para el tipo de documento
        $documentTypeDir = $ticketUploadDir . $document_type . DIRECTORY_SEPARATOR;
        if (!is_dir($documentTypeDir)) {
            if (!mkdir($documentTypeDir, 0755, true)) {
                $this->response(['success' => false, 'message' => 'No se pudo crear el subdirectorio para el tipo de documento: ' . $documentTypeDir], 500);
                return;
            }
        }
        
        // 7. Genera un nombre de archivo único y descriptivo
        $info = pathinfo($originalDocumentName);
        $nombreSinExtension = $info['filename'];
        $extension = isset($info['extension']) ? '.' . $info['extension'] : '';
        $cleanNombreSinExtension = preg_replace("/[^a-zA-Z0-9_\-.]/", "_", $nombreSinExtension);

        $dateForFilename = date('Ymd_His');
        $uniqueFileName = $document_type . '_' . $dateForFilename . '_' . uniqid() . '_' . $cleanNombreSinExtension . $extension;

        // La ruta completa donde se guardará el archivo en el sistema de archivos
        $uploadPath = $documentTypeDir . $uniqueFileName;
        
        // RUTA RELATIVA para la base de datos y la web
        $filePathForDatabase = UPLOAD_BASE_DIR . $cleanSerial . '/' . $nro_ticket . '/' . $document_type . '/' . $uniqueFileName;
        
        // 8. Mueve el archivo temporal al destino final
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            try {
                // 9. Llama al repositorio para guardar la información
                $success = $repository->saveDocument(
                    $nro_ticket,
                    $originalDocumentName,
                    $uniqueFileName, // <--- CAMBIO: Nombre del archivo único
                    $filePathForDatabase,
                    $mimeTypeFromFrontend,
                    $documentSize,
                    $id_user,
                    $document_type,
                    $id_ticket
                );

                if ($success) {
                    $responseData = [
                        'success' => true,
                        'message' => 'Documento subido y registrado exitosamente.',
                        'ticket_id' => $id_ticket,
                        'original_filename' => $originalDocumentName,
                        'stored_filename' => $uniqueFileName,
                        'file_path' => $filePathForDatabase,
                        'mime_type' => $mimeTypeFromFrontend,
                        'file_size_bytes' => $documentSize,
                        'uploaded_by_user_id' => $id_user,
                        'document_type' => $document_type
                    ];
                    $this->response($responseData, 200);
                } else {
                    // 11. Si hubo un error en la DB, borra el archivo y responde con error
                    unlink($uploadPath);
                    $this->response(['success' => false, 'message' => 'El archivo se subió, pero hubo un error al registrarlo en la base de datos.'], 500);
                }
            } catch (\Exception $e) {
                unlink($uploadPath);
                $this->response(['success' => false, 'message' => 'Error interno al guardar el documento: ' . $e->getMessage()], 500);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error al mover el archivo subido. Verifique los permisos de escritura en la carpeta de destino.'], 500);
        }
    }

    public function uploadDocumentnNew(){
         // 1. Instancia el repositorio para interactuar con la base de datos
        $repository = new ReportRepository();

        // 2. Obtiene los datos del POST y FILES
        $id_ticket = isset($_POST['ticket_id']) ? $_POST['ticket_id'] : null;
        $file = isset($_FILES['document_file']) ? $_FILES['document_file'] : null;
        $document_type = isset($_POST['document_type']) ? $_POST['document_type'] : null;
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : null;
        $nro_ticket = isset($_POST['nro_ticket'])? $_POST['nro_ticket'] : null;


        // 3. Validación inicial de la solicitud
        if (!$id_ticket || !$file || $file['error'] !== UPLOAD_ERR_OK || !$document_type || !$id_user) {
            $errorMessage = 'Error en la subida: ';
            if (!$id_ticket) $errorMessage .= 'ID de ticket no proporcionado. ';
            if (!$id_user) $errorMessage .= 'ID de usuario no proporcionado. ';
            if (!$file) $errorMessage .= 'Archivo no proporcionado. ';
            if (!$document_type) $errorMessage .= 'Tipo de documento no proporcionado. ';
            if ($file && $file['error'] !== UPLOAD_ERR_OK) {
                $errorMessage .= 'Error de subida del archivo. Código de error: ' . $file['error'];
            }
            $this->response(['success' => false, 'message' => $errorMessage], 400);
            return;
        }
        
        // 4. Procesa la información del archivo
        $originalDocumentName = basename($file['name']);
        $documentSize = $file['size'];
        $documentType = $file['type'];
        $mimeTypeFromFrontend = isset($_POST['mime_type']) ? $_POST['mime_type'] : $documentType;

        // 5. Obtiene el serial del ticket
        $ticketDetails = $repository->getTicketDetailsById($id_ticket);
        if (!$ticketDetails || !isset($ticketDetails[0]['serial'])) {
            $this->response(['success' => false, 'message' => 'No se pudo obtener el serial del ticket. Por favor, asegúrese de que el ticket existe.'], 500);
            return;
        }
        $serial = $ticketDetails[0]['serial'];

        // 6. Configura y crea la estructura de carpetas
        $cleanSerial = preg_replace("/[^a-zA-Z0-9_-]/", "_", $serial);
        $baseUploadDir = UPLOAD_BASE_DIR;
        $serialUploadDir = $baseUploadDir . $cleanSerial . DIRECTORY_SEPARATOR;
        $ticketUploadDir = $serialUploadDir . $nro_ticket . DIRECTORY_SEPARATOR;
        if (!is_dir($baseUploadDir)) {
            if (!mkdir($baseUploadDir, 0755, true)) {
                error_log("Error al crear el directorio base: " . $baseUploadDir);
                $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (base).'], 500);
                return;
            }
        }
        if (!is_dir($serialUploadDir)) {
            if (!mkdir($serialUploadDir, 0755, true)) {
                error_log("Error al crear el directorio del serial: " . $serialUploadDir);
                $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (serial).'], 500);
                return;
            }
        }
        if (!is_dir($ticketUploadDir)) {
            if (!mkdir($ticketUploadDir, 0755, true)) {
                error_log("Error al crear el directorio del ticket: " . $ticketUploadDir);
                $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (ticket).'], 500);
                return;
            }
        }
        
        // Ahora creamos el subdirectorio para el tipo de documento
        $documentTypeDir = $ticketUploadDir . $document_type . DIRECTORY_SEPARATOR;
        if (!is_dir($documentTypeDir)) {
            if (!mkdir($documentTypeDir, 0755, true)) {
                $this->response(['success' => false, 'message' => 'No se pudo crear el subdirectorio para el tipo de documento: ' . $documentTypeDir], 500);
                return;
            }
        }
        
        // 7. Genera un nombre de archivo único y descriptivo
        $info = pathinfo($originalDocumentName);
        $nombreSinExtension = $info['filename'];
        $extension = isset($info['extension']) ? '.' . $info['extension'] : '';
        $cleanNombreSinExtension = preg_replace("/[^a-zA-Z0-9_\-.]/", "_", $nombreSinExtension);

        $dateForFilename = date('Ymd_His');
        $uniqueFileName = $document_type . '_' . $dateForFilename . '_' . uniqid() . '_' . $cleanNombreSinExtension . $extension;

        // La ruta completa donde se guardará el archivo en el sistema de archivos
        $uploadPath = $documentTypeDir . $uniqueFileName;
        
        // RUTA RELATIVA para la base de datos y la web
        $filePathForDatabase = UPLOAD_BASE_DIR . $cleanSerial . '/' . $nro_ticket . '/' . $document_type . '/' . $uniqueFileName;
        
        // 8. Mueve el archivo temporal al destino final
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            try {
                // 9. Llama al repositorio para guardar la información
                $success = $repository->saveDocument1(
                    $nro_ticket,
                    $originalDocumentName,
                    $uniqueFileName, // <--- CAMBIO: Nombre del archivo único
                    $filePathForDatabase,
                    $mimeTypeFromFrontend,
                    $documentSize,
                    $id_user,
                    $document_type,
                    $id_ticket
                );

                if ($success) {
                    $responseData = [
                        'success' => true,
                        'message' => 'Documento subido y registrado exitosamente.',
                        'ticket_id' => $id_ticket,
                        'original_filename' => $originalDocumentName,
                        'stored_filename' => $uniqueFileName,
                        'file_path' => $filePathForDatabase,
                        'mime_type' => $mimeTypeFromFrontend,
                        'file_size_bytes' => $documentSize,
                        'uploaded_by_user_id' => $id_user,
                        'document_type' => $document_type
                    ];
                    $this->response($responseData, 200);
                } else {
                    // 11. Si hubo un error en la DB, borra el archivo y responde con error
                    unlink($uploadPath);
                    $this->response(['success' => false, 'message' => 'El archivo se subió, pero hubo un error al registrarlo en la base de datos.'], 500);
                }
            } catch (\Exception $e) {
                unlink($uploadPath);
                $this->response(['success' => false, 'message' => 'Error interno al guardar el documento: ' . $e->getMessage()], 500);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error al mover el archivo subido. Verifique los permisos de escritura en la carpeta de destino.'], 500);
        }
    }

    public function uploadDocumentTec(){
        // 1. Instancia el repositorio para interactuar con la base de datos
        $repository = new ReportRepository();

        // 2. Obtiene los datos del POST y FILES
        $id_ticket = isset($_POST['ticket_id']) ? $_POST['ticket_id'] : null;
        $file = isset($_FILES['document_file']) ? $_FILES['document_file'] : null;
        $document_type = isset($_POST['document_type']) ? $_POST['document_type'] : null;
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : null;
        $nro_ticket = isset($_POST['nro_ticket'])? $_POST['nro_ticket'] : null;

        //var_dump($id_ticket, $file, $document_type, $id_user, $nro_ticket);


        // 3. Validación inicial de la solicitud
        if (!$file || $file['error'] !== UPLOAD_ERR_OK || !$document_type || !$id_user) {
            $errorMessage = 'Error en la subida: ';
            if (!$id_ticket) $errorMessage .= 'ID de ticket no proporcionado. ';
            if (!$id_user) $errorMessage .= 'ID de usuario no proporcionado. ';
            if (!$file) $errorMessage .= 'Archivo no proporcionado. ';
            if (!$document_type) $errorMessage .= 'Tipo de documento no proporcionado. ';
            if ($file && $file['error'] !== UPLOAD_ERR_OK) {
                $errorMessage .= 'Error de subida del archivo. Código de error: ' . $file['error'];
            }
            $this->response(['success' => false, 'message' => $errorMessage], 400);
            return;
        }
        
        // 4. Procesa la información del archivo
        $originalDocumentName = basename($file['name']);
        $documentSize = $file['size'];
        $documentType = $file['type'];
        $mimeTypeFromFrontend = isset($_POST['mime_type']) ? $_POST['mime_type'] : $documentType;

        // 5. Obtiene el serial del ticket
        $ticketDetails = $repository->getTicketDetailsById($id_ticket);
        if (!$ticketDetails || !isset($ticketDetails[0]['serial'])) {
            $this->response(['success' => false, 'message' => 'No se pudo obtener el serial del ticket. Por favor, asegúrese de que el ticket existe.'], 500);
            return;
        }
        $serial = $ticketDetails[0]['serial'];

        // 6. Configura y crea la estructura de carpetas
        $cleanSerial = preg_replace("/[^a-zA-Z0-9_-]/", "_", $serial);
        $baseUploadDir = UPLOAD_BASE_DIR;
        $serialUploadDir = $baseUploadDir . $cleanSerial . DIRECTORY_SEPARATOR;
        $ticketUploadDir = $serialUploadDir . $nro_ticket . DIRECTORY_SEPARATOR;
        if (!is_dir($baseUploadDir)) {
            if (!mkdir($baseUploadDir, 0755, true)) {
                error_log("Error al crear el directorio base: " . $baseUploadDir);
                $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (base).'], 500);
                return;
            }
        }
        if (!is_dir($serialUploadDir)) {
            if (!mkdir($serialUploadDir, 0755, true)) {
                error_log("Error al crear el directorio del serial: " . $serialUploadDir);
                $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (serial).'], 500);
                return;
            }
        }
        if (!is_dir($ticketUploadDir)) {
            if (!mkdir($ticketUploadDir, 0755, true)) {
                error_log("Error al crear el directorio del ticket: " . $ticketUploadDir);
                $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (ticket).'], 500);
                return;
            }
        }
        
        // Ahora creamos el subdirectorio para el tipo de documento
        $documentTypeDir = $ticketUploadDir . $document_type . DIRECTORY_SEPARATOR;
        if (!is_dir($documentTypeDir)) {
            if (!mkdir($documentTypeDir, 0755, true)) {
                $this->response(['success' => false, 'message' => 'No se pudo crear el subdirectorio para el tipo de documento: ' . $documentTypeDir], 500);
                return;
            }
        }
        
        // 7. Genera un nombre de archivo único y descriptivo
        $info = pathinfo($originalDocumentName);
        $nombreSinExtension = $info['filename'];
        $extension = isset($info['extension']) ? '.' . $info['extension'] : '';
        $cleanNombreSinExtension = preg_replace("/[^a-zA-Z0-9_\-.]/", "_", $nombreSinExtension);

        $dateForFilename = date('Ymd_His');
        $uniqueFileName = $document_type . '_' . $dateForFilename . '_' . uniqid() . '_' . $cleanNombreSinExtension . $extension;

        // La ruta completa donde se guardará el archivo en el sistema de archivos
        $uploadPath = $documentTypeDir . $uniqueFileName;
        
        // RUTA RELATIVA para la base de datos y la web
        $filePathForDatabase = UPLOAD_BASE_DIR . $cleanSerial . '/' . $nro_ticket . '/' . $document_type . '/' . $uniqueFileName;
        
        // 8. Mueve el archivo temporal al destino final
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            try {
                // 9. Llama al repositorio para guardar la información
                $success = $repository->saveDocument2(
                    $nro_ticket,
                    $originalDocumentName,
                    $uniqueFileName, // <--- CAMBIO: Nombre del archivo único
                    $filePathForDatabase,
                    $mimeTypeFromFrontend,
                    $documentSize,
                    $id_user,
                    $document_type,
                    $id_ticket
                );

                if ($success) {
                    // NO actualizar id_status_payment aquí porque el modelo reportsModel 
                    // ya lo hace correctamente en saveDocument2() usando determineStatusPayment()
                    // Solo actualizar a 5 o 7 cuando TODOS los documentos necesarios estén presentes
                    // (esto se maneja en el modelo, no aquí)
                    
                    // Enviar correos si es Anticipo o Exoneración
                    $this->sendEmailForDocumentUpload($id_ticket, $document_type, $serial, $nro_ticket);
                    
                    $responseData = [
                        'success' => true,
                        'message' => 'Documento subido y registrado exitosamente.',
                        'ticket_id' => $id_ticket,
                        'original_filename' => $originalDocumentName,
                        'stored_filename' => $uniqueFileName,
                        'file_path' => $filePathForDatabase,
                        'mime_type' => $mimeTypeFromFrontend,
                        'file_size_bytes' => $documentSize,
                        'uploaded_by_user_id' => $id_user,
                        'document_type' => $document_type
                    ];
                    $this->response($responseData, 200);
                } else {
                    // 11. Si hubo un error en la DB, borra el archivo y responde con error
                    unlink($uploadPath);
                    $this->response(['success' => false, 'message' => 'El archivo se subió, pero hubo un error al registrarlo en la base de datos.'], 500);
                }
            } catch (\Exception $e) {
                unlink($uploadPath);
                $this->response(['success' => false, 'message' => 'Error interno al guardar el documento: ' . $e->getMessage()], 500);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error al mover el archivo subido. Verifique los permisos de escritura en la carpeta de destino.'], 500);
        }
    }

    function getDocument(){
        $repository = new ReportRepository();
        $id_ticket = isset($_POST['ticket_id'])? $_POST['ticket_id'] : null;
        $document_type = "Envio_Destino";
        if ($id_ticket) {
            $documentData = $repository->getDocument($id_ticket, $document_type);
            if ($documentData) {
                $this->response(['success' => true, 'document' => $documentData], 200);
            } else {
                $this->response(['success' => false, 'message' => 'No se encontró el documento'], 404);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Debe proporcionar un ID de ticket'], 400); // Código 400 Bad Request
        }
    }

    function GetMonthlyTicketDetails(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->GetMonthlyTicketDetails($id_rol, $id_user);
        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    function GetIndividualTicketDetails(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $month = isset($_POST['month'])? $_POST['month'] : null;
        $status = isset($_POST['status'])? $_POST['status'] : null;
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        if ($month && $status) {
            $result = $repository->GetIndividualTicketDetails($id_rol, $id_user, $month, $status);
            if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
                $this->response(['success' => true, 'details' => $result], 200);
            } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
                $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
            } else {
                $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
            }
        } else {
            $this->response(['success' => false, 'message' => 'Debe proporcionar un ID de ticket'], 400); // Código 400 Bad Request
        }
    }

    public function GetMonthlyCreatedTicketsForChart(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->GetMonthlyCreatedTicketsForChart($id_rol, $id_user);
        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function GetMonthlyCreatedTicketsForChartForState(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetMonthlyCreatedTicketsForChartForState($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function GetRegionsTicketDetails(){
        $repository = new ReportRepository();
        $result = $repository->GetRegionsTicketDetails();
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function GetMonthlyTicketPercentageChange(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->GetMonthlyTicketPercentageChange($id_rol, $id_user);
        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'porcent' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function GetIndividualTicketDetailsByRegion(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_region = isset($_POST['region'])? $_POST['region'] : null;
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        if ($id_region) {
            $result = $repository->GetIndividualTicketDetailsByRegion($id_rol, $id_user, $id_region);
            if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
                $this->response(['success' => true, 'details' => $result], 200);
            } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
                $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
            } else {
                $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
            }
        } else {
            $this->response(['success' => false, 'message' => 'Debe proporcionar un ID de region'], 400); // Código 400 Bad Request
        }
    }

    public function handleGgetTicketsSendTallerTotalCount(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTicketsSendTallerTotalCount($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'count' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handlegetTotalTicketsPercentageSendToTaller(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTotalTicketsPercentageSendToTaller($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'porcent' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketOpenDetails(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->GetTicketOpenDetails($id_rol, $id_user);

        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetResolveTicketsForCard(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->GetResolveTicketsForCard($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTallerTicketsForCard() {
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTallerTicketsForCard($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false,'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false,'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketsPendienteReparacion(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTicketsPendienteReparacion($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handlegetTicketsProcessReparacionCount(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTicketsProcessReparacionCount($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'count' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketsReparadosCount(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTicketsReparadosCount($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'count' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketsReparado(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->handleGetTicketsReparado($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketsPendientesPorRepuestos(){
        $repositoryUser = new UserRepository();
        $repository = new ReportRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTicketsPendientesPorRepuestos($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handlegetTicketPendienteRepuestoCount(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTicketPendienteRepuestoCount($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'count' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketIrreparablesCount(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTicketIrreparablesCount($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'count' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketsIrreparables(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTicketsIrreparables($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handlegetTotalTicketsInProcess(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['user_id'])? $_POST['user_id'] : null;
        $repositoryUser = new UserRepository();

        if($id_user === null){
            $this->response(['success' => false,'message' => 'Falta el id_user'], 400); // Código 400 Bad Request
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->GetTotalTicketsInProcess($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'count' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false,'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false,'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handlegetTotalTicketsPercentageinprocess(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['user_id'])? $_POST['user_id'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetTotalTicketsPercentageInProcess($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'porcent' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false,'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false,'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketsInProcess(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->GetTicketsInProcess($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false,'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false,'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketTimeline(){
        $id_ticket = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $repository = new ReportRepository();
        $result = $repository->GetTicketTimeline($id_ticket);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false,'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false,'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function ticketsPendingDocumentApproval(){
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'Falta el id_user'], 400); // Código 400 Bad Request
        }

        $repository = new ReportRepository();
        $result = $repository->GetTicketsPendingDocumentApproval($id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'tickets' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false,'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false,'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function GetTicketDataRegion(){
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'Falta el id_user'], 400); // Código 400 Bad Request
        }

        $repository = new ReportRepository();
        $result = $repository->GetTicketDataRegion($id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false,'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false,'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
        
    }

    public function SaveComponents(){
        $id_ticket = isset($_POST['ticketId']) ? trim($_POST['ticketId']) : null;
        $components_json = isset($_POST['selectedComponents']) ? trim($_POST['selectedComponents']) : null;
        $serial_pos = isset($_POST['serialPos']) ? trim($_POST['serialPos']) : null;
        $id_user = isset($_POST['id_user']) ? trim($_POST['id_user']) : null;
        $modulo = isset($_POST['modulo']) ? trim($_POST['modulo']) : null;

        // Validar campos requeridos primero
        if (!$id_ticket || !$id_user || !$serial_pos) {
            error_log("SaveComponents: Campos vacíos - ticketId: " . ($id_ticket ?? 'null') . ", id_user: " . ($id_user ?? 'null') . ", serial_pos: " . ($serial_pos ?? 'null'));
            $this->response(['success' => false, 'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        // Validar que ticketId sea un número válido
        $id_ticket_num = (int)$id_ticket;
        if ($id_ticket_num <= 0) {
            error_log("SaveComponents: ticketId inválido - " . $id_ticket);
            $this->response(['success' => false, 'message' => 'El ID del ticket no es válido.'], 400);
            return;
        }

        // Procesar JSON de componentes (puede ser objeto con selected/deselected o array simple)
        $componentes_array = [];
        
        if (!empty($components_json) && $components_json !== 'null' && $components_json !== 'undefined') {
            $decoded = json_decode($components_json, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                // Puede ser un objeto {selected: [], deselected: []} o un array simple
                $componentes_array = $decoded;
            } else {
                error_log("SaveComponents: Error al decodificar JSON - " . json_last_error_msg() . " - JSON: " . $components_json);
            }
        }

        $repository = new ReportRepository();
        $result = $repository->SaveComponents($id_ticket_num, $componentes_array, $serial_pos, $id_user, $modulo);
        
        if ($result !== false && is_array($result) && isset($result['success'])) {
            $nro_ticket = isset($result['nro_ticket']) ? $result['nro_ticket'] : null;
            if ($result['success']) {
                $this->response(['success' => true, 'message' => $result['message'] ?? 'Componentes guardados correctamente', 'nro_ticket' => $nro_ticket], 200);
            } else {
                $this->response(['success' => false, 'message' => $result['message'] ?? 'Error al guardar los componentes', 'debug_info' => $result['debug_info'] ?? null], 500);
            }
        } else {
            error_log("SaveComponents: Resultado inesperado del repositorio - " . print_r($result, true));
            $this->response(['success' => false, 'message' => 'Error al guardar los componentes'], 500);
        }
    }

    public function SearchEstatusData(){
        $estatus = isset($_POST['estatus'])? $_POST['estatus'] : null;
        $id_user = isset($_POST['id_user']) ? trim($_POST['id_user']) : null;
        $idtipouser = isset($_POST['idtipouser']) ? trim ($_POST['idtipouser']) : null;
        
        if (!$estatus) {
            $this->response(['success' => false, 'message' => 'Debe seleccionar un estatus'], 400);
            return;
        }
        
        $repository = new ReportRepository();
        $result = $repository->GetDataEstatusTicket($estatus,$id_user,$idtipouser);

        if ($result !== false && !empty($result)) {
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) {
            $this->response(['success' => false, 'message' => 'No hay tickets con ese estatus'], 404);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los tickets'], 500);
        }
    }

    public function getTicketsgestioncomercialPorcent(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        
        $result = $repository->GetTicketsGestionComercialPorcent($id_rol, $id_user);
        if ($result!== false &&!empty($result)) {
            $this->response(['success' => true, 'count' => $result], 200);
        } elseif ($result!== false && empty($result)) {
            $this->response(['success' => false,'message' => 'No hay datos de tickets disponibles'], 404);
        } else {
            $this->response(['success' => false,'message' => 'Error al obtener los datos de tickets'], 500);
        }    

    }

    public function getTicketGestionComercialCount(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }

        $result = $repository->getTicketagestioncomercialCount($id_rol, $id_user);
        if ($result !== null) {
            $this->response(['success' => true, 'count' => $result], 200);
        } else {
            $this->response(['success' => false, 'userCount' => 0], 200);
        }
        $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Tickets en Gestion Comercial.'], 500);
    }

    public function handlegetTicketEntregadoCliente(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->handlegetTicketEntregadoCliente($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'count' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetDetalleTicketComercial(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->GetDetalleTicketComercial($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketCounts(){
        try {
            $repository = new ReportRepository();
            $repositoryUser = new UserRepository();

            $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

            if (!$id_user) {
                $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
                return;
            }

            $id_rol = $repositoryUser->getUserRol($id_user);

            if(!$id_rol){
                $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
                return;
            }
            
            $result = $repository->GetTicketCounts($id_rol, $id_user);
            
            if (is_array($result)) {
                $this->response(['success' => true, 'counts' => $result], 200);
            } else {
                $this->response(['success' => false, 'message' => 'Error al obtener los tickets'], 500);
            }
        } catch (Exception $e) {
            error_log("Error in handleGetTicketCounts: " . $e->getMessage());
            $this->response(['success' => false, 'message' => 'Error interno del servidor'], 500);
        }
    }

    public function handleEntregadoClienteDetails(){
        $repository = new ReportRepository();
        $repositoryUser = new UserRepository();

        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'El id_user es nulo.'], 400);
            return;
        }

        $id_rol = $repositoryUser->getUserRol($id_user);

        if(!$id_rol){
            $this->response(['success' => false,'message' => 'El id_rol es nulo.'], 400);
            return;
        }
        $result = $repository->EntregadoClienteDetails($id_rol, $id_user);
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleSearchBancoData(){
        $banco = isset($_POST['banco'])? $_POST['banco'] : null;
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;
        $idtipouser = isset($_POST['idtipouser'])? $_POST['idtipouser'] : null;

        $repository = new ReportRepository(); // Inicializa el repositorio
        $result = $repository->SearchBanco($banco,$id_user,$idtipouser);
        
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay serial disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los serial'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Coloque un serial']);
    }

    /**
     * Actualiza el id_status_payment del ticket según el tipo de documento subido
     * NOTA: Esta función ya NO se usa porque el modelo reportsModel ya maneja
     * la lógica de actualización de estatus en determineStatusPayment() dentro de saveDocument2().
     * El modelo determina correctamente el estatus basado en qué documentos están disponibles.
     * Se mantiene comentada por si se necesita en el futuro.
     */
    /*
    private function updateTicketStatusPayment($id_ticket, $document_type) {
        try {
            $db_conn = $this->db->getConnection();
            
            // Determinar el nuevo id_status_payment según el tipo de documento
            $new_status_payment = null;
            if ($document_type === 'Exoneracion') {
                $new_status_payment = 5; // Exoneración
            } elseif ($document_type === 'Anticipo') {
                $new_status_payment = 7; // Anticipo
            }
            
            // Solo actualizar si se determinó un nuevo estatus
            if ($new_status_payment !== null) {
                $sql = "UPDATE tickets SET id_status_payment = " . (int)$new_status_payment . " WHERE id_ticket = " . (int)$id_ticket;
                $result = pg_query($db_conn, $sql);
                
                if ($result === false) {
                    error_log("Error al actualizar id_status_payment para ticket {$id_ticket}: " . pg_last_error($db_conn));
                } else {
                    error_log("id_status_payment actualizado a {$new_status_payment} para ticket {$id_ticket} (documento: {$document_type})");
                }
            }
        } catch (\Exception $e) {
            error_log("Error al actualizar id_status_payment: " . $e->getMessage());
        }
    }
    */

    /**
     * Envía correos cuando se suben documentos de Anticipo o Exoneración desde el módulo Tecnico
     */
    private function sendEmailForDocumentUpload($id_ticket, $document_type, $serial, $nro_ticket) {
        // Solo procesar si es Anticipo o Exoneración
        if ($document_type !== 'Anticipo' && $document_type !== 'Exoneracion') {
            return;
        }

        try {
            // Obtener el id_status_payment del ticket
            $repository = new technicalConsultionRepository();
            $ticket_status_payment = $repository->getStatusPayment($id_ticket);
            $id_status_payment_actual = isset($ticket_status_payment['id_status_payment']) ? (int)$ticket_status_payment['id_status_payment'] : null;
            
            $emailRepository = new EmailRepository();
            
            // Obtener datos completos del ticket para el correo
            $ticket_data = $emailRepository->GetTicketDataById($id_ticket);
            
            // Preparar imágenes embebidas
            $embeddedImages = [];
            if (defined('FIRMA_CORREO')) {
                $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
            }
            
            // Obtener datos adicionales del ticket
            $nombre_tecnico_email = $ticket_data['full_name_tecnico'] ?? 'N/A';
            $ticketaccion_email = $ticket_data['name_accion_ticket'] ?? 'N/A';
            $ticketdomiciliacion_email = $ticket_data['name_status_domiciliacion'] ?? 'N/A';
            $nivelFalla_text = $ticket_data['id_level_failure'] ?? 'N/A';
            $falla_text = $ticket_data['name_failure'] ?? 'N/A';
            $status_text = $ticket_data['name_status_ticket'] ?? 'N/A';
            $status_payment_text = $ticket_data['name_status_payment'] ?? 'N/A';
            
            // Obtener RIF y Razón Social desde GetClientInfo
            $result_client = $emailRepository->GetClientInfo($serial);
            $clientRif_email = $result_client['coddocumento'] ?? $ticket_data['rif'] ?? 'N/A';
            $clientName_email = $result_client['razonsocial'] ?? $ticket_data['razonsocial'] ?? 'N/A';
            
            // Si es Anticipo (id_status_payment = 7) y se guardó el documento
            if ($document_type === 'Anticipo' && $id_status_payment_actual == 7) {
                $result_email_finanzas = $emailRepository->GetEmailAreaFinanzas();
                if ($result_email_finanzas && !empty($result_email_finanzas['email_area'])) {
                    $email_finanzas = $result_email_finanzas['email_area'];
                    $name_finanzas = $result_email_finanzas['name_area'] ?? 'Finanzas';
                    
                    $subject_finanzas = '📋 NOTIFICACIÓN FINANCIERA - Revisar Anticipo del Ticket';
                    $body_finanzas = $this->getFinanzasEmailBodyForAnticipo(
                        $name_finanzas,
                        $nombre_tecnico_email,
                        $nro_ticket,
                        $clientRif_email,
                        $clientName_email,
                        $serial,
                        $nivelFalla_text,
                        $falla_text,
                        date('Y-m-d H:i'),
                        $ticketaccion_email,
                        $status_text,
                        $status_payment_text,
                        $ticketdomiciliacion_email
                    );
                    
                    $this->emailService->sendEmail($email_finanzas, $subject_finanzas, $body_finanzas, [], $embeddedImages);
                    error_log("Correo de anticipo enviado a finanzas desde Tecnico: " . $email_finanzas);
                }
            }
            
            // Si es Exoneración (id_status_payment = 5) y se guardó el documento
            if ($document_type === 'Exoneracion' && $id_status_payment_actual == 5) {
                // Correos específicos para exoneración
                $emails_admin = [
                    'domiciliacion.intelipunto@inteligensa.com',
                    'olga.rojas@intelipunto.com',
                    'neishy.tupano@inteligensa.com'
                ];
                $name_admin = 'Administración';
                
                $subject_admin = '📋 NOTIFICACIÓN ADMINISTRATIVA - Revisar Exoneración del Ticket';
                $body_admin = $this->getAdminEmailBodyForExoneracion(
                    $name_admin,
                    $nombre_tecnico_email,
                    $nro_ticket,
                    $clientRif_email,
                    $clientName_email,
                    $serial,
                    $nivelFalla_text,
                    $falla_text,
                    date('Y-m-d H:i'),
                    $ticketaccion_email,
                    $status_text,
                    $status_payment_text,
                    $ticketdomiciliacion_email
                );
                
                // Enviar correo a cada dirección de administración
                $emails_enviados_admin = 0;
                $total_emails_admin = count($emails_admin);
                
                foreach ($emails_admin as $email_admin) {
                    error_log("INTENTANDO ENVIAR CORREO DE EXONERACION A ADMINISTRACION DESDE TECNICO: " . $email_admin);
                    $email_sent = $this->emailService->sendEmail($email_admin, $subject_admin, $body_admin, [], $embeddedImages);
                    
                    if ($email_sent) {
                        $emails_enviados_admin++;
                        error_log("CORREO DE EXONERACION ENVIADO A: " . $email_admin);
                    } else {
                        $error_admin = $this->emailService->getLastError();
                        error_log("ERROR AL ENVIAR CORREO DE EXONERACION A " . $email_admin . ": " . $error_admin);
                    }
                }
                
                if ($emails_enviados_admin == $total_emails_admin) {
                    error_log("TODOS LOS CORREOS DE EXONERACION ENVIADOS DESDE TECNICO: " . $emails_enviados_admin . "/" . $total_emails_admin);
                } elseif ($emails_enviados_admin > 0) {
                    error_log("ALGUNOS CORREOS DE EXONERACION ENVIADOS DESDE TECNICO: " . $emails_enviados_admin . "/" . $total_emails_admin);
                } else {
                    error_log("NINGUN CORREO DE EXONERACION FUE ENVIADO DESDE TECNICO");
                }
            }
        } catch (\Exception $e) {
            error_log("Error al enviar correo desde Tecnico para documento {$document_type}: " . $e->getMessage());
        }
    }

    /**
     * Genera el cuerpo del correo para Finanzas cuando se sube un documento de Anticipo
     */
    private function getFinanzasEmailBodyForAnticipo($nombre_area_finanzas, $nombre_tecnico_ticket, $ticketnro, $clientRif, $clientName, $ticketserial, $ticketNivelFalla, $name_failure, $ticketfinished, $ticketaccion, $ticketstatus, $ticketpaymnet, $ticketdomiciliacion) {
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
            'area' => htmlspecialchars($nombre_area_finanzas),
            'tecnico' => htmlspecialchars($nombre_tecnico_ticket)
        ];
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
            <title>Notificación Financiera - Revisar Anticipo</title>
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
            <h1>Revisar Anticipo</h1>
            <p>Notificación Financiera</p>
                </div>
        <div class="body">
            <div class="hello">Hola, <span>Área de {$map['area']}</span></div>
            <div class="hero-badge">
                El técnico <strong>{$map['tecnico']}</strong> ha cargado un documento de anticipo. Por favor, revise el documento asociado.
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
                <div class="icon">👤</div>
                <div>
                    <div class="label">Técnico Responsable</div>
                    <div class="value">{$map['tecnico']}</div>
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
                <p><strong>¡Atención!</strong> Por favor, verifique el documento de anticipo de este ticket.</p>
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

    /**
     * Genera el cuerpo del correo para Administración cuando se sube un documento de Exoneración
     */
    private function getAdminEmailBodyForExoneracion($nombre_area_admin, $nombre_tecnico_ticket, $ticketnro, $clientRif, $clientName, $ticketserial, $ticketNivelFalla, $name_failure, $ticketfinished, $ticketaccion, $ticketstatus, $ticketpaymnet, $ticketdomiciliacion) {
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
            'area' => htmlspecialchars($nombre_area_admin),
            'tecnico' => htmlspecialchars($nombre_tecnico_ticket)
        ];
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
            <title>Notificación Administrativa - Revisar Exoneración</title>
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
            <h1>Revisar Exoneración</h1>
            <p>Notificación Administrativa</p>
                </div>
        <div class="body">
            <div class="hello">Hola, <span>Área de {$map['area']}</span></div>
            <div class="hero-badge">
                El técnico <strong>{$map['tecnico']}</strong> ha cargado un documento de exoneración. Por favor, revise el documento asociado.
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
                <div class="icon">👤</div>
                <div>
                    <div class="label">Técnico Responsable</div>
                    <div class="value">{$map['tecnico']}</div>
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
                <p><strong>¡Atención!</strong> Por favor, verifique el documento de exoneración de este ticket.</p>
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