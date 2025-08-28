let dataTableInstance;
let currentTicketId;
let modalInstance;
let currentnroTicket;
let currentSerial;
let currentDocument;
let currentEstado;

let url_envio;
let url_exoneracion;
let url_pago;


function getTicketData() {
  const tbody = document.getElementById("tabla-ticket").getElementsByTagName("tbody")[0];
  const detailsPanel = document.getElementById("ticket-details-panel");
  const actionSelectionModalElement = document.getElementById("actionSelectionModal"); // Modal de "Seleccionar Acción"
  const staticBackdropModalElement = document.getElementById("staticBackdrop"); // Modal de "Deseas Enviar al Taller?"
  const uploadDocumentModalElement = document.getElementById("uploadDocumentModal");
  const viewDocumentModalElement = document.getElementById("viewDocumentModal");
  const devuelveModalElement = document.getElementById("devolverClienteModal");

  let modaldevolucion = null;
  let actionSelectionModalInstance = null;
  let staticBackdropModalInstance = null;
  let uploadDocumentModalInstance = null;
  let viewDocumentModalInstance = null;

  if (
    devuelveModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    modaldevolucion = new bootstrap.Modal(devuelveModalElement, {
      backdrop: "static",
    });
  }

  // Inicializar instancias de modales si los elementos existen y Bootstrap está cargado
  if (
    actionSelectionModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    actionSelectionModalInstance = new bootstrap.Modal(
      actionSelectionModalElement,
      { backdrop: "static" }
    );
  }

  if (
    staticBackdropModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    staticBackdropModalInstance = new bootstrap.Modal(
      staticBackdropModalElement,
      { backdrop: "static" }
    );
  }

  if (
    uploadDocumentModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    uploadDocumentModalInstance = new bootstrap.Modal(
      uploadDocumentModalElement,
      { backdrop: "static" }
    );
  }

  if (
    viewDocumentModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    viewDocumentModalInstance = new bootstrap.Modal(viewDocumentModalElement, {
      backdrop: "static",
    });
  }

  if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
    $("#tabla-ticket").DataTable().destroy();
    tbody.innerHTML = ""; // Limpiar el tbody después de destruir
  } else {
    tbody.innerHTML = ""; // Limpiar el tbody si es la primera vez
  }

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketData1`)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
           tbody.innerHTML =`<tr>
        <td colspan="14" class="text-center text-muted py-5">
          <div class="d-flex flex-column align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
              <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
            <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
            <p class="text-muted mb-0">No hay tickets para Asignar a Técnico para mostrar en este momento.</p>
          </div>
        </td>
      </tr>`;
        }
        throw new Error(
          `Error HTTP: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
    if (data.success && data.ticket) {
        const TicketData = data.ticket;

        // MOSTRAR EL ESTADO DEL PRIMER TICKET (o el más reciente)
        if (TicketData && TicketData.length > 0) {
          const firstTicket = TicketData[0];
          showTicketStatusIndicator(firstTicket.name_status_ticket, firstTicket.name_accion_ticket);
        } else {
          hideTicketStatusIndicator();
        }

        detailsPanel.innerHTML =
            "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

        const dataForDataTable = TicketData.map((ticket) => {
            let actionButtonsHTML = '<div class="d-flex align-items-center">';

            const fullRazonSocial = ticket.razonsocial_cliente || "";
            const displayLength = 25;
            const truncatedRazonSocial =
                fullRazonSocial.length > displayLength
                    ? `<span class="truncated-cell" data-full-text="${fullRazonSocial}">${fullRazonSocial.substring(
                          0,
                          displayLength
                      )}...</span>`
                    : `<span class="truncated-cell" data-full-text="${fullRazonSocial}">${fullRazonSocial}</span>`;

            const hasBeenConfirmedByAnyone =
                ticket.confirmcoord === "t" ||
                ticket.confirmcoord === true ||
                ticket.confirmtecn === "t" ||
                ticket.confirmtecn === true;

            // --- Lógica para el botón que abre el modal ---
                    // Solo se muestra el botón si hay acciones de documentos disponibles
              if ((ticket.id_status_payment == 11 || ticket.id_status_payment == 10 || ticket.id_status_payment == 9 || ticket.id_status_payment == 6 || ticket.id_status_payment == 4) && 
                  (ticket.confirmtecn === "t" || ticket.confirmtecn === true || ticket.confirmcoord === "t" || ticket.confirmcoord === true)) {
                  // Tu código aquí
                    
              actionButtonsHTML += `
                  <button class="btn btn-sm btn-info btn-document-actions-modal mr-2"
                      data-bs-toggle="tooltip" data-bs-placement="top"
                      title="Acciones de Documentos"
                      data-ticket-id="${ticket.id_ticket}"
                      data-nro-ticket="${ticket.nro_ticket}"
                      data-status-payment="${ticket.id_status_payment}"
                      data-pdf-zoom-url="${ticket.pdf_zoom_url || ""}"
                      data-img-exoneracion-url="${ticket.img_exoneracion_url || ""}"
                      data-pdf-pago-url="${ticket.pdf_pago_url || ""}"
                      data-exo-file="${ticket.img_exoneracion_filename || ""}"
                      data-pago-file="${ticket.pdf_pago_filename || ""}"
                      data-zoom-file="${ticket.pdf_zoom_filename || ""}"
                      data-estado-cliente="${ticket.nombre_estado_cliente}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/></svg>
                  </button>
              `;
          }

            // Lógica para el botón "Marcar como Recibido"
            if (!hasBeenConfirmedByAnyone) {
                actionButtonsHTML += `
                    <button id = "RecibirTec" class="btn btn-sm  btn-received-ticket mr-2"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        title="Marcar como Recibido por Técnico"
                        data-ticket-id="${ticket.id_ticket}">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>
                    </button>`;
            }

            // Lógica para el botón "Enviar a Taller"
            if (hasBeenConfirmedByAnyone && ticket.name_accion_ticket !== "Enviado a taller") {
                actionButtonsHTML += `
                    <button class="btn btn-sm btn-wrench-custom"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        title="Enviar a Taller"
                        data-ticket-id="${ticket.id_ticket}"
                        data-nro_ticket="${ticket.nro_ticket}",
                        data-id_document="${ticket.id_status_payment}"
                        data-serial_pos="${ticket.serial_pos || ''}"
                        data-url_zoom="${ticket.pdf_zoom_url || ''}"
                        data-url_exo="${ticket.img_exoneracion_url || ''}"
                        data-url_pago="${ticket.pdf_pago_url || ''}"
                        data-estado="${ticket.nombre_estado_cliente}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-wrench-adjustable-circle" viewBox="0 0 16 16"><path d="M12.496 8a4.5 4.5 0 0 1-1.703 3.526L9.497 8.5l2.959-1.11q.04.3.04.61"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1 0a7 7 0 1 0-13.202 3.249l1.988-1.657a4.5 4.5 0 0 1 7.537-4.623L7.497 6.5l1 2.5 1.333 3.11c-.56.251-1.18.39-1.833.39a4.5 4.5 0 0 1-1.592-.29L4.747 14.2A7 7 0 0 0 15 8m-8.295.139a.25.25 0 0 0-.288-.376l-1.5.5.159.474.808-.27-.595.894a.25.25 0 0 0 .287.376l.808-.27-.595.894a.25.25 0 0 0 .287.376l1.5-.5-.159-.474-.808.27.596-.894a.25.25 0 0 0-.288-.376l-.808.27z"/></svg>
                    </button>`;
            }

          actionButtonsHTML += '</div>';

          const finalActionColumnHTML = `<div class="acciones-container">${actionButtonsHTML}</div>`;

          return [
            ticket.id_ticket,
            ticket.nro_ticket,
            ticket.serial_pos, // Usar el HTML del span aquí
            ticket.rif,
            truncatedRazonSocial, // Usar el HTML truncado aquí
            ticket.name_accion_ticket,
            finalActionColumnHTML,
          ];
        });

        dataTableInstance = $("#tabla-ticket").DataTable({
          responsive: false,
          scrollX: true,
          pagingType: "simple_numbers",
          lengthMenu: [
            [5, 10],
            ["5", "10"],
          ],
          autoWidth: false,
          data: dataForDataTable,
          columns: [
            { title: "N°", orderable: false, searchable: false,
              render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
              }
            },
            { title: "Nro Ticket" },
            {title: "Serial" }, // Esta columna ahora contendrá el HTML del span}
            { title: "Rif" },
            { title: "Razón Social" }, // Esta columna ahora contendrá el HTML del span
            { title: "Acción Ticket" },
            { title: "Acciones", orderable: false },
          ],
          language: {
            lengthMenu: "Mostrar _MENU_",
            //emptyTable: "No hay datos disponibles en la tabla",
            info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
           //infoEmpty: "No hay datos disponibles",
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
          },
          dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
          // Dentro de tu initComplete de DataTables
          initComplete: function (settings, json) {
              const dataTableInstance = this.api(); // Obtén la instancia de la API de DataTables 
              const buttonsHtml = `
                  <button id="btn-asignados" class="btn btn-secondary me-2" title="Tickets Asignados">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                      </svg>
                  </button>

                  <button id="btn-recibidos" class="btn btn-secondary me-2" title="Tickets recibidos por el Técnico">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                      <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                    </svg>
                  </button>

                  <button id="btn-por-asignar" class="btn btn-secondary me-2" title = "Enviados Taller">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                      <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>
                    </svg>
                  </button>

                  <button id="btn-devuelto" class="btn btn-secondary me-2" title="Pos Entregado a cliente">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                      <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                    </svg>
                  </button>
              `;
              $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

              // Tu función setActiveButton es correcta.
              function setActiveButton(activeButtonId) {
                  $("#btn-asignados").removeClass("btn-primary").addClass("btn-secondary");
                  $("#btn-por-asignar").removeClass("btn-primary").addClass("btn-secondary");
                  $("#btn-recibidos").removeClass("btn-primary").addClass("btn-secondary");
                  $("#btn-devuelto").removeClass("btn-primary").addClass("btn-secondary");
                  $(`#${activeButtonId}`).removeClass("btn-secondary").addClass("btn-primary");
              }

              // Función para verificar si hay datos en una búsqueda específica
              function checkDataExists(searchTerm) {
                  dataTableInstance.columns().search('').draw(false);
                  
                  const filteredData = dataTableInstance.column(5).search(searchTerm, true, false).draw();
                  const rowCount = dataTableInstance.rows({ filter: 'applied' }).count();
                  
                  return rowCount > 0;
              }

              // Función para buscar automáticamente el primer botón con datos
              // Función para buscar automáticamente el primer botón con datos
              function findFirstButtonWithData() {
                  const searchTerms = [
                      { button: "btn-asignados", term: "Asignado al Técnico", status: "En proceso", action: "Asignado al Técnico" },
                      { button: "btn-recibidos", term: "Recibido por el Técnico", status: "En proceso", action: "Recibido por el Técnico" },
                      { button: "btn-por-asignar", term: "Enviado a taller|En Taller", status: "En proceso",  action: "Enviado a taller|En Taller"},
                      { button: "btn-devuelto", term: "Entregado a Cliente", status: "Cerrado", action: "Entregado a Cliente" }
                  ];

                  for (let i = 0; i < searchTerms.length; i++) {
                      const { button, term, status, action } = searchTerms[i];
                      
                      if (checkDataExists(term)) {
                          // Si hay datos, aplicar la búsqueda y activar el botón
                          dataTableInstance.columns().search('').draw(false);
                          dataTableInstance.column(5).search(term, true, false).draw();
                          
                          // NUEVO: Ocultar columna 6 solo si es btn-devuelto
                          if (button === "btn-devuelto") {
                              dataTableInstance.column(6).visible(false);
                          } else {
                              dataTableInstance.column(6).visible(true);
                          }
                          
                          setActiveButton(button);
                          
                          // EJECUTAR showTicketStatusIndicator con los datos correspondientes
                          showTicketStatusIndicator(status, action);
                          
                          return true; // Encontramos datos
                      }
                  }
                  
                  // Si no se encontraron datos en ningún botón, ocultar el indicador
                  hideTicketStatusIndicator();
                  return false;
              }

              // Ejecutar la búsqueda automática al inicializar
              findFirstButtonWithData();

              // Event listeners para los botones (mantener la funcionalidad manual)
              $("#btn-asignados").on("click", function () {
                  if (checkDataExists("Asignado al Técnico")) {
                    showTicketStatusIndicator('En proceso', 'Asignado al Técnico');
                    dataTableInstance.columns().search('').draw(false);
                    dataTableInstance.column(5).search("Asignado al Técnico").draw();
                    // NUEVO: Mostrar columna 6 para otros botones
                    dataTableInstance.column(6).visible(true);
                    setActiveButton("btn-asignados");
                  } else {
                    findFirstButtonWithData();
                  }
              });

              $("#btn-por-asignar").on("click", function () {
                  if (checkDataExists("Enviado a taller|En Taller")) {
                    showTicketStatusIndicator('En proceso', 'Enviado a taller|En Taller');
                    dataTableInstance.columns().search('').draw(false);
                    dataTableInstance.column(5).search("Enviado a taller|En Taller", true, false).draw();
                    // NUEVO: Mostrar columna 6 para otros botones
                    dataTableInstance.column(6).visible(true);
                    setActiveButton("btn-por-asignar");
                  } else {
                    findFirstButtonWithData();
                  }
              });

              $("#btn-recibidos").on("click", function () {
                  if (checkDataExists("Recibido por el Técnico")) {
                    showTicketStatusIndicator('Recibido', 'Recibido por el Técnico');
                    dataTableInstance.columns().search('').draw(false);
                    dataTableInstance.column(5).search("Recibido por el Técnico").draw();
                    // NUEVO: Mostrar columna 6 para otros botones
                    dataTableInstance.column(6).visible(true);
                    setActiveButton("btn-recibidos");
                  } else {
                    findFirstButtonWithData();
                  }
              });

              $("#btn-devuelto").on("click", function () {
                  if (checkDataExists("Entregado a Cliente")) {
                    showTicketStatusIndicator('Cerrado', 'Entregado a Cliente');
                    dataTableInstance.columns().search('').draw(false);
                    dataTableInstance.column(5).search("Entregado a Cliente").draw();
                    // NUEVO: Ocultar columna 6 solo para btn-devuelto
                    dataTableInstance.column(6).visible(false);
                    setActiveButton("btn-devuelto");
                  } else {
                    findFirstButtonWithData();
                  }
              });
            // ************* FIN CAMBIOS PARA LOS BOTONES *************

            $("#tabla-ticket tbody")
            .off("click", ".btn-received-ticket") // Remueve cualquier manejador anterior para .btn-received-ticket
            .on("click", ".btn-received-ticket", function (e) {
                e.stopPropagation(); // Evita que el evento se propague a otros elementos (como una fila de la tabla)

                const button = $(this); // Referencia al botón que fue clickeado
                const ticketId = button.data("ticket-id"); // Obtiene el id_ticket del atributo data-ticket-id

                if (ticketId) {
                    // Asumiendo que 'TicketData' es un array global o accesible aquí
                    // que contiene todos los detalles de los tickets cargados.
                    const selectedTicketDetails = TicketData.find(
                        (t) => t.id_ticket == ticketId
                    );

                    if (selectedTicketDetails) {
                        // Obtener el nro_ticket de los detalles del ticket
                        const currentnroTicket = selectedTicketDetails.nro_ticket;
                        const serialPos = selectedTicketDetails.serial_pos || "No disponible";
                        // Llama a la función showConfirmationModalForReceived
                        showConfirmationModalForReceived(ticketId, currentnroTicket, serialPos);
                    } else {
                        console.error(`Error: No se encontraron detalles para el ticket ID: ${ticketId}`);
                        // Opcional: Mostrar un SweetAlert2 de error al usuario
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudieron cargar los detalles del ticket. Intente de nuevo.',
                            color: 'black'
                        });
                    }
                } else {
                    console.error("Error: ticketId no encontrado en el botón .btn-received-ticket");
                }
            });

            // ************* INICIO: LÓGICA PARA TRUNCAR/EXPANDIR TEXTO *************
            $("#tabla-ticket tbody")
              .off("click", ".truncated-cell, .expanded-cell") // Usa .off() para evitar múltiples listeners
              .on("click", ".truncated-cell, .expanded-cell", function (e) {
                e.stopPropagation(); // Evita que el clic en la celda active el clic de la fila completa
                const $cellSpan = $(this);
                const fullText = $cellSpan.data("full-text");

                if ($cellSpan.hasClass("truncated-cell")) {
                  $cellSpan
                    .removeClass("truncated-cell")
                    .addClass("expanded-cell");
                  $cellSpan.text(fullText);
                } else {
                  $cellSpan
                    .removeClass("expanded-cell")
                    .addClass("truncated-cell");
                  const displayLength = 25;
                  if (fullText.length > displayLength) {
                    $cellSpan.text(
                      fullText.substring(0, displayLength) + "..."
                    );
                  } else {
                    $cellSpan.text(fullText);
                  }
                }
              });
            // ************* FIN: LÓGICA PARA TRUNCAR/EXPANDIR TEXTO *************
          }, // Fin de initComplete
        });

        if ($.fn.tooltip) {
          $('[data-bs-toggle="tooltip"]').tooltip("dispose");
          $('[data-bs-toggle="tooltip"]').tooltip();
        }

        $("#tabla-ticket").resizableColumns();

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

            const ticketId = rowData[0];

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
                    "/public/img/consulta_rif/POS/mantainment.png";
                  imgElement.alt = "Serial no disponible";
                }
              }
            } else {
              detailsPanel.innerHTML =
                "<p>No se encontraron detalles para este ticket.</p>";
            }
          });

        // --- Lógica de Event Listeners para los botones de acción específicos (Delegación de eventos) ---

        // Listener para el botón "Cargar Img Exoneracion"
        $("#tabla-ticket tbody")
          .off("click", ".btn-exoneracion-img")
          .on("click", ".btn-exoneracion-img", function (e) {
            e.stopPropagation();
            const ticketId = $(this).data("ticket-id");
            const documentType = $(this).data("document-type"); // 'exoneracion'
            if (uploadDocumentModalInstance) {
              // Aquí podrías configurar el modal de subida antes de mostrarlo
              // Por ejemplo, establecer el ticketId y el tipo de documento en algún campo oculto del modal
              $("#uploadDocumentModal").data("ticket-id", ticketId);
              $("#uploadDocumentModal").data("document-type", documentType);
              uploadDocumentModalInstance.show(); // Abre el modal de subida
            }
          });

        // Listener para el botón "Cargar PDF de pago"
        $("#tabla-ticket tbody")
          .off("click", ".btn-pago-pdf")
          .on("click", ".btn-pago-pdf", function (e) {
            e.stopPropagation();
            const ticketId = $(this).data("ticket-id");
            const documentType = $(this).data("document-type"); // 'pago'
            if (uploadDocumentModalInstance) {
              $("#uploadDocumentModal").data("ticket-id", ticketId);
              $("#uploadDocumentModal").data("document-type", documentType);
              uploadDocumentModalInstance.show(); // Abre el modal de subida
            }
          });

        // Listener para el botón "Cargar PDF ZOOM"
        $("#tabla-ticket tbody")
          .off("click", ".btn-zoom-pdf")
          .on("click", ".btn-zoom-pdf", function (e) {
            e.stopPropagation();
            const ticketId = $(this).data("ticket-id");
            const documentType = $(this).data("document-type"); // 'zoom'
            if (uploadDocumentModalInstance) {
              $("#uploadDocumentModal").data("ticket-id", ticketId);
              $("#uploadDocumentModal").data("document-type", documentType);
              uploadDocumentModalInstance.show(); // Abre el modal de subida
            }
          });

        // Listener para el botón "Ver Documento"
        $("#tabla-ticket tbody")
          .off("click", ".btn-view-document")
          .on("click", ".btn-view-document", function (e) {
            e.stopPropagation();
            const ticketId = $(this).data("ticket-id");
            const documentType = $(this).data("document-type");
            const fileUrl = $(this).data("file-url"); // URL del archivo a visualizar
            if (viewDocumentModalInstance) {
              // Configurar el modal de visualización con el ticketId, fileUrl y documentType
              $("#viewDocumentModal").data("ticket-id", ticketId);
              $("#viewDocumentModal").data("document-type", documentType);
              $("#viewDocumentModal").data("file-url", fileUrl);
              // Asume que tienes una función para cargar el contenido en el modal de visualización
              loadDocumentIntoViewModal(fileUrl, documentType);
              viewDocumentModalInstance.show(); // Abre el modal de visualización
            }
          });

        // Listener para el botón de la llave inglesa (Enviar a Taller)
        $("#tabla-ticket tbody")
          .off("click", ".btn-wrench-custom")
          .on("click", ".btn-wrench-custom", function (e) {
            e.stopPropagation();
            const ticketId = $(this).data("ticket-id");
            const nroTicket = $(this).data("nro_ticket");
            const id_document = $(this).data("id_document");
            const pdfZoomUrl = $(this).data("url_zoom") || "";
            const imgExoneracionUrl = $(this).data("url_exo") || "";
            const pdfPagoUrl = $(this).data("url_pago") || "";
            const serialPos = $(this).data("serial_pos") || "No disponible";
            const estado = $(this).data("estado");

            currentTicketId = ticketId; // Asigna al currentTicketId para el modal de taller
            currentnroTicket = nroTicket;
            currentSerial = serialPos; // Asigna el serial al currentSerial
            currentDocument = id_document; // Asigna el serial al currentSerial
            currentEstado = estado; // Asigna el estado al currentSerial

            url_envio = pdfZoomUrl;
            url_exoneracion = imgExoneracionUrl;
            url_pago = pdfPagoUrl;

            if (actionSelectionModalInstance) {
              actionSelectionModalInstance.show(); // Abre el modal de selección de acción
            } else {
              console.error(
                "No se pudo inicializar el modal: actionSelectionModalElement o Bootstrap Modal no están disponibles."
              );
            }
          });

       $("#ButtonSendToTaller").off("click").on("click", function () {
    const id_document = currentDocument;
    let showButton = false;

    // NUEVO: Verificar si es de estados que no necesitan envío
    const isEstadoSinEnvio = currentEstado && ['Miranda', 'Caracas', 'Distrito Capital', 'Vargas'].includes(currentEstado);

    console.log("Estado:", currentEstado, "Es estado sin envío:", isEstadoSinEnvio, "ID Document:", id_document);

    // Caso 1: id_documento es 9
    // Se cumple si id_document es 9 O si TODAS las URLs están vacías
    if (id_document === 9 || (url_envio === "" && url_exoneracion === "" && url_pago === "")) {
        showButton = true;
    } 
    // Caso 2: id_documento es 10
    // Para estados que SÍ necesitan envío
    else if (id_document === 10 && !isEstadoSinEnvio && url_envio !== "" && (url_pago === "" || url_exoneracion === "")) {
        showButton = true;
    } 
    // Caso 2b: id_documento es 10 para estados SIN envío
    // Solo validar exoneración o anticipo, NO envío
    else if (id_document === 10 && isEstadoSinEnvio && (url_pago === "" || url_exoneracion === "")) {
        showButton = true;
    }
    // Caso 3: id_documento es 11
    // Se cumple si id_document es 11 Y url_envio está vacía Y (url_exoneracion O url_pago NO están vacías)
    else if (id_document === 11 && url_envio === "" && (url_exoneracion !== "" || url_pago !== "")) {
        showButton = true;
    }

    // Caso 4: id_documento es 6 (Anticipo Aprobado)
    // Para estados que SÍ necesitan envío
    else if(id_document === 6 && !isEstadoSinEnvio && url_envio == "" && url_pago != "") { 
        showButton = true;
    }
    // Para estados SIN envío, NO mostrar advertencia si solo falta envío

    // Caso 5: id_documento es 4 (Exoneración Aprobada)
    // Para estados que SÍ necesitan envío
    else if(id_document === 4 && !isEstadoSinEnvio && url_envio == "" && url_exoneracion != "") {
        showButton = true;
    }
    // Para estados SIN envío, NO mostrar advertencia si solo falta envío

    // Caso 6: id_documento es 6 (Anticipo Aprobado) para TODOS los estados
    // Solo mostrar advertencia si falta el documento de anticipo
    else if(id_document === 6 && url_pago == "") { 
        showButton = true;
    }

    // Caso 7: id_documento es 4 (Exoneración Aprobada) para TODOS los estados
    // Solo mostrar advertencia si falta el documento de exoneración
    else if(id_document === 4 && url_exoneracion == "") {
        showButton = true;
    }

    console.log("ShowButton será:", showButton);

    if (showButton) {
        Swal.fire({
            icon: 'warning',
            title: '¡Advertencia!',
            text: 'Antes de enviar el equipo al taller, debe cargar los documentos.',
            confirmButtonText: 'Ok', 
            confirmButtonColor: '#003594', // Color del botón
            color: 'black',
        });
        return;
            }else if (id_document == 5 || id_document == 7) {
              Swal.fire({
                icon: 'warning',
                title: '¡Advertencia!',
                text: ' Se encuntran documentos pendientes por revisar.',
                confirmButtonText: 'Ok', 
                confirmButtonColor: '#003594', // Color del botón
                color: 'black',
              });
              return;
            } else { 

                const modalTicketNrSpan = document.getElementById("modalTicketNr");
                const modalSerialPosSpan = document.getElementById("serialpos");
                 if (modalTicketNrSpan && currentnroTicket && modalSerialPosSpan) {
                    modalTicketNrSpan.textContent = currentnroTicket;
                    modalSerialPosSpan.textContent = currentSerial; // Asigna el serial al span del modal
                } else {
                    modalTicketNrSpan.textContent = " seleccionado"; // Texto por defecto si no se encontró el número
                    console.warn("No se pudo inyectar el número de ticket en el modal de taller.");
                }

                if (actionSelectionModalInstance) {
                  actionSelectionModalInstance.hide();
                }

                if (staticBackdropModalInstance) {

                  staticBackdropModalInstance.show();
                }
            }
          });

        // Listener para el botón "Cerrar" del modal 'actionSelectionModal'
        $("#BtnCerrarSelecionAccion")
          .off("click")
          .on("click", function () {
            if (actionSelectionModalInstance) {
              actionSelectionModalInstance.hide();
            }
          });

        // Listener para el icono de cierre del modal 'staticBackdrop'
        $("#Close-icon")
          .off("click")
          .on("click", function () {
            if (staticBackdropModalInstance) {
              staticBackdropModalInstance.hide();
            }
          });

        // Listener para el botón "Cerrar" del modal 'staticBackdrop'
        $("#close-button")
          .off("click")
          .on("click", function () {
            if (staticBackdropModalInstance) {
              staticBackdropModalInstance.hide();
            }
          });

        // Listener para el botón "Enviar al Taller" dentro del modal'staticBackdrop'
        $("#devolver")
          .off("click")
          .on("click", function () {
            const id_document=currentDocument;
            const modalTicketNrSpan = document.getElementById("SerialLabel");

            if (modalTicketNrSpan && currentSerial) {
              modalTicketNrSpan.textContent = currentSerial; // Asigna el serial al span del modal
            } else {
              modalTicketNrSpan.textContent = "Hay un error"; // Texto por defecto si no se encontró el número
            }
                    if(id_document == 9 || id_document == 11) { 
                        Swal.fire({
                        icon: 'warning',
                        title: '¡Advertencia!',
                        text: 'Antes de Devolver el equipo al Rosal, debe cargar al menos el ZOOM de envio.',
                        confirmButtonText: 'Ok', 
                        confirmButtonColor: '#003594', // Color del botón
                        color: 'black',
                      });
                      return;
                    /*}else if (id_document == 5 || id_document == 7) {
                      Swal.fire({
                        icon: 'warning',
                        title: '¡Advertencia!',
                        text: 'Tiene documentos pendientes por revisar.',
                        confirmButtonText: 'Ok', 
                        confirmButtonColor: '#003594', // Color del botón
                        color: 'black',
                      });*/
                      return;
                    } else {
                      if (actionSelectionModalInstance) {
                        actionSelectionModalInstance.hide();
                      }
                    }

            // 2. Mostrar el tercer modal (staticBackdrop - el modal de "Ticket enviado al Taller.")
            if (modaldevolucion) {
              modaldevolucion.show();
            }

        

            $("#BttonCloseModalDevolucion")
              .off("click")
              .on("click", function () {
                if (modaldevolucion) {
                  modaldevolucion.hide();
                }
              });

           // Listener para el botón "Confirmar Devolución" dentro del modal de devolución
            $("#confirmDevolverCliente")
                .off("click")
                .on("click", function () {
                    if (modaldevolucion) {
                        SendToDevolution(currentTicketId, currentnroTicket, currentSerial); // <--- Usa la variable ya asignada
                    }
                });
                    
          });
      } else {
        console.warn(
          "No se encontraron tickets o la respuesta no fue exitosa."
        );
        tbody.innerHTML =
          '<tr><td colspan="8" class="text-center">No hay tickets disponibles.</td></tr>';
        if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
          hideTicketStatusIndicator
          $("#tabla-ticket").DataTable().destroy(); // Destruir si ya existía para evitar errores
        }
        $("#tabla-ticket").DataTable({
          responsive: false,
          scrollX: true,
          pagingType: "simple_numbers",
          lengthMenu: [
            [5, 10],
            ["5", "10"],
          ],
          autoWidth: false,
          data: [], // Sin datos
          columns: [
            { title: "N°", orderable: false, searchable: false,
              render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
              }
            },
            { title: "Nro Ticket" },
            { title: "Serial" }, // Esta columna ahora contendrá el HTML del span
            { title: "Rif" },
            { title: "Razón Social" },
            { title: "Técnico Asignado" },
            { title: "Acción Ticket" },
            { title: "Acciones", orderable: false },
          ],
          language: {
            lengthMenu: "Mostrar _MENU_ Registros",
            //emptyTable: "No hay datos disponibles en la tabla",
            info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
            //infoEmpty: "No hay datos disponibles",
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
          },
          dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
          initComplete: function () {
            const buttonsHtml = `
                            <button id="btn-asignados" class="btn btn-primary me-2" title="Tickets ya Asignados">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                </svg>
                            </button>
                            <button id="btn-por-asignar" class="btn btn-primary me-2" title = "Enviados Taller">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                                <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>
                                </svg>
                            </button>
                            <button id="btn-recibidos" class="btn btn-secondary me-2" title="Tickets recibidos por el Técnico">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                                    <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                                </svg>
                            </button>
                             <button id="btn-devuelto" class="btn btn-secondary me-2" title="Pos devuelto a cliente">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        `;
            $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

            // Función para manejar la selección de botones (para tabla sin datos)
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
              $("#btn-devuelto")
                .removeClass("btn-primary")
                .addClass("btn-secondary");
              $(`#${activeButtonId}`)
                .removeClass("btn-secondary")
                .addClass("btn-primary");
            }
            setActiveButton("btn-asignados"); // Mantener consistente
          },
        });
      }
    })
    .catch((error) => {
      hideTicketStatusIndicator
      console.error("Error al obtener los datos del ticket:", error);
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error al cargar los datos: ${error.message}</td></tr>`;
      if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
        $("#tabla-ticket").DataTable().destroy();
      }
      $("#tabla-ticket").DataTable({
        responsive: false,
        scrollX: true,
        pagingType: "simple_numbers",
        lengthMenu: [
          [5, 10],
          ["5", "10"],
        ],
        autoWidth: false,
        data: [],
         columns: [
          { title: "N°", orderable: false, searchable: false,
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          },
          { title: "Nro Ticket" },
          { title: "Serial" }, // Esta columna ahora contendrá el HTML del span
          { title: "Rif" },
          { title: "Razón Social" },
          { title: "Acción Ticket" },
          { title: "Acciones", orderable: false },
        ],
        language: {
          lengthMenu: "Mostrar _MENU_ Registros",
          //emptyTable: "No hay datos disponibles en la tabla",
          zeroRecords: `<div class="text-center text-muted py-5">
              <div class="d-flex flex-column align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                  <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
                <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                <p class="text-muted mb-0">No hay tickets asociado al Técnico para mostrar en este momento.</p>
              </div>
            </div>`,
          info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
         // infoEmpty: "No hay datos disponibles",
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
        },
        dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
        initComplete: function () {
          const buttonsHtml = `
                        <button id="btn-asignados" class="btn btn-primary me-2" title="Tickets ya Asignados">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                        </button>
                        <button id="btn-por-asignar" class="btn btn-primary me-2" title = "Enviados Taller">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                            <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>
                            </svg>
                        </button>
                        <button id="btn-recibidos" class="btn btn-secondary me-2" title="Tickets recibidos por el Técnico">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                                <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                            </svg>
                        </button>
                         <button id="btn-devuelto" class="btn btn-secondary me-2" title="Pos devuelto a cliente">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                        </button>
                    `;
          $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);
        },
      });
    });
}

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
    const imgExoneracionUrl = $(this).data('img-exoneracion-url');
    const pdfPagoUrl = $(this).data('pdf-pago-url');
    const nro_ticket = $(this).data('nro-ticket');
    const ExoneracionFile_name = $(this).data('exo-file');
    const PagoFile_name = $(this).data('pago-file');
    const ZoomFile_name = $(this).data('zoom-file');
    const estado_cliente = $(this).data('estado-cliente');

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

    if (pdfZoomUrl && imgExoneracionUrl) {
        // Solo envío y exoneración
        modalButtonsHTML = `
            <button id="VerEnvio" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="zoom" data-file-url="${pdfZoomUrl}" data-file-name="${ZoomFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio
            </button>
            <button id="VerExo" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="exoneracion" data-file-url="${imgExoneracionUrl}" data-file-name="${ExoneracionFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Exoneración
            </button>
        `;
    } else if (pdfZoomUrl && pdfPagoUrl) {
        // Solo envío y pago
        modalButtonsHTML = `
            <button id="VerEnvio" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="zoom" data-file-url="${pdfZoomUrl}" data-file-name="${ZoomFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Envio
            </button>
            <button id="VerPago" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="pago" data-file-url="${pdfPagoUrl}" data-file-name="${PagoFile_name}" data-nro-ticket="${nro_ticket}">
                Ver Documento de Pago
            </button>
        `;
    } else if (pdfZoomUrl) {
        // Solo envío disponible
        if (debeOcultarEnvio) {
            // Estados sin envío - NO mostrar botón de envío
            modalButtonsHTML = `
                <button id="ExoBoton" class="btn btn-primary btn-block btn-exoneracion-img mb-2" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Exoneracion" data-estado-cliente="${estado_cliente}">
                    Cargar Documento de Exoneración
                </button>
                <button id="PagoBoton" class="btn btn-success btn-block btn-pago-pdf" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Anticipo" data-estado-cliente="${estado_cliente}">
                    Cargar Documento de Pago
                </button>
            `;
        } else {
            // Estados con envío - mostrar botón de envío
            modalButtonsHTML = `
                <button id="VerEnvio" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="zoom" data-file-url="${pdfZoomUrl}" data-file-name="${ZoomFile_name}" data-nro-ticket="${nro_ticket}">
                    Ver Documento de Envio
                </button>
                <button id="ExoBoton" class="btn btn-primary btn-block btn-exoneracion-img mb-2" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Exoneracion">
                    Cargar Documento de Exoneración
                </button>
                <button id="PagoBoton" class="btn btn-success btn-block btn-pago-pdf" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Anticipo">
                    Cargar Documento de Pago
                </button>
            `;
        }
    } else if (imgExoneracionUrl) {
        // Solo exoneración disponible (sin envío)
        if (debeOcultarEnvio) {
            // Estados sin envío - NO mostrar botón de envío
            modalButtonsHTML = `
                <button id="VerExo" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="exoneracion" data-file-url="${imgExoneracionUrl}" data-file-name="${ExoneracionFile_name}" data-nro-ticket="${nro_ticket}">
                    Ver Documento de Exoneración
                </button>
            `;
        } else {
            // Estados con envío - mostrar botón de envío
            modalButtonsHTML = `
                <button id="VerExo" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="exoneracion" data-file-url="${imgExoneracionUrl}" data-file-name="${ExoneracionFile_name}" data-nro-ticket="${nro_ticket}">
                    Ver Documento de Exoneración
                </button>
                <button id="EnvioBoton" class="btn btn-info btn-block btn-zoom-pdf" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Envio">
                    Cargar Documento de Envio
                </button>
            `;
        }
    } else if (pdfPagoUrl) {
        // Solo pago disponible (sin envío)
        if (debeOcultarEnvio) {
            // Estados sin envío - NO mostrar botón de envío
            modalButtonsHTML = `
                <button id="VerPago" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="pago" data-file-url="${pdfPagoUrl}" data-file-name="${PagoFile_name}" data-nro-ticket="${nro_ticket}">
                    Ver Documento de Pago
                </button>
            `;
        } else {
            // Estados con envío - mostrar botón de envío
            modalButtonsHTML = `
                <button id="VerPago" class="btn btn-secondary btn-block btn-view-document mb-2" data-ticket-id="${ticketId}" data-document-type="pago" data-file-url="${pdfPagoUrl}" data-file-name="${PagoFile_name}" data-nro-ticket="${nro_ticket}">
                    Ver Documento de Pago
                </button>
                <button id="EnvioBoton" class="btn btn-info btn-block btn-zoom-pdf" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Envio">
                    Cargar Documento de Envio
                </button>
            `;
        }
    } else {
        // Ningún documento disponible
        if (debeOcultarEnvio) {
            // Estados sin envío - NO mostrar botón de envío
            modalButtonsHTML = `
                <button id="ExoBoton" class="btn btn-primary btn-block btn-exoneracion-img mb-2" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Exoneracion" data-estado-cliente="${estado_cliente}">
                    Cargar Documento de Exoneración
                </button>
                <button id="PagoBoton" class="btn btn-success btn-block btn-pago-pdf" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Anticipo" data-estado-cliente="${estado_cliente}">
                    Cargar Documento de Pago
                </button>
            `;
        } else {
            // Estados con envío - mostrar botón de envío
            modalButtonsHTML = `
                <button id="EnvioBoton" class="btn btn-info btn-block btn-zoom-pdf mb-2" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Envio">
                    Cargar Documento de Envio
                </button>
                <button id="ExoBoton" class="btn btn-primary btn-block btn-exoneracion-img mb-2" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Exoneracion">
                    Cargar Documento de Exoneración
                </button>
                <button id="PagoBoton" class="btn btn-success btn-block btn-pago-pdf" data-ticket-id="${ticketId}" data-status-payment="${statusPayment}" data-document-type="Anticipo">
                    Cargar Documento de Pago
                </button>
            `;
        }
    }

    buttonsContainer.html(modalButtonsHTML);
    documentActionsModal.show();
});

// Función para determinar el estatus según el tipo de documento y estado del cliente
function getStatusForDocument(documentType, estadoCliente) {
    const estadosSinEnvio = ['Caracas', 'Miranda', 'Vargas', 'Distrito Capital'];
    const debeOcultarEnvio = estadosSinEnvio.includes(estadoCliente);
    
    if (debeOcultarEnvio) {
        // Estados sin envío - usar estatus específicos
        switch(documentType) {
            case 'Exoneracion':
                return 5; // "Exoneracion Pendiente por Revision"
            case 'Anticipo':
                return 7; // "Pago Anticipo Pendiente por Revision"
            default:
                return 11; // "Pendiente Por Cargar Documento(PDF Envio ZOOM)"
        }
    } else {
        // Estados con envío - usar estatus estándar
        return 11; // "Pendiente Por Cargar Documento(PDF Envio ZOOM)"
    }
}

// Uso en los botones de carga
$(document).on('click', '.btn-exoneracion-img, .btn-pago-pdf, .btn-zoom-pdf', function() {
    const documentType = $(this).data('document-type');
    const estadoCliente = $(this).data('estado-cliente');
    const ticketId = $(this).data('ticket-id');
    
    // Obtener el estatus correcto
    const nuevoEstatus = getStatusForDocument(documentType, estadoCliente);
    
    console.log(`Documento: ${documentType}, Estado: ${estadoCliente}, Nuevo Estatus: ${nuevoEstatus}`);
    
    // Aquí puedes enviar el nuevo estatus al backend
    // updateTicketStatus(ticketId, nuevoEstatus);
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

    // Si no tenemos la URL, obtener el documento desde la API
    if (documentType && nroTicket) {
        // Determinar el tipo de documento para la API
        let apiDocumentType = '';
        switch(documentType) {
            case 'zoom':
                apiDocumentType = 'Envio';
                break;
            case 'exoneracion':
                apiDocumentType = 'Exoneracion';
                break;
            case 'pago':
                apiDocumentType = 'Anticipo';
                break;
            case 'exoneracion_pago':
                // Para este caso, mostrar un modal de selección
                showDocumentSelectionModal(ticketId, nroTicket);
                return;
            default:
                apiDocumentType = documentType;
        }

        // Llamar a la API para obtener el documento
        fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetDocumentByType`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=GetDocumentByType&ticketId=${nroTicket}&documentType=${apiDocumentType}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.document) {
                const document = data.document;
                const filePath = document.file_path;
                const mimeType = document.mime_type;
                const fileName = document.original_filename;

                // Determinar si es imagen o PDF
                if (mimeType.startsWith('image/')) {
                    showViewModal(ticketId, nroTicket, filePath, null, fileName);
                } else if (mimeType === 'application/pdf') {
                    showViewModal(ticketId, nroTicket, null, filePath, fileName);
                } else {
                    showViewModal(ticketId, nroTicket, null, null, "Tipo de documento no soportado");
                }
            } else {
              hideTicketStatusIndicator
                Swal.fire({
                    icon: 'warning',
                    title: 'Documento no encontrado',
                    text: 'No se pudo obtener el documento solicitado.',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#003594'
                });
            }
        })
        .catch(error => {
          hideTicketStatusIndicator
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener el documento del servidor.',
                confirmButtonText: 'Ok',
                color: 'black',
                confirmButtonColor: '#003594'
            });
        });
    } else {
      hideTicketStatusIndicator
        Swal.fire({
            icon: 'warning',
            title: 'Información incompleta',
            text: 'No se pudo determinar qué documento mostrar.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
    }
   });

