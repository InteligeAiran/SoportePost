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

    public function GetTicketsByRif($rif){
        try {
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM getticketsbyrif('%" . substr($escaped_rif, 1, -1) . "%')";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }


    public function SearchSerial($serial){
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM GetTicketsBySearchSerial('%" . substr($escaped_serial, 1, -1) . "%')";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function SearchRangeData($ini_date, $end_date){
        try {
            $escaped_ini_date = pg_escape_literal($this->db->getConnection(), $ini_date);
            $escaped_end_date = pg_escape_literal($this->db->getConnection(), $end_date);
            $sql = "SELECT * FROM getticketsbysearchrangedate(".$escaped_ini_date.", ".$escaped_end_date.")";
            //echo $sql;
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetDomiciliacionTickets($id_user){
        try{
            $sql = "SELECT * FROM  get_tickets_domiciliacion(".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketabiertoCount(){
        try{
            $sql = "SELECT * FROM get_total_open_tickets();";
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
            $sql = "SELECT * FROM get_total_tickets()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketCountsForPercentage() {
        try {
            // Tickets abiertos de hoy
            $sqlToday = "SELECT * FROM get_percentage_open_tickets()";
            $resultToday = Model::getResult($sqlToday, $this->db);
            return $resultToday;
        } catch (Throwable $e) {
            // Manejar la excepción, loguear o devolver un valor por defecto.
            error_log("Error in getTicketCountsForPercentage: " . $e->getMessage());
        }
    }

    public function getTicketsResueltosCountsForPercentage() {
        try {
            // Tickets resueltos de hoy (id_status_ticket = 3)
            $sqlToday = "SELECT * FROM get_percentage_resolved_tickets();";
            $resultToday = Model::getResult($sqlToday, $this->db);
            return $resultToday;
        } catch (Throwable $e) {
            error_log("Error in getTicketsResueltosCountsForPercentage: " . $e->getMessage());
        }
    }

    public function GetDataTicketFinal(){
        try{
            $sql = "SELECT * FROM GetDataTicketFinal()";
            //var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
    
    public function saveDocument($id_ticket, $originalDocumentName, $documentSize, $mimeTypeFromFrontend, $relativePathForDb){
        try{
            $sql = "INSERT INTO archivos_adjuntos_prueba (ticket_id, original_filename, file_path, mime_type, file_size_bytes, uploaded_by_user_id) values (".$id_ticket.", '".$originalDocumentName."', '".$relativePathForDb."',  '".$mimeTypeFromFrontend."', '".$documentSize."', 1)";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getDocument($id_ticket){
        try{
            $sql = "SELECT file_path, mime_type FROM archivos_adjuntos_prueba WHERE ticket_id = (".$id_ticket.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetMonthlyTicketDetails(){
        try {
            $sql = "SELECT * FROM get_monthly_ticket_details()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetIndividualTicketDetailsByRegion($id_region){
        try {
            $escaped_id_region = pg_escape_literal($this->db->getConnection(), $id_region);
            $sql = "SELECT * FROM get_individual_ticket_details_by_region(".$escaped_id_region.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetIndividualTicketDetails($month, $status){
        try {
            $escaped_month = pg_escape_literal($this->db->getConnection(), $month);
            $escaped_status = pg_escape_literal($this->db->getConnection(), $status);
            $sql = "SELECT * FROM get_individual_ticket_details(".$escaped_status.", ".$escaped_month.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetMonthlyCreatedTicketsForChart(){
        try {
            $sql = "SELECT * FROM get_monthly_created_tickets_for_chart()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetMonthlyTicketPercentageChange(){
        try {
            $sql = "SELECT * FROM get_latest_monthly_ticket_percentage_change()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetMonthlyCreatedTicketsForChartForState(){
        try {
            $sql = "SELECT * FROM GetTicketsByRegion()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetRegionsTicketDetails(){
        try {
            $sql = "SELECT * FROM GetTicketsByRegion()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsSendTallerTotalCount(){
        try {
            $sql = "SELECT * FROM get_total_tickets_lab();";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTotalTicketsPercentageSendToTaller(){
        try {
            $sql = "SELECT * FROM get_percentage_tickets_in_lab_of_total();";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketOpenDetails(){
        try {
            $sql = "SELECT * FROM get_individual_open_tickets_details()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetResolveTicketsForCard(){
        try {
            $sql = "SELECT * FROM get_individual_resolve_tickets_for_card()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTotalTicketsInProcess(){
        try {
            $sql = "SELECT * FROM get_total_in_processtickets()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTallerTicketsForCard(){
        try {
            $sql = "SELECT * FROM get_individual_taller_tickets_for_card()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsPendienteReparacion(){
        try {
            $sql = "SELECT * FROM get_individual_tickets_in_PendienteReparacion()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsProcessReparacionCount(){
        try {
            $sql = "SELECT * FROM get_total_proceso_reparacion()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsReparadosCount(){
        try {
            $sql = "SELECT * FROM get_total_reparados()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function handleGetTicketsPendienteReparacion(){
        try {
            $sql = "SELECT * FROM get_individual_tickets_reparados()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsPendientesPorRepuestos(){
        try {
            $sql = "SELECT * FROM get_individual_tickets_pendientes_por_repuestos()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketPendienteRepuestoCount(){
        try {
            $sql = "SELECT * FROM get_total_pendiente_repuesto()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketIrreparablesCount(){
        try {
            $sql = "SELECT * FROM get_total_irreparable()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsIrreparables(){
        try {
            $sql = "SELECT * FROM get_individual_tickets_irreparables()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTotalTicketsPercentageInProcess(){
        try {
            $sql = "SELECT * FROM get_percentage_in_process_tickets()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsInProcess(){
        try {
            $sql = "SELECT * FROM get_individual_tickets_in_procesos()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketTimeline($id_ticket){
        try {
            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $id_ticket);
            $sql = "SELECT * FROM get_ticket_timeline(".$escaped_id_ticket.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
}
?>

