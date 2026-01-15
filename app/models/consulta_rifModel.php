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

            // Close the connection if needed

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

            // Close the connection if needed

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

            // Close the connection if needed

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

            // Close the connection if needed

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

            // Close the connection if needed

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




    
   public function SaveDataFalla($serial, $falla, $nivelFalla, $id_user, $rif, $Nr_ticket, $descripcion_falla)

    {

        try {

            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);

            $escaped_falla = pg_escape_literal($this->db->getConnection(), $falla);

            $escaped_nivelFalla = pg_escape_literal($this->db->getConnection(), $nivelFalla);

            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif);

            $escaped_Nr_ticket = pg_escape_literal($this->db->getConnection(), $Nr_ticket);

            $escaped_falla_descripcion = pg_escape_literal($this->db->getConnection(), $descripcion_falla);



            // Ejecutar la función para guardar la falla y obtener el ID del ticket creado

            // OJO: La función SQL `SaveDataFalla` espera 4 parámetros. Aquí le estás pasando 4. ¡Correcto!

            $sqlSave = "SELECT public.SaveDataFalla(" . $escaped_serial . ", " . $escaped_nivelFalla . ", " . $escaped_rif . ", " . $escaped_Nr_ticket . ", ".$escaped_falla_descripcion.");";

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



            // Cierra la conexión al final de la operación exitosa



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

            $sql = "SELECT stpay.id_status_payment, stpay.name_status_payment FROM tickets tik INNER JOIN status_payments stpay ON stpay.id_status_payment = tik.id_status_payment WHERE tik.id_ticket =(".$escaped_id_ticket .");";

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



            // 7. Insertar en ticket_status_history - PRIMERA ENTRADA: "crear ticket"

            $id_accion_ticket_crear = 0; // ID para acción "crear ticket"

            $id_status_ticket_inicial = 1; // Estado inicial del ticket

            $id_status_domiciliacion_inicial = 1; // Estado inicial de domiciliación



            $sqlInsertHistoryCrear = sprintf(

                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, NULL::integer, %d::integer, %d::integer);",

                (int) $idTicketCreado,

                (int) $id_user,

                (int) $id_status_ticket_inicial,

                (int) $id_accion_ticket_crear,

                (int) $id_status_payment,

                (int) $id_status_domiciliacion_inicial

            );

            $resultHistoryCrear = $this->db->pgquery($sqlInsertHistoryCrear);

            
            
            if ($resultHistoryCrear === false) {

                error_log("Error al insertar en ticket_status_history (crear ticket): " . pg_last_error($db_conn) . " Query: " . $sqlInsertHistoryCrear);

                return ['error' => 'Error al insertar en ticket_status_history (crear ticket).'];

            }

            
            
            error_log("'crear ticket' insertado correctamente con ID: " . $idTicketCreado);

            pg_free_result($resultHistoryCrear);



            // 8. Insertar en ticket_status_history - SEGUNDA ENTRADA: "Asignado al Coordinador"

            $id_accion_ticket = 4; // ID para acción "Asignado al Coordinador"

            $id_status_ticket = 1; // Estado del ticket

            $id_status_domiciliacion = 1; // Estado de domiciliación



            $sqlInsertHistoryCoord = sprintf(

                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, NULL::integer, %d::integer, %d::integer);",

                (int) $idTicketCreado,

                (int) $id_user,

                (int) $id_status_ticket,

                (int) $id_accion_ticket,

                (int) $id_status_payment,

                (int) $id_status_domiciliacion

            );

            $resultHistoryCoord = $this->db->pgquery($sqlInsertHistoryCoord);

            
            
            if ($resultHistoryCoord === false) {

                error_log("Error al insertar en ticket_status_history (Asignado al Coordinador): " . pg_last_error($db_conn) . " Query: " . $sqlInsertHistoryCoord);

                return ['error' => 'Error al insertar en ticket_status_history (Asignado al Coordinador).'];

            }

            
            
            error_log("'Asignado al Coordinador' insertado correctamente con ID: " . $idTicketCreado);

            pg_free_result($resultHistoryCoord);



            // 9. Insertar en tickets_status_domiciliacion

            $sqlInserDomiciliacion = "INSERT INTO tickets_status_domiciliacion (id_ticket, id_status_domiciliacion) VALUES (" . (int) $idTicketCreado . ", " . (int) $id_status_domiciliacion . ");";

            $resultInserDomiciliacion = $this->db->pgquery($sqlInserDomiciliacion);

            if ($resultInserDomiciliacion === false) {

                error_log("Error al insertar en tickets_status_domiciliacion: " . pg_last_error($db_conn) . " Query: " . $sqlInserDomiciliacion);

                return ['error' => 'Error al insertar en tickets_status_domiciliacion.'];

            }

            pg_free_result($resultInserDomiciliacion);



            // 10. NUEVO: Guardar archivos adjuntos DESPUÉS de crear el historial
            // Obtener id_failure del ticket para verificar si es "Actualización de Software" (9) o "Sin Llaves/Dukpt Vacío" (12)
            $sqlGetFailure = "SELECT tf.id_failure FROM tickets_failures tf WHERE tf.id_ticket = " . (int)$idTicketCreado . " LIMIT 1";
            $resultGetFailure = pg_query($db_conn, $sqlGetFailure);
            $id_failure = null;
            if ($resultGetFailure && pg_num_rows($resultGetFailure) > 0) {
                $id_failure = (int)pg_fetch_result($resultGetFailure, 0, 'id_failure');
            }
            if ($resultGetFailure) {
                pg_free_result($resultGetFailure);
            }
            
            $isActualizacionSoftware = ($id_failure === 9);
            $isSinLlavesDukpt = ($id_failure === 12);
            $isFallaSinPago = $isActualizacionSoftware || $isSinLlavesDukpt;

            if (!empty($envio)) {
                $this->saveArchivoAdjunto($idTicketCreado, $Nr_ticket, $id_user, $envio, 'envio_stored', '/path/to/envio', 'application/pdf', 1024, 'Envio');
            }

            // Si NO es "Actualización de Software" ni "Sin Llaves/Dukpt Vacío", guardar exoneración y anticipo
            if (!$isFallaSinPago) {
                if (!empty($exoneracion)) {
                    $this->saveArchivoAdjunto($idTicketCreado, $Nr_ticket, $id_user, $exoneracion, 'exoneracion_stored', '/path/to/exoneracion', 'application/pdf', 1024, 'Exoneracion');
                }
                
                if (!empty($anticipo)) {
                    $this->saveArchivoAdjunto($idTicketCreado, $Nr_ticket, $id_user, $anticipo, 'anticipo_stored', '/path/to/anticipo', 'application/pdf', 1024, 'Anticipo');
                }

                // 11. Transferir pago de la tabla temporal a la principal si existe (solo si NO es Actualización de Software ni Sin Llaves/Dukpt Vacío)
                $paymentTransferResult = $this->TransferPaymentFromTempToMain($serial, $Nr_ticket);
                if ($paymentTransferResult !== false && $paymentTransferResult !== true) {
                    // Se transfirió un pago exitosamente
                    error_log("Pago transferido exitosamente dentro de SaveDataFalla2. ID del registro: " . $paymentTransferResult);
                } elseif ($paymentTransferResult === false) {
                    // Hubo un error al transferir (pero no detenemos la creación del ticket)
                    error_log("Advertencia: No se pudo transferir el pago temporal para el serial: " . $serial);
                }
                // Si $paymentTransferResult === true, significa que no había pago temporal para transferir (no es un error)
            } else {
                $fallaName = $isActualizacionSoftware ? "Actualización de Software (id_failure = 9)" : "Sin Llaves/Dukpt Vacío (id_failure = 12)";
                error_log("Ticket de {$fallaName}: Se omiten anticipo, exoneración y transferencia de pago.");
            }

            // 12. Obtener el estado actual del ticket

            $currentTicketStatus = $this->getStatusTicket($idTicketCreado);

            $SearchStatusPayment = $this->getStatusTicketPayment($idTicketCreado);

            if (!$currentTicketStatus) {

                error_log("Advertencia: No se pudo obtener el estado del ticket después de la creación para ID: " . $idTicketCreado);

                $currentTicketStatus = ['id_status_ticket' => null, 'name_status_ticket' => 'Desconocido'];

            }



            return [

                'success' => true,

                'id_ticket_creado' => $idTicketCreado,

                'status_info' => $currentTicketStatus,

                'status_payment_info' => $SearchStatusPayment

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



            // ⭐️ CORRECCIÓN: Usar pg_escape_literal y %s para tratarlo como string ⭐️

            $escaped_Nr_ticket = pg_escape_literal($db_conn, $Nr_ticket);



            // También puedes almacenar Nr_ticket si lo necesitas en la tabla archivos_adjuntos,

            // aunque el ticket_id (ID de la clave primaria) es la relación principal.

            // Para este ejemplo, lo añadiremos como un campo adicional si lo consideras útil,

            // pero no es estrictamente necesario para la relación.

            $sql = sprintf(

                "INSERT INTO public.archivos_adjuntos (nro_ticket, original_filename, stored_filename, file_path, mime_type, file_size_bytes, uploaded_by_user_id, document_type) VALUES (%s, %s, %s, %s, %s, %d, %d, %s);",

            $escaped_Nr_ticket, // ⭐️ Aquí pasamos el valor escapado y la referencia de string (%s) ⭐️

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

            $sql = "SELECT * FROM get_last_date_ticket(" . $escaped_serial . ")";

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



    public function getCoordinacion()

    {

        try {

            $sql = "SELECT * FROM get_data_coordinacion()";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            // Manejar excepciones

        }

    }



    public function GetTicketData($id_user)

    {

        try {

            $sql = "SELECT * FROM getdataticketpagos(" . $id_user . ")";

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




        
                   $updateSql = "

                    UPDATE users_tickets ut

                    SET id_coordinador = {$id_user}

                    FROM (

                        SELECT id_user_ticket

                        FROM users_tickets

                        WHERE id_ticket = {$id_ticket}

                        ORDER BY id_user_ticket DESC

                        LIMIT 1

                    ) last_ut

                    WHERE ut.id_user_ticket = last_ut.id_user_ticket

                    RETURNING ut.id_coordinador;

                    ";

                    $resultUpdate = $this->db->pgquery($updateSql);



                    if ($resultUpdate && pg_num_rows($resultUpdate) > 0) {

                        $row = pg_fetch_assoc($resultUpdate);

                        $id_coordinador = (int)$row['id_coordinador'];

                        pg_free_result($resultUpdate);

                    } else {

                        error_log('UPDATE users_tickets no retornó filas. ' . pg_last_error($this->db->getConnection()));

                        $id_coordinador = null;

                    }



                    $sqlInsertHistory = sprintf(

                        "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                        (int)$id_ticket,                  // p_id_ticket

                        (int)$id_user,                    // p_changedstatus_by (según tu código PHP previo, $id_user era el 2do param)

                        (int)$id_status_ticket,              // p_new_status (según tu código PHP previo, $id_new_status era el 3er param)

                        (int)$id_accion_ticket,           // p_new_action

                        (int)$id_new_status_lab,          // p_new_status_lab

                        (int)$id_new_status_payment,      // p_new_status_payment

                        (int)$new_status_domiciliacion,    // p_new_status_domiciliacion - ¡Este es el que te faltaba en la llamada!

                        (int)$id_coordinador,    // p_new_status_domiciliacion - ��Este es el que te faltaba en la llamada!



                    );

                $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);



                if (!$resultsqlInsertHistory) {

                    error_log("Error en insertintouser_ticket: " . pg_last_error($this->db->getConnection()));

                    $this->db->closeConnection();

                    return array('error' => 'Error al insertar en users_tickets: ' . pg_last_error($this->db->getConnection()));

                }

            }

           return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory, 'insert_coordinador_result' => $resultUpdate);

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



                $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";

                $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                    $row_coordinador = pg_fetch_assoc($resultcoordinador);

                    $id_coordinador = (int) $row_coordinador['id_coordinador'];

                    pg_free_result($resultcoordinador);

                }else{ 

                    $id_coordinador = null;

                }





                // Llamar a insertintouser_ticket AQUI

                $sqlInsertHistory = sprintf(

            "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                    (int) $id_ticket,    // Corresponds to p_id_ticket

                    (int) $id_user,      // Corresponds to p_changedstatus_by

                    $id_status_ticket,     // Corresponds to p_new_action (assuming it's always 4 based on your function's internal logic)

                    (int) $id_accion_ticket,         // Corresponds to p_id_action_ticket

                    (int) $id_status_lab,

                    (int)$id_new_status_payment,  // p_new_status_payment - ��Este es el que te faltaba en la llamada!

                    (int)$new_status_domiciliacion,

                    (int)$id_coordinador    // p_new_status_domiciliacion - ¡Este es el que te faltaba en la llamada!

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



            $Sqlupdaterespuestodate = "UPDATE tickets_status_lab SET confirm_date = FALSE WHERE id_ticket = ".$id_ticket.";";

            $resultSqlupdaterespuestodate = Model::getResult($Sqlupdaterespuestodate, $this->db);



            if($resultSqlupdaterespuestodate){



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



                        $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";

                        $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                        if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                            $row_coordinador = pg_fetch_assoc($resultcoordinador);

                            $id_coordinador = (int) $row_coordinador['id_coordinador'];

                            pg_free_result($resultcoordinador);

                        }else{ 

                            $id_coordinador = null;

                        }





                    // Mueve la lógica del historial a donde realmente se ejecute la actualización correspondiente

                    $sqlInsertHistory1 = sprintf(

                        "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                        (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                        (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                        2, // Usamos la acción específica para el historial

                    (int)$id_accion_ticket, // Usamos la acción específica para el historial

                        (int)$id_new_status_lab,

                        $id_new_status_payment,

                        $new_status_domiciliacion,

                        $id_coordinador

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



                    $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }





                    $sqlInsertHistory2 = sprintf(

                        "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                        (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                        (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                        2, // Usamos la acción específica para el historial

                    (int)$id_accion_ticket, // Usamos la acción específica para el historial

                        (int)$id_new_status_lab,

                        $id_new_status_payment,

                        $new_status_domiciliacion,

                        $id_coordinador

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

            }else{

                error_log("Error al ejecutar UpdateTicketStatus (SP): " . pg_last_error($this->db->getConnection()));

                $this->db->closeConnection();

                return array('error' => 'Error al actualizar ticket (SP): ' . pg_last_error($this->db->getConnection()));

            }



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

                     "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    2, // Usamos la acción específica para el historial

                    (int)$id_accion_ticket, // Usamos la acción específica para el historial

                    (int)$id_new_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    $id_coordinador

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



public function UpdateStatusDomiciliacion($id_new_status, $id_ticket, $id_user, $observation)
{
    try {
        // Asegurar que los IDs son enteros
        $id_ticket = (int)$id_ticket;
        $id_new_status = (int)$id_new_status;
        $id_user = (int)$id_user;
        
        // 1. SANITIZACIÓN Y CONFIGURACIÓN INICIAL
        // Escapar la observación para prevenir inyección SQL
        $safe_observation = pg_escape_string($this->db->getConnection(), $observation);
        $new_status_domiciliacion = $id_new_status;

        // Variables predeterminadas para el historial (se actualizan si es un cierre)
        $id_status_ticket = null; 
        $id_accion_ticket = null;
        $id_new_status_payment = null;

        // --- 2. LÓGICA DE ACTUALIZACIÓN DE ESTADOS ---
        if ($id_new_status === 5) {
            // Caso especial: Cierre de ticket (Actualiza tickets y users_tickets)
            
            // 2.1. Actualizar tickets (cierre)
            $sql1 = "UPDATE tickets SET id_status_ticket = 3, id_accion_ticket = 5 WHERE id_ticket = {$id_ticket};";
            if (Model::getResult($sql1, $this->db) === false) {
                error_log("Error al actualizar tickets (cierre) para ticket ID: {$id_ticket} - " . pg_last_error($this->db->getConnection()));
                return ['success' => false, 'message' => 'Error al actualizar los status de cierre en la tabla de tickets.'];
            }

            // 2.2. Actualizar users_tickets (fecha de fin)
            $sql2 = "UPDATE users_tickets SET date_end_ticket = NOW() WHERE id_ticket = {$id_ticket};";
            if (Model::getResult($sql2, $this->db) === false) {
                error_log("Error al actualizar users_tickets (fecha) para ticket ID: {$id_ticket} - " . pg_last_error($this->db->getConnection()));
                return ['success' => false, 'message' => 'Error al actualizar la fecha en users_tickets.'];
            }

            // Asignar los valores del nuevo estado principal y acción (para el historial)
            $id_status_ticket = 3;
            $id_accion_ticket = 5;
            // No se toca id_new_status_payment aquí, se recupera a continuación.
        }

        // 2.3. Actualizar tickets_status_domiciliacion (Común a ambos casos)
        // Usa $safe_observation
        $sql3 = "UPDATE tickets_status_domiciliacion SET id_status_domiciliacion = {$id_new_status}, observation1 = '{$safe_observation}' WHERE id_ticket = {$id_ticket};";
        if (Model::getResult($sql3, $this->db) === false) {
            error_log("Error al actualizar tickets_status_domiciliacion para ticket ID: {$id_ticket} - " . pg_last_error($this->db->getConnection()));
            return ['success' => false, 'message' => 'Error al actualizar el estado de domiciliación.'];
        }

        // --- 3. RECOLECCIÓN DE DATOS PARA EL HISTORIAL (Solo SELECTS: Se ejecuta una sola vez) ---

        // 3.1. Obtener estados principales y de pago (si no se definieron en el IF)
        $sql_statuses = "SELECT id_status_ticket, id_accion_ticket, id_status_payment FROM tickets WHERE id_ticket = {$id_ticket};";
        $res_statuses = $this->db->pgquery($sql_statuses);
        
        if ($res_statuses && pg_num_rows($res_statuses) > 0) {
            $data = pg_fetch_assoc($res_statuses);
            
            // Si el estado no fue forzado a 3/5 por el IF, tomamos el actual del ticket
            if ($id_status_ticket === null) {
                $id_status_ticket = (int)($data['id_status_ticket'] ?? null);
            }
            if ($id_accion_ticket === null) {
                $id_accion_ticket = (int)($data['id_accion_ticket'] ?? null);
            }
            $id_new_status_payment = (int)($data['id_status_payment'] ?? null);
        }

        // 3.2. Obtener estado LAB
        $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = {$id_ticket};";
        $status_lab_result = $this->db->pgquery($status_lab_sql);
        $id_new_status_lab = ($status_lab_result && pg_num_rows($status_lab_result) > 0) ? (int) pg_fetch_assoc($status_lab_result)['id_status_lab'] : 0;

        // 3.3. Obtener ID de Coordinador
        $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";
        $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);
        $id_coordinador = ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) ? (int) pg_fetch_assoc($resultcoordinador)['id_coordinador'] : null;

        // --- 4. INSERCIÓN DE HISTORIAL (Se ejecuta una sola vez) ---
        $sqlInsertHistory = sprintf(
            "SELECT public.insert_ticket_status_history(%d, %d, %d, %d, %d, %d, %d, %d);",
            $id_ticket,                          // p_id_ticket
            $id_user,                            // p_changedstatus_by
            $id_status_ticket,                   // p_new_status (del ticket principal)
            $id_accion_ticket,                   // p_new_action
            $id_new_status_lab,                  // p_new_status_lab
            $id_new_status_payment,              // p_new_status_payment
            $new_status_domiciliacion,           // p_new_status_domiciliacion
            $id_coordinador                      // p_id_coordinador
        );

        $resultsqlInsertHistory = $this->db->pgquery($sqlInsertHistory);
        if ($resultsqlInsertHistory === false) {
            error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket} - " . pg_last_error($this->db->getConnection()));
            return ['success' => false, 'message' => 'Error al registrar el historial del ticket.'];
        }

        // Si todo fue exitoso
        return ['success' => true, 'message' => 'Estado de domiciliación actualizado y historial registrado con éxito.'];

    } catch (Throwable $e) {
        // Manejo de la excepción general
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



    public function getTicketCountsGroupedByAction(){

        try {

            $sql = "SELECT * FROM get_tickets_by_action()";            

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



                $sql = "UPDATE tickets SET id_accion_ticket = ".(int)$id_accion_ticket.", comment_devolution = '".$comment."', id_status_payment = 15, devolution = true WHERE id_ticket = ".$ticketId.";";

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



                $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";

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

                    (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    (int)$id_status_ticket_history, // Usamos la acción específica para el historial

                    (int)$id_accion_ticket, // Usamos la acción específica para el historial

                    $id_new_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    (int)$id_coordinador

                );

                $sqlresultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                return array('save_result' => $result, 'history_result' => $sqlresultsqlInsertHistory);

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



                $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";

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

                    (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    (int)2, // Usamos la acción específica para el historial

                    (int)$id_accion_ticket, // Usamos la acción específica para el historial

                    $id_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    $id_coordinador

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

                $sql = "UPDATE tickets_status_lab SET repuesto_date = '".$repuesto_date."',  id_status_lab = ".$id_status_lab.", confirm_date = TRUE WHERE id_ticket = ".$ticketId.";";

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



                    $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }





                    $sqlInsertHistory = sprintf(

            "SELECT public.insert_ticket_status_historyDateRepuesto(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %s, %d::integer);",

                        (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    2, // Usamos la acción específica para el historial

                    (int)$id_accion_ticket, // Usamos la acción específica para el historial

                    (int)$id_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    $repuesto_date_sql,

                    $id_coordinador

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



                    $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }





                        $sqlInsertHistory = sprintf(

                        "SELECT public.insert_ticket_status_historyDateRepuesto(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %s, %d::integer);",

                        (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    2, // Usamos la acción específica para el historial

                    (int)$id_accion_ticket, // Usamos la acción específica para el historial

                    (int)$id_new_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    $repuesto_date_sql,

                    (int)$id_coordinador

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



                    $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }





                    $sqlInsertHistory = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                    (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    2, // Usamos la acción específica para el historial

                    13, // Usamos la acción específica para el historial

                    7,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    $id_coordinador

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
                    
                    // NO LONGER FORCING STATUS CHANGE - Preserve the status set in the workshop view
                    // The id_status_lab should remain as it was set by the user in the taller module
                    
                    
                    
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



                    $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }



                    $sqlInsertHistory = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    2, // Usamos la acción específica para el historial

                    17, // Usamos la acción específica para el historial

                    (int)$id_new_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    $id_coordinador

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



                    $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }



                    $sqlInsertHistory = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    2, // Usamos la acción específica para el historial

                    9, // Usamos la acción específica para el historial

                    (int)$id_new_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    $id_coordinador

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

            $sql = "UPDATE tickets SET id_accion_ticket = 16, id_status_ticket = 3, date_delivered = NOW(), customer_delivery_comment = '". $comment. "' WHERE id_ticket = ". (int)$id_ticket. ";";

            $result = Model::getResult($sql, $this->db);

            
            
            if ($result) {



              $sqldate = "UPDATE users_tickets SET date_end_ticket = NOW() WHERE id_ticket = ". (int)$id_ticket. ";";

              $resultdate = Model::getResult($sqldate, $this->db);

               if ($resultdate) {

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



                    $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }





                    $sqlInsertHistory = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    3, // Usamos la acción específica para el historial

                    16, // Usamos la acción específica para el historial

                    (int)$id_new_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    (int)$id_coordinador,

                    );



                    $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);



                    if ($resultsqlInsertHistory) {



                        $sqlInsertHistory1 = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                        (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                        (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                        3, // Usamos la acción específica para el historial

                        21, // Usamos la acción específica para el historial

                        (int)$id_new_status_lab,

                        $id_new_status_payment,

                        $new_status_domiciliacion,

                        (int)$id_coordinador,

                        );



                        $resultsqlInsertHistory1 = pg_query($this->db->getConnection(), $sqlInsertHistory1);



                        return $resultsqlInsertHistory1 && $result && $resultsqlInsertHistory;

                    }else{

                        return false;

                    }

                } else {

                    return false;

                }

            }else {

                return false;

            }

        } catch (Throwable $e) {

            return false; // Return false on error

        }
        
        

    }



    public function GetTicketDataForDelivery($id_ticket){

        try {

            $sql = "SELECT * FROM GetTicketDataForDelivery(".$id_ticket.")";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            // Handle exception

        }

    }



    public function EntregarTicketDevolucion($id_ticket, $id_user){

         try {

            $sql = "UPDATE tickets SET id_accion_ticket = 16, id_status_ticket = 3, date_delivered = NOW(), devolution = true, id_status_payment = 15 WHERE id_ticket = ". (int)$id_ticket. ";";

            $result = Model::getResult($sql, $this->db);
            
            



            if ($result) {



                $sqldate = "UPDATE users_tickets SET date_end_ticket = NOW() WHERE id_ticket = ". (int)$id_ticket. ";";

                $resultdate = Model::getResult($sqldate, $this->db);



                if ($resultdate) {



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



                    $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }





                    $sqlInsertHistory = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    3, // Usamos la acción específica para el historial

                    16, // Usamos la acción específica para el historial

                    (int)$id_new_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    (int)$id_coordinador

                    );



                    $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                    return $result && $resultsqlInsertHistory;



                    if ($resultsqlInsertHistory) {



                        $sqlInsertHistory1 = sprintf("SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",

                        (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                        (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                        3, // Usamos la acción específica para el historial

                        21, // Usamos la acción específica para el historial

                        (int)$id_new_status_lab,

                        $id_new_status_payment,

                        $new_status_domiciliacion,

                        (int)$id_coordinador

                        );

                        $resultsqlInsertHistory1 = pg_query($this->db->getConnection(), $sqlInsertHistory1);

                        return $resultsqlInsertHistory1;

                    }else{

                        error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($this->db->getConnection()));

                        return false;

                    }

                }else{

                    error_log("Error al actualizar en tickets para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($this->db->getConnection()));

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



                $sql = "UPDATE tickets SET id_accion_ticket = ".(int)$id_accion_ticket.", date_send_torosal_fromlab = NOW(), confirmrosal = TRUE WHERE id_ticket = ".$id_ticket.";";

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

                    (int)$id_ticket, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    (int)2, // Usamos la acción específica para el historial

                    (int)$id_accion_ticket, // Usamos la acción específica para el historial

                    $id_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    (int)$id_coordinador

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



                     $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";

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

                    (int)$ticketId, // Se asume que $id_ticket ya es un entero válido o se castea

                    (int)$id_user,   // Se asume que $id_user ya es un entero válido o se castea

                    (int)2, // Usamos la acción específica para el historial

                    (int)$id_accion_ticket, // Usamos la acción específica para el historial

                    $id_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    (int)$id_coordinador // Se asume que $id_coordinador ya es un entero válido o se castea

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



    public function SendToRegion($ticketId, $id_user, $componentes_array, $serial, $modulo) {

        try {

            $id_accion_ticket = 18;

            $modulo_insertcolumn = $modulo;

            
            
            // 1. Inicia una transacción

            pg_query($this->db->getConnection(), "BEGIN");



            // 2. Si hay componentes seleccionados, primero crea el registro de "Actualización de Componentes"

            if (is_array($componentes_array) && !empty($componentes_array)) {

                // Obtiene estados para el historial de componentes

                $id_status_ticket = 0;

                $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = " . (int)$ticketId . ";";

                $status_ticket_result = pg_query($this->db->getConnection(), $status_ticket_sql);

                if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {

                    $id_status_ticket = pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') ?? 0;

                }

                
                
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



                 $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }



                // Inserta el historial de "Actualización de Componentes" (id_accion_ticket = 20)

                $sqlInsertComponentHistory = sprintf(

                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",

                    (int)$ticketId,

                    (int)$id_user,

                    (int)$id_status_ticket,

                    (int)20, // id_accion_ticket para "Actualización de Componentes"

                    $id_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    $id_coordinador

                );

                $resultComponentHistory = pg_query($this->db->getConnection(), $sqlInsertComponentHistory);

                
                
                if ($resultComponentHistory === false) {

                    pg_query($this->db->getConnection(), "ROLLBACK");

                    return false;

                }



                // Ahora inserta los componentes en tickets_componets

                foreach ($componentes_array as $comp_id) {

                    $sqlcomponents = "INSERT INTO tickets_componets (serial_pos, id_ticket, id_components, id_user_carga, component_insert, modulo_insert) 

                                    VALUES ('" . pg_escape_string($this->db->getConnection(), $serial) . "', " . (int)$ticketId . ", " . (int)$comp_id . ", " . (int)$id_user . ", NOW(), '" . pg_escape_string($this->db->getConnection(), $modulo_insertcolumn) . "');";



                    $resultcomponent = pg_query($this->db->getConnection(), $sqlcomponents);

                    
                    
                    if ($resultcomponent === false) {

                        pg_query($this->db->getConnection(), "ROLLBACK");

                        return false;

                    }

                }

            }



            // 3. Actualiza el ticket

            $sql = "UPDATE tickets SET id_accion_ticket = " . (int)$id_accion_ticket . ", date_sentRegion = NOW() WHERE id_ticket = " . (int)$ticketId . ";";

            $result = Model::getResult($sql, $this->db);

            
            
            if (!$result) {

                pg_query($this->db->getConnection(), "ROLLBACK");

                return false;

            }



            // 4. Se obtienen los estados para el historial de "En espera de confirmar recibido en Región"

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



             $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";

                    $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                    if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                        $row_coordinador = pg_fetch_assoc($resultcoordinador);

                        $id_coordinador = (int) $row_coordinador['id_coordinador'];

                        pg_free_result($resultcoordinador);

                    }else{ 

                        $id_coordinador = null;

                    }
            
            

            // 5. Se inserta en el historial el estado "En espera de confirmar recibido en Región"

            $sqlInsertHistory = sprintf(

                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",

                (int)$ticketId,

                (int)$id_user,

                (int)2, // id_status_ticket (debe ser el valor correcto para el estado actual)

                (int)$id_accion_ticket, // 18 para "En espera de confirmar recibido en Región"

                $id_status_lab,

                $id_new_status_payment,

                $new_status_domiciliacion,

                $id_coordinador // id_coordinador

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



             $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";

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

                (int)$ticketId,

                (int)$id_user,

                (int)2,

                (int)$id_accion_ticket,

                $id_status_lab,

                $id_new_status_payment,

                $new_status_domiciliacion,

                $id_coordinador

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

    public function getMotivoRechazoDocumento($ticketId, $nroTicket, $documentType) {
        try {
            $db_conn = $this->db->getConnection();
            
            $escaped_ticket_id = pg_escape_literal($db_conn, $ticketId);
            $escaped_document_type = pg_escape_literal($db_conn, $documentType);
            
            // Obtener el motivo de rechazo del documento rechazado más reciente
            $sql = "SELECT 
                        aa.id_motivo_rechazo,
                        mr.name_motivo_rechazo
                    FROM archivos_adjuntos aa
                    INNER JOIN tickets t ON t.id_ticket = aa.id_ticket
                    LEFT JOIN motivos_rechazo mr ON mr.id_motivo_rechazo = aa.id_motivo_rechazo
                    WHERE aa.id_ticket = ".$escaped_ticket_id."
                    AND aa.document_type = ".$escaped_document_type."
                    AND aa.rechazado = 'TRUE'
                    ORDER BY aa.uploaded_at DESC
                    LIMIT 1";
            
            $result = $this->db->pgquery($sql);
            
            if ($result === false) {
                error_log("Error al consultar motivo de rechazo: " . pg_last_error($db_conn));
                return false;
            }
            
            if (pg_num_rows($result) === 0) {
                return false;
            }
            
            return pg_fetch_assoc($result);
            
        } catch (Throwable $e) {
            error_log("Excepción en getMotivoRechazoDocumento: " . $e->getMessage());
            return false;
        }
    }

    public function RechazarDocumentos($id_ticket, $id_motivo, $nro_ticket, $id_user, $document_type) {

        try {

            $db_conn = $this->db->getConnection();


            if ($document_type === 'Envio') {

                $id_new_status_payment = 14;

            } else if ($document_type === 'Anticipo') {

                $id_new_status_payment = 13;

            }else if($document_type === 'Exoneracion'){

                $id_new_status_payment = 12; // Valor por defecto

            }else if($document_type === 'convenio_firmado'){
                
                $id_new_status_payment = 'NULL';
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";
                $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $id_new_status_payment = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment')!== null? (int)pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') : 'NULL';
                }
                $new_status_domiciliacion = 7;
            }
            // Escapar los valores para prevenir inyecciones SQL

            $escaped_id_ticket = pg_escape_literal($db_conn, $id_ticket);

            $escaped_id_motivo = pg_escape_literal($db_conn, $id_motivo);

            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);

            $escaped_document_type = pg_escape_literal($db_conn, $document_type);



            // 2. Actualizar el archivo adjunto más reciente del ticket

            $sql = "UPDATE archivos_adjuntos 

            SET id_motivo_rechazo = $id_motivo, rechazado = 'TRUE' 

            WHERE id = (

                SELECT id 

                FROM archivos_adjuntos 

                WHERE nro_ticket = ".$escaped_nro_ticket." 

                AND document_type = ".$escaped_document_type."

                ORDER BY uploaded_at DESC 

                LIMIT 1

            );";
            
            $result = Model::getResult($sql, $this->db);



            // Si la primera actualización falla, no continuar

            if(!$result) {

                error_log("Error al actualizar archivos_adjuntos: ". pg_last_error($db_conn));

                return false;

            }



            // 3. Actualizar el estado de pago del ticket

            if($document_type !== 'convenio_firmado'){
                $sql1 = "UPDATE tickets SET id_status_payment = ".$id_new_status_payment." WHERE id_ticket = ".$escaped_id_ticket.";";
            }else{
                $sql1 = "UPDATE tickets_status_domiciliacion SET id_status_domiciliacion = ".$new_status_domiciliacion." WHERE id_ticket = ".$escaped_id_ticket.";";
            }
            $result1 = Model::getResult($sql1, $this->db);



            // Si la segunda actualización falla, no continuar

            if (!$result1) {

                error_log("Error al actualizar tickets: ". pg_last_error($db_conn));

                return false;

            }

            
            
            // 4. Obtener el rol del usuario (esto puede ser útil para futuras validaciones)

            $id_rolusr_sql = "SELECT usr.id_rolusr FROM users usr WHERE usr.id_user = ".$id_user.";";

            $result_idrolusr = pg_query($this->db->getConnection(), $id_rolusr_sql);

            $id_rol = ($result_idrolusr && pg_num_rows($result_idrolusr) > 0) ? (int)pg_fetch_result($result_idrolusr, 0, 'id_rolusr') : 0;

            
            
            // 5. Actualizar el coordinador si el rol no es 5

            if ($id_rol != 5) {

                $sqlgetcoordinador = "UPDATE users_tickets SET id_coordinador = $id_user WHERE id_ticket = ".$escaped_id_ticket." AND (id_coordinador IS NULL OR id_coordinador = 0);";

                $result2 = Model::getResult($sqlgetcoordinador, $this->db);



                if (!$result2) {

                    error_log("Error al actualizar id_coordinador: ". pg_last_error($db_conn));

                    return false;

                }



                  // 6. Obtener valores para el historial, centralizando las consultas

                $id_status_lab = 0;

                $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". (int)$id_ticket. ";";

                $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

                if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {

                    $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;

                }



                $new_status_domiciliacion = 'NULL';

                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = ". (int)$id_ticket. ";";

                $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);

                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {

                    $new_status_domiciliacion = (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') ?? 'NULL';

                }



                $id_status_ticket = 'NULL';

                $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";

                $status_ticket_result = pg_query($this->db->getConnection(), $status_ticket_sql);

                if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {

                    $id_status_ticket = (int)pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') ?? 'NULL';

                }



                $id_accion_ticket = 'NULL';

                $accion_ticket_sql = "SELECT id_accion_ticket FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";

                $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

                if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {

                    $id_accion_ticket = (int)pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket') ?? 'NULL';

                }

                
                
                $id_coordinador = 0;

                $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";

                $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

                if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                    $row_coordinador = pg_fetch_assoc($resultcoordinador);

                    $id_coordinador = (int) $row_coordinador['id_coordinador'];

                }



                // 7. Insertar en el historial de estado del ticket (esto se hace siempre)

                $sqlInsertHistory = sprintf(

                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",

                    (int)$id_ticket,

                    (int)$id_user,

                    (int)$id_status_ticket,

                    (int)$id_accion_ticket,

                    $id_status_lab,

                    $id_new_status_payment,

                    $new_status_domiciliacion,

                    $id_coordinador

                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);



                if(!$resultsqlInsertHistory){

                    error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($this->db->getConnection()));

                    return false;

                }



                // Si todo fue exitoso

                return true;

            }



            // 6. Obtener valores para el historial, centralizando las consultas

            $id_status_lab = 0;

            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". (int)$id_ticket. ";";

            $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

            if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {

                $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;

            }



            $new_status_domiciliacion = 'NULL';

            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = ". (int)$id_ticket. ";";

            $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);

            if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {

                $new_status_domiciliacion = (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') ?? 'NULL';

            }



            $id_status_ticket = 'NULL';

            $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";

            $status_ticket_result = pg_query($this->db->getConnection(), $status_ticket_sql);

            if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {

                $id_status_ticket = (int)pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') ?? 'NULL';

            }



            $id_accion_ticket = 'NULL';

            $accion_ticket_sql = "SELECT id_accion_ticket FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";

            $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

            if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {

                $id_accion_ticket = (int)pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket') ?? 'NULL';

            }

            
            
            $id_coordinador = 0;

            $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";

            $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

            if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {

                $row_coordinador = pg_fetch_assoc($resultcoordinador);

                $id_coordinador = (int) $row_coordinador['id_coordinador'];

            }



            // 7. Insertar en el historial de estado del ticket (esto se hace siempre)

            $sqlInsertHistory = sprintf(

                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",

                (int)$id_ticket,

                (int)$id_user,

                (int)$id_status_ticket,

                (int)$id_accion_ticket,

                $id_status_lab,

                $id_new_status_payment,

                $new_status_domiciliacion,

                $id_coordinador

            );

            $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);



            if(!$resultsqlInsertHistory){

                error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($this->db->getConnection()));

                return false;

            }



            // Si todo fue exitoso

            return true;



        } catch (Throwable $e) {

            error_log("Excepción en RechazarDocumentos: ". $e->getMessage());

            return false;

        }

    }



   public function AprobarDocumento($id_ticket, $nro_ticket, $id_user, $document_type, $nro_payment_reference_verified = '', $payment_date_verified = '') {
    try {
        $db_conn = $this->db->getConnection();

        // ✅ MANEJAR CONVENIO_FIRMADO DE FORMA ESPECIAL
        if ($document_type === 'convenio_firmado') {
            // Actualizar tickets_status_domiciliacion a 7
            $domiciliacion_sql = "UPDATE tickets_status_domiciliacion 
                                 SET id_status_domiciliacion = 6
                                 WHERE id_ticket = " . (int)$id_ticket;
            
            $domiciliacion_result = Model::getResult($domiciliacion_sql, $this->db);
            
            if (!$domiciliacion_result) {
                error_log("Error al actualizar tickets_status_domiciliacion para convenio_firmado");
                return false;
            }
            
            // Obtener el id_status_payment actual del ticket (sin cambiarlo)
            $current_payment_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . (int)$id_ticket;
            $current_payment_result = pg_query($this->db->getConnection(), $current_payment_sql);
            
            if ($current_payment_result && pg_num_rows($current_payment_result) > 0) {
                $id_new_status_payment = pg_fetch_result($current_payment_result, 0, 'id_status_payment');
            } else {
                $id_new_status_payment = 'NULL';
            }
            
            // Obtener el nuevo status de domiciliación (7)
            $new_status_domiciliacion = 6;
            
        } else {
            // ✅ LÓGICA NORMAL PARA OTROS DOCUMENTOS
            if ($document_type === 'Exoneracion') {
                $id_new_status_payment = 4;
            } else if ($document_type === 'Anticipo') {
                $id_new_status_payment = 6;
            }
            
            // Obtener el status de domiciliación actual (sin cambiarlo)
            $new_status_domiciliacion = 'NULL';
            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . (int)$id_ticket;
            $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);

            if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                $new_status_domiciliacion = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') !== null ? 
                    (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') : 'NULL';
            }
        }

        // ✅ ACTUALIZAR SOLO SI NO ES CONVENIO_FIRMADO
        if ($document_type !== 'convenio_firmado') {
            $sql1 = "UPDATE tickets SET id_status_payment = " . $id_new_status_payment . " WHERE id_ticket = " . $id_ticket;
            $result1 = Model::getResult($sql1, $this->db);

            if ($result1 === false) {
                error_log("Error al aprobar documentos: " . pg_last_error($db_conn));
                return false;
            }
        }
        
        // ✅ ACTUALIZAR payment_records SI ES ANTICIPO
        if ($document_type === 'Anticipo' && !empty($nro_ticket)) {
            // Construir la consulta UPDATE dinámicamente según los campos que tengan valores
            $updateFields = [];
            
            // Siempre actualizar confirmation_number a true
            $updateFields[] = "confirmation_number = true";
            
            // Actualizar id_status_payment a 6 (Aprobado)
            $updateFields[] = "payment_status = 6";
            
            // Agregar campos verificados si tienen valores
            if (!empty($nro_payment_reference_verified)) {
                $escaped_reference = pg_escape_literal($db_conn, $nro_payment_reference_verified);
                $updateFields[] = "nro_payment_reference_verified = " . $escaped_reference;
            }
            
            if (!empty($payment_date_verified)) {
                $escaped_date = pg_escape_literal($db_conn, $payment_date_verified);
                $updateFields[] = "payment_date_verified = " . $escaped_date;
            }
            
            // Construir y ejecutar la consulta UPDATE usando subconsulta para obtener el id más reciente
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            $sqlUpdatePayment = "UPDATE payment_records 
                                SET " . implode(", ", $updateFields) . "
                                WHERE id_payment_record = (
                                    SELECT id_payment_record 
                                    FROM payment_records 
                                    WHERE nro_ticket = " . $escaped_nro_ticket . "
                                    ORDER BY id_payment_record DESC
                                    LIMIT 1
                                );";
            
            $resultUpdatePayment = pg_query($db_conn, $sqlUpdatePayment);
            
            if ($resultUpdatePayment === false) {
                error_log("Error al actualizar payment_records para Anticipo: " . pg_last_error($db_conn));
                // No retornar false aquí, solo loguear el error para no afectar la aprobación
            } else {
                pg_free_result($resultUpdatePayment);
                error_log("payment_records actualizado correctamente para ticket: $nro_ticket");
            }
        }

        // ✅ RESTO DE LA LÓGICA IGUAL (obtener otros status, insertar historial, etc.)
        $id_status_lab = 0;
        $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . (int)$id_ticket;
        $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);

        if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
            $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;
        }

        $id_status_ticket = 'NULL';
        $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket;
        $status_ticket_result = pg_query($this->db->getConnection(), $status_ticket_sql);

        if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {
            $id_status_ticket = pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') !== null ? 
                (int)pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') : 'NULL';
        }

        $id_accion_ticket = 'NULL';
        $accion_ticket_sql = "SELECT id_accion_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket;
        $accion_ticket_result = pg_query($this->db->getConnection(), $accion_ticket_sql);

        if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
            $id_accion_ticket = pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket') !== null ? 
                (int)pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket') : 'NULL';
        }

        $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket}";
        $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);

        if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
            $row_coordinador = pg_fetch_assoc($resultcoordinador);
            $id_coordinador = (int)$row_coordinador['id_coordinador'];
            pg_free_result($resultcoordinador);
        } else {
            $id_coordinador = null;
        }

        // ✅ INSERTAR HISTORIAL CON LOS VALORES CORRECTOS
        $sqlInsertHistory = sprintf(
            "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",
            (int)$id_ticket,
            (int)$id_user,
            (int)$id_status_ticket,
            (int)$id_accion_ticket,
            $id_status_lab,
            $id_new_status_payment,
            $new_status_domiciliacion,
            $id_coordinador
        );

        $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

        if ($resultsqlInsertHistory === false) {
            error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: " . pg_last_error($db_conn));
            return false;
        }

        return true;

        } catch (Throwable $e) {
            error_log("Error al aprobar documentos: " . $e->getMessage());
            return false;
        }
    }



    public function GetEstatusTicket(){

        $sql = "SELECT * FROM get_status_tickets();";

        $result = Model::getResult($sql, $this->db);

        if ($result === false) {

            error_log("Error al consultar estatus de tickets: ". pg_last_error($this->db->getConnection()));

            return false;

        }

        return $result;

    }



    public function GetRegionTicket($id_user){

        try{

            $sql = "SELECT * FROM sp_verregionusers(".$id_user.")";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            // Manejar excepciones

        }

    }



    public function SendBackToTaller($id_ticket, $id_user){

        try {

            $db_conn = $this->db->getConnection();

            
            
            $sql1 = "UPDATE tickets SET id_accion_ticket = 7 WHERE id_ticket = ".$id_ticket.";";

            $result1 = Model::getResult($sql1, $this->db);



            if ($result1 === false) {

                error_log("Error al aprobar documentos: ". pg_last_error($db_conn));

                return false;

            } else{

                
                
                $sql2 = "INSERT INTO reingreso_lab (id_ticket, date_reingreso) VALUES (".$id_ticket.", NOW());";

                $result2 = Model::getResult($sql2, $this->db);




                    
                if ($result2 === false) {

                    error_log("Error al aprobar documentos: ". pg_last_error($db_conn));

                    return false;

               }else{

                    $sql3 = "UPDATE tickets_status_lab SET id_status_lab = 6, reentry_lab = TRUE, confirmreceive = FALSE  WHERE id_ticket = ".$id_ticket.";";

                    $result3 = Model::getResult($sql3, $this->db);

                        
                        
                    if($result3){

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



                        $id_new_status_payment = 'NULL';

                        $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";

                        $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

                        if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {

                            $id_new_status_payment = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment')!== null? (int)pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') : 'NULL';

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

                            8,

                            $id_new_status_payment,

                            $new_status_domiciliacion,

                            $id_coordinador

                        );



                        $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);



                        if ($resultsqlInsertHistory === false) {

                            error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($db_conn));

                            return false;

                        }

                        return true; 

                    }else{

                        if ($result2 === false) {

                            error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($db_conn));

                            return false;

                        }

                    }

                }

            }

        } catch (Throwable $e) {

            error_log("Error al aprobar documentos: " . $e->getMessage());

            return false;

        }

    }



    public function GetSimpleFailure($id_ticket){

        $sql = "SELECT tik.id_ticket, fail.id_failure, fail.name_failure FROM tickets tik INNER JOIN tickets_failures tikfail ON tikfail.id_ticket = tik.id_ticket INNER JOIN failures fail ON fail.id_failure = tikfail.id_failure WHERE tik.id_ticket =".$id_ticket.";";

        $result = Model::getResult($sql, $this->db);

        return $result;

    }



    public function ClosedTicket($id_ticket, $id_user){

          try {

            $db_conn = $this->db->getConnection();

            
            
            $sql1 = "UPDATE tickets SET id_accion_ticket = 5, id_status_ticket = 3 WHERE id_ticket = ".$id_ticket.";";

            $result1 = Model::getResult($sql1, $this->db);



            if ($result1 === false) {

                error_log("Error al aprobar documentos: ". pg_last_error($db_conn));

                return false;

            } else{

                
                
                $sql2 = "INSERT INTO reingreso_lab (id_ticket, date_reingreso) VALUES (".$id_ticket.", NOW());";

                $result2 = Model::getResult($sql2, $this->db);




                    
                if ($result2 === false) {

                    error_log("Error al aprobar documentos: ". pg_last_error($db_conn));

                    return false;

               }else{

                    $sql3 = "UPDATE tickets_status_lab SET id_status_lab = 8, reentry_lab = TRUE, confirmreceive = FALSE  WHERE id_ticket = ".$id_ticket.";";

                    $result3 = Model::getResult($sql3, $this->db);

                        
                        
                    if($result3){

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



                        $id_new_status_payment = 'NULL';

                        $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". (int)$id_ticket. ";";

                        $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);

                        if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {

                            $id_new_status_payment = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment')!== null? (int)pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') : 'NULL';

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

                            8,

                            $id_new_status_payment,

                            $new_status_domiciliacion,

                            $id_coordinador

                        );



                        $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);



                        if ($resultsqlInsertHistory === false) {

                            error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($db_conn));

                            return false;

                        }

                        return true; 

                    }else{

                        if ($result2 === false) {

                            error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: ". pg_last_error($db_conn));

                            return false;

                        }

                    }

                }

            }

        } catch (Throwable $e) {

            error_log("Error al aprobar documentos: " . $e->getMessage());

            return false;

        }

    }



    public function GetTicketReentry_lab($id_ticket){

        try {

            $db_conn = $this->db->getConnection();

            $escaped_id_ticket = pg_escape_literal($db_conn, $id_ticket);

            $sql = "SELECT * FROM GetTicketReingreLab(".$escaped_id_ticket.");";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetTicketReentry_lab: " . $e->getMessage());

            return false;

        }

    }



    public function GetTicketDataGestionComercial($id_user){

        $sql = "SELECT * FROM getdataticketGestionComercial(".$id_user.");";

        $result = Model::getResult($sql, $this->db);

        if ($result === false) {

            error_log("Error al consultar tickets de gestion comercial: ". pg_last_error($this->db->getConnection()));

            return false;

        }

        return $result;

    }



    public function GetBancoTicket(){

        try{

            $sql = "SELECT * FROM sp_verdatabanco()";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            // Manejar excepciones

        }

    }

    // Nueva: consulta directa a la tabla Accounts_banks
    public function GetAccountsBanks(){
        try{
            $sql = "SELECT id_bank, name_bank, cod_bank, nro_account FROM Accounts_banks ORDER BY id_bank ASC";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log('Error GetAccountsBanks: '. $e->getMessage());
            return false;
        }
    }

    public function GetTicketDataComponent(){

        try {

            $sql = "SELECT * FROM GetTicketWithcomponent_pos();";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetTicketReentry_lab: " . $e->getMessage());

            return false;

        }

    }

    public function GetComponentsBySerial($id_ticket, $serial){

        try {

            $sql = "SELECT * FROM component_pos('".$serial."', ".$id_ticket.");";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetTicketReentry_lab: " . $e->getMessage());

            return false;

        }

    }

    public function GetAllComponentsPOS(){

        try {

            $sql = "SELECT * FROM component_pos_all();";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetAllComponentsPOS: " . $e->getMessage());

            return false;

        }

    }

    public function GetPaymentMethods(){

        try {

            $sql = "SELECT id_payment_method, payment_method_code, payment_method_name, payment_method_description FROM public.payment_methods WHERE is_active = TRUE ORDER BY payment_method_name ASC";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetPaymentMethods: " . $e->getMessage());

            return false;

        }

    }

    public function GetExchangeRate(){

        try {

            $sql = "SELECT * FROM public.getexchangerate();";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetExchangeRate: " . $e->getMessage());

            return false;

        }

    }

    public function GetExchangeRateToday(){

        try {

            $sql = "SELECT * FROM public.get_exchange_rate_today();";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetExchangeRateToday: " . $e->getMessage());

            return false;

        }

    }

    public function GetExchangeRateByDate($fecha){

        try {
            // Validar y formatear la fecha a formato PostgreSQL (YYYY-MM-DD)
            // El input type="date" envía el formato YYYY-MM-DD, pero validamos por si acaso
            if (empty($fecha)) {
                error_log("Error en GetExchangeRateByDate: Fecha vacía");
                return false;
            }

            // Intentar parsear la fecha para asegurar formato correcto
            $fecha_timestamp = strtotime($fecha);
            if ($fecha_timestamp === false) {
                error_log("Error en GetExchangeRateByDate: Fecha inválida: " . $fecha);
                return false;
            }
            
            // Formatear a YYYY-MM-DD (formato estándar de PostgreSQL para DATE)
            $fecha_formateada = date('Y-m-d', $fecha_timestamp);
            
            // Usar ::date para hacer el cast explícito
            $escaped_fecha = pg_escape_literal($this->db->getConnection(), $fecha_formateada);
            $sql = "SELECT * FROM public.get_exchange_rate_by_date(" . $escaped_fecha . "::date);";

            error_log("GetExchangeRateByDate - SQL: " . $sql);
            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetExchangeRateByDate: " . $e->getMessage());

            return false;

        }

    }

    public function GetBancos(){

        try {

            $sql = "SELECT * FROM obtener_datos_banco();";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetBancos: " . $e->getMessage());

            return false;

        }

    }

    public function GetPaymentData($nro_ticket){

        try {

            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            $sql = "SELECT * FROM payment_records WHERE nro_ticket = " . $escaped_nro_ticket . " ORDER BY id_payment_record DESC LIMIT 1;";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetPaymentData: " . $e->getMessage());

            return false;

        }
    }

    public function SaveBudget($nro_ticket, $monto_taller, $diferencia_usd, $diferencia_bs, $descripcion_reparacion, $fecha_presupuesto, $presupuesto_numero, $user_creator){
        try {
            $db_conn = $this->db->getConnection();
            
            // Escapar parámetros
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            $escaped_monto_taller = (float)$monto_taller;
            $escaped_diferencia_usd = (float)$diferencia_usd;
            $escaped_diferencia_bs = (float)$diferencia_bs;
            $escaped_descripcion = $descripcion_reparacion ? pg_escape_literal($db_conn, $descripcion_reparacion) : 'NULL';
            $escaped_fecha_presupuesto = pg_escape_literal($db_conn, $fecha_presupuesto);
            $escaped_presupuesto_numero = $presupuesto_numero ? pg_escape_literal($db_conn, $presupuesto_numero) : 'NULL';
            $escaped_user_creator = $user_creator ? (int)$user_creator : 'NULL';
            
            // Insertar en la tabla budgets
            $sql = "
                INSERT INTO budgets (
                    nro_ticket,
                    monto_taller,
                    diferencia_usd,
                    diferencia_bs,
                    descripcion_reparacion,
                    fecha_presupuesto,
                    presupuesto_numero,
                    user_creator
                ) VALUES (
                    " . $escaped_nro_ticket . ",
                    " . $escaped_monto_taller . ",
                    " . $escaped_diferencia_usd . ",
                    " . $escaped_diferencia_bs . ",
                    " . $escaped_descripcion . ",
                    " . $escaped_fecha_presupuesto . ",
                    " . $escaped_presupuesto_numero . ",
                    " . $escaped_user_creator . "
                ) RETURNING id_budget, presupuesto_numero;
            ";
            
            $result = $this->db->pgquery($sql);
            
            if ($result === false) {
                error_log("Error al guardar presupuesto: " . pg_last_error($db_conn));
                return false;
            }
            
            $row = pg_fetch_assoc($result);
            $id_budget = (int)$row['id_budget'];
            $presupuesto_numero = $row['presupuesto_numero'];
            pg_free_result($result);
            
            return [
                'id_budget' => $id_budget,
                'presupuesto_numero' => $presupuesto_numero
            ];
            
        } catch (Throwable $e) {
            error_log("Error en SaveBudget: " . $e->getMessage());
            return false;
        }
    }
    
    public function UpdateVerifiedPaymentData($nro_ticket, $nro_payment_reference_verified, $payment_date_verified){
        try {
            $db_conn = $this->db->getConnection();
            
            // Escapar parámetros
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            
            // Construir la consulta UPDATE dinámicamente según los campos que tengan valores
            $updateFields = [];
            
            if (!empty($nro_payment_reference_verified)) {
                $escaped_reference = pg_escape_literal($db_conn, $nro_payment_reference_verified);
                $updateFields[] = "nro_payment_reference_verified = " . $escaped_reference;
            }
            
            if (!empty($payment_date_verified)) {
                $escaped_date = pg_escape_literal($db_conn, $payment_date_verified);
                $updateFields[] = "payment_date_verified = " . $escaped_date;
            }
            
            // Si no hay campos para actualizar, retornar true (no hay nada que hacer)
            if (empty($updateFields)) {
                return true;
            }
            
            // Construir y ejecutar la consulta UPDATE
            $sql = "UPDATE payment_records 
                    SET " . implode(", ", $updateFields) . "
                    WHERE nro_ticket = " . $escaped_nro_ticket . "
                    ORDER BY id_payment_record DESC
                    LIMIT 1;";
            
            $result = $this->db->pgquery($sql);
            
            if ($result === false) {
                error_log("Error al actualizar datos verificados de pago: " . pg_last_error($db_conn));
                return false;
            }
            
            pg_free_result($result);
            return true;
            
        } catch (Throwable $e) {
            error_log("Error en UpdateVerifiedPaymentData: " . $e->getMessage());
            return false;
        }
    }
    
    public function UpdatePresupuestoPDFPath($id_budget, $pdf_path){
        try {
            $db_conn = $this->db->getConnection();
            
            $escaped_id_budget = (int)$id_budget;
            $escaped_pdf_path = pg_escape_literal($db_conn, $pdf_path);
            
            $sql = "
                UPDATE budgets 
                SET pdf_path = " . $escaped_pdf_path . "
                WHERE id_budget = " . $escaped_id_budget . "
                RETURNING id_budget;
            ";
            
            $result = $this->db->pgquery($sql);
            
            if ($result === false) {
                error_log("Error al actualizar pdf_path del presupuesto: " . pg_last_error($db_conn));
                return false;
            }
            
            $row = pg_fetch_assoc($result);
            pg_free_result($result);
            
            return $row ? true : false;
            
        } catch (Throwable $e) {
            error_log("Error en UpdatePresupuestoPDFPath: " . $e->getMessage());
            return false;
        }
    }

    public function UpdatePresupuestoPDFPathByNroTicket($nro_ticket, $pdf_path){
        try {
            $db_conn = $this->db->getConnection();
            
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            $escaped_pdf_path = pg_escape_literal($db_conn, $pdf_path);
            
            $sql = "
                UPDATE budgets 
                SET pdf_path = " . $escaped_pdf_path . "
                WHERE nro_ticket = " . $escaped_nro_ticket . "
                RETURNING id_budget;
            ";
            
            $result = $this->db->pgquery($sql);
            
            if ($result === false) {
                error_log("Error al actualizar pdf_path del presupuesto por nro_ticket: " . pg_last_error($db_conn));
                return false;
            }
            
            $row = pg_fetch_assoc($result);
            pg_free_result($result);
            
            return $row ? true : false;
            
        } catch (Throwable $e) {
            error_log("Error en UpdatePresupuestoPDFPathByNroTicket: " . $e->getMessage());
            return false;
        }
    }

    public function GetTicketDetailsByNroTicket($nro_ticket){
        try {
            $db_conn = $this->db->getConnection();
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            
            $sql = "SELECT id_ticket, serial_pos, nro_ticket FROM tickets WHERE nro_ticket = " . $escaped_nro_ticket . " LIMIT 1;";
            
            $result = $this->db->pgquery($sql);
            
            if ($result === false) {
                error_log("Error al obtener detalles del ticket: " . pg_last_error($db_conn));
                return null;
            }
            
            $row = pg_fetch_assoc($result);
            pg_free_result($result);
            
            return $row ? $row : null;
            
        } catch (Throwable $e) {
            error_log("Error en GetTicketDetailsByNroTicket: " . $e->getMessage());
            return null;
        }
    }

    public function GetBudgetIdByNroTicket($nro_ticket){
        try {
            $db_conn = $this->db->getConnection();
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            
            $sql = "SELECT id_budget FROM budgets WHERE nro_ticket = " . $escaped_nro_ticket . " ORDER BY fecha_creacion DESC LIMIT 1;";
            
            $result = $this->db->pgquery($sql);
            
            if ($result === false) {
                error_log("Error al obtener id_budget: " . pg_last_error($db_conn));
                return null;
            }
            
            $row = pg_fetch_assoc($result);
            pg_free_result($result);
            
            return $row ? (int)$row['id_budget'] : null;
            
        } catch (Throwable $e) {
            error_log("Error en GetBudgetIdByNroTicket: " . $e->getMessage());
            return null;
        }
    }

    public function GetPresupuestoData($nro_ticket){

        try {

            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            
            // Usar función SQL que usa dblink para obtener datos de Intelipunto
            // Similar a get_tickets_pending_document_approval
            $sql = "SELECT * FROM get_presupuesto_data(" . $escaped_nro_ticket . ");";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetPresupuestoData: " . $e->getMessage());

            return false;

        }
    }

    public function GetEstatusPago(){
        try {

            $sql = "SELECT * FROM get_status_payment_by_id()";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            error_log("Error en GetEstatusPago: " . $e->getMessage());

            return false;

        }
    }

    public function SavePayment($serial_pos, $nro_ticket = null, $user_loader, $payment_date, $origen_bank, $destination_bank, $payment_method, $currency, $reference_amount, $amount_bs, $payment_reference, $depositor, $observations, $record_number, $loadpayment_date, $confirmation_number, $payment_status, $destino_rif_tipo = null, $destino_rif_numero = null, $destino_telefono = null, $destino_banco = null, $origen_rif_tipo = null, $origen_rif_numero = null, $origen_telefono = null, $origen_banco = null){

        try {
            // Si hay nro_ticket, insertar directamente en payment_records
            if (!empty($nro_ticket)) {
                $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
                $escaped_serial_pos = pg_escape_literal($this->db->getConnection(), $serial_pos);
                
                $sql = "INSERT INTO payment_records (
                    nro_ticket,
                    serial_pos,
                    user_loader,
                    payment_date,
                    origen_bank,
                    destination_bank,
                    payment_method,
                    currency,
                    reference_amount,
                    amount_bs,
                    payment_reference,
                    depositor,
                    observations,
                    record_number,
                    loadpayment_date,
                    confirmation_number,
                    payment_status,
                    destino_rif_tipo,
                    destino_rif_numero,
                    destino_telefono,
                    destino_banco,
                    origen_rif_tipo,
                    origen_rif_numero,
                    origen_telefono,
                    origen_banco
                ) VALUES (
                    " . $escaped_nro_ticket . ",
                    " . $escaped_serial_pos . ",
                    " . ($user_loader ? (int)$user_loader : "NULL") . ",
                    " . ($payment_date ? "'" . pg_escape_string($this->db->getConnection(), $payment_date) . "'" : "NULL") . ",
                    " . ($origen_bank ? pg_escape_literal($this->db->getConnection(), $origen_bank) : "NULL") . ",
                    " . ($destination_bank ? pg_escape_literal($this->db->getConnection(), $destination_bank) : "NULL") . ",
                    " . pg_escape_literal($this->db->getConnection(), $payment_method) . ",
                    " . pg_escape_literal($this->db->getConnection(), $currency) . ",
                    " . ($reference_amount ? (float)$reference_amount : "NULL") . ",
                    " . (float)$amount_bs . ",
                    " . ($payment_reference ? pg_escape_literal($this->db->getConnection(), $payment_reference) : "NULL") . ",
                    " . ($depositor ? pg_escape_literal($this->db->getConnection(), $depositor) : "NULL") . ",
                    " . ($observations ? pg_escape_literal($this->db->getConnection(), $observations) : "NULL") . ",
                    " . ($record_number ? pg_escape_literal($this->db->getConnection(), $record_number) : "NULL") . ",
                    " . ($loadpayment_date ? "'" . pg_escape_string($this->db->getConnection(), $loadpayment_date) . "'" : "NOW()") . ",
                    " . ($confirmation_number ? "TRUE" : "FALSE") . ",
                    " . ($payment_status ? (int)$payment_status : "1") . ",
                    " . ($destino_rif_tipo ? pg_escape_literal($this->db->getConnection(), $destino_rif_tipo) : "NULL") . ",
                    " . ($destino_rif_numero ? pg_escape_literal($this->db->getConnection(), $destino_rif_numero) : "NULL") . ",
                    " . ($destino_telefono ? pg_escape_literal($this->db->getConnection(), $destino_telefono) : "NULL") . ",
                    " . ($destino_banco ? pg_escape_literal($this->db->getConnection(), $destino_banco) : "NULL") . ",
                    " . ($origen_rif_tipo ? pg_escape_literal($this->db->getConnection(), $origen_rif_tipo) : "NULL") . ",
                    " . ($origen_rif_numero ? pg_escape_literal($this->db->getConnection(), $origen_rif_numero) : "NULL") . ",
                    " . ($origen_telefono ? pg_escape_literal($this->db->getConnection(), $origen_telefono) : "NULL") . ",
                    " . ($origen_banco ? pg_escape_literal($this->db->getConnection(), $origen_banco) : "NULL") . "
                ) RETURNING id_payment_record;";
                
                $result = Model::getResult($sql, $this->db);
                
                if ($result && $result['numRows'] > 0) {
                    $row = pg_fetch_assoc($result['query'], 0);
                    return $row['id_payment_record'];
                }
                
                return false;
            }
            
            // Si no hay nro_ticket, usar la tabla temporal (comportamiento original)
            $sql = "-- 1. CREACIÓN DE LA TABLA TEMPORAL (si no existe)
                    CREATE TEMPORARY TABLE IF NOT EXISTS temp_payment_uploads (
                        id_payment_record SERIAL PRIMARY KEY,
                        serial_pos VARCHAR(225) NOT NULL,
                        user_loader integer,
                        payment_date timestamp without time zone,
                        origen_bank text,
                        destination_bank text,
                        payment_method VARCHAR(50) NOT NULL,
                        currency VARCHAR(10) NOT NULL,
                        reference_amount DECIMAL(15, 2),
                        amount_bs DECIMAL(15, 2) NOT NULL,
                        payment_reference VARCHAR(100),
                        depositor VARCHAR(200),
                        observations TEXT,
                        record_number VARCHAR(50),
                        loadpayment_date timestamp without time zone,
                        confirmation_number BOOLEAN,
                        payment_status integer,
                        destino_rif_tipo VARCHAR(1),
                        destino_rif_numero VARCHAR(20),
                        destino_telefono VARCHAR(20),
                        destino_banco VARCHAR(100),
                        origen_rif_tipo VARCHAR(1),
                        origen_rif_numero VARCHAR(20),
                        origen_telefono VARCHAR(20),
                        origen_banco VARCHAR(100)
                    )
                    ON COMMIT PRESERVE ROWS; -- La tabla persiste durante toda la sesión, pero se elimina al cerrar la conexión.

                    -- 2. INSERCIÓN DE DATOS EN LA MISMA TABLA TEMPORAL
                    INSERT INTO temp_payment_uploads (
                        serial_pos,
                        user_loader,
                        payment_date,
                        origen_bank,
                        destination_bank,
                        payment_method,
                        currency,
                        reference_amount,
                        amount_bs,
                        payment_reference,
                        depositor,
                        observations,
                        record_number,
                        loadpayment_date,
                        confirmation_number,
                        payment_status,
                        destino_rif_tipo,
                        destino_rif_numero,
                        destino_telefono,
                        destino_banco,
                        origen_rif_tipo,
                        origen_rif_numero,
                        origen_telefono,
                        origen_banco
                    ) VALUES (
                        " . pg_escape_literal($this->db->getConnection(), $serial_pos) . ",
                        " . ($user_loader ? (int)$user_loader : "NULL") . ",
                        " . ($payment_date ? "'" . pg_escape_string($this->db->getConnection(), $payment_date) . "'" : "NULL") . ",
                        " . ($origen_bank ? pg_escape_literal($this->db->getConnection(), $origen_bank) : "NULL") . ",
                        " . ($destination_bank ? pg_escape_literal($this->db->getConnection(), $destination_bank) : "NULL") . ",
                        " . pg_escape_literal($this->db->getConnection(), $payment_method) . ",
                        " . pg_escape_literal($this->db->getConnection(), $currency) . ",
                        " . ($reference_amount ? (float)$reference_amount : "NULL") . ",
                        " . (float)$amount_bs . ",
                        " . ($payment_reference ? pg_escape_literal($this->db->getConnection(), $payment_reference) : "NULL") . ",
                        " . ($depositor ? pg_escape_literal($this->db->getConnection(), $depositor) : "NULL") . ",
                        " . ($observations ? pg_escape_literal($this->db->getConnection(), $observations) : "NULL") . ",
                        " . ($record_number ? pg_escape_literal($this->db->getConnection(), $record_number) : "NULL") . ",
                        " . ($loadpayment_date ? "'" . pg_escape_string($this->db->getConnection(), $loadpayment_date) . "'" : "NOW()") . ",
                        " . ($confirmation_number ? "TRUE" : "FALSE") . ",
                        " . ($payment_status ? (int)$payment_status : "1") . ",
                        " . ($destino_rif_tipo ? pg_escape_literal($this->db->getConnection(), $destino_rif_tipo) : "NULL") . ",
                        " . ($destino_rif_numero ? pg_escape_literal($this->db->getConnection(), $destino_rif_numero) : "NULL") . ",
                        " . ($destino_telefono ? pg_escape_literal($this->db->getConnection(), $destino_telefono) : "NULL") . ",
                        " . ($destino_banco ? pg_escape_literal($this->db->getConnection(), $destino_banco) : "NULL") . ",
                        " . ($origen_rif_tipo ? pg_escape_literal($this->db->getConnection(), $origen_rif_tipo) : "NULL") . ",
                        " . ($origen_rif_numero ? pg_escape_literal($this->db->getConnection(), $origen_rif_numero) : "NULL") . ",
                        " . ($origen_telefono ? pg_escape_literal($this->db->getConnection(), $origen_telefono) : "NULL") . ",
                        " . ($origen_banco ? pg_escape_literal($this->db->getConnection(), $origen_banco) : "NULL") . "
                    ) RETURNING id_payment_record;";
            $result = Model::getResult($sql, $this->db);

            if ($result && $result['numRows'] > 0) {
                $row = pg_fetch_assoc($result['query'], 0);
                return $row['id_payment_record'];
            }

            return false;

        } catch (Throwable $e) {

            error_log("Error en SavePayment: " . $e->getMessage());

            return false;

        }

    }

    /**
     * Transfiere el pago de la tabla temporal a la tabla principal cuando se crea el ticket
     * 
     * @param string $serial_pos Serial del POS
     * @param string $nro_ticket Número del ticket creado
     * @return bool|int ID del registro insertado en payment_records o false en caso de error
     */
    public function TransferPaymentFromTempToMain($serial_pos, $nro_ticket) {
        try {
            $db_conn = $this->db->getConnection();
            
            // Escapar parámetros
            $escaped_serial = pg_escape_literal($db_conn, $serial_pos);
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            
            error_log("TransferPaymentFromTempToMain: Iniciando transferencia para serial: " . $serial_pos . ", nro_ticket: " . $nro_ticket);
            
            // Primero intentar buscar directamente en la tabla temporal
            // Si la tabla no existe, simplemente retornaremos true (no es un error)
            $sql_select = "
                SELECT 
                    id_payment_record,
                    serial_pos,
                    user_loader,
                    payment_date,
                    origen_bank,
                    destination_bank,
                    payment_method,
                    currency,
                    reference_amount,
                    amount_bs,
                    payment_reference,
                    depositor,
                    observations,
                    record_number,
                    loadpayment_date,
                    confirmation_number,
                    payment_status,
                    destino_rif_tipo,
                    destino_rif_numero,
                    destino_telefono,
                    destino_banco,
                    origen_rif_tipo,
                    origen_rif_numero,
                    origen_telefono,
                    origen_banco
                FROM temp_payment_uploads
                WHERE serial_pos = " . $escaped_serial . "
                ORDER BY id_payment_record DESC
                LIMIT 1;
            ";
            
            $result_select = $this->db->pgquery($sql_select);
            
            // Si hay error porque la tabla no existe, simplemente retornar true
            if ($result_select === false) {
                $error = pg_last_error($db_conn);
                if (strpos($error, 'does not exist') !== false || strpos($error, 'no existe') !== false) {
                    // La tabla temporal no existe, no hay pago para transferir
                    error_log("TransferPaymentFromTempToMain: Tabla temporal no existe para serial: " . $serial_pos);
                    return true;
                }
                error_log("Error al buscar pago temporal: " . $error);
                return false;
            }
            
            // Si no hay registros, retornar true (no es un error)
            if (pg_num_rows($result_select) == 0) {
                error_log("TransferPaymentFromTempToMain: No se encontraron registros en tabla temporal para serial: " . $serial_pos);
                pg_free_result($result_select);
                return true;
            }
            
            $payment_data = pg_fetch_assoc($result_select);
            pg_free_result($result_select);
            
            error_log("TransferPaymentFromTempToMain: Registro encontrado en tabla temporal. ID: " . $payment_data['id_payment_record'] . ", Serial: " . $payment_data['serial_pos']);
            
            // Insertar en payment_records con el nro_ticket
            $sql_insert = "
                INSERT INTO payment_records (
                    nro_ticket,
                    serial_pos,
                    user_loader,
                    payment_date,
                    origen_bank,
                    destination_bank,
                    payment_method,
                    currency,
                    reference_amount,
                    amount_bs,
                    payment_reference,
                    depositor,
                    observations,
                    record_number,
                    loadpayment_date,
                    confirmation_number,
                    payment_status,
                    destino_rif_tipo,
                    destino_rif_numero,
                    destino_telefono,
                    destino_banco,
                    origen_rif_tipo,
                    origen_rif_numero,
                    origen_telefono,
                    origen_banco
                ) VALUES (
                    " . $escaped_nro_ticket . ",
                    " . pg_escape_literal($db_conn, $payment_data['serial_pos']) . ",
                    " . ($payment_data['user_loader'] ? (int)$payment_data['user_loader'] : "NULL") . ",
                    " . ($payment_data['payment_date'] ? "'" . pg_escape_string($db_conn, $payment_data['payment_date']) . "'" : "NULL") . ",
                    " . ($payment_data['origen_bank'] ? pg_escape_literal($db_conn, $payment_data['origen_bank']) : "NULL") . ",
                    " . ($payment_data['destination_bank'] ? pg_escape_literal($db_conn, $payment_data['destination_bank']) : "NULL") . ",
                    " . pg_escape_literal($db_conn, $payment_data['payment_method']) . ",
                    " . pg_escape_literal($db_conn, $payment_data['currency']) . ",
                    " . ($payment_data['reference_amount'] ? (float)$payment_data['reference_amount'] : "NULL") . ",
                    " . (float)$payment_data['amount_bs'] . ",
                    " . ($payment_data['payment_reference'] ? pg_escape_literal($db_conn, $payment_data['payment_reference']) : "NULL") . ",
                    " . ($payment_data['depositor'] ? pg_escape_literal($db_conn, $payment_data['depositor']) : "NULL") . ",
                    " . ($payment_data['observations'] ? pg_escape_literal($db_conn, $payment_data['observations']) : "NULL") . ",
                    " . ($payment_data['record_number'] ? pg_escape_literal($db_conn, $payment_data['record_number']) : "NULL") . ",
                    " . ($payment_data['loadpayment_date'] ? "'" . pg_escape_string($db_conn, $payment_data['loadpayment_date']) . "'" : "NOW()") . ",
                    FALSE, -- confirmation_number siempre se guarda como FALSE, será TRUE cuando se verifique el documento de pago
                    " . ($payment_data['payment_status'] ? (int)$payment_data['payment_status'] : "1") . ",
                    " . ($payment_data['destino_rif_tipo'] ? pg_escape_literal($db_conn, $payment_data['destino_rif_tipo']) : "NULL") . ",
                    " . ($payment_data['destino_rif_numero'] ? pg_escape_literal($db_conn, $payment_data['destino_rif_numero']) : "NULL") . ",
                    " . ($payment_data['destino_telefono'] ? pg_escape_literal($db_conn, $payment_data['destino_telefono']) : "NULL") . ",
                    " . ($payment_data['destino_banco'] ? pg_escape_literal($db_conn, $payment_data['destino_banco']) : "NULL") . ",
                    " . ($payment_data['origen_rif_tipo'] ? pg_escape_literal($db_conn, $payment_data['origen_rif_tipo']) : "NULL") . ",
                    " . ($payment_data['origen_rif_numero'] ? pg_escape_literal($db_conn, $payment_data['origen_rif_numero']) : "NULL") . ",
                    " . ($payment_data['origen_telefono'] ? pg_escape_literal($db_conn, $payment_data['origen_telefono']) : "NULL") . ",
                    " . ($payment_data['origen_banco'] ? pg_escape_literal($db_conn, $payment_data['origen_banco']) : "NULL") . "
                ) RETURNING id_payment_record;
            ";
            
            $result_insert = $this->db->pgquery($sql_insert);
            
            if ($result_insert === false) {
                $error = pg_last_error($db_conn);
                error_log("Error al insertar pago en payment_records: " . $error);
                error_log("SQL: " . $sql_insert);
                return false;
            }
            
            $new_record = pg_fetch_assoc($result_insert);
            $new_id = (int)$new_record['id_payment_record'];
            pg_free_result($result_insert);
            
            error_log("TransferPaymentFromTempToMain: Pago insertado exitosamente en payment_records. ID: " . $new_id . ", nro_ticket: " . $nro_ticket);
            
            // Eliminar el registro de la tabla temporal
            $sql_delete = "
                DELETE FROM temp_payment_uploads
                WHERE id_payment_record = " . (int)$payment_data['id_payment_record'] . ";
            ";
            
            $result_delete = $this->db->pgquery($sql_delete);
            
            if ($result_delete === false) {
                error_log("Advertencia: No se pudo eliminar el registro temporal, pero el pago se insertó correctamente. ID: " . $new_id);
            } else {
                pg_free_result($result_delete);
            }
            
            return $new_id;
            
        } catch (Throwable $e) {
            error_log("Error en TransferPaymentFromTempToMain: " . $e->getMessage());
            return false;
        }
    }

    public function CheckPaymentExistsToday($serial_pos){
        try {
            $db_conn = $this->db->getConnection();
            $escaped_serial = pg_escape_literal($db_conn, $serial_pos);
            
            // Verificar si existe un pago en la tabla temporal para este serial
            // La tabla temporal es por sesión, así que necesitamos verificar si existe primero
            // Buscar por serial_pos sin restricción de fecha para encontrar cualquier registro pendiente
            $sql = "
                SELECT COUNT(*) as count
                FROM temp_payment_uploads
                WHERE serial_pos = " . $escaped_serial . ";
            ";
            
            $result = $this->db->pgquery($sql);
            
            if ($result === false) {
                $error = pg_last_error($db_conn);
                // Si la tabla no existe, significa que no hay pagos registrados
                if (strpos($error, 'does not exist') !== false || strpos($error, 'no existe') !== false) {
                    return false;
                }
                error_log("Error en CheckPaymentExistsToday: " . $error);
                return false;
            }
            
            $row = pg_fetch_assoc($result);
            pg_free_result($result);
            
            return isset($row['count']) && intval($row['count']) > 0;
            
        } catch (Throwable $e) {
            error_log("Error en CheckPaymentExistsToday: " . $e->getMessage());
            return false;
        }
    }

    public function GetTicketByNro($nro_ticket, $idusers = null, $tipousers = null){
        try
            {
            $db_conn = $this->db->getConnection();
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            $idusers = is_numeric($idusers) ? (int)$idusers : 0;
            $tipousers = is_numeric($tipousers) ? (int)$tipousers : 0;

            $sql = "SELECT * FROM public.getticketsbynro_ticket(" . $escaped_nro_ticket . ", " . $idusers . ", " . $tipousers . ")";
            $result = Model::getResult($sql, $this->db);

            if ($result === false) {
                error_log("Error al obtener nro_ticket: " . pg_last_error($db_conn));
                return null;    
            }
            
            return $result;
            
        } catch (Throwable $e) {
            error_log("Error en GetBudgetIdByNroTicket: " . $e->getMessage());
            return null;
        }
    }
}
?>