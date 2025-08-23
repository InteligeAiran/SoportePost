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
            $sql = "SELECT * FROM getdataclientbyrif('%" . substr($escaped_rif, 1, -1) . "%');";
            $result = $this->getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function SearchSerialData($serial)
    {
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM getdataclientbyserial('%" . substr($escaped_serial, 1, -1) . "%')";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function SearchRazonData($razonsocial)
    {
        try {
            $escaped_razonsocial = pg_escape_literal($this->db->getConnection(), $razonsocial); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM getdataclientbyrazon('%" . substr($escaped_razonsocial, 1, -1) . "%')";
            $result = Model::getResult($sql, $this->db);
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
            $sql = "SELECT * FROM SearchSerial(" . $escaped_serial . ")";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetInstallDate()
    {
        try {
            $sql = "SELECT * FROM GetInstallDate();";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function VerifingClient($rif)
    {
        try {
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM VerifingClient(" . $escaped_rif . ");";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetPosSerialsByRif($rif)
    {
        try {
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM GetPosSerialsByRif(" . $escaped_rif . ");";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function SearchtypePos($serial)
    {
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM SearchtypePos(" . $escaped_serial . ");";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function VerifingBranches($rif)
    {
        try {
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM VerifingBranches(" . $escaped_rif . ");";
            $result = Model::getResult($sql, $this->db);
            if (!$result) {
                error_log("Error al ejecutar VerifingBranches: " . pg_last_error($this->db->getConnection()));
                return null; // O maneja el error de otra manera
            }
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetRegionFromState($id_estado)
    {
        try {
            $sql = "SELECT id_region, name_region FROM GetStateRegionById(" . $id_estado . ");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    
   public function SaveDataFalla($serial, $falla, $nivelFalla, $id_user, $rif, $Nr_ticket)
    {
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $escaped_falla = pg_escape_literal($this->db->getConnection(), $falla);
            $escaped_nivelFalla = pg_escape_literal($this->db->getConnection(), $nivelFalla);
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif);
            $escaped_Nr_ticket = pg_escape_literal($this->db->getConnection(), $Nr_ticket);

            // Ejecutar la función para guardar la falla y obtener el ID del ticket creado
            // OJO: La función SQL `SaveDataFalla` espera 4 parámetros. Aquí le estás pasando 4. ¡Correcto!
            $sqlSave = "SELECT public.SaveDataFalla(" . $escaped_serial . ", " . $escaped_nivelFalla . ", " . $escaped_rif . ", " . $escaped_Nr_ticket . ");";
            $resultSave = $this->db->pgquery($sqlSave);
            $ticketData = pg_fetch_assoc($resultSave); // Esto dará ['savedatafalla' => ID]

            // **IMPORTANTE: Aquí es donde obtienes el ID del ticket creado**
            if (!$ticketData || !isset($ticketData['savedatafalla'])) {
                error_log("Error: No se pudo obtener el ID del ticket de SaveDataFalla.");
                $this->db->closeConnection();
                return array('error' => 'Error al obtener ID del ticket.');
            }
            $idTicketCreado = (int)$ticketData['savedatafalla']; // Capturar el ID del ticket creado como entero
            pg_free_result($resultSave); // Liberar el recurso de $resultSave

            // Obtener el estado del ticket recién creado
            $SearchStatus = $this->getStatusTicket($idTicketCreado); // Pasa el ID entero
            $SearchStatusPayment = $this->getStatusTicketPayment($idTicketCreado); // Pasa el ID entero
            if (!$SearchStatus) {
                error_log("Error: No se pudo obtener el estado del ticket para ID: " . $idTicketCreado);
                $this->db->closeConnection();
                return array('error' => 'Error al obtener estado del ticket.');
            }

            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $idTicketCreado); // Re-escapar si necesario

            // Ejecutar la función para insertar la falla (Ticket Failure)
            $sqlFailure = "SELECT public.InsertTicketFailure(" . $escaped_id_ticket . ", " . $escaped_falla . ");";
            $resultFailure = $this->db->pgquery($sqlFailure);
            if (!$resultFailure) {
                error_log("Error en InsertTicketFailure: " . pg_last_error($this->db->getConnection()));
                $this->db->closeConnection();
                return array('error' => 'Error al insertar la falla del ticket.');
            }
            pg_free_result($resultFailure); // Liberar el recurso de $resultFailure


            $val_id_coordinator = 'NULL';
            $val_date_sendcoordinator = 'NULL';
            $val_id_tecnico_n2 = 'NULL';
            $val_date_assign_tec2 = 'NULL';

            // Ejecutar la función para insertar en users_tickets
            $sqlInsertUserTicket = sprintf("SELECT public.insertintouser_ticket(%d::integer, %d::integer, NOW()::timestamp without time zone, NOW()::timestamp without time zone, %s::integer, %s::timestamp without time zone, %s::integer, %s::timestamp without time zone);", 
                $idTicketCreado, 
                (int) $id_user, 
                $val_id_coordinator, 
                $val_date_sendcoordinator, 
                $val_id_tecnico_n2, 
                $val_date_assign_tec2
            );

            $resultUserTicket = $this->db->pgquery($sqlInsertUserTicket);
            if (!$resultUserTicket) {
                error_log("Error en insertintouser_ticket: " . pg_last_error($this->db->getConnection()));
                $this->db->closeConnection();
                return array('error' => 'Error al insertar en users_tickets: ' . pg_last_error($this->db->getConnection()));
            }
            pg_free_result($resultUserTicket); // Liberar el recurso de $resultUserTicket

            $this->db->closeConnection(); // Cierra la conexión al final de la operación exitosa

            // **¡AQUÍ ESTÁ EL CAMBIO CLAVE!**
            // Devuelve un array que incluye el ID del ticket creado y el estado
            return array(
                'success' => true,
                'idTicketCreado' => $idTicketCreado,
                'status_info' => $SearchStatus // Incluye la información del estado directamente
            );

        } catch (Throwable $e) {
            error_log("Excepción en Model::SaveDataFalla (General): " . $e->getMessage());
            $this->db->closeConnection();
            return array('error' => $e->getMessage());
        }
    }

    /**
     * Obtiene la información del estado del ticket por su ID.
     * @param int $id_ticket El ID del ticket.
     * @return array|null Un array asociativo con 'id_status_ticket' y 'name_status_ticket', o null si no se encuentra.
     */
    public function getStatusTicket(int $id_ticket): ?array
    {
        try {
            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $id_ticket);
            $sql = "SELECT id_status_ticket, name_status_ticket FROM public.get_ticket_status_info(" . $escaped_id_ticket . ");";
            
            $result = pg_query($this->db->getConnection(), $sql);

            if ($result) {
                $row = pg_fetch_assoc($result); // Obtiene una fila como array asociativo
                pg_free_result($result);
                return $row; // Devuelve el array directamente (ej: ['id_status_ticket' => 3, 'name_status_ticket' => 'Cerrado'])
            } else {
                error_log("Error PGSQL en Model::getStatusTicket: " . pg_last_error($this->db->getConnection()));
                return null;
            }
        } catch (Throwable $e) {
            error_log("Excepción en Model::getStatusTicket: " . $e->getMessage());
            return null;
        }
    }

    public function getStatusTicketPayment(int $id_ticket): ?array
    {
        try {
            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $id_ticket);
            $sql = "SELECT stpay.name_status_payment FROM tickets tik INNER JOIN status_payments stpay ON stpay.id_status_payment = tik.id_status_payment WHERE tik.id_ticket =(".$escaped_id_ticket .");";
            $result = pg_query($this->db->getConnection(), $sql);

            if ($result) {
                $row = pg_fetch_assoc($result); // Obtiene una fila como array asociativo
                pg_free_result($result);
                return $row; // Devuelve el array directamente (ej: ['id_status_payment' => 2, 'name_status_payment' => 'Pagado'])
            } else {
                error_log("Error PGSQL en Model::getStatusTicketPayment: " . pg_last_error($this->db->getConnection()));
                return null;
            }
        } catch (Throwable $e) {
            error_log("Excepción en Model::getStatusTicketPayment: " . $e->getMessage());
            return null;
        }
    }
    // Tus otros métodos como getLastUserTicketInfo, GetTotalTickets, etc.
    // También asegúrate de que Model::getResult esté correctamente definido si lo usas.


    public function SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $id_status_payment, $id_user, $rif, $Nr_ticket)
    {
        try {
            $db_conn = $this->db->getConnection();

            // 1. Escapar todas las variables de cadena (TEXT, VARCHAR)
            $escaped_serial = pg_escape_literal($db_conn, $serial);
            $escaped_descripcion = pg_escape_literal($db_conn, $descripcion);
            $escaped_rif = pg_escape_literal($db_conn, $rif);
            $escaped_Nr_ticket = pg_escape_literal($db_conn, $Nr_ticket);

            // 2. Construir la consulta para save_data_failure2
            $sql = "SELECT * FROM public.save_data_failure2("
                . $escaped_serial . "::TEXT, "
                . (int) $nivelFalla . "::INTEGER, "
                . (int) $id_status_payment . "::INTEGER, "
                . $escaped_rif . "::VARCHAR, "
                . $escaped_Nr_ticket . "::VARCHAR);";

            $result = $this->db->pgquery($sql);

            if ($result === false) {
                error_log("Error al ejecutar save_data_failure2: " . pg_last_error($db_conn) . " Query: " . $sql);
                return ['error' => 'Error al insertar datos de falla principal.'];
            }

            $ticketData = pg_fetch_assoc($result);
            pg_free_result($result); // Liberar el recurso

            if (!isset($ticketData['save_data_failure2']) || $ticketData['save_data_failure2'] == 0) {
                error_log("Error: La función save_data_failure2 no devolvió un ID de ticket válido o devolvió 0.");
                return ['error' => 'Error al obtener ID del ticket de la base de datos.'];
            }
            $idTicketCreado = (int) $ticketData['save_data_failure2'];

            // 5. Insertar TicketFailure
            $sqlFailure = "SELECT public.InsertTicketFailure(" . (int) $idTicketCreado . ", " . $escaped_descripcion . ");";
            $resultFailure = $this->db->pgquery($sqlFailure);
            if ($resultFailure === false) {
                error_log("Error al insertar TicketFailure: " . pg_last_error($db_conn) . " Query: " . $sqlFailure);
                return ['error' => 'Error al insertar falla específica del ticket.'];
            }
            pg_free_result($resultFailure); // Liberar el recurso

            // 6. Llamar a insertintouser_ticket
            $sqlInsertUserTicket = sprintf(
                "SELECT public.insertintouser_ticket(%d::integer, %d::integer, NOW()::timestamp without time zone, NULL::timestamp without time zone, %d::integer, NOW()::timestamp without time zone, NULL::integer, NULL::timestamp without time zone);",
                (int) $idTicketCreado,
                (int) $id_user,
                (int) $coordinador
            );
            $resultUserTicket = $this->db->pgquery($sqlInsertUserTicket);
            if ($resultUserTicket === false) {
                error_log("Error al insertar en users_tickets: " . pg_last_error($db_conn) . " Query: " . $sqlInsertUserTicket);
                return ['error' => 'Error al insertar en users_tickets.'];
            }
            pg_free_result($resultUserTicket); // Liberar el recurso

            // 7. Insertar en ticket_status_history
            $id_accion_ticket = 4; // Asumiendo que 4 es la acción de creación de ticket
            $id_status_ticket = 1; // Asumiendo que 1 es el estado inicial (ej. 'Creado' o 'Pendiente')
            $id_status_domiciliacion = 1; // Asumiendo el estado inicial de domiciliación

            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, NULL::integer, %d::integer, %d::integer);",
                (int) $idTicketCreado,
                (int) $id_user,
                (int) $id_status_ticket, // El ID del estado inicial del ticket
                (int) $id_accion_ticket,
                (int) $id_status_payment,
                (int) $id_status_domiciliacion
            );
            $resultHistory = $this->db->pgquery($sqlInsertHistory);
            if ($resultHistory === false) {
                error_log("Error al insertar en ticket_status_history: " . pg_last_error($db_conn) . " Query: " . $sqlInsertHistory);
                return ['error' => 'Error al insertar en ticket_status_history.'];
            }
            pg_free_result($resultHistory); // Liberar el recurso

            // 8. Insertar en tickets_status_domiciliacion
            $sqlInserDomiciliacion = "INSERT INTO tickets_status_domiciliacion (id_ticket, id_status_domiciliacion) VALUES (" . (int) $idTicketCreado . ", " . (int) $id_status_domiciliacion . ");";
            $resultInserDomiciliacion = $this->db->pgquery($sqlInserDomiciliacion);
            if ($resultInserDomiciliacion === false) {
                error_log("Error al insertar en tickets_status_domiciliacion: " . pg_last_error($db_conn) . " Query: " . $sqlInserDomiciliacion);
                return ['error' => 'Error al insertar en tickets_status_domiciliacion.'];
            }
            pg_free_result($resultInserDomiciliacion); // Liberar el recurso

            // **¡AQUÍ ESTÁ LA NUEVA PARTE!** Obtener el estado actual del ticket
            $currentTicketStatus = $this->getStatusTicket($idTicketCreado);
            $SearchStatusPayment = $this->getStatusTicketPayment($idTicketCreado);
            if (!$currentTicketStatus) {
                error_log("Advertencia: No se pudo obtener el estado del ticket después de la creación para ID: " . $idTicketCreado);
                // No se considera un error crítico que detenga todo, pero se registra.
                $currentTicketStatus = ['id_status_ticket' => null, 'name_status_ticket' => 'Desconocido'];
            }

            // Devolver el resultado completo
            return [
                'success' => true,
                'id_ticket_creado' => $idTicketCreado,
                'status_info' => $currentTicketStatus,
                'status_payment_info' => $SearchStatusPayment // Incluye la información del estado de pago directamente
 // Incluye el estado del ticket
            ];

        } catch (Throwable $e) {
            error_log("Excepción en SaveDataFalla2 (General): " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
            return ['error' => 'Error inesperado: ' . $e->getMessage()];
        }
    }

    // Nueva función para insertar en archivos_adjuntos
    public function saveArchivoAdjunto($ticket_id, $Nr_ticket, $uploaded_by_user_id, $original_filename, $stored_filename, $file_path, $mime_type, $file_size_bytes, $document_type)
    {
        try {
            $db_conn = $this->db->getConnection();

            $escaped_original_filename = pg_escape_literal($db_conn, $original_filename);
            $escaped_stored_filename = pg_escape_literal($db_conn, $stored_filename);
            $escaped_file_path = pg_escape_literal($db_conn, $file_path);
            $escaped_mime_type = pg_escape_literal($db_conn, $mime_type);
            $escaped_document_type = pg_escape_literal($db_conn, $document_type);

            // También puedes almacenar Nr_ticket si lo necesitas en la tabla archivos_adjuntos,
            // aunque el ticket_id (ID de la clave primaria) es la relación principal.
            // Para este ejemplo, lo añadiremos como un campo adicional si lo consideras útil,
            // pero no es estrictamente necesario para la relación.
            $sql = sprintf(
                "INSERT INTO public.archivos_adjuntos (nro_ticket, original_filename, stored_filename, file_path, mime_type, file_size_bytes, uploaded_by_user_id, document_type) VALUES (%d, %s, %s, %s, %s, %d, %d, %s);",
                $Nr_ticket,
                $escaped_original_filename,
                $escaped_stored_filename,
                $escaped_file_path,
                $escaped_mime_type,
                (int) $file_size_bytes,
                (int) $uploaded_by_user_id,
                $escaped_document_type
            );

            $result = $this->db->pgquery($sql);

            if ($result === false) {
                error_log("Error al insertar archivo adjunto: " . pg_last_error($db_conn) . " Query: " . $sql);
                return ['error' => 'Error al guardar el archivo adjunto en la base de datos.'];
            }

            return ['success' => true];

        } catch (Throwable $e) {
            error_log("Excepción en saveArchivoAdjunto: " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
            return ['error' => 'Error inesperado al guardar archivo adjunto: ' . $e->getMessage()];
        }
    }

    public function GetExpiredSessions($usuario_id, $ahora)
    {
        try {
            $sql = "SELECT id_session FROM sessions_users WHERE id_user = " . $usuario_id . " AND active = 1 AND expiry_time <= '" . $ahora . "';";
            //var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function UpdateSessionExpired($id_session)
    {
        try {
            $sql = "UPDATE sessions_users SET active = 0, end_date = NOW() WHERE id_session = '" . $id_session . "';";
            //var_dump($sql);
            $result = $this->db->pgquery($sql);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function UltimateDateTicket($serial)
    {
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $sql = "SELECT * FROM Get_last_date_ticket(" . $escaped_serial . ")";
            //var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetTotalTickets($fecha_para_db)
    {
        try {
            $sql = "SELECT * FROM get_tickets_total_count('" . $fecha_para_db . "')";
            $result = $this->db->pgquery($sql);
            if ($result) {
                $row = pg_fetch_assoc($result);
                // Si hay un resultado, devuelve el conteo.
                // Si no hay filas, COUNT(*) devolverá 0, lo cual es perfecto.
                return $row;
            } else {
                // Si la consulta falla, es seguro devolver 0
                error_log("Error en GetTotalTickets: " . pg_last_error($this->db->getConnection()));
                return 0; 
            }
        } catch (Throwable $e) {
            // Captura cualquier excepción y devuelve 0
            error_log("Excepción en GetTotalTickets: " . $e->getMessage());
            return 0;
        }
    
    }

    public function InstallDatePOS($serial)
    {
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $sql = "SELECT * FROM Get_install_day_pos(" . $escaped_serial . ")";
            //var_dump($sql);
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetFailure1()
    {
        try {
            $sql = "SELECT * FROM Get_Failures_level_1()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetFailure2()
    {
        try {
            $sql = "SELECT * FROM Get_Failures_level_2()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetCoordinator()
    {
        try {
            $sql = "SELECT * FROM get_data_coordinator()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetTicketData($id_user)
    {
        try {
            $sql = "SELECT * FROM GetDataTicketByIdAccion(" . $id_user . ")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetTicketData1($id_user)
    {
        try {
            $sql = "SELECT * FROM GetDataTicketByIdAccion1(" . $id_user . ")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetTecnico2()
    {
        try {
            $sql = "SELECT * FROM GetTecnico2()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetDomiciliacion($id_ticket){
        try {
            $sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = ". $id_ticket. " ORDER BY id DESC LIMIT 1;";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function UpdateAccion($id_ticket, $id_tecnico)
    { // Mantén el orden de los parámetros aquí como id_ticket, id_tecnico
        try {
            // Escapar los valores para seguridad (esto es una buena práctica)
            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $id_ticket);
            $escaped_id_tecnico = pg_escape_literal($this->db->getConnection(), $id_tecnico);

            // Construye el SQL para que el primer parámetro sea el ID del ticket y el segundo sea el ID del técnico.
            // Esto coincide con la definición de public.AssignTickettoTecnico(p_id_ticket integer, p_id_tecnico integer)
            $sql = "SELECT * FROM AssignTickettoTecnico(" . $escaped_id_ticket . ", " . $escaped_id_tecnico . ")";
            $result = $this->db->pgquery($sql);
            $ticketData = pg_fetch_assoc($result);

            // **Asegúrate de que 'savedatafalla' es el nombre de la columna que devuelve el ID**
            if (!$ticketData || !isset($ticketData['assigntickettotecnico'])) {
                // Es importante manejar el caso donde no se obtiene el ID del ticket
                error_log("Error: No se pudo obtener el ID del ticket de SaveDataFalla2.");
                $this->db->closeConnection();
                return array('error' => 'Error al obtener ID del ticket.');
            }

            $id_accion_ticket = $ticketData['assigntickettotecnico']; // Capturar el ID del ticket creado
            $id_user = $_SESSION['id_user'];
            $id_status_ticket = 2; // Asignar un valor predeterminado o dinámico según tu lógica


            if ($result) {
                // Verificar si la asignación del ticket principal fue exitosa (si obtuvimos un ID de acción)
                if ($id_accion_ticket === null) {
                    error_log("Error: La función 'assigntickettotecnico' no devolvió un ID de acción válido para ticket: $id_ticket.");
                    return ['error' => 'No se pudo asignar el ticket o el ID de acción no fue devuelto.'];
                }

        $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
        $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

        if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
            $row = [];
            for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                $row[] = pg_fetch_assoc($status_lab_result, $i);
            }
            $id_new_status_lab = $row[0]['id_status_lab'] ?? null;
        } else {
            $id_new_status_lab = 'NULL';
        }

        $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". $id_ticket. ";";
        $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

        if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
            $row = [];
            for ($i = 0; $i < pg_num_rows($status_payment_status_result); $i++) {
                $row[] = pg_fetch_assoc($status_payment_status_result, $i);
            }
            $id_new_status_payment = $row[0]['id_status_payment'] ?? null;
        } else {
            $id_new_status_payment = null;
        }

        $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = ". $id_ticket. ";";
        $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);

        if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
            $row = [];
            for ($i = 0; $i < pg_num_rows($status_domiciliacion_result); $i++) {
                $row[] = pg_fetch_assoc($status_domiciliacion_result, $i);
            }
            $new_status_domiciliacion = $row[0]['id_status_domiciliacion']?? null;
        } else {
            $new_status_domiciliacion = null;
        }


        // Construir la llamada a la función de historial
        // Asegúrate que el orden y número de parámetros coincidan exactamente con tu función PostgreSQL
        // Por ejemplo, si insert_ticket_status_history tiene esta firma:
        // insert_ticket_status_history(p_id_ticket, p_changedstatus_by, p_new_action, p_new_status_lab, p_new_status_payment, p_new_status_domiciliacion)

        $sqlInsertHistory = sprintf(
            "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
            (int)$id_ticket,                  // p_id_ticket
            (int)$id_user,                    // p_changedstatus_by (según tu código PHP previo, $id_user era el 2do param)
            (int)$id_status_ticket,              // p_new_status (según tu código PHP previo, $id_new_status era el 3er param)
            (int)$id_accion_ticket,           // p_new_action
            (int)$id_new_status_lab,          // p_new_status_lab
            (int)$id_new_status_payment,      // p_new_status_payment
            (int)$new_status_domiciliacion    // p_new_status_domiciliacion - ¡Este es el que te faltaba en la llamada!
        );
                

                $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);

                if (!$resultsqlInsertHistory) {
                    error_log("Error en insertintouser_ticket: " . pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al insertar en users_tickets: ' . pg_last_error($this->db->getConnection()));
                }
            }

            return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory);
        } catch (Throwable $e) {
            // Considera manejar el error de forma más robusta aquí, por ejemplo, loguear el error y devolver un resultado 'false'
            error_log("Error en UpdateAccion (PHP): " . $e->getMessage());
            return ['success' => false, 'message' => 'Error interno: ' . $e->getMessage()];
        }
    }

    public function SendToTaller($id_ticket)
    {
        try {
            // Escapado del ID del ticket para prevenir inyección SQL
            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $id_ticket);

            // 1. Ejecutar la primera actualización (fecha del taller)
            $sqlDateUpdate = "SELECT * FROM updateticketdatetaller(" . $escaped_id_ticket . ")";
            $resultDateUpdate = Model::getResult($sqlDateUpdate, $this->db);


            // 2. Verificar el resultado de la primera actualización
            if (!$resultDateUpdate) {
                // Si falla la actualización de la fecha, registra el error y retorna una respuesta de fallo.
                error_log("Error al actualizar fecha del ticket: " . $id_ticket);
                return ['success' => false, 'message' => 'Error al actualizar la fecha del ticket.'];
            }

            // 3. Si la primera actualización fue exitosa, ejecuta la segunda (id_ticket del ticket a taller)
            $sqlStatusUpdate = "SELECT * FROM  UpdateTicketStatusTaller(" . $id_ticket . ")";
            //var_dump($sqlStatusUpdate);  
            $resultStatusUpdate = Model::getResult($sqlStatusUpdate, $this->db);

            // 4. Verificar el resultado de la segunda actualización
            if (!$resultStatusUpdate) {
                // Si falla la actualización del estado, registra el error y retorna una respuesta de fallo.
                error_log("Error al actualizar estado del ticket a taller: " . $id_ticket);
                return ['success' => false, 'message' => 'Error al actualizar el estado del ticket a taller.'];
            }


            if ($resultStatusUpdate) {

        $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". $id_ticket. ";";
        $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

        if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
            $row = [];
            for ($i = 0; $i < pg_num_rows($status_payment_status_result); $i++) {
                $row[] = pg_fetch_assoc($status_payment_status_result, $i);
            }
            $id_new_status_payment = $row[0]['id_status_payment'] ?? null;
        } else {
            $id_new_status_payment = null;
        }

        $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = ". $id_ticket. ";";
        $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);

        if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
            $row = [];
            for ($i = 0; $i < pg_num_rows($status_domiciliacion_result); $i++) {
                $row[] = pg_fetch_assoc($status_domiciliacion_result, $i);
            }
            $new_status_domiciliacion = $row[0]['id_status_domiciliacion']?? null;
        } else {
            $new_status_domiciliacion = null;
        }

                $id_accion_ticket = 7;
                $id_user = $_SESSION['id_user'];
                $id_status_ticket = 2; // Asignar un valor predeterminado o dinámico según tu lógica
                $id_status_lab = 6; // Asignar un valor predeterminado o dinámico según tu lógica

                // Llamar a insertintouser_ticket AQUI
                $sqlInsertHistory = sprintf(
            "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int) $id_ticket,    // Corresponds to p_id_ticket
                    (int) $id_user,      // Corresponds to p_changedstatus_by
                    $id_status_ticket,     // Corresponds to p_new_action (assuming it's always 4 based on your function's internal logic)
                    (int) $id_accion_ticket,         // Corresponds to p_id_action_ticket
                    (int) $id_status_lab,
                    (int)$id_new_status_payment,  // p_new_status_payment - ��Este es el que te faltaba en la llamada!
                    (int)$new_status_domiciliacion    // p_new_status_domiciliacion - ¡Este es el que te faltaba en la llamada!

                );

                $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);

                if (!$resultsqlInsertHistory) {
                    error_log("Error en insertintouser_ticket: " . pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al insertar en users_tickets: ' . pg_last_error($this->db->getConnection()));
                }
            }


            return array('save_result' => $resultDateUpdate, 'history_result' => $resultsqlInsertHistory);
        } catch (Throwable $e) {
            // 6. Manejo general de excepciones: registra la excepción y retorna una respuesta de error genérico.
            error_log("Excepción en SendToTaller para ticket " . $id_ticket . ": " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
            return ['success' => false, 'message' => 'Ocurrió un error inesperado al enviar el ticket a taller.'];
        }
    }

    public function GetTicketDataLab($id_user)
    {
        try {
            $sql = "SELECT * FROM get_tickets_for_taller(" . $id_user . ")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetSatusTaller()
    {
        try {
            $sql = "SELECT * FROM GetStatusTaller()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function UpdateTicketStatus($id_new_status, $id_ticket, $id_user)
    {
        try {
            $id_new_status = (int) $id_new_status;
            $id_ticket = (int) $id_ticket;
            $id_user = (int) $id_user; // Asegúrate de castear $id_user también

            // Inicializa las variables de resultado
            $resultsqlInserttickets = null;
            $resultsqlInserttickets1 = null;
            $resultsqlInsertHistory1 = null;
            $resultsqlInsertHistory2 = null;

            // Llama al procedimiento almacenado principal
            $sql = "CALL UpdateTicketStatus(" . $id_ticket . ", " . $id_new_status . ")";
            $result = Model::getResult($sql, $this->db);

            // Verifica si la llamada al procedimiento almacenado fue exitosa
            if (!$result) {
                error_log("Error al ejecutar UpdateTicketStatus (SP): " . pg_last_error($this->db->getConnection()));
                $this->db->closeConnection();
                return array('error' => 'Error al actualizar ticket (SP): ' . pg_last_error($this->db->getConnection()));
            }

            $id_accion_ticket1 = 7; // Define esto una sola vez

            if ($id_new_status == 2) {
                /*$sqlInserttickets = "UPDATE tickets SET date_sendkey = NOW(), id_status_key = TRUE, id_accion_ticket = " . $id_accion_ticket1 . " WHERE id_ticket = " . $id_ticket . ";";
                $resultsqlInserttickets = $this->db->pgquery($sqlInserttickets);

                if (!$resultsqlInserttickets) {
                    error_log("Error al actualizar tickets (status 2): " . pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al actualizar tickets (status 2): ' . pg_last_error($this->db->getConnection()));
                }*/

                 $id_new_status_payment = 'NULL'; 
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $id_ticket . ";";
                $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $status_payment_data = pg_fetch_assoc($status_payment_status_result, 0);
                    $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
                }

                $new_status_domiciliacion = 'NULL'; 
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $id_ticket . ";";
                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                    $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                }

                  $accion_ticket_sql = "SELECT new_action FROM tickets_status_history WHERE id_ticket = ".$id_ticket." ORDER BY id_history DESC LIMIT 1;";
                    $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

                    if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($accion_ticket_result); $i++) {
                            $row[] = pg_fetch_assoc($accion_ticket_result, $i);
                        }
                        $id_accion_ticket = $row[0]['new_action'] ?? null;
                    } else {
                        $id_accion_ticket = null;
                    }

                    
                    $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                            $row[] = pg_fetch_assoc($status_lab_result, $i);
                        }
                        $id_new_status_lab = $row[0]['id_status_lab'] ?? null;
                    } else {
                        $id_new_status_lab = 0;
                    }

                // Mueve la lógica del historial a donde realmente se ejecute la actualización correspondiente
                $sqlInsertHistory1 = sprintf(
                     "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    2, // Usamos la acción específica para el historial
                   (int)$id_accion_ticket, // Usamos la acción específica para el historial
                    (int)$id_new_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );
                $resultsqlInsertHistory1 = $this->db->pgquery($sqlInsertHistory1);

                if (!$resultsqlInsertHistory1) {
                    error_log("Error en insert_ticket_status_history (status 2): " . pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al insertar historial (status 2): ' . pg_last_error($this->db->getConnection()));
                }

            } else {
                // CUIDADO AQUÍ: Corrección de la sintaxis SQL. Se asume que no quieres date_sendkey aquí.
                $sqlInserttickets1 = "UPDATE tickets SET id_status_key = FALSE, id_accion_ticket = " . $id_accion_ticket1 . " WHERE id_ticket = " . $id_ticket . ";";
                $resultsqlInserttickets1 = $this->db->pgquery($sqlInserttickets1);

                if (!$resultsqlInserttickets1) {
                    error_log("Error al actualizar tickets (otros status): " . pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al actualizar tickets (otros status): ' . pg_last_error($this->db->getConnection()));
                }

                   $id_new_status_payment = 'NULL'; 
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $id_ticket . ";";
                $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $status_payment_data = pg_fetch_assoc($status_payment_status_result, 0);
                    $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
                }

                $new_status_domiciliacion = 'NULL'; 
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $id_ticket . ";";
                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                    $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                }

                  $accion_ticket_sql = "SELECT new_action FROM tickets_status_history WHERE id_ticket = ".$id_ticket." ORDER BY id_history DESC LIMIT 1;";
                    $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

                    if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($accion_ticket_result); $i++) {
                            $row[] = pg_fetch_assoc($accion_ticket_result, $i);
                        }
                        $id_accion_ticket = $row[0]['new_action'] ?? null;
                    } else {
                        $id_accion_ticket = null;
                    }

                    
                    $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                            $row[] = pg_fetch_assoc($status_lab_result, $i);
                        }
                        $id_new_status_lab = $row[0]['id_status_lab'] ?? null;
                    } else {
                        $id_new_status_lab = 0;
                    }

                // Mueve la lógica del historial a donde realmente se ejecute la actualización correspondiente
                $id_status_ticket = 2; // Asignar un valor predeterminado o dinámico según tu lógica (¿Es siempre 1 o debería ser $id_new_status?)
                $sqlInsertHistory2 = sprintf(
                     "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    2, // Usamos la acción específica para el historial
                   (int)$id_accion_ticket, // Usamos la acción específica para el historial
                    (int)$id_new_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );

                $resultsqlInsertHistory2 = $this->db->pgquery($sqlInsertHistory2);

                if (!$resultsqlInsertHistory2) {
                    error_log("Error en insert_ticket_status_history (otros status): " . pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al insertar historial (otros status): ' . pg_last_error($this->db->getConnection()));
                }
            }

            // Ya no necesitas var_dump($resultsqlInserttickets1); aquí si lo quieres solo para debug
            // var_dump($resultsqlInserttickets1); // Si lo necesitas para depuración, déjalo, pero no en producción.

            // Retorna todos los resultados
            return array(
                'save_result' => $result,
                'tickets_result' => $resultsqlInserttickets, // Este será null si se ejecutó el 'else'
                'tickets_result1' => $resultsqlInserttickets1, // Este será null si se ejecutó el 'if'
                'history_result1' => $resultsqlInsertHistory1, // Este será null si se ejecutó el 'else'
                'history_result2' => $resultsqlInsertHistory2  // Este será null si se ejecutó el 'if'
            );

        } catch (Throwable $e) {
            // Manejo de la excepción
            error_log("Error en UpdateTicketStatus: " . $e->getMessage());
            // Podrías decidir si cerrar la conexión aquí o dejar que el flujo de la aplicación lo haga
            // $this->db->closeConnection();
            return array('error' => 'Error en UpdateTicketStatus: ' . $e->getMessage());
        }
    }

    public function UpdateKeyReceiveDate($id_ticket, $id_user)
    {
        try {
            $id_accion_ticket = 8;
            $sql = "UPDATE tickets SET date_sendkey = NOW(), id_accion_ticket = ".$id_accion_ticket." WHERE id_ticket = ".$id_ticket.";";
            $result = Model::getResult($sql, $this->db);

            if ($result) {
                   $id_new_status_payment = 'NULL'; 
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $id_ticket . ";";
                $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $status_payment_data = pg_fetch_assoc($status_payment_status_result, 0);
                    $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
                }

                $new_status_domiciliacion = 'NULL'; 
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $id_ticket . ";";
                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                    $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                }
                    
                    $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                            $row[] = pg_fetch_assoc($status_lab_result, $i);
                        }
                        $id_new_status_lab = $row[0]['id_status_lab'] ?? null;
                    } else {
                        $id_new_status_lab = 0;
                    }

                  $sqlInsertHistory = sprintf(
                     "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    2, // Usamos la acción específica para el historial
                    (int)$id_accion_ticket, // Usamos la acción específica para el historial
                    (int)$id_new_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );

                $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);
                if (!$resultsqlInsertHistory) {
                    error_log("Error en insertintouser_ticket: " . pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al insertar en users_tickets: ' . pg_last_error($this->db->getConnection()));
                }

                return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory);
            }
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetStatusDomiciliacion()
    {
        try {
            $sql = "SELECT * FROM GetStatusDomiciliacion()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function UpdateStatusDomiciliacion($id_new_status, $id_ticket, $id_user)
{
    try {
        // Primero, actualiza el estado de domiciliación
        // Aquí no hay problema con la inyección si $id_new_status y $id_ticket vienen saneados (int)
        $sql = "UPDATE tickets_status_domiciliacion SET id_status_domiciliacion = " . (int)$id_new_status . " WHERE id_ticket = " . (int)$id_ticket . ";";
        $new_status_domiciliacion = $id_new_status;
        $result = Model::getResult($sql, $this->db);

        if ($result === false) { // Verifica si la actualización falló
            error_log("Error al actualizar tickets_status_domiciliacion para ticket ID: " . $id_ticket . " - " . pg_last_error($this->db->getConnection()));
            return ['success' => false, 'message' => 'Error al actualizar el estado de domiciliación del ticket.'];
        }

        $id_status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = ".$id_ticket.";";
        $id_status_ticket_result = pg_query($this->db->getConnection(), $id_status_ticket_sql);

        if ($id_status_ticket_result && pg_num_rows($id_status_ticket_result) > 0) {
            $row = [];
            for ($i = 0; $i < pg_num_rows($id_status_ticket_result); $i++) {
                $row[] = pg_fetch_assoc($id_status_ticket_result, $i);
            }
            $id_status_ticket = $row[0]['id_status_ticket'] ?? null;
        } else {
            $id_status_ticket = null;
        }

        // Obtener los estados actuales para el historial (importante: los estados antes de esta actualización)
        // Asumiendo que GetAccion, GetStatuslab, GetStatusPayment devuelven los estados actuales del ticket.
        $accion_ticket_sql = "SELECT new_action FROM tickets_status_history WHERE id_ticket = ".$id_ticket." ORDER BY id_history DESC LIMIT 1;";
        $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

        if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
            $row = [];
            for ($i = 0; $i < pg_num_rows($accion_ticket_result); $i++) {
                $row[] = pg_fetch_assoc($accion_ticket_result, $i);
            }
            $id_accion_ticket = $row[0]['new_action'] ?? null;
        } else {
            $id_accion_ticket = null;
        }

        $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
        $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

        if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
            $row = [];
            for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                $row[] = pg_fetch_assoc($status_lab_result, $i);
            }
            $id_new_status_lab = $row[0]['id_status_lab'] ?? null;
        } else {
            $id_new_status_lab = 0;
        }

        $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". $id_ticket. ";";
        $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

        if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
            $row = [];
            for ($i = 0; $i < pg_num_rows($status_payment_status_result); $i++) {
                $row[] = pg_fetch_assoc($status_payment_status_result, $i);
            }
            $id_new_status_payment = $row[0]['id_status_payment'] ?? null;
        } else {
            $id_new_status_payment = null;
        }

        // Construir la llamada a la función de historial
        // Asegúrate que el orden y número de parámetros coincidan exactamente con tu función PostgreSQL
        // Por ejemplo, si insert_ticket_status_history tiene esta firma:
        // insert_ticket_status_history(p_id_ticket, p_changedstatus_by, p_new_action, p_new_status_lab, p_new_status_payment, p_new_status_domiciliacion)

        $sqlInsertHistory = sprintf(
            "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
            (int)$id_ticket,                  // p_id_ticket
            (int)$id_user,                    // p_changedstatus_by (según tu código PHP previo, $id_user era el 2do param)
            (int)$id_status_ticket,              // p_new_status (según tu código PHP previo, $id_new_status era el 3er param)
            (int)$id_accion_ticket,           // p_new_action
            (int)$id_new_status_lab,          // p_new_status_lab
            (int)$id_new_status_payment,      // p_new_status_payment
            (int)$new_status_domiciliacion    // p_new_status_domiciliacion - ¡Este es el que te faltaba en la llamada!
        );

        $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);

        if ($resultsqlInsertHistory === false) {
            error_log("Error al insertar en ticket_status_history para ticket ID: " . $id_ticket . " - " . pg_last_error($this->db->getConnection()));
            // No es necesario cerrar la conexión aquí si Model::getResult la maneja correctamente
            return ['success' => false, 'message' => 'Error al registrar el historial del ticket.'];
        }

        // Si todo fue exitoso
        return ['success' => true, 'message' => 'Estado de domiciliación actualizado y historial registrado con éxito.'];

    } catch (Throwable $e) {
        error_log("Excepción en UpdateStatusDomiciliacion: " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
        return ['success' => false, 'message' => 'Ocurrió un error inesperado al procesar la solicitud.'];
    }
}

    public function GetLastUserTicketInfo($id_user){
        try{
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT date_create_ticket, rif FROM GetLastTicketDataForUser(".$escaped_id_user.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en Model::GetLastUserTicketInfo: " . $e->getMessage());
            return null; // En caso de error, siempre null
        }
    }

    public function GetModules()
    {
        try {
            //$sql = "SELECT * FROM GetModules()";
            $sql = "SELECT id_module, name_module FROM modules ORDER BY id_module ASC";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetSubmodulesForModule($moduleId, $id_usuario)
    {
        try {
            $escaped_moduleId = pg_escape_literal($this->db->getConnection(), $moduleId);
            $escaped_id_usuario = pg_escape_literal($this->db->getConnection(), $id_usuario);
            $sql = "SELECT * from spversubmodulosnavbar (".$escaped_moduleId.",".$escaped_id_usuario.")";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function GetSubSubmodulesForSubmodule($id_submodule)
    {
        try {
            $escaped_id_submodule = pg_escape_literal($this->db->getConnection(), $id_submodule);
            $sql = "SELECT id_subsubmodule, name_subsubmodule FROM subsub_modules WHERE id_submodule = ".$id_submodule.";";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Manejar excepciones
        }
    }

    public function getTicketCountsGroupedByAction(): array
    {
        try {
            $sql = "
                SELECT
                    t.id_accion_ticket,
                    a.name_accion_ticket,
                    COUNT(t.id_accion_ticket) AS total_tickets
                FROM
                    tickets t
                JOIN
                    accions_tickets a ON t.id_accion_ticket = a.id_accion_ticket
                WHERE
                    t.id_accion_ticket IN (4, 5, 6, 7, 8, 9) -- Filtra solo las acciones que te interesan
                GROUP BY
                    t.id_accion_ticket, a.name_accion_ticket
                ORDER BY
                    t.id_accion_ticket;";
            
            // Suponiendo que Model::getResult($sql, $this->db) devuelve un array de filas
            $result = $this->db->pgquery($sql); // O Model::getResult($sql, $this->db); si eso es lo que usas
            
            $counts = [];
            if ($result) {
                while ($row = pg_fetch_assoc($result)) {
                    $counts[] = [
                        'id_accion_ticket' => (int)$row['id_accion_ticket'],
                        'name_accion_ticket' => $row['name_accion_ticket'],
                        'total_tickets' => (int)$row['total_tickets']
                    ];
                }
            }
            
            // Opcional: Asegurar que todos los IDs deseados estén presentes, incluso si no tienen tickets.
            // Esto es más complejo y quizás no necesario si el frontend maneja la ausencia.
            // Si necesitas que los 0s aparezcan para IDs que no tienen tickets,
            // tendrías que hacer un LEFT JOIN desde acciones_tickets o unirlos manualmente en PHP.
            // Para simplificar, la consulta actual solo traerá los IDs que tienen tickets.
            
            return $counts;

        } catch (Throwable $e) {
            error_log("Excepción en getTicketCountsGroupedByAction: " . $e->getMessage());
            return []; // Retorna un array vacío en caso de error
        }
    }


    public function GetModulesUsers($id_usuario)
        {
            try {
                $escaped_id_usuario = pg_escape_literal($this->db->getConnection(), $id_usuario);
                $sql = "SELECT * from sp_vermodulosnavbar(" . $escaped_id_usuario . ") ";
                $result = Model::getResult($sql, $this->db);
                return $result;
            } catch (Throwable $e) {
                // Manejar excepciones
            }
        }
    public function GetAttachments($ticketId){
        try {
            $sql = "SELECT * FROM get_ticket_attachments_details(" . (int)$ticketId . ")";
            $result = Model::getResult($sql, $this->db);    
            return $result;
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }

    public function UpdateTicketAction($ticketId, $id_user, $comment){
        try {
                $id_accion_ticket = 12;
                $id_status_ticket_history = 2;

                $sql = "UPDATE tickets SET id_accion_ticket = ".(int)$id_accion_ticket.", comment_devolution = '".$comment."' WHERE id_ticket = ".$ticketId.";";
                $result = Model::getResult($sql, $this->db);

                if ($result) {

                $id_new_status_lab = 'NULL'; 
                $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . $ticketId . ";";
                $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);
                if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                    $status_lab_data = pg_fetch_assoc($status_lab_result, 0);
                    $id_new_status_lab = $status_lab_data['id_status_lab'] !== null ? (int)$status_lab_data['id_status_lab'] : 'NULL';
                }

                $id_new_status_payment = 'NULL'; 
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $ticketId . ";";
                $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $status_payment_data = pg_fetch_assoc($status_payment_status_result, 0);
                    $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
                }

                $new_status_domiciliacion = 'NULL'; 
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $ticketId . ";";
                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                    $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                }

                    $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer);",
                    (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    (int)$id_status_ticket_history, // Usamos la acción específica para el historial
                    (int)$id_accion_ticket, // Usamos la acción específica para el historial
                    $id_new_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );
                $sqlresultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);
                return array('save_result' => $result, 'history_result' => $sqlInsertHistory);

            }
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }

    public function UpdateStatusToReceiveInTaller($ticketId, $id_user){
        try {
                $id_status_lab = 1;
                $id_accion_ticket = 15;

                $sql = "UPDATE tickets_status_lab SET id_status_lab = ".(int)$id_status_lab.", confirmreceive = TRUE WHERE id_ticket = ".$ticketId.";";
                $result = Model::getResult($sql, $this->db);
                if ($result) {

                $id_new_status_payment = 'NULL'; 
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $ticketId . ";";
                $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $status_payment_data = pg_fetch_assoc($status_payment_status_result, 0);
                    $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
                }

                $new_status_domiciliacion = 'NULL'; 
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $ticketId . ";";
                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                    $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                }


                    $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer);",
                    (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    (int)2, // Usamos la acción específica para el historial
                    (int)$id_accion_ticket, // Usamos la acción específica para el historial
                    $id_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );
                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                return array('save_result' => $result, 'history_result' => $sqlInsertHistory);
            }
            } catch (Throwable $e) {
                // Log the error (e.g., error_log($e->getMessage());)
                return false; // Return false on error
            }
    }

    public function UpdateRepuestoDate($ticketId, $repuesto_date, $id_user, $id_status_lab){
        try {
                $sql = "UPDATE tickets_status_lab SET repuesto_date = '".$repuesto_date."',  id_status_lab = ".$id_status_lab." WHERE id_ticket = ".$ticketId.";";
                $result = Model::getResult($sql, $this->db);

                if ($result) {
                    $accion_ticket_sql = "SELECT new_action FROM tickets_status_history WHERE id_ticket = ".$ticketId." ORDER BY id_history DESC LIMIT 1;";
                    $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

                    if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($accion_ticket_result); $i++) {
                            $row[] = pg_fetch_assoc($accion_ticket_result, $i);
                        }
                        $id_accion_ticket = $row[0]['new_action'] ?? null;
                    } else {
                        $id_accion_ticket = null;
                    }

                    $id_new_status_payment = 'NULL'; 
                    $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $ticketId . ";";
                    $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                    if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                        $status_payment_data = pg_fetch_assoc($status_payment_status_result, 0);
                        $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
                    }

                    $new_status_domiciliacion = 'NULL'; 
                    $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $ticketId . ";";
                    $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                    if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                        $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                        $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                    }

                    if (empty($repuesto_date)) {
                        $repuesto_date_sql = "NULL";
                    } else {
                        // Escapa el string para prevenir inyección SQL y añade las comillas simples
                        $conn = $this->db->getConnection(); 
                        $repuesto_date_sql = "'" . pg_escape_string($conn, $repuesto_date) . "'"; 
                    }


                    $sqlInsertHistory = sprintf(
            "SELECT public.insert_ticket_status_historyDateRepuesto(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %s);",
                        (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    2, // Usamos la acción específica para el historial
                    (int)$id_accion_ticket, // Usamos la acción específica para el historial
                    (int)$id_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                    $repuesto_date_sql 
                );
                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                return array('save_result' => $result, 'history_result' => $sqlInsertHistory);
            }

        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }

    public function GetOverdueRepuestoTickets(){
        try {
                        $sql = "SELECT
                tsl.id_ticket AS id_ticket,
                t.nro_ticket, -- Asegúrate que el nombre de la columna en tu tabla 'tickets' sea 'nro_ticket'
                tsl.repuesto_date,
                tsl.id_status_lab,
                sl.name_status_lab AS current_status_lab_name
            FROM
                tickets_status_lab tsl
            JOIN
                tickets t ON tsl.id_ticket = t.id_ticket
            JOIN
                status_lab sl ON tsl.id_status_lab = sl.id_status_lab
            WHERE
                tsl.repuesto_date < CURRENT_DATE --- INTERVAL '15 days' -- ¡CORRECCIÓN AQUÍ!
                AND tsl.confirmreceive = TRUE
                AND tsl.id_status_lab = 5;";
                        $result = Model::getResult($sql, $this->db);
                        return $result;
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return null; // Return null on error
        }
    }

    public function UpdateRepuestoDate2($ticketId, $repuesto_date, $id_user){
        try {
                $sql = "UPDATE tickets_status_lab SET repuesto_date = '".$repuesto_date."'  WHERE id_ticket = ".$ticketId.";";
                $result = Model::getResult($sql, $this->db);
                if ($result) {
                    // Obtener los estados actuales para el historial (importante: los estados antes de esta actualización)
                    // Asumiendo que GetAccion, GetStatuslab, GetStatusPayment devuelven los estados actuales del ticket.
                    $accion_ticket_sql = "SELECT new_action FROM tickets_status_history WHERE id_ticket = ".$ticketId." ORDER BY id_history DESC LIMIT 1;";
                    $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

                    if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($accion_ticket_result); $i++) {
                            $row[] = pg_fetch_assoc($accion_ticket_result, $i);
                        }
                        $id_accion_ticket = $row[0]['new_action'] ?? null;
                    } else {
                        $id_accion_ticket = null;
                    }

                    $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $ticketId. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                            $row[] = pg_fetch_assoc($status_lab_result, $i);
                        }
                        $id_new_status_lab = $row[0]['id_status_lab'] ?? null;
                    } else {
                        $id_new_status_lab = 0;
                    }

                    $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". $ticketId. ";";
                    $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

                    if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_payment_status_result); $i++) {
                            $row[] = pg_fetch_assoc($status_payment_status_result, $i);
                        }
                        $id_new_status_payment = $row[0]['id_status_payment'] ?? null;
                    } else {
                        $id_new_status_payment = null;
                    }

                    $new_status_domiciliacion = 'NULL'; 
                    $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $ticketId . ";";
                    $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                    if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                        $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                        $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                    }

                      if (empty($repuesto_date)) {
                        $repuesto_date_sql = "NULL";
                    } else {
                        // Escapa el string para prevenir inyección SQL y añade las comillas simples
                        $conn = $this->db->getConnection(); 
                        $repuesto_date_sql = "'" . pg_escape_string($conn, $repuesto_date) . "'"; 
                    }

                        $sqlInsertHistory = sprintf(
                        "SELECT public.insert_ticket_status_historyDateRepuesto(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %s);",
                        (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    2, // Usamos la acción específica para el historial
                    (int)$id_accion_ticket, // Usamos la acción específica para el historial
                    (int)$id_new_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                    $repuesto_date_sql 
                );
                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory);
            
                }
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }

    public function SendToComercial($ticketId, $id_user){
        try {
                $sql = "UPDATE tickets SET id_accion_ticket = 13 WHERE id_ticket = ". $ticketId. ";";
                $result = Model::getResult($sql, $this->db);
                if ($result) {
                    $sql_status_lab = "UPDATE tickets_status_lab SET id_status_lab = 7 WHERE id_ticket = ". $ticketId. ";";
                    $result_status_lab = Model::getResult($sql_status_lab, $this->db);
                } else {
                    return false;
                }

                if($result_status_lab){
                    $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". $ticketId. ";";
                    $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

                    if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_payment_status_result); $i++) {
                            $row[] = pg_fetch_assoc($status_payment_status_result, $i);
                        }
                        $id_new_status_payment = $row[0]['id_status_payment'] ?? null;
                    } else {
                        $id_new_status_payment = null;
                    }

                    $new_status_domiciliacion = 'NULL'; 
                    $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $ticketId . ";";
                    $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                    if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                        $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                        $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                    }


                    $sqlInsertHistory = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    2, // Usamos la acción específica para el historial
                    13, // Usamos la acción específica para el historial
                    7,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                );
                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory, 'save_result_lab' => $result_status_lab);
            }else {
                return false;
    
            }
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }

    public function SendToGestionRosal($id_ticket, $id_user, $keyCharged){
        try {
                $sql = "UPDATE tickets SET id_accion_ticket = 17,  id_status_key = ".$keyCharged." WHERE id_ticket = ".$id_ticket.";";

                $result = Model::getResult($sql, $this->db);
                if ($result) {
                    
                    $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                            $row[] = pg_fetch_assoc($status_lab_result, $i);
                        }
                        $id_new_status_lab = $row[0]['id_status_lab'] ?? null;
                    } else {
                        $id_new_status_lab = 0;
                    }

                    $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". $id_ticket. ";";
                    $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

                    if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_payment_status_result); $i++) {
                            $row[] = pg_fetch_assoc($status_payment_status_result, $i);
                        }
                        $id_new_status_payment = $row[0]['id_status_payment'] ?? null;
                    } else {
                        $id_new_status_payment = null;
                    }

                    $new_status_domiciliacion = 'NULL'; 
                    $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $id_ticket . ";";
                    $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                    if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                        $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                        $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                    }

                     $accion_ticket_sql = "SELECT new_action FROM tickets_status_history WHERE id_ticket = ".$id_ticket." ORDER BY id_history DESC LIMIT 1;";
                    $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

                    if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($accion_ticket_result); $i++) {
                            $row[] = pg_fetch_assoc($accion_ticket_result, $i);
                        }
                        $id_accion_ticket = $row[0]['new_action'] ?? null;
                    } else {
                        $id_accion_ticket = null;
                    }

                    

                    $sqlInsertHistory = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    2, // Usamos la acción específica para el historial
                    17, // Usamos la acción específica para el historial
                    (int)$id_new_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                );
                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory);
                } else {
                    return false;
                }
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }

    }

    public function MarkKeyAsReceived($id_ticket, $id_user){
        try {
                $sql = "UPDATE tickets SET date_receivekey = NOW(), id_accion_ticket = 9 WHERE id_ticket = ".$id_ticket.";";
                $result = Model::getResult($sql, $this->db);
                if ($result) {
                       $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                            $row[] = pg_fetch_assoc($status_lab_result, $i);
                        }
                        $id_new_status_lab = $row[0]['id_status_lab'] ?? null;
                    } else {
                        $id_new_status_lab = 0;
                    }

                    $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". $id_ticket. ";";
                    $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

                    if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_payment_status_result); $i++) {
                            $row[] = pg_fetch_assoc($status_payment_status_result, $i);
                        }
                        $id_new_status_payment = $row[0]['id_status_payment'] ?? null;
                    } else {
                        $id_new_status_payment = null;
                    }

                    $new_status_domiciliacion = 'NULL'; 
                    $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $id_ticket . ";";
                    $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                    if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                        $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                        $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                    }


                    $sqlInsertHistory = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    2, // Usamos la acción específica para el historial
                    9, // Usamos la acción específica para el historial
                    (int)$id_new_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                return $result && $resultsqlInsertHistory;
                }else {
                    return false;
                }
        } catch (Throwable $e) {
            return false; // Return false on error
        }
    }

    public function GetImageToAproval($id_ticket, $image_type){
        try {
            $sql = "SELECT file_path, mime_type FROM get_image_to_approval(" . (int)$id_ticket . ", '" . $image_type. "');";
            $result = Model::getResult($sql, $this->db);
            
            return $result[0] ?? null; // Retorna la primera fila o null si no hay resultados
        } catch (Throwable $e) {
            error_log("Error en el modelo GetImageToAproval: " . $e->getMessage());
            return false; // Retorna false en caso de error
        }
    }

    public function EntregarTicket($id_ticket, $id_user, $comment){
        try {
            $sql = "UPDATE tickets SET id_accion_ticket = 16, id_status_ticket = 3, date_delivered = NOW(), customer_delivery_comment = '". $comment. "', date_end_ticket = NOW() WHERE id_ticket = ". (int)$id_ticket. ";";
            $result = Model::getResult($sql, $this->db);
            
            if ($result) {

              if ($result) {
                       $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                            $row[] = pg_fetch_assoc($status_lab_result, $i);
                        }
                        $id_new_status_lab = $row[0]['id_status_lab'] ?? null;
                    } else {
                        $id_new_status_lab = 0;
                    }

                    $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". $id_ticket. ";";
                    $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

                    if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_payment_status_result); $i++) {
                            $row[] = pg_fetch_assoc($status_payment_status_result, $i);
                        }
                        $id_new_status_payment = $row[0]['id_status_payment'] ?? null;
                    } else {
                        $id_new_status_payment = null;
                    }

                    $new_status_domiciliacion = 'NULL'; 
                    $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $id_ticket . ";";
                    $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                    if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                        $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                        $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                    }


                    $sqlInsertHistory = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    3, // Usamos la acción específica para el historial
                    16, // Usamos la acción específica para el historial
                    (int)$id_new_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                    );

                    $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                    return $result && $resultsqlInsertHistory;
                } else {
                    return false;
                }
            }
        } catch (Throwable $e) {
            return false; // Return false on error
        }
    }

    public function UpdateStatusToReceiveInRosal($id_ticket, $id_user){
         try {
                $id_accion_ticket = 14;

                $sql = "UPDATE tickets SET id_accion_ticket = ".(int)$id_accion_ticket.", date_send_torosal_fromlab = NOW() WHERE id_ticket = ".$id_ticket.";";
                $result = Model::getResult($sql, $this->db);
                if ($result) {

                    $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                            $row[] = pg_fetch_assoc($status_lab_result, $i);
                        }
                        $id_status_lab = $row[0]['id_status_lab'] ?? null;
                    } else {
                        $id_status_lab = 0;
                    }

                $id_new_status_payment = 'NULL'; 
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $id_ticket . ";";
                $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $status_payment_data = pg_fetch_assoc($status_payment_status_result, 0);
                    $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
                }

                $new_status_domiciliacion = 'NULL'; 
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $id_ticket . ";";
                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                    $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                }


                    $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer);",
                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    (int)2, // Usamos la acción específica para el historial
                    (int)$id_accion_ticket, // Usamos la acción específica para el historial
                    $id_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                return array('save_result' => $result, 'history_result' => $sqlInsertHistory);
            }
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }
    public function GetRegionsByTechnician($id_user){
        try {
            $sql = "SELECT DISTINCT r.id_region, r.name_region, st.name_state FROM users u 
                JOIN regionsusers utr ON u.id_user = utr.id_user 
                JOIN regions r ON utr.id_region = r.id_region 
                JOIN states  st ON utr.id_region = st.id_region WHERE u.id_user = ".(int)$id_user.";";
            $result = Model::getResult($sql, $this->db);
            if ($result) {
                return $result;
            } else {
                return false;
            }
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }

    public function UpdateStatusToReceiveInRegion($ticketId, $id_user){
        try{
          $id_accion_ticket = 19;

                $sql = "UPDATE tickets SET id_accion_ticket = ".(int)$id_accion_ticket." WHERE id_ticket = ".$ticketId.";";
                $result = Model::getResult($sql, $this->db);
                if ($result) {

                    $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $ticketId. ";";
                    $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                    if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                        $row = [];
                        for ($i = 0; $i < pg_num_rows($status_lab_result); $i++) {
                            $row[] = pg_fetch_assoc($status_lab_result, $i);
                        }
                        $id_status_lab = $row[0]['id_status_lab'] ?? null;
                    } else {
                        $id_status_lab = 0;
                    }

                    $id_new_status_payment = 'NULL'; 
                    $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $ticketId . ";";
                    $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                    if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                        $status_payment_data = pg_fetch_assoc($status_payment_status_result, 0);
                        $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
                    }

                    $new_status_domiciliacion = 'NULL'; 
                    $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $ticketId . ";";
                    $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
                    if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                        $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result, 0);
                        $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
                    }


                    $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer);",
                    (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea
                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea
                    (int)2, // Usamos la acción específica para el historial
                    (int)$id_accion_ticket, // Usamos la acción específica para el historial
                    $id_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory);
            }
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }

    public function GetComponents($ticketId){
        try {
            $sql = "SELECT * FROM get_components_by_ticket(".$ticketId.")";
            $result = Model::getResult($sql, $this->db);
            if ($result) {
                return $result;
            } else {
                return false;
            }
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }

    public function SendToRegion($ticketId, $id_user, $componentes_array, $serial) {
        try {
            $id_accion_ticket = 18;
            $modulo_insertcolumn = "Rosal_region";
            
            // 1. Inicia una transacción
            pg_query($this->db->getConnection(), "BEGIN");

            // 2. Actualiza el ticket
            $sql = "UPDATE tickets SET id_accion_ticket = " . (int)$id_accion_ticket . ", date_sentRegion = NOW() WHERE id_ticket = " . (int)$ticketId . ";";
            $result = Model::getResult($sql, $this->db);
            
            if (!$result) {
                pg_query($this->db->getConnection(), "ROLLBACK");
                return false;
            }

            // 3. Itera sobre los componentes y los inserta
            if (is_array($componentes_array) && !empty($componentes_array)) {
                foreach ($componentes_array as $comp_id) {
                    // --- CORRECCIÓN AQUÍ ---
                    // La sentencia pg_query debe estar DENTRO del bucle foreach para cada componente.
                    // Se usa pg_escape_string para evitar inyecciones SQL en los valores de cadena.
                    $sqlcomponents = "INSERT INTO tickets_componets (serial_pos, id_ticket, id_components, id_user_carga, component_insert, modulo_insert) 
                                     VALUES ('" . pg_escape_string($this->db->getConnection(), $serial) . "', " . (int)$ticketId . ", " . (int)$comp_id . ", " . (int)$id_user . ", NOW(), '" . pg_escape_string($this->db->getConnection(), $modulo_insertcolumn) . "');";

                    $resultcomponent = pg_query($this->db->getConnection(), $sqlcomponents);
                    
                    if ($resultcomponent === false) {
                        // Si falla la inserción de un componente, se revierte toda la transacción.
                        pg_query($this->db->getConnection(), "ROLLBACK");
                        return false;
                    }
                }
            } else {
                // Si no hay componentes para insertar, la función continúa sin fallar.
                // Podrías agregar un log o mensaje de advertencia aquí si es necesario.
            }
            
            // 4. Se obtienen los estados para el historial
            $id_status_lab = 0;
            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . (int)$ticketId . ";";
            $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);
            if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;
            }

            $id_new_status_payment = 'NULL';
            $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . (int)$ticketId . ";";
            $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
            if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                $id_new_status_payment = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') !== null ? (int)pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') : 'NULL';
            }

            $new_status_domiciliacion = 'NULL';
            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . (int)$ticketId . ";";
            $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
            if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                $new_status_domiciliacion = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') !== null ? (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') : 'NULL';
            }
            
            // 5. Se inserta en el historial
            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer);",
                (int)$ticketId,
                (int)$id_user,
                (int)2,
                (int)$id_accion_ticket,
                $id_status_lab,
                $id_new_status_payment,
                $new_status_domiciliacion
            );
            $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);
            
            if ($resultsqlInsertHistory === false) {
                 pg_query($this->db->getConnection(), "ROLLBACK");
                 return false;
            }

            // 6. Si todo ha sido exitoso, confirma la transacción
            pg_query($this->db->getConnection(), "COMMIT");
            
            return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory, 'component_result' => true);

        } catch (Throwable $e) {
            // En caso de cualquier error, revierte la transacción
            error_log("Error in SendToRegion: " . $e->getMessage());
            pg_query($this->db->getConnection(), "ROLLBACK");
            return false;
        }
    }

    public function SendToRegionWithoutComponent($ticketId, $id_user){
        try{
            $id_accion_ticket = 18;
            // 1. Inicia una transacción
            pg_query($this->db->getConnection(), "BEGIN");
            // 2. Actualiza el ticket
            $sql = "UPDATE tickets SET id_accion_ticket = ". (int)$id_accion_ticket. ", date_sentRegion = NOW() WHERE id_ticket = ". (int)$ticketId. ";";
            $result = Model::getResult($sql, $this->db);

            if (!$result) {
                pg_query($this->db->getConnection(), "ROLLBACK");
                return false;
            }

            $id_status_lab = 0;
            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". (int)$ticketId. ";";
            $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);
            if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab')?? 0;
            }

            $id_new_status_payment = 'NULL';
            $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". (int)$ticketId. ";";
            $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
            if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                $id_new_status_payment = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment')!== null? (int)pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') : 'NULL';
            }

            $new_status_domiciliacion = 'NULL';
            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = ". (int)$ticketId. ";";
            $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
            if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                $new_status_domiciliacion = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion')!== null? (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') : 'NULL';
            }

            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer);",
                (int)$ticketId,
                (int)$id_user,
                (int)2,
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

            // 3. ¡Agrega esta línea para confirmar la transacción!
            pg_query($this->db->getConnection(), "COMMIT");
            
            return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory);
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            pg_query($this->db->getConnection(), "ROLLBACK");
            return false; // Return false on error
        } 
    }


    public function CheckTicketEnProceso($serial){
        try {
            $sql = "SELECT * FROM check_ticket_en_proceso('". $serial. "');";
            $result = Model::getResult($sql, $this->db);
            if ($result) {
                return $result;
            } else {
                return false;
            }
        } catch (Throwable $e) {
            // Log the error (e.g., error_log($e->getMessage());)
            return false; // Return false on error
        }
    }

    public function HasComponents($ticketId){
        try {
            // Nos retorna la lista de todos los componentes con el flag.
            $sql = "SELECT * FROM get_components_by_ticket(".$ticketId.");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Log the error
            error_log("Error en el modelo HasComponents: " . $e->getMessage());
            return false;
        }
    }

    public function getDocumentByType($ticketId, $documentType) {
        try {
            $db_conn = $this->db->getConnection();
            
            $escaped_ticket_id = pg_escape_literal($db_conn, $ticketId);
            $escaped_document_type = pg_escape_literal($db_conn, $documentType);

            $sql = "SELECT * FROM get_latest_archivo_adjunto(".$escaped_ticket_id.", ".$escaped_document_type.");";
            $result = $this->db->pgquery($sql);

            if ($result === false) {
                error_log("Error al consultar documento: " . pg_last_error($db_conn));
                return false;
            }

            if (pg_num_rows($result) === 0) {
                return false;
            }

            return pg_fetch_assoc($result);

        } catch (Throwable $e) {
            error_log("Excepción en getDocumentByType: " . $e->getMessage());
            return false;
        }
    }


    public function GetMotivos($documentType) {
        try {
            $db_conn = $this->db->getConnection();
            
            $escaped_document_type = pg_escape_literal($db_conn, $documentType);
            $sql = "SELECT * FROM get_motivos_rechazo(".$escaped_document_type.")";
            $result = Model::getResult($sql, $this->db);

            if ($result === false) {
                error_log("Error al consultar motivos: ". pg_last_error($db_conn));
                return false;
            }

            return $result;
        } catch (Throwable $e) {
        error_log("Excepción en GetMotivos: ". $e->getMessage());
        return false;
        }
    }

    public function RechazarDocumentos($id_ticket, $id_motivo, $nro_ticket, $id_user, $document_type) {
        try {
            $db_conn = $this->db->getConnection();

            if ($document_type === 'Envio')
                $id_new_status_payment = 14;
            else if ($document_type === 'Anticipo')
                $id_new_status_payment = 13;
            else{
                $id_new_status_payment = 12;
            }
            
            $escaped_id_ticket = pg_escape_literal($db_conn, $id_ticket);
            $escaped_id_motivo = pg_escape_literal($db_conn, $id_motivo);
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            $escaped_document_type = pg_escape_literal($db_conn, $document_type);

            $sql = "UPDATE archivos_adjuntos SET id_motivo_rechazo = $id_motivo WHERE nro_ticket = ".$escaped_nro_ticket." AND document_type = ".$escaped_document_type.";";
            $result = Model::getResult($sql, $this->db);

            if($result){
                $sql1 = "UPDATE tickets SET id_status_payment = ".$id_new_status_payment." WHERE id_ticket = ".$escaped_id_ticket.";";
                $result1 = Model::getResult($sql1, $this->db);
            
                
                if ($result1 === false) {
                    error_log("Error al rechazar documentos: ". pg_last_error($db_conn));
                    return false;
                }else{
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
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );
               $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);
                }
            }
            return true;
            } catch (Throwable $e) {
            error_log("Excepción en RechazarDocumentos: ". $e->getMessage());
            return false;
        }
    }

    public function AprobarDocumento($id_ticket,  $nro_ticket, $id_user, $document_type) {
        try {
            $db_conn = $this->db->getConnection();

            if ($document_type === 'Exoneracion'){
                $id_new_status_payment = 4;
            } else if ($document_type === 'Anticipo') {
                $id_new_status_payment = 6;
            }
            
            $sql1 = "UPDATE tickets SET id_status_payment = ".$id_new_status_payment." WHERE id_ticket = ".$id_ticket.";";
            $result1 = Model::getResult($sql1, $this->db);

            if ($result1 === false) {
                error_log("Error al aprobar documentos: ". pg_last_error($db_conn));
                return false;
            } else{
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
                    $id_new_status_payment,
                    $new_status_domiciliacion
                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                if ($resultsqlInsertHistory === false) {
                    error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($db_conn));
                    return false;
                }
                return true;  
            }
        } catch (Throwable $e) {
            error_log("Error al aprobar documentos: " . $e->getMessage());
            return false;
        }
    }
}
?>
