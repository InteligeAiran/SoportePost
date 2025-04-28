<?php
  /*
    Clase para generar los permisos Sanitarios
    y las Actas de Inspeccion 
  */
  class PDF extends FPDF
  {

   //Creo los metodos para las funciones multicelda
     var $widths;
     var $aligns;

  function SetWidths($w)
    {
     //Set the array of column widths
       $this->widths=$w;
     }

   function SetAligns($a)
     {
      //Set the array of column alignments
        $this->aligns=$a;
     }

   function Row($data)
     {
     //Calculate the height of the row
       $nb=0;
       for($i=0;$i<count($data);$i++)
         $nb=max($nb,$this->NbLines($this->widths[$i],$data[$i]));
         $h=5*$nb;
   //Issue a page break first if needed
         $this->CheckPageBreak($h);
   //Draw the cells of the row
      for($i=0;$i<count($data);$i++)
        {
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

    function CheckPageBreak($h)
      {
       //If the height h would cause an overflow, add a new page immediately
         if($this->GetY()+$h>$this->PageBreakTrigger)
          $this->AddPage($this->CurOrientation);
         }

       function NbLines($w,$txt)
        {
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
  while($i<$nb)
  {
    $c=$s[$i];
    if($c=="\n")
      {
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
    if($l>$wmax)
    {
    if($sep==-1)
    {
    if($i==$j)
         $i++;
    }
    else
    $i=$sep+1;
    $sep=-1;
    $j=$i;
    $l=0;
    $nl++;
    }
    else
    $i++;
  }
  return $nl;
} 

function image_firma($urlFirma,$numLinFirma){
    $this->Image($urlFirma,80,$numLinFirma-17,65,32);
}
//********End of Multicell********************* 
//*Head of the document
   function formato($nTipo)
  {

  //Defino Parametro Generales
      $this->SetFillColor(0,0,0);
        $this->SetTextColor(0);
        $this->SetDrawColor(0,0,0);
        $this->SetLineWidth(.3);
    $this->SetLeftMargin(22);
    $this->SetRightMargin(30);
        $this->SetFont('Arial','','12');
     //Fin de Parametros   
   /*if($this->nTipo == 1){
      $this->tamHoja = 'Letter';
    $this->orientado = 'P';
    $this->mm = 'mm';
    $this->FPDF($this->orientado,$this->mm,$this->tamHoja);
    $this->setMargins(3,3,3);
   }*/
  }

  function Footer1($valPie)
     {
            
        if($valPie >160){
         $setY =-20;
      }else{
        $setY=-20;
      }
         
      //***Linea del pie de pagina 
      $this->SetLineWidth(0.5);
      $this->SetDrawColor(0,0,0);
      $this->Ln(3);
      $numLinFoo=(int)$this->GetY();
      $this->Line(24,$numLinFoo,190,$numLinFoo);
      //***
      //***Texto 14,15,16  pie de pagina 
      $txt_14 ='Centro Simón Bolívar, Edificio Sur, Ministerio del Poder Popular para la Salud, piso 3, oficina 313,';
      $txt_15 ='Servicio Autónomo de Contraloría Sanitaria';
      $txt_16 ='Teléfono 4080477 Telefax 4080505 Página web: http://sacs.mpps.gob.ve'; 
      $this->SetFont('Arial','','6');
      $this->MultiCell('170','4',$txt_14,'0','C',false);              
      $this->SetFont('Arial','','6');
      $this->MultiCell('170','4',$txt_15,'0','C',false);
      $this->SetFont('Arial','','6');               
      $this->MultiCell('170','4',$txt_16,'0','C',false);
     }
   //Emisión de Permisos   
   function writePermiso($arrDatos){
        $fecha=fechaBD();
      //Defino el Formato
        $this->formato(1);
      //Imagen de Cabecera
        $this->Image(URL.'app/public/images/head_reporte.jpg',4,8,202,20);
      //Datos del Permiso
        $this->SetFont('Arial','','12');
           $encab = $arrDatos["contraloria"];
           $tit_1 ='PERMISO SANITARIO DE FUNCIONAMIENTO PARA ESTABLECIMIENTOS '.$arrDatos["idTag"];
           $tit_2 = 'PSNº '.$arrDatos["permiso"];
           $this->Ln(20);
           $this->MultiCell('170','6',$encab,'0','C',false);
           $this->MultiCell('170','6',$tit_1,'0','C',false);
           $this->MultiCell('170','6',$tit_2,'0','C',false);
           $this->SetFont('Arial','','12'); 
        //Fecha
           $this->Cell(290,10,'Fecha: '.$arrDatos['fecha'],0,0,'C');
        //$this->Cell(0,10,$arrDatos['nroSol'],0,0,'L');     
      //Establecimiento
          $this->Ln(8);
          $this->MultiCell('170','6','Establecimiento:','0','J',false);
          $this->MultiCell('170','6',$arrDatos['estab'],'0','J',false);       //Hasta aqui va el formato  
    //Razon Social 
          //$this->MultiCell('170','6','Razón Social:','0','J',false);   
          //$this->MultiCell('170','6',$arrDatos['razon'],'0','J',false);  
    //Representante Legal 
          $this->MultiCell('170','6','Propietario:','0','J',false);   
          $this->MultiCell('170','6',$arrDatos['Prop'],'0','J',false);           
          //$this->MultiCell('170','6','Propietario : '.$arrDatos['propietario'].'-'.$arrDatos['cedprop'],'0','J',false);   
          //$this->MultiCell('170','6',$arrDatos['repre'].'        '.$arrDatos['cedula'],'0','J',false);           
          $this->MultiCell('170','6','Presente.-','0','J',false);
      //Separacion par el texto 
          $this->Ln(3);
      //Texto 1 
         $txt_1 = '     En respuesta a su solicitud Nº '.$arrDatos['nroSol'].' de fecha: '.$arrDatos['fecha'];
         $txt_1.= ' en la cual pide el Permiso Sanitario correspondiente al establecimiento '.$arrDatos['uso'];
         $txt_1.= ', construido en un área de: '.$arrDatos['dimension'].', ubicado en: '.$arrDatos['direccion'].', ';
         $txt_1.= 'Parroquia: '.$arrDatos['parroquia'].', cumplo con informarle que basados en el principio de buena fe ';
         $txt_1.= 'por parte del interesado y de acuerdo a lo establecido en los artículos 83 y 84 de la CONSTITUCIÓN DE LA REPÚBLICA ';
         $txt_1.= 'BOLIVARIANA DE VENEZUELA. Ley Orgánica de Salud, Art. 32-33 del Reglamento General de Alimentos y sus Normas Complementarias, '; 
         $txt_1.= 'el Servicio Autónomo de Contraloría Sanitaria (SACS) considera APROBARLO.';
         $this->MultiCell('170','6',$txt_1,'0','J',false);       
      //Texto 2
        $this->Ln(5);
        $txt_2 ='Este permiso queda sujeto al control y vigilancia posterior por parte del Ministerio ';
        $txt_2.='del Poder Popular para la Salud a través del Servicio Autónomo de Contraloría Sanitaria, ';
        $txt_2.='en todo cuanto se refiere al cumplimiento de las disposiciones sanitarias contenidas en las Normas afines. ';
        $this->MultiCell('170','6',$txt_2,'0','J',false);       
     //Texto 3
        $this->Ln(5);
        $txt_3 = 'En caso de no permitir la inspección correspondiente, suministrar infomación falsa o deterioro de las condiciones higiénicas sanitarias, ';
        $txt_3.= 'así como modificaciones de cualquier tipo, sin previa consulta y aprobación por parte del SACS, posterior a su otorgamiento, nos reservamos el derecho ';
        $txt_3.= 'a ejercer las acciones administrativas y legales pertinentes.';
        $this->MultiCell('170','6',$txt_3,'0','J',false); 
     //Vigencia   
        $txt_4 ='ESTE PERMISO TIENE UNA VIGENCIA DE UN (1) AÑO'; 
        $this->MultiCell('170','6',$txt_4,'0','J',false); 
     //Texto 4 Firma Electronica
       $this->Ln(17);
       $numLinFirma=(int)$this->GetY();
       $this->image_firma(URL.$arrDatos["char_direccion"],$numLinFirma); 
     //Imagen del Sello 
       $this->Image(URL.'app/public/images/selloSolo.jpg',132,$numLinFirma-12,32,40);
       $this->SetFont('Arial','B','14');
       $this->Ln(9);
       $this->MultiCell('170','6',utf8_decode($arrDatos["char_nombre"]),'0','C',false); 
     //***Texto5
       $this->SetFont('Arial','','8');
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_cargo"]),'0','C',false);               
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_resolucion"]),'0','C',false);               
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_gaceta"]),'0','C',false);
       $this->SetFont('Arial','','7');
       $this->MultiCell('170','6',substr($arrDatos["firma"],0,328),'0','L',false); 
       $txt_11 ='Firmado Digitalmente por '.utf8_decode($arrDatos["char_nombre"]).', para verificar la validéz de este permiso puede ingresar a la página Web http://www.sacs.gob.ve, sección "CONSULTAS" y seleccionar "Permisos Estadales".'; 
       $this->MultiCell('170','6',$txt_11,'0','L',false); 
       $numPie =$this->GetY();
       $this->Footer1($numPie);
    }

    function writeVehiculo($arrDatos){
         $fecha=fechaBD();
      //Defino el Formato
        $this->formato(1);
      //Imagen de Cabecera
         $this->Image(URL.'app/public/images/head_reporte.jpg',4,8,202,20);
      //Datos del Permiso
           $this->SetFont('Arial','','12');
           $encab = $arrDatos["contraloria"];
           $tit_1 ='PERMISO SANITARIO PARA VEHÍCULOS '.$arrDatos["idTag"];
           $tit_2 = 'PSNº '.$arrDatos["permiso"];
           $this->Ln(20);
           $this->MultiCell('170','6',$encab,'0','C',false);
           $this->MultiCell('170','6',$tit_1,'0','C',false);
           $this->MultiCell('170','6',$tit_2,'0','C',false);
           $this->SetFont('Arial','','12'); 
        //Fecha
           $this->Cell(290,10,'Fecha: '.$arrDatos['fecha'],0,0,'C');
        //$this->Cell(0,10,$arrDatos['nroSol'],0,0,'L');     
      //Establecimiento
          $this->Ln(8);
          //$this->MultiCell('170','6','Vehículo: ','0','J',false);
          //$this->MultiCell('170','6',$arrDatos['vehiculo'],'0','J',false);       //Hasta aqui va el formato  
    //Representante Legal 
          $this->MultiCell('170','6','Solicitante: ','0','J',false); 
          $this->MultiCell('170','6',$arrDatos['repre'],'0','J',false);  
          $this->MultiCell('170','6','Propietario:','0','J',false);        
          $this->MultiCell('170','6',$arrDatos['Prop'],'0','J',false);    
          $this->MultiCell('170','6','Presente.-','0','J',false);
      //Separacion par el texto
       
          $this->Ln(3);
      //Texto 1 
         $txt_1 = '     En respuesta a su solicitud Nº '.$arrDatos['nroSol'].' de fecha: '.$arrDatos['fecha'];
         $txt_1.= ' en la cual pide el Permiso Sanitario: '.$arrDatos['uso'];  
         $txt_1.= ', con las siguientes características: Placa: '.$arrDatos['placa'].', Marca: '.$arrDatos['marca'].', Modelo: '.$arrDatos['modelo'].', ';
         $txt_1.= 'Serial de Carrocería: '.$arrDatos['carroceria'].', Serial de Motor: '.$arrDatos['motor'].', Color: '.$arrDatos['color'].', Rubro: '.$arrDatos['rubro'];
         $txt_1.= ', cumplo con informarle que basados en el Principio de Buena Fe ';
         $txt_1.= ' por parte del interesado y de acuerdo a lo establecido en los Artículos 83 y 84 de la Constitución de la República ';
         $txt_1.= ' Bolivariana de Venezuela. Ley Orgánica de Salud, Art. 32-33 del Reglamento General de Alimentos y sus Normas Complementarias, '; 
         $txt_1.= ' el Servicio Autónomo de Contraloría Sanitaria (SACS) considera APROBARLO.';
         $this->MultiCell('170','6',$txt_1,'0','J',false);       
      //Texto 2
        $this->Ln(5);
        $txt_2 ='Este permiso queda sujeto al control y vigilancia posterior por parte del Ministerio ';
        $txt_2.='del Poder Popular para la Salud a través del Servicio Autónomo de Contraloría Sanitaria, ';
        $txt_2.='en todo cuanto se refiere al cumplimiento de las disposiciones sanitarias contenidas en las Normas afines. ';
        $this->MultiCell('170','6',$txt_2,'0','J',false);       
     //Texto 3
        $this->Ln(5);
        $txt_3 = 'En caso de no permitir la inspección correspondiente, suministrar infomación falsa o deterioro de las condiciones higiénicas sanitarias, ';
        $txt_3.= 'así como modificaciones de cualquier tipo, sin previa consulta y aprobación por parte del SACS, posterior a su otorgamiento, nos reservamos el derecho ';
        $txt_3.= 'a ejercer las acciones administrativas y legales pertinentes.';
        $this->MultiCell('170','6',$txt_3,'0','J',false);
     //Vigencia    
        $txt_4 ='ESTE PERMISO TIENE UNA VIGENCIA DE UN (1) AÑO'; 
        $this->MultiCell('170','6',$txt_4,'0','J',false); 
     //Texto 4 Firma Electronica
       $this->Ln(17);
       $numLinFirma=(int)$this->GetY();
       $this->image_firma(URL.$arrDatos["char_direccion"],$numLinFirma); 
     //Imagen del Sello 
       $this->Image(URL.'app/public/images/selloSolo.jpg',132,$numLinFirma-12,32,40);
       $this->SetFont('Arial','B','14');
       $this->Ln(9);
       $this->MultiCell('170','6',utf8_decode($arrDatos["char_nombre"]),'0','C',false); 
     //***Texto5
       $this->SetFont('Arial','','8');
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_cargo"]),'0','C',false);               
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_resolucion"]),'0','C',false);               
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_gaceta"]),'0','C',false);
       $this->SetFont('Arial','','7');
       $this->MultiCell('170','6',substr($arrDatos["firma"],0,328),'0','L',false); 
       $txt_11 ='Firmado Digitalmente por '.utf8_decode($arrDatos["char_nombre"]).', para verificar la validéz de este permiso puede ingresar a la página Web http://www.sacs.gob.ve, sección "CONSULTAS" y seleccionar "Permisos Estadales".'; 
       $this->MultiCell('170','6',$txt_11,'0','L',false); 
       $numPie =$this->GetY();
       $this->Footer1($numPie);
    }
    //Emisión de Permisos   
   function writeRegulacion($arrDatos){
        $fecha=fechaBD();
      //Defino el Formato
        $this->formato(1);
      //Imagen de Cabecera
        $this->Image(URL.'app/public/images/head_reporte.jpg',4,8,202,20);
      //Datos del Permiso
        $this->SetFont('Arial','','12');
           $encab = $arrDatos["contraloria"];
           $tit_1 ='PERMISO SANITARIO DE FUNCIONAMIENTO PARA ESTABLECIMIENTOS '.$arrDatos["idTag"];
           $tit_2 = 'PSNº '.$arrDatos["permiso"];
           $this->Ln(20);
           $this->MultiCell('170','6',$encab,'0','C',false);
           $this->MultiCell('170','6',$tit_1,'0','C',false);
           $this->MultiCell('170','6',$tit_2,'0','C',false);
           $this->SetFont('Arial','','12'); 
        //Fecha
           $this->Cell(290,10,'Fecha: '.$arrDatos['fecha'],0,0,'C');
        //$this->Cell(0,10,$arrDatos['nroSol'],0,0,'L');     
      //Establecimiento
          $this->Ln(8);
          $this->MultiCell('170','6','Establecimiento:','0','J',false);
          $this->MultiCell('170','6',$arrDatos['estab'],'0','J',false);       //Hasta aqui va el formato  
    //Razon Social 
          //$this->MultiCell('170','6','Razón Social:','0','J',false);   
          //$this->MultiCell('170','6',$arrDatos['razon'],'0','J',false);  
    //Representante Legal 
          $this->MultiCell('170','6','Director Médico o Propietario:','0','J',false);   
          $this->MultiCell('170','6',$arrDatos['Prop'],'0','J',false);           
          //$this->MultiCell('170','6','Propietario : '.$arrDatos['propietario'].'-'.$arrDatos['cedprop'],'0','J',false);   
          //$this->MultiCell('170','6',$arrDatos['repre'].'        '.$arrDatos['cedula'],'0','J',false);           
          $this->MultiCell('170','6','Presente.-','0','J',false);
      //Separacion par el texto 
          $this->Ln(3);
      //Texto 1 
         $txt_1 = '     En respuesta a su solicitud Nº '.$arrDatos['nroSol'].' de fecha: '.$arrDatos['fecha'];
         $txt_1.= ' en la cual pide el Permiso Sanitario correspondiente al establecimiento '.$arrDatos['uso'];
         $txt_1.= ', se le notifica que el Servicio Autónomo de Contraloría Sanitaria una vez verificado el cumplimiento de los requisitos exigidos, '; 
         $txt_1.= 'se le otorga el PERMISO SANITARIO para su instalación y funcionamiento bajo la denominación suscrita según Registro Mercantil de "'.$arrDatos['estab'].'", ';
         $txt_1.= 'ubicado en: '.$arrDatos['direccion'].', Parroquia: '.$arrDatos['parroquia'].', Municipio: '.$arrDatos['municipio'].', Estado: '.$arrDatos['estado'].'. ';
         if ($arrDatos['contraloria'] === 'NIVEL CENTRAL') {
           $txt_1.= 'Según proyecto aprobado bajo oficio N° '.$arrDatos['ofi'].' de fecha '.$arrDatos['fechOfi'].'. ';
         }
         $txt_1.= 'Cumpliendo así con lo establecido en la Ley Orgánica de Salud N° 36.579 de fecha 11 de Noviembre de 1998 y la Gaceta Oficial de la República Bolivariana de Venezuela N° 36.595 del 03 de Diciembre de 1998.';

         $this->MultiCell('170','6',$txt_1,'0','J',false);       
      //Texto 2
        $this->Ln(5);
        $txt_2 ='Este permiso queda sujeto al control y vigilancia posterior por parte del Ministerio ';
        $txt_2.='del Poder Popular para la Salud a través del Servicio Autónomo de Contraloría Sanitaria, ';
        $txt_2.='en todo cuanto se refiere al cumplimiento de las disposiciones sanitarias contenidas en las Normas afines. ';
        $this->MultiCell('170','6',$txt_2,'0','J',false);       
     //Texto 3
        $this->Ln(5);
        $txt_3 = 'En caso de no permitir la inspección correspondiente, suministrar infomación falsa o deterioro de las condiciones higiénicas sanitarias, ';
        $txt_3.= 'así como modificaciones de cualquier tipo, sin previa consulta y aprobación por parte del SACS, posterior a su otorgamiento, nos reservamos el derecho ';
        $txt_3.= 'a ejercer las acciones administrativas y legales pertinentes.';
        $this->MultiCell('170','6',$txt_3,'0','J',false); 
     //Vigencia   
        $txt_4 ='ESTE PERMISO TIENE UNA VIGENCIA DE DOS (2) AÑOS'; 
        $this->MultiCell('170','6',$txt_4,'0','J',false); 
     //Texto 4 Firma Electronica
       $this->Ln(17);
       $numLinFirma=(int)$this->GetY();
       $this->image_firma(URL.$arrDatos["char_direccion"],$numLinFirma); 
     //Imagen del Sello 
       $this->Image(URL.'app/public/images/selloSolo.jpg',132,$numLinFirma-12,32,40);
       $this->SetFont('Arial','B','14');
       $this->Ln(9);
       $this->MultiCell('170','6',utf8_decode($arrDatos["char_nombre"]),'0','C',false); 
     //***Texto5
       $this->SetFont('Arial','','8');
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_cargo"]),'0','C',false);               
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_resolucion"]),'0','C',false);               
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_gaceta"]),'0','C',false);
       $this->SetFont('Arial','','7');
       $this->MultiCell('170','6',substr($arrDatos["firma"],0,328),'0','L',false); 
       $txt_11 ='Firmado Digitalmente por '.utf8_decode($arrDatos["char_nombre"]).', para verificar la validéz de este permiso puede ingresar a la página Web http://www.sacs.gob.ve, sección "CONSULTAS" y seleccionar "Permisos Estadales".'; 
       $this->MultiCell('170','6',$txt_11,'0','L',false); 
       $numPie =$this->GetY();
       $this->Footer1($numPie);
    }

    //###PERMISO PARA EXPENDIO AMBULANTE DE ALIMENTOS
      function writeAmbulante($arrDatos){
        $fecha=fechaBD();
      //Defino el Formato
        $this->formato(1);
      //Imagen de Cabecera
        $this->Image(URL.'app/public/images/head_reporte.jpg',4,8,202,20);
      //Datos del Permiso
        $this->SetFont('Arial','','12');
           $encab = $arrDatos["contraloria"];
           $tit_1 ='PERMISO SANITARIO PARA EXPENDIO MBULANTE DE ALIMENTOS '.$arrDatos["idTag"];
           $tit_2 = 'PSNº '.$arrDatos["permiso"];
           $this->Ln(20);
           $this->MultiCell('170','6',$encab,'0','C',false);
           $this->MultiCell('170','6',$tit_1,'0','C',false);
           $this->MultiCell('170','6',$tit_2,'0','C',false);
           $this->SetFont('Arial','','12'); 
        //Fecha
           $this->Cell(290,10,'Fecha: '.$arrDatos['fecha'],0,0,'C');
        //$this->Cell(0,10,$arrDatos['nroSol'],0,0,'L');     
      //Establecimiento
          $this->Ln(8);
          $this->MultiCell('170','6','Expendio:','0','J',false);
          $this->MultiCell('170','6',$arrDatos['estab'],'0','J',false);       //Hasta aqui va el formato  
    //Razon Social 
          //$this->MultiCell('170','6','Razón Social:','0','J',false);   
          //$this->MultiCell('170','6',$arrDatos['razon'],'0','J',false);  
    //Representante Legal 
          $this->MultiCell('170','6','Propietario:','0','J',false);   
          $this->MultiCell('170','6',$arrDatos['Prop'],'0','J',false);           
          //$this->MultiCell('170','6','Propietario : '.$arrDatos['propietario'].'-'.$arrDatos['cedprop'],'0','J',false);   
          //$this->MultiCell('170','6',$arrDatos['repre'].'        '.$arrDatos['cedula'],'0','J',false);           
          $this->MultiCell('170','6','Presente.-','0','J',false);
      //Separacion par el texto 
          $this->Ln(3);
      //Texto 1 
         $txt_1 = '     En respuesta a su solicitud Nº '.$arrDatos['nroSol'].' de fecha: '.$arrDatos['fecha'];
         $txt_1.= ' en la cual pide el Permiso Sanitario correspondiente a: '.$arrDatos['uso'];
         $txt_1.= ', ubicado en: '.$arrDatos['direccion'].', municipio: '.$arrDatos['municipio'];
         $txt_1.= ', Parroquia: '.$arrDatos['parroquia'].', para realizar actividades de: '.$arrDatos['descRubro'].', cumplo con informarle que basados en el principio de buena fe ';
         $txt_1.= 'por parte del interesado y de acuerdo a lo establecido en los artículos 83 y 84 de la CONSTITUCIÓN DE LA REPÚBLICA ';
         $txt_1.= 'BOLIVARIANA DE VENEZUELA. Ley Orgánica de Salud, Art. 32-33 del Reglamento General de Alimentos y sus Normas Complementarias, '; 
         $txt_1.= 'el Servicio Autónomo de Contraloría Sanitaria (SACS) considera APROBARLO.';
         $this->MultiCell('170','6',$txt_1,'0','J',false);       
      //Texto 2
        $this->Ln(5);
        $txt_2 ='Este permiso queda sujeto al control y vigilancia posterior por parte del Ministerio ';
        $txt_2.='del Poder Popular para la Salud a través del Servicio Autónomo de Contraloría Sanitaria, ';
        $txt_2.='en todo cuanto se refiere al cumplimiento de las disposiciones sanitarias contenidas en las Normas afines. ';
        $this->MultiCell('170','6',$txt_2,'0','J',false);       
     //Texto 3
        $this->Ln(5);
        $txt_3 = 'En caso de no permitir la inspección correspondiente, suministrar infomación falsa o deterioro de las condiciones higiénicas sanitarias, ';
        $txt_3.= 'así como modificaciones de cualquier tipo, sin previa consulta y aprobación por parte del SACS, posterior a su otorgamiento, nos reservamos el derecho ';
        $txt_3.= 'a ejercer las acciones administrativas y legales pertinentes.';
        $this->MultiCell('170','6',$txt_3,'0','J',false); 
     //Vigencia   
        $txt_4 ='ESTE PERMISO TIENE UNA VIGENCIA DE SEIS(6) MESES'; 
        $this->MultiCell('170','6',$txt_4,'0','J',false); 
     //Texto 4 Firma Electronica
       $this->Ln(17);
       $numLinFirma=(int)$this->GetY();
       $this->image_firma(URL.$arrDatos["char_direccion"],$numLinFirma); 
     //Imagen del Sello 
       $this->Image(URL.'app/public/images/selloSolo.jpg',132,$numLinFirma-12,32,40);
       $this->SetFont('Arial','B','14');
       $this->Ln(9);
       $this->MultiCell('170','6',utf8_decode($arrDatos["char_nombre"]),'0','C',false); 
     //***Texto5
       $this->SetFont('Arial','','8');
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_cargo"]),'0','C',false);               
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_resolucion"]),'0','C',false);               
       $this->MultiCell('170','4',utf8_decode($arrDatos["char_gaceta"]),'0','C',false);
       $this->SetFont('Arial','','7');
       $this->MultiCell('170','6',substr($arrDatos["firma"],0,328),'0','L',false); 
       $txt_11 ='Firmado Digitalmente por '.utf8_decode($arrDatos["char_nombre"]).', para verificar la validéz de este permiso puede ingresar a la página Web http://www.sacs.gob.ve, sección "CONSULTAS" y seleccionar "Permisos Estadales".'; 
       $this->MultiCell('170','6',$txt_11,'0','L',false); 
       $numPie =$this->GetY();
       $this->Footer1($numPie);
    }
    //###FIN###
      function writeActaEst($arrDatos){
        $fecha=fechaBD();
      //Defino el Formato
        $this->formato(1);
      //Imagen de Cabecera
      $this->Image(URL."app/public/images/head_reporte.jpg",0,8,202,20);
      //Datos del Permiso
        $this->SetFont('Arial','','14');
        //$encab = $arrDatos["contraloria"];
        $encab = $arrDatos["contraloria"];
        $tit_1 ='ACTA DE INSPECCION HIGIÉNICO-SANITARIA';
        $tit_2 = 'INSPECCIÓN Nº '.$arrDatos["nro_acta"].' - SOL. Nº. '.$arrDatos['nroSol'];
        $this->Ln(20);
        $this->MultiCell('170','6',$encab,'0','C',false);
        $this->MultiCell('170','6',$tit_1,'0','C',false);
        $this->MultiCell('170','6',$tit_2,'0','C',false);
        $this->SetFont('Arial','','9'); 
      //Separacion par el texto 
        $this->Ln(6);
      //Texto 1 
         switch ($arrDatos['area']) {
            case 1:
              $txt_1 = '  En la Ciudad de:_____________, a los____ días, del mes de__________, de _____, ';
              $txt_1.= 'siguiendo instrucciones del Servicio Autónomo de Contraloría Sanitaria, se presentaron ';
              $txt_1.= 'los siguientes funcionarios quienes suscriben la siguiente acta:';  
            break;
            case 2:
              $txt_1 = '  En la Ciudad de_____________, a los__________(   ) días del mes de__________del año__________, ';
              $txt_1.= 'siguiendo instrucciones del Servicio Autónomo de Contraloría Sanitaria, bajo la autorización N°__________de fecha__________, ';
              $txt_1.= 'se presentaron los siguientes funcionarios quienes suscriben la siguiente acta:';            
            break;
         }
         $this->MultiCell('170','6',$txt_1,'0','J',false);       
         $this->Ln(5);
      //Cuadro para funcionarios 
         switch ($arrDatos['area']) {
           case 1:
            $this->MultiCell('170',6,'DATOS DE LOS FUNCIONARIOS',1,'C',false); 
            $this->SetWidths(array(60,70,40));
            $this->SetAligns(array('C','C','C'));
            $this->Row(array('NOMBRE','CARGO','CEDULA'));
            for($i=0;$i<4;$i++){
             $this->Row(array('','',''));      
            }
           break;
           case 2:
            $this->MultiCell('170',6,'DATOS DE LOS FUNCIONARIOS',1,'C',false); 
            $this->SetWidths(array(40,60,70));
            $this->SetAligns(array('C','C','C'));
            $this->Row(array('NOMBRE','CEDULA DE IDENTIDAD','DIRECCIÓN ADMINISTRATIVA'));
            for($i=0;$i<5;$i++){
             $this->Row(array('','',''));      
            }
           break;
         }
      //Cuadro con los Datos del Establecimiento
      switch ($arrDatos['area']) {
        case 1:
        $this->Ln(5);
        $txt_2.= 'Al establecimiento identificado con los siguientes datos:';
        $this->MultiCell('170','6',$txt_2,'0','J',false);         
        $this->Ln(3);
        $this->MultiCell('170',6,'DATOS DEL ESTABLECIMIENTO',1,'C',false); 
        $this->SetWidths(array(40,130));
        $this->SetAligns(array('L','L')); 
        $this->Row(array('Razón Social:',$arrDatos['estab'])); 
        $this->Row(array('Rif:',$arrDatos['rif'])); 
        $this->Row(array('Ubicación:',$arrDatos['direccion'])); 
        $this->Row(array('Estado:',$arrDatos['estado'])); 
        $this->Row(array('Municipio:',$arrDatos['municipio'])); 
        $this->Row(array('Parroquia:',$arrDatos['parroquia'])); 
        $this->Row(array('Teléfono:',$arrDatos['telefono'])); 
        $this->Row(array('Nro Oficio:',$arrDatos['nro_oficio'])); 
        $this->Row(array('Fecha:',$arrDatos['fechaOfic'])); 
        $this->Row(array('Permiso Sanitario:',$arrDatos['permiso'])); 
        //Datos de la persona que recibe a los insp.
        $txt_3 = "Fuímos atendidos por el ciudadano(a):_________________________________, ";
        $txt_3.= "portador de la cédula de identidad Nº________________, que ocupa el cargo ";
        $txt_3.= "de:_____________________, con el objeto de realizar Inpsección Higiénico-Sanitaria ";
        $txt_3.= "al establecimiento anteriormente identificado a modo de constatar el cumplimiento "; 
        $txt_3.= "de la Normativa Sanitaria Vigente, por lo que se procede a revisar la existencia de ";
        $txt_3.= "los siguientes documentos:";
        $this->Ln(3);
        $this->MultiCell('170','6',$txt_3,'0','J',false);         
        $this->Ln(3);
        //Documentos
        
        $this->SetWidths(array(140,15,15));
        $this->SetAligns(array('C','C','C')); 
        $this->Row(array('DESCRIPCIÓN:','SI','NO'));    
        $this->SetAligns(array('L','C','C'));
        $this->Row(array('Registro Mercantil','',''));    
        $this->Row(array('Registro de Información Fiscal Nº','',''));    
        $this->Row(array('Acta de Asamblea Extranordinaria reciente(si fuese el caso)','',''));    
        $this->Row(array('Patente de Industria y Comercio','',''));    
        $this->Row(array('Nomina del Personal activo que labora en la empresa (debidamente sellada), Cantidad de personas:','',''));    
        // $txt_2 ='Este permiso queda sujeto al control y vigilancia posterior por parte del Ministerio ';
        // $txt_2.='del Poder Popular para la Salud a través del Servicio Autónomo de Contraloría Sanitaria, ';
        // $txt_2.='en todo cuanto se refiere al cumplimiento de las disposiciones sanitarias contenidas en las Normas afines. ';
        // $this->MultiCell('170','6',$txt_2,'0','J',false);       
        //Texto 3
        // $this->Ln(5);
        // $txt_3 = 'En caso de no permitir la inspección correspondiente, suministrar infomación falsa o deterioro de las condiciones higiénicas sanitarias, ';
        // $txt_3.= 'así como modificaciones de cualquier tipo, sin previa consulta y aprobación por parte del SACS, posterior a su otorgamiento, nos reservamos el derecho ';
        // $txt_3.= 'a ejercer las acciones administrativas y legales pertinentes.';
        // $this->MultiCell('170','6',$txt_3,'0','J',false); 
        //Texto 4
        break;
        case 2:
        $this->Ln(5);
        $txt_2.= 'Al establecimiento identificado con los siguientes datos:';
        $this->MultiCell('170','6',$txt_2,'0','J',false);         
        $this->Ln(3);
        $this->MultiCell('170',6,'DATOS DEL ESTABLECIMIENTO',1,'C',false); 
        $this->SetWidths(array(100,70));
        $this->SetAligns(array('',''));
        $this->Row(array('RAZÓN SOCIAL DEL ESTABLECIMIENTO:','N° DE RIF:'));
        $this->Row(array($arrDatos['estab'],$arrDatos['rif'])); 
        $this->SetWidths(array(40,60,70));
        $this->SetAligns(array('','',''));
        $this->Row(array('ESTADO:','MUNICIPIO:','PARROQUIA:'));
        $this->Row(array($arrDatos['estado'],$arrDatos['municipio'],$arrDatos['parroquia']));
        $this->SetWidths(array(100,70));
        $this->SetAligns(array('',''));
        $this->Row(array('UBICACIÓN:','CIUDAD:'));
        $this->Row(array($arrDatos['direccion'],$arrDatos['ciudad']));
        $this->SetWidths(array(50,50,70));
        $this->SetAligns(array('','',''));
        $this->Row(array('SECTOR:','TENENCIA LOCAL:','TELÉFONOS:'));
        $this->Row(array($arrDatos['sector'],$arrDatos['tenencia'],$arrDatos['telefono'].' '.$arrDatos['telefono2']));
        $this->SetWidths(array(170));
        $this->SetAligns(array(''));
        $this->Row(array('PERMISO SANITARIO:'));
        $this->Row(array($arrDatos['permiso']));
        $this->MultiCell('170',6,'CLASIFICACIÓN DEL ESTABLECIMIENTO SEGÚN LA SOLICITUD',1,'C',false); 
        $this->SetWidths(array(85,85));
        $this->SetAligns(array('',''));
        $this->Row(array($arrDatos['tipoSol'],$arrDatos['uso']));
        $this->Ln(5);
        $this->MultiCell('170',6,'DATOS DEL DIRECTOR MÉDICO',1,'C',false);
        $this->SetWidths(array(60,60,50));
        $this->SetAligns(array('','',''));
        $this->Row(array('APELLIDO(S):','NOMBRE(S):','CEDULA DE IDENTIDAD:'));
        $this->Row(array('','',''));
        $this->SetWidths(array(50,70,50));
        $this->SetAligns(array('','',''));
        $this->Row(array('MATRICULA DEL M.S.:','PROFESIÓN:','TELÉFONOS:'));
        $this->Row(array('','',''));
        $this->Ln(5);
        $this->MultiCell('170',6,'DATOS DEL PROPIETARIO',1,'C',false);
        $this->SetWidths(array(80,40,50));
        $this->SetAligns(array('','',''));
        $this->Row(array('APELLIDO(S)/NOMBRE(S):','CARGO:','CEDULA DE IDENTIDAD:'));
        $this->Row(array($arrDatos['propietario'],'',$arrDatos['cedulaprop']));

        break;
      }   
        

   }

   function writeEstabEsp($arrDatos){
      //Defino el Formato
        $this->formato(1);
      //Imagen de Cabecera
        $this->Image(URL."app/public/images/head_reporte.jpg",4,8,202,20);
      //Datos del Permiso
        $this->SetFont('Arial','','14');
        //$encab = $arrDatos["contraloria"];
        $encab = $arrDatos["contraloria"]; 
        $tit_1 ='ACTA DE INSPECCION HIGIÉNICO-SANITARIA';
        $tit_2 = 'INSPECCIÓN Nº '.$arrDatos["nro_acta"].' - SOL. Nº. '.$arrDatos['nroSol'];
        $this->Ln(20);
        $this->MultiCell('170','6',$encab,'0','C',false);
        $this->MultiCell('170','6',$tit_1,'0','C',false);
        $this->MultiCell('170','6',$tit_2,'0','C',false);
        $this->SetFont('Arial','','9'); 
      //Separacion par el texto 
        switch ($arrDatos['area']) {
          case 1:
            $this->Ln(6);
            //Documentos Area de Alimentos
            $this->MultiCell('170',6,'PARA EL ÁREA DE ALIMENTOS',1,'C',false); 
            $this->SetWidths(array(140,15,15));
            $this->SetAligns(array('C','C','C')); 
            $this->Row(array('DESCRIPCIÓN:','SI','NO'));    
            $this->SetAligns(array('L','C','C'));
            $this->Row(array('Permisos Sanitario de Establecimiento de Alimentos','',''));    
            $this->Row(array('Certificados del Curso de Manipulación de Alimentos del Personal que labora en la empresa. Requerido:         , Presentado:         , Faltante:       ','',''));    
            $this->Row(array('Registro de Control de Plagas, Insectos y Roedores y Certificado de última fumigación.','',''));
          break;
          case 2:
            //CASO DATOS ESPECIFICOS DE INSPECCION DE ESTABLECIMIENTOS DE SALUD
          break;
        }    
      //Observaciones
        $this->Ln(6);
        $txt_1 = "Observaciones:__________________________________________________________________________________";
        $this->MultiCell('170','6',$txt_1,'0','C',false);
        switch ($arrDatos['area']) {
          case 1:
            for($i = 0;$i<16;$i++){
             $this->MultiCell('170','6','_______________________________________________________________________________________________','0','C',false);
            }
          break;
          case 2:
            for($i = 0;$i<18;$i++){
             $this->MultiCell('170','6','_______________________________________________________________________________________________','0','C',false);
            }
          break;
        }

       //Firma Funcionarios y Administrados 
        $this->Ln(6);
        switch ($arrDatos['area']) {
          case 1:
            $this->SetWidths(array(99,30,40));
            $this->SetAligns(array('C','C','C')); 
            $this->Row(array('Funcionarios del SACS-MPPS','Cédula','Firma'));    
            for($i=0;$i<4;$i++){
             $this->Row(array('','',''));      
            }
            $this->SetAligns(array('C','C','C')); 
            $this->Row(array('Representante(s) del Establecimiento','Cédula','Firma'));    
            for($i=0;$i<4;$i++){
             $this->Row(array('','',''));      
            }
          break;
          case 2:
            $this->SetWidths(array(100,30,40));
            $this->SetAligns(array('C','C','C')); 
            $this->Row(array('FUNCIONARIO(S) DEL SACS-MPPS','C.I.','FIRMA'));    
            for($i=0;$i<5;$i++){
             $this->Row(array('','',''));      
            }
            $this->SetAligns(array('C','C','C')); 
            $this->Row(array('TESTIGO(S)','C.I.','FIRMA'));    
            for($i=0;$i<3;$i++){
             $this->Row(array('','',''));      
            }
            $this->SetAligns(array('C','C','C')); 
            $this->Row(array('REPRESENTANTE(S) DEL ESTABLECIMIENTO','C.I.','FIRMA'));    
            for($i=0;$i<5;$i++){
             $this->Row(array('','',''));      
            }
          break;
        }

     }
    

    function writeConforme($arrDatos){
      //Defino el Formato
        $this->formato(1);
      //Imagen de Cabecera
        $this->Image(URL."app/public/images/head_reporte.jpg",4,8,202,20);
      //Datos del Permiso
        $this->SetFont('Arial','','14');
        //$encab = $arrDatos["contraloria"];
        $encab = $arrDatos["contraloria"]; 
        $tit_1 ='ACTA DE INSPECCION HIGIÉNICO-SANITARIA';
        $tit_2 = 'INSPECCIÓN Nº '.$arrDatos["nro_acta"].' - SOL. Nº. '.$arrDatos['nroSol'];
        $this->Ln(20);
        $this->MultiCell('170','6',$encab,'0','C',false);
        $this->MultiCell('170','6',$tit_1,'0','C',false);
        $this->MultiCell('170','6',$tit_2,'0','C',false);
        $this->SetFont('Arial','','9'); 
        switch ($arrDatos['area']) {
          case 1:
          //Separacion par el texto 
          $this->Ln(6);
          $txt_1 = "Observaciones:__________________________________________________________________________________";
          $this->MultiCell('170','6',$txt_1,'0','C',false);
          for($i = 0;$i<19;$i++){
           $this->MultiCell('170','6','_______________________________________________________________________________________________','0','C',false);
          }
          //Cuadro Firma Inspetores
          $this->Ln(6);
          $this->SetWidths(array(99,30,40));
          $this->SetAligns(array('C','C','C')); 
          $this->Row(array('Funcionarios del SACS-MPPS','Cédula','Firma'));    
          for($i=0;$i<8;$i++){
            $this->Row(array('','',''));      
          }
          $this->SetAligns(array('C','C','C'));
          if($arrDatos["tipoSol"] == 5 || $arrDatos["tipoSol"] == 19 ){
           $this->Row(array('Propietario/Rep. Legal del Vehículo','Cédula','Firma'));       
          }else{
           $this->Row(array('Representante(s) del Establecimiento','Cédula','Firma'));    
          } 
           
          for($i=0;$i<5;$i++){
            $this->Row(array('','',''));      
          }
          break;
          case 2:
          //Separacion par el texto 
          $this->Ln(6);
          $txt_1 = "Observaciones:__________________________________________________________________________________";
          $this->MultiCell('170','6',$txt_1,'0','C',false);
          for($i = 0;$i<28;$i++){
           $this->MultiCell('170','6','_______________________________________________________________________________________________','0','C',false);
          }  
          break;
        }
      
    } // Fin Metodo

   //Emision del Acta de Inpseccion
    function writeActaVeh($arrDatos){
        $fecha=fechaBD();
      //Defino el Formato
        $this->formato(1);
      //Imagen de Cabecera
        $this->Image(URL."app/public/images/head_reporte.jpg",0,8,202,20);
      //Datos del Permiso
        $this->SetFont('Arial','','14');
        //$encab = $arrDatos["contraloria"];
        $encab = $arrDatos["contraloria"]; 
        $tit_1 ='ACTA DE INSPECCION HIGIÉNICO-SANITARIA';
        $tit_2 = 'INSPECCIÓN Nº '.$arrDatos["nro_acta"].' - SOL. Nº. '.$arrDatos['nroSol'];
        $this->Ln(20);
        $this->MultiCell('170','6',$encab,'0','C',false);
        $this->MultiCell('170','6',$tit_1,'0','C',false);
        $this->MultiCell('170','6',$tit_2,'0','C',false);
        $this->SetFont('Arial','','9'); 
      //Separacion par el texto 
        $this->Ln(6);
      //Texto 1 
         $txt_1 = '  En la Ciudad de:_____________, a los____ días, del mes de__________, de _____, ';
         $txt_1.= 'siguiendo instrucciones del Servicio Autónomo de Contraloría Sanitaria, se presentaron ';
         $txt_1.= 'los siguientes funcionarios quierens suscribenla siguiente acta:';
         $this->MultiCell('170','6',$txt_1,'0','J',false);       
         $this->Ln(5);
      //Cuadro para funcionarios 
         $this->MultiCell('170',6,'DATOS DE LOS FUNCIONARIOS',1,'C',false); 
         $this->SetWidths(array(60,70,40));
         $this->SetAligns(array('C','C','C'));
         $this->Row(array('NOMBRE','CARGO','CEDULA'));
         for($i=0;$i<8;$i++){
            $this->Row(array('','',''));      
         }
      //Cuadro con los Datos del Establecimiento
        $this->Ln(5);
        $txt_2.= 'Al vehículo identificado con los siguientes datos:';
        $this->MultiCell('170','6',$txt_2,'0','J',false);         
        $this->Ln(3);
        $this->MultiCell('170',6,'DATOS DEL VEHÍCULO',1,'C',false); 
        $this->SetWidths(array(40,130));
        $this->SetAligns(array('L','L'));
        $this->Row(array('Estado:',$arrDatos['estado'])); 
        $this->Row(array('Municipio:',$arrDatos['municipio'])); 
        $this->Row(array('Parroquia:',$arrDatos['parroquia'])); 
        $this->Row(array('Placa:',$arrDatos['placa'])); 
        $this->Row(array('Modelo:',$arrDatos['modelo'])); 
        $this->Row(array('Capacidad:',$arrDatos['capacidad'])); 
        $this->Row(array('Serial de Motor:',$arrDatos['motor'])); 
        $this->Row(array('Serial Carrocería:',$arrDatos['carroceria'])); 
        $this->Row(array('Sistema de Enfriamiento:',$arrDatos['enfria'])); 
        $this->Row(array('Descripción Sist.:',$arrDatos['enfria_des'])); 
        $this->Row(array('Rubro:',$arrDatos['rubro']));
        $this->Row(array('Teléfono Contacto:',$arrDatos['telefono'])); 
      //Datos de la persona que recibe a los insp.
        $txt_3 = "Fuímos atendidos por el ciudadano(a):_________________________________, ";
        $txt_3.= "portador de la cédula de identidad Nº________________, que ocupa el cargo ";
        $txt_3.= "de:_____________________, con el objeto de realizar Inpsección Higiénico-Sanitaria ";
        $txt_3.= "al Vehículo anteriormente identificado a modo de constatar el cumplimiento "; 
        $txt_3.= "de la Normativa Sanitaria Vigente, por lo que se procede a revisar la existencia de ";
        $txt_3.= "los siguientes documentos:";
        $this->Ln(3);
        $this->MultiCell('170','6',$txt_3,'0','J',false);         
        $this->Ln(3);
      //Documentos
        
        $this->SetWidths(array(140,15,15));
        $this->SetAligns(array('C','C','C')); 
        $this->Row(array('DESCRIPCIÓN:','SI','NO'));    
        $this->SetAligns(array('L','C','C'));
        $this->Row(array('Titulo de Propiedad','',''));    
      
     }  

   
}//Fin de la Clase PDF
?>