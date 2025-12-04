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
        <?php echo tituloPagina; ?>
    </title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">
        <link rel="stylesheet" href="<?php echo APP; ?>app/plugins/animate-css/animate.min.css"/>

        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />
    <style>
       #marcarrecibido{
            background-color: green;
            border: none;
            color: white;
        }

        div.dataTables_wrapper div.dataTables_length label {
            font-weight: bold;
            /* Ejemplo: Texto en negrita */
            color: #333;
            /* Ejemplo: Color del texto */
            margin-right: 10px;
            /* Ejemplo: Espacio a la derecha del label */
        }

         /* Estilo para los elementos LI de la paginación (números, Anterior, Siguiente) */
            .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button {
                background-color: #f0f0f0;
                /* Un gris claro para el fondo */
                color: black;
                /* Un gris oscuro para el texto */
                border: 1px solid #cccccc;
                /* Un borde sutil */
                padding: 8px 12px;
                margin: 0 4px;
                cursor: pointer;
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
                /* Transición suave */
                border-radius: 4px;
                /* Bordes ligeramente redondeados */
                list-style: none;
                /* Eliminar viñetas de lista */
                display: inline-block;
                /* Asegura que se comporten como bloques en línea */
            }

            /* Estilo al pasar el puntero (hover) sobre los LI que no están activos ni deshabilitados */
            .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button:hover:not(.active):not(.disabled) {
                background-color: #fff;
                /* Un gris ligeramente más oscuro al pasar el puntero */
                color: #007bff;
                /* Un azul suave para el texto, o puedes mantener el gris oscuro */
                border-color: #a0a0a0;
                /* Un borde un poco más visible */
                text-decoration: none;
                /* Asegurar que no haya subrayado si hay un enlace dentro */
            }

            /* Estilo de la página activa */
            .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button.active {
                background-color: #8392ab;
                /* Azul para la página activa (puedes elegir un color más sutil aquí) */
                color: #ffffff;
                /* Texto blanco para la página activa */
                border-color: #8392ab;
                /* Borde del mismo color que el fondo */
                cursor: default;
                /* No cambia el cursor al pasar por la página actual */
            }

            /* Estilo para los botones deshabilitados (Anterior, Siguiente, o los "...") */
            .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button.disabled {
                background-color: #f8f8f8;
                /* Un gris muy claro, casi blanco */
                color: #999999;
                /* Un gris más claro para el texto */
                border: 1px solid #e0e0e0;
                /* Un borde muy sutil */
                cursor: not-allowed;
                /* Indica que no es clickeable */
                pointer-events: none;
                /* Asegura que no sea clickeable incluso si hay un 'a' dentro */
            }


        /* Estilizar el input de búsqueda al enfocarlo */
        div.dataTables_wrapper div.dataTables_filter input[type="search"]:focus {
            color: #495057;
            background-color: #fff;
            border-color: #007bff;
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
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
                /* margin-left: -100%;*/
                width: 10%;
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
            width: 600% !important;
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

        #tabla-ticket td {
            padding: 1rem;
            /* Ajusta este valor para más o menos padding. 1rem = 16px */
            vertical-align: middle;
            /* Opcional: Centra el contenido verticalmente */
        }

        #BtnChange {
            background-color: #003594;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #BtnChange:hover {
            background-color: green;
        }

        #uploadFileBtn,
        #openModalButton {
            background-color: #003594;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #openModalButton:hover {
            background-color: green;
        }

        #uploadFileBtn:hover {
            background-color: green;
        }

        #viewimage {
            background-color: #20B2AA;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #viewimage:hover {
            background-color: #4CC9B7;
        }

        #CerrarBoton,
        #modalCerrarshow {
            background-color: #8392ab;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #modalCerrarshow:hover {
            background-color: red;
        }

        #CerrarBoton:hover {
            background-color: red;
        }

        #icon-close,
        #btn-close {
            background-color: #8392ab;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        #icon-close:hover {
            background-color: red;
        }

        #btn-close:hover {
            background-color: red;
        }

        body {
            font-family: "Inter", sans-serif;
            background-color: #f0f2f5;
        }

        .modal-content {
            border-radius: 0.75rem;
            /* Rounded corners for the modal */
        }

        .btn-primary {
            background-color: #3b82f6;
            /* Blue color for primary button */
            border-color: #3b82f6;
            border-radius: 0.5rem;
            /* Rounded corners for buttons */
        }

        .btn-primary:hover {
            background-color: #2563eb;
            border-color: #2563eb;
        }

        .highlighted-change {
            font-weight: bold;
            color: #000; /* Color de texto más oscuro para mayor contraste */
            background-color: #ffeb3b; /* Amarillo claro */
            padding: 2px 5px;
            border-radius: 3px;
        }

        .btn-info {
            background-color: #0ea5e9;
            /* Light blue for info button */
            border-color: #0ea5e9;
            border-radius: 0.5rem;
        }

        .btn-info:hover {
            background-color: #0284c7;
            border-color: #0284c7;
        }

        .form-control {
            border-radius: 0.5rem;
            /* Rounded corners for inputs */
        }

        .img-preview {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin-top: 1rem;
        }

        .message-box {
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            text-align: center;
        }

        .message-box.success {
            background-color: #d1fae5;
            /* Green for success */
            color: #065f46;
        }

        .message-box.error {
            background-color: #fee2e2;
            /* Red for error */
            color: #991b1b;
        }

        #documentFile {
            /* Estas propiedades fuerzan la visibilidad del input de tipo file nativo */
            display: block !important;
            /* Asegura que el elemento se muestre como un bloque */
            opacity: 1 !important;
            /* Asegura que no sea transparente */
            visibility: visible !important;
            /* Asegura que sea visible */
            position: relative !important;
            /* A veces, la posición puede ocultarlo */
            z-index: 1000 !important;
            /* Lo trae al frente de otros elementos si hay superposiciones */
            width: 100% !important;
            /* Asegura que tenga un ancho */
            height: auto !important;
            /* Permite que el alto se ajuste automáticamente */
            min-height: 40px;
            /* Asegura un alto mínimo para que sea clickeable */
            cursor: pointer !important;
            /* Muestra el cursor de puntero */
        }

        .message-box.info {
            background-color: #e0f2fe;
            /* light blue */
            color: #0c4a6e;
            /* dark blue */
        }

        .falla-reportada-texto {
            color: #dc3545;
            /* Rojo de Bootstrap 'danger' */
            /* O un color naranja: */
            /* color: #FD7E14; */
            /* Naranja de Bootstrap 'warning' */
            /* O un color personalizado: */
            /* color: #C0392B; */
            /* Un rojo ladrillo */
            /* color: #E67E22; */
            /* Un naranja más suave */
            font-weight: bold;
            /* Opcional: para que resalte más */
        }

        #tabla-ticket tbody tr.table-active {
            background-color: #CCE5FF !important; /* Un gris claro para el resaltado */
            color: #333; /* Color de texto para que sea legible sobre el gris */
             border: 1px solid #ccc; 
             box-shadow: 0 0 5px rgba(0,0,0,0.2); 
        }

        #buttonEntregarCliente{
            background-color: #3b82f6;
            color: #fff;
            border-color: #3b82f6;
            border-radius: 0.5rem;
        }

        #btn-asignados {
            background-color: #17a2b8; /* Azul info */
            border-color: #17a2b8;            
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        #btn-asignados,
        #btn-por-asignar,
        #btn-recibidos,
        #btn-devuelto {
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #btn-por-asignar {
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        /* Estilo base para el botón Por Asignar cuando es el activo */
        #btn-por-asignar.btn-primary {
            background-color: #ffc107; /* Amarillo warning */
            border-color: #ffc107;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Por Asignar cuando es el activo */
        #btn-por-asignar.btn-primary:hover,
        #btn-por-asignar.btn-primary:focus {
           background-color: #ffc107; /* Amarillo warning */
            border-color: #ffc107;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
        }

        #btn-devuelto.btn-primary:hover,
        #btn-devuelto.btn-primary:focus {
            background-color: #0045b4;
            border-color: #0045b4;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
        }

        /* Estilo para el botón Por Asignar cuando NO es el activo (es gris) */
        #btn-por-asignar.btn-secondary {
            background-color: #a0a0a0;
            border-color: #a0a0a0;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Por Asignar cuando NO es el activo */
        #btn-por-asignar.btn-secondary:hover,
        #btn-por-asignar.btn-secondary:focus {
            background-color: #b0b0b0;
            border-color: #b0b0b0;
            box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
        }

        /* Estilo hover/focus para el botón Asignados cuando es el activo */
        #btn-asignados.btn-primary:hover,
        #btn-asignados.btn-primary:focus {
            background-color: #17a2b8; /* Azul info */
            border-color: #17a2b8;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
            /* Sombra de enfoque/hover */
        }

        /* Estilo para el botón Asignados cuando NO es el activo (es gris) */
        #btn-asignados.btn-secondary {
            background-color: #a0a0a0;
            /* Tu gris sutil */
            border-color: #a0a0a0;
            color: #ffffff;
            /* O un gris oscuro si el fondo es claro */
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Asignados cuando NO es el activo */
        #btn-asignados.btn-secondary:hover,
        #btn-asignados.btn-secondary:focus {
            background-color: #b0b0b0;
            border-color: #b0b0b0;
            box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
        }

        #btn-recibidos {
            background-color: #a0a0a0;
            color: #ffffff;
            border: 1px solid #a0a0a0;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

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
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
            /* Sombra de enfoque/hover */
        }

        /* Estilo para el botón Recibidos cuando NO es el activo (es gris) */
        #btn-recibidos.btn-secondary {
            background-color: #a0a0a0;
            /* Tu gris sutil */
            border-color: #a0a0a0;
            color: #ffffff;
            /* O un gris oscuro si el fondo es claro */
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        #confirmTallerBtn {
            background-color: #0045b4;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        #confirmTallerBtn:hover {
            background-color: #002884;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        #CerrarButtonTallerRecib {
            background-color: #b0b0b0;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        #CerrarButtonTallerRecib:hover {
            background-color: red;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        #btn-llaves-cargadas{
            background-color: #b0b0b0;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        /* Estilo base para el botón Recibidos cuando es el activo */
        #btn-llaves-cargadas.btn-primary {
            background-color: #27CFF5; /* Verde éxito */
            border-color: #27CFF5;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Recibidos cuando es el activo */
        #btn-llaves-cargadas.btn-primary:hover,
        #btn-llaves-cargadas.btn-primary:focus {
            background-color: #27CFF5; /* Verde éxito */
            border-color: #27CFF5;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
            /* Sombra de enfoque/hover */
        }

         /* Estilo para el botón Recibidos cuando NO es el activo (es gris) */
        #btn-llaves-cargada.btn-secondary {
            background-color: #a0a0a0;
            /* Tu gris sutil */
            border-color: #a0a0a0;
            color: #ffffff;
            /* O un gris oscuro si el fondo es claro */
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
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
    </style>
    <!-- CSS Files -->
    <link id="pagestyle" rel="stylesheet"
        href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
    <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/dashboard.css" />
