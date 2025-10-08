
let currentTicketNroForImage = null;
let paymentAgreementModalInstance = null; // Variable global para la instancia del modal

function searchDomiciliacionTickets() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/getDomiciliacionTickets`);
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
                    currentTicketNroForImage = TicketData[0].nro_ticket;

                    // Definir la longitud de truncado para las celdas
                    const displayLengthForTruncate = 25; // Puedes ajustar este valor

                    const columnDefinitions = [
                        // NUEVA COLUMNA DE NUMERACIÓN AGREGADA AL PRINCIPIO
                        {
                            title: "N°",
                            orderable: false,
                            searchable: false,
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            },
                        },
                        { data: 'nro_ticket', title: 'N° Ticket' },
                        {
                            data: 'razonsocial_cliente',
                            title: 'Razon social',
                            // *** MODIFICACIÓN PARA TRUNCAR/EXPANDIR TEXTO ***
                            render: function (data, type, row) {
                                if (type === 'display' && data && data.length > displayLengthForTruncate) {
                                    return `<span class="truncated-cell" data-full-text="${data}">${data.substring(0, displayLengthForTruncate)}...</span>`;
                                }
                                return data;
                            }
                            // ************************************************
                        },
                        { data: 'rif', title: 'Rif' },
                        { data: 'serial_pos', title: 'Serial POS' },
                        { 
                            data: 'id_status_domiciliacion', 
                            title: 'ID Domiciliación',
                            visible: false  // OCULTA LA COLUMNA PERO MANTIENE LOS DATOS PARA FILTROS
                        },
                        {
                            data: 'name_accion_ticket',
                            title: 'Acción Realizada',
                            // *** MODIFICACIÓN PARA TRUNCAR/EXPANDIR TEXTO ***
                            render: function (data, type, row) {
                                if (type === 'display' && data && data.length > displayLengthForTruncate) {
                                    return `<span class="truncated-cell" data-full-text="${data}">${data.substring(0, displayLengthForTruncate)}...</span>`;
                                }
                                return data;
                            }
                            // ************************************************
                        },
                        { data: 'name_status_lab', title: 'Estado de Taller' },
                        {data: 'name_status_domiciliacion', title: 'Estado de Domiciliación'},
                        {
                            data: null,
                            title: 'Acciones',
                            orderable: false,
                            searchable: false,
                            width: "10%",
                            render: function (data, type, row) {
                                const idTicket = row.id_ticket;
                                const currentStatusDomiciliacion = row.id_status_domiciliacion;
                                const currentNameStatusDomiciliacion = row.name_status_domiciliacion;

                               /* if (currentStatusDomiciliacion == 2) {
                                    return `<button class="btn btn-secondary btn-sm" disabled>Solvente</button>`;
                                } else {*/
                                    return `
                                        <button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-domiciliacion-btn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#changeStatusDomiciliacionModal"
                                            data-id="${idTicket}"
                                            data-current-status-id="${currentStatusDomiciliacion}"
                                            data-current-status-name="${currentNameStatusDomiciliacion}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-check-fill" viewBox="0 0 16 16">
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5m9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5m-2.6 5.854a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                                            </svg>
                                        </button>`;
                                /*}*/
                            }
                        }
                    ];

                    const thead = existingTable.querySelector('thead');
                    thead.innerHTML = '';
                    const headerRow = thead.insertRow();
                    columnDefinitions.forEach(col => {
                        const th = document.createElement('th');
                        th.textContent = col.title;
                        headerRow.appendChild(th);
                    });

                    if (TicketData && TicketData.length > 0) {
                        const dataTableInstance = $(existingTable).DataTable({
                            scrollX: "200px",
                            responsive: false,
                            data: TicketData,
                            columns: columnDefinitions,
                            "pagingType": "simple_numbers",
                            "lengthMenu": [5, 10, 25, 50],
                            autoWidth: false,
                            "language": {
                                "lengthMenu": "Mostrar _MENU_",
                                "emptyTable": "No hay datos disponibles en la tabla",
                                "zeroRecords": "No se encontraron resultados para la búsqueda",
                                "info": "(_PAGE_/_PAGES_) _TOTAL_ Registros",
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
                            dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
                            initComplete: function (settings, json) {
                                const dataTableInstance = this.api();
                                const buttonsHtml = `
                                    <button id="btn-pendiente-revisar" class="btn btn-secondary me-2" title="Pendiente Por revisar domiciliacion">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
                                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1.001.025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.417.41-.879.66-1.254l.866.5a7.98 7.98 0 0 1-.724 1.4l-.802-.646zm-.964 1.205c.122-.103.246-.198.369-.283l.758.653a8.073 8.073 0 0 1-.401.432l-.706-.707z"/>
                                            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
                                            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
                                        </svg>
                                    </button>

                                    <button id="btn-solvente" class="btn btn-secondary me-2" title="Tickets Solventes">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                        </svg>
                                    </button>

                                    <button id="btn-gestion-comercial" class="btn btn-secondary me-2" title="Gestión Comercial (Deuda Domiciliación)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bank" viewBox="0 0 16 16">
                                            <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.501.501 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89L8 0ZM3.777 3h8.447L8 1 3.777 3ZM2 6v7h1V6H2Zm2 0v7h2.5V6H4Zm3.5 0v7H10V6H7.5ZM11 6v7h1V6h-1Zm1-1V3H4v2h8Z"/>
                                        </svg>
                                    </button>
                                `;
                                $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

                                // Aplicar estilos iniciales a todos los botones
                                function initializeButtonStyles() {
                                    $("#btn-solvente, #btn-gestion-comercial, #btn-pendiente-revisar")
                                        .css({
                                            'background-color': '#B0B0B0',
                                            'border-color': '#B0B0B0',
                                            'color': 'white',
                                            'transition': 'all 0.3s ease'
                                        });
                                }

                                // Inicializar estilos
                                initializeButtonStyles();

                                // Agregar estilos CSS personalizados para los botones
                                function addCustomButtonStyles() {
                                    const style = document.createElement('style');
                                    style.textContent = `
                                        #btn-solvente, #btn-gestion-comercial, #btn-pendiente-revisar {
                                            transition: all 0.3s ease !important;
                                        }
                                        
                                        #btn-pendiente-revisar:hover {
                                            background-color: #e55a2b !important;
                                            border-color: #e55a2b !important;
                                            color: white !important;
                                            transform: translateY(-1px);
                                            box-shadow: 0 2px 4px rgba(255, 107, 53, 0.4);
                                        }
                                        
                                        #btn-solvente:hover {
                                            background-color: #218838 !important;
                                            border-color: #218838 !important;
                                            color: white !important;
                                            transform: translateY(-1px);
                                            box-shadow: 0 2px 4px rgba(40, 167, 69, 0.4);
                                        }
                                        
                                        #btn-gestion-comercial:hover {
                                            background-color: #5a2d91 !important;
                                            border-color: #5a2d91 !important;
                                            color: white !important;
                                            transform: translateY(-1px);
                                            box-shadow: 0 2px 4px rgba(111, 66, 193, 0.4);
                                        }
                                        
                                        #btn-solvente:focus, #btn-gestion-comercial:focus, #btn-pendiente-revisar:focus {
                                            box-shadow: 0 0 0 0.25rem rgba(160, 160, 160, 0.25) !important;
                                        }
                                        
                                        #btn-pendiente-revisar.btn-primary {
                                            background-color: #ff6b35 !important;
                                            border-color: #ff6b35 !important;
                                            color: white !important;
                                            box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);
                                        }
                                        
                                        #btn-solvente.btn-primary {
                                            background-color: #28a745 !important;
                                            border-color: #28a745 !important;
                                            color: white !important;
                                            box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
                                        }
                                        
                                        #btn-gestion-comercial.btn-primary {
                                            background-color: #6f42c1 !important;
                                            border-color: #6f42c1 !important;
                                            color: white !important;
                                            box-shadow: 0 2px 4px rgba(111, 66, 193, 0.3);
                                        }
                                        
                                        #btn-solvente.btn-secondary, #btn-gestion-comercial.btn-secondary, #btn-pendiente-revisar.btn-secondary {
                                            background-color: #B0B0B0 !important;
                                            border-color: #B0B0B0 !important;
                                            color: white !important;
                                        }
                                    `;
                                    document.head.appendChild(style);
                                }

                                // Aplicar estilos personalizados
                                addCustomButtonStyles();

                                // Función para manejar la selección de botones
                                function setActiveButton(activeButtonId) {
                                    // Remover estilos activos de todos los botones
                                    $("#btn-solvente").removeClass("btn-primary").addClass("btn-secondary");
                                    $("#btn-gestion-comercial").removeClass("btn-primary").addClass("btn-secondary");
                                    $("#btn-pendiente-revisar").removeClass("btn-primary").addClass("btn-secondary");
                                    
                                    // Aplicar estilos activos al botón seleccionado
                                    $(`#${activeButtonId}`).removeClass("btn-secondary").addClass("btn-primary");
                                }

                                // Función para verificar si hay datos en una búsqueda específica
                                function checkDataExists(searchTerm, columnIndex) {
                                    dataTableInstance.columns().search('').draw(false);
                                    
                                    const filteredData = dataTableInstance.column(columnIndex).search(searchTerm, true, false).draw();
                                    const rowCount = dataTableInstance.rows({ filter: 'applied' }).count();
                                    
                                    return rowCount > 0;
                                }

                                // Función para buscar automáticamente el primer botón con datos
                                function findFirstButtonWithData() {
                                    // Buscar ID 1 (Pendiente Por revisar domiciliacion) en la columna de ID de Domiciliación (índice 5 - oculta)
                                    if (checkDataExists("^1$", 5)) {
                                        dataTableInstance.columns().search('').draw(false);
                                        dataTableInstance.column(5).search("^1$", true, false).draw();
                                        setActiveButton("btn-pendiente-revisar");
                                        return true;
                                    }

                                    // Buscar ID 2 (Solvente) en la columna de ID de Domiciliación (índice 5 - oculta)
                                    if (checkDataExists("^2$", 5)) {
                                        dataTableInstance.columns().search('').draw(false);
                                        dataTableInstance.column(5).search("^2$", true, false).draw();
                                        setActiveButton("btn-solvente");
                                        return true;
                                    }

                                    // Buscar ID 3 (Gestión Comercial) en la columna de ID de Domiciliación (índice 5 - oculta)
                                    if (checkDataExists("^3$", 5)) {
                                        dataTableInstance.columns().search('').draw(false);
                                        dataTableInstance.column(5).search("^3$", true, false).draw();
                                        setActiveButton("btn-gestion-comercial");
                                        return true;
                                    }

                                    return false;
                                }

                                // Ejecutar la búsqueda automática al inicializar
                                findFirstButtonWithData();

                                // Event listeners para los botones
                                $("#btn-solvente").on("click", function () {
                                    if (checkDataExists("^2$", 5)) {
                                        dataTableInstance.columns().search('').draw(false);
                                        dataTableInstance.column(5).search("^2$", true, false).draw();
                                        setActiveButton("btn-solvente");
                                    } else {
                                        findFirstButtonWithData();
                                    }
                                });

                                $("#btn-gestion-comercial").on("click", function () {
                                    if (checkDataExists("^3$", 5)) {
                                        dataTableInstance.columns().search('').draw(false);
                                        dataTableInstance.column(5).search("^3$", true, false).draw();
                                        setActiveButton("btn-gestion-comercial");
                                    } else {
                                        findFirstButtonWithData();
                                    }
                                });

                                $("#btn-pendiente-revisar").on("click", function () {
                                    if (checkDataExists("^1$", 5)) {
                                        dataTableInstance.columns().search('').draw(false);
                                        dataTableInstance.column(5).search("^1$", true, false).draw();
                                        setActiveButton("btn-pendiente-revisar");
                                    } else {
                                        findFirstButtonWithData();
                                    }
                                });
                            }
                        });

                        // ************* INICIO: LÓGICA PARA TRUNCAR/EXPANDIR TEXTO (Aplicada DESPUÉS de la inicialización de DataTables) *************
                        $("#tabla-ticket tbody")
                            .off("click", ".truncated-cell, .expanded-cell") // Usa .off() para evitar múltiples listeners
                            .on("click", ".truncated-cell, .expanded-cell", function (e) {
                                e.stopPropagation(); // Evita que el clic en la celda active el clic de la fila completa
                                const $cellSpan = $(this);
                                const fullText = $cellSpan.data("full-text"); // Obtiene el texto completo del atributo data-

                                if ($cellSpan.hasClass("truncated-cell")) {
                                    $cellSpan
                                        .removeClass("truncated-cell")
                                        .addClass("expanded-cell");
                                    $cellSpan.text(fullText);
                                } else {
                                    $cellSpan
                                        .removeClass("expanded-cell")
                                        .addClass("truncated-cell");
                                    // Asegúrate de que displayLengthForTruncate sea accesible o defínela aquí de nuevo
                                    const displayLength = 25; // La misma longitud de truncado usada en el render
                                    if (fullText.length > displayLength) {
                                        $cellSpan.text(
                                            fullText.substring(0, displayLength) + "..."
                                        );
                                    } else {
                                        $cellSpan.text(fullText); // Si el texto es corto, no debería tener "...", solo el texto completo
                                    }
                                }
                            });
                        // ************* FIN: LÓGICA PARA TRUNCAR/EXPANDIR TEXTO *************

                        $("#tabla-ticket tbody")
                            .off("click", "tr") // Mantener este .off() para el clic de la fila
                            .on("click", "tr", function () {
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
                                    detailsPanel.innerHTML = formatTicketDetailsPanel(
                                        selectedTicketDetails
                                    );
                                    loadTicketHistory(ticketId, currentTicketNroForImage);
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

    const datos = `action=getDomiciliacionTickets&id_user=${id_user_value}`;
    xhr.send(datos);
}

document.addEventListener('DOMContentLoaded', searchDomiciliacionTickets);

function downloadImageModal(serial) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPhotoDashboard`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        //console.log(response);
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
function loadTicketHistory(ticketId, currentTicketNroForImage) {
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
            timeText = `${diffWeeks}W ${remainingDays}D`;
        } else if (diffDays > 0) {
            const remainingHours = diffHours % 24;
            const remainingMinutes = diffMinutes % 60;
            timeText = `${diffDays}D ${remainingHours}H ${remainingMinutes}M`;
        } else if (diffHours > 0) {
            const remainingMinutes = diffMinutes % 60;
            timeText = `${diffHours}H ${remainingMinutes}M`;
        } else if (diffMinutes > 0) {
            timeText = `${diffMinutes}M`;
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
                    <div class="d-flex justify-content-end mb-2">
                        <button class="btn btn-secondary" onclick="printHistory('${ticketId}', '${encodeURIComponent(JSON.stringify(response.history))}', '${currentTicketNroForImage}')">
                            <i class="fas fa-print"></i> Imprimir Historial
                        </button>
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

                    if (prevItem.fecha_de_cambio && item.fecha_de_cambio) {
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

                            timeBadge = `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; cursor: pointer; background-color: ${backgroundColor} !important; color: white !important;" title="Click para ver agenda" onclick="showElapsedLegend(event)">${timeElapsed.text}</span>`;
                        }
                    }
                    
                    const cleanString = (str) => str && str.replace(/\s/g, ' ').trim() || null;
                    const getChange = (itemVal, prevVal) => (cleanString(itemVal) !== cleanString(prevVal));

                    const isCreation = cleanString(item.name_accion_ticket) === 'Ticket Creado';
                    const creationBadge = isCreation && item.fecha_de_cambio ? 
                        `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; cursor: help; background-color: #17a2b8 !important; color: white !important;" title="Fecha de creación">${item.fecha_de_cambio}</span>` : '';

                    const accionChanged = getChange(item.name_accion_ticket, prevItem.name_accion_ticket);
                    const coordChanged = getChange(item.full_name_coordinador, prevItem.full_name_coordinador);
                    const usuarioGestionChanged = getChange(item.usuario_gestion, prevItem.usuario_gestion);
                    const tecnicoChanged = getChange(item.full_name_tecnico_n2_history, prevItem.full_name_tecnico_n2_history);
                    const statusLabChanged = getChange(item.name_status_lab, prevItem.name_status_lab);
                    const statusDomChanged = getChange(item.name_status_domiciliacion, prevItem.name_status_domiciliacion);
                    const statusPaymentChanged = getChange(item.name_status_payment, prevItem.name_status_payment);
                    const estatusTicketChanged = getChange(item.name_status_ticket, prevItem.name_status_ticket);
                    const componentsChanged = getChange(item.components_list, prevItem.components_list);
                    const motivoRechazoChanged = getChange(item.name_motivo_rechazo, prevItem.name_motivo_rechazo);
                    const pagoChanged = getChange(item.pago, prevItem.pago);
                    const exoneracionChanged = getChange(item.exoneracion, prevItem.exoneracion);
                    const envioChanged = getChange(item.envio, prevItem.envio);
                    const envioDestinoChanged = getChange(item.envio_destino, prevItem.envio_destino);

                    const showComponents = cleanString(item.name_accion_ticket) === 'Actualización de Componentes' && cleanString(item.components_list);
                    const shouldHighlightComponents = showComponents && (accionChanged || componentsChanged);

                    const rejectedActions = ['Documento de Exoneracion Rechazado', 'Documento de Anticipo Rechazado'];
                    const showMotivoRechazo = rejectedActions.includes(cleanString(item.name_status_payment)) && cleanString(item.name_motivo_rechazo);

                    const showCommentDevolution = cleanString(item.name_accion_ticket) === 'En espera de Confirmar Devolución' && cleanString(item.comment_devolution) && cleanString(item.envio_destino) !== 'Sí';
                    const showCommentReasignation = cleanString(item.name_accion_ticket) === 'Reasignado al Técnico' && cleanString(item.comment_reasignation);

                    const headerStyle = isLatest ? "background-color: #ffc107;" : "background-color: #5d9cec;";
                    const textColor = isLatest ? "color: #343a40;" : "color: #ffffff;";

                    let statusHeaderText = cleanString(item.name_status_ticket) || "Desconocido";
                    if (cleanString(item.name_accion_ticket) === "Enviado a taller" || cleanString(item.name_accion_ticket) === "En Taller") {
                        statusHeaderText = cleanString(item.name_status_lab) || "Desconocido";
                    }

                    // Se define el texto del botón aquí con la condición ternaria
                    const buttonText = isCreation
                        ? `${cleanString(item.name_accion_ticket) || "N/A"} (${statusHeaderText})`
                        : `${item.fecha_de_cambio || "N/A"} - ${cleanString(item.name_accion_ticket) || "N/A"} (${statusHeaderText})`;

                    historyHtml += `
                        <div class="card mb-3 custom-history-card position-relative">
                            <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                ${creationBadge}
                                ${timeBadge}
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                        data-toggle="collapse" data-target="#${collapseId}"
                                        aria-expanded="false" aria-controls="${collapseId}"
                                        style="${textColor}">
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
                                                <tr>
                                                    <th class="text-start">Estatus Domiciliación:</th>
                                                    <td class="${statusDomChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_domiciliacion) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Pago:</th>
                                                    <td class="${statusPaymentChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_payment) || "N/A"}</td>
                                                </tr>
                                                ${showComponents ? `
                                                    <tr>
                                                        <th class="text-start">Componentes Asociados:</th>
                                                        <td class="${shouldHighlightComponents ? "highlighted-change" : ""}">${cleanString(item.components_list)}</td>
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