// Función para mostrar el modal de selección de documento
function showDocumentSelectionModal(ticketId, nroTicket) {
    Swal.fire({
        title: 'Seleccionar tipo de documento',
        html: `
            <div class="text-left">
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="documentType" id="radioEnvio" value="Envio">
                    <label class="form-check-label" for="radioEnvio">Documento de Envío</label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="documentType" id="radioExoneracion" value="Exoneracion">
                    <label class="form-check-label" for="radioExoneracion">Documento de Exoneración</label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="documentType" id="radioAnticipo" value="Anticipo">
                    <label class="form-check-label" for="radioAnticipo">Documento de Pago/Anticipo</label>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Ver Documento',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#003594',
        cancelButtonColor: '#6c757d',
        color: 'black',
        preConfirm: () => {
            const selectedType = document.querySelector('input[name="documentType"]:checked');
            if (!selectedType) {
                Swal.showValidationMessage('Por favor selecciona un tipo de documento');
                return false;
            }
            return selectedType.value;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Obtener el documento seleccionado
            fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetDocumentByType`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=GetDocumentByType&ticketId=${nroTicket}&documentType=${result.value}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.document) {
                    const document = data.document;
                    const filePath = document.file_path;
                    const mimeType = document.mime_type;
                    const fileName = document.original_filename;

                    // Determinar si es imagen o PDF
                    if (mimeType.startsWith('image/')) {
                        showViewModal(ticketId, nroTicket, filePath, null, fileName);
                    } else if (mimeType === 'application/pdf') {
                        showViewModal(ticketId, nroTicket, null, filePath, fileName);
                    } else {
                        showViewModal(ticketId, nroTicket, null, null, "Tipo de documento no soportado");
                    }
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Documento no encontrado',
                        text: 'No se encontró el documento seleccionado.',
                        confirmButtonText: 'Ok',
                        color: 'black',
                        confirmButtonColor: '#003594'
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener el documento.',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#003594'
                });
            });
        }
    });
}

