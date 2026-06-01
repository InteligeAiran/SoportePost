<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
// ==============================================
// Output Image using Code Interleaved 2 of 5
// ==============================================
require_once ('jpgraph/jpgraph_barcode.php');

$encoder = BarcodeFactory::Create(ENCODING_CODEI25);
$e = BackendFactory::Create(BACKEND_IMAGE,$encoder);
$e->SetModuleWidth(2);
$e->Stroke('1234');

?>
