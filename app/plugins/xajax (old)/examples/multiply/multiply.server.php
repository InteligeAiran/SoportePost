<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
// multiply.php, multiply.common.php, multiply.server.php
// demonstrate a very basic xajax implementation
// using xajax version 0.2
// http://xajaxproject.org

function multiply($x, $y)
{
	$objResponse = new xajaxResponse();
	$objResponse->addAssign("z", "value", $x*$y);
	return $objResponse;
}

require("multiply.common.php");
$xajax->processRequests();
?>