// Función corregida para mostrar el modal de visualización
function showViewModal(ticketId, nroTicket, imageUrl, pdfUrl, documentName) {
    // Verificar que el modal existe antes de continuar
    const modalElementView = document.getElementById("viewDocumentModal");
    if (!modalElementView) {
        console.error("Error: No se encontró el modal 'viewDocumentModal'");
        Swal.fire({
            icon: 'error',
            title: 'Error del Sistema',
            text: 'No se pudo abrir el modal de visualización.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    // Verificar que todos los elementos necesarios existen
    const modalTicketIdSpanView = modalElementView.querySelector("#viewModalTicketId");
    const imageViewPreview = document.getElementById("imageViewPreview");
    const pdfViewViewer = document.getElementById("pdfViewViewer");
    const messageContainer = document.getElementById("viewDocumentMessage");
    const nameDocumento = document.getElementById("NombreImage");

    // Verificar que los elementos críticos existen
    if (!modalTicketIdSpanView || !imageViewPreview || !pdfViewViewer || !messageContainer || !nameDocumento) {
        console.error("Error: Faltan elementos necesarios en el modal");
        Swal.fire({
            icon: 'error',
            title: 'Error del Sistema',
            text: 'El modal no está configurado correctamente.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    // Limpiar contenido previo
    imageViewPreview.style.display = "none";
    pdfViewViewer.style.display = "none";
    pdfViewViewer.innerHTML = "";
    messageContainer.textContent = "";
    messageContainer.classList.add("hidden");

    // Configurar información del ticket
    modalTicketIdSpanView.textContent = nroTicket || ticketId;
    nameDocumento.textContent = documentName || 'Documento';

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
        return `http://localhost/Documentos/${cleanPath}`;
    }

    // DETERMINAR QUÉ MOSTRAR BASÁNDOSE EN LOS PARÁMETROS
    if (imageUrl) {
        // Es una imagen
        const fullUrl = cleanFilePath(imageUrl);
        imageViewPreview.src = fullUrl;
        imageViewPreview.style.display = "block";
        
        // Manejar errores de carga de imagen
        imageViewPreview.onerror = function() {
            messageContainer.textContent = "Error al cargar la imagen.";
            messageContainer.classList.remove("hidden");
            imageViewPreview.style.display = "none";
        };

    } else if (pdfUrl) {
        // Es un PDF
        const fullUrl = cleanFilePath(pdfUrl);
        pdfViewViewer.innerHTML = `<iframe src="${fullUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
        pdfViewViewer.style.display = "block";
        
        // Manejar errores de carga de PDF
        const iframe = pdfViewViewer.querySelector('iframe');
        if (iframe) {
            iframe.onerror = function() {
                messageContainer.textContent = "Error al cargar el PDF.";
                messageContainer.classList.remove("hidden");
                pdfViewViewer.style.display = "none";
            };
        }
        
    } else {
        // No hay documento
        messageContainer.textContent = "No hay documento disponible para este ticket.";
        messageContainer.classList.remove("hidden");
    }

    // Mostrar el modal usando Bootstrap
    try {
        const viewDocumentModal = new bootstrap.Modal(modalElementView);
        viewDocumentModal.show();

        const buttonCerrarModal = document.getElementById("CerrarModalVizualizar");
        if (buttonCerrarModal) {
            buttonCerrarModal.addEventListener("click", function() {
                viewDocumentModal.hide();
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

// 5. Previsualización de la imagen
$('#documentFile').on('change', function(event) {
  const [file] = event.target.files;
  const preview = $('#imagePreview');
  if (file) {
    preview.attr('src', URL.createObjectURL(file)).show();
  } else {
    preview.hide();
 }
});

// 6. Manejador de eventos para el botón de "Subir" dentro del modal de subida
$(document).on('click', '#uploadFileBtn', function() {
  const fileInput = $('#documentFile')[0];
  const documentType = $('#uploadForm').data('document-type');
  const ticketId = $('#uploadForm').data('ticket-id');
  const ticketNumber = $('#uploadForm').data('nro-ticket');
  const uploadDocumentModalElement = document.getElementById("uploadDocumentModal");
  const id_ticket = $('#uploadForm').data('ticket-id');

  if (!fileInput.files || fileInput.files.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: '¡Advertencia!',
      text: 'Por favor, selecciona un archivo antes de continuar.',
      confirmButtonText: 'Ok', 
      confirmButtonColor: '#003594',
      color: 'black',
    });
    return;
  }
  const uploadModalBootstrap = new bootstrap.Modal(uploadDocumentModalElement,{ backdrop: "static" });
  // Llamar directamente a la función sin crear otro listener
  handleUploadButtonClick(ticketId, documentType, uploadModalBootstrap, ticketNumber);
});

$(document).on('click', '#CerrarBoton', function() {
    // 1. Oculta el modal de visualización actual
    uploadDocumentModal.hide();
    viewDocumentModal.hide();

    // 2. Muestra el modal de acciones de nuevo
    // Usamos un pequeño retraso para evitar problemas de superposición y animaciones
    setTimeout(() => {
        documentActionsModal.show();
    }, 300);
});

function showConfirmationModalForReceived(ticketId, currentnroTicket, serialPos) {
  const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
  Swal.fire({
    title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
              <div class="custom-modal-header-content">Confirmación de recibido</div>
            </div>`,
    html: `
        <div class="custom-modal-body-content">
            <div class="mb-4">
                ${customWarningSvg}
            </div>
            <p class="h4 mb-3">¿Marcar el Pos asociado <span style = "display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> al ticket Nro:<span style = "display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${currentnroTicket}</span>como recibido?</p>
            <p class="h5 text-muted">Esta acción registrará la fecha de recepción y habilitará la opción Envío a Taller.</p>
        </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Recibir Pos",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#003594",
    customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
        // header: 'custom-swal-header', // This is usually not needed unless you want to style the _container_ of the title
        title: 'custom-swal-title', // Apply your desired styling directly to the title's content via this class
        content: 'custom-swal-content',
        actions: 'custom-swal-actions',
        confirmButton: 'btn btn-primary btn-lg custom-confirm-button',
        cancelButton: 'btn btn-secondary btn-lg custom-cancel-button',
    },
    showConfirmButton: true,
    showLoaderOnConfirm: true,
    showCloseButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    focusConfirm: false,

}).then((result) => {
    if (result.isConfirmed) {
        handleMarkTicketReceived(ticketId, currentnroTicket);
    }
});
}

// --- FUNCIÓN PARA MANEJAR LA LÓGICA DE MARCAR COMO RECIBIDO ---
function handleMarkTicketReceived(ticketId, currentnroTicket) {
  const id_user = document.getElementById("id_user").value;
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/historical/markReceivedTechnical`
  ); // Necesitas una nueva ruta de API para esto
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          Swal.fire({
                title: "¡Recibido!",
                html: `El Pos asociado al ticket Nro: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${currentnroTicket}</span> ha sido marcado como recibido.`, // <-- CAMBIO AQUÍ
                icon: "success",
                color: "black",
                confirmButtonColor: "#003594",
            });
          getTicketData(); // Volver a cargar la tabla para reflejar los cambios
        } else {
          Swal.fire(
            "Error",
            response.message ||
              "Hubo un error al marcar el ticket como recibido.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Error al procesar la respuesta del servidor.",
          "error"
        );
        console.error("Error parsing JSON for markTicketAsReceived:", error);
      }
    } else {
      Swal.fire(
        "Error",
        `Error al conectar con el servidor: ${xhr.status} ${xhr.statusText}`,
        "error"
      );
      console.error(
        "Error en markTicketAsReceived:",
        xhr.status,
        xhr.statusText
      );
    }
  };
  xhr.onerror = function () {
    Swal.fire(
      "Error",
      "Error de red al intentar marcar el ticket como recibido.",
      "error"
    );
    console.error("Network error for markTicketAsReceived");
  };

  const data = `action=markReceivedTechnical&id_ticket=${ticketId}&id_user=${encodeURIComponent(
    id_user
  )}`;
  xhr.send(data);
}

// ===============================================
// Lógica para el Modal de Carga de Documentos (uploadDocumentModal)
// ===============================================

function openUploadModal(ticketId, documentType) {
  const uploadDocumentModalElement = document.getElementById(
    "uploadDocumentModal"
  );
  const modalTicketIdSpan = document.getElementById("modalTicketId");
  const documentFileInput = document.getElementById("documentFile");
  const imagePreview = document.getElementById("imagePreview");
  const uploadMessage = document.getElementById("uploadMessage");
  const uploadFileBtn = document.getElementById("uploadFileBtn");

  if (
    uploadDocumentModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    const uploadModalBootstrap = new bootstrap.Modal(
      uploadDocumentModalElement,
      { backdrop: "static" }
    );

    // Limpiar el formulario y mensajes previos
    documentFileInput.value = ""; // Limpiar el input file
    imagePreview.style.display = "none"; // Ocultar previsualización
    imagePreview.src = "#"; // Restablecer la fuente de la imagen
    uploadMessage.classList.add("hidden"); // Ocultar mensaje
    uploadMessage.textContent = ""; // Limpiar texto del mensaje

    // Establecer el ID del ticket en el modal
    modalTicketIdSpan.textContent = ticketId;

    // Mostrar el modal
    uploadModalBootstrap.show();

    // Eliminar listeners previos para evitar duplicados
    documentFileInput.removeEventListener("change", handleFileSelectForUpload);
    uploadFileBtn.removeEventListener("click", handleUploadButtonClick);

    // Añadir el listener para previsualizar la imagen seleccionada
    documentFileInput.addEventListener("change", handleFileSelectForUpload);

    // Añadir listener para el botón "Subir"
    // Usa una función anónima para pasar documentType y ticketId
    uploadFileBtn.addEventListener("click", function () {
      handleUploadButtonClick(ticketId, documentType, uploadModalBootstrap, ticketNumber);
    });
  } else {
    console.error(
      "No se pudo inicializar el modal de carga: uploadDocumentModalElement o Bootstrap Modal no están disponibles."
    );
  }
}

function handleFileSelectForUpload(event) {
  const file = event.target.files[0];
  const imagePreview = document.getElementById("imagePreview");
  const uploadMessage = document.getElementById("uploadMessage");

  imagePreview.style.display = "none";
  uploadMessage.classList.add("hidden");
  uploadMessage.textContent = "";

  if (file) {
    const fileType = file.type;
    if (fileType.startsWith("image/") || fileType === "application/pdf") {
      if (fileType.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else if (fileType === "application/pdf") {
        // Para PDFs, no hay previsualización de imagen directa
        imagePreview.style.display = "none";
        uploadMessage.textContent =
          "PDF seleccionado. No se muestra previsualización.";
        uploadMessage.classList.remove("hidden");
      }
    } else {
      uploadMessage.textContent =
        "Tipo de archivo no permitido. Seleccione una imagen o un PDF.";
      uploadMessage.classList.remove("hidden");
      event.target.value = ""; // Limpiar el input file
      imagePreview.style.display = "none";
    }
  }
}

async function handleUploadButtonClick(ticketId, documentType, uploadModalBootstrap, ticketNumber) {
    const id_user = document.getElementById("userId").value;
    const documentFileInput = document.getElementById("documentFile");
    const uploadMessage = document.getElementById("uploadMessage");
    const file = documentFileInput.files[0];

    // Clear previous messages and check for file
    uploadMessage.classList.add("hidden");
    uploadMessage.textContent = "";

    if (!file) {
        Swal.fire({
            icon: 'warning',
            title: '¡Advertencia!',
            text: 'Por favor, selecciona un archivo antes de continuar.',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#003594',
            color: 'black',
        });
        return;
    }

    // 1. Create a FormData object to handle the file upload.
    const formData = new FormData();
    formData.append("action", "uploadDocument");
    formData.append("ticket_id", ticketId);
    formData.append("nro_ticket", ticketNumber); // Añadir el número de ticket
    formData.append("document_type", documentType);
    
    // 2. Append the file object directly. Do NOT use encodeURIComponent().
    formData.append("document_file", file); 
    formData.append("id_user", id_user);

    const xhr = new XMLHttpRequest();
    const url = `${ENDPOINT_BASE}${APP_PATH}api/reportes/uploadDocumentTec`;

    xhr.open("POST", url);

    // 3. Remove the Content-Type header. The browser will set the correct one (multipart/form-data) automatically.
    //\\ xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // <-- REMOVE THIS LINE

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let result;
            try {
                result = JSON.parse(xhr.responseText);
            } catch (e) {
                result = { success: false, message: 'Error de respuesta del servidor.' };
            }

            if (xhr.status === 200 && result.success) {
              Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: result.message,
                confirmButtonColor: '#003594',
                confirmButtonText: 'Ok',
                color: 'black',
              }).then((result) => {
                window.location.reload();
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Error al subir el documento.',
                confirmButtonColor: '#003594',
              });
            }
        }
    };
    
    xhr.onerror = function() {
        Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'Error de red o del servidor al subir el documento.',
            confirmButtonColor: '#003594',
        });
    }
    // 4. Send the FormData object.
    xhr.send(formData);
}

