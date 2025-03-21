<?php
//Función()
function CargTipo_Rechazo(){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT * 
            FROM tipo_rechazo 
        ORDER BY id_tipo_rechazo ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_tipo_rechazo"].">".$row["n_tipo_rechazo"]."</option>";
       }  
       $obj->addAssign("d_tipo_rechazo","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("CargTipo_Rechazo");
 
?>