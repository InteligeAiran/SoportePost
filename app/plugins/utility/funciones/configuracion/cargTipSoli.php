<?php
//Función()
function cargTipoSoli($caso,$form){
  $obj = new xajaxResponse('UTF-8');

  $tipSol    = new tipo_solicitudModel();

  switch ($caso) {
    case 'area':
      $d_area  = $form["d_area"];
      switch ($d_area) {
        case 0:
          $area = 'none';
        break;
        case 1:
          $area = 'alimento';
        break;
        case 2:
          $area = 'estabsalud';
        break;
        case 3:
          $area = 'droga';
        break;
      }
      $tsQuery   = $tipSol->getByArea($area);
    break;
    case 'coordinacion':
      $coor      = $form["d_coordinacion"];
      $tipSol->coordinacion = $coor;
      $tsQuery   = $tipSol->getByCoord();
    break;
    case 'default':
      $tsQuery   = $tipSol->getByAll('active');
   }
 
   if($tsQuery['numRows'] > 0){
       $html="<option value='0'>SELECCIONE...</option>";

       for($j=0;$j<$tsQuery["numRows"];$j++){
        $row = pg_fetch_array($tsQuery["query"],$j);
        $html.="<option value=".$row["id_tipo_solicitud"].">".$row["d_tipo_solicitud"]."</option>";
       } 
        
   }else{
      $html="<option value='0'>SELECCIONE...</option>";
   } 

   $obj->addAssign("d_tipo_solicitud","innerHTML",$html);

  return $obj;
}

function cargTipoSol(){

  $obj = new xajaxResponse('UTF-8');

  $tipSol    = new tipo_solicitudModel();

  $result = $tipSol->getByAll('active');

  $html = '<option value="0">SELECCIONE... </option>';

  for ($i=0; $i < $result['numRows']; $i++) {
    $row = pg_fetch_array($result['query'],$i);

    $html.= '<option value="'.$row['id_tipo_solicitud'].'">'.mb_strtoupper($row['d_tipo_solicitud'],'UTF-8').'</option>';
  }

  $obj->addAssign("d_tipo_solicitud","innerHTML",$html);

  return $obj;
}

$xajax->registerFunction("cargTipoSoli");
$xajax->registerFunction("cargTipoSol");
 
?>