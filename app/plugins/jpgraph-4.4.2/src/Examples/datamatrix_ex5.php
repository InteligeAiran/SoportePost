<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
require_once('jpgraph/datamatrix/datamatrix.inc.php');

$data = 'This is a 20x20 symbol';

// Create and set parameters for the encoder
$encoder = DatamatrixFactory::Create(DMAT_20x20);
$encoder->SetEncoding(ENCODING_TEXT);

// Create the image backend (default)
$backend = DatamatrixBackendFactory::Create($encoder);

// By default the module width is 2 pixel so we increase it a bit
$backend->SetModuleWidth(4);

// Set Quiet zone
$backend->SetQuietZone(10);

// Set other than default colors (one, zero, quiet zone/background)
$backend->SetColor('navy','white','lightgray');

// Create the barcode from the given data string and write to output file
try {
    $backend->Stroke($data);
} catch (Exception $e) {
    $errstr = $e->GetMessage();
    echo "Datamatrix error message: $errstr\n";
}

?>