function printHistory(ticketId, historyEncoded, currentTicketNroForImage) {
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
            text = `${diffWeeks}W ${diffDays % 7}D`;
        } else if (diffDays > 0) {
            text = `${diffDays}D ${diffHours % 24}H ${diffMinutes % 60}M`;
        } else if (diffHours > 0) {
            text = `${diffHours}H ${diffMinutes % 60}M`;
        } else if (diffMinutes > 0) {
            // Mostrar minutos cuando es al menos 1 minuto
            text = `${diffMinutes}M`;
        } else {
            // Si es menos de 1 minuto, mostrar N/A según requerimiento de impresión
            text = `N/A`;
        }
        return { text, ms: diffMs, minutes: diffMinutes, hours: diffHours, days: diffDays, weeks: diffWeeks, months: diffMonths };
    };

    const history = decodeHistorySafe(historyEncoded);

    let itemsHtml = '';
    history.forEach((item, index) => {
        const previous = history[index + 1] || null;
        const elapsed = previous ? calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio) : null;
        const elapsedText = elapsed ? elapsed.text : 'N/A';

        itemsHtml += `
            <div style="border: 1px solid #ddd; border-radius: 6px; margin: 10px 0; padding: 12px;">
                <div style="font-weight: bold; color: #003594; margin-bottom: 6px;">${cleanString(item.fecha_de_cambio) || 'N/A'} - ${cleanString(item.name_accion_ticket) || 'N/A'} (${cleanString(item.name_status_ticket) || 'N/A'})</div>
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
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Domiciliación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_domiciliacion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Pago</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_payment) || 'N/A'}</td></tr>
                        ${cleanString(item.components_list) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Componentes</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.components_list)}</td></tr>` : ''}
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
        `;
    });

    const printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="text-align:center;">
                <h2 style="color: #003594; margin-bottom: 6px;">Historial del Ticket</h2>
                <p style="margin: 0 0 8px 0;"><strong>Ticket Nro:</strong> ${currentTicketNroForImage}</p>
                <p style="margin: 0 0 14px 0; color: #555;">Fecha de Impresión: ${new Date().toLocaleString()}</p>
                <p style="margin: 0 0 14px 0; color: #6c757d; font-size: 12px;">Nota: En la columna "Tiempo desde gestión anterior" con un valor "N/A" indica que la gestión se realizó en menos de 1 minuto.</p>
            </div>
            ${itemsHtml || '<p style="text-align:center; color:#666;">Sin historial disponible.</p>'}
        </div>
    `;

    const printWindow = window.open('', '', 'height=800,width=1024');
    printWindow.document.write('<html><head><title>Historial del Ticket</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000; }');
    printWindow.document.write('h2 { color: #003594; }');
    printWindow.document.write('@media print { body { -webkit-print-color-adjust: exact; } }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
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
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#ffc107; color:#212529; min-width:64px;">Amarillo</span><span class="ml-2">Una semana o más, o más de 2 días hábiles</span></div>
            <div class="d-flex align-items-center"><span class="badge" style="background-color:#dc3545; color:#fff; min-width:64px;">Rojo</span><span class="ml-2">Un mes o más, o más de 5 días hábiles</span></div>
        </div>`;

    Swal.fire({
        title: 'Agenda de colores',
        html: legendHtml,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#003594',
        color: 'black',
        width: 520,
    });
}

$(document).ready(function () {
    const changeStatusDomiciliacionModalElement = document.getElementById("changeStatusDomiciliacionModal");

    if (changeStatusDomiciliacionModalElement) {
        const changeStatusDomiciliacionModal = new bootstrap.Modal(changeStatusDomiciliacionModalElement);

        const modalTicketIdDomiciliacion = changeStatusDomiciliacionModalElement.querySelector("#modalTicketIdDomiciliacion");
        const modalCurrentStatusDomiciliacion = changeStatusDomiciliacionModalElement.querySelector("#modalCurrentStatusDomiciliacion");
        const modalNewStatusDomiciliacionSelect = changeStatusDomiciliacionModalElement.querySelector("#modalNewStatusDomiciliacionSelect");
        const saveStatusDomiciliacionChangeBtn = changeStatusDomiciliacionModalElement.querySelector("#saveStatusDomiciliacionChangeBtn");
        const errorMessageDomiciliacion = changeStatusDomiciliacionModalElement.querySelector("#errorMessageDomiciliacion");

        $(document).on('click', '.cambiar-estatus-domiciliacion-btn', function () {
            const idTicket = $(this).data('id');
            const currentStatusName = $(this).data('current-status-name');
            const currentStatusId = $(this).data('current-status-id');

            document.getElementById('idTicket').value = idTicket;
            const getIdTicket = document.getElementById('idTicket').value;

            if (modalTicketIdDomiciliacion) modalTicketIdDomiciliacion.value = getIdTicket;
            if (modalCurrentStatusDomiciliacion) modalCurrentStatusDomiciliacion.value = currentStatusName;

            // Limpiar cualquier mensaje de error previo
            if (errorMessageDomiciliacion) {
                errorMessageDomiciliacion.style.display = 'none';
                errorMessageDomiciliacion.innerHTML = '';
            }

            // *** LLAMADA CLAVE: Cargar los estatus excluyendo el actual ***
            // Pasa el nombre del estado actual para que no se muestre en el select.
            getStatusDom(currentStatusName);

            // ABRIR EL MODAL EXPLICITAMENTE
            changeStatusDomiciliacionModal.show();
        });

        if (saveStatusDomiciliacionChangeBtn) {
            saveStatusDomiciliacionChangeBtn.addEventListener('click', function () {
                const idTicket = document.getElementById('idTicket').value;
                const newStatusId = modalNewStatusDomiciliacionSelect.value;
                const id_user_input = document.getElementById('iduser');
                let id_user = '';
                if (id_user_input) {
                    id_user = id_user_input.value;
                } else {
                    console.warn("Elemento con ID 'idTicket' (para el ID de usuario) no encontrado.");
                }

                if (!newStatusId || newStatusId === "" || newStatusId === "0") {
                    if (errorMessageDomiciliacion) {
                        errorMessageDomiciliacion.textContent = 'Por favor, selecciona un "Nuevo Estatus".';
                        errorMessageDomiciliacion.style.display = 'block';
                        errorMessageDomiciliacion.style.color = 'white';
                    }
                    return;
                }

                // *** OBTENER OBSERVACIONES SI EL ESTATUS ES 3 ***
                let observations = '';
                if (newStatusId === '3') {
                    const observationsText = document.getElementById('observationsText');
                    if (observationsText) {
                        observations = observationsText.value.trim();
                        if (!observations) {
                            if (errorMessageDomiciliacion) {
                                errorMessageDomiciliacion.textContent = 'Por favor, ingrese las observaciones para este estatus.';
                                errorMessageDomiciliacion.style.display = 'block';
                                errorMessageDomiciliacion.style.color = 'white';
                            }
                            return;
                        }
                    }
                }

                updateDomiciliacionStatus(idTicket, newStatusId, id_user, changeStatusDomiciliacionModal, observations);
            });
        }

        changeStatusDomiciliacionModalElement.addEventListener('hidden.bs.modal', function () {
            if (modalTicketIdDomiciliacion) modalTicketIdDomiciliacion.value = '';
            if (modalCurrentStatusDomiciliacion) modalCurrentStatusDomiciliacion.value = '';
            if (modalNewStatusDomiciliacionSelect) modalNewStatusDomiciliacionSelect.value = '';
            if (errorMessageDomiciliacion) {
                errorMessageDomiciliacion.style.display = 'none';
                errorMessageDomiciliacion.innerHTML = '';
            }
            // *** LIMPIAR CAMPO DE OBSERVACIONES ***
            const observationsContainer = document.getElementById('observationsContainer');
            if (observationsContainer) {
                observationsContainer.style.display = 'none';
                const observationsText = document.getElementById('observationsText');
                if (observationsText) {
                    observationsText.value = '';
                }
            }
        });

        const closeIconBtn = changeStatusDomiciliacionModalElement.querySelector("#Close-icon");
        const closeButton = changeStatusDomiciliacionModalElement.querySelector("#close-button");

        if (closeIconBtn) {
            closeIconBtn.addEventListener('click', function () {
                // *** OCULTAR CAMPO DE OBSERVACIONES ***
                const observationsContainer = document.getElementById('observationsContainer');
                if (observationsContainer) {
                    observationsContainer.style.display = 'none';
                    const observationsText = document.getElementById('observationsText');
                    if (observationsText) {
                        observationsText.value = '';
                    }
                }
                changeStatusDomiciliacionModal.hide();
            });
        }


        if (closeButton) {
            closeButton.addEventListener('click', function () {
                // *** OCULTAR CAMPO DE OBSERVACIONES ***
                const observationsContainer = document.getElementById('observationsContainer');
                if (observationsContainer) {
                    observationsContainer.style.display = 'none';
                    const observationsText = document.getElementById('observationsText');
                    if (observationsText) {
                        observationsText.value = '';
                    }
                }
                changeStatusDomiciliacionModal.hide();
            });
        }
        
    }
});

// Función para enviar la actualización del estatus de domiciliación al backend
function updateDomiciliacionStatus(idTicket, newStatusId, id_user, changeStatusDomiciliacionModal, observations = '') {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/updateDomiciliacionStatus`); // Nueva ruta de API para actualizar
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    const changeStatusDomiciliacionModalElement = document.getElementById("changeStatusDomiciliacionModal");
    const errorMessageDomiciliacion = changeStatusDomiciliacionModalElement.querySelector("#errorMessageDomiciliacion");

    xhr.onload = function () {
        if (errorMessageDomiciliacion) {
            errorMessageDomiciliacion.style.display = 'none';
            errorMessageDomiciliacion.innerHTML = '';
        }

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Si la respuesta es exitosa, muestra el SweetAlert de éxito
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "Estatus del ticket actualizado correctamente.",
                        icon: "success",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#003594",
                        color: "black",
                        // willClose ya no tiene location.reload() si quieres un flujo más suave
                        // Si QUERES recargar la página, manten el location.reload() y elimina lo de abajo.
                        willClose: () => {
                            location.reload();
                        },
                    });
                    const changeStatusDomiciliacionModalInstance = new bootstrap.Modal(changeStatusDomiciliacionModalElement);

                    changeStatusDomiciliacionModalInstance.hide();
                    searchDomiciliacionTickets();
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

    xhr.onerror = function () {
        if (errorMessageDomiciliacion) {
            errorMessageDomiciliacion.textContent = 'Error de red al intentar actualizar el estatus.';
            errorMessageDomiciliacion.style.display = 'block';
        }
        console.error('Error de red al actualizar estatus.');
    };

    // *** CONSTRUIR DATOS CON OBSERVACIONES SI ES NECESARIO ***
    let datos = `action=updateDomiciliacionStatus&id_ticket=${idTicket}&new_status_id=${newStatusId}&id_user=${id_user}`;
    
    if (observations && observations.trim() !== '') {
        datos += `&observations=${encodeURIComponent(observations)}`;
    }
    
    xhr.send(datos);
}

