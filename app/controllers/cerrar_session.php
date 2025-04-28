<?php
require_once __DIR__ . "/../../libs/session.php";
session_start();

class cerrar_session extends Controller {

    function __construct() {
        parent::__construct();
    }

    function index() {
        // Asegurarse de que el modelo usuarioModel esté cargado
        Model::exists('login');

        // Iniciar la sesión
        Session::init();

        // Obtener el ID del usuario de la sesión
        $usuario_id = Session::get('id_user');

        // Obtener el id_session de la sesión actual
        $session_id = session_id();
        //var_dump($usuario_id); // Verifica el ID del usuario


        // Actualizar la columna 'active' en la base de datos usando usuarioModel
        if ($usuario_id) {
            $this->UpdateSession($usuario_id,  $session_id);
        }

        // Destruir la sesión
        Session::destroy();

        // Redirigir al login
        header('Location: ' . self::getURL());
        exit;
    }

    private function UpdateSession($usuario_id,  $session_id) {
        // Crear una instancia de usuarioModel
        require_once 'app/models/loginModel.php'; // Asegurar que el modelo esté incluido
        $usuarioModel = new loginModel();

        // Llamar al método en usuarioModel para actualizar el estado del usuario
        $usuarioModel->UpdateSession($usuario_id,  $session_id);
    }

}
?>