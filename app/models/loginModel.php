<?php
require_once __DIR__ . "/../../libs/Model.php";

class loginModel extends Model{
    
    public $db;

    public function __construct(){
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
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
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }
}
//Fin Modelo
?>