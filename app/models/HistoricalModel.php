<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
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

    public function GetTicketHistory($id_ticket, $id_cliente = null, $search_by_client = false)
    {
        try {
            $db = $this->db->getConnection();
            
            // 1. Resolver id_cliente si no se proporciona (lo necesitamos para las solicitudes administrativas)
            if (empty($id_cliente) && !empty($id_ticket)) {
                $sql_client = "SELECT id_cliente FROM public.tickets WHERE id_ticket = " . (int)$id_ticket;
                $res_client = pg_query($db, $sql_client);
                if ($res_client && pg_num_rows($res_client) > 0) {
                    $row_client = pg_fetch_assoc($res_client);
                    $id_cliente = $row_client['id_cliente'];
                }
            }

            if ($search_by_client && !empty($id_cliente)) {
                // Buscamos si el cliente tiene un ticket activo ("abierto" o "en proceso" que típicamente son 1 y 2)
                $sql_find_ticket = "SELECT id_ticket FROM public.tickets WHERE id_cliente = " . (int)$id_cliente . " AND id_status_ticket IN (1, 2) ORDER BY id_ticket DESC LIMIT 1;";
                $ticketResult = pg_query($db, $sql_find_ticket);
                
                if ($ticketResult && pg_num_rows($ticketResult) > 0) {
                    $row = pg_fetch_assoc($ticketResult);
                    $id_ticket = $row['id_ticket'];
                    pg_free_result($ticketResult);
                } else {
                    // Si no hay ticket activo, igual queremos mostrar las solicitudes si existen
                    $id_ticket = null;
                }
            }

            $history = [];

            // 2. Obtener historial técnico del ticket (si existe)
            if (!empty($id_ticket)) {
                $sql = "SELECT *, FALSE as is_admin_request FROM public.get_ticket_history_details(" . (int)$id_ticket . ");";
                $res = pg_query($db, $sql);
                if ($res) {
                    while ($row = pg_fetch_assoc($res)) {
                        $history[] = $row;
                    }
                }
            }

            // 3. Obtener solicitudes administrativas del cliente mediante la función oficial
            if (!empty($id_cliente)) {
                $sql_admin = "SELECT 
                        nro_solicitud,
                        created_at,
                        TO_CHAR(created_at, 'DD-MM-YYYY HH24:MI') as fecha_de_cambio,
                        tipo_nombre as name_accion_ticket,
                        user_creation as usuario_gestion,
                        status_name as name_status_ticket,
                        observacion,
                        id_status_administrativo,
                        TRUE as is_admin_request
                    FROM public.get_administrative_requests_full_list()
                    WHERE id_cliente = " . (int)$id_cliente . "
                    ORDER BY created_at DESC";
                
                $res_admin = pg_query($db, $sql_admin);
                if ($res_admin) {
                    while ($row = pg_fetch_assoc($res_admin)) {
                        $history[] = $row;
                    }
                }
            }

            // 4. Ordenar todo por fecha DESC usando timestamps crudos para evitar errores de formato (e.g. HH12)
            usort($history, function($a, $b) {
                $timeA = isset($a['created_at']) ? strtotime($a['created_at']) : strtotime($a['changedstatus_at']);
                $timeB = isset($b['created_at']) ? strtotime($b['created_at']) : strtotime($b['changedstatus_at']);
                return $timeB - $timeA;
            });

            return $history;

        } catch (Throwable $e) {
            error_log("Error en GetTicketHistory: " . $e->getMessage());
            return false;
        }
    }

    private function parseDateToTimestamp($dateStr) {
        if (empty($dateStr) || $dateStr === 'N/A') return 0;
        $parts = explode(' ', $dateStr);
        if (count($parts) < 1) return 0;
        
        $dateParts = explode('-', $parts[0]);
        if (count($dateParts) !== 3) return 0;
        
        $formatted = "{$dateParts[2]}-{$dateParts[1]}-{$dateParts[0]}";
        if (isset($parts[1])) {
            $formatted .= " {$parts[1]}";
        }
        
        return strtotime($formatted);
    }

    public function MarkTicketReceived($id_ticket, $id_user)
    {
        try {
            $id_ticket = (int) $id_ticket;
            $id_user = (int) $id_user;

            $db = $this->db->getConnection();

            $sql_get_last_history = "SELECT
                tsh.new_status_lab,
                tsh.new_status_payment,
                tsh.new_status_domiciliacion,
                tsh.new_status
            FROM
                tickets_status_history tsh
            WHERE
                tsh.id_ticket = {$id_ticket}
            ORDER BY
                tsh.changedstatus_at DESC, tsh.id_history DESC
            LIMIT 1;";

            $result_last_history = pg_query($db, $sql_get_last_history);

            $last_status_lab = 0;
            $last_status_payment = 'NULL';
            $last_status_domiciliacion = 'NULL';
            $last_status_ticket = 1;

            if ($result_last_history && pg_num_rows($result_last_history) > 0) {
                $row_last_history = pg_fetch_assoc($result_last_history);
                $last_status_lab = (int) ($row_last_history['new_status_lab'] ?? 0);
                $last_status_payment = $row_last_history['new_status_payment'] !== null ? (int)$row_last_history['new_status_payment'] : 'NULL';
                $last_status_domiciliacion = $row_last_history['new_status_domiciliacion'] !== null ? (int)$row_last_history['new_status_domiciliacion'] : 'NULL';
                $last_status_ticket = (int) ($row_last_history['new_status'] ?? 1);
                pg_free_result($result_last_history);
            }

            $sqlCallFunction = "SELECT public.update_ticket_to_received({$id_ticket}, {$id_user});";
            $resultUpdate = $this->db->pgquery($sqlCallFunction);

            if ($resultUpdate === false) {
                error_log("Error al llamar a update_ticket_to_received para ticket ID: {$id_ticket}. PG Error: " . pg_last_error($db) . " Query: " . $sqlCallFunction);
                return ['success' => false, 'message' => 'Error al actualizar el estado principal del ticket.'];
            }
            pg_free_result($resultUpdate);

            $id_accion_ticket_history = 3; // ID de acción 3: "Recibido por la Coordinación"

            // ACCION 3: Quien lo marca como recibido en la coordinación es el Coordinador
            $updateCoordSql = "
                UPDATE users_tickets ut
                SET id_coordinador = {$id_user}
                FROM (
                    SELECT id_user_ticket
                    FROM users_tickets
                    WHERE id_ticket = {$id_ticket}
                    ORDER BY id_user_ticket DESC
                    LIMIT 1
                ) last_ut
                WHERE ut.id_user_ticket = last_ut.id_user_ticket;";
            $this->db->pgquery($updateCoordSql);
            $id_coordinador = (int) $id_user;

            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %d::integer);",
                (int) $id_ticket,
                (int) $id_user,
                (int) $last_status_ticket,
                (int) $id_accion_ticket_history,
                (int) $last_status_lab,
                $last_status_payment,
                $last_status_domiciliacion,
                (int) $id_coordinador
            );

            $resultHistory = $this->db->pgquery($sqlInsertHistory);

            if ($resultHistory === false) {
                error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: " . pg_last_error($db) . " Query: " . $sqlInsertHistory);
                return ['success' => false, 'message' => 'Error al registrar el historial del ticket.'];
            }
            pg_free_result($resultHistory);

            return ['success' => true, 'message' => 'Ticket marcado como recibido y historial registrado.'];

        } catch (Throwable $e) {
            error_log("Excepción en TicketModel::MarkTicketReceived: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error interno del servidor.'];
        }
    }

    public function MarkTicketReceivedTechnical($id_ticket, $id_user)
    {
        try {
            $id_ticket = (int) $id_ticket;
            $id_user = (int) $id_user;

            $db = $this->db->getConnection();

            $sql_get_last_history = "SELECT
                tsh.new_status_lab,
                tsh.new_status_payment,
                tsh.new_status_domiciliacion,
                tsh.new_status
            FROM
                tickets_status_history tsh
            WHERE
                tsh.id_ticket = {$id_ticket}
            ORDER BY
                tsh.changedstatus_at DESC, tsh.id_history DESC
            LIMIT 1;";
            $result_last_history = pg_query($db, $sql_get_last_history);

            $last_status_lab = 0;
            $last_status_payment = 'NULL';
            $last_status_domiciliacion = 'NULL';
            $last_status_ticket = 1;

            if ($result_last_history && pg_num_rows($result_last_history) > 0) {
                $row_last_history = pg_fetch_assoc($result_last_history);
                $last_status_lab = (int) ($row_last_history['new_status_lab'] ?? 0);
                $last_status_payment = $row_last_history['new_status_payment'] !== null ? (int)$row_last_history['new_status_payment'] : 'NULL';
                $last_status_domiciliacion = $row_last_history['new_status_domiciliacion'] !== null ? (int)$row_last_history['new_status_domiciliacion'] : 'NULL';
                $last_status_ticket = (int) ($row_last_history['new_status'] ?? 1);
                pg_free_result($result_last_history);
            }

            $sqlCallFunction = "SELECT public.update_ticket_to_received_tecnico({$id_ticket});";
            $resultUpdate = $this->db->pgquery($sqlCallFunction);

            if ($resultUpdate === false) {
                error_log("Error al llamar a update_ticket_to_received_tecnico para ticket ID: {$id_ticket}. PG Error: " . pg_last_error($db) . " Query: " . $sqlCallFunction);
                return ['success' => false, 'message' => 'Error al actualizar el estado principal del ticket.'];
            }
            pg_free_result($resultUpdate);

            $id_accion_ticket_history = 10; // ID de acción para "Recibido por Técnico"

            $sqlgetcoordinador = "SELECT t.id_coordinador FROM users_tickets t WHERE t.id_ticket = {$id_ticket};";
            $resultcoordinador = $this->db->pgquery($sqlgetcoordinador);
            if ($resultcoordinador && pg_num_rows($resultcoordinador) > 0) {
                $row_coordinador = pg_fetch_assoc($resultcoordinador);
                $id_coordinador = (int) $row_coordinador['id_coordinador'];
                pg_free_result($resultcoordinador);
            } else { 
                $id_coordinador = null;
            }

            $sqlInsertHistory = sprintf(
                "SELECT public.insert_ticket_status_history(%d::integer, %d::integer, %d::integer, %d::integer, %d::integer, %s::integer, %s::integer, %d::integer);",
                (int) $id_ticket,
                (int) $id_user,
                (int) $last_status_ticket,
                (int) $id_accion_ticket_history,
                (int) $last_status_lab,
                $last_status_payment,
                $last_status_domiciliacion,
                (int) $id_coordinador
            );

            $resultHistory = $this->db->pgquery($sqlInsertHistory);

            if ($resultHistory === false) {
                error_log("Error al insertar en ticket_status_history para ticket ID: {$id_ticket}. PG Error: " . pg_last_error($db) . " Query: " . $sqlInsertHistory);
                return ['success' => false, 'message' => 'Error al registrar el historial del ticket.'];
            }
            pg_free_result($resultHistory);

            return ['success' => true, 'message' => 'Ticket marcado como recibido y historial registrado.'];

        } catch (Throwable $e) {
            error_log("Excepción en TicketModel::MarkTicketReceivedTechnical: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error interno del servidor.'];
        }
    }
}
?>
