<?php
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