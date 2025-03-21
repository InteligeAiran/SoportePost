<?php
#autoload

 class pdfReport extends Reports{

  function __construct(){
        parent:: __construct();
    }

  public function pdfReport(){
      $this->origen       = "";
      $this->tipo         = "";
      $this->elab         = "";
      $this->nroSol       = "";
      $this->nroReg       = "";
      $this->marco        = "";
      $this->total_ano    = "";
      $this->impNR        = "";
      $this->zona         = "";

  }

  public function ofAlimBeb(){  

    $pdf = new oficio('P','mm','A4'); 
    $pdf->SetFont('Arial','',11);
    $pdf->SetAutoPageBreak(false,20);
    $pdf->AddPage();
    //HEADER
    $pdf->origen = $this->origen;
    
    $pdf->tipo   = $this->tipo;
    
    $pdf->elab   = $this->elab;
    
    $pdf->impNR  = $this->impNR;
     
    $pdf->zona   = $this->zona;
    
    $pdf->writeHeader();
     
    $arrDatos      = new dataProductModel();
    $datSol        = $arrDatos->detSol($this->nroSol);

    $area          = (int)$datSol['area'];
    $pdf->area     = $area; 
    $pdf->arrDatos = $datSol;
    //TIPO DE SOLICITUD
    $pdf->Ln(8);

    $pdf->writeTipSol($area);
    //NUMERO DE REGISTRO
    $pdf->writeNroRegistro();
    //MARCO LEGAL
    $pdf->writeMarco($this->marco);
    
    $arrDatos->numReg = $datSol["nroReg"];
    $arrDatos->categ  = $datSol['id_categoria_solicitud'];

      
      $solRef = $arrDatos->getDataReg($datSol["nroReg"]);
       
    //Verifica el tipo para buscar datos del RO

      if($datSol['id_tipo_solicitud'] == 1){ //Registros Nuevos 
         $arrDatos->solRefer = $this->nroSol;

      } 

      if($datSol['id_tipo_solicitud'] == 2 || $datSol['id_tipo_solicitud'] == 3 ){  //Notificaciones
        
         $arrDatos->solRefer  = $arrDatos->getReferencia($this->nroSol,$datSol['id_categoria_solicitud']);

      }

    //fin ***
    //$arrDatos->solRefer  = $solRef["id_solicitud"];  //borrar
    
    $detPr = $arrDatos->detProducto();
     
    $pdf->arrDetProd = $detPr;
    $pdf->arrTitular = $arrDatos->getSpecific(1);
    
      //Captura los datos Del Fabricante
      $arrFab = $arrDatos->getSpecific(2);
      
      //Captura los datos del Envasador
      $arrEnv = $arrDatos->getSpecific(4);
      
      //Combino los Datos del Envasador y el Fabricante
      $defAFab  = array_merge($arrFab,$arrEnv);
      $defBFab  = array_column($defAFab,'d_empresa');
      //Envio los datos a Mostrar en el Oficio
      //$pdf->arrFabric  = count($defBFab);

      $pdf->arrFabric  = $this->getStringArr($defBFab);

      $pdf->arrPlant   = $this->ubicByFabr($defAFab,$arrDatos->solRefer);
       
    switch ($datSol["id_categoria_solicitud"]) {
      case 1:
      case 2:
      case 3:
      case 4:
              $tempNro = $arrDatos->solRefer;
               
      break;
      default;
              $tempNro = $arrDatos->solRefer;


      break;
    } 

    $pdf->contEnv    = $this->arrToString($arrDatos->netoEnvaseOfic($tempNro,0),'d_desc_envase');

    $pdf->contNeto   = $this->arrToString($arrDatos->netoEnvaseOfic($tempNro,1),'contenido_neto');  

    if (count($arrDatos->getSpecific(3)) > 0) {
      $pdf->arrDist  = $this->arrToString($arrDatos->getSpecific(3),"d_empresa"); 


    }
    //DATOS 
    $pdf->writeDatos($area);
    
    switch ($datSol["id_categoria_solicitud"]) {
             
             case 2: 
             case 4:
             
              //VIGENCIA IMPORTADOR
               if ($this->impNR == true) {

                  $f_vig  = strtotime('+5 year',strtotime($datSol["f_registro"])) ;
                  $pdf->f_vigencia = date('j-m-Y',$f_vig);
                  
                  $datChange = $arrDatos->showNotifica($this->nroSol,$datSol["id_categoria_solicitud"],$detPr["id_tipo_prod"]);
                  
                  $pdf->{$datChange['function']}($datChange['row']); 

               }     
             break;
             case 3:
              $this->zona = true;
              if ($this->zona == true){
                  $datChange = $arrDatos->showNotifica($tempNro,$datSol["id_categoria_solicitud"],$detPr["id_tipo_prod"]); 
                  
                //ejecuta la Funcion Correspondiente
                  $pdf->{$datChange['function']}($datChange['row']); 

              }
             break;
             case 5:
             case 6:
             //case 7:
             case 8:
             case 9:
             case 10:
             //case 11:
             case 12:
             case 13:
             case 14:
             case 15:
             //case 16:
             case 17:
             case 18:
             case 19:
             case 20:
             case 21:
             case 22:
             case 23:
             case 24:
             case 25:
             case 26:
             case 27:
             case 28:
             case 29:
             case 30:
             case 31:
             /*case 32:
             case 33:
             case 34:
             case 35:*/

    //Comentado 
            
             case 40:
               //VIGENCIA IMPORTADOR 
               list($numR,$reQuery) =  $arrDatos->ultRenov();
               if($numR > 0){
                 $f_find = $reQuery['f_vigencia']; 
                 $f_vig  = date('d-m-Y',strtotime($f_find));
               }else{
                 
                 $f_vig  = $solRef["f_vigencia"]; 
               }               
               $pdf->f_vigencia = date('d-m-Y',strtotime($f_vig));
               $datChange = $arrDatos->showNotifica($this->nroSol,$datSol["id_categoria_solicitud"],$detPr["id_tipo_prod"]); 

               $pdf->{$datChange['function']}($datChange['row']);
             break;
             case 34:

              //ZONAS COMERCIALIZACION BEBIBA ALCOHOLICA NACIONAL EN UNA RENOVACION
              $this->zona = true;
              if ($this->zona == true){
                  $datChange = $arrDatos->showNotifica($tempNro,$datSol["id_categoria_solicitud"],$detPr["id_tipo_prod"]); 
                  
                //ejecuta la Funcion Correspondiente
                  $pdf->{$datChange['function']}($datChange['row']); 

              }

             break;
    }
    
    $pdf->firma  = $arrDatos->getFirma($this->nroSol); 

    $ano =  date("Y", strtotime($datSol["f_registro"]));
    $mes =  date("n", strtotime($datSol["f_registro"]));
    switch ($mes) {
      case 1: $d_mes = "Enero";  break;
      case 2: $d_mes = "Febrero";  break;
      case 3: $d_mes = "Marzo";  break;
      case 4: $d_mes = "Abril";  break;
      case 5: $d_mes = "Mayo";  break;
      case 6: $d_mes = "Junio";  break;
      case 7: $d_mes = "Julio";  break;
      case 8: $d_mes = "Agosto";  break;
      case 9: $d_mes = "Septiembre";  break;
      case 10: $d_mes = "Octubre";  break;
      case 11: $d_mes = "Noviembre";  break;
      case 12: $d_mes = "Diciembre";  break;
    }
    $dia   =  date("j", strtotime($datSol["f_registro"]));
    $arrAprob = array("ano"=>$ano,"mes"=>$d_mes,"dia"=>$dia,"total"=>$this->total_ano);
    //APROBACION
    $pdf->writeAprob($area,$arrAprob);
    //CLASE PARA TRAER DATOS DE FIRMA
    $arrFirmas = new firmaModel();
    $arrFirmas->idSol = $this->nroSol;

    $frmQuery      = $arrFirmas->getById();
    
    if($frmQuery["numRows"] > 0) {
      $row = $frmQuery["row"];
      $pdf->writeFirma($row["user_firma"]);
    }
     
    //RESPONSABLE
    $pdf->writeRespon($this->nroSol);
    //FOOTER
    $pdf->writeFooter();  
    
    $pdf->Output();
  }



//NUEVO OFICIO EMITIDO PRODUCTO ENVASE EMPAQUE

    public function oficEnvase($nro){ 
    $pdf = new oficio('P','mm','A4'); 
    $area = 1;    
    $pdf->SetFont('Arial','',11);
    $pdf->SetAutoPageBreak(false,20);
    $pdf->AddPage();
    //HEADER
    $pdf->writeHeader();

    $arrDatos = new dataProductModel();
    $datSol = $arrDatos->detSol($nro);
    $pdf->arrDatos = $datSol;

    //TIPO DE SOLICITUD
    $pdf->Ln(8);
    //MARCO LEGAL
      switch ($datSol["id_categoria_solicitud"]) { //Definimos todos los nuevos y todas las renovaciones
         case 41:
         $cate = 41;
         break;
         case 42:
         $cate = 42;
         break;
         case 43:
         $cate = 43;
         break;
         case 44:
         $cate = 44;
         break;
         case 45:
         $cate = 45;
         break;
         case 46:
         $cate = 46;
         break;
         case 47:
         $cate = 47;
         break;
         case 48:
         $cate = 48;
         break;
         case 49:
         $cate = 49;
         break;
         case 50:
         $cate = 50;
         break;
         case 51:
         $cate = 51;
         break;
         case 52:
         $cate = 52;
         break;
         case 53:
         $cate = 53;
         break;
         case 54:
         $cate = 54;
         break;
         case 55:
         $cate = 55;
         break;
         case 56:
         $cate = 56;
         break;
         case 57:
         $cate = 57;
         break;         
         case 58:
         $cate = 58;
         break;
    }
    $Tipo = $datSol["id_categoria_solicitud"];

    $pdf->writeTipSolEnvase($Tipo);
    //NUMERO DE REGISTRO
    $pdf->writeNroRegistro1();
    //MARCO LEGAL
    $pdf->writeMarcoEnv($Tipo);
    switch ($Tipo) {
      case 41:case 42:case 43:case 44:case 45:case 46:
      case 47:case 48:case 49:case 50:case 51:case 52:
      case 53:case 54:case 55:case 56:

   $arrDatos->numReg = $datSol["nroReg"];
    switch ($datSol["area"]) {
      case 1:
        $arrDatos->categ     = "IN(41,42,43,44,46,49,50,51,52,56)";
      break;
    }
      break;
   
      case 41:case 42:case 43:case 44:
      case 45:case 46:case 47:case 48:
      case 49:case 50:case 51:case 52:
      case 53:case 54:case 55:case 56:

   $arrDatos->numReg = $datSol["nroReg"];
    switch ($datSol["area"]) {
      case 1:
        $arrDatos->categ = "IN(41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56)";
      break;
    }
      break;

    }
   
    $solRef = $arrDatos->solRef();
    $arrDatos->solRefer  = $solRef["id_solicitud"]; //$nro
    //echo $solRef["id_solicitud"];//echo $nro;
    $Compo = $arrDatos->Composicion_EE($solRef["id_solicitud"]); //Composicion
    $InfoE = $arrDatos->EmpresasEnv();
    $Det = $arrDatos->findExtranjeraEnva($InfoE);
    $arrDetProd = $arrDatos->detProductoEnvase($solRef["id_solicitud"]);
    $ArrdatosProv = $arrDatos->ConsulEmpresa($solRef["id_solicitud"]);
  
    if ($ArrdatosProv['id_tipo_empresa'] == 1) {
    $Datos = $arrDatos->ConsulEmpresaNacional($ArrdatosProv['id_empresa']);
    $Tipo = $ArrdatosProv['id_tipo_empresa'];
    $pdf->writeDatosEnva($area,$arrDetProd,$Datos,$Tipo,$Compo);
    }else{
    $Datos = $arrDatos->ConsulEmpresaExtranjera($ArrdatosProv['id_empresa']);
    $Tipo = $ArrdatosProv['id_tipo_empresa'];
    $pdf->writeDatosEnva($area,$arrDetProd,$Datos,$Tipo,$Compo,$Det);
    }
    
    switch ($datSol["id_categoria_solicitud"]) {
             //NUEVO ENVASE EMPAQUE
      case 41:case 42:case 43:case 44:case 45:case 46:
      case 47:case 48:case 49:case 50:case 51:case 52:
      case 53:case 54:case 55:case 56:

    $pdf->firma = $arrDatos->getFirma($nro); 
    $ano =  date("Y", strtotime($datSol["f_registro"]));
    $mes =  date("n", strtotime($datSol["f_registro"]));
    switch ($mes) {
      case 1: $d_mes = "Enero";  break;
      case 2: $d_mes = "Febrero";  break;
      case 3: $d_mes = "Marzo";  break;
      case 4: $d_mes = "Abril";  break;
      case 5: $d_mes = "Mayo";  break;
      case 6: $d_mes = "Junio";  break;
      case 7: $d_mes = "Julio";  break;
      case 8: $d_mes = "Agosto";  break;
      case 9: $d_mes = "Septiembre";  break;
      case 10: $d_mes = "Octubre";  break;
      case 11: $d_mes = "Noviembre";  break;
      case 12: $d_mes = "Diciembre";  break;
    }
    $dia   =  date("j", strtotime($datSol["f_registro"]));
    $arrAprob = array("ano"=>$ano,"mes"=>$d_mes,"dia"=>$dia,"total"=>$this->total_ano);
    //APROBACION
    $pdf->writeAprob($area,$arrAprob);
    //CLASE PARA TRAER DATOS DE FIRMA
    $arrFirmas = new firmaModel();
    $arrFirmas->idSol = $nro;
    $frmQuery = $arrFirmas->getById();
    if($frmQuery["numRows"] > 0) {
      $row = $frmQuery["row"];
      $pdf->writeFirma($row["user_firma"]);
    } 
             break;
      case 41:case 42:case 43:case 44:case 45:case 46:
      case 47:case 48:case 49:case 50:case 51:case 52:
      case 53:case 54:case 55:case 56:

    $pdf->firma = $arrDatos->getFirma($nro); 
    $ano =  date("Y", strtotime($datSol["f_registro"]));
    $mes =  date("n", strtotime($datSol["f_registro"]));
    switch ($mes) {
      case 1: $d_mes = "Enero";  break;
      case 2: $d_mes = "Febrero";  break;
      case 3: $d_mes = "Marzo";  break;
      case 4: $d_mes = "Abril";  break;
      case 5: $d_mes = "Mayo";  break;
      case 6: $d_mes = "Junio";  break;
      case 7: $d_mes = "Julio";  break;
      case 8: $d_mes = "Agosto";  break;
      case 9: $d_mes = "Septiembre";  break;
      case 10: $d_mes = "Octubre";  break;
      case 11: $d_mes = "Noviembre";  break;
      case 12: $d_mes = "Diciembre";  break;
    }
    $dia   =  date("j", strtotime($datSol["f_registro"]));
    $arrAprob = array("ano"=>$ano,"mes"=>$d_mes,"dia"=>$dia,"total"=>$this->total_ano);
    //APROBACION
    $pdf->writeAprob($area,$arrAprob);
    //CLASE PARA TRAER DATOS DE FIRMA
    $arrFirmas = new firmaModel();
    if ($datSol['id_tipo_solicitud'] >= 1 ) {
    $arrFirmas->idSol = $nro;
    }else{
      $arrFirmas->idSol = $solRef["id_solicitud"];   
    }
    $frmQuery = $arrFirmas->getById();
    if($frmQuery["numRows"] > 0) {
      $row = $frmQuery["row"];
      $pdf->writeFirma($row["user_firma"]);
    }
             break;
    }

    //RESPONSABLE
    $pdf->writeRespon($nro);
    //FOOTER
    $pdf->writeFooter(); 

    $pdf->Output();
  }



    public function CambiosOficEnvase($nro){  //Oficio Cambios Envase y Empaque
    $pdf = new oficio('P','mm','A4'); 
    $area = 1;    
    $pdf->SetFont('Arial','',11);
    $pdf->SetAutoPageBreak(false,20);
    $pdf->AddPage();
    //HEADER
    $pdf->writeHeader();

    $arrDatos = new dataProductModel();
    $datSol = $arrDatos->detSol($nro);
    $pdf->arrDatos = $datSol;
    //TIPO DE SOLICITUD

    $pdf->Ln(8);

    $Tipo = $datSol["id_categoria_solicitud"];

    $pdf->writeTipSolEnvase($Tipo);
    //NUMERO DE REGISTRO
    $pdf->writeNroRegistro1();
    //MARCO LEGAL
    $pdf->writeMarcoEnv($Tipo);

    $datSol   = $arrDatos->detSol($nro);

    $arrDatos->categ  = "IN(41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56)"; //Categorias nuevas Envase y empaque
    $arrDatos->numReg = $datSol["nroReg"];
    $solRef = $arrDatos->solRefEE();
    $arrDatos->solRefer  = $solRef["id_solicitud"];

    $Compo = $arrDatos->Composicion_EE($nro); //Composicion
    $InfoE = $arrDatos->EmpresasEnv();
    $arrDetProd = $arrDatos->detProductoEnvase($solRef["id_solicitud"]);
    $ArrdatosProv = $arrDatos->ConsulEmpresaEE($solRef["id_solicitud"]);
    //Tipo de empresa
    if ($ArrdatosProv['id_tipo_empresa'] == 1) {
    $Datos = $arrDatos->ConsulEmpresaNacional($ArrdatosProv['id_empresa']);
    $Tipo = $ArrdatosProv['id_tipo_empresa'];
    $pdf->writeDatosEnva($area,$arrDetProd,$Datos,$Tipo,$Compo);
    }else{
    $Datos = $arrDatos->ConsulEmpresaExtranjera($ArrdatosProv['id_empresa']);
    $Tipo = $ArrdatosProv['id_tipo_empresa'];
    $pdf->writeDatosEnva($area,$arrDetProd,$Datos,$Tipo,$Compo,$Det);

    }

    switch ($datSol["id_categoria_solicitud"]) { //Categorias para Cambios Envase y Empaque
      case 57: //Cambio denominacion materias primas
      $Soli = $solRef["id_solicitud"];
      $Deno = $arrDatos->Cambio_Denominacion_EE($nro);
      $pdf->writeCmbDenoEE($Deno);
        break;
      case 58: //Cambio razon social titular materias primas
      $Soli = $solRef["id_solicitud"];
      $Deno = $arrDatos->Cambio_Razon_EE($Soli);
      if ($ArrdatosProv['id_tipo_empresa'] == 1) {
      $Rif = $Datos['rif'];
      $pdf->writeCmbTitularNacEE($Deno,$Rif);
      }else{
      $Deno = $arrDatos->Cambio_Razon_EE($Soli);
      $Id = $Datos['id_empresa_extranjera'];
      $pdf->writeCmbTitularExtEE($Deno,$Id);
        }
      break;

    }
    switch ($datSol["id_categoria_solicitud"]) {
      case 57: //Cambio denominacion 
      case 58: //Cambio razon social
    $pdf->firma = $arrDatos->getFirma($solRef["id_solicitud"]); 
    $ano =  date("Y", strtotime($datSol["f_registro"]));
    $mes =  date("n", strtotime($datSol["f_registro"]));
    switch ($mes) {
      case 1: $d_mes = "Enero";  break;
      case 2: $d_mes = "Febrero";  break;
      case 3: $d_mes = "Marzo";  break;
      case 4: $d_mes = "Abril";  break;
      case 5: $d_mes = "Mayo";  break;
      case 6: $d_mes = "Junio";  break;
      case 7: $d_mes = "Julio";  break;
      case 8: $d_mes = "Agosto";  break;
      case 9: $d_mes = "Septiembre";  break;
      case 10: $d_mes = "Octubre";  break;
      case 11: $d_mes = "Noviembre";  break;
      case 12: $d_mes = "Diciembre";  break;
    }
    $dia   =  date("j", strtotime($datSol["f_registro"]));
    $arrAprob = array("ano"=>$ano,"mes"=>$d_mes,"dia"=>$dia,"total"=>$this->total_ano);
    //APROBACION
    $pdf->writeAprob($area,$arrAprob);
    //CLASE PARA TRAER DATOS DE FIRMA
     $pdf->writeAprob($area,$arrAprob);
    //CLASE PARA TRAER DATOS DE FIRMA
    $arrFirmas = new firmaModel();
    if ($datSol['id_tipo_solicitud'] == 2) {
    $arrFirmas->idSol = $nro;
    }else{
      $arrFirmas->idSol = $solRef["id_solicitud"];   
    }
    $frmQuery = $arrFirmas->getById();
    if($frmQuery["numRows"] > 0) {
      $row = $frmQuery["row"];
      $pdf->writeFirma($row["user_firma"]);
      }
     break;
    }
    //RESPONSABLE
    $pdf->writeRespon($nro);
    //FOOTER
    $pdf->writeFooter(); 
    $pdf->Output();

  }

  public function planilla($numSol){
      //Instancia la Clases de Producto y Solicitud
        $arrDatos   = new dataProductModel(); 
        $pdf        = new PlanInocuidad('P','mm','A4');

      
      //Define Atributos del Documento
        $pdf->SetFont('Arial','',11);
        $pdf->SetAutoPageBreak(false,20); 
        
      //Busca Detalle de la Solicitud Original  
        $datSol   = $arrDatos->detSol($numSol);
        
      //Inicializa variables asignando datos de la solicitud   
         $area     = $datSol['area'];
         $id_coord = $datSol['id_coordinacion'];
         $tipSol   = $datSol['id_tipo_solicitud']; 

         $tipCat   = $datSol['id_categoria_solicitud'];


         $nroReg   = $datSol['nroReg'];
        
     //Define datos de Referencia 
        if($datSol['id_tipo_solicitud'] == 1){ //Reistros Nuevos 
         $arrDatos->solRefer = $numSol; 


        } 

       if($datSol['id_tipo_solicitud'] == 2 || $datSol['id_tipo_solicitud'] == 3 ){  //Notificaciones
          
          $arrDatos->solRefer  = $arrDatos->getReferencia2($nroReg);
          

        } 
           
        //Busca Datos Asociados 
          $datEmp    = $arrDatos->empresas(); 

          $datProd   = $arrDatos->detProducto(); 

          $datEnvase = $arrDatos->prodEnvase($arrDatos->solRefer); 

          $datCont   = $arrDatos->netoEnvaseOfic($arrDatos->solRefer,3);
          

          $datComp   = $arrDatos->getComposicion($arrDatos->solRefer);
          
          
          $datDurac  = $arrDatos->getDuracion($arrDatos->solRefer);

          $datUser   = $arrDatos->getUsuario($numSol);

        //Agrega la Pagina 
          $pdf->AddPage('P','letter'); 
        //Encabezado
          $pdf->writeHeader(); 
          $pdf->Ln(8);
        //Escribe las secciones de la planilla 
          $pdf->writePlanilla($datSol);
          $pdf->writeEmpresa($datEmp);
          $pdf->writeProducto($datProd);
          $pdf->writeEnvase($datEnvase);
          $pdf->writeContenido($datCont);
          $pdf->writeComp($datComp);
          $pdf->writeDuracion($datDurac);
          $pdf->writeLote($datDurac);   
        //Emite la Planilla de acuerdo al tipo de solicitud

        //Notificaciones

          if($datSol['id_categoria_solicitud'] > 4 && $datSol['id_categoria_solicitud'] < 32){ 
             
             $datChange = $arrDatos->showNotifica($numSol,$tipCat,$datProd["id_tipo_prod"]); 
             
             $pdf->{$datChange['function']}($datChange['row']);
          }  
          
        //Finaliza la Planilla 
          $pdf->writeObserva($datSol["d_obser_usuario"]);
        //Verifica si es Notificacion y Muestra el Cambio
          $pdf->writeSolicitante($datUser);
        //FOOTER
        $pdf->writeFooter();

    //Genra la Salida       
    $pdf->Output();
  }



  private function arrToString($arr,$esp){
    $a = "";  
    for ($i=0; $i < count($arr); $i++) { 
      if ($i == 0) {
        $a.= $arr[$i][$esp];    
      }else{
        if ($i == count($arr)-1) {
          $a.= " y ".$arr[$i][$esp];
        }else{
          $a.= ", ".$arr[$i][$esp]; 
        }
      }
    }

    return $a;
  }

  private function getStringArr($arr){
    $a = "";  
    for ($i=0; $i < count($arr); $i++) { 
      if ($i == 0) {
        $a.= $arr[$i];    
      }else{
        if ($i == count($arr)-1) {
          $a.= " , ".$arr[$i];
        }else{
          $a.= ", ".$arr[$i]; 
        }
      }
    }

    return $a;
  }


  private function ubicByFabr($arr,$nroSol){
    $text ='';
    $ubic = array();
    $temp = array();
    $arrDatos = new dataProductModel();
    $arrDatos->solRefer = $nroSol;
    
    for ($i=0; $i < count($arr); $i++){ 
       //Arma el String de Ubicacion
             if($arr[$i]["id_tipo_empresa"] == 1){

                if ($arr[$i]["n_planta"] == 1){
                  //Si tiene Planta Busca la Ubicacion
                    
                    $ubic[$i] = $arrDatos->getUbicaPlanta($arr[$i]["id_empresa"]);
                   
                    $kip = 1;
                   //Seleccionar la Ubicación
                    /* 
                    $p = 0;
                    foreach($ubic AS $item){
                        foreach($item AS $key => $value){
                          if($p == 0){
                             $text.=$value;
                        }else{
                       if($p == count($item)-1){
                              $text.=" y ".$value;
                       }else{
                      $text.=", ".$value;
                      }
                        }
                         $p++;  
                       }
                    }//Fin Empresa con Planta 
                    */
                    
                }else{
                 //Si no tiene Planta 
                  /*  $ubic[$i] = $arrDatos->findNacional($arr[$i]["id_empresa"]);      
                    foreach($ubic AS $key =>$item2){
                      if($key == 'id_estado'){
                        if($item2['id_estado'] == 1){
                           $text.= $item2['d_ciudad'].', '.$item2['d_estado'];  
                        }else{
                          $text.= $item2['d_ciudad'].', EDO. '.$item2['d_estado'];  
                        }  
                      }
                    }*/
                }
             }else{
             //Es importado el producto 
              $ubic[$i] = $arrDatos->findExtranjera($arr[$i]["id_empresa"]); 

              foreach($ubic AS $key =>$item3){
                $text.= $item3['d_ciudad'].', '.$item3['d_pais'];   
                 }
               }   
       //Fin del String ubicacion
       }

        if($kip == 1){
          $s = 0;
          foreach($ubic as $item1){
            foreach($item1 as $value){
               if(!in_array($value,$temp)){
                  $temp[$s] = $value;
               }
             $s++;   
            }
          }

          $text = $this->getStringArr($temp);
        }
       //Convierto el Arreglo en String
        return $text;
        }


  //nuevo codigo 05 de junio del 2018
    public function Genere_Consultas_Pdf($arrDat,$arrDat1){  

    require MODELS.'relacion/consultasModel.php'; // Clase ConsultasModel
      

            $consul     = new consultasModel(); 
            $arrConsul  = $consul->Armar_Pdf($arrDat,$arrDat1);

            $rol        = $_REQUEST['rol']; //Rol funcionario
            $desde      = $_REQUEST['desde'];
            $hasta      = $_REQUEST['hasta'];
            $resp     = $_REQUEST['responsable'];

            $arrDat2 = array('rol' =>$rol,'desde' =>$desde,
            'hasta' =>$hasta);
          
            $pdf = new reportePDF('P','mm','A4'); 
            $area = 1;    
            $pdf->SetFont('Arial','',11);
            $pdf->SetAutoPageBreak(false,20);
            $pdf->AddPage();

            //Enviamos para el armado del pdf
              $pdf->writePdf($arrConsul,$arrDat2);

              $pdf->Output();

    //return $a;
  } ///

  }

?>