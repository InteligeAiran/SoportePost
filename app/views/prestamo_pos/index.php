<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
function mi_navbar() {}

// Roles que aprueban solicitudes y administran el pool de prestamo
// (ver tabla roles: 1 SuperAdmin, 4 Coordinador, 5 Administrador).
$esAprobador = in_array((int)($_SESSION['id_rol'] ?? 0), [1, 4, 5], true);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
    <link rel="icon" type="image/png" href="../assets/img/favicon.png">

    <title>
        <?php echo tituloPagina; ?> - Prestamo de POS
    </title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />

    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css?v=<?php echo $this->staticAssetVersion('app/plugins/css/dashboard/nucleo-icons.css'); ?>" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css?v=<?php echo $this->staticAssetVersion('app/plugins/css/dashboard/nucleo-svg.css'); ?>" />
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css?v=<?php echo $this->staticAssetVersion('DataTable/datatable.css'); ?>">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css?v=<?php echo $this->staticAssetVersion('DataTable/jquery.dataTables.min.css'); ?>">
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css?v=<?php echo $this->staticAssetVersion('app/plugins/css/General.css'); ?>" />

    <style>
        /* El navbar compartido carga app/plugins/css/navbar/desktop/form.css,
           que trae la regla global "button:hover { background-color: green; }"
           (pensada para un par de botones de formulario, pero escrita como
           selector generico). Nuestras pestañas son <button class="nav-link">,
           asi que tambien la heredan. Se sobreescribe aqui con mayor
           especificidad para recuperar el hover normal de Bootstrap.
           */
        #prestamoTabs .nav-link:hover {
            background-color: transparent;
            color: #003594;
            border-color: #e9ecef #e9ecef #dee2e6;
        }
        #prestamoTabs .nav-link.active:hover {
            color: #212529;
        }

        .badge-estatus-0 { background-color: #6c757d; } /* Disponible */
        .badge-estatus-1 { background-color: #0d6efd; } /* Prestado */
        .badge-estatus-2 { background-color: #fd7e14; } /* Sustituido */
        .badge-estatus-3 { background-color: #198754; } /* Intelipunto (devuelto) */

        .badge-solicitud-1 { background-color: #ffc107; color: #212529; } /* Pendiente por Aprobar */
        .badge-solicitud-3 { background-color: #198754; } /* Gestion finalizada */
        .badge-solicitud-4 { background-color: #dc3545; } /* Rechazado */

        .card-header h5 {
            margin: 0;
        }

        /* Estilo propio para los SweetAlert de este modulo (no el look
           generico de Bootstrap) - mismas clases que ya usa Gestion Tecnico
           para "Solicitar Prestamo de POS", copiadas aqui porque esta pagina
           no carga tecnico.css. */
        .custom-swal-popup {
            border-radius: 0.5rem !important;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
            overflow: hidden;
            max-width: 500px !important;
            width: 100% !important;
        }
        .custom-modal-header-content {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0;
        }
        .custom-swal-content {
            padding: 2rem 1.5rem !important;
            color: #343a40 !important;
            font-size: 1.1rem !important;
        }
        .custom-modal-body-content .h4 {
            font-size: 1.3rem;
            color: #343a40;
        }
        .custom-modal-body-content .h5 {
            font-size: 1rem;
            color: #6c757d;
        }
        .custom-swal-actions {
            background-color: #f8f9fa !important;
            border-top: 1px solid #e9ecef !important;
            border-bottom-left-radius: 0.5rem !important;
            border-bottom-right-radius: 0.5rem !important;
            justify-content: center !important;
            gap: 1rem;
        }
        .custom-confirm-button {
            font-weight: 500 !important;
            min-width: 150px;
        }
        .custom-cancel-button {
            background-color: #6c757d !important;
            border-color: #6c757d !important;
            font-weight: 500 !important;
            min-width: 150px;
        }
        .custom-icon-animation {
            animation: bounceIn 0.6s ease-out;
        }
        @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.1); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }

        /* Las tablas viven dentro de columnas flex (.row > .col-md-6); sin
           min-width:0 el item flex no se encoge por debajo del ancho
           intrinseco de la tabla y empuja toda la pagina hacia los lados. */
        #prestamoTabsContent .row > [class^="col-"] {
            min-width: 0;
        }

        #prestamoTabsContent .table-responsive {
            min-width: 0;
        }

        #tabla-mis-solicitudes,
        #tabla-aprobaciones,
        #tabla-pool {
            table-layout: fixed;
            width: 100%;
        }

        #tabla-mis-solicitudes td,
        #tabla-mis-solicitudes th,
        #tabla-aprobaciones td,
        #tabla-aprobaciones th,
        #tabla-pool td,
        #tabla-pool th {
            white-space: normal;
            word-break: break-word;
            vertical-align: middle;
        }
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
        <div class="container-fluid py-4">

            <div class="card mb-4">
                <div class="card-header pb-0 p-3">
                    <div class="card card-body bg-gradient-blue shadow-primary border-radius-lg pt-4 pb-3">
                        <h5 class="text-black ps-3" style="color:black;">
                            <i class="fas fa-exchange-alt"></i> Prestamo de POS
                        </h5>
                    </div>
                </div>
                <div class="card-body">
                    <ul class="nav nav-tabs" id="prestamoTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="tab-btn-solicitar" data-bs-toggle="tab" data-bs-target="#tab-solicitar" type="button">
                                Mis Solicitudes
                            </button>
                        </li>
                        <?php if ($esAprobador): ?>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="tab-btn-aprobaciones" data-bs-toggle="tab" data-bs-target="#tab-aprobaciones" type="button">
                                Aprobaciones Pendientes
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="tab-btn-pool" data-bs-toggle="tab" data-bs-target="#tab-pool" type="button">
                                Pool de Prestamo
                            </button>
                        </li>
                        <?php endif; ?>
                    </ul>

                    <div class="tab-content pt-4" id="prestamoTabsContent">

                        <!-- ===================== MIS SOLICITUDES ===================== -->
                        <div class="tab-pane fade show active" id="tab-solicitar" role="tabpanel">
                            <p class="text-muted" style="font-size:0.9rem;">
                                El prestamo de POS se solicita desde el ticket del cliente, en el modulo de Gestion Tecnico
                                (boton <i class="bi bi-arrow-left-right"></i> en la fila del ticket). Aqui solo se muestran
                                las solicitudes que tu has creado.
                            </p>
                            <div class="table-responsive">
                                <table id="tabla-mis-solicitudes" class="table table-striped table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th style="width:18%;">Nro Solicitud</th>
                                            <th style="width:12%;">Ticket</th>
                                            <th style="width:24%;">Cliente</th>
                                            <th style="width:16%;">Estatus</th>
                                            <th style="width:16%;">Fecha</th>
                                            <th style="width:14%;">Serial Asignado</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-mis-solicitudes"></tbody>
                                </table>
                            </div>
                        </div>

                        <?php if ($esAprobador): ?>
                        <!-- ===================== APROBACIONES PENDIENTES ===================== -->
                        <div class="tab-pane fade" id="tab-aprobaciones" role="tabpanel">
                            <div class="table-responsive">
                                <table id="tabla-aprobaciones" class="table table-striped table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th style="width:10%;">Nro Solicitud</th>
                                            <th style="width:9%;">Ticket</th>
                                            <th style="width:10%;">RIF</th>
                                            <th style="width:16%;">Razon Social</th>
                                            <th style="width:12%;">Solicitante</th>
                                            <th style="width:19%;">Observacion</th>
                                            <th style="width:10%;">Fecha</th>
                                            <th style="width:14%;">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-aprobaciones"></tbody>
                                </table>
                            </div>
                        </div>

                        <!-- ===================== POOL DE PRESTAMO ===================== -->
                        <div class="tab-pane fade" id="tab-pool" role="tabpanel">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <h6>Agregar POS al pool (desde Intelipunto)</h6>
                                    <div class="input-group mb-2">
                                        <input type="text" id="inputSerialPool" class="form-control" placeholder="Serial del POS">
                                        <button class="btn btn-primary" id="btnBuscarPosIntelipunto" type="button">Buscar</button>
                                    </div>
                                </div>
                            </div>

                            <h6>Inventario de POS en prestamo</h6>
                            <div class="table-responsive">
                                <table id="tabla-pool" class="table table-striped table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th style="width:16%;">Serial</th>
                                            <th style="width:12%;">Marca</th>
                                            <th style="width:10%;">Tipo</th>
                                            <th style="width:12%;">Estatus</th>
                                            <th style="width:12%;">Solicitud</th>
                                            <th style="width:14%;">Fecha Ingreso</th>
                                            <th style="width:24%;">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-pool"></tbody>
                                </table>
                            </div>
                        </div>
                        <?php endif; ?>

                    </div>
                </div>
            </div>

        </div>
    </main>

    <!-- MODAL APROBAR SOLICITUD -->
    <div class="modal fade" id="modalAprobar" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-gradient-primary">
                    <h5 class="modal-title" style="color:white;">Aprobar Solicitud</h5>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="aprobarIdSolicitud">
                    <label for="aprobarSelectPos" class="form-label">Unidad disponible del pool a asignar</label>
                    <select id="aprobarSelectPos" class="form-select"></select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="btnCancelarAprobar">Cancelar</button>
                    <button type="button" class="btn btn-success" id="btnConfirmarAprobar">Aprobar y Asignar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL RECHAZAR SOLICITUD -->
    <div class="modal fade" id="modalRechazar" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-gradient-primary">
                    <h5 class="modal-title" style="color:white;">Rechazar Solicitud</h5>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="rechazarIdSolicitud">
                    <label for="inputMotivoRechazo" class="form-label">Motivo del rechazo</label>
                    <textarea id="inputMotivoRechazo" class="form-control" rows="3"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="btnCancelarRechazar">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="btnConfirmarRechazar">Rechazar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL MARCAR SUSTITUIDO -->
    <div class="modal fade" id="modalSustituido" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-gradient-primary">
                    <h5 class="modal-title" style="color:white;">Marcar como Sustituido</h5>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="sustituidoIdPrestamoPos">
                    <label for="inputObsSustituido" class="form-label">Observacion</label>
                    <textarea id="inputObsSustituido" class="form-control" rows="3"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="btnCancelarSustituido">Cancelar</button>
                    <button type="button" class="btn btn-warning" id="btnConfirmarSustituido">Confirmar</button>
                </div>
            </div>
        </div>
    </div>

    <input type="hidden" id="id_user" value="<?php echo $_SESSION['id_user'] ?? ''; ?>"/>
    <input type="hidden" id="id_rol" value="<?php echo $_SESSION['id_rol'] ?? ''; ?>"/>

    <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.js"></script>

    <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>

    <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>
    <script src="<?php echo APP; ?>app/public/img/dashboard/js/argon-dashboard.min.js?v=2.1.0"></script>

    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

    <?php
        if (isset($this->js)) {
            foreach ($this->js as $js) {
                echo '<script type="text/javascript" src="' . APP . 'app/views/' . $js . '?v=' . $this->assetVersion($js) . '"></script>';
            }
        }
    ?>

    <?php require 'app/footer.php'; ?>
</body>
</html>
