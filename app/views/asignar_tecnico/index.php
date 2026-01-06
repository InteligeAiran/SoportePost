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
                                                <h5 class="text-black text-capitalize ps-3" style="color: black;">Asignación de Tickets</h5>
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
                        <button type="button" class="btn btn-secondary" id="BotonCerrarSelectDocument">Cerrar</button>
                        <button type="button" class="btn btn-primary" id="btnConfirmarVisualizacion">Visualizar</button>
                    </div>
                </div>
            </div>
        </div>
    <!--END MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->

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