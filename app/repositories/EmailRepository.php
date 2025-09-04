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

        $defaul_pass = $code;
        $encry_passw = sha1(md5($defaul_pass));
        // Lógica para cambiar la contraseña por código
        $result = $this->model->ChangePassForCode($email, $encry_passw);
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

    public function GetEmailCoorDataById($id_ticket){
        $result = $this->model->GetEmailCoordById($id_ticket);
        return $result ? $result['row'] : null;
    }

    public function GetEmailArea(){
        // Lógica para obtener datos de usuario
        $result = $this->model->GetEmailArea();
        return $result ? $result['row'] : null;
    }

    public function GetCoordinacion($id_ticket){
        // Lógica para obtener datos de usuario
        $result = $this->model->GetCoordinacion($id_ticket);
        return $result ? $result['row'] : null;
    }

    public function GetTicketId($nro_ticket){
        // Lógica para obtener datos de usuario
        $result = $this->model->GetTicketId($nro_ticket);
        return $result ? $result['row'] : null;
    }

    public function GetDataTicketConCliente($serial, $id_level_failure)
    {
        // Obtener los datos del ticket
        $result = $this->model->GetTicketNivel($serial, $id_level_failure);
        if($result['row']['id_level_failure'] == 1){
            $ticketData = $this->model->GetDataTicket1();
            $ticket = $ticketData ? $ticketData['row'] : null;
            if ($ticket && isset($ticket['serial_pos'])) {
                // Obtener la información del cliente utilizando el serial del ticket
                $clientData = $this->model->GetClientInfo($ticket['serial_pos']);
        
                $clientInfo = $clientData ? $clientData['row'] : null;

                // Unificar los datos si se encontró la información del cliente
                if ($clientInfo) {
                    return array_merge($ticket, $clientInfo);
                } else {
                    // Si no se encontró la información del cliente, devolver solo los datos del ticket
                    return $ticket;
                }
            }
        }else{
            $ticketData = $this->model->GetDataTicketConsultation();
            $ticket = $ticketData ? $ticketData['row'] : null;
            if ($ticket && isset($ticket['serial_pos'])) {
                // Obtener la información del cliente utilizando el serial del ticket
                $clientData = $this->model->GetClientInfo($ticket['serial_pos']);
        
                $clientInfo = $clientData ? $clientData['row'] : null;

                // Unificar los datos si se encontró la información del cliente
                if ($clientInfo) {
                    return array_merge($ticket, $clientInfo);
                } else {
                    // Si no se encontró la información del cliente, devolver solo los datos del ticket
                    return $ticket;
                }
            }
        }
        return null; // Si no se pudieron obtener los datos del ticket iniciales
    }

    public function GetDataTicketConsultation(){
        // Lógica para obtener datos de ticket
        $result = $this->model->GetDataTicketConsultation();
        return $result? $result['row'] : null;
    }

    public function GetDataTicket1(){
        // Lógica para obtener datos de ticket
        $result = $this->model->GetDataTicket1();
        return $result ? $result['row'] : null;
    }


    public function GetDataTicket2(){
        $result = $this->model->GetDataTicket2();
        return $result ? $result['row'] : null;
    }

    public function GetDataTicketClosed(){
        $result = $this->model->GetDataTicketClosed();
        return $result ? $result['row'] : null;
    }

    public  function GetClientInfo($serial){
        // Lógica para obtener información del cliente
        $result = $this->model->GetClientInfo($serial);
        return $result ? $result['row'] : null;
    }

    public function GetDataImage($id_ticket){
        // Lógica para obtener datos de imagen
        //var_dump($serial);
        $result = $this->model->GetDataImage($id_ticket);
        //var_dump($result['mime_type']);
        return $result ? $result['row'] : null;
    }

    public function GetEmailUserDataById($id_user){
        $result = $this->model->GetEmailUserDataById($id_user);
        //var_dump($result);
        return $result ? $result['row'] : null;
    }

    public function GetEmailUser1gestionDataById($ticketid){
        $result = $this->model->GetEmailUser1gestionDataById( $ticketid);
        //var_dump($result);
        return $result ? $result['row'] : null;
    }

    public function GetDocumentoRechazado($ticketnro){
        $result = $this->model->GetDocumentoRechazado($ticketnro);
        return $result ? $result['row'] : null;
    }

    public function resultUserreject($id_user){
        $result = $this->model->resultUserreject($id_user);
        return $result ? $result['row'] : null;
    }
}