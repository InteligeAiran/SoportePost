<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */

require_once __DIR__ . "/../../libs/Model.php";

class prestamoPosModel extends Model
{
    public $db;

    /** @var resource|\PgSql\Connection|null conexion nativa directa a la BD Intelipunto */
    private $intelipuntoConn = null;

    /**
     * Conexion nativa (segunda, independiente de DatabaseCon) hacia la base
     * Intelipunto, usando las credenciales ya guardadas en dblink_configs.
     * Se usa pg_connect directo (no dblink SQL) porque tblserialpos.estatus
     * es tipo "char" y dblink obliga a declarar tipos exactos en cada
     * consulta remota, lo cual es fragil para busquedas dinamicas; con una
     * conexion nativa se consulta igual que a cualquier otra tabla local.
     */
    private function getIntelipuntoConnection()
    {
        if ($this->intelipuntoConn) {
            return $this->intelipuntoConn;
        }

        $conn = $this->db->getConnection();
        $res = pg_query($conn, "SELECT host, port, dbname, username, password FROM dblink_configs WHERE config_name = 'intelipunto_db'");
        if (!$res || pg_num_rows($res) === 0) {
            throw new \RuntimeException("Configuracion de dblink 'intelipunto_db' no encontrada en dblink_configs.");
        }
        $cfg = pg_fetch_assoc($res);
        $connStr = sprintf(
            'host=%s port=%s dbname=%s user=%s password=%s',
            $cfg['host'], $cfg['port'], $cfg['dbname'], $cfg['username'], $cfg['password']
        );

        $intelConn = @pg_connect($connStr);
        if (!$intelConn) {
            throw new \RuntimeException('No se pudo conectar a la base de datos Intelipunto: ' . pg_last_error());
        }
        $this->intelipuntoConn = $intelConn;
        return $this->intelipuntoConn;
    }

    // -------------------------------------------------------------------
    // Etapa 1: alimentar el pool de prestamo desde Intelipunto
    // -------------------------------------------------------------------

    public function buscarPosEnIntelipunto(string $serial): array
    {
        $conn = $this->getIntelipuntoConnection();
        $res = pg_query_params($conn, 'SELECT serial, marcapos, tipopos, activofijo, estatus FROM tblserialpos WHERE serial = $1', [$serial]);
        if (!$res || pg_num_rows($res) === 0) {
            return ['error' => 'not_found', 'message' => 'No se encontro ese serial en Intelipunto.'];
        }
        $row = pg_fetch_assoc($res);
        if ($row['estatus'] !== '0') {
            $nombres = ['0' => 'Disponible', '1' => 'Asignado', '2' => 'Danado', '3' => 'Prestado'];
            $nombreEstatus = $nombres[$row['estatus']] ?? $row['estatus'];
            return ['error' => 'not_available', 'message' => "Ese POS no esta Disponible en Intelipunto (estatus actual: {$nombreEstatus})."];
        }
        return ['data' => $row];
    }

    public function transferirPosAlPool(string $serial, int $idUsuario): array
    {
        // ¿ya esta en el pool y no ha sido devuelto?
        $conn = $this->db->getConnection();
        $resDup = pg_query_params($conn, "SELECT id_prestamo_pos FROM prestamo_pos WHERE serialpos = $1 AND estatus <> 3 LIMIT 1", [$serial]);
        if ($resDup && pg_num_rows($resDup) > 0) {
            return ['error' => 'Ese POS ya esta en el pool de prestamo de SoportePost.'];
        }

        try {
            $intelConn = $this->getIntelipuntoConnection();
        } catch (\Throwable $e) {
            return ['error' => $e->getMessage()];
        }

        $resIntel = pg_query_params($intelConn, 'SELECT * FROM sp_prestar_pos_a_soportepost($1, $2)', [$serial, (string)$idUsuario]);
        if (!$resIntel) {
            return ['error' => 'No se pudo transferir el POS en Intelipunto: ' . pg_last_error($intelConn)];
        }
        $unidad = pg_fetch_assoc($resIntel);

        $sql = 'INSERT INTO prestamo_pos (serialpos, marcapos, tipopos, estatus, usuario_ingreso) VALUES ($1, $2, $3, 0, $4) RETURNING id_prestamo_pos';
        $resInsert = pg_query_params($conn, $sql, [$unidad['serial'], $unidad['marcapos'], $unidad['tipopos'], $idUsuario]);

        if (!$resInsert) {
            // Compensar: devolver el POS a Disponible en Intelipunto para no dejarlo huerfano.
            error_log('[PrestamoPos] Error insertando en prestamo_pos, revirtiendo en Intelipunto: ' . pg_last_error($conn));
            pg_query_params($intelConn, 'SELECT sp_recibir_pos_devuelto($1)', [$serial]);
            return ['error' => 'No se pudo registrar la unidad en el pool de SoportePost. Se revirtio el cambio en Intelipunto.'];
        }

        $row = pg_fetch_assoc($resInsert);
        return ['success' => true, 'id_prestamo_pos' => (int)$row['id_prestamo_pos']];
    }

