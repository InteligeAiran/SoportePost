<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soporte de Post-Venta - Login</title>
    <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/login/login.css"/>
    <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/login/mobile/mobile.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/login/desktop/desktop.css" />
    <script>
        const ENDPOINT_BASE = '<?php echo ENDPOINT_BASE_DYNAMIC; ?>';
        const APP_PATH = '<?php echo APP_BASE_PATH; ?>';
    </script>
  </head>
<body>

  <!-------------------------------- LOGIN 1 ----------------------------------------->
   <!--img accesskey="logo" src="<?php echo APP;?>app/public/img/login_img.png" alt="Logo" class="logo"-->
  <!---------------------------------------------------------------------------------->

  <!-------------------------------- LOGIN 2 ---------------------------------->
    <video autoplay loop muted class="logo">
      <source src="<?php echo APP;?>app/public/img/login/Soporte-Post Venta (5).mp4" type="video/mp4">
    </video>
  <!--------------------------------------------------------------------------->

  <form id="loginform" method="POST">
    <div class="login-container">
      <h2>Soporte Post-Venta</h2>
      <h3>Iniciar Sesión</h3><br>
      <label for="user">
        <b>Usuario</b>
      </label>
      <input type="text" placeholder="Ingresar Usuario" name="username" onblur = "checkUser()" id="username" class="username form-input" required>
      <div id="usernameError" class="error"></div><div id="usernameVerification" class="success"></div><br>

      <label class="form-label" for="pass">
        <b>Contraseña</b>
      </label>
      <input type="password" placeholder="Ingresar Contraseña" name="password" id="password" class="password" required>
      <svg id = "clickme" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
      </svg> 
      <div id="passwordError" class="error"></div><div id="passwordVerification" class="success"></div>
    </div>
  </form>
  <button type = "button" onclick = "SendForm()" id = "BtnLogin">Ingresar</button>
  <a id="link" class="tooltip" onclick="ModalPass(event)">Recuperar Contraseña</a>

  <div id="loading-overlay" style="display: none;">
    <div class="spinner"></div>
    <p>Enviando correo</p>
  </div>

  <div id="modal" class="modal">
    <div class="modal-contenido">
      <span class="cerrar">&times;</span>
      <h2>Restablecer Contraseña</h2>
      <p>Ingresa tu correo electrónico para recibir un codigo.</p>
      <form id="restore_passForm">
        <input placeholder = "Coloque su Correo" onblur = "checkEmail()" type="email" id="email" name = "email" required>
        <div id="emailError" class="error"></div><div id="emailVerification" class="success"></div>
        <button id="Sendemail" type="button" onclick="SendEmail()">Enviar</button>
      </form>
    </div>  
  </div>

  <div id="modal2" class="modal"></div>

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
