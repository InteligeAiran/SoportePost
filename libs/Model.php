
<?php
  class Model{
	protected $db;

  	function __construct(){
		include_once 'database.php';
  		$this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database);

  	}

  	public static function exists($modelname){

		$fullpath = self::getFullpath($modelname);
		
		$found=false;
		$existe = 'no existe';
		if(file_exists($fullpath)){
			include $fullpath;
		}
	}

	public static function getFullpath($modelname){
		return ROOT."app/models/".$modelname."Model.php";
	}

	//incluye modelos de los nuevos modulos
  	public static function existsModels($modelname){
		$fullpath = self::getFullpathModels($modelname);

		$found=false;
		$existe = 'no existe';
		if(file_exists($fullpath)){
			include $fullpath;
		}
	}

	public static function getFullpathModels($modelname){
		return ROOT."app/views/".$modelname."Model.php";
	}

	//Metodo para Las Consultas en BD

    function getResult($sql,$db){

         //Ejecuta la Consulta
           $query = $db->pgquery($sql);
         //Crea el Arreglo 
           $array  = array('query'=>$query,
                           'row'=>$db->pgfetch($query),
                           'numRows'=>$db->pgNumrows($query)
                     );

      return $array;
	}

  }//endClass

  
  function arraytostringpgsql($array){

    $texto = "'{".implode(",", $array)."}'";

    return $texto;
}
?>
