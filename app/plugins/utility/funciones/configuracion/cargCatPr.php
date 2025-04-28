<?php
//Función()
function cargCatPr(){
$obj = new xajaxResponse('UTF-8');
$db = Database::getInstance();
$sql = "SELECT * FROM categoria_producto ORDER BY id_categoria_prod ASC;";
  $query = $db->pgquery($sql);
   if(!$query){
       $obj->addAlert('No Realizo la Busqueda'); 
       return $obj;
     }else{
       $num = $db->pgNumrows($query);
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_categoria_prod"].">".$row["d_categoria_prod"]."</option>";
       }  
       $obj->addAssign("d_categoria_prod","innerHTML",$html);
     } 
   
return $obj;
}

$xajax->registerFunction("cargCatPr");

?>
