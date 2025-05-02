<?php
//var_dump($_SESSION['usuario']);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
    <link id="pagestyle" rel="stylesheet"  href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
    <link id="pagestyle" rel="stylesheet"  href="<?php echo APP; ?>app/plugins/css/navbar/styleGeneral.css" />
    <link id="pagestyle" rel="stylesheet"  href="<?php echo APP; ?>app/plugins/css/navbar/desktop/form.css" />
    <script>
        const ENDPOINT_BASE = '<?php echo IP; ?>';
        const APP_PATH = '<?php echo APP_BASE_PATH; ?>';
    </script>
</head>

<body class="g-sidenav-show bg-gray-100">
    <aside
        class="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-1"
        id="sidenav-main">
        <div class="sidenav-header">
            <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
                aria-hidden="true" id="iconSidenav"></i>
            <a class="navbar-brand m-0" href=" https://demos.creative-tim.com/argon-dashboard/pages/dashboard.html "
                target="_blank">
                <img src="<?php echo APP; ?>app/public/img/login/Logo.png" width="26px" height="26px"
                    class="navbar-brand-img h-100" alt="main_logo">
                <span style="color:#fff;" class="ms-1 font-weight-bold">Airan Bracamonte</span><br>
                <span style="color:#fff;" class="ms-5 font-weight-bold">Tecnico<br>
            </a>
        </div>
        <hr class="horizontal dark mt-0">
        <div class="collapse navbar-collapse w-auto " id="sidenav-collapse-main">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" id="inicio-link" href="dashboard2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-laptop"
                            viewBox="0 0 16 16">
                            <path
                                d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5" />
                        </svg>
                        <span class="nav-link-text ms-3">Inicio</span>
                    </a>
                </li>
                <li class="nav-item">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="crearTicketDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                            <path
                                d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
                        </svg>
                        <span class="nav-link-text ms-3">Crear Ticket</span>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="crearTicketDropdown">
                        <li><a class="dropdown-item" href="#" data-value="Soporte POS">Soporte POS</a></li>
                        <li><a class="dropdown-item" href="#" data-value="Sustitución de POS">Sustitución de POS</a>
                        </li>
                        <li><a class="dropdown-item" href="#" data-value="Préstamo de POS">Préstamo de POS</a></li>
                        <li><a class="dropdown-item" href="#" data-value="Desafiliación de POS">Desafiliación de POS</a>
                        </li>
                        <li><a class="dropdown-item" href="#" data-value="Migración de Bancos">Migración de Bancos</a>
                        </li>
                        <li><a class="dropdown-item" href="#" data-value="Cambio de Razón Social">Cambio de Razón
                                Social</a></li>
                    </ul>
                </li>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="rif-link" href="consulta_rif">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-search" viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                        <span class="nav-link-text ms-3">Consultar RIF</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="estadisticas-link" href="../pages/profile.html">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5" />
                        </svg>
                        <span class="nav-link-text ms-3">Estadisticas Mis Tickets</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="cerrar-link" href="cerrar_session">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                            <path fill-rule="evenodd"
                                d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                        </svg>
                        <span class="nav-link-text ms-3">Cerrar Secci&oacuten</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="cerrar-link" href="gestionusers">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-person-gear" viewBox="0 0 16 16">
                            <path
                                d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                        </svg>
                        <span class="nav-link-text ms-3">Gestion Usuario</span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
    <div id="miModal" class="modal" style="background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px);">
        <div class="modal-contenido">
            <span class="cerrar">&times;</span>
            <div id="contenidoModal" style="margin-left: 59px;">
                <form id="miFormulario">
                    <div id="detalle1">
                        <h2 id="title2">Falla Nivel 2</h2><br>
                        <div><br>
                            <label for="FallaSelect2">Falla Descrita Por el Cliente</label>
                            <div id="FallaSelect2Container">
                                <select id="FallaSelect2" name="FallaSelect2">
                                    <option></option>
                                </select>
                            </div><br>
                        </div>
                        <div style=" display: flex; flex-direction: column;">
                            <label for="serialInputDetalle1">RIF cliente</label>
                            <input type="text" onchange="checkRif()" id="InputRif" placeholder="JV123456789">
                            <p id="rifMensaje"></p>
                        </div>
                        <div>
                            <label for="serialSelect">Seriales de POS:</label>
                            <div id="serialSelectContainer">
                                <select id="serialSelect" name="serialSelect"></select>
                            </div><br>
                        </div>
                        <div>
                            <label for="AsiganrCoordinador">Asignar a Coordinador</label>
                            <div id="AsiganrCoordinadorContainer">
                                <select id="AsiganrCoordinador" name="AsiganrCoordinador"></select>
                            </div><br>
                        </div>
                        <div class="contenedor-fechas">
                            <div>
                                <label for="ultimoTicketInput">Fecha del Último Ticket:</label>
                                <input style="width: 50%;" type="text" id="ultimateTicketInput" readonly>
                                <div id="resultadoGarantiaReingreso"></div>
                            </div><br>

                            <div>
                                <label for="InputFechaInstall">Fecha de Instalaci&oacuten POS:</label>
                                <input style="width: 50%;" type="text" id="InputFechaInstall" readonly>
                                <div id="resultadoGarantiaInstalacion"></div>
                            </div>
                        </div><br>
                        <br><label style="margin-left: 30%; width: 85px; margin-top: 27px; position: relative; display: block; margin-bottom: -14px;" for="FallaSelect1">Nivel Falla</label>
                        <div id="FallaSelectContainer1">
                            <select style="margin-left: 116%; width: 172px;" id="FallaSelectt2" name="FallaSelect1">
                                <option value="2">Nivel 2</option>
                            </select>
                        </div>
                        <br>
                        <div style="display: flex; flex-direction: column; margin-top: -24%;">
                            <div>
                                <div style="display: flex; align-items: center;">
                                    <button id="DownloadEnvi">Cargar PDF Envio</button>
                                    <input id="EnvioInput" type="file" style="display: none; margin-left: 10px;"
                                        accept="application/pdf, image/jpeg, image/jpg">
                                    <div id="anticipoStatus"></div>
                                </div>
                            </div><br>
                            <div>
                                <div style="display: flex; align-items: center;">
                                    <button id="DownloadExo">Cargar Exoneracion</button>
                                    <input id="ExoneracionInput" type="file" style="display: none; margin-left: 10px;"
                                        accept="application/pdf, image/jpeg, image/jpg">
                                    <div id="exoneracionStatus"></div>
                                </div>
                            </div><br>
                            <div>
                                <div style="display: flex; align-items: center;">
                                    <button id="DownloadAntici">Cargar PDF Anticipo</button>
                                    <input id="AnticipoInput" type="file" style="display: none; margin-left: 10px;"
                                        accept="application/pdf, image/jpeg, image/jpg">
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
                        <input type="hidden" id="id_user" name="userId" value="<?php echo $_SESSION['id_user']; ?>">
                    </div>
                </form>
                <div>
                    <button id="SendForm2">Cargar</button>
                </div>
            </div>
        </div>
    </div>
    <div id="nivelFallaModal" class="modal">
        <div class="modal-contenido">
            <span class="cerrar1">&times;</span>
            <h2>¿Cuál es el nivel de la falla?</h2>
            <div style="text-align: center;">
                <button value="1" id="nivel1Btn">Nivel 1</button>
                <button value="2" id="nivel2Btn">Nivel 2</button>
            </div>
        </div>
    </div>

    <div id="miModal1" class="modal">
        <div class="modal-contenido1">
            <span class="cerrar1">&times;</span>
            <div class="nivel1modal" id="contenidoModal2">
                <div>
                    <h2 id="title1">Falla Nivel 1</h2><br>
                    <label for="FallaSelect1">Falla Descrita Por el Cliente</label>
                    <div id="FallaSelect1Container">
                        <select id="FallaSelect1" name="FallaSelect1">
                        </select>
                    </div><br>
                    <label for="serialInputDetalle1">RIF cliente</label>
                    <input type="text" onchange="checkRif1()" id="InputRif1" placeholder="JV123456789">
                    <p id="rifMensaje1"></p>
                    <label for="serialSelect">Seriales de POS:</label>
                    <div id="serialSelectContainer">
                        <select id="serialSelect1" name="serialSelect">
                        </select>
                    </div><br>
                    <label for="FallaSelect">Nivel Falla</label>
                    <div id="FallaSelectContainer">
                        <select id="FallaSelectt1" name="FallaSelect">
                            <option value="1">Nivel 1</option>
                        </select>
                    </div>
                    <input type="hidden" id="id_user" name="userId" value=" <?php echo $_SESSION['id_user']; ?> ">
                    <button id="SendForm1" onclick="SendDataFailure1();">Cargar</button>
                    <table id="serialCountTableDetalle1">
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!--JQUERY-->
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>

    <!-- Bootstrap-->
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>

    <!--   Core JS Files   -->
    <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>

    <!-- Datatable -->
    <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/datatables/datatables.js"></script>

    <!-- Chart -->
    <script src="<?php echo APP; ?>app/plugins/chart.js/chart.js"></script>
    <script src="<?php echo APP; ?>app/plugins/chart.js/chart.min.js"></script>

    <!--  SweetAlert   -->
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

    <!--MASCARAS JQUERY-->
    <script src="<?php echo APP; ?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="<?php echo APP; ?>app/plugins/js/sb-admin-2.min.js"></script>

    <script src="<?php echo APP; ?>app/core/components/navbar/js/frontEnd1.js"></script>
</body>

</html>