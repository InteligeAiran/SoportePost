document.addEventListener('DOMContentLoaded', function() {
    const contenedorConsulta = document.querySelector('.consulta-container');
    const animacionCarga = document.getElementById('animacion-carga');

    contenedorConsulta.classList.add('cargando');

    // Función para obtener el valor de un parámetro de la URL por su nombre
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]\\^$.|?*+()]/g, '\\$&');
        var regex = new RegExp('([?&])' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[3]) return '';
        return decodeURIComponent(results[3].replace(/\+/g, ' '));
    }

    // Obtener los valores de los parámetros 'Serial' y 'Proceso' de la URL
    const serialValue = getParameterByName('Serial');
    const procesoValue = getParameterByName('Proceso');

    // Obtener los elementos de los campos de entrada
    const campo1Input = document.getElementById('campo1');
    const campo2Input = document.getElementById('campo2');
    const botonFiltrar = document.querySelector('.boton-filtrar');

    // Verificar si se encontraron los parámetros y asignar sus valores a los campos de entrada
    if (serialValue !== null) {
        campo1Input.value = serialValue;
    }

    if (procesoValue !== null) {
        campo2Input.value = decodeURIComponent(procesoValue); // Decodificar para mostrar el valor original
    }

    // Verificar si ambos campos tienen valor y hacer clic en el botón filtrar
    if (campo1Input && campo1Input.value !== '' && campo2Input && campo2Input.value !== '' && botonFiltrar) {
        botonFiltrar.click();
    }
});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]\\^$.|?*+()]/g, '\\$&');
    var regex = new RegExp('([?&])' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[3]) return '';
    return decodeURIComponent(results[3].replace(/\+/g, ' '));
}

