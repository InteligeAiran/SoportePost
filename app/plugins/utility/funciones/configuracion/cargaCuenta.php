<?php
//Función()
function cargaCuenta($banco,$cont){
$obj = new xajaxResponse('UTF-8');
$cuenta    = new infoBancosModel();
$cuenta->idBan = $banco;
$bcoQuery  = $cuenta->cuentasbyBanco();

 if($bcoQuery["numRows"] > 0){
    $html="<option value='0'>SELECCIONE...</option>";
    for($j=0;$j<$bcoQuery["numRows"];$j++){
        $row = pg_fetch_array($bcoQuery["query"],$j);
        $html.="<option value=".$row["id_cuenta_bancaria"].">".$row["d_cuenta_bancaria"]."</option>";
    }  
 }else{
  $html="<option value='0'>SELECCIONE...</option>";
 }
  
  $obj->addAssign("cuenta$cont","innerHTML",$html);
   
	return $obj;
}

$xajax->registerFunction("cargaCuenta");

?>
