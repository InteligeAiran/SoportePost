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


        public function GetUsuarios(){
        try{
            $sql = "SELECT * FROM get_data_coordinator()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

        public function GetAreaUsers(){
        try{
            $sql = "SELECT * FROM sp_verareasusers()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }    

        public function GetTipoUsers(){
        try{
            $sql = "SELECT * FROM sp_vertiposusers()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }    


        public function Guardar_Usuario($id_user, $nombreusers, $apellidousers, $tipo_doc, $documento, $users, $correo, $area_users, $tipo_users){
        try {
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $escaped_nombreusers = pg_escape_literal($this->db->getConnection(), $nombreusers);
            $escaped_apellidousers = pg_escape_literal($this->db->getConnection(), $apellidousers);
            $escaped_tipo_doc = pg_escape_literal($this->db->getConnection(), $tipo_doc);
            $escaped_documento = pg_escape_literal($this->db->getConnection(), $documento);
            $escaped_users = pg_escape_literal($this->db->getConnection(), $users);
            $escaped_correo = pg_escape_literal($this->db->getConnection(), $correo);
            $escaped_area_users = pg_escape_literal($this->db->getConnection(), $area_users);
            $escaped_tipo_users = pg_escape_literal($this->db->getConnection(), $tipo_users);

    
            $sql = "SELECT * FROM sp_guardarusuarios(".$escaped_id_user.", ".$escaped_nombreusers.", ".$escaped_apellidousers.",
                    ".$escaped_tipo_doc.", ".$escaped_documento.", ".$escaped_users.", ".$escaped_correo.",".$escaped_area_users.",".$escaped_tipo_users.")";
            $result = $this->db->pgquery($sql);
            var_dump($sql);
    
/*            if($result){
                $sqlFailure = "SELECT InsertTicketFailure(".$escaped_descripcion.");";
                $resultFailure = $this->db->pgquery($sqlFailure);
                return array('save_result' => $result, 'failure_result' => $resultFailure);
            } else {
                return $result;
            }*/
        } catch (Throwable $e) {
                // Handle exception
        }
    }

}

?>