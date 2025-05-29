<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases
require_once __DIR__. '/../models/reportsModel.php'; // Asegúrate de que el modelo de usuario esté incluido
use reportsModel; // Asegúrate de que tu modelo de usuario exista
class ReportRepository
{
    private $model;

    public function __construct(){
        $this->model = new reportsModel(); // Instancia tu modelo de usuario
    }

    public function GetAllDataTicket($id_region){
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

    public function getDomiciliacionTickets($id_user){
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

    public  function getTicketabiertoCount(){
        // Lógica para obtener la cantidad de usuarios
        $result = $this->model->getTicketabiertoCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['total_tickets_abiertos'];
    }

    public  function getTicketsResueltosCount(){
        // Lógica para obtener la cantidad de usuarios
        $result = $this->model->getTicketsResueltosCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['total_tickets_resuelto'];
    }

    public function getTicketsTotalCount(){
        // Lógica para obtener la cantidad de usuarios
        $result = $this->model->getTicketsTotalCount(); // Asumiendo que tienes este método en tu modelo
        return $result['row']['total_tickets_general'];
    }

    public function getTicketPercentageData(){
        $result = $this->model->getTicketCountsForPercentage();
        return $result;
    }

    public function getTicketsResueltosPercentageData(){
        $result = $this->model->getTicketsResueltosCountsForPercentage();
        return $result;
    }

    public function getTotalTicketsPercentageData(){
        $result = $this->model->getTotalTicketsCountsForPercentage();
        return $result;
    }
    
}