function getStatusDom(currentStatusNameToExclude = null) {
    // Acepta un parámetro opcional
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetStatusDomiciliacion`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById("modalNewStatusDomiciliacionSelect");

                    select.innerHTML = '<option value="" disabled selected hidden>Seleccione</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.estatus) && response.estatus.length > 0) {
                        response.estatus.forEach((status) => {
                            // *** AQUÍ ESTÁ LA LÓGICA CLAVE: FILTRAR LA OPCIÓN ACTUAL ***
                            if (status.name_status_domiciliacion !== currentStatusNameToExclude) {
                                const option = document.createElement("option");
                                option.value = status.id_status_domiciliacion;
                                option.textContent = status.name_status_domiciliacion;
                                select.appendChild(option);
                            }
                        });
                    } else {
                        const option = document.createElement("option");
                        option.value = "";
                        option.textContent = "No hay status Disponibles";
                        select.appendChild(option);
                    }

                    // *** AGREGAR EVENT LISTENER PARA MOSTRAR CAMPO DE OBSERVACIONES Y MODAL DE DOCUMENTO ***
                    select.addEventListener('change', function() {
                        const selectedValue = this.value;
                        const observationsContainer = document.getElementById('observationsContainer');
                        
                        // Quitar el mensaje de error cuando se seleccione un estatus
                        const errorMessageDomiciliacion = document.getElementById('errorMessageDomiciliacion');
                        if (errorMessageDomiciliacion) {
                            errorMessageDomiciliacion.style.display = 'none';
                            errorMessageDomiciliacion.innerHTML = '';
                        }
                        
                        // Cambiar el color del texto a blanco cuando se seleccione una opción válida
                        if (selectedValue && selectedValue !== '') {
                            this.style.color = 'white';
                        } else {
                            this.style.color = '#6c757d'; // Color gris para la opción por defecto
                        }
                        
                        if (selectedValue === '3') {
                            // Mostrar campo de observaciones
                            if (!observationsContainer) {
                                const form = document.getElementById('changeStatusDomiciliacionForm');
                                const observationsDiv = document.createElement('div');
                                observationsDiv.id = 'observationsContainer';
                                observationsDiv.className = 'mb-3';
                                observationsDiv.innerHTML = `
                                    <label for="observationsText" class="form-label">Observaciones:</label>
                                    <textarea class="form-control" id="observationsText" rows="3" placeholder="Ingrese sus observaciones aquí..."></textarea>
                                `;
                                form.appendChild(observationsDiv);
                            } else {
                                observationsContainer.style.display = 'block';
                            }
                        } else if (selectedValue === '4') {
                            // Mostrar modal para subir documento de convenio firmado
                            const idTicket = document.getElementById('idTicket').value;
                            const modalTicketId = document.getElementById('modalTicketId');
                            const idTicketHidden = document.getElementById('id_ticket');
                            
                            if (modalTicketId) modalTicketId.textContent = idTicket;
                            if (idTicketHidden) idTicketHidden.value = idTicket;
                            
                            // Cerrar el modal actual
                            const changeStatusDomiciliacionModalElement = document.getElementById("changeStatusDomiciliacionModal");
                            const changeStatusDomiciliacionModal = new bootstrap.Modal(changeStatusDomiciliacionModalElement);
                            changeStatusDomiciliacionModal.hide();
                            
                            // Abrir el modal de subida de documento
                            const uploadDocumentModalElement = document.getElementById("uploadDocumentModal");
                            const uploadDocumentModal = new bootstrap.Modal(uploadDocumentModalElement);
                            
                            // *** EVENT LISTENER PARA EL BOTÓN CERRAR DEL MODAL DE DOCUMENTO ***
                            const cerrarBotonDocumento = document.getElementById("CerrarBoton");
                            
                            if (cerrarBotonDocumento) {
                                cerrarBotonDocumento.addEventListener('click', function() {
                                    // 1. Oculta el modal de visualización actual
                                    uploadDocumentModal.hide();
                                    
                                    // 2. Resetea el select al estado inicial
                                    const modalNewStatusDomiciliacionSelect = document.getElementById('modalNewStatusDomiciliacionSelect');
                                    if (modalNewStatusDomiciliacionSelect) {
                                        modalNewStatusDomiciliacionSelect.value = '';
                                        modalNewStatusDomiciliacionSelect.selectedIndex = 0; // Seleccionar la opción "Seleccione"
                                        modalNewStatusDomiciliacionSelect.style.color = '#6c757d'; // Restaurar color gris
                                    }
                                    
                                    // 3. Ocultar el textarea de observaciones si está visible
                                    const observationsContainer = document.getElementById('observationsContainer');
                                    if (observationsContainer) {
                                        observationsContainer.style.display = 'none';
                                        const observationsText = document.getElementById('observationsText');
                                        if (observationsText) {
                                            observationsText.value = '';
                                        }
                                    }
                                    
                                    // 4. Muestra el modal de cambio de estatus de nuevo
                                    // Usamos un pequeño retraso para evitar problemas de superposición y animaciones
                                    setTimeout(() => {
                                        const changeStatusDomiciliacionModalElement = document.getElementById("changeStatusDomiciliacionModal");
                                        const changeStatusDomiciliacionModal = new bootstrap.Modal(changeStatusDomiciliacionModalElement);
                                        changeStatusDomiciliacionModal.show();
                                    }, 300);
                                });
                            }
                            
                            uploadDocumentModal.show();
                        } else if (selectedValue === '5') {
                            // Mostrar modal de confirmación para "Deudor - Desafiliado con Deuda"
                            Swal.fire({
                                title: '⚠️ CONFIRMACIÓN REQUERIDA ⚠️',
                                html: `
                                    <div style="text-align: center; padding: 20px;">
                                        <div style="font-size: 48px; color: #dc3545; margin-bottom: 20px;">🚨🚨🚨</div>
                                        <h4 style="color: #dc3545; font-weight: bold; margin-bottom: 20px;">
                                            ¿Seguro que desea colocar este estatus?
                                        </h4>
                                        <div style="background: linear-gradient(135deg, #fff3cd, #ffeaa7); padding: 20px; border-radius: 10px; border-left: 5px solid #ffc107; margin: 20px 0;">
                                            <p style="color: #856404; font-size: 16px; margin: 0; font-weight: 500;">
                                                <strong>⚠️ ADVERTENCIA:</strong> Esto ocasionará el <strong>CIERRE DEL TICKET</strong> y se le enviará un correo a los departamentos correspondientes.
                                            </p>
                                        </div>
                                        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 15px;">
                                            <p style="color: black; margin: 0; font-size: 14px;">
                                                <strong>Estatus:</strong> Deudor - Desafiliado con Deuda
                                            </p>
                                        </div>
                                    </div>
                                `,
                                showCancelButton: true,
                                confirmButtonText: 'CONFIRMAR',
                                cancelButtonText: 'CANCELAR',
                                confirmButtonColor: 'GREEN',
                                cancelButtonColor: '#6c757d',
                                reverseButtons: true,
                                focusCancel: true,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                keydownListenerCapture: true,
                                customClass: {
                                    popup: 'swal-wide',
                                    title: 'swal-title-danger',
                                    confirmButton: 'swal-confirm-danger',
                                    cancelButton: 'swal-cancel-safe'
                                },
                                width: '500px',
                                padding: '20px'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // Si confirma, proceder con el cambio de estatus
                                    // Aquí puedes agregar la lógica para procesar el cambio
                                    console.log('Usuario confirmó el cambio a estatus 5');
                                    
                                    // Mostrar mensaje de confirmación
                                    Swal.fire({
                                        title: '✅ ESTATUS ACTUALIZADO',
                                        text: 'El ticket ha sido cerrado y se han enviado las notificaciones correspondientes.',
                                        icon: 'success',
                                        confirmButtonColor: '#003594',
                                        color: 'black'
                                    });
                                } else {
                                    // Si cancela, resetear el select
                                    const modalNewStatusDomiciliacionSelect = document.getElementById('modalNewStatusDomiciliacionSelect');
                                    if (modalNewStatusDomiciliacionSelect) {
                                        modalNewStatusDomiciliacionSelect.value = '';
                                        modalNewStatusDomiciliacionSelect.selectedIndex = 0;
                                        modalNewStatusDomiciliacionSelect.style.color = '#6c757d';
                                    }
                                    
                                    // Ocultar campo de observaciones si está visible
                                    if (observationsContainer) {
                                        observationsContainer.style.display = 'none';
                                        const observationsText = document.getElementById('observationsText');
                                        if (observationsText) {
                                            observationsText.value = '';
                                        }
                                    }
                                }
                            });
                        } else {
                            // Ocultar campo de observaciones
                            if (observationsContainer) {
                                observationsContainer.style.display = 'none';
                                document.getElementById('observationsText').value = '';
                            }
                        }
                    });
                } else {
                    document.getElementById("rifMensaje").innerHTML +=
                        "<br>Error al obtener los status.";
                    console.error("Error al obtener los status:", response.message);
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                document.getElementById("rifMensaje").innerHTML +=
                    "<br>Error al procesar la respuesta de los status.";
            }
        } else {
            console.error("Error:", xhr.status, xhr.statusText);
            document.getElementById("rifMensaje").innerHTML +=
                "<br>Error de conexión con el servidor para los status.";
        }
    };

    const datos = `action=GetStatusDomiciliacion`; // Asegúrate de que esta acción en el backend devuelva los técnicos filtrados
    xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", function() {
    getStatusDom();
    
    // *** FUNCIONALIDAD DEL MODAL DE SUBIDA DE DOCUMENTO ***
    const uploadDocumentModalElement = document.getElementById("uploadDocumentModal");
    let uploadDocumentModal = null;
    
    if (uploadDocumentModalElement) {
        uploadDocumentModal = new bootstrap.Modal(uploadDocumentModalElement);
        
        // Event listener para el botón de subir archivo
        const uploadFileBtn = document.getElementById('uploadFileBtn');
        if (uploadFileBtn) {
            uploadFileBtn.addEventListener('click', function() {
                const documentFile = document.getElementById('documentFile');
                const idTicket = document.getElementById('id_ticket').value;
                const idUser = document.getElementById('iduser').value;
                
                if (!documentFile.files[0]) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Archivo requerido',
                        text: 'Por favor, seleccione un archivo para subir.',
                        confirmButtonColor: '#003594',
                        color: 'black'
                    });
                    return;
                }
                
                // Aquí puedes agregar la lógica para subir el archivo
                console.log('Subiendo archivo para ticket:', idTicket);
                console.log('Archivo seleccionado:', documentFile.files[0]);
                
                // Mostrar mensaje de éxito temporal
                Swal.fire({
                    title: "¡Archivo subido!",
                    text: "El documento de convenio firmado ha sido subido correctamente.",
                    icon: "success",
                    confirmButtonText: "Ok",
                    confirmButtonColor: "#003594",
                    color: "black",
                    willClose: () => {
                        // *** RESETEAR EL SELECT AL ESTADO INICIAL ***
                        const modalNewStatusDomiciliacionSelect = document.getElementById('modalNewStatusDomiciliacionSelect');
                        if (modalNewStatusDomiciliacionSelect) {
                            modalNewStatusDomiciliacionSelect.value = '';
                            modalNewStatusDomiciliacionSelect.selectedIndex = 0;
                        }
                        
                        uploadDocumentModal.hide();
                        // Recargar la página para actualizar los datos
                        location.reload();
                    },
                });
            });
        }
        
        // Event listener para el botón de generar convenio firmado
        const generateNotaEntregaBtn = document.getElementById('generateNotaEntregaBtn');
        if (generateNotaEntregaBtn) {
            generateNotaEntregaBtn.addEventListener('click', function() {
                const idTicket = document.getElementById('idTicket').value;

                console.log(idTicket);
                
                if (!idTicket) {
                    Swal.fire({ 
                        icon: 'warning', 
                        title: 'Ticket no disponible',
                        text: 'No se encontró el ID del ticket para generar el acuerdo de pago.'
                    });
                    return;
                }

                // Obtener datos del ticket para el acuerdo de pago
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/documents/GetPaymentAgreementData`);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== 4) return;

                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const res = JSON.parse(xhr.responseText);
                            if (!res || !res.success || !res.rows) {
                                Swal.fire({ 
                                    icon: 'warning', 
                                    title: 'No se encontraron datos',
                                    text: 'No se pudieron obtener los datos del ticket para generar el acuerdo de pago.'
                                });
                                return;
                            }

                            const d = res.rows[0];
                            window.currentPaymentAgreementData = d;
                            
                            // Llenar el modal con los datos del ticket
                            fillPaymentAgreementModal(d);
                            
                            // Cerrar el modal actual y abrir el modal de acuerdo de pago
                            uploadDocumentModal.hide();
                            
                            setTimeout(() => {
                                // Usar la instancia global o crear una nueva si no existe
                                if (!paymentAgreementModalInstance) {
                                    paymentAgreementModalInstance = new bootstrap.Modal(document.getElementById('paymentAgreementModal'));
                                }
                                paymentAgreementModalInstance.show();
                            }, 300);
                            
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                            Swal.fire({ 
                                icon: 'error', 
                                title: 'Error al procesar datos',
                                text: 'Hubo un error al procesar los datos del ticket.'
                            });
                        }
                    } else {
                        Swal.fire({ 
                            icon: 'error', 
                            title: 'Error del servidor',
                            text: `Error ${xhr.status}: ${xhr.statusText}`
                        });
                    }
                };

                xhr.onerror = function () {
                    Swal.fire({ 
                        icon: 'error', 
                        title: 'Error de conexión',
                        text: 'No se pudo conectar al servidor para obtener los datos del ticket.'
                    });
                };

                const data = `action=GetPaymentAgreementData&id_ticket=${idTicket}`;
                xhr.send(data);
            });
        }
        
        // Event listener para previsualización de imagen
        const documentFile = document.getElementById('documentFile');
        const imagePreview = document.getElementById('imagePreview');
        
        if (documentFile && imagePreview) {
            documentFile.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    imagePreview.style.display = 'none';
                }
            });
        }
        
        
        
        // Limpiar el formulario cuando se cierre el modal
        uploadDocumentModalElement.addEventListener('hidden.bs.modal', function() {
            const uploadForm = document.getElementById('uploadForm');
            if (uploadForm) {
                uploadForm.reset();
            }
            if (imagePreview) {
                imagePreview.style.display = 'none';
                imagePreview.src = '#';
            }
        });
    } 
});

