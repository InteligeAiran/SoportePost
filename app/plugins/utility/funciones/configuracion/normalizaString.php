<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */

   function iteraString($arr){

    $varData = [];

    foreach ($arr as $key => $value) {

      $mayus = mb_strtoupper($value, 'UTF-8');
      $ntilde = str_replace('Ñ', "&Ntilde;", $mayus);
      $a = str_replace('Á', "&Aacute;", $ntilde);
      $e = str_replace('É', "&Eacute;", $a);
      $i = str_replace('Í', "&Iacute;", $e);
      $o = str_replace('Ó', "&Oacute;", $i);
      $u = str_replace('Ú', "&Uacute;", $o);
      $comillaDoble  = str_replace('"', "&quot;", $u);
      $comillaSimple = str_replace("'", "&#39;", $comillaDoble);
      $varData[$key] = $comillaSimple;

    }//endForeach

    return $varData;

  }

  function stringToJson($var){

    //verificamos si sea un arreglo
    if (is_array($var)) {
      
      $varData = [];

      foreach ($var as $key => $value) {

        //comorremos un arreglo de 2 dimensiones
        if (is_array($value)) {
          $comillaSimple = iteraString($value);
        }else{
          $mayus = mb_strtoupper($value, 'UTF-8');
          $ntilde = str_replace('Ñ', "&Ntilde;", $mayus);
          $a = str_replace('Á', "&Aacute;", $ntilde);
          $e = str_replace('É', "&Eacute;", $a);
          $i = str_replace('Í', "&Iacute;", $e);
          $o = str_replace('Ó', "&Oacute;", $i);
          $u = str_replace('Ú', "&Uacute;", $o);
          $comillaDoble  = str_replace('"', "&quot;", $u);
          $comillaSimple = str_replace("'", "&#39;", $comillaDoble);
        }

          $varData[$key] = $comillaSimple;

      }//endForeach

    }else{//sino es un arreglo
      $mayus = mb_strtoupper($var, 'UTF-8');
      $ntilde = str_replace('Ñ', "&Ntilde;", $mayus);
      $a = str_replace('Á', "&Aacute;", $ntilde);
      $e = str_replace('É', "&Eacute;", $a);
      $i = str_replace('Í', "&Iacute;", $e);
      $o = str_replace('Ó', "&Oacute;", $i);
      $u = str_replace('Ú', "&Uacute;", $o);
      $comillaDoble  = str_replace('"', "&quot;", $u);
      $comillaSimple = str_replace("'", "&#39;", $comillaDoble);
      $varData = $comillaSimple;
    }

    $json=json_encode($varData,JSON_UNESCAPED_SLASHES);

      return $varData;

  }//