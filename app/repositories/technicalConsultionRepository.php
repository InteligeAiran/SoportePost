<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases
require_once __DIR__. '/../models/consulta_rifModel.php'; // Asegúrate de que el modelo de usuario esté incluido
use consulta_rifModel; // Asegúrate de que tu modelo de usuario exista

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

    public function SaveDataFalla($serial, $falla, $nivelFalla, $id_user){
        $result = $this->model->SaveDataFalla($serial, $falla, $nivelFalla, $id_user);
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

    public function SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaEnvio, $id_status_payment, $rutaExo, $rutaAnticipo){
        $result = $this->model->SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaEnvio, $id_status_payment, $rutaExo, $rutaAnticipo);
        return $result;
    }
}
?>