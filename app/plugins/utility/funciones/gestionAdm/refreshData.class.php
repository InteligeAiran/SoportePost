<?php
require_once 'path/to/Database.php';
   /* 
    * Clase :   refreshData.class.php
    * Objetivo: La Clase tiene como proposito actualizar los datos 
    *           Del Registro de un Producto Alimenticio o Bebida Alcohólica
    *           Tanto Nacional Como Importad Cada Vez que se Apruebe una 
    *           Solicitud de Notificacion o de Registro Nuevo.
    */          
  

  class RefreshData extends Model{
      
   //Atributos de la Clase
     
     private $nroSol; 
     private $tipoSol;
     private $nroRegistro;
     private $categoriaSol;
     private $area;
     private $tablaRef;
     private $solRefer;
     private $db;
     private $solOrig;

     //Llamo al Constructor de la Clase 

        function __construct(){

              parent:: __construct();               
        }

     public function RefreshData(){

         $this->id_empresa        = '';
         $this->id_solicitud      = '';
         $this->d_numero_registro = '';

        $this->db = Database::getInstance(); 

     } 

//Metodo que busca la solicitud de Referencia  
     public function solRef($nroSol){
         
      //Inicializo las variables  
        $this->nroSol = $nroSol;
      
      //Buscar la Informacion 
        $sql ="SELECT * 
                 FROM solicitud  
                WHERE id_solicitud=".$this->nroSol.";";
       $query = @pg_query($sql);
       $numR  = @pg_num_rows($query);

      if($numR > 0){
         $row = @pg_fetch_array($query);

         //Inicializo las Variables 
           $this->tipoSol       = $row["id_tipo_solicitud"];
           $this->nroRegistro   = $row["d_numero_sanitario"];
           $this->categoriaSol  = $row["id_categoria_solicitud"];
           $this->area          = $row["id_area"];  
      }

      //Llama al Metodo para las Tablas 
        //$tabla = $this->getData_not();

        return $this->tipoSol;
  }
  
    //Busca los datos de la Solicitud de Referencia
/*
  private function getData_not(){
        
        //Busca la Tabla Correspondiente
          $getTabla = $this->defineTable();

        //Llama al Metodo que corresponde 
          $metodo = $this->$getTabla;

       return $metodo;
  }
*/

//Metodo para buscar la Tabla por Tramite 
private function defineTable($val){

       $tablas = array();
     //Busco  el Numero de Referencia

       $tablas=array(
                     5=>'ajuste_grado',
                     6=>'cambio_denominacion',
                     7=>'cambio_formula',
                     8=>'cambio_fabricante',
                     9=>'cambio_marca',
                    10=>'cambio_cont_neto',
                    11=>'cambio_rotulo',
                    12=>'cambio_razon_importador',
                    13=>'cambio_razon_fab',
                    14=>'cambio_razon_tit',
                    15=>'cambio_titular',
                    17=>'cambio_lug_fab',
                    18=>'inclu_distribuidor',
                    19=>'inclu_importador',
                    20=>'inclu_planta_fabricante',
                    21=>'inclu_planta_env',
                    22=>'inclu_cont_neto',
                    23=>'inclu_material',
                    24=>'inclu_export',
                    25=>'inclu_promocional',
                    26=>'exclu_distribuidor',
                    27=>'exclu_importador',
                    28=>'exclu_planta_fabricante',
                    29=>'exclu_planta_env',
                    30=>'exclu_cont_neto',
                    31=>'exclu_material',
                    32=>'renovacion_registro',
                    33=>'renovacion_registro',
                    34=>'renovacion_registro',
                    35=>'renovacion_registro'
                 );

          $defTabla = $tablas[$val];

          return $defTabla; 
         
      }  //Fin defineTable()

/*
 *###############################################
 * REGISTRO ORIGINAL DE DATOS DEL NUEVO REGISTRO
 *##############################################
*/

//Metodo que Actualiza los datos del registro original 
public function setOriginal($nroSol,$type,$numReg){
   
     $this->solOrig  = $nroSol;
     $this->tipoSol  = $type;
     $this->numReg   = $numReg;
     //$this->db       = Database::getInstance(); 

   //Ejecuta el Registro Basico
     $this->setSolicitud();
     $this->setProducto();
     $this->setProdEnvase();
     $this->setProdPresent();
     $this->setComposicion();
     $this->setConsProducto();
     $this->setEmpresa();
     $this->setPresEnvase();
     $this->setProdEmpresa();

  //Verificar si carga los demas datos 
    
     switch($type){
        case 1:
        //Buscar si la Solicitud tiene planta
          $numRow = $this->getPlanta();
          if($numRow > 0){
             $this->setSolPlanta();
             
          }
        break;
        case 2:
          //Certificado de Importacion
          $this->setCertImport();
        break;
        case 3:
          //Componentes Adicionales
            $this->setCompAdicion();
        break;
        case 4:
          
           $this->setCertImport();     //Certificado Importacion
           $this->setCompAdicion();    //Componentes Adicionales 
        break;

     }
       

  return true;  

}

//Copiar datos de la solicitud en r_original 
 public function setSolicitud(){

        $sql = "INSERT INTO r_original.solicitud(id_solicitud,
                                                 id_tipo_solicitud,
                                                 id_usuario,
                                                 id_status_solicitud,
                                                 d_numero_sanitario,
                                                 f_solicitud,
                                                 f_recepcion,
                                                 f_status,
                                                 d_obser_func,
                                                 id_funcionario,
                                                 id_status,
                                                 id_categoria_solicitud,
                                                 id_area,
                                                 d_obser_usuario,
                                                 id_coordinacion)
                SELECT id_solicitud,id_tipo_solicitud,id_usuario,
                       id_status_solicitud,
                       d_numero_sanitario,
                       f_solicitud,
                       f_recepcion,
                       f_status,
                       d_obser_func,
                       id_funcionario,
                       id_status,
                       id_categoria_solicitud,
                       id_area,
                       d_obser_usuario,
                       id_coordinacion 
                  FROM public.solicitud
                 WHERE id_solicitud =".$this->solOrig.";";

         $query = @pg_query($sql);          
    //Envio la Respuesta
    if($query){
      return true;   
    }else{
      return false;
    }
   
 }