// Función para llenar el modal de acuerdo de pago con los datos del ticket
function fillPaymentAgreementModal(d) {
    // Verificar que d existe
    if (!d) {
        console.error('No data provided to fillPaymentAgreementModal');
        return;
    }
    
    const safe = (s) => (s || '').toString();
    const formatDate = (dateStr) => {
        if (!dateStr) return new Date().toLocaleDateString('es-ES');
        try {
            return new Date(dateStr).toLocaleDateString('es-ES');
        } catch (e) {
            return dateStr;
        }
    };
    
    // Llenar campos del modal
    document.getElementById('pa_ticket_id').value = safe(d.id_ticket);
    document.getElementById('pa_fecha').value = formatDate(d.fecha_actual);
    document.getElementById('pa_numero_ticket').value = safe(d.nro_ticket);
    document.getElementById('pa_rif').value = safe(d.coddocumento);
    document.getElementById('pa_razon_social').value = safe(d.razonsocial);
    document.getElementById('pa_ejecutivo_venta').value = safe(d.ejecutivo) || '';
    document.getElementById('pa_marca_equipo').value = safe(d.desc_modelo) || safe(d.tipo_pos) || '';
    document.getElementById('pa_fecha_instalacion').value = safe(d.fechainstalacion) || '';
    document.getElementById('pa_serial').value = safe(d.serialpos);
    document.getElementById('pa_status_pos').value = safe(d.desc_estatus) || '';
    
    // Limpiar campos editables
    document.getElementById('pa_saldo_deudor').value = '';
    document.getElementById('pa_propuesta').value = '';
    document.getElementById('pa_observaciones').value = '';
    document.getElementById('pa_acuerdo').value = '';
    
    // Limpiar campos de configuración bancaria (opcional - mantener valores por defecto)
    // document.getElementById('pa_numero_cuenta').value = 'XXXX-XXXX-XX-XXXX';
    // document.getElementById('pa_nombre_empresa').value = 'Informática y Telecomunicaciones Integradas Inteligen, SA';
    // document.getElementById('pa_rif_empresa').value = 'J-00291615-0';
    // document.getElementById('pa_banco').value = 'XXXX';
    // document.getElementById('pa_correo').value = 'domiciliación.intelipunto@inteligensa.com';
}

