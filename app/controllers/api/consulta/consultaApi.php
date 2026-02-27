<?php
namespace App\Controllers\Api\Consulta; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../../libs/View.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../repositories/technicalConsultionRepository.php';
require_once __DIR__ . '/../../../repositories/EmailRepository.php';
require_once __DIR__ . '/../../../Services/EmailServices.php';
require_once __DIR__ . '/../../../../config/paths.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Repositories\technicalConsultionRepository;
use App\Repositories\EmailRepository;
use App\Services\EmailService;
use Controller;
use DatabaseCon;
use DateTime;
require_once __DIR__ . '/../../../models/consulta_rifModel.php';
use consulta_rifModel;

class Consulta extends Controller
{
    private $db;
    private $app_base_path; // Añadido para evitar el error de propiedad indefinida
    private $emailService; // Service for handling email operations
    // ... otras propiedades que necesites

    function __construct()
    {
        parent::__construct();
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
        $this->emailService = new EmailService(); // Initialize the email service
    }

    public function processApi($urlSegments)
    {
        $method = $_SERVER['REQUEST_METHOD'];
        if (isset($urlSegments[1])) {
            $action = $urlSegments[1];
            error_log("ConsultaApi receiving action: " . $action);
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

                case 'GetPhotoDashboard':
                    $this->handleGetPhotoDashboard();

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

                case 'getCoordinacion':
                    $this->handlegetCoordinacion();
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

                case 'GetTicketDataPagos':
                    $this->handleGetTicketDataPagos();
                    break;
                
                case 'GetTicketDataGestionComercial':
                    $this->handleGetTicketDataGestionComercial();
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

                case 'UploadPaymentDoc':
                    $this->handleUploadPaymentDoc();
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

                case 'GetNonRejectedDocumentByType':
                    $this->handleGetNonRejectedDocumentByType();
                    break;

                case 'GetPaymentStatusByTicket':
                    $this->handleGetPaymentStatusByTicket();
                    break;



                case 'GetMotivos':
                    $this->handleGetMotivos();
                    break;

                case 'getMotivosDomiciliacion':
                    $this->handleGetMotivosDomiciliacion();
                    break;

                case 'getMotivoRechazo':
                    $this->handleGetMotivoRechazoDocumento();
                    break;

                case 'GetAccountsBanks':
                    $this->handleGetAccountsBanks();
                    break;

                case 'rechazarDocumento':
                    $this->handlerechazarDocumentos();
                    break;

                case 'approve-document':
                    $this->handleapprovedocument();
                    break;

                case 'get-payment-attachment':
                    $this->handleGetPaymentAttachment();
                    break;

                case 'globalSearchTicket':
                    $this->handleglobalSearchTicket();
                    break;

                case 'getEstatusTicket':
                    $this->handleGetEstatusTicket();
                    break;

                case 'finalizarRevisionTicket':
                    $this->handleFinalizarRevisionTicket();
                    break;

                case 'getRegionTicket':
                    $this->handleGetRegionTicket();
                    break;    
                
                case 'SendBackToTaller':
                    $this->handleSendBackToTaller();
                    break;

                case 'GetSimpleFailure':
                    $this->handleGetSimpleFailure();
                    break;

                case 'CloseTicket':
                    $this->handelCloseTicket();
                    break;

                case 'getBancoTicket':
                    $this->handleGetBancoTicket();
                    break;   
                    
                case 'GetTicketsComponentes':
                    $this->handleGetTicketsComponentes();
                    break;
                
                case 'GetPOSInfo':
                    $this->handleGetPOSInfo();
                    break;

                case 'GetAllPOSInfo':
                    $this->handleGetAllPOSInfo();
                    break;

                case 'GetPaymentMethods':
                    $this->handleGetPaymentMethods();
                    break;

                case 'GetExchangeRate':
                    $this->handleGetExchangeRate();
                    break;

                case 'GetExchangeRateToday':
                    $this->handleGetExchangeRateToday();
                    break;

                case 'GetExchangeRateByDate':
                    $this->handleGetExchangeRateByDate();
                    break;

                case 'GetBancos':
                    $this->handleGetBancos();
                    break;

                case 'SavePayment':
                    $this->handleSavePayment();
                    break;

                case 'GetEstatusPago':
                    $this->handleGetEstatusPago();
                    break;

                case 'GetEstatusPagoAutomatizado':
                    $this->handleGetEstatusPagoAutomatizado();
                    break;

                case 'GetPaymentsByTicket':
                    $this->handleGetPaymentsByTicket();
                    break;

                case 'GetTotalPaidByTicket':
                    $this->handleGetTotalPaidByTicket();
                    break;
                
                case 'InsertPaymentRecord':
                    $this->handleInsertPaymentRecord();
                    break;

                case 'GetStatuspayment':
                    $this->handleGetStatuspayment();
                    break;

                case 'GetPaymentData':
                    $this->handleGetPaymentData();
                    break;

                case 'GetPresupuestoData':
                    $this->handleGetPresupuestoData();
                    break;

                case 'SaveBudget':
                    $this->handleSaveBudget();
                    break;

                case 'CheckPaymentExistsToday':
                    $this->handleCheckPaymentExistsToday();
                    break;

                case 'UploadPresupuestoPDF':
                    $this->handleUploadPresupuestoPDF();
                    break;

                case 'GetBudgetIdByNroTicket':
                    $this->handleGetBudgetIdByNroTicket();
                    break;

                case 'GetPaymentByRecordNumber':
                    $this->handleGetPaymentByRecordNumber();
                    break;

                case 'GetPaymentAttachmentByRecordNumber':
                    $this->handleGetPaymentAttachmentByRecordNumber();
                    break;

                case 'GetPaymentById':
                    $this->handleGetPaymentById();
                    break;
                
                case 'UpdatePayment':
                    $this->handleUpdatePayment();
                    break;
                
                case 'SubstitutePayment':
                    $this->handleSubstitutePayment();
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

                case 10: 
                    $nombreArchivo = "D200T.png";
                    $claseImagen = "D200T";
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

                 case 16:
                    $nombreArchivo = "New-7210.png";
                    $claseImagen = "New-7210";
                break;

                case 17:
                    $nombreArchivo = "sunmi-P2SE.png";
                    $claseImagen = "sunmi-P2SE";
                break;

                case 18:
                    $nombreArchivo = "CUADRA-MINI-POS.png";
                    $claseImagen = "cuadra-mini-pos";
                break;

                case 19:
                    $nombreArchivo = "New-9220.png";
                    $claseImagen = "New-9220";
                break;

                case 20:
                    $nombreArchivo = "New-9310.png";
                    $claseImagen = "New-9310";
                break;

                case 21:
                    $nombreArchivo = "New-6210.png";
                    $claseImagen = "New-6210";
                break;

                case 22:
                    $nombreArchivo = "Kozen-P10.png";
                    $claseImagen = "Kozen-P10";
                break;

                case 25: 
                    $nombreArchivo = "P10-ZIO.png";
                    $claseImagen = "P10-ZIO";
                break;

                case 26: 
                    $nombreArchivo = "SUNMI-P2-LITE.png";
                    $claseImagen = "SUNMI-P2-LITE";
                break;

                case 27: 
                    $nombreArchivo = "New-8210.png";
                    $claseImagen = "New-8210";
                break;

                case 28: 
                    $nombreArchivo = "New-8210.png";
                    $claseImagen = "New-8210";
                break;

                default:
                    $nombreArchivo = "mantainment.png";
                    $claseImagen = "mantainment";

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

    public function handleGetPhotoDashboard()
    {
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el LoginRepository aquí
        //var_dump($serial);
        $result = $repository->SearchtypePos($serial);
        if ($result !== false) {
            $codrepositoryopos = $result;

            /*  AGREGAR CSS */
            $claseImagen = "imagen-predeterminada"; // Valor predeterminado
            switch ($codrepositoryopos) {
                case 1:
                    $nombreArchivo = "ingenico-ict220.png";
                    $claseImagen = "ingenico-ict220Dashboard";
                break;

                case 2:
                    $nombreArchivo = "ingenico-ict250.png";
                    $claseImagen = "ingenico-ict250Dashboard";
                break;

                case 3:
                    $nombreArchivo = "ingenico-iwl220.png";
                    $claseImagen = "ingenico-iwl220Dashboard";
                break;

                case 10: 
                    $nombreArchivo = "D200T.png";
                    $claseImagen = "D200TDashboard";
                break;

                case 11:
                    $nombreArchivo = "move-2500.png";
                    $claseImagen = "move-2500Dashboard";
                break;

                case 14:
                    $nombreArchivo = "sunmi-P2.png";
                    $claseImagen = "sunmi-P2Dashboard";
                break;

                case 15:
                    $nombreArchivo = "sunmi-P2mini.png";
                    $claseImagen = "sunmi-P2miniDashboard";
                break;

                 case 16:
                    $nombreArchivo = "New-7210.png";
                    $claseImagen = "New-7210Dashboard";
                break;

                case 17:
                    $nombreArchivo = "sunmi-P2SE.png";
                    $claseImagen = "sunmi-P2SEDashboard";
                break;

                case 18:
                    $nombreArchivo = "CUADRA-MINI-POS.png";
                    $claseImagen = "cuadra-mini-posDashboard";
                break;

                case 19:
                    $nombreArchivo = "New-9220.png";
                    $claseImagen = "New-9220Dashboard";
                break;

                case 20:
                    $nombreArchivo = "New-9310.png";
                    $claseImagen = "New-9310Dashboard";
                break;

                case 21:
                    $nombreArchivo = "New-6210.png";
                    $claseImagen = "New-6210Dashboard";
                break;

                case 22:
                    $nombreArchivo = "Kozen-P10.png";
                    $claseImagen = "Kozen-P10Dashboard";
                break;

                case 25: 
                    $nombreArchivo = "P10-ZIO.png";
                    $claseImagen = "P10-ZIODashboard";
                break;

                case 26: 
                    $nombreArchivo = "SUNMI-P2-LITE.png";
                    $claseImagen = "SUNMI-P2-LITEDashboard";
                break;

                case 27: 
                    $nombreArchivo = "New-8210.png";
                    $claseImagen = "New-8210Dashboard";
                break;

                case 28: 
                    $nombreArchivo = "New-8210.png";
                    $claseImagen = "New-8210Dashboard";
                break;

                default:
                    $nombreArchivo = "mantainment.png";
                    $claseImagen = "mantainmentDashboard";
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
    $descripcion_falla = isset($_POST['descrpFailure_text']) ? $_POST['descrpFailure_text'] : '';
    $razonsocial = isset($_POST['razonsocial']) ? $_POST['razonsocial'] : ''; // NUEVO
    $id_client = isset($_POST['id_client']) ? $_POST['id_client'] : ''; // NUEVO
    $id_intelipunto = isset($_POST['id_intelipunto']) ? $_POST['id_intelipunto'] : ''; // NUEVO

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
    if ($serial != '' && $falla_id != '' && $nivelFalla_id != '' && $id_user != '' && $rif != '' && $descripcion_falla != '') {
        $hoy = date('dmy');
        $fecha_para_db = date('Y-m-d');
        $resultado = $repository->GetTotalTickets($fecha_para_db);
        $totaltickets = $resultado + 1;
        $paddedTicketNumber = sprintf("%04d", $totaltickets);
        $Nr_ticket = $hoy . $paddedTicketNumber;

        // **Paso clave:** Llama al SaveDataFalla del REPOSITORIO
        // Este $result ahora es el array que el Model::SaveDataFalla devuelve,
        // conteniendo 'idTicketCreado' y 'status_info'.
        $result = $repository->SaveDataFalla($serial, $falla_id, $nivelFalla_id, $id_user, $rif, $Nr_ticket, $descripcion_falla, $razonsocial, $id_client, $id_intelipunto);

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
                    'status_text' => $status_text, // ¡Aquí está el estado!
                    'date_create_ticket' => date('Y-m-d H:i') // ✨ Agrega esta línea para incluir la fecha y hora de creación
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
    $coordinador_nombre = isset($_POST['coordinadorNombre']) ? $_POST['coordinadorNombre'] : '';
    // NUEVO: Obtener record_number para Anticipo
    $record_number = isset($_POST['record_number']) ? $_POST['record_number'] : null;
    $id_client = isset($_POST['id_client']) ? $_POST['id_client'] : ''; // NUEVO
    $id_intelipunto = isset($_POST['id_intelipunto']) ? $_POST['id_intelipunto'] : ''; // NUEVO
    $razonsocial = isset($_POST['razonsocial']) ? $_POST['razonsocial'] : ''; // NUEVO
    
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
        $razonsocial, // NUEVO
        $id_client,   // NUEVO
        $id_intelipunto // NUEVO
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
        $processFile = function($fileKey, $documentType, $ticketId, $nrTicket, $userId, $repo, $baseTicketDir, $dateForFilename, &$targetVar, $recordNumber = null) {
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
                    
                    // Solo agregar record_number si es Anticipo
                    if ($documentType === 'Anticipo' && $recordNumber) {
                        $targetVar['record_number'] = $recordNumber;
                    }
                    
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

        // Verificar si es "Actualización de Software" (id_failure = 9) o "Sin Llaves/Dukpt Vacío" (id_failure = 12)
        $isActualizacionSoftware = ($falla_id == 9);
        $isSinLlavesDukpt = ($falla_id == 12);
        $isFallaSinPago = $isActualizacionSoftware || $isSinLlavesDukpt;

        // 8. Procesar cada tipo de archivo adjunto
        // Si es "Actualización de Software" o "Sin Llaves/Dukpt Vacío", NO procesar anticipo ni exoneración
        $envioOk = $processFile('archivoEnvio', 'Envio', $idTicketCreado, $Nr_ticket, $id_user, $repository, $ticketUploadDir, $fecha_para_nombre_archivo, $archivoEnvioInfo);
        $exoneracionOk = $isFallaSinPago ? true : $processFile('archivoExoneracion', 'Exoneracion', $idTicketCreado, $Nr_ticket, $id_user, $repository, $ticketUploadDir, $fecha_para_nombre_archivo, $archivoExoneracionInfo);
        // Pasamos record_number solo a Anticipo
        $anticipoOk = $isFallaSinPago ? true : $processFile('archivoAnticipo', 'Anticipo', $idTicketCreado, $Nr_ticket, $id_user, $repository, $ticketUploadDir, $fecha_para_nombre_archivo, $archivoAnticipoInfo, $record_number);

        if (!$envioOk || (!$isFallaSinPago && (!$exoneracionOk || !$anticipoOk))) {
            error_log("Advertencia: Al menos un archivo adjunto no se pudo guardar correctamente para el ticket " . $idTicketCreado);
        }

        // 9. La transferencia del pago ahora se hace dentro de SaveDataFalla2 para usar la misma sesión de conexión
        // (Ya no es necesario llamarla aquí, pero mantenemos el comentario para referencia)

        // 9.1. Enviar correos según el id_status_payment del ticket
        // NO enviar correos si es "Actualización de Software"
        if (!$isActualizacionSoftware && ($anticipoOk || $exoneracionOk)) {
            // Obtener el id_status_payment del ticket
            $ticket_status_payment = $repository->getStatusPayment($idTicketReal);
            $id_status_payment_actual = isset($ticket_status_payment['id_status_payment']) ? (int)$ticket_status_payment['id_status_payment'] : null;
            
            $emailRepository = new EmailRepository();
            
            // Obtener datos completos del ticket para el correo
            $ticket_data = $emailRepository->GetTicketDataById($idTicketReal);
            
            // Preparar imágenes embebidas
            $embeddedImages = [];
            if (defined('FIRMA_CORREO')) {
                $embeddedImages['imagen_adjunta'] = FIRMA_CORREO;
            }
            
            // Si es Anticipo (id_status_payment = 7) y se guardó el documento
            // NOTA: Este correo se activa cuando se carga el documento de anticipo AL MOMENTO DE CREAR EL TICKET.
            if ($id_status_payment_actual == 7 && $anticipoOk) {
                $result_email_finanzas = $emailRepository->GetEmailAreaFinanzas();
                if ($result_email_finanzas && !empty($result_email_finanzas['email_area'])) {
                    $email_finanzas = $result_email_finanzas['email_area'];
                    $name_finanzas = $result_email_finanzas['name_area'] ?? 'Finanzas';
                    
                    // Obtener datos del ticket
                    $nombre_tecnico_email = $ticket_data['full_name_tecnico'] ?? 'N/A';
                    $ticketaccion_email = $ticket_data['name_accion_ticket'] ?? 'N/A';
                    $ticketdomiciliacion_email = $ticket_data['name_status_domiciliacion'] ?? 'N/A';
                    
                    // Obtener RIF y Razón Social desde GetClientInfo (igual que en domiciliación)
                    $result_client = $emailRepository->GetClientInfo($serial);
                    $clientRif_email = $result_client['coddocumento'] ?? $ticket_data['rif'] ?? $rif ?? 'N/A';
                    $clientName_email = $result_client['razonsocial'] ?? $ticket_data['razonsocial'] ?? $razonsocial ?? 'N/A';
                    
                    require_once __DIR__ . '/../email/emailApi.php';
                    $emailApi = new \App\Controllers\Api\email\email();
                    
                    $subject_finanzas = '📋 NOTIFICACIÓN FINANCIERA - Revisar Anticipo del Ticket';
                    $body_finanzas = $emailApi->getFinanzasEmailBodyForAnticipo(
                        $name_finanzas,
                        $nombre_tecnico_email,
                        $Nr_ticket,
                        $clientRif_email,
                        $clientName_email,
                        $serial,
                        $nivelFalla_text,
                        $falla_text,
                        date('Y-m-d H:i'),
                        $ticketaccion_email,
                        $status_text ?? 'N/A',
                        $status_payment_text ?? 'N/A',
                        $ticketdomiciliacion_email
                    );
                    
                    $this->emailService->sendEmail($email_finanzas, $subject_finanzas, $body_finanzas, [], $embeddedImages);
                    error_log("Correo de anticipo enviado a finanzas: " . $email_finanzas);
                }
            }
            
            // Si es Exoneración (id_status_payment = 5) y se guardó el documento
            // NOTA: Este correo se activa cuando se carga el documento de exoneración AL MOMENTO DE CREAR EL TICKET.
            if ($id_status_payment_actual == 5 && $exoneracionOk) {
                // Correos específicos para exoneración
                $emails_admin = [
                    'domiciliacion.intelipunto@inteligensa.com',
                    'olga.rojas@intelipunto.com',
                    'neishy.tupano@inteligensa.com'
                ];
                $name_admin = 'Administración';
                
                // Obtener datos del ticket
                $nombre_tecnico_email = $ticket_data['full_name_tecnico'] ?? 'N/A';
                $ticketaccion_email = $ticket_data['name_accion_ticket'] ?? 'N/A';
                $ticketdomiciliacion_email = $ticket_data['name_status_domiciliacion'] ?? 'N/A';
                
                // Obtener RIF y Razón Social desde GetClientInfo (igual que en domiciliación)
                $result_client = $emailRepository->GetClientInfo($serial);
                $clientRif_email = $result_client['coddocumento'] ?? $ticket_data['rif'] ?? $rif ?? 'N/A';
                $clientName_email = $result_client['razonsocial'] ?? $ticket_data['razonsocial'] ?? $razonsocial ?? 'N/A';
                
                require_once __DIR__ . '/../email/emailApi.php';
                $emailApi = new \App\Controllers\Api\email\email();
                
                $subject_admin = '📋 NOTIFICACIÓN ADMINISTRATIVA - Revisar Exoneración del Ticket';
                $body_admin = $emailApi->getAdminEmailBodyForExoneracion(
                    $name_admin,
                    $nombre_tecnico_email,
                    $Nr_ticket,
                    $clientRif_email,
                    $clientName_email,
                    $serial,
                    $nivelFalla_text,
                    $falla_text,
                    date('Y-m-d H:i'),
                    $ticketaccion_email,
                    $status_text ?? 'N/A',
                    $status_payment_text ?? 'N/A',
                    $ticketdomiciliacion_email
                );
                
                // Enviar correo a cada dirección de administración
                $emails_enviados_admin = 0;
                $total_emails_admin = count($emails_admin);
                
                foreach ($emails_admin as $email_admin) {
                    error_log("INTENTANDO ENVIAR CORREO DE EXONERACION A ADMINISTRACION: " . $email_admin);
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
                    error_log("TODOS LOS CORREOS DE EXONERACION ENVIADOS: " . $emails_enviados_admin . "/" . $total_emails_admin);
                } elseif ($emails_enviados_admin > 0) {
                    error_log("ALGUNOS CORREOS DE EXONERACION ENVIADOS: " . $emails_enviados_admin . "/" . $total_emails_admin);
                } else {
                    error_log("NINGUN CORREO DE EXONERACION FUE ENVIADO");
                }
            }
        }

        // 10. Responder al cliente con éxito, incluyendo el estado del ticket
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
                'status_payment' => $status_payment_text,
                'date_create_ticket' => date('Y-m-d H:i') // ✨ Agrega esta línea para incluir la fecha y hora de creación

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
        error_log("GetUltimateTicket DEBUG: Serial recibido = '" . $serial . "'");
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($serial != '') {
            $result = $repository->UltimateDateTicket($serial);
            error_log("GetUltimateTicket DEBUG: Resultado del repositorio = " . print_r($result, true));

            if ($result) {
                $this->response(['success' => true, 'fecha' => $result['fecha'], 'nro_ticket' => $result['nro_ticket']], 200);
            } else {
                $this->response(['success' => true, 'message' => 'No tiene ticket', 'fecha' => null, 'nro_ticket' => null], 400);
            }
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

    public function handlegetCoordinacion()
    {
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->getCoordinacion();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'coordinaciones' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay coordinadores disponibles o No ha seleccionado ningun coordinador'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los coordinadores'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
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


    public function handleGetTicketDataPagos(){
          {
        $id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketDataPagos($id_user);

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay datos de tickets disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los datos de tickets'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }
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
               // var_dump($result);
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
        $observation = isset($_POST['observations']) ? $_POST['observations'] : '';

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->UpdateDomiciliacionStatus($id_new_status, $id_ticket, $id_user, $observation);
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
        // Intentar obtener ticketId de diferentes formas
        $ticketId = '';
        if (isset($_POST['ticketId'])) {
            $ticketId = trim($_POST['ticketId']);
        } elseif (isset($_GET['ticketId'])) {
            $ticketId = trim($_GET['ticketId']);
        }

        // Validar que ticketId no esté vacío
        if (empty($ticketId) || $ticketId === '' || $ticketId === '0' || $ticketId === 'undefined' || $ticketId === 'null') {
            error_log("GetComponents: ticketId vacío o inválido. POST data: " . print_r($_POST, true));
            $this->response(['success' => false,'message' => 'Hay un campo vacío. El ID del ticket es requerido.'], 400);
            return;
        }

        $id_ticket = (int)$ticketId;
        
        // Validar que sea un número válido
        if ($id_ticket <= 0) {
            error_log("GetComponents: ticketId no es un número válido. Valor recibido: " . $ticketId);
            $this->response(['success' => false,'message' => 'El ID del ticket no es válido.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();

        $result = $repository->GetComponents($id_ticket);
        if ($result !== false && $result !== null) {
            $this->response(['success' => true,'components' => $result], 200);
        } else {
            error_log("GetComponents: Error al obtener componentes para ticket ID: " . $id_ticket);
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleSendToRegion(){
        $ticketId = isset($_POST['id_ticket']) ? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $serial = isset($_POST['pos_serial']) ? $_POST['pos_serial'] : '';
        $modulo = isset($_POST['modulo']) ? $_POST['modulo'] : '';

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
        $result = $repository->SendToRegion($ticketId, $id_user, $componentes_array, $serial, $modulo);
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



    public function handleGetNonRejectedDocumentByType() {
        // Support both snake_case (new) and camelCase (old)
        $nro_ticket = isset($_POST['nro_ticket']) ? $_POST['nro_ticket'] : (isset($_POST['ticketId']) ? $_POST['ticketId'] : '');
        $document_type = isset($_POST['document_type']) ? $_POST['document_type'] : (isset($_POST['documentType']) ? $_POST['documentType'] : '');

        if (!$nro_ticket || !$document_type) {
            $this->response(['success' => false, 'message' => 'Nro de ticket y tipo de documento requeridos.'], 400);
            return;
        }

        // Bypass repository due to file stability issues, use Model directly
        $model = new consulta_rifModel();
        $attachment = $model->getNonRejectedDocumentByType($nro_ticket, $document_type);

        if ($attachment === false || empty($attachment)) {
            $this->response(['success' => false, 'message' => 'No se encontró el documento solicitado (no rechazado).'], 404);
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


    public function handleGetPaymentStatusByTicket() {
        $nro_ticket = isset($_POST['nro_ticket']) ? $_POST['nro_ticket'] : '';

        if (!$nro_ticket) {
            $this->response(['success' => false, 'message' => 'Nro de ticket requerido.'], 400);
            return;
        }

        // Bypass repository due to file stability issues, use Model directly
        $model = new consulta_rifModel();
        
        // This method in the model is documented to return 17 if multiple payments exist, or 7 if none.
        $result = $model->GetPaymentStatusByTicket($nro_ticket);

        if ($result && isset($result['numRows']) && $result['numRows'] > 0) {
             $status = pg_fetch_assoc($result['query'], 0);
             $this->response(['success' => true, 'status' => $status], 200);
        } else {
             $this->response(['success' => false, 'message' => 'No se pudo determinar el estatus de pago.'], 500);
        }
    }

    public function handleGetMotivosDomiciliacion(){
        $documentType = 'Convenio_Firmado';

        if (!$documentType) {
            $this->response(['success' => false, 'message' => 'Tipo de documento requerido.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->GetMotivos($documentType);

        if ($result) {
            $this->response(['success' => true, 'motivos' => $result], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetMotivoRechazoDocumento(){
        $ticketId = isset($_POST['ticketId']) ? $_POST['ticketId'] : '';
        $nroTicket = isset($_POST['nroTicket']) ? $_POST['nroTicket'] : '';
        $documentType = isset($_POST['documentType']) ? $_POST['documentType'] : 'convenio_firmado';

        if (!$ticketId) {
            $this->response(['success' => false, 'message' => 'ID de ticket requerido.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->getMotivoRechazoDocumento($ticketId, $nroTicket, $documentType);

        if ($result !== false && $result !== null) {
            $this->response(['success' => true, 'motivo' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontró motivo de rechazo.'], 404);
        }
    }

    public function handleGetMotivos(){
        $documentType = isset($_POST['documentType']) ? $_POST['documentType'] : '';

        //$documentType = 'Convenio_Firmado';

        if (!$documentType) {
            $this->response(['success' => false, 'message' => 'Tipo de documento requerido.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->GetMotivos($documentType);

        if ($result) {
            $this->response(['success' => true, 'motivos' => $result], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    // Lista de bancos y cuentas para Acuerdos de Pago
    public function handleGetAccountsBanks(){
        $repository = new technicalConsultionRepository();
        $result = $repository->GetAccountsBanks();

        if ($result !== null) {
            $this->response(['success' => true, 'banks' => $result], 200);
        } else {
            $this->response(['success' => false,'message' => 'No fue posible obtener los bancos.'], 500);
        }
    }

    public function handlerechazarDocumentos(){
        $id_ticket = isset($_POST['ticketId'])? $_POST['ticketId'] : '';
        $id_motivo = isset($_POST['motivoId'])? $_POST['motivoId'] : '';
        $nro_ticket = isset($_POST['nroTicket'])? $_POST['nroTicket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        $document_type = isset($_POST['documentType']) ? $_POST['documentType'] : '';
        $id_payment_record = isset($_POST['id_payment_record']) ? $_POST['id_payment_record'] : null;

        if (!$id_ticket || !$id_motivo || !$nro_ticket || !$id_user || !$document_type) {
            $this->response(['success' => false, 'message' => 'Faltan los datos necesarios.'], 400);
            return;
        }
        

        $repository = new technicalConsultionRepository();
        $result = $repository->RechazarDocumentos($id_ticket, $id_motivo, $nro_ticket, $id_user, $document_type, $id_payment_record);

        if ($result) {
            $this->response(['success' => true,'message' => 'El Documento ha sido rechazado correctamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleapprovedocument(){
        $nro_ticket = isset($_POST['nro_ticket'])? $_POST['nro_ticket'] : '';
        $id_ticket = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
        $document_type = isset($_POST['document_type'])? $_POST['document_type'] : '';
        $nro_payment_reference_verified = isset($_POST['nro_payment_reference_verified'])? trim($_POST['nro_payment_reference_verified']) : '';
        $payment_date_verified = isset($_POST['payment_date_verified'])? trim($_POST['payment_date_verified']) : '';
        $amount_verified = isset($_POST['amount_verified'])? trim($_POST['amount_verified']) : '';
        $id_payment_record = isset($_POST['id_payment_record']) ? $_POST['id_payment_record'] : null;
        
        // Log para debug
        error_log("Datos recibidos - nro_ticket: $nro_ticket, id_ticket: $id_ticket, id_user: $id_user, document_type: $document_type");
        error_log("Datos verificados - nro_payment_reference_verified: $nro_payment_reference_verified, payment_date_verified: $payment_date_verified");
        
        if (!$id_ticket || !$nro_ticket || !$id_user || !$document_type) {
            $this->response(['success' => false, 'message' => 'Faltan los datos necesarios.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        // Pasar los datos verificados directamente a AprobarDocumento
        $result = $repository->AprobarDocumento($id_ticket, $nro_ticket, $id_user, $document_type, $nro_payment_reference_verified, $payment_date_verified, $id_payment_record, $amount_verified);

        // Log del resultado
        error_log("Resultado de AprobarDocumento: " . ($result ? 'true' : 'false'));

        if ($result) {
            $this->response(['success' => true,'message' => 'El Documento ha sido aprobado correctamente.'], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetPaymentAttachment(){
        $record_number = isset($_POST['record_number']) ? $_POST['record_number'] : '';
        if (!$record_number) {
            $this->response(['success' => false, 'message' => 'Falta el record_number.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $attachment = $repository->GetPaymentAttachmentByRecordNumber($record_number);

        if ($attachment) {
            $this->response([
                'success' => true, 
                'attachment' => $attachment
            ], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontró archivo adjunto para este pago.'], 404);
        }
    }

    public function handleGetEstatusTicket(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetEstatusTicket();
       // var_dump($result);
        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'Estatus' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay coordinadores disponibles o No ha seleccionado ningun coordinador'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los coordinadores'], 500); // Código 500 Internal Server Error
        }
    }

    public function handleFinalizarRevisionTicket()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $nroTicket = $_POST['nroTicket'] ?? null;
            $id_user = $_POST['id_user'] ?? null;

            if ($nroTicket && $id_user) {
                $repository =  new technicalConsultionRepository(); // Inicializa el repositorio
                $result = $repository->FinalizarRevisionTicket($nroTicket, $id_user);
                $this->response($result, 200);
            } else {
                $this->response(['success' => false, 'message' => 'Parámetros incompletos'], 400);
            }
        } else {
            $this->response(['error' => 'Método no permitido'], 405);
        }
    }


    public function handleGetRegionTicket(){
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetRegionTicket($id_user);
       // var_dump($result);
        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'regionusers' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay coordinadores disponibles o No ha seleccionado ningun coordinador'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los coordinadores'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }

    public function handleSendBackToTaller(){
        $id_ticket = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';

        if (!$id_ticket || !$id_user) {
            $this->response(['success' => false, 'message' => 'Faltan los datos necesarios(id_user o id_ticket).'], 400);
            return;
        }

        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->SendBackToTaller($id_ticket, $id_user);

       if ($result) {
            $this->response(['success' => true, 'message' => 'El pos ha sido devuelto al Taller.'], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetSimpleFailure(){
        $id_ticket = isset($_POST['ticketId'])? $_POST['ticketId'] : '';
    
        if (!$id_ticket) {
            $this->response(['success' => false, 'message' => 'Faltan el Id_ticket.'], 400);
            return;
        }
    
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetSimpleFailure($id_ticket);

        if ($result) {
            $this->response(['success' => true, 'message' => 'Se ha encontralo la falla del pos.',   'failure' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handelCloseTicket(){
        $id_ticket = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
    
        if (!$id_ticket || !$id_user) {
            $this->response(['success' => false, 'message' => 'Faltan el Id_ticket o el id_user.'], 400);
            return;
        }
    
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->ClosedTicket($id_ticket, $id_user);

         if ($result) {
            // Obtener los datos del ticket para el modal
            $ticketData = $repository->GetTicketReentry_lab($id_ticket);
            
            $this->response(['success' => true, 'message' => 'El ticket ha sido cerrado exitosamente.', 'ticket_data' => $ticketData], 200);
        } else {
            $this->response(['success' => false,'message' => 'Error al realizar la acción.'], 500);
        } 
    }

    public function handleGetTicketDataGestionComercial(){
        $id_user = isset($_POST['id_user'])? $_POST['id_user'] : '';
    
        if (!$id_user) {
            $this->response(['success' => false, 'message' => 'Faltan el id_user.'], 400);
            return;
        }
    
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketDataGestionComercial($id_user);

        if ($result) {
            $this->response(['success' => true, 'message' => 'Se ha encontrado la información del ticket.', 'ticket_data' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetBancoTicket(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetBancoTicket();
        if ($result!== false &&!empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'ticket' => $result], 200);
        } elseif ($result!== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay serial disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los serial'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Coloque un serial']);
    }

    public function handleGetTicketsComponentes(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetTicketDataComponent();

        if ($result) {
            $this->response(['success' => true, 'message' => 'Se ha encontrado la información del ticket.', 'tickets' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetPOSInfo(){
        $ticket_id = isset($_POST['id_ticket'])? $_POST['id_ticket'] : '';
        $serial = isset($_POST['serial'])? $_POST['serial'] : '';

    
        if (!$ticket_id || !$serial) {
            $this->response(['success' => false, 'message' => 'Faltan el id_ticket y el serial.'], 400);
            return;
        } 
        
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetComponentsBySerial($ticket_id, $serial);

        if ($result) {
            $this->response(['success' => true, 'message' => 'Se ha encontrado la información del ticket.', 'tickets' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetAllPOSInfo(){
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio
        $result = $repository->GetAllComponentsPOS();

        if ($result) {
            $this->response(['success' => true, 'message' => 'Se ha encontrado la información de todos los POS.', 'tickets' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al realizar la acción.'], 500);
        }
    }

    public function handleGetPaymentMethods(){
        $repository = new technicalConsultionRepository();
        $result = $repository->GetPaymentMethods();

        if ($result !== false && !empty($result)) {
            $this->response(['success' => true, 'payment_methods' => $result], 200);
        } elseif ($result !== false && empty($result)) {
            $this->response(['success' => false, 'message' => 'No hay métodos de pago disponibles.', 'payment_methods' => []], 404);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los métodos de pago.'], 500);
        }
    }

    public function handleGetExchangeRate(){
        $repository = new technicalConsultionRepository();
        $result = $repository->GetExchangeRate();

        if ($result !== null && isset($result['tasa_dolar'])) {
            $this->response(['success' => true, 'exchange_rate' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se pudo obtener la tasa de cambio.'], 500);
        }
    }

    public function handleGetExchangeRateToday(){
        $repository = new technicalConsultionRepository();
        $result = $repository->GetExchangeRateToday();

        // Debug: Log para ver qué se está retornando
        error_log("handleGetExchangeRateToday - Resultado: " . print_r($result, true));

        if ($result !== null && isset($result['tasa_dolar'])) {
            $this->response(['success' => true, 'exchange_rate' => $result], 200);
        } else {
            // Retornar más información de debug
            $debugInfo = [
                'result_is_null' => ($result === null),
                'has_tasa_dolar' => isset($result['tasa_dolar']),
                'result_keys' => ($result !== null ? array_keys($result) : [])
            ];
            error_log("handleGetExchangeRateToday - Error: " . print_r($debugInfo, true));
            $this->response(['success' => false, 'message' => 'No se pudo obtener la tasa de cambio del día de hoy.', 'debug' => $debugInfo], 500);
        }
    }

    public function handleGetExchangeRateByDate(){
        $fecha = isset($_POST['fecha']) ? trim($_POST['fecha']) : null;
        
        if (empty($fecha)) {
            $this->response(['success' => false, 'message' => 'La fecha es requerida.'], 400);
            return;
        }

        // Log para debug
        error_log("handleGetExchangeRateByDate - Fecha recibida: " . $fecha);

        $repository = new technicalConsultionRepository();
        $result = $repository->GetExchangeRateByDate($fecha);

        // Log para debug
        error_log("handleGetExchangeRateByDate - Resultado: " . print_r($result, true));

        if ($result !== null && isset($result['tasa_dolar'])) {
            $this->response(['success' => true, 'exchange_rate' => $result], 200);
        } else {
            $debugInfo = [
                'fecha_recibida' => $fecha,
                'result_is_null' => ($result === null),
                'has_tasa_dolar' => isset($result['tasa_dolar']),
                'result_keys' => ($result !== null ? array_keys($result) : [])
            ];
            error_log("handleGetExchangeRateByDate - Error: " . print_r($debugInfo, true));
            $this->response(['success' => false, 'message' => 'No se pudo obtener la tasa de cambio para la fecha especificada.', 'debug' => $debugInfo], 500);
        }
    }

    public function handleGetBancos(){
        $repository = new technicalConsultionRepository();
        $result = $repository->GetBancos();

        if ($result !== false && !empty($result)) {
            $this->response(['success' => true, 'bancos' => $result], 200);
        } elseif ($result !== false && empty($result)) {
            $this->response(['success' => false, 'message' => 'No hay bancos disponibles.', 'bancos' => []], 404);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los bancos.'], 500);
        }
    }

    public function handleGetEstatusPago(){
        $repository = new technicalConsultionRepository();
        $result = $repository->GetEstatusPago();

        if ($result !== false && !empty($result)) {
            $this->response(['success' => true, 'estatus_pago' => $result], 200);
        } elseif ($result !== false && empty($result)) {
            $this->response(['success' => false, 'message' => 'No hay estatus de pago disponibles.', 'estatus_pago' => []], 404);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los estatus de pago.'], 500);
        }
    }

    public function handleGetEstatusPagoAutomatizado(){
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : null;
        $repository = new technicalConsultionRepository();
        $result = $repository->GetEstatusPagoAutomatizado($nro_ticket);

        if ($result !== false && !empty($result)) {
            $this->response(['success' => true, 'estatus_pago' => $result], 200);
        } elseif ($result !== false && empty($result)) {
            $this->response(['success' => false, 'message' => 'No hay estatus de pago disponibles.', 'estatus_pago' => []], 404);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los estatus de pago.'], 500);
        }
    }

    public function handleGetPaymentsByTicket(){
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : null;
        
        if (empty($nro_ticket)) {
            $this->response(['success' => false, 'message' => 'Número de ticket requerido.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->GetPaymentsByTicket($nro_ticket);

        if ($result !== false && !empty($result)) {
            $this->response(['success' => true, 'payments' => $result], 200);
        } elseif ($result !== false && empty($result)) {
            $this->response(['success' => true, 'message' => 'No hay pagos registrados para este ticket.', 'payments' => []], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los pagos.'], 500);
        }
    }

    public function handleGetTotalPaidByTicket(){
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : null;
        
        if (empty($nro_ticket)) {
            $this->response(['success' => false, 'message' => 'Número de ticket requerido.'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->GetTotalPaidByTicket($nro_ticket);

        $this->response([
            'success' => true, 
            'total_paid' => $result['total_paid'],
            'total_budget' => $result['total_budget'],
            'presupuesto_diferencia' => isset($result['presupuesto_diferencia']) ? $result['presupuesto_diferencia'] : 0
        ], 200);
    }

    public function handleInsertPaymentRecord(){
        // Basic validation
        if (empty($_POST['nro_ticket']) || empty($_POST['amount_bs'])) {
             $this->response(['success' => false, 'message' => 'Faltan datos obligatorios.'], 400);
             return;
        }

        $incomingDate = isset($_POST['payment_date']) ? $_POST['payment_date'] : date('Y-m-d');
        $payment_date = $incomingDate . ' ' . date('H:i:s');

        $data = [
            'nro_ticket' => $_POST['nro_ticket'],
            'serial_pos' => isset($_POST['serial_pos']) ? $_POST['serial_pos'] : '',
            'user_loader' => isset($_POST['user_loader']) ? $_POST['user_loader'] : 0,
            'payment_date' => $payment_date,
            'origen_bank' => isset($_POST['origen_bank']) ? $_POST['origen_bank'] : null,
            'destination_bank' => isset($_POST['destination_bank']) ? $_POST['destination_bank'] : null,
            'payment_method' => isset($_POST['payment_method']) ? $_POST['payment_method'] : '',
            'currency' => isset($_POST['currency']) ? $_POST['currency'] : 'BS',
            'reference_amount' => isset($_POST['reference_amount']) ? $_POST['reference_amount'] : null,
            'amount_bs' => $_POST['amount_bs'],
            'payment_reference' => isset($_POST['payment_reference']) ? $_POST['payment_reference'] : '',
            'depositor' => isset($_POST['depositor']) ? $_POST['depositor'] : '',
            'observations' => isset($_POST['observations']) ? $_POST['observations'] : '',
            'record_number' => isset($_POST['record_number']) ? $_POST['record_number'] : '',
            
            // Mobile payment fields
            'destino_rif_tipo' => isset($_POST['destino_rif_tipo']) ? $_POST['destino_rif_tipo'] : null,
            'destino_rif_numero' => isset($_POST['destino_rif_numero']) ? $_POST['destino_rif_numero'] : null,
            'destino_telefono' => isset($_POST['destino_telefono']) ? $_POST['destino_telefono'] : null,
            'origen_rif_tipo' => isset($_POST['origen_rif_tipo']) ? $_POST['origen_rif_tipo'] : null,
            'origen_rif_numero' => isset($_POST['origen_rif_numero']) ? $_POST['origen_rif_numero'] : null,
            'origen_telefono' => isset($_POST['origen_telefono']) ? $_POST['origen_telefono'] : null,
        ];

        $repository = new technicalConsultionRepository();
        $result = $repository->InsertPaymentRecord($data);

        if ($result) {
            // Enviar notificación por correo a Tesorería
            try {
                require_once __DIR__ . '/../email/emailApi.php';
                $emailApi = new \App\Controllers\Api\email\email();
                // Simular el POST para el handler
                $_POST['nro_ticket'] = $data['nro_ticket'];
                $_POST['serial_pos'] = $data['serial_pos'];
                $_POST['amount_bs'] = $data['amount_bs'];
                $_POST['reference_amount'] = $data['reference_amount'];
                $_POST['payment_method'] = $data['payment_method'];
                $_POST['payment_reference'] = $data['payment_reference'];
                $_POST['payment_date'] = $data['payment_date'];
                
                $emailApi->handleSendPaymentRegistrationEmail();
            } catch (\Exception $e) {
                error_log("Error al intentar enviar notificación de pago por correo: " . $e->getMessage());
            }

            $this->response(['success' => true, 'message' => 'Pago registrado con éxito.', 'id_payment' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al registrar el pago.'], 500);
        }
    }

    public function handleGetStatuspayment(){
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : null;
        $repository = new technicalConsultionRepository();
        $result = $repository->GetPaymentStatusByTicket($nro_ticket);

        if ($result !== null && !empty($result)) {
            $this->response(['success' => true, 'data' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontró estatus de pago para este ticket'], 404);
        }
    }

    public function handleGetPaymentData(){
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : '';
        $id_payment_record = isset($_POST['id_payment_record']) ? trim($_POST['id_payment_record']) : null;
        $payment_reference = isset($_POST['payment_reference']) ? trim($_POST['payment_reference']) : null;
        $record_number = isset($_POST['record_number']) ? trim($_POST['record_number']) : null;
        
        if (empty($nro_ticket)) {
            $this->response(['success' => false, 'message' => 'Número de ticket no proporcionado'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->GetPaymentData($nro_ticket, $id_payment_record, $payment_reference, $record_number);

        if ($result !== null && !empty($result)) {
            // Asegurarse de que los campos estén presentes
             $paymentData = [
                'payment_reference' => isset($result['payment_reference']) ? $result['payment_reference'] : '',
                'payment_date' => isset($result['payment_date']) ? $result['payment_date'] : '',
                'nro_ticket' => isset($result['nro_ticket']) ? $result['nro_ticket'] : $nro_ticket,
                'serial_pos' => isset($result['serial_pos']) ? $result['serial_pos'] : '',
                'amount_bs' => isset($result['amount_bs']) ? $result['amount_bs'] : (isset($result['total_amount_bs']) ? $result['total_amount_bs'] : ''),
                'reference_amount' => isset($result['reference_amount']) ? $result['reference_amount'] : (isset($result['total_reference_amount']) ? $result['total_reference_amount'] : (isset($result['amount_usd']) ? $result['amount_usd'] : '')),
                // Agregar los totales de TODOS los pagos del ticket
                'total_reference_amount' => isset($result['total_reference_amount']) ? $result['total_reference_amount'] : '',
                'total_amount_bs' => isset($result['total_amount_bs']) ? $result['total_amount_bs'] : '',
                'currency' => isset($result['currency']) ? $result['currency'] : '',
                'payment_method' => isset($result['payment_method']) ? $result['payment_method'] : '',
                'origen_bank' => isset($result['origen_bank']) ? $result['origen_bank'] : '',
                'destination_bank' => isset($result['destination_bank']) ? $result['destination_bank'] : '',
                'depositor' => isset($result['depositor']) ? $result['depositor'] : '',
                'destino_rif_tipo' => isset($result['destino_rif_tipo']) ? $result['destino_rif_tipo'] : '',
                'destino_rif_numero' => isset($result['destino_rif_numero']) ? $result['destino_rif_numero'] : '',
                'destino_telefono' => isset($result['destino_telefono']) ? $result['destino_telefono'] : '',
                'destino_banco' => isset($result['destino_banco']) ? $result['destino_banco'] : '',
                'origen_rif_tipo' => isset($result['origen_rif_tipo']) ? $result['origen_rif_tipo'] : '',
                'origen_rif_numero' => isset($result['origen_rif_numero']) ? $result['origen_rif_numero'] : '',
                'origen_telefono' => isset($result['origen_telefono']) ? $result['origen_telefono'] : '',
                'origen_banco' => isset($result['origen_banco']) ? $result['origen_banco'] : ''
            ];
            $this->response(['success' => true, 'data' => $paymentData], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontró información de pago para este ticket'], 404);
        }
    }

    public function handleCheckPaymentExistsToday(){
        $serial_pos = isset($_POST['serial_pos']) ? trim($_POST['serial_pos']) : '';
        
        if (empty($serial_pos)) {
            $this->response(['success' => false, 'message' => 'Serial no proporcionado', 'exists' => false], 400);
            return;
        }
        
        $repository = new technicalConsultionRepository();
        $exists = $repository->CheckPaymentExistsToday($serial_pos);
        
        $this->response(['success' => true, 'exists' => $exists], 200);
    }

    public function handleGetPresupuestoData(){
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : '';
        
        if (empty($nro_ticket)) {
            $this->response(['success' => false, 'message' => 'Número de ticket no proporcionado'], 400);
            return;
        }

        $repository = new technicalConsultionRepository();
        $result = $repository->GetPresupuestoData($nro_ticket);

        if ($result !== null && !empty($result)) {
            $this->response(['success' => true, 'data' => $result], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontraron datos del cliente para este ticket'], 404);
        }
    }

    /**
     * Maneja el guardado de pagos en la tabla temporal temp_payment_uploads
     * 
     * @return void
     */
    public function handleSavePayment(){
        $repository = new technicalConsultionRepository();
        
        // ============================================
        // 1. OBTENER DATOS DEL POST - Información General
        // ============================================
        $serial_pos = isset($_POST['serial_pos']) ? trim($_POST['serial_pos']) : '';
        $nro_ticket = isset($_POST['nro_ticket']) && $_POST['nro_ticket'] !== '' ? trim($_POST['nro_ticket']) : null;
        $user_loader = isset($_POST['user_loader']) && $_POST['user_loader'] !== '' ? (int)$_POST['user_loader'] : null;
        $payment_date = isset($_POST['payment_date']) && $_POST['payment_date'] !== '' ? trim($_POST['payment_date']) : null;
        $payment_method = isset($_POST['payment_method']) ? trim($_POST['payment_method']) : '';
        $currency = isset($_POST['currency']) ? trim($_POST['currency']) : '';
        $amount_bs = isset($_POST['amount_bs']) ? $_POST['amount_bs'] : 0;
        
        // ============================================
        // 2. OBTENER DATOS DEL POST - Información Bancaria
        // ============================================
        $origen_bank = isset($_POST['origen_bank']) && $_POST['origen_bank'] !== '' ? trim($_POST['origen_bank']) : null;
        $destination_bank = isset($_POST['destination_bank']) && $_POST['destination_bank'] !== '' ? trim($_POST['destination_bank']) : null;
        
        // ============================================
        // 3. OBTENER DATOS DEL POST - Montos y Referencias
        // ============================================
        $reference_amount = isset($_POST['reference_amount']) && $_POST['reference_amount'] !== '' ? (float)$_POST['reference_amount'] : null;
        $payment_reference = isset($_POST['payment_reference']) && $_POST['payment_reference'] !== '' ? trim($_POST['payment_reference']) : null;
        $record_number = isset($_POST['record_number']) && $_POST['record_number'] !== '' ? trim($_POST['record_number']) : null;
        
        // ============================================
        // 4. OBTENER DATOS DEL POST - Información Adicional
        // ============================================
        $depositor = isset($_POST['depositor']) && $_POST['depositor'] !== '' ? trim($_POST['depositor']) : null;
        $observations = isset($_POST['observations']) && $_POST['observations'] !== '' ? trim($_POST['observations']) : null;
        $loadpayment_date = isset($_POST['loadpayment_date']) && $_POST['loadpayment_date'] !== '' ? trim($_POST['loadpayment_date']) : date('Y-m-d H:i:s');
        $raw_confirmation = isset($_POST['confirmation_number']) ? $_POST['confirmation_number'] : 'false';
        $confirmation_number = ($raw_confirmation === 'true' || $raw_confirmation === 'TRUE' || $raw_confirmation === '1' || $raw_confirmation === true);
        $payment_status = isset($_POST['payment_id']) && $_POST['payment_id'] !== '' ? (int)$_POST['payment_id'] : 7;
        
        // ============================================
        // 5. OBTENER DATOS DEL POST - Pago Móvil (Destino)
        // ============================================
        $destino_rif_tipo = isset($_POST['destino_rif_tipo']) && $_POST['destino_rif_tipo'] !== '' ? trim($_POST['destino_rif_tipo']) : null;
        $destino_rif_numero = isset($_POST['destino_rif_numero']) && $_POST['destino_rif_numero'] !== '' ? trim($_POST['destino_rif_numero']) : null;
        $destino_telefono = isset($_POST['destino_telefono']) && $_POST['destino_telefono'] !== '' ? trim($_POST['destino_telefono']) : null;
        $destino_banco = isset($_POST['destino_banco']) && $_POST['destino_banco'] !== '' ? trim($_POST['destino_banco']) : null;
        
        // ============================================
        // 6. OBTENER DATOS DEL POST - Pago Móvil (Origen)
        // ============================================
        $origen_rif_tipo = isset($_POST['origen_rif_tipo']) && $_POST['origen_rif_tipo'] !== '' ? trim($_POST['origen_rif_tipo']) : null;
        $origen_rif_numero = isset($_POST['origen_rif_numero']) && $_POST['origen_rif_numero'] !== '' ? trim($_POST['origen_rif_numero']) : null;
        $origen_telefono = isset($_POST['origen_telefono']) && $_POST['origen_telefono'] !== '' ? trim($_POST['origen_telefono']) : null;
        $origen_banco = isset($_POST['origen_banco']) && $_POST['origen_banco'] !== '' ? trim($_POST['origen_banco']) : null;

        // ============================================
        // 7. VALIDACIONES - Campos Obligatorios
        // ============================================
        // Validar Forma de Pago
        if (empty($payment_method)) {
            $this->response([
                'success' => false, 
                'message' => 'Debe seleccionar una forma de pago.'
            ], 400);
            return;
        }
        
        // Validar Moneda
        if (empty($currency)) {
            $this->response([
                'success' => false, 
                'message' => 'Debe seleccionar una moneda.'
            ], 400);
            return;
        }
        
        // Validar Monto en Bolívares
        if (empty($amount_bs) || !is_numeric($amount_bs) || floatval($amount_bs) <= 0) {
            $this->response([
                'success' => false, 
                'message' => 'El monto en Bolívares es obligatorio y debe ser mayor a 0.'
            ], 400);
            return;
        }

        // ============================================
        // 8. GUARDAR EN BASE DE DATOS
        // ============================================
        $result = $repository->SavePayment(
            // Información General
            $serial_pos,
            $nro_ticket,
            $user_loader, 
            $payment_date, 
            // Información Bancaria
            $origen_bank, 
            $destination_bank, 
            // Método y Moneda
            $payment_method, 
            $currency, 
            // Montos y Referencias
            $reference_amount, 
            $amount_bs, 
            $payment_reference, 
            // Información Adicional
            $depositor, 
            $observations, 
            $record_number, 
            $loadpayment_date, 
            $confirmation_number, 
            $payment_status,
            // Pago Móvil - Destino
            $destino_rif_tipo,
            $destino_rif_numero,
            $destino_telefono,
            $destino_banco,
            // Pago Móvil - Origen
            $origen_rif_tipo,
            $origen_rif_numero,
            $origen_telefono,
            $origen_banco
        );

        // ============================================
        // 9. RESPUESTA AL CLIENTE
        // ============================================
        if ($result !== false) {
            $this->response([
                'success' => true, 
                'message' => 'Pago guardado correctamente en la tabla temporal (temp_payment_uploads).', 
                'id_payment_record' => $result,
                'serial_pos' => $serial_pos,
                'payment_method' => $payment_method,
                'table' => 'temp_payment_uploads'
            ], 200);
        } else {
            $this->response([
                'success' => false, 
                'message' => 'Error al guardar el pago en la tabla temporal.'
            ], 500);
        }
    }

    /**
     * Maneja la solicitud para guardar un presupuesto
     * 
     * @return void
     */
    public function handleSaveBudget(){
        $repository = new technicalConsultionRepository();
        
        // Obtener datos del POST
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : '';
        $monto_taller = isset($_POST['monto_taller']) ? (float)$_POST['monto_taller'] : 0;
        $diferencia_usd = isset($_POST['diferencia_usd']) ? (float)$_POST['diferencia_usd'] : 0;
        $diferencia_bs = isset($_POST['diferencia_bs']) ? (float)$_POST['diferencia_bs'] : 0;
        $descripcion_reparacion = isset($_POST['descripcion_reparacion']) ? trim($_POST['descripcion_reparacion']) : null;
        $fecha_presupuesto = isset($_POST['fecha_presupuesto']) ? trim($_POST['fecha_presupuesto']) : date('Y-m-d');
        $presupuesto_numero = isset($_POST['presupuesto_numero']) ? trim($_POST['presupuesto_numero']) : null;
        $user_creator = isset($_SESSION['id_user']) ? (int)$_SESSION['id_user'] : null;
        
        // Validaciones básicas
        if (empty($nro_ticket)) {
            $this->response([
                'success' => false,
                'message' => 'El número de ticket es requerido.'
            ], 400);
            return;
        }
        
        if ($monto_taller <= 0) {
            $this->response([
                'success' => false,
                'message' => 'El monto del taller debe ser mayor a cero.'
            ], 400);
            return;
        }
        
        // Guardar en base de datos
        $result = $repository->SaveBudget(
            $nro_ticket,
            $monto_taller,
            $diferencia_usd,
            $diferencia_bs,
            $descripcion_reparacion,
            $fecha_presupuesto,
            $presupuesto_numero,
            $user_creator
        );
        
        // Respuesta al cliente
        if ($result !== false) {
            $this->response([
                'success' => true,
                'message' => 'Presupuesto guardado correctamente.',
                'id_budget' => $result['id_budget'],
                'presupuesto_numero' => $result['presupuesto_numero'],
                'nro_ticket' => $nro_ticket
            ], 200);
        } else {
            $this->response([
                'success' => false,
                'message' => 'Error al guardar el presupuesto.'
            ], 500);
        }
    }

    /**
     * Maneja la carga del PDF del presupuesto
     */
    public function handleUploadPresupuestoPDF(){
        $repository = new technicalConsultionRepository();
        
        // Obtener datos del POST y FILES
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : '';
        $serial_pos = isset($_POST['serial_pos']) ? trim($_POST['serial_pos']) : '';
        $file = isset($_FILES['presupuesto_pdf_file']) ? $_FILES['presupuesto_pdf_file'] : null;
        $id_user = isset($_POST['id_user']) ? (int)$_POST['id_user'] : null;
        
        // Validaciones básicas
        if (empty($nro_ticket)) {
            $this->response(['success' => false, 'message' => 'Nro de ticket no proporcionado.'], 400);
            return;
        }
        
        if (empty($serial_pos)) {
            $this->response(['success' => false, 'message' => 'Serial del ticket no proporcionado.'], 400);
            return;
        }
        
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            $errorMessage = 'Error en la subida: ';
            if (!$file) {
                $errorMessage .= 'Archivo no proporcionado. ';
            } elseif ($file['error'] !== UPLOAD_ERR_OK) {
                $errorMessage .= 'Error de subida del archivo. Código de error: ' . $file['error'];
            }
            $this->response(['success' => false, 'message' => $errorMessage], 400);
            return;
        }
        
        // Validar que sea PDF
        $allowedTypes = ['application/pdf'];
        $fileType = $file['type'];
        if (!in_array($fileType, $allowedTypes)) {
            $this->response(['success' => false, 'message' => 'Solo se permiten archivos PDF.'], 400);
            return;
        }
        
        // Usar el serial_pos enviado desde el frontend
        $serial = $serial_pos;
        
        // Procesar información del archivo
        $originalFileName = basename($file['name']);
        $fileSize = $file['size'];
        
        // Configurar y crear la estructura de carpetas (igual que otros documentos)
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
        
        // Crear el subdirectorio para presupuesto
        $presupuestoDir = $ticketUploadDir . 'presupuesto' . DIRECTORY_SEPARATOR;
        if (!is_dir($presupuestoDir)) {
            if (!mkdir($presupuestoDir, 0755, true)) {
                $this->response(['success' => false, 'message' => 'No se pudo crear el subdirectorio para presupuesto: ' . $presupuestoDir], 500);
                return;
            }
        }
        
        // Generar nombre único para el archivo
        $info = pathinfo($originalFileName);
        $nombreSinExtension = $info['filename'];
        $extension = isset($info['extension']) ? '.' . $info['extension'] : '';
        $cleanNombreSinExtension = preg_replace("/[^a-zA-Z0-9_\-.]/", "_", $nombreSinExtension);
        $dateForFilename = date('Ymd_His');
        $uniqueFileName = 'presupuesto_' . $dateForFilename . '_' . uniqid() . '_' . $cleanNombreSinExtension . $extension;
        
        // Ruta completa donde se guardará el archivo
        $uploadPath = $presupuestoDir . $uniqueFileName;
        
        // Ruta relativa para la base de datos (usando UPLOAD_BASE_DIR)
        $filePathForDatabase = UPLOAD_BASE_DIR . $cleanSerial . '/' . $nro_ticket . '/presupuesto/' . $uniqueFileName;
        
        // Mover el archivo temporal al destino final
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            try {
                // Actualizar el presupuesto con la ruta del PDF usando nro_ticket
                // 1. Obtener id_ticket (MOVIDO ARRIBA)
                    $ticketDetails = $repository->getTicketDetailsByNroTicket($nro_ticket);
                    
                    $id_ticket_db = null;
                    if ($ticketDetails && isset($ticketDetails['id_ticket'])) {
                        $id_ticket_db = $ticketDetails['id_ticket'];
                    } elseif ($ticketDetails && isset($ticketDetails[0]) && isset($ticketDetails[0]['id_ticket'])) {
                         $id_ticket_db = $ticketDetails[0]['id_ticket'];
                    }

                    $resAdjunto = false;
                    if ($id_ticket_db) {
                        $fileInfo = [
                            'original_filename' => $originalFileName,
                            'stored_filename' => $uniqueFileName,
                            'file_path' => $filePathForDatabase,
                            'mime_type' => 'application/pdf',
                            'file_size_bytes' => $fileSize,
                            'document_type' => 'presupuesto'
                        ];

                        // GUARDAR SOLAMENTE EN ARCHIVOS_ADJUNTOS (Pedido por el usuario)
                        $resAdjunto = $repository->saveArchivoAdjunto($id_ticket_db, $nro_ticket, $id_user, $fileInfo);
                        if (!$resAdjunto) {
                             error_log("Error: No se pudo registrar el PDF en archivos_adjuntos. Ticket: $nro_ticket");
                        }
                    } else {
                         error_log("Error: No se pudo obtener id_ticket para guardar adjunto. Ticket: $nro_ticket");
                    }

                    if ($resAdjunto) {
                        $this->response([
                            'success' => true,
                            'message' => 'PDF del presupuesto subido y registrado exitosamente.',
                            'nro_ticket' => $nro_ticket,
                            'original_filename' => $originalFileName,
                            'stored_filename' => $uniqueFileName,
                            'file_path' => $filePathForDatabase,
                            'file_size_bytes' => $fileSize
                        ], 200);
                    } else {
                        // Si no se pudo guardar en archivos_adjuntos, consideramos que falló y borramos el archivo
                        unlink($uploadPath);
                        $this->response(['success' => false, 'message' => 'El archivo se subió, pero hubo un error al registrarlo en la base de datos (archivos_adjuntos).'], 500);
                    }
            } catch (\Exception $e) {
                unlink($uploadPath);
                $this->response(['success' => false, 'message' => 'Error interno al guardar el PDF: ' . $e->getMessage()], 500);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Error al mover el archivo subido. Verifique los permisos de escritura en la carpeta de destino.'], 500);
        }
    }

    /**
     * Obtiene el id_budget de un presupuesto por nro_ticket
     */
    public function handleGetBudgetIdByNroTicket(){
        $repository = new technicalConsultionRepository();
        
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : '';
        
        if (empty($nro_ticket)) {
            $this->response(['success' => false, 'message' => 'Nro de ticket no proporcionado.'], 400);
            return;
        }
        
        $id_budget = $repository->GetBudgetIdByNroTicket($nro_ticket);
        
        if ($id_budget) {
            $this->response(['success' => true, 'id_budget' => $id_budget], 200);
            $this->response(['success' => false, 'message' => 'No se encontró un presupuesto para este ticket.'], 404);
        }
    }


    public function handleglobalSearchTicket(){
        $repository = new technicalConsultionRepository();
        $nro_ticket = isset($_POST['nro_ticket']) ? trim($_POST['nro_ticket']) : '';

        if (empty($nro_ticket)) {
            $this->response(['success' => false, 'message' => 'Nro de ticket no proporcionado.'], 400);
            return;
        }
            
        $result = $repository->GetTicketByNro($nro_ticket);

        if ($result) {
            // Ensure $result is an array suitable for JSON encoding
            // Assuming GetTicketByNro returns a resource or unexpected format, process it here.
            // Assuming GetTicketByNro returns an associated array or list of tickets.
            $this->response(['success' => true, 'ticket' => $result]);
        } else {
            $this->response(['success' => false, 'message' => 'No se encontraron tickets']);
        }
      
    }


    public function handleGetPaymentByRecordNumber() {
        $repository = new technicalConsultionRepository();
        $record_number = isset($_POST['record_number']) ? $_POST['record_number'] : '';
        
        if (empty($record_number)) {
            $this->response(['success' => false, 'message' => 'Nro de registro no proporcionado'], 400);
            return;
        }

        $payment = $repository->GetPaymentByRecordNumber($record_number);
        
        if ($payment) {
            $this->response(['success' => true, 'payment' => $payment], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Pago no encontrado'], 404);
        }
    }

    public function handleGetPaymentAttachmentByRecordNumber() {
        $repository = new technicalConsultionRepository();
        $record_number = isset($_POST['record_number']) ? $_POST['record_number'] : '';
        
        if (empty($record_number)) {
            $this->response(['success' => false, 'message' => 'Nro de registro no proporcionado'], 400);
            return;
        }

        $attachment = $repository->GetPaymentAttachmentByRecordNumber($record_number);
        
        if ($attachment) {
            $this->response(['success' => true, 'attachment' => $attachment], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Documento no encontrado para este pago'], 404);
        }
    }

    public function handleGetPaymentById() {
        $repository = new technicalConsultionRepository();
        $id_payment = isset($_POST['id_payment']) ? $_POST['id_payment'] : '';
        
        if (empty($id_payment)) {
            $this->response(['success' => false, 'message' => 'ID de pago no proporcionado'], 400);
            return;
        }

        $payment = $repository->GetPaymentById($id_payment);
        
        if ($payment) {
            $this->response(['success' => true, 'payment' => $payment], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Pago no encontrado por ID'], 404);
        }
    }

    public function handleUpdatePayment() {
        $repository = new technicalConsultionRepository();
        $id_payment = isset($_POST['id_payment']) ? $_POST['id_payment'] : '';
        
        if (empty($id_payment)) {
            $this->response(['success' => false, 'message' => 'ID de pago no proporcionado'], 400);
            return;
        }

        // Collect fields to update from POST
        $data = [];
        $possibleFields = [
            'amount_bs', 
            'reference_amount', 
            'payment_method', 
            'currency', 
            'payment_reference', 
            'depositor', 
            'origen_bank', 
            'destination_bank',
            'origen_rif_numero',
            'origen_telefono',
            'record_number',
            'payment_status',
            'confirmation_number'
        ];

        foreach ($possibleFields as $field) {
            if (isset($_POST[$field])) {
                $data[$field] = $_POST[$field];
            }
        }

        if (empty($data)) {
            $this->response(['success' => false, 'message' => 'No se enviaron datos para actualizar'], 400);
            return;
        }

        // Add Audit info
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $data['updated_by'] = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;

        $success = $repository->UpdatePayment($id_payment, $data);
        
        if ($success) {
            $this->response(['success' => true, 'message' => 'Pago actualizado correctamente'], 200);
        } else {
            // This might fail if payment is confirmed or ID is wrong
            $this->response(['success' => false, 'message' => 'No se pudo actualizar el pago. Verifique que no esté confirmado.'], 400);
        }
    }

    public function handleSubstitutePayment() {
        $repository = new technicalConsultionRepository();
        $id_payment_old = isset($_POST['id_payment']) ? $_POST['id_payment'] : '';
        
        if (empty($id_payment_old)) {
            $this->response(['success' => false, 'message' => 'ID de pago original no proporcionado'], 400);
            return;
        }

        // Collect fields for the NEW record from POST
        $data = [];
        $possibleFields = [
            'amount_bs', 
            'reference_amount', 
            'payment_method', 
            'currency', 
            'payment_reference', 
            'depositor', 
            'origen_bank', 
            'destination_bank',
            'record_number',
            'payment_status',
            'confirmation_number',
            'payment_date',
            'document_type'
        ];

        foreach ($possibleFields as $field) {
            if (isset($_POST[$field])) {
                $data[$field] = $_POST[$field];
            }
        }

        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $data['user_loader'] = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;

        // Perform substitution (Insert new record based on old one + new data)
        $new_id = $repository->CreatePaymentSubstitution($id_payment_old, $data);
        
        if ($new_id) {
            $this->response(['success' => true, 'message' => 'Nuevo registro de pago creado', 'id_payment_record' => $new_id], 200);
        } else {
            $this->response(['success' => false, 'message' => 'No se pudo crear la sustitución del pago.'], 500);
        }
    }

    private function handleUploadPaymentDoc()
    {
        error_log("handleUploadPaymentDoc CALLED");
        // Validar que se recibieron archivos
        if (!isset($_FILES['payment_doc']) || $_FILES['payment_doc']['error'] !== UPLOAD_ERR_OK) {
             $this->response(['success' => false, 'message' => 'No se ha subido ningún archivo o hubo un error.'], 400);
             return;
        }

        // Validar parámetros necesarios
        $nro_ticket = isset($_POST['nro_ticket']) ? $_POST['nro_ticket'] : null;
        $record_number = isset($_POST['record_number']) ? $_POST['record_number'] : null;
        $user_loader = isset($_POST['user_loader']) ? $_POST['user_loader'] : 0;

        if (!$nro_ticket || !$record_number) {
            $this->response(['success' => false, 'message' => 'Faltan datos requeridos (nro_ticket o record_number).'], 400);
            return;
        }

        $file = $_FILES['payment_doc'];
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        if (!in_array($file['type'], $allowedMimeTypes)) {
             $this->response(['success' => false, 'message' => 'Formato de archivo no permitido. Solo JPG, PNG o PDF.'], 400);
             return;
        } 
        
        if ($file['size'] > $maxSize) {
             $this->response(['success' => false, 'message' => 'El archivo excede el tamaño permitido de 5MB.'], 400);
             return;
        }

        // 1. Instanciar repositorio
        $repository = new technicalConsultionRepository();

        // 2. Obtener datos del ticket y serial para construir la ruta
        // Primero intentamos buscar el pago por record_number para asegurar que tenemos el nro_ticket correcto
        $paymentInfo = $repository->GetPaymentByRecordNumber($record_number);
        
        $ticketInfo = null;
        if ($paymentInfo && isset($paymentInfo['nro_ticket'])) {
            $nro_ticket = $paymentInfo['nro_ticket']; // Usar el nro_ticket del pago si existe
        }

        // Si tenemos nro_ticket (ya sea del POST o del pago), buscamos info del ticket
        if ($nro_ticket) {
            $ticketResults = $repository->GetTicketByNro($nro_ticket);
            // GetTicketByNro retorna un array de arrays, tomamos el primero
            if (is_array($ticketResults) && isset($ticketResults[0])) {
                $ticketInfo = $ticketResults[0];
            } else {
                $ticketInfo = $ticketResults;
            }
        }

        // Definir directorio base
        $baseUploadDir = defined('UPLOAD_BASE_DIR') ? UPLOAD_BASE_DIR : __DIR__ . '/../../../../public/documentos/';
        
        $folderName = 'Pagos';
        $documentType = isset($_POST['document_type']) && !empty($_POST['document_type']) ? $_POST['document_type'] : null;

        if ($ticketInfo && isset($ticketInfo['serial_pos'])) {
             // Si el documentType NO viene del POST, lo determinamos inteligentemente
             if (!$documentType) {
                 // Verificar si ya existe un Anticipo VALIDO (NO RECHAZADO)
                 $validAnticipo = $repository->getNonRejectedDocumentByType($ticketInfo['nro_ticket'], 'Anticipo');
                 
                 // Si NO existe un anticipo válido, este debe ser el Anticipo (o su sustitución)
                 if (!$validAnticipo) {
                     $documentType = 'Anticipo';
                 } else {
                     $documentType = 'Pago';
                 }
             }
             
             // Establecer la carpeta basada en el documentType final
             $folderName = ($documentType === 'Anticipo' || $documentType === 'anticipo') ? 'Anticipo' : 'Pagos';
             
             $serial = preg_replace("/[^a-zA-Z0-9_-]/", "_", $ticketInfo['serial_pos']);
             $ticketFolder = preg_replace("/[^a-zA-Z0-9]/", "", $nro_ticket); 
             
             // Estructura Solicitada: C:\Documentos_SoportePost\SERIAL\NRO_TICKET\Carpeta\
             $uploadDir = $baseUploadDir . $serial . DIRECTORY_SEPARATOR . $ticketFolder . DIRECTORY_SEPARATOR . $folderName . DIRECTORY_SEPARATOR;
        } else {
             // Fallback
             $uploadDir = $baseUploadDir . 'PagosGenerales' . DIRECTORY_SEPARATOR;
        }

        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                $this->response(['success' => false, 'message' => 'Error interno al crear directorio de subida: ' . $uploadDir], 500);
                return;
            }
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        // Formato solicitado: record_number_fecha.extension
        // Ejemplo: Pago1234_5678_20260123_223800.jpg
        $fechaHora = date('Ymd_His');
        // Si es anticipo, podemos mantener el prefijo Anticipo o Pago, el usuario pidió record_number_fecha
        // La variable $record_number ya trae "Pago..."
        $filename = $record_number . '_' . $fechaHora . '.' . $ext;
        $targetPath = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $fileInfo = [
                'original_filename' => $file['name'],
                'stored_filename' => $filename,
                'file_path' => $targetPath,
                'mime_type' => $file['type'],
                'file_size_bytes' => $file['size'],
                'document_type' => $documentType, // Dinamico: Anticipo o Pago
                'record_number' => $record_number
            ];

            // 3. Guardar en BD
            // $repository ya está instanciado arriba
            // Llamar al método genérico saveArchivoAdjunto que ya maneja record_number
            $result = $repository->saveArchivoAdjunto(
                0, // ticket_id placeholder
                $nro_ticket,
                $user_loader,
                $fileInfo
            );

            if (isset($result['error'])) {
                $this->response(['success' => false, 'message' => $result['error']], 500);
            } else {
                $this->response(['success' => true, 'message' => 'Documento de pago guardado correctamente.'], 200);
            }

        } else {
            $this->response(['success' => false, 'message' => 'Error al mover el archivo al servidor.'], 500);
        }
    }
}
?>
