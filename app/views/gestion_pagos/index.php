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
            content: 'âš ï¸';
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
                                                <h5 class="text-black text-capitalize ps-3" style="color: black;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-wallet2 me-2" viewBox="0 0 16 16"><path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.5-1.5H2V1.78a1.5 1.5 0 0 1 1.864-1.454zM3 3h9v-1.146a.5.5 0 0 0-.623-.484L3.136 2.518A.5.5 0 0 0 3 3m9 1H1.5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/></svg>Pagos</h5>
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
                        <strong><p>Selecciona un ticket de la tabla para ver sus detalles Aquí.</p></strong>
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
                        <h1 class="modal-title fs-5" id="staticBackdropLabel" style="color: white;"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-person-badge me-2" viewBox="0 0 16 16"><path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492z"/></svg>Seleccione un Técnico</h1>
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
                        <h5 class="modal-title" id="confirmReassignModalLabel" style="color: white;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left-right me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>Confirmar Reasignación</h5>
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
                        <h5 class="modal-title" id="visualizarImagenModalLabel"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-images me-2" viewBox="0 0 16 16"><path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/><path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2zM13.002 5a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1z"/><path d="M14.002 5h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>Seleccione la imagen que desea visualizar:</h5>
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Pagos Asociados al
                            </h5>
                             <div class="d-flex align-items-center gap-3">
                                <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 8px 15px;">
                                    <div class="d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ticket-perforated me-2" viewBox="0 0 16 16"><path d="M4 4.85v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9z"/><path d="M1.5 3a.5.5 0 0 0-.5.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 1 0 0 3 .5.5 0 0 1 .5.5v2.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 0 0 0-3 .5.5 0 0 1-.5-.5V3.5a.5.5 0 0 0-.5-.5zM2 4h12v2.041A2.5 2.5 0 0 0 14.04 10V12H2V9.959A2.5 2.5 0 0 0 1.96 5.959z"/></svg>
                                        <span id="ticketNumeroPago" style="font-weight: 600;">Ticket #</span>
                                    </div>
                                </div>
                                <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 10px 15px; min-width: 180px;">
                                    <div class="d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar me-2" viewBox="0 0 16 16"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.051zm1.591 2.103c1.396.336 1.906.908 1.906 1.712 0 .932-.704 1.704-2.004 1.86V8.718l.1.026z"/></svg>
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
                            <input type="hidden" id="pago_nro_ticket_hidden" name="nro_ticket">
                            <input type="hidden" id="pago_serial_pos_hidden" name="serial_pos">
                         
                            <!-- MONTO ABONADO SECTION -->
                            <!-- MONTO ABONADO SECTION -->
                            <div class="row mb-3">
                                <!-- Card: Monto del Presupuesto -->
                                <div class="col-6">
                                    <div class="payment-summary-card" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3); height: 100%;">
                                        <h6 style="color: white; margin-bottom: 10px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Monto Presupuesto</h6>
                                        <h3 id="montoPresupuestoDisplay" style="color: white; font-size: 1.8rem; font-weight: 700; margin: 0;">$0.00</h3>
                                    </div>
                                </div>
                                
                                <!-- Card: Monto Abonado -->
                                <div class="col-6">
                                    <div class="payment-summary-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); height: 100%;">
                                        <h6 style="color: white; margin-bottom: 10px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Monto Abonado</h6>
                                        <h3 id="montoAbonado" style="color: white; font-size: 1.8rem; font-weight: 700; margin: 0;">$0.00</h3>
                                        <small id="montoRestante" style="color: rgba(255, 255, 255, 0.9); font-size: 0.75rem; display: block; margin-top: 8px;">Restante: $0.00</small>
                                    </div>
                                </div>
                            </div>

                            <!-- BLOQUE 1: INFORMACIÓN DEL CLIENTE -->
                             <div class="form-section">
                                <div class="form-section-header">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-circle me-2" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>
                                    <h6 class="form-section-title" style="color: black;">Información del Cliente</h6>
                                </div>
                                <div class="row g-2">
                                     <div class="col-md-6 mb-2">
                                        <label for="displayRazonSocial" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-building me-1 text-primary" viewBox="0 0 16 16"><path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/><path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/></svg>Razón Social
                                        </label>
                                        <input type="text" class="form-control bg-light" id="displayRazonSocial" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="displayRif" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                        </label>
                                        <input type="text" class="form-control bg-light" id="displayRif" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                </div>
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="serialPosPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-barcode me-1 text-primary" viewBox="0 0 16 16"><path d="M1 11.107V4.893C1 4.4 1.398 4 1.889 4H14.11C14.6 4 15 4.398 15 4.893v6.214C15 11.6 14.602 12 14.111 12H1.89C1.4 12 1 11.602 1 11.107ZM1.889 5v6h12.222V5H1.889Z"/><path d="M2 5v6h1V5H2Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1ZM11 5v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Z"/></svg>Serial POS
                                        </label>
                                        <input type="text" class="form-control bg-light" id="serialPosPago" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                     <div class="col-md-6 mb-2">
                                        <label for="displayEstatusPos" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-broadcast-pin me-1 text-primary" viewBox="0 0 16 16"><path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656 0a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 0 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.122a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.314.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>Estatus POS
                                        </label>
                                        <input type="text" class="form-control bg-light" id="displayEstatusPos" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                </div>
                            </div>

                            <!-- BLOQUE 2: INFORMACIÓN DE PAGO -->
                            <div class="form-section">
                                <div class="form-section-header d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>
                                         <h6 class="form-section-title me-3" style="color: black; margin-bottom: 0;">Información de Pago</h6>
                                    </div>
                                     <!-- Tasa del Día Integrada -->
                                    <div class="tasa-display" style="padding: 5px 12px;">
                                        <div class="text-end">
                                            <span class="text-muted d-block" id="fechaTasaDisplay" style="font-size: 0.7rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-calendar-day me-1" viewBox="0 0 16 16"><path d="M4.684 11.523v-2.3h2.261v-.61H4.684V6.801h2.464v-.61H4V11.523h.684Zm3.296 0h.676V8.98c0-.554.227-1.007.953-1.007.125 0 .258.004.329.015v-.613a1.806 1.806 0 0 0-.254-.02c-.582 0-.891.32-.934.71h-.027v-.672h-.643v4.131Z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg><?php echo date('d/m/Y'); ?>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-calendar-event me-1 text-primary" viewBox="0 0 16 16"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>Fecha Pago <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="date" class="form-control" id="fechaPago" placeholder="dd/mm/aaaa" required style="font-size: 0.95rem; padding: 8px 12px;" onchange="loadExchangeRateToday(this.value);" onclick="loadExchangeRateToday(this.value);">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="formaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-credit-card me-1 text-primary" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></svg>Forma pago <span style="color: #dc3545;">*</span>
                                        </label>
                                        <select class="form-select" id="formaPago" required style="font-size: 0.95rem; padding: 8px 12px;">
                                            <option value="">Seleccione</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="moneda" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin me-1 text-primary" viewBox="0 0 16 16"><path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.606v-.706c1.318-.094 2.074-.815 2.074-1.84 0-1.027-.664-1.59-1.983-1.84l-.521-.102v-2.04c.592.063.977.371 1.056.896h.695c-.073-.914-.847-1.562-2.103-1.645V4h-.606v.681c-1.188.084-1.815.713-1.815 1.591 0 .872.613 1.408 1.612 1.622l.466.1v2.281c-.563-.064-.974-.361-1.064-.927zm2.467-3.791c-.53.116-.835.418-.835.83 0 .413.293.689.835.818v-1.648zM8.235 10.3c.595-.122.946-.439.946-.867 0-.416-.299-.7-.946-.822v1.689z"/><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/></svg>Moneda <span style="color: #dc3545;">*</span>
                                        </label>
                                        <select class="form-select" id="moneda" required style="font-size: 0.95rem; padding: 8px 12px;">
                                            <option value="">Seleccionar</option>
                                            <option value="bs">Bolívares (Bs)</option>
                                            <option value="usd">Dólares (USD)</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-cash me-1 text-primary" viewBox="0 0 16 16"><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Monto Bs
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-left-right me-1 text-primary" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>Monto REF
                                        </label>
                                        <div class="position-relative">
                                            <input type="number" class="form-control" id="montoRef" step="0.01" placeholder="0.00" disabled style="font-size: 0.95rem; padding: 8px 12px; padding-right: 40px; background-color: #e9ecef; cursor: not-allowed;">
                                            <span class="currency-suffix" id="montoRefSuffix" style="display: none;">USD</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-hash me-1 text-primary" viewBox="0 0 16 16"><path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.125 0 .257-.012.387-.03.512-.073.89-.457.89-1.012 0-.579-.344-.954-.833-1.012l-.082-.007h-1.273l.33-1.587c.017-.077.025-.15.025-.225 0-.335-.224-.543-.532-.543-.298 0-.511.171-.577.502l-.339 1.853H7.833l.33-1.587c.017-.077.026-.15.026-.225 0-.335-.225-.543-.532-.543-.298 0-.512.171-.578.502l-.339 1.853H5.3l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587Z"/></svg>Referencia <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="text" class="form-control" id="referencia" placeholder="Número de referencia" pattern="[0-9]*" inputmode="numeric" required style="font-size: 0.95rem; padding: 8px 12px;">
                                    </div>
                                </div>
                                
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-person me-1 text-primary" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>Depositante <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="text" class="form-control" id="depositante" placeholder="Nombre del depositante" required style="font-size: 0.95rem; padding: 8px 12px;">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-sticky me-1 text-primary" viewBox="0 0 16 16"><path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H10a1.5 1.5 0 0 0-1.5 1.5v3.5H2.5a.5.5 0 0 1-.5-.5zm7 8V9.5a.5.5 0 0 1 .5-.5h3.5z"/></svg>Obs. Administración <span>*</span>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-book me-1 text-primary" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.933-.575-2.203-.923-3.41-.811-1.144.106-2.191.46-2.823.71V2.828A5 5 0 0 1 3.5 2c.421 0 .817.027 1.168.077zM11.5 2c.656 0 1.323.058 1.958.163.633.105 1.15.257 1.484.414l.058.03v9.553c-.333-.157-.851-.31-1.484-.414A14.3 14.3 0 0 0 11.5 12c-1.207 0-2.477.106-3.41.811V3.13c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v-.441zm0-1c-1.39 0-2.72.311-3.911.812A9.2 9.2 0 0 0 4.5 1c-1.54 0-3.04.347-4.13.795A1 1 0 0 0 0 2.715v10.928a.5.5 0 0 0 .708.453c1.16-.547 2.65-.923 4.292-.821C6.273 13.376 7.5 14 8 14s1.727-.624 3.003-1.272c1.642-.102 3.132.274 4.29.821a.5.5 0 0 0 .707-.453V2.716a1 1 0 0 0-.37-.716A11.7 11.7 0 0 0 11.5 1"/></svg>Registro
                                        </label>
                                        <input type="text" class="form-control" id="registro" placeholder="Generado autom." readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; cursor: not-allowed;">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="fechaCarga" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-calendar-check me-1 text-primary" viewBox="0 0 16 16"><path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>Fecha carga <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="date" class="form-control" id="fechaCarga" required readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; cursor: not-allowed;">
                                    </div>
                                </div>

                                <!-- Bancos and Pago Movil Fields Hidden by Default -->
                                <div class="row g-2" id="bancoFieldsContainer" style="display: none;">
                                    <div class="col-md-6 mb-2">
                                        <label for="bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco Origen
                                        </label>
                                        <select class="form-select" id="bancoOrigen" required style="font-size: 0.95rem; padding: 8px 12px;">
                                            <option value="">Seleccione</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="bancoDestino" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-building me-1 text-primary" viewBox="0 0 16 16"><path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/><path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/></svg>Banco Destino
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
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/></svg>Origen
                                                    </h6>
                                                </div>
                                                <div class="card-body p-3">
                                                    <div class="mb-2" style="display: none;">
                                                        <label for="origenRifTipo" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                                        </label>
                                                        <div class="d-flex gap-2">
                                                            <select class="form-select" id="origenRifTipo" style="font-size: 0.9rem; padding: 6px 10px; width: 30%;">
                                                                <option value="">Tipo</option>
                                                                <option value="J">J</option>
                                                                <option value="V">V</option>
                                                                <option value="E">E</option>
                                                                <option value="G">G</option>
                                                                <option value="P">P</option>
                                                            </select>
                                                            <input type="text" class="form-control" id="origenRifNumero" placeholder="Número RIF" pattern="[0-9]*" inputmode="numeric" style="font-size: 0.9rem; padding: 6px 10px; width: 70%;">
                                                        </div>
                                                    </div>
                                                    <div class="mb-2" style="display: none;">
                                                        <label for="origenTelefono" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Nro. Telefónico
                                                        </label>
                                                        <input type="text" class="form-control" id="origenTelefono" placeholder="Ej: 0412-1234567" pattern="[0-9\-]*" inputmode="numeric" style="font-size: 0.9rem; padding: 6px 10px;">
                                                    </div>
                                                    <div>
                                                        <label for="origenBanco" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco
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
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.293L5.354 7.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.793z"/></svg>Destino
                                                    </h6>
                                                </div>
                                                <div class="card-body p-3">
                                                    <div class="mb-2">
                                                        <label for="destinoRifTipo" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
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
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Nro. Telefónico
                                                        </label>
                                                        <input type="text" class="form-control" id="destinoTelefono" placeholder="Ej: 0412-1234567" pattern="[0-9\-]*" inputmode="numeric" required value="04122632231" readonly style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef;">
                                                    </div>
                                                    <div>
                                                        <label for="destinoBanco" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco
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

                            <!-- BLOQUE INTERMEDIO: SOPORTE DIGITAL -->
                            <div class="form-section mt-3">
                                <div class="form-section-header">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cloud-upload me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.508 4.56a4.5 4.5 0 1 1-1.122 8.835l.23-.974a3.5 3.5 0 1 0-.965-6.837l-.234.027c-.046-.01-.09-.022-.132-.033-.424-.111-.83-.166-1.226-.166-1.554 0-2.83 1.054-3.15 2.454l-.234.027a3 3 0 0 0-2.43 2.502H3a1 1 0 0 0-1-1c0-.422.25-.78.614-.945a.5.5 0 1 0-.414-.91A2 2 0 0 1 3 13.5h.341l.23-.974H3a1.5 1.5 0 0 1 0-3h.341l.23-.974A3.5 3.5 0 0 1 4.406 1.342Z"/><path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/></svg>
                                    <h6 class="form-section-title">Soporte Digital</h6>
                                </div>
                                <div class="row g-2">
                                    <div class="col-12">
                                        <label class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-diff me-1 text-primary" viewBox="0 0 16 16"><path d="M8 5a.5.5 0 0 1 .5.5V7H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V8H6a.5.5 0 0 1 0-1h1.5V5.5A.5.5 0 0 1 8 5m-2.5 6.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>Documento de Pago
                                        </label>
                                        <div class="upload-container text-center" style="position: relative;">
                                            <input type="file" class="form-control" id="pago_documentFile" name="documentoPago" accept="image/*,.pdf" style="display: none;">
                                            <label for="pago_documentFile" class="d-block p-4 border rounded bg-light" style="border: 2px dashed #cbd5e0 !important; cursor: pointer; transition: all 0.3s ease; width: 100%;" id="pago_fileDropZone">
                                                <div class="mb-2" id="iconDocumentoPago">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-camera text-secondary" viewBox="0 0 16 16"><path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/><path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>
                                                </div>
                                                <span class="text-muted fw-medium d-block" id="textDocumentoPago">Adjunte el Documento de Pago</span>
                                            </label>
                                            <div id="pago_fileStatusContainer" class="d-none" style="margin-top: 10px; padding: 15px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; cursor: pointer;">
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <div id="pago_fileIconDisplay">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#22c55e" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
                                                    </div>
                                                    <span class="fw-bold" id="pago_fileNameText" style="color: #16a34a; font-size: 0.95rem;"></span>
                                                </div>
                                            </div>
                                            <small class="text-muted mt-2 d-block" style="font-size: 0.8rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-info-circle me-1" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>Archivos permitidos: JPG, JPEG, PNG, PDF (Máx. 5MB)
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- BLOQUE 3: HISTORIAL DE PAGOS -->
                            <div class="form-section mt-3">
                                <div class="form-section-header">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-clock-history me-2" viewBox="0 0 16 16"><path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .973.658a7 7 0 0 0-.306.452zM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m7.5-3a.5.5 0 0 1 1 0v2.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1 0-1h2.5z"/></svg>
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
                                                 <th style="padding: 8px; white-space: nowrap;">Estatus</th>
                                                <th style="padding: 8px; white-space: nowrap;">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody id="paymentHistoryBody">
                                            <tr>
                                                <td colspan="11" class="text-center text-muted" style="padding: 20px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-info-circle me-1" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>No hay pagos registrados
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open me-2 text-primary" viewBox="0 0 16 16"><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184l7.925 3.048A1.5 1.5 0 0 1 15 8.5V13.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5zM2.5 3a.5.5 0 0 0-.5.5V13.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V8.5a.5.5 0 0 0-.171-.374l-7.925-3.047a.5.5 0 0 0-.511-.079H2.5z"/></svg>Documentos
                                        </h6>
                                    </div>
                                    <div class="card-body p-3">
                                        <button type="button" class="btn btn-outline-primary w-100" id="btnVerPresupuestoModal" title="Ver Documento de Presupuesto">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf me-2" viewBox="0 0 16 16"><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/><path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.193-.3.461-.507.848-.68.71-.315 1.488-.515 2.106-.6a.5.5 0 0 0 .151-.102c.28-.275.526-.644.69-1.074.242-.63.352-1.23.352-1.734 0-.39-.105-.72-.255-.95a.5.5 0 0 0-.442-.254.5.5 0 0 0-.472.33c-.115.357-.149.796-.114 1.243.018.226.048.491.092.778a6 6 0 0 1-.194 1.588c-.207.486-.479.8-.823 1.025-.33.215-.777.38-1.288.473-.396.074-.712.112-1.01.112a.8.8 0 0 1-.341-.053m2.234-2.822c-.524.1-.926.27-1.12.395-.145.093-.24.195-.28.262-.027.05-.034.1-.033.145.011.042.013.09.04.129.034.048.087.067.14.076a.3.3 0 0 0 .179-.011c.144-.055.439-.272.932-.741a2 2 0 0 0 .142-.25m-.356.643a6 6 0 0 0 .4-.6c-.1.018-.215.044-.334.078a6 6 0 0 0-.466.129 6 6 0 0 0 .4.393M7.667 7.202c-.04-.331-.051-.614-.031-.83a.54.54 0 0 1 .067-.247.3.3 0 0 1 .153-.1c.01-.003.02-.005.033-.005q.055 0 .094.046.06.072.062.247c0 .166-.045.52-.228 1.14-.01-.362-.01-.482 0-.251m3.153 3.53c.552-.617 1.256-1.128 1.847-1.429.231-.118.452-.211.662-.278.204-.066.398-.106.561-.106.183 0 .306.045.385.143q.099.12.04.4c-.04.189-.161.4-.343.585-.313.321-.937.64-1.768.95a15 15 0 0 0-1.384.532zM9.546 11.23a15 15 0 0 1 .947-.46q-.542.433-.947.714z"/></svg>Ver Documento de Presupuesto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-radius: 0 0 12px 12px; padding: 15px 25px; border-top: 1px solid #dee2e6; flex-shrink: 0;">
                    <button type="button" class="btn btn-secondary px-4" id="btnCancelarPagoPresupuesto" data-bs-dismiss="modal" style="font-size: 0.95rem; padding: 8px 20px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg me-2" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>Cancelar
                    </button>
                    <button type="button" class="btn btn-primary px-4" id="btnGuardarPagoPresupuesto" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; font-size: 0.95rem; padding: 8px 20px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg me-2" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.42-5.447a.733.733 0 0 1 1.047 0z"/></svg>Guardar Pago
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
                        <h5 class="modal-title" id="viewDocumentModalLabel"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-file-earmark-text me-2" viewBox="0 0 16 16"><path d="M5.5 7a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5M6.5 9a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/><path d="M8 0a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-.293-.707l-3-3A1 1 0 0 0 12 0zM14 4.5V14H2V2h8v2.5a.5.5 0 0 0 .5.5z"/></svg>Visualizando Documento - Ticket: <span id="viewModalTicketId"></span></h5>
                    </div>
                    <div class="modal-body text-center">
                        <h6 id="NombreImage" class="mb-3" style="color: black;"></h6>
                        <div id="viewDocumentMessage" class="alert alert-warning hidden" role="alert"></div>
                        <img id="imageViewPreview" class="img-fluid" alt="Previsualización de la imagen" style="display: none;">
                        <div id="pdfViewViewer" style="width: 100%; height: 70vh; display: none;"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="CerrarModalVizualizar">Cerrar</button>
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
                        <h5 class="modal-title" id="modalRechazoLabel"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-left-x me-2" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M7.066 4.76a1.65 1.65 0 0 0 0 2.481l1.192 1.192a.5.5 0 1 0 .707-.707L7.773 6.535a.65.65 0 0 1 0-.919l1.192-1.192a.5.5 0 1 0-.707-.707z"/></svg>Motivo de Rechazo</h5>
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
                    <h5 class="modal-title" id="modalConfirmacionRechazoLabel"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-circle me-2" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/></svg>Confirmar Rechazo de Documento</h5>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square me-2" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>Editar Pago
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-calendar-event me-1 text-primary" viewBox="0 0 16 16"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>Fecha Pago
                                    </label>
                                    <input type="date" class="form-control" id="edit_fechaPago">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_formaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-credit-card me-1 text-primary" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></svg>Forma pago <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="edit_formaPago" required>
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_moneda" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin me-1 text-primary" viewBox="0 0 16 16"><path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.606v-.706c1.318-.094 2.074-.815 2.074-1.84 0-1.027-.664-1.59-1.983-1.84l-.521-.102v-2.04c.592.063.977.371 1.056.896h.695c-.073-.914-.847-1.562-2.103-1.645V4h-.606v.681c-1.188.084-1.815.713-1.815 1.591 0 .872.613 1.408 1.612 1.622l.466.1v2.281c-.563-.064-.974-.361-1.064-.927zm2.467-3.791c-.53.116-.835.418-.835.83 0 .413.293.689.835.818v-1.648zM8.235 10.3c.595-.122.946-.439.946-.867 0-.416-.299-.7-.946-.822v1.689z"/><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/></svg>Moneda <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="edit_moneda" required>
                                        <option value="bs">Bolívares (Bs)</option>
                                        <option value="usd">Dólares (USD)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-cash me-1 text-primary" viewBox="0 0 16 16"><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Monto Bs
                                    </label>
                                    <input type="number" class="form-control" id="edit_montoBs" step="0.01">
                                </div>
                            </div>

                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-left-right me-1 text-primary" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>Monto REF
                                    </label>
                                    <input type="number" class="form-control" id="edit_montoRef" step="0.01">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-hash me-1 text-primary" viewBox="0 0 16 16"><path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.125 0 .257-.012.387-.03.512-.073.89-.457.89-1.012 0-.579-.344-.954-.833-1.012l-.082-.007h-1.273l.33-1.587c.017-.077.025-.15.025-.225 0-.335-.224-.543-.532-.543-.298 0-.511.171-.577.502l-.339 1.853H7.833l.33-1.587c.017-.077.026-.15.026-.225 0-.335-.225-.543-.532-.543-.298 0-.512.171-.578.502l-.339 1.853H5.3l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587Z"/></svg>Referencia <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="edit_referencia" required>
                                </div>
                            </div>
                            
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-person me-1 text-primary" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>Depositante <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="edit_depositante" required>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-sticky me-1 text-primary" viewBox="0 0 16 16"><path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H10a1.5 1.5 0 0 0-1.5 1.5v3.5H2.5a.5.5 0 0 1-.5-.5zm7 8V9.5a.5.5 0 0 1 .5-.5h3.5z"/></svg>Obs. Administración
                                    </label>
                                    <input type="text" class="form-control" id="edit_obsAdministracion">
                                </div>
                            </div>

                            <!-- Bancos -->
                            <div class="row g-2" id="edit_bancoFieldsContainer">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco Origen
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF Origen
                                    </label>
                                    <input type="text" class="form-control" id="edit_origenRifNumero" placeholder="Número RIF">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Teléfono Origen
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

    <!-- MODAL SUSTITUIR DATOS DE PAGO (Reemplazo completo - mismo flujo que Tecnico) -->
    <div class="modal fade" id="modalSustituirPago" tabindex="-1" aria-labelledby="modalSustituirPagoLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 95vh; display: flex; flex-direction: column;">
                <div class="modal-header" style="background: linear-gradient(135deg, #e8850a, #f6a623); color: white; border-radius: 12px 12px 0 0; padding: 15px 25px; flex-shrink: 0;">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <h5 class="modal-title mb-0" id="modalSustituirPagoLabel" style="font-weight: 600; font-size: 1.3rem;">
                            <i class="fas fa-money-bill-wave me-2"></i>Sustituir Datos de Pago
                        </h5>
                        <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 10px 15px; min-width: 180px;">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-dollar-sign me-2"></i>
                                <div>
                                    <small style="opacity: 0.9; font-size: 0.75rem; display: block;">Monto Referencia</small>
                                    <h5 class="mb-0 fw-bold" id="sust_montoEquipo" style="font-size: 1.1rem;">$0.00</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-body" style="padding: 20px; background: #f8f9fa; overflow-y: auto; flex: 1;">
                    <form id="formSustituirPago">
                        <input type="hidden" id="sust_id_user_pago" name="userId" value="<?php echo isset($_SESSION['id_user']) ? $_SESSION['id_user'] : ''; ?>">
                        <input type="hidden" id="sust_nro_ticket_pago" name="nro_ticket_pago">
                        <input type="hidden" id="sust_id_ticket_pago" name="id_ticket_pago">
                        <input type="hidden" id="sust_id_payment_record_loading" name="id_payment_record_loading">
                        <input type="hidden" id="sust_document_type_pago" name="document_type_pago">
                        <input type="hidden" id="sust_registro" name="registro">

                        <!-- Sección: Información del Cliente -->
                        <div class="form-section shadow-sm mb-4" style="background: #fff; border-radius: 8px; border-left: 4px solid #f6a623; padding: 15px;">
                            <div class="form-section-header" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 10px;">
                                <i class="fas fa-user-circle" style="color: #667eea; margin-right: 8px;"></i>
                                <h6 class="form-section-title d-inline-block m-0 fw-bold" style="color: #495057;">Información del Cliente</h6>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_displayRazonSocial" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-building me-1 text-primary"></i>Razón Social
                                    </label>
                                    <input type="text" class="form-control bg-light" id="sust_displayRazonSocial" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_displayRif" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-id-card me-1 text-primary"></i>RIF
                                    </label>
                                    <input type="text" class="form-control bg-light" id="sust_displayRif" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_serialPosPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-barcode me-1 text-primary"></i>Serial POS
                                    </label>
                                    <input type="text" class="form-control bg-light" id="sust_serialPosPago" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_displayEstatusPos" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-signal me-1 text-primary"></i>Estatus POS
                                    </label>
                                    <input type="text" class="form-control bg-light" id="sust_displayEstatusPos" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Información de Pago -->
                        <div class="form-section shadow-sm mb-4" style="background: #fff; border-radius: 8px; border-left: 4px solid #f6a623; padding: 15px;">
                            <div class="form-section-header" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 10px;">
                                <i class="fas fa-money-bill-wave" style="color: #667eea; margin-right: 8px;"></i>
                                <h6 class="form-section-title d-inline-block m-0 fw-bold" style="color: #495057;">Información de Pago</h6>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_fechaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-calendar-alt me-1 text-primary"></i>Fecha Pago <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="date" class="form-control" id="sust_fechaPago" required style="font-size: 0.95rem; padding: 8px 12px;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_formaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-credit-card me-1 text-primary"></i>Forma pago <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="sust_formaPago" required style="font-size: 0.95rem; padding: 8px 12px;">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_moneda" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-coins me-1 text-primary"></i>Moneda <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="sust_moneda" required style="font-size: 0.95rem; padding: 8px 12px;">
                                        <option value="">Seleccionar</option>
                                        <option value="bs">Bolívares (Bs)</option>
                                        <option value="usd">Dólares (USD)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_estatus_pago_visual" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-info-circle me-1 text-primary"></i>Estatus
                                    </label>
                                    <input type="text" class="form-control" id="sust_estatus_pago_visual" placeholder="Estatus del pago" readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef;">
                                </div>
                            </div>
                            <!-- Banco Fields (Transferencia) -->
                            <div class="row g-2" id="sust_bancoFieldsContainer" style="display: none;">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-university me-1 text-primary"></i>Banco Origen
                                    </label>
                                    <select class="form-select" id="sust_bancoOrigen" style="font-size: 0.95rem; padding: 8px 12px;">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_bancoDestino" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-building me-1 text-primary"></i>Banco Destino
                                    </label>
                                    <select class="form-select" id="sust_bancoDestino" style="font-size: 0.95rem; padding: 8px 12px;">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Montos y Referencias -->
                        <div class="form-section shadow-sm mb-4" style="background: #fff; border-radius: 8px; border-left: 4px solid #f6a623; padding: 15px;">
                            <div class="form-section-header d-flex justify-content-between align-items-center" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 10px;">
                                <div>
                                    <i class="fas fa-exchange-alt" style="color: #667eea; margin-right: 8px;"></i>
                                    <h6 class="form-section-title d-inline-block m-0 fw-bold" style="color: #495057;">Montos y Referencias</h6>
                                </div>
                                <div class="tasa-display" style="background: linear-gradient(135deg, #e8850a, #f6a623); padding: 5px 12px; border-radius: 6px; box-shadow: 0 2px 4px rgba(232, 133, 10, 0.3);">
                                    <div class="text-end text-white">
                                        <small id="sust_fechaTasaDisplay" style="font-size: 0.75rem; opacity: 0.9;">Tasa: --</small>
                                        <h5 class="mb-0 fw-bold tasa-value" id="sust_tasaDisplayValue" style="font-size: 1.1rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">Cargando...</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Monto Bs</label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="sust_montoBs" step="0.01" placeholder="0.00" style="font-size: 0.95rem;" readonly>
                                        <span class="input-group-text" style="font-size: 0.85rem; background-color: #f8f9fa;">Bs</span>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Monto REF</label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="sust_montoRef" step="0.01" placeholder="0.00" style="font-size: 0.95rem;" readonly>
                                        <span class="input-group-text" style="font-size: 0.85rem; background-color: #f8f9fa;">USD</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Referencia <span style="color: #dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="sust_referencia" placeholder="Número de referencia" required style="font-size: 0.95rem;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Depositante <span style="color: #dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="sust_depositante" placeholder="Nombre del depositante" required style="font-size: 0.95rem;">
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_registro_visual" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-book me-1 text-primary"></i>Registro
                                    </label>
                                    <input type="text" class="form-control" id="sust_registro_visual" placeholder="Generado autom." readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_fechaCarga" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-calendar-check me-1 text-primary"></i>Fecha carga <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="sust_fechaCarga" readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef;">
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Soporte Digital -->
                        <div class="form-section shadow-sm mb-4" style="background: #fff; border-radius: 8px; border-left: 4px solid #f6a623; padding: 15px;">
                            <div class="form-section-header" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 10px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#667eea" class="bi bi-cloud-arrow-up me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/><path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/></svg>
                                <h6 class="form-section-title d-inline-block m-0 fw-bold" style="color: #495057;">Nuevo Comprobante de Pago</h6>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-12 mb-2">
                                    <label for="sust_documentFileDetailed" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-arrow-up me-1 text-primary" viewBox="0 0 16 16"><path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
                                        Nuevo Documento de Pago <span style="color: #dc3545;">*</span>
                                    </label>
                                    <div id="sust_fileDropZone" style="border: 2px dashed #cbd5e0; border-radius: 8px; padding: 30px; text-align: center; background: #f8f9fa; cursor: pointer; transition: all 0.3s ease;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#a0aec0" class="bi bi-camera mb-2" viewBox="0 0 16 16"><path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/><path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>
                                        <p style="color: #4a5568; font-size: 1rem; margin: 10px 0 5px 0; font-weight: 500;">Adjunte el Nuevo Comprobante de Pago</p>
                                        <small style="color: #a0aec0; font-size: 0.85rem;">Formatos permitidos: JPG, PNG, GIF o PDF (Máx. 5MB)</small>
                                    </div>
                                    <input type="file" class="d-none" id="sust_documentFile" accept="image/jpg, image/png, image/gif, application/pdf" required>
                                    <div id="sust_fileStatusContainer" style="display: none; margin-top: 10px; padding: 12px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; cursor: pointer;">
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <div id="sust_fileIconDisplay">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#22c55e" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
                                            </div>
                                            <span id="sust_fileNameText" style="color: #16a34a; font-weight: 500; font-size: 0.95rem;"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Observaciones -->
                        <div class="form-section shadow-sm mb-4" style="background: #fff; border-radius: 8px; border-left: 4px solid #f6a623; padding: 15px;">
                            <div class="form-section-header" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 10px;">
                                <i class="fas fa-info-circle" style="color: #667eea; margin-right: 8px;"></i>
                                <h6 class="form-section-title d-inline-block m-0 fw-bold" style="color: #495057;">Información Adicional</h6>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-12 mb-2">
                                    <label for="sust_obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Obs. Administración</label>
                                    <textarea class="form-control" id="sust_obsAdministracion" rows="2" placeholder="Observaciones de administración" style="font-size: 0.95rem; resize: vertical;"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-radius: 0 0 12px 12px; padding: 15px 25px;">
                    <button type="button" class="btn btn-secondary px-4" id="btnCancelarSustituirPago">
                        <i class="fas fa-times me-2"></i>Cancelar
                    </button>
                    <button type="button" class="btn btn-warning px-4" id="btnGuardarSustituirPago" style="background: linear-gradient(135deg, #f6a623 0%, #e8850a 100%); border: none; color: white;">
                        <i class="fas fa-exchange-alt me-2"></i>Sustituir Pago
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL SUSTITUIR DATOS DE PAGO -->

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