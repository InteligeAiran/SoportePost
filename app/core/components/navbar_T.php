<script>
    document.addEventListener('DOMContentLoaded', function() {
        const currentPath = window.location.pathname;
        const base_path = '/SoportePost/'; // Ajusta esto si es necesario

        // Función para marcar el enlace activo
        function setActiveLink(linkId, href) {
            const link = document.getElementById(linkId);
            if (link && currentPath === base_path + href) {
                link.classList.add('active');
            }
        }

        // Marcar el enlace activo
        setActiveLink('inicio-link', 'dashboard2');
        setActiveLink('tickets-link', 'pages/tables.html');
        setActiveLink('rif-link', 'consulta_rif');
        setActiveLink('estadisticas-link', 'pages/profile.html');
    });

</script>


<div class="min-height-300 bg-dark position-absolute w-100"></div>
<aside
    class="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 "
    id="sidenav-main">
    <div class="sidenav-header">
        <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            aria-hidden="true" id="iconSidenav"></i>
        <a class="navbar-brand m-0" href=" https://demos.creative-tim.com/argon-dashboard/pages/dashboard.html "
            target="_blank">
            <img src="<?php echo APP;?>app/public/img/login/Logo.png" width="26px" height="26px"
                class="navbar-brand-img h-100" alt="main_logo">
            <span style="color:#fff;" class="ms-1 font-weight-bold">Airan Bracamonte</span><br>
            <span style="color:#fff;" class="ms-5 font-weight-bold">Tecnico<br>
        </a>
    </div>

    <style>
        .sidenav .navbar-nav .nav-item .nav-link.active {
            background-image: linear-gradient(310deg, #000 0%, #000 100%);
            color: white;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08); /* Añade una sombra sutil */
            border-radius: 8px; /* Redondea las esquinas */
            padding: 10px 15px; /* Ajusta el relleno */
        }

        .sidenav .navbar-nav .nav-item .nav-link.active .icon i,
        .sidenav .navbar-nav .nav-item .nav-link.active .nav-link-text {
            color: white; /* Asegura que el icono y el texto sean blancos */
        }

        .sidenav .navbar-nav .nav-item .nav-link {
            transition: background-color 0.3s ease, color 0.3s ease; /* Añade una transición suave */
            padding: 10px 15px; /* Ajusta el relleno para todos los enlaces */
        }

        .sidenav .navbar-nav .nav-item .nav-link:hover {
            background-color: rgba(0, 0, 0, 0.05); /* Cambia el fondo al pasar el ratón */
            color: #344767; /* Cambia el color del texto al pasar el ratón */
            border-radius: 8px;
        }

        /* Estilos adicionales para mejorar la apariencia */
        .sidenav .navbar-nav .nav-item {
            margin-bottom: 5px; /* Añade un margen entre los elementos */
        }

        .sidenav .navbar-nav .nav-item:last-child {
            margin-bottom: 0; /* Elimina el margen del último elemento */
        }

        .sidenav .navbar-nav .nav-link .nav-link-text {
            font-weight: 600; /* Hace el texto un poco más grueso */
        }

        .sidenav .navbar-nav .nav-link svg {
            margin-right: 8px; /* Añade un margen al icono */
        }
    </style>
    <hr class="horizontal dark mt-0">
    <div class="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" id="inicio-link" href="dashboard2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white"
                        class="bi bi-laptop" viewBox="0 0 16 16">
                        <path
                            d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5" />
                    </svg>
                    <span class="nav-link-text ms-3">Inicio</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="tickets-link" href="../pages/tables.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-ticket-fill" viewBox="0 0 16 16">
                        <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3z"/>
                    </svg>
                    <span class="nav-link-text ms-3">Crear Tickets</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="rif-link" href="consulta_rif">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                    <span class="nav-link-text ms-3">Consultar RIF</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="estadisticas-link" href="../pages/profile.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    <span class="nav-link-text ms-3">Estadisticas Mis Tickets</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="cerrar-link" href="cerrar_session">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                        <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                    </svg>
                    <span class="nav-link-text ms-3">Cerrar Secci&oacuten</span>
                </a>
            </li>
        </ul>
    </div>  
</aside>
