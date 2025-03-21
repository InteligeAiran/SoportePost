
<?php
  class Bootstrap{
     function __construct(){
         $url = isset($_GET['url']) ? $_GET['url'] : null;
         $url = rtrim($url, '/');
         $url = explode('/',$url);
            

         if(empty($url[0])){
            require 'app/controllers/login.php';
           	$controller = new login();
            $controller->index();
         	  return false;
          }
            //Busca la Pagina

             $file = 'app/controllers/'.$url[0].'.php';
             
         if(file_exists($file)){
      
            require $file; 	            //Requiere del Archivo
         }else{

          	$this->error();
         }
         
         $controller = new $url[0];
         $controller->loadModel($url[0]); 
         //Llamar a la pagina de Error

        if(isset($url[2])){
           if(method_exists($controller, $url[1])){
              $controller->{$url[1]}($url[2]); 
           }else{
            $this->error();
           }
  	       
        } else {
            if(isset($url[1])){
              if(method_exists($controller,$url[1])){
                $controller->{$url[1]}();
              } else {
                $this->error();
              }
   	             
       }else{
         $controller->index();  
       }	
      }
      
     }

     function error(){
      require 'app/controllers/error.php';
      $controller = new Error();
      $controller->index();
      return false;
     }
  }
?>
