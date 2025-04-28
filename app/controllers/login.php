<?php
  class login  extends Controller{
    public $view;

    public function __construct(){
  	  parent:: __construct();
  		
    }
  	
    function index(){
      Model::exists('login');  


      //Incorpora el FrontEnd Controller
      $this->view->js=array('login/js/frontEnd.js');
      $this->view->render('login/index',1);
    }
  }
?>