<?php
require_once __DIR__ . "/../../libs/Model.php";
require_once __DIR__ . "/../../libs/session.php";

class reportsModel extends Model
{

    public $db;
    

    public function __construct()
    {
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database); // Ensure getInstance() returns a PgSql\Connection
    }

    public function GetTicketsByRegion($id_region)
    {
        try {
            $escaped_id_region = pg_escape_literal($this->db->getConnection(), $id_region); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM public.GetTicketsByRegion(".$escaped_id_region.");";  
            //var_dump($sql);
   
            $result = $this->getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
}
?>