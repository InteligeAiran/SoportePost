<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases
require_once __DIR__. '/../models/consulta_rifModel.php'; // Asegúrate de que el modelo de usuario esté incluido
use consulta_rifModel; // Asegúrate de que tu modelo de usuario exista
session_start(); // Inicia la sesión
class TechnicalConsultionRepository
{
    private $model;

    public function __construct(){
        $this->model = new consulta_rifModel(); // Instancia tu modelo de usuario
    }

    public function SearchRif($rif){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchRif($rif);
        if ($result) {
            //var_dump($result);  
            $rif = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $rif[] = $agente;
                //var_dump($agente);
            }
            return $rif;
        } else {
            return null;
        }
    }

    public function SearchSerialData($serial){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchSerialData($serial);
        if ($result) {
            //var_dump($result);  
            $serialData = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $serialData[] = $agente;
                //var_dump($agente);
            }
             return $serialData;
        } else {
            return null;
        }
    }

    public function SearchRazonData($razonsocial){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchRazonData($razonsocial);
        if ($result) {
            //var_dump($result);  
            $razon = [];

             for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $serialData[] = $agente;
                //var_dump($agente);
            }
             return $serialData;
        } else {
            return null;
        }
    }

    public function SearchSerial($serial){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchSerial($serial);
        if ($result) {
            //var_dump($result);  
            $serial = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $serial[] = $agente;
                //var_dump($agente);
            }
            return $serial;
        } else {
            return null;
        }
    }

    public function SearchtypePos($serial){
        // Lógica para obtener todos los usuarios
        $result = $this->model->SearchtypePos($serial);
        return $result ? $result['row']['codmodelopos'] : null;
    }

    public function VerifingClient($rif){
        $result = $this->model->VerifingClient($rif);
        if ($result && is_array($result) && isset($result['row']) && is_array($result['row']) && isset($result['row']['rif'])) {
            return $result['row']['rif'];
        } else {
            return null; // Devuelve null si no se encuentra el RIF o la estructura es incorrecta
        }
    }

    public function SaveDataFalla($serial, $falla, $nivelFalla, $id_user, $rif){
        $result = $this->model->SaveDataFalla($serial, $falla, $nivelFalla, $id_user, $rif);
        return $result;
    }

    public function GetPosSerialsByRif($rif){
        $result = $this->model->GetPosSerialsByRif($rif);
        if ($result) {
            //var_dump($result);  
            $serial = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $serial[] = $agente;
                //var_dump($agente);
            }
            return $serial;
        } else {
            return null;
        }
    }

    public function UltimateDateTicket($serial){
        $result = $this->model->UltimateDateTicket($serial);
        // Verifica si $result es un array y si contiene la clave 'row'
        if ($result && is_array($result) && isset($result['row']) && is_array($result['row']) && isset($result['row']['ult_ticket'])) {
            return $result['row']['ult_ticket'];
        } else {
            return null; // Devuelve null si no hay resultados o la estructura es incorrecta
        }
    }

    public function InstallDatePOS($serial){
        $result = $this->model->InstallDatePOS($serial);
        // Verifica si $result es un array y si contiene la clave 'row'
        if ($result && is_array($result) && isset($result['row']) && is_array($result['row']) && isset($result['row']['inst_ticket'])) {
            return $result['row']['inst_ticket'];
        } else {
            return null; // Devuelve null si no hay resultados o la estructura es incorrecta
        }
    }

    public function GetCoordinator(){
        $result = $this->model->GetCoordinator();
    
        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $coordi[] = $agente;
            //var_dump($agente);
        }
        return $coordi;
    }

    public function GetFailure2(){
        $result = $this->model->GetFailure2();

        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $failures[] = $agente;
            //var_dump($agente);
        }
        return $failures;
    }

    public function GetFailure1(){
        $result = $this->model->GetFailure1();

        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $failures[] = $agente;
            //var_dump($agente);
        }
        return $failures;
    }

    public function SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaEnvio, $id_status_payment, $rutaExo, $rutaAnticipo, $id_user, $mimeTypeExo, $mimeTypeAnticipo, $mimeTypeEnvio, $rif){
        $result = $this->model->SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaEnvio, $id_status_payment, $rutaExo, $rutaAnticipo, $id_user, $mimeTypeExo, $mimeTypeAnticipo, $mimeTypeEnvio, $rif);
        return $result;
    }

    public function GetTicketData(){
        $result = $this->model->GetTicketData();
        if ($result) {
            //var_dump($result);  
            $ticket = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            //var_dump($agente);
            return $ticket;
        } else {
            return null;
        }
    }

    public function GetTicketData1(){
        $result = $this->model->GetTicketData1();
        if ($result) {
            //var_dump($result);  
            $ticket = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            //var_dump($agente);
            return $ticket;
        } else {
            return null;
        }
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
        $result = $this->model->UpdateAccion($id_ticket, $id_tecnico); // ¡Ahora el orden es correcto!
        return $result;
    }

    public function SendToTaller($id_ticket){
        $result = $this->model->SendToTaller($id_ticket); // ¡Ahora el orden es correcto!
        return $result;
    }

    public function GetTicketDataLab(){
        $result = $this->model->GetTicketDataLab();
        if ($result) {
            //var_dump($result);  
            $ticket = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $ticket[] = $agente;
            }
            //var_dump($agente);
            return $ticket;
        } else {
            return null;
        }
    }

    public function GetSatusTaller(){
        $result = $this->model->GetSatusTaller();
        if ($result) {
            //var_dump($result);  
            $estatus = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $estatus[] = $agente;
            }
            //var_dump($agente);
            return $estatus;
        } else {
            return null;
        }
    }

    public function UpdateTicketStatus($id_new_status, $id_ticket, $id_user){
        $result = $this->model->UpdateTicketStatus($id_new_status,$id_ticket, $id_user);
        return $result['row']['check_user_status'];
    }
}
?>