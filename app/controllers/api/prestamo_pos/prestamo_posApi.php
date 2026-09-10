<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
namespace App\Controllers\Api\Prestamo_pos;

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../models/prestamoPosModel.php';

use Controller;
use prestamoPosModel;

// Roles autorizados a aprobar/rechazar solicitudes y administrar el pool
// de prestamo (ver tabla roles: 1 SuperAdmin, 4 Coordinador, 5 Administrador).
const PRESTAMO_ROLES_APROBADORES = [1, 4, 5];

class Prestamo_pos extends Controller
{
    private prestamoPosModel $prestamoModel;

    function __construct()
    {
        parent::__construct();
        header('Content-Type: application/json');

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $this->prestamoModel = new prestamoPosModel();
    }

    public function processApi($urlSegments)
    {
        if (empty($_SESSION['id_user'])) {
            $this->response(['success' => false, 'message' => 'Sesion no valida.'], 401);
            return;
        }

        if (!isset($urlSegments[1])) {
            $this->response(['success' => false, 'message' => 'Accion no especificada.'], 400);
            return;
        }

        $action = $urlSegments[1];

        switch ($action) {
            case 'BuscarPosIntelipunto':
                $this->handleBuscarPosIntelipunto();
                break;

            case 'TransferirPosAlPool':
                $this->requireAprobador();
                $this->handleTransferirPosAlPool();
                break;

            case 'ListarPool':
                $this->handleListarPool();
                break;

            case 'ListarPoolDisponible':
                $this->handleListarPoolDisponible();
                break;

            case 'CrearSolicitud':
                $this->handleCrearSolicitud();
                break;

            case 'ListarSolicitudes':
                $this->handleListarSolicitudes();
                break;

            case 'AprobarSolicitud':
                $this->requireAprobador();
                $this->handleAprobarSolicitud();
                break;

            case 'RechazarSolicitud':
                $this->requireAprobador();
                $this->handleRechazarSolicitud();
                break;

            case 'MarcarSustituido':
                $this->requireAprobador();
                $this->handleMarcarSustituido();
                break;

            case 'RetornarAIntelipunto':
                $this->requireAprobador();
                $this->handleRetornarAIntelipunto();
                break;

            case 'SetFeatureFlagCanRequestPosLoan':
                $this->requireSuperAdmin();
                $this->handleSetFeatureFlagCanRequestPosLoan();
                break;

            default:
                $this->response(['success' => false, 'message' => 'Accion no encontrada.'], 404);
        }
    }

    /** Corta la ejecucion con 403 si el usuario en sesion no puede aprobar/gestionar el pool. */
    private function requireAprobador(): void
    {
        $idRol = (int)($_SESSION['id_rol'] ?? 0);
        if (!in_array($idRol, PRESTAMO_ROLES_APROBADORES, true)) {
            $this->response(['success' => false, 'message' => 'No tienes permiso para realizar esta accion.'], 403);
            exit();
        }
    }

    /** El interruptor global de lanzamiento solo lo mueve un SuperAdmin (rol 1). */
    private function requireSuperAdmin(): void
    {
        $idRol = (int)($_SESSION['id_rol'] ?? 0);
        if ($idRol !== 1) {
            $this->response(['success' => false, 'message' => 'Solo un SuperAdmin puede cambiar esta configuracion.'], 403);
            exit();
        }
    }

    // -------------------------------------------------------------------
    // Pool (etapa 1)
    // -------------------------------------------------------------------

    private function handleBuscarPosIntelipunto(): void
    {
        $serial = trim($_POST['serial'] ?? '');
        if ($serial === '') {
            $this->response(['success' => false, 'message' => 'Debe indicar el serial del POS.'], 400);
            return;
        }

        $result = $this->prestamoModel->buscarPosEnIntelipunto($serial);
        if (isset($result['error'])) {
            $this->response(['success' => false, 'message' => $result['message'] ?? $result['error']], 404);
            return;
        }

        $this->response(['success' => true, 'data' => $result['data']]);
    }

    private function handleTransferirPosAlPool(): void
    {
        $serial = trim($_POST['serial'] ?? '');
        if ($serial === '') {
            $this->response(['success' => false, 'message' => 'Debe indicar el serial del POS.'], 400);
            return;
        }

        $result = $this->prestamoModel->transferirPosAlPool($serial, (int)$_SESSION['id_user']);
        if (isset($result['error'])) {
            $this->response(['success' => false, 'message' => $result['error']], 400);
            return;
        }

        $this->response(['success' => true, 'message' => 'POS transferido al pool de prestamo.', 'data' => $result]);
    }

    private function handleListarPool(): void
    {
        $this->response(['success' => true, 'data' => $this->prestamoModel->listarPool()]);
    }

    private function handleListarPoolDisponible(): void
    {
        $this->response(['success' => true, 'data' => $this->prestamoModel->listarPoolDisponible()]);
    }

    // -------------------------------------------------------------------
    // Solicitudes (etapa 2)
    // -------------------------------------------------------------------

