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

        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />

        <link rel="stylesheet"  href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">

        <link rel="stylesheet" href="<?php echo APP; ?>app/plugins/animate-css/animate.min.css"/>
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />

        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />

        <style>
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
        /* END Estilos para los indicadores de estado del ticket */

            .highlighted-change {
                font-weight: bold;
                color: #000; /* Color de texto más oscuro para mayor contraste */
                background-color: #ffeb3b; /* Amarillo claro */
                padding: 2px 5px;
                border-radius: 3px;
            }

            #ticket-details-panel table td,
            table th {
                white-space: normal !important;
            }

            /* Contenedor de paginación de DataTables */
            .dataTables_wrapper .dataTables_paginate.paging_simple_numbers {
                /* Puedes ajustar márgenes o padding aquí si es necesario */
                margin-top: 15px;
                /* Espacio superior para separar de la tabla */
            }

            /* Estilo para los elementos LI de la paginación (números, Anterior, Siguiente) */
            .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button {
                background-color: #f0f0f0;
                /* Un gris claro para el fondo */
                color: black;
                /* Un gris oscuro para el texto */
                border: 1px solid #cccccc;
                /* Un borde sutil */
                padding: 8px 12px;
                margin: 0 4px;
                cursor: pointer;
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
                /* Transición suave */
                border-radius: 4px;
                /* Bordes ligeramente redondeados */
                list-style: none;
                /* Eliminar viñetas de lista */
                display: inline-block;
                /* Asegura que se comporten como bloques en línea */
            }

            /* Estilo al pasar el puntero (hover) sobre los LI que no están activos ni deshabilitados */
            .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button:hover:not(.active):not(.disabled) {
                background-color: #fff;
                /* Un gris ligeramente más oscuro al pasar el puntero */
                color: #007bff;
                /* Un azul suave para el texto, o puedes mantener el gris oscuro */
                border-color: #a0a0a0;
                /* Un borde un poco más visible */
                text-decoration: none;
                /* Asegurar que no haya subrayado si hay un enlace dentro */
            }

            /* Estilo de la página activa */
            .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button.active {
                background-color: #8392ab;
                /* Azul para la página activa (puedes elegir un color más sutil aquí) */
                color: #ffffff;
                /* Texto blanco para la página activa */
                border-color: #8392ab;
                /* Borde del mismo color que el fondo */
                cursor: default;
                /* No cambia el cursor al pasar por la página actual */
            }

            /* Estilo para los botones deshabilitados (Anterior, Siguiente, o los "...") */
            .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button.disabled {
                background-color: #f8f8f8;
                /* Un gris muy claro, casi blanco */
                color: #999999;
                /* Un gris más claro para el texto */
                border: 1px solid #e0e0e0;
                /* Un borde muy sutil */
                cursor: not-allowed;
                /* Indica que no es clickeable */
                pointer-events: none;
                /* Asegura que no sea clickeable incluso si hay un 'a' dentro */
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
                background-color: #fff;
                /* Un gris ligeramente más oscuro al pasar el puntero (sutil) */
                color: #003594;
                /* Azul suave para el texto al hacer hover, o puedes mantener el gris oscuro si prefieres menos cambio */
                border-color: white;
                /* Borde un poco más visible al hacer hover */
            }

            #btn-asignados {
                background-color: #ffc107; /* Amarillo warning */
                border-color: #ffc107;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            #btn-por-asignar {
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            /* CSS para los botones de Asignados/Por Asignar */
            /* Estilo base para el botón Asignados cuando es el activo */
            #btn-asignados.btn-primary {
                background-color: #ffc107; /* Amarillo warning */
                border-color: #ffc107;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Asignados cuando es el activo */
            #btn-asignados.btn-primary:hover,
            #btn-asignados.btn-primary:focus {
                background-color: #ffc107; /* Amarillo warning */
                border-color: #ffc107;
                box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
                /* Sombra de enfoque/hover */
            }

            #btn-recibidos.btn-primary {
                background-color: #17a2b8; /* Azul info */
                border-color: #17a2b8;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            #btn-recibidos.btn-primary:hover,
            #btn-recibidos.btn-primary:focus {
                background-color: #17a2b8; /* Azul info */
                border-color: #17a2b8;
                box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
            }

            /* Estilo para el botón Asignados cuando NO es el activo (es gris) */
            #btn-asignados.btn-secondary {
                background-color: #A0A0A0;
                /* Tu gris sutil */
                border-color: #A0A0A0;
                color: #ffffff;
                /* O un gris oscuro si el fondo es claro */
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
                background-color: #28a745; /* Verde éxito */
                border-color: #28a745;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Por Asignar cuando es el activo */
            #btn-por-asignar.btn-primary:hover,
            #btn-por-asignar.btn-primary:focus {
                background-color: #28a745; /* Verde éxito */
                border-color: #28a745;
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

            #tabla-ticket tbody tr.table-active {
                background-color: #CCE5FF !important;
                /* Un gris claro para el resaltado */
                color: #333;
                /* Color de texto para que sea legible sobre el gris */
                border: 1px solid #ccc;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            }

            #confirmTallerBtn {
                background-color: #0045b4;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            #confirmTallerBtn:hover {
                background-color: #002884;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            #CerrarButtonTallerRecib {
                background-color: #b0b0b0;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            #CerrarButtonTallerRecib:hover {
                background-color: red;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            #modalCerrarshow:hover{
                background-color: red;
            }
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
        <main class="main-content position-relative border-radius-lg">
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
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <strong>
                                                        <h5 class="text-black text-capitalize ps-3"
                                                            style="color: black;">Gestión Regiones</h5>
                                                    </strong>
                                                    <span class="badge bg-gradient-dark me-3" id="region-display"
                                                        style="cursor: pointer;">
                                                        Región: <span id="region-name"></span>
                                                    </span>
                                                </div>
                                                <div id="states-container" style="display: none; margin-top: 10px;">
                                                    <h6 class="mb-2">Estados de la región:</h6>
                                                    <ul id="states-list" class="list-group"></ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="ticket-status-indicator-container"></div>
                                    <table id="tabla-ticket"
                                        class="table table-striped table-bordered table-hover table-sm">
                                        <thead>
                                        </thead>
                                        <tbody class="table-group-divider" id="table-ticket-body">
                                            <tr>
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
                            <strong>
                                <p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- MODAL PARA CONFIRMAR EN REGION -->
            <div class="modal fade" id="confirmInRosalModal" tabindex="-1" aria-labelledby="confirmInTallerModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content custom-modal-content">
                        <div class="modal-header bg-gradient-primary text-white">
                            <h5 class="modal-title " id="confirmInTallerModalLabel">Confirmación de recibido</h5>
                        </div>
                        <div class="modal-body custom-modal-body text-center">
                            <div class="swal2-icon-wrapper mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#ffc107"
                                    class="swal2-icon-custom-svg" viewBox="0 0 16 16">
                                    <path
                                        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.5a.5.5 0 0 1-1.002.04l-.35-3.5C7.046 5.462 7.465 5 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                </svg>
                            </div>
                            <p id="TextConfirmTaller">¿Marcar el Pos con el serial <span id="serialPost"
                                    style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;"></span>
                                asociado al Nro de ticket: <span id="modalTicketIdConfirmTaller"
                                    style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;"></span>
                                como recibido?</p>
                            <p class="small-text"
                                style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">
                                Esta acción registrará la fecha de recepción y habilitará la opción de entregar a Cliente.</p>
                        </div>
                        <div class="modal-footer custom-modal-footer d-flex justify-content-center">
                            <button type="button" class="btn custom-btn-primary" id="confirmTallerBtn">Recibir POS</button>
                            <button type="button" class="btn custom-btn-secondary" id="CerrarButtonTallerRecib"
                                data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- MODAL PARA CONFIRMAR EN REGION -->

        <!--MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->
            <div class="modal fade" id="visualizarImagenModal" tabindex="-1" aria-labelledby="visualizarImagenModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h5 class="modal-title" id="visualizarImagenModalLabel">Seleccione la imagen que desea visualizar:</h5>
                        </div>
                        <div class="modal-body">
                            <div class="form-check"><br>
                                <input class="form-check-input" type="radio" name="opcionImagen" id="imagenEnvio" value="Envio" checked>
                                <label class="form-check-label" for="imagenEnvio" id = "labelEnvio">
                                    Documento de Envío
                                </label>
                            </div>
                            <div class="form-check"><br>
                                <input class="form-check-input" type="radio" name="opcionImagen" id="imagenExoneracion" value="Exoneracion">
                                <label class="form-check-label" for="imagenExoneracion" id = "labelExo">
                                    Documento de Exoneración
                                </label>
                            </div>
                            <div class="form-check"><br>
                                <input class="form-check-input" type="radio" name="opcionImagen" id="imagenPago" value="Anticipo">
                                <label class="form-check-label" for="imagenPago" id="labelPago">
                                    Documento de Pago
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="BotonCerrarSelectDocument">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="btnConfirmarVisualizacion">Visualizar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->

        <!-- MODAL PARA ACCIONES DE DOCUMENTOS -->
            <div class="modal fade" id="documentActionsModal" tabindex="-1" role="dialog" aria-labelledby="documentActionsModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content" style="width: 65%; margin-left: 21%;">
                    <div class="modal-header bg-gradient-primary text-white">
                        <h5 class="modal-title" id="documentActionsModalLabel">Acciones de Documentos</h5>                  
                    </div>
                    <div class="modal-body">
                        <p>Selecciona una opción para ver el documento del ticket <strong id="modalTicketId"></strong>:</p>
                        <div id="modal-buttons-container" class="d-grid gap-2">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id = "close-botonseleccionAction" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                    </div>
                </div>
            </div>
        <!-- MODAL PARA ACCIONES DE DOCUMENTOS -->

          <!--MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="uploadDocumentModal" tabindex="-1" aria-labelledby="uploadDocumentModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); display: none;">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="uploadDocumentModalLabel">Subir
                                    Documento para el Nro Ticket: <span id="modalTicketId"></span></h5>
                                <input type="hidden" id="id_ticket"></input>
                            </strong>
                        </div>
                        <div class="modal-body">
                            <form id="uploadForm">
                                <div class="mb-3">
                                    <label for="documentFile" class="form-label text-gray-700">Seleccionar Archivo:</label>
                                    <input class="form-control" type="file" id="documentFile" accept="image/jpg, image/png, image/gif, application/pdf" style="display:block" required>
                                    <small class="text-gray-500">Solo imágenes (JPG, PNG, GIF) o PDF.</small>
                                </div>
                                <div class="mb-3 text-center" style="max-height: 50vh; overflow-y: auto;">
                                    <img id="imagePreview" class="img-fluid img-preview" src="#" alt="Previsualización de Imagen" style="display: none;">
                                </div>
                                <div id="uploadMessage" class="message-box hidden"></div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="CerrarBoton" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="uploadFileBtn">Subir</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->

         <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content" id="modalViewcontent">
                        <div class="modal-header bg-gradient-primary">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="viewDocumentModalLabel">
                                    Documento para Nro Ticket: <span id="viewModalTicketId"></span>
                                </h5>
                            </strong>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label>Nombre de la imagen: <span id="NombreImage"></span></label>
                            </div>
                            <div class="mb-3 text-center" style="max-height: 80vh; overflow-y: auto;">
                                <img id="imageViewPreview" class="img-fluid" src="#" alt="Previsualización de Imagen" style="height: auto; display: none; object-fit: contain;">
                                <div id="pdfViewViewer" style="width: 100%; height: 70vh; display: none;"></div>
                            </div>
                            <div id="viewDocumentMessage" class="message-box hidden text-center mt-3"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="CerrarModalVizualizar" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->

        <!-- PARA SELECCIONAR LOS COMPONENTES ASOCIADOS AL SERIAL DEL POS -->
            <div class="modal fade" id="modalComponentes" tabindex="-1" aria-labelledby="modalComponentesLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-gradient-primary">
                                <h5 class="modal-title text-white" id="modalComponentesLabel">
                                    <i class="bi bi-box-seam-fill me-2"></i>Lista de Componentes del Dispositivo
                                </h5>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="alert bg-gradient-primary text-white" role="alert">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.08-.41.2-.083c-.274-.223-.306-.35-.24-.555zm.405-3.567A.245.245 0 0 1 8 4.775V4.2a.24.24 0 0 1 .237-.245zm-.49-.122a.5.5 0 1 0-.97.124.5.5 0 0 0 .97-.124z"/>
                                            </svg>
                                            Selecciona los componentes que deseas cargar para este dispositivo.
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-12">
                                        <div class="table-responsive">
                                            <table class="table table-hover no-datatables" id="tablaComponentes" data-dt-disable="true">
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
                                
                                <div class="row">
                                    <div class="col-12" class="bg-gradient-primary">
                                        <div class="alert bg-gradient-primary text-white" role="alert">
                                            <div style="margin-left: 3%;">
                                                <small class="d-flex align-items-center mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.08-.41.2-.083c-.274-.223-.306-.35-.24-.555zm.405-3.567A.245.245 0 0 1 8 4.775V4.2a.24.24 0 0 1 .237-.245zm-.49-.122a.5.5 0 1 0-.97.124.5.5 0 0 0 .97-.124z"/>
                                                    </svg><span style="color: white;"><strong>Leyenda de Estados:</strong></span>
                                                </small>
                                                <div class="d-flex flex-wrap gap-3 mt-2">
                                                    <span style="background: #faebd7" class="badge text-dark">
                                                        <span class="d-inline-block me-1" style="width: 12px; height: 12px; background-color: #0dcaf0; border-radius: 2px;"></span>
                                                        Marcado
                                                    </span>
                                                    <span class="badge bg-secondary opacity-75">
                                                        <span class="d-inline-block me-1" style="width: 12px; height: 12px; background-color: #6c757d; border-radius: 2px;"></span>
                                                        Desmarcado
                                                    </span>
                                                    <span class="badge bg-light text-dark border">
                                                        <span class="d-inline-block me-1" style="width: 12px; height: 12px; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 2px;"></span>
                                                        Sin marcar
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mt-2">
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

        <input type="hidden" id="userId" value="<?php echo $_SESSION['id_user']; ?>">

        <script async defer src="https://buttons.github.io/buttons.js"></script>

        <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.js"></script>

        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
        <script
            src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>

        <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/public/img/dashboard/js/argon-dashboard.min.js?v=2.1.0"></script>

        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>

        <script src="<?php echo APP; ?>app/plugins/chart.js/chart.js"></script>
        <script src="<?php echo APP; ?>app/plugins/chart.js/chart.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
        <script
            src="<?php echo APP; ?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/sb-admin-2.min.js"></script>
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