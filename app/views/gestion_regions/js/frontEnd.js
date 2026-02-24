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
                  const totalPaid = Number(row.total_paid) || 0;
                  const totalBudget = Number(row.total_budget) || 0;
                  const debt = Math.max(0, totalBudget - totalPaid);
                  const isBlocked = debt > 0.01;

                  const tooltipText = isBlocked 
                    ? `Pago pendiente: $${debt.toFixed(2)} (Click para ver detalle)`
                    : 'Entregar a cliente';

                  actionButton = `<button type="button" class="btn ${isBlocked ? 'btn-secondary' : 'btn-primary'} btn-sm deliver-ticket-btn" 
                    ${isBlocked ? 'data-is-blocked="true"' : ''}
                    title="${tooltipText}"
                    data-id-ticket="${idTicket}"
                    data-serial-pos="${serialPos}"
                    data-nro-ticket="${nroTicket}"
                    data-total-paid="${totalPaid}"
                    data-total-budget="${totalBudget}"
                    data-debt="${debt}"
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
                const presupuestoUrl = row.presupuesto_document_url;

                if (hasEnvioDestinoDocument) {
                  // Se asume que el estatus "En la región" significa que el documento ya fue subido y puede ser visto
                  if(row.name_accion_ticket === "En la región" || row.name_accion_ticket === "Entregado a Cliente"){
                    // Verificar si hay al menos un documento disponible
                     
                    const hasAnyDocument = envioUrl || exoneracionUrl || pagoUrl || presupuestoUrl;
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
                        data-presupuesto-url="${row.presupuesto_document_url || ''}"
                        data-presupuesto-filename="${row.presupuesto_original_filename || ''}"
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
                  const btn = $(this);
                  const isBlocked = btn.data("is-blocked") === true;

                  if (isBlocked) {
                    const totalPaid = Number(btn.data("total-paid")) || 0;
                    const totalBudget = Number(btn.data("total-budget")) || 0;
                    const debt = Number(btn.data("debt")) || 0;
                    const nroTicket = btn.data("nro-ticket");

                    const customDebtSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#dc3545" class="bi bi-exclamation-octagon-fill custom-icon-animation" viewBox="0 0 16 16">
                      <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>`;

                    Swal.fire({
                      title: `<div class="custom-modal-header-title bg-gradient-danger text-white">
                        <div class="custom-modal-header-content">Detalle de Deuda Pendiente</div>
                      </div>`,
                      html: `
                        <div class="custom-modal-body-content">
                          <div class="mb-4">
                            ${customDebtSvg}
                          </div>
                          <p class="h4 mb-3" style="color: black;">El ticket <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #ffebee; color: #c62828;">${nroTicket}</span> tiene pagos pendientes.</p>
                          <div class="p-3 mb-3" style="background-color: #f8f9fa; border-radius: 10px; border: 1px solid #dee2e6;">
                            <table class="table table-sm mb-0">
                              <tr><td class="text-start border-0"><strong>Monto Abonado:</strong></td><td class="text-end border-0">$${totalPaid.toFixed(2)}</td></tr>
                              <tr><td class="text-start border-0"><strong>Presupuesto Taller:</strong></td><td class="text-end border-0">$${totalBudget.toFixed(2)}</td></tr>
                              <tr style="border-top: 2px solid #dee2e6;"><td class="text-start border-0"><strong class="text-danger">Saldo Pendiente:</strong></td><td class="text-end border-0"><strong class="text-danger" style="font-size: 1.2em;">$${debt.toFixed(2)}</strong></td></tr>
                            </table>
                          </div>
                          <p class="h5" style="padding: 0.5rem; border-radius: 0.3rem; background-color: #fff3e0; color: #ef6c00; font-size: 85%;">Debe completar el pago para proceder con la entrega.</p>
                        </div>
                      `,
                      confirmButtonText: "Entendido",
                      color: "black",
                      confirmButtonColor: "#c62828",
                      focusConfirm: false,
                      allowOutsideClick: false,
                      width: '500px'
                    });
                    return;
                  }

                  const idTicket = btn.data("id-ticket");
                  const nroTicket = btn.data("nro-ticket"); 
                  const serialPos = btn.data("serial-pos"); 
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

    const PresupuestoUrl = $(this).data('presupuesto-url');
    const PresupuestoName = $(this).data('presupuesto-filename');

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

    // Botones base que siempre se evalúan
    if (pdfZoomUrl) {
        modalButtonsHTML += `
            <button class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="zoom" data-file-url="${pdfZoomUrl}" data-file-name="${ZoomFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio
            </button>
        `;
    }

    if (PresupuestoUrl) {
        modalButtonsHTML += `
            <button class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="presupuesto" data-file-url="${PresupuestoUrl}" data-file-name="${PresupuestoName}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Presupuesto
            </button>
        `;
    }

    if (pdfPagoUrl) {
        modalButtonsHTML += `
            <button class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="pago" data-file-url="${pdfPagoUrl}" data-file-name="${PagoFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Pago
            </button>
        `;
    }

    if (imgExoneracionUrl) {
        modalButtonsHTML += `
            <button class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="exoneracion" data-file-url="${imgExoneracionUrl}" data-file-name="${ExoneracionFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Exoneración
            </button>
        `;
    }

    if (Envio_DestinoUrl) {
        modalButtonsHTML += `
            <button class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="envio_estino" data-file-url="${Envio_DestinoUrl}" data-file-name="${EnvioDestinoName}" data-nro-ticket="${nro_ticket}">
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