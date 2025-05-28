document.addEventListener('DOMContentLoaded', function() {
    const flatpickrInputs = document.querySelectorAll('.flatpickr-input');

    flatpickrInputs.forEach(input => {
        flatpickr(input, {
            dateFormat: "d/m/Y", // Define el formato como dd/mm/yyyy
            allowInput: true, // Permite escribir directamente en el input
            clickOpens: true, // Abre el calendario al hacer clic en el input
            // Puedes añadir más opciones aquí si lo necesitas
        });
    });
    
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

    const buscarPorRangoBtn = document.getElementById('buscarPorRangoBtn');
    const Rangoinput = document.getElementById('date-ini');
    const Rangoinput1 = document.getElementById('date-end');
    const BuscarRango = document.getElementById('buscarRango');
    const rangoCountTableCard = document.querySelector('.card');

    const buscarPorRegionsBtn = document.getElementById('buscarPorRegionsBtn');
    const buscarRegions = document.getElementById('buscarRegions');
    const SelectRgions = document.getElementById('SelectRgions');
    const regionCountTableCard = document.querySelector('.card');

    if(buscarPorRegionsBtn && regionCountTableCard) {
        buscarPorRegionsBtn.addEventListener('click', function() {
            regionCountTableCard.style.display = 'block'; // Muestra la tabla
            buscarRegions.style.display = 'block'; // Muestra el input
            SelectRgions.style.display = 'block'; // Oculta el botón

            selectInputRif.style.display = 'none'; // Muestra el select
            buscarRif.style.display = 'none'; // Oculta el botón
            rifInput.style.display = 'none'; // Muestra el input
            serialInput.style.display = 'none'; // Oculta el botón
            buscarSerial.style.display = 'none'; // Oculta el botón

            Rangoinput.style.display = 'none'; // Muestra el input
            BuscarRango.style.display = 'none'; // Oculta el botón
            Rangoinput1.style.display = 'none'; // Muestra el input

            razonInput.style.display = 'none'; // Muestra el input
            buscarRazon.style.display = 'none'; // Oculta el botón

        })
    } else {
        console.log('Error: No se encontraron el botón o la tabla.'); // Para verificar si los elementos se seleccionan
    }

    if (buscarPorRangoBtn && rangoCountTableCard) {
        buscarPorRangoBtn.addEventListener('click', function() {
            rangoCountTableCard.style.display = 'block'; // Muestra la tabla
            Rangoinput.style.display = 'block'; // Muestra el input
            BuscarRango.style.display = 'block'; // Oculta el botón
            Rangoinput1.style.display = 'block'; // Muestra el input

            razonInput.style.display = 'none'; // Muestra el input
            buscarRazon.style.display = 'none'; // Oculta el botón

            selectInputRif.style.display = 'none'; // Muestra el select
            buscarRif.style.display = 'none'; // Oculta el botón
            rifInput.style.display = 'none'; // Muestra el input*/

            serialInput.style.display = 'none'; // Oculta el botón
            buscarSerial.style.display = 'none'; // Oculta el botón
             buscarRegions.style.display = 'none'; // Muestra el input
            SelectRgions.style.display = 'none'; // Oculta el botón
        });
    } else {
        console.log('Error: No se encontraron el botón o la tabla.'); // Para verificar si los elementos se seleccionan
    }

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

            Rangoinput.style.display = 'none'; // Muestra el input
            BuscarRango.style.display = 'none'; // Oculta el botón
            Rangoinput1.style.display = 'none'; // Muestra el input
            buscarRegions.style.display = 'none'; // Muestra el input
            SelectRgions.style.display = 'none'; // Oculta el botón
            
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

            Rangoinput.style.display = 'none'; // Muestra el input
            BuscarRango.style.display = 'none'; // Oculta el botón
            Rangoinput1.style.display = 'none'; // Muestra el input
            buscarRegions.style.display = 'none'; // Muestra el input
            SelectRgions.style.display = 'none'; // Oculta el botón

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

            Rangoinput.style.display = 'none'; // Muestra el input
            BuscarRango.style.display = 'none'; // Oculta el botón
            Rangoinput1.style.display = 'none'; // Muestra el input
    buscarRegions.style.display = 'none'; // Muestra el input
            SelectRgions.style.display = 'none'; // Oculta el botón
            
        });
    } else {
        console.log('Error: No se encontraron el botón o la tabla.'); // Para verificar si los elementos se seleccionan
    }
});

