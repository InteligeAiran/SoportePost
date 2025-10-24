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

    /**
     * Obtiene eficiencia de técnicos individuales
     * Consulta compleja para análisis detallado de rendimiento
     */
    public function getTechnicianEfficiency()
    {
        try {
            $result = $this->aiModel->getTechnicianEfficiency();
            if ($result && $result['numRows'] > 0) {
            $rows = [];
            for ($i = 0; $i < $result['numRows']; $i++) {
                $rows[] = pg_fetch_assoc($result['query'], $i);
            }
            pg_free_result(result: $result['query']);
            return $rows;
            }else{
                return null;
            }
        } catch (Exception $e) {
            error_log('Error en AiRepository::getTechnicianEfficiency: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtiene lista de técnicos para selección
     * Consulta simple para obtener técnicos activos
     */
    public function getTechnicianList()
    {
        try {
            $result = $this->aiModel->getTechnicianList();
            if ($result && $result['numRows'] > 0) {
                $rows = [];
                for ($i = 0; $i < $result['numRows']; $i++) {
                    $rows[] = pg_fetch_assoc($result['query'], $i);
                }
                pg_free_result($result['query']);
                return $rows;
            } else {
                return null;
            }
        } catch (Exception $e) {
            error_log('Error en AiRepository::getTechnicianList: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtiene rendimiento de un técnico específico
     * Consulta detallada para análisis individual
     */
    public function getTechnicianPerformance($technicianId)
    {
        try {
            $result = $this->aiModel->getTechnicianPerformance($technicianId);
            error_log("AiRepository::getTechnicianPerformance - Result: " . print_r($result, true));
            
            if ($result && $result['numRows'] > 0) {
                // Para rendimiento individual, devolver solo el primer elemento como objeto
                $row = pg_fetch_assoc($result['query'], 0);
                error_log("AiRepository::getTechnicianPerformance - Row: " . print_r($row, true));
                pg_free_result($result['query']);
                return $row; // Devolver objeto en lugar de array
            } else {
                error_log("AiRepository::getTechnicianPerformance - No data found");
                return null;
            }
        } catch (Exception $e) {
            error_log('Error en AiRepository::getTechnicianPerformance: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtiene tickets pendientes categorizados por prioridad
     * @param int $daysCritical Días para considerar un ticket como crítico
     * @return array|null Datos de tickets pendientes por prioridad
     */

    public function getPendingTicketsByPriority($daysCritical)
    {
        try {
            $result = $this->aiModel->getPendingTicketsByPriority($daysCritical);
            return $result ? $result['row'] : null;
        } catch (Exception $e) {
            error_log('Error en AiRepository::getPendingTicketsByPriority: ' . $e->getMessage());
            return null;
        }
    }

      /**
     * Obtiene tickets específicos por prioridad
     * @param string $priority Prioridad específica (critico, alto, medio, bajo)
     * @param int $daysCritical Días para considerar un ticket como crítico
     * @return array|null Lista de tickets por prioridad
     */
    public function getTicketsByPriority($priority, $daysCritical)
    {
        try {
            $result = $this->aiModel->getTicketsByPriority($priority, $daysCritical);
            
            if ($result && $result['numRows'] > 0) {
                $rows = [];
                for ($i = 0; $i < $result['numRows']; $i++) {
                    $rows[] = pg_fetch_assoc($result['query'], $i);
                }
                pg_free_result($result['query']);
                return $rows;
            } else {
                return null;
            }
        } catch (Exception $e) {
            error_log('Error en AiRepository::getTicketsByPriority: ' . $e->getMessage());
            return null;
        }
    }
}
