<?php
//Función()
function cargSector(){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT * FROM sector ORDER BY id_sector ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_sector"].">".$row["d_sector"]."</option>";
       }  
       $obj->addAssign("d_sector","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("cargSector");
 
?>