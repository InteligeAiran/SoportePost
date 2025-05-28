// Función para buscar tickets de domiciliación
// Función para buscar tickets de domiciliación
function searchDomiciliacionTickets() {
    const xhr = new XMLHttpRequest();
    // Cambia la ruta de la API para que sea más descriptiva para esta funcionalidad
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/getDomiciliacionTickets`); // Nueva ruta de la API
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Referencias a los elementos HTML
    const tableContainerParent = document.getElementById('tableContainerParent'); // El div que contiene la tabla si lo usas para mostrar/ocultar
    const existingTable = document.getElementById('tabla-ticket'); // La tabla HTML existente
    const existingTableBody = document.getElementById('table-ticket-body'); // El tbody de la tabla existente

    // 1. Destruir la instancia de DataTables si ya existe en la tabla.
    // Esto es CRÍTICO para evitar errores cuando se llama la función múltiples veces.
    if ($.fn.DataTable.isDataTable('#tabla-ticket')) {
        $('#tabla-ticket').DataTable().destroy();
        // Opcional: limpiar el thead y tbody para evitar duplicados si DataTables no los limpia completamente al destruir
        $('#tabla-ticket thead').empty();
        $('#tabla-ticket tbody').empty();
    }
    
    // Limpiar mensajes previos de "No hay datos" o "Error"
    if (tableContainerParent) {
        // Eliminar todos los párrafos de mensajes dentro del tableContainerParent
        const existingMessages = tableContainerParent.querySelectorAll('p.message-info, p.message-error');
        existingMessages.forEach(msg => msg.remove());
    }


    xhr.onload = function () {
        // Asegúrate de que la tabla sea visible si hay datos
        if (tableContainerParent) {
            existingTable.style.display = 'table'; // Mostrar la tabla
            tableContainerParent.style.display = ''; // Asegurar que el contenedor padre también sea visible
        }

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const TicketData = response.tickets; // Cambié 'ticket' a 'tickets' para pluralizar y ser más claro

                    // Definir los títulos de las columnas exactamente como la función SQL los devuelve
                    // Y aplicar tus nombres mejorados y diplomáticos
                    const columnTitles = {
                        id_ticket: 'ID Ticket',
                        serial_pos: 'Serial POS',
                        name_status_domiciliacion: 'Estado de Domiciliación', // Nombre mejorado
                        rif: 'RIF',
                        name_status_ticket: 'Estado del Ticket', // Nombre mejorado
                        name_process_ticket: 'Proceso del Ticket', // Nombre mejorado
                        name_accion_ticket: 'Acción Realizada', // Nombre mejorado
                        name_status_lab: 'Estado de Laboratorio', // Nombre mejorado
                        // No es necesario agregar 'Acciones' aquí, se maneja en columnsConfig directamente
                    };

                    // Generar dinámicamente el thead (encabezados de la tabla)
                    const thead = existingTable.querySelector('thead');
                    thead.innerHTML = ''; // Limpiar thead existente
                    const headerRow = thead.insertRow();
                    const columnsConfig = [];

                    // Iterar sobre la primera fila de datos para obtener las claves y crear los encabezados
                    // Esto asegura que la tabla siempre tenga los encabezados correctos de los datos recibidos
                    if (TicketData && TicketData.length > 0) {
                        const firstTicket = TicketData[0];
                        for (const key in firstTicket) {
                            if (firstTicket.hasOwnProperty(key)) {
                                const th = document.createElement('th');
                                th.textContent = columnTitles[key] || key; // Usa el título definido o el nombre de la clave
                                headerRow.appendChild(th);
                                columnsConfig.push({ data: key, title: columnTitles[key] || key, defaultContent: '' });
                            }
                        }

                        // === AÑADIR LA COLUMNA DE ACCIONES DINÁMICA ===
                        // Esta columna no viene de los datos, se genera en el frontend
                        const actionsTh = document.createElement('th');
                        actionsTh.textContent = 'Acciones';
                        headerRow.appendChild(actionsTh); // Añadir el encabezado de Acciones

                        columnsConfig.push({
                            data: null, // No está vinculado a una propiedad de datos directa
                            title: 'Acciones',
                            orderable: false,
                            searchable: false,
                            width: "10%", // Ajusta el ancho si es necesario
                            render: function (data, type, row) {
                                const idTicket = row.id_ticket;
                                const currentStatusDomiciliacion = row.id_status_domiciliacion; // Usamos el ID del estado de domiciliación
                                const currentNameStatusDomiciliacion = row.name_status_domiciliacion; // Usamos el nombre del estado de domiciliación

                                // Si el id_status_domiciliacion es 2 (Solvente), el botón estará deshabilitado
                                if (currentStatusDomiciliacion === 2) {
                                    return `<button class="btn btn-secondary btn-sm" disabled>Solvente</button>`;
                                } else {
                                    // Si no es 2, el botón estará habilitado para cambiar estatus
                                    return `<button type="button" class="btn btn-primary btn-sm cambiar-estatus-domiciliacion-btn"
                                                data-bs-toggle="modal"
                                                data-bs-target="#changeStatusDomiciliacionModal"
                                                data-id="${idTicket}"
                                                data-current-status-id="${currentStatusDomiciliacion}"
                                                data-current-status-name="${currentNameStatusDomiciliacion}">
                                                Cambiar Estatus
                                            </button>`;
                                }
                            }
                        });


                        // Inicializa DataTable en la tabla existente
                        $(existingTable).DataTable({
                            responsive: true,
                            data: TicketData,
                            columns: columnsConfig,
                            "pagingType": "simple_numbers",
                            "lengthMenu": [5, 10, 25, 50], // Más opciones de longitud
                            autoWidth: false,
                            "language": {
                                "lengthMenu": "Mostrar _MENU_ registros",
                                "emptyTable": "No hay datos disponibles en la tabla",
                                "zeroRecords": "No se encontraron resultados para la búsqueda",
                                "info": "Mostrando página _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
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
                    } else {
                        // Si no hay datos, mostrar mensaje y ocultar tabla
                        existingTable.style.display = 'none'; // Ocultar la tabla
                        const noDataMessage = document.createElement('p');
                        noDataMessage.className = 'message-info'; // Clase para identificar este mensaje
                        noDataMessage.textContent = 'No hay datos disponibles para el ID de usuario proporcionado.';
                        if (tableContainerParent) {
                            tableContainerParent.appendChild(noDataMessage);
                        } else {
                            // Fallback si tableContainerParent no existe
                            existingTable.parentNode.insertBefore(noDataMessage, existingTable);
                        }
                    }
                } else {
                    // Manejo de errores de la API
                    existingTable.style.display = 'none'; // Ocultar la tabla
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'message-error'; // Clase para identificar este mensaje
                    errorMessage.textContent = response.message || 'Error al cargar los datos desde la API.';
                    if (tableContainerParent) {
                        tableContainerParent.appendChild(errorMessage);
                    } else {
                        existingTable.parentNode.insertBefore(errorMessage, existingTable);
                    }
                    console.error('Error de la API:', response.message);
                }
            } catch (error) {
                // Manejo de errores de parsing JSON
                existingTable.style.display = 'none'; // Ocultar la tabla
                const errorMessage = document.createElement('p');
                errorMessage.className = 'message-error'; // Clase para identificar este mensaje
                errorMessage.textContent = 'Error al procesar la respuesta del servidor (JSON inválido).';
                if (tableContainerParent) {
                    tableContainerParent.appendChild(errorMessage);
                } else {
                    existingTable.parentNode.insertBefore(errorMessage, existingTable);
                }
                console.error('Error parsing JSON:', error);
            }
        } else if (xhr.status === 404) {
            // Manejo de 404 (Endpoint no encontrado)
            existingTable.style.display = 'none'; // Ocultar la tabla
            const noDataMessage = document.createElement('p');
            noDataMessage.className = 'message-info'; // Clase para identificar este mensaje
            noDataMessage.textContent = 'El servicio solicitado no se encontró o no hay datos.';
            if (tableContainerParent) {
                tableContainerParent.appendChild(noDataMessage);
            } else {
                existingTable.parentNode.insertBefore(noDataMessage, existingTable);
            }
        } else {
            // Manejo de otros errores HTTP
            existingTable.style.display = 'none'; // Ocultar la tabla
            const errorMessage = document.createElement('p');
            errorMessage.className = 'message-error'; // Clase para identificar este mensaje
            errorMessage.textContent = `Error del servidor: ${xhr.status} ${xhr.statusText}`;
            if (tableContainerParent) {
                tableContainerParent.appendChild(errorMessage);
            } else {
                existingTable.parentNode.insertBefore(errorMessage, existingTable);
            }
            console.error('Error HTTP:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function () {
        // Manejo de errores de red
        existingTable.style.display = 'none'; // Ocultar la tabla
        const errorMessage = document.createElement('p');
        errorMessage.className = 'message-error'; // Clase para identificar este mensaje
        errorMessage.textContent = 'Error de conexión a la red. Verifica tu conexión a Internet.';
        if (tableContainerParent) {
            tableContainerParent.appendChild(errorMessage);
        } else {
            existingTable.parentNode.insertBefore(errorMessage, existingTable);
        }
        console.error('Error de red');
    };

    // Asegúrate de que este ID corresponda al input donde el usuario introduce el ID
    const id_user_input = document.getElementById('idTicket'); // Asumiendo que 'idTicket' es el ID de tu input
    let id_user_value = '';
    if (id_user_input) {
        id_user_value = id_user_input.value;
    } else {
        console.warn("Elemento con ID 'idTicket' no encontrado. La búsqueda podría no funcionar correctamente.");
        // Opcional: podrías mostrar un mensaje de error al usuario aquí
        // return; // Podrías detener la ejecución si el ID es crítico
    }

    // Envía el filtro como parámetro
    const datos = `action=getDomiciliacionTickets&id_user=${id_user_value}`;
    xhr.send(datos);
}

// Asegúrate de que esta función se llama cuando el DOM esté completamente cargado.
// Si tienes un botón para buscar, asóciala a ese botón.
document.addEventListener('DOMContentLoaded', searchDomiciliacionTickets);

// Si tienes un botón de búsqueda, podrías hacer algo como:
// document.getElementById('searchButtonId').addEventListener('click', searchDomiciliacionTickets);

// --- LÓGICA PARA EL MODAL DE CAMBIO DE ESTATUS DE DOMICILIACIÓN (EJEMPLO) ---
// Necesitarás un modal en tu HTML con el ID 'changeStatusDomiciliacionModal'
// Y elementos dentro de él para mostrar el ID del ticket, el estatus actual y un select para el nuevo estatus.

/*
Ejemplo de HTML para el modal (debes adaptarlo a tu estructura de Bootstrap/HTML):
<div class="modal fade" id="changeStatusDomiciliacionModal" tabindex="-1" aria-labelledby="changeStatusDomiciliacionModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="changeStatusDomiciliacionModalLabel">Cambiar Estatus de Domiciliación</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="changeStatusDomiciliacionForm">
          <div class="mb-3">
            <label for="modalTicketIdDomiciliacion" class="form-label">ID Ticket:</label>
            <input type="text" class="form-control" id="modalTicketIdDomiciliacion" readonly>
          </div>
          <div class="mb-3">
            <label for="modalCurrentStatusDomiciliacion" class="form-label">Estatus Actual:</label>
            <input type="text" class="form-control" id="modalCurrentStatusDomiciliacion" readonly>
          </div>
          <div class="mb-3">
            <label for="modalNewStatusDomiciliacionSelect" class="form-label">Nuevo Estatus:</label>
            <select class="form-select" id="modalNewStatusDomiciliacionSelect">
              <option value="">Seleccione un nuevo estatus</option>
              <option value="1">Pendiente</option>
              <option value="2">Solvente</option>
              <option value="3">Rechazado</option>
              </select>
          </div>
          <div id="errorMessageDomiciliacion" class="alert alert-danger" style="display:none;"></div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="saveStatusDomiciliacionChangeBtn">Guardar Cambios</button>
      </div>
    </div>
  </div>
</div>
*/

// Lógica para manejar el modal de cambio de estatus de domiciliación
// Asegúrate de que SweetAlert2 (Swal) esté cargado si lo estás utilizando
// <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

// --- LÓGICA PARA MANEJAR EL MODAL DE CAMBIO DE ESTATUS DE DOMICILIACIÓN ---
$(document).ready(function() {
    const changeStatusDomiciliacionModalElement = document.getElementById("changeStatusDomiciliacionModal");

    if (changeStatusDomiciliacionModalElement) {
        // Crea una instancia del modal de Bootstrap 5
        // Es CRÍTICO tener esta instancia para controlar el modal programáticamente
        const changeStatusDomiciliacionModal = new bootstrap.Modal(changeStatusDomiciliacionModalElement);

        const modalTicketIdDomiciliacion = changeStatusDomiciliacionModalElement.querySelector("#modalTicketIdDomiciliacion");
        const modalCurrentStatusDomiciliacion = changeStatusDomiciliacionModalElement.querySelector("#modalCurrentStatusDomiciliacion");
        const modalNewStatusDomiciliacionSelect = changeStatusDomiciliacionModalElement.querySelector("#modalNewStatusDomiciliacionSelect");
        const saveStatusDomiciliacionChangeBtn = changeStatusDomiciliacionModalElement.querySelector("#saveStatusDomiciliacionChangeBtn");
        const errorMessageDomiciliacion = changeStatusDomiciliacionModalElement.querySelector("#errorMessageDomiciliacion");

        // Event listener para el botón "Cambiar Estatus"
        // Utilizamos delegación de eventos con jQuery porque los botones se cargan dinámicamente con DataTables.
        // Cuando se hace clic en cualquier elemento con la clase 'cambiar-estatus-domiciliacion-btn'
        // dentro del 'document' (o un contenedor estático más cercano), se ejecuta la función.
        $(document).on('click', '.cambiar-estatus-domiciliacion-btn', function() {
            const idTicket = $(this).data('id');
            const currentStatusName = $(this).data('current-status-name');
            const currentStatusId = $(this).data('current-status-id');

            // Rellenar los campos del modal
            if (modalTicketIdDomiciliacion) modalTicketIdDomiciliacion.value = idTicket;
            if (modalCurrentStatusDomiciliacion) modalCurrentStatusDomiciliacion.value = currentStatusName;

            // Seleccionar el estatus actual en el dropdown si existe
            if (modalNewStatusDomiciliacionSelect) {
                // Reiniciar el select a la opción por defecto o al estatus actual
                modalNewStatusDomiciliacionSelect.value = currentStatusId;

                // Opcional: remover la deshabilitación de opciones anteriores y luego deshabilitar la actual
                // $(modalNewStatusDomiciliacionSelect).find('option').prop('disabled', false);
                // $(modalNewStatusDomiciliacionSelect).find(`option[value="${currentStatusId}"]`).prop('disabled', true);
            }

            // Limpiar cualquier mensaje de error previo
            if (errorMessageDomiciliacion) {
                errorMessageDomiciliacion.style.display = 'none';
                errorMessageDomiciliacion.innerHTML = '';
            }

            // ABRIR EL MODAL EXPLICITAMENTE AQUÍ USANDO LA INSTANCIA DE BOOTSTRAP
            // Esto asegura que el modal se abra cada vez que se haga clic en un botón,
            // especialmente si el botón fue agregado dinámicamente.
            changeStatusDomiciliacionModal.show();
        });

        // Event listener para el botón "Guardar Cambios" dentro del modal
        if (saveStatusDomiciliacionChangeBtn) {
            saveStatusDomiciliacionChangeBtn.addEventListener('click', function() {
                const idTicket = modalTicketIdDomiciliacion.value;
                const newStatusId = modalNewStatusDomiciliacionSelect.value;
                // Asumiendo que 'idTicket' es el ID de tu input donde se guarda el ID del usuario logueado
                const id_user_input = document.getElementById('idTicket');
                let id_user = '';
                if (id_user_input) {
                    id_user = id_user_input.value;
                } else {
                    console.warn("Elemento con ID 'idTicket' (para el ID de usuario) no encontrado.");
                }

                // Validar que se haya seleccionado un nuevo estatus
                if (!newStatusId || newStatusId === "" || newStatusId === "0") {
                    if (errorMessageDomiciliacion) {
                        errorMessageDomiciliacion.textContent = 'Por favor, selecciona un "Nuevo Estatus".';
                        errorMessageDomiciliacion.style.display = 'block';
                    }
                    return;
                }

                // Llamar a la función para actualizar el estatus en el backend
                updateDomiciliacionStatus(idTicket, newStatusId, id_user);

                // No necesitas cerrar el modal aquí si `updateDomiciliacionStatus`
                // ya lo cierra con Swal.fire willClose o una llamada directa a `changeStatusDomiciliacionModal.hide();`
            });
        }

        // Lógica para cerrar el modal usando la instancia de Bootstrap dentro de Swal.fire willClose
        // En tu función updateDomiciliacionStatus:
        // willClose: () => {
        //     searchDomiciliacionTickets();
        //     changeStatusDomiciliacionModal.hide(); // <<--- Asegúrate de usar esta instancia para cerrar
        // }
    }
});

// Función para enviar la actualización del estatus de domiciliación al backend
function updateDomiciliacionStatus(idTicket, newStatusId, id_user) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/tickets/updateDomiciliacionStatus`); // Nueva ruta de API para actualizar
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const changeStatusDomiciliacionModal = document.getElementById("changeStatusDomiciliacionModal");
    const errorMessageDomiciliacion = changeStatusDomiciliacionModal.querySelector("#errorMessageDomiciliacion");

    xhr.onload = function() {
        if (errorMessageDomiciliacion) {
            errorMessageDomiciliacion.style.display = 'none';
            errorMessageDomiciliacion.innerHTML = '';
        }

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Estatus de domiciliación actualizado correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Entendido',
                        confirmButtonColor: '#28a745',
                        color: 'black',
                        timer: 1500,
                        timerProgressBar: true,
                        willClose: () => {
                            // Recargar la tabla para reflejar los cambios
                            searchDomiciliacionTickets();
                            // Cerrar el modal (Bootstrap lo hace automáticamente con data-bs-dismiss)
                            // Si no usas Bootstrap, llama a tu función de cerrar modal aquí
                            $(changeStatusDomiciliacionModal).modal('hide'); // Para Bootstrap
                        }
                    });
                } else {
                    if (errorMessageDomiciliacion) {
                        errorMessageDomiciliacion.textContent = response.message || 'Error al actualizar el estatus de domiciliación.';
                        errorMessageDomiciliacion.style.display = 'block';
                    }
                    console.error('Error de API al actualizar estatus:', response.message);
                }
            } catch (error) {
                if (errorMessageDomiciliacion) {
                    errorMessageDomiciliacion.textContent = 'Error al procesar la respuesta del servidor.';
                    errorMessageDomiciliacion.style.display = 'block';
                }
                console.error('Error parsing JSON al actualizar estatus:', error);
            }
        } else {
            if (errorMessageDomiciliacion) {
                errorMessageDomiciliacion.textContent = `Error del servidor: ${xhr.status} ${xhr.statusText}`;
                errorMessageDomiciliacion.style.display = 'block';
            }
            console.error('Error HTTP al actualizar estatus:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function() {
        if (errorMessageDomiciliacion) {
            errorMessageDomiciliacion.textContent = 'Error de red al intentar actualizar el estatus.';
            errorMessageDomiciliacion.style.display = 'block';
        }
        console.error('Error de red al actualizar estatus.');
    };

    const datos = `action=updateDomiciliacionStatus&id_ticket=${idTicket}&new_status_id=${newStatusId}&id_user=${id_user}`;
    xhr.send(datos);
}
// Si tienes un botón de búsqueda, podrías hacer algo como:
// document.getElementById('searchButtonId').addEventListener('click', searchDomiciliacionTickets);