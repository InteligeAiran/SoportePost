<?php
//Función()
function cargArea($tipo,$caso,$form){
  $obj = new xajaxResponse('UTF-8');

  $area      = new areaModel();
  $arQuery   = $area->getByAll();
  
    if($arQuery["numRows"] > 0){
       $html="<option value='0'>SELECCIONE...</option>";
       switch ($caso) {
        case 'default':
          for($j=0;$j<$arQuery["numRows"];$j++){
            $row = pg_fetch_array($arQuery["query"],$j);
            /*switch ($row["id_area"]) {
            case 1:
              $d_area = 'ALIMENTO';
            break;
            case 2:
              $d_area = 'ESTABLECIMIENTO DE SALUD';
            break;
            case 3:
              $d_area = 'DROGA';
            break;
            }*/
            $html.="<option value=".$row["id_area"].">".$row["d_area"]."</option>";
          }
        break;
        case 'allAuto':

          $arrArea   = array();
           
            switch ($tipo) {
            case 'admin':
              $usuario   = $form["usuario"];
              $admin     = new usuario_admModel();
              $admin->id_user = $usuario;
              $uQuery  = $admin->getAreaDist();
            break;
            case 'user':
              switch ($form["modal"]) {
                case 0:
                  $cedula       = $form["cedula"];
                break;
                case 1:
                  $cedula       = $form["cedula_modal"];
                break;
              }
              $usuarioModel = new usuarioModel();
              $usuarioModel->cedula = $cedula;
              $usQuery      = $usuarioModel->getByCI();
              $rowU         = $usQuery["row"];
              $tramite      = new usuario_tramModel();
              $tramite->id_user     = $rowU["id_usuario"];
              $uQuery       = $tramite->getAreaDist();
            break;
            }

            if ($uQuery["numRows"] > 0) {
                for($j=0;$j<$uQuery["numRows"];$j++){
                  $row2 = pg_fetch_array($uQuery["query"],$j);
                  array_push($arrArea,$row2["id_area"]);
                }

                if (!empty($arrArea)){
                  for($k=0;$k<$arQuery["numRows"];$k++){
                    $row = pg_fetch_array($arQuery["query"],$k);
                    if (in_array($row["id_area"],$arrArea)) {
                      /*switch ($row["id_area"]) {
                      case 1:
                        $d_area = 'ALIMENTO';
                      break;
                      case 2:
                        $d_area = 'ESTABLECIMIENTO DE SALUD';
                      break;
                      case 3:
                        $d_area = 'DROGA';
                      break;
                      }*/
                      $html.="<option value=".$row["id_area"].">".$row["d_area"]."</option>";
                    }
                  }
                }
            }
        break;
        case 'allDesauto':
          //todas desautorizadas
        break;
       }  

       switch ($form["modal"]) {
         case 0:
          $obj->addAssign("d_area","innerHTML",$html);
         break;
         case 1:
          $obj->addAssign("d_area_Modal","innerHTML",$html);
         break;
       }

    } 

  return $obj;
}

function cargAreasDispo(){

  $obj = new xajaxResponse('UTF-8');

  $area = new areaModel();

  $result = $area->getByAll();

  $html = '<option value="0">SELECCIONE... </option>';

  for ($i=0; $i < $result['numRows']; $i++) {
    $row = pg_fetch_array($result['query'],$i);

    $html.= '<option value="'.$row['id_area'].'">'.mb_strtoupper($row['d_area'],'UTF-8').'</option>';
  }

  $obj->addAssign("d_area","innerHTML",$html);

  return $obj;
}


$xajax->registerFunction("cargArea");
$xajax->registerFunction("cargAreasDispo");
 
?>