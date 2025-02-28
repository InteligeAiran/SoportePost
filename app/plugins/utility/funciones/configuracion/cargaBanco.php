<?php
//Función()
function cargaBanco($tipo,$cont){
$obj = new xajaxResponse('UTF-8');
$banco     = new infoBancosModel();
$banco->tipo = $tipo;
$bcoQuery  = $banco->bancosUso();
 if($bcoQuery["numRows"] > 0){
    $html="<option value='0'>SELECCIONE...</option>";
    for($j=0;$j<$bcoQuery["numRows"];$j++){
        $row = pg_fetch_array($bcoQuery["query"],$j);
        $html.="<option value=".$row["id_banco"].">".$row["d_banco"]."</option>";
    }  
 }else{
  $html="<option value='0'>SELECCIONE...</option>";
 }
  
  $obj->addAssign("banco$cont","innerHTML",$html);
   
return $obj;
}

function getBanco($tipo){
$obj = new xajaxResponse('UTF-8');

$banco     = new infoBancosModel();
$banco->tipo = $tipo;
$bcoQuery  = $banco->bancosUso();

 if($bcoQuery["numRows"] > 0){
    $html="<option value='0'>SELECCIONE...</option>";
    for($j=0;$j<$bcoQuery["numRows"];$j++){
        $row = pg_fetch_array($bcoQuery["query"],$j);
        $html.="<option value=".$row["id_banco"].">".$row["d_banco"]."</option>";
    }  
 }else{
  $html="<option value='0'>SELECCIONE...</option>";
 }
  
  $obj->addAssign("bancos","innerHTML",$html);
   
return $obj;
}

$xajax->registerFunction("cargaBanco");
$xajax->registerFunction("getBanco");

?>
