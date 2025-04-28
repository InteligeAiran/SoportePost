<?php
//Función()
function cargAnalist($val,$ruta){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  switch ($ruta) {
    case 1:
       $sql = "SELECT f.*,fr.* FROM funcionario f,funcionario_rol fr
          WHERE f.id_funcionario = fr.id_funcionario
          AND fr.id_rol_funcional = 5
          AND f.id_status = 1
          ORDER BY f.id_funcionario ASC;";
    break;
    case 2:
       $sql = "SELECT f.*,fr.* FROM funcionario f,funcionario_rol fr
          WHERE f.id_funcionario = fr.id_funcionario
          AND fr.id_rol_funcional = 5
          AND f.id_status = 1
          AND f.id_area = ".$val."
          ORDER BY f.id_funcionario ASC;";
    break;
  }
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('El área seleccionada no posee ningún funcionario'); 
       $obj->addAssign("d_analista","value",0);
       $obj->addAssign("valProcess","value",0);
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_funcionario"].">".$row["d_nombre"]." ".$row["d_apellido"]."</option>";
       }  
       $obj->addAssign("d_analista","innerHTML",$html);
       $obj->addAssign("valProcess","value",1);
     } 
  return $obj;
}

$xajax->registerFunction("cargAnalist");
 
?>