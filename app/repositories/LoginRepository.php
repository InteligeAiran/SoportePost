<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases
require_once __DIR__. '/../models/loginModel.php'; // Asegúrate de que el modelo de usuario esté incluido
use loginModel; // Asegúrate de que tu modelo de usuario exista
session_start(); // Iniciar la sesión si no se ha hecho antes
class LoginRepository
{
    private $model;

    public function __construct(){
        $this->model = new loginModel(); // Instancia tu modelo de usuario
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
        return $result ? $result['numRows'] : null;
    }
}