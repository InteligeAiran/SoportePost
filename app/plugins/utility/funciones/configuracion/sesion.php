<?php
//Función()
function logout(){
  $obj = new xajaxResponse('UTF-8');
   // Inicializar la sesión.
  //session_start();
  // Destruir todas las variables de sesión.
  $_SESSION = array();
  // Si se desea destruir la sesión completamente, borre también la cookie de sesión.
  // Nota: ¡Esto destruirá la sesión, y no la información de la sesión!
  if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
  }
  //Cierra conwxion a BD

  // Finalmente, destruir la sesión.
  session_destroy();

  $obj->addRedirect("https://sistemas.sacs.gob.ve/siacsv2/");

  return $obj;
}

function emptySession(){
  $obj = new xajaxResponse('UTF-8');
  //verificar session 
   if( !(isset($_SESSION["usuario"])) ){
      $obj->addAlert("La Sesión ha expirado, vuelva a ingresar");
      $obj->addRedirect("https://sistemas.sacs.gob.ve/siacsv2/");  
   }

  return $obj;
}

$xajax->registerFunction("logout"); 
$xajax->registerFunction("emptySession"); 

?>