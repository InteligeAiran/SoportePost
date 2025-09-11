let currentTicketIdForConfirmTaller = null;
let currentNroTicketForConfirmTaller = null; // <--- NUEVA VARIABLE PARA EL NÚMERO DE TICKET
let confirmInTallerModalInstance = null;

$(document).ready(function () {

  // 1. Obtener el elemento del modal por su ID
  const confirmInTallerModalElement = document.getElementById("confirmInTallerModal");
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

  // Evento para manejar el clic en el botón "Confirmar" dentro del modal
  $("#confirmTallerBtn").on("click", function () {
    const ticketIdToConfirm = currentTicketIdForConfirmTaller;
    // const nroTicketToConfirm = currentNroTicketForConfirmTaller; // Si necesitas el nro_ticket aquí

    if (ticketIdToConfirm) {
      updateTicketStatusInTaller(ticketIdToConfirm);
      // Cierra el modal usando la instancia
      if (confirmInTallerModalInstance) {
        confirmInTallerModalInstance.hide();
      }
    } else {
      console.error("ID de ticket no encontrado para confirmar en taller.");
    }
  });

  // Llama a getTicketData() para cargar la tabla inicialmente
  getTicketData();
});

function getTicketData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketDataLab`);

    const tableElement = document.getElementById("tabla-ticket");
    const theadElement = tableElement
        ? tableElement.getElementsByTagName("thead")[0]
        : null;
    const tbodyElement = tableElement
        ? tableElement.getElementsByTagName("tbody")[0]
        : null;
    const tableContainer = document.querySelector("#tabla-ticket tbody");

    // Define column titles strictly based on your SQL function's output
    const columnTitles = {
        id_ticket: "ID Ticket",
        nro_ticket: "Nro Ticket",
        rif: "Rif",
        serial_pos: "Serial",
        razonsocial_cliente: "Razón Social", // Columna donde aplicaremos el truncado
        full_name_tecnicoassignado: "Técnico Asignado",
        fecha_envio_a_taller: "Fecha Envío a Taller",
        name_status_payment: "Estatus Pago",
        name_accion_ticket: "Acción Ticket",
        name_status_lab: "Estatus Taller",
        date_send_torosal_fromlab: "Fecha Envío a Rosal",
        date_sendkey: "Fecha Envío Llave",
    };

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const TicketData = response.ticket;

                    // MOSTRAR EL ESTADO DEL PRIMER TICKET (o el más reciente)
                    if (TicketData && TicketData.length > 0) {
                      const firstTicket = TicketData[0];
                      showTicketStatusIndicator(firstTicket.name_status_ticket, firstTicket.name_accion_ticket);
                    } else {
                      hideTicketStatusIndicator();
                    }

                    const detailsPanel = document.getElementById("ticket-details-panel");

                    // Limpiar el panel de detalles al cargar nuevos datos de la tabla
                    detailsPanel.innerHTML =
                        "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

                    if (TicketData && TicketData.length > 0) {
                        // Destroy DataTables if it's already initialized on this table
                        if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
                            $("#tabla-ticket").DataTable().destroy();
                            if (theadElement) theadElement.innerHTML = ""; // Clear old headers
                            if (tbodyElement) tbodyElement.innerHTML = ""; // Clear old body
                        }

                        const allDataKeys = Object.keys(TicketData[0] || {});
                        const columnsConfig = [];
                        const displayLengthForTruncate = 25; // Define la longitud a la que truncar el texto

                        // === LÓGICA PARA DETERMINAR SI LA COLUMNA "CARGA DE LLAVE" DEBE SER VISIBLE ===
                        // Por defecto, asumimos que no debe ser visible a menos que encontremos un ticket que la necesite
                        let shouldShowCargaLlaveColumn = false;
                        for (const ticket of TicketData) {
                            const hasSendKeyDate =
                                ticket.date_sendkey !== null &&
                                ticket.date_sendkey !== undefined &&
                                String(ticket.date_sendkey).trim() !== "";

                            // Si encontramos al menos un ticket que está "Reparado"
                            // Y NO tiene `date_sendkey` (es decir, necesita el checkbox)
                            if (ticket.name_status_lab === "Reparado" && !hasSendKeyDate) {
                                shouldShowCargaLlaveColumn = true;
                                break; // No necesitamos buscar más, la columna debe ser visible
                            }
                        }
                        // === FIN LÓGICA PARA DETERMINAR VISIBILIDAD DE COLUMNA ===

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

                                // Lógica para aplicar truncado/expansión a 'razonsocial_cliente'
                                if (key === "razonsocial_cliente") {
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
                                columnsConfig.push(columnDef);
                            }
                        }

                        // Añadir la columna de "Acciones" al final
                        columnsConfig.push({
                            data: null,
                            title: "Acciones",
                            orderable: false,
                            searchable: false,
                            width: "12%",
                            render: function (data, type, row) {
                                const idTicket = row.id_ticket;
                                const currentStatus = row.name_status_lab;
                                const nroTicket = row.nro_ticket;
                                const confirmTaller = row.confirmreceive;
                                const serialPos = row.serial_pos || ""; // Asegúrate de que serial_pos esté definido
                                const confirm_date_repuesto = row.confirm_date;

                                let buttonsHtml = "";

                                if (currentStatus === "Reparado") {
                                    buttonsHtml += `<button class="btn btn-warning btn-sm" disabled>Reparado</button>`;
                                } else if (currentStatus === "Irreparable") {
                                    buttonsHtml += `<button class="btn btn-danger btn-sm" disabled>Irreparable</button>`;
                                } else if (
                                    currentStatus === "Recibido en Taller" ||
                                    confirmTaller === "f"
                                ) {
                                    buttonsHtml += `
                                        <button type="button" id = "CheckConfirmTaller"  class="btn btn-warning btn-sm confirm-waiting-btn"
                                            title="En espera de confirmar en el taller" data-serial-pos = "${serialPos}"  data-id-ticket="${idTicket}" data-nro-ticket="${nroTicket}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16">
                                                <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"/>
                                            </svg>
                                        </button>
                                    `;
                                }else if(confirm_date_repuesto === "t"){
                                   `<button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-btn ms-2" title = "Espere la llegada de los repuesto para cambiar el estatus"
                                          data-bs-toggle="modal"
                                          data-bs-target="#changeStatusModal"
                                          data-id="${idTicket}"
                                          data-current-status="${currentStatus}"
                                          disabled>
                                      Cambiar Estatus
                                  </button>`
                                
                                } else {
                                    buttonsHtml += `
                                        <button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-btn ms-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#changeStatusModal"
                                            data-id="${idTicket}"
                                            data-current-status="${currentStatus}">
                                            Cambiar Estatus
                                        </button>
                                    `;
                                }
                                return buttonsHtml;
                            },
                        });

                        // === ADD "CARGA DE LLAVE" COLUMN (CHECKBOX) ===
                        columnsConfig.push({
                            data: null,
                            title: "Carga de Llave",
                            name: "carga_de_llave", // <-- Añade esta línea para darle un nombre
                            orderable: false,
                            searchable: false,
                            visible: shouldShowCargaLlaveColumn, // <--- APLICA LA VISIBILIDAD AQUI
                            className: "dt-body-center",
                            render: function (data, type, row) {
                                const hasSendKeyDate =
                                    row.date_sendkey !== null &&
                                    row.date_sendkey !== undefined &&
                                    String(row.date_sendkey).trim() !== "";

                                if (row.name_status_lab === "Reparado" && !hasSendKeyDate) {
                                    return `<input type="checkbox" class="receive-key-checkbox" data-id-ticket="${row.id_ticket}" data-nro-ticket="${row.nro_ticket}">`;
                                } else if (hasSendKeyDate) {
                                    // Si la columna es visible y tiene fecha, puedes mostrar el ícono de check
                                    return '<i class="bi bi-check-circle-fill text-success" title="Llave Recibida"></i>';
                                }
                                return "";
                            },
                        });

                        // === ADD "CARGA DE LLAVE (BOTÓN)" COLUMN ===
                        columnsConfig.push({
                            data: null,
                            title: "Acción", // Nuevo título para la columna del botón
                            name: "Enviar_AlRosal", // Nombre para la columna del botón
                            orderable: false,
                            searchable: false,
                            visible: true, // El botón SIEMPRE es visible si la columna es visible
                            className: "dt-body-center",
                            render: function (data, type, row) {
                                // El botón solo se muestra si el estado es 'Reparado'.
                                // La lógica de si la llave ya fue enviada se maneja en el event listener del botón.
                                if (row.name_status_lab === "Reparado") {
                                    // Añadimos un data-attribute para la fecha de envío para verificarla en el click
                                    const hasSendKeyDate =
                                        row.date_sendkey !== null &&
                                        row.date_sendkey !== undefined &&
                                        String(row.date_sendkey).trim() !== "";

                                    // Pasamos la información de si ya fue enviada al botón
                                    const dataSent = hasSendKeyDate ? 'true' : 'false';

                                                          return `<button class="btn btn-info btn-sm load-key-button" 
                                                                    title="Enviar Al Rosal" 
                                                                    data-id-ticket="${row.id_ticket}" 
                                                                    data-nro-ticket="${row.nro_ticket}" 
                                                                    data-has-send-key-date="${dataSent}"
                                                                    data-serial-pos="${row.serial_pos}">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                                                                      <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
                                                                    </svg>
                                                                  </button>`;
                                                      } else {
                                                          return ""; // No mostrar nada si no es "Reparado"
                                                      }
                                                  },
                                              });

                                              // Initialize DataTables
                                              const dataTableInstance = $(tableElement).DataTable({
                                                    order: [
                                                      [0, 'desc']
                                                    ], // Esto ordena
                                                  scrollX: "200px",
                                                  responsive: false,
                                                  data: TicketData,
                                                  columns: columnsConfig,
                                                  pagingType: "simple_numbers",
                                                  lengthMenu: [5, 10, 25, 50, 100],
                                                  autoWidth: false,
                                                  buttons: [
                                                      {
                                                          extend: "colvis",
                                                          text: "Mostrar/Ocultar Columnas",
                                                          className: "btn btn-secondary",
                                                      },
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
                                                      buttons: {
                                                          colvis: "Visibilidad de Columna",
                                                      },
                                                  },
                                                  // === APLICACIÓN DE CAMBIOS PARA LOS BOTONES DE FILTRO ===
                          dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
                          initComplete: function (settings, json) {
                              const dataTableInstance = this.api(); // Obtén la instancia de la API de DataTables
                              const buttonsHtml = `
                                  <button id="btn-por-asignar" class="btn btn-secondary me-2" title="Tickets en espera de confirmar recibido en el Taller">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                                      <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                    </svg>
                                  </button>

                                  <button id="btn-asignados" class="btn btn-secondary me-2" title="Tickets en Taller">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                                      <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>
                                    </svg>
                                  </button>

                                  <button id="btn-recibidos" class="btn btn-secondary me-2" title="Tickets Por confirmar carga de llaves">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                                      <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                                    </svg>
                                  </button>

                                  <button id="btn-devuelto" class="btn btn-secondary me-2" title="Tickets Enviados al Rosal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
                                      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
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
                              function checkDataExists(searchColumn, searchTerm) {
                                  dataTableInstance.columns().search('').draw(false);
                                  
                                  const filteredData = dataTableInstance.column(searchColumn).search(searchTerm, true, false).draw();
                                  const rowCount = dataTableInstance.rows({ filter: 'applied' }).count();
                                  
                                  return rowCount > 0;
                              }

                              // Función para buscar automáticamente el primer botón con datos
                              function findFirstButtonWithData() {
                                  const searchTerms = [
                                      { button: "btn-por-asignar", column: 9, term: "Recibido en Taller", status: "En proceso", action: "Recibido en Taller"},
                                      { button: "btn-asignados", column: 8, term: "Enviado a taller", status: "En proceso", action: "Enviado a taller"},
                                      { button: "btn-recibidos", column: 8, term: "En espera confirmación carga de llaves", status: "En proceso", action: "En espera confirmación carga de llaves" },
                                      { button: "btn-devuelto", column: 8, term: "En el Rosal", status: "En proceso", action: "En el Rosal"}
                                  ];

                                  for (let i = 0; i < searchTerms.length; i++) {
                                      const { button, column, term, status, action} = searchTerms[i];
                                      
                                      if (checkDataExists(column, term)) {
                                          // Si hay datos, aplicar la búsqueda y activar el botón
                                          dataTableInstance.columns().search('').draw(false);
                                          dataTableInstance.column(column).search(term, true).draw();
                                          
                                          // Aplicar configuración específica para cada botón
                                          if (button === "btn-por-asignar") {
                                              dataTableInstance.column('carga_de_llave:name').visible(false);
                                              dataTableInstance.column('Enviar_AlRosal:name').visible(false);
                                              dataTableInstance.column(11).visible(false);
                                              dataTableInstance.column(10).visible(false);
                                              showTicketStatusIndicator(status, action);
                                          } else if (button === "btn-asignados") {
                                              dataTableInstance.column('carga_de_llave:name').visible(true);
                                              dataTableInstance.column('Enviar_AlRosal:name').visible(true);
                                              dataTableInstance.column(11).visible(false);
                                              dataTableInstance.column(10).visible(false);
                                              // Aplicar segunda búsqueda para este botón
                                              dataTableInstance.column(9).search("En proceso de Reparación|Reparado|Pendiente por repuesto", true, false, true).draw();
                                              showTicketStatusIndicator(status, ["En proceso de Reparación", "Reparado|Pendiente por repuesto", "Reparado"]);
                                          } else if (button === "btn-recibidos") {
                                              dataTableInstance.column('carga_de_llave:name').visible(false);
                                              dataTableInstance.column('Enviar_AlRosal:name').visible(true);
                                              dataTableInstance.column(11).visible(true);
                                              showTicketStatusIndicator(status, action);
                                          } else if (button === "btn-devuelto") {
                                              // Ocultar botones y checkboxes
                                              document.querySelectorAll(".load-key-button").forEach(button => {
                                                  button.style.display = "none";
                                              });
                                              document.querySelectorAll(".receive-key-checkbox").forEach(checkbox => {
                                                  checkbox.style.display = "none";
                                              });
                                          }
                                          
                                          setActiveButton(button);
                                          return true; // Encontramos datos
                                      }
                                  }
                                  
                                  // Si no hay datos en ningún botón, mostrar mensaje
                                  dataTableInstance.columns().search('').draw(false);
                                  dataTableInstance.column(8).search("NO_DATA_FOUND").draw(); // Búsqueda que no devuelve resultados
                                  setActiveButton("btn-por-asignar"); // Mantener el primer botón activo por defecto
                                 showTicketStatusIndicator('Cerrado', 'No hay datos');
                                  
                                  // Mostrar mensaje de que no hay datos
                                  const tbody = document.querySelector("#tabla-ticket tbody");
                                  if (tbody) {
                                      tbody.innerHTML = '<tr><td colspan="14" class="text-center text-muted">No hay tickets disponibles en ningún estado</td></tr>';
                                  }
                                  
                                  return false;
                              }

                              // Ejecutar la búsqueda automática al inicializar
                              findFirstButtonWithData();

                              // Event listeners para los botones (mantener la funcionalidad manual)
                              $("#btn-por-asignar").on("click", function () {
                                  if (checkDataExists(9, "Recibido en Taller")) {
                                      dataTableInstance.columns().search('').draw(false);
                                      dataTableInstance.column(9).search("Recibido en Taller", true).draw();
                                      dataTableInstance.column('carga_de_llave:name').visible(false);
                                      dataTableInstance.column('Enviar_AlRosal:name').visible(false);
                                      dataTableInstance.column(11).visible(false);
                                      dataTableInstance.column(10).visible(false);
                                      setActiveButton("btn-por-asignar");
                                      showTicketStatusIndicator('En proceso', 'Recibido en Taller');
                                  } else {
                                      findFirstButtonWithData();
                                  }
                              });

                              // Tus event listeners de clic están correctos
                              $("#btn-asignados").on("click", function () {
                                  if (checkDataExists(8, "En Taller")) {
                                      dataTableInstance.columns().search('').draw(false);
                                      dataTableInstance.column(8).search("En Taller", true).draw();
                                      dataTableInstance.column(9).search("En proceso de Reparación|Reparado|Pendiente por repuesto", true, false, true).draw();
                                      dataTableInstance.column('carga_de_llave:name').visible(true);
                                      dataTableInstance.column('Enviar_AlRosal:name').visible(true);
                                      dataTableInstance.column(11).visible(false);
                                      dataTableInstance.column(10).visible(false);
                                      setActiveButton("btn-asignados");
                                      showTicketStatusIndicator('En proceso', ['En proceso de Reparación', 'Reparado', 'Pendiente por repuesto']);
                                  } else {
                                      findFirstButtonWithData();
                                  }
                              });

                              $("#btn-recibidos").on("click", function () {
                                  if (checkDataExists(8, "En espera confirmación carga de llaves")) {
                                      dataTableInstance.columns().search('').draw(false);
                                      dataTableInstance.column(8).search("En espera confirmación carga de llaves", true).draw();
                                      dataTableInstance.column(11).visible(true);
                                      dataTableInstance.column('carga_de_llave:name').visible(false);
                                      dataTableInstance.column('Enviar_AlRosal:name').visible(true);
                                      setActiveButton("btn-recibidos");
                                      showTicketStatusIndicator('En proceso', 'Confirmación carga de llaves');
                                  } else {
                                      findFirstButtonWithData();
                                  }
                              });

                              $("#btn-devuelto").on("click", function () {
                                  if (checkDataExists(8, "En el Rosal")) {
                                      dataTableInstance.columns().search('').draw(false);
                                      dataTableInstance.column(8).search("En el Rosal").draw();

                                      // Obtener todos los botones de carga de llave y ocultarlos
                                      document.querySelectorAll(".load-key-button").forEach(button => {
                                          button.style.display = "none";
                                      });

                                      document.querySelectorAll(".receive-key-checkbox").forEach(checkbox => {
                                          checkbox.style.display = "none"; // Ocultar checkboxes
                                      });

                                      setActiveButton("btn-devuelto");
                                      showTicketStatusIndicator('En proceso', 'En el Rosal');
                                  } else {
                                      findFirstButtonWithData();
                                  }
                              });

                          },
                        });

                        // ... (El resto de tus event listeners: .truncated-cell, .load-key-button, tr click, .confirm-waiting-btn) ...
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
                                    const displayLength = 25; // La misma longitud de truncado usada en el render
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

                       // ************* INICIO: LÓGICA PARA EL BOTÓN "ENVIAR AL ROSAL" *************
                        $("#tabla-ticket tbody")
                            .off("click", ".load-key-button") // Evita múltiples listeners
                            .on("click", ".load-key-button", function (e) {
                                e.stopPropagation(); // Evita que el clic en el botón active el clic de la fila.

                                const ticketId = $(this).data("id-ticket");
                                const nroTicket = $(this).data("nro-ticket");
                                const hasSendKeyDate = $(this).data("has-send-key-date"); // Leer el atributo del botón
                                const serialPos = $(this).data("serial-pos");

                                if (hasSendKeyDate != true) { // Ojo: Los data attributes devuelven booleanos si son 'true'/'false'
                                  const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                                  Swal.fire({
                                      title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                                                <div class="custom-modal-header-content">Confirmar envio al rosal</div>
                                              </div>`,
                                    html: `<div class="custom-modal-body-content">
                                              <div class="mb-4">
                                                ${customWarningSvg}
                                              </div>
                                              <p class="h4 mb-3" style = "color: black;">¿Desea enviar al rosal el Pos asociado <span id = "numeroserial" style = "display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; ">${serialPos}</span> al Nro de ticket: <span style = "display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> <span style = "color: #004242;">Sin cargar las llaves?</span></p>
                                            </div>`,
                                    confirmButtonText: "Si",
                                    color: "black",
                                    confirmButtonColor: "#003594",
                                    cancelButtonText: "No",
                                    showCancelButton: true,
                                    showConfirmButton: true,
                                    focusConfirm: false,
                                    allowOutsideClick: false, 
                                    allowEscapeKey: false,
                                  }).then((result) => { // Aquí capturamos la respuesta del usuario
                                    if (result.isConfirmed) {
                                      sendTicketToRosal1(ticketId, nroTicket, false, serialPos); // `true` podría indicar "sin llaves"
                                    }
                                  });
                                  return; // Detiene la ejecución aquí, no abre el modal de confirmación
                                }else{
                                $("#modalTicketNroSendKey").text(nroTicket);
                                $("#modalHiddenTicketIdSendKey").val(ticketId); // Guardar el ID en un hidden input
                                sendTicketToRosal(ticketId, nroTicket, true, serialPos); // `true` podría indicar "sin llaves"
                              }
                            });
                        // ************* FIN: LÓGICA PARA EL BOTÓN "ENVIAR AL ROSAL" *************


                        // === ADD THE CLICK EVENT LISTENER FOR TABLE ROWS HERE ===
                        $("#tabla-ticket tbody")
                            .off("click", "tr") // .off() to prevent multiple bindings if called multiple times
                            .on("click", "tr", function (e) {
                                // Asegúrate de que el clic no proviene de una celda truncable/expandible o de un botón.
                                if ($(e.target).hasClass('truncated-cell') || $(e.target).hasClass('expanded-cell') || $(e.target).is('button') || $(e.target).is('input[type="checkbox"]')) {
                                    return; // Si el clic fue en la celda del checkbox o el botón, no activar el evento de la fila.
                                }

                                const tr = $(this);
                                const rowData = dataTableInstance.row(tr).data();

                                if (!rowData) {
                                    return;
                                }

                                $("#tabla-ticket tbody tr").removeClass("table-active");tr.addClass("table-active");

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
                                                '__DIR__ . "/../../../public/img/consulta_rif/POS/mantainment.png'; // Corrige esta ruta si es JS puro y no PHP
                                            imgElement.alt = "Serial no disponible";
                                        }
                                    }
                                } else {
                                    detailsPanel.innerHTML =
                                        "<p>No se encontraron detalles para este ticket.</p>";
                                }
                            });
                        // === END CLICK EVENT LISTENER ===

                        $("#tabla-ticket tbody")
                            .off("click", ".confirm-waiting-btn")
                            .on("click", ".confirm-waiting-btn", function (e) {
                                e.stopPropagation();
                                const ticketId = $(this).data("id-ticket");
                                const nroTicket = $(this).data("nro-ticket");
                                const serialPos = $(this).data("serial-pos") || ""; // Asegúrate de que serial_pos esté definido


                                currentTicketIdForConfirmTaller = ticketId;
                                currentNroTicketForConfirmTaller = nroTicket;

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

                        if (tableContainer) {
                            tableContainer.style.display = ""; // Show the table container
                            }
                    } else {
                        if (tableContainer) {
                            tableContainer.innerHTML = "<p>No hay datos disponibles.</p>";
                            tableContainer.style.display = "";
                        }
                    }
                } else {
                    if (tableContainer) {
                        tableContainer.innerHTML =
                            "<p>Error al cargar los datos: " +
                            (response.message || "Mensaje desconocido") +
                            "</p>";
                        tableContainer.style.display = "";
                    }
                    console.error("Error from API:", response.message);
                }
            } catch (error) {
                if (tableContainer) {
                    tableContainer.innerHTML = "<p>Error al procesar la respuesta.</p>";
                    tableContainer.style.display = "";
                }
                console.error("Error parsing JSON:", error);
            }
        } else if (xhr.status === 404) {
            if (tableContainer) {
              tableContainer.innerHTML = `<tr>
        <td colspan="14" class="text-center text-muted py-5">
          <div class="d-flex flex-column align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
              <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
            <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
            <p class="text-muted mb-0">No hay tickets en Taller para mostrar en este momento.</p>
          </div>
        </td>
      </tr>`
                tableContainer.style.display = "";
            }
        } else {
            if (tableContainer) {
                tableContainer.innerHTML = `<p>Error de conexión: ${xhr.status} ${xhr.statusText}</p>`;
                tableContainer.style.display = "";
            }
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

    xhr.send();
}

/**
 * Función para manejar el envío del ticket a Gestión Rosal usando XMLHttpRequest.
 * @param {string} id - El ID del ticket.
 * @param {string} nro - El número de ticket.
 * @param {boolean} withoutKeys - Indica si el envío es "sin llaves" (opcional).
 * @param {string} serialPos
 */
function sendTicketToRosal(id, nro, withoutKeys, serialPos) {
    const id_user = document.getElementById("userId").value; // Obtener el ID del usuario desde el formulario
    const url = `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToGestionRosal`; // **IMPORTANTE: Define la URL correcta para tu backend**
    const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;

    // 1. Mostrar el modal de confirmación antes de enviar la solicitud
    Swal.fire({
       title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
              <div class="custom-modal-header-content">Confirmar Envío</div>
            </div>`,
        html: `<div class="custom-modal-body-content">
                  <div class="mb-4">
                    ${customWarningSvg}
                  </div>
                  <p class="h4 mb-3"  style = "color: black">¿Seguro que desea Enviar el Pos con el Serial <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> asociado al Nro de ticket: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro}</span> a Gestión Rosal?</p>`,
        showCancelButton: true,
        confirmButtonColor: "#003594", // Color para el botón 'Sí'
        cancelButtonColor: "#d33",   // Color para el botón 'No'
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",
        color: "black",
    }).then((result) => {
        // 2. Verificar la respuesta del usuario en el modal de confirmación
        if (result.isConfirmed) {
            // Si el usuario hace clic en "Sí, enviar", procedemos con la lógica de la solicitud XHR
            const dataToSendString = `action=SendToGestionRosal&ticketId=${encodeURIComponent(id)}&sendWithoutKeys=${encodeURIComponent(withoutKeys)}&id_user=${encodeURIComponent(id_user)}`;
            const xhr = new XMLHttpRequest();

            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success === true) {
                            const nroticket = nro; // Ya tienes 'nro' disponible aquí
                            Swal.fire({
                                title: "¡Enviado!",
                                html: `El Pos asociado al ticket Nro: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroticket}</span> se ha enviado a <span style = "<span style = "border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Gestión Rosal</span> correctamente.`,
                                icon: "success",
                                confirmButtonText: "Ok",
                                confirmButtonColor: "#003594",
                                color: "black",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                keydownListenerCapture: true
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.reload(); // Recargar la página
                                }
                            });
                        } else {
                          hideTicketStatusIndicator
                            // Si la API retorna success: false o un error en el cuerpo
                            console.warn("La API retornó éxito: falso o un valor inesperado:", response);
                            Swal.fire({
                                title: "Error al enviar",
                                text: response.message || "No se pudo enviar el ticket a Gestión Rosal. (Mensaje inesperado)",
                                icon: "error",
                                confirmButtonText: "Ok",
                                confirmButtonColor: "#d33",
                                color: "black",
                            });
                        }
                    } catch (error) {
                      hideTicketStatusIndicator
                        console.error("Error al analizar la respuesta JSON para el envío al Rosal:", error, xhr.responseText);
                        Swal.fire({
                            title: "Error de Procesamiento",
                            text: "Hubo un problema al procesar la respuesta del servidor.",
                            icon: "error",
                            confirmButtonText: "Ok",
                            confirmButtonColor: "#d33",
                            color: "black",
                        });
                    }
                } else {
                  hideTicketStatusIndicator
                    // Errores HTTP como 404, 500, etc.
                    console.error("Error al enviar el ticket (HTTP):", xhr.status, xhr.statusText, xhr.responseText);
                    Swal.fire({
                        title: "Error del Servidor",
                        text: `No se pudo comunicar con el servidor. Código: ${xhr.status} - ${xhr.statusText}`,
                        icon: "error",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#d33",
                        color: "black",
                    });
                }
            };

            xhr.onerror = function () {
                hideTicketStatusIndicator
                console.error("Error de red al intentar enviar el ticket al Rosal.");
                Swal.fire({
                    title: "Error de Conexión",
                    text: "Hubo un problema de red. Por favor, inténtalo de nuevo.",
                    icon: "error",
                    confirmButtonText: "Ok",
                    confirmButtonColor: "#d33",
                    color: "black",
                });
            };

            xhr.send(dataToSendString); // Envía la solicitud solo si se confirmó
        } else {
            // Si el usuario hace clic en "No, cancelar" o cierra el modal, simplemente no se hace nada
            console.log("Envío cancelado por el usuario.");
        }
    });
}


