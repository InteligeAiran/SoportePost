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
        <!--     Fonts and icons     -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <!-- Nucleo Icons -->
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/consulta_rif/desktop/desktop.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/consulta_rif/mobile/mobile.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/consulta_rif/laptop/laptop.css" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/General.css" />

        <!-- CSS Files -->
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/argon-dashboard.css?v=2.1.0" />
        <link id="pagestyle" rel="stylesheet" href="<?php echo APP; ?>app/plugins/css/dashboard/dashboard.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.css">
        <link rel="stylesheet" href="<?php echo APP; ?>app/plugins/animate-css/animate.min.css"/>


        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">

        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.2.3/css/buttons.dataTables.min.css"/>

        <style>
            /** Asegúrate de que este CSS se cargue *después* de SweetAlert2
                * o de que esté disponible globalmente.
            */

            .super-toast-z-index {
                /* El valor 99999 debe ser suficiente para superar cualquier modal o overlay */
                z-index: 99999 !important; 
            }

              /* Custom styles for SweetAlert2 modal */
            /* Custom styles for SweetAlert2 session expired modal */
            .modern-swal-popup1 {
                border-radius: 12px !important;
                padding: 20px !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
                background: linear-gradient(145deg, #ffffff, #f0f4f8) !important;
            }

            .modern-swal-title1 {
                font-size: 1.5rem !important;
                color: #1e3a8a !important;
                font-weight: 600 !important;
                margin-bottom: 10px !important;
            }

            .modern-swal-content1 {
                font-size: 1rem !important;
                color: #374151 !important;
                line-height: 1.5 !important;
            }

            .modern-swal-progress-bar1 {
                background-color: #1e3a8a !important; /* Deep blue progress bar */
                height: 4px !important;
            }

            .modern-swal-popup {
                border-radius: 12px !important;
                padding: 20px !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
                background: linear-gradient(145deg, #ffffff, #f0f4f8) !important;
            }

            .modern-swal-title {
                font-size: 1.5rem !important;
                color: #1e3a8a !important;
                font-weight: 600 !important;
                margin-bottom: 10px !important;
            }

            .modern-swal-content {
                font-size: 1rem !important;
                color: #374151 !important;
                line-height: 1.5 !important;
            }

            .modern-swal-confirm {
                border-radius: 8px !important;
                padding: 10px 20px !important;
                font-size: 1rem !important;
                font-weight: 500 !important;
                transition: transform 0.2s ease !important;
            }

            .modern-swal-confirm:hover {
                transform: translateY(-2px) !important;
            }

            .modern-swal-cancel {
                border-radius: 8px !important;
                padding: 10px 20px !important;
                font-size: 1rem !important;
                font-weight: 500 !important;
                transition: transform 0.2s ease !important;
            }

            .modern-swal-cancel:hover {
                transform: translateY(-2px) !important;
            }
            
            /* Estilos personalizados para modales de validación de pago */
            .swal2-popup-custom {
                border-radius: 16px !important;
                padding: 0 !important;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
                background: #ffffff !important;
                max-width: 600px !important;
                overflow: hidden !important;
            }
            
            .swal2-title-custom {
                padding: 25px 30px 15px 30px !important;
                margin: 0 !important;
                border-bottom: 2px solid #f0f0f0 !important;
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
            }
            
            .swal2-html-custom {
                padding: 20px 30px 25px 30px !important;
                margin: 0 !important;
                font-size: 15px !important;
                line-height: 1.6 !important;
            }
            
            .swal2-confirm-custom {
                background: linear-gradient(135deg, #003594 0%, #0047b3 100%) !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 12px 30px !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                color: #ffffff !important;
                box-shadow: 0 4px 15px rgba(0, 53, 148, 0.3) !important;
                transition: all 0.3s ease !important;
                margin-top: 10px !important;
            }
            
            .swal2-confirm-custom:hover {
                background: linear-gradient(135deg, #0047b3 0%, #0056cc 100%) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(0, 53, 148, 0.4) !important;
            }
            
            .swal2-confirm-custom:active {
                transform: translateY(0) !important;
            }
            
            /* Estilos para el icono de advertencia */
            .swal2-icon.swal2-warning {
                border-color: #ffc107 !important;
                color: #ffc107 !important;
            }
            
            /* Mejora del backdrop */
            .swal2-backdrop-show {
                background: rgba(0, 0, 0, 0.5) !important;
                backdrop-filter: blur(4px) !important;
            }
            
            /* Ocultar backdrop para toasts */
            .swal2-container.swal2-toast-container .swal2-backdrop-show,
            .swal2-container.swal2-toast-container ~ .swal2-backdrop-show,
            .swal2-toast-container .swal2-backdrop-show {
                background: transparent !important;
                backdrop-filter: none !important;
            }
            
            /* Asegurar que no haya backdrop cuando hay un toast */
            body.swal2-toast-shown .swal2-backdrop-show {
                background: transparent !important;
                backdrop-filter: none !important;
            }
            
           /* Estilos para el botón Excel usando ID */
            #btn-excel-modern-id {
                background: linear-gradient(45deg, #217346, #28a745) !important;
                color: white !important;
                border: 2px solid #217346 !important;
                border-radius: 25px !important;
                padding: 12px 24px !important;
                font-weight: 700 !important;
                font-size: 13px !important;
                box-shadow: 0 8px 25px rgba(33, 115, 70, 0.25) !important;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                position: relative !important;
                overflow: hidden !important;
            }

            #btn-excel-modern-id::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: -100% !important;
                width: 100% !important;
                height: 100% !important;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
                transition: left 0.5s !important;
            }

            #btn-excel-modern-id:hover::before {
                left: 100% !important;
            }

            #btn-excel-modern-id:hover {
                background: linear-gradient(45deg, #1e6b3d, #217346) !important;
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 12px 35px rgba(33, 115, 70, 0.4) !important;
                border-color: #1e6b3d !important;
            }

            #btn-excel-modern-id:active {
                transform: translateY(-1px) scale(1.02) !important;
            }

            /* Estilos para el botón PDF */
            #btn-pdf-modern-id {
                background: linear-gradient(45deg, #dc3545, #c82333) !important;
                color: white !important;
                border: 2px solid #dc3545 !important;
                border-radius: 8px !important;
                padding: 10px 16px !important;
                font-weight: 600 !important;
                font-size: 14px !important;
                box-shadow: 0 4px 15px rgba(220, 53, 69, 0.25) !important;
                transition: all 0.3s ease !important;
            }

            #btn-pdf-modern-id:hover {
                background: linear-gradient(45deg, #c82333, #bd2130) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4) !important;
            }


            div.dataTables_wrapper div.dataTables_filter {
                margin-top: 1%;
            }

            div.dt-buttons{
                margin-left: 2%;
            }

            #rifTipo {
                width: auto;
                max-width: 80px;
                padding: 0.5rem 0.75rem;
                font-size: 1rem;
                height: auto;
                -webkit-appearance: none;
                /* Elimina la apariencia nativa en navegadores WebKit */
                -moz-appearance: none;
                /* Elimina la apariencia nativa en Firefox */
                appearance: none;
                /* Elimina la apariencia nativa en otros navegadores */
                background-image: url('data:image/svg+xml;utf8,<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>');
                background-repeat: no-repeat;
                background-position: right 0.5rem center;
                background-size: 1em;
                border-radius: 0.25rem;
                /* Mantén o ajusta el radio del borde */
                border: 1px solid #ced4da;
                /* Mantén o ajusta el color del borde */
                color: #495057;
                /* Mantén o ajusta el color del texto */
            }

            /* Opcional: Para eliminar el espaciado extra en algunos navegadores */
            #rifTipo::-ms-expand {
                display: none;
            }

            #createTicketFalla1Btn,
            #createTicketFalla2Btn,
            #closeDetailsPanelBtn{
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s ease;
                display: none;
            }

            #createTicketFalla2Btn {
                background-color: #3498db; /* Un azul más vibrante, similar al de los enlaces activos del navbar */
                color: #ffffff; /* Texto blanco */
                border: 1px solid #3498db;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }

            #createTicketFalla1Btn {
                background-color: #0056b3; 
            }

            #createTicketFalla1Btn:hover {
                background-color: #004494; /* A slightly darker shade for hover */
            }

            #createTicketFalla2Btn:hover {
                background-color: #2980b9; /* Un tono más oscuro para el hover */
                border-color: #2980b9;
                color: #f8f9fa; /* Ligeramente más blanco para contraste */            
            }

            #closeDetailsPanelBtn:hover{
                background-color: red;
                color: white;
            }

            tr[id^="status-row-"] th,
            tr[id^="status-row-"] td {
                color: red; /* Color rojo */
                font-weight: bold; /* Opcional: para que se vea más fuerte */
            }

            #rifCountTable .serial-pos-column, #rifCountTable td:nth-child(5) { /* nth-child(5) apunta a la quinta columna (Serial POS) */
                white-space: nowrap; /* Evita que el texto salte de línea */
                overflow: visible;   /* Asegura que el contenido no se corte si se desborda */
                text-overflow: clip; /* Evita los puntos suspensivos (...) */
                /* Asegúrate de que el width sea suficiente o ajústalo con DataTables columns.width */
                width: 150px !important; /* Ajusta este valor según el espacio que necesites. Usa !important si es necesario para sobrescribir. */
                min-width: 150px !important; /* Asegura un ancho mínimo */
            }

            /* Si quieres que los enlaces dentro de esa celda también se vean bien */
            #rifCountTable td:nth-child(5) a {
                white-space: nowrap;
                overflow: visible;
                text-overflow: clip;
            }

            .components-warning {
                background: linear-gradient(9deg, #3F51B5 9%, /* Azul Índigo (Transición al frío) */ #81D4FA 101% /* Azul Claro (Final) */);
                color: #ffffff;
                border: none;
                border-radius: 12px;
                box-shadow: 0 12px 30px rgba(255, 95, 109, 0.25);
                padding: 14px 20px;
                font-size: 0.95rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            .components-warning .icon-circle {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }

            .components-warning .highlight {
                background: rgba(255, 255, 255, 0.9);
                color: red;
                border-radius: 999px;
                font-weight: 700;
                padding: 4px 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
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

            /* Estilos para la palabra de bienvenida */
            #welcomeMessage h1 {
                font-size: 2.8rem; /* Tamaño de letra más grande */
                color: transparent; 
                font-family: 'Poppins', sans-serif; /* Un tipo de letra moderno y limpio */
                font-weight: 600; /* Texto más audaz */
                /*text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Sombra sutil para la letra */
                text-shadow: 2px 35px 0px rgba(0, 0, 0, 0.1);
                letter-spacing: 1px; /* Espaciado entre letras para un mejor look */
                line-height: 1.4; /* Espaciado de línea para que las palabras no se amontonen */
                margin-top: 103%;
                margin-left: 35%;
                position: absolute;
                width: 100%; /* Asegura que ocupe todo el ancho disponible */
            }

            .serial-link {
                color: blue; /* Un azul típico para enlaces */
                text-decoration: underline;
                cursor: pointer;
            }

            /* Estilos para el modal personalizado */
            .custom-swal-popup {
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                border: none;
            }

            .custom-swal-title {
                border-radius: 15px 15px 0 0;
                padding: 20px;
                margin: 0;
            }

            .custom-swal-html {
                padding: 20px;
            }

            /* Icono de advertencia */
            .warning-icon-container {
                display: inline-block;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ffc107, #ff9800);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
            }

            .warning-icon {
                font-size: 40px;
                color: white;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            /* Animación de fade out para el modal */
            .fade-out {
                animation: fadeOut 0.3s ease-out forwards !important;
            }

            .modal-backdrop.fade-out {
                animation: fadeOut 0.3s ease-out forwards !important;
            }

            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }

            /* Badge del serial */
            .serial-badge {
                display: inline-block;
                padding: 12px 20px;
                background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                border: 2px solid #2196f3;
                border-radius: 25px;
                color: #1565c0;
                font-size: 16px;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(33, 150, 243, 0.2);
                transition: all 0.3s ease;
            }

            .serial-badge:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
            }

            /* Tarjeta de detalles */
            .ticket-details-card {
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }

            .ticket-details-card .card-header {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-bottom: 1px solid #dee2e6;
                padding: 15px 20px;
            }

            .ticket-details-card .list-group-item {
                padding: 15px 20px;
                border: none;
                border-bottom: 1px solid #f0f0f0;
                transition: background-color 0.2s ease;
            }

            .ticket-details-card .list-group-item:hover {
                background-color: #f8f9fa;
            }

            .ticket-details-card .list-group-item:last-child {
                border-bottom: none;
            }

            /* Labels y valores */
            .detail-label {
                font-weight: 600;
                color: #495057;
                display: flex;
                align-items: center;
            }

            .detail-value {
                font-weight: 600;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 14px;
            }

            .failure-text {
                background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                color: #856404;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                border: 1px solid #ffeaa7;
                max-width: 200px;
                text-align: center;
                word-wrap: break-word;
            }

            /* Alertas mejoradas */
            .alert {
                border-radius: 10px;
                border: none;
                padding: 15px 20px;
            }

            .alert-warning {
                background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                color: #856404;
            }

            .alert-danger {
                background: linear-gradient(135deg, #f8d7da, #f5c6cb);
                color: #721c24;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .custom-swal-popup {
                    width: 95% !important;
                    margin: 10px;
                }
                
                .serial-badge {
                    font-size: 14px;
                    padding: 10px 16px;
                }
                
                .detail-value {
                    font-size: 12px;
                    padding: 6px 10px;
                }
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
        <div class="min-height-300 bg-dark position-absolute w-100"></div>
        <main class="main-content position-relative border-radius-lg">
            <div class="container-fluid py-4">
                <div id="Row" class="row mt-4">
                    <div class="cord">
                        <div class="d-flex justify-content-start mt-2 flex-wrap" style="margin-left: 10%;">
                            <button type="button" class="btn btn-outline-primary me-2 btn-custom" id="buscarPorNombreBtn">Buscar por Razón Social</button>
                            <button type="button" class="btn btn-outline-primary me-2 btn-custom" id="buscarPorSerialBtn">Buscar por Serial</button>
                            <button type="button" class="btn btn-outline-primary btn-custom" id="buscarPorRifBtn">Buscar Por Rif</button>
                        </div>
                        <div id="SearchRif" class="mb-3 d-flex align-items-center">
                            <div id="welcomeMessage" class="d-flex justify-content-center align-items-center">
                                <h1 class="text-center">Ingrese los datos del Cliente</h1>
                            </div>
                            <div id="RifDiv" class="d-flex align-items-center" style="margin-top: 1%; position: fixed; margin-left: 6%;">
                                <select class="form-select me-2" id="rifTipo" style="width: auto; max-width: 80px; padding: 0.5rem 0.75rem; font-size: 1rem; height: auto; display: none;">
                                    <option value="J">J</option>
                                    <option value="V" selected>V</option>
                                    <option value="E">E</option>
                                    <option value="G">G</option>
                                </select>
                                <input type="text" class="form-control me-2" id="rifInput" placeholder="JV123456789" style="display: none;">
                                <button type="button" class="btn btn-primary" onclick="SendRif()" id="buscarRif" style="display: none;">Buscar</button><br>
                            </div>

                            <input type="text" class="form-control me-2" id="serialInput" placeholder="10000CT27000041" style="display: none;" maxlength="24">
                            <button type="button" class="btn btn-primary" onclick="SendSerial()" id="buscarSerial" style="display: none;  margin-top: -9%; margin-left: 45%;">Buscar</button>

                            <input type="text" class="form-control me-2" id="RazonInput" placeholder="Mi Empresa, 2018, C.A." style="display: none;">
                            <button type="button" class="btn btn-primary" onclick="SendRazon()" id="buscarRazon" style="display: none; margin-top: -9%; margin-left: 45%;">Buscar</button>
                        </div><br>
                        <div class="card" style="display: none;">
                            <div class="row">
                                <div class="col-12">
                                    <table id="rifCountTable" class="table table-bordered" style="width: 100%">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%; height: 10px;">ID cliente</th>
                                                <th style="width: 10%;">Raz&oacuten Social</th>
                                                <th style="width: 5%;">RIF</th>
                                                <th style="width: 5%;">Modelo POS</th>
                                                <th style="width: 5%;" class="serial-pos-column">Serial POS</th>
                                                <th style="width: 5%;">Estatus del Equipo</th>
                                                <th style="width: 5%;">N° Afiliaci&oacuten</th>
                                                <th style="width: 5%;">Fecha Instalaci&oacuten</th>
                                                <th style="width: 5%;">Banco</th>
                                                <th style="width: 15%;">Direcci&oacuten Instalaci&oacuten</th>
                                                <th style="width: 5%;">Estado</th>
                                                <th style="width: 5%;">Municipio</th>
                                                <!--th style="width: 5%;">Presupuesto ($)</th>
                                                <th style="width: 5%;">Abonado ($)</th>
                                                <th style="width: 5%;">Deuda ($)</th-->
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colspan="15">No hay datos</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div id="ModalSerial" class="modal">
                                <div id="ModalSerial-content" class="modal-content" style="max-height: 80vh; overflow-y: auto;">
                                    <span id="ModalSerial-close" class="close">&times;</span>
                                    <div style="text-align: center; margin-bottom: 20px;">
                                        <h2>Detalles del POS</h2>
                                    </div>
                                    <div style="display: flex;">
                                        <div style="flex: 1; margin-right: 20px;">
                                            <table id="serialCountTable">
                                                <tbody></tbody>
                                            </table>
                                        </div>
                                        <div style="width: 150px;">
                                            <img src="" alt="Imagen del POS"> </img>
                                        </div>
                                    </div>
                                    <div class="mt-4 w-100 d-flex justify-content-center align-items-center">
                                        <button type="button" class="btn btn-success me-2" id="createTicketFalla1Btn">Crear Ticket Falla 1</button>
                                        <button type="button" class="btn btn-warning" id="createTicketFalla2Btn">Crear Ticket Falla 2</button>
                                    </div>
                                    <div class="mt-3 w-100 d-flex justify-content-center" id="txtDescripcion"></div>
                                    <!--div class="mt-3 w-100 d-flex justify-content-center">
                                        <button type="button" class="btn btn-secondary w-75" id="closeDetailsPanelBtn">Cerrar Detalles</button>
                                    </div-->

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AVISA LAS GARANTIAS --->
                <div id="garantiaModal" class="modal">
                    <div id="garantiaModal-content" class="modal-content">
                        <span id="garantiaModal-close" class="close">&times;</span>
                        <h2 id="garantiaModal-titulo">¡Alerta de Garantía!</h2>
                        <p id="garantiaModal-mensaje"></p>
                    </div>
                </div>
            <!-- AVISA LAS GARANTIAS --->
        </main>

        <!-- PARA SELECCIONAR LOS COMPONENTES ASOCIADOS AL SERIAL DEL POS -->
            <div class="modal fade" id="modalComponentes" tabindex="-1" aria-labelledby="modalComponentesLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content" style="max-height: 80vh; overflow-y: auto;">
                            <div class="modal-header bg-gradient-primary">
                                <h5 class="modal-title text-white" id="modalComponentesLabel">
                                    <i class="bi bi-box-seam-fill me-2"></i>Lista de Componentes del Dispositivo
                                </h5>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="alert bg-gradient-primary text-white" role="alert">
                                            <i class="bi bi-info-circle me-2"></i>
                                            Selecciona los componentes que deseas cargar para este dispositivo.
                                        </div>
                                        <div class="components-warning" role="alert">
                                            <div class="d-flex align-items-center flex-wrap w-100">
                                                <div class="d-flex align-items-center flex-grow-1">
                                                    <span class="icon-circle me-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                                                        </svg>
                                                    </span>
                                                    <span class="fw-semibold">Si el Dispositivo no dispone de componentes adicionales, selecciona al menos la opción</span>
                                                </div>
                                                <span class="highlight ms-auto mt-2 mt-md-0">Equipo</span>
                                            </div>
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
                                
                                <div class="row mt-3">
                                    <div class="col-12">
                                        <div class="d-flex justify-content-between align-items-center" style="margin-top: -3%;">
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
                                <button type="button" class="btn btn-primary" id="btnGuardarComponentes">
                                    <i class="bi bi-check-circle me-1"></i>Guardar
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
        <!-- END PARA SELECCIONAR LOS COMPONENTES ASOCIADOS AL SERIAL DEL POS -->

        <!--MODAL FALLA NIVEL 2-->
            <div class="modal" id="miModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1"  style="background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalToggleLabel" style = "color: grey;">Falla Nivel 2</h1>
                        </div>
                        <div class="modal-body" style="margin-left: 0; max-height: 70vh; overflow-y: auto;">
                            <form id="miFormulario" class="row g-3">
                                <div id="detalle1" class="col-md-6">
                                    <div><br>
                                        <label for="FallaSelect2" class="form-label">Falla descrita por el cliente</label>
                                        <div id="FallaSelect2Container">
                                            <select id="FallaSelect2" name="FallaSelect2" class="form-select">
                                                <option></option>
                                            </select>
                                        </div><br>
                                    </div>
                                    <div style=" display: flex; flex-direction: column;">
                                        <label id="LabelRifModal2" for="serialInputDetalle1" class="form-label">RIF
                                            cliente</label>
                                        <input type="text" onchange="checkRif()" id="InputRif" class="form-control"
                                            placeholder="JV123456789" disabled>
                                            <input type="hidden" id="InputRazon" class="form-control"disabled>
                                        <p style="margin-left: 143%; width: 100%;" id="rifMensaje"></p>
                                    </div>
                                    <div>
                                        <label id="LabelSerial" class="form-label" for="serialSelect">Seriales de POS:</label>
                                        <div id="serialSelectContainer">
                                            <input type="text" class="form-control" id="serialSelect" name="serialSelect" disabled></input>
                                        </div><br>
                                    </div>
                                    <br>
                                    <div>
                                        <label id="LabelCoordinador" class="form-label" for="AsiganrCoordinador">Asignar a la
                                            Coordinación</label>
                                        <div id="AsiganrCoordinadorContainer">
                                            <select id="AsiganrCoordinador" name="AsiganrCoordinador" class="form-select" style = "width: 103%; margin-left: 7%;">
                                                <option></option>
                                            </select>
                                        </div><br>
                                    </div>
                                    <div class="contenedor-fechas">
                                        <div>
                                            <label class="form-label" id="FechaLast" for="ultimoTicketInput">Fecha del Último
                                                Ticket:</label>
                                            <input class="form-control" type="text" id="ultimateTicketInput" disabled>
                                            <div style=" margin-left: 5%;" id="resultadoGarantiaReingreso"></div>
                                            <div id="iconoAgregarInfoContainer" style="    margin-top: 23%; margin-left: -17%; display: block; text-align: center; width: 120%; position: absolute;">
                                                <svg id="iconoAgregarInfo" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#17a2b8" class="bi bi-credit-card-2-front-fill" viewBox="0 0 16 16" style="cursor: pointer; transition: all 0.3s ease; z-index: 1000; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));" 
                                                   title="Agregar información de pago">
                                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                                                </svg>
                                                <div style="margin-top: 8px; font-size: 0.8rem; color: #17a2b8; font-weight: 600; letter-spacing: 0.3px;">Detalles de Pago</div>
                                            </div>
                                        </div><br>

                                        <div>
                                            <label class="form-label" id="LabelFechaInst" for="InputFechaInstall">Fecha de
                                                Instalaci&oacuten POS:</label>
                                            <input class="form-control" type="text" id="InputFechaInstall" disabled>
                                            <div style="margin-left: 31%;" id="resultadoGarantiaInstalacion"></div>
                                        </div>
                                    </div><br>
                                    <div id="FallaSelectContainer1">
                                        <select class="form-select" style="margin-left: 116%; width: 172px; display: none;"
                                            id="FallaSelectt2" name="FallaSelect1">
                                            <option value="2">Nivel 2</option>
                                        </select>
                                    </div>
                                    <br>

                                    <div class="mb-3"  style="width: 100%; margin-left: 165%; margin-top: 36%;">
                                        <label class="form-label">¿Deseas cargar los documentos ahora?</label>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="uploadOption" id="uploadNow"
                                                value="yes">
                                            <label class="form-check-label" for="uploadNow">Sí</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="uploadOption" id="uploadLater"
                                                value="no" checked>
                                            <label class="form-check-label" for="uploadLater">No (Pendiente por cargar
                                                documentos)</label>
                                        </div>
                                    </div>

                                    <div id="documentUploadOptions" class="mb-3" style = "margin-left: 270%; width: 83%; margin-top: 12%;">
                                        <label class="form-label">Selecciona los documentos a cargar:</label>
                                        <div id = "checkEnvioContainer" class="form-check">
                                            <input class="form-check-input" type="checkbox" id="checkEnvio" value="envio">
                                            <label class="form-check-label" for="checkEnvio"> Documento de Envío</label>
                                        </div>
                                        <div id="checkExoneracionContainer" class="form-check">
                                            <input class="form-check-input" type="radio" id="checkExoneracion" name="documentType" value="exoneracion">
                                            <label class="form-check-label" id="checkExoneracionLabel" for="checkExoneracion">Exoneración</label>
                                        </div>
                                        <div id="checkAnticipoContainer" class="form-check">
                                            <input class="form-check-input" type="radio" id="checkAnticipo" name="documentType" value="anticipo">
                                            <label class="form-check-label" id="checkAnticipoLabel" for="checkAnticipo">Anticipo</label>
                                        </div>
                                    </div>

                                    <div id="DownloadsBotons">
                                        <div id="botonCargaPDFEnv" style="display: none;">
                                            <button id="DownloadEnvi" class="btn btn-outline-secondary btn-sm" type="button">Adjunte Documento Envio</button>
                                            <input class="form-control" id="EnvioInput" type="file"
                                                style="display: none; margin-left: 10px;"
                                                accept="application/pdf, image/jpg, image/png">
                                            <div id="envioStatus"></div>
                                        </div><br>

                                        <div style="display: none; align-items: center; margin-bottom: 6%; flex-direction: row;"
                                            id="botonCargaExoneracion">
                                            <button id="DownloadExo" class="btn btn-outline-secondary btn-sm"
                                                type="button">Adjunte Documento Exoneracion</button>
                                            <input class="form-control" id="ExoneracionInput" type="file"
                                                style="display: none; margin-left: 10px;"
                                                accept="application/pdf, image/jpg, image/png">
                                            <div id="exoneracionStatus"></div>
                                        </div><br>

                                        <div style="display: flex; align-items: center; margin-top: 15px; margin-bottom: 2%; display: none; position: relative;"
                                            id="botonCargaAnticipo">
                                            <button id="DownloadAntici" class="btn btn-outline-secondary btn-sm" type="button">
                                                <span>Adjunte Documento Anticipo</span>
                                            </button>
                                            <input id="AnticipoInput" type="file" style="display: none; margin-left: 10px;"
                                                accept="application/pdf, image/jpg, image/png">
                                            <div id="anticipoStatus"></div>
                                        </div>
                                    </div>
                                    <div id="RightSelects">
                                        </div>
                                    <input type="hidden" id="id_user" name="userId" value=<?php echo $_SESSION['id_user']?>>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button id="SendForm2" class="btn btn-primary">Guardar</button>
                            <button id="buttonCerrar2" type="button" class="btn btn-secondary"data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL FALLA NIVEL 2-->

        <!--MODAL AGREGAR DATOS DE PAGO-->
            <div class="modal fade" id="modalAgregarDatosPago" tabindex="-1" aria-labelledby="modalAgregarDatosPagoLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 95vh; display: flex; flex-direction: column;">
                        <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0; padding: 15px 25px; flex-shrink: 0;">
                            <div class="d-flex justify-content-between align-items-center w-100">
                                <h5 class="modal-title mb-0" id="modalAgregarDatosPagoLabel" style="font-weight: 600; font-size: 1.3rem;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Agregar Datos de Pago
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
                                                <input type="text" class="form-control" id="montoBs" placeholder="0.00" disabled style="font-size: 0.95rem; padding: 8px 12px; padding-right: 40px;">
                                                <span class="currency-suffix" id="montoBsSuffix" style="display: none;">Bs</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label for="montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-left-right me-1 text-primary" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>Monto REF
                                            </label>
                                            <div class="position-relative">
                                                <input type="text" class="form-control" id="montoRef" placeholder="0.00" disabled style="font-size: 0.95rem; padding: 8px 12px; padding-right: 40px;">
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

        <!--MODAL FALLA NIVEL 1-->
            <div class="modal" id="miModal1" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1"
                data-bs-backdrop="static" data-bs-keyboard="false">
                <div id="Modal2-div" class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content" style="max-width: 66%; max-height: 90vh;">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalToggleLabel" style="color: grey;">Falla Nivel 1</h1>
                        </div>
                        <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                            <div>
                                <label for="FallaSelect1">Falla Descrita Por el Cliente</label>
                                <div id="FallaSelect1Container">
                                    <select id="FallaSelect1" name="FallaSelect1">
                                    </select>
                                </div><br>
                                <label for="serialInputDetalle1">RIF cliente</label>
                                <input type="text" onchange="checkRif1()" id="InputRif1" placeholder="JV123456789" disabled>
                                <p id="rifMensaje1"></p>
                                <label for="serialSelect">Seriales de POS:</label>
                                <div id="serialSelectContainer">
                                    <input type="text" class="form-control" id="serialSelect1" name="serialSelect" disabled>
                                </div><br>
                                <label style="display: none;" for="FallaSelect">Nivel Falla</label>
                                <div id="FallaSelectContainer">
                                    <select id="FallaSelectt1" name="FallaSelect" style="display: none;">
                                        <option value="1">Nivel 1</option>
                                    </select>
                                </div>
                                 <div id="TextExplicacionFalla">
                                    <label for="explicacionFalla">Explique la Falla:</label>
                                    <textarea id="explicacionFalla" class="form-control" rows="4" cols="50" maxlength="500"
                                        placeholder="Describa la falla presentada por el cliente..."></textarea>
                                </div>
                                <input type="hidden" id="id_user" name="userId">
                                <table id="serialCountTableDetalle1" class="table">
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer" style="margin-bottom: 10%">
                            <button id="SendForm1" onclick="SendDataFailure1();" style="display: block;" class="btn btn-primary">Guardar</button>
                            <button id="buttonCerrar" type="button" class="btn btn-secondary"
                                data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--END MODAL FALLA NIVEL 1-->
    </div>
        <!-- Github buttons -->
        <!--JQUERY-->

        <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
        <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>
        <script src="<?php echo APP; ?>app/assets/js/tutorial-auto.js"></script>

        <!-- Bootstrap-->
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>
        <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-resizable-columns@0.2.3/dist/jquery.resizableColumns.min.js"></script>


        <!--   Core JS Files   -->
        <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/perfect-scrollbar.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/js/smooth-scrollbar.min.js"></script>

        <!-- Datatable -->
        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.min.js"></script>
        <script src="<?php echo APP; ?>app/plugins/datatables/datatables.js"></script>

        <script type="text/javascript" src="<?php echo APP; ?>DataTable/dataTables.bootstrap.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/dataTables.buttons.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/buttons.print.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/buttons.flash.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/pdfmake.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/jszip.min.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/vfs_fonts.js"></script>
        <script type="text/javascript" src="<?php echo APP; ?>DataTable/buttons.html5.min.js"></script>

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

        <script src="<?php echo APP; ?>app/plugins/devoops-master/plugins/maskedinput/src/jquery.maskedinput.js"></script>

        <!-- Custom scripts for all pages-->
        <script src="<?php echo APP; ?>app/plugins/js/sb-admin-2.min.js"></script>
        <script src="<?php echo APP; ?>app/views/consulta_rif/js/frontEnd.js"></script>

        <script>
            function startConsultaRIFTutorial() {
                new ConsultaRIFTutorial().startTutorial();
            }
            </script>

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