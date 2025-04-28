<?php
include 'backEnd.php';
?>
<!DOCTYPE html>
    <lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
        <link rel="icon" type="image/png" href="../assets/img/favicon.png">
        <title>
            Argon Dashboard 3 by Creative Tim
        </title>
        <!--     Fonts and icons     -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <!-- Nucleo Icons -->
        <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/dashboard/nucleo-svg.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/dashboard/consulta_rif/desktop/desktop.css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/dashboard/consulta_rif/desktop/form.css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/dashboard/consulta_rif/mobile/mobile.css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/dashboard/consulta_rif/laptop/laptop.css"/>
        <!-- CSS Files -->
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP;?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP;?>app/plugins/css/dashboard/dashboard.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">
    </head>

    <body id="fondo" class="g-sidenav-show bg-gray-100">
        <div class="min-height-300 bg-dark position-absolute w-100">
            <div class="d-lg-none fixed-top bg-dark p-2">
                <button class="btn btn-dark" id="filter-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list-task" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/>
                        <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/>
                        <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/>
                    </svg>
                </button>
            </div>
            <?php require_once 'app/core/components/navbar/index.php'; mi_navbar(); ?>
            <main class="main-content position-relative border-radius-lg ">
                <div class="container-fluid py-4" style = "margin-top: 90px;">
                    <div id = "Row" class="row mt-4">
                        <div class = "cord">
                        
                        <!-- MODAL FAILURE 2 -->        
                        <div id="miModal" class="modal">
                            <div class="modal-contenido">
                                <span class="cerrar">&times;</span>
                                <div id="contenidoModal" style="margin-left: 59px;">
                                    <div id="detalle1">
                                        <h2>Falla Nivel 2</h2><br>

                                        <!-- FALLA DESCRITA POR EL CLIENTE-->
                                        <div>
                                            <label for="FallaSelect2">Falla Descrita Por el Cliente</label>
                                            <div id="FallaSelect2Container">
                                                <select id="FallaSelect2" name="FallaSelect2">
                                                    <option></option>
                                                </select>
                                            </div><br>
                                        </div>
                                        <!-- END FALLA DESCRITA POR EL CLIENTE-->

                                        <!-- RIF CLIENTE -->
                                        <div style=" display: flex; flex-direction: column;">
                                            <label for="serialInputDetalle1">RIF cliente</label>
                                            <input type="text" onchange = "checkRif()" id="InputRif" placeholder= "JV123456789">
                                            <p id="rifMensaje"></p>
                                        </div>
                                        <!-- END RIF CLIENTE -->

                                        <!-- SERIAL CLIENTE -->
                                        <div>
                                            <label for="serialSelect">Seriales de POS:</label>
                                            <div id="serialSelectContainer">
                                                <select id="serialSelect" name="serialSelect"></select>
                                            </div><br>
                                        </div>
                                        <!-- END SERIAL CLIENTE -->

                                        <!-- ASIGNAR COORDINADOR -->
                                        <div>
                                            <label for="AsiganrCoordinador">Asignar a Coordinador</label>
                                            <div id="AsiganrCoordinadorContainer">
                                                <select id="AsiganrCoordinador" name="AsiganrCoordinador"></select>
                                            </div><br>
                                        </div>
                                        <!-- END ASIGNAR COORDINADOR -->

                                        <!-- FECHAS GARANTIAS -->
                                        <div class="contenedor-fechas">
                                            <div>
                                                <label for="ultimoTicketInput">Fecha del Último Ticket:</label>
                                                <input style="width: 10%; position: fixed;" type="text" id="ultimateTicketInput" readonly>
                                                <div style=" position: relative; margin-top: 17%; width: 72%; font-size: 13px;" id="resultadoGarantiaReingreso"></div> 
                                            </div><br>

                                            <div>
                                                <label for="InputFechaInstall">Fecha de Instalaci&oacuten POS:</label>
                                                <input style="width: 10%; position: fixed;" type="text" id="InputFechaInstall" readonly>
                                                <div style=" position: relative; margin-top: 17%; width: 72%; font-size: 13px;" id="resultadoGarantiaInstalacion"></div>
                                            </div>
                                        </div><br>
                                        <!-- END FECHAS GARANTIAS -->

                                        <!-- SELECT FALLA 2 -->
                                        <br><label style = "margin-left: 30%; width: 85px; margin-top: 27px; position: relative; display: block; margin-bottom: -14px;" for="FallaSelect1">Nivel Falla</label>
                                        <div id="FallaSelectContainer1">
                                            <select style="margin-left: 116%; width: 172px;" id="FallaSelectt2" name="FallaSelect1">
                                                <option value = "2">Nivel 2</option>
                                            </select>
                                        </div><br>
                                        <!-- END SELECT FALLA 2 -->

                                        <br><div style="display: flex; flex-direction: column; margin-top: -24%;">
                                            <div>
                                                <!--label id="EnvioLabel" for="EnvioLabel">¿Desea Cargar El PDF de Envio?</label-->
                                                <div style="display: flex; align-items: center;">
                                                    <button id="DownloadEnvi">Cargar PDF Envio</button>
                                                    <input id="EnvioInput" type="file" style="display: none; margin-left: 10px;" accept="application/pdf, image/jpeg, image/jpg">
                                                    <div id="anticipoStatus"></div>
                                                </div>
                                            </div><br>
                                            <div>
                                                <!--label style="font-size: 15px;" id="ExoneracionLabel" for="ExoneracionLabel">¿Desea Cargar El PDF de Exoneracion?</label-->
                                                <div style="display: flex; align-items: center;">
                                                    <button id="DownloadExo">Cargar Exoneracion</button>
                                                    <input id="ExoneracionInput" type="file" style="display: none; margin-left: 10px;" accept="application/pdf, image/jpeg, image/jpg">
                                                    <div id="exoneracionStatus"></div>
                                                </div>
                                            </div><br>
                                            <div>
                                                <!--label style="width:270px   ; font-size: 15px;" id="AnticipoLabel" for="AnticipoLabel">¿Desea Cargar El PDF del Anticipo?</label-->
                                                <div style="display: flex; align-items: center;">
                                                    <button id="DownloadAntici">Cargar PDF Anticipo</button>
                                                    <input id="AnticipoInput" type="file" style="display: none; margin-left: 10px;" accept="application/pdf, image/jpeg, image/jpg">
                                                    <div id="envioStatus"></div>
                                                </div>
                                            </div>
                                            <div class="contenedor-triangulo">
                                                <div class="triangulo"></div>
                                                <div class="triangulo"></div>
                                                <div class="triangulo"></div>
                                            </div>

                                            <div id="animation" class="contenedor-triangulo1">
                                                <div class="triangulo1"></div>
                                                <div class="triangulo1"></div>
                                                <div class="triangulo1"></div>
                                            </div>
                                        </div>

                                        <div>
                                            <button id="SendForm2">Cargar</button>
                                        </div>
                                    </div>
                                    <div id="detalle2" style="display: none;">
                                        <h2>Detalle 2</h2>
                                        <input type="text" id="serialInputDetalle2" placeholder="Serial">
                                        <button onclick="cargarDatosDetalle2()">Cargar</button>
                                        <table id="serialCountTableDetalle2"><tbody></tbody></table>
                                    </div>
                                    <div id="detalle3" style="display: none;">
                                        <h2>Detalle 3</h2>
                                        <input type="text" id="serialInputDetalle3" placeholder="Serial">
                                        <button onclick="cargarDatosDetalle3()">Cargar</button>
                                        <table id="serialCountTableDetalle3"><tbody></tbody></table>
                                    </div>
                                </div>

                                <div class="navegacion">
                                    <button id="anterior">Anterior</button>
                                    <button id="siguiente">Siguiente</button>
                                </div>
                            </div>
                        </div>
                        <!-- END MODAL FAILURE 2 -->

                        <!-- TO SELECT THE FAILURE -->
                        <div id="nivelFallaModal" class="modal">
                                <div class="modal-contenido">
                                    <span class="cerrar1">&times;</span>
                                    <h2>¿Cuál es el nivel de la falla?</h2>
                                    <div style="text-align: center;">
                                    <button value = "1" id="nivel1Btn">Nivel 1</button>
                                    <button value = "2" id="nivel2Btn">Nivel 2</button>
                                </div>
                            </div>
                        </div>

                        <!-- <select id="crearTicketSelect" class="boton-modal">
                            <option value = "Crear Ticket">Crear Ticket</option>
                            <option id="abrirModal" value="Soporte POS">Soporte POS</option>
                            <option value="Sustitución de POS">Sustitución de POS</option>
                            <option value="Préstamo de POS">Préstamo de POS</option>
                            <option value="Desafiliación de POS">Desafiliación de POS</option>
                            <option value="Desafiliación de POS">Migracion de Bancos</option>
                            <option value="Desafiliación de POS">Cambio de Razon Social</option>
                        </select-->
                        <!-- END TO SELECT THE FAILURE -->

                        <!-- MODAL FAILURE 1 -->
                        <div id="miModal1" class="modal">
                            <div class="modal-contenido1">
                                <span class="cerrar1">&times;</span>
                                <div  class = "nivel1modal" id="contenidoModal2">
                                    <div>
                                        <h2>Falla Nivel 1</h2>
                                        <!-- FALLA DESCRITA POR EL CLIENTE-->
                                        <label for="FallaSelect1">Falla Descrita Por el Cliente</label>
                                        <div id="FallaSelect1Container">
                                            <select id="FallaSelect1" name="FallaSelect1">
                                            </select>
                                        </div><br>
                                        <!-- END FALLA DESCRITA POR EL CLIENTE-->

                                        <!-- RIF CLIENTE -->
                                        <label for="serialInputDetalle1">RIF cliente</label>
                                        <input type="text" onchange = "checkRif1()" id="InputRif1" placeholder= "JV123456789">
                                        <p id="rifMensaje1"></p>
                                        <!-- END RIF CLIENTE -->

                                        <!-- SERIAL -->
                                        <label for="serialSelect">Seriales de POS:</label>
                                        <div id="serialSelectContainer">
                                            <select id="serialSelect1" name="serialSelect">
                                            </select>
                                        </div><br>
                                        <!-- END SERIAL -->

                                        <!-- SELECT FALLA 1 -->
                                        <label for="FallaSelect">Nivel Falla</label>
                                        <div id="FallaSelectContainer">
                                            <select id="FallaSelectt1" name="FallaSelect">
                                                <option value = "1">Nivel 1</option>
                                            </select>
                                        </div>
                                        <!-- END SELECT FALLA 1 -->

                                        <button id="SendForm1" onclick="SendDataFailure1();">Cargar</button>
                                        <table id="serialCountTableDetalle1"><tbody></tbody></table>
                                    </div>
                                </div>
                            </div>
                        </div>    
                        <!-- END MODAL FAILURE 1 -->
                        
                        <div id = "SearchRif">
                            <input type="text" id="rifInput" placeholder= "JV123456789">
                            <button type = "button" onclick = "SendRif()" id="buscarRif">Buscar</button><br>
                        </div><br>
                            <div class="card">
                                <div class="card-header pb-0 p-3">
                                    
                                    <div class="d-flex justify-content-between">
                                        <!--h6 id = "cliente" class="mb-2">Clientes</h6-->
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table id="rifCountTable" >
                                        <thead>
                                            <tr>
                                                <th style = "width: 5%; height: 10px;" >ID cliente</th>
                                                <th style = "width: 5%;">Raz&oacuten Social</th>
                                                <th style = "width: 5%;">RIF</th>
                                                <th style = "width: 5%;">Modelo POS</th>
                                                <th style = "width: 5%;">serial POS</th>
                                                <th style = "width: 5%;">Nr Afiliaci&oacuten</th>
                                                <th style = "width: 5%;">Fecha Instalaci&oacuten</th>
                                                <th style = "width: 5%;">Banco</th>
                                                <th style = "width: 5%;">Direcci&oacuten Instalaci&oacuten</th>
                                                <th style = "width: 5%;">Estado</th>
                                                <th style = "width: 5%;">Municipio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colspan="3">No hay datos</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div id="ModalSerial" class="modal">
                                    <div id="ModalSerial-content" class="modal-content">
                                        <span id="ModalSerial-close" class="close">&times;</span>
                                        <div style="text-align: center; margin-bottom: 20px;">
                                            <h2>Detalles del POS</h2>
                                        </div>
                                        <div style="display: flex;">
                                            <div style="flex: 1; margin-right: 20px;">
                                                <table id="serialCountTable">
                                                    <tbody></tbody>
                                                </table>
                                            </div>
                                            <div style="width: 150px;">
                                            <img src="" alt="Imagen del POS"> </img>
                                            </div>
                                        </div>    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--footer class="footer pt-3">
                        <div class="container-fluid">
                            <div class="row align-items-center justify-content-lg-between">
                                <div class="col-lg-6 mb-lg-0 mb-4">
                                    <div class="copyright text-center text-sm text-muted text-lg-start">
                                        © <script>
                                        document.write(new Date().getFullYear())
                                        </script>,
                                        made with <i class="fa fa-heart"></i> by
                                        <a href="https://www.inteligensa.com/" class="font-weight-bold"
                                            target="_blank">Creative By Inteligensa</a>
                                        for a better web.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer-->
                </div>
                <!-- AVISA LAS GARANTIAS --->
                <div id="garantiaModal" class="modal">
                    <div id="garantiaModal-content" class="modal-content">
                        <span id="garantiaModal-close" class="close">&times;</span>
                        <h2 id="garantiaModal-titulo">¡Alerta de Garantía!</h2>
                        <p id="garantiaModal-mensaje"></p>
                    </div>
                </div>
                <!-- AVISA LAS GARANTIAS --->
            </main>
        </div>
        <div class="fixed-plugin">
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
                    <!-- End Toggle Button -->
                </div>
                <hr class="horizontal dark my-1">
                <div class="card-body pt-sm-3 pt-0 overflow-auto">
                    <!-- Sidebar Backgrounds -->
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
                    <!-- Sidenav Type -->
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
                    <!-- Navbar Fixed -->
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
        </div>

        
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

        <!-- Chart -->
        <script src="<?php echo APP;?>app/plugins/chart.js/chart.js"></script>
        <script src="<?php echo APP;?>app/plugins/chart.js/chart.min.js"></script>

        <!--  SweetAlert   -->
        <script src="<?php echo APP;?>app/plugins/sweetalert2/sweetalert2.js"></script>
        <script src="<?php echo APP;?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

        <!--MASCARAS JQUERY-->
        <script src = "<?php echo APP;?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>

        <!-- Custom scripts for all pages-->
        <script src="<?php echo APP;?>app/plugins/js/sb-admin-2.min.js"></script>
    
        <script src="<?php echo APP;?>app/views/Tecnico/consulta_rif/js/frontEnd.js"></script>

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