// Event listeners para el modal de acuerdo de pago
document.addEventListener('DOMContentLoaded', function() {
    // Función para forzar saltos de línea cada cierto número de caracteres
    function addLineBreaks(text, maxCharsPerLine = 25) {
        if (!text) return text;
        
        // Remover saltos de línea existentes para procesar todo el texto
        const cleanText = text.replace(/\n/g, ' ');
        
        let result = '';
        let currentLine = '';
        
        for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText[i];
            
            if (currentLine.length >= maxCharsPerLine) {
                result += currentLine + '\n';
                currentLine = char;
            } else {
                currentLine += char;
            }
        }
        
        if (currentLine) {
            result += currentLine;
        }
        
        return result;
    }

    // Aplicar saltos de línea automáticos a los campos de texto
    function setupAutoLineBreaks() {
        const textFields = ['pa_propuesta', 'pa_observaciones', 'pa_acuerdo'];
        
        textFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                // Aplicar estilos adicionales
                field.style.wordBreak = 'break-all';
                field.style.overflowWrap = 'break-word';
                field.style.whiteSpace = 'pre-wrap';
                
                field.addEventListener('input', function(e) {
                    const originalValue = e.target.value;
                    const withLineBreaks = addLineBreaks(originalValue, 25);
                    
                    if (originalValue !== withLineBreaks) {
                        const cursorPosition = e.target.selectionStart;
                        e.target.value = withLineBreaks;
                        // Ajustar posición del cursor
                        const newPosition = Math.min(cursorPosition, withLineBreaks.length);
                        e.target.setSelectionRange(newPosition, newPosition);
                    }
                });
                
                field.addEventListener('blur', function(e) {
                    const originalValue = e.target.value;
                    const withLineBreaks = addLineBreaks(originalValue, 25);
                    if (originalValue !== withLineBreaks) {
                        e.target.value = withLineBreaks;
                    }
                });
                
                field.addEventListener('paste', function(e) {
                    setTimeout(() => {
                        const originalValue = e.target.value;
                        const withLineBreaks = addLineBreaks(originalValue, 25);
                        if (originalValue !== withLineBreaks) {
                            e.target.value = withLineBreaks;
                        }
                    }, 10);
                });
            }
        });
    }

    // Formatear campo de saldo deudor mientras se escribe
    const saldoDeudorField = document.getElementById('pa_saldo_deudor');
    if (saldoDeudorField) {
        // Formatear al perder el foco
        saldoDeudorField.addEventListener('blur', function(e) {
            let value = e.target.value;
            if (value && !isNaN(parseFloat(value))) {
                const numValue = parseFloat(value);
                e.target.value = numValue.toFixed(2);
            }
        });
        
        // Formatear al escribir para mostrar el $ después
        saldoDeudorField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9.]/g, ''); // Solo números y punto
            
            // Permitir solo un punto decimal
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            
            // Limitar a 2 decimales
            if (parts[1] && parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].substring(0, 2);
            }
            
            e.target.value = value;
        });
    }
    
    // Configurar saltos de línea automáticos
    setupAutoLineBreaks();
    
    // Aplicar estilos cuando se abra el modal
    const modal = document.getElementById('paymentAgreementModal');
    if (modal) {
        modal.addEventListener('shown.bs.modal', function() {
            // Re-aplicar configuración cuando se abra el modal
            setTimeout(() => {
                setupAutoLineBreaks();
                
                // Asegurar que el scroll funcione correctamente
                const modalBody = modal.querySelector('.modal-body');
                if (modalBody) {
                    modalBody.style.overflowY = 'auto';
                    modalBody.style.overflowX = 'hidden';
                    modalBody.style.maxHeight = 'calc(95vh - 120px)';
                    
                    // Forzar el scroll si es necesario
                    modalBody.scrollTop = 0;
                }
            }, 100);
        });
        
        // Prevenir que el modal se cierre al hacer scroll
        modal.addEventListener('wheel', function(e) {
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody && modalBody.scrollHeight > modalBody.clientHeight) {
                e.stopPropagation();
            }
        });
    }
    
    // Botón de previsualizar
    const previewBtn = document.getElementById('previewPaymentAgreementBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            // Validar monto mínimo
            const saldoDeudor = document.getElementById('pa_saldo_deudor').value;
            if (saldoDeudor && parseFloat(saldoDeudor.replace(/[^0-9.-]/g, '')) < 10) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Monto inválido',
                    text: 'El saldo deudor debe ser mínimo $10.00',
                    confirmButtonColor: '#003594'
                });
                return;
            }
            
            const data = getPaymentAgreementFormData();
            const html = buildPaymentAgreementHtml(data);
            const preview = document.getElementById('paymentAgreementPreview');
            preview.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
        });
    }
    
