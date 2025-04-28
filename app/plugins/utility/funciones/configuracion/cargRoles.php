<?php
//Función()
function cargRoles($idFunc){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT rf.*,fr.*,f.* 
          FROM rol_funcional rf,funcionario_rol fr,funcionario f 
          WHERE f.id_funcionario = ".$idFunc."
          AND f.id_funcionario = fr.id_funcionario
          AND rf.id_rol_funcional = fr.id_rol_funcional
          ORDER BY fr.id_funcionario_rol ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>Roles...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_rol_funcional"].">".$row["d_rol_funcional"]."</option>";
       }  
       $obj->addAssign("rol","innerHTML",$html);
     } 
  return $obj;
}

$xajax->registerFunction("cargRoles");
 
?>