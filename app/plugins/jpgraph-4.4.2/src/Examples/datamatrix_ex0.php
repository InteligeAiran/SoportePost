<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
require_once('jpgraph/datamatrix/datamatrix.inc.php');

$data = 'The first datamatrix';
$encoder = DatamatrixFactory::Create();
$encoder->SetEncoding(ENCODING_ASCII);
$backend = DatamatrixBackendFactory::Create($encoder);

// We increase the module width to 3 pixels
$backend->SetModuleWidth(3);

try {
    $backend->Stroke($data);
} catch (Exception $e) {
    echo 'Datamatrix error: '.$e->GetMessage()."\n";
    exit(1);
}
?>
