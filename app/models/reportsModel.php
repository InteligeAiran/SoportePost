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
        $document_type,
        $id_ticket
    ){
        try {
            $escapedOriginalFilename = pg_escape_literal($this->db->getConnection(), $originalDocumentName);
            $escapedStoredFilename = pg_escape_literal($this->db->getConnection(), $stored_filename);
            $escapedFilePath = pg_escape_literal($this->db->getConnection(), $filePathForDatabase);
            $escapedMimeType = pg_escape_literal($this->db->getConnection(), $mimeTypeFromFrontend);
            $escapedDocumentType = pg_escape_literal($this->db->getConnection(), $document_type);

            $sql = "SELECT save_document_to_db(
                '" .$nro_ticket. "',
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

                $id_status_payment = 'NULL';
                $status_payment_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";
                $status_payment_result = pg_query($this->db->getConnection(), $status_payment_sql);
                if ($status_payment_result && pg_num_rows($status_payment_result) > 0) {
                    $id_status_payment = pg_fetch_result($status_payment_result, 0, 'id_status_payment')!== null? (int)pg_fetch_result($status_payment_result, 0, 'id_status_payment') : 'NULL';
                }

                 $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";
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
                    (int)$id_ticket,
                    (int)$id_user,
                    (int)$id_status_ticket,
                    (int)$id_accion_ticket,
                    $id_status_lab,
                    $id_status_payment,
                    $new_status_domiciliacion,
                    $id_coordinador
                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                if ($resultsqlInsertHistory === false) {
                    error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($db_conn));
                    return false;
                }
            }
             
            return true;
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
            '" .$nro_ticket. "',
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
            
            // NUEVA LÓGICA: Determinar id_status_payment basado en documentos válidos
            $id_status_payment = $this->determineStatusPaymentAfterUpload($nro_ticket, $document_type);

            $sql1 = "UPDATE tickets SET id_status_payment = ".$id_status_payment." WHERE id_ticket = ".(int)$id_ticket.";";
            $result1 = Model::getResult($sql1, $this->db);

            if($result1){

                $sql2 = "UPDATE archivos_adjuntos SET rechazado = FALSE WHERE nro_ticket = '".$nro_ticket."' AND document_type = '".$document_type."';";
                $result2 = Model::getResult($sql2, $this->db);

                if($result2){
                
                    $id_status_lab = 0;
                    $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". (int)$id_ticket. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab')?? 0;
                    }

                
                    $new_status_domiciliacion = 'NULL'; 
                    $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $id_ticket . ";";
                    $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                    if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                        $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                        $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
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

                     $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";
                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);
                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
                        $row_coordinador = pg_fetch_assoc($resultcoordinador);
                        $id_coordinador = (int) $row_coordinador['id_coordinador'];
                        pg_free_result($resultcoordinador);
                    }else{ 
                        $id_coordinador = null;
                    }

                    $sqlInsertHistory = sprintf(
                        "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %d::integer, %s::integer, %d::integer);",
                        (int)$id_ticket,
                        (int)$id_user,
                        (int)$id_status_ticket,
                        (int)$id_accion_ticket,
                        $id_status_lab,
                        $id_status_payment,
                        $new_status_domiciliacion,
                        $id_coordinador
                    );

                    $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                    if ($resultsqlInsertHistory === false) {
                        error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($db_conn));
                        return false;
                    }
                } else {
                    error_log("Error al marcar como recibido el ticket y actualizar los estados de lab y domiciliación para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($db_conn));
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

/**
 * Determina el id_status_payment después de subir un documento
 * Basado en qué documentos válidos (no rechazados) están disponibles
 */
private function determineStatusPaymentAfterUpload($nro_ticket, $document_type_being_uploaded) {
    try {
        // Primero, verificar el estado actual del ticket para ver si ya tiene documentos aprobados
        $current_status_sql = "SELECT id_status_payment FROM tickets WHERE nro_ticket = '".$nro_ticket."'";
        $current_status_result = Model::getResult($current_status_sql, $this->db);
        
        if ($current_status_result && isset($current_status_result['query']) && $current_status_result['numRows'] > 0) {
            $current_status = pg_fetch_result($current_status_result['query'], 0, 'id_status_payment');
            
            // Si el ticket ya tiene documentos aprobados (status 4 = Exoneracion Aprobada, 6 = Anticipo Aprobado)
            // y se está subiendo un documento de traslado o envio, mantener el status aprobado
            if (($current_status == 4 || $current_status == 6) && 
                ($document_type_being_uploaded === 'Traslado' || $document_type_being_uploaded === 'Envio')) {
                return $current_status; // Mantener el status aprobado
            }
        }
        
        // Obtener todos los documentos para este ticket (excluyendo el que se está subiendo)
        $sql = "SELECT 
                    document_type, 
                    id_motivo_rechazo 
                FROM archivos_adjuntos 
                WHERE nro_ticket = '".$nro_ticket."' 
                AND document_type != '".$document_type_being_uploaded."'";
        
        $result = Model::getResult($sql, $this->db);
        
        if (!$result || !isset($result['query'])) {
            error_log("Error al obtener documentos para determinar status payment");
            return 10; // Pendiente por cargar documento
        }
        
        // --- CORRECCIÓN 2: INICIALIZAR ARREGLOS FUERA DEL BUCLE ---
        $existing_documents = [];
        $rejected_documents = [];

        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $existing_documents[] = $agente['document_type'];
        }
        
        // NUEVA VALIDACIÓN: Para estados Miranda, Caracas, Distrito Capital y Vargas
        // Obtener el estado del ticket
        $serial_sql = "SELECT tik.serial_pos FROM tickets tik WHERE tik.nro_ticket = '".$nro_ticket."';";
        $serial_result = Model::getResult($serial_sql, $this->db);

        if ($serial_result && isset($serial_result['query']) && $serial_result['numRows'] > 0) {
            $serial = pg_fetch_result($serial_result['query'], 0,'serial_pos');
        }

        // NUEVA VALIDACIÓN: Para estados Miranda, Caracas, Distrito Capital y Vargas
        // Obtener el estado del ticket usando la función verifingbranches_serial
        $estado_sql = "SELECT * FROM verifingbranches_serial('".$serial."');";
        $estado_result = Model::getResult($estado_sql, $this->db);

        if ($estado_result && isset($estado_result['query']) && $estado_result['numRows'] > 0) {
            $nombre_estado = pg_fetch_result($estado_result['query'], 0, 'nombre_estado');
            
            // Si el estado es Miranda, Caracas, Distrito Capital o Vargas
            if (in_array($nombre_estado, ['Miranda', 'Caracas', 'Distrito Capital', 'Vargas'])) {
                // Si se carga Exoneracion, va a estado 5 (Exoneracion Pendiente por Aprobar)
                if ($document_type_being_uploaded === 'Exoneracion') {
                    return 5; // Exoneracion Pendiente por Aprobar
                }
                // Si se carga Anticipo, va a estado 7 (Pago Anticipo Pendiente por Revision)
                elseif ($document_type_being_uploaded === 'Anticipo') {
                    return 7; // Pago Anticipo Pendiente por Revision
                }
            }
        }
        
        // Si subes Envio y ya tienes Exoneracion válida (no rechazada)
        if ($document_type_being_uploaded === 'Envio' && in_array('Exoneracion', $existing_documents)) {
            return 5; // Exoneracion Pendiente por Revision
        }
        
        // Si subes Envio y ya tienes Anticipo válido (no rechazado)
        if ($document_type_being_uploaded === 'Envio' && in_array('Anticipo', $existing_documents)) {
            return 7; // Pago Anticipo Pendiente por Revision
        }
        
        // Si subes Exoneracion y ya tienes Envio válido (no rechazado)
        if ($document_type_being_uploaded === 'Exoneracion' && in_array('Envio', $existing_documents)) {
            return 5; // Exoneracion Pendiente por Revision
        }
        
        // Si subes Exoneracion y ya tienes Anticipo válido (no rechazado)
        if ($document_type_being_uploaded === 'Exoneracion' && in_array('Anticipo', $existing_documents)) {
            return 5; // Exoneracion Pendiente por Revision
        }
        
        // Si subes Anticipo y ya tienes Envio válido (no rechazado)
        if ($document_type_being_uploaded === 'Anticipo' && in_array('Envio', $existing_documents)) {
            return 7; // Pago Anticipo Pendiente por Revision
        }
        
        // Si subes Anticipo y ya tienes Exoneracion válida (no rechazada)
        if ($document_type_being_uploaded === 'Anticipo' && in_array('Exoneracion', $existing_documents)) {
            return 7; // Pago Anticipo Pendiente por Revision
        }
        
        // Si subes Envio_Destino, siempre va a status 11 (Pendiente por cargar documento PDF Envio ZOOM)
        if ($document_type_being_uploaded === 'Envio_Destino') {
            return 11; // Pendiente Por Cargar Documento(PDF Envio ZOOM)
        }
        
        // Si no hay otros documentos válidos, el documento subido queda pendiente de revisión
        if (empty($existing_documents)) {
            if ($document_type_being_uploaded === 'Exoneracion') {
                return 5; // Exoneracion Pendiente por Revision
            } elseif ($document_type_being_uploaded === 'Anticipo') {
                return 7; // Pago Anticipo Pendiente por Revision
            } else {
                return 10; // Pendiente por cargar documento
            }
        }
        
        // Por defecto, si no se cumple ninguna condición anterior
        return 10; // Pendiente por cargar documento
        
    } catch (Exception $e) {
        error_log("Error en determineStatusPaymentAfterUpload: " . $e->getMessage());
        return 10; // Valor por defecto en caso de error
    }
}

    public function saveDocument2($nro_ticket,
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
            $escapedOriginalFilename = pg_escape_literal($this->db->getConnection(), $originalDocumentName);
            $escapedStoredFilename = pg_escape_literal($this->db->getConnection(), $stored_filename);
            $escapedFilePath = pg_escape_literal($this->db->getConnection(), $filePathForDatabase);
            $escapedMimeType = pg_escape_literal($this->db->getConnection(), $mimeTypeFromFrontend);
            $escapedDocumentType = pg_escape_literal($this->db->getConnection(), $document_type);

            $sql = "SELECT save_document_to_db(
                '" . $nro_ticket."',
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
                // DETERMINAR EL id_status_payment BASÁNDOSE EN LOS DOCUMENTOS EXISTENTES
                            error_log("Determinando status payment para ticket: " . $nro_ticket . " y documento: " . $document_type);

                $id_status_payment = $this->determineStatusPayment($nro_ticket, $document_type);
            error_log("Status payment determinado: " . $id_status_payment);

                $sqlticket = "UPDATE tickets SET id_status_payment = ".$id_status_payment." WHERE nro_ticket = '".$nro_ticket."';";
                $resultticket = Model::getResult($sqlticket, $this->db);
        
            }else{
                error_log("Error: La consulta SQL no devolvió un resultado válido.");
                return false;
            }

            if ($resultticket) {
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

                 $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";
                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);
                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
                        $row_coordinador = pg_fetch_assoc($resultcoordinador);
                        $id_coordinador = (int) $row_coordinador['id_coordinador'];
                        pg_free_result($resultcoordinador);
                    }else{ 
                        $id_coordinador = null;
                    }

                // USAR EL id_status_payment CALCULADO ANTERIORMENTE
                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %d::integer, %s::integer, %d::integer);",
                    (int)$id_ticket,
                    (int)$id_user,
                    (int)$id_status_ticket,
                    (int)$id_accion_ticket,
                    $id_status_lab,
                    $id_status_payment, // AQUÍ USAS EL VALOR CALCULADO
                    $new_status_domiciliacion,
                    $id_coordinador // AQUÍ USAS EL VALOR CALCULADO
                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                if ($resultsqlInsertHistory === false) {
                    error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($this->db->getConnection()));
                    return false;
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

