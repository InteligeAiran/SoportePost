<?php
function mi_navbar() {}
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
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/consulta_rif/desktop/desktop.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/consulta_rif/mobile/mobile.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/consulta_rif/laptop/laptop.css" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/General.css" />

        <!-- CSS Files -->
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/dashboard.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">
        <link rel="stylesheet" href="<?php echo APP; ?>app/plugins/animate-css/animate.min.css"/>


        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">

        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.2.3/css/buttons.dataTables.min.css"/>


        <style>
           /* Estilos para el botón Excel usando ID */
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
                margin-top: 1%;
            }

            div.dt-buttons{
                margin-left: 2%;
            }

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

            #createTicketFalla1Btn,
            #createTicketFalla2Btn,
            #closeDetailsPanelBtn{
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s ease;
                display: none;
            }

            #createTicketFalla2Btn {
                background-color: #3498db; /* Un azul más vibrante, similar al de los enlaces activos del navbar */
                color: #ffffff; /* Texto blanco */
                border: 1px solid #3498db;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }

            #createTicketFalla1Btn {
                background-color: #0056b3; 
            }

            #createTicketFalla1Btn:hover {
                background-color: #004494; /* A slightly darker shade for hover */
            }

            #createTicketFalla2Btn:hover {
                background-color: #2980b9; /* Un tono más oscuro para el hover */
                border-color: #2980b9;
                color: #f8f9fa; /* Ligeramente más blanco para contraste */            
            }

            #closeDetailsPanelBtn:hover{
                background-color: red;
                color: white;
            }

            tr[id^="status-row-"] th,
            tr[id^="status-row-"] td {
                color: red; /* Color rojo */
                font-weight: bold; /* Opcional: para que se vea más fuerte */
            }

            #rifCountTable .serial-pos-column, #rifCountTable td:nth-child(5) { /* nth-child(5) apunta a la quinta columna (Serial POS) */
                white-space: nowrap; /* Evita que el texto salte de línea */
                overflow: visible;   /* Asegura que el contenido no se corte si se desborda */
                text-overflow: clip; /* Evita los puntos suspensivos (...) */
                /* Asegúrate de que el width sea suficiente o ajústalo con DataTables columns.width */
                width: 150px !important; /* Ajusta este valor según el espacio que necesites. Usa !important si es necesario para sobrescribir. */
                min-width: 150px !important; /* Asegura un ancho mínimo */
            }

            /* Si quieres que los enlaces dentro de esa celda también se vean bien */
            #rifCountTable td:nth-child(5) a {
                white-space: nowrap;
                overflow: visible;
                text-overflow: clip;
            }

            #btnGuardarComponentes{
                color: white;
                background-color: #003594;
            }

            #btnGuardarComponentes:hover{
                background-color: green;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
            }

            #BotonCerrarModal:hover{
                background-color: red;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
            }

            /* Estilos para la palabra de bienvenida */
            #welcomeMessage h1 {
                font-size: 2.8rem; /* Tamaño de letra más grande */
                color: transparent; 
                font-family: 'Poppins', sans-serif; /* Un tipo de letra moderno y limpio */
                font-weight: 600; /* Texto más audaz */
                /*text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Sombra sutil para la letra */
                text-shadow: 2px 35px 0px rgba(0, 0, 0, 0.1);
                letter-spacing: 1px; /* Espaciado entre letras para un mejor look */
                line-height: 1.4; /* Espaciado de línea para que las palabras no se amontonen */
                margin-top: 103%;
                margin-left: 35%;
                position: absolute;
                width: 100%; /* Asegura que ocupe todo el ancho disponible */
            }

            .serial-link {
                color: blue; /* Un azul típico para enlaces */
                text-decoration: underline;
                cursor: pointer;
            }

            /* Estilos para el modal personalizado */
            .custom-swal-popup {
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                border: none;
            }

            .custom-swal-title {
                border-radius: 15px 15px 0 0;
                padding: 20px;
                margin: 0;
            }

            .custom-swal-html {
                padding: 20px;
            }

            /* Icono de advertencia */
            .warning-icon-container {
                display: inline-block;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ffc107, #ff9800);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
            }

            .warning-icon {
                font-size: 40px;
                color: white;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            /* Badge del serial */
            .serial-badge {
                display: inline-block;
                padding: 12px 20px;
                background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                border: 2px solid #2196f3;
                border-radius: 25px;
                color: #1565c0;
                font-size: 16px;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(33, 150, 243, 0.2);
                transition: all 0.3s ease;
            }

            .serial-badge:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
            }

            /* Tarjeta de detalles */
            .ticket-details-card {
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }

            .ticket-details-card .card-header {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-bottom: 1px solid #dee2e6;
                padding: 15px 20px;
            }

            .ticket-details-card .list-group-item {
                padding: 15px 20px;
                border: none;
                border-bottom: 1px solid #f0f0f0;
                transition: background-color 0.2s ease;
            }

            .ticket-details-card .list-group-item:hover {
                background-color: #f8f9fa;
            }

            .ticket-details-card .list-group-item:last-child {
                border-bottom: none;
            }

            /* Labels y valores */
            .detail-label {
                font-weight: 600;
                color: #495057;
                display: flex;
                align-items: center;
            }

            .detail-value {
                font-weight: 600;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 14px;
            }

            .failure-text {
                background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                color: #856404;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                border: 1px solid #ffeaa7;
                max-width: 200px;
                text-align: center;
                word-wrap: break-word;
            }

            /* Alertas mejoradas */
            .alert {
                border-radius: 10px;
                border: none;
                padding: 15px 20px;
            }

            .alert-warning {
                background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                color: #856404;
            }

            .alert-danger {
                background: linear-gradient(135deg, #f8d7da, #f5c6cb);
                color: #721c24;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .custom-swal-popup {
                    width: 95% !important;
                    margin: 10px;
                }
                
                .serial-badge {
                    font-size: 14px;
                    padding: 10px 16px;
                }
                
                .detail-value {
                    font-size: 12px;
                    padding: 6px 10px;
                }
            }
        </style>
    </head>
    <body id="fondo" class="g-sidenav-show bg-gray-100">
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
                        <div class="d-flex justify-content-start mt-2 flex-wrap" style="margin-left: 10%;">
                            <button type="button" class="btn btn-outline-primary me-2 btn-custom" id="buscarPorNombreBtn">Buscar por Razón Social</button>
                            <button type="button" class="btn btn-outline-primary me-2 btn-custom" id="buscarPorSerialBtn">Buscar por Serial</button>
                            <button type="button" class="btn btn-outline-primary btn-custom" id="buscarPorRifBtn">Buscar Por Rif</button>
                        </div>
                        <div id="SearchRif" class="mb-3 d-flex align-items-center">
                            <div id="welcomeMessage" class="d-flex justify-content-center align-items-center">
                                <h1 class="text-center">Ingrese los datos del Cliente</h1>
                            </div>
                            <div id="RifDiv" class="d-flex align-items-center" style="margin-top: 1%; position: fixed; margin-left: 6%;">
                                <select class="form-select me-2" id="rifTipo" style="width: auto; max-width: 80px; padding: 0.5rem 0.75rem; font-size: 1rem; height: auto; display: none;">
                                    <option value="J">J</option>
                                    <option value="V" selected>V</option>
                                    <option value="E">E</option>
                                    <option value="G">G</option>
                                </select>
                                <input type="text" class="form-control me-2" id="rifInput" placeholder="JV123456789" style="display: none;">
                                <button type="button" class="btn btn-primary" onclick="SendRif()" id="buscarRif" style="display: none;">Buscar</button><br>
                            </div>

                            <input type="text" class="form-control me-2" id="serialInput" placeholder="10000CT27000041" style="display: none;" maxlength="24">
                            <button type="button" class="btn btn-primary" onclick="SendSerial()" id="buscarSerial" style="display: none;  margin-top: -9%; margin-left: 45%;">Buscar</button>

                            <input type="text" class="form-control me-2" id="RazonInput" placeholder="Mi Empresa, 2018, C.A." style="display: none;">
                            <button type="button" class="btn btn-primary" onclick="SendRazon()" id="buscarRazon" style="display: none; margin-top: -9%; margin-left: 45%;">Buscar</button>
                        </div><br>
                        <div class="card" style="display: none;">
                            <div class="row">
                                <div class="col-12">
                                    <table id="rifCountTable" class="table table-bordered" style="width: 100%">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%; height: 10px;">ID cliente</th>
                                                <th style="width: 10%;">Raz&oacuten Social</th>
                                                <th style="width: 5%;">RIF</th>
                                                <th style="width: 5%;">Modelo POS</th>
                                                <th style="width: 5%;" class="serial-pos-column">Serial POS</th>
                                                <th style="width: 5%;">Estatus del Equipo</th>
                                                <th style="width: 5%;">N° Afiliaci&oacuten</th>
                                                <th style="width: 5%;">Fecha Instalaci&oacuten</th>
                                                <th style="width: 5%;">Banco</th>
                                                <th style="width: 15%;">Direcci&oacuten Instalaci&oacuten</th>
                                                <th style="width: 5%;">Estado</th>
                                                <th style="width: 5%;">Municipio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colspan="3">No hay datos</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div id="ModalSerial" class="modal">
                                <div id="ModalSerial-content" class="modal-content" style="max-height: 80vh; overflow-y: auto;">
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
                                    <div class="mt-4 w-100 d-flex justify-content-center align-items-center">
                                        <button type="button" class="btn btn-success me-2" id="createTicketFalla1Btn">Crear Ticket Falla 1</button>
                                        <button type="button" class="btn btn-warning" id="createTicketFalla2Btn">Crear Ticket Falla 2</button>
                                    </div>
                                    <div class="mt-3 w-100 d-flex justify-content-center" id="txtDescripcion"></div>
                                    <!--div class="mt-3 w-100 d-flex justify-content-center">
                                        <button type="button" class="btn btn-secondary w-75" id="closeDetailsPanelBtn">Cerrar Detalles</button>
                                    </div-->

                                </div>
                            </div>
                        </div>
                    </div>
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

        <!-- PARA SELECCIONAR LOS COMPONENTES ASOCIADOS AL SERIAL DEL POS -->
            <div class="modal fade" id="modalComponentes" tabindex="-1" aria-labelledby="modalComponentesLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content" style="max-height: 80vh; overflow-y: auto;">
                            <div class="modal-header bg-gradient-primary">
                                <h5 class="modal-title text-white" id="modalComponentesLabel">
                                    <i class="bi bi-box-seam-fill me-2"></i>Lista de Componentes del Dispositivo
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="alert bg-gradient-primary text-white" role="alert">
                                            <i class="bi bi-info-circle me-2"></i>
                                            Selecciona los componentes que deseas cargar para este dispositivo.
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-12">
                                        <div class="table-responsive">
                                            <table class="table table-hover" id="tablaComponentes">
                                                <thead class="table-light">
                                                    <tr>
                                                        <th>
                                                            <input type="checkbox" id="selectAllComponents" class="form-check-input">
                                                        </th>
                                                        <th>Componente</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tbodyComponentes">
                                                    </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mt-3">
                                    <div class="col-12">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span class="text-muted">Componentes seleccionados: </span>
                                                <span id="contadorComponentes" class="badge bg-primary">0</span>
                                            </div>
                                            <div>
                                                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="limpiarSeleccion()">
                                                    <i class="bi bi-arrow-clockwise me-1"></i>Limpiar Selección
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" id="BotonCerrarModal">
                                    <i class="bi bi-x-circle me-1"></i>Cancelar
                                </button>
                                <button type="button" class="btn btn-primary" id="btnGuardarComponentes">
                                    <i class="bi bi-check-circle me-1"></i>Guardar
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
        <!-- END PARA SELECCIONAR LOS COMPONENTES ASOCIADOS AL SERIAL DEL POS -->

        <!--MODAL FALLA NIVEL 2-->
            <div class="modal" id="miModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1"  style="background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalToggleLabel" style = "color: grey;">Falla Nivel 2</h1>
                        </div>
                        <div class="modal-body" style="margin-left: 0; max-height: 70vh; overflow-y: auto;">
                            <form id="miFormulario" class="row g-3">
                                <div id="detalle1" class="col-md-6">
                                    <div><br>
                                        <label for="FallaSelect2" class="form-label">Falla descrita por el cliente</label>
                                        <div id="FallaSelect2Container">
                                            <select id="FallaSelect2" name="FallaSelect2" class="form-select">
                                                <option></option>
                                            </select>
                                        </div><br>
                                    </div>
                                    <div style=" display: flex; flex-direction: column;">
                                        <label id="LabelRifModal2" for="serialInputDetalle1" class="form-label">RIF
                                            cliente</label>
                                        <input type="text" onchange="checkRif()" id="InputRif" class="form-control"
                                            placeholder="JV123456789" disabled>
                                            <input type="hidden" id="InputRazon" class="form-control"disabled>
                                        <p style="margin-left: 143%; width: 100%;" id="rifMensaje"></p>
                                    </div>
                                    <div>
                                        <label id="LabelSerial" class="form-label" for="serialSelect">Seriales de POS:</label>
                                        <div id="serialSelectContainer">
                                            <input type="text" class="form-control" id="serialSelect" name="serialSelect" disabled></input>
                                        </div><br>
                                    </div>
                                    <br>
                                    <div>
                                        <label id="LabelCoordinador" class="form-label" for="AsiganrCoordinador">Asignar a la
                                            Coordinación</label>
                                        <div id="AsiganrCoordinadorContainer">
                                            <select id="AsiganrCoordinador" name="AsiganrCoordinador" class="form-select" style = "width: 103%; margin-left: 7%;">
                                                <option></option>
                                            </select>
                                        </div><br>
                                    </div>
                                    <div class="contenedor-fechas">
                                        <div>
                                            <label class="form-label" id="FechaLast" for="ultimoTicketInput">Fecha del Último
                                                Ticket:</label>
                                            <input class="form-control" type="text" id="ultimateTicketInput" disabled>
                                            <div style=" margin-left: 5%;" id="resultadoGarantiaReingreso"></div>
                                        </div><br>

                                        <div>
                                            <label class="form-label" id="LabelFechaInst" for="InputFechaInstall">Fecha de
                                                Instalaci&oacuten POS:</label>
                                            <input class="form-control" type="text" id="InputFechaInstall" disabled>
                                            <div style="margin-left: 31%;" id="resultadoGarantiaInstalacion"></div>
                                        </div>
                                    </div><br>
                                    <div id="FallaSelectContainer1">
                                        <select class="form-select" style="margin-left: 116%; width: 172px; display: none;"
                                            id="FallaSelectt2" name="FallaSelect1">
                                            <option value="2">Nivel 2</option>
                                        </select>
                                    </div>
                                    <br>

                                    <div class="mb-3"  style="width: 100%; margin-left: 165%; margin-top: 36%;">
                                        <label class="form-label">¿Deseas cargar los documentos ahora?</label>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="uploadOption" id="uploadNow"
                                                value="yes">
                                            <label class="form-check-label" for="uploadNow">Sí</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="uploadOption" id="uploadLater"
                                                value="no" checked>
                                            <label class="form-check-label" for="uploadLater">No (Pendiente por cargar
                                                documentos)</label>
                                        </div>
                                    </div>

                                    <div id="documentUploadOptions" class="mb-3" style = "margin-left: 270%; width: 83%; margin-top: 12%;">
                                        <label class="form-label">Selecciona los documentos a cargar:</label>
                                        <div id = "checkEnvioContainer" class="form-check">
                                            <input class="form-check-input" type="checkbox" id="checkEnvio" value="envio">
                                            <label class="form-check-label" for="checkEnvio"> Documento de Envío</label>
                                        </div>
                                        <div id="checkExoneracionContainer" class="form-check">
                                            <input class="form-check-input" type="radio" id="checkExoneracion" name="documentType" value="exoneracion">
                                            <label class="form-check-label" id="checkExoneracionLabel" for="checkExoneracion">Exoneración</label>
                                        </div>
                                        <div id="checkAnticipoContainer" class="form-check">
                                            <input class="form-check-input" type="radio" id="checkAnticipo" name="documentType" value="anticipo">
                                            <label class="form-check-label" id="checkAnticipoLabel" for="checkAnticipo">Anticipo</label>
                                        </div>
                                    </div>

                                    <div id="DownloadsBotons">
                                        <div id="botonCargaPDFEnv" style="display: none;">
                                            <button id="DownloadEnvi" class="btn btn-outline-secondary btn-sm" type="button">Adjunte Documento Envio</button>
                                            <input class="form-control" id="EnvioInput" type="file"
                                                style="display: none; margin-left: 10px;"
                                                accept="application/pdf, image/jpeg, image/jpg, image/png">
                                            <div id="envioStatus"></div>
                                        </div><br>

                                        <div style="display: flex; align-items: center; margin-bottom: 6%; display: none;"
                                            id="botonCargaExoneracion">
                                            <button id="DownloadExo" class="btn btn-outline-secondary btn-sm"
                                                type="button">Adjunte Documento Exoneracion</button>
                                            <input class="form-control" id="ExoneracionInput" type="file"
                                                style="display: none; margin-left: 10px;"
                                                accept="application/pdf, image/jpeg, image/jpg, image/png">
                                            <div id="exoneracionStatus"></div>
                                        </div><br>

                                        <div style="display: flex; align-items: center; margin-bottom: 2%; display: none;"
                                            id="botonCargaAnticipo">
                                            <button id="DownloadAntici" class="btn btn-outline-secondary btn-sm" type="button">Adjunte Documento Anticipo</button>
                                            <input id="AnticipoInput" type="file" style="display: none; margin-left: 10px;"
                                                accept="application/pdf, image/jpeg, image/jpg, image/png">
                                            <div id="anticipoStatus"></div>
                                        </div>
                                    </div>
                                    <div id="RightSelects">
                                        </div>
                                    <input type="hidden" id="id_user" name="userId" value=<?php echo $_SESSION['id_user']?>>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button id="SendForm2" class="btn btn-primary">Guardar</button>
                            <button id="buttonCerrar2" type="button" class="btn btn-secondary"data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL FALLA NIVEL 2-->

        <!--MODAL FALLA NIVEL 1-->
            <div class="modal" id="miModal1" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1"
                data-bs-backdrop="static" data-bs-keyboard="false">
                <div id="Modal2-div" class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content" style="max-width: 66%; max-height: 90vh;">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalToggleLabel" style="color: grey;">Falla Nivel 1</h1>
                        </div>
                        <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                            <div>
                                <label for="FallaSelect1">Falla Descrita Por el Cliente</label>
                                <div id="FallaSelect1Container">
                                    <select id="FallaSelect1" name="FallaSelect1">
                                    </select>
                                </div><br>
                                <label for="serialInputDetalle1">RIF cliente</label>
                                <input type="text" onchange="checkRif1()" id="InputRif1" placeholder="JV123456789" disabled>
                                <p id="rifMensaje1"></p>
                                <label for="serialSelect">Seriales de POS:</label>
                                <div id="serialSelectContainer">
                                    <input type="text" class="form-control" id="serialSelect1" name="serialSelect" disabled>
                                </div><br>
                                <label style="display: none;" for="FallaSelect">Nivel Falla</label>
                                <div id="FallaSelectContainer">
                                    <select id="FallaSelectt1" name="FallaSelect" style="display: none;">
                                        <option value="1">Nivel 1</option>
                                    </select>
                                </div>
                                <input type="hidden" id="id_user" name="userId">
                                <table id="serialCountTableDetalle1" class="table">
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer" style="margin-bottom: 10%">
                            <button id="SendForm1" onclick="SendDataFailure1();" style="display: block;" class="btn btn-primary">Guardar</button>
                            <button id="buttonCerrar" type="button" class="btn btn-secondary"
                                data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL FALLA NIVEL 1-->

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
        </div>
        <!-- Github buttons -->
        <!--JQUERY-->

        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>

        <!-- Bootstrap-->
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>


        <!--   Core JS Files   -->
        <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>

        <!-- Datatable -->
        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.js"></script>

        <script type="text/javascript" src="<?php echo APP; ?>DataTable/dataTables.bootstrap.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/dataTables.buttons.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/buttons.print.min.js"></script>
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

        <script src="<?php echo APP; ?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>

        <!-- Custom scripts for all pages-->
        <script src="<?php echo APP; ?>app/plugins/js/sb-admin-2.min.js"></script>
        <script src="<?php echo APP; ?>app/views/consulta_rif/js/frontEnd.js"></script>

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
                }) // Programar la recarga después de que el SweetAlert se cierre
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