// Asegúrate de que ENDPOINT_BASE y APP_PATH estén definidos globalmente o en un archivo de configuración
// Por ejemplo:
// const ENDPOINT_BASE = 'http://localhost/';
// const APP_PATH = 'SoportePost/';

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
        name_status_ticket: 'Estatus',
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

                        // Initialize DataTables
                        const dataTable = $(tableElement).DataTable({
                            responsive: true,
                            data: TicketData,
                            columns: columnsConfig,
                            "pagingType": "simple_numbers",
                            "lengthMenu": [5, 10, 25, 50, 100],
                            autoWidth: false,
                            dom: 'Bfrtip', // Add 'B' for Buttons to be enabled
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

document.addEventListener('DOMContentLoaded', getTicketData);