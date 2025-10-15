<?php
function mi_navbar() {}
?>
<!DOCTYPE html>
<lang="en">
    <head>
    <link rel="icon" type="image/x-icon" href="<?php echo APP; ?>app/public/img/login/Logo.png">
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <link rel="apple-touch-icon" sizes="76x76" href="<?php echo APP; ?>app/public/img/login/Logo.png">
            
        <title>
            <?php echo tituloPagina; ?>
        </title>
        <!--     Fonts and icons     -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <!-- Nucleo Icons -->
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/carts.css" />
        <link rel="stylesheet" href="<?php echo APP; ?>app/plugins/animate-css/animate.min.css"/>
        <!-- Font Awesome Icons -->
        <script> var currentUserRole = <?php echo $_SESSION['id_rol'] ?? 'guest'; ?>;</script>
        <!-- CSS Files -->
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/dashboard.css" />

        <style>
             @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-overlay {
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px);
            }
            
            .loading-spinner {
                box-shadow: 0 4px 15px rgba(0, 53, 148, 0.2);
            }
            
            .card-loading {
                position: relative;
                overflow: hidden;
            }
            
            .card-loading::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
                animation: shimmer 2s infinite;
                z-index: 1;
            }
            
            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            
            .card-header.bg-primary.text-white {
                cursor: pointer; /* Changes the cursor to indicate clickability */
                transition: all 0.3s ease; /* Smooth transition for hover effects */
            }

            .card-header.bg-primary.text-white:hover {
                background-color: #0057b3; /* Slightly darker blue on hover */
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.9); /* Add shadow on hover */
                transform: translateY(-2px); /* Slight lift effect */
            }

            .card-header.bg-primary.text-white:active {
                background-color: #004494; /* Even darker blue when clicked */
                transform: translateY(0); /* Reset lift on click */
            }

            /* Tooltip styling */
            .card-header.bg-primary.text-white:hover::after {
                content: 'Redireccionar'; /* Text to display */
                position: absolute;
                bottom: 100%; /* Position above the header */
                left: 50%;
                transform: translateX(-50%); /* Center horizontally */
                background-color: #333; /* Dark background for tooltip */
                color: #fff; /* White text */
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10; /* Ensure it appears above other elements */
                opacity: 1;
                transition: opacity 0.2s ease;
            }

            .card-header.bg-primary.text-white::after {
                opacity: 0; /* Hidden by default */
            }

            /* Custom styles for SweetAlert2 modal */
            /* Custom styles for SweetAlert2 session expired modal */
            .modern-swal-popup1 {
                border-radius: 12px !important;
                padding: 20px !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
                background: linear-gradient(145deg, #ffffff, #f0f4f8) !important;
            }

            .modern-swal-title1 {
                font-size: 1.5rem !important;
                color: #1e3a8a !important;
                font-weight: 600 !important;
                margin-bottom: 10px !important;
            }

            .modern-swal-content1 {
                font-size: 1rem !important;
                color: #374151 !important;
                line-height: 1.5 !important;
            }

            .modern-swal-progress-bar1 {
                background-color: #1e3a8a !important; /* Deep blue progress bar */
                height: 4px !important;
            }

            .modern-swal-popup {
                border-radius: 12px !important;
                padding: 20px !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
                background: linear-gradient(145deg, #ffffff, #f0f4f8) !important;
            }

            .modern-swal-title {
                font-size: 1.5rem !important;
                color: #1e3a8a !important;
                font-weight: 600 !important;
                margin-bottom: 10px !important;
            }

            .modern-swal-content {
                font-size: 1rem !important;
                color: #374151 !important;
                line-height: 1.5 !important;
            }

            .modern-swal-confirm {
                border-radius: 8px !important;
                padding: 10px 20px !important;
                font-size: 1rem !important;
                font-weight: 500 !important;
                transition: transform 0.2s ease !important;
            }

            .modern-swal-confirm:hover {
                transform: translateY(-2px) !important;
            }

            .modern-swal-cancel {
                border-radius: 8px !important;
                padding: 10px 20px !important;
                font-size: 1rem !important;
                font-weight: 500 !important;
                transition: transform 0.2s ease !important;
            }

            .modern-swal-cancel:hover {
                transform: translateY(-2px) !important;
            }

            /* Estilos para el botón de expandir/contraer en tabla */
            .btn-expand-collapse {
                background: #007bff !important;
                border: 1px solid #007bff !important;
                border-radius: 8px;
                padding: 8px 16px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 0.875rem;
                font-weight: 500;
                color: #ffffff !important;
                transition: all 0.2s ease;
                font-family: 'Open Sans', sans-serif;
                text-decoration: none;
                outline: none;
            }

            .btn-expand-collapse:hover {
                background: #0056b3 !important;
                border-color: #0056b3 !important;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
                color: #ffffff !important;
            }

            .btn-expand-collapse:active {
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
                background: #004085 !important;
                border-color: #004085 !important;
                color: #ffffff !important;
            }

            .btn-expand-collapse:focus {
                box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
                color: #ffffff !important;
            }

            .expand-icon {
                transition: transform 0.3s ease;
                flex-shrink: 0;
                color: #ffffff !important;
            }

            .expand-text {
                white-space: nowrap;
                color: #ffffff !important;
            }

            input[type="text"], input[type="password"]{
                width: calc(100% - 1rem);
                padding: 0.5rem 0.75rem;
                margin-bottom: 0.75rem;
                border: 1px solid #ced4da;
                border-radius: 0.25rem;
                box-sizing: border-box;
                font-size: 0.9rem;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                font-family: 'Arial', sans-serif;
            }

            .password-legend {
                text-align: left;
                margin-top: 1rem;
                color: black;
                font-size: 0.875rem;
            }

            .password-legend ul {
                list-style: none;
                padding-left: 0;
                margin-top: 0.5rem;
            }

            .password-legend li {
                position: relative;
                padding-left: 20px;
                color: #888; /* Color inicial del texto */
                transition: color 0.3s ease;
            }

            .password-legend li::before {
                content: '•';
                position: absolute;
                left: 0;
                top: 0;
                font-size: 1.2rem;
                line-height: 1;
            }
            
            /* Reglas de color para los estados de validación */
            .password-legend li.valid {
                color: green;
            }

            .password-legend li.invalid {
                color: red;
            }

            /* Estilo para los inputs con error o éxito */
            .form-control.error {
                border-color: #dc3545;
            }

            .form-control.success {
                border-color: #198754;
            }

            .error-message {
                color: #dc3545;
                font-size: 0.875em;
                margin-top: 0.25rem;
            }
            
            /* Estilos para el input con icono */
            .input-with-icon-wrapper {
                position: relative;
            }
            
            .password-toggle-icon {
                position: absolute;
                right: 6%;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: #6c757d; /* Color de icono por defecto */
            }

            /* Contenedor del botón y la sugerencia de contraseña */
            #suggestedPasswordContainer {
                margin-top: -2%;
                margin-left: 10%;
                position: fixed;
                align-items: center;
            }

            #Cerrar-botton{
                background-color: #A0A0A0;
                  color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            #Cerrar-botton:hover{
                background-color: red;
            }

            #submitNewPasswordBtn{
                background-color: #003594;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            #submitNewPasswordBtn:hover{
                background-color: green;
            }
        </style>
    </head>

    <body class="g-sidenav-show bg-gray-100">
        <div class="d-lg-none fixed-top bg-dark p-2">
            <button id="filter-toggle">
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
        <!-- Loading Overlay -->
            <div id="dashboard-loading-overlay" class="loading-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.95); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div class="loading-container" style="text-align: center;">
                    <div class="loading-spinner" style="width: 80px; height: 80px; border: 6px solid #f3f3f3; border-top: 6px solid #003594; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <h4 style="color: #003594; margin-bottom: 10px; font-weight: 600;">Cargando Dashboard</h4>
                    <p style="color: #666; margin-bottom: 0; font-size: 14px;">Preparando datos y estadísticas...</p>
                    <div class="loading-progress" style="width: 300px; height: 4px; background: #e9ecef; border-radius: 2px; margin: 20px auto 0; overflow: hidden;">
                        <div class="loading-progress-bar" style="height: 100%; background: linear-gradient(90deg, #003594, #007bff); width: 0%; transition: width 0.3s ease; border-radius: 2px;"></div>
                    </div>
                    <p id="loading-status" style="color: #888; margin-top: 10px; font-size: 12px;">Inicializando...</p>
                </div>
            </div>
        <!-- Loading Overlay -->

        <main class="main-content position-relative border-radius-lg ">
            <div class="container-fluid py-4">
                <div class="row">
                    <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                            <!-- Card Tickets Abiertos -->
                                <div class="card" id="Card-Ticket-open">
                                    <div class="card-body">
                                        <div class="card-content-wrapper">
                                            <div class="numbers">
                                                <p class="card-category" style="color: black">Tickets Abiertos</p>
                                                <h5 class="card-title font-weight-bolder" id="TicketsAbiertos">0</h5>
                                                <p class="card-text mb-0">
                                                    <span class="text-danger font-weight-bolder"
                                                        id="TicketPorcentOpen">0.00%</span>Del total de tickets
                                                </p>
                                            </div>
                                            <div class="icon-on-right">
                                                <div class="icon-shape bg-gradient-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                        fill="white" class="bi bi-ticket-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!--End Card Tickets Abiertos  -->
                        </div>
                    </div>

                    <!-- Card ver Tickets Abiertos -->
                        <div class="modal fade" id="OpenTicketModal" tabindex="-1"
                            aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                <div class="modal-content">
                                    <div class="modal-header bg-gradient-primary text-white">
                                        <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle de Tickets Abiertos
                                        </h5>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <input type="text" id="ticketSearchInputOpen" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                        </div>
                                        <div id="OpenTicketModalContent"></div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" id="ModalOpen" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!--End Card ver Tickets Abiertos  -->

                    <!-- Card Tickets Proceso -->
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                            <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                                <div class="card"  id="Card-Ticket-process">
                                    <div class="card-body">
                                        <div class="card-content-wrapper">
                                            <div class="numbers">
                                                <p class="card-category" style="color: black">TICKETS PROCESO</p>
                                                <h5 class="card-title" id="ProcessTicketNumber">0</h5>
                                                <p class="card-text">
                                                    <span class="text font-weight-bolder" id="Process_Tickets"></span>Del total de tickets
                                                </p>
                                            </div>
                                            <div class="icon-on-right">
                                                <div class="icon-shape bg-gradient-secondary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-hourglass-split" viewBox="0 0 16 16">
                                                        <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!-- End Card Tickets Proceso -->
                    
                    <!-- Card ver Tickets Proceso -->
                    <div class="modal fade" id="ProcessTicketsModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-primary text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle de Tickets En Proceso</h5>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <input type="text" id="ticketSearchInputProcess" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                    </div>
                                    <div id="ProcessTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalProcess" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--End Card ver Tickets Proceso  -->

                    <!-- Card ver Flujo de los Tickets en Proceso -->
                        <div class="modal fade" id="TimelineModal" tabindex="-1" aria-labelledby="timelineModalLabel" aria-hidden="true">
                        <div class="modal-fullscreen"> 
                            <div class="modal-content" id="ContentModallineTime">
                                <div class="modal-header bg-gradient-primary text-white">
                                    <h5 class="modal-title" style="color: white" id="timelineModalLabel">Flujo de Trabajo del Ticket #<span id="timelineTicketId"></span></h5>
                                    <button type="button" class="btn-close" id="IconCloseTimeline" aria-label="Cerrar"></button>
                                </div>
                                <div class="modal-body" id="ModalBodyGestiones"> 
                                    <div id="timelineContent">
                                        <p>Cargando flujo de trabajo...</p>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="CloseCerrarTimeline" class="btn btn-secondary">Cerrar</button>
                                </div>
                            </div>
                        </div>
                        </div>
                    <!--End Card ver Flujo de los Tickets en Proceso -->

                    <!-- Card ver historial de los Tickets en Proceso -->
                        <div class="modal fade" id="flowTicketModal" tabindex="-1" role="dialog" aria-labelledby="flowTicketModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="flowTicketModalLabel">Historial del Ticket</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div id="timeline-display-area">
                                        </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    <!-- Card ver historial de los Tickets en Proceso -->

                    <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">

                        <!-- Card Tickets Cerrados -->
                            <div class="card" id="Card-resolve-ticket">
                                <div class="card-body">
                                    <div class="card-content-wrapper">
                                        <div class="numbers">
                                            <p class="card-category" style="color: black">Tickets Cerrados</p>
                                            <h5 id="TicketsResuelto" class="card-title">0</h5>
                                            <p class="card-text mb-0">
                                                <span id="ticketResueltoPercentage"
                                                    class="text font-weight-bolder"></span>Del total de tickets
                                            </p>
                                        </div>
                                        <div class="icon-on-right">
                                            <div class="icon-shape bg-gradient-success"> <svg
                                                    xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                    fill="white" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                    <path
                                                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <!--End Card Tickets Cerrados -->
                        </div>
                    </div>

                    <!-- Card ver Tickets Cerrados -->
                        <div class="modal fade" id="ResolveTicketsModal" tabindex="-1"
                            aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                <div class="modal-content">
                                    <div class="modal-header bg-gradient-primary text-white">
                                        <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalles de Tickets Resueltos
                                        </h5>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <input type="text" id="ticketSearchInputResolved" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                        </div>
                                        <div id="ResolveTicketsContent"></div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" id="ModalResolveRegion" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!--End Card ver Tickets Cerrados  -->

                    <!-- Card Total de Tickets -->
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                            <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="card-content-wrapper">
                                            <div class="numbers">
                                                <p class="card-category" style="color: black">Total Tickets</p>
                                                <h5 id="TotalTicket" class="card-title">0</h5>
                                                <p class="card-text mb-0"><br><br><br>
                                                </p>
                                            </div>
                                            <div class="icon-on-right">
                                                <div class="icon-shape bg-gradient-info"> <svg
                                                        xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                        fill="white" class="bi bi-ticket-detailed-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4 1a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m0 5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5M4 8a1 1 0 0 0 1 1h6a1 1 0 1 0 0-2H5a1 1 0 0 0-1 1" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!--End Card Total de Tickets  -->


                    <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                        
                        <!-- Card Tickets En Taller -->
                            <div class="card" id="Card-Send-To-Taller">
                                <div class="card-body">
                                    <div class="card-content-wrapper" style="margin-top: -13%;">
                                        <div class="numbers">
                                            <p class="card-category" style="color: black">POS EN TALLER</p>
                                            <h5 class="card-title font-weight-bolder" id="TotalEnviadoTaller">0</h5>
                                            <p class="card-text mb-0">
                                                <span class="text-percentage" id="PorcentSendToTaller"></span>Del total de tickets
                                            </p>
                                        </div>
                                        <div class="icon-on-right">
                                            <div class="icon-shape bg-gradient-warning"> <svg
                                                    xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                    fill="white" class="bi bi-wrench-adjustable"
                                                    viewBox="0 0 16 16">
                                                    <path
                                                        d="M16 4.5a4.5 4.5 0 0 1-1.703 3.526L13 5l2.959-1.11q.04.3.041.61" />
                                                    <path
                                                        d="M11.5 9c.653 0 1.273-.139 1.833-.39L12 5.5 11 3l3.826-1.53A4.5 4.5 0 0 0 7.29 6.092l-6.116 5.096a2.583 2.583 0 1 0 3.638 3.638L9.908 8.71A4.5 4.5 0 0 0 11.5 9m-1.292-4.361-.596.893.809-.27a.25.25 0 0 1 .287.377l-.596.893.809-.27.158.475-1.5.5a.25.25 0 0 1-.287-.376l.596-.893-.809.27a.25.25 0 0 1-.287-.377l.596-.893-.809.27-.158-.475 1.5-.5a.25.25 0 0 1 .287.376M3 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <!--End Card Tickets En Taller  -->
                        </div>
                    </div>

                    <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
                        <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-xl modal-dialog-centered"> 
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="viewDocumentModalLabel" style="color: black;">Documento Del Ticket: <span id="viewModalTicketId"></span></h5>
                                        <button type="button" class="btn-close" id="IconModalviewClose" onclick="cerrarModalViewDocument();" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="document-viewer-content">
                                            <img id="imageViewPreview" class="img-fluid" style="display: none; width: 100%; height: auto;" alt="Previsualización de imagen">
                                            <div id="pdfViewViewer" style="display: none; width: 100%; height: 80vh;"></div> 
                                            <p id="viewDocumentMessage" class="alert alert-warning" style="display: none;"></p>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" onclick="cerrarModalViewDocument();" id="CerrarBotonImage" data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->

                    <!-- Card ver Tickets En Taller -->
                        <div class="modal fade" id="SendTallerTicketsModal" tabindex="-1"
                            aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                <div class="modal-content">
                                    <div class="modal-header bg-gradient-primary text-white">
                                        <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle de Tickets En Taller
                                        </h5>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <input type="text" id="ticketSearchInputTaller" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                        </div>
                                        <div id="TallerTicketsContent"></div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" id="ModalTallerRegion" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!--End Card ver Tickets En Taller  -->

                    <!-- Card Gesti&oacuten Comercial -->
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                            <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                                <div class="card"  id="Card-Comercial-Ticket">
                                    <div class="card-body">
                                        <div class="card-content-wrapper">
                                            <div class="numbers">
                                                <p class="card-category" style="color: black">GESTI&OacuteN COMERCIAL</p>
                                                <h5 class="card-title" id="ticketGestionComercialCount">0</h5>
                                                <p class="card-text mb-0">
                                                    <span class="text-percentage" id="PorcentGestionComercial"></span>Del total de tickets
                                                </p>
                                            </div>
                                            <div class="icon-on-right">
                                                <div class="icon-shape bg-gradient-danger"> <svg
                                                        xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                        fill="white" class="bi bi-calendar-check-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!-- End Card Gesti&oacuten Comercial -->
                </div>

                <!-- Card ver Tickets En Gesti&oacuten Comercial -->
                    <div class="modal fade" id="DetalleTicketComercial" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-primary text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle de Tickets En Gesti&oacuten Comercial</h5>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <input type="text" id="ticketSearchInputComercial" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                    </div>
                                    <div id="ComercialTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalComercialDetalle" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                <!--End Card ver Tickets En Gesti&oacuten Comercial  -->

                <div class="row mt-4">
                    <!-- Gráficas de Tickets Mensuales -->
                        <div class="col-lg-7 mb-lg-0 mb-4">
                            <div class="card card-chart" id="monthlyTicketsCard">
                                <div class="card-header bg-gradient-info">
                                    <h5 class="chart-title text-white">Ticket Mensuales</h5>
                                    <p class="chart-subtitle text-white">
                                        <i class="fa fa-arrow-up text-success"></i>
                                        <span id="porcent" class="font-weight-bold"></span>
                                    </p>
                                </div>
                                <div class="card-body">
                                    <div class="chart-container">
                                        <canvas id="chart-line"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!-- End Gráficas de Tickets Mensuales -->

                    <!-- Gráficas ver de Tickets Mensuales -->
                        <div class="modal fade" id="monthlyTicketsModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                <div class="modal-content">
                                    <div class="modal-header bg-gradient-info text-white">
                                        <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle de Tickets Mensuales
                                        </h5>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <input type="text" id="ticketSearchInputMensual" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                        </div>
                                        <div id="monthlyTicketsContent"></div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" id="ModalStadisticMonth" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!-- End Gráficas ver de Tickets Mensuales -->

                    <!-- Gráficas de Tickets Mensuales -->
                        <div class="col-lg-5">
                            <div class="card card-chart" id="RegionTicketsCard">
                                <div class="card-header bg-gradient-primary">
                                    <h5 class="chart-title text-white">Tickets por Regiones</h5>
                                    <p class="chart-subtitle text-white">Resumen de tickets Regionales
                                    </p>
                                </div>
                                <div class="card-body">
                                    <div class="chart-container">
                                        <canvas id="ticketsChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!-- End Gráficas de Tickets Mensuales -->

                    <!-- Gráficas ver de Tickets Regionales -->
                        <div class="modal fade" id="RegionTicketsModal" tabindex="-1"
                            aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                <div class="modal-content">
                                    <div class="modal-header bg-gradient-info text-white">
                                        <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle de Tickets Regionales
                                        </h5>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <input type="text" id="ticketSearchInputRegion" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                        </div>
                                        <div id="RegionTicketsContent"></div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" id="ModalStadisticRegion" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!-- End Gráficas de Tickets Regionales -->
                </div>

                <!-- Estadísticas de Tickets por Módulo -->
                    <div class="row mt-6">
                        <div class="col-lg-7 mb-lg-0 mb-4">
                            <div class="card shadow-md rounded-xl">
                                <div class="card-header pb-0 p-4 border-b border-gray-200">
                                    <div class="flex justify-between items-center">
                                        <div class="card-header bg-gradient-primary">
                                            <h6 class="chart-title text-white" style="font-size: 1.2rem;">Estadísticas de Tickets por Módulo</h6>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tabla de Resumen de Tickets por Módulo -->
                                    <div class="p-4">
                                        <div class="table-responsive">
                                            <table id="ticketCountSummaryTable" class="min-w-full leading-normal" style="width: 100%;">
                                                <thead class="bg-gray-100">
                                                    <tr>
                                                        <th
                                                            class="px-5 py-4 border-b-2 border-gray-300 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                            Módulo / Estado del Ticket
                                                        </th>
                                                        <th
                                                            class="px-5 py-4 border-b-2 border-gray-300 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                            Cantidad de Tickets
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody id="ticketCountsBody" class="divide-y divide-gray-200">
                                                    <tr>
                                                        <td colspan="2" class="px-5 py-3 text-sm text-center text-gray-500 bg-white">
                                                            Cargando resumen de tickets...
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                <!-- End Tabla de Resumen de Tickets por Módulo -->
                            </div>
                        </div>

                        <div class="col-lg-5">
                            <div class="card shadow-md rounded-xl">
                                <div class="card-header pb-0 p-4 border-b border-gray-200 bg-gradient-info">
                                    <h6 class="text-2xl font-semibold text-gray-800" style="font-size: 1.2rem;">Categorías de Tickets</h6>
                                </div>
                                <div class="card-body p-4">
                                    <ul class="list-group">

                                        <li class="list-group-item list-group-item-custom" id="ModalPostReparacion">
                                            <div class="item-content-wrapper">
                                                <div class="icon-wrapper">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-wrench-adjustable"
                                                        viewBox="0 0 16 16">
                                                        <path
                                                            d="M16 4.5a4.5 4.5 0 0 1-1.703 3.526L13 5l2.959-1.11q.04.3.041.61" />
                                                        <path
                                                            d="M11.5 9c.653 0 1.273-.139 1.833-.39L12 5.5 11 3l3.826-1.53A4.5 4.5 0 0 0 7.29 6.092l-6.116 5.096a2.583 2.583 0 1 0 3.638 3.638L9.908 8.71A4.5 4.5 0 0 0 11.5 9m-1.292-4.361-.596.893.809-.27a.25.25 0 0 1 .287.377l-.596.893.809-.27.158.475-1.5.5a.25.25 0 0 1-.287-.376l.596-.893-.809.27a.25.25 0 0 1-.287-.377l.596-.893-.809.27-.158-.475 1.5-.5a.25.25 0 0 1 .287.376M3 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                                    </svg>
                                                </div>
                                                <div class="text-content-wrapper">
                                                    <h6 class="item-title">POS en Proceso De Reparaci&oacuten</h6>
                                                    <span class="item-count" id="CountProcessReparacion"></span>
                                                </div>
                                            </div>
                                            <div class="arrow-wrapper">
                                                <button class="btn-link btn-icon-only">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd"
                                                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>

                                        <li class="list-group-item list-group-item-custom" id="OpenModalPostReparado">
                                            <div class="item-content-wrapper">
                                                <div class="icon-wrapper">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-file-post-fill"
                                                        viewBox="0 0 16 16">
                                                        <path
                                                            d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M4.5 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1m0 2h7a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5" />
                                                    </svg>
                                                </div>
                                                <div class="text-content-wrapper">
                                                    <h6 class="item-title">POS Reparados</h6>
                                                    <span class="item-count" id="ReparadopsCount"></span>
                                                </div>
                                            </div>
                                            <div class="arrow-wrapper">
                                                <button class="btn-link btn-icon-only">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd"
                                                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>

                                        <li class="list-group-item list-group-item-custom" id="OpenModalPendienteRepuesto">
                                            <div class="item-content-wrapper">
                                                <div class="icon-wrapper">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-gear-wide-connected"
                                                        viewBox="0 0 16 16">
                                                        <path
                                                            d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z" />
                                                    </svg>
                                                </div>
                                                <div class="text-content-wrapper">
                                                    <h6 class="item-title">POS Pendiente Por repuestos</h6>
                                                    <span class="item-count" id="PendientePorRepuesto"></span>
                                                </div>
                                            </div>
                                            <div class="arrow-wrapper">
                                                <button class="btn-link btn-icon-only">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd"
                                                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>

                                        <li class="list-group-item list-group-item-custom" id ="OpenModalEntregadoCliente">
                                            <div class="item-content-wrapper">
                                                <div class="icon-wrapper">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-person-check-fill"
                                                        viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd"
                                                            d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                                        <path
                                                            d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                                    </svg>
                                                </div>
                                                <div class="text-content-wrapper">
                                                    <h6 class="item-title">POS Entregado a Cliente</h6>
                                                    <span class="item-count" id = "EntregadosCliente"></span>
                                                </div>
                                            </div>
                                            <div class="arrow-wrapper">
                                                <button class="btn-link btn-icon-only">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd"
                                                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>

                                        <li class="list-group-item list-group-item-custom" id="OpenModalIrreparable">
                                            <div class="item-content-wrapper">
                                                <div class="icon-wrapper">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-file-x-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M6.854 6.146 8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 1 1 .708-.708" />
                                                    </svg>
                                                </div>
                                                <div class="text-content-wrapper">
                                                    <h6 class="item-title">Irreparables</h6>
                                                    <span class="item-count" id="CountIrreparable"></span>
                                                </div>
                                            </div>
                                            <div class="arrow-wrapper">
                                                <button class="btn-link btn-icon-only">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                        fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd"
                                                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- End Estadísticas de Tickets por Módulo --> 

                <!-- Card ver Tickets En Proceso de Reparaci&oacuten -->
                    <div class="modal fade" id="procesoReparacionModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-info text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalles de los POS en proceso de Reparaci&oacuten</h5>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <input type="text" id="ticketSearchInputEnProceso" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                    </div>
                                    <div id="ReparacionModalTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalProcessReparacion" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cerrar</buttModalProcessReparacionon>
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- End Card ver Tickets En Proceso de Reparaci&oacuten  -->

                <!-- Card ver Tickets Reparados -->
                    <div class="modal fade" id="ReparadosModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-info text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalles de los POS Reparados</h5>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <input type="text" id="ticketSearchInputReparado" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                    </div>
                                    <div id="ReparadoModalTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalReparado" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cerrar
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- End Card ver Tickets Reparados  -->

                <!-- Card ver Tickets Pendientes Por Repuesto -->
                    <div class="modal fade" id="pendienterespuestoModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-info text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalles de los POS Que requieren de Repuestos</h5>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <input type="text" id="ticketSearchInputRequiereRepuesto" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                    </div>
                                    <div id="PendienteRespuesModalTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalPendiRespuu" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cerrar
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- End Card ver Tickets Pendientes Por Repuesto  -->

                <!-- Card ver Tickets Entregados a Cliente -->
                    <div class="modal fade" id="entregadoClienteModal" tabindex="-1" aria-labelledby="entregadoClienteModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-primary">
                                    <h5 class="modal-title text-white" id="entregadoClienteModalLabel">POS Entregado a Cliente</h5>
                                </div>
                                <div class="modal-body">  
                                    <div class="mb-3">
                                        <input type="text" id="ticketSearchInputEntregadoCliente" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                    </div>
                                    <div id="EntregadoClienteModalTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                        id="ModalEntregadoClienteCerrar">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- End Card ver Tickets Entregados a Cliente  -->

                <!-- Card ver Tickets Irreparables -->
                    <div class="modal fade" id="IrreparableModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-info text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalles de los POS Irreparables</h5>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <input type="text" id="ticketSearchInputIrreparable" class="form-control" placeholder="Buscar por Serial POS, RIF, Razón Social, o Acción...">
                                    </div>
                                    <div id="IrreparableTikModalTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalIrreparableTik" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- End Card ver Tickets Irreparables  -->
            </div>    
        </div>
            
        <!-- MODAL PARA NUEVA CONTRASENA -->
            <div class="modal fade" id="newPasswordModal" tabindex="-1" aria-labelledby="newPasswordModalLabel" aria-hidden="true"
                style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);"
                data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-lg shadow-lg">
                        <div class="modal-header bg-gradient-primary text-white rounded-t-lg"
                            id="newPasswordModalHeader">
                            <h5 class="modal-title text-white" id="newPasswordModalLabel">Ingrese Nueva Contraseña</h5>
                            <button type="button" id="CloseIcon" class="btn-close btn-close-white"
                                data-bs-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div class="modal-body p-6" style="margin-top: -6%;">
                            <form id="newPasswordForm">
                                <input type="hidden" id="modalUserIdForPassword">
                                <div class="input-group-container">
                                    <label for="newPassword" class="form-label">Nueva Contraseña:</label>
                                    <div class="input-with-icon-wrapper">
                                        <input type="password" class="form-control password-input" id="newPassword" required>
                                        <svg id="clickme1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            fill="currentColor" class="bi bi-eye-fill password-toggle-icon"
                                            viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                        </svg>
                                    </div>
                                    <!-- Mensaje de error de la contraseña directamente debajo del input -->
                                    <div id="passwordError" class="error-message"></div><br>
                                    
                                    <button type="button" id="generatePasswordBtn" class="btn btn-info btn-sm mt-2">Generar Contraseña</button>
                                    <div id="suggestedPasswordContainer" class="mt-2" style="display: none;">
                                        <span class="text-muted">Sugerencia: </span><span id="suggestedPassword" class="font-weight-bold text-success"></span>
                                    </div>
                                </div>

                                <div class="input-group-container">
                                    <label for="confirmNewPassword" class="form-label">Confirmar Contraseña:</label>
                                    <div class="input-with-icon-wrapper">
                                        <input type="password" class="form-control password-input" id="confirmNewPassword" required>
                                        <svg id="clickme" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            fill="currentColor" class="bi bi-eye-fill password-toggle-icon"
                                            viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                        </svg>
                                    </div>
                                    <div id="confirmPasswordError" class="error-message"></div>
                                </div>

                                <div id="passwordRequirements" class="password-legend" style="text-align: center; color: black;">
                                        La contraseña debe contener al menos:
                                        <ul><br>
                                            <li id="lengthCheck">8 caracteres de longitud.</li>
                                            <li id="uppercaseCheck">Una letra mayúscula.</li>
                                            <li id="lowercaseCheck">Una letra minúscula.</li>
                                            <li id="numberCheck">Un número.</li>
                                            <li id="specialCharCheck">Un carácter especial (!@#$%^&*).</li>
                                        </ul>
                                    </div>
                            </form>
                        </div>
                        <div class="modal-footer flex justify-end p-4 bg-gray-50 rounded-b-lg">
                            <button type="button" class="btn btn-secondary rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-bs-dismiss="modal" id="Cerrar-botton">Cancelar</button>
                            <button type="button" class="btn btn-primary rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="submitNewPasswordBtn">Guardar Contraseña</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA NUEVA CONTRASENA -->

        <!-- ID USER PARA LA REVISION DE ESTATUS DEL USUARIO -->
        <input type="hidden" id="userIdForPassword" value="<?php echo $_SESSION['id_user']; ?>">
        <!-- END ID USER PARA LA REVISION DE ESTATUS DEL USUARIO -->

        <footer class="footer" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2.5rem 0; margin-top: 3rem; box-shadow: 0 -4px 20px rgba(0,0,0,0.1);">
            <div class="container-fluid">
                <div class="row align-items-center justify-content-between">
                    <div class="col-lg-6 mb-3 mb-lg-0">
                        <div class="d-flex align-items-center">
                            <div class="me-3">
                                <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box" viewBox="0 0 16 16">
                                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h5 class="mb-1" style="color: #fff; font-weight: 700; font-size: 1.3rem;">
                                    InteliSoft
                                </h5>
                                <p class="mb-0" style="font-size: 0.9rem; opacity: 0.9;">
                                    Soluciones tecnológicas innovadoras
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="d-flex justify-content-lg-end justify-content-center flex-wrap">
                            <a href="https://www.inteligensa.com/" target="_blank" 
                            style="background: rgba(255,255,255,0.15); color: white; padding: 0.7rem 1.5rem; border-radius: 25px; text-decoration: none; margin: 0.25rem; font-size: 0.9rem; font-weight: 500; transition: all 0.3s ease; backdrop-filter: blur(10px);"
                            onmouseover="this.style.background='rgba(255,255,255,0.25)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'" 
                            onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <i class="fas fa-globe me-2"></i>Sitio Web
                            </a>
                            <a href="https://www.inteligensa.com/#contactanos" 
                            style="background: rgba(255,255,255,0.15); color: white; padding: 0.7rem 1.5rem; border-radius: 25px; text-decoration: none; margin: 0.25rem; font-size: 0.9rem; font-weight: 500; transition: all 0.3s ease; backdrop-filter: blur(10px);"
                            onmouseover="this.style.background='rgba(255,255,255,0.25)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'" 
                            onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <i class="fas fa-envelope me-2"></i>Contacto
                            </a>
                        </div>
                    </div>
                </div>
                
                <hr style="border: none; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); margin: 2rem 0 1.5rem;">
                
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <p class="mb-0" style="font-size: 0.9rem; opacity: 0.9;">
                            © <script>document.write(new Date().getFullYear())</script> InteliSoft - Todos los derechos reservados
                        </p>
                    </div>
                    <div class="col-md-4 text-md-end">
                        <p class="mb-0" style="font-size: 0.8rem; opacity: 0.8;">
                            <i class="fas fa-heart" style="color: #ff6b6b;"></i> Desarrollado con pasión
                        </p>
                    </div>
                </div>
            </div>
        </footer>
        </div>
        </main>
        <div class="fixed-plugin">
            <a class="fixed-plugin-button text-dark position-fixed px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="25" fill="black" class="bi bi-gear"
                    viewBox="0 0 16 16">
                    <path
                        d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                    <path
                        d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                </svg>
            </a>
            <div class="card shadow-lg">
                <div class="card-header pb-0 pt-3 ">
                    <div class="float-start">
                        <h5 class="mt-3 mb-0" style="color: black;">Configuración</h5>
                        <p>Opciones de diseño y perfil.</p>
                    </div>
                    <div class="float-end mt-4">
                        <button class="btn btn-link text-dark p-0 fixed-plugin-close-button">
                            <i class="fa fa-close"></i>
                        </button>
                    </div>
                </div>
                <hr class="horizontal dark my-1">
                <div class="card-body pt-sm-3 pt-0 overflow-auto">
                    <div>
                        <h6 class="mb-0" style="color: black;">Colores de la barra lateral</h6>
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
                    <div class="mt-3">
                        <h6 class="mb-0" style="color: black;">Tipos de barra lateral</h6>
                        <p class="text-sm" style="color: black;">Elige entre 2 diferentes tipos de barra lateral.</p>
                    </div>
                    <div class="d-flex">
                        <button class="btn bg-gradient-primary w-100 px-3 mb-2 active me-2" data-class="bg-white"
                            onclick="sidebarType(this)">Claro</button>
                        <button class="btn bg-gradient-primary w-100 px-3 mb-2" data-class="bg-default"
                            onclick="sidebarType(this)">Oscuro</button>
                    </div>
                    <p class="text-sm d-xl-none d-block mt-2" style="color: black;">You can change the sidenav type just on desktop view.</p>
                    <div class="d-flex my-3">
                        <h6 class="mb-0" style="color: black;">Barra de navegación fija</h6>
                        <div class="form-check form-switch ps-0 ms-auto my-auto">
                            <input class="form-check-input mt-1 ms-auto" type="checkbox" id="navbarFixed"
                                onclick="navbarFixed(this)">
                        </div>
                    </div>
                    <hr class="horizontal dark my-sm-4">
                    <div class="mt-2 mb-5 d-flex">
                        <h6 class="mb-0" style="color: black;">Modo claro / Modo Oscuro</h6>
                        <div class="form-check form-switch ps-0 ms-auto my-auto">
                            <input class="form-check-input mt-1 ms-auto" type="checkbox" id="dark-version"
                                onclick="darkMode(this)">
                        </div>
                    </div>

                    <hr class="horizontal dark my-sm-4">
                    <div class="mt-4 mb-4 text-center">
                        <h6 class="mb-3" style="color: black;">Gestión de Usuario</h6>
                        <a class="btn bg-gradient-success w-100 mb-2" href="ruta/a/tu/pagina_editar_perfil.php">
                            Editar mis datos
                        </a>
                        <p class="text-sm" style="color: black;">Haz clic para actualizar tu información personal.</p>
                    </div>
                </div>
            </div>
        </div>
        </div>

        <!-- Github buttons -->
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        <!-- Control Center for Soft Dashboard: parallax effects, scripts for the example pages etc -->
        <!-- Bootstrap core JavaScript-->
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>

        <!--   Core JS Files   -->
        <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/public/img/dashboard/js/argon-dashboard.min.js?v=2.1.0"></script>
        .

        <!-- Chart -->
        <script src="<?php echo APP; ?>app/plugins/chart.js/chart.js"></script>
        <script src="<?php echo APP; ?>app/plugins/chart.js/chart.min.js"></script>

        <!--JQUERY-->
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <!--  SweetAlert   -->
        <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
        <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.all.js"></script>
        <!--MASCARAS JQUERY-->
        <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
        <!-- Custom scripts for all pages-->
        <script src="<?php echo APP; ?>app/plugins/js/sb-admin-2.min.js"></script>

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