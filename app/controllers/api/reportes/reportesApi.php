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
}