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

    public function GetTicketsByRegion($id_region,$id_user,$idtipouser)
    {
        try {
            $escaped_id_region = pg_escape_literal($this->db->getConnection(), $id_region); // Assuming '$this->db' is now a valid PgSql\Connection
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $escaped_idtipouser = pg_escape_literal($this->db->getConnection(), $idtipouser);

            $sql = "SELECT * FROM public.GetTicketsByRegion(".$escaped_id_region.", ".$escaped_id_user.",".$escaped_idtipouser.");";  
            $result = $this->getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsByRif($rif,$id_user,$idtipouser){
        try {
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Assuming '$this->db' is now a valid PgSql\Connection
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $escaped_idtipouser = pg_escape_literal($this->db->getConnection(), $idtipouser);

            $sql = "SELECT * FROM getticketsbyrif('%" . substr($escaped_rif, 1, -1) . "%', ".$escaped_id_user.",".$escaped_idtipouser.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }


    public function SearchSerial($serial,$id_user,$idtipouser){
        try {
            // Validar y convertir null a valores por defecto
            $serial = ($serial !== null && $serial !== '') ? (string)$serial : '';
            $id_user = ($id_user !== null && $id_user !== '') ? (string)$id_user : '0';
            $idtipouser = ($idtipouser !== null && $idtipouser !== '') ? (string)$idtipouser : '0';
            
            // Si el serial está vacío, retornar false
            if (empty($serial)) {
                return false;
            }
            
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $escaped_idtipouser = pg_escape_literal($this->db->getConnection(), $idtipouser);

            $sql = "SELECT * FROM GetTicketsBySearchSerial('%" . substr($escaped_serial, 1, -1) . "%',".$escaped_id_user.",".$escaped_idtipouser.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en SearchSerial: " . $e->getMessage());
            return false;
        }
    }

    public function SearchRangeData($ini_date, $end_date,$id_user, $idtipouser){
        try {
            $escaped_ini_date = pg_escape_literal($this->db->getConnection(), $ini_date);
            $escaped_end_date = pg_escape_literal($this->db->getConnection(), $end_date);
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $escaped_idtipouser = pg_escape_literal($this->db->getConnection(), $idtipouser);

            $sql = "SELECT * FROM getticketsbysearchrangedate(".$escaped_ini_date.", ".$escaped_end_date.",".$escaped_id_user.",".$escaped_idtipouser.")";
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

    public function getTicketabiertoCount($id_rol, $id_user){
        try{
            $sql = "SELECT * FROM get_total_open_tickets(".$id_rol.", ".$id_user.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketsResueltosCount($id_rol, $id_user){
        try{
            $sql = "SELECT * FROM get_total_resolve_tickets(".$id_rol.", ".$id_user.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketsTotalCount($id_region, $id_user){
        try{
            $sql = "SELECT * FROM get_total_tickets(".$id_region.", ".$id_user.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketCountsForPercentage($id_rol, $id_user ) {
        try {
            // Tickets abiertos de hoy
            $sqlToday = "SELECT * FROM get_percentage_open_tickets(".$id_rol.", $id_user);";
            $resultToday = Model::getResult($sqlToday, $this->db);
            return $resultToday;
        } catch (Throwable $e) {
            // Manejar la excepción, loguear o devolver un valor por defecto.
            error_log("Error in getTicketCountsForPercentage: " . $e->getMessage());
        }
    }

    public function getTicketsResueltosCountsForPercentage($id_rol, $id_user) {
        try {
            // Tickets resueltos de hoy (id_status_ticket = 3)
            $sqlToday = "SELECT * FROM get_percentage_resolved_tickets(".$id_rol.", ".$id_user.");";
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
        // 1. Verificar estado actual para mantener aprobados si se sube Envio/Traslado
        $current_status_sql = "SELECT id_status_payment FROM tickets WHERE nro_ticket = '".$nro_ticket."'";
        $current_status_result = Model::getResult($current_status_sql, $this->db);
        
        if ($current_status_result && isset($current_status_result['query']) && $current_status_result['numRows'] > 0) {
            $current_status = pg_fetch_result($current_status_result['query'], 0, 'id_status_payment');
            if (in_array((int)$current_status, [1, 3, 4, 6, 17]) && 
                ($document_type_being_uploaded === 'Traslado' || $document_type_being_uploaded === 'Envio')) {
                return $current_status;
            }
        }

        // ✅ NUEVA VALIDACIÓN: Si es convenio_firmado, actualizar domiciliación
        if ($document_type_being_uploaded === 'convenio_firmado') {
            // Actualizar tickets_status_domiciliacion a 6
            $domiciliacion_sql = "UPDATE tickets_status_domiciliacion 
                                 SET id_status_domiciliacion = 4
                                 WHERE id_ticket = (SELECT id_ticket FROM tickets WHERE nro_ticket = '".$nro_ticket."')";
            
            $domiciliacion_result = Model::getResult($domiciliacion_sql, $this->db);
            
            if (!$domiciliacion_result) {
                error_log("Error al actualizar tickets_status_domiciliacion para convenio_firmado");
            }
            
            // Retornar el status payment actual sin cambios
            $current_status_sql = "SELECT id_status_payment FROM tickets WHERE nro_ticket = '".$nro_ticket."'";
            $current_status_result = Model::getResult($current_status_sql, $this->db);
            
            if ($current_status_result && isset($current_status_result['query']) && $current_status_result['numRows'] > 0) {
                return pg_fetch_result($current_status_result['query'], 0, 'id_status_payment');
            }
            
            return 10; // Valor por defecto
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

                // ✅ USAR determineStatusPaymentAfterUpload PARA ACTUALIZAR DOMICILIACIÓN CUANDO ES convenio_firmado
                $id_status_payment = $this->determineStatusPaymentAfterUpload($nro_ticket, $document_type);
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
        if (in_array((int)$current_status, [1, 3, 4, 6, 17]) && 
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

    public function GetMonthlyTicketDetails($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_monthly_ticket_details(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetIndividualTicketDetailsByRegion($id_rol, $id_user, $id_region){
        try {
            $escaped_id_region = pg_escape_literal($this->db->getConnection(), $id_region);
            $sql = "SELECT * FROM get_individual_ticket_details_by_region(".$id_rol.", ".$id_user.", ".$escaped_id_region.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetIndividualTicketDetails($id_rol, $id_user, $month, $status){
        try {
            $escaped_month = pg_escape_literal($this->db->getConnection(), $month);
            $escaped_status = pg_escape_literal($this->db->getConnection(), $status);
            $sql = "SELECT * FROM get_individual_ticket_details(".$id_rol.", ".$id_user.", ".$escaped_status.", ".$escaped_month.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetMonthlyCreatedTicketsForChart($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_monthly_created_tickets_for_chart(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetMonthlyTicketPercentageChange($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_latest_monthly_ticket_percentage_change(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetMonthlyCreatedTicketsForChartForState($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM GetTicketsByRegion(".$id_rol.", ".$id_user.")";
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

    public function GetTicketsSendTallerTotalCount($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_total_tickets_lab(".$id_rol.", ".$id_user.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTotalTicketsPercentageSendToTaller($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_percentage_tickets_in_lab_of_total(".$id_rol.", ".$id_user.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketOpenDetails($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_open_tickets_details(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetResolveTicketsForCard($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_resolve_tickets_for_card(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTotalTicketsInProcess($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_total_in_processtickets(".$id_rol.",".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTallerTicketsForCard($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_taller_tickets_for_card(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsPendienteReparacion($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_tickets_in_PendienteReparacion(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsProcessReparacionCount($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_total_proceso_reparacion(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsReparadosCount($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_total_reparados(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function handleGetTicketsReparado($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_tickets_reparados(".$id_rol.", ".$id_user."    )";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsPendientesPorRepuestos($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_tickets_pendientes_por_repuestos(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketPendienteRepuestoCount($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_total_pendiente_repuesto(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketIrreparablesCount($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_total_irreparable(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsIrreparables($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_tickets_irreparables(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTotalTicketsPercentageInProcess($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_percentage_in_process_tickets(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsInProcess($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_tickets_in_procesos(".$id_rol.", ".$id_user.")";
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

// Nota: Asume que esta clase tiene acceso a $this->db, que maneja la conexión PostgreSQL.

// Se añade el tipo de retorno array|bool o array|null si se permite que Model::getResult falle al inicio.
// Usamos array|bool aquí para simplificar.
public function SaveComponents($id_ticket, $components, $serial_pos, $id_user, $modulo): array|bool {
    
    // Asignación de variables iniciales
    $id_ticket1 = (int)$id_ticket;
    $id_user_action = (int)$id_user;
    
    // 💥 CORRECCIÓN DE LIMPIEZA: Manejo de serial_pos
    // Si $serial_pos es una cadena vacía (''), lo convierte a NULL de PHP.
    // Esto es NECESARIO si la columna 'serial_pos' es opcional o si es NUMÉRICA y recibe ''.
    $serial_pos_clean = (is_string($serial_pos) && $serial_pos === '') ? null : $serial_pos;
    
    // 💥 CORRECCIÓN DE TIPO: Asegura la decodificación de JSON
    if (is_string($components)) {
        $components = json_decode($components, true) ?? []; 
    }
    
    // Separar componentes marcados y desmarcados
    // Si viene como objeto con 'selected' y 'deselected', usamos eso
    // Si viene como array simple, asumimos que todos están marcados
    $selected_ids = [];
    $deselected_ids = [];
    
    if (is_array($components)) {
        if (isset($components['selected']) && isset($components['deselected'])) {
            // Formato nuevo: objeto con selected y deselected
            $selected_ids = is_array($components['selected']) ? array_map('intval', $components['selected']) : [];
            $deselected_ids = is_array($components['deselected']) ? array_map('intval', $components['deselected']) : [];
        } else {
            // Formato antiguo: array simple de IDs marcados
            $selected_ids = array_map('intval', $components);
        }
    }

    try {
        // Actualizar el estado de componentes en el ticket
        $sql_update_ticket = "UPDATE tickets SET id_status_components = TRUE WHERE id_ticket = " . (int)$id_ticket1 . ";";
        $result_update = Model::getResult($sql_update_ticket, $this->db);
        
        if(!$result_update){
            error_log("SaveComponents: Error al actualizar id_status_components para ticket " . $id_ticket1);
            return ['success' => false, 'message' => "Fallo al actualizar el estado del ticket.", 'debug_info' => 'Ticket update failed.'];
        }

        // --- INICIO DE TRANSACCIÓN ---
        pg_query($this->db->getConnection(), "BEGIN");

        try {
            // SQL para verificar si existe el componente EN EL MISMO MÓDULO
            // Esto evita que se actualicen registros de otros módulos
            $sql_check_exists_same_module = "SELECT id_tickets_components FROM tickets_componets 
                WHERE id_ticket = $1 AND id_components = $2 AND modulo_insert = $3";
            
            // SQL para verificar si existe el componente (cualquier módulo)
            $sql_check_exists = "SELECT id_tickets_components FROM tickets_componets 
                WHERE id_ticket = $1 AND id_components = $2";
            
            // SQL para INSERT con add = true (marcado)
            $sql_insert_selected = "INSERT INTO tickets_componets
                (serial_pos, id_ticket, id_components, id_user_carga, component_insert, modulo_insert, add)
                VALUES ($1, $2, $3, $4, NOW(), $5, TRUE)";
            
            // SQL para UPDATE con add = true (marcado) - SOLO en el mismo módulo
            $sql_update_selected = "UPDATE tickets_componets 
                SET add = TRUE, id_user_carga = $1, component_insert = NOW()
                WHERE id_ticket = $2 AND id_components = $3 AND modulo_insert = $4";
            
            // SQL para verificar si existe el componente en el mismo módulo (para desmarcar)
            $sql_check_exists_same_module_deselected = "SELECT id_tickets_components FROM tickets_componets 
                WHERE id_ticket = $1 AND id_components = $2 AND modulo_insert = $3";
            
            // SQL para UPDATE con add = false (desmarcado) - SOLO en el mismo módulo
            $sql_update_deselected = "UPDATE tickets_componets 
                SET add = FALSE, id_user_carga = $1, component_insert = NOW()
                WHERE id_ticket = $2 AND id_components = $3 AND modulo_insert = $4";
            
            // SQL para INSERT con add = false (desmarcado) - cuando no existe en el módulo
            $sql_insert_deselected = "INSERT INTO tickets_componets
                (serial_pos, id_ticket, id_components, id_user_carga, component_insert, modulo_insert, add)
                VALUES ($1, $2, $3, $4, NOW(), $5, FALSE)";
            
            // SQL para historial
            $sql_history_insert = "INSERT INTO tickets_componets_history 
                (id_ticket, id_components, action_type, id_user_action, action_date, action_module)
                VALUES ($1, $2, $3, $4, NOW(), $5)";
            
            // Procesar componentes marcados (add = true)
            foreach ($selected_ids as $comp_id) {
                // Para el módulo "Creación Ticket", siempre hacer INSERT (no UPDATE)
                // Esto permite mantener el historial completo con usuario, módulo y fecha de cada inserción
                $is_creacion_ticket = (strtolower(trim($modulo)) === 'creación ticket' || strtolower(trim($modulo)) === 'creacion ticket');
                
                $action_type = '';
                
                if ($is_creacion_ticket) {
                    // Siempre INSERT para "Creación Ticket" (crear nuevo registro cada vez)
                    $params_insert = [ 
                        $serial_pos_clean,
                        (int)$id_ticket1,
                        (int)$comp_id,
                        (int)$id_user_action,
                        $modulo
                    ]; 
                    
                    $res_insert = pg_query_params($this->db->getConnection(), $sql_insert_selected, $params_insert);
                    
                    if ($res_insert === false) {
                        $error_message = pg_last_error($this->db->getConnection());
                        throw new Exception('INSERT de componente marcado falló. Detalles: ' . $error_message);
                    }
                    $action_type = 'INSERT';
                } else {
                    // Para otros módulos, verificar si existe EN EL MISMO MÓDULO
                    // Si existe en otro módulo, hacer INSERT para mantener historial completo
                    $params_check_same_module = [ (int)$id_ticket1, (int)$comp_id, $modulo ];
                    $res_check_same_module = pg_query_params($this->db->getConnection(), $sql_check_exists_same_module, $params_check_same_module);
                    
                    if ($res_check_same_module === false) {
                        $error_message = pg_last_error($this->db->getConnection());
                        throw new Exception('Error al verificar existencia de componente en el mismo módulo. Detalles: ' . $error_message);
                    }
                    
                    $exists_same_module = pg_num_rows($res_check_same_module) > 0;
                    
                    if ($exists_same_module) {
                        // UPDATE solo si existe en el MISMO módulo
                        $params_update = [ 
                            (int)$id_user_action,
                            (int)$id_ticket1,
                            (int)$comp_id,
                            $modulo
                        ]; 
                        
                        $res_update = pg_query_params($this->db->getConnection(), $sql_update_selected, $params_update);
                        
                        if ($res_update === false) {
                            $error_message = pg_last_error($this->db->getConnection());
                            throw new Exception('UPDATE de componente marcado falló. Detalles: ' . $error_message);
                        }
                        $action_type = 'UPDATE';
                    } else {
                        // INSERT nuevo si no existe en este módulo (aunque pueda existir en otro módulo)
                        // Esto permite tener el mismo componente en diferentes módulos con diferentes usuarios y fechas
                        $params_insert = [ 
                            $serial_pos_clean,
                            (int)$id_ticket1,
                            (int)$comp_id,
                            (int)$id_user_action,
                            $modulo
                        ]; 
                        
                        $res_insert = pg_query_params($this->db->getConnection(), $sql_insert_selected, $params_insert);
                        
                        if ($res_insert === false) {
                            $error_message = pg_last_error($this->db->getConnection());
                            throw new Exception('INSERT de componente marcado falló. Detalles: ' . $error_message);
                        }
                        $action_type = 'INSERT';
                    }
                }
                
                // Insertar en historial
                $params_history = [ $id_ticket1, (int)$comp_id, $action_type, $id_user_action, $modulo ];
                $res_history = pg_query_params($this->db->getConnection(), $sql_history_insert, $params_history);
                if ($res_history === false) {
                    throw new Exception('Fallo al insertar historial para componente marcado.');
                }
            }
            
            // Procesar componentes desmarcados (add = false)
            foreach ($deselected_ids as $comp_id) {
                // Verificar si existe en el mismo módulo
                $params_check_deselected = [ (int)$id_ticket1, (int)$comp_id, $modulo ];
                $res_check_deselected = pg_query_params($this->db->getConnection(), $sql_check_exists_same_module_deselected, $params_check_deselected);
                
                if ($res_check_deselected === false) {
                    $error_message = pg_last_error($this->db->getConnection());
                    throw new Exception('Error al verificar existencia de componente para desmarcar. Detalles: ' . $error_message);
                }
                
                $exists_same_module_deselected = pg_num_rows($res_check_deselected) > 0;
                $deselected_action_type = '';
                
                if ($exists_same_module_deselected) {
                    // UPDATE si existe en el mismo módulo
                    $params_update_deselected = [ 
                        (int)$id_user_action,
                        (int)$id_ticket1,
                        (int)$comp_id,
                        $modulo
                    ]; 
                    
                    $res_update = pg_query_params($this->db->getConnection(), $sql_update_deselected, $params_update_deselected);
                    
                    if ($res_update === false) {
                        $error_message = pg_last_error($this->db->getConnection());
                        throw new Exception('UPDATE de componente desmarcado falló. Detalles: ' . $error_message);
                    }
                    $deselected_action_type = 'UPDATE';
                } else {
                    // INSERT nuevo registro con add = FALSE si no existe en este módulo
                    // Esto permite registrar que se desmarcó en este módulo específico
                    $params_insert_deselected = [ 
                        $serial_pos_clean,
                        (int)$id_ticket1,
                        (int)$comp_id,
                        (int)$id_user_action,
                        $modulo
                    ]; 
                    
                    $res_insert_deselected = pg_query_params($this->db->getConnection(), $sql_insert_deselected, $params_insert_deselected);
                    
                    if ($res_insert_deselected === false) {
                        $error_message = pg_last_error($this->db->getConnection());
                        throw new Exception('INSERT de componente desmarcado falló. Detalles: ' . $error_message);
                    }
                    $deselected_action_type = 'INSERT';
                }
                
                // Insertar en historial
                $params_history = [ $id_ticket1, (int)$comp_id, $deselected_action_type, $id_user_action, $modulo ];
                $res_history = pg_query_params($this->db->getConnection(), $sql_history_insert, $params_history);
                if ($res_history === false) {
                    throw new Exception('Fallo al insertar historial para componente desmarcado.');
                }
            }
            
                // D. OBTENER ESTADOS Y COORDINADOR (sin cambios)
                // ... (tu lógica para $id_status_ticket, $id_status_lab, etc.) ...

               // Obtiene estados para el historial (FUERA del foreach)
                $id_status_ticket = 0;
                $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket1 . ";";
                $status_ticket_result = pg_query($this->db->getConnection(), $status_ticket_sql);
                if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {
                    $id_status_ticket = pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') ?? 0;
                }
                            
                $id_status_lab = 0;
                $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . (int)$id_ticket1 . ";";
                $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);
                if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                    $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;
                }

                $id_new_status_payment = 'NULL';
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . (int)$id_ticket1 . ";";
                $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $id_new_status_payment = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') !== null ? (int)pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') : 'NULL';
                }

                $new_status_domiciliacion = 'NULL';
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . (int)$id_ticket1 . ";";
                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $new_status_domiciliacion = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') !== null ? (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') : 'NULL';
                }
                
                $id_accion_ticket = 20;
               
                $selectCoord = "
                    SELECT id_coordinador
                    FROM users_tickets
                    WHERE id_ticket = {$id_ticket1}
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

                // ... (tu lógica para $params_history_status y ejecución) ...
                $sqlInsertHistory = "SELECT public.insert_ticket_status_history($1, $2, $3, $4, $5, $6, $7, $8);";

                // 💥 CREACIÓN DE LA VARIABLE params_history_status
                // PARÁMETROS LIMPIOS (NULLs de PHP para campos opcionales)
                $params_history_status = [
                    (int)$id_ticket1, // $1
                    (int)$id_user,    // $2
                    (int)$id_status_ticket, // $3 (Limpiado a 0 si era NULL)
                    (int)$id_accion_ticket, // $4 (Valor fijo 20)
                    $id_status_lab,         // $5 (INT o NULL)
                    $id_new_status_payment, // $6 (INT o NULL)
                    $new_status_domiciliacion, // $7 (INT o NULL)
                    $id_coordinador         // $8 (INT o NULL)
                ];

                // ... (cálculo de $params_history_status) ...
                $resultsqlInsertHistory = pg_query_params($this->db->getConnection(), $sqlInsertHistory, $params_history_status);

                if (!$resultsqlInsertHistory) {
                    // 🛑 CAPTURA CRÍTICA DE ERROR DE POSTGRESQL
                    $error_message = pg_last_error($this->db->getConnection());
                    throw new Exception("Fallo al ejecutar insert_ticket_status_history. Detalles: " . $error_message);
                }

                pg_free_result($resultsqlInsertHistory);

                // ... (Obtener nro_ticket, COMMIT y RETURN success) ...
                pg_query($this->db->getConnection(), "COMMIT");
                return [
                    'success' => true, 
                    'message' => 'Componentes guardados y historial actualizado correctamente',
                    'nro_ticket' => $serial_pos
                ];

        } catch (Throwable $e) {
            // ... (Tu manejo de ROLLBACK y retorno de error) ...
            pg_query($this->db->getConnection(), "ROLLBACK"); 
            $final_error = "Error al guardar los componentes (Interno). " . $e->getMessage();
            error_log($final_error);
            
            return [
                'success' => false, 
                'message' => "Error al guardar los componentes",
                'debug_info' => $e->getMessage()
            ];
        }
    } catch (Throwable $e) {
        error_log("Error en SaveComponents: " . $e->getMessage());
        return [
            'success' => false, 
            'message' => "Error al iniciar el proceso de guardado de componentes",
            'debug_info' => $e->getMessage()
        ];
    }
}

    public function GetDataEstatusTicket($estatus,$id_user, $idtipouser){
        try {
            $sql = "SELECT * FROM getticketsbyestatus(".$estatus.",".$id_user.",".$idtipouser.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketsGestionComercialPorcent($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_percentage_gestion_comercial_tickets(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function getTicketagestioncomercialCount($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM getticketagestioncomercialcount(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function handlegetTicketEntregadoCliente($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_entregado_cliente(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetDetalleTicketComercial($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_card_comercial(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        }catch(Throwable $e){
            return null;
        }
    }

    public function SearchBanco($banco,$id_user,$idtipouser){
        try {
            $sql = "SELECT * FROM getticketsbybanco(".$banco.",".$id_user.",".$idtipouser.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetTicketCounts($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_tickets_by_action(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
            error_log("Error in GetTicketCounts: " . $e->getMessage());
            return false;
        }
    }

    public function EntregadoClienteDetails($id_rol, $id_user){
        try {
            $sql = "SELECT * FROM get_individual_entregadoCliente_tickets_details(".$id_rol.", ".$id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }
}
?>

