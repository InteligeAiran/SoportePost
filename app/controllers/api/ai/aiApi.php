<?php
namespace App\Controllers\Api\ai; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../../libs/View.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once 'app/repositories/AiRepository.php';

use App\Repositories\AiRepository;
use Controller;
use DatabaseCon;
use Exception;

class ai extends Controller
{
    private $aiRepository;
    private $db;

    public function __construct()
    {
        parent::__construct();
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
        $this->aiRepository = new AiRepository();
    }

        public function processApi($urlSegments)
    {
        

        $method = $_SERVER['REQUEST_METHOD'];
        if (isset($urlSegments[1])) {
            $action = $urlSegments[1];
            switch ($action) {
            case 'tickets_efficiency_summary':
                $this->getefficiency_summary();
                break;
            case 'user_performance':
                $this->getUserPerformance();
                break;
            case 'pending_tickets':
                $this->getPendingTickets();
                break;
            case 'client_analysis':
                $this->getClientAnalysis();
                break;
            case 'system_health':
                $this->getSystemHealth();
                break;
            case 'technician_efficiency':
                $this->getTechnicianEfficiency();
                break;
                default:
                    $this->response(['error' => 'Acción no encontrada en consulta'], 404);
                    break;
            }
        } else {
            $this->response(['error' => 'Acción no especificada en consulta'], 400);
        }
    }
    

    /**
     * Obtiene estadísticas de tickets con consulta optimizada
     */
    private function getefficiency_summary()
    {
        try {
            $stats = $this->aiRepository->getefficiency_summary();
            
            if ($stats) {
                $this->response([
                    'success' => true,
                    'data' => [
                        'total_tickets_count' => $stats['total_tickets_count'] ?? 0,
                        'in_process_tickets_count' => $stats['in_process_tickets_count'] ?? 0,
                        'resolved_tickets_count' => $stats['resolved_tickets_count'] ?? 0,
                        'percentage_open' => $stats['percentage_open'] ?? '0%',
                        'percentage_in_process' => $stats['percentage_in_process'] ?? '0%',
                        'percentage_resolved' => $stats['percentage_resolved'] ?? '0%',
                        'efficiency' => $stats['efficiency'] ?? '0%',
                    ],
                    'message' => 'Estadísticas obtenidas exitosamente'
                ], 200);
            } else {
                $this->response([
                    'success' => false,
                    'message' => 'No se pudieron obtener las estadísticas'
                ], 500);
            }
        } catch (Exception $e) {
            error_log('Error en getTicketsStats: ' . $e->getMessage());
            $this->response([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Obtiene análisis de rendimiento de usuarios
     */
    private function getUserPerformance()
    {
        try {
            $performance = $this->aiRepository->getUserPerformance();
            
            if ($performance) {
                $this->response([
                    'success' => true,
                    'data' => [
                        'top_technician' => $performance['top_technician'] ?? 'N/A',
                        'tickets_resueltos' => $performance['tickets_resueltos'] ?? 0,
                        'satisfaccion' => $performance['satisfaccion'] ?? '0/5',
                        'tiempo_promedio' => $performance['tiempo_promedio'] ?? '0 horas'
                    ],
                    'message' => 'Análisis de rendimiento obtenido'
                ], 200);
            } else {
                $this->response([
                    'success' => false,
                    'message' => 'No se pudo obtener el análisis de rendimiento'
                ], 500);
            }
        } catch (Exception $e) {
            error_log('Error en getUserPerformance: ' . $e->getMessage());
            $this->response([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Obtiene tickets pendientes por prioridad
     */
    private function getPendingTickets()
    {
        try {
            $pending = $this->aiRepository->getPendingTicketsByPriority();
            
            if ($pending) {
                $this->response([
                    'success' => true,
                    'data' => [
                        'criticos' => $pending['criticos'] ?? 0,
                        'altos' => $pending['altos'] ?? 0,
                        'medios' => $pending['medios'] ?? 0,
                        'bajos' => $pending['bajos'] ?? 0
                    ],
                    'message' => 'Tickets pendientes obtenidos'
                ], 200);
            } else {
                $this->response([
                    'success' => false,
                    'message' => 'No se pudieron obtener los tickets pendientes'
                ], 500);
            }
        } catch (Exception $e) {
            error_log('Error en getPendingTickets: ' . $e->getMessage());
            $this->response([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Obtiene análisis de clientes
     */
    private function getClientAnalysis()
    {
        try {
            $analysis = $this->aiRepository->getClientAnalysis();
            
            if ($analysis) {
                $this->response([
                    'success' => true,
                    'data' => [
                        'clientes_activos' => $analysis['clientes_activos'] ?? 0,
                        'satisfaccion_promedio' => $analysis['satisfaccion_promedio'] ?? '0/5',
                        'tickets_por_cliente' => $analysis['tickets_por_cliente'] ?? 0,
                        'cliente_mas_activo' => $analysis['cliente_mas_activo'] ?? 'N/A'
                    ],
                    'message' => 'Análisis de clientes obtenido'
                ], 200);
            } else {
                $this->response([
                    'success' => false,
                    'message' => 'No se pudo obtener el análisis de clientes'
                ], 500);
            }
        } catch (Exception $e) {
            error_log('Error en getClientAnalysis: ' . $e->getMessage());
            $this->response([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Obtiene estado del sistema
     */
    private function getSystemHealth()
    {
        try {
            $health = $this->aiRepository->getSystemHealth();
            
            if ($health) {
                $this->response([
                    'success' => true,
                    'data' => [
                        'uptime' => $health['uptime'] ?? '99.9%',
                        'performance' => $health['performance'] ?? 'Excelente',
                        'usuarios_conectados' => $health['usuarios_conectados'] ?? 0,
                        'carga_servidor' => $health['carga_servidor'] ?? '0%'
                    ],
                    'message' => 'Estado del sistema obtenido'
                ], 200);
            } else {
                $this->response([
                    'success' => false,
                    'message' => 'No se pudo obtener el estado del sistema'
                ], 500);
            }
        } catch (Exception $e) {
            error_log('Error en getSystemHealth: ' . $e->getMessage());
            $this->response([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Obtiene eficiencia de técnicos individuales
     */
    private function getTechnicianEfficiency()
    {
        try {
            $efficiency = $this->aiRepository->getTechnicianEfficiency();
            
            if ($efficiency) {
                $this->response([
                    'success' => true,
                    'data' => $efficiency,
                    'message' => 'Eficiencia de técnicos obtenida exitosamente'
                ], 200);
            } else {
                $this->response([
                    'success' => false,
                    'message' => 'No se pudo obtener la eficiencia de técnicos'
                ], 500);
            }
        } catch (Exception $e) {
            error_log('Error en getTechnicianEfficiency: ' . $e->getMessage());
            $this->response([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Método para manejar respuestas HTTP
     */
    private function response($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}
