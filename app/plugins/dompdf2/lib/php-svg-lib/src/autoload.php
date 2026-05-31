<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
/**
 * @package php-svg-lib
 * @link    http://github.com/PhenX/php-svg-lib
 * @author  Fabien Ménager <fabien.menager@gmail.com>
 * @license http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License
 */

spl_autoload_register(function($class) {
  if (0 === strpos($class, "Svg")) {
    $file = str_replace('\\', DIRECTORY_SEPARATOR, $class);
    $file = realpath(__DIR__ . DIRECTORY_SEPARATOR . $file . '.php');
    if (file_exists($file)) {
      include_once $file;
    }
  }
});