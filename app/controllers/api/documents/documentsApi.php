<?php
namespace App\Controllers\Api\documents; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/View.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../repositories/DocumentsRepository.php';
require_once __DIR__ . '/../../../../config/paths.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Repositories\DocumentsRepository;
use Controller;
use DatabaseCon;


class documents extends Controller {
    private $db;

    function __construct() {
        parent::__construct();
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
    }

    public function processApi($urlSegments) {
        $method = $_SERVER['REQUEST_METHOD'];
        if (isset($urlSegments[1])) {
            $action = $urlSegments[1];
            switch ($action) {
                case 'GetDeliveryNoteData':
                    // Manejo de la verificación de correo electrónico
                    $this->handleGetDeliveryNoteData();
                break;

                case 'GetPaymentAgreementData':
                    $this->handleGetPaymentAgreementData();
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

    public function handleGetDeliveryNoteData(){
        $id_ticket = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';
        $repository = new DocumentsRepository(); // Inicializa el LoginRepository aquí

        if($id_ticket != '') {
            $result = $repository->GetDeliveryNoteData($id_ticket);
            if ($result > 0) {
                $this->response([ 'success' => true, 'rows' => $result]);
            }else{
                $this->response(['success' => false, 'message' => 'Correo No Existe', 'color'=> 'red']);
            }
        }else{
            $this->response(['success' => false, 'message' => 'Campo vacíos', 'color'=> 'red']);
        }
    }

    public function handleGetPaymentAgreementData(){
        $id_ticket = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';
        $repository = new DocumentsRepository(); // Inicializa el LoginRepository aquí

          if($id_ticket != '') {
            $result = $repository->GetPaymentAgreementData($id_ticket);
            if ($result > 0) {
                $this->response([ 'success' => true, 'rows' => $result]);
            }else{
                $this->response(['success' => false, 'message' => 'Correo No Existe', 'color'=> 'red']);
            }
        }else{
            $this->response(['success' => false, 'message' => 'Campo vacíos', 'color'=> 'red']);
        }
    }


}
?>