// Llama a la función para cargar los datos cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", getTicketData);

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
                          ${d.fecha_instalacion || 'No posee'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Fecha de último ticket:</div></strong>
                          ${d.fecha_cierre_anterior ||  'No posee'}
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
                        <div class="col-sm-6 mb-2">
                          <button type="button" class="btn btn-link p-0" id="hiperbinComponents" data-id-ticket = ${d.id_ticket}" data-serial-pos = ${d.serial_pos}>
                            <i class="bi bi-box-seam-fill me-1"></i> Cargar Componentes del Dispositivo
                          </button>
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


document.addEventListener("DOMContentLoaded", function () {

  const cerrar = document.getElementById("close-button");

  // CAMBIO AQUI: Usa un nombre diferente para la variable del botón, por ejemplo, `sendToTallerButton`
  const sendToTallerButton = document.getElementById("SendToTaller-button");

  // Agrega el event listener al botón cerrar
  if (cerrar) {
    // Siempre es buena práctica verificar si el elemento existe antes de añadir un listener
    cerrar.addEventListener("click", function () {
      if (modalInstance) {
        modalInstance.hide();
        currentTicketId = null;
      }
      document.getElementById("idSelectionTec").value = "";
    });
  } else {
    console.error("Elemento con ID 'close-button' no encontrado.");
  }

  // Agrega el event listener al botón "Enviar a Taller"
  if (sendToTallerButton) {
    sendToTallerButton.addEventListener("click", handleSendToTallerClick); // Llama a una función con otro nombre
  } else {
    console.error(
      "Elemento con ID 'SendToTaller-button' no encontrado. Esto está causando el TypeError."
    );
  }
});

// CAMBIO AQUI: Renombra la función para que no haya conflicto con el nombre de la variable del botón
function handleSendToTallerClick() {
  const idTicket = currentTicketId; // Usa la variable global para obtener el ID del ticket
  const nroticket = currentnroTicket;
  const serialpos = currentSerial; // Asegúrate de que esta variable esté definida en tu contexto

  if (idTicket) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToTaller`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        Swal.fire({
            icon: "success",
            title: "¡Notificación!", // <-- FIX IS HERE
            html:`El POS asociado <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialpos}</span> al ticket Nro: <span style="border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroticket}</span> fue enviado a Taller`,
            color: "black",
            // Eliminamos 'timer' y 'timerProgressBar' si quieres un botón explícito
            showConfirmButton: true, // Muestra el botón de confirmación
            confirmButtonText: "Ok", // Texto del botón
            confirmButtonColor: "#003594", // Color del botón (puedes ajustar)
            allowOutsideClick: false, // Opcional: para que el usuario DEBA hacer clic en el botón
            allowEscapeKey: false,   // Opcional: para que no se pueda cerrar con la tecla Escape
            didOpen: () => {
            }
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload(); // Recarga la página
            }
        });
            if (staticBackdropModalInstance) {
            staticBackdropModalInstance.hide(); // Cierra el modal "Deseas Enviar al Taller"
        
            getTicketData(); 
        } else {
          alert("Error al enviar el ticket: " + response.message);
        }
      } else {
        alert("Error de conexión: " + xhr.statusText);
      }
    };
    xhr.onerror = function () {
      alert("Error de red");
    };

    const data = `action=SendToTaller&id_ticket=${encodeURIComponent(
      idTicket
    )}`;
    xhr.send(data);
  } else {
    alert("Por favor, selecciona un ticket.");
  }
}

