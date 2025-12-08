<?php
function mi_navbar() {}

require 'app/footer.php';

?>
<!DOCTYPE html>
<lang="en">

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
        <link rel="icon" type="image/png" href="../assets/img/favicon.png">
        <title>
            <?php echo tituloPagina; ?>
        </title>
        <!--     Fonts and icons     -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <!-- Nucleo Icons -->
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/General.css" />

        <!-- CSS Files -->
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/dashboard.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/DataTable/dataTables.min.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/DataTable/datatable.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo APP;?>DataTable/buttons.dataTables.min1.css">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.2.3/css/buttons.dataTables.min.css"/>

        <style>
            #rifTipo {
                width: auto;
                max-width: 80px;
                padding: 0.5rem 0.75rem;
                font-size: 1rem;
                height: auto;
                -webkit-appearance: none;
                /* Elimina la apariencia nativa en navegadores WebKit */
                -moz-appearance: none;
                /* Elimina la apariencia nativa en Firefox */
                appearance: none;
                /* Elimina la apariencia nativa en otros navegadores */
                background-image: url('data:image/svg+xml;utf8,<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>');
                background-repeat: no-repeat;
                background-position: right 0.5rem center;
                background-size: 1em;
                border-radius: 0.25rem;
                /* Mantén o ajusta el radio del borde */
                border: 1px solid #ced4da;
                /* Mantén o ajusta el color del borde */
                color: #495057;
                /* Mantén o ajusta el color del texto */
            }

            /* Opcional: Para eliminar el espaciado extra en algunos navegadores */
            #rifTipo::-ms-expand {
                display: none;
            }

            div.dataTables_wrapper div.dataTables_length label {
                font-weight: bold;
                /* Ejemplo: Texto en negrita */
                color: #333;
                /* Ejemplo: Color del texto */
                margin-right: 10px;
                /* Ejemplo: Espacio a la derecha del label */
                margin-top: 23px;
            }

            /* Estilizar el select dropdown del lengthMenu */
            div.dataTables_wrapper div.dataTables_length select {
                border: 1px solid #ccc;
                /* Ejemplo: Borde */
                border-radius: 5px;
                /* Ejemplo: Bordes redondeados */
                padding: 5px 10px;
                /* Ejemplo: Espaciado interno */
                font-size: 0.9em;
                /* Ejemplo: Tamaño de la fuente */
                width: 29%;
            }

            /* Estilizar el label "Buscar:" */
            div.dataTables_wrapper div.dataTables_filter label {
                font-weight: bold;
                /* Ejemplo: Texto en negrita */
                color: #333;
                /* Ejemplo: Color del texto */
                margin-right: 0.5em;
                /* Ejemplo: Espacio a la derecha del label */
                margin-left: -100%;
            }

            /* Estilizar el input de búsqueda */
            div.dataTables_wrapper div.dataTables_filter input[type="search"] {
                border: 1px solid #ccc;
                /* Ejemplo: Borde */
                border-radius: 0.25rem;
                /* Ejemplo: Bordes redondeados */
                padding: 0.375rem 0.75rem;
                /* Ejemplo: Espaciado interno */
                font-size: 1rem;
                /* Ejemplo: Tamaño de la fuente */
                color: #495057;
                /* Ejemplo: Color del texto del input */
                background-color: #fff;
                /* Ejemplo: Color de fondo del input */
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                /* Ejemplo: Transiciones suaves */
                margin-top: 18px;
            }

            /* Estilizar el input de búsqueda al enfocarlo */
            div.dataTables_wrapper div.dataTables_filter input[type="search"]:focus {
                color: #495057;
                background-color: #fff;
                border-color: #007bff;
                /* Ejemplo: Color del borde al enfocar */
                outline: 0;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                /* Ejemplo: Sombra al enfocar */
            }

            #rifCountTable {
                width: 100% !important;
            }

            #rifCountTable th,
            #rifCountTable td {
                white-space: nowrap;
                overflow: hidden;
                /* max-width: 150px; /* ajusta este valor según tus necesidades */
            }

            .dataTables_wrapper {
                width: 100%;
                overflow-x: 100px;
            }

            .dataTables_scrollBody {
                overflow-x: auto;
                overflow-y: auto;
                border-bottom: 1px solid #ddd;
            }

            /* Estilos para columnas específicas si es necesario */
            #rifCountTable th:nth-child(1),
            #rifCountTable td:nth-child(1) {
                min-width: 50px;
                /* ID Ticket */
            }

            #rifCountTable th:nth-child(2),
            #rifCountTable td:nth-child(2) {
                min-width: 100px;
                /* Create Ticket */
            }

            /* Añade más estilos específicos para otras columnas según sea necesario */

            #rifCountTable tbody tr {
                margin-bottom: 5px;
                /* Ajusta este valor según necesites */
            }

 

            .date-input-container {
                display: flex;
                gap: 2rem; /* Espacio entre los inputs */
                padding: 2.5rem;
                border-radius: 1rem;
                /* box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); // Sombra opcional */
            }

            .date-input-wrapper {
                position: relative;
            }

            input[type="text"] {
                padding: 1rem 1.5rem; /* Más padding */
                border: none; /* Sin borde por defecto */
                border-radius: 0.75rem; /* Bordes más redondeados */
                font-size: 1.25rem; /* Texto más grande */
                width: 200px; /* Ancho fijo para cada input */
                text-align: center;
                background-color: #ffffff; /* Fondo blanco */
                color: #333;
                outline: none; /* Quita el outline por defecto en focus */
                transition: box-shadow 0.2s ease-in-out;
            }

            input[type="text"]:focus {
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4); /* Sombra azul al enfocar */
            }

            .error-message {
                color: #ef4444; /* Rojo para mensajes de error */
                font-size: 0.875rem;
                margin-top: 0.5rem;
                text-align: center;
                position: absolute;
                width: 100%;
                left: 0;
            }

            #inputsDate{
                margin-left: 10%;
                margin-top: -5%;
            }

            /* Estilos para la palabra de bienvenida */
            #welcomeMessage h1 {
                font-size: 2.8rem; /* Tamaño de letra más grande */
                color: transparent; 
                font-family: 'Poppins', sans-serif; /* Un tipo de letra moderno y limpio */
                font-weight: 600; /* Texto más audaz */
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Sombra sutil para la letra */
                text-shadow: 2px 35px 0px rgba(0, 0, 0, 0.1);
                letter-spacing: 1px; /* Espaciado entre letras para un mejor look */
                line-height: 1.4; /* Espaciado de línea para que las palabras no se amontonen */
                margin-top: 42%;
                position: fixed;
                margin-left: 15%;
            }

            #btn-excel-modern-id {
                background: linear-gradient(45deg, #217346, #28a745) !important;
                color: white !important;
                border: 2px solid #217346 !important;
                border-radius: 25px !important;
                padding: 12px 24px !important;
                font-weight: 700 !important;
                font-size: 13px !important;
                box-shadow: 0 8px 25px rgba(33, 115, 70, 0.25) !important;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                position: relative !important;
                overflow: hidden !important;
            }

            #btn-excel-modern-id::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: -100% !important;
                width: 100% !important;
                height: 100% !important;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
                transition: left 0.5s !important;
            }

            #btn-excel-modern-id:hover::before {
                left: 100% !important;
            }

            #btn-excel-modern-id:hover {
                background: linear-gradient(45deg, #1e6b3d, #217346) !important;
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 12px 35px rgba(33, 115, 70, 0.4) !important;
                border-color: #1e6b3d !important;
            }

            #btn-excel-modern-id:active {
                transform: translateY(-1px) scale(1.02) !important;
            }

            /* Estilos para el botón PDF */
            #btn-pdf-modern-id {
                background: linear-gradient(45deg, #dc3545, #c82333) !important;
                color: white !important;
                border: 2px solid #dc3545 !important;
                border-radius: 8px !important;
                padding: 10px 16px !important;
                font-weight: 600 !important;
                font-size: 14px !important;
                box-shadow: 0 4px 15px rgba(220, 53, 69, 0.25) !important;
                transition: all 0.3s ease !important;
            }

            #btn-pdf-modern-id:hover {
                background: linear-gradient(45deg, #c82333, #bd2130) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4) !important;
            }


            div.dataTables_wrapper div.dataTables_filter {
                margin-right: -16%;
            }

            div.dt-buttons{
                margin-left: 2%;
            }

            /* CSS para "Tipo de Búsqueda" con estilo igual al botón azul fosforescente */
            #tipoBusqueda {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
                color: white !important;
                padding: 12px 20px !important;
                border: 2px solid #00d4ff !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                text-align: center !important;
                box-shadow: 0 0 15px rgba(0, 212, 255, 0.6) !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
                margin-bottom: 15px !important;
                position: relative !important;
                overflow: hidden !important;
                display: block !important;
            }

            /* Efecto de brillo fosforescente animado */
            #tipoBusqueda::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent);
                transition: left 0.8s ease-in-out;
                z-index: 1;
            }

            #tipoBusqueda:hover::before {
                left: 100%;
            }

            /* Asegurar que el texto esté por encima del efecto */
            #tipoBusqueda {
                z-index: 2;
                position: relative;
            }

            /* Animación de pulso en el borde azul fosforescente */
           #tipoBusqueda {
                animation: pulse-glow 2.5s infinite ease-in-out;
            }

            @keyframes pulse-glow {
                0% {
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
                    border-color: #00d4ff;
                }
                50% {
                    box-shadow: 0 0 25px rgba(0, 212, 255, 0.9), 0 0 35px rgba(0, 212, 255, 0.5);
                    border-color: #00f0ff;
                }
                100% {
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
                    border-color: #00d4ff;
                }
            }

            /* Efecto hover adicional */
            #tipoBusqueda:hover {
                transform: translateY(-2px);
                transition: transform 0.3s ease;
                box-shadow: 0 0 30px rgba(0, 212, 255, 0.8), 0 5px 15px rgba(0, 0, 0, 0.2) !important;
            }

            /* Versión sin animaciones si prefieres más sencillo */
            /*
            .col-lg-16 {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
                color: white !important;
                padding: 12px 20px !important;
                border: 2px solid #00d4ff !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                text-align: center !important;
                box-shadow: 0 0 15px rgba(0, 212, 255, 0.6) !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
                margin-bottom: 15px !important;
            }
            */
        </style>
    </head>
    <body id="fondo" class="g-sidenav-show bg-gray-100">
    <input type="hidden" name="idtipouser" id="idtipouser" value="<?php echo $_SESSION['id_rol']?>">
    <input type="hidden" id="Full_name" value="<?php echo $_SESSION['nombres']; ?> <?php echo $_SESSION['apellidos']; ?>">


        <div class="min-height-300 bg-dark position-absolute w-100"></div>
        <div class="d-lg-none fixed-top bg-dark p-2">
            <button class="btn btn-dark" id="filter-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                    class="bi bi-list-task" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z" />
                    <path
                        d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z" />
                    <path fill-rule="evenodd"
                        d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z" />
                </svg>
            </button>
        </div>
        <?php require_once 'app/core/components/navbar/index.php';
        mi_navbar(); ?>
         <div class="min-height-300 bg-dark position-absolute w-100"></div>
        <main class="main-content position-relative border-radius-lg">
            <div class="container-fluid py-4">
                <div id="Row" class="row mt-4">
                    <div class="cord">
                        <div class="d-flex justify-content-start mt-2 flex-wrap" style="margin-left: 45%; margin-top: -2%;">
                            <!-- <button type="button" class="btn btn-outline-primary me-2 btn-custom" id="buscarPorRangoBtn">Buscar por Rango de Fecha</button>
                            <button type="button" class="btn btn-outline-primary me-2 btn-custom" id="buscarPorSerialBtn">Buscar por Serial</button>
                            <button type="button" class="btn btn-outline-primary me-2 btn-custom" id="buscarPorRifBtn">Buscar Por Rif</button>
                            <button type="button" class="btn btn-outline-primary btn-custom" id="buscarPorRegionsBtn">Buscar Por Region</button>
                            <button type="button" class="btn btn-outline-primary me-2 btn-custom" id="buscarPorStatusBtn">Buscar Por Estatus</button> -->
                            <div>
                              <div id = "tipoBusqueda" class="col-lg-16">Tipo de Busqueda:</div>
                              <br>
                              <div class="col-lg-16">
                              <select class="form-control" name="regiones" id="regiones" required >
                                <option value="0">Seleccione</option>
                                    <option value="1">Rango de Fecha</option>
                                    <option value="2">Serial</option>
                                    <option value="3">Rif</option>
                                    <option value="4">Region</option>
                                    <option value="5">Estatus</option>
                                    <option value="6">Bancos</option>
                                </select>
                              </div>
                              <br>
                            </div>
                        </div>

        <div id="SearchRif" class="mb-3 d-flex align-items-center">
            <div id="welcomeMessage" class="d-flex justify-content-center align-items-center">
                <h1 class="text-center">Ingrese los datos del Ticket</h1>
            </div>
            
            <div id="SearchRifdiv" class="d-flex align-items-center" style="position: absolute; margin: 2%; margin-left: 17%;">
                <select class="form-select me-2" id="rifTipo" style="width: auto; max-width: 80px; padding: 0.5rem 0.75rem; font-size: 1rem; height: auto; display: none; margin-left: -114%; position: absolute;">
                    <option value="J">J</option>
                    <option value="V" selected>V</option>
                    <option value="E">E</option>
                    <option value="G">G</option>
                </select>
                <input type="text" class="form-control me-2" id="rifInput" placeholder="JV123456789" style="display: none;">
                <button type="button" class="btn btn-primary" onclick="SendRif()" id="buscarRif" style="display: none;  margin-top: 5px;">Buscar</button><br>
            </div>

            <input type="text" class="form-control me-2" id="serialInput" placeholder="10000CT27000041" style="display: none; margin-left: -3%; margin-top: -2%;" maxlength="24">
            <button type="button" class="btn btn-primary" onclick="SendSerial()" id="buscarSerial" style="display: none; margin-top: -9%; margin-left: 36%;">Buscar</button>

            <input type="text" class="form-control me-2" id="RazonInput" placeholder="Mi Empresa, 2018, C.A." style="display: none;">
            <!-- Asegurarse de que el botón buscarRazon exista si se usa en JS -->
            <button type="button" class="btn btn-primary" onclick="SendRazon()" id="buscarRazon" style="display: none;">Buscar</button>

            <div id="inputsDate" class="date-input-container" style="display: none;">
                <div class="date-input-wrapper">
                    <input type="date" id="date-ini" max="<?php  echo date("Y-m-d");?>">
                    <div id="errorDateIni" class="error-message"></div>
                </div>

                <div class="date-input-wrapper">
                    <input type="date" id="date-end"  max="<?php  echo date("Y-m-d");?>">
                    <div id="errorDateEnd" class="error-message"></div>
                </div>
                <button type="button" class="btn btn-primary" onclick="SendRango()" id="buscarRango" style="height: 10%;">Buscar</button>
            </div>

            <div id="InputSearchReg" class="d-flex align-items-center" style="margin-left: 14%;">
                <select id="SelectRgions" class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" style="display: none; width: 203px; max-width: 200px; padding: 0.5rem 0.75rem; font-size: 1rem; height: auto">
                </select>
                <button type="button" class="btn btn-primary" onclick="SendRegions()" id="buscarRegions" style="display: none; margin-top: 4px; margin-left: 13px;">Buscar</button>
            </div>

            <div id = "SelectStatusInput" class="d-flex align-items-center" style = "margin-top: -2%; margin-left: 14%;">
                <select id="SelectStatus" class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" style="display: none; width: 203px; max-width: 200px; padding: 0.5rem 0.75rem; font-size: 1rem; height: auto">
                </select>
                <button type="button" class="btn btn-primary" onclick="SendStatus()" id="buscarStatus" style="display: none; margin-top: 4px; margin-left: 13px;">Buscar</button>
            </div>

            <div id = "SelectBancosInput" class="d-flex align-items-center" style = "margin-top: -2%; margin-left: 13%;">
                <select id="SelectBancos" class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" style="display: none; width: 203px; max-width: 200px; padding: 0.5rem 0.75rem; font-size: 1rem; height: auto">
                </select>
                <button type="button" class="btn btn-primary" onclick="SendBancos()" id="buscarBancos" style="display: none; margin-top: 4px; margin-left: 13px;">Buscar</button>
            </div>

        </div>
    </div>
        <div class="card" style="display: none;">
                <table id="rifCountTable" style="display: none;" class="background-users-table">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td colspan="15">No hay datos</td>
                        </tr>
                    </tbody>
                </table>
            </div>
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

        <!-- Github buttons -->
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        <!-- Control Center for Soft Dashboard: parallax effects, scripts for the example pages etc -->
        <!-- Bootstrap core JavaScript-->
        <!--JQUERY-->
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>

        <!-- Bootstrap-->
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>

        <!--   Core JS Files   -->
        <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/public/img/dashboard/js/argon-dashboard.min.js?v=2.1.0"></script>

        <!-- Datatable -->
        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.js"></script>
        <script src = "<?php echo APP;?>js/Datatablebuttons5.js"></script>
        <script src = "<?php echo APP;?>js/Datatablebuttons.min.js"></script>
        <script src = "<?php echo APP;?>js/Datatablebuttonsprint.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/buttons.flash.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/pdfmake.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/jszip.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/vfs_fonts.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/buttons.html5.min.js"></script>

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
        <script src="<?php echo APP; ?>app/views/consulta_ticket/js/frontEnd.js"></script>
        <script src="<?php echo APP; ?>app/plugins/flatpickr-4.6.13/dist/flatpickr.js"></script>

        <?php
            if (isset($this->js)) {
                foreach ($this->js as $js) {
                    echo '<script type="text/javascript" src="' . APP . 'app/views/' . $js . '"></script>';
                }
            }
        ?>
        
        <!-- PARTE DEL CODIGO DE SESSION EXPIRADAS-->
            <?php
                require 'app/footer.php';
            ?>
        <!-- END PARTE DEL CODIGO DE SESSION EXPIRADAS-->
    </body>
</html>