<?php
//Función()
function cargTipClase($val,$ruta){
  $obj = new xajaxResponse('UTF-8');

  $tipClase  = new tipo_claseModel();

  switch ($ruta) {
    case 1:
      $tcQuery   = $tipClase->getByAll();
    break;
    case 2:
      
    break;
  }

   if($tcQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$tcQuery["numRows"];$j++){
        $row = pg_fetch_array($tcQuery["query"],$j);
        $html.="<option value=".$row["id_tip_clase"].">".$row["d_tip_clase"]."</option>";
       }  
       $obj->addAssign("t_clase","innerHTML",$html);
     }else{
      $obj->addAssign("d_clase","innerHTML","<option value='0'>SELECCIONE...</option>");
      $obj->addAssign("d_subclase","innerHTML","<option value='0'>SELECCIONE...</option>");
     } 
  return $obj;
}

$xajax->registerFunction("cargTipClase");
 
?>