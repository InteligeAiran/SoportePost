<?php
function mi_navbar()
{

}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
    <link rel="icon" type="image/png" href="../assets/img/favicon.png">
    <title>
        Soporte POST
    </title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />

    <link rel="stylesheet" type="text/css"
        href="<?php echo APP; ?>app/plugins/bootstrap-5.3.6/dist/css/bootstrap.min.css" />

    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />

    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">
    <link rel="stylesheet" type="text/css"
        href="<?php echo APP; ?>app/plugins/bootstrap-5.3.6/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/DataTable/dataTables.min.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/DataTable/datatable.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/DataTable/bootstrap.css" />
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
            width: 18%;
        }

        /* Estilizar el label "Buscar:" */
        div.dataTables_wrapper div.dataTables_filter label {
            font-weight: bold;
            /* Ejemplo: Texto en negrita */
            color: #333;
            /* Ejemplo: Color del texto */
            margin-right: 0.5em;
            /* Ejemplo: Espacio a la derecha del label */
            margin-left: -100%;
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

        /* --- CSS para Diseño de Modal Responsivo (Sin depender de las clases responsivas de Bootstrap para el modal en sí) --- */

        /* Fondo oscuro que cubre toda la pantalla (backdrop) */
        .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            /* 100% del ancho del viewport */
            height: 100vh;
            /* 100% de la altura del viewport */
            background-color: rgba(0, 0, 0, 0.6);
            /* Negro semi-transparente */
            z-index: 1040;
            /* Capa por debajo del modal */
            display: none;
            /* Oculto por defecto */
            opacity: 0;
            /* Para la transición de opacidad */
            transition: opacity 0.3s ease-in-out;
            /* Animación de aparición/desaparición */
        }

        .modal-backdrop.show {
            opacity: 1;
            /* Mostrar con opacidad completa */
            display: block;
            /* Asegurar que se muestre */
        }


        /* Contenedor principal del modal (la ventana visible) */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1050;
            /* Capa por encima del backdrop */
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            /* Permite desplazamiento si el contenido es largo */
            outline: 0;
            display: none;
            /* Oculto por defecto */
            /* Usamos flexbox para centrar el modal vertical y horizontalmente */
            display: flex;
            align-items: center;
            /* Centrado vertical */
            justify-content: center;
            /* Centrado horizontal */
            padding: 1rem;
            /* Espacio alrededor del modal en pantallas muy pequeñas */

            opacity: 0;
            /* Para la transición de opacidad */
            transition: opacity 0.3s ease-in-out;
            /* Animación de aparición/desaparición */
        }

        .modal.show {
            opacity: 1;
            /* Mostrar con opacidad completa */
            display: flex;
            /* Asegurar que se muestre como flex */
        }

        /* El cuadro del contenido del modal */
        .modal-dialog {
            position: relative;
            width: 95%;
            /* Ocupa casi todo el ancho en móviles */
            max-width: 550px;
            /* Ancho máximo en pantallas grandes */
            margin: auto;
            /* Centrado con margen automático */
            pointer-events: none;
            /* Permite interacciones a través del diálogo si no hay contenido */
        }

        /* El contenido real del modal (fondo blanco, bordes, sombra) */
        .modal-content {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            pointer-events: auto;
            /* Ahora sí permite interacciones */
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: 0.5rem;
            /* Bordes redondeados suaves */
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
            /* Sombra para profundidad */
            outline: 0;
            max-height: 90vh;
            /* Máxima altura para evitar que se desborde la pantalla */
            overflow-y: auto;
            /* Scroll si el contenido del modal es más alto que el max-height */
        }

        /* Encabezado del modal */
        .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem 1.5rem;
            /* Más padding para mejor diseño */
            border-bottom: 1px solid #e9ecef;
            /* Línea separadora */
            border-top-left-radius: calc(0.5rem - 1px);
            border-top-right-radius: calc(0.5rem - 1px);
            background-color: #f8f9fa;
            /* Fondo ligeramente gris para el encabezado */
        }

        .modal-title {
            margin-bottom: 0;
            line-height: 1.5;
            font-size: 1.35rem;
            /* Título un poco más grande */
            font-weight: 600;
            /* Más peso para el título */
            color: #343a40;
            /* Color oscuro para el texto */
        }

        /* Botón de cerrar (la 'X') */
        .btn-close {
            background: none;
            /* Sin fondo */
            border: none;
            /* Sin borde */
            font-size: 1.8rem;
            /* 'X' más grande y visible */
            font-weight: 300;
            /* Más delgada */
            color: #6c757d;
            /* Color gris suave */
            cursor: pointer;
            padding: 0.5rem;
            margin: -0.75rem -0.75rem -0.75rem auto;
            /* Ajuste para centrar y pegarlo a la esquina */
            transition: color 0.2s ease-in-out;
        }

        .btn-close:hover {
            color: #495057;
            /* Un poco más oscuro al pasar el ratón */
        }

        /* Cuerpo del modal */
        .modal-body {
            position: relative;
            flex: 1 1 auto;
            padding: 1.5rem;
            /* Más padding para el contenido */
        }

        /* Pie de página del modal */
        .modal-footer {
            display: flex;
            flex-wrap: wrap;
            /* Permite que los botones salten de línea en pantallas pequeñas */
            align-items: center;
            justify-content: flex-end;
            /* Botones a la derecha */
            padding: 1rem 1.5rem;
            border-top: 1px solid #e9ecef;
            /* Línea separadora */
            border-bottom-right-radius: calc(0.5rem - 1px);
            border-bottom-left-radius: calc(0.5rem - 1px);
            gap: 0.75rem;
            /* Espacio entre los botones */
        }


        /* --- Estilos para los elementos del formulario dentro del modal (manteniendo un diseño agradable) --- */

        .mb-3 {
            margin-bottom: 1.25rem;
            /* Margen inferior para separar campos */
        }

        .form-label {
            display: block;
            /* Hace que la etiqueta ocupe su propia línea */
            margin-bottom: 0.5rem;
            font-weight: 600;
            /* Negrita para las etiquetas */
            color: #495057;
            /* Color de texto para las etiquetas */
            font-size: 0.95rem;
        }

        .form-control,
        .form-select {
            display: block;
            width: 100%;
            padding: 0.6rem 0.75rem;
            /* Más padding para mayor área táctil */
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #495057;
            /* Color de texto para los inputs */
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: 0.35rem;
            /* Bordes ligeramente más redondeados */
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            -webkit-appearance: none;
            /* Resetear estilos de apariencia de navegador */
            -moz-appearance: none;
            appearance: none;
        }

        .form-control:focus,
        .form-select:focus {
            border-color: #80bdff;
            /* Borde azul al enfocar */
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            /* Sombra azul al enfocar */
        }

        .form-control[readonly] {
            background-color: #e9ecef;
            /* Fondo gris para campos de solo lectura */
            opacity: 1;
            /* Asegurar opacidad normal */
            cursor: not-allowed;
            /* Cursor de no permitido */
        }

        /* Estilos para botones */
        .btn {
            display: inline-block;
            font-weight: 500;
            /* Peso de fuente ligeramente más fuerte */
            line-height: 1.5;
            color: #212529;
            text-align: center;
            vertical-align: middle;
            cursor: pointer;
            user-select: none;
            background-color: transparent;
            border: 1px solid transparent;
            padding: 0.5rem 1rem;
            /* Más padding para los botones */
            font-size: 1rem;
            border-radius: 0.3rem;
            /* Bordes redondeados */
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .btn-primary {
            color: #fff;
            background-color: #007bff;
            /* Azul primario */
            border-color: #007bff;
        }

        .btn-primary:hover {
            color: #fff;
            background-color: #0069d9;
            border-color: #0062cc;
        }

        .btn-secondary {
            color: #fff;
            background-color: #6c757d;
            /* Gris secundario */
            border-color: #6c757d;
        }

        .btn-secondary:hover {
            color: #fff;
            background-color: #5a6268;
            border-color: #545b62;
        }

        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            border-radius: 0.2rem;
        }

        /* Alertas de error */
        .alert {
            position: relative;
            padding: 0.75rem 1.25rem;
            margin-bottom: 1rem;
            border: 1px solid transparent;
            border-radius: 0.25rem;
        }

        .alert-danger {
            color: #721c24;
            background-color: #f8d7da;
            border-color: #f5c6cb;
        }

        /* Ocultar elementos visualmente para lectores de pantalla pero no para el diseño */
        .visually-hidden {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        }

        /* Estilos para el select en la columna de la tabla */
        .cambiar-estatus-domiciliacion-btn {
            white-space: nowrap;
            /* Evita que el texto del botón se rompa en varias líneas */
        }

        /* Media query para pantallas más pequeñas si necesitas ajustes específicos,
        aunque el diseño flexbox ya maneja bien la responsividad básica */
        @media (max-width: 576px) {
            .modal-dialog {
                margin: 0.5rem;
                /* Reduce el margen en pantallas muy pequeñas */
                width: calc(100% - 1rem);
                /* Asegura que el modal no toque los bordes */
            }

            .modal-header,
            .modal-body,
            .modal-footer {
                padding: 1rem;
                /* Reduce el padding en pantallas pequeñas */
            }

            .modal-title {
                font-size: 1.15rem;
                /* Título un poco más pequeño en móviles */
            }

            .btn {
                width: 100%;
                /* Botones de footer a ancho completo en móviles */
                margin-bottom: 0.5rem;
                /* Espacio entre botones */
            }

            .modal-footer {
                flex-direction: column;
                /* Apila los botones en el footer */
                align-items: stretch;
                /* Estira los botones para llenar el ancho */
            }
        }
    </style>
    <!-- CSS Files -->
    <link id="pagestyle" rel="stylesheet"
        href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
    <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/dashboard.css" />
