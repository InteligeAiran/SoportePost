<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
// xulServer.php demonstrates a XUL application with xajax
// XUL will only work in Mozilla based browsers like Firefox
// using xajax version 0.2
// http://xajaxproject.org

require_once("../../xajax.inc.php");

function test() {
        $objResponse = new xajaxResponse();
        $objResponse->addAlert("hallo");
        $objResponse->addAssign('testButton','label','Success!');
        return $objResponse->getXML();
}

$xajax = new xajax();
$xajax->registerFunction("test");
$xajax->processRequests();
?>