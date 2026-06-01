<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
//Función()
function statusDato(){
  $obj = new xajaxResponse('UTF-8');

  $status    = new status_datoModel();
  $stQuery   = $status->getByAll();
  
   if($stQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$stQuery["numRows"];$j++){
        $row = pg_fetch_array($stQuery["query"],$j);
        $html.="<option value=".$row["id_status"].">".$row["d_status_reg"]."</option>";
       }  
       $obj->addAssign("estatus","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("statusDato");
 
?>