</head>

<body id="fondo" class="g-sidenav-show bg-gray-100">
    <div class="min-height-300 bg-dark position-absolute w-100">
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
        <main class="main-content position-relative border-radius-lg">
            <div class="container-fluid py-4">
                <div id="Row" class="row mt-4">
                    <div class="cord">

                        <div class="card">
                            <div class="card-header pb-0 p-3">
                                <div class="col-lg-12 col-md-12 mt-4 mb-4">
                                    <div
                                        class="card card-body bg-gradient-blue shadow-primary border-radius-lg pt-4 pb-3">
                                        <strong>
                                            <h5 class="text-black text-capitalize ps-3">TICKETS</h5>
                                        </strong>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <!--h6 id = "cliente" class="mb-2">Clientes</h6-->
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table id="tabla-ticket"
                                    class="table table-striped table-bordered table-hover table-sm">
                                    <thead>

                                    </thead>
                                    <tbody id="table-ticket-body">
                                        <tr>
                                            <td colspan="3">No hay datos</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <input type="hidden" id="idTicket" value="<?php echo $_SESSION['id_user'] ?>">
            <div class="modal fade" id="changeStatusDomiciliacionModal" tabindex="-1" aria-labelledby="changeStatusDomiciliacionModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="changeStatusDomiciliacionModalLabel">Cambiar Estatus de
                                Domiciliación</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="changeStatusDomiciliacionForm">
                                <div class="mb-3">
                                    <label for="modalTicketIdDomiciliacion" class="form-label">ID Ticket:</label>
                                    <input type="text" class="form-control" id="modalTicketIdDomiciliacion" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="modalCurrentStatusDomiciliacion" class="form-label">Estado
                                        Actual:</label>
                                    <input type="text" class="form-control" id="modalCurrentStatusDomiciliacion"
                                        readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="modalNewStatusDomiciliacionSelect" class="form-label">Nuevo
                                        Estado:</label>
                                    <select class="form-select" id="modalNewStatusDomiciliacionSelect">
                                        <option value="">Cargando opciones...</option>
                                    </select>
                                </div>
                                <div id="errorMessageDomiciliacion" class="alert alert-danger" style="display:none;">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="saveStatusDomiciliacionChangeBtn">Guardar
                                Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
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

    <!-- Github buttons -->
    <script async defer src="https://buttons.github.io/buttons.js"></script>
    <!-- Control Center for Soft Dashboard: parallax effects, scripts for the example pages etc -->

    <!-- Bootstrap-->
    <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.js"></script>

    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.js"></script>

    <!--JQUERY-->
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>

    <!--   Core JS Files   -->
    <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>
    <script src="<?php echo APP; ?>app/public/img/dashboard/js/argon-dashboard.min.js?v=2.1.0"></script>

    <!-- Datatable -->
    <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/datatables/datatables.js"></script>

    <!--  SweetAlert   -->
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

    <!--MASCARAS JQUERY-->
    <script src="<?php echo APP; ?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>

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
            })// Programar la recarga después de que el SweetAlert se cierre
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