let currentTicketIdForConfirmTaller = null;
let currentNroTicketForConfirmTaller = null; // <--- NUEVA VARIABLE PARA EL NÚMERO DE TICKET
let confirmInTallerModalInstance = null;
let currentSerialPos = null; // <--- NUEVA VARIABLE PARA EL SERIAL POS
let currentTicketNroForImage = null;

// Variables globales para componentes (se inicializarán en DOMContentLoaded)
let modalComponentesEl = null;
let tbodyComponentes = null;
let contadorComponentes = null;
let modalComponentes = null;

// --- UTILIDADES DE UI Y ESTADO ---

/**
 * Actualiza el color de la fila basado en el estado del checkbox y su estado inicial.
 * @param {HTMLInputElement} checkbox - El checkbox que disparó el evento.
*/

// Función para actualizar los colores de la fila según el estado del checkbox
function actualizarColoresFila(checkbox) {
    const row = checkbox.closest('tr');
    if (!row) return;
    
    const isChecked = checkbox.checked;
    const initialState = checkbox.getAttribute('data-initial-checked') === 'true';
    
    // Remover todas las clases de color
    row.classList.remove('table-info', 'table-secondary', 'opacity-75');
    
    if (isChecked) {
        // Si está marcado, mostrar en azul
        row.classList.add('table-info');
    } else if (initialState) {
        // Si estaba marcado inicialmente y ahora está desmarcado, mostrar opaco
        row.classList.add('table-secondary', 'opacity-75');
    }
    // Si no estaba marcado inicialmente y sigue sin marcar, no agregar clase (estado normal)
}

// Función para actualizar el contador de componentes seleccionados
function actualizarContador() {
  if (!tbodyComponentes || !contadorComponentes) return;
  
  // Solo cuenta los checkboxes que están checked y que NO están deshabilitados
  const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:checked:not([disabled])');
  const selectAllCheckbox = document.getElementById('selectAllComponents');
    
  // Actualizar contador
  contadorComponentes.textContent = checkboxes.length;
    
  // Actualizar estado del checkbox "seleccionar todos"
  if (selectAllCheckbox) {
      // Solo consideramos los checkboxes que NO están deshabilitados para esta lógica
      const allCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:not([disabled])');
      const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
      const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
        
      selectAllCheckbox.checked = allChecked;
      selectAllCheckbox.indeterminate = someChecked && !allChecked;
  }
}

// Función para limpiar la selección de componentes
function limpiarSeleccion() {
  if (!tbodyComponentes) return;
  
  // Solo desmarca los checkboxes que NO están deshabilitados
  const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"].component-checkbox:not([disabled])');
  checkboxes.forEach(cb => {
    cb.checked = false;
    actualizarColoresFila(cb);
  });
    
  const selectAllCheckbox = document.getElementById('selectAllComponents');
  if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
  }
  actualizarContador();
}

/**
 * Envía los componentes seleccionados y deseleccionados al servidor para su guardado.
 * @param {string|number} ticketId 
 * @param {Array<number>} selectedComponents - IDs de componentes marcados o que siguen marcados.
 * @param {Array<number>} deselectedComponents - IDs de componentes que fueron desmarcados.
 * @param {string} serialPos - Número de serie del POS.
 * * NOTA: Asume que 'ENDPOINT_BASE', 'APP_PATH', 'Swal', 'modalComponentes' están definidos globalmente.
 */
