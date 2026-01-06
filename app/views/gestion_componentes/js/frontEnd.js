
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
                            <button type="button" class="btn btn-info btn-sm ver-componentes-btn" style="background-color: #344767;"
                                data-id="${data.id_ticket}"
                                data-serial="${data.serial_pos}"
                                data-ticket="${data.nro_ticket}"
                                title="Ver Componentes del POS">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cpu-fill" viewBox="0 0 16 16">
                                    <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
                                    <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5"/>
                                </svg>
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
                                    // Obtener datos completos del ticket para tener todos los campos necesarios
                                    const xhrDetails = new XMLHttpRequest();
                                    xhrDetails.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketDataFinal`);
                                    
                                    xhrDetails.onload = function() {
                                        if (xhrDetails.status >= 200 && xhrDetails.status < 300) {
                                            try {
                                                const responseDetails = JSON.parse(xhrDetails.responseText);
                                                if (responseDetails.success && responseDetails.ticket && responseDetails.ticket.length > 0) {
                                                    // Buscar el ticket específico en los datos completos
                                                    const completeTicketData = responseDetails.ticket.find(
                                                        (t) => t.id_ticket == ticketId
                                                    );
                                                    
                                                    // Combinar los datos: usar los completos si existen, sino usar los básicos
                                                    const finalTicketData = completeTicketData ? 
                                                        { ...selectedTicketDetails, ...completeTicketData } : 
                                                        selectedTicketDetails;
                                                    
                                                    detailsPanel.innerHTML = formatTicketDetailsPanel(finalTicketData);
                                                    loadTicketHistory(ticketId, finalTicketData.nro_ticket, finalTicketData.serial_pos || '');
                                                    if (finalTicketData.serial_pos) {
                                                        downloadImageModal(finalTicketData.serial_pos);
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
                                                    // Si no se obtienen datos completos, usar los básicos
                                                    detailsPanel.innerHTML = formatTicketDetailsPanel(selectedTicketDetails);
                                                    loadTicketHistory(ticketId, selectedTicketDetails.nro_ticket, selectedTicketDetails.serial_pos || '');
                                                    if (selectedTicketDetails.serial_pos) {
                                                        downloadImageModal(selectedTicketDetails.serial_pos);
                                                    }
                                                }
                                            } catch (e) {
                                                console.error('Error al procesar datos completos del ticket:', e);
                                                // En caso de error, usar los datos básicos
                                                detailsPanel.innerHTML = formatTicketDetailsPanel(selectedTicketDetails);
                                                loadTicketHistory(ticketId, selectedTicketDetails.nro_ticket, selectedTicketDetails.serial_pos || '');
                                                if (selectedTicketDetails.serial_pos) {
                                                    downloadImageModal(selectedTicketDetails.serial_pos);
                                                }
                                            }
                                        } else {
                                            // En caso de error, usar los datos básicos
                                            detailsPanel.innerHTML = formatTicketDetailsPanel(selectedTicketDetails);
                                            loadTicketHistory(ticketId, selectedTicketDetails.nro_ticket, selectedTicketDetails.serial_pos || '');
                                            if (selectedTicketDetails.serial_pos) {
                                                downloadImageModal(selectedTicketDetails.serial_pos);
                                            }
                                        }
                                    };
                                    
                                    xhrDetails.onerror = function() {
                                        // En caso de error de red, usar los datos básicos
                                        detailsPanel.innerHTML = formatTicketDetailsPanel(selectedTicketDetails);
                                        loadTicketHistory(ticketId, selectedTicketDetails.nro_ticket, selectedTicketDetails.serial_pos || '');
                                        if (selectedTicketDetails.serial_pos) {
                                            downloadImageModal(selectedTicketDetails.serial_pos);
                                        }
                                    };
                                    
                                    xhrDetails.send();
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