function sendTicketToRosal1(id, nro, withoutKeys, serialPos) {
    const id_user = document.getElementById("userId").value; // Obtener el ID del usuario desde el formulario
    const url = `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToGestionRosal`; // **IMPORTANTE: Define la URL correcta para tu backend**
      
            // Si el usuario hace clic en "Sí, enviar", procedemos con la lógica de la solicitud XHR
            const dataToSendString = `action=SendToGestionRosal&ticketId=${encodeURIComponent(id)}&sendWithoutKeys=${encodeURIComponent(withoutKeys)}&id_user=${encodeURIComponent(id_user)}`;
            const xhr = new XMLHttpRequest();

            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success === true) {
                            const nroticket = nro; // Ya tienes 'nro' disponible aquí
                            Swal.fire({
                                title: "¡Enviado!",
                                html: `El Pos asociado al ticket Nro: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroticket}</span> se ha enviado a Gestión Rosal correctamente.`,
                                icon: "success",
                                confirmButtonText: "Ok",
                                confirmButtonColor: "#003594",
                                color: "black",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.reload(); // Recargar la página
                                }
                            });
                        } else {
                            // Si la API retorna success: false o un error en el cuerpo
                            console.warn("La API retornó éxito: falso o un valor inesperado:", response);
                            Swal.fire({
                                title: "Error al enviar",
                                text: response.message || "No se pudo enviar el ticket a Gestión Rosal. (Mensaje inesperado)",
                                icon: "error",
                                confirmButtonText: "Ok",
                                confirmButtonColor: "#d33",
                                color: "black",
                            });
                        }
                    } catch (error) {
                        console.error("Error al analizar la respuesta JSON para el envío al Rosal:", error, xhr.responseText);
                        Swal.fire({
                            title: "Error de Procesamiento",
                            text: "Hubo un problema al procesar la respuesta del servidor.",
                            icon: "error",
                            confirmButtonText: "Ok",
                            confirmButtonColor: "#d33",
                            color: "black",
                        });
                    }
                } else {
                    // Errores HTTP como 404, 500, etc.
                    console.error("Error al enviar el ticket (HTTP):", xhr.status, xhr.statusText, xhr.responseText);
                    Swal.fire({
                        title: "Error del Servidor",
                        text: `No se pudo comunicar con el servidor. Código: ${xhr.status} - ${xhr.statusText}`,
                        icon: "error",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#d33",
                        color: "black",
                    });
                }
            };

            xhr.onerror = function () {
                // Errores de red como conexión perdida
                console.error("Error de red al intentar enviar el ticket al Rosal.");
                Swal.fire({
                    title: "Error de Conexión",
                    text: "Hubo un problema de red. Por favor, inténtalo de nuevo.",
                    icon: "error",
                    confirmButtonText: "Ok",
                    confirmButtonColor: "#d33",
                    color: "black",
                });
            };
            xhr.send(dataToSendString); // Envía la solicitud solo si se confirmó
}

