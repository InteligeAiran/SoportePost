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


        public function GetRegionUsers(){
        try{
            $sql = "SELECT * FROM sp_verregionusers()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }         


        public function Guardar_Usuario($id_user, $nombreusers, $apellidousers, $encry_passw, $identificacion, $users, $correo, $area_users, $tipo_users, $regionusers, $id_nivel){
        try {
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $escaped_nombreusers = pg_escape_literal($this->db->getConnection(), $nombreusers);
            $escaped_apellidousers = pg_escape_literal($this->db->getConnection(), $apellidousers);
            $escaped_encry_passw = pg_escape_literal($this->db->getConnection(), $encry_passw);
            $escaped_identificacion = pg_escape_literal($this->db->getConnection(), $identificacion);
            $escaped_users = pg_escape_literal($this->db->getConnection(), $users);
            $escaped_correo = pg_escape_literal($this->db->getConnection(), $correo);
            $escaped_area_users = pg_escape_literal($this->db->getConnection(), $area_users);
            $escaped_tipo_users = pg_escape_literal($this->db->getConnection(), $tipo_users);
            $escaped_regionusers = pg_escape_literal($this->db->getConnection(), $regionusers);
            $escaped_id_nivel = pg_escape_literal($this->db->getConnection(), $id_nivel);

    
            $sql = "SELECT * FROM sp_guardarusuarios(".$escaped_id_user.", ".$escaped_nombreusers.", ".$escaped_apellidousers.", ".$escaped_encry_passw.",
                    ".$escaped_identificacion.", ".$escaped_users.", ".$escaped_correo.",".$escaped_area_users.",".$escaped_tipo_users.", ".$escaped_regionusers.", ".$escaped_id_nivel.")";
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

    public function MostrarUsuarioEdit($id_user){
        try{
            $sql = "SELECT * FROM sp_mostrarusuarios(".$id_user.")";
           // var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        }catch(Throwable $e){

        }
    }   


    public function Editar_Usuario($idusuario_edit,$edit_nombreusers, $edit_apellidousers, $edit_usuario,$edit_documento,  $edit_correo,$edit_area_users,$edit_regionusers,$edit_tipo_users,$id_user){
        try {
            $escaped_idusuario_edit = pg_escape_literal($this->db->getConnection(), $idusuario_edit);
            $escaped_edit_nombreusers = pg_escape_literal($this->db->getConnection(), $edit_nombreusers);
            $escaped_edit_apellidousers = pg_escape_literal($this->db->getConnection(), $edit_apellidousers);
            $escaped_edit_usuario = pg_escape_literal($this->db->getConnection(), $edit_usuario);
            $escaped_edit_documento = pg_escape_literal($this->db->getConnection(), $edit_documento);
            $escaped_edit_correo = pg_escape_literal($this->db->getConnection(), $edit_correo);
            $escaped_edit_area_users = pg_escape_literal($this->db->getConnection(), $edit_area_users);
            $escaped_edit_regionusers = pg_escape_literal($this->db->getConnection(), $edit_regionusers);
            $escaped_edit_tipo_users = pg_escape_literal($this->db->getConnection(), $edit_tipo_users);
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            //$escaped_id_nivel = pg_escape_literal($this->db->getConnection(), $id_nivel);

    
            $sql = "SELECT * FROM sp_editarusuarios(".$escaped_idusuario_edit.", ".$escaped_edit_nombreusers.", ".$escaped_edit_apellidousers.", ".$escaped_edit_usuario.",
                    ".$escaped_edit_documento.", ".$escaped_edit_correo.", ".$escaped_edit_area_users.",".$escaped_edit_regionusers.",".$escaped_edit_tipo_users.", ".$escaped_id_user.")";
            $result = $this->db->pgquery($sql);

            echo $sql;

        } catch (Throwable $e) {
            error_log("Error al obtener permisos del usuario: " . $e->getMessage());
            return ['success' => false, 'error' => 'Error al obtener permisos'];
        }
    }

}   
?>