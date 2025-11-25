<?php
function mi_navbar() {}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
    <link rel="icon" type="image/png" href="../assets/img/favicon.png">
    <title>
        <?php echo tituloPagina; ?>
    </title>

        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />

    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />

    <link rel="stylesheet"href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/DataTable/dataTables.min.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />

    <style>
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

        div.dataTables_wrapper div.dataTables_length label {
            font-weight: bold;
            /* Ejemplo: Texto en negrita */
            color: #333;
            /* Ejemplo: Color del texto */
            margin-right: 10px;
            /* Ejemplo: Espacio a la derecha del label */
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
            width: 30%;
        }

        /* Estilizar el label "Buscar:" */
        div.dataTables_wrapper div.dataTables_filter label {
            font-weight: bold;
            /* Ejemplo: Texto en negrita */
            color: #333;
            /* Ejemplo: Color del texto */
            margin-right: -0.5em;
            /* Ejemplo: Espacio a la derecha del label */
            margin-left: -7%;
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

        #tabla-ticket td {
            padding: 1rem;
            /* Ajusta este valor para más o menos padding. 1rem = 16px */
            vertical-align: middle;
            /* Opcional: Centra el contenido verticalmente */
        }

        #BtnChange {
            background-color: #003594;
            color: #fff;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #BtnChange:hover {
            background-color: green;
        }

        #uploadFileBtn, #openModalButton{
            background-color: #003594;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #openModalButton:hover {
            background-color: green;
        }

        #uploadFileBtn:hover {
            background-color: green;
        }

        #viewimage{
            background-color: #20B2AA;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #viewimage:hover{
            background-color: #4CC9B7;
        }

        #CerrarBoton, #modalCerrarshow {
            background-color: #8392ab;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #modalCerrarshow:hover {
            background-color: red;
        }

        /* Estilos específicos para los campos de texto del acuerdo */
        #pa_propuesta, #pa_observaciones, #pa_acuerdo {
            width: 100% !important;
            max-width: 100% !important;
            word-wrap: break-word !important;
            word-break: break-all !important;
            white-space: pre-wrap !important;
            overflow-wrap: break-word !important;
            resize: vertical;
            min-height: 60px;
            max-height: 120px;
            font-family: monospace;
            font-size: 12px;
            line-height: 1.2;
        }

        /* Contenedor de las columnas del acuerdo */
        .modal-body .row .col-md-6 {
            width: 50% !important;
            max-width: 50% !important;
            flex: 0 0 50% !important;
            padding: 5px !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
        }

        /* Estilos específicos para impresión */
        @media print {
            #pa_propuesta, #pa_observaciones, #pa_acuerdo {
                width: 180px !important;
                max-width: 180px !important;
                word-break: break-all !important;
                white-space: pre-wrap !important;
                overflow: hidden !important;
                font-size: 10px !important;
                line-height: 1.1 !important;
            }
            
            .modal-body .row .col-md-6 {
                width: 50% !important;
                max-width: 50% !important;
                overflow: hidden !important;
            }
        }

        #CerrarBoton:hover {
            background-color: red;
        }

        #icon-close, #btn-close {
            background-color: #8392ab;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #icon-close:hover {
            background-color: red;
        }

        #btn-close:hover {
            background-color: red;
        }

        body {
            font-family: "Inter", sans-serif;
            background-color: #f0f2f5;
        }

        .modal-content {
            border-radius: 0.75rem;
            /* Rounded corners for the modal */
        }

        /* Estilos específicos para el modal de acuerdo de pago */
        #paymentAgreementModal .modal-dialog {
            max-width: 55% !important;
            max-height: 95vh !important;
            margin: 2.5vh auto !important;
        }

        #paymentAgreementModal .modal-content {
            max-height: 95vh !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
        }

        #paymentAgreementModal .modal-body {
            flex: 1 !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            padding: 20px !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
        }

        /* Estilos para la barra de scroll */
        #paymentAgreementModal .modal-body::-webkit-scrollbar {
            width: 8px !important;
        }

        #paymentAgreementModal .modal-body::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
            border-radius: 4px !important;
        }

        #paymentAgreementModal .modal-body::-webkit-scrollbar-thumb {
            background: #888 !important;
            border-radius: 4px !important;
        }

        #paymentAgreementModal .modal-body::-webkit-scrollbar-thumb:hover {
            background: #555 !important;
        }

        /* Estilos para el select de estatus de domiciliación */
        #modalNewStatusDomiciliacionSelect {
            color: #6c757d !important; /* Color gris por defecto */
        }

        #modalNewStatusDomiciliacionSelect option {
            color: #333 !important; /* Color negro para las opciones */
            background-color: white !important;
        }

        #modalNewStatusDomiciliacionSelect option:first-child {
            color: #6c757d !important; /* Color gris para la opción por defecto */
        }

        .btn-primary {
            background-color: #3b82f6;
            /* Blue color for primary button */
            border-color: #3b82f6;
            border-radius: 0.5rem;
            /* Rounded corners for buttons */
        }

        .btn-primary:hover {
            background-color: #2563eb;
            border-color: #2563eb;
        }

        .btn-info {
            background-color: #0ea5e9;
            /* Light blue for info button */
            border-color: #0ea5e9;
            border-radius: 0.5rem;
        }

        .btn-info:hover {
            background-color: #0284c7;
            border-color: #0284c7;
        }

        .form-control {
            border-radius: 0.5rem;
            /* Rounded corners for inputs */
        }

        .img-preview {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin-top: 1rem;
        }

        .message-box {
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            text-align: center;
        }

        .message-box.success {
            background-color: #d1fae5;
            /* Green for success */
            color: #065f46;
        }

        .message-box.error {
            background-color: #fee2e2;
            /* Red for error */
            color: #991b1b;
        }

        #documentFile {
            /* Estas propiedades fuerzan la visibilidad del input de tipo file nativo */
            display: block !important;
            /* Asegura que el elemento se muestre como un bloque */
            opacity: 1 !important;
            /* Asegura que no sea transparente */
            visibility: visible !important;
            /* Asegura que sea visible */
            position: relative !important;
            /* A veces, la posición puede ocultarlo */
            z-index: 1000 !important;
            /* Lo trae al frente de otros elementos si hay superposiciones */
            width: 100% !important;
            /* Asegura que tenga un ancho */
            height: auto !important;
            /* Permite que el alto se ajuste automáticamente */
            min-height: 40px;
            /* Asegura un alto mínimo para que sea clickeable */
            cursor: pointer !important;
            /* Muestra el cursor de puntero */
        }

        .message-box.info {
            background-color: #e0f2fe;
            /* light blue */
            color: #0c4a6e;
            /* dark blue */
        }

        .highlighted-change {
            font-weight: bold;
            color: #000; /* Color de texto más oscuro para mayor contraste */
            background-color: #ffeb3b; /* Amarillo claro */
            padding: 2px 5px;
            border-radius: 3px;
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

        #RechazoDocumento{
            color: white;
            background-color: #FF0000;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        /* Estilos para el campo de Saldo Deudor */
        #pa_saldo_deudor {
            font-weight: 500;
            font-size: 1rem;
            padding-right: 0.75rem;
        }

        #pa_saldo_deudor:focus {
            border-color: #003594;
            box-shadow: 0 0 0 0.2rem rgba(0, 53, 148, 0.25);
        }

        #pa_saldo_deudor.is-invalid {
            border-color: #dc3545;
            padding-right: calc(1.5em + 0.75rem);
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 3.6.4.4.4-.4m0 4.8-.4-.4-.4.4'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
        }

        #pa_saldo_deudor.is-invalid:focus {
            border-color: #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }

        .input-group-text {
            background-color: #f8f9fa;
            border: 1px solid #ced4da;
            color: #495057;
            font-weight: 600;
            padding: 0.375rem 0.75rem;
        }

        .input-group:focus-within .input-group-text {
            border-color: #003594;
            color: #003594;
        }

        #saldo_deudor_error {
            display: none;
            margin-top: 0.25rem;
            font-size: 0.875rem;
            font-weight: 500;
        }
    </style>
    <!-- CSS Files -->
    <link id="pagestyle" rel="stylesheet"
        href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
    <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/dashboard.css" />
