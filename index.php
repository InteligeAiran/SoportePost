<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
/*
 * ============================================================
 *  SoportePost - Sistema de Gestión de Tickets
 *  Desarrollado por: Airan Bracamonte
 *  © 2026 - Todos los derechos reservados
 * ============================================================
 *
 * Archivo Inicial para el MVC
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
