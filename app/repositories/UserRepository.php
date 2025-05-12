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

   public function getUserPermissions($userId) {
        $permissions = [];

        // Obtén todas las vistas disponibles
        $resultViews = $this->model->getview();
        $viewsToCheck = [];

        // Itera sobre los resultados y extrae los nombres de las vistas
        for ($i = 0; $i < $resultViews['numRows']; $i++) {
            $row = pg_fetch_assoc($resultViews['query'], $i);
            if ($row && isset($row['name_view'])) {
                $viewsToCheck[] = $row['name_view'];
            }
        }
        pg_free_result($resultViews['query']);

        // Ahora itera sobre los nombres de las vistas y obtén los permisos del usuario
        foreach ($viewsToCheck as $viewName) {
            $resultPermission = $this->model->getUserPermission($userId, $viewName);

            if (isset($resultPermission['row']) && is_array($resultPermission['row'])) {
                $permissionValue = reset($resultPermission['row']);
                if ($permissionValue === true || ($permissionValue) === 't') {
                    $permissions[$viewName] = true;
                } else {
                    $permissions[$viewName] = false;
                }
            } else {
                // Manejar el caso en que no se encuentra el permiso o la estructura es incorrecta
                $permissions[$viewName] = false; // O define un valor por defecto
            }
        }
        return $permissions;
    }
}