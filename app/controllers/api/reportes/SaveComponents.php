<?php
require_once __DIR__ . '/../../../libs/database_cn.php';

class SaveComponents {
    private $db;
    
    public function __construct() {
        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
    }
    
    public function saveComponents($id_ticket, $serial_pos, $componentes, $id_user, $modulo_insertcolumn) {
        try {
            // Iniciar transacción
            $this->db->pgquery("BEGIN");
            
            // Primero, eliminar componentes existentes para este ticket
            $sqlDelete = "DELETE FROM componentes_dispositivo WHERE id_ticket = $1";
            $resultDelete = $this->db->pgquery($sqlDelete);
            
            if (!$resultDelete) {
                $this->db->pgquery("ROLLBACK");
                return false;
            }
            
            // Insertar los nuevos componentes seleccionados
            $sqlcomponents = "INSERT INTO componentes_dispositivo (serial_pos, id_ticket, id_componente, id_user, modulo_insertcolumn) VALUES ($1, $2, $3, $4, $5)";
            
            foreach ($componentes as $comp_id) {
                $resultcomponent = $this->db->pgquery($sqlcomponents);
                
                if (!$resultcomponent) {
                    $this->db->pgquery("ROLLBACK");
                    return false;
                }
            }
            
            // Actualizar el estado de componentes en la tabla tickets
            $sqlUpdateTicket = "UPDATE tickets SET id_status_component = 1 WHERE id_ticket = $1";
            $resultUpdateTicket = $this->db->pgquery($sqlUpdateTicket);
            
            if (!$resultUpdateTicket) {
                $this->db->pgquery("ROLLBACK");
                return false;
            }
            
            // Si todo va bien, busca el historial y lo inserta.
            $status_lab_sql = "SELECT id_status_lab FROM tickets_status_lab WHERE id_ticket = $1";
            $status_lab_result = $this->db->pgquery($status_lab_sql);
            $id_status_lab = ($status_lab_result && $this->db->pgNumrows($status_lab_result) > 0) ? (int)$this->db->pgfetch($status_lab_result)['id_status_lab'] : 'NULL';

            $status_payment_status_sql = "SELECT id_status_payment FROM tickets WHERE id_ticket = $1";
            $status_payment_status_result = $this->db->pgquery($status_payment_status_sql);
            $id_new_status_payment = ($status_payment_status_result && $this->db->pgNumrows($status_payment_status_result) > 0) ? (int)$this->db->pgfetch($status_payment_status_result)['id_status_payment'] : 'NULL';

            $status_domiciliacion_sql = "SELECT id_status_domiciliacion FROM tickets_status_domiciliacion WHERE id_ticket = $1";
            $status_domiciliacion_result = $this->db->pgquery($status_domiciliacion_sql);
            $new_status_domiciliacion = ($status_domiciliacion_result && $this->db->pgNumrows($status_domiciliacion_result) > 0) ? (int)$this->db->pgfetch($status_domiciliacion_result)['id_status_domiciliacion'] : 'NULL';

            $id_status_ticket = 'NULL';
            $status_ticket_sql = "SELECT id_status_ticket FROM tickets WHERE id_ticket = $1";
            $status_ticket_result = $this->db->pgquery($status_ticket_sql);
            $id_status_ticket = ($status_ticket_result && $this->db->pgNumrows($status_ticket_result) > 0) ? (int)$this->db->pgfetch($status_ticket_result)['id_status_ticket'] : 'NULL';

            $id_accion_ticket = 15;

            // Insertar en el historial del ticket
            $resultsqlInsertHistory = $this->db->pgquery(
                "INSERT INTO ticket_status_history (id_ticket, id_user, id_status_ticket, id_accion_ticket, id_status_lab, id_status_payment, id_status_domiciliacion, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())"
            );

            if (!$resultsqlInsertHistory) {
                $this->db->pgquery("ROLLBACK");
                return false;
            }
            
            // Confirmar transacción
            $this->db->pgquery("COMMIT");
            return true;
            
        } catch (Exception $e) {
            $this->db->pgquery("ROLLBACK");
            return false;
        }
    }
}

// Manejo de la petición HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $saveComponents = new SaveComponents();
    
    $id_ticket = $_POST['id_ticket'] ?? null;
    $serial_pos = $_POST['serial_pos'] ?? null;
    $componentes = $_POST['componentes'] ?? [];
    $id_user = $_POST['id_user'] ?? null;
    $modulo_insertcolumn = $_POST['modulo_insertcolumn'] ?? 'consulta_rif';
    
    if ($id_ticket && $serial_pos && !empty($componentes) && $id_user) {
        $result = $saveComponents->saveComponents($id_ticket, $serial_pos, $componentes, $id_user, $modulo_insertcolumn);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Componentes guardados correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al guardar los componentes']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    }
}
?>
