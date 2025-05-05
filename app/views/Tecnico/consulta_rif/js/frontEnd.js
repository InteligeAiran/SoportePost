//Llamar a la función PHP usando fetch    SESSION EXPIRE DEL USER
fetch('/SoportePost/app/controllers/consulta_rif.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
})
.then(response => response.json())
.then(data => {
    if (data.expired_sessions) {
        //alert(data.message);
        window.location.href = data.redirect;
    }

    // Agregar lógica de recarga automática con verificación
    if (data.sessionLifetime) {
        if (Number.isInteger(data.sessionLifetime)) {
            setTimeout(function() {
                location.reload(true); // Forzar recarga desde el servidor
            }, data.sessionLifetime * 1000); // sessionLifetime está en segundos
        } else {
            console.error("sessionLifetime no es un entero válido:", data.sessionLifetime);
        }
    }
})
.catch(error => {
    console.error('Error:', error);
});
//// END  SESSION EXPIRE DEL USER


function clearFormFields() {
    // Limpiar campos de Modal Nivel 2 (miModal)
    document.getElementById('FallaSelect2').value = '';
    document.getElementById('InputRif').value = '';
    document.getElementById('serialSelect').value = '';
    document.getElementById('AsiganrCoordinador').value = '';
    document.getElementById('FallaSelectt2').value = '2'; // Restablecer a Nivel 2 por defecto (o '')
    document.getElementById('EnvioInput').value = '';
    document.getElementById('ExoneracionInput').value = '';
    document.getElementById('AnticipoInput').value = '';

    // Limpiar campos de Modal Nivel 1 (miModal1)
    document.getElementById('FallaSelect1').value = '';
    document.getElementById('InputRif1').value = '';
    document.getElementById('serialSelect1').value = '';
    document.getElementById('FallaSelectt1').value = '1'; // Restablecer a Nivel 1 por defecto (o '')
}

