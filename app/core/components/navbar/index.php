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
    <link id="pagestyle" rel="stylesheet"
        href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
    <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/navbar/styleGeneral.css" />
    <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/navbar/desktop/form.css" />

    <script>
        const ENDPOINT_BASE = '<?php echo ENDPOINT_BASE_DYNAMIC; ?>';
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
                <span style="color:#fff;" class="ms-1 font-weight-bold"><?php echo $_SESSION['nombres']?> <?php echo $_SESSION['apellidos']?></span><br>
                <span style="color:#fff;" class="ms-5 font-weight-bold"><?php echo $_SESSION['name_rol']?><br>
            </a>
        </div>
        <hr class="horizontal dark mt-0">
        <div class="collapse navbar-collapse w-auto " id="sidenav-collapse-main">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" id="inicio-link" href="dashboard">
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
                    <a class="nav-link" id="assignment-ticket" href="asignar_tecnico">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-tools" viewBox="0 0 16 16">
                            <path
                                d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z" />
                        </svg>
                        <span class="nav-link-text ms-3">Asignar Ticket a Técnico</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="assignment-ticket" href="asignar_tecnico">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-workspace" viewBox="0 0 16 16">
                            <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                            <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"/>
                        </svg>
                        <span class="nav-link-text ms-3">Técnico</span>
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
            </ul>
        </div>
    </aside>

    <!--MODAL FALLA NIVEL 2-->
        <div class="modal" id="miModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1"
            style="background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px);">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalToggleLabel">Falla Nivel 2</h1>
                        <button id="cerraModal2" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="margin-left: 0;">
                        <form id="miFormulario" class="row g-3">
                            <div id="detalle1" class="col-md-6">
                                <div><br>
                                    <label for="FallaSelect2" class="form-label">Falla Descrita Por el Cliente</label>
                                    <div id="FallaSelect2Container">
                                        <select id="FallaSelect2" name="FallaSelect2" class="form-select">
                                            <option></option>
                                        </select>
                                    </div><br>
                                </div>
                                <div style=" display: flex; flex-direction: column;">
                                    <label id="LabelRifModal2" for="serialInputDetalle1" class="form-label">RIF cliente</label>
                                    <input type="text" onchange="checkRif()" id="InputRif" class="form-control" placeholder="JV123456789">
                                    <p style="margin-left: 143%; width: 100%;" id="rifMensaje"></p>
                                </div>
                                <div>
                                    <label id="LabelSerial" class="form-label" for="serialSelect">Seriales de POS:</label>
                                    <div id="serialSelectContainer">
                                        <select class="form-select" id="serialSelect" name="serialSelect"></select>
                                    </div><br>
                                </div>
                                <div>
                                    <label id="LabelCoordinador" class= "form-label" for="AsiganrCoordinador">Asignar a Coordinador</label>
                                    <div id="AsiganrCoordinadorContainer">
                                        <select id="AsiganrCoordinador" name="AsiganrCoordinador" class="form-select"></select>
                                    </div><br>
                                </div>
                                <div class="contenedor-fechas">
                                    <div>
                                        <label class="form-label" id="FechaLast" for="ultimoTicketInput">Fecha del Último Ticket:</label>
                                        <input class="form-control" type="text" id="ultimateTicketInput" readonly>
                                        <div style=" margin-left: 5%;" id="resultadoGarantiaReingreso"></div>
                                    </div><br>

                                    <div>
                                        <label class="form-label" id="LabelFechaInst" for="InputFechaInstall">Fecha de Instalaci&oacuten POS:</label>
                                        <input class="form-control" type="text" id="InputFechaInstall" readonly>
                                        <div style="margin-left: 31%;" id="resultadoGarantiaInstalacion"></div>
                                    </div>
                                </div><br>
                                <div id="FallaSelectContainer1">
                                    <select class="form-select" style="margin-left: 116%; width: 172px; display: none;" id="FallaSelectt2" name="FallaSelect1">
                                        <option value="2">Nivel 2</option>
                                    </select>
                                </div>
                                <br>
                                <div id="DownloadsBotons">
                                    <div>
                                        <div id="botonCargaPDFEnv">
                                            <button id="DownloadEnvi" class="btn btn-outline-secondary btn-sm">Cargar PDF Envio</button>
                                            <input class="form-control" id="EnvioInput" type="file" style="display: none; margin-left: 10px;"
                                                accept="application/pdf, image/jpeg, image/jpg">
                                            <div id="anticipoStatus"></div>
                                        </div>
                                    </div><br>
                                    <div>
                                        <div style="display: flex; align-items: center; margin-bottom: 6%;">
                                            <button id="DownloadExo" class="btn btn-outline-secondary btn-sm">Cargar Exoneracion</button>
                                            <input class="form-control" id="ExoneracionInput" type="file"
                                                style="display: none; margin-left: 10px;"
                                                accept="application/pdf, image/jpeg, image/jpg">
                                            <div id="exoneracionStatus"></div>
                                        </div>
                                    </div><br>
                                    <div>
                                        <div style="display: flex; align-items: center; margin-bottom: 2%;">
                                            <button class="form-control" id="DownloadAntici" class="btn btn-outline-secondary btn-sm">Cargar PDF Anticipo</button>
                                            <input id="AnticipoInput" type="file" style="display: none; margin-left: 10px;"
                                                accept="application/pdf, image/jpeg, image/jpg">
                                            <div id="envioStatus"></div>
                                        </div>
                                    </div>
                                </div>
                                <div id="RightSelects">
                                    <div>
                                        <label class="form-label" for="selectAdicional1">Opción 1:</label>
                                        <select class="form-select" id="selectAdicional1" name="selectAdicional1">
                                            <option value="">Seleccionar</option>
                                            <option value="valor1">Valor 1</option>
                                            <option value="valor2">Valor 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label" for="selectAdicional2">Opción 2:</label>
                                        <select class="form-select" id="selectAdicional2" name="selectAdicional2">
                                            <option value="">Seleccionar</option>
                                            <option value="valorA">Valor A</option>
                                            <option value="valorB">Valor B</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label" for="selectAdicional3">Opción 3:</label>
                                        <select class="form-select" id="selectAdicional3" name="selectAdicional3">
                                            <option value="">Seleccionar</option>
                                            <option value="itemX">Item X</option>
                                            <option value="itemY">Item Y</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label" for="selectAdicional4">Opción 4:</label>
                                        <select class="form-select" id="selectAdicional4" name="selectAdicional4">
                                            <option value="">Seleccionar</option>
                                            <option value="uno">Uno</option>
                                            <option value="dos">Dos</option>
                                        </select>
                                    </div>
                                </div>
                                    
                                    <!--div class="contenedor-triangulo">
                                            <div class="triangulo"></div>
                                            <div class="triangulo"></div>
                                            <div class="triangulo"></div>
                                        </div-->

                                    <!--div id="animation" class="contenedor-triangulo1">
                                            <div class="triangulo1"></div>
                                            <div class="triangulo1"></div>
                                            <div class="triangulo1"></div>
                                        </div-->
                                <input type="hidden" id="id_user" name="userId" value = <?php echo $_SESSION['id_user']?>>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button id="SendForm2" class="btn btn-primary">Guardar</button>
                        <button id="buttonCerrar2" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    <!--END MODAL FALLA NIVEL 2-->

    <!--MODAL SELECIONAR TIPO DE FALLA -->
    <div class="modal" id="nivelFallaModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div id="NivelFalla-div" class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="nivelFallaModalLabel">¿Cuál es el nivel de la falla?</h1>
                    <button type="button" id="cerrar-icon" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>

                </div>
                <div class="modal-body text-center">
                    <button value="1" id="nivel1Btn" type="button" class="btn btn-success me-2"
                        data-bs-dismiss="modal">Nivel 1</button>
                    <button value="2" id="nivel2Btn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Nivel
                        2</button>
                </div>
                <div class="modal-footer">
                    <button id="cerrar" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!--END MODAL SELECCIONAR TIPO DE FALLA -->

    <!--MODAL FALLA NIVEL 1-->
        <div class="modal" id="miModal1" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1"
            data-bs-backdrop="static" data-bs-keyboard="false">
            <div id="Modal2-div" class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalToggleLabel">Falla Nivel 1</h1>
                        <button id="cerrar-iconNivel1" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
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
                            <input type="hidden" id="id_user" name="userId">
                            <button id="SendForm1" onclick="SendDataFailure1();" class="btn btn-primary">Guardar</button>
                            <table id="serialCountTableDetalle1" class="table">
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="buttonCerrar" type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    <!--END MODAL FALLA NIVEL 1-->

    <!--JQUERY-->
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>

    <!-- Bootstrap-->
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.js"></script>

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