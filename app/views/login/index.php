<?php
require_once 'backEnd.php';
?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soporte de Post-Venta - Login</title>
    <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/login/login.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/login/mobile/mobile.css" />
  </head>
<body>
  <img accesskey="logo" src="<?php echo APP;?>app/public/img/login_img.png" alt="Logo" class="logo">
  <!--div class="header">
    <h1>Soporte Post-Venta</h1>
  </div-->
  <form id="loginform" method="POST">
    <div class="login-container">
      <h2>Soporte Post-Venta</h2>
      <h3>Iniciar Sesión</h3><br>
      <label for="user">
        <b>Usuario</b>
      </label>
      <input type="text" placeholder="Ingresar Usuario" name="username" onblur= "checkUser()" id="username" class="username form-input" required>
      <div id="usernameError" class="error"></div><div id="usernameVerification" class="success"></div><br>

      <label class="form-label" for="pass">
        <b>Contraseña</b>
      </label>
      <input type="password" placeholder="Ingresar Contraseña"  onblur = "checkPass()" name="password" id="password" class="password" required>
      <div id="passwordError" class="error"></div><div id="passwordVerification" class="success"></div>
      <!--input type="checkbox" checked="checked"> Recordarme-->
    </div>
  </form>
  <button type = "button" onclick = "SendForm()" id = "BtnLogin">Ingresar</button>
  <a id="link" href="seguros.html">Restablecer Contraseña</a>
  <!-- Bootstrap core JavaScript-->
  <script src="<?php echo APP;?>app/plugins/jquery/jquery.min.js"></script>
  <script src="<?php echo APP;?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="<?php echo APP;?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>
  <!--JQUERY-->
  <script src="<?php echo APP;?>app/plugins/jquery/jquery-3.5.1.js"></script>
  <!--  SweetAlert   -->
  <script src = "<?php echo APP;?>app/plugins/sweetalert2/sweetalert2.js"></script>
  <script src = "<?php echo APP;?>app/plugins/sweetalert2/sweetalert2.all.js"></script>
  <!--MASCARAS JQUERY-->
  <script src="<?php echo APP;?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
  <!-- Custom scripts for all pages-->
  <script src="<?php echo APP;?>app/plugins/js/sb-admin-2.min.js"></script>

  <?php
    if (isset($this->js)){
      foreach ($this->js as $js){
        echo '<script type="text/javascript" src="'.APP.'app/views/'.$js.'"></script>'; 
      }
    }
  ?>
</body>
</html>
