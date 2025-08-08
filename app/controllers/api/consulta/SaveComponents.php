<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/libs/database_cn.php';

class SaveComponents {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function saveComponents($ticketId, $serialPos, $selectedComponents) {
        try {
            // Start transaction
            $this->db->beginTransaction();
            
            // First, delete existing components for this serial
            $deleteQuery = "DELETE FROM componentes_dispositivo WHERE serial_dispositivo = ?";
            $deleteStmt = $this->db->prepare($deleteQuery);
            $deleteStmt->bind_param("s", $serialPos);
            $deleteStmt->execute();
            
            // Then insert the new selected components
            $insertQuery = "INSERT INTO componentes_dispositivo (id_ticket, serial_dispositivo, id_component, fecha_asignacion) VALUES (?, ?, ?, NOW())";
            $insertStmt = $this->db->prepare($insertQuery);
            
            $components = json_decode($selectedComponents, true);
            
            foreach ($components as $componentId) {
                $insertStmt->bind_param("isi", $ticketId, $serialPos, $componentId);
                $insertStmt->execute();
            }
            
            // Commit transaction
            $this->db->commit();
            
            return [
                'success' => true,
                'message' => 'Componentes guardados correctamente'
            ];
            
        } catch (Exception $e) {
            // Rollback transaction on error
            $this->db->rollback();
            
            return [
                'success' => false,
                'message' => 'Error al guardar los componentes: ' . $e->getMessage()
            ];
        }
    }
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'SaveComponents') {
        $ticketId = $_POST['ticketId'] ?? '';
        $serialPos = $_POST['serialPos'] ?? '';
        $selectedComponents = $_POST['selectedComponents'] ?? '';
        
        if (empty($ticketId) || empty($serialPos) || empty($selectedComponents)) {
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Faltan parámetros requeridos'
            ]);
            exit;
        }
        
        $saveComponents = new SaveComponents();
        $result = $saveComponents->saveComponents($ticketId, $serialPos, $selectedComponents);
        
        header('Content-Type: application/json');
        echo json_encode($result);
    } else {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Acción no válida'
        ]);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>
