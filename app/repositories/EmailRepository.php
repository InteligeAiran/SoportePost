<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases
require_once __DIR__. '/../models/emailModel.php'; // Asegúrate de que el modelo de usuario esté incluido
use emailModel; // Asegúrate de que tu modelo de usuario exista

class EmailRepository
{
    private $model;

    public function __construct(){
        $this->model = new emailModel(); // Instancia tu modelo de usuario
    }

    public function ChangePassForCode($email, $code){
        // Lógica para cambiar la contraseña por código
        $result = $this->model->ChangePassForCode($email, $code);
        return $result;
    }

    public function UpdateStatusTo1($email){
        // Lógica para actualizar el intento de contraseña a 1 lo cual es STATUS: Nuevo
        $result = $this->model->UpdateStatusTo1($email);
        return $result;
    }

    public function UpdateTimePass($email){
        // Lógica para actualizar el intento de contraseña a 0
        $result = $this->model->UpdateTimePass($email);
        return $result;
    }

    public function GetEmailUser($email){
        // Lógica para obtener un usuario por su ID usando el modelo
        $result = $this->model->GetEmailUser($email); 
        return $result ? $result['numRows'] : null;
    }

    public function GetEmailUserData($email){
        // Lógica para obtener datos de usuario
        $result = $this->model->GetEmailUser($email);
        return $result ? $result['row']['nombre_completo'] : null;
    }

    public function GetEmailCoorData(){
        // Lógica para obtener datos de usuario
        $result = $this->model->GetEmailCoord();
        return $result ? $result['row'] : null;
    }

    public function GetDataTicket1(){
        // Lógica para obtener datos de ticket
        $result = $this->model->GetDataTicket1();
        return $result ? $result['row'] : null;
    }

    public  function GetClientInfo($serial){
        // Lógica para obtener información del cliente
        $result = $this->model->GetClientInfo($serial);
        return $result ? $result['row'] : null;
    }
}