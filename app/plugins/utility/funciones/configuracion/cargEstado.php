<?php
//Función()
function cargEstado($val,$ruta){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();

  switch ($ruta) {
    case 1:
      $sql = "SELECT * FROM estado ORDER BY id_estado ASC;";
    break;
    case 2:
      $sql = "SELECT * FROM estado 
      WHERE id_pais = ".$val."
      ORDER BY id_estado ASC;";
    break;
  }

  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('El país seleccionado no posee estados, verifique'); 
       $obj->addAssign("d_estado","innerHTML","<option value='0'>SELECCIONE...</option>");
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_estado"].">".$row["d_estado"]."</option>";
       }  
       $obj->addAssign("d_estado","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("cargEstado");
 
?>