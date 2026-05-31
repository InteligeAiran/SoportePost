<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Airan Bracamonte. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
$contents = '';
if(isset($_GET['_fn'])){
	$_fn = str_replace('/', '', str_replace('.', '', $_GET['_fn'])); // current path only
	if(file_exists($_fn.'.php')){
		$contents = file_get_contents('./'. $_fn.'.php');  		
		$contents = str_replace('>', '&gt;', str_replace('<', '&lt;', $contents));
	}
}
?>
<pre class="code">
<code class="php">
<?php 
echo ($contents == '')?'No such file.':$contents;
?>
</code>
</pre>