// Botón de imprimir
const printBtn = document.getElementById('printPaymentAgreementBtn');

if (printBtn) {
    // 1. Añadir el Listener de Clic al botón principal
    printBtn.addEventListener('click', function() {
        // Validar monto mínimo
        const saldoDeudor = document.getElementById('pa_saldo_deudor').value;
        if (saldoDeudor && parseFloat(saldoDeudor.replace(/[^0-9.-]/g, '')) < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Monto inválido',
                text: 'El saldo deudor debe ser mínimo $10.00',
                confirmButtonColor: '#003594'
            });
            return;
        }
        
        // Asume que la lógica para generar el Acuerdo se ejecuta aquí o ya se ejecutó
        const data = getPaymentAgreementFormData();
        const html = buildPaymentAgreementHtml(data);

        // 2. Mostrar la alerta de éxito
        Swal.fire({
            title: "¡Acuerdo de Pago generado!",
            text: "El acuerdo de pago ha sido generado correctamente y está listo para imprimir.",
            icon: "success",
            confirmButtonText: "Imprimir",
            confirmButtonColor: "#003594",
            cancelButtonText: "Cerrar",
            cancelButtonColor: "#6c757d",
            color: "black",
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: true
        }).then((result) => {
            // 3. Ejecutar la lógica de impresión SÓLO si el usuario presiona el botón de Confirmación ('Imprimir')
            if (result.isConfirmed) {
                // Crear una nueva ventana para imprimir
                const printWindow = window.open('', '_blank', 'width=800,height=600');
                
                if (printWindow) {
                    printWindow.document.open();
                    printWindow.document.write(html);
                    printWindow.document.close();
                    
                    // Esperar a que se cargue el contenido y luego imprimir
                    printWindow.onload = function() {
                        printWindow.focus();
                        printWindow.print();
                        // printWindow.close(); // Opcional: algunos navegadores bloquean el close() inmediato
                    };
                } else {
                    // Manejo si el navegador bloquea la nueva ventana (pop-up)
                    console.error("El navegador bloqueó la ventana de impresión.");
                    Swal.fire('Error', 'El navegador bloqueó la ventana de impresión. Por favor, permita pop-ups.', 'error');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // El usuario hizo clic en "Cerrar"
                console.log("Modal cerrado por el usuario");
            }
        });
    });
}
    
    // Botón de cerrar
    const closeBtn = document.getElementById('closePaymentAgreementBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            // Usar la instancia global o crear una nueva si no existe
            if (!paymentAgreementModalInstance) {
                paymentAgreementModalInstance = new bootstrap.Modal(document.getElementById('paymentAgreementModal'));
            }
            paymentAgreementModalInstance.hide();
        });
    }
});

