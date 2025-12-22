let currentTicketIdForConfirmTaller = null;
let currentNroTicketForConfirmTaller = null; // <--- NUEVA VARIABLE PARA EL NÚMERO DE TICKET
let confirmInTallerModalInstance = null;
let currentTicketNroForImage = null;

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

let dataTableInstance; // Declarar globalmente

function getTicketData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketDataLab`);

    const tableElement = document.getElementById("tabla-ticket");
    const theadElement = tableElement ? tableElement.getElementsByTagName("thead")[0] : null;
    const tbodyElement = tableElement ? tableElement.getElementsByTagName("tbody")[0] : null;
    const tableContainer = document.querySelector("#tabla-ticket tbody");

    // Read nro_ticket from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const nroTicket = urlParams.get('nro_ticket');

    // Define column titles based on your SQL function's output
    const columnTitles = {
        id_ticket: "ID Ticket",
        nro_ticket: "Nro Ticket",
        rif: "Rif",
        serial_pos: "Serial",
        razonsocial_cliente: "Razón Social",
        full_name_tecnicoassignado: "Técnico Asignado",
        fecha_envio_a_taller: "Fecha Envío a Taller",
        name_status_payment: "Estatus Pago",
        name_accion_ticket: "Acción Ticket",
        name_status_lab: "Estatus Taller",
        date_send_torosal_fromlab: "Fecha Envío a Rosal",
        date_sendkey: "Fecha Envío Llave",
    };

    // Definir applyNroTicketSearch fuera de initComplete
    function applyNroTicketSearch(api) {
        if (nroTicket) {
          // Establecer el valor en el input de búsqueda general y asegurar que sea visible
          const searchInput = $('.dataTables_filter input');
          searchInput.val(nroTicket); // Set the value in the search input
            api.search(nroTicket).draw();
            const row = api.rows({ filter: 'applied' }).data().toArray().find(row => row.nro_ticket === nroTicket);
            if (row) {
                const rowNode = api.row((idx, data) => data.nro_ticket === nroTicket).node();
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
                api.column(1).search('').draw();
            }
        } else {
        }
    }

    // Definir findFirstButtonWithData fuera de initComplete
    function findFirstButtonWithData(api) {
        const searchTerms = [
            { button: "btn-por-asignar", column: 9, term: "^Recibido en Taller$", status: "En proceso", action: "Recibido en Taller" },
            { button: "btn-asignados", column: 8, term: "^Enviado a taller$", status: "En proceso", action: ["En proceso de Reparación", "Reparado", "Pendiente por repuesto"] },
            { button: "btn-recibidos", column: 8, term: "^En espera confirmación carga de llaves$", status: "En proceso", action: "En espera confirmación carga de llaves" },
            { button: "btn-devuelto", column: 8, term: "^En el Rosal$", status: "En proceso", action: "En el Rosal" }
        ];

        // Si hay un nroTicket, buscar el filtro que contenga ese ticket
        if (nroTicket) {
            for (const { button, column, term, status, action } of searchTerms) {
                api.columns().search('').draw(false);
                api.column(column).search(term, true, false).draw();
                const ticketExists = api.rows({ filter: 'applied' }).data().toArray().some(row => row.nro_ticket === nroTicket);
                if (ticketExists) {
                    clearFilters(api);
                    if (button === "btn-por-asignar") {
                        api.column('carga_de_llave:name').visible(false);
                        api.column('Enviar_AlRosal:name').visible(false);
                        api.column(11).visible(false);
                        api.column(10).visible(false);
                        api.column(9).search(term, true, false).draw();
                        showTicketStatusIndicator(status, action);
                    } else if (button === "btn-asignados") {
                        api.column('carga_de_llave:name').visible(true);
                        api.column('Enviar_AlRosal:name').visible(true);
                        api.column(11).visible(false);
                        api.column(10).visible(false);
                        api.column(9).search("En proceso de Reparación|Reparado|Pendiente por repuesto", true, false).draw();
                        showTicketStatusIndicator(status, action);
                    } else if (button === "btn-recibidos") {
                        api.column('carga_de_llave:name').visible(false);
                        api.column('Enviar_AlRosal:name').visible(true);
                        api.column(11).visible(true);
                        api.column(8).search(term, true, false).draw();
                        showTicketStatusIndicator(status, action);
                    } else if (button === "btn-devuelto") {
                        api.column(8).search(term, true, false).draw();
                        document.querySelectorAll(".load-key-button").forEach(button => button.style.display = "none");
                        document.querySelectorAll(".receive-key-checkbox").forEach(checkbox => checkbox.style.display = "none");
                        showTicketStatusIndicator(status, action);
                    }
                    setActiveButton(button);
                    applyNroTicketSearch(api);
                    return true;
                }
            }
            Swal.fire({
                icon: 'warning',
                title: 'Ticket no encontrado',
                text: `El ticket ${nroTicket} no se encuentra en los datos disponibles.`,
                confirmButtonText: 'Ok',
                color: 'black',
                confirmButtonColor: '#003594'
            });
        }

        // Buscar el primer filtro con datos
        for (const { button, column, term, status, action } of searchTerms) {
            if (checkDataExists(api, column, term)) {
                clearFilters(api);
                if (button === "btn-por-asignar") {
                    api.column('carga_de_llave:name').visible(false);
                    api.column('Enviar_AlRosal:name').visible(false);
                    api.column(11).visible(false);
                    api.column(10).visible(false);
                    api.column(9).search(term, true, false).draw();
                    showTicketStatusIndicator(status, action);
                } else if (button === "btn-asignados") {
                    api.column('carga_de_llave:name').visible(true);
                    api.column('Enviar_AlRosal:name').visible(true);
                    api.column(11).visible(false);
                    api.column(10).visible(false);
                    api.column(9).search("En proceso de Reparación|Reparado|Pendiente por repuesto", true, false).draw();
                    showTicketStatusIndicator(status, action);
                } else if (button === "btn-recibidos") {
                    api.column('carga_de_llave:name').visible(false);
                    api.column('Enviar_AlRosal:name').visible(true);
                    api.column(11).visible(true);
                    api.column(8).search(term, true, false).draw();
                    showTicketStatusIndicator(status, action);
                } else if (button === "btn-devuelto") {
                    api.column(8).search(term, true, false).draw();
                    document.querySelectorAll(".load-key-button").forEach(button => button.style.display = "none");
                    document.querySelectorAll(".receive-key-checkbox").forEach(checkbox => checkbox.style.display = "none");
                    showTicketStatusIndicator(status, action);
                }
                setActiveButton(button);
                applyNroTicketSearch(api);
                return true;
            }
        }

        // Si no hay datos
        clearFilters(api);
        api.column(8).search("NO_DATA_FOUND").draw();
        setActiveButton("btn-por-asignar");
        showTicketStatusIndicator('Cerrado', 'No hay datos');
        const tbody = document.querySelector("#tabla-ticket tbody");
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="14" class="text-center text-muted py-5">
                        <div class="d-flex flex-column align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                                <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            </svg>
                            <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                            <p class="text-muted mb-0">No hay tickets en Taller para mostrar en este momento.</p>
                        </div>
                    </td>
                </tr>`;
        }
        return false;
    }

    // Definir checkDataExists
    function checkDataExists(api, searchColumn, searchTerm) {
        api.columns().search('').draw(false);
        api.column(searchColumn).search(searchTerm, true, false).draw();
        const rowCount = api.rows({ filter: 'applied' }).count();
        return rowCount > 0;
    }

    // Definir clearFilters
    function clearFilters(api) {
        api.search('');
        api.columns().every(function () { this.search(''); });
        api.draw(false);
    }

    // Definir setActiveButton
    function setActiveButton(activeButtonId) {
        $("#btn-asignados, #btn-por-asignar, #btn-recibidos, #btn-devuelto")
            .removeClass("btn-primary").addClass("btn-secondary");
        $(`#${activeButtonId}`).removeClass("btn-secondary").addClass("btn-primary");
    }

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const TicketData = response.ticket;
                    currentTicketNroForImage = TicketData[0]?.nro_ticket;

                    // Show status of the first ticket (or most recent)
                    if (TicketData && TicketData.length > 0) {
                        const firstTicket = TicketData[0];
                        showTicketStatusIndicator(firstTicket.name_status_ticket, firstTicket.name_accion_ticket);
                    } else {
                        hideTicketStatusIndicator();
                    }

                    const detailsPanel = document.getElementById("ticket-details-panel");
                    detailsPanel.innerHTML = "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

                    if (TicketData && TicketData.length > 0) {
                        // Destroy DataTables if already initialized
                        if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
                            $("#tabla-ticket").DataTable().destroy();
                            if (theadElement) theadElement.innerHTML = "";
                            if (tbodyElement) tbodyElement.innerHTML = "";
                        }

                        const allDataKeys = Object.keys(TicketData[0] || {});
                        const columnsConfig = [];
                        const displayLengthForTruncate = 25;

                        // Determine if "Carga de Llave" column should be visible
                        let shouldShowCargaLlaveColumn = false;
                        for (const ticket of TicketData) {
                            const hasSendKeyDate = ticket.date_sendkey && String(ticket.date_sendkey).trim() !== "";
                            if (ticket.name_status_lab === "Reparado" && !hasSendKeyDate) {
                                shouldShowCargaLlaveColumn = true;
                                break;
                            }
                        }

                        // Configuración de columnas (sin cambios)
                        for (const key in columnTitles) {
                            if (allDataKeys.includes(key)) {
                                const isVisible = TicketData.some((item) => {
                                    const value = item[key];
                                    return value !== null && value !== undefined && String(value).trim() !== "";
                                });

                                const columnDef = {
                                    data: key,
                                    title: columnTitles[key],
                                    defaultContent: "",
                                    visible: isVisible,
                                };

                                if (key === "razonsocial_cliente") {
                                    columnDef.render = function (data, type, row) {
                                        if (type === "display" || type === "filter") {
                                            const fullText = String(data || "").trim();
                                            if (fullText.length > displayLengthForTruncate) {
                                                return `<span class="truncated-cell" data-full-text="${fullText}">${fullText.substring(0, displayLengthForTruncate)}...</span>`;
                                            }
                                            return fullText;
                                        }
                                        return data;
                                    };
                                }
                                columnsConfig.push(columnDef);
                            }
                        }

                        // Add "Acciones" column
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
                                const serialPos = row.serial_pos || "";
                                const confirm_date_repuesto = row.confirm_date;

                                let buttonsHtml = "";
                                if (currentStatus === "Reparado") {
                                    buttonsHtml += `<button class="btn btn-warning btn-sm" disabled>Reparado</button>`;
                                } else if (currentStatus === "Irreparable") {
                                    buttonsHtml += `<button class="btn btn-danger btn-sm" disabled>Irreparable</button>`;
                                } else if (currentStatus === "Recibido en Taller" || confirmTaller === "f") {
                                    buttonsHtml += `
                                        <button type="button" id="CheckConfirmTaller" class="btn btn-warning btn-sm confirm-waiting-btn"
                                            title="En espera de confirmar en el taller" data-serial-pos="${serialPos}" data-id-ticket="${idTicket}" data-nro-ticket="${nroTicket}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16">
                                                <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"/>
                                            </svg>
                                        </button>
                                    `;
                                } else if (confirm_date_repuesto === "t") {
                                    buttonsHtml += `
                                        <button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-btn ms-2" title="Espere la llegada de los repuesto para cambiar el estatus"
                                            data-bs-toggle="modal" data-bs-target="#changeStatusModal" data-id="${idTicket}" data-current-status="${currentStatus}" disabled>
                                            Cambiar Estatus
                                        </button>`;
                                } else {
                                    buttonsHtml += `
                                        <button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-btn ms-2"
                                            data-bs-toggle="modal" data-bs-target="#changeStatusModal" data-id="${idTicket}" data-current-status="${currentStatus}">
                                            Cambiar Estatus
                                        </button>
                                    `;
                                }
                                return buttonsHtml;
                            },
                        });

                        // Add "Carga de Llave" column
                        columnsConfig.push({
                            data: null,
                            title: "Carga de Llave",
                            name: "carga_de_llave",
                            orderable: false,
                            searchable: false,
                            visible: shouldShowCargaLlaveColumn,
                            className: "dt-body-center",
                            render: function (data, type, row) {
                                const hasSendKeyDate = row.date_sendkey && String(row.date_sendkey).trim() !== "";
                                if (row.name_status_lab === "Reparado" && !hasSendKeyDate) {
                                    return `<input type="checkbox" class="receive-key-checkbox" data-id-ticket="${row.id_ticket}" data-nro-ticket="${row.nro_ticket}">`;
                                } else if (hasSendKeyDate) {
                                    return '<i class="bi bi-check-circle-fill text-success" title="Llave Recibida"></i>';
                                }
                                return "";
                            },
                        });

                        // Add "Enviar Al Rosal" column
                        columnsConfig.push({
                            data: null,
                            title: "Acción",
                            name: "Enviar_AlRosal",
                            orderable: false,
                            searchable: false,
                            visible: true,
                            className: "dt-body-center",
                            render: function (data, type, row) {
                                if (row.name_status_lab === "Reparado") {
                                    const hasSendKeyDate = row.date_sendkey && String(row.date_sendkey).trim() !== "";
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
                                }
                                return "";
                            },
                        });

                        // Initialize DataTables
                        dataTableInstance = $(tableElement).DataTable({
                            order: [[0, 'desc']],
                            scrollX: "200px",
                            responsive: false,
                            data: TicketData,
                            columns: columnsConfig,
                            pagingType: "simple_numbers",
                            lengthMenu: [5, 10, 25, 50, 100],
                            autoWidth: false,
                            buttons: [{ extend: "colvis", text: "Mostrar/Ocultar Columnas", className: "btn btn-secondary" }],
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
                                buttons: { colvis: "Visibilidad de Columna" },
                            },
                            dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
                            initComplete: function (settings, json) {
                                const api = this.api();

                                // Set filter buttons
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

                                // Determine the correct filter button based on the current module
                                const currentPath = window.location.pathname.split('/').pop().replace('.html', '');
                                const buttonMapping = {
                                    'enviado_taller': 'btn-asignados',
                                    'asignar_tecnico': 'btn-por-asignar',
                                    'tecnico': 'btn-recibidos',
                                    'entregado_cliente': 'btn-devuelto'
                                };
                                const activeButton = buttonMapping[currentPath] || 'btn-por-asignar';

                                // Event listeners for filter buttons
                                $("#btn-por-asignar").on("click", function () {
                                    clearFilters(api);
                                    api.column(9).search("^Recibido en Taller$", true, false).draw();
                                    const rowCount = api.rows({ filter: 'applied' }).count();
                                    if (rowCount === 0) return findFirstButtonWithData(api);
                                    api.column('carga_de_llave:name').visible(false);
                                    api.column('Enviar_AlRosal:name').visible(false);
                                    api.column(11).visible(false);
                                    api.column(10).visible(false);
                                    setActiveButton("btn-por-asignar");
                                    showTicketStatusIndicator('En proceso', 'Recibido en Taller');
                                    applyNroTicketSearch(api);
                                });

                                $("#btn-asignados").on("click", function () {
                                    clearFilters(api);
                                    api.column(8).search("^Enviado a taller$", true, false).draw();
                                    api.column(9).search("En proceso de Reparación|Reparado|Pendiente por repuesto", true, false).draw();
                                    const rowCount = api.rows({ filter: 'applied' }).count();
                                    if (rowCount === 0) return findFirstButtonWithData(api);
                                    api.column('carga_de_llave:name').visible(true);
                                    api.column('Enviar_AlRosal:name').visible(true);
                                    api.column(11).visible(false);
                                    api.column(10).visible(false);
                                    setActiveButton("btn-asignados");
                                    showTicketStatusIndicator('En proceso', ['En proceso de Reparación', 'Reparado', 'Pendiente por repuesto']);
                                    applyNroTicketSearch(api);
                                });

                                $("#btn-recibidos").on("click", function () {
                                    clearFilters(api);
                                    api.column(8).search("^En espera confirmación carga de llaves$", true, false).draw();
                                    const rowCount = api.rows({ filter: 'applied' }).count();
                                    if (rowCount === 0) return findFirstButtonWithData(api);
                                    api.column('carga_de_llave:name').visible(false);
                                    api.column('Enviar_AlRosal:name').visible(true);
                                    api.column(11).visible(true);
                                    setActiveButton("btn-recibidos");
                                    showTicketStatusIndicator('En proceso', 'Confirmación carga de llaves');
                                    applyNroTicketSearch(api);
                                });

                                $("#btn-devuelto").on("click", function () {
                                    clearFilters(api);
                                    api.column(8).search("^En el Rosal$", true, false).draw();
                                    const rowCount = api.rows({ filter: 'applied' }).count();
                                    if (rowCount === 0) return findFirstButtonWithData(api);
                                    document.querySelectorAll(".load-key-button").forEach(button => button.style.display = "none");
                                    document.querySelectorAll(".receive-key-checkbox").forEach(checkbox => checkbox.style.display = "none");
                                    setActiveButton("btn-devuelto");
                                    showTicketStatusIndicator('En proceso', 'En el Rosal');
                                    applyNroTicketSearch(api);
                                });

                                // Truncated cell click handler
                                $("#tabla-ticket tbody").off("click", ".truncated-cell, .expanded-cell").on("click", ".truncated-cell, .expanded-cell", function (e) {
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

                                // Load key button handler
                                $("#tabla-ticket tbody").off("click", ".load-key-button").on("click", ".load-key-button", function (e) {
                                    e.stopPropagation();
                                    const ticketId = $(this).data("id-ticket");
                                    const nroTicket = $(this).data("nro-ticket");
                                    const hasSendKeyDate = $(this).data("has-send-key-date");
                                    const serialPos = $(this).data("serial-pos");

                                    if (hasSendKeyDate !== true) {
                                        const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                                        Swal.fire({
                                            title: `<div class="custom-modal-header-title bg-gradient-primary text-white"><div class="custom-modal-header-content">Confirmar envio al rosal</div></div>`,
                                            html: `<div class="custom-modal-body-content"><div class="mb-4">${customWarningSvg}</div><p class="h4 mb-3" style="color: black;">¿Desea enviar al rosal el Pos asociado <span id="numeroserial" style="display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> al Nro de ticket: <span style="display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> <span style="color: #004242;">Sin cargar las llaves?</span></p></div>`,
                                            confirmButtonText: "Si",
                                            color: "black",
                                            confirmButtonColor: "#003594",
                                            cancelButtonText: "No",
                                            showCancelButton: true,
                                            showConfirmButton: true,
                                            focusConfirm: false,
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                sendTicketToRosal1(ticketId, nroTicket, false, serialPos);
                                            }
                                        });
                                        return;
                                    } else {
                                        $("#modalTicketNroSendKey").text(nroTicket);
                                        $("#modalHiddenTicketIdSendKey").val(ticketId);
                                        sendTicketToRosal(ticketId, nroTicket, true, serialPos);
                                    }
                                });

                                // Table row click handler
                                $("#tabla-ticket tbody").off("click", "tr").on("click", "tr", function (e) {
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
                                    const rowData = api.row(tr).data();
                                    if (!rowData) return;
                                    $("#tabla-ticket tbody tr").removeClass("table-active");
                                    tr.addClass("table-active");
                                    const ticketId = rowData.id_ticket;
                                    const selectedTicketDetails = TicketData.find(t => t.id_ticket == ticketId);
                                    if (selectedTicketDetails) {
                                        detailsPanel.innerHTML = formatTicketDetailsPanel(selectedTicketDetails);
                                      loadTicketHistory(ticketId, selectedTicketDetails.nro_ticket, selectedTicketDetails.serial_pos || '');
                                        if (selectedTicketDetails.serial_pos) {
                                            downloadImageModal(selectedTicketDetails.serial_pos);
                                        } else {
                                            const imgElement = document.getElementById("device-ticket-image");
                                            if (imgElement) {
                                                imgElement.src = '__DIR__ . "/../../../public/img/consulta_rif/POS/mantainment.png';
                                                imgElement.alt = "Serial no disponible";
                                            }
                                        }
                                    } else {
                                        detailsPanel.innerHTML = "<p>No se encontraron detalles para este ticket.</p>";
                                    }
                                });

                                // Confirm waiting button handler
                                $("#tabla-ticket tbody").off("click", ".confirm-waiting-btn").on("click", ".confirm-waiting-btn", function (e) {
                                    e.stopPropagation();
                                    const ticketId = $(this).data("id-ticket");
                                    const nroTicket = $(this).data("nro-ticket");
                                    const serialPos = $(this).data("serial-pos") || "";
                                    currentTicketIdForConfirmTaller = ticketId;
                                    currentNroTicketForConfirmTaller = nroTicket;
                                    $("#modalTicketIdConfirmTaller").val(ticketId);
                                    $("#modalHiddenNroTicketConfirmTaller").val(nroTicket);
                                    $("#serialPost").text(serialPos);
                                    $("#modalTicketIdConfirmTaller").text(nroTicket);
                                    if (confirmInTallerModalInstance) {
                                        confirmInTallerModalInstance.show();
                                    } else {
                                        console.error("La instancia del modal 'confirmInTallerModal' no está disponible.");
                                    }
                                });

                                // Initialize with the correct filter and nro_ticket search
                                findFirstButtonWithData(api);
                            },
                        });

                        if (tableContainer) tableContainer.style.display = "";
                    } else {
                        if (tableContainer) {
                            tableContainer.innerHTML = `
                                <tr>
                                    <td colspan="14" class="text-center text-muted py-5">
                                        <div class="d-flex flex-column align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                                                <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                            </svg>
                                            <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                                            <p class="text-muted mb-0">No hay tickets en Taller para mostrar en este momento.</p>
                                        </div>
                                    </td>
                                </tr>`;
                            tableContainer.style.display = "";
                        }
                    }
                } else {
                    if (tableContainer) {
                        tableContainer.innerHTML = `<p>Error al cargar los datos: ${response.message || "Mensaje desconocido"}</p>`;
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
                tableContainer.innerHTML = `
                    <tr>
                        <td colspan="14" class="text-center text-muted py-5">
                            <div class="d-flex flex-column align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                                    <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                </svg>
                                <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                                <p class="text-muted mb-0">No hay tickets en Taller para mostrar en este momento.</p>
                            </div>
                        </td>
                    </tr>`;
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
                  <p class="h4 mb-3"  style = "color: black">¿Seguro que desea Enviar el Pos con el Serial <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> asociado al Nro de ticket: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro}</span> al Módulo Gestión Rosal?</p>`,
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
                                html: `El Pos asociado al ticket Nro: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroticket}</span> se ha enviado al <span style = "<span style = "border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Módulo Gestión Rosal</span> correctamente.`,
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
                                html: `El Pos asociado al ticket Nro: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroticket}</span> se ha enviado al Módulo Gestión Rosal correctamente.`,
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
                    
                    if (isEnElRosalForLab) {
                        // Tiempo 1: Desde la gestión anterior (TG)
                        if (prevItem && prevItem.fecha_de_cambio) {
                            const elapsedFromPrevious = calculateTimeElapsed(prevItem.fecha_de_cambio, item.fecha_de_cambio);
                            if (elapsedFromPrevious) {
                                durationLabFromPreviousText = elapsedFromPrevious.text;
                            }
                        }
                        
                        // Tiempo 2: Sumar todos los tiempos de las gestiones marcadas en naranja (En Taller)
                        // Las gestiones naranjas son aquellas con estatus "En proceso de Reparación" o "Reparado"
                        // El historial está ordenado de más reciente (index 0) a más antiguo (último índice)
                        let totalTallerMinutes = 0;
                        for (let i = index + 1; i < response.history.length; i++) {
                            const histItem = response.history[i];
                            const prevHistItem = response.history[i - 1] || null; // La gestión más reciente que esta
                            
                            if (histItem && histItem.fecha_de_cambio && prevHistItem && prevHistItem.fecha_de_cambio) {
                                const histStatusLab = cleanString(histItem.name_status_lab);
                                const isReparacionStatus = histStatusLab && 
                                    (histStatusLab.toLowerCase().includes('en proceso de reparación') || 
                                     histStatusLab.toLowerCase().includes('reparado'));
                                const isRecibidoEnTaller = histStatusLab && 
                                    histStatusLab.toLowerCase().includes('recibido en taller');
                                
                                // Si es una gestión naranja (taller con reparación), sumar su tiempo
                                // El tiempo es desde esta gestión hasta la siguiente más reciente
                                if (isReparacionStatus && !isRecibidoEnTaller) {
                                    const duration = calculateTimeElapsed(histItem.fecha_de_cambio, prevHistItem.fecha_de_cambio);
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
                    if (isEnElRosalForLab && (durationLabFromPreviousText || durationLabFromTallerText)) {
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
                    const buttonText = isCreation
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
                                                ${isEnElRosalForLab ? `
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
        // Mostrar tiempo total sumando todas las gestiones naranjas
        let durationLabFromPreviousText = '';
        let durationLabFromTallerText = '';
        const currentAccion = cleanString(item.name_accion_ticket);
        const isEnElRosal = currentAccion && currentAccion.toLowerCase().includes('en el rosal') && !currentAccion.toLowerCase().includes('en espera de confirmar recibido');
        
        if (previous && isEnElRosal) {
            // Tiempo 1: Desde la gestión anterior (TG)
                if (previous && previous.fecha_de_cambio) {
                    const elapsedFromPrevious = calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio);
                    if (elapsedFromPrevious) {
                        durationLabFromPreviousText = elapsedFromPrevious.text;
                    }
                }
                
            // Tiempo 2: Sumar todos los tiempos de las gestiones marcadas en naranja (En Taller)
            // Las gestiones naranjas son aquellas con estatus "En proceso de Reparación" o "Reparado"
            // El historial está ordenado de más reciente (index 0) a más antiguo (último índice)
            let totalTallerMinutes = 0;
                for (let i = index + 1; i < history.length; i++) {
                    const histItem = history[i];
                const prevHistItem = history[i - 1] || null; // La gestión más reciente que esta
                
                if (histItem && histItem.fecha_de_cambio && prevHistItem && prevHistItem.fecha_de_cambio) {
                    const histStatusLab = cleanString(histItem.name_status_lab);
                    const isReparacionStatus = histStatusLab && 
                        (histStatusLab.toLowerCase().includes('en proceso de reparación') || 
                         histStatusLab.toLowerCase().includes('reparado'));
                    const isRecibidoEnTaller = histStatusLab && 
                        histStatusLab.toLowerCase().includes('recibido en taller');
                    
                    // Si es una gestión naranja (taller con reparación), sumar su tiempo
                    // El tiempo es desde esta gestión hasta la siguiente más reciente
                    if (isReparacionStatus && !isRecibidoEnTaller) {
                        const duration = calculateTimeElapsed(histItem.fecha_de_cambio, prevHistItem.fecha_de_cambio);
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
        
        // Calcular duración del estatus de Domiciliación (solo cuando hay cambio)
        // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde la creación del ticket
        let durationFromPreviousText = '';
        let durationFromCreationText = '';
        if (previous) {
            const statusDomChanged = getChange(item.name_status_domiciliacion, previous.name_status_domiciliacion);
            if (statusDomChanged && cleanString(item.name_status_domiciliacion)) {
                // Tiempo 1: Desde la gestión anterior (ya calculado como elapsed)
                if (previous && previous.fecha_de_cambio) {
                    const elapsedFromPrevious = calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio);
                    if (elapsedFromPrevious) {
                        durationFromPreviousText = elapsedFromPrevious.text;
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
                
                if (ticketCreationDate) {
                    // Calcular duración desde la creación del ticket hasta el cambio actual
                    const duration = calculateTimeElapsed(ticketCreationDate, item.fecha_de_cambio);
                    if (duration) {
                        durationFromCreationText = duration.text;
                    }
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
                    <p class="h4 mb-3" style = "color: #343a40">¿Deseas Cargar las llaves con el Nro de ticket:<span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span>?</p><br><span style = 'color:red; font-size: 74%;'>Confirmar carga de llaves en el 'Módulo Gestión Rosal'.</span>
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

  // Función para resetear el select a su estado original
  function resetModalNewStatusSelect() {
    if (modalNewStatusSelect) {
      // Resetear el select a su estado original (opción vacía/placeholder)
      modalNewStatusSelect.selectedIndex = 0; // Seleccionar la primera opción (Seleccione)
      modalNewStatusSelect.value = ""; // Asegurar que el valor esté vacío
      
      // Remover cualquier atributo de validación que pueda tener
      modalNewStatusSelect.classList.remove("is-valid", "is-invalid");
      
      // Restaurar el estilo original si fue modificado
      modalNewStatusSelect.style.color = "";
    }
  }

  if (buttonCerrarModal) {
    buttonCerrarModal.addEventListener("click", function () {
      rescheduleModal.hide(); // Oculta el modal de renovación
      // Resetear el select cuando se cierra el modal
      resetModalNewStatusSelect();
    });
  }

  // También escuchar el evento de cierre del modal (por si se cierra de otra forma: ESC, clic fuera, etc.)
  const rescheduleModalElement = document.getElementById("rescheduleModal");
  if (rescheduleModalElement) {
    rescheduleModalElement.addEventListener("hidden.bs.modal", function () {
      // Resetear el select cuando el modal se oculta completamente
      resetModalNewStatusSelect();
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
                            overdueTicketsQueue.shift();
                            processNextOverdueTicket();
                        }
                    });

                } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                    // --- Lógica para "Cerrar" (si se usa la X o se hace clic fuera si allowOutsideClick está habilitado) ---
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
            overdueTicketsQueue = []; // Clear the queue if user cancels main selection modal
          }
        });
      }
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
            processNextOverdueTicket(); // Iniciar el procesamiento de la cola
          } else {
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

