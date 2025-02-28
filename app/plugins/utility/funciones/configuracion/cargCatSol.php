<?php
//Función()
//function cargCatSol($val,$ruta){
function cargCatSol($val,$ruta,$coord){
  $obj = new xajaxResponse('UTF-8');

  $catSol = new categoria_solicitudModel();
  //$obj->addAlert($ruta);
switch ($ruta) {
    case 1:
      //TODAS LAS CATEGORIAS
    break;
    case 2: 
      $catSol->coord= $coord; //nueva liea
      $catSol->tipSol = $val;
      $catQuery  = $catSol->getByTipSol('active');
    break;
    case 3:
      $catSol->coord= $coord; //nuevo linea
      $catSol->tipSol = 2;
      $catQuery  = $catSol->getByTipSol('active');
    break;

    case 4:

      $catSol->coord= 3; //nuevo linea
      $catSol->tipSol = 2;
      $catQuery  = $catSol->cargCatSol1($val);
    break;

  }
/*switch ($ruta) { codigo origtinal
    case 1:
      //TODAS LAS CATEGORIAS
    break;
    case 2: 
      $catSol->tipSol = $val;
      $catQuery  = $catSol->getByTipSol('active');
    break;
    case 3:
      $catSol->tipSol = 2;
      $catQuery  = $catSol->getByTipSol('active');
    break;
  }*/
  switch ($ruta) {
    case 0: 
          $html="<option value='0'>SELECCIONE...</option>";
    break;
    case 1:
    case 2:
     if($catQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       for($j=0;$j<$catQuery["numRows"];$j++){
        $row = pg_fetch_array($catQuery["query"],$j);
        $html.="<option value=".$row["id_categoria_solicitud"].">".$row["d_categoria_solicitud"]."</option>";
       }  
     }else{
        $html="<option value='0'>SELECCIONE...</option>";
     }
    break;
    case 3:

    if ($coord == 3) {

      switch ($val) {

        case 1:
         /*if($catQuery["numRows"] > 0){
          $html="<option value='0'>SELECCIONE...</option>";
          for($j=0;$j<$catQuery["numRows"];$j++){
           $row = pg_fetch_array($catQuery["query"],$j);
           $arrCamb = array(5,6,7,8,9,10,11,12,13,14,15,16,17);
           $camb = $row["id_categoria_solicitud"];
           if (in_array($camb,$arrCamb)) {
            $html.="<option value=".$camb.">".$row["d_categoria_solicitud"]."</option>";
           }
          }  
         }*/
        break;
        case 2:
          $html="<option value='0'>SELECCIONE...</option>";
          for($j=0;$j<$catQuery["numRows"];$j++){
            $html.="<option value=".$catQuery["row"]["id_categoria_solicitud"].">".$catQuery["row"]["d_categoria_solicitud"]."</option>";
            }

        break;
        case 3:
         /* if($catQuery["numRows"] > 0){
          $html="<option value='0'>SELECCIONE...</option>";
          for($j=0;$j<$catQuery["numRows"];$j++){
           $row = pg_fetch_array($catQuery["query"],$j);
           $arrCamb = array(26,27,28,29,30,31);
           $camb = $row["id_categoria_solicitud"];
           if (in_array($camb,$arrCamb)) {
            $html.="<option value=".$camb.">".$row["d_categoria_solicitud"]."</option>";
           }
          }  
         }*/
        break;
        case 4:
        case 5: 
          $html="<option value='0'>SELECCIONE...</option>";
        break;
      }


    }else{

      switch ($val) {
        case 1:
         if($catQuery["numRows"] > 0){
          $html="<option value='0'>SELECCIONE...</option>";
          for($j=0;$j<$catQuery["numRows"];$j++){
           $row = pg_fetch_array($catQuery["query"],$j);
           $arrCamb = array(5,6,7,8,9,10,11,12,13,14,15,16,17);
           $camb = $row["id_categoria_solicitud"];
           if (in_array($camb,$arrCamb)) {
            $html.="<option value=".$camb.">".$row["d_categoria_solicitud"]."</option>";
           }
          }  
         }
        break;
        case 2:
          if($catQuery["numRows"] > 0){
          $html="<option value='0'>SELECCIONE...</option>";
          for($j=0;$j<$catQuery["numRows"];$j++){
           $row = pg_fetch_array($catQuery["query"],$j);
           $arrCamb = array(18,19,20,21,22,23,24,25,40,57,58);
           $camb = $row["id_categoria_solicitud"];
           if (in_array($camb,$arrCamb)) {
            $html.="<option value=".$camb.">".$row["d_categoria_solicitud"]."</option>";
           }
          }  
         }
        break;
        case 3:
          if($catQuery["numRows"] > 0){
          $html="<option value='0'>SELECCIONE...</option>";
          for($j=0;$j<$catQuery["numRows"];$j++){
           $row = pg_fetch_array($catQuery["query"],$j);
           $arrCamb = array(26,27,28,29,30,31);
           $camb = $row["id_categoria_solicitud"];
           if (in_array($camb,$arrCamb)) {
            $html.="<option value=".$camb.">".$row["d_categoria_solicitud"]."</option>";
           }
          }  
         }
        break;
        case 4:
        case 5: 
          $html="<option value='0'>SELECCIONE...</option>";
        break;
      }
    break;
  }  

}
  $obj->addAssign("d_categoria_solicitud","innerHTML",$html);

  return $obj;
}





