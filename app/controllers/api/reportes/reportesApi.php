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

                case 'getTotalTicketsPercentage':
                    $this->handleGetTotalTicketsPercentage();
                break;

                case 'GetTicketDataFinal':
                    $this->handleGetTicketDataFinal();
                break;
                
                case 'uploadDocument':
                    $this->uploadDocument();
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
        $data = $repository->getTicketPercentageData();

        $ticketsToday = $data['today'];
        $ticketsYesterday = $data['yesterday'];

        $percentageChange = 0;
        if ($ticketsYesterday > 0) {
            $percentageChange = (($ticketsToday - $ticketsYesterday) / $ticketsYesterday) * 100;
        } elseif ($ticketsToday > 0) { // Si ayer fue 0 pero hoy hay tickets
            $percentageChange = 100;
        }
        // Si ambos son 0, el porcentaje de cambio sigue siendo 0.
        $this->response(['success' => true, 'percentage' => round($percentageChange, 2)], 200);
    }

    public function handleGetTicketsResueltosPercentage(){
        $repository = new ReportRepository();
        $data = $repository->getTicketsResueltosPercentageData();

        $ticketsToday = $data['today'];
        $ticketsYesterday = $data['yesterday'];

        $percentageChange = 0;
        if ($ticketsYesterday > 0) {
            $percentageChange = (($ticketsToday - $ticketsYesterday) / $ticketsYesterday) * 100;
        } elseif ($ticketsToday > 0) { // Si ayer fue 0 pero hoy hay tickets
            $percentageChange = 100; // Un aumento del 100% desde cero
        }
        // Si ambos son 0, el porcentaje de cambio sigue siendo 0.
        $this->response(['success' => true, 'percentage' => round($percentageChange, 2)], 200);
    }

    public function handleGetTotalTicketsPercentage(){
        $repository = new ReportRepository();
        $data = $repository->getTotalTicketsPercentageData();

        $ticketsToday = $data['today'];
        $ticketsYesterday = $data['yesterday'];

        $percentageChange = 0;
        if ($ticketsYesterday > 0) {
            $percentageChange = (($ticketsToday - $ticketsYesterday) / $ticketsYesterday) * 100;
        } elseif ($ticketsToday > 0) { // Si ayer fue 0 pero hoy hay tickets
            $percentageChange = 100; // Un aumento del 100% desde cero
        }
        // Si ambos son 0, el porcentaje de cambio sigue siendo 0.
        $this->response(['success' => true, 'percentage' => round($percentageChange, 2)], 200);
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

    // Estos son los datos originales del archivo subido por el cliente
    $originalDocumentName = $file ? $file['name'] : null;
    $documentSize = $file ? $file['size'] : null;
    $documentType = $file ? $file['type'] : null; // PHP's detected MIME type

    // Estos son los datos que el frontend envió explícitamente en el FormData
    $mimeTypeFromFrontend = isset($_POST['mime_type']) ? $_POST['mime_type'] : null;

    // --- CAMBIO AQUÍ: Generar la ruta de subida automáticamente ---
    // Asumiendo que '/Downloads/' es una carpeta dentro de tu DOCUMENT_ROOT
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/Downloads/';

    // Asegúrate de que el directorio de subida exista. Si no existe, créalo.
    if (!is_dir($uploadDir)) {
        // Los permisos 0755 son una buena práctica para directorios en servidores web.
        // El 'true' final es para crear directorios recursivamente si es necesario.
        mkdir($uploadDir, 0755, true);
    }

    // Generar un nombre de archivo único para evitar colisiones y problemas de seguridad
    // Es CRÍTICO usar un nombre único en el servidor.
    $fileExtension = pathinfo($originalDocumentName, PATHINFO_EXTENSION);
    $uniqueFileName = uniqid() . '.' . $fileExtension; // Ejemplo: 65a8e2b3c4d5f.jpg
    $uploadPath = $uploadDir . $uniqueFileName; // Ruta COMPLETA donde se guardará el archivo

    // Ruta relativa para guardar en la DB si el archivo es público
    // Por ejemplo: /Downloads/65a8e2b3c4d5f.jpg
    $relativePathForDb = '/Downloads/' . $uniqueFileName;

    if ($id_ticket && $file && $file['error'] === UPLOAD_ERR_OK) {
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            // *** AQUÍ ES DONDE ENVÍAS LOS DATOS AL REPOSITORIO ***
            try {
                // Llama a un método en tu ReportRepository para guardar los detalles del documento.
                // Los parámetros que pases dependerán de lo que tu método 'saveDocument' o similar espere.
                $success = $repository->saveDocument(
                    $id_ticket,
                    $uniqueFileName,      // Nombre del archivo en el servidor
                    $originalDocumentName, // Nombre original del archivo (para mostrar al usuario si es necesario)
                    $documentSize,
                    $mimeTypeFromFrontend, // O $documentType, según cuál prefieras usar o validar
                    $relativePathForDb,    // La ruta relativa que se guarda en la DB para acceder al archivo
                );

                if ($success) {
                    $this->response(['success' => true, 'message' => 'Documento subido y registrado exitosamente.', 'filePath' => $relativePathForDb], 200);
                } else {
                    // Si el saveDocument del repo devuelve false o lanza excepción
                    // También podrías eliminar el archivo subido si la DB falla
                    unlink($uploadPath); // Elimina el archivo si no se pudo registrar en la DB
                    $this->response(['success' => false, 'message' => 'El archivo se subió, pero hubo un error al registrarlo en la base de datos.'], 500);
                }

            } catch (\Exception $e) {
                // Captura cualquier excepción que pueda lanzar el repositorio (ej. error de DB)
                unlink($uploadPath); // Elimina el archivo subido si la operación de DB falla
                $this->response(['success' => false, 'message' => 'Error interno al guardar el documento: ' . $e->getMessage()], 500);
            }

        } else {
            // Error al mover el archivo (ej. permisos insuficientes)
            $this->response(['success' => false, 'message' => 'Error al mover el archivo subido. Verifique permisos de la carpeta de destino.'], 500);
        }
    } else {
        // Manejar casos donde no hay ticket_id, no hay archivo, o hay un error de subida
        $errorMessage = 'Error en la subida: ';
        if (!$id_ticket) $errorMessage .= 'ID de ticket no proporcionado. ';
        if (!$file) $errorMessage .= 'Archivo no proporcionado. ';
        if ($file && $file['error'] !== UPLOAD_ERR_OK) $errorMessage .= 'Error de subida: ' . $file['error'];

        $this->response(['success' => false, 'message' => $errorMessage], 400);
    }
}
}