<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
// thewall.php, thewall.common.php, thewall.server.php
// demonstrate a demonstrates a xajax implementation of a graffiti wall
// using xajax version 0.2
// http://xajaxproject.org

require_once ("../../xajax.inc.php");

$xajax = new xajax("thewall.server.php");
$xajax->registerFunction("scribble");
$xajax->registerFunction("updateWall");
?>