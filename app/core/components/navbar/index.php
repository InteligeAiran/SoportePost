<?php
//var_dump($_SESSION['usuario']);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
    <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
    <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/navbar/styleGeneral.css" />
    <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/navbar/desktop/form.css" />
    
    <script>
        const ENDPOINT_BASE = '<?php echo ENDPOINT_BASE_DYNAMIC; ?>';
        const APP_PATH = '<?php echo APP_BASE_PATH; ?>';
    </script>
    <style>
        #sidenav-collapse-main ul{
            position: absolute;
        }

        /* Dentro de tu archivo CSS personalizado o la etiqueta <style> */

        /* Estilo para el dropdown-menu cuando está dentro del sidenav */
        #sidenav-main .dropdown-menu {
            position: static !important; /* Hace que el dropdown fluya en el documento, no flotante */
            float: none; /* Elimina flotación si la hubiera */
            width: 100%; /* Ocupa todo el ancho de su contenedor (el li padre) */
            margin-top: 0;
            margin-bottom: 0;
            border-radius: 0;
            background-color: #344767; /* Un color de fondo más oscuro para que se parezca al sidenav */
            border: none;
            padding: 0; /* Elimina padding por defecto si quieres que los ítems se extiendan completamente */
        }

        #sidenav-main .dropdown-menu .dropdown-item {
            color: #f8f9fa; /* Color de texto claro para los ítems del menú */
            padding: 0.75rem 1.5rem; /* Ajusta el padding para alinear con otros elementos del nav */
            transition: background-color 0.2s ease, color 0.2s ease;
        }

        #sidenav-main .dropdown-menu .dropdown-item:hover,
        #sidenav-main .dropdown-menu .dropdown-item:focus {
            background-color: rgba(255, 255, 255, 0.1); /* Un hover suave */
            color: #ffffff;
        }

        /* Si quieres que el icono y el texto se alineen como en otros items de la barra */
        #crearTicketDropdown.nav-link.dropdown-toggle {
            display: flex;
            align-items: center;
        }

        #crearTicketDropdown.nav-link.dropdown-toggle svg {
            margin-right: 0.75rem; /* Espacio entre el icono y el texto del enlace principal */
        }

        /* Opcional: Estilo para la flecha del dropdown si no se ve bien con la posición static */
        #crearTicketDropdown.nav-link.dropdown-toggle::after {
            display: none; /* Oculta la flecha por defecto de Bootstrap si no queda bien */
        }

        /* Reduce el margen superior para los elementos del menú principal */
.sidenav .nav-item {
    margin-top: 0.5rem !important; /* Originalmente podría ser 1rem o más con mt-3, ajusta a tu gusto */
    margin-bottom: 0.5rem !important; /* Añade un pequeño margen inferior si lo deseas */
}

/* Si hay algún padding extra en los enlaces, ajústalo */
.sidenav .nav-link {
    padding-top: 0.5rem; /* Ajusta el padding superior */
    padding-bottom: 0.5rem; /* Ajusta el padding inferior */
}

/* Para los elementos con el h6 dentro (como Consultas y Reportes, Administración, Configuración) */
.sidenav .nav-link h6 {
    margin: 0; /* Asegura que el h6 no tenga márgenes propios que añadan espacio */
    padding: 0; /* Asegura que el h6 no tenga padding propio */
}

/* Si estás usando la clase 'mt-3' directamente en el HTML, podrías cambiarla por una más pequeña
   o crear una clase personalizada: */
/* .my-custom-margin-sm {
    margin-top: 0.5rem !important;
} */
    </style>
