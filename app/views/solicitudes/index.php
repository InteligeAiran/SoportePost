<?php
/**
 * SoportePost - Sistema de Gestion de Tickets
 * @author    Airan Bracamonte <airanbracamonte01@gmail.com>
 * @copyright 2026 Inteligensa. Todos los derechos reservados.
 * @license   Propietario - Ver archivo LICENSE en la raiz del proyecto
 */
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

    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/datatable.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/jquery.dataTables.min.css">
    <link type="text/css" rel="stylesheet" href="<?php echo APP; ?>DataTable/buttons.dataTables.min1.css">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/tecnico/tecnico.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css" />
    
    <style>
        /* Estilo base para el botón de Asignar Técnico */

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

        .btn-secondary {
            border-radius: 0.5rem;
        }
        .form-check-label {
            font-weight: 500;
        }
       
    
        #imageViewPreview, #pdfViewViewer {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .hidden {
            display: none !important;
        }

        #BotonCerrarSelectDocument:hover{
            background-color: red;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #btnConfirmarVisualizacion{
            color: white;
            background-color: #003594;
            border: none;
            cursor: pointer;
        }

        /* --- Estilo de Alertas Premium --- */
        .alert-premium-danger {
            background: linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%);
            color: white !important;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(255, 75, 43, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.9rem;
            animation: slideInAlert 0.3s ease-out;
        }

        .alert-premium-success {
            background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%);
            color: white !important;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(0, 176, 155, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.9rem;
            animation: slideInAlert 0.3s ease-out;
        }

        @keyframes slideInAlert {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .alert-premium-danger i, .alert-premium-success i {
            font-size: 1.2rem;
        }

            padding: 10px 20px;
        }

        #btnConfirmarVisualizacion:hover{
            background-color: green;
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #CerrarModalVizualizar:hover{
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #botonMostarImage{
            color: white;
            background-color: #007BFF;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #botonMostarNoImage{
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #RechazoDocumento{
            color: white;
            background-color: #FF0000;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
        }

        #CerrarModalMotivoRechazo:hover{
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
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
            content: 'âš ï¸';
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

        /* ... existing styles ... */

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

        /* Estilos para el Modal de Exoneración */
        .exoneration-type-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .exoneration-type-btn {
            flex: 1;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            background: white;
            color: #666;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
        }
        .exoneration-type-btn.active[data-type="Anticipo"] {
            background: #ff9800;
            border-color: #ff9800;
            color: white;
            box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
        }
        .exoneration-type-btn.active[data-type="Pago taller"] {
            background: #f44336;
            border-color: #f44336;
            color: white;
            box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
        }
        .exoneration-type-btn.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f5f5f5 !important;
            color: #aaa !important;
            border-color: #eee !important;
            pointer-events: none;
            box-shadow: none !important;
        }
        .percentage-slider-container {
            background: #f1f3f9;
            padding: 25px 20px;
            border-radius: 15px;
            margin-bottom: 25px;
            position: relative;
        }
        .percentage-display {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #ff7043;
            color: white;
            padding: 5px 15px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 1.2rem;
            box-shadow: 0 4px 10px rgba(255, 112, 67, 0.3);
            z-index: 5;
        }
        .custom-range {
            width: 100%;
            height: 8px;
            border-radius: 5px;
            background: #dee2e6;
            outline: none;
            -webkit-appearance: none;
        }
        .custom-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ff9800;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }
        .custom-range::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
        .exo-code-container {
            display: flex;
            align-items: center;
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 25px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .exo-code-icon {
            background: #0d47a1;
            padding: 12px 18px;
            color: white;
        }
        .exo-code-value {
            padding: 12px 20px;
            font-family: 'Courier New', Courier, monospace;
            font-weight: 700;
            color: #0d47a1;
            letter-spacing: 2px;
            flex: 1;
            text-align: center;
            font-size: 1.1rem;
        }

        /* Soporte Digital Styles Reused from Payment Module */
        .exo-upload-container {
            position: relative;
            margin-bottom: 20px;
        }
        .exo-file-drop-zone {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            border: 2px dashed #cbd5e0 !important;
            border-radius: 20px;
            background: #ffffff;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            min-height: 190px;
            width: 100%;
        }
        .exo-file-drop-zone:hover {
            border-color: #da1b60 !important;
            background: #fff5f7;
        }
        .exo-file-status {
            padding: 15px;
            background: #f0fdf4;
            border: 1px solid #86efac;
            border-radius: 12px;
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }
        .btn-sync-exo {
            background: orange;
            color: white;
            font-weight: 700;
            width: 100%;
            padding: 14px;
            border-radius: 12px;
            border: none;
            box-shadow: 0 4px 15px rgba(255, 165, 0, 0.4);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .btn-sync-exo:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 165, 0, 0.6);
            background: #e69500;
            color: white;
        }
        .history-section-title {
            font-size: 1rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #eee;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Botón de cierre personalizado */
        .btn-close-custom {
            position: absolute;
            top: 25px;
            right: 25px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            padding: 10px;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            border: none;
            opacity: 0.8;
            outline: none;
            z-index: 10;
        }
        .btn-close-custom:hover {
            background-color: rgba(255, 255, 255, 0.4);
            transform: rotate(90deg);
            opacity: 1;
        }
        .btn-close-custom svg {
            fill: white;
            width: 20px;
            height: 20px;
        }

        /* Botón Cancelar Estilizado */
        #btnCancelEditExoneracion {
            background-color: #f1f3f5 !important;
            color: #6c757d !important;
            border-radius: 10px !important;
            padding: 8px 20px !important;
            transition: all 0.2s ease !important;
            font-weight: 600 !important;
            border: 1px solid #e9ecef !important;
            display: inline-flex !important;
            align-items: center !important;
            text-decoration: none !important;
        }
        #btnCancelEditExoneracion:hover {
            background-color: #fee2e2 !important;
            color: #ef4444 !important;
            border-color: #fecaca !important;
        }
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
                                                <h5 class="text-black text-capitalize ps-3" style="color: black;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-shield-check" viewBox="0 0 16 16"><path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.456.545 7.138 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/><path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/></svg> Solicitud</h5>
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                                <div id="ticket-status-indicator-container"></div>
                                <table id="tabla-ticket" class="table table-striped table-bordered table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th>N°</th>
                                            <th>ID Cliente</th>
                                            <th>Nro Solicitud</th>
                                            <th>Razón Social</th>
                                            <th>RIF</th>
                                            <th>Tipo de Solicitud</th>
                                            <th>Observación</th>
                                            <th>Estatus</th>
                                            <th>Usuario Creación</th>
                                            <th>Fecha Creación</th>
                                            <th>Acciones</th>
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
                    <h3 class="mb-3">Detalles del la Solicitud</h3>
                    <div id="ticket-details-panel" class="flex-grow-1 overflow-auto p-3 bg-light rounded">
                        <strong><p>Selecciona un ticket de la tabla para ver sus detalles Aquí.</p></strong>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!--MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->
        <div class="modal fade" id="visualizarImagenModal" tabindex="-1" aria-labelledby="visualizarImagenModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="visualizarImagenModalLabel"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-images me-2" viewBox="0 0 16 16"><path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/><path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2zM13.002 5a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1z"/><path d="M14.002 5h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>Seleccione la imagen que desea visualizar:</h5>
                    </div>
                    <div class="modal-body">

                        <div class="form-check"><br>
                            <input class="form-check-input" type="radio" name="opcionImagen" id="imagenPago" value="Anticipo">
                            <label class="form-check-label" for="imagenPago" id="labelPago">
                                Exoneración de Anticipo
                            </label>
                        </div>
                        <div class="form-check"><br>
                            <input class="form-check-input" type="radio" name="opcionImagen" id="imagenExoneracion" value="Exoneracion">
                            <label class="form-check-label" for="imagenExoneracion" id="labelExoneracion">
                                Exoneración de Pago Taller
                            </label>
                        </div>
                        <div class="form-check"><br>
                            <input class="form-check-input" type="radio" name="opcionImagen" id="imagenPresupuesto" value="presupuesto">
                            <label class="form-check-label" for="imagenPresupuesto" id="labelPresupuesto">
                                Documento de Presupuesto
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="BotonCerrarSelectDocument">Cerrar</button>
                        <button type="button" class="btn btn-primary" id="btnConfirmarVisualizacion">Visualizar</button>
                    </div>
                </div>
            </div>
        </div>
    <!--END MODAL PARA SELECCIONAR LAS ACCIONES PARA VIZUALIZAR LA IMAGEN-->


    <!-- MODAL PAGO PRESUPUESTO -->
        <div class="modal fade" id="modalPagoPresupuesto" tabindex="-1" aria-labelledby="modalPagoPresupuestoLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 95vh; display: flex; flex-direction: column;">
                    <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0; padding: 15px 25px; flex-shrink: 0;">
                        <input type="hidden" id="ticketIdPago" value="">
                        <input type="hidden" id="presupuestoIdPago" value="">
                        <div class="d-flex justify-content-between align-items-center w-100">
                             <h5 class="modal-title mb-0" id="modalPagoPresupuestoLabel" style="font-weight: 600; font-size: 1.3rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Pagos Asociados al
                            </h5>
                             <div class="d-flex align-items-center gap-3">
                                <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 8px 15px;">
                                    <div class="d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ticket-perforated me-2" viewBox="0 0 16 16"><path d="M4 4.85v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9z"/><path d="M1.5 3a.5.5 0 0 0-.5.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 1 0 0 3 .5.5 0 0 1 .5.5v2.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 0 0 0-3 .5.5 0 0 1-.5-.5V3.5a.5.5 0 0 0-.5-.5zM2 4h12v2.041A2.5 2.5 0 0 0 14.04 10V12H2V9.959A2.5 2.5 0 0 0 1.96 5.959z"/></svg>
                                        <span id="ticketNumeroPago" style="font-weight: 600;">Ticket #</span>
                                    </div>
                                </div>
                                <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 10px 15px; min-width: 180px;">
                                    <div class="d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar me-2" viewBox="0 0 16 16"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.051zm1.591 2.103c1.396.336 1.906.908 1.906 1.712 0 .932-.704 1.704-2.004 1.86V8.718l.1.026z"/></svg>
                                        <div>
                                            <small style="opacity: 0.9; font-size: 0.75rem; display: block;">Monto a Pagar</small>
                                            <h5 class="mb-0 fw-bold" id="montoEquipo" style="font-size: 1.1rem;">$0.00</h5>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" class="btn-close btn-close-white" id="btnClosePagoPresupuesto" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-body" style="padding: 20px; background: #f8f9fa; overflow-y: auto; overflow-x: hidden; flex: 1;">
                        <form id="formPagoPresupuesto">
                            <input type="hidden" id="id_user_pago" name="userId" value="<?php echo isset($_SESSION['id_user']) ? $_SESSION['id_user'] : ''; ?>">
                            <input type="hidden" id="pago_nro_ticket_hidden" name="nro_ticket">
                            <input type="hidden" id="pago_serial_pos_hidden" name="serial_pos">
                         
                            <!-- MONTO ABONADO SECTION -->
                            <div class="row mb-3">
                                <!-- Card: Monto del Presupuesto -->
                                <div class="col-6">
                                    <div class="payment-summary-card" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3); height: 100%;">
                                        <h6 id="labelMontoPresupuesto" style="color: white; margin-bottom: 10px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Monto Presupuesto</h6>
                                        <h3 id="montoPresupuestoDisplay" style="color: white; font-size: 1.8rem; font-weight: 700; margin: 0;">$0.00</h3>
                                    </div>
                                </div>
                                
                                <!-- Card: Monto Abonado -->
                                <div class="col-6">
                                    <button type="button" class="btn w-100" id="btnSincronizarExoneracion" style="background: linear-gradient(135deg, #da1b60 0%, #ff8a00 100%); color: white; border-radius: 12px; padding: 12px; font-weight: 700; border: none; box-shadow: 0 4px 15px rgba(218, 27, 96, 0.3); transition: all 0.3s ease;">
                            <i class="fas fa-save me-2"></i>Guardar Exoneración
                        </button>
                                </div>
                            </div>

                            <!-- SECCIÓN DEDICADA PARA EXONERACIÓN (INFORMATIVA) -->
                            <div class="row mb-3" id="exonerationSection" style="display: none;">
                                <div class="col-12">
                                    <div class="card border-0 shadow-sm" style="background: rgba(255, 81, 47, 0.05); border: 1px dashed #FF512F !important; border-radius: 12px; padding: 10px 15px;">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div class="d-flex align-items-center">
                                                <div style="background: #FF512F; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                                    <i class="fas fa-percent" style="font-size: 0.9rem;"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-0 fw-bold" style="font-size: 0.8rem; color: #2c3e50; text-transform: uppercase; letter-spacing: 0.5px;">Desglose de Exoneración</h6>
                                                    <p id="exonerationDetailText" class="mb-0 text-muted" style="font-size: 0.85rem;"></p>
                                                </div>
                                            </div>
                                            <div class="text-end">
                                                <span class="badge" style="background: #FF512F; color: white; padding: 6px 12px; border-radius: 6px; font-weight: 600;" id="exonerationAmountText"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- BLOQUE 1: INFORMACIÓN DEL CLIENTE -->
                             <div class="form-section">
                                <div class="form-section-header">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-circle me-2" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>
                                    <h6 class="form-section-title" style="color: black;">Información del Cliente</h6>
                                </div>
                                <div class="row g-2">
                                     <div class="col-md-6 mb-2">
                                        <label for="displayRazonSocial" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-building me-1 text-primary" viewBox="0 0 16 16"><path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/><path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/></svg>Razón Social
                                        </label>
                                        <input type="text" class="form-control bg-light" id="displayRazonSocial" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="displayRif" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                        </label>
                                        <input type="text" class="form-control bg-light" id="displayRif" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                </div>
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="serialPosPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-barcode me-1 text-primary" viewBox="0 0 16 16"><path d="M1 11.107V4.893C1 4.4 1.398 4 1.889 4H14.11C14.6 4 15 4.398 15 4.893v6.214C15 11.6 14.602 12 14.111 12H1.89C1.4 12 1 11.602 1 11.107ZM1.889 5v6h12.222V5H1.889Z"/><path d="M2 5v6h1V5H2Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1ZM11 5v6h1V5h-1Zm1.5 0v6h1V5h-1Zm1.5 0v6h1V5h-1Z"/></svg>Serial POS
                                        </label>
                                        <input type="text" class="form-control bg-light" id="serialPosPago" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                     <div class="col-md-6 mb-2">
                                        <label for="displayEstatusPos" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-broadcast-pin me-1 text-primary" viewBox="0 0 16 16"><path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656 0a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 0 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.122a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.314.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>Estatus POS
                                        </label>
                                        <input type="text" class="form-control bg-light" id="displayEstatusPos" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                    </div>
                                </div>
                            </div>

                            <!-- BLOQUE 2: INFORMACIÓN DE PAGO -->
                            <div class="form-section">
                                <div class="form-section-header d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>
                                         <h6 class="form-section-title me-3" style="color: black; margin-bottom: 0;">Información de Pago</h6>
                                    </div>
                                     <!-- Tasa del Día Integrada -->
                                    <div class="tasa-display" style="padding: 5px 12px;">
                                        <div class="text-end">
                                            <span class="text-muted d-block" id="fechaTasaDisplay" style="font-size: 0.7rem;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-calendar-day me-1" viewBox="0 0 16 16"><path d="M4.684 11.523v-2.3h2.261v-.61H4.684V6.801h2.464v-.61H4V11.523h.684Zm3.296 0h.676V8.98c0-.554.227-1.007.953-1.007.125 0 .258.004.329.015v-.613a1.806 1.806 0 0 0-.254-.02c-.582 0-.891.32-.934.71h-.027v-.672h-.643v4.131Z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg><?php echo date('d/m/Y'); ?>
                                            </span>
                                            <span class="tasa-value d-block" id="tasaDisplayValue" style="font-size: 1rem; margin-top: 0;">
                                                Cargando...
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <style>
                                    .currency-suffix {
                                        position: absolute;
                                        right: 15px;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        color: #6c757d;
                                        font-weight: 500;
                                        pointer-events: none;
                                        font-size: 0.9rem;
                                    }
                                    
                                    /* Ensure disabled amount fields have consistent styling */
                                    #montoBs:disabled,
                                    #montoRef:disabled {
                                        background-color: #e9ecef;
                                        cursor: not-allowed;
                                        border-color: #ced4da;
                                        opacity: 1 !important;
                                        color: #6c757d !important;
                                    }
                                    
                                    #montoBs:disabled:focus,
                                    #montoRef:disabled:focus {
                                        border-color: #ced4da !important;
                                        box-shadow: none !important;
                                        outline: none !important;
                                    }
                                </style>
                                <div class="row g-2 mt-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="fechaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-calendar-event me-1 text-primary" viewBox="0 0 16 16"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>Fecha Pago <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="date" class="form-control" id="fechaPago" placeholder="dd/mm/aaaa" required style="font-size: 0.95rem; padding: 8px 12px;" onchange="loadExchangeRateToday(this.value);" onclick="loadExchangeRateToday(this.value);">
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
                                        <label for="montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-cash me-1 text-primary" viewBox="0 0 16 16"><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Monto Bs
                                        </label>
                                        <div class="position-relative">
                                            <input type="number" class="form-control" id="montoBs" step="0.01" placeholder="0.00" disabled style="font-size: 0.95rem; padding: 8px 12px; padding-right: 40px; background-color: #e9ecef; cursor: not-allowed;">
                                            <span class="currency-suffix" id="montoBsSuffix" style="display: none;">Bs</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-left-right me-1 text-primary" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>Monto REF
                                        </label>
                                        <div class="position-relative">
                                            <input type="number" class="form-control" id="montoRef" step="0.01" placeholder="0.00" disabled style="font-size: 0.95rem; padding: 8px 12px; padding-right: 40px; background-color: #e9ecef; cursor: not-allowed;">
                                            <span class="currency-suffix" id="montoRefSuffix" style="display: none;">USD</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-hash me-1 text-primary" viewBox="0 0 16 16"><path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.125 0 .257-.012.387-.03.512-.073.89-.457.89-1.012 0-.579-.344-.954-.833-1.012l-.082-.007h-1.273l.33-1.587c.017-.077.025-.15.025-.225 0-.335-.224-.543-.532-.543-.298 0-.511.171-.577.502l-.339 1.853H7.833l.33-1.587c.017-.077.026-.15.026-.225 0-.335-.225-.543-.532-.543-.298 0-.512.171-.578.502l-.339 1.853H5.3l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587Z"/></svg>Referencia <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="text" class="form-control" id="referencia" placeholder="Número de referencia" pattern="[0-9]*" inputmode="numeric" required style="font-size: 0.95rem; padding: 8px 12px;">
                                    </div>
                                </div>
                                
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-person me-1 text-primary" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>Depositante <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="text" class="form-control" id="depositante" placeholder="Nombre del depositante" required style="font-size: 0.95rem; padding: 8px 12px;">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-sticky me-1 text-primary" viewBox="0 0 16 16"><path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H10a1.5 1.5 0 0 0-1.5 1.5v3.5H2.5a.5.5 0 0 1-.5-.5zm7 8V9.5a.5.5 0 0 1 .5-.5h3.5z"/></svg>Obs. Administración <span>*</span>
                                        </label>
                                        <input type="text" class="form-control" id="obsAdministracion" placeholder="Observaciones de administración" style="font-size: 0.95rem; padding: 8px 12px;">
                                    </div>
                                    <input type="hidden" id="estatus" value="">
                                    <input type="hidden" id="payment_id_to_save" name="payment_status">
                                </div>


                                
                                <!-- Información Adicional Integrada (Registro, Fecha Carga) -->
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label for="registro" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-book me-1 text-primary" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.933-.575-2.203-.923-3.41-.811-1.144.106-2.191.46-2.823.71V2.828A5 5 0 0 1 3.5 2c.421 0 .817.027 1.168.077zM11.5 2c.656 0 1.323.058 1.958.163.633.105 1.15.257 1.484.414l.058.03v9.553c-.333-.157-.851-.31-1.484-.414A14.3 14.3 0 0 0 11.5 12c-1.207 0-2.477.106-3.41.811V3.13c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v-.441zm0-1c-1.39 0-2.72.311-3.911.812A9.2 9.2 0 0 0 4.5 1c-1.54 0-3.04.347-4.13.795A1 1 0 0 0 0 2.715v10.928a.5.5 0 0 0 .708.453c1.16-.547 2.65-.923 4.292-.821C6.273 13.376 7.5 14 8 14s1.727-.624 3.003-1.272c1.642-.102 3.132.274 4.29.821a.5.5 0 0 0 .707-.453V2.716a1 1 0 0 0-.37-.716A11.7 11.7 0 0 0 11.5 1"/></svg>Registro
                                        </label>
                                        <input type="text" class="form-control" id="registro" placeholder="Generado autom." readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; cursor: not-allowed;">
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label for="fechaCarga" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-calendar-check me-1 text-primary" viewBox="0 0 16 16"><path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>Fecha carga <span style="color: #dc3545;">*</span>
                                        </label>
                                        <input type="date" class="form-control" id="fechaCarga" required readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef; cursor: not-allowed;">
                                    </div>
                                </div>

                                <!-- Bancos and Pago Movil Fields Hidden by Default -->
                                <div class="row g-2" id="bancoFieldsContainer" style="display: none;">
                                    <div class="col-md-6 mb-2">
                                        <label for="bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco Origen
                                        </label>
                                        <select class="form-select" id="bancoOrigen" required style="font-size: 0.95rem; padding: 8px 12px;">
                                            <option value="">Seleccione</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-2">
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
                                            <div class="card border-success" style="border-width: 1px;">
                                                <div class="card-header bg-success text-white py-2">
                                                    <h6 class="mb-0" style="font-size: 0.9rem; font-weight: 600;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/></svg>Origen
                                                    </h6>
                                                </div>
                                                <div class="card-body p-3">
                                                    <div class="mb-2" style="display: none;">
                                                        <label for="origenRifTipo" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                                        </label>
                                                        <div class="d-flex gap-2">
                                                            <select class="form-select" id="origenRifTipo" style="font-size: 0.9rem; padding: 6px 10px; width: 30%;">
                                                                <option value="">Tipo</option>
                                                                <option value="J">J</option>
                                                                <option value="V">V</option>
                                                                <option value="E">E</option>
                                                                <option value="G">G</option>
                                                                <option value="P">P</option>
                                                            </select>
                                                            <input type="text" class="form-control" id="origenRifNumero" placeholder="Número RIF" pattern="[0-9]*" inputmode="numeric" style="font-size: 0.9rem; padding: 6px 10px; width: 70%;">
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
                                            <div class="card border-primary" style="border-width: 1px;">
                                                <div class="card-header bg-primary text-white py-2">
                                                    <h6 class="mb-0" style="font-size: 0.9rem; font-weight: 600;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.293L5.354 7.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.793z"/></svg>Destino
                                                    </h6>
                                                </div>
                                                <div class="card-body p-3">
                                                    <div class="mb-2">
                                                        <label for="destinoRifTipo" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF
                                                        </label>
                                                        <div class="d-flex gap-2">
                                                            <select class="form-select" id="destinoRifTipo" required disabled style="font-size: 0.9rem; padding: 6px 10px; width: 30%; background-color: #e9ecef;">
                                                                <option value="">Tipo</option>
                                                                <option value="J" selected>J</option>
                                                                <option value="V">V</option>
                                                                <option value="E">E</option>
                                                                <option value="G">G</option>
                                                                <option value="P">P</option>
                                                            </select>
                                                            <input type="text" class="form-control" id="destinoRifNumero" placeholder="Número RIF" pattern="[0-9]*" inputmode="numeric" required value="002916150" readonly style="font-size: 0.9rem; padding: 6px 10px; width: 70%; background-color: #e9ecef;">
                                                        </div>
                                                    </div>
                                                    <div class="mb-2">
                                                        <label for="destinoTelefono" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Nro. Telefónico
                                                        </label>
                                                        <input type="text" class="form-control" id="destinoTelefono" placeholder="Ej: 0412-1234567" pattern="[0-9\-]*" inputmode="numeric" required value="04122632231" readonly style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef;">
                                                    </div>
                                                    <div>
                                                        <label for="destinoBanco" class="form-label fw-semibold mb-1" style="font-size: 0.85rem;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco
                                                        </label>
                                                        <select class="form-select" id="destinoBanco" required disabled style="font-size: 0.9rem; padding: 6px 10px; background-color: #e9ecef;">
                                                            <option value="">Seleccione</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- BLOQUE INTERMEDIO: SOPORTE DIGITAL (PREMIUM UNIFIED STYLE) -->
                            <div class="form-section mt-4" style="border: none; padding: 0; background: transparent;">
                                <h6 class="mb-3" style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: #64748b; letter-spacing: 1.2px; display: flex; align-items: center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cloud-upload me-2" viewBox="0 0 16 16" style="vertical-align: middle; margin-top: -2px;">
                                        <path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.508 4.56a4.5 4.5 0 1 1-1.122 8.835l.23-.974a3.5 3.5 0 1 0-.965-6.837l-.234.027c-.046-.01-.09-.022-.132-.033-.424-.111-.83-.166-1.226-.166-1.554 0-2.83 1.054-3.15 2.454l-.234.027a3 3 0 0 0-2.43 2.502H3a1 1 0 0 0-1-1c0-.422.25-.78.614-.945a.5.5 0 1 0-.414-.91A2 2 0 0 1 3 13.5h.341l.23-.974H3a1.5 1.5 0 0 1 0-3h.341l.23-.974A3.5 3.5 0 0 1 4.406 1.342Z"/><path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/></svg>
                                    Soporte Digital
                                </h6>

                                <div class="row g-2">
                                    <div class="col-12">
                                        <div class="upload-container text-center" id="pago_upload_wrapper" style="position: relative; border-radius: 20px; transition: all 0.3s ease;">
                                            <input type="file" class="form-control" id="pago_documentFile" name="documentoPago" accept="image/*,.pdf" style="display: none;">
                                            
                                            <!-- Drop Zone -->
                                            <label for="pago_documentFile" class="exo-file-drop-zone p-5" id="pago_fileDropZone">
                                                <div class="mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" stroke-width="1.5">
                                                       <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                                                       <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                    </svg>
                                                </div>
                                                <span class="d-block mb-1" id="textDocumentoPago" style="font-size: 1.3rem; font-weight: 800; color: #475569 !important; letter-spacing: -0.5px;">Adjunte el Documento de Pago</span>
                                                <span class="d-block" style="font-size: 1rem; font-weight: 600; color: #94a3b8 !important;">JPG, PNG o PDF (Máx. 5MB)</span>
                                            </label>

                                            <!-- Vista Previa Premium -->
                                            <div id="pago_fileStatusContainer" class="d-none w-100 text-center animate__animated animate__fadeIn p-2">
                                                <div class="d-flex align-items-center p-3 shadow-sm mx-auto" style="max-width: 95%; background: #ffffff; border: 1px solid #d1fae5; border-radius: 16px;">
                                                    <div class="file-icon-bg me-3" style="background: #ecfdf5; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#059669" class="bi bi-file-earmark-check" viewBox="0 0 16 16"><path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
                                                    </div>
                                                    <div class="text-start flex-grow-1 overflow-hidden">
                                                        <p id="pago_fileNameText" class="mb-0 fw-bold text-dark text-truncate" style="font-size: 0.85rem; letter-spacing: -0.2px;">archivo.pdf</p>
                                                        <div class="d-flex align-items-center">
                                                            <span class="badge rounded-pill me-2" style="background: #10b981; font-size: 0.65rem; font-weight: 700;">PDF / IMG</span>
                                                            <small class="text-success fw-bold" style="font-size: 0.7rem;">Listo para actualizar</small>
                                                        </div>
                                                    </div>
                                                    <button type="button" id="btn_clear_pago_file" class="btn btn-sm btn-light rounded-circle shadow-sm ms-2" style="width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; transition: all 0.2s ease;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#64748b" stroke-width="2.5">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- BLOQUE 3: HISTORIAL DE PAGOS -->
                            <div class="form-section mt-3">
                                <div class="form-section-header">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-clock-history me-2" viewBox="0 0 16 16"><path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .973.658a7 7 0 0 0-.306.452zM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m7.5-3a.5.5 0 0 1 1 0v2.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1 0-1h2.5z"/></svg>
                                    <h6 class="form-section-title">Historial de Pagos</h6>
                                </div>
                                <div class="table-responsive" style="max-height: 250px; overflow-y: auto; overflow-x: auto; border: 1px solid #dee2e6; border-radius: 4px;">
                                    <table class="table table-sm table-hover mb-0" id="paymentHistoryTable" style="font-size: 0.85rem;">
                                        <thead style="position: sticky; top: 0; background-color: #f8f9fa; z-index: 1;">
                                            <tr>
                                                <th style="padding: 8px; white-space: nowrap;">N°</th>
                                                <th style="padding: 8px; white-space: nowrap;">Registro</th>
                                                <th style="padding: 8px; white-space: nowrap;">Fecha Pago</th>
                                                <th style="padding: 8px; white-space: nowrap;">Método</th>
                                                <th style="padding: 8px; white-space: nowrap;">Moneda</th>
                                                <th style="padding: 8px; white-space: nowrap;">Monto Bs</th>
                                                <th style="padding: 8px; white-space: nowrap;">Monto Ref</th>
                                                <th style="padding: 8px; white-space: nowrap;">Referencia</th>
                                                <th style="padding: 8px; white-space: nowrap;">Depositante</th>
                                                 <th style="padding: 8px; white-space: nowrap;">Estatus</th>
                                                <th style="padding: 8px; white-space: nowrap;">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody id="paymentHistoryBody">
                                            <tr>
                                                <td colspan="11" class="text-center text-muted" style="padding: 20px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-info-circle me-1" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>No hay pagos registrados
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- BLOQUE 4: EXTRA (COMPACTO) -->
                            <div class="form-section container-extra mt-3" style="border: none; background: transparent; padding: 0; box-shadow: none;">
                                <div class="card border-light shadow-sm">
                                    <div class="card-header bg-light py-2">
                                        <h6 class="mb-0 text-dark" style="font-size: 0.95rem; font-weight: 600;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open me-2 text-primary" viewBox="0 0 16 16"><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184l7.925 3.048A1.5 1.5 0 0 1 15 8.5V13.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5zM2.5 3a.5.5 0 0 0-.5.5V13.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V8.5a.5.5 0 0 0-.171-.374l-7.925-3.047a.5.5 0 0 0-.511-.079H2.5z"/></svg>Documentos
                                        </h6>
                                    </div>
                                    <div class="card-body p-3">
                                        <button type="button" class="btn btn-outline-primary w-100" id="btnVerPresupuestoModal" title="Ver Documento de Presupuesto">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf me-2" viewBox="0 0 16 16"><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/><path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.193-.3.461-.507.848-.68.71-.315 1.488-.515 2.106-.6a.5.5 0 0 0 .151-.102c.28-.275.526-.644.69-1.074.242-.63.352-1.23.352-1.734 0-.39-.105-.72-.255-.95a.5.5 0 0 0-.442-.254.5.5 0 0 0-.472.33c-.115.357-.149.796-.114 1.243.018.226.048.491.092.778a6 6 0 0 1-.194 1.588c-.207.486-.479.8-.823 1.025-.33.215-.777.38-1.288.473-.396.074-.712.112-1.01.112a.8.8 0 0 1-.341-.053m2.234-2.822c-.524.1-.926.27-1.12.395-.145.093-.24.195-.28.262-.027.05-.034.1-.033.145.011.042.013.09.04.129.034.048.087.067.14.076a.3.3 0 0 0 .179-.011c.144-.055.439-.272.932-.741a2 2 0 0 0 .142-.25m-.356.643a6 6 0 0 0 .4-.6c-.1.018-.215.044-.334.078a6 6 0 0 0-.466.129 6 6 0 0 0 .4.393M7.667 7.202c-.04-.331-.051-.614-.031-.83a.54.54 0 0 1 .067-.247.3.3 0 0 1 .153-.1c.01-.003.02-.005.033-.005q.055 0 .094.046.06.072.062.247c0 .166-.045.52-.228 1.14-.01-.362-.01-.482 0-.251m3.153 3.53c.552-.617 1.256-1.128 1.847-1.429.231-.118.452-.211.662-.278.204-.066.398-.106.561-.106.183 0 .306.045.385.143q.099.12.04.4c-.04.189-.161.4-.343.585-.313.321-.937.64-1.768.95a15 15 0 0 0-1.384.532zM9.546 11.23a15 15 0 0 1 .947-.46q-.542.433-.947.714z"/></svg>Ver Documento de Presupuesto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-radius: 0 0 12px 12px; padding: 15px 25px; border-top: 1px solid #dee2e6; flex-shrink: 0;">
                    <button type="button" class="btn btn-secondary px-4" id="btnCancelarPagoPresupuesto" data-bs-dismiss="modal" style="font-size: 0.95rem; padding: 8px 20px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg me-2" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>Cancelar
                    </button>
                    <button type="button" class="btn btn-primary px-4" id="btnGuardarPagoPresupuesto" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; font-size: 0.95rem; padding: 8px 20px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg me-2" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.42-5.447a.733.733 0 0 1 1.047 0z"/></svg>Guardar Pago
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL PAGO PRESUPUESTO -->
    <!-- MODAL PARA VIZUALIZAR EL MODAL -->
        <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); z-index: 1100;">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="viewDocumentModalLabel"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-file-earmark-text me-2" viewBox="0 0 16 16"><path d="M5.5 7a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5M6.5 9a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/><path d="M8 0a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-.293-.707l-3-3A1 1 0 0 0 12 0zM14 4.5V14H2V2h8v2.5a.5.5 0 0 0 .5.5z"/></svg>Visualizando Documento - Ticket: <span id="viewModalTicketId"></span></h5>
                    </div>
                    <div class="modal-body text-center">
                        <h6 id="NombreImage" class="mb-1" style="color: black; font-weight: 700;"></h6>
                        <p id="SubtituloDocumento" class="text-muted mb-3" style="font-size: 0.85rem;"></p>
                        <div id="viewDocumentMessage" class="alert alert-warning hidden" role="alert"></div>
                        <img id="imageViewPreview" class="img-fluid" alt="Previsualización de la imagen" style="display: none;">
                        <div id="pdfViewViewer" style="width: 100%; height: 70vh; display: none;"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="CerrarModalVizualizar">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    <!-- END MODAL PARA VIZUALIZAR EL MODAL -->

    <!-- MODAL PARA SELECCIONAR EL MOTIVO DE RECHAZO -->
        <div class="modal fade" id="modalRechazo" tabindex="-1" aria-labelledby="modalRechazoLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="modalRechazoLabel"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-left-x me-2" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M7.066 4.76a1.65 1.65 0 0 0 0 2.481l1.192 1.192a.5.5 0 1 0 .707-.707L7.773 6.535a.65.65 0 0 1 0-.919l1.192-1.192a.5.5 0 1 0-.707-.707z"/></svg>Motivo de Rechazo</h5>
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
                    <h5 class="modal-title" id="modalConfirmacionRechazoLabel"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-circle me-2" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/></svg>Confirmar Rechazo de Documento</h5>
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

    <!-- MODAL EDITAR PAGO -->
    <!-- MODAL REGISTRO EXONERACION -->
    <div class="modal fade" id="modalRegistroExoneracion" tabindex="-1" aria-labelledby="modalRegistroExoneracionLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content" style="border-radius: 15px; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.3);">
                <div class="modal-header" style="background: linear-gradient(135deg, #ff8a00 0%, #da1b60 100%); color: white; padding: 20px 25px; border: none; position: relative;">
                    <div class="d-flex align-items-center">
                        <div class="bg-white p-2 rounded-circle me-3" style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#da1b60" class="bi bi-file-earmark-check" viewBox="0 0 16 16">
                                <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                            </svg>
                        </div>
                        <div>
                            <h5 class="modal-title mb-0" id="modalRegistroExoneracionLabel" style="color: white; font-weight: 700; letter-spacing: 0.5px;">Detalles de Exoneración</h5>
                            <small id="subtituloExo" style="opacity: 0.9;">Ticket #00000000</small>
                        </div>
                    </div>
                    <button type="button" class="btn-close-custom" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body" style="background: white; padding: 30px;">
                    <form id="formRegistroExoneracion">
                        <input type="hidden" id="exo_ticket_id" name="ticketId">
                        <input type="hidden" id="exo_nro_ticket" name="nro_ticket">
                        <input type="hidden" id="exo_serial_pos" name="serial_pos">
                        <input type="hidden" id="exo_id_intelipunto" name="id_intelipunto">
                        <input type="hidden" id="exo_tipo_seleccionado" name="tipo_exoneracion" value="Anticipo">

                        <!-- Bloque Informativo Premium (Se llena dinámicamente si hay límite alcanzado) -->
                        <div id="exo_limit_info_container"></div>

                        <h6 class="text-muted mb-3 font-weight-bold" id="btnTipoPagoTaller" style="text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">Tipo de Exoneración</h6>
                        <div class="exoneration-type-group">
                            <div class="exoneration-type-btn active" data-type="Anticipo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cash-coin" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/>
                                    <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.039-1.329-1.129V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z"/>
                                    <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h.308c.191.05.39.091.597.122V1h12v.122c.207-.031.406-.071.597-.122H15a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"/>
                                    <path d="M14 12.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1 0-1H7a.5.5 0 0 1 .5.5"/>
                                </svg>
                                Anticipo
                            </div>
                            <div class="exoneration-type-btn" data-type="Pago taller">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                                    <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.427h1.01a1 1 0 0 1 .808.409l1.49 2.038a4.4 4.4 0 0 0 6.645 0l1.49-2.038a1 1 0 0 1 .808-.409h1.01a1 1 0 0 0 .815-.427L16 0h-3l-1.1 1.02a1 1 0 0 1-1.142.181l-1.04-.647a1 1 0 0 0-1.055-.006l-1.04.647a1 1 0 0 1-1.142-.181L5 0zM5 7l2 5h2l2-5V5L9 9l-2-4z"/>
                                </svg>
                                Pago taller
                            </div>
                        </div>

                        <div class="percentage-slider-container">
                            <h6 class="text-muted font-weight-bold mb-4" style="text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">Porcentaje Aplicado</h6>
                            <div class="percentage-display" id="exo_porcentaje_valor">100%</div>
                            <input type="range" class="custom-range" id="exo_slider" name="porcentaje" min="0" max="100" value="100" disabled style="cursor: not-allowed; opacity: 0.7;">
                            <div class="d-flex justify-content-between mt-2 px-1">
                                <span class="text-muted small">0%</span>
                                <span class="text-muted small">25%</span>
                                <span class="text-muted small">50%</span>
                                <span class="text-muted small">75%</span>
                                <span class="text-muted small">100%</span>
                            </div>
                        </div>

                        <h6 class="text-muted mb-2 font-weight-bold" style="text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">Código de Exoneración (Auto)</h6>
                        <div class="exo-code-container">
                            <div class="exo-code-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-qr-code-scan" viewBox="0 0 16 16">
                                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm1 1v1h1v-1H4zM4.5 9a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2zM5 10h1v1H5v-1zm5.5-1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2zM11 10h1v1h-1v-1zM9 4.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm1 1v1h1v-1h-1z"/>
                                </svg>
                            </div>
                            <div class="exo-code-value" id="exo_nro_generado">Exo0000-0000</div>
                            <input type="hidden" id="exo_nro_hidden" name="nro_exoneracion">
                        </div>

                        <!-- Sección: Soporte Digital -->
                        <h6 class="mb-3" style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: #64748b; letter-spacing: 1.2px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cloud-upload me-2" viewBox="0 0 16 16" style="vertical-align: middle; margin-top: -2px;">
                                <path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.508 4.56a4.5 4.5 0 1 1-1.122 8.835l.23-.974a3.5 3.5 0 1 0-.965-6.837l-.234.027c-.046-.01-.09-.022-.132-.033-.424-.111-.83-.166-1.226-.166-1.554 0-2.83 1.054-3.15 2.454l-.234.027a3 3 0 0 0-2.43 2.502H3a1 1 0 0 0-1-1c0-.422.25-.78.614-.945a.5.5 0 1 0-.414-.91A2 2 0 0 1 3 13.5h.341l.23-.974H3a1.5 1.5 0 0 1 0-3h.341l.23-.974A3.5 3.5 0 0 1 4.406 1.342Z"/><path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
                            </svg>Soporte Digital
                        </h6>
                        <div class="exo-upload-container">
                            <input type="file" id="exo_documentFile" name="documentoSoporte" accept="image/*,.pdf" style="display: none;">
                            <label for="exo_documentFile" class="exo-file-drop-zone" id="exo_fileDropZone">
                                <div class="mb-3" id="exo_iconDoc">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                    </svg>
                                </div>
                                <span class="d-block mb-1" id="exo_textDoc" style="font-size: 1.3rem; font-weight: 800; color: #475569 !important; letter-spacing: -0.5px;">Adjunte el Documento de Soporte</span>
                                <span class="d-block" style="font-size: 1rem; font-weight: 600; color: #94a3b8 !important;">JPG, PNG o PDF (Máx. 5MB)</span>
                            </label>
                            <div id="exo_fileStatus" class="d-none w-100 text-center animate__animated animate__fadeIn mt-2">
                                <div class="d-flex align-items-center p-3 shadow-sm mx-auto" style="max-width: 95%; background: #ffffff; border: 1px solid #d1fae5; border-radius: 16px;">
                                    <div class="file-icon-bg me-3" style="background: #ecfdf5; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#059669" class="bi bi-file-earmark-check" viewBox="0 0 16 16"><path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
                                    </div>
                                    <div class="text-start flex-grow-1 overflow-hidden">
                                        <p id="exo_fileName" class="mb-0 fw-bold text-dark text-truncate" style="font-size: 0.85rem; letter-spacing: -0.2px;">archivo.pdf</p>
                                        <div class="d-flex align-items-center">
                                            <span class="badge rounded-pill me-2" style="background: #10b981; font-size: 0.65rem; font-weight: 700;">PDF / IMG</span>
                                            <small class="text-success fw-bold" style="font-size: 0.7rem;">Listo para actualizar</small>
                                        </div>
                                    </div>
                                    <button type="button" id="btn_clear_exo_file" class="btn btn-sm btn-light rounded-circle shadow-sm ms-2" style="width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; transition: all 0.2s ease;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#64748b" stroke-width="2.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button type="button" class="btn w-100 mt-3" id="btnSincronizarExoneracion" style="background: linear-gradient(135deg, #da1b60 0%, #ff8a00 100%); color: white; border-radius: 12px; padding: 12px; font-weight: 700; border: none; box-shadow: 0 4px 15px rgba(218, 27, 96, 0.3); transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="me-2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                            Guardar Exoneración
                        </button>
                    </form>

                    <!-- MODAL EDITAR EXONERACIÓN -->
                    <!-- MODAL EDITAR EXONERACIÓN - PREMIUM DESIGN -->
                    <div class="modal fade" id="modalEditExoneracion" tabindex="-1" aria-labelledby="modalEditExoneracionLabel" aria-hidden="true" style="background-color: rgba(15, 23, 42, 0.7); backdrop-filter: blur(15px);">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content" style="border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden; background: #ffffff;">
                                <div class="modal-header d-flex align-items-center justify-content-between" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; border: none; padding: 25px 30px; position: relative;">
                                    <div class="d-flex align-items-center">
                                        <div class="header-icon-bg me-3" style="background: rgba(255,255,255,0.2); width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </div>
                                        <div>
                                            <h5 class="modal-title mb-0" id="modalEditExoneracionLabel" style="font-weight: 800; letter-spacing: -0.5px; font-size: 1.25rem;">Editar Exoneración</h5>
                                            <p class="mb-0 text-white-50" style="font-size: 0.75rem; font-weight: 500;">Ajuste los valores y soporte digital</p>
                                        </div>
                                    </div>
                                    <button type="button" id="btnCloseEditExoneracion" class="btn-close-premium" aria-label="Close" style="background: rgba(255, 255, 255, 0.2); border: none; border-radius: 12px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; cursor: pointer;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1 0-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </button>
                                </div>
                                <div class="modal-body" style="padding: 35px 30px; background: #ffffff;">
                                    <form id="formEditExoneracion">
                                        <input type="hidden" id="edit_id_exoneracion" name="id_exoneracion">
                                        
                                        <div class="mb-4">
                                            <label class="form-label fw-bold text-uppercase text-muted mb-2" style="font-size: 0.7rem; letter-spacing: 1px;">Tipo de Exoneración</label>
                                            <div class="input-group">
                                                <span class="input-group-text border-0" style="background: #f8fafc; color: #64748b; border-radius: 12px 0 0 12px;"><i class="fas fa-tag"></i></span>
                                                <input type="text" class="form-control border-0" id="edit_tipo_exoneracion" name="tipo_exoneracion" readonly style="background: #f8fafc; border-radius: 0 12px 12px 0; font-weight: 700; color: #1e293b; padding: 12px;">
                                            </div>
                                        </div>
 
                                        <div class="mb-5">
                                            <div class="d-flex justify-content-between align-items-center mb-3">
                                                <label class="form-label fw-bold text-uppercase text-muted m-0" style="font-size: 0.7rem; letter-spacing: 1px;">Porcentaje Aplicado</label>
                                                <span id="edit_porcentaje_badge" class="badge rounded-pill px-3 py-2" style="background: #ecfdf5; color: #059669; font-size: 0.95rem; font-weight: 800; border: 1px solid #d1fae5;">100%</span>
                                            </div>
                                            <div class="range-container p-2" style="background: #f1f5f9; border-radius: 16px;">
                                                <input type="range" class="form-range custom-premium-range" id="edit_porcentaje_slider" name="porcentaje" min="0" max="100" value="100" style="cursor: pointer; height: 6px;">
                                            </div>
                                        </div>
 
                                        <div class="mb-0">
                                            <label class="form-label fw-bold text-uppercase text-muted mb-2" style="font-size: 0.7rem; letter-spacing: 1px;">Documento de Soporte</label>
                                            <div class="text-center">
                                                <input type="file" class="form-control" id="edit_documentFile" name="documentoSoporte" accept="image/*,.pdf" style="display: none;">
                                                
                                                <label for="edit_documentFile" id="edit_upload_area" class="upload-zone d-flex flex-column align-items-center justify-content-center p-4" style="border: 2px dashed #e2e8f0; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; background: #fafafa; min-height: 160px; position: relative; overflow: hidden; width: 100%;">
                                                    <div id="edit_upload_initial" class="text-center">
                                                        <div class="icon-box mb-3 mx-auto" style="width: 56px; height: 56px; background: #f1f5f9; border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#64748b" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                        </div>
                                                        <span class="d-block fw-bold text-dark" style="font-size: 0.95rem;">Subir nuevo archivo</span>
                                                        <span class="text-muted d-block mt-1" style="font-size: 0.75rem;">Arrastre aquí o haga clic para buscar</span>
                                                    </div>
 
                                                    <!-- Vista Previa de Selección (Oculta por defecto) -->
                                                    <div id="edit_upload_preview" class="d-none w-100 text-center animate__animated animate__fadeIn">
                                                        <div class="d-flex align-items-center p-3 shadow-sm mx-auto" style="max-width: 95%; background: #ffffff; border: 1px solid #d1fae5; border-radius: 16px;">
                                                            <div class="file-icon-bg me-3" style="background: #ecfdf5; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#059669" class="bi bi-file-earmark-check" viewBox="0 0 16 16"><path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
                                                            </div>
                                                            <div class="text-start flex-grow-1 overflow-hidden">
                                                                <p id="edit_fileNameDisplay" class="mb-0 fw-bold text-dark text-truncate" style="font-size: 0.85rem; letter-spacing: -0.2px;">nombre_del_archivo.pdf</p>
                                                                <div class="d-flex align-items-center">
                                                                    <span class="badge rounded-pill me-2" style="background: #10b981; font-size: 0.65rem; font-weight: 700;">PDF / IMG</span>
                                                                    <small class="text-success fw-bold" style="font-size: 0.7rem;">Listo para actualizar</small>
                                                                </div>
                                                            </div>
                                                            <button type="button" id="btn_clear_edit_file" class="btn btn-sm btn-light rounded-circle shadow-sm ms-2" style="width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; transition: all 0.2s ease;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#64748b" stroke-width="2.5">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer" style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px;">
                                    <button type="button" id="btnCancelEditExoneracion" class="btn btn-light px-4 py-2 fw-bold text-secondary border-0" style="border-radius: 12px; font-size: 0.9rem; background: #e2e8f0;">Cancelar</button>
                                    <button type="button" class="btn btn-success px-5 py-2 fw-bold shadow-sm" id="btnGuardarEdicionExo" style="border-radius: 12px; font-size: 0.9rem; background: #10b981; border: none; min-width: 180px; transition: all 0.3s ease;">
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- MODAL VISUALIZAR SOPORTE EXONERACION -->
                    <div class="modal fade" id="modalViewExoSupport" tabindex="-1" aria-labelledby="modalViewExoSupportLabel" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content" style="border-radius: 16px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.3); overflow: hidden;">
                                <div class="modal-header" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; border-radius: 16px 16px 0 0; border: none; padding: 18px 25px;">
                                    <h5 class="modal-title mb-0 d-flex align-items-center" id="modalViewExoSupportLabel" style="font-weight: 600; color: white;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-file-earmark-text me-2" viewBox="0 0 16 16">
                                            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                                            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v3.75a.5.5 0 0 0 .5.5H14zM3 2a1 1 0 0 1 1-1h5.5v3.5A1.5 1.5 0 0 0 11 6h3.5V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                                        </svg>
                                        Vista Previa del Soporte
                                    </h5>
                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body p-0" style="background: #f1f5f9; min-height: 400px; display: flex; align-items: center; justify-content: center;">
                                    <div id="viewExoSupportLoader" class="text-center d-none">
                                        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                                            <span class="visually-hidden">Cargando...</span>
                                        </div>
                                        <p class="mt-2 fw-bold text-muted">Recuperando soporte...</p>
                                    </div>
                                    <img id="viewExoSupportImg" src="" class="img-fluid d-none" style="object-fit: contain; max-height: 80vh; width: 100%;">
                                    <iframe id="viewExoSupportPdf" src="" class="d-none" style="width: 100%; height: 80vh; border: none;"></iframe>
                                    <div id="viewExoSupportError" class="d-none text-center p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ef4444" class="bi bi-file-earmark-x mb-3" viewBox="0 0 16 16">
                                            <path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293z"/>
                                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                                        </svg>
                                        <h6 class="text-dark fw-bold">No se encontró el archivo</h6>
                                        <p class="text-muted small">El soporte solicitado no existe o no está disponible en la base de datos.</p>
                                    </div>
                                </div>
                                <div class="modal-footer" style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 15px 25px;">
                                    <button type="button" class="btn btn-secondary px-4 fw-bold" data-bs-dismiss="modal" style="border-radius: 10px;">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <div class="history-section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#333" class="bi bi-clock-history" viewBox="0 0 16 16">
                                <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.131a7 7 0 0 0-.179-.301zm.45 2.012a7 7 0 0 0 .057-.81l.997-.06a8 8 0 0 1 .126.935l-.977.126a7 7 0 0 0-.112-.39a7 7 0 0 0-.091-.19a7 7 0 0 0-.145-.145zm1.534 1.838a7 7 0 0 0-.796-.653l.576-.818a8 8 0 0 1 .91.747l-.69.724zm.71 1.37a7 7 0 0 0-.27-.439l.789-.615a8 8 0 0 1 .654.979l-.87.493a7 7 0 0 0-.302-.418zm.45 2.004a7 7 0 0 0-.299-.985l.933-.36c.142.366.256.743.342 1.126l-.976.219zM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1m0-1a8 8 0 1 1 0 16A8 8 0 0 1 8 0"/>
                                <path d="M9 11l-3-3 3-3V11z"/>
                            </svg>
                            Historial de Exoneraciones
                        </div>
                        <div class="table-responsive" style="max-height: 200px; border-radius: 10px; border: 1px solid #eee;">
                            <table class="table table-sm table-hover align-items-center mb-0 text-center">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Tipo</th>
                                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Porcentaje</th>
                                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nro. Exoneracion</th>
                                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Fecha</th>
                                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estatus</th>
                                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="historyExonerationBody">
                                    <!-- Dinámico -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="editPaymentModal" tabindex="-1" aria-labelledby="editPaymentModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div class="modal-header bg-gradient-primary" style="color: white; border-radius: 12px 12px 0 0; padding: 15px 25px;">
                    <h5 class="modal-title mb-0" id="editPaymentModalLabel" style="font-weight: 600; color: white;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square me-2" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>Editar Pago
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding: 20px; background: #f8f9fa;">
                    <form id="formEditPayment">
                        <input type="hidden" id="edit_payment_id">
                        
                        <!-- BLOQUE 1: INFORMACIÓN DE PAGO -->
                        <div class="form-section">
                            <div class="form-section-header">
                                <h6 class="form-section-title" style="color: black; margin-bottom: 0;">Detalles del Pago</h6>
                            </div>

                            <div class="row g-2 mt-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_fechaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-calendar-event me-1 text-primary" viewBox="0 0 16 16"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>Fecha Pago
                                    </label>
                                    <input type="date" class="form-control" id="edit_fechaPago">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_formaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-credit-card me-1 text-primary" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></svg>Forma pago <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="edit_formaPago" required>
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_moneda" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin me-1 text-primary" viewBox="0 0 16 16"><path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.606v-.706c1.318-.094 2.074-.815 2.074-1.84 0-1.027-.664-1.59-1.983-1.84l-.521-.102v-2.04c.592.063.977.371 1.056.896h.695c-.073-.914-.847-1.562-2.103-1.645V4h-.606v.681c-1.188.084-1.815.713-1.815 1.591 0 .872.613 1.408 1.612 1.622l.466.1v2.281c-.563-.064-.974-.361-1.064-.927zm2.467-3.791c-.53.116-.835.418-.835.83 0 .413.293.689.835.818v-1.648zM8.235 10.3c.595-.122.946-.439.946-.867 0-.416-.299-.7-.946-.822v1.689z"/><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/></svg>Moneda <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="edit_moneda" required>
                                        <option value="bs">Bolívares (Bs)</option>
                                        <option value="usd">Dólares (USD)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-cash me-1 text-primary" viewBox="0 0 16 16"><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>Monto Bs
                                    </label>
                                    <input type="number" class="form-control" id="edit_montoBs" step="0.01">
                                </div>
                            </div>

                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-left-right me-1 text-primary" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>Monto REF
                                    </label>
                                    <input type="number" class="form-control" id="edit_montoRef" step="0.01">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-hash me-1 text-primary" viewBox="0 0 16 16"><path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.125 0 .257-.012.387-.03.512-.073.89-.457.89-1.012 0-.579-.344-.954-.833-1.012l-.082-.007h-1.273l.33-1.587c.017-.077.025-.15.025-.225 0-.335-.224-.543-.532-.543-.298 0-.511.171-.577.502l-.339 1.853H7.833l.33-1.587c.017-.077.026-.15.026-.225 0-.335-.225-.543-.532-.543-.298 0-.512.171-.578.502l-.339 1.853H5.3l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587c-.017.077-.025.15-.025.225 0 .335.224.543.532.543.298 0 .512-.171.577-.502l.339-1.853h1.37l-.33 1.587Z"/></svg>Referencia <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="edit_referencia" required>
                                </div>
                            </div>
                            
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-person me-1 text-primary" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>Depositante <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="edit_depositante" required>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-sticky me-1 text-primary" viewBox="0 0 16 16"><path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H10a1.5 1.5 0 0 0-1.5 1.5v3.5H2.5a.5.5 0 0 1-.5-.5zm7 8V9.5a.5.5 0 0 1 .5-.5h3.5z"/></svg>Obs. Administración
                                    </label>
                                    <input type="text" class="form-control" id="edit_obsAdministracion">
                                </div>
                            </div>

                            <!-- Bancos -->
                            <div class="row g-2" id="edit_bancoFieldsContainer">
                                <div class="col-md-6 mb-2">
                                    <label for="edit_bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank me-1 text-primary" viewBox="0 0 16 16"><path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.499.499 0 0 1-.485.62H.5a.499.499 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.89zM3.777 3h8.447L8 1.11zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h2.5V6zm3.5 0v7h1V6zM1.5 14l-.25 1h13.5l-.25-1z"/></svg>Banco Origen
                                    </label>
                                    <select class="form-select" id="edit_bancoOrigen">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="edit_bancoDestino" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                    <select class="form-select" id="edit_bancoDestino">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Mobile Payment Fields -->
                            <div class="row g-2 mt-2" id="edit_pagoMovilFieldsContainer" style="display: none;">
                                <div class="col-md-6 mb-2">
                                     <label class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-card-list me-1 text-primary" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A1.5 1.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>RIF Origen
                                    </label>
                                    <input type="text" class="form-control" id="edit_origenRifNumero" placeholder="Número RIF">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone me-1 text-primary" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.256.487.7.34 1.12l-.593 2.37a.75.75 0 0 0 .194.707l2.191 2.191a.75.75 0 0 0 .708.194l2.37-.593c.42-.105.864.053 1.12.34l2.307 2.307a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034a2.745 2.745 0 0 1-3.907.03 21.6 21.6 0 0 1-5.224-5.224 2.745 2.745 0 0 1 .03-3.907z"/></svg>Teléfono Origen
                                    </label>
                                    <input type="text" class="form-control" id="edit_origenTelefono" placeholder="0412-1234567">
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-radius: 0 0 12px 12px; padding: 15px 25px;">
                    <button type="button" class="btn btn-secondary px-4" id="btnCancelEditPayment">Cancelar</button>
                    <button type="button" class="btn btn-primary px-4" id="btnUpdatePayment">Actualizar Pago</button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL EDITAR PAGO -->

    <!--button type="button" class="btn btn-primary" id="reassignTicketBtn" data-ticket-id="2">
        <i class="bi bi-person-gear"></i> Reasignar Ticket
    </button-->

    <!-- MODAL SUSTITUIR DATOS DE PAGO (Reemplazo completo - mismo flujo que Tecnico) -->
    <div class="modal fade" id="modalSustituirPago" tabindex="-1" aria-labelledby="modalSustituirPagoLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 95vh; display: flex; flex-direction: column;">
                <div class="modal-header" style="background: linear-gradient(135deg, #e8850a, #f6a623); color: white; border-radius: 12px 12px 0 0; padding: 15px 25px; flex-shrink: 0;">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <h5 class="modal-title mb-0" id="modalSustituirPagoLabel" style="font-weight: 600; font-size: 1.3rem;">
                            <i class="fas fa-money-bill-wave me-2"></i>Sustituir Datos de Pago
                        </h5>
                        <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 10px 15px; min-width: 180px;">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-dollar-sign me-2"></i>
                                <div>
                                    <small style="opacity: 0.9; font-size: 0.75rem; display: block;">Monto Referencia</small>
                                    <h5 class="mb-0 fw-bold" id="sust_montoEquipo" style="font-size: 1.1rem;">$0.00</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-body" style="padding: 20px; background: #f8f9fa; overflow-y: auto; flex: 1;">
                    <form id="formSustituirPago">
                        <input type="hidden" id="sust_id_user_pago" name="userId" value="<?php echo isset($_SESSION['id_user']) ? $_SESSION['id_user'] : ''; ?>">
                        <input type="hidden" id="sust_nro_ticket_pago" name="nro_ticket_pago">
                        <input type="hidden" id="sust_id_ticket_pago" name="id_ticket_pago">
                        <input type="hidden" id="sust_id_payment_record_loading" name="id_payment_record_loading">
                        <input type="hidden" id="sust_document_type_pago" name="document_type_pago">
                        <input type="hidden" id="sust_registro" name="registro">

                        <!-- Sección: Información del Cliente -->
                        <div class="form-section shadow-sm mb-4" style="background: #fff; border-radius: 8px; border-left: 4px solid #f6a623; padding: 15px;">
                            <div class="form-section-header" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 10px;">
                                <i class="fas fa-user-circle" style="color: #667eea; margin-right: 8px;"></i>
                                <h6 class="form-section-title d-inline-block m-0 fw-bold" style="color: #495057;">Información del Cliente</h6>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_displayRazonSocial" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-building me-1 text-primary"></i>Razón Social
                                    </label>
                                    <input type="text" class="form-control bg-light" id="sust_displayRazonSocial" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_displayRif" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-id-card me-1 text-primary"></i>RIF
                                    </label>
                                    <input type="text" class="form-control bg-light" id="sust_displayRif" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_serialPosPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-barcode me-1 text-primary"></i>Serial POS
                                    </label>
                                    <input type="text" class="form-control bg-light" id="sust_serialPosPago" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_displayEstatusPos" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-signal me-1 text-primary"></i>Estatus POS
                                    </label>
                                    <input type="text" class="form-control bg-light" id="sust_displayEstatusPos" readonly style="font-size: 0.95rem; padding: 8px 12px; font-weight: 500;">
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Información de Pago -->
                        <div class="form-section shadow-sm mb-4" style="background: #fff; border-radius: 8px; border-left: 4px solid #f6a623; padding: 15px;">
                            <div class="form-section-header" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 10px;">
                                <i class="fas fa-money-bill-wave" style="color: #667eea; margin-right: 8px;"></i>
                                <h6 class="form-section-title d-inline-block m-0 fw-bold" style="color: #495057;">Información de Pago</h6>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_fechaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-calendar-alt me-1 text-primary"></i>Fecha Pago <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="date" class="form-control" id="sust_fechaPago" required style="font-size: 0.95rem; padding: 8px 12px;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_formaPago" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-credit-card me-1 text-primary"></i>Forma pago <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="sust_formaPago" required style="font-size: 0.95rem; padding: 8px 12px;">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_moneda" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-coins me-1 text-primary"></i>Moneda <span style="color: #dc3545;">*</span>
                                    </label>
                                    <select class="form-select" id="sust_moneda" required style="font-size: 0.95rem; padding: 8px 12px;">
                                        <option value="">Seleccionar</option>
                                        <option value="bs">Bolívares (Bs)</option>
                                        <option value="usd">Dólares (USD)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_estatus_pago_visual" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-info-circle me-1 text-primary"></i>Estatus
                                    </label>
                                    <input type="text" class="form-control" id="sust_estatus_pago_visual" placeholder="Estatus del pago" readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef;">
                                </div>
                            </div>
                            <!-- Banco Fields (Transferencia) -->
                            <div class="row g-2" id="sust_bancoFieldsContainer" style="display: none;">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_bancoOrigen" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-university me-1 text-primary"></i>Banco Origen
                                    </label>
                                    <select class="form-select" id="sust_bancoOrigen" style="font-size: 0.95rem; padding: 8px 12px;">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_bancoDestino" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-building me-1 text-primary"></i>Banco Destino
                                    </label>
                                    <select class="form-select" id="sust_bancoDestino" style="font-size: 0.95rem; padding: 8px 12px;">
                                        <option value="">Seleccione</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Montos y Referencias -->
                        <div class="form-section shadow-sm mb-4" style="background: #fff; border-radius: 8px; border-left: 4px solid #f6a623; padding: 15px;">
                            <div class="form-section-header d-flex justify-content-between align-items-center" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 10px;">
                                <div>
                                    <i class="fas fa-exchange-alt" style="color: #667eea; margin-right: 8px;"></i>
                                    <h6 class="form-section-title d-inline-block m-0 fw-bold" style="color: #495057;">Montos y Referencias</h6>
                                </div>
                                <div class="tasa-display" style="background: linear-gradient(135deg, #e8850a, #f6a623); padding: 5px 12px; border-radius: 6px; box-shadow: 0 2px 4px rgba(232, 133, 10, 0.3);">
                                    <div class="text-end text-white">
                                        <small id="sust_fechaTasaDisplay" style="font-size: 0.75rem; opacity: 0.9;">Tasa: --</small>
                                        <h5 class="mb-0 fw-bold tasa-value" id="sust_tasaDisplayValue" style="font-size: 1.1rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">Cargando...</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_montoBs" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Monto Bs</label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="sust_montoBs" step="0.01" placeholder="0.00" style="font-size: 0.95rem;" readonly>
                                        <span class="input-group-text" style="font-size: 0.85rem; background-color: #f8f9fa;">Bs</span>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_montoRef" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Monto REF</label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="sust_montoRef" step="0.01" placeholder="0.00" style="font-size: 0.95rem;" readonly>
                                        <span class="input-group-text" style="font-size: 0.85rem; background-color: #f8f9fa;">USD</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_referencia" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Referencia <span style="color: #dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="sust_referencia" placeholder="Número de referencia" required style="font-size: 0.95rem;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_depositante" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Depositante <span style="color: #dc3545;">*</span></label>
                                    <input type="text" class="form-control" id="sust_depositante" placeholder="Nombre del depositante" required style="font-size: 0.95rem;">
                                </div>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-6 mb-2">
                                    <label for="sust_registro_visual" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-book me-1 text-primary"></i>Registro
                                    </label>
                                    <input type="text" class="form-control" id="sust_registro_visual" placeholder="Generado autom." readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef;">
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label for="sust_fechaCarga" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">
                                        <i class="fas fa-calendar-check me-1 text-primary"></i>Fecha carga <span style="color: #dc3545;">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="sust_fechaCarga" readonly style="font-size: 0.95rem; padding: 8px 12px; background-color: #e9ecef;">
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Soporte Digital (PREMIUM UNIFIED STYLE) -->
                        <div class="form-section shadow-sm mb-4" style="background: transparent; border: none; padding: 0;">
                            <h6 class="mb-3" style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: #64748b; letter-spacing: 1.2px; display: flex; align-items: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cloud-arrow-up me-2" viewBox="0 0 16 16" style="color: #64748b;"><path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/><path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/></svg>
                                Soporte Digital
                            </h6>

                            <div class="row g-2">
                                <div class="col-12">
                                    <div class="upload-container text-center" id="sust_upload_wrapper" style="position: relative; border-radius: 20px; transition: all 0.3s ease;">
                                        <input type="file" id="sust_documentFile" accept="image/*,.pdf" style="display: none;">
                                        
                                        <!-- Drop Zone -->
                                        <label for="sust_documentFile" class="exo-file-drop-zone p-5" id="sust_fileDropZone">
                                            <div class="mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" stroke-width="1.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                </svg>
                                            </div>
                                            <span class="d-block mb-1" style="font-size: 1.3rem; font-weight: 800; color: #475569 !important; letter-spacing: -0.5px;">Adjunte el Nuevo Comprobante</span>
                                            <span class="d-block" style="font-size: 1rem; font-weight: 600; color: #94a3b8 !important;">JPG, PNG o PDF (Máx. 5MB)</span>
                                        </label>

                                        <!-- Vista Previa Premium -->
                                        <div id="sust_fileStatusContainer" class="d-none w-100 text-center animate__animated animate__fadeIn p-2">
                                            <div class="d-flex align-items-center p-3 shadow-sm mx-auto" style="max-width: 95%; background: #ffffff; border: 1px solid #d1fae5; border-radius: 16px;">
                                                <div class="file-icon-bg me-3" style="background: #ecfdf5; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#059669" class="bi bi-file-earmark-check" viewBox="0 0 16 16"><path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
                                                </div>
                                                <div class="text-start flex-grow-1 overflow-hidden">
                                                    <p id="sust_fileNameText" class="mb-0 fw-bold text-dark text-truncate" style="font-size: 0.85rem; letter-spacing: -0.2px;">archivo.pdf</p>
                                                    <div class="d-flex align-items-center">
                                                        <span class="badge rounded-pill me-2" style="background: #10b981; font-size: 0.65rem; font-weight: 700;">PDF / IMG</span>
                                                        <small class="text-success fw-bold" style="font-size: 0.7rem;">Listo para actualizar</small>
                                                    </div>
                                                </div>
                                                <button type="button" id="btn_clear_sust_file" class="btn btn-sm btn-light rounded-circle shadow-sm ms-2" style="width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; transition: all 0.2s ease;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#64748b" stroke-width="2.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Observaciones -->
                        <div class="form-section shadow-sm mb-4" style="background: #fff; border-radius: 8px; border-left: 4px solid #f6a623; padding: 15px;">
                            <div class="form-section-header" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 15px; padding-bottom: 10px;">
                                <i class="fas fa-info-circle" style="color: #667eea; margin-right: 8px;"></i>
                                <h6 class="form-section-title d-inline-block m-0 fw-bold" style="color: #495057;">Información Adicional</h6>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-12 mb-2">
                                    <label for="sust_obsAdministracion" class="form-label fw-semibold mb-1" style="font-size: 0.9rem;">Obs. Administración</label>
                                    <textarea class="form-control" id="sust_obsAdministracion" rows="2" placeholder="Observaciones de administración" style="font-size: 0.95rem; resize: vertical;"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-radius: 0 0 12px 12px; padding: 15px 25px;">
                    <button type="button" class="btn btn-secondary px-4" id="btnCancelarSustituirPago">
                        <i class="fas fa-times me-2"></i>Cancelar
                    </button>
                    <button type="button" class="btn btn-warning px-4" id="btnGuardarSustituirPago" style="background: linear-gradient(135deg, #f6a623 0%, #e8850a 100%); border: none; color: white;">
                        <i class="fas fa-exchange-alt me-2"></i>Sustituir Pago
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- END MODAL SUSTITUIR DATOS DE PAGO -->

    <input type="hidden" id="id_user" value="<?php echo $_SESSION['id_user'] ?? ''; ?>"/>

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
                    // Cache buster usando timestamp para asegurar que el usuario vea los cambios de frontEnd.js
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
        <!-- =============================================
             MODAL: Editar Solicitud Administrativa
             ============================================= -->
        <div class="modal fade" id="editAdminReqModal" tabindex="-1" aria-labelledby="editAdminReqModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content" style="border-radius:16px; border:none; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.2);">

              <!-- Header -->
                <div class="modal-header" style="background: linear-gradient(135deg, #1a6dff 0%, #6a11cb 100%); border:none; padding:20px 28px;">
                    <div>
                    <h5 class="modal-title mb-0" id="editAdminReqModalLabel" style="color:#fff; font-weight:700; font-size:1.1rem;">
                        <i class="bi bi-pencil-fill me-2"></i> Editar Solicitud
                    </h5>
                    <small id="editAdminReqSubtitle" style="color:rgba(255,255,255,0.75); font-size:0.82rem;"></small>
                    </div>
                </div>

                <!-- Body -->
                <div class="modal-body p-4" style="background:#f8fafc;">
                    <input type="hidden" id="editReqId">
                    <input type="hidden" id="editReqNro">

                    <div class="row g-3">

                    <!-- Tipo de Solicitud (solo lectura, informativo) -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold" style="font-size:0.85rem; color:#475569;">
                        <i class="bi bi-tag me-1"></i> Tipo de Solicitud
                        </label>
                        <input type="text" id="editReqTipo" class="form-control" readonly
                        style="background:#e2e8f0; border-radius:10px; border:none; font-size:0.9rem;">
                    </div>

                    <!-- Razón Social (solo lectura) -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold" style="font-size:0.85rem; color:#475569;">
                        <i class="bi bi-building me-1"></i> Razón Social
                        </label>
                        <input type="text" id="editReqRazon" class="form-control" readonly
                        style="background:#e2e8f0; border-radius:10px; border:none; font-size:0.9rem;">
                    </div>

                    <!-- Observación (editable) -->
                    <div class="col-12">
                        <label class="form-label fw-semibold" style="font-size:0.85rem; color:#475569;">
                        <i class="bi bi-chat-left-text me-1"></i> Observación
                        <span class="text-danger">*</span>
                        </label>
                        <textarea id="editReqObservacion" class="form-control" rows="4"
                        placeholder="Describa la observación de la solicitud..."
                        style="border-radius:10px; border:1px solid #cbd5e1; resize:vertical; font-size:0.9rem;"></textarea>
                        <div class="invalid-feedback">La observación es obligatoria.</div>
                    </div>

                    <!-- Sección: Soporte Digital (PREMIUM STYLE) -->
                    <div class="col-12 mt-2">
                        <label class="form-label fw-bold text-uppercase text-muted mb-2" style="font-size: 0.75rem; letter-spacing: 1px;">
                            <i class="bi bi-paperclip me-1"></i> Soporte Digital
                        </label>
                        <div class="upload-container text-center" id="editReqUploadWrapper" style="position: relative;">
                            <input type="file" id="editReqFile" name="support_file" accept="image/*,.pdf" style="display: none;">
                            
                            <!-- Drop Zone -->
                            <label for="editReqFile" class="exo-file-drop-zone p-4" id="editReqFileDropZone" style="min-height: 150px; border-radius: 16px;">
                                <div class="mb-2" id="editReqIconDoc">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                    </svg>
                                </div>
                                <span class="d-block mb-1" id="editReqTextDoc" style="font-size: 1.1rem; font-weight: 800; color: #475569 !important; letter-spacing: -0.5px;">Adjunte el Documento</span>
                                <span class="d-block text-muted" style="font-size: 0.85rem; font-weight: 500;">
                                    <i class="bi bi-info-circle me-1"></i> Archivos permitidos: JPG, PNG o PDF (Máx. 10MB)
                                </span>
                            </label>

                            <!-- Vista Previa Selección -->
                            <div id="editReqFileStatus" class="d-none w-100 text-center animate__animated animate__fadeIn">
                                <div id="editReqFileStatusCard" class="d-flex align-items-center p-3 shadow-sm mx-auto" style="max-width: 100%; background: #ffffff; border: 1px solid #d1fae5; border-radius: 16px;">
                                    <div id="editReqFileIconBg" class="file-icon-bg me-3" style="background: #ecfdf5; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <div id="editReqFileIcon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#059669" class="bi bi-file-earmark-check" viewBox="0 0 16 16"><path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
                                        </div>
                                    </div>
                                    <div class="text-start flex-grow-1 overflow-hidden">
                                        <p id="editReqFileName" class="mb-0 fw-bold text-dark text-truncate" style="font-size: 0.85rem; letter-spacing: -0.2px;">archivo.pdf</p>
                                        <div class="d-flex align-items-center">
                                            <span id="editReqFileBadge" class="badge rounded-pill me-2" style="background: #10b981; font-size: 0.65rem; font-weight: 700;">PDF / IMG</span>
                                            <small id="editReqStatusText" class="text-success fw-bold" style="font-size: 0.7rem;">Listo para actualizar</small>
                                        </div>
                                    </div>
                                    <button type="button" id="btn_clear_editReq_file" class="btn btn-sm btn-light rounded-circle shadow-sm ms-2" style="width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; transition: all 0.2s ease;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#64748b" stroke-width="2.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- /row -->

                <!-- Alerta de resultado -->
                <div id="editReqAlert" class="alert mt-3 d-none" role="alert" style="border-radius:10px;"></div>
              </div>

              <!-- Footer -->
              <div class="modal-footer" style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:16px 28px;">
                <button type="button" id="CloseEditReqModal" class="btn btn-outline-secondary" data-bs-dismiss="modal" style="border-radius:10px; font-size:0.85rem;">
                  Cancelar
                </button>
                <button type="button" id="editReqSaveBtn"
                  style="
                    display:inline-flex; align-items:center; gap:8px;
                    padding:9px 22px;
                    background:linear-gradient(135deg,#1a6dff 0%,#6a11cb 100%);
                    color:#fff; border:none; border-radius:10px;
                    font-size:0.88rem; font-weight:600; cursor:pointer;
                    box-shadow:0 4px 14px rgba(26,109,255,0.4);
                    transition:all 0.25s ease;
                  "
                  onmouseover="this.style.opacity='0.9'"
                  onmouseout="this.style.opacity='1'">
                  <i class="bi bi-save2-fill"></i> Guardar Cambios
                </button>
              </div>

            </div>
          </div>
        </div>
        <!-- END MODAL Editar Solicitud -->

    </body>

</html>