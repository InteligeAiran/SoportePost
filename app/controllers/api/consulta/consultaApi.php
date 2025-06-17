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
        //var_dump($serial);
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
        $rif = isset($_POST['rif']) ? $_POST['rif'] : ''; // RIF del nuevo ticket que se intenta crear
        $serial = isset($_POST['serial']) ? $_POST['serial'] : '';
        $falla_id = isset($_POST['falla']) ? $_POST['falla'] : '';
        $nivelFalla_id = isset($_POST['nivelFalla']) ? $_POST['nivelFalla'] : '';
        $falla_text = isset($_POST['falla_text']) ? $_POST['falla_text'] : '';
        $nivelFalla_text = isset($_POST['nivelFalla_text']) ? $_POST['nivelFalla_text'] : '';

        $repository = new technicalConsultionRepository();

        // --- LÓGICA DE VALIDACIÓN DE TIEMPO ---
        $lastTicketInfo = $repository->getLastUserTicketInfo($id_user); // Usamos tu nuevo método aquí

        if ($lastTicketInfo) {
            $lastTicketDateTime = $lastTicketInfo['date_create_ticket']; // Ya es un objeto DateTime
            $lastTicketRif = $lastTicketInfo['rif_last_ticket']; // El RIF del último ticket
            $currentDateTime = new DateTime(); // Fecha y hora actual (ej: 2025-06-11 11:47:02 AM)

            // Ajusta la zona horaria si es necesario. Si tu DB guarda en UTC, puedes hacer:
            // $currentDateTime->setTimezone(new DateTimeZone('UTC'));

            $interval = $currentDateTime->diff($lastTicketDateTime);
            // Calcula los minutos totales
            $minutesPassed = $interval->i + ($interval->h * 60) + ($interval->days * 24 * 60);

            // Define los límites de tiempo en minutos
            $tiempoLimiteMismoCliente = 10; // 10 minutos
            $tiempoLimiteDiferenteCliente = 5; // 5 minutos

            if ($rif === $lastTicketRif) {
                // Es la misma institución (mismo RIF)
                if ($minutesPassed < $tiempoLimiteMismoCliente) {
                    $this->response([
                        'success' => false,
                        'message' => "Debes esperar " . ($tiempoLimiteMismoCliente - $minutesPassed) . " minutos para crear otro ticket para el misma cliente (RIF: $rif)."
                    ], 429);
                    return;
                }
            } else {
                // Es para un cliente diferente
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


        // Si la validación pasa o no hay tickets anteriores, continuamos con la creación
        if ($serial != '' && $falla_id != '' && $nivelFalla_id != '' && $id_user != '' && $rif != '') {
            $hoy = date('dmy');
            $fecha_para_db = date('Y-m-d');
            $resultado = $repository->GetTotalTickets($fecha_para_db);
            $totaltickets = $resultado + 1;
            $paddedTicketNumber = sprintf("%04d", $totaltickets);
            $Nr_ticket = $hoy . $paddedTicketNumber;

            $result = $repository->SaveDataFalla($serial, $falla_id, $nivelFalla_id, $id_user, $rif, $Nr_ticket);

            if ($result) {
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
                        'user_gestion' => $_SESSION['nombres'] . ' ' . $_SESSION['apellidos']
                    ]
                ], 200);
            } else {
                $this->response(['success' => false, 'message' => 'Error al guardar los datos de falla.'], 500);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Hay un campo vacio.'], 400);
        }
    }

    // ... (Use statements y demás código inicial de tu clase/archivo) ..
    // ... tus propiedades y métodos existentes ...

   public function handleSaveFalla2()
    {
        // error_log("handleSaveFalla2: INICIO DE LA PETICIÓN.");

        // Recoger y sanear los datos de entrada
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $rif = isset($_POST['rif']) ? $_POST['rif'] : '';
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

            $tiempoLimiteMismoCliente = 1; // 10 minutos para el mismo cliente
            $tiempoLimiteDiferenteCliente = 1;  // 5 minutos para un cliente diferente

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

        // ** Paso 1: Guardar el ticket principal para obtener el ID **
        $result = $repository->SaveDataFalla2(
            $serial,
            $falla_id,
            $nivelFalla_id,
            $coordinador,
            $id_status_payment,
            $id_user,
            $rif,
            $Nr_ticket
        );

        if (isset($result['success']) && $result['success']) {
            $idTicketCreado = $result['id_ticket_creado']; // ID del ticket recién creado (entero, ej. 164)

            // 6. Configurar y Crear la Estructura de Carpetas de Archivos
            // Sanitizar el serial para el nombre de la carpeta
            // Esto es crucial para evitar problemas con nombres de carpeta inválidos en el sistema de archivos.
            // Permite letras (mayúsculas/minúsculas), números, guiones y guiones bajos. Otros caracteres se reemplazan por '_'.
            $cleanSerial = preg_replace("/[^a-zA-Z0-9_-]/", "_", $serial);

            // Definir la ruta base para la subida de archivos (obtenida de config.php)
            $baseUploadDir = UPLOAD_BASE_DIR; // Viene de tu config.php

            // Nivel 1: Carpeta principal por SERIAL
            // Ejemplo: C:\uploads_tickets\J566767676\
            $serialUploadDir = $baseUploadDir . $cleanSerial . DIRECTORY_SEPARATOR;
            
            // Nivel 2: Carpeta por ID_TICKET (dentro de la carpeta del Serial)
            // Ejemplo: C:\uploads_tickets\J566767676\164\
            $ticketUploadDir = $serialUploadDir . $idTicketCreado . DIRECTORY_SEPARATOR;

            // Crear los directorios recursivamente si no existen
            // Se usa 'true' para mkdir para que cree directorios anidados si no existen.
            // Permisos 0755: Lectura/escritura/ejecución para el propietario, lectura/ejecución para grupo y otros.
            
            // Crear el directorio base (ej. C:\uploads_tickets\)
            if (!is_dir($baseUploadDir)) {
                if (!mkdir($baseUploadDir, 0755, true)) {
                    error_log("Error al crear el directorio base: " . $baseUploadDir);
                    $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (base).'], 500);
                    return;
                }
            }
            // Crear el directorio del Serial (ej. C:\uploads_tickets\J566767676\)
            // Esta es la carpeta que agrupará todos los tickets de un mismo serial.
            if (!is_dir($serialUploadDir)) {
                if (!mkdir($serialUploadDir, 0755, true)) {
                    error_log("Error al crear el directorio del serial: " . $serialUploadDir);
                    $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (serial).'], 500);
                    return;
                }
            }
            // Crear el directorio del ID_TICKET (ej. C:\uploads_tickets\J566767676\164\)
            // Esta carpeta se creará para CADA NUEVO TICKET, dentro de la carpeta del Serial.
            if (!is_dir($ticketUploadDir)) {
                if (!mkdir($ticketUploadDir, 0755, true)) {
                    error_log("Error al crear el directorio del ticket: " . $ticketUploadDir);
                    $this->response(['success' => false, 'message' => 'Error interno del servidor al preparar el almacenamiento de archivos (ticket).'], 500);
                    return;
                }
            }


            // 7. Función auxiliar para procesar archivos subidos
            // Esta función maneja la creación de subcarpetas por tipo de documento y el guardado de archivos.
            // Parámetros:
            //   $fileKey:       La clave en $_FILES (ej. 'archivoEnvio')
            //   $documentType:  El tipo de documento (ej. 'Envio', 'Exoneracion')
            //   $ticketId:      El ID del ticket (para guardar en DB)
            //   $nrTicket:      El número de ticket (para guardar en DB)
            //   $userId:        El ID del usuario que sube (para guardar en DB)
            //   $repo:          Instancia del repositorio (para guardar en DB)
            //   $baseTicketDir: La ruta base de la carpeta del ticket (ej. C:\uploads_tickets\SERIAL\ID_TICKET\)
            //   $dateForFilename: String de fecha/hora para incluir en el nombre del archivo (ej. 20250617_123000)
            //   &$targetVar:    Variable por referencia para almacenar la info del archivo subido (para la respuesta)
            $processFile = function($fileKey, $documentType, $ticketId, $nrTicket, $userId, $repo, $baseTicketDir, $dateForFilename, &$targetVar) {
                // Verificar si el archivo fue subido y no hubo errores
                if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
                    $archivo = $_FILES[$fileKey];
                    $nombreArchivoOriginal = basename($archivo['name']); // Obtiene solo el nombre del archivo

                    // Separar el nombre base del archivo de su extensión
                    $info = pathinfo($nombreArchivoOriginal);
                    $nombreSinExtension = $info['filename'];
                    $extension = isset($info['extension']) ? '.' . $info['extension'] : '';

                    // Limpiar el nombre original (solo la parte antes de la extensión)
                    // Elimina caracteres que no sean alfanuméricos, guiones, guiones bajos o puntos.
                    $cleanNombreSinExtension = preg_replace("/[^a-zA-Z0-9_\-.]/", "", $nombreSinExtension);

                    // Construir el nombre del archivo a almacenar en el servidor
                    // Formato: TIPO_DOCUMENTO_FECHA_HORA_IDUNICO_NOMBRE_ORIGINAL_LIMPIO.EXT
                    // uniqid() se añade para prevenir colisiones de nombres si se suben varios archivos
                    // con el mismo nombre original en el mismo segundo o por diferentes usuarios.
                    $nombreArchivoAlmacenado = $documentType . '_' . $dateForFilename . '_' . uniqid() . '_' . $cleanNombreSinExtension . $extension;


                    // Nivel 3: Carpeta para el tipo de documento (dentro de la carpeta del Ticket)
                    // Ejemplo: C:\uploads_tickets\J566767676\164\Exoneracion\
                    $documentTypeDir = $baseTicketDir . $documentType . DIRECTORY_SEPARATOR;
                    if (!is_dir($documentTypeDir)) {
                        if (!mkdir($documentTypeDir, 0755, true)) {
                            error_log("Error al crear el directorio del tipo de documento: " . $documentTypeDir);
                            return false; // Indicar que la creación de la carpeta falló
                        }
                    }

                    $rutaArchivoCompleta = $documentTypeDir . $nombreArchivoAlmacenado;
                    
                    // Obtener el tipo MIME del archivo subido para validación y seguridad
                    $mimeType = mime_content_type($archivo['tmp_name']);

                    // Mover el archivo de la ubicación temporal a la ubicación final
                    if (move_uploaded_file($archivo['tmp_name'], $rutaArchivoCompleta)) {
                        // Almacenar la información del archivo subido en la variable de referencia
                        $targetVar = [
                            'original_filename' => $nombreArchivoOriginal,
                            'stored_filename' => $nombreArchivoAlmacenado,
                            'file_path' => $rutaArchivoCompleta, // La ruta completa en el servidor
                            'mime_type' => $mimeType,
                            'file_size_bytes' => $archivo['size'],
                            'document_type' => $documentType
                        ];
                        // Guardar la información del archivo adjunto en la base de datos
                        // Se asume que $repo->saveArchivoAdjunto existe y funciona correctamente.
                        $repo->saveArchivoAdjunto($ticketId, $nrTicket, $userId, $targetVar);
                        return true; // Archivo movido y datos guardados exitosamente
                    } else {
                        // Registrar errores si el movimiento del archivo falla
                        error_log("Error al mover el archivo de {$documentType}: " . $rutaArchivoCompleta . " | Código de error: " . $archivo['error'] . " | PHP temp path: " . $archivo['tmp_name']);
                        return false; // Fallo al mover el archivo
                    }
                }
                // Si el archivo no fue subido (ej. campo vacío) o hubo un error UPLOAD_ERR_NO_FILE,
                // se considera que el proceso del archivo específico "terminó OK" si no era requerido.
                // Si fuera requerido, la validación de $_FILES tendría que ir antes de llamar a processFile.
                return true; 
            };

                        $fecha_para_nombre_archivo = date('Ymd_His'); // <--- ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ PRESENTE Y CORRECTA

            // 8. Procesar cada tipo de archivo adjunto (Envio, Exoneracion, Anticipo)
            // Se pasa $fecha_para_nombre_archivo como el penúltimo argumento.
            $envioOk = $processFile('archivoEnvio', 'Envio', $idTicketCreado, $Nr_ticket, $id_user, $repository, $ticketUploadDir, $fecha_para_nombre_archivo, $archivoEnvioInfo);
            $exoneracionOk = $processFile('archivoExoneracion', 'Exoneracion', $idTicketCreado, $Nr_ticket, $id_user, $repository, $ticketUploadDir, $fecha_para_nombre_archivo, $archivoExoneracionInfo);
            $anticipoOk = $processFile('archivoAnticipo', 'Anticipo', $idTicketCreado, $Nr_ticket, $id_user, $repository, $ticketUploadDir, $fecha_para_nombre_archivo, $archivoAnticipoInfo);

            // Opcional: Puedes añadir una lógica aquí para verificar si alguna subida falló
            // y responder con un mensaje más específico o realizar acciones de limpieza/rollback.
            if (!$envioOk || !$exoneracionOk || !$anticipoOk) {
                error_log("Advertencia: Al menos un archivo adjunto no se pudo guardar correctamente para el ticket " . $idTicketCreado);
                // Si esto es un error crítico, podrías responder con un error 500 aquí
                // $this->response(['success' => false, 'message' => 'El ticket fue creado, pero algunos archivos adjuntos fallaron al subir.'], 500);
            }

            // 9. Responder al cliente con éxito
            // Se asume que $_SESSION['nombres'] y $_SESSION['apellidos'] existen.
            $this->response([
                'success' => true,
                'message' => 'Datos guardados con éxito. El ticket de nivel 2 ha sido creado.',
                'ticket_data' => [
                    'Nr_ticket' => $Nr_ticket,
                    'serial' => $serial,
                    'falla_text' => $falla_text,
                    'nivelFalla_text' => $nivelFalla_text,
                    'rif' => $rif,
                    'user_gestion' => $_SESSION['nombres'] . ' ' . $_SESSION['apellidos'], 
                    'coordinador' => $coordinador_nombre
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
        $id_module = isset($_POST['id_module']) ? $_POST['id_module'] : '';
        $repository = new technicalConsultionRepository(); // Inicializa el repositorio

        if ($id_module != '') {
            $result = $repository->GetSubmodulesForModule($id_module); // Llama a la función del repositorio
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
    
    private function response($data, $status = 200)
    {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit();
    }

}
?>