</head>
<body class="g-sidenav-show bg-gray-100">
    <aside class="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-1" id="sidenav-main">
    <div class="sidenav-header">
        <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            aria-hidden="true" id="iconSidenav"></i>
        <a class="navbar-brand m-0"
            target="_blank">
            <img src="<?php echo APP; ?>app/public/img/login/Logo.png" width="26px" height="26px"
                class="navbar-brand-img h-100" alt="main_logo">
            <span style="color:#fff;" class="ms-1 font-weight-bold"><?php echo $_SESSION['nombres']?> <?php echo $_SESSION['apellidos']?></span><br>
            <span style="color:#fff;" class="ms-5 font-weight-bold"><?php echo $_SESSION['name_rol']?><br>
        </a>
    </div>
    <hr class="horizontal dark mt-0">
    <div class="collapse navbar-collapse w-auto " id="sidenav-collapse-main">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" id="inicio-link" href="dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-laptop"
                        viewBox="0 0 16 16">
                        <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5" />
                    </svg>
                    <span class="nav-link-text ms-3">Inicio</span>
                </a>
            </li>

           <hr class="horizontal dark my-3">

           <li class="nav-item dropdown mt-3">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="gestionTicketsDropdown" role="button"  data-bs-toggle="dropdown" aria-expanded="false">
                    <h6 style="color: white; margin: 0; padding-left: .5rem;" class="flex-grow-1">Gestión de Tickets</h6>
                </a>
                <ul class="dropdown-menu" aria-labelledby="gestionTicketsDropdown">
                    <li class="dropend"> <a class="dropdown-item dropdown-toggle" href="#" id="crearTicketSubDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-plus-square-fill me-2" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
                            </svg>
                            Crear Ticket
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="crearTicketSubDropdown">
                            <li><a class="dropdown-item" href="#" data-value="Sustitución de POS">Sustitución de POS</a></li>
                            <li><a class="dropdown-item" href="#" data-value="Préstamo de POS">Préstamo de POS</a></li>
                            <li><a class="dropdown-item" href="#" data-value="Desafiliación de POS">Desafiliación de POS</a></li>
                            <li><a class="dropdown-item" href="#" data-value="Migración de Bancos">Migración de Bancos</a></li>
                            <li><a class="dropdown-item" href="#" data-value="Cambio de Razón Social">Cambio de Razón Social</a></li>
                        </ul>
                    </li>

                    <li><hr class="dropdown-divider"></li> <li>
                        <a class="dropdown-item" id="assignment-ticket" href="asignar_tecnico">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ticket-fill me-2" viewBox="0 0 16 16">
                                <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3z"/>
                            </svg>
                            Gestión Coordinador
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" id="tecnico" href="tecnico">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-workspace me-2" viewBox="0 0 16 16">
                                <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                                <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"/>
                            </svg>
                            Gestión Técnicos
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" id="taller" href="taller">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-tools me-2" viewBox="0 0 16 16">
                                <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z" />
                            </svg>
                            Gestión Taller
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" id="pendiente_entrega" href="pendiente_entrega">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck-front-fill me-2" viewBox="0 0 16 16">
                                <path d="M3.5 0A2.5 2.5 0 0 0 1 2.5v9c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2v-9A2.5 2.5 0 0 0 12.5 0zM3 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.9c0 .625-.562 1.092-1.17.994C10.925 7.747 9.208 7.5 8 7.5s-2.925.247-3.83.394A1.008 1.008 0 0 1 3 6.9zm1 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2m8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2m-5-2h2a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2"/>
                            </svg>
                            Pendiente por Entrega
                        </a>
                    </li>
                </ul>
            </li>

            <hr class="horizontal dark my-3"> 

            <li class="nav-item dropdown mt-3" id="consultasReportesMenuItem">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="consultasReportesDropdown" role="button" aria-expanded="false">
                    <h6 style="color: white; margin: 0; padding-left: .5rem;" class="flex-grow-1">Consultas y Reportes</h6>
                </a>
                <ul class="dropdown-menu" aria-labelledby="consultasReportesDropdown">
                    <li class="dropend"> <a class="dropdown-item dropdown-toggle" href="#" id="Reportes" role="button" aria-expanded="false"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search me-2" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                            Consultas General
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="Reportes">
                            <li><a class="dropdown-item" style="display: block;" href="consulta_rif" data-value="Consulta Rif" id="rif-link">Consulta de Rif</a></li>
                            <li><a class="dropdown-item" style="display: block;" href="consulta_ticket" data-value="Reportes Tickets" id="tickets-link">Reportes Tickets</a></li>
                        </ul>
                    </li>
                </ul>
            </li>

            <hr class="horizontal dark my-3">

           <li class="nav-item dropdown mt-3" id="administracionMenuItem">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="administracionDropdown" role="button" aria-expanded="false">
                    <h6 style="color: white; margin: 0; padding-left: .5rem;" class="flex-grow-1">Administración</h6>
                </a>
                <ul class="dropdown-menu" aria-labelledby="administracionDropdown">
                    <li>
                        <a class="dropdown-item" id="domiciliacion" href="domiciliacion">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16">
                                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/>
                            </svg>
                            Verificación de Solvencia
                         </a>
                    </li>
                </ul>
            </li>

            <hr class="horizontal dark my-3">

            <li class="nav-item dropdown mt-3" id="sistemaMenuItem">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="sistemaDropdown" role="button" aria-expanded="false">
                    <h6 style="color: white; margin: 0; padding-left: .5rem;" class="flex-grow-1">Configuración</h6>
                </a>
                <ul class="dropdown-menu" aria-labelledby="sistemaDropdown">
                    <li>
                        <a class="dropdown-item" id="gestion_users" href="gestionusers">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-person-gear" viewBox="0 0 16 16">
                                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                            </svg>
                            <span class="nav-link-text ms-3">Gestión Usuario</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" id="cerrar-link" href="cerrar_session">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                                <path fill-rule="evenodd"
                                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                            </svg>
                            <span class="nav-link-text ms-3">Cerrar Sesión</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <input type="hidden" id="id_user" value="<?php echo $_SESSION['id_user']?>"/> 
</aside>


    <!--JQUERY-->
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>

    <!-- Bootstrap-->
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.js"></script>

    <!--   Core JS Files   -->
    <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>

    <!-- Datatable -->
    <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/datatables/datatables.js"></script>

    <!-- Chart -->
    <script src="<?php echo APP; ?>app/plugins/chart.js/chart.js"></script>
    <script src="<?php echo APP; ?>app/plugins/chart.js/chart.min.js"></script>

    <!--  SweetAlert   -->
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

    <!--MASCARAS JQUERY-->
    <script src="<?php echo APP; ?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="<?php echo APP; ?>app/plugins/js/sb-admin-2.min.js"></script>

    <script src="<?php echo APP; ?>app/core/components/navbar/js/frontEnd1.js"></script>
</body>

</html>