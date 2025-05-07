<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../../../models/consulta_rifModel.php";
require_once __DIR__ . "/../../../../libs/database_cn.php";
require_once __DIR__ . "/../../../../config/paths.php"; // Incluye paths.php

// Función mi_navbar() para generar la barra de navegación
function mi_navbar() {

}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    $model = new consulta_rifModel();

    switch ($action) {
        /*case 'SearchRif':
            $rif = $_POST['rif']; // Obtiene el RIF del POST

            $result = $model->SearchRif($rif);
            //var_dump($result);  
            $rif = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $rif[] = $agente;
                //var_dump($agente);
            }


            if (!empty($rif)) {
                $response = [
                    'success' => true,
                    'rif' => $rif
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'No se encontraron usuarios'
                ];
            }
        break;

        case 'SearchSerial':
            $serial = $_POST['serial']; // Obtiene el RIF del POST

            $result = $model->SearchSerial($serial);
            //var_dump($result);
            $serial = [];

            for ($i = 0; $i < $result['numRows']; $i++) {
                $agente = pg_fetch_assoc($result['query'], $i);
                $serial[] = $agente;
                //var_dump($agente);
            }


            if (!empty($serial)) {
                $response = [
                    'success' => true,
                    'serial' => $serial
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'No se encontraron usuarios'
                ];
            }
        break;*/

        /*case 'GetInstallDate': // Nueva acción para obtener el conteo de usuarios
            $result = $model->GetInstallDate(); // Llama a la función en tu modelo
            //var_dump($result);
            $users = $result['row']['users']; // Accede directamente a 'users'

            if ($users !== false) {
                $response = [
                    'success' => true,
                    'count' => $users
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Error al obtener el conteo de usuarios'
                ];
            }
        break;*/

        case 'VerifingBranches': // Nueva acción para verificar las sucursales
            $rif = $_POST['rif'];
            $result = $model->VerifingBranches($rif);
           // var_dump($result);
            $estadoId = $result['row']['id_estado'];
            if($result) {
                // Obtener la región directamente aquí usando dblink
                $result1 = $model->GetRegionFromState($estadoId);
                //var_dump($result1);
                if($result1){  
                    $id_region = $result1['row']['id_region'];  
                    $response = [
                        'success' => true,
                        'id_region' => $id_region // Devuelve el array de resultados tal cual
                    ];
                }else{
                    $response = [
                        'success' => false, 
                        'id_region' => null
                    ]; // O algún otro valor indicando que no se encontró región
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'No se encontraron resultados de sucursales para el serial: ' . $rif
                ];
            }
        break;

        /*case 'GetFailure1':
            $result = $model->GetFailure1();
            if ($result !== false) {
                // Formatear el resultado como un array de objetos JSON
                for ($i = 0; $i < $result['numRows']; $i++) {
                    $agente = pg_fetch_assoc($result['query'], $i);
                    $failures[] = $agente;
                    //var_dump($agente);
                }

                $response = [
                    'success' => true,
                    'failures' => $failures // Enviar el array formateado
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Error al obtener las fallas'
                ];
            }
        break;*/

        /*case 'GetFailure2':
            $result = $model->GetFailure2();
            if ($result !== false) {
                // Formatear el resultado como un array de objetos JSON
                for ($i = 0; $i < $result['numRows']; $i++) {
                    $agente = pg_fetch_assoc($result['query'], $i);
                    $failures[] = $agente;
                    //var_dump($agente);
                }

                $response = [
                    'success' => true,
                    'failures' => $failures // Enviar el array formateado
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Error al obtener las fallas'
                ];
            }
        break;*/

        /*case 'ValidateRif':
            $rif = $_POST['rif'];
            if ($rif != '') {
                $result = $model->VerifingClient($rif);
                //var_dump($result);
                if ($result && $result['numRows'] > 0) {
                    $response = [
                        'success' => true,
                        'message' => 'El RIF Verificado',
                        'color'   => 'green',
                        'rif' => $result['row']['rif']
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'El RIF No Existe',
                        'color'=> 'red'

                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Error',
                    'color'=> 'red'
                ];
            }
        break;*/

        /*case 'ValidateRif1':
            $rif = $_POST['rif'];
            if ($rif != '') {
                $result = $model->VerifingClient($rif);
                //var_dump($result);
                if ($result && $result['numRows'] > 0) {
                    $response = [
                        'success' => true,
                        'message' => 'El RIF Verificado',
                        'color'   => 'green',
                        'rif' => $result['row']['rif']
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'El RIF No Existe',
                        'color'=> 'red'

                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Error',
                    'color'=> 'red'
                ];
            }
        break;*/

        /*case 'GetPosSerials':
            $rif = $_POST['rif'];
            if ($rif != '') {
                $result = $model->GetPosSerialsByRif(rif: $rif); // Llama a la función del modelo
                if ($result && isset($result['query']) && is_object($result['query'])) {
                    $serials = [];
                    $queryResult = $result['query'];
                    $numRows = pg_num_rows($queryResult);
                    for ($i = 0; $i < $numRows; $i++) {
                        $row = pg_fetch_assoc($queryResult, $i);
                        $serials[] = $row['serial']; // Almacena los seriales en el array
                    }
                    $response = [
                        'success' => true,
                        'serials' => $serials // Devuelve el array de seriales
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'ERROR',
                        'serials' => []
                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'RIF no proporcionado.',
                    'serials' => []
                ];
            }
        break;*/

        /*case 'GetPosSerials1':
            $rif = $_POST['rif'];
            if ($rif != '') {
                $result = $model->GetPosSerialsByRif(rif: $rif); // Llama a la función del modelo
                if ($result && isset($result['query']) && is_object($result['query'])) {
                    $serials = [];
                    $queryResult = $result['query'];
                    $numRows = pg_num_rows($queryResult);
                    for ($i = 0; $i < $numRows; $i++) {
                        $row = pg_fetch_assoc($queryResult, $i);
                        $serials[] = $row['serial']; // Almacena los seriales en el array
                    }
                    $response = [
                        'success' => true,
                        'serials' => $serials // Devuelve el array de seriales
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'ERROR',
                        'serials' => []
                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'RIF no proporcionado.',
                    'serials' => []
                ];
            }
        break;*/

        case 'GetPhoto':
            $serial = $_POST['serial'];
            $result = $model->SearchtypePos($serial);
            if ($result !== false) {
                $codmodelopos = $result['row']['codmodelopos'];
                //var_dump($codmodelopos);

                /*  AGREGAR CSS */
                $claseImagen = "imagen-predeterminada"; // Valor predeterminado
                switch ($codmodelopos) {
                    case 1:
                        $nombreArchivo = "ingenico-ict220.png";
                        $claseImagen = "ingenico-ict220";
                    break;

                    case 2:
                        $nombreArchivo = "ingenico-ict250.png";
                        $claseImagen = "ingenico-ict250";
                    break;

                    case 3:
                        $nombreArchivo = "ingenico-iwl220.png";
                        $claseImagen = "ingenico-iwl220";
                    break;

                    case 11:
                        $nombreArchivo = "move-2500.png";
                        $claseImagen = "move-2500";
                    break;

                    case 14:
                        $nombreArchivo = "sunmi-P2.png";
                        $claseImagen = "sunmi-P2";
                    break;

                    case 15:
                        $nombreArchivo = "sunmi-P2mini.png";
                        $claseImagen = "sunmi-P2mini";
                    break;

                    case 17:
                        $nombreArchivo = "sunmi-P2SE.png";
                        $claseImagen = "sunmi-P2SE";
                    break;

                    case 22:
                        $nombreArchivo = "Kozen-P10.png";
                        $claseImagen = "Kozen-P10";
                    break;

                    default:
                    $nombreArchivo = "mantainment.png";

                    break;
                }
                /* ENDF AGREGAR CSS */

                $rutaImagen = __DIR__ . "/../../../public/img/consulta_rif/POS/" . $nombreArchivo; // Ruta absoluta
                $tipoImagen = mime_content_type($rutaImagen);
                $datosImagen = file_get_contents($rutaImagen);
                $imagenBase64 = base64_encode($datosImagen);
                $srcImagen = "data:" . $tipoImagen . ";base64," . $imagenBase64;

                $response = [
                    'success' => true,
                    'id_tipopos' => $codmodelopos,
                    'rutaImagen' => $srcImagen, // Enviar la imagen codificada
                    'claseImagen' => $claseImagen // Añadir la clase CSS

                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Error al obtener el tipo del POS'
                ];
            }
        break;

        /*case 'SaveDataFalla':
            $serial = $_POST['serial'];
            $falla = $_POST['falla'];            
            $nivelFalla = $_POST['nivelFalla'];
            if($serial != ''){
                if($falla != ''){
                    if($nivelFalla != ''){
                        $result =  $model->SaveDataFalla( $serial, $falla, $nivelFalla);
                        //var_dump($result);
                        if ($result) {
                            $response = [
                                'success' => true,
                                'message' => 'Se guardaron los datos del Ticket correctamente.',
                            ];
                        } else {
                            $response = [
                                'success' => false, 
                                'message' => 'Error al guardar los datos de falla.'
                            ];
                        }
                    }else{
                        $response = [
                            'success'=> false,
                            'message'=> 'El campo Nivel de Falla no puede estar vacío.'
                        ];
                    }
                }else{
                    $response = [
                        'success'=> false,
                        'message'=> 'El campo Descripción no puede estar vacío.'
                    ];
                }
            }else{
                $response = [
                    'success'=> false,
                    'message'=> 'El campo Serial no puede estar vacío. Coloque un RIF para asociar el serial.'
                ];
            }
        break;*/

        /*case 'SaveDataFalla2':
            $serial            = $_POST['serial'];
            $descripcion       = $_POST['descrpFailure'];
            $coordinador       = $_POST['coordinador'];
            $nivelFalla        = $_POST['nivelFalla'];
            $rutaEnvio          = null;
            $rutaExo            = null;
            $rutaAnticipo       = null;
            $id_status_payment = $_POST['id_status_payment'];

            // Guardar archivo de envío
            if (isset($_FILES['archivoEnvio']) && $_FILES['archivoEnvio']['error'] === UPLOAD_ERR_OK) {
                $archivo = $_FILES['archivoEnvio'];
                $nombreArchivo = uniqid() . '_' . $archivo['name'];
                $rutaArchivo = 'C:\\Users\\Airan Bracamonte\\Downloads\\' . $nombreArchivo;
        
                if (move_uploaded_file($archivo['tmp_name'], $rutaArchivo)) {
                    $rutaEnvio = $rutaArchivo;
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Error al guardar el archivo.'
                    ];
                    break; // Salir del caso para evitar errores posteriores
                }
            }

            // Guardar archivo de exoneración (si se envió)
            if (isset($_FILES['archivoExoneracion']) && $_FILES['archivoExoneracion']['error'] === UPLOAD_ERR_OK) {
                $archivoExo = $_FILES['archivoExoneracion'];
                $nombreArchivoExo = uniqid() . '_' . $archivoExo['name'];
                $rutaArchivoExo = 'C:\\Users\\Airan Bracamonte\\Downloads\\' . $nombreArchivoExo; // Reemplaza con tu ruta

                if (move_uploaded_file($archivoExo['tmp_name'], $rutaArchivoExo)) {
                    $rutaExo = $rutaArchivoExo;
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Error al guardar el archivo de exoneración.'
                    ];
                    break;
                }
            }

             // Guardar archivo de anticipo (si se envió)
            if (isset($_FILES['archivoAnticipo']) && $_FILES['archivoAnticipo']['error'] === UPLOAD_ERR_OK) {
                $archivoAnticipo = $_FILES['archivoAnticipo'];
                $nombreArchivoAnticipo = uniqid() . '_' . $archivoAnticipo['name'];
                $rutaArchivoAnticipo = 'C:\\Users\\Airan Bracamonte\\Downloads\\' . $nombreArchivoAnticipo; // Reemplaza con tu ruta

                if (move_uploaded_file($archivoAnticipo['tmp_name'], $rutaArchivoAnticipo)) {
                    $rutaAnticipo = $rutaArchivoAnticipo;
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Error al guardar el archivo de anticipo.'
                    ];
                    break;
                }
            }
        
            if (empty($serial) || empty($descripcion) || empty($coordinador)) {
                $response = [
                    'success' => false,
                    'message' => 'Todos los campos son requeridos.'
                ];
                break; // Salir del caso para evitar errores posteriores
            }
            // Llama a tu modelo para guardar los datos
            $result = $model->SaveDataFalla2($serial, $descripcion, $nivelFalla, $coordinador, $rutaEnvio, $id_status_payment,  $rutaExo, $rutaAnticipo);
            var_dump($result);
            if (!$result) {
                $response = [
                    'success' => false,
                    'message' => 'Error al guardar los datos.'
                ];
            } else {
                $response = [
                    'success' => true,
                    'message' => 'Datos guardados con éxito.'
                ];
            }
        break;

       /* case 'GetUltimateTicket':
            $serial = $_POST['serial'];
            if ($serial != '') {
                $result = $model->UltimateDateTicket($serial);
                //var_dump($result);
                if ($result && pg_num_rows($result['query']) > 0) { // Verifica si hay resultados
                    $row = $result['row'];
                    $fecha = $row['ult_ticket']; // Asume que la columna se llama 'ult_ticket'
                    $response = [
                        'success' => true,
                        'fecha' => $fecha
                    ];
                } else {
                    $response = [
                        'success' => true,
                        'message' => 'No tiene ticket',
                        'fecha' => null // Devuelve null en lugar de "No tiene ticket"
                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Serial no proporcionado.'
                ];
            }
        break;*/

        /*case 'GetInstallPosDate':
            $serial = $_POST['serial'];
            if ($serial != '') {
                $result = $model->InstallDatePOS($serial);
                if ($result && pg_num_rows($result['query']) > 0) { // Verifica si hay resultados
                    $row = $result['row'];
                    $fecha = $row['inst_ticket']; // Asume que la columna se llama 'inst_ticket'
                    $response = [
                        'success' => true,
                        'fecha' => $fecha
                    ];
                } else {
                    $response = [
                        'success' => true,
                        'message' => 'No tiene ticket',
                        'fecha' => null // Devuelve null en lugar de "No tiene ticket"
                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Serial no proporcionado.'
                ];
            }
        break;*/

        
        /*case 'GetCoordinador':
            $result = $model->GetCoordinator();
            if ($result !== false) {
                // Formatear el resultado como un array de objetos JSON
                for ($i = 0; $i < $result['numRows']; $i++) {
                    $agente = pg_fetch_assoc($result['query'], $i);
                    $coordi[] = $agente;
                    //var_dump($agente);
                }

                $response = [
                    'success' => true,
                    'coordinadores' => $coordi // Enviar el array formateado
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Error al obtener las fallas'
                ];
            }
        break;
    }
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;*/
    }
}
?>