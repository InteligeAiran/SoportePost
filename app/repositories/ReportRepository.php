<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases

require_once __DIR__ . '/../models/reportsModel.php'; // Asegúrate de que el modelo de usuario esté incluido

use PDO;
use reportsModel; // Asegúrate de que tu modelo de usuario exista

class ReportRepository
{
    private $model;

    public function __construct()
    {
        $this->model = new reportsModel(); // Instancia tu modelo de usuario
    }

    public function GetAllDataTicket($id_region)
    {
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsByRegion($id_region); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result($result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function SearchRif($rif)
    {
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsByRif($rif); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result($result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function SearchSerial($serial)
    {
        $result = $this->model->SearchSerial($serial);
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result($result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function getDomiciliacionTickets($id_user)
    {
        $result = $this->model->GetDomiciliacionTickets($id_user);
        if ($result) {
            //var_dump($result);  
            $tickets = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $tickets[] = $agente;
            }
            //var_dump($agente);
            return $tickets;
        } else {
            return null;
        }
    }

    public function SearchRangeData($ini_date, $end_date)
    {
        $result = $this->model->SearchRangeData($ini_date, $end_date);

        if ($result) {
            //var_dump($result);  
            $tickets = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $tickets[] = $agente;
            }
            //var_dump($agente);
            return $tickets;
        } else {
            return null;
        }
    }

    public function getTicketabiertoCount($id_rol, $id_user)
    {
        // Lógica para obtener la cantidad de usuarios
        $result = $this->model->getTicketabiertoCount($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_open_tickets'];
    }

    public function getTicketsResueltosCount($id_rol, $id_user)
    {
        // Lógica para obtener la cantidad de usuarios
        $result = $this->model->getTicketsResueltosCount($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_resolve_tickets'];
    }

    public function getTicketsTotalCount($id_region, $id_user)
    {
        // Lógica para obtener la cantidad de usuarios
        $result = $this->model->getTicketsTotalCount($id_region, $id_user); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_tickets'];
    }

    public function getTicketPercentageData($id_rol, $id_user)
    {
        $result = $this->model->getTicketCountsForPercentage($id_rol, $id_user);
        return $result['row']['get_percentage_open_tickets'];
    }

    public function getTicketsResueltosPercentageData($id_rol, $id_user)
    {
        $result = $this->model->getTicketsResueltosCountsForPercentage($id_rol, $id_user);
        return $result['row']['get_percentage_resolved_tickets'];
    }

    public function getTicketDataFinal()
    {
        $result = $this->model->GetDataTicketFinal();

        if ($result) {
            //var_dump($result);  
            $tickets = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $tickets[] = $agente;
            }
            return $tickets;
        } else {
            return null;
        }
    }

    public function saveDocument(
            $nro_ticket,
            $originalDocumentName,
            $stored_filename,
            $filePathForDatabase,
            $mimeTypeFromFrontend,
            $documentSize,
            $id_user,
            $document_type,
            $id_ticket
        ) {
        // Pasar los parámetros al modelo en el mismo orden
        $result = $this->model->saveDocument(
            $nro_ticket,
            $originalDocumentName,
            $stored_filename,
            $filePathForDatabase,
            $mimeTypeFromFrontend,
            $documentSize,
            $id_user,
            $document_type,
            $id_ticket
        );
        return $result;
    }

    public function saveDocument1($nro_ticket,
            $originalDocumentName,
            $stored_filename,
            $filePathForDatabase,
            $mimeTypeFromFrontend,
            $documentSize,
            $id_user,
            $document_type,
            $id_ticket) {
        // Pasar los parámetros al modelo en el mismo orden
        $result = $this->model->saveDocument1(
            $nro_ticket,
            $originalDocumentName,
            $stored_filename,
            $filePathForDatabase,
            $mimeTypeFromFrontend,
            $documentSize,
            $id_user,
            $document_type,
            $id_ticket
        );
        return $result;
    }

    public function saveDocument2($nro_ticket,
            $originalDocumentName,
            $stored_filename,
            $filePathForDatabase,
            $mimeTypeFromFrontend,
            $documentSize,
            $id_user,
            $document_type,
            $id_ticket) {
        // Pasar los parámetros al modelo en el mismo orden
        $result = $this->model->saveDocument2(
            $nro_ticket,
            $originalDocumentName,
            $stored_filename,
            $filePathForDatabase,
            $mimeTypeFromFrontend,
            $documentSize,
            $id_user,
            $document_type,
            $id_ticket
        );
        return $result;
    }

    public function getDocument($id_ticket, $document_type)
    {
        $result = $this->model->getDocument($id_ticket, $document_type);
        if ($result) {
            //var_dump($result);  
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

    public function getTicketDetailsById($id_ticket){
        $result = $this->model->GetTicketDetailsById($id_ticket);
        if ($result) {
            //var_dump($result);  
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

    public function GetMonthlyTicketDetails(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetMonthlyTicketDetails(); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetIndividualTicketDetails($month, $status){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetIndividualTicketDetails($month, $status); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetMonthlyCreatedTicketsForChart(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetMonthlyCreatedTicketsForChart(); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetMonthlyCreatedTicketsForChartForState(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetMonthlyCreatedTicketsForChartForState(); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetRegionsTicketDetails(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetRegionsTicketDetails(); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetMonthlyTicketPercentageChange(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetMonthlyTicketPercentageChange(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['average_monthly_percentage_change'];
    }

    public function GetIndividualTicketDetailsByRegion($id_region){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetIndividualTicketDetailsByRegion($id_region); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketsSendTallerTotalCount($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsSendTallerTotalCount($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_tickets_lab'];
    }

    public function GetTotalTicketsPercentageSendToTaller($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTotalTicketsPercentageSendToTaller($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_percentage_tickets_in_lab_of_total'];
    }

    public function GetTicketOpenDetails($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketOpenDetails($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetResolveTicketsForCard($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetResolveTicketsForCard($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTallerTicketsForCard($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTallerTicketsForCard($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketsPendienteReparacion(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsPendienteReparacion(); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketsProcessReparacionCount(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsProcessReparacionCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_proceso_reparacion'];
    }

    public function GetTicketsReparadosCount(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsReparadosCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_reparados'];
    }

    public function handleGetTicketsReparado(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->handleGetTicketsReparado(); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketsPendientesPorRepuestos(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsPendientesPorRepuestos(); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketPendienteRepuestoCount(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketPendienteRepuestoCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_pendiente_repuesto'];
    }

    public function GetTicketIrreparablesCount(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketIrreparablesCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_irreparable'];
    }

    public function GetTicketsIrreparables(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsIrreparables(); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTotalTicketsInProcess($id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTotalTicketsInProcess($id_user); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_in_processtickets'];
    }

    public function GetTotalTicketsPercentageInProcess($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTotalTicketsPercentageInProcess($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_percentage_in_process_tickets'];
    }
    
    public function GetTicketsInProcess($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsInProcess($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketTimeline($id_ticket){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketTimeline($id_ticket); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketsPendingDocumentApproval($id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsPendingDocumentApproval($id_user); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketDataRegion($id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketDataRegion($id_user); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function SaveComponents($id_ticket, $componentes_array, $serial_pos, $id_user, $modulo){
        // Lógica para guardar los componentes del ticket
        $result = $this->model->SaveComponents($id_ticket, $componentes_array, $serial_pos, $id_user, $modulo);
        return $result;
    }

    public function GetDataEstatusTicket($estatus){
        // Lógica para obtener los estados del ticket
        $result = $this->model->GetDataEstatusTicket($estatus);
         if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketsGestionComercialPorcent($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsGestionComercialPorcent($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_percentage_gestion_comercial_tickets'];
    }

    public function getTicketagestioncomercialCount($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->getTicketagestioncomercialCount($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        return $result['row']['getticketagestioncomercialcount'];
    }

    public function handlegetTicketEntregadoCliente(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->handlegetTicketEntregadoCliente(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_entregado_cliente'];
    }

    public function GetDetalleTicketComercial($id_rol, $id_user){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetDetalleTicketComercial($id_rol, $id_user); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }   

    public function SearchBanco($banco)
    {
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchBanco($banco); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    }

    public function GetTicketCounts(){
        // Lógica para obtener conteos de tickets por módulo
        $result = $this->model->GetTicketCounts();
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
        } else {
            return [];
        }
    } 

    public function EntregadoClienteDetails(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->EntregadoClienteDetails(); // Asumiendo que tienes este método en tu modelo
        if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            pg_free_result($result['query']);
            return $rows;
        } else {
            return [];
        }
    }
}