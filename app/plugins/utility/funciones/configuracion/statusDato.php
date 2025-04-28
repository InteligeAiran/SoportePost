<?php
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