function SendDataSearching() {
    const serialValue = getParameterByName('Serial');
    const procesoValue = getParameterByName('Proceso');
    const tablaResultados = document.querySelector('.tabla-resultados tbody');
    const tablaHeaders = document.querySelector('.tabla-resultados thead tr'); // Get the table headers
    const noResultadosDiv = document.querySelector('.no-resultados');

    function clearTable() {
        if (tablaResultados) {
            tablaResultados.innerHTML = '';
            // Reset the headers to the default state (will be updated conditionally)
            tablaHeaders.innerHTML = '';
        }
        if (noResultadosDiv) {
            noResultadosDiv.classList.add('oculto'); // Ensure the "no results" message is hidden
        }
    }

    if (serialValue !== null && procesoValue !== null) {
        const dataToSend = `action=consultationHistorial&serial=${encodeURIComponent(serialValue)}&proceso=${encodeURIComponent(procesoValue)}`;

        fetch(`http://${ENDPOINT_BASE}${APP_PATH}api/consultationHistorial`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: dataToSend
        })
        .then(response => response.json())
        .then(data => {
            //console.log('Respuesta de la API:', data);
            clearTable();

            if (data.success && data.data) {
                const item = data.data;
                console.log('Respuesta de la API:', item);

                // Define the base headers
                let headersHTML = `
                    <th>ID Ticket</th>
                    <th>Falla</th>
                    <th>Fecha de Finalización</th>
                    <th>Estatus</th>
                    <th>Acción</th>
                `;

                // Define the base row cells
                let rowCells = `
                    <td>${item.id_ticket || ''}</td>
                    <td>${item.name_failure || ''}</td>
                    <td>${item.create_ticket || ''}</td>
                    <td>${item.name_status_ticket || ''}</td>
                    <td>${item.name_accion_ticket || ''}</td>
                `;

                // Conditionally add/remove headers and cells based on id_level_failure
                if (parseInt(item.id_level_failure) !== 2) {
                    headersHTML = `
                        <th>ID Ticket</th>
                        <th>Razón Social</th>
                        <th>RIF Comercio</th>
                        <th>Serial POS</th>
                        <th>Falla</th>
                        <th>Fecha de Finalización</th>
                        <th>Estatus</th>
                        <th>Acción</th>
                        <th>Técnico</th>
                    `;
                    rowCells = `
                        <td>${item.id_ticket || ''}</td>
                        <td>${item.razonsocial || ''}</td>
                        <td>${item.coddocumento || ''}</td>
                        <td>${item.serial_pos || ''}</td>
                        <td>${item.name_failure || ''}</td>
                        <td>${item.create_ticket || ''}</td>
                        <td>${item.name_status_ticket || ''}</td>
                        <td>${item.name_accion_ticket || ''}</td>
                        <td>${item.full_name_tecnico || ''}</td>
                    `;
                } else {
                    headersHTML += `
                        <th>Exoneración</th>
                        <th>Anticipo</th>
                        <th>Envío</th>
                    `;
                    rowCells += `
                        <td>
                            <button onclick="ShowImageExo('${item.id_ticket}')">Ver Exoneración</button>
                        </td>
                        <td>
                            <button onclick="mostrarImagen('${item.anticipo}')">Ver Anticipo</button>
                        </td>
                        <td>
                            <button onclick="mostrarEnvio('${item.envio}')">Ver Envío</button>
                        </td>
                    `;
                }

                tablaHeaders.innerHTML = `<tr>${headersHTML}</tr>`;
                tablaResultados.innerHTML = `<tr>${rowCells}</tr>`;

            } else if (data.message) {
                const row = tablaResultados.insertRow();
                const errorCell = row.insertCell();
                const colspan = (parseInt(item.id_level_failure) === 2) ? 8 : 9;
                errorCell.colSpan = colspan;
                errorCell.textContent = data.message;
                if (noResultadosDiv) {
                    noResultadosDiv.classList.remove('oculto');
                    noResultadosDiv.querySelector('p').textContent = data.message;
                }
            } else {
                const row = tablaResultados.insertRow();
                const errorCell = row.insertCell();
                const colspan = (parseInt(item.id_level_failure) === 2) ? 8 : 9;
                errorCell.colSpan = colspan;
                errorCell.textContent = 'Error al obtener los datos.';
                if (noResultadosDiv) {
                    noResultadosDiv.classList.remove('oculto');
                    noResultadosDiv.querySelector('p').textContent = 'Error al obtener los datos.';
                }
            }
        })
        .catch(error => {
            console.error('Error al enviar datos a la API:', error);
            clearTable();
            const row = tablaResultados.insertRow();
            const errorCell = row.insertCell();
            const colspan = (parseInt(item.id_level_failure) === 2) ? 8 : 9;
            errorCell.colSpan = colspan;
            errorCell.textContent = 'Error de conexión con la API.';
            if (noResultadosDiv) {
                noResultadosDiv.classList.remove('oculto');
                noResultadosDiv.querySelector('p').textContent = 'Error de conexión con la API.';
            }
        });

    } else {
        console.log('No se encontraron los parámetros "Serial" y/o "Proceso" en la URL.');
        clearTable();
        const row = tablaResultados.insertRow();
        const noParamsCell = row.insertCell();
        noParamsCell.colSpan = 9; // Default colspan
        noParamsCell.textContent = 'No se proporcionaron Serial y/o Proceso en la URL.';
        if (noResultadosDiv) {
            noResultadosDiv.classList.remove('oculto');
            noResultadosDiv.querySelector('p').textContent = 'No se proporcionaron Serial y/o Proceso en la URL.';
        }
    }
}

function ShowImageExo(id_ticket) {
    const apiUrl = `http://10.225.1.136/SoportePost/api/GetImageExo?id=${encodeURIComponent(id_ticket)}`;

    fetch(apiUrl, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob(); // Obtener los datos como Blob
    })
    .then(blob => {
        console.log("Blob:", blob);
        console.log("Tipo de contenido (Blob):", blob.type);

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        let filename = 'documento';
        if (blob.type === 'application/pdf') {
            filename += '.pdf';
        } else if (blob.type.startsWith('image/')) {
            const fileExtension = blob.type.split('/')[1];
            filename += `.${fileExtension}`;
        } else {
            filename += '.bin'; // Tipo genérico si no se reconoce
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Limpiar la URL del objeto
    })
    .catch(error => {
        console.error('Error al hacer la petición del archivo:', error);
        alert('Error al descargar el archivo.');
        console.log("Error details:", error);
    });
}