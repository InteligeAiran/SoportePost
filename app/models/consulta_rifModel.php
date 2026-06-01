<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */

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




    
    /* DUPLICATE REMOVED */


/*      try {

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

    } */



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





    public function SaveDataFalla($serial, $falla, $nivelFalla, $id_user, $rif, $Nr_ticket, $descripcion_falla, $razonsocial, $id_client, $id_intelipunto)
    {
        try {
            // 1. Escapar y preparar TODOS los parámetros para la BD
            $escaped_serial = pg_escape_literal($this->db->getConnection(), $serial);
            $escaped_nivelFalla = (int)$nivelFalla;
            $escaped_rif = pg_escape_literal($this->db->getConnection(), $rif);
            $escaped_Nr_ticket = pg_escape_literal($this->db->getConnection(), $Nr_ticket);
            $escaped_descripcion_falla = pg_escape_literal($this->db->getConnection(), $descripcion_falla);
            
            // Preparar los nuevos campos (manejando nulos si vienen vacíos)
            $val_razonsocial = $razonsocial ? pg_escape_literal($this->db->getConnection(), $razonsocial) : 'NULL';
            $val_id_client = $id_client ? (int)$id_client : 'NULL';
            $val_id_intelipunto = $id_intelipunto ? (int)$id_intelipunto : 'NULL';

            // 2. Llamar al SP pasando los 8 parámetros directamente en una sola línea
            $sqlSave = "SELECT public.savedatafalla($escaped_serial, $escaped_nivelFalla, $escaped_rif, $escaped_Nr_ticket, $escaped_descripcion_falla, $val_razonsocial, $val_id_client, $val_id_intelipunto);";

            $resultSave = $this->db->pgquery($sqlSave);

            if (!$resultSave) {
                 error_log("Error en SaveDataFalla (SP): " . pg_last_error($this->db->getConnection()));
                 return ['success' => false, 'message' => 'Error al guardar (SP).'];
            }

            $ticketData = pg_fetch_assoc($resultSave);

            // Validar que realmente devolvió el ID
            if (!$ticketData || !isset($ticketData['savedatafalla'])) {
                error_log("Error: No se pudo obtener el ID del ticket de SaveDataFalla.");
                $this->db->closeConnection();
                return array('error' => 'Error al obtener ID del ticket.');
            }

            $idTicketCreado = (int) $ticketData['savedatafalla'];
            pg_free_result($resultSave); 


            // 3. Obtener el estado del ticket recién creado
            // ELIMINADO: Ya no hace falta el UPDATE manual aquí, la función de BD lo hizo en el INSERT.

            // 3. Obtener el estado del ticket recién creado
            $SearchStatus = $this->getStatusTicket($idTicketCreado);

            if (!$SearchStatus) {
                error_log("Error: No se pudo obtener el estado del ticket para ID: " . $idTicketCreado);
                $this->db->closeConnection();
                return array('error' => 'Error al obtener estado del ticket.');
            }

            // 4. Ejecutar la función para insertar la falla (Ticket Failure)
            $escaped_id_ticket = pg_escape_literal($this->db->getConnection(), $idTicketCreado);
            $escaped_falla = (int)$falla; // Aquí se usa el parámetro de falla que llega a la función PHP

            $sqlFailure = "SELECT public.InsertTicketFailure(" . $escaped_id_ticket . ", " . $escaped_falla . ");";
            $resultFailure = $this->db->pgquery($sqlFailure);

            if (!$resultFailure) {
                error_log("Error en InsertTicketFailure: " . pg_last_error($this->db->getConnection()));
                $this->db->closeConnection();
                return array('error' => 'Error al insertar la falla del ticket.');
            }
            pg_free_result($resultFailure);

            // 5. Ejecutar la función para insertar en users_tickets
            $val_id_coordinator = 'NULL';
            $val_date_sendcoordinator = 'NULL';
            $val_id_tecnico_n2 = 'NULL';
            $val_date_assign_tec2 = 'NULL';

            $sqlInsertUserTicket = sprintf("SELECT public.insertintouser_ticket(%d::integer, %d::integer, NOW()::timestamp without time zone, NOW()::timestamp without time zone, %s::integer, %s::timestamp without time zone, %s::integer, %s::timestamp without time zone);", 
                $idTicketCreado, 
                (int) $id_user, // Aquí se usa el ID del usuario que crea el ticket
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
            pg_free_result($resultUserTicket);

            // 6. Retorno exitoso
            return array(
                'success' => true,
                'idTicketCreado' => $idTicketCreado,
                'status_info' => $SearchStatus 
            );

        } catch (Throwable $e) {
            error_log("Excepción en Model::SaveDataFalla (General): " . $e->getMessage());
            $this->db->closeConnection();
            return array('error' => $e->getMessage());
        }
    }

    /**
     * Guarda una solicitud administrativa en la base de datos.
     * 
     * @param int $id_client El ID del cliente (id_cliente)
     * @param int $id_user El ID del usuario creador
     * @param string $observacion Observaciones de la solicitud
     * @param int $id_type ID del tipo de solicitud (1=GRS, 2=GMB)
     * @param int|null $id_intelipunto ID del cliente en la base de datos de Intelipunto
     * @return array|bool Array con ID y request_number o false en caso de error
     */
    public function SaveAdministrativeRequest($id_client, $id_user, $observacion, $id_type, $id_intelipunto = null)
    {
        error_log("DEBUG: Entrando a SaveAdministrativeRequest. Cliente: $id_client, Tipo: $id_type, Intelipunto: $id_intelipunto");
        try {
            $db_conn = $this->db->getConnection();
            $val_id_client = (int)$id_client;
            $val_id_user = (int)$id_user;
            $val_id_type = (int)$id_type;
            $val_observacion = pg_escape_literal($db_conn, $observacion);

            // 0. Validar si ya existe una solicitud pendiente o en gestión (Estatu 1 o 2)
            $sqlCheck = "SELECT nro_solicitud FROM administrative_requests 
                         WHERE id_cliente = $val_id_client 
                         AND id_status_administrativo IN (1, 2) 
                         LIMIT 1";
            $resCheck = pg_query($db_conn, $sqlCheck);
            if ($resCheck && pg_num_rows($resCheck) > 0) {
                $existing = pg_fetch_assoc($resCheck);
                return ['error' => 'duplicate', 'nro_solicitud' => $existing['nro_solicitud']];
            }

            // 1. Obtener el prefijo y nombre del tipo
            $sqlTypeData = "SELECT prefix, name FROM administrative_request_types WHERE id = $val_id_type";
            $resTypeData = pg_query($db_conn, $sqlTypeData);
            $typeData = ($resTypeData && pg_num_rows($resTypeData) > 0) ? pg_fetch_assoc($resTypeData) : ['prefix' => 'REQ', 'name' => 'Administrative Request'];
            $prefix = $typeData['prefix'];
            $typeName = $typeData['name'];

            // 2. Insertar para obtener el ID real
            $sql = "INSERT INTO administrative_requests (id_cliente, id_user_creation, observacion, id_status_administrativo, id_tipo_solicitud) 
                    VALUES ($val_id_client, $val_id_user, $val_observacion, 1, $val_id_type) 
                    RETURNING id;";

            $result = pg_query($db_conn, $sql);

            if ($result) {
                $row = pg_fetch_assoc($result);
                $newId = (int)$row['id'];
                pg_free_result($result);

                // 3. Generar Number Formato: SIGLAS-DDMMYY####
                $datePart = date('dmy'); 
                $nroSolicitud = $prefix . "-" . $datePart . str_pad($newId, 4, '0', STR_PAD_LEFT);
                
                $sqlUpd = "UPDATE administrative_requests SET nro_solicitud = ".pg_escape_literal($db_conn, $nroSolicitud)." WHERE id = $newId";
                $resUpd = pg_query($db_conn, $sqlUpd);

                if ($resUpd) {
                    error_log("DEBUG: Solicitud $nroSolicitud verificada en tabla administrativa. Procediendo a Intelipunto...");
                    
                    // 4. ACTUALIZAR ESTATUS EN INTELIPUNTO
                    // Priorizamos el ID de Soporte Post (id_client) que es el que el usuario usa para vincular (ej. 7473)
                    $idToUpdate = !empty($id_client) ? $id_client : $id_intelipunto;
                    
                    if ($idToUpdate) {
                        try {
                        // Obtener configuración del dblink para intelipunto
                        $sqlDblink = "SELECT host, port, dbname, username, password FROM dblink_configs WHERE config_name = 'intelipunto_db'";
                        $resDblink = pg_query($db_conn, $sqlDblink);
                        if ($resDblink && pg_num_rows($resDblink) > 0) {
                            $dbConf = pg_fetch_assoc($resDblink);
                            $connStr = "host={$dbConf['host']} port={$dbConf['port']} dbname={$dbConf['dbname']} user={$dbConf['username']} password={$dbConf['password']}";
                            
                            $val_id_int = (int)$idToUpdate;
                            // Ejecutar UPDATE en Intelipunto vía dblink_exec usando id_consecutivo (valor 1 como entero)
                            $sqlUpdateIntel = "SELECT dblink_exec('$connStr', 'UPDATE clie_tblclientepotencial SET estatus_solicitud = 1 WHERE id_consecutivo = $val_id_int')";                            
                            error_log("DEBUG: Intentando actualizar Intelipunto. ID: $val_id_int");
                            $resUpdate = pg_query($db_conn, $sqlUpdateIntel);
                            
                            if (!$resUpdate) {
                                error_log("ERROR DBLINK: " . pg_last_error($db_conn));
                            } else {
                                error_log("DEBUG: dblink_exec ejecutado aparentemente con éxito.");
                            }
                        } else {
                            error_log("ERROR: No se encontró la configuración 'intelipunto_db' en dblink_configs.");
                        }
                    } catch (Throwable $e_int) {
                        error_log("Excepción actualizando estatus en Intelipunto: " . $e_int->getMessage());
                    }
                }
            }

                return [
                    'id' => $newId, 
                    'nro_solicitud' => $nroSolicitud,
                    'type_name' => $typeName 
                ];
            } else {
                error_log("Error en SaveAdministrativeRequest: " . pg_last_error($db_conn));
                return false;
            }
        } catch (Throwable $e) {
            error_log("Excepción en SaveAdministrativeRequest: " . $e->getMessage());
            return false;
        }
    }


    public function SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $id_status_payment, $id_user, $rif, $Nr_ticket, $razonsocial, $id_client, $id_intelipunto, $envio = null, $exoneracion = null, $anticipo = null) // Añadí variables de archivo como parámetros opcionales que usas en el código
    {
        try {
            $db_conn = $this->db->getConnection();

            // 1. Escapar y preparar datos base
            $escaped_serial = pg_escape_literal($db_conn, $serial);
            $escaped_descripcion = pg_escape_literal($db_conn, $descripcion);
            $escaped_rif = pg_escape_literal($db_conn, $rif);
            $escaped_Nr_ticket = pg_escape_literal($db_conn, $Nr_ticket);

            // Preparar nuevos campos (manejando nulos)
            $val_razonsocial = $razonsocial ? pg_escape_literal($db_conn, $razonsocial) : 'NULL';
            $val_id_client = $id_client ? (int)$id_client : 'NULL';
            $val_id_intelipunto = $id_intelipunto ? (int)$id_intelipunto : 'NULL';

            // 2. Construir la llamada a save_data_failure2 con los 8 parámetros
            $sql = "SELECT * FROM public.save_data_failure2("
                . $escaped_serial . "::TEXT, "
                . (int) $nivelFalla . "::INTEGER, "
                . (int) $id_status_payment . "::INTEGER, "
                . $escaped_rif . "::VARCHAR, "
                . $escaped_Nr_ticket . "::VARCHAR, "
                . $val_razonsocial . "::VARCHAR, "
                . $val_id_client . "::INTEGER, "
                . $val_id_intelipunto . "::INTEGER);";

            $result = $this->db->pgquery($sql);

            if ($result === false) {
                error_log("Error al ejecutar save_data_failure2: " . pg_last_error($db_conn) . " Query: " . $sql);
                return ['error' => 'Error al insertar datos de falla principal.'];
            }

            $ticketData = pg_fetch_assoc($result);
            pg_free_result($result); 

            if (!isset($ticketData['save_data_failure2']) || $ticketData['save_data_failure2'] == 0) {
                error_log("Error: La función save_data_failure2 no devolvió un ID de ticket válido o devolvió 0.");
                return ['error' => 'Error al obtener ID del ticket de la base de datos.'];
            }

            $idTicketCreado = (int) $ticketData['save_data_failure2'];

            // ELIMINADO: Ya no hace falta el UPDATE manual.

            // 3. Insertar TicketFailure
            $sqlFailure = "SELECT public.InsertTicketFailure(" . (int) $idTicketCreado . ", " . $escaped_descripcion . ");";
            $resultFailure = $this->db->pgquery($sqlFailure);

            if ($resultFailure === false) {
                error_log("Error al insertar TicketFailure: " . pg_last_error($db_conn) . " Query: " . $sqlFailure);
                return ['error' => 'Error al insertar falla específica del ticket.'];
            }
            pg_free_result($resultFailure);

            // 4. Llamar a insertintouser_ticket
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
            pg_free_result($resultUserTicket);

            // 5. Insertar en ticket_status_history - PRIMERA ENTRADA: "crear ticket"
            $id_accion_ticket_crear = 0; 
            $id_status_ticket_inicial = 1; 
            $id_status_domiciliacion_inicial = 1; 

            $sqlInsertHistoryCrear = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, NULL::integer, %d::integer, %d::integer, %d::integer);",
                (int) $idTicketCreado,
                (int) $id_user,
                (int) $id_status_ticket_inicial,
                (int) $id_accion_ticket_crear,
                (int) $id_status_payment,
                (int) $id_status_domiciliacion_inicial,
                (int) $coordinador
            );
            $resultHistoryCrear = $this->db->pgquery($sqlInsertHistoryCrear);
            
            if ($resultHistoryCrear === false) {
                error_log("Error al insertar en ticket_status_history (crear ticket): " . pg_last_error($db_conn) . " Query: " . $sqlInsertHistoryCrear);
                return ['error' => 'Error al insertar en ticket_status_history (crear ticket).'];
            }
            pg_free_result($resultHistoryCrear);

            // 6. Insertar en ticket_status_history - SEGUNDA ENTRADA: "Asignado al Coordinador"
            $id_accion_ticket = 4; 

            $sqlInsertHistoryCoord = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, NULL::integer, %d::integer, %d::integer, %d::integer);",
                (int) $idTicketCreado,
                (int) $id_user,
                (int) $id_status_ticket_inicial,
                (int) $id_accion_ticket,
                (int) $id_status_payment,
                (int) $id_status_domiciliacion_inicial,
                (int) $coordinador
            );
            $resultHistoryCoord = $this->db->pgquery($sqlInsertHistoryCoord);
            
            if ($resultHistoryCoord === false) {
                error_log("Error al insertar en ticket_status_history (Asignado al Coordinador): " . pg_last_error($db_conn) . " Query: " . $sqlInsertHistoryCoord);
                return ['error' => 'Error al insertar en ticket_status_history (Asignado al Coordinador).'];
            }
            pg_free_result($resultHistoryCoord);

            // 7. Insertar en tickets_status_domiciliacion
            $sqlInserDomiciliacion = "INSERT INTO tickets_status_domiciliacion (id_ticket, id_status_domiciliacion) VALUES (" . (int) $idTicketCreado . ", " . (int) $id_status_domiciliacion_inicial . ");";
            $resultInserDomiciliacion = $this->db->pgquery($sqlInserDomiciliacion);

            if ($resultInserDomiciliacion === false) {
                error_log("Error al insertar en tickets_status_domiciliacion: " . pg_last_error($db_conn) . " Query: " . $sqlInserDomiciliacion);
                return ['error' => 'Error al insertar en tickets_status_domiciliacion.'];
            }
            pg_free_result($resultInserDomiciliacion);

            // 8. Lógica de Archivos y Pagos
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


            if (!$isFallaSinPago) {
                $paymentTransferResult = $this->TransferPaymentFromTempToMain($serial, $Nr_ticket);
                if ($paymentTransferResult !== false && $paymentTransferResult !== true) {
                    error_log("Pago transferido exitosamente dentro de SaveDataFalla2. ID: " . $paymentTransferResult);
                } elseif ($paymentTransferResult === false) {
                    error_log("Advertencia: No se pudo transferir el pago temporal para el serial: " . $serial);
                }

                // NUEVO: Transferir Exoneración si existe en la temporal
                $exoneracionTransferResult = $this->TransferExoneracionFromTempToMain($serial, $Nr_ticket);
                if ($exoneracionTransferResult) {
                    error_log("Exoneración transferida exitosamente dentro de SaveDataFalla2 para el serial: " . $serial);
                }
            } else {
                $fallaName = $isActualizacionSoftware ? "Actualización de Software (id_failure = 9)" : "Sin Llaves/Dukpt Vacío (id_failure = 12)";
                error_log("Ticket de {$fallaName}: Se omiten anticipo, exoneración y transferencia de pago.");
            }

            // 9. Retorno
            $currentTicketStatus = $this->getStatusTicket($idTicketCreado);
            $SearchStatusPayment = $this->getStatusTicketPayment($idTicketCreado);

            if (!$currentTicketStatus) {
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

    public function saveArchivoAdjunto($ticket_id, $Nr_ticket, $uploaded_by_user_id, $original_filename, $stored_filename, $file_path, $mime_type, $file_size_bytes, $document_type, $record_number = null, $skip_sync = false)
    {
        try {
            $db_conn = $this->db->getConnection();

            $escaped_original_filename = pg_escape_literal($db_conn, $original_filename);
            $escaped_stored_filename = pg_escape_literal($db_conn, $stored_filename);
            $escaped_file_path = pg_escape_literal($db_conn, $file_path);
            $escaped_mime_type = pg_escape_literal($db_conn, $mime_type);
            $escaped_document_type = pg_escape_literal($db_conn, $document_type);
            $escaped_Nr_ticket = pg_escape_literal($db_conn, $Nr_ticket);
            
            // Manejo de record_number (puede ser null)
            $escaped_record_number = 'NULL';
            if ($record_number !== null && $record_number !== '') {
                 $escaped_record_number = pg_escape_literal($db_conn, $record_number);
            }

            $sql = sprintf(
                "INSERT INTO public.archivos_adjuntos (nro_ticket, original_filename, stored_filename, file_path, mime_type, file_size_bytes, uploaded_by_user_id, document_type, record_number) VALUES (%s, %s, %s, %s, %s, %d, %d, %s, %s)",
                $escaped_Nr_ticket, 
                $escaped_original_filename,
                $escaped_stored_filename,
                $escaped_file_path,
                $escaped_mime_type,
                (int) $file_size_bytes,
                (int) $uploaded_by_user_id,
                $escaped_document_type,
                $escaped_record_number
            ) . " RETURNING id;";

            $db_conn = $this->db->getConnection();
            $result_insert = pg_query($db_conn, $sql);

            if (!$result_insert) {
                error_log("Error al insertar archivo adjunto: " . pg_last_error($db_conn) . " Query: " . $sql);
                return ['error' => 'Error al guardar el archivo adjunto en la base de datos.'];
            }
            
            $new_img_id = pg_fetch_result($result_insert, 0, 0);
            error_log("saveArchivoAdjunto: New Image ID: " . $new_img_id);

            // Vínculo Documento-a-Documento
            // Caso 1: Pagos rechazados
            $sqlUpdateOldDoc = "UPDATE archivos_adjuntos 
                               SET substituted_by_id_payment_record = $new_img_id,
                                   is_substituted = TRUE
                               WHERE nro_ticket = $escaped_Nr_ticket 
                               AND document_type = $escaped_document_type 
                               AND rechazado = TRUE";
            pg_query($db_conn, $sqlUpdateOldDoc);

            // Caso 2: Solicitudes Administrativas (identificadas por record_number)
            if ($record_number !== null && $record_number !== '') {
                $sqlUpdateAdminOldDoc = "UPDATE archivos_adjuntos 
                                        SET substituted_by_id_payment_record = $new_img_id,
                                            is_substituted = TRUE
                                        WHERE record_number = $escaped_record_number
                                        AND id != $new_img_id
                                        AND (is_substituted = FALSE OR is_substituted IS NULL)";
                pg_query($db_conn, $sqlUpdateAdminOldDoc);
            }

            // PATRÓN saveDocument2: Determinación de estatus e historial
            if (!$skip_sync) {
                $id_status_payment = $this->determineStatusPayment($Nr_ticket, $document_type);
                
                // Sync status and history using helper
                $this->syncTicketStatusAndHistoryByNro($Nr_ticket, $uploaded_by_user_id, $id_status_payment);
            }

            return ['success' => true, 'id' => $new_img_id];

        } catch (Throwable $e) {
            error_log("Excepción en saveArchivoAdjunto: " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
            return ['error' => 'Error inesperado al guardar archivo adjunto: ' . $e->getMessage()];
        }
    }

    private function syncTicketStatusAndHistoryByNro($nro_ticket, $id_user, $id_new_status_payment) {
        try {
            $db_conn = $this->db->getConnection();
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);

            // 1. Get ticket ID and current statuses
            $sql_ticket = "SELECT id_ticket, id_status_ticket, id_accion_ticket FROM tickets WHERE nro_ticket = " . $escaped_nro_ticket . " LIMIT 1";
            $result_ticket = pg_query($db_conn, $sql_ticket);
            
            if ($result_ticket && pg_num_rows($result_ticket) > 0) {
                $ticket_row = pg_fetch_assoc($result_ticket);
                $id_ticket = (int)$ticket_row['id_ticket'];
                $id_status_ticket = $ticket_row['id_status_ticket'] !== null ? (int)$ticket_row['id_status_ticket'] : 'NULL';
                $id_accion_ticket = $ticket_row['id_accion_ticket'] !== null ? (int)$ticket_row['id_accion_ticket'] : 'NULL';
                
                // 2. Update ticket status
                $sqlticket_update = "UPDATE tickets SET id_status_payment = ".$id_new_status_payment." WHERE id_ticket = ".$id_ticket.";";
                pg_query($db_conn, $sqlticket_update);

                // 3. Gather other statuses
                $id_status_lab = 0;
                $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket;
                $status_lab_result = pg_query($db_conn, $status_lab_sql);
                if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                    $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;
                }

                $new_status_domiciliacion = 'NULL';
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = ". $id_ticket;
                $status_domiciliacion_result = pg_query($db_conn, $status_domiciliacion_sql);
                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $new_status_domiciliacion = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') !== null ? (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') : 'NULL';
                }

                $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket}";
                $resultcoordinador = pg_query($db_conn, $sqlgetcoordinador);
                $id_coordinador = 'NULL';
                if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
                    $row_coordinador = pg_fetch_assoc($resultcoordinador);
                    $id_coordinador = (int)$row_coordinador['id_coordinador'];
                }

                // 4. Insert history
                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %d::integer, %s::integer, %s::integer);",
                    $id_ticket,
                    (int)$id_user,
                    $id_status_ticket,
                    $id_accion_ticket,
                    $id_status_lab,
                    (int)$id_new_status_payment,
                    $new_status_domiciliacion,
                    $id_coordinador
                );

                pg_query($db_conn, $sqlInsertHistory);
                return true;
            }
            return false;
        } catch (Throwable $e) {
            error_log("Error en syncTicketStatusAndHistoryByNro: " . $e->getMessage());
            return false;
        }
    }

    private function determineStatusPayment($nro_ticket, $document_type_being_uploaded) {
        // 0. Si la falla del ticket es libre de pago (9 = Actualización de Software, 12 = Sin Llaves/Dukpt Vacío), no requiere pago
        $failure_sql = "SELECT tf.id_failure FROM tickets_failures tf INNER JOIN tickets t ON t.id_ticket = tf.id_ticket WHERE t.nro_ticket = '".$nro_ticket."' LIMIT 1";
        $failure_result = Model::getResult($failure_sql, $this->db);
        if ($failure_result && isset($failure_result['query']) && $failure_result['numRows'] > 0) {
            $id_failure = (int)pg_fetch_result($failure_result['query'], 0, 'id_failure');
            if ($id_failure === 9 || $id_failure === 12) {
                return 16; // No necesita anticipo o exoneración
            }
        }

        // 1. Verificar estado actual para mantener aprobados si se sube Envio/Traslado
        $current_status_sql = "SELECT id_status_payment FROM tickets WHERE nro_ticket = '".$nro_ticket."'";
        $current_status_result = Model::getResult($current_status_sql, $this->db);
        
        if ($current_status_result && isset($current_status_result['query']) && $current_status_result['numRows'] > 0) {
            $current_status = pg_fetch_result($current_status_result['query'], 0, 'id_status_payment');
            
            // Si el ticket ya tiene un status válido y se sube un documento que NO debe resetear el flujo
            // (como Traslado, Envio, Envio_Destino, presupuesto o comprobantes de pago)
            if (in_array((int)$current_status, [1, 3, 4, 5, 6, 7, 17]) && 
                ($document_type_being_uploaded === 'Traslado' || 
                 $document_type_being_uploaded === 'Envio' || 
                 $document_type_being_uploaded === 'Envio_Destino' ||
                 $document_type_being_uploaded === 'presupuesto' ||
                 $document_type_being_uploaded === 'comprobante_pago' ||
                 $document_type_being_uploaded === 'pago' ||
                 $document_type_being_uploaded === 'Pago')) {
                return $current_status;
            }
        }
        
        // 2. Obtener documentos existentes
        $sql = "SELECT document_type FROM archivos_adjuntos WHERE nro_ticket = '".$nro_ticket."' AND document_type != '".$document_type_being_uploaded."'";
        $result = Model::getResult($sql, $this->db);
        
        $existing_documents = [];
        if ($result && isset($result['query'])) {
            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $existing_documents[] = $agente['document_type'];
            }
        }

        // 3. Validación de Región (Miranda, Caracas, etc.)
        $serial_sql = "SELECT tik.serial_pos FROM tickets tik WHERE tik.nro_ticket = '".$nro_ticket."'";
        $serial_result = Model::getResult($serial_sql, $this->db);
        $serial = '';
        if ($serial_result && isset($serial_result['query']) && $serial_result['numRows'] > 0) {
            $serial = pg_fetch_result($serial_result['query'], 0,'serial_pos');
        }

        $estado_sql = "SELECT * FROM verifingbranches_serial('".$serial."');";
        $estado_result = Model::getResult($estado_sql, $this->db);

        if ($estado_result && isset($estado_result['query']) && $estado_result['numRows'] > 0) {
            $nombre_estado = pg_fetch_result($estado_result['query'], 0, 'nombre_estado');
            if (in_array($nombre_estado, ['Miranda', 'Caracas', 'Distrito Capital', 'Vargas'])) {
                if ($document_type_being_uploaded === 'Exoneracion') return 5;
                if ($document_type_being_uploaded === 'Anticipo') return 7;
            }
        }
       
        // 4. Lógica de transiciones (Basada en reportsModel.php:730)
        if ($document_type_being_uploaded === 'Envio') {
            if (in_array('Exoneracion', $existing_documents)) {
                return 5; // Exoneracion Pendiente por Revision
            } elseif (in_array('Anticipo', $existing_documents)) {
                return 7; // Pago Anticipo Pendiente por Revision
            } else {
                return 10; // Pendiente Por Cargar Documento (Pago o Exoneracion)
            }
        } elseif ($document_type_being_uploaded === 'Exoneracion') {
            if (in_array('Envio', $existing_documents)) {
                return 5; // Exoneracion Pendiente por Revision
            } else {
                return 11; // Pendiente Por Cargar Documento (PDF Envio ZOOM)
            }
        } elseif ($document_type_being_uploaded === 'Anticipo') {
            return 7; // Pago Anticipo Pendiente por Revision
        } elseif ($document_type_being_uploaded === 'Pago' || $document_type_being_uploaded === 'pago') {
            return 17; // Pago Pendiente por Revision
        } elseif ($document_type_being_uploaded === 'Envio_Destino') {
            if (in_array('Exoneracion', $existing_documents)) return 5;
            if (in_array('Anticipo', $existing_documents)) return 7;
            return 1; // Solventado
        }   

        return 11; // Por defecto (Pendiente Por Cargar Documento ZOOM)
    }

        public function savePagoAttachment($ticket_id, $Nr_ticket, $uploaded_by_user_id, $original_filename, $stored_filename, $file_path, $mime_type, $file_size_bytes, $document_type, $record_number)
    {
        try {
            $db_conn = $this->db->getConnection();

            $escaped_original_filename = pg_escape_literal($db_conn, $original_filename);
            $escaped_stored_filename = pg_escape_literal($db_conn, $stored_filename);
            $escaped_file_path = pg_escape_literal($db_conn, $file_path);
            $escaped_mime_type = pg_escape_literal($db_conn, $mime_type);
            $escaped_document_type = pg_escape_literal($db_conn, $document_type);
            $escaped_Nr_ticket = pg_escape_literal($db_conn, $Nr_ticket);
            
            $escaped_record_number = 'NULL';
            if ($record_number !== null) {
                $escaped_record_number = pg_escape_literal($db_conn, $record_number);
            }

            $sql = sprintf(
                "INSERT INTO public.archivos_adjuntos (nro_ticket, original_filename, stored_filename, file_path, mime_type, file_size_bytes, uploaded_by_user_id, document_type, record_number) VALUES (%s, %s, %s, %s, %s, %d, %d, %s, %s);",
                $escaped_Nr_ticket, 
                $escaped_original_filename,
                $escaped_stored_filename,
                $escaped_file_path,
                $escaped_mime_type,
                (int) $file_size_bytes,
                (int) $uploaded_by_user_id,
                $escaped_document_type,
                $escaped_record_number
            );

            $result = $this->db->pgquery($sql);

            if ($result === false) {
                error_log("Error al insertar archivo adjunto (PAGO): " . pg_last_error($db_conn) . " Query: " . $sql);
                return ['error' => 'Error al guardar el pago adjunto en la base de datos.'];
            }

            // PATRÓN saveDocument2: Determinación de estatus e historial
            $id_status_payment = $this->determineStatusPayment($Nr_ticket, $document_type);
            
            // Sync status and history
            $this->syncTicketStatusAndHistoryByNro($Nr_ticket, $uploaded_by_user_id, $id_status_payment);

            return ['success' => true];

        } catch (Throwable $e) {
            error_log("Excepción en savePagoAttachment: " . $e->getMessage());
            return ['error' => 'Error inesperado al guardar pago: ' . $e->getMessage()];
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

            $sql = "SELECT * FROM GetDataTicketByIdAccion(" . $id_user . ")";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            // Manejar excepciones

        }

    }

    public function GetTicketDataPagos($id_user)
    {

        try {

            $sql = "SELECT * FROM getdataticketpagos(" . $id_user . ")";

            $result = Model::getResult($sql, $this->db);

            return $result;

        } catch (Throwable $e) {

            // Manejar excepciones

        }
    }

    public function GetTicketDataExoneracion($id_user)
    {

        try {

            $sql = "SELECT * FROM getdataticketexoneracion(" . $id_user . ")";

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

    public function GetExoneracionPorcentaje($nro_ticket, $serial_pos = null) {
        try {
            $db_conn = $this->db->getConnection();
            $sql = "SELECT porcentaje, tipo_exoneracion, id_status_payment FROM exoneraciones 
                    WHERE TRIM(nro_ticket) = " . pg_escape_literal($db_conn, trim($nro_ticket)) . " 
                    AND (is_substituted IS NULL OR is_substituted = FALSE)
                    ORDER BY id_exoneracion ASC";

            return Model::getResult($sql, $this->db);

        } catch (Throwable $e) {
            error_log("Error in GetExoneracionPorcentaje: " . $e->getMessage());
            return false;
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

    /**
     * Verifica si un ticket ha pasado por el taller (new_action = 15)
     * en la tabla tickets_status_history.
     * 
     * @param int $id_ticket ID del ticket
     * @return bool True si ha pasado por taller, False de lo contrario
     */
    public function CheckTicketWorkshopHistory($id_ticket) {
        try {
            $db_conn = $this->db->getConnection();
            $sql = "SELECT COUNT(*) as count FROM tickets_status_history 
                    WHERE id_ticket = " . pg_escape_literal($db_conn, $id_ticket) . " 
                    AND new_action = 15";
            $result = Model::getResult($sql, $this->db);
            if ($result && isset($result['row']['count'])) {
                return (int)$result['row']['count'] > 0;
            }
            return false;
        } catch (Throwable $e) {
            error_log("Error in CheckTicketWorkshopHistory: " . $e->getMessage());
            return false;
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

            // ========================================================================
            // 1. TOMAR LA "FOTO" DEL PASADO (Leer estatus antes de mutar la base de datos)
            // ========================================================================

            // --- A. Leer Estatus Lab ---
            $id_status_lab = 0; // Valor por defecto igual al original
            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". $id_ticket. ";";
            $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);
            if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                $row_lab = pg_fetch_assoc($status_lab_result);
                $id_status_lab = $row_lab['id_status_lab'] !== null ? (int)$row_lab['id_status_lab'] : 'NULL';
            }

            // --- B. Leer Estatus Payment ---
            $id_new_status_payment = 'NULL'; 
            $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . $id_ticket . ";";
            $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
            if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                $status_payment_data = pg_fetch_assoc($status_payment_status_result);
                $id_new_status_payment = $status_payment_data['id_status_payment'] !== null ? (int)$status_payment_data['id_status_payment'] : 'NULL';
            }

            // --- C. Leer Estatus Domiciliacion ---
            $new_status_domiciliacion = 'NULL'; 
            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . $id_ticket . ";";
            $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
            if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                $domiciliacion_data = pg_fetch_assoc($status_domiciliacion_result);
                $new_status_domiciliacion = $domiciliacion_data['id_status_domiciliacion'] !== null ? (int)$domiciliacion_data['id_status_domiciliacion'] : 'NULL';
            }

            // --- D. Leer Coordinador ---
            $id_coordinador = null;
            $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";
            $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);
            if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
                $row_coordinador = pg_fetch_assoc($resultcoordinador);
                $id_coordinador = (int) $row_coordinador['id_coordinador'];
                pg_free_result($resultcoordinador);
            }

            // ========================================================================
            // 2. EJECUTAR EL UPDATE (Acción 14)
            // ========================================================================
            $sql = "UPDATE tickets SET id_accion_ticket = ".(int)$id_accion_ticket.", date_send_torosal_fromlab = NOW(), confirmrosal = TRUE WHERE id_ticket = ".$id_ticket.";";
            $result = Model::getResult($sql, $this->db);

            // ========================================================================
            // 3. GUARDAR EL HISTORIAL
            // ========================================================================
            if ($result) {
                $sqlInsertHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",
                    (int)$id_ticket,
                    (int)$id_user,
                    2, 
                    (int)$id_accion_ticket,
                    $id_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                    (int)$id_coordinador
                );

                $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);

                // CORRECCIÓN: Antes devolvías la variable $sqlInsertHistory (el texto puro), 
                // ahora devuelve $resultsqlInsertHistory (el resultado de la base de datos).
                return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory);
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

            // ========================================================================
            // 2. TOMAR LA "FOTO" DEL PASADO (Leer TODOS los estatus una sola vez al inicio)
            // ========================================================================
            
            // --- A. Leer Estatus Ticket ---
            $id_status_ticket = 0;
            $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = " . (int)$ticketId . ";";
            $status_ticket_result = pg_query($this->db->getConnection(), $status_ticket_sql);
            if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {
                $id_status_ticket = pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') ?? 0;
            }

            // --- B. Leer Estatus Lab ---
            $id_status_lab = 0;
            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . (int)$ticketId . ";";
            $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);
            if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;
            }

            // --- C. Leer Estatus Payment ---
            $id_new_status_payment = 'NULL';
            $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . (int)$ticketId . ";";
            $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
            if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                $val = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment');
                $id_new_status_payment = $val !== null ? (int)$val : 'NULL';
            }

            // --- D. Leer Estatus Domiciliacion ---
            $new_status_domiciliacion = 'NULL';
            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . (int)$ticketId . ";";
            $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
            if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                $val = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion');
                $new_status_domiciliacion = $val !== null ? (int)$val : 'NULL';
            }

            // --- E. Leer Coordinador ---
            $id_coordinador = null;
            $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";
            $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);
            if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
                $row_coordinador = pg_fetch_assoc($resultcoordinador);
                $id_coordinador = (int) $row_coordinador['id_coordinador'];
                pg_free_result($resultcoordinador);
            }

            // ========================================================================
            // 3. ACTUALIZACIÓN DE COMPONENTES (Si aplica)
            // ========================================================================
            if (is_array($componentes_array) && !empty($componentes_array)) {
                // Inserta el historial usando las variables del Paso 2
                $sqlInsertComponentHistory = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",
                    (int)$ticketId,
                    (int)$id_user,
                    (int)$id_status_ticket,
                    20, // id_accion_ticket para "Actualización de Componentes"
                    $id_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                    (int)$id_coordinador
                );
                
                $resultComponentHistory = pg_query($this->db->getConnection(), $sqlInsertComponentHistory);
                if ($resultComponentHistory === false) {
                    pg_query($this->db->getConnection(), "ROLLBACK");
                    return false;
                }

                // Inserta los componentes
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

            // ========================================================================
            // 4. ACTUALIZAR EL TICKET (MUTACIÓN - Dispara el Trigger en BD)
            // ========================================================================
            $sql = "UPDATE tickets SET id_accion_ticket = " . (int)$id_accion_ticket . ", date_sentRegion = NOW() WHERE id_ticket = " . (int)$ticketId . ";";
            $result = Model::getResult($sql, $this->db);
            if (!$result) {
                pg_query($this->db->getConnection(), "ROLLBACK");
                return false;
            }

            // ========================================================================
            // 5. GUARDAR HISTORIAL PRINCIPAL (Reciclando la "foto" del Paso 2)
            // ========================================================================
            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",
                (int)$ticketId,
                (int)$id_user,
                2, // id_status_ticket fijo
                (int)$id_accion_ticket, // 18 
                $id_status_lab,
                $id_new_status_payment,
                $new_status_domiciliacion,
                (int)$id_coordinador
            );
            $resultsqlInsertHistory = pg_query($this->db->getConnection(), $sqlInsertHistory);
            
            if ($resultsqlInsertHistory === false) {
                pg_query($this->db->getConnection(), "ROLLBACK");
                return false;
            }

            // 6. Confirmar transacción
            pg_query($this->db->getConnection(), "COMMIT");
            return array('save_result' => $result, 'history_result' => $resultsqlInsertHistory, 'component_result' => true);

        } catch (Throwable $e) {
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

            // ========================================================================
            // 2. TOMAR LA "FOTO" DEL PASADO (Leer estatus actuales ANTES de mutar)
            // ========================================================================
            
            // --- A. Leer Estatus Lab ---
            $id_status_lab = 0;
            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = ". (int)$ticketId. ";";
            $status_lab_result = pg_query($this->db->getConnection(), $status_lab_sql);
            if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;
            }

            // --- B. Leer Estatus Payment ---
            $id_new_status_payment = 'NULL';
            $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = ". (int)$ticketId. ";";
            $status_payment_status_result = pg_query($this->db->getConnection(), $status_payment_status_sql);
            if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                $val = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment');
                $id_new_status_payment = $val !== null ? (int)$val : 'NULL';
            }

            // --- C. Leer Estatus Domiciliacion ---
            $new_status_domiciliacion = 'NULL';
            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = ". (int)$ticketId. ";";
            $status_domiciliacion_result = pg_query($this->db->getConnection(), $status_domiciliacion_sql);
            if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                $val = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion');
                $new_status_domiciliacion = $val !== null ? (int)$val : 'NULL';
            }

            // --- D. Leer Coordinador ---
            $id_coordinador = null;
            $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$ticketId};";
            $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);
            if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
                $row_coordinador = pg_fetch_assoc($resultcoordinador);
                $id_coordinador = (int) $row_coordinador['id_coordinador'];
                pg_free_result($resultcoordinador);
            }

            // ========================================================================
            // 3. ACTUALIZAR EL TICKET (Esto puede disparar Triggers en PostgreSQL)
            // ========================================================================
            $sql = "UPDATE tickets SET id_accion_ticket = ". (int)$id_accion_ticket. ", date_sentRegion = NOW() WHERE id_ticket = ". (int)$ticketId. ";";
            $result = Model::getResult($sql, $this->db);

            if (!$result) {
                pg_query($this->db->getConnection(), "ROLLBACK");
                return false;
            }

            // ========================================================================
            // 4. GUARDAR HISTORIAL (Usando la foto del Paso 2)
            // ========================================================================
            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %d::integer);",
                (int)$ticketId,
                (int)$id_user,
                (int)2,
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

            // 5. ¡Agrega esta línea para confirmar la transacción!
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
            
            $sql = "SELECT adj.*, e.id_exoneracion, pr.id_payment_record
                    FROM archivos_adjuntos adj
                    LEFT JOIN exoneraciones e ON adj.record_number = e.nro_exoneracion
                    LEFT JOIN payment_records pr ON adj.record_number = pr.record_number
                    WHERE adj.nro_ticket = $escaped_ticket_id AND adj.document_type = $escaped_document_type 
                    ORDER BY adj.id DESC LIMIT 1";
            
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
            error_log("Error en getDocumentByType: " . $e->getMessage());
            return false;
        }
    }

    public function getDocumentExoneracionByType($ticketId, $documentType) {
        try {
            $db_conn = $this->db->getConnection();
            $escaped_ticket_id = pg_escape_literal($db_conn, $ticketId);
            
            // Lógica especial para exoneraciones (Anticipo y Pago taller)
            if (in_array(strtolower($documentType), ['anticipo', 'exoneracion'])) {
                $tipoBusqueda = (strtolower($documentType) === 'anticipo') ? 'Anticipo' : 'Pago taller';
                $escaped_tipo = pg_escape_literal($db_conn, $tipoBusqueda);
                
                $sql = "SELECT adj.* 
                        FROM exoneraciones e
                        JOIN archivos_adjuntos adj ON e.nro_exoneracion = adj.record_number
                        WHERE e.nro_ticket = $escaped_ticket_id 
                          AND e.tipo_exoneracion ILIKE $escaped_tipo
                        ORDER BY e.fecha_creacion DESC LIMIT 1";
                
                $result = $this->db->pgquery($sql);
                
                if ($result && pg_num_rows($result) > 0) {
                    return pg_fetch_assoc($result);
                }
                
                // Fallback: Si no hay match por record_number, buscar por document_type directamente
                $escaped_doc_type = pg_escape_literal($db_conn, $documentType);
                $sqlFallback = "SELECT * FROM archivos_adjuntos WHERE nro_ticket = $escaped_ticket_id AND document_type ILIKE $escaped_doc_type ORDER BY id DESC LIMIT 1";
                $resultFallback = $this->db->pgquery($sqlFallback);
                if ($resultFallback && pg_num_rows($resultFallback) > 0) {
                    return pg_fetch_assoc($resultFallback);
                }
                
                return false;
            } else {
                // Caso general (presupuesto, etc.)
                $escaped_document_type = pg_escape_literal($db_conn, $documentType);
                $sql = "SELECT * FROM archivos_adjuntos WHERE nro_ticket = $escaped_ticket_id AND document_type = $escaped_document_type ORDER BY id DESC LIMIT 1";
                $result = $this->db->pgquery($sql);
                
                if ($result && pg_num_rows($result) > 0) {
                    return pg_fetch_assoc($result);
                }
                return false;
            }

        } catch (Throwable $e) {
            error_log("Error en getDocumentExoneracionByType: " . $e->getMessage());
            return false;
        }
    }

    public function getNonRejectedDocumentByType($ticketId, $documentType) {

        try {

            $db_conn = $this->db->getConnection();
            
            $escaped_ticket_id = pg_escape_literal($db_conn, $ticketId);
            $escaped_document_type = pg_escape_literal($db_conn, $documentType);
            
            // Filtrar solo documentos que NO están rechazados
            $sql = "SELECT * FROM archivos_adjuntos WHERE nro_ticket = $escaped_ticket_id AND document_type = $escaped_document_type AND (rechazado = false OR rechazado IS NULL) ORDER BY id DESC LIMIT 1";
            
            $result = $this->db->pgquery($sql);



            if ($result === false) {

                error_log("Error al consultar documento no rechazado: " . pg_last_error($db_conn));

                return false;

            }



            if (pg_num_rows($result) === 0) {

                return false;

            }



            return pg_fetch_assoc($result);



        } catch (Throwable $e) {

            error_log("Excepción en getNonRejectedDocumentByType: " . $e->getMessage());

            return false;

        }

    }


    public function GetMotivos($documentType) {
        try {

            $db_conn = $this->db->getConnection();
            
            // Allow 'Pago' or 'pago' to use 'Anticipo' reasons
            if ($documentType === 'Pago' || $documentType === 'pago') {
                $documentType = 'Anticipo';
            }

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

   public function RechazarDocumentos($id_ticket, $id_motivo, $nro_ticket, $id_user, $document_type, $id_payment_record = null) {
    try {
        $db_conn = $this->db->getConnection();

        // ✅ VALIDACIÓN DE ID_TICKET VS NRO_TICKET
        
            $sqlid_ticket =  "SELECT id_ticket FROM tickets WHERE nro_ticket = '".$nro_ticket."';";
            $result = pg_query($db_conn, $sqlid_ticket);
            if ($result && pg_num_rows($result) > 0) {
                $resolved_id = pg_fetch_result($result, 0, 'id_ticket');
                $id_ticket = $resolved_id;
            }
        

        // 1. Obtener datos iniciales del ticket
        $status_payment_status_sql = "SELECT id_status_payment, id_status_ticket, id_accion_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket;
        $status_payment_status_result = pg_query($db_conn, $status_payment_status_sql);
        $ticket_data = ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) 
                        ? pg_fetch_assoc($status_payment_status_result, 0) : null;

        // Definir nuevo status según documento
        if ($document_type === 'Envio') {
            $id_new_status_payment = 14;
        } else if (in_array($document_type, ['Anticipo', 'pago', 'Pago', 'comprobante_pago'])) {
            $id_new_status_payment = 13;
        } else if ($document_type === 'Exoneracion') {
            $id_new_status_payment = 12;
        } else if ($document_type === 'convenio_firmado') {
            $id_new_status_payment = ($ticket_data) ? $ticket_data['id_status_payment'] : 'NULL';
            if($id_new_status_payment === 'NULL' || $id_new_status_payment === null) {
                $new_status_domiciliacion = 7;
            }
        }

        // Escapar valores
        $escaped_id_ticket = pg_escape_literal($db_conn, $id_ticket);
        $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
        $escaped_document_type = pg_escape_literal($db_conn, $document_type);

        // 2. ACTUALIZAR payment_records Y archivos_adjuntos
        $record_number_rechazado = null;
        $is_payment_document = in_array($document_type, ['Anticipo', 'pago', 'Pago', 'comprobante_pago']);
        $is_exoneration_document = ($document_type === 'Exoneracion');

        if ($is_payment_document && !empty($nro_ticket)) {
            $status_rechazado = 13;
            
            // Obtener record_number
            if ($id_payment_record) {
                $sqlGetRecord = "SELECT record_number FROM payment_records WHERE id_payment_record = " . (int)$id_payment_record;
            } else {
                $sqlGetRecord = "SELECT record_number FROM payment_records WHERE nro_ticket = $escaped_nro_ticket ORDER BY id_payment_record DESC LIMIT 1";
            }
            $resRecord = pg_query($db_conn, $sqlGetRecord);
            if ($resRecord && pg_num_rows($resRecord) > 0) {
                $record_number_rechazado = pg_fetch_result($resRecord, 0, 'record_number');
            }

            // Actualizar payment_records
            $whereClause = $id_payment_record ? "id_payment_record = " . (int)$id_payment_record : "id_payment_record = (SELECT id_payment_record FROM payment_records WHERE nro_ticket = $escaped_nro_ticket ORDER BY id_payment_record DESC LIMIT 1)";
            $sqlUpdatePayment = "UPDATE payment_records SET payment_status = $status_rechazado, confirmation_number = false, updated_by = " . (int)$id_user . ", updated_at = NOW() WHERE $whereClause";
            
            if (!pg_query($db_conn, $sqlUpdatePayment)) {
                error_log("Error actualizando payment_records: " . pg_last_error($db_conn));
                return false;
            }

            // Actualizar archivos_adjuntos
            if ($record_number_rechazado) {
                $escaped_record = pg_escape_literal($db_conn, $record_number_rechazado);
                $sqlAdjuntos = "UPDATE archivos_adjuntos SET id_motivo_rechazo = $id_motivo, rechazado = TRUE WHERE record_number = $escaped_record";
                $resAdj = pg_query($db_conn, $sqlAdjuntos);
                
                // Fallback si no afectó filas (tal vez no tenía record_number)
                if ($resAdj && pg_affected_rows($resAdj) === 0) {
                    $sqlFallback = "UPDATE archivos_adjuntos SET id_motivo_rechazo = $id_motivo, rechazado = TRUE WHERE id = (SELECT id FROM archivos_adjuntos WHERE nro_ticket = $escaped_nro_ticket AND document_type = $escaped_document_type ORDER BY uploaded_at DESC LIMIT 1)";
                    pg_query($db_conn, $sqlFallback);
                }
            }
        } else if ($is_exoneration_document && !empty($nro_ticket)) {
            $status_rechazado = 12; // Rechazada para Exoneración
            
            // 1. Obtener record_number para vincular con archivos_adjuntos
            if ($id_payment_record) {
                $sqlGetRecordExo = "SELECT nro_exoneracion FROM exoneraciones WHERE id_exoneracion = " . (int)$id_payment_record;
            } else {
                $sqlGetRecordExo = "SELECT nro_exoneracion FROM exoneraciones WHERE nro_ticket = $escaped_nro_ticket ORDER BY id_exoneracion DESC LIMIT 1";
            }
            
            $resExoRecord = pg_query($db_conn, $sqlGetRecordExo);
            if ($resExoRecord && pg_num_rows($resExoRecord) > 0) {
                $record_number_rechazado = pg_fetch_result($resExoRecord, 0, 'nro_exoneracion');
            }

            // 2. Actualizar tabla exoneracion
            $whereClauseExo = $id_payment_record ? "id_exoneracion = " . (int)$id_payment_record : "id_exoneracion = (SELECT id_exoneracion FROM exoneraciones WHERE nro_ticket = $escaped_nro_ticket ORDER BY id_exoneracion DESC LIMIT 1)";
            $sqlUpdateExo = "UPDATE exoneraciones SET id_status_payment = $status_rechazado WHERE $whereClauseExo";
            
            if (!pg_query($db_conn, $sqlUpdateExo)) {
                error_log("Error actualizando exoneraciones: " . pg_last_error($db_conn));
                return false;
            }

            // 3. Actualizar archivos_adjuntos
            if ($record_number_rechazado) {
                $escaped_record = pg_escape_literal($db_conn, $record_number_rechazado);
                $sqlAdjuntosExo = "UPDATE archivos_adjuntos SET id_motivo_rechazo = $id_motivo, rechazado = TRUE WHERE record_number = $escaped_record";
                $resAdjExo = pg_query($db_conn, $sqlAdjuntosExo);
                
                // Fallback
                if ($resAdjExo && pg_affected_rows($resAdjExo) === 0) {
                   $sqlFallbackExo = "UPDATE archivos_adjuntos SET id_motivo_rechazo = $id_motivo, rechazado = TRUE WHERE id = (SELECT id FROM archivos_adjuntos WHERE nro_ticket = $escaped_nro_ticket AND document_type = $escaped_document_type ORDER BY uploaded_at DESC LIMIT 1)";
                   pg_query($db_conn, $sqlFallbackExo);
                }
            }
        } else {
            // Otros documentos
            $sqlOther = "UPDATE archivos_adjuntos SET id_motivo_rechazo = $id_motivo, rechazado = TRUE WHERE id = (SELECT id FROM archivos_adjuntos WHERE nro_ticket = $escaped_nro_ticket AND document_type = $escaped_document_type ORDER BY uploaded_at DESC LIMIT 1)";
            if (!pg_query($db_conn, $sqlOther)) return false;
        }

        // 3. ACTUALIZAR ESTADO DEL TICKET (Si aplica)
        if (empty($id_payment_record) && !$is_payment_document) {
            if ($document_type !== 'convenio_firmado') {
                $sqlTicket = "UPDATE tickets SET id_status_payment = $id_new_status_payment WHERE id_ticket = $escaped_id_ticket";
            } else {
                $sqlTicket = "UPDATE tickets_status_domiciliacion SET id_status_domiciliacion = $new_status_domiciliacion WHERE id_ticket = $escaped_id_ticket";
            }
            if (!pg_query($db_conn, $sqlTicket)) return false;
        }

        // Determinar status final para el historial
        if (!empty($id_payment_record) || $is_payment_document) {
             // Re-verificar status actual para consistencia quirúrgica
             $checkResult = pg_query($db_conn, "SELECT id_status_payment FROM tickets WHERE id_ticket = " . (int)$id_ticket);
             if ($checkResult && pg_num_rows($checkResult) > 0) {
                 $id_new_status_payment_for_history = (int)pg_fetch_result($checkResult, 0, 'id_status_payment');
             } else {
                 $id_new_status_payment_for_history = ($ticket_data) ? $ticket_data['id_status_payment'] : $id_new_status_payment;
             }
        } else {
            $id_new_status_payment_for_history = $id_new_status_payment;
        }

        // 4. LOGICA DE COORDINADOR (AQUÍ ESTABA LA DUPLICIDAD)
        // Obtenemos el rol
        $resRol = pg_query($db_conn, "SELECT id_rolusr FROM users WHERE id_user = " . (int)$id_user);
        $id_rol = ($resRol && pg_num_rows($resRol) > 0) ? (int)pg_fetch_result($resRol, 0, 'id_rolusr') : 0;

        // Si no es admin/super (rol 5), asignamos el coordinador al ticket si no tiene
        if ($id_rol != 5) {
            $sqlUpdateCoord = "UPDATE users_tickets SET id_coordinador = $id_user WHERE id_ticket = $escaped_id_ticket AND (id_coordinador IS NULL OR id_coordinador = 0)";
            if (!pg_query($db_conn, $sqlUpdateCoord)) return false;
        }

        // 5. RECOPILAR DATOS PARA HISTORIAL (Centralizado, se ejecuta UNA sola vez)
        
        // Status Lab
        $resLab = pg_query($db_conn, "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . (int)$id_ticket);
        $id_status_lab = ($resLab && pg_num_rows($resLab) > 0) ? ((int)pg_fetch_result($resLab, 0, 'id_status_lab') ?: 0) : 0;

        // Status Domiciliacion
        $resDom = pg_query($db_conn, "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . (int)$id_ticket);
        $new_status_domiciliacion = ($resDom && pg_num_rows($resDom) > 0) ? ((int)pg_fetch_result($resDom, 0, 'id_status_domiciliacion') ?: 'NULL') : 'NULL';

        // Status Ticket
        $resTik = pg_query($db_conn, "SELECT id_status_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket);
        $id_status_ticket = ($resTik && pg_num_rows($resTik) > 0) ? ((int)pg_fetch_result($resTik, 0, 'id_status_ticket') ?: 'NULL') : 'NULL';

        // Accion Ticket
        $resAcc = pg_query($db_conn, "SELECT id_accion_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket);
        $id_accion_ticket = ($resAcc && pg_num_rows($resAcc) > 0) ? ((int)pg_fetch_result($resAcc, 0, 'id_accion_ticket') ?: 'NULL') : 'NULL';

        // Coordinador final
        $resCoord = pg_query($db_conn, "SELECT id_coordinador FROM users_tickets WHERE id_ticket = " . (int)$id_ticket);
        $id_coordinador = ($resCoord && pg_num_rows($resCoord) > 0) ? ((int)pg_fetch_result($resCoord, 0, 'id_coordinador') ?: 'NULL') : 'NULL';


        // 6. INSERTAR EN HISTORIAL
        $sqlInsertHistory = sprintf(
            "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer);",
            (int)$id_ticket,
            (int)$id_user,
            $id_status_ticket,
            $id_accion_ticket,
            $id_status_lab,
            $id_new_status_payment_for_history,
            $new_status_domiciliacion,
            $id_coordinador,
            $id_payment_record ? (int)$id_payment_record : 'NULL'
        );

        if (!pg_query($db_conn, $sqlInsertHistory)) {
            error_log("Error insertando historial ticket ID: {$id_ticket}: " . pg_last_error($db_conn));
            return false;
        }

        return true;

    } catch (Throwable $e) {
        error_log("Excepción en RechazarDocumentos: " . $e->getMessage());
        return false;
    }
    }

    public function getTicketIdByNumber($nro_ticket)
    {

        try {

            $db_conn = $this->db->getConnection();

            $escaped_nro = pg_escape_literal($db_conn, $nro_ticket);

            $sql = "SELECT id_ticket FROM tickets WHERE nro_ticket = ".$escaped_nro.";";


            $result = Model::getResult($sql, $this->db);

            if (!empty($result['row'])) {

                return $result['row']['id_ticket'];

            }


            return null;

        } catch (Throwable $e) {

            error_log("Error en getTicketIdByNumber: " . $e->getMessage());

            return null;

        }

    }



    public function AprobarDocumento($id_ticket, $nro_ticket, $id_user, $document_type, $nro_payment_reference_verified = '', $payment_date_verified = '', $id_payment_record = null, $amount_verified = '')
    {

        try {

            $db_conn = $this->db->getConnection();



            // ✅ VALIDACIÓN DE ID_TICKET VS NRO_TICKET

            // Si el id_ticket recibido es en realidad el nro_ticket (valor grande)

            $sqlid_ticket =  "SELECT id_ticket FROM tickets WHERE nro_ticket = '".$nro_ticket."';";
            $result = pg_query($db_conn, $sqlid_ticket);
            if ($result && pg_num_rows($result) > 0) {
                $resolved_id = pg_fetch_result($result, 0, 'id_ticket');
                $id_ticket = $resolved_id;
            }

        // 1. Obtener los valores actuales del ticket para mantenerlos si no se actualizan
        $current_status_sql = "SELECT id_status_payment, id_status_ticket, id_accion_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket;
        $current_status_result = pg_query($this->db->getConnection(), $current_status_sql);
        
        $ticket_data = null;
        if ($current_status_result && pg_num_rows($current_status_result) > 0) {
            $ticket_data = pg_fetch_assoc($current_status_result);
        }

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
            
            // Mantener el status de pago actual
            $id_new_status_payment = ($ticket_data) ? $ticket_data['id_status_payment'] : 'NULL';
            
            // Nuevo status de domiciliación
            $new_status_domiciliacion = 6;
            
        } else {
            // ✅ LÓGICA NORMAL PARA OTROS DOCUMENTOS
            if ($document_type === 'Exoneracion') {
                $id_new_status_payment = 4;
            } else if (in_array($document_type, ['Anticipo', 'pago', 'Pago', 'comprobante_pago'])) {
                $id_new_status_payment = 6;
            } else {
                $id_new_status_payment = ($ticket_data) ? $ticket_data['id_status_payment'] : 'NULL';
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

        // ✅ ACTUALIZAR SOLO SI NO ES CONVENIO_FIRMADO, EXONERACION NI PAGO INDIVIDUAL
        // El usuario solicitó no actualizar el ticket automáticamente al aprobar pagos/exoneraciones individuales
        if ($document_type !== 'convenio_firmado' && $document_type !== 'Exoneracion' && empty($id_payment_record)) {
            $sql1 = "UPDATE tickets SET id_status_payment = " . $id_new_status_payment . " WHERE id_ticket = " . $id_ticket;
            $result1 = Model::getResult($sql1, $this->db);

            if ($result1 === false) {
                error_log("Error al aprobar documentos: " . pg_last_error($db_conn));
                return false;
            }
        } else if (!empty($id_payment_record)) {
            // Si es un pago individual, el status de pago que irá al historial del TICKET 
            // debería ser el actual del ticket, ya que el ticket en sí no ha cambiado de status.
            $id_new_status_payment_for_history = ($ticket_data) ? $ticket_data['id_status_payment'] : $id_new_status_payment;
        } else {
            $id_new_status_payment_for_history = $id_new_status_payment;
        }
        
        // ✅ ACTUALIZAR payment_records SI ES ANTICIPO O PAGO
        if (in_array($document_type, ['Anticipo', 'pago', 'Pago', 'comprobante_pago']) && !empty($nro_ticket)) {
            // Construir la consulta UPDATE dinámicamente según los campos que tengan valores
            $updateFields = [];
            
            // Siempre actualizar confirmation_number a true
            $updateFields[] = "confirmation_number = true";
            
            // Actualizar id_status_payment a 6 (Aprobado)
            $updateFields[] = "payment_status = 6";
            
            // ✅ Auditoria: Quién aprobó
            $updateFields[] = "updated_by = " . (int)$id_user;
            $updateFields[] = "updated_at = NOW()";
            
            // Agregar campos verificados si tienen valores
            if (!empty($nro_payment_reference_verified)) {
                $escaped_reference = pg_escape_literal($db_conn, $nro_payment_reference_verified);
                $updateFields[] = "nro_payment_reference_verified = " . $escaped_reference;
            }
            
            if (!empty($payment_date_verified)) {
                $escaped_date = pg_escape_literal($db_conn, $payment_date_verified);
                $updateFields[] = "payment_date_verified = " . $escaped_date;
            }

            if (!empty($amount_verified)) {
                $escaped_amount = pg_escape_literal($db_conn, $amount_verified);
                $updateFields[] = "amount_verified = " . $escaped_amount;
            }
            
            // Construir y ejecutar la consulta UPDATE usando subconsulta para obtener el id más reciente
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            
            if (!empty($id_payment_record)) {
                $sqlUpdatePayment = "UPDATE payment_records 
                                    SET " . implode(", ", $updateFields) . "
                                    WHERE id_payment_record = " . (int)$id_payment_record;
            } else if ($document_type === 'Anticipo' || $document_type === 'pago' || $document_type === 'Pago' || $document_type === 'comprobante_pago') {
                // Si no hay ID específico, intentar por el más reciente del ticket (fallback)
                $sqlUpdatePayment = "UPDATE payment_records 
                                    SET " . implode(", ", $updateFields) . "
                                    WHERE id_payment_record = (
                                        SELECT id_payment_record 
                                        FROM payment_records 
                                        WHERE nro_ticket = " . $escaped_nro_ticket . "
                                        ORDER BY id_payment_record DESC
                                        LIMIT 1
                                    );";
            } else {
                // Para otros tipos de documentos que no están en payment_records, no hacemos nada aquí
                $sqlUpdatePayment = null;
            }
            
            if ($sqlUpdatePayment) {
                $resultUpdatePayment = pg_query($db_conn, $sqlUpdatePayment);
                
                if ($resultUpdatePayment === false) {
                    error_log("Error al actualizar payment_records para $document_type: " . pg_last_error($db_conn));
                } else {
                    pg_free_result($resultUpdatePayment);
                    error_log("payment_records actualizado correctamente para ticket: $nro_ticket");
                }
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
            "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer);",
            (int)$id_ticket,
            (int)$id_user,
            $id_status_ticket,
            $id_accion_ticket,
            $id_status_lab,
            isset($id_new_status_payment_for_history) ? $id_new_status_payment_for_history : $id_new_status_payment,
            $new_status_domiciliacion,
            $id_coordinador !== null && $id_coordinador !== 'NULL' ? (int)$id_coordinador : 'NULL',
            $id_payment_record ? (int)$id_payment_record : 'NULL'
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

    /**
     * Finaliza la revisión de un ticket, permitiendo que avance su curso
     * Cambia el id_status_payment a 1 (Conciliado/Aprobado Final)
     */
    public function FinalizarRevisionTicket($nro_ticket, $id_user) {
        $db_conn = $this->db->getConnection();
        
        try {
            // 1. Obtener el id_ticket por número
            $id_ticket = $this->getTicketIdByNumber($nro_ticket);
            if (!$id_ticket) {
                return ["success" => false, "message" => "Ticket no encontrado: " . $nro_ticket];
            }

            // 2. Verificar el estado de TODOS los pagos del ticket
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            $sql_check_payments = "SELECT payment_status, COUNT(*) as count 
                                   FROM payment_records 
                                   WHERE nro_ticket = " . $escaped_nro_ticket . "
                                   GROUP BY payment_status";
            
            $result_payments = pg_query($db_conn, $sql_check_payments);
            
            if (!$result_payments) {
                return ["success" => false, "message" => "Error al consultar los pagos: " . pg_last_error($db_conn)];
            }
            
            $approved_count = 0;
            $rejected_count = 0;
            $total_count = 0;
            $payment_statuses = [];
            
            while ($row = pg_fetch_assoc($result_payments)) {
                $total_count += $row['count'];
                $payment_statuses[] = $row['payment_status'];
                
                if ($row['payment_status'] == 6) {
                    $approved_count = $row['count'];
                } else if ($row['payment_status'] == 13) {
                    $rejected_count = $row['count'];
                }
            }
            
            
            // Si no hay pagos registrados, usar el comportamiento por defecto (status 6)
            if ($total_count == 0) {
                $id_new_status_payment_val = 6;
            } else {
                // Determinar el nuevo estado del ticket basado en los pagos
                if ($approved_count == $total_count) {
                    // Todos los pagos están aprobados
                    $id_new_status_payment_val = 6; // Pago Anticipo Aprobado
                } else if ($rejected_count == $total_count) {
                    // Todos los pagos están rechazados
                    $id_new_status_payment_val = 13; // Documento de Anticipo Rechazado
                } else {
                    // Hay pagos con estados mixtos o pendientes
                    // El botón ya está deshabilitado en el frontend, pero por seguridad
                    // usamos el status aprobado por defecto
                    $id_new_status_payment_val = 6;
                }
            }

            // 3. Actualizar el estado del ticket
            $sql_update = "UPDATE tickets SET id_status_payment = $id_new_status_payment_val WHERE id_ticket = " . (int)$id_ticket;
            $result3 = pg_query($db_conn, $sql_update);
            
            if (!$result3) {
                return ["success" => false, "message" => "Error al actualizar el estatus del ticket: " . pg_last_error($db_conn)];
            }

            // 4. Obtener todos los datos necesarios para el historial (Patrón robusto del usuario)
            if ($result3) {
                $id_status_lab = 0;
                $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . (int)$id_ticket . ";";
                $status_lab_result = pg_query($db_conn, $status_lab_sql);

                if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                    $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;
                }

                $new_status_domiciliacion = 'NULL';
                $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . (int)$id_ticket . ";";
                $status_domiciliacion_result = pg_query($db_conn, $status_domiciliacion_sql);

                if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                    $new_status_domiciliacion = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') !== null ? (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') : 'NULL';
                }

                $id_status_ticket = 'NULL';
                $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket . ";";
                $status_ticket_result = pg_query($db_conn, $status_ticket_sql);

                if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {
                    $id_status_ticket = pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') !== null ? (int)pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') : 'NULL';
                }

                $id_accion_ticket = 'NULL';
                $accion_ticket_sql = "SELECT id_accion_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket . ";";
                $accion_ticket_result = pg_query($db_conn, $accion_ticket_sql);

                if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
                    $id_accion_ticket = pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket') !== null ? (int)pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket') : 'NULL';
                }

                $id_new_status_payment = 'NULL';
                $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . (int)$id_ticket . ";";
                $status_payment_status_result = pg_query($db_conn, $status_payment_status_sql);
                if ($status_payment_status_result && pg_num_rows($status_payment_status_result) > 0) {
                    $id_new_status_payment = pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') !== null ? (int)pg_fetch_result($status_payment_status_result, 0, 'id_status_payment') : 'NULL';
                }

                $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";
                $resultcoordinador = pg_query($db_conn, $sqlgetcoordinador);
                if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
                    $row_coordinador = pg_fetch_assoc($resultcoordinador);
                    $id_coordinador = (int)$row_coordinador['id_coordinador'];
                    pg_free_result($resultcoordinador);
                } else {
                    $id_coordinador = 'NULL';
                }

                // 5. Insertar Historial
                $sql_history = sprintf(
                    "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer);",
                    (int)$id_ticket,
                    (int)$id_user,
                    $id_status_ticket,
                    $id_accion_ticket,
                    $id_status_lab,
                    $id_new_status_payment,
                    $new_status_domiciliacion,
                    $id_coordinador
                );

                pg_query($db_conn, $sql_history);
            }

            return ["success" => true, "message" => "Ticket finalizado correctamente. Ahora seguirá su curso."];

        } catch (Throwable $e) {
            error_log("Error en FinalizarRevisionTicket: " . $e->getMessage());
            return ["success" => false, "message" => "Excepción: " . $e->getMessage()];
        }
    }

    /**
     * Aprueba la exoneración de un ticket, moviendo id_status_payment a 6
     */
    public function AprobarExoneracionTicket($nro_ticket, $id_user, $id_exoneracion = null, $is_final_approval = false, $nro_exoneracion = null) {
        $db_conn = $this->db->getConnection();
        
        try {
            $this->db->pgquery("BEGIN");

            // 1. Obtener el id_ticket por número
            $id_ticket = $this->getTicketIdByNumber($nro_ticket);
            if (!$id_ticket) {
                $this->db->pgquery("ROLLBACK");
                return ["success" => false, "message" => "Ticket no encontrado: " . $nro_ticket];
            }

            // 2. Actualizar estatus en la tabla exoneraciones (4 = Exoneracion Aprobada)
            $whereExo = "WHERE nro_ticket = " . pg_escape_literal($db_conn, $nro_ticket);
            
            if ($id_exoneracion) {
                $whereExo .= " AND id_exoneracion = " . (int)$id_exoneracion;
                if ($nro_exoneracion) {
                    $whereExo .= " AND nro_exoneracion = " . pg_escape_literal($db_conn, $nro_exoneracion);
                }
            } else if ($is_final_approval) {
                // Si es aprobación final y no hay ID específico, aprobamos todas las pendientes
                $whereExo .= " AND id_status_payment = 5"; 
            } else {
                // Error de seguridad: Si no es aprobación final, EXIGIMOS un ID
                $this->db->pgquery("ROLLBACK");
                return ['success' => false, 'message' => 'ID de exoneración no proporcionado para aprobación individual.'];
            }

            $sqlExo = "UPDATE exoneraciones SET id_status_payment = 4 " . $whereExo;
            
            if (!$this->db->pgquery($sqlExo)) {
                $this->db->pgquery("ROLLBACK");
                return ['success' => false, 'message' => 'Error al actualizar estatus de exoneración.'];
            }

            // 3. Solo actualizamos el estatus del TICKET si es la aprobación final
            if ($is_final_approval) {
                // Verificar si quedan exoneraciones pendientes para este ticket
                $sqlCheckPending = "SELECT COUNT(*) as pending FROM exoneraciones 
                                    WHERE nro_ticket = " . pg_escape_literal($db_conn, $nro_ticket) . " 
                                    AND id_status_payment = 5";
                $resCheck = $this->db->pgquery($sqlCheckPending);
                $pendingExo = pg_fetch_result($resCheck, 0, 'pending');

                if ($pendingExo == 0) {
                    $sql_update = "UPDATE tickets SET id_status_payment = 4 WHERE id_ticket = " . (int)$id_ticket;
                    $result = pg_query($db_conn, $sql_update);
                    
                    if (!$result) {
                        $this->db->pgquery("ROLLBACK");
                        return ["success" => false, "message" => "Error al actualizar el estatus del ticket: " . pg_last_error($db_conn)];
                    }
                }
            }

            // 5. Obtener datos para el historial
            $id_status_lab = 0;
            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . (int)$id_ticket . ";";
            $status_lab_result = pg_query($db_conn, $status_lab_sql);
            if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                $id_status_lab = pg_fetch_result($status_lab_result, 0, 'id_status_lab') ?? 0;
            }

            $new_status_domiciliacion = 'NULL';
            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . (int)$id_ticket . ";";
            $status_domiciliacion_result = pg_query($db_conn, $status_domiciliacion_sql);
            if ($status_domiciliacion_result && pg_num_rows($status_domiciliacion_result) > 0) {
                $new_status_domiciliacion = pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') !== null ? (int)pg_fetch_result($status_domiciliacion_result, 0, 'id_status_domiciliacion') : 'NULL';
            }

            $id_status_ticket = 'NULL';
            $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket . ";";
            $status_ticket_result = pg_query($db_conn, $status_ticket_sql);
            if ($status_ticket_result && pg_num_rows($status_ticket_result) > 0) {
                $id_status_ticket = pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') !== null ? (int)pg_fetch_result($status_ticket_result, 0, 'id_status_ticket') : 'NULL';
            }

            $id_accion_ticket = 'NULL';
            $accion_ticket_sql = "SELECT id_accion_ticket FROM tickets WHERE id_ticket = " . (int)$id_ticket . ";";
            $accion_ticket_result = pg_query($db_conn, $accion_ticket_sql);
            if ($accion_ticket_result && pg_num_rows($accion_ticket_result) > 0) {
                $id_accion_ticket = pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket') !== null ? (int)pg_fetch_result($accion_ticket_result, 0, 'id_accion_ticket') : 'NULL';
            }

            $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";
            $resultcoordinador = pg_query($db_conn, $sqlgetcoordinador);
            $id_coordinador = ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) ? (int)pg_fetch_result($resultcoordinador, 0, 'id_coordinador') : 'NULL';

            // 6. Obtener el estatus de pago actual del ticket para el historial (ya que no lo cambiamos)
            $id_current_status_payment = 'NULL';
            $status_payment_current_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . (int)$id_ticket . ";";
            $status_payment_current_result = pg_query($db_conn, $status_payment_current_sql);
            if ($status_payment_current_result && pg_num_rows($status_payment_current_result) > 0) {
                $id_current_status_payment = pg_fetch_result($status_payment_current_result, 0, 'id_status_payment') !== null ? (int)pg_fetch_result($status_payment_current_result, 0, 'id_status_payment') : 'NULL';
            }

            // 7. Insertar Historial (Usamos el estatus de pago actual del ticket)
            $sql_history = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer, %s::integer);",
                (int)$id_ticket,
                (int)$id_user,
                $id_status_ticket,
                $id_accion_ticket,
                $id_status_lab,
                $id_current_status_payment,
                $new_status_domiciliacion,
                $id_coordinador
            );

            pg_query($db_conn, $sql_history);

            $this->db->pgquery("COMMIT");
            return ["success" => true, "message" => "Exoneración aprobada correctamente."];

        } catch (Throwable $e) {
            $this->db->pgquery("ROLLBACK");
            error_log("Error en AprobarExoneracionTicket: " . $e->getMessage());
            return ["success" => false, "message" => "Excepción: " . $e->getMessage()];
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



    /**
     * Verifica aprobaciones individuales en tablas específicas según el tipo de trámite (Pago o Exoneración)
     */
   

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

    /**
     * Cierre generico de ticket desde cualquier modulo.
     * Funcion independiente del flujo de gestion_regions.
     * Usa id_accion_ticket = 16 (Entregado) e id_status_ticket = 3 (Cerrado).
     */
    public function EntregarTicketGenerico($id_ticket, $id_user, $comment) {
        try {
            $db_conn = $this->db->getConnection();
            $escaped_comment = pg_escape_string($db_conn, $comment);

            // 1. Actualizar tickets
            $sql = "UPDATE tickets SET id_accion_ticket = 16, id_status_ticket = 3, date_delivered = NOW(), customer_delivery_comment = '" . $escaped_comment . "' WHERE id_ticket = " . (int)$id_ticket . ";";
            $result = Model::getResult($sql, $this->db);
            if (!$result) {
                error_log("EntregarTicketGenerico: Error UPDATE tickets. " . pg_last_error($db_conn));
                return false;
            }

            // 2. Actualizar fecha de fin en users_tickets
            $sqldate = "UPDATE users_tickets SET date_end_ticket = NOW() WHERE id_ticket = " . (int)$id_ticket . ";";
            Model::getResult($sqldate, $this->db);

            // 3. Recopilar estados actuales para el historial
            $id_new_status_lab = 0;
            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = " . (int)$id_ticket . ";";
            $status_lab_result = pg_query($db_conn, $status_lab_sql);
            if ($status_lab_result && pg_num_rows($status_lab_result) > 0) {
                $id_new_status_lab = (int)(pg_fetch_assoc($status_lab_result)['id_status_lab'] ?? 0);
            }

            $id_new_status_payment = null;
            $status_payment_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = " . (int)$id_ticket . ";";
            $status_payment_result = pg_query($db_conn, $status_payment_sql);
            if ($status_payment_result && pg_num_rows($status_payment_result) > 0) {
                $id_new_status_payment = pg_fetch_assoc($status_payment_result)['id_status_payment'] ?? null;
            }

            $new_status_domiciliacion = 'NULL';
            $status_dom_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = " . (int)$id_ticket . ";";
            $status_dom_result = pg_query($db_conn, $status_dom_sql);
            if ($status_dom_result && pg_num_rows($status_dom_result) > 0) {
                $dom_data = pg_fetch_assoc($status_dom_result);
                $new_status_domiciliacion = $dom_data['id_status_domiciliacion'] !== null ? (int)$dom_data['id_status_domiciliacion'] : 'NULL';
            }

            $id_coordinador = 'NULL';
            $coord_sql = "SELECT id_coordinador FROM users_tickets WHERE id_ticket = " . (int)$id_ticket . ";";
            $coord_result = pg_query($db_conn, $coord_sql);
            if ($coord_result && pg_num_rows($coord_result) > 0) {
                $id_coordinador = (int)(pg_fetch_assoc($coord_result)['id_coordinador'] ?? 0);
            }

            // 4. Insertar historial (igual que EntregarTicket original)
            $sqlHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer);",
                (int)$id_ticket,
                (int)$id_user,
                3,  // id_status_ticket = Cerrado
                16, // id_accion_ticket = Entregado
                (int)$id_new_status_lab,
                (int)$id_new_status_payment,
                $new_status_domiciliacion,
                $id_coordinador
            );
            pg_query($db_conn, $sqlHistory);

            return true;

        } catch (Throwable $e) {
            error_log("EntregarTicketGenerico: " . $e->getMessage());
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

            $sql = "SELECT * FROM spverdatabancos()";

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

    public function GetPaymentData($nro_ticket, $id_payment_record = null, $payment_reference = null, $record_number = null){

        try {

            $db_conn = $this->db->getConnection();
            $whereClause = "WHERE nro_ticket = " . pg_escape_literal($db_conn, $nro_ticket);
            
            if ($id_payment_record) {
                $whereClause .= " AND id_payment_record = " . (int)$id_payment_record;
            }

            if ($payment_reference) {
                $whereClause .= " AND payment_reference = " . pg_escape_literal($db_conn, $payment_reference);
            }

            if ($record_number) {
                $whereClause .= " AND record_number = " . pg_escape_literal($db_conn, $record_number);
            }

            $sql = "SELECT *, 
                           (SELECT SUM(reference_amount) FROM payment_records WHERE nro_ticket = p.nro_ticket AND (is_substituted IS NULL OR is_substituted = FALSE) AND payment_status IN (1, 3, 4, 5, 6, 7, 17)) as total_reference_amount,
                           (SELECT SUM(amount_bs) FROM payment_records WHERE nro_ticket = p.nro_ticket AND (is_substituted IS NULL OR is_substituted = FALSE) AND payment_status IN (1, 3, 4, 5, 6, 7, 17)) as total_amount_bs
                    FROM payment_records p 
                    " . $whereClause . " 
                    ORDER BY id_payment_record DESC LIMIT 1;";

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
            
            // 1. Obtener el siguiente número de secuencia real desde la base de datos
            $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
            $countSql = "SELECT COUNT(*) as total FROM budgets WHERE nro_ticket = " . $escaped_nro_ticket;
            $countResult = $this->db->pgquery($countSql);
            if ($countResult === false) {
                error_log("Error al contar presupuestos: " . pg_last_error($db_conn));
                $sequence = 1; // Fallback a 1 si falla la cuenta
            } else {
                $countRow = pg_fetch_assoc($countResult);
                $sequence = intval($countRow['total']) + 1;
                pg_free_result($countResult);
            }
            
            // Formatear el número: PRES-TICKET-SEQ (ej: PRES-1302260001-001)
            $seqFormatted = str_pad($sequence, 3, '0', STR_PAD_LEFT);
            $final_presupuesto_numero = "PRES-" . $nro_ticket . "-" . $seqFormatted;
            
            // Escapar parámetros restantes
            $escaped_monto_taller = (float)$monto_taller;
            $escaped_diferencia_usd = (float)$diferencia_usd;
            $escaped_diferencia_bs = (float)$diferencia_bs;
            $escaped_descripcion = $descripcion_reparacion ? pg_escape_literal($db_conn, $descripcion_reparacion) : 'NULL';
            $escaped_fecha_presupuesto = pg_escape_literal($db_conn, $fecha_presupuesto);
            $escaped_final_numero = pg_escape_literal($db_conn, $final_presupuesto_numero);
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
                    " . $escaped_final_numero . ",
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
            $presupuesto_numero_actual = $row['presupuesto_numero'];
            pg_free_result($result);
            
            return [
                'id_budget' => $id_budget,
                'presupuesto_numero' => $presupuesto_numero_actual
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

    /* SOLO ME ELIJE EL ID_STATUS_PAYMENT = 7 LA CUAL ES PENDIENTE POR REVISION ANTICIPO DE LOS STATUS DE PAGO*/
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

    /* ESTA ME TRAERA EL STATUS CORRECTO: 17 SI HAY PAGOS, 7 SI NO HAY PAGOS*/
    public function GetPaymentStatusByTicket($nro_ticket = null){
        try {
            $db_conn = $this->db->getConnection();
            
            if (!empty($nro_ticket)) {
                $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
                $sql = "SELECT * FROM status_payments 
                        WHERE id_status_payment = (
                            CASE 
                                WHEN EXISTS (
                                    SELECT 1 FROM archivos_adjuntos 
                                    WHERE nro_ticket = " . $escaped_nro_ticket . " 
                                    AND document_type = 'Anticipo' 
                                    AND (rechazado IS NULL OR rechazado = FALSE)
                                ) THEN 17 
                                ELSE 7 
                            END
                        )";
            } else {
                $sql = "SELECT * FROM status_payments WHERE id_status_payment = 7";
            }

            $result = Model::getResult($sql, $this->db);
            return $result;

        } catch (Throwable $e) {
            error_log("Error en GetPaymentStatusByTicket: " . $e->getMessage());
            return false;
        }
    }

    public function GetTotalPaidByTicket($nro_ticket){
        try {
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            
            $sql = "SELECT 
                        COALESCE(SUM(CASE WHEN pr.payment_status = 6 THEN pr.reference_amount ELSE 0 END), 0) as total_paid,
                        COALESCE(SUM(CASE WHEN pr.payment_status IN (1, 3, 4, 5, 7, 17) THEN pr.reference_amount ELSE 0 END), 0) as total_pending,
                        COALESCE((SELECT monto_taller FROM budgets WHERE nro_ticket = " . $escaped_nro_ticket . " LIMIT 1), 0) as total_budget,
                        COALESCE((SELECT diferencia_usd FROM budgets WHERE nro_ticket = " . $escaped_nro_ticket . " LIMIT 1), 0) as presupuesto_diferencia,
                        COALESCE((SELECT porcentaje FROM exoneraciones WHERE nro_ticket = " . $escaped_nro_ticket . " ORDER BY id_exoneracion DESC LIMIT 1), 0) as exoneracion_porcentaje,
                        (SELECT tipo_exoneracion FROM exoneraciones WHERE nro_ticket = " . $escaped_nro_ticket . " ORDER BY id_exoneracion DESC LIMIT 1) as tipo_exoneracion
                    FROM payment_records pr
                    WHERE pr.nro_ticket = " . $escaped_nro_ticket . "
                    AND (pr.is_substituted IS NULL OR pr.is_substituted = FALSE)";


            
            $result = Model::getResult($sql, $this->db);
            
            if ($result && $result['numRows'] > 0) {
                $row = pg_fetch_assoc($result['query'], 0);
                return [
                    'total_paid' => floatval($row['total_paid']),
                    'total_pending' => floatval($row['total_pending']),
                    'total_budget' => floatval($row['total_budget']),
                    'presupuesto_diferencia' => floatval($row['presupuesto_diferencia']),
                    'exoneracion_porcentaje' => floatval($row['exoneracion_porcentaje']),
                    'tipo_exoneracion' => $row['tipo_exoneracion']
                ];
            }
            
            return ['total_paid' => 0.0, 'total_pending' => 0.0, 'total_budget' => 0.0];

        } catch (Throwable $e) {
            error_log("Error en GetTotalPaidByTicket: " . $e->getMessage());
            return ['total_paid' => 0.0, 'total_pending' => 0.0, 'total_budget' => 0.0];
        }

    }

    public function InsertPaymentRecord($data) {
        try {
            $db_conn = $this->db->getConnection();
            
            // Prepare data with quoting/escaping
            $nro_ticket_val = $data['nro_ticket'];
            $nro_ticket = pg_escape_literal($db_conn, $nro_ticket_val);
            $serial_pos = pg_escape_literal($db_conn, $data['serial_pos']);
            $user_loader = intval($data['user_loader']);
            $payment_date = pg_escape_literal($db_conn, $data['payment_date']); // Transaction date
            $payment_method = pg_escape_literal($db_conn, $data['payment_method']);
            $currency = pg_escape_literal($db_conn, $data['currency']);
            $reference_amount = !empty($data['reference_amount']) ? floatval($data['reference_amount']) : 'NULL';
            $amount_bs = floatval($data['amount_bs']);
            $payment_reference = pg_escape_literal($db_conn, $data['payment_reference']);
            $depositor = pg_escape_literal($db_conn, $data['depositor']);
            $observations = pg_escape_literal($db_conn, $data['observations']);
            $record_number = pg_escape_literal($db_conn, $data['record_number']); // registro
            
            // Optional/Nullable fields
            $origen_bank = !empty($data['origen_bank']) ? pg_escape_literal($db_conn, $data['origen_bank']) : 'NULL';
            $destination_bank = !empty($data['destination_bank']) ? pg_escape_literal($db_conn, $data['destination_bank']) : 'NULL';
            
            // Mobile payment specific fields (if applicable, assuming null for now or passed in data)
            $destino_rif_tipo = !empty($data['destino_rif_tipo']) ? pg_escape_literal($db_conn, $data['destino_rif_tipo']) : 'NULL';
            $destino_rif_numero = !empty($data['destino_rif_numero']) ? pg_escape_literal($db_conn, $data['destino_rif_numero']) : 'NULL';
            $destino_telefono = !empty($data['destino_telefono']) ? pg_escape_literal($db_conn, $data['destino_telefono']) : 'NULL';
            
            $origen_rif_tipo = !empty($data['origen_rif_tipo']) ? pg_escape_literal($db_conn, $data['origen_rif_tipo']) : 'NULL';
            $origen_rif_numero = !empty($data['origen_rif_numero']) ? pg_escape_literal($db_conn, $data['origen_rif_numero']) : 'NULL';
            $origen_telefono = !empty($data['origen_telefono']) ? pg_escape_literal($db_conn, $data['origen_telefono']) : 'NULL';

            // Determine Status Check if existing payments
            $checkSql = "SELECT COUNT(*) as count FROM payment_records WHERE nro_ticket = $nro_ticket";
            $checkResult = Model::getResult($checkSql, $this->db);
            $existingCount = 0;
            if ($checkResult && $checkResult['numRows'] > 0) {
                $checkRow = pg_fetch_assoc($checkResult['query'], 0);
                $existingCount = intval($checkRow['count']);
            }

            // Determine Status: use provided status if available, elsewhere use centralized logic
        if (isset($data['payment_status']) && !empty($data['payment_status'])) {
            $payment_status = intval($data['payment_status']);
        } else {
            // We treat a payment insertion as an 'Anticipo' document upload event for status purposes
            $payment_status = $this->determineStatusPayment($nro_ticket_val, 'Anticipo');
        }

            // AUTO-LINK EXONERACION (Traceability)
            // We look for the most recent exoneration for this ticket
            $linkSql = "SELECT id_exoneracion FROM exoneraciones WHERE nro_ticket = $nro_ticket ORDER BY id_exoneracion DESC LIMIT 1";
            $linkResult = Model::getResult($linkSql, $this->db);
            $id_exoneracion_val = 'NULL';
            if ($linkResult && $linkResult['numRows'] > 0) {
                $linkRow = pg_fetch_assoc($linkResult['query'], 0);
                $id_exoneracion_val = intval($linkRow['id_exoneracion']);
            }

            // CONFIRMATION NUMBER defaults to FALSE
            $confirmation_number = 'false';

            $sql = "INSERT INTO payment_records (
                nro_ticket, serial_pos, user_loader, payment_date, 
                origen_bank, destination_bank, payment_method, currency, 
                reference_amount, amount_bs, payment_reference, depositor, 
                observations, record_number, loadpayment_date, payment_status,
                confirmation_number,
                destino_rif_tipo, destino_rif_numero, destino_telefono,
                origen_rif_tipo, origen_rif_numero, origen_telefono,
                id_exoneracion
            ) VALUES (
                $nro_ticket, $serial_pos, $user_loader, $payment_date,
                $origen_bank, $destination_bank, $payment_method, $currency,
                $reference_amount, $amount_bs, $payment_reference, $depositor,
                $observations, $record_number, NOW(), $payment_status,
                $confirmation_number,
                $destino_rif_tipo, $destino_rif_numero, $destino_telefono,
                $origen_rif_tipo, $origen_rif_numero, $origen_telefono,
                $id_exoneracion_val
            ) RETURNING id_payment_record";

            $result = Model::getResult($sql, $this->db);

            if ($result && $result['numRows'] > 0) {
                 $row = pg_fetch_assoc($result['query'], 0);
                 $id_payment_record = $row['id_payment_record'];

                 // UPDATE TICKET STATUS AND HISTORY
                 $this->syncTicketStatusAndHistoryByNro($nro_ticket_val, $user_loader, $payment_status);

                 return $id_payment_record;
            }
            
            return false;
        } catch (Throwable $e) {
            error_log("Error en InsertPaymentRecord: " . $e->getMessage());
            return false;
        }
    }

    public function GetPaymentsByTicket($nro_ticket){
        try {
            $escaped_nro_ticket = pg_escape_literal($this->db->getConnection(), $nro_ticket);
            
            $sql = "SELECT 
                        p.id_payment_record,
                        p.record_number,
                        p.payment_date,
                        p.payment_method,
                        p.currency,
                        p.amount_bs,
                        p.reference_amount,
                        p.payment_reference,
                        p.depositor,
                        p.origen_bank,
                        p.destination_bank,
                        p.confirmation_number,
                        p.payment_status,
                        p.serial_pos,
                        p.nro_ticket,
                        p.id_exoneracion,
                        a.file_path,
                        a.file_path as receipt_path,
                        a.mime_type as receipt_mime,
                        a.original_filename as receipt_name,
                        a.document_type
                    FROM payment_records p
                    LEFT JOIN archivos_adjuntos a ON p.record_number = a.record_number
                    WHERE p.nro_ticket = " . $escaped_nro_ticket . "
                    AND (p.is_substituted IS NULL OR p.is_substituted = FALSE)
                    ORDER BY p.payment_date DESC";
            
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en GetPaymentsByTicket: " . $e->getMessage());
            return false;
        }
    }

    public function SavePayment($serial_pos, $nro_ticket, $user_loader, $payment_date, $origen_bank, $destination_bank, $payment_method, $currency, $reference_amount, $amount_bs, $payment_reference, $depositor, $observations, $record_number, $loadpayment_date, $confirmation_number, $payment_status, $destino_rif_tipo = null, $destino_rif_numero = null, $destino_telefono = null, $destino_banco = null, $origen_rif_tipo = null, $origen_rif_numero = null, $origen_telefono = null, $origen_banco = null){

        try {
            // Si hay nro_ticket, insertar directamente en payment_records
            if (!empty($nro_ticket)) {
                $db_conn = $this->db->getConnection();
                $escaped_nro_ticket = pg_escape_literal($db_conn, $nro_ticket);
                $escaped_serial_pos = pg_escape_literal($db_conn, $serial_pos);
                
                // Recalculate status according to rules
                $payment_status = $this->determineStatusPayment($nro_ticket, 'Anticipo');
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
                    " . ($payment_date ? "'" . pg_escape_string($db_conn, $payment_date) . "'" : "NULL") . ",
                    " . ($origen_bank ? pg_escape_literal($db_conn, $origen_bank) : "NULL") . ",
                    " . ($destination_bank ? pg_escape_literal($db_conn, $destination_bank) : "NULL") . ",
                    " . pg_escape_literal($db_conn, $payment_method) . ",
                    " . pg_escape_literal($db_conn, $currency) . ",
                    " . ($reference_amount ? (float)$reference_amount : "NULL") . ",
                    " . (float)$amount_bs . ",
                    " . ($payment_reference ? pg_escape_literal($db_conn, $payment_reference) : "NULL") . ",
                    " . ($depositor ? pg_escape_literal($db_conn, $depositor) : "NULL") . ",
                    " . ($observations ? pg_escape_literal($db_conn, $observations) : "NULL") . ",
                    " . ($record_number ? pg_escape_literal($db_conn, $record_number) : "NULL") . ",
                    " . ($loadpayment_date ? "'" . pg_escape_string($db_conn, $loadpayment_date) . "'" : "NOW()") . ",
                    " . ($confirmation_number ? "TRUE" : "FALSE") . ",
                    " . (int)$payment_status . ",
                    " . ($destino_rif_tipo ? pg_escape_literal($db_conn, $destino_rif_tipo) : "NULL") . ",
                    " . ($destino_rif_numero ? pg_escape_literal($db_conn, $destino_rif_numero) : "NULL") . ",
                    " . ($destino_telefono ? pg_escape_literal($db_conn, $destino_telefono) : "NULL") . ",
                    " . ($destino_banco ? pg_escape_literal($db_conn, $destino_banco) : "NULL") . ",
                    " . ($origen_rif_tipo ? pg_escape_literal($db_conn, $origen_rif_tipo) : "NULL") . ",
                    " . ($origen_rif_numero ? pg_escape_literal($db_conn, $origen_rif_numero) : "NULL") . ",
                    " . ($origen_telefono ? pg_escape_literal($db_conn, $origen_telefono) : "NULL") . ",
                    " . ($origen_banco ? pg_escape_literal($db_conn, $origen_banco) : "NULL") . "
                ) RETURNING id_payment_record;";
                
                $result = Model::getResult($sql, $this->db);
                
                if ($result && $result['numRows'] > 0) {
                    $row = pg_fetch_assoc($result['query'], 0);
                    $id_payment_record = $row['id_payment_record'];

                    // UPDATE TICKET STATUS AND HISTORY
                    $this->syncTicketStatusAndHistoryByNro($nro_ticket, $user_loader, $payment_status);

                    return $id_payment_record;
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
                        " . ($payment_status ? (int)$payment_status : "7") . ",
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
                    " . ($payment_data['payment_status'] ? (int)$payment_data['payment_status'] : "7") . ",
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

    /**
     * Obtiene el total de exoneraciones realizadas para un serial específico.
     * Útil para generar el correlativo (ej. Exo02-XXXX).
     */
    public function GetExonerationCount($serial_pos) {
        try {
            $db_conn = $this->db->getConnection();
            $sqlSelect = "SELECT COUNT(*) as total FROM exoneraciones WHERE serial_pos = " . pg_escape_literal($db_conn, $serial_pos);
            $result = $this->db->pgquery($sqlSelect);

            if ($result && pg_num_rows($result) > 0) {
                $row = pg_fetch_assoc($result);
                return (int)$row['total'];
            }
            return 0;
        } catch (Exception $e) {
            error_log("Error en GetExonerationCount: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Guarda los datos de exoneración en la tabla temporal.
     */
    public function SaveExoneracion($serial_pos, $tipo_exoneracion, $porcentaje, $nro_exoneracion, $id_user) {
        try {
            $db_conn = $this->db->getConnection();
            
            // ASEGURAR SUFIJO POR TIPO (-A para Anticipo, -T para Pago Taller)
            if ($tipo_exoneracion === 'Anticipo' && !preg_match('/-A$/i', $nro_exoneracion)) {
                $nro_exoneracion .= '-A';
            } else if ($tipo_exoneracion === 'Pago taller' && !preg_match('/-T$/i', $nro_exoneracion)) {
                $nro_exoneracion .= '-T';
            }

            // 1. CREACIÓN DE LA TABLA TEMPORAL (si no existe)
            $sqlTable = "CREATE TEMPORARY TABLE IF NOT EXISTS temp_exoneracion_uploads (
                id_temp_exoneracion SERIAL PRIMARY KEY,
                serial_pos VARCHAR(225) NOT NULL,
                tipo_exoneracion VARCHAR(100),
                porcentaje INTEGER,
                nro_exoneracion VARCHAR(50),
                id_user INTEGER,
                id_status_payment INTEGER DEFAULT 5
            ) ON COMMIT PRESERVE ROWS;";
            $this->db->pgquery($sqlTable);

            // 2. Limpiar registros previos para este serial en la temporal
            $sqlDelete = "DELETE FROM temp_exoneracion_uploads WHERE serial_pos = " . pg_escape_literal($db_conn, $serial_pos) . ";";
            $this->db->pgquery($sqlDelete);

            // 3. Insertar nuevo registro
            $sqlInsert = "INSERT INTO temp_exoneracion_uploads (serial_pos, tipo_exoneracion, porcentaje, nro_exoneracion, id_user, id_status_payment) VALUES ("
                . pg_escape_literal($db_conn, $serial_pos) . ", "
                . pg_escape_literal($db_conn, $tipo_exoneracion) . ", "
                . (int)$porcentaje . ", "
                . pg_escape_literal($db_conn, $nro_exoneracion) . ", "
                . (int)$id_user . ", 5) RETURNING id_temp_exoneracion;";
            
            $result = $this->getResult($sqlInsert, $this->db);
            return $result && $result['numRows'] > 0;
        } catch (Exception $e) {
            error_log("Error en SaveExoneracion: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Guarda los datos de exoneración directamente en la tabla principal.
     */
    public function SaveExoneracionDirect($nro_ticket, $serial_pos, $tipo_exoneracion, $porcentaje, $nro_exoneracion, $id_user) {
        try {
            $db_conn = $this->db->getConnection();
            
            // ASEGURAR SUFIJO POR TIPO (-A para Anticipo, -T para Pago Taller)
            if ($tipo_exoneracion === 'Anticipo' && !preg_match('/-A$/i', $nro_exoneracion)) {
                $nro_exoneracion .= '-A';
            } else if ($tipo_exoneracion === 'Pago taller' && !preg_match('/-T$/i', $nro_exoneracion)) {
                $nro_exoneracion .= '-T';
            }

            $sqlInsert = "INSERT INTO exoneraciones (nro_ticket, serial_pos, tipo_exoneracion, porcentaje, nro_exoneracion, id_user, id_status_payment) VALUES ("
                . pg_escape_literal($db_conn, $nro_ticket) . ", "
                . pg_escape_literal($db_conn, $serial_pos) . ", "
                . pg_escape_literal($db_conn, $tipo_exoneracion) . ", "
                . (int)$porcentaje . ", "
                . pg_escape_literal($db_conn, $nro_exoneracion) . ", "
                . (int)$id_user . ", 5) RETURNING id_exoneracion;";
            
            $result = $this->getResult($sqlInsert, $this->db);
            return $result && $result['numRows'] > 0;
        } catch (Exception $e) {
            error_log("Error en SaveExoneracionDirect: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtiene el historial de exoneraciones para un ticket específico.
     */
    public function GetExonerationHistory($nro_ticket) {
        try {
            $db_conn = $this->db->getConnection();
            $sql = "SELECT e.*, u.name as user_name, u.surname as user_surname,
                           adj.file_path, adj.original_filename
                    FROM exoneraciones e
                    LEFT JOIN users u ON e.id_user = u.id_user
                    LEFT JOIN LATERAL (
                        SELECT a.file_path, a.original_filename
                        FROM archivos_adjuntos a
                        WHERE a.record_number = e.nro_exoneracion
                        AND (a.is_substituted IS NULL OR a.is_substituted = FALSE)
                        ORDER BY a.uploaded_at DESC
                        LIMIT 1
                    ) as adj ON TRUE
                    WHERE e.nro_ticket = " . pg_escape_literal($db_conn, $nro_ticket) . "
                    AND (e.is_substituted IS NULL OR e.is_substituted = FALSE)
                    ORDER BY e.fecha_creacion DESC;";
            
            $result = $this->getResult($sql, $this->db);
            return $result;
        } catch (Exception $e) {
            error_log("Error en GetExonerationHistory: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Actualiza una exoneración mediante el modelo de SUSTITUCIÓN (Historial).
     * Sigue el patrón de CreatePaymentSubstitution.
     */
    public function UpdateExoneracion($id_exoneracion, $porcentaje, $fileData = null) {
        try {
            $db_conn = $this->db->getConnection();
            $id_exo_old = (int)$id_exoneracion;
            $porc = (int)$porcentaje;
            $updated_at = date('Y-m-d H:i:s');
            
            if (session_status() === PHP_SESSION_NONE) session_start();
            $id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;

            // 1. Obtener la exoneración original
            $sqlOld = "SELECT * FROM exoneraciones WHERE id_exoneracion = $id_exo_old";
            $resOld = pg_query($db_conn, $sqlOld);
            if (!$resOld || pg_num_rows($resOld) === 0) return false;
            $oldData = pg_fetch_assoc($resOld);

            // 2. Preparar los datos del NUEVO registro (Copia enriquecida)
            $newData = $oldData;
            $newData['porcentaje'] = $porc;
            $newData['id_status_payment'] = 5; // Vuelve a pendiente por aprobar
            $newData['fecha_creacion'] = $updated_at;
            $newData['id_user'] = $id_user ?? $oldData['id_user'];
            unset($newData['id_exoneracion']);
            
            // Aseguramos estados iniciales para el nuevo
            $newData['is_substituted'] = 'FALSE';
            if (array_key_exists('substituted_by_id_exoneracion', $newData)) {
                $newData['substituted_by_id_exoneracion'] = null;
            }

            // 3. Insertar el NUEVO registro
            $cols = []; $vals = [];
            foreach ($newData as $key => $val) {
                $cols[] = $key;
                if ($val === null) $vals[] = 'NULL';
                elseif (is_bool($val)) $vals[] = $val ? 'TRUE' : 'FALSE';
                else $vals[] = pg_escape_literal($db_conn, $val);
            }
            $sqlInsert = "INSERT INTO exoneraciones (" . implode(", ", $cols) . ") VALUES (" . implode(", ", $vals) . ") RETURNING id_exoneracion";
            $resInsert = pg_query($db_conn, $sqlInsert);
            if (!$resInsert) return false;
            
            $id_exo_new = pg_fetch_result($resInsert, 0, 0);

            // 4. Vincular el ANTIGUO al NUEVO y marcarlo como sustituido
            $sqlUpdateOld = "UPDATE exoneraciones 
                            SET is_substituted = TRUE, 
                                substituted_by_id_exoneracion = $id_exo_new 
                            WHERE id_exoneracion = $id_exo_old";
            pg_query($db_conn, $sqlUpdateOld);

            // 5. Gestión del Soporte (Archivos Adjuntos)
            $nro_ticket = $oldData['nro_ticket'];
            $tipo_exoneracion = $oldData['tipo_exoneracion'];
            $nro_exoneracion = $oldData['nro_exoneracion'];

            // Seteo de variables para los updates de archivos posteriores
            $escaped_rec = pg_escape_literal($db_conn, $nro_exoneracion);
            $escaped_tipo = pg_escape_literal($db_conn, $tipo_exoneracion);

            if ($fileData && $fileData['error'] === UPLOAD_ERR_OK) {
                // 1. Obtener el serial del ticket para la ruta (Estructura Estándar)
                $sqlTicket = "SELECT serial_pos FROM tickets WHERE nro_ticket = " . pg_escape_literal($db_conn, $nro_ticket) . " LIMIT 1";
                $resTkt = pg_query($db_conn, $sqlTicket);
                $ticketInfo = pg_fetch_assoc($resTkt);
                $serial = ($ticketInfo && isset($ticketInfo['serial_pos'])) ? preg_replace("/[^a-zA-Z0-9_-]/", "_", $ticketInfo['serial_pos']) : 'SERIAL_UNKNOWN';

                // 2. Definir Base Upload Dir (desde la constante definida en database.php)
                $baseUploadDir = defined('UPLOAD_BASE_DIR') ? UPLOAD_BASE_DIR : 'C:' . DIRECTORY_SEPARATOR . 'Documentos_SoportePost' . DIRECTORY_SEPARATOR;
                
                $ticketFolder = preg_replace('/[^a-zA-Z0-9_-]/', '', $nro_ticket);
                $uploadDir = $baseUploadDir . $serial . DIRECTORY_SEPARATOR . $ticketFolder . DIRECTORY_SEPARATOR . 'Exoneracion' . DIRECTORY_SEPARATOR;
                
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

                $ext = pathinfo($fileData['name'], PATHINFO_EXTENSION);
                $safeTipo = str_replace(' ', '_', $tipo_exoneracion);
                $filename = "Exo_{$safeTipo}_{$ticketFolder}_" . date('Ymd_His') . "_SUB.{$ext}";
                $targetPath = $uploadDir . $filename;

                if (move_uploaded_file($fileData['tmp_name'], $targetPath)) {
                    $resFile = $this->saveArchivoAdjunto(
                        0, 
                        $nro_ticket,
                        $id_user ?? 0,
                        $fileData['name'],
                        $filename,
                        $targetPath,
                        $fileData['type'],
                        $fileData['size'],
                        $tipo_exoneracion,
                        $nro_exoneracion,
                        true 
                    );

                    if (isset($resFile['success']) && $resFile['success'] && isset($resFile['id'])) {
                        $newFileId = $resFile['id'];
                        // VINCULAR VIEJOS CON EL NUEVO
                        $sqlLinkDoc = "UPDATE archivos_adjuntos 
                                      SET is_substituted = TRUE, 
                                          substituted_by_id_payment_record = $newFileId 
                                      WHERE record_number = $escaped_rec AND document_type = $escaped_tipo
                                      AND id != $newFileId AND (is_substituted IS NULL OR is_substituted = FALSE)";
                        pg_query($db_conn, $sqlLinkDoc);
                    }
                }
            } else {
                // 1. Marcar el soporte actual como SUSTITUIDO antes de clonar (para tener una base)
                $sqlMarkOld = "UPDATE archivos_adjuntos SET is_substituted = TRUE 
                              WHERE record_number = $escaped_rec AND document_type = $escaped_tipo 
                              AND (is_substituted IS NULL OR is_substituted = FALSE)";
                pg_query($db_conn, $sqlMarkOld);

                // 2. Clonar el soporte anterior (que acabamos de marcar como TRUE) para la nueva exoneración
                $sqlCloneFile = "INSERT INTO archivos_adjuntos (nro_ticket, original_filename, stored_filename, file_path, mime_type, file_size_bytes, uploaded_by_user_id, document_type, record_number, is_substituted)
                                 SELECT nro_ticket, original_filename, stored_filename, file_path, mime_type, file_size_bytes, " . ($id_user ?? 'uploaded_by_user_id') . ", document_type, record_number, FALSE
                                 FROM archivos_adjuntos 
                                 WHERE record_number = $escaped_rec AND document_type = $escaped_tipo AND is_substituted = TRUE
                                 ORDER BY id DESC LIMIT 1
                                 RETURNING id";
                
                $resClone = pg_query($db_conn, $sqlCloneFile);
                if ($resClone && pg_num_rows($resClone) > 0) {
                    $newCloneId = pg_fetch_result($resClone, 0, 0);
                    // 3. Vincular el registro viejo específicamente con el ID del nuevo clon
                    $sqlLinkClone = "UPDATE archivos_adjuntos 
                                    SET substituted_by_id_payment_record = $newCloneId 
                                    WHERE record_number = $escaped_rec AND document_type = $escaped_tipo
                                    AND id != $newCloneId AND is_substituted = TRUE AND substituted_by_id_payment_record IS NULL";
                    pg_query($db_conn, $sqlLinkClone);
                }
            }

            return true;
        } catch (Throwable $e) {
            error_log("Error en UpdateExoneration: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Transfiere la exoneración de la tabla temporal a la principal.
     */
    public function TransferExoneracionFromTempToMain($serial_pos, $nro_ticket) {
        try {
            $db_conn = $this->db->getConnection();
            
            // Asegurarse de que la tabla temporal existe antes de consultar
            $sqlTable = "CREATE TEMPORARY TABLE IF NOT EXISTS temp_exoneracion_uploads (
                id_temp_exoneracion SERIAL PRIMARY KEY,
                serial_pos VARCHAR(225) NOT NULL,
                tipo_exoneracion VARCHAR(100),
                porcentaje INTEGER,
                nro_exoneracion VARCHAR(50),
                id_user INTEGER,
                id_status_payment INTEGER DEFAULT 5
            ) ON COMMIT PRESERVE ROWS;";
            $this->db->pgquery($sqlTable);

            // 1. Obtener datos de la temporal
            $sqlSelect = "SELECT * FROM temp_exoneracion_uploads WHERE serial_pos = " . pg_escape_literal($db_conn, $serial_pos) . " LIMIT 1";
            $result = $this->db->pgquery($sqlSelect);
            
            if ($result && pg_num_rows($result) > 0) {
                $data = pg_fetch_assoc($result);
                
                // 2. Insertar en la tabla principal (incluyendo el serial_pos y id_status_payment)
                $sqlInsert = "INSERT INTO exoneraciones (nro_ticket, serial_pos, tipo_exoneracion, porcentaje, nro_exoneracion, id_user, id_status_payment) VALUES ("
                    . pg_escape_literal($db_conn, $nro_ticket) . ", "
                    . pg_escape_literal($db_conn, $data['serial_pos']) . ", "
                    . pg_escape_literal($db_conn, $data['tipo_exoneracion']) . ", "
                    . (int)$data['porcentaje'] . ", "
                    . pg_escape_literal($db_conn, $data['nro_exoneracion']) . ", "
                    . (int)$data['id_user'] . ", "
                    . (int)$data['id_status_payment'] . ")";
                
                if ($this->db->pgquery($sqlInsert)) {
                    // 3. Limpiar la temporal
                    $this->db->pgquery("DELETE FROM temp_exoneracion_uploads WHERE serial_pos = " . pg_escape_literal($db_conn, $serial_pos));
                    return true;
                }
            }
            return false;
        } catch (Exception $e) {
            error_log("Error en TransferExoneracionFromTempToMain: " . $e->getMessage());
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

    /**
     * Get a payment record by its ID.
     * @param int $id_payment
     */
    public function GetPaymentById($id_payment) {
        try {
            if (!$this->db) {
                return false;
            }

            $conn = $this->db->getConnection();
            $escaped_id = pg_escape_literal($conn, $id_payment);
            
            $sql = "SELECT * FROM payment_records WHERE id_payment_record = " . $escaped_id;
            
            $result = Model::getResult($sql, $this->db);
            
            if ($result && isset($result['row']) && $result['row'] !== false) {
                return $result['row'];
            }
            
            return false;

        } catch (Throwable $e) {
            error_log("Error en GetPaymentById: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get a payment record by its record number (Nro Registro).
     * @param string $record_number e.g. Pago1234_5678
     */
    public function GetPaymentByRecordNumber(string $record_number) {
        try {
            if (!$this->db) {
                return false;
            }

            $conn = $this->db->getConnection();
            $escaped_rec = pg_escape_literal($conn, $record_number);
            
            $sql = "SELECT * FROM payment_records WHERE record_number = " . $escaped_rec;
            
            $result = Model::getResult($sql, $this->db);
            
            if ($result && isset($result['row']) && $result['row'] !== false) {
                return $result['row'];
            }
            
            return false;

        } catch (Throwable $e) {
            error_log("Error en GetPaymentByRecordNumber: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update a payment record.
     * @param int $id_payment
     * @param array $data Associative array of fields to update
     */
    public function UpdatePayment($id_payment, $data) {
        try {
            if (!$this->db) {
                return false;
            }

            $conn = $this->db->getConnection();
            $escaped_id = pg_escape_literal($conn, $id_payment);
            
            // 1. Get current record_number to check if it changes
            $sqlOld = "SELECT record_number FROM payment_records WHERE id_payment_record = $escaped_id";
            $resOld = pg_query($conn, $sqlOld);
            $oldRecordNumber = null;
            if ($resOld && pg_num_rows($resOld) > 0) {
                $rowOld = pg_fetch_assoc($resOld);
                $oldRecordNumber = $rowOld['record_number'];
            }

            // 2. Build SET clause
            $sets = [];
            $newRecordNumber = null;
            
            // Fields allowed to be updated
            $allowedFields = [
                'amount_bs', 
                'reference_amount', 
                'payment_method', 
                'currency', 
                'payment_reference', 
                'depositor', 
                'origen_bank', 
                'destination_bank',
                'origen_rif_numero',
                'origen_telefono',
                'record_number',
                'updated_by',
                'payment_status'
            ];

            foreach ($data as $key => $value) {
                if (in_array($key, $allowedFields)) {
                    if ($key === 'record_number') {
                        $newRecordNumber = $value;
                    }
                    $escaped_val = pg_escape_literal($conn, $value);
                    $sets[] = "$key = $escaped_val";
                }
            }

            if (empty($sets)) {
                return false; // No valid fields to update
            }

            $setClause = implode(", ", $sets);

            // 3. Update payment_records
            $sql = "UPDATE payment_records 
                    SET $setClause, updated_at = NOW() 
                    WHERE id_payment_record = $escaped_id 
                    AND (confirmation_number IS NULL OR confirmation_number = 'false' OR confirmation_number = 'f')";
            
            $result = pg_query($conn, $sql);
            
            if ($result) {
                $affected = pg_affected_rows($result);
                
                // 4. If record_number changed, sync with archivos_adjuntos
                if ($affected > 0 && $newRecordNumber !== null && $oldRecordNumber !== null && $newRecordNumber !== $oldRecordNumber) {
                    $escaped_new = pg_escape_literal($conn, $newRecordNumber);
                    $escaped_old = pg_escape_literal($conn, $oldRecordNumber);
                    
                    $sqlSync = "UPDATE archivos_adjuntos 
                                SET record_number = $escaped_new 
                                WHERE record_number = $escaped_old";
                    pg_query($conn, $sqlSync);
                }
                
                return $affected > 0;
            }
            
            return false;

        } catch (Throwable $e) {
            error_log("Error en UpdatePayment: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get payment attachment by record number
     * Retrieves the file info for a payment receipt from archivos_adjuntos
     * 
     * @param string $record_number Payment record number
     * @return array|null Attachment info or null if not found
     */
    public function GetPaymentAttachmentByRecordNumber($record_number, $nro_ticket = null, $document_type = null) {
        try {
            $conn = $this->db->getConnection();
            $escaped_record_number = pg_escape_literal($conn, $record_number);
            
            // Search directly by record_number in archivos_adjuntos
            $sql = "SELECT id, nro_ticket, original_filename, stored_filename, 
                           file_path, mime_type, file_size_bytes, uploaded_at, 
                           uploaded_by_user_id, document_type, record_number
                    FROM archivos_adjuntos
                    WHERE record_number = $escaped_record_number
                    ORDER BY uploaded_at DESC
                    LIMIT 1";
            
            $result = pg_query($conn, $sql);
            
            if ($result && pg_num_rows($result) > 0) {
                return pg_fetch_assoc($result);
            }

            // Fallback #0 (generic): if caller provides nro_ticket, try locate by nro_ticket + document_type.
            // This helps legacy Exo formats where record_number stored differs from UI code.
            if ($nro_ticket !== null && $nro_ticket !== '') {
                $escaped_nro_ticket = pg_escape_literal($conn, $nro_ticket);
                $docFilter = "";
                if ($document_type !== null && $document_type !== '') {
                    $escaped_doc = pg_escape_literal($conn, $document_type);
                    $docFilter = " AND document_type = $escaped_doc";
                } else {
                    // Default to common document types used for these lookups
                    $docFilter = " AND (document_type = 'Exoneracion' OR document_type = 'Anticipo' OR document_type ILIKE 'Pago%')";
                }

                $sql_by_ticket = "SELECT id, nro_ticket, original_filename, stored_filename,
                                         file_path, mime_type, file_size_bytes, uploaded_at,
                                         uploaded_by_user_id, document_type, record_number
                                  FROM archivos_adjuntos
                                  WHERE nro_ticket = $escaped_nro_ticket
                                  $docFilter
                                  ORDER BY uploaded_at DESC
                                  LIMIT 1";

                $res_ticket = pg_query($conn, $sql_by_ticket);
                if ($res_ticket && pg_num_rows($res_ticket) > 0) {
                    return pg_fetch_assoc($res_ticket);
                }
            }
            
            // Fallback: If no record_number match, try old proximity logic
            $sql_payment = "SELECT nro_ticket, payment_date 
                           FROM payment_records 
                           WHERE record_number = $escaped_record_number";
            
            $result_payment = pg_query($conn, $sql_payment);
            
            if ($result_payment && pg_num_rows($result_payment) > 0) {
                $payment = pg_fetch_assoc($result_payment);
                $escaped_nro_ticket = pg_escape_literal($conn, $payment['nro_ticket']);
                $payment_date = $payment['payment_date'];
                
                $sql_fallback = "SELECT * FROM archivos_adjuntos
                        WHERE nro_ticket = $escaped_nro_ticket
                        AND (document_type = 'Anticipo' OR document_type = 'Pago' OR document_type = 'comprobante_pago')
                        ORDER BY ABS(EXTRACT(EPOCH FROM (uploaded_at - '$payment_date'::timestamp)))
                        LIMIT 1";
                
                $result_fb = pg_query($conn, $sql_fallback);
                if ($result_fb && pg_num_rows($result_fb) > 0) {
                    return pg_fetch_assoc($result_fb);
                }
            }
            
            return null;
            
        } catch (Throwable $e) {
            error_log("Error en GetPaymentAttachmentByRecordNumber: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get payment attachment strictly by record number (No Fallbacks)
     * Retrieves the file info for a payment receipt from archivos_adjuntos
     * This is separated from the main function so modifying one doesn't affect the other.
     * 
     * @param string $record_number Payment record number
     * @return array|null Attachment info or null if not found
     */
    public function GetPaymentAttachmentStrictByRecordNumber($record_number) {
        try {
            $conn = $this->db->getConnection();
            $escaped_record_number = pg_escape_literal($conn, $record_number);
            
            // Search directly by record_number in archivos_adjuntos
            $sql = "SELECT id, nro_ticket, original_filename, stored_filename, 
                           file_path, mime_type, file_size_bytes, uploaded_at, 
                           uploaded_by_user_id, document_type, record_number
                    FROM archivos_adjuntos
                    WHERE record_number = $escaped_record_number
                    ORDER BY uploaded_at DESC
                    LIMIT 1";
            
            $result = pg_query($conn, $sql);
            
            if ($result && pg_num_rows($result) > 0) {
                return pg_fetch_assoc($result);
            }

            // Fallback: If no record_number match, try old proximity logic ONLY
            $sql_payment = "SELECT nro_ticket, payment_date 
                           FROM payment_records 
                           WHERE record_number = $escaped_record_number";
            
            $result_payment = pg_query($conn, $sql_payment);
            
            if ($result_payment && pg_num_rows($result_payment) > 0) {
                $payment = pg_fetch_assoc($result_payment);
                $escaped_nro_ticket = pg_escape_literal($conn, $payment['nro_ticket']);
                $payment_date = $payment['payment_date'];
                
                $sql_fallback = "SELECT * FROM archivos_adjuntos
                        WHERE nro_ticket = $escaped_nro_ticket
                        AND (document_type = 'Anticipo' OR document_type = 'Pago' OR document_type = 'comprobante_pago')
                        ORDER BY ABS(EXTRACT(EPOCH FROM (uploaded_at - '$payment_date'::timestamp)))
                        LIMIT 1";
                
                $result_fb = pg_query($conn, $sql_fallback);
                if ($result_fb && pg_num_rows($result_fb) > 0) {
                    return pg_fetch_assoc($result_fb);
                }
            }
            
            return null;
            
        } catch (Throwable $e) {
            error_log("Error en GetPaymentAttachmentStrictByRecordNumber: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Creates a new payment record to substitute a rejected one
     * Marks the old record as substituted and returns the new ID
     */
    public function CreatePaymentSubstitution($id_payment_old, $data) {
        try {
            $db_conn = $this->db->getConnection();
            $id_payment_old = (int)$id_payment_old;

            // 1. Fetch old record to clone common fields
            $sqlOld = "SELECT * FROM payment_records WHERE id_payment_record = $id_payment_old";
            $resOld = pg_query($db_conn, $sqlOld);
            if (!$resOld || pg_num_rows($resOld) === 0) {
                error_log("SubstitutePayment: Old record $id_payment_old not found");
                return false;
            }
            $oldData = pg_fetch_assoc($resOld);

            // 2. Prepare NEW data by merging old base with new corrections
            $mergedData = $oldData;
            foreach ($data as $key => $value) {
                if (isset($data[$key]) && $data[$key] !== null) {
                    $mergedData[$key] = $value;
                }
            }
            
            // Remove ID from merged data to ensure new insertion
            unset($mergedData['id_payment_record']);
            unset($mergedData['is_substituted']); // Ensure new record is NOT marked as substituted

            // 3. Insert NEW record using existing InsertPaymentRecord logic
            $new_id = $this->InsertPaymentRecord($mergedData);
            
            if ($new_id) {
                error_log("SubstitutePayment: New ID created: $new_id to substitute Old ID: $id_payment_old");

                // 4. Mark the OLD record as substituted and link to the NEW record
                $sqlUpdate = "UPDATE payment_records 
                             SET is_substituted = TRUE, 
                                 substituted_by_id_payment_record = $new_id 
                             WHERE id_payment_record = $id_payment_old";
                $resUpdate = pg_query($db_conn, $sqlUpdate);
                
                if (!$resUpdate) {
                    error_log("SubstitutePayment: Failed SQL Update: " . pg_last_error($db_conn));
  
                } else {
                    error_log("SubstitutePayment: payment_records updated. Affected: " . pg_affected_rows($resUpdate));
                }
                
                return $new_id;
            }
            
            return false;

        } catch (Throwable $e) {
            error_log("Error en CreatePaymentSubstitution: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtiene los datos de todas las exoneraciones de un ticket para su visualización.
     */
    public function GetExonerationDataByTicket($nro_ticket) {
        try {
            $db_conn = $this->db->getConnection();
            $sql = "SELECT e.*, 
                           u.name as name_user, u.surname as surname_user,
                           TO_CHAR(e.fecha_creacion, 'DD-MM-YYYY HH12:MI AM') as fecha_registro,
                           adj.file_path, adj.mime_type, adj.original_filename
                    FROM exoneraciones e
                    LEFT JOIN users u ON e.id_user = u.id_user
                    LEFT JOIN LATERAL (
                        SELECT a.file_path, a.mime_type, a.original_filename
                        FROM archivos_adjuntos a
                        WHERE a.record_number = e.nro_exoneracion
                        AND (a.is_substituted IS NULL OR a.is_substituted = FALSE)
                        ORDER BY a.uploaded_at DESC
                        LIMIT 1
                    ) as adj ON TRUE
                    WHERE e.nro_ticket = " . pg_escape_literal($db_conn, $nro_ticket) . "
                    AND (e.is_substituted IS NULL OR e.is_substituted = FALSE)
                    ORDER BY e.fecha_creacion DESC;";
            
            $result = $this->db->pgquery($sql);
            $data = [];
            if ($result && pg_num_rows($result) > 0) {
                while ($row = pg_fetch_assoc($result)) {
                    $data[] = $row;
                }
            }
            return $data;
        } catch (Exception $e) {
            error_log("Error en GetExonerationDataByTicket: " . $e->getMessage());
            return false;
        }
    }
    /**
     * Obtiene datos básicos de un ticket por su ID.
     */
    public function GetTicketDataById($id_ticket) {
        try {
            $db_conn = $this->db->getConnection();
            $sql = "SELECT id_ticket, nro_ticket, rif, razonsocial, serial_pos, id_status_payment 
                    FROM public.v_getdataticketbyid 
                    WHERE id_ticket = " . (int)$id_ticket;
            
            $result = $this->db->pgquery($sql);
            if ($result && pg_num_rows($result) > 0) {
                return pg_fetch_assoc($result); // Retorna una sola fila como array asociativo
            }
            return null;
        } catch (Exception $e) {
            error_log("Error en GetTicketDataById: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Verifica si existe una aprobación manual (exoneración o pago) para un ticket.
     * BLOQUEA si detecta cualquier registro pendiente (estatus 5, 7 o 17).
     * PERMITE si existe al menos una aprobación (estatus 4 o 6) y no hay pendientes.
     */
    public function CheckManualApprovalStatus($id_ticket, $id_status_payment) {
        try {
            $db_conn = $this->db->getConnection();

            // 1. Obtener el número de ticket
            $sqlTicket = "SELECT nro_ticket FROM public.tickets WHERE id_ticket = " . (int)$id_ticket;
            $resTicket = $this->db->pgquery($sqlTicket);
            if (!$resTicket || pg_num_rows($resTicket) == 0) return false;
            
            $rowTicket = pg_fetch_assoc($resTicket);
            $nro_ticket = trim($rowTicket['nro_ticket']); 
            $escaped_nro = pg_escape_literal($db_conn, $nro_ticket);

            // 2. VERIFICAR APROBACIONES (HABILITANTES - PRIORIDAD)
            
            // ¿Hay al menos una exoneración aprobada (4)?
            // Usamos ILIKE y TRIM para mayor robustez en la comparación del número de ticket
            $sqlExo = "SELECT COUNT(*) as total FROM public.exoneraciones 
                       WHERE (TRIM(nro_ticket) ILIKE TRIM(" . $escaped_nro . ") OR nro_ticket = " . (int)$id_ticket . "::text)
                       AND id_status_payment = 4 
                       AND (is_substituted IS NULL OR is_substituted = FALSE)";
            $resExo = $this->db->pgquery($sqlExo);
            if ($resExo && pg_num_rows($resExo) > 0) {
                $row = pg_fetch_assoc($resExo);
                if ((int)$row['total'] > 0) return true; // Si hay una aprobada, permitimos el flujo
            }

            // ¿Hay al menos un pago aprobado (6)?
            $sqlPago = "SELECT COUNT(*) as total FROM public.payment_records 
                         WHERE (TRIM(nro_ticket) ILIKE TRIM(" . $escaped_nro . ") OR nro_ticket = " . (int)$id_ticket . "::text)
                         AND payment_status = 6";
            $resPago = $this->db->pgquery($sqlPago);
            if ($resPago && pg_num_rows($resPago) > 0) {
                $row = pg_fetch_assoc($resPago);
                if ((int)$row['total'] > 0) return true; // Si hay un pago aprobado, permitimos
            }

            // 3. VERIFICAR PENDIENTES (SOLO SI NO HAY APROBACIONES)
            
            // ¿Hay exoneraciones de ANTICIPO pendientes? (status 5)
            $sqlPendingExo = "SELECT COUNT(*) as pending FROM public.exoneraciones 
                             WHERE TRIM(nro_ticket) ILIKE TRIM(" . $escaped_nro . ") AND id_status_payment = 5 
                             AND LOWER(tipo_exoneracion) LIKE '%anticipo%'
                             AND (is_substituted IS NULL OR is_substituted = FALSE)";
            $resPendingExo = $this->db->pgquery($sqlPendingExo);
            if ($resPendingExo) {
                $row = pg_fetch_assoc($resPendingExo);
                if ((int)$row['pending'] > 0) return false;
            }

            // ¿Hay pagos de ANTICIPO pendientes? (status 7)
            $sqlPendingPago = "SELECT COUNT(*) as pending FROM public.payment_records 
                              WHERE TRIM(nro_ticket) ILIKE TRIM(" . $escaped_nro . ") AND payment_status = 7
                              AND (is_substituted IS NULL OR is_substituted = FALSE)";
            $resPendingPago = $this->db->pgquery($sqlPendingPago);
            if ($resPendingPago) {
                $row = pg_fetch_assoc($resPendingPago);
                if ((int)$row['pending'] > 0) return false;
            }

            return false; // Si no hay aprobaciones y no se detectaron bloqueos específicos, por defecto no permitimos si el estatus global no es válido.

        } catch (Exception $e) {
            error_log("Error en CheckManualApprovalStatus: " . $e->getMessage());
            return false;
        }
    }

    function GetDataTicketSolicitud(){
        	try {
                $db_conn = $this->db->getConnection();
                $sql = "SELECT * FROM get_administrative_requests_full_list();";
                
                $result = $this->db->pgquery($sql);
                $data = [];
                if ($result && pg_num_rows($result) > 0) {
                    while ($row = pg_fetch_assoc($result)) {
                        $data[] = $row;
                    }
                }
                return $data;
            } catch (Exception $e) {
                error_log("Error en GetDataTicketSolicitud: " . $e->getMessage());
                return false;
            }
    }

    /**
     * Actualiza la observación de una solicitud administrativa.
     */
    public function UpdateAdministrativeRequestObservacion($nro_solicitud, $observacion, $id_user) {
        try {
            $db_conn = $this->db->getConnection();
            $escaped_nro = pg_escape_literal($db_conn, $nro_solicitud);
            $escaped_obs = pg_escape_literal($db_conn, $observacion);

            $sql = "UPDATE administrative_requests
                    SET observacion = $escaped_obs,
                        updated_at  = NOW(),
                        updated_by  = " . (int)$id_user . "
                    WHERE nro_solicitud = $escaped_nro
                    AND (is_substituted = FALSE OR is_substituted IS NULL)
                    RETURNING id";

            $result = pg_query($db_conn, $sql);
            if ($result && pg_num_rows($result) > 0) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            error_log("Error en UpdateAdministrativeRequestObservacion: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Crea una nueva solicitud administrativa sustituyendo a la anterior.
     * Marca la anterior como sustituida. (Patrón similar a pagos)
     */
    public function SubstituteAdministrativeRequest($id_old, $new_observation, $id_user) {
        try {
            $db_conn = $this->db->getConnection();
            $id_old = (int)$id_old;

            // 1. Obtener la solicitud vieja para clonar datos
            $sqlOld = "SELECT * FROM administrative_requests WHERE id = $id_old";
            $resOld = pg_query($db_conn, $sqlOld);
            if (!$resOld || pg_num_rows($resOld) === 0) return false;
            $oldData = pg_fetch_assoc($resOld);

            // 2. Preparar nueva data
            $id_cliente = (int)$oldData['id_cliente'];
            $id_type = (int)$oldData['id_tipo_solicitud'];
            $nro_solicitud = $oldData['nro_solicitud'];
            $escaped_obs = pg_escape_literal($db_conn, $new_observation);

            // 3. Insertar la NUEVA solicitud
            $sqlInsert = "INSERT INTO administrative_requests (id_cliente, nro_solicitud, id_tipo_solicitud, observacion, id_status_administrativo, id_user_creation) 
                          VALUES ($id_cliente, ".pg_escape_literal($db_conn, $nro_solicitud).", $id_type, $escaped_obs, 1, ".(int)$id_user.") 
                          RETURNING id";
            $resInsert = pg_query($db_conn, $sqlInsert);
            if (!$resInsert) return false;
            $newId = (int)pg_fetch_result($resInsert, 0, 0);

            // 4. Marcar la VIEJA como sustituida y vincularla a la nueva
            $sqlUpdate = "UPDATE administrative_requests 
                          SET is_substituted = TRUE, 
                              substituted_by_id_solicitud = $newId,
                              updated_at = NOW(),
                              updated_by = ".(int)$id_user."
                          WHERE id = $id_old";
            pg_query($db_conn, $sqlUpdate);

            return $newId;
        } catch (Exception $e) {
            error_log("Error en SubstituteAdministrativeRequest: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtiene datos básicos de una solicitud administrativa por su nro_solicitud.
     */
    public function GetAdministrativeRequestByNro($nro_solicitud) {
        try {
            $db_conn = $this->db->getConnection();
            $escaped = pg_escape_literal($db_conn, trim($nro_solicitud));
            $sql = "SELECT ar.*, ts.name as tipo_nombre
                    FROM administrative_requests ar
                    LEFT JOIN administrative_request_types ts ON ar.id = ts.id
                    WHERE TRIM(ar.nro_solicitud) = $escaped
                    AND (ar.is_substituted = FALSE OR ar.is_substituted IS NULL)
                    ORDER BY ar.id DESC
                    LIMIT 1";
            $result = pg_query($db_conn, $sql);
            if ($result && pg_num_rows($result) > 0) {
                return pg_fetch_assoc($result);
            }
            return null;
        } catch (Exception $e) {
            error_log("Error en GetAdministrativeRequestByNro: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Marca los adjuntos anteriores de una solicitud como sustituidos.
     */
    public function MarkPreviousAttachmentSubstituted($nro_solicitud) {
        try {
            $db_conn = $this->db->getConnection();
            $escaped = pg_escape_literal($db_conn, $nro_solicitud);
            $sql = "UPDATE archivos_adjuntos
                    SET is_substituted = TRUE
                    WHERE record_number = $escaped
                    AND (is_substituted IS NULL OR is_substituted = FALSE)";
            pg_query($db_conn, $sql);
        } catch (Exception $e) {
            error_log("Error en MarkPreviousAttachmentSubstituted: " . $e->getMessage());
        }
    }
}

?>
