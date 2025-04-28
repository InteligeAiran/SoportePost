<?php
require_once __DIR__ . "/../../libs/Model.php";
class loginModel extends Model{
    
    public $db;

    public function __construct(){
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
    }

    public function GetUserData($username, $password){
        try{
            $escaped_username = pg_escape_literal($this->db->getConnection(), $username); // Assuming '$this->db' is now a valid PgSql\Connection
            $escaped_password = pg_escape_literal($this->db->getConnection(), $password);
            $sql = "SELECT * from get_user_by_credentials(".$escaped_username.", ".$escaped_password.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        } 
    }

    public function GetUsernameUser($username){
        try{
            $escaped_username = pg_escape_literal($this->db->getConnection(), $username); 
            $sql = "SELECT * FROM check_username_exists(".$escaped_username.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
          // Depuración: imprime la consulta SQL y el resultado
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetPasswordUser($username, $password){  
        try {
            $escaped_username = pg_escape_literal($this->db->getConnection(), $username); 
            $escaped_password = pg_escape_literal($this->db->getConnection(), $password); 
            $sql = "SELECT * FROM check_password_exists(".$escaped_username.", ".$escaped_password.");";
            //var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

   

    public function UpdateTryPass($username){
        try{
            $sql = "UPDATE users SET trying_failedpassw = trying_failedpassw +  1 WHERE username = '".$username."';";
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTryPass($username){
        try{
            $escaped_username = pg_escape_literal($this->db->getConnection(), $username); 
            $sql = "SELECT * FROM get_failed_attempts_by_username(".$escaped_username.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
        // Handle exception
        }
    }

    public function UpdateStatusTo4($username){
        try{
            $sql = "UPDATE users SET id_statususr = 4 WHERE username = '".$username."';";
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }


    public function UpdateStatusTo0($username){
        try{
            $sql = "UPDATE users SET trying_failedpassw = 0 WHERE username = '".$username."';";
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function InsertSession($session_id, $start_date, $id_user, $user_agent, $ip_address, $active, $expiry_time){
        try{
            $escaped_session_id = pg_escape_literal($this->db->getConnection(), $session_id);
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $escaped_user_agent = pg_escape_literal($this->db->getConnection(), $user_agent);
            $escaped_ip_address = pg_escape_literal($this->db->getConnection(), $ip_address);
            $sql = "CALL insert_session_user(".$escaped_session_id.", ".$escaped_id_user.", '".$start_date."', ".$escaped_user_agent.", 
            ".$escaped_ip_address.", ".$active.", '".$expiry_time."');";
            //var_dump($sql);
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetSession($id_user, $id_session){
        try{
            $sql = "SELECT * FROM sessions_users  WHERE id_user = " . $id_user . " AND active = 1  AND (id_session != '" . $id_session . "')";
            //var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function UpdateSession($id_user,  $session_id){
        try{
            $sql = "UPDATE sessions_users SET end_date = NOW(), active = 0 WHERE id_user = ".$id_user." AND id_session = '". $session_id."';";
            //var_dump($sql);
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetExpiredSessions($usuario_id, $ahora) {
        try {
            $sql = "SELECT id_session FROM sessions_users WHERE id_user = ".$usuario_id." AND active = 1 AND expiry_time <= '".$ahora."';";
            //var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function UpdateSessionExpired($id_session) {
        try {
            $sql = "UPDATE sessions_users SET active = 0, end_date = NOW() WHERE id_session = '".$id_session."';";
            //var_dump($sql);
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }
}
//Fin Modelo
?>