function SendToDevolution(ticketId, currentnroTicket, currentSerial) {
    const id_user = document.getElementById('userId').value;

    if (!ticketId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el ID del ticket para la devolución. Por favor, intente nuevamente.',
            confirmButtonText: 'Aceptar',
            color: 'black',
            confirmButtonColor: '#3085d6',
        });
        return;
    }

    const observaciones = $('#observacionesDevolver').val();

    if (observaciones=='') {

        Swal.fire({
            icon: 'warning',
            title: '¡Advertencia!',
            text: 'El campo no puede estar en blanco.',
            confirmButtonText: 'Ok', 
            confirmButtonColor: '#003594', // Color del botón
            color: 'black',
        });
        return;

    } else { 
    const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
    Swal.fire({ 
        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
          <div class="custom-modal-header-content">Confirmación Devolución</div>
          </div>
        `,
         html: `<div class="custom-modal-body-content">
                      <div class="mb-4">
                        ${customWarningSvg}
                      </div> 
                      <p class="h4 mb-3">Realmente deseas devolver el Pos: <span  style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${currentSerial}</span> asociado al Nro Ticket: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${currentnroTicket}</span> al cliente?</p>`,
        showCancelButton: true,
        confirmButtonColor: '#003594',
        cancelButtonColor: '#A0A0A0',
        confirmButtonText: 'Devolver',
        cancelButtonText: 'Cancelar',
        color: 'black',
    }).then((result) => {
        if (result.isConfirmed) {
            $('#confirmDevolverCliente').prop('disabled', true);
            Swal.fire({
                title: 'Devolviendo...',
                text: 'Por favor, espere mientras se procesa la devolución.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/DevolverCliente`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = function () {
                Swal.close();
                $('#confirmDevolverCliente').prop('disabled', false);

                if (xhr.status >= 200 && xhr.status < 300) {
                    // Si el status es 2xx, siempre intentamos parsear la respuesta JSON
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Devolución Exitosa!',
                                html:'<span style = "border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">El ticket reposa en Gestión Rosal para poder ser entregado al cliente</span>.',
                                confirmButtonText: 'Ok',
                                color: 'black',
                                confirmButtonColor: '#003594',
                                focusConfirm: false,
                                allowOutsideClick: false, 
                                allowEscapeKey: false,
                            }).then(() => {
                              window.location.reload(); // Recarga la página inmediatamente
                            });
                        } else {
                            // Si 'success' es false, es un error lógico de negocio (ej. "campo vacío" desde el backend)
                            Swal.fire({
                                icon: 'error',
                                title: 'Error en la Devolución',
                                text: response.message || 'Hubo un error al intentar devolver el ticket.',
                                confirmButtonText: 'Cerrar'
                            });
                        }
                    } catch (e) {
                        // Error al parsear JSON (respuesta no JSON válida)
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de Respuesta',
                            text: 'El servidor respondió con un formato inválido. Por favor, intente de nuevo.',
                            footer: `<small>Detalle: ${e.message}</small>`,
                            confirmButtonText: 'Cerrar'
                        });
                        console.error('Error al parsear JSON:', e, xhr.responseText);
                    }
                } else {
                    // Si el status no es 2xx (ej. 400 Bad Request, 500 Internal Server Error)
                    // Intentamos parsear la respuesta JSON para obtener el mensaje de error del backend
                    let errorMessage = `Hubo un problema con la solicitud (Código: ${xhr.status}). Por favor, intente de nuevo.`;
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        if (errorResponse && errorResponse.message) {
                            errorMessage = errorResponse.message; // Usar el mensaje del backend
                        }
                    } catch (e) {
                        console.warn('No se pudo parsear la respuesta de error como JSON:', xhr.responseText);
                        // Si no es JSON, usamos el statusText por defecto
                        errorMessage = `Error de Servidor (Código: ${xhr.status}): ${xhr.statusText}`;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo realizar la Devolución',
                        text: errorMessage,
                        footer: `<small>Detalle: ${xhr.statusText}</small>`,
                        confirmButtonText: 'Cerrar',
                        color: 'black',
                        confirmButtonColor: '#3085d6',
                    });
                    console.error('Error XHR:', xhr.status, xhr.statusText, xhr.responseText);
                }
            };

            xhr.onerror = function () {
                Swal.close();
                $('#confirmDevolverCliente').prop('disabled', false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Red',
                    text: 'No se pudo conectar con el servidor. Verifique su conexión a internet.',
                    confirmButtonText: 'Cerrar'
                });
                console.error('Error de red al intentar devolver el ticket.');
            };

            const data = `action=DevolverCliente&id_ticket=${encodeURIComponent(ticketId)}&observaciones=${encodeURIComponent(observaciones)}&id_user=${encodeURIComponent(id_user)}`;
            xhr.send(data);
        } else {
            console.log("Devolución cancelada por el usuario (SweetAlert).");
        }
    });
  }
}

