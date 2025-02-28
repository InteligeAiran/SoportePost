<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../../models/loginModel.php";
require_once __DIR__ . "/../../../libs/database_cn.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    $model = new loginModel();

    switch ($action) {
        case 'login':
            $username = $_POST['username'];
            $password = $_POST['password'];

            if ($username != '' && $password != '') {
                $result = $model->GetUserData($username, $password);

                if ($result && $result['numRows'] > 0) {
                    $func = $result['row'];
                    $_SESSION["cedula"] = $func['coddocumento'];
                    $_SESSION["usuario"] = $func['usuario'];
                    $_SESSION["nombre"] = $func['nombres'];
                    $_SESSION["apellido"] = $func['apellidos'];
                    $_SESSION["correo"] = $func['correo'];
                    $_SESSION["d_rol"] = $func['codtipousuario'];
                    $_SESSION["status"] = $func['activo'];
                    $_SESSION["cargo"] = $func['cargo'];

                    if ($_SESSION["status"] != 0) {
                        $response = [
                            'success' => true,
                            'message' => 'Bienvenido',
                            //'redirect' => 'dashboard.php'
                        ];
                    } else {
                        $response = [
                            'success' => false,
                            'message' => 'No se puede ingresar, el usuario está inactivo'
                        ];
                    }
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Usuario o contraseña incorrectos'
                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Usuario o contraseña están vacíos'
                ];
            }
            break;
     
        case 'checkUsername': 
            $username = $_POST['username'];
           // var_dump($_POST);   
            if ($username != '') {
                $result = $model->GetUsernameUser($username);
                if ($result && $result['numRows'] > 0) {
                    $response = [
                        'success' => true,
                        'message' => 'Verificado',
                        'color'   => 'green'
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'No existe',
                        'color'=> 'red'

                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Usuario o contraseña están vacíos',
                    'color'=> 'red'
                ];
            }
        break;

            case 'checkPass': 
                $username = $_POST['username'];
                $password = $_POST['password'];
               // var_dump($_POST);   
                if ($password != '') {
                    $result = $model->GetPasswordUser( $username,$password);
                    if ($result && $result['numRows'] > 0) {
                        $response = [
                            'success' => true,
                            'message' => 'La clave conside con el usuario', 
                            'color'   => 'green'
                        ];
                    } else {
                        $response = [
                            'success' => false,
                            'message' => 'No coiciden',
                            'color'=> 'red'
    
                        ];
                    }
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Usuario o contraseña están vacíos',
                        'color'=> 'red'
                    ];
                }
                break;
    
            default:
            $response = ['success' => false, 'message' => 'Acción no válida'];
        break;

    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
    //var_dump($Result);
}
?>