function cargCatSol1($val){ //Envase
  $obj = new xajaxResponse('UTF-8');
  $catSol = new categoria_solicitudModel();
  //$obj->addAlert("catSol");

      $catSol->coord= 3; //nuevo linea
      $catSol->tipSol = 2;
      $catQuery  = $catSol->getByTipSol1($val);

      switch ($val) {

        case 1:
          $html="<option value='0'>SELECCIONE...</option>";
          for($j=0;$j<$catQuery[0]["numRows"];$j++){
            $html.="<option value=".$catQuery[$j]["id_categoria_solicitud"].">".$catQuery[$j]["d_categoria_solicitud"]."</option>";
            }
            $obj->addAssign("d_categoria_solicitud","innerHTML",$html);
        break;
        case 2:
          $html="<option value='0'>SELECCIONE...</option>";
          for($j=0;$j<$catQuery["numRows"];$j++){
            $html.="<option value=".$catQuery["row"]["id_categoria_solicitud"].">".$catQuery["row"]["d_categoria_solicitud"]."</option>";
            }
            $obj->addAssign("d_categoria_solicitud","innerHTML",$html);
        break;
      }

  return $obj;
}





function cargCatTram($form,$caso){
  $obj = new xajaxResponse('UTF-8');

  switch ($caso) {
    case 'default':
      $usuario  = $form["usuario"];
      $ci       = $form["cedula"];
      $area     = $form["d_area"];
      $rif      = $form["rif"];
      $tipSol   = $form["d_tipo_solicitud"];
      $obj->addClear("zonCatAsig","innerHTML");
      $obj->addClear("zonCatnoAsig","innerHTML");
    break;
    case 'modal':
      $ci       = $form["cedula_modal"];
      $area     = $form["d_area_Modal"];
      $rif      = $form["rif1"];
      $obj->addClear("zonCatAsig_Modal","innerHTML");
      $obj->addClear("zonCatnoAsig_Modal","innerHTML");
    break;
  }

  $catAsig  = array();

  $usuarioData = new usuarioModel();
  $usuarioData->cedula = $ci;
  $usQuery  = $usuarioData->getByCI();
  $rowU     = $usQuery["row"];

  $tramite     = new usuario_tramModel();
  $tramite->id_user = $rowU["id_usuario"];
  $tramite->area    = $area;
  $tramite->rifs    = $rif;
  $trQuery = $tramite->getByRIF('autoRif');
  $rowT    = $trQuery["row"];

  $tramiteSol  = new usuario_solModel();
  $tramiteSol->id_user  = $rowT["id_usuario_tramite"];
  switch ($caso) {
    case 'default':
      $tramiteSol->tipSol   = $tipSol;
    break;
    case 'modal':

      $tSolicitud  = new tipo_solicitudModel();
      switch ($area) {
        case 1:
          $d_area = "alimento";
        break;
        case 2:
          $d_area = "estabsalud";
        break;
        case 3:
          $d_area = "droga";
        break;
      }
      $tipSol = "";
      $tipQuery = $tSolicitud->getByArea($d_area);
      if ($tipQuery["numRows"] > 0) {
        for ($k=0; $k < $tipQuery["numRows"]; $k++) { 
          $row4 = pg_fetch_array($tipQuery["query"],$k); 
          if ($k == 0) {
            $tipSol.= $row4["id_tipo_solicitud"];
          }else{
            $tipSol.= ",".$row4["id_tipo_solicitud"];
          }
        }
      }
      $tramiteSol->tipSol   = $tipSol;
    break;
  }
  $trQuery2  = $tramiteSol->getByIDUserTram('all');

  $categoria   = new categoria_solicitudModel();
  $categoria->tipSol = $tipSol;

  $select      = "<p align='right'><label><span>Seleccionar todos <input type='checkbox' id='selAll' onclick='ckeckAll()'></span></label></p>";
  switch ($caso) {
    case 'default':
      $obj->addAssign("selectAll","innerHTML",$select);
    break;
  }

  if ($trQuery2["numRows"] > 0) {
    $html ="     <div class='table-responsive'>
                 <table class='table table-bordered'>
                 <thead>
                 <tr>
                 <th class='btable'><center>Selec.</center></th>
                 <th class='btable'><center>Categor&iacute;as Asignadas</center></th>";
    switch ($caso) {
      case 'modal':
        $html.=" <th class='btable'><center>Tipo de Solicitud</center></th> ";
      break;
    }  
    $html.="    </tr>
                </thead>
                <tbody>
                ";  
    for ($i=0; $i < $trQuery2["numRows"]; $i++){
      $row = pg_fetch_array($trQuery2["query"],$i); 

      $id_cat   = $row["id_categoria_solicitud"];
      array_push($catAsig, $id_cat);
      $categoria->id = $id_cat;
      $catQuery = $categoria->getByID();

      if ($catQuery["numRows"] > 0) {
        $row2     = $catQuery["row"];  
        switch ($caso) {
          case 'default':
            switch ($row["id_status"]) {
            case 1:
            $html.="
                <tr style='color:#009900;'>
                <td><center><i class='fa fa-square' aria-hidden='true'></i></center></td>
                <td><center>".$row2["d_categoria_solicitud"]."</center></td>
                </tr>
            ";
            break;
            case 2:
            $html.="
                <tr style='color:#FF0000;'>
                <td><center><input type='checkbox' id='catA$i' name='catA[]' value='".$row["id_usuario_solicitud"]."'></center></td>
                <td><center>".$row2["d_categoria_solicitud"]."</center></td>
                </tr>
            ";
            break;
            }
          break;
          case 'modal':
            $tSolicitud->id = $row2["id_tipo_solicitud"];
            $tipQuery2  = $tSolicitud->getByID();
            $row5       = $tipQuery2["row"];
            switch ($row["id_status"]) {
            case 1:
            $html.="
                <tr style='color:#009900;'>
                <td><center><input type='radio' data-dismiss='modal' id='catA$i' name='catA' value='".$row["id_usuario_solicitud"]."' onClick='xajax_enviaCodigo(this.value);'></center></td>
                <td><center>".$row2["d_categoria_solicitud"]."</center></td>
                <td><center>".$row5["d_tipo_solicitud"]."</center></td>
                </tr>
            ";
            break;
            case 2:
            $html.="
                <tr style='color:#FF0000;'>
                <td><center><i class='fa fa-circle' aria-hidden='true'></i></center></td>
                <td><center>".$row2["d_categoria_solicitud"]."</center></td>
                <td><center>".$row5["d_tipo_solicitud"]."</center></td>
                </tr>
            ";
            break;
            }
          break;
        }
      }
    }

    $html.=" </tbody>
             </table>
             </div>";

    switch ($caso) {
      case 'default':
        $obj->addAssign("zonCatAsig","innerHTML",$html); 
      break;
      case 'modal':
        $obj->addAssign("zonCatAsig_Modal","innerHTML",$html);
      break;
    }

  }else{

  }

  switch ($caso) {
      case 'default':
        $catQuery2 = $categoria->getByTipSol('active');
        if ($catQuery2["numRows"] > 0) {
        $html2 =" <div class='table-responsive'>
                 <table class='table table-bordered'>
                 <thead>
                 <tr>
                 <th class='btable'><center>Selec.</center></th>
                 <th class='btable'><center>Categor&iacute;as no Asignadas</center></th>
                 </tr>
                 </thead>
                 <tbody>
                "; 
        for ($j=0; $j < $catQuery2["numRows"]; $j++) { 
        $row3 = pg_fetch_array($catQuery2["query"],$j);
          if (!in_array($row3["id_categoria_solicitud"],$catAsig)) {
          $html2.="
                <tr>
                <td><center><input type='checkbox' id='catnA$j' name='catnA[]' value='".$row3["id_categoria_solicitud"]."'></center></td>
                <td><center>".$row3["d_categoria_solicitud"]."</center></td>
                </tr>
            ";
          }
        }
        $html2.=" </tbody>
             </table>
             </div>";
        }

      $obj->addAssign("zonCatnoAsig","innerHTML",$html2); 
     break;
  }

  switch ($caso) {
    case 'default':
      $obj->addAssign("countCat","value",$trQuery2['numRows']);
      $obj->addAssign("countnCat","value",$catQuery2["numRows"]);

      $obj->addScript(" $('#selectAll').show('slow'); ");
      $obj->addScript(" $('#zonCatAsig').show('slow'); ");  
      $obj->addScript(" $('#zonCatnoAsig').show('slow'); ");
    break;
    case 'modal':
      $obj->addScript(" $('#zonCatAsig_Modal').show('slow'); ");
    break;
  }

  return $obj;
}

