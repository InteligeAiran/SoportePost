<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases

require_once __DIR__ . '/../models/reportsModel.php'; // Asegúrate de que el modelo de usuario esté incluido
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

    public function getTicketabiertoCount()
    {
        // Lógica para obtener la cantidad de usuarios
        $result = $this->model->getTicketabiertoCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_open_tickets'];
    }

    public function getTicketsResueltosCount()
    {
        // Lógica para obtener la cantidad de usuarios
        $result = $this->model->getTicketsResueltosCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['total_tickets_resuelto'];
    }

    public function getTicketsTotalCount()
    {
        // Lógica para obtener la cantidad de usuarios
        $result = $this->model->getTicketsTotalCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_tickets'];
    }

    public function getTicketPercentageData()
    {
        $result = $this->model->getTicketCountsForPercentage();
        return $result['row']['get_percentage_open_tickets'];
    }

    public function getTicketsResueltosPercentageData()
    {
        $result = $this->model->getTicketsResueltosCountsForPercentage();
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
        $id_ticket,
        $filePathForDatabase,    // La ruta relativa que se guarda en la DB
        $mimeTypeFromFrontend,   // El tipo MIME
        $originalDocumentName,   // Nombre original del archivo
        $documentSize            // La ruta relativa que se guarda en la DB para acceder al archivo
    ) {
        $result = $this->model->saveDocument($id_ticket, $originalDocumentName, $documentSize, $mimeTypeFromFrontend, $filePathForDatabase);
        return $result;
    }

    public function getDocument($id_ticket)
    {
        $result = $this->model->getDocument($id_ticket);
        return $result;
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

    public function GetTicketsSendTallerTotalCount(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketsSendTallerTotalCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_tickets_lab'];
    }

    public function GetTotalTicketsPercentageSendToTaller(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTotalTicketsPercentageSendToTaller(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_percentage_tickets_in_lab_of_total'];
    }

    public function GetTicketOpenDetails(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketOpenDetails(); // Asumiendo que tienes este método en tu modelo
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

    public function GetResolveTicketsForCard(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetResolveTicketsForCard(); // Asumiendo que tienes este método en tu modelo
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

    public function GetTallerTicketsForCard(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTallerTicketsForCard(); // Asumiendo que tienes este método en tu modelo
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

    public function handleGetTicketsPendienteReparacion(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->handleGetTicketsPendienteReparacion(); // Asumiendo que tienes este método en tu modelo
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

    public function GetTotalTicketsInProcess(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTotalTicketsInProcess(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_total_in_processtickets'];
    }

    public function GetTotalTicketsPercentageInProcess(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTotalTicketsPercentageInProcess(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['get_percentage_in_process_tickets'];
    }
    
    
}