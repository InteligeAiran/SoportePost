<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */




require_once __DIR__ . "/../../../models/dashboardModel.php";
require_once __DIR__ . "/../../../../libs/database_cn.php";

// Función mi_navbar() para generar la barra de navegación
function mi_navbar() {

}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    $model = new dashboardModel();

    switch ($action) {
        case 'getUserCount': // Nueva acción para obtener el conteo de usuarios
            $result = $model->GetUserCount(); // Llama a la función en tu modelo
            //var_dump($result);
            $users = $result['row']['users']; // Accede directamente a 'users'

            if ($users !== false) {
                $response = [
                    'success' => true,
                    'count' => $users
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Error al obtener el conteo de usuarios'
                ];
            }
        break;

        case 'getUsers':
            $result = $model->GetUsers();
            $users = []; // Inicializa un array para almacenar los usuarios


            for ($i=0; $i < $result['numRows']; $i++) { 
                $agente = pg_fetch_assoc($result['query'], $i);
                $users[] = $agente; // Agrega cada usuario al array
            }


            if (!empty($users)) {
                $response = [
                    'success' => true,
                    'users' => $users
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'No se encontraron usuarios'
                ];
            }
        break;
    }
header('Content-Type: application/json');
echo json_encode($response);
exit;
    //var_dump($Result);*/
}
?>