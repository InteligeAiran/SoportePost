<?php
//Función()
function cargTipoEmpresa(){
  $obj = new xajaxResponse('UTF-8');
  $db = Database::getInstance();
  $sql = "SELECT * 
            FROM tipo_empresa 
        ORDER BY id_tipo_empresa ASC;";
  $query = $db->pgquery($sql);
  $num = $db->pgNumrows($query);  
    if(!$num > 0){
       $obj->addAlert('No Realizo la Busqueda'); 
   }else{
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$num;$j++){
        $row = pg_fetch_array($query,$j);
        $html.="<option value=".$row["id_tipo_empresa"].">".$row["d_tipo_empresa"]."</option>";
       }  
       $obj->addAssign("t_empresa","innerHTML",$html);
     } 
  return $obj;
}

//carga tipo empresa de cosmeticos

function cargTipoEmpresaCase($case){
  $obj = new xajaxResponse('UTF-8');

  $tipEmpresaModel = new tipo_empresaModel();

  $result = $tipEmpresaModel->getByAll();

  if($result['numRows'] > 0){

    $html="<option value='0'>SELECCIONE...</option>";
      for($j=0;$j<$result['numRows'];$j++){
        $row = pg_fetch_array($result['query'],$j);
        $html.="<option value=".$row["id_tipo_empresa"].">".$row["d_tipo_empresa"]."</option>";
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

$xajax->registerFunction("cargTipoEmpresa");
$xajax->registerFunction("cargTipoEmpresaCase");
 
?>