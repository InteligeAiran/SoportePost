<?php
namespace App\Controllers\Api\reportes; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/View.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../repositories/ReportRepository.php';

require_once __DIR__ . '/../../../../config/paths.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Repositories\ReportRepository;
use Controller;
use DatabaseCon;

class reportes extends Controller {
    private $db;
    // ... otras propiedades que necesites

    function __construct() {
        parent::__construct();
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
        // ... instancia tus repositorios y servicios si los usas aquí
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
        $repository = new ReportRepository(); // Inicializa el repositorio
        $result = $repository->GetAllDataTicket($id_region);
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
        $repository = new ReportRepository(); // Inicializa el repositorio
        $result = $repository->SearchRif($rif);

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
        $repository = new ReportRepository(); // Inicializa el repositorio
        $result = $repository->SearchSerial($serial);
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
        $result = $repository->SearchRangeData($ini_date, $end_date);
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
        $result = $repository->getTicketabiertoCount();
        if ($result !== null) {
            $this->response(['success' => true, 'count' => $result], 200);
        } else {
            $this->response(['success' => false, 'userCount' => 0], 200);
        }
        $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Tickets Abiertos.'], 500);
    }

    public function handlegetTicketsResueltosCount(){
        $repository = new ReportRepository();
        $result = $repository->getTicketsResueltosCount();
        if ($result) {
            $this->response(['success' => true, 'count' => $result], 200);
        } else {
            $this->response(['success' => false, 'userCount' => 0], 200);
        }
        $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Tickets Resueltos.'], 500);
    }

    public function handlegetTicketsTotalCount(){
        $repository = new ReportRepository();
        $result = $repository->getTicketsTotalCount();
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
        $result = $repository->getTicketPercentageData();
        
        if ($result) {
            $this->response(['success' => true, 'count' => $result], 200);
        } else {
            $this->response(['success' => false, 'userCount' => 0], 200);
        }
        $this->response(['success' => false,'message' => 'Error al obtener la cantidad de Total de Tickets.'], 500);
    }

    public function handleGetTicketsResueltosPercentage(){
        $repository = new ReportRepository();
        $result = $repository->getTicketsResueltosPercentageData();

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
        $ticketUploadDir = $serialUploadDir . $id_ticket . DIRECTORY_SEPARATOR;
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
        $filePathForDatabase = UPLOAD_BASE_DIR . $cleanSerial . '/' . $id_ticket . '/' . $document_type . '/' . $uniqueFileName;
        
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
                    $document_type
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
        $ticketUploadDir = $serialUploadDir . $id_ticket . DIRECTORY_SEPARATOR;
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
        $filePathForDatabase = UPLOAD_BASE_DIR . $cleanSerial . '/' . $id_ticket . '/' . $document_type . '/' . $uniqueFileName;
        
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
        $result = $repository->GetMonthlyTicketDetails();
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
        $month = isset($_POST['month'])? $_POST['month'] : null;
        $status = isset($_POST['status'])? $_POST['status'] : null;
        if ($month && $status) {
            $result = $repository->GetIndividualTicketDetails($status, $month);
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
        $result = $repository->GetMonthlyCreatedTicketsForChart();
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
        $result = $repository->GetMonthlyCreatedTicketsForChartForState();
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
        $result = $repository->GetMonthlyTicketPercentageChange();
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
        $id_region = isset($_POST['region'])? $_POST['region'] : null;
        if ($id_region) {
            $result = $repository->GetIndividualTicketDetailsByRegion($id_region);
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
        $result = $repository->GetTicketsSendTallerTotalCount();
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
        $result = $repository->GetTotalTicketsPercentageSendToTaller();
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
        $result = $repository->GetTicketOpenDetails();

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
        $result = $repository->GetResolveTicketsForCard();
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
        $result = $repository->GetTallerTicketsForCard();
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
        $result = $repository->GetTicketsPendienteReparacion();
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
        $result = $repository->GetTicketsProcessReparacionCount();
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
        $result = $repository->GetTicketsReparadosCount();
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
        $result = $repository->handleGetTicketsPendienteReparacion();
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'details' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetTicketsPendientesPorRepuestos(){
        $repository = new ReportRepository();
        $result = $repository->GetTicketsPendientesPorRepuestos();
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
        $result = $repository->GetTicketPendienteRepuestoCount();
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
        $result = $repository->GetTicketIrreparablesCount();
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
        $result = $repository->GetTicketsIrreparables();
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
        $result = $repository->GetTotalTicketsInProcess();
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
        $result = $repository->GetTotalTicketsPercentageInProcess();
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
        $result = $repository->GetTicketsInProcess();
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

        // --- CORRECCIÓN AQUÍ ---
        // Inicializa array de componentes
        $componentes_array = [];
        
        // Solo procesa JSON si hay datos válidos
        if (!empty($components_json) && $components_json !== 'null' && $components_json !== 'undefined') {
            $decoded = json_decode($components_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $componentes_array = $decoded;
            }
        }

        if (!$id_ticket || !$id_user || !$serial_pos) {
            $this->response(['success' => false, 'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new ReportRepository();
        $result = $repository->SaveComponents($id_ticket, $componentes_array, $serial_pos, $id_user);
        if ($result !== false) {
            $this->response(['success' => true, 'message' => 'Componentes guardados correctamente'], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al guardar los componentes'], 500);
        }
    }
}