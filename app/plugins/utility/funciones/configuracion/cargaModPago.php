<?php
//Función()
function cargaModPago($cont){
$obj = new xajaxResponse('UTF-8');
$modo      = new modPagoModel();
$pgoQuery  = $modo->getByAll();
 if($pgoQuery["numRows"] > 0){
    $html="<option value='0'>SELECCIONE...</option>";
    for($j=0;$j<$pgoQuery["numRows"];$j++){
        $row = pg_fetch_array($pgoQuery["query"],$j);
        $html.="<option value=".$row["id_modo_pago"].">".$row["d_modo_pago"]."</option>";
    }  
 }else{
  $html="<option value='0'>SELECCIONE...</option>";
 }
  
  $obj->addAssign("modo$cont","innerHTML",$html);
   
return $obj;
}

$xajax->registerFunction("cargaModPago");

?>
