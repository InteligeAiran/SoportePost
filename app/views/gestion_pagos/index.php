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

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />

    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">

    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />
    
    <style>
        /* Estilo base para el botón de Asignar Técnico */
       .dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody {
            position: relative;
            overflow: hidden;
            width: none;
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

        .btn-secondary {
            border-radius: 0.5rem;
        }
        .form-check-label {
            font-weight: 500;
        }
       
    
        #imageViewPreview, #pdfViewViewer {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .hidden {
            display: none !important;
        }

        #BotonCerrarSelectDocument:hover{
            background-color: red;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #btnConfirmarVisualizacion{
            color: white;
            background-color: #003594;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #btnConfirmarVisualizacion:hover{
            background-color: green;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #CerrarModalVizualizar:hover{
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #botonMostarImage{
            color: white;
            background-color: #007BFF;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #botonMostarNoImage{
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #RechazoDocumento{
            color: white;
            background-color: #FF0000;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #CerrarModalMotivoRechazo:hover{
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        /* Estilos para secciones del formulario con efecto 3D */
        .form-section {
            background: white;
            border-radius: 10px;
            padding: 18px 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            border: 1px solid #e9ecef;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        /* Efecto 3D al pasar el mouse sobre las secciones */
        .form-section:hover {
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15), 
                        0 6px 12px rgba(0, 0, 0, 0.1);
            border-color: #667eea;
            background: linear-gradient(145deg, #ffffff, #f8f9fa);
        }

        /* Efecto de brillo en el borde superior al hover */
        .form-section:hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }

        .form-section-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 2px solid #f0f0f0;
            transition: all 0.3s ease;
        }

        /* Efecto en el header cuando se pasa el mouse sobre la sección */
        .form-section:hover .form-section-header {
            border-bottom-color: #667eea;
            padding-bottom: 14px;
        }

        .form-section-header i {
            font-size: 1.1rem;
            margin-right: 10px;
            color: #667eea;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            transition: all 0.3s ease;
        }

        /* Efecto en el icono al hover */
        .form-section:hover .form-section-header i {
            transform: scale(1.2) rotate(5deg);
            filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
        }

        .form-section-title {
            font-size: 1.05rem;
            font-weight: 600;
            color: #495057;
            margin: 0;
            letter-spacing: 0.3px;
            transition: all 0.3s ease;
        }

        /* Efecto en el título al hover */
        .form-section:hover .form-section-title {
            color: #667eea;
            transform: translateX(5px);
        }

        /* Estilos 3D para los campos individuales (columnas) */
        .form-section .col-md-6,
        .form-section .col-md-12,
        .form-section .col-md-3,
        .form-section .col-md-4 {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        /* Efecto 3D al pasar el mouse sobre un campo */
        .form-section .col-md-6:hover,
        .form-section .col-md-12:hover,
        .form-section .col-md-3:hover,
        .form-section .col-md-4:hover {
            transform: translateY(-3px) translateX(2px);
            z-index: 5;
        }

        /* Efecto en el label del campo al hover */
        .form-section .col-md-6:hover .form-label,
        .form-section .col-md-12:hover .form-label,
        .form-section .col-md-3:hover .form-label,
        .form-section .col-md-4:hover .form-label {
            color: #667eea;
            transform: translateX(3px);
            transition: all 0.2s ease;
        }

        /* Efecto en el input/select del campo al hover */
        .form-section .col-md-6:hover .form-control,
        .form-section .col-md-6:hover .form-select,
        .form-section .col-md-12:hover .form-control,
        .form-section .col-md-12:hover .form-select,
        .form-section .col-md-3:hover .form-control,
        .form-section .col-md-3:hover .form-select,
        .form-section .col-md-4:hover .form-control,
        .form-section .col-md-4:hover .form-select {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15),
                        0 2px 4px rgba(0, 0, 0, 0.1);
            transform: scale(1.02);
            transition: all 0.2s ease;
        }

        /* Efecto cuando el campo está enfocado (focus) */
        .form-section .form-control:focus,
        .form-section .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25),
                        0 4px 12px rgba(102, 126, 234, 0.15);
            transform: scale(1.02);
            transition: all 0.2s ease;
        }

        /* Efecto de resplandor en el icono del label al hover del campo */
        .form-section .col-md-6:hover .form-label i,
        .form-section .col-md-12:hover .form-label i,
        .form-section .col-md-3:hover .form-label i,
        .form-section .col-md-4:hover .form-label i {
            color: #667eea;
            transform: scale(1.15);
            filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.4));
            transition: all 0.2s ease;
        }

        /* Estilo para el contenedor de la tasa */
        .tasa-display {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            padding: 10px 18px;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            min-width: 160px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .tasa-display:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .tasa-display .text-muted {
            color: rgba(255, 255, 255, 0.9) !important;
            font-size: 0.75rem;
        }
        .tasa-value {
            color: #ffffff;
            font-weight: 700;
            font-size: 1.2rem;
            margin-top: 4px;
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

        /* #uploadFileBtn {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }*/

        /* ... existing styles ... */

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
    </style>
</head>
<body id="fondo" class="g-sidenav-show bg-gray-100">
    <div class="min-height-300 bg-dark position-absolute w-100"></div>
    <div class="d-lg-none fixed-top bg-dark p-2">
        <button class="btn btn-dark" id="filter-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list-task" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z" />
                <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z" />
                <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z" />
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
                                        <div class="card card-body bg-gradient-blue shadow-primary border-radius-lg pt-4 pb-3">
                                            <strong>
                                                <h5 class="text-black text-capitalize ps-3" style="color: black;">Pagos</h5>
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                                <div id="ticket-status-indicator-container"></div>
                                <table id="tabla-ticket" class="table table-striped table-bordered table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th>N°</th>
                                            <th style="width: 12%;">Nro Ticket</th>
                                            <th style="width: 12%;">RIF</th>
                                            <th style="width: 12%;">Serial Pos</th>
                                            <th style="width: 12%;">Raz&oacuten Social</th>
                                            <th style="width: 12%;">Accion del Ticket</th>
                                            <th style="width: 12%;">Técnico Asignado</th>
                                            <th>Acciones</th>
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
        </div>
    </main>

    <!-- MODAL PARA SELECCIONAR TECNICO -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div id="ModalSelecttecnico" class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel" style="color: white;">Seleccione un Técnico</h1>
                    </div>
                    <div class="modal-body">
                        <select id="idSelectionTec" class="form-select" onchange="GetRegionUser()" aria-label="Default select example"></select>
                        <div class="row mt-4">
                            <label class="col-sm-2 col-form-label">Región</label>
                        </div>
                        <input id="InputRegion" class="form-control" type="text" value="" aria-label="readonly input example" style="width: 100%;"  placeholder="Seleccione Un Técnico" disabled>
                    </div>
                    <div class="modal-footer">
                        <button id="close-button" type="button" class="btn btn-secondary">Cerrar</button>
                        <button id="assingment-button" type="button" class="btn btn-primary">Asignar</button>
                    </div>
                </div>
            </div>
        </div>
    <!--MODAL PARA SELECCIONAR TECNICO-->

    <!---- CONFIRMACION DE REASIGNACION DE TICKET -->
       <div class="modal fade" id="confirmReassignModal" tabindex="-1" aria-labelledby="confirmReassignModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg">
                    <div class="modal-header bg-gradient-primary text-white">
                        <h5 class="modal-title" id="confirmReassignModalLabel" style="color: white;">Confirmar Reasignación</h5>
                    </div>
                    <div class="modal-body text-center py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#ffc107" class="bi bi-exclamation-triangle-fill mx-auto mb-3" viewBox="0 0 16 16">
                            <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/>
                        </svg>
                        <p class="fs-5">¿Está seguro que desea reasignar el ticket Nro. <span id="ticketNumberSpan"></span>Asociado al Pos con el serial <span id="ticketserialPos"></span>?</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" id="noConfirm" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-primary" id="confirmReassignYesBtn">Sí</button>
                    </div>
                </div>
            </div>
        </div>
    <!---- END CONFIRMACION DE REASIGNACION DE TICKET -->

    <!-- MODAL PARA SELECCIONAR TECNICO EN REASIGNACION DE TECNICO -->
        <div class="modal fade" id="selectTechnicianModal" tabindex="-1" aria-labelledby="selectTechnicianModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg rounded">
                    <div class="modal-header bg-gradient-primary text-white p-3">
                        <h5 class="modal-title" id="selectTechnicianModalLabel">
                            <i class="bi bi-person-plus-fill me-2"></i> Seleccione Técnico
                        </h5>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Técnico actual:</strong>
                                <p id="currentTechnicianDisplay" class="form-control-plaintext text-muted"></p>
                            </div>
                            <div class="col-md-6">
                                <strong>Fecha de asignación:</strong>
                                <span id="currentAssignmentDateDisplay" class="form-control-plaintext text-muted">N/A</span>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-12">
                                <strong>Región:</strong>
                                <span id="currentRegion" class="form-control-plaintext text-muted">N/A</span>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="technicianSelect" class="form-label fw-bold">Seleccione nuevo técnico:</label>
                            <select class="form-select" id="technicianSelect"></select>
                        </div>
                        <div class="row mb-4">
                            <label for="InputRegionUser2" class="form-label fw-bold">Región del Técnico Seleccionado:</label>
                            <input class="form-control" id="InputRegionUser2" placeholder="Seleccione un Técnico" disabled></input>
                        </div>
                        <div class="mb-3">
                            <label for="reassignObservation" class="form-label fw-bold">Observación (Opcional):</label>
                            <textarea class="form-control" id="reassignObservation" rows="3" placeholder="Añada cualquier observación relevante para la reasignación..."></textarea>
                        </div>

                    </div>
                    <div class="modal-footer justify-content-center border-top-0 pt-0 pb-4">
                        <button type="button" id="ButtonCancel" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="assignTechnicianBtn">Asignar</button>
                    </div>
                </div>
            </div>
        </div>
    <!------ END MODAL PARA SELECCIONAR TECNICO EN REACCIGNACION DE TECNICO -->


    <!--MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->
        <div class="modal fade" id="visualizarImagenModal" tabindex="-1" aria-labelledby="visualizarImagenModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="visualizarImagenModalLabel">Seleccione la imagen que desea visualizar:</h5>
                    </div>
                    <div class="modal-body">

                        <div class="form-check"><br>
                            <input class="form-check-input" type="radio" name="opcionImagen" id="imagenPago" value="Anticipo">
                            <label class="form-check-label" for="imagenPago" id="labelPago">
                                Documento de Pago
                            </label>
                        </div>
                        <div class="form-check"><br>
                            <input class="form-check-input" type="radio" name="opcionImagen" id="imagenPresupuesto" value="presupuesto">
                            <label class="form-check-label" for="imagenPresupuesto" id="labelPresupuesto">
                                Documento de Presupuesto
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="BotonCerrarSelectDocument">Cerrar</button>
                        <button type="button" class="btn btn-primary" id="btnConfirmarVisualizacion">Visualizar</button>
                    </div>
                </div>
            </div>
        </div>
    <!--END MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->


    <!-- MODAL PAGO PRESUPUESTO -->
        <div class="modal fade" id="modalPagoPresupuesto" tabindex="-1" aria-labelledby="modalPagoPresupuestoLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 95vh; display: flex; flex-direction: column;">
                    <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0; padding: 15px 25px; flex-shrink: 0;">
                        <input type="hidden" id="ticketIdPago" value="">
                        <input type="hidden" id="presupuestoIdPago" value="">
                        <div class="d-flex justify-content-between align-items-center w-100">
                             <h5 class="modal-title mb-0" id="modalPagoPresupuestoLabel" style="font-weight: 600; font-size: 1.3rem;">
                                <i class="fas fa-money-bill-wave me-2"></i>Pagos Asociados al
                            </h5>
                             <div class="d-flex align-items-center gap-3">
                                <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 8px 15px;">
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-ticket-alt me-2"></i>
                                        <span id="ticketNumeroPago" style="font-weight: 600;">Ticket #</span>
                                    </div>
                                </div>
                                <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 10px 15px; min-width: 180px;">
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-dollar-sign me-2"></i>
                                        <div>
                                            <small style="opacity: 0.9; font-size: 0.75rem; display: block;">Monto a Pagar</small>
                                            <h5 class="mb-0 fw-bold" id="montoEquipo" style="font-size: 1.1rem;">$0.00</h5>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" class="btn-close btn-close-white" id="btnClosePagoPresupuesto" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-body" style="padding: 20px; background: #f8f9fa; overflow-y: auto; overflow-x: hidden; flex: 1;">
                        <form id="formPagoPresupuesto">
                            <input type="hidden" id="id_user_pago" name="userId" value="<?php echo isset($_SESSION['id_user']) ? $_SESSION['id_user'] : ''; ?>">
                         
                            <!-- MONTO ABONADO SECTION -->
                            <div class="payment-summary-card mb-3" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                <h6 style="color: white; margin-bottom: 10px; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Monto Abonado</h6>
                                <h3 id="montoAbonado" style="color: white; font-size: 2rem; font-weight: 700; margin: 0;">$0.00</h3>
                                <small id="montoRestante" style="color: rgba(255, 255, 255, 0.9); font-size: 0.85rem; display: block; margin-top: 8px;">Restante: $0.00</small>
                            </div>

                            <!-- BLOQUE 1: INFORMACIÓN DEL CLIENTE -->
                             <div class="form-section">
                                <div class="form-section-header">
                                    <i class="fas fa-user-circle"></i>
                                    <h6 class="form-section-title" style="color: black;">Información del Cliente</h6>
                                </div>
                                <div class="row g-2">
                                     <div class="col-md-6 mb-2">
                                        <label for="displayRazonSocial" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-building me-1 text-primary"></i>Razón Social
                                        </label>
                                        <input type="text" class="form-control bg-light" id="displayRazonSocial" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="displayRif" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-id-card me-1 text-primary"></i>RIF
                                        </label>
                                        <input type="text" class="form-control bg-light" id="displayRif" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                </div>
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="serialPosPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-barcode me-1 text-primary"></i>Serial POS
                                        </label>
                                        <input type="text" class="form-control bg-light" id="serialPosPago" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                     <div class="col-md-6 mb-2">
                                        <label for="displayEstatusPos" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-signal me-1 text-primary"></i>Estatus POS
                                        </label>
                                        <input type="text" class="form-control bg-light" id="displayEstatusPos" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                </div>
                            </div>

                            <!-- BLOQUE 2: INFORMACIÓN DE PAGO -->
                            <div class="form-section">
                                <div class="form-section-header d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center">
                                         <i class="fas fa-money-bill-wave"></i>
                                         <h6 class="form-section-title me-3" style="color: black; margin-bottom: 0;">Información de Pago</h6>
                                    </div>
                                     <!-- Tasa del Día Integrada -->
                                    <div class="tasa-display" style="padding: 5px 12px;">
                                        <div class="text-end">
                                            <span class="text-muted d-block" id="fechaTasaDisplay" style="font-size: 0.7rem;">
                                                <i class="fas fa-calendar-day me-1"></i><?php echo date('d/m/Y'); ?>
                                            </span>
                                            <span class="tasa-value d-block" id="tasaDisplayValue" style="font-size: 1rem; margin-top: 0;">
                                                Cargando...
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <style>
                                    .currency-suffix {
                                        position: absolute;
                                        right: 15px;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        color: #6c757d;
                                        font-weight: 500;
                                        pointer-events: none;
                                        font-size: 0.9rem;
                                    }
                                    
                                    /* Ensure disabled amount fields have consistent styling */
                                    #montoBs:disabled,
                                    #montoRef:disabled {
                                        background-color: #e9ecef !important;
                                        cursor: not-allowed !important;
                                        border-color: #ced4da !important;
                                        opacity: 1 !important;
                                        color: #6c757d !important;
                                    }
                                    
                                    #montoBs:disabled:focus,
                                    #montoRef:disabled:focus {
                                        border-color: #ced4da !important;
                                        box-shadow: none !important;
                                        outline: none !important;
                                    }
                                </style>
                                <div class="row g-2 mt-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="fechaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-calendar-alt me-1 text-primary"></i>Fecha Pago <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="date" class="form-control" id="fechaPago" placeholder="dd/mm/aaaa" required style="font-size: 0.95rem; padding: 8px 12px;" onchange="loadExchangeRateToday(this.value);" onclick="loadExchangeRateToday(this.value);">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="formaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-credit-card me-1 text-primary"></i>Forma pago <span style="color: #dc3545;">*</span>
                                        </label>
                                        <select class="form-select" id="formaPago" required style="font-size: 0.95rem; padding: 8px 12px;">
                                            <option value="">Seleccione</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="moneda" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-coins me-1 text-primary"></i>Moneda <span style="color: #dc3545;">*</span>
                                        </label>
                                        <select class="form-select" id="moneda" required style="font-size: 0.95rem; padding: 8px 12px;">
                                            <option value="">Seleccionar</option>
                                            <option value="bs">Bolívares (Bs)</option>
                                            <option value="usd">Dólares (USD)</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-money-bill me-1 text-primary"></i>Monto Bs
                                        </label>
                                        <div class="position-relative">
                                            <input type="number" class="form-control" id="montoBs" step="0.01" placeholder="0.00" disabled style="font-size: 0.95rem; padding: 8px 12px; padding-right: 40px; background-color: #e9ecef; cursor: not-allowed;">
                                            <span class="currency-suffix" id="montoBsSuffix" style="display: none;">Bs</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-exchange-alt me-1 text-primary"></i>Monto REF
                                        </label>
                                        <div class="position-relative">
                                            <input type="number" class="form-control" id="montoRef" step="0.01" placeholder="0.00" disabled style="font-size: 0.95rem; padding: 8px 12px; padding-right: 40px; background-color: #e9ecef; cursor: not-allowed;">
                                            <span class="currency-suffix" id="montoRefSuffix" style="display: none;">USD</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-hashtag me-1 text-primary"></i>Referencia <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="text" class="form-control" id="referencia" placeholder="Número de referencia" pattern="[0-9]*" inputmode="numeric" required style="font-size: 0.95rem; padding: 8px 12px;">
                                    </div>
                                </div>
                                
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-user me-1 text-primary"></i>Depositante <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="text" class="form-control" id="depositante" placeholder="Nombre del depositante" required style="font-size: 0.95rem; padding: 8px 12px;">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-sticky-note me-1 text-primary"></i>Obs. Administración <span>*</span>
                                        </label>
                                        <input type="text" class="form-control" id="obsAdministracion" placeholder="Observaciones de administración" style="font-size: 0.95rem; padding: 8px 12px;">
                                    </div>
                                    <input type="hidden" id="estatus" value="">
                                    <input type="hidden" id="payment_id_to_save" name="payment_status">
                                </div>
                                
                                <!-- Información Adicional Integrada (Registro, Fecha Carga) -->
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="registro" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-book me-1 text-primary"></i>Registro
                                        </label>
                                        <input type="text" class="form-control" id="registro" placeholder="Generado autom." readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; cursor: not-allowed;">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="fechaCarga" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-calendar-check me-1 text-primary"></i>Fecha carga <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="date" class="form-control" id="fechaCarga" required readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; cursor: not-allowed;">
                                    </div>
                                </div>

                                <!-- Bancos and Pago Movil Fields Hidden by Default -->
                                <div class="row g-2" id="bancoFieldsContainer" style="display: none;">
                                    <div class="col-md-6 mb-2">
                                        <label for="bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-university me-1 text-primary"></i>Banco Origen
                                        </label>
                                        <select class="form-select" id="bancoOrigen" required style="font-size: 0.95rem; padding: 8px 12px;">
                                            <option value="">Seleccione</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="bancoDestino" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <i class="fas fa-building me-1 text-primary"></i>Banco Destino
                                        </label>
                                        <select class="form-select" id="bancoDestino" required style="font-size: 0.95rem; padding: 8px 12px;">
                                            <option value="">Seleccione</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <!-- Sección: Datos de Pago Móvil -->
                                <div id="pagoMovilFieldsContainer" style="display: none; margin-top: 15px;">
                                    <div class="row g-2">
                                        <!-- Origen -->
                                        <div class="col-md-6 mb-3">
                                            <div class="card border-success" style="border-width: 1px;">
                                                <div class="card-header bg-success text-white py-2">
                                                    <h6 class="mb-0" style="font-size: 0.9rem; font-weight: 600;">
                                                        <i class="fas fa-arrow-circle-up me-2"></i>Origen
                                                    </h6>
                                                </div>
                                                <div class="card-body p-3">
                                                    <div class="mb-2">
                                                        <label for="origenRifTipo" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <i class="fas fa-id-card me-1 text-primary"></i>RIF
                                                        </label>
                                                        <div class="d-flex gap-2">
                                                            <select class="form-select" id="origenRifTipo" required style="font-size: 0.9rem; padding: 6px 10px; width: 30%;">
                                                                <option value="">Tipo</option>
                                                                <option value="J">J</option>
                                                                <option value="V">V</option>
                                                                <option value="E">E</option>
                                                                <option value="G">G</option>
                                                                <option value="P">P</option>
                                                            </select>
                                                            <input type="text" class="form-control" id="origenRifNumero" placeholder="Número RIF" pattern="[0-9]*" inputmode="numeric" required style="font-size: 0.9rem; padding: 6px 10px; width: 70%;">
                                                        </div>
                                                    </div>
                                                    <div class="mb-2">
                                                        <label for="origenTelefono" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <i class="fas fa-phone me-1 text-primary"></i>Nro. Telefónico
                                                        </label>
                                                        <input type="text" class="form-control" id="origenTelefono" placeholder="Ej: 0412-1234567" pattern="[0-9\-]*" inputmode="numeric" required style="font-size: 0.9rem; padding: 6px 10px;">
                                                    </div>
                                                    <div>
                                                        <label for="origenBanco" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <i class="fas fa-university me-1 text-primary"></i>Banco
                                                        </label>
                                                        <select class="form-select" id="origenBanco" required style="font-size: 0.9rem; padding: 6px 10px;">
                                                            <option value="">Seleccione</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Destino -->
                                        <div class="col-md-6 mb-3">
                                            <div class="card border-primary" style="border-width: 1px;">
                                                <div class="card-header bg-primary text-white py-2">
                                                    <h6 class="mb-0" style="font-size: 0.9rem; font-weight: 600;">
                                                        <i class="fas fa-arrow-circle-down me-2"></i>Destino
                                                    </h6>
                                                </div>
                                                <div class="card-body p-3">
                                                    <div class="mb-2">
                                                        <label for="destinoRifTipo" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <i class="fas fa-id-card me-1 text-primary"></i>RIF
                                                        </label>
                                                        <div class="d-flex gap-2">
                                                            <select class="form-select" id="destinoRifTipo" required disabled style="font-size: 0.9rem; padding: 6px 10px; width: 30%; background-color: #e9ecef;">
                                                                <option value="">Tipo</option>
                                                                <option value="J" selected>J</option>
                                                                <option value="V">V</option>
                                                                <option value="E">E</option>
                                                                <option value="G">G</option>
                                                                <option value="P">P</option>
                                                            </select>
                                                            <input type="text" class="form-control" id="destinoRifNumero" placeholder="Número RIF" pattern="[0-9]*" inputmode="numeric" required value="002916150" readonly style="font-size: 0.9rem; padding: 6px 10px; width: 70%; background-color: #e9ecef;">
                                                        </div>
                                                    </div>
                                                    <div class="mb-2">
                                                        <label for="destinoTelefono" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <i class="fas fa-phone me-1 text-primary"></i>Nro. Telefónico
                                                        </label>
                                                        <input type="text" class="form-control" id="destinoTelefono" placeholder="Ej: 0412-1234567" pattern="[0-9\-]*" inputmode="numeric" required value="04122632231" readonly style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef;">
                                                    </div>
                                                    <div>
                                                        <label for="destinoBanco" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <i class="fas fa-university me-1 text-primary"></i>Banco
                                                        </label>
                                                        <select class="form-select" id="destinoBanco" required disabled style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef;">
                                                            <option value="">Seleccione</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- BLOQUE 3: HISTORIAL DE PAGOS -->
                            <div class="form-section mt-3">
                                <div class="form-section-header">
                                    <i class="fas fa-history"></i>
                                    <h6 class="form-section-title">Historial de Pagos</h6>
                                </div>
                                <div class="table-responsive" style="max-height: 250px; overflow-y: auto; overflow-x: auto; border: 1px solid #dee2e6; border-radius: 4px;">
                                    <table class="table table-sm table-hover mb-0" id="paymentHistoryTable" style="font-size: 0.85rem;">
                                        <thead style="position: sticky; top: 0; background-color: #f8f9fa; z-index: 1;">
                                            <tr>
                                                <th style="padding: 8px; white-space: nowrap;">N°</th>
                                                <th style="padding: 8px; white-space: nowrap;">Registro</th>
                                                <th style="padding: 8px; white-space: nowrap;">Fecha Pago</th>
                                                <th style="padding: 8px; white-space: nowrap;">Método</th>
                                                <th style="padding: 8px; white-space: nowrap;">Moneda</th>
                                                <th style="padding: 8px; white-space: nowrap;">Monto Bs</th>
                                                <th style="padding: 8px; white-space: nowrap;">Monto Ref</th>
                                                <th style="padding: 8px; white-space: nowrap;">Referencia</th>
                                                <th style="padding: 8px; white-space: nowrap;">Depositante</th>
                                                <th style="padding: 8px; white-space: nowrap;">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody id="paymentHistoryBody">
                                            <tr>
                                                <td colspan="9" class="text-center text-muted" style="padding: 20px;">
                                                    <i class="fas fa-info-circle me-1"></i>No hay pagos registrados
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- BLOQUE 4: EXTRA (COMPACTO) -->
                            <div class="form-section container-extra mt-3" style="border: none; background: transparent; padding: 0; box-shadow: none;">
                                <div class="card border-light shadow-sm">
                                    <div class="card-header bg-light py-2">
                                        <h6 class="mb-0 text-dark" style="font-size: 0.95rem; font-weight: 600;">
                                            <i class="fas fa-folder-open me-2 text-primary"></i>Documentos
                                        </h6>
                                    </div>
                                    <div class="card-body p-3">
                                        <button type="button" class="btn btn-outline-primary w-100" id="btnVerPresupuestoModal" title="Ver Documento de Presupuesto">
                                            <i class="fas fa-file-pdf me-2"></i>Ver Documento de Presupuesto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-radius: 0 0 12px 12px; padding: 15px 25px; border-top: 1px solid #dee2e6; flex-shrink: 0;">
                    <button type="button" class="btn btn-secondary px-4" id="btnCancelarPagoPresupuesto" data-bs-dismiss="modal" style="font-size: 0.95rem; padding: 8px 20px;">
                        <i class="fas fa-times me-2"></i>Cancelar
                    </button>
                    <button type="button" class="btn btn-primary px-4" id="btnGuardarPagoPresupuesto" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; font-size: 0.95rem; padding: 8px 20px;">
                        <i class="fas fa-save me-2"></i>Guardar Pago
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL PAGO PRESUPUESTO -->
    <!-- MODAL PARA VIZUALIZAR EL MODAL -->
        <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="viewDocumentModalLabel">Visualizando Documento - Ticket: <span id="viewModalTicketId"></span></h5>
                    </div>
                    <div class="modal-body text-center">
                        <h6 id="NombreImage" class="mb-3" style="color: black;"></h6>
                        <div id="viewDocumentMessage" class="alert alert-warning hidden" role="alert"></div>
                        <img id="imageViewPreview" class="img-fluid" alt="Previsualización de la imagen" style="display: none;">
                        <div id="pdfViewViewer" style="width: 100%; height: 70vh; display: none;"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="CerrarModalVizualizar">Cerrar</button>
                        <button type="button" class="btn btn-danger" id="RechazoDocumento">Rechazar Documento</button>
                    </div>
                </div>
            </div>
        </div>
    <!-- END MODAL PARA VIZUALIZAR EL MODAL -->

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

    <!-- MODAL EDITAR PAGO -->
    <div class="modal fade" id="editPaymentModal" tabindex="-1" aria-labelledby="editPaymentModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div class="modal-header bg-gradient-primary" style="color: white; border-radius: 12px 12px 0 0; padding: 15px 25px;">
                    <h5 class="modal-title mb-0" id="editPaymentModalLabel" style="font-weight: 600; color: white;">
                        <i class="fas fa-edit me-2"></i>Editar Pago
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding: 20px; background: #f8f9fa;">
                    <form id="formEditPayment">
                        <input type="hidden" id="edit_payment_id">
                        
                        <!-- BLOQUE 1: INFORMACIÓN DE PAGO -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <h6 class="form-section-title" style="color: black; margin-bottom: 0;">Detalles del Pago</h6>
                            </div>

                            <div class="row g-2 mt-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_fechaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-calendar-alt me-1 text-primary"></i>Fecha Pago
                                    </label>
                                    <input type="date" class="form-control" id="edit_fechaPago">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_formaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-credit-card me-1 text-primary"></i>Forma pago <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="edit_formaPago" required>
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_moneda" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-coins me-1 text-primary"></i>Moneda <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="edit_moneda" required>
                                        <option value="bs">Bolívares (Bs)</option>
                                        <option value="usd">Dólares (USD)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-money-bill me-1 text-primary"></i>Monto Bs
                                    </label>
                                    <input type="number" class="form-control" id="edit_montoBs" step="0.01">
                                </div>
                            </div>

                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-exchange-alt me-1 text-primary"></i>Monto REF
                                    </label>
                                    <input type="number" class="form-control" id="edit_montoRef" step="0.01">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-hashtag me-1 text-primary"></i>Referencia <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="edit_referencia" required>
                                </div>
                            </div>
                            
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-user me-1 text-primary"></i>Depositante <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="edit_depositante" required>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-sticky-note me-1 text-primary"></i>Obs. Administración
                                    </label>
                                    <input type="text" class="form-control" id="edit_obsAdministracion">
                                </div>
                            </div>

                            <!-- Bancos -->
                            <div class="row g-2" id="edit_bancoFieldsContainer">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-university me-1 text-primary"></i>Banco Origen
                                    </label>
                                    <select class="form-select" id="edit_bancoOrigen">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_bancoDestino" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                    <select class="form-select" id="edit_bancoDestino">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Mobile Payment Fields -->
                            <div class="row g-2 mt-2" id="edit_pagoMovilFieldsContainer" style="display: none;">
                                <div class="col-md-6 mb-2">
                                     <label class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-id-card me-1 text-primary"></i>RIF Origen
                                    </label>
                                    <input type="text" class="form-control" id="edit_origenRifNumero" placeholder="Número RIF">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-phone me-1 text-primary"></i>Teléfono Origen
                                    </label>
                                    <input type="text" class="form-control" id="edit_origenTelefono" placeholder="0412-1234567">
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-radius: 0 0 12px 12px; padding: 15px 25px;">
                    <button type="button" class="btn btn-secondary px-4" id="btnCancelEditPayment">Cancelar</button>
                    <button type="button" class="btn btn-primary px-4" id="btnUpdatePayment">Actualizar Pago</button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL EDITAR PAGO -->

    <!--button type="button" class="btn btn-primary" id="reassignTicketBtn" data-ticket-id="2">
        <i class="bi bi-person-gear"></i> Reasignar Ticket
    </button-->

    <input type="hidden" id="id_user" value="<?php echo $_SESSION['id_user'] ?? ''; ?>"/>

        <!-- Github buttons -->
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        <!-- Control Center for Soft Dashboard: parallax effects, scripts for the example pages etc -->
        <!-- Bootstrap core JavaScript-->
        <!--JQUERY-->

        <script src="<?php echo APP; ?>app/core/components/ticket/js/ticket-utils.js"></script>

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