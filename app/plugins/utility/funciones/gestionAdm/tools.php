<?php

 //Funcion setOriginalpara la Fecha
  function fechaBD()
{	
  $db = Database::getInstance();		
  $consulta_fecha=$db->pgquery("SELECT NOW() as fecha") or die(pg_error());
   if($empresa=$db->pgfetch($consulta_fecha)){
      $empresa['fecha'];
   }
  return $empresa['fecha'];
}

function fsalida($fehca){
        if ($fehca==""){
            return $fehca;
        }
        $year=substr($fehca, 0, 4);
        $mes=substr($fehca, 5, 2);
        $dia=substr($fehca, 8, 2);
        $fechan = ($dia."/".$mes."/".$year);
        return $fechan;
    }



//Arreglo del Numero de Permiso Sanitario
  function numSolicitud($c_solicitud)
{     

    $longitud_numero=strlen($c_solicitud);
    
    switch($longitud_numero){   
    case '1':
    $numero_solicitud='00000000'.$c_solicitud;
    break;
    case '2':
    $numero_solicitud='0000000'.$c_solicitud;
    break;
    case '3':
    $numero_solicitud='000000'.$c_solicitud;
    break;
    case '4':
    $numero_solicitud='00000'.$c_solicitud;
    break;
    case '5':
    $numero_solicitud='0000'.$c_solicitud;
    break;
    case '6':
    $numero_solicitud='000'.$c_solicitud;
    break;
    case '7':
    $numero_solicitud='00'.$c_solicitud;
    break;
    case '8':
    $numero_solicitud='0'.$c_solicitud;
    break;
    case '9':
    $numero_solicitud=$c_solicitud;
    break;
    }
    
    return $numero_solicitud;
    }

