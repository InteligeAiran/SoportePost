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
    
    public function saveDocument(
        $nro_ticket,
        $originalDocumentName,
        $stored_filename,
        $filePathForDatabase,
        $mimeTypeFromFrontend,
        $documentSize,
        $id_user,
        $document_type
    ){
        try {
            $escapedOriginalFilename = pg_escape_literal($this->db->getConnection(), $originalDocumentName);
            $escapedStoredFilename = pg_escape_literal($this->db->getConnection(), $stored_filename);
            $escapedFilePath = pg_escape_literal($this->db->getConnection(), $filePathForDatabase);
            $escapedMimeType = pg_escape_literal($this->db->getConnection(), $mimeTypeFromFrontend);
            $escapedDocumentType = pg_escape_literal($this->db->getConnection(), $document_type);

            $sql = "SELECT save_document_to_db(
                " . ((int) $nro_ticket) . ",
                " . $escapedOriginalFilename . ",
                " . $escapedStoredFilename . ",
                " . $escapedFilePath . ",
                " . $escapedMimeType . ",
                " . ((int) $documentSize) . ",
                " . ((int) $id_user) . ",
                " . $escapedDocumentType . ",
            )";
            
            $result = Model::getResult($sql, $this->db);

            if ($result && isset($result['query'])) {
                return pg_fetch_result($result['query'], 0, 0) === 't';
            } else {
                error_log("Error: La consulta SQL no devolvió un resultado válido.");
                return false;
            }

        } catch (Throwable $e) {
            error_log("Error al llamar a la función SQL 'save_document_to_db': " . $e->getMessage());
            return false;
        }
    }

    public function saveDocument1(
        $nro_ticket,
        $originalDocumentName,
        $stored_filename,
        $filePathForDatabase,
        $mimeTypeFromFrontend,
        $documentSize,
        $id_user,
        $document_type,
        $id_ticket
    ){
        try {
            $db_conn = $this->db->getConnection();

            $escapedOriginalFilename = pg_escape_literal($this->db->getConnection(), $originalDocumentName);
            $escapedStoredFilename = pg_escape_literal($this->db->getConnection(), $stored_filename);
            $escapedFilePath = pg_escape_literal($this->db->getConnection(), $filePathForDatabase);
            $escapedMimeType = pg_escape_literal($this->db->getConnection(), $mimeTypeFromFrontend);
            $escapedDocumentType = pg_escape_literal($this->db->getConnection(), $document_type);

            $sql = "SELECT save_document_to_db(
                " . ((int) $nro_ticket) . ",
                " . $escapedOriginalFilename . ",
                " . $escapedStoredFilename . ",
                " . $escapedFilePath . ",
                " . $escapedMimeType . ",
                " . ((int) $documentSize) . ",
                " . ((int) $id_user) . ",
                " . $escapedDocumentType . "
            )";
            
            $result = Model::getResult($sql, $this->db);

            if($result){

                if($document_type === 'Exoneracion'){
                    $id_status_payment = 5;
                }else{
                    $id_status_payment = 7;
                }

                $sql1 = "UPDATE tickets SET id_status_payment = ".$id_status_payment." WHERE id_ticket = ".(int)$id_ticket.";";
                $result1 = Model::getResult($sql1, $this->db);

                if($result1){
                       $id_status_lab = 0;
                $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". (int)$id_ticket. ";";
                $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                    $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab')?? 0;
                }

                $new_status_domiciliacion = 'NULL';
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = ". (int)$id_ticket. ";";
                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);

                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $new_status_domiciliacion = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion')!== null? (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') : 'NULL';
                }

                $id_status_ticket = 'NULL';
                $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";
                $status_ticket_result = pg_query($this->db->getConnection(), $status_ticket_sql);

                if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {
                    $id_status_ticket = pg_fetch_result($status_ticket_result, 0, 'id_status_ticket')!== null? (int)pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') : 'NULL';
                }

                $id_accion_ticket = 'NULL';
                $accion_ticket_sql = "SELECT id_accion_ticket FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";
                $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

                if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
                    $id_accion_ticket = pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket')!== null? (int)pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket') : 'NULL';
                }

                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer);",
                    (int)$id_ticket,
                    (int)$id_user,
                    (int)$id_status_ticket,
                    (int)$id_accion_ticket,
                    $id_status_lab,
                    $id_status_payment,
                    $new_status_domiciliacion
                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                if ($resultsqlInsertHistory === false) {
                    error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($db_conn));
                    return false;
                }      
            }
            }

            if ($result && isset($result['query'])) {
                return pg_fetch_result($result['query'], 0, 0) === 't';
            } else {
                error_log("Error: La consulta SQL no devolvió un resultado válido.");
                return false;
            }

        } catch (Throwable $e) {
            error_log("Error al llamar a la función SQL 'save_document_to_db': " . $e->getMessage());
            return false;
        }
    }

    public function getDocument($id_ticket, $document_type){
        try{

            $sql = "SELECT file_path, mime_type, original_filename FROM archivos_adjuntos WHERE ticket_id = ".$id_ticket." AND document_type = '".$document_type."';";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketDetailsById($id_ticket){
        try{
            $sql = "SELECT * FROM get_ticket_details_by_id(".$id_ticket.")";
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

    public function GetTicketsPendingDocumentApproval($id_user) {
        try {
            $sql = "SELECT * FROM get_tickets_pending_document_approval(".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketDataRegion($id_user){
        try {
            $sql = "SELECT * FROM getdataticketregion(".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function SaveComponents($id_ticket, $components, $serial_pos, $id_user){
        try {
            $id_ticket1 = (int)$id_ticket;
            
            $sql = "UPDATE tickets set id_status_components = TRUE WHERE id_ticket = ".$id_ticket1.";";
            $result = Model::getResult($sql, $this->db);

            if($result){
                $idticket = (int)$id_ticket;
                $id_user = (int)$id_user;
                
                $modulo_insertcolumn = 'coordinador';

                // Inicia transacción
                pg_query($this->db->getConnection(), "BEGIN");

                // Inserta componentes
                if (is_array($components) && !empty($components)) {
                    foreach ($components as $comp_id) {
                        $sqlcomponents = "INSERT INTO tickets_componets (serial_pos, id_ticket, id_components, id_user_carga, component_insert, modulo_insert) 
                                        VALUES ($1, $2, $3, $4, NOW(), $5);";

                        $resultcomponent = pg_query_params(
                            $this->db->getConnection(),
                            $sqlcomponents,
                            array($serial_pos, $idticket, (int)$comp_id, $id_user, $modulo_insertcolumn)
                        );

                        if ($resultcomponent === false) {
                            pg_query($this->db->getConnection(), "ROLLBACK");
                            return false;
                        }
                    }
                } else {
                    pg_query($this->db->getConnection(), "ROLLBACK");
                    return false;
                }

                // Obtiene estados para el historial (FUERA del foreach)
                $id_status_ticket = 0;
                $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = " . (int)$idticket . ";";
                $status_ticket_result = pg_query($this->db->getConnection(), $status_ticket_sql);
                if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {
                    $id_status_ticket = pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') ?? 0;
                }
                            
                $id_status_lab = 0;
                $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . (int)$idticket . ";";
                $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);
                if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                    $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;
                }

                $id_new_status_payment = 'NULL';
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . (int)$idticket . ";";
                $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $id_new_status_payment = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') !== null ? (int)pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') : 'NULL';
                }

                $new_status_domiciliacion = 'NULL';
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . (int)$idticket . ";";
                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $new_status_domiciliacion = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') !== null ? (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') : 'NULL';
                }

                
                $id_accion_ticket = 20;

                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer);",
                    (int)$idticket,
                    (int)$id_user,
                    (int)$id_status_ticket,
                    (int)$id_accion_ticket,
                    $id_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                if (!$resultsqlInsertHistory) {
                    pg_query($this->db->getConnection(), "ROLLBACK");
                    return false;
                }

                // Si todo ha sido exitoso, confirma la transacción
                pg_query($this->db->getConnection(), "COMMIT");
                return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory, 'component_result' => true);

            } else {
                return false;
            }

        } catch (Throwable $e) {
            pg_query($this->db->getConnection(), "ROLLBACK");
            error_log("Error en SaveComponents: " . $e->getMessage());
            return false;
        }
    }
}
?>

