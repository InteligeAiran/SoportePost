<?php
//Función()
function cargParroquia($val,$ruta){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();

  switch ($ruta) {
    case 1:
      $sql = "SELECT * FROM parroquia ORDER BY id_parroquia ASC;";
    break;
    case 2:
      $sql = "SELECT * FROM parroquia 
      WHERE id_municipio = ".$val."
      ORDER BY id_parroquia ASC;";
    break;
  }
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('El municipio asignado no posee parroquias, verifique'); 
       $obj->addAssign("d_parroquia","innerHTML","<option value='0'>SELECCIONE...</option>");
       $obj->addAssign("d_parroquia","value",0);
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_parroquia"].">".$row["d_parroquia"]."</option>";
       }  

       $obj->addAssign("d_parroquia","innerHTML",$html);
       
     }

  return $obj;
}

function asigParroquia($asig){
  $obj = new xajaxResponse('UTF-8');
  $obj->addAssign("d_parroquia","value",$asig);
  return $obj;
}

$xajax->registerFunction("cargParroquia");
$xajax->registerFunction("asigParroquia");

?>