// NUEVA FUNCIÓN PARA DETERMINAR EL STATUS PAYMENT
private function determineStatusPayment($nro_ticket, $document_type_being_uploaded) {
    // Primero, verificar el estado actual del ticket para ver si ya tiene documentos aprobados
    $current_status_sql = "SELECT id_status_payment FROM tickets WHERE nro_ticket = '".$nro_ticket."'";
    $current_status_result = Model::getResult($current_status_sql, $this->db);
    
    if ($current_status_result && isset($current_status_result['query']) && $current_status_result['numRows'] > 0) {
        $current_status = pg_fetch_result($current_status_result['query'], 0, 'id_status_payment');
        
        // Si el ticket ya tiene documentos aprobados (status 4 = Exoneracion Aprobada, 6 = Anticipo Aprobado)
        // y se está subiendo un documento de traslado o envio, mantener el status aprobado
        if (($current_status == 4 || $current_status == 6) && 
            ($document_type_being_uploaded === 'Traslado' || $document_type_being_uploaded === 'Envio')) {
            return $current_status; // Mantener el status aprobado
        }
    }
    
    // Verificar qué documentos ya existen para este ticket (EXCLUYENDO el que se está subiendo)
    $sql = "SELECT document_type FROM archivos_adjuntos WHERE nro_ticket = '".$nro_ticket."' AND document_type != '".$document_type_being_uploaded."'";
    $result = Model::getResult($sql, $this->db);
    
    if ($result) {
        //var_dump($result);  
        $existing_documents = [];

        for ($i = 0; $i < $result['numRows']; $i++) {
            $agente = pg_fetch_assoc($result['query'], $i);
            $existing_documents[] = $agente['document_type'];
        }

         // NUEVA VALIDACIÓN: Para estados Miranda, Caracas, Distrito Capital y Vargas
        // Obtener el estado del ticket
        $serial_sql = "SELECT tik.serial_pos FROM tickets tik WHERE tik.nro_ticket = '".$nro_ticket."'";
        $serial_result = Model::getResult($serial_sql, $this->db);

        if ($serial_result && isset($serial_result['query']) && $serial_result['numRows'] > 0) {
            $serial = pg_fetch_result($serial_result['query'], 0,'serial_pos');
        }

        // NUEVA VALIDACIÓN: Para estados Miranda, Caracas, Distrito Capital y Vargas
        // Obtener el estado del ticket usando la función verifingbranches_serial
        $estado_sql = "SELECT * FROM verifingbranches_serial('".$serial."');";
        $estado_result = Model::getResult($estado_sql, $this->db);

        if ($estado_result && isset($estado_result['query']) && $estado_result['numRows'] > 0) {
            $nombre_estado = pg_fetch_result($estado_result['query'], 0, 'nombre_estado');
            
            // Si el estado es Miranda, Caracas, Distrito Capital o Vargas
            if (in_array($nombre_estado, ['Miranda', 'Caracas', 'Distrito Capital', 'Vargas'])) {
                // Si se carga Exoneracion, va a estado 5 (Exoneracion Pendiente por Aprobar)
                if ($document_type_being_uploaded === 'Exoneracion') {
                    return 5; // Exoneracion Pendiente por Aprobar
                }
                // Si se carga Anticipo, va a estado 7 (Pago Anticipo Pendiente por Revision)
                elseif ($document_type_being_uploaded === 'Anticipo') {
                    return 7; // Pago Anticipo Pendiente por Revision
                }
            }
        }
       
        error_log("Documento siendo subido: " . $document_type_being_uploaded);
        error_log("Documentos existentes (excluyendo el actual): " . implode(', ', $existing_documents));

        // LÓGICA COMPLETA PARA DETERMINAR EL STATUS PAYMENT
        if ($document_type_being_uploaded === 'Envio') {
            // Si se está subiendo envío
            if (in_array('Exoneracion', $existing_documents)) {
                error_log("Envio + Exoneracion existente = Status 5 (Exoneracion Pendiente por Revision)");
                return 5; // Exoneracion Pendiente por Revision
            } elseif (in_array('Anticipo', $existing_documents)) {
                error_log("Envio + Anticipo existente = Status 7 (Pago Anticipo Pendiente por Revision)");
                return 7; // Pago Anticipo Pendiente por Revision
            } else {
                // Solo envío (primer documento)
                error_log("Solo Envio (primer documento) = Status 10 (Pendiente Por Cargar Documento)");
                return 10; // Pendiente Por Cargar Documento(Pago anticipo o Exoneracion)
            }
        } elseif ($document_type_being_uploaded === 'Exoneracion') {
            // Si se está subiendo exoneración
            if (in_array('Envio', $existing_documents)) {
                error_log("Exoneracion + Envio existente = Status 5 (Exoneracion Pendiente por Revision)");
                return 5; // Exoneracion Pendiente por Revision
            } else {
                // Solo exoneración (primer documento)
                error_log("Solo Exoneracion (primer documento) = Status 11 (Pendiente Por Cargar Documento)");
                return 11; // Pendiente Por Cargar Documento(PDF Envio ZOOM)
            }
        } elseif ($document_type_being_uploaded === 'Anticipo') {
            // Si se está subiendo anticipo
            if (in_array('Envio', $existing_documents)) {
                error_log("Anticipo + Envio existente = Status 7 (Pago Anticipo Pendiente por Revision)");
                return 7; // Pago Anticipo Pendiente por Revision
            } else {
                // Solo anticipo (primer documento)
                error_log("Solo Anticipo (primer documento) = Status 11 (Pendiente Por Cargar Documento)");
                return 11; // Pendiente Por Cargar Documento(PDF Envio ZOOM)
            }
        }   

        error_log("Tipo de documento no reconocido, retornando Status 11 por defecto");
        return 11;
    } else {
        return 11;
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
                
                // Inicia transacción
               pg_query($this->db->getConnection(), "BEGIN");

                try {
                if (!is_array($components) || empty($components)) {
                    throw new Exception('Lista de componentes vacía');
                }

                $sqlcomponents = "INSERT INTO tickets_componets
                    (serial_pos, id_ticket, id_components, id_user_carga, component_insert, modulo_insert)
                    VALUES ($1, $2, $3, $4, NOW(), $5)";  // parámetros, sin concatenar

                foreach ($components as $comp_id) {
                    $params = [
                    $serial_pos,           // text/varchar
                    (int)$idticket,        // int
                    (int)$comp_id,         // int (debe existir en tabla components)
                    (int)$id_user,         // int (debe existir en users)
                    'coordinador'          // text/varchar (verifica tipo de modulo_insert)
                    ];

                    $res = pg_query_params($this->db->getConnection(), $sqlcomponents, $params);
                    if ($res === false) {
                    throw new Exception('INSERT componentes: ' . pg_last_error($this->db->getConnection()));
                    }
                    pg_free_result($res);
                }

                // … resto de tu lógica …
                pg_query($this->db->getConnection(), "COMMIT");
                } catch (Throwable $e) {
                error_log('SaveComponents fallo: ' . $e->getMessage());
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
               
                $selectCoord = "
                    SELECT id_coordinador
                    FROM users_tickets
                    WHERE id_ticket = {$idticket}
                    ORDER BY id_user_ticket DESC
                    LIMIT 1
                    ";
                    $resSel = $this->db->pgquery($selectCoord);
                    $id_coordinador = null;
                    if ($resSel && pg_num_rows($resSel) > 0) {
                    $row = pg_fetch_assoc($resSel);
                    $id_coordinador = $row['id_coordinador'] !== null ? (int)$row['id_coordinador'] : null;
                    pg_free_result($resSel);
                    }
                    $selectCoord = $this->db->pgquery($selectCoord);

                    if ($selectCoord && pg_num_rows($selectCoord) > 0) {
                        $row = pg_fetch_assoc($selectCoord);
                        $id_coordinador = (int)$row['id_coordinador'];
                        pg_free_result($selectCoord);
                    } else {
                        error_log('UPDATE users_tickets no retornó filas. ' . pg_last_error($this->db->getConnection()));
                        $id_coordinador = null;
                    }
             
                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",
                    (int)$idticket,
                    (int)$id_user,
                    (int)$id_status_ticket,
                    (int)$id_accion_ticket,
                    $id_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                    (int)$id_coordinador
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

    public function GetDataEstatusTicket($estatus){
        try {
            $sql = "SELECT * FROM getticketsbyestatus(".$estatus.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsGestionComercialPorcent(){
        try {
            $sql = "SELECT * FROM get_percentage_gestion_comercial_tickets()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketagestioncomercialCount(){
        try {
            $sql = "SELECT * FROM getticketagestioncomercialcount()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function handlegetTicketEntregadoCliente(){
        try {
            $sql = "SELECT * FROM get_entregado_cliente()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetDetalleTicketComercial(){
        try {
            $sql = "SELECT * FROM get_individual_card_comercial()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
}
?>

