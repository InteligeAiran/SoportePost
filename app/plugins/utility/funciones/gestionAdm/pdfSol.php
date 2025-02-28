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
    $this->Image($urlFirma,90,$numLinFirma-17,27,32);
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
	 if($this->nTipo == 1){
	    $this->tamHoja = 'Letter';
		$this->orientado = 'P';
		$this->mm = 'mm';
		$this->FPDF($this->orientado,$this->mm,$this->tamHoja);
		$this->setMargins(3,3,3);
	 }
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
      $txt_15 ='Servicio Autónomo de Contraloría Sanitaria - Dirección de Higiene de los Alimentos';
      $txt_16 ='Teléfono 4080477 Telefax 4080505 Página web: http://sacs.mpps.gob.ve'; 
      $this->SetFont('Arial','','6');
      $this->MultiCell('170','4',$txt_14,'0','C',false);              
      $this->SetFont('Arial','','6');
      $this->MultiCell('170','4',$txt_15,'0','C',false);
      $this->SetFont('Arial','','6');               
      $this->MultiCell('170','4',$txt_16,'0','C',false);
     }
   //Emisión de Permisos   
   function writeSol($arrDatos){
        $fecha=fechaBD();
      //Defino el Formato
   	    $this->formato(1);
      //Imagen de Cabecera
	      $this->Image(URL.'app/public/images/head_reporte.jpg',4,8,202,20);
      //Datos del Permiso
        $this->SetFont('Arial','','12');
           $encab =	$arrDatos["contraloria"];
           $tit_1 ='PERMISO SANITARIO DE FUNCIONAMIENTO PARA ESTABLECIMIENTOS '.$arrDatos["idTag"];
           //$tit_2 = 'PSNº '.$arrDatos["permiso"];
           $this->Ln(20);
           $this->MultiCell('170','6',$encab,'0','C',false);
           $this->MultiCell('170','6',$tit_1,'0','C',false);
        //Datos de la Solicitud 
          $this->Ln(5);
          $this->MultiCell('170',6,'DATOS DE LA SOLICITUD ',1,'C',false); 
          $this->SetWidths(array(40,130));
          $this->SetAligns(array('L','L'));
          $this->Row(array('Fecha de Solicitud:',$arrDatos['fecha'])); 
          $this->Row(array('Nro Solicitud:',$arrDatos['nroSol'])); 
          $this->Row(array('Tipo de Trámite:',$arrDatos['idTag'])); 
          $this->Row(array('Área:',$arrDatos['area'])); 
          $this->Row(array('Tipo de Solicitud:',$arrDatos['tipoSol'])); 
          $this->Row(array('Categoría:',$arrDatos['categoria'])); 
          $this->Row(array('Nro. Permiso:',$arrDatos['permiso'])); 
    }

     function writeEstab($arrDatos){
      //Datos del Establecimiento 
          //$this->Ln(8); 
          $this->MultiCell('170',6,'DATOS DEL ESTABLECIMIENTO',1,'C',false); 
          $this->SetWidths(array(40,130));
          $this->SetAligns(array('L','L'));
          $this->Row(array('Establecimiento:',$arrDatos['estab'])); 
          $this->Row(array('Rif:',$arrDatos['rif'])); 
          $this->Row(array('Estado:',$arrDatos['estado'])); 
          $this->Row(array('Municipio:',$arrDatos['municipio'])); 
          $this->Row(array('Parroquia:',$arrDatos['parroquia'])); 
          $this->Row(array('Ubicación:',$arrDatos['direccion'])); 
          $this->Row(array('Punto Referencia:',$arrDatos['puntoRef'])); 
          $this->Row(array('Teléfono Principal:',$arrDatos['telefono1'])); 
          $this->Row(array('Teléfono Secundario:',$arrDatos['telefono2'])); 
          $this->Row(array('Rubro(s):',$arrDatos['rubro'])); 
           $this->Row(array('Desc. Rubro(s):',$arrDatos['descrubro'])); 
     } 

    function writeProp($arrDatos){
      //Datos del Establecimiento 
          //$this->Ln(8); 
          $this->MultiCell('170',6,'DATOS DEL PROPIETARIO',1,'C',false); 
          $this->SetWidths(array(40,130));
          $this->SetAligns(array('L','L'));
          $valNac = $arrDatos["valNac"];
          if($valNac == 1 || $valNac == 2){
            $this->Row(array('Nacionalidad:',$arrDatos['nacional'])); 
            $this->Row(array('Cédula:',$arrDatos['cedula'])); 
            $this->Row(array('Nombre(s):',$arrDatos['nombres'])); 
            $this->Row(array('Apellido(s):',$arrDatos['apellidos'])); 
            $this->Row(array('Teléfono Principal:',$arrDatos['tel_fijo'])); 
            $this->Row(array('Correo Electrónico:',$arrDatos['correo']));
          }else{
            $this->Row(array('Rif:',$arrDatos['cedula'])); 
            $this->Row(array('Razón Social:',$arrDatos['nombres'])); 
            $this->Row(array('Teléfono Principal:',$arrDatos['tel_fijo'])); 
            $this->Row(array('Correo Electrónico:',$arrDatos['correo']));
          } 
     }     

   //Emision del Acta de Inpseccion
    function writeVehiculo($arrDatos){
        //Datos del Vehiculo 
          $this->Image(URL.'app/public/images/head_reporte.jpg',4,8,202,20);
          $this->MultiCell('170',6,'DATOS DEL VEHÍCULO',1,'C',false); 
          $this->SetWidths(array(40,130));
          $this->SetAligns(array('L','L'));
          $this->Row(array('Estado:',$arrDatos['estado'])); 
          $this->Row(array('Municipio:',$arrDatos['municipio'])); 
          $this->Row(array('Parroquia:',$arrDatos['parroquia'])); 
          $this->Row(array('Placa:',$arrDatos['placa'])); 
          $this->Row(array('Tipo:',$arrDatos['tipoV']));
          $this->Row(array('Marca:',$arrDatos['marcaV']));
          $this->Row(array('Modelo:',$arrDatos['modelo'])); 
          $this->Row(array('Capacidad:',$arrDatos['capacidad'])); 
          $this->Row(array('Serial de Motor:',$arrDatos['motor'])); 
          $this->Row(array('Serial Carrocería:',$arrDatos['carroceria'])); 
          $this->Row(array('Sistema de Enfriamiento:',$arrDatos['sistema'])); 
          $this->Row(array('Descripción Sist.:',$arrDatos['descEnfria'])); 
          $this->Row(array('Rubro(s):',$arrDatos['rubro'])); 
     }  

   
}//Fin de la Clase PDF
?>