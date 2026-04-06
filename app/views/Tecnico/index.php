<?php
function mi_navbar() {}
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

    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />
    <!-- User Role for JavaScript -->
    <script> var currentUserRole = <?php echo $_SESSION['id_rol'] ?? 'guest'; ?>;</script>
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

             #btn-asignados.btn-primary {
                background-color: #ffc107; /* Amarillo warning */
                border-color: #ffc107;
                color: #ffffff; /* Texto oscuro para contraste */
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Por Asignar cuando es el activo */
            #btn-asignados.btn-primary:hover,
            #btn-asignados.btn-primary:focus {
                background-color: #ffc107; /* Amarillo warning */
                border-color: #ffc107;
                color: #ffffff; /* Texto oscuro para contraste */
                box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
            }

            /* Estilo para el botón Asignados cuando NO es el activo (es gris) */
            #btn-asignados.btn-secondary {
                background-color: #A0A0A0; /* Tu gris sutil */
                border-color: #A0A0A0;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Asignados cuando NO es el activo */
            #btn-asignados.btn-secondary:hover,
            #btn-asignados.btn-secondary:focus {
                background-color: #B0B0B0;
                border-color: #B0B0B0;
                box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
            }

            /* Estilo base para el botón Por Asignar cuando es el activo */
            #btn-por-asignar.btn-primary {
                background-color: #17a2b8; /* Azul info */
                border-color: #17a2b8;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            

            /* Estilo hover/focus para el botón Por Asignar cuando es el activo */
            #btn-por-asignar.btn-primary:hover,
            #btn-por-asignar.btn-primary:focus {
                background-color: #17a2b8; /* Azul info */
                border-color: #17a2b8;
                color: #ffffff;
                box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
            }

            /* Estilo para el botón Por Asignar cuando NO es el activo (es gris) */
            #btn-por-asignar.btn-secondary {
                background-color: #A0A0A0;
                border-color: #A0A0A0;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Por Asignar cuando NO es el activo */
            #btn-por-asignar.btn-secondary:hover,
            #btn-por-asignar.btn-secondary:focus {
                background-color: #B0B0B0;
                border-color: #B0B0B0;
                box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
            }

            /* Estilo base para el botón Recibidos cuando es el activo */
          /* Estilo base para el botón Recibidos cuando es el activo */
            #btn-recibidos.btn-primary {
                background-color: #28a745; /* Verde éxito */
                border-color: #28a745;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Recibidos cuando es el activo */
            #btn-recibidos.btn-primary:hover,
            #btn-recibidos.btn-primary:focus {
                background-color: #28a745; /* Verde éxito */
                border-color: #28a745;
                color: #ffffff;
                box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
                /* Sombra de enfoque/hover */
            }


            /* Estilo para el botón Recibidos cuando NO es el activo (es gris) */
            #btn-recibidos.btn-secondary {
                background-color: #A0A0A0; /* Tu gris sutil */
                border-color: #A0A0A0;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Recibidos cuando NO es el activo */
            #btn-recibidos.btn-secondary:hover,
            #btn-recibidos.btn-secondary:focus {
                background-color: #B0B0B0;
                border-color: #B0B0B0;
                box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
            }

            /* Estilo base para el botón Devuelto cuando es el activo */
            #btn-devuelto.btn-primary {
                color: #ffffff;
                background-color: #dc3545; /* Rojo danger */
                border-color: #dc3545;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Devuelto cuando es el activo */
            #btn-devuelto.btn-primary:hover,
            #btn-devuelto.btn-primary:focus {
                background-color: #dc3545; /* Rojo danger */
                border-color: #dc3545;
                box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
            }

            /* Estilo para el botón Devuelto cuando NO es el activo (es gris) */
            #btn-devuelto.btn-secondary {
                background-color: #A0A0A0; /* Tu gris sutil */
                border-color: #A0A0A0;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Devuelto cuando NO es el activo */
            #btn-devuelto.btn-secondary:hover,
            #btn-devuelto.btn-secondary:focus {
                background-color: #B0B0B0;
                border-color: #B0B0B0;
                box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
            }

            .falla-reportada-texto {
                color: #DC3545; /* Rojo de Bootstrap 'danger' */
                /* O un color naranja: */
                /* color: #FD7E14; */ /* Naranja de Bootstrap 'warning' */
                /* O un color personalizado: */
                /* color: #C0392B; */ /* Un rojo ladrillo */
                /* color: #E67E22; */ /* Un naranja más suave */
                font-weight: bold; /* Opcional: para que resalte más */
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

            .dropdown-menu {
                min-width: 250px; /* Ajusta el ancho del menú desplegable */
            }
            .dropdown-item {
                white-space: normal; /* Permite que el texto del botón se envuelva si es muy largo */
            }

            /* Estilo del menú desplegable personalizado */
            .custom-dropdown {
                border-radius: 0.5rem; /* Bordes redondeados */
                box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; /* Sombra más pronunciada */
                padding: 0.5rem 0; /* Espaciado interno */
            }

            /* Estilo para los elementos del menú */
            .custom-dropdown .dropdown-item {
                font-size: 0.9rem; /* Tamaño de fuente más pequeño */
                padding: 0.5rem 1rem; /* Más espacio para cada opción */
                transition: background-color 0.2s ease, color 0.2s ease; /* Transición suave en el hover */
            }

            /* Efecto de hover para los elementos del menú */
            .custom-dropdown .dropdown-item:hover {
                background-color: #e9ecef; /* Un color de fondo más sutil al pasar el mouse */
                color: #007bff; /* Color del texto cambia al pasar el mouse */
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

        #modalViewcontent{
            width: none  !important;
        }

        #RecibirTec{
            color: white;
            background-color: green;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #uploadFileBtn{
            color: white;
            background-color: #003594;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #uploadFileBtn:hover{
            background-color: green;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        /* PODEMOS APLICAR EN TODOS LOS BOTONES LA ANIMACION DE PULSACION */

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

        /* END ANIMACION DE PULSACION DE BOTONES*/ 

        #CerrarBoton:hover{
            background-color: red;
            color: white;
        }

        #close-botonseleccionAction:hover{
            background-color: red;
            color: white;
        }

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


        /* Botón de Cargar Envío (verde brillante) */
            #EnvioBoton {
                background-color: #38a169;
                border-color: #38a169;
                color: white;
            }

            #EnvioBoton:hover {
                background-color: #2f855a;
                border-color: #2f855a;
            }

            /* Botón de Cargar Exoneración (morado) */
            #ExoBoton {
                background-color: #805ad5;
                border-color: #805ad5;
                color: white;
            }

            #ExoBoton:hover {
                background-color: #6b46c1;
                border-color: #6b46c1;
            }

            /* Botón de Cargar Pago (azul brillante) */
            #PagoBoton {
                background-color: #4299e1;
                border-color: #4299e1;
                color: white;
            }

            #PagoBoton:hover {
                background-color: #3182ce;
                border-color: #3182ce;
            }

            /* Estilos para los botones de VER (COLORES GRISÁCEOS) */

            /* Botón de Ver Envío (gris verdoso) */
            #VerEnvio {
                background-color: #687e74;
                border-color: #687e74;
                color: white;
            }

            #VerEnvio:hover {
                background-color: #55665e;
                border-color: #55665e;
            }

            /* Botón de Ver Exoneración (gris morado) */
            #VerExo {
                background-color: #6d667e;
                border-color: #6d667e;
                color: white;
            }

            #VerExo:hover {
                background-color: #5b556b;
                border-color: #5b556b;
            }

            /* Botón de Ver Pago (gris azulado) */
            #VerPago {
                background-color: #667280;
                border-color: #667280;
                color: white;
            }

            #VerPago:hover {
                background-color: #576370;
                border-color: #576370;
            }

            /* Botón de Ver Convenio Firmado (gris oscuro) */
            #VerConvenio {
                background-color: #6e6e6e;
                border-color: #6e6e6e;
                color: white;
            }

            #VerConvenio:hover {
                background-color: #5c5c5c;
                border-color: #5c5c5c;
            }

        /* Estilos comunes para todos los botones en el modal */
            .modal-body button {
                width: 100%;
                margin-bottom: 10px;
                font-weight: bold;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
            }

            /* Estilos detallados para el modal de pago */
            .form-section {
                background: white;
                border-radius: 10px;
                padding: 18px 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border: 1px solid #e9ecef;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .form-section:hover {
                transform: translateY(-5px) scale(1.01);
                box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15), 
                            0 6px 12px rgba(0, 0, 0, 0.1);
                border-color: #667eea;
                background: linear-gradient(145deg, #ffffff, #f8f9fa);
            }

            .form-section:hover::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }

            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }

            .form-section-header {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 12px;
                border-bottom: 2px solid #f0f0f0;
                transition: all 0.3s ease;
            }

            .form-section:hover .form-section-header {
                border-bottom-color: #667eea;
                padding-bottom: 14px;
            }

            .form-section-header i {
                font-size: 1.1rem;
                margin-right: 10px;
                color: #667eea;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                transition: all 0.3s ease;
            }

            .form-section:hover .form-section-header i {
                transform: scale(1.2) rotate(5deg);
                filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
            }

            .form-section-title {
                font-size: 1.05rem;
                font-weight: 600;
                color: #495057;
                margin: 0;
                letter-spacing: 0.3px;
                transition: all 0.3s ease;
            }

            .form-section:hover .form-section-title {
                color: #667eea;
                transform: translateX(5px);
            }

            .form-section .col-md-6, .form-section .col-md-12, .form-section .col-md-3, .form-section .col-md-4 {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .form-section .col-md-6:hover, .form-section .col-md-12:hover, .form-section .col-md-3:hover, .form-section .col-md-4:hover {
                transform: translateY(-3px) translateX(2px);
                z-index: 5;
            }

            .form-section .form-control:focus, .form-section .form-select:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25), 0 4px 12px rgba(102, 126, 234, 0.15);
                transform: scale(1.02);
                transition: all 0.2s ease;
            }

            .tasa-display {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 8px;
                padding: 10px 18px;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                min-width: 160px;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .tasa-display:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .tasa-display .text-muted {
                color: rgba(255, 255, 255, 0.9) !important;
                font-size: 0.75rem;
            }

            .tasa-value {
                color: #ffffff;
                font-weight: 700;
                font-size: 1.2rem;
                margin-top: 4px;
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
                                                    <h5 class="text-black text-capitalize ps-3" style="color: black;">Gestión Técnico</h5>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="ticket-status-indicator-container"></div>
                                   <table id="tabla-ticket" class="table table-striped table-bordered table-hover table-sm">
                                        <thead>
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

        <!--MODAL AGREGAR DATOS DE PAGO-->
            <div class="modal fade" id="modalAgregarDatosPago" tabindex="-1" aria-labelledby="modalAgregarDatosPagoLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 95vh; display: flex; flex-direction: column;">
                        <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0; padding: 15px 25px; flex-shrink: 0;">
                            <div class="d-flex justify-content-between align-items-center w-100">
                                <h5 class="modal-title mb-0" id="modalAgregarDatosPagoLabel" style="font-weight: 600; font-size: 1.3rem;">
                                    <i class="fas fa-money-bill-wave me-2"></i>Agregar Datos de Pago
                                </h5>
                                <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 10px 15px; min-width: 180px;">
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-dollar-sign me-2"></i>
                                        <div>
                                            <small style="opacity: 0.9; font-size: 0.75rem; display: block;">Monto Referencia</small>
                                            <h5 class="mb-0 fw-bold" id="montoEquipo" style="font-size: 1.1rem;">$0.00</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-body" style="padding: 20px; background: #f8f9fa; overflow-y: auto; flex: 1;">
                            <form id="formAgregarDatosPago">
                                <input type="hidden" id="id_user_pago" name="userId" value="<?php echo isset($_SESSION['id_user']) ? $_SESSION['id_user'] : ''; ?>">
                                <input type="hidden" id="nro_ticket_pago" name="nro_ticket_pago">
                                <input type="hidden" id="id_payment_record_loading">
                                <input type="hidden" id="document_type_pago">
                                
                                <!-- Sección: Información del Cliente -->
                                <div class="form-section">
                                    <div class="form-section-header">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-circle me-2" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>
                                        <h6 class="form-section-title">Información del Cliente</h6>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="displayRazonSocial" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-building me-1 text-primary" viewBox="0 0 16 16"><path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/><path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/></svg>Razón Social
                                            </label>
                                            <input type="text" class="form-control" id="displayRazonSocial" readonly style="background-color: #e9ecef; cursor: not-allowed; font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="displayRif" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                            </label>
                                            <input type="text" class="form-control" id="displayRif" readonly style="background-color: #e9ecef; cursor: not-allowed; font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                        </div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="serialPosPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-barcode me-1 text-primary" viewBox="0 0 16 16"><path d="M1 11.107V4.893C1 4.4 1.398 4 1.889 4H14.11C14.6 4 15 4.398 15 4.893v6.214C15 11.6 14.602 12 14.111 12H1.89C1.4 12 1 11.602 1 11.107ZM1.889 5v6h12.222V5H1.889Z"/><path d="M2 5v6h1V5H2Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1ZM11 5v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Z"/></svg>Serial POS
                                            </label>
                                            <input type="text" class="form-control" id="serialPosPago" readonly style="background-color: #e9ecef; cursor: not-allowed; font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="displayEstatusPos" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-broadcast-pin me-1 text-primary" viewBox="0 0 16 16"><path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656 0a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 0 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.122a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.314.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>Estatus POS
                                            </label>
                                            <input type="text" class="form-control" id="displayEstatusPos" readonly style="background-color: #e9ecef; cursor: not-allowed; font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                        </div>
                                    </div>
                                </div>

                                <div class="form-section">
                                    <div class="form-section-header">
                                        <i class="fas fa-money-bill-wave"></i>
                                        <h6 class="form-section-title">Información de Pago</h6>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="fechaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <i class="fas fa-calendar-alt me-1 text-primary"></i>Fecha Pago <span style="color: #dc3545;">*</span>
                                            </label>
                                            <input type="date" class="form-control" id="fechaPago" required style="font-size: 0.95rem; padding: 8px 12px;">
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="formaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <i class="fas fa-credit-card me-1 text-primary"></i>Forma pago <span style="color: #dc3545;">*</span>
                                            </label>
                                            <select class="form-select" id="formaPago" required style="font-size: 0.95rem; padding: 8px 12px;">
                                                <option value="">Seleccione</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="moneda" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <i class="fas fa-coins me-1 text-primary"></i>Moneda <span style="color: #dc3545;">*</span>
                                            </label>
                                            <select class="form-select" id="moneda" required style="font-size: 0.95rem; padding: 8px 12px;">
                                                <option value="">Seleccionar</option>
                                                <option value="bs">Bolívares (Bs)</option>
                                                <option value="usd">Dólares (USD)</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="estatus_pago_visual" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <i class="fas fa-info-circle me-1 text-primary"></i>Estatus
                                            </label>
                                            <input type="text" class="form-control" id="estatus_pago_visual" placeholder="Estatus del pago" readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef;">
                                        </div>
                                    </div>
                                    <div class="row g-2" id="bancoFieldsContainer" style="display: none;">
                                        <div class="col-md-6 mb-2">
                                            <label for="bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <i class="fas fa-university me-1 text-primary"></i>Banco Origen
                                            </label>
                                            <select class="form-select" id="bancoOrigen" style="font-size: 0.95rem; padding: 8px 12px;">
                                                <option value="">Seleccione</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="bancoDestino" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <i class="fas fa-building me-1 text-primary"></i>Banco Destino
                                            </label>
                                            <select class="form-select" id="bancoDestino" style="font-size: 0.95rem; padding: 8px 12px;">
                                                <option value="">Seleccione</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div id="pagoMovilFieldsContainer" style="display: none; margin-top: 15px;">
                                        <div class="row g-2">
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-success" style="border-width: 2px;">
                                                    <div class="card-header bg-success text-white" style="padding: 8px 12px;">
                                                        <h6 class="mb-0" style="font-size: 0.95rem; font-weight: 600;">Origen</h6>
                                                    </div>
                                                    <div class="card-body" style="padding: 15px;">
                                                        <div class="mb-2">
                                                            <div class="d-flex gap-2">
                                                                <select class="form-select" id="origenRifTipo" style="font-size: 0.9rem; width: 35%;">
                                                                    <option value="">Tipo</option>
                                                                    <option value="J">J</option>
                                                                    <option value="V">V</option>
                                                                    <option value="E">E</option>
                                                                </select>
                                                                <input type="text" class="form-control" id="origenRifNumero" placeholder="Número RIF" style="font-size: 0.9rem; width: 65%;">
                                                            </div>
                                                        </div>
                                                        <div class="mb-2">
                                                            <input type="text" class="form-control" id="origenTelefono" placeholder="Nro. Telefónico" style="font-size: 0.9rem;">
                                                        </div>
                                                        <div>
                                                            <select class="form-select" id="origenBanco" style="font-size: 0.9rem;">
                                                                <option value="">Banco Origen</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-primary" style="border-width: 2px;">
                                                    <div class="card-header bg-primary text-white" style="padding: 8px 12px;">
                                                        <h6 class="mb-0" style="font-size: 0.95rem; font-weight: 600;">Destino</h6>
                                                    </div>
                                                    <div class="card-body" style="padding: 15px;">
                                                        <div class="mb-2">
                                                            <div class="d-flex gap-2">
                                                                <select class="form-select" id="destinoRifTipo" disabled style="font-size: 0.9rem; width: 35%; background-color: #e9ecef;">
                                                                    <option value="J" selected>J</option>
                                                                </select>
                                                                <input type="text" class="form-control" id="destinoRifNumero" value="002916150" readonly style="font-size: 0.9rem; width: 65%; background-color: #e9ecef;">
                                                            </div>
                                                        </div>
                                                        <div class="mb-2">
                                                            <input type="text" class="form-control" id="destinoTelefono" value="04122632231" readonly style="font-size: 0.9rem; background-color: #e9ecef;">
                                                        </div>
                                                        <div>
                                                            <select class="form-select" id="destinoBanco" disabled style="font-size: 0.9rem; background-color: #e9ecef;">
                                                                <option value="">Banco Destino</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-section">
                                    <div class="form-section-header d-flex justify-content-between align-items-center">
                                        <div>
                                            <i class="fas fa-exchange-alt"></i>
                                            <h6 class="form-section-title mb-0">Montos y Referencias</h6>
                                        </div>
                                        <div class="tasa-display">
                                            <div class="text-end text-white">
                                                <small id="fechaTasaDisplay">Tasa: --</small>
                                                <h5 class="mb-0 fw-bold tasa-value" id="tasaDisplayValue">Cargando...</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Monto Bs</label>
                                            <div class="input-group">
                                                <input type="number" class="form-control" id="montoBs" step="0.01" placeholder="0.00" style="font-size: 0.95rem;" readonly>
                                                <span class="input-group-text" style="font-size: 0.85rem; background-color: #f8f9fa;">Bs</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Monto REF</label>
                                            <div class="input-group">
                                                <input type="number" class="form-control" id="montoRef" step="0.01" placeholder="0.00" style="font-size: 0.95rem;" readonly>
                                                <span class="input-group-text" style="font-size: 0.85rem; background-color: #f8f9fa;">USD</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Referencia <span style="color: #dc3545;">*</span></label>
                                            <input type="text" class="form-control" id="referencia" required style="font-size: 0.95rem;">
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Depositante <span style="color: #dc3545;">*</span></label>
                                            <input type="text" class="form-control" id="depositante" required style="font-size: 0.95rem;">
                                        </div>
                                    </div>
                                </div>

                                <!-- Sección: Soporte Digital -->
                                <div class="form-section">
                                    <div class="form-section-header">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cloud-arrow-up me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/><path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/></svg>
                                        <h6 class="form-section-title">Soporte Digital</h6>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-12 mb-2">
                                            <label for="documentFileDetailed" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-arrow-up me-1 text-primary" viewBox="0 0 16 16"><path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>Documento de Pago <span style="color: #dc3545;">*</span>
                                            </label>
                                            <!-- Drop zone container -->
                                            <div id="fileDropZone" style="border: 2px dashed #cbd5e0; border-radius: 8px; padding: 30px; text-align: center; background: #f8f9fa; cursor: pointer; transition: all 0.3s ease;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#a0aec0" class="bi bi-camera mb-2" viewBox="0 0 16 16"><path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/><path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>
                                                <p style="color: #4a5568; font-size: 1rem; margin: 10px 0 5px 0; font-weight: 500;">Adjunte el Documento de Pago</p>
                                                <small style="color: #a0aec0; font-size: 0.85rem;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-info-circle me-1" viewBox="0 0 16 16" style="vertical-align: middle;"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
                                                    Formatos permitidos: JPG, PNG, GIF o PDF (Máx. 5MB)
                                                </small>
                                            </div>
                                            <input type="file" class="d-none" id="documentFileDetailed" accept="image/jpg, image/png, image/gif, application/pdf" required>
                                            <!-- File name display with green indicator -->
                                            <div id="fileNameDisplay" style="display: none; margin-top: 10px; padding: 12px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#22c55e" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
                                                    <span id="fileNameText" style="color: #16a34a; font-weight: 500; font-size: 0.95rem;"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-section">
                                    <div class="form-section-header">
                                        <i class="fas fa-info-circle"></i>
                                        <h6 class="form-section-title">Información Adicional</h6>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="registro" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <i class="fas fa-book me-1 text-primary"></i>Registro
                                            </label>
                                            <input type="text" class="form-control" id="registro" placeholder="Número de registro (generado automáticamente)" readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; cursor: not-allowed;">
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="fechaCarga" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Fecha carga</label>
                                            <input type="date" class="form-control" id="fechaCarga" readonly style="background-color: #e9ecef; cursor: not-allowed;">
                                        </div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-12 mb-2">
                                            <label for="obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Obs. Administración</label>
                                            <textarea class="form-control" id="obsAdministracion" rows="2" style="font-size: 0.95rem; resize: vertical;"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer" style="background: #f8f9fa; border-radius: 0 0 12px 12px; padding: 15px 25px;">
                            <button type="button" class="btn btn-secondary px-4" id="btnCancelarModalPagoFooter">
                                <i class="fas fa-times me-2"></i>Cancelar
                            </button>
                            <button type="button" class="btn btn-primary px-4" id="btnGuardarDatosPago" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                                <i class="fas fa-save me-2"></i>Guardar Completo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL AGREGAR DATOS DE PAGO-->

        <input type="hidden" id="payment_id_to_save" value="">

        <!--MODAL PARA SELECCIONAR LAS ACCIONES-->
            <div id="actionSelectionModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <button id="BtnCerrarSelecionAccion" type="button" class="btn-close" aria-label="Close"></button>
                            <h2 style="color: white;">Seleccionar Acción</h2>
                        </div>
                        <div class="modal-body">
                            <p style="font-size: 115%;">¿Qué acción deseas realizar con el ticket?</p>
                        </div>
                        <div class="action-buttons">
                            <button class="btn-primary" id="ButtonSendToTaller">Enviar a Taller</button>
                            <button class="btn-secondary" id="devolver">Devolver al Cliente</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SELECCIONAR LAS ACCIONES-->

        <!-- MODAL DE DEVOLUCION AL CLIENTE-->
            <div id="devolverClienteModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h2  style="color: white;">Devolver al Cliente</h2>
                        </div>
                        <div class="modal-body">
                            <p style="font-size: 115%;">¿Estás seguro de que deseas devolver el Pos con el Serial: <span style="display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;" id="SerialLabel"></span> al cliente?</p>
                            <div class="form-group">
                                <label for="observacionesDevolver">Observaciones:</label>
                                <textarea class="form-control" id="observacionesDevolver" rows="3"  placeholder="Se cargó el documento de anticipo la [FECHA] para el Ticket Nro. [NRO_TICKET]. Adicionalmente, agregar un comentario"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id = "BttonCloseModalDevolucion" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="confirmDevolverCliente">Confirmar Devolución</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- MODAL DE DEVOLUCION AL CLIENTE-->

        <!-- MODAL PARA SELECCIONAR TECNICO -->
           <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div id="ModalConfirmarSendTaller" class="modal-content">
                        <div class="modal-header bg-gradient-primary text-white">
                            <h5 class="modal-title" id="staticBackdropLabel">Confirmación de Envío a Taller</h5>
                        </div>
                        <div class="modal-body text-center">
                            <div class="mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16">
                                    <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/>
                                </svg>
                            </div>
                            <p class="h4 mb-3" style="color: black;">¿Deseas enviar a taller el POS asociado <span id="serialpos"></span> al nro de ticket:</p>
                            <span class="h4 mb-3" id="modalTicketNr"></span><p class="h4 mb-3">?</p>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button id="close-button" type="button" class="btn btn-lg btn-secondary">Cerrar</button>
                            <button id="SendToTaller-button" type="button" class="btn btn-lg btn-primary">Enviar a Taller</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA SELECCIONAR TECNICO-->

        <!--MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="uploadDocumentModal" tabindex="-1" aria-labelledby="uploadDocumentModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary text-white">
                            <h5 class="modal-title" id="uploadDocumentModalLabel">
                            Subir Documento para el Nro Ticket: <span id="modalTicketId" class="fw-bold"></span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">
                            <form id="uploadForm">
                                <!-- Campos ocultos -->
                                <input type="hidden" id="id_ticket">
                                <input type="hidden" id="type_document">

                                <div class="mb-3">
                                    <label for="documentFile" class="form-label text-gray-700 fw-semibold">
                                        Seleccionar Archivo:
                                    </label>
                                    
                                    <!-- Wrapper con position-relative para que Bootstrap muestre los mensajes de feedback -->
                                    <div class="position-relative">
                                        <input class="form-control" type="file" id="documentFile" accept="image/jpg, image/png, image/gif, application/pdf" required>

                                        <!-- Mensajes de validación de Bootstrap -->
                                        <div class="valid-feedback">
                                            Formato correcto
                                        </div>
                                        <div class="invalid-feedback">
                                            Solo se permiten imágenes (JPG, PNG, GIF) o PDF
                                        </div>
                                    </div>
                                    
                                    <!-- Mensaje informativo que se oculta cuando hay validación activa -->
                                    <small id="fileFormatInfo" class="text-gray-500 d-block mt-1" style="transition: opacity 0.2s;">
                                        Formatos permitidos: JPG, PNG, GIF o PDF
                                    </small>
                                </div>
                                
                                <!-- SECCIÓN COMENTADA PARA USO FUTURO: Soportes o Retenciones Adicionales
                                <div id="btnTogglePaymentDocsContainer" class="mb-3 d-none">
                                    <button type="button" id="btnTogglePaymentDocs" class="btn btn-outline-primary btn-sm w-100">
                                        <i class="bi bi-plus-circle me-1"></i> Agregar Soportes o Retenciones
                                    </button>
                                </div>

                                <div id="payment-docs-extension" class="d-none bg-light p-3 rounded mb-3 border">
                                    <h6 class="text-primary mb-3" style="font-size: 0.9rem;">Documentos Adicionales</h6>
                                    
                                    <div class="mb-3">
                                        <label for="docSoportePago" class="form-label small fw-bold text-gray-700">Soporte de Pago</label>
                                        <input class="form-control form-control-sm" type="file" id="docSoportePago" name="docSoportePago" accept="image/jpg, image/png, image/gif, application/pdf">
                                    </div>
                                    
                                    <div class="mb-0">
                                        <label for="docRetenciones" class="form-label small fw-bold text-gray-700">Comprobante de Retención</label>
                                        <input class="form-control form-control-sm" type="file" id="docRetenciones" name="docRetenciones" accept="image/jpg, image/png, image/gif, application/pdf">
                                    </div>
                                </div>
                                -->

                                <!-- Previsualización DESACTIVADA POR MOTIVOS DE SEGURIDAD -->
                                <!-- La previsualización ha sido desactivada para prevenir posibles inyecciones de código -->
                                <div id="imagePreviewContainer" class="text-center" style="display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; width: 0 !important; overflow: hidden !important; max-height: 0 !important; padding: 0 !important; margin: 0 !important;">
                                    <img id="imagePreview" class="img-fluid rounded shadow-sm" src="#" alt="Previsualización" style="display: none !important; visibility: hidden !important; opacity: 0 !important; max-height: 0 !important; height: 0 !important; width: 0 !important;">
                                </div>
                            </form>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="CerrarBoton" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-warning" id="generateNotaEntregaBtn">
                            Generar Nota de Entrega
                            </button>
                            <button type="button" class="btn btn-primary" id="uploadFileBtn" disabled>
                            Subir Archivo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->

        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content" id="modalViewcontent">
                        <div class="modal-header bg-gradient-primary">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="viewDocumentModalLabel">
                                    Documento para Nro Ticket: <span id="viewModalTicketId"></span>
                                </h5>
                            </strong>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label>Nombre de la imagen: <span id="NombreImage"></span></label>
                            </div>
                            <div class="mb-3 text-center" style="max-height: 80vh; overflow-y: auto;">
                                <img id="imageViewPreview" class="img-fluid" src="#" alt="Previsualización de Imagen" style="height: auto; display: none; object-fit: contain;">
                                <div id="pdfViewViewer" style="width: 100%; height: 70vh; display: none;"></div>
                            </div>
                            <div id="viewDocumentMessage" class="message-box hidden text-center mt-3"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="CerrarModalVizualizar" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
        
        <!-- MODAL PARA ACCIONES DE DOCUMENTOS -->
            <div class="modal fade" id="documentActionsModal" tabindex="-1" role="dialog" aria-labelledby="documentActionsModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content" style="width: 65%; margin-left: 21%;">
                    <div class="modal-header">
                        <h5 class="modal-title" id="documentActionsModalLabel" style="color: #000;">Acciones de Documentos</h5>                  
                    </div>
                    <div class="modal-body">
                        <p>Selecciona una opción para guardar documento del ticket <strong id="modalTicketId"></strong>:</p>
                        <div id="modal-buttons-container" class="d-grid gap-2">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id = "close-botonseleccionAction" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                    </div>
                </div>
            </div>
        <!-- MODAL PARA ACCIONES DE DOCUMENTOS -->

        <!-- PARA SELECCIONAR LOS COMPONENTES ASOCIADOS AL SERIAL DEL POS -->
            <div class="modal fade" id="modalComponentes" tabindex="-1" aria-labelledby="modalComponentesLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-gradient-primary">
                                <h5 class="modal-title text-white" id="modalComponentesLabel">
                                    <i class="bi bi-box-seam-fill me-2"></i>Lista de Componentes del Dispositivo
                                </h5>
                            </div>
                            <div class="modal-body p-4" id="detailedPaymentForm">
                                <input type="hidden" id="id_payment_record_loading">
                                <input type="hidden" id="document_type_pago">
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

        <!-- MODAL DE NOTA DE ENTREGA -->
            <div class="modal fade" id="htmlTemplateModal" tabindex="-1" aria-labelledby="htmlTemplateModalLabel" aria-hidden="true" style="background-color: rgba(0,0,0,.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h5 class="modal-title" id="htmlTemplateModalLabel">Generar Nota de Entrega</h5>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                            <input type="hidden" id="htmlTemplateTicketId" value="">
                            <div class="col-md-6">
                                <label class="form-label">Fecha</label>
                                <input type="text" id="ne_fecha" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">N° de Nota</label>
                                <input type="text" id="ne_numero" class="form-control" readonly>
                            </div>

                            <div class="col-12"><strong>Datos del Cliente</strong></div>
                            <div class="col-md-6">
                                <label class="form-label">RIF/Identificación</label>
                                <input type="text" id="ne_rif" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Razón Social</label>
                                <input type="text" id="ne_razon" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Responsable</label>
                                <input type="text" id="ne_responsable" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Contacto</label>
                                <input type="text" id="ne_contacto" class="form-control" readonly>
                            </div>

                            <div class="col-12"><strong>Detalles del Equipo</strong></div>
                            <div class="col-md-6">
                                <label class="form-label">Proveedor</label>
                                <input type="text" id="ne_proveedor" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Modelo</label>
                                <input type="text" id="ne_modelo" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Número de Serie</label>
                                <input type="text" id="ne_serial" class="form-control" readonly>
                            </div>
                            <!-- ✅ AGREGAR ESTOS CAMPOS -->
                            <div class="col-md-6">
                                <label class="form-label">Banco</label>
                                <input type="text" id="ne_banco" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Componentes</label>
                                <input type="text" id="ne_componentes" class="form-control" readonly>
                            </div>

                            <div class="col-12"><strong>Información del Envío</strong></div>
                            <div class="col-md-6">
                                <label class="form-label">Estado de Origen</label>
                                <input type="text" id="ne_region_origen" class="form-control" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Estado de Destino</label>
                                <input type="text" id="ne_region_destino" class="form-control" readonly>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Observaciones de Envío</label>
                                <textarea id="ne_observaciones" class="form-control" rows="3" placeholder="Opcional"></textarea>
                            </div>

                            <div class="col-12">
                                <button type="button" class="btn btn-secondary" id="previewHtmlTemplateBtn">Previsualizar</button>
                                <button type="button" class="btn btn-success" id="printHtmlTemplateBtn">Imprimir / Guardar PDF</button>
                            </div>
                            <div class="col-12" style="height: 400px;">
                                <iframe id="htmlTemplatePreview" style="width:100%; height:100%; border:1px solid #ddd;"></iframe>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="closeHtmlTemplateBtn">Cerrar</button>
                    </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL DE NOTA DE ENTREGA-->

        <input type="hidden" id="userId" value="<?php echo $_SESSION['id_user']; ?>">
        
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

        <!-- File Drop Zone Script -->
        <script>
        // ========== FILE DROP ZONE FUNCTIONALITY ==========
        document.addEventListener('DOMContentLoaded', function() {
            const fileDropZone = document.getElementById('fileDropZone');
            const fileInput = document.getElementById('documentFileDetailed');
            const fileNameDisplay = document.getElementById('fileNameDisplay');
            const fileNameText = document.getElementById('fileNameText');
            
            if (!fileDropZone || !fileInput) return;
            
            // Click to upload
            fileDropZone.addEventListener('click', function() {
                fileInput.click();
            });
            
            // File input change event
            fileInput.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    showFileSuccess(file.name);
                }
            });
            
            // Drag and drop events
            fileDropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.style.borderColor = '#667eea';
                this.style.background = '#f0f4ff';
            });
            
            fileDropZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.style.borderColor = '#cbd5e0';
                this.style.background = '#f8f9fa';
            });
            
            fileDropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.style.borderColor = '#cbd5e0';
                this.style.background = '#f8f9fa';
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    fileInput.files = files;
                    showFileSuccess(files[0].name);
                }
            });
            
            function showFileSuccess(filename) {
                if (fileNameDisplay && fileNameText) {
                    fileNameText.textContent = filename;
                    fileNameDisplay.style.display = 'block';
                    
                    // Hide drop zone, show success indicator
                    fileDropZone.style.display = 'none';
                }
            }
            
            // Reset when modal closes
            const modal = document.getElementById('modalAgregarDatosPago');
            if (modal) {
                modal.addEventListener('hidden.bs.modal', function() {
                    if (fileInput) fileInput.value = '';
                    if (fileNameDisplay) fileNameDisplay.style.display = 'none';
                    if (fileDropZone) fileDropZone.style.display = 'block';
                });
            }
        });
        </script>

        <!-- PARTE DEL CODIGO DE SESSION EXPIRADAS-->
            <?php
                require 'app/footer.php';
            ?>
        <!-- END PARTE DEL CODIGO DE SESSION EXPIRADAS-->
    </body>
</html>