function getRegionUsuarios() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST',  `${ENDPOINT_BASE}${APP_PATH}api/users/GetRegionUsers`);
   
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {

        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('SelectRgions');
 
                    select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.regionusers) && response.regionusers.length > 0) {
                        response.regionusers.forEach(regionusers => {
                            const option = document.createElement('option');
                            option.value = regionusers.idreg;
                            option.textContent = regionusers.desc_reg;
                            select.appendChild(option);
                        });
                    } else {
                        // Si no hay fallas, puedes mostrar un mensaje en el select
                        const option = document.createElement('option');
                        option.value = '';
                        option.textContent = 'No hay información disponible';
                        select.appendChild(option);
                    }
                } else {
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener los datos.';
                    console.error('Error al obtener las fallas:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la información.';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para los áreas.';
        }
    };

    const datos = `action=GetRegionUsers`; // Cambia la acción para que coincida con el backend
    xhr.send(datos);
}

// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener('DOMContentLoaded', getRegionUsuarios);

/*function SendRegions() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchRegionData`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const tableContainer = document.getElementById('rifCountTable').parentNode;
    let rifCountTable = document.getElementById('rifCountTable');

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const TicketData = response.ticket;

                    if (rifCountTable) {
                        rifCountTable.remove();
                        rifCountTable = null;
                    }

                    if (TicketData && TicketData.length > 0) {
                        rifCountTable = document.createElement('table');
                        rifCountTable.id = 'rifCountTable';
                        rifCountTable.className = 'table';

                        const thead = document.createElement('thead');
                        const tbody = document.createElement('tbody');
                        rifCountTable.appendChild(thead);
                        rifCountTable.appendChild(tbody);
                        tableContainer.appendChild(rifCountTable);

                        const columnTitles = {
                            id_ticket: 'ID Ticket',
                            create_ticket: 'Create Ticket',
                            name_status_ticket: 'Status Ticket',
                            name_failure: 'Failure',
                            name_process_ticket: 'Process Ticket',
                            name_status_payment: 'Estatus Pago',
                            full_name_tecnico: 'Tecnico',
                            name_accion_ticket: 'Accion Ticket',
                            full_name_coordinador: 'Coordinador',
                            id_level_failure: 'Level Failure',
                            full_name_tecnicoassignado: 'Tecnico Asignado',
                            serial_pos: 'Serial POS',
                            downl_exoneration: 'Exoneración',
                            downl_payment: 'Pago Anticipo',
                            downl_send_to_rosal: 'Enviado a Rosal',
                            downl_send_fromrosal: 'Enviado desde Rosal A destino',
                            date_send_lab: 'Fecha Envío Lab',
                            date_send_torosal_fromlab: 'Fecha Envío Torosal',
                            id_status_domiciliacion: 'Estatus Domiciliación',
                            date_sendkey: 'Fecha Envío Key',
                            date_receivekey: 'Fecha Recibo Key',
                            date_receivefrom_desti: 'Fecha Recibo Destino'
                        };

                        const visibleColumns = new Set();
                        const allColumns = Object.keys(TicketData[0] || {});

                        // Determinar qué columnas tienen al menos un valor no nulo o no vacío
                        allColumns.forEach(key => {
                            const hasData = TicketData.some(item => item[key] !== null && item[key] !== undefined && item[key] !== '');
                            if (hasData) {
                                visibleColumns.add(key);
                            }
                        });

                        const columnsConfig = [];

                        // Crear encabezado dinámicamente
                        const headerRow = thead.insertRow();
                        for (const key of visibleColumns) {
                            const th = document.createElement('th');
                            th.textContent = columnTitles[key] || key;
                            headerRow.appendChild(th);
                            const columnDef = { data: key, title: columnTitles[key] || key, defaultContent: '' };
                            if (['downl_exoneration', 'downl_payment', 'downl_send_to_rosal', 'downl_send_fromrosal'].includes(key)) {
                                columnDef.render = (data) => data === 'Sí' ? 'Sí' : 'No';
                            }
                            columnsConfig.push(columnDef);
                        }

                        // Poblar las filas de datos
                        TicketData.forEach(item => {
                            const row = tbody.insertRow();
                            for (const key of visibleColumns) {
                                const cell = row.insertCell();
                                cell.textContent = item[key] !== null && item[key] !== undefined ? item[key] : '';
                            }
                        });

                        // Inicializar DataTables
                        $(rifCountTable).DataTable({
                            responsive: false,
                            data: TicketData,
                            columns: columnsConfig,
                            "pagingType": "simple_numbers",
                            "lengthMenu": [5],
                            autoWidth: false,
                            "language": {
                                "lengthMenu": "Mostrar _MENU_ registros",
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
                        $(rifCountTable).resizableColumns();
                        tableContainer.style.display = '';
                    } else {
                        tableContainer.style.display = 'none';
                        const noDataMessage = document.createElement('p');
                        noDataMessage.textContent = 'No hay datos disponibles.';
                        tableContainer.appendChild(noDataMessage);
                    }
                } else {
                    if (rifCountTable) {
                        rifCountTable.remove();
                    }
                    const errorMessage = document.createElement('p');
                    errorMessage.textContent = 'Error al cargar los datos.';
                    tableContainer.appendChild(errorMessage);
                    tableContainer.style.display = '';
                    console.error('Error:', response.message);
                }
            } catch (error) {
                if (rifCountTable) {
                    rifCountTable.remove();
                }
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Error al procesar la respuesta.';
                tableContainer.appendChild(errorMessage);
                tableContainer.style.display = '';
                console.error('Error parsing JSON:', error);
            }
        } else if (xhr.status === 404) {
            if (rifCountTable) {
                rifCountTable.remove();
            }
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'No se encontraron datos.';
            tableContainer.appendChild(noDataMessage);
            tableContainer.style.display = '';
        } else {
            if (rifCountTable) {
                rifCountTable.remove();
            }
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error de conexión.';
            tableContainer.appendChild(errorMessage);
            tableContainer.style.display = '';
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };
    xhr.onerror = function () {
        if (rifCountTable) {
            rifCountTable.remove();
        }
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error de red.';
        tableContainer.appendChild(errorMessage);
        tableContainer.style.display = '';
        console.error('Error de red');
    };

    const RegionSelectValue = document.getElementById('SelectRgions').value;
    const datos = `action=SearchRegionData&id_region=${encodeURIComponent(RegionSelectValue)}`;
    xhr.send(datos);
}*/


