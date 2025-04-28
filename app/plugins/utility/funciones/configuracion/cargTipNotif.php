<?php
//Función()
function cargTipNotif($caso){
  $obj = new xajaxResponse('UTF-8');

  $tipoNotif    = new tipo_notificacionModel();

  switch ($caso) {
    case 1://todas las notificaciones
      $tnQuery   = $tipoNotif->getByAll();
    break;
    case 2://notificaciones Activa
      $tnQuery   = $tipoNotif->getByActive();
    break;
   } 
 
   if($tnQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$tnQuery["numRows"];$j++){
        $row = pg_fetch_array($tnQuery["query"],$j);
        $html.="<option value=".$row["id_tipo_notif"].">".$row["d_tipo_notif"]."</option>";
       }  
   }else{
      $html="<option value='0'>SELECCIONE...</option>";
   } 

   $obj->addAssign("notif","innerHTML",$html);

  return $obj;
}

function cargTipNot(){
  $obj = new xajaxResponse('UTF-8');

  $tipoNotif    = new tipo_notificacionModel();



  $result = $tipoNotif->getByActivo();


  $html="<option value='0'>SELECCIONE...</option>";

   if($result["numRows"] > 0){
       for($j=0;$j<$result["numRows"];$j++){
        $row = pg_fetch_array($result["query"],$j);
        $html.="<option value=".$row["id_tipo_notif"].">".$row["d_tipo_notif"]."</option>";
       }  
   }

   $obj->addAssign("notif","innerHTML",$html);

  return $obj;
}

$xajax->registerFunction("cargTipNotif");
$xajax->registerFunction("cargTipNot");
 
?>