// Función para obtener los datos del formulario del modal
function getPaymentAgreementFormData() {
    return {
        id_ticket: document.getElementById('pa_ticket_id').value,
        fecha_actual: document.getElementById('pa_fecha').value,
        nro_ticket: document.getElementById('pa_numero_ticket').value,
        coddocumento: document.getElementById('pa_rif').value,
        razonsocial: document.getElementById('pa_razon_social').value,
        ejecutivo: document.getElementById('pa_ejecutivo_venta').value,
        desc_modelo: document.getElementById('pa_marca_equipo').value,
        fecha_instalacion: document.getElementById('pa_fecha_instalacion').value,
        serialpos: document.getElementById('pa_serial').value,
        desc_estatus: document.getElementById('pa_status_pos').value,
        saldo_deudor: document.getElementById('pa_saldo_deudor').value,
        propuesta: document.getElementById('pa_propuesta').value,
        observaciones: document.getElementById('pa_observaciones').value,
        acuerdo: document.getElementById('pa_acuerdo').value,
        // Nuevos campos de configuración bancaria
        numero_cuenta: document.getElementById('pa_numero_cuenta').value,
        nombre_empresa: document.getElementById('pa_nombre_empresa').value,
        rif_empresa: document.getElementById('pa_rif_empresa').value,
        banco: document.getElementById('pa_banco').value,
        correo: document.getElementById('pa_correo').value
    };
}

