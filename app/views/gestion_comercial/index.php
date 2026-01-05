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

    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />

    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />
    <style>
        /* Estilos para el botón botonMostarImage */
        #botonMostarImage{
           background-color: #003594;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #botonMostarImage:hover {
        background-color: #004085; /* Color más oscuro al pasar el ratón */
        border-color: #004085;
        color: #fff;
        }

        #botonMostarImage:active,
        #botonMostarImage:focus {
        background-color: #004085; /* Color más oscuro al hacer clic o enfocar */
        border-color: #004085;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5); /* Sombra de enfoque */
        }

        #botonMostarImage svg {
        vertical-align: middle; /* Alinear el SVG con el texto */
        margin-right: 0.25rem; /* Espacio entre el ícono y el borde */
        }

        /* Asegurar que el botón se vea bien en la tabla */
        #tabla-ticket #botonMostarImage {
        margin: 0 2px; /* Espacio entre botones en la columna de acciones */
        }

        /* Estilos para el modal */
        #selectSolicitudModal .modal-content {
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        #selectSolicitudModal .modal-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        }

        #selectSolicitudModal .modal-title {
        color: white;
        font-weight: 500;
        }

        #selectSolicitudModal .modal-body {
        padding: 1.5rem;
        }

        #selectSolicitudModal .form-check {
        margin-bottom: 1rem;
        }

        #selectSolicitudModal .form-check-label {
        margin-left: 0.5rem;
        color: #495057;
        }

        #selectSolicitudModal .modal-footer {
        border-top: 1px solid #dee2e6;
        justify-content: space-between;
        }

        #selectSolicitudModal .btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        }

        #selectSolicitudModal .btn-secondary {
        background-color: #6c757d;
        border-color: #6c757d;
        }

        #selectSolicitudModal .btn-secondary:hover {
        background-color: #5a6268;
        border-color: #545b62;
        }

        #selectSolicitudModal .btn-primary {
        background-color: #007bff;
        border-color: #007bff;
        }

        #selectSolicitudModal .btn-primary:hover {
        background-color: #0056b3;
        border-color: #004085;
        }
      
        #ticket-details-panel table td, table th {
            white-space: normal !important;
        }

        /* Contenedor de paginación de DataTables */
        .dataTables_wrapper .dataTables_paginate.paging_simple_numbers {
            /* Puedes ajustar márgenes o padding aquí si es necesario */
            margin-top: 15px; /* Espacio superior para separar de la tabla */
        }

        /* Estilo para los elementos LI de la paginación (números, Anterior, Siguiente) */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button {
            background-color: #f0f0f0; /* Un gris claro para el fondo */
            color: black; /* Un gris oscuro para el texto */
            border: 1px solid #cccccc; /* Un borde sutil */
            padding: 8px 12px;
            margin: 0 4px;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; /* Transición suave */
            border-radius: 4px; /* Bordes ligeramente redondeados */
            list-style: none; /* Eliminar viñetas de lista */
            display: inline-block; /* Asegura que se comporten como bloques en línea */
        }

        /* Estilo al pasar el puntero (hover) sobre los LI que no están activos ni deshabilitados */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button:hover:not(.active):not(.disabled) {
            background-color: #fff; /* Un gris ligeramente más oscuro al pasar el puntero */
            color: #007bff; /* Un azul suave para el texto, o puedes mantener el gris oscuro */
            border-color: #a0a0a0; /* Un borde un poco más visible */
            text-decoration: none; /* Asegurar que no haya subrayado si hay un enlace dentro */
        }

        /* Estilo de la página activa */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button.active {
            background-color: #8392ab; /* Azul para la página activa (puedes elegir un color más sutil aquí) */
            color: #ffffff; /* Texto blanco para la página activa */
            border-color: #8392ab; /* Borde del mismo color que el fondo */
            cursor: default; /* No cambia el cursor al pasar por la página actual */
        }

        /* Estilo para los botones deshabilitados (Anterior, Siguiente, o los "...") */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button.disabled {
            background-color: #f8f8f8; /* Un gris muy claro, casi blanco */
            color: #999999; /* Un gris más claro para el texto */
            border: 1px solid #e0e0e0; /* Un borde muy sutil */
            cursor: not-allowed; /* Indica que no es clickeable */
            pointer-events: none; /* Asegura que no sea clickeable incluso si hay un 'a' dentro */
        }

        /* Si los "..." tienen una clase específica como 'ellipsis', puedes añadirla aquí,
        pero generalmente .disabled los cubre si están dentro de un li.paginate_button. */
        /* .dataTables_wrapper .dataTables_paginate ul.pagination li.ellipsis {
            background-color: #f8f8f8;
            color: #999999;
            border: 1px solid #e0e0e0;
            cursor: default;
        } */       


        /* Estilo al pasar el puntero (hover) sobre los elementos de paginación NO activos y NO deshabilitados */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button:hover:not(.active):not(.disabled) {
            background-color: #fff; /* Un gris ligeramente más oscuro al pasar el puntero (sutil) */
            color: #003594; /* Azul suave para el texto al hacer hover, o puedes mantener el gris oscuro si prefieres menos cambio */
            border-color: white; /* Borde un poco más visible al hacer hover */
        }

          #btn-asignados{
            background-color: #003594;
            color: #ffffff;
            border: 1px solid #003594;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

         #btn-por-asignar{
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* CSS para los botones de Asignados/Por Asignar */
        /* Estilo base para el botón Asignados cuando es el activo */
        #btn-asignados.btn-primary {
            background-color: #003594; /* Tu azul fuerte */
            border-color: #003594;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Asignados cuando es el activo */
        #btn-asignados.btn-primary:hover,
        #btn-asignados.btn-primary:focus {
            background-color: #0045B4; /* Un tono un poco más oscuro o claro al hover */
            border-color: #0045B4;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25); /* Sombra de enfoque/hover */
        }

        /* Estilo para el botón Asignados cuando NO es el activo (es gris) */
        #btn-asignados.btn-secondary {
            background-color: #A0A0A0; /* Tu gris sutil */
            border-color: #A0A0A0;
            color: #ffffff; /* O un gris oscuro si el fondo es claro */
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Asignados cuando NO es el activo */
        #btn-asignados.btn-secondary:hover,
        #btn-asignados.btn-secondary:focus {
            background-color: #B0B0B0;
            border-color: #B0B0B0;
            box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
        }


        /* Estilo base para el botón Por Asignar cuando es el activo */
        #btn-por-asignar.btn-primary {
            background-color: #003594; /* Tu azul fuerte */
            border-color: #003594;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Por Asignar cuando es el activo */
        #btn-por-asignar.btn-primary:hover,
        #btn-por-asignar.btn-primary:focus {
            background-color: #0045B4;
            border-color: #0045B4;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
        }

        /* Estilo para el botón Por Asignar cuando NO es el activo (es gris) */
        #btn-por-asignar.btn-secondary {
            background-color: #A0A0A0;
            border-color: #A0A0A0;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Por Asignar cuando NO es el activo */
        #btn-por-asignar.btn-secondary:hover,
        #btn-por-asignar.btn-secondary:focus {
            background-color: #B0B0B0;
            border-color: #B0B0B0;
            box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
        }

        .highlighted-change {
            font-weight: bold;
            color: #000; /* Color de texto más oscuro para mayor contraste */
            background-color: #ffeb3b; /* Amarillo claro */
            padding: 2px 5px;
            border-radius: 3px;
        }

        #tabla-ticket tbody tr.table-active {
            background-color: #CCE5FF !important; /* Un gris claro para el resaltado */
            color: #333; /* Color de texto para que sea legible sobre el gris */
            border: 1px solid #ccc;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }

         /* Estilos para los indicadores de estado del ticket */
            .ticket-status-indicator {
                position: sticky;
                top: 0;
                z-index: 1000;
                padding: 15px 20px;
                margin-bottom: 20px;
                border-radius: 12px;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
            }

            .status-open {
                background: linear-gradient(135deg, #51cf66, #40c057);
                color: white;
                border-left: 6px solid #2b8a3e;
            }

            .status-process {
                background: linear-gradient(135deg, #ffd93d, #fcc419);
                color: #2c3e50;
                border-left: 6px solid #e67700;
                animation: pulse 2s infinite;
            }

            .status-closed {
                background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                color: white;
                border-left: 6px solid #c92a2a;
            }

            .status-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

            .status-icon {
                font-size: 1.4em;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            }

            .status-text {
                font-size: 1.2em;
                letter-spacing: 1.5px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            /* Animación para el estado en proceso */
            @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.9; transform: scale(1.02); }
                100% { opacity: 1; transform: scale(1); }
            }

            /* Responsive para móviles */
            @media (max-width: 768px) {
                .ticket-status-indicator {
                    padding: 12px 15px;
                    margin-bottom: 15px;
                }
            
                .status-text {
                    font-size: 1em;
                    letter-spacing: 1px;
                }
                
                .status-icon {
                    font-size: 1.2em;
                }
            }

            #confirmarSolicitud {
                background-color: #003594;
                color: #fff;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease-in-out;
            }
        /* END Estilos para los indicadores de estado del ticket */
    </style>
    </head>

    <body id="fondo" class="g-sidenav-show bg-gray-100">
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
        <main class="main-content position-relative border-radius-lg ">
            <div class="container-fluid py-4" style="height: calc(100vh - 80px);">
                <div class="row h-100">
                    <div class="col-md-7 h-100 d-flex flex-column">
                        <div id="Row" class="row mt-4">
                            <div class="cord">
                                <div class="card">
                                    <div class="card-header pb-0 p-3">
                                        <div class="col-lg-12 col-md-12 mt-4 mb-4">
                                            <div
                                                class="card card-body bg-gradient-blue shadow-primary border-radius-lg pt-4 pb-3">
                                                <strong>
                                                    <h5 class="text-black text-capitalize ps-3" style="color: black;">Gestión Comercial</h5>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="ticket-status-indicator-container"></div>
                                   <table id="tabla-ticket"
                                        class="table table-striped table-bordered table-hover table-sm">
                                       <thead>
                                           
                                        <tbody class="table-group-divider" id="table-ticket-body">
                                            <tr>
                                                <td colspan="3">No hay datos</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5 h-100 d-flex flex-column border-start ps-4">
                        <h3 class="mb-3">Detalles del Ticket</h3>
                        <div id="ticket-details-panel" class="flex-grow-1 overflow-auto p-3 bg-light rounded">
                        <strong><p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p></strong>
                    </div>
                </div>
            </div>
        </main>

        <!-- MODAL PARA SELECCIONAR SOLICITUD -->
            <div class="modal fade" id="selectSolicitudModal" tabindex="-1" aria-labelledby="selectSolicitudModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="selectSolicitudModalLabel">Selecciona solicitud</h5>
                    </div>
                    <div class="modal-body">
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="solicitudType" id="sustituirPos" value="sustituir">
                        <label class="form-check-label" for="sustituirPos">Sustituir POS</label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="solicitudType" id="desafiliarPos" value="desafiliar">
                        <label class="form-check-label" for="desafiliarPos">Desafiliación POS</label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="solicitudType" id="prestamoPos" value="prestamo">
                        <label class="form-check-label" for="prestamoPos">Préstamo POS</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="confirmarSolicitud">Confirmar</button>
                    </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SELECCIONAR SOLICITUD -->

        <!-- MODAL PARA SELECCIONAR TECNICO -->
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div id="ModalSelecttecnico" class="modal-content">
                        <div class="modal-header">
                            <!--h1 class="modal-title fs-5" id="staticBackdropLabel">Seleccione un Técnico</h1-->
                            <button id="Close-icon" type="button" class="btn-close" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p style="font-size: 200%; font-family: ui-monospace;">Deseas Enviar al Taller?</p>
                        </div>
                        <div class="modal-footer">
                            <button id="close-button" type="button" class="btn btn-secondary">Cerrar</button>
                            <button id="SendToTaller-button" type="button" class="btn btn-primary">Enviar a Taller</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA SELECCIONAR TECNICO-->

        <!--MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="uploadDocumentModal" tabindex="-1" aria-labelledby="uploadDocumentModalLabel"
                aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); display: none;">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="uploadDocumentModalLabel">Subir
                                    Documento para Ticket: <span id="modalTicketId"></span></h5>
                            </strong>
                            <button type="button" id="icon-close" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="uploadForm">
                                <div class="mb-3">
                                    <label for="documentFile" class="form-label text-gray-700">Seleccionar Archivo:</label>
                                    <input class="form-control" type="file" id="documentFile" accept="image/*,application/pdf"
                                        style="display:block">
                                    <small class="text-gray-500">Solo imágenes (JPG, PNG, GIF) o PDF.</small>
                                </div>
                                <div class="mb-3 text-center">
                                    <img id="imagePreview" class="img-preview" src="#" alt="Previsualización de Imagen">
                                </div>
                                <div id="uploadMessage" class="message-box hidden"></div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="CerrarBoton"
                                data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="uploadFileBtn">Subir</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->

        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel"
                aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="viewDocumentModalLabel">
                                    Documento para Ticket: <span id="viewModalTicketId"></span></h5>
                            </strong>
                            <button type="button" class="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3 text-center">
                                <img id="imageViewPreview" class="img-fluid" src="#" alt="Previsualización de Imagen"
                                    style="max-width: 100%; height: auto; display: none;">
                                <div id="pdfViewViewer"
                                    style="width: 100%; height: 600px; display: none; border: 1px solid #ddd;"></div>
                            </div>
                            <div id="viewDocumentMessage" class="message-box hidden text-center mt-3"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="modalCerrarshow" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
        <input type="hidden" id="userId" value="<?php echo $_SESSION['id_user']; ?>">

        <!-- Github buttons -->
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        <!-- Control Center for Soft Dashboard: parallax effects, scripts for the example pages etc -->
        <!-- Bootstrap core JavaScript-->
        <!--JQUERY-->

        <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.js"></script>

        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>

        <!--   Core JS Files   -->
        <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/public/img/dashboard/js/argon-dashboard.min.js?v=2.1.0"></script>

        <!-- Datatable otro sistema-->

        <script src="<?php echo APP; ?>DataTable/jquery.dataTables.min.js"></script>
        <script src="<?php echo APP; ?>DataTable/dataTables.buttons.min.js"></script>
        <script src="<?php echo APP; ?>DataTable/buttons.print.min.js"></script>
        <script src="<?php echo APP; ?>DataTable/buttons.flash.min.js"></script>
        <script src="<?php echo APP; ?>DataTable/pdfmake.min.js"></script>
        <script src="<?php echo APP; ?>DataTable/jszip.min.js"></script>
        <script src="<?php echo APP; ?>DataTable/vfs_fonts.js"></script>
        <script src="<?php echo APP; ?>DataTable/buttons.html5.min.js"></script>

        <script src="<?php echo APP; ?>js/Datatablebuttons5.js"></script>
        <script src="<?php echo APP; ?>js/Datatablebuttons.min.js"></script>
        <script src="<?php echo APP; ?>js/Datatablebuttonsprint.min.js"></script>
        <script src="<?php echo APP; ?>js/datatables.js"></script>

        <!--  SweetAlert   -->
        <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
        <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

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