//Obtener la Informacion de la Planta Fabricante
public function getPlanta(){
      
      $this->db = Database::getInstance(); 
     $sql="SELECT n_planta
             FROM public.solicitud_planta
           WHERE id_solicitud =".$this->solOrig."
             AND id_actividad = 2
             AND n_planta = 1;";

     $query   = $this->db->pgquery($sql);
     $numRows = $this->db->pgNumrows($query);

 return $numRows; 

}//Fin 

//Insertar Datos de la Composicion
public function setComposicion(){

  $sql = "INSERT 
            INTO r_original.composicion(id_solicitud,id_unidad_medida,
                                        d_ingrediente,id_aditivo,cant_ingrediente,
                                        id_tipo_composicion,id_status,d_funcion)
          SELECT id_solicitud,id_unidad_medida,
                 d_ingrediente,id_aditivo,cant_ingrediente,
                 id_tipo_composicion,id_status,d_funcion
            FROM public.composicion                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = @pg_query($sql);         

  if($query){
     return true;
  }else{
     return false;
  }
}//Fin 

//Inserta Daos de Conservacion del Producto
public function setConsProducto(){

    $sql = "INSERT 
            INTO r_original.conservacion_producto(id_solicitud,id_clase_prod,d_modo_conservacion,
                                                  n_cant_conservacion,d_tiempo,d_segun_vida,
                                                  d_codigo_lote,d_descripcion_lote)
          SELECT id_solicitud,id_clase_prod,d_modo_conservacion,
                 n_cant_conservacion,d_tiempo,d_segun_vida,
                 d_codigo_lote,d_descripcion_lote
            FROM public.conservacion_producto                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = @pg_query($sql); 

  if($query){
     return true;
  }else{
    return false;
 }
} //Fin 
//Inserta Datos en la Tabla Prsentacion Envase
public function setPresEnvase(){

  $sql = "INSERT 
            INTO r_original.presentacion_envase(id_solicitud,id_prod_envase,id_prod_presentacion)
          SELECT id_solicitud,id_prod_envase,id_prod_presentacion
            FROM public.presentacion_envase                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = @pg_query($sql);
  
  if($query){
     return true;
  }else{
     return false;
  }

}//Fin 

//Inserta Datos del Producto
private function setProducto(){

   $sql = "INSERT 
            INTO r_original.producto(id_solicitud,id_tipo_prod,id_clase_prod,
                                     id_subclase_prod,d_denomina,d_marca,d_arancel,
                                     d_fantasia,id_forma_elaboracion,id_origen_prod)  
          SELECT id_solicitud,id_tipo_prod,id_clase_prod,
                 id_subclase_prod,d_denomina,d_marca,d_arancel,
                 d_fantasia,id_forma_elaboracion,id_origen_prod
            FROM public.producto                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = @pg_query($sql);
  
  if($query){
      return true;
  }else{
      return false;
  }

} //Fin 

//Insertar los datos del registro en producto envase
public function setProdEnvase(){

   $sql = "INSERT 
            INTO r_original.producto_envase(id_solicitud,id_autorizacion_envase,
                                            f_autorizacion,d_desc_envase,d_uso_envase)  
          SELECT id_solicitud,id_autorizacion_envase,
                 f_autorizacion,d_desc_envase,d_uso_envase
            FROM public.producto_envase                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = @pg_query($sql);

if($query){
  return true;
}else{
  return false;
}
}

