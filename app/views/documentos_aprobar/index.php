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

        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">

        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />

    <style>

        .highlighted-change {
            font-weight: bold;
            color: #000; /* Color de texto más oscuro para mayor contraste */
            background-color: #ffeb3b; /* Amarillo claro */
            padding: 2px 5px;
            border-radius: 3px;
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
            background-color: #dc3545; /* Rojo danger */
            border-color: #dc3545;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        #btn-por-asignar{
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* CSS para los botones de Asignados/Por Asignar */
        /* Estilo base para el botón Asignados cuando es el activo */
        #btn-asignados.btn-primary {
            background-color: #dc3545; /* Rojo danger */
            border-color: #dc3545;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Asignados cuando es el activo */
        #btn-asignados.btn-primary:hover,
        #btn-asignados.btn-primary:focus {
            background-color: #dc3545; /* Rojo danger */
            border-color: #dc3545;
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
            background-color: #17a2b8; /* Azul info */
            border-color: #17a2b8;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Por Asignar cuando es el activo */
        #btn-por-asignar.btn-primary:hover,
        #btn-por-asignar.btn-primary:focus {
            background-color: #17a2b8; /* Azul info */
            border-color: #17a2b8;
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

        #btn-asignados,
        #btn-por-asignar,
        /* #btn-recibidos, */
        #btn-devuelto {
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        /* #btn-recibidos {
            background-color: #a0a0a0;
            color: #ffffff;
            border: 1px solid #a0a0a0;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        Estilo base para el botón Recibidos cuando es el activo
        #btn-recibidos.btn-primary {
            background-color: #28a745;
            border-color: #28a745;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        Estilo hover/focus para el botón Recibidos cuando es el activo
        #btn-recibidos.btn-primary:hover,
        #btn-recibidos.btn-primary:focus {
            background-color: #28a745;
            border-color: #28a745;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
        }

        Estilo para el botón Recibidos cuando NO es el activo (es gris)
        #btn-recibidos.btn-secondary {
            background-color: #a0a0a0;
            border-color: #a0a0a0;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        } */

        #closeImagevisualizarModalBtn:hover{
            background-color: red;
            color: white;
        }
        
        #closeImagevisualizarModalBtn{
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #btnVisualizarImagen{
            color: white;
            background-color: #003594;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #btnVisualizarImagen:hover{
            background-color: green;
            color: white;
        }

        #closeImageApprovalModalBtn{
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #closeImageApprovalModalBtn:hover{
            background-color: red;
            color: white;
        }

        #approveTicketFromImage{
            color: white;
            background-color: #003594;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #approveTicketFromImage:hover{
            background-color: green;
            color: white;
        }

        .custom-swal-backdrop {
            background-color: rgba(0, 0, 0, 0.4) !important;
            backdrop-filter: blur(8px) !important;
        }

        .custom-swal-popup {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        }

       #CartWrong {
            background-image: linear-gradient(310deg, #2b6cb0 0%, #805ad5 100%);
            padding: 1rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        #CartWrong strong {
            font-weight: bold;
        }

        .alert-heading{
            font-size: 144%;
            text-align: center;
        }

        #CerrarBoton{
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
            margin-left: 1rem;
        }

        #CerrarBoton:hover{
            background-color: red;
            color: white;
        }

        #uploadFileBtn{
            background-color: #003594;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #uploadFileBtn:hover{
            background-color: green;
            color: white;
        }

        .falla-reportada-texto {
            color: #dc3545;
            /* Rojo de Bootstrap 'danger' */
            /* O un color naranja: */
            /* color: #FD7E14; */
            /* Naranja de Bootstrap 'warning' */
            /* O un color personalizado: */
            /* color: #C0392B; */
            /* Un rojo ladrillo */
            /* color: #E67E22; */
            /* Un naranja más suave */
            font-weight: bold;
            /* Opcional: para que resalte más */
        }

        @media (max-width: 1550px) {
            .falla-reportada-texto {
                margin-top: 10%;
            }

            .falla-reportada {
                margin-left: 11%;
            }
        }

        #tabla-ticket tbody tr.table-active {
            background-color: #CCE5FF !important; /* Un gris claro para el resaltado */
            color: #333; /* Color de texto para que sea legible sobre el gris */
            border: 1px solid #ccc;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }

        #RechazoDocumento{
            color: white;
            background-color: #FF0000;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        /* Modal de Confirmación de Rechazo - Estilos Personalizados */
        #modalConfirmacionRechazo .modal-dialog {
            max-width: 500px;
            margin: 1.75rem auto;
        }

        #modalConfirmacionRechazo .modal-content {
            border: none;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        /* Header del Modal */
        #modalConfirmacionRechazo .modal-header {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 50%, #bd2130 100%);
            border-bottom: none;
            padding: 1.5rem 2rem;
            position: relative;
        }

        #modalConfirmacionRechazo .modal-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            pointer-events: none;
        }

        #modalConfirmacionRechazo .modal-title {
            color: white;
            font-weight: 600;
            font-size: 1.25rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        #modalConfirmacionRechazo .modal-title::before {
            content: '⚠️';
            font-size: 1.5rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        /* Body del Modal */
        #modalConfirmacionRechazo .modal-body {
            padding: 2rem;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        #modalConfirmacionRechazo .modal-body p {
            margin-bottom: 1rem;
            color: #495057;
            font-size: 1rem;
            line-height: 1.6;
        }

        #modalConfirmacionRechazo .modal-body p:first-child {
            font-size: 1.1rem;
            font-weight: 500;
            color: #dc3545;
            background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
            padding: 1rem;
            border-radius: 12px;
            border-left: 4px solid #dc3545;
            margin-bottom: 1.5rem;
        }

        #modalConfirmacionRechazo .modal-body p:nth-child(2) {
            color: #6c757d;
            font-style: italic;
            background: #f8f9fa;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }

        #modalConfirmacionRechazo .modal-body p:last-child {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            padding: 1rem;
            border-radius: 12px;
            border: 1px solid #90caf9;
            margin-bottom: 0;
        }

        #modalConfirmacionRechazo #motivoSeleccionadoTexto {
            color: #1976d2;
            font-weight: 600;
            background: rgba(25, 118, 210, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            border: 1px solid rgba(25, 118, 210, 0.2);
        }

        /* Footer del Modal */
        #modalConfirmacionRechazo .modal-footer {
            border-top: 1px solid #e9ecef;
            padding: 1.5rem 2rem;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            gap: 1rem;
        }

        /* Botones */
        #modalConfirmacionRechazo .btn {
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: 12px;
            border: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 0.875rem;
            min-width: 120px;
        }

        #modalConfirmacionRechazo .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
        }

        #modalConfirmacionRechazo .btn-secondary:hover {
            background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
        }

        #modalConfirmacionRechazo .btn-danger {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        }

        #modalConfirmacionRechazo .btn-danger:hover {
            background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
        }

        #modalConfirmacionRechazo .btn:active {
            transform: translateY(0);
            transition: transform 0.1s;
        }

        /* Animaciones */
        #modalConfirmacionRechazo .modal.fade .modal-dialog {
            transform: scale(0.8) translateY(-50px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #modalConfirmacionRechazo .modal.show .modal-dialog {
            transform: scale(1) translateY(0);
        }

        /* Responsive */
        @media (max-width: 576px) {
            #modalConfirmacionRechazo .modal-dialog {
                margin: 1rem;
                max-width: calc(100% - 2rem);
            }
            
            #modalConfirmacionRechazo .modal-header,
            #modalConfirmacionRechazo .modal-body,
            #modalConfirmacionRechazo .modal-footer {
                padding: 1rem;
            }
            
            #modalConfirmacionRechazo .btn {
                padding: 0.625rem 1.25rem;
                font-size: 0.8rem;
                min-width: 100px;
            }
        }

        /* Efectos de hover adicionales */
        #modalConfirmacionRechazo .modal-content:hover {
            transform: translateY(-2px);
            transition: transform 0.3s ease;
        }

        /* Scrollbar personalizado para el modal */
        #modalConfirmacionRechazo .modal-body::-webkit-scrollbar {
            width: 8px;
        }

        #modalConfirmacionRechazo .modal-body::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        #modalConfirmacionRechazo .modal-body::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            border-radius: 4px;
        }

        #modalConfirmacionRechazo .modal-body::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
        }

        #confirmarRechazoBtn{
            color: white;
            background-color: #003594;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #confirmarRechazoBtn:hover{
            color: white;
            background-color: red;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
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
                                                    <h5 class="text-black text-capitalize ps-3" style="color: black;">Documentos Por Aprobar</h5>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                   <table id="tabla-ticket"
                                        class="table table-striped table-bordered table-hover table-sm">
                                       <thead>
                                            <tr>
                                            </tr>
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
                        <strong><p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p></strong>
                    </div>
                </div>
            </div>
        </main>

        <!--MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="uploadDocumentModal" tabindex="-1" aria-labelledby="uploadDocumentModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary text-white">
                            <h5 class="modal-title" id="uploadDocumentModalLabel">
                                Subir Documento para el Nro Ticket: <span id="modalTicketId" class="fw-bold"></span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="uploadForm">
                                <!-- Campos ocultos -->
                                <input type="hidden" id="id_ticket">
                                <input type="hidden" id="document_type">
                                <input type="hidden" id="nro_ticket">

                                <div class="mb-3">
                                    <label for="documentFile" class="form-label text-gray-700 fw-semibold">
                                        Seleccionar Archivo:
                                    </label>
                                    
                                    <!-- Wrapper con position-relative para que Bootstrap muestre los mensajes de feedback -->
                                    <div class="position-relative">
                                        <input class="form-control" type="file" id="documentFile" accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf" required>

                                        <!-- Mensajes de validación de Bootstrap -->
                                        <div class="valid-feedback">
                                            Formato correcto
                                        </div>
                                        <div class="invalid-feedback">
                                            Solo se permiten imágenes (JPG, PNG, GIF) o PDF
                                        </div>
                                    </div>
                                    
                                    <!-- Mensaje informativo que se oculta cuando hay validación activa -->
                                    <small id="fileFormatInfo" class="text-gray-500 d-block mt-1" style="transition: opacity 0.2s;">
                                        Formatos permitidos: JPG, PNG, GIF o PDF
                                    </small>
                                </div>

                                <!-- Previsualización DESACTIVADA POR MOTIVOS DE SEGURIDAD -->
                                <!-- La previsualización ha sido desactivada para prevenir posibles inyecciones de código -->
                                <div id="imagePreviewContainer" class="text-center" style="display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; width: 0 !important; overflow: hidden !important; max-height: 0 !important; padding: 0 !important; margin: 0 !important;">
                                    <img id="imagePreview" class="img-fluid rounded shadow-sm" src="#" alt="Previsualización" style="display: none !important; visibility: hidden !important; opacity: 0 !important; max-height: 0 !important; height: 0 !important; width: 0 !important;">
                                </div>
                                
                                <!-- Mensaje de validación (opcional, para mensajes adicionales) -->
                                <div id="uploadMessage" class="message-box hidden"></div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="CerrarBoton" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-warning" id="generateNotaEntregaBtn">Generar Convenio Firmado</button>
                            <button type="button" class="btn btn-warning" id="generateNotaEntregaBtn2">Generar Nota de Entrega</button>
                            <button type="button" class="btn btn-primary" id="uploadFileBtn" disabled>Subir Archivo</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->

        <!-- MODAL DE ACUERDO DE PAGO -->
            <div class="modal fade" id="paymentAgreementModal" tabindex="-1" aria-labelledby="paymentAgreementModalLabel" aria-hidden="true" style="background-color: rgba(0,0,0,.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 55%; max-height: 95vh;">
                    <div class="modal-content" style="max-height: 95vh; display: flex; flex-direction: column;">
                        <div class="modal-header bg-gradient-primary" style="flex-shrink: 0;">
                            <h5 class="modal-title" id="paymentAgreementModalLabel">Generar Acuerdo de Pago</h5>
                        </div>
                        <div class="modal-body" style="flex: 1; overflow-y: auto; padding: 20px;">
                            <div class="row g-3">
                                <input type="hidden" id="pa_ticket_id" value="">
                                <div class="col-md-6">
                                    <label class="form-label">Fecha</label>
                                    <input type="text" id="pa_fecha" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">N° de Ticket</label>
                                    <input type="text" id="pa_numero_ticket" class="form-control" readonly>
                                </div>

                                <div class="col-12"><strong>Datos del Cliente</strong></div>
                                <div class="col-md-6">
                                    <label class="form-label">RIF/Identificación</label>
                                    <input type="text" id="pa_rif" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Razón Social</label>
                                    <input type="text" id="pa_razon_social" class="form-control" readonly>
                                </div>

                                <div class="col-12 mt-4"><strong>Antecedentes del Equipo</strong></div>
                                <div class="col-md-6">
                                    <label class="form-label">Ejecutivo de Venta</label>
                                    <input type="text" id="pa_ejecutivo_venta" class="form-control" placeholder="Ingrese el nombre del ejecutivo">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Equipo MARCA</label>
                                    <input type="text" id="pa_marca_equipo" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Serial N°</label>
                                    <input type="text" id="pa_serial" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Estatus Equipo</label>
                                    <input type="text" id="pa_status_pos" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Fecha de Instalación</label>
                                    <input type="text" id="pa_fecha_instalacion" class="form-control" readonly>
                                </div>
                                <div class="col-12 mt-4"><strong>Información del Acuerdo</strong></div>
                                <div class="col-md-6">
                                    <label class="form-label">Saldo deudor <small class="text-muted">(Mínimo $10.00)</small></label>
                                    <div class="input-group">
                                        <input type="text" id="pa_saldo_deudor" class="form-control" placeholder="__.__" style="text-align: right;">
                                        <span class="input-group-text">$</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Propuesta</label>
                                    <textarea id="pa_propuesta" class="form-control" rows="2" placeholder="Ingrese la propuesta de pago"></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Observaciones</label>
                                    <textarea id="pa_observaciones" class="form-control" rows="2" placeholder="Ingrese observaciones adicionales"></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Acuerdo</label>
                                    <textarea id="pa_acuerdo" class="form-control" rows="2" placeholder="Ingrese los términos del acuerdo"></textarea>
                                </div>

                                <div class="col-12 mt-4"><strong>Configuración de Datos Bancarios</strong></div>
                                <div class="col-md-6">
                                    <label class="form-label">Número de Cuenta</label>
                                    <input type="text" id="pa_numero_cuenta" class="form-control" placeholder="XXXX-XXXX-XX-XXXX" value="XXXX-XXXX-XX-XXXX">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nombre de la Empresa</label>
                                    <input type="text" id="pa_nombre_empresa" class="form-control" placeholder="Nombre de la empresa" value="Informática y Telecomunicaciones Integradas Inteligen, SA">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">RIF de la Empresa</label>
                                    <input type="text" id="pa_rif_empresa" class="form-control" placeholder="J-XXXXXXXX-X" value="J-00291615-0">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Banco</label>
                                    <input type="text" id="pa_banco" class="form-control" placeholder="Nombre del banco" value="XXXX">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Correo Electrónico</label>
                                    <input type="email" id="pa_correo" class="form-control" placeholder="correo@empresa.com" value="domiciliación.intelipunto@inteligensa.com">
                                </div>

                                <div class="col-12">
                                    <button type="button" class="btn btn-secondary" id="previewPaymentAgreementBtn">Previsualizar</button>
                                    <button type="button" class="btn btn-success" id="printPaymentAgreementBtn">Imprimir / Guardar PDF</button>
                                </div>
                                <div class="col-12" style="height: 500px; border: 2px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                                    <iframe id="paymentAgreementPreview" style="width:100%; height:100%; border:none; overflow-y: auto; overflow-x: hidden;"></iframe>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer" style="flex-shrink: 0; border-top: 1px solid #dee2e6;">
                            <button type="button" class="btn btn-secondary" id="closePaymentAgreementBtn">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL DE ACUERDO DE PAGO-->

        <!-- MODAL DE NOTA DE ENTREGA -->
            <div class="modal fade" id="htmlTemplateModal" tabindex="-1" aria-labelledby="htmlTemplateModalLabel" aria-hidden="true" style="background-color: rgba(0,0,0,.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h5 class="modal-title" id="htmlTemplateModalLabel">Generar Nota de Entrega</h5>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                            <input type="hidden" id="htmlTemplateTicketId" value="">
                            <div class="col-md-6">
                                <label class="form-label">Fecha</label>
                                <input type="text" id="ne_fecha" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">N° de Nota</label>
                                <input type="text" id="ne_numero" class="form-control" readonly>
                            </div>

                            <div class="col-12"><strong>Datos del Cliente</strong></div>
                            <div class="col-md-6">
                                <label class="form-label">RIF/Identificación</label>
                                <input type="text" id="ne_rif" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Razón Social</label>
                                <input type="text" id="ne_razon" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Responsable</label>
                                <input type="text" id="ne_responsable" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Contacto</label>
                                <input type="text" id="ne_contacto" class="form-control" readonly>
                            </div>

                            <div class="col-12"><strong>Detalles del Equipo</strong></div>
                            <div class="col-md-6">
                                <label class="form-label">Proveedor</label>
                                <input type="text" id="ne_proveedor" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Modelo</label>
                                <input type="text" id="ne_modelo" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Número de Serie</label>
                                <input type="text" id="ne_serial" class="form-control" readonly>
                            </div>
                            <!-- ✅ AGREGAR ESTOS CAMPOS -->
                            <div class="col-md-6">
                                <label class="form-label">Banco</label>
                                <input type="text" id="ne_banco" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Componentes</label>
                                <input type="text" id="ne_componentes" class="form-control" readonly>
                            </div>

                            <div class="col-12"><strong>Información del Envío</strong></div>
                            <div class="col-md-6">
                                <label class="form-label">Estado de Origen</label>
                                <input type="text" id="ne_region_origen" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Estado de Destino</label>
                                <input type="text" id="ne_region_destino" class="form-control" readonly>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Observaciones de Envío</label>
                                <textarea id="ne_observaciones" class="form-control" rows="3" placeholder="Opcional"></textarea>
                            </div>

                            <div class="col-12">
                                <button type="button" class="btn btn-secondary" id="previewHtmlTemplateBtn">Previsualizar</button>
                                <button type="button" class="btn btn-success" id="printHtmlTemplateBtn">Imprimir / Guardar PDF</button>
                            </div>
                            <div class="col-12" style="height: 400px;">
                                <iframe id="htmlTemplatePreview" style="width:100%; height:100%; border:1px solid #ddd;"></iframe>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="closeHtmlTemplateBtn">Cerrar</button>
                    </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL DE NOTA DE ENTREGA-->

        <!--MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->
            <div class="modal fade" id="visualizarImagenModal" tabindex="-1" aria-labelledby="visualizarImagenModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="visualizarImagenModalLabel">Seleccione la imagen que desea visualizar:</h5>
                    </div>
                    <div class="modal-body">
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="opcionImagen" id="imagenEnvio" value="Envio">
                        <label class="form-check-label" for="imagenEnvio" id = "labelEnvio">
                            Documento de Envío
                        </label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="opcionImagen" id="imagenExoneracion" value="Exoneracion">
                        <label class="form-check-label" for="imagenExoneracion" id = "labelExo">
                            Documento de Exoneración
                        </label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="opcionImagen" id="imagenPago" value="Anticipo">
                        <label class="form-check-label" for="imagenPago" id="labelPago">
                            Documento de Pago
                        </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="closeImagevisualizarModalBtn">Cerrar</button>
                        <button type="button" class="btn btn-primary" id="btnVisualizarImagen">Visualizar</button>
                    </div>
                    </div>
                </div>
            </div>
        <!--END MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->

        <!-- MODAL PARA VIZUALIZAR LOS DOCUMENTOS -->
            <div class="modal fade" id="imageApprovalModal" tabindex="-1" aria-labelledby="imageApprovalModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h5 class="modal-title" id="imageApprovalModalLabel">Revisar y Aprobar Imagen</h5>
                        </div>
                        <p class="mt-3 mb-1" style="color: black; font-weight: bold; text-align: center;">Nombre Documento: <span id="currentNombreDocumento"></span></p>

                        <div class="modal-body text-center">
                            <div id="mediaViewerContainer" style="width: 100%; height: 500px; display: flex; justify-content: center; align-items: center; background-color: #f0f0f0; border: 1px solid #ddd; border-radius: 4px;">
                                <img id="ticketImagePreview" src="" alt="Vista previa del documento" class="img-fluid" style="max-width: 100%; max-height: 100%; object-fit: contain; display: none;">
                                <div id="pdfViewViewer" style="width: 100%; height: 100%; display: none;"></div>
                            </div>
                            <p class="mt-3 mb-1" style="color: black; font-weight: bold;">Nro Ticket: <span id="currentTicketIdDisplay"></span></p>
                            <p class="mt-3 mb-1" style="color: black; font-weight: bold;">Tipo de Documento: <span id="currentImageTypeDisplay"></span></p>
                            <p class="mt-3 mb-1" style="color: black; font-weight: bold;">Serial POS: <span id="currentSerialDisplay"></span></p>
                            
                            <!-- Campos de validación de pago (solo para documento de Anticipo) -->
                            <div id="paymentValidationContainer" style="display: none; margin-top: 20px; padding: 25px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; border: 2px solid #003594; box-shadow: 0 4px 15px rgba(0, 53, 148, 0.1); text-align: left;">
                                <div style="background: linear-gradient(135deg, #003594 0%, #0056b3 100%); color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                                    <h5 class="mb-0" style="color: white; font-weight: bold; margin: 0;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-shield-check me-2" viewBox="0 0 16 16" style="vertical-align: middle;">
                                            <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
                                            <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                        </svg>
                                        Validación de Datos de Pago
                                    </h5>
                                </div>
                                
                                <!-- Datos originales del pago -->
                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#003594" class="bi bi-hash me-1" viewBox="0 0 16 16">
                                                <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547h-.74l-.1-1.054h.73c.467 0 .684-.235.684-.547 0-.312-.217-.547-.684-.547h-.73l-.188-1.053h.74c.421 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547h-1.204l-.555-2.684c-.03-.159-.09-.242-.21-.242-.12 0-.18.083-.21.242l-.554 2.684H7.617l-.555-2.684c-.03-.159-.09-.242-.21-.242-.12 0-.18.083-.21.242l-.554 2.684H5.492c-.42 0-.617.234-.617.547 0 .312.196.547.617.547h.74l.1 1.054h-.73c-.467 0-.684.235-.684.547 0 .312.217.547.684.547h.73l.188 1.053h-.74c-.42 0-.617.234-.617.547 0 .312.196.547.617.547h1.204l.555 2.703c.03.16.09.242.21.242.12 0 .18-.083.21-.242l.554-2.703h2.242l.555 2.703c.03.16.09.242.21.242.12 0 .18-.083.21-.242l.554-2.703h1.7c.42 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547h-1.204l-.1-1.054h1.204c.42 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547h-1.204l-.188-1.053h1.204c.42 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547H9.817l-.555-2.684c-.03-.159-.09-.242-.21-.242-.12 0-.18.083-.21.242l-.554 2.684H7.243l-.555-2.684c-.03-.159-.09-.242-.21-.242-.12 0-.18.083-.21.242l-.554 2.684H4.492c-.42 0-.617.234-.617.547 0 .312.196.547.617.547h.74l.1 1.054h-.73c-.467 0-.684.235-.684.547 0 .312.217.547.684.547h.73l.188 1.053h-.74c-.42 0-.617.234-.617.547 0 .312.196.547.617.547h1.204l.555 2.703c.03.16.09.242.21.242.12 0 .18-.083.21-.242l.554-2.703h2.242z"/>
                                            </svg>
                                            Nro de Referencia:
                                        </label>
                                        <input type="text" id="paymentReferenceOriginal" class="form-control" readonly style="background-color: #ffffff; border: 2px solid #dee2e6; border-radius: 8px; padding: 10px; font-weight: 500; color: #495057;">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#003594" class="bi bi-calendar3 me-1" viewBox="0 0 16 16">
                                                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/>
                                                <path d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M3 10h.01v.01H3zm9.075-3H9.5v-.01h2.575c.498 0 .905.418.905.936 0 .523-.407.936-.905.936H9.5v-.01h2.575A.905.905 0 0 0 13 7.936c0-.518-.407-.936-.905-.936M3 4h.01v.01H3z"/>
                                            </svg>
                                            Fecha de Pago:
                                        </label>
                                        <input type="text" id="paymentDateOriginal" class="form-control" readonly style="background-color: #ffffff; border: 2px solid #dee2e6; border-radius: 8px; padding: 10px; font-weight: 500; color: #495057;">
                                    </div>
                                </div>
                                
                                <!-- Radio: ¿Nro de referencia correcto? -->
                                <div class="mb-4" style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #003594;">
                                    <label class="form-label mb-3" style="font-weight: 600; color: #003594; font-size: 15px; display: block;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-question-circle me-2" viewBox="0 0 16 16" style="vertical-align: middle;">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.25 5.762a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0"/>
                                        </svg>
                                        ¿Nro de referencia correcto?
                                    </label>
                                    <div class="form-check mb-2" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="referenceCorrect" id="referenceCorrectYes" value="yes" checked>
                                        <label class="form-check-label" for="referenceCorrectYes" style="font-weight: 500; color: #495057; cursor: pointer;">Sí</label>
                                    </div>
                                    <div class="form-check" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="referenceCorrect" id="referenceCorrectNo" value="no">
                                        <label class="form-check-label" for="referenceCorrectNo" style="font-weight: 500; color: #495057; cursor: pointer;">No</label>
                                    </div>
                                </div>
                                
                                <!-- Campo para corregir solo el nro de referencia -->
                                <div id="referenceCorrectionField" style="display: none;" class="mb-4">
                                    <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#28a745" class="bi bi-pencil-square me-1" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                        Nro de Referencia Correcto:
                                    </label>
                                    <input type="text" id="paymentReferenceCorrectOnly" class="form-control" placeholder="Ingrese el nro de referencia correcto" style="border: 2px solid #28a745; border-radius: 8px; padding: 10px;">
                                </div>
                                
                                <!-- Radio: ¿Fecha de pago correcta? -->
                                <div class="mb-4" style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #003594;">
                                    <label class="form-label mb-3" style="font-weight: 600; color: #003594; font-size: 15px; display: block;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-question-circle me-2" viewBox="0 0 16 16" style="vertical-align: middle;">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.25 5.762a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0"/>
                                        </svg>
                                        ¿Fecha de pago correcta?
                                    </label>
                                    <div class="form-check mb-2" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="dateCorrect" id="dateCorrectYes" value="yes" checked>
                                        <label class="form-check-label" for="dateCorrectYes" style="font-weight: 500; color: #495057; cursor: pointer;">Sí</label>
                                    </div>
                                    <div class="form-check" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="dateCorrect" id="dateCorrectNo" value="no">
                                        <label class="form-check-label" for="dateCorrectNo" style="font-weight: 500; color: #495057; cursor: pointer;">No</label>
                                    </div>
                                </div>
                                
                                <!-- Campo para corregir solo la fecha de pago -->
                                <div id="dateCorrectionField" style="display: none;" class="mb-3">
                                    <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#28a745" class="bi bi-calendar-check me-1" viewBox="0 0 16 16">
                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                        </svg>
                                        Fecha de Pago Correcta:
                                    </label>
                                    <input type="date" id="paymentDateCorrectOnly" class="form-control" style="border: 2px solid #28a745; border-radius: 8px; padding: 10px;">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="closeImageApprovalModalBtn">Cerrar</button>
                            <button type="button" class="btn btn-success" id="approveTicketFromImage">Aprobar Documento</button>
                            <button type="button" class="btn btn-danger" id="RechazoDocumento">Rechazar Documento</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL PARA VIZUALIZAR LOS DOCUMENTOS -->

         <!-- MODAL PARA SELECCIONAR EL MOTIVO DE RECHAZO -->
            <div class="modal fade" id="modalRechazo" tabindex="-1" aria-labelledby="modalRechazoLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h5 class="modal-title" id="modalRechazoLabel">Motivo de Rechazo</h5>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label for="motivoRechazoSelect" class="form-label">Selecciona el motivo del rechazo:</label>
                                    <select class="form-select" id="motivoRechazoSelect" aria-label="Motivo de Rechazo">
                                    
                                    </select>
                                </div>
                                <div class="mb-3" id="otroMotivoContainer" style="display: none;">
                                    <label for="otroMotivoInput" class="form-label">Especifica el motivo:</label>
                                    <input type="text" class="form-control" id="otroMotivoInput" placeholder = "Especifique el Motivo">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="CerrarModalMotivoRechazo">Cancelar</button>
                            <button type="button" class="btn btn-danger" id="confirmarRechazoBtn">Confirmar Rechazo</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SELECCIONAR EL MOTIVO DE RECHAZO -->

        <!-- CONFIRMACION MOTIVO DE RECHAZO -->
            <div class="modal fade" id="modalConfirmacionRechazo" tabindex="-1" aria-labelledby="modalConfirmacionRechazoLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="modalConfirmacionRechazoLabel">Confirmar Rechazo de Documento</h5>
                    </div>
                    <div class="modal-body">
                        <p>¿Estás seguro de que deseas <strong>rechazar</strong> el documento?</p>
                        <p>Esta acción no se puede deshacer.</p>
                        <p>Motivo seleccionado: <strong id="motivoSeleccionadoTexto"></strong></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id = "modalConfirmacionRechazoBtn">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="btnConfirmarAccionRechazo">Rechazar</button>
                    </div>
                    </div>
                </div>
            </div>
        <!--END CONFIRMACION MOTIVO DE RECHAZO -->

        <input type="hidden" id="userId" value="<?php echo $_SESSION['id_user']; ?>">
        
        <script async defer src="https://buttons.github.io/buttons.js"></script>

        <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.js"></script>

        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>

        <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/public/img/dashboard/js/argon-dashboard.min.js?v=2.1.0"></script>

        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>

        <script src="<?php echo APP; ?>app/plugins/chart.js/chart.js"></script>
        <script src="<?php echo APP; ?>app/plugins/chart.js/chart.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
        <script src="<?php echo APP; ?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>
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