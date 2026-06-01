<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
// ==============================================
// Output Image using Code 128
// ==============================================
require_once ('jpgraph/jpgraph_barcode.php');

$encoder = BarcodeFactory::Create(ENCODING_CODE128);
$e = BackendFactory::Create(BACKEND_PS,$encoder);
$e->SetModuleWidth(2);
$e->SetHeight(20);
echo nl2br($e->Stroke('3125134772'));


?>
