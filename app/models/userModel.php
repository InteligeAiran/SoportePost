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

     public function GetRegionUsersById($id_user){
        try{
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $sql = "SELECT * FROM GetUserRegion(".$escaped_id_user.")";
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

            
             $sql_check_user = "SELECT * FROM sp_verificarusuariorep(".$escaped_users.")";
                $result_check_user = $this->db->pgquery($sql_check_user);

                if (!$result_check_user) {
                    throw new Exception("Error al verificar usuario existente: " . pg_last_error($this->db->pgquery($sql_check_user)));
                }
                $row_check_user = pg_fetch_row($result_check_user);
                if ($row_check_user[0] > 0) {
                    return ['success' => false, 'message' => 'El nombre de usuario "' . $users . '" ya está registrado.'];
                }

            $sql_sp  = "SELECT * FROM sp_guardarusuarios(".$escaped_id_user.", ".$escaped_nombreusers.", ".$escaped_apellidousers.", ".$escaped_encry_passw.",
                    ".$escaped_identificacion.", ".$escaped_users.", ".$escaped_correo.",".$escaped_area_users.",".$escaped_tipo_users.", ".$escaped_regionusers.", ".$escaped_id_nivel.")";
            $result_sp  = $this->db->pgquery($sql_sp );

            if ($result_sp) {
             // Asumiendo que sp_guardarusuarios aún inserta y no devuelve success/message.
             // Si el SP ahora devuelve success/message, usa la lógica de la Opción 1.
              return ['success' => true, 'message' => 'Usuario guardado exitosamente.'];
            } else {
                return ['success' => false, 'message' => 'Error al ejecutar procedimiento de guardar usuario: '];
            }

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


    public function Editar_Usuario($idusuario_edit,$edit_nombreusers, $edit_apellidousers, $edit_usuario,$identificacion,  $edit_correo,$edit_area_users,$edit_regionusers,$edit_tipo_users,$edit_idnivel,$id_user){
        try {
            $escaped_idusuario_edit = pg_escape_literal($this->db->getConnection(), $idusuario_edit);
            $escaped_edit_nombreusers = pg_escape_literal($this->db->getConnection(), $edit_nombreusers);
            $escaped_edit_apellidousers = pg_escape_literal($this->db->getConnection(), $edit_apellidousers);
            $escaped_edit_usuario = pg_escape_literal($this->db->getConnection(), $edit_usuario);
            $escaped_identificacion = pg_escape_literal($this->db->getConnection(), $identificacion);
            $escaped_edit_correo = pg_escape_literal($this->db->getConnection(), $edit_correo);
            $escaped_edit_area_users = pg_escape_literal($this->db->getConnection(), $edit_area_users);
            $escaped_edit_regionusers = pg_escape_literal($this->db->getConnection(), $edit_regionusers);
            $escaped_edit_tipo_users = pg_escape_literal($this->db->getConnection(), $edit_tipo_users);
            $escaped_edit_idnivel = pg_escape_literal($this->db->getConnection(), $edit_idnivel);
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);

            $sql = "SELECT * FROM sp_editarusuarios(".$escaped_idusuario_edit.", ".$escaped_edit_nombreusers.", ".$escaped_edit_apellidousers.", ".$escaped_edit_usuario.",
                    ".$escaped_identificacion.", ".$escaped_edit_correo.", ".$escaped_edit_area_users.",".$escaped_edit_regionusers.",".$escaped_edit_tipo_users.", ".$escaped_edit_idnivel.",".$escaped_id_user.")";
            //echo $sql;
            $result = Model::getResult($sql, $this->db);
            return $result;

               } catch (Throwable $e) {
        } 
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

    /*public function UpdateSession($id_user,  $session_id){
        try{
            $sql = "UPDATE sessions_users SET end_date = NOW(), active = 0 WHERE id_user = ".$id_user." AND id_session = '". $session_id."';";
            //var_dump($sql);
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }*/

    /*public function GetExpiredSessions($usuario_id, $ahora) {
        try {
            $sql = "SELECT id_session FROM sessions_users WHERE id_user = ".$usuario_id." AND active = 1 AND expiry_time <= '".$ahora."';";
            //var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }*/

   /*public function UpdateSessionExpired($id_session) {
        try {
            $sql = "UPDATE sessions_users SET active = 0, end_date = NOW() WHERE id_session = '".$id_session."';";
            //var_dump($sql);
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }*/

    public function getUserPermission($userId, $viewName) {
        try {
            $escapedUserId = pg_escape_literal($this->db->getConnection(), $userId);
            $escapedViewName = pg_escape_literal($this->db->getConnection(), $viewName);

            $sql = "SELECT getuserpermissionfunction(" . $escapedUserId . ", " . $escapedViewName . ")";
            $result = Model::getResult($sql, $this->db); // Obtienes el array de getResult
            return $result; // Devuelve el resultado completo
            
        } catch (Throwable $e) {
            error_log("Error al obtener permisos del usuario: " . $e->getMessage());
            return ['success' => false, 'error' => 'Error al obtener permisos'];
        }
    }

    public function getModuloUsers($id_usuario){
        try{
            $escaped_id_usuario = pg_escape_literal($this->db->getConnection(), $id_usuario); 

            $sql = "SELECT * FROM sp_vermoduloactivo(".$escaped_id_usuario.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }   
    public function checkUserStatus($id_user){
        try{
            $sql = "SELECT id_user, id_status FROM check_user_status(".$id_user.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function AsignacionModulo($id_modulo, $id_usuario, $idcheck_value){
        try{

            $escaped_id_modulo = pg_escape_literal($this->db->getConnection(), $id_modulo); 
            $escaped_id_usuario = pg_escape_literal($this->db->getConnection(), $id_usuario); 
            $escaped_idcheck_value = pg_escape_literal($this->db->getConnection(), $idcheck_value); 

            $sql = "SELECT * FROM sp_asignacionmodulo(".$escaped_id_modulo.", " . $escaped_id_usuario . "," . $escaped_idcheck_value . ")";
            //echo $sql;
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
        // Handle exception
        }
    }  


    //     public function VerificaUsuario($users){
    //     try {
            
    //         $escaped_users = pg_escape_literal($this->db->getConnection(), $users);

            
    //          $sql_check_user = "SELECT * FROM sp_verificarusuariorep(".$escaped_users.")";
    //             $result_check_user = $this->db->pgquery($sql_check_user);

    //             if (!$result_check_user) {
    //                 throw new Exception("Error al verificar usuario existente: " . pg_last_error($this->db->pgquery($sql_check_user)));
    //             }
    //             $row_check_user = pg_fetch_row($result_check_user);
    //             if ($row_check_user[0] > 0) {
    //                 return ['success' => false, 'message' => 'El nombre de usuario "' . $users . '" ya está registrado.'];
    //     }

    //     } catch (Throwable $e) {
    //         error_log("Error al obtener permisos del usuario: " . $e->getMessage());
    //         return ['success' => false, 'error' => 'Error al obtener permisos'];
    //     }
    // } 

    // public function VerificaUsuario($users){
    //     try {
    //         $conn = $this->db->getConnection(); // Obtener la conexión
    //         $escaped_users = pg_escape_literal($conn, $users);

    //         // Ojo: Si sp_verificarusuariorep devuelve COUNT(*), entonces es mejor usar fetch_result
    //         // Si sp_verificarusuariorep ya devuelve un BOOLEAN (TRUE si existe, FALSE si no), entonces usa esa lógica.
    //         // Asumiendo que sp_verificarusuariorep devuelve un COUNT(*):
    //         $sql_check_user = "SELECT * FROM sp_verificarusuariorep(".$escaped_users.")";
    //         $result_check_user_query = $this->db->pgquery($sql_check_user); // Renombrado para claridad

    //         if (!$result_check_user_query) {
    //             // Manejar error en la consulta
    //             error_log("Error al ejecutar sp_verificarusuariorep: " . pg_last_error($conn));
    //             // Devolvemos un array de error consistente
    //             return ['status' => 'error', 'message' => 'Error interno al verificar usuario.'];
    //         }

    //         // Asumimos que sp_verificarusuariorep devuelve una única fila con un único valor (el COUNT)
    //         $count = pg_fetch_result($result_check_user_query, 0, 0);

    //         if ($count > 0) {
    //             // El usuario existe
    //             return ['status' => 'exists', 'message' => 'El nombre de usuario "' . $users . '" ya está registrado.'];
    //         } else {
    //             // El usuario NO existe
    //             return ['status' => 'available', 'message' => 'Nombre de usuario disponible.'];
    //         }

    //     } catch (Throwable $e) {
    //         error_log("Error en VerificaUsuario: " . $e->getMessage());
    //         return ['status' => 'error', 'message' => 'Error fatal al verificar usuario: ' . $e->getMessage()];
    //     }
    // }


public function VerificaUsuario($nombre, $apellido){ // Ahora recibe nombre y apellido
    try {
        $conn = $this->db->getConnection();
        $escaped_nombre = pg_escape_literal($conn, $nombre);
        $escaped_apellido = pg_escape_literal($conn, $apellido);

        // Llama al SP que ahora devuelve la sugerencia usando nombre y apellido
        $sql_check_user = "SELECT available, suggested_username, message FROM sp_verificarusuariorepetidoo(".$escaped_nombre.", ".$escaped_apellido.")";
        $result_check_user_query = $this->db->pgquery($sql_check_user);

        if (!$result_check_user_query) {
            error_log("Error al ejecutar sp_verificarusuariorepetidoo: " . pg_last_error($conn));
            return ['status' => 'error', 'message' => 'Error interno al verificar usuario.', 'suggested_username' => null];
        }

        $row = pg_fetch_assoc($result_check_user_query);
        //var_dump($row);
        if ($row) {
            return [
                'status' => ($row['available'] === 't' ? 'available' : 'exists'),
                'message' => $row['message'],
                'suggested_username' => $row['suggested_username']
            ];
        } else {
            return ['status' => 'error', 'message' => 'El SP no devolvió un resultado válido.', 'suggested_username' => null];
        }

    } catch (Throwable $e) {
        error_log("Error en VerificaUsuario: " . $e->getMessage());
        return ['status' => 'error', 'message' => 'Error fatal al verificar usuario: ' . $e->getMessage(), 'suggested_username' => null];
    }
}


    public function UpdateUserStatus($id_user, $contrase){
        try{
            $sql = "SELECT * FROM update_user_status(".$id_user.", '".$contrase."');";
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getEmailByUsername($username) {
        try {
            $escaped_username = pg_escape_literal($this->db->getConnection(), $username);
            $sql = "SELECT email FROM users WHERE username = ".$escaped_username.";";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function InvalidateAllSessionsForUser($userId) {
        try {
            $sql = "UPDATE sessions_users 
                    SET active = 0, end_date = NOW() 
                    WHERE id_user = " . (int)$userId . " AND active = 1";
            
            //var_dump($sql); // Para depuración
            $result = $this->db->pgquery($sql);
            return $result; // Devuelve true en éxito, false en fallo
        } catch (Throwable $e) {
            error_log("Error en Model::InvalidateAllSessionsForUser: " . $e->getMessage());
            return false;
        }
    }
}   
?>