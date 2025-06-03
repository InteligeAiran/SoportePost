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
            $sql = "SELECT * FROM public.getdataclientbyrif('%" . substr($escaped_rif, 1, -1) . "%');";
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
            //var_dump($sql);
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
            $sql = "SELECT * FROM VerifingBranches(" . $escaped_rif . ")';";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetRegionFromState($id_state)
    {
        try {
            $escaped_id_state = pg_escape_literal($this->db->getConnection(), $id_state); // Assuming '$this->db' is now a valid PgSql\Connection
            $sql = "SELECT * FROM GetStateRegionById(" . $escaped_id_state . ");";
            $result = Model::getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function SaveDataFalla($serial, $falla, $nivelFalla, $id_user, $rif)
    {
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $escaped_falla = pg_escape_literal($this->db->getConnection(), $falla);
            $escaped_nivelFalla = pg_escape_literal($this->db->getConnection(), $nivelFalla);
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif);

            // Ejecutar la función para guardar la falla y obtener el ID del ticket creado
            $sqlSave = "SELECT SaveDataFalla(" . $escaped_serial . ", " . $escaped_nivelFalla . ", " . $escaped_rif . ");";
            //var_dump($sqlSave);
            $resultSave = $this->db->pgquery($sqlSave);
            $ticketData = pg_fetch_assoc($resultSave);

            // **Asegúrate de que 'savedatafalla' es el nombre de la columna que devuelve el ID**
            if (!$ticketData || !isset($ticketData['savedatafalla'])) {
                // Es importante manejar el caso donde no se obtiene el ID del ticket
                error_log("Error: No se pudo obtener el ID del ticket de SaveDataFalla.");
                $this->db->closeConnection();
                return array('error' => 'Error al obtener ID del ticket.');
            }
            $idTicketCreado = $ticketData['savedatafalla']; // Capturar el ID del ticket creado
            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $idTicketCreado);

            // Ejecutar la función para insertar la falla
            $sqlFailure = "SELECT InsertTicketFailure(" . $escaped_id_ticket . ", " . $escaped_falla . ");";
            $resultFailure = $this->db->pgquery($sqlFailure);

            $val_id_coordinator = 'NULL'; // Si no tienes un coordinador para asignar aún
            $val_date_sendcoordinator = 'NULL'; // Si no se ha enviado al coordinador aún
            $val_id_tecnico_n2 = 'NULL'; // Si no se ha asignado un técnico N2 aún
            $val_date_assign_tec2 = 'NULL'; // Si no se ha asignado un técnico N2 aún

            if ($resultSave && $resultFailure) {
                $sqlInsertUserTicket = sprintf("SELECT public.insertintouser_ticket(%d::integer,%d::integer, NOW()::timestamp without time zone, NOW()::timestamp without time zone, %s::integer, %s::timestamp without time zone, %s::integer, %s::timestamp without time zone);", $idTicketCreado, (int) $id_user, $val_id_coordinator, $val_date_sendcoordinator, $val_id_tecnico_n2, $val_date_assign_tec2);
                //var_dump($sqlInsertUserTicket); // Descomenta para depurar la cadena final

                // ¡¡¡FALTA ESTA LÍNEA DE EJECUCIÓN!!!
                $resultUserTicket = $this->db->pgquery($sqlInsertUserTicket);

                // **IMPORTANTE: Verifica el resultado de la ejecución**
                if (!$resultUserTicket) {
                    error_log("Error en insertintouser_ticket: " . pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al insertar en users_tickets: ' . pg_last_error($this->db->getConnection()));
                }

                $this->db->closeConnection();
                return array('save_result' => $resultSave, 'failure_result' => $resultFailure, 'user_ticket_result' => $resultUserTicket);
            } else {
                $this->db->closeConnection();
                return array('save_result' => $resultSave, 'failure_result' => $resultFailure);
            }
        } catch (Throwable $e) {
            // Handle exception
            $this->db->closeConnection();
            return array('error' => $e->getMessage()); // Devolver información del error para depuración
        }
    }

    public function SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaBaseDatos, $id_status_payment, $rutaExo, $rutaAnticipo, $id_user, $mimeTypeExo = null, $mimeTypeAnticipo = null, $mimeTypeEnvio = null, $rif)
    {
        try {
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $escaped_descripcion = pg_escape_literal($this->db->getConnection(), $descripcion);
            $escaped_nivelFalla = pg_escape_literal($this->db->getConnection(), $nivelFalla);
            $escaped_id_status_payment = pg_escape_literal($this->db->getConnection(), $id_status_payment);
            $escaped_coordinador = pg_escape_literal($this->db->getConnection(), $coordinador);  // Usar $coordinador
            $escaped_id_user = pg_escape_literal($this->db->getConnection(), $id_user);
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif); // Escapar el RIF
            $idStatusDomiciliacion = $_POST['id_status_domiciliacion'] ?? null; // O de donde venga el dato
            $escaped_idStatusDomiciliacion = ($idStatusDomiciliacion !== null) ? "'" . pg_escape_string($this->db->getConnection(),  $idStatusDomiciliacion) . "'" : null;


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

            $sql = "SELECT * FROM save_data_failure2(" . $escaped_serial . "::TEXT, " . $escaped_nivelFalla . "::INTEGER, " . $escaped_id_status_payment . "::INTEGER, " . $escaped_rif . "::VARCHAR,'" . $rutaBaseDatos . "'::TEXT,
                '" . ($rutaExo ?? '') . "'::TEXT, '" . ($rutaAnticipo ?? '') . "'::TEXT, " . ($escaped_mimeTypeExo !== null ? $escaped_mimeTypeExo . "::TEXT" : 'NULL') . ", " . ($escaped_mimeTypeAnticipo !== null ? $escaped_mimeTypeAnticipo . "::TEXT" : 'NULL') . ", " . ($escaped_mimeTypeEnvio !== null ? $escaped_mimeTypeEnvio . "::TEXT" : 'NULL') . ", " . ($escaped_idStatusDomiciliacion !== null ? $escaped_idStatusDomiciliacion . "::TEXT" : 'NULL') . ");";

            $result = $this->db->pgquery($sql);
            $ticketData = pg_fetch_assoc($result);

            // **Asegúrate de que 'savedatafalla' es el nombre de la columna que devuelve el ID**
            if (!$ticketData || !isset($ticketData['save_data_failure2'])) {
                // Es importante manejar el caso donde no se obtiene el ID del ticket
                error_log("Error: No se pudo obtener el ID del ticket de SaveDataFalla2.");
                $this->db->closeConnection();
                return array('error' => 'Error al obtener ID del ticket.');
            }
            $idTicketCreado = $ticketData['save_data_failure2']; // Capturar el ID del ticket creado
            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $idTicketCreado);

            if ($result) {
                $sqlFailure = "SELECT InsertTicketFailure(" . $escaped_id_ticket . ", " . $escaped_descripcion . ");";

                $resultFailure = $this->db->pgquery($sqlFailure);

                // Llamar a insertintouser_ticket AQUI
                $sqlInsertUserTicket = sprintf(
                    "SELECT public.insertintouser_ticket(%d::integer, %d::integer, NOW()::timestamp without time zone, NULL::timestamp without time zone, %s::integer, NOW()::timestamp without time zone, %s::integer, %s::timestamp without time zone);",
                    //Los parametros de la funcion insertintouser_ticket son:  p_id_ticket integer, p_id_tecnico_n1 integer, p_date_create_ticket timestamp without time zone, p_date_end_ticket timestamp without time zone, p_id_coordinator integer, p_date_sendcoordinator timestamp without time zone, p_id_tecnico_n2 integer, p_date_assign_tec2 timestamp without time zone
                    $idTicketCreado,  // Necesitas obtener este valor de alguna parte.  Tal vez de la llamada a savedatafalla2?
                    (int) $id_user,
                    (int) $coordinador, // Usar el valor del coordinador
                    'NULL', // Puedes usar NULL o una variable si tienes el id_tecnico_n2
                    'NULL',  // Puedes usar NULL o una variable si tienes la fecha
                    'NULL'  // Puedes usar NULL o una variable si tienes la fecha

                );
                // var_dump($sqlInsertUserTicket); // Descomenta para depurar la cadena final
                $resultUserTicket = $this->db->pgquery($sqlInsertUserTicket);

                if ($resultUserTicket) {
                    $id_user = $_SESSION['id_user'];
                    $id_accion_ticket = 4;
                    $id_status_ticket = 1;

                    // Llamar a insertintouser_ticket AQUI
                    $sqlInsertHistory = sprintf(
                        "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, NULL::integer);",
                        $idTicketCreado,    // Corresponds to p_id_ticket
                        (int) $id_user,      // Corresponds to p_changedstatus_by
                        (int) $id_status_ticket,         // Corresponds to p_new_action (assuming it's always 4)
                        $id_accion_ticket,         // Corresponds to p_id_action_ticket
                    );
                    //var_dump($sqlInsertHistory); // Descomenta para depurar la cadena final
                    $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);

                    if (!$resultsqlInsertHistory) {
                        error_log("Error en insertintouser_ticket: " . pg_last_error($this->db->getConnection()));
                        $this->db->closeConnection();
                        return array('error' => 'Error al insertar en users_tickets: ' . pg_last_error($this->db->getConnection()));
                    }
                    //var_dump($sqlInsertUserTicket);
                }
                return array('save_result' => $result, 'failure_result' => $resultFailure, 'user_ticket_result' => $resultUserTicket, 'history_result' => $sqlInsertHistory);
            } else {
                return $result;
            }
        } catch (Throwable $e) {
            // Handle exception
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
            $id_status_ticket = 1; // Asignar un valor predeterminado o dinámico según tu lógica


            if ($result) {
                // Verificar si la asignación del ticket principal fue exitosa (si obtuvimos un ID de acción)
                if ($id_accion_ticket === null) {
                    error_log("Error: La función 'assigntickettotecnico' no devolvió un ID de acción válido para ticket: $id_ticket.");
                    return ['error' => 'No se pudo asignar el ticket o el ID de acción no fue devuelto.'];
                }

                // Llamar a insertintouser_ticket AQUI
                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, NULL::integer);",
                    (int) $id_ticket,    // Corresponds to p_id_ticket
                    (int) $id_user,      // Corresponds to p_changedstatus_by
                    $id_status_ticket,     // Corresponds to p_new_action (assuming it's always 4 based on your function's internal logic)
                    (int) $id_accion_ticket         // Corresponds to p_id_action_ticket
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
            $id_status_domiciliacion = 1; // Asignar un valor predeterminado o dinámico según tu lógica
            $sqlDateUpdate = "SELECT * FROM updateticketdatetaller(" . $escaped_id_ticket . ", ".$id_status_domiciliacion.")";
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
                $id_accion_ticket = 7;
                $id_user = $_SESSION['id_user'];
                $id_status_ticket = 1; // Asignar un valor predeterminado o dinámico según tu lógica
                $id_status_lab = 1; // Asignar un valor predeterminado o dinámico según tu lógica
                $id_status_domiciliacion = 1; // Asignar un valor predeterminado o dinámico según tu lógica

                // Llamar a insertintouser_ticket AQUI
                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int) $id_ticket,    // Corresponds to p_id_ticket
                    (int) $id_user,      // Corresponds to p_changedstatus_by
                    $id_status_ticket,     // Corresponds to p_new_action (assuming it's always 4 based on your function's internal logic)
                    (int) $id_accion_ticket,         // Corresponds to p_id_action_ticket
                    (int)$id_status_lab,
                    (int)$id_status_domiciliacion
                );
                $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);

                if (!$resultsqlInsertHistory) {
                    error_log("Error en insertintouser_ticket: " . pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al insertar en users_tickets: ' . pg_last_error($this->db->getConnection()));
                }
            }

             if ($resultsqlInsertHistory) {
                    $sqlInserDomiciliacion = "INSERT INTO  tickets_status_domiciliacion (id_ticket, id_status_domiciliacion) VALUES (".$id_ticket.", ".$id_status_domiciliacion.");";
                    $resultInserDomiciliacion = Model::getResult($sqlInserDomiciliacion, $this->db);

                    if (!$resultInserDomiciliacion) {
                        error_log("Error al insertar en tickets_status_domiciliacion: ". pg_last_error($this->db->getConnection()));
                        $this->db->closeConnection();
                        return array('error' => 'Error al insertar en tickets_status_domiciliacion: '. pg_last_error($this->db->getConnection()));
                    }
                }
                 return array('save_result' => $resultDateUpdate, 'history_result' => $resultsqlInsertHistory, 'domiciliacion_result' => $resultInserDomiciliacion);
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
        $id_new_status = (int)$id_new_status;
        $id_ticket = (int)$id_ticket;
        $id_user = (int)$id_user; // Asegúrate de castear $id_user también

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

        $id_accion_ticket1 = 8; // Define esto una sola vez

        if ($id_new_status == 2) {
            $sqlInserttickets = "UPDATE tickets SET date_sendkey = NOW(), id_status_key = TRUE, id_accion_ticket = " . $id_accion_ticket1 . " WHERE id_ticket = " . $id_ticket . ";";
            $resultsqlInserttickets = $this->db->pgquery($sqlInserttickets);

            if (!$resultsqlInserttickets) {
                error_log("Error al actualizar tickets (status 2): " . pg_last_error($this->db->getConnection()));
                $this->db->closeConnection();
                return array('error' => 'Error al actualizar tickets (status 2): ' . pg_last_error($this->db->getConnection()));
            }

            // Mueve la lógica del historial a donde realmente se ejecute la actualización correspondiente
            $id_new_domiciliacion = 1; // Asignar un valor predeterminado o dinámico según tu lógica
            $id_status_ticket = 1; // Asignar un valor predeterminado o dinámico según tu lógica (¿Es siempre 1 o debería ser $id_new_status?)
            $sqlInsertHistory1 = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                (int) $id_ticket,           // p_id_ticket
                (int) $id_user,             // p_changedstatus_by
                (int) $id_status_ticket,    // p_new_action (revisar si este es el valor correcto para este parámetro)
                (int) $id_accion_ticket1,   // p_id_action_ticket
                (int) $id_new_status,
                (int) $id_new_domiciliacion
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

            // Mueve la lógica del historial a donde realmente se ejecute la actualización correspondiente
            $id_new_domiciliacion = 1; // Asignar un valor predeterminado o dinámico según tu lógica
            $id_status_ticket = 1; // Asignar un valor predeterminado o dinámico según tu lógica (¿Es siempre 1 o debería ser $id_new_status?)
            $sqlInsertHistory2 = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                (int) $id_ticket,           // p_id_ticket
                (int) $id_user,             // p_changedstatus_by
                (int) $id_status_ticket,    // p_new_action (revisar si este es el valor correcto para este parámetro)
                (int) $id_accion_ticket1,   // p_id_action_ticket
                (int) $id_new_status,
                (int) $id_new_domiciliacion
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
            $id_accion_ticket = 9;
            $sql = "UPDATE tickets SET date_receivekey = NOW(), id_accion_ticket = ".$id_accion_ticket."
                    WHERE id_ticket = ".$id_ticket.";";
            $result = Model::getResult($sql, $this->db);

            if ($result) {
                $new_status_domiciliacion = 1; // Asignar un valor predeterminado o dinámico según tu lógica
                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int) $id_ticket,    // Corresponds to p_id_ticket
                    (int) $id_user,      // Corresponds to p_changedstatus_by
                    (int) 1,     // Corresponds to p_new_action (assuming it's always 4 based on your function's internal logic)
                    (int) $id_accion_ticket,        // Corresponds to p_id_action_ticket
                    (int) 2,
                    (int) $new_status_domiciliacion
                );

                $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);
                if (!$resultsqlInsertHistory) {
                    error_log("Error en insertintouser_ticket: ". pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al insertar en users_tickets: '. pg_last_error($this->db->getConnection()));
                }
                
                return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory);
            }
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function GetStatusDomiciliacion(){
        try {
            $sql = "SELECT * FROM GetStatusDomiciliacion()";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function UpdateStatusDomiciliacion($id_new_status,$id_ticket, $id_user){
        try {
            $sql = "UPDATE tickets SET id_status_domiciliacion = ".$id_new_status." WHERE id_ticket = ".$id_ticket.";";
            ///var_dump("SQL: ".$sql);
            $result = Model::getResult($sql, $this->db);

            if($result) {
                $id_accion_ticket  = 9;
                $id_new_status_lab = 2;
                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                    (int) $id_ticket,    // Corresponds to p_id_ticket
                    (int) $id_user,      // Corresponds to p_changedstatus_by
                    (int) 1,     // Corresponds to p_new_action (assuming it's always 4 based on your function's internal logic)
                    (int) $id_accion_ticket,        // Corresponds to p_id_action_ticket
                    (int) $id_new_status_lab,
                    (int) $id_new_status
                );
                $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);
                if (!$resultsqlInsertHistory) {
                    error_log("Error en insertintouser_ticket: ". pg_last_error($this->db->getConnection()));
                    $this->db->closeConnection();
                    return array('error' => 'Error al insertar en users_tickets: '. pg_last_error($this->db->getConnection()));
                }

                if($resultsqlInsertHistory){
                    $sqlStatusUpdate = "UPDATE tickets_status_domiciliacion SET id_status_domiciliacion = ".$id_new_status." WHERE id_ticket = ".$id_ticket.";";
                    $resultStatusUpdate = Model::getResult($sqlStatusUpdate, $this->db);
                    if (!$resultStatusUpdate) {
                        error_log("Error al actualizar estado del ticket a laboratorio: ". $id_ticket);
                        return ['success' => false,'message' => 'Error al actualizar el estado del ticket a laboratorio.'];
                    }
                    return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory, 'status_update_result' => $resultStatusUpdate);
                }
            }
        } catch (Throwable $e) {
            // Handle exception
        }
    }
}
