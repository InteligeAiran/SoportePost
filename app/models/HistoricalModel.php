<?php
require_once __DIR__ . "/../../libs/Model.php";
require_once __DIR__ . "/../../libs/session.php";

class HistoricalModel extends Model
{

    public $db;
    

    public function __construct()
    {
        parent::__construct();
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database); // Ensure getInstance() returns a PgSql\Connection
    }

    public function GetTicketHistory($id_ticket)
    {
        try {
            $sql = "SELECT * FROM public.get_ticket_history_details(".$id_ticket.");";
            $result = $this->getResult($sql, $this->db);
            $this->db->closeConnection(); // Close the connection if needed
            return $result;
        } catch (Throwable $e) {
            // Handle exception
        }
    }

    public function MarkTicketReceived($id_ticket, $id_user) // id_user es el ID del coordinador que realiza la acción
        {
        try {
            $id_ticket = (int) $id_ticket;
            $id_user = (int) $id_user; // ID del usuario/coordinador que marca como recibido

            $db = $this->db->getConnection(); // Obtener la conexión a la base de datos

            // --- 1. Obtener los últimos datos del historial del ticket ---
            // Buscamos el registro más reciente para este id_ticket en ticket_status_history
            $sql_get_last_history = "SELECT
                tsh.new_status_lab,
                tsh.new_status_payment,
                tsh.new_status_domiciliacion,
				tsh.new_status
            FROM
                tickets_status_history tsh
            WHERE
                tsh.id_ticket = {$id_ticket} -- Filtrar por el ID del ticket
            ORDER BY
                tsh.changedstatus_at DESC, tsh.id_history DESC -- Ordenar por fecha y luego por ID para el último registro
            LIMIT 1;
            ";

            $result_last_history = pg_query($db, $sql_get_last_history);

            if ($result_last_history && pg_num_rows($result_last_history) > 0) {
                $row_last_history = pg_fetch_assoc($result_last_history);
                // Si el valor es NULL en la DB, lo mantendrá como NULL, así que casteamos a int para asegurar un número
                $last_status_lab = (int) ($row_last_history['new_status_lab'] ?? NULL);
                $last_status_payment = (int) ($row_last_history['new_status_payment'] ?? NULL);
                $last_status_domiciliacion = (int) ($row_last_history['new_status_domiciliacion'] ?? NULL);
                $last_status_ticket = (int) ($row_last_history['new_status']?? NULL); // El último estado principal
                pg_free_result($result_last_history);
            } else {
                error_log("No se encontró historial previo para el ticket ID: {$id_ticket}. Usando valores por defecto.");
            }

            // --- 2. Llamar a la función SQL para actualizar el estado principal del ticket ---
            // Esta función `update_ticket_to_received` debería encargarse de actualizar
            // `id_status_ticket` y `date_received_coordinator` en la tabla `tickets`.
            $sqlCallFunction = "SELECT public.update_ticket_to_received({$id_ticket});";
            $resultUpdate = $this->db->pgquery($sqlCallFunction);

            if ($resultUpdate === false) {
                error_log("Error al llamar a update_ticket_to_received para ticket ID: {$id_ticket}. PG Error: " . pg_last_error($db) . " Query: " . $sqlCallFunction);
                return ['success' => false, 'message' => 'Error al actualizar el estado principal del ticket.'];
            }
            pg_free_result($resultUpdate);

            // --- 3. Insertar en ticket_status_history ---
            $id_accion_ticket_history = 3; // ID de acción para "Recibido por Coordinador"

            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                (int) $id_ticket,
                (int) $id_user, // changedstatus_by
                (int) $last_status_ticket, // new_status (del ticket principal, 'En Proceso')
                (int) $id_accion_ticket_history, // new_action
                (int) $last_status_lab, // new_status_lab (del historial anterior)
                (int) $last_status_payment, // new_status_payment (del historial anterior)
                (int) $last_status_domiciliacion, // new_status_domiciliacion (del historial anterior)
            );

            $resultHistory = $this->db->pgquery($sqlInsertHistory);

            if ($resultHistory === false) {
                error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: " . pg_last_error($db) . " Query: " . $sqlInsertHistory);
                return ['success' => false, 'message' => 'Error al registrar el historial del ticket.'];
            }
            pg_free_result($resultHistory);

            // Si todo fue exitoso
            return ['success' => true, 'message' => 'Ticket marcado como recibido y historial registrado.'];

        } catch (Throwable $e) {
            error_log("Excepción en TicketModel::MarkTicketReceived: " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
            return ['success' => false, 'message' => 'Error interno del servidor.'];
        } finally {
            // ... (Tu lógica para cerrar la conexión si aplica) ...
        }
    }

    public function MarkTicketReceivedTechnical($id_ticket, $id_user) // id_user es el ID del técnico que realiza la acción
     {
        try {
            $id_ticket = (int) $id_ticket;
            $id_user = (int) $id_user; // ID del usuario/coordinador que marca como recibido

            $db = $this->db->getConnection(); // Obtener la conexión a la base de datos

            // --- 1. Obtener los últimos datos del historial del ticket ---
            // Buscamos el registro más reciente para este id_ticket en ticket_status_history
            $sql_get_last_history = "SELECT
                tsh.new_status_lab,
                tsh.new_status_payment,
                tsh.new_status_domiciliacion,
				tsh.new_status
            FROM
                tickets_status_history tsh
            WHERE
                tsh.id_ticket = {$id_ticket} -- Filtrar por el ID del ticket
            ORDER BY
                tsh.changedstatus_at DESC, tsh.id_history DESC -- Ordenar por fecha y luego por ID para el último registro
            LIMIT 1;
            ";
            $result_last_history = pg_query($db, $sql_get_last_history);

            if ($result_last_history && pg_num_rows($result_last_history) > 0) {
                $row_last_history = pg_fetch_assoc($result_last_history);
                // Si el valor es NULL en la DB, lo mantendrá como NULL, así que casteamos a int para asegurar un número
                $last_status_lab = (int) ($row_last_history['new_status_lab'] ?? NULL);
                $last_status_payment = (int) ($row_last_history['new_status_payment'] ?? NULL);
                $last_status_domiciliacion = (int) ($row_last_history['new_status_domiciliacion'] ?? NULL);
                $last_status_ticket = (int) ($row_last_history['new_status']?? NULL); // El último estado principal
                pg_free_result($result_last_history);
            } else {
                error_log("No se encontró historial previo para el ticket ID: {$id_ticket}. Usando valores por defecto.");
            }

            // --- 2. Llamar a la función SQL para actualizar el estado principal del ticket ---
            // Esta función `update_ticket_to_received` debería encargarse de actualizar
            // `id_status_ticket` y `date_received_coordinator` en la tabla `tickets`.
            $sqlCallFunction = "SELECT public.update_ticket_to_received_tecnico({$id_ticket});";
            $resultUpdate = $this->db->pgquery($sqlCallFunction);

            if ($resultUpdate === false) {
                error_log("Error al llamar a update_ticket_to_received_tecnico para ticket ID: {$id_ticket}. PG Error: " . pg_last_error($db) . " Query: " . $sqlCallFunction);
                return ['success' => false, 'message' => 'Error al actualizar el estado principal del ticket.'];
            }
            pg_free_result($resultUpdate);

            // --- 3. Insertar en ticket_status_history ---
            $id_accion_ticket_history = 10; // ID de acción para "Recibido por Técnico"

            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %d::integer);",
                (int) $id_ticket,
                (int) $id_user, // changedstatus_by
                (int) $last_status_ticket, // new_status (del ticket principal, 'En Proceso')
                (int) $id_accion_ticket_history, // new_action
                (int) $last_status_lab, // new_status_lab (del historial anterior)
                (int) $last_status_payment, // new_status_payment (del historial anterior)
                (int) $last_status_domiciliacion, // new_status_domiciliacion (del historial anterior)
            );

            $resultHistory = $this->db->pgquery($sqlInsertHistory);

            if ($resultHistory === false) {
                error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: " . pg_last_error($db) . " Query: " . $sqlInsertHistory);
                return ['success' => false, 'message' => 'Error al registrar el historial del ticket.'];
            }
            pg_free_result($resultHistory);

            // Si todo fue exitoso
            return ['success' => true, 'message' => 'Ticket marcado como recibido y historial registrado.'];

        } catch (Throwable $e) {
            error_log("Excepción en TicketModel::MarkTicketReceived: " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
            return ['success' => false, 'message' => 'Error interno del servidor.'];
        } finally {
            // ... (Tu lógica para cerrar la conexión si aplica) ...
        }
    }
           
}
?>

