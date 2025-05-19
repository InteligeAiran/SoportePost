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

    public function GetAreaUsers(){
        $result = $this->model->GetAreaUsers();
    
        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $area[] = $agente;
            //var_dump($agente);
        }
        return $area;
    }

        public function GetTipoUsers(){
        $result = $this->model->GetTipoUsers();
    
        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $tipousers[] = $agente;
            //var_dump($agente);
        }
        return $tipousers;
    }

    
        public function GetRegionUsers(){
        $result = $this->model->GetRegionUsers();
    
        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $tipousers[] = $agente;
            //var_dump($agente);
        }
        return $tipousers;
    }    

    public function Guardar_Usuario($id_user, $nombreusers, $apellidousers, $identificacion, $users, $correo, $area_users, $tipo_users, $regionusers, $id_nivel){

        $defaul_pass = 123456;
        $encry_passw = sha1(md5($defaul_pass));

        $result = $this->model->Guardar_Usuario($id_user, $nombreusers, $apellidousers, $encry_passw, $identificacion, $users, $correo, $area_users, $tipo_users, $regionusers, $id_nivel);
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
            //var_dump($resultPermission); // Para depurar, muestra los resultados de la consulta

        
                $permissionValue = reset($resultPermission['row']);
                if ($permissionValue === true || ($permissionValue) === 't') {
                    $permissions[$viewName] = true;
                    //var_dump($viewName.'-> '.($permissionValue === true? 'Permitido' : 'Denegado'));
                } else {
                    $permissions[$viewName] = false;
                   // var_dump($viewName.'-> Denegado');
                }
        }
        return $permissions;
    }

    public function MostrarUsuarioEdit($idusuario){

        $result = $this->model->MostrarUsuarioEdit($idusuario);

        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $edit[] = $agente;
            //var_dump($agente);
        }
        return $edit;
    }    


    public function Editar_Usuario($idusuario_edit,$edit_nombreusers, $edit_apellidousers, $edit_usuario,$edit_documento,  $edit_correo,$edit_area_users,$edit_regionusers,$edit_tipo_users,$id_user){
        $result = $this->model->Editar_Usuario($idusuario_edit,$edit_nombreusers, $edit_apellidousers, $edit_usuario,$edit_documento,  $edit_correo,$edit_area_users,$edit_regionusers,$edit_tipo_users,$id_user);
    }

    public function GetUsernameUser($username){
        // Lógica para obtener un usuario por su ID usando el modelo
        $result = $this->model->GetUsernameUser($username); // Asumiendo que tienes este método en tu modelo
        return $result ? $result['numRows'] : null;
    }

    public function GetUserData($username, $password){
        // Lógica para obtener datos de usuario
        $result = $this->model->GetUserData($username, $password); // Asumiendo que tienes este método en tu modelo
        return $result ? $result['row'] : null;
    }
    
    public function UpdateTryPassTo0($username){
        // Lógica para actualizar el intento de contraseña a 0
        $result = $this->model->UpdateStatusTo0($username);// Asumiendo que tienes este método en tu modelo
        //var_dump($result);
        return $result;
    }

    public function UpdateTryPass($username){
        // Lógica para actualizar el intento de contraseña a 0
        $result = $this->model->UpdateTryPass($username);// Asumiendo que tienes este método en tu modelo
        return $result;
    }

    public function GetTryPass($username){
        // Lógica para Obtener los intentos de clave  
        $result = $this->model->GetTryPass($username);// Asumiendo que tienes este método en tu modelo
        return $result ? $result['row']['trying_failedpassw'] : null;
    }

    public function UpdateStatusTo4($username){
        // Lógica para actualizar el status a 4 lo cual es STATUS: Bloqueado
        $result = $this->model->UpdateStatusTo4($username);// Asumiendo que tienes este método en tu modelo
        return $result;
    }

    public function GetSession($session_id){
        // Lógica para obtener una sesión por su ID
        $result = $this->model->GetSession($_SESSION['id_user'], $session_id); // Asumiendo que tienes este método en tu modelo
        //var_dump($result);
        return $result ? $result['numRows'] : null;;
    }

    public function InsertSession($session_id, $start_date, $user_agent, $ip_address, $active, $expiry_time){
        // Lógica para insertar una sesión
        $result = $this->model->InsertSession($session_id, $start_date, $_SESSION['id_user'], $user_agent, $ip_address, $active, $expiry_time);// Asumiendo que tienes este método en tu modelo
        return $result;
    }

    public function GetPasswordUser($username, $password){
        // Lógica para obtener un usuario por su nombre de usuario
        $result = $this->model->GetPasswordUser($username, $password); // Asumiendo que tienes este método en tu modelo
        //var_dump($result);
        return $result ? $result['numRows'] : null;
    }
}