</head>

<body id="fondo" class="g-sidenav-show bg-gray-100">
    <div class="min-height-300 bg-dark position-absolute w-100"></div>
    <div class="d-lg-none fixed-top bg-dark p-2">
        <button class="btn btn-dark" id="filter-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list-task"
                viewBox="0 0 16 16">
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
                                                <h5 class="text-black text-capitalize ps-3" style="color: black;">Gestión Rosal</h5>
                                            </strong>
                                        </div>
                                    </div>
                                    <div id="ticket-status-indicator-container"></div>
                                    <div class="d-flex justify-content-between">
                                        <!--h6 id = "cliente" class="mb-2">Clientes</h6-->
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table id="tabla-ticket"
                                        class="table table-striped table-bordered table-hover table-sm">
                                        </thead>
                                        <tbody id="table-ticket-body">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-5 h-100 d-flex flex-column border-start ps-4">
                    <h3 class="mb-3">Detalles del Ticket</h3>
                    <div id="ticket-details-panel" class="flex-grow-1 overflow-auto p-3 bg-light rounded">
                        <strong>
                            <p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <div class="modal fade" id="confirmInRosalModal" tabindex="-1" aria-labelledby="confirmInTallerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content custom-modal-content">
                <div class="modal-header bg-gradient-primary text-white">
                    <h5 class="modal-title " id="confirmInTallerModalLabel">Confirmación de recibido</h5>
                </div>
                <div class="modal-body custom-modal-body text-center">
                    <div class="swal2-icon-wrapper mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#ffc107" class="swal2-icon-custom-svg" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.5a.5.5 0 0 1-1.002.04l-.35-3.5C7.046 5.462 7.465 5 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                        </svg>
                    </div>
                    <p id="TextConfirmTaller" >¿Marcar el Pos con el serial <span id="serialPost" style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;"></span> asociado al Nro de ticket: <span id="modalTicketIdConfirmTaller" style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;"></span> como recibido?</p>
                    <p class="small-text" style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Esta acción registrará la fecha de recepción y habilitará los Estatus Correspondientes del Rosal.</p>
                </div>
                <div class="modal-footer custom-modal-footer d-flex justify-content-center">
                    <button type="button" class="btn custom-btn-primary" id="confirmTallerBtn">Recibir POS</button>
                    <button type="button" class="btn custom-btn-secondary" id="CerrarButtonTallerRecib" data-bs-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>
    </div>

    <!--MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->
        <div class="modal fade" id="uploadDocumentModal" tabindex="-1" aria-labelledby="uploadDocumentModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary text-white">
                        <h5 class="modal-title" id="uploadDocumentModalLabel">
                            Subir Documento para el Nro Ticket: <span id="modalTicketId" class="fw-bold"></span>
                        </h5>
                    </div>
                    <div class="modal-body">
                        <form id="uploadForm">
                            <!-- Campos ocultos -->
                            <input type="hidden" id="id_ticket">

                            <div class="mb-3">
                                <label for="documentFile" class="form-label text-gray-700 fw-semibold">
                                    Seleccionar Archivo:
                                </label>
                                
                                <!-- Wrapper con position-relative para que Bootstrap muestre los mensajes de feedback -->
                                <div class="position-relative">
                                    <input class="form-control" type="file" id="documentFile"  accept="image/jpg, image/png, image/gif, application/pdf" required>

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

                            <!-- Previsualización DESACTIVADA POR MOTIVOS DE SEGURIDAD -->
                            <!-- La previsualización ha sido desactivada para prevenir posibles inyecciones de código -->
                            <div id="imagePreviewContainer" class="text-center" style="display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; width: 0 !important; overflow: hidden !important; max-height: 0 !important; padding: 0 !important; margin: 0 !important;">
                                <img id="imagePreview" class="img-fluid rounded shadow-sm" src="#" alt="Previsualización" style="display: none !important; visibility: hidden !important; opacity: 0 !important; max-height: 0 !important; height: 0 !important; width: 0 !important;">
                            </div>
                            
                            <!-- Mensaje de validación (opcional, para mensajes adicionales) -->
                            <div id="uploadMessage" class="message-box hidden"></div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="CerrarBoton" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-warning" id="generateNotaEntregaBtn">Generar Nota de Entrega</button>
                        <button type="button" class="btn btn-primary" id="uploadFileBtn" disabled>Subir Archivo</button>
                    </div>
                </div>
            </div>
        </div>
    <!-- END MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->

    <!-- MODAL DE NOTA DE ENTREGA -->
        <div class="modal fade" id="htmlTemplateModal" tabindex="-1" aria-labelledby="htmlTemplateModalLabel" aria-hidden="true" style="background-color: rgba(0,0,0,.4); backdrop-filter: blur(8px);">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
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

    <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
        <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <strong>
                            <h5 class="modal-title text-lg font-semibold text-gray-800" id="viewDocumentModalLabel">
                                Documento para Nro Ticket: <span id="viewModalTicketId"></span></h5>
                        </strong>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label>Nombre de la imagen: <span id="NombreImage"></span></label>
                        </div>
                        <div class="mb-3 text-center" style="max-height: 80vh; overflow-y: auto;">
                            <img id="imageViewPreview" class="img-fluid" src="#" alt="Previsualización de Imagen" style="max-width: 100%; height: auto; display: none;">
                            <div id="pdfViewViewer" style="width: 100%; height: 600px; display: none; border: 1px solid #ddd;"></div>
                        </div>
                        <div id="viewDocumentMessage" class="message-box hidden text-center mt-3"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="modalCerrarshow"
                            data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
    
    <input type="hidden" id="userId" value="<?php echo $_SESSION['id_user']; ?>">

    <script async defer src="https://buttons.github.io/buttons.js"></script>

        <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.js"></script>

        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>

        <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/public/img/dashboard/js/argon-dashboard.min.js?v=2.1.0"></script>

        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>

        <script src="<?php echo APP; ?>app/plugins/chart.js/chart.js"></script>
        <script src="<?php echo APP; ?>app/plugins/chart.js/chart.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
        <script src="<?php echo APP; ?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/sb-admin-2.min.js"></script>
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
            require 'app/footer.php';
        ?>
    <!-- END PARTE DEL CODIGO DE SESSION EXPIRADAS-->
</body>
</html>