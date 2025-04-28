<?php
//Conexion a la Base de Datos 
define("bd_hostname", '127.0.0.1');
define("mvc_port", '5433');
define("bd_usuario", 'postgres');
define("bd_clave", '1234');

// DB NUEVA
define("database", 'SoportePost');


/* DB VIEJA*/
//define("database", 'soporte_postventa');

//Envio Correo 
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_AUTH', true);
define('SMTP_USERNAME', 'soporte.sistemas@inteligensa.com');
define('SMTP_PASSWORD', 'igld qnmb afzw ywgv');
define('SMTP_SECURE', 'PHPMailer::ENCRYPTION_STARTTLS');
define('SMTP_PORT', 587);
?>