function SendRegions() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchRegionData`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const tableContainer = document.getElementById('rifCountTable').parentNode;
    let rifCountTable = document.getElementById('rifCountTable');

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const TicketData = response.ticket;

                    if (rifCountTable) {
                        rifCountTable.remove();
                        rifCountTable = null;
                    }

                    if (TicketData && TicketData.length > 0) {
                        rifCountTable = document.createElement('table');
                        rifCountTable.id = 'rifCountTable';
                        rifCountTable.className = 'table table-striped table-bordered table-hover table-sm'; // Clases de Bootstrap agregadas

                        const thead = document.createElement('thead');
                        const tbody = document.createElement('tbody');
                        rifCountTable.appendChild(thead);
                        rifCountTable.appendChild(tbody);
                        tableContainer.appendChild(rifCountTable);

                        const columnTitles = {
                            id_ticket: 'ID Ticket',
                            create_ticket: 'Create Ticket',
                            name_status_ticket: 'Status Ticket',
                            name_failure: 'Failure',
                            name_process_ticket: 'Process Ticket',
                            name_status_payment: 'Estatus Pago',
                            full_name_tecnico: 'Tecnico',
                            name_accion_ticket: 'Accion Ticket',
                            full_name_coordinador: 'Coordinador',
                            id_level_failure: 'Level Failure',
                            full_name_tecnicoassignado: 'Tecnico Asignado',
                            serial_pos: 'Serial POS',
                            downl_exoneration: 'Exoneración',
                            downl_payment: 'Pago Anticipo',
                            downl_send_to_rosal: 'Enviado a Rosal',
                            downl_send_fromrosal: 'Enviado desde Rosal A destino',
                            date_send_lab: 'Fecha Envío Lab',
                            date_send_torosal_fromlab: 'Fecha Envío arosal',
                            id_status_domiciliacion: 'Estatus Domiciliación',
                            date_sendkey: 'Fecha Envío Key',
                            date_receivekey: 'Fecha Recibo Key',
                            date_receivefrom_desti: 'Fecha Recibo Destino'
                        };

                        const visibleColumns = new Set();
                        const allColumns = Object.keys(TicketData[0] || {});

                        allColumns.forEach(key => {
                            const hasData = TicketData.some(item => item[key] !== null && item[key] !== undefined && item[key] !== '');
                            if (hasData) {
                                visibleColumns.add(key);
                            }
                        });

                        const columnsConfig = [];

                        const headerRow = thead.insertRow();
                        for (const key of visibleColumns) {
                            const th = document.createElement('th');
                            th.textContent = columnTitles[key] || key;
                            headerRow.appendChild(th);
                            const columnDef = { data: key, title: columnTitles[key] || key, defaultContent: '' };
                            if (['downl_exoneration', 'downl_payment', 'downl_send_to_rosal', 'downl_send_fromrosal'].includes(key)) {
                                columnDef.render = (data) => data === 'Sí' ? 'Sí' : 'No';
                            }
                            columnsConfig.push(columnDef);
                        }

                        TicketData.forEach(item => {
                            const row = tbody.insertRow();
                            for (const key of visibleColumns) {
                                const cell = row.insertCell();
                                cell.textContent = item[key] !== null && item[key] !== undefined ? item[key] : '';
                            }
                        });

                        $(rifCountTable).DataTable({
                            responsive: false,
                            data: TicketData,
                            columns: columnsConfig,
                            "pagingType": "simple_numbers",
                            "lengthMenu": [5],
                            autoWidth: false,
                            "language": {
                                "lengthMenu": "Mostrar _MENU_ registros",
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
                        $(rifCountTable).resizableColumns();
                        tableContainer.style.display = '';
                    } else {
                        tableContainer.style.display = 'none';
                        const noDataMessage = document.createElement('p');
                        noDataMessage.textContent = 'No hay datos disponibles.';
                        tableContainer.appendChild(noDataMessage);
                    }
                } else {
                    if (rifCountTable) {
                        rifCountTable.remove();
                    }
                    const errorMessage = document.createElement('p');
                    errorMessage.textContent = 'Error al cargar los datos.';
                    tableContainer.appendChild(errorMessage);
                    tableContainer.style.display = '';
                    console.error('Error:', response.message);
                }
            } catch (error) {
                if (rifCountTable) {
                    rifCountTable.remove();
                }
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Error al procesar la respuesta.';
                tableContainer.appendChild(errorMessage);
                tableContainer.style.display = '';
                console.error('Error parsing JSON:', error);
            }
        } else if (xhr.status === 404) {
            if (rifCountTable) {
                rifCountTable.remove();
            }
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'No se encontraron datos.';
            tableContainer.appendChild(noDataMessage);
            tableContainer.style.display = '';
        } else {
            if (rifCountTable) {
                rifCountTable.remove();
            }
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error de conexión.';
            tableContainer.appendChild(errorMessage);
            tableContainer.style.display = '';
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };
    xhr.onerror = function () {
        if (rifCountTable) {
            rifCountTable.remove();
        }
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error de red.';
        tableContainer.appendChild(errorMessage);
        tableContainer.style.display = '';
        console.error('Error de red');
    };
    const RegionSelectValue = document.getElementById('SelectRgions').value;
    const datos = `action=SearchRegionData&id_region=${encodeURIComponent(RegionSelectValue)}`;
    xhr.send(datos);
}