//Funciones de Firma Electronica
  function encrypt($texto,$key){
  // Datos de entrada
   // Proceso de cifrado
     $iv    = 'abcdefghijklmnopqrstuvwxyz012345';
     $td = mcrypt_module_open('rijndael-256', '', 'ecb', '');
           mcrypt_generic_init($td, $key, $iv);
     $texto_cifrado = mcrypt_generic($td, $texto);
           mcrypt_generic_deinit($td);
           mcrypt_module_close($td);
// Opcionalmente codificamos en base64
     $texto_cifrado = base64_encode($texto_cifrado);

    return $texto_cifrado;

  }//fin encrypt

  function encrypText($fecha,$sol,$key){
     for($j=0;$j<1;$j++){
       //Usa la Fecha y la Solicitud + j++
         $k1 =$key.base64_encode(md5(($fecha+$j)+($sol+$j)));
       //K1 y Clave Privada= K2
         $k2 = $k1.base64_encode($k1.$key);
       //Clave Privada y $k2      
         $k3 = $k2.base64_encode($key.$k2);
       //K3 y C2 + J++
         $k4 = $k3.base64_encode($k3.($key.(string)$sol));  
     }//For Principal
        $k = substr($k1.$k2.$k3.$k4, 1,256);
     return $k;

  }

    function fTipoSol($nro){

    $db = Database::getInstance();
    //Armo el Query
   $sql ="SELECT sol.d_numero_sanitario,sol.id_area,sol.id_coordinacion,sol.id_categoria_solicitud 
           FROM solicitud sol 
          WHERE id_solicitud = ".$nro.";";
   $query   = $db->pgquery($sql);
   $numRows = $db->pgnumrows($query);
   $row     = $db->pgfetch($query);
   $area    = $row["id_area"];
   $coord   = $row["id_coordinacion"];
  // $cat   = $row["id_categoria_solicitud"];
   switch ($area) {
     case 1: //"DIRECCIÓN DE INOCUIDAD E INSPECCIÓN DE ALIMENTOS Y BEBIDAS"
     switch ($coord) {
       case 1: //"COORDINACIÓN DE REGISTRO"
    $sql ="SELECT sol.* FROM solicitud sol WHERE id_solicitud =".$nro.";";
    $query   = $db->pgquery($sql);
    $numRows = $db->pgnumrows($query);

    if($numRows > 0){
       $row = $db->pgfetch($query);
       //Definir cual es la categoria de la Solicitud
         $categoria = $row["id_categoria_solicitud"];
       //Si es Registro Nuevo Buscar el Permiso 
          if($categoria >= 1 || $categoria <=4){
           $siglas       = abrevPermi($categoria);
           $numero       = number_format(getNumeroP($categoria),0,",",".");
           $numSanitario = $siglas.$numero; 
           //Preparar arreglo 
              $data = array('tipo_solicitud'   =>$row['id_categoria_solicitud'],
                            'usuario'          =>$row['id_usuario'],
                            'status'           =>$row['id_status_solicitud'],
                            'permiso_sanitario'=>$numSanitario,
                            'f_solicitud'      =>$row['f_solicitud'],
                            'funcionario'      =>$row['id_funcionario'],
                            'categoria'        =>$categoria,
                            'area'             =>$row['id_area'],
                            'coordinacion'     =>$row['id_coordinacion']);
         }else{

          $data = array('tipo_solicitud'   =>$row['id_categoria_solicitud'],
                        'usuario'          =>$row['id_usuario'],
                        'status'           =>$row['id_status_solicitud'],
                        'f_solicitud'      =>$row['f_solicitud'],
                        'funcionario'      =>$row['id_funcionario'],
                        'categoria'        =>$categoria,
                        'area'             =>$row['id_area'],
                        'coordinacion'     =>$row['id_coordinacion']);
           
         }
       return $data;
    }////////////////////////////////////////////////////////////////////////
         break;
         case 2://"VIGILANCIA Y CONTROL"
         break;
         case 3://"EDIFICACIONES, EQUIPO, ENVASES O EMPAQUES"
   $sql ="SELECT sol.* FROM solicitud sol WHERE id_solicitud =".$nro.";";
   $query = $db->pgquery($sql);
   $numRows = $db->pgnumrows($query);
   $row = $db->pgfetch($query);
   $t_sol = $row["id_tipo_solicitud"];
     switch ($t_sol) {
     case 1:
    if ($t_sol == 1) { //NUEVO REGISTRO DE PRUEBA $t_sol ==9
    $sql =" SELECT * FROM solicitud sol,producto_ee pee WHERE sol.id_solicitud = pee.id_solicitud AND  pee.id_solicitud =".$nro.";"; 
    $query   = $db->pgquery($sql);
    $numRows = $db->pgnumrows($query);
  //  echo $sql;
    if($numRows > 0){
       $row = $db->pgfetch($query);
       //Definir cual es la categoria de la Solicitud
         $categoria = $row["id_categoria_solicitud"];
         $catalogo = $row["id_clase_ee"];
       //Si es Registro Nuevo Buscar el Permiso 
          if($catalogo >= 1 || $catalogo <=30){
             $siglas       = abrevPermiEnv($catalogo);
            // echo $siglas;   //ERROR DE DUPLICIDAD DE DATOS 
             $numero       = getNumeroPEnv($catalogo);
             $numSanitario = $siglas.$numero; 
           //Preparar arreglo 
              $data = array('categoria_solicitud' =>$row['id_categoria_solicitud'],
                            'usuario'             =>$row['id_usuario'],
                            'status'              =>$row['id_status_solicitud'],
                            'permiso_sanitario'   =>$numSanitario,
                            'f_solicitud'         =>$row['f_solicitud'],
                            'funcionario'         =>$row['id_funcionario'],
                            'categoria'           =>$categoria,
                            'area'                =>$row['id_area'],
                            'coordinacion'        =>$row['id_coordinacion'],
                            'tipo_solicitud'      =>$row['id_tipo_solicitud']);  
         }
       return $data;
       }

   }
    break;
     case 3:
     case 2:
     if ($t_sol == 2 || $t_sol == 3) {
    $data = array('categoria_solicitud'=>$row['id_categoria_solicitud'],
                'usuario'            =>$row['id_usuario'],
                'status'             =>$row['id_status_solicitud'],
                'f_solicitud'        =>$row['f_solicitud'],
                'funcionario'        =>$row['id_funcionario'],
                'categoria'          =>$categoria,
                'area'               =>$row['id_area'],
                'coordinacion'       =>$row['id_coordinacion'],
                'permiso_sanitario'  =>$row['d_numero_sanitario'],
                'tipo_solicitud'     =>$row['id_tipo_solicitud']);

     }       
     return $data;
    break;
   }// //FIN DE LAS CONDICIONALES
         break;
     }// FIN SWITCH COORDINACIONES DEL AREA 1

       break; //
       case 2://"DIRECCIÓN DE REGULACIÓN Y CONTROL DE MATERIALES, EQUIPOS, ESTABLECIMIENTOS Y PROFESIONALES DE LA SALUD"
   /* switch ($coord) {
         case 4:
         break;
         case 5:
         break;
         case 6:
         break;
     }*/// FIN SWITCH COORDINACIONES DEL AREA 2
       break;
       case 3://"DIRECCIÓN DE DROGAS, MEDICAMENTOS Y COSMÉTICOS"
    /* switch ($coord) {
         case 4:
         break;
         case 5:
         break;
         case 6:
         break;
     }*/// FIN SWITCH COORDINACIONES DEL AREA 3
       break;
    
   } //FIN SWITCH AREAS

  } //fin fTipoSol


