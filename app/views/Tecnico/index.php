<?php
function mi_navbar()
{

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
            <?php echo tituloPagina; ?>
        </title>

    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">


    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />
    <style>
      
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

            .falla-reportada-texto {
                color: #DC3545; /* Rojo de Bootstrap 'danger' */
                /* O un color naranja: */
                /* color: #FD7E14; */ /* Naranja de Bootstrap 'warning' */
                /* O un color personalizado: */
                /* color: #C0392B; */ /* Un rojo ladrillo */
                /* color: #E67E22; */ /* Un naranja más suave */
                font-weight: bold; /* Opcional: para que resalte más */
            }

            #tabla-ticket tbody tr.table-active {
                background-color: #CCE5FF !important; /* Un gris claro para el resaltado */
                color: #333; /* Color de texto para que sea legible sobre el gris */
                border: 1px solid #ccc;
                box-shadow: 0 0 5px rgba(0,0,0,0.2);
            }

            .highlighted-change {
                font-weight: bold;
                color: #000; /* Color de texto más oscuro para mayor contraste */
                background-color: #ffeb3b; /* Amarillo claro */
                padding: 2px 5px;
                border-radius: 3px;
            }

            .dropdown-menu {
                min-width: 250px; /* Ajusta el ancho del menú desplegable */
            }
            .dropdown-item {
                white-space: normal; /* Permite que el texto del botón se envuelva si es muy largo */
            }

            /* Estilo del menú desplegable personalizado */
            .custom-dropdown {
                border-radius: 0.5rem; /* Bordes redondeados */
                box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; /* Sombra más pronunciada */
                padding: 0.5rem 0; /* Espaciado interno */
            }

            /* Estilo para los elementos del menú */
            .custom-dropdown .dropdown-item {
                font-size: 0.9rem; /* Tamaño de fuente más pequeño */
                padding: 0.5rem 1rem; /* Más espacio para cada opción */
                transition: background-color 0.2s ease, color 0.2s ease; /* Transición suave en el hover */
            }

            /* Efecto de hover para los elementos del menú */
            .custom-dropdown .dropdown-item:hover {
                background-color: #e9ecef; /* Un color de fondo más sutil al pasar el mouse */
                color: #007bff; /* Color del texto cambia al pasar el mouse */
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

        #modalViewcontent{
            width: none  !important;
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
                                                    <h5 class="text-black text-capitalize ps-3" style="color: black;">Gestión Técnico</h5>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                   <table id="tabla-ticket" class="table table-striped table-bordered table-hover table-sm">
                                        <thead>
                                        </thead>
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

        <!--MODAL PARA SELECCIONAR LAS ACCIONES-->
            <div id="actionSelectionModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button id="BtnCerrarSelecionAccion" type="button" class="btn-close" aria-label="Close"></button>
                            <h2 style="color: black;">Seleccionar Acción</h2>
                        </div>
                        <div class="modal-body">
                            <p style="font-size: 115%;">¿Qué acción deseas realizar con el ticket?</p>
                        </div>
                        <div class="action-buttons">
                            <button class="btn-primary" id="ButtonSendToTaller">Enviar a Taller</button>
                            <button class="btn-secondary" id="devolver">Devolver al Cliente</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SELECCIONAR LAS ACCIONES-->

        <!-- MODAL DE DEVOLUCION AL CLIENTE-->
            <div id="devolverClienteModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h2  style="color: white;">Devolver al Cliente</h2>
                        </div>
                        <div class="modal-body">
                            <p style="font-size: 115%;">¿Estás seguro de que deseas devolver este ticket al cliente?</p>
                            <div class="form-group">
                                <label for="observacionesDevolver">Observaciones:</label>
                                <textarea class="form-control" id="observacionesDevolver" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id = "BttonCloseModalDevolucion" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="confirmDevolverCliente">Confirmar Devolución</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- MODAL DE DEVOLUCION AL CLIENTE-->


        <!-- MODAL PARA SELECCIONAR TECNICO -->
           <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div id="ModalConfirmarSendTaller" class="modal-content">
                        <div class="modal-header bg-gradient-primary text-white">
                            <h5 class="modal-title" id="staticBackdropLabel">Confirmación de Envío a Taller</h5>
                        </div>
                        <div class="modal-body text-center">
                            <div class="mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16">
                                    <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/>
                                </svg>
                            </div>
                            <p class="h4 mb-3" style="color: black;">¿Deseas enviar a taller el POS asociado <span id="serialpos"></span> al nro de ticket:</p>
                            <span class="h4 mb-3" id="modalTicketNr"></span><p class="h4" style="color: black;">?</p>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button id="close-button" type="button" class="btn btn-lg btn-secondary">Cerrar</button>
                            <button id="SendToTaller-button" type="button" class="btn btn-lg btn-primary">Enviar a Taller</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA SELECCIONAR TECNICO-->

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
                                    <input class="form-control" type="file" id="documentFile" accept="image/*,application/pdf"
                                        style="display:block">
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
                    <div class="modal-content" id="modalViewcontent" style=" width: 2%;">
                        <div class="modal-header bg-gradient-primary">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="viewDocumentModalLabel">
                                    Documento para Nro Ticket: <span id="viewModalTicketId"></span></h5>
                            </strong>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label>Nombre de la imagen: <span id="NombreImage"></span></label>
                            </div>
                            <div class="mb-3 text-center" style="max-height: 80vh; overflow-y: auto;">
                                <img id="imageViewPreview" class="img-fluid" src="#" alt="Previsualización de Imagen" style="height: auto; display: none; object-fit: contain;">
                                <div id="pdfViewViewer" style="width: 100%; height: 600px; display: none; border: 1px solid #ddd;"></div>
                            </div>
                            <div id="viewDocumentMessage" class="message-box hidden text-center mt-3"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="modalCerrarshow"
                                data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->

        <div class="modal fade" id="documentActionsModal" tabindex="-1" role="dialog" aria-labelledby="documentActionsModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="documentActionsModalLabel" style="color: #000;">Acciones de Documentos</h5>                  
                </div>
                <div class="modal-body">
                    <p>Selecciona una opción para guardar documento del ticket <strong id="modalTicketId"></strong>:</p>
                    <div id="modal-buttons-container" class="d-grid gap-2">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                </div>
                </div>
            </div>
        </div>

        <!-- PARA SELECCIONAR LOS COMPONENTES ASOCIADOS AL SERIAL DEL POS -->
            <div class="modal fade" id="modalComponentes" tabindex="-1" aria-labelledby="modalComponentesLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
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
                                    <i class="bi bi-check-circle me-1"></i>Guardar Componentes Seleccionados
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
        <!-- END PARA SELECCIONAR LOS COMPONENTES ASOCIADOS AL SERIAL DEL POS -->

        <input type="hidden" id="userId" value="<?php echo $_SESSION['id_user']; ?>">

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
                setTimeout(function () {
                    location.reload(true); // Forzar recarga desde el servidor
                }, sessionLifetime * 1000); // sessionLifetime está en segundos
            }
        </script>
        <!-- END PARTE DEL CODIGO DE SESSION EXPIRADAS-->
    </body>

    </html>