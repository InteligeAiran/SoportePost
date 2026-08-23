<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
function mi_navbar() {}
?>
<!DOCTYPE html>
<lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="icon" type="image/png" href="../assets/img/favicon.png">
        <title>
            <?php echo tituloPagina; ?>
        </title>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/dashboard.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/user/desktop/desktop.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/DataTable/dataTables.min.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/DataTable/datatable.css" />
        <style>
            /* Timeline de acciones sobre tickets del modal "Ver Acciones" —
               mismo lenguaje visual (badge + tarjeta) que el historial de
               tickets del dashboard, en vertical y simplificado para poder
               mostrar muchas acciones de un usuario sin scroll horizontal. */
            .accion-timeline {
                list-style: none;
                margin: 0;
                padding: 0;
                position: relative;
                text-align: left;
            }
            .accion-timeline::before {
                content: '';
                position: absolute;
                left: 19px;
                top: 0;
                bottom: 0;
                width: 2px;
                background-color: #dee2e6;
            }
            .accion-timeline li {
                position: relative;
                padding-left: 54px;
                margin-bottom: 16px;
            }
            .accion-timeline .accion-badge {
                position: absolute;
                left: 0;
                top: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #003594;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            }
            .accion-timeline .accion-badge-documento {
                background-color: #b7791f;
            }
            .accion-timeline .accion-card {
                background: #fff;
                border: none;
                border-radius: 12px;
                padding: 12px 16px;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
                transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }
            .accion-timeline .accion-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
            }
            .accion-timeline .accion-card-header {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-bottom: 6px;
                gap: 8px;
            }
            .accion-ticket-pill {
                display: inline-block;
                background: #e7edfb;
                color: #003594;
                font-weight: 700;
                font-size: 0.75rem;
                padding: 2px 10px;
                border-radius: 50px;
                white-space: nowrap;
            }
            .accion-timeline .accion-card small {
                color: #6c757d;
                white-space: nowrap;
            }

            /* Cada ticket es su propia sección con encabezado, en vez de
               una sola lista larga mezclando eventos de tickets distintos. */
            .ticket-grupo {
                margin-bottom: 20px;
            }
            .ticket-grupo-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
                padding-bottom: 6px;
                border-bottom: 2px solid #e9ecef;
                cursor: pointer;
                user-select: none;
            }
            .ticket-grupo-header:hover .accion-ticket-pill {
                background: #003594;
                color: #fff;
            }
            .ticket-grupo-count {
                color: #6c757d;
                font-size: 0.8rem;
            }
            .ticket-grupo-chevron {
                color: #6c757d;
                transition: transform 0.2s ease-in-out;
                display: inline-block;
                margin-left: auto;
            }
            .ticket-grupo-header.expandido .ticket-grupo-chevron {
                transform: rotate(180deg);
            }
            .accion-titulo {
                font-weight: 600;
                color: #212529;
                margin-bottom: 2px;
            }
            .accion-subtexto {
                color: #6c757d;
                font-size: 0.9rem;
                word-break: break-word;
            }
            .acciones-resumen {
                display: flex;
                gap: 10px;
                margin-bottom: 14px;
                flex-wrap: wrap;
            }
            .acciones-resumen span {
                background: #f1f3f5;
                color: #495057;
                font-size: 0.8rem;
                font-weight: 600;
                padding: 4px 12px;
                border-radius: 50px;
            }

            /* Header real para el modal "Ver Acciones" — mismo patrón que
               usa gestion_regions para sus modales (barra de color con
               título en blanco), en vez del título plano de SweetAlert2
               que se confundía con el texto de la descripción. Se le quita
               el padding por defecto al popup para que la barra llegue de
               borde a borde con las esquinas redondeadas. */
            .acciones-swal-popup {
                padding: 0 !important;
                border-radius: 14px !important;
                overflow: hidden;
            }
            .acciones-swal-header {
                background-color: #003594;
                color: #fff;
                padding: 1.1rem 1.5rem;
                font-size: 1.25rem;
                font-weight: 700;
                text-align: left;
            }
            .acciones-swal-body {
                padding: 1.25rem 1.5rem 0.5rem;
            }
            .acciones-swal-popup .swal2-actions {
                margin: 1rem 1.5rem 1.5rem;
            }

            /* El buscador de DataTables no trae borde propio de esta app —
               mismo estilo que ya usa consulta_ticket para su input de
               búsqueda. */
            div.dataTables_wrapper div.dataTables_filter input[type="search"] {
                border: 1px solid #ced4da;
                border-radius: 0.375rem;
                padding: 0.375rem 0.75rem;
                font-size: 0.95rem;
                color: #495057;
                background-color: #fff;
                outline: 0;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }
            div.dataTables_wrapper div.dataTables_filter input[type="search"]:focus {
                border-color: #86b7fe;
                box-shadow: 0 0 0 0.2rem rgba(0, 53, 148, 0.25);
            }
            div.dataTables_wrapper div.dataTables_length select {
                border: 1px solid #ced4da;
                border-radius: 0.375rem;
                padding: 0.25rem 0.5rem;
            }

            /* Panel "Detalle de Conexión" — tarjetas al estilo de las que ya
               usa ticket-utils.js (formatTicketDetailsPanel) en el resto de
               la app, en vez de simples filas de texto. */
            .perfil-avatar {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: #003594;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: 700;
                flex-shrink: 0;
            }
            .perfil-rol-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 50px;
                background: #e7edfb;
                color: #003594;
                font-size: 0.8rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .detalle-stat-card {
                background: #ffffff;
                border-radius: 12px;
                border: none;
                box-shadow: 0 0 12px rgba(0, 53, 148, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
                padding: 14px 16px;
                margin-bottom: 12px;
                transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            }
            .detalle-stat-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 15px rgba(0, 53, 148, 0.25), 0 6px 15px rgba(0, 0, 0, 0.08);
            }
            .detalle-stat-card h6 {
                color: #111827;
                font-size: 0.75rem;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 6px;
            }
            .detalle-stat-card p {
                color: #495057;
                font-size: 1rem;
                font-weight: 500;
                margin-bottom: 0;
                word-break: break-word;
            }
        </style>
    </head>

    <body class="g-sidenav-show bg-gray-100">
        <div class="min-height-300 bg-dark position-absolute w-100"></div>

        <?php require_once 'app/core/components/navbar/index.php'; mi_navbar(); ?>

        <main class="main-content position-relative border-radius-lg overflow-hidden bg-gray-100">
            <div class="container-fluid py-4">
                <div class="row">
                    <div class="col-lg-12 mb-4">
                        <div class="card card-body bg-gradient-blue shadow-primary border-radius-lg pt-4 pb-3">
                            <strong><h5 class="text-black text-capitalize ps-3" style="color: black;">Monitoreo de Usuarios — Última Conexión y Acciones</h5></strong>
                        </div>
                    </div>
                </div>

                <div class="row" style="height: 75vh;">
                    <div class="col-md-7 h-100 d-flex flex-column">
                        <div class="table-responsive flex-grow-1 overflow-auto">
                            <table id="tabla-monitoreo-usuarios" class="background-users-table">
                                <thead>
                                    <tr>
                                        <th>Nombre y Apellido</th>
                                        <th>Usuario</th>
                                        <th>Rol</th>
                                        <th>Última Conexión</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="tabla-monitoreo-usuarios-body"></tbody>
                            </table>
                        </div>
                    </div>

                    <div class="col-md-5 h-100 d-flex flex-column border-start ps-4">
                        <h3 class="mb-3">Detalle de Conexión</h3>
                        <div id="detalle-conexion-panel" class="flex-grow-1 overflow-auto p-3 bg-light rounded">
                            <strong>
                                <p>Selecciona un usuario de la tabla para ver aquí su correo, última conexión e IP.</p>
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>

        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>

        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.js"></script>

        <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
        <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

        <?php
            if (isset($this->js)){
                foreach ($this->js as $js){
                    echo '<script type="text/javascript" src="'.APP.'app/views/'.$js.'"></script>';
                }
            }
        ?>
        <?php require 'app/footer.php'; ?>
    </body>
</html>
