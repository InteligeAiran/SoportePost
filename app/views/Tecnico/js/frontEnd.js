let dataTableInstance;
let currentTicketId;
let modalInstance;
let currentnroTicket;

function getTicketData() {
  const tbody = document
    .getElementById("tabla-ticket")
    .getElementsByTagName("tbody")[0];
  const detailsPanel = document.getElementById("ticket-details-panel");
  const actionSelectionModalElement = document.getElementById(
    "actionSelectionModal"
  ); // Modal de "Seleccionar Acción"
  const staticBackdropModalElement = document.getElementById("staticBackdrop"); // Modal de "Deseas Enviar al Taller?"
  const uploadDocumentModalElement = document.getElementById(
    "uploadDocumentModal"
  );
  const viewDocumentModalElement = document.getElementById("viewDocumentModal");
  const devuelveModalElement = document.getElementById("devolverClienteModal");

  // Instancias de los modales de Bootstrap (se inicializan una vez)
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
          throw new Error("No se encontraron usuarios (404)");
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

        detailsPanel.innerHTML =
          "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

        const dataForDataTable = TicketData.map((ticket) => {
          let actionButtonsHTML = "";

          // Truncar la razón social para la visualización inicial
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

          if (hasBeenConfirmedByAnyone) {
            if (ticket.name_accion_ticket === "Enviado a taller") {
                
            } else { // Si ya fue confirmado, pero NO ha sido enviado a taller
                actionButtonsHTML += `
                    <button class="btn btn-sm btn-wrench-custom"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        title="Enviar a Taller"
                        data-ticket-id="${ticket.id_ticket}"
                        data-nro_ticket="${ticket.nro_ticket}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-wrench-adjustable-circle" viewBox="0 0 16 16"><path d="M12.496 8a4.5 4.5 0 0 1-1.703 3.526L9.497 8.5l2.959-1.11q.04.3.04.61"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1 0a7 7 0 1 0-13.202 3.249l1.988-1.657a4.5 4.5 0 0 1 7.537-4.623L7.497 6.5l1 2.5 1.333 3.11c-.56.251-1.18.39-1.833.39a4.5 4.5 0 0 1-1.592-.29L4.747 14.2A7 7 0 0 0 15 8m-8.295.139a.25.25 0 0 0-.288-.376l-1.5.5.159.474.808-.27-.595.894a.25.25 0 0 0 .287.376l.808-.27-.595.894a.25.25 0 0 0 .287.376l1.5-.5-.159-.474-.808.27.596-.894a.25.25 0 0 0-.288-.376l-.808.27z"/></svg>
                    </button>`;
            }
        } else { // Si aún NO ha sido confirmado por nadie
            actionButtonsHTML += `
                <button class="btn btn-sm btn-dark btn-received-ticket ml-2"
                    data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Marcar como Recibido"
                    data-ticket-id="${ticket.id_ticket}">
                    ¿Recibido?
                </button>`;
        }

          // Lógica para añadir los botones adicionales basada en id_status_payment
          if (ticket.id_status_payment == 11) {
            actionButtonsHTML += `
                            <button class="btn btn-sm btn-info btn-zoom-pdf ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Cargue PDF o Imagen de Envio"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${
                                  ticket.id_status_payment
                                }"
                                data-document-type="zoom">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/></svg>
                            </button>
                            <button class="btn btn-sm btn-secondary btn-view-document ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Ver PDF o Imagen de Envio de ZOOM"
                                data-ticket-id="${ticket.id_ticket}"
                                data-document-type="zoom"
                                data-file-url="${ticket.pdf_zoom_url || ""}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>
                            </button>
                        `;
          } else if (ticket.id_status_payment == 10) {
            actionButtonsHTML += `
                            <button class="btn btn-sm btn-primary btn-exoneracion-img ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Cargar Imagen o PDF de la Exoneracion"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${
                                  ticket.id_status_payment
                                }"
                                data-document-type="exoneracion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/></svg>
                            </button>
                            <button class="btn btn-sm btn-success btn-pago-pdf ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Carge el PDF o Imagen de Pago"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${
                                  ticket.id_status_payment
                                }"
                                data-document-type="pago">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/></svg>
                            </button>
                            <button class="btn btn-sm btn-secondary btn-view-document ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Ver Documento de Exoneración o Pago"
                                data-ticket-id="${ticket.id_ticket}"
                                data-document-type="exoneracion_pago"
                                data-file-url="${
                                  ticket.img_exoneracion_url ||
                                  ticket.pdf_pago_url ||
                                  ""
                                }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>
                            </button>
                        `;
          } else if (ticket.id_status_payment == 9) {
            actionButtonsHTML += `
                            <button class="btn btn-sm btn-info btn-zoom-pdf ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Cargue Imagen o PDF de Envio ZOOM"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${
                                  ticket.id_status_payment
                                }"
                                data-document-type="zoom">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/></svg>
                            </button>
                            <button class="btn btn-sm btn-primary btn-exoneracion-img ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Cargar Imagen o PDF de la Exoneracion"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${
                                  ticket.id_status_payment
                                }"
                                data-document-type="exoneracion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/></svg>
                            </button>
                            <button class="btn btn-sm btn-success btn-pago-pdf ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Carge el PDF o Imagen de Pago"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${
                                  ticket.id_status_payment
                                }"
                                data-document-type="pago">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/></svg>
                            </button>
                            <button class="btn btn-sm btn-secondary btn-view-document ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Ver Documento"
                                data-ticket-id="${ticket.id_ticket}"
                                data-document-type="all"
                                data-file-url="${
                                  ticket.img_exoneracion_url ||
                                  ticket.pdf_pago_url ||
                                  ticket.pdf_zoom_url ||
                                  ""
                                }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>
                            </button>
                        `;
          } else if (
            ticket.id_status_payment == 6 ||
            ticket.id_status_payment == 4
          ) {
            actionButtonsHTML += `
                            <button class="btn btn-sm btn-secondary btn-view-document ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Ver Documento"
                                data-ticket-id="${ticket.id_ticket}"
                                data-document-type="all"
                                data-file-url="${
                                  ticket.img_exoneracion_url ||
                                  ticket.pdf_pago_url ||
                                  ticket.pdf_zoom_url ||
                                  ""
                                }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>
                            </button>
                        `;
          }

          const finalActionColumnHTML = `<div class="acciones-container">${actionButtonsHTML}</div>`;

          return [
            ticket.id_ticket,
            ticket.rif,
            ticket.nro_ticket,
            truncatedRazonSocial, // Usar el HTML truncado aquí
            ticket.create_ticket,
            ticket.full_name_tecnico,
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
            { title: "ID ticket" },
            { title: "Rif" },
            { title: "Nro Ticket" },
            { title: "Razón Social" }, // Esta columna ahora contendrá el HTML del span
            { title: "Fecha Creación" },
            { title: "Técnico Gestor" },
            { title: "Acción Ticket" },
            { title: "Acciones", orderable: false },
          ],
          language: {
            lengthMenu: "Mostrar _MENU_",
            emptyTable: "No hay datos disponibles en la tabla",
            zeroRecords: "No se encontraron resultados para la búsqueda",
            info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
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
          },
          dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
         // Dentro de tu initComplete de DataTables
            initComplete: function (settings, json) {
            const dataTableInstance = this.api(); // Obtén la instancia de la API de DataTables 
            const buttonsHtml = `
                <button id="btn-asignados" class="btn btn-secondary me-2" title="Tickets ya Asignados">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                </button>

                <button id="btn-por-asignar" class="btn btn-secondary me-2" title = "Enviados Taller">
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

            // Tu función setActiveButton es correcta.
            function setActiveButton(activeButtonId) {
                $("#btn-asignados").removeClass("btn-primary").addClass("btn-secondary");
                $("#btn-por-asignar").removeClass("btn-primary").addClass("btn-secondary");
                $("#btn-recibidos").removeClass("btn-primary").addClass("btn-secondary");
                $("#btn-devuelto").removeClass("btn-primary").addClass("btn-secondary");
                $(`#${activeButtonId}`).removeClass("btn-secondary").addClass("btn-primary");
            }

            // Inicialmente, establecer "Asignados" como activo (esto es correcto)
            setActiveButton("btn-asignados");
            dataTableInstance.column(6).search("Asignado al Técnico").draw();


            // Tus event listeners de clic están correctos
            $("#btn-asignados").on("click", function () {
                dataTableInstance.column(6).search("Asignado al Técnico").draw();
                setActiveButton("btn-asignados");
            });

            $("#btn-por-asignar").on("click", function () {
                dataTableInstance.column(6).search("Enviado a taller").draw();
                setActiveButton("btn-por-asignar");
            });

            $("#btn-recibidos").on("click", function () {
                dataTableInstance.column(6).search("Recibido por el Técnico").draw();
                setActiveButton("btn-recibidos");
            });

            $("#btn-devuelto").on("click", function () {
                dataTableInstance.column(6).search("Pos devuelto a cliente").draw();
                setActiveButton("btn-devuelto");
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

                        // Llama a la función showConfirmationModalForReceived
                        showConfirmationModalForReceived(ticketId, currentnroTicket);
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
            currentTicketId = ticketId; // Asigna al currentTicketId para el modal de taller
            currentnroTicket = nroTicket;

            if (actionSelectionModalInstance) {
              actionSelectionModalInstance.show(); // Abre el modal de selección de acción
            } else {
              console.error(
                "No se pudo inicializar el modal: actionSelectionModalElement o Bootstrap Modal no están disponibles."
              );
            }
          });

        // *** Mantenemos la lógica para los botones de los modales de acción ***

        // Listener para el botón "Enviar a Taller" dentro del modal actionSelectionModal
        // Este botón DEBE tener el ID 'ButtonSendToTaller'
        $("#ButtonSendToTaller")
          .off("click")
          .on("click", function () {

            const modalTicketNrSpan = document.getElementById("modalTicketNr");
             if (modalTicketNrSpan && currentnroTicket) {
                modalTicketNrSpan.textContent = currentnroTicket;
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
            // 1. Ocultar el primer modal (staticBackdrop)
            if (actionSelectionModalInstance) {
              actionSelectionModalInstance.hide();
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
                    // Aquí no necesitas leer de data("ticket-id") en este botón,
                    // ya tienes el ticketId almacenado en currentTicketId
                    // Asegúrate de que 'currentTicketId' esté accesible en este ámbito.
                    if (modaldevolucion) {
                        SendToDevolution(currentTicketId, currentnroTicket); // <--- Usa la variable ya asignada
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
            { title: "ID ticket" },
            { title: "Rif" },
            { title: "Nro Ticket" },
            { title: "Razón Social" },
            { title: "Fecha Creación" },
            { title: "Técnico Asignado" },
            { title: "Acción Ticket" },
            { title: "Acciones", orderable: false },
          ],
          language: {
            lengthMenu: "Mostrar _MENU_ Registros",
            emptyTable: "No hay datos disponibles en la tabla",
            zeroRecords: "No se encontraron resultados para la búsqueda",
            info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
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
          { title: "ID ticket" },
          { title: "Rif" },
          { title: "Nro Ticket" },
          { title: "Razón Social" },
          { title: "Fecha Creación" },
          { title: "Técnico Asignado" },
          { title: "Acción Ticket" },
          { title: "Acciones", orderable: false },
        ],
        language: {
          lengthMenu: "Mostrar _MENU_ Registros",
          emptyTable: "No hay datos disponibles en la tabla",
          zeroRecords: "No se encontraron resultados para la búsqueda",
          info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
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

// --- NUEVA FUNCIÓN PARA MOSTRAR UN MODAL DE CONFIRMACIÓN (OPCIONAL PERO RECOMENDADO) ---
// Puedes usar un modal de Bootstrap existente o crear uno nuevo.
// Este es un ejemplo conceptual.
function showConfirmationModalForReceived(ticketId, currentnroTicket) {
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
            <p class="h4 mb-3">¿Marcar el Pos asociado al ticket Nro: <span class="fw-bold text-primary">${currentnroTicket}</span> como recibido?</p>
            <p class="h5 text-muted">Esta acción registrará la fecha de recepción y habilitará la opción Envío a Taller.</p>
        </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Sí, Recibir Ticket",
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
                text: "El Pos asociado al ticket N" + currentnroTicket + " ha sido marcado como recibido.", // <-- CAMBIO AQUÍ
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
      handleUploadButtonClick(ticketId, documentType, uploadModalBootstrap);
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

async function handleUploadButtonClick(
  ticketId,
  documentType,
  uploadModalBootstrap
) {
  const documentFileInput = document.getElementById("documentFile");
  const uploadMessage = document.getElementById("uploadMessage");
  const file = documentFileInput.files[0];

  uploadMessage.classList.add("hidden");
  uploadMessage.textContent = "";

  if (!file) {
    uploadMessage.textContent = "Por favor, seleccione un archivo para subir.";
    uploadMessage.classList.remove("hidden");
    return;
  }

  const formData = new FormData();
  formData.append("ticket_id", ticketId);
  formData.append("document_type", documentType); // 'zoom', 'exoneracion', 'pago'
  formData.append("document_file", file);

  try {
    const response = await fetch(
      `${ENDPOINT_BASE}${APP_PATH}api/uploadDocument`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      uploadMessage.textContent = result.message;
      uploadMessage.classList.remove("hidden");
      uploadMessage.style.color = "green";
      // Opcional: Cerrar el modal después de un tiempo o recargar la tabla
      setTimeout(() => {
        uploadModalBootstrap.hide();
        getTicketData(); // Recargar la tabla para reflejar los cambios
      }, 1500);
    } else {
      uploadMessage.textContent =
        result.message || "Error al subir el documento.";
      uploadMessage.classList.remove("hidden");
      uploadMessage.style.color = "red";
    }
  } catch (error) {
    console.error("Error al subir el documento:", error);
    uploadMessage.textContent =
      "Error de red o del servidor al subir el documento.";
    uploadMessage.classList.remove("hidden");
    uploadMessage.style.color = "red";
  }
}

// ===============================================
// Lógica para el Modal de Visualización de Documentos (viewDocumentModal)
// ===============================================

function openViewModal(ticketId, fileUrl, documentType) {
  const viewDocumentModalElement = document.getElementById("viewDocumentModal");
  const viewModalTicketIdSpan = document.getElementById("viewModalTicketId");
  const imageViewPreview = document.getElementById("imageViewPreview");
  const pdfViewViewer = document.getElementById("pdfViewViewer");
  const viewDocumentMessage = document.getElementById("viewDocumentMessage");

  if (
    viewDocumentModalElement &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Modal !== "undefined"
  ) {
    const viewModalBootstrap = new bootstrap.Modal(viewDocumentModalElement);

    // Limpiar y ocultar elementos de previsualización
    imageViewPreview.style.display = "none";
    imageViewPreview.src = "#";
    pdfViewViewer.style.display = "none";
    pdfViewViewer.innerHTML = ""; // Limpiar contenido previo del visor de PDF
    viewDocumentMessage.classList.add("hidden");
    viewDocumentMessage.textContent = "";

    // Establecer el ID del ticket en el modal
    viewModalTicketIdSpan.textContent = ticketId;

    if (fileUrl) {
      const fileExtension = fileUrl.split(".").pop().toLowerCase();

      if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
        imageViewPreview.src = fileUrl;
        imageViewPreview.style.display = "block";
      } else if (fileExtension === "pdf") {
        // Usar un visor de PDF (por ejemplo, pdf.js o un iframe simple)
        // Para un iframe simple:
        pdfViewViewer.innerHTML = `<iframe src="${fileUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
        pdfViewViewer.style.display = "block";

        // Si necesitas algo más robusto como pdf.js, tendrías que integrarlo
        // Ejemplo con pdf.js (requiere la librería):
        /*
                pdfViewViewer.innerHTML = ''; // Asegúrate de que esté vacío
                const loadingTask = pdfjsLib.getDocument(fileUrl);
                loadingTask.promise.then(function(pdf) {
                    pdf.getPage(1).then(function(page) {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale: scale });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        pdfViewViewer.appendChild(canvas);

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                        pdfViewViewer.style.display = 'block';
                    });
                }).catch(function(error) {
                    console.error('Error al cargar el PDF:', error);
                    viewDocumentMessage.textContent = 'Error al cargar el PDF.';
                    viewDocumentMessage.classList.remove('hidden');
                });
                */
      } else {
        viewDocumentMessage.textContent =
          "Formato de archivo no soportado para previsualización.";
        viewDocumentMessage.classList.remove("hidden");
      }
    } else {
      viewDocumentMessage.textContent =
        "No se ha subido ningún documento para este tipo.";
      viewDocumentMessage.classList.remove("hidden");
    }

    // Mostrar el modal
    viewModalBootstrap.show();
  } else {
    console.error(
      "No se pudo inicializar el modal de visualización: viewDocumentModalElement o Bootstrap Modal no están disponibles."
    );
  }
}

// Llama a la función para cargar los datos cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", getTicketData);

function formatTicketDetailsPanel(d) {
  // d es el objeto `data` completo del ticket

  const initialImageUrl = "assets/img/loading-placeholder.png"; // Asegúrate de tener esta imagen
  const initialImageAlt = "Cargando imagen del dispositivo...";

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
                            ${d.fecha_instalacion}
                        </div>
                        <div class="col-sm-6 mb-2">
                             <br><strong><div>Creación ticket:</div></strong>
                            ${d.create_ticket}
                        </div>
                        <div class="col-sm-6 mb-2">
                             <br><strong><div>Usuario Gestión:</div></strong>
                            ${d.full_name_tecnico}
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-12">
                    <div class="row">
                        <div class="col-sm-4 mb-2">
                            <strong><div>Acción:</div></strong>
                            <span class = "Accion-ticket">${d.name_accion_ticket}</span>
                        </div>
                         <div class="col-sm-8 mb-2" style = "margin-left: -7%;">
                          <strong><div>Falla Reportada:</div></strong>
                          <span class="falla-reportada-texto">${d.name_failure}</span>
                        </div>
                        <div class="col-sm-8 mb-2">
                             <br><strong><div>Estatus Ticket:</div></strong>
                            ${d.name_status_ticket}
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
  // 1. Obtener el contenedor del historial y mostrar mensaje de carga (usando jQuery)
  const historyPanel = $("#ticket-history-content");
  historyPanel.html(
    '<p class="text-center text-muted">Cargando historial...</p>'
  ); // Usar .html() de jQuery

  // 2. Crear y configurar la solicitud AJAX (usando jQuery.ajax)
  $.ajax({
    url: `${ENDPOINT_BASE}${APP_PATH}api/historical/GetTicketHistory`,
    type: "POST",
    data: {
      // jQuery formatea esto automáticamente a 'application/x-www-form-urlencoded'
      action: "GetTicketHistory",
      id_ticket: ticketId,
    },
    dataType: "json", // Le decimos a jQuery que esperamos una respuesta JSON
    success: function (response) {
      // Verificar si la respuesta es exitosa y contiene historial
      if (response.success && response.history && response.history.length > 0) {
        let historyHtml = '<div class="accordion" id="ticketHistoryAccordion">'; // Contenedor del acordeón

        // Iterar sobre cada item del historial para construir el HTML
        response.history.forEach((item, index) => {
          const collapseId = `collapseHistoryItem_${ticketId}_${index}`;
          const headingId = `headingHistoryItem_${ticketId}_${index}`;

          let statusHeaderClass = "";
          let statusHeaderText = "";

          // **Colores por defecto si no hay coincidencia o si el estado es nulo/vacío**
          let headerStyle = "background-color: #212529;"; // Gris claro de Bootstrap 'light'
          let textColor = "color: #212529;"; // Texto oscuro de Bootstrap 'dark'
          statusHeaderText = ""; // Sin texto extra por defecto

          if (item.name_status_ticket) {
            const statusLower = item.name_status_ticket.toLowerCase();
            if (statusLower.includes("abierto")) {
              headerStyle = "background-color: #5d9cec;"; // Azul claro/celeste
              textColor = "color: #ffffff;"; // Texto blanco
              statusHeaderText = " (Abierto)";
            } else if (
              statusLower.includes("cerrado") ||
              statusLower.includes("resuelto")
            ) {
              headerStyle = "background-color: #28a745;"; // Verde
              textColor = "color: #ffffff;"; // Texto blanco
              statusHeaderText = " (Cerrado)";
            } else if (
              statusLower.includes("pendiente") ||
              statusLower.includes("en proceso")
            ) {
              headerStyle = "background-color: #ffc107;"; // Amarillo
              textColor = "color: #343a40;"; // Texto oscuro
              statusHeaderText = " (En Proceso)";
            } else if (
              statusLower.includes("cancelado") ||
              statusLower.includes("rechazado")
            ) {
              headerStyle = "background-color: #dc3545;"; // Rojo
              textColor = "color: #ffffff;"; // Texto blanco
              statusHeaderText = " (Cancelado)";
            } else if (statusLower.includes("espera")) {
              headerStyle = "background-color: #6c757d;"; // Gris
              textColor = "color: #ffffff;"; // Texto blanco
              statusHeaderText = " (En Espera)";
            }
          }

          // Esta lógica ANULA cualquier color establecido por el estado si la condición se cumple.
          if (index === 0) {
            // Es la última gestión (la "actual")
            headerStyle = "background-color: #ffc107;"; // Amarillo
            textColor = "color: #343a40;"; // Texto oscuro
            statusHeaderText = ` (${item.name_status_ticket || "Desconocido"})`; // Agrega el estatus actual o 'Desconocido' si no existe. // Sobrescribe el texto del estado si ya estaba.
          } else {
            // Son gestiones pasadas
            headerStyle = "background-color: #5d9cec;"; // Azul claro/celeste
            textColor = "color: #ffffff;"; // Texto blanco
            // No sobrescribimos statusHeaderText aquí a menos que quieras algo como "(Pasada)"
          }

          historyHtml += `
                        <div class="card mb-3 custom-history-card"> <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                            data-toggle="collapse" data-target="#${collapseId}"
                                            aria-expanded="${
                                              index === 0 ? "true" : "false"
                                            }" aria-controls="${collapseId}"
                                            style="${textColor}">
                                        ${item.fecha_de_cambio} - ${
            item.name_accion_ticket
          }${statusHeaderText}
                                    </button>
                                </h2>
                            </div>
                            <div id="${collapseId}" class="collapse ${
            index === 0 ? "show" : ""
          }"
                                aria-labelledby="${headingId}" data-parent="#ticketHistoryAccordion">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <th class="text-start" style="width: 40%;">Fecha y Hora:</th>
                                                    <td>${
                                                      item.fecha_de_cambio ||
                                                      "N/A"
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Acción:</th>
                                                    <td>${
                                                      item.name_accion_ticket ||
                                                      "N/A"
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Operador de Gestión:</th>
                                                    <td>${
                                                      item.full_name_tecnico_gestion ||
                                                      "N/A"
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td>${
                                                      item.full_name_coordinador ||
                                                      "N/A"
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Ticket:</th>
                                                    <td>${
                                                      item.name_status_ticket ||
                                                      "N/A"
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Laboratorio:</th>
                                                    <td>${
                                                      item.name_status_lab ||
                                                      "N/A"
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Domiciliación:</th>
                                                    <td>${
                                                      item.name_status_domiciliacion ||
                                                      "N/A"
                                                    }</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start" style = " word-wrap: break-word; overflow-wrap: break-word;"">Estatus Pago:</th>
                                                    <td>${
                                                      item.name_status_payment ||
                                                      "N/A"
                                                    }</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        });

        historyHtml += "</div>"; // Cierre del acordeón principal
        historyPanel.html(historyHtml); // Insertar el HTML generado (con jQuery)

        // === IMPORTANTE: RE-INICIALIZAR COMPONENTES DE BOOTSTRAP SI ES NECESARIO ===
        // Para Bootstrap 4, los atributos data-toggle/data-parent usualmente se "enganchan"
        // automáticamente si jQuery y Bootstrap JS están cargados.
        // No necesitas una inicialización explícita como en Bootstrap 5.
        // El problema suele ser que los atributos data-toggle/data-parent están mal,
        // o jQuery/Bootstrap JS no están cargados.

        // Reiniciar tooltips (si usas Bootstrap 4, la sintaxis es diferente para dispose/init)
        if ($.fn && $.fn.tooltip) {
          // Para Bootstrap 4, los tooltips se manejan así:
          $('[data-toggle="tooltip"]').tooltip("dispose"); // Asegúrate de que el atributo es data-toggle
          $('[data-toggle="tooltip"]').tooltip(); // Y se inicializan con data-toggle
        }

        // Aquí no se necesita `new bootstrap.Collapse` porque eso es para JS nativo de Bootstrap 5.
        // Con jQuery y Bootstrap 4, la magia ocurre a través de los atributos data-toggle y data-parent
        // una vez que el HTML está en el DOM y las librerías cargadas.
      } else {
        historyPanel.html(
          '<p class="text-center text-muted">No hay historial disponible para este ticket.</p>'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      let errorMessage =
        '<p class="text-center text-danger">Error al cargar el historial.</p>';
      if (jqXHR.status === 0) {
        errorMessage =
          '<p class="text-center text-danger">Error de red: No se pudo conectar al servidor.</p>';
      } else if (jqXHR.status == 404) {
        errorMessage =
          '<p class="text-center text-danger">Recurso no encontrado. (Error 404)</p>';
      } else if (jqXHR.status == 500) {
        errorMessage =
          '<p class="text-center text-danger">Error interno del servidor. (Error 500)</p>';
      } else if (textStatus === "parsererror") {
        errorMessage =
          '<p class="text-center text-danger">Error al procesar la respuesta del servidor (JSON inválido).</p>';
      } else if (textStatus === "timeout") {
        errorMessage =
          '<p class="text-center text-danger">Tiempo de espera agotado al cargar el historial.</p>';
      } else if (textStatus === "abort") {
        errorMessage =
          '<p class="text-center text-danger">Solicitud de historial cancelada.</p>';
      }
      historyPanel.html(errorMessage);
      console.error("Error AJAX:", textStatus, errorThrown, jqXHR.responseText);
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const cerrar = document.getElementById("close-button");
  const icon = document.getElementById("Close-icon");

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

  if (icon) {
    icon.addEventListener("click", function () {
      if (modalInstance) {
        modalInstance.hide();
        currentTicketId = null;
      }
      document.getElementById("idSelectionTec").value = "";
    });
  } else {
    console.error("Elemento con ID 'Close-icon' no encontrado.");
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

  if (idTicket) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToTaller`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        Swal.fire({
            icon: "success",
            title: "Notificación", // <-- FIX IS HERE
            text:`El POS asociado al ticket Nro: ${nroticket} fue enviado a Taller`,
            color: "black",
            // Eliminamos 'timer' y 'timerProgressBar' si quieres un botón explícito
            showConfirmButton: true, // Muestra el botón de confirmación
            confirmButtonText: "Aceptar", // Texto del botón
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

// Asegúrate de que ENDPOINT_BASE y APP_PATH estén definidos en tu script,
// ya que los usas en la función handleSendToTallerClick.
// Ejemplo:
// const ENDPOINT_BASE = "http://localhost:8080/";
// const APP_PATH = "my-app/"; // Asegúrate de la barra final si es necesaria

function SendToDevolution(ticketId, currentnroTicket) {
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

    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Realmente deseas devolver el ticket ${currentnroTicket ? currentnroTicket : ticketId} al cliente?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#FF0000',
        confirmButtonText: 'Sí, devolver',
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
                                text: response.message || 'El ticket ha sido devuelto al cliente exitosamente.',
                                confirmButtonText: 'Entendido',
                                color: 'black',
                                confirmButtonColor: '#3085d6',
                            }).then(() => {
                                const devolverClienteModal = bootstrap.Modal.getInstance(document.getElementById('devolverClienteModal'));
                                if (devolverClienteModal) {
                                    devolverClienteModal.hide();
                                }
                                $('#observacionesDevolver').val('');
                                setTimeout(() => {
                                    location.reload();
                                }, 1500);
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