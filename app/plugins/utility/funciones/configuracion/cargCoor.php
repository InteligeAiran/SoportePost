<?php
//Función()
function cargCoor($area){
  $obj = new xajaxResponse('UTF-8');

  $coord    = new coordinacionModel();
  $coord->area = $area;
  $coQuery = $coord->getByArea();
 
   if($coQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$coQuery["numRows"];$j++){
        $row = pg_fetch_array($coQuery["query"],$j);
        $html.="<option value=".$row["id_coordinacion"].">".$row["d_coordinacion"]."</option>";
       }  
  }else{
      $html="<option value='0'>SELECCIONE...</option>";
  } 

  $obj->addAssign("d_coordinacion","innerHTML",$html);

  return $obj;
}

function cargCoorReg($area){
  $obj = new xajaxResponse('UTF-8');

  $coord    = new coordinacionModel();
  $coord->area = $area;
  $coQuery  = $coord->getByArea();
 
  if($coQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$coQuery["numRows"];$j++){
        $row = pg_fetch_array($coQuery["query"],$j);
        switch ($area) {
          case 1:
            switch ($row["id_coordinacion"]) {
              case 1:
                $html.="<option value=".$row["id_coordinacion"].">".$row["d_coordinacion"]."</option>";
              break;
            }
          break;
        }
       }  
  }else{
      $html="<option value='0'>SELECCIONE...</option>";
  } 

  $obj->addAssign("d_coordinacion","innerHTML",$html);

  return $obj;
}

$xajax->registerFunction("cargCoor");
$xajax->registerFunction("cargCoorReg");

 
?>