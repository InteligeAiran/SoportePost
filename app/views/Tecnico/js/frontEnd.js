// Sugerir nombre de archivo al imprimir la Nota de Entrega desde el iframe
// El nombre sugerido se basa en el <title> del documento del iframe.
// Ajustamos temporalmente el title antes de llamar a window.print().

let dataTableInstance;
let currentTicketId;
let modalInstance;
let currentnroTicket;
let currentTicketNroForImage = null;
let currentSerial;
let currentDocument;
let currentDomiciliacion
let currentEstado;

let url_envio;
let url_exoneracion;
let url_pago;
let url_convenio;

function getTicketData() {
  const tbody = document.getElementById("tabla-ticket").getElementsByTagName("tbody")[0];
  const detailsPanel = document.getElementById("ticket-details-panel");
  const actionSelectionModalElement = document.getElementById("actionSelectionModal");
  const staticBackdropModalElement = document.getElementById("staticBackdrop");
  const uploadDocumentModalElement = document.getElementById("uploadDocumentModal");
  const viewDocumentModalElement = document.getElementById("viewDocumentModal");
  const devuelveModalElement = document.getElementById("devolverClienteModal");

  let modaldevolucion = null;
  let actionSelectionModalInstance = null;
  let staticBackdropModalInstance = null;
  let uploadDocumentModalInstance = null;
  let viewDocumentModalInstance = null;

  // Inicializar modales
  if (
    devuelveModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    modaldevolucion = new bootstrap.Modal(devuelveModalElement, {
      backdrop: "static",
    });
  }

  if (
    actionSelectionModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    actionSelectionModalInstance = new bootstrap.Modal(actionSelectionModalElement, {
      backdrop: "static",
    });
  }

  if (
    staticBackdropModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    staticBackdropModalInstance = new bootstrap.Modal(staticBackdropModalElement, {
      backdrop: "static",
    });
  }

  if (
    uploadDocumentModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    uploadDocumentModalInstance = new bootstrap.Modal(uploadDocumentModalElement, {
      backdrop: "static",
    });
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

  // Read nro_ticket from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const nroTicket = urlParams.get('nro_ticket');
  console.log('nroTicket extraído de la URL:', nroTicket);

  // Limpiar DataTable si ya está inicializado
  if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
    $("#tabla-ticket").DataTable().destroy();
    tbody.innerHTML = "";
  } else {
    tbody.innerHTML = "";
  }

 // Función para aplicar búsqueda por nro_ticket
  function applyNroTicketSearch(api) {
    if (nroTicket) {
      // Establecer el valor en el input de búsqueda general y asegurar que sea visible
      const searchInput = $('.dataTables_filter input');
      searchInput.val(nroTicket); // Set the value in the search input

      // Aplicar búsqueda general en la tabla
      api.search(nroTicket).draw();

      // Verificar si el ticket existe en el filtro actual
      const row = api.rows({ filter: 'applied' }).data().toArray().find(row => row[1] === nroTicket);
      if (row) {
        const rowNode = api.row((idx, data) => data[1] === nroTicket).node();
        $(rowNode).addClass('table-active');
        rowNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Ticket no encontrado',
          text: `El ticket ${nroTicket} no se encuentra en este filtro.`,
          confirmButtonText: 'Ok',
          color: 'black',
          confirmButtonColor: '#003594'
        });
        api.search('').draw(); // Clear search if no matches
        searchInput.val(''); // Clear the input if ticket not found
      }
    } else {
      $('.dataTables_filter input').val(''); // Asegurar que el input esté vacío
    }
  }

  // Función para verificar si hay datos en una búsqueda específica
  function checkDataExists(api, searchTerm) {
    api.columns().search('').draw(false);
    api.column(5).search(searchTerm, true, false).draw();
    const rowCount = api.rows({ filter: 'applied' }).count();
    return rowCount > 0;
  }

  // Función para limpiar filtros
  function clearFilters(api) {
    api.search('');
    api.columns().every(function () { this.search(''); });
    $('.dataTables_filter input').val(''); // Limpiar el input de búsqueda general
    api.draw(false);
  }

  // Función para buscar el primer botón con datos o el filtro que contiene nroTicket
  function findFirstButtonWithData(api) {
    const searchTerms = [
      { button: "btn-asignados", term: "Asignado al Técnico", status: "En proceso", action: "Asignado al Técnico" },
      { button: "btn-recibidos", term: "Recibido por el Técnico", status: "En proceso", action: "Recibido por el Técnico" },
      { button: "btn-por-asignar", term: "Enviado a taller|En Taller", status: "En proceso", action: "Enviado a taller|En Taller" },
      { button: "btn-devuelto", term: "Entregado a Cliente", status: "Cerrado", action: "Entregado a Cliente" }
    ];

    // Si hay un nroTicket, buscar el filtro que contenga ese ticket
    if (nroTicket) {
      for (const { button, term, status, action } of searchTerms) {
        clearFilters(api);
        api.column(5).search(term, true, false).draw();
        const ticketExists = api.rows({ filter: 'applied' }).data().toArray().some(row => row[1] === nroTicket);
        if (ticketExists) {
          clearFilters(api);
          api.column(5).search(term, true, false).draw();
          if (button === "btn-devuelto") {
            api.column(6).visible(false);
          } else {
            api.column(6).visible(true);
          }
          setActiveButton(button);
          showTicketStatusIndicator(status, action);
          applyNroTicketSearch(api);
          return true;
        }
      }
      // Si no se encuentra el ticket en ningún filtro
      Swal.fire({
        icon: 'warning',
        title: 'Ticket no encontrado',
        text: `El ticket ${nroTicket} no se encuentra en los datos disponibles.`,
        confirmButtonText: 'Ok',
        color: 'black',
        confirmButtonColor: '#003594'
      });
      $('.dataTables_filter input').val(''); // Limpiar el input de búsqueda
    }

    // Buscar el primer filtro con datos
    for (const { button, term, status, action } of searchTerms) {
      if (checkDataExists(api, term)) {
        clearFilters(api);
        api.column(5).search(term, true, false).draw();
        if (button === "btn-devuelto") {
          api.column(6).visible(false);
        } else {
          api.column(6).visible(true);
        }
        setActiveButton(button);
        showTicketStatusIndicator(status, action);
        applyNroTicketSearch(api);
        return true;
      }
    }

    // Si no hay datos
    hideTicketStatusIndicator();
    return false;
  }

  // Función para establecer el botón activo
  function setActiveButton(activeButtonId) {
    $("#btn-asignados, #btn-por-asignar, #btn-recibidos, #btn-devuelto")
      .removeClass("btn-primary").addClass("btn-secondary");
    $(`#${activeButtonId}`).removeClass("btn-secondary").addClass("btn-primary");
  }

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketData1`)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          tbody.innerHTML = `
            <tr>
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
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success && data.ticket) {
        const TicketData = data.ticket;

        // Mostrar el estado del primer ticket
        if (TicketData && TicketData.length > 0) {
          const firstTicket = TicketData[0];
          showTicketStatusIndicator(firstTicket.name_status_ticket, firstTicket.name_accion_ticket);
        } else {
          hideTicketStatusIndicator();
        }

        detailsPanel.innerHTML = "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

        const dataForDataTable = TicketData.map((ticket) => {
          currentTicketNroForImage = ticket.nro_ticket;

          let actionButtonsHTML = '<div class="d-flex align-items-center">';

          const fullRazonSocial = ticket.razonsocial_cliente || "";
          const displayLength = 25;
          const truncatedRazonSocial =
            fullRazonSocial.length > displayLength
              ? `<span class="truncated-cell" data-full-text="${fullRazonSocial}">${fullRazonSocial.substring(0, displayLength)}...</span>`
              : `<span class="truncated-cell" data-full-text="${fullRazonSocial}">${fullRazonSocial}</span>`;

          const hasBeenConfirmedByAnyone =
            ticket.confirmcoord === "t" ||
            ticket.confirmcoord === true ||
            ticket.confirmtecn === "t" ||
            ticket.confirmtecn === true;

          if (
            (ticket.id_status_payment == 11 || ticket.id_status_payment == 10 || ticket.id_status_payment == 9 || ticket.id_status_payment == 6 || ticket.id_status_payment == 4) &&
            (ticket.confirmtecn === "t" || ticket.confirmtecn === true || ticket.confirmcoord === "t" || ticket.confirmcoord === true)
          ) {
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
                  data-pdf-convenio-url="${ticket.pdf_convenio_url || ""}"
                  data-exo-file="${ticket.img_exoneracion_filename || ""}"
                  data-pago-file="${ticket.pdf_pago_filename || ""}"
                  data-convenio-file="${ticket.pdf_convenio_filename || ""}"
                  data-zoom-file="${ticket.pdf_zoom_filename || ""}"
                  data-estado-cliente="${ticket.nombre_estado_cliente}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/></svg>
              </button>`;
          }

          if (!hasBeenConfirmedByAnyone) {
            actionButtonsHTML += `
              <button id="RecibirTec" class="btn btn-sm btn-received-ticket mr-2"
                  data-bs-toggle="tooltip" data-bs-placement="top"
                  title="Marcar como Recibido por Técnico"
                  data-ticket-id="${ticket.id_ticket}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>
              </button>`;
          }

          if (hasBeenConfirmedByAnyone && ticket.name_accion_ticket !== "Enviado a taller") {
            actionButtonsHTML += `
              <button class="btn btn-sm btn-wrench-custom"
                  data-bs-toggle="tooltip" data-bs-placement="top"
                  title="Enviar a Taller"
                  data-rechazado="${ticket.has_rejected_document}"
                  data-ticket-id="${ticket.id_ticket}"
                  data-nro_ticket="${ticket.nro_ticket}"
                  data-id_document="${ticket.id_status_payment}"
                  data-id_domiciliacion="${ticket.id_status_domiciliacion}"
                  data-serial_pos="${ticket.serial_pos || ''}"
                  data-url_zoom="${ticket.pdf_zoom_url || ''}"
                  data-url_exo="${ticket.img_exoneracion_url || ''}"
                  data-url_pago="${ticket.pdf_pago_url || ''}"
                  data-url_convenio="${ticket.pdf_convenio_url || ''}"
                  data-estado="${ticket.nombre_estado_cliente}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-wrench-adjustable-circle" viewBox="0 0 16 16"><path d="M12.496 8a4.5 4.5 0 0 1-1.703 3.526L9.497 8.5l2.959-1.11q.04.3.04.61"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1 0a7 7 0 1 0-13.202 3.249l1.988-1.657a4.5 4.5 0 0 1 7.537-4.623L7.497 6.5l1 2.5 1.333 3.11c-.56.251-1.18.39-1.833.39a4.5 4.5 0 0 1-1.592-.29L4.747 14.2A7 7 0 0 0 15 8m-8.295.139a.25.25 0 0 0-.288-.376l-1.5.5.159.474.808-.27-.595.894a.25.25 0 0 0 .287.376l.808-.27-.595.894a.25.25 0 0 0 .287.376l1.5-.5-.159-.474-.808.27.596-.894a.25.25 0 0 0-.288-.376l-.808.27z"/></svg>
              </button>`;
          }

          actionButtonsHTML += '</div>';

          const finalActionColumnHTML = `<div class="acciones-container">${actionButtonsHTML}</div>`;

          return [
            ticket.id_ticket,
            ticket.nro_ticket,
            ticket.serial_pos,
            ticket.rif,
            truncatedRazonSocial,
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
            {
              title: "N°",
              orderable: false,
              searchable: false,
              render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
              }
            },
            { title: "Nro Ticket" },
            { title: "Serial" },
            { title: "Rif" },
            { title: "Razón Social" },
            { title: "Acción Ticket" },
            { title: "Acciones", orderable: false },
          ],
          language: {
            lengthMenu: "Mostrar _MENU_",
            info: "_TOTAL_ Registros",
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
          initComplete: function (settings, json) {
            const dataTableInstance = this.api();
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
              <button id="btn-por-asignar" class="btn btn-secondary me-2" title="Enviados Taller">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                      <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>
                  </svg>
              </button>
              <button id="btn-devuelto" class="btn btn-secondary me-2" title="Pos Entregado a cliente">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                      <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                  </svg>
              </button>`;
            $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

            // Event listeners para los botones
            $("#btn-asignados").on("click", function () {
              if (checkDataExists(dataTableInstance, "Asignado al Técnico")) {
                showTicketStatusIndicator('En proceso', 'Asignado al Técnico');
                clearFilters(dataTableInstance);
                dataTableInstance.column(5).search("Asignado al Técnico").draw();
                dataTableInstance.column(6).visible(true);
                setActiveButton("btn-asignados");
                applyNroTicketSearch(dataTableInstance);
              } else {
                findFirstButtonWithData(dataTableInstance);
              }
            });

            $("#btn-por-asignar").on("click", function () {
              if (checkDataExists(dataTableInstance, "Enviado a taller|En Taller")) {
                showTicketStatusIndicator('En proceso', 'Enviado a taller|En Taller');
                clearFilters(dataTableInstance);
                dataTableInstance.column(5).search("Enviado a taller|En Taller", true, false).draw();
                dataTableInstance.column(6).visible(true);
                setActiveButton("btn-por-asignar");
                applyNroTicketSearch(dataTableInstance);
              } else {
                findFirstButtonWithData(dataTableInstance);
              }
            });

            $("#btn-recibidos").on("click", function () {
              if (checkDataExists(dataTableInstance, "Recibido por el Técnico")) {
                showTicketStatusIndicator('En proceso', 'Recibido por el Técnico');
                clearFilters(dataTableInstance);
                dataTableInstance.column(5).search("Recibido por el Técnico").draw();
                dataTableInstance.column(6).visible(true);
                setActiveButton("btn-recibidos");
                applyNroTicketSearch(dataTableInstance);
              } else {
                findFirstButtonWithData(dataTableInstance);
              }
            });

            $("#btn-devuelto").on("click", function () {
              if (checkDataExists(dataTableInstance, "Entregado a Cliente")) {
                showTicketStatusIndicator('Cerrado', 'Entregado a Cliente');
                clearFilters(dataTableInstance);
                dataTableInstance.column(5).search("Entregado a Cliente").draw();
                dataTableInstance.column(6).visible(false);
                setActiveButton("btn-devuelto");
                applyNroTicketSearch(dataTableInstance);
              } else {
                findFirstButtonWithData(dataTableInstance);
              }
            });

            // Ejecutar la búsqueda automática al inicializar
            findFirstButtonWithData(dataTableInstance);

            // Event listener para el input de búsqueda general
            $('.dataTables_filter input').on('input', function () {
              const searchValue = $(this).val();
              // Aplicar búsqueda general en DataTables (igual que coordinador)
              dataTableInstance.search(searchValue).draw();
              
              // Resaltar la fila si se encuentra el ticket
              if (searchValue.trim() !== '') {
                const filteredRows = dataTableInstance.rows({ filter: 'applied' });
                filteredRows.every(function () {
                  const rowData = this.data();
                  if (rowData[1] === searchValue) {
                    $(this.node()).addClass('table-active');
                    this.node().scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return false;
                  }
                  return true;
                });
              } else {
                // Limpiar resaltado si no hay búsqueda
                $('#tabla-ticket tbody tr').removeClass('table-active');
              }
            });

            // Event listeners para botones de acción
            $("#tabla-ticket tbody")
              .off("click", ".btn-received-ticket")
              .on("click", ".btn-received-ticket", function (e) {
                e.stopPropagation();
                const button = $(this);
                const ticketId = button.data("ticket-id");
                if (ticketId) {
                  const selectedTicketDetails = TicketData.find(t => t.id_ticket == ticketId);
                  if (selectedTicketDetails) {
                    const currentnroTicket = selectedTicketDetails.nro_ticket;
                    const serialPos = selectedTicketDetails.serial_pos || "No disponible";
                    showConfirmationModalForReceived(ticketId, currentnroTicket, serialPos);
                  } else {
                    console.error(`Error: No se encontraron detalles para el ticket ID: ${ticketId}`);
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

            $("#tabla-ticket tbody")
              .off("click", ".truncated-cell, .expanded-cell")
              .on("click", ".truncated-cell, .expanded-cell", function (e) {
                e.stopPropagation();
                const $cellSpan = $(this);
                const fullText = $cellSpan.data("full-text");
                if ($cellSpan.hasClass("truncated-cell")) {
                  $cellSpan.removeClass("truncated-cell").addClass("expanded-cell").text(fullText);
                } else {
                  $cellSpan.removeClass("expanded-cell").addClass("truncated-cell");
                  const displayLength = 25;
                  $cellSpan.text(fullText.length > displayLength ? fullText.substring(0, displayLength) + "..." : fullText);
                }
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
                if (!rowData) return;
                $("#tabla-ticket tbody tr").removeClass("table-active");
                tr.addClass("table-active");
                const ticketId = rowData[0];
                const selectedTicketDetails = TicketData.find(t => t.id_ticket == ticketId);
                if (selectedTicketDetails) {
                  detailsPanel.innerHTML = formatTicketDetailsPanel(selectedTicketDetails);
                loadTicketHistory(ticketId, selectedTicketDetails.nro_ticket, selectedTicketDetails.serial_pos || '');
                  if (selectedTicketDetails.serial_pos) {
                    downloadImageModal(selectedTicketDetails.serial_pos);
                  } else {
                    const imgElement = document.getElementById("device-ticket-image");
                    if (imgElement) {
                      imgElement.src = "/public/img/consulta_rif/POS/mantainment.png";
                      imgElement.alt = "Serial no disponible";
                    }
                  }
                } else {
                  detailsPanel.innerHTML = "<p>No se encontraron detalles para este ticket.</p>";
                }
              });

            // Listeners para botones de acción específicos
            $("#tabla-ticket tbody")
              .off("click", ".btn-exoneracion-img")
              .on("click", ".btn-exoneracion-img", function (e) {
                e.stopPropagation();
                const ticketId = $(this).data("ticket-id");
                const documentType = $(this).data("document-type");
                if (uploadDocumentModalInstance) {
                  $("#uploadDocumentModal").data("ticket-id", ticketId);
                  $("#uploadDocumentModal").data("document-type", documentType);
                  $("#type_document").val(documentType);
                  $('#generateNotaEntregaBtn').hide();
                  uploadDocumentModalInstance.show();
                }
              });

            $("#tabla-ticket tbody")
              .off("click", ".btn-pago-pdf")
              .on("click", ".btn-pago-pdf", function (e) {
                e.stopPropagation();
                const ticketId = $(this).data("ticket-id");
                const documentType = $(this).data("document-type");
                if (uploadDocumentModalInstance) {
                  $("#uploadDocumentModal").data("ticket-id", ticketId);
                  $("#uploadDocumentModal").data("document-type", documentType);
                  $("#type_document").val(documentType);
                  $('#generateNotaEntregaBtn').hide();
                  uploadDocumentModalInstance.show();
                }
              });

            $("#tabla-ticket tbody")
              .off("click", ".btn-zoom-pdf")
              .on("click", ".btn-zoom-pdf", function (e) {
                e.stopPropagation();
                const ticketId = $(this).data("ticket-id");
                const documentType = $(this).data("document-type");
                if (uploadDocumentModalInstance) {
                  const $modal = $("#uploadDocumentModal");
                  $modal.data("ticket-id", ticketId);
                  $modal.data("document-type", documentType);
                  $("#id_ticket").val(ticketId);
                  $("#type_document").val(documentType);
                  $("#htmlTemplateTicketId").val(ticketId);
                  uploadDocumentModalInstance.show();
                }
              });

            $("#tabla-ticket tbody")
              .off("click", ".btn-view-document")
              .on("click", ".btn-view-document", function (e) {
                e.stopPropagation();
                const ticketId = $(this).data("ticket-id");
                const documentType = $(this).data("document-type");
                const fileUrl = $(this).data("file-url");
                if (viewDocumentModalInstance) {
                  $("#viewDocumentModal").data("ticket-id", ticketId);
                  $("#viewDocumentModal").data("document-type", documentType);
                  $("#viewDocumentModal").data("file-url", fileUrl);
                  loadDocumentIntoViewModal(fileUrl, documentType);
                  viewDocumentModalInstance.show();
                }
              });

            $("#tabla-ticket tbody")
              .off("click", ".btn-wrench-custom")
              .on("click", ".btn-wrench-custom", function (e) {
                e.stopPropagation();
                const ticketId = $(this).data("ticket-id");
                const nroTicket = $(this).data("nro_ticket");
                const id_document = $(this).data("id_document");
                const id_domiciliacion = $(this).data("id_domiciliacion");
                const pdfZoomUrl = $(this).data("url_zoom") || "";
                const imgExoneracionUrl = $(this).data("url_exo") || "";
                const pdfPagoUrl = $(this).data("url_pago") || "";
                const pdfConvenioUrl = $(this).data("url_convenio") || "";
                const serialPos = $(this).data("serial_pos") || "No disponible";
                const estado = $(this).data("estado");
                const rechazado = $(this).data("rechazado");

                if (rechazado === true || rechazado === "t") {
                  Swal.fire({
                    icon: 'warning',
                    iconColor: '#ff9800',
                    title: '<span style="color: #003594; font-size: 1.5em; font-weight: 700;">¡Advertencia!</span>',
                    html: `
                      <div style="text-align: left; padding: 10px 0;">
                        <p style="color: #495057; font-size: 1.1em; margin-bottom: 15px; line-height: 1.6;">
                          El ticket <strong style="color: #003594;">#${nroTicket}</strong> tiene <strong style="color: #dc3545;">documentos rechazados</strong>.
                        </p>
                        <div style="background: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; border-radius: 8px; margin: 15px 0;">
                          <p style="color: #856404; margin: 0; font-size: 1em; line-height: 1.6;">
                            <strong>⚠️ Acción requerida:</strong><br>
                            Por favor, verifique los documentos antes de enviarlo a taller o cargue uno nuevo para su pronta revisión.
                          </p>
                        </div>
                      </div>
                    `,
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#003594',
                    color: 'black',
                    width: '600px',
                    padding: '2em',
                    customClass: {
                      popup: 'swal2-popup-custom',
                      title: 'swal2-title-custom',
                      htmlContainer: 'swal2-html-container-custom'
                    }
                  });
                  return;
                }

                currentTicketId = ticketId;
                currentnroTicket = nroTicket;
                currentSerial = serialPos;
                currentDocument = id_document;
                currentDomiciliacion = id_domiciliacion;
                currentEstado = estado;

                url_envio = pdfZoomUrl;
                url_exoneracion = imgExoneracionUrl;
                url_pago = pdfPagoUrl;
                url_convenio = pdfConvenioUrl;

                if (actionSelectionModalInstance) {
                  actionSelectionModalInstance.show();
                } else {
                  console.error("No se pudo inicializar el modal: actionSelectionModalElement o Bootstrap Modal no están disponibles.");
                }
              });

            $("#ButtonSendToTaller").off("click").on("click", function () {
              const id_document = currentDocument;
              const id_domiciliacion = currentDomiciliacion;
              let showButton = false;
              const isEstadoSinEnvio = currentEstado && ['Miranda', 'Caracas', 'Distrito Capital', 'Vargas'].includes(currentEstado);

              // Validación específica para Convenio Firmado (id_status_domiciliacion = 4)
              if (id_domiciliacion == 4 && (url_convenio === "" || url_convenio === null || url_convenio === undefined)) {
                Swal.fire({
                  icon: 'warning',
                  title: '¡Advertencia!',
                  text: 'Como el estatus de domiciliación es "Deudor - Convenio Firmado", por favor debe cargar el documento del convenio para enviar a taller.',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#003594',
                  color: 'black',
                });
                return;
              }

              if (id_document === 9 || (url_envio === "" && url_exoneracion === "" && url_pago === "")) {
                showButton = true;
              } else if (id_document === 10 && !isEstadoSinEnvio && url_envio !== "" && (url_pago === "" || url_exoneracion === "")) {
                showButton = true;
              } else if (id_document === 10 && isEstadoSinEnvio && (url_pago === "" || url_exoneracion === "")) {
                showButton = true;
              } else if (id_document === 11 && url_envio === "" && (url_exoneracion !== "" || url_pago !== "")) {
                showButton = true;
              } else if (id_document === 6 && !isEstadoSinEnvio && url_envio == "" && url_pago != "") {
                showButton = true;
              } else if (id_document === 4 && !isEstadoSinEnvio && url_envio == "" && url_exoneracion != "") {
                showButton = true;
              } else if (id_document === 6 && url_pago == "") {
                showButton = true;
              } else if (id_document === 4 && url_exoneracion == "") {
                showButton = true;
              }

              if (showButton) {
                Swal.fire({
                  icon: 'warning',
                  title: '¡Advertencia!',
                  text: 'Antes de enviar el equipo al taller, debe cargar los documentos.',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#003594',
                  color: 'black',
                });
                return;
              } else if (id_document == 5 || id_document == 7) {
                Swal.fire({
                  icon: 'warning',
                  title: '¡Advertencia!',
                  text: 'Se encuentran documentos pendientes por revisar.',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#003594',
                  color: 'black',
                });
                return;
              } else if (id_domiciliacion == 1) {
                Swal.fire({
                  icon: 'warning',
                  title: '¡Advertencia!',
                  text: 'Debe revisar la domiciliación del cliente.',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#003594',
                  color: 'black',
                });
                return;
              } else {
                const modalTicketNrSpan = document.getElementById("modalTicketNr");
                const modalSerialPosSpan = document.getElementById("serialpos");
                if (modalTicketNrSpan && currentnroTicket && modalSerialPosSpan) {
                  modalTicketNrSpan.textContent = currentnroTicket;
                  modalSerialPosSpan.textContent = currentSerial;
                } else {
                  modalTicketNrSpan.textContent = "seleccionado";
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

            $("#BtnCerrarSelecionAccion").off("click").on("click", function () {
              if (actionSelectionModalInstance) {
                actionSelectionModalInstance.hide();
              }
            });

            $("#Close-icon").off("click").on("click", function () {
              if (staticBackdropModalInstance) {
                staticBackdropModalInstance.hide();
              }
            });

            $("#close-button").off("click").on("click", function () {
              if (staticBackdropModalInstance) {
                staticBackdropModalInstance.hide();
                setTimeout(() => {
                  if (actionSelectionModalInstance) {
                    actionSelectionModalInstance.show();
                  }
                }, 300);
              }
            });

            $("#devolver").off("click").on("click", function () {
              const id_document = currentDocument;
              const modalTicketNrSpan = document.getElementById("SerialLabel");

              if (modalTicketNrSpan && currentSerial) {
                modalTicketNrSpan.textContent = currentSerial;
              } else {
                modalTicketNrSpan.textContent = "Hay un error";
              }

              if (id_document == 9 || id_document == 11) {
                Swal.fire({
                  icon: 'warning',
                  title: '¡Advertencia!',
                  text: 'Antes de Devolver el equipo al Rosal, debe cargar al menos el Documento de Envio.',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#003594',
                  color: 'black',
                });
                return;
              } else {
                if (actionSelectionModalInstance) {
                  actionSelectionModalInstance.hide();
                }
              }

              if (modaldevolucion) {
                modaldevolucion.show();
              }

              $("#BttonCloseModalDevolucion").off("click").on("click", function () {
                if (modaldevolucion) {
                  modaldevolucion.hide();
                  setTimeout(() => {
                    if (actionSelectionModalInstance) {
                      actionSelectionModalInstance.show();
                    }
                  }, 300);
                }
              });

              $("#confirmDevolverCliente").off("click").on("click", function () {
                if (modaldevolucion) {
                  SendToDevolution(currentTicketId, currentnroTicket, currentSerial);
                }
              });
            });
          },
        });
      } else {
        console.warn("No se encontraron tickets o la respuesta no fue exitosa.");
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay tickets disponibles.</td></tr>';
        if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
          hideTicketStatusIndicator();
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
            {
              title: "N°",
              orderable: false,
              searchable: false,
              render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
              }
            },
            { title: "Nro Ticket" },
            { title: "Serial" },
            { title: "Rif" },
            { title: "Razón Social" },
            { title: "Acción Ticket" },
            { title: "Acciones", orderable: false },
          ],
          language: {
            lengthMenu: "Mostrar _MENU_ Registros",
            info: "_TOTAL_ Registros",
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
              <button id="btn-por-asignar" class="btn btn-primary me-2" title="Enviados Taller">
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
              </button>`;
            $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);
            setActiveButton("btn-asignados");
          },
        });
      }
    })
    .catch((error) => {
      hideTicketStatusIndicator();
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
          {
            title: "N°",
            orderable: false,
            searchable: false,
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          },
          { title: "Nro Ticket" },
          { title: "Serial" },
          { title: "Rif" },
          { title: "Razón Social" },
          { title: "Acción Ticket" },
          { title: "Acciones", orderable: false },
        ],
        language: {
          lengthMenu: "Mostrar _MENU_ Registros",
          zeroRecords: `
            <div class="text-center text-muted py-5">
              <div class="d-flex flex-column align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                  <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
                <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                <p class="text-muted mb-0">No hay tickets asociado al Técnico para mostrar en este momento.</p>
              </div>
            </div>`,
          info: "_TOTAL_ Registros",
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
            <button id="btn-por-asignar" class="btn btn-primary me-2" title="Enviados Taller">
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
            </button>`;
          $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);
          setActiveButton("btn-asignados");
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
    const pdfConvenioUrl = $(this).data('pdf-convenio-url');
    const nro_ticket = $(this).data('nro-ticket');
    const ExoneracionFile_name = $(this).data('exo-file');
    const PagoFile_name = $(this).data('pago-file');
    const ZoomFile_name = $(this).data('zoom-file');
    const ConvenioFile_name = $(this).data('convenio-file');
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

    // Agregar botón de Ver Documento de Convenio Firmado si existe
    if (pdfConvenioUrl && pdfConvenioUrl.trim() !== '') {
        modalButtonsHTML += `
            <button id="VerConvenio" class="btn btn-secondary btn-block btn-view-document mb-2" 
                    data-ticket-id="${ticketId}" 
                    data-document-type="convenio_firmado" 
                    data-file-url="${pdfConvenioUrl}" 
                    data-file-name="${ConvenioFile_name}" 
                    data-nro-ticket="${nro_ticket}">
                Ver Documento de Convenio Firmado
            </button>
        `;
    }

    buttonsContainer.html(modalButtonsHTML);
    documentActionsModal.show();
});

$(document).on('click', '#printHtmlTemplateBtn', function () {
    try {
        const iframe = document.getElementById('htmlTemplatePreview');
        if (!iframe || !iframe.contentWindow) return;
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc) return;

        const originalIframeTitle = doc.title || '';
        const originalWindowTitle = window.document.title || ''; // Guardar el título de la ventana principal

        const ticketId = (document.getElementById('htmlTemplateTicketId') || {}).value || 'Ticket';
        const neNumero = (document.getElementById('ne_numero') || {}).value || '';
        const fecha = new Date();
        const y = fecha.getFullYear();
        const m = String(fecha.getMonth() + 1).padStart(2, '0');
        const d = String(fecha.getDate()).padStart(2, '0');
        const fechaStr = `${y}${m}${d}`;
        const sanitizedNumero = String(neNumero).replace(/[^A-Za-z0-9_-]+/g, '');
        
        // Crear el nombre del archivo
        const filename = `NotaEntrega_${ticketId}${sanitizedNumero ? '_' + sanitizedNumero : ''}_${fechaStr}`;
        
        // --- PREPARACIÓN DEL MODAL DE SUBIDA (Lógica movida para configurar antes) ---
        const ticketIdValue = (document.getElementById('htmlTemplateTicketId') || {}).value || '';
        const idTicketInput = document.getElementById('id_ticket');
        const typeDocInput = document.getElementById('type_document');
        const modalTicketIdSpan = document.getElementById('modalTicketId');
        
        if (idTicketInput) idTicketInput.value = ticketIdValue;
        if (typeDocInput) typeDocInput.value = 'Envio';
        if (modalTicketIdSpan) modalTicketIdSpan.textContent = ticketIdValue;
        
        // 1. Mostrar el modal de éxito del "Guardado" (o Registro de NE) y preguntar qué hacer
        Swal.fire({
            icon: 'success',
            title: 'Nota de Entrega',
            text: 'El archivo se generó correctamente. Puedes guardarlo como PDF.',
            showCancelButton: true,
            confirmButtonText: 'Guardar', // Opción que dispara window.print()
            cancelButtonText: 'Cerrar', // Opción que cierra la vista previa
            confirmButtonColor: '#003594',
            cancelButtonColor: '#808080', // Color para el botón "Cerrar Ventana"
            color: 'black'
        }).then((result) => {
            // Si el usuario presiona "Imprimir / Guardar PDF"
            if (result.isConfirmed) {
                
                // Asignar el nombre del archivo al título de la ventana principal
                window.document.title = filename;

                // Llamar a la función de impresión
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // Usa setTimeout para restaurar el título después de que el diálogo de impresión se lance
                // Se usa un tiempo corto, ya no necesitamos esperar que el usuario interactúe
                setTimeout(() => {
                    doc.title = originalIframeTitle; // Restaurar el título del iframe
                    window.document.title = originalWindowTitle; // Restaurar el título de la ventana principal
                    
                    // Aquí puedes mostrar el modal de "Subir Documento" si lo deseas
                     const uploadDocumentModal = new bootstrap.Modal(document.getElementById('uploadDocumentModal'));
                     uploadDocumentModal.show();
                    
                    // O simplemente recargar la página principal
                    window.location.reload(); 
                    
                }, 500); // 100ms es suficiente para que el título se aplique a la ventana de impresión

            } else {
                // Si el usuario presiona "Cerrar Ventana"
                // 2. Cerrar el modal actual (si es que estás usando uno para la vista previa)
                const htmlModal = new bootstrap.Modal(document.getElementById('htmlTemplateModal'));
                htmlModal.hide();
                
                // O recargar la página, dependiendo de la necesidad de tu flujo
                // window.location.reload();
            }
        });
        
    } catch (e) {
        console.error('Error:', e);
        // Si hay un error, aún intenta imprimir sin cambiar el nombre (Opción de fallback)
        const iframe = document.getElementById('htmlTemplatePreview');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        }
    }
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

    if (documentType == 'Envio'){  
      // Mostrar el botón solo para Envio
      $('#htmlTemplateTicketId').val(ticketId); 
      $('#generateNotaEntregaBtn').show();
    }

    uploadForm[0].reset();
    // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
    $('#imagePreview').attr('src', '#').hide();
    $('#imagePreviewContainer').hide();
    $('#uploadMessage').removeClass('alert-success alert-danger').addClass('hidden').text('');
    $('#uploadDocumentModal .modal-title h5').html(`Subir Documento para Ticket: <span id="modalTicketId">${ticketId}</span>`);
    
    // Limpiar clases de validación del input y formulario
    const documentFileInput = document.getElementById('documentFile');
    const uploadFormElement = document.getElementById('uploadForm');
    if (documentFileInput) {
      documentFileInput.classList.remove('is-valid', 'is-invalid');
    }
    if (uploadFormElement) {
      uploadFormElement.classList.remove('was-validated');
    }
    
    // Mostrar el mensaje informativo
    $('#fileFormatInfo').show();
    
    // Deshabilitar el botón de subir al abrir el modal
    $('#uploadFileBtn').prop('disabled', true);
        
    $('#uploadForm').data('document-type', documentType);
    $('#uploadForm').data('nro_ticket', nro_ticket);
    $('#uploadForm').data('file-name', fileName);
    $('#uploadForm').data('ticket-id', ticketId);

    // Configurar el listener para el input de archivo
    if (documentFileInput) {
      // Remover listener previo para evitar duplicados
      documentFileInput.removeEventListener('change', handleFileSelectForUpload);
      // Añadir el listener
      documentFileInput.addEventListener('change', handleFileSelectForUpload);
    }

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

$(document).ready(function () {
  $('#generateNotaEntregaBtn').hide();
});


$(document).on('click', '#generateNotaEntregaBtn', function () {
    const ticketId = document.getElementById('htmlTemplateTicketId').value;
    if (!ticketId) {
        Swal.fire({ icon: 'warning', title: 'Ticket no disponible' });
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/documents/GetDeliveryNoteData`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const res = JSON.parse(xhr.responseText);
                if (!res || !res.success || !res.rows) {
                    Swal.fire({ icon: 'warning', title: 'No se encontraron datos' });
                    return;
                }

                const d = res.rows[0];
                window.currentDeliveryData = d;
                const serialPos = d.serialpos || d.serial_pos || '';
                const lastFourSerialDigits = serialPos.slice(-4);
                const notaNumero = `NE-${ticketId}-${lastFourSerialDigits}`;
                const regDes = 'Caracas';

                $('#htmlTemplateTicketId').val(ticketId);
                $('#ne_fecha').val(d.fecha_actual || new Date().toLocaleDateString());
                $('#ne_numero').val(notaNumero);
                $('#ne_rif').val(d.coddocumento || '');
                $('#ne_razon').val(d.razonsocial || '');
                $('#ne_responsable').val(d.rlegal || '');
                $('#ne_contacto').val(d.telf1 || 'Sin número de Contacto');
                $('#ne_tipo_equipo').val(d.tipo_equipo || d.tipo_pos || 'POS');
                $('#ne_modelo').val(d.modelo || d.desc_modelo || '');
                $('#ne_serial').val(d.serialpos || d.serial_pos || '');
                $('#ne_region_origen').val(d.estado_final || d.estado || '');
                $('#ne_region_destino').val(regDes);
                $('#ne_observaciones').val('');
                $('#ne_componentes').val(d.componentes || 'Sin componentes');
                
                // ✅ AGREGAR ESTOS CAMPOS
                $('#ne_banco').val(d.ibp || 'Sin banco');
                $('#ne_proveedor').val(d.proveedor || 'Sin proveedor');

                // 1. Obtiene la instancia del modal o la crea si no existe
                const htmlModal = new bootstrap.Modal(document.getElementById('htmlTemplateModal'));
                htmlModal.show();
                
                // 2. Adjunta el evento de clic al botón de cerrar
                $('#closeHtmlTemplateBtn').on('click', function () {
                     htmlModal.hide();
                });

            } catch (e) {
                Swal.fire({ icon: 'error', title: 'Respuesta inválida del servidor' });
            }
        } else {
            Swal.fire({ icon: 'error', title: 'Error de red/servidor' });
        }
    };

    const params = `action=GetDeliveryNoteData&id_ticket=${encodeURIComponent(ticketId)}`;
    xhr.send(params);
});

// ✅ FUNCIÓN ACTUALIZADA
$(document).on('click', '#previewHtmlTemplateBtn', function () {
  const data = {
    fecha: $('#ne_fecha').val(),
    numero: $('#ne_numero').val(),
    rif: $('#ne_rif').val(),
    razon: $('#ne_razon').val(),
    responsable: $('#ne_responsable').val(),
    tipo_equipo: $('#ne_tipo_equipo').val(),
    modelo: $('#ne_modelo').val(),
    serial: $('#ne_serial').val(),
    region_origen: $('#ne_region_origen').val(),
    region_destino: $('#ne_region_destino').val(),
    observaciones: $('#ne_observaciones').val(),
    componentes: $('#ne_componentes').val(),
    banco: $('#ne_banco').val(), // ✅ AGREGAR
    proveedor: $('#ne_proveedor').val(), // ✅ AGREGAR
    tecnico_responsable: window.currentDeliveryData?.full_name_tecnico_responsable || 'Sin técnico asignado'
  };

  const html = buildDeliveryNoteHtml(data);

  const iframe = document.getElementById('htmlTemplatePreview');
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
});

function buildDeliveryNoteHtml(d) {
  const safe = (s) => (s || '').toString();
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nota de Entrega y Envío de Equipo</title>
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
      
      .field-value.observations {
        background: #fff;
        border: 1px solid #ddd;
        min-height: 25px;
        font-style: italic;
        align-items: flex-start;
        padding-top: 5px;
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
        <div class="print-header-rif">RIF: J-002916150</div>
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
        <div class="document-title">Nota de Entrega</div>
        <div class="document-subtitle"></div>
      </div>
      
      <div class="document-info">
        <div class="info-item">
          <div class="info-label">Fecha</div>
          <div class="info-value">${safe(d.fecha)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">N° de Nota</div>
          <div class="info-value">${safe(d.numero)}</div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="section">
          <div class="section-header">Datos del Cliente</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">R.I.F. / Identificación:</div>
              <div class="field-value">${safe(d.rif)}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Razón Social:</div>
              <div class="field-value">${safe(d.razon)}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Representante Legal:</div>
              <div class="field-value">${safe(d.responsable)}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">Detalles del Equipo</div>
          <div class="section-content">
            <div class="two-columns">
              <div class="column">
                <div class="column-title">Información del Equipo</div>
                <div class="field-row">
                  <div class="field-label">Proveedor:</div>
                  <div class="field-value">${safe(d.proveedor)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">Modelo:</div>
                  <div class="field-value">${safe(d.modelo)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">Número de Serie:</div>
                  <div class="field-value">${safe(d.serial)}</div>
                </div>
                 <div class="field-row">
                  <div class="field-label">Banco:</div>
                  <div class="field-value">${safe(d.banco)}</div>
                </div>
              </div>
              
              <div class="column">
                <div class="column-title">Accesorios</div>
                <div class="field-row">
                  <div class="field-label">Periféricos:</div>
                  <div class="field-value">${safe(d.componentes || 'Sin accesorios adicionales')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">Información del Envío</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">Estado de Origen:</div>
              <div class="field-value">${safe(d.region_origen)}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Estado de Destino:</div>
              <div class="field-value">${safe(d.region_destino)}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Observaciones:</div>
              <div class="field-value observations">${safe(d.observaciones) || ''}</div>
            </div>
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-label">Recibe</div>
            <div class="signature-space"></div>
            <div class="signature-line"></div>
            <div class="signature-field">Nombre: _____________________</div>
            <div class="signature-field">C.I.: _____________________</div>
          </div>
          
          <div class="signature-box">
            <div class="signature-label">Firma de Conformidad</div>
            <div class="signature-space"></div>
            <div class="signature-line"></div>
            <div class="signature-field">Nombre: ${safe(d.tecnico_responsable)}</div>
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
              <div class="footer-rif">RIF: J-002916150</div>
            </div>
          </div>
          <div class="footer-text">
            <p>Documento válido como constancia oficial de entrega del equipo especificado.</p>
            <p>Generado: ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>`;
}

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

        const accionsDocument = document.getElementById("documentActionsModal");
        const accionsdocumentsIntance = new bootstrap.Modal(accionsDocument);

        const buttonCerrarModal = document.getElementById("CerrarModalVizualizar");
        if (buttonCerrarModal) {
            buttonCerrarModal.addEventListener("click", function() {
                viewDocumentModal.hide();
                accionsdocumentsIntance.hide();
                setTimeout(() => {
                    accionsdocumentsIntance.show();
                    setTimeout(() => {
                        documentActionsModal.show();
                    }, 300); //
                }, 300); //
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

// 5. Previsualización de la imagen - MANEJADA EN handleFileSelectForUpload
// Este handler fue removido para evitar conflictos con la validación
// La previsualización ahora se maneja en handleFileSelectForUpload junto con la validación

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
    $('#generateNotaEntregaBtn').hide();
    $("#type_document").val('');

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
            <p class="h4 mb-3">¿Marcar el Pos con el serial <span style = "display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> asociado al ticket Nro:<span style = "display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${currentnroTicket}</span>como recibido?</p>
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
    documentFileInput.classList.remove("is-valid", "is-invalid"); // Limpiar clases de validación
    
    const uploadForm = document.getElementById("uploadForm");
    if (uploadForm) {
      uploadForm.classList.remove("was-validated"); // Limpiar clase de validación del formulario
    }
    
    // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
    imagePreview.style.display = "none"; // Ocultar previsualización
    imagePreview.src = "#"; // Restablecer la fuente de la imagen
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    if (imagePreviewContainer) {
      imagePreviewContainer.style.display = "none";
    }
    // Verificar que uploadMessage existe antes de usarlo
    if (uploadMessage) {
    uploadMessage.classList.add("hidden"); // Ocultar mensaje
    uploadMessage.textContent = ""; // Limpiar texto del mensaje
    }
    
    // Mostrar el mensaje informativo
    const fileFormatInfo = document.getElementById("fileFormatInfo");
    if (fileFormatInfo) {
      fileFormatInfo.style.display = "block";
    }
    
    // Deshabilitar el botón de subir al abrir el modal
    if (uploadFileBtn) {
      uploadFileBtn.disabled = true;
    }

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
  const input = event.target;
  const file = input.files[0];
  const imagePreview = document.getElementById("imagePreview");
  const uploadMessage = document.getElementById("uploadMessage");
  const uploadFileBtn = document.getElementById("uploadFileBtn");
  const fileFormatInfo = document.getElementById("fileFormatInfo");
  const uploadForm = document.getElementById("uploadForm");

  // Limpiar estados previos
  input.classList.remove("is-valid", "is-invalid");
  if (uploadForm) {
    uploadForm.classList.remove("was-validated");
  }
  
  // Restaurar visibilidad de los mensajes de feedback de Bootstrap
  const validFeedback = input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
  const invalidFeedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
  if (validFeedback) {
    validFeedback.style.display = '';
  }
  if (invalidFeedback) {
    invalidFeedback.style.display = '';
  }
  
  // Mostrar el mensaje informativo cuando no hay validación (se ocultará después si hay archivo)
  if (fileFormatInfo) {
    fileFormatInfo.style.display = "block";
    fileFormatInfo.style.visibility = "visible";
  }
  
  // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
  if (imagePreview) {
  imagePreview.style.display = "none";
    imagePreview.src = "#";
  }
  // Verificar que uploadMessage existe antes de usarlo
  if (uploadMessage) {
  uploadMessage.classList.add("hidden");
  uploadMessage.textContent = "";
  }

  if (!file) {
    // Si no hay archivo, deshabilitar el botón
    if (uploadFileBtn) {
      uploadFileBtn.disabled = true;
    }
    return;
  }

  // Validar tipo de archivo - verificar la extensión (más confiable que MIME type)
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];
  const validMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"];
  
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf("."));
  
  // Validar por extensión (más confiable) - DEBE estar en la lista
  const isValidExtension = validExtensions.includes(fileExtension);
  
  // Si hay MIME type, también debe ser válido
  const hasMimeType = file.type && file.type.trim() !== "";
  const isValidMimeType = hasMimeType ? validMimeTypes.includes(file.type) : true;
  
  // El archivo es válido SOLO si la extensión es válida
  // Si no hay extensión válida, el archivo es inválido independientemente del MIME type
  const isValid = isValidExtension && (isValidMimeType || !hasMimeType);

  // Agregar clase was-validated al formulario para que Bootstrap muestre los mensajes
  // Esto es necesario para que Bootstrap muestre los estilos de validación (borde rojo/verde e íconos)
  if (uploadForm) {
    uploadForm.classList.add("was-validated");
  }

  if (isValid) {
    // ARCHIVO VÁLIDO
    // Primero remover is-invalid para asegurar que no haya conflicto
    input.classList.remove("is-invalid");
    
    // Remover el background-image rojo (ícono de X) que Bootstrap aplica con is-invalid
    input.style.removeProperty("background-image");
    input.style.removeProperty("background-position");
    input.style.removeProperty("background-repeat");
    input.style.removeProperty("background-size");
    input.style.removeProperty("padding-right");
    
    // Limpiar estilos inline que puedan interferir
    input.style.removeProperty("border-color");
    input.style.removeProperty("box-shadow");
    
    // Luego agregar is-valid - Bootstrap aplicará automáticamente el ícono verde (checkmark)
    input.classList.add("is-valid");
    
    // OCULTAR COMPLETAMENTE el mensaje inválido y su ícono rojo
    const invalidFeedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
    if (invalidFeedback) {
      invalidFeedback.style.setProperty("display", "none", "important");
      invalidFeedback.style.setProperty("visibility", "hidden", "important");
      invalidFeedback.style.setProperty("opacity", "0", "important");
      invalidFeedback.style.setProperty("height", "0", "important");
      invalidFeedback.style.setProperty("margin", "0", "important");
      invalidFeedback.style.setProperty("padding", "0", "important");
    }
    // También usar jQuery para forzar la ocultación
    if (typeof $ !== 'undefined') {
      $('.invalid-feedback').hide();
    }
    
    // MOSTRAR el mensaje válido y su ícono verde
    const validFeedback = input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
    if (validFeedback) {
      validFeedback.style.setProperty("display", "block", "important");
      validFeedback.style.setProperty("visibility", "visible", "important");
      validFeedback.style.setProperty("opacity", "1", "important");
      validFeedback.style.removeProperty("height");
      validFeedback.style.removeProperty("margin");
      validFeedback.style.removeProperty("padding");
    }
    // También usar jQuery para forzar la visualización
    if (typeof $ !== 'undefined') {
      $('.valid-feedback').show();
    }
    
    // OCULTAR el mensaje informativo cuando hay validación activa (archivo válido)
    if (fileFormatInfo) {
      fileFormatInfo.style.setProperty("display", "none", "important");
      fileFormatInfo.style.setProperty("visibility", "hidden", "important");
      fileFormatInfo.style.setProperty("opacity", "0", "important");
      fileFormatInfo.style.setProperty("height", "0", "important");
      fileFormatInfo.style.setProperty("margin", "0", "important");
      fileFormatInfo.style.setProperty("padding", "0", "important");
    }
    // También usar jQuery para asegurar que se oculte
    if (typeof $ !== 'undefined') {
      $('#fileFormatInfo').hide();
    }
    
    // Habilitar el botón de subir
    if (uploadFileBtn) {
      uploadFileBtn.disabled = false;
    }
    
    // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
    if (imagePreview) {
        imagePreview.style.display = "none";
      imagePreview.src = "#";
      }
    } else {
    // ARCHIVO INVÁLIDO
    // PRIMERO: Asegurarse de que NO tenga is-valid (esto es crítico para ocultar el ícono verde)
    input.classList.remove("is-valid");
    
    // Remover el background-image verde (ícono de checkmark) que Bootstrap aplica con is-valid
    input.style.removeProperty("background-image");
    input.style.removeProperty("background-position");
    input.style.removeProperty("background-repeat");
    input.style.removeProperty("background-size");
    input.style.removeProperty("padding-right");
    
    // Remover cualquier estilo inline que pueda interferir
    input.style.removeProperty("border-color");
    input.style.removeProperty("box-shadow");
    input.style.removeProperty("border");
    
    // SEGUNDO: Agregar is-invalid - Bootstrap aplicará automáticamente el borde rojo y el ícono rojo (X)
    input.classList.add("is-invalid");
    
    // Asegurar que el formulario tenga was-validated (ya se agregó arriba, pero lo verificamos)
    if (uploadForm && !uploadForm.classList.contains("was-validated")) {
      uploadForm.classList.add("was-validated");
    }
    
    // Forzar el ícono rojo (X) y el borde rojo de Bootstrap
    // Bootstrap usa background-image con un SVG para el ícono de error
    // SVG del ícono de error de Bootstrap (X roja)
    const invalidIconSvg = "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\")";
    
    // Aplicar estilos para el ícono rojo inmediatamente
    input.style.setProperty("background-image", invalidIconSvg, "important");
    input.style.setProperty("background-repeat", "no-repeat", "important");
    input.style.setProperty("background-position", "right calc(0.375em + 0.1875rem) center", "important");
    input.style.setProperty("background-size", "calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)", "important");
    input.style.setProperty("padding-right", "calc(1.5em + 0.75rem)", "important");
    
    // Forzar el borde rojo de Bootstrap usando CSS inline como respaldo
    // Bootstrap usa border-color: #dc3545 para is-invalid
    // También usar setTimeout para asegurar que se ejecute después del reflow del DOM
    setTimeout(() => {
      // Verificar y forzar que NO tenga is-valid (muy importante)
      if (input.classList.contains("is-valid")) {
        input.classList.remove("is-valid");
      }
      // Verificar y forzar la clase is-invalid si no está presente
      if (!input.classList.contains("is-invalid")) {
        input.classList.add("is-invalid");
      }
      
      // Forzar nuevamente el ícono rojo
      input.style.setProperty("background-image", invalidIconSvg, "important");
      input.style.setProperty("background-repeat", "no-repeat", "important");
      input.style.setProperty("background-position", "right calc(0.375em + 0.1875rem) center", "important");
      input.style.setProperty("background-size", "calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)", "important");
      input.style.setProperty("padding-right", "calc(1.5em + 0.75rem)", "important");
      
      // Aplicar borde rojo directamente si Bootstrap no lo hace
      const computedStyle = window.getComputedStyle(input);
      if (computedStyle.borderColor !== 'rgb(220, 53, 69)' && computedStyle.borderColor !== '#dc3545') {
        input.style.setProperty("border-color", "#dc3545", "important");
        input.style.setProperty("box-shadow", "0 0 0 0.2rem rgba(220, 53, 69, 0.25)", "important");
      }
    }, 50);
    
    // También ejecutar después de un pequeño delay adicional para asegurar
    setTimeout(() => {
      // Forzar nuevamente que NO tenga is-valid
      input.classList.remove("is-valid");
      // Forzar que SÍ tenga is-invalid
      if (!input.classList.contains("is-invalid")) {
        input.classList.add("is-invalid");
      }
      // Forzar nuevamente el ícono rojo
      input.style.setProperty("background-image", invalidIconSvg, "important");
      input.style.setProperty("background-repeat", "no-repeat", "important");
      input.style.setProperty("background-position", "right calc(0.375em + 0.1875rem) center", "important");
      input.style.setProperty("background-size", "calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)", "important");
      input.style.setProperty("padding-right", "calc(1.5em + 0.75rem)", "important");
    }, 100);
    
    // OCULTAR COMPLETAMENTE el mensaje válido y su ícono verde
    const validFeedback = input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
    if (validFeedback) {
      validFeedback.style.setProperty("display", "none", "important");
      validFeedback.style.setProperty("visibility", "hidden", "important");
      validFeedback.style.setProperty("opacity", "0", "important");
      validFeedback.style.setProperty("height", "0", "important");
      validFeedback.style.setProperty("margin", "0", "important");
      validFeedback.style.setProperty("padding", "0", "important");
    }
    // También usar jQuery para forzar la ocultación
    if (typeof $ !== 'undefined') {
      $('.valid-feedback').hide();
    }
    
    // MOSTRAR el mensaje inválido y su ícono rojo
    const invalidFeedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
    if (invalidFeedback) {
      invalidFeedback.style.setProperty("display", "block", "important");
      invalidFeedback.style.setProperty("visibility", "visible", "important");
      invalidFeedback.style.setProperty("opacity", "1", "important");
      invalidFeedback.style.removeProperty("height");
      invalidFeedback.style.removeProperty("margin");
      invalidFeedback.style.removeProperty("padding");
    }
    // También usar jQuery para forzar la visualización
    if (typeof $ !== 'undefined') {
      $('.invalid-feedback').show();
    }
    
    // OCULTAR el mensaje informativo cuando hay validación activa (archivo inválido)
    if (fileFormatInfo) {
      fileFormatInfo.style.setProperty("display", "none", "important");
      fileFormatInfo.style.setProperty("visibility", "hidden", "important");
      fileFormatInfo.style.setProperty("opacity", "0", "important");
      fileFormatInfo.style.setProperty("height", "0", "important");
      fileFormatInfo.style.setProperty("margin", "0", "important");
      fileFormatInfo.style.setProperty("padding", "0", "important");
    }
    // También usar jQuery para asegurar que se oculte
    if (typeof $ !== 'undefined') {
      $('#fileFormatInfo').hide();
    }
    
    // Deshabilitar el botón de subir
    if (uploadFileBtn) {
      uploadFileBtn.disabled = true;
    }
    
    // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
    if (imagePreview) {
      imagePreview.style.display = "none";
      imagePreview.src = "#";
    }
    
    // Limpiar el input después de 6 segundos (aumentado de 3 a 6 segundos)
    setTimeout(() => {
      input.value = "";
      input.classList.remove("is-invalid");
      input.style.borderColor = "";
      input.style.boxShadow = "";
      if (uploadForm) {
        uploadForm.classList.remove("was-validated");
      }
      // Mostrar nuevamente el mensaje informativo
      if (fileFormatInfo) {
        fileFormatInfo.style.removeProperty("display");
        fileFormatInfo.style.removeProperty("visibility");
        fileFormatInfo.style.removeProperty("opacity");
        fileFormatInfo.style.removeProperty("height");
        fileFormatInfo.style.removeProperty("margin");
        fileFormatInfo.style.removeProperty("padding");
      }
      // También usar jQuery para asegurar que se muestre
      if (typeof $ !== 'undefined') {
        $('#fileFormatInfo').show();
      }
      // Restaurar visibilidad de los mensajes de feedback
      const validFeedback = input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
      const invalidFeedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
      if (validFeedback) {
        validFeedback.style.display = '';
        validFeedback.style.visibility = '';
      }
      if (invalidFeedback) {
        invalidFeedback.style.display = '';
        invalidFeedback.style.visibility = '';
      }
    }, 6000); // Aumentado de 3000ms a 6000ms (6 segundos)
  }
}

async function handleUploadButtonClick(ticketId, documentType, uploadModalBootstrap, ticketNumber) {
    const id_user = document.getElementById("userId");
    if (!id_user) {
        console.error("Elemento userId no encontrado");
        return;
    }
    
    const documentFileInput = document.getElementById("documentFile");
    if (!documentFileInput) {
        console.error("Elemento documentFile no encontrado");
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo encontrar el campo de archivo.',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#003594',
        });
        return;
    }
    
    const uploadMessage = document.getElementById("uploadMessage");
    // El elemento uploadMessage puede no existir, así que verificamos antes de usarlo
    if (uploadMessage) {
    uploadMessage.classList.add("hidden");
    uploadMessage.textContent = "";
    }
    
    const file = documentFileInput.files[0];

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
    formData.append("id_user", id_user.value);

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
                        <button class="btn btn-secondary" onclick="printHistory('${ticketId}', '${encodeURIComponent(JSON.stringify(response.history))}', '${currentTicketNroForImage}', '${serialPos}')">
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
                                                        <th class="text-start">Periféricos Asociados:</th>
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

    const generateFileName = (ticketNumber, serial) => {
        let fileName = `Historial_Ticket_${ticketNumber}`;
        if (serial && serial.length >= 4) {
            const lastFourDigits = serial.slice(-4);
            fileName += `-${lastFourDigits}`;
        }
        return `${fileName}.pdf`;
    };

    const fileName = generateFileName(currentTicketNroForImage, serialPos);

    let itemsHtml = '';
    history.forEach((item, index) => {
        const previous = history[index + 1] || null;
        const elapsed = previous ? calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio) : null;
        const elapsedText = elapsed ? elapsed.text : 'N/A';

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
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Domiciliación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_domiciliacion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Pago</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_payment) || 'N/A'}</td></tr>
                        ${cleanString(item.components_list) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Periféricos</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.components_list)}</td></tr>` : ''}
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
            <div style="display: flex; justify-content: center; gap: 15px; font-size: 11px; font-weight: 500;">
                <span style="color: #059669;">
                    <strong style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">D</strong> Día(s)
                </span>
                <span style="color: #1e40af;">
                    <strong style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">H</strong> Hora(s)
                </span>
                <span style="color: #9a3412;">
                    <strong style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">M</strong> Minuto(s)
                </span>
                <span style="color: #b91c1c;">
                    <strong style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">S</strong> Semana(s)
                </span>
            </div>
            <p style="font-size: 10px; color: #6b7280; margin-top: 8px;">
                *Ejemplo: **1D 6H 11M** significa 1 día, 6 horas y 11 minutos.
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
            // Si el usuario cancela, simplemente cerramos el modal y no hacemos nada}
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
    const modulo = "Gestión Técnico";
    
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
                        html: `Los Periféricos del Pos <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> han sido guardados correctamente.`,
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
  const dataToSend = `action=SaveComponents&ticketId=${ticketId}&serialPos=${serialPos}&selectedComponents=${encodeURIComponent(JSON.stringify(selectedComponents))}&id_user=${encodeURIComponent(id_user)}&modulo=${encodeURIComponent(modulo)}`;
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
                        <i class="bi bi-box-seam-fill me-2"></i>Lista de Periféricos del Dispositivo <span class="badge bg-secondary">${serialPos}</span>
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
                    html: `Todos los Periféricos del Pos <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> ya están registrados.`,
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
