<?php
//Función()
function cargSubCProd($val,$ruta){
  $obj = new xajaxResponse('UTF-8');

  $subclase  = new subclase_productoModel();

  switch ($ruta) {
    case 1:
      $suQuery   = $subclase->getByAll();
    break;
    case 2:
      $subclase->clasPro  = $val;
      $suQuery   = $subclase->getByIDclaPro();
    break;
  }

  if($suQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$suQuery["numRows"];$j++){
        $row = pg_fetch_array($suQuery["query"],$j);
        $html.="<option value=".$row["id_subclase_prod"].">".$row["d_subclase_prod"]."</option>";
       }    
       $obj->addAssign("d_subclase","innerHTML",$html);
     }else{
      $obj->addAssign("d_subclase","innerHTML","<option value='0'>SELECCIONE...</option>");
     } 
  return $obj;
}

$xajax->registerFunction("cargSubCProd");
 
?>