// Obtén una referencia al modal y al tbody de la tabla
const modalComponentesEl = document.getElementById('modalComponentes');
const tbodyComponentes = document.getElementById('tbodyComponentes');
const contadorComponentes = document.getElementById('contadorComponentes');
const botonCargarComponentes = document.getElementById('hiperbinComponents');
const ModalBotonCerrar = document.getElementById('BotonCerrarModal');

// Inicializa el modal de Bootstrap una sola vez.
const modalComponentes = new bootstrap.Modal(modalComponentesEl, {
  keyboard: false, backdrop:'static'
});

// Escuchar el evento 'show.bs.modal' para resetear el estado del modal cada vez que se abre
modalComponentesEl.addEventListener('show.bs.modal', function () {
  // Limpiar el contador y el checkbox de "seleccionar todos" cada vez que se abra el modal
  document.getElementById('selectAllComponents').checked = false;
  contadorComponentes.textContent = '0';
});

// Función para actualizar el contador de componentes seleccionados
function actualizarContador() {
  // Solo cuenta los checkboxes que están checked y que NO están deshabilitados
  const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:checked:not([disabled])');
  const selectAllCheckbox = document.getElementById('selectAllComponents');
    
  // Actualizar contador
  contadorComponentes.textContent = checkboxes.length;
    
  // Actualizar estado del checkbox "seleccionar todos"
  // Solo consideramos los checkboxes que NO están deshabilitados para esta lógica
  const allCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:not([disabled])');
  const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
  const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
    
  selectAllCheckbox.checked = allChecked;
  selectAllCheckbox.indeterminate = someChecked && !allChecked;
}

