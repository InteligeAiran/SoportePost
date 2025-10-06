
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
                    const headers = ['N°', 'N° Ticket', 'Serial POS', 'Banco', 'Tipo POS', 'Acciones'];
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
                            dom: '<"top d-flex justify-content-between align-items-center"lf>rt<"bottom"ip><"clear">'
                        });

                        // Event listener para el botón de ver componentes
                        $(document).off('click', '.ver-componentes-btn').on('click', '.ver-componentes-btn', function() {
                            const idTicket = $(this).data('id');
                            const serialPos = $(this).data('serial');
                            const nroTicket = $(this).data('ticket');
                            
                            console.log('Ver componentes para:', {
                                idTicket: idTicket,
                                serialPos: serialPos,
                                nroTicket: nroTicket
                            });
                            
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
                            .on("click", "tr", function () {
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

    const datos = `action=GetTicketsComponentes`;
    xhr.send(datos);
}

// Función para mostrar el modal de componentes con datos reales
function showComponentsModal(idTicket, serialPos, nroTicket) {
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

    // Llamada AJAX para obtener la información del POS
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPOSInfo`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        Swal.close(); // Cerrar el loading

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success && response.tickets && response.tickets.length > 0) {
                    // CORRECCIÓN: Mostrar TODOS los registros, no solo el primero
                    const allPosData = response.tickets; // Todos los registros
                    
                    // Crear HTML para mostrar la información del POS
                    let posInfoHtml = `
                        <div class="text-start">
                            <div class="row mb-4">
                                <div class="col-12 text-center mb-3">
                                    <h5 class="text-primary">
                                        <i class="fas fa-desktop me-2"></i>
                                        Información del POS
                                    </h5>
                                    <p class="text-muted">Se encontraron ${allPosData.length} registro(s) de componentes</p>
                                </div>
                            </div>
                            
                            <!-- Información del Ticket y Serial (común para todos) -->
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="card border-primary">
                                        <div class="card-header bg-primary text-white">
                                            <strong><i class="fas fa-ticket-alt me-2"></i>Información del Ticket</strong>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-2"><strong>N° Ticket:</strong> ${nroTicket}</p>
                                            <p class="mb-0"><strong>ID Ticket:</strong> ${idTicket}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card border-info">
                                        <div class="card-header bg-info text-white">
                                            <strong><i class="fas fa-barcode me-2"></i>Serial del POS</strong>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-0"><strong>Serial:</strong> ${serialPos}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Información del Banco y Tipo de POS (común para todos) -->
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="card border-success">
                                        <div class="card-header bg-success text-white">
                                            <strong><i class="fas fa-university me-2"></i>Información del Banco</strong>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-0">
                                                <strong>Banco:</strong><br>
                                                <span class="text-break">${allPosData[0].banco_ibp || 'No disponible'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card border-warning">
                                        <div class="card-header bg-warning text-dark">
                                            <strong><i class="fas fa-cogs me-2"></i>Tipo de POS</strong>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-0">
                                                <strong>Modelo:</strong><br>
                                                <span class="text-break">${allPosData[0].tipo_pos || 'No disponible'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Componentes por Módulo (ITERAR TODOS LOS REGISTROS) -->
                            <div class="row mb-3">
                                <div class="col-12">
                                    <h6 class="text-primary mb-3">
                                        <i class="fas fa-puzzle-piece me-2"></i>
                                        Componentes por Módulo
                                    </h6>
                                </div>
                            </div>
                    `;

                    // ITERAR TODOS LOS REGISTROS DE COMPONENTES
                    allPosData.forEach((posData, index) => {
                        posInfoHtml += `
                            <div class="row mb-3">
                                <div class="col-12">
                                    <div class="card border-secondary">
                                        <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                                            <strong>
                                                <i class="fas fa-layer-group me-2"></i>
                                                Módulo: ${posData.modulo_insert || 'No disponible'}
                                            </strong>
                                            <span class="badge bg-light text-dark">#${index + 1}</span>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <p class="mb-2">
                                                        <strong><i class="fas fa-user me-2"></i>Usuario que Cargó:</strong><br>
                                                        <span class="text-break">${posData.full_name || 'No disponible'}</span>
                                                    </p>
                                                </div>
                                                <div class="col-md-6">
                                                    <p class="mb-2">
                                                        <strong><i class="fas fa-calendar me-2"></i>Fecha de Carga:</strong><br>
                                                        <span class="text-break">${posData.component_insert_date || 'No disponible'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <p class="mb-0">
                                                        <strong><i class="fas fa-puzzle-piece me-2"></i>Componentes:</strong><br>
                                                        <span class="text-break badge bg-primary text-white p-2" style="font-size: 0.9em;">
                                                            ${posData.aggregated_components_by_module || 'No disponible'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });

                    posInfoHtml += `
                            <!-- Nota informativa -->
                            <div class="row mt-3">
                                <div class="col-12">
                                    <div class="alert alert-info">
                                        <i class="fas fa-info-circle me-2"></i>
                                        <strong>Nota:</strong> Esta información se obtiene desde la base de datos de Intelipunto y muestra todos los registros de componentes registrados para este serial de POS, organizados por módulo.
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    // Mostrar el modal con la información del POS
                    Swal.fire({
                        title: 'Información del POS',
                        html: posInfoHtml,
                        icon: 'info',
                        confirmButtonText: 'Cerrar',
                        confirmButtonColor: '#17a2b8',
                        width: 900, // Aumentar el ancho para mostrar más información
                        customClass: {
                            popup: 'swal-wide'
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
    const datos = `action=GetPOSInfo&serial=${encodeURIComponent(serialPos)}&id_ticket=${idTicket}`;
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
                    }
                    return;
                }

                updateDomiciliacionStatus(idTicket, newStatusId, id_user, changeStatusDomiciliacionModal);
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
        });

        const closeIconBtn = changeStatusDomiciliacionModalElement.querySelector("#Close-icon");
        const closeButton = changeStatusDomiciliacionModalElement.querySelector("#close-button");

        if (closeIconBtn) {
            closeIconBtn.addEventListener('click', function () {
                changeStatusDomiciliacionModal.hide();
            });
        }

        if (closeButton) {
            closeButton.addEventListener('click', function () {
                changeStatusDomiciliacionModal.hide();
            });
        }
    }
});

// Función para enviar la actualización del estatus de domiciliación al backend
function updateDomiciliacionStatus(idTicket, newStatusId, id_user) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/updateDomiciliacionStatus`); // Nueva ruta de API para actualizar
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    const changeStatusDomiciliacionModal = document.getElementById("changeStatusDomiciliacionModal");
    const errorMessageDomiciliacion = changeStatusDomiciliacionModal.querySelector("#errorMessageDomiciliacion");

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
                    const changeStatusDomiciliacionModalElement = document.getElementById("changeStatusDomiciliacionModal");
                    const changeStatusDomiciliacionModal = new bootstrap.Modal(changeStatusDomiciliacionModalElement);

                    changeStatusDomiciliacionModal.hide();
                    searchDomiciliacionTickets
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

    const datos = `action=updateDomiciliacionStatus&id_ticket=${idTicket}&new_status_id=${newStatusId}&id_user=${id_user}`;
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

document.addEventListener("DOMContentLoaded", getStatusDom);