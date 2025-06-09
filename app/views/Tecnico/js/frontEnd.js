function getTicketData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketData1`);
    //xhr.open('POST', 'http://localhost/SoportePost/api/GetTipoUsers'); // Asi estaba antes de cambiarlo
    
    //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    const tbody = document.getElementById('tabla-ticket').getElementsByTagName('tbody')[0];
    // Limpia la tabla ANTES de la nueva búsqueda
    tbody.innerHTML = '';

    // Destruye DataTables si ya está inicializado
    if ($.fn.DataTable.isDataTable('tabla-ticket')) {
        $('#tabla-ticket').DataTable().destroy();
    }

    // Limpia la tabla usando removeChild
    /*while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }*/

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                //console.log(response); // Agrega esta línea para depurar la respuesta
                if (response.success) {
                    //console.log('Datos de ticket:', response.ticket); // Agrega esta línea para depurar los datos de ticket
                    const TicketData = response.ticket; // Cambia el nombre de la variable aquí
                    const modalElement = document.getElementById('staticBackdrop'); // Obtén la referencia al modal fuera del bucle

                    //console.log('Datos de ticket:', TicketData); // Agrega esta línea para depurar los datos de ticket
                    TicketData.forEach(data => { // Usa un nombre diferente para el elemento individual
                        const row = tbody.insertRow();
                        const id_ticketCell = row.insertCell();
                        const serial_posCell = row.insertCell();
                        const create_ticketCell = row.insertCell();
                        const full_name_tecnicoCell = row.insertCell();
                        const name_accionCell = row.insertCell();
                        const name_failureCell = row.insertCell()
                        const name_processCell = row.insertCell();
                        const name_status_ticketCell = row.insertCell();
                        const actionsCell = row.insertCell(); // Nueva celda para las acciones

                        id_ticketCell.textContent = data.id_ticket; // Accede a las propiedades del 'item'
                        serial_posCell.textContent = data.serial_pos;
                        create_ticketCell.textContent = data.create_ticket;
                        full_name_tecnicoCell.textContent = data.full_name_tecnico;
                        name_accionCell.textContent = data.name_accion_ticket;
                        name_failureCell.textContent = data.name_failure;
                        name_processCell.textContent = data.name_process_ticket;
                        name_status_ticketCell.textContent = data.name_status_ticket

                        const AssingmentButton = document.createElement('button');
                        AssingmentButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-wrench-adjustable-circle" viewBox="0 0 16 16"><path d="M12.496 8a4.5 4.5 0 0 1-1.703 3.526L9.497 8.5l2.959-1.11q.04.3.04.61"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1 0a7 7 0 1 0-13.202 3.249l1.988-1.657a4.5 4.5 0 0 1 7.537-4.623L7.497 6.5l1 2.5 1.333 3.11c-.56.251-1.18.39-1.833.39a4.5 4.5 0 0 1-1.592-.29L4.747 14.2A7 7 0 0 0 15 8m-8.295.139a.25.25 0 0 0-.288-.376l-1.5.5.159.474.808-.27-.595.894a.25.25 0 0 0 .287.376l.808-.27-.595.894a.25.25 0 0 0 .287.376l1.5-.5-.159-.474-.808.27.596-.894a.25.25 0 0 0-.288-.376l-.808.27z"/></svg>';
                        AssingmentButton.classList.add('btn', 'btn-sm', 'btn-wrench-custom'); // Añade clases de Bootstrap para estilo
                        AssingmentButton.setAttribute('data-bs-toggle', 'tooltip'); // Agrega el atributo data-bs-toggle
                        AssingmentButton.setAttribute('data-bs-placement', 'top'); // O 'bottom', 'left', 'right' para la posición
                        AssingmentButton.title = 'Enviar a Taller'; // El texto del tooltip va en el atributo title

                        // Inicializa los tooltips de Bootstrap en tu script (asegúrate de que el DOM esté cargado)
            
                        // Agrega un event listener al botón para mostrar el modal
                        // Dentro de la función getUserData, después de actionsCell.appendChild(AssingmentButton);
                        AssingmentButton.addEventListener('click', function() {
                            currentTicketId  = data.id_ticket
                            const modalBootstrap = new bootstrap.Modal(modalElement, {
                                backdrop: 'static'
                            });
                            modalInstance = modalBootstrap; // Asigna la instancia a la variable
                            modalBootstrap.show();
                        });

                        // Añadir los botones a la celda de acciones
                        actionsCell.appendChild(AssingmentButton);
                    });

                    // Inicialización de DataTables

                    if ($.fn.DataTable.isDataTable('#tabla-ticket')) {
                        $('#tabla-ticket').DataTable().destroy();
                    }
                    
                    $('#tabla-ticket').DataTable({
                        responsive: true,
                        "pagingType": "simple_numbers",
                        "lengthMenu": [5],
                        autoWidth: false,
                        "language": {
                            "lengthMenu": "Mostrar _MENU_ registros", // Esta línea es la clave
                            "emptyTable": "No hay datos disponibles en la tabla",
                            "zeroRecords": "No se encontraron resultados para la búsqueda",
                            "info": "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ registro(s) )",
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
    const datos = `action=GetTicketData1`;
    xhr.send(datos);
}

document.addEventListener('DOMContentLoaded', getTicketData);

document.addEventListener('DOMContentLoaded', function() {
    const cerrar = document.getElementById('close-button');
    const icon = document.getElementById('Close-icon');
    
    // CAMBIO AQUI: Usa un nombre diferente para la variable del botón, por ejemplo, `sendToTallerButton`
    const sendToTallerButton = document.getElementById('SendToTaller-button');

    // Agrega el event listener al botón cerrar
    if (cerrar) { // Siempre es buena práctica verificar si el elemento existe antes de añadir un listener
        cerrar.addEventListener('click', function() {
            if (modalInstance) {
                modalInstance.hide();
                currentTicketId = null;
            }
            document.getElementById('idSelectionTec').value = '';
        });
    } else {
        console.error("Elemento con ID 'close-button' no encontrado.");
    }

    if (icon) {
        icon.addEventListener('click', function() {
            if (modalInstance) {
                modalInstance.hide();
                currentTicketId = null;
            }
            document.getElementById('idSelectionTec').value = '';
        });
    } else {
        console.error("Elemento con ID 'Close-icon' no encontrado.");
    }

    // Agrega el event listener al botón "Enviar a Taller"
    if (sendToTallerButton) { // Verifica si el botón existe antes de añadir el listener
        sendToTallerButton.addEventListener('click', handleSendToTallerClick); // Llama a una función con otro nombre
    } else {
        console.error("Elemento con ID 'SendToTaller-button' no encontrado. Esto está causando el TypeError.");
    }
});

// CAMBIO AQUI: Renombra la función para que no haya conflicto con el nombre de la variable del botón
function handleSendToTallerClick() {
    const idTicket = currentTicketId; // Usa la variable global para obtener el ID del ticket

    if (idTicket) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToTaller`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'El ticket del Dispostitivo POS fue enviado a Taller',
                        text: response.message,
                        color: 'black',
                        timer: 3500,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        willClose: () => {
                            setTimeout(() => {
                                location.reload();
                            }, 3500);
                        }
                    });
                    modalInstance.hide(); // Cierra el modal
                    getTicketData(); // Recarga los datos de la tabla
                } else {
                    alert('Error al enviar el ticket: ' + response.message);
                }
            } else {
                alert('Error de conexión: ' + xhr.statusText);
            }
        };
        xhr.onerror = function() {
            alert('Error de red');
        };

        const data = `action=SendToTaller&id_ticket=${encodeURIComponent(idTicket)}`;
        xhr.send(data);
    } else {
        alert('Por favor, selecciona un ticket.');
    }
}