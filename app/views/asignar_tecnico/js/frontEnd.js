let modalInstance; // Declara modalInstance fuera del listener
let currentTicketId = null; // Variable para almacenar el ID del ticket actual


function getTicketData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketData`);
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
                        AssingmentButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/></svg>';
                        AssingmentButton.classList.add('btn', 'btn-sm', 'btn-info'); // Añade clases de Bootstrap para estilo
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

document.addEventListener('DOMContentLoaded', function() {
    getTicketData(); // Llama a la función para cargar los datos

    // Obtén la referencia al botón cerrar FUERA de la función getTicketData y del bucle
    const cerrar = document.getElementById('close-button');
    const icon   = document.getElementById('Close-icon');
    const assignButton = document.getElementById('assingment-button'); // Obtén el botón "Asignar"


    // Agrega el event listener al botón cerrar
    cerrar.addEventListener('click', function() {
        if (modalInstance) {
            modalInstance.hide();
            currentTicketId = null; // Limpia el ID del ticket al cerrar el modal
        }
        document.getElementById('idSelectionTec').value = '';
    });

    icon.addEventListener('click', function() {
        if (modalInstance) {
            modalInstance.hide();
            currentTicketId = null; // Limpia el ID del ticket al cerrar el modal
        }
        document.getElementById('idSelectionTec').value = '';
    });
    // Agrega el event listener al botón "Asignar"
    assignButton.addEventListener('click', AssignTicket);
});
//console.log('FrontEnd.js loaded successfully!');

function AssignTicket(){
    const id_tecnico_asignado = document.getElementById('idSelectionTec').value;
    /*console.log('ID del ticket a asignar:', currentTicketId); // Agrega un log más descriptivo
    console.log('ID del ticket a asignar:', currentTicketId); // Agrega un log más descriptivo*/

    if (!currentTicketId || !id_tecnico_asignado) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, selecciona un ticket antes de asignar un técnico.',
            color: 'black'
        });
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/AssignTicket`); // Asegúrate de que esta sea la ruta correcta en tu backend
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Asignado',
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
                    document.getElementById('idSelectionTec').value = '';
                    currentTicketId = null;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al asignar',
                        text: response.message,
                        color: 'black'
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el servidor',
                    text: 'Ocurrió un error al procesar la respuesta.',
                    color: 'black'
                });
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor.',
                color: 'black'
            });
        }
    };
    const datos = `action=AssignTicket&id_ticket=${encodeURIComponent(currentTicketId)}&id_tecnico=${encodeURIComponent(id_tecnico_asignado)}`;
    console.log(datos);
    xhr.send(datos);
}

function getTecnico2(){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTecnico2`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('idSelectionTec');

                    select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.tecnicos) && response.tecnicos.length > 0) {
                        response.tecnicos.forEach(tecnico => {
                            const option = document.createElement('option');
                            option.value = tecnico.id_user;
                            option.textContent = tecnico.full_name;
                            select.appendChild(option);
                        });

                        // Agregar un event listener para cuando se cambia la selección del técnico
                        select.addEventListener('change', function() {
                            const selectedTecnicoId = this.value;
                            if (selectedTecnicoId) {
                                GetRegionUser(selectedTecnicoId);
                            } else {
                                document.getElementById('InputRegion').value = ''; // Limpiar el campo de región si no se selecciona nada
                            }
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

    const datos = `action=GetTecnico2`; // Asegúrate de que esta acción en el backend devuelva los técnicos filtrados
    xhr.send(datos);
}

// Llama a la función para cargar las fallas cuando la página se cargue

function GetRegionUser(id_user){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/GetRegionUsersAssign`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const inputRegion = document.getElementById('InputRegion');
                    const region = response.regionusers || ''; // Asegúrate de que la respuesta contenga la regió
                    
                    if (region) {
                        inputRegion.value = region;
                    } else {
                        inputRegion.value = ''; // Limpiar el campo si no hay región
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Por favor, selecciona un ticket antes de asignar un técnico.',
                        color: 'black'
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la respuesta de la región del técnico.';
                document.getElementById('InputRegion').value = '';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para la región del técnico.';
            document.getElementById('InputRegion').value = '';
        }
    };
    console.log('ID del usuario para obtener la región:', id_user);
    const datos = `action=GetRegionUsersAssign&id_user=${encodeURIComponent(id_user)}`;
    xhr.send(datos);
}

document.addEventListener('DOMContentLoaded', getTecnico2);
