<?php
  class PlanInocuidad extends FPDF{

    // ******************************************************************************
    //
    // Clase para generar las planillas
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
          $this->arrDatos    = "";
          $this->arrDetProd  = "";
          $this->arrTitular  = "";
          $this->arrFabric   = "";
          $this->arrPlant    = "";
          $this->contEnv     = "";
          $this->arrCont     = "";
          $this->listCont    = "";
      }

      public function writePlanilla($arrDat){

            $this->SetFont('Arial','B','9');
            $this->Ln(10);
            $this->MultiCell('190',6,utf8_decode($arrDat['d_categoria_solicitud']),1,'C',false); 
            $this->SetWidths(array(60,50,50,30));
            $this->SetFont('Arial','','10');
            $this->SetAligns(array('C','C','C','C'));
            $this->SetFont('Arial','B','10');
            $this->Row(array('Tipo Solicitud','N° de Registro','Fecha Solicitud','N° Solicitud'));
            $this->SetFont('Arial','','9');
            $this->Row(array($arrDat['d_tipo_solicitud'],$arrDat['nroReg'],$arrDat['f_solicitud'],$arrDat['nroSol']));

      }

      //Datos de las Empresas
        public function writeEmpresa($arrEmpre){
           
           $this->SetFont('Arial','B','10');
           $this->MultiCell('190',6,'DATOS DE LAS EMPRESAS',1,'L',false); 
           $this->SetWidths(array(100,30,60));
           $this->SetFont('Arial','B','10');
           $this->SetAligns(array('C','C','C'));
           $this->Row(array('Razón Social de la Empresa','Actividad','Rif/Id'));  
           $this->SetFont('Arial','','10');
           $this->SetAligns(array('L','C','C'));
           //Recorrer para Extraer Data
             $arrActiv = array(1,2,3,4,5,6,9);
             $p = 0;
             foreach ($arrEmpre as $item){
                foreach($item as $key => $value){
                      if($key == 'id_actividad' && in_array($value,$arrActiv) ){
                         
                         $this->Row(array(utf8_decode($item['d_empresa']['d_nombre']),$item['d_actividad'],$item['d_empresa']['rif']));  
                      }
 
                 }
                 $p++;
              }

          }

        //Datos del Producto
        
           public function writeProducto($arrProd){
           
           $this->SetFont('Arial','B','10');
           $this->MultiCell('190',6,'DATOS DE IDENTIFICACIÓN DEL PRODUCTO',1,'L',false); 
           $this->SetWidths(array(70,60,60));
           $this->SetFont('Arial','B','10');
           $this->SetAligns(array('L','L','C'));
           $this->Row(array('Denominación','Nombre de Fantasía','Marca'));  
           $this->SetFont('Arial','','10');
           $this->SetAligns(array('L','L','L'));
           $this->Row(array(utf8_decode($arrProd['d_denomina']),utf8_decode($arrProd['d_fantasia']),utf8_decode($arrProd['d_marca'])));      
           //Identificacion del Producto

          } 

          public function writeEnvase($arrEnvase){

               $this->SetFont('Arial','B','10');
               $this->MultiCell('190',6,'DATOS DE ENVASE Y/O EMPAQUE',1,'L',false); 
               $this->SetWidths(array(70,30,30,60));
               $this->SetFont('Arial','B','10');
               $this->SetAligns(array('C','C','C','C'));
               $this->Row(array('Descripción','N° Autorización','Fecha','Uso del Envase y/o Empaque'));
               $this->SetFont('Arial','','10');
               foreach($arrEnvase as $item){
                 foreach($item as $key => $value){
                    if($key == 'd_desc_envase'){

                        $this->Row(array(utf8_decode($item['d_desc_envase']),$item['id_autorizacion_envase'],$item['f_autorizacion'],utf8_decode($item['d_uso_envase'])));         
                    } 
                     
                 } 

               }
               
          } 

          public function writeContenido($arrCont){

         //Presentacion y Contenido Neto
           $this->SetFont('Arial','B','10');
           $this->MultiCell('190',6,'PRESENTACIÓN Y CONTENIDO NETO',1,'L',false); 
           $this->SetWidths(array(30,90,40,30));
           $this->SetFont('Arial','B','10');
           $this->SetAligns(array('C','L','C','C'));
           $this->Row(array('N° AUT.','Forma del Envase','Contenido Neto','Unidad de Medida'));
           $this->SetFont('Arial','','10'); 
           foreach($arrCont as $item){
                 foreach($item as $key=>$value){
                   if($key == 'contenido_neto'){
                        $this->Row(array($item['id_autorizacion_envase'],$item['d_desc_envase'],$item['cont_neto_only'],$item['unidad_medida']));  
                   }
                 }
               }
             }

       public function writeComp($arrCont){

        //Datos de la Composicion del Producto 
           $this->SetFont('Arial','B','10');
           $this->MultiCell('190',6,'DATOS DE LA COMPOSICIÓN DEL PRODUCTO',1,'L',false); 
           $this->SetWidths(array(40,40,80,30));
           $this->SetFont('Arial','B','10');
           $this->SetAligns(array('C','C','C','C'));
           $this->Row(array('Ingrediente o Aditivo','Tipo','Función','Cantidad'));
           //$this->MultiCell('190',6,$arrCont,1,'L',false); 
           $this->SetFont('Arial','','10'); 
           foreach($arrCont as $item){
                 foreach($item as $key=>$value){
                   if($key == 'd_ingrediente'){
                      if($item['id_tipo_composicion'] == 3){
                        $this->Row(array(utf8_decode($item['d_ingrediente']),$item['d_tipo_composicion'],utf8_decode($item['d_funcion']),$item['cant_ingrediente']." ".$item['simbolo']));  
                      }else{
                        $this->Row(array(utf8_decode($item['d_ingrediente']),$item['d_tipo_composicion'],utf8_decode($item['d_funcion']),$item['cant_ingrediente']." ".$item['simbolo']));
                      }
                   }
                 }
               }
       }  

        
    public function writeDuracion($arrCont){

        //Datos de la Composicion del Producto 
           $this->SetFont('Arial','B','10');
           $this->MultiCell('190',6,'DATOS DE LA CONSERVACIÓN Y DURACIÓN DEL PRODUCTO',1,'L',false); 
           $this->SetWidths(array(110,30,50));
           $this->SetFont('Arial','B','10');
           $this->SetAligns(array('L','C','C'));
           $this->Row(array('Condiciones de la Conservación','Cantidad','Tiempo(días,meses,años)'));
           //$this->MultiCell('190',6,$arrCont,1,'L',false); 
           $this->SetFont('Arial','','10');

           foreach($arrCont as $item){
                 foreach($item as $key=>$value){
                   if($key == 'd_modo_conservacion'){
                      $this->Row(array(utf8_decode($item['d_modo_conservacion']),$item['n_cant_conservacion'],utf8_decode($item['d_tiempo'])));
                   }
                 }
               }
    }

     public function writeLote($arrCont){

        //Datos de la Composicion del Producto 
           $this->SetFont('Arial','B','10');
           $this->MultiCell('190',6,'IDENTIFICACIÓN DEL LOTE DE PRODUCCIÓN',1,'L',false); 
           $this->SetWidths(array(80,110));
           $this->SetFont('Arial','B','10');
           $this->SetAligns(array('L','L'));
           $this->Row(array('Código del Lote','Descripción del Lote'));
           //$this->MultiCell('190',6,$arrCont,1,'L',false); 
           $this->SetFont('Arial','','10');
            
           foreach($arrCont as $item){
                 foreach($item as $key=>$value){
                   if($key == 'd_codigo_lote'){
                      $this->Row(array(utf8_decode($item['d_codigo_lote']),utf8_decode($item['d_descripcion_lote'])));
                   }
                 }
               }
    }

    public function writeObserva($observa){

        //Datos de la Composicion del Producto 
           $this->SetFont('Arial','B','10');
           $this->MultiCell('190',6,'OBSERVACIÓN DEL SOLICITANTE',1,'L',false); 
           $this->SetFont('Arial','','10');
           $this->MultiCell('190',6,utf8_decode($observa),1,'L',false); 
            
           
    }

    public function writeSolicitante($data){

        //Datos de la Composicion del Producto
          //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL SOLICITANTE',1,'C',false); 
             $this->SetWidths(array(20,55,50,35,30));
             $this->SetFont('Arial','','10');
             $this->SetAligns(array('C','C','C','C','C'));
             $this->Row(array('Cedula','Nombre y Apellido','Correo Electrónico','Teléfono','Firma Solicitante'));
             $this->SetAligns(array('C','J','J','C','C'));
             $this->Row(array($data['cedula'],utf8_decode($data['d_nombre'].''.$data['d_apellido']),$data['email'],$data['telefono'],''));
         //Cuadro de Firma
    }
      //***HEADER*******************************************************************

	   function writeHeader(){
          // $this->Image(ROOT.'app/public/images/cintillo.jpg',9,8,195,13);
          $this->Image(ROOT.'app/public/images/cintillo2.jpg',9,8,195,13);
     }

      //***HEADER*******************************************************************
      //***TIPO DE SOLICITUD********************************************************

      function writeTipSol($tipSol){
           $this->SetFont('Arial','','11');
           $this->Ln(10);
           $this->MultiCell('190','6',utf8_decode($tipSol["titulo"]),'0','C',false);
           $this->MultiCell('190','6',utf8_decode($tipSol["tipSol"]),'0','C',false);
      }

     //***TIPO DE SOLICITUD**********************************************************

     //***** NOTIFICACIONES******/////
        //AJUSTE DE GRADO ALCOHOLICO
        public function writeAjusteGrado($data){

           //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        }

        //CAMBIO DE DENOMINACION//

        public function writeCmbDeno($data){
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(90,100));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C'));
             if ($data['d_tipo_denomina'] == 1) {
                $this->Row(array('Denominación Anterior','Denominación Solicitada'));
                $this->SetAligns(array('J','J'));
                $this->Row(array(utf8_decode($data['d_denomina_anterior']),utf8_decode($data['d_denomina_actual'])));
             }else
             if ($data['d_tipo_denomina'] == 2) { 
                $this->Row(array('nombre de fantasía anterior','nombre de fantasía solicitado'));
                $this->SetAligns(array('J','J'));
                if ($data['d_fantasia_anterior']=='') {
                  $fant = "NO POSEE";
                }else{
                  $fant = $data['d_fantasia_anterior'];
                }
                $this->Row(array(utf8_decode($fant),utf8_decode($data['d_fantasia_actual'])));
             }else
             if ($data['d_tipo_denomina'] == 3) {
                $this->Row(array('Denominación Anterior','Denominación Solicitada'));
                $this->SetAligns(array('J','J'));
                $this->Row(array(utf8_decode($data['d_denomina_anterior']),utf8_decode($data['d_denomina_actual'])));
                $this->Row(array('nombre de fantasía anterior','nombre de fantasía solicitado'));
                $this->SetAligns(array('J','J'));
                if ($data['d_fantasia_anterior']=='') {
                  $fant = "NO POSEE";
                }else{
                  $fant = $data['d_fantasia_anterior'];
                }
                $this->Row(array(utf8_decode($fant),utf8_decode($data['d_fantasia_actual'])));
             } 
        }

        //CAMBIO DE FORMULA O INGREDIENTE//
        public function writeCmbIngre($data){

           //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(40,40,80,30));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C','C'));
             $this->Row(array('Ingrediente o Aditivo','Tipo','Función','Cantidad'));
           //$this->MultiCell('190',6,$arrCont,1,'L',false); 
             $this->SetFont('Arial','','10'); 
              for($j=0;$j<count($data);$j++){
                  if ($data[$j]["id_tipo_composicion"] == 2) {
                    $this->Row(array(utf8_decode($data[$j]['d_ingrediente']),$data[$j]['d_tipo_composicion'],utf8_decode($data[$j]['d_funcion']),$data[$j]['n_cantidad'].' '.utf8_decode($data[$j]['simbolo'])));
                  }else
                  if ($data[$j]["id_tipo_composicion"] == 3) {
                    $this->Row(array(utf8_decode($data[$j]['d_ingrediente']),$data[$j]['d_tipo_composicion'],utf8_decode($data[$j]['d_aditivo']),$data[$j]['n_cantidad'].' '.utf8_decode($data[$j]['simbolo'])));
                  }
              }     
            
             //Recorre el Arreglo
         }

         //CAMBIO DE FABRICANTE//
         public function writeCmbFabri($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(30,65,30,65));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C','C'));
             $this->Row(array('Rif/Id','Fabricante Anterior','Rif/Id','Fabricante Actual'));
             $this->SetAligns(array('C','J','C','J'));
             $this->Row(array($data['id_empresa_anterior'],utf8_decode($data['razon_anterior']),$data['id_empresa_actual'],utf8_decode($data['razon_actual'])));

        }

     //CAMBIO DE MARCA//   
      public function writeCmbMarca($data){

           //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(90,100));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C'));
             $this->Row(array('Marca Anterior','Marca Solicitada'));
             $this->SetAligns(array('J','J'));
             $this->Row(array(utf8_decode($data['d_marca_anterior']),utf8_decode($data['d_marca_actual'])));

        }

      //CAMBIO DE CONTENIDO NETO//  

       public function writeCmbCont($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(45,45,50,50));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C','C'));
             $this->Row(array('Cont. Neto Anterior','Unidad Anterior','Cont. Neto Solicitado','Unidad Actual'));
             $this->SetAligns(array('C','C','C','C'));
             $this->Row(array($data['n_contenido_anterior'],$data['simbolo_anterior'],$data['n_contenido_actual'],$data['simbolo_actual']));

        } 

        //CAMBIO DE ROTULO// 

        public function writeCmbRotulo($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(190));
             $this->SetFont('Arial','','10');
             $this->SetAligns(array('L'));
             $this->Row(array('Observaciones:'));
             $this->SetAligns(array('J'));
             $this->Row(array(utf8_decode($data['d_observacion'])));

        }  

        //CAMBIO DE IMPORTADOR//
        public function writeCmbImporta($data){

             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        } 

        //CAMBIO DE RAZON SOCIAL DEL FABRICANTE//

        public function writeCmbRazFab($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(30,80,80));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Rif/Id','Razón Social Anterior','Razón Social Actual'));
             $this->SetAligns(array('C','J','J'));
             $this->Row(array($data['id_empresa'],utf8_decode($data['razon_anterior']),utf8_decode($data['razon_actual'])));

        } 

        //CAMBIO DE RAZON SOCIAL DEL TITULAR//  
       
        public function writeCmbRazTit($data){
      
           //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(30,80,80));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Rif/Id','Razón Social Anterior','Razón Social Actual'));
             $this->SetAligns(array('C','J','J'));
             $this->Row(array($data['id_empresa'],utf8_decode($data['razon_anterior']),utf8_decode($data['razon_actual'])));


        }  

        //CAMBIO DE TITULAR//
        public function writeCmbTit($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(30,65,30,65));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C','C'));
             $this->Row(array('Rif/Id','Titular Anterior','Rif/Id','Titular Actual'));
             $this->SetAligns(array('C','J','C','J'));
             $this->Row(array($data['id_empresa_anterior'],utf8_decode($data['razon_anterior']),$data['id_empresa_actual'],utf8_decode($data['razon_actual'])));

        }  

        //CAMBIO DE GRADO ALCOHOLICO// 
        public function writeCmbDrImp($data){

             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        } 

        //CAMBIO DE LUGAR DE FABRICACION//
        public function writeCmbLugFab($data){

                //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        }   
        
        //INCLUSION DE DISTRIBUIDOR//
        public function writeIncDist($data){

             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        } 

        //INCLUSION DE IMPORTADOR//
        public function writeIncImp($data){
 
              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(40,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C'));
             $this->Row(array('Rif','Razón Social del Importador'));
             $this->SetAligns(array('C','J'));
             $this->Row(array($data['rif'],$data['razon_importa']));
         
        } 

        //INCLUSION DE FABRICANTE//
        public function writeIncFab($data){
             $this->Ln(2);
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','9');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
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

        public function writeIncEnv($data){
        
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));


        } 

        public function writeIncCont($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(90,50,50));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Envase','Cont. Neto','Unidad Medida'));
             $this->SetAligns(array('J','C','C'));

             for($j=0;$j<count($data);$j++){
                  $this->Row(array($data[$j]['d_desc_envase'],$data[$j]['n_contenido_neto'],$data[$j]['simbolo']));
               }  
             

        }

        public function writeIncMat($data){ 
              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(45,145));
             $this->SetFont('Arial','B','9');
             $this->SetAligns(array('C','C'));
             $this->Row(array('NRO. AUTORIZACIÓN','ENVASE'));
             $this->SetAligns(array('C','J'));
             $this->Row(array(utf8_decode($data['n_otorgado_higiene']),utf8_decode(strtoupper($data['d_material_contenedor']))));

        }  

        public function writeIncExp($data){

            //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        }

        public function writeIncPromo($data){

             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        }

        public function writeExcDist($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        }

        public function writeExcImp($data){

             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        }

        public function writeExcFab($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        }

        public function writeExcEnv($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        } 

        public function writeExcCont($data){
          
           //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));


        } 

        public function writeExcMat($data){
      
             //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));


        }

        public function writeRenova($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        }  

        public function writeIncLicExp($data){

              //Datos de la Composicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'L',false); 
             $this->SetWidths(array(20,20,150));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C','C'));
             $this->Row(array('Grado Anterior','Grado Solicitado','Denominación después del Cambio'));
             $this->SetAligns(array('C','C','J'));
             $this->Row(array($data['n_grado_anterior'],$data['n_grado_actual'],utf8_decode($data['d_denomina_actual'])));

        }    

     //**FIN**    
     //NUEVO CODIGO PARA ENVASE Y EMPAQUE
          public function writeProductoEE($arrProd){
           $this->SetFont('Arial','B','10');
           $this->MultiCell('190',6,'DATOS DE IDENTIFICACIÓN DEL PRODUCTO',1,'L',false); 
           $this->SetWidths(array(63,63,64));
           $this->SetFont('Arial','B','10');
           $this->SetAligns(array('C','C','C'));
           $this->Row(array('Producto','Denominación','Uso'));
           $this->SetFont('Arial','','10');
           $this->SetAligns(array('L','L','L'));
           $this->Row(array(utf8_decode($arrProd['d_producto']),utf8_decode($arrProd['d_denomina']),utf8_decode($arrProd['d_uso']))); 
           //Identificacion del Producto d_clase_prod
          } 
          public function writeEnvaseEE($datEnvase){

               $this->SetFont('Arial','B','10');
               $this->MultiCell('190',6,'DATOS DE ENVASE Y/O EMPAQUE Y ARTICULOS',1,'L',false); 
               $this->SetWidths(array(72,45,73));
               $this->SetFont('Arial','B','10');
               $this->SetAligns(array('C','C','C'));
               $this->Row(array('Descripción de la Materia','Nro.de Oficio Autorizado','Razón Social'));
               $this->SetFont('Arial','','10');
               foreach($datEnvase as $item){
                 foreach($item as $key => $value){
                    if($key == 'd_uso'){
                        $this->Row(array(utf8_decode($item['d_materia']),utf8_decode($item['nro_oficio']),utf8_decode($item['d_empresa_prov'])));           
                    }    
                 } 
               }    
          } 
            public function writeContenidoEE($arrCont){

           $this->SetFont('Arial','B','10');
           $this->MultiCell('190',6,'PRESENTACIÓN Y CONTENIDO NETO',1,'L',false); 
           $this->SetWidths(array(95,35,60));
           $this->SetFont('Arial','B','10');
           $this->SetAligns(array('C','C','C','L'));
           $this->Row(array('Componente','Contenido Neto','Unidad de Medida'));
           $this->SetFont('Arial','','10'); 
           foreach($arrCont as $item){
                 foreach($item as $key=>$value){
                   if($key == 'd_componente'){
                        $this->Row(array(utf8_decode($item['d_componente']),$item['cant_componente'],utf8_decode($item['d_unidad_medida'])));  
                   }
                 }
               }  
             }
           public function writeEquipoF($datEq){
               $this->SetFont('Arial','B','10');
               $this->MultiCell('190',6,'DATOS DEL EQUIPO PARA LA FABRICACIÓN DE ALIMENTOS',1,'L',false); 
               $this->SetWidths(array(95,95));
               $this->SetFont('Arial','B','10');
               $this->SetAligns(array('C','C'));
               $this->Row(array('Descripción','Uso del Equipo de Fabricación'));
               $this->SetFont('Arial','','10');
               foreach($datEq as $item){
               // echo var_dump($item);
                 foreach($item as $key => $value){
                    if($key == 'd_descripcion'){
                        $this->Row(array(utf8_decode($item['d_descripcion']),utf8_decode($item['d_uso'])));         
                    }    
                 } 
               }    
          }
          //cambio de razon social y de denominacuio
            public function writeCambioDenoEE($data){
           //Datos de laComposicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(95,95));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C'));
             $this->Row(array('Denominación Anterior','Denominación Actual'));
             $this->SetAligns(array('C','J','C','J'));
             $this->Row(array(utf8_decode($data['d_denomina_anterior']),utf8_decode($data['d_denomina_actual'])));
        }
        public function writeCambioRazoEE($data){
           //Datos de laComposicion del Producto 
             $this->SetFont('Arial','B','10');
             $this->MultiCell('190',6,'INFORMACIÓN DEL CAMBIO SOLICITADO',1,'C',false); 
             $this->SetWidths(array(95,95));
             $this->SetFont('Arial','B','10');
             $this->SetAligns(array('C','C'));
             $this->Row(array('Razón Social Anterior','Razón Social Actual'));
             $this->SetAligns(array('C','J','C','J'));
             $this->Row(array(utf8_decode($data['d_empresa_anterior']),utf8_decode($data['d_empresa_actual'])));
        }

      //***FOOTER**************************************************************

          function writeFooter(){
            $this->SetLineWidth(0.5);
            $this->SetDrawColor(0,0,0);
            $this->Ln(3);
            $numLinFoo=(int)$this->GetY();
            $this->Line(14,$numLinFoo,190,$numLinFoo);
            $mensaje ='Vigilando la Salud de Todas y Todos.';
            $servicio ='Servicio Autónomo de Contraloría Sanitaria.';
            $direccion ='Dirección de Inocuidad de Alimentos y Bebidas.';
            $this->Ln(3);
            $this->SetFont('Arial','','9');
            $this->MultiCell('190','4',$mensaje,'0','C',false);
            $this->SetFont('Arial','','9');
            $this->MultiCell('190','4',$servicio,'0','C',false);
            $this->SetFont('Arial','','9');
            $this->MultiCell('190','4',$direccion,'0','C',false);
            $this->Ln(1);
            $ubic ='Centro Simón Bolívar, Edificio Sur, Ministerio del Poder Popular para la Salud, piso 3, oficina 313. El Silencio, Caracas-Venezuela.';
            $telf ='Telf: (0212) 4080474 Fax (0212) 4080505 Página web: http://sacs.mpps.gob.ve.';
            $this->SetFont('Arial','','6');
            $this->MultiCell('190','4',$ubic,'0','C',false);
            $this->SetFont('Arial','','6');
            $this->MultiCell('190','4',$telf,'0','C',false);
          }

      //***FOOTER**************************************************************

  }

?>