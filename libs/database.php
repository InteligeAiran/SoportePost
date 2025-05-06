<?php
//Conexion a la Base de Datos 
define("bd_hostname", '127.0.0.1');
define("mvc_port", '5432');
define("bd_usuario", 'postgres');
define("bd_clave", 'Airan1234');

// DB NUEVA
define("database", 'SoportePost');


/* DB VIEJA*/
//define("database", 'soporte_postventa');

/*ENDPOINT*/
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'];
define('ENDPOINT_BASE_DYNAMIC', $protocol . $host);
define('APP_BASE_PATH', '/SoportePost/');
/* ENDPOINT*/ 



//Envio Correo 
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_AUTH', true);
define('SMTP_USERNAME', 'soporte.sistemas@inteligensa.com');
define('SMTP_PASSWORD', 'igld qnmb afzw ywgv');
define('SMTP_SECURE', 'PHPMailer::ENCRYPTION_STARTTLS');
define('SMTP_PORT', 587);
?>