/*function SendDataFailure1() {
    // Obtener el valor del botón "Nivel 1"
    const nivelFalla = document.getElementById('FallaSelectt1').value;
    // Obtener otros datos del modal (RIF, serial, descripción)
    const serial =  document.getElementById("serialSelect1").value; // Usar serialSelect
    const falla = document.getElementById('FallaSelect1').value;

    const xhr = new XMLHttpRequest();

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Asegúrate de que esto esté presente

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // **MOVER LA LÓGICA DEL CORREO AQUÍ**
                    const xhrEmail = new XMLHttpRequest();

                    xhrEmail.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                    xhrEmail.onload = function() {
                        if (xhrEmail.status === 200) {
                            const responseEmail = JSON.parse(xhrEmail.responseText);
                            // Puedes manejar la respuesta del envío de correo aquí si es necesario
                            console.log('Respuesta del envío de correo:', responseEmail);
                        } else {
                            console.error('Error al solicitar el envío de correo:', xhrEmail.status);
                        }
                    };

                    xhrEmail.onerror = function() {
                        console.error('Error de red al solicitar el envío de correo.');
                    };

                    xhrEmail.send(); // No necesitas enviar datos adicionales si tu backend ya tiene la información
                    // **FIN DE LA LÓGICA DEL CORREO**

                    Swal.fire({
                        icon: 'success',
                        title: 'Guardado exitoso',
                        text: response.message,
                        color: 'black',
                        timer: 2500,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        willClose: () => {
                            setTimeout(() => {
                                location.reload(); // Recarga la página después del temporizador
                            }, 1000);
                        }
                    });
                    $("#miModal1").css("display", "none"); // Cerrar modal
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al guardar',
                        text: response.message,
                        color: 'black'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar la respuesta',
                    text: error.message,
                    color: 'black'
                });
            }
        } else if (xhr.status === 400) {
            // El backend devolvió un error de "Bad Request" (campos vacíos)
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: response.message, // Mostrar el mensaje "Hay un campo vacio." del backend
                    color: 'black'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Error en la solicitud',
                    text: 'Se encontraron problemas con los datos enviados.',
                    color: 'black'
                });
            }
        } else if (xhr.status === 500) {
            // El backend devolvió un error interno del servidor
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error del servidor',
                    text: response.message, // Mostrar el mensaje "Error al guardar los datos de falla." del backend
                    color: 'black'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error del servidor',
                    text: 'Ocurrió un error al intentar guardar los datos.',
                    color: 'black'
                });
            }
        } else {
            // Otros errores de conexión o estados HTTP no manejados
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: `Ocurrió un error al comunicarse con el servidor. Código de estado: ${xhr.status}`,
                color: 'black'
            });
        }
    };

    xhr.onerror = function() {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            color: 'black'
        });
    };
    const datos = `action=SaveDataFalla&serial=${encodeURIComponent(serial)}&falla=${encodeURIComponent(falla)}&nivelFalla=${encodeURIComponent(nivelFalla)}`;
    xhr.send(datos);
}

/*function fetchSerialData(serial, detalleId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'app/views/Tecnico/consulta_rif/backEnd.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Identifica la tabla según el detalleId
    const tablaId = "serialCountTable" + (detalleId.charAt(0).toUpperCase() + detalleId.slice(1));
    const tbody = document.getElementById(tablaId).getElementsByTagName('tbody')[0];

    tbody.innerHTML = '';

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.serial && response.serial.length > 0) {
                    const serialData = response.serial[0];

                    for (const key in serialData) {
                        const tr = document.createElement('tr');
                        const th = document.createElement('th');
                        const td = document.createElement('td');

                        const formattedKey = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

                        th.textContent = formattedKey;
                        td.textContent = serialData[key];

                        tr.appendChild(th);
                        tr.appendChild(td);
                        tbody.appendChild(tr);
                    }

                    // Inicializa DataTables (si es necesario)
                    $(document).ready(function() {
                        if ($.fn.DataTable.isDataTable('#' + tablaId)) {
                            $('#' + tablaId).DataTable().destroy();
                        }

                        $('#' + tablaId).DataTable({
                            responsive: true,
                            "pagingType": "simple_numbers",
                            autoWidth: false,
                            "language": { /* ... tu configuración de idioma ... */ /*}*/
                       /* });
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="2">No se encontraron datos para este serial.</td></tr>';
                }
            } catch (error) {
                tbody.innerHTML = '<tr><td colspan="2">Error al procesar la respuesta.</td></tr>';
                console.error('Error parsing JSON:', error);
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="2">Error de conexión.</td></tr>';
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function() {
        tbody.innerHTML = '<tr><td colspan="2">Error de conexión.</td></tr>';
        console.error('Error de red');
    };

    const datos = `action=SearchSerial&serial=${encodeURIComponent(serial)}`;
    xhr.send(datos);
}*/
/*inicializeModal();


/* CAMPO RIF*/
$(document).ready(function() {
    $.mask.definitions['~'] = '[JVEG]'; // Permite J o V
    $('#rifInput').mask('~9?99999999');
});
/* END CAMPO RIF*/

/* CAMPO 1 FALLA*/
/*$(document).ready(function() {
    $.mask.definitions['~'] = '[JVEG]'; // Permite J o V
    $('#InputRif').mask('~9?99999999');
});
/* END CAMPO 1 FALLA*/

/* CAMPO 2 FALLA*/
/*$(document).ready(function() {
    $.mask.definitions['~'] = '[JVEG]'; // Permite J o V
    $('#InputRif1').mask('~9?99999999');
});
/* END CAMPO 2 FALLA*/


// Get the input field
var input1 = document.getElementById("rifInput");

// Execute a function when the user presses a key on the keyboard
input1.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("buscarRif").click();
  }
}); 

$("#rifInput").keyup(function(){
    let string = $("#rifInput").val();
    $("#rifInput").val(string.replace(/ /g, ""))
});