    private function handleCrearSolicitud(): void
    {
        $idTicket = (int)($_POST['id_ticket'] ?? 0);
        $observacion = trim($_POST['observacion'] ?? '');
        $idRol = (int)($_SESSION['id_rol'] ?? 0);

        // Lanzamiento controlado: todos menos SuperAdmin (rol 1, incluye
        // Coordinador y Administrador) solo pueden solicitar si el interruptor
        // global esta activo (ver app_config, pestaña Pool de este modulo). No
        // depende solo de que el boton este oculto en el front.
        if ($idRol !== 1 && !$this->prestamoModel->getFeatureFlagCanRequestPosLoan()) {
            $this->response(['success' => false, 'message' => 'Esta funcion aun no esta habilitada.'], 403);
            return;
        }

        if (!$idTicket) {
            $this->response(['success' => false, 'message' => 'Debe buscar y seleccionar un ticket valido antes de solicitar el prestamo.'], 400);
            return;
        }

        $result = $this->prestamoModel->crearSolicitud($idTicket, (int)$_SESSION['id_user'], $observacion, $idRol);
        if (isset($result['error'])) {
            $this->response(['success' => false, 'message' => $result['error']], 400);
            return;
        }

        $this->response(['success' => true, 'message' => "Solicitud {$result['nro_solicitud']} registrada.", 'data' => $result]);
    }

    private function handleListarSolicitudes(): void
    {
        $idRol = (int)($_SESSION['id_rol'] ?? 0);
        $soloPendientes = !empty($_POST['solo_pendientes']);

        // Un tecnico solo ve sus propias solicitudes; un aprobador ve todas.
        $idUsuarioSolicitante = in_array($idRol, PRESTAMO_ROLES_APROBADORES, true) ? null : (int)$_SESSION['id_user'];

        $this->response(['success' => true, 'data' => $this->prestamoModel->listarSolicitudes($idUsuarioSolicitante, $soloPendientes)]);
    }

    private function handleAprobarSolicitud(): void
    {
        $idSolicitud = (int)($_POST['id_solicitud'] ?? 0);
        $idPrestamoPos = (int)($_POST['id_prestamo_pos'] ?? 0);

        if (!$idSolicitud || !$idPrestamoPos) {
            $this->response(['success' => false, 'message' => 'Debe seleccionar la solicitud y la unidad del pool a asignar.'], 400);
            return;
        }

        $result = $this->prestamoModel->aprobarSolicitud($idSolicitud, $idPrestamoPos, (int)$_SESSION['id_user']);
        if (isset($result['error'])) {
            $this->response(['success' => false, 'message' => $result['error']], 400);
            return;
        }

        $this->response(['success' => true, 'message' => 'Solicitud aprobada y POS asignado.']);
    }

    private function handleRechazarSolicitud(): void
    {
        $idSolicitud = (int)($_POST['id_solicitud'] ?? 0);
        $motivo = trim($_POST['motivo'] ?? '');

        if (!$idSolicitud) {
            $this->response(['success' => false, 'message' => 'Debe indicar la solicitud a rechazar.'], 400);
            return;
        }

        $result = $this->prestamoModel->rechazarSolicitud($idSolicitud, (int)$_SESSION['id_user'], $motivo);
        if (isset($result['error'])) {
            $this->response(['success' => false, 'message' => $result['error']], 400);
            return;
        }

        $this->response(['success' => true, 'message' => 'Solicitud rechazada.']);
    }

    // -------------------------------------------------------------------
    // Ciclo de vida de una unidad prestada
    // -------------------------------------------------------------------

    private function handleMarcarSustituido(): void
    {
        $idPrestamoPos = (int)($_POST['id_prestamo_pos'] ?? 0);
        $observacion = trim($_POST['observacion'] ?? '');

        if (!$idPrestamoPos) {
            $this->response(['success' => false, 'message' => 'Debe indicar la unidad a marcar como sustituida.'], 400);
            return;
        }

        $result = $this->prestamoModel->marcarSustituido($idPrestamoPos, $observacion);
        if (isset($result['error'])) {
            $this->response(['success' => false, 'message' => $result['error']], 400);
            return;
        }

        $this->response(['success' => true, 'message' => 'Unidad marcada como Sustituida.']);
    }

    private function handleRetornarAIntelipunto(): void
    {
        $idPrestamoPos = (int)($_POST['id_prestamo_pos'] ?? 0);

        if (!$idPrestamoPos) {
            $this->response(['success' => false, 'message' => 'Debe indicar la unidad a devolver.'], 400);
            return;
        }

        $result = $this->prestamoModel->retornarAIntelipunto($idPrestamoPos, (int)$_SESSION['id_user']);
        if (isset($result['error'])) {
            $this->response(['success' => false, 'message' => $result['error']], 400);
            return;
        }

        $this->response(['success' => true, 'message' => 'Unidad devuelta a Intelipunto.']);
    }

    // -------------------------------------------------------------------
    // Interruptor global de lanzamiento (SuperAdmin)
    // -------------------------------------------------------------------

    private function handleSetFeatureFlagCanRequestPosLoan(): void
    {
        $activo = isset($_POST['activo']) && ($_POST['activo'] === '1' || $_POST['activo'] === 'true');
        $this->prestamoModel->setFeatureFlagCanRequestPosLoan($activo, (int)$_SESSION['id_user']);
        $this->response(['success' => true, 'message' => $activo
            ? 'Boton de Solicitud de Prestamo habilitado para todos los tecnicos.'
            : 'Boton de Solicitud de Prestamo deshabilitado para todos los tecnicos.']);
    }

    private function response($data, $status = 200)
    {
        http_response_code($status);
        echo json_encode($data);
        exit();
    }
}
