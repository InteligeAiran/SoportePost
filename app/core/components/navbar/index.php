<?php
//var_dump($_SESSION['usuario']);
?>
<!DOCTYPE html>
<html lang="es">

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
        .nav-link.dropdown-toggle.d-flex.align-items-center svg {
            margin-right: 0.75rem; /* Espacio entre el icono y el texto del enlace principal */
        }

        /* Opcional: Estilo para la flecha del dropdown si no se ve bien con la posición static */
        .nav-link.dropdown-toggle::after {
            display: none; /* Oculta la flecha por defecto de Bootstrap si no queda bien */
        }

        /* Reduce el margen superior para los elementos del menú principal */
        .sidenav .nav-item {
            margin-top: 1.5rem !important; /* Originalmente podría ser 1rem o más con mt-3, ajusta a tu gusto */
            margin-bottom: 1.5rem !important; /* Añade un pequeño margen inferior si lo deseas */
        }

        /* Si hay algún padding extra en los enlaces, ajústalo */
        .sidenav .nav-link {
            padding-top: 1.5rem; /* Ajusta el padding superior */
            padding-bottom: 1.5rem; /* Ajusta el padding inferior */
        }

        .sidenav .nav-link h6 {
            margin: 0; /* Asegura que el h6 no tenga márgenes propios que añadan espacio */
            padding: 0; /* Asegura que el h6 no tenga padding propio */
        }

        .dropdown-indicator {
            margin-left: 10%; /* Empuja la flecha hacia la derecha */
        }

        .dropend .dropdown-menu {
            left: 100%;
            margin-left: .125rem;
        }

        /* Asegura que el contenedor de la flecha permita la transición */
        .dropdown-indicator .dropdown-arrow {
            transition: transform 0.3s ease; /* Transición suave para la rotación */
        }

        /* Cuando el dropdown está abierto (aria-expanded="true"), rota la flecha */
        .dropdown-item.dropdown-toggle[aria-expanded="true"] .dropdown-arrow {
            transform: rotate(90deg); /* Rota 90 grados para que apunte hacia abajo (si inicialmente apunta a la derecha) */
        }

        /* Cuando el dropdown está cerrado (aria-expanded="false"), la flecha vuelve a su posición original */
        .dropdown-item.dropdown-toggle[aria-expanded="false"] .dropdown-arrow {
            transform: rotate(0deg); /* Vuelve a la posición original (apuntando a la derecha) */
        }
    </style>
</head>
<body class="g-sidenav-show bg-gray-100">
    <aside class="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-1" id="sidenav-main">
        <div class="sidenav-header">
            <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
                aria-hidden="true" id="iconSidenav"></i>
            <a class="navbar-brand m-0" target="_blank">
                <img src="<?php echo APP; ?>app/public/img/login/Logo.png" width="26px" height="26px"
                    class="navbar-brand-img h-100" alt="main_logo">
                <span style="color:#fff;" class="ms-1 font-weight-bold"><?php echo $_SESSION['nombres']?> <?php echo $_SESSION['apellidos']?></span><br>
                <span style="color:#fff;" class="ms-5 font-weight-bold"><?php echo $_SESSION['name_rol']?><br>
            </a>
        </div>
        <hr class="horizontal dark mt-0">
        <div class="collapse navbar-collapse w-auto " id="sidenav-collapse-main">
            <ul class="navbar-nav" id="main-navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" id="inicio-link" href="dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-laptop"
                            viewBox="0 0 16 16">
                            <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5" />
                        </svg>
                        <h6 class="nav-link-text ms-3">Inicio</h6><br><br>
                    </a>
                </li>
            </ul>
        </div>
        <input type="hidden" id="id_user" value="<?php echo $_SESSION['id_user']?>"/>
    </aside>

    <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>

    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.js"></script>

    <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>

    <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/datatables/datatables.js"></script>

    <script src="<?php echo APP; ?>app/plugins/chart.js/chart.js"></script>
    <script src="<?php echo APP; ?>app/plugins/chart.js/chart.min.js"></script>

    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

    <script src="<?php echo APP; ?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>

    <script src="<?php echo APP; ?>app/plugins/js/sb-admin-2.min.js"></script>

    <script src="<?php echo APP; ?>app/core/components/navbar/js/frontEnd1.js"></script>
</body>

</html>
