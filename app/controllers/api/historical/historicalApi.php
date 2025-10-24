<?php
namespace App\Controllers\Api\historical; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/View.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../repositories/HistoricalRepository.php';

require_once __DIR__ . '/../../../../config/paths.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Repositories\HistoricalRepository;
use Controller;
use DatabaseCon;

class historical extends Controller {
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
                case 'GetTicketHistory':
                    $this->handleGetTicketHistoryByID();
                break;

                case 'MarkTicketReceived':
                    $this->handleMarkTicketReceived();
                break;
                
                case 'markReceivedTechnical':
                    $this->handlemarkReceivedTechnical();
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

    public function handleGetTicketHistoryByID() {
        $id_ticket = isset($_POST['id_ticket'])? $_POST['id_ticket'] : null;
        
        $repository = new HistoricalRepository();
        $result = $repository->GetTicketHistory($id_ticket);
        //... implementa el código para obtener el historial del ticket
        if ($result!== false &&!empty($result)) {
            $this->response(['success' => true, 'history' => $result], 200);
        } elseif ($result!== false && empty($result)) {
            $this->response(['success' => false, 'message' => 'No hay historial de tickets para este ticket'], 404);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener el historial del ticket'], 500);
        }
    }

    public function handleMarkTicketReceived() {
        $id_ticket = isset($_POST['ticket_id'])? $_POST['ticket_id'] : null;
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;

        if (empty($id_ticket)) {
            $this->response(['success' => false, 'message' => 'ID de ticket o usuario no proporcionado'], 400);
        }

        $repository = new HistoricalRepository();
        $result = $repository->MarkTicketReceived($id_ticket, $id_user);

        if ($result) {
            $this->response(['success' => true, 'message' => 'Ticket marcado como recibido'], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al marcar el ticket como recibido'], 500);
        }
    }

    public function handlemarkReceivedTechnical(){
        $id_ticket = isset($_POST['id_ticket'])? $_POST['id_ticket'] : null;
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : null;
        $repository = new HistoricalRepository();

        if (empty($id_ticket)) {
            $this->response(['success' => false, 'message' => 'ID de ticket o usuario no proporcionado'], 400);
        }

        $result = $repository->MarkTicketReceivedTechnical($id_ticket, $id_user);
        if ($result) {
            $this->response(['success' => true, 'message' => 'Ticket marcado como recibido'], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al marcar el ticket como recibido'], 500);
        }
    }
}