<?php

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