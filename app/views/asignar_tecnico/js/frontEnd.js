function getTicketData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${ENDPOINT_BASE}${APP_PATH}api/GetTicketData`);
    //xhr.open('POST', 'http://localhost/SoportePost/api/GetTipoUsers'); // Asi estaba antes de cambiarlo
    
    //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    const tbody = document.getElementById('tabla-ticket').getElementsByTagName('tbody')[0];
    // Limpia la tabla ANTES de la nueva búsqueda
    tbody.innerHTML = '';

    // Destruye DataTables si ya está inicializado
    /*if ($.fn.DataTable.isDataTable('#table-ticket-body')) {
        $('#table-ticket-body').DataTable().destroy();
    }*/

    // Limpia la tabla usando removeChild
    /*while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
*/
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                //console.log(response); // Agrega esta línea para depurar la respuesta
                if (response.success) {
                    //console.log('Datos de ticket:', response.ticket); // Agrega esta línea para depurar los datos de ticket
                    const TicketData = response.ticket; // Cambia el nombre de la variable aquí
                    //console.log('Datos de ticket:', TicketData); // Agrega esta línea para depurar los datos de ticket
                    TicketData.forEach(data => { // Usa un nombre diferente para el elemento individual
                        const row = tbody.insertRow();
                        const create_ticketCell = row.insertCell();
                        const full_name_tecnicoCell = row.insertCell();
                        const id_ticketCell = row.insertCell();
                        const name_accionCell = row.insertCell();
                        const name_failureCell = row.insertCell()
                        const name_processCell = row.insertCell();
                        const name_status_ticketCell = row.insertCell();
                        const serial_posCell = row.insertCell();
                        const actionsCell = row.insertCell(); // Nueva celda para las acciones

                        create_ticketCell.textContent = data.create_ticket;
                        full_name_tecnicoCell.textContent = data.full_name_tecnico;
                        id_ticketCell.textContent = data.id_ticket; // Accede a las propiedades del 'item'
                        name_accionCell.textContent = data.name_accion_ticket;
                        name_failureCell.textContent = data.name_failure;
                        name_processCell.textContent = data.name_process_ticket;
                        name_status_ticketCell.textContent = data.name_status_ticket;
                        serial_posCell.textContent = data.serial_pos;

                        const AssingmentButton = document.createElement('button');
                        AssingmentButton.textContent = 'Asignar A tecnico';
                        AssingmentButton.classList.add('btn', 'btn-sm', 'btn-info'); // Añade clases de Bootstrap para estilo

                        // Añadir los botones a la celda de acciones
                        actionsCell.appendChild(AssingmentButton);
                    });

                    // Inicialización de DataTables
                    /*if ($.fn.DataTable.isDataTable('#table-ticket-body')) {
                        $('#table-ticket-body').DataTable().destroy();
                    }*/
                    
                    $('#tabla-ticket').DataTable({
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
                    $('#tabla-ticket').resizableColumns();

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
    const datos = `action=GetTicketData`;
    xhr.send(datos);
}

document.addEventListener('DOMContentLoaded', getTicketData);
//console.log('FrontEnd.js loaded successfully!');