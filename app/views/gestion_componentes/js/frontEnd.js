
let currentTicketNroForImage = null;

function SearchTicketsComponents() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketsComponentes`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const tableContainerParent = document.getElementById('tableContainerParent');
    const existingTable = document.getElementById('tabla-ticket');
    const existingTableBody = document.getElementById('table-ticket-body');
    const detailsPanel = document.getElementById("ticket-details-panel");

    if ($.fn.DataTable.isDataTable('#tabla-ticket')) {
        $('#tabla-ticket').DataTable().destroy();
        $('#tabla-ticket thead').empty();
        $('#tabla-ticket tbody').empty();
    }

    if (tableContainerParent) {
        const existingMessages = tableContainerParent.querySelectorAll('p.message-info, p.message-error');
        existingMessages.forEach(msg => msg.remove());
    }

    xhr.onload = function () {
        if (tableContainerParent) {
            existingTable.style.display = 'table';
            tableContainerParent.style.display = '';
        }

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const TicketData = response.tickets;
                    // Verificar que hay datos antes de acceder al primer elemento
                    if (TicketData && TicketData.length > 0) {
                        currentTicketNroForImage = TicketData[0].nro_ticket || TicketData[0].ticket_number;
                    }

                    // Preparar datos para DataTable (igual que en la función que funciona)
                    const dataForDataTable = [];
                    TicketData.forEach((data) => {
                        const actionButtonsHtml = `
                            <button type="button" class="btn btn-info btn-sm ver-componentes-btn"
                                data-id="${data.id_ticket}"
                                data-serial="${data.serial_pos}"
                                data-ticket="${data.nro_ticket}"
                                title="Ver Componentes del POS">
                                <i class="fas fa-cogs"></i> Ver Componentes
                            </button>`;

                        dataForDataTable.push([
                            data.id_ticket,
                            data.nro_ticket,
                            data.rif || '',
                            data.razonsocial_cliente || '',
                            data.serial_pos,
                            data.banco_ibp,
                            data.tipo_pos,
                            actionButtonsHtml
                        ]);
                    });

                    const thead = existingTable.querySelector('thead');
                    thead.innerHTML = '';
                    const headerRow = thead.insertRow();
                    
                    // Crear headers manualmente
                    const headers = ['N°', 'N° Ticket', 'RIF', 'Razón Social', 'Serial POS', 'Banco', 'Tipo POS', 'Acciones'];
                    headers.forEach(headerText => {
                        const th = document.createElement('th');
                        th.textContent = headerText;
                        headerRow.appendChild(th);
                    });

                    if (TicketData && TicketData.length > 0) {
                        const dataTableInstance = $(existingTable).DataTable({
                            scrollX: "200px",
                            responsive: false,
                            data: dataForDataTable,
                            columns: [
                                {
                                    title: "N°",
                                    orderable: false,
                                    searchable: false,
                                    render: function (data, type, row, meta) {
                                        return meta.row + meta.settings._iDisplayStart + 1;
                                    },
                                },
                                { title: "Nro Ticket" },
                                { title: "RIF" },
                                { 
                                    title: "Razón Social",
                                    render: function (data, type, row) {
                                        if (type === "display") {
                                            return `<span class="truncated-cell" data-full-text="${data || ''}">${data || ''}</span>`;
                                        }
                                        return data || '';
                                    },
                                },
                                { title: "Serial POS" },
                                {
                                    title: "Banco",
                                    render: function (data, type, row) {
                                        if (type === "display") {
                                            return `<span class="truncated-cell" data-full-text="${data}">${data}</span>`;
                                        }
                                        return data;
                                    },
                                },
                                { title: "Tipo POS" },
                                { title: "Acciones", orderable: false }
                            ],
                            "pagingType": "simple_numbers",
                            "lengthMenu": [5, 10, 25, 50],
                            autoWidth: false,
                            "language": {
                                "lengthMenu": "Mostrar _MENU_",
                                "emptyTable": "No hay datos disponibles en la tabla",
                                "zeroRecords": "No se encontraron resultados para la búsqueda",
                                "info": "_TOTAL_ Registros",
                                "infoEmpty": "No hay datos disponibles",
                                "infoFiltered": " de _MAX_ Disponibles",
                                "search": "Buscar:",
                                "loadingRecords": "Buscando...",
                                "processing": "Procesando...",
                                "paginate": {
                                    "first": "Primero",
                                    "last": "Último",
                                    "next": "Siguiente",
                                    "previous": "Anterior"
                                }
                            },
                            dom: '<"top d-flex justify-content-between align-items-center"lf>rt<"bottom"ip><"clear">'
                        });

                        // Event listener para el botón de ver componentes
                        $(document).off('click', '.ver-componentes-btn').on('click', '.ver-componentes-btn', function() {
                            const idTicket = $(this).data('id');
                            const serialPos = $(this).data('serial');
                            const nroTicket = $(this).data('ticket');
                            
                            showComponentsModal(idTicket, serialPos, nroTicket);
                        });

                        // ************* INICIO: LÓGICA PARA TRUNCAR/EXPANDIR TEXTO (igual que en la función que funciona) *************
                        $("#tabla-ticket tbody")
                            .off("click", ".truncated-cell, .expanded-cell")
                            .on("click", ".truncated-cell, .expanded-cell", function (e) {
                                e.stopPropagation();
                                const $cellSpan = $(this);
                                const fullText = $cellSpan.data("full-text");
                                const displayLength = 25; // Cambiado a 25 como pediste
                                
                                if ($cellSpan.hasClass("truncated-cell")) {
                                    $cellSpan.removeClass("truncated-cell").addClass("expanded-cell").text(fullText);
                                } else if ($cellSpan.hasClass("expanded-cell")) {
                                    $cellSpan.removeClass("expanded-cell").addClass("truncated-cell");
                                    $cellSpan.text(fullText.length > displayLength ? fullText.substring(0, displayLength) + "..." : fullText);
                                }
                            });
                        // ************* FIN: LÓGICA PARA TRUNCAR/EXPANDIR TEXTO *************

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
                                                clickedElement.hasClass('expanded-cell');
                                
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

                                const ticketId = rowData[0]; // Cambiado porque ahora es un array

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
                                            imgElement.src =
                                                '__DIR__ . "/../../../public/img/consulta_rif/POS/mantainment.png';
                                            imgElement.alt = "Serial no disponible";
                                        }
                                    }
                                } else {
                                    detailsPanel.innerHTML =
                                        "<p>No se encontraron detalles para este ticket.</p>";
                                }
                            });
                    } else {
                        existingTable.style.display = 'none';
                        const noDataMessage = document.createElement('p');
                        noDataMessage.className = 'message-info';
                        noDataMessage.textContent = 'No hay datos disponibles para el ID de usuario proporcionado.';
                        if (tableContainerParent) {
                            tableContainerParent.appendChild(noDataMessage);
                        } else {
                            existingTable.parentNode.insertBefore(noDataMessage, existingTable);
                        }
                    }
                } else {
                    existingTable.style.display = 'none';
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'message-error';
                    errorMessage.textContent = response.message || 'Error al cargar los datos desde la API.';
                    if (tableContainerParent) {
                        tableContainerParent.appendChild(errorMessage);
                    } else {
                        existingTable.parentNode.insertBefore(errorMessage, existingTable);
                    }
                    console.error('Error de la API:', response.message);
                }
            } catch (error) {
                existingTable.style.display = 'none';
                const errorMessage = document.createElement('p');
                errorMessage.className = 'message-error';
                errorMessage.textContent = 'Error al procesar la respuesta del servidor (JSON inválido).';
                if (tableContainerParent) {
                    tableContainerParent.appendChild(errorMessage);
                } else {
                    existingTable.parentNode.insertBefore(errorMessage, existingTable);
                }
                console.error('Error parsing JSON:', error);
            }
        } else if (xhr.status === 404) {
            existingTable.style.display = 'none';
            const noDataMessage = document.createElement('p');
            noDataMessage.className = 'message-info';
            noDataMessage.innerHTML =  `<div class="text-center text-muted py-5">
               <div class="d-flex flex-column align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                        <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    </svg>
                    <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                    <p class="text-muted mb-0">No hay tickets para verificar solvencia para mostrar en este momento.</p>
                </div> 
            </div>`;
            if (tableContainerParent) {
                tableContainerParent.appendChild(noDataMessage);
            } else {
                existingTable.parentNode.insertBefore(noDataMessage, existingTable);
            }
        } else {
            existingTable.style.display = 'none';
            const errorMessage = document.createElement('p');
            errorMessage.className = 'message-error';
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
        existingTable.style.display = 'none';
        const errorMessage = document.createElement('p');
        errorMessage.className = 'message-error';
        errorMessage.textContent = 'Error de conexión a la red. Verifica tu conexión a Internet.';
        if (tableContainerParent) {
            tableContainerParent.appendChild(errorMessage);
        } else {
            existingTable.parentNode.insertBefore(errorMessage, existingTable);
        }
        console.error('Error de red');
    };

    const id_user_input = document.getElementById('iduser');
    let id_user_value = '';
    if (id_user_input) {
        id_user_value = id_user_input.value;
    } else {
        console.warn("Elemento con ID 'iduser' no encontrado. La búsqueda podría no funcionar correctamente.");
    }

    const datos = `action=GetTicketsComponentes`;
    xhr.send(datos);
}

// Variables globales para la navegación del modal
let allPosDataGlobal = [];
let currentPosIndex = 0;
let currentModalData = { idTicket: null, serialPos: null, nroTicket: null };

// Función para formatear la lista de componentes, destacando los desmarcados
function formatComponentsList(componentsString) {
    if (!componentsString || componentsString === 'No disponible') {
        return componentsString;
    }
    
    // Dividir por comas y procesar cada componente
    const components = componentsString.split(',').map(comp => comp.trim());
    
    return components.map(component => {
        if (component.includes('(Desmarcado)')) {
            // Componente desmarcado - aplicar estilo especial que combine con el fondo púrpura/azul
            const cleanName = component.replace('(Desmarcado)', '').trim();
            return `<span style="text-decoration: line-through; opacity: 0.6; color: rgba(255, 255, 255, 0.6);">${cleanName}</span> <span style="font-size: 0.85em; color: #FFE082; font-weight: bold; background: rgba(255, 224, 130, 0.2); padding: 2px 6px; border-radius: 4px; margin-left: 4px;">(Desmarcado)</span>`;
        } else {
            // Componente activo
            return `<span style="color: white;">${component}</span>`;
        }
    }).join(', ');
}

// Función para calcular el número del módulo basado en módulos únicos del mismo POS
function getModuleNumber(posData, allPosData) {
    if (!posData || !allPosData || allPosData.length === 0) {
        return 1;
    }
    
    // Obtener la clave única del POS (id_ticket + serial_pos)
    const currentPosKey = `${posData.id_ticket}_${posData.serial_pos}`;
    
    // Filtrar todos los registros del mismo POS
    const samePosModules = allPosData.filter(p => 
        `${p.id_ticket}_${p.serial_pos}` === currentPosKey
    );
    
    // Obtener módulos únicos del mismo POS, ordenados por fecha
    const uniqueModules = [];
    const seenModules = new Set();
    
    // Ordenar por fecha para mantener el orden cronológico
    const sortedModules = samePosModules.sort((a, b) => {
        const dateA = new Date(a.component_insert_date || 0);
        const dateB = new Date(b.component_insert_date || 0);
        return dateA - dateB;
    });
    
    // Agregar módulos únicos en orden
    sortedModules.forEach(module => {
        const moduleKey = module.modulo_insert || 'Sin Módulo';
        if (!seenModules.has(moduleKey)) {
            seenModules.add(moduleKey);
            uniqueModules.push(moduleKey);
        }
    });
    
    // Encontrar el índice del módulo actual en la lista de módulos únicos
    const currentModuleKey = posData.modulo_insert || 'Sin Módulo';
    const moduleIndex = uniqueModules.indexOf(currentModuleKey);
    
    // Retornar el número del módulo (1-based)
    return moduleIndex >= 0 ? moduleIndex + 1 : 1;
}

// Función para generar el HTML del contenido del POS
function generatePosContentHtml(posData, currentIndex, totalPos) {
    // Obtener la clave única del POS (id_ticket + serial_pos)
    const currentPosKey = `${posData.id_ticket}_${posData.serial_pos}`;
    
    // Usar todos los registros completos si están disponibles, sino usar allPosDataGlobal
    const allRecords = window.allPosDataGlobalFull || allPosDataGlobal;
    
    // Filtrar todos los módulos del mismo POS
    const samePosModules = allRecords.filter(p => {
        const recordKey = `${p.id_ticket}_${p.serial_pos}`;
        return recordKey === currentPosKey;
    });
        
    // Ordenar módulos por fecha de inserción (cronológicamente, del más antiguo al más reciente)
    const sortedModules = samePosModules.sort((a, b) => {
        // Parsear fechas en formato 'YYYY-MM-DD HH24:MI' o 'YYYY-MM-DD HH:MI'
        const parseDate = (dateStr) => {
            if (!dateStr) return new Date(0);
            // El formato viene como 'YYYY-MM-DD HH24:MI' o 'YYYY-MM-DD HH:MI'
            // Reemplazar espacios por 'T' para compatibilidad con ISO 8601
            const isoDate = dateStr.replace(' ', 'T');
            const date = new Date(isoDate);
            return isNaN(date.getTime()) ? new Date(0) : date;
        };
        
        const dateA = parseDate(a.component_insert_date);
        const dateB = parseDate(b.component_insert_date);
        return dateA - dateB; // Orden ascendente (más antiguo primero)
    });
    
    // Generar HTML para cada módulo
    let modulesHtml = '';
    if (sortedModules.length === 0) {
        modulesHtml = `
            <div class="col-12">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    No se encontraron módulos para este POS.
                </div>
            </div>
        `;
    } else {
        sortedModules.forEach((moduleData, index) => {
            const moduleNumber = index + 1;
            modulesHtml += `
            <div class="col-12 ${index > 0 ? 'mt-3' : ''}">
                <div class="pos-module-card">
                    <div class="pos-module-header">
                        <div class="pos-module-title">
                            <i class="fas fa-layer-group me-2"></i>
                            <span>${moduleData.modulo_insert || 'Módulo Sin Nombre'}</span>
                        </div>
                        <div class="pos-module-badge">
                            <span class="badge pos-module-number">#${moduleNumber}</span>
                        </div>
                    </div>
                    <div class="pos-module-body">
                        <div class="pos-module-table">
                            <div class="pos-module-row">
                                <div class="pos-module-cell pos-module-cell-user">
                                    <div class="pos-module-cell-header">
                                        <i class="fas fa-user me-2"></i>
                                        <span>Usuario Responsable</span>
                                    </div>
                                    <div class="pos-module-cell-content">
                                        <span class="pos-module-value">${moduleData.full_name || 'No disponible'}</span>
                                    </div>
                                </div>
                                <div class="pos-module-cell pos-module-cell-date">
                                    <div class="pos-module-cell-header">
                                        <i class="fas fa-calendar me-2"></i>
                                        <span>Fecha de Registro</span>
                                    </div>
                                    <div class="pos-module-cell-content">
                                        <span class="pos-module-value">${moduleData.component_insert_date || 'No disponible'}</span>
                                    </div>
                                </div>
                                <div class="pos-module-cell pos-module-cell-region">
                                    <div class="pos-module-cell-header">
                                        <i class="fas fa-map-marker-alt me-2"></i>
                                        <span>Región Registro</span>
                                    </div>
                                    <div class="pos-module-cell-content">
                                        <span class="pos-module-value">${moduleData.name_region || 'No disponible'}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="pos-module-row pos-module-row-components">
                                <div class="pos-module-cell pos-module-cell-full">
                                    <div class="pos-module-cell-header">
                                        <i class="fas fa-puzzle-piece me-2"></i>
                                        <span>Periférico Asociados</span>
                                    </div>
                                    <div class="pos-module-cell-content">
                                        <div class="pos-components-badge">
                                            ${formatComponentsList(moduleData.aggregated_components_by_module || 'No disponible')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        });
    }
    
    return `
        <!-- Información principal en grid responsivo -->
        <div class="row g-3 mb-4">
            <!-- Serial del POS -->
            <div class="col-xl-4 col-lg-6 col-md-6">
                <div class="pos-card pos-card-info">
                    <div class="pos-card-header">
                        <i class="fas fa-barcode"></i>
                        <span>Serial POS</span>
                    </div>
                    <div class="pos-card-body">
                        <div class="pos-info-item">
                            <span class="pos-value pos-serial">${posData.serial_pos || 'No disponible'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Información del Banco -->
            <div class="col-xl-4 col-lg-6 col-md-6">
                <div class="pos-card pos-card-success">
                    <div class="pos-card-header">
                        <i class="fas fa-university"></i>
                        <span>Banco</span>
                    </div>
                    <div class="pos-card-body">
                        <div class="pos-info-item">
                            <span class="pos-value pos-bank">${posData.banco_ibp || 'No disponible'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tipo de POS -->
            <div class="col-xl-4 col-lg-6 col-md-6">
                <div class="pos-card pos-card-warning">
                    <div class="pos-card-header">
                        <i class="fas fa-cogs"></i>
                        <span>Modelo</span>
                    </div>
                    <div class="pos-card-body">
                        <div class="pos-info-item">
                            <span class="pos-value pos-model">${posData.tipo_pos || 'No disponible'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Información del Ticket -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="pos-card pos-card-primary">
                    <div class="pos-card-header">
                        <i class="fas fa-ticket-alt"></i>
                        <span>Información del Ticket</span>
                    </div>
                    <div class="pos-card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="pos-info-item">
                                    <label>N° Ticket</label>
                                    <span class="pos-value">${posData.nro_ticket || 'No disponible'}</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="pos-info-item">
                                    <label>ID Ticket</label>
                                    <span class="pos-value">${posData.id_ticket || 'No disponible'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Componentes por Módulo -->
        <div class="pos-modules-section">
            <div class="pos-section-header">
                <h5 class="pos-section-title">
                    <i class="fas fa-puzzle-piece me-2"></i>
                    Periférico por Gestión
                </h5>
                <div class="pos-section-line"></div>
            </div>
            
            <div class="row g-3">
                ${modulesHtml}
            </div>
        </div>
    `;
}

