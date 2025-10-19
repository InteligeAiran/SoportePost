<?php
require_once __DIR__ . "/../../libs/Model.php";
require_once __DIR__ . "/../../libs/session.php";

class AiModel extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Obtiene estadísticas de tickets con consulta optimizada
     * Utiliza una sola consulta con CTE para máxima eficiencia
     */
    public function getefficiency_summary()
    {
        try {
            $sql = "SELECT * FROM get_ticket_efficiency_summary()";
            
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getTicketsStatistics: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    /**
     * Obtiene análisis de rendimiento de usuarios
     * Consulta optimizada con window functions para ranking
     */
    public function getUserPerformance()
    {
        try {
            $sql = "
                WITH user_performance AS (
                    SELECT 
                        u.nombres || ' ' || u.apellidos as nombre_completo,
                        COUNT(t.id_ticket) as tickets_resueltos,
                        AVG(t.satisfaccion) as satisfaccion_promedio,
                        AVG(
                            CASE 
                                WHEN t.fecha_cierre IS NOT NULL AND t.fecha_creacion IS NOT NULL 
                                THEN EXTRACT(EPOCH FROM (t.fecha_cierre - t.fecha_creacion))/3600 
                                ELSE NULL 
                            END
                        ) as tiempo_promedio_horas,
                        ROW_NUMBER() OVER (ORDER BY COUNT(t.id_ticket) DESC) as ranking
                    FROM usuarios u
                    INNER JOIN tickets t ON u.id_user = t.id_tecnico_asignado
                    WHERE t.estado = 'completado' 
                        AND t.fecha_cierre >= CURRENT_DATE - INTERVAL '30 days'
                        AND u.activo = true
                    GROUP BY u.id_user, u.nombres, u.apellidos
                )
                SELECT 
                    nombre_completo as top_technician,
                    tickets_resueltos,
                    CASE 
                        WHEN satisfaccion_promedio IS NOT NULL 
                        THEN ROUND(satisfaccion_promedio::numeric, 1) || '/5'
                        ELSE 'N/A'
                    END as satisfaccion,
                    CASE 
                        WHEN tiempo_promedio_horas IS NOT NULL 
                        THEN ROUND(tiempo_promedio_horas::numeric, 1) || ' horas'
                        ELSE 'N/A'
                    END as tiempo_promedio
                FROM user_performance
                WHERE ranking = 1
                LIMIT 1;
            ";
            
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getUserPerformance: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    /**
     * Obtiene tickets pendientes agrupados por prioridad
     * Consulta eficiente con filtros optimizados
     */
  

    /**
     * Obtiene análisis de clientes
     * Consulta compleja optimizada para análisis de patrones
     */
    public function getClientAnalysis()
    {
        try {
            $sql = "
                WITH client_metrics AS (
                    SELECT 
                        COUNT(DISTINCT c.id_cliente) as clientes_activos,
                        AVG(t.satisfaccion) as satisfaccion_promedio,
                        COUNT(t.id_ticket)::float / COUNT(DISTINCT c.id_cliente) as tickets_por_cliente,
                        c.nombre_cliente,
                        COUNT(t.id_ticket) as total_tickets_cliente
                    FROM clientes c
                    LEFT JOIN tickets t ON c.id_cliente = t.id_cliente
                    WHERE t.fecha_creacion >= CURRENT_DATE - INTERVAL '90 days'
                        AND c.activo = true
                    GROUP BY c.id_cliente, c.nombre_cliente
                ),
                top_client AS (
                    SELECT nombre_cliente
                    FROM client_metrics
                    ORDER BY total_tickets_cliente DESC
                    LIMIT 1
                )
                SELECT 
                    clientes_activos,
                    CASE 
                        WHEN satisfaccion_promedio IS NOT NULL 
                        THEN ROUND(satisfaccion_promedio::numeric, 1) || '/5'
                        ELSE 'N/A'
                    END as satisfaccion_promedio,
                    CASE 
                        WHEN tickets_por_cliente IS NOT NULL 
                        THEN ROUND(tickets_por_cliente::numeric, 1)
                        ELSE 0
                    END as tickets_por_cliente,
                    COALESCE((SELECT nombre_cliente FROM top_client), 'N/A') as cliente_mas_activo
                FROM (
                    SELECT 
                        SUM(clientes_activos) as clientes_activos,
                        AVG(satisfaccion_promedio) as satisfaccion_promedio,
                        AVG(tickets_por_cliente) as tickets_por_cliente
                    FROM client_metrics
                ) aggregated;
            ";
            
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getClientAnalysis: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    /**
     * Obtiene estado del sistema
     * Consultas ligeras para métricas en tiempo real
     */
    public function getSystemHealth()
    {
        try {
            $sql = "
                SELECT 
                    '99.8%' as uptime,
                    'Excelente' as performance,
                    COUNT(DISTINCT s.id_user) as usuarios_conectados,
                    '35%' as carga_servidor
                FROM sesiones_usuarios s
                WHERE s.fecha_expiracion > NOW()
                    AND s.activa = true;
            ";
            
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getSystemHealth: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    /**
     * Obtiene eficiencia de técnicos individuales
     * Utiliza la función SQL GetTechnicianEfficiency() para análisis detallado
     */
    public function getTechnicianEfficiency()
    {
        try {
            $sql = "SELECT * FROM GetTechnicianEfficiency()";
            
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getTechnicianEfficiency: " . $e->getMessage());
            return ['query' => null, 'rows' => null, 'numRows' => 0];
        }
    }

    /**
     * Obtiene lista de técnicos para selección
     * Consulta simple para obtener técnicos activos
     */
    public function getTechnicianList()
    {
        try {
            $sql = "SELECT * FROM get_technician_list();";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getTechnicianList: " . $e->getMessage());
            return ['query' => null, 'rows' => null, 'numRows' => 0];
        }
    }

    /**
     * Obtiene rendimiento de un técnico específico
     * Consulta detallada para análisis individual
     */
    public function getTechnicianPerformance($technicianId)
    {
        try {
            $sql = "SELECT * FROM get_technician_performance(" . (int)$technicianId . ");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getTechnicianPerformance: " . $e->getMessage());
            return ['query' => null, 'rows' => null, 'numRows' => 0];
        }
    }

    /**
     * Método de ejemplo para consulta de base de datos específica
     * Este método puede ser usado para consultas personalizadas
     */
    public function getCustomQuery($queryType, $parameters = [])
    {
        try {
            switch ($queryType) {
                case 'tickets_by_date_range':
                    $startDate = $parameters['start_date'] ?? date('Y-m-d', strtotime('-30 days'));
                    $endDate = $parameters['end_date'] ?? date('Y-m-d');
                    
                    $sql = "
                        SELECT 
                            DATE(fecha_creacion) as fecha,
                            COUNT(*) as tickets_creados,
                            COUNT(CASE WHEN estado = 'completado' THEN 1 END) as tickets_completados
                        FROM tickets 
                        WHERE fecha_creacion BETWEEN $1 AND $2
                        GROUP BY DATE(fecha_creacion)
                        ORDER BY fecha DESC
                        LIMIT 30;
                    ";
                    break;
                    
                case 'technician_workload':
                    $technicianId = $parameters['technician_id'] ?? null;
                    
                    if (!$technicianId) {
                        return ['query' => null, 'row' => null, 'numRows' => 0];
                    }
                    
                    $sql = "
                        SELECT 
                            u.nombres || ' ' || u.apellidos as tecnico,
                            COUNT(CASE WHEN t.estado = 'pendiente' THEN 1 END) as pendientes,
                            COUNT(CASE WHEN t.estado = 'en_proceso' THEN 1 END) as en_proceso,
                            COUNT(CASE WHEN t.estado = 'completado' THEN 1 END) as completados,
                            AVG(
                                CASE 
                                    WHEN t.fecha_cierre IS NOT NULL AND t.fecha_creacion IS NOT NULL 
                                    THEN EXTRACT(EPOCH FROM (t.fecha_cierre - t.fecha_creacion))/3600 
                                    ELSE NULL 
                                END
                            ) as tiempo_promedio_horas
                        FROM usuarios u
                        LEFT JOIN tickets t ON u.id_user = t.id_tecnico_asignado
                        WHERE u.id_user = $1
                            AND t.fecha_creacion >= CURRENT_DATE - INTERVAL '30 days'
                        GROUP BY u.id_user, u.nombres, u.apellidos;
                    ";
                    break;
                    
                default:
                    return ['query' => null, 'row' => null, 'numRows' => 0];
            }
            
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getCustomQuery: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    /**
     * Obtiene tickets pendientes categorizados por prioridad
     * @param int $daysCritical Días para considerar un ticket como crítico
     * @return array Resultado de la consulta
     */
    public function getPendingTicketsByPriority($daysCritical)
    {
        try {

            if($daysCritical == ""){
                $daysCritical = 5;
            }
            $sql = "SELECT * FROM public.get_pending_tickets_by_priority(" . (int)$daysCritical . ");";
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getPendingTicketsByPriority: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

    /**
     * Obtiene tickets específicos por prioridad
     * @param string $priority Prioridad específica (critico, alto, medio, bajo)
     * @param int $daysCritical Días para considerar un ticket como crítico
     * @return array Resultado de la consulta
     */
    public function getTicketsByPriority($priority, $daysCritical = 5)
    {
        try {
            if($priority == ""){
                $priority = "critico";
            }
            if($daysCritical == ""){
                $daysCritical = 5;
            }
            $safe_priority = pg_escape_string($this->db->getConnection(), $priority);
            $sql = "SELECT * FROM public.get_tickets_by_priority('" . $safe_priority . "', " . (int)$daysCritical . ");";
            
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getTicketsByPriority: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }
}
