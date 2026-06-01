<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
require_once("../conf.php");
?>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>phpChart - Break on Null</title>
</head>
    <body>
        <div><span> </span><span id="info1b"></span></div>

<?php
    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Chart 1 Example
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $s1 = array(null, 13, 43, null, 18, 25, 26, 41, 42, null, null, null, 37, 29, 27, 19);

    $pc = new C_PhpChartX(array($s1),'plot1');
    
    $pc->set_title(array('text'=>'breakOnNull true'));
    $pc->add_series(array('breakOnNull'=>true));
    $pc->set_axes(array(
         'xaxis'=>array('min'=>0,'max'=>18,'tickInterval'=>2),
    ));

    $pc->draw(600,300);
?>

    </body>
</html>