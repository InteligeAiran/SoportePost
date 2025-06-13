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
        $repository = new ReportRepository();

        $id_ticket = isset($_POST['ticket_id']) ? $_POST['ticket_id'] : null;
        $file = isset($_FILES['document_file']) ? $_FILES['document_file'] : null;

        // --- Validación inicial del archivo ---
        if (!$id_ticket || !$file || $file['error'] !== UPLOAD_ERR_OK) {
            $errorMessage = 'Error en la subida: ';
            if (!$id_ticket) $errorMessage .= 'ID de ticket no proporcionado. ';
            if (!$file) $errorMessage .= 'Archivo no proporcionado. ';
            if ($file && $file['error'] !== UPLOAD_ERR_OK) {
                $errorMessage .= 'Error de subida del archivo. Código de error: ' . $file['error'];
                // Puedes añadir más detalles según el código de error de UPLOAD_ERR_...
                // Por ejemplo: if ($file['error'] == UPLOAD_ERR_INI_SIZE) $errorMessage .= ' (El archivo es más grande de lo permitido por php.ini)';
            }
            $this->response(['success' => false, 'message' => $errorMessage], 400);
            return;
        }

        // Estos son los datos originales del archivo subido por el cliente
        $originalDocumentName = $file['name'];
        $documentSize = $file['size'];
        $documentType = $file['type']; // PHP's detected MIME type

        // Estos son los datos que el frontend envió explícitamente en el FormData (opcional)
        $mimeTypeFromFrontend = isset($_POST['mime_type']) ? $_POST['mime_type'] : $documentType; // Usa el tipo detectado por PHP si no viene del frontend

        // --- Define el subdirectorio para las cargas dentro de tu proyecto ---
        // Basado en tu nueva estructura: C:\xampp\htdocs\SoportePost\app\public\images\uploads\
        // La parte 'app/public/images/uploads/' es lo que necesitamos añadir a la ruta base de tu proyecto.
        $targetSubDir = 'app/public/images/uploads/'; // <-- ¡¡¡CAMBIO REALIZADO AQUÍ!!!

        // --- CONSTRUIR LA RUTA ABSOLUTA EN EL SERVIDOR PARA GUARDAR EL ARCHIVO ---
        // $_SERVER['DOCUMENT_ROOT']  = C:\xampp\htdocs\
        // parse_url(APP, PHP_URL_PATH) = /SoportePost/ (si APP es http://localhost/SoportePost/)
        $appRelativePath = parse_url(APP, PHP_URL_PATH); // Obtiene '/SoportePost/'

        // La ruta física completa en el servidor donde se guardará el archivo
        $uploadDir = $_SERVER['DOCUMENT_ROOT'] . rtrim($appRelativePath, '/') . '/' . $targetSubDir; // Construye C:\xampp\htdocs\SoportePost\app\public\images\uploads\

        // Asegúrate de que el directorio de subida exista. Si no existe, créalo.
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) { // 'true' para crear recursivamente
                $this->response(['success' => false, 'message' => 'No se pudo crear el directorio de subida: ' . $uploadDir], 500);
                return;
            }
        }

        // Generar un nombre de archivo único para evitar colisiones y problemas de seguridad
        $fileExtension = pathinfo($originalDocumentName, PATHINFO_EXTENSION);
        $uniqueFileName = uniqid() . '.' . $fileExtension; // Ejemplo: 65a8e2b3c4d5f.jpg
        $uploadPath = $uploadDir . $uniqueFileName; // Ruta COMPLETA donde se guardará el archivo en el servidor

        // Ruta RELATIVA para guardar en la DB. Esta es la que el frontend usará con ENDPOINT_BASE.
        // Ejemplo: app/public/images/uploads/65a8e2b3c4d5f.jpg
        $filePathForDatabase = $targetSubDir . $uniqueFileName;

        // --- Mover el archivo subido ---
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            try {
                // Llama a un método en tu ReportRepository para guardar los detalles del documento.
                // Asegúrate de que tu método 'saveDocument' en ReportRepository exista y use prepared statements.
                $success = $repository->saveDocument(
                    $id_ticket,
                    $filePathForDatabase,    // La ruta relativa que se guarda en la DB
                    $mimeTypeFromFrontend,   // El tipo MIME
                    $originalDocumentName,   // Nombre original del archivo
                    $documentSize            // Tamaño del archivo
                );

                if ($success) {
                    // Envía la ruta relativa al frontend, tal como está en la DB
                    $this->response(['success' => true, 'message' => 'Documento subido y registrado exitosamente.', 'filePath' => $filePathForDatabase], 200);
                } else {
                    // Si el saveDocument del repo devuelve false o lanza excepción
                    unlink($uploadPath); // Elimina el archivo subido si no se pudo registrar en la DB
                    $this->response(['success' => false, 'message' => 'El archivo se subió, pero hubo un error al registrarlo en la base de datos.'], 500);
                }

            } catch (\Exception $e) {
                // Captura cualquier excepción que pueda lanzar el repositorio (ej. error de DB)
                unlink($uploadPath); // Elimina el archivo subido si la operación de DB falla
                $this->response(['success' => false, 'message' => 'Error interno al guardar el documento: ' . $e->getMessage()], 500);
            }

        } else {
            // Error al mover el archivo (ej. permisos insuficientes en $uploadDir)
            $this->response(['success' => false, 'message' => 'Error al mover el archivo subido. Verifique los permisos de escritura en la carpeta de destino: ' . $uploadDir], 500);
        }
    }

    function getDocument(){
        $repository = new ReportRepository();
        $id_ticket = isset($_POST['ticket_id'])? $_POST['ticket_id'] : null;
        if ($id_ticket) {
            $documentData = $repository->getDocument($id_ticket);
            if ($documentData) {
                $this->response(['success' => true, 'document' => $documentData], 200);
            } else {
                $this->response(['success' => false, 'message' => 'No se encontró el documento'], 404);
            }
        } else {

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
}