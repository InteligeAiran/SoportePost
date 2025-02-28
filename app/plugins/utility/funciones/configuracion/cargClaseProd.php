<?php
//Función()
function cargClaseProd($val,$ruta){
  $obj = new xajaxResponse('UTF-8');

  $clase  = new clase_productoModel();

  switch ($ruta) {
    case 1:
      $clQuery = $clase->getByAll();
    break;
    case 2:
      $clase->tipClas  = $val;
      $clQuery = $clase->getByTipClase();
    break;
  }

   if($clQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$clQuery["numRows"];$j++){
        $row = pg_fetch_array($clQuery["query"],$j);
        $html.="<option value=".$row["id_clase_prod"].">".$row["d_clase_prod"]."</option>";
       }  
       $obj->addAssign("d_clase","innerHTML",$html);
     }else{
      $obj->addAssign("d_clase","innerHTML","<option value='0'>SELECCIONE...</option>");
      $obj->addAssign("d_subclase","innerHTML","<option value='0'>SELECCIONE...</option>");
     } 
  return $obj;
}

$xajax->registerFunction("cargClaseProd");
 
?>