// Función para limpiar la selección de componentes
function limpiarSeleccion() {
  // Solo desmarca los checkboxes que NO están deshabilitados
  const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:not([disabled])');
  checkboxes.forEach(cb => cb.checked = false);
    
  document.getElementById('selectAllComponents').checked = false;
  contadorComponentes.textContent = '0';
}

// CORRECCIÓN PRINCIPAL: Se modificó la función para que reciba los componentes seleccionados
function guardarComponentesSeleccionados(ticketId, selectedComponents, serialPos) {
    const id_user = document.getElementById('id_user').value;
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/SaveComponents`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    Swal.fire({
                        title: '¡Éxito!',
                        html: `Los componentes del Pos <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> han sido guardados correctamente.`,
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
  const dataToSend = `action=SaveComponents&ticketId=${ticketId}&serialPos=${serialPos}&selectedComponents=${encodeURIComponent(JSON.stringify(selectedComponents))}&id_user=${encodeURIComponent(id_user)}`;
  xhr.send(dataToSend);
}

// Función para obtener el ticket ID (ajusta según tu estructura)
function obtenerTicketId() {
  return currentTicketId;
}

// Función para obtener el nombre de la región (ajusta según tu estructura)
function obtenerRegionName() {
  const regionSelect = document.getElementById('AsiganrCoordinador');
  if (regionSelect && regionSelect.selectedOptions.length > 0) {
    return regionSelect.selectedOptions[0].text;
  }
  return 'Sin región asignada';
}

// FUNCIÓN PRINCIPAL PARA CARGAR Y MOSTRAR EL MODAL
function showSelectComponentsModal(ticketId, regionName, serialPos) {
    const xhr = new XMLHttpRequest();

    // Limpia el contenido previo y muestra un mensaje de carga
    tbodyComponentes.innerHTML = `<tr><td colspan="2" class="text-center text-muted">Cargando componentes...</td></tr>`;
    
    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetComponents`;
    const dataToSendString = `action=GetComponents&ticketId=${ticketId}`;

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
                        components.forEach(comp => {
                            // Ahora verificamos si `comp.is_selected` es 't' para marcar y deshabilitar
                            const isChecked = comp.is_selected === 't' ? 'checked' : '';
                            const isDisabled = comp.is_selected === 't' ? 'disabled' : '';
                            
                            componentsHtml += `
                                <tr>
                                  <td>
                                    <input type="checkbox" class="form-check-input" value="${comp.id_component}" ${isChecked} ${isDisabled}>
                                    </td>
                                  <td>${comp.name_component}</td>
                                </tr>
                            `;
                        });
                        
                        document.getElementById('btnGuardarComponentes').dataset.ticketId = ticketId;
                        document.getElementById('btnGuardarComponentes').dataset.serialPos = serialPos;

                    } else {
                        componentsHtml = `<tr><td colspan="2" class="text-center text-muted">No se encontraron componentes.</td></tr>`;
                    }
                    
                    tbodyComponentes.innerHTML = componentsHtml;
                    document.getElementById('modalComponentesLabel').innerHTML = `
                        <i class="bi bi-box-seam-fill me-2"></i>Lista de Componentes del Dispositivo <span class="badge bg-secondary">${serialPos}</span>
                    `;

                    // Finalmente, muestra el modal de Bootstrap
                    modalComponentes.show();

                    // Llama a actualizar contador después de cargar los componentes
                    actualizarContador();

                } else {
                    Swal.fire('Error', response.message || 'No se pudieron obtener los componentes.', 'error');
                }
            } catch (e) {
                Swal.fire('Error de Procesamiento', 'Hubo un problema al procesar la respuesta del servidor.', 'error');
            }
        } else {
            Swal.fire('Error del Servidor', `No se pudo comunicar con el servidor. Código: ${xhr.status}`, 'error');
        }
    };

    xhr.onerror = function() {
        Swal.fire('Error de red', 'No se pudo conectar con el servidor para obtener los componentes.', 'error');
    };  
  xhr.send(dataToSendString);
}

