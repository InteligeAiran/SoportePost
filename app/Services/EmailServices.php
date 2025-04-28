<?php

namespace App\Services;

// Incluye el archivo donde están definidas las constantes de configuración
require_once __DIR__ . '/../../libs/database.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService
{
    private $mailerConfig;

    public function __construct(array $config = [])
    {
        // Configuración por defecto
        $defaultConfig = [
            'host' => SMTP_HOST ?? '',
            'auth' => SMTP_AUTH ?? false,
            'username' => SMTP_USERNAME ?? '',
            'password' => SMTP_PASSWORD ?? '',
            'secure' => SMTP_SECURE ?? '',
            'port' => SMTP_PORT ?? 587,
            'from_email' => SMTP_USERNAME ?? '',
            'from_name' => 'SOPORTE POST-VENTA INTELIGENSA', // Puedes hacerlo configurable
            'debug' => SMTP::DEBUG_OFF,
        ];

        // Combinar la configuración por defecto con la proporcionada
        $this->mailerConfig = array_merge($defaultConfig, $config);
    }

    public function sendEmail(string $toEmail, string $subject, string $body, array $attachments = [], array $embeddedImages = []): bool
    {
        $mail = new PHPMailer(true);

        try {
            // Configuración del servidor SMTP
            $mail->SMTPDebug = $this->mailerConfig['debug'];
            $mail->isSMTP();
            $mail->Host = $this->mailerConfig['host'];
            $mail->SMTPAuth = $this->mailerConfig['auth'];
            $mail->Username = $this->mailerConfig['username'];
            $mail->Password = $this->mailerConfig['password'];
            $mail->SMTPSecure = $this->mailerConfig['secure'];
            $mail->Port = $this->mailerConfig['port'];
            $mail->CharSet = 'UTF-8';

            // Remitente
            $mail->setFrom($this->mailerConfig['from_email'], $this->mailerConfig['from_name']);

            // Destinatario
            $mail->addAddress($toEmail);

            // Contenido del correo
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;

            // Adjuntos
            foreach ($attachments as $path => $name) {
                $mail->addAttachment($path, $name);
            }

            // Imágenes embebidas
            foreach ($embeddedImages as $cid => $path) {
                $mail->addEmbeddedImage($path, $cid);
            }

            $mail->send();
            return true;

        } catch (Exception $e) {
            error_log('Error al enviar el correo: ' . $mail->ErrorInfo);
            return false;
        }
    }
}