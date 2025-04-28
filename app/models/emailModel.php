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

    public function ChangePassForCode($email, $codigo){
        try{
            $escaped_codigo = pg_escape_literal($this->db->getConnection(), $codigo);
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

    public function GetClientInfo($serial){
        try{
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial); 
            $sql = "SELECT * FROM get_Client_by_serial(".$escaped_serial.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
}
?>