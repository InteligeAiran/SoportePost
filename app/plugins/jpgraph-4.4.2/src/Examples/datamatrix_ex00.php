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
$backend = DatamatrixBackendFactory::Create($encoder);
$backend->Stroke($data);
?>
