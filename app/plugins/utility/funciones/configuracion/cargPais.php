<?php
//Función()
function cargPais($caso,$cont){
  $obj = new xajaxResponse('UTF-8');

  $pais    = new paisModel();
  $paQuery = $pais->getByAll();
   if($paQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$paQuery["numRows"];$j++){
        $row = pg_fetch_array($paQuery["query"],$j);
        $html.="<option value=".$row["id_pais"].">".$row["d_pais"]."</option>";
       }  
       switch ($caso) {
          case 'none':
            $obj->addAssign("pais".$cont,"innerHTML",$html);
          break;
          case 'modal':
            $obj->addAssign("paisModal","innerHTML",$html);
          break;
          case 'normal':
            $obj->addAssign("pais","innerHTML",$html);
          break;
       }
   } 
  return $obj;
}

$xajax->registerFunction("cargPais");
 
?>