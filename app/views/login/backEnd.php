<?php
/*use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . "/../login/PHPMailer/PHPMailer.php";
require_once __DIR__ . "/../login/PHPMailer/Exception.php"; 
require_once __DIR__ . "/../login/PHPMailer/SMTP.php"; 

require_once __DIR__ . "/../../../vendor/autoload.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../../models/loginModel.php";
require_once __DIR__ . "/../../../libs/database_cn.php";
require_once __DIR__ . "/../../../libs/session.php";

session_start(); // Inicia la sesión

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    $model = new loginModel();

    $response = ['success' => false, 'message' => 'Acción no válida']; // Inicialización predeterminada

    switch ($action) {
        case 'login':
            $username = $_POST['username'];
            $password = $_POST['password'];

            if ($username != '' && $password != '') {
                $result = $model->GetUsernameUser($username);
                if ($result && $result['numRows'] > 0) {
                    $result1 = $model->GetPasswordUser($username, $password);
                    if ($result1 && $result1['numRows'] > 0) {
                        // Contraseña correcta
                        $result = $model->GetUserData($username, $password);
                        $func = $result['row'];
                        if ($func['status'] != 3 && $func['status'] != 4) { // Verifica el estado antes de permitir el acceso
                            $_SESSION["cedula"]    = $func['cedula'];
                            $_SESSION['id_user']   = (int) $func['id_user'];
                            $_SESSION["usuario"]   = $func['usuario'];
                            $_SESSION["nombres"]   = $func['nombres'];
                            $_SESSION["apellidos"] = $func['apellidos'];
                            $_SESSION["correo"]    = $func['correo'];
                            $_SESSION['d_rol']     = (int) $func['codtipousuario'];
                            $_SESSION['status']    = (int) $func['status'];

                            switch ($func['codtipousuario']) {
                                /* SuperAdmin */
/*case 1:
                                    $response = [
                                        'success' => true,
                                        'message' => 'Bienvenido',
                                        'redirect' => 'dashboard'
                                    ];
                                   
                                break;
                                
                                /* Tecnico */
