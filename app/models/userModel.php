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
            $sql = "SELECT * FROM sp_verregionusers() where idreg!='8'";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    //CON ESTA SOLO OBTIENES EL NOMBRE DE LA REGION DEL USUARIO
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
    //

    public function getUserRol($id_user){
        try{
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $sql = "SELECT * FROM getrolUser(".$escaped_id_user.")";
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

            $sql = "SELECT * FROM sp_vermodulos_activos(".$escaped_id_usuario.")";
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
            error_log("Error en getEmailByUsername: " . $e->getMessage());
            return null; // Devolver null en caso de error
        }
    }

    public function AsignacionModulo($id_modulo, $id_usuario, $idcheck_value){
        try{

            $escaped_id_modulo = pg_escape_literal($this->db->getConnection(), $id_modulo); 
            $escaped_id_usuario = pg_escape_literal($this->db->getConnection(), $id_usuario); 
            $escaped_idcheck_value = pg_escape_literal($this->db->getConnection(), $idcheck_value); 

            $sql = "SELECT * FROM sp_asignacionmodulo(".$escaped_id_modulo.", " . $escaped_id_usuario . "," . $escaped_idcheck_value . ")";
           // echo $sql;
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
        // Handle exception
        }
    }  


    public function AsignacionSubModulo($id_modulo,$id_submodulo, $id_usuario, $idchecksub_value){
        try{

            $escaped_id_modulo = pg_escape_literal($this->db->getConnection(), $id_modulo); 
            $escaped_id_submodulo = pg_escape_literal($this->db->getConnection(), $id_submodulo); 
            $escaped_id_usuario = pg_escape_literal($this->db->getConnection(), $id_usuario); 
            $escaped_id_checksub = pg_escape_literal($this->db->getConnection(), $idchecksub_value); 

            $sql = "SELECT * FROM sp_asignacionsubmodulos(".$escaped_id_modulo."," . $escaped_id_submodulo . ", " . $escaped_id_usuario . "," . $escaped_id_checksub . ")";
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
            // Loguear el error para depuración
            error_log("Error en getEmailByUsername: " . $e->getMessage());
            return null; // Devolver null en caso de error
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

    // En tu Model (ej. UserModel.php o SessionModel.php)

    public function IsSessionActuallyActive($sessionId, $userId) {
        try {
            // Asegúrate de que los valores se escapen correctamente si no usas prepared statements
            // Para strings como el session_id, es CRÍTICO escaparlos para prevenir inyección SQL.
            // Asumo que tu $this->db->pgquery() hace esto internamente o tienes una función de escape.
            // Si no, DEBES agregar un escape_string o similar aquí.
            $escapedSessionId = pg_escape_string($this->db->getConnection(), $sessionId); // Asumiendo que getConnection() devuelve la conexión PG
            $escapedUserId = (int)$userId; // Castear a int es una buena forma de sanitizar IDs numéricos

            $sql = "SELECT active FROM sessions_users 
                    WHERE id_session = '" . $escapedSessionId . "' 
                    AND id_user = " . $escapedUserId . " 
                    AND active = 1";
            
            // var_dump($sql); // Para depuración, puedes descomentar temporalmente

            $result = $this->db->pgquery($sql);
            
            // pgquery devuelve un recurso de resultado, no un array directamente.
            // Necesitas verificar si hay filas y luego obtener los datos.
            if ($result && pg_num_rows($result) > 0) {
                $row = pg_fetch_assoc($result);
                return $row['active'] == 1; // Debería ser 1 si se encontró la fila
            }
            
            return false; // Si no hay resultado, o no hay filas, no está activa
        } catch (Throwable $e) {
            // Registra cualquier error que ocurra durante la ejecución de la consulta
            error_log("Error en Model::IsSessionActuallyActive: " . $e->getMessage());
            return false;
        }
    }

    public function GetTechniciansAndCurrentTicketTechnician($id_ticket){
        try {
            $sql = "SELECT * FROM get_tecnico_asignacion(".$id_ticket.");";
            //var_dump($sql); // Para depuración
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }


    public function ReassignTicket($id_ticket, $id_technician, $id_user, $comment) {
        try {
            // --- PASO 0: Sanitizar/Escapar todas las entradas del usuario ---
            // ¡MUY IMPORTANTE PARA PREVENIR INYECCIÓN SQL!
            // Reemplaza pg_escape_literal($this->db->getConnection(), ...) con tu método de sanitización real.
            // Si usas PDO, deberías usar prepared statements, lo cual es más seguro.
            $safe_id_ticket = pg_escape_literal($this->db->getConnection(), $id_ticket);
            $safe_id_technician = pg_escape_literal($this->db->getConnection(), $id_technician);
            $safe_id_user = pg_escape_literal($this->db->getConnection(), $id_user);

            // --- PASO 1: Obtener datos del ticket existente para mantenerlos ---
            // Usamos el ID del ticket sanitizado
            $data_sql = "SELECT id_ticket, date_sendcoordinator, id_department, date_create_ticket, date_end_ticket, id_tecnico_n1,  id_coordinador FROM users_tickets WHERE id_ticket = " . $safe_id_ticket . ";";
            $result_select_initial = Model::getResult($data_sql, $this->db); // Usando tu método Model::getResult

            $existing_data = null;
            if ($result_select_initial && $result_select_initial['numRows'] > 0) {
                $existing_data = pg_fetch_assoc($result_select_initial['query'], 0);
            }

            if (!$existing_data) {
                return ['success' => false, 'message' => 'Ticket no encontrado para reasignación.'];
            }
            
            // --- NUEVO PASO: Actualizar id_accion_ticket en la tabla 'tickets' ---
            // El id_accion_ticket para "Reasignado al Técnico" es 11
            $new_accion_ticket_id = 11; 
            $new_status_ticket_id = 2; // Asumiendo que "En Proceso" es el id_status_ticket 2

            // Construimos la consulta UPDATE usando el ID del ticket sanitizado
            $sql_update_ticket = "UPDATE public.tickets SET id_accion_ticket = " . (int)$new_accion_ticket_id . " WHERE id_ticket = " . $safe_id_ticket . ";";
            
            // Ejecutamos la consulta UPDATE
            $result_update_ticket = $this->db->pgquery($sql_update_ticket);

            if (!$result_update_ticket) {
                // Si el UPDATE falla, registramos el error y retornamos un mensaje de fallo.
                error_log("Error al ejecutar UPDATE en public.tickets: " . pg_last_error($this->db->getConnection()));
                return ['success' => false, 'message' => 'Error al actualizar el estado y acción del ticket principal.'];
            }

            // Preparar valores para el INSERT en users_tickets, manejando NULLs y comillas
            // Los valores se asumen seguros si provienen de $existing_data que fue de la DB
            // y se vuelven a escapar si son strings para el INSERT.
            $date_sendcoordinator = $existing_data['date_sendcoordinator'] ?? 'NULL';
            $id_coordinator = $existing_data['id_coordinador'] ?? 'NULL'; // Numérico, no necesita comillas
            $date_create_ticket = $existing_data['date_create_ticket'] ?? 'NULL';
            $date_end_ticket = $existing_data['date_end_ticket'] ? "'" . pg_escape_literal($this->db->getConnection(), $existing_data['date_end_ticket']) . "'" : 'NULL';
            $id_tecnico_n1 = $existing_data['id_tecnico_n1'] ?? 'NULL'; // Numérico, no necesita comillas
            $id_department = $existing_data['id_department'] ?? 'NULL';

            // --- PASO 2: Realizar el INSERT en users_tickets ---
            // Usamos los IDs sanitizados
            $sql_insert_ticket = "INSERT INTO public.users_tickets
            (id_ticket, date_sendcoordinator, id_department,  id_coordinador, date_assign_tec2, id_tecnico_n2, date_create_ticket, date_end_ticket, id_tecnico_n1, commentchangetec)
            VALUES (
                " . $safe_id_ticket . ", 
                '" . $date_sendcoordinator . "', 
                " . $id_coordinator . ",
                ". $id_department.",
                NOW(), 
                " . $safe_id_technician . ", 
                '" . $date_create_ticket . "', 
                " . $date_end_ticket . ", 
                " . $id_tecnico_n1 . ",
                '".$comment."');";
            
            $result_insert_ticket = $this->db->pgquery($sql_insert_ticket);

            if (!$result_insert_ticket) {
                error_log("Error al ejecutar INSERT en users_tickets: " . pg_last_error($this->db->getConnection()));
                return ['success' => false, 'message' => 'Error al insertar el registro de reasignación en la tabla principal (users_tickets).'];
            }

            // --- PASO 3: Obtener y preparar datos para el Historial ---
            // Los valores de id_status_ticket e id_accion_ticket para el historial son los que acabamos de establecer
            $id_status_ticket_history = $new_status_ticket_id; // 2: En Proceso
            $id_accion_ticket_history = $new_accion_ticket_id; // 11: Reasignado al Tecnico

            // Obtener el estado actual de lab, payment, domiciliacion del ticket
            // Usamos el ID del ticket sanitizado en estas consultas.
            $id_new_status_lab = 'NULL'; 
            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . $safe_id_ticket . ";";
            $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);
            if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                $status_lab_data = pg_fetch_assoc($status_lab_result, 0);
                $id_new_status_lab = $status_lab_data['id_status_lab'] !== null ? (int)$status_lab_data['id_status_lab'] : 'NULL';
            }

            $id_new_status_payment = 'NULL'; 
            $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $safe_id_ticket . ";";
            $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
            if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                $status_payment_data = pg_fetch_assoc($status_payment_status_result, 0);
                $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
            }

            $new_status_domiciliacion = 'NULL'; 
            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $safe_id_ticket . ";";
            $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
            if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
            }

            // --- PASO 4: Llamar a la función de historial con sprintf ---
            // Usamos los IDs sanitizados y los valores de status/accion para el historial
             $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$safe_id_ticket};";
                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);
                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
                        $row_coordinador = pg_fetch_assoc($resultcoordinador);
                        $id_coordinador = (int) $row_coordinador['id_coordinador'];
                        pg_free_result($resultcoordinador);
                    }else{ 
                        $id_coordinador = null;
                    }

            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",
                (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea
                (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                (int)$id_status_ticket_history, // Usamos la acción específica para el historial
                (int)$id_accion_ticket_history, // Usamos la acción específica para el historial
                $id_new_status_lab,
                $id_new_status_payment,
                $new_status_domiciliacion,
                $id_coordinador
            );
            
            $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);

            if (!$resultsqlInsertHistory) {
                error_log("Advertencia: Error al registrar en el historial del ticket: " . pg_last_error($this->db->getConnection()));
                return ['success' => false, 'message' => 'Error al registrar el cambio en el historial del ticket.'];
            }

            // Si todo fue exitoso
            return ['success' => true, 'message' => 'Ticket reasignado exitosamente.'];

        } catch (Throwable $e) {
            error_log("Excepción en ReassignTicket: " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
            return ['success' => false, 'message' => 'Error interno del servidor al procesar la reasignación: ' . $e->getMessage()];
        }
    }

    public function UpdateSessionExpiry($session_id, $new_expiry_time, $id_user) {
        $sql = "UPDATE public.sessions_users
                SET expiry_time = '".$new_expiry_time."'
                WHERE id_session = '".$session_id."'
                AND id_user = '".$id_user."'
                AND active = 1";
         $result = $this->db->pgquery($sql);
    return $result; // usa tu método de ejecución preferido
}

}   
?>