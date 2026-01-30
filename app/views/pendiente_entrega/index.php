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
        /* Estilos empresariales para el SweetAlert de Anticipo */
        .swal2-popup-custom-anticipo {
            border-radius: 8px !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
            padding: 0 !important;
            border: none !important;
            background: #ffffff !important;
            overflow: hidden !important;
            animation: modalEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        
        @keyframes modalEnter {
            0% {
                opacity: 0;
                transform: scale(0.8) translateY(-20px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .swal2-title-custom-anticipo {
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            color: #1a1a1a !important;
            margin-bottom: 1.5rem !important;
            padding: 0 !important;
            letter-spacing: -0.02em !important;
        }
        
        .swal2-html-container-custom-anticipo {
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
        }
        
        .swal2-confirm-custom-anticipo {
            background-color: #0d6efd !important;
            border-color: #0d6efd !important;
            border-radius: 6px !important;
            padding: 0.625rem 1.5rem !important;
            font-size: 0.9375rem !important;
            font-weight: 500 !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 2px 4px rgba(13, 110, 253, 0.25) !important;
            text-transform: none !important;
            position: relative !important;
            overflow: hidden !important;
        }
        
        .swal2-confirm-custom-anticipo::before {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            width: 0 !important;
            height: 0 !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translate(-50%, -50%) !important;
            transition: width 0.6s, height 0.6s !important;
        }
        
        .swal2-confirm-custom-anticipo:hover {
            background-color: #0b5ed7 !important;
            border-color: #0a58ca !important;
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow: 0 6px 16px rgba(13, 110, 253, 0.4) !important;
        }
        
        .swal2-confirm-custom-anticipo:hover::before {
            width: 300px !important;
            height: 300px !important;
        }
        
        .swal2-confirm-custom-anticipo:active {
            transform: translateY(0) scale(0.98) !important;
            box-shadow: 0 2px 4px rgba(13, 110, 253, 0.25) !important;
        }
        
        .swal2-confirm-custom-anticipo:focus {
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
        }
        
        .swal2-cancel-custom-anticipo {
            background-color: #6c757d !important;
            border-color: #6c757d !important;
            border-radius: 6px !important;
            padding: 0.625rem 1.5rem !important;
            font-size: 0.9375rem !important;
            font-weight: 500 !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2) !important;
            text-transform: none !important;
            position: relative !important;
            overflow: hidden !important;
        }
        
        .swal2-cancel-custom-anticipo::before {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            width: 0 !important;
            height: 0 !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.2) !important;
            transform: translate(-50%, -50%) !important;
            transition: width 0.6s, height 0.6s !important;
        }
        
        .swal2-cancel-custom-anticipo:hover {
            background-color: #5c636a !important;
            border-color: #565e64 !important;
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow: 0 6px 16px rgba(108, 117, 125, 0.35) !important;
        }
        
        .swal2-cancel-custom-anticipo:hover::before {
            width: 300px !important;
            height: 300px !important;
        }
        
        .swal2-cancel-custom-anticipo:active {
            transform: translateY(0) scale(0.98) !important;
            box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2) !important;
        }
        
        .swal2-cancel-custom-anticipo:focus {
            box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.25) !important;
        }
        
        .swal2-actions-custom-anticipo {
            gap: 1.25rem !important;
            margin-top: 2.5rem !important;
            padding-top: 1.5rem !important;
            border-top: 1px solid #e9ecef !important;
            justify-content: center !important;
            flex-wrap: nowrap !important;
        }
        
        .swal2-actions-custom-anticipo button {
            margin: 0 !important;
            min-width: 140px !important;
        }
        
        .swal2-actions-custom-anticipo .swal2-cancel {
            margin-right: 0.75rem !important;
        }
        
        .swal2-actions-custom-anticipo .swal2-confirm {
            margin-left: 0.75rem !important;
        }
        
        /* Estilos para el modal de pago */
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
        }

        /* Estilos 3D para inputs del modal de presupuesto */
        #presupuestoModal .form-control {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
            backface-visibility: hidden;
            background: #ffffff;
            border: 1px solid #667eea;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(102, 126, 234, 0.15);
            color: #6c757d;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            text-overflow: clip;
        }

        #presupuestoModal .form-control[readonly] {
            cursor: default;
        }

        #presupuestoModal .form-control:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
            border-color: #764ba2;
            background: linear-gradient(135deg, #f0f4ff 0%, #e8edff 100%) !important;
            color: #333;
        }
        
        /* Estilos para campos de diferencia con colores (verde/rojo) - sin hover */
        #presupuestoModal .form-control.bg-success:hover,
        #presupuestoModal .form-control.bg-danger:hover {
            transform: none !important;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
            border-color: transparent !important;
        }
        
        #presupuestoModal .form-control.bg-success:hover {
            background-color: #198754 !important;
            background: #198754 !important;
            color: #ffffff !important;
        }
        
        #presupuestoModal .form-control.bg-danger:hover {
            background-color: #dc3545 !important;
            background: #dc3545 !important;
            color: #ffffff !important;
        }

        #presupuestoModal .form-control:focus {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.25);
            border-color: #764ba2;
            background: linear-gradient(135deg, #e8edff 0%, #dde4ff 100%) !important;
            color: #333;
            outline: none;
        }

        #presupuestoModal .form-control:focus:hover {
            background: linear-gradient(135deg, #e8edff 0%, #dde4ff 100%) !important;
        }

        /* Estilos 3D para cards de datos de empresa y cliente */
        #presupuestoModal .presupuesto-card-empresa,
        #presupuestoModal .presupuesto-card-cliente {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
            backface-visibility: hidden;
        }

        #presupuestoModal .presupuesto-card-empresa:hover {
            transform: translateY(-5px) translateZ(20px) rotateX(2deg);
            box-shadow: 0 15px 35px rgba(230, 81, 0, 0.3),
                        0 8px 16px rgba(255, 152, 0, 0.25),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6),
                        0 0 20px rgba(255, 193, 7, 0.2);
            background: linear-gradient(135deg, #fff3cd 0%, #ffe082 100%) !important;
        }

        #presupuestoModal .presupuesto-card-cliente:hover {
            transform: translateY(-5px) translateZ(20px) rotateX(2deg);
            box-shadow: 0 15px 35px rgba(56, 142, 60, 0.3),
                        0 8px 16px rgba(76, 175, 80, 0.25),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6),
                        0 0 20px rgba(129, 199, 132, 0.2);
            background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%) !important;
        }

        /* Estilos 3D para card de datos del pago */
        #presupuestoModal .presupuesto-card-pago {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
            backface-visibility: hidden;
        }

        #presupuestoModal .presupuesto-card-pago:hover {
            transform: translateY(-5px) translateZ(20px) rotateX(2deg);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3),
                        0 8px 16px rgba(118, 75, 162, 0.25),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6),
                        0 0 20px rgba(102, 126, 234, 0.2);
            background: linear-gradient(135deg, #c5cae9 0%, #9fa8da 100%) !important;
        }

        /* Estilos 3D para card de cálculo del presupuesto */
        #presupuestoModal .presupuesto-card-calculo {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
            backface-visibility: hidden;
        }

        #presupuestoModal .presupuesto-card-calculo:hover {
            transform: translateY(-5px) translateZ(20px) rotateX(2deg);
            box-shadow: 0 15px 35px rgba(56, 142, 60, 0.3),
                        0 8px 16px rgba(76, 175, 80, 0.25),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6),
                        0 0 20px rgba(129, 199, 132, 0.2);
            background: linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%) !important;
        }

        /* Estilos 3D para card de información del presupuesto */
        #presupuestoModal .presupuesto-card-info {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
            backface-visibility: hidden;
        }

        #presupuestoModal .presupuesto-card-info:hover {
            transform: translateY(-5px) translateZ(20px) rotateX(2deg);
            box-shadow: 0 15px 35px rgba(2, 136, 209, 0.3),
                        0 8px 16px rgba(3, 169, 244, 0.25),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6),
                        0 0 20px rgba(100, 181, 246, 0.2);
            background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%) !important;
        }

        /* Efecto de profundidad adicional en los inputs dentro de los cards */
        #presupuestoModal .card:hover .form-control {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
            border-color: #764ba2;
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

        /* Ocultar "Formato permitido: PDF" cuando el input tiene validación */
        #presupuestoPDFFileContainer:has(#presupuestoPDFFile.is-valid) .presupuesto-pdf-format-info,
        #presupuestoPDFFileContainer:has(#presupuestoPDFFile.is-invalid) .presupuesto-pdf-format-info {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
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

        /* Estilos para el botón de presupuesto */
        .generate-presupuesto-btn {
            position: relative;
        }

        .generate-presupuesto-btn .presupuesto-text {
            opacity: 0;
            transition: opacity 0.3s ease, margin-left 0.3s ease;
            max-width: 0;
            overflow: hidden;
        }

        .generate-presupuesto-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 188, 212, 0.4) !important;
        }

        .generate-presupuesto-btn:hover .presupuesto-text {
            display: inline-block !important;
            opacity: 1;
            margin-left: 8px;
            max-width: 200px;
        }

        .generate-presupuesto-btn:hover svg {
            transition: transform 0.3s ease;
        }

        .generate-presupuesto-btn:hover svg {
            transform: scale(1.1);
        }
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
        <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); z-index: 1060;">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <strong>
                            <h5 class="modal-title text-lg font-semibold text-gray-800" id="viewDocumentModalLabel">
                                Documento para Nro Ticket: <span id="viewModalTicketId"></span></h5>
                        </strong>
                    </div>
                    <div class="modal-body">
                        <!-- Área de visualización del documento -->
                        <div id="documentViewArea">
                            <div class="text-center" style="max-height: 80vh; overflow-y: auto;">
                                <!-- El contenido se inyectará dinámicamente aquí -->
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="btnCerrarViewModal" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

    <!--MODAL PARA GENERAR PRESUPUESTO-->
        <div class="modal fade" id="presupuestoModal" tabindex="-1" aria-labelledby="presupuestoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" id="ModalPresupuesto">
                <div class="modal-content shadow-lg border-0" style="border-radius: 15px; overflow: hidden;">
                    <div class="modal-header text-white" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; padding: 1.5rem;">
                        <div class="d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-file-earmark-text me-2" viewBox="0 0 16 16">
                                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5"/>
                            </svg>
                            <h5 class="modal-title mb-0 fw-bold" id="presupuestoModalLabel" style="font-size: 1.3rem;">
                                Generar Presupuesto - Ticket: <span id="presupuestoNroTicket" class="fw-bold"></span>
                            </h5>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" style="opacity: 0.9;"></button>
                    </div>
                    <div class="modal-body p-4" style="background-color: #f8f9fa;">
                        <div class="row g-4">
                            <!-- Datos de la Empresa y Cliente en dos columnas -->
                            <div class="col-12">
                                <div class="row g-3 mb-3">
                                    <!-- Datos de la Empresa -->
                                    <div class="col-md-6">
                                        <div class="card border-0 shadow-sm presupuesto-card-empresa" style="border-radius: 12px; background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);">
                                            <div class="card-body p-3">
                                                <div class="d-flex align-items-center mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#e65100" class="bi bi-building me-2" viewBox="0 0 16 16">
                                                        <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
                                                        <path fill-rule="evenodd" d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h2z"/>
                                                    </svg>
                                                    <h6 class="mb-0 fw-bold" style="font-size: 1.1rem; color: #e65100;">Datos de la Empresa</h6>
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">Nombre:</label>
                                                    <input type="text" value="INTELIGENSA" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">Dirección:</label>
                                                    <input type="text" value="Urbanización El Rosal. Av. Francisco de Miranda, Edif. Centro Sudamérica PH-A Caracas. Edo. Miranda" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">Teléfono:</label>
                                                    <input type="text" value="0212-9541004, 0212-9541013" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">E-mail:</label>
                                                    <input type="text" value="carlos.rodriguez@intelipunto.com" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                                <div>
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">RIF:</label>
                                                    <input type="text" value="J-00291615-0" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Datos del Cliente -->
                                    <div class="col-md-6">
                                        <div class="card border-0 shadow-sm presupuesto-card-cliente" style="border-radius: 12px; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);">
                                            <div class="card-body p-3">
                                                <div class="d-flex align-items-center mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#388e3c" class="bi bi-person-badge me-2" viewBox="0 0 16 16">
                                                        <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM11 3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM5 4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>
                                                        <path d="M8 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M4 7.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0"/>
                                                    </svg>
                                                    <h6 class="mb-0 fw-bold" style="font-size: 1.1rem; color: #388e3c;">Datos del Cliente</h6>
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">Comercio:</label>
                                                    <input type="text" id="presupuestoClienteRazon" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">Dirección:</label>
                                                    <input type="text" id="presupuestoClienteDireccion" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">Teléfono:</label>
                                                    <input type="text" id="presupuestoClienteTelefono" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                                <div class="mb-2">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">E-mail:</label>
                                                    <input type="text" id="presupuestoClienteEmail" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                                <div>
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">RIF:</label>
                                                    <input type="text" id="presupuestoClienteRif" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff; font-size: 0.9rem;" readonly>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Datos del Pago -->
                            <div class="col-12">
                                <div class="card border-0 shadow-sm mb-3 presupuesto-card-pago" style="border-radius: 12px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);">
                                    <div class="card-body p-3">
                                        <div class="d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#1976d2" class="bi bi-credit-card-2-front me-2" viewBox="0 0 16 16">
                                                <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
                                                <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
                                            </svg>
                                            <h6 class="mb-0 fw-bold text-primary" style="font-size: 1.1rem;">Datos del Anticipo</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-coin me-1" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/>
                                        <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.616-.39-1.101-1.095-1.16l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.602-.52-1.246-1.8-1.36V9h-.375v.32c-.866.02-1.482.48-1.482 1.11 0 .628.465 1.105 1.108 1.162l.224.04v1.05c-.703-.01-1.37-.25-1.8-.75h-.682c.025.52.558.9 1.532.977v.44h.375v-.439c.878-.032 1.383-.5 1.383-1.258 0-.563-.39-.95-.962-1.065l-.224-.03v-1.198l.375.021c.612.035.977.332 1.019.777h.658c-.02-.602-.517-1.03-1.67-1.12v-.44h-.375v.439c-.843.071-1.38.34-1.38.936 0 .64.396.9 1.11.96l.224.03v1.21l-.375.021c-.752-.01-1.276.2-1.446.55h-.658zm2.194 1.622c.24.138.487.183.699.183.449 0 .723-.25.723-.65 0-.366-.24-.534-.673-.563l-.224-.03v1.198l.475.021z"/>
                                    </svg>
                                    Tipo de Moneda
                                </label>
                                <input type="text" id="presupuestoMoneda" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff;" readonly>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar me-1" viewBox="0 0 16 16">
                                        <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05m1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                                    </svg>
                                    Monto en Dólares Anticipo (USD)
                                </label>
                                <input type="text" id="presupuestoMontoUSD" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff;" readonly>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet2 me-1" viewBox="0 0 16 16">
                                        <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/>
                                    </svg>
                                    Método de Pago
                                </label>
                                <input type="text" id="presupuestoMetodoPago" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff;" readonly>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-exchange me-1" viewBox="0 0 16 16">
                                        <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-.275 1.5 1.5 0 0 1 .31-.293 1.5 1.5 0 0 1 .663-.293.5.5 0 0 0 .374-.832 6.5 6.5 0 0 1 .306-.77 1.5 1.5 0 0 1 .33-.292 1.5 1.5 0 0 1 .663-.293.5.5 0 0 0 .374-.832 6.5 6.5 0 0 1 .306-.77 1.5 1.5 0 0 1 .33-.292 1.5 1.5 0 0 1 .663-.293.5.5 0 0 0 .374-.832 6.5 6.5 0 0 1 .306-.77A5 5 0 0 0 0 5m.955 1.905A4.5 4.5 0 0 1 4.5 9H5a.5.5 0 0 0 0-1h-.5a3.5 3.5 0 0 0-2.545-1.19zm4.354 0a4.5 4.5 0 0 1 2.545 1.19H7a.5.5 0 0 0 0 1h.5a4.5 4.5 0 0 1 2.545 1.19A4.5 4.5 0 0 1 11.5 9H12a.5.5 0 0 0 0-1h-.5a4.5 4.5 0 0 1-2.545-1.19A4.5 4.5 0 0 1 7.5 5H7a.5.5 0 0 0 0 1h.5a4.5 4.5 0 0 1 2.545 1.19M0 11a5 5 0 0 1 4.027-4.905 6.5 6.5 0 0 0 .306.77 1.5 1.5 0 0 0 .33.292 1.5 1.5 0 0 0 .663.293.5.5 0 0 1 .374.832 6.5 6.5 0 0 0 .306.77 1.5 1.5 0 0 0 .33.292 1.5 1.5 0 0 0 .663.293.5.5 0 0 1 .374.832 6.5 6.5 0 0 0 .306.77 1.5 1.5 0 0 0 .33.292 1.5 1.5 0 0 0 .663.293.5.5 0 0 1 .374.832 6.5 6.5 0 0 0 .306.77A5 5 0 0 1 0 11m16-6a5 5 0 0 0-4.027 4.905 6.5 6.5 0 0 1-.306-.77 1.5 1.5 0 0 1-.33-.292 1.5 1.5 0 0 1-.663-.293.5.5 0 0 0-.374-.832 6.5 6.5 0 0 1-.306-.77 1.5 1.5 0 0 1-.33-.292 1.5 1.5 0 0 1-.663-.293.5.5 0 0 0-.374-.832 6.5 6.5 0 0 1-.306-.77 1.5 1.5 0 0 1-.33-.292 1.5 1.5 0 0 1-.663-.293.5.5 0 0 0-.374-.832 6.5 6.5 0 0 1-.306-.77A5 5 0 0 0 16 5"/>
                                    </svg>
                                    Monto en Bolívares Anticipo (Bs)
                                </label>
                                <input type="text" id="presupuestoMontoBS" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #fff;" readonly>
                            </div>
                            
                            <div class="col-md-6" id="presupuestoBancoOrigenContainer" style="display: none;">
                                <label class="form-label fw-semibold">Banco Origen</label>
                                <input type="text" id="presupuestoBancoOrigen" class="form-control" readonly>
                            </div>
                            
                            <div class="col-md-6" id="presupuestoBancoDestinoContainer" style="display: none;">
                                <label class="form-label fw-semibold">Banco Destino</label>
                                <input type="text" id="presupuestoBancoDestino" class="form-control" readonly>
                            </div>
                            
                            <div class="col-md-6" id="presupuestoReferenciaContainer" style="display: none;">
                                <label class="form-label fw-semibold">Referencia</label>
                                <input type="text" id="presupuestoReferencia" class="form-control" readonly>
                            </div>
                            
                            <div class="col-md-6" id="presupuestoDepositanteContainer" style="display: none;">
                                <label class="form-label fw-semibold">Depositante</label>
                                <input type="text" id="presupuestoDepositante" class="form-control" readonly>
                            </div>
                            
                            <div class="col-md-6" id="presupuestoFechaPagoContainer" style="display: none;">
                                <label class="form-label fw-semibold">Fecha de Pago</label>
                                <input type="text" id="presupuestoFechaPago" class="form-control" readonly>
                            </div>
                            
                            <!-- Sección: Datos de Pago Móvil -->
                            <div class="col-12" id="presupuestoPagoMovilContainer" style="display: none; margin-top: 15px;">
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
                                                <div class="mb-2" id="presupuestoOrigenRifContainer" style="display: none;">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                                    </label>
                                                    <div class="d-flex gap-2">
                                                        <input type="text" id="presupuestoOrigenRifTipo" class="form-control" readonly style="font-size: 0.9rem; padding: 6px 10px; width: 25%; background-color: #e9ecef; text-align: center; font-weight: 600;">
                                                        <input type="text" id="presupuestoOrigenRifNumero" class="form-control" readonly style="font-size: 0.9rem; padding: 6px 10px; width: 75%; background-color: #e9ecef;">
                                                    </div>
                                                </div>
                                                <div class="mb-2" id="presupuestoOrigenTelefonoContainer" style="display: none;">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Nro. Telefónico
                                                    </label>
                                                    <input type="text" id="presupuestoOrigenTelefono" class="form-control" readonly style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef;">
                                                </div>
                                                <div id="presupuestoOrigenBancoContainer" style="display: none;">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco
                                                    </label>
                                                    <input type="text" id="presupuestoOrigenBanco" class="form-control" readonly style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef;">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Destino -->
                                    <div class="col-md-6 mb-3">
                                        <div class="card" style="border-width: 2px; border-color: #6f42c1 !important;">
                                            <div class="card-header text-white" style="padding: 8px 12px; background-color: #6f42c1;">
                                                <h6 class="mb-0" style="font-size: 0.95rem; font-weight: 600;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.293L5.354 7.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.793z"/></svg>Destino
                                                </h6>
                                            </div>
                                            <div class="card-body" style="padding: 15px;">
                                                <div class="mb-2" id="presupuestoDestinoRifContainer" style="display: none;">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                                    </label>
                                                    <div class="d-flex gap-2">
                                                        <input type="text" id="presupuestoDestinoRifTipo" class="form-control" readonly style="font-size: 0.9rem; padding: 6px 10px; width: 25%; background-color: #e9ecef; text-align: center; font-weight: 600;">
                                                        <input type="text" id="presupuestoDestinoRifNumero" class="form-control" readonly style="font-size: 0.9rem; padding: 6px 10px; width: 75%; background-color: #e9ecef;">
                                                    </div>
                                                </div>
                                                <div class="mb-2" id="presupuestoDestinoTelefonoContainer" style="display: none;">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Nro. Telefónico
                                                    </label>
                                                    <input type="text" id="presupuestoDestinoTelefono" class="form-control" readonly style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef;">
                                                </div>
                                                <div id="presupuestoDestinoBancoContainer" style="display: none;">
                                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco
                                                    </label>
                                                    <input type="text" id="presupuestoDestinoBanco" class="form-control" readonly style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef;">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-12 mt-3">
                                <div class="card border-0 shadow-sm presupuesto-card-calculo" style="border-radius: 12px; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);">
                                    <div class="card-body p-3">
                                        <div class="d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#388e3c" class="bi bi-calculator me-2" viewBox="0 0 16 16">
                                                <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                                <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                                            </svg>
                                            <h6 class="mb-0 fw-bold text-success" style="font-size: 1.1rem;">Cálculo del Presupuesto</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools me-1" viewBox="0 0 16 16">
                                        <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.356 3.356a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 0 0-1.414l-3.356-3.356a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707V1.5a.5.5 0 0 0-.5-.5zM3 1.5v.258l1.5 1.5H5a.5.5 0 0 1 .5.5v.258l-1.5 1.5zm6.5 2.5v.258l1.5 1.5H11a.5.5 0 0 1 .5.5v.258l-1.5 1.5z"/>
                                    </svg>
                                    Monto Total de Taller (USD) <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text" style="border-radius: 8px 0 0 8px; padding-right: 15px; color: #495057; font-weight: 600; background-color: darkgray; height: 100%;">$</span>
                                    <input type="text" id="presupuestoMontoTaller" class="form-control shadow-sm border-0" style="border-radius: 0 8px 8px 0; transition: all 0.3s ease; border-left: 1px solid #e9ecef; padding-left: 12px;" placeholder="0.00" onfocus="this.style.boxShadow='0 0 0 0.2rem rgba(102, 126, 234, 0.25)'" onblur="this.style.boxShadow='0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'" onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode === 46" pattern="[0-9]+(\.[0-9]{1,2})?">
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle me-1" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.08 1.035l2.75 2.75a.75.75 0 0 0 1.08-.022l4-5a.75.75 0 0 0-1.06-1.06z"/>
                                    </svg>
                                    Monto Anticipo (USD)
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text" style="border-radius: 8px 0 0 8px; background-color: darkgray; padding-right: 15px; color: #495057; font-weight: 600; height: 100%;">$</span>
                                    <input type="text" id="presupuestoMontoPagadoUSD" class="form-control shadow-sm border-0" style="border-radius: 0 8px 8px 0; background-color: #f5f5f5; border-left: 1px solid #e9ecef; padding-left: 12px;" readonly>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right me-1" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                    </svg>
                                    Diferencia (USD)
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text" style="border-radius: 8px 0 0 8px; padding-right: 15px; color: #495057; font-weight: 600; background-color: darkgray; height: 100%;">$</span>
                                    <input type="text" id="presupuestoDiferenciaUSD" class="form-control shadow-sm border-0" style="border-radius: 0 8px 8px 0; transition: all 0.3s ease; border-left: 1px solid #e9ecef; padding-left: 12px;" readonly>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-exchange me-1" viewBox="0 0 16 16">
                                        <path d="M4.854 14.854a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V3.5A2.5 2.5 0 0 1 6.5 1h8a.5.5 0 0 1 0 1h-8A1.5 1.5 0 0 0 5 3.5v9.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4z"/>
                                        <path d="M11.146 1.146a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1-.708.708L12 2.707V12.5A2.5 2.5 0 0 1 9.5 15h-8a.5.5 0 0 1 0-1h8A1.5 1.5 0 0 0 11 12.5V2.707l-3.146 3.147a.5.5 0 0 1-.708-.708l4-4z"/>
                                    </svg>
                                    Tasa BCV (Hoy)
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text" style="border-radius: 8px 0 0 8px; padding-right: 15px; color: #495057; font-weight: 600; background-color: darkgray; height: 100%;">Bs/$</span>
                                    <input type="text" id="presupuestoTasaBCV" class="form-control shadow-sm border-0" style="border-radius: 0 8px 8px 0; background-color: #f5f5f5; border-left: 1px solid #e9ecef; padding-left: 12px;" readonly placeholder="Cargando...">
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right me-1" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                    </svg>
                                    Diferencia en Bolívares (Bs)
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text" style="border-radius: 8px 0 0 8px; padding-right: 15px; color: #495057; font-weight: 600; background-color: darkgray; height: 100%;">Bs</span>
                                    <input type="text" id="presupuestoDiferenciaBS" class="form-control shadow-sm border-0" style="border-radius: 0 8px 8px 0; transition: all 0.3s ease; border-left: 1px solid #e9ecef; padding-left: 12px;" readonly>
                                </div>
                            </div>
                            
                            <div class="col-12 mt-3">
                                <div class="card border-0 shadow-sm presupuesto-card-info" style="border-radius: 12px; background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);">
                                    <div class="card-body p-3">
                                        <div class="d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0288d1" class="bi bi-info-circle me-2" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                            </svg>
                                            <h6 class="mb-0 fw-bold text-info" style="font-size: 1.1rem;">Información del Presupuesto</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3 me-1" viewBox="0 0 16 16">
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/>
                                        <path d="M7 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-3-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-3-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                    Fecha del Presupuesto <span class="text-danger">*</span>
                                </label>
                                <input type="date" id="presupuestoFecha" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #f5f5f5;" readonly>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock me-1" viewBox="0 0 16 16">
                                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                                    </svg>
                                    Validez <span class="text-danger">*</span>
                                </label>
                                <input type="text" id="presupuestoValidez" class="form-control shadow-sm border-0" style="border-radius: 8px; background-color: #f5f5f5;" value="5 días hábiles" readonly>
                            </div>
                            
                            <div class="col-12">
                                <label class="form-label fw-semibold mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-text me-1" viewBox="0 0 16 16">
                                        <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1z"/>
                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/>
                                    </svg>
                                    Descripción de Reparación <span class="text-danger">*</span>
                                </label>
                                <textarea id="presupuestoDescripcion" class="form-control shadow-sm border-0" style="border-radius: 8px; transition: all 0.3s ease;" rows="4" placeholder="Ingrese la descripción detallada de la reparación o trabajo realizado..." onfocus="this.style.boxShadow='0 0 0 0.2rem rgba(102, 126, 234, 0.25)'" onblur="this.style.boxShadow='0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-4" style="background-color: #f8f9fa;">
                        <button type="button" class="btn btn-secondary px-4 py-2" id="closePresupuestoModalBtn" data-bs-dismiss="modal" style="border-radius: 8px; transition: all 0.3s ease; font-weight: 500;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-x-circle me-2" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                            Cerrar
                        </button>
                        <button type="button" class="btn px-4 py-2" id="previewPresupuestoPDFBtn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; transition: all 0.3s ease; font-weight: 500;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-eye me-2" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                            </svg>
                            Previsualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    
    <!-- MODAL PARA PREVISUALIZAR EL PRESUPUESTO PDF -->
    <div class="modal fade" id="presupuestoPDFModal" tabindex="-1" aria-labelledby="presupuestoPDFModalLabel" aria-hidden="true" style="background-color: rgba(0,0,0,.4); backdrop-filter: blur(8px);">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-gradient-primary">
                    <h5 class="modal-title" id="presupuestoPDFModalLabel">Previsualizar Presupuesto PDF</h5>
                    <button type="button" class="btn-close btn-close-white" id="closePresupuestoPDFBtn" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <iframe id="presupuestoPDFPreview" style="width: 100%; height: 80vh; border: none;"></iframe>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="closePresupuestoPDFBtn2" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="imprimirPresupuestoPDFBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                            <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1h12a1 1 0 0 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1z"/>
                        </svg>
                        Imprimir / Guardar PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL PARA PREVISUALIZAR EL PRESUPUESTO PDF -->
    
    <!-- MODAL PARA CARGAR PDF DEL PRESUPUESTO -->
    <div class="modal fade" id="uploadPresupuestoPDFModal" tabindex="-1" aria-labelledby="uploadPresupuestoPDFModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-gradient-primary text-white">
                    <h5 class="modal-title" id="uploadPresupuestoPDFModalLabel">
                        Cargar PDF del Presupuesto - Ticket: <span id="modalPresupuestoTicketId" class="fw-bold"></span>
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" id="closeUploadPresupuestoPDFBtn"></button>
                </div>
                <div class="modal-body">
                    <form id="uploadPresupuestoPDFForm">
                        <!-- Campos ocultos -->
                        <input type="hidden" id="uploadPresupuestoNroTicketHidden">
                        <input type="hidden" id="uploadPresupuestoSerialPosHidden">
                        
                        <div class="mb-3">
                            <label for="presupuestoPDFFile" class="form-label text-gray-700 fw-semibold">
                                Seleccionar Archivo PDF:
                            </label>
                            <div class="position-relative">
                                <input class="form-control" type="file" id="presupuestoPDFFile" accept="application/pdf" required>
                                <div class="valid-feedback">
                                    Formato correcto
                                </div>
                                <div class="invalid-feedback">
                                    Solo se permiten archivos PDF
                                </div>
                            </div>
                            <small id="presupuestoPDFFileFormatInfo" class="text-gray-500 d-block mt-1" style="display: block;">
                                Formato permitido: PDF
                            </small>
                        </div>
                        <div id="presupuestoPDFUploadMessage" class="alert alert-info hidden" role="alert" style="display: none;"></div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cerrarUploadPresupuestoPDFBtn" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="uploadPresupuestoPDFBtn" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload me-2" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5h2.767l12-12H14a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V2.717l-12 12H10a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5V9.9z"/>
                            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H14V3.5h-3a.5.5 0 0 1 0-1z"/>
                        </svg>
                        Subir PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL PARA CARGAR PDF DEL PRESUPUESTO -->
    
    <!--MODAL AGREGAR DATOS DE PAGO-->
    <div class="modal fade" id="modalAgregarDatosPago" tabindex="-1" aria-labelledby="modalAgregarDatosPagoLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 95vh; display: flex; flex-direction: column;">
                <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0; padding: 15px 25px; flex-shrink: 0;">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <h5 class="modal-title mb-0" id="modalAgregarDatosPagoLabel" style="font-weight: 600; font-size: 1.3rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 1 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Agregar Datos de Pago
                        </h5>
                        <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 10px 15px; min-width: 180px;">
                            <div class="d-flex align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar me-2" viewBox="0 0 16 16"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.051zm1.591 2.103c1.396.336 1.906.908 1.906 1.712 0 .932-.704 1.704-2.004 1.86V8.718l.1.026z"/></svg>
                                <div>
                                    <small style="opacity: 0.9; font-size: 0.75rem; display: block;">Monto del Anticipo</small>
                                    <h5 class="mb-0 fw-bold" id="montoEquipo" style="font-size: 1.1rem;">$0.00</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-body" style="padding: 20px; background: #f8f9fa; overflow-y: auto; flex: 1;">
                    <!-- Formulario -->
                    <form id="formAgregarDatosPago">
                        <input type="hidden" id="id_user_pago" name="userId" value="<?php echo isset($_SESSION['id_user']) ? $_SESSION['id_user'] : ''; ?>">
                        <input type="hidden" id="nro_ticket_pago" name="nro_ticket" value="">
                        <!-- Sección: Información del Equipo -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-display me-2" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>
                                <h6 class="form-section-title">Información del Equipo</h6>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-12 mb-2">
                                    <label for="serialPosPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-barcode me-1 text-primary" viewBox="0 0 16 16"><path d="M1 11.107V4.893C1 4.4 1.398 4 1.889 4H14.11C14.6 4 15 4.398 15 4.893v6.214C15 11.6 14.602 12 14.111 12H1.89C1.4 12 1 11.602 1 11.107ZM1.889 5v6h12.222V5H1.889Z"/><path d="M2 5v6h1V5H2Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1ZM11 5v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Z"/></svg>Serial POS
                                    </label>
                                    <input type="text" class="form-control" id="serialPosPago" readonly style="background-color: #e9ecef; cursor: not-allowed; font-size: 0.95rem; padding: 8px 12px;">
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Documento de Validación (NUEVO BLOQUE PARA VISUALIZAR DOCUMENTO) -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-file-earmark-text me-2" viewBox="0 0 16 16"><path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/><path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5"/></svg>
                                <h6 class="form-section-title">Documento de Validación</h6>
                            </div>
                             <div class="row g-2">
                                <div class="col-md-12">
                                    <div class="alert alert-info d-flex align-items-center flex-column" role="alert" style="padding: 10px; margin-bottom: 0;">
                                        <div class="d-flex align-items-center w-100 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-info-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                                            </svg>
                                            <div style="font-size: 0.9rem; color: white;">
                                                Visualice el documento adjunto para verificar los datos del pago.
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-primary" id="btnVerDocumentoPago" style="display: none; font-weight: 600; padding: 10px; margin-left: 30%; position: relative;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill me-2" viewBox="0 0 16 16">
                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                            </svg>
                                            Ver Documento de Anticipo
                                        </button>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Información de Pago -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 1 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>
                                <h6 class="form-section-title">Información de Pago</h6>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="fechaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-calendar-event me-1 text-primary" viewBox="0 0 16 16"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>Fecha Pago <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="date" class="form-control" id="fechaPago" placeholder="dd/mm/aaaa" required style="font-size: 0.95rem; padding: 8px 12px;" onchange="if(this.value) { loadExchangeRateToday(this.value); }" onclick="if(this.value) { loadExchangeRateToday(this.value); }">
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
                                    <input type="hidden" id="id_status_payment" name="id_status_payment">
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
                                                <div class="mb-2" style="display: none;">
                                                    <label for="origenRifTipo" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                                    </label>
                                                    <div class="d-flex gap-2">
                                                        <select class="form-select" id="origenRifTipo" style="font-size: 0.9rem; padding: 6px 10px; width: 25%;">
                                                            <option value="">Tipo</option>
                                                            <option value="J">J</option>
                                                            <option value="V">V</option>
                                                            <option value="E">E</option>
                                                            <option value="G">G</option>
                                                            <option value="P">P</option>
                                                        </select>
                                                        <input type="text" class="form-control" id="origenRifNumero" placeholder="Número RIF" pattern="[0-9]*" inputmode="numeric" style="font-size: 0.9rem; padding: 6px 10px; width: 75%;">
                                                    </div>
                                                </div>
                                                <div class="mb-2" style="display: none;">
                                                    <label for="origenTelefono" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Nro. Telefónico
                                                    </label>
                                                    <input type="text" class="form-control" id="origenTelefono" placeholder="Ej: 0412-1234567" pattern="[0-9\-]*" inputmode="numeric" style="font-size: 0.9rem; padding: 6px 10px;">
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
                                                    <select class="form-select" id="destinoBanco" required style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef; cursor: not-allowed;">
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
                                <div class="d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-cash me-1 text-primary" viewBox="0 0 16 16"><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 1 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Monto Bs
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
                    <button type="button" class="btn btn-secondary px-4" id="btnCancelarModalPagoFooter" style="font-size: 0.95rem; padding: 8px 20px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg me-2" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>Cancelar
                    </button>
                    <button type="button" class="btn btn-primary px-4" id="btnGuardarDatosPago" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; font-size: 0.95rem; padding: 8px 20px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg me-2" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.42-5.447a.733.733 0 0 1 1.047 0z"/></svg>Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!--END MODAL AGREGAR DATOS DE PAGO-->
    
    <input type="hidden" id="payment_id_to_save" value="">
    
    <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
    
    <input type="hidden" id="userId" value="<?php echo $_SESSION['id_user']; ?>">

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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

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