// Función para actualizar el contenido del modal
function updateModalContent() {
    if (allPosDataGlobal.length === 0) {
        return;
    }
    
    const posData = allPosDataGlobal[currentPosIndex];
    if (!posData) {
        return;
    }
    
    const contentContainer = document.querySelector('.pos-modal-content-container');
    
    if (contentContainer) {
        contentContainer.innerHTML = generatePosContentHtml(posData, currentPosIndex, allPosDataGlobal.length);
        // Hacer scroll al inicio del contenedor para que el usuario vea el cambio
        contentContainer.scrollTop = 0;
    }
    
    // Actualizar estado de las flechas
    const prevArrows = document.querySelectorAll('.pos-nav-arrow.prev');
    const nextArrows = document.querySelectorAll('.pos-nav-arrow.next');
    
    prevArrows.forEach(prevArrow => {
        if (currentPosIndex === 0) {
            prevArrow.disabled = true;
            prevArrow.style.opacity = '0.4';
            prevArrow.style.cursor = 'not-allowed';
            prevArrow.style.pointerEvents = 'none';
        } else {
            prevArrow.disabled = false;
            prevArrow.style.opacity = '1';
            prevArrow.style.cursor = 'pointer';
            prevArrow.style.pointerEvents = 'auto';
        }
    });
    
    nextArrows.forEach(nextArrow => {
        if (currentPosIndex >= allPosDataGlobal.length - 1) {
            nextArrow.disabled = true;
            nextArrow.style.opacity = '0.4';
            nextArrow.style.cursor = 'not-allowed';
            nextArrow.style.pointerEvents = 'none';
        } else {
            nextArrow.disabled = false;
            nextArrow.style.opacity = '1';
            nextArrow.style.cursor = 'pointer';
            nextArrow.style.pointerEvents = 'auto';
        }
    });
    
    // Actualizar contador en el header
    const counter = document.querySelector('.pos-nav-counter');
    if (counter) {
        counter.textContent = `${currentPosIndex + 1} / ${allPosDataGlobal.length}`;
    }
    
    // Actualizar contador en la parte inferior
    const counterText = document.querySelector('.pos-nav-counter-text');
    if (counterText) {
        counterText.textContent = `${currentPosIndex + 1} / ${allPosDataGlobal.length}`;
    }
}

