<?php
  class reportePDF extends FPDF{

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

      public function reportePdf(){
          $this->arrDat    = "";
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



        //FUNCION

       function writePdf($arrConsul,$arrDat2,$statusS){
        //Defino el Formato
       // $this->formato(1);
        //Imagen de Cabecera
        $this->Image(ROOT.'app/public/images/cintillo.jpg',9,8,195,13);
        //Datos del Permiso
        $this->Ln(8);

        for ($i=0; $i < count($arrDat2['desde']); $i++) {

          switch ($arrDat2['rol']) { //Evaluamos cada rol del func

             case '2':
             $txt_4= "RECEPCIONISTA";
              break;

             case '3':
            $txt_4= "ANALISTA";
             break;

             case '4':
            $txt_4= "COORDINADOR";
              break;

             case '5':
            $txt_4= "DIRECTOR DE AREA SUSTANTIVA";
              break;

             case '6':
            $txt_4= "CONTRALOR";
              break;

            case '7':
            $txt_4= "ADMINISTRADOR DE AREA SUSTANTIVA";
              break;

          }

        }

        $this->SetFont('Arial','','8');
        $txt_3= "SOLICITUDES POR RANGO DE FECHA DESDE: ".date('d/m/Y', strtotime($arrDat2['desde']))." HASTA: ".date('d/m/Y', strtotime($arrDat2['hasta']))."";
        $txt_5= "EVALUADA POR FUNCIONARIO: ".$arrConsul[0]['d_nombre']." ".$arrConsul[0]['d_apellido']." ";
        $txt_6= "".utf8_decode($arrConsul[0]['area'])."";
        $txt_7= "".$arrConsul[0]['coord']." ";

        $this->Ln(10);
        $this->MultiCell('170','6',$txt_3,'0','C',false);
        $this->MultiCell('170','6',$txt_5,'0','C',false);
        $this->MultiCell('170','6',$txt_6,'0','C',false);
        $this->MultiCell('170','6',$txt_7,'0','C',false);
        $this->Ln(3);

        switch ($arrConsul['0']['id_status_solicitud']) {

            case 2: //Recibido por el SACS (recepcionista)
            case 6: // Analista aprobar
            case 8: // Coordinador aprobar
            case 9: // Director aprobar
            //case 10: // Contralor aprobar
            case 11: // Contralor aprobar o director genmeral
        $this->SetFont('Arial','','8');
      //  $this->MultiCell('170','6',$txt_3,'0','C',false);
        $this->Ln(4);
        $this->SetWidths(array(12,22,18,55,25,30,34));
        $this->SetAligns(array('L','L','L','L','L','L','L'));
        $this->Row(array('Nro Sol','Per. Sanitario','Fecha','Categoria','Tipo','Marca','Denominacion'));



        switch ($arrConsul[0]['id_tipo_solicitud']) { // Evaluamos el tipo solicitud (NUEVO O NOTIFICACION) (CASOS 2,6,9,8)

         case 1: // NUEVO REGISTRO

        $p = 0; //Contador

        for ($i=0; $i < $arrConsul[0]['numRows']; $i++) {

        $p ++;


           $this->Row(array($arrConsul[$i]['id_solicitud'],
                            $arrConsul[$i]['d_numero_sanitario'],
                            date('d/m/Y', strtotime($arrConsul[$i]['f_solicitud'])),
                            $arrConsul[$i]['d_categoria_solicitud'],
                            utf8_decode($arrConsul[$i]['d_tipo_prod']),
                            utf8_decode($arrConsul[$i]['d_marca']),
                            utf8_decode($arrConsul[$i]['d_denomina'])));
         }

            break;
          
           case 2:  // NOTIFICACIONES


        $p = 0; //Contador

        for ($i=0; $i < $arrConsul[0]['numRows']; $i++) {

        $p ++;

           $this->Row(array($arrConsul[$i]['id_solicitud'],
                            $arrConsul[$i]['d_numero_sanitario'],
                            date('d/m/Y', strtotime($arrConsul[$i]['f_solicitud'])),
                            $arrConsul[$i]['d_categoria_solicitud'],
                            utf8_decode($arrConsul[$i]['d_tipo_prod']),
                            utf8_decode($arrConsul[$i]['d_marca']),
                            $arrConsul[$i]['d_denomina']));

        }
            break;



        }

            break;

            case 5: // Analista rechazar
            case 12: // Coordinador rechazar
            case 13: // Director rechazar
            case 14: // Contralor rechazar


        $this->SetWidths(array(15,20,18,55,22,30,34));
        $this->SetAligns(array('L','L','L','L','L','L','L'));
        $this->Row(array('Nro Sol','Per.Sanitario','Fecha','Categoria','Tipo','Marca','Denominacion'));


        switch ($arrConsul[0]['id_tipo_solicitud']) { // Evaluamos el tipo solicitud (NUEVO O NOTIFICACION) (CASOS 5,12,13)

          case 1: // Registro nuevo

         $p = 0; //Contador

        for ($i=0; $i < $arrConsul[0]['numRows']; $i++) {

        $p ++;
            $this->SetWidths(array(15,20,18,55,22,30,34));
            $this->Row(array($arrConsul[$i]['id_solicitud'],
                            $arrConsul[$i]['d_numero_sanitario'],
                            date('d/m/Y', strtotime($arrConsul[$i]['f_solicitud'])),
                            $arrConsul[$i]['d_categoria_solicitud'],
                            utf8_decode($arrConsul[$i]['d_tipo_prod']),
                            $arrConsul[$i]['d_marca'],
                            $arrConsul[$i]['d_denomina']));

             /*MOTIVO RECHAZO*/

            if (!empty($arrConsul[$i]['motivo'])) {

              $this->MultiCell('194',6,'Motivo del rechazo',1,'C',false);
      
              $this->SetWidths(array(194));
              $this->SetAligns(array('J'));
              $cadenalimpia[$i] = preg_replace("[\n|\r|\n]", " ", $arrConsul[$i]['motivo']);
              $this->Row(array(trim($cadenalimpia[$i])));

            }

        }
            break; // fin caso 1
          
           case 2: //Notificaciones

         $p = 0; //Contador

        for ($i=0; $i < $arrConsul[0]['numRows']; $i++) {

        $p ++;

           $this->Row(array($arrConsul[$i]['id_solicitud'],
                            $arrConsul[$i]['d_numero_sanitario'],
                            date('d/m/Y', strtotime($arrConsul[$i]['f_solicitud'])),
                            $arrConsul[$i]['d_categoria_solicitud'],
                            utf8_decode($arrConsul[$i]['d_tipo_prod']),
                            $arrConsul[$i]['d_marca'],
                            $arrConsul[$i]['d_denomina']));

             /*MOTIVO RECHAZO*/

             if (!empty($arrConsul[$i]['motivo'])) {

              $this->MultiCell('194',6,'Motivo del rechazo',1,'C',false);
      
              $this->SetWidths(array(194));
              $this->SetAligns(array('J'));
              $cadenalimpia[$i] = preg_replace("[\n|\r|\n]", " ", $arrConsul[$i]['motivo']);
              $this->Row(array(trim($cadenalimpia[$i])));

            }

        }
            break; // fin case 2

        }

  
            break; // fin break case (5,12,13) 
        }


        } // Fin Metodo

  }

?>