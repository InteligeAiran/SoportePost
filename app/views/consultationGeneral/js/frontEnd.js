document.addEventListener('DOMContentLoaded', function() {
    const contenedorConsulta = document.querySelector('.consulta-container');
    const animacionCarga = document.getElementById('animacion-carga');

    contenedorConsulta.classList.add('cargando');

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
    const id_level_failure = getParameterByName('id_level_failure');
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
        const dataToSend = `action=consultationHistorial&serial=${encodeURIComponent(serialValue)}&proceso=${encodeURIComponent(procesoValue)}&id_level_failure=${encodeURIComponent(id_level_failure)}`;

        fetch(`${ENDPOINT_BASE}${APP_PATH}api/email/consultationHistorial`, {
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
                headersHTML += `<th>Exoneración</th>
                    <th>Anticipo</th>
                    <th>Envío</th>`; // La primera línea comienza justo después de `

                rowCells += `<td>
                        <button onclick="openViewModal('${item.id_ticket}', '${item.exoneracion_url}', 'Exoneración')">Ver Exoneración</button>
                    </td>
                    <td>
                        <button onclick="openViewModal('${item.id_ticket}', '${item.anticipo}', 'Anticipo')">Ver Anticipo</button>
                    </td>
                    <td>
                        <button onclick="openViewModal('${item.id_ticket}', '${item.envio}', 'Envío')">Ver Envío</button>
                    </td>`;
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

function openViewModal(ticketId, fileUrl, documentType) {
    const viewDocumentModalElement = document.getElementById('viewDocumentModal');
    const viewModalTicketIdSpan = document.getElementById('viewModalTicketId');
    const imageViewPreview = document.getElementById('imageViewPreview');
    const pdfViewViewer = document.getElementById('pdfViewViewer');
    const viewDocumentMessage = document.getElementById('viewDocumentMessage');

    if (viewDocumentModalElement && typeof bootstrap !== 'undefined' && typeof bootstrap.Modal !== 'undefined') {
        const viewModalBootstrap = new bootstrap.Modal(viewDocumentModalElement);

        // Limpiar y ocultar elementos de previsualización
        imageViewPreview.style.display = 'none';
        imageViewPreview.src = '#';
        pdfViewViewer.style.display = 'none';
        pdfViewViewer.innerHTML = ''; // Limpiar contenido previo del visor de PDF
        viewDocumentMessage.classList.add('hidden');
        viewDocumentMessage.textContent = '';

        // Establecer el ID del ticket en el modal
        viewModalTicketIdSpan.textContent = ticketId;

        if (fileUrl) {
            const fileExtension = fileUrl.split('.').pop().toLowerCase();

            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                imageViewPreview.src = fileUrl;
                imageViewPreview.style.display = 'block';
            } else if (fileExtension === 'pdf') {
                // Usar un visor de PDF (por ejemplo, pdf.js o un iframe simple)
                // Para un iframe simple:
                pdfViewViewer.innerHTML = `<iframe src="${fileUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
                pdfViewViewer.style.display = 'block';

                // Si necesitas algo más robusto como pdf.js, tendrías que integrarlo
                // Ejemplo con pdf.js (requiere la librería):
                /*
                pdfViewViewer.innerHTML = ''; // Asegúrate de que esté vacío
                const loadingTask = pdfjsLib.getDocument(fileUrl);
                loadingTask.promise.then(function(pdf) {
                    pdf.getPage(1).then(function(page) {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale: scale });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        pdfViewViewer.appendChild(canvas);

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                        pdfViewViewer.style.display = 'block';
                    });
                }).catch(function(error) {
                    console.error('Error al cargar el PDF:', error);
                    viewDocumentMessage.textContent = 'Error al cargar el PDF.';
                    viewDocumentMessage.classList.remove('hidden');
                });
                */
            } else {
                viewDocumentMessage.textContent = 'Formato de archivo no soportado para previsualización.';
                viewDocumentMessage.classList.remove('hidden');
            }
        } else {
            viewDocumentMessage.textContent = 'No se ha subido ningún documento para este tipo.';
            viewDocumentMessage.classList.remove('hidden');
        }

        // Mostrar el modal
        viewModalBootstrap.show();
    } else {
        console.error("No se pudo inicializar el modal de visualización: viewDocumentModalElement o Bootstrap Modal no están disponibles.");
    }
}