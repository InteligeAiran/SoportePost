<?php

class Controller {
  public $model;
  public $view;
      
  function __construct(){
    $this->view = new View();
  }

  public function loadModel($name){
    $path = 'app/models/'.$name.'_model.php';
    if(file_exists($path)){
      require 'app/models/'.$name.'_model.php';
      $modelName = $name.'_Model';
      $this->model = new $modelName();
    }
  }

  public static function exists($controllername){
    $fullpath = self::getFullpath($controllername);
    $found=false;
    $existe = 'no existe';
    if(file_exists($fullpath)){
      include $fullpath;
    }
  }

  public static function getFullpath($controllername){
    return ROOT."app/controllers/".$controllername.".php";
  }

  public function loadModelNew($modulo,$modelpath){     
    $path = 'app/views/'.$modulo.'/models/'.$modelpath.'Model.php';
    if(file_exists($path)){
      require $path;
      $class = $modelpath.'Model';
      $this->view->modelViews = new $class;
    }
  }//end 

  public static function getURL() {
    $arrayURL = explode("/", $_SERVER['SCRIPT_NAME']);
    $file = $arrayURL[1];
    $url = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['HTTP_HOST'] . "/" . $file . "/";
    return $url;
  }
}
?>