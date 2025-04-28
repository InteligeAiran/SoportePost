<?php
  class gTrabajoRules extends Rules{
    public static $admin     = "usuario_admin";
    public static $tramite   = "usuario_tramite";
    public static $solicitud = "usuario_solicitud";

    public function __contruct(){
          parent::__construct();
    }

    public function gTrabajoRules(){
      $this->idTram  = "";
      $this->id_user = "";

      $this->rif     = "";
      $this->area    = "";

      $this->tipSol  = "";
      $this->tipCat  = "";

      $this->created_at   = "NOW()";
    }

    //CONSULTAS////////////////////////////////////////////////////////

    public function autoByIDUser(){
      $db  = Database::getInstance();

      $sql =  "SELECT * FROM ".self::$tramite." 
              WHERE id_usuario = ".$this->id_user."
              AND id_status = 1";
        
      $query   = $db->pgquery($sql);            
      $numRows = $db->pgNumrows($query);
      if($numRows > 0){
        $IDs = "";
        for($i=0;$i<$numRows;++$i){
         $row = pg_fetch_array($query,$i);
         if ($i == 0) {
            $IDs.="".$row["id_usuario_tramite"];
         }else{
            $IDs.=",".$row["id_usuario_tramite"];
         }
        }
        return $IDs;
      }
    }

    public function autoByIDUserRif(){
      $db  = Database::getInstance();

      $sql =  "SELECT * FROM ".self::$tramite." 
              WHERE id_usuario = ".$this->id_user."
              AND id_area = ".$this->area."
              AND ident_rif = '".$this->rif."'
              AND id_status = 1";
      
      $query   = $db->pgquery($sql);            
      $numRows = $db->pgNumrows($query);
      if($numRows > 0){
         $row = $db->pgfetch($query);
         $ID  =$row["id_usuario_tramite"];
         return $ID;
      }
    }

    public function planByIDTram(){
      $db  = Database::getInstance();
      
      $sql = "SELECT * FROM ".self::$solicitud." 
              WHERE id_usuario_tramite IN( ".$this->idTram." )
              AND id_tipo_solicitud = ".$this->tipSol."
              AND id_categoria_solicitud =".$this->tipCat."
              AND id_status = 1;";
      
      $query   = $db->pgquery($sql);            
      $numRows = $db->pgNumrows($query);
      if($numRows > 0){
        return true;
      }
    }

    public function autoByNroReg($val){
      $db  = Database::getInstance();

      $sql = "SELECT * FROM 
                ".self::$solicitud." s, ".self::$tramite." t 
               WHERE s.id_usuario_tramite = t.id_usuario_tramite 
               AND t.id_usuario = ".$this->id_user."
                AND s.id_categoria_solicitud = ".$this->tipCat."
                  AND s.id_tipo_solicitud = ".$this->tipSol."
                    AND s.id_status = 1; ";

      $query   = $db->pgquery($sql);
      $row     = $db->pgfetch($query);
      $numRows = $db->pgNumrows($query);
      switch ($val) {
        case 'row':
          return $row;
        break;
        case 'numRows':
          return $numRows;
        break;
        case 'query':
          return $query;
        break;
      }
    }

    public function autoByTitular(){
      $db      = Database::getInstance();
      $sql     = "SELECT * FROM ".self::$tramite." 
                    WHERE id_usuario = ".$this->id_user." 
                    AND id_area IN(".$this->area.") 
                    AND ident_rif = '".$this->rif."' 
                    AND id_status = 1;";

      $query   = $db->pgquery($sql);              
      $numRows = $db->pgNumrows($query);
      if ($numRows > 0) {
        return true;
      }else{
        return false;
      }
    }

    public function autoByTramSol(){
      $db      = Database::getInstance();
      $sql     = "SELECT * FROM 
                  ".self::$tramite." t, ".self::$solicitud." s
                    WHERE t.id_usuario = ".$this->id_user." 
                    AND t.id_area IN(".$this->area.") 
                    AND t.ident_rif = '".$this->rif."' 
                    AND t.id_status = 1
                    AND t.id_usuario_tramite = s.id_usuario_tramite
                    AND s.id_tipo_solicitud  = ".$this->tipSol."
                    AND s.id_categoria_solicitud = ".$this->tipCat."
                    AND s.id_status = 1
                    ;";
       
      $query   = $db->pgquery($sql);              
      $numRows = $db->pgNumrows($query);
      if ($numRows > 0) {
        return true;
      }else{
        return false;
      }
    }

    //END CONSULTAS/////////////////////////////////////////////////////


} //Fin regla de negocio

?>