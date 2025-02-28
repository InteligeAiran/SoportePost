<?php
//Función()
function cargRecaudo(){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT * FROM recaudo ORDER BY id_recaudo ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_recaudo"].">".$row["d_recaudo"]."</option>";
       }  
       $obj->addAssign("d_recaudo_solicitud","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("cargRecaudo");
 
?>