/* codigo orginal
 function fTipoSol($nro){ codigo orginal

    $db = Database::getInstance();
    //Armo el Query
    $sql ="SELECT sol.*
             FROM solicitud sol
            WHERE id_solicitud =".$nro.";";

    $query   = $db->pgquery($sql);
    $numRows = $db->pgnumrows($query);

    if($numRows > 0){

       $row = $db->pgfetch($query);

       //Definir cual es la categoria de la Solicitud
         $categoria = $row["id_categoria_solicitud"];
       //Si es Registro Nuevo Buscar el Permiso 
         if($categoria >= 1 || $categoria <=4){

           $siglas       = abrevPermi($categoria);
           $numero       = number_format(getNumeroP($categoria),0,",",".");
           $numSanitario = $siglas.$numero; 

           //Preparar arreglo 
              $data = array('tipo_solicitud'   =>$row['id_categoria_solicitud'],
                            'usuario'          =>$row['id_usuario'],
                            'status'           =>$row['id_status_solicitud'],
                            'permiso_sanitario'=>$numSanitario,
                            'f_solicitud'      =>$row['f_solicitud'],
                            'funcionario'      =>$row['id_funcionario'],
                            'categoria'        =>$categoria,
                            'area'             =>$row['id_area'],
                            'coordinacion'     =>$row['id_coordinacion']);
         }else{

          $data = array('tipo_solicitud'   =>$row['id_categoria_solicitud'],
                        'usuario'          =>$row['id_usuario'],
                        'status'           =>$row['id_status_solicitud'],
                        'f_solicitud'      =>$row['f_solicitud'],
                        'funcionario'      =>$row['id_funcionario'],
                        'categoria'        =>$categoria,
                        'area'             =>$row['id_area'],
                        'coordinacion'     =>$row['id_coordinacion']);
           
       //Si es Notificacion 
       //Busca las Siglas del Permiso
         }
         

     //Creo las Variables
        

       //Envio la Respuesta
       return $data;
    }
      
  }
*/

  function getNumeroP($type){

        $db = Database::getInstance();

        switch($type){

          case 1:

            $sql ="SELECT max(n_permiso)
                       AS nro_permiso 
                     FROM permiso_alimento;";
          break;
          case 2:

             $sql ="SELECT max(n_permiso)
                       AS nro_permiso 
                     FROM permiso_alimento;";
          break;
          case 3:

              $sql ="SELECT max(n_permiso)
                       AS nro_permiso 
                     FROM permiso_licor;";
          break;
          case 4:

             $sql ="SELECT max(n_permiso)
                       AS nro_permiso 
                     FROM permiso_licor;";
          break;
        }

        $query   = $db->pgquery($sql);
        $numrows = $db->pgNumrows($query);
        if($numrows > 0){

           $row = $db->pgfetch($query);
           $nPermiso = $row["nro_permiso"] + 1;


        } 

        return $nPermiso;
  }

  function setNumeroP($type,$area){

       $db  = Database::getInstance();

       $num = getNumeroP($type); 

       switch($area){

           case 1;

           $arrTable = array(1=>"permiso_alimento",
                             2=>"permiso_alimento",
                             3=>"permiso_licor",
                             4=>"permiso_licor");

           $table = $arrTable[$type];

             $sql ="INSERT INTO ".$table."(n_permiso,f_generado)
                         VALUES (".$num.",'".getTime()."');";
           break;
         }
       
          $query = $db->pgquery($sql);

       return;
  }

  
  //Tipo Permiso Sanitario 
    function abrevPermi($solType){
      //arreglos de solicitud por area
        $arrAli = array(1,2,3,4);
      
      //Armo los arreglos 
        $alimentos=array(1=>'A-',2=>'A-',3=>'L-',4=>'L-'); 

        if (in_array($solType,$arrAli)) {

            $permi=$alimentos[$solType];
        }
      
      return $permi; 
    } 
 
 //Acta de Inspeccion
   function genActaInsp($nroSol){
       $db = Database::getInstance();
   //Busca el Codigo de area 
       $datSol = fTipoSol($nroSol);   
   //Busco el ultimo numero de permiso otorgado
       $numPre  = secPermiso($datSol["cod_area"]);
       $numNext = numSolicitud($numPre);    
   //Armo el Permiso Buscando el Codigo del Estado 
       $abrev     = abrevPermi($datSol["cod_tipo"]); 
       $sigEstado = siglaEstado($datSol["contraloria"]);   
       $permi = $sigEstado."-".$abrev."-".$numNext; 
       $data = array('numero'=>$numNext,'permiso'=>$permi,
                     'tabla'=>$tab);
  //Retorno el Permiso 
   return $data;  
  }

  function secPermiso($codArea){
    $db = Database::getInstance();
  //Defino Variables 
    $tables =array('1'=>'permiso_alimento',
                   '2'=>'permiso_regulacion',
                   '3'=>'permiso_drogas');
    $tab    = $tables[$codArea];                    
    $fecha  = fechaBD();
  //Busco el Numero 
    $sql = "SELECT max(id) 
                AS nro_san 
              FROM ".$tab.";";
    $query = $db->pgquery($sql);
    $row   = $db->pgfetch($query);
    $num   = (int)$row["nro_san"] + 1;
  //Guarda la secuencia 
    $sql2 = "INSERT INTO ".$tab."(
                         f_statud,numero_sanitario)
                  VALUES('".$fecha."',".$num.");";
    $query2 = $db->pgquery($sql2);
    if(isset($query2)){
       return $num;  
    }                  
  }
  
   /*
    * @getFecha: Metodo para enviar la fecha actual en formato 
    *            time stamp without time zone.   
    */

       function getTime(){

             $db      = Database::getInstance();

             $sqlF    = "SELECT NOW();";
             $queryF  = $db->pgquery($sqlF);
             $numR    = $db->pgNumrows($queryF);

             if($numR > 0){
                $rowF = $db->pgfetch($queryF); 
                $fecha = $rowF["now"];
             }

             return $fecha; 
         }

         /*
           @setTraza: Este metodo tiene como proposito insertar 
                      una traza sobre cada operacion que reliza
                      un funcionario sobre una solicitud.  

         */

         function setTraza($nroSol,$usuario,$func_ini,$func_fin,$status){

            $db      = Database::getInstance();
            $fecha   = getTime();

            if($func_fin == "null"){
              $sql = "INSERT INTO transaccion_solicitud(
                               id_status_solicitud, id_funcionario_ini, f_transaccion, 
                               id_usuario, id_solicitud)
                        VALUES (".$status.",".$func_ini.", '".$fecha."',".$usuario.",".$nroSol.");"; 
            }else{
              $sql = "INSERT INTO transaccion_solicitud(
                               id_status_solicitud, id_funcionario_ini, f_transaccion, 
                               id_funcionario_fin, id_usuario, id_solicitud)
                        VALUES (".$status.",".$func_ini.", '".$fecha."', 
                               ".$func_fin.",".$usuario.",".$nroSol.");";
            }
               
             $query = $db->pgquery($sql);
             
             if($query){
                $bool = true;
             }else{
                $bool = false;
             }  
             
           return $bool; 
         }


         function getFuncIni($solicitud){

          $db      = Database::getInstance();

          $sql = "SELECT id_funcionario_fin
                    FROM transaccion_solicitud
                   WHERE id_solicitud = ".$solicitud."
                   ORDER BY id_transaccion_sol DESC
                   LIMIT 1;";

          $query   = $db->pgquery($sql);
          $numRows = $db->pgNumrows($query);

          if($numRows > 0){

             $row  = $db->pgfetch($query);
             $func = $row["id_funcionario_fin"]; 

          }          
          return $func;

         }

   //Funcion para Ejecutar Cualquier Query
  
      function getSQL($sql,$action){
            
           $db   = Database::getInstance();      
         //Reporte de Siacvisa

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);
           $arrRec  = array();

           if($numRows > 0){
            
               for($i = 0;$i<count($action);$i++){

                if($action[$i] == 'query'){

                   $arrRec[$i]['query'] = $query; 
                }

                if($action[$i] == 'rows'){

                   $row = $db->pgfetch($query);
                   $arrRec[$i]['rows'] = $row;
                }

                if($action[$i] =='numrows'){
                  
                   $arrRec[$i]['numrows'] = $numRows;

                }

           }
         }
          return $arrRec;
      }  //Fin Siacvisa    


     function getIdFunc($func){

          $db   = Database::getInstance();      
        
          $sql ="SELECT id_funcionario 
                   FROM funcionario
                  WHERE cedula_pasaporte ='".$func."';";

          $query   = $db->pgquery($sql);
          $numRows = $db->pgNumrows($query);

          if($numRows > 0){

             $row = $db->pgfetch($query);
             
             $fDato = $row["id_funcionario"];     
          }
       return $fDato;   
     }

     function getFuncTrans($area,$coor,$rol,$noFunc){
        $db   = Database::getInstance();      
        
          $sql ="SELECT f.id_funcionario
            FROM funcionario f,funcionario_rol fr
            WHERE f.id_area = ".$area."
            AND f.id_coordinacion = ".$coor."
              AND f.id_status = 1
                AND fr.id_rol_funcional = ".$rol."
                  AND f.id_funcionario = fr.id_funcionario  
                    AND f.id_funcionario NOT IN(".$noFunc.");";

          $query   = $db->pgquery($sql);
          $numRows = $db->pgNumrows($query);

          if($numRows > 0){
             $row = $db->pgfetch($query);
             $fDato = $row["id_funcionario"];     
          }

        return $fDato;   
     }
     /////////nuevo codigo para envase y empaque
    function abrevPermiEnv($solType){
    $db   = Database::getInstance();      
    $sql ="SELECT * FROM clase_prod_ee WHERE id_clase_ee =".$solType.";";
    $query   = $db->pgquery($sql);
    $numRows = $db->pgNumrows($query);
     if($numRows > 0){
             $row = $db->pgfetch($query);
             $permi = $row["abrev"];
          }else{
          $permi = 'N/A';
        }
      return $permi; 
    } 
      //envase enpanque
   function getNumeroPEnv($type){// para envase y empaque
        $db = Database::getInstance();
      if ($type >=1){
        $sql ="SELECT max(n_permiso) AS nro_permiso FROM permiso_eea;";
        $query   = $db->pgquery($sql);
        $numrows = $db->pgNumrows($query);
        }if($numrows > 0){
           $row = $db->pgfetch($query);
           $nPermiso = $row["nro_permiso"] + 1;
        }  $prueba = setNumeroPEnv($nPermiso);
        return $nPermiso;
  }
 function setNumeroPEnv($num){
  $db  = Database::getInstance();
  $sql ="INSERT INTO permiso_eea (n_permiso,f_generado) VALUES (".$num.",'".getTime()."');";
         $query = $db->pgquery($sql);
         return;
  } 

?>