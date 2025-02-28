<?php
   class DatabaseCon {
    //Datos de Conexion
      private $bd_hostname;
      private $mvc_port;
      private $bd_usuario;
      private $bd_clave;
      private $database;
      private $conexion;
      private $pgquery;
      private $fetch;
      private static $instancia;
    //Constructor
      private function __construct($bd_hostname,$mvc_port,$bd_usuario,$bd_clave,$database ){
        //Defino las Variables de Conexion a la bd
          $this->bd_hostname       = $bd_hostname; 
          //Servidor
          $this->mvc_port          = $mvc_port;             //Puerto de Conexion
          $this->bd_usuario        = $bd_usuario;          //Usuario para establecer la conexion
          $this->bd_clave          = $bd_clave;        //Clave de acceso a la BD
          $this->database          = $database;

        //Se establece la conexion con con la base de datos desde
          $this->connect();
          //var_dump( $this->connect());
      }
          //var_dump( $this->connect());
      
      private function __clone(){}

      public static function getInstance($bd_hostname, $mvc_port, $bd_usuario, $bd_clave, $database) { // Recibe los parámetros
          if (!(self::$instancia instanceof self)) {
              self::$instancia = new self($bd_hostname, $mvc_port, $bd_usuario, $bd_clave, $database); // Pasa los parámetros al constructor
          }
          return self::$instancia;
      }

        function connect(){

        $this->conexion = @pg_pconnect("host=".$this->bd_hostname." port=".$this->mvc_port." dbname=".$this->database." user=".$this->bd_usuario." password=".$this->bd_clave);

          if(!$this->conexion){
             die("No Se Pudo Establecer la Conexion");
          }

       }

        public function pgquery($sql){
        $this->pgquery =@pg_query($this->conexion,$sql);

        if(!$this->pgquery){
          return false;
        } else{
          return $this->pgquery;
        }

      }

      public function pgfetch($query){

         $this->fetch = @pg_fetch_array($query);
         $numrows     = @pg_num_rows($query);
         if($numrows > 0){
            return $this->fetch;
         }else{
            return false;
         }

      }

      public function pgNumrows($query)
      {
        $numrows     = @pg_num_rows($query);
        return $numrows;
      }
  }
?>
