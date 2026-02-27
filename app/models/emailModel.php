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

    public function GetRegionUser($id_user){
        try{
            $sql = "SELECT * FROM sp_verregionusers(".$id_user.")";
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

    public function GetEmailAreaTesoreria(){
       try{
            $sql = "SELECT ar.id_area, ar.name_area, ar.email_area from areas ar WHERE ar.id_area = 2";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetUserByArea($id_area){
        try{
            $escaped_id_area = pg_escape_literal($this->db->getConnection(), $id_area);
            $sql = "SELECT * FROM get_full_names_by_area(".$escaped_id_area.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en GetUserByArea: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
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

    public function get_details_by_nroTicket($nro_ticket){
        try{
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            $sql = "SELECT * FROM get_details_by_nroTicket(".$escaped_nro_ticket.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en get_details_by_nroTicket: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    public function GetPresupuestoData($nro_ticket){
        try{
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            $sql = "SELECT * FROM budgets WHERE nro_ticket = " . $escaped_nro_ticket . " ORDER BY fecha_creacion DESC LIMIT 1;";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en GetPresupuestoData: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    public function GetPaymentData($nro_ticket){
        try{
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            $sql = "SELECT *, 
                           (SELECT SUM(reference_amount) FROM payment_records WHERE nro_ticket = p.nro_ticket AND (is_substituted IS NULL OR is_substituted = FALSE)) as total_reference_amount,
                           (SELECT SUM(amount_bs) FROM payment_records WHERE nro_ticket = p.nro_ticket AND (is_substituted IS NULL OR is_substituted = FALSE)) as total_amount_bs
                    FROM payment_records p 
                    WHERE nro_ticket = " . $escaped_nro_ticket . " 
                    ORDER BY id_payment_record DESC LIMIT 1;";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en GetPaymentData: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    public function GetTicketDetailsByNroTicket($nro_ticket){
        try{
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            $sql = "SELECT serial_pos, nro_ticket FROM tickets WHERE nro_ticket = " . $escaped_nro_ticket . " LIMIT 1;";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en GetTicketDetailsByNroTicket: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    public function GetTicketCompleteDataByNroTicket($nro_ticket){
        try{
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            $sql = "
               SELECT 
                    t.id_level_failure,
                    f.name_failure,
                    ut.date_create_ticket,
                    a.name_accion_ticket,
                    st.name_status_ticket,
                    sp.name_status_payment,
                    sd.name_status_domiciliacion,
                    CONCAT(u.name, ' ', u.surname) as full_name_tecnico
                FROM tickets t
                LEFT JOIN tickets_failures tf ON tf.id_ticket = t.id_ticket
                LEFT JOIN failures f ON f.id_failure = tf.id_failure
                LEFT JOIN accions_tickets a ON a.id_accion_ticket = t.id_accion_ticket
                LEFT JOIN status_tickets st ON st.id_status_ticket = t.id_status_ticket
                LEFT JOIN status_payments sp ON sp.id_status_payment = t.id_status_payment
                LEFT JOIN tickets_status_domiciliacion tsd ON tsd.id_ticket = t.id_ticket
                LEFT JOIN status_domiciliacion sd ON sd.id_status_domiciliacion = tsd.id_status_domiciliacion
                LEFT JOIN users_tickets ut ON ut.id_ticket = t.id_ticket
                LEFT JOIN users u ON u.id_user = ut.id_tecnico_n1
                WHERE t.nro_ticket = " . $escaped_nro_ticket . "
                ORDER BY t.id_ticket DESC
                LIMIT 1;
            ";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en GetTicketCompleteDataByNroTicket: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    public function GetLastPaymentByTicket($nro_ticket) {
        try {
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            $sql = "SELECT * FROM payment_records WHERE nro_ticket = $escaped_nro_ticket ORDER BY id_payment_record DESC LIMIT 1";
            return Model::getResult($sql, $this->db);
        } catch (\Throwable $e) {
            error_log("Error en GetLastPaymentByTicket: " . $e->getMessage());
            return null;
        }
    }

    public function GetDataTicket2ByNro($nro_ticket) {
        try {
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            $sql = "SELECT * FROM GetDataTicket2() WHERE nro_ticket = $escaped_nro_ticket LIMIT 1";
            return Model::getResult($sql, $this->db);
        } catch (\Throwable $e) {
            error_log("Error en GetDataTicket2ByNro: " . $e->getMessage());
            return null;
        }
    }
    public function GetTicketStaffDetails($nro_ticket, $payment_reference) {
        try {
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            $escaped_payment_reference = pg_escape_literal($this->db->getConnection(), $payment_reference);
            $sql = "SELECT * FROM get_ticket_staff_details($escaped_nro_ticket, $escaped_payment_reference) LIMIT 1";
            return Model::getResult($sql, $this->db);
        } catch (\Throwable $e) {
            error_log("Error en GetTicketStaffDetails: " . $e->getMessage());
            return null;
        }
    }
}
?>