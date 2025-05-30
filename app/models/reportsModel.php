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

    public function GetDomiciliacionTickets($id_user){
        try{
            $sql = "SELECT * FROM get_tickets_domiciliacion(".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketabiertoCount(){
        try{
            $sql = "SELECT COUNT(*) as total_tickets_abiertos FROM tickets WHERE id_status_ticket = 1;";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketsResueltosCount(){
        try{
            $sql = "SELECT COUNT(*) as total_tickets_resuelto FROM tickets WHERE id_status_ticket = 3;";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketsTotalCount(){
        try{
            $sql = "SELECT COUNT(*) as total_tickets_general FROM tickets";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketCountsForPercentage() {
        try {
            // Tickets abiertos de hoy
            $sqlToday = "SELECT get_total_open_tickets_for_date(CURRENT_DATE) as total_tickets_today;";
            $resultToday = Model::getResult($sqlToday, $this->db);
            $ticketsToday = $resultToday['row']['total_tickets_today']; // Esto te dará el valor que esperas

            // Tickets abiertos de ayer usando la nueva función SQL
            $sqlYesterday = "SELECT get_total_open_tickets_yesterday() as total_tickets_yesterday;";
            $resultYesterday = Model::getResult($sqlYesterday, $this->db);
            $ticketsYesterday = $resultYesterday['row']['total_tickets_yesterday'];

            return [
                'today' => $ticketsToday,
                'yesterday' => $ticketsYesterday
            ];
        } catch (Throwable $e) {
            // Manejar la excepción, loguear o devolver un valor por defecto.
            error_log("Error in getTicketCountsForPercentage: " . $e->getMessage());
            return ['today' => 0, 'yesterday' => 0];
        }
    }

    public function getTicketsResueltosCountsForPercentage() {
        try {
            // Tickets resueltos de hoy (id_status_ticket = 3)
            $sqlToday = "SELECT get_total_resolve_tickets_for_date(CURRENT_DATE) as total_tickets_today;";
            $resultToday = Model::getResult($sqlToday, $this->db);
            $ticketsToday = $resultToday['row']['total_tickets_today'];

            // Tickets resueltos de ayer (id_status_ticket = 3)
            $sqlYesterday = "SELECT get_total_resolve_tickets_yesterday() as total_tickets_yesterday;  -- Nueva función para obtener tickets resueltos de ayer.";
            $resultYesterday = Model::getResult($sqlYesterday, $this->db);
            $ticketsYesterday = $resultYesterday['row']['total_tickets_yesterday'];

            return [
                'today' => $ticketsToday,
                'yesterday' => $ticketsYesterday
            ];
        } catch (Throwable $e) {
            error_log("Error in getTicketsResueltosCountsForPercentage: " . $e->getMessage());
            return ['today' => 0, 'yesterday' => 0];
        }
    }

    public function getTotalTicketsCountsForPercentage() {
        try {
            // Total de tickets creados hoy
            $sqlToday = "SELECT get_total_tickets_for_date(CURRENT_DATE) as total_tickets_today;";
            $resultToday = Model::getResult($sqlToday, $this->db);
            $ticketsToday = $resultToday['row']['total_tickets_today'];

            // Total de tickets creados ayer
            $sqlYesterday = "SELECT get_total_tickets_yesterday() as total_tickets_yesterday;";
            $resultYesterday = Model::getResult($sqlYesterday, $this->db);
            $ticketsYesterday = $resultYesterday['row']['total_tickets_yesterday'];

            return [
                'today' => $ticketsToday,
                'yesterday' => $ticketsYesterday
            ];
        } catch (Throwable $e) {
            error_log("Error in getTotalTicketsCountsForPercentage: " . $e->getMessage());
            return ['today' => 0, 'yesterday' => 0];
        }
    }
    
}
?>