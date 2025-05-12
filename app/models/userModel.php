<?php
require_once __DIR__ . "/../../libs/Model.php";
require_once __DIR__ . "/../../libs/session.php";
class userModel extends Model{
    
    public $db;

    public function __construct(){
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
    }

    public function getAllUsers(){
        try{
            $sql = "SELECT * FROM GetAllDataUser()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getUserById($id){
        try{
            $sql = "SELECT usr.id_user, usr.username AS usuario, usr.national_id AS cedula, usr.name as nombres, usr.surname AS apellidos, usr.email AS correo, 
                    usr.id_rolusr AS codtipousuario, usr.id_statususr as status, rol.name_rol AS name_rol
                    FROM users usr
                    INNER JOIN roles rol ON usr.id_rolusr = rol.id_rolusr WHERE usr.id_user = ".$id.";";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTecnico2(){
        try{
            $sql = "SELECT * FROM GetTecnico2()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function UpdateAccion($id_ticket, $id_tecnico){
        try{
            $sql = "SELECT * FROM AssignTickettoTecnico(".$id_ticket.", ".$id_tecnico.")";
           // var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        }catch(Throwable $e){

        }
    }

    public function getUserPermission($userId, $viewName) {
        try {
            $escapedUserId = pg_escape_literal($this->db->getConnection(), $userId);
            $escapedViewName = pg_escape_literal($this->db->getConnection(), $viewName);

            $sql = "SELECT getuserpermissionfunction(" . $escapedUserId . ", " . $escapedViewName . ")";
            $result = Model::getResult($sql, $this->db); // Obtienes el array de getResult
            //var_dump($sql); // Muestra el resultado del query
            return $result; // Devuelve el resultado completo

        } catch (Throwable $e) {
            error_log("Error al obtener permisos del usuario: " . $e->getMessage());
            return ['success' => false, 'error' => 'Error al obtener permisos'];
        }
    }

    public function getview(){
        try{
            $sql = "SELECT name_view FROM views";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
}   
?>