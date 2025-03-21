
<?php

   //Vista del Controlador
   class View {
      function __construct(){
      	//Constructor de view
      }
      public function render($name,$noInclude = false){

      	if($noInclude == true){
           require 'app/views/'.$name.'.php';
      	}
      	else{
           require 'app/views/core/index/header.php';
      	   require 'app/views/core/'.$name.'.php';
      	   require 'app/views/core/index/footer.php';
      	}

      }

   }

?>
