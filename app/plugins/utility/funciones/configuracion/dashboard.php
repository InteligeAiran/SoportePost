<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */

function dashboard($val){
  $obj = new xajaxResponse('UTF-8');

  switch ($val) {
    case 'dashboard':
       $obj->addScript(" $('#dashboard-content').show(); ");
       $obj->addScript(" $('#menu-content').hide(); ");
    break;
    case 'none_dashboard':
       $obj->addScript(" $('#menu-content').show(); ");
       $obj->addScript(" $('#dashboard-content').hide(); ");
    break;
  }

  return $obj;
}

$xajax->registerFunction("dashboard");
$xajax->registerFunction("valDashboard");

?>