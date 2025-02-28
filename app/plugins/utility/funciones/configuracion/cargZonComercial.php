<?php
//Función()
function cargZonComercial($cont,$seq){
  $obj      = new xajaxResponse('UTF-8');
  $zona     = new zona_comercializacionModel();
  $zcQuery  = $zona->getByAll();
  $obj->addAssign("countZonas","value",$zcQuery["numRows"]);
  if ($zcQuery["numRows"] > 0) {
      $html="<option value='0'>SELECCIONE...</option>";
      for($j=0;$j<$zcQuery["numRows"];$j++){
        $row = pg_fetch_array($zcQuery["query"],$j);
        $html.="<option value=".$row["id_zona_comer"].">".$row["d_zona_comer"]."</option>";
       } 
      //$html.="<option value='99'>TODOS</option>";

      if ($cont === 'noCont' && $seq === 'noSeq') {
        $obj->addAssign("zona_comer","innerHTML",$html);
      }else{
        $varZon = "zona_comer".$cont."_".$seq;
        $obj->addAssign($varZon,"innerHTML",$html);
      }
  }

  return $obj;
}

$xajax->registerFunction("cargZonComercial");
 
?>