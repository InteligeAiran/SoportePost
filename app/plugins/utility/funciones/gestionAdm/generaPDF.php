<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
 //incluyo la Libreria FPDF
 require (URL.'app/plugins/fpdf16/fpdf.php');
 require (URL.'app/plugins/utility/pdfClass.php');
 //Creo La Clase

/*
  Script para Gestionar la emision de los archivos pdf
  permisos y Actas de Inspeccion 
*/

  //Capturo las Variables 
    extract($_REQUEST);
    $strSol  = $_REQUEST['arrPermiso'];
    $tRepAct = $_REQUEST['tRepAct'];
  //Creo arreglo de Datos 
    $arrDat =array('saludo'=>'Hola Mundo');    

  //Instancio la Clase PDF
    $pdf = new PDF('P','mm','A4');
    $pdf->SetFont('Arial','',11);
    $pdf->SetAutoPageBreak(false,20);   
    $pdf->AddPage();
    $pdf->writePermiso($arrDat);
  //Muestro el PDF
    $pdf->Output(); 
 ?>
