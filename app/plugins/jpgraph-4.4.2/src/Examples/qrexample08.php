<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
    // Example 8 : QR Barcode with data read from file

    // Include the library
    require_once ('jpgraph/jpgraph.php');
    require_once ('jpgraph/QR/qrencoder.inc.php');

    $readFromFilename = 'qr-input.txt';

    // Create a new instance of the encoder and let the library
    // decide a suitable QR version and error level
    $encoder=new QREncoder();

    // Use the image backend
    $backend=QRCodeBackendFactory::Create($encoder, BACKEND_IMAGE);

    // Set the module size (quite big)
    $backend->SetModuleWidth(5);

    // .. send the barcode back to the browser for the data in the file
    $backend->StrokeFromFile($readFromFilename);
?>