//Insertar los datos de producto presentacion
private function setProdPresent(){

  $sql = "INSERT 
            INTO r_original.producto_presentacion(id_producto,id_solicitud,
                                                  contenido_neto,id_unidad_medida,
                                                  d_autorizacion)  
          SELECT id_producto,id_solicitud,
                 contenido_neto,id_unidad_medida,
                 d_autorizacion
            FROM public.producto_presentacion                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = @pg_query($sql);


}

//Inserta los datos en solicitud empresa
private function setEmpresa(){

    $sql = "INSERT 
            INTO r_original.solicitud_empresa(id_solicitud,id_empresa,id_actividad,
                                              id_tipo_empresa,n_planta)  
          SELECT id_solicitud,id_empresa,id_actividad,
                 id_tipo_empresa,n_planta
            FROM public.solicitud_empresa                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = @pg_query($sql);

}

//Insertar los datos del certificado de importacion
private function setCertImport(){

    $this->db = Database::getInstance(); 
    $sql = "INSERT 
            INTO r_original.certificado_importacion(id_solicitud,f_expedicion,id_pais,
                                                    d_ente_emisor)  
          SELECT id_solicitud,f_expedicion,id_pais,
                 d_ente_emisor
            FROM public.certificado_importacion                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = $this->db->pgquery($sql);

}

//Insertar los datos de Componenetes adicionales 
private function setCompAdicion(){
    $this->db = Database::getInstance(); 
    $sql = "INSERT 
            INTO r_original.componentes_adicionales(id_solicitud,id_clase_prod,n_grado_alcohol,
                                                    d_tiempo_envegecimiento,d_cert_denominacion_origen,
                                                    d_cepas_vino)  
          SELECT id_solicitud,id_clase_prod,n_grado_alcohol,
                 d_tiempo_envegecimiento,d_cert_denominacion_origen,
                 d_cepas_vino
            FROM public.componentes_adicionales                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = $this->db->pgquery($sql);

}

//Insertar los datos de producto zona 
private function setProdZona(){
    $this->db = Database::getInstance();  
    $sql = "INSERT 
            INTO r_original.producto_zona(id_solicitud,id_pres_envase,id_zona_comer,
                                          id_tiempo,fecha_inicial,fecha_final)  
          SELECT id_solicitud,id_pres_envase,id_zona_comer,
                 id_tiempo,fecha_inicial,fecha_final
            FROM public.producto_zona                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = $this->db->pgquery($sql);

}

//Insertar los datos de Solicitud Planta
private function setSolPlanta(){
    $this->db = Database::getInstance(); 
    $sql = "INSERT 
            INTO r_original.solicitud_planta(id_solicitud,id_empresa,
                                             id_planta_fabricante)  
          SELECT id_solicitud,id_empresa,id_planta_fabricante
            FROM public.solicitud_planta                   
           WHERE id_solicitud =".$this->solOrig.";";

  $query = $this->db->pgquery($sql);

}
 
//Insertar los datos de Solicitud Empresa
 public function setProdEmpresa(){

        //Instancia la conexion a la BD
          $this->db = Database::getInstance(); 
        
         $sql = "SELECT sol.id_usuario,sol.id_area,sol.d_numero_sanitario         FROM solicitud sol
                   WHERE sol.id_solicitud = ".$this->solOrig."
                ";

         $query   = $this->db->pgquery($sql);
         $numRows = $this->db->pgNumrows($query);

         if($numRows > 0 ){
            $row = $this->db->pgfetch($query);

            $sql4 = "SELECT id_empresa,id_tipo_empresa FROM solicitud_empresa
                      WHERE id_solicitud = ".$this->solOrig."
                      AND id_actividad = 1
                      ";
            $query4   = $this->db->pgquery($sql4);
            $row4     = $this->db->pgfetch($query4);

            switch ($row4["id_tipo_empresa"]) {
              case 1:
                $sql2 = "SELECT rif FROM empresa_nacional 
                            WHERE id_empresa =".$row4["id_empresa"]."
                        ";
                $query2   = $this->db->pgquery($sql2);
                $row2     = $this->db->pgfetch($query2);
                $val      = $row2["rif"];
              break;
              case 2:
                $val      = $row4["id_empresa"];
              break;
            }
           //Registrar datos en producto_empresa
            
             $sql3   = "INSERT INTO producto_empresa(id_rif,id_status_producto,id_usuario,id_area,d_numero_sanitario,id_solicitud)
                             VALUES('".$val."',1,".$row['id_usuario'].",".$row['id_area'].",
                                    '".$this->numReg."',".$this->solOrig.");";

             $query3 = $this->db->pgquery($sql3);            

         }         
  return;
} 

private function getRif_Id($type,$id){

     $db = Database::getInstance();
     
     switch($type){
        
        case 1:
         $sql ="SELECT rif 
                  FROM empresa_nacional
                 WHERE id_empresa =".$id.";";  

         $query   = $db->pgquery($sql);
         $numRows = $db->pgNumrows($query);

         if($numRows > 0){

            $row = $db->pgfetch($query);

            $id_empresa = $row["rif"];
         }         
        break;
        case 2:

         $id_empresa = $id;  
        break;

     }
     
  return $id_empresa;
}     