// Función para construir el HTML del Acuerdo de Pago
function buildPaymentAgreementHtml(d) {
    const safe = (s) => (s || '').toString();
    const formatDate = (dateStr) => {
        if (!dateStr) return new Date().toLocaleDateString('es-ES');
        try {
            return new Date(dateStr).toLocaleDateString('es-ES');
        } catch (e) {
            return dateStr;
        }
    };
    
    // Función para formatear moneda
    const formatCurrency = (amount) => {
        if (!amount || amount === '') return '____.__$';
        const numericAmount = parseFloat(amount.replace(/[^0-9.-]/g, ''));
        if (isNaN(numericAmount)) return '____.__$';
        return `${numericAmount.toFixed(2)}$`;
    };
    
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acuerdo de Pago - Inteligensa</title>
        <style>
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
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            min-height: calc(100vh - 40px);
            display: flex;
            flex-direction: column;
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
        
        .document-subtitle {
            font-size: 11px;
            color: #666;
            font-weight: 500;
        }
        
        .document-info {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 3px solid #2c5aa0;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
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
        
        .section {
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
        
        .field-row {
            display: flex;
            margin-bottom: 4px;
            align-items: flex-start;
        }
        
        .field-row:last-child {
            margin-bottom: 0;
        }
        
        .field-label {
            font-weight: 600;
            color: #555;
            min-width: 110px;
            margin-right: 8px;
            font-size: 10px;
            padding-top: 2px;
        }
        
        .field-value {
            flex: 1;
            color: #333;
            font-weight: 500;
            padding: 3px 8px;
            background: #f8f9fa;
            border-radius: 3px;
            border-left: 2px solid #2c5aa0;
            font-size: 10px;
            min-height: 20px;
            display: flex;
            align-items: center;
        }
        
        .field-value.large {
            min-height: 60px;
            align-items: flex-start;
            padding-top: 5px;
        }
        
        .two-columns {
            display: flex;
            gap: 15px;
        }
        
        .column {
            flex: 1;
        }
        
        .column-title {
            font-size: 11px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 8px;
            text-align: center;
            padding: 4px;
            background: #f0f4f8;
            border-radius: 3px;
            border-left: 3px solid #2c5aa0;
        }
        
        .constancy {
            background: #e8f4fd;
            border: 1px solid #b3d9ff;
            border-radius: 5px;
            padding: 8px;
            margin: 8px 0;
            text-align: center;
            font-size: 10px;
            line-height: 1.4;
            color: #2c5aa0;
            font-weight: 500;
        }
        
        .signature-section {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 20px;
        }
        
        .signature-box {
            flex: 1;
            max-width: 280px;
            text-align: center;
            padding: 12px;
            border: 1px dashed #ccc;
            border-radius: 5px;
            background: #fafafa;
            min-height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }
        
        .signature-line {
            border-top: 2px solid #333;
            margin: 15px auto 8px auto;
            width: 180px;
            display: block;
        }
        
        .signature-space {
            height: 40px;
            margin: 10px 0;
        }
        
        .signature-label {
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 3px;
            font-size: 10px;
        }
        
        .signature-field {
            color: #666;
            font-size: 9px;
            margin-bottom: 2px;
        }
        
        /* ✅ ESTILOS DEL FOOTER ACTUALIZADOS */
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
        
        /* Optimizaciones críticas para impresión */
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Mostrar header y footer personalizados solo en impresión */
            .print-header,
            .print-footer {
                display: block !important;
            }
            
            /* Ajustar el contenido para dar espacio al header/footer fijos */
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
            }
            
            body {
                font-size: 10px !important;
                padding: 8px !important;
            }
            
            .container {
                max-width: 100% !important;
                width: 100% !important;
                min-height: auto !important;
                height: auto !important;
                page-break-inside: avoid;
            }
            
            .section {
                box-shadow: none !important;
                border: 1px solid #ddd !important;
                margin: 4px 0 !important;
                page-break-inside: avoid;
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
            
            .two-columns {
                gap: 10px !important;
            }
            
            .column-title {
                font-size: 10px !important;
                margin-bottom: 6px !important;
            }
            
            .constancy {
                padding: 6px !important;
                margin: 6px 0 !important;
                page-break-inside: avoid;
            }
            
            .signature-section {
                margin-top: 12px !important;
                page-break-inside: avoid;
                gap: 15px !important;
            }
            
            .signature-box {
                min-height: 70px !important;
                padding: 10px !important;
            }
            
            .signature-line {
                width: 150px !important;
                margin: 12px auto 6px auto !important;
                display: block !important;
            }
            
            .signature-space {
                height: 30px !important;
                margin: 8px 0 !important;
            }
            
            /* ✅ ESTILOS DE IMPRESIÓN PARA FOOTER */
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
            
            .field-row {
                margin-bottom: 3px !important;
                page-break-inside: avoid;
            }
            
            .document-info {
                margin: 6px 0 !important;
                padding: 6px !important;
                page-break-after: avoid;
            }
            
            .section-header {
                padding: 4px 8px !important;
                font-size: 10px !important;
            }
        }
        
        /* Configuración de página para impresión */
        @page {
            size: letter;
            margin: 0.2in 0.5in;
            padding: 0;
            /* Ocultar header y footer del navegador */
            @top-left { content: ""; }
            @top-center { content: ""; }
            @top-right { content: ""; }
            @bottom-left { content: ""; }
            @bottom-center { content: ""; }
            @bottom-right { content: ""; }
        }
        
        /* Header personalizado para impresión */
        .print-header {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: white;
            border-bottom: 1px solid #ddd;
            z-index: 1000;
            padding: 8px 20px;
            box-sizing: border-box;
        }
        
        .print-header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
        }
        
        .print-header-logo {
            max-height: 30px;
            max-width: 80px;
        }
        
        .print-header-rif {
            font-size: 12px;
            font-weight: bold;
            color: #2c5aa0;
        }
        
        /* Footer personalizado para impresión */
        .print-footer {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            background: white;
            border-top: 1px solid #ddd;
            z-index: 1000;
            padding: 5px 20px;
            box-sizing: border-box;
        }
        
        .print-footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            font-size: 10px;
            color: #666;
        }
        
        /* Evitar cortes de página en elementos críticos */
        .header,
        .document-info,
        .section,
        .constancy,
        .signature-section,
        .footer {
            page-break-inside: avoid;
        }
    </style>
    </head>
    <body>
        <!-- Header personalizado para impresión -->
        <div class="print-header">
            <div class="print-header-content">
                <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="print-header-logo" onerror="this.style.display='none'">
                <div class="print-header-rif">RIF: J-00291615-0</div>
            </div>
        </div>
        
        <!-- Footer personalizado para impresión -->
        <div class="print-footer">
            <div class="print-footer-content">
                <div></div>
                <div></div>
            </div>
        </div>
        
        <div class="container">
            <div class="header">
                <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="company-logo-img" onerror="this.style.display='none'">
                <div class="company-address">
                    Urbanización El Rosal. Av. Francisco de Miranda<br>
                    Edif. Centro Sudamérica PH-A Caracas. Edo. Miranda
                </div>
                <div class="document-title">Acuerdo de Pago</div>
                <div class="document-subtitle"></div>
            </div>
            
            <div class="document-info">
                <div class="info-item">
                    <div class="info-label">Fecha</div>
                    <div class="info-value">${formatDate(d.fecha_actual || new Date())}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">N° de Ticket</div>
                    <div class="info-value">${safe(d.nro_ticket)}</div>
                </div>
            </div>

            <div class="content-wrapper">
                <div class="section">
                    <div class="section-header">Datos del Cliente</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">R.I.F. / Identificación:</div>
                            <div class="field-value">${safe(d.coddocumento) || '_____________________'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Razón Social:</div>
                            <div class="field-value">${safe(d.razonsocial) || '_____________________'}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">Antecedentes del Equipo</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">Ejecutivo de Venta:</div>
                            <div class="field-value">${safe(d.ejecutivo) || '_____________________'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Equipo MARCA:</div>
                            <div class="field-value">${safe(d.desc_modelo) || '_____________________'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Fecha de Instalación:</div>
                            <div class="field-value">${safe(d.fecha_instalacion) || '_____________________'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Serial N°:</div>
                            <div class="field-value">${safe(d.serialpos) || '_____________________'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Status del POS:</div>
                            <div class="field-value">${safe(d.desc_estatus) || '_____________________'}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">Información del Acuerdo</div>
                    <div class="section-content">
                        <div class="two-columns">
                            <div class="column">
                                <div class="column-title">Saldo deudor</div>
                                <div class="field-value">${formatCurrency(d.saldo_deudor)}</div>
                            </div>
                            <div class="column">
                                <div class="column-title">Propuesta</div>
                                <div class="field-value large">${safe(d.propuesta) || '_____________________'}</div>
                            </div>
                        </div>
                        <div class="two-columns">
                            <div class="column">
                                <div class="column-title">Observaciones</div>
                                <div class="field-value large">${safe(d.observaciones) || '_____________________'}</div>
                            </div>
                            <div class="column">
                                <div class="column-title">Acuerdo</div>
                                <div class="field-value large">${safe(d.acuerdo) || '_____________________'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="constancy">
                    <h3 style="color: #2c5aa0; margin-bottom: 10px; font-size: 12px;">INSTRUCCIONES DE PAGO</h3>
                    <p style="margin-bottom: 8px; font-size: 10px; line-height: 1.4; text-align: justify;">
                        Los pagos aquí acordados, deberán realizarse a través de depósitos a la cuenta N° <strong>${safe(d.numero_cuenta) || 'XXXX-XXXX-XX-XXXX'}</strong> a nombre de <strong>${safe(d.nombre_empresa) || 'Informática y Telecomunicaciones Integradas Inteligen, SA'}</strong> ${safe(d.rif_empresa) || 'J-00291615-0'} en el Banco <strong>${safe(d.banco) || 'XXXX'}</strong> y notificar a través de este correo los siguientes datos: nombre y número de RIF de su comercio, número de referencia, nombre del titular de la cuenta y monto del pago <strong>${safe(d.correo) || 'domiciliación.intelipunto@inteligensa.com'}</strong>. Recordar que cada vez que se realice un pago debe ser a la Tasa del BCV del día.
                    </p>
                </div>

                <div class="signature-section">
                    <div class="signature-box">
                        <div class="signature-label">Firma del Cliente</div>
                        <div class="signature-space"></div>
                        <div class="signature-line"></div>
                        <div class="signature-field">Nombre: _____________________</div>
                        <div class="signature-field">C.I.: _____________________</div>
                    </div>
                    
                    <div class="signature-box">
                        <div class="signature-label">Firma de Inteligensa</div>
                        <div class="signature-space"></div>
                        <div class="signature-line"></div>
                        <div class="signature-field">Nombre: ${safe(d.ejecutivo) || '_____________________'}</div>
                        <div class="signature-field">C.I.: _____________________</div>
                    </div>
                </div>

                <!-- ✅ FOOTER ACTUALIZADO CON LOGO Y RIF -->
                <div class="footer">
                    <div class="footer-content">
                        <div class="footer-left">
                            <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="footer-logo" onerror="this.style.display='none'">
                        </div>
                        <div class="footer-right">
                            <div class="footer-rif">RIF: J-00291615-0'</div>
                        </div>
                    </div>
                    <div class="footer-text">
                        <p>El cliente certifica su responsabilidad de cumplir con los términos y condiciones del acuerdo de pago establecido en este documento.</p>
                        <p>Generado: ${new Date().toLocaleString('es-ES')}</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;
}