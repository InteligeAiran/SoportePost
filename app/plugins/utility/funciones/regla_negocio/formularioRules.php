<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
  class formularioRules extends Rules{

    public function __contruct(){
          parent::__construct();
    }

    public function formularioRules(){
      $this->created_at   = "NOW()";
    }

    //CONSULTAS////////////////////////////////////////////////////////

    public function comilla($val){
      if (strpos($val, "'") !== false) {
          $defval = str_replace("'", "''",$val);
          return $defval; 
      }else{
          return $val; 
      }   
    }
    
} //Fin regla de negocio

?>