/********************************************
 * ACTUALIZACION DE DATOS PARA NOTIFICACIONES
 * *******************************************   
 */

//Aplica el Cambio de Notificacion 

        public function setNotifica($nro,$type){

               $this->nroSol2  = $nro;
               $this->tipoSol2 = $type;
               $this->db2      = Database::getInstance(); 
               
            //Busca la Funcion que corresponde
              $arrCambio = $this->injectCambio($type);
              $func      = $arrCambio["table"];

            //Ejecuta la Funcion que actualiza los Cambios
              $dato = $this->$func($nro);  

         return $dato;        

        }

 private function injectCambio($typeSol){

                $arrDestino = array(5=>array("table"=>"ajuste_grado"),
                                    6=>array("table"=>"cambio_denominacion"),
                                    7=>array("table"=>"cambio_formula"),
                                    8=>array("table"=>"cambio_fabricante"),
                                    9=>array("table"=>"cambio_marca"),
                                    10=>array("table"=>"cambio_cont_neto"),
                                    11=>array("table"=>"cambio_rotulo"),
                                    12=>array("table"=>"cambio_razon_importador"),
                                    13=>array("table"=>"cambio_razon_fabricante"),
                                    14=>array("table"=>"cambio_razon_tit"),
                                    15=>array("table"=>"cambio_titular"),
                                    17=>array("table"=>"cambio_lug_fab"),
                                    18=>array("table"=>"inclu_distribuidor"),
                                    19=>array("table"=>"inclu_importador"),
                                    20=>array("table"=>"inclu_planta_fabricante"),
                                    21=>array("table"=>"inclu_planta_env"),
                                    22=>array("table"=>"inclu_cont_neto"),
                                    23=>array("table"=>"inclu_material"),
                                    24=>array("table"=>"inclu_export"),
                                    25=>array("table"=>"inclu_promocional"),
                                    26=>array("table"=>"exclu_distribuidor"),
                                    27=>array("table"=>"exclu_importador"),
                                    28=>array("table"=>"exclu_planta_fabricante"),
                                    29=>array("table"=>"exclu_planta_env"),
                                    30=>array("table"=>"exclu_cont_neto"),
                                    31=>array("table"=>"exclu_material"),
                                    32=>array("table"=>"renovacion_registro"),
                                    33=>array("table"=>"renovacion_registro"),
                                    34=>array("table"=>"renovacion_registro"),
                                    35=>array("table"=>"renovacion_registro"),
                                    40=>array("table"=>"inclu_pres_zonacomer")
                                    );

                             

             $table = $arrDestino[$typeSol];

           return $table; 
        }

   //Ajuste de Grado Alcoholico (5) 
    public function ajuste_grado(){
      
     $db = Database::getInstance();

           $sql = "SELECT * 
                     FROM ajuste_grado
                    WHERE id_solicitud =".$this->nroSol2.";";

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);

           if($numRows > 0){

              $row = $db->pgfetch($query);
              
              $data = array('id_solicitud'      => $this->nroSol2,
                            'n_solicitud_ref'   => $row['n_solicitud_ref'],
                            'n_grado_actual'    => $row['n_grado_actual'],
                            'd_denomina_actual' => $row['d_denomina_actual'],
                            'd_numero_registro' => $row['d_numero_registro']);

        //Actualiza la Denominacion y el Grado Alcoholico*/              
          $sql2 = "UPDATE producto
                      SET d_denomina ='".$data['d_denomina_actual']."'
                    WHERE id_solicitud = ".$data['n_solicitud_ref'].";";

          

        //Actualiza la Otra Tabla
           $sql2 .= "UPDATE componentes_adicionales
                        SET n_grado_alcohol =".$data['n_grado_actual']."
                      WHERE id_solicitud = ".$data['n_solicitud_ref'].";";

           $query2 = $db->pgquery($sql2);         
          
          if($query2){
             
             $result = true;

          }else{
            $result = false;            
          }                
    }
    return $result;
  }
  
   //"CAMBIO DE LA DENOMINACIÓN DEL PRODUCTO" (6)
    public function cambio_denominacion(){
      $db = Database::getInstance();

           $sql = "SELECT * 
                     FROM cambio_denominacion
                    WHERE id_solicitud =".$this->nroSol2.";";

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);

           if($numRows > 0){

              $row = $db->pgfetch($query);
              
              $data = array('id_solicitud'      => $this->nroSol2,
                            'n_solicitud_ref'   => $row['n_solicitud_ref'],
                            'd_denomina_actual' => $row['d_denomina_actual'],
                            'd_fantasia_actual' => $row['d_fantasia_actual'],
                            'd_tipo_denomina'   => $row['d_tipo_denomina'],
                            'd_numero_registro' => $row['d_numero_registro']);
         
        //Actualiza la Denominacion y el Grado Alcoholico*/ 
          switch($data['d_tipo_denomina']){
            case 1:

             $sql2 = "UPDATE producto
                         SET d_denomina ='".$data['d_denomina_actual']."'
                    WHERE id_solicitud = ".$data['n_solicitud_ref'].";";
            break;
            case 2:

               $sql2 = "UPDATE producto
                           SET d_fantasia_actual = '".$data['d_fantasia_actual']."'
                         WHERE id_solicitud = ".$data['n_solicitud_ref'].";";

            break;
            case 3:

              $sql2 = "UPDATE producto
                          SET d_denomina ='".$data['d_denomina_actual']."',
                              d_fantasia_actual = '".$data['d_fantasia_actual']."'
                        WHERE id_solicitud = ".$data['n_solicitud_ref'].";";

            break;
          }             
          $query2 = $db->pgquery($sql2);         
          
          if($query2){
             
             $result = true;

          }else{
            $result = false;            
          }                
    }
    return $result;

    }

