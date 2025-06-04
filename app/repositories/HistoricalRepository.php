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

    public function GetTicketHistory($id_ticket){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetTicketHistory($id_ticket); // Asumiendo que tienes este método en tu modelo
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
}