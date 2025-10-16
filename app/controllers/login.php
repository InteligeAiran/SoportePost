<?php

session_start();

  class login  extends Controller{
    public $view;

    private $db;

    public function __construct(){
  	  parent:: __construct();
      $this->db = DatabaseCon::getInstance(bd_hostname, mvc_port, bd_usuario, bd_clave, database); // Ensure getInstance() returns a PgSql\Connection
    }
  	
    function index(){
      Model::exists('login');  

      $this->db->closeConnection();
      Session::destroy();
      //Incorpora el FrontEnd Controller
      $this->view->js=array('login/js/frontEnd.js');
      $this->view->render('login/index',1);
    }
  }
?>