function SendRif() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/SearchRif`);
    
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const tbody = document.getElementById('rifCountTable').getElementsByTagName('tbody')[0];

    // Limpia la tabla ANTES de la nueva búsqueda
    tbody.innerHTML = '';

    // Destruye DataTables si ya está inicializado
    if ($.fn.DataTable.isDataTable('#rifCountTable')) {
        $('#rifCountTable').DataTable().destroy();
    }

    // Limpia la tabla usando removeChild
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const rifData = response.rif; // Cambia el nombre de la variable aquí

                    rifData.forEach(item => { // Usa un nombre diferente para el elemento individual
                        const row = tbody.insertRow();
                        const id_clienteCell = row.insertCell();
                        const razonsocialCell = row.insertCell();
                        const rifCell = row.insertCell();
                        const name_modeloposCell = row.insertCell();
                        const serial_posCell = row.insertCell();
                        const afiliacionCell = row.insertCell();
                        const fechainstallCell = row.insertCell();
                        const bancoCell = row.insertCell();
                        const directionCell = row.insertCell();
                        const estadoCell = row.insertCell();
                        const municipioCell = row.insertCell();

                        id_clienteCell.textContent = item.id_cliente; // Accede a las propiedades del 'item'
                        razonsocialCell.textContent = item.razonsocial;
                        rifCell.textContent = item.rif;
                        name_modeloposCell.textContent = item.name_modelopos;

                        // Crear el enlace para el número de serie
                        const enlaceSerial = document.createElement('a');
                        enlaceSerial.textContent = item.serial_pos;
                        enlaceSerial.style.color = 'blue';
                        enlaceSerial.style.textDecoration = 'underline';
                        enlaceSerial.style.cursor = 'pointer';
                        serial_posCell.appendChild(enlaceSerial);

                        // Modal de detalles del serial (tu código existente)
                        const modalSerial = document.getElementById('ModalSerial');
                        const spanSerialClose = document.getElementById('ModalSerial-close');
                        enlaceSerial.onclick = function() {
                            modalSerial.style.display = 'block';
                            fetchSerialData(item.serial_pos);
                        }
                        spanSerialClose.onclick = function() {
                            modalSerial.style.display = 'none';
                        }
                        window.onclick = function(event) {
                            if (event.target == modalSerial) {
                                modalSerial.style.display = 'none';
                            }
                        }

                        fechainstallCell.textContent = item.fechainstalacion;
                        afiliacionCell.textContent = item.afiliacion;


                        //TEXTO EN LA VISTA
                        const fechaInstalacion = new Date(item.fechainstalacion);
                        const ahora = new Date();
                        const diffEnMilisegundos = ahora.getTime() - fechaInstalacion.getTime();
                        const diffEnMeses = diffEnMilisegundos / (1000 * 60 * 60 * 24 * 30.44);

                        const garantiaLabel = document.createElement('span');
                        garantiaLabel.style.fontSize = '12px';
                        garantiaLabel.style.fontWeight = 'bold';
                        garantiaLabel.style.display = 'block';
                        garantiaLabel.style.marginTop = '5px';
                        garantiaLabel.style.width = '100px';
                        let garantiaTexto = '';
                        let garantiaClase = '';

                        if (diffEnMeses <= 6 && diffEnMeses >= 0) {
                            garantiaTexto = 'Garantía Instalación (6 meses)';
                            garantiaClase = 'garantia-activa';
                            garantiaDetectada = true;
                        } else {
                            garantiaTexto = 'Sin garantía';
                            garantiaClase = 'sin-garantia';
                        }

                        garantiaLabel.textContent = garantiaTexto;
                        garantiaLabel.className = garantiaClase;
                        fechainstallCell.appendChild(document.createElement('br'));
                        fechainstallCell.appendChild(garantiaLabel);
                        //END TEXTO EN LA VISTA

                        bancoCell.textContent = item.banco;
                        directionCell.textContent = item.direccion_instalacion;
                        estadoCell.textContent = item.estado;
                        municipioCell.textContent = item.municipio;
                    });

                    // Inicialización de DataTables
                    if ($.fn.DataTable.isDataTable('#rifCountTable')) {
                        $('#rifCountTable').DataTable().destroy();
                    }
                    $('#rifCountTable').DataTable({
                        responsive: false,
                        "pagingType": "simple_numbers",
                        "lengthMenu": [5],
                        autoWidth: false,
                        "language": {
                            "lengthMenu": "Mostrar _MENU_ registros", // Esta línea es la clave
                            "emptyTable": "No hay datos disponibles en la tabla",
                            "zeroRecords": "No se encontraron resultados para la búsqueda",
                            "info": "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
                            "infoEmpty": "No hay datos disponibles",
                            "infoFiltered": "(Filtrado de _MAX_ datos disponibles)",
                            "search": "Buscar:",
                            "loadingRecords": "Buscando...",
                            "processing": "Procesando...",
                            "paginate": {
                                "first": "Primero",
                                "last": "Último",
                                "next": "Siguiente",
                                "previous": "Anterior"
                            }
                        }
                    });
                    $('#rifCountTable').resizableColumns();

                } else {
                    tbody.innerHTML = '<tr><td colspan="11">Error al cargar</td></tr>';
                    console.error('Error:', response.message);
                }
            } catch (error) {
                tbody.innerHTML = '<tr><td colspan="11">Error al procesar la respuesta</td></tr>';
                console.error('Error parsing JSON:', error);
            } 
        }else if (xhr.status === 404) {
                tbody.innerHTML = '<tr><td colspan="11">No se encontraron usuarios</td></tr>';
        } else {
            tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };
    xhr.onerror = function() {
        tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
        console.error('Error de red');
    };
    const rifInputValue = document.getElementById('rifInput').value;
    const datos = `action=SearchRif&rif=${encodeURIComponent(rifInputValue)}`;
    xhr.send(datos);
}


function fetchSerialData(serial) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/SearchSerial`);
       
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    const tbody = document.getElementById('serialCountTable').getElementsByTagName('tbody')[0];

    // Limpia el contenido de la tabla antes de agregar nuevos datos
    tbody.innerHTML = '';

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.serial && response.serial.length > 0) {
                    const serialData = response.serial[0];

                    // Construye la tabla vertical, omitiendo las propiedades vacías
                    for (const key in serialData) {
                        if (serialData.hasOwnProperty(key) && serialData[key] !== null && serialData[key] !== undefined && serialData[key] !== "") {
                            const tr = document.createElement('tr');
                            const th = document.createElement('th');
                            const td = document.createElement('td');

                            const formattedKey = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

                            th.textContent = formattedKey;
                            td.textContent = serialData[key];
                            td.setAttribute('data-column-name', formattedKey);

                            tr.appendChild(th);
                            tr.appendChild(td);
                            tbody.appendChild(tr);
                        }
                    }

                    // Actualiza la imagen del modal
                    downloadImageModal(serial);

                    // Destruye la instancia de DataTables antes de volver a inicializarla
                    $(document).ready(function() {
                        if ($.fn.DataTable.isDataTable('#serialCountTable')) {
                            $('#serialCountTable').DataTable().destroy();
                        }
                        $('#serialCountTable').DataTable({
                            responsive: true,
                            "pagingType": "simple_numbers",
                            autoWidth: false,
                            "language": {
                                "emptyTable": "No hay datos disponibles en la tabla",
                                "zeroRecords": "No se encontraron resultados para la búsqueda",
                                "info": "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
                                "infoEmpty": "No hay datos disponibles",
                                "infoFiltered": "(Filtrado de _MAX_ datos disponibles)",
                                "search": "Buscar:",
                                "loadingRecords": "Buscando...",
                                "processing": "Procesando...",
                                "lengthMenu": 'Mostrar <select><option value="5">5</option><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="-1">Todos</option></select>',
                                "paginate": {
                                    "first": "Primero",
                                    "last": "Ultimo",
                                    "next": "Siguiente",
                                    "previous": "Anterior"
                                }
                            }
                        });
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="2">No se encontraron datos para este serial.</td></tr>';
                }
            } catch (error) {
                tbody.innerHTML = '<tr><td colspan="2">Error al procesar la respuesta.</td></tr>';
                console.error('Error parsing JSON:', error);
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="2">Error de conexión.</td></tr>';
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error('Error de red');
    };

    const datos = `action=SearchSerial&serial=${encodeURIComponent(serial)}`;
    xhr.send(datos);
}

function downloadImageModal(serial) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/GetPhoto`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const srcImagen = response.rutaImagen;
                    const claseImagen = response.claseImagen; // Obtener la clase CSS
                    const imgElement = document.querySelector('#ModalSerial img');
                    if (imgElement) {
                        imgElement.src = srcImagen;
                        imgElement.className = claseImagen; // Aplicar la clase CSS
                    } else {
                        console.error('No se encontró el elemento img en el modal.');
                    }
                    if (imgElement) {
                        imgElement.src = rutaImagen;
                    } else {
                        console.error('No se encontró el elemento img en el modal.');
                    }
                } else {
                    console.error('Error al obtener la imagen:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error('Error de red');
    };

    const datos = `action=GetPhoto&serial=${encodeURIComponent(serial)}`;
    xhr.send(datos);
}

