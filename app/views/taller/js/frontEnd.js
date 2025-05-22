function getTicketData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketDataLab`);

    const tableElement = document.getElementById('tabla-ticket');
    // Asegúrate de que estos elementos existan en tu HTML
    // Si no existen, estas líneas podrían causar un error
    const theadElement = tableElement ? tableElement.getElementsByTagName('thead')[0] : null;
    const tbodyElement = tableElement ? tableElement.getElementsByTagName('tbody')[0] : null;
    const tableContainer = document.querySelector('.table-responsive');

    // Define column titles strictly based on your SQL function's output
    const columnTitles = {
        id_ticket: 'ID Ticket',
        create_ticket: 'Fecha Creacion',
        serial_pos: 'Serial POS',
        full_name_tecnicoassignado: 'Técnico Asignado',
        fecha_envio_a_taller: 'Fecha Envío a Taller',
        name_process_ticket: 'Proceso Ticket',
        name_status_payment: 'Estatus Pago',
        name_status_lab: 'Estatus Taller',
        name_accion_ticket: 'Acción Ticket',
        name_status_ticket: 'Estatus Ticket',
        name_failure: 'Falla',
        date_send_torosal_fromlab: 'Fecha Envío a Rosal',
        date_sendkey: 'Fecha Envío Key',
        date_receivekey: 'Fecha Recibo Key',
        date_receivefrom_desti: 'Fecha Recibo Destino'
    };

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const TicketData = response.ticket;

                    if (TicketData && TicketData.length > 0) {
                        // Destroy DataTables if it's already initialized on this table
                        if ($.fn.DataTable.isDataTable('#tabla-ticket')) {
                            $('#tabla-ticket').DataTable().destroy();
                            // Limpiar headers y body solo si el elemento existe
                            if (theadElement) theadElement.innerHTML = ''; // Clear old headers
                            if (tbodyElement) tbodyElement.innerHTML = ''; // Clear old body
                        }

                        // Determine all possible columns from the data (based on the first row)
                        const allDataKeys = Object.keys(TicketData[0] || {});

                        const columnsConfig = [];

                        // Build the column configuration for DataTables
                        // Iterate over the keys defined in columnTitles to maintain order and ensure correct titles
                        for (const key in columnTitles) {
                            // Only include if the key actually exists in the data from the API
                            if (allDataKeys.includes(key)) {
                                // La columna es visible si al menos una fila tiene datos significativos
                                const isVisible = TicketData.some(item => {
                                    const value = item[key];
                                    // Considera "con datos" si el valor NO es null, NO es undefined, y
                                    // si es una cadena, no está vacía o solo con espacios.
                                    return value !== null && value !== undefined && String(value).trim() !== '';
                                });

                                const columnDef = {
                                    data: key,
                                    title: columnTitles[key],
                                    defaultContent: '', // Muestra una cadena vacía si el valor es null o undefined
                                    visible: isVisible
                                };

                                // Lógica para aplicar estilo al estado del ticket
                                if (key === 'name_status_ticket') {
                                    columnDef.render = function (data, type, row) {
                                        let statusText = String(data || '').trim(); // Asegurarse de que data sea string y trim
                                        let statusColor = 'gray'; // Color por defecto

                                        switch (statusText) {
                                            case 'Abierto':
                                                statusColor = '#4CAF50'; // Verde
                                                break;
                                            case 'Enviado a taller':
                                                statusColor = '#2196F3'; // Azul
                                                break;
                                            case 'actualizacion de cifrado':
                                                statusColor = '#FF9800'; // Naranja
                                                break;
                                            // Agrega más casos según tus estatus y colores deseados
                                            // case 'Cerrado':
                                            //     statusColor = '#F44336'; // Rojo
                                            //     break;
                                            default:
                                                if (statusText === '') {
                                                    // Si el valor es vacío o solo espacios, se muestra como vacío
                                                    return '';
                                                }
                                                statusColor = '#9E9E9E'; // Gris si no hay match
                                                break;
                                        }
                                        return `<span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>`;
                                    };
                                }

                                columnsConfig.push(columnDef);
                            }
                        }

                        // Añadir la columna de "Acciones" al final
                        columnsConfig.push({
                            data: null,
                            title: 'Acciones',
                            orderable: false,
                            searchable: false,
                            width: '8%',
                            render: function (data, type, row) {
                                const idTicket = row.id_ticket;
                                const currentStatus = row.name_status_lab; // Asegúrate de usar la propiedad correcta para el estatus

                                if (currentStatus !== 'Cerrado') {
                                    // *** ESTE ES EL CAMBIO CLAVE ***
                                    // Añade los atributos data-bs-toggle y data-bs-target directamente al botón.
                                    // La clase `open-status-modal-btn` ya no es estrictamente necesaria para abrir el modal
                                    // (Bootstrap lo hace con los data-bs-toggle/target), pero la mantendremos si la usas para otra lógica.
                                    return `<button type="button" class="btn btn-primary btn-sm cambiar-estatus-btn" 
                                                    data-bs-toggle="modal" 
                                                    data-bs-target="#changeStatusModal" 
                                                    data-id="${idTicket}" 
                                                    data-current-status="${currentStatus}">
                                                Cambiar Estatus
                                            </button>`;
                                } else {
                                    return `<button class="btn btn-secondary btn-sm" disabled>Cerrado</button>`;
                                }
                            }
                        });


                        // Initialize DataTables
                        const dataTable = $(tableElement).DataTable({
                            responsive: true,
                            data: TicketData,
                            columns: columnsConfig,
                            "pagingType": "simple_numbers",
                            "lengthMenu": [5, 10, 25, 50, 100],
                            
                            autoWidth: false,
                                buttons: [
                                {
                                    extend: 'colvis', // Column visibility button
                                    text: 'Mostrar/Ocultar Columnas',
                                    className: 'btn btn-secondary' // Add Bootstrap styling to the button
                                }
                            ],
                            "language": {
                                "lengthMenu": "Mostrar _MENU_ registros",
                                "emptyTable": "No hay datos disponibles en la tabla",
                                "zeroRecords": "No se encontraron resultados para la búsqueda",
                                "info": "Mostrando página _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
                                "infoEmpty": "No hay datos disponibles",
                                "infoFiltered": "(Filtrado de _MAX_ datos disponibles)",
                                "search": "Buscar:",
                                "loadingRecords": "Cargando...",
                                "processing": "Procesando...",
                                "paginate": {
                                    "first": "Primero",
                                    "last": "Último",
                                    "next": "Siguiente",
                                    "previous": "Anterior"
                                },
                                "buttons": { // Language for buttons, specifically colvis
                                    "colvis": "Visibilidad de Columna"
                                }
                            }
                        });

                        if (tableContainer) {
                            tableContainer.style.display = ''; // Show the table container
                        }


                    } else {
                        // Si no hay TicketData o está vacío
                        if (tableContainer) {
                            tableContainer.innerHTML = '<p>No hay datos disponibles.</p>';
                            tableContainer.style.display = '';
                        }
                    }
                } else {
                    // Si response.success es false
                    if (tableContainer) {
                        tableContainer.innerHTML = '<p>Error al cargar los datos: ' + (response.message || 'Mensaje desconocido') + '</p>';
                        tableContainer.style.display = '';
                    }
                    console.error('Error from API:', response.message);
                }
            } catch (error) {
                // Error al parsear JSON
                if (tableContainer) {
                    tableContainer.innerHTML = '<p>Error al procesar la respuesta.</p>';
                    tableContainer.style.display = '';
                }
                console.error('Error parsing JSON:', error);
            }
        } else if (xhr.status === 404) {
            // Manejo de error 404
            if (tableContainer) {
                tableContainer.innerHTML = '<p>No se encontraron datos (API endpoint no encontrado).</p>';
                tableContainer.style.display = '';
            }
        } else {
            // Otros errores HTTP
            if (tableContainer) {
                tableContainer.innerHTML = `<p>Error de conexión: ${xhr.status} ${xhr.statusText}</p>`;
                tableContainer.style.display = '';
            }
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function () {
        // Error de red
        if (tableContainer) {
            tableContainer.innerHTML = '<p>Error de red.</p>';
            tableContainer.style.display = '';
        }
        console.error('Error de red');
    };

    xhr.send();
}

// Call getTicketData when the document is ready using jQuery
$(document).ready(function() {
    getTicketData(); // Llama a tu función para cargar la tabla

    // Evento que se dispara cuando se va a mostrar el modal de Bootstrap
    // Este código es crucial para rellenar el modal con los datos del ticket
    const changeStatusModal = document.getElementById('changeStatusModal');
    if (changeStatusModal) {
        changeStatusModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget; // Botón que disparó el modal
            const idTicket = button.getAttribute('data-id');
            const currentStatus = button.getAttribute('data-current-status');

            const modalTicketId = changeStatusModal.querySelector('#modalTicketId');
            const modalCurrentStatus = changeStatusModal.querySelector('#modalCurrentStatus');
            const modalNewStatus = changeStatusModal.querySelector('#modalNewStatus');
            const modalComments = changeStatusModal.querySelector('#modalComments');

            if (modalTicketId) modalTicketId.value = idTicket;
            if (modalCurrentStatus) modalCurrentStatus.value = currentStatus;
            if (modalNewStatus) modalNewStatus.value = currentStatus; // Opcional: seleccionar el estatus actual
            if (modalComments) modalComments.value = ''; // Limpiar comentarios

            // Importante: Si estás usando el plugin Bootstrap-select o similar para el dropdown,
            // puede que necesites un comando para actualizarlo después de cambiar su valor:
            // if (modalNewStatus && $(modalNewStatus).data('selectpicker')) {
            //    $(modalNewStatus).selectpicker('refresh');
            // }
        });
    }

    // Manejador de eventos para el botón "Guardar Cambios" dentro del modal
    $('#saveStatusChangeBtn').on('click', function() {
        const idTicket = $('#modalTicketId').val();
        const newStatus = $('#modalNewStatus').val();
        //const comments = $('#modalComments').val();

        if (!newStatus) {
            Swal.fire({
                icon: 'warning',
                title: 'Notificación!',
                text: 'Por favor, selecciona un nuevo estatus.',
                color: 'black'
            });
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateTicketStatus`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        alert('Estatus del ticket actualizado con éxito.');
                        $('#changeStatusModal').modal('hide');
                        getTicketData(); // Recargar la tabla
                    } else {
                        document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener los Técnicos.';
                        console.error('Error al obtener los técnicos:', response.message);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la respuesta de los Técnicos.';
                }
            } else {
                console.error('Error:', xhr.status, xhr.statusText);
                document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para los Técnicos.';
            }
        };

        const datos = `action=UpdateTicketStatus&id_ticket=${idTicket}&id_new_status=${newStatus}`;
        xhr.send(datos);

    });
});
       
function getStatusLab(){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetStatusLab`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('modalNewStatus');

                    select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.estatus) && response.estatus.length > 0) {
                        response.estatus.forEach(status => {
                            const option = document.createElement('option');
                            option.value = status.id_status_lab;
                            option.textContent = status.name_status_lab;
                            select.appendChild(option);
                        });
                    } else {
                        const option = document.createElement('option');
                        option.value = '';
                        option.textContent = 'No hay Técnicos Disponibles';
                        select.appendChild(option);
                    }
                } else {
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener los Técnicos.';
                    console.error('Error al obtener los técnicos:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la respuesta de los Técnicos.';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para los Técnicos.';
        }
    };

    const datos = `action=GetStatusLab`; // Asegúrate de que esta acción en el backend devuelva los técnicos filtrados
    xhr.send(datos);
}

document.addEventListener('DOMContentLoaded', getStatusLab);
