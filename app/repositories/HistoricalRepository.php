<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases
require_once __DIR__. '/../models/HistoricalModel.php'; // Asegúrate de que el modelo de usuario esté incluido
use HistoricalModel; // Asegúrate de que tu modelo de usuario exista
class HistoricalRepository
{
    private $model;

    public function __construct(){
        $this->model = new HistoricalModel(); // Instancia tu modelo de usuario
    }

    public function GetTicketHistory($id_ticket, $id_cliente = null, $search_by_client = false){
        // Lógica para obtener el historial del ticket o cliente
        $result = $this->model->GetTicketHistory($id_ticket, $id_cliente, $search_by_client); 
        
        if (is_array($result)) {
            return $result;
        } else {
            return [];
        }
    }

    public function MarkTicketReceived($id_ticket, $id_user){
        // Lógica para marcar un ticket como recibido
        $result = $this->model->MarkTicketReceived($id_ticket, $id_user);
        return $result;
    }

    public function MarkTicketReceivedTechnical($id_ticket, $id_user){
        // Lógica para marcar un ticket como recibido por el técnico
        $result = $this->model->MarkTicketReceivedTechnical($id_ticket, $id_user);
        return $result;
    }
}