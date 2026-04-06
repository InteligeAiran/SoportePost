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

        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">

        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />

    <style>

        .highlighted-change {
            font-weight: bold;
            color: #000; /* Color de texto más oscuro para mayor contraste */
            background-color: #ffeb3b; /* Amarillo claro */
            padding: 2px 5px;
            border-radius: 3px;
        }
      
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

        #btn-asignados{
            background-color: #dc3545; /* Rojo danger */
            border-color: #dc3545;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        #btn-por-asignar{
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* CSS para los botones de Asignados/Por Asignar */
        /* Estilo base para el botón Asignados cuando es el activo */
        #btn-asignados.btn-primary {
            background-color: #dc3545; /* Rojo danger */
            border-color: #dc3545;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Asignados cuando es el activo */
        #btn-asignados.btn-primary:hover,
        #btn-asignados.btn-primary:focus {
            background-color: #dc3545; /* Rojo danger */
            border-color: #dc3545;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25); /* Sombra de enfoque/hover */
        }

        /* Estilo para el botón Asignados cuando NO es el activo (es gris) */
        #btn-asignados.btn-secondary {
            background-color: #A0A0A0; /* Tu gris sutil */
            border-color: #A0A0A0;
            color: #ffffff; /* O un gris oscuro si el fondo es claro */
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
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Por Asignar cuando es el activo */
        #btn-por-asignar.btn-primary:hover,
        #btn-por-asignar.btn-primary:focus {
            background-color: #17a2b8; /* Azul info */
            border-color: #17a2b8;
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

        #btn-asignados,
        #btn-por-asignar,
        #btn-anticipos-aprobados,
        /* #btn-recibidos, */
        #btn-devuelto {
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        /* Estilo base para el botón Anticipos Aprobados cuando es el activo */
        #btn-anticipos-aprobados.btn-primary {
            background-color: #28a745; /* Verde success */
            border-color: #28a745;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Anticipos Aprobados cuando es el activo */
        #btn-anticipos-aprobados.btn-primary:hover,
        #btn-anticipos-aprobados.btn-primary:focus {
            background-color: #28a745; /* Verde success */
            border-color: #28a745;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
        }

        /* Estilo para el botón Anticipos Aprobados cuando NO es el activo (es gris) */
        #btn-anticipos-aprobados.btn-secondary {
            background-color: #A0A0A0;
            border-color: #A0A0A0;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Estilo hover/focus para el botón Anticipos Aprobados cuando NO es el activo */
        #btn-anticipos-aprobados.btn-secondary:hover,
        #btn-anticipos-aprobados.btn-secondary:focus {
            background-color: #B0B0B0;
            border-color: #B0B0B0;
            box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
        }

        /* #btn-recibidos {
            background-color: #a0a0a0;
            color: #ffffff;
            border: 1px solid #a0a0a0;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        Estilo base para el botón Recibidos cuando es el activo
        #btn-recibidos.btn-primary {
            background-color: #28a745;
            border-color: #28a745;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        Estilo hover/focus para el botón Recibidos cuando es el activo
        #btn-recibidos.btn-primary:hover,
        #btn-recibidos.btn-primary:focus {
            background-color: #28a745;
            border-color: #28a745;
            box-shadow: 0 0 0 0.25rem rgba(0, 53, 148, 0.25);
        }

        Estilo para el botón Recibidos cuando NO es el activo (es gris)
        #btn-recibidos.btn-secondary {
            background-color: #a0a0a0;
            border-color: #a0a0a0;
            color: #ffffff;
            transition: background-color 0.3s ease, border-color 0.3s ease,
            box-shadow 0.3s ease;
        } */

        #closeImagevisualizarModalBtn:hover{
            background-color: red;
            color: white;
        }
        
        #closeImagevisualizarModalBtn{
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #btnVisualizarImagen{
            color: white;
            background-color: #003594;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #btnVisualizarImagen:hover{
            background-color: green;
            color: white;
        }

        #closeImageApprovalModalBtn{
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #closeImageApprovalModalBtn:hover{
            background-color: red;
            color: white;
        }

        #approveTicketFromImage{
            color: white;
            background-color: #003594;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #approveTicketFromImage:hover{
            background-color: green;
            color: white;
        }

        .custom-swal-backdrop {
            background-color: rgba(0, 0, 0, 0.4) !important;
            backdrop-filter: blur(8px) !important;
        }

        .custom-swal-popup {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        }

       #CartWrong {
            background-image: linear-gradient(310deg, #2b6cb0 0%, #805ad5 100%);
            padding: 1rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        #CartWrong strong {
            font-weight: bold;
        }

        .alert-heading{
            font-size: 144%;
            text-align: center;
        }

        #CerrarBoton{
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
            margin-left: 1rem;
        }

        #CerrarBoton:hover{
            background-color: red;
            color: white;
        }

        #uploadFileBtn{
            background-color: #003594;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-size: 13px;
        }

        #uploadFileBtn:hover{
            background-color: green;
            color: white;
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

        @media (max-width: 1550px) {
            .falla-reportada-texto {
                margin-top: 10%;
            }

            .falla-reportada {
                margin-left: 11%;
            }
        }

        #tabla-ticket tbody tr.table-active {
            background-color: #CCE5FF !important; /* Un gris claro para el resaltado */
            color: #333; /* Color de texto para que sea legible sobre el gris */
            border: 1px solid #ccc;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }

        #RechazoDocumento{
            color: white;
            background-color: #FF0000;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        /* Modal de Confirmación de Rechazo - Estilos Personalizados */
        #modalConfirmacionRechazo .modal-dialog {
            max-width: 500px;
            margin: 1.75rem auto;
        }

        #modalConfirmacionRechazo .modal-content {
            border: none;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        /* Header del Modal */
        #modalConfirmacionRechazo .modal-header {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 50%, #bd2130 100%);
            border-bottom: none;
            padding: 1.5rem 2rem;
            position: relative;
        }

        #modalConfirmacionRechazo .modal-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            pointer-events: none;
        }

        #modalConfirmacionRechazo .modal-title {
            color: white;
            font-weight: 600;
            font-size: 1.25rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        #modalConfirmacionRechazo .modal-title::before {
            content: '⚠️';
            font-size: 1.5rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        /* Body del Modal */
        #modalConfirmacionRechazo .modal-body {
            padding: 2rem;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        #modalConfirmacionRechazo .modal-body p {
            margin-bottom: 1rem;
            color: #495057;
            font-size: 1rem;
            line-height: 1.6;
        }

        #modalConfirmacionRechazo .modal-body p:first-child {
            font-size: 1.1rem;
            font-weight: 500;
            color: #dc3545;
            background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
            padding: 1rem;
            border-radius: 12px;
            border-left: 4px solid #dc3545;
            margin-bottom: 1.5rem;
        }

        #modalConfirmacionRechazo .modal-body p:nth-child(2) {
            color: #6c757d;
            font-style: italic;
            background: #f8f9fa;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }

        #modalConfirmacionRechazo .modal-body p:last-child {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            padding: 1rem;
            border-radius: 12px;
            border: 1px solid #90caf9;
            margin-bottom: 0;
        }

        #modalConfirmacionRechazo #motivoSeleccionadoTexto {
            color: #1976d2;
            font-weight: 600;
            background: rgba(25, 118, 210, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            border: 1px solid rgba(25, 118, 210, 0.2);
        }

        /* Footer del Modal */
        #modalConfirmacionRechazo .modal-footer {
            border-top: 1px solid #e9ecef;
            padding: 1.5rem 2rem;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            gap: 1rem;
        }

        /* Botones */
        #modalConfirmacionRechazo .btn {
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: 12px;
            border: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 0.875rem;
            min-width: 120px;
        }

        #modalConfirmacionRechazo .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
        }

        #modalConfirmacionRechazo .btn-secondary:hover {
            background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
        }

        #modalConfirmacionRechazo .btn-danger {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        }

        #modalConfirmacionRechazo .btn-danger:hover {
            background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
        }

        #modalConfirmacionRechazo .btn:active {
            transform: translateY(0);
            transition: transform 0.1s;
        }

        /* Animaciones */
        #modalConfirmacionRechazo .modal.fade .modal-dialog {
            transform: scale(0.8) translateY(-50px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #modalConfirmacionRechazo .modal.show .modal-dialog {
            transform: scale(1) translateY(0);
        }

        /* Responsive */
        @media (max-width: 576px) {
            #modalConfirmacionRechazo .modal-dialog {
                margin: 1rem;
                max-width: calc(100% - 2rem);
            }
            
            #modalConfirmacionRechazo .modal-header,
            #modalConfirmacionRechazo .modal-body,
            #modalConfirmacionRechazo .modal-footer {
                padding: 1rem;
            }
            
            #modalConfirmacionRechazo .btn {
                padding: 0.625rem 1.25rem;
                font-size: 0.8rem;
                min-width: 100px;
            }
        }

        /* Efectos de hover adicionales */
        #modalConfirmacionRechazo .modal-content:hover {
            transform: translateY(-2px);
            transition: transform 0.3s ease;
        }

        /* Scrollbar personalizado para el modal */
        #modalConfirmacionRechazo .modal-body::-webkit-scrollbar {
            width: 8px;
        }

        #modalConfirmacionRechazo .modal-body::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        #modalConfirmacionRechazo .modal-body::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            border-radius: 4px;
        }

        #modalConfirmacionRechazo .modal-body::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
        }

        #confirmarRechazoBtn{
            color: white;
            background-color: #003594;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #confirmarRechazoBtn:hover{
            color: white;
            background-color: red;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        /* ==========================================================================
           ESTILOS PREMIUM Y 3D PARA EL MODAL DE DETALLE DE PAGOS
           ========================================================================== */
        #modalPagosDetalle {
            z-index: 1000 !important;
        }

        #modalPagosDetalle .modal-content {
            border: none;
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            background: #ffffff;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        /* 3D Card Style for Information Sections */
        .info-card-3d {
            background: #ffffff;
            border-radius: 12px;
            padding: 12px 15px;
            margin-bottom: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid #e9ecef;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .info-card-3d:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0, 53, 148, 0.12), 0 6px 12px rgba(0, 0, 0, 0.08);
            border-color: #003594;
        }

        .info-card-3d::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #003594, #0056b3, #003594);
            background-size: 200% 100%;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .info-card-3d:hover::before {
            opacity: 1;
            animation: shimmerEffect 2s infinite;
        }

        @keyframes shimmerEffect {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        /* Summary Cards 3D */
        .summary-card-3d {
            border-radius: 15px;
            padding: 15px;
            color: white;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            border: none;
            cursor: default;
            height: 100%;
        }

        .summary-card-3d:hover {
            transform: perspective(1000px) rotateX(5deg) translateY(-8px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        /* Overlay effect for cards */
        .summary-card-3d .card-overlay {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
            transition: transform 0.5s ease;
            pointer-events: none;
        }

        .summary-card-3d:hover .card-overlay {
            transform: translate(10%, 10%);
        }

        #modalPagosDetalle .modal-header {
            background: linear-gradient(135deg, #001f54 0%, #003594 100%);
            padding: 1.5rem 2rem;
            border-bottom: none;
        }

        #modalPagosDetalle .modal-title {
            color: #ffffff;
            font-weight: 700;
            font-size: 1.15rem;
            letter-spacing: -0.02em;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        #modalPagosDetalle .modal-header .btn-close {
            filter: brightness(0) invert(1);
            opacity: 0.8;
            transition: all 0.2s ease;
            box-shadow: none !important;
        }

        #modalPagosDetalle .modal-header .btn-close:hover,
        #modalPagosDetalle .modal-header .btn-close:focus {
            opacity: 1;
            background-color: rgba(255, 255, 255, 0.2) !important;
            box-shadow: none !important;
            border-radius: 50%;
            transform: scale(1.1);
            outline: none;
        }

        #modalPagosDetalle .modal-body {
            padding: 2rem;
            background-color: #f8fafc;
        }

        #modalPagosDetalle .table-responsive {
            border-radius: 12px;
            overflow-x: auto;
            overflow-y: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            background: #ffffff;
        }

        #modalPagosDetalle .table {
            margin-bottom: 0;
            border-collapse: separate;
            border-spacing: 0;
        }

        #modalPagosDetalle .table thead th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
            padding: 1rem 0.75rem;
            border-bottom: 2px solid #e2e8f0;
            text-align: center;
            white-space: nowrap;
        }

        /* Anchos específicos para asegurar visibilidad */
        #modalPagosDetalle .table th:nth-child(1) { width: 25%; text-align: left; } /* Ref */
        #modalPagosDetalle .table th:nth-child(2) { width: 20%; } /* Fecha */
        #modalPagosDetalle .table th:nth-child(3) { width: 15%; text-align: right; } /* Bs */
        #modalPagosDetalle .table th:nth-child(4) { width: 15%; text-align: right; } /* Ref */
        #modalPagosDetalle .table th:nth-child(5) { width: 15%; } /* Estatus */
        #modalPagosDetalle .table th:nth-child(6) { width: 10%; } /* Acción */

        #modalPagosDetalle .table thead th:first-child { text-align: left; }
        #modalPagosDetalle .table thead th:nth-child(3), 
        #modalPagosDetalle .table thead th:nth-child(4) { text-align: right; }

        #modalPagosDetalle .table tbody td {
            padding: 1rem 0.75rem;
            font-size: 0.9rem;
            color: #1e293b;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
            transition: background-color 0.2s;
        }

        #modalPagosDetalle .table td:nth-child(1) { text-align: left; }
        #modalPagosDetalle .table td:nth-child(2) { text-align: center; color: #64748b; }
        #modalPagosDetalle .table td:nth-child(3),
        #modalPagosDetalle .table td:nth-child(4) { text-align: right; }
        #modalPagosDetalle .table td:nth-child(5),
        #modalPagosDetalle .table td:nth-child(6) { text-align: center; }

        #modalPagosDetalle .table tbody tr:last-child td {
            border-bottom: none;
        }

        #modalPagosDetalle .table tbody tr:hover td {
            background-color: #f1f7ff;
        }

        #modalPagosDetalle .modal-footer {
            padding: 1.5rem 2rem;
            border-top: 1px solid #e2e8f0;
            background-color: #ffffff;
            gap: 1rem;
            justify-content: flex-end;
        }

        /* Estado de los Badges en el modal */
        #modalPagosDetalle .badge {
            padding: 0.5rem 0.75rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.02em;
        }

        #modalPagosDetalle .bg-success {
            background-color: #dcfce7 !important;
            color: #15803d !important;
        }

        #modalPagosDetalle .bg-danger {
            background-color: #fee2e2 !important;
            color: #b91c1c !important;
        }

        #modalPagosDetalle .bg-warning {
            background-color: #fef9c3 !important;
            color: #a16207 !important;
        }

        /* Botones personalizados */
        #modalPagosDetalle .btn-secondary {
            background-color: #64748b;
            border: none;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #modalPagosDetalle .btn-secondary:hover {
            background-color: #475569;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
        }

        #modalPagosDetalle #btnFinalizarRevision {
            background: linear-gradient(135deg, #003594 0%, #0056b3 100%);
            border: none;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            box-shadow: 0 4px 14px rgba(0, 53, 148, 0.25);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        #detailMontoRestante{
            font-size: 0.9rem;
            color: black;
            font-weight: 500;
            background-color: aliceblue;
        }

        #modalPagosDetalle #btnFinalizarRevision:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 53, 148, 0.4);
            filter: brightness(1.1);
        }

        #modalPagosDetalle #btnFinalizarRevision:disabled {
            background: #e2e8f0;
            color: #94a3b8;
            box-shadow: none;
            cursor: not-allowed;
            transform: none;
        }

        /* Clase personalizada para alertas de pago (z-index superior al modal de detalles) */
        /* ID personalizado para alertas de pago (z-index máximo para superar cualquier modal) */
        #paymentAlertModal {
            z-index: 9999 !important;
        }

        #modalPagosDetalle .view-individual-payment-btn,
        #modalPagosDetalle .view-individual-payment-fallback-btn {
            border-radius: 8px;
            width: 36px;
            height: 36px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            border: 1px solid #e2e8f0;
            background: white;
            color: #64748b;
        }

        #modalPagosDetalle .view-individual-payment-btn.viewed,
        #modalPagosDetalle .view-individual-payment-fallback-btn.viewed {
            background-color: #003594;
            color: white;
            border-color: #003594;
            box-shadow: 0 4px 8px rgba(0, 53, 148, 0.2);
        }

        #modalPagosDetalle .view-individual-payment-btn:hover,
        #modalPagosDetalle .view-individual-payment-fallback-btn:hover {
            background: #f1f5f9;
            color: #003594;
            border-color: #003594;
            transform: scale(1.1);
        }
    /* ==========================================================================
       ESTILOS PARA BOTONES DE EXONERACIÓN (NUEVOS)
       ========================================================================== */
    
    /* 1. Dimensiones Compartidas (igual que los otros botones) */
    #btn-recibidos,
    #btn-aprobado_exoneracion,
    #btn-rechazado_exoneracion {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        font-size: 13px;
        color: #ffffff;
        transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    /* 2. Estado INACTIVO (Gris #A0A0A0 - Igual que los originales) */
    #btn-recibidos.btn-secondary,
    #btn-aprobado_exoneracion.btn-secondary,
    #btn-rechazado_exoneracion.btn-secondary {
        background-color: #A0A0A0;
        border-color: #A0A0A0;
        color: #ffffff;
    }

    #btn-recibidos.btn-secondary:hover,
    #btn-aprobado_exoneracion.btn-secondary:hover,
    #btn-rechazado_exoneracion.btn-secondary:hover {
        background-color: #B0B0B0;
        border-color: #B0B0B0;
        box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25);
    }

    /* 3. Estado ACTIVO (Colores Específicos) */

    /* PENDIENTE (Azul Info/Cyan - Igual que Por Asignar) */
    #btn-recibidos.btn-primary {
        background-color: #17a2b8;
        border-color: #17a2b8;
    }

    #btn-recibidos.btn-primary:hover,
    #btn-recibidos.btn-primary:focus {
        background-color: #138496;
        border-color: #117a8b;
        box-shadow: 0 0 0 0.25rem rgba(23, 162, 184, 0.25);
    }

    /* APROBADO (Morado - Nuevo estilo solicitado) */
    #btn-aprobado_exoneracion.btn-primary {
        background-color: #8E44AD; /* Wisteria */
        border-color: #8E44AD;
    }

    #btn-aprobado_exoneracion.btn-primary:hover,
    #btn-aprobado_exoneracion.btn-primary:focus {
        background-color: #9B59B6;
        border-color: #9B59B6;
        box-shadow: 0 0 0 0.25rem rgba(142, 68, 173, 0.25);
    }

    /* RECHAZADO (Rojo - Igual que Asignados/Rechazados de Anticipo) */
    #btn-rechazado_exoneracion.btn-primary {
        background-color: #dc3545;
        border-color: #dc3545;
    }

    #btn-rechazado_exoneracion.btn-primary:hover,
    #btn-rechazado_exoneracion.btn-primary:focus {
        background-color: #c82333;
        border-color: #bd2130;
        box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
    }

    /* Estilos para el sufijo de moneda dentro de los campos */
    .currency-suffix {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #6c757d;
        font-weight: 600;
        font-size: 0.85rem;
        pointer-events: none;
        z-index: 10;
        background: transparent;
    }

    .position-relative {
        position: relative;
    }

    /* Ajustar padding del input para que el texto no se superponga con el sufijo */
    #montoBs, #montoRef {
        padding-right: 40px !important;
    }

    /* Estilos para secciones del formulario con efecto 3D */
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

    /* Efecto 3D al pasar el mouse sobre las secciones */
    .form-section:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15), 
                    0 6px 12px rgba(0, 0, 0, 0.1);
        border-color: #667eea;
        background: linear-gradient(145deg, #ffffff, #f8f9fa);
    }

    /* Efecto de brillo en el borde superior al hover */
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
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    .form-section-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 12px;
        border-bottom: 2px solid #f0f0f0;
        transition: all 0.3s ease;
    }

    /* Efecto en el header cuando se pasa el mouse sobre la sección */
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

    /* Efecto en el icono al hover */
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

    /* Efecto en el título al hover */
    .form-section:hover .form-section-title {
        color: #667eea;
        transform: translateX(5px);
    }

    /* Estilos 3D para los campos individuales (columnas) */
    .form-section .col-md-6,
    .form-section .col-md-12,
    .form-section .col-md-3,
    .form-section .col-md-4 {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
    }

    /* Efecto 3D al pasar el mouse sobre un campo */
    .form-section .col-md-6:hover,
    .form-section .col-md-12:hover,
    .form-section .col-md-3:hover,
    .form-section .col-md-4:hover {
        transform: translateY(-3px) translateX(2px);
        z-index: 5;
    }

    /* Efecto en el label del campo al hover */
    .form-section .col-md-6:hover .form-label,
    .form-section .col-md-12:hover .form-label,
    .form-section .col-md-3:hover .form-label,
    .form-section .col-md-4:hover .form-label {
        color: #667eea;
        transform: translateX(3px);
        transition: all 0.2s ease;
    }

    /* Efecto en el input/select del campo al hover */
    .form-section .col-md-6:hover .form-control,
    .form-section .col-md-6:hover .form-select,
    .form-section .col-md-12:hover .form-control,
    .form-section .col-md-12:hover .form-select,
    .form-section .col-md-3:hover .form-control,
    .form-section .col-md-3:hover .form-select,
    .form-section .col-md-4:hover .form-control,
    .form-section .col-md-4:hover .form-select {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15),
                    0 2px 4px rgba(0, 0, 0, 0.1);
        transform: scale(1.02);
        transition: all 0.2s ease;
    }

    /* Efecto cuando el campo está enfocado (focus) */
    .form-section .form-control:focus,
    .form-section .form-select:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25),
                    0 4px 12px rgba(102, 126, 234, 0.15);
        transform: scale(1.02);
        transition: all 0.2s ease;
    }

    /* Efecto de resplandor en el icono del label al hover del campo */
    .form-section .col-md-6:hover .form-label i,
    .form-section .col-md-12:hover .form-label i,
    .form-section .col-md-3:hover .form-label i,
    .form-section .col-md-4:hover .form-label i {
        color: #667eea;
        transform: scale(1.15);
        filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.4));
        transition: all 0.2s ease;
    }

    /* Estilo para el contenedor de la tasa */
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
                                                    <h5 class="text-black text-capitalize ps-3" style="color: black;">Documentos Por Aprobar</h5>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                   <table id="tabla-ticket"
                                        class="table table-striped table-bordered table-hover table-sm">
                                       <thead>
                                            <tr>
                                            </tr>
                                        </thead>
                                        <tbody class="table-group-divider" id="table-ticket-body">
                                            <tr>
                                              
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
                                <input type="hidden" id="document_type">
                                <input type="hidden" id="nro_ticket">

                                <div class="mb-3">
                                    <label for="documentFile" class="form-label text-gray-700 fw-semibold">
                                        Seleccionar Archivo:
                                    </label>
                                    
                                    <!-- Wrapper con position-relative para que Bootstrap muestre los mensajes de feedback -->
                                    <div class="position-relative">
                                        <input class="form-control" type="file" id="documentFile" accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf" required>

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
                            <button type="button" class="btn btn-warning" id="generateNotaEntregaBtn">Generar Convenio Firmado</button>
                            <button type="button" class="btn btn-warning" id="generateNotaEntregaBtn2">Generar Nota de Entrega</button>
                            <button type="button" class="btn btn-primary" id="uploadFileBtn" disabled>Subir Archivo</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SUBIR EL DOCUMENTO DE ENVIO A DESTIN0-->

        <!-- MODAL DE ACUERDO DE PAGO -->
            <div class="modal fade" id="paymentAgreementModal" tabindex="-1" aria-labelledby="paymentAgreementModalLabel" aria-hidden="true" style="background-color: rgba(0,0,0,.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 55%; max-height: 95vh;">
                    <div class="modal-content" style="max-height: 95vh; display: flex; flex-direction: column;">
                        <div class="modal-header bg-gradient-primary" style="flex-shrink: 0;">
                            <h5 class="modal-title" id="paymentAgreementModalLabel">Generar Acuerdo de Pago</h5>
                        </div>
                        <div class="modal-body" style="flex: 1; overflow-y: auto; padding: 20px;">
                            <div class="row g-3">
                                <input type="hidden" id="pa_ticket_id" value="">
                                <div class="col-md-6">
                                    <label class="form-label">Fecha</label>
                                    <input type="text" id="pa_fecha" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">N° de Ticket</label>
                                    <input type="text" id="pa_numero_ticket" class="form-control" readonly>
                                </div>

                                <div class="col-12"><strong>Datos del Cliente</strong></div>
                                <div class="col-md-6">
                                    <label class="form-label">RIF/Identificación</label>
                                    <input type="text" id="pa_rif" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Razón Social</label>
                                    <input type="text" id="pa_razon_social" class="form-control" readonly>
                                </div>

                                <div class="col-12 mt-4"><strong>Antecedentes del Equipo</strong></div>
                                <div class="col-md-6">
                                    <label class="form-label">Ejecutivo de Venta</label>
                                    <input type="text" id="pa_ejecutivo_venta" class="form-control" placeholder="Ingrese el nombre del ejecutivo">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Equipo MARCA</label>
                                    <input type="text" id="pa_marca_equipo" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Serial N°</label>
                                    <input type="text" id="pa_serial" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Estatus Equipo</label>
                                    <input type="text" id="pa_status_pos" class="form-control" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Fecha de Instalación</label>
                                    <input type="text" id="pa_fecha_instalacion" class="form-control" readonly>
                                </div>
                                <div class="col-12 mt-4"><strong>Información del Acuerdo</strong></div>
                                <div class="col-md-6">
                                    <label class="form-label">Saldo deudor <small class="text-muted">(Mínimo $10.00)</small></label>
                                    <div class="input-group">
                                        <input type="text" id="pa_saldo_deudor" class="form-control" placeholder="__.__" style="text-align: right;">
                                        <span class="input-group-text">$</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Propuesta</label>
                                    <textarea id="pa_propuesta" class="form-control" rows="2" placeholder="Ingrese la propuesta de pago"></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Observaciones</label>
                                    <textarea id="pa_observaciones" class="form-control" rows="2" placeholder="Ingrese observaciones adicionales"></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Acuerdo</label>
                                    <textarea id="pa_acuerdo" class="form-control" rows="2" placeholder="Ingrese los términos del acuerdo"></textarea>
                                </div>

                                <div class="col-12 mt-4"><strong>Configuración de Datos Bancarios</strong></div>
                                <div class="col-md-6">
                                    <label class="form-label">Número de Cuenta</label>
                                    <input type="text" id="pa_numero_cuenta" class="form-control" placeholder="XXXX-XXXX-XX-XXXX" value="XXXX-XXXX-XX-XXXX">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nombre de la Empresa</label>
                                    <input type="text" id="pa_nombre_empresa" class="form-control" placeholder="Nombre de la empresa" value="Informática y Telecomunicaciones Integradas Inteligen, SA">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">RIF de la Empresa</label>
                                    <input type="text" id="pa_rif_empresa" class="form-control" placeholder="J-XXXXXXXX-X" value="J-00291615-0">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Banco</label>
                                    <input type="text" id="pa_banco" class="form-control" placeholder="Nombre del banco" value="XXXX">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Correo Electrónico</label>
                                    <input type="email" id="pa_correo" class="form-control" placeholder="correo@empresa.com" value="domiciliación.intelipunto@inteligensa.com">
                                </div>

                                <div class="col-12">
                                    <button type="button" class="btn btn-secondary" id="previewPaymentAgreementBtn">Previsualizar</button>
                                    <button type="button" class="btn btn-success" id="printPaymentAgreementBtn">Imprimir / Guardar PDF</button>
                                </div>
                                <div class="col-12" style="height: 500px; border: 2px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                                    <iframe id="paymentAgreementPreview" style="width:100%; height:100%; border:none; overflow-y: auto; overflow-x: hidden;"></iframe>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer" style="flex-shrink: 0; border-top: 1px solid #dee2e6;">
                            <button type="button" class="btn btn-secondary" id="closePaymentAgreementBtn">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL DE ACUERDO DE PAGO-->

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

        <!--MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->
            <div class="modal fade" id="visualizarImagenModal" tabindex="-1" aria-labelledby="visualizarImagenModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="visualizarImagenModalLabel">Seleccione la imagen que desea visualizar:</h5>
                    </div>
                    <div class="modal-body">
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="opcionImagen" id="imagenEnvio" value="Envio">
                        <label class="form-check-label" for="imagenEnvio" id = "labelEnvio">
                            Documento de Envío
                        </label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="opcionImagen" id="imagenExoneracion" value="Exoneracion">
                        <label class="form-check-label" for="imagenExoneracion" id = "labelExo">
                            Documento de Exoneración
                        </label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="opcionImagen" id="imagenPago" value="pago">
                        <label class="form-check-label" for="imagenPago" id="labelPago">
                            Documento de Pago
                        </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="closeImagevisualizarModalBtn">Cerrar</button>
                        <button type="button" class="btn btn-primary" id="btnVisualizarImagen">Visualizar</button>
                    </div>
                    </div>
                </div>
            </div>
        <!--END MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->

        <!-- MODAL PARA VIZUALIZAR LOS DOCUMENTOS -->
            <div class="modal fade" id="imageApprovalModal" tabindex="-1" aria-labelledby="imageApprovalModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h5 class="modal-title" id="imageApprovalModalLabel">Revisar y Aprobar Imagen</h5>
                        </div>
                        <p class="mt-3 mb-1" style="color: black; font-weight: bold; text-align: center;">Nombre Documento: <span id="currentNombreDocumento"></span></p>

                        <div class="modal-body text-center">
                            <div id="mediaViewerContainer" style="width: 100%; height: 500px; display: flex; justify-content: center; align-items: center; background-color: #f0f0f0; border: 1px solid #ddd; border-radius: 4px;">
                                <img id="ticketImagePreview" src="" alt="Vista previa del documento" class="img-fluid" style="max-width: 100%; max-height: 100%; object-fit: contain; display: none;">
                                <div id="pdfViewViewer" style="width: 100%; height: 100%; display: none;"></div>
                            </div>
                            <p class="mt-3 mb-1" style="color: black; font-weight: bold;">Nro Ticket: <span id="currentTicketIdDisplay"></span></p>
                            <p class="mt-3 mb-1" style="color: black; font-weight: bold;">Tipo de Documento: <span id="currentImageTypeDisplay"></span></p>
                            <p class="mt-3 mb-1" style="color: black; font-weight: bold;">Serial POS: <span id="currentSerialDisplay"></span></p>
                            
                            <!-- Campos de validación de pago (solo para documento de Anticipo) -->
                            <div id="paymentValidationContainer" style="display: none; margin-top: 20px; padding: 25px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; border: 2px solid #003594; box-shadow: 0 4px 15px rgba(0, 53, 148, 0.1); text-align: left;">
                                <div style="background: linear-gradient(135deg, #003594 0%, #0056b3 100%); color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                                    <h5 class="mb-0" style="color: white; font-weight: bold; margin: 0;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-shield-check me-2" viewBox="0 0 16 16" style="vertical-align: middle;">
                                            <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
                                            <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                        </svg>
                                        Validación de Datos de Pago
                                    </h5>
                                </div>
                                
                                <!-- Datos originales del pago -->
                                <div class="row mb-4">
                                    <div class="col-md-4">
                                        <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#003594" class="bi bi-hash me-1" viewBox="0 0 16 16">
                                                <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547h-.74l-.1-1.054h.73c.467 0 .684-.235.684-.547 0-.312-.217-.547-.684-.547h-.73l-.188-1.053h.74c.421 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547h-1.204l-.555-2.684c-.03-.159-.09-.242-.21-.242-.12 0-.18.083-.21.242l-.554 2.684H7.617l-.555-2.684c-.03-.159-.09-.242-.21-.242-.12 0-.18.083-.21.242l-.554 2.684H5.492c-.42 0-.617.234-.617.547 0 .312.196.547.617.547h.74l.1 1.054h-.73c-.467 0-.684.235-.684.547 0 .312.217.547.684.547h.73l.188 1.053h-.74c-.42 0-.617.234-.617.547 0 .312.196.547.617.547h1.204l.555 2.703c.03.16.09.242.21.242.12 0 .18-.083.21-.242l.554-2.703h2.242l.555 2.703c.03.16.09.242.21.242.12 0 .18-.083.21-.242l.554-2.703h1.7c.42 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547h-1.204l-.1-1.054h1.204c.42 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547h-1.204l-.188-1.053h1.204c.42 0 .617-.234.617-.547 0-.312-.196-.547-.617-.547H9.817l-.555-2.684c-.03-.159-.09-.242-.21-.242-.12 0-.18.083-.21.242l-.554 2.684H7.243l-.555-2.684c-.03-.159-.09-.242-.21-.242-.12 0-.18.083-.21.242l-.554 2.684H4.492c-.42 0-.617.234-.617.547 0 .312.196.547.617.547h.74l.1 1.054h-.73c-.467 0-.684.235-.684.547 0 .312.217.547.684.547h.73l.188 1.053h-.74c-.42 0-.617.234-.617.547 0 .312.196.547.617.547h1.204l.555 2.703c.03.16.09.242.21.242.12 0 .18-.083.21-.242l.554-2.703h2.242z"/>
                                            </svg>
                                            Nro de Referencia:
                                        </label>
                                        <input type="text" id="paymentReferenceOriginal" class="form-control" readonly style="background-color: #ffffff; border: 2px solid #dee2e6; border-radius: 8px; padding: 10px; font-weight: 500; color: #495057;">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#003594" class="bi bi-calendar3 me-1" viewBox="0 0 16 16">
                                                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/>
                                                <path d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M3 10h.01v.01H3zm9.075-3H9.5v-.01h2.575c.498 0 .905.418.905.936 0 .523-.407.936-.905.936H9.5v-.01h2.575A.905.905 0 0 0 13 7.936c0-.518-.407-.936-.905-.936M3 4h.01v.01H3z"/>
                                            </svg>
                                            Fecha de Pago:
                                        </label>
                                        <input type="text" id="paymentDateOriginal" class="form-control" readonly style="background-color: #ffffff; border: 2px solid #dee2e6; border-radius: 8px; padding: 10px; font-weight: 500; color: #495057;">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                            <i class="fas fa-money-bill-wave me-1 text-primary"></i>
                                            Monto:
                                        </label>
                                        <input type="text" id="paymentAmountOriginal" class="form-control" readonly style="background-color: #ffffff; border: 2px solid #dee2e6; border-radius: 8px; padding: 10px; font-weight: 500; color: #495057;">
                                    </div>
                                </div>
                                
                                <!-- Radio: ¿Nro de referencia correcto? -->
                                <div class="mb-4" style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #003594;">
                                    <label class="form-label mb-3" style="font-weight: 600; color: #003594; font-size: 15px; display: block;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-question-circle me-2" viewBox="0 0 16 16" style="vertical-align: middle;">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.25 5.762a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0"/>
                                        </svg>
                                        ¿Nro de referencia correcto?
                                    </label>
                                    <div class="form-check mb-2" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="referenceCorrect" id="referenceCorrectYes" value="yes" checked>
                                        <label class="form-check-label" for="referenceCorrectYes" style="font-weight: 500; color: #495057; cursor: pointer;">Sí</label>
                                    </div>
                                    <div class="form-check" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="referenceCorrect" id="referenceCorrectNo" value="no">
                                        <label class="form-check-label" for="referenceCorrectNo" style="font-weight: 500; color: #495057; cursor: pointer;">No</label>
                                    </div>
                                </div>
                                
                                <!-- Campo para corregir solo el nro de referencia -->
                                <div id="referenceCorrectionField" style="display: none;" class="mb-4">
                                    <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#28a745" class="bi bi-pencil-square me-1" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                        Nro de Referencia Correcto:
                                    </label>
                                    <input type="text" id="paymentReferenceCorrectOnly" class="form-control" placeholder="Ingrese el nro de referencia correcto" style="border: 2px solid #28a745; border-radius: 8px; padding: 10px;">
                                </div>
                                
                                <!-- Radio: ¿Fecha de pago correcta? -->
                                <div class="mb-4" style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #003594;">
                                    <label class="form-label mb-3" style="font-weight: 600; color: #003594; font-size: 15px; display: block;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-question-circle me-2" viewBox="0 0 16 16" style="vertical-align: middle;">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.25 5.762a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0"/>
                                        </svg>
                                        ¿Fecha de pago correcta?
                                    </label>
                                    <div class="form-check mb-2" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="dateCorrect" id="dateCorrectYes" value="yes" checked>
                                        <label class="form-check-label" for="dateCorrectYes" style="font-weight: 500; color: #495057; cursor: pointer;">Sí</label>
                                    </div>
                                    <div class="form-check" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="dateCorrect" id="dateCorrectNo" value="no">
                                        <label class="form-check-label" for="dateCorrectNo" style="font-weight: 500; color: #495057; cursor: pointer;">No</label>
                                    </div>
                                </div>
                                
                                <!-- Campo para corregir solo la fecha de pago -->
                                <div id="dateCorrectionField" style="display: none;" class="mb-4">
                                    <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#28a745" class="bi bi-calendar-check me-1" viewBox="0 0 16 16">
                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                        </svg>
                                        Fecha de Pago Correcta:
                                    </label>
                                    <input type="date" id="paymentDateCorrectOnly" class="form-control" style="border: 2px solid #28a745; border-radius: 8px; padding: 10px;">
                                </div>

                                <!-- Radio: ¿Monto del pago correcto? -->
                                <div class="mb-4" style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #003594;">
                                    <label class="form-label mb-3" style="font-weight: 600; color: #003594; font-size: 15px; display: block;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-question-circle me-2" viewBox="0 0 16 16" style="vertical-align: middle;">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.25 5.762a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0"/>
                                        </svg>
                                        ¿Monto de pago correcto?
                                    </label>
                                    <div class="form-check mb-2" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="amountCorrect" id="amountCorrectYes" value="yes" checked>
                                        <label class="form-check-label" for="amountCorrectYes" style="font-weight: 500; color: #495057; cursor: pointer;">Sí</label>
                                    </div>
                                    <div class="form-check" style="padding-left: 2rem;">
                                        <input class="form-check-input" type="radio" name="amountCorrect" id="amountCorrectNo" value="no">
                                        <label class="form-check-label" for="amountCorrectNo" style="font-weight: 500; color: #495057; cursor: pointer;">No</label>
                                    </div>
                                </div>

                                <!-- Campo para corregir solo el monto de pago -->
                                <div id="amountCorrectionField" style="display: none;" class="mb-3">
                                    <label class="form-label mb-2" style="font-weight: 600; color: #495057; font-size: 14px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#28a745" class="bi bi-cash-stack me-1" viewBox="0 0 16 16">
                                            <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                            <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/>
                                        </svg>
                                        Monto de Pago Correcto:
                                    </label>
                                    <input type="number" step="0.01" id="paymentAmountCorrectOnly" class="form-control" placeholder="Ingrese el monto correcto" style="border: 2px solid #28a745; border-radius: 8px; padding: 10px;">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="closeImageApprovalModalBtn" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-success" id="approveTicketFromImage">Aprobar Documento</button>
                            <button type="button" class="btn btn-danger" id="RechazoDocumento">Rechazar Documento</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL PARA VIZUALIZAR LOS DOCUMENTOS -->

         <!-- MODAL PARA SELECCIONAR EL MOTIVO DE RECHAZO -->
            <div class="modal fade" id="modalRechazo" tabindex="-1" aria-labelledby="modalRechazoLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-primary">
                            <h5 class="modal-title" id="modalRechazoLabel">Motivo de Rechazo</h5>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label for="motivoRechazoSelect" class="form-label">Selecciona el motivo del rechazo:</label>
                                    <select class="form-select" id="motivoRechazoSelect" aria-label="Motivo de Rechazo">
                                    
                                    </select>
                                </div>
                                <div class="mb-3" id="otroMotivoContainer" style="display: none;">
                                    <label for="otroMotivoInput" class="form-label">Especifica el motivo:</label>
                                    <input type="text" class="form-control" id="otroMotivoInput" placeholder = "Especifique el Motivo">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="CerrarModalMotivoRechazo">Cancelar</button>
                            <button type="button" class="btn btn-danger" id="confirmarRechazoBtn">Confirmar Rechazo</button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- END MODAL PARA SELECCIONAR EL MOTIVO DE RECHAZO -->

        <!-- CONFIRMACION MOTIVO DE RECHAZO -->
            <div class="modal fade" id="modalConfirmacionRechazo" tabindex="-1" aria-labelledby="modalConfirmacionRechazoLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="modalConfirmacionRechazoLabel">Confirmar Rechazo de Documento</h5>
                    </div>
                    <div class="modal-body">
                        <p>¿Estás seguro de que deseas <strong>rechazar</strong> el documento?</p>
                        <p>Esta acción no se puede deshacer.</p>
                        <p>Motivo seleccionado: <strong id="motivoSeleccionadoTexto"></strong></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id = "modalConfirmacionRechazoBtn">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="btnConfirmarAccionRechazo">Rechazar</button>
                    </div>
                    </div>
                </div>
            </div>
        <!--END CONFIRMACION MOTIVO DE RECHAZO -->

        <!--MODAL AGREGAR DATOS DE PAGO-->
            <div class="modal fade" id="modalAgregarDatosPago" tabindex="-1" aria-labelledby="modalAgregarDatosPagoLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 95vh; display: flex; flex-direction: column;">
                        <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0; padding: 15px 25px; flex-shrink: 0;">
                            <div class="d-flex justify-content-between align-items-center w-100">
                                <h5 class="modal-title mb-0" id="modalAgregarDatosPagoLabel" style="font-weight: 600; font-size: 1.3rem;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Agregar Datos de Pago
                                </h5>
                                <div class="d-flex align-items-center">
                                    <div class="card border-0 shadow-sm me-3" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 10px 15px; min-width: 180px;">
                                        <div class="d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar me-2" viewBox="0 0 16 16"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.051zm1.591 2.103c1.396.336 1.906.908 1.906 1.712 0 .932-.704 1.704-2.004 1.86V8.718l.1.026z"/></svg>
                                            <div>
                                                <small style="opacity: 0.9; font-size: 0.75rem; display: block;">Monto del Anticipo</small>
                                                <h5 class="mb-0 fw-bold" id="montoEquipo" style="font-size: 1.1rem;">$0.00</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Botón de Cerrar Premium (FontAwesome) -->
                                    <button type="button" class="btn border-0 p-0 text-white" id="btnCerrarModalPagoHeader" data-bs-dismiss="modal" style="font-size: 1.5rem; line-height: 1; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-body" style="padding: 20px; background: #f8f9fa; overflow-y: auto; flex: 1;">
                            <!-- Formulario -->
                            <form id="formAgregarDatosPago">
                                <input type="hidden" id="id_user_pago" name="userId" value="<?php echo isset($_SESSION['id_user']) ? $_SESSION['id_user'] : ''; ?>">
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
                                            <input type="hidden" id="nro_ticket_pago">
                                            <input type="hidden" id="document_type_pago">
                                            <input type="hidden" id="id_payment_record_loading">
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="displayEstatusPos" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-broadcast-pin me-1 text-primary" viewBox="0 0 16 16"><path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656 0a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 0 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.122a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.314.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>Estatus POS
                                            </label>
                                            <input type="text" class="form-control" id="displayEstatusPos" readonly style="background-color: #e9ecef; cursor: not-allowed; font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                        </div>
                                    </div>
                                </div>

                                <!-- Sección: Información de Pago -->
                                <div class="form-section">
                                    <div class="form-section-header">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>
                                        <h6 class="form-section-title">Información de Pago</h6>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="fechaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-calendar-event me-1 text-primary" viewBox="0 0 16 16"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>Fecha Pago <span style="color: #dc3545;">*</span>
                                            </label>
                                            <input type="date" class="form-control" id="fechaPago" placeholder="dd/mm/aaaa" required style="font-size: 0.95rem; padding: 8px 12px;" onchange="console.log('onchange - Valor del input:', this.value); if(this.value) { console.log('Llamando loadExchangeRateToday con:', this.value); loadExchangeRateToday(this.value); }" onclick="console.log('onclick - Valor del input:', this.value); if(this.value) { console.log('Llamando loadExchangeRateToday con:', this.value); loadExchangeRateToday(this.value); }">
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="formaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-credit-card me-1 text-primary" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></svg>Forma pago <span style="color: #dc3545;">*</span>
                                            </label>
                                            <select class="form-select" id="formaPago" required style="font-size: 0.95rem; padding: 8px 12px;">
                                                <option value="">Seleccione</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="moneda" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin me-1 text-primary" viewBox="0 0 16 16"><path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.606v-.706c1.318-.094 2.074-.815 2.074-1.84 0-1.027-.664-1.59-1.983-1.84l-.521-.102v-2.04c.592.063.977.371 1.056.896h.695c-.073-.914-.847-1.562-2.103-1.645V4h-.606v.681c-1.188.084-1.815.713-1.815 1.591 0 .872.613 1.408 1.612 1.622l.466.1v2.281c-.563-.064-.974-.361-1.064-.927zm2.467-3.791c-.53.116-.835.418-.835.83 0 .413.293.689.835.818v-1.648zM8.235 10.3c.595-.122.946-.439.946-.867 0-.416-.299-.7-.946-.822v1.689z"/><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/></svg>Moneda <span style="color: #dc3545;">*</span>
                                            </label>
                                            <select class="form-select" id="moneda" required style="font-size: 0.95rem; padding: 8px 12px;">
                                                <option value="">Seleccionar</option>
                                                <option value="bs">Bolívares (Bs)</option>
                                                <option value="usd">Dólares (USD)</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="estatus" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-info-circle me-1 text-primary" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>Estatus
                                            </label>
                                            <input type="text" class="form-control" id="estatus" placeholder="Estatus del pago" readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; width: 105%; margin-left: -2%;">
                                        </div>
                                    </div>
                                    <div class="row g-2" id="bancoFieldsContainer" style="display: none;">
                                        <div class="col-md-6 mb-2">
                                            <label for="bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco Origen
                                            </label>
                                            <select class="form-select" id="bancoOrigen" required style="font-size: 0.95rem; padding: 8px 12px;">
                                                <option value="">Seleccione</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-2" style="position: absolute; margin-left: 45%; margin-top: -11%;">
                                            <label for="bancoDestino" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-building me-1 text-primary" viewBox="0 0 16 16"><path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/><path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/></svg>Banco Destino
                                            </label>
                                            <select class="form-select" id="bancoDestino" required style="font-size: 0.95rem; padding: 8px 12px;">
                                                <option value="">Seleccione</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <!-- Sección: Datos de Pago Móvil -->
                                    <div id="pagoMovilFieldsContainer" style="display: none; margin-top: 15px;">
                                        <div class="row g-2">
                                            <!-- Origen -->
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-success" style="border-width: 2px;">
                                                    <div class="card-header bg-success text-white" style="padding: 8px 12px;">
                                                        <h6 class="mb-0" style="font-size: 0.95rem; font-weight: 600;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/></svg>Origen
                                                        </h6>
                                                    </div>
                                                    <div class="card-body" style="padding: 15px;">
                                                        <div class="mb-2">
                                                            <label for="origenRifTipo" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                                            </label>
                                                            <div class="d-flex gap-2">
                                                                <select class="form-select" id="origenRifTipo" required style="font-size: 0.9rem; padding: 6px 10px; width: 25%;">
                                                                    <option value="">Tipo</option>
                                                                    <option value="J">J</option>
                                                                    <option value="V">V</option>
                                                                    <option value="E">E</option>
                                                                    <option value="G">G</option>
                                                                    <option value="P">P</option>
                                                                </select>
                                                                <input type="text" class="form-control" id="origenRifNumero" placeholder="Número RIF" pattern="[0-9]*" inputmode="numeric" required style="font-size: 0.9rem; padding: 6px 10px; width: 75%;">
                                                            </div>
                                                        </div>
                                                        <div class="mb-2">
                                                            <label for="origenTelefono" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Nro. Telefónico
                                                            </label>
                                                            <input type="text" class="form-control" id="origenTelefono" placeholder="Ej: 0412-1234567" pattern="[0-9\-]*" inputmode="numeric" required style="font-size: 0.9rem; padding: 6px 10px;">
                                                        </div>
                                                        <div>
                                                            <label for="origenBanco" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco
                                                            </label>
                                                            <select class="form-select" id="origenBanco" required style="font-size: 0.9rem; padding: 6px 10px;">
                                                                <option value="">Seleccione</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Destino -->
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-primary" style="border-width: 2px;">
                                                    <div class="card-header bg-primary text-white" style="padding: 8px 12px;">
                                                        <h6 class="mb-0" style="font-size: 0.95rem; font-weight: 600;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.293L5.354 7.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.793z"/></svg>Destino
                                                        </h6>
                                                    </div>
                                                    <div class="card-body" style="padding: 15px;">
                                                        <div class="mb-2">
                                                            <label for="destinoRifTipo" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                                            </label>
                                                            <div class="d-flex gap-2">
                                                                <select class="form-select" id="destinoRifTipo" required disabled style="font-size: 0.9rem; padding: 6px 10px; width: 25%; background-color: #e9ecef; cursor: not-allowed;">
                                                                    <option value="">Tipo</option>
                                                                    <option value="J" selected>J</option>
                                                                    <option value="V">V</option>
                                                                    <option value="E">E</option>
                                                                    <option value="G">G</option>
                                                                    <option value="P">P</option>
                                                                </select>
                                                                <input type="text" class="form-control" id="destinoRifNumero" placeholder="Número RIF" pattern="[0-9]*" inputmode="numeric" required value="002916150" readonly style="font-size: 0.9rem; padding: 6px 10px; width: 75%; background-color: #e9ecef; cursor: not-allowed;">
                                                            </div>
                                                        </div>
                                                        <div class="mb-2">
                                                            <label for="destinoTelefono" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Nro. Telefónico
                                                            </label>
                                                            <input type="text" class="form-control" id="destinoTelefono" placeholder="Ej: 0412-1234567" pattern="[0-9\-]*" inputmode="numeric" required value="04122632231" readonly style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef; cursor: not-allowed;">
                                                        </div>
                                                        <div>
                                                            <label for="destinoBanco" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco
                                                            </label>
                                                            <select class="form-select" id="destinoBanco" required disabled style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef; cursor: not-allowed;">
                                                                <option value="">Seleccione</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Sección: Montos y Referencias -->
                                <div class="form-section">
                                    <div class="form-section-header d-flex justify-content-between align-items-center">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>
                                            <h6 class="form-section-title mb-0">Montos y Referencias</h6>
                                        </div>
                                        <div class="tasa-display">
                                            <div class="text-end">
                                                <span class="text-muted d-block" id="fechaTasaDisplay" style="font-size: 0.75rem; line-height: 1.2;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-calendar-day me-1" viewBox="0 0 16 16"><path d="M4.684 11.523v-2.3h2.261v-.61H4.684V6.801h2.464v-.61H4V11.523h.684Zm3.296 0h.676V8.98c0-.554.227-1.007.953-1.007.125 0 .258.004.329.015v-.613a1.806 1.806 0 0 0-.254-.02c-.582 0-.891.32-.934.71h-.027v-.672h-.643v4.131Z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>
                                                    Tasa: <?php echo date('Y-m-d'); ?> 
                                                </span>
                                                <span class="tasa-value d-block" id="tasaDisplayValue" style="font-size: 1.1rem; font-weight: 600; line-height: 1.2; margin-top: 2px;">
                                                    Cargando Tasa...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-cash me-1 text-primary" viewBox="0 0 16 16"><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Monto Bs
                                            </label>
                                            <div class="position-relative">
                                                <input type="number" class="form-control" id="montoBs" step="0.01" placeholder="0.00" disabled style="font-size: 0.95rem; padding: 8px 12px; padding-right: 40px;">
                                                <span class="currency-suffix" id="montoBsSuffix" style="display: none;">Bs</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-left-right me-1 text-primary" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>Monto REF
                                            </label>
                                            <div class="position-relative">
                                                <input type="number" class="form-control" id="montoRef" step="0.01" placeholder="0.00" disabled style="font-size: 0.95rem; padding: 8px 12px; padding-right: 40px;">
                                                <span class="currency-suffix" id="montoRefSuffix" style="display: none;">USD</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-hash me-1 text-primary" viewBox="0 0 16 16"><path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.125 0 .257-.012.387-.03.512-.073.89-.457.89-1.012 0-.579-.344-.954-.833-1.012l-.082-.007h-1.273l.33-1.587c.017-.077.025-.15.025-.225 0-.335-.224-.543-.532-.543-.298 0-.511.171-.577.502l-.339 1.853H7.833l.33-1.587c.017-.077.026-.15.026-.225 0-.335-.225-.543-.532-.543-.298 0-.512.171-.578.502l-.339 1.853H5.3l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587Z"/></svg>Referencia <span style="color: #dc3545;">*</span>
                                            </label>
                                            <input type="text" class="form-control" id="referencia" placeholder="Número de referencia" pattern="[0-9]*" inputmode="numeric" required style="font-size: 0.95rem; padding: 8px 12px;">
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-person me-1 text-primary" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>Depositante <span style="color: #dc3545;">*</span>
                                            </label>
                                            <input type="text" class="form-control" id="depositante" placeholder="Nombre del depositante" required style="font-size: 0.95rem; padding: 8px 12px;">
                                        </div>
                                    </div>
                                </div>

                                <!-- Sección: Soporte Digital -->
                                <div class="form-section">
                                    <div class="form-section-header">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cloud-upload me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.508 4.56a4.5 4.5 0 1 1-1.122 8.835l.23-.974a3.5 3.5 0 1 0-.965-6.837l-.234.027c-.046-.01-.09-.022-.132-.033-.424-.111-.83-.166-1.226-.166-1.554 0-2.83 1.054-3.15 2.454l-.234.027a3 3 0 0 0-2.43 2.502H3a1 1 0 0 0-1-1c0-.422.25-.78.614-.945a.5.5 0 1 0-.414-.91A2 2 0 0 1 3 13.5h.341l.23-.974H3a1.5 1.5 0 0 1 0-3h.341l.23-.974A3.5 3.5 0 0 1 4.406 1.342Z"/><path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/></svg>
                                        <h6 class="form-section-title">Soporte Digital</h6>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <label class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-diff me-1 text-primary" viewBox="0 0 16 16"><path d="M8 5a.5.5 0 0 1 .5.5V7H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V8H6a.5.5 0 0 1 0-1h1.5V5.5A.5.5 0 0 1 8 5m-2.5 6.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>Documento de Pago <span style="color: #dc3545;">*</span>
                                            </label>
                                            <div class="upload-container text-center" style="position: relative;">
                                                <input type="file" class="form-control" id="documentFileDetailed" name="documentFileDetailed" accept="image/jpg, image/png, image/gif, application/pdf" style="display: none;" required>
                                                <label for="documentFileDetailed" class="d-block p-4 border rounded bg-light" style="border: 2px dashed #cbd5e0 !important; cursor: pointer; transition: all 0.3s ease; width: 100%;" id="labelDocumentFileDetailed">
                                                    <div class="mb-2" id="iconDocumentFileDetailed">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-camera text-secondary" viewBox="0 0 16 16"><path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/><path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>
                                                    </div>
                                                    <span class="text-muted fw-medium d-block" id="textDocumentFileDetailed">Adjunte el Documento de Pago</span>
                                                    <span class="text-success fw-bold d-none" id="fileNameDocumentFileDetailed"></span>
                                                </label>
                                                <small class="text-muted mt-2 d-block" style="font-size: 0.8rem;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-info-circle me-1" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>Formatos permitidos: JPG, PNG, GIF o PDF (Máx. 5MB)
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Sección: Información Adicional -->
                                <div class="form-section">
                                    <div class="form-section-header">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-info-circle me-2" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
                                        <h6 class="form-section-title">Información Adicional</h6>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6 mb-2">
                                            <label for="registro" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-book me-1 text-primary" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.933-.575-2.203-.923-3.41-.811-1.144.106-2.191.46-2.823.71V2.828A5 5 0 0 1 3.5 2c.421 0 .817.027 1.168.077zM11.5 2c.656 0 1.323.058 1.958.163.633.105 1.15.257 1.484.414l.058.03v9.553c-.333-.157-.851-.31-1.484-.414A14.3 14.3 0 0 0 11.5 12c-1.207 0-2.477.106-3.41.811V3.13c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v-.441zm0-1c-1.39 0-2.72.311-3.911.812A9.2 9.2 0 0 0 4.5 1c-1.54 0-3.04.347-4.13.795A1 1 0 0 0 0 2.715v10.928a.5.5 0 0 0 .708.453c1.16-.547 2.65-.923 4.292-.821C6.273 13.376 7.5 14 8 14s1.727-.624 3.003-1.272c1.642-.102 3.132.274 4.29.821a.5.5 0 0 0 .707-.453V2.716a1 1 0 0 0-.37-.716A11.7 11.7 0 0 0 11.5 1"/></svg>Registro
                                            </label>
                                            <input type="text" class="form-control" id="registro" placeholder="Número de registro (generado automáticamente)" readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; cursor: not-allowed;">
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="fechaCarga" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-calendar-check me-1 text-primary" viewBox="0 0 16 16"><path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>Fecha carga <span style="color: #dc3545;">*</span>
                                            </label>
                                            <input type="date" class="form-control" id="fechaCarga" placeholder="dd/mm/aaaa" required readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; cursor: not-allowed;">
                                        </div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-12 mb-2">
                                            <label for="obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-sticky me-1 text-primary" viewBox="0 0 16 16"><path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H10a1.5 1.5 0 0 0-1.5 1.5v3.5H2.5a.5.5 0 0 1-.5-.5zm7 8V9.5a.5.5 0 0 1 .5-.5h3.5z"/></svg>Obs. Administración <span>*</span>
                                            </label>
                                            <textarea class="form-control" id="obsAdministracion" rows="2" placeholder="Observaciones de administración" style="font-size: 0.95rem; padding: 8px 12px; resize: vertical;"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer" style="background: #f8f9fa; border-radius: 0 0 12px 12px; padding: 15px 25px; border-top: 1px solid #dee2e6; flex-shrink: 0;">
                            <button type="button" class="btn btn-secondary px-4" id="btnCancelarModalPagoFooter" data-bs-dismiss="modal" style="font-size: 0.95rem; padding: 8px 20px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg me-2" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>Cancelar
                            </button>
                            <button type="button" class="btn btn-primary px-4" id="btnGuardarDatosPago" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; font-size: 0.95rem; padding: 8px 20px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg me-2" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.42-5.447a.733.733 0 0 1 1.047 0z"/></svg>Guardar Completo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL AGREGAR DATOS DE PAGO-->

        <!--MODAL DETALLE DE PAGOS-->
        <div class="modal fade" id="modalPagosDetalle" tabindex="-1" role="dialog" aria-labelledby="modalPagosDetalleLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalPagosDetalleLabel">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-credit-card-2-front me-2" viewBox="0 0 16 16">
                                <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"/>
                                <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                            Detalle de Pagos - Ticket <span id="paymentDetailTicketNro" class="fw-bold"></span>
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- SECCIÓN: INFORMACIÓN DEL CLIENTE Y TICKET (DISTRIBUCIÓN MEJORADA) -->
                        <div class="info-card-3d">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm" style="width: 32px; height: 32px; background: linear-gradient(135deg, #003594 0%, #001f54 100%) !important;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-person-badge" viewBox="0 0 16 16">
                                        <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                        <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2.5z"/>
                                    </svg>
                                </div>
                                <h6 class="mb-0 fw-bold text-dark" style="letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Identificación del Comercio</h6>
                            </div>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="p-2 rounded-3 bg-light border-start border-4 border-primary shadow-sm h-100 transition-hover">
                                        <label class="small text-muted text-uppercase fw-bold mb-0 d-block" style="font-size: 0.70rem; letter-spacing: 0.5px;">Razón Social</label>
                                        <div id="detailRazonSocial" class="fw-bold text-dark" style="font-size: 0.76rem; line-height: 1.2;">-</div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="p-2 rounded-3 bg-light border-start border-4 border-info shadow-sm h-100 transition-hover">
                                        <label class="small text-muted text-uppercase fw-bold mb-0 d-block" style="font-size: 0.72rem; letter-spacing: 0.5px;">RIF / CI</label>
                                        <div id="detailRif" class="fw-bold text-dark" style="font-size: 0.76rem;">-</div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="p-2 rounded-3 bg-light border-start border-4 border-success shadow-sm h-100 transition-hover">
                                        <label class="small text-muted text-uppercase fw-bold mb-0 d-block" style="font-size: 0.72rem; letter-spacing: 0.5px;">Serial POS</label>
                                        <div id="detailSerialPos" class="fw-bold text-dark" style="font-size: 0.76rem;">-</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SECCIÓN: RESUMEN FINANCIERO (DISTRIBUCIÓN MÁS COMPACTA) -->
                        <div class="row g-3 mb-4 justify-content-center">
                            <div class="col-md-5">
                                <div class="summary-card-3d shadow" style="background: linear-gradient(135deg, #1d976c 0%, #93f9b9 100%);">
                                    <div class="card-overlay"></div>
                                    <div class="position-relative">
                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                            <div class="text-uppercase small fw-bold" style="opacity: 0.9; letter-spacing: 1px; font-size: 0.7rem;">Presupuesto Total</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet2" viewBox="0 0 16 16" style="opacity: 0.6;">
                                                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
                                            </svg>
                                        </div>
                                        <h2 id="detailMontoPresupuesto" class="mb-0 fw-bold" style="font-size: 1.3rem;">$0.00</h2>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="summary-card-3d shadow" style="background: linear-gradient(135deg, #003594 0%, #00b4db 100%);">
                                    <div class="card-overlay"></div>
                                    <div class="position-relative">
                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                            <div class="text-uppercase small fw-bold" style="opacity: 0.9; letter-spacing: 1px; font-size: 0.7rem;">Monto Abonado</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-stack" viewBox="0 0 16 16" style="opacity: 0.6;">
                                                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                                                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/>
                                            </svg>
                                        </div>
                                        <div class="d-flex align-items-baseline gap-2">
                                            <h2 id="detailMontoAbonado" class="mb-0 fw-bold" style="font-size: 1.3rem;">$0.00</h2>
                                            <span id="detailMontoRestante" class="badge rounded-pill text-primary fw-bold px-2 py-1" style="font-size: 0.6rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">Restante: $0.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table" id="tablePagosDetalle">
                                <thead>
                                    <tr>
                                        <th>Ref.</th>
                                        <th>Fecha</th>
                                        <th>Monto (Bs)</th>
                                        <th>Monto (Ref.)</th>
                                        <th>Estatus</th>
                                        <th>Vizualizar Imagen</th>
                                    </tr>
                                </thead>
                                <tbody id="bodyPagosDetalle">
                                    <!-- Se poblará dinámicamente -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg me-1" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>Cerrar
                        </button>
                        <button type="button" id="btnFinalizarRevision" class="btn btn-primary" disabled>
                            <i class="fas fa-check-double me-1"></i> Finalizar Revisión
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!--END MODAL DETALLE DE PAGOS-->

        <input type="hidden" id="userId" value="<?php echo $_SESSION['id_user']; ?>">
    <input type="hidden" id="id_area" value="<?php echo $_SESSION['id_area'] ?? ''; ?>">
    <input type="hidden" id="id_rol" value="<?php echo $_SESSION['id_rol'] ?? ''; ?>">
    <input type="hidden" id="payment_id_to_save" value="">

        
        <script async defer src="https://buttons.github.io/buttons.js"></script>

        <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.min.js"></script>
         <script src="<?php echo APP; ?>app/plugins/NewDataTable/datatables.js"></script>

        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>
        <script src="<?php echo APP; ?>app/core/components/ticket/js/ticket-utils.js"></script>

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
                    $version = time();
                    echo '<script type="text/javascript" src="' . APP . 'app/views/' . $js . '?v=' . $version . '"></script>';
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