    public function listarPool(): array
    {
        $conn = $this->db->getConnection();
        $sql = "SELECT p.id_prestamo_pos, p.serialpos, p.marcapos, p.tipopos, p.estatus,
                       sp.name_status_prestamo_pos, p.fecha_ingreso, p.fecha_retorno,
                       p.observaciones, sol.nro_solicitud,
                       COALESCE(CONCAT(ui.name, ' ', ui.surname), '') AS usuario_ingreso_nombre
                FROM prestamo_pos p
                JOIN status_prestamo_pos sp ON sp.id_status_prestamo_pos = p.estatus
                LEFT JOIN prestamo_solicitudes sol ON sol.id_solicitud = p.id_solicitud
                LEFT JOIN users ui ON ui.id_user = p.usuario_ingreso
                ORDER BY p.fecha_ingreso DESC";
        $res = pg_query($conn, $sql);
        return $res ? pg_fetch_all($res) ?: [] : [];
    }

    public function listarPoolDisponible(): array
    {
        $conn = $this->db->getConnection();
        $sql = "SELECT id_prestamo_pos, serialpos, marcapos, tipopos, fecha_ingreso
                FROM prestamo_pos
                WHERE estatus = 0
                ORDER BY fecha_ingreso ASC";
        $res = pg_query($conn, $sql);
        return $res ? pg_fetch_all($res) ?: [] : [];
    }

    // -------------------------------------------------------------------
    // Etapa 2: solicitud del tecnico, ligada a un ticket existente
    // -------------------------------------------------------------------

