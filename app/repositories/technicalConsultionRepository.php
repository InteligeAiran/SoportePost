<?php namespace App\Repositories; // Usar namespaces para organizar tus clases
require_once __DIR__. '/../models/consulta_rifModel.php'; // Asegúrate de que el modelo de usuario esté incluido
use consulta_rifModel; // Asegúrate de que tu modelo de usuario exista
use \DateTime;
use Exception;
session_start(); // Inicia la sesión
class TechnicalConsultionRepository
{
    private $model;
    private $app_base_path;

    public function __construct(){
        $this->model = new consulta_rifModel(); // Instancia tu modelo de usuario

         // Inicializa la ruta base de la aplicación (ajusta según tu estructura)
        $this->app_base_path = '/SoportePost/'; // O la ruta base real de tu app, por ejemplo: '/SoportePost/'
        // ... instancia tus repositorios y servicios si los usas aquí
    }

    public function SearchRif($rif){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchRif($rif);
        if ($result) {
            //var_dump($result);  
            $rif = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $rif[] = $agente;
                //var_dump($agente);
            }
            return $rif;
        } else {
            return null;
        }
    }

    public function SearchSerialData($serial){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchSerialData($serial);
        if ($result) {
            //var_dump($result);  
            $serialData = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $serialData[] = $agente;
                //var_dump($agente);
            }
             return $serialData;
        } else {
            return null;
        }
    }

   public function GetTicketByNro($nro_ticket, $idusers = null, $tipousers = null){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketByNro($nro_ticket, $idusers, $tipousers);
        if ($result) {
            //var_dump($result);  
            $ticketData = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticketData[] = $agente;
                //var_dump($agente);
            }
             return $ticketData;
        } else {
            return null;
        }
    }

    public function SearchRazonData($razonsocial){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchRazonData($razonsocial);
        if ($result) {
            //var_dump($result);  
            $razon = [];

             for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $serialData[] = $agente;
                //var_dump($agente);
            }
             return $serialData;
        } else {
            return null;
        }
    }

    public function SearchSerial($serial){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchSerial($serial);
        if ($result) {
            //var_dump($result);  
            $serial = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $serial[] = $agente;
                //var_dump($agente);
            }
            return $serial;
        } else {
            return null;
        }
    }

    public function SearchtypePos($serial){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchtypePos($serial);
        return $result ? $result['row']['codmodelopos'] : null;
    }

    public function GetTotalTickets($fecha_para_db){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTotalTickets($fecha_para_db);
        return $result['get_tickets_total_count'];
    }

    public function VerifingClient($rif){
        $result = $this->model->VerifingClient($rif);
        if ($result && is_array($result) && isset($result['row']) && is_array($result['row']) && isset($result['row']['rif'])) {
            return $result['row']['rif'];
        } else {
            return null; // Devuelve null si no se encuentra el RIF o la estructura es incorrecta
        }
    }

    public function SaveDataFalla($serial, $falla, $nivelFalla, $id_user, $rif, $Nr_ticket, $descripcion_falla)
    {
        // Llama al método SaveDataFalla del modelo.
        // Este método ahora devolverá el array con 'idTicketCreado' y 'status_info'.
        $result_from_model = $this->model->SaveDataFalla($serial, $falla, $nivelFalla,  $id_user, $rif, $Nr_ticket, $descripcion_falla);
        return $result_from_model;
    }

    public function getTicketStatusInfo($id_ticket)
    {
        // Esto ya estaba bien, llama al método del modelo que obtiene el estado.
        $result = $this->model->getStatusTicket($id_ticket); 
        return $result; // Esto devolverá ['id_status_ticket' => X, 'name_status_ticket' => Y] o null
    }

    public function GetPosSerialsByRif($rif){
        $result = $this->model->GetPosSerialsByRif($rif);
        if ($result) {
            //var_dump($result);  
            $serial = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $serial[] = $agente;
                //var_dump($agente);
            }
            return $serial;
        } else {
            return null;
        }
    }

    public function UltimateDateTicket($serial){
        $result = $this->model->UltimateDateTicket($serial);
        // Verifica si $result es un array y si contiene la clave 'row'
        if ($result && is_array($result) && isset($result['row'])) {
            return [
                'fecha' => $result['row']['ult_ticket_formateado'] ?? null,
                'nro_ticket' => $result['row']['nro_ticket'] ?? null
            ];
        } else {
            return null; // Devuelve null si no hay resultados o la estructura es incorrecta
        }
    }

    public function InstallDatePOS($serial){
        $result = $this->model->InstallDatePOS($serial);
        // Verifica si $result es un array y si contiene la clave 'row'
        if ($result && is_array($result) && isset($result['row']) && is_array($result['row']) && isset($result['row']['inst_ticket'])) {
            return $result['row']['inst_ticket'];
        } else {
            return null; // Devuelve null si no hay resultados o la estructura es incorrecta
        }
    }

    public function getCoordinacion(){
        $result = $this->model->getCoordinacion();
    
        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $coordi[] = $agente;
            //var_dump($agente);
        }
        return $coordi;
    }

     public function GetCoordinator(){
        $result = $this->model->GetCoordinator();
    
        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $coordi[] = $agente;
            //var_dump($agente);
        }
        return $coordi;
    }


    public function GetFailure2(){
        $result = $this->model->GetFailure2();

        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $failures[] = $agente;
            //var_dump($agente);
        }
        return $failures;
    }

    public function GetFailure1(){
        $result = $this->model->GetFailure1();

        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $failures[] = $agente;
            //var_dump($agente);
        }
        return $failures;
    }

    
    public function SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $id_status_payment, $id_user, $rif, $Nr_ticket){
        try {
            // El modelo SaveDataFalla2 ahora devuelve un array con 'success', 'id_ticket_creado', y 'status_info'.
            $result = $this->model->SaveDataFalla2(
                $serial,
                $descripcion,
                $nivelFalla,
                $coordinador,
                $id_status_payment,
                $id_user,
                $rif,
                $Nr_ticket
            );
            
            // CORRECCIÓN: Asegurar que se retorne el ID real de la BD
            if (isset($result['success']) && $result['success']) {
                // Si el modelo no retorna id_ticket_db, usar el que viene del modelo
                if (!isset($result['id_ticket_db'])) {
                    $result['id_ticket_db'] = $result['id_ticket_creado'] ?? null;
                }
            }
            return $result;
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    // Nueva función para guardar archivos adjuntos
    public function saveArchivoAdjunto($ticket_id, $Nr_ticket, $uploaded_by_user_id, array $fileInfo) {
        $record_number = isset($fileInfo['record_number']) ? $fileInfo['record_number'] : null;
        
        return $this->model->saveArchivoAdjunto(
            $ticket_id,
            $Nr_ticket, // Pasamos Nr_ticket para que se pueda guardar si es necesario en la DB
            $uploaded_by_user_id,
            $fileInfo['original_filename'],
            $fileInfo['stored_filename'],
            $fileInfo['file_path'],
            $fileInfo['mime_type'],
            $fileInfo['file_size_bytes'],
            $fileInfo['document_type'],
            $record_number
        );
    }

    public function GetTicketData($id_user){
        $result = $this->model->GetTicketData($id_user);
        if ($result) {
            //var_dump($result);  
            $ticket = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            //var_dump($agente);
            return $ticket;
        } else {
            return null;
        }
    }

    public function GetTicketData1($id_user){
        $result = $this->model->GetTicketData1($id_user);
        if ($result) {
            //var_dump($result);  
            $ticket = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            //var_dump($agente);
            return $ticket;
        } else {
            return null;
        }
    }

    public function getTecnico2(){
        $result = $this->model->GetTecnico2();

        if ($result && $result['numRows'] > 0) {
            $tecnicos = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $tecnicos[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result($result['query']);
            return $tecnicos;
        } else {
            return [];
        } 
    }

    public function AssignTicket($id_ticket, $id_tecnico){
        $result = $this->model->UpdateAccion($id_ticket, $id_tecnico); // ¡Ahora el orden es correcto!
        return $result;
    }

    public function SendToTaller($id_ticket){
        $result = $this->model->SendToTaller($id_ticket); // ¡Ahora el orden es correcto!
        return $result;
    }

    public function GetTicketDataLab($id_user){
        $result = $this->model->GetTicketDataLab($id_user);
        if ($result) {
            //var_dump($result);  
            $ticket = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            //var_dump($agente);
            return $ticket;
        } else {
            return null;
        }
    }

    public function GetSatusTaller(){
        $result = $this->model->GetSatusTaller();
        if ($result) {
            //var_dump($result);  
            $estatus = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $estatus[] = $agente;
            }
            //var_dump($agente);
            return $estatus;
        } else {
            return null;
        }
    }

    public function UpdateTicketStatus($id_new_status, $id_ticket, $id_user){
        $result = $this->model->UpdateTicketStatus($id_new_status,$id_ticket, $id_user);
        return $result;
    }

    public function UpdateKeyReceiveDate($id_ticket, $id_user){
        $result = $this->model->UpdateKeyReceiveDate($id_ticket, $id_user);
        return $result;
    }

    public function GetStatusDomiciliacion(){
        $result = $this->model->GetStatusDomiciliacion();
        if ($result) {
            //var_dump($result);  
            $estatus = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $estatus[] = $agente;
            }
            //var_dump($agente);
            return $estatus;
        } else {
            return null;
        }
    }

    public function UpdateDomiciliacionStatus($id_new_status, $id_ticket, $id_user, $observation){
        $result = $this->model->UpdateStatusDomiciliacion($id_new_status,$id_ticket, $id_user, $observation);
        return $result;
    }

    public function getLastUserTicketInfo($id_user){
        $result = $this->model->GetLastUserTicketInfo($id_user);
        // Si Model::getResult devuelve un array con 'num_rows' => 0 o simplemente null/false
        if ($result && isset($result['num_rows']) && $result['num_rows'] > 0 && isset($result['row'])) {
            // Asegúrate de que las claves existan
            if (isset($result['row']['date_create_ticket']) && isset($result['row']['rif'])) {
                return [
                    'date_create_ticket' => new DateTime($result['row']['date_create_ticket']),
                    'rif_last_ticket' => $result['row']['rif']
                ];
            }
        }
        return null; // Si no hay resultados válidos, devuelve null
    }

    public function GetModules(){
        $result = $this->model->GetModules();
        if ($result) {
            //var_dump($result);  
            $modules = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $modules[] = $agente;
            }
            //var_dump($agente);
            return $modules;
        } else {
            return null;
        }
    }

         private function getUrlForMenuItem($itemName) {
        $normalizedName = strtolower(trim($itemName));
        $url_segment = '#'; // Segmento de URL por defecto si no se encuentra coincidencia

        switch ($normalizedName) {
            // -- Rutas para submódulos --
            case "crear ticket":
                $url_segment = 'crear_ticket';
                break;
            case "gestión coordinador":
                $url_segment = 'asignar_tecnico'; // Usé el de tu HTML inicial
                break;
            case "gestión técnicos":
                $url_segment = 'tecnico'; // Usé el de tu HTML inicial
                break;
            case "gestión taller":
                $url_segment = 'taller'; // Usé el de tu HTML inicial
                break;
            case "pendiente por entregar":
                $url_segment = 'pendiente_entrega'; // Usé el de tu HTML inicial
                break;
            case "consultas general":
                $url_segment = 'consultas_general'; // Si esta URL es una página principal para sub-submódulos
                break;
            case "verificación de solvencia":
                $url_segment = 'domiciliacion'; // Usé el de tu HTML inicial
                break;
            case "gestión usuario":
                $url_segment = 'gestionusers'; // Usé el de tu HTML inicial
                break;
            case "gestión comercial":
                $url_segment = 'gestion_comercial'; // Usé el de tu HTML inicial
                break;
            case "cerrar sesión":
                $url_segment = 'cerrar_session'; // Usé el de tu HTML inicial
                break;

            // Asegúrate que estos nombres coincidan con los de tu DB
            case "sustitución de pos":
                $url_segment = 'soporte_pos'; // O la URL específica para este tipo de ticket
                break;
            case "préstamo de pos":
                $url_segment = 'prestamo_pos'; // Ajusta si es diferente
                break;
            case "desafiliación de pos":
                $url_segment = 'desafiliacion_pos'; // Ajusta si es diferente
                break;
            case "migración de bancos":
                $url_segment = 'migracion_bancos'; // Ajusta si es diferente
                break;
            case "cambio de razón social":
                $url_segment = 'cambio_razon_social'; // Ajusta si es diferente
                break;
            case "consulta de rif":
                $url_segment = 'consulta_rif'; // Usé el de tu HTML inicial
                break;
            case "consulta tickets":
                $url_segment = 'consulta_ticket'; // Usé el de tu HTML inicial
                break;
            // Añade más casos aquí si tienes otros nombres que se mapeen a URLs específicas
        }
        return $this->app_base_path . $url_segment; // Concatena la ruta base de la aplicación
    }

     public function GetSubmodulesForModulee($moduleId,$id_usuario) {
        $final_submodules_data = []; // Array que contendrá la estructura final con URLs y anidamiento

        // 1. Obtener los submódulos principales del modelo
        $submodules_result = $this->model->GetSubmodulesForModule($moduleId,$id_usuario);

        if ($submodules_result && $submodules_result['numRows'] > 0) {
            for ($i = 0; $i < $submodules_result['numRows']; $i++) {
                $submodule_row = pg_fetch_assoc($submodules_result['query'], $i);

                // Genera la URL para el submódulo
                $submodule_url = $this->getUrlForMenuItem($submodule_row['desc_submodulo']);
                var_dump($submodule_url);
                $current_submodule = [
                    'id_submodulo' => $submodule_row['id_submodulo'],
                    'desc_submodulo' => $submodule_row['desc_submodulo'],
                    'url_sub_module' => $submodule_url, // URL generada
                    'subsub_modules' => [] // CRÍTICO: Inicializamos un array vacío para los sub-submódulos
                ];

                // 2. Obtener los sub-submódulos para este submódulo
                // Asume que tu modelo tiene un método para esto
                // $subsubmodules_result = $this->model->GetSubSubmodulesForSubmodule($submodule_row['id_submodule']);

                // if ($subsubmodules_result && $subsubmodules_result['numRows'] > 0) {
                //     for ($j = 0; $j < $subsubmodules_result['numRows']; $j++) {
                //         $subsubmodule_row = pg_fetch_assoc($subsubmodules_result['query'], $j);

                //         // Genera la URL para el sub-submódulo
                //         $subsubmodule_url = $this->getUrlForMenuItem($subsubmodule_row['name_subsubmodule']);

                //         $current_submodule['subsub_modules'][] = [
                //             'id_subsub_module' => $subsubmodule_row['id_subsubmodule'],
                //             'name_subsub_module' => $subsubmodule_row['name_subsubmodule'],
                //             'url_subsub_module' => $subsubmodule_url // URL generada
                //         ];
                //     }
                // }

                $final_submodules_data[] = $current_submodule;
            }
            return $final_submodules_data;
        } else {
            return []; // Retorna un array vacío si no hay submódulos
        }
    }


    public function GetSubmodulesForModule($moduleId,$id_usuario) {
        $result = $this->model->GetSubmodulesForModule($moduleId,$id_usuario);

        if ($result) {
            $modules = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $modules[] = $agente;
            }
            return $modules;
        } else {
            return null;
        }
    }

    public function GetTicketCounts(){
        $result = $this->model->getTicketCountsGroupedByAction();
        if ($result) {
            return $result;
        } else {
            return null;
        }
    }

    public function GetModulesUsers($id_usuario){
        $result = $this->model->GetModulesUsers($id_usuario);
        if ($result) {
            //var_dump($result);  
            $modules = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $modules[] = $agente;
            }
            //var_dump($agente);
            return $modules;
        } else {
            return null;
        }
    }

    public function getTicketAttachmentsDetails($id_ticket){
        $result = $this->model->GetAttachments($id_ticket);
        
        if ($result) {
            $attachments = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $attachment = pg_fetch_assoc($result['query'], $i);
                $attachments[] = $attachment;
            }
            return $attachments;
        } else {
            return null;
        }
    }

    public function UpdateTicketAction($ticketId, $id_user, $comment){
        $result = $this->model->UpdateTicketAction($ticketId, $id_user, $comment);
        return $result;
    }

    public function UpdateStatusToReceiveInTaller($ticketId, $id_user){
        $result = $this->model->UpdateStatusToReceiveInTaller($ticketId, $id_user);
        return $result;
    }

    public function UpdateRepuestoDate($id_ticket, $repuestoDate, $id_user, $id_status_lab){
        $result = $this->model->UpdateRepuestoDate($id_ticket, $repuestoDate, $id_user, $id_status_lab);
        return $result;
    }

    public function GetOverdueRepuestoTickets(){
        $result = $this->model->GetOverdueRepuestoTickets();

        if($result){
            $tickets = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $ticket = pg_fetch_assoc($result['query'], $i);
                $tickets[] = $ticket;
            }
            return $tickets;
        }else{
            return null;
        }
    }

    public function UpdateRepuestoDate2($ticketId, $repuesto_date, $id_user){
        $result = $this->model->UpdateRepuestoDate2($ticketId, $repuesto_date, $id_user);
        return $result;
    }

    public function SendToComercial($id_ticket, $id_user){
        $result = $this->model->SendToComercial($id_ticket, $id_user);
        return $result;
    }

    public function SendToGestionRosal($id_ticket, $id_user, $keyCharged){
        $result = $this->model->SendToGestionRosal($id_ticket, $id_user, $keyCharged);
        return $result;
    }

    public function MarkKeyAsReceived($id_ticket, $id_user){
        $result = $this->model->MarkKeyAsReceived($id_ticket, $id_user);
        return $result;
    }

    public function GetImageToAproval($ticket_id, $image_type) {
        // El modelo ya debería devolver un solo array asociativo (o null/false)
        $result = $this->model->GetImageToAproval($ticket_id, $image_type);

        // var_dump($result); // Descomenta esto para ver qué devuelve tu modelo directamente

        if ($result === false) { // Si el modelo devolvió false (error de consulta)
            return ['success' => false, 'message' => 'Error interno al consultar la imagen en la base de datos.'];
        } elseif ($result === null || !isset($result['file_path']) || !isset($result['mime_type'])) {
            // Si el modelo devolvió null (no se encontró) o le faltan campos
            return ['success' => false, 'message' => 'No se encontró la imagen o los datos son inválidos para el ticket y tipo especificados.'];
        } else {
            // Si el modelo devolvió un array con file_path y mime_type
            return [
                'success' => true,
                'file_path' => $result['file_path'],
                'mime_type' => $result['mime_type']
            ];
        }
    }

     public function VerifingBranches($rif){
        $result = $this->model->VerifingBranches($rif); // Llama al modelo
        if ($result && $result['numRows'] > 0 && isset($result['row']['id_estado'])) {
            return $result['row']['id_estado']; // Devuelve solo el id_estado
        }
        return null; // Si no se encuentra o hay un error
    }

    // Este método solo devuelve el ID de la región asociado al estado
    public function getRegionFromStateId($id_state) {
        $result = $this->model->GetRegionFromState($id_state);

        // AÑADE ESTO PARA DEPURACIÓN:
        error_log("Resultado de Model::GetRegionFromState en Repository:");
        error_log(var_export($result, true));

        if ($result && $result['numRows'] > 0 && isset($result['row']['id_region'])) {
            return (int) $result['row']['id_region']; // Devuelve solo el id_region
        }
        return null; // Si no se encuentra o hay un error
    }

    public function EntregarTicket($id_ticket, $id_user, $comment){
        $result = $this->model->EntregarTicket($id_ticket, $id_user, $comment);
        return $result;
    }

    public function GetTicketDataForDelivery($ticketId){
        $result = $this->model->GetTicketDataForDelivery($ticketId);
        if ($result) {

             $ticket = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $ticket = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $ticket;
            }
            return $ticket;
        } else {
            return null;
        }
    }

    public function getStatusPayment($id_ticket){
        $result = $this->model->getStatusTicketPayment($id_ticket);
        return $result;
    }

    public function EntregarTicketDevolucion($id_ticket, $id_user){
        $result = $this->model->EntregarTicketDevolucion($id_ticket, $id_user);
        return $result;
    }

    public function UpdateStatusToReceiveInRosal($ticketId, $id_user){
        $result = $this->model->UpdateStatusToReceiveInRosal($ticketId, $id_user);
        return $result;
    }

    public function GetRegionsByTechnician($id_user){
        $result = $this->model->GetRegionsByTechnician($id_user);
        if ($result) {
            $regions = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $region = pg_fetch_assoc($result['query'], $i);
                $regions[] = $region;
            }
            return $regions;
        } else {
            return null;
        }
    }

    public function UpdateStatusToReceiveInRegion($ticketId, $id_user){
        $result = $this->model->UpdateStatusToReceiveInRegion($ticketId, $id_user);
        return $result;
    }

    public function GetComponents($ticketId){
        $result = $this->model->GetComponents($ticketId);
        if ($result) {
            $components = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $component = pg_fetch_assoc($result['query'], $i);
                $components[] = $component;
            }
            return $components;
        } else {
            return null;
        }
    }
    
    public function SendToRegion($ticketId, $id_user, $component, $serial, $modulo){
        $result = $this->model->SendToRegion($ticketId, $id_user, $component, $serial, $modulo);
        return $result;
    }

    public function SendToRegionWithoutComponent($ticketId, $id_user){
        $result = $this->model->SendToRegionWithoutComponent($ticketId, $id_user);
        return $result;
    }
    
    public function CheckTicketEnProceso($serial){
        $result = $this->model->CheckTicketEnProceso($serial);
        return $result;
    }

    public function HasComponents($ticketId){
        // El modelo devuelve la lista completa de componentes con el flag is_selected.
        $result = $this->model->HasComponents($ticketId);

        if ($result) {
            $components = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $component = pg_fetch_assoc($result['query'], $i);
                $components[] = $component;
            }
            return $components;
        } else {
            return false;
        }
    }

    public function getDocumentByType($ticketId, $documentType) {
        return $this->model->getDocumentByType($ticketId, $documentType);
    }

    public function getMotivoRechazoDocumento($ticketId, $nroTicket, $documentType) {
        return $this->model->getMotivoRechazoDocumento($ticketId, $nroTicket, $documentType);
    }

    public function GetMotivos($documentId) {
        $result = $this->model->GetMotivos($documentId);

        if ($result) {
            $motivos = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $motivo = pg_fetch_assoc($result['query'], $i);
                $motivos[] = $motivo;
            }
            return $motivos;
        } else {
            return false;
        }
    }

    public function RechazarDocumentos($id_ticket, $id_motivo, $nro_ticket, $id_user, $document_type){
        $result = $this->model->RechazarDocumentos($id_ticket, $id_motivo, $nro_ticket, $id_user, $document_type);
        return $result;
    }

    public function AprobarDocumento($id_ticket, $nro_ticket, $id_user, $document_type, $nro_payment_reference_verified = '', $payment_date_verified = ''){
        $result = $this->model->AprobarDocumento($id_ticket, $nro_ticket, $id_user, $document_type, $nro_payment_reference_verified, $payment_date_verified);
        return $result;
    }

    public function GetEstatusTicket(){
        $result = $this->model->GetEstatusTicket();

        if ($result) {
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $tipousers[] = $agente;
                //var_dump($agente);
            }
            return $tipousers;
        }
    }

    public function GetRegionTicket($id_user){
        $result = $this->model->GetRegionTicket($id_user);
    
       if ($result) {
            //var_dump($result);  
            $ticket = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            //var_dump($agente);
            return $ticket;
        } else {
            return null;
        }
    }

    public function SendBackToTaller($id_ticket, $id_user){
        $result = $this->model->SendBackToTaller($id_ticket, $id_user);
        return $result;
    }

    public function GetSimpleFailure($id_ticket){
        $result = $this->model->GetSimpleFailure($id_ticket);

        if ($result) {
            $failure = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $failure[] = $agente;
                //var_dump($agente);
            }
            return $failure;
        }
        return false;
    }

    public function ClosedTicket($id_ticket, $id_user){
        $result = $this->model->ClosedTicket($id_ticket, $id_user);
        return $result;  
    }

    public function GetTicketReentry_lab($id_ticket){
        $result = $this->model->GetTicketReentry_lab($id_ticket);

        if ($result) {
            $reentries = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $reentries[] = $agente;
                //var_dump($agente);
            }
            return $reentries;
        }
        return false;
    }

    public function GetTicketDataGestionComercial($id_user){
        $result = $this->model->GetTicketDataGestionComercial($id_user);
        if ($result) {
            //var_dump($result);  
            $ticket = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            //var_dump($agente);
            return $ticket;
        } else {
            return null;
        }
    }
    public function GetBancoTicket(){
        $result = $this->model->GetBancoTicket();
    
        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $tipousers[] = $agente;
            //var_dump($agente);
        }
        return $tipousers;
    }

    // Nueva: obtener bancos/cuentas de la tabla Accounts_banks
    public function GetAccountsBanks(){
        $result = $this->model->GetAccountsBanks();
        if ($result && isset($result['numRows']) && $result['numRows'] > 0) {
            $banks = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $row = pg_fetch_assoc($result['query'], $i);
                $banks[] = $row;
            }
            return $banks;
        }
        return null;
    }

    public function GetTicketDataComponent(){
        $result = $this->model->GetTicketDataComponent();
        if ($result) {
            //var_dump($result);  
            $ticket = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            //var_dump($agente);
            return $ticket;
        } else {
            return null;
        }
    }

    public function GetComponentsBySerial($id_ticket, $serial){
        $result = $this->model->GetComponentsBySerial($id_ticket, $serial);
        if ($result) {
            $ticket = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            return $ticket;
        } else {
            return null;
        }
    }

    public function GetAllComponentsPOS(){
        $result = $this->model->GetAllComponentsPOS();
        if ($result) {
            $ticket = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            return $ticket;
        } else {
            return null;
        }
    }

    public function GetPaymentMethods(){
        $result = $this->model->GetPaymentMethods();
        if ($result && isset($result['numRows']) && $result['numRows'] > 0) {
            $paymentMethods = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $paymentMethods[] = $agente;
            }
            return $paymentMethods;
        } else {
            return null;
        }
    }

    public function GetExchangeRate(){
        $result = $this->model->GetExchangeRate();
        if ($result && isset($result['numRows']) && $result['numRows'] > 0) {
            $exchangeRate = pg_fetch_assoc($result['query'], 0);
            pg_free_result($result['query']);
            return $exchangeRate;
        } else {
            if ($result && isset($result['query'])) {
                pg_free_result($result['query']);
            }
            return null;
        }
    }

    public function GetExchangeRateToday(){
        $result = $this->model->GetExchangeRateToday();
        if ($result && isset($result['numRows']) && $result['numRows'] > 0) {
            $exchangeRate = pg_fetch_assoc($result['query'], 0);
            
            // Debug: Log para ver qué se está retornando
            error_log("GetExchangeRateToday - Datos obtenidos: " . print_r($exchangeRate, true));
            error_log("GetExchangeRateToday - Claves del array: " . print_r(array_keys($exchangeRate), true));
            
            pg_free_result($result['query']);
            return $exchangeRate;
        } else {
            error_log("GetExchangeRateToday - No se encontraron resultados. numRows: " . (isset($result['numRows']) ? $result['numRows'] : 'no definido'));
            if ($result && isset($result['query'])) {
                pg_free_result($result['query']);
            }
            return null;
        }
    }

    public function GetExchangeRateByDate($fecha){
        $result = $this->model->GetExchangeRateByDate($fecha);
        
        // Debug: Log para ver qué se está retornando
        error_log("GetExchangeRateByDate - Fecha recibida: " . $fecha);
        error_log("GetExchangeRateByDate - Result: " . print_r($result, true));
        
        if ($result && isset($result['numRows']) && $result['numRows'] > 0) {
            $exchangeRate = pg_fetch_assoc($result['query'], 0);
            
            // Debug: Log para ver qué se está retornando
            error_log("GetExchangeRateByDate - Datos obtenidos: " . print_r($exchangeRate, true));
            error_log("GetExchangeRateByDate - Claves del array: " . print_r(array_keys($exchangeRate), true));
            
            pg_free_result($result['query']);
            return $exchangeRate;
        } else {
            error_log("GetExchangeRateByDate - No se encontraron resultados. numRows: " . (isset($result['numRows']) ? $result['numRows'] : 'no definido'));
            if ($result && isset($result['query'])) {
                pg_free_result($result['query']);
            }
            return null;
        }
    }

    public function GetBancos(){
        $result = $this->model->GetBancos();
        if ($result && isset($result['numRows']) && $result['numRows'] > 0) {
            $bancos = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $banco = pg_fetch_assoc($result['query'], $i);
                $bancos[] = $banco;
            }
            pg_free_result($result['query']);
            return $bancos;
        } else {
            if ($result && isset($result['query'])) {
                pg_free_result($result['query']);
            }
            return [];
        }
    }

    public function GetPaymentData($nro_ticket){
        $result = $this->model->GetPaymentData($nro_ticket);
        if ($result && isset($result['numRows']) && $result['numRows'] > 0) {
            $payment_data = pg_fetch_assoc($result['query'], 0);
            pg_free_result($result['query']);
            return $payment_data;
        } else {
            if ($result && isset($result['query'])) {
                pg_free_result($result['query']);
            }
            return null;
        }
    }

    public function GetPresupuestoData($nro_ticket){
        $result = $this->model->GetPresupuestoData($nro_ticket);
        if ($result && isset($result['numRows']) && $result['numRows'] > 0) {
            $cliente_data = pg_fetch_assoc($result['query'], 0);
            pg_free_result($result['query']);
            return $cliente_data;
        } else {
            if ($result && isset($result['query'])) {
                pg_free_result($result['query']);
            }
            return null;
        }
    }

    public function SaveBudget($nro_ticket, $monto_taller, $diferencia_usd, $diferencia_bs, $descripcion_reparacion, $fecha_presupuesto, $presupuesto_numero, $user_creator){
        return $this->model->SaveBudget($nro_ticket, $monto_taller, $diferencia_usd, $diferencia_bs, $descripcion_reparacion, $fecha_presupuesto, $presupuesto_numero, $user_creator);
    }
    
    public function UpdateVerifiedPaymentData($nro_ticket, $nro_payment_reference_verified, $payment_date_verified){
        return $this->model->UpdateVerifiedPaymentData($nro_ticket, $nro_payment_reference_verified, $payment_date_verified);
    }
    
    public function UpdatePresupuestoPDFPath($id_budget, $pdf_path){
        return $this->model->UpdatePresupuestoPDFPath($id_budget, $pdf_path);
    }
    
    public function UpdatePresupuestoPDFPathByNroTicket($nro_ticket, $pdf_path){
        return $this->model->UpdatePresupuestoPDFPathByNroTicket($nro_ticket, $pdf_path);
    }
    
    public function getTicketDetailsByNroTicket($nro_ticket){
        return $this->model->GetTicketDetailsByNroTicket($nro_ticket);
    }
    
    public function GetBudgetIdByNroTicket($nro_ticket){
        return $this->model->GetBudgetIdByNroTicket($nro_ticket);
    }

    public function GetEstatusPago(){
        $result = $this->model->GetEstatusPago();
        if ($result) {
            //var_dump($result);  
            $estatus = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $estatus[] = $agente;
            }
            //var_dump($agente);
            return $estatus;
        } else {
            return null;
        }
    }

    public function GetPaymentStatusByTicket($nro_ticket){
        $result = $this->model->GetPaymentStatusByTicket($nro_ticket);
        if ($result) {
            //var_dump($result);  
            $status = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $status[] = $agente;
            }
            //var_dump($agente);
            return $status;
        } else {
            return null;
        }
    }

    public function GetEstatusPagoAutomatizado($nro_ticket = null){
        $result = $this->model->GetPaymentStatusByTicket($nro_ticket);
        if ($result) {
            $status = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $status[] = $agente;
            }
            return $status;
        } else {
            return null;
        }
    }

    public function GetPaymentsByTicket($nro_ticket){
        $result = $this->model->GetPaymentsByTicket($nro_ticket);
        if ($result) {
            $payments = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $payment = pg_fetch_assoc($result['query'], $i);
                $payments[] = $payment;
            }
            return $payments;
        } else {
            return null;
        }
    }

    public function GetTotalPaidByTicket($nro_ticket){
        return $this->model->GetTotalPaidByTicket($nro_ticket);
    }

    public function InsertPaymentRecord($data){
        return $this->model->InsertPaymentRecord($data);
    }

    /**
     * Guarda un pago en la tabla temporal temp_payment_uploads
     * 
     * @param string $serial_pos Serial del POS
     * @param int|null $user_loader ID del usuario que carga el pago
     * @param string|null $payment_date Fecha del pago
     * @param string|null $origen_bank Banco de origen
     * @param string|null $destination_bank Banco de destino
     * @param string $payment_method MÃ©todo de pago
     * @param string $currency Moneda (BS o USD)
     * @param float|null $reference_amount Monto de referencia
     * @param float $amount_bs Monto en BolÃ­vares
     * @param string|null $payment_reference Referencia del pago
     * @param string|null $depositor Depositante
     * @param string|null $observations Observaciones
     * @param string|null $record_number NÃºmero de registro
     * @param string $loadpayment_date Fecha de carga del pago
     * @param bool $confirmation_number NÃºmero de confirmaciÃ³n
     * @param int $payment_status Estado del pago
     * @param string|null $destino_rif_tipo Tipo de RIF del destino (Pago MÃ³vil)
     * @param string|null $destino_rif_numero NÃºmero de RIF del destino (Pago MÃ³vil)
     * @param string|null $destino_telefono TelÃ©fono del destino (Pago MÃ³vil)
     * @param string|null $destino_banco Banco del destino (Pago MÃ³vil)
     * @param string|null $origen_rif_tipo Tipo de RIF del origen (Pago MÃ³vil)
     * @param string|null $origen_rif_numero NÃºmero de RIF del origen (Pago MÃ³vil)
     * @param string|null $origen_telefono TelÃ©fono del origen (Pago MÃ³vil)
     * @param string|null $origen_banco Banco del origen (Pago MÃ³vil)
     * @return int|false ID del registro guardado o false en caso de error
     */
    public function SavePayment(
        $serial_pos,
        $nro_ticket = null,
        $user_loader, 
        $payment_date, 
        $origen_bank, 
        $destination_bank, 
        $payment_method, 
        $currency, 
        $reference_amount, 
        $amount_bs, 
        $payment_reference, 
        $depositor, 
        $observations, 
        $record_number, 
        $loadpayment_date, 
        $confirmation_number, 
        $payment_status, 
        $destino_rif_tipo = null, 
        $destino_rif_numero = null, 
        $destino_telefono = null, 
        $destino_banco = null, 
        $origen_rif_tipo = null, 
        $origen_rif_numero = null, 
        $origen_telefono = null, 
        $origen_banco = null
    ){
        $result = $this->model->SavePayment(
            $serial_pos,
            $nro_ticket,
            $user_loader, 
            $payment_date, 
            $origen_bank, 
            $destination_bank, 
            $payment_method, 
            $currency, 
            $reference_amount, 
            $amount_bs, 
            $payment_reference, 
            $depositor, 
            $observations, 
            $record_number, 
            $loadpayment_date, 
            $confirmation_number, 
            $payment_status, 
            $destino_rif_tipo, 
            $destino_rif_numero, 
            $destino_telefono, 
            $destino_banco, 
            $origen_rif_tipo, 
            $origen_rif_numero, 
            $origen_telefono, 
            $origen_banco
        );
        
        return $result;
    }

    /**
     * Transfiere el pago de la tabla temporal a la tabla principal cuando se crea el ticket
     * 
     * @param string $serial_pos Serial del POS
     * @param string $nro_ticket NÃºmero del ticket creado
     * @return bool|int ID del registro insertado en payment_records o false en caso de error
     */
    public function TransferPaymentFromTempToMain($serial_pos, $nro_ticket) {
        return $this->model->TransferPaymentFromTempToMain($serial_pos, $nro_ticket);
    }

    public function CheckPaymentExistsToday($serial_pos) {
        return $this->model->CheckPaymentExistsToday($serial_pos);
    }

    public function GetPaymentById($id_payment) {
        return $this->model->GetPaymentById($id_payment);
    }

    public function GetPaymentByRecordNumber($record_number) {
        return $this->model->GetPaymentByRecordNumber($record_number);
    }

    public function UpdatePayment($id_payment, $data) {
        return $this->model->UpdatePayment($id_payment, $data);
    }

    /**
     * Get payment attachment by record number
     * 
     * @param string $record_number Payment record number
     * @return array|null Attachment info or null if not found
     */
    public function GetPaymentAttachment($record_number) {
        return $this->model->GetPaymentAttachmentByRecordNumber($record_number);
    }
}
?>