function cargBytipNotif($val,$coord){

  $obj = new xajaxResponse('UTF-8');

  $catSol = new categoria_solicitudModel();

  $result = $catSol->getCatSolByNotif(array('tipoNotif'=>$val,'coord' => $coord));

  if ($result['numRows'] > 0) {

    $html = "<option value='0'>SELECCIONE...</option>";

    for ($i=0; $i < $result['numRows']; $i++) {
      $row = pg_fetch_array($result["query"],$i); 

      $html.="<option value='".$row['id_categoria_solicitud']."'>".$row['d_categoria_solicitud']."</option>";

    }//endFor

  }else{

    $html = "<option value='0'>SELECCIONE...</option>";

  }

  $obj->addAssign("d_categoria_solicitud","innerHTML",$html); 

  return $obj;
}

function cargCatS($tipoSol,$coord){

  $obj = new xajaxResponse('UTF-8');

  $catSol = new categoria_solicitudModel();

  $result = $catSol->getCatSoli($coord,$tipoSol);

  if ($result['numRows'] > 0) {

    $html = "<option value='0'>SELECCIONE...</option>";

    for ($i=0; $i < $result['numRows']; $i++) {
      $row = pg_fetch_array($result["query"],$i); 

      $html.="<option value='".$row['id_categoria_solicitud']."'>".$row['d_categoria_solicitud']."</option>";

    }//endFor

  }else{

    $html = "<option value='0'>SELECCIONE...</option>";

  }

  $obj->addAssign("d_categoria_solicitud","innerHTML",$html); 

  return $obj;
}

function cargCatSolNotif($tipoSol,$coord,$notif){

  $obj = new xajaxResponse('UTF-8');

  $catSol = new categoria_solicitudModel();

  $result = $catSol->getCatSoliNotif($coord,$tipoSol,$notif);

    $html = "<option value='0'>SELECCIONE...</option>";

    for ($i=0; $i < $result['numRows']; $i++) {
      $row = pg_fetch_array($result["query"],$i); 

      $html.="<option value='".$row['id_categoria_solicitud']."'>".$row['d_categoria_solicitud']."</option>";

    }//endFor

  $obj->addAssign("d_categoria_solicitud","innerHTML",$html);

  return $obj;
}

$xajax->registerFunction("cargCatSol");
$xajax->registerFunction("cargCatSol1");
$xajax->registerFunction("cargCatTram");
$xajax->registerFunction("cargBytipNotif");
$xajax->registerFunction("cargCatS");
$xajax->registerFunction("cargCatSolNotif");

 
?>