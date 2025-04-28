<?php

class viewDatSol
{
  private $strSol;
  private $db; 

  function __construct($datSol){

      $this->strSol = $datSol;
      $this->db = Database::getInstance();  
  }

   function arrSol(){
     //Busca Datos de la Solicitud 
       $sql = "SELECT s.*,ts.*,c.*,cs.*,a.* 
                 FROM solicitudes s,tipos_solicitudes ts, categorias_tipossolicitud c,
                      contralorias_sanitarias cs,areas a
                WHERE s.cod_tipos_solicitudes = ts.cod_tipos_solicitudes
                  AND s.cod_categorias_tipossolicitud = c.cod_categorias_tipossolicitud
                  AND s.cod_contralorias_sanitarias = cs.cod_contralorias_sanitarias
                  AND s.cod_areas = a.cod_areas
                  AND s.nro_solicitud = ".$strSol.";";   
       $query   = $this->db->pgquery($sql);
       $numRows = $this->db->pgNumrows($query);
     if($numRows >0){
        $row = $db->pgfetch($query);
        //Datos de la Solicitud
        $fecha       = fsalida($row["fecha_solicitud"]);
        $permiso     = $row["nro_permiso"]; 
        $contraloria = $row["contraloria_sanitaria"]; 
        $area        = $row["area"]; 
        $tipoSol     = $row["cod_tipos_solicitudes"];
        $repre       = $row["nombres"].', '.$row["apellidos"]; 
        $cedula      = $row["cedula_pasaporte"];
        $categoria   = $row["categoria"];
      //Arreglo la Etiqueta del Permiso
        if($tipoSol < 7){
           $idTag = '(SOLICITUD DE NUEVO PERMISO)';
        }else{
          $idTag  = '(RENOVACIÓN DE PERMISO)'; 
        }  
       //Creo el Arreglo de Solicitud
         $arrSol = array('nroSol'=>$nroSol,'fecha'=>$fecha,'idTag'=>$idTag,
                         'area'=>$area,'permiso'=>$permiso,'contraloria'=>$contraloria,
                         'tipoSol'=>$tipoSol,'categoria'=>$categoria);            
      }
     return $arrSol;   
  } //Fin arrSol 

  function arrEstab(){

     //Defino algunos parametros 
       $nac = array('1'=>'VENEZOLANA','2'=>'EXTRANJERA');

     //Datos Establecimiento
         $sql2 ="SELECT es.*,e.*,m.*,p.*,ep.*,pe.* 
                   FROM establecimientos es,estados e,municipios m,
                        parroquias p,establecimientos_propietarios ep,
                        personas p
                  WHERE es.nro_solicitud =".$strSol."
                        AND es.cod_estados = e.cod_estados
                        AND es.cod_municipios = m.cod_municipios
                        AND es.nro_solicitud = ep.nro_solicitud
                        AND ep.cedula_pasaporte = pe.personas
                        AND es.cod_parroquias = p.cod_parroquias;";

       $query2   = $this->db->pgquery($sql2);
       $numRows2 = $this->db->pgNumrows($query2);
       if($numRows2 >0){
          $row2 = $this->db->pgfetch($query2);
          $rif       = $row2["rif"]; 
          $estab     = $row2["establecimiento"];
          $direccion = $row2["descripcion1"].','.
                       $row2["descripcion2"].','.
                       $row2["descripcion3"].','.
                       $row2["descripcion4"]; 
          $estado    = $row2["estado"];
          $municipio = $row2["municipio"];
          $parroquia = $row2["parroquia"];
          $dimension = $row2["area_local"];
          $cod_estad = $row2["cod_estado"];
          $telefono1 = $row2["telefono1"];
          $telefono2 = $row2["telefono2"];
          $puntoRef  = $row2["punto_referencia"];
          $nombre    = $row2["nombres"];
          $apellido  = $row2["apellidos"];
          $cedula    = $row2["cedula_pasaporte"];
          $tel_fijo  = $row2["telefono_fijo"];
          $tel_movil = $row2["telefono_movil"];
          $correo    = $row2["correo_electronico"];
          $nacional  = $nac($row2["nacionalidad"]);
      //Armo el Arreglo con el Modelo 
        $arrDat= array('estab'=>$estab,'rubro'=>$rubro,'telefono1'=>$telefono1,
                       'telefono2'=>$telefono2,'puntoRef'=>$puntoRef,'repre'=>$repre,
                       'cedula'=>$cedula,'uso'=>$uso,'tipo'=>$tipo,'dimension'=>$dimension,
                       'direccion'=>$direccion,'cod_estado'=>$cod_estado,'estado'=>$estado,
                       'municipio'=>$municipio,'parroquia'=>$parroquia,'nombres'=>$nombre,
                       'apellidos'=>$apellido,'cedula'=>$cedula,'tel_fijo'=>$tel_fijo,
                       'tel_movil'=>$tel_movil,'nacional'=>$nacional);

      return $arrDat;         
   } //Fin Establecimiento
 } //Fin de la Clase 
]
 ?>