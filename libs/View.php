
<?php   //Vista del Controlador
   class View {
   public $expired_sessions;
    public $message;
    public $redirect;
    public $usuario_id;

    public $modelViews;
    public $sessionLifetime;

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