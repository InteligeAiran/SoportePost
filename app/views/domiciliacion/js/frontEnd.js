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
                        { data: 'name_status_domiciliacion', title: 'Estado de Domiciliación' },
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
                        { data: 'name_status_lab', title: 'Estado de Laboratorio' },
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

                                if (currentStatusDomiciliacion === '2') {
                                    return `<button class="btn btn-secondary btn-sm" disabled>Solvente</button>`;
                                } else {
                                    return `
                                        <button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-domiciliacion-btn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#changeStatusDomiciliacionModal"
                                            data-id="${idTicket}"
                                            data-current-status-id="${currentStatusDomiciliacion}"
                                            data-current-status-name="${currentNameStatusDomiciliacion}">
                                            Cambiar Estatus
                                        </button>`;
                                }
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
                                    loadTicketHistory(ticketId);
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
                      <img id="device-ticket-image" src="${initialImageUrl}" alt="${initialImageAlt}" class="img-fluid rounded" style="max-width: 120px; height: auto; object-fit: contain;">
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
                          ${d.fecha_instalacion ||  'No posee'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div  style = "font-size: 77%;" >Fecha último ticket:</div></strong>
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
                          ${d.nombre_estado_cliente ||  'No posee'}
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
            <div class="row mb-3" style="margin-top: -7%; positipn: relative;">
                <div class="col-12">
                    <div class="row">
                        <div class="col-sm-4 mb-2">
                            <strong><div>Acción:</div></strong>
                            <span class = "Accion-ticket">${d.name_accion_ticket}</span>
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

function downloadImageModal(serial) {
  // Considera renombrar a loadDeviceImage(serial) para mayor claridad
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPhoto`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        //console.log("Respuesta de GetPhoto:", response); // Descomenta para depuración

        // ***** CAMBIO CLAVE AQUÍ *****
        // Selecciona el elemento de imagen en el panel de detalles, NO en un modal
        const imgElement = document.getElementById("device-ticket-image");

        if (imgElement) {
          if (response.success && response.rutaImagen) {
            const srcImagen = response.rutaImagen;
            const claseImagen = response.claseImagen || ""; // Obtener la clase CSS, si no hay, usar cadena vacía

            imgElement.src = srcImagen;
            imgElement.alt = `Imagen del dispositivo ${serial}`; // Actualiza el alt text

            // Opcional: Si 'claseImagen' trae clases CSS específicas que quieres añadir
            // y no colisionan con img-fluid o rounded, puedes hacer:
            // if (claseImagen) {
            //     imgElement.classList.add(claseImagen);
            // }
            // Si 'claseImagen' es una clase para reemplazar el estilo (lo cual no es común aquí),
            // entonces tendrías que asegurarte de que la clase de tu backend incluya
            // las propiedades de img-fluid y rounded, o volver a añadirlas.
            // Para este caso, con Bootstrap, probablemente no necesites asignar `className` aquí
            // ya que `max-height` y `width: auto` en el style ya controlan el tamaño.
          } else {
            // Si no hay éxito o rutaImagen, carga una imagen de "no disponible"
            imgElement.src = "assets/img/image-not-found.png"; // Crea esta imagen
            imgElement.alt = `Imagen no disponible para serial ${serial}`;
            console.warn(
              "No se obtuvo ruta de imagen o éxito de la API para el serial:",
              serial,
              response.message
            );
          }
        } else {
          console.error(
            'Error: No se encontró el elemento <img> con ID "device-ticket-image" en el DOM.'
          );
        }
      } catch (error) {
        console.error("Error parsing JSON response for image:", error);
        const imgElement = document.getElementById("device-ticket-image");
        if (imgElement) {
          imgElement.src = "assets/img/error-loading-image.png"; // Crea esta imagen
          imgElement.alt = "Error al cargar imagen";
        }
      }
    } else {
      console.error(
        "Error al obtener la imagen (HTTP):",
        xhr.status,
        xhr.statusText
      );
      const imgElement = document.getElementById("device-ticket-image");
      if (imgElement) {
        imgElement.src = "assets/img/error-loading-image.png";
        imgElement.alt = "Error de servidor al cargar imagen";
      }
    }
  };

  xhr.onerror = function () {
    console.error(
      "Error de red al intentar obtener la imagen para el serial:",
      serial
    );
    const imgElement = document.getElementById("device-ticket-image");
    if (imgElement) {
      imgElement.src = "assets/img/network-error-image.png"; // Crea esta imagen
      imgElement.alt = "Error de red";
    }
  };

  const datos = `action=GetPhoto&serial=${encodeURIComponent(serial)}`;
  xhr.send(datos);
}

function loadTicketHistory(ticketId) {
  const historyPanel = $("#ticket-history-content");
  historyPanel.html('<p class="text-center text-muted">Cargando historial...</p>');

  $.ajax({
    url: `${ENDPOINT_BASE}${APP_PATH}api/historical/GetTicketHistory`,
    type: "POST",
    data: {
      action: "GetTicketHistory",
      id_ticket: ticketId,
    },
    dataType: "json",
    success: function (response) {
      if (response.success && response.history && response.history.length > 0) {
        let historyHtml = '<div class="accordion" id="ticketHistoryAccordion">';

        response.history.forEach((item, index) => {
          const collapseId = `collapseHistoryItem_${ticketId}_${index}`;
          const headingId = `headingHistoryItem_${ticketId}_${index}`;

          const isLatest = index === 0;
          const isExpanded = false;

          const prevItem = response.history[index + 1] || {};

          // CORRECCIÓN: Mejorar la función cleanString para manejar espacios en blanco
          const cleanString = (str) => {
            if (!str) return null;
            const trimmed = str.replace(/\s/g, ' ').trim();
            return trimmed === '' ? null : trimmed;
          };

          const itemAccion = cleanString(item.name_accion_ticket);
          const itempago = cleanString(item.name_status_payment);
          const prevAccion = cleanString(prevItem.name_accion_ticket);
          const accionChanged = prevAccion && itemAccion !== prevAccion;

          // CORRECCIÓN: Mejorar el manejo del técnico asignado para detectar cambios
          const itemTecnico = cleanString(item.full_name_tecnico_n2_history);
          const prevTecnico = cleanString(prevItem.full_name_tecnico_n2_history);
          
          // Marcar como cambiado si:
          // 1. Ambos valores existen y son diferentes, O
          // 2. Uno de los dos valores existe y el otro no (asignación/desasignación)
          const tecnicoChanged = (prevTecnico && itemTecnico && prevTecnico !== itemTecnico) || 
                                (prevTecnico && !itemTecnico) || 
                                (!prevTecnico && itemTecnico);

          const itemStatusLab = cleanString(item.name_status_lab);
          const prevStatusLab = cleanString(prevItem.name_status_lab);
          const statusLabChanged = prevStatusLab && itemStatusLab !== prevStatusLab;

          const itemStatusDom = cleanString(item.name_status_domiciliacion);
          const prevStatusDom = cleanString(prevItem.name_status_domiciliacion);
          const statusDomChanged = prevStatusDom && itemStatusDom !== prevStatusDom;

          const itemStatusPayment = cleanString(item.name_status_payment);
          const prevStatusPayment = cleanString(prevItem.name_status_payment);
          const statusPaymentChanged = prevStatusPayment && itemStatusPayment !== prevStatusPayment;

          const itemStatusTicket = cleanString(item.name_status_ticket);
          const prevStatusTicket = cleanString(prevItem.name_status_ticket);
          const estatusTicketChanged = prevStatusTicket && itemStatusTicket !== prevStatusTicket;

          const itemComponents = cleanString(item.components_list);
          const prevComponents = cleanString(prevItem.components_list);
          const componentsChanged = prevComponents && itemComponents !== prevComponents;

          // --- NUEVO CÓDIGO PARA COMPARAR EL MOTIVO DE RECHAZO ---
          const itemMotivoRechazo = cleanString(item.name_motivo_rechazo);
          const prevMotivoRechazo = cleanString(prevItem.name_motivo_rechazo);
          const motivoRechazoChanged = prevMotivoRechazo && itemMotivoRechazo !== prevMotivoRechazo;

          const showComponents = itemAccion === 'Actualización de Componentes' && itemComponents;

          // --- NUEVO CÓDIGO PARA DOCUMENTOS CARGADOS ---
          const itemPago = cleanString(item.pago);
          const itemExoneracion = cleanString(item.exoneracion);
          const itemEnvio = cleanString(item.envio);
          const itemEnvioDestino = cleanString(item.envio_destino);
          const itemDocumentoRechazado = cleanString(item.documento_rechazado);

          const prevPago = cleanString(prevItem.pago);
          const prevExoneracion = cleanString(prevItem.exoneracion);
          const prevEnvio = cleanString(prevItem.envio);
          const prevEnvioDestino = cleanString(prevItem.envio_destino);
          const prevDocumentoRechazado = cleanString(prevItem.documento_rechazado);

          const pagoChanged = prevPago && itemPago !== prevPago;
          const exoneracionChanged = prevExoneracion && itemExoneracion !== prevExoneracion;
          const envioChanged = prevEnvio && itemEnvio !== prevEnvio;
          const envioDestinoChanged = prevEnvioDestino && itemEnvioDestino !== prevEnvioDestino;
          const documentoRechazadoChanged = prevDocumentoRechazado && itemDocumentoRechazado !== prevDocumentoRechazado;
          
          // --- LÓGICA CORREGIDA PARA MOSTRAR EL MOTIVO DE RECHAZO ---
          const rejectedActions = [
            'Documento de Exoneracion Rechazado',
            'Documento de Anticipo Rechazado'         
         ];

          const showMotivoRechazo = rejectedActions.includes(itempago) && item.name_motivo_rechazo;

          // --- NUEVA LÓGICA: Mostrar comment_devolution cuando la acción es 'En espera de Confirmar Devolución' ---
          const showCommentDevolution = itemAccion === 'En espera de Confirmar Devolución' && item.comment_devolution;

          const shouldHighlightComponents = showComponents && (accionChanged || componentsChanged);

          let headerStyle = isLatest ? "background-color: #ffc107;" : "background-color: #5d9cec;";
          let textColor = isLatest ? "color: #343a40;" : "color: #ffffff;";
          
          // NUEVA LÓGICA: Mostrar el status del laboratorio cuando la acción es "En taller"
          let statusHeaderText;
          if (itemAccion === "Enviado a taller" || itemAccion === "En Taller") {
            statusHeaderText = ` (${item.name_status_lab || "Desconocido"})`;
          } else {
            statusHeaderText = ` (${item.name_status_ticket || "Desconocido"})`;
          }

          // Solo mostrar el comentario de devolución cuando sea relevante
          if (item.name_accion_ticket === 'En espera de Confirmar Devolución' && item.comment_devolution) {
            historyHtml += `
              <div class="alert alert-warning alert-sm mb-2">
                <strong>Comentario de Devolución:</strong> ${item.comment_devolution}
              </div>
            `;
          }
         
          historyHtml += `
                        <div class="card mb-3 custom-history-card">
                            <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                        data-toggle="collapse" data-target="#${collapseId}"
                                        aria-expanded="${isExpanded}" aria-controls="${collapseId}"
                                        style="${textColor}">
                                        ${item.fecha_de_cambio} - ${item.name_accion_ticket}${statusHeaderText}
                                    </button>
                                </h2>
                            </div>
                            <div id="${collapseId}" class="collapse"
                                aria-labelledby="${headingId}" data-parent="#ticketHistoryAccordion">
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
                                                    <td class="${accionChanged ? "highlighted-change" : ""}">${item.name_accion_ticket || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Operador de Gestión:</th>
                                                    <td>${item.full_name_tecnico_gestion || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td>${item.full_name_coordinador || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Técnico Asignado:</th>
                                                    <td class="${tecnicoChanged ? "highlighted-change" : ""}">
                                                        ${item.full_name_tecnico_n2_history && item.full_name_tecnico_n2_history.trim() !== "" ? item.full_name_tecnico_n2_history : "Pendiente por Asignar"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Ticket:</th>
                                                    <td class="${estatusTicketChanged ? "highlighted-change" : ""}">${item.name_status_ticket || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Laboratorio:</th>
                                                    <td class="${statusLabChanged ? "highlighted-change" : ""}">${item.name_status_lab || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Domiciliación:</th>
                                                    <td class="${statusDomChanged ? "highlighted-change" : ""}">${item.name_status_domiciliacion || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Pago:</th>
                                                    <td class="${statusPaymentChanged ? "highlighted-change" : ""}">${item.name_status_payment || "N/A"}</td>
                                                </tr>
                                                ${showComponents ? `
                                                    <tr>
                                                        <th class="text-start">Componentes Asociados:</th>
                                                        <td class="${shouldHighlightComponents ? "highlighted-change" : ""}">${item.components_list}</td>
                                                    </tr>
                                                ` : ''}
                                                ${showMotivoRechazo ? `
                                                  <tr>
                                                    <th class="text-start">Motivo Rechazo Documento:</th>
                                                    <td class="${statusPaymentChanged ? "highlighted-change" : ""}">${item.name_motivo_rechazo || "N/A"}</td>
                                                  </tr>
                                             ` : ''}
                                                ${showCommentDevolution ? `
                                                  <tr>
                                                    <th class="text-start">Comentario de Devolución:</th>
                                                    <td class="highlighted-change">${item.comment_devolution || "N/A"}</td>
                                                  </tr>
                                             ` : ''}
                                                ${itemPago === 'Sí' ? `
                                                  <tr>
                                                    <th class="text-start">Documento de Pago:</th>
                                                    <td class="${pagoChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                  </tr>
                                             ` : ''}
                                                ${itemExoneracion === 'Sí' ? `
                                                  <tr>
                                                    <th class="text-start">Documento de Exoneración:</th>
                                                    <td class="${exoneracionChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                  </tr>
                                             ` : ''}
                                                ${itemEnvio === 'Sí' ? `
                                                  <tr>
                                                    <th class="text-start">Documento de Envío:</th>
                                                    <td class="${pagoChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                  </tr>
                                             ` : ''}
                                                ${itemEnvioDestino === 'Sí' ? `
                                                  <tr>
                                                    <th class="text-start">Documento de Envío a Destino:</th>
                                                    <td class="${envioDestinoChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                  </tr>
                                             ` : ''}
                                                ${itemDocumentoRechazado === 'Sí' ? `
                                                  <tr>
                                                    <th class="text-start">Documento Rechazado:</th>
                                                    <td class="${documentoRechazadoChanged ? "highlighted-change" : ""}">⚠ Rechazado</td>
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
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error completo de AJAX:", {
        jqXHR: jqXHR,
        textStatus: textStatus,
        errorThrown: errorThrown,
      });
      let errorMessage = '<p class="text-center text-danger">Error al cargar el historial.</p>';
      if (jqXHR.status === 0) {
        errorMessage = '<p class="text-center text-danger">Error de red: No se pudo conectar al servidor.</p>';
      } else if (jqXHR.status == 404) {
        errorMessage = '<p class="text-center text-danger">Recurso no encontrado. (Error 404)</p>';
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

