<?php
// Ruta corregida: subir un nivel a SoportePost/, luego bajar a app/views/login/PHPMailer/
require_once __DIR__ . '/../app/views/login/PHPMailer/Exception.php';
require_once __DIR__ . '/../app/views/login/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../app/views/login/PHPMailer/SMTP.php';

Use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

//define("bd_hostname", '192.168.1.5');
define("bd_hostname", '192.168.1.20');
define("mvc_port", '5432');
/*define("mvc_port", '5433');*/
define("bd_usuario", 'postgres');
define("bd_clave", 'Int3l1punt0.VEN');
//define("bd_clave", 'Int3l1g3ns@.');

/*define("bd_hostname", '192.168.1.20');
define("mvc_port", '5432');
define("bd_usuario", 'postgres');
define("bd_clave", 'Int3l1punt0.VEN');*/

// DB NUEVA
/*define("database", 'DBsoportepost0608');*/

define("database", 'SoportePost');

/* DB VIEJA*/
//define("database", 'soporte_postventa');

/*ENDPOINT*/
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'];
define('HOST', $host);
define('ENDPOINT_BASE_DYNAMIC', $protocol . $host);
define('APP_BASE_PATH', '/SoportePost/');
define('tituloPagina', value: 'Soporte Post Venta');

define('UPLOAD_BASE_DIR', 'C:\Documentos_SoportePost\\');
//define('UPLOAD_BASE_DIR', 'G:\Documentos_SoportePost\\');

//Envio Correo 
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_AUTH', true);
define('SMTP_USERNAME', 'soporte.sistemas@inteligensa.com');
define('SMTP_PASSWORD', 'igqq foym bqhf kqrs');
define('SMTP_SECURE', 'PHPMailer::ENCRYPTION_STARTTLS');
define('SMTP_PORT', 587);
// ¡¡¡ ACTIVA LA DEPURACIÓN AL MÁXIMO !!!
define('DEBUG_EMAIL', SMTP::DEBUG_SERVER); // ESTO TE DIRÁ POR QUÉ FALLA
?>