function guardarComponentesSeleccionados(ticketId, selectedComponents, deselectedComponents, serialPos) {
    const id_user = document.getElementById('userId').value;
    const modulo = "Gestión Región";
    
    // 1. Validaciones y Limpieza de datos
    const ticketIdClean = String(ticketId).trim().replace(/['"]/g, '');
    const ticketIdNum = parseInt(ticketIdClean);
    const serialPosClean = serialPos ? serialPos.trim() : '';
    const idUserClean = id_user ? id_user.trim() : '';

    if (isNaN(ticketIdNum) || ticketIdNum <= 0) {
        Swal.fire({
            title: 'Error de Datos',
            text: 'El ID del ticket no es válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    
    if (!serialPosClean) {
        Swal.fire({
            title: 'Error de Datos',
            text: 'El serial del POS es requerido.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    
    if (!idUserClean) {
        Swal.fire({
            title: 'Error de Usuario',
            text: 'El ID de usuario es requerido.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    
    // Preparar objeto con componentes marcados y desmarcados
    const componentsData = {
        selected: selectedComponents || [],
        deselected: deselectedComponents || []
    };
    
    // 2. Configuración de la petición AJAX
    const xhr = new XMLHttpRequest();
    // Uso correcto de template literals para la URL
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/SaveComponents`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // 3. Manejo de la respuesta
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    Swal.fire({
                        title: '¡Éxito!',
                        // Uso correcto de template literals para el HTML
                        html: `Los Periféricos del Pos <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPosClean}</span> han sido guardados correctamente.`,
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        color: 'black',
                        confirmButtonColor: '#003594',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        keydownListenerCapture: true
                    }).then(() => {
                        modalComponentes.hide();
                        window.location.reload(); 
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.message || 'Error al guardar los componentes.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al procesar la respuesta del servidor.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } else {
            // Uso correcto de template literals
            Swal.fire({
                title: 'Error del Servidor',
                text: `Error al comunicarse con el servidor. Código: ${xhr.status}`,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    xhr.onerror = function() {
        Swal.fire({
            title: 'Error de Red',
            text: 'No se pudo conectar con el servidor.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    };
    
    // 4. Preparación de los datos a enviar y envío
    const dataToSend = `action=SaveComponents&ticketId=${ticketIdNum}&serialPos=${encodeURIComponent(serialPosClean)}&selectedComponents=${encodeURIComponent(JSON.stringify(componentsData))}&id_user=${encodeURIComponent(idUserClean)}&modulo=${encodeURIComponent(modulo)}`;
    
    xhr.send(dataToSend);
}

// --- FUNCIONES AUXILIARES DE CONTEXTO (Ajustar según tu entorno) ---

// Función para obtener el ticket ID (ajusta según tu estructura)
function obtenerTicketId() {
  return currentTicketIdForConfirmTaller;
}

// Función para obtener el nombre de la región (ajusta según tu estructura)
function obtenerRegionName() {
  const regionSelect = document.getElementById('AsiganrCoordinador');
  if (regionSelect && regionSelect.selectedOptions.length > 0) {
    return regionSelect.selectedOptions[0].text;
  }
  return 'Sin región asignada';
}

/**
 * Carga los componentes de un ticket desde el servidor, maneja la respuesta y muestra el modal.
 * * NOTA: Asume que 'tbodyComponentes', 'modalComponentes', 'ENDPOINT_BASE', 'APP_PATH', 
 * y 'actualizarContador' están definidos y son accesibles globalmente o en el scope.
 * * @param {string|number} ticketId - ID del ticket a consultar.
 * @param {string} regionName - Nombre de la región (actualmente no utilizado dentro de la función).
 * @param {string} serialPos - Número de serie del POS.
 */
function showSelectComponentsModal(ticketId, regionName, serialPos) {
    // 1. Validación de ticketId
    const ticketIdNum = parseInt(ticketId);

    if (!ticketId || isNaN(ticketIdNum) || ticketIdNum <= 0) {
        Swal.fire({
            title: 'Error',
            text: 'El ID del ticket no es válido o está vacío.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            color: 'black',
            confirmButtonColor: '#003594',
        });
        return;
    }
    
    if (!tbodyComponentes || !modalComponentes) {
        Swal.fire({
            title: 'Error',
            text: 'El modal de componentes no está disponible. Por favor, recargue la página.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            color: 'black',
            confirmButtonColor: '#003594',
        });
        return;
    }
    
    const xhr = new XMLHttpRequest();

    // 2. Destruir cualquier instancia de DataTable antes de mostrar el estado de carga
    if (typeof $ !== 'undefined' && $.fn.DataTable && $.fn.DataTable.isDataTable("#tablaComponentes")) {
        $("#tablaComponentes").DataTable().destroy();
    }
    
    // Mostrar estado de carga (Uso correcto de template literals)
    tbodyComponentes.innerHTML = `<tr><td colspan="2" class="text-center text-muted">Cargando componentes...</td></tr>`;
    
    // Uso correcto de template literals para la URL y Data
    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetComponents`;
    const dataToSendString = `action=GetComponents&ticketId=${ticketIdNum}`; // Usamos la variable numérica validada
    
    // 3. Configuración y envío de la petición AJAX
    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success && response.components) {
                    const components = response.components;
                    let componentsHtml = '';
                    
                    if (components.length > 0) {
                        const initialState = {};
                        
                        components.forEach(comp => {
                            // Limpieza de valores booleanos de PostgreSQL ('t'/'f')
                            const addValue = comp.add === true || comp.add === 't';
                            const deselectedValue = comp.add === false || comp.add === 'f';
                            
                            // Lógica de estado inicial (true = marcado, false/null = no marcado)
                            const isChecked = addValue;
                            
                            // Determinar clase CSS según el estado de la base de datos
                            let rowClass = '';
                            if (isChecked) {
                                rowClass = 'table-info'; // Azul para marcado (add = true)
                            } else if (deselectedValue) {
                                rowClass = 'table-secondary opacity-75'; // Opaco para desmarcado (add = false)
                            }
                            // Si 'add' es null o 'falsy', no se agrega clase (estado normal)
                            
                            // Guardar estado inicial para la comparación de cambios
                            initialState[comp.id_component] = isChecked;
                            
                            componentsHtml += `
                                <tr class="${rowClass}" data-component-id="${comp.id_component}" data-initial-state="${isChecked}">
                                    <td>
                                        <input type="checkbox" class="form-check-input component-checkbox" 
                                               value="${comp.id_component}" 
                                               data-initial-checked="${isChecked}"
                                               ${isChecked ? 'checked' : ''}>
                                    </td>
                                    <td>${comp.name_component}</td>
                                </tr>
                            `;
                        });
                        
                        // Guardar estado inicial en el tbody para comparar cambios al guardar
                        tbodyComponentes.setAttribute('data-initial-state', JSON.stringify(initialState));
                        
                        document.getElementById('btnGuardarComponentes').dataset.ticketId = ticketId;
                        document.getElementById('btnGuardarComponentes').dataset.serialPos = serialPos;

                    } else {
                        componentsHtml = `<tr><td colspan="2" class="text-center text-muted">No se encontraron componentes.</td></tr>`;
                    }
                    
                    // Destruir cualquier instancia de DataTable en la tabla de componentes si existe
                    if (typeof $ !== 'undefined' && $.fn.DataTable) {
                        if ($.fn.DataTable.isDataTable("#tablaComponentes")) {
                            $("#tablaComponentes").DataTable().destroy();
                        }
                    }
                    
                    // Guardar el contenido antes de establecerlo (por si DataTables lo modifica)
                    tbodyComponentes.setAttribute('data-saved-content', componentsHtml);
                    
                    // Establecer el contenido directamente
                    tbodyComponentes.innerHTML = componentsHtml;
                    
                    
                    // Título del Modal (Uso correcto de template literals)
                    document.getElementById('modalComponentesLabel').innerHTML = `
                        <i class="bi bi-box-seam-fill me-2"></i>Lista de Periféricos del Dispositivo <span class="badge bg-secondary">${serialPos}</span>
                    `;

                    // Mostrar el modal
                    modalComponentes.show();
                    
                    // Verificar inmediatamente después de mostrar
                    setTimeout(() => {
                        
                        // FORZAR VISIBILIDAD del tbody y elementos relacionados
                        const tableElement = document.getElementById('tablaComponentes');
                        const tableContainer = tableElement ? tableElement.closest('.table-responsive') : null;
                        const tableRow = tableContainer ? tableContainer.closest('.row') : null;
                        
                        // Hacer visible el tbody
                        if (tbodyComponentes) {
                            tbodyComponentes.style.display = '';
                            tbodyComponentes.style.visibility = 'visible';
                            tbodyComponentes.style.opacity = '1';
                            tbodyComponentes.style.height = 'auto';
                            tbodyComponentes.style.minHeight = 'auto';
                        }
                        
                        // Hacer visible la tabla
                        if (tableElement) {
                            tableElement.style.display = '';
                            tableElement.style.visibility = 'visible';
                            tableElement.style.opacity = '1';
                        }
                        
                        // Hacer visible el contenedor
                        if (tableContainer) {
                            tableContainer.style.display = '';
                            tableContainer.style.visibility = 'visible';
                            tableContainer.style.opacity = '1';
                        }
                        
                        // Hacer visible la fila contenedora
                        if (tableRow) {
                            tableRow.style.display = '';
                            tableRow.style.visibility = 'visible';
                            tableRow.style.opacity = '1';
                        }
                        
                        // Verificar que el contenido esté presente
                        const currentContent = tbodyComponentes.innerHTML;
                        const hasComponents = currentContent.includes('SimCard') || currentContent.includes('Pila') || currentContent.includes('Cargador');
                        
                        if (!hasComponents && componentsHtml) {
                            tbodyComponentes.innerHTML = componentsHtml;
                        }
                        
                        // Asegurarse de que las filas sean visibles
                        const rows = tbodyComponentes.querySelectorAll('tr');
                        rows.forEach((row, index) => {
                            row.style.display = '';
                            row.style.visibility = 'visible';
                            row.style.opacity = '1';
                            row.style.height = 'auto';
                            // Verificar las celdas también
                            const cells = row.querySelectorAll('td');
                            cells.forEach(cell => {
                                cell.style.display = '';
                                cell.style.visibility = 'visible';
                                cell.style.opacity = '1';
                            });
                        });
                        
                        // Eliminar solo elementos .dataTables_empty
                        const dataTablesEmpty = document.querySelectorAll('#tablaComponentes .dataTables_empty, #tbodyComponentes .dataTables_empty');
                        if (dataTablesEmpty.length > 0) {
                            dataTablesEmpty.forEach(el => el.remove());
                        }
                        
                        // Actualizar contador
                        actualizarContador();
                    }, 50);

                } else {
                    Swal.fire('Error', response.message || 'No se pudieron obtener los componentes.', 'error');
                }
            } catch (e) {
                Swal.fire('Error de Procesamiento', 'Hubo un problema al procesar la respuesta del servidor.', 'error');
            }
        } else {
            // Manejo de error del servidor (Uso correcto de template literals)
            Swal.fire('Error del Servidor', `No se pudo comunicar con el servidor. Código: ${xhr.status}`, 'error');
        }
    };

    xhr.onerror = function() {
        Swal.fire('Error de red', 'No se pudo conectar con el servidor para obtener los componentes.', 'error');
    };  
    
    xhr.send(dataToSendString);
}

function abrirModalComponentes(boton) {
    const modalCerrarComponnets = document.getElementById('BotonCerrarModal');
    
    // Obtener los valores de los atributos data
    // Intentar obtener de diferentes formas por compatibilidad
    const ticketId = boton.dataset.idTicket || boton.getAttribute('data-id-ticket') || boton.getAttribute('data-idTicket');
    const serialPos = boton.dataset.serialPos || boton.getAttribute('data-serial-pos') || boton.getAttribute('data-serialPos');

    // Validar ticketId
    if (!ticketId || ticketId === 'undefined' || ticketId === 'null' || ticketId === '' || ticketId === '0') {
        console.error('Error: ticketId no válido', { ticketId, boton: boton });
        Swal.fire({
            title: 'Atención',
            text: 'No se pudo obtener el ID del ticket. Por favor, verifique que el ticket esté seleccionado correctamente.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594',
        });
        return;
    }

    // Validar serialPos (puede ser opcional pero es mejor tenerlo)
    if (!serialPos || serialPos === 'undefined' || serialPos === 'null') {
        console.warn('Advertencia: serialPos no disponible', { serialPos, ticketId });
        // No bloqueamos la ejecución si serialPos está vacío, pero lo notificamos
    }

    const regionName = obtenerRegionName();

    if(modalCerrarComponnets){
      modalCerrarComponnets.addEventListener('click', function() {
        modalComponentes.hide();
      });
    }
    
    // Llamar a la función con el ticketId validado
    showSelectComponentsModal(ticketId, regionName, serialPos || '');
}

// Espera a que el DOM esté completamente cargado para asegurarse de que los elementos existen
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar referencias a elementos del modal de componentes
    modalComponentesEl = document.getElementById('modalComponentes');
    tbodyComponentes = document.getElementById('tbodyComponentes');
    contadorComponentes = document.getElementById('contadorComponentes');
    
    // Inicializa el modal de Bootstrap una sola vez.
    if (modalComponentesEl) {
        modalComponentes = new bootstrap.Modal(modalComponentesEl, {
            keyboard: false, backdrop:'static'
        });
        
        // Escuchar el evento 'show.bs.modal' para resetear el estado del modal cada vez que se abre
        modalComponentesEl.addEventListener('show.bs.modal', function () {
            // Destruir cualquier instancia de DataTable en la tabla de componentes si existe
            if (typeof $ !== 'undefined' && $.fn.DataTable && $.fn.DataTable.isDataTable("#tablaComponentes")) {
                $("#tablaComponentes").DataTable().destroy();
            }
            
            // Limpiar el contador y el checkbox de "seleccionar todos" cada vez que se abra el modal
            const selectAllCheckbox = document.getElementById('selectAllComponents');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
            }
            if (contadorComponentes) {
                contadorComponentes.textContent = '0';
            }
        });
        
        // Escuchar el evento 'shown.bs.modal' (después de que el modal se muestre completamente)
        modalComponentesEl.addEventListener('shown.bs.modal', function () {
            // Verificar y destruir DataTables después de que el modal esté completamente visible
            if (typeof $ !== 'undefined' && $.fn.DataTable && $.fn.DataTable.isDataTable("#tablaComponentes")) {
                $("#tablaComponentes").DataTable().destroy();
                // Si el tbody tiene contenido guardado, restaurarlo
                const savedContent = tbodyComponentes.getAttribute('data-saved-content');
                if (savedContent) {
                    tbodyComponentes.innerHTML = savedContent;
                }
            }
        });
    }
    
    // Escucha el evento click en el documento y usa delegación.
    document.addEventListener('click', function (e) {
        
        // 1. Botón para abrir el modal ('hiperbinComponents')
        if (e.target && e.target.id === 'hiperbinComponents' || e.target.closest('#hiperbinComponents')) {
            const botonClicado = e.target.closest('#hiperbinComponents');
            if (botonClicado) {
                abrirModalComponentes(botonClicado);
            }
        }

        // 2. Botón "Limpiar Selección"
        if (e.target && e.target.closest('.btn-outline-secondary.btn-sm') && e.target.closest('.modal-body')) {
            limpiarSeleccion();
        }

        // 3. Botón "Guardar Componentes"
        if (e.target && e.target.id === 'btnGuardarComponentes') {
            const ticketId = e.target.dataset.ticketId;
            const serialPos = e.target.dataset.serialPos;

            // Obtener todos los checkboxes y determinar cambios
            const allCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"].component-checkbox');
            const selectedComponents = [];
            const deselectedComponents = [];
            
            // Obtener estado inicial guardado
            const initialStateJson = tbodyComponentes.getAttribute('data-initial-state');
            const initialState = initialStateJson ? JSON.parse(initialStateJson) : {};
            
            allCheckboxes.forEach(checkbox => {
                const compId = parseInt(checkbox.value);
                const isCurrentlyChecked = checkbox.checked;
                const wasInitiallyChecked = initialState[compId] === true;
                
                // Lógica de envío: Solo enviar componentes que CAMBIARON de estado
                // Esto evita duplicaciones y procesamiento innecesario
                
                // 1. Componentes que cambiaron de desmarcado a marcado (nuevos)
                if (isCurrentlyChecked && !wasInitiallyChecked) {
                    selectedComponents.push(compId);
                } 
                
                // 2. Componentes que cambiaron de marcado a desmarcado
                // Solo enviar a desmarcar si estaba originalmente marcado (TRUE)
                if (!isCurrentlyChecked && wasInitiallyChecked) {
                    deselectedComponents.push(compId);
                } 
                // Si el estado no cambió (marcado sigue marcado, o desmarcado sigue desmarcado),
                // no se envía al backend para evitar procesamiento innecesario
            });
            
            // Enviar cambios (puede haber solo marcados, solo desmarcados, o ambos)
            guardarComponentesSeleccionados(ticketId, selectedComponents, deselectedComponents, serialPos);
        }

        // 4. Botón de cerrar el modal
        if (e.target && e.target.id === 'BotonCerrarModal') {
            modalComponentes.hide();
        }

        // 5. Checkbox "Seleccionar Todos"
        if (e.target && e.target.id === 'selectAllComponents') {
            const isChecked = e.target.checked;
            const enabledCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:not([disabled])');
            
            enabledCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                // Aplicar el color de fila después de cambiar el estado
                actualizarColoresFila(checkbox);
            });
            
            actualizarContador();
        }

        // 6. Checkboxes individuales de componentes
        if (e.target && e.target.type === 'checkbox' && e.target.closest('#tbodyComponentes')) {
            actualizarContador();
            actualizarColoresFila(e.target);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
        const confirmInTallerModalElement = document.getElementById("confirmInRosalModal");
        const CerramodalBtn = document.getElementById("CerrarButtonTallerRecib");


    // 2. Instanciar el modal de Bootstrap una sola vez
    if (confirmInTallerModalElement) {
      confirmInTallerModalInstance = new bootstrap.Modal(
        confirmInTallerModalElement,
        {
          backdrop: "static", // Para que no se cierre al hacer clic fuera
        }
      );
    }

    if (CerramodalBtn && confirmInTallerModalInstance) {
      CerramodalBtn.addEventListener("click", function () {
        if (confirmInTallerModalInstance) {
          confirmInTallerModalInstance.hide();
        }
      });
    }
});

$("#confirmTallerBtn").on("click", function () {
    const ticketIdToConfirm = currentTicketIdForConfirmTaller;
    const nroTicketToConfirm = currentNroTicketForConfirmTaller; // Si necesitas el nro_ticket aquí
    const serialPosToConfirm = currentSerialPos; // Si necesitas el serial_pos aquí
    

    if (ticketIdToConfirm) {
      updateTicketStatusInRegion(ticketIdToConfirm, nroTicketToConfirm, serialPosToConfirm);
      if (confirmInTallerModalInstance) {
        confirmInTallerModalInstance.hide();
      }
    } else {
      console.error("ID de ticket no encontrado para confirmar en taller.");
    }
});

let regionsData = [];

// Esta función ahora sí recibe el ID del técnico como parámetro
function getRegionsByTechnician(technicianId) {
    if (!technicianId) {
        document.getElementById("region-name").textContent = "No Asignada";
        document.getElementById("states-container").style.display = "none";
        return;
    }

    const xhr = new XMLHttpRequest();
    // Usa POST porque el ID del técnico se envía en el cuerpo de la solicitud
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetRegionsByTechnician`); 
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.regions && response.regions.length > 0) {
                    regionsData = response.regions; // Almacena toda la respuesta
                    
                    const uniqueRegionNames = [...new Set(regionsData.map(r => r.name_region))];
                    document.getElementById("region-name").textContent = uniqueRegionNames.join(', ');
                    
                    document.getElementById("states-container").style.display = "none";
                } else {
                    document.getElementById("region-name").textContent = "No Asignada";
                    document.getElementById("states-container").style.display = "none";
                    console.error("Error al obtener la región del técnico:", response.message);
                }
            } catch (error) {
                console.error("Error parsing JSON para las regiones:", error);
                document.getElementById("region-name").textContent = "Error en la respuesta";
                document.getElementById("states-container").style.display = "none";
            }
        } else {
            console.error("Error:", xhr.status, xhr.statusText);
            document.getElementById("region-name").textContent = "Error de conexión";
            document.getElementById("states-container").style.display = "none";
        }
    };
    
    // Envía el cuerpo de la solicitud. ¡Esto es lo que faltaba!
    const datos = `action=GetRegionsByTechnician&id_tecnico=${technicianId}`; 
    xhr.send(datos);
}

// AÑADE ESTE CÓDIGO para cargar los datos del técnico al inicio
document.addEventListener("DOMContentLoaded", function() {
    // Aquí debes obtener el ID del técnico actual
    // Por ejemplo, si tienes un input hidden con el ID del usuario logueado
    const currentTechnicianId = document.getElementById("userId").value; // Cambia "currentUserId" por el ID de tu input
    if (currentTechnicianId) {
        getRegionsByTechnician(currentTechnicianId);
    }
});

let globalTicketData = [];

function getTicketDataFinaljs() {
  const id_user = document.getElementById("userId").value;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketDataRegion`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  const detailsPanel = document.getElementById("ticket-details-panel");

  // Read nro_ticket from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const nroTicket = urlParams.get('nro_ticket');

  const tableElement = document.getElementById("tabla-ticket");
  const theadElement = tableElement
    ? tableElement.getElementsByTagName("thead")[0]
    : null;
  const tbodyElement = tableElement
    ? tableElement.getElementsByTagName("tbody")[0]
    : null;
  const tableContainer = document.querySelector(".table-responsive");

   // Mostrar el modal de selección
    const modalSelectOption = document.getElementById('visualizarImagenModal');
      
    let modalInstance = null;


    modalInstance = new bootstrap.Modal(modalSelectOption, {
      backdrop: "static",
    });


  const columnTitles = {
    nro_ticket: "N° Ticket",
    serial_pos: "Serial POS",
    rif: "Rif",
    name_failure: "Falla",
    full_name_tecnico: "Técnico Gestión",
    razonsocial_cliente: "Razón Social",
    name_status_ticket: "Estatus Ticket",
    name_process_ticket: "Proceso Ticket",
    name_accion_ticket: "Acción Ticket",
    name_status_payment: "Estatus Pago",
    nombre_estado_cliente: "Estado Cliente",
    full_name_tecnico_n2_actual: "Técnico 2",
    fecha_instalacion: "Fecha Instalación",
    estatus_inteliservices: "Estatus Inteliservices",
  };

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success) {
          const TicketData = response.ticket;
          currentTicketNroForImage = TicketData[0].nro_ticket;

          // MOSTRAR EL ESTADO DEL TICKET ACTIVO (no siempre el primero)
          if (TicketData && TicketData.length > 0) {
            // Buscar el ticket que tenga estado "En proceso" o "En la región"
            const activeTicket = TicketData.find(ticket => 
              ticket.name_status_ticket === 'En proceso' || 
              ticket.name_accion_ticket === 'En la región' ||
              ticket.name_accion_ticket === 'En espera de confirmar recibido en Región'
            ) || TicketData[0]; // Si no encuentra ninguno activo, usar el primero
            
            showTicketStatusIndicator(activeTicket.name_status_ticket, activeTicket.name_accion_ticket);
          } else {
            hideTicketStatusIndicator();
          }

          
          if (TicketData && TicketData.length > 0) {
            // Destroy DataTables if it's already initialized on this table
            if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
              $("#tabla-ticket").DataTable().destroy();
              if (theadElement) theadElement.innerHTML = ""; // Clear old headers
              if (tbodyElement) tbodyElement.innerHTML = ""; // Clear old body
            }

            const allDataKeys = Object.keys(TicketData[0] || {});
            const columnsConfig = [];

            columnsConfig.push({
              title: "N°",
              orderable: false,
              searchable: false,
              render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
              },
            });

            for (const key in columnTitles) {
              if (allDataKeys.includes(key)) {
                const isVisible = TicketData.some((item) => {
                  const value = item[key];
                  return (
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
                  );
                });

                const columnDef = {
                  data: key,
                  title: columnTitles[key],
                  defaultContent: "",
                  visible: isVisible,
                };

                const displayLengthForTruncate = 25;

                // ************* APLICAR LÓGICA DE TRUNCADO A FALLA *************
                if (key === "name_failure") {
                  columnDef.render = function (data, type, row) {
                    if (type === "display" || type === "filter") {
                      const fullText = String(data || "").trim();
                      if (fullText.length > displayLengthForTruncate) {
                        return `<span class="truncated-cell" data-full-text="${fullText}">${fullText.substring(
                          0,
                          displayLengthForTruncate
                        )}...</span>`;
                      }
                      return fullText;
                    }
                    return data;
                  };
                }
                // ************* FIN: APLICAR LÓGICA DE TRUNCADO A FALLA *************

                // ************* APLICAR LÓGICA DE TRUNCADO A STATUS_PAYMENTS *************
                if (key === "name_status_payment") {
                  const displayLength = 25;
                  columnDef.render = function (data, type, row) {
                    const fullText = String(data || "").trim();
                    if (fullText.length > displayLength) {
                      return `<span class="truncated-cell" data-full-text="${fullText}">${fullText.substring(0, displayLength)}...</span>`;
                    } else {
                      return `<span class="full-text-cell" data-full-text="${fullText}">${fullText}</span>`;
                    }
                  };
                }
                // ************* FIN: APLICAR LÓGICA DE TRUNCADO A STATUS_PAYMENTS *************
                columnsConfig.push(columnDef);
              }
            }

            // Añadir la columna "Acción" al final
            columnsConfig.push({
              data: null,
              title: "Acción",
              orderable: false,
              searchable: false,
              className: "dt-body-center",
              render: function (data, type, row) {
                const idTicket = row.id_ticket;
                const serialPos = row.serial_pos;
                const nroTicket = row.nro_ticket;
                const name_status_payment = row.name_status_payment;
                const currentStatusLab = row.status_taller;
                const name_accion_ticket = (row.name_accion_ticket || "").trim();
                const name_status_domiciliacion = (row.name_status_domiciliacion || "").trim();
                const nombre_estado_cliente = row.nombre_estado_cliente;
                const hasEnvioDestinoDocument = row.document_types_available && row.document_types_available.includes('Envio_Destino');
                const HasDevolution = row.devolution

                let actionButton = '';

                // Prioridad 1: Validar si el ticket está en espera de ser recibido en el Rosal
                if (name_accion_ticket === "En espera de confirmar recibido en Región") {
                  actionButton = `<button type="button" class="btn btn-warning btn-sm received-ticket-btn" title = "Marcar Como recibido en la región"
                    data-id-ticket="${idTicket}"
                    data-serial-pos="${serialPos}"
                    data-nro-ticket="${nroTicket}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16">
                      <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"/>
                    </svg>
                  </button>`;
                } else {
                  actionButton = `<button type="button" class="btn btn-primary btn-sm deliver-ticket-btn" title = "Entregar a cliente"
                    data-id-ticket="${idTicket}"
                    data-serial-pos="${serialPos}"
                    data-nro-ticket="${nroTicket}"
                    data-has_devolution="${HasDevolution}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-check-fill" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0m-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                    </svg>
                  </button>`;
                }
                return actionButton;
              },
            });

            // Añadir la columna "Imagen"
           // Añadir la columna "Imagen"
            columnsConfig.push({
              data: null,
              title: "Vizualizar Documentos",
              orderable: false,
              searchable: false,
              width: "8%",
              render: function (data, type, row) {
                const idTicket = row.id_ticket;
                const nroTicket = row.nro_ticket;
                const accionllaves = row.name_accion_ticket;
                const hasEnvioDestinoDocument = row.document_types_available && row.document_types_available.includes('Envio_Destino');

                const nombre_estado_cliente = row.nombre_estado_cliente;
               
                 // Validar si el ticket está en la región y si el documento de envío fue subido
                const envioUrl = row.envio_document_url;
                const exoneracionUrl = row.exoneracion_document_url;
                const pagoUrl = row.pago_document_url;

                if (hasEnvioDestinoDocument) {
                  // Se asume que el estatus "En la región" significa que el documento ya fue subido y puede ser visto
                  if(row.name_accion_ticket === "En la región" || row.name_accion_ticket === "Entregado a Cliente"){
                    // Verificar si hay al menos un documento disponible
                     
                    const hasAnyDocument = envioUrl || exoneracionUrl || pagoUrl;
                  // ... existing code ...
                 if (hasAnyDocument) {
                    return `<button type="button" class="btn btn-success btn-sm btn-document-actions-modal" title = "Vizualizar Documentos"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        title="Vizualizar Documentos"
                        data-nombre-estado="${nombre_estado_cliente}"
                        data-ticket-id="${idTicket}"
                        data-nro-ticket="${nroTicket}"
                        data-pdf-zoom-url="${row.envio_document_url || ''}"
                        data-envio-filename="${row.envio_original_filename || ''}"
                        data-exoneracion-url="${row.exoneracion_document_url || ''}"
                        data-exoneracion-filename="${row.exoneracion_original_filename || ''}"
                        data-pago-url="${row.pago_document_url || ''}"
                        data-pago-filename="${row.pago_original_filename || ''}"
                        data-envio-destino="${row.envio_destino_document_url || ''}"
                        data-envio-destino-filename="${row.envio_destino_original_filename || ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>                    
                      </button>`;
                
            
                    } else {
                      return `<button type="button" class="btn btn-secondary btn-sm disabled">No hay Documentos Cargados</button>`;
                    }
                  } else {
                    return `<button type="button" class="btn btn-secondary btn-sm disabled">Confirme Recibido</button>`; 
                  }
                } else {
                  return `<button type="button" class="btn btn-secondary btn-sm disabled">No hay Documentos Cargados</button>`;
                }
              },
            });

            // Initialize DataTables
            const dataTableInstance = $(tableElement).DataTable({
              responsive: false,
              scrollX: "200px", // Considera usar true o un valor más dinámico como '100%'
              data: TicketData,
              columns: columnsConfig,
              pagingType: "simple_numbers",
              lengthMenu: [5, 10, 25, 50, 100],
              autoWidth: false,
              buttons: [
                {
                  extend: "colvis", // Column visibility button
                  text: "Mostrar/Ocultar Columnas",
                  className: "btn btn-secondary",
                },
              ],
              language: {
                lengthMenu: "Mostrar _MENU_",
                emptyTable: "No hay datos disponibles en la tabla",
                zeroRecords: "No se encontraron resultados para la búsqueda",
                info: "_TOTAL_ Registros",
                infoEmpty: "No hay datos disponibles",
                infoFiltered: " de _MAX_ Disponibles",
                search: "Buscar:",
                loadingRecords: "Cargando...",
                processing: "Procesando...",
                paginate: {
                  first: "Primero",
                  last: "Último",
                  next: "Siguiente",
                  previous: "Anterior",
                },
                buttons: {
                  colvis: "Visibilidad de Columna",
                },
              },
              
              dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
              initComplete: function (settings, json) {
                const api = this.api();

                const buttonsHtml = `
                  <button id="btn-por-asignar" class="btn btn-primary me-2" title="Pendiente por confirmar recibido en la Región">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                      <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                    </svg>
                  </button>

                  <button id="btn-recibidos" class="btn btn-secondary me-2" title="Tickets en la Región">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
                      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
                    </svg>
                  </button>

                  <button id="btn-asignados" class="btn btn-secondary me-2" title="Entregados al Cliente">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                  </button>`;
                $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

                function setActiveButton(activeButtonId) {
                  $("#btn-por-asignar")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");
                  $("#btn-asignados")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");
                  $("#btn-recibidos")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");
                  $("#btn-reasignado")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");
                  $(`#${activeButtonId}`)
                    .removeClass("btn-secondary")
                    .addClass("btn-primary");
                }

                // Función para verificar si hay datos en una búsqueda específica
                function checkDataExists(searchTerm) {
                  api.columns().search('').draw(false);
                  api.column(9).search(searchTerm, true, false).draw();
                  const rowCount = api.rows({ filter: 'applied' }).count();
                  return rowCount > 0;
                }

                function applyNroTicketSearch(options = {}) {
                  const { showWarning = true, warningText } = options || {};
                  if (!nroTicket) {
                    return false;
                  }

                  api.search(nroTicket).draw(false);
                  let ticketFound = false;
                  api.rows({ filter: 'applied' }).every(function () {
                    const rowData = this.data();
                    if (rowData.nro_ticket === nroTicket) {
                      $(this.node()).addClass('table-active');
                      this.node().scrollIntoView({ behavior: 'smooth', block: 'center' });
                      ticketFound = true;
                    } else {
                      $(this.node()).removeClass('table-active');
                    }
                  });

                  if (!ticketFound) {
                    if (showWarning) {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Ticket no encontrado',
                        text: warningText || `El ticket ${nroTicket} no se encuentra en este filtro.`,
                        confirmButtonText: 'Ok',
                        color: 'black',
                        confirmButtonColor: '#003594'
                      });
                    }
                    api.search('').draw(false);
                    $('.dataTables_filter input').val('');
                    return false;
                  }

                  $('.dataTables_filter input').val(nroTicket);
                  return true;
                }

                const filterConfigs = [
                  {
                    button: "btn-por-asignar",
                    term: "^En espera de confirmar recibido en Región$",
                    status: 'En proceso',
                    action: 'En espera de confirmar recibido en Región',
                    adjustColumns: () => {
                      api.column(15).visible(true);
                      api.column(11).visible(false);
                      api.column(13).visible(true);
                    }
                  },
                  {
                    button: "btn-recibidos",
                    term: "^En la región$",
                    status: 'En proceso',
                    action: 'En la región',
                    adjustColumns: () => {
                      api.column(15).visible(true);
                    }
                  },
                  {
                    button: "btn-asignados",
                    term: "^Entregado a Cliente$",
                    status: 'Cerrado',
                    action: 'Entregado a Cliente',
                    adjustColumns: () => {
                      api.column(15).visible(false);
                    }
                  }
                ];

                function applyFilterConfig(config) {
                  if (!config) return;
                  api.columns().search('').draw(false);
                  api.column(9).search(config.term, true, false).draw();
                  config.adjustColumns();
                  setActiveButton(config.button);
                  showTicketStatusIndicator(config.status, config.action);
                }

                // Función para buscar automáticamente el primer botón con datos
                function findFirstButtonWithData() {
                  let fallbackConfig = null;
                  let ticketFoundConfig = null;
                  let ticketFound = false;

                  for (const config of filterConfigs) {
                    const hasData = checkDataExists(config.term);
                    if (!hasData) {
                      continue;
                    }

                    if (!fallbackConfig) {
                      fallbackConfig = config;
                    }

                    if (nroTicket) {
                      const filteredRows = api.rows({ filter: 'applied' }).data().toArray();
                      const hasTicket = filteredRows.some(row => row?.nro_ticket === nroTicket);
                      if (hasTicket) {
                        ticketFoundConfig = config;
                        ticketFound = true;
                        break;
                      }
                    } else {
                      ticketFoundConfig = config;
                      break;
                    }
                  }

                  if (!ticketFoundConfig && fallbackConfig) {
                    ticketFoundConfig = fallbackConfig;
                  }

                  if (ticketFoundConfig) {
                    applyFilterConfig(ticketFoundConfig);
                    if (nroTicket) {
                      applyNroTicketSearch({
                        showWarning: !ticketFound,
                        warningText: `El ticket ${nroTicket} no se encuentra en los datos disponibles.`
                      });
                    }
                    return true;
                  }

                  api.columns().search('').draw(false);
                  api.column(9).search("NO_DATA_FOUND").draw();
                  setActiveButton("btn-por-asignar");
                  showTicketStatusIndicator('Cerrado', 'Sin estado');

                  const tbody = document.querySelector("#tabla-ticket tbody");

                  if (nroTicket) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Ticket no encontrado',
                      text: `El ticket ${nroTicket} no se encuentra en los datos disponibles.`,
                      confirmButtonText: 'Ok',
                      color: 'black',
                      confirmButtonColor: '#003594'
                    });
                  }

                  return false;
                }

                // Ejecutar la búsqueda automática al inicializar
                findFirstButtonWithData();

                const configMap = filterConfigs.reduce((acc, cfg) => {
                  acc[cfg.button] = cfg;
                  return acc;
                }, {});

                // Event listeners para los botones (mantener la funcionalidad manual)
                $("#btn-por-asignar").on("click", function () {
                  const config = configMap["btn-por-asignar"];
                  if (config && checkDataExists(config.term)) {
                    applyFilterConfig(config);
                    applyNroTicketSearch();
                  } else {
                    findFirstButtonWithData();
                  }
                });

                $("#btn-recibidos").on("click", function () {
                  const config = configMap["btn-recibidos"];
                  if (config && checkDataExists(config.term)) {
                    applyFilterConfig(config);
                    applyNroTicketSearch();
                  } else {
                    findFirstButtonWithData();
                  }
                });

                $("#btn-asignados").on("click", function () {
                  const config = configMap["btn-asignados"];
                  if (config && checkDataExists(config.term)) {
                    applyFilterConfig(config);
                    applyNroTicketSearch();
                  } else {
                    findFirstButtonWithData();
                  }
                });
              },
            });

            // === REST OF YOUR EXISTING CODE ===
            // (Mantener todo el código existente de event listeners, etc.)

            // ************* INICIO: LÓGICA PARA EL CHECKBOX "CARGAR LLAVE" *************
            $("#tabla-ticket tbody")
              .off("change", ".receive-key-checkbox")
              .on("change", ".receive-key-checkbox", function (e) {
                e.stopPropagation();

                const ticketId = $(this).data("id-ticket");
                const nroTicket = $(this).data("nro-ticket");
                const isChecked = $(this).is(":checked");
                const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;

                if (isChecked) {
                  Swal.fire({
                    title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                      <div class="custom-modal-header-content">Confirmación de Carga de Llaves</div>
                    </div>`,
                    html: `<div class="custom-modal-body-content">
                      <div class="mb-4">
                        ${customWarningSvg}
                      </div> 
                      <p class="h4 mb-3" style="color: black;">¿Desea marcar el Ticket Nro: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> como "Llaves Cargadas".?</p> 
                      <p class="h5" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Esta acción registrará la fecha de la carga de llaves</p>`,
                    confirmButtonText: "Confirmar",
                    color: "black",
                    confirmButtonColor: "#003594",
                    cancelButtonText: "Cancelar",
                    focusConfirm: false,
                    allowOutsideClick: false,
                    showCancelButton: true,
                    allowEscapeKey: false,
                    keydownListenerCapture: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      MarkDateKey(ticketId, nroTicket);
                      $(this).prop('checked', true);
                    } else {
                      $(this).prop('checked', false);
                    }
                  });
                }
              });

             $(document).on("click", ".deliver-ticket-btn", function () {
                  const idTicket = $(this).data("id-ticket");
                  const nroTicket = $(this).data("nro-ticket"); 
                  const serialPos = $(this).data("serial-pos"); 
                  const customDeliverSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                  const id_user = document.getElementById('userId').value;
                  const devolution = $(this).data("has_devolution"); 

                  Swal.fire({
                      title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                          <div class="custom-modal-header-content">Confirmación de Entrega al Cliente</div>
                      </div>`,
                      html: `<div class="custom-modal-body-content">
                          <div class="mb-4">
                              ${customDeliverSvg}
                          </div> 
                          <p class="h4 mb-3" style="color: black;">¿Desea marcar el dispositivo con serial <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> del Ticket Nro: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> como "Entregado al Cliente"?</p> 
                          <p class="h5" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">Esta acción registrará la fecha de entrega al cliente.</p>
                      </div>`,
                      confirmButtonText: "Confirmar Entrega",
                      color: "black",
                      confirmButtonColor: "#003594",
                      cancelButtonText: "Cancelar",
                      focusConfirm: false,
                      allowOutsideClick: false,
                      showCancelButton: true,
                      allowEscapeKey: false,
                      keydownListenerCapture: true,
                      screenX: false,
                      screenY: false,
                  }).then((result) => {
                      if (result.isConfirmed) {
                          // NUEVA VALIDACIÓN: Si devolution es true, proceder directamente
                          if (devolution === true || devolution === 'true' || devolution === 't') {
                              // Proceder directamente con la entrega sin comentario
                              procesarEntrega(idTicket, null, id_user, nroTicket, serialPos, true); // true = es devolución
                          } else {
                              // Mostrar modal de comentario (código existente)
                              Swal.fire({
                                  title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                                      <div class="custom-modal-header-content">Detalles de la Entrega</div>
                                  </div>`,
                                  html: `<div class="custom-modal-body-content">
                                      <p class="h4 mb-1" style="color: black;">Por favor, ingrese un comentario o un texto adicional sobre el Dispositivo a entregar con el Serial: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">${serialPos}</span> asociado al Nro de ticket: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">${nroTicket}</span>.</p>
                                      <div class="form-group mb-3"><br>
                                          <textarea id="comentarioEntrega" class="form-control" rows="3" placeholder="Escriba aquí cualquier detalle relevante sobre la entrega... O reparación del Equipo"></textarea>
                                      </div>
                                  </div>`,
                                  showCancelButton: true,
                                  confirmButtonText: 'Guardar y Completar',
                                  cancelButtonText: 'Cancelar',
                                  confirmButtonColor: '#003594',
                                  color: "black",
                                  focusConfirm: false,
                                  allowOutsideClick: false,
                                  allowEscapeKey: false,
                                  keydownListenerCapture: true,
                                  screenX: false,
                                  screenY: false,
                                  width: '600px',
                                  customClass: {
                                      popup: 'no-scroll'
                                  },
                                  preConfirm: () => {
                                      const comentario = Swal.getPopup().querySelector('#comentarioEntrega').value.trim();
                                      if (!comentario) {
                                          Swal.showValidationMessage('El campo de texto no puede estar vacío.');
                                          return false;
                                      }
                                      return { comentario: comentario };
                                  }
                              }).then((resultFinal) => {
                                  if (resultFinal.isConfirmed) {
                                      const comentario = resultFinal.value.comentario;
                                      procesarEntrega(idTicket, comentario, id_user, nroTicket, serialPos, false); // false = no es devolución
                                  }
                              });
                          }
                      }
                  });
              });

                    // NUEVA FUNCIÓN: Procesar la entrega (reutilizable)
                    function procesarEntrega(idTicket, comentario, id_user, nroTicket, serialPos, esDevolucion) {
                        const dataToSendString = `action=entregar_ticket&id_ticket=${encodeURIComponent(idTicket)}&comentario=${encodeURIComponent(comentario)}&id_user=${encodeURIComponent(id_user)}`;

                        const xhr = new XMLHttpRequest();
                        const url = `${ENDPOINT_BASE}${APP_PATH}api/consulta/entregar_ticket`;

                        xhr.open('POST', url, true);
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                        xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                try {
                                    const response = JSON.parse(xhr.responseText);

                                    if (response.success) {
                                        // Mostrar el primer modal (Entrega exitosa)
                                        Swal.fire({
                                            icon: "success",
                                            title: "Entrega Exitosa",
                                            text: response.message,
                                            color: "black",
                                            timer: 2500,
                                            timerProgressBar: true,
                                            didOpen: () => {
                                                Swal.showLoading();
                                            },
                                            willClose: () => {
                                                // Cuando el primer modal se cierra, mostramos el segundo modal con detalles
                                                const ticketData = response.ticket_data;

                                                if (ticketData) {
                                                    // NUEVO: Mostrar comentario según el tipo de ticket
                                                    let comentarioHTML;
                                                    if (esDevolucion === true || esDevolucion === 't') {
                                                        // Para tickets devueltos: usar la lógica existente
                                                        comentarioHTML = `<strong>📝Comentario Devolución:</strong> ${ticketData.comment_devolution || "N/A"}`;
                                                    } else {
                                                        // Para tickets normales: mostrar comentario de entrega
                                                        comentarioHTML = `<strong>📝 Comentario de Entrega:</strong> ${ticketData.customer_delivery_comment || "Sin comentarios"}`;
                                                    }

                                                    let headerComment;
                                                    if (esDevolucion === true || esDevolucion === 't') {
                                                        headerComment = "¡POS Devuelto!";
                                                    } else {
                                                        headerComment = "¡POS Entregado!";
                                                    }

                                                    const beautifulHtmlContent = `
                                                        <div style="text-align: left; padding: 15px;">
                                                            <h3 style="color: #28a745; margin-bottom: 15px; text-align: center;">✅ ${headerComment} ✅</h3>
                                                            <p style="font-size: 1.1em; margin-bottom: 10px;">
                                                                <strong>🎫 Nro. de Ticket:</strong> <span style="font-weight: bold; color: #d9534f;">${ticketData.nro_ticket}</span>
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>🏢 RIF:</strong> ${ticketData.rif_cliente || "N/A"}
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>🏢Razon Social:</strong> ${ticketData.razonsocial_cliente || "N/A"}
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>⚙️ Serial del Equipo:</strong> <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticketData.serial_pos}</span>
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                ${comentarioHTML}
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>👤 Usuario que Realizó la Entrega:</strong> ${ticketData.user_gestion || "N/A"}
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>🧑‍💻 Coordinador Asignado:</strong> ${ticketData.user_coordinator|| "N/A"}
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>📅 Fecha de Entrega:</strong> ${ticketData.date_create_ticket || "N/A"}
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>📅 Fecha de Cierre:</strong> ${ticketData.date_end_ticket ||  "N/A"}
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>🔄 Estado del Ticket:</strong> <span style="color: #28a745; font-weight: bold;">${ticketData.name_status_ticket}</span>
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>📋 Acción del Ticket:</strong> <span style="color: #007bff; font-weight: bold;">${ticketData.name_accion_ticket}</span>
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>📊Estado de Domiciliación:</strong> <span style="color: #6f42c1; font-weight: bold;">${ticketData.name_status_domiciliacion || "N/A"}</span>
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>💰 Estado de Pago:</strong> <span style="color: #fd7e14; font-weight: bold;">${ticketData.name_status_payment || "N/A"}</span>
                                                            </p>
                                                            <p style="margin-bottom: 8px;">
                                                                <strong>🔬 Estado del Taller:</strong> <span style="color: #20c997; font-weight: bold;">${ticketData.name_status_lab || "N/A"}</span>
                                                            </p>
                                                            <strong>
                                                                <p style="font-size: 0.9em; color: green; margin-top: 20px; text-align: center;">
                                                                    El ticket ha sido marcado como entregado y cerrado exitosamente.<br>
                                                                    <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Se ha registrado en el historial del sistema además Se le ha enviado una notificación al correo</span>
                                                                </p>
                                                            </strong>
                                                        </div>`;

                                                    Swal.fire({
                                                        icon: "success",
                                                        title: "Detalles de la Entrega",
                                                        html: beautifulHtmlContent,
                                                        color: "black",
                                                        confirmButtonText: "Cerrar",
                                                        confirmButtonColor: "#003594",
                                                        showConfirmButton: true,
                                                        showClass: {
                                                            popup: "animate__animated animate__fadeInDown",
                                                        },
                                                        hideClass: {
                                                            popup: "animate__animated animate__fadeOutUp",
                                                        },
                                                        allowOutsideClick: false,
                                                        allowEscapeKey: false,
                                                        width: '700px'
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            enviarCorreoTicketCerrado(ticketData);
                                                            window.location.reload();
                                                        }
                                                    });
                                                } else {
                                                    // Si no hay datos del ticket, mostrar solo mensaje de éxito
                                                    Swal.fire({
                                                        icon: "success",
                                                        title: "Entrega Exitosa",
                                                        text: "El ticket ha sido entregado exitosamente.",
                                                        confirmButtonText: "Cerrar",
                                                        confirmButtonColor: "#003594"
                                                    }).then(() => {
                                                        window.location.reload();
                                                    });
                                                }
                                            },
                                        });
                                    } else {
                                        Swal.fire('Error', response.message || 'Error al procesar la entrega', 'error');
                                    }
                                } catch (error) {
                                    console.error('Error al parsear la respuesta:', error);
                                    Swal.fire('Error', 'Error al procesar la respuesta del servidor', 'error');
                                }
                            } else {
                                Swal.fire('Error', 'Hubo un problema al conectar con el servidor. Código de estado: ' + xhr.status, 'error');
                            }
                        };

                        xhr.onerror = function() {
                            Swal.fire('Error de red', 'Hubo un problema con la conexión.', 'error');
                        };

                        xhr.send(dataToSendString);
                    }

            $("#tabla-ticket tbody")
              .off("click", ".received-ticket-btn")
              .on("click", ".received-ticket-btn", function (e) {
                e.stopPropagation();
                const ticketId = $(this).data("id-ticket");
                const nroTicket = $(this).data("nro-ticket");
                const serialPos = $(this).data("serial-pos") || "";

                currentTicketIdForConfirmTaller = ticketId;
                currentNroTicketForConfirmTaller = nroTicket;
                currentSerialPos = serialPos;

                $("#modalTicketIdConfirmTaller").val(ticketId);
                $("#modalHiddenNroTicketConfirmTaller").val(nroTicket);
                $("#serialPost").text(serialPos);

                $("#modalTicketIdConfirmTaller").text(nroTicket);

                if (confirmInTallerModalInstance) {
                  confirmInTallerModalInstance.show();
                } else {
                  console.error(
                    "La instancia del modal 'confirmInTallerModal' no está disponible."
                  );
                }
              });

            // ************* FIN: LÓGICA PARA EL CHECKBOX "CARGAR LLAVE" *************

            $("#tabla-ticket tbody").on("click", ".truncated-cell", function (e) {
              e.stopPropagation();

              const cell = $(this);
              const fullText = cell.data("full-text");
              const displayLength = 25;
              const currentText = cell.text();

              if (currentText.endsWith("...")) {
                cell.text(fullText);
              } else {
                cell.text(fullText.substring(0, displayLength) + "...");
              }
            });

            // === ADD THE CLICK EVENT LISTENER FOR TABLE ROWS HERE ===
            $("#tabla-ticket tbody")
              .off("click", "tr")
              .on("click", "tr", function (e) {
                // Verificar si el clic fue en un botón, enlace o input
                const clickedElement = $(e.target);
                const isButton = clickedElement.is('button') || 
                                clickedElement.closest('button').length > 0 ||
                                clickedElement.is('a') || 
                                clickedElement.closest('a').length > 0 ||
                                clickedElement.is('input') || 
                                clickedElement.closest('input').length > 0 ||
                                clickedElement.hasClass('truncated-cell') ||
                                clickedElement.hasClass('full-text-cell');
                
                // Si el clic fue en un botón/enlace, permitir que el evento continúe normalmente
                if (isButton) {
                    return; // No hacer nada, dejar que el botón maneje su propio evento
                }
                
                // Solo ocultar overlay si el clic fue directamente en la fila
                // 1. Matamos cualquier otro handler (por si acaso)
                e.stopPropagation();
                
                // 2. FORZAMOS que el overlay esté oculto, aunque otro script lo muestre
                $('#loadingOverlay').removeClass('show').hide();
                
                // 3. Si el script usa opacity o visibility, también lo matamos
                $('#loadingOverlay').css({
                    'display': 'none',
                    'opacity': '0',
                    'visibility': 'hidden'
                });
                
                // Pequeño timeout por si el otro script lo muestra después (raro, pero pasa)
                setTimeout(() => {
                    $('#loadingOverlay').hide();
                }, 50);

                const tr = $(this);
                const rowData = dataTableInstance.row(tr).data();

                if (!rowData) {
                  return;
                }

                $("#tabla-ticket tbody tr").removeClass("table-active");
                tr.addClass("table-active");

                const ticketId = rowData.id_ticket;

                const selectedTicketDetails = TicketData.find(
                  (t) => t.id_ticket == ticketId
                );

                if (selectedTicketDetails) {
                detailsPanel.innerHTML = formatTicketDetailsPanel(selectedTicketDetails);
                loadTicketHistory(ticketId, selectedTicketDetails.nro_ticket, selectedTicketDetails.serial_pos || '');
                  if (selectedTicketDetails.serial_pos) {
                    downloadImageModal(selectedTicketDetails.serial_pos);
                  } else {
                    const imgElement = document.getElementById(
                      "device-ticket-image"
                    );
                    if (imgElement) {
                      imgElement.src = '/public/img/consulta_rif/POS/mantainment.png';
                      imgElement.alt = "Serial no disponible";
                    }
                  }
                } else {
                  detailsPanel.innerHTML =
                    "<p>No se encontraron detalles para este ticket.</p>";
                }
              });

          }
        } else {
          console.error("Error from API:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      console.error("Error 404:", xhr.statusText);
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    if (tableContainer) {
      tableContainer.innerHTML = "<p>Error de red.</p>";
      tableContainer.style.display = "";
    }
    console.error("Error de red");
  };
  const datos = `action=GetTicketDataRegion&id_user=${encodeURIComponent(id_user)}`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getTicketDataFinaljs);

// Agregar después de la inicialización de DataTables
 // 1. Instanciar todos los modales al inicio
    const documentActionsModal = new bootstrap.Modal(document.getElementById('documentActionsModal'));
    const uploadDocumentModal = new bootstrap.Modal(document.getElementById('uploadDocumentModal'));
    const viewDocumentModal = new bootstrap.Modal(document.getElementById('viewDocumentModal'));

    // Variables y referencias a elementos que se usarán en múltiples funciones
    const uploadForm = $('#uploadForm');
    const pdfViewViewer = document.getElementById('pdfViewViewer');
    const imageViewPreview = document.getElementById('imageViewPreview');
    
  
    // 2. Manejador de eventos para el botón principal de la tabla (abre el modal de acciones)
  $(document).on('click', '.btn-document-actions-modal', function() {
    const ticketId = $(this).data('ticket-id');
    const statusPayment = $(this).data('status-payment');

    const pdfZoomUrl = $(this).data('pdf-zoom-url');
    const ZoomFile_name = $(this).data('envio-filename');

    const imgExoneracionUrl = $(this).data('exoneracion-url');
    const ExoneracionFile_name = $(this).data('exoneracion-filename');

    const pdfPagoUrl = $(this).data('pago-url');
    const PagoFile_name = $(this).data('pago-filename');

    const Envio_DestinoUrl = $(this).data('envio-destino');
    const EnvioDestinoName = $(this).data('envio-destino-filename');

    const nro_ticket = $(this).data('nro-ticket');

    const estado_cliente = $(this).data('nombre_estado');

    const modalTitle = $('#modalTicketId');
    const buttonsContainer = $('#modal-buttons-container');

    $('#uploadForm').attr('data-nro-ticket', nro_ticket);
    $('#uploadForm').attr('data-ticket-id', ticketId);

    buttonsContainer.empty();
    modalTitle.text(nro_ticket);

    // Estados donde NO se debe mostrar el botón de envío
    const estadosSinEnvio = ['Caracas', 'Miranda', 'Vargas', 'Distrito Capital'];
    const debeOcultarEnvio = estadosSinEnvio.includes(estado_cliente);

    let modalButtonsHTML = '';

    if (pdfZoomUrl && imgExoneracionUrl && Envio_DestinoUrl ) {
        // Solo Envío, Exoneración y Envio_Destino
        modalButtonsHTML = `
            <button id="VerEnvio" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="zoom" data-file-url="${pdfZoomUrl}" data-file-name="${ZoomFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio
            </button>
            <button id="VerExo" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="exoneracion" data-file-url="${imgExoneracionUrl}" data-file-name="${ExoneracionFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Exoneración
            </button>
            <button id="VerExo" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="envio_estino" data-file-url="${Envio_DestinoUrl}" data-file-name="${EnvioDestinoName}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio a Destino
            </button>
        `;
    } else if (pdfZoomUrl && pdfPagoUrl) {
        // Solo Envío y Pago
        modalButtonsHTML = `
            <button id="VerEnvio" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="zoom" data-file-url="${pdfZoomUrl}" data-file-name="${ZoomFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio
            </button>
            <button id="VerPago" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="pago" data-file-url="${pdfPagoUrl}" data-file-name="${PagoFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Pago
            </button>
        `;
 
    }else if (pdfZoomUrl && imgExoneracionUrl) {
        // Solo Envío y Exoneración
        modalButtonsHTML = `
            <button id="VerEnvio" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="zoom" data-file-url="${pdfZoomUrl}" data-file-name="${ZoomFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio
            </button>
            <button id="VerExo" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="exoneracion" data-file-url="${imgExoneracionUrl}" data-file-name="${ExoneracionFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Exoneración
            </button>
        `;
    } else if (pdfZoomUrl && Envio_DestinoUrl && pdfPagoUrl) {
        // Solo Envío, Envio_Destino y Pago
         modalButtonsHTML = `
            <button id="VerEnvio" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="zoom" data-file-url="${pdfZoomUrl}" data-file-name="${ZoomFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio
            </button>
            <button id="VerPago" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="pago" data-file-url="${pdfPagoUrl}" data-file-name="${PagoFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Pago
            </button>
            <button id="VerExo" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="envio_estino" data-file-url="${Envio_DestinoUrl}" data-file-name="${EnvioDestinoName}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio a Destino
            </button>
        `;
    }else if (pdfZoomUrl && Envio_DestinoUrl) {
        // Solo Envío
        modalButtonsHTML = `
            <button id="VerEnvio" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="zoom" data-file-url="${pdfZoomUrl}" data-file-name="${ZoomFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio
            </button>

            <button id="VerExo" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="envio_estino" data-file-url="${Envio_DestinoUrl}" data-file-name="${EnvioDestinoName}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio a Destino
            </button>
        `;


    } 

    buttonsContainer.html(modalButtonsHTML);

     // Mostrar el modal (asegúrate de que documentActionsModal esté definido)
    if (typeof documentActionsModal !== 'undefined') {
        documentActionsModal.show();
    } else {
        // Si no está definido, usar Bootstrap Modal directamente
        const modal = new bootstrap.Modal(document.getElementById('documentActionsModal'));
        modal.show();
    }
  });


    // 3. Manejador de eventos para los botones de "Cargar Documento" (desde el modal de acciones)
  $(document).on('click', '.btn-zoom-pdf, .btn-exoneracion-img, .btn-pago-pdf', function() {
        documentActionsModal.hide(); // Oculta el modal de acciones
        
        const ticketId = $(this).data('ticket-id');
        const documentType = $(this).data('document-type');
        const nro_ticket = $(this).data('nro-ticket');
        const fileName = $(this).data('file-name') || '';


        uploadForm[0].reset();
        $('#imagePreview').attr('src', '#').hide();
        $('#uploadMessage').removeClass('alert-success alert-danger').addClass('hidden').text('');
        
        $('#uploadDocumentModal .modal-title h5').html(`Subir Documento para Ticket: <span id="modalTicketId">${ticketId}</span>`);
        
        $('#uploadForm').data('document-type', documentType);
        $('#uploadForm').data('nro_ticket', nro_ticket);
        $('#uploadForm').data('file-name', fileName);
        $('#uploadForm').data('ticket-id', ticketId);

        setTimeout(() => {
            uploadDocumentModal.show();
        }, 300);
  });

   $(document).on('click', '.btn-view-document', function() {
    documentActionsModal.hide();

    const ticketId = $(this).data('ticket-id');
    const nroTicket = $(this).data('nro-ticket');
    const documentType = $(this).data('document-type');
    const fileUrl = $(this).data('file-url');
    const documentName = $(this).data('file-name');

    // Guardar en variables globales para usar en la API
    currentTicketIdForImage = ticketId;
    currentTicketNroForImage = nroTicket;

    // Si ya tenemos la URL del archivo y NO es múltiple, mostrar directamente
    if (fileUrl && documentType !== 'multiple') {
        // DETERMINAR SI ES PDF O IMAGEN BASÁNDOSE EN LA EXTENSIÓN
        const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
        if (isPdf) {
            showViewModal(ticketId, nroTicket, null, fileUrl, documentName);
        } else {
            showViewModal(ticketId, nroTicket, fileUrl, null, documentName);
        }
        return;
    }

    // Si es selección múltiple, mostrar modal de selección
    if (documentType === 'multiple') {
        showDocumentSelectionModal(ticketId, nroTicket);
        return;
    }

 
   });
/**
 * Toggles the visibility of the states container and populates it with state names.
 * This function is triggered when the region display element is clicked.
 * If the states container is hidden, it populates the list with state names from regionsData and shows the container.
 * If the container is visible, it hides it.
 * 
 * @listens click
 * @param {Event} event - The click event object.
 * @returns {void}
 */
document.getElementById('region-display').addEventListener('click', function() {
    const statesContainer = document.getElementById("states-container");
    const statesList = document.getElementById("states-list");

    if (regionsData.length === 0) {
        return;
    }

    if (statesContainer.style.display === "none") {
        statesList.innerHTML = '';
        regionsData.forEach(region => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = region.name_state;
            statesList.appendChild(li);
        });
        statesContainer.style.display = "block";
    } else {
        statesContainer.style.display = "none";
    }
});

function enviarCorreoTicketCerrado(ticketData) {
    const xhrEmail = new XMLHttpRequest();
    xhrEmail.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/email/send_end_ticket`);
    xhrEmail.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhrEmail.onload = function() {
        if (xhrEmail.status === 200) {
            try {
                const responseEmail = JSON.parse(xhrEmail.responseText);
                if (responseEmail.success) {
                  
                } else {
                    console.error("❌ Error al enviar correo:", responseEmail.message);
                }
            } catch (error) {
                console.error("❌ Error al parsear respuesta del correo:", error);
            }
        } else {
            console.error("❌ Error en solicitud de correo:", xhrEmail.status);
        }
    };

    xhrEmail.onerror = function() {
        console.error("❌ Error de red al enviar correo");
    };

    // Obtener el coordinador del ticket (ajusta según tu estructura de datos)
    const coordinador = ticketData.user_coordinator_id || ticketData.id_coordinator || '';
    const id_user = ticketData.user_id || ticketData.id_user_gestion || '';
    
    const params = `id_coordinador=${encodeURIComponent(coordinador)}&id_user=${encodeURIComponent(id_user)}`;
    xhrEmail.send(params);
}

function showViewModal(ticketId, nroTicket, imageUrl, pdfUrl, documentName) {
    const modalElementView = document.getElementById("viewDocumentModal");
    const modalTicketIdSpanView = modalElementView.querySelector("#viewModalTicketId");
    const imageViewPreview = document.getElementById("imageViewPreview");
    const pdfViewViewer = document.getElementById("pdfViewViewer");
    const messageContainer = document.getElementById("viewDocumentMessage");
    const nameDocumento = document.getElementById("NombreImage");
    const BotonCerrarModal = document.getElementById("CerrarModalVizualizar");
     const modal = new bootstrap.Modal(document.getElementById('documentActionsModal'));

    currentTicketId = ticketId;
    currentNroTicket = nroTicket;
    modalTicketIdSpanView.textContent = currentNroTicket;
    
    // Limpiar vistas y mensajes
    imageViewPreview.style.display = "none";
    pdfViewViewer.style.display = "none";
    messageContainer.textContent = "";
    messageContainer.classList.add("hidden");

    // Función para limpiar la ruta del archivo
    function cleanFilePath(filePath) {
        if (!filePath) return null;

        // Reemplazar barras invertidas con barras normales
        let cleanPath = filePath.replace(/\\/g, '/');

        // Extraer la parte después de 'Documentos_SoportePost/'
        const pathSegments = cleanPath.split('Documentos_SoportePost/');
        if (pathSegments.length > 1) {
            cleanPath = pathSegments[1];
        }

        // Construir la URL completa
        return `http://${HOST}/Documentos/${cleanPath}`;
    }

    if (imageUrl) {
        // Es una imagen
        const fullUrl = cleanFilePath(imageUrl);

        imageViewPreview.src = fullUrl;
        imageViewPreview.style.display = "block";
        nameDocumento.textContent = documentName;

    } else if (pdfUrl) {
        // Es un PDF
        const fullUrl = cleanFilePath(pdfUrl);

        pdfViewViewer.innerHTML = `<iframe src="${fullUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
        pdfViewViewer.style.display = "block";
        nameDocumento.textContent = documentName;

    } else {
        // No hay documento
        messageContainer.textContent = "No hay documento disponible para este ticket.";
        messageContainer.classList.remove("hidden");
        nameDocumento.textContent = "";
    }

    // Crear y mostrar el modal usando Bootstrap
    try {
        const viewDocumentModal = new bootstrap.Modal(modalElementView);
        viewDocumentModal.show();

        // Event listener para el botón de cerrar
        if (BotonCerrarModal) {
            BotonCerrarModal.addEventListener('click', function () {
                viewDocumentModal.hide();
                modal.show();

                if(modal.isOpen) {
                    viewDocumentModal.hide();
                }

                if(viewDocumentModal.isOpen) {
                    modal.hide();
                }

            });
        }
    } catch (error) {
        console.error("Error al mostrar el modal:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error del Sistema',
            text: 'No se pudo mostrar el modal de visualización.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
    }
}

// Función para determinar el tipo de documento basado en la extensión
// Función para determinar el tipo de documento


// Event listener para manejar los clics en los botones

// Función para mostrar el modal de visualización

// Tu función showUploadModal permanece sin cambios ya que el problema está en la visualización
function showUploadModal(ticketId) {
    const modalElementUpload = document.getElementById("uploadDocumentModal");
    const modalTicketIdSpanUpload = modalElementUpload ? modalElementUpload.querySelector("#uploadModalTicketId") : null;
    const inputFile = modalElementUpload ? modalElementUpload.querySelector("#documentFile") : null;
    let bsUploadModal = null;

    if (modalElementUpload) {
        bsUploadModal = new bootstrap.Modal(modalElementUpload, { keyboard: false });
    }

    currentTicketId = ticketId;
    if (modalTicketIdSpanUpload) {
        modalTicketIdSpanUpload.textContent = currentTicketId;
    }

    if (inputFile) {
        inputFile.value = "";
        const imagePreview = document.getElementById("imagePreview");
        if (imagePreview) {
            imagePreview.src = "#";
            imagePreview.style.display = "none";
        }
    }

    if (bsUploadModal) {
        bsUploadModal.show();
    } else {
        console.error("Error: Instancia de Bootstrap Modal para 'uploadDocumentModal' no creada.");
    }
}

function downloadImageModal(serial) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPhotoDashboard`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const srcImagen = response.rutaImagen;
          const claseImagen = response.claseImagen; // Obtener la clase CSS
          const imgElement = document.getElementById("device-ticket-image");
            if (imgElement) {
            imgElement.src = srcImagen;
            imgElement.className = claseImagen; // Aplicar la clase CSS
          } else {
            console.error("No se encontró el elemento img en el modal.");
          }
          if (imgElement) {
            imgElement.src = rutaImagen;
                        imgElement.className = claseImagen; // Aplicar la clase CSS

          } else {
            console.error("No se encontró el elemento img en el modal.");
          }
        } else {
          console.error("Error al obtener la imagen:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    console.error("Error de red");
  };

  const datos = `action=GetPhotoDashboard&serial=${encodeURIComponent(serial)}`;
  xhr.send(datos);
}

function formatTicketDetailsPanel(d) {
  // d es el objeto `data` completo del ticket
  // Ahora, 'd' también incluirá d.garantia_instalacion y d.garantia_reingreso

  const initialImageUrl = "assets/img/loading-placeholder.png"; // Asegúrate de tener esta imagen
  const initialImageAlt = "Cargando imagen del dispositivo...";

  // Determina el mensaje de garantía
  let garantiaMessage = '';
  if (d.garantia_instalacion !== null && d.garantia_instalacion !== '' && d.garantia_instalacion !== false && d.garantia_instalacion !== 'f') {
    garantiaMessage = 'Aplica Garantía de Instalación';
  } else if (d.garantia_reingreso !== null && d.garantia_reingreso !== '' && d.garantia_reingreso !== false && d.garantia_reingreso !== 'f') {
    garantiaMessage = 'Aplica Garantía por Reingreso';
  } else {
    garantiaMessage = 'No aplica Garantía'; // O simplemente dejarlo vacío si no hay garantía
  }

  return `
        <div class="container-fluid">
            <div class="row mb-3 align-items-center">
                <div class="col-md-3 text-center">
                    <div id="device-image-container" class="p-2">
                      <img id="device-ticket-image" src="${initialImageUrl}" alt="${initialImageAlt}">
                    </div>
                </div>
                <div class="col-md-9">
                    <h4 style = "color: black;">Ticket #${d.nro_ticket}</h4>
                    <hr class="mt-2 mb-3">
                    <div class="row">
                        <div class="col-sm-6 mb-2">
                          <strong><div>Serial POS:</div></strong>
                          ${d.serial_pos}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <strong><div>Estatus POS:</div></strong>
                          ${d.estatus_inteliservices}
                        </div><br>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Fecha Instalación:</div></strong>
                          ${d.fecha_instalacion || 'No posee'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Fecha último ticket:</div></strong>
                          ${d.fecha_cierre_anterior || 'No posee'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Garantía:</div></strong>
                          <span style="font-weight: bold; color: ${garantiaMessage.includes('Aplica') ? 'red' : 'green'};">${garantiaMessage}</span>
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Creación ticket:</div></strong>
                          ${d.create_ticket}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Usuario Gestión:</div></strong>
                          ${d.full_name_tecnico}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Dirección Instalación:</div></strong>
                          ${d.nombre_estado_cliente || 'Sin datos'}
                        </div><br>
                         <div class="col-sm-6 mb-2">
                            <br><strong><div>Estatus Ticket:</div></strong>
                            ${d.name_status_ticket}
                        </div><br>
                        <br><div class="col-sm-6 mb-2">
                              <br><strong><div>Falla Reportada:</div></strong>
                             <span class="falla-reportada-texto">${d.name_failure}</span>
                        </div>
                        <div class="col-sm-6 mb-2">
                          <button type="button" class="btn btn-link p-0" id="hiperbinComponents" data-id-ticket = ${d.id_ticket || ""}" data-serial-pos = ${d.serial_pos || ""}>
                            <i class="bi bi-box-seam-fill me-1"></i> Cargar Periféricos del Dispositivo
                          </button>
                        </div>  
                    </div>
                </div>
            </div>
            <hr class="mt-2 mb-3">
            <div class="row">
                <div class="col-12">
                    <h5 style = "color: black;" >Gestión / Historial:</h5>
                    <div id="ticket-history-content">
                        <p>Selecciona un ticket para cargar su historial.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para cargar y mostrar el historial de tickets.// Función para cargar el historial de un ticket
function loadTicketHistory(ticketId, currentTicketNroForImage, serialPos = '') {
    const historyPanel = $("#ticket-history-content");
    historyPanel.html('<p class="text-center text-muted">Cargando historial...</p>');

    const parseCustomDate = (dateStr) => {
        const parts = dateStr.split(' ');
        if (parts.length !== 2) return null;
        const [day, month, year] = parts[0].split('-');
        const [hours, minutes] = parts[1].split(':');
        return new Date(year, month - 1, day, hours, minutes);
    };

    const calculateTimeElapsed = (startDateStr, endDateStr) => {
        if (!startDateStr || !endDateStr) return null;

        const start = parseCustomDate(startDateStr);
        const end = parseCustomDate(endDateStr);

        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            return null;
        }

        const diffMs = end - start;
        if (diffMs <= 0) {
            return null;
        }

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30.44);

        const calculateBusinessDays = (startDateObj, endDateObj) => {
            const holidays2025 = [
                '2025-01-01', '2025-01-06', '2025-02-17', '2025-02-18', '2025-03-24', '2025-03-25', '2025-03-26', '2025-03-27', '2025-03-28', '2025-04-19', '2025-05-01', '2025-06-24', '2025-07-05', '2025-07-24', '2025-10-12', '2025-12-25'
            ];
            let businessDays = 0;
            const current = new Date(startDateObj);
            const end = new Date(endDateObj);

            while (current <= end) {
                const dayOfWeek = current.getDay();
                const dateString = current.toISOString().split('T')[0];
                if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holidays2025.includes(dateString)) {
                    businessDays++;
                }
                current.setDate(current.getDate() + 1);
            }
            return businessDays;
        };

        const businessDays = calculateBusinessDays(start, end);
        let timeText = '';

        if (diffMonths > 0) {
            const remainingDays = diffDays % 30.44;
            timeText = `${diffMonths}M ${Math.floor(remainingDays)}D`;
        } else if (diffWeeks > 0) {
            const remainingDays = diffDays % 7;
            timeText = `${diffWeeks}S ${remainingDays}D`;
        } else if (diffDays > 0) {
            const remainingHours = diffHours % 24;
            const remainingMinutes = diffMinutes % 60;
            timeText = `${diffDays}D ${remainingHours}H ${remainingMinutes}Min`;
        } else if (diffHours > 0) {
            const remainingMinutes = diffMinutes % 60;
            timeText = `${diffHours}H ${remainingMinutes}Min`;
        } else if (diffMinutes > 0) {
            timeText = `${diffMinutes}Min`;
        } else {
            return null;
        }

        return {
            text: timeText,
            ms: diffMs,
            minutes: diffMinutes,
            hours: diffHours,
            days: diffDays,
            weeks: diffWeeks,
            months: diffMonths,
            businessDays: businessDays
        };
    };

    $.ajax({
        url: `${ENDPOINT_BASE}${APP_PATH}api/historical/GetTicketHistory`,
        type: "POST",
        data: {
            action: "GetTicketHistory",
            id_ticket: ticketId,
        },
        dataType: "json",
        success: function(response) {
            if (response.success && response.history && response.history.length > 0) {
                let historyHtml = `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#17a2b8" class="bi bi-info-square-fill" viewBox="0 0 16 16" style="cursor: pointer;" data-toggle="collapse" data-target="#colorLegend_${ticketId}" aria-expanded="false" aria-controls="colorLegend_${ticketId}" title="Leyenda de Colores">
                            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                        <button class="btn btn-secondary" onclick="printHistory('${ticketId}', '${encodeURIComponent(JSON.stringify(response.history))}', '${currentTicketNroForImage}', '${serialPos}')">
                            <i class="fas fa-print"></i> Imprimir Historial
                        </button>
                    </div>
                    <div class="collapse mb-3" id="colorLegend_${ticketId}">
                            <div class="alert alert-info" role="alert">
                                <div class="d-flex flex-wrap gap-3">
                                    <div class="d-flex align-items-center">
                                        <span class="badge me-2" style="background-color: #ffc107; color: #ffffff; min-width: 80px; padding: 6px 12px;">Amarillo</span>
                                        <span style="color: #ffffff; font-weight: 600;">Gestión actual</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge me-2" style="background-color: #5d9cec; color: #ffffff; min-width: 80px; padding: 6px 12px;">Azul</span>
                                        <span style="color: #ffffff; font-weight: 600;">Gestiones anteriores</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge me-2" style="background-color: #fd7e14; color: #ffffff; min-width: 80px; padding: 6px 12px;">Naranja</span>
                                        <span style="color: #ffffff; font-weight: 600;">Cambio de Estatus Taller</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge me-2" style="background-color: #28a745; color: #ffffff; min-width: 80px; padding: 6px 12px;">Verde</span>
                                        <span style="color: #ffffff; font-weight: 600;">Cambio de Estatus Domiciliación</span>
                                    </div>
                                </div>
                                <div class="mt-3 pt-3 border-top border-light">
                                    <div class="d-flex flex-wrap gap-3">
                                        <div class="d-flex align-items-center">
                                            <span style="color: #ffffff; font-weight: 700; font-size: 1.1em; margin-right: 8px;">TG:</span>
                                            <span style="color: #ffffff; font-weight: 600;">Tiempo Duración Gestión Anterior</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span style="color: #ffffff; font-weight: 700; font-size: 1.1em; margin-right: 8px;">TR:</span>
                                            <span style="color: #ffffff; font-weight: 600;">Tiempo Duración Revisión Domiciliación</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span style="color: #ffffff; font-weight: 700; font-size: 1.1em; margin-right: 8px;">TT:</span>
                                            <span style="color: #ffffff; font-weight: 600;">Tiempo Duración en Taller</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3 pt-3 border-top border-light">
                                    <div style="text-align: center; margin-bottom: 12px;">
                                        <h5 style="color: #ffffff; font-weight: 700; font-size: 1.1em; margin-bottom: 10px;">LEYENDA DE TIEMPO</h5>
                            </div>
                                    <div class="d-flex flex-wrap gap-3 justify-content-center">
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #8b5cf6; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">M</span>
                                            <span style="color: #ffffff; font-weight: 600;">Mes(es)</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #10b981; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">S</span>
                                            <span style="color: #ffffff; font-weight: 600;">Semana(s)</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #10b981; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">D</span>
                                            <span style="color: #ffffff; font-weight: 600;">Día(s)</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #3b82f6; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">H</span>
                                            <span style="color: #ffffff; font-weight: 600;">Hora(s)</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #f59e0b; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">Min</span>
                                            <span style="color: #ffffff; font-weight: 600;">Minuto(s)</span>
                                        </div>
                                    </div>
                                    <div style="text-align: center; margin-top: 10px;">
                                        <p style="color: #ffffff; font-size: 0.85em; font-style: italic; margin: 0;">
                                            Ejemplo: <strong>1M 2S 3D 6H 11Min</strong> significa 1 mes, 2 semanas, 3 días, 6 horas y 11 minutos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="accordion" id="ticketHistoryAccordion">
                `;

                response.history.forEach((item, index) => {
                    const collapseId = `collapseHistoryItem_${ticketId}_${index}`;
                    const headingId = `headingHistoryItem_${ticketId}_${index}`;
                    const isLatest = index === 0;
                    const prevItem = response.history[index + 1] || {};

                    let timeElapsed = null;
                    let timeBadge = '';
                    
                    const cleanString = (str) => str && str.replace(/\s/g, ' ').trim() || null;
                    const getChange = (itemVal, prevVal) => (cleanString(itemVal) !== cleanString(prevVal));
                    
                    // Verificar si hay cambio de domiciliación o taller para calcular TG/TR o TG/TT
                    const statusDomChanged = getChange(item.name_status_domiciliacion, prevItem.name_status_domiciliacion);
                    const statusLabChanged = getChange(item.name_status_lab, prevItem.name_status_lab);
                    let durationFromPreviousText = '';
                    let durationFromCreationText = '';
                    let durationLabFromPreviousText = '';
                    let durationLabFromTallerText = '';
                    
                    // Calcular tiempos para Domiciliación
                    if (statusDomChanged && cleanString(item.name_status_domiciliacion)) {
                        // Tiempo 1: Desde la gestión anterior (ya calculado como elapsed)
                        if (prevItem && prevItem.fecha_de_cambio) {
                            const elapsedFromPrevious = calculateTimeElapsed(prevItem.fecha_de_cambio, item.fecha_de_cambio);
                            if (elapsedFromPrevious) {
                                durationFromPreviousText = elapsedFromPrevious.text;
                            }
                        }
                        
                        // Tiempo 2: Desde la creación del ticket
                        let ticketCreationDate = null;
                        const lastHistoryItem = response.history[response.history.length - 1];
                        if (lastHistoryItem && lastHistoryItem.fecha_de_cambio) {
                            ticketCreationDate = lastHistoryItem.fecha_de_cambio;
                        } else {
                            // Buscar el elemento con "Ticket Creado"
                            for (let i = response.history.length - 1; i >= 0; i--) {
                                const histItem = response.history[i];
                                if (histItem && cleanString(histItem.name_accion_ticket) === 'Ticket Creado' && histItem.fecha_de_cambio) {
                                    ticketCreationDate = histItem.fecha_de_cambio;
                                    break;
                                }
                            }
                        }
                        
                        if (ticketCreationDate) {
                            // Calcular duración desde la creación del ticket hasta el cambio actual
                            const duration = calculateTimeElapsed(ticketCreationDate, item.fecha_de_cambio);
                            if (duration) {
                                durationFromCreationText = duration.text;
                            }
                        }
                    }
                    
                    // Calcular tiempos para Taller (solo cuando la acción es "En el Rosal" - terminó la estadía en taller)
                    const currentAccionForLab = cleanString(item.name_accion_ticket);
                    const isEnElRosalForLab = currentAccionForLab && currentAccionForLab.toLowerCase().includes('en el rosal') && !currentAccionForLab.toLowerCase().includes('en espera de confirmar recibido');
                    
                    if (isEnElRosalForLab && statusLabChanged && cleanString(item.name_status_lab)) {
                        // Tiempo 1: Desde la gestión anterior (TG)
                        if (prevItem && prevItem.fecha_de_cambio) {
                            const elapsedFromPrevious = calculateTimeElapsed(prevItem.fecha_de_cambio, item.fecha_de_cambio);
                            if (elapsedFromPrevious) {
                                durationLabFromPreviousText = elapsedFromPrevious.text;
                            }
                        }
                        
                        // Tiempo 2: Sumar todos los tiempos de las gestiones marcadas en naranja (En Taller)
                        // Las gestiones naranjas son aquellas con estatus "En proceso de Reparación" o "Reparado"
                        let totalTallerMinutes = 0;
                        for (let i = index + 1; i < response.history.length; i++) {
                            const histItem = response.history[i];
                            const nextHistItem = response.history[i - 1] || null;
                            
                            if (histItem && histItem.fecha_de_cambio && nextHistItem && nextHistItem.fecha_de_cambio) {
                                const histStatusLab = cleanString(histItem.name_status_lab);
                                const isReparacionStatus = histStatusLab && 
                                    (histStatusLab.toLowerCase().includes('en proceso de reparación') || 
                                     histStatusLab.toLowerCase().includes('reparado'));
                                const isRecibidoEnTaller = histStatusLab && 
                                    histStatusLab.toLowerCase().includes('recibido en taller');
                                
                                // Si es una gestión naranja (taller con reparación), sumar su tiempo
                                if (isReparacionStatus && !isRecibidoEnTaller) {
                                    const duration = calculateTimeElapsed(histItem.fecha_de_cambio, nextHistItem.fecha_de_cambio);
                                    if (duration && duration.minutes) {
                                        totalTallerMinutes += duration.minutes;
                                    }
                                }
                            }
                        }
                        
                        // Convertir el total de minutos a formato legible
                        if (totalTallerMinutes > 0) {
                            const totalHours = Math.floor(totalTallerMinutes / 60);
                            const remainingMinutes = totalTallerMinutes % 60;
                            const totalDays = Math.floor(totalHours / 24);
                            const remainingHours = totalHours % 24;
                            const totalWeeks = Math.floor(totalDays / 7);
                            const remainingDaysAfterWeeks = totalDays % 7;
                            const totalMonths = Math.floor(totalDays / 30.44);
                            
                            if (totalMonths > 0) {
                                const remainingDaysAfterMonths = Math.floor(totalDays % 30.44);
                                durationLabFromTallerText = `${totalMonths}M ${remainingDaysAfterMonths}D`;
                            } else if (totalWeeks > 0) {
                                durationLabFromTallerText = `${totalWeeks}S ${remainingDaysAfterWeeks}D`;
                            } else if (totalDays > 0) {
                                durationLabFromTallerText = `${totalDays}D ${remainingHours}H ${remainingMinutes}Min`;
                            } else if (totalHours > 0) {
                                durationLabFromTallerText = `${totalHours}H ${remainingMinutes}Min`;
                            } else {
                                durationLabFromTallerText = `${remainingMinutes}Min`;
                            }
                        }
                    }
                    
                    // Prioridad: Si la acción es "En el Rosal" (terminó la estadía en taller), mostrar TG y TT; si no, mostrar TG y TR si hay cambio de Domiciliación; si no, tiempo normal
                    if (isEnElRosalForLab && statusLabChanged && cleanString(item.name_status_lab) && (durationLabFromPreviousText || durationLabFromTallerText)) {
                        let tgTtText = '';
                        if (durationLabFromPreviousText && durationLabFromTallerText) {
                            tgTtText = `TG: ${durationLabFromPreviousText}<br>TT: ${durationLabFromTallerText}`;
                        } else if (durationLabFromPreviousText) {
                            tgTtText = `TG: ${durationLabFromPreviousText}`;
                        } else if (durationLabFromTallerText) {
                            tgTtText = `TT: ${durationLabFromTallerText}`;
                        }
                        timeBadge = `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; background-color: #fd7e14 !important; color: white !important; white-space: normal; overflow: visible; line-height: 1.2;">${tgTtText}</span>`;
                    } else if (statusDomChanged && cleanString(item.name_status_domiciliacion)) {
                        // Si hay cambio de domiciliación, mostrar TG y TR en el badge en formato vertical (uno arriba del otro)
                        // Solo mostrar las líneas que tienen valores (no mostrar "N/A")
                        let tdTrText = '';
                        if (durationFromPreviousText && durationFromCreationText) {
                            tdTrText = `TG: ${durationFromPreviousText}<br>TR: ${durationFromCreationText}`;
                        } else if (durationFromPreviousText) {
                            tdTrText = `TG: ${durationFromPreviousText}`;
                        } else if (durationFromCreationText) {
                            tdTrText = `TR: ${durationFromCreationText}`;
                        }
                        if (tdTrText) {
                            timeBadge = `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; background-color: #28a745 !important; color: white !important; white-space: normal; overflow: visible; line-height: 1.2; text-align: center; display: inline-block; min-width: 80px;">${tdTrText}</span>`;
                        }
                    } else if (prevItem.fecha_de_cambio && item.fecha_de_cambio) {
                        // Si no hay cambio de domiciliación ni taller, mostrar el tiempo normal
                        timeElapsed = calculateTimeElapsed(prevItem.fecha_de_cambio, item.fecha_de_cambio);
                        if (timeElapsed) {
                            let badgeColor = 'success';
                            if (timeElapsed.months > 0 || timeElapsed.businessDays > 5) {
                                badgeColor = 'danger';
                            } else if (timeElapsed.weeks > 0 || timeElapsed.businessDays > 2) {
                                badgeColor = 'warning';
                            } else if (timeElapsed.days > 0 || timeElapsed.hours > 8) {
                                badgeColor = 'orange';
                            } else if (timeElapsed.hours >= 1) {
                                badgeColor = 'purple';
                            }

                            let backgroundColor = '#28a745';
                            if (badgeColor === 'purple') backgroundColor = '#6f42c1';
                            else if (badgeColor === 'orange') backgroundColor = '#fd7e14';
                            else if (badgeColor === 'warning') backgroundColor = '#ffc107';
                            else if (badgeColor === 'danger') backgroundColor = '#dc3545';

                            timeBadge = `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; cursor: pointer; background-color: ${backgroundColor} !important; color: white !important; white-space: nowrap; overflow: visible;" title="Click para ver agenda" onclick="showElapsedLegend(event)">${timeElapsed.text}</span>`;
                        }
                    }

                    const isCreation = cleanString(item.name_accion_ticket) === 'Ticket Creado';
                    const creationBadge = isCreation && item.fecha_de_cambio ? 
                        `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; cursor: help; background-color: #17a2b8 !important; color: white !important;" title="Fecha de creación">${item.fecha_de_cambio}</span>` : '';

                    const accionChanged = getChange(item.name_accion_ticket, prevItem.name_accion_ticket);
                    const coordChanged = getChange(item.full_name_coordinador, prevItem.full_name_coordinador);
                    const usuarioGestionChanged = getChange(item.usuario_gestion, prevItem.usuario_gestion);
                    const tecnicoChanged = getChange(item.full_name_tecnico_n2_history, prevItem.full_name_tecnico_n2_history);
                    // statusLabChanged y statusDomChanged ya están declarados arriba cuando se calculan TG/TT y TG/TR para el badge
                    const statusPaymentChanged = getChange(item.name_status_payment, prevItem.name_status_payment);
                    
                    // Calcular duración del estatus de Taller (solo cuando hay cambio)
                    // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde "Recibido en Taller"
                    // Nota: durationLabFromPreviousText y durationLabFromTallerText ya se calcularon arriba para el badge
                    
                    // Calcular duración del estatus de Domiciliación (solo cuando hay cambio)
                    // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde la creación del ticket
                    // Nota: durationFromPreviousText y durationFromCreationText ya se calcularon arriba para el badge
                    const estatusTicketChanged = getChange(item.name_status_ticket, prevItem.name_status_ticket);
                    const componentsChanged = getChange(item.components_list, prevItem.components_list);
                    const motivoRechazoChanged = getChange(item.name_motivo_rechazo, prevItem.name_motivo_rechazo);
                    const pagoChanged = getChange(item.pago, prevItem.pago);
                    const exoneracionChanged = getChange(item.exoneracion, prevItem.exoneracion);
                    const envioChanged = getChange(item.envio, prevItem.envio);
                    const envioDestinoChanged = getChange(item.envio_destino, prevItem.envio_destino);

                    const showComponents = cleanString(item.name_accion_ticket) === 'Actualización de Componentes' && cleanString(item.components_list);
                    const showComponentsChanges = cleanString(item.components_changes); // Nuevo campo con cambios específicos
                    const shouldHighlightComponents = showComponents && (accionChanged || componentsChanged);

                    const rejectedActions = ['Documento de Exoneracion Rechazado', 'Documento de Anticipo Rechazado'];
                    const showMotivoRechazo = rejectedActions.includes(cleanString(item.name_status_payment)) && cleanString(item.name_motivo_rechazo);

                    const showCommentDevolution = cleanString(item.name_accion_ticket) === 'En espera de Confirmar Devolución' && cleanString(item.comment_devolution) && cleanString(item.envio_destino) !== 'Sí';
                    const showCommentReasignation = cleanString(item.name_accion_ticket) === 'Reasignado al Técnico' && cleanString(item.comment_reasignation);

                    // Cambiar color del header si hay cambios en Estatus Taller o Domiciliación
                    let headerStyle = isLatest ? "background-color: #ffc107;" : "background-color: #5d9cec;";
                    let textColor = isLatest ? "color: #343a40;" : "color: #ffffff;";
                    
                    // Si hay cambio en Estatus Taller, solo cambiar color en gestiones anteriores (no en la actual)
                    // La gestión actual ya es amarilla por defecto
                    // Solo aplicar color naranja cuando el estatus es "En proceso de Reparación" o "Reparado", no "Recibido en Taller"
                    const currentStatusLabForColor = cleanString(item.name_status_lab);
                    const isReparacionStatus = currentStatusLabForColor && 
                        (currentStatusLabForColor.toLowerCase().includes('en proceso de reparación') || 
                         currentStatusLabForColor.toLowerCase().includes('reparado'));
                    const isRecibidoEnTaller = currentStatusLabForColor && 
                        currentStatusLabForColor.toLowerCase().includes('recibido en taller');
                    
                    if (statusLabChanged && !isLatest && isReparacionStatus && !isRecibidoEnTaller) {
                        headerStyle = "background-color: #fd7e14;"; // Naranja para cambios de Taller en gestiones anteriores
                        textColor = "color: #ffffff;";
                    }
                    // Si hay cambio en Estatus Domiciliación, usar verde (solo en gestiones anteriores)
                    else if (statusDomChanged && !isLatest) {
                        headerStyle = "background-color: #28a745;"; // Verde para destacar cambios de domiciliación
                        textColor = "color: #ffffff;";
                    }

                    let statusHeaderText = cleanString(item.name_status_ticket) || "Desconocido";
                    if (cleanString(item.name_accion_ticket) === "Enviado a taller" || cleanString(item.name_accion_ticket) === "En Taller") {
                        statusHeaderText = cleanString(item.name_status_lab) || "Desconocido";
                    }

                    // Se define el texto del botón aquí con la condición ternaria
                    const buttonText = isCreation
                        ? `${cleanString(item.name_accion_ticket) || "N/A"} (${statusHeaderText})`
                        : `${item.fecha_de_cambio || "N/A"} - ${cleanString(item.name_accion_ticket) || "N/A"} (${statusHeaderText})`;

                    // Calcular el padding derecho para evitar que el badge trunque el texto
                    const hasTimeBadge = timeBadge && timeBadge.trim() !== '';
                    const hasCreationBadge = creationBadge && creationBadge.trim() !== '';
                    const buttonPaddingRight = (hasTimeBadge || hasCreationBadge) ? '120px' : '15px';

                    historyHtml += `
                        <div class="card mb-3 custom-history-card position-relative">
                            <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                ${creationBadge}
                                ${timeBadge}
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                        data-toggle="collapse" data-target="#${collapseId}"
                                        aria-expanded="false" aria-controls="${collapseId}"
                                        style="${textColor}; padding-right: ${buttonPaddingRight} !important;">
                                        ${buttonText}
                                    </button>
                                </h2>
                            </div>
                            <div id="${collapseId}" class="collapse" aria-labelledby="${headingId}" data-parent="#ticketHistoryAccordion">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <th class="text-start" style="width: 40%;">Fecha y Hora:</th>
                                                    <td>${item.fecha_de_cambio || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Acción:</th>
                                                    <td class="${accionChanged ? "highlighted-change" : ""}">${cleanString(item.name_accion_ticket) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Operador Ticket:</th>
                                                    <td>${cleanString(item.operador_ticket) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Usuario Gestión:</th>
                                                    <td class="${usuarioGestionChanged ? "highlighted-change" : ""}">${cleanString(item.usuario_gestion) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td class="${coordChanged ? "highlighted-change" : ""}">${cleanString(item.full_name_coordinador) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinación:</th>
                                                    <td>${cleanString(item.nombre_coordinacion) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Técnico Asignado:</th>
                                                    <td class="${tecnicoChanged ? "highlighted-change" : ""}">
                                                        ${cleanString(item.full_name_tecnico_n2_history) || "Pendiente por Asignar"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Ticket:</th>
                                                    <td class="${estatusTicketChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_ticket) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Taller:</th>
                                                    <td class="${statusLabChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_lab) || "N/A"}</td>
                                                </tr>
                                                ${isEnElRosalForLab && statusLabChanged && cleanString(item.name_status_lab) ? `
                                                    ${durationLabFromTallerText ? `
                                                        <tr>
                                                            <th class="text-start">Tiempo Total Duración en Taller:</th>
                                                            <td class="highlighted-change">${durationLabFromTallerText}</td>
                                                        </tr>
                                                    ` : ''}
                                                ` : ''}
                                                <tr>
                                                    <th class="text-start">Estatus Domiciliación:</th>
                                                    <td class="${statusDomChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_domiciliacion) || "N/A"}</td>
                                                </tr>
                                                ${statusDomChanged && cleanString(item.name_status_domiciliacion) ? `
                                                    ${durationFromCreationText ? `
                                                        <tr>
                                                            <th class="text-start">Tiempo Duración Revisión Domiciliación:</th>
                                                            <td class="highlighted-change"><strong>${durationFromCreationText}</strong></td>
                                                        </tr>
                                                    ` : ''}
                                                ` : ''}
                                                <tr>
                                                    <th class="text-start">Estatus Pago:</th>
                                                    <td class="${statusPaymentChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_payment) || "N/A"}</td>
                                                </tr>
                                                ${showComponents ? `
                                                    <tr>
                                                        <th class="text-start">Periféricos Asociados:</th>
                                                        <td class="${shouldHighlightComponents ? "highlighted-change" : ""}">${cleanString(item.components_list)}</td>
                                                    </tr>
                                                ` : ''}
                                                ${showComponentsChanges ? `
                                                    <tr>
                                                        <th class="text-start">Cambios en Periféricos:</th>
                                                        <td class="highlighted-change" style="color: #dc3545;">
                                                            ${cleanString(item.components_changes)}
                                                        </td>
                                                    </tr>
                                                ` : ''}
                                                ${showMotivoRechazo ? `
                                                    <tr>
                                                        <th class="text-start">Motivo Rechazo Documento:</th>
                                                        <td class="${motivoRechazoChanged ? "highlighted-change" : ""}">${cleanString(item.name_motivo_rechazo) || "N/A"}</td>
                                                    </tr>
                                                ` : ''}
                                                ${showCommentDevolution ? `
                                                    <tr>
                                                        <th class="text-start">Comentario de Devolución:</th>
                                                        <td class="highlighted-change">${cleanString(item.comment_devolution) || "N/A"}</td>
                                                    </tr>
                                                ` : ''}
                                                ${showCommentReasignation ? `
                                                    <tr>
                                                        <th class="text-start">Comentario de Reasignación:</th>
                                                        <td class="highlighted-change">${cleanString(item.comment_reasignation) || "N/A"}</td>
                                                    </tr>
                                                ` : ''}
                                                ${cleanString(item.pago) === 'Sí' ? `
                                                    <tr>
                                                        <th class="text-start">Documento de Pago:</th>
                                                        <td class="${pagoChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                    </tr>
                                                ` : ''}
                                                ${cleanString(item.exoneracion) === 'Sí' ? `
                                                    <tr>
                                                        <th class="text-start">Documento de Exoneración:</th>
                                                        <td class="${exoneracionChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                    </tr>
                                                ` : ''}
                                                ${cleanString(item.envio) === 'Sí' ? `
                                                    <tr>
                                                        <th class="text-start">Documento de Envío:</th>
                                                        <td class="${envioChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                    </tr>
                                                ` : ''}
                                                ${cleanString(item.envio_destino) === 'Sí' ? `
                                                    <tr>
                                                        <th class="text-start">Documento de Envío a Destino:</th>
                                                        <td class="${envioDestinoChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                    </tr>
                                                ` : ''}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                });

                historyHtml += "</div>";
                historyPanel.html(historyHtml);
            } else {
                historyPanel.html('<p class="text-center text-muted">No hay historial disponible para este ticket.</p>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error completo de AJAX:", { jqXHR, textStatus, errorThrown });
            let errorMessage = '<p class="text-center text-danger">Error al cargar el historial.</p>';
            if (jqXHR.status === 0) {
                errorMessage = '<p class="text-center text-danger">Error de red: No se pudo conectar al servidor.</p>';
            } else if (jqXHR.status == 404) {
                errorMessage = `<div class="text-center text-muted py-5">
                    <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay datos en el historial.</p>
                    </div>
                </div>`;
            } else if (jqXHR.status == 500) {
                errorMessage = '<p class="text-center text-danger">Error interno del servidor. (Error 500)</p>';
            } else if (textStatus === "parsererror") {
                errorMessage = '<p class="text-center text-danger">Error al procesar la respuesta del servidor (JSON inválido).</p>';
            } else if (textStatus === "timeout") {
                errorMessage = '<p class="text-center text-danger">Tiempo de espera agotado al cargar el historial.</p>';
            } else if (textStatus === "abort") {
                errorMessage = '<p class="text-center text-danger">Solicitud de historial cancelada.</p>';
            }
            historyPanel.html(errorMessage);
            console.error("Error AJAX:", textStatus, errorThrown, jqXHR.responseText);
        },
    });
}

function printHistory(ticketId, historyEncoded, currentTicketNroForImage, serialPos = '') {
    // ... (Mantener las funciones auxiliares: decodeHistorySafe, cleanString, parseCustomDate, calculateTimeElapsed, generateFileName)
    const decodeHistorySafe = (encoded) => {
        try {
            if (!encoded) return [];
            return JSON.parse(decodeURIComponent(encoded));
        } catch (e) {
            console.error('Error decoding history:', e);
            return [];
        }
    };

    const cleanString = (str) => (typeof str === 'string' ? str.replace(/\s/g, ' ').trim() : (str ?? ''));

    const parseCustomDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = String(dateStr).split(' ');
        if (parts.length !== 2) return null;
        const [day, month, year] = parts[0].split('-');
        const [hours, minutes] = parts[1].split(':');
        const d = new Date(year, (Number(month) || 1) - 1, Number(day) || 1, Number(hours) || 0, Number(minutes) || 0);
        return isNaN(d.getTime()) ? null : d;
    };

    const calculateTimeElapsed = (startDateStr, endDateStr) => {
        if (!startDateStr || !endDateStr) return null;
        const start = parseCustomDate(startDateStr);
        const end = parseCustomDate(endDateStr);
        if (!start || !end) return null;
        const diffMs = end - start;
        if (diffMs <= 0) return null;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30.44);
        let text = '';
        if (diffMonths > 0) {
            const remainingDays = Math.floor(diffDays % 30.44);
            text = `${diffMonths}M ${remainingDays}D`;
        } else if (diffWeeks > 0) {
            text = `${diffWeeks}S ${diffDays % 7}D`;
        } else if (diffDays > 0) {
            text = `${diffDays}D ${diffHours % 24}H ${diffMinutes % 60}Min`;
        } else if (diffHours > 0) {
            text = `${diffHours}H ${diffMinutes % 60}Min`;
        } else if (diffMinutes > 0) {
            // Mostrar minutos cuando es al menos 1 minuto
            text = `${diffMinutes}Min`;
        } else {
            // Si es menos de 1 minuto, mostrar N/A según requerimiento de impresión
            text = `N/A`;
        }
        return { text, ms: diffMs, minutes: diffMinutes, hours: diffHours, days: diffDays, weeks: diffWeeks, months: diffMonths };
    };

    const history = decodeHistorySafe(historyEncoded);

    const generateFileName = (ticketNumber, serial) => {
        let fileName = `Historial_Ticket_${ticketNumber}`;
        if (serial && serial.length >= 4) {
            const lastFourDigits = serial.slice(-4);
            fileName += `-${lastFourDigits}`;
        }
        return `${fileName}.pdf`;
    };

    const fileName = generateFileName(currentTicketNroForImage, serialPos);

    const getChange = (itemVal, prevVal) => {
        const cleanItem = cleanString(itemVal);
        const cleanPrev = cleanString(prevVal);
        return cleanItem !== cleanPrev;
    };

    let itemsHtml = '';
    history.forEach((item, index) => {
        const previous = history[index + 1] || null;
        const elapsed = previous ? calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio) : null;
        const elapsedText = elapsed ? elapsed.text : 'N/A';
        
        // Calcular duración del estatus de Taller (solo cuando hay cambio)
        // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde "Recibido en Taller"
        let durationLabFromPreviousText = '';
        let durationLabFromTallerText = '';
        if (previous) {
            const statusLabChanged = getChange(item.name_status_lab, previous.name_status_lab);
            if (statusLabChanged && cleanString(item.name_status_lab)) {
                // Tiempo 1: Desde la gestión anterior
                if (previous && previous.fecha_de_cambio) {
                    const elapsedFromPrevious = calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio);
                    if (elapsedFromPrevious) {
                        durationLabFromPreviousText = elapsedFromPrevious.text;
                    }
                }
                
                // Tiempo 2: Desde "Recibido en Taller" hasta el cambio actual
                let fechaEntradaTaller = null;
                for (let i = index + 1; i < history.length; i++) {
                    const histItem = history[i];
                    if (histItem && histItem.fecha_de_cambio) {
                        const statusLab = cleanString(histItem.name_status_lab);
                        if (statusLab && statusLab.toLowerCase().includes('recibido en taller') && !fechaEntradaTaller) {
                            fechaEntradaTaller = histItem.fecha_de_cambio;
                        }
                    }
                }
                
                if (!fechaEntradaTaller) {
                    for (let i = history.length - 1; i > index; i--) {
                        const histItem = history[i];
                        if (histItem && histItem.fecha_de_cambio) {
                            const statusLab = cleanString(histItem.name_status_lab);
                            if (statusLab && statusLab.toLowerCase().includes('recibido en taller')) {
                                fechaEntradaTaller = histItem.fecha_de_cambio;
                                break;
                            }
                        }
                    }
                }
                
                if (fechaEntradaTaller) {
                    const duration = calculateTimeElapsed(fechaEntradaTaller, item.fecha_de_cambio);
                    if (duration) {
                        durationLabFromTallerText = duration.text;
                    }
                }
            }
        }
        
        // Calcular duración del estatus de Domiciliación (solo cuando hay cambio)
        // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde la creación del ticket
        let durationFromPreviousText = '';
        let durationFromCreationText = '';
        if (previous) {
            const statusDomChanged = getChange(item.name_status_domiciliacion, previous.name_status_domiciliacion);
            if (statusDomChanged && cleanString(item.name_status_domiciliacion)) {
                // Tiempo 1: Desde la gestión anterior (ya calculado como elapsed)
                if (previous && previous.fecha_de_cambio) {
                    const elapsedFromPrevious = calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio);
                    if (elapsedFromPrevious) {
                        durationFromPreviousText = elapsedFromPrevious.text;
                    }
                }
                
                // Tiempo 2: Desde la creación del ticket
                let ticketCreationDate = null;
                const lastHistoryItem = history[history.length - 1];
                if (lastHistoryItem && lastHistoryItem.fecha_de_cambio) {
                    ticketCreationDate = lastHistoryItem.fecha_de_cambio;
                } else {
                    // Buscar el elemento con "Ticket Creado"
                    for (let i = history.length - 1; i >= 0; i--) {
                        const histItem = history[i];
                        if (histItem && cleanString(histItem.name_accion_ticket) === 'Ticket Creado' && histItem.fecha_de_cambio) {
                            ticketCreationDate = histItem.fecha_de_cambio;
                            break;
                        }
                    }
                }
                
                if (ticketCreationDate) {
                    // Calcular duración desde la creación del ticket hasta el cambio actual
                    const duration = calculateTimeElapsed(ticketCreationDate, item.fecha_de_cambio);
                    if (duration) {
                        durationFromCreationText = duration.text;
                    }
                }
            }
        }

        itemsHtml += `
            <div style="border: 1px solid #ddd; border-radius: 8px; margin: 15px 0; padding: 0; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%); color: white; padding: 12px 15px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${cleanString(item.fecha_de_cambio) || 'N/A'} - ${cleanString(item.name_accion_ticket) || 'N/A'} (${cleanString(item.name_status_ticket) || 'N/A'})
                </div>
                <div style="padding: 15px; background: #fafafa;">
                <table style="width:100%; border-collapse: collapse; font-size: 12px;">
                    <tbody>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Ticket</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.nro_ticket) || nro_ticket}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Acción</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_accion_ticket) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Ticket</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_ticket) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Fecha Cambio</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.fecha_de_cambio) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Tiempo desde gestión anterior</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${elapsedText}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Coordinador</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.full_name_coordinador) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Coordinación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.nombre_coordinacion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Operador Ticket (Técnico N1)</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.operador_ticket) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Usuario Gestión</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.usuario_gestion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Rol en Gestión</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.full_name_tecnico_gestion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Técnico Asignado (N2)</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.full_name_tecnico_n2_history) || 'No Asignado'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Taller</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_lab) || 'N/A'}</td></tr>
                        ${(() => {
                            const currentAccion = cleanString(item.name_accion_ticket);
                            const isEnElRosal = currentAccion && currentAccion.toLowerCase().includes('en el rosal') && !currentAccion.toLowerCase().includes('en espera de confirmar recibido');
                            return isEnElRosal && durationLabFromTallerText ? `
                                <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Tiempo Total Duración en Taller</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${durationLabFromTallerText}</td></tr>
                            ` : '';
                        })()}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Domiciliación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_domiciliacion) || 'N/A'}</td></tr>
                        ${previous && getChange(item.name_status_domiciliacion, previous.name_status_domiciliacion) && cleanString(item.name_status_domiciliacion) ? `
                            ${durationFromCreationText ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Tiempo Duración Revisión Domiciliación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;"><strong>${durationFromCreationText}</strong></td></tr>` : ''}
                        ` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Pago</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_payment) || 'N/A'}</td></tr>
                        ${cleanString(item.components_list) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Periféricos</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.components_list)}</td></tr>` : ''}
                        ${cleanString(item.components_changes) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Cambios en Periféricos</strong></td><td style="padding:4px; border-bottom:1px solid #eee; color: #dc3545;">${cleanString(item.components_changes)}</td></tr>` : ''}
                        ${cleanString(item.name_motivo_rechazo) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Motivo Rechazo</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.name_motivo_rechazo)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Pago</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.pago) || 'No'}</td></tr>
                        ${cleanString(item.pago_fecha) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Pago Fecha</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.pago_fecha)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Exoneración</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.exoneracion) || 'No'}</td></tr>
                        ${cleanString(item.exoneracion_fecha) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Exoneración Fecha</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.exoneracion_fecha)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Envío</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.envio) || 'No'}</td></tr>
                        ${cleanString(item.envio_fecha) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Envío Fecha</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.envio_fecha)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Envío a Destino</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.envio_destino) || 'No'}</td></tr>
                        ${cleanString(item.envio_destino_fecha) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Envío Destino Fecha</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.envio_destino_fecha)}</td></tr>` : ''}
                        ${cleanString(item.comment_devolution) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Comentario Devolución</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.comment_devolution)}</td></tr>` : ''}
                        ${cleanString(item.comment_reasignation) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Comentario Reasignación</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.comment_reasignation)}</td></tr>` : ''}
                    </tbody>
                </table>
                </div>
            </div>
        `;
    });

    const legendHTML_Integrated = `
        <div class="legend-integrated" style="margin: 10px 0; padding: 10px; background: #e0f2fe; border: 1px solid #93c5fd; border-radius: 6px; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <p style="font-size: 13px; font-weight: bold; color: #1e40af; margin-bottom: 8px;">
                LEYENDA DE TIEMPO
            </p>
            <div style="display: flex; justify-content: center; gap: 15px; font-size: 11px; font-weight: 500; flex-wrap: wrap;">
                <span style="color: #7c3aed;">
                    <strong style="background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">M</strong> Mes(es)
                </span>
                <span style="color: #059669;">
                    <strong style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">S</strong> Semana(s)
                </span>
                <span style="color: #059669;">
                    <strong style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">D</strong> Día(s)
                </span>
                <span style="color: #1e40af;">
                    <strong style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">H</strong> Hora(s)
                </span>
                <span style="color: #9a3412;">
                    <strong style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">Min</strong> Minuto(s)
                </span>
            </div>
            <p style="font-size: 10px; color: #6b7280; margin-top: 8px;">
                *Ejemplo: **1M 2S 3D 6H 11Min** significa 1 mes, 2 semanas, 3 días, 6 horas y 11 minutos.
            </p>
        </div>
    `;


    const printContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${fileName}</title>
            <style>
                /* ... (Mantener todos los estilos CSS anteriores, asegurando que la clase .legend-float NO exista para no confundir) ... */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 11px;
                    line-height: 1.2;
                    color: #333;
                    background: #fff;
                    padding: 10px;
                    max-width: 100%;
                    margin: 0 auto;
                    overflow-x: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    min-height: 100vh;
                }
                
                .container {
                    max-width: 800px;
                    width: 100%;
                    margin: 0 auto;
                    background: white;
                    min-height: calc(100vh - 40px);
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    border-radius: 8px;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 12px;
                    padding: 8px 0;
                    border-bottom: 2px solid #2c5aa0;
                    position: relative;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #2c5aa0 0%, #4a90e2 50%, #2c5aa0 100%);
                }
                
                .company-logo-img {
                    max-width: 120px;
                    max-height: 60px;
                    margin-bottom: 8px;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .company-address {
                    font-size: 10px;
                    color: #555;
                    margin-bottom: 8px;
                    line-height: 1.3;
                    text-align: center;
                    font-weight: 500;
                }
                
                .document-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #2c5aa0;
                    margin: 4px 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .document-info {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    padding: 8px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    border-left: 3px solid #2c5aa0;
                    gap: 10px;
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: 1;
                    min-width: 0;
                }
                
                .info-label {
                    font-size: 9px;
                    color: #666;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 3px;
                }
                
                .info-value {
                    font-size: 12px;
                    font-weight: bold;
                    color: #2c5aa0;
                }
                
                .content-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .history-section {
                    margin: 6px 0;
                    background: #fff;
                    border-radius: 5px;
                    overflow: hidden;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    border: 1px solid #e9ecef;
                }
                
                .section-header {
                    background: linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%);
                    color: white;
                    padding: 6px 10px;
                    font-size: 11px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                
                .section-content {
                    padding: 8px 10px;
                }
                
                .history-item {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin: 15px 0;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    background: #fafafa;
                }
                
                .history-item-header {
                    background: linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%);
                    color: white;
                    padding: 12px 15px;
                    font-weight: bold;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin: 0;
                }
                
                .history-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }
                
                .history-table td {
                    padding: 4px;
                    border-bottom: 1px solid #eee;
                }
                
                .history-table td:first-child {
                    font-weight: bold;
                    color: #555;
                    width: 40%;
                }
                
                .footer {
                    margin-top: 8px;
                    padding-top: 6px;
                    border-top: 1px solid #ddd;
                    color: #666;
                    font-size: 8px;
                    line-height: 1.2;
                }
                
                .footer-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                }
                
                .footer-left {
                    flex: 1;
                    text-align: left;
                }
                
                .footer-right {
                    flex: 1;
                    text-align: right;
                }
                
                .footer-logo {
                    max-height: 25px;
                    max-width: 100px;
                }
                
                .footer-rif {
                    font-size: 10px;
                    font-weight: bold;
                    color: #2c5aa0;
                }
                
                .footer-text {
                    text-align: center;
                    margin-top: 6px;
                }
                
                /* Estilos para la leyenda integrada */
                .legend-integrated {
                    margin: 10px 0;
                    padding: 10px;
                    background: #e0f2fe;
                    border: 1px solid #93c5fd;
                    border-radius: 6px;
                    text-align: center;
                    page-break-inside: avoid; /* Evita que la leyenda se rompa entre páginas */
                }
                
                /* Optimizaciones para impresión */
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    body {
                        margin-top: 50px !important;
                        margin-bottom: 40px !important;
                    }
                    
                    html, body {
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                        display: block !important;
                    }
                    
                    body {
                        font-size: 10px !important;
                        padding: 8px !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-height: 100vh !important;
                    }
                    
                    .container {
                        max-width: 800px !important;
                        width: 100% !important;
                        min-height: auto !important;
                        height: auto !important;
                        page-break-inside: avoid;
                        margin: 0 auto !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }
                    
                    .header {
                        margin-bottom: 6px !important;
                        padding: 6px 0 !important;
                        page-break-after: avoid;
                    }
                    
                    .company-logo-img {
                        max-width: 100px !important;
                        max-height: 50px !important;
                        margin-bottom: 6px !important;
                    }
                    
                    .company-address {
                        font-size: 9px !important;
                        margin-bottom: 6px !important;
                    }
                    
                    .document-title {
                        font-size: 14px !important;
                    }
                    
                    .section-content {
                        padding: 6px 8px !important;
                    }
                    
                    .history-item {
                        margin: 10px 0 !important;
                        padding: 0 !important;
                        page-break-inside: avoid;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                    }
                    
                    .history-item-header {
                        padding: 10px 12px !important;
                        font-size: 12px !important;
                    }
                    
                    .history-table {
                        font-size: 10px !important;
                    }
                    
                    .footer {
                        margin-top: 6px !important;
                        padding-top: 4px !important;
                        page-break-before: avoid;
                    }
                    
                    .footer-content {
                        margin-bottom: 6px !important;
                        padding: 6px 0 !important;
                    }
                    
                    .footer-logo {
                        max-height: 20px !important;
                        max-width: 80px !important;
                    }
                    
                    .footer-rif {
                        font-size: 9px !important;
                    }
                    
                    .footer-text {
                        margin-top: 4px !important;
                    }
                }
                
                @page {
                    size: letter;
                    margin: 0.2in 0.5in;
                    padding: 0;
                    @top-left { content: ""; }
                    @top-center { content: ""; }
                    @top-right { content: ""; }
                    @bottom-left { content: ""; }
                    @bottom-center { content: ""; }
                    @bottom-right { content: ""; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="../../../public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="company-logo-img" onerror="this.style.display='none'">
                    <div class="company-address">
                        Urbanización El Rosal. Av. Francisco de Miranda<br>
                        Edif. Centro Sudamérica PH-A Caracas. Edo. Miranda
                </div>
                    <div class="document-title">Historial del Ticket</div>
                </div>
                
                <div class="document-info">
                    <div class="info-item">
                        <div class="info-label">Ticket Nro</div>
                        <div class="info-value">${currentTicketNroForImage}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Fecha de Impresión</div>
                        <div class="info-value">${new Date().toLocaleString()}</div>
                    </div>
                </div>
                
                ${legendHTML_Integrated}

                <div class="content-wrapper">
                    <div class="history-section">
                        <div class="section-header">Detalle del Historial</div>
                        <div class="section-content">
                            <p style="margin: 0 0 14px 0; color: #6c757d; font-size: 12px; text-align: center;">
                                <strong>Nota:</strong> En la columna "Tiempo desde gestión anterior" con un valor "N/A" indica que la gestión se realizó en menos de 1 minuto.
                            </p>
            ${itemsHtml || '<p style="text-align:center; color:#666;">Sin historial disponible.</p>'}
        </div>
                    </div>
                </div>

                <div class="footer">
                    <div class="footer-content">
                        <div class="footer-left">
                            <img src="../../../public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="footer-logo" onerror="this.style.display='none'">
                        </div>
                        <div class="footer-right">
                            <div class="footer-rif">RIF: J-00291615-0</div>
                        </div>
                    </div>
                    <div class="footer-text">
                        <p>Documento generado automáticamente por el sistema de gestión de tickets de Inteligensa.</p>
                        <p>Generado: ${new Date().toLocaleString("es-ES")}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '', 'height=800,width=1024');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

function showElapsedLegend(e) {
    try { if (e && e.stopPropagation) e.stopPropagation(); } catch (_) {}
    const legendHtml = `
        <div style="font-size: 0.95rem; text-align: left;">
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#28a745; color:#fff; min-width:64px;">Verde</span><span class="ml-2">Menos de 1 hora</span></div>
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#6f42c1; color:#fff; min-width:64px;">Morado</span><span class="ml-2">Entre 1 y 8 horas</span></div>
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#fd7e14; color:#fff; min-width:64px;">Naranja</span><span class="ml-2">Más de 8 horas o al menos 1 día</span></div>
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#ffc107; color:#212529; min-width:64px;">Amarillo</span><span class="ml-2">1 semana o más (1S+), o más de 2 días hábiles</span></div>
            <div class="d-flex align-items-center"><span class="badge" style="background-color:#dc3545; color:#fff; min-width:64px;">Rojo</span><span class="ml-2">1 mes o más (1M+), o más de 5 días hábiles</span></div>
        </div>`;

    Swal.fire({
        title: 'Leyenda',
        html: legendHtml,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#003594',
        color: 'black',
        width: 520,
    });
}

function updateTicketStatusInRegion(ticketId, nroTicketToConfirm, serialPosToConfirm) {
  const id_user = document.getElementById("userId").value;

  const dataToSendString = `action=UpdateStatusToReceiveInRegion&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(ticketId)}`;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateStatusToReceiveInRegion`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success === true) {
          // Or `response.success == "true"` if your backend sends a string
          Swal.fire({
            title: "¡Éxito!",
            html: `El Pos <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPosToConfirm}</span> asociado al Nro de Ticket <span  style="border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicketToConfirm}</span> fue recibido en la región.`,
            icon: "success",
            confirmButtonText: "Ok", // SweetAlert2 uses confirmButtonText
            confirmButtonColor: "#003594", // SweetAlert2 uses confirmButtonColor
            customClass: {
              confirmButton: "BtnConfirmacion", // For custom button styling
            },
            color: "black",
          }).then((result) => {
            // SweetAlert2 uses 'result' object
            if (result.isConfirmed) {
              // Check if the confirm button was clicked
              location.reload();
            }
          });
        } else {
          console.warn(
            "La API retornó éxito: falso o un valor inesperado:",
            response
          );
          Swal.fire(
            "Error",
            response.message ||
              "No se pudo actualizar el ticket. (Mensaje inesperado)",
            "error"
          );
        }
      } catch (error) {
        console.error(
          "Error al analizar la respuesta JSON para la actualización de estado:",
          error
        );
        // The original error "Class constructor SweetAlert cannot be invoked without 'new'"
        // might be thrown here if SweetAlert2 is loaded but you try to use swal() within the catch block as well.
        Swal.fire(
          "Error de Procesamiento",
          "Hubo un problema al procesar la respuesta del servidor.",
          "error"
        );
      }
    } else {
      console.error(
        "Error al actualizar el estado (HTTP):",
        xhr.status,
        xhr.statusText,
        xhr.responseText
      );
      Swal.fire(
        "Error del Servidor",
        `No se pudo comunicar con el servidor. Código: ${xhr.status}`,
        "error"
      );
    }
  };

  xhr.onerror = function () {
    console.error("Error de red al intentar actualizar el ticket.");
    Swal.fire(
      "Error de Conexión",
      "Hubo un problema de red. Por favor, inténtalo de nuevo.",
      "error"
    );
  };
  xhr.send(dataToSendString);
}


