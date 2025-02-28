<?php
//Función()
function cargMunicipio($val,$ruta){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();

  switch ($ruta) {
    case 1:
      $sql = "SELECT * FROM municipio ORDER BY id_municipio ASC;";
    break;
    case 2:
      $sql = "SELECT * FROM municipio 
      WHERE id_estado = ".$val."
      ORDER BY id_municipio ASC;";
    break;
  }

  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('El estado asignado no posee municipio, verifique'); 
       $obj->addAssign("d_municipio","innerHTML","<option value='0'>SELECCIONE...</option>");
       $obj->addAssign("d_municipio","value",0);
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_municipio"].">".$row["d_municipio"]."</option>";
       }  
       
       $obj->addAssign("d_municipio","innerHTML",$html);
      
     }

  return $obj;
} 

function asigMunicipio($asig){
  $obj = new xajaxResponse('UTF-8');
  $obj->addAssign("d_municipio","value",$asig);
  return $obj;
}


$xajax->registerFunction("cargMunicipio");
$xajax->registerFunction("asigMunicipio");

?>