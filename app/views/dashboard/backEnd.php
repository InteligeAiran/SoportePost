<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../../../models/dashboard2Model.php";
require_once __DIR__ . "/../../../../libs/database_cn.php";
require_once __DIR__ . "/../../../../libs/Session.php";
Session::init(); // Inicia la sesión

// Función mi_navbar() para generar la barra de navegación


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
            $users = $model->GetUsers();
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