function getTicketStatusVisual(statusTicket, accionTicket) {
  let statusClass = '';
  let statusText = '';
  let statusIcon = '';
  
  // Primero evaluar si está en proceso (incluye "En la región")
  if (statusTicket === 'En proceso' || 
      accionTicket === 'Asignado al Técnico' || 
      accionTicket === 'Recibido por el Técnico' ||
      accionTicket === 'Enviado a taller' ||
      accionTicket === 'En Taller' ||
      accionTicket === 'En la región' ||
      accionTicket === 'En espera de confirmar recibido en Región' ||  
      accionTicket === 'En espera de Confirmar Devolución') {
    statusClass = 'status-process';
    statusText = 'EN PROCESO';
    statusIcon = '🟡';
  } 
  // Luego evaluar si está abierto
  else if (statusTicket === 'Abierto' || 
      accionTicket === 'Asignado al Coordinador' ||
      accionTicket === 'Pendiente por revisar domiciliacion') {
    statusClass = 'status-open';
    statusText = 'ABIERTO';
    statusIcon = '🟢';
  } 
  // Finalmente evaluar si está cerrado
  else if (statusTicket === 'Cerrado' || 
           accionTicket === 'Entregado a Cliente') {
    statusClass = 'status-closed';
    statusText = 'CERRADO';
    statusIcon = '🔴';
  }
  
  return { statusClass, statusText, statusIcon };
}

// Función para mostrar el indicador de estado
function showTicketStatusIndicator(statusTicket, accionTicket) {
  const container = document.getElementById('ticket-status-indicator-container');
  if (!container) return;
  
  const { statusClass, statusText, statusIcon } = getTicketStatusVisual(statusTicket, accionTicket);
  
  container.innerHTML = `
    <div class="ticket-status-indicator ${statusClass}">
      <div class="status-content">
        <span class="status-icon">${statusIcon}</span>
        <span class="status-text">${statusText}</span>
      </div>
    </div>
  `;
}

// Función para ocultar el indicador
function hideTicketStatusIndicator() {
  const container = document.getElementById('ticket-status-indicator-container');
  if (container) {
    container.innerHTML = '';
  }
}

// Cuando se selecciona un ticket específico
function onTicketSelect(ticketData) {
  showTicketStatusIndicator(ticketData.name_status_ticket, ticketData.name_accion_ticket);
  // ... resto de tu código para mostrar detalles del ticket ...
}