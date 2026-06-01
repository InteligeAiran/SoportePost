<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
    // Example 7 : QR Barcode with multiple manually specified encodation schemas
    // (Note: Normally there would be no need to ever use manually specified encodation)

    // Include the library
    require_once ('jpgraph/QR/qrencoder.inc.php');

    // Data to be encoded
    $data = array(
        array(QREncoder::MODE_ALPHANUM,'01234567'),
        array(QREncoder::MODE_NUMERIC,'89012345')
    );

    // Create a new instance of the encoder (automatically determined QR version and
    // error correction level)
    $encoder = new QREncoder();

    // Use the image backend
    $backend = QRCodeBackendFactory::Create($encoder, BACKEND_IMAGE);

    // Set the module size
    $backend->SetModuleWidth(4);

    // Store the barcode in the specifed file
    $backend->Stroke($data);
?>
