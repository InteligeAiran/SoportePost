<?php
namespace App\Controllers\Api\Consulta; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/View.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../repositories/technicalConsultionRepository.php';
require_once __DIR__ . '/../../../../config/paths.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Repositories\technicalConsultionRepository;
use Controller;
use DatabaseCon;

class Consulta extends Controller {
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
                case 'SearchRif':
                    $this->handleSearchRif();
                break;

                case 'SearchSerialData':
                    $this->handleSearchSerialData();
                break;

                case 'SearchRazonData':
                    $this->handleSearchRazonData();
                break;

                case 'SearchSerial':
                    $this->handleSearchSerial();
                break;

                case 'GetPhoto':
                    $this->handleGetPhoto();
                break;

                case 'ValidateRif':
                    $this->handleVlidateRif();
                break;

                case 'ValidateRif1':
                    $this->handleValidateRif1();
                break;

                case 'SaveDataFalla':
                    $this->handleSaveFalla1();
                break;

                case 'SaveDataFalla2':
                    $this->handleSaveFalla2();
                break;

                case 'GetPosSerials':
                    $this->handlePosSerials();
                break;

                case 'GetPosSerials1':
                    $this->handlePosSerials1();
                break;

                case 'GetUltimateTicket':
                    $this->handleGetUltimateTicket();
                break;

                case 'GetInstallPosDate':
                    $this->handGetInstallPosDate();
                break;

                case 'GetCoordinator':
                    $this->handleGetCoordinator();
                break;

                case 'GetFailure2':
                    $this->handleGetFailure2();
                break;

                case 'GetFailure1':
                    $this->handleGetFailure1();
                break;

                case 'GetTicketData1':
                    $this->handleGetTicketData1();
                break;

                case 'GetTicketData':
                    $this->handleGetTicketData();
                break;

                case 'GetCoordinador':
                    $this->handleGetCoordinator();
                break;

                case 'GetTecnico2':
                    $this->handleGetTecnico2();
                break;

                case 'AssignTicket':
                    if($method === 'POST'){
                        $this->handleAssignTicket();
                    } else {
                        $this->response(['error' => 'Método no permitido para /api/AssingTicket'], 405);
                    }
                break;

                case 'SendToTaller':
                    $this->handleSendToTaller();
                break;

                case 'GetTicketDataLab':
                    $this->handleGetTicketDataLab();
                break;

