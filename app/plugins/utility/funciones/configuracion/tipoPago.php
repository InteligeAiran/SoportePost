<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
//Función()
function tipoPago($cont){
$obj = new xajaxResponse('UTF-8');
$tpago  = new tipo_pagoModel();
$respuesta  = $tpago->getByTpago();

 if($respuesta["numRows"] > 0){
    $html="<option value='0'>SELECCIONE...</option>";
    for($j=0;$j<$respuesta["numRows"];$j++){
        $row = pg_fetch_array($respuesta["query"],$j);
        $html.="<option value=".$row["id_tipo_pago"].">".$row["d_tipo_pago"]."</option>";
    }  
 }else{
  $html="<option value='0'>SELECCIONE...</option>";
 }
  $obj->addAssign("tpago$cont","innerHTML",$html);
   
	return $obj;
}
$xajax->registerFunction("tipoPago");

?>
