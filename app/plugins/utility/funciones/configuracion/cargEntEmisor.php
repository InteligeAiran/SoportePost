<?php
//Función()
function cargEntEmisor($id){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT * FROM ente_emisor 
          WHERE id_pais = ".$id."
          ORDER BY id_ente_emisor ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_ente_emisor"].">".$row["d_ente_emisor"]."</option>";
       }  
       $obj->addAssign("ente_emisor","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("cargEntEmisor");
 
?>