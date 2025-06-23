<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vista de Consulta</title>
    <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/consultationGeneral/laptop/general.css"/>
    <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/consultationGeneral/Desktop/general.css"/>
    <link rel="stylesheet" type="text/css" href="<?php echo APP;?>app/plugins/css/consultationGeneral/mobile/general.css"/>
    <script>
        const ENDPOINT_BASE = '<?php echo ENDPOINT_BASE_DYNAMIC; ?>';
        const APP_PATH = '<?php echo APP_BASE_PATH; ?>';
    </script>
</head>
<body>
    <div class="identifying-text">Soporte Post-Venta</div>
    <div class="consulta-container">
        <header class="consulta-header">
            <div id="animacion-carga" class="animando">
                <div class="icono-consulta">
                    <img src="<?php echo APP;?>app/public/img/login/Logo.png" width="36px" height="36px">
                </div>
                <h1>Resultados de la Consulta</h1>
                <p class="subtitulo-consulta">Información detallada encontrada en la base de datos.</p>
            </div>
        </header>
        <div class="filtros-consulta">
            <h3>Opciones de Filtrado</h3>
            <form id="formulario-filtros">
                <div class="campo-filtro">
                    <label for="campo1">Dato:</label>
                    <input type="text" id="campo1" name="campo1" >
                </div>
                <div class="campo-filtro">
                    <label for="campo2">Proceso de:</label>
                    <input type="text" id="campo2" name="campo2" >
                </div>
                <button type="button" class="boton-filtrar" onclick="SendDataSearching()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                        <path d="M3 57c10.9 0 20.7 7 25.7 17.9L187.8 298.3c6.2 6.2 16.4 6.2 22.6 0L483 74.9c5-10.9 14.8-17.9 25.7-17.9H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H50.1L262.3 393.7c-6.2 6.2-16.4 6.2-22.6 0L3 90.9C-2 80 5.1 73 16 73H48c10.9 0 20.7 7 25.7 17.9zM496 416c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16s7.2-16 16-16H480c8.8 0 16 7.2 16 16z"/>
                    </svg>
                    Filtrar
                </button>
            </form>
        </div>
        <div class="resultados-consulta">
            <h2>Datos Encontrados</h2>
            <table class="tabla-resultados">
                <thead>
                    <tr>
                        <th>ID Ticket</th>
                        <th>Razón Social</th>
                        <th>RIF Comercio</th>
                        <th>Serial POS</th>
                        <th>Falla</th>
                        <th>Fecha de Creación</th>
                        <th>Estatus</th>
                        <th>Acción</th>
                        <th>Técnico</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div class="no-resultados oculto">
                <p>No se encontraron resultados con los criterios de búsqueda.</p>
            </div>
        </div>

        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->
            <div class="modal fade" id="viewDocumentModal" tabindex="-1" aria-labelledby="viewDocumentModalLabel"
                aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <strong>
                                <h5 class="modal-title text-lg font-semibold text-gray-800" id="viewDocumentModalLabel">
                                    Documento para Ticket: <span id="viewModalTicketId"></span></h5>
                            </strong>
                            <button type="button" class="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3 text-center">
                                <img id="imageViewPreview" class="img-fluid" src="#" alt="Previsualización de Imagen"
                                    style="max-width: 100%; height: auto; display: none;">
                                <div id="pdfViewViewer"
                                    style="width: 100%; height: 600px; display: none; border: 1px solid #ddd;"></div>
                            </div>
                            <div id="viewDocumentMessage" class="message-box hidden text-center mt-3"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="modalCerrarshow" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        <!--MODAL PARA VIZUALIZAR EL DOCUMENTO DE ENVIO A DESTIN0-->

        <!--footer class="consulta-footer">
            <p></p>
        </footer-->
    </div>
    <?php
        if (isset($this->js)){
            foreach ($this->js as $js){
                echo '<script type="text/javascript" src="'.APP.'app/views/'.$js.'"></script>'; 
            }
        }
    ?>
</body>
</html>