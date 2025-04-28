<?php
//Función()
function cargTip_Prod(){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT * FROM tipo_producto ORDER BY id_tipo_prod ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_tipo_prod"].">".$row["d_tipo_prod"]."</option>";
       }  
       $obj->addAssign("d_tipo_prod","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("cargTip_Prod");
 
?>