<?php
namespace App\Controllers\Api\users; // Define el namespace

require_once __DIR__ . '/../../../../libs/Controller.php';
require_once __DIR__ . '/../../../../libs/database_cn.php';
require_once __DIR__ . '/../../../../libs/View.php';
require_once __DIR__ . '/../../../../libs/database.php';
require_once __DIR__ . '/../../../repositories/UserRepository.php';

require_once __DIR__ . '/../../../../config/paths.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Repositories\UserRepository;
use Controller;
use DatabaseCon;

class users extends Controller {
    private $db;
    // ... otras propiedades que necesites

    function __construct() {
        parent::__construct();
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type');

            // Inicia la sesión aquí, al principio del constructor o del método handleLogin
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }


        $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);
        // ... instancia tus repositorios y servicios si los usas aquí
    }

    public function processApi($urlSegments) {
        $method = $_SERVER['REQUEST_METHOD'];
        if (isset($urlSegments[1])) {
            $action = $urlSegments[1];
            switch ($action) {
                case 'permissions':
                    $userId = (int) $urlSegments[2];
                    if ($userId > 0) {
                    $this->handleGetUserPermissions($userId);
                    } else {
                        $this->response(['error' => 'ID de usuario no válido'], 400);
                    }
                    $this->response(['error' => 'Hay un Error'], 401);
                break;

                case 'users':
                    // Pasar los segmentos de la URL a la función handleUsers
                    // y manejar la lógica de obtención de usuarios
                    $this->handleUsers($method, $urlSegments); 
                break;

                case 'access':
                    // El método POST para login puede seguir como está
                    $this->handleLogin(); 
                break;

                /*case 'logout':
                    // Manejo de la sesión de cierre de sesión
                    session_start();
                    session_destroy();
                    $this->response(['success' => true, 'message' => 'Sesión cerrada correctamente'], 200);
                break;*/

                case 'checkUser':
                    // Manejo de la verificación de nombre de usuario
                    $this->handleUsername();
                break;

                case 'GetUsers':
                    if ($method === 'GET') {
                        //var_dump($_POST); // Para depuración
                        $this->handleGetUsers();
                    } else {
                        $this->response(['error' => 'Método no permitido para /api/GetUsers'], 405);
                    }
                break;

                case 'GetAreaUsers':
                    $this->handleGetAreaUsers();
                break;

                case 'GetTipoUsers':
                    $this->handleGetTipoUsers();
                break;

                case 'GuardarUsuarios':
                    $this->handleGuardarUsuarios();
                break;

                case 'GetRegionUsers':
                    $this->handleGetRegionUsers();
                break;

                case 'GetRegionUsersAssign':
                    $this->handleGetRegionUsersById();
                break;

                case 'EditarUsuarios':
                    $this->handleEditarUsuarios();
                break;

                case 'GetMostrarUsuarioEdit':
                $id_user = isset($_POST['id_user']) ? trim($_POST['id_user']) : '';
                    $this->handleGetMostrarUsuarioEdit($id_user);
                break;   

                case 'ModuloUsers':
                    if ($method === 'POST') {
                        //var_dump($_POST); // Para depuración
                        $this->handleGetUsersModulos();
                    } else {
                        $this->response(['error' => 'Método no permitido para /api/ModuloUsers'], 405);
                    }
                break; 

                case 'AsignacionModulo':
                    if($method === 'POST'){
                        $this->handleAsignacionModulo();
                    } else {
                        $this->response(['error' => 'Método no permitido para /api/AsignacionModulo'], 405);
                    }

                break; 
                
                case 'checkUsernameAvailability':
                    if($method === 'POST'){
                        $this->handleCheckUsernameAvailability();
                    } else {
                        $this->response(['error' => 'Método no permitido para /api/AsignacionModulo'], 405);
                    }

                break; 


                default:
                    $this->response(['error' => 'Acción no encontrada en access'], 404);
                break;
            }
        } else {
            $this->response(['error' => 'Acción no especificada en access'], 400);
        }
    }

    // Mueve aquí todas tus funciones handleSearchRif, handleSearchSerialData, etc.
    // Asegúrate de que utilicen las propiedades de la clase ($this->db, etc.)
    // Ejemplo:
    
    private function response($data, $status = 200) {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit();
    }

    private function handleLogin() {
        $username = isset($_POST['username']) ? trim($_POST['username']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';
        $password = sha1(md5($password)); // Asegúrate de que el hash sea el correcto
        $repository = new UserRepository(); // Inicializa el LoginRepository aquí
        //var_dump($username, $password); // Para depuración

        if ($username != "" && $password != "") {
            $userExists = $repository->GetUsernameUser($username);
            if ($userExists > 0) {
                $passwordMatch = $repository->GetPasswordUser($username, $password);
                if ($passwordMatch > 0) {
                    $userData = $repository->GetUserData($username, $password);
                    //var_dump($userData); // Para depuración
                    if ($userData['status'] != 3 && $userData['status'] != 4) {
                        $_SESSION["cedula"]     = $userData['cedula'];
                        $_SESSION['id_user']    = (int) $userData['id_user'];
                        $_SESSION["usuario"]    = $userData['usuario'];
                        $_SESSION["nombres"]    = $userData['nombres'];
                        $_SESSION["apellidos"]  = $userData['apellidos'];
                        $_SESSION["correo"]     = $userData['correo'];
                        $_SESSION['d_rol']      = (int) $userData['codtipousuario'];
                        $_SESSION['name_rol']   = $userData['name_rol'];
                        $_SESSION['status']     = (int) $userData['status'];
                        //var_dump($userData);
                        $session_lifetime = 1200; 
                        // Ejemplo: 1200 SEGUNDO = 20 minutos en segundos
                        // Ejemplo: 1800 SEGUNDO = 30 minutos en segundos
                        // Ejemplo: 3600 SEGUNDO = 1 hora en segundos
                        // Ejemplo: 300 SEGUNDO  = 5 minutos en segundos               
                        $_SESSION['session_lifetime'] = $session_lifetime;

                        // Regenerar el ID de sesión antes de usar session_id()
                        session_regenerate_id(true);
                        // Configurar la zona horaria a Venezuela (Caracas)
                        date_default_timezone_set('America/Caracas');
                        // Generar id_session
                        $session_id = session_id();
                        $_SESSION["session_id"] = $session_id;
                        // Obtener datos adicionales
                        $start_date = date('Y-m-d H:i:s');
                        $user_agent = $_SERVER['HTTP_USER_AGENT'];
                        $ip_address = $_SERVER['REMOTE_ADDR'];
                        $active = 1;
                        $expiry_time_unix = time() + $session_lifetime;
                        $expiry_time = date('Y-m-d H:i:s', $expiry_time_unix); // Convertir a formato DATETIME

                        // Asegúrate de que GetSession en tu modelo LoginRepository tome el id_user correctamente
                        $result9 = $repository->GetSession($session_id);
                        
                        if($result9 > 0){
                            $this->response([
                                'success' => false,
                                'message' => 'Ya existe una sesión activa para este usuario.',
                                'redirect' => 'login'
                            ], 409); // Código de estado 409 Conflict
                        } else {
                            $insertResult = $repository->InsertSession($session_id, $start_date,  $user_agent, $ip_address, $active, $expiry_time);
                            if ($insertResult) {
                                $redirectURL = '';
                                $redirectURL = 'dashboard';
                                $repository->UpdateTryPassTo0($username);
                                $this->response([
                                    'success' => true,
                                    'message' => 'Inicio de sesión exitoso',
                                    'redirect' => $redirectURL,
                                    'session_lifetime' => $_SESSION['session_lifetime'],
                                    'session_id' => $_SESSION["session_id"],
                                    'id_user' => $_SESSION['id_user']
                                ], 200);
                            } else {
                                $this->response(['error' => 'Error al guardar la información de la sesión'], 500);
                            }
                        }
                    } else {
                        $this->response(['success' => false, 'message' => 'Usuario inactivo o bloqueado'], 401);
                    }
                } else {
                    $repository->UpdateTryPass($username);
                    $attempts = $repository->GetTryPass($username);
                    if ($attempts <= 3) {
                        $this->response(['success' => false, 'message' => 'Contraseña incorrecta. Intentos restantes: ' . (3 - $attempts)], 401);
                    } else {
                        $repository->UpdateStatusTo4($username);
                        $this->response(['success' => false, 'message' => 'Usuario bloqueado por intentos fallidos'], 403);
                    }
                }
            } else {
                $this->response(['success' => false, 'message' => 'Usuario no existe'], 401);
            }
        } else {
            $this->response(['success' => false, 'message' => 'Usuario o contraseña están vacíos'], 400);
        }
    }

    function handleUsers($method, $urlSegments) {
        // var_dump($repository); // Para depuración     
        switch ($method) {
            case 'GET':
                if (isset($urlSegments[1]) && is_numeric($urlSegments[1])) {
                    $this->GetUserById($urlSegments[1]); // Obtener usuario por ID
                } else {
                    $this->getAllUsers(); // Obtener todos los usuarios
                }
                break;
            default:
                $this->response(['error' => 'Método no permitido para /api/users'], 405);
                break;
        }
    }

    function GetUserById($id) {
        $repository = new UserRepository();
        $user = $repository->GetUserById($id);
        if ($user !== null) {
            echo json_encode($user);
        } else {
            $this->response(['error' => 'Usuario no encontrado'], 404);
        }
    }

    function getAllUsers() {
        $repository = new UserRepository();
        $users = $repository->getAllUsers(); // Obtiene el array de usuarios directamente
    
        if ($users !== null) {
            echo json_encode($users);
        } else {
            $this->response(['error' => 'Error al obtener los usuarios'], 500);
        }
    }

    public function handleUsername(){
        $username = isset($_POST['username']) ? $_POST['username'] : '';
        $repository = new UserRepository(); // Inicializa el LoginRepository aquí

        if($username != '') {
            $result = $repository->GetUsernameUser($username);
            if ($result > 0) {
                $this->response(['success' => true, 'message' => 'Usuario Verificado', 'color'   => 'green']);
            }else{
                $this->response(['success' => false, 'message' => 'Usuario No Existe', 'color'=> 'red']);
            }
        }else{
            $this->response(['success' => false, 'message' => 'Campo vacíos', 'color'=> 'red']);
        }
    }

    private function handleGetUserPermissions($userId) {
        $repository = new UserRepository();
        $permissions = $repository->getUserPermissions($userId); // Implementa esta función en tu PermissionRepository
        //var_dump($permissions); // Para depuración
        if ($permissions) {
            $this->response(['success' => true, 'permissions' => $permissions], 200);
        } else {
            $this->response(['error' => 'No se encontraron permisos para el usuario'], 404);
        }
    }

    public function handleGetUsers(){
        $repository = new   UserRepository(); // Inicializa el repositorio
        $result = $repository->getAllUsers();

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'users' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay usuarios disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los usuarios'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Usuario']);
    }

    public function handleGetAreaUsers(){
        $repository = new UserRepository(); // Inicializa el repositorio
        $result = $repository->GetAreaUsers();
       // var_dump($result);
        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'area' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay coordinadores disponibles o No ha seleccionado ningun coordinador'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los coordinadores'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }

     public function handleGetTipoUsers(){
        $repository = new UserRepository(); // Inicializa el repositorio
        $result = $repository->GetTipoUsers();
       // var_dump($result);
        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'tipousers' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay coordinadores disponibles o No ha seleccionado ningun coordinador'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los coordinadores'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }

    public function handleGetRegionUsers(){
        $repository = new UserRepository(); // Inicializa el repositorio
        $result = $repository->GetRegionUsers();
       // var_dump($result);
        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'regionusers' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay coordinadores disponibles o No ha seleccionado ningun coordinador'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los coordinadores'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }

    public function handleGetRegionUsersById(){
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
        $repository = new UserRepository(); // Inicializa el repositorio
        $result = $repository->GetRegionUsersById($id_user);

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'regionusers' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay coordinadores disponibles o No ha seleccionado ningun coordinador'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los coordinadores'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Coordinador']);
    }

    public function handleGuardarUsuarios(){
        $repository = new UserRepository(); // Inicializa el repositorio
            
        $id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : '';
        $nombreusers = isset($_POST['nombreuser']) ? $_POST['nombreuser'] : '';
        $apellidousers = isset($_POST['apellidouser']) ? $_POST['apellidouser'] : '';
        $users = isset($_POST['usuario']) ? $_POST['usuario'] : '';
        $correo = isset($_POST['email']) ? $_POST['email'] : '';
        $area_users = isset($_POST['areausers']) ? $_POST['areausers'] : '';
        $tipo_users = isset($_POST['tipousers']) ? $_POST['tipousers'] : '';
        $regionusers = isset($_POST['regionusers']) ? $_POST['regionusers'] : '';
        $id_nivel = isset($_POST['id_nivel']) ? $_POST['id_nivel'] : '';
        $identificacion = isset($_POST['identificacion']) ? $_POST['identificacion'] : '';

        $result = $repository->Guardar_Usuario($id_user, $nombreusers,$apellidousers, $identificacion,$users, $correo, $area_users, $tipo_users, $regionusers, $id_nivel);
    
        if ($result) {
            $this->response(['success' => true, 'message' => 'Datos guardados con éxito.'], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al guardar los datos de la falla.'], 500);
        }
    }


    public function handleGetMostrarUsuarioEdit($id_user){
        $id_user = isset($_POST['id_user']) ? $_POST['id_user'] : '';
            
        $repository = new   UserRepository(); // Inicializa el repositorio
        $result = $repository->MostrarUsuarioEdit($id_user);

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'users' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay usuarios disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los usuarios'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Usuario']);
    }
    

    public function handleEditarUsuarios(){
        $repository = new UserRepository(); // Inicializa el repositorio
            
        $idusuario_edit = isset($_POST['idusuario_edit']) ? $_POST['idusuario_edit'] : ''; // id del usuario que se esta editando
        $edit_nombreusers = isset($_POST['edit_nombreuser']) ? $_POST['edit_nombreuser'] : '';
        $edit_apellidousers = isset($_POST['edit_apellidouser']) ? $_POST['edit_apellidouser'] : '';
        $edit_usuario = isset($_POST['usuario']) ? $_POST['usuario'] : '';
        $edit_documento = isset($_POST['edit_documento']) ? $_POST['edit_documento'] : '';
        $edit_correo = isset($_POST['edit_email']) ? $_POST['edit_email'] : '';
        $edit_area_users = isset($_POST['edit_areausers']) ? $_POST['edit_areausers'] : '';
        $edit_regionusers = isset($_POST['edit_regionusers']) ? $_POST['edit_regionusers'] : '';
        $edit_tipo_users = isset($_POST['edit_tipousers']) ? $_POST['edit_tipousers'] : '';
        $edit_idnivel = isset($_POST['edit_idnivel']) ? $_POST['edit_idnivel'] : '';
        $id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : ''; // id del usuario logueado
        //$identificacion = isset($_POST['identificacion']) ? $_POST['identificacion'] : '';

        //var_dump($edit_idnivel);

         $result = $repository->Editar_Usuario($idusuario_edit,$edit_nombreusers, $edit_apellidousers, $edit_usuario,$edit_documento,  $edit_correo,$edit_area_users,$edit_regionusers,$edit_tipo_users,$edit_idnivel,$id_user);
    
        if ($result) {
            $this->response(['success' => true, 'message' => 'Datos guardados con éxito.'], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al guardar los datos de la falla.'], 500);
        }
 }


    public function handleGetUsersModulos(){

        $id_usuario = isset($_POST['id_usuario']) ? $_POST['id_usuario'] : '';

        //var_dump($id_usuario );

        $repository = new   UserRepository(); // Inicializa el repositorio
        $result = $repository->getModuloUsers($id_usuario);

        if ($result !== false && !empty($result)) { // Verifica si hay resultados y no está vacío
            $this->response(['success' => true, 'users' => $result], 200);
        } elseif ($result !== false && empty($result)) { // No se encontraron coordinadores
            $this->response(['success' => false, 'message' => 'No hay usuarios disponibles'], 404); // Código 404 Not Found
        } else {
            $this->response(['success' => false, 'message' => 'Error al obtener los usuarios'], 500); // Código 500 Internal Server Error
        }
        $this->response(['success' => false, 'message' => 'Debe Seleccionar a un Usuario']);
    }



    public function handleAsignacionModulo(){
        $id_modulo     = isset($_POST['id_modulo']) ? $_POST['id_modulo'] : '';
        $id_usuario      = isset($_POST['id_usuario']) ? $_POST['id_usuario'] : '';
        $idcheck_value      = isset($_POST['idcheck_value']) ? $_POST['idcheck_value'] : '';

        //var_dump($id_modulo,$id_usuario,$idcheck_value);
      
        $repository = new UserRepository(); // Inicializa el repositorio
        $result = $repository->AsignacionModulo($id_modulo, $id_usuario,$idcheck_value);

        if ($result) {
            $this->response(['success' => true, 'message' => 'Datos guardados con éxito.'], 200);
        } else {
            $this->response(['success' => false, 'message' => 'Error al guardar los datos de la falla.'], 500);
        }
    }


/*public function handleCheckUsernameAvailability() {
    $username = $_POST['username'] ?? '';


    //var_dump($username);
    $repository = new UserRepository(); // Inicializa el repositorio
    $check_result  = $repository->VerificaUsuario($username);


    if (is_array($check_result) && isset($check_result['status'])) {
        if ($check_result['status'] === 'available') {
            $this->response(['available' => true, 'message' => $check_result['message']], 200);
        } elseif ($check_result['status'] === 'exists') {
            $this->response(['available' => false, 'message' => $check_result['message']], 200); // 200 OK porque la verificación fue exitosa
        } else { // status === 'error'
            $this->response(['available' => false, 'message' => $check_result['message']], 500); // Internal Server Error
        }
    } else {
        // Fallback si VerificaUsuario no devolvió el formato esperado
        error_log("VerificaUsuario no devolvió el formato esperado en handleCheckUsernameAvailability: " . print_r($check_result, true));
        $this->response(['available' => false, 'message' => 'Error interno del servidor al procesar la verificación.'], 500);
    }

}*/


public function handleCheckUsernameAvailability() {
    header('Content-Type: application/json');
    
    $nombre = $_POST['nombre'] ?? '';   // Nuevo parámetro
    $apellido = $_POST['apellido'] ?? ''; // Nuevo parámetro

    if (empty($nombre) || empty($apellido)) {
        $this->response(['available' => false, 'message' => 'Nombre o apellido vacío.', 'suggested_username' => null], 400);
    }

    $repository = new UserRepository();
    $check_result = $repository->VerificaUsuario($nombre, $apellido); // Llama con nombre y apellido

    if (is_array($check_result) && isset($check_result['status'])) {
        if ($check_result['status'] === 'available') {
            $this->response([
                'available' => true,
                'message' => $check_result['message'],
                'suggested_username' => $check_result['suggested_username']
            ], 200);
        } elseif ($check_result['status'] === 'exists') {
            $this->response([
                'available' => false,
                'message' => $check_result['message'],
                'suggested_username' => $check_result['suggested_username']
            ], 200);
        } else { // status === 'error'
            $this->response([
                'available' => false,
                'message' => $check_result['message'],
                'suggested_username' => null
            ], 500);
        }
    } else {
        error_log("VerificaUsuario no devolvió el formato esperado: " . print_r($check_result, true));
        $this->response(['available' => false, 'message' => 'Error interno al procesar la verificación.', 'suggested_username' => null], 500);
    }
}


    // ... otras funciones handleSearchSerialData, etc.
}
?>