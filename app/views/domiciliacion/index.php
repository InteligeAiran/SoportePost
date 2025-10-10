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



    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />

    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/DataTable/dataTables.min.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />

    <style>
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
                                <div class="table-responsive">
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
            <div class="modal fade" id="uploadDocumentModal" tabindex="-1" aria-labelledby="uploadDocumentModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); display: none;">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="uploadDocumentModalLabel">Subir
                                    Documento de Convenio Firmado para el Nro Ticket: <span id="modalTicketId"></span></h5>
                                <input type="hidden" id="id_ticket"></input>
                                <input type="hidden" id="type_document"></input>
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
                            <button type="button" class="btn btn-secondary" id="CerrarBoton">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="uploadFileBtn">Subir</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SUBIR EL DOCUMENTO DE CONVENIO FIRMADO-->

        <!-- MODAL PARA GENERAR CONVENIO FIRMADO -->
        <div class="modal fade" id="generateConvenioModal" tabindex="-1" aria-labelledby="generateConvenioModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title text-lg font-semibold text-gray-800" id="generateConvenioModalLabel">
                            Generar Documento de Convenio Firmado
                        </h5>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
                            <i class="fas fa-file-contract fa-3x text-primary mb-3"></i>
                            <h4 class="text-gray-800 mb-3">Genere el documento del convenio para después subirlo</h4>
                            <p class="text-gray-600 mb-4">
                                Por Favor genere el documento de Convenio Firmado para el ticket seleccionado. 
                                Una vez generado, podrá subirlo al sistema.
                            </p>
                        </div>
                        <input type="hidden" id="generate_id_ticket" value="">
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-warning" id="generateNotaEntregaBtn">Generar Convenio Firmado</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- END MODAL PARA GENERAR CONVENIO FIRMADO -->

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

        <input type="hidden" id="iduser" value="<?php echo $_SESSION['id_user'] ?>">
        <input type="hidden" id="idTicket">
    </main>

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
                <a class="btn bg-gradient-dark w-100" href="https://www.creative-tim.com/product/argon-dashboard">Free
                    Download</a>
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