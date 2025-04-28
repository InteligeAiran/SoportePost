<?php
//Direccionamiento para conexion a la BD
define("ROOT",dirname(dirname(__FILE__)).'/');

define("PLUGINS",dirname(dirname(__FILE__)).'/app/plugins/');
define("PUBLIC",dirname(dirname(__FILE__)).'/app/public/');
define("VIEWS",dirname(dirname(__FILE__)).'/app/views/');
define("MODELS",dirname(dirname(__FILE__)).'/app/models/');

define("FUNCTIONS",dirname(dirname(__FILE__)).'/app/plugins/utility/funciones/');
define("REPORT",dirname(dirname(__FILE__)).'/app/plugins/utility/funciones/reporte/');

define('APP','/SoportePost/'); // Ajustar la constante APP

//Banner para reportes
define("LOGOTIPO",ROOT.'app/public/images/logo_tipo.png');
define("FIRMA_CORREO", ROOT . 'app/public/img/login/firma.png');

// FIRMA CONTRALOR DE MIRANDA
define("FIRMA_MIRANDA",ROOT.'app/public/images/firmamiranda.jpeg');
//correo electronico
//USUARIO
define('USER_EMAIL', 'oticsacs@gmail.com');

//CONTRASEÑA
define('USER_PASS', 'etgsdgxxqyyukrhw');
//old pass: oticsacs*2022
//new pass: newOtic*2022

date_default_timezone_set('America/Caracas');
?>