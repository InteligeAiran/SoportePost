<?php
namespace App\Controllers\Api\Consulta; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/database.php';
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
use DateTime;
use DateInterval;

class Consulta extends Controller
{
    private $db;
    private $app_base_path; // Añadido para evitar el error de propiedad indefinida
    // ... otras propiedades que necesites

    function __construct()
    {
        parent::__construct();
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
    }

    public function processApi($urlSegments)
    {
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
                    if ($method === 'POST') {
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

                case 'GetStatusLab':
                    $this->handleGetStatusLab();
                    break;

                case 'UpdateTicketStatus':
                    $this->handleUpdateTicketStatus();
                    break;

                case 'UpdateKeyReceiveDate':
                    $this->handlUpdateKeyReceiveDate();
                    break;

                case 'GetStatusDomiciliacion':
                    $this->handleGetStatusDomiciliacion();
                    break;
                
                case 'getModules':
                    $this->handleGetModules();
                    break;

                case 'getSubmodulesForModule':
                    $this->handleGetSubmodulesForModule();
                    break;
                
                case 'GetTicketCounts':
                    $this->handleGetTicketCounts();
                    break;

                case 'getModulesUsers':
                    $this->handleGetModulesUsers();
                    break;

                case 'getAttachments':
                    $this->handleGetAttachments();
                    break;
                
                case 'DevolverCliente':
                    $this->handleTicketAction();
                    break;

                case 'UpdateStatusToReceiveInTaller':
                    $this->handleUpdateStatusToReceiveInTaller();
                    break;
                
                case 'updateRepuestoDate':
                    $this->handleupdateRepuestoDate();
                    break;

                case 'getOverdueRepuestoTickets':
                    $this->handleGetOverdueRepuestoTickets();
                    break;
                
                case 'UpdateRepuestoDate2':
                    $this->handleUpdateRepuestoDate2();
                    break;

                case 'SendToComercial':
                    $this->handleSendToComercial();
                    break;

                case 'SendToGestionRosal': 
                    $this->handleSendToGestionRosal();
                    break;

                case 'MarkKeyAsReceived':
                    $this->handleMarkKeyAsReceived();
                    break;

                case 'GetImageToAproval':
                    $this->handleGetImageToAproval();
                    break;
                
                case 'VerifingBranches':
                    $this->handleVerifingBranches();
                    break;

                case 'entregar_ticket':
                    $this->handleEntregarTicket();
                    break;
                
                    case 'entregar_ticketDev':
                    $this->handleEntregarTicketDevolucion();
                    break;
                
                 case 'UpdateStatusToReceiveInRosal':
                    $this->handleUpdateStatusToReceiveInRosal();
                    break;

                case 'GetRegionsByTechnician':
                    $this->handleGetRegionsByTechnician();
                    break;

                case 'UpdateStatusToReceiveInRegion':
                    $this->handleUpdateStatusToReceiveInRegion();
                    break;

                case 'GetComponents':
                    $this->handleGetComponents();
                    break;

                case 'SendToRegion':
                    $this->handleSendToRegion();
                    break;

                case 'sendToRegionWithoutComponent':
                    $this->handleSendToRegionWithoutComponent();
                    break;

                case 'CheckTicketEnProceso':
                    $this->handleCheckTicketEnProceso();
                    break;

                case 'HasComponents':
                    $this->handleHasComponents();
                    break;
                
                case 'GetDocumentByType':
                    $this->handleGetDocumentByType();
                    break;

                case 'GetMotivos':
                    $this->handleGetMotivos();
                    break;

                case 'rechazarDocumento':
                    $this->handlerechazarDocumentos();
                    break;

                case 'approve-document':
                    $this->handleapprovedocument();
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

    private function handleSearchRif()
    {
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

    public function handleSearchSerialData()
    {
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí
        $result = $repository->SearchSerialData($serial);
        //var_dump($serial);
        if ($result != "") {
            $this->response(['success' => true, 'serialData' => $result], status: 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontraron datos'], status: 404);
        }
    }

    public function handleSearchRazonData()
    {
        $razonsocial = isset($_POST['RazonSocial']) ? $_POST['RazonSocial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí
        $result = $repository->SearchRazonData($razonsocial);
        if ($result != "") {
            $this->response(['success' => true, 'RazonData' => $result], status: 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontraron datos'], status: 404);
        }
    }

    public function handleSearchSerial()
    {
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        $result = $repository->SearchSerial($serial);
        //var_dump($result);

        if (!empty($result)) {
            $this->response(['success' => true, 'serial' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontraron usuarios'], 404);
        }
    }

    public function handleGetPhoto()
    {
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

            $this->response(['success' => true, 'id_tipopos' => $codrepositoryopos, 'rutaImagen' => $srcImagen, 'claseImagen' => $claseImagen], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener el tipo del POS'], 404);
        }
    }

    public function handleVlidateRif()
    {
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        if ($rif != '') {
            $result = $repository->VerifingClient($rif);

            if ($result) {
                $this->response(['success' => true, 'message' => 'El RIF Verificado', 'color' => 'green', 'rif' => $result]);
            } else {
                $this->response(['success' => false, 'message' => 'El RIF No Existe', 'color' => 'red'], 404);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error: RIF no proporcionado', 'color' => 'red'], 400); // Puedes usar 400 Bad Request para este caso
        }
    }

    public function handleValidateRif1()
    {
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí

        if ($rif != '') {
            $result = $repository->VerifingClient($rif);

            if ($result) {
                $this->response(['success' => true, 'message' => 'El RIF Verificado', 'color' => 'green', 'rif' => $result]);
            } else {
                $this->response(['success' => false, 'message' => 'El RIF No Existe', 'color' => 'red'], 404);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error: RIF no proporcionado', 'color' => 'red'], 400); // Puedes usar 400 Bad Request para este caso
        }
    }

    public function handleSaveFalla1()
{
    $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
    $rif = isset($_POST['rif']) ? $_POST['rif'] : ''; 
    $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
    $falla_id = isset($_POST['falla']) ? $_POST['falla'] : '';
    $nivelFalla_id = isset($_POST['nivelFalla']) ? $_POST['nivelFalla'] : '';
    $falla_text = isset($_POST['falla_text']) ? $_POST['falla_text'] : '';
    $nivelFalla_text = isset($_POST['nivelFalla_text']) ? $_POST['nivelFalla_text'] : '';

    $repository = new technicalConsultionRepository();

    // --- LÓGICA DE VALIDACIÓN DE TIEMPO ---
    $lastTicketInfo = $repository->getLastUserTicketInfo($id_user); 

    if ($lastTicketInfo) {
        $lastTicketDateTime = $lastTicketInfo['date_create_ticket'];
        $lastTicketRif = $lastTicketInfo['rif_last_ticket'];
        $currentDateTime = new DateTime();
        $interval = $currentDateTime->diff($lastTicketDateTime);
        $minutesPassed = $interval->i + ($interval->h * 60) + ($interval->days * 24 * 60);

        $tiempoLimiteMismoCliente = 1; 
        $tiempoLimiteDiferenteCliente = 1; 

        if ($rif === $lastTicketRif) {
            if ($minutesPassed < $tiempoLimiteMismoCliente) {
                $this->response([
                    'success' => false,
                    'message' => "Debes esperar " . ($tiempoLimiteMismoCliente - $minutesPassed) . " minutos para crear otro ticket para el mismo cliente (RIF: $rif)."
                ], 429);
                return;
            }
        } else {
            if ($minutesPassed < $tiempoLimiteDiferenteCliente) {
                $this->response([
                    'success' => false,
                    'message' => "Debes esperar " . ($tiempoLimiteDiferenteCliente - $minutesPassed) . " minutos para crear otro ticket para un cliente diferente."
                ], 429);
                return;
            }
        }
    }
    // --- FIN LÓGICA DE VALIDACIÓN DE TIEMPO ---

    // Si la validación pasa, continuamos con la creación
    if ($serial != '' && $falla_id != '' && $nivelFalla_id != '' && $id_user != '' && $rif != '') {
        $hoy = date('dmy');
        $fecha_para_db = date('Y-m-d');
        $resultado = $repository->GetTotalTickets($fecha_para_db);
        $totaltickets = $resultado + 1;
        $paddedTicketNumber = sprintf("%04d", $totaltickets);
        $Nr_ticket = $hoy . $paddedTicketNumber;

        // **Paso clave:** Llama al SaveDataFalla del REPOSITORIO
        // Este $result ahora es el array que el Model::SaveDataFalla devuelve,
        // conteniendo 'idTicketCreado' y 'status_info'.
        $result = $repository->SaveDataFalla($serial, $falla_id, $nivelFalla_id, $id_user, $rif, $Nr_ticket);

        // Verifica si la operación fue exitosa y si el array de resultado es válido
        if ($result && isset($result['success']) && $result['success'] === true) {
            $id_ticket_creado = $result['idTicketCreado'];
            $ticket_status_info = $result['status_info']; // Directamente obtienes el status_info del modelo

            $status_text = 'Estado Desconocido'; // Valor por defecto
            $status_id = null;

            if ($ticket_status_info) {
                $status_id = $ticket_status_info['id_status_ticket'] ?? null;
                $status_text = $ticket_status_info['name_status_ticket'] ?? 'Estado Desconocido';
            }

            // Devolver los datos incluyendo los textos para el modal del frontend
            $this->response([
                'success' => true,
                'message' => 'Se guardaron los datos del Ticket correctamente.',
                'ticket_data' => [
                    'Nr_ticket' => $Nr_ticket,
                    'serial' => $serial,
                    'falla' => $falla_id,
                    'falla_text' => $falla_text,
                    'nivelFalla' => $nivelFalla_id,
                    'nivelFalla_text' => $nivelFalla_text,
                    'rif' => $rif,
                    'user_gestion' => $_SESSION['nombres'] . ' ' . $_SESSION['apellidos'],
                    'id_ticket_creado' => $id_ticket_creado,
                    'status_id' => $status_id,
                    'status_text' => $status_text // ¡Aquí está el estado!
                ]
            ], 200);
        } else {
            // Manejar errores si el resultado del repositorio no es el esperado
            $errorMessage = $result['error'] ?? 'Error desconocido al guardar los datos de falla.';
            $this->response(['success' => false, 'message' => $errorMessage], 500);
        }
    } else {
        $this->response(['success' => false, 'message' => 'Hay un campo vacio.'], 400);
    }
}


   public function handleSaveFalla2()
{
    // error_log("handleSaveFalla2: INICIO DE LA PETICIÓN.");

    // Recoger y sanear los datos de entrada
    $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
    $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
    $razonsocial = isset($_POST['razonsocial']) ? $_POST['razonsocial'] : '';
    $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
    $falla_id = isset($_POST['falla_id']) ? $_POST['falla_id'] : '';
    $falla_text = isset($_POST['falla_text']) ? $_POST['falla_text'] : '';
    $coordinador = isset($_POST['coordinador']) ? $_POST['coordinador'] : '';
    $nivelFalla_id = isset($_POST['nivelFalla']) ? $_POST['nivelFalla'] : '';
    $nivelFalla_text = isset($_POST['nivelFalla_text']) ? $_POST['nivelFalla_text'] : '';
    $id_status_payment = isset($_POST['id_status_payment']) ? $_POST['id_status_payment'] : '';
    $coordinador_nombre = isset($_POST['coordinadorNombre']) ? $_POST['coordinadorNombre'] : '';

    // Ahora estas variables se pasarán por referencia a la función auxiliar
    $archivoEnvioInfo = null;
    $archivoExoneracionInfo = null;
    $archivoAnticipoInfo = null;

    $repository = new technicalConsultionRepository();

    // --- LÓGICA DE VALIDACIÓN DE TIEMPO (DEBE IR AQUÍ y SOLO AQUÍ) ---
    $lastTicketInfo = $repository->getLastUserTicketInfo($id_user);

    if ($lastTicketInfo) {
        $lastTicketDateTime = $lastTicketInfo['date_create_ticket'];
        $lastTicketRif = $lastTicketInfo['rif_last_ticket'];
        $currentDateTime = new DateTime();
        $interval = $currentDateTime->diff($lastTicketDateTime);
        $minutesPassed = $interval->i + ($interval->h * 60) + ($interval->days * 24 * 60);

        $tiempoLimiteMismoCliente = 1;
        $tiempoLimiteDiferenteCliente = 1;

        if ($rif === $lastTicketRif) {
            if ($minutesPassed < $tiempoLimiteMismoCliente) {
                $this->response([
                    'success' => false,
                    'message' => "Demasiadas Solicitudes. Debes esperar " . ($tiempoLimiteMismoCliente - $minutesPassed) . " minuto(s) para crear otro ticket para la misma cliente (RIF: $rif)."
                ], 429);
                return;
            }
        } else {
            if ($minutesPassed < $tiempoLimiteDiferenteCliente) {
                $this->response([
                    'success' => false,
                    'message' => "Demasiadas Solicitudes. Debes esperar " . ($tiempoLimiteDiferenteCliente - $minutesPassed) . " minuto(s) para crear otro ticket para un cliente diferente (RIF: $rif)."
                ], 429);
                return;
            }
        }
    }
    // --- FIN LÓGICA DE VALIDACIÓN DE TIEMPO (Si el código llega aquí, la validación pasó) ---

    // Validar que los campos esenciales no estén vacíos
    if (empty($serial) || empty($falla_id) || empty($coordinador) || empty($nivelFalla_id) || empty($rif) || empty($id_user)) {
        $this->response(['success' => false, 'message' => 'Hay campos obligatorios vacíos. Revise serial, falla, coordinador, nivel de falla y RIF.'], 400);
        return;
    }

    // Generar el número de ticket (Nr_ticket)
    $hoy = date('dmy');
    $fecha_para_db = date('Y-m-d');
    $resultado = $repository->GetTotalTickets($fecha_para_db);
    $totaltickets = $resultado + 1;
    $paddedTicketNumber = sprintf("%04d", $totaltickets);
    $Nr_ticket = $hoy . $paddedTicketNumber;

    // ** Paso 1: Guardar el ticket principal para obtener el ID y el estado **
    $result = $repository->SaveDataFalla2(
        $serial,
        $falla_id, // Usamos $falla_id aquí ya que es lo que pasas
        $nivelFalla_id,
        $coordinador,
        $id_status_payment,
        $id_user,
        $rif,
        $Nr_ticket,
    );

    if (isset($result['success']) && $result['success']) {
        // CORRECCIÓN: Obtener el ID real de la base de datos
        $idTicketReal = $result['id_ticket_db'] ?? null; // ID real de la base de datos
        $idTicketCreado = $Nr_ticket; // Número del ticket (para compatibilidad)
        $ticket_status_info = $result['status_info']; // Directamente del modelo/repositorio
        $ticket_status_info_payment = $result['status_payment_info'] ?? null; // Información del estado de pago, si está disponible

        // Determinar el texto y ID del estado
        $status_text = 'Estado Desconocido';
        $status_id = null;
        if ($ticket_status_info) {
            $status_id = $ticket_status_info['id_status_ticket'] ?? null;
            $status_text = $ticket_status_info['name_status_ticket'] ?? 'Estado Desconocido';
        }

        if ($ticket_status_info_payment) {
            $status_payment_text = 'Estado de Pago Desconocido';
            if ($ticket_status_info_payment) {
                $status_payment_text = $ticket_status_info_payment['name_status_payment']?? 'Estado de Pago Desconocido';
            }
        }

        // 6. Configurar y Crear la Estructura de Carpetas de Archivos
        $cleanSerial = preg_replace("/[^a-zA-Z0-9_-]/", "_", $serial);
        $baseUploadDir = UPLOAD_BASE_DIR;
        $serialUploadDir = $baseUploadDir . $cleanSerial . DIRECTORY_SEPARATOR;
        $ticketUploadDir = $serialUploadDir . $idTicketCreado . DIRECTORY_SEPARATOR;

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

        // 7. Función auxiliar para procesar archivos subidos (sin cambios)
        $processFile = function($fileKey, $documentType, $ticketId, $nrTicket, $userId, $repo, $baseTicketDir, $dateForFilename, &$targetVar) {
            $repo = new technicalConsultionRepository();

            if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
                $archivo = $_FILES[$fileKey];
                $nombreArchivoOriginal = basename($archivo['name']);

                $info = pathinfo($nombreArchivoOriginal);
                $nombreSinExtension = $info['filename'];
                $extension = isset($info['extension']) ? '.' . $info['extension'] : '';

                $cleanNombreSinExtension = preg_replace("/[^a-zA-Z0-9_\-.]/", "", $nombreSinExtension);
                $nombreArchivoAlmacenado = $documentType . '_' . $dateForFilename . '_' . uniqid() . '_' . $cleanNombreSinExtension . $extension;

                $documentTypeDir = $baseTicketDir . $documentType . DIRECTORY_SEPARATOR;
                if (!is_dir($documentTypeDir)) {
                    if (!mkdir($documentTypeDir, 0755, true)) {
                        error_log("Error al crear el directorio del tipo de documento: " . $documentTypeDir);
                        return false;
                    }
                }

                $rutaArchivoCompleta = $documentTypeDir . $nombreArchivoAlmacenado;
                $mimeType = mime_content_type($archivo['tmp_name']);

                if (move_uploaded_file($archivo['tmp_name'], $rutaArchivoCompleta)) {
                    $targetVar = [
                        'original_filename' => $nombreArchivoOriginal,
                        'stored_filename' => $nombreArchivoAlmacenado,
                        'file_path' => $rutaArchivoCompleta,
                        'mime_type' => $mimeType,
                        'file_size_bytes' => $archivo['size'],
                        'document_type' => $documentType
                    ];
                    $repo->saveArchivoAdjunto($ticketId, $nrTicket, $userId, $targetVar);
                    return true;
                } else {
                    error_log("Error al mover el archivo de {$documentType}: " . $rutaArchivoCompleta . " | Código de error: " . $archivo['error'] . " | PHP temp path: " . $archivo['tmp_name']);
                    return false;
                }
            }
            return true;
        };

        $fecha_para_nombre_archivo = date('Ymd_His');

        // 8. Procesar cada tipo de archivo adjunto
        $envioOk = $processFile('archivoEnvio', 'Envio', $idTicketCreado, $Nr_ticket, $id_user, $repository, $ticketUploadDir, $fecha_para_nombre_archivo, $archivoEnvioInfo);
        $exoneracionOk = $processFile('archivoExoneracion', 'Exoneracion', $idTicketCreado, $Nr_ticket, $id_user, $repository, $ticketUploadDir, $fecha_para_nombre_archivo, $archivoAnticipoInfo);
        $anticipoOk = $processFile('archivoAnticipo', 'Anticipo', $idTicketCreado, $Nr_ticket, $id_user, $repository, $ticketUploadDir, $fecha_para_nombre_archivo, $archivoAnticipoInfo);

        if (!$envioOk || !$exoneracionOk || !$anticipoOk) {
            error_log("Advertencia: Al menos un archivo adjunto no se pudo guardar correctamente para el ticket " . $idTicketCreado);
        }

        // 9. Responder al cliente con éxito, incluyendo el estado del ticket
        $this->response([
            'success' => true,
            'message' => 'Datos guardados con éxito. El ticket de nivel 2 ha sido creado.',
            'ticket_data' => [
                'Nr_ticket' => $Nr_ticket,                    // Número del ticket (ej: "1608250003")
                'serial' => $serial,
                'falla_text' => $falla_text,
                'nivelFalla_text' => $nivelFalla_text,
                'rif' => $rif,
                'razonsocial' => $razonsocial,
                'user_gestion' => $_SESSION['nombres'] . ' ' . $_SESSION['apellidos'],
                'coordinador' => $coordinador_nombre,
                'id_ticket_creado' => $idTicketReal,          // ID real de la BD (ej: 12345)
                'status_id' => $status_id,                    // Incluye el ID del estado
                'status_text' => $status_text,                // **¡El nombre del estado aquí!**
                'status_payment' => $status_payment_text
            ]
        ], 200);
        return;

    } else {
        // 10. Responder con error si falla el guardado del ticket principal en la base de datos
        $this->response(['success' => false, 'message' => 'Error al guardar los datos de la falla en la base de datos: ' . ($result['error'] ?? 'Desconocido')], 500);
        return;
    }
   }
    
    public function handlePosSerials()
    {
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

    public function handlePosSerials1()
    {
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

    public function handleGetUltimateTicket()
    {
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($serial != '') {
            $result = $repository->UltimateDateTicket($serial);

            $this->response(['success' => true, 'fecha' => $result], 200); // Código de estado 200 OK por defecto
        } else {
            $this->response(['success' => true, 'message' => 'No tiene ticket', 'fecha' => null], 400); // Código de estado 200 OK
        }
    }

    public function handGetInstallPosDate()
    {
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($serial != '') {
            $result = $repository->InstallDatePOS($serial);

            $this->response(['success' => true, 'fecha' => $result], 200); // Código de estado 200 OK por defecto
        } else {
            $this->response(['success' => true, 'message' => 'No tiene ticket', 'fecha' => null], 400);
        }
    }

    public function handleGetCoordinator()
    {
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

    public function handleGetFailure2()
    {
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

    public function handleGetFailure1()
    {
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

    public function handleGetTicketData1()
    {
        $id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketData1($id_user);

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Usuario']);
    }

    public function handleGetTicketData()
    {
        $id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketData($id_user);

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }

    public function handleGetTecnico2()
    {
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->getTecnico2();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'tecnicos' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay Técnico disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los Técnico'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Técnico']);
    }

    public function handleAssignTicket()
    {
        $id_tecnico = isset($_POST['id_tecnico']) ? $_POST['id_tecnico'] : '';
        $id_ticket = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->AssignTicket($id_ticket, $id_tecnico);

        if ($id_tecnico != '' && $id_ticket != '') {
            if ($result) {
                $this->response(['success' => true, 'message' => 'Asignado Con Éxito'], 200);
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron datos', 'historial' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'Hay campos vacios'], 400); // Código de estado 404 Not Found
        }
    }

    public function handleSendToTaller()
    {
        $id_ticket = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->SendToTaller($id_ticket);
        if ($id_ticket != '') {
            if ($result) {
                $this->response(['success' => true, 'message' => 'Ticket enviado al taller con éxito.'], 200);
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron datos', 'historial' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'Hay un error'], 400); // Código de estado 404 Not Found
        }
    }

    public function handleGetTicketDataLab()
    {
        $id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketDataLab($id_user);

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetStatusLab()
    {
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetSatusTaller();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'estatus' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos Estatus disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los Estatus'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar un Estatus']);
    }

    public function handleUpdateTicketStatus()
    {
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $id_ticket = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';
        $id_new_status = isset($_POST['id_new_status']) ? $_POST['id_new_status'] : '';

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->UpdateTicketStatus($id_new_status, $id_ticket, $id_user);
        if ($id_new_status != '') {
            if ($result) {
                $this->response(['success' => true, 'message' => 'Ticket actualizado con éxito.'], 200);
                var_dump($result);
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron datos', 'historial' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'El estatus esta vacio'], 500); // Código de estado 404 Not Found
        }
    }

    public function handlUpdateKeyReceiveDate()
    {
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $id_ticket = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        if ($id_ticket != '') {
            $result = $repository->UpdateKeyReceiveDate($id_ticket, $id_user);
            if ($result) {
                $this->response(['success' => true, 'message' => 'Ticket actualizado con éxito.'], 200);
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron datos', 'historial' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'El ticket esta vacio'], 500); // Código de estado 404 Not Found
        }
    }

    public function handleGetStatusDomiciliacion()
    {
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetStatusDomiciliacion();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'estatus' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de Estatus Domiciliación disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los Estatus Domiciliación'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar un Estatus Domiciliación']);
    }

    public function updateDomiciliacionStatus()
    {
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $id_ticket = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';
        $id_new_status = isset($_POST['new_status_id']) ? $_POST['new_status_id'] : '';

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->UpdateDomiciliacionStatus($id_new_status, $id_ticket, $id_user);
        if ($id_new_status != '') {
            if ($result) {
                $this->response(['success' => true, 'message' => 'Ticket actualizado con éxito.'], 200);
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron datos', 'historial' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'El estatus esta vacio'], 500); // Código de estado 404 Not Found
        }
    }

    public function handleGetModules(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetModules();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'modules' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron módulos
            $this->response(['success' => false, 'message' => 'No hay módulos disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los módulos'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleGetSubmodulesForModule(){
        //$moduleId = '4';
        $moduleId = isset($_POST['moduleId']) ? $_POST['moduleId'] : '';
        $id_usuario = isset($_POST['id_usuario']) ? $_POST['id_usuario'] : '';
       // var_dump($moduleId);
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($moduleId != '') {
            $result = $repository->GetSubmodulesForModule($moduleId,$id_usuario); // Llama a la función del repositorio
            if ($result) {
                $this->response(['success' => true, 'submodules' => $result], 200); // Devuelve el array de submódulos
            } else {
                $this->response(['success' => false, 'message' => 'No se encontraron submódulos para el módulo proporcionado.', 'submodules' => []], 404); // Código de estado 404 Not Found
            }
        } else {
            $this->response(['success' => false, 'message' => 'ID de módulo no proporcionado.', 'submodules' => []], 400); // Código de estado 400 Bad Request
        }
    }

    public function handleGetTicketCounts(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketCounts();
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'counts' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron datos
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
    }

     public function handleGetAttachments(){
        // Recupera el ticketId enviado por POST
        $ticketId = isset($_POST['ticketId']) ? $_POST['ticketId'] : '';

        // Validación: Si no se proporciona el ticketId, devuelve un error 400 Bad Request.
        if (!$ticketId) {
            $this->response(['success' => false, 'message' => 'ID de ticket requerido.'], 400); 
            return; // Termina la ejecución aquí
        }

        // Instancia de tu repositorio para obtener los detalles del adjunto
        $repository = new technicalConsultionRepository();
        $attachments = $repository->getTicketAttachmentsDetails($ticketId); // Esto debería devolver un array de adjuntos

        // Si no se encontraron adjuntos o hubo un error en la base de datos
        if ($attachments === false || empty($attachments)) {
            $this->response(['success' => false, 'message' => 'No se encontraron adjuntos para este ticket o error en la base de datos.'], 404);
            return; // Termina la ejecución aquí
        }

        // Asume que solo necesitas el primer adjunto (como en tu ejemplo de JSON)
        $attachment = $attachments[0]; 
        $filePath = $attachment['file_path']; // Ruta física del archivo en el servidor (ej. C:\uploads_tickets\...)
        $mimeType = $attachment['mime_type']; // Tipo MIME del archivo (ej. application/pdf, image/jpeg)
        $originalFilename = $attachment['original_filename']; // Nombre original del archivo

        // Verifica si el archivo realmente existe en la ruta física
        if (file_exists($filePath)) {
            // Limpia cualquier buffer de salida existente para evitar problemas de encabezado
            if (ob_get_level()) {
                ob_end_clean();
            }

            // Establece los encabezados HTTP para servir el archivo
            header('Content-Description: File Transfer');
            header('Content-Type: ' . $mimeType); // Importante: indica al navegador el tipo de contenido
            // 'inline' sugiere al navegador que intente mostrar el archivo en línea
            // 'attachment' forzaría una descarga
            header('Content-Disposition: inline; filename="' . basename($originalFilename) . '"');
            header('Expires: 0'); // No almacenar en caché
            header('Cache-Control: must-revalidate'); // Revalidar caché
            header('Pragma: public'); // Para compatibilidad con versiones anteriores de HTTP 1.0
            header('Content-Length: ' . filesize($filePath)); // Tamaño del archivo en bytes

            // Lee el contenido del archivo y lo envía directamente al cliente
            readfile($filePath);
            exit(); // ¡CRÍTICO! Termina la ejecución del script PHP aquí para que no se envíe nada más (ej. HTML extra o JSON)
        } else {
            // Error: El archivo no se encontró en el disco, aunque la DB lo listaba
            $this->response(['success' => false, 'message' => 'El archivo asociado no fue encontrado en el servidor. ' . $filePath], 404); // Puedes incluir $filePath para depurar
            return; // Termina la ejecución aquí
        }
    }
    
    private function response($data, $status = 200)
    {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit();
    }


    public function handleGetModulesUsers(){
        //$id_usuario = '7';
        $id_usuario = isset($_POST['id_usuario']) ? $_POST['id_usuario'] : '';
        //var_dump($id_usuario);

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetModulesUsers($id_usuario);

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'modules' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron módulos
            $this->response(['success' => false, 'message' => 'No hay módulos disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los módulos'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleTicketAction(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        $comment = isset($_POST['observaciones'])? $_POST['observaciones'] : '';

        if (!$ticketId || !$id_user || !$comment) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->UpdateTicketAction($ticketId, $id_user, $comment);
        if ($result) {
            $this->response(['success' => true,'message' => 'El ticket ha sido devuelto al cliente exitosamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleUpdateStatusToReceiveInTaller(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';

        if (!$ticketId ||!$id_user) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }
        $repository = new technicalConsultionRepository();
        $result = $repository->UpdateStatusToReceiveInTaller($ticketId, $id_user);
        if ($result) {
            $this->response(['success' => true,'message' => 'El ticket ha sido movido a la cola de tickets para recepción en taller exitosamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar el cambio de estado.'], 500);
        }
    }

    public function handleupdateRepuestoDate(){
        $ticketId = isset($_POST['ticket_id'])? $_POST['ticket_id'] : '';
        $repuesto_date = isset($_POST['repuesto_date'])? $_POST['repuesto_date'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        $id_status_lab = isset($_POST['id_status_lab'])? $_POST['id_status_lab'] : '';
        if (!$ticketId || !$repuesto_date) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }
        $repository = new technicalConsultionRepository();
        $result = $repository->UpdateRepuestoDate($ticketId, $repuesto_date, $id_user, $id_status_lab);
        if ($result) {
            $this->response(['success' => true,'message' => 'El ticket ha sido actualizado exitosamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetOverdueRepuestoTickets(){
        $repository = new technicalConsultionRepository();
        $result = $repository->GetOverdueRepuestoTickets();
        if ($result!== false &&!empty($result)) {
            $this->response(['success' => true, 'tickets' => $result], 200);
        } elseif ($result!== false && empty($result)) {
            $this->response(['success' => false, 'message' => 'No hay tickets vencidos'], 404);
        } else {
            $this->response(['success' => false,'message' => 'Error al obtener los tickets vencidos.'], 500);
        }
    }

    public function handleUpdateRepuestoDate2(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $repuesto_date = isset($_POST['newDate'])? $_POST['newDate'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        if (!$ticketId || !$repuesto_date) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }
        $repository = new technicalConsultionRepository();
        $result = $repository->UpdateRepuestoDate2($ticketId, $repuesto_date, $id_user);
        if ($result) {
            $this->response(['success' => true,'message' => 'El ticket ha sido actualizado exitosamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleSendToComercial(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        if (!$ticketId ||!$id_user) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }
        $repository = new technicalConsultionRepository();
        $result = $repository->SendToComercial($ticketId, $id_user);

        if ($result) {
            $this->response(['success' => true,'message' => 'El ticket ha sido enviado a comercial exitosamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleSendToGestionRosal(){
        $ticketId = isset($_POST['ticketId'])? $_POST['ticketId'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        $keyCharged = isset($_POST['sendWithoutKeys'])? $_POST['sendWithoutKeys'] : '';

        if (!$ticketId ||!$id_user) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->SendToGestionRosal($ticketId, $id_user, $keyCharged);
        if ($result) {
            $this->response(['success' => true,'message' => 'El ticket ha sido enviado a gestión Rosal exitosamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleMarkKeyAsReceived(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        
        if (!$ticketId || !$id_user) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->MarkKeyAsReceived($ticketId, $id_user);
        if ($result) {
            $this->response(['success' => true,'message' => 'La clave ha sido marcada como recibida exitosamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    // En tu clase API (donde está handleGetImageToAproval)
   // En tu clase API (donde está handleGetImageToAproval)
   public function handleGetImageToAproval(){
          // Recupera el ticketId enviado por POST
        $ticketId = isset($_POST['ticketId']) ? $_POST['ticketId'] : '';
        $imageType = isset($_POST['imageType']) ? $_POST['imageType'] : ''; // Tipo de imagen (ej. 'signature', 'photo')

        // Validación: Si no se proporciona el ticketId, devuelve un error 400 Bad Request.
        if (!$ticketId || !$imageType) {
            $this->response(['success' => false, 'message' => 'ID de ticket requerido.'], 400); 
            return; // Termina la ejecución aquí
        }

        // Instancia de tu repositorio para obtener los detalles del adjunto
        $repository = new technicalConsultionRepository();
        $attachments = $repository->getTicketAttachmentsDetails($ticketId); // Esto debería devolver un array de adjuntos

        // Si no se encontraron adjuntos o hubo un error en la base de datos
        if ($attachments === false || empty($attachments)) {
            $this->response(['success' => false, 'message' => 'No se encontraron adjuntos para este ticket o error en la base de datos.'], 404);
            return; // Termina la ejecución aquí
        }

        // Asume que solo necesitas el primer adjunto (como en tu ejemplo de JSON)
        $attachment = $attachments[0]; 
        $filePath = $attachment['file_path']; // Ruta física del archivo en el servidor (ej. C:\uploads_tickets\...)
        $mimeType = $attachment['mime_type']; // Tipo MIME del archivo (ej. application/pdf, image/jpeg)
        $originalFilename = $attachment['original_filename']; // Nombre original del archivo

        // Verifica si el archivo realmente existe en la ruta física
        if (file_exists($filePath)) {
            // Limpia cualquier buffer de salida existente para evitar problemas de encabezado
            if (ob_get_level()) {
                ob_end_clean();
            }

            // Establece los encabezados HTTP para servir el archivo
            header('Content-Description: File Transfer');
            header('Content-Type: ' . $mimeType); // Importante: indica al navegador el tipo de contenido
            // 'inline' sugiere al navegador que intente mostrar el archivo en línea
            // 'attachment' forzaría una descarga
            header('Content-Disposition: inline; filename="' . basename($originalFilename) . '"');
            header('Expires: 0'); // No almacenar en caché
            header('Cache-Control: must-revalidate'); // Revalidar caché
            header('Pragma: public'); // Para compatibilidad con versiones anteriores de HTTP 1.0
            header('Content-Length: ' . filesize($filePath)); // Tamaño del archivo en bytes

            readfile($filePath);
            exit(); // ¡CRÍTICO! Termina la ejecución del script PHP aquí para que no se envíe nada más (ej. HTML extra o JSON)
        } else {
            // Error: El archivo no se encontró en el disco, aunque la DB lo listaba
            $this->response(['success' => false, 'message' => 'El archivo asociado no fue encontrado en el servidor. ' . $filePath], 404); // Puedes incluir $filePath para depurar
            return; // Termina la ejecución aquí
        }
    }

   public function handleVerifingBranches(){
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if (empty($rif)) {
            $this->response(['success' => false, 'message' => 'RIF no proporcionado.', 'id_region' => null], 400);
            return;
        }

        // 1. Obtener el id_estado usando el RIF
        // $estadoId ahora contiene directamente el valor del ID de estado (entero o null)
        $estadoId = $repository->VerifingBranches($rif);

        if ($estadoId !== null) { // <-- Aquí directamente compruebas si $estadoId NO es null
            
            // 2. Obtener la id_region usando el id_estado
            $id_region = $repository->getRegionFromStateId($estadoId); // Pasa $estadoId directamente

            if ($id_region !== null) {
                $this->response([
                    'success' => true,
                    'id_region' => $id_region
                ], 200);
            } else {
                // No se encontró la región para el estado
                $this->response(['success' => false, 'message' => 'No se encontró la región para el estado asociado al RIF.', 'id_region' => null], 404);
            }
        } else {
            // No se encontró el estado para el RIF
            $this->response(['success' => false, 'message' => 'No se encontraron sucursales o estado para el RIF proporcionado.', 'id_region' => null], 404);
        }
    }

    public function handleEntregarTicket(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        $comment = isset($_POST['comentario'])? $_POST['comentario'] : '';

        if (!$ticketId || !$comment || !$id_user) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->EntregarTicket($ticketId, $id_user,  $comment);

        if ($result) {
            // Obtener los datos del ticket para el modal
            $ticketData = $repository->GetTicketDataForDelivery($ticketId);
            
            $this->response([
                'success' => true,
                'message' => 'El ticket ha sido entregado exitosamente.',
                'ticket_data' => $ticketData
            ], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        } 
    }

    public function handleEntregarTicketDevolucion(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';

        if (!$ticketId ||!$id_user) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->EntregarTicketDevolucion($ticketId, $id_user);
        
        if ($result) {
            // Obtener los datos del ticket para el modal
            $ticketData = $repository->GetTicketDataForDelivery($ticketId);
            
            $this->response([
                'success' => true,
                'message' => 'El ticket ha sido entregado exitosamente.',
                'ticket_data' => $ticketData
            ], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        } 
    }

    public function handleUpdateStatusToReceiveInRosal(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';

        if (!$ticketId ||!$id_user) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->UpdateStatusToReceiveInRosal($ticketId, $id_user);
        if ($result) {
            $this->response(['success' => true,'message' => 'El estado del ticket ha sido actualizado a Recibido en Rosal.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetRegionsByTechnician(){
        $id_user = isset($_POST['id_tecnico'])? $_POST['id_tecnico'] : '';

        if (!$id_user) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->GetRegionsByTechnician($id_user);
        if ($result) {
            $this->response(['success' => true,'regions' => $result], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleUpdateStatusToReceiveInRegion(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';

        if (!$ticketId ||!$id_user) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->UpdateStatusToReceiveInRegion($ticketId, $id_user);
        if ($result) {
            $this->response(['success' => true,'message' => 'El estado del ticket ha sido actualizado a Recibido en Región.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetComponents(){
        $ticketId = isset($_POST['ticketId'])? $_POST['ticketId'] : '';

        if (!$ticketId) {
            $this->response(['success' => false,'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $id_ticket = (int)$ticketId;

        $repository = new technicalConsultionRepository();

        $result = $repository->GetComponents($id_ticket);
        if ($result) {
            $this->response(['success' => true,'components' => $result], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleSendToRegion(){
        $ticketId = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $serial = isset($_POST['pos_serial']) ? $_POST['pos_serial'] : '';

        // --- CORRECCIÓN AQUÍ ---
        // Recibe la cadena de texto de componentes, ej. "1,2"
        $componentsString = isset($_POST['components']) ? $_POST['components'] : '';
        
        // Divide la cadena por la coma para crear un array de PHP
        // Esto convierte "1,2" en un array ['1', '2']
        $componentes_array = explode(',', $componentsString);

        // Si la cadena está vacía, asegúrate de que el array también lo esté
        if (empty($componentsString)) {
            $componentes_array = [];
        }

        if (!$ticketId || !$id_user || !$serial) {
            $this->response(['success' => false, 'message' => 'Hay un campo vacío.'], 400);
            return;
        }


        // Verifica que $componentes_array sea un array y no nulo
        if (!is_array($componentes_array)) {
            $this->response(['success' => false, 'message' => 'Los datos de los componentes no son válidos.'], 400);
            return;
        }

        if (!$ticketId || !$id_user || !$serial) {
            $this->response(['success' => false, 'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        // Pasa el array decodificado al repositorio
        $result = $repository->SendToRegion($ticketId, $id_user, $componentes_array, $serial);
        if ($result) {
            $this->response(['success' => true, 'message' => 'El ticket ha sido enviado a la región exitosamente.'], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleSendToRegionWithoutComponent(){
        $ticketId = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';

        if (!$ticketId || !$id_user) {
            $this->response(['success' => false, 'message' => 'Hay un campo vacío.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->SendToRegionWithoutComponent($ticketId, $id_user);
        if ($result) {
            $this->response(['success' => true, 'message' => 'El ticket ha sido enviado a la región sin componentes.'], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleCheckTicketEnProceso(){
        $serial = isset($_POST['serial'])? $_POST['serial'] : '';

        if (!$serial) {
            $this->response([
                'success' => false,
                'message' => 'Serial no proporcionado'
            ], 400);
            return;
        }
        
        $consultaModel = new technicalConsultionRepository();
        // NOTA: Asegúrate de que el nombre de la función en el repositorio y el modelo sea el mismo que el de la función SQL
        // En este caso, tu función SQL se llama 'get_tickets_by_serial', pero tu código PHP llama 'CheckTicketEnProceso'.
        // Debes actualizar el nombre de la función en el modelo y repositorio para que coincida.
        $result = $consultaModel->CheckTicketEnProceso($serial);
        
        if ($result !== false && $result['row'] !== null && $result['numRows'] > 0) {
            $ticket = $result['row'];
            $this->response([
                'success' => true,
                'ticket_en_proceso' => true,
                'numero_ticket' => $ticket['nro_ticket'], // Asumiendo que ahora tu función SQL devuelve este campo o que existe en la tabla tickets
                'estado_ticket' => $ticket['name_status_ticket'], // Asumiendo que existe 'name_status_ticket' en el resultado
                'fecha_creacion' => $ticket['date_create_ticket'], // Asumiendo que existe 'issue_date' en la tabla tickets
                'falla' => $ticket['failure'] ?? 'No especificada' // Asumiendo que existe 'description' en la tabla tickets
            ]);
        } else {
            $this->response([
                'success' => true,
                'ticket_en_proceso' => false
            ]);
        }
    }

   
    public function handleHasComponents(){
        $ticketId = isset($_POST['ticketId']) ? $_POST['ticketId'] : '';
        $repository = new technicalConsultionRepository();
        
        // Llamamos al repositorio, que devuelve el array de componentes
        $components = $repository->HasComponents($ticketId);

        // Inicializamos una bandera para verificar si al menos un componente está seleccionado
        $anyComponentSelected = false;

        // Solo si se encontraron componentes, los recorremos para validar si alguno está seleccionado
        if (is_array($components) && !empty($components)) {
            foreach ($components as $component) {
                // El valor 't' de PostgreSQL se lee como un string en PHP
                if (isset($component['is_selected']) && $component['is_selected'] === 't') {
                    $anyComponentSelected = true;
                    // Salimos del bucle una vez que encontramos un componente seleccionado para optimizar
                    break;
                }
            }
        }

        // Usamos la bandera para determinar la respuesta final de la API
        if ($anyComponentSelected) {
            $this->response(['success' => true, 'hasComponents' => true, 'message' => 'El ticket tiene componentes asociados.', 'components' => $components], 200);
        } else {
            $this->response(['success' => true, 'hasComponents' => false, 'message' => 'El ticket no tiene componentes asociados.'], 200);
        }
    }

    public function handleGetDocumentByType() {
        $ticketId = isset($_POST['ticketId']) ? $_POST['ticketId'] : '';
        $documentType = isset($_POST['documentType']) ? $_POST['documentType'] : '';

        if (!$ticketId || !$documentType) {
            $this->response(['success' => false, 'message' => 'ID de ticket y tipo de documento requeridos.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $attachment = $repository->getDocumentByType($ticketId, $documentType);

        if ($attachment === false || empty($attachment)) {
            $this->response(['success' => false, 'message' => 'No se encontró el documento solicitado.'], 404);
            return;
        }

        $this->response([
            'success' => true,
            'document' => [
                'file_path' => $attachment['file_path'],
                'mime_type' => $attachment['mime_type'],
                'original_filename' => $attachment['original_filename'],
                'document_type' => $attachment['document_type']
            ]
        ], 200);
    }

    public function handleGetMotivos(){
        $documentType = isset($_POST['documentType']) ? $_POST['documentType'] : '';

        if (!$documentType) {
            $this->response(['success' => false, 'message' => 'Tipo de documento requerido.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->GetMotivos($documentType);

        if ($result) {
            $this->response(['success' => true,'motivos' => $result], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handlerechazarDocumentos(){
        $id_ticket = isset($_POST['ticketId'])? $_POST['ticketId'] : '';
        $id_motivo = isset($_POST['motivoId'])? $_POST['motivoId'] : '';
        $nro_ticket = isset($_POST['nroTicket'])? $_POST['nroTicket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        $document_type = isset($_POST['documentType'])? $_POST['documentType'] : '';


        if (!$id_ticket || !$id_motivo || !$nro_ticket || !$id_user || !$document_type) {
            $this->response(['success' => false, 'message' => 'Faltan los datos necesarios.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->RechazarDocumentos($id_ticket, $id_motivo, $nro_ticket, $id_user, $document_type);

        if ($result) {
            $this->response(['success' => true,'message' => 'El Documento ha sido rechazados correctamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleapprovedocument(){
        $nro_ticket = isset($_POST['nro_ticket'])? $_POST['nro_ticket'] : '';
        $id_ticket = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        $document_type = isset($_POST['document_type'])? $_POST['document_type'] : '';
        
        // Log para debug
        error_log("Datos recibidos - nro_ticket: $nro_ticket, id_ticket: $id_ticket, id_user: $id_user, document_type: $document_type");
        
        if (!$id_ticket || !$nro_ticket || !$id_user || !$document_type) {
            $this->response(['success' => false, 'message' => 'Faltan los datos necesarios.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->AprobarDocumento($id_ticket, $nro_ticket, $id_user, $document_type);

        // Log del resultado
        error_log("Resultado de AprobarDocumento: " . ($result ? 'true' : 'false'));

        if ($result) {
            $this->response(['success' => true,'message' => 'El Documento ha sido aprobado correctamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }
}
?>