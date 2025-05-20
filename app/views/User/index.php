<?php
function mi_navbar() {

}
?>
<!DOCTYPE html>
<lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
        <link rel="icon" type="image/png" href="../assets/img/favicon.png">
        <title>
            Soporte Post Venta
        </title>
        <!--     Fonts and icons     -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <!-- Nucleo Icons -->
        <!--     Fonts and icons     -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <!-- Nucleo Icons -->
   
        <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/user/desktop/desktop.css" />
        <!-- CSS Files -->
            <link id="pagestyle" rel="stylesheet" href="<?php echo APP;?>app/plugins/css/dashboard/dashboard.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">



        <!-- <link type="text/css" rel="stylesheet" href="<?php echo APP;?>DataTable/bootstrap1.min.css"> -->
        <link type="text/css" rel="stylesheet" href="<?php echo APP;?>DataTable/datatable.css">
        <!-- <link type="text/css" rel="stylesheet" href="<?php echo APP;?>DataTable/bootstrap.min.css"> -->
        <link type="text/css" rel="stylesheet" href="<?php echo APP;?>DataTable/jquery.dataTables.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP;?>DataTable/buttons.dataTables.min1.css">

        <!-- Font Awesome Icons -->
      
        <!-- CSS Files -->
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP;?>app/plugins/css/dashboard/dashboard.css" />

        <!-- alertify -->
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP;?>app/plugins/alertify/themes/alertify.bootstrap.css" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP;?>app/plugins/alertify/themes/alertify.core.css" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP;?>app/plugins/alertify/themes/alertify.default.css" />

        <script>
            const ENDPOINT_BASE = '<?php echo ENDPOINT_BASE_DYNAMIC; ?>';
            const APP_PATH = '<?php echo APP_BASE_PATH; ?>';
        </script>
    </head>
    <body class="g-sidenav-show bg-gray-100">
        <div id="top"  class="d-lg-none fixed-top bg-dark p-2">
            <button class="btn btn-dark" id="filter-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list-task" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/>
                    <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/>
                    <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/>
                </svg>
            </button>
        </div>
        <?php require_once 'app/core/components/navbar/index.php'; mi_navbar();?>

        <main class="main-content position-relative border-radius-lg overflow-hidden bg-gray-100">
            <div class="container-fluid py-4">
                <div id = "Row" class="row mt-4">
                    <div class = "cord">
                        <div id="div_user" class="background-color">
                            <div class="col-lg-12 col-md-12 mt-4 mb-4">
                                <div class="card card-body bg-gradient-blue shadow-primary border-radius-lg pt-4 pb-3">
                                    <strong><h5 class="text-black text-capitalize ps-3">LISTA DE USUARIOS</h5></strong>
                                </div>
                            </div> 
                                  
                            <table id="tabla-ticket" class="background-users-table">
                                <thead>
                                    <tr>
                                        <th>Nº</th>
                                        <th>id</th>
                                        <th>Nombre y Apellido</th>
                                        <th>Usuario</th>
                                        <th>Cedula</th>
                                        <th>Correo</th>
                                        <th>Estatus</th>
                                        <th>Rol</th>
                                        <th>Area</th>
                                        <th>Nivel Tecnico</th>
                                        <th>Region</th>
                                        <th>Modulos</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody  id="table-ticket-body">
                                </tbody>
                            </table>
                            <!--div class="col-lg-12 col-md-12 mt-4 mb-4">
                            <div class="card card-body bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                            <h6 class="text-white text-capitalize ps-3">Dashboard</h6-->         
                        </div>   
                    </div>    
                </div>   
            </div>
        </main>


        <div class="modal fade" id="ModalAggUsers" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static"
     data-keyboard="false">
         <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <div class="panel-heading" style="text-align: center;color:#ffffff;">
                    <h4>Registro de usuarios</h4>
                </div>
            </div> 

            <div class="modal-body">
                <div class="panel-body">
                
                
                <div class="row">
                      <div class="col-md-6">
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="nombreuser" class="form-control" name="nombreuser" onkeypress="return soloLetras(event)">
                      </div>
                      <div class="col-md-6">
                        <label for="apellido">Apellido:</label>
                        <input type="text" id="apellidouser" class="form-control" name="apellidouser" onkeypress="return soloLetras(event)" onchange="nameUsuario()">
                      </div>
                </div>    

                <div class="row">
                    <div class="col-md-6">
                        <label for="">Documentacion</label>
                        <div class="input-group" style="width: 92%;">
                          <input name="tipodoc" id="tipodoc" type="text" value="V-" class="form-control" disabled>
                          <span class="input-group-addon"></span>
                          <input style="width: 70%;" class="form-control" type="text" name="documento" id="documento"  maxlength="9" onkeypress="return soloNumeros(event)" >
                        </div>
                    </div>
                      <div class="col-md-6">
                        <label for="usuario">Usuario:</label>
                        <input type="text" id="usuario" class="form-control" name="usuario" disabled onchange="nameUsuario()"> 
                      </div>
                </div>  

                <div class="row">
                      
                      <div class="col-md-6">
                        <label for="email">Correo:</label>
                            <input type="text" id="email" class="form-control" name="email" onchange="validarEmail(this)">
                            <span class="alert-danger" id="resultcorreo"></span>
                      </div>
                      <div class="col-md-6">
                        <label for="area">Area:</label>
                        <div id="AreaUsersContainer">
                            <select id="areausers" name="areausers"></select>
                            <p id="rifMensaje1"></p>
                        </div>
                      </div>
                </div>    
                <br>
                <div class="row">
                      <div class="col-md-6">
                        <label for="apellido">Region:</label>
                       <div id="TipoUsersContainer">
                            <select id="regionusers" name="regionusers"></select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label for="apellido">Tipo Usuario:</label>
                       <div id="TipoUsersContainer">
                            <select id="tipousers" name="tipousers" onchange="levelTecnico()"></select>
                        </div>
                      </div>
                </div>  
                <br> 
                <div class="row">
                      <div class="col-md-6" id="nivel" style="display: none;">
                        <label for="apellido">Nivel Técnico:</label>
                       <div id="TipoUsersContainer">
                            <select name="select" name="idnivel" id="idnivel">
                              <option value="3" selected>Seleccione</option>
                              <option value="1">Nivel 1</option>
                              <option value="2">Nivel 2</option>
                            </select>
                        </div>
                      </div>
                      <input name="id_user" id="id_user" type="hidden" value="<?php echo $_SESSION['id_user']?>">
                </div>  
            </div> 
          </div>   
          <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarUsers">Guardar</button>
            </div>
        </div>
    </div>
   </div>



    <div class="modal fade" id="ModalEditUsers" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static"
     data-keyboard="false">
         <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <div class="panel-heading" style="text-align: center;color:#ffffff;">
                    <h4>Editar usuarios</h4>
                </div>
            </div> 

            <div class="modal-body">
                <div class="panel-body">
                
                <input type="hidden" id="idusuario_edit" class="form-control" name="idusuario_edit">
                <input type="text" id="id_user" class="form-control" name="editnombreuser" style="display: none">
                <div class="row">
                      <div class="col-md-6">
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="edit_nombreuser" class="form-control" name="edit_nombreuser" onkeypress="return soloLetras(event)" style="text-transform:uppercase; color:#000000;" onkeyup="javascript:this.value=this.value.toUpperCase();">
                      </div>
                      <div class="col-md-6">
                        <label for="apellido">Apellido:</label>
                        <input type="text" id="edit_apellidouser" class="form-control" name="edit_apellidouser" onkeypress="return soloLetras(event)" onchange="nameUsuario()" style="text-transform:uppercase; color:#000000;" onkeyup="javascript:this.value=this.value.toUpperCase();">
                      </div>

                </div>    
                
                <div class="row">
                    <div class="col-md-6">
                        <label for="">Documentacion</label>
                        <div class="input-group" style="width: 92%;">
                          <input name="tipodoc" id="tipodoc" type="text" value="V-" class="form-control" disabled>
                          <span class="input-group-addon"></span>
                          <input style="width: 70%;" class="form-control" type="text" name="edit_documento" id="edit_documento"  maxlength="9" onkeypress="return soloNumeros(event)" >
                        </div>
                    </div>
                      <div class="col-md-6">
                        <label for="usuario">Usuario:</label>
                        <input type="text" id="edit_usuario" class="form-control" name="editusuario" disabled onchange="nameUsuario()"> 
                      </div>
                </div>  

                <div class="row">
                      
                      <div class="col-md-6">
                        <label for="email">Correo:</label>
                            <input type="text" id="edit_email" class="form-control" name="edit_email" onchange="validarEmail(this)" style="text-transform:uppercase; color:#000000;" onkeyup="javascript:this.value=this.value.toUpperCase();">
                            <span class="alert-danger" id="resultcorreo"></span>
                      </div>
                      <div class="col-md-6">
                        <label for="area">Area:</label>
                        <div id="AreaUsersContainer">
                            <select id="edit_areausers" name="edit_areausers"></select>
                            <p id="rifMensaje1"></p>
                        </div>
                      </div>
                </div>    
                <br>
                <div class="row">
                      <div class="col-md-6">
                        <label for="apellido">Region:</label>
                       <div id="TipoUsersContainer">
                            <select id="edit_regionusers" name="edit_regionusers"></select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label for="apellido">Tipo Usuario:</label>
                       <div id="TipoUsersContainer">
                            <select id="edit_tipousers" name="edit_tipousers" onchange="levelTecnico()"></select>
                        </div>
                      </div>
                </div>  
                <br> 
                <div class="row">
                      <div class="col-md-6" id="nivel" style="display: none;">
                        <label for="apellido">Nivel Técnico:</label>
                       <div id="TipoUsersContainer">
                            <select name="select" name="edit_idnivel" id="edit_idnivel">
                              <option value="3" selected>Seleccione</option>
                              <option value="1">Nivel 1</option>
                              <option value="2">Nivel 2</option>
                            </select>
                        </div>
                      </div>
                      
                </div>   
                <input name="id_user" id="id_user" type="hidden" value="<?php echo $_SESSION['id_user']?>">
            </div> 
          </div>   
          <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnEditarUsers">Guardar</button>
            </div>
        </div>
    </div>
   </div>


           <div class="modal fade" id="ModalModulos" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static"
     data-keyboard="false">
         <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <div class="panel-heading" style="text-align: center;color:#ffffff;">
                    <h4>Asignación de Módulos</h4>
                </div>
            </div> 

            <div class="modal-body">
                <div class="panel-body">
                
                <input type="hidden" id="idusuario_edit" class="form-control" name="idusuario_edit"> 
                
                <input name="id_user" id="id_user" type="hidden" value="<?php echo $_SESSION['id_user']?>">
                    <table id="tabla-modulo" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Módulo</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                            <tbody  id="tabla-modulo-body">
                            </tbody>
                    </table>
            </div> 
          </div>   
          <!-- <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarUsers">Guardar</button>
            </div> -->
        </div>
    </div>
   </div>

        <!-- <div class="fixed-plugin">
            <a class="fixed-plugin-button text-dark position-fixed px-3 py-2">
                <i class="fa fa-cog py-2"> </i>
            </a>
            <div class="card shadow-lg">
                <div class="card-header pb-0 pt-3 ">
                    <div class="float-start">
                        <h5 class="mt-3 mb-0">Argon Configurator</h5>
                        <p>See our dashboard options.</p>
                    </div>
                    <div class="float-end mt-4">
                        <button class="btn btn-link text-dark p-0 fixed-plugin-close-button">
                            <i class="fa fa-close"></i>
                        </button>
                    </div>
                </div>
                <hr class="horizontal dark my-1">
                <div class="card-body pt-sm-3 pt-0 overflow-auto">
                    <div>
                        <h6 class="mb-0">Sidebar Colors</h6>
                    </div>
                    <a href="javascript:void(0)" class="switch-trigger background-color">
                        <div class="badge-colors my-2 text-start">
                            <span class="badge filter bg-gradient-primary active" data-color="primary"
                                onclick="sidebarColor(this)"></span>
                            <span class="badge filter bg-gradient-dark" data-color="dark"
                                onclick="sidebarColor(this)"></span>
                            <span class="badge filter bg-gradient-info" data-color="info"
                                onclick="sidebarColor(this)"></span>
                            <span class="badge filter bg-gradient-success" data-color="success"
                                onclick="sidebarColor(this)"></span>
                            <span class="badge filter bg-gradient-warning" data-color="warning"
                                onclick="sidebarColor(this)"></span>
                            <span class="badge filter bg-gradient-danger" data-color="danger"
                                onclick="sidebarColor(this)"></span>
                        </div>
                    </a>
                    <div class="mt-3">
                        <h6 class="mb-0">Sidenav Type</h6>
                        <p class="text-sm">Choose between 2 different sidenav types.</p>
                    </div>
                    <div class="d-flex">
                        <button class="btn bg-gradient-primary w-100 px-3 mb-2 active me-2" data-class="bg-white"
                            onclick="sidebarType(this)">White</button>
                        <button class="btn bg-gradient-primary w-100 px-3 mb-2" data-class="bg-default"
                            onclick="sidebarType(this)">Dark</button>
                    </div>
                    <p class="text-sm d-xl-none d-block mt-2">You can change the sidenav type just on desktop view.</p>
                  
                    <div class="d-flex my-3">
                        <h6 class="mb-0">Navbar Fixed</h6>
                        <div class="form-check form-switch ps-0 ms-auto my-auto">
                            <input class="form-check-input mt-1 ms-auto" type="checkbox" id="navbarFixed"
                                onclick="navbarFixed(this)">
                        </div>
                    </div>
                    <hr class="horizontal dark my-sm-4">
                    <div class="mt-2 mb-5 d-flex">
                        <h6 class="mb-0">Light / Dark</h6>
                        <div class="form-check form-switch ps-0 ms-auto my-auto">
                            <input class="form-check-input mt-1 ms-auto" type="checkbox" id="dark-version"
                                onclick="darkMode(this)">
                        </div>
                    </div>
                    <a class="btn bg-gradient-dark w-100"
                        href="https://www.creative-tim.com/product/argon-dashboard">Free Download</a>
                    <a class="btn btn-outline-dark w-100"
                        href="https://www.creative-tim.com/learning-lab/bootstrap/license/argon-dashboard">View
                        documentation</a>
                    <div class="w-100 text-center">
                        <a class="github-button" href="https://github.com/creativetimofficial/argon-dashboard"
                            data-icon="octicon-star" data-size="large" data-show-count="true"
                            aria-label="Star creativetimofficial/argon-dashboard on GitHub">Star</a>
                        <h6 class="mt-3">Thank you for sharing!</h6>
                        <a href="https://twitter.com/intent/tweet?text=Check%20Argon%20Dashboard%20made%20by%20%40CreativeTim%20%23webdesign%20%23dashboard%20%23bootstrap5&amp;url=https%3A%2F%2Fwww.creative-tim.com%2Fproduct%2Fargon-dashboard"
                            class="btn btn-dark mb-0 me-2" target="_blank">
                            <i class="fab fa-twitter me-1" aria-hidden="true"></i> Tweet
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/argon-dashboard"
                            class="btn btn-dark mb-0 me-2" target="_blank">
                            <i class="fab fa-facebook-square me-1" aria-hidden="true"></i> Share
                        </a>
                    </div>
                </div>
            </div>
        </div> -->
        
         <!-- Github buttons -->
         <script async defer src="https://buttons.github.io/buttons.js"></script>
        <!-- Control Center for Soft Dashboard: parallax effects, scripts for the example pages etc -->
        <!-- Bootstrap core JavaScript-->
         <!--JQUERY-->
         <script src="<?php echo APP;?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP;?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <script src="<?php echo APP;?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>


        <!-- Bootstrap-->
        <script src="<?php echo APP;?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="<?php echo APP;?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
        <script src="<?php echo APP;?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>

        <!--   Core JS Files   -->
        <script src="<?php echo APP;?>app/plugins/js/popper.min.js"></script>
        <script src="<?php echo APP;?>app/plugins/js/perfect-scrollbar.min.js"></script>
        <script src="<?php echo APP;?>app/plugins/js/smooth-scrollbar.min.js"></script>
        <script src="<?php echo APP;?>app/public/img/dashboard/js/argon-dashboard.min.js?v=2.1.0"></script>
        
        <!-- Datatable -->
        <script src = "<?php echo APP;?>app/plugins/datatables/datatables.min.js"></script>
        <script src = "<?php echo APP;?>app/plugins/datatables/datatables.js"></script>

        <!-- Datatable otro sistema-->

        <script src = "<?php echo APP;?>DataTable/jquery.dataTables.min.js"></script>
        <script src = "<?php echo APP;?>DataTable/dataTables.buttons.min.js"></script>
        <script src = "<?php echo APP;?>DataTable/buttons.print.min.js"></script>
        <script src = "<?php echo APP;?>DataTable/buttons.flash.min.js"></script>
        <script src = "<?php echo APP;?>DataTable/pdfmake.min.js"></script>
        <script src = "<?php echo APP;?>DataTable/jszip.min.js"></script>
        <script src = "<?php echo APP;?>DataTable/vfs_fonts.js"></script>
        <script src = "<?php echo APP;?>DataTable/buttons.html5.min.js"></script>


         <script src = "<?php echo APP;?>js/Datatablebuttons5.js"></script>
         <script src = "<?php echo APP;?>js/Datatablebuttons.min.js"></script>
         <script src = "<?php echo APP;?>js/Datatablebuttonsprint.min.js"></script>
         <script src = "<?php echo APP;?>js/datatables.js"></script>




        <!-- Chart -->
        <script src="<?php echo APP;?>app/plugins/chart.js/chart.js"></script>
        <script src="<?php echo APP;?>app/plugins/chart.js/chart.min.js"></script>

        <!--  SweetAlert   -->
        <script src="<?php echo APP;?>app/plugins/sweetalert2/sweetalert2.js"></script>
        <script src="<?php echo APP;?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

        <!--  Alertify   --> 
        <script src="<?php echo APP;?>app/plugins/alertify/lib/alertify.js"></script>
        <script src="<?php echo APP;?>app/plugins/alertify/lib/alertify.min.js"></script>
        <script src="<?php echo APP;?>app/plugins/alertify/src/alertify.js"></script>


        <!--MASCARAS JQUERY-->
        <script src = "<?php echo APP;?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>

        <!-- Custom scripts for all pages-->
        <script src="<?php echo APP;?>app/plugins/js/sb-admin-2.min.js"></script>

        
        <?php
    if (isset($this->js)){
      foreach ($this->js as $js){
        echo '<script type="text/javascript" src="'.APP.'app/views/'.$js.'"></script>'; 
      }
    }
  ?>
    <!-- PARTE DEL CODIGO DE SESSION EXPIRADAS-->
    <?php
        $expired_sessions = json_encode($this->expired_sessions);
        $message = json_encode($this->message);
        $redirect = json_encode($this->redirect);
        $usuario_id = json_encode($this->usuario_id);
        $sessionLifetime = json_encode($this->sessionLifetime); // Asegúrate de que esto esté presente

    ?>
    <script>
        
        var expired_sessions = <?php echo $expired_sessions; ?>;
        var message = <?php echo $message; ?>;
        var redirect = <?php echo $redirect; ?>;
        var usuario_id = <?php echo $usuario_id; ?>;
        var sessionLifetime = <?php echo $sessionLifetime; ?>; // Asegúrate de que esto esté presente


        // Verificar si hay sesiones expiradas
        if (expired_sessions) {
            Swal.fire({
                icon: 'warning', // Puedes cambiar el icono (warning, error, success, info, question)
                title: 'Session Expiró.', // Título del SweetAlert
                text: message, // Mensaje del SweetAlert
                color: 'black', // Color del texto
                showConfirmButton: false, // Oculta el botón "Aceptar"
                timer: 2000, // Cierra el modal después de 2 segundos (2000 ms)
                timerProgressBar: true, // Opcional: muestra una barra de progreso del tiempo
                didOpen: () => {
                    Swal.showLoading();
                },
                willClose: () => {
                    setTimeout(() => {
                        window.location.href = redirect; // Recarga la página después del temporizador
                    }, 500); // Espera 0.5 segundos (igual que el temporizador)
                }
            })// Programar la recarga después de que el SweetAlert se cierre
        }

        // Agregar lógica de recarga automática
        if (sessionLifetime) {
            setTimeout(function() {
                location.reload(true); // Forzar recarga desde el servidor
            }, sessionLifetime * 1000); // sessionLifetime está en segundos
        }
    </script>
    <!-- END PARTE DEL CODIGO DE SESSION EXPIRADAS-->

</body>
</html>
