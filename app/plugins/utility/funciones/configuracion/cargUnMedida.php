<?php
//Función()
function cargUnMedida($cont){
  $obj = new xajaxResponse('UTF-8');

  $unidad  = new unidad_medidaModel();

  $umQuery = $unidad->getByAll();
  
   if($umQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$umQuery["numRows"];$j++){
        $row = pg_fetch_array($umQuery["query"],$j);
        $html.="<option value=".$row["id_unidad_medida"].">".$row["d_unidad_medida"]."</option>";
       } 
        if ($cont === 'noCont') {
          $obj->addAssign("d_unidad_medida","innerHTML",$html);
        }else{
          $obj->addAssign("d_unidad_medida$cont","innerHTML",$html);
        } 
         
   } 
  return $obj;
}

function cargUnMCont($cont,$i){
  $obj = new xajaxResponse('UTF-8');

  $unidad  = new unidad_medidaModel();

  $umQuery = $unidad->getByAll();
  
   if($umQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$umQuery["numRows"];$j++){
        $row = pg_fetch_array($umQuery["query"],$j);
        $html.="<option value=".$row["id_unidad_medida"].">".$row["d_unidad_medida"]."</option>";
       }      
   }
   $val = $i."_".$cont;
   $obj->addAssign("d_unidad_medida$val","innerHTML",$html);

  return $obj;
}

$xajax->registerFunction("cargUnMedida");
$xajax->registerFunction("cargUnMCont");

 
?>