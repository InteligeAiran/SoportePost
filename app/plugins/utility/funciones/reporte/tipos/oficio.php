<?php
  class oficio extends FPDF{

    // ******************************************************************************
    //
    // Clase para generar los oficios
    //
    // ******************************************************************************
    function __construct(){
        parent:: __construct();
    }
       //Creo los metodos para las funciones multicelda
     var $widths;
     var $aligns;

      function SetWidths($w){
        //Set the array of column widths
        $this->widths=$w;
      }

      function SetAligns($a){
        //Set the array of column alignments
        $this->aligns=$a;
      }

      function Row($data){
        //Calculate the height of the row
        $nb=0;
        for($i=0;$i<count($data);$i++)
          $nb=max($nb,$this->NbLines($this->widths[$i],$data[$i]));
          $h=5*$nb;
        //Issue a page break first if needed
        $this->CheckPageBreak($h);
        //Draw the cells of the row
        for($i=0;$i<count($data);$i++){
          $w=$this->widths[$i];
          $a=isset($this->aligns[$i]) ? $this->aligns[$i] : 'L';
          //Save the current position
          $x=$this->GetX();
          $y=$this->GetY();
          //Draw the border
          $this->Rect($x,$y,$w,$h);
          //Print the text
          $this->MultiCell($w,5,$data[$i],0,$a);
          //Put the position to the right of the cell
          $this->SetXY($x+$w,$y);
        }
        //Go to the next line
        $this->Ln($h);
      }

      function CheckPageBreak($h){
        //If the height h would cause an overflow, add a new page immediately
         if($this->GetY()+$h>$this->PageBreakTrigger)
         $this->AddPage($this->CurOrientation);
      }

      function NbLines($w,$txt){
        //Computes the number of lines a MultiCell of width w will take
        $cw=&$this->CurrentFont['cw'];
        if($w==0)
        $w=$this->w-$this->rMargin-$this->x;
        $wmax=($w-2*$this->cMargin)*1000/$this->FontSize;
        $s=str_replace("\r",'',$txt);
        $nb=strlen($s);
        if($nb>0 and $s[$nb-1]=="\n")
          $nb--;
          $sep=-1;
          $i=0;
          $j=0;
          $l=0;
          $nl=1;
          while($i<$nb){
            $c=$s[$i];
            if($c=="\n"){
              $i++;
              $sep=-1;
              $j=$i;
              $l=0;
              $nl++;
              continue;
            }
            if($c==' ')
              $sep=$i;
              $l+=$cw[$c];
            if($l>$wmax){
              if($sep==-1){
                if($i==$j)
                $i++;
              }else
                $i=$sep+1;
                $sep=-1;
                $j=$i;
                $l=0;
                $nl++;
            }else
              $i++;
          }
          return $nl;
      }

      public function oficio(){
          $this->origen      = "";
          $this->tipo        = "";
          $this->elab        = "";
          $this->arrDatos    = "";
          $this->arrDetProd  = "";
          $this->arrTitular  = "";
          $this->arrFabric   = "";
          $this->arrDist     = "";
          $this->arrPlant    = "";
          $this->contEnv     = "";
          $this->arrCont     = "";
          $this->listCont    = "";
          $this->arrImport   = "";
          $this->impNR       = "";
          $this->f_vigencia  = "";
          $this->notif       = "";
      }

     //***HEADER*******************************************************************

      function writeHeader(){
           $this->Image(ROOT.'app/public/images/cintillo2.jpg',9,8,195,13);
      }

      //***HEADER*******************************************************************

      //***TIPO DE SOLICITUD********************************************************

      function writeTipSol($area){

           //Instancia la Clase dataProdduc

            $dataProd  = new dataProductModel();

           //Busca el Titulo
             //$titulo  = $dataProd->getTipoSol($this->arrDatos["id_tipo_solicitud"]);
            if ($this->impNR == true) {
                $title_cat = 19;
              }else{
                $title_cat = $this->arrDatos["id_categoria_solicitud"];
              }    

             $tipoOrig = $dataProd->getCategoria($title_cat);
           //Verifica si es Artesanal 
             if($this->elab == 3){
               $tipoOrig.' ARTESANAL'; 
             } 
        /*
          switch ($area) {
            case 1:
              switch ($this->arrDatos["id_tipo_solicitud"]) {
                case 1:
                  if ($this->impNR == true) {
                        $titulo = "INCLUSIÓN DE IMPORTADOR";
                  }else{
                        $titulo = "REGISTRO SANITARIO DE PRODUCTO";
                  }
                break;
                case 2:
                  switch ($this->arrDatos["id_categoria_solicitud"]) {
                    case 5:
                      $titulo = "AJUSTE DE GRADO ALCOHÓLICO";
                    break;
                    case 6:
                      $titulo = "CAMBIO DE DENOMINACIÓN DEL PRODUCTO";
                    break;
                    case 7:
                      $titulo = "CAMBIO DE FÓRMULA DE INGREDIENTES SECUNDARIOS O ADITIVOS";
                    break;
                    case 8:
                      $titulo = "CAMBIO DE FABRICANTE";
                    break;
                    case 9:
                      $titulo = "CAMBIO DE MARCA COMERCIAL";
                    break;
                    case 10:
                      $titulo = "CAMBIO DE NUEVA PRESENTACIÓN DE CONTENIDO NETO";
                    break;
                    case 11:
                      $titulo = "CAMBIO DE PRESENTACIÓN DE DISEÑO DE RÓTULO";
                    break;
                    case 12:
                      $titulo = "CAMBIO DE RAZÓN SOCIAL DEL IMPORTADOR";
                    break;
                    case 13:
                      $titulo = "CAMBIO DE RAZÓN SOCIAL DEL FABRICANTE";
                    break;
                    case 14:
                      $titulo = "CAMBIO DE RAZÓN SOCIAL DEL TÍTULAR DEL REGISTRO SANITARIO";
                    break;
                    case 15:
                      $titulo = "CAMBIO DEL TÍTULAR DEL REGISTRO SANITARIO";
                    break;
                    case 17:
                      $titulo = "CAMBIO DE LUGAR DE FABRICACIÓN";
                    break;
                    case 19:
                      $titulo = "INCLUSIÓN DE IMPORTADOR";
                    break;
                    case 20:
                      $titulo = "INCLUSIÓN DE NUEVA PLANTA FABRICANTE";
                    break;
                    case 21:
                      $titulo = "INCLUSIÓN DE NUEVA PLANTA ENVASADORA";
                    break;
                    case 22:
                      $titulo = "INCLUSIÓN DE NUEVA PRESENTACIÓN DE CONTENIDO NETO";
                    break;
                    case 23:
                      $titulo = "INCLUSIÓN DE NUEVA PRESENTACIÓN DE MATERIAL DE ENVASE";
                    break;
                    case 24:
                      $titulo = "INCLUSIÓN DE NUEVA PRESENTACIÓN EXCLUSIVA PARA EXPORTACIÓN";
                    break;
                    case 25:
                      $titulo = "INCLUSIÓN DE NUEVA PRESENTACIÓN PROMOCIONAL";
                    break;
                    case 40:
                      $titulo = "INCLUSIÓN DE NUEVA PRESENTACIÓN PARA LICORES EN ZONA DE COMERCIALIZACIÓN";
                    break;
                  }
                break;
                case 3:
                   $titulo = "RENOVACIÓN DE REGISTRO SANITARIO DE PRODUCTO"; 
                break;
              }
              $tipoOrig = "";
              switch ($this->tipo) {
                 case 1: 
                  $tipoOrig.= "ALIMENTO "; 
                  switch ($this->origen) {
                    case 1: 
                      $tipoOrig.= "NACIONAL "; 
                      switch ($this->elab) {
                        case 3: $tipoOrig.= "ARTESANAL"; break;
                      }
                    break;
                    case 2: 
                      $tipoOrig.= "IMPORTADO"; 
                    break;
                  }
                 break;
                 case 2: 
                  $tipoOrig.= "BEBIDA ALCOHÓLICA "; 
                  switch ($this->origen) {
                    case 1: 
                      $tipoOrig.= "NACIONAL "; 
                      switch ($this->elab) {
                        case 1: $tipoOrig.= "ARTESANAL"; break;
                      }
                    break;
                    case 2: 
                      $tipoOrig.= "IMPORTADA"; 
                    break;
                  }
                 break;
              }
             
            break;
          }*/
          
          $this->SetFont('Arial','','11');
          $this->Ln(10);
          $this->MultiCell('190','6',utf8_decode($titulo),'0','C',false);
          $this->MultiCell('190','6',utf8_decode($tipoOrig),'0','C',false);
      }

    //***TIPO DE SOLICITUD**********************************************************


     //***NUMERO DE REGISTRO******************************************************

      function writeNroRegistro(){
           $this->SetFont('Arial','','11');
           $this->Ln(1);
           $this->cell(133);
           $this->Cell(55,5,"Número de Registro Sanitario",1,'L','C');
           $this->SetFont('Arial','B','11');
           $this->Ln();
           $this->cell(133);
           $this->Cell(55,5,$this->arrDatos['nroReg'],1,0,'C');
      }

      //***NUMERO DE REGISTRO******************************************************

      
    //***MARCO LEGAL***************************************************************

      function writeMarco($val){
            switch ($val) {
              case 'i':
                  /*REGISTRO DE ALIMENTO NACIONAL
                    REGISTRO DE ALIMENTO IMPORTADO
                  */
                  $marco= "El Servicio Autónomo de Controlaría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en el Reglamento General de Alimentos según Gaceta Oficial N° 25.864 de fecha 16 de enero de 1959, Artículos del 30 al 38 y en las Normas Complementarias del Reglamento General de Alimentos según Gaceta Oficial N° 35.921 de fecha 15 de marzo de 1996, Artículos del 12 al 25, AUTORIZA el Registro Sanitario del:";
              break;
              case 'ii':
                   /*REGISTRO DE ALIMENTO  ARTESANAL
                  */
                  $marco= "El Servicio Autónomo de Contraloría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en el Reglamento General de Alimentos según Gaceta Oficial N° 25.864 de fecha 16 de enero de 1959, Artículos del 30 al 38 y en la Providencia Administrativo N° 165-2017 de fecha 21 de junio de 2017, mediante la cual se Establecen los Requisitos para las Solicitudes Realizadas por Todos Aquellos Productores(as) que Elaboran, Manipulan, Envasen, Distribuyan, Comercializan y Expendan Alimentos Artesanales, AUTORIZA  el Registro Sanitario del:
";
              break;
              case 'iii':
                   /*REGISTRO DE BEBIDA ALCOHOLICA NACIONAL
                    REGISTRO DE BEBIDA ALCOHOLICA IMPORTADO
                  */
                  $marco= "El Servicio Autónomo de Contraloría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en la Ley Orgánica  de Salud según  Gaceta Oficial N° 36.579 de fecha 11 de noviembre de 1998, Artículos  32 y 33, en el Reglamento General de Alimentos Gaceta Oficial Nº 25.864 de fecha 16 de enero de 1959, Artículos del 30 al 38, en las Normas Complementarias del Reglamento General de Alimentos Gaceta Oficial Nº 35.921 de fecha 15 de marzo de 1996, Artículos del 12 al 25 y en el Reglamento de la Ley de Impuesto sobre Alcohol y Especies Alcohólicas Gaceta Oficial N° 3.665 Extraordinario de fecha 05/12/1985, Artículo 8, AUTORIZA el Registro Sanitario del: ";
              break;
              case 'iiii':
                   /*REGISTRO DE BEBIDA ALCOHOLICA ARTESANAL
                  */
                  $marco= "El Servicio Autónomo de Contraloría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en la Ley Orgánica de Salud según  Gaceta Oficial N° 36.579 de fecha 11 de noviembre de 1998, Artículos 32 y 33, en el Reglamento General de Alimentos Gaceta Oficial Nº 25.864 de fecha 16 de enero de 1959, Artículos del 30 al 38, en las Normas Complementarias del Reglamento General de Alimentos Gaceta Oficial Nº 35.921 de fecha 15 de marzo de 1996, Artículos del 12 al 25, en el Reglamento de la Ley de Impuesto sobre Alcohol y Especies Alcohólicas Gaceta Oficial N° 3.665 Extraordinario de fecha 05/12/1985, Artículo 8, en el Decreto con Rango, Valor y Fuerza de Ley de Reforma de la Ley de Impuestos sobre Alcohol y Especies Alcohólicas. Decreto N° 5.618 del 03/10/2007, publicada en Gaceta Oficial Extraordinario N° 5.852 de fecha 05 de octubre de 2007, Artículo 3 y en la Providencia Administrativa N° 165-2017 de fecha 21 de junio de 2017,mediante la cual se Establecen los Requisitos para las Solicitudes Realizadas por Todos Aquellos Productores/as que Elaboran, Manipulen, Envasen, Distribuyan, Comercialicen y Expendan Alimentos Artesanales, AUTORIZA el Registro Sanitario del:";
             break;
              case 'renov_i':
                  /*  RENOVACIÓN DE ALIMENTO NACIONAL
                      RENOVACIÓN DE BEBIDA IMPORTADO
                  */
                  $marco= "El Servicio Autónomo de Contraloría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en las Normas Complementarias del Reglamento General de Alimentos según Gaceta Oficial Nº 35.921 de fecha 15 de marzo de 1996, Artículo 22, AUTORIZA la Renovación del Registro Sanitario del:";
              break;
              case 'renov_ii':
                  /*  
                  RENOVACIÓN DE ALIMENTO NACIONAL ARTESANAL
                  RENOVACIÓN DE BEBIDA NACIONAL ARTESANAL
                  */
                  $marco= "El Servicio Autónomo de Contraloría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en la Providencia Administrativa N° 165-2017 de fecha 21 de junio de 2017, mediante la cual se Establecen los Requisitos para las Solicitudes Realizadas por Todos Aquellos Productores/as que Elaboran, Manipulen, Envasen, Distribuyan, Comercialicen y Expendan Alimentos Artesanales,AUTORIZA la Renovación del Registro Sanitario del:";
              break;
              case 'inclusion':
                  /*  INCLUSION
                  */
                  $marco= "";
                  switch ($this->elab) {
                    case 3:
                          $marco.="El Servicio Autónomo de Contraloría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en la Providencia Administrativa N° 165-2017 de fecha 21 de junio de 2017, mediante la cual se Establecen los Requisitos para las Solicitudes Realizadas por Todos Aquellos Productores/as que Elaboran, Manipulen, Envasen, Distribuyan, Comercialicen y Expendan Alimentos Artesanales, ";
                    break;
                    default:
                          $marco.="El Servicio Autónomo de Contraloría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en las Normas Complementarias del Reglamento General de Alimentos según Gaceta Oficial Nº 35.921 de fecha 15 de marzo de 1996, Artículo 24 , ";
                    break;
                  } 
                  switch ($this->arrDatos["id_categoria_solicitud"]) {
                      case 2:
                      case 4:
                      case 19:
                        $marco.="AUTORIZA la Inclusión del Importador solicitado del Producto:";
                      break;
                      case 5:
                        $marco.="AUTORIZA el Ajuste del Grado Alcohólico del Producto:";
                      break;
                      case 6:
                        $marco.="AUTORIZA el Cambio de Denominación solicitado del:";
                      break; 
                      case 7:
                        $marco.="AUTORIZA el Cambio de Fórmula solicitado del:";
                      break; 
                      case 8:
                        $marco.="AUTORIZA el Cambio de Fabricante solicitado:";
                      break; 
                      case 9:
                        $marco.="AUTORIZA el Cambio de Marca solicitado del Producto:";
                      break; 
                      case 10:
                        $marco.="AUTORIZA el Cambio de Nueva Presentación de Contenido Neto solicitado del Producto:";
                      break;
                      case 11:
                        $marco.="AUTORIZA el Cambio de Presentación de Diseño del Rótulo solicitado del:";
                      break;
                      case 12:
                        $marco.="AUTORIZA el Cambio solicitado de Razón Social del Importador:";
                      break;
                      case 13:
                        $marco.="AUTORIZA el Cambio solicitado de Razón Social del Fabricante:";
                      break;  
                      case 14:
                        $marco.="AUTORIZA el Cambio solicitado de Razón Social del Titular del Registro Sanitario del Producto:";
                      break;
                      case 15:
                        $marco.="AUTORIZA el Cambio solicitado del Titular del Registro Sanitario:";
                      break;
                       case 17:
                        $marco.="AUTORIZA el Cambio solicitado del lugar de fabricación del Registro Sanitario:";
                      break;
                      case 20:
                        $marco.="AUTORIZA la Inclusión de Nueva Planta Fabricante solicitada del Producto:";
                      break;
                      case 21:
                        $marco.="AUTORIZA la Inclusión de Nueva Planta Envasadora solicitada del Producto:";
                      break; 
                      case 22:
                        $marco.="AUTORIZA la Inclusión de Nueva Presentación de Contenido Neto solicitado del Producto:";
                      break;
                      case 23:
                        $marco.="AUTORIZA la Inclusión de Nueva Presentación de Material de Envase solicitado del Producto:";
                      break;   
                      case 24:
                        $marco.="AUTORIZA la Inclusión de Presentación Exclusiva para Exportación solicitada del Producto:";
                      break;   
                      case 25:
                        $marco.="AUTORIZA la Inclusión de Presentación de Promocional solicitada del Producto:";
                      break;
                      case 40:
                        $marco.="AUTORIZA la Inclusión de Presentación para Licores en Zona de Comercialización:";
                      break;        
                  }
              break;
            }

          //  Marco legal i (1)
          $this->SetFont('Arial','','10');
          $this->Ln(8);
          $this->MultiCell('190','5',$marco,'0','J',false);
      }

      //***MARCO LEGAL**************************************************************

      //***DATOS SOLICITUD**************************************************************

        function writeDatos($area){
          switch ($area) {
            case 1:
              $this->N1();
              $this->tabla(); 
              switch ($this->arrDatos["id_categoria_solicitud"]) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 17:
                case 19:
                case 20:
                case 21:  
                case 22:  
                case 23: 
                case 24: 
                case 25: 
                case 32:
                case 33:
                case 34:
                case 35:
                case 40:  
                  $this->denom();
                  $this->marca();
                  $this->clase();
                  $this->titular();
                  $this->fabrnte();
                  $this->lugarFab();
                  if ($this->distr()){
                      $this->distr();
                  }
                  $this->envase();
                  $this->contenido();
                break;
              }
            break;
          }
              
        }

        private function N1(){
          $N1 = $this->SetFont('Arial','','9');
          $N1.= $this->Ln(2);
          $N1.= $this->MultiCell('190',6,'DATOS DEL PRODUCTO',1,'C',false);
          return $N1;
        }
        private function tabla(){
          $tabla = $this->SetWidths(array(48,142));
          $tabla.= $this->SetFont('Arial','','9');
          $tabla.= $this->SetAligns(array('',''));
          return $tabla;
        }
        private function denom(){
          $denom = $this->Row(array('DENOMINACIÓN',strtoupper(utf8_decode($this->arrDetProd['d_denomina']))));
          
          if(empty($this->arrDetProd['d_fantasia'])){
             
             $datNull = 1;
          }else{
            $denom .= $this->Row(array('NOMBRE DE FANTASIA',utf8_decode($this->arrDetProd['d_fantasia'])));

          }
          
          return $denom;
        }
        private function marca(){
          $marca = $this->Row(array('MARCA',utf8_decode($this->arrDetProd['d_marca'])));
          return $marca;
        }
        private function clase(){
          $clase = $this->Row(array('CLASE',utf8_decode($this->arrDetProd['d_clase_prod'])));
          return $clase;
        }
        private function titular(){
          $titular = $this->Row(array('TITULAR',utf8_decode($this->arrTitular[0]["d_empresa"])));
          return $titular;
        }
        private function fabrnte(){
          $fabrnte = $this->Row(array('ELABORADO POR',utf8_decode($this->arrFabric)));
          return $fabrnte;
        }
        private function distr(){
          if (!empty($this->arrDist)) {
            $distrib = $this->Row(array('DISTRIBUIDO POR',utf8_decode($this->arrDist)));
            return $distrib;
          }else{
             return false;
          }
        }
        private function lugarFab(){
          $lugarFab = $this->Row(array('LUGAR DE FABRICACIÓN',utf8_decode($this->arrPlant)));
          return $lugarFab;
        }
        private function envase(){
          $envase = $this->Row(array('ENVASE(S) O EMPAQUE(S)',utf8_decode($this->contEnv)));
          return $envase;
        }
        private function contenido(){
          $contenido = $this->Row(array('CONTENIDO(S) NETO(S)',utf8_decode($this->contNeto)));
          return $contenido;
        }

        public function writeAjusteGrado($data){  
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(35,35,120));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('GRADO ANTERIOR','GRADO SOLICITADO','DENOMINACIÓN DESPUES DEL CAMBIO'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array(utf8_decode($data['n_grado_anterior']),utf8_decode($data['n_grado_actual']),utf8_decode($data['d_denomina_actual'])));
        }

        public function writeCmbDeno($data){
            $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(90,100));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C'));
             if ($data['d_tipo_denomina'] == 1) {
                $this->Row(array('DENOMINACIÓN ANTERIOR','DENOMINACIÓN SOLICITADA'));
                $this->SetAligns(array('J','J'));
                $this->Row(array(utf8_decode($data['d_denomina_anterior']),utf8_decode($data['d_denomina_actual'])));
             }else
             if ($data['d_tipo_denomina'] == 2) { 
                $this->Row(array('NOMBRE DE FANTASÍA ANTERIOR','NOMBRE DE FANTASÍA SOLICITADO'));
                $this->SetAligns(array('J','J'));
                if ($data['d_fantasia_anterior']=='') {
                  $fant = "NO POSEE";
                }else{
                  $fant = $data['d_fantasia_anterior'];
                }
                $this->Row(array(utf8_decode($fant),utf8_decode($data['d_fantasia_actual'])));
             }else
             if ($data['d_tipo_denomina'] == 3) {
                $this->Row(array('DENOMINACIÓN ANTERIOR','DENOMINACIÓN SOLICITADA'));
                $this->SetAligns(array('J','J'));
                $this->Row(array(utf8_decode($data['d_denomina_anterior']),utf8_decode($data['d_denomina_actual'])));
                $this->Row(array('NOMBRE DE FANTASÍA ANTERIOR','NOMBRE DE FANTASÍA SOLICITADO'));
                $this->SetAligns(array('J','J'));
                if ($data['d_fantasia_anterior']=='') {
                  $fant = "NO POSEE";
                }else{
                  $fant = $data['d_fantasia_anterior'];
                }
                $this->Row(array(utf8_decode($fant),utf8_decode($data['d_fantasia_actual'])));
             } 
        }

        public function writeCmbIngre($data){
            $this->Ln(2);
           //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(50,20,100,20));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C','C'));
             $this->Row(array('INGREDIENTE O ADITIVO','TIPO','FUNCIÓN','CANTIDAD'));
             $this->SetFont('Arial','','9'); 
              for($j=0;$j<count($data);$j++){
                  if ($data[$j]["id_tipo_composicion"] == 2) {
                    $this->Row(array(utf8_decode($data[$j]['d_ingrediente']),$data[$j]['d_tipo_composicion'],utf8_decode($data[$j]['d_funcion']),$data[$j]['n_cantidad'].' '.utf8_decode($data[$j]['simbolo'])));
                  }else
                  if ($data[$j]["id_tipo_composicion"] == 3) {
                    $this->Row(array(utf8_decode($data[$j]['d_ingrediente']),$data[$j]['d_tipo_composicion'],utf8_decode($data[$j]['d_aditivo']),$data[$j]['n_cantidad'].' '.utf8_decode($data[$j]['simbolo'])));
                  }
              }     
         }

        public function writeCmbFabri($data){
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(30,65,30,65));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C','C'));
             if ($data['tipo_empresa'] == 1) {
              $this->Row(array('RIF','FABRICANTE ANTERIOR','RIF','FABRICANTE ACTUAL'));   
             }else{
              $this->Row(array('ID','FABRICANTE ANTERIOR','ID','FABRICANTE ACTUAL'));
             }
             $this->SetAligns(array('C','J','C','J'));
             $this->Row(array($data['id_empresa_anterior'],utf8_decode($data['razon_anterior']),$data['id_empresa_actual'],utf8_decode($data['razon_actual'])));
        }

        public function writeCmbMarca($data){
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(90,100));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C'));
             $this->Row(array('MARCA ANTERIOR','MARCA SOLICITADA'));
             $this->SetAligns(array('J','J'));
             $this->Row(array(utf8_decode($data['d_marca_anterior']),utf8_decode($data['d_marca_actual'])));
        }

        public function writeCmbCont($data){
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(45,45,50,50));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C','C'));
             $this->Row(array('CONT. NETO ANTERIOR','UNIDAD ANTERIOR','CONT. NETO  SOLICITADO','UNIDAD ACTUAL'));
             $this->SetAligns(array('C','C','C','C'));
             $this->Row(array($data['n_contenido_anterior'],$data['simbolo_anterior'],$data['n_contenido_actual'],$data['simbolo_actual']));
        }

        public function writeCmbRotulo($data){
             $this->Ln(2);
              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(190));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('L'));
             $this->Row(array('OBSERVACIONES:'));
             $this->SetAligns(array('J'));
             $this->Row(array(utf8_decode($data['d_observacion'])));
        }

        public function writeCmbRazImp($data){
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(30,80,80));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('RIF','RAZÓN SOCIAL ANTERIOR','RAZÓN SOCIAL ACTUAL'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['id_empresa'],utf8_decode($data['razon_anterior']),utf8_decode($data['razon_actual'])));

        } 

        public function writeCmbRazFab($data){  
              $this->Ln(2);
              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(30,80,80));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C'));
             if ($data['tipo_empresa'] == 1) {
              $this->Row(array('RIF','RAZÓN SOCIAL ANTERIOR','RAZÓN SOCIAL ACTUAL'));
             }else{
              $this->Row(array('ID','RAZÓN SOCIAL ANTERIOR','RAZÓN SOCIAL ACTUAL'));
             }
             $this->SetAligns(array('C','J','J'));
             $this->Row(array($data['id_empresa'],utf8_decode($data['razon_anterior']),utf8_decode($data['razon_actual'])));
        } 

        public function writeCmbRazTit($data){
             $this->Ln(2);
            //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(30,80,80));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C'));
             if ($data['tipo_empresa'] == 1) {
              $this->Row(array('RIF','RAZÓN SOCIAL ANTERIOR','RAZÓN SOCIAL ACTUAL'));
             }else{
              $this->Row(array('ID','RAZÓN SOCIAL ANTERIOR','RAZÓN SOCIAL ACTUAL'));
             }
             $this->SetAligns(array('C','J','J'));
             $this->Row(array($data['id_empresa'],utf8_decode($data['razon_anterior']),utf8_decode($data['razon_actual'])));
        }

        public function writeCmbTit($data){
              $this->Ln(2);
              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(30,65,30,65));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C','C'));
             if ($data['tipo_empresa'] == 1) {
              $this->Row(array('RIF','TITULAR ANTERIOR','RIF','TITULAR ACTUAL'));   
             }else{
              $this->Row(array('ID','TITULAR ANTERIOR','ID','TITULAR ACTUAL'));
             }
             $this->SetAligns(array('C','J','C','J'));
             $this->Row(array($data['id_empresa_anterior'],utf8_decode($data['razon_anterior']),$data['id_empresa_actual'],utf8_decode($data['razon_actual'])));
        }

        public function writeCmbLugFab($data){
              $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(30,120,40));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','J','J'));
             $this->Row(array('RIF','LUGAR ANTERIOR','PERMISO SANITARIO'));
             $this->Row(array($data['id_empresa'],utf8_decode($data['lugar_ant']),$data['nro_permiso_ant']));
             $this->SetWidths(array(30,120,40));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','J','J'));
             $this->Row(array('RIF','LUGAR ACTUAL','PERMISO SANITARIO'));   
             $this->Row(array($data['id_empresa'],utf8_decode($data['lugar_act']),$data['nro_permiso_act']));
        }  

        public function writeIncImp($data){
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DE LA INCLUSIÓN SOLICITADA',1,'C',false); 
             $this->SetWidths(array(50,140));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C'));
             $this->Row(array('RIF','RAZON SOCIAL DEL IMPORTADOR'));
             $this->SetAligns(array('C','J'));
             $this->Row(array(utf8_decode($data['rif']),utf8_decode($data['razon_importa'])));
             $this->SetWidths(array(140,50));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C'));
             $this->Row(array('ZONAS A COMERCIALIZAR','VIGENCIA HASTA'));
             $this->SetAligns(array('J','C'));
             $this->Row(array(utf8_decode($data["zonas"]),$this->f_vigencia));
                        
        } 

        public function writeIncFab($data){
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DE LA INCLUSIÓN SOLICITADA',1,'C',false); 
             switch ($data['tipo']) {
                case 1:
                  $this->SetWidths(array(50,140));
                  $this->SetFont('Arial','B','9');
                  $this->SetAligns(array('C','C'));
                  $this->Row(array('RIF','RAZON SOCIAL DEL FABRICANTE'));
                  $this->SetAligns(array('C','J'));
                  $this->Row(array(utf8_decode($data['rif']),utf8_decode($data['razon_fabrica'])));
                  $this->SetWidths(array(50,140));
                  $this->SetFont('Arial','B','9');
                  $this->SetAligns(array('C','C'));
                  $this->Row(array('PERMISO SANITARIO','UBICACIÓN DE LA PLANTA'));
                  $this->SetAligns(array('C','J'));
                  $this->Row(array(utf8_decode($data["nro_permiso_sanitario"]),utf8_decode($data["d_direccion"])));
                break;
                case 2:
                  $this->SetWidths(array(50,140));
                  $this->SetFont('Arial','B','9');
                  $this->SetAligns(array('C','C'));
                  $this->Row(array('ID','RAZON SOCIAL DEL FABRICANTE'));
                  $this->SetAligns(array('C','J'));
                  $this->Row(array(utf8_decode($data['id']),utf8_decode($data['razon_fabrica'])));
                  $this->SetWidths(array(95,95));
                  $this->SetFont('Arial','B','9');
                  $this->SetAligns(array('C','C'));
                  $this->Row(array('CIUDAD','PAÍS'));
                  $this->SetAligns(array('J','C'));
                  $this->Row(array(utf8_decode($data["d_ciudad"]),utf8_decode($data["d_pais"])));
                break;
             }
             
        }

        /* INCLUSION DE PLANTA ENVASADORA 21*/
        public function writeIncEnv($data){
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DE LA INCLUSIÓN SOLICITADA',1,'C',false); 
             $data['tipo'] = 1;
             switch ($data['tipo']) {
                case 1:
                  $this->SetWidths(array(50,140));
                  $this->SetFont('Arial','B','9');
                  $this->SetAligns(array('C','C'));
                  $this->Row(array('RIF','RAZON SOCIAL DEL ENVASADOR'));
                  $this->SetAligns(array('C','J'));
                  $this->Row(array(utf8_decode($data["rif"]),utf8_decode($data["razon_fabrica"])));
                  $this->SetWidths(array(50,140));
                  $this->SetFont('Arial','B','9');
                  $this->SetAligns(array('C','C'));
                  $this->Row(array('PERMISO SANITARIO','UBICACIÓN DE LA PLANTA'));
                  $this->SetAligns(array('C','J'));
                  $this->Row(array(utf8_decode($data["nro_permiso_sanitario"]),utf8_decode($data["d_direccion"])));
                break;
                case 2:
                  $this->SetWidths(array(50,140));
                  $this->SetFont('Arial','B','9');
                  $this->SetAligns(array('C','C'));
                  $this->Row(array('ID','RAZON SOCIAL DEL FABRICANTE'));
                  $this->SetAligns(array('C','J'));
                  $this->Row(array(utf8_decode($data['id']),utf8_decode($data['razon_fabrica'])));
                  $this->SetWidths(array(95,95));
                  $this->SetFont('Arial','B','9');
                  $this->SetAligns(array('C','C'));
                  $this->Row(array('CIUDAD','PAÍS'));
                  $this->SetAligns(array('J','C'));
                  $this->Row(array(utf8_decode($data["d_ciudad"]),utf8_decode($data["d_pais"])));
                break;
             }
             
        }

        public function writeIncCont($data){
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DE LA INCLUSIÓN SOLICITADA',1,'C',false); 
             $this->SetWidths(array(130,60));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C'));
             $this->Row(array('ENVASE','CONT. NETO'));
             $this->SetAligns(array('J','C'));
              $tempEnv = array();
              foreach ($data as &$v) {
                if (!isset($tempEnv[$v['id_prod_envase']])){
                  $tempEnv[$v['id_prod_envase']] =& $v;
                }
              }
              $dataU = array_values($tempEnv);
              if (count($dataU)!=count($data)) {
                $cont = 0;
                for($j=0;$j<count($dataU);$j++){
                  $valE = utf8_decode($dataU[$j]['d_desc_envase']);
                  $valC = "";
                  for ($k=0; $k < count($data); $k++) { 
                    if ($data[$k]["id_prod_envase"] == $dataU[$j]["id_prod_envase"]) {
                      if ($cont == 0) {
                        $valC.= utf8_decode($data[$k]['n_contenido_neto']." ".$data[$k]['simbolo']);
                        $cont = $cont + 1;
                      }else{
                        $valC.= ", ".utf8_decode($data[$k]['n_contenido_neto']." ".$data[$k]['simbolo']);
                        $cont = $cont + 1;
                      }
                    }
                  }
                  $this->Row(array($valE,$valC));
                  $cont = 0;
                }
              }else{
                $cont = 0;
                for($j=0;$j<count($data);$j++){
                  $valE = utf8_decode($data[$j]['d_desc_envase']);
                  $valC = "";
                  for ($k=0; $k < count($data); $k++) { 
                    if ($data[$k]["id_prod_envase"] == $dataU[$j]["id_prod_envase"]) {
                      if ($cont == 0) {
                        $valC.= utf8_decode($data[$k]['n_contenido_neto']." ".$data[$k]['simbolo']);
                        $cont = $cont + 1;
                      }else{
                        $valC.= ", ".utf8_decode($data[$k]['n_contenido_neto']." ".$data[$k]['simbolo']);
                        $cont = $cont + 1;
                      }
                    }
                  }
                  $this->Row(array($valE,$valC));
                  $cont = 0;
                }
              }

        }

         public function writeIncMat($data){
             $this->Ln(2);
              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DE LA INCLUSIÓN SOLICITADA',1,'C',false); 
             $this->SetWidths(array(45,145));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C'));
             $this->Row(array('NRO. AUTORIZACIÓN','ENVASE'));
             $this->SetAligns(array('C','J'));
             $this->Row(array(utf8_decode($data['n_otorgado_higiene']),utf8_decode(strtoupper($data['d_material_contenedor']))));

        }

        public function writeIncExp($data){
             $this->Ln(2);
            //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DE LA INCLUSIÓN SOLICITADA',1,'C',false); 
             $this->SetWidths(array(60,40,40,50));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C','C'));
             $this->Row(array('DENOMINACIÓN PARA EXPORTACIÓN','CONT. NETO','UNIDAD MEDIDA','PAIS'));
             $this->SetAligns(array('J','C','C','C'));
             for($j=0;$j<count($data);$j++){
             $this->Row(array(utf8_decode($data[$j]['d_nombre_prod']),utf8_decode($data[$j]['n_contenido_neto']),utf8_decode($data[$j]['simbolo']),utf8_decode(strtoupper($data[$j]['d_pais']))));
           }
        }

        public function writeIncPromo($data){
            $this->Ln(2);
            //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DE LA INCLUSIÓN SOLICITADA',1,'C',false); 
             $this->SetWidths(array(80,70,40));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('NOMBRE DE PROMOCIÓN','CONT. NETO','UNIDAD MEDIDA'));
             $this->SetAligns(array('J','C','C'));
             for($j=0;$j<count($data);$j++){
             $this->Row(array(utf8_decode($data[$j]['d_nombre_promo']),utf8_decode($data[$j]['n_contenito_neto']),utf8_decode($data[$j]['simbolo'])));
             }
             $this->SetWidths(array(80,70,40));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('ZONAS A COMERCIALIZAR','VIGENCIA DESDE','VIGENCIA HASTA'));
             $this->SetAligns(array('J','C','C'));
             for($j=0;$j<count($data);$j++){
              if ($data[$j]['d_zona_comer'] =='') {
                $zona = "NO APLICA";
              }else{
                $zona = $data[$j]['d_zona_comer'];
              }
             $this->Row(array(utf8_decode($zona),date("j-m-Y",strtotime($data[$j]["f_promo_desde"])),date("j-m-Y",strtotime($data[$j]["f_promo_hasta"]))));
             }
        }

        /*INCLUSION DE PRESENTACION PARA LICORES 
          EN ZONA DE COMERCIALIZACION*/

          public function writeIncLiZona($data){
             $this->Ln(2);
            //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DE LA INCLUSIÓN SOLICITADA',1,'C',false); 
             $this->SetWidths(array(60,130));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('L','C'));
             $this->Row(array('ZONA DE COMERCIALIZACIÓN:',$data));
             $this->SetAligns(array('J','J'));
              /*
             for($j=0;$j<count($data);$j++){
             $this->Row(array(utf8_decode($data[$j]['d_nombre_prod']),utf8_decode($data[$j]['n_contenido_neto']),utf8_decode($data[$j]['simbolo']),utf8_decode(strtoupper($data[$j]['d_pais']))));
           }*/
        }

        public function writeZonas($data){
             $this->Ln(2);
            //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'DATOS DE LAS ZONAS DE COMERCIALIZACIÓN',1,'C',false); 
             $this->SetWidths(array(48,142));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','J'));
             $this->Row(array('ZONAS A COMERCIALIZAR',utf8_decode($data["zonas"])));
        }

      //***DATOS SOLICITUD**************************************************************

      //***APROBACION**************************************************************

        function writeAprob($area,$arrAprob){
            switch ($area) {
              case 1:
                switch ($this->arrDatos["id_categoria_solicitud"]) {
                  case 1:
                  case 2:
                  case 3:
                  case 4:
                    if ($this->impNR) {
                      $aprob1= "El referido producto se encuentra autorizado bajo el Número de Registro indicado al comienzo de este documento. Asimismo, este Servicio Autónomo cumple con notificarle que una vez verificada la documentación anexa, se pudo constatar que la misma se ajusta a la normativa sanitaria vigente, en consecuencia este Despacho le concede lo solicitado.";
                      $aprob3= "Autorización que se expide a petición de la parte interesada, en la ciudad Caracas a los ".$arrAprob['dia']." dias del mes de ".$arrAprob['mes']." del año ".$arrAprob['ano'];
                    }else{
                      $aprob1= "El referido producto se encuentra autorizado bajo el Número de Registro indicado al comienzo de este documento, por lo que su Libre Venta y Consumo, está permitida en todo el Territorio de la República Bolivariana de Venezuela, sometiéndose a las regulaciones relativas a Vigilancia y Control, Publicidad, Promoción y demás prescripciones establecidas en la normativa vigente para este tipo de producto.";
                      $aprob2= "Este registro tendrá una vigencia de ".$arrAprob['total']." a partir de la fecha de emisión de este documento. Por consiguiente, a su vencimiento deberá renovarse de acuerdo a lo establecido en el artículo 22 de las referidas Normas Complementarias.";
                      $aprob3= "Autorización que se expide a petición de la parte interesada, en la ciudad Caracas a los ".$arrAprob['dia']." dias del mes de ".$arrAprob['mes']." del año ".$arrAprob['ano'];
                    }
                  break;
                  case 19:
                    $aprob1= "El referido producto se encuentra autorizado bajo el Número de Registro indicado al comienzo de este documento. Asimismo, este Servicio Autónomo cumple con notificarle que una vez verificada la documentación anexa, se pudo constatar que la misma se ajusta a la normativa sanitaria vigente, en consecuencia este Despacho le concede lo solicitado.";
                    $aprob3= "Autorización que se expide a petición de la parte interesada, en la ciudad Caracas a los ".$arrAprob['dia']." dias del mes de ".$arrAprob['mes']." del año ".$arrAprob['ano'];
                  break;
                  case 5:
                  case 6:
                  case 7:
                  case 8:
                  case 9:
                  case 10:
                  case 11:
                  case 12:
                  case 13:
                  case 14:
                  case 15:
                  case 17:
                  case 20:
                  case 21:
                  $aprob1= "El referido producto se encuentra autorizado bajo el Número de Registro indicado al comienzo de este documento. Asimismo, este Servicio Autónomo cumple con notificarle que una vez verificada la documentación anexa, se pudo constatar que la misma se ajusta a la normativa sanitaria vigente, en consecuencia este Despacho le concede lo solicitado.";
                    $aprob3= "Autorización que se expide a petición de la parte interesada, en la ciudad Caracas a los ".$arrAprob['dia']." dias del mes de ".$arrAprob['mes']." del año ".$arrAprob['ano'];
                  case 22:
                  case 23:
                  case 24:
                  case 25:
                    $aprob1= "El referido producto se encuentra autorizado bajo el Número de Registro indicado al comienzo de este documento. Asimismo, este Servicio Autónomo se reserva el derecho de realizar inspecciones y/o solicitar cualquier documentación que considere pertinente a los fines de verificar la información suministrada.";
                    $aprob3= "Autorización que se expide a petición de la parte interesada, en la ciudad Caracas a los ".$arrAprob['dia']." dias del mes de ".$arrAprob['mes']." del año ".$arrAprob['ano'];
                  break;
                  case 32:
                  case 33:
                  case 34:
                  case 35:
                  case 40:
                    $aprob1= "El referido producto se encuentra autorizado bajo el Número de Registro indicado al comienzo de este documento. Asimismo, este Servicio Autónomo se da por notificado y se reserva el derecho de realizar inspecciones y/o solicitar cualquier documentación que considere pertinente a los fines de verificar la información suministrada.";
                    $aprob2= "Esta Autorización tendrá una vigencia de ".$arrAprob['total']." a partir de la fecha de emisión de este documento. Por consiguiente, a su vencimiento deberá renovarse nuevamente de acuerdo a lo establecido en el Artículo 22 de las referidas Normas Complementarias ";
                    $aprob3= "Autorización que se expide a petición de la parte interesada, en la ciudad Caracas a los ".$arrAprob['dia']." dias del mes de ".$arrAprob['mes']." del año ".$arrAprob['ano'];
                  break;
                  //NUEVO ENVASE EMPAQUE
                  case 41;
                  case 42;
                  case 43;
                  case 44;
                  case 49;
                  case 50;
                  case 51;
                  case 52;
                    $aprob1= "De igual forma se le participa que dicha autorización está sujeta a las revisiones de este Despacho estime oportuno realizar de acuerdo a los avances de la Ciencia y Tecnología en resguardo de la salud pública.";
                    $aprob2= "Esta autorización tiene una vigencia de cinco (5) años contados a partir de la presente fecha.";
                    $aprob3= "Autorización que se expide a petición de la parte interesada, en la ciudad Caracas a los ".$arrAprob['dia']." dias del mes de ".$arrAprob['mes']." del año ".$arrAprob['ano'];
                  break;
                  //RENOVACION ENVASE EMPAQUE
                    case 45:
                    case 46:
                    case 47:
                    case 48:
                    case 53:
                    case 54:
                    case 55:
                    case 56:
                    case 57:
                    case 58:
                    $aprob1= "De igual forma se le participa que dicha autorización está sujeta a las revisiones de este Despacho estime oportuno realizar de acuerdo a los avances de la Ciencia y Tecnología en resguardo de la salud pública.";
                    $aprob2= "Esta autorización tiene una vigencia de cinco (5) años contados a partir de la presente fecha.";
                    $aprob3= "Autorización que se expide a petición de la parte interesada, en la ciudad Caracas a los ".$arrAprob['dia']." dias del mes de ".$arrAprob['mes']." del año ".$arrAprob['ano'];
                  break;
                }   
              break;
            }

            $this->SetFont('Arial','','11');
            $this->Ln(3);
            if (isset($aprob1)) {
              $this->MultiCell('190','5',$aprob1,'0','J',false);
              $this->Ln(1);
            }
            if (isset($aprob2)) {
              $this->MultiCell('190','5',$aprob2,'0','J',false);
              $this->Ln(1);
            }
            if (isset($aprob3)) {
              $this->MultiCell('190','5',$aprob3,'0','J',false);
            }

        }

      //***APROBACION**************************************************************

      //***FIRMA ELECTRONICA**************************************************************

        function writeFirma($ced){
          
           $this->Ln(13);
           $arrFunc    = new firma_electronicaModel();
           $arrFunc->cedula = $ced;
           $numLinFirma=(int)$this->GetY();
           $frmQuery     = $arrFunc->getByUser();
           if($frmQuery["numRows"] > 0) {
            $row = $frmQuery["row"];
            if ($row["orientacion"] == "A") {
            $this->Image(ROOT.$row["char_direccion"],90,$numLinFirma-9,35,35);
            $this->Ln(22);
            $this->Image(ROOT.'app/public/images/Sello_Direccion.jpg',119,$numLinFirma-6,32,40);
            }else
            if ($row["orientacion"] == "B"){
              $this->Image(ROOT.$row["char_direccion"],80,$numLinFirma-9,55,35);
              $this->Ln(22);
              $this->Image(ROOT.'app/public/images/Sello_Direccion.jpg',135,$numLinFirma-6,32,40);
            }else
            if ($row["orientacion"] == "C"){
              $this->Image(ROOT.$row["char_direccion"],80,$numLinFirma-9,55,35);
              $this->Ln(22);
              $this->Image(ROOT.'app/public/images/Sello_Direccion.jpg',135,$numLinFirma-6,32,40);
            }else
            if ($row["orientacion"] == "D"){
              $this->Image(ROOT.$row["char_direccion"],80,$numLinFirma-9,55,35);
              $this->Ln(22);
              ///$this->Image(ROOT.'app/public/images/Sello_Direccion.jpg',135,$numLinFirma-6,32,40);
            }
            $this->Ln(5);
            $this->SetFont('Arial','B','12');
            $this->MultiCell('190','4',utf8_decode($row["char_nombre"]),'0','C',false);
            $this->SetFont('Arial','','8');
            $this->MultiCell('190','4',utf8_decode($row["char_cargo"]),'0','C',false);
            $this->MultiCell('190','4',utf8_decode($row["char_resolucion"]),'0','C',false);
            $this->MultiCell('190','4',utf8_decode($row["char_gaceta"]),'0','C',false);
            
            $this->Ln(8);
            $this->SetFont('Arial','','6');
           // $this->MultiCell('190','6',$this->firma,'0','J',false);
            ///$firmado = 'Este documento está Firmado Digitalmente por el Director(a) General del Servicio Autónomo de Contraloría Sanitaria: , bajo los estándares de seguridad del SACS. Para verificar la validéz de este registro puede ingresar a la página Web http://www.sacs.gob.ve, sección "CONSULTAS" y seleccionar "Alimentos y Bebidas Alcohólicas".';
            $this->MultiCell('190','6',$firmado,'0','L',false);
           }
        }

      //***FIRMA ELECTRONICA**************************************************************

      //***RESPONSABLE**************************************************************

        function writeRespon($sol){
            $this->SetFont('Arial','','6');
            $this->MultiCell('190','6',"N° Solicitud: ".$sol,'0','L',false);
        }

      //***RESPONSABLE**************************************************************
      //***FOOTER**************************************************************

          function writeFooter(){
            $this->SetLineWidth(0.5);
            $this->SetDrawColor(0,0,0);
            $this->Ln(3);
            $numLinFoo=(int)$this->GetY();
            ///$this->Line(14,$numLinFoo,190,$numLinFoo);
            $mensaje ='"Juntos por cada latido"';  
            $servicio ='Servicio Autónomo de Contraloría Sanitaria.';
            $direccion ='Dirección de Inocuidad de Alimentos y Bebidas.';
            $this->Ln(3);
            $this->SetFont('Times','','12');
            $this->MultiCell('190','4',$mensaje,'0','C',false);
            $this->SetFont('Arial','','6');
            $this->MultiCell('190','4',$servicio,'0','C',false);
            $this->SetFont('Arial','','6');
            //$this->MultiCell('190','4',$direccion,'0','C',false);
            //$this->Ln(1);
            $ubic ='Edificio Sur, Ministerio del Poder Popular para la Salud, piso 3, oficina 313. El Silencio, Caracas-Venezuela.';
            $telf ='Telf: (0212) 408 05 01 al 05, http://sacs.mpps.gob.ve.';
            $this->SetFont('Arial','','6');
            $this->MultiCell('190','4',$ubic,'0','C',false);
            $this->SetFont('Arial','','6');
            $this->MultiCell('190','4',$telf,'0','C',false);
          }

 //NUEVOS METODOS ESPECIFICOS PARA ENVASE EMPAQUE


  function writeTipSolEnvase($tipo){

              switch ($tipo) {

                    //REGISTROS NUEVOS

                    case 41:
                    $titulo = "REGISTRO SANITARIO DE ENVASE, EMPAQUE O ARTICULO NACIONAL";
                    break;
                    case 42;
                    $titulo = "REGISTRO SANITARIO DE MATERIA PRIMA NACIONAL";
                    break;
                    case 43;
                    $titulo = "REGISTRO SANITARIO DE DETERGENTE O DESINFECTANTE NACIONAL";
                    break;
                    case 44;
                    $titulo = "REGISTRO SANITARIO DE EQUIPOS DE FABRICACION DE ALIMENTO NACIONAL";
                    break;


                    case 45:
                    $titulo = "RENOVACIÓN DE ENVASE, EMPAQUE O ARTICULO NACIONAL";
                    break;
                    case 46;
                    $titulo = "RENOVACIÓN DE MATERIA PRIMA NACIONAL";
                    break;
                    case 47;
                    $titulo = "RENOVACIÓN DE DETERGENTE O DESINFECTANTE NACIONAL";
                    break;
                    case 48;
                    $titulo = "RENOVACIÓN DE EQUIPOS DE FABRICACION DE ALIMENTO NACIONAL";
                    break;


                    case 49:
                    $titulo = "REGISTRO SANITARIO DE ENVASE, EMPAQUE O ARTICULO IMPORTADO";
                    break;
                    case 50;
                    $titulo = "REGISTRO SANITARIO DE MATERIA PRIMA IMPORTADA";
                    break;
                    case 51;
                    $titulo = "REGISTRO SANITARIO DE DETERGENTE O DESINFECTANTE IMPORTADA";
                    break;
                    case 52;
                    $titulo = "REGISTRO SANITARIO DE EQUIPOS DE FABRICACION DE ALIMENTO IMPORTADA";
                    break;

                    //RENOVACIONES

                    case 53:
                    $titulo = "RENOVACIÓN DE ENVASE, EMPAQUE O ARTICULO IMPORTADA";
                    break;
                    case 54;
                    $titulo = "RENOVACIÓN DE MATERIA PRIMA IMPORTADA";
                    break;
                    case 55;
                    $titulo = "RENOVACIÓN DE DETERGENTE O DESINFECTANTE IMPORTADA";
                    break;
                    case 56;
                    $titulo = "RENOVACIÓN DE EQUIPOS DE FABRICACION DE ALIMENTO IMPORTADA";
                    break;

                    //CAMBIOS

                    case 57;
                    $titulo = "CAMBIOS DE DENOMINACIÓN DE MATERIAS PRIMAS, ENVASES Y/O EMPAQUES";
                    break;                    
                    case 58;
                    $titulo = "CAMBIO DE RAZÓN SOCIAL EN EL REGISTRO DE MATERIAS PRIMAS, EMPAQUES Y/O ENVASES";
                    break;
                  }

          $this->SetFont('Arial','','11');
          $this->Ln(10);
          $this->MultiCell('190','6',$titulo,'0','C',false);

        }


     //***NUMERO DE REGISTRO******************************************************

      function writeNroRegistro1(){
           $this->SetFont('Arial','','11');
           $this->Ln(1);
           $this->cell(133);
           $this->Cell(55,5,"Número de Registro Sanitario",1,'L','C');
           $this->SetFont('Arial','B','11');
           $this->Ln();
           $this->cell(133);
           $this->Cell(55,5,$this->arrDatos['nroReg'],1,0,'C');
      }


