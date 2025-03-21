<?php
//Función()
function cargRifIdent($val,$form){
  $obj = new xajaxResponse('UTF-8');

  $usuario  = $form["usuario"];
  $ci       = $form["cedula"];
  $area     = $form["d_area"]; 

  $usuarioData = new usuarioModel();
  $usuarioData->cedula = $ci;
  $usQuery   = $usuarioData->getByCI();
  $rowU      = $usQuery["row"];

  $admin    = new usuario_admModel();
  $admin->id_user = $usuario;
  $admin->area    = $area;
  $admQuery = $admin->getByIDUser('allAuto');
  $numRows  = $admin->getByIDUser('allAuto');

  $tramite  = new usuario_tramModel();

  $cont     = 0;

  if($admQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$admQuery["numRows"];$j++){
        $row = pg_fetch_array($admQuery["query"],$j);
        $tramite->id_user = $rowU["id_usuario"];
        $tramite->rifs    = $row["ident_rif"];
        $tramite->area    = $area;
        $trQuery          = $tramite->getByRIF('default');

        if ($trQuery["numRows"] > 0) {
          $trQuery2  = $tramite->getByRIF('desautoRif');
          $row2      = $trQuery2["row"];
            if ($row2["id_status"] == 2) {
              if (ctype_digit($row["ident_rif"])) {
                $extranjera = new empresa_extranjeraModel();
                $extranjera->id = $row["ident_rif"];
                $empQuery = $extranjera->getByID();
                $row2 = $empQuery["row"];
                $html.="<option style='color:#FF00000' value='".$row["ident_rif"]."'>".$row2["d_nombre"]."</option>";
              }else{
                $nacional = new empresa_nacionalModel();
                $nacional->rif = $row["ident_rif"];
                $empQuery = $nacional->getByRif();
                $row3     = $empQuery["row"];
                $html.="<option style='color:#FF00000' value='".$row["ident_rif"]."'>".$row3["d_nombre"]." ( ".$row["ident_rif"]." )</option>";
              }
              $cont   = $cont + 1;
            }
        }else{
          if (ctype_digit($row["ident_rif"])) {
                $extranjera = new empresa_extranjeraModel();
                $extranjera->id = $row["ident_rif"];
                $empQuery = $extranjera->getByID();
                $row2 = $empQuery["row"];
                $html.="<option  value='".$row["ident_rif"]."'>".$row2["d_nombre"]."</option>";
          }else{
                $nacional = new empresa_nacionalModel();
                $nacional->rif = $row["ident_rif"];
                $empQuery = $nacional->getByRif();
                $row3     = $empQuery["row"];
                $html.="<option  value='".$row["ident_rif"]."'>".$row3["d_nombre"]." ( ".$row["ident_rif"]." )</option>";
          }
          $cont     = $cont + 1;
        }
       }  

       $obj->addAssign("Rifs","value",$cont);
       $obj->addAssign("rif$val","innerHTML",$html);
  }else{
    $html="<option value='0'>SELECCIONE...</option>";
    $obj->addAssign("Rifs","value",$cont);
    $obj->addAssign("rif$val","innerHTML",$html);
  } 

  return $obj;
}

function cargRifDisp($val,$form){
  $obj = new xajaxResponse('UTF-8');

  $admin = $form["usuario"];
  switch ($form["modal"]) {
    case 0:
      $ci    = $form["cedula"];
      $area  = $form["d_area"]; 
    break;
    case 1:
      $ci    = $form["cedula_modal"];
      $area  = $form["d_area_Modal"];
    break;
  }

  $usuarioData = new usuarioModel();
  $usuarioData->cedula = $ci;
  $usQuery   = $usuarioData->getByCI();
  $rowU      = $usQuery["row"];

  $tramite  = new usuario_tramModel();
  $tramite->id_user = $rowU["id_usuario"];
  $tramite->area    = $area;
  $tramite->admin   = $admin;
  $trQuery  = $tramite->tramUserByAdm('allAuto');

  if ($trQuery["numRows"] > 0) {
    $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$trQuery["numRows"];$j++){
        $row = pg_fetch_array($trQuery["query"],$j);
        if (ctype_digit($row["ident_rif"])) {
                $extranjera = new empresa_extranjeraModel();
                $extranjera->id = $row["ident_rif"];
                $empQuery = $extranjera->getByID();
                $row2 = $empQuery["row"];
                $html.="<option  value='".$row["ident_rif"]."'>".$row2["d_nombre"]."</option>";
        }else{
                $nacional = new empresa_nacionalModel();
                $nacional->rif = $row["ident_rif"];
                $empQuery = $nacional->getByRif();
                $row3     = $empQuery["row"];
                $html.="<option  value='".$row["ident_rif"]."'>".$row3["d_nombre"]." ( ".$row["ident_rif"]." )</option>";
        } 
       }  
  }else{
    $html="<option value='0'>SELECCIONE...</option>";
  }

  $obj->addAssign("rif$val","innerHTML",$html);

  return $obj;  
}

function cargRifDispAdm($val,$form){
  $obj = new xajaxResponse('UTF-8');

  switch ($form["modal"]) {
    case 0:
      $ci    = $form["cedula"];
      $area  = $form["d_area"]; 
    break;
    case 1:
      $ci    = $form["cedula_modal"];
      $area  = $form["d_area_Modal"];
    break;
  }

  $usuarioData = new usuarioModel();
  $usuarioData->cedula = $ci;
  $usQuery   = $usuarioData->getByCI();
  $rowU      = $usQuery["row"];

  $admin  = new usuario_admModel();
  $admin->id_user = $rowU["id_usuario"];
  $admin->area    = $area;
  $admQuery = $admin->getByIDUser('allAuto');
  $query    = $admin->getByIDUser('allAuto');
  $numRows  = $admin->getByIDUser('allAuto');

  if ($admQuery["numRows"] > 0) {
    $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$admQuery["numRows"];$j++){
        $row = pg_fetch_array($admQuery["query"],$j);
        if (ctype_digit($row["ident_rif"])) {
                $extranjera = new empresa_extranjeraModel();
                $extranjera->id = $row["ident_rif"];
                $empQuery = $extranjera->getByID();
                $row2 = $empQuery["row"];
                $html.="<option  value='".$row["ident_rif"]."'>".$row2["d_nombre"]."</option>";
        }else{
                $nacional = new empresa_nacionalModel();
                $nacional->rif = $row["ident_rif"];
                $empQuery = $nacional->getByRif();
                $row3     = $empQuery["row"];
                $html.="<option  value='".$row["ident_rif"]."'>".$row3["d_nombre"]." ( ".$row["ident_rif"]." )</option>";
        }
       }    
      //$html.="<option value='all'>TODOS</option>";

  }else{
    $html="<option value='0'>SELECCIONE...</option>";
  }

  $obj->addAssign("rif$val","innerHTML",$html);

  return $obj;  
}

$xajax->registerFunction("cargRifIdent");
$xajax->registerFunction("cargRifDisp");
$xajax->registerFunction("cargRifDispAdm");

 
?>