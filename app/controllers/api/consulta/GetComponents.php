<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/libs/database_cn.php';

class GetComponents {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function getComponents() {
        try {
            $query = "SELECT id_component, name_component FROM componentes WHERE estado = 'Disponible' ORDER BY name_component";
            $result = $this->db->query($query);
            
            if ($result) {
                $components = [];
                while ($row = $result->fetch_assoc()) {
                    $components[] = [
                        'id_component' => $row['id_component'],
                        'name_component' => $row['name_component']
                    ];
                }
                
                return [
                    'success' => true,
                    'components' => $components
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Error al obtener los componentes'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error en la base de datos: ' . $e->getMessage()
            ];
        }
    }
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'GetComponents') {
        $getComponents = new GetComponents();
        $result = $getComponents->getComponents();
        
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
