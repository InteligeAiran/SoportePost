<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
//Función()
function cargTipoPersona($case){
  $obj = new xajaxResponse('UTF-8');

  $tipo_personaModel = new tipo_personaModel();

  $result = $tipo_personaModel->getByAll();

  if($result['numRows'] > 0){

    $html="<option value='0'>SELECCIONE...</option>";
      for($j=0;$j<$result['numRows'];$j++){
        $row = pg_fetch_array($result['query'],$j);
        $html.="<option value=".$row["id_tipo_persona"].">".$row["d_tipo_persona"]."</option>";
     }//endFor 

   }else{
       $html="<option value='0'>SELECCIONE...</option>";
     }

  switch ($case) {
    case 1:
      $obj->addAssign("tipo_persona","innerHTML",$html);
    break;
    
    default:
      // code...
      break;
  }

  return $obj;
}

$xajax->registerFunction("cargTipoPersona");
 
?>