
<?php
  class Rules{
  	
  	function __construct(){
  	}

  	public static function exists($rulesname){
		$fullpath = self::getFullpath($rulesname);
		$found    = false;
		$existe   = 'no existe';
		if(file_exists($fullpath)){
			include $fullpath;
		}
	}

	public static function getFullpath($rulesname){
		return ROOT."app/plugins/utility/funciones/regla_negocio/".$rulesname."Rules.php";
	}

  }
?>
