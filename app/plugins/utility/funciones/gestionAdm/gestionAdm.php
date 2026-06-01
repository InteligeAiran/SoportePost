<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
//Función()
function aprobar($nroSol){
$obj = new xajaxResponse('UTF-8');
$db = Database::getInstance();
/*
$sql = "SELECT * FROM banco ORDER BY id_banco ASC;";
  $query = $db->pgquery($sql);
   if(!$query){
       $obj->addAlert('No Realizo la Busqueda'); 
       return $obj;
     }else{
       $num = $db->pgNumrows($query);
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_banco"].">".$row["d_banco"]."</option>";
       }  
       $obj->addAssign("bancos","innerHTML",$html);

     } 
  */ 
return $obj;
}

$xajax->registerFunction("aprobar");

?>
