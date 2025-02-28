<?php
//Función()
function tipoEmpresa($cont,$caso){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();

  switch ($caso) {
      case 0: 
          $sql = "SELECT * FROM actividad_empresa 
                  ORDER BY id_actividad ASC;";
      break;
      case 1:
          $sql = "SELECT * FROM actividad_empresa 
                  WHERE id_actividad IN(2,4)
                  ORDER BY id_actividad ASC;";
      break;
  }

  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_actividad"].">".$row["d_actividad"]."</option>";
       }  
         $obj->addAssign("act_Fabr$cont","innerHTML",$html);
            } 
  return $obj;
}

$xajax->registerFunction("tipoEmpresa");
 
?>