</head>

<body id="fondo" class="g-sidenav-show bg-gray-100">
    <div class="min-height-300 bg-dark position-absolute w-100"></div>
    <div class="d-lg-none fixed-top bg-dark p-2">
        <button class="btn btn-dark" id="filter-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list-task"
                viewBox="0 0 16 16">
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
        <div class="container-fluid py-4" style="padding-left: 2%; height: calc(100vh - 80px);">
            <div class="row h-100">
                <div class="col-md-7 h-100 d-flex flex-column">
                    <div id="Row" class="row mt-4">
                        <div class="cord">
                            <div class="card">
                                <div class="card-header pb-0 p-3">
                                    <div class="col-lg-12 col-md-12 mt-4 mb-4">
                                        <div class="card card-body bg-gradient-blue shadow-primary border-radius-lg pt-4 pb-3">
                                            <strong>
                                                <h5 class="text-black text-capitalize ps-3" style = "color: black">Verificación de Solvencia de Domiciliación</h5>
                                            </strong>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <!--h6 id = "cliente" class="mb-2">Clientes</h6-->
                                    </div>
                                </div>
                                <div class="table-responsive" id="Tabla-Domiciliacion">
                                    <table id="tabla-ticket" class="table table-striped table-bordered table-hover table-sm">
                                        <thead>
                                        </thead>
                                        <tbody id="table-ticket-body">
                                            <tr>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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

        <!-- MODAL DE ESTATUS DOMICILIACION -->
            <div class="modal fade" id="changeStatusDomiciliacionModal" tabindex="-1" aria-labelledby="changeStatusDomiciliacionModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h5 class="modal-title" id="changeStatusDomiciliacionModalLabel">Cambiar Estatus de Domiciliación</h5>
                        </div>
                        <div class="modal-body">
                            <form id="changeStatusDomiciliacionForm">
                                <div class="mb-3">
                                    <label for="modalCurrentStatusDomiciliacion" class="form-label">Estado Actual:</label>
                                    <input type="text" class="form-control" id="modalCurrentStatusDomiciliacion" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="modalNewStatusDomiciliacionSelect" class="form-label">Nuevo Estado:</label>
                                    <select class="form-select" id="modalNewStatusDomiciliacionSelect" style="width: 98%;;">
                                        <option value="">Cargando opciones...</option>
                                    </select>
                                </div>
                                <div id="errorMessageDomiciliacion" class="alert alert-danger" style="display:none;"></div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="close-button" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="saveStatusDomiciliacionChangeBtn">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL DE ESTATUS DOMICILIACION -->

        <!--MODAL PARA SUBIR EL DOCUMENTO DE CONVENIO FIRMADO-->
            <div class="modal fade" id="uploadDocumentModal" tabindex="-1" aria-labelledby="uploadDocumentModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary text-white">
                            <h5 class="modal-title" id="uploadDocumentModalLabel">
                                Subir Documento de Convenio Firmado para el Nro Ticket: <span id="modalTicketId" class="fw-bold"></span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="uploadForm">
                                <!-- Campos ocultos -->
                                <input type="hidden" id="id_ticket">
                                <input type="hidden" id="type_document">

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
                            <button type="button" class="btn btn-primary" id="uploadFileBtn" disabled>Subir Archivo</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SUBIR EL DOCUMENTO DE CONVENIO FIRMADO-->

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
                            <button type="button" class="btn btn-success" id="approveTicketFromImage">Aprobar Documento</button>
                            <button type="button" class="btn btn-danger" id="RechazoDocumento">Rechazar Documento</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->

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
                                        <span class="input-group-text" style="height: 40px;">$</span>
                                        <input type="text" id="pa_saldo_deudor" class="form-control" placeholder="0.00" style="text-align: right;" min="10.00" step="0.01">
                                    </div>
                                    <small class="text-danger" id="saldo_deudor_error" style="display: none;">El saldo mínimo es $10.00</small>
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
                                    <input type="text" id="pa_numero_cuenta" class="form-control" placeholder="XXXX-XXXX-XX-XXXX" value="XXXX-XXXX-XX-XXXX" readonly style="background-color: #f8f9fa; cursor: not-allowed;">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nombre de la Empresa</label>
                                    <input type="text" id="pa_nombre_empresa" class="form-control" placeholder="Nombre de la empresa" value="Inteligensa" readonly style="background-color: #f8f9fa; cursor: not-allowed;">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">RIF de la Empresa</label>
                                    <input type="text" id="pa_rif_empresa" class="form-control" placeholder="J-XXXXXXXX-X" value="J-00291615-0" readonly style="background-color: #f8f9fa; cursor: not-allowed;">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Banco</label>
                                    <select id="pa_banco" class="form-control">
                                        <option value="">Seleccione un banco</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Correo Electrónico</label>
                                    <input type="email" id="pa_correo" class="form-control" placeholder="correo@empresa.com" value="inteligensa@inteligensa.com" readonly style="background-color: #f8f9fa; cursor: not-allowed;">
                                </div>
                                <!-- Hidden: código de banco seleccionado -->
                                <input type="hidden" id="pa_cod_bank" value="">

                                <div class="col-12">
                                    <button type="button" class="btn btn-secondary" id="previewPaymentAgreementBtn">Previsualizar</button>
                                    <button type="button" class="btn btn-success" id="printPaymentAgreementBtn">Guardar PDF</button>
                                </div>
                                <div class="col-12" style="height: 500px; border: 2px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                                    <iframe id="paymentAgreementPreview" style="width:100%; height:100%; border:none; overflow-y: auto; overflow-x: hidden;"></iframe>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer" style="flex-shrink: 0; border-top: 1px solid #dee2e6;">
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL DE ACUERDO DE PAGO-->

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

        <input type="hidden" id="iduser" value="<?php echo $_SESSION['id_user'] ?>">
        <input type="hidden" id="idTicket">
    </main>

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