function updateTicketStatusInTaller(ticketId) {
  const id_user = document.getElementById("userId").value;

  const dataToSendString = `action=UpdateStatusToReceiveInTaller&id_user=${encodeURIComponent(
    id_user
  )}&id_ticket=${encodeURIComponent(ticketId)}`;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateStatusToReceiveInTaller`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success === true) {
          // Or `response.success == "true"` if your backend sends a string
          Swal.fire({
            // Changed from swal(...) to Swal.fire(...)
            title: "¡Notificación!",
            html: `El POS se encontrará en el taller como <span style = "border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">'En Proceso de reparación'</span>.`,
            icon: "success",
            confirmButtonText: "Ok", // SweetAlert2 uses confirmButtonText
            confirmButtonColor: "#003594 ", // SweetAlert2 uses confirmButtonColor
            color: "black",
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
                          ${d.fecha_instalacion ||  'No posee'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Fecha último ticket:</div></strong>
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

          const cleanString = (str) => {
            if (!str) return null;
            const trimmed = str.replace(/\s/g, ' ').trim();
            return trimmed === '' ? null : trimmed;
          };

          const itemAccion = cleanString(item.name_accion_ticket);
          const prevAccion = cleanString(prevItem.name_accion_ticket);
          const accionChanged = prevAccion && itemAccion !== prevAccion;

          // CORRECCIÓN: Lógica para Coordinador
          const itemCoord = cleanString(item.full_name_coordinador);
          const prevCoord = cleanString(prevItem.full_name_coordinador);
          const coordChanged = (prevCoord && itemCoord && prevCoord !== itemCoord) ||
                                (prevCoord && !itemCoord) ||
                                (!prevCoord && itemCoord);

          // CORRECCIÓN: Lógica para Usuario Gestión
          const itemUsuarioGestion = cleanString(item.usuario_gestion);
          const prevUsuarioGestion = cleanString(prevItem.usuario_gestion);
          const usuarioGestionChanged = (prevUsuarioGestion && itemUsuarioGestion && prevUsuarioGestion !== itemUsuarioGestion) ||
                                         (prevUsuarioGestion && !itemUsuarioGestion) ||
                                         (!prevUsuarioGestion && itemUsuarioGestion);
          
          const itemTecnico = cleanString(item.full_name_tecnico_n2_history);
          const prevTecnico = cleanString(prevItem.full_name_tecnico_n2_history);
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

          const itemMotivoRechazo = cleanString(item.name_motivo_rechazo);
          const prevMotivoRechazo = cleanString(prevItem.name_motivo_rechazo);
          const motivoRechazoChanged = prevMotivoRechazo && itemMotivoRechazo !== prevMotivoRechazo;

          const showComponents = itemAccion === 'Actualización de Componentes' && itemComponents;
          const shouldHighlightComponents = showComponents && (accionChanged || componentsChanged);

          const itemPago = cleanString(item.pago);
          const itemExoneracion = cleanString(item.exoneracion);
          const itemEnvio = cleanString(item.envio);
          const itemEnvioDestino = cleanString(item.envio_destino);

          const prevPago = cleanString(prevItem.pago);
          const prevExoneracion = cleanString(prevItem.exoneracion);
          const prevEnvio = cleanString(prevItem.envio);
          const prevEnvioDestino = cleanString(prevItem.envio_destino);

          const pagoChanged = prevPago && itemPago !== prevPago;
          const exoneracionChanged = prevExoneracion && itemExoneracion !== prevExoneracion;
          const envioChanged = prevEnvio && itemEnvio !== prevEnvio;
          const envioDestinoChanged = prevEnvioDestino && itemEnvioDestino !== prevEnvioDestino;

          const rejectedActions = [
            'Documento de Exoneracion Rechazado',
            'Documento de Anticipo Rechazado'         
         ];
          const showMotivoRechazo = rejectedActions.includes(cleanString(item.name_status_payment)) && itemMotivoRechazo;

          // Solo mostrar comentario de devolución si:
          // 1. La acción es "En espera de Confirmar Devolución"
          // 2. Existe el comentario
          // 3. NO hay documento de envío a destino (envio_destino !== 'Sí')
          const showCommentDevolution = itemAccion === 'En espera de Confirmar Devolución' && 
                                       item.comment_devolution && 
                                       itemEnvioDestino !== 'Sí';
          const showCommentReasignation = itemAccion === 'Reasignado al Técnico' && item.comment_reasignation && item.comment_reasignation.trim() !== '';

          let headerStyle = isLatest ? "background-color: #ffc107;" : "background-color: #5d9cec;";
          let textColor = isLatest ? "color: #343a40;" : "color: #ffffff;";
          
          let statusHeaderText;
          if (itemAccion === "Enviado a taller" || itemAccion === "En Taller") {
            statusHeaderText = ` (${item.name_status_lab || "Desconocido"})`;
          } else {
            statusHeaderText = ` (${item.name_status_ticket || "Desconocido"})`;
          }

          if (showCommentDevolution) {
            historyHtml += `
              <div class="alert alert-warning alert-sm mb-2" style="color: white;">
                <strong>Comentario de Devolución:</strong> ${item.comment_devolution}
              </div>
            `;
          }

          if (showCommentReasignation) {
            historyHtml += `
              <div class="alert alert-info alert-sm mb-2" style="color: white;">
                <strong>Comentario de Reasignación:</strong> ${item.comment_reasignation}
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
                                                    <th class="text-start">Operador Ticket:</th>
                                                    <td>${item.operador_ticket || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Usuario Gestión:</th>
                                                    <td class="${usuarioGestionChanged ? "highlighted-change" : ""}">${item.usuario_gestion || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td class="${coordChanged ? "highlighted-change" : ""}">${item.full_name_coordinador || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                  <th class="text-start">Coordinación:</th>
                                                  <td>${item.nombre_coordinacion || "N/A"}</td>
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
                                                    <td class="${motivoRechazoChanged ? "highlighted-change" : ""}">${item.name_motivo_rechazo || "N/A"}</td>
                                                  </tr>
                                             ` : ''}
                                                ${showCommentDevolution ? `
                                                  <tr>
                                                    <th class="text-start">Comentario de Devolución:</th>
                                                    <td class="highlighted-change">${item.comment_devolution || "N/A"}</td>
                                                  </tr>
                                             ` : ''}
                                                ${showCommentReasignation ? `
                                                  <tr>
                                                    <th class="text-start">Comentario de Reasignación:</th>
                                                    <td class="highlighted-change">${item.comment_reasignation || "N/A"}</td>
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
                                                    <td class="${envioChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                  </tr>
                                             ` : ''}
                                                ${itemEnvioDestino === 'Sí' ? `
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
 const changeStatusModal = document.getElementById("changeStatusModal");
  // Estas variables son cruciales porque son accesibles para changeStatusTicket
  const estatusActualInput = changeStatusModal
    ? changeStatusModal.querySelector("#modalCurrentStatus")
    : null;
  const modalTicketIdInput = changeStatusModal
    ? changeStatusModal.querySelector("#modalTicketId")
    : null;
  const modalNewStatusSelect = changeStatusModal
    ? changeStatusModal.querySelector("#modalNewStatus")
    : null;
  const modalSubmitBtn = changeStatusModal
    ? changeStatusModal.querySelector("#saveStatusChangeBtn")
    : null; // CORREGIDO AQUÍ

  const updateTicketStatusForm = changeStatusModal
    ? changeStatusModal.querySelector("#changeStatusForm")
    : null; // CORREGIDO AQUÍ

 function showCustomModal(currentStatus, idTicket) {
      if (estatusActualInput) {
        estatusActualInput.value = currentStatus;
      }

      if (modalTicketIdInput) {
        // Aquí usamos directamente idTicket, que es un parámetro de la función
        modalTicketIdInput.value = idTicket;
      }

      if (modalNewStatusSelect) {
        modalNewStatusSelect.setAttribute(
          "data-current-status-name",
          currentStatus
        );
        // Llamamos a getStatusLab SOLO CUANDO se abre el modal para filtrar.
        getStatusLab(currentStatus); // Pasamos el estatus actual para filtrar
      }

      changeStatusModal.classList.add("show");
      changeStatusModal.style.display = "block";
      changeStatusModal.setAttribute("aria-modal", "true");
      changeStatusModal.setAttribute("role", "dialog");

      document.body.classList.add("modal-open");
      const backdrop = document.createElement("div");
      backdrop.classList.add("modal-backdrop", "fade", "show");
      backdrop.id = "custom-modal-backdrop";
      document.body.appendChild(backdrop);
    }

    function hideCustomModal() {
      changeStatusModal.classList.remove("show");
      changeStatusModal.style.display = "none";
      changeStatusModal.removeAttribute("aria-modal");
      changeStatusModal.removeAttribute("role");

      document.body.classList.remove("modal-open");
      const backdrop = document.getElementById("custom-modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    }

// Call getTicketData when the document is ready using jQuery
$(document).ready(function () {

  // --- NUEVA LÓGICA PARA EL CHECKBOX DE "CARGA DE LLAVE" ---
 $("#tabla-ticket tbody")
    .off("change", ".receive-key-checkbox") // Evita múltiples listeners
    .on("change", ".receive-key-checkbox", function (e) {
        e.stopPropagation(); // Evita que el clic en el checkbox active el clic de la fila.
    const checkbox = $(this);
    const idTicket = checkbox.data("id-ticket");
    const nro_ticket = checkbox.data("nro-ticket");

    if (checkbox.is(":checked")) {
      const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
      Swal.fire({
        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
              <div class="custom-modal-header-content">Confirmación de Envio de Llaves</div>
            </div>`,        
            /*title: `¿Deseas Cargar las llaves al ticket Nro: ${nro_ticket}?`, // <-- CAMBIO AQUÍ*/
        html: ` <div class="custom-modal-body-content">
                  <div class="mb-4">
                    ${customWarningSvg}
                  </div>
                    <p class="h4 mb-3" style = "color: #343a40">¿Deseas Cargar las llaves con el Nro de ticket:<span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span>?</p><br><span style = 'color:red;'>Confirmar carga de llaves en 'Gestión Rosal'.</span>
                    <span style = "font-size: 70%; display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Esta acción registrará la fecha de recepción de las llaves</span>
                </div>`,
                
        showCancelButton: true,
        confirmButtonColor: "#003594",
        confirmButtonClass: "swal2-confirm-hover-green", // Clase personalizada para el hover
        cancelButtonColor: "#6c757d", // Color inicial gris (ajusta si quieres otro color inicial)
        cancelButtonClass: "swal2-cancel-hover-red", // Clase personalizada para el hover
        confirmButtonText: "Cargar Llaves",
        cancelButtonText: "Cancelar",
        color: "#000000", // Color del texto general del modal
        focusConfirm: false,
        allowOutsideClick: false, 
        allowEscapeKey: false,
        keydownListenerCapture: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, llamar a la función para guardar la fecha
          saveKeyReceiveDate(idTicket, nro_ticket);
        } else {
          // Si el usuario cancela, desmarcar el checkbox
          checkbox.prop("checked", false);
        }
      });
    }
    // Si el checkbox se desmarca, no hacemos nada o puedes añadir otra lógica si lo necesitas.
  });

  // --- NUEVA FUNCIÓN PARA ENVIAR LA FECHA AL SERVIDOR ---
  function saveKeyReceiveDate(idTicket, nro_ticket) {
    const id_user = document.getElementById("userId").value; // Asumiendo que tienes el ID del usuario logueado
    const nroticket = nro_ticket;

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateKeyReceiveDate`
    ); // Nuevo endpoint
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            Swal.fire({
              title: "¡Registrado!",
              html: `La fecha de recepción de llave del Pos asociado el Nro de ticket: <span style = "border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroticket}</span> ha sido guardada.`,
              icon: "success",
              confirmButtonText: "Ok",
              color: "black",
              confirmButtonColor: "#003594",
            }).then(() => {
              // Opcional: Recargar los datos de la tabla para ver el cambio
              getTicketData();
            });
          } else {
            Swal.fire(
              "Error",
              "No se pudo guardar la fecha: " +
                (response.message || "Error desconocido"),
              "error"
            );
            // Desmarcar el checkbox si falla el guardado
            $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop(
              "checked",
              false
            );
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "Error al procesar la respuesta del servidor.",
            "error"
          );
          $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop(
            "checked",
            false
          );
          console.error("Error parsing JSON for key date update:", error);
        }
      } else {
        Swal.fire(
          "Error",
          `Error de conexión: ${xhr.status} ${xhr.statusText}`,
          "error"
        );
        $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop(
          "checked",
          false
        );
        console.error(
          "Error in XHR for key date update:",
          xhr.status,
          xhr.statusText
        );
      }
    };

    xhr.onerror = function () {
      Swal.fire(
        "Error de red",
        "No se pudo conectar con el servidor para guardar la fecha.",
        "error"
      );
      $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop(
        "checked",
        false
      );
      console.error("Network error for key date update.");
    };

    const data = `action=UpdateKeyReceiveDate&id_ticket=${idTicket}&id_user=${id_user}`; // Puedes enviar el id_user si lo necesitas para auditoría
    xhr.send(data);
  }

  const changeStatusModal = document.getElementById("changeStatusModal");
  // Estas variables son cruciales porque son accesibles para changeStatusTicket
  const estatusActualInput = changeStatusModal
    ? changeStatusModal.querySelector("#modalCurrentStatus")
    : null;
  const modalTicketIdInput = changeStatusModal
    ? changeStatusModal.querySelector("#modalTicketId")
    : null;
  const modalNewStatusSelect = changeStatusModal
    ? changeStatusModal.querySelector("#modalNewStatus")
    : null;
  const modalSubmitBtn = changeStatusModal
    ? changeStatusModal.querySelector("#saveStatusChangeBtn")
    : null; // CORREGIDO AQUÍ

  const updateTicketStatusForm = changeStatusModal
    ? changeStatusModal.querySelector("#changeStatusForm")
    : null; // CORREGIDO AQUÍ

  if (changeStatusModal) {
    // === Función para mostrar el modal ===
    function showCustomModal(currentStatus, idTicket) {
      if (estatusActualInput) {
        estatusActualInput.value = currentStatus;
      }

      if (modalTicketIdInput) {
        // Aquí usamos directamente idTicket, que es un parámetro de la función
        modalTicketIdInput.value = idTicket;
      }

      if (modalNewStatusSelect) {
        modalNewStatusSelect.setAttribute(
          "data-current-status-name",
          currentStatus
        );
        // Llamamos a getStatusLab SOLO CUANDO se abre el modal para filtrar.
        getStatusLab(currentStatus); // Pasamos el estatus actual para filtrar
      }

      changeStatusModal.classList.add("show");
      changeStatusModal.style.display = "block";
      changeStatusModal.setAttribute("aria-modal", "true");
      changeStatusModal.setAttribute("role", "dialog");

      document.body.classList.add("modal-open");
      const backdrop = document.createElement("div");
      backdrop.classList.add("modal-backdrop", "fade", "show");
      backdrop.id = "custom-modal-backdrop";
      document.body.appendChild(backdrop);
    }

    function hideCustomModal() {
      changeStatusModal.classList.remove("show");
      changeStatusModal.style.display = "none";
      changeStatusModal.removeAttribute("aria-modal");
      changeStatusModal.removeAttribute("role");

      document.body.classList.remove("modal-open");
      const backdrop = document.getElementById("custom-modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    }

    document.body.addEventListener("click", function (event) {
      let button = event.target.closest(".cambiar-estatus-btn");
      if (button) {
        const idTicket = button.getAttribute("data-id");
        const currentStatus = button.getAttribute("data-current-status");
        showCustomModal(currentStatus, idTicket);
      }
    });

    const closeButton = changeStatusModal.querySelector(
      '[data-bs-dismiss="modal"]'
    );
    if (closeButton) {
      closeButton.addEventListener("click", hideCustomModal);
    }

    document.body.addEventListener("click", function (event) {
      if (event.target && event.target.id === "custom-modal-backdrop") {
        hideCustomModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        changeStatusModal.classList.contains("show")
      ) {
        hideCustomModal();
      }
    });

    // === Lógica para enviar el formulario del modal ===
    if (updateTicketStatusForm) {
      modalSubmitBtn.addEventListener("click", function (event) {
        // Escuchamos el 'submit' del formulario
        event.preventDefault();
        changeStatusTicket(); // Llama a la función changeStatusTicket
      });
    }

    const closebutton = document.getElementById("CerrarBoton");
    if (closebutton) {
      document.addEventListener("click", function (event) {
        if (event.target === closebutton) {
          changeStatusModal.style.display = "none";
          changeStatusModal.classList.remove("show");
          document.body.classList.remove("modal-open");
          const backdrop = document.getElementById("custom-modal-backdrop");
          if (backdrop) {
            backdrop.remove();
          }
        }
      });
    }
  }

  // === Función changeStatusTicket (con la validación de SweetAlert) ===
  function changeStatusTicket() {
    const idTicket = modalTicketIdInput.value;
    const newStatus = modalNewStatusSelect.value;
    const id_user = document.getElementById("userId").value;

    const errorMessageDiv = changeStatusModal.querySelector("#errorMessage");
    if (errorMessageDiv) {
      errorMessageDiv.style.display = "none";
      errorMessageDiv.innerHTML = "";
    }

    // === VALIDACIÓN DEL CAMPO "NUEVO ESTATUS" con SweetAlert ===
    if (!newStatus || newStatus === "" || newStatus === "0") {
      // Asegúrate que "0" es tu valor para "no seleccionado"
      Swal.fire({
        title: "Notificación",
        text: 'No se puede tener un campo de estatus vacío. Por favor, selecciona un "Nuevo Estatus".',
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#003594", // Color del botón
        color: "black", // Color del texto
      });
      console.warn("Validación frontend: El estatus nuevo está vacío.");
      return; // Detener la ejecución si la validación falla
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateTicketStatus`
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onload = function () {
        const errorMessageDiv =
          changeStatusModal.querySelector("#errorMessage");
        if (errorMessageDiv) {
          errorMessageDiv.style.display = "none"; // Ocultar mensaje de error anterior al iniciar la nueva solicitud
          errorMessageDiv.innerHTML = "";
        }

        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              // Si la respuesta es exitosa, muestra el SweetAlert de éxito
              Swal.fire({
                title: "¡Éxito!",
                text: "Estatus del ticket actualizado correctamente.",
                icon: "success",
                confirmButtonText: "Ok",
                confirmButtonColor: "#28a745",
                color: "black",
                timer: 3500,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                },
                // willClose ya no tiene location.reload() si quieres un flujo más suave
                // Si QUERES recargar la página, manten el location.reload() y elimina lo de abajo.
                willClose: () => {
                  location.reload();
                },
              });
              getTicketData();
            } else {
              // Si el estado es 200 pero success es false (esto no debería pasar con tu API que usa 404/500 para fallos)

              // pero es una buena práctica manejarlo por si acaso.

              if (errorMessageDiv) {
                errorMessageDiv.innerHTML =
                  "Error inesperado: " +
                  (response.message || "La operación no fue exitosa.");

                errorMessageDiv.style.display = "block";
              }

              console.error(
                "Error al actualizar estatus (200 OK pero success:false):",
                response.message
              );
            }
          } catch (error) {
            console.error(
              "Error parsing JSON response for status update:",
              error
            );

            if (errorMessageDiv) {
              errorMessageDiv.innerHTML =
                "Error al procesar la respuesta del servidor (JSON inválido).";

              errorMessageDiv.style.display = "block";
            }
          }
        } else {
          // Manejo de errores basado en el código de estado HTTP de la API

          let errorMsg = "Error en la solicitud.";

          try {
            const response = JSON.parse(xhr.responseText);

            if (response.message) {
              errorMsg = response.message; // Usar el mensaje de la API si está presente
            }
          } catch (e) {
            // Si la respuesta no es JSON o no se puede parsear

            console.warn("No se pudo parsear la respuesta de error como JSON.");
          }

          if (xhr.status === 404) {
            // Específico para tu caso 'No se encontraron datos'

            if (errorMessageDiv) {
              errorMessageDiv.innerHTML = `Error ${xhr.status}: ${errorMsg}`;

              errorMessageDiv.style.display = "block";
            }

            console.error(
              "Error 404: No se encontraron datos para actualizar.",
              errorMsg
            );
          } else if (xhr.status === 500) {
            // Específico para tu caso 'El estatus esta vacio'

            if (errorMessageDiv) {
              errorMessageDiv.innerHTML = `Error ${xhr.status}: ${errorMsg}`;

              errorMessageDiv.style.display = "block";
            }

            console.error("Error 500: Error interno del servidor.", errorMsg);
          } else {
            // Otros códigos de estado de error (400, 401, etc.)

            if (errorMessageDiv) {
              errorMessageDiv.innerHTML = `Error ${xhr.status}: ${
                errorMsg || xhr.statusText
              }`;

              errorMessageDiv.style.display = "block";
            }

            console.error(
              "Error inesperado en la solicitud:",
              xhr.status,
              xhr.statusText,
              errorMsg
            );
          }
        }
      };

      xhr.onerror = function () {
        console.error("Network error during status update request.");

        const errorMessageDiv =
          changeStatusModal.querySelector("#errorMessage");

        if (errorMessageDiv) {
          errorMessageDiv.innerHTML =
            "Error de red. Asegúrate de estar conectado a internet.";

          errorMessageDiv.style.display = "block";
        }
      };

      const datos = `action=UpdateTicketStatus&id_ticket=${idTicket}&id_new_status=${newStatus}&id_user=${id_user}`;
      xhr.send(datos);
    }
  }
});

function getStatusLab(currentStatusNameToExclude = null) {
  
  // Acepta un parámetro opcional
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetStatusLab`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("modalNewStatus");

          select.innerHTML =
            '<option value="" disabled selected hidden>Seleccione</option>'; // Limpiar y agregar la opción por defecto
          if (Array.isArray(response.estatus) && response.estatus.length > 0) {
            response.estatus.forEach((status) => {
              // *** AQUÍ ESTÁ LA LÓGICA CLAVE: FILTRAR LA OPCIÓN ACTUAL ***
              if (status.name_status_lab !== currentStatusNameToExclude) {
                const option = document.createElement("option");
                option.value = status.id_status_lab;
                option.textContent = status.name_status_lab;
                select.appendChild(option);
              }
                   const changeStatusModal = new bootstrap.Modal(document.getElementById("changeStatusModal"));

                    const closeButton = document.getElementById("CerrarBoton");

                    // Es crucial eliminar cualquier listener previo para evitar que se acumulen
                    // y se ejecuten múltiples veces si la función getStatusLab se llama de nuevo.
                    closeButton.onclick = null; // Reinicia el manejador onclick para evitar duplicados

                    closeButton.addEventListener('click', function handler() {
                        if (currentStatusNameToExclude === "Pendiente por repuesto") {
                            changeStatusModal.hide(); // Oculta el modal
                            location.reload(); // Recarga la página
                        } else {
                            changeStatusModal.hide(); // Solo oculta el modal
                        }
                        // Opcional: Si solo quieres que el listener se ejecute una vez
                        // closeButton.removeEventListener('click', handler);
                    });
            });
          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay Técnicos Disponibles";
            select.appendChild(option);
          }
        } else {
          document.getElementById("rifMensaje").innerHTML +=
            "<br>Error al obtener los Técnicos.";
          console.error("Error al obtener los técnicos:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de los Técnicos.";
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      document.getElementById("rifMensaje").innerHTML +=
        "<br>Error de conexión con el servidor para los Técnicos.";
    }
  };

  const datos = `action=GetStatusLab`; // Asegúrate de que esta acción en el backend devuelva los técnicos filtrados
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de modales
  getStatusLab(); // Asegúrate de que esta función carga el select correctamente

  const changeStatusModal = new bootstrap.Modal(document.getElementById("changeStatusModal"));
  const rescheduleModal = new bootstrap.Modal( document.getElementById("rescheduleModal"));
  const renewalModal = new bootstrap.Modal(document.getElementById("renewalModal"));

  // Elementos del modal de cambio de estatus
  const modalNewStatusSelect = document.getElementById("modalNewStatus");
  const modalTicketIdInput = document.getElementById("modalTicketId"); // Tu input hidden existente en changeStatusModal
  const modalCurrentStatusInput = document.getElementById("modalCurrentStatus"); // Input para el estatus actual

  // Elementos del modal de reagendamiento (rescheduleModal)
  const rescheduleDateInput = document.getElementById("rescheduleDate");
  const dateError = document.getElementById("dateError");
  const saveRescheduleDateBtn = document.getElementById("saveRescheduleDate");

  // NUEVOS elementos para el modal de renovación (renewalModal)
  const renewalModalMessage = document.getElementById("renewalModalMessage");
  const renewalModalTicketId = document.getElementById("renewalModalTicketId");
  const renewalModalCurrentStatusName = document.getElementById(
    "renewalModalCurrentStatusName"
  );
  const renewalModalCurrentStatusId = document.getElementById(
    "renewalModalCurrentStatusId"
  );
  const renewalDateInput = document.getElementById("swal-input-date-renew");
  const renewalDateError = document.getElementById("renewalDateError");
  const renewDateBtn = document.getElementById("renewDateBtn");
  const sendToCommercialBtn = document.getElementById("sendToCommercialBtn");
  const changeStatusFromRenewalBtn = document.getElementById(
    "changeStatusFromRenewalBtn"
  ); // Nuevo botón

  const buttonCerrarModal = document.getElementById("CancelarFecha");

  if (buttonCerrarModal) {
    buttonCerrarModal.addEventListener("click", function () {
      rescheduleModal.hide(); // Oculta el modal de renovación
    });
  }

  // Cola de tickets vencidos para mostrar modales secuencialmente
  let overdueTicketsQueue = [];
  
  function showActionModalForTicket(ticket) {
    // Asegúrate de que 'ticket' contenga los datos necesarios.
    // Por ejemplo, si 'selectedTicket' es lo que pasas, se convierte en 'ticket' dentro de esta función.
    if (!ticket || !ticket.nro_ticket || !ticket.repuesto_date) {
        console.error("showActionModalForTicket: El objeto ticket no es válido o le faltan propiedades.");
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo mostrar el modal. Faltan datos del ticket.",
        });
        return;
    }

        Swal.fire({
            /*title: "Notificación",*/
            title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
              <div class="custom-modal-header-content">Notificación</div>
            </div>`,
            html: `Al ticket con el Nro. </b><span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticket.nro_ticket}</span></b> se le ha vencido el tiempo de espera para la llegada de los repuestos (Fecha anterior: ${ticket.repuesto_date}). <br><strong>¿Qué desea hacer?</strong><br>
            <br><div class="swal-custom-button-container">
              <button id="changeStatusButton" class="custom-status-button">Cambiar Estatus del Ticket</button>
            </div>`,
            showDenyButton: true, // Para "Enviar a Gestión Comercial"
            denyButtonText: "Enviar a Gestión Comercial",
            showConfirmButton: true, // Para "Renovar Fecha"
            confirmButtonText: "Renovar Fecha",
            focusConfirm: false,
            allowOutsideClick: false, 
            allowEscapeKey: false,
            showCloseButton: true,
            keydownListenerCapture: true,
            color: "black",
            customClass: {
              confirmButton: 'btn-renovar', // Clase para "Renovar Fecha"
              denyButton: 'btn-gestion-comercial', // Clase para "Enviar a Gestión Comercial"
              // Aseguramos que el modal principal también tenga una clase si lo necesitas
              popup: 'notification-modal-custom'
            },
            didOpen: () => {
                // Obtenemos el botón personalizado dentro del modal
                const changeStatusBtn = document.getElementById('changeStatusButton');

                if (changeStatusBtn) {
                    changeStatusBtn.addEventListener('click', () => {
                      Swal.close();
                      const current_status_lab_name = ticket.current_status_lab_name || ticket.estatus_actual || "Desconocido";
                      showCustomModal(current_status_lab_name, ticket.id_ticket);
                    });
                }
            },
        }).then((result) => {
            
            if (result.isConfirmed) {
                // --- Lógica para "Renovar Fecha" (Abre un segundo modal) ---
                
                Swal.fire({
                    title: "Renovar Fecha de la llegada de Repuestos",
                    html: `
                        <b>Coloque Nueva Fecha:</b><br>
                        <input type="date" id="swal-input-date-renew" class="swal2-input">
                    `,
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Guardar Fecha",
                    focusConfirm: false,
                    color: "black",
                    allowOutsideClick: false, 
                    allowEscapeKey: false,
                    showCloseButton: true,
                    keydownListenerCapture: true,

                    customClass: {
                      // Asigna una clase a la ventana modal (swal2-popup)
                      popup: 'modal-with-backdrop-filter', 
                      // Asigna una clase al telón de fondo (swal2-container)
                      container: 'swal2-container-custom' 
                    },
                    
                    // Asignar IDs a los botones usando didOpen
                    didOpen: (modalElement) => {
                      const confirmButton = modalElement.querySelector('.swal2-confirm');
                      const cancelButton = modalElement.querySelector('.swal2-cancel');

                      if (confirmButton) {
                        confirmButton.id = 'ButtonGuardarFecha';
                      }

                      if (cancelButton) {
                        cancelButton.id = 'ButtonCancelarFecha';

                         const changeStatusModal = new bootstrap.Modal(document.getElementById("changeStatusModal"));



                    cancelButton.addEventListener('click', function handler() {
                            changeStatusModal.hide(); // Oculta el modal
                            location.reload(); // Recarga la página
                       
          
                    });
                      }
                    },

                    // Validamos la fecha con las restricciones
                  preConfirm: () => {
                    const newDateStr = document.getElementById("swal-input-date-renew").value;

                    // 1. Validar que se haya seleccionado una fecha
                    if (!newDateStr) {
                        Swal.showValidationMessage("Por favor, selecciona una fecha.");
                        return false;
                    }

                    // Convertir la fecha seleccionada y la fecha actual a objetos Date
                    const selectedDate = new Date(newDateStr + 'T00:00:00');
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00 para comparar solo la fecha

                    // ✨ AÑADIR ESTA VALIDACIÓN: La fecha seleccionada no puede ser anterior a hoy ✨
                    if (selectedDate < today) {
                        Swal.showValidationMessage("La fecha no puede ser anterior a la fecha actual.");
                        return false;
                    }

                    // 2. Restricción de año: Solo permite el año actual.
                    // (Esta validación podría volverse redundante o conflictiva si solo permites futuras fechas del año actual)
                    // Pero si quieres mantenerla para el contexto de un año específico, está bien.
                    const currentYear = today.getFullYear();
                    const selectedYear = selectedDate.getFullYear();

                    if (selectedYear !== currentYear) {
                        Swal.showValidationMessage("Solo puedes seleccionar fechas dentro del año actual.");
                        return false;
                    }

                    // 3. Restricción de rango de 3 meses (del pasado y del futuro)
                    // Con la validación de fecha futura, esta de "tres meses atrás" ya no es estrictamente necesaria para el pasado
                    // Pero si la quieres como un límite superior para el futuro, está bien.
                    const threeMonthsLater = new Date(today);
                    threeMonthsLater.setMonth(today.getMonth() + 3);

                    if (selectedDate > threeMonthsLater) { // Solo necesitamos verificar el límite superior si ya validamos que no sea pasada
                        Swal.showValidationMessage("Por favor, selecciona una fecha dentro de un rango de 3 meses de la fecha actual.");
                        return false;
                    }

                    // Si todas las validaciones pasan, retornamos los datos
                    return {
                        ticketId: ticket.id_ticket,
                        newDate: newDateStr, // Usamos la cadena de fecha original para el envío
                    };
                  }
                }).then((renewResult) => {
                    const ticketId = renewResult.value.ticketId;
                    const newRepuestoDate = renewResult.value.newDate;
                    const id_user = document.getElementById("userId");

                    if (renewResult.isConfirmed) {                        
                        const datos = `action=UpdateRepuestoDate2&id_ticket=${ticketId}&newDate=${newRepuestoDate}&id_user=${id_user.value}`;
                        const xhr = new XMLHttpRequest();
                        const endpoint = `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateRepuestoDate2`;
                        xhr.open("POST", endpoint, true);
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                        xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                Swal.fire({
                                    icon: 'success',
                                    title: '¡Fecha Actualizada con Éxito!',
                                    html: `la Fecha de la llegada de repuesto para el Ticket Nro: <span span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticket.nro_ticket}</span> fue renovada correctamente.`,
                                    confirmButtonText: 'Ok', 
                                    color: 'black',
                                    confirmButtonColor: '#003594',
                                    allowOutsideClick: false, 
                                    allowEscapeKey: false,
                                    keydownListenerCapture: true,
                                }).then((confirmResult) => {
                                  if (confirmResult.isConfirmed) {
                                    window.location.reload();
                                  }
                                });
                            } else {
                                // Error en la solicitud HTTP
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Hubo un problema al actualizar la fecha de repuesto. Inténtalo de nuevo.',
                                    footer: `Status: ${xhr.status}`
                                });
                            }
                        };

                        xhr.onerror = function() {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error de conexión',
                            text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
                          });
                          overdueTicketsQueue.shift();
                          processNextOverdueTicket();
                        };
                        xhr.send(datos);
                        Swal.showLoading();
                    } else {
                        console.log("Renovación de fecha cancelada.");      
                        overdueTicketsQueue.shift();
                        processNextOverdueTicket();
                    }
                });
            } else if (result.isDenied) {
               const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
               Swal.fire({
                        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                          <div class="custom-modal-header-content">Confirmación</div>
                        </div>`,
                        html: `
                          <div class="custom-modal-body-content">
                              <div class="mb-4">
                                  ${customWarningSvg}
                              </div>
                              <p class="h4 mb-3">Enviar el ticket Nro: <span style = "display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> a Gestión Comercial?</p>
                          </div>
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Enviar',
                        cancelButtonText: 'Cancelar',
                        color: 'black',
                        allowOutsideClick: false, 
                        allowEscapeKey: false,
                        showCloseButton: true,
                        keydownListenerCapture: true,
                        customClass: {
                            confirmButton: 'btn-gestion-comercial', // O un estilo de confirmación
                            cancelButton: 'btn-cancelar' // O un estilo de cancelación
                        }
                    }).then((confirmResult) => {
                        const ticketId = ticket.id_ticket;
                        const id_user = document.getElementById("userId");

                        if (confirmResult.isConfirmed) {
                          const datos = `action=SendToComercial&id_ticket=${ticketId}&id_user=${id_user.value}`;
                          const xhr = new XMLHttpRequest();
                          const endpoint = `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToComercial`;
                          xhr.open("POST", endpoint, true);
                          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                          xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                              Swal.fire({
                                  icon: 'success',
                                  title: '¡Enviado a Gestión Comercial!',
                                  html: `El ticket Nro: <span style = "border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticket.nro_ticket}</span> ha sido enviado a Gestión Comercial`,
                                  confirmButtonText: 'Ok', 
                                  color: 'black',
                                  confirmButtonColor: '#003594',
                                  allowOutsideClick: false, 
                                  allowEscapeKey: false,
                                  keydownListenerCapture: true,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  window.location.reload(); 
                                }
                              });
                                                          
                              } else {
                                  // Error en la solicitud HTTP
                                  Swal.fire({
                                      icon: 'error',
                                      title: 'Error',
                                      text: 'Hubo un problema al actualizar la fecha de repuesto. Inténtalo de nuevo.',
                                      footer: `Status: ${xhr.status}`
                                  });
                              }
                          };

                          xhr.onerror = function() {
                            Swal.fire({
                              icon: 'error',
                              title: 'Error de conexión',
                              text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
                            });
                            overdueTicketsQueue.shift();
                            processNextOverdueTicket();
                          };
                          xhr.send(datos);
                          Swal.showLoading();
                        } else {
                            console.log("Envío a Gestión Comercial cancelado.");
                            overdueTicketsQueue.shift();
                            processNextOverdueTicket();
                        }
                    });

                } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                    // --- Lógica para "Cerrar" (si se usa la X o se hace clic fuera si allowOutsideClick está habilitado) ---
                    console.log("Modal cerrado.");
                    
                    // Después de cerrar, procesamos el siguiente ticket
                    overdueTicketsQueue.shift();
                    processNextOverdueTicket();
                }
            });
}

  // Función para procesar el siguiente ticket en la cola
  function processNextOverdueTicket() {
    if (overdueTicketsQueue.length > 0) {
    // Si hay un solo ticket, muestra el modal
    if (overdueTicketsQueue.length === 1) {
        const ticket = overdueTicketsQueue[0];
        
        // --- Primer Modal: Notificación y Opciones ---
        Swal.fire({
           /* title: "Notificación",*/
           title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
              <div class="custom-modal-header-content">Notificación</div>
            </div>`,
            html: `Al ticket con el Nro. <b><span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticket.nro_ticket}</span></b> se le ha vencido el tiempo de espera para la llegada de los repuestos (Fecha anterior: ${ticket.repuesto_date}). <br><strong>¿Qué desea hacer?</strong><br>
            <br><div class="swal-custom-button-container">
              <button id="changeStatusButton" class="custom-status-button">Cambiar Estatus del Ticket</button>
            </div>`,
            showDenyButton: true, // Para "Enviar a Gestión Comercial"
            denyButtonText: "Enviar a Gestión Comercial",
            showConfirmButton: true, // Para "Renovar Fecha"
            confirmButtonText: "Renovar Fecha",
            focusConfirm: false,
            allowOutsideClick: false, 
            allowEscapeKey: false,
            keydownListenerCapture: true,
            color: "black",
            customClass: {
              confirmButton: 'btn-renovar', // Clase para "Renovar Fecha"
              denyButton: 'btn-gestion-comercial', // Clase para "Enviar a Gestión Comercial"
              // Aseguramos que el modal principal también tenga una clase si lo necesitas
              popup: 'notification-modal-custom'
            },
            didOpen: () => {
                // Obtenemos el botón personalizado dentro del modal
                const changeStatusBtn = document.getElementById('changeStatusButton');

                if (changeStatusBtn) {
                    changeStatusBtn.addEventListener('click', () => {
                      Swal.close();
                      const current_status_lab_name = ticket.current_status_lab_name || ticket.estatus_actual || "Desconocido";
                      showCustomModal(current_status_lab_name, ticket.id_ticket);
                    });
                }
            },
        }).then((result) => {
            
            if (result.isConfirmed) {
                // --- Lógica para "Renovar Fecha" (Abre un segundo modal) ---
                
                Swal.fire({
                    //title: "Renovar Fecha de la llegada de Repuestos",
                     title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                              <div class="custom-modal-header-content">Renovar Fecha de la llegada de Repuestos</div>
                            </div>`,
                    html: `
                        <b>Coloque Nueva Fecha:</b><br>
                        <input type="date" id="swal-input-date-renew" class="swal2-input">
                    `,
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Guardar Fecha",
                    focusConfirm: false,
                    color: "black",
                    allowOutsideClick: false, 
                    allowEscapeKey: false,
                    keydownListenerCapture: true,

                    customClass: {
                      // Asigna una clase a la ventana modal (swal2-popup)
                      popup: 'modal-with-backdrop-filter', 
                      // Asigna una clase al telón de fondo (swal2-container)
                      container: 'swal2-container-custom' 
                    },
                    
                    // Asignar IDs a los botones usando didOpen
                    didOpen: (modalElement) => {
                      const confirmButton = modalElement.querySelector('.swal2-confirm');
                      const cancelButton = modalElement.querySelector('.swal2-cancel');

                      if (confirmButton) {
                        confirmButton.id = 'ButtonGuardarFecha';
                      }

                      if (cancelButton) {
                        cancelButton.id = 'ButtonCancelarFecha';
                        const changeStatusModal = new bootstrap.Modal(document.getElementById("changeStatusModal"));
                        cancelButton.addEventListener('click', function handler() {
                          changeStatusModal.hide(); // Oculta el modal
                          location.reload(); // Recarga la página
                        });
                      }
                    },

                    // Validamos la fecha con las restricciones
                    preConfirm: () => {
                        const newDateStr = document.getElementById("swal-input-date-renew").value;
                        // 1. Validar que se haya seleccionado una fecha
                        if (!newDateStr) {
                            Swal.showValidationMessage("Por favor, selecciona una fecha.");
                            return false;
                        }

                        // Convertir la fecha seleccionada y la fecha actual a objetos Date
                        const selectedDate = new Date(newDateStr + 'T00:00:00'); 
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        // ✨ AÑADIR ESTA VALIDACIÓN: La fecha seleccionada no puede ser anterior a hoy ✨
                        if (selectedDate < today) {
                            Swal.showValidationMessage("La fecha no puede ser anterior a la fecha actual.");
                            return false;
                        }

                        // 2. Restricción de año: Solo permite el año actual.
                        const currentYear = today.getFullYear();
                        const selectedYear = selectedDate.getFullYear();

                        if (selectedYear !== currentYear) {
                            Swal.showValidationMessage("Solo puedes seleccionar fechas dentro del año actual.");
                            return false;
                        }

                        // 3. Restricción de rango de 3 meses (del pasado y del futuro)
                        const threeMonthsAgo = new Date(today);
                        threeMonthsAgo.setMonth(today.getMonth() - 3);

                        const threeMonthsLater = new Date(today);
                        threeMonthsLater.setMonth(today.getMonth() + 3);

                        if (selectedDate < threeMonthsAgo || selectedDate > threeMonthsLater) {
                            Swal.showValidationMessage("Por favor, selecciona una fecha dentro de un rango de 3 meses de la fecha actual.");
                            return false;
                        }

                        // Si todas las validaciones pasan, retornamos los datos
                        return {
                          
                            ticketId: ticket.id_ticket,
                            newDate: newDateStr, // Usamos la cadena de fecha original para el envío
                        };
                    }
                }).then((renewResult) => {
                    const ticketId = renewResult.value.ticketId;
                    const newRepuestoDate = renewResult.value.newDate;
                    const id_user = document.getElementById("userId");

                    if (renewResult.isConfirmed) {                        
                        const datos = `action=UpdateRepuestoDate2&id_ticket=${ticketId}&newDate=${newRepuestoDate}&id_user=${id_user.value}`;
                        const xhr = new XMLHttpRequest();
                        const endpoint = `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateRepuestoDate2`;
                        xhr.open("POST", endpoint, true);
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                        xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                // Solicitud exitosa
                              Swal.fire({
                              icon: 'success',
                              title: '¡Éxito en la renovación de la fecha!',
                              html: `La fecha de llegada de repuesto para el Ticket Nro:
                                    <span style="border-radius:0.3rem; background-color:#e0f7fa; color:#007bff;">
                                      ${ticket.nro_ticket}
                                    </span> fue renovada correctamente.`,
                              confirmButtonText: 'Ok',
                              color: 'black',
                              confirmButtonColor: '#003594',
                              allowOutsideClick: false,
                              allowEscapeKey: false,
                              keydownListenerCapture: true,
                            }).then(() => {
                              window.location.reload();
                            });

                            } else {
                                // Error en la solicitud HTTP
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Hubo un problema al actualizar la fecha de repuesto. Inténtalo de nuevo.',
                                    footer: `Status: ${xhr.status}`
                                });
                            }
                            overdueTicketsQueue.shift();
                            processNextOverdueTicket();
                        };

                        xhr.onerror = function() {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error de conexión',
                            text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
                          });
                          overdueTicketsQueue.shift();
                          processNextOverdueTicket();
                        };
                        xhr.send(datos);
                        Swal.showLoading();
                    } else {
                        console.log("Renovación de fecha cancelada.");      
                        overdueTicketsQueue.shift();
                        processNextOverdueTicket();
                    }
                });
            } else if (result.isDenied) {
               const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                Swal.fire({
                        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                          <div class="custom-modal-header-content">Confirmación</div>
                        </div>`,
                        html: `
                          <div class="custom-modal-body-content">
                              <div class="mb-4">
                                  ${customWarningSvg}
                              </div>
                              <p class="h4 mb-3" style = "color: black;">Enviar el ticket Nro: <span style = "display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticket.nro_ticket}</span> a Gestión Comercial?</p>
                          </div>
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Enviar',
                        cancelButtonText: 'Cancelar',
                        color: 'black',
                        allowOutsideClick: false, 
                        allowEscapeKey: false,
                        keydownListenerCapture: true,
                        customClass: {
                            confirmButton: 'btn-gestion-comercial', // O un estilo de confirmación
                            cancelButton: 'btn-cancelar' // O un estilo de cancelación
                        }
                    }).then((confirmResult) => {
                        const ticketId = ticket.id_ticket;
                        const id_user = document.getElementById("userId");

                        if (confirmResult.isConfirmed) {
                          const datos = `action=SendToComercial&id_ticket=${ticketId}&id_user=${id_user.value}`;
                          const xhr = new XMLHttpRequest();
                          const endpoint = `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToComercial`;
                          xhr.open("POST", endpoint, true);
                          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                          xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                              Swal.fire({
                                  icon: 'success',
                                  title: '¡Enviado a Gestión Comercial!',
                                  html: `El ticket Nro: <span style = "border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticket.nro_ticket}</span> ha sido enviado correctamente a Gestión Comercial`,
                                  confirmButtonText: 'Ok', 
                                  color: 'black',
                                  confirmButtonColor: '#003594',
                                  allowOutsideClick: false, 
                                  allowEscapeKey: false,
                                  keydownListenerCapture: true,
                              }).then((result) => {
                                  if (result.isConfirmed) {
                                      // Recarga la página
                                      window.location.reload(); 
                                  }
                              });
                                                          
                              } else {
                                  // Error en la solicitud HTTP
                                  Swal.fire({
                                      icon: 'error',
                                      title: 'Error',
                                      text: 'Hubo un problema al actualizar la fecha de repuesto. Inténtalo de nuevo.',
                                      footer: `Status: ${xhr.status}`
                                  });
                              }
                              overdueTicketsQueue.shift();
                              processNextOverdueTicket();
                          };

                          xhr.onerror = function() {
                            Swal.fire({
                              icon: 'error',
                              title: 'Error de conexión',
                              text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
                            });
                            overdueTicketsQueue.shift();
                            processNextOverdueTicket();
                          };
                          xhr.send(datos);
                          Swal.showLoading();
                        } else {
                          window.location.reload();
                          overdueTicketsQueue.shift();
                          processNextOverdueTicket();
                        }
                    });

                } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                    window.location.reload();
                    // Después de cerrar, procesamos el siguiente ticket
                    overdueTicketsQueue.shift();
                    processNextOverdueTicket();
                }
            });
      } else {
        // Logic for multiple tickets: Use a select dropdown
        const inputOptions = {};
        overdueTicketsQueue.forEach((ticket) => {
          inputOptions[
            ticket.id_ticket
          ] = `Ticket Nro: ${ticket.nro_ticket} (Vencido el: ${ticket.repuesto_date})`;
        });

        Swal.fire({
          title: "Notificación",
          html: `Tienes ${overdueTicketsQueue.length} tickets con la Fecha Estimada de la Llegada de Repuestos Vencida.<br>
                    <br>Por favor, selecciona un ticket para realizar una acción:<br>`,
          input: "select",
          inputOptions: inputOptions,
          inputPlaceholder: "Selecciona un ticket",
          showCancelButton: true,
          cancelButtonText: "Cerrar",
          cancelAnimationFrame: true,
          confirmButtonColor: "#003594",
          cancelButtonColor: "#6c757d",
          allowEscapeKey: false,
          keydownListenerCapture: true,
          allowOutsideClick: false,
          color: "black",
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve();
              } else {
                resolve("Debes seleccionar un ticket.");
              }
            });
          },
          // AÑADE ESTO:
          customClass: {
            popup: "my-custom-select-modal", // Agrega una clase al popup principal
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const selectedTicketId = result.value;
            const selectedTicket = overdueTicketsQueue.find(
              (t) => t.id_ticket === selectedTicketId
            );

            if (selectedTicket) {
              // Show the specific action modal for the selected ticket
              showActionModalForTicket(selectedTicket);
            } else {
             
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            console.log("Modal de selección cerrado.");
            overdueTicketsQueue = []; // Clear the queue if user cancels main selection modal
          }
        });
      }
    } else {
      console.log("No hay más tickets vencidos para procesar.");
    }
  }

  // Evento para cuando el renewalModal se oculta (procesa el siguiente)
  document
    .getElementById("renewalModal")
    .addEventListener("hidden.bs.modal", function () {
      processNextOverdueTicket(); // Al cerrar un modal, intenta abrir el siguiente
    });

  // Función para consultar todos los tickets con fecha de repuesto vencida
  function checkAllOverdueRepuestoTickets() {
    const xhr = new XMLHttpRequest();
    // ESTE ES EL NUEVO ENDPOINT QUE DEBES CREAR EN TU BACKEND
    xhr.open(
      "POST",
      `${ENDPOINT_BASE}${APP_PATH}api/consulta/getOverdueRepuestoTickets`
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (
            response.success &&
            Array.isArray(response.tickets) &&
            response.tickets.length > 0
          ) {
            overdueTicketsQueue = response.tickets; // Llenar la cola
            console.log("Tickets vencidos encontrados:", response);
            processNextOverdueTicket(); // Iniciar el procesamiento de la cola
          } else {
            console.log(
              "No hay tickets con fecha de repuesto vencida o error al obtenerlos."
            );
            // Opcional: Mostrar un SweetAlert si no hay tickets vencidos
            // Swal.fire({
            //     icon: 'info',
            //     title: 'Sin Notificaciones',
            //     text: 'No hay tickets pendientes por repuesto con fecha vencida.',
            //     timer: 3000,
            //     timerProgressBar: true
            // });
          }
        } catch (error) {
          console.error(
            "Error al parsear JSON de tickets vencidos:",
            error,
            xhr.responseText
          );
          Swal.fire({
            icon: "error",
            title: "Error de Datos",
            text: "Hubo un problema al procesar la información de tickets vencidos.",
          });
        }
      } else {
        console.error(
          "Error de conexión al obtener tickets vencidos:",
          xhr.status,
          xhr.statusText
        );
      
      }
    };
    xhr.onerror = function () {
      console.error("Error de red al obtener tickets vencidos.");
      Swal.fire({
        icon: "error",
        title: "Error de Red",
        text: "Problema de conexión al obtener tickets vencidos.",
      });
    };
    const datos = `action=getOverdueRepuestoTickets`; // Ajusta el action si es necesario
    xhr.send(datos); // Ajusta el action si es necesario
  }

  // ... (resto de tu código, incluyendo overdueTicketsQueue y processNextOverdueTicket) ...

  // Function to show the action modal for a specific ticket
  // ... (resto de tu código, incluyendo overdueTicketsQueue y processNextOverdueTicket) ...

  // Llama a esta función al cargar la página para buscar tickets vencidos
  checkAllOverdueRepuestoTickets();

  // === Lógica de Eventos Existente (ajustada para usar los nuevos elementos) ===

  // Evento para detectar el cambio en el select de Nuevo Estatus (changeStatusModal)
  modalNewStatusSelect.addEventListener("change", function () {
    const selectedOptionText =
      this.options[this.selectedIndex].textContent.trim();

    if (selectedOptionText === "Pendiente por repuesto") {
      // Asegúrate de la ortografía
      changeStatusModal.hide();
      rescheduleModal.show();

      // Configura la fecha mínima y máxima para el input date (ya existente)
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const currentDay = today.getDate();

      const minDate = new Date(currentYear, currentMonth, currentDay);
      rescheduleDateInput.min = minDate.toISOString().split("T")[0];

      const maxDate = new Date(currentYear, currentMonth + 3, currentDay);
      if (maxDate.getMonth() !== (currentMonth + 3) % 12) {
        maxDate.setDate(0);
      }
      rescheduleDateInput.max = maxDate.toISOString().split("T")[0];

      rescheduleDateInput.value = "";
      dateError.style.display = "none";
    }
  });

  // Validar la fecha cuando se seleccione o cambie en rescheduleModal
  rescheduleDateInput.addEventListener("change", function () {
    // ... (Tu lógica de validación de fecha existente para rescheduleDateInput) ...
    const selectedDate = new Date(this.value);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    selectedDate.setFullYear(currentYear);

    const maxMonth = (currentMonth + 3) % 12;
    const maxYear = currentMonth + 3 >= 12 ? currentYear + 1 : currentYear;

    const maxAllowedDate = new Date(maxYear, maxMonth + 1, 0);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    maxAllowedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      dateError.textContent =
        "La fecha seleccionada no puede ser anterior a hoy.";
      dateError.style.display = "block";
      saveRescheduleDateBtn.disabled = true;
    } else if (selectedDate > maxAllowedDate) {
      dateError.textContent =
        "La fecha no puede exceder 3 meses a partir del mes actual.";
      dateError.style.display = "block";
      saveRescheduleDateBtn.disabled = true;
    } else {
      dateError.style.display = "none";
      saveRescheduleDateBtn.disabled = false;
    }
  });

  // Lógica para el botón "Guardar Fecha" en el modal de reagendamiento (rescheduleModal)
  saveRescheduleDateBtn.addEventListener("click", function () {
    if (
      rescheduleDateInput.checkValidity() &&
      !saveRescheduleDateBtn.disabled
    ) {
      const id_status_lab = 5;
      const selectedDate = rescheduleDateInput.value;
      const ticketId = modalTicketIdInput.value; // Usar el ID del ticket del modal principal
      const id_user = document.getElementById("userId").value; // Usar el ID del usuario logueado
      if (!ticketId) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ID de ticket no disponible para guardar la fecha.",
        });
        return;
      }

      console.log(
        `Sending Ticket ID: ${ticketId}, New Repuesto Date: ${selectedDate} to backend.`
      );
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/consulta/updateRepuestoDate`
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "¡Fecha Registrada Correctamente!",
                html: `La fecha de repuesto ha sido guardada con éxito: <span style="border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${selectedDate}</span>.`,
                showConfirmButton: true, // Asegura que el botón de confirmación sea visible
                confirmButtonText: 'Cerrar', // Opcional: Personaliza el texto del botón
                confirmButtonColor: '#003594', // Opcional: Personaliza el color del botón
                color: 'black', // Opcional: Personaliza el color de fondo del modal
              }).then(() => {
                rescheduleModal.hide();
                location.reload(); 
                // Aquí podrías recargar la tabla de tickets o actualizar solo ese ticket en la UI
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text:
                  "Error al guardar la fecha de repuesto: " +
                  (response.message || "Mensaje de error no disponible."),
              });
            }
          } catch (e) {
            Swal.fire({
              icon: "error",
              title: "Error de Servidor",
              text: "Error al procesar la respuesta del servidor.",
            });
            console.error(
              "Error al parsear la respuesta JSON:",
              e,
              xhr.responseText
            );
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error de Conexión",
            text: `Error de conexión o servidor: ${xhr.status} - ${xhr.statusText}`,
          });
        }
      };
      xhr.onerror = function () {
        Swal.fire({
          icon: "error",
          title: "Error de Red",
          text: "No se pudo conectar con el servidor.",
        });
      };
      const data = `action=updateRepuestoDate&ticket_id=${ticketId}&repuesto_date=${selectedDate}&id_user=${id_user}&id_status_lab=${id_status_lab}`;
      xhr.send(data);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Campo Requerido",
        text: "Por favor, selecciona una fecha válida.",
      });
      dateError.textContent = "Por favor, selecciona una fecha válida.";
      dateError.style.display = "block";
    }
  });
});

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