// Espera a que el DOM esté completamente cargado para asegurarse de que los elementos existen
// Espera a que el DOM esté completamente cargado para asegurarse de que los elementos existen
document.addEventListener('DOMContentLoaded', function () {
    const modalComponentesEl = document.getElementById('modalComponentes');
    const modalComponentes = new bootstrap.Modal(modalComponentesEl, { keyboard: false });

    // Escucha el evento `click` en el documento y usa delegación.
    document.addEventListener('click', function (e) {
        // Verifica si el clic proviene del botón con el ID 'hiperbinComponents'
        if (e.target && e.target.id === 'hiperbinComponents' || e.target.closest('#hiperbinComponents')) {
            const botonClicado = e.target.closest('#hiperbinComponents');
            if (botonClicado) {
                // Llama a la función que abre el modal, pasándole el botón como argumento
                abrirModalComponentes(botonClicado);
            }
        }

        // Event listener para el botón "Limpiar Selección" (usando delegación)
        if (e.target && e.target.closest('.btn-outline-secondary.btn-sm') && e.target.closest('.modal-body')) {
            limpiarSeleccion();
        }

        // Event listener para el botón "Guardar Componentes"
        if (e.target && e.target.id === 'btnGuardarComponentes') {
            const ticketId = e.target.dataset.ticketId;
            const serialPos = e.target.dataset.serialPos;

            // --- INICIO DE LA LÓGICA AGREGADA ---
            const allCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]');
            const allDisabledAndChecked = Array.from(allCheckboxes).every(cb => cb.checked && cb.disabled);

            if (allCheckboxes.length > 0 && allDisabledAndChecked) {
                Swal.fire({
                    title: '¡Información!',
                    html: `Todos los componentes del Pos <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> ya están registrados.`,
                    icon: 'info',
                    confirmButtonText: 'Aceptar',
                    color: 'black',
                    confirmButtonColor: '#003594'
                });
                return; // Detiene la ejecución para no intentar guardar
            }
            // --- FIN DE LA LÓGICA AGREGADA ---

            const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:checked:not([disabled])');
            const selectedComponents = Array.from(checkboxes).map(cb => cb.value);

            if (selectedComponents.length === 0) {
                Swal.fire({
                    title: 'Atención',
                    text: 'Debes seleccionar al menos un componente nuevo para guardar.',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#003594',
                });
                return;
            }
            guardarComponentesSeleccionados(ticketId, selectedComponents, serialPos);
        }

        // Event listener para el botón de cerrar el modal
        if (e.target && e.target.id === 'BotonCerrarModal') {
            modalComponentes.hide();
        }

        // Event listener para el checkbox "Seleccionar Todos"
        if (e.target && e.target.id === 'selectAllComponents') {
            const isChecked = e.target.checked;
            const enabledCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:not([disabled])');
            
            enabledCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            
            actualizarContador();
        }

        // Event listener para checkboxes individuales de componentes
        if (e.target && e.target.type === 'checkbox' && e.target.closest('#tbodyComponentes')) {
            actualizarContador();
        }
    });
});

function abrirModalComponentes(boton) {

    const modalCerrarComponnets = document.getElementById('BotonCerrarModal');
    const ticketId = boton.dataset.idTicket;
    const serialPos = boton.dataset.serialPos;

    const regionName = obtenerRegionName();

    if (!ticketId) {
        Swal.fire({
            title: 'Atención',
            text: 'No se pudo obtener el ID del ticket.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594',
        });
        return;
    }

    if (!serialPos) {
        Swal.fire({
            title: 'Atención',
            text: 'No hay serial disponible para este ticket.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594',
        });
        return;
    }

    if(modalCerrarComponnets){
      modalCerrarComponnets.addEventListener('click', function() {
        modalComponentes.hide();
      });
    }
    showSelectComponentsModal(ticketId, regionName, serialPos);
}

function getTicketStatusVisual(statusTicket, accionTicket) {
  let statusClass = '';
  let statusText = '';
  let statusIcon = '';
  
  if (statusTicket === 'Abierto' || 
      accionTicket === 'Asignado al Coordinador' ||
      accionTicket === 'Pendiente por revisar domiciliacion') {
    statusClass = 'status-open';
    statusText = 'ABIERTO';
    statusIcon = '🟢';
  } else if (statusTicket === 'En proceso' || 
             accionTicket === 'Asignado al Técnico' || 
             accionTicket === 'Recibido por el Técnico' ||
             accionTicket === 'Enviado a taller' ||
             accionTicket === 'En Taller' ||
             accionTicket === 'En espera de Confirmar Devolución') {
    statusClass = 'status-process';
    statusText = 'EN PROCESO';
    statusIcon = '🟡';
  } else if (statusTicket === 'Cerrado' || 
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
