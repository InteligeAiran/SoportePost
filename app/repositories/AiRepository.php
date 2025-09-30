<?php
namespace App\Repositories; // Usar namespaces para organizar tus clases
use AiModel; // Asegúrate de que tu modelo de usuario exista
use Exception;
require_once 'app/models/aiModel.php';


class AiRepository
{
    private $aiModel;

    public function __construct()
    {
        $this->aiModel = new AiModel();
    }

    /**
     * Obtiene estadísticas de tickets con consulta optimizada
     * Utiliza una sola consulta con múltiples agregaciones para eficiencia
     */
    public function getefficiency_summary()
    {
        try {
            $result = $this->aiModel->getefficiency_summary();
            return $result ? $result['row'] : null;
        } catch (Exception $e) {
            error_log('Error en AiRepository::getefficiency_summary: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtiene análisis de rendimiento de usuarios
     * Consulta optimizada con índices en fecha y usuario
     */
    public function getUserPerformance()
    {
        try {
            $result = $this->aiModel->getUserPerformance();
            return $result ? $result['row'] : null;
        } catch (Exception $e) {
            error_log('Error en AiRepository::getUserPerformance: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtiene tickets pendientes agrupados por prioridad
     * Consulta eficiente con filtros optimizados
     */
    public function getPendingTicketsByPriority()
    {
        try {
            $result = $this->aiModel->getPendingTicketsByPriority();
            return $result ? $result['row'] : null;
        } catch (Exception $e) {
            error_log('Error en AiRepository::getPendingTicketsByPriority: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtiene análisis de clientes
     * Consulta compleja optimizada para análisis de patrones
     */
    public function getClientAnalysis()
    {
        try {
            $result = $this->aiModel->getClientAnalysis();
            return $result ? $result['row'] : null;
        } catch (Exception $e) {
            error_log('Error en AiRepository::getClientAnalysis: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtiene estado del sistema
     * Consultas ligeras para métricas en tiempo real
     */
    public function getSystemHealth()
    {
        try {
            $result = $this->aiModel->getSystemHealth();
            return $result ? $result['row'] : null;
        } catch (Exception $e) {
            error_log('Error en AiRepository::getSystemHealth: ' . $e->getMessage());
            return null;
        }
    }
}