// Función para navegar al siguiente POS
function navigateToNextPos() {
    if (currentPosIndex < allPosDataGlobal.length - 1) {
        currentPosIndex++;
        updateModalContent();
    }
}

// Función para navegar al POS anterior
function navigateToPrevPos() {
    if (currentPosIndex > 0) {
        currentPosIndex--;
        updateModalContent();
    }
}

// Función para mostrar el modal de componentes con datos reales
function showComponentsModal(idTicket, serialPos, nroTicket) {
    // Guardar datos actuales
    currentModalData = { idTicket, serialPos, nroTicket };
    
    // Mostrar loading
    Swal.fire({
        title: 'Cargando información del POS...',
        text: 'Por favor espera mientras obtenemos la información del POS',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Llamada AJAX para obtener TODOS los POS con componentes
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetAllPOSInfo`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        Swal.close(); // Cerrar el loading

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success && response.tickets && response.tickets.length > 0) {
                    // Guardar todos los registros (incluyendo todos los módulos)
                    const allRecords = Array.isArray(response.tickets) ? response.tickets : [response.tickets];
                    
                    // Agrupar por ticket + serial para obtener POS únicos
                    const uniquePosMap = new Map();
                    allRecords.forEach(record => {
                        const posKey = `${record.id_ticket}_${record.serial_pos}`;
                        if (!uniquePosMap.has(posKey)) {
                            // Guardar el primer registro de cada POS único (usaremos todos los registros en generatePosContentHtml)
                            uniquePosMap.set(posKey, record);
                        }
                    });
                    
                    // Convertir el Map a array para mantener el orden
                    allPosDataGlobal = Array.from(uniquePosMap.values());
                    
                    // Guardar todos los registros originales para usar en generatePosContentHtml
                    window.allPosDataGlobalFull = allRecords;
                    
                    // Normalizar valores para búsqueda
                    const normalizedSerialPos = String(serialPos || '').trim();
                    const normalizedIdTicket = parseInt(idTicket || 0);
                    const normalizedNroTicket = String(nroTicket || '').trim();
                    
                    // Buscar el índice del POS que coincide con el serial e id_ticket seleccionado
                    // Priorizar coincidencia exacta con serial + id_ticket + nro_ticket
                    let selectedIndex = -1;
                    
                    // Primero intentar coincidencia exacta con todos los campos
                    if (normalizedNroTicket) {
                        selectedIndex = allPosDataGlobal.findIndex(pos => {
                            const posSerial = String(pos.serial_pos || '').trim();
                            const posTicket = parseInt(pos.id_ticket || 0);
                            const posNroTicket = String(pos.nro_ticket || '').trim();
                            
                            return posSerial === normalizedSerialPos && 
                                   posTicket === normalizedIdTicket &&
                                   posNroTicket === normalizedNroTicket;
                        });
                    }
                    
                    // Si no se encuentra, buscar solo por serial e id_ticket
                    if (selectedIndex === -1) {
                        selectedIndex = allPosDataGlobal.findIndex(pos => {
                            const posSerial = String(pos.serial_pos || '').trim();
                            const posTicket = parseInt(pos.id_ticket || 0);
                            
                            return posSerial === normalizedSerialPos && posTicket === normalizedIdTicket;
                        });
                    }
                    
                    // Si aún no se encuentra, buscar solo por serial
                    if (selectedIndex === -1) {
                        selectedIndex = allPosDataGlobal.findIndex(pos => {
                            const posSerial = String(pos.serial_pos || '').trim();
                            return posSerial === normalizedSerialPos;
                        });
                    }
                    
                    // Si se encuentra, empezar desde ese índice, sino desde el primero
                    currentPosIndex = selectedIndex >= 0 ? selectedIndex : 0;
                    
                    // Obtener el POS inicial para mostrar (el seleccionado o el primero)
                    const initialPosData = allPosDataGlobal[currentPosIndex];
                    
                    // Crear HTML para mostrar la información del POS
                    let posInfoHtml = `
                        <div class="pos-modal-container">
                            <!-- Header con gradiente empresarial -->
                            <div class="pos-header mb-4">
                                <div class="d-flex align-items-center justify-content-center mb-3">
                                    <div class="pos-icon-container">
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <!-- Componente electrónico -->
                                            <rect x="4" y="8" width="24" height="16" rx="2" fill="currentColor" opacity="0.8"/>
                                            <rect x="6" y="10" width="20" height="12" rx="1" fill="currentColor"/>
                                            <!-- Circuitos internos -->
                                            <rect x="8" y="12" width="4" height="1" fill="white" opacity="0.7"/>
                                            <rect x="8" y="14" width="6" height="1" fill="white" opacity="0.7"/>
                                            <rect x="8" y="16" width="3" height="1" fill="white" opacity="0.7"/>
                                            <rect x="8" y="18" width="5" height="1" fill="white" opacity="0.7"/>
                                            <!-- Pines de conexión -->
                                            <rect x="2" y="14" width="2" height="4" rx="1" fill="currentColor" opacity="0.6"/>
                                            <rect x="28" y="14" width="2" height="4" rx="1" fill="currentColor" opacity="0.6"/>
                                            <!-- Indicador LED -->
                                            <circle cx="20" cy="16" r="1.5" fill="#00ff88"/>
                                        </svg>
                                    </div>
                                    <div class="ms-3">
                                        <h4 class="pos-title mb-1">Información del POS</h4>
                                        <p class="pos-subtitle mb-0">Módulo Gestión de Periférico</p>
                                    </div>
                                </div>
                                <div class="pos-stats">
                                    <span class="badge pos-badge-primary">
                                        <i class="fas fa-layer-group me-1"></i>
                                        ${allPosDataGlobal.length} Periférico${allPosDataGlobal.length !== 1 ? 's' : ''} Registrado${allPosDataGlobal.length !== 1 ? 's' : ''}
                                    </span>
                                    <span class="badge pos-badge-primary ms-2 pos-nav-counter" style="background: rgba(255, 255, 255, 0.3);">
                                        ${currentPosIndex + 1} / ${allPosDataGlobal.length}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Contenedor del contenido (se actualizará dinámicamente) -->
                            <div class="pos-modal-content-container">
                                ${generatePosContentHtml(initialPosData, currentPosIndex, allPosDataGlobal.length)}
                            </div>

                            <!-- Nota informativa empresarial -->
                            <div class="pos-footer-note">
                                <div class="pos-note-content">
                                        <i class="fas fa-info-circle me-2"></i>
                                    <div>
                                        <strong>Información del Módulo</strong>
                                        <p class="mb-0">Esta información se obtiene desde la base de datos de Soporte Post-Venta y muestra todos los registros de Periféricos registrados para este serial de POS, organizados por módulo de gestión técnica.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Navegación con flechas en la parte inferior -->
                            <div class="pos-navigation-footer">
                                <button class="pos-nav-arrow prev" type="button" title="Anterior">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <span class="pos-nav-counter-text">${currentPosIndex + 1} / ${allPosDataGlobal.length}</span>
                                <button class="pos-nav-arrow next" type="button" title="Siguiente">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        <style>
                            /* Estilos globales del modal */
                            .pos-modal-popup {
                                border-radius: 20px !important;
                                overflow: hidden !important;
                                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25) !important;
                                max-height: 95vh !important;
                                margin-left: 16%;
                            }
                            
                            .pos-modal-container-wrapper {
                                padding: 0 !important;
                            }
                            
                            .pos-modal-html-container {
                                padding: 0 !important;
                                max-height: 85vh !important;
                                overflow-y: auto !important;
                            }

                            .pos-modal-container {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                color: #2c3e50;
                                max-height: 85vh;
                                overflow-y: auto;
                                background: #f8f9fa;
                                padding: 1.5rem;
                            }

                            .pos-header {
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                padding: 2rem;
                                border-radius: 15px;
                                text-align: center;
                                position: relative;
                                overflow: hidden;
                            }

                            .pos-header::before {
                                content: '';
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                                opacity: 0.3;
                            }

                            .pos-icon-container {
                                width: 60px;
                                height: 60px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 24px;
                                backdrop-filter: blur(10px);
                                border: 2px solid rgba(255, 255, 255, 0.3);
                            }

                            .pos-title {
                                font-size: 1.8rem;
                                font-weight: 700;
                                margin: 0;
                                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            }

                            .pos-subtitle {
                                font-size: 0.95rem;
                                opacity: 0.9;
                                font-weight: 300;
                            }

                            .pos-stats {
                                position: relative;
                                z-index: 1;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-wrap: wrap;
                                gap: 0.5rem;
                            }

                            .pos-badge-primary {
                                background: rgba(255, 255, 255, 0.2);
                                color: white;
                                padding: 0.5rem 1rem;
                                border-radius: 25px;
                                font-weight: 500;
                                backdrop-filter: blur(10px);
                                border: 1px solid rgba(255, 255, 255, 0.3);
                            }

                            .pos-navigation-footer {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 1.5rem;
                                margin-top: 2rem;
                                padding: 1.5rem;
                                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                                border-radius: 12px;
                                border: 1px solid #dee2e6;
                            }

                            .pos-nav-arrow {
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                                border: 2px solid rgba(102, 126, 234, 0.3) !important;
                                border-radius: 50% !important;
                                width: 50px !important;
                                height: 50px !important;
                                display: flex !important;
                                align-items: center !important;
                                justify-content: center !important;
                                color: white !important;
                                cursor: pointer !important;
                                transition: all 0.3s ease !important;
                                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
                                position: relative !important;
                                z-index: 10 !important;
                            }

                            .pos-nav-arrow:hover:not(:disabled) {
                                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
                                transform: scale(1.1) !important;
                                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
                            }

                            .pos-nav-arrow:active:not(:disabled) {
                                transform: scale(0.95) !important;
                            }

                            .pos-nav-arrow:disabled {
                                opacity: 0.4 !important;
                                cursor: not-allowed !important;
                                background: #6c757d !important;
                            }

                            .pos-nav-arrow i {
                                font-size: 1.5rem !important;
                                font-weight: bold !important;
                            }

                            .pos-nav-counter {
                                background: rgba(255, 255, 255, 0.3) !important;
                            }

                            .pos-nav-counter-text {
                                font-size: 1.1rem;
                                font-weight: 600;
                                color: #2c3e50;
                                padding: 0.5rem 1.5rem;
                                background: white;
                                border-radius: 25px;
                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                                min-width: 80px;
                                text-align: center;
                            }

                            .pos-card {
                                background: white;
                                border-radius: 12px;
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                                border: 1px solid #e9ecef;
                                transition: all 0.3s ease;
                                height: 100%;
                                overflow: hidden;
                            }

                            .pos-card:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                            }

                            .pos-card-header {
                                padding: 1rem 1.25rem;
                                font-weight: 600;
                                font-size: 0.9rem;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                            }

                            .pos-card-primary .pos-card-header {
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                            }

                            .pos-card-info .pos-card-header {
                                background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
                                color: white;
                            }

                            .pos-card-success .pos-card-header {
                                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                                color: white;
                            }

                            .pos-card-warning .pos-card-header {
                                background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
                                color: #212529;
                            }

                            .pos-card-body {
                                padding: 1.25rem;
                            }

                            .pos-info-item {
                                margin-bottom: 1rem;
                                text-align: center;
                            }

                            .pos-info-item:last-child {
                                margin-bottom: 0;
                            }

                            .pos-info-item label {
                                display: block;
                                font-size: 0.8rem;
                                font-weight: 600;
                                color: #6c757d;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                                margin-bottom: 0.25rem;
                                width: 97% !important;
                            }

                            .pos-value {
                                display: block;
                                font-size: 1rem;
                                font-weight: 600;
                                color: #2c3e50;
                                word-break: break-word;
                                text-align: center !important;
                            }

                            /* CSS específico para la sección del ticket */
                            .pos-card-primary .pos-info-item {
                                text-align: center !important;
                            }

                            .pos-card-primary .pos-info-item label {
                                text-align: center !important;
                            }

                            .pos-card-primary .pos-info-item .pos-value {
                                text-align: center !important;
                            }

                            .pos-serial {
                                font-family: 'Courier New', monospace;
                                background: #f8f9fa;
                                padding: 0.25rem 0.5rem;
                                border-radius: 4px;
                                border: 1px solid #dee2e6;
                            }

                            .pos-bank, .pos-model {
                                font-weight: 500;
                                line-height: 1.4;
                            }

                            .pos-modules-section {
                                margin-top: 2rem;
                            }

                            .pos-section-header {
                                display: flex;
                                align-items: center;
                                margin-bottom: 1.5rem;
                                position: relative;
                            }

                            .pos-section-title {
                                font-size: 1.3rem;
                                font-weight: 700;
                                color: #2c3e50;
                                margin: 0;
                                background: white;
                                padding-right: 1rem;
                                z-index: 1;
                                position: relative;
                            }

                            .pos-section-line {
                                flex: 1;
                                height: 2px;
                                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                                border-radius: 1px;
                                margin-left: 1rem;
                            }

                            .pos-module-card {
                                background: white;
                                border-radius: 12px;
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                                border: 1px solid #e9ecef;
                                transition: all 0.3s ease;
                                overflow: hidden;
                            }

                            .pos-module-card:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                            }

                            .pos-module-header {
                                background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
                                color: white;
                                padding: 1rem 1.25rem;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            }

                            .pos-module-title {
                                font-weight: 600;
                                font-size: 1rem;
                                display: flex;
                                align-items: center;
                            }

                            .pos-module-badge {
                                display: flex;
                                align-items: center;
                            }

                            .pos-module-number {
                                background: rgba(255, 255, 255, 0.2);
                                color: white;
                                border: 1px solid rgba(255, 255, 255, 0.3);
                                font-weight: 600;
                                padding: 0.25rem 0.75rem;
                                border-radius: 15px;
                                font-size: 0.8rem;
                            }

                            .pos-module-body {
                                padding: 1.5rem;
                            }

                            .pos-module-table {
                                width: 100%;
                            }

                            .pos-module-row {
                                display: flex;
                                margin-bottom: 1rem;
                                border-radius: 8px;
                                overflow: hidden;
                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                            }

                            .pos-module-row:last-child {
                                margin-bottom: 0;
                            }

                            .pos-module-row-components {
                                background: #f8f9fa;
                                border: 1px solid #e9ecef;
                            }

                            .pos-module-cell {
                                padding: 1rem;
                                background: white;
                                border-right: 1px solid #e9ecef;
                                flex: 1;
                            }

                            .pos-module-cell:last-child {
                                border-right: none;
                            }

                            .pos-module-cell-user {
                                flex: 0 0 33.33%;
                            }

                            .pos-module-cell-date {
                                flex: 0 0 33.33%;
                            }

                            .pos-module-cell-region {
                                flex: 0 0 33.33%;
                            }

                            .pos-module-cell-full {
                                flex: 1;
                            }

                            .pos-module-cell-header {
                                display: flex;
                                align-items: center;
                                margin-bottom: 0.5rem;
                                font-size: 0.8rem;
                                font-weight: 600;
                                color: #6c757d;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            }

                            .pos-module-cell-content {
                                display: flex;
                                align-items: center;
                            }

                            .pos-module-value {
                                font-size: 0.95rem;
                                font-weight: 500;
                                color: #2c3e50;
                                line-height: 1.4;
                            }

                            .pos-components-badge {
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                padding: 0.75rem 1rem;
                                border-radius: 8px;
                                font-size: 0.9rem;
                                font-weight: 500;
                                line-height: 1.4;
                                word-break: break-word;
                                display: inline-block;
                                max-width: 100%;
                            }

                            .pos-footer-note {
                                margin-top: 2rem;
                                background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
                                border: 1px solid #bbdefb;
                                border-radius: 12px;
                                padding: 1.5rem;
                            }

                            .pos-note-content {
                                display: flex;
                                align-items: flex-start;
                                gap: 1rem;
                            }

                            .pos-note-content i {
                                color: #1976d2;
                                font-size: 1.2rem;
                                margin-top: 0.25rem;
                            }

                            .pos-note-content strong {
                                color: #1976d2;
                                font-size: 1rem;
                                display: block;
                                margin-bottom: 0.5rem;
                            }

                            .pos-note-content p {
                                color: #424242;
                                font-size: 0.9rem;
                                line-height: 1.5;
                                margin: 0;
                            }

                            /* Responsive Design */
                            @media (min-width: 1400px) {
                                .pos-modal-container {
                                    padding: 2rem;
                                }
                                
                                .pos-header {
                                    padding: 2.5rem;
                                }
                                
                                .pos-title {
                                    font-size: 2rem;
                                }
                                
                                .pos-card-body {
                                    padding: 1.5rem;
                                }
                                
                                .pos-module-body {
                                    padding: 2rem;
                                }
                            }

                            @media (max-width: 1200px) {
                                .pos-header {
                                    padding: 1.5rem;
                                }
                                
                                .pos-title {
                                    font-size: 1.5rem;
                                }
                            }

                            @media (max-width: 768px) {
                                .pos-header {
                                    padding: 1.25rem;
                                }
                                
                                .pos-icon-container {
                                    width: 50px;
                                    height: 50px;
                                    font-size: 20px;
                                }
                                
                                .pos-title {
                                    font-size: 1.3rem;
                                }
                                
                                .pos-subtitle {
                                    font-size: 0.85rem;
                                }
                                
                                .pos-module-row {
                                    flex-direction: column;
                                }
                                
                                .pos-module-cell {
                                    border-right: none;
                                    border-bottom: 1px solid #e9ecef;
                                }
                                
                                .pos-module-cell:last-child {
                                    border-bottom: none;
                                }
                                
                                .pos-module-cell-user,
                                .pos-module-cell-date,
                                .pos-module-cell-region {
                                    flex: 1;
                                }
                            }

                            @media (max-width: 576px) {
                                .pos-header {
                                    padding: 1rem;
                                }
                                
                                .pos-card-body {
                                    padding: 1rem;
                                }
                                
                                .pos-module-body {
                                    padding: 1rem;
                                }
                                
                                .pos-footer-note {
                                    padding: 1rem;
                                }
                                
                                .pos-note-content {
                                    flex-direction: column;
                                    gap: 0.5rem;
                                }
                            }
                        </style>
                    `;

                    // Mostrar el modal con la información del POS
                    Swal.fire({
                        title: '',
                        html: posInfoHtml,
                        showConfirmButton: true,
                        confirmButtonText: 'Cerrar',
                        confirmButtonColor: '#667eea',
                        width: '65%',
                        maxWidth: '1400px',
                        padding: '0',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        customClass: {
                            popup: 'pos-modal-popup',
                            container: 'pos-modal-container-wrapper',
                            htmlContainer: 'pos-modal-html-container'
                        },
                        didOpen: () => {
                            // Aplicar estilos adicionales al modal
                            const modal = document.querySelector('.pos-modal-popup');
                            if (modal) {
                                modal.style.borderRadius = '20px';
                                modal.style.overflow = 'hidden';
                                modal.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.25)';
                            }
                            
                            // Esperar un momento para que el DOM esté completamente renderizado
                            setTimeout(() => {
                                // Inicializar estado de las flechas
                                updateModalContent();
                                
                                // Agregar event listeners a las flechas (puede haber múltiples instancias)
                                const prevArrows = document.querySelectorAll('.pos-nav-arrow.prev');
                                const nextArrows = document.querySelectorAll('.pos-nav-arrow.next');
                                
                                prevArrows.forEach((arrow) => {
                                    // Remover listeners anteriores si existen
                                    const newArrow = arrow.cloneNode(true);
                                    arrow.parentNode.replaceChild(newArrow, arrow);
                                    
                                    newArrow.addEventListener('click', (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigateToPrevPos();
                                    });
                                });
                                
                                nextArrows.forEach((arrow) => {
                                    // Remover listeners anteriores si existen
                                    const newArrow = arrow.cloneNode(true);
                                    arrow.parentNode.replaceChild(newArrow, arrow);
                                    
                                    newArrow.addEventListener('click', (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigateToNextPos();
                                    });
                                });
                            }, 100);
                        }
                    });

                } else {
                    // No hay información del POS
                    Swal.fire({
                        title: 'Sin Información',
                        html: `
                            <div class="text-center">
                                <i class="fas fa-exclamation-triangle text-warning mb-3" style="font-size: 3rem;"></i>
                                <p>No se encontró información registrada para este POS.</p>
                                <small class="text-muted">Ticket: ${nroTicket} | Serial: ${serialPos}</small>
                            </div>
                        `,
                        icon: 'warning',
                        confirmButtonText: 'Cerrar',
                        confirmButtonColor: '#ffc107'
                    });
                }

            } catch (error) {
                console.error('Error parsing JSON:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Error al procesar la respuesta del servidor.',
                    icon: 'error',
                    confirmButtonText: 'Cerrar',
                    confirmButtonColor: '#dc3545'
                });
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: `Error del servidor: ${xhr.status} ${xhr.statusText}`,
                icon: 'error',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#dc3545'
            });
        }
    };

    xhr.onerror = function() {
        Swal.close();
        Swal.fire({
            title: 'Error de Conexión',
            text: 'No se pudo conectar al servidor. Verifica tu conexión a Internet.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#dc3545'
        });
    };

    // Enviar la solicitud
    const datos = 'action=GetAllPOSInfo';
    xhr.send(datos);
}

document.addEventListener('DOMContentLoaded', SearchTicketsComponents);

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

/*function formatTicketDetailsPanel(d) {
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
                          <button type="button" class="btn btn-link p-0" id="hiperbinComponents" data-id-ticket = ${d.id_ticket}" data-serial-pos = ${d.serial_pos}>
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
}*/

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
                    
                    // Calcular duración del estatus de Taller (solo cuando la acción es "En el Rosal" - terminó la estadía en taller)
                    // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde "Recibido en Taller"
                    // Nota: durationLabFromPreviousText y durationLabFromTallerText ya se calcularon arriba para el badge (solo cuando es "En el Rosal")
                    // isEnElRosalForLab ya está declarado arriba
                    
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
                    let buttonText = isCreation
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
        
        // Calcular duración del estatus de Taller (solo cuando la acción es "En el Rosal" - terminó la estadía en taller)
        // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde "Recibido en Taller"
        let durationLabFromPreviousText = '';
        let durationLabFromTallerText = '';
        if (previous) {
            const statusLabChanged = getChange(item.name_status_lab, previous.name_status_lab);
            const currentAccion = cleanString(item.name_accion_ticket);
            const isEnElRosal = currentAccion && currentAccion.toLowerCase().includes('en el rosal') && !currentAccion.toLowerCase().includes('en espera de confirmar recibido');
            
            if (isEnElRosal && statusLabChanged && cleanString(item.name_status_lab)) {
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
        // Mostrar dos tiempos: 1) tiempo desde la gestión anterior, 2) tiempo total desde la creación del ticket
        let statusDomDuration = '';
        if (previous) {
            const statusDomChanged = getChange(item.name_status_domiciliacion, previous.name_status_domiciliacion);
            if (statusDomChanged && cleanString(item.name_status_domiciliacion)) {
                // Tiempo 1: Desde la gestión anterior (ya calculado como elapsed)
                let durationFromPrevious = '';
                if (previous && previous.fecha_de_cambio) {
                    const elapsedFromPrevious = calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio);
                    if (elapsedFromPrevious) {
                        durationFromPrevious = elapsedFromPrevious.text;
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
                
                let durationFromCreation = '';
                if (ticketCreationDate) {
                    // Calcular duración desde la creación del ticket hasta el cambio actual
                    const duration = calculateTimeElapsed(ticketCreationDate, item.fecha_de_cambio);
                    if (duration) {
                        durationFromCreation = duration.text;
                    }
                }
                
                // Construir el texto con ambos tiempos
                if (durationFromPrevious && durationFromCreation) {
                    statusDomDuration = ` <span style="color: #6c757d; font-size: 0.75em;">(<strong>Tiempo en este cambio:</strong> ${durationFromPrevious} | <strong>Tiempo total:</strong> ${durationFromCreation})</span>`;
                } else if (durationFromPrevious) {
                    statusDomDuration = ` <span style="color: #6c757d; font-size: 0.75em;">(<strong>Tiempo en este cambio:</strong> ${durationFromPrevious})</span>`;
                } else if (durationFromCreation) {
                    statusDomDuration = ` <span style="color: #6c757d; font-size: 0.75em;">(<strong>Tiempo total:</strong> ${durationFromCreation})</span>`;
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
