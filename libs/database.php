<?php
// Ruta corregida: subir un nivel a SoportePost/, luego bajar a app/views/login/PHPMailer/
require_once __DIR__ . '/../app/views/login/PHPMailer/Exception.php';
require_once __DIR__ . '/../app/views/login/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../app/views/login/PHPMailer/SMTP.php';

Use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

define("bd_hostname", '192.168.1.5');
define("mvc_port", '5432');
define("bd_usuario", 'postgres');
define("bd_clave", 'Int3l1g3ns@.');

// DB NUEVA
define("database", 'SoportePost');


/* DB VIEJA*/
//define("database", 'soporte_postventa');

/*ENDPOINT*/
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'];
define('ENDPOINT_BASE_DYNAMIC', $protocol . $host);
define('APP_BASE_PATH', '/SoportePost/');
define('tituloPagina', 'Soporte Post Venta');
/* ENDPOINT*/ 

// config/config.php (ejemplo)
//define('UPLOAD_BASE_DIR', 'C:\\uploads_tickets\\'); // O 'C:\\uploads_tickets\\' si es tu unidad C
//define(constant_name: 'UPLOAD_BASE_DIR', 'D:\\uploads_tickets\\'); // O 'C:\\uploads_tickets\\' si es tu unidad C
define('UPLOAD_BASE_DIR', 'Documents\\SoportePost\\uploads_tickets\\'); // O 'C:\\uploads_tickets\\' si es tu unidad C

//Envio Correo 
define('SMTP_HOST', 'smtp.gmail.com');
//define('UPLOAD_BASE_DIR', 'C:Users\\Airan Bracamonte\Documents\\uploads_tickets/');
define('SMTP_AUTH', true);
define('SMTP_USERNAME', 'soporte.sistemas@inteligensa.com');
define('SMTP_PASSWORD', 'igld qnmb afzw ywgv');
define('SMTP_SECURE', 'PHPMailer::ENCRYPTION_STARTTLS');
define('SMTP_PORT', 587);
// ¡¡¡ ACTIVA LA DEPURACIÓN AL MÁXIMO !!!
define('DEBUG_EMAIL', SMTP::DEBUG_SERVER); // ESTO TE DIRÁ POR QUÉ FALLA
?>