//"CAMBIO DE INGREDIENTE SECUNDARIO DE LA FÓRMULA" (7)
    public function cambio_formula(){
      $text = "cambio_formula";

      return $text;
    }

    //"CAMBIO DEL FABRICANTE DEL PRODUCTO" (8)
    public function cambio_fabricante(){

       $db = Database::getInstance();

           $sql = "SELECT id_solicitud,n_solicitud_ref,d_numero_registro,
                          id_empresa_actual,id_empresa_anterior,n_tipo_empresa  
                     FROM cambio_fabricante
                    WHERE id_solicitud =".$this->nroSol2.";";

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);

           if($numRows > 0){

              $row = $db->pgfetch($query);
              
              $data = array('id_solicitud'        => $this->nroSol2,
                            'n_solicitud_ref'     => $row['n_solicitud_ref'],
                            'id_empresa_anterior' => $row['id_empresa_anterior'],
                            'id_empresa_actual'   => $row['id_empresa_actual'],
                            'n_tipo_empresa'      => $row['n_tipo_empresa'],
                            'd_numero_registro'   => $row['d_numero_registro']);

          //Actualiza la Denominacion y el Grado Alcoholico*/              
          $sql2 = "UPDATE solicitud_empresa
                      SET id_empresa =".$data['id_empresa_actual'].",
                          id_tipo_empresa =".$data['n_tipo_empresa']."
                    WHERE id_solicitud = ".$data['n_solicitud_ref']."
                      AND id_actividad = 2
                      AND id_empresa =".$data['id_empresa_anterior'].";";

           $query2 = $db->pgquery($sql2);         
          
          if($query2){
             
             $result = true;

          }else{
            $result = false;            
          }                
    }
     
    return $result;
    }
    

    //"CAMBIO DE LA MARCA COMERCIAL DEL PRODUCTO" (9)
    public function cambio_marca(){

      $db = Database::getInstance();

           $sql = "SELECT id_solicitud,n_solicitud_ref,d_numero_registro,
                          d_marca_actual  
                     FROM cambio_marca
                    WHERE id_solicitud =".$this->nroSol2.";";

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);

           if($numRows > 0){

              $row = $db->pgfetch($query);
              
              $data = array('id_solicitud'      => $this->nroSol2,
                            'n_solicitud_ref'   => $row['n_solicitud_ref'],
                            'd_marca_actual'    => $row['d_marca_actual'],
                            'd_numero_registro' => $row['d_numero_registro']);

        //Actualiza la Denominacion y el Grado Alcoholico*/              
          $sql2 = "UPDATE producto
                      SET d_marca ='".$data['d_marca_actual']."'
                    WHERE id_solicitud = ".$data['n_solicitud_ref'].";";

           $query2 = $db->pgquery($sql2);         
          
          if($query2){
             
             $result = true;

          }else{
            $result = false;            
          }                
    }
     
    return $result;
     
    }

 //"CAMBIO DE PRESENTACIÓN DE CONTENIDO NETO" (10)
    public function cambio_cont_neto(){
      $text = "cambio_cont_neto";

      return $text;
    }
    
    //"CAMBIO DE PRESENTACIÓN DE DISEÑO DE RÓTULO" (11)
    public function cambio_rotulo(){
      $text = "cambio_rotulo";

      return $text;
    }

   //"CAMBIO DE LA RAZÓN SOCIAL DEL IMPORTADOR" (12)
    public function cambio_razon_importador(){

      $db = Database::getInstance();

           $sql = "SELECT id_solicitud,n_solicitud_ref,d_numero_registro,
                          id_empresa,d_empresa_actual  
                     FROM cambio_razon_importador
                    WHERE id_solicitud =".$this->nroSol2.";";

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);

           if($numRows > 0){

              $row = $db->pgfetch($query);
              
              $data = array('id_solicitud'      => $this->nroSol2,
                            'n_solicitud_ref'   => $row['n_solicitud_ref'],
                            'id_empresa'        => $row['id_empresa'],
                            'd_empresa_actual'  => $row['d_empresa_actual'],
                            'd_numero_registro' => $row['d_numero_registro']);

        //Actualiza la Denominacion y el Grado Alcoholico*/              
          $sql2 = "UPDATE empresa_nacional
                      SET d_nombre ='".$data['d_empresa_actual']."'
                    WHERE id_empresa = ".$data['id_empresa'].";";

           $query2 = $db->pgquery($sql2);         
          
          if($query2){
             
             $result = true;

          }else{
            $result = false;            
          }                
    }
    return $result;
      
    }
    
   //"CAMBIO DE LA RAZÓN SOCIAL DEL FABRICANTE DEL PRODUCTO" (13)
    public function cambio_razon_fabricante(){

      $db = Database::getInstance();

           $sql = "SELECT id_solicitud,n_solicitud_ref,d_numero_registro,
                          id_empresa,id_tipo_empresa,d_empresa_actual  
                     FROM cambio_razon_fab
                    WHERE id_solicitud =".$this->nroSol2.";";

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);

           if($numRows > 0){

              $row = $db->pgfetch($query);
              
              $data = array('id_solicitud'      => $this->nroSol2,
                            'n_solicitud_ref'   => $row['n_solicitud_ref'],
                            'id_empresa'        => $row['id_empresa'],
                            'id_tipo_empresa'   => $row['id_tipo_empresa'],
                            'd_empresa_actual'  => $row['d_empresa_actual'],
                            'd_numero_registro' => $row['d_numero_registro']);

        //Actualiza la Denominacion y el Grado Alcoholico*/              
          switch($data['id_tipo_empresa']){

            case 1:
              $sql2 = "UPDATE empresa_nacional
                      SET d_nombre ='".$data['d_empresa_actual']."'
                    WHERE id_empresa = ".$data['id_empresa'].";";
            break;
            case 2:
              $sql2 = "UPDATE empresa_extranjera
                          SET d_nombre ='".$data['d_empresa_actual']."'
                        WHERE id_empresa_extranjera = ".$data['id_empresa'].";";
            break;
          }    

           $query2 = $db->pgquery($sql2);         
          
          if($query2){
             
             $result = true;

          }else{
            $result = false;            
          }                
    }
    return $result;
    }
    
    //"CAMBIO DE LA RAZÓN SOCIAL DE TITULAR DEL REGISTRO" (14)

    public function cambio_razon_tit(){

      $db = Database::getInstance();

           $sql = "SELECT id_solicitud,n_solicitud_ref,d_numero_registro,
                          id_empresa,id_tipo_empresa,d_empresa_actual  
                     FROM cambio_razon_tit
                    WHERE id_solicitud =".$this->nroSol2.";";

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);

           if($numRows > 0){

              $row = $db->pgfetch($query);
              
              $data = array('id_solicitud'      => $this->nroSol2,
                            'n_solicitud_ref'   => $row['n_solicitud_ref'],
                            'id_empresa'        => $row['id_empresa'],
                            'id_tipo_empresa'   => $row['id_tipo_empresa'],
                            'd_empresa_actual'  => $row['d_empresa_actual'],
                            'd_numero_registro' => $row['d_numero_registro']);

        //Actualiza la Denominacion y el Grado Alcoholico*/              
          switch($data['id_tipo_empresa']){

            case 1:
              $sql2 = "UPDATE empresa_nacional
                      SET d_nombre ='".$data['d_empresa_actual']."'
                    WHERE id_empresa = ".$data['id_empresa'].";";
            break;
            case 2:
              $sql2 = "UPDATE empresa_extranjera
                          SET d_nombre ='".$data['d_empresa_actual']."'
                        WHERE id_empresa_extranjera = ".$data['id_empresa'].";";
            break;
          }    

           $query2 = $db->pgquery($sql2);         
          
          if($query2){
             
             $result = true;

          }else{
            $result = false;            
          }                
    }
    return $result;
    }


    //"CAMBIO DEL TITULAR DEL REGISTRO" (15)
    public function cambio_titular(){

      $db = Database::getInstance();

           $sql = "SELECT id_solicitud,n_solicitud_ref,d_numero_registro,
                          id_empresa_actual,id_tipo_empresa  
                     FROM cambio_titular
                    WHERE id_solicitud =".$this->nroSol2.";";

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);

           if($numRows > 0){

              $row = $db->pgfetch($query);
              
              $data = array('id_solicitud'      => $this->nroSol2,
                            'n_solicitud_ref'   => $row['n_solicitud_ref'],
                            'id_empresa_actual' => $row['id_empresa_actual'],
                            'id_tipo_empresa'   => $row['id_tipo_empresa'],
                            'id_rif'            => $this->getRif_Id($row['id_tipo_empresa'],$row['id_empresa_actual']),
                            'd_numero_registro' => $row['d_numero_registro']);

        //Actualiza la Denominacion y el Grado Alcoholico*/              
          
              $sql2 = "UPDATE solicitud_empresa
                          SET id_empresa ='".$data['id_empresa_actual']."',
                              id_tipo_empresa =".$data["id_tipo_empresa"]."  
                        WHERE id_solicitud = ".$data['n_solicitud_ref']."
                          AND id_actividad = 1;";

              $sql2 .= "UPDATE producto_empresa
                           SET id_rif ='".$data['id_rif']."'
                         WHERE d_numero_sanitario ='".$data['d_numero_registro']."';";             
          
          }    

           $query2 = $db->pgquery($sql2);         
          
          if($query2){
             
             $result = true;

          }else{
            $result = false;            
          } 
      return $result;                   
    }

