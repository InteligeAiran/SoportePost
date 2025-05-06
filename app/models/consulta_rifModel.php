<?php
require_once __DIR__ . "/../../libs/Model.php";
require_once __DIR__ . "/../../libs/session.php";

class consulta_rifModel extends Model
{

    public $db;
    

    public function __construct()
    {
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database); // Ensure getInstance() returns a PgSql\Connection
    }

    public function SearchRif($rif)
    {
        try {
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM public.getdataclientbyrif(".$escaped_rif.");";     
            $result = $this->getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function SearchSerial($serial)
    {
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM SearchSerial(".$escaped_serial.");";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
    
    public function GetInstallDate(){
        try{
            $sql = "SELECT * FROM GetInstallDate();";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        } 
    }

    public function VerifingClient($rif){
        try {
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM VerifingClient(".$escaped_rif.");";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetPosSerialsByRif($rif){
        try {
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM GetPosSerialsByRif(".$escaped_rif.");";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function SearchtypePos($serial){
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM SearchtypePos(".$escaped_serial.");";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function VerifingBranches($rif){
        try {
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM VerifingBranches(".$escaped_rif.")';";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetRegionFromState($id_state){
        try{
          $escaped_id_state = pg_escape_literal($this->db->getConnection(), $id_state); // Assuming '$this->db' is now a valid PgSql\Connection
          $sql = "SELECT * FROM GetStateRegionById(".$escaped_id_state.");";
          $result = Model::getResult($sql, $this->db);
          $this->db->closeConnection(); // Close the connection if needed
          return $result;
        } catch (Throwable $e) {
          // Handle exception
        }
    }

    public function SaveDataFalla($serial, $falla, $nivelFalla, $id_user){
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial); // Assuming '$this->db' is now a valid PgSql\Connection
            $escaped_falla = pg_escape_literal($this->db->getConnection(), $falla); 
            $escaped_nivelFalla = pg_escape_literal($this->db->getConnection(), $nivelFalla);
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $sql = "SELECT SaveDataFalla(".$escaped_serial.", ".$escaped_falla.", ".$escaped_nivelFalla.", ".$escaped_id_user.");";
            $sql.= "SELECT InsertTicketFailure(".$escaped_falla.");";
            $result = $this->db->pgquery($sql);
            $this->db->closeConnection(); // Close the connection if needed
             return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    /*public function SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaBaseDatos, $id_status_payment,  $rutaExo, $rutaAnticipo, $id_user){
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $escaped_descripcion = pg_escape_literal($this->db->getConnection(), $descripcion);
            $escaped_nivelFalla = pg_escape_literal($this->db->getConnection(), $nivelFalla);
            $escaped_id_status_payment = pg_escape_literal($this->db->getConnection(), $id_status_payment);
            $escaped_coordinador = pg_escape_literal($this->db->getConnection(), $coordinador);
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
    
            $sql = "SELECT * FROM save_data_failures2(".$escaped_serial."::TEXT, ".$escaped_descripcion."::INTEGER, ".$escaped_nivelFalla."::INTEGER,
                    ".$escaped_id_status_payment."::INTEGER, ".$escaped_coordinador."::INTEGER, ".$escaped_id_user."::INTEGER, '".$rutaBaseDatos."'::TEXT,
                    '".$rutaExo."'::TEXT, '".$rutaAnticipo."'::TEXT)";
            $result = $this->db->pgquery($sql);
            //var_dump($sql);

            if($result){
                $sqlFailure = "SELECT InsertTicketFailure(".$escaped_descripcion.");";
                $resultFailure = $this->db->pgquery($sqlFailure);
                // Puedes devolver ambos resultados si es necesario
                return array('save_result' => $result, 'failure_result' => $resultFailure);
            } else {
                return $result;
            }
        } catch (Throwable $e) {
                // Handle exception
        }
    }*/

    public function SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaBaseDatos, $id_status_payment, $rutaExo, $rutaAnticipo, $id_user, $mimeTypeExo = null, $mimeTypeAnticipo = null, $mimeTypeEnvio = null){
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $escaped_descripcion = pg_escape_literal($this->db->getConnection(), $descripcion);
            $escaped_nivelFalla = pg_escape_literal($this->db->getConnection(), $nivelFalla);
            $escaped_id_status_payment = pg_escape_literal($this->db->getConnection(), $id_status_payment);
            $escaped_coordinador = pg_escape_literal($this->db->getConnection(), $coordinador);
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
    
            $escaped_mimeTypeExo = null;
            if ($mimeTypeExo !== null) {
                $escaped_mimeTypeExo = pg_escape_literal($this->db->getConnection(), $mimeTypeExo);
            }
    
            $escaped_mimeTypeAnticipo = null;
            if ($mimeTypeAnticipo !== null) {
                $escaped_mimeTypeAnticipo = pg_escape_literal($this->db->getConnection(), $mimeTypeAnticipo);
            }
    
            $escaped_mimeTypeEnvio = null;
            if ($mimeTypeEnvio !== null) {
                $escaped_mimeTypeEnvio = pg_escape_literal($this->db->getConnection(), $mimeTypeEnvio);
            }
    
            $sql = "SELECT * FROM save_data_failures2(".$escaped_serial."::TEXT, ".$escaped_descripcion."::INTEGER, ".$escaped_nivelFalla."::INTEGER,
                    ".$escaped_id_status_payment."::INTEGER, ".$escaped_coordinador."::INTEGER, ".$escaped_id_user."::INTEGER, '".$rutaBaseDatos."'::TEXT,
                    '".($rutaExo ?? '')."'::TEXT, '".($rutaAnticipo ?? '')."'::TEXT, ".($escaped_mimeTypeExo !== null ? $escaped_mimeTypeExo."::TEXT" : 'NULL').", ".($escaped_mimeTypeAnticipo !== null ? $escaped_mimeTypeAnticipo."::TEXT" : 'NULL').", ".($escaped_mimeTypeEnvio !== null ? $escaped_mimeTypeEnvio."::TEXT" : 'NULL').")";
            $result = $this->db->pgquery($sql);
            //var_dump($sql);
    
            if($result){
                $sqlFailure = "SELECT InsertTicketFailure(".$escaped_descripcion.");";
                $resultFailure = $this->db->pgquery($sqlFailure);
                return array('save_result' => $result, 'failure_result' => $resultFailure);
            } else {
                return $result;
            }
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

    public function UltimateDateTicket($serial){
        try{
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $sql = "SELECT * FROM Get_last_date_ticket(".$escaped_serial.")";
                    //var_dump($sql);
                    $result = Model::getResult($sql, $this->db);
                    return $result;
        } catch (Throwable $e) {
                    // Manejar excepciones
        }
    }

    public function InstallDatePOS($serial){
        try{
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $sql = "SELECT * FROM Get_install_day_pos(".$escaped_serial.")";
                    //var_dump($sql);
                    $result = Model::getResult($sql, $this->db);
                    return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetFailure1(){
        try{
            $sql = "SELECT * FROM Get_Failures_level_1()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetFailure2(){
        try{
            $sql = "SELECT * FROM Get_Failures_level_2()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetCoordinator(){
        try{
            $sql = "SELECT * FROM get_data_coordinator()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
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