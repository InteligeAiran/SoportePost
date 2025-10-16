<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases
require_once __DIR__. '/../models/documentsModel.php'; // Asegúrate de que el modelo de usuario esté incluido
use documentsModel; // Asegúrate de que tu modelo de usuario exista

class DocumentsRepository
{
    private $model;

    public function __construct(){
        $this->model = new documentsModel(); // Instancia tu modelo de usuario
    }

    public function GetDeliveryNoteData($id_ticket){
        // Lógica para cambiar la contraseña por código
        $result = $this->model->GetDeliveryNoteData($id_ticket);
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

    public function GetPaymentAgreementData($id_ticket){
       // Lógica para cambiar la contraseña por código
        $result = $this->model->GetPaymentAgreementData($id_ticket);
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