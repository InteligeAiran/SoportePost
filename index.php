
<?php
/*
 *Archivo Inicial para el MVC
 */
  //Usar un Autoloader 
  require 'libs/Bootstrap.php'; 
  require 'libs/Controller.php'; 
  require 'libs/Model.php'; 
  require 'libs/Rules.php';
  require 'libs/View.php';
  //require 'libs/Reports.php';

  //Library 
  require 'libs/database_cn.php';
  require 'libs/session.php';

  //Direcciones y Parametros de Conexion 
  require 'config/paths.php';
  require 'libs/database.php';
  $app = new Bootstrap();
?>
