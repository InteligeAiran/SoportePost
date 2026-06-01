<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */

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