//"CAMBIO DE DIRECCIÓN DEL IMPORTADOR" (17)
    public function cambio_lug_fab(){
      $text = "cambio_lug_fab";

      return $text;
    }

  //INCLUSION DE DISTRIBUIDOR (18)
    public function inclu_distribuidor(){
      $text = "inclu_distribuidor";

      return $text;
    }
    
  //"INCLUSIÓN DE NUEVO DISTRIBUIDOR" (19)
    public function inclu_importador($nro){
      
        //Busca los Cambiso y Numero de Referencia
           $db = Database::getInstance();

           $sql = "SELECT * 
                     FROM inclu_importador
                    WHERE id_solicitud =".$nro.";";

           $query   = $db->pgquery($sql);
           $numRows = $db->pgNumrows($query);

           if($numRows > 0){

              $row = $db->pgfetch($query);
              
              $data = array('id_solicitud'    => $nro,
                            'n_solicitud_ref' => $row['n_solicitud_ref'],
                            'id_empresa'      => $row['id_empresa'],
                            'id_actividad'    => 5,
                            'id_tipo_empresa' => 1,
                            'n_planta'        => 0);


           //Inserta el Importador en el Original
           
             $sql2 = "INSERT INTO solicitud_empresa(id_solicitud,
                                                    id_empresa,
                                                    id_actividad,
                                                    id_tipo_empresa,
                                                    n_planta)
                            VALUES(".$data['n_solicitud_ref'].",
                                   ".$data['id_empresa'].",
                                   ".$data['id_actividad'].",
                                   ".$data['id_tipo_empresa'].",
                                   ".$data['n_planta'].");";

            if($query = $db->pgquery($sql2)){

                $result = true;
              }
           } 
      return $result;
    }
    
 //INCLUSIÓN DE NUEVA PLANTA FABRICANTE (20)
    public function inclu_planta_fabricante(){
      $text = "inclu_planta_fabricante";
      //1. Get Id_empresa

      return $text;
    }


    //"INCLUSIÓN DE NUEVA PLANTA ENVASADORA (21)
    public function inclu_planta_env(){
      $text = "inclu_planta_env";

      return $text;
    }
    
   //INCLUSION DE NUEVA PRESENTACION DE CONTENIDO NETO  (22)
    public function inclu_cont_neto($nro){
     //Buscar el Dato de la Solicitud
      $this->db2 = Database::getInstance(); 
   
        $sql = "SELECT inc.*,(SELECT p.id_producto
                                FROM producto p
                               WHERE inc.n_solicitud_ref = p.id_solicitud),
                              (SELECT e.id_autorizacion_envase
                                 FROM producto_envase e
                                WHERE inc.id_prod_envase = e.id_prod_envase)     
                 FROM inclu_cont_neto inc
                WHERE inc.id_solicitud =".$nro.";";

         
         $arrActiv = array('query','numrows');        

            $getPg = @getSQL($sql,$arrActiv);          

           $query  = $getPg[0]['query'];
           $numrow = $getPg[1]['numrows'];

          if($numrow > 0){
             
             //Organiza los Datos

               for($i=0; $i<$numrow;$i++){

                   $row = @pg_fetch_array($query,$i);

                   $data[$i] = array('n_solicitud_ref'        => $row['n_solicitud_ref'],
                                     'n_contenido_neto'       => $row['n_contenido_neto'],
                                     'id_unidad_medida'       => $row['id_unidad_medida'],
                                     'id_prod_envase'         => $row['id_prod_envase'],
                                     'id_autorizacion_envase' => $row['id_autorizacion_envase'],
                                     'id_producto'            => $row['id_producto']); 
               }

               //Inserta en las Tablas
              $sql2="";

              for($k =0;$k<count($data);$k++){

               $sql2.= "INSERT INTO producto_presentacion(id_producto,
                                                          id_solicitud,
                                                          contenido_neto,
                                                          id_unidad_medida)
                             VALUES (".$data[$k]['id_producto'].",
                                     ".$data[$k]['n_solicitud_ref'].",
                                     '".$data[$k]['n_contenido_neto']."',
                                     ".$data[$k]['id_unidad_medida'].");";
                                

              $sql2.="INSERT INTO presentacion_envase(id_solicitud,
                                                      id_prod_envase,
                                                      id_prod_presentacion)
                           VALUES(".$data[$k]['n_solicitud_ref'].",
                                  ".$data[$k]['id_prod_envase'].",
                                  (SELECT max(id_prod_presentacion) 
                                     FROM producto_presentacion 
                                    WHERE id_solicitud=".$data[$k]['n_solicitud_ref']."));";
            }

             if($query2 = $this->db2->pgquery($sql2)){

                 $bool =true;
              }else{
                $bool = false;
              }

          }

      return $bool;
    }
    
     //INCLUSÓN DE NUEVA PRESENTACIÓN DE MATERIAL DE ENVASE O EMPAQUE (23)
    public function inclu_material($nro){

      //Buscar Datos de la Solicitud
        $this->db2 = Database::getInstance(); 

        $sql = "SELECT incM.*,s.id_categoria_solicitud
                  FROM inclu_material incM
            RIGHT JOIN solicitud s
                    ON incM.n_solicitud_ref = s.id_solicitud 
                 WHERE incM.id_solicitud =".$nro.";";

         $arrActiv = array('rows','numrows');        
            $getPg = @getSQL($sql,$arrActiv);          

           $row    = $getPg[0]['rows'];
           $numrow = $getPg[1]['numrows'];

          if($numrow > 0){

             //Verifica si es nacional o Importado 
             //Organiza los Datos
                   $data = array('n_solicitud_ref'        => $row['n_solicitud_ref'],
                                 'd_material_contenedor'  => $row['d_material_contenedor'],
                                 'n_otorgado_higiene'     => $row['n_otorgado_higiene'], 
                                 'f_otorgado_higiene'     => $row['f_otorgado_higiene'],
                                 'd_uso'                  => $row['d_uso']
                                  ); 

                $sql2= "INSERT INTO producto_envase(id_solicitud,id_autorizacion_envase,f_autorizacion,d_desc_envase,d_uso_envase)
                         VALUES (".$data['n_solicitud_ref'].",
                                 ".$data['n_otorgado_higiene'].",
                                '".$data['f_otorgado_higiene']."',
                                '".$data['d_material_contenedor']."',
                                '".$data['d_uso']."');";



                 $query2 = $this->db2->pgquery($sql2);

             if($query2){
                 $bool =true;
              }else{
                $bool = false;
              }


          }

      return $bool;

      return $text;
    }

    //INCLUSIÓN DE NUEVA PRESENTACIÓN EXCLUSIVA PARA EXPORTACIÓN (24)
    public function inclu_export(){
      $text = "inclu_export";

      return $text;
    }

  //INCLUSIÓN DE NUEVA PRESENTACIÓN PROMOCIONAL (25)
    public function inclu_promocional(){
      $text = "inclu_promocional";

      return $text;
    }


    //EXCLUSIÓN DE DISTRIBUIDOR (26)

    public function exclu_distribuidor(){
      $text = "exclu_distribuidor";

      return $text;
    }
    
    //EXCLUSIÓN DE IMPORTADOR (27)

    public function exclu_importador(){ 
      $text = "exclu_importador";

      return $text;
    }

