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
<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
    <link rel="icon" type="image/png" href="../assets/img/favicon.png">
    <title>
        <?php echo tituloPagina; ?> - Afiliaciones Suiche 7B
    </title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-icons.css?v=<?php echo $this->staticAssetVersion('app/plugins/css/dashboard/nucleo-icons.css'); ?>" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/dashboard/nucleo-svg.css?v=<?php echo $this->staticAssetVersion('app/plugins/css/dashboard/nucleo-svg.css'); ?>" />
    <link rel="stylesheet" type="text/css" href="<?php echo APP; ?>app/plugins/css/General.css?v=<?php echo $this->staticAssetVersion('app/plugins/css/General.css'); ?>" />

    <script>
        const ENDPOINT_BASE = '<?php echo ENDPOINT_BASE_DYNAMIC; ?>';
        const APP_PATH = '<?php echo APP_BASE_PATH; ?>';
    </script>

    <style>
        /* Columnas de ancho fijo para que el contenido (sobre todo Seriales,
           que puede traer varios seriales separados por coma) haga wrap en
           vez de desbordar la tabla o la tarjeta, igual que en Prestamo de POS. */
        #suiche7bListadoTable {
            table-layout: fixed;
            width: 100%;
        }
        #suiche7bListadoTable td,
        #suiche7bListadoTable th {
            white-space: normal;
            word-break: break-word;
            vertical-align: middle;
        }
    </style>
</head>

<body id="fondo" class="g-sidenav-show bg-gray-100">
    <div class="min-height-300 bg-dark position-absolute w-100"></div>
    <?php
        require_once 'app/core/components/navbar/index.php';
        mi_navbar();
    ?>
    <main class="main-content position-relative border-radius-lg">
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card" style="border-radius: 20px; border: none; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden;">
                        <div class="p-4" style="background: linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%);">
                            <div class="d-flex align-items-center">
                                <div class="rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.4); backdrop-filter: blur(4px); flex-shrink: 0;">
                                    <i class="bi bi-phone-fill text-white fs-4"></i>
                                </div>
                                <div>
                                    <h5 class="text-white fw-bold mb-0" style="text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Afiliaciones Suiche 7B</h5>
                                    <p class="text-white mb-0" style="opacity: 0.95; font-size: 0.85rem; font-weight: 500;">Comercios ya afiliados por Inteligensa (banco/RIF/seriales/teléfono)</p>
                                </div>
                            </div>
                        </div>
                        <div class="p-4 bg-light">
                            <div class="d-flex mb-3" style="max-width: 480px;">
                                <input type="text" class="form-control me-2" id="suiche7bListadoBuscar" placeholder="Buscar por RIF o razón social...">
                                <button type="button" class="btn text-white" id="suiche7bListadoBuscarBtn" style="background: linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%); border: none;">Buscar</button>
                            </div>
                            <div id="suiche7bListadoLoading" class="text-muted small">Cargando afiliaciones...</div>
                            <div class="table-responsive">
                                <table class="table table-sm table-hover align-middle" id="suiche7bListadoTable" style="display: none;">
                                    <thead>
                                        <tr class="small text-uppercase text-muted">
                                            <th style="width: 10%;">RIF</th>
                                            <th style="width: 20%;">Razón Social</th>
                                            <th style="width: 12%;">Banco</th>
                                            <th style="width: 20%;">Seriales</th>
                                            <th style="width: 12%;">Teléfono</th>
                                            <th style="width: 14%;">Agente</th>
                                            <th style="width: 12%;">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody id="suiche7bListadoTbody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="<?php echo APP; ?>app/plugins/jquery/jquery.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery/jquery-3.5.1.js"></script>
    <script src="<?php echo APP; ?>app/plugins/jquery-easing/jquery.easing.min.js"></script>

    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.bundle.js"></script>
    <script src="<?php echo APP; ?>app/plugins/bootstrap/js/bootstrap.js"></script>

    <script src="<?php echo APP; ?>app/plugins/js/popper.min.js"></script>
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.js"></script>
    <script src="<?php echo APP; ?>app/plugins/sweetalert2/sweetalert2.all.js"></script>

    <?php
        if (isset($this->js)) {
            foreach ($this->js as $js) {
                echo '<script type="text/javascript" src="' . APP . 'app/views/' . $js . '?v=' . $this->assetVersion($js) . '"></script>';
            }
        }

        require 'app/footer.php';
    ?>
</body>
</html>