//***DATOS SOLICITUD**************************************************************

        function writeDatosEnva($area,$arrDetProd,$Datos,$tipo,$compo,$Empresa){

          switch ($area) {
            case 1:
              $this->N11($arrDetProd);
              $this->tabla1($arrDetProd); 
              switch ($this->arrDatos["id_categoria_solicitud"]) {
                case 41:
                case 42:
                case 43:
                case 44:
                case 45:  
                case 46:  
                case 47:  
                case 48: 
                case 49:  
                case 50:  
                case 51:  
                case 52: 
                case 53:     
                case 54: 
                case 55:         
                case 56:  
                case 57:  
                case 58:  
                  $this->denom1($arrDetProd);
                  if (count($compo['d_componente']) > 0) {
                  $this->compo($compo);
                  }else{
                 // $this->compo($compo);
                  }
                  $this->deno_comer($arrDetProd);
                  if ($tipo == 1) {
                  $this->fabrnte1($Datos);
                  $this->lugarFab1($Datos);
                  }else{
                  $this->fabrnte2($Datos);
                  $this->lugarFab2($Datos);
                  if (count($Empresa) > 0) {
                  $this->ElaboEnv($Empresa);
                  }else{
                  }
                  }
                  $this->usos($arrDetProd);
                break;
              }
            break;
          }
              
        }

        private function compo($compo){
          $denom = $this->Row(array('COMPOSICIÓN',strtoupper(utf8_decode($compo))));
          return $clase;
        }

        private function N11(){
          $N1 = $this->SetFont('Arial','','9');
          $N1.= $this->Ln(2);
          $N1.= $this->MultiCell('190',6,'DATOS DEL PRODUCTO',1,'C',false);
          return $N1;
        }
        private function tabla1($arrDetProd){
          $tabla = $this->SetWidths(array(48,142));
          $tabla.= $this->SetFont('Arial','','9');
          $tabla.= $this->SetAligns(array('',''));
          return $tabla;
        }
        private function denom1($arrDetProd){

          $denom = $this->Row(array('PRODUCTO',strtoupper(utf8_decode($arrDetProd["d_denomina"]))));
          if(empty($this->arrDetProd['d_fantasia'])){
             
             $datNull = 1;
          }else{
            $denom .= $this->Row(array('NOMBRE DE FANTASIA',utf8_decode($this->arrDetProd['d_fantasia'])));

          }
          
          return $denom;
        }
        private function deno_comer($arrDetProd){
          $denom = $this->Row(array('DENOMINACIÓN COMERCIAL',strtoupper(utf8_decode($arrDetProd["d_denomina"]))));
          return $clase;
        }
        private function fabrnte1($Datos){
          $fabrnte = $this->Row(array('ELABORADO POR',utf8_decode(strtoupper($Datos['d_nombre']))));
          return $fabrnte;
        }
        private function lugarFab1($Datos){
          $lugarFab = $this->Row(array('LUGAR DE FABRICACIÓN',utf8_decode($Datos['d_ciudad'].'- '.$Datos['d_estado'])));
          return $lugarFab;
        }
        private function ElaboEnv($Empresa){
          $lugarFab = $this->Row(array('IMPORTADO POR',utf8_decode($Empresa)));
          return $lugarFab;
        }
        private function fabrnte2($Datos){
          $fabrnte = $this->Row(array('ELABORADO POR',utf8_decode($Datos['d_nombre'])));
          return $fabrnte;
        }
        private function lugarFab2($Datos){
          $lugarFab = $this->Row(array('LUGAR DE FABRICACIÓN',utf8_decode(strtoupper($Datos['d_pais']).' - '.$Datos['d_ciudad'])));
          return $lugarFab;
        }
        private function usos($arrDetProd){
          $envase = $this->Row(array('USOS',utf8_decode($arrDetProd["d_uso"])));
          return $envase;
        }
        private function contenido1(){
          $contenido = $this->Row(array('CONTENIDO(S) NETO(S)',utf8_decode($this->contNeto)));
          return $contenido;
        }


        public function writeCmbDenoEE($data){
            $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(90,100));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C'));
             $this->Row(array('DENOMINACIÓN ANTERIOR','DENOMINACIÓN SOLICITADA'));
             $this->SetAligns(array('J','J'));
             $this->Row(array(utf8_decode($data['d_denomina_anterior']),utf8_decode($data['d_denomina_actual'])));

           }

        public function writeCmbTitularNacEE($data,$rif){ //Cambio razon social titular EE NACIONAL
            $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(22,84,84));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('RIF','RAZON SOCIAL ANTERIOR','RAZON SOCIAL SOLICITADA'));
             $this->SetAligns(array('J','J','J'));
             $this->Row(array($rif,utf8_decode($data['d_empresa_anterior']),utf8_decode(strtoupper($data['d_empresa_actual']))));

           }

        public function writeCmbTitularExtEE($data,$id){ //Cambio razon social titular EE EXTRANJERO
            $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(22,84,84));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('ID','RAZON SOCIAL ANTERIOR','RAZON SOCIAL SOLICITADA'));
             $this->SetAligns(array('J','J'));
             $this->Row(array($id,utf8_decode($data['d_empresa_anterior']),utf8_decode($data['d_empresa_actual'])));

           }

 //***MARCO LEGAL***************************************************************
      function writeMarcoEnv($Tipo){
  switch ($Tipo) {
         case 41:
         case 45:
         case 49:
         case 53:
        $marco= "El Servicio Autónomo de Controlaría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en el Reglamento General de Alimentos Resolución N° SG-081 de fecha 11/03/1996. Según Gaceta Oficial N° 25.864 de fecha 16 de enero de 1959, Y las Normas Complementarias del Reglamento General de Alimentos según Gaceta Oficial N° 35.921 de fecha 15 de marzo de 1996:";
          //  Marco legal i (1)
          $this->SetFont('Arial','','10');
          $this->Ln(8);
          $this->MultiCell('190','5',$marco,'0','J',false);
         break;
         case 42:
         case 46:
         case 50: 
         case 54:
         $marco= "El Servicio Autónomo de Controlaría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en el Reglamento General de Alimentos Resolución N° SG-081 de fecha 11/03/1996. Según Gaceta Oficial N° 25.864 decreto N° 525-12 de fecha 16 de enero de 1959, Y las Normas Complementarias del Reglamento General de Alimentos según Gaceta Oficial N° 35.921 de fecha 15 de marzo de 1996:";
          //  Marco legal i (1)
          $this->SetFont('Arial','','10');
          $this->Ln(8);
          $this->MultiCell('190','5',$marco,'0','J',false);
         break;
         case 43:
         case 47:
         case 51:
         case 55:
         $marco= "El Servicio Autónomo de Controlaría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en el Reglamento General de Alimentos. Normas Buenas prácticas Resolución N° SG-457-96 de fecha 11/03/1996. Según Gaceta Oficial N° 25.864 decreto N° 525-12 de fecha 16 de enero de 1959, Y las Normas Complementarias del Reglamento General de Alimentos según Gaceta Oficial N° 36.081 de fecha 07 de noviembre de 1996, Normas Sanitarias para el registro y control de producto de Aseo, Desinfección, Mantenimiento y Ambientadores de Usos Doméstico e Industriales Resolución N° 258 gaceta oficial N° 37.973 del 06 de Julio de 2004:";
          //  Marco legal i (1)
          $this->SetFont('Arial','','10');
          $this->Ln(8);
          $this->MultiCell('190','5',$marco,'0','J',false);
         break;
         case 44:
         case 48:
         case 52:
         case 56:
         case 57:
         case 58:
         $marco= "El Servicio Autónomo de Controlaría Sanitaria (SACS), ente adscrito al Ministerio del Poder Popular para la Salud, de conformidad con lo establecido en el Reglamento General de Alimentos Resolución N° SG-081 de fecha 11/03/1996. Según Gaceta Oficial N° 35.921 de fecha 15 de marzo de 1996, Y las Normas Complementarias del Reglamento General de Alimentos según Gaceta Oficial N° 36.081 de fecha 07 de noviembre de 1996:";
          //  Marco legal i (1)
          $this->SetFont('Arial','','10');
          $this->Ln(8);
          $this->MultiCell('190','5',$marco,'0','J',false);
         break;
          }
     
      }
      //***APROBACION**************************************************************
        function writeAprobEnva($area,$arrAprob){
            switch ($area) {
              case 1:
                switch ($this->arrDatos["id_categoria_solicitud"]) {
                  //NUEVO ENVASE EMPAQUE
                  case 41;
                  case 42;
                  case 43;
                  case 44;
                  case 49;
                  case 50;
                  case 51;
                  case 52;
                    $aprob1= "De igual forma se le participa que dicha autorización está sujeta a las revisiones de este Despacho estime oportuno realizar de acuerdo a los avances de la Ciencia y Tecnología en reguardo de la salud pública.";
                    $aprob2= "Esta Autorización tendrá una vigencia de ".$arrAprob['total']." a partir de la fecha de emisión de este documento. Por consiguiente, a su vencimiento deberá renovarse nuevamente de acuerdo a lo establecido en el Artículo 22 de las referidas Normas Complementarias ";
                    $aprob3= "Autorización que se expide a petición de la parte interesada, en la ciudad Caracas a los ".$arrAprob['dia']." dias del mes de ".$arrAprob['mes']." del año ".$arrAprob['ano'];
                  break;

                }   
              break;
            }

            $this->SetFont('Arial','','11');
            $this->Ln(3);
            if (isset($aprob1)) {
              $this->MultiCell('190','5',$aprob1,'0','J',false);
              $this->Ln(1);
            }
            if (isset($aprob2)) {
              $this->MultiCell('190','5',$aprob2,'0','J',false);
              $this->Ln(1);
            }
            if (isset($aprob3)) {
              $this->MultiCell('190','5',$aprob3,'0','J',false);
            }

        }




      //***FOOTER**************************************************************

  }

?>