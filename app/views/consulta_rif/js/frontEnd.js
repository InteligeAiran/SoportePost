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

/* CAMPO RIF*/
$(document).ready(function() {
    $('#rifInput').mask('9?99999999'); // Máscara solo para la parte numérica
});

/* END CAMPO RIF*/

function obtenerRifCompleto() {
    const tipoRif = $('#rifTipo').val();
    const numeroRif = $('#rifInput').val();
    return tipoRif + numeroRif;
}

// Ejemplo de cómo podrías usar la función para obtener el RIF completo al hacer clic en "Buscar"
$('.btn-primary').on('click', function() {
    const rifCompleto = obtenerRifCompleto();
    console.log("RIF Completo:", rifCompleto);
    // Aquí puedes realizar la búsqueda con el 'rifCompleto'
});

// Get the input field
var input1 = document.getElementById("rifInput");
var input2 = document.getElementById("serialInput");
var input3 = document.getElementById("RazonInput");

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

input2.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("buscarSerial").click();
    }
});

input3.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("buscarRazon").click();
    }
});

$("#rifInput").keyup(function(){
    let string = $("#rifInput").val();
    $("#rifInput").val(string.replace(/ /g, ""))
});



function SendRif() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchRif`);
    
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
                        garantiaLabel.style.fontSize = '10px';
                        garantiaLabel.style.fontWeight = 'bold';
                        garantiaLabel.style.display = 'block';
                        garantiaLabel.style.marginTop = '5px';
                        garantiaLabel.style.width = '173px';
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
                    tbody.innerHTML = '<tr><td colspan="11">No se ha encontrado resultados</td></tr>';
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
    const rifInputValue = obtenerRifCompleto();
    const datos = `action=SearchRif&rif=${encodeURIComponent(rifInputValue)}`;
    xhr.send(datos);
}

function SendSerial() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchSerialData`);
    
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const tbody = document.getElementById('rifCountTable').getElementsByTagName('tbody')[0];

     const tipoRif = $('#rifTipo').val();
        const numeroRif = $('#rifInput').val();
        const rifCompleto = tipoRif + numeroRif;
        console.log("Buscar RIF:", rifCompleto);

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
                    const serialData = response.serialData; // Cambia el nombre de la variable aquí

                    serialData.forEach(item => { // Usa un nombre diferente para el elemento individual
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
                        garantiaLabel.style.fontSize = '10px';
                        garantiaLabel.style.fontWeight = 'bold';
                        garantiaLabel.style.display = 'block';
                        garantiaLabel.style.marginTop = '5px';
                        garantiaLabel.style.width = '173px';
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
    const serialInputValue = document.getElementById('serialInput').value;
    const datos = `action=SearchSerialData&serial=${encodeURIComponent(serialInputValue)}`;
    xhr.send(datos);
}

function SendRazon() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchRazonData`);
    
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
                    const RazonData = response.RazonData; // Cambia el nombre de la variable aquí

                    RazonData.forEach(item => { // Usa un nombre diferente para el elemento individual
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
                        garantiaLabel.style.fontSize = '10px';
                        garantiaLabel.style.fontWeight = 'bold';
                        garantiaLabel.style.display = 'block';
                        garantiaLabel.style.marginTop = '5px';
                        garantiaLabel.style.width = '173px';
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
    const RazonInputValue = document.getElementById('RazonInput').value;
    const datos = `action=SearchRazonData&RazonSocial=${encodeURIComponent(RazonInputValue)}`;
    xhr.send(datos);
}


function fetchSerialData(serial) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchSerial`);
       
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
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPhoto`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                //console.log(response);
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

document.addEventListener('DOMContentLoaded', function() {
    const buscarPorRifBtn = document.getElementById('buscarPorRifBtn');
    const rifInput = document.getElementById('rifInput');
    const buscarRif = document.getElementById('buscarRif');
    const rifCountTableCard = document.querySelector('.card');
    const selectInputRif = document.getElementById('rifTipo');

    const buscarPorSerialBtn = document.getElementById('buscarPorSerialBtn');
    const serialInput = document.getElementById('serialInput');
    const buscarSerial = document.getElementById('buscarSerial');
    const serialCountTableCard = document.querySelector('.card');

    const buscarPorRazonBtn = document.getElementById('buscarPorNombreBtn');
    const razonInput = document.getElementById('RazonInput');
    const buscarRazon = document.getElementById('buscarRazon');
    const razonCountTableCard = document.querySelector('.card');

    if (buscarPorRazonBtn && razonCountTableCard) {
        buscarPorRazonBtn.addEventListener('click', function() {
            razonCountTableCard.style.display = 'block'; // Muestra la tabla
            razonInput.style.display = 'block'; // Muestra el input
            buscarRazon.style.display = 'block'; // Oculta el botón
            selectInputRif.style.display = 'none'; // Muestra el select
            buscarRif.style.display = 'none'; // Oculta el botón
            rifInput.style.display = 'none'; // Muestra el input*/
            serialInput.style.display = 'none'; // Oculta el botón
            buscarSerial.style.display = 'none'; // Oculta el botón
        });
    } else {
        console.log('Error: No se encontraron el botón o la tabla.'); // Para verificar si los elementos se seleccionan
    }


    if (buscarPorRifBtn && rifCountTableCard) {
        buscarPorRifBtn.addEventListener('click', function() {
            rifCountTableCard.style.display = 'block'; // Muestra la tabla
            rifInput.style.display = 'block'; // Muestra el input
            selectInputRif.style.display = 'block'; // Muestra el select
            buscarRif.style.display = 'block'; // Oculta el botón

            buscarSerial.style.display = 'none'; // Oculta el botón
            serialInput.style.display = 'none';
            buscarRazon.style.display = 'none'; // Oculta el botón
            razonInput.style.display = 'none'; // Oculta el botón

        });
    } else {
        console.log('Error: No se encontraron el botón o la tabla.'); // Para verificar si los elementos se seleccionan
    }



    if (buscarPorSerialBtn && serialCountTableCard) {
        buscarPorSerialBtn.addEventListener('click', function() {
            serialCountTableCard.style.display = 'block'; // Muestra la tabla
            serialInput.style.display = 'block'; // Muestra el input
            buscarSerial.style.display = 'block'; // Oculta el botón
            selectInputRif.style.display = 'none'; // Muestra el select
            rifInput.style.display = 'none'; // Muestra el input
            buscarRif.style.display = 'none'; // Oculta el botón
            buscarRazon.style.display = 'none'; // Oculta el botón
            razonInput.style.display = 'none'; // Oculta el botón
            
        });
    } else {
        console.log('Error: No se encontraron el botón o la tabla.'); // Para verificar si los elementos se seleccionan
    }
});

