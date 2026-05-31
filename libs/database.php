<?php
/**
 * SoportePost - Sistema de Gestión de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raíz del proyecto
 */

// --- Cargar variables de entorno ---
require_once __DIR__ . '/EnvLoader.php';

try {
    EnvLoader::load(__DIR__ . '/../.env');
} catch (RuntimeException $e) {
    // Error crítico: sin .env la app no puede funcionar
    http_response_code(500);
    die(
        "<h2 style='font-family:sans-serif;color:#c0392b;'>Error de Configuración</h2>" .
        "<p style='font-family:sans-serif;'>" . htmlspecialchars($e->getMessage()) . "</p>"
    );
}

// --- Autoload de Composer ---
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

// --- Constantes de Base de Datos ---
define('bd_hostname', EnvLoader::get('DB_HOSTNAME', '127.0.0.1'));
define('mvc_port',   EnvLoader::get('DB_PORT',     '5432'));
define('bd_usuario', EnvLoader::get('DB_USUARIO',  'postgres'));
define('bd_clave',   EnvLoader::get('DB_CLAVE'));
define('database',   EnvLoader::get('DB_NOMBRE',   'SoportePost'));

// --- Constantes de Archivos ---
define('UPLOAD_BASE_DIR', EnvLoader::get('UPLOAD_BASE_DIR', 'C:\\Documentos_SoportePost\\'));

// --- Constantes de Correo ---
define('SMTP_HOST',     EnvLoader::get('SMTP_HOST',     'smtp.gmail.com'));
define('SMTP_AUTH',     filter_var(EnvLoader::get('SMTP_AUTH', 'true'), FILTER_VALIDATE_BOOLEAN));
define('SMTP_USERNAME', EnvLoader::get('SMTP_USERNAME'));
define('SMTP_PASSWORD', EnvLoader::get('SMTP_PASSWORD'));
define('SMTP_SECURE',   EnvLoader::get('SMTP_SECURE',   'tls'));
define('SMTP_PORT',     (int) EnvLoader::get('SMTP_PORT', 587));
define('DEBUG_EMAIL',   SMTP::DEBUG_OFF); // Cambiar a SMTP::DEBUG_SERVER para depurar

// --- Control de Depuración y Errores ---
define('APP_DEBUG', filter_var(EnvLoader::get('APP_DEBUG', 'false'), FILTER_VALIDATE_BOOLEAN));

if (APP_DEBUG) {
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    ini_set('display_startup_errors', '0');
    error_reporting(0);
}

// --- Endpoint y Protocolo ---
$protocol = 'http://';
if (
    (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ||
    (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
    (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'soportepost.intelipunto.com') !== false)
) {
    $protocol = 'https://';
}

$host = $_SERVER['HTTP_HOST'] ?? 'localhost';

define('HOST',                 $host);
define('ENDPOINT_BASE_DYNAMIC', $protocol . $host);
define('APP_BASE_PATH',         APP);
define('tituloPagina',          'Soporte Post Venta');
?>
