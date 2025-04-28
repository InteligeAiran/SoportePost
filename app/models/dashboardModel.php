<?php
require_once __DIR__ . "/../../libs/Model.php";

class DashboardModel extends Model{
    
    public $db;

    public function __construct(){
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
    }

    public function GetUserCount(){
        try{
            $sql = "SELECT count(*) as users FROM users;";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        } 
    }

    public function GetUsers(){
        try{
            $sql = "SELECT u.id_user, u.cedula, u.id_statususr, CONCAT(u.name, ' ', u.surname) as full_name, username, password, id_rolusr, email, id_area, trying_failedpassw, date_create,id_level_tecnico
                FROM users u;";
            $result = Model::getResult($sql, $this->db);
            //var_dump($result);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        } 
    }
}
?>