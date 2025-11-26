<?php
function mi_navbar() {}
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

        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />

        <!-- Font Awesome Icons -->
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
                width: 27%;
            }

            /* Estilizar el label "Buscar:" */
            div.dataTables_wrapper div.dataTables_filter label {
                font-weight: bold;
                color: #333;
                margin-right: 0.5em;
            }

            .input-sm {
                width: 67%;
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
                width: 40%;
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
                background-color: #002869;
                /* A visually darker blue */
            }

            #saveStatusChangeBtn {
                background-color: #003594;
                color: #fff;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease-in-out;
            }

            #saveStatusChangeBtn:hover {
                background-color: green;
            }

            #CerrarBoton {
                background-color: #8392ab;
                color: #fff;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease-in-out;
            }

            #CerrarBoton:hover {
                background-color: red;
            }

            #icon-close {
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

            /* Contenedor de paginación de DataTables */
            .dataTables_wrapper .dataTables_paginate.paging_simple_numbers {
                /* Puedes ajustar márgenes o padding aquí si es necesario */
                margin-top: 15px;
                /* Espacio superior para separar de la tabla */
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

            /* Si los "..." tienen una clase específica como 'ellipsis', puedes añadirla aquí,
        pero generalmente .disabled los cubre si están dentro de un li.paginate_button. */
            /* .dataTables_wrapper .dataTables_paginate ul.pagination li.ellipsis {
            background-color: #f8f8f8;
            color: #999999;
            border: 1px solid #e0e0e0;
            cursor: default;
        } */

            #table-ticket-body table td,
            table th {
                white-space: normal !important;
            }



            /* Estilo al pasar el puntero (hover) sobre los elementos de paginación NO activos y NO deshabilitados */
            .dataTables_wrapper .dataTables_paginate ul.pagination li.paginate_button:hover:not(.active):not(.disabled) {
                background-color: #fff;
                /* Un gris ligeramente más oscuro al pasar el puntero (sutil) */
                color: #003594;
                /* Azul suave para el texto al hacer hover, o puedes mantener el gris oscuro si prefieres menos cambio */
                border-color: white;
                /* Borde un poco más visible al hacer hover */
            }

            .falla-reportada-texto {
                color: #DC3545;
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

            #CheckConfirmTaller {
                background-color: green;
                color: white;
            }

            #CheckConfirmTaller:hover {
                background-color: darkgreen;
                /* Un verde más oscuro al pasar el ratón */
                /* Si también quieres que el texto cambie de color, podrías añadir: */
                /* color: lightgray; */
            }

            #confirmInTallerModal {
                background-color: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(8px);
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

            .BtnConfirmacion {
                background-color: #0045b4 !important;
                /* Add !important */
                color: white !important;
                /* Add !important */
                border: none !important;
                /* Add !important if you want to ensure no border */
                cursor: pointer !important;
                padding: 10px 20px !important;
                font-size: 16px !important;
                border-radius: 5px !important;
                transition: background-color 0.3s ease !important;
            }

            /* Optional: Add hover state for better UX */
            .BtnConfirmacion:hover {
                background-color: #003388 !important;
                /* Darker shade on hover */
            }

            #changeStatusModalLabel {
                color: #ffffff;
            }

            #rescheduleModalLabel {
                color: white;
            }

            .my-custom-select-modal .swal2-select {
                /* Aquí aplica tus estilos al select */
                border: 2px solid #002869;
                padding: 8px;
                font-size: 16px;
                width: 90%; /* O el ancho que desees */
                box-sizing: border-box; /* Para incluir padding y border en el ancho */
                /* Otros estilos que quieras */
            }

            #saveRescheduleDate{
                background-color: #002869;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            #ButtonSendDate{
                border: 2px solid  #002869; 
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            #ButtonGuardarFecha{
                 background-color: #002869;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
                color: white;
            }

            #ButtonGuardarFecha:hover{
                background-color: #0045b4;
                color: white;
            }

            #ButtonCancelarFecha{
                background-color: #b0b0b0;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
                color: white;
            }

            #CancelarFecha:hover{
                background-color: red;
                color: white;
            }

            .swal2-container.swal2-center {
                background-color: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(8px);
            }

            .custom-status-button {
                /* Un azul claro similar al de la imagen */
                background-color: #B5EAD7; 
                color: #333333; /* Texto oscuro */
                border: 1px solid #99D98C; /* Borde más claro */
                padding: 10px 20px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
                display: inline-block;
                transition: background-color 0.2s, box-shadow 0.2s;
            }

           .custom-status-button:hover {
                background-color: #A3D8C8;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                color: black;
            }     

            .btn-renovar {
                /* Color de fondo azul/púrpura similar al de la imagen */
                background-color: #7B68EE; /* Puedes ajustar este color */
                color: white;
                border: none; 
            }

            .btn-renovar:hover {
                background-color: #6A5ACD !important; /* Un tono un poco más oscuro */
            }


            /* Estilo para "Enviar a Gestión Comercial" (denyButton) */
           .btn-gestion-comercial {
                background-color: #E63946 !important;
                color: white !important; /* Texto blanco */
                border: none;
            }

            .btn-gestion-comercial:hover {
                background-color: #CC2936 !important; 
            }

            .swal2-styled.swal2-confirm, 
            .swal2-styled.swal2-deny {
                /* Aseguramos que los botones de SweetAlert2 mantengan un padding y margen consistente */
                padding: 0.6em 1.2em; 
                margin: 0.3125em;
                /* !important se usa para asegurar que estos estilos anulen los estilos por defecto de SweetAlert2 si es necesario */
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

            #btn-reasignado.btn-primary {
            color: #ffffff;
                background-color: #0045b4;
                /* Un tono un poco más oscuro o claro al hover */
                border-color: #0045b4;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            #btn-reasignado.btn-primary:hover,
            #btn-reasignado.btn-primary:focus {
                color: #ffffff;
                background-color: #0045b4;
                /* Un tono un poco más oscuro o claro al hover */
                border-color: #0045b4;
                box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
                /* Sombra de enfoque/hover */
            }

            #btn-reasignado.btn-secondary:hover,
            #btn-reasignado.btn-secondary:focus {
                color: white;
                background-color: #b0b0b0;
                border-color: #b0b0b0;
                box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
            }

            #btn-reasignado.btn-secondary {
                color: white;
                background-color: #b0b0b0;
                border-color: #b0b0b0;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            /* Estilo hover/focus para el botón Recibidos cuando NO es el activo */
            #btn-recibidos.btn-secondary:hover,
            #btn-recibidos.btn-secondary:focus {
                background-color: #b0b0b0;
                border-color: #b0b0b0;
                box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
            }

            #btn-asignados {
                background-color: #17a2b8; /* Azul info */
                border-color: #17a2b8;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            #btn-por-asignar {
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            /* CSS para los botones de Asignados/Por Asignar */
            /* Estilo base para el botón Asignados cuando es el activo */
            #btn-asignados.btn-primary {
                background-color: #17a2b8; /* Azul info */
                border-color: #17a2b8;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
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

            #btn-asignados,
            #btn-por-asignar,
            #btn-recibidos,
            #btn-devuelto {
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                font-size: 13px;
            }

            #btn-recibidos {
                background-color: #a0a0a0;
                color: #ffffff;
                border: 1px solid #a0a0a0;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            #btn-devuelto {
                background-color: #a0a0a0;
                color: #ffffff;
                border: 1px solid #a0a0a0;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }

            #btn-devuelto.btn-primary {
                background-color: #003594;
                /* Tu azul fuerte */
                border-color: #003594;
                color: #ffffff;
                transition: background-color 0.3s ease, border-color 0.3s ease,
                box-shadow 0.3s ease;
            }


            #btn-devuelto.btn-secondary:hover,
            #btn-devuelto.btn-secondary:focus {
                background-color: #b0b0b0;
                border-color: #b0b0b0;
                box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
            }

            #btn-devuelto.btn-primary:hover,
            #btn-devuelto.btn-primary:focus {
                background-color: #0045b4;
                border-color: #0045b4;
                box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
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

            #CancelarFecha{
                background-color: #b0b0b0;
                transition: background-color 0.3s ease;
            }

            #modalTicketIdConfirmTaller{
                display: inline-block; 
                padding: 0.2rem 0.5rem;
                border-radius: 0.3rem;
                background-color: #e0f7fa;
                color: #007bff;
            }

            #TextConfirmTaller{
                color: #343a40;
                font-size: 23px;
                font-weight: 600;
                margin-bottom: 10px;
            }

            .highlighted-change {
                font-weight: bold;
                color: #000; /* Color de texto más oscuro para mayor contraste */
                background-color: #ffeb3b; /* Amarillo claro */
                padding: 2px 5px;
                border-radius: 3px;
            }

            
            #tabla-ticket tbody tr.table-active {
                background-color: #CCE5FF !important; /* Un gris claro para el resaltado */
                color: #333; /* Color de texto para que sea legible sobre el gris */
                border: 1px solid #ccc;
                box-shadow: 0 0 5px rgba(0,0,0,0.2);
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
            <div class="container-fluid py-4" style="height: calc(100vh - 80px);">
                <div class="row h-100">
                    <div class="col-md-7 h-100 d-flex flex-column">
                        <div id="Row" class="row mt-4">
                            <div class="cord">
                                <div class="card">
                                    <div class="card-header pb-0 p-3">
                                        <div class="col-lg-12 col-md-12 mt-4 mb-4">
                                            <div class="card card-body bg-gradient-blue shadow-primary border-radius-lg pt-4 pb-3">
                                                <strong>
                                                    <h5 class="text-black text-capitalize ps-3" style="color: black;">Equipos en Taller</h5>
                                                </strong>
                                            </div>
                                        </div>
                                        <div id="ticket-status-indicator-container"></div>
                                        <div class="d-flex justify-content-between">
                                            <!--h6 id = "cliente" class="mb-2">Clientes</h6-->
                                        </div>
                                    </div>
                                    <table id="tabla-ticket" class="table table-striped table-bordered table-hover table-sm">
                                        <tbody id="table-ticket-body"></tbody>
                                    </table>
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

        <div
            class="modal fade"
            id="renewalModal"
            tabindex="-1"
            aria-labelledby="renewalModalLabel"
            aria-hidden="true"
            style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
           
        </div>
        
        <!--MODAL PARA SELECCIONAR EL STATUS DEL TALLER DEL TICKET-->
            <div class="modal fade" id="changeStatusModal" tabindex="-1" aria-labelledby="changeStatusModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h5 class="modal-title" id="changeStatusModalLabel">Cambiar Estatus del Ticket</h5>
                        </div>
                        <div class="modal-body">
                            <form id="changeStatusForm">
                                <input type="hidden" id="modalTicketId">
                                <div class="mb-3">
                                    <label for="modalCurrentStatus" class="form-label">Estatus Actual:</label>
                                    <input type="text" class="form-control" id="modalCurrentStatus" disabled>
                                </div><br>
                                <div class="mb-3">
                                    <label for="modalNewStatus" class="form-label">Nuevo Estatus:</label>
                                    <select class="form-select" id="modalNewStatus" aria-label="Default select example" required>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="CerrarBoton" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="saveStatusChangeBtn">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL PARA SELECCIONAR EL STATUS DEL TALLER DEL TICKET-->
        
        <!--MODAL PARA SELECCIONAR LA FECHA ESTIMADA DE LLEGADA DEL REPUESTO-->
            <div class="modal fade" id="rescheduleModal" tabindex="-1" aria-labelledby="rescheduleModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary text-white">
                            <h5 class="modal-title" id="rescheduleModalLabel">Fecha Estimada de Llegada de Repuesto</h5>
                        </div>
                        <div class="modal-body">
                            <form id="rescheduleForm">
                                <div class="mb-3">
                                    <label for="rescheduleDate" class="form-label">Selecciona la Fecha:</label>
                                    <input type="date" class="form-control" id="rescheduleDate" required />
                                </div>
                                <p class="text-danger" id="dateError" style="display: none;">
                                    La fecha no puede exceder 3 meses a partir del mes actual.
                                </p>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="CancelarFecha" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="saveRescheduleDate">Guardar Fecha</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL PARA SELECCIONAR LA FECHA ESTIMADA DE LLEGADA DEL REPUESTO-->

        <div class="modal fade" id="confirmInTallerModal" tabindex="-1" aria-labelledby="confirmInTallerModalLabel" aria-hidden="true">
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
                        <p id="TextConfirmTaller" >¿Marcar el Pos con el serial <span  class="h4 mb-3" id="serialPost" style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;"></span> asociado al Nro de ticket: <span id="modalTicketIdConfirmTaller"  class="h4 mb-3" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;"></span> como recibido?</p>
                        <p class="small-text" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Esta acción registrará la fecha de recepción y habilitará los Estatus Correspondientes del Taller.</p>
                    </div>
                    <div class="modal-footer custom-modal-footer d-flex justify-content-center">
                        <button type="button" class="btn custom-btn-primary" id="confirmTallerBtn">Recibir POS</button>
                        <button type="button" class="btn custom-btn-secondary" id="CerrarButtonTallerRecib" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="confirmInTallerModal" tabindex="-1" aria-labelledby="confirmInTallerModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmInTallerModalLabel">Confirmar Estado del Ticket</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ¿Seguro que este ticket está en taller?
                        <input type="hidden" id="modalTicketIdConfirmTaller">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="confirmTallerBtn">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="confirmInTallerModal" tabindex="-1" aria-labelledby="confirmInTallerModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmInTallerModalLabel">Confirmar Estado del Ticket</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ¿Seguro que este ticket está en taller?
                        <input type="hidden" id="modalTicketIdConfirmTaller">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="confirmTallerBtn">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>

        <!--END MODAL PARA SELECCIONAR EL STATUS DEL TALLER DEL TICKET-->
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