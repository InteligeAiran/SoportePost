<?php
//Función()
function TipoMaterial(){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT * FROM cambio_cont_neto ORDER BY id_cambio_cont ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_cambio_cont"].">".$row["d_envase_anterior"].">".$row["n_contenido_anterior"].">".$row["id_unidad_anterior"]."</option>";
       }  
       $obj->addAssign("material_envase","innerHTML",$html);
       $obj->addAssign("forma_env","innerHTML",$html);
       $obj->addAssign("cont_neto","innerHTML",$html);
       $obj->addAssign("uni_med","innerHTML",$html);

     } 
  return $obj;
}

$xajax->registerFunction("TipoMaterial");
 
?>