    public function crearSolicitud(int $idTicket, int $idUserSolicitante, string $observacion, int $idRolSolicitante = 0): array
    {
        $conn = $this->db->getConnection();

        // El id_cliente se deriva del ticket en el propio servidor (no se confia en
        // el valor que mande el front): algunas vistas de ticket (ej. Tecnico) no
        // siempre traen id_cliente en su payload aunque el ticket si lo tenga en BD.
        $resTicket = pg_query_params($conn, 'SELECT id_cliente FROM tickets WHERE id_ticket = $1', [$idTicket]);
        if (!$resTicket || pg_num_rows($resTicket) === 0) {
            return ['error' => 'El ticket indicado no existe.'];
        }
        $idCliente = (int)pg_fetch_assoc($resTicket)['id_cliente'];

        // Regla de negocio: un Tecnico (rol 3) solo puede solicitar un prestamo
        // para tickets que el mismo creo. Coordinador/Administrador/SuperAdmin
        // no tienen esta restriccion (pueden gestionar en nombre de un tecnico).
        if ($idRolSolicitante === 3) {
            $resCreador = pg_query_params(
                $conn,
                'SELECT id_tecnico_n1 FROM users_tickets WHERE id_ticket = $1 ORDER BY id_user_ticket ASC LIMIT 1',
                [$idTicket]
            );
            $idTecnicoCreador = ($resCreador && pg_num_rows($resCreador) > 0)
                ? (int)pg_fetch_assoc($resCreador)['id_tecnico_n1']
                : null;

            if ($idTecnicoCreador !== $idUserSolicitante) {
                return ['error' => 'Solo el tecnico que creo este ticket puede solicitar un prestamo de POS para el.'];
            }
        }

        $resDup = pg_query_params($conn, "SELECT nro_solicitud FROM prestamo_solicitudes WHERE id_ticket = $1 AND id_status_solicitud = 1 LIMIT 1", [$idTicket]);
        if ($resDup && pg_num_rows($resDup) > 0) {
            $dup = pg_fetch_assoc($resDup);
            return ['error' => "Ese ticket ya tiene una solicitud de prestamo pendiente ({$dup['nro_solicitud']})."];
        }

        $sql = 'INSERT INTO prestamo_solicitudes (id_ticket, id_cliente, id_user_solicitante, observacion, id_status_solicitud)
                VALUES ($1, $2, $3, $4, 1) RETURNING id_solicitud';
        $res = pg_query_params($conn, $sql, [$idTicket, $idCliente, $idUserSolicitante, $observacion]);
        if (!$res) {
            return ['error' => 'No se pudo registrar la solicitud: ' . pg_last_error($conn)];
        }
        $row = pg_fetch_assoc($res);
        $newId = (int)$row['id_solicitud'];
        // GPP = Gestion Prestamo de Pos. "PRE-" se evita a proposito: PRES- ya
        // se usa para los numeros de presupuesto (ver consulta_rifModel.php,
        // formato PRES-{nro_ticket}-{seq}) y se prestaba a confusion.
        $nroSolicitud = 'GPP-' . date('dmy') . str_pad((string)$newId, 4, '0', STR_PAD_LEFT);

        pg_query_params($conn, 'UPDATE prestamo_solicitudes SET nro_solicitud = $1 WHERE id_solicitud = $2', [$nroSolicitud, $newId]);

        return ['success' => true, 'id_solicitud' => $newId, 'nro_solicitud' => $nroSolicitud];
    }

    public function listarSolicitudes(?int $idUsuarioSolicitante = null, bool $soloPendientes = false): array
    {
        $conn = $this->db->getConnection();
        $where = [];
        $params = [];

        if ($idUsuarioSolicitante !== null) {
            $params[] = $idUsuarioSolicitante;
            $where[] = 'ps.id_user_solicitante = $' . count($params);
        }
        if ($soloPendientes) {
            $where[] = 'ps.id_status_solicitud = 1';
        }

        $sql = "SELECT ps.id_solicitud, ps.nro_solicitud, ps.id_ticket, ps.id_cliente, ps.observacion,
                       ps.id_status_solicitud, rs.status_name, ps.fecha_creacion, ps.fecha_aprobacion,
                       ps.motivo_rechazo, ps.id_prestamo_pos, pp.serialpos AS serial_asignado,
                       t.nro_ticket, t.rif, t.razonsocial,
                       CONCAT(us.name, ' ', us.surname) AS nombre_solicitante,
                       COALESCE(CONCAT(ua.name, ' ', ua.surname), '') AS nombre_aprobador
                FROM prestamo_solicitudes ps
                JOIN request_statuses rs ON rs.id = ps.id_status_solicitud
                JOIN tickets t ON t.id_ticket = ps.id_ticket
                JOIN users us ON us.id_user = ps.id_user_solicitante
                LEFT JOIN users ua ON ua.id_user = ps.id_user_aprobador
                LEFT JOIN prestamo_pos pp ON pp.id_prestamo_pos = ps.id_prestamo_pos"
                . (count($where) ? ' WHERE ' . implode(' AND ', $where) : '')
                . ' ORDER BY ps.fecha_creacion DESC';

        $res = count($params) ? pg_query_params($conn, $sql, $params) : pg_query($conn, $sql);
        return $res ? pg_fetch_all($res) ?: [] : [];
    }

    public function aprobarSolicitud(int $idSolicitud, int $idPrestamoPos, int $idAprobador): array
    {
        $conn = $this->db->getConnection();
        $res = @pg_query_params($conn, 'SELECT sp_aprobar_solicitud_prestamo($1, $2, $3)', [$idSolicitud, $idPrestamoPos, $idAprobador]);
        if (!$res) {
            return ['error' => pg_last_error($conn)];
        }
        return ['success' => true];
    }

