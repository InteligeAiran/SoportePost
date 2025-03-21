<?php
//Función()
function cargRecSoli(){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT * FROM categoria_solicitud ORDER BY id_categoria_solicitud ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_categoria_solicitud"].">".$row["d_categoria_solicitud"]."</option>";
       }  
       $obj->addAssign("d_recaudo_categoria","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("cargRecSoli");
 
?>