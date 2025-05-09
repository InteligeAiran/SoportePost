<?php

namespace App\Repositories; // Usar namespaces para organizar tus clases
require_once __DIR__. '/../models/userModel.php'; // Asegúrate de que el modelo de usuario esté incluido
use userModel; // Asegúrate de que tu modelo de usuario exista
class UserRepository
{
    private $model;

    public function __construct(){
        $this->model = new userModel(); // Instancia tu modelo de usuario
    }

    public function getAllUsers(){
        // Lógica para obtener todos los usuarios
        $result = $this->model->getAllUsers(); // Asumiendo que tienes este método en tu modelo
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

    public function GetUserById($id){
        // Lógica para obtener todos los usuarios
        $result = $this->model->GetUserById($id); // Asumiendo que tienes este método en tu modelo
        return $result ? $result['row'] : null;
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
        $result = $this->model->UpdateAccion($id_tecnico, $id_ticket);
        return $result;
    }
}