    public function rechazarSolicitud(int $idSolicitud, int $idAprobador, string $motivo): array
    {
        $conn = $this->db->getConnection();
        $sql = "UPDATE prestamo_solicitudes
                SET id_status_solicitud = 4, id_user_aprobador = $1, fecha_aprobacion = now(), motivo_rechazo = $2
                WHERE id_solicitud = $3 AND id_status_solicitud = 1
                RETURNING id_solicitud";
        $res = pg_query_params($conn, $sql, [$idAprobador, $motivo, $idSolicitud]);
        if (!$res || pg_num_rows($res) === 0) {
            return ['error' => 'No se pudo rechazar la solicitud (puede que ya haya sido gestionada).'];
        }
        return ['success' => true];
    }

    // -------------------------------------------------------------------
    // Ciclo de vida de una unidad ya prestada
    // -------------------------------------------------------------------

    public function marcarSustituido(int $idPrestamoPos, string $observacion): array
    {
        $conn = $this->db->getConnection();
        $sql = 'UPDATE prestamo_pos SET estatus = 2, observaciones = $1 WHERE id_prestamo_pos = $2 AND estatus = 1 RETURNING id_prestamo_pos';
        $res = pg_query_params($conn, $sql, [$observacion, $idPrestamoPos]);
        if (!$res || pg_num_rows($res) === 0) {
            return ['error' => 'La unidad no esta en estatus Prestado.'];
        }
        return ['success' => true];
    }

    public function retornarAIntelipunto(int $idPrestamoPos, int $idUsuario): array
    {
        $conn = $this->db->getConnection();
        $resSel = pg_query_params($conn, 'SELECT serialpos, estatus FROM prestamo_pos WHERE id_prestamo_pos = $1', [$idPrestamoPos]);
        if (!$resSel || pg_num_rows($resSel) === 0) {
            return ['error' => 'Unidad no encontrada.'];
        }
        $row = pg_fetch_assoc($resSel);
        if ((int)$row['estatus'] === 3) {
            return ['error' => 'Esa unidad ya fue devuelta a Intelipunto.'];
        }

        try {
            $intelConn = $this->getIntelipuntoConnection();
        } catch (\Throwable $e) {
            return ['error' => $e->getMessage()];
        }

        $resIntel = pg_query_params($intelConn, 'SELECT sp_recibir_pos_devuelto($1)', [$row['serialpos']]);
        if (!$resIntel) {
            return ['error' => 'Error actualizando Intelipunto: ' . pg_last_error($intelConn)];
        }

        $sqlUpd = 'UPDATE prestamo_pos SET estatus = 3, fecha_retorno = now(), usuario_retorno = $1 WHERE id_prestamo_pos = $2';
        pg_query_params($conn, $sqlUpd, [$idUsuario, $idPrestamoPos]);

        return ['success' => true];
    }

    // -------------------------------------------------------------------
    // Interruptor GLOBAL de lanzamiento: mientras esta en false, ningun
    // Tecnico ve ni puede usar "Solicitar Prestamo de POS" (ver app_config).
    // -------------------------------------------------------------------

    public function getFeatureFlagCanRequestPosLoan(): bool
    {
        $conn = $this->db->getConnection();
        $res = pg_query($conn, "SELECT config_value FROM app_config WHERE config_key = 'can_request_pos_loan'");
        if (!$res || pg_num_rows($res) === 0) {
            return false;
        }
        return pg_fetch_assoc($res)['config_value'] === 'true';
    }

    public function setFeatureFlagCanRequestPosLoan(bool $value, int $idUser): void
    {
        $conn = $this->db->getConnection();
        $sql = "UPDATE app_config SET config_value = $1, updated_at = now(), updated_by = $2 WHERE config_key = 'can_request_pos_loan'";
        pg_query_params($conn, $sql, [$value ? 'true' : 'false', $idUser]);
    }
}
