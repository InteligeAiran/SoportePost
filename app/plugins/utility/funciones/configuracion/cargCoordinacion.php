<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
//Función()
function cargCoordinacion($val,$ruta){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  switch ($ruta) {
    case 1:
      $sql = "SELECT * FROM coordinacion 
          ORDER BY id_coordinacion ASC;";
    break;
    case 2:
      $sql = "SELECT * FROM coordinacion 
          WHERE id_area = ".$val."
          ORDER BY id_coordinacion ASC;";
    break;
  }

  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
   if(!$num > 0){
       $obj->addAlert('El área seleccionada no posee coordinación'); 
       $html="<option value='0'>SELECCIONE...</option>";
       $obj->addAssign("d_coordinacion","innerHTML",$html);
       $obj->addAssign("d_coordinacion","value",0);
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_coordinacion"].">".$row["d_coordinacion"]."</option>";
       }  
       $obj->addAssign("d_coordinacion","innerHTML",$html);
   } 
  return $obj;
}

$xajax->registerFunction("cargCoordinacion");
 
?>