                default:
                    $this->response(['error' => 'Acción no encontrada en consulta'], 404);
                break;
            }
        } else {
            $this->response(['error' => 'Acción no especificada en consulta'], 400);
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

    private function handleSearchRif() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $rif = $_POST['rif'] ?? null;
            if ($rif) {
                // Lógica para buscar por RIF
                $technicalConsultionRepository = new technicalConsultionRepository();
                $data = $technicalConsultionRepository->SearchRif($rif);
                if ($data) {
                    $this->response(['success' => true, 'rif' => $data], 200);
                } else {
                    $this->response(['success' => false, 'message' => 'No se encontraron resultados para el RIF: ' . $rif], 200);
                }
            } else {
                $this->response(['error' => 'El parámetro RIF es requerido'], 400);
            }
        } else {
            $this->response(['error' => 'Método no permitido para buscar por RIF'], 405);
        }
    }

    public function handleSearchSerialData(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí
        $result = $repository->SearchSerialData($serial);
        //var_dump($serial);
        if ($result != "") {
            $this->response(['success' => true,'serialData' => $result], status: 200);
        } else {
            $this->response(['success' => false,'message' => 'No se encontraron datos'], status: 404);
        }
    }

    public function handleSearchRazonData(){
        $razonsocial = isset($_POST['RazonSocial']) ? $_POST['RazonSocial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí
        $result = $repository->SearchRazonData($razonsocial);
        //var_dump($serial);
        if ($result != "") {
            $this->response(['success' => true,'RazonData' => $result], status: 200);
        } else {
            $this->response(['success' => false,'message' => 'No se encontraron datos'], status: 404);
        }
    }

    public function handleSearchSerial(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        $result = $repository->SearchSerial($serial);
        //var_dump($result);

        if (!empty($result)) {
            $this->response([ 'success' => true, 'serial' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontraron usuarios'], 404);
        }
    }

    public function handleGetPhoto(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí
        //var_dump($serial);
        $result = $repository->SearchtypePos($serial);
        if ($result !== false) {
            $codrepositoryopos = $result;
            //var_dump($codrepositoryopos);

            /*  AGREGAR CSS */
            $claseImagen = "imagen-predeterminada"; // Valor predeterminado
            switch ($codrepositoryopos) {
                case 1:
                    $nombreArchivo = "ingenico-ict220.png";
                    $claseImagen = "ingenico-ict220";
                break;

                case 2:
                    $nombreArchivo = "ingenico-ict250.png";
                    $claseImagen = "ingenico-ict250";
                break;

                case 3:
                    $nombreArchivo = "ingenico-iwl220.png";
                    $claseImagen = "ingenico-iwl220";
                break;

                case 11:
                    $nombreArchivo = "move-2500.png";
                    $claseImagen = "move-2500";
                break;

                case 14:
                    $nombreArchivo = "sunmi-P2.png";
                    $claseImagen = "sunmi-P2";
                break;

                case 15:
                    $nombreArchivo = "sunmi-P2mini.png";
                    $claseImagen = "sunmi-P2mini";
                break;

                case 17:
                    $nombreArchivo = "sunmi-P2SE.png";
                    $claseImagen = "sunmi-P2SE";
                break;

                case 22:
                    $nombreArchivo = "Kozen-P10.png";
                    $claseImagen = "Kozen-P10";
                break;

                default:
                $nombreArchivo = "mantainment.png";

                break;
            }
            /* ENDF AGREGAR CSS */

            $rutaImagen = __DIR__ . "/../../../public/img/consulta_rif/POS/" . $nombreArchivo; // Ruta absoluta
            $tipoImagen = mime_content_type($rutaImagen);
            $datosImagen = file_get_contents($rutaImagen);
            $imagenBase64 = base64_encode($datosImagen);
            $srcImagen = "data:" . $tipoImagen . ";base64," . $imagenBase64;

            $this->response(['success' => true, 'id_tipopos' => $codrepositoryopos, 'rutaImagen' => $srcImagen, 'claseImagen' => $claseImagen ], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener el tipo del POS'], 404);
        }
    }

    public function handleVlidateRif(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        if ($rif != '') {
            $result = $repository->VerifingClient($rif);

            if ($result) {
                $this->response(['success' => true, 'message' => 'El RIF Verificado', 'color' => 'green', 'rif' => $result]);
            } else {
                $this->response(['success' => false, 'message' => 'El RIF No Existe', 'color'=> 'red'], 404);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error: RIF no proporcionado', 'color'=> 'red'], 400); // Puedes usar 400 Bad Request para este caso
        }
    }

    public function handleValidateRif1(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        if ($rif != '') {
            $result = $repository->VerifingClient($rif);

            if ($result) {
                $this->response(['success' => true, 'message' => 'El RIF Verificado', 'color' => 'green', 'rif' => $result]);
            } else {
                $this->response(['success' => false, 'message' => 'El RIF No Existe', 'color'=> 'red'], 404);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error: RIF no proporcionado', 'color'=> 'red'], 400); // Puedes usar 400 Bad Request para este caso
        }
    }

    public function handleSaveFalla1(){
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $falla = isset($_POST['falla']) ? $_POST['falla'] : '';
        $nivelFalla = isset($_POST['nivelFalla']) ? $_POST['nivelFalla'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        //var_dump($id_user, $serial, $falla, $nivelFalla);
        if($serial != '' && $falla != '' && $nivelFalla != '' && $id_user != '' && $rif != ''){
            $result = $repository->SaveDataFalla($serial, $falla, $nivelFalla, $id_user, $rif);
            if ($result) {
                $this->response(['success' => true, 'message' => 'Se guardaron los datos del Ticket correctamente.'], 200); // Código de estado 200 OK por defecto
            } else {
                $this->response(['success' => false, 'message' => 'Error al guardar los datos de falla.'], 500); // Código de estado 500 Internal Server Error
            }
        } else{
            $this->response(['success'=> false, 'message'=> 'Hay un campo vacio.'], 400); // Código de estado 400 Bad Request
        }
    }

    public function handleSaveFalla2(){
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $descripcion = isset($_POST['descrpFailure']) ? $_POST['descrpFailure'] : '';
        $coordinador = isset($_POST['coordinador']) ? $_POST['coordinador'] : '';
        $nivelFalla = isset($_POST['nivelFalla']) ? $_POST['nivelFalla'] : '';
        $id_status_payment = isset($_POST['id_status_payment']) ? $_POST['id_status_payment'] : '';
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $rutaEnvio = null;
        $rutaExo = null;
        $rutaAnticipo = null;
        $mimeTypeExo = null;
        $mimeTypeAnticipo = null;
        $mimeTypeEnvio = null;

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
    
        if (!empty($serial)) {
            if (!empty($descripcion)) {
                if (!empty($coordinador)) {
                    // Guardar archivo de envío
                    if (isset($_FILES['archivoEnvio']) && $_FILES['archivoEnvio']['error'] === UPLOAD_ERR_OK) {
                        $archivo = $_FILES['archivoEnvio'];
                        $nombreArchivo = uniqid() . '_' . $archivo['name'];
                        $rutaArchivo = 'C:\\Users\\Airan Bracamonte\\Downloads\\' . $nombreArchivo; // RUTA TRABAJO
                        $mimeTypeEnvio = mime_content_type($archivo['tmp_name']); // Obtener el tipo MIME ANTES de mover
    
                        if (move_uploaded_file($archivo['tmp_name'], $rutaArchivo)) {
                            $rutaEnvio = $rutaArchivo;
                        } else {
                            $this->response(['success' => false, 'message' => 'Error al guardar el archivo de envío.'], 500);
                            return;
                        }
                    }
    
                    // Guardar archivo de exoneración (si se envió)
                    if (isset($_FILES['archivoExoneracion']) && $_FILES['archivoExoneracion']['error'] === UPLOAD_ERR_OK) {
                        $archivoExo = $_FILES['archivoExoneracion'];
                        $nombreArchivoExo = uniqid() . '_' . $archivoExo['name'];
                        $rutaArchivoExo = 'C:\\Users\\Airan Bracamonte\\Downloads\\' . $nombreArchivoExo; // RUTA TRABAJO
                        $mimeTypeExo = mime_content_type($archivoExo['tmp_name']); // Obtener el tipo MIME ANTES de mover
    
                        if (move_uploaded_file($archivoExo['tmp_name'], $rutaArchivoExo)) {
                            $rutaExo = $rutaArchivoExo;
                        } else {
                            $this->response(['success' => false, 'message' => 'Error al guardar el archivo de exoneración.'], 500);
                            return;
                        }
                    }
    
                    // Guardar archivo de anticipo (si se envió)
                    if (isset($_FILES['archivoAnticipo']) && $_FILES['archivoAnticipo']['error'] === UPLOAD_ERR_OK) {
                        $archivoAnticipo = $_FILES['archivoAnticipo'];
                        $nombreArchivoAnticipo = uniqid() . '_' . $archivoAnticipo['name'];
                        $rutaArchivoAnticipo = 'C:\\Users\\Airan Bracamonte\\Downloads\\' . $nombreArchivoAnticipo; // RUTA TRABAJO
                        $mimeTypeAnticipo = mime_content_type($archivoAnticipo['tmp_name']); // Obtener el tipo MIME ANTES de mover
    
                        if (move_uploaded_file($archivoAnticipo['tmp_name'], $rutaArchivoAnticipo)) {
                            $rutaAnticipo = $rutaArchivoAnticipo;
                        } else {
                            $this->response(['success' => false, 'message' => 'Error al guardar el archivo de anticipo.'], 500);
                            return;
                        }
                    }
                    $result = $repository->SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaEnvio, $id_status_payment, $rutaExo, $rutaAnticipo, $id_user, $mimeTypeExo, $mimeTypeAnticipo, $mimeTypeEnvio, $rif);
    
                    if ($result) {
                        $this->response(['success' => true, 'message' => 'Datos guardados con éxito.'], 200);
                    } else {
                        $this->response(['success' => false, 'message' => 'Error al guardar los datos de la falla.'], 500);
                    }
                } else {
                    $this->response(['success' => false, 'message' => 'El campo Coordinador no puede estar vacío.'], 400);
                }
            } else {
                $this->response(['success' => false, 'message' => 'El campo Descripción de la Falla no puede estar vacío.'], 400);
            }
        } else {
            $this->response(['success' => false, 'message' => 'El campo Serial no puede estar vacío.'], 400);
        }
    }

     public function  handlePosSerials(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($rif != '') {
            $result = $repository->GetPosSerialsByRif($rif); // Llama a la función del repositoryo
            if ($result) {
                $this->response(['success' => true, 'serials' => $result], 200); // Devuelve el array de seriales
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron seriales para el RIF proporcionado.', 'serials' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'RIF no proporcionado.', 'serials' => []], 400); // Código de estado 400 Bad Request
        }
    }

    public function handlePosSerials1(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($rif != '') {
            $result = $repository->GetPosSerialsByRif($rif); // Llama a la función del repositoryo
            if ($result) {
                $this->response(['success' => true, 'serials' => $result], 200); // Devuelve el array de seriales
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron seriales para el RIF proporcionado.', 'serials' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'RIF no proporcionado.', 'serials' => []], 400); // Código de estado 400 Bad Request
        }
    }

    public function handleGetUltimateTicket(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($serial != '') {
            $result = $repository->UltimateDateTicket($serial);

            $this->response(['success' => true, 'fecha' => $result], 200); // Código de estado 200 OK por defecto
        } else {
            $this->response(['success' => true, 'message' => 'No tiene ticket', 'fecha' => null], 400); // Código de estado 200 OK
        }
    }

    public function handGetInstallPosDate(){
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($serial != '') {
            $result = $repository->InstallDatePOS($serial);

            $this->response(['success' => true, 'fecha' => $result], 200); // Código de estado 200 OK por defecto
        } else {
            $this->response(['success' => true, 'message' => 'No tiene ticket', 'fecha' => null], 400);
        }
    }

    public function handleGetCoordinator(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetCoordinator();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'coordinadores' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay coordinadores disponibles o No ha seleccionado ningun coordinador'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los coordinadores'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }

    public function handleGetFailure2(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetFailure2();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'failures' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay fallas disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener las fallas'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar una falla']);
    }

    public function handleGetFailure1(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetFailure1();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'failures' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay fallas disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener las fallas'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar una falla']); 
    }
    
    public function handleGetTicketData1(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketData1();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Usuario']);
    }

    public function handleGetTicketData(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketData();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }

    public function handleGetTecnico2(){
        $repository = new   technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->getTecnico2();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'tecnicos' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay usuarios disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los usuarios'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Usuario']);
    }

    public function handleAssignTicket(){
        $id_tecnico     = isset($_POST['id_tecnico']) ? $_POST['id_tecnico'] : '';
        $id_ticket      = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';
      
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->AssignTicket($id_ticket, $id_tecnico);

         if ($id_tecnico != '' && $id_ticket != '') {
            if($result){
                $this->response(['success' => true, 'message' => 'Asignado Con Exito'], 200); 
            }else{
                $this->response(['success' => false, 'message' => 'No se encontraron datos', 'historial' => []], 404); // Código de estado 404 Not Found
            }
        }else{
            $this->response(['success' => false, 'message' => 'Hay campos vacios'], 400); // Código de estado 404 Not Found
        }
    }

    public function handleSendToTaller(){
        $id_ticket = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->SendToTaller($id_ticket);
        if ($id_ticket != '') {
            if($result){
                $this->response(['success' => true, 'message' => 'Ticket enviado al taller con éxito.'], 200); 
            }else{
                $this->response(['success' => false, 'message' => 'No se encontraron datos', 'historial' => []], 404); // Código de estado 404 Not Found
            }
        }else{
            $this->response(['success' => false, 'message' => 'Hay un error'], 400); // Código de estado 404 Not Found
        }
    }

    public function handleGetTicketDataLab(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketDataLab();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Usuario']);
    }
}
?>