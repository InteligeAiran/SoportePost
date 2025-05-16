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
}