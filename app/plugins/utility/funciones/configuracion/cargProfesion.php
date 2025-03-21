<?php
//Función()
function cargProfesion(){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT * FROM profesion ORDER BY id_profesion ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_profesion"].">".$row["d_profesion"]."</option>";
       }  
       $obj->addAssign("d_profesion","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("cargProfesion");
 
?>