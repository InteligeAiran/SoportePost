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

         <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">


    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />
    <style>
      
        #ticket-details-panel table td, table th {
            white-space: normal !important;
        }

        /* Contenedor de paginación de DataTables */
        .dataTables_wrapper .dataTables_paginate.paging_simple_numbers {
            /* Puedes ajustar márgenes o padding aquí si es necesario */
            margin-top: 15px; /* Espacio superior para separar de la tabla */
        }

        /* Estilo para los elementos LI de la paginación (números, Anterior, Siguiente) */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button {
            background-color: #f0f0f0; /* Un gris claro para el fondo */
            color: black; /* Un gris oscuro para el texto */
            border: 1px solid #cccccc; /* Un borde sutil */
            padding: 8px 12px;
            margin: 0 4px;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; /* Transición suave */
            border-radius: 4px; /* Bordes ligeramente redondeados */
            list-style: none; /* Eliminar viñetas de lista */
            display: inline-block; /* Asegura que se comporten como bloques en línea */
        }

        /* Estilo al pasar el puntero (hover) sobre los LI que no están activos ni deshabilitados */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button:hover:not(.active):not(.disabled) {
            background-color: #fff; /* Un gris ligeramente más oscuro al pasar el puntero */
            color: #007bff; /* Un azul suave para el texto, o puedes mantener el gris oscuro */
            border-color: #a0a0a0; /* Un borde un poco más visible */
            text-decoration: none; /* Asegurar que no haya subrayado si hay un enlace dentro */
        }

        /* Estilo de la página activa */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button.active {
            background-color: #8392ab; /* Azul para la página activa (puedes elegir un color más sutil aquí) */
            color: #ffffff; /* Texto blanco para la página activa */
            border-color: #8392ab; /* Borde del mismo color que el fondo */
            cursor: default; /* No cambia el cursor al pasar por la página actual */
        }

        /* Estilo para los botones deshabilitados (Anterior, Siguiente, o los "...") */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button.disabled {
            background-color: #f8f8f8; /* Un gris muy claro, casi blanco */
            color: #999999; /* Un gris más claro para el texto */
            border: 1px solid #e0e0e0; /* Un borde muy sutil */
            cursor: not-allowed; /* Indica que no es clickeable */
            pointer-events: none; /* Asegura que no sea clickeable incluso si hay un 'a' dentro */
        }

        /* Si los "..." tienen una clase específica como 'ellipsis', puedes añadirla aquí,
        pero generalmente .disabled los cubre si están dentro de un li.paginate_button. */
        /* .dataTables_wrapper .dataTables_paginate ul.pagination li.ellipsis {
            background-color: #f8f8f8;
            color: #999999;
            border: 1px solid #e0e0e0;
            cursor: default;
        } */       


        /* Estilo al pasar el puntero (hover) sobre los elementos de paginación NO activos y NO deshabilitados */
        .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button:hover:not(.active):not(.disabled) {
            background-color: #fff; /* Un gris ligeramente más oscuro al pasar el puntero (sutil) */
            color: #003594; /* Azul suave para el texto al hacer hover, o puedes mantener el gris oscuro si prefieres menos cambio */
            border-color: white; /* Borde un poco más visible al hacer hover */
        }
    </style>
    </head>

    <body id="fondo" class="g-sidenav-show bg-gray-100">
        <div class="min-height-300 bg-dark position-absolute w-100"></div>
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


        <main class="main-content position-relative border-radius-lg ">
            <div class="container-fluid py-4" style="height: calc(100vh - 80px);">
                <div class="row h-100">
                    <div class="col-md-7 h-100 d-flex flex-column">
                        <div id="Row" class="row mt-4">
                            <div class="cord">
                                <div class="card">
                                    <div class="card-header pb-0 p-3">
                                        <div class="col-lg-12 col-md-12 mt-4 mb-4">
                                            <div
                                                class="card card-body bg-gradient-blue shadow-primary border-radius-lg pt-4 pb-3">
                                                <strong>
                                                    <h5 class="text-black text-capitalize ps-3">Gestión de Técnico</h5>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                   <table id="tabla-ticket"
                                        class="table table-striped table-bordered table-hover table-sm">
                                       <thead>
                                            <tr>
                                                <th scope="col">ID Ticket</th>
                                                <th scope="col">RIF</th>
                                                <th scope="col">Razón Social</th>
                                                <th scope="col">Fecha Creación</th>
                                                <th scope="col">Técnico Asignado</th>
                                                <th scope="col">Nro Ticket</th>
                                                <th scope="col">Acción Ticket</th> <th scope="col">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-group-divider" id="table-ticket-body">
                                            <tr>
                                                <td colspan="3">No hay datos</td>
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
        </main>

        <!-- MODAL PARA SELECCIONAR TECNICO -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div id="ModalSelecttecnico" class="modal-content">
                    <div class="modal-header">
                        <!--h1 class="modal-title fs-5" id="staticBackdropLabel">Seleccione un Técnico</h1-->
                        <button id="Close-icon" type="button" class="btn-close" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-size: 200%; font-family: ui-monospace;">Deseas Enviar al Taller?</p>
                    </div>
                    <div class="modal-footer">
                        <button id="close-button" type="button" class="btn btn-secondary">Cerrar</button>
                        <button id="SendToTaller-button" type="button" class="btn btn-primary">Enviar a Taller</button>
                    </div>
                </div>
            </div>
        </div>
        <!--MODAL PARA SELECCIONAR TECNICO-->

        <!--MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="uploadDocumentModal" tabindex="-1" aria-labelledby="uploadDocumentModalLabel"
                aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); display: none;">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="uploadDocumentModalLabel">Subir
                                    Documento para Ticket: <span id="modalTicketId"></span></h5>
                            </strong>
                            <button type="button" id="icon-close" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="uploadForm">
                                <div class="mb-3">
                                    <label for="documentFile" class="form-label text-gray-700">Seleccionar Archivo:</label>
                                    <input class="form-control" type="file" id="documentFile" accept="image/*,application/pdf"
                                        style="display:block">
                                    <small class="text-gray-500">Solo imágenes (JPG, PNG, GIF) o PDF.</small>
                                </div>
                                <div class="mb-3 text-center">
                                    <img id="imagePreview" class="img-preview" src="#" alt="Previsualización de Imagen">
                                </div>
                                <div id="uploadMessage" class="message-box hidden"></div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="CerrarBoton"
                                data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="uploadFileBtn">Subir</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->

        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel"
                aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="viewDocumentModalLabel">
                                    Documento para Ticket: <span id="viewModalTicketId"></span></h5>
                            </strong>
                            <button type="button" class="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3 text-center">
                                <img id="imageViewPreview" class="img-fluid" src="#" alt="Previsualización de Imagen"
                                    style="max-width: 100%; height: auto; display: none;">
                                <div id="pdfViewViewer"
                                    style="width: 100%; height: 600px; display: none; border: 1px solid #ddd;"></div>
                            </div>
                            <div id="viewDocumentMessage" class="message-box hidden text-center mt-3"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="modalCerrarshow" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
    <input type="hidden" id="userId" value="<?php echo $_SESSION['id_user']; ?>">

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
        <!--JQUERY-->

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

        <script src="<?php echo APP; ?>DataTable/jquery.dataTables.min.js"></script>
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