/*case 2:
                                    $session_lifetime = 1200;// Ejemplo: 30 minuto = 1800 en segundos
                                                             //          10 minuto = 600  en segundos
                                                             //          20 minutos = 1200 en segundo
                                    $_SESSION['session_lifetime'] = $session_lifetime;
                                    
                                    $response = [
                                        'success' => true,
                                        'message' => 'Bienvenido',
                                        'redirect' => 'dashboard2',
                                        'session_lifetime' =>  $_SESSION['session_lifetime']
                                    ];  

                                    // Regenerar el ID de sesión antes de usar session_id()
                                    session_regenerate_id(true);
                                    // Configurar la zona horaria a Venezuela (Caracas) 
                                    date_default_timezone_set('America/Caracas');
                                    // Generar id_session
                                    $session_id = session_id();

                                    $_SESSION["session_id"] = session_id();
                                    // Obtener datos adicionales
                                    $start_date = date('Y-m-d H:i:s');
                                    $user_agent = $_SERVER['HTTP_USER_AGENT'];
                                    $ip_address = $_SERVER['REMOTE_ADDR'];
                                    $active = 1;
                                    $expiry_time_unix = time() + $session_lifetime;
                                    $expiry_time = date('Y-m-d H:i:s', $expiry_time_unix); // Convertir a formato DATETIME
        
                                    $result9 = $model->GetSession($func['id_user'], $session_id);
                                    //var_dump($result9);
                                    if($result9 && $result9['numRows'] > 0){
                                        $response = [
                                            'success' => false,
                                            'message' => 'ya existe una sesión activa.',
                                            'redirect' => 'login'
                                        ];
                                    } else {
                                        $model->InsertSession($session_id, $start_date, $func['id_user'], $user_agent, $ip_address, $active, $expiry_time);
                                    }
                                break;
                                  
                                /* Coordinador*/
                               /* case 3;
                                    $response = [
                                        'success' => true,
                                        'message' => 'Bienvenido',
                                        'redirect' => 'dashboard3'
                                    ];
                                    $result9 = $model->GetSession($func['id_user'], $session_id);
                                    //var_dump($result9);
                                    if($result9 && $result9['numRows'] > 0){
                                        $response = [
                                            'success' => false,
                                            'message' => 'ya existe una sesión activa.',
                                            'redirect' => 'login'
                                        ];
                                    } else {
                                        $model->InsertSession($session_id, $start_date, $func['id_user'], $user_agent, $ip_address, $active, $expiry_time);
                                    }
                                break;

                                /* Gestion Comerical*/
                                /*case 4;
                                    $response = [
                                        'success' => true,
                                        'message' => 'Bienvenido',
                                        'redirect' => 'dashboard4'
                                    ];
                                break;

                                /* Administracion*/
                               /* case 4;
                                    $response = [
                                        'success' => true,
                                        'message' => 'Bienvenido',
                                        'redirect' => 'dashboard5'
                                    ];
                                break;
                                
                            }
        
                        } else {
                            $response = [
                                'success' => false,
                                'message' => 'No se puede ingresar, el usuario está inactivo o bloqueado'
                            ];
                        }
                    } else {
                        // Contraseña incorrecta
                        $model->UpdateTryPass($username); // Incrementa el contador de intentos fallidos
                        $result2 = $model->GetTryPass($username);
                        if ($result2 && isset($result2['numRows']) && $result2['numRows'] > 0 && isset($result2['row'])) {
                            $fila = $result2['row'];
                            if (isset($fila['trying_failedpassw'])) {
                                $intentos = $fila['trying_failedpassw'];
                                if ($intentos <= 3) {
                                    $response = [
                                        'success' => false,
                                        'message' => 'Contraseña incorrecta. Intentos restantes: ' . (3 - $intentos)
                                    ];
                                } else {
                                    $model->UpdateStatusTo4($username); // Bloquea el usuario
                                    $response = [
                                        'success' => false,
                                        'message' => 'Usuario bloqueado por intentos fallidos'
                                    ];
                                }
                            } else {
                                $response = [
                                    'success' => false,
                                    'message' => 'Error: Intentos no encontrados'
                                ];
                            }
                        } else {
                            $response = [
                                'success' => false,
                                'message' => 'Error: Datos de intentos no válidos'
                            ];
                        }
                    }
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Usuario no existe'
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
                        'message' => 'Usuario Verificado',
                        'color'   => 'green'
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Usuario No existe',
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
                        'message' => 'La clave coincide con el usuario', 
                        'color'   => 'green'
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'No coincide con el usuario',
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

        case 'checkEmail': 
            $email = $_POST['email'];
            if ($email != '') {
                $result = $model->GetEmailUser($email);
                if ($result && $result['numRows'] > 0) {
                    $response = [
                        'success' => true,
                        'message' => 'Correo Verificado', 
                        'color'   => 'green'
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Correo No Existe',
                        'color'=> 'red'
                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Campo vacíos',
                    'color'=> 'red'
                ];
            }        
        break;

        case 'SendEmail':
            $email = $_POST['email'];
            if ($email != '') {
                $result  = $model->GetEmailUser($email);
                $nombres = $result['row']['nombre_completo'];
                if ($result && $result['numRows'] > 0) {
                    // Generar código
                    $longitud = 6;
                    $caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    $codigo = '';
                    for ($i = 0; $i < $longitud; $i++) {
                        $codigo .= $caracteres[rand(0, strlen($caracteres) - 1)];
                    }
                    // Configuración de PHPMailer
                    $mail = new PHPMailer(true); /*SMTP::DEBUG_OFF;*/

                    /*try { 
                        // Configuración del servidor SMTP
                        $mail->SMTPDebug  = SMTP::DEBUG_OFF; // Habilita la depuración (opcional)
                        $mail->isSMTP();
                        $mail->Host       = SMTP_HOST;
                        $mail->SMTPAuth   = SMTP_AUTH;
                        $mail->Username   = SMTP_USERNAME;
                        $mail->Password   = SMTP_PASSWORD;
                        $mail->SMTPSecure = SMTP_SECURE;
                        $mail->Port       = SMTP_PORT;

                        // Remitente y destinatario
                        $mail->setFrom(SMTP_USERNAME, 'SOPORTE POST-VENTA INTELIGENSA');
                        $mail->addAddress($email); // Asume que $result['nombre'] contiene el nombre del usuario
                        // Contenido del correo
                        $mail->isHTML(true); // O true si quieres enviar HTML
                        $mail->CharSet = 'UTF-8';

                        $mail->Subject = 'Restablece tu contraseña';
                        // Adjuntar la imagen
                        $mail->addEmbeddedImage('../../public/img/login/firma.png', 'imagen_adjunta');
                        $mail->Body    = '
                        <h2 style = "color: #3f85ff; font-size: 23px; text-align: center; margin-bottom: 20px;">Restablecer Contraseña</h2>
                        <strong><p style = " margin-bottom: 15px;">Hola, '.$nombres.'</p></strong>
                        <strong><p>Recibimos una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, puedes ignorar este correo.</p></strong>
                        <strong><p>Para restablecer tu contraseña, utiliza el siguiente código: <span style = "background-color: #3f85ff; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 3.2em; text-align: center; margin: 22px auto; width: 200px; height: 50px; display: block; width: fit-content; border: 1px solid #000000;" class = "code">'.$codigo.'</span></p><strong>
                        <p style = "text-align: center; color: red; font-size: 0.9em;">Este código será su contraseña. Cambie nuevamente al iniciar Sesión.</p>
                        <p style = "text-align: center; color: #777; font-size: 0.9em;">ATT: InteliSoft</p>
                        <img src="cid:imagen_adjunta" alt="Logo de la empresa" style="display: block; margin: 0 auto; width: 150px;">';
                        $mail->send();
                        $result2 = $model->ChangePassForCode($codigo, $email);
                        $result3 = $model->UpdateStatusTo1($email);
                        $result4 = $model->UpdateTimePass($email);
                        $response = [
                            'success' => true,
                            'message' => 'contraseña enviada. Revisa tu correo.',
                            'color' => 'green'
                        ];
                    } catch (Exception $e) {
                        $response = [
                            'success' => false,
                            'message' => 'Error al enviar el correo: ' . $mail->ErrorInfo,
                            'color' => 'red'
                        ];
                    }
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Correo no encontrado.',
                        'color' => 'red'
                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Campo vacío.',
                    'color' => 'red'
                ];
            }
        break;
    }
header('Content-Type: application/json');
echo json_encode($response);
exit;
}*/
?>