//EXCLUSIÓN DE PLANTA O FABRICANTE (28)

    public function exclu_planta_fabricante(){
      $text = "exclu_planta_fabricante";

      return $text;
    }


    //EXCLUSIÓN DE PLANTA ENVASADORA (29)

    public function exclu_planta_env(){
      $text = "exclu_planta_env";

      return $text;
    }


    //EXCLUSIÓN DE PRESENTACIÓN DE CONTENIDO NETO (30)

    public function exclu_cont_neto(){
      $text = "exclu_cont_neto";

      return $text;
    }

      //EXCLUSIÓN DE PRESENTACIÓN DE MATERIAL DE ENVASE O EMPAQUE (31)

    public function exclu_material(){
      $text = "exclu_material";

      return $text;
    }

     //RENOVACIÓN DE REGISTRO SANITARIO DE ALIMENTO NACIONAL (32)

    public function renovacion_registro($nro){
         $this->db2 = Database::getInstance(); 
       //Buscar el Dato de la Solicitud
         $fecha = @fechaBD();

      //Actualizo la Fecha en el RO
        $sql = "SELECT id_solicitud_ref  
                  FROM renovacion_registro 
                 WHERE id_solicitud =".$nro.";";

         
         $arrActiv = array('rows','numrows');        

            $getPg = @getSQL($sql,$arrActiv);          

           $row    = $getPg[0]['rows'];
           $numrow = $getPg[1]['numrows'];

          if($numrow > 0){
             
              $sql2 = "UPDATE solicitud
                          SET f_status ='".$fecha."'
                        WHERE id_solicitud =".$row['id_solicitud_ref'].";";

          }

          if($query = $this->db2->pgquery($sql2)){

                 $bool =true;
              }else{
                $bool = false;
              }

        return $bool;
    }

    public function inclu_pres_zonacomer(){
      $text = "inclu_pres_zonacomer";

      return $text;
    }


  } //Fin de la Clase 



?>