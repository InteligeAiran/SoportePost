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
        <!--     Fonts and icons     -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <!-- Nucleo Icons -->
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/carts.css" />
        <!-- Font Awesome Icons -->

        <!-- CSS Files -->
        <link id="pagestyle" rel="stylesheet"
            href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/dashboard.css" />
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
        <main class="main-content position-relative border-radius-lg ">
            <div class="container-fluid py-4">
                <div class="row">
                    <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                            <div class="card" id="Card-Ticket-open">
                                <div class="card-body">
                                    <div class="card-content-wrapper">
                                        <div class="numbers">
                                            <p class="card-category">Tickets Abiertos</p>
                                            <h5 class="card-title font-weight-bolder" id="TicketsAbiertos"></h5>
                                            <p class="card-text mb-0">
                                                <span class="text-danger font-weight-bolder"
                                                    id="TicketPorcentOpen"></span>Del total de tickets
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
                        </div>
                    </div>

                    <div class="modal fade" id="OpenTicketModal" tabindex="-1"
                        aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true"
                        style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-info text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle
                                        de Tickets Abiertos
                                    </h5>
                                    <button type="button" class="btn-close" id="ModalOpenIcon" data-bs-dismiss="modal"
                                        aria-label="Cerrar"></button>
                                </div>
                                <div class="modal-body">
                                    <div id="OpenTicketModalContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalOpen" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                            <div class="card" id="Card-resolve-ticket">
                                <div class="card-body">
                                    <div class="card-content-wrapper">
                                        <div class="numbers">
                                            <p class="card-category">Tickets Resueltos</p>
                                            <h5 id="TicketsResuelto" class="card-title"></h5>
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
                        </div>
                    </div>

                    <div class="modal fade" id="ResolveTicketsModal" tabindex="-1"
                        aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true"
                        style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-info text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle
                                        de Tickets Resueltos
                                    </h5>
                                    <button type="button" class="btn-close" id="ModalResolveIcon"
                                        data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                </div>
                                <div class="modal-body">
                                    <div id="ResolveTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalResolveRegion" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                            <div class="card">
                                <div class="card-body">
                                    <div class="card-content-wrapper">
                                        <div class="numbers">
                                            <p class="card-category">Total Tickets</p>
                                            <h5 id="TotalTicket" class="card-title"></h5>
                                            <p class="card-text mb-0">
                                                <span class="text font-weight-bolder"
                                                    id="totalTicketPercentage"></span>De 100 Mensual
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

                    <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                            <div class="card" id="Card-Send-To-Taller">
                                <div class="card-body">
                                    <div class="card-content-wrapper">
                                        <div class="numbers">
                                            <p class="card-category">POS EN TALLER</p>
                                            <h5 class="card-title" id="TotalEnviadoTaller"></h5>
                                            <p class="card-text mb-0">
                                                <span class="text-percentage" id="PorcentSendToTaller"></span>Del total
                                                de tickets
                                            </p>
                                        </div>
                                        <div class="icon-on-right">
                                            <div class="icon-shape bg-gradient-warning"> <svg
                                                    xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                    fill="currentColor" class="bi bi-wrench-adjustable"
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
                        </div>
                    </div>

                    <div class="modal fade" id="SendTallerTicketsModal" tabindex="-1"
                        aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true"
                        style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-info text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle
                                        de Tickets En Taller
                                    </h5>
                                    <button type="button" class="btn-close" id="ModalTallerIcon" data-bs-dismiss="modal"
                                        aria-label="Cerrar"></button>
                                </div>
                                <div class="modal-body">
                                    <div id="TallerTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalTallerRegion" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div class="card shadow-md rounded-xl transform transition-all duration-300 hover:scale-105">
                            <div class="card">
                                <div class="card-body">
                                    <div class="card-content-wrapper">
                                        <div class="numbers">
                                            <p class="card-category">GESTI&OacuteN COMERCIAL</p>
                                            <h5 class="card-title">4</h5>
                                            <p class="card-text">
                                                <span class="text-success-percentage">+5%</span><span
                                                    class="text-muted">Último mes</span>
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
                </div>

                <div class="row mt-4">

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

                    <div class="modal fade" id="monthlyTicketsModal" tabindex="-1"
                        aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true"
                        style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-info text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle
                                        de Tickets Mensuales
                                    </h5>
                                    <button type="button" class="btn-close" id="ModalStadisticMonthIcon"
                                        data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                </div>
                                <div class="modal-body">
                                    <div id="monthlyTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalStadisticMonth" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="RegionTicketsModal" tabindex="-1"
                        aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true"
                        style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header bg-gradient-info text-white">
                                    <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Detalle
                                        de Tickets Regionales
                                    </h5>
                                    <button type="button" class="btn-close" id="ModalStadisticRegionIcon"
                                        data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                </div>
                                <div class="modal-body">
                                    <div id="RegionTicketsContent"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" id="ModalStadisticRegion" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>

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
                </div>

                <div class="row mt-6">
                    <div class="col-lg-7 mb-lg-0 mb-4">
                        <div class="card shadow-md rounded-xl">
                            <div class="card-header pb-0 p-4 border-b border-gray-200">
                                <div class="flex justify-between items-center">
                                    <h6 class="text-2xl font-semibold text-gray-800">Usuarios Registrados</h6>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table id="userCountTable" class="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Nombre de Usuario</th>
                                            <th
                                                class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Email</th>
                                            <th
                                                class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Fecha de Registro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colspan="3"
                                                class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">
                                                Cargando...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-5">
                        <div class="card shadow-md rounded-xl">
                            <div class="card-header pb-0 p-4 border-b border-gray-200">
                                <h6 class="text-2xl font-semibold text-gray-800">Categorías de Tickets</h6>
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

                                    <li class="list-group-item list-group-item-custom">
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
                                                <span class="item-count">9</span>
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

                <div class="modal fade" id="procesoReparacionModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true" style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header bg-gradient-info text-white">
                                <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Ticket:
                                    Detalles
                                    de los POS en proceso de Reparaci&oacuten
                                </h5>
                                <button type="button" class="btn-close" id="ModalProcessReparacionIcon"
                                    data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>
                            <div class="modal-body">
                                <div id="ReparacionModalTicketsContent"></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" id="ModalProcessReparacion" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Cerrar</buttModalProcessReparacionon>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="ReparadosModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true" style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header bg-gradient-info text-white">
                                <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Ticket:
                                    Detalles
                                    de los POS Reparados
                                </h5>
                                <button type="button" class="btn-close" id="ModalReparadoIcon"
                                    data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>
                            <div class="modal-body">
                                <div id="ReparadoModalTicketsContent"></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" id="ModalReparado" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Cerrar</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="pendienterespuestoModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true" style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header bg-gradient-info text-white">
                                <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Ticket:
                                    Detalles
                                    de los POS Que requieren de Repuestos
                                </h5>
                                <button type="button" class="btn-close" id="ModalpendiRespIcon"
                                    data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>
                            <div class="modal-body">
                                <div id="PendienteRespuesModalTicketsContent"></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" id="ModalPendiRespuu" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Cerrar</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="entregadoClienteModal" tabindex="-1"
                    aria-labelledby="entregadoClienteModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header bg-gradient-primary">
                                <h5 class="modal-title text-white" id="entregadoClienteModalLabel">Tickets: POS
                                    Entregado a Cliente</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                                    aria-label="Close" id="ModalEntregadoClienteIcon"></button>
                            </div>
                            <div class="modal-body" id="entregadoClienteContent">
                                <p class="chart-subtitle text-gray-700 mb-4">Listado de tickets de Puntos de Venta (POS)
                                    que ya han sido entregados al cliente.</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                    id="ModalEntregadoClienteCerrar">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="IrreparableModal" tabindex="-1" aria-labelledby="monthlyTicketsModalLabel" aria-hidden="true" style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header bg-gradient-info text-white">
                                <h5 class="modal-title" style="color: white" id="monthlyTicketsModalLabel">Ticket:
                                    Detalles
                                    de los POS Irreparables
                                </h5>
                                <button type="button" class="btn-close" id="ModalIrreparabltikIcon"
                                    data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>
                            <div class="modal-body">
                                <div id="IrreparableTikModalTicketsContent"></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" id="ModalIrreparableTik" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Cerrar</buttModalProcessReparacionon>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="newPasswordModal" tabindex="-1" aria-labelledby="newPasswordModalLabel"
                    aria-hidden="true"
                    style="display: none; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);"
                    data-bs-backdrop="static" data-bs-keyboard="false">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content rounded-lg shadow-lg">
                            <div class="modal-header bg-gradient-primary text-white rounded-t-lg"
                                id="newPasswordModalHeader">
                                <h5 class="modal-title text-white" id="newPasswordModalLabel">Ingrese Nueva Contraseña
                                </h5>
                                <button type="button" id="CloseIcon" class="btn-close btn-close-white"
                                    data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body p-6">
                                <form id="newPasswordForm">
                                    <input type="hidden" id="modalUserIdForPassword">
                                    <div id="modalTitulLable" class="mb-4">
                                        <label for="newPassword" class="form-label text-gray-700 font-semibold">Nueva
                                            Contraseña:</label>
                                        <input type="password"
                                            class="form-control rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            id="newPassword" required>
                                        <svg id="clickme1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                            <path
                                                d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                        </svg>
                                        <div id="passwordError" class="error"></div>
                                        <div id="passwordVerification" class="success"></div>
                                    </div>
                                    <div id="modalTitulLable" class="mb-4">
                                        <label for="confirmNewPassword"
                                            class="form-label text-gray-700 font-semibold">Confirmar Contraseña:</label>
                                        <input type="password"
                                            class="form-control rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            id="confirmNewPassword" required>
                                        <svg id="clickme" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                            <path
                                                d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                        </svg>
                                        <div id="confirmPasswordError" class="error"></div>
                                    </div>
                                </form>
                                <input type="hidden" id="modalUserIdForPassword">
                            </div>
                            <div class="modal-footer flex justify-end p-4 bg-gray-50 rounded-b-lg">
                                <button type="button"
                                    class="btn btn-secondary rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    data-bs-dismiss="modal" id="Cerrar-botton">Cancelar</button>
                                <button type="button"
                                    class="btn btn-primary rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    id="submitNewPasswordBtn">Guardar Contraseña</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ID USER PARA LA REVISION DE ESTATUS DEL USUARIO -->
                <input type="hidden" id="userIdForPassword" value="<?php echo $_SESSION['id_user']; ?>">
                <!-- END ID USER PARA LA REVISION DE ESTATUS DEL USUARIO -->
                <footer class="footer pt-3  ">
                    <div class="container-fluid">
                        <div class="row align-items-center justify-content-lg-between">
                            <div class="col-lg-6 mb-lg-0 mb-4">
                                <div class="copyright text-center text-sm text-muted text-lg-start">
                                    ©
                                    <script>
                                        document.write(new Date().getFullYear())
                                    </script>,
                                    made with <i class="fa fa-heart"></i> by
                                    <a href="https://www.inteligensa.com/" class="font-weight-bold"
                                        target="_blank">Creative By Inteligensa</a>
                                    for a better web.
                                </div>
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
                }) // Programar la recarga después de que el SweetAlert se cierre
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