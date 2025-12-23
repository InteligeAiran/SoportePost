<?php
require_once __DIR__ . "/../../libs/Model.php";

class emailModel extends Model{
    
    public $db;

    public function __construct(){
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
    }

    public function GetEmailUser($email){
        try{
            $escaped_email = pg_escape_literal($this->db->getConnection(), $email); 
            $sql = "SELECT * FROM get_user_by_email(".$escaped_email.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    /* REALIZAR ESTA FUNCION EN POSTGRESQL*/
    public function GetEmailCoordByIdfun($id_coordinador){
        try{
            $escaped_id = pg_escape_literal($this->db->getConnection(), $id_coordinador); 
            $sql = "SELECT * FROM get_user_by_id(".$escaped_id.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
    
    public function GetEmailCoordById($id_ticket){
        try{
            $sql = "SELECT * FROM get_coordinador_info(".$id_ticket.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetEmailArea(){
        try{
            $sql = "SELECT ar.name_area, ar.email_area from areas ar WHERE ar.id_area = 5";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetCoordinacion($id_ticket){
        try{
            $sql = "SELECT * FROM get_department_name(".$id_ticket.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketId($nro_ticket){
        try{
            $sql = "SELECT * FROM get_ticket_id('".$nro_ticket."')";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function ChangePassForCode($email, $encry_passw){
        try{
            $escaped_codigo = pg_escape_literal($this->db->getConnection(), $encry_passw);
            $escaped_email = pg_escape_literal($this->db->getConnection(), $email); 
            $sql = "CALL update_user_password_by_email(".$escaped_email.", ".$escaped_codigo.");";
            //var_dump($sql);
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function UpdateStatusTo1($email){
        try{
            $sql = "UPDATE users SET id_statususr = 1 WHERE email = '".$email."';";
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
    
    public function UpdateTimePass($email){
        try{
            $sql = "UPDATE users SET trying_failedpassw = 0 WHERE email = '".$email."';";
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }        
    
    public function GetEmailCoord(){
        try{
            $sql = "SELECT * FROM get_data_coordinator()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetDataTicket1(){
        try{
            $sql = "SELECT * FROM GetDataTicket1()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetDataTicket2(){
        try{
            $sql = "SELECT * FROM GetDataTicket2()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetDataTicketClosed(){
        try{
            $sql = "SELECT * FROM GetDataTicketClosed()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }  

    public function GetDataTicketConsultation(){
        try{
            $sql = "SELECT * FROM GetDataTicketConsultation()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetClientInfo($serial){
        try{
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial); 
            $sql = "SELECT * FROM GetClientInfo(".$escaped_serial.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketNivel($serial, $id_level_failure){
        try{
            $sql = "SELECT * FROM id_level_failure('".$serial."', ".$id_level_failure.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetDataImage($id_ticket){
        try{
            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $id_ticket); 
            $sql = "SELECT downl_exoneration AS exo, mime_type_exo AS mime_type FROM tickets WHERE id_ticket = ".$escaped_id_ticket." AND downl_exoneration IS NOT NULL"; 
            //var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetEmailUserDataById($id_user){
        try{
            $sql = "SELECT * FROM get_email_user_by_id(".$id_user.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetEmailUser1gestionDataById($ticketid, $document_type){
        try{
            $sql = "SELECT * FROM get_email_user_gestion_by_id(".$ticketid.", '".$document_type."');";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetDocumentoRechazado($ticketnro){
        try{
            $sql = "SELECT * FROM get_ticket_reject_attachments('".$ticketnro."');";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function resultUserreject($id_user){
        try{
            $sql = "SELECT * FROM get_user_role_info(".$id_user.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
    
    public function GetEmailAreaAdmin(){
       try{
            $sql = "SELECT ar.name_area, ar.email_area from areas ar WHERE ar.id_area = 2";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetEmailAreaFinanzas(){
       try{
            $sql = "SELECT ar.name_area, ar.email_area from areas ar WHERE ar.id_area = 2";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketDataById($ticketId){
        try{
            $escaped_ticket_id = pg_escape_literal($this->db->getConnection(), $ticketId);
            $sql = "SELECT * FROM getdataticket_by_id(".$escaped_ticket_id.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en GetTicketDataById: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }
}
?>