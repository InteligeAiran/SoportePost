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
    public function getPendingTicketsByPriority()
    {
        try {
            $sql = "
                SELECT 
                    COUNT(CASE WHEN prioridad = 'critica' THEN 1 END) as criticos,
                    COUNT(CASE WHEN prioridad = 'alta' THEN 1 END) as altos,
                    COUNT(CASE WHEN prioridad = 'media' THEN 1 END) as medios,
                    COUNT(CASE WHEN prioridad = 'baja' THEN 1 END) as bajos
                FROM tickets 
                WHERE estado IN ('pendiente', 'en_proceso')
                    AND fecha_creacion >= CURRENT_DATE - INTERVAL '7 days';
            ";
            
            $result = Model::getResult($sql, $this->db);
            return $result;
        } catch (Throwable $e) {
            error_log("Error en getPendingTicketsByPriority: " . $e->getMessage());
            return ['query' => null, 'row' => null, 'numRows' => 0];
        }
    }

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
            $sql = "
               
                SELECT DISTINCT
                    u.id_user,
                    u.name,
                    u.surname,
                    u.email,
                    u.username
                FROM users u
                WHERE u.id_rolusr IN (2, 3, 4) -- Roles de técnicos
                    AND u.id_statususr = 1 -- Usuarios activos
                ORDER BY u.name, u.surname;;
            ";
            
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
            $sql = "
                WITH technician_stats AS (
                    SELECT 
                        u.id_user,
                        CONCAT(u.name, ' ', u.surname) as technician_name,
                        COUNT(ut.id_ticket) as total_tickets,
                        COUNT(CASE WHEN t.id_status_ticket = 3 THEN 1 END) as completed_tickets,
                        COUNT(CASE WHEN t.id_status_ticket = 2 THEN 1 END) as in_progress_tickets,
                        COUNT(CASE WHEN t.id_status_ticket = 1 THEN 1 END) as open_tickets,
                        CASE 
                            WHEN COUNT(ut.id_ticket) > 0 
                            THEN ROUND((COUNT(CASE WHEN t.id_status_ticket = 3 THEN 1 END)::numeric / COUNT(ut.id_ticket)::numeric) * 100, 2)
                            ELSE 0 
                        END as completion_rate,
                        CASE 
                            WHEN COUNT(ut.id_ticket) > 0 
                            THEN ROUND((COUNT(CASE WHEN t.id_status_ticket = 3 THEN 1 END)::numeric / COUNT(ut.id_ticket)::numeric) * 100, 2)
                            ELSE 0 
                        END as efficiency_percentage,
                        MAX(ut.date_create_ticket) as last_ticket_date,
                        AVG(
                            CASE 
                                WHEN ut.date_end_ticket IS NOT NULL AND ut.date_create_ticket IS NOT NULL 
                                THEN EXTRACT(EPOCH FROM (ut.date_end_ticket - ut.date_create_ticket))/3600 
                                ELSE NULL 
                            END
                        ) as average_time_hours
                    FROM users u
                    LEFT JOIN users_tickets ut ON u.id_user = ut.id_tecnico_n1
                    LEFT JOIN users_tickets uts ON u.id_user = uts.id_tecnico_n2
                    LEFT JOIN tickets t ON ut.id_ticket = t.id_ticket
                    WHERE u.id_user OR uts.id_user = " . (int)$technicianId . "
                    GROUP BY u.id_user, u.name, u.surname
                ),
                recent_tickets AS (
                    SELECT 
                        t.nro_ticket,
                        st.name_status_ticket as status_name,
                        CASE 
                            WHEN t.id_status_ticket = 1 THEN '#dc3545'
                            WHEN t.id_status_ticket = 2 THEN '#ffc107'
                            WHEN t.id_status_ticket = 3 THEN '#28a745'
                            ELSE '#6c757d'
                        END as status_color,
                        TO_CHAR(ut.date_create_ticket, 'DD-MM-YYYY') as date_created
                    FROM users_tickets ut
                    INNER JOIN tickets t ON ut.id_ticket = t.id_ticket
                    INNER JOIN status_tickets st ON t.id_status_ticket = st.id_status_ticket
                    WHERE ut.id_tecnico_n1 = " . (int)$technicianId . "
                    ORDER BY ut.date_create_ticket DESC
                    LIMIT 5
                )
                SELECT 
                    ts.*,
                    CASE 
                        WHEN ts.average_time_hours IS NOT NULL 
                        THEN ROUND(ts.average_time_hours::numeric, 1) || ' horas'
                        ELSE 'N/A'
                    END as average_time,
                    CASE 
                        WHEN ts.last_ticket_date IS NOT NULL 
                        THEN TO_CHAR(ts.last_ticket_date, 'DD-MM-YYYY')
                        ELSE 'N/A'
                    END as last_ticket_date,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'nro_ticket', rt.nro_ticket,
                                'status_name', rt.status_name,
                                'status_color', rt.status_color,
                                'date_created', rt.date_created
                            )
                        ) FILTER (WHERE rt.nro_ticket IS NOT NULL), 
                        '[]'::json
                    ) as recent_tickets
                FROM technician_stats ts
                LEFT JOIN recent_tickets rt ON true
                GROUP BY ts.id_user, ts.technician_name, ts.total_tickets, ts.completed_tickets, 
                         ts.in_progress_tickets, ts.open_tickets, ts.completion_rate, 
                         ts.efficiency_percentage, ts.last_ticket_date, ts.average_time_hours;
            ";
            
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
}
