let currentTicketNroForImage = null;
let paymentAgreementModalInstance = null; // Variable global para la instancia del modal
let uploadDocumentModalInstance = null; // Variable global para la instancia del modal de subir documento
let idTicket = null;
let DocumentType = null;
let motivoRechazoSelect = null; // ✅ AGREGAR ESTA VARIABLE
let confirmarRechazoModal = null; // ✅ AGREGAR ESTA VARIABLE
let currentSerial = null;

  document.getElementById("confirmarRechazoBtn").addEventListener("click", function() {
    // Opcional: Obtén el texto del motivo seleccionado para mostrarlo en el modal
    const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");
    const motivoSeleccionadoTexto = motivoRechazoSelect.options[motivoRechazoSelect.selectedIndex].text;


    document.getElementById("motivoSeleccionadoTexto").textContent = motivoSeleccionadoTexto;
  });

  // Evento click para el botón "Confirmar Rechazo"
  $("#confirmarRechazoBtn").off("click").on("click", function() {
    const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");
    confirmarRechazoModal = new bootstrap.Modal(document.getElementById('modalConfirmacionRechazo'), {keyboard: false});

    if (!motivoRechazoSelect.value) {
      // Si no hay motivo seleccionado, muestra una alerta de SweetAlert2
      Swal.fire({
        icon: 'warning',
        title: 'No puede haber campos vacíos.',
        text: `Seleccione un motivo de rechazo.`,
        confirmButtonText: 'Ok',
        color: 'black',
        confirmButtonColor: '#003594'
      });
    } else {
      const motivoSeleccionadoTexto = motivoRechazoSelect.options[motivoRechazoSelect.selectedIndex].text;
      document.getElementById("motivoSeleccionadoTexto").textContent = motivoSeleccionadoTexto;
      confirmarRechazoModal.show();
    }
  });

function searchDomiciliacionTickets() {
  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getDomiciliacionTickets`
  );

  // Read nro_ticket from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const nroTicket = urlParams.get('nro_ticket');

  
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  const tableContainerParent = document.getElementById("tableContainerParent");

  const existingTable = document.getElementById("tabla-ticket");

  const existingTableBody = document.getElementById("table-ticket-body");

  const detailsPanel = document.getElementById("ticket-details-panel");

  if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
    $("#tabla-ticket").DataTable().destroy();

    $("#tabla-ticket thead").empty();

    $("#tabla-ticket tbody").empty();
  }

  if (tableContainerParent) {
    const existingMessages = tableContainerParent.querySelectorAll(
      "p.message-info, p.message-error"
    );

    existingMessages.forEach((msg) => msg.remove());
  }

  xhr.onload = function () {
    if (tableContainerParent) {
      existingTable.style.display = "table";

      tableContainerParent.style.display = "";
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

            { data: "nro_ticket", title: "N° Ticket" },

            {
              data: "razonsocial_cliente",

              title: "Razon social",

              // *** MODIFICACIÓN PARA TRUNCAR/EXPANDIR TEXTO ***

              render: function (data, type, row) {
                if (
                  type === "display" &&
                  data &&
                  data.length > displayLengthForTruncate
                ) {
                  return `<span class="truncated-cell" data-full-text="${data}">${data.substring(
                    0,
                    displayLengthForTruncate
                  )}...</span>`;
                }

                return data;
              },

              // ************************************************
            },

            { data: "rif", title: "Rif" },

            { data: "serial_pos", title: "Serial POS" },

            {
              data: "id_status_domiciliacion",

              title: "ID Domiciliación",

              visible: false, // OCULTA LA COLUMNA PERO MANTIENE LOS DATOS PARA FILTROS
            },

            {
              data: "name_accion_ticket",

              title: "Acción Realizada",

              // *** MODIFICACIÓN PARA TRUNCAR/EXPANDIR TEXTO ***

              render: function (data, type, row) {
                if (
                  type === "display" &&
                  data &&
                  data.length > displayLengthForTruncate
                ) {
                  return `<span class="truncated-cell" data-full-text="${data}">${data.substring(
                    0,
                    displayLengthForTruncate
                  )}...</span>`;
                }

                return data;
              },

              // ************************************************
            },

            { data: "name_status_lab", title: "Estado de Taller" },

            {
              data: "name_status_domiciliacion",
              title: "Estado de Domiciliación",
            },

            {
    data: null,
    title: "Acciones",
    orderable: false,
    searchable: false,
    width: "10%",
    render: function (data, type, row) {
        idTicket = row.id_ticket;
        const currentStatusDomiciliacion = row.id_status_domiciliacion;
        const currentNameStatusDomiciliacion = row.name_status_domiciliacion;
        const documentoConvenio = row.convenio_firmado;
        
        // Solo mostrar el botón de adjuntar documento si el status es 4 (Deudor - Convenio Firmado)
        if (currentStatusDomiciliacion == 4) {
            // Verificar si ya tiene documento de convenio
            const tieneConvenio = row.convenio_firmado === "Sí";
            
            if (tieneConvenio) {
                // Si ya tiene convenio, mostrar botón para visualizar
                return `
                    <div class="d-flex gap-1">
                        <button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-domiciliacion-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#changeStatusDomiciliacionModal"
                            data-id="${idTicket}"
                            data-nro-ticket="${row.nro_ticket}"
                            data-current-status-id="${currentStatusDomiciliacion}"
                            data-current-status-name="${currentNameStatusDomiciliacion}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-check-fill" viewBox="0 0 16 16">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5m9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5m-2.6 5.854a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-info btn-sm visualizar-documento-btn" 
                            data-id="${idTicket}" 
                            data-nro-ticket="${row.nro_ticket}"
                            data-convenio-url="${row.convenio_url || ''}"
                            data-convenio-filename="${row.convenio_filename || ''}"
                            data-serial="${row.serial_pos || ''}"
                            data=
                            title="Visualizar Documento de Convenio">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                            </svg>
                        </button>
                    </div>`;
            } else {
                // Si no tiene convenio, mostrar botón para adjuntar
                return `
                    <div class="d-flex gap-1">
                        <button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-domiciliacion-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#changeStatusDomiciliacionModal"
                            data-id="${idTicket}"
                            data-nro-ticket="${row.nro_ticket}"
                            data-current-status-id="${currentStatusDomiciliacion}"
                            data-current-status-name="${currentNameStatusDomiciliacion}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-check-fill" viewBox="0 0 16 16">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5m9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5m-2.6 5.854a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-success btn-sm adjuntar-documento-btn" 
                            data-id="${idTicket}" 
                            data-nro-ticket="${row.nro_ticket}"
                            title="Adjuntar Documento de Convenio">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-paperclip" viewBox="0 0 16 16">
                                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 0 1-7 0z"/>
                            </svg>
                        </button>
                    </div>`;
            }
        } else {
            // Para otros estados, solo mostrar botón de cambiar estatus
            return `
                <button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-domiciliacion-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#changeStatusDomiciliacionModal"
                    data-id="${idTicket}"
                    data-nro-ticket="${row.nro_ticket}"
                    data-current-status-id="${currentStatusDomiciliacion}"
                    data-current-status-name="${currentNameStatusDomiciliacion}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-check-fill" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5m9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5m-2.6 5.854a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                    </svg>
                </button>`;
        }
    },
},
          ];

          const thead = existingTable.querySelector("thead");

          thead.innerHTML = "";

          const headerRow = thead.insertRow();

          columnDefinitions.forEach((col) => {
            const th = document.createElement("th");

            th.textContent = col.title;

            headerRow.appendChild(th);
          });

          if (TicketData && TicketData.length > 0) {
            const dataTableInstance = $(existingTable).DataTable({
              scrollX: "200px",

              responsive: false,

              data: TicketData,

              columns: columnDefinitions,

              pagingType: "simple_numbers",

              lengthMenu: [5, 10, 25, 50],

              autoWidth: false,

              language: {
                lengthMenu: "Mostrar _MENU_",

                emptyTable: "No hay datos disponibles en la tabla",

                zeroRecords: "No se encontraron resultados para la búsqueda",

                info: "_TOTAL_ Registros",

                infoEmpty: "No hay datos disponibles",

                infoFiltered: " de _MAX_ Disponibles",

                search: "Buscar:",

                loadingRecords: "Buscando...",

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

                                    <button id="btn-pendiente-revisar" class="btn btn-secondary btn-sm me-1" title="Pendiente Por revisar domiciliacion">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">

                                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1.001.025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.417.41-.879.66-1.254l.866.5a7.98 7.98 0 0 1-.724 1.4l-.802-.646zm-.964 1.205c.122-.103.246-.198.369-.283l.758.653a8.073 8.073 0 0 1-.401.432l-.706-.707z"/>

                                            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>

                                            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>

                                        </svg>

                                    </button>



                                    <button id="btn-solvente" class="btn btn-secondary btn-sm me-1" title="Tickets Solventes - Deudor - Convenio Firmado Aprovado">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">

                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>

                                        </svg>

                                    </button>



                                    <button id="btn-gestion-comercial" class="btn btn-secondary btn-sm me-1" title="Gestión Comercial - Espera Respuesta Cliente">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bank" viewBox="0 0 16 16">

                                            <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.501.501 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89L8 0ZM3.777 3h8.447L8 1 3.777 3ZM2 6v7h1V6H2Zm2 0v7h2.5V6H4Zm3.5 0v7H10V6H7.5ZM11 6v7h1V6h-1Zm1-1V3H4v2h8Z"/>

                                        </svg>

                                    </button>

                                    <button id="btn-convenio-firmado" class="btn btn-secondary btn-sm me-1" title="Deudor - Convenio Firmado">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-check" viewBox="0 0 16 16">

                                            <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>

                                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>

                                        </svg>

                                    </button>

                                    <button id="btn-desafiliado-deuda" class="btn btn-secondary btn-sm me-1" title="Deudor - Desafiliado con Deuda">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">

                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>

                                        </svg>

                                    </button>

                                `;

                $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

                // Aplicar estilos iniciales a todos los botones

                function initializeButtonStyles() {
                  $(
                    "#btn-solvente, #btn-gestion-comercial, #btn-pendiente-revisar, #btn-convenio-firmado, #btn-desafiliado-deuda"
                  ).css({
                    "background-color": "#B0B0B0",

                    "border-color": "#B0B0B0",

                    color: "white",

                    transition: "all 0.3s ease",
                  });
                }

                // Inicializar estilos

                initializeButtonStyles();

                // Agregar estilos CSS personalizados para los botones

                function addCustomButtonStyles() {
                  const style = document.createElement("style");

                  style.textContent = `

                                        #btn-solvente, #btn-gestion-comercial, #btn-pendiente-revisar, #btn-convenio-firmado, #btn-desafiliado-deuda {

                                            transition: all 0.3s ease !important;

                                            padding: 0.25rem 0.5rem !important;

                                            font-size: 0.75rem !important;

                                            min-width: 32px !important;

                                            height: 32px !important;

                                        }

                                        

                                        .dt-buttons-container {

                                            gap: 0.25rem !important;

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

                                        

                                        #btn-convenio-firmado:hover {

                                            background-color: #007bff !important;

                                            border-color: #007bff !important;

                                            color: white !important;

                                            transform: translateY(-1px);

                                            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.4);

                                        }

                                        

                                        #btn-desafiliado-deuda:hover {

                                            background-color: #dc3545 !important;

                                            border-color: #dc3545 !important;

                                            color: white !important;

                                            transform: translateY(-1px);

                                            box-shadow: 0 2px 4px rgba(220, 53, 69, 0.4);

                                        }

                                        

                                        #btn-solvente:focus, #btn-gestion-comercial:focus, #btn-pendiente-revisar:focus, #btn-convenio-firmado:focus, #btn-desafiliado-deuda:focus {

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

                                        

                                        #btn-convenio-firmado.btn-primary {

                                            background-color: #007bff !important;

                                            border-color: #007bff !important;

                                            color: white !important;

                                            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);

                                        }

                                        

                                        #btn-desafiliado-deuda.btn-primary {

                                            background-color: #dc3545 !important;

                                            border-color: #dc3545 !important;

                                            color: white !important;

                                            box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);

                                        }

                                        

                                        #btn-solvente.btn-secondary, #btn-gestion-comercial.btn-secondary, #btn-pendiente-revisar.btn-secondary, #btn-convenio-firmado.btn-secondary, #btn-desafiliado-deuda.btn-secondary {

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

                  $("#btn-solvente")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");

                  $("#btn-gestion-comercial")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");

                  $("#btn-pendiente-revisar")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");

                  $("#btn-convenio-firmado")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");

                  $("#btn-desafiliado-deuda")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");

                  // Aplicar estilos activos al botón seleccionado

                  $(`#${activeButtonId}`)
                    .removeClass("btn-secondary")
                    .addClass("btn-primary");
                }

                // Función para verificar si hay datos en una búsqueda específica

                function checkDataExists(api, searchTerm, columnIndex) {
                  api.columns().search('').draw(false);
                  api.column(columnIndex).search(searchTerm, true, false).draw();
                  const rowCount = api.rows({ filter: 'applied' }).count();
                  return rowCount > 0;
                }

                // Función para limpiar todos los filtros

                function clearFilters(api) {
                  api.columns().search('').draw(false);
                  api.search('').draw(false);
                }

                // Función para buscar automáticamente el primer botón con datos

                function findFirstButtonWithData() {
                  // Debug: Ver todos los datos disponibles
                  const allData = dataTableInstance.rows().data().toArray();
                  
                  // Debug: Ver el ticket específico si existe
                  const targetTicket = allData.find(row => row.nro_ticket === nroTicket);
                  
                  const searchTerms = [
                    { button: "btn-pendiente-revisar", term: "^1$", column: 5, status: "Pendiente", action: "Pendiente Por revisar domiciliacion" },
                    { button: "btn-solvente", term: "^2$|^6$", column: 5, status: "Solvente", action: "Tickets Solventes" },
                    { button: "btn-gestion-comercial", term: "^3$", column: 5, status: "Gestión Comercial", action: "Gestión Comercial" },
                    { button: "btn-convenio-firmado", term: "^4$", column: 5, status: "Convenio Firmado", action: "Deudor - Convenio Firmado" },
                    { button: "btn-desafiliado-deuda", term: "^5$", column: 5, status: "Desafiliado", action: "Deudor - Desafiliado con Deuda" }
                  ];

                  // Si hay un nroTicket, buscar el filtro que contenga ese ticket
                  if (nroTicket) {
                    let ticketFound = false;
                    
                    for (const { button, term, column, status, action } of searchTerms) {
                      clearFilters(dataTableInstance);
                      dataTableInstance.column(column).search(term, true, false).draw();
                      const filteredData = dataTableInstance.rows({ filter: 'applied' }).data().toArray();
                      const filteredTickets = filteredData.map(row => row.nro_ticket);
                      const ticketExists = filteredData.some(row => row.nro_ticket === nroTicket);
                      
                      if (ticketExists) {
                        clearFilters(dataTableInstance);
                        dataTableInstance.column(column).search(term, true, false).draw();
                        if (button === "btn-desafiliado-deuda") {
                          dataTableInstance.column(9).visible(false);
                        } else {
                          dataTableInstance.column(9).visible(true);
                        }
                        setActiveButton(button);
                        
                        // Aplicar búsqueda del ticket DESPUÉS de activar el filtro
                        const searchInput = $('.dataTables_filter input');
                        searchInput.val(nroTicket);
                        dataTableInstance.search(nroTicket).draw();
                        
                        // Resaltar la fila del ticket encontrado
                        setTimeout(() => {
                          dataTableInstance.rows().every(function() {
                            const rowData = this.data();
                            if (rowData.nro_ticket === nroTicket) {
                              $(this.node()).addClass('table-active').css('background-color', '#e0f2f7');
                            } else {
                              $(this.node()).removeClass('table-active').css('background-color', '');
                            }
                          });
                        }, 100);
                        
                        ticketFound = true;
                        return true;
                      }
                    }
                    
                    // Si no se encuentra el ticket en ningún filtro
                    if (!ticketFound) {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Ticket no encontrado',
                        text: `El ticket ${nroTicket} no se encuentra en los datos disponibles.`,
                        confirmButtonText: 'Ok',
                        color: 'black',
                        confirmButtonColor: '#003594'
                      });
                      $('.dataTables_filter input').val(''); // Limpiar el input de búsqueda
                      return false; // No continuar con la búsqueda del primer filtro
                    }
                  }

                  // Buscar el primer filtro con datos
                  for (const { button, term, column, status, action } of searchTerms) {
                    const hasData = checkDataExists(dataTableInstance, term, column);
                    if (hasData) {
                      clearFilters(dataTableInstance);
                      dataTableInstance.column(column).search(term, true, false).draw();
                      if (button === "btn-desafiliado-deuda") {
                        dataTableInstance.column(9).visible(false);
                      } else {
                        dataTableInstance.column(9).visible(true);
                      }
                      setActiveButton(button);
                      
                      // Aplicar búsqueda del ticket DESPUÉS de activar el filtro
                      if (nroTicket) {
                        const searchInput = $('.dataTables_filter input');
                        searchInput.val(nroTicket);
                        dataTableInstance.search(nroTicket).draw();
                        
                        // Resaltar la fila del ticket encontrado
                        setTimeout(() => {
                          dataTableInstance.rows().every(function() {
                            const rowData = this.data();
                            if (rowData.nro_ticket === nroTicket) {
                              $(this.node()).addClass('table-active').css('background-color', '#e0f2f7');
                            } else {
                              $(this.node()).removeClass('table-active').css('background-color', '');
                            }
                          });
                        }, 100);
                      }
                      
                      return true;
                    }
                  }

                  // Si no hay datos
                  return false;
                }

                // Ejecutar la búsqueda automática al inicializar

                findFirstButtonWithData();

                // Funciones para manejar la visibilidad de la columna de Acciones
                function hideActionsColumn() {
                  // La columna de Acciones es la última (índice 9)
                  dataTableInstance.column(9).visible(false);
                }

                function showActionsColumn() {
                  // La columna de Acciones es la última (índice 9)
                  dataTableInstance.column(9).visible(true);
                }

                // Event listeners para los botones

                $("#btn-solvente").on("click", function () {
                  if (checkDataExists(dataTableInstance, "^2$|^6$", 5)) {
                    clearFilters(dataTableInstance);
                    dataTableInstance.column(5).search("^2$|^6$", true, false).draw();
                    setActiveButton("btn-solvente");
                    showActionsColumn();
                  } else {
                    findFirstButtonWithData();
                  }
                });

                $("#btn-gestion-comercial").on("click", function () {
                  if (checkDataExists(dataTableInstance, "^3$", 5)) {
                    clearFilters(dataTableInstance);
                    dataTableInstance.column(5).search("^3$", true, false).draw();
                    setActiveButton("btn-gestion-comercial");
                    showActionsColumn();
                  } else {
                    findFirstButtonWithData();
                  }
                });

                $("#btn-pendiente-revisar").on("click", function () {
                  if (checkDataExists(dataTableInstance, "^1$", 5)) {
                    clearFilters(dataTableInstance);
                    dataTableInstance.column(5).search("^1$", true, false).draw();
                    setActiveButton("btn-pendiente-revisar");
                    showActionsColumn();
                  } else {
                    findFirstButtonWithData();
                  }
                });

                $("#btn-convenio-firmado").on("click", function () {
                  if (checkDataExists(dataTableInstance, "^4$", 5)) {
                    clearFilters(dataTableInstance);
                    dataTableInstance.column(5).search("^4$", true, false).draw();
                    setActiveButton("btn-convenio-firmado");
                    showActionsColumn();
                  } else {
                    findFirstButtonWithData();
                  }
                });

                $("#btn-desafiliado-deuda").on("click", function () {
                  if (checkDataExists(dataTableInstance, "^5$", 5)) {
                    clearFilters(dataTableInstance);
                    dataTableInstance.column(5).search("^5$", true, false).draw();
                    setActiveButton("btn-desafiliado-deuda");
                    hideActionsColumn();
                  } else {
                    findFirstButtonWithData();
                  }
                });
              },
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

              // Event listener para el botón de visualizar documento de convenio
              $("#tabla-ticket tbody").on("click", ".visualizar-documento-btn", function () {
                  const ticketId = $(this).data("id");
                  const nroTicket = $(this).data("nro-ticket");
                  const convenioUrl = $(this).data("convenio-url");
                  const convenioFilename = $(this).data("convenio-filename");
                  const ticketRechazado = $(this).data("rechazado");
                  const BotonRechazo = document.getElementById('RechazoDocumento');
                  const serial = $(this).data("serial");
                  
                  // ✅ GUARDAR EL TICKET CORRECTO PARA EL RECHAZO
                  currentTicketIdForImage = ticketId;
                  currentTicketNroForImage = nroTicket;
                  currentSerial = serial;
                  
                  // Verificar que tenemos los datos necesarios
                  if (!convenioUrl || !convenioFilename) {
                      Swal.fire({
                          icon: 'warning',
                          title: 'Documento no disponible',
                          text: 'No se encontró el documento de convenio para este ticket.',
                          confirmButtonText: 'Aceptar',
                          color: 'black',
                          confirmButtonColor: '#003594'
                      });
                      return;
                  }
                  
                if (ticketRechazado === true || ticketRechazado === 't' || ticketRechazado === 'true') {
                  BotonRechazo.style.display = 'none';
                } else {
                  BotonRechazo.style.display = 'block';
                }

                  // Determinar si es PDF o imagen basándose en la extensión
                  const fileExtension = convenioFilename.toLowerCase().split('.').pop();
                  const isPdf = fileExtension === 'pdf';
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
                  
                  if (isPdf) {
                      // Es un PDF
                      showViewModal(ticketId, nroTicket, null, convenioUrl, convenioFilename);
                  } else if (isImage) {
                      // Es una imagen
                      showViewModal(ticketId, nroTicket, convenioUrl, null, convenioFilename);
                  } else {
                      // Tipo de archivo no reconocido, intentar como PDF
                      showViewModal(ticketId, nroTicket, null, convenioUrl, convenioFilename);
                  }
              });

            // ************* FIN: LÓGICA PARA TRUNCAR/EXPANDIR TEXTO *************

            $("#tabla-ticket tbody")
              .off("click", "tr") // Mantener este .off() para el clic de la fila

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

                const ticketId = rowData.id_ticket;

                const selectedTicketDetails = TicketData.find(
                  (t) => t.id_ticket == ticketId
                );

                detailsPanel.innerHTML = formatTicketDetailsPanel(selectedTicketDetails);
                loadTicketHistory(ticketId, selectedTicketDetails.nro_ticket, selectedTicketDetails.serial_pos || '');
                if (selectedTicketDetails.serial_pos) {

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
            existingTable.style.display = "none";

            const noDataMessage = document.createElement("p");

            noDataMessage.className = "message-info";

            noDataMessage.textContent =
              "No hay datos disponibles para el ID de usuario proporcionado.";

            if (tableContainerParent) {
              tableContainerParent.appendChild(noDataMessage);
            } else {
              existingTable.parentNode.insertBefore(
                noDataMessage,
                existingTable
              );
            }
          }
        } else {
          existingTable.style.display = "none";

          const errorMessage = document.createElement("p");

          errorMessage.className = "message-error";

          errorMessage.textContent =
            response.message || "Error al cargar los datos desde la API.";

          if (tableContainerParent) {
            tableContainerParent.appendChild(errorMessage);
          } else {
            existingTable.parentNode.insertBefore(errorMessage, existingTable);
          }

          console.error("Error de la API:", response.message);
        }
      } catch (error) {
        existingTable.style.display = "none";

        const errorMessage = document.createElement("p");

        errorMessage.className = "message-error";

        errorMessage.textContent =
          "Error al procesar la respuesta del servidor (JSON inválido).";

        if (tableContainerParent) {
          tableContainerParent.appendChild(errorMessage);
        } else {
          existingTable.parentNode.insertBefore(errorMessage, existingTable);
        }

        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      existingTable.style.display = "none";

      const noDataMessage = document.createElement("p");

      noDataMessage.className = "message-info";

      noDataMessage.innerHTML = `<div class="text-center text-muted py-5">

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
      existingTable.style.display = "none";

      const errorMessage = document.createElement("p");

      errorMessage.className = "message-error";

      errorMessage.textContent = `Error del servidor: ${xhr.status} ${xhr.statusText}`;

      if (tableContainerParent) {
        tableContainerParent.appendChild(errorMessage);
      } else {
        existingTable.parentNode.insertBefore(errorMessage, existingTable);
      }

      console.error("Error HTTP:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    existingTable.style.display = "none";

    const errorMessage = document.createElement("p");

    errorMessage.className = "message-error";

    errorMessage.textContent =
      "Error de conexión a la red. Verifica tu conexión a Internet.";

    if (tableContainerParent) {
      tableContainerParent.appendChild(errorMessage);
    } else {
      existingTable.parentNode.insertBefore(errorMessage, existingTable);
    }

    console.error("Error de red");
  };

  const id_user_input = document.getElementById("iduser");

  let id_user_value = "";

  if (id_user_input) {
    id_user_value = id_user_input.value;
  } else {
    console.warn(
      "Elemento con ID 'iduser' no encontrado. La búsqueda podría no funcionar correctamente."
    );
  }

  const datos = `action=getDomiciliacionTickets&id_user=${id_user_value}`;

  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", function () {
  searchDomiciliacionTickets();
  getMotivos();

  // Inicializar motivoRechazoSelect
  motivoRechazoSelect = document.getElementById("motivoRechazoSelect");

  const modalRechazoInstance = new bootstrap.Modal(document.getElementById('modalRechazo'));
  const botonCerrarmotivo = document.getElementById('CerrarModalMotivoRechazo');
  const modalConfirmacionRechazoBtn = document.getElementById('modalConfirmacionRechazoBtn');
  const approveTicketFromImageBtn = document.getElementById('approveTicketFromImage');
    
    if (approveTicketFromImageBtn) {
        approveTicketFromImageBtn.addEventListener('click', handleTicketApprovalFromImage);
    }


  if(modalConfirmacionRechazoBtn){
    modalConfirmacionRechazoBtn.addEventListener('click', function () {
      confirmarRechazoModal.hide();
    });
  }

  if (botonCerrarmotivo) {
    botonCerrarmotivo.addEventListener('click', function () {
      if(motivoRechazoSelect){
        motivoRechazoSelect.value = "";
      }
      modalRechazoInstance.hide();
    })
  }

  // Vaciar el select cuando el modal se cierre completamente
  document.getElementById('modalRechazo').addEventListener('hidden.bs.modal', function () {
    if(motivoRechazoSelect){
      motivoRechazoSelect.value = "";
    }
  });

  // Vaciar el select cuando el modal de confirmación se cierre completamente
  document.getElementById('modalConfirmacionRechazo').addEventListener('hidden.bs.modal', function () {
    if(motivoRechazoSelect){
      motivoRechazoSelect.value = "";
    }
  });


  // Obtener el botón de rechazo del DOM
  const rechazoDocumentoBtn = document.getElementById('RechazoDocumento');

  // 1. Manejar el evento de clic en el botón "Rechazar Documento"
  // La lógica es: cerrar el modal actual y luego abrir el nuevo.
  if (rechazoDocumentoBtn) {
    rechazoDocumentoBtn.addEventListener('click', function () {

      // Abre el modal de rechazo
      modalRechazoInstance.show();
    });
  }

  document
    .getElementById("generateNotaEntregaBtn")
    .addEventListener("click", function () {
      const ticketId = document.getElementById("generate_id_ticket").value;

      // Obtener datos del ticket para generar el número del convenio
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/documents/GetPaymentAgreementData`
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);

            if (!res || !res.success || !res.rows) {
              Swal.fire({
                icon: "warning",
                title: "No se encontraron datos",
                text: "No se pudieron obtener los datos del ticket para generar el convenio.",
              });
              return;
            }

            const d = res.rows[0];

            // Generar número del convenio firmado
            const serialPos = d.serialpos || d.serial_pos || "";
            const lastFourSerialDigits = serialPos.slice(-4);
            const convenioNumero = `CF-${ticketId}-${lastFourSerialDigits}`;

            // Almacenar el número del convenio en una variable global
            window.currentConvenioNumero = convenioNumero;

            // Mostrar loading

            // Simular proceso de generación (reemplazar con llamada real a la API)
            setTimeout(() => {
              // Cerrar el modal de generar convenio
              const generateConvenioModal = bootstrap.Modal.getInstance(
                document.getElementById("generateConvenioModal")
              );
              generateConvenioModal.hide();

              // Mostrar el modal de subir documento después de generar el convenio
              const ticketId =
                document.getElementById("generate_id_ticket").value;
              const nroTicket = document.getElementById(
                "generateModalTicketId"
              ).textContent;
              showUploadDocumentModal(ticketId, nroTicket);
            }, 2000);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            Swal.fire({
              icon: "error",
              title: "Error al procesar datos",
              text: "Hubo un error al procesar los datos del ticket.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error del servidor",
            text: `Error ${xhr.status}: ${xhr.statusText}`,
          });
        }
      };

      xhr.onerror = function () {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar al servidor para obtener los datos del ticket.",
        });
      };

      const data = `action=GetPaymentAgreementData&id_ticket=${ticketId}`;
      xhr.send(data);
    });
});

function handleTicketApprovalFromImage() {
    const nro_ticket = currentTicketNroForImage;
    const documentType = 'convenio_firmado';
    const serial = currentSerial;
    const id_ticket = currentTicketIdForImage;

    
    if (!id_ticket ) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el ID del ticket.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    if (!documentType) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el tipo de documento.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    if (!serial) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el serial del documento.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    if(!nro_ticket) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el número de ticket.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;

    Swal.fire({
        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
            <div class="custom-modal-header-content">Confirmar Aprobación</div>
            </div>`,
        html: `${customWarningSvg}<p class="mt-3" id="textConfirm">¿Está seguro que desea aprobar el documento del ticket Nro <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> asociado al serial <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serial}</span>?`,
        showCancelButton: true,
        confirmButtonColor: '#003594',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Aprobar',
        cancelButtonText: 'Cancelar',
        color: 'black',
        focusConfirm: false,
        allowOutsideClick: false, 
        allowEscapeKey: false,
        keydownListenerCapture: true,
        didOpen: () => {
            // Aplicar estilos personalizados después de que se abra el modal
            const backdrop = document.querySelector('.swal2-backdrop-show');
            const popup = document.querySelector('.swal2-popup');
            
            if (backdrop) {
                backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                backdrop.style.backdropFilter = 'blur(8px)';
            }
            
            if (popup) {
                popup.style.background = 'rgba(255, 255, 255, 0.95)';
                popup.style.backdropFilter = 'blur(10px)';
                popup.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                popup.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la aprobación
            approveTicket(nro_ticket, documentType, id_ticket);
        }
    });
}

function approveTicket(nro_ticket, documentType, id_ticket) {
    const id_user = document.getElementById('iduser').value;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/approve-document`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Aprobado!',
                        html: `El documento de  <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${documentType}</span> asociado al Nro Ticket <span style = "border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> ha sido aprobado correctamente.`,
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#003594',
                        color: 'black'
                    }).then(() => {
                       window.location.reload();
                        
                        // Recargar la tabla de tickets
                        if (typeof getTicketAprovalDocument === 'function') {
                            getTicketAprovalDocument();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al aprobar el documento',
                        confirmButtonText: 'Ok',
                        color: 'black',
                        confirmButtonColor: '#dc3545'
                    });
                }
            } catch (error) {
                console.error('Error al parsear la respuesta JSON:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Respuesta',
                    text: 'Error al procesar la respuesta del servidor',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#dc3545'
                });
            }
        } else {
            console.error(`Error HTTP ${xhr.status}: ${xhr.statusText}`);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: `Error HTTP ${xhr.status}: ${xhr.statusText}`,
                confirmButtonText: 'Ok',
                color: 'black',
                confirmButtonColor: '#dc3545'
            });
        }
    };

    xhr.onerror = function() {
        console.error('Error de red al intentar aprobar el ticket');
        Swal.fire({
            icon: 'error',
            title: 'Error de Red',
            text: 'Error de conexión con el servidor',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#dc3545'
        });
    };

    // Enviar los datos
    const data = `action=approve-document&nro_ticket=${encodeURIComponent(nro_ticket)}&document_type=${encodeURIComponent(documentType)}&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(id_ticket)}`;
    xhr.send(data);
}

// Event listener para el botón de confirmar rechazo usando event delegation
document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btnConfirmarAccionRechazo') {
        
        const ticketId = currentTicketIdForImage; // ✅ Usar la variable correcta
        const nroticket = currentTicketNroForImage;
        const motivoRechazoSelectElement = document.getElementById("motivoRechazoSelect");
        const motivoId = motivoRechazoSelectElement ? motivoRechazoSelectElement.value : "";
        const id_user = document.getElementById('iduser').value;
        const documentType = 'convenio_firmado';
        
        // Cerrar el modal de confirmación mientras se procesa la solicitud
        if (confirmarRechazoModal) {
            confirmarRechazoModal.hide();
        }

        // Verificación final para asegurar que tenemos los datos necesarios
        if (!ticketId || !motivoId || !nroticket || !id_user || !documentType) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Datos incompletos para el rechazo.',
                confirmButtonColor: '#003594'
            });
            return;
        }

        const xhr = new XMLHttpRequest();
        const datos = `action=rechazarDocumento&ticketId=${encodeURIComponent(ticketId)}&motivoId=${encodeURIComponent(motivoId)}&nroTicket=${encodeURIComponent(nroticket)}&id_user=${encodeURIComponent(id_user)}&documentType=${encodeURIComponent(documentType)}`;
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/rechazarDocumento`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        // Enviar correo de rechazo
                        (function sendRejectionEmails() {
                            try {
                                const xhrEmail = new XMLHttpRequest();
                                xhrEmail.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/send_reject_document`);
                                xhrEmail.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                                xhrEmail.onload = function () {
                                    if (xhrEmail.status === 200) {
                                        try {
                                            const responseEmail = JSON.parse(xhrEmail.responseText);
                                            if (responseEmail.success) {
                                            } else {
                                                console.error('Error correo rechazo:', responseEmail.message);
                                            }
                                        } catch (e) {
                                            console.error('Error parseando respuesta correo rechazo:', e, xhrEmail.responseText);
                                        }
                                    } else {
                                        console.error('Error HTTP correo rechazo:', xhrEmail.status, xhrEmail.responseText);
                                    }
                                };

                                xhrEmail.onerror = function () {
                                    console.error('Error de red al enviar correo de rechazo');
                                };
                                
                                const params = `action=send_reject_document&id_user=${encodeURIComponent(id_user)}&documentType=${encodeURIComponent(documentType)}&nroTicket=${encodeURIComponent(nroticket)}&ticketId=${encodeURIComponent(ticketId)}`;
                                xhrEmail.send(params);
                            } catch (err) {
                                console.error('Fallo al disparar correo rechazo:', err);
                            }
                        })();
                        
                        Swal.fire({
                            icon: 'success',
                            title: '¡Rechazado!',
                            text: response.message,
                            confirmButtonColor: '#003594',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            keydownListenerCapture: true,
                            color: 'black'
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message,
                            confirmButtonColor: '#003594'
                        });
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Respuesta del servidor no válida.',
                        confirmButtonColor: '#003594'
                    });
                }
            } else {
                console.error("Error:", xhr.status, xhr.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Hubo un problema al conectar con el servidor.',
                    confirmButtonColor: '#003594'
                });
            }
        };

        xhr.onerror = function () {
            console.error("Error de red");
            Swal.fire({
                icon: 'error',
                title: 'Error de red',
                text: 'Verifique su conexión a internet.',
                confirmButtonColor: '#003594'
            });
        };
        
        xhr.send(datos);
    }
});

function showGenerateConvenioModal() {
  // Obtener el primer ticket del filtro actual (status 4)
  const dataTableInstance = $("#tabla-ticket").DataTable();
  const filteredData = dataTableInstance.rows({ filter: "applied" }).data();

  if (filteredData.length > 0) {
    const firstTicket = filteredData[0];
    const ticketId = firstTicket.id_ticket;
    const nroTicket = firstTicket.nro_ticket;

    // Configurar el modal de generar convenio
    document.getElementById("generateModalTicketId").textContent = nroTicket;
    document.getElementById("generate_id_ticket").value = ticketId;

    // ✅ CONFIGURACIÓN ROBUSTA DEL MODAL
    const modalElement = document.getElementById("generateConvenioModal");
    
    // Configurar múltiples atributos para compatibilidad
    modalElement.setAttribute('data-backdrop', 'static');        // Bootstrap 4
    modalElement.setAttribute('data-bs-backdrop', 'static');     // Bootstrap 5
    modalElement.setAttribute('data-keyboard', 'false');         // Bootstrap 4
    modalElement.setAttribute('data-bs-keyboard', 'false');     // Bootstrap 5
    
    // Crear instancia del modal con configuración explícita
    const generateConvenioModal = new bootstrap.Modal(modalElement, {
      backdrop: 'static',    // No cerrar al hacer clic fuera
      keyboard: false,       // No cerrar con Esc
      focus: true           // Mantener el foco
    });

    // Event listeners adicionales para prevenir cierre accidental
    modalElement.addEventListener('hide.bs.modal', function (event) {
      // Prevenir que se cierre accidentalmente
      event.preventDefault();
      return false;
    });

    // Mostrar el modal
    generateConvenioModal.show();
    
    // Prevenir eventos de teclado
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }, true);

  } else {
    Swal.fire({
      title: "Sin datos",
      text: "No hay tickets de convenio firmado para procesar.",
      icon: "warning",
      confirmButtonColor: "#003594",
    });
  }
}


function showAttachDocumentModal(ticketId = null) {
  // Si se pasa un ticketId específico, usarlo directamente
  if (ticketId) {
    // Configurar el modal de generar convenio
    document.getElementById("generate_id_ticket").value = ticketId;

    // Mostrar el modal de generar convenio
    const generateConvenioModal = new bootstrap.Modal(
      document.getElementById("generateConvenioModal")
    );
    generateConvenioModal.show();
    return;
  }

  // Obtener el primer ticket del filtro actual (status 4)
  const dataTableInstance = $("#tabla-ticket").DataTable();
  const filteredData = dataTableInstance.rows({ filter: "applied" }).data();

  if (filteredData.length > 0) {
    const firstTicket = filteredData[0];
    const ticketId = firstTicket.id_ticket;
    const nroTicket = firstTicket.nro_ticket;

    // Configurar el modal de generar convenio
    document.getElementById("generate_id_ticket").value = ticketId;

    // Mostrar el modal de generar convenio
    const generateConvenioModal = new bootstrap.Modal(
      document.getElementById("generateConvenioModal")
    );
    generateConvenioModal.show();
  } else {
    Swal.fire({
      title: "Sin datos",
      text: "No hay tickets de convenio firmado para procesar.",
      icon: "warning",
      confirmButtonColor: "#003594",
    });
  }
}

function showUploadDocumentModal(ticketId = null, nroTicket = null) {
  // Si se pasan parámetros, usarlos directamente
  if (!ticketId) {
    ticketId = document.getElementById("generate_id_ticket").value;
  }

  // Si no se pasa nroTicket, intentar obtenerlo del elemento idTicket
  if (!nroTicket) {
    const idTicketElement = document.getElementById("idTicket");
    if (idTicketElement) {
      nroTicket = idTicketElement.getAttribute("data-nro-ticket");
    }
  }

  const modalTicketId = document.getElementById("modalTicketId");
  const idTicketHidden = document.getElementById("id_ticket");

  if (modalTicketId) modalTicketId.textContent = nroTicket || ticketId;
  if (idTicketHidden) {
    idTicketHidden.value = ticketId;
    if (nroTicket) {
      idTicketHidden.setAttribute("data-nro-ticket", nroTicket);
    }
  }

  // Configurar el tipo de documento como convenio firmado
  const typeDocument = document.getElementById("type_document");
  if (typeDocument) {
    typeDocument.value = "convenio_firmado";
  }

  // Limpiar campos del modal y estados de validación
  const documentFileInput = document.getElementById("documentFile");
  const uploadForm = document.getElementById("uploadForm");
  const fileFormatInfo = document.getElementById("fileFormatInfo");
  const uploadFileBtn = document.getElementById("uploadFileBtn");
  
  if (documentFileInput) {
    documentFileInput.value = "";
    documentFileInput.classList.remove("is-valid", "is-invalid");
    // Limpiar estilos de background-image
    documentFileInput.style.removeProperty("background-image");
    documentFileInput.style.removeProperty("background-position");
    documentFileInput.style.removeProperty("background-repeat");
    documentFileInput.style.removeProperty("background-size");
    documentFileInput.style.removeProperty("padding-right");
  }
  
  if (uploadForm) {
    uploadForm.classList.remove("was-validated");
  }
  
  // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  if (imagePreview) {
    imagePreview.style.display = "none";
    imagePreview.src = "#";
  }
  if (imagePreviewContainer) {
    imagePreviewContainer.style.display = "none";
  }
  
  // Verificar que uploadMessage existe antes de usarlo
  const uploadMessage = document.getElementById("uploadMessage");
  if (uploadMessage) {
    uploadMessage.textContent = "";
    uploadMessage.classList.add("hidden");
  }
  
  // Mostrar el mensaje informativo
  if (fileFormatInfo) {
    fileFormatInfo.style.display = "block";
    fileFormatInfo.style.visibility = "visible";
  }
  
  // Deshabilitar el botón de subir al abrir el modal
  if (uploadFileBtn) {
    uploadFileBtn.disabled = true;
  }
  
  // Restaurar visibilidad de los mensajes de feedback
  if (documentFileInput && documentFileInput.parentElement) {
    const validFeedback = documentFileInput.parentElement.querySelector('.valid-feedback');
    const invalidFeedback = documentFileInput.parentElement.querySelector('.invalid-feedback');
    if (validFeedback) {
      validFeedback.style.display = '';
      validFeedback.style.visibility = '';
    }
    if (invalidFeedback) {
      invalidFeedback.style.display = '';
      invalidFeedback.style.visibility = '';
    }
  }

  // Configurar el listener para el input de archivo usando jQuery (más confiable)
  // Remover cualquier listener previo y agregar el nuevo
  if (documentFileInput && typeof $ !== 'undefined') {
    $(documentFileInput).off("change").on("change", function(e) {
      // Usar la función global handleFileSelectForUpload si está disponible
      if (typeof window.handleFileSelectForUpload !== 'undefined') {
        window.handleFileSelectForUpload.call(this, e);
      } else {
        // Si no está disponible, esperar un poco y volver a intentar
        setTimeout(() => {
          if (typeof window.handleFileSelectForUpload !== 'undefined') {
            window.handleFileSelectForUpload.call(this, e);
          } else {
            console.warn("handleFileSelectForUpload no está disponible");
          }
        }, 100);
      }
    });
  }

  // Usar la instancia global del modal
  if (!uploadDocumentModalInstance) {
    const uploadDocumentModalElement = document.getElementById(
      "uploadDocumentModal"
    );
    uploadDocumentModalInstance = new bootstrap.Modal(
      uploadDocumentModalElement
    );
  }
  uploadDocumentModalInstance.show();
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

  let garantiaMessage = "";

  if (
    d.garantia_instalacion !== null &&
    d.garantia_instalacion !== "" &&
    d.garantia_instalacion !== false &&
    d.garantia_instalacion !== "f"
  ) {
    garantiaMessage = "Aplica Garantía de Instalación";
  } else if (
    d.garantia_reingreso !== null &&
    d.garantia_reingreso !== "" &&
    d.garantia_reingreso !== false &&
    d.garantia_reingreso !== "f"
  ) {
    garantiaMessage = "Aplica Garantía por Reingreso";
  } else {
    garantiaMessage = "No aplica Garantía"; // O simplemente dejarlo vacío si no hay garantía
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

                          ${d.fecha_instalacion || "No posee"}

                        </div>

                        <div class="col-sm-6 mb-2">

                          <br><strong><div>Fecha último ticket:</div></strong>

                          ${d.fecha_cierre_anterior || "No posee"}

                        </div>

                        <div class="col-sm-6 mb-2">

                          <br><strong><div>Garantía:</div></strong>

                          <span style="font-weight: bold; color: ${
                            garantiaMessage.includes("Aplica") ? "red" : "green"
                          };">${garantiaMessage}</span>

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

                          ${d.nombre_estado_cliente || "Sin datos"}

                        </div><br>

                         <div class="col-sm-6 mb-2">

                            <br><strong><div>Estatus Ticket:</div></strong>

                            ${d.name_status_ticket}

                        </div><br>

                        <br><div class="col-sm-6 mb-2">

                              <br><strong><div>Falla Reportada:</div></strong>

                             <span class="falla-reportada-texto">${
                               d.name_failure
                             }</span>

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
                    
                    // Calcular tiempos para Domiciliación
                    let durationFromPreviousText = '';
                    let durationFromCreationText = '';
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
                            const duration = calculateTimeElapsed(ticketCreationDate, item.fecha_de_cambio);
                            if (duration) {
                                durationFromCreationText = duration.text;
                            }
                        }
                    }
                    
                    // Calcular tiempos para Taller (solo cuando la acción es "En el Rosal" - terminó la estadía en taller)
                    let durationLabFromPreviousText = '';
                    let durationLabFromTallerText = '';
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
                        timeBadge = `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; background-color: #fd7e14 !important; color: white !important; white-space: normal; overflow: visible; line-height: 1.2; text-align: center; display: inline-block; min-width: 80px;">${tgTtText}</span>`;
                    } else if (statusDomChanged && cleanString(item.name_status_domiciliacion) && (durationFromPreviousText || durationFromCreationText)) {
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

    let itemsHtml = '';
    const getChange = (itemVal, prevVal) => {
        const cleanItem = cleanString(itemVal);
        const cleanPrev = cleanString(prevVal);
        return cleanItem !== cleanPrev;
    };

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
        const isEnElRosalForLab = isEnElRosal; // Alias para compatibilidad
        
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
        const statusDomChanged = previous ? getChange(item.name_status_domiciliacion, previous.name_status_domiciliacion) : false;
        
        if (previous && statusDomChanged && cleanString(item.name_status_domiciliacion)) {
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
                        ${previous && statusDomChanged && cleanString(item.name_status_domiciliacion) ? `
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
  try {
    if (e && e.stopPropagation) e.stopPropagation();
  } catch (_) {}

  const legendHtml = `

        <div style="font-size: 0.95rem; text-align: left;">

            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#28a745; color:#fff; min-width:64px;">Verde</span><span class="ml-2">Menos de 1 hora</span></div>

            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#6f42c1; color:#fff; min-width:64px;">Morado</span><span class="ml-2">Entre 1 y 8 horas</span></div>

            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#fd7e14; color:#fff; min-width:64px;">Naranja</span><span class="ml-2">Más de 8 horas o al menos 1 día</span></div>

            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#ffc107; color:#212529; min-width:64px;">Amarillo</span><span class="ml-2">1 semana o más (1S+), o más de 2 días hábiles</span></div>

            <div class="d-flex align-items-center"><span class="badge" style="background-color:#dc3545; color:#fff; min-width:64px;">Rojo</span><span class="ml-2">1 mes o más (1M+), o más de 5 días hábiles</span></div>

        </div>`;

  Swal.fire({
    title: "Leyenda",

    html: legendHtml,

    icon: "info",

    confirmButtonText: "Entendido",

    confirmButtonColor: "#003594",

    color: "black",

    width: 520,
  });
}

$(document).ready(function () {
  const changeStatusDomiciliacionModalElement = document.getElementById(
    "changeStatusDomiciliacionModal"
  );

  if (changeStatusDomiciliacionModalElement) {
    const changeStatusDomiciliacionModal = new bootstrap.Modal(
      changeStatusDomiciliacionModalElement
    );

    const modalTicketIdDomiciliacion =
      changeStatusDomiciliacionModalElement.querySelector(
        "#modalTicketIdDomiciliacion"
      );

    const modalCurrentStatusDomiciliacion =
      changeStatusDomiciliacionModalElement.querySelector(
        "#modalCurrentStatusDomiciliacion"
      );

    const modalNewStatusDomiciliacionSelect =
      changeStatusDomiciliacionModalElement.querySelector(
        "#modalNewStatusDomiciliacionSelect"
      );

    const saveStatusDomiciliacionChangeBtn =
      changeStatusDomiciliacionModalElement.querySelector(
        "#saveStatusDomiciliacionChangeBtn"
      );

    const errorMessageDomiciliacion =
      changeStatusDomiciliacionModalElement.querySelector(
        "#errorMessageDomiciliacion"
      );

    $(document).on("click", ".cambiar-estatus-domiciliacion-btn", function () {
      const idTicket = $(this).data("id");

      const nroTicket = $(this).data("nro-ticket");

      const currentStatusName = $(this).data("current-status-name");

      const currentStatusId = $(this).data("current-status-id");

      // ✅ SIMPLE: Obtener el valor de convenio_firmado de los datos de DataTables
      const dataTableInstance = $("#tabla-ticket").DataTable();
      const rowData = dataTableInstance.row($(this).closest('tr')).data();
      const convenioFirmado = rowData.convenio_firmado || 'No';

      document.getElementById("idTicket").value = idTicket;

      const getIdTicket = document.getElementById("idTicket").value;

      // Store nro_ticket for later use

      if (nroTicket) {
        document
          .getElementById("idTicket")
          .setAttribute("data-nro-ticket", nroTicket);
      }

      if (modalTicketIdDomiciliacion)
        modalTicketIdDomiciliacion.value = getIdTicket;

      if (modalCurrentStatusDomiciliacion)
        modalCurrentStatusDomiciliacion.value = currentStatusName;

      // Limpiar cualquier mensaje de error previo

      if (errorMessageDomiciliacion) {
        errorMessageDomiciliacion.style.display = "none";

        errorMessageDomiciliacion.innerHTML = "";
      }

      // *** LLAMADA CLAVE: Cargar los estatus excluyendo el actual ***

      // Pasa el ID del estado actual y el valor de convenio_firmado
      getStatusDom(currentStatusId, convenioFirmado);

      // ABRIR EL MODAL EXPLICITAMENTE

      changeStatusDomiciliacionModal.show();
    });

    // Event listener para el botón de adjuntar documento
    $(document).on("click", ".adjuntar-documento-btn", function () {
      const idTicket = $(this).data("id");
      const nroTicket = $(this).data("nro-ticket");

      // Usar la función showUploadDocumentModal con los parámetros correctos
      showUploadDocumentModal(idTicket, nroTicket);

      // Usar la instancia global del modal
      if (!uploadDocumentModalInstance) {
        const uploadDocumentModalElement = document.getElementById(
          "uploadDocumentModal"
        );
        uploadDocumentModalInstance = new bootstrap.Modal(
          uploadDocumentModalElement
        );
      }
      uploadDocumentModalInstance.show();
    });

    if (saveStatusDomiciliacionChangeBtn) {
      saveStatusDomiciliacionChangeBtn.addEventListener("click", function () {
        const idTicket = document.getElementById("idTicket").value;

        const newStatusId = modalNewStatusDomiciliacionSelect.value;

        const id_user_input = document.getElementById("iduser");

        let id_user = "";

        if (id_user_input) {
          id_user = id_user_input.value;
        } else {
          console.warn(
            "Elemento con ID 'idTicket' (para el ID de usuario) no encontrado."
          );
        }

        if (!newStatusId || newStatusId === "" || newStatusId === "0") {
          if (errorMessageDomiciliacion) {
            errorMessageDomiciliacion.textContent =
              'Por favor, selecciona un "Nuevo Estatus".';

            errorMessageDomiciliacion.style.display = "block";

            errorMessageDomiciliacion.style.color = "white";
          }

          return;
        }

        // *** OBTENER OBSERVACIONES SI EL ESTATUS ES 3 ***

        let observations = "";

        if (newStatusId === "3") {
          const observationsText = document.getElementById("observationsText");

          if (observationsText) {
            observations = observationsText.value.trim();

            if (!observations) {
              if (errorMessageDomiciliacion) {
                errorMessageDomiciliacion.textContent =
                  "Por favor, ingrese las observaciones para este estatus.";

                errorMessageDomiciliacion.style.display = "block";

                errorMessageDomiciliacion.style.color = "white";
              }

              return;
            }
          }
        }

        // *** MODAL DE CONFIRMACIÓN ANTES DE CAMBIAR EL STATUS ***
        // Solo mostrar modal de confirmación para status 2, 3 y 4
        if (newStatusId === "2" || newStatusId === "3" || newStatusId === "4") {
          // Obtener el nombre del status actual y el nuevo status
          const currentStatusName = modalCurrentStatusDomiciliacion.value;
          const newStatusName =
            modalNewStatusDomiciliacionSelect.options[
              modalNewStatusDomiciliacionSelect.selectedIndex
            ].text;

          // Mostrar modal de confirmación personalizado y bonito
          Swal.fire({
            title:
              '<div style="font-size: 24px; font-weight: 600; color: #2c3e50; margin-bottom: 10px;">⚠️ Confirmar Cambio de Status</div>',
            html: `
                            <div style="text-align: center; padding: 20px 0;">
                                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                    <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">Status Actual:</div>
                                    <div style="font-size: 18px; font-weight: 600; background: rgba(255,255,255,0.2); padding: 8px; border-radius: 8px; backdrop-filter: blur(10px);">${currentStatusName}</div>
                                </div>
                                
                                <div style="margin: 15px 0;">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style="color: #667eea;">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                
                                <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);">
                                    <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">Nuevo Status:</div>
                                    <div style="font-size: 18px; font-weight: 600; background: rgba(255,255,255,0.2); padding: 8px; border-radius: 8px; backdrop-filter: blur(10px);">${newStatusName}</div>
                                </div>
                                
                                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #667eea;">
                                    <div style="font-size: 14px; color: #6c757d; font-weight: 500;">¿Está seguro de realizar este cambio?</div>
                                </div>
                            </div>
                        `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-check"></i>Cambiar',
            cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
            confirmButtonColor: "#003594 ",
            cancelButtonColor: "#dc3545",
            buttonsStyling: true,
            customClass: {
              popup: "swal2-popup-custom",
              confirmButton: "swal2-confirm-custom",
              cancelButton: "swal2-cancel-custom",
            },
            width: 480,
            padding: "30px",
            background: "#ffffff",
            backdrop: "rgba(0,0,0,0.4)",
            allowOutsideClick: false,
            showCloseButton: true,
            closeButtonHtml:
              '<i class="fas fa-times" style="color: #6c757d;"></i>',
          }).then((result) => {
            if (result.isConfirmed) {
              // Si confirma, cerrar el modal y resetear el select al index[0] (status 5)
              changeStatusDomiciliacionModal.hide();
              modalNewStatusDomiciliacionSelect.selectedIndex = 0;

              // Proceder con el cambio de status
              updateDomiciliacionStatus(
                idTicket,
                newStatusId,
                id_user,
                changeStatusDomiciliacionModal,
                observations
              );
            }
            // Si cancela, no hacer nada (el modal se mantiene abierto)
          });
        } else {
          // Para otros status (como el 5), proceder directamente sin confirmación
          updateDomiciliacionStatus(
            idTicket,
            newStatusId,
            id_user,
            changeStatusDomiciliacionModal,
            observations
          );
        }
      });
    }

    changeStatusDomiciliacionModalElement.addEventListener(
      "hidden.bs.modal",
      function () {
        if (modalTicketIdDomiciliacion) modalTicketIdDomiciliacion.value = "";

        if (modalCurrentStatusDomiciliacion)
          modalCurrentStatusDomiciliacion.value = "";

        if (modalNewStatusDomiciliacionSelect)
          modalNewStatusDomiciliacionSelect.value = "";

        if (errorMessageDomiciliacion) {
          errorMessageDomiciliacion.style.display = "none";

          errorMessageDomiciliacion.innerHTML = "";
        }

        // *** LIMPIAR CAMPO DE OBSERVACIONES ***

        const observationsContainer = document.getElementById(
          "observationsContainer"
        );

        if (observationsContainer) {
          observationsContainer.style.display = "none";

          const observationsText = document.getElementById("observationsText");

          if (observationsText) {
            observationsText.value = "";
          }
        }
      }
    );

    const closeIconBtn =
      changeStatusDomiciliacionModalElement.querySelector("#Close-icon");

    const closeButton =
      changeStatusDomiciliacionModalElement.querySelector("#close-button");

    if (closeIconBtn) {
      closeIconBtn.addEventListener("click", function () {
        // *** OCULTAR CAMPO DE OBSERVACIONES ***

        const observationsContainer = document.getElementById(
          "observationsContainer"
        );

        if (observationsContainer) {
          observationsContainer.style.display = "none";

          const observationsText = document.getElementById("observationsText");

          if (observationsText) {
            observationsText.value = "";
          }
        }

        changeStatusDomiciliacionModal.hide();
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        // *** OCULTAR CAMPO DE OBSERVACIONES ***

        const observationsContainer = document.getElementById(
          "observationsContainer"
        );

        if (observationsContainer) {
          observationsContainer.style.display = "none";

          const observationsText = document.getElementById("observationsText");

          if (observationsText) {
            observationsText.value = "";
          }
        }

        changeStatusDomiciliacionModal.hide();
      });
    }
  }
});

// Función para enviar la actualización del estatus de domiciliación al backend

function updateDomiciliacionStatus(
  idTicket,
  newStatusId,
  id_user,
  changeStatusDomiciliacionModal,
  observations = ""
) {
  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/updateDomiciliacionStatus`
  ); // Nueva ruta de API para actualizar

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  const changeStatusDomiciliacionModalElement = document.getElementById(
    "changeStatusDomiciliacionModal"
  );

  const errorMessageDomiciliacion =
    changeStatusDomiciliacionModalElement.querySelector(
      "#errorMessageDomiciliacion"
    );

  xhr.onload = function () {
    if (errorMessageDomiciliacion) {
      errorMessageDomiciliacion.style.display = "none";

      errorMessageDomiciliacion.innerHTML = "";
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

            // Si el nuevo status es 4 (Deudor - Convenio Firmado), no recargar la página
            willClose: () => {
              if (newStatusId !== "4") {
                location.reload();
              }
            },
          });

          const changeStatusDomiciliacionModalInstance = new bootstrap.Modal(
            changeStatusDomiciliacionModalElement
          );

          changeStatusDomiciliacionModalInstance.hide();

          searchDomiciliacionTickets();

          // Si el nuevo status es 4 (Deudor - Convenio Firmado), mostrar el modal de generar convenio
          if (newStatusId === "4") {
            // Obtener el número de ticket del elemento idTicket
            const nroTicket = document
              .getElementById("idTicket")
              .getAttribute("data-nro-ticket");
            
            // ✅ MOSTRAR MODAL SWEETALERT2 IMPOSIBLE DE CERRAR CON ESC
            showConvenioSwalModal(idTicket, nroTicket);
          }
        } else {
          if (errorMessageDomiciliacion) {
            errorMessageDomiciliacion.textContent =
              response.message ||
              "Error al actualizar el estatus de domiciliación.";

            errorMessageDomiciliacion.style.display = "block";
          }

          console.error(
            "Error de API al actualizar estatus:",
            response.message
          );
        }
      } catch (error) {
        if (errorMessageDomiciliacion) {
          errorMessageDomiciliacion.textContent =
            "Error al procesar la respuesta del servidor.";

          errorMessageDomiciliacion.style.display = "block";
        }

        console.error("Error parsing JSON al actualizar estatus:", error);
      }
    } else {
      if (errorMessageDomiciliacion) {
        errorMessageDomiciliacion.textContent = `Error del servidor: ${xhr.status} ${xhr.statusText}`;

        errorMessageDomiciliacion.style.display = "block";
      }

      console.error(
        "Error HTTP al actualizar estatus:",
        xhr.status,
        xhr.statusText
      );
    }
  };

  xhr.onerror = function () {
    if (errorMessageDomiciliacion) {
      errorMessageDomiciliacion.textContent =
        "Error de red al intentar actualizar el estatus.";

      errorMessageDomiciliacion.style.display = "block";
    }

    console.error("Error de red al actualizar estatus.");
  };

  // *** CONSTRUIR DATOS CON OBSERVACIONES SI ES NECESARIO ***

  let datos = `action=updateDomiciliacionStatus&id_ticket=${idTicket}&new_status_id=${newStatusId}&id_user=${id_user}`;

  if (observations && observations.trim() !== "") {
    datos += `&observations=${encodeURIComponent(observations)}`;
  }

  xhr.send(datos);
}

function getStatusDom(currentStatusIdToExclude = null, convenioFirmado = 'No') {
  // Acepta parámetros: ID del status actual y si tiene convenio firmado

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetStatusDomiciliacion`
  );

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success) {
          const select = document.getElementById(
            "modalNewStatusDomiciliacionSelect"
          );

          select.innerHTML =
            '<option value="" disabled selected hidden>Seleccione</option>'; // Limpiar y agregar la opción por defecto

          if (Array.isArray(response.estatus) && response.estatus.length > 0) {
            response.estatus.forEach((status) => {
              // *** AQUÍ ESTÁ LA LÓGICA CLAVE: FILTRAR LA OPCIÓN ACTUAL POR ID ***
              if (status.id_status_domiciliacion != currentStatusIdToExclude) {
                
                // ✅ SIMPLE: Si no tiene documento, ocultar los estatus de convenio aprobado/rechazado
                if (convenioFirmado !== 'Sí' && 
                    (status.name_status_domiciliacion.includes('Convenio Firmado Aprovado') || 
                     status.name_status_domiciliacion.includes('Convenio Firmado Rechazado'))) {
                  return; // Saltar este estatus
                }
                
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

          select.addEventListener("change", function () {
            const selectedValue = this.value;

            const observationsContainer = document.getElementById(
              "observationsContainer"
            );

            // Quitar el mensaje de error cuando se seleccione un estatus

            const errorMessageDomiciliacion = document.getElementById(
              "errorMessageDomiciliacion"
            );

            if (errorMessageDomiciliacion) {
              errorMessageDomiciliacion.style.display = "none";

              errorMessageDomiciliacion.innerHTML = "";
            }

            // Cambiar el color del texto a blanco cuando se seleccione una opción válida

            if (selectedValue && selectedValue !== "") {
              this.style.color = "white";
            } else {
              this.style.color = "#6c757d"; // Color gris para la opción por defecto
            }

            if (selectedValue === "3") {
              // Mostrar campo de observaciones

              if (!observationsContainer) {
                const form = document.getElementById(
                  "changeStatusDomiciliacionForm"
                );

                const observationsDiv = document.createElement("div");

                observationsDiv.id = "observationsContainer";

                observationsDiv.className = "mb-3";

                observationsDiv.innerHTML = `

                                    <label for="observationsText" class="form-label">Observaciones:</label>

                                    <textarea class="form-control" id="observationsText" rows="3" placeholder="Ingrese sus observaciones aquí..."></textarea>

                                `;

                form.appendChild(observationsDiv);
              } else {
                observationsContainer.style.display = "block";
              }
            } else if (selectedValue === "4") {
              // Status 4 - Deudor - Convenio Firmado
              // Ocultar campo de observaciones
              if (observationsContainer) {
                observationsContainer.style.display = "none";
                const observationsText =
                  document.getElementById("observationsText");
                if (observationsText) {
                  observationsText.value = "";
                }
              }
              // El modal se mostrará automáticamente después de confirmar el cambio
            } else if (selectedValue === "5") {
              // Mostrar modal de confirmación para "Deudor - Desafiliado con Deuda"

              Swal.fire({
                title: "⚠️ CONFIRMACIÓN REQUERIDA ⚠️",
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
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#003594",
                cancelButtonColor: "#6c757d",
                reverseButtons: true,
                focusCancel: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                keydownListenerCapture: true,
                customClass: {
                  popup: "swal-wide",
                  title: "swal-title-danger",
                  confirmButton: "swal-confirm-danger",
                  cancelButton: "swal-cancel-safe",
                },
                width: "500px",
                padding: "20px",
              }).then((result) => {
                if (result.isConfirmed) {
                  // Proceder con el cambio de status
                  // Obtener los valores necesarios para la actualización
                  const idTicket = document.getElementById('idTicket').value || window.currentTicketId;
                  const newStatusId = selectedValue; // El valor seleccionado en el select
                  const id_user = document.getElementById('id_user').value || window.currentUserId;
                  const changeStatusDomiciliacionModal = document.getElementById('changeStatusDomiciliacionModal');
                  const observationsText = document.getElementById('observationsText');
                  const observations = observationsText ? observationsText.value : '';
                  
                  // Llamar a la función de actualización
                  updateDomiciliacionStatus(
                    idTicket,
                    newStatusId,
                    id_user,
                    changeStatusDomiciliacionModal,
                    observations
                  );
                } else { // Si cancela (el bloque ELSE es correcto y se mantiene)
                  // Si cancela, resetear el select
                  const modalNewStatusDomiciliacionSelect =
                    document.getElementById(
                      "modalNewStatusDomiciliacionSelect"
                    );

                  if (modalNewStatusDomiciliacionSelect) {
                    modalNewStatusDomiciliacionSelect.value = "";
                    modalNewStatusDomiciliacionSelect.selectedIndex = 0;
                    modalNewStatusDomiciliacionSelect.style.color = "#6c757d";
                  }

                  // Ocultar campo de observaciones si está visible
                  if (observationsContainer) {
                    observationsContainer.style.display = "none";
                    const observationsText =
                      document.getElementById("observationsText");
                    if (observationsText) {
                      observationsText.value = "";
                    }
                  }
                }
              });
            } else {
              // Para cualquier otro status, ocultar observaciones
              if (observationsContainer) {
                observationsContainer.style.display = "none";
                const observationsText = document.getElementById("observationsText");
                if (observationsText) {
                  observationsText.value = "";
                }
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

document.addEventListener("DOMContentLoaded", function () {
  getStatusDom();

  // *** FUNCIONALIDAD DEL MODAL DE SUBIDA DE DOCUMENTO ***

  const uploadDocumentModalElement = document.getElementById(
    "uploadDocumentModal"
  );

  if (uploadDocumentModalElement) {
    // Usar la instancia global del modal
    if (!uploadDocumentModalInstance) {
      uploadDocumentModalInstance = new bootstrap.Modal(
        uploadDocumentModalElement
      );
    }

    // Event listener para el botón de subir archivo

    const uploadFileBtn = document.getElementById("uploadFileBtn");

    if (uploadFileBtn) {
      uploadFileBtn.addEventListener("click", function () {
        const documentFileInput = document.getElementById("documentFile");
        if (!documentFileInput) {
          console.error("Elemento documentFile no encontrado");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener el input de archivo.",
            confirmButtonText: "Ok",
            confirmButtonColor: "#003594",
            color: "black",
          });
          return;
        }

        const idTicketElement = document.getElementById("id_ticket");
        if (!idTicketElement) {
          console.error("Elemento id_ticket no encontrado");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener el ID del ticket.",
            confirmButtonText: "Ok",
            confirmButtonColor: "#003594",
            color: "black",
          });
          return;
        }
        const idTicket = idTicketElement.value;

        const nroTicket = idTicketElement.getAttribute("data-nro-ticket");

        const idUserElement = document.getElementById("iduser");
        if (!idUserElement) {
          console.error("Elemento iduser no encontrado");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener el ID del usuario.",
            confirmButtonText: "Ok",
            confirmButtonColor: "#003594",
            color: "black",
          });
          return;
        }
        const idUser = idUserElement.value;

        const file = documentFileInput.files[0];

        if (!file) {
          Swal.fire({
            icon: "warning",
            title: "¡Advertencia!",
            text: "Por favor, selecciona un archivo antes de continuar.",
            confirmButtonText: "Ok",
            confirmButtonColor: "#003594",
            color: "black",
          });
          return;
        }

        // 1. Create a FormData object to handle the file upload.

        const formData = new FormData();

        formData.append("action", "uploadDocument");

        formData.append("ticket_id", idTicket);

        formData.append("nro_ticket", nroTicket); // Añadir el número de ticket

        formData.append("document_type", "convenio_firmado");

        // 2. Append the file object directly. Do NOT use encodeURIComponent().

        formData.append("document_file", file);

        formData.append("id_user", idUser);

        const xhr = new XMLHttpRequest();

        const url = `${ENDPOINT_BASE}${APP_PATH}api/reportes/uploadDocumentTec`;

        xhr.open("POST", url);

        // 3. Remove the Content-Type header. The browser will set the correct one (multipart/form-data) automatically.

        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // <-- REMOVE THIS LINE

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            let result;

            try {
              result = JSON.parse(xhr.responseText);
            } catch (e) {
              result = {
                success: false,
                message: "Error de respuesta del servidor.",
              };
            }

            if (xhr.status === 200 && result.success) {
              Swal.fire({
                icon: "success",

                title: "¡Éxito!",

                text: result.message,

                confirmButtonColor: "#003594",

                confirmButtonText: "Ok",

                color: "black",
              }).then((result) => {
                // *** RESETEAR EL SELECT AL ESTADO INICIAL ***

                const modalNewStatusDomiciliacionSelect =
                  document.getElementById("modalNewStatusDomiciliacionSelect");

                if (modalNewStatusDomiciliacionSelect) {
                  modalNewStatusDomiciliacionSelect.value = "";

                  modalNewStatusDomiciliacionSelect.selectedIndex = 0;
                }

                uploadDocumentModalInstance.hide();

                // Recargar la página para actualizar los datos

                window.location.reload();
              });
            } else {
              Swal.fire({
                icon: "error",

                title: "Error",

                text: result.message || "Error al subir el documento.",

                confirmButtonColor: "#003594",
              });
            }
          }
        };

        xhr.onerror = function () {
          Swal.fire({
            icon: "error",

            title: "Error de red",

            text: "Error de red o del servidor al subir el documento.",

            confirmButtonColor: "#003594",
          });
        };

        // 4. Send the FormData object.

        xhr.send(formData);
      });
    }

    // Event listener para el botón de cerrar el modal
    const cerrarBoton =
      uploadDocumentModalElement.querySelector("#CerrarBoton");
    if (cerrarBoton) {
      cerrarBoton.addEventListener("click", function () {
        // Cerrar el modal usando la instancia global
        if (uploadDocumentModalInstance) {
          uploadDocumentModalInstance.hide();
        }

        // Limpiar el formulario y estados de validación
        const uploadForm = document.getElementById("uploadForm");
        const documentFileInput = document.getElementById("documentFile");
        const fileFormatInfo = document.getElementById("fileFormatInfo");
        const uploadFileBtn = document.getElementById("uploadFileBtn");
        
        if (uploadForm) {
          uploadForm.reset();
        }

        if (documentFileInput) {
          documentFileInput.classList.remove("is-valid", "is-invalid");
          documentFileInput.style.removeProperty("background-image");
          documentFileInput.style.removeProperty("background-position");
          documentFileInput.style.removeProperty("background-repeat");
          documentFileInput.style.removeProperty("background-size");
          documentFileInput.style.removeProperty("padding-right");
        }
        
        if (uploadForm) {
          uploadForm.classList.remove("was-validated");
        }

        // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
        const imagePreview = document.getElementById("imagePreview");
        const imagePreviewContainer = document.getElementById("imagePreviewContainer");
        if (imagePreview) {
          imagePreview.style.display = "none";
          imagePreview.src = "#";
        }
        if (imagePreviewContainer) {
          imagePreviewContainer.style.display = "none";
        }

        // Limpiar mensajes
        const uploadMessage = document.getElementById("uploadMessage");
        if (uploadMessage) {
          uploadMessage.innerHTML = "";
          uploadMessage.classList.add("hidden");
        }
        
        // Mostrar el mensaje informativo
        if (fileFormatInfo) {
          fileFormatInfo.style.display = "block";
          fileFormatInfo.style.visibility = "visible";
        }
        
        // Deshabilitar el botón de subir
        if (uploadFileBtn) {
          uploadFileBtn.disabled = true;
        }
        
        // Restaurar visibilidad de los mensajes de feedback
        if (documentFileInput && documentFileInput.parentElement) {
          const validFeedback = documentFileInput.parentElement.querySelector('.valid-feedback');
          const invalidFeedback = documentFileInput.parentElement.querySelector('.invalid-feedback');
          if (validFeedback) {
            validFeedback.style.display = '';
            validFeedback.style.visibility = '';
          }
          if (invalidFeedback) {
            invalidFeedback.style.display = '';
            invalidFeedback.style.visibility = '';
          }
        }
      });
    }

    // Event listener para el botón de generar convenio firmado

    const generateNotaEntregaBtn = document.getElementById(
      "generateNotaEntregaBtn"
    );

    if (generateNotaEntregaBtn) {
      generateNotaEntregaBtn.addEventListener("click", function () {
        if (!idTicket) {
          Swal.fire({
            icon: "warning",

            title: "Ticket no disponible",

            text: "No se encontró el ID del ticket para generar el acuerdo de pago.",
          });

          return;
        }

        // Obtener datos del ticket para el acuerdo de pago

        const xhr = new XMLHttpRequest();

        xhr.open(
          "POST",
          `${ENDPOINT_BASE}${APP_PATH}api/documents/GetPaymentAgreementData`
        );

        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );

        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);

              if (!res || !res.success || !res.rows) {
                Swal.fire({
                  icon: "warning",

                  title: "No se encontraron datos",

                  text: "No se pudieron obtener los datos del ticket para generar el acuerdo de pago.",
                });

                return;
              }

              const d = res.rows[0];

              window.currentPaymentAgreementData = d;

              // Llenar el modal con los datos del ticket

              fillPaymentAgreementModal(d);

              // Cerrar el modal actual y abrir el modal de acuerdo de pago

              uploadDocumentModalInstance.hide();

              setTimeout(() => {
                // Usar la instancia global o crear una nueva si no existe

                if (!paymentAgreementModalInstance) {
                  paymentAgreementModalInstance = new bootstrap.Modal(
                    document.getElementById("paymentAgreementModal")
                  );
                }

                paymentAgreementModalInstance.show();
              }, 300);
            } catch (error) {
              console.error("Error parsing JSON:", error);

              Swal.fire({
                icon: "error",

                title: "Error al procesar datos",

                text: "Hubo un error al procesar los datos del ticket.",
              });
            }
          } else {
            Swal.fire({
              icon: "error",

              title: "Error del servidor",

              text: `Error ${xhr.status}: ${xhr.statusText}`,
            });
          }
        };

        xhr.onerror = function () {
          Swal.fire({
            icon: "error",

            title: "Error de conexión",

            text: "No se pudo conectar al servidor para obtener los datos del ticket.",
          });
        };

        const data = `action=GetPaymentAgreementData&id_ticket=${idTicket}`;

        xhr.send(data);
      });
    }

    // Event listener para previsualización de imagen

    const documentFile = document.getElementById("documentFile");

    const imagePreview = document.getElementById("imagePreview");

    if (documentFile && imagePreview) {
    // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
    // El listener de cambio de archivo ahora se maneja con handleFileSelectForUpload
    // que incluye validación de Bootstrap
  }

  // Función de validación de archivos (reemplaza la previsualización antigua)
  // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
  // Hacer la función disponible globalmente para que pueda ser usada desde otras funciones
  window.handleFileSelectForUpload = function(event) {
    const input = event.target || this; // Compatible con jQuery y addEventListener
    const file = input.files ? input.files[0] : null;
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
    const validExtensions = [".jpg", ".png", ".gif", ".pdf"];
    const validMimeTypes = ["image/jpg", "image/png", "image/gif", "application/pdf"];
    
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
        input.style.removeProperty("border-color");
        input.style.removeProperty("box-shadow");
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
  };

    // Limpiar el formulario cuando se cierre el modal
    uploadDocumentModalElement.addEventListener("hidden.bs.modal", function () {
      const uploadForm = document.getElementById("uploadForm");
      const documentFileInput = document.getElementById("documentFile");
      const fileFormatInfo = document.getElementById("fileFormatInfo");
      const uploadFileBtn = document.getElementById("uploadFileBtn");

      if (uploadForm) {
        uploadForm.reset();
      }

      if (documentFileInput) {
        documentFileInput.classList.remove("is-valid", "is-invalid");
        documentFileInput.style.removeProperty("background-image");
        documentFileInput.style.removeProperty("background-position");
        documentFileInput.style.removeProperty("background-repeat");
        documentFileInput.style.removeProperty("background-size");
        documentFileInput.style.removeProperty("padding-right");
      }
      
      if (uploadForm) {
        uploadForm.classList.remove("was-validated");
      }

      // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
      const imagePreview = document.getElementById("imagePreview");
      const imagePreviewContainer = document.getElementById("imagePreviewContainer");
      if (imagePreview) {
        imagePreview.style.display = "none";
        imagePreview.src = "#";
      }
      if (imagePreviewContainer) {
        imagePreviewContainer.style.display = "none";
      }
      
      // Mostrar el mensaje informativo
      if (fileFormatInfo) {
        fileFormatInfo.style.display = "block";
        fileFormatInfo.style.visibility = "visible";
      }
      
      // Deshabilitar el botón de subir
      if (uploadFileBtn) {
        uploadFileBtn.disabled = true;
      }
      
      // Restaurar visibilidad de los mensajes de feedback
      if (documentFileInput && documentFileInput.parentElement) {
        const validFeedback = documentFileInput.parentElement.querySelector('.valid-feedback');
        const invalidFeedback = documentFileInput.parentElement.querySelector('.invalid-feedback');
        if (validFeedback) {
          validFeedback.style.display = '';
          validFeedback.style.visibility = '';
        }
        if (invalidFeedback) {
          invalidFeedback.style.display = '';
          invalidFeedback.style.visibility = '';
        }
      }
    });
  }
});

// Función para llenar el modal de acuerdo de pago con los datos del ticket

function fillPaymentAgreementModal(d) {
  // Verificar que d existe

  if (!d) {
    console.error("No data provided to fillPaymentAgreementModal");

    return;
  }

  const safe = (s) => (s || "").toString();

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString("es-ES");

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleDateString("es-ES");
      }
      // Asegurar que solo se muestre la fecha sin hora
      return date.toLocaleDateString("es-ES", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return new Date().toLocaleDateString("es-ES");
    }
  };

  // Llenar campos del modal

  document.getElementById("pa_ticket_id").value = safe(d.id_ticket);

  document.getElementById("pa_fecha").value = formatDate(d.fecha_actual);

  const numeroTicketValue = window.currentConvenioNumero || safe(d.nro_ticket);
  document.getElementById("pa_numero_ticket").value = numeroTicketValue;

  document.getElementById("pa_rif").value = safe(d.coddocumento);

  document.getElementById("pa_razon_social").value = safe(d.razonsocial);

  document.getElementById("pa_ejecutivo_venta").value = safe(d.ejecutivo) || "";

  document.getElementById("pa_marca_equipo").value =
    safe(d.desc_modelo) || safe(d.tipo_pos) || "";

  document.getElementById("pa_fecha_instalacion").value =
    safe(d.fechainstalacion) || "";

  document.getElementById("pa_serial").value = safe(d.serialpos);

  document.getElementById("pa_status_pos").value = safe(d.desc_estatus) || "";

  // Limpiar campos editables

  document.getElementById("pa_saldo_deudor").value = "";

  document.getElementById("pa_propuesta").value = "";

  document.getElementById("pa_observaciones").value = "";

  document.getElementById("pa_acuerdo").value = "";

  // Establecer valores por defecto de configuración bancaria
  const paNumeroCuenta = document.getElementById('pa_numero_cuenta');
  if (paNumeroCuenta) {
    paNumeroCuenta.value = 'XXXX-XXXX-XX-XXXX';
    // Asegurar que el campo sea readonly (no editable por el usuario)
    paNumeroCuenta.setAttribute('readonly', 'readonly');
  }

  const paNombreEmpresa = document.getElementById('pa_nombre_empresa');
  if (paNombreEmpresa) {
    paNombreEmpresa.value = 'Inteligensa';
  }

  const paRifEmpresa = document.getElementById('pa_rif_empresa');
  if (paRifEmpresa) {
    paRifEmpresa.value = 'J-00291615-0';
  }

  const paBanco = document.getElementById('pa_banco');
  if (paBanco) {
    // Si es un select, establecer el valor seleccionado
    if (paBanco.tagName === 'SELECT') {
      paBanco.value = ''; // Dejar sin seleccionar por defecto
    } else {
      paBanco.value = '';
    }
  }

  const paCorreo = document.getElementById('pa_correo');
  if (paCorreo) {
    paCorreo.value = 'inteligensa@inteligensa.com';
  }
}

function buildPaymentAgreementHtml(d, convenioNumero = null) {
  const safe = (s) => (s || "").toString();

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString("es-ES");

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleDateString("es-ES");
      }
      // Asegurar que solo se muestre la fecha sin hora
      return date.toLocaleDateString("es-ES", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return new Date().toLocaleDateString("es-ES");
    }
  };

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    if (!amount || amount === "") return "____.__$";

    const numericAmount = parseFloat(amount.replace(/[^0-9.-]/g, ""));

    if (isNaN(numericAmount)) return "____.__$";

    return `${numericAmount.toFixed(2)}$`;
  };

  // Generar nombre del archivo con formato: ConvenioFirmado_CF-id_ticket-last4digits_serial.pdf
  const generateConvenioFileName = (ticketId, serial) => {
    let fileName = `ConvenioFirmado_CF-${ticketId}`;
    
    if (serial && serial.length >= 4) {
      const lastFourDigits = serial.slice(-4);
      fileName += `-${lastFourDigits}`;
    }
    
    return `${fileName}.pdf`;
  };

  const fileName = generateConvenioFileName(d.id_ticket, d.serialpos || d.serial_pos || '');

  return `

    <!DOCTYPE html>

    <html lang="es">

    <head>

        <meta charset="utf-8">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>${fileName}</title>

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

            margin: 0;

            overflow-x: hidden;

            display: block;

            min-height: auto;

        }

        
        
        .container {

            max-width: 600px;

            width: 100%;

            margin: 20px auto;

            background: white;

            min-height: auto;

            display: flex;

            flex-direction: column;

            box-shadow: 0 0 20px rgba(0,0,0,0.1);

            border-radius: 8px;

            padding: 20px;

        }

        
        
        .header {

            text-align: center;

            margin-bottom: 8px;

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

            justify-content: space-around;

            margin: 10px 0 8px 0;

            padding: 15px;

            background: #f8f9fa;

            border-radius: 8px;

            border-left: 4px solid #2c5aa0;

            gap: 15px;

        }

        
        
        .info-item {

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            flex: 1;

            min-width: 0;

            text-align: center;

        }

        
        
        .info-label {

            font-size: 9px;

            color: #666;

            font-weight: 600;

            text-transform: uppercase;

            margin-bottom: 8px;

            line-height: 1.3;

        }

        
        
        .info-value {

            font-size: 13px;

            font-weight: bold;

            color: #2c5aa0;

            word-break: break-word;

        }

        
        
        .content-wrapper {

            flex: 1;

            display: flex;

            flex-direction: column;

        }

        
        
        .section {

            margin: 4px 0;

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
        
        @page {
            size: A4;
            margin: 0.5cm;
        }

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

            
            

            
            
            html, body {

                width: 100% !important;

                height: auto !important;

                margin: 0 !important;

                padding: 0 !important;

                overflow: visible !important;

            }

            
            
            body {

                font-size: 10px !important;

                padding: 0 !important;

                margin: 0 !important;

                display: block !important;

                min-height: auto !important;

                page-break-before: avoid !important;

            }

            
            
            .container {

                max-width: 600px !important;

                width: 100% !important;

                min-height: auto !important;

                height: auto !important;

                page-break-inside: avoid;

                margin: 0 auto !important;

                box-shadow: none !important;

                border-radius: 0 !important;

                padding: 20px !important;

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

                margin: 10px 0 8px 0 !important;

                padding: 15px !important;

                page-break-after: avoid;

                gap: 15px !important;

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

                    <div class="info-value"> ${formatDate(d.fecha_actual)}</div>

                </div>

                <div class="info-item">

                    <div class="info-label">N° de Ticket</div>

                    <div class="info-value">${safe(d.nro_ticket)}</div>

                </div>

                <div class="info-item">

                    <div class="info-label">N° de Acuerdo</div>

                    <div class="info-value">${
                      convenioNumero || "No generado"
                    }</div>

                </div>

            </div>



            <div class="content-wrapper">

                <div class="section">

                    <div class="section-header">Datos del Cliente</div>

                    <div class="section-content">

                        <div class="field-row">

                            <div class="field-label">R.I.F. / Identificación:</div>

                            <div class="field-value">${
                              safe(d.coddocumento) || "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Razón Social:</div>

                            <div class="field-value">${
                              safe(d.razonsocial) || "_____________________"
                            }</div>

                        </div>

                    </div>

                </div>



                <div class="section">

                    <div class="section-header">Antecedentes del Equipo</div>

                    <div class="section-content">

                        <div class="field-row">

                            <div class="field-label">Ejecutivo de Venta:</div>

                            <div class="field-value">${
                              safe(d.ejecutivo) || "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Equipo MARCA:</div>

                            <div class="field-value">${
                              safe(d.desc_modelo) || "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Fecha de Instalación:</div>

                            <div class="field-value">${
                              safe(d.fecha_instalacion) ||
                              "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Serial N°:</div>

                            <div class="field-value">${
                              safe(d.serialpos) || "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Status del POS:</div>

                            <div class="field-value">${
                              safe(d.desc_estatus) || "_____________________"
                            }</div>

                        </div>

                    </div>

                </div>



                <div class="section">

                    <div class="section-header">Información del Acuerdo</div>

                    <div class="section-content">

                        <div class="two-columns">

                            <div class="column">

                                <div class="column-title">Saldo deudor</div>

                                <div class="field-value">${formatCurrency(
                                  d.saldo_deudor
                                )}</div>

                            </div>

                            <div class="column">

                                <div class="column-title">Propuesta</div>

                                <div class="field-value large">${
                                  safe(d.propuesta) || "_____________________"
                                }</div>

                            </div>

                        </div>

                        <div class="two-columns">

                            <div class="column">

                                <div class="column-title">Observaciones</div>

                                <div class="field-value large">${
                                  safe(d.observaciones) ||
                                  "_____________________"
                                }</div>

                            </div>

                            <div class="column">

                                <div class="column-title">Acuerdo</div>

                                <div class="field-value large">${
                                  safe(d.acuerdo) || "_____________________"
                                }</div>

                            </div>

                        </div>

                    </div>

                </div>



                <div class="constancy">

                    <h3 style="color: #2c5aa0; margin-bottom: 10px; font-size: 12px;">INSTRUCCIONES DE PAGO</h3>

                    <p style="margin-bottom: 8px; font-size: 10px; line-height: 1.4; text-align: justify;">

                        Los pagos aquí acordados, deberán realizarse a través de depósitos a la cuenta N° <strong>${
                          safe(d.numero_cuenta) || "XXXX-XXXX-XX-XXXX"
                        }</strong> a nombre de <strong>${
                          safe(d.nombre_empresa) || "Inteligensa"
                        }</strong> con el RIF <strong>${safe(d.rif_empresa) || "J-00291615-0"}</strong> en el Banco <strong>${
                          safe(d.banco) || "XXXX"
                        }</strong>${safe(d.cod_bank) ? " (Código banco: " + safe(d.cod_bank) + ")" : ""} y notificar a través de este correo los siguientes datos: nombre y número de RIF de su comercio, número de referencia, nombre del titular de la cuenta y monto del pago <strong>${
                          safe(d.correo) || "inteligensa@inteligensa.com"
                        }</strong>. Recordar que cada vez que se realice un pago debe ser a la Tasa del BCV del día.
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
                        <div class="signature-field">Nombre: ${
                          safe(d.ejecutivo) || "_____________________"
                        }</div>
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
                      <p>Generado: ${new Date().toLocaleString("es-ES")}</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
  </html>`;
}

document.addEventListener("DOMContentLoaded", function () {
  // Función para forzar saltos de línea cada cierto número de caracteres

  function addLineBreaks(text, maxCharsPerLine = 25) {
    if (!text) return text;

    // Remover saltos de línea existentes para procesar todo el texto

    const cleanText = text.replace(/\n/g, " ");

    let result = "";

    let currentLine = "";

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];

      if (currentLine.length >= maxCharsPerLine) {
        result += currentLine + "\n";

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

  // Cargar bancos desde API y poblar el select
  function loadBanksForPaymentAgreement() {
    const select = document.getElementById('pa_banco');
    if (!select) return;

    // Estado inicial
    select.innerHTML = '<option value="">Cargando bancos...</option>';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetAccountsBanks`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res && res.success) {
          const banks = Array.isArray(res.banks) ? res.banks : [];
          select.innerHTML = '<option value="">Seleccione un banco</option>';
          banks.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b.name_bank || '';
            opt.textContent = b.name_bank || '';
            // Guardamos nro de cuenta y código en data-*
            if (b.nro_account) opt.dataset.account = b.nro_account;
            if (b.cod_bank !== undefined && b.cod_bank !== null) opt.dataset.codBank = b.cod_bank;
            select.appendChild(opt);
          });
        } else {
          select.innerHTML = '<option value="">No hay bancos</option>';
        }
      } catch (e) {
        console.error('Error parseando bancos:', e);
        select.innerHTML = '<option value="">No hay bancos</option>';
      }
    };

    xhr.onerror = function() {
      select.innerHTML = '<option value="">Error cargando bancos</option>';
    };

    xhr.send('action=GetAccountsBanks');

    // Al cambiar banco, actualizar nro de cuenta y cod bank
    select.addEventListener('change', function() {
      const selected = select.options[select.selectedIndex];
      const account = selected?.dataset?.account || 'XXXX-XXXX-XX-XXXX';
      const codBank = selected?.dataset?.codBank || '';

      const numeroCuentaInput = document.getElementById('pa_numero_cuenta');
      if (numeroCuentaInput) {
        numeroCuentaInput.value = account;
      }
      const codBankHidden = document.getElementById('pa_cod_bank');
      if (codBankHidden) {
        codBankHidden.value = codBank;
      }
    });
  }

  // Aplicar saltos de línea automáticos a los campos de texto

  function setupAutoLineBreaks() {
    const textFields = ["pa_propuesta", "pa_observaciones", "pa_acuerdo"];

    textFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);

      if (field) {
        // Aplicar estilos adicionales

        field.style.wordBreak = "break-all";

        field.style.overflowWrap = "break-word";

        field.style.whiteSpace = "pre-wrap";

        field.addEventListener("input", function (e) {
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

        field.addEventListener("blur", function (e) {
          const originalValue = e.target.value;

          const withLineBreaks = addLineBreaks(originalValue, 25);

          if (originalValue !== withLineBreaks) {
            e.target.value = withLineBreaks;
          }
        });

        field.addEventListener("paste", function (e) {
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

  const saldoDeudorField = document.getElementById("pa_saldo_deudor");
  const saldoDeudorError = document.getElementById("saldo_deudor_error");

  if (saldoDeudorField) {
    // Formatear al perder el foco
    saldoDeudorField.addEventListener("blur", function (e) {
      let value = e.target.value.trim();

      if (value && !isNaN(parseFloat(value))) {
        const numValue = parseFloat(value);

        // Validar mínimo de $10.00
        if (numValue < 10.00) {
          e.target.classList.add("is-invalid");
          if (saldoDeudorError) {
            saldoDeudorError.style.display = "block";
          }
        } else {
          e.target.classList.remove("is-invalid");
          if (saldoDeudorError) {
            saldoDeudorError.style.display = "none";
          }
        e.target.value = numValue.toFixed(2);
        }
      } else if (value) {
        // Si hay valor pero no es un número válido
        e.target.classList.add("is-invalid");
        if (saldoDeudorError) {
          saldoDeudorError.textContent = "Ingrese un valor numérico válido";
          saldoDeudorError.style.display = "block";
        }
      } else {
        // Si está vacío, remover errores
        e.target.classList.remove("is-invalid");
        if (saldoDeudorError) {
          saldoDeudorError.style.display = "none";
        }
      }
    });

    // Formatear al escribir
    saldoDeudorField.addEventListener("input", function (e) {
      let value = e.target.value.replace(/[^0-9.]/g, ""); // Solo números y punto

      // Permitir solo un punto decimal
      const parts = value.split(".");

      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }

      // Limitar a 2 decimales
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + "." + parts[1].substring(0, 2);
      }

      e.target.value = value;

      // Validar en tiempo real si el valor es válido
      if (value) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (numValue < 10.00 && numValue > 0) {
            e.target.classList.add("is-invalid");
            if (saldoDeudorError) {
              saldoDeudorError.textContent = "El saldo mínimo es $10.00";
              saldoDeudorError.style.display = "block";
            }
          } else if (numValue >= 10.00) {
            e.target.classList.remove("is-invalid");
            if (saldoDeudorError) {
              saldoDeudorError.style.display = "none";
            }
          }
        }
      } else {
        e.target.classList.remove("is-invalid");
        if (saldoDeudorError) {
          saldoDeudorError.style.display = "none";
        }
      }
    });

    // Validar antes de enviar el formulario
    saldoDeudorField.addEventListener("change", function (e) {
      let value = e.target.value.trim();

      if (value && !isNaN(parseFloat(value))) {
        const numValue = parseFloat(value);
        
        if (numValue < 10.00) {
          e.target.classList.add("is-invalid");
          if (saldoDeudorError) {
            saldoDeudorError.textContent = "El saldo mínimo es $10.00";
            saldoDeudorError.style.display = "block";
          }
          e.target.focus();
        } else {
          e.target.classList.remove("is-invalid");
          if (saldoDeudorError) {
            saldoDeudorError.style.display = "none";
          }
        }
      }
    });
  }

  // Configurar saltos de línea automáticos

  setupAutoLineBreaks();

  // Cargar bancos al iniciar
  loadBanksForPaymentAgreement();

  // Protección del campo de número de cuenta (solo se puede cambiar en el código)
  const paNumeroCuenta = document.getElementById('pa_numero_cuenta');
  if (paNumeroCuenta) {
    const originalValue = 'XXXX-XXXX-XX-XXXX';
    
    // Establecer el valor original
    paNumeroCuenta.value = originalValue;
    paNumeroCuenta.setAttribute('readonly', 'readonly');
    paNumeroCuenta.style.backgroundColor = '#f8f9fa';
    paNumeroCuenta.style.cursor = 'not-allowed';
    
    // Protección adicional: prevenir cualquier modificación del campo
    paNumeroCuenta.addEventListener('input', function(e) {
      if (e.target.value !== originalValue) {
        e.target.value = originalValue;
      }
    });
    
    paNumeroCuenta.addEventListener('keydown', function(e) {
      // Permitir solo teclas de navegación (Tab, Enter, etc.) y atajos de teclado
      const allowedKeys = ['Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      const isModifierKey = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
      if (!allowedKeys.includes(e.key) && !isModifierKey) {
        e.preventDefault();
      }
    });
    
    paNumeroCuenta.addEventListener('paste', function(e) {
      e.preventDefault();
    });
    
    paNumeroCuenta.addEventListener('cut', function(e) {
      e.preventDefault();
    });
    
    // Observar cambios en el atributo readonly y restaurarlo
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'readonly') {
          if (!paNumeroCuenta.hasAttribute('readonly')) {
            paNumeroCuenta.setAttribute('readonly', 'readonly');
          }
        }
      });
    });
    
    observer.observe(paNumeroCuenta, {
      attributes: true,
      attributeFilter: ['readonly']
    });
    
  }

  // Aplicar estilos cuando se abra el modal

  const modal = document.getElementById("paymentAgreementModal");

  if (modal) {
    modal.addEventListener("shown.bs.modal", function () {
      // Re-aplicar configuración cuando se abra el modal

      setTimeout(() => {
        setupAutoLineBreaks();

        // Asegurar que el scroll funcione correctamente

        const modalBody = modal.querySelector(".modal-body");

        if (modalBody) {
          modalBody.style.overflowY = "auto";

          modalBody.style.overflowX = "hidden";

          modalBody.style.maxHeight = "calc(95vh - 120px)";

          // Forzar el scroll si es necesario

          modalBody.scrollTop = 0;
        }

        // Establecer valores por defecto de configuración bancaria
        const paNumeroCuentaModal = document.getElementById('pa_numero_cuenta');
        if (paNumeroCuentaModal) {
          // Asegurar que el número de cuenta siempre tenga el valor correcto y esté protegido
          paNumeroCuentaModal.value = 'XXXX-XXXX-XX-XXXX';
          paNumeroCuentaModal.setAttribute('readonly', 'readonly');
          paNumeroCuentaModal.style.backgroundColor = '#f8f9fa';
          paNumeroCuentaModal.style.cursor = 'not-allowed';
          paNumeroCuentaModal.removeAttribute('contenteditable');
        }

        const paNombreEmpresa = document.getElementById('pa_nombre_empresa');
        if (paNombreEmpresa) {
          // Establecer valor por defecto si está vacío
          if (!paNombreEmpresa.value || paNombreEmpresa.value.trim() === '') {
            paNombreEmpresa.value = 'Inteligensa';
          }
        }

        const paRifEmpresa = document.getElementById('pa_rif_empresa');
        if (paRifEmpresa) {
          // Establecer valor por defecto si está vacío
          if (!paRifEmpresa.value || paRifEmpresa.value.trim() === '') {
            paRifEmpresa.value = 'J-00291615-0';
          }
        }

        const paBanco = document.getElementById('pa_banco');
        if (paBanco) {
          // Si es un select, no establecer valor por defecto (dejar que el usuario seleccione)
          // El select ya tiene una opción por defecto "Seleccione un banco"
        }

        const paCorreo = document.getElementById('pa_correo');
        if (paCorreo) {
          // Establecer valor por defecto si está vacío
          if (!paCorreo.value || paCorreo.value.trim() === '') {
            paCorreo.value = 'inteligensa@inteligensa.com';
          }
        }
      }, 100);
    });

    // Prevenir que el modal se cierre al hacer scroll

    modal.addEventListener("wheel", function (e) {
      const modalBody = modal.querySelector(".modal-body");

      if (modalBody && modalBody.scrollHeight > modalBody.clientHeight) {
        e.stopPropagation();
      }
    });

    // Restaurar el número de cuenta cuando se cierre el modal
    modal.addEventListener("hidden.bs.modal", function () {
      const paNumeroCuenta = document.getElementById('pa_numero_cuenta');
      if (paNumeroCuenta) {
        paNumeroCuenta.value = 'XXXX-XXXX-XX-XXXX';
        paNumeroCuenta.setAttribute('readonly', 'readonly');
        paNumeroCuenta.style.backgroundColor = '#f8f9fa';
        paNumeroCuenta.style.cursor = 'not-allowed';
      }
    });
  }

  // Botón de previsualizar

  const previewBtn = document.getElementById("previewPaymentAgreementBtn");

  if (previewBtn) {
    previewBtn.addEventListener("click", function () {
      // Validar monto mínimo
      const saldoDeudorField = document.getElementById("pa_saldo_deudor");
      const saldoDeudor = saldoDeudorField ? saldoDeudorField.value.trim() : "";
      const saldoDeudorError = document.getElementById("saldo_deudor_error");

      if (!saldoDeudor) {
        Swal.fire({
          icon: "warning",
          title: "Campo requerido",
          text: "Debe ingresar el saldo deudor",
          confirmButtonColor: "#003594",
        });
        if (saldoDeudorField) {
          saldoDeudorField.focus();
          saldoDeudorField.classList.add("is-invalid");
        }
        if (saldoDeudorError) {
          saldoDeudorError.textContent = "Este campo es requerido";
          saldoDeudorError.style.display = "block";
        }
        return;
      }

      const saldoNum = parseFloat(saldoDeudor.replace(/[^0-9.]/g, ""));

      if (isNaN(saldoNum) || saldoNum < 10.00) {
        Swal.fire({
          icon: "warning",
          title: "Monto inválido",
          text: "El saldo deudor debe ser mínimo $10.00",
          confirmButtonColor: "#003594",
        });
        if (saldoDeudorField) {
          saldoDeudorField.focus();
          saldoDeudorField.classList.add("is-invalid");
        }
        if (saldoDeudorError) {
          saldoDeudorError.textContent = "El saldo mínimo es $10.00";
          saldoDeudorError.style.display = "block";
        }
        return;
      }

      const data = getPaymentAgreementFormData();

      // Usar la variable global del número de convenio
      const convenioNumero = window.currentConvenioNumero || data.nro_ticket;
      const html = buildPaymentAgreementHtml(data, convenioNumero);

      const preview = document.getElementById("paymentAgreementPreview");

      preview.src = "data:text/html;charset=utf-8," + encodeURIComponent(html);
    });
  }

  // Botón de imprimir

  const printBtn = document.getElementById("printPaymentAgreementBtn");

  if (printBtn) {
    // 1. Añadir el Listener de Clic al botón principal

    printBtn.addEventListener("click", async function () {
      // Validar monto mínimo
      const saldoDeudorField = document.getElementById("pa_saldo_deudor");
      const saldoDeudor = saldoDeudorField ? saldoDeudorField.value.trim() : "";
      const saldoDeudorError = document.getElementById("saldo_deudor_error");

      if (!saldoDeudor) {
        Swal.fire({
          icon: "warning",
          title: "Campo requerido",
          text: "Debe ingresar el saldo deudor",
          confirmButtonColor: "#003594",
        });
        if (saldoDeudorField) {
          saldoDeudorField.focus();
          saldoDeudorField.classList.add("is-invalid");
        }
        if (saldoDeudorError) {
          saldoDeudorError.textContent = "Este campo es requerido";
          saldoDeudorError.style.display = "block";
        }
        return;
      }

      const saldoNum = parseFloat(saldoDeudor.replace(/[^0-9.]/g, ""));

      if (isNaN(saldoNum) || saldoNum < 10.00) {
        Swal.fire({
          icon: "warning",
          title: "Monto inválido",
          text: "El saldo deudor debe ser mínimo $10.00",
          confirmButtonColor: "#003594",
        });
        if (saldoDeudorField) {
          saldoDeudorField.focus();
          saldoDeudorField.classList.add("is-invalid");
        }
        if (saldoDeudorError) {
          saldoDeudorError.textContent = "El saldo mínimo es $10.00";
          saldoDeudorError.style.display = "block";
        }
        return;
      }

      const data = getPaymentAgreementFormData();

      // Usar la variable global del número de convenio
      const convenioNumero = window.currentConvenioNumero || data.nro_ticket;
      const html = buildPaymentAgreementHtml(data, convenioNumero);

      // 2. Crear iframe para renderizar el HTML con estilos
      const iframe = document.createElement('iframe');
      iframe.id = 'paymentAgreementPreview';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '800px';
      iframe.style.height = '1200px';
      iframe.style.border = 'none';
      iframe.style.zIndex = '999999';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      iframe.style.transform = 'translateX(-10000px)';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const baseHref = `${window.location.origin}/SoportePost/`;
      
      // Inyectar base href para resolver rutas relativas
      let htmlWithBase = html.replace('<head>', `<head><base href="${baseHref}">`);
      
      // Eliminar espacios en blanco y saltos de línea antes del contenido del body
      htmlWithBase = htmlWithBase.replace(/<body[^>]*>\s*/i, '<body>');
      
      // Escribir el HTML completo con estilos
      doc.open();
      doc.write(htmlWithBase);
      doc.close();

      // Esperar a que el contenido se cargue completamente
      await new Promise((resolve) => {
        if (doc.readyState === 'complete') {
          resolve();
        } else {
          const onReady = () => {
            doc.removeEventListener('DOMContentLoaded', onReady);
            resolve();
          };
          doc.addEventListener('DOMContentLoaded', onReady);
          setTimeout(() => {
            doc.removeEventListener('DOMContentLoaded', onReady);
            resolve();
          }, 2000);
        }
      });

      // Inyectar estilos adicionales para eliminar página en blanco
      const style = doc.createElement('style');
      style.textContent = `
        @page {
          size: A4;
          margin: 0.5cm;
        }
        @media print {
          html {
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: auto !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            position: relative !important;
            top: 0 !important;
          }
          body::before,
          body::after {
            content: none !important;
            display: none !important;
          }
          .container {
            margin: 0 auto !important;
            margin-top: 0 !important;
            padding-top: 10px !important;
            page-break-before: avoid !important;
            position: relative !important;
            top: 0 !important;
          }
        }
      `;
      doc.head.appendChild(style);

      // Agregar script para ajustar antes de imprimir
      const script = doc.createElement('script');
      script.textContent = `
        window.addEventListener('beforeprint', function() {
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          document.body.style.marginTop = '0';
          document.body.style.paddingTop = '0';
          const container = document.querySelector('.container');
          if (container) {
            container.style.marginTop = '0';
            container.style.paddingTop = '10px';
          }
        });
      `;
      doc.head.appendChild(script);

      // Eliminar espacios en blanco antes del primer elemento del body
      if (doc.body.firstChild && doc.body.firstChild.nodeType === 3) {
        const firstText = doc.body.firstChild;
        if (firstText.textContent && firstText.textContent.trim() === '') {
          doc.body.removeChild(firstText);
        }
      }
      
      // Eliminar todos los nodos de texto vacíos al inicio del body
      let firstChild = doc.body.firstChild;
      while (firstChild && firstChild.nodeType === 3 && firstChild.textContent.trim() === '') {
        doc.body.removeChild(firstChild);
        firstChild = doc.body.firstChild;
      }

      // Asegurar que el contenedor esté al inicio del body
      const container = doc.querySelector('.container');
      if (container && container.parentNode === doc.body) {
        // Mover el contenedor al inicio del body si no está ya ahí
        const firstChild = doc.body.firstChild;
        if (firstChild && firstChild !== container) {
          doc.body.insertBefore(container, firstChild);
        }
      }

      // Asegurar que el scroll esté en la parte superior
      iframe.contentWindow.scrollTo(0, 0);
      doc.documentElement.scrollTop = 0;
      doc.body.scrollTop = 0;

      // Forzar un reflow para aplicar los estilos
      doc.body.offsetHeight;

      // Guardar títulos originales
      const originalIframeTitle = doc.title || '';
      const originalWindowTitle = window.document.title || '';

      // Crear el nombre del archivo
      const fecha = new Date();
      const y = fecha.getFullYear();
      const m = String(fecha.getMonth() + 1).padStart(2, '0');
      const d = String(fecha.getDate()).padStart(2, '0');
      const fechaStr = `${y}${m}${d}`;
      const filename = `ConvenioFirmado_${convenioNumero}_${fechaStr}`;

      // 3. Mostrar el modal de éxito y preguntar qué hacer
      Swal.fire({
        icon: 'success',
        title: 'Acuerdo de Pago',
        text: 'El archivo se generó correctamente. Puedes guardarlo como PDF.',
        showCancelButton: true,
        confirmButtonText: 'Imprimir',
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#003594',
        cancelButtonColor: '#808080',
        color: 'black'
      }).then((result) => {
        // Si el usuario presiona "Imprimir"
        if (result.isConfirmed) {
          // Asignar el nombre del archivo al título de la ventana principal
          window.document.title = filename;

          // Asegurar que el scroll esté en la parte superior antes de imprimir
          iframe.contentWindow.scrollTo(0, 0);
          doc.documentElement.scrollTop = 0;
          doc.body.scrollTop = 0;

          // Pequeño delay para asegurar que el scroll se haya aplicado
                setTimeout(() => {
            // Llamar a la función de impresión
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          }, 100);

          // Restaurar títulos después de que el diálogo de impresión se lance
              setTimeout(() => {
            doc.title = originalIframeTitle;
            window.document.title = originalWindowTitle;

            // Limpiar el iframe
            if (iframe && iframe.parentNode) {
              document.body.removeChild(iframe);
                }
          }, 500);
          } else {
          // Si el usuario presiona "Cerrar"
          // Limpiar el iframe
          if (iframe && iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }
      });
    });
  }

  // Botón de cerrar

  const closeBtn = document.getElementById("closePaymentAgreementBtn");

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      // Usar la instancia global o crear una nueva si no existe

      if (!paymentAgreementModalInstance) {
        paymentAgreementModalInstance = new bootstrap.Modal(
          document.getElementById("paymentAgreementModal")
        );
      }

      paymentAgreementModalInstance.hide();
    });
  }
});

function getPaymentAgreementFormData() {
  return {
    id_ticket: document.getElementById("pa_ticket_id").value,

    fecha_actual: document.getElementById("pa_fecha").value,

    nro_ticket: document.getElementById("pa_numero_ticket").value,

    coddocumento: document.getElementById("pa_rif").value,

    razonsocial: document.getElementById("pa_razon_social").value,

    ejecutivo: document.getElementById("pa_ejecutivo_venta").value,

    desc_modelo: document.getElementById("pa_marca_equipo").value,

    fecha_instalacion: document.getElementById("pa_fecha_instalacion").value,

    serialpos: document.getElementById("pa_serial").value,

    desc_estatus: document.getElementById("pa_status_pos").value,

    saldo_deudor: document.getElementById("pa_saldo_deudor").value,

    propuesta: document.getElementById("pa_propuesta").value,

    observaciones: document.getElementById("pa_observaciones").value,

    acuerdo: document.getElementById("pa_acuerdo").value,

    // Nuevos campos de configuración bancaria

    numero_cuenta: document.getElementById("pa_numero_cuenta").value,

    nombre_empresa: document.getElementById("pa_nombre_empresa").value,

    rif_empresa: document.getElementById("pa_rif_empresa").value,

    banco: document.getElementById("pa_banco").value,

    correo: document.getElementById("pa_correo").value,

    // Nuevo: código banco
    cod_bank: document.getElementById("pa_cod_bank") ? document.getElementById("pa_cod_bank").value : "",
  };
}

const closeButton = changeStatusDomiciliacionModalElement.querySelector("#close-button");

if (closeIconBtn) {
  closeIconBtn.addEventListener("click", function () {
    // *** OCULTAR CAMPO DE OBSERVACIONES ***

    const observationsContainer = document.getElementById(
      "observationsContainer"
    );

    if (observationsContainer) {
      observationsContainer.style.display = "none";

      const observationsText = document.getElementById("observationsText");

      if (observationsText) {
        observationsText.value = "";
      }
    }

    changeStatusDomiciliacionModal.hide();
  });
}

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
        return `http://${HOST}/Documentos/${cleanPath}`;
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

function getMotivos() {
  const xhr = new XMLHttpRequest();
  const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");
  motivoRechazoSelect.innerHTML = '<option value="">Cargando...</option>';

  // Aquí cambiamos el endpoint para apuntar a la API de motivos
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/getMotivosDomiciliacion`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {

          const select = document.getElementById("motivoRechazoSelect");
          select.innerHTML = '<option value="">Seleccione</option>';

          if (Array.isArray(response.motivos) && response.motivos.length > 0) {
            response.motivos.forEach((motivo) => {
              const option = document.createElement("option");
              option.value = motivo.id_motivo_rechazo;
              option.textContent = motivo.name_motivo_rechazo;
              select.appendChild(option);
            });
          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay Motivos Disponibles";
            select.appendChild(option);
          }
        } else {
          console.error("Error al obtener los motivos:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  // ¡Aquí se envía el documentType!
  const datos = `action=GetMotivos`;
  xhr.send(datos);
}
 
function showGenerateConvenioModal(ticketId = null, nroTicket = null) {
  // ✅ FUNCIÓN MEJORADA: ACEPTA PARÁMETROS O USA FILTRO COMO FALLBACK
  if (ticketId && nroTicket) {
    // Si se pasan parámetros, usarlos directamente
    showConvenioSwalModal(ticketId, nroTicket);
  } else {
    // Fallback: Obtener el primer ticket del filtro actual (status 4)
    const dataTableInstance = $("#tabla-ticket").DataTable();
    const filteredData = dataTableInstance.rows({ filter: "applied" }).data();

    if (filteredData.length > 0) {
      const firstTicket = filteredData[0];
      const ticketId = firstTicket.id_ticket;
      const nroTicket = firstTicket.nro_ticket;

      // ✅ USAR SWEETALERT2 PARA MODAL IMPOSIBLE DE CERRAR CON ESC
      showConvenioSwalModal(ticketId, nroTicket);

    } else {
      Swal.fire({
        title: "Sin datos",
        text: "No hay tickets de convenio firmado para procesar.",
        icon: "warning",
        confirmButtonColor: "#003594",
      });
    }
  }
}

function showConvenioSwalModal(ticketId, nroTicket) {
  // ✅ SWEETALERT2 CON CONFIGURACIÓN IMPOSIBLE DE CERRAR
  Swal.fire({
    title: `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
        <div style="background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%); padding: 12px; border-radius: 50%; box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);">
          <i class="fas fa-file-contract" style="font-size: 1.6rem; color: white;"></i>
        </div>
        <div>
          <h3 style="margin: 0; color: #2c3e50; font-weight: 600; font-size: 1.1rem;">Generar Documento de Convenio Firmado</h3>
          <p style="margin: 4px 0 0 0; color: #6c757d; font-size: 13px;">Ticket: <span style="background: #e9ecef; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${nroTicket}</span></p>
        </div>
      </div>
    `,
    html: `
      <div style="text-align: center; padding: 15px 0;">
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 18px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #ffc107;">
          <div style="background: #17a2b8; width: 35px; height: 35px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 8px; box-shadow: 0 2px 6px rgba(23, 162, 184, 0.3);">
            <i class="fas fa-info-circle" style="font-size: 1.2rem; color: white;"></i>
          </div>
          <h4 style="color: #2c3e50; margin-bottom: 10px; font-weight: 600; font-size: 1rem;">Instrucciones</h4>
          <p style="color: #495057; margin: 0; line-height: 1.5; font-size: 13px;">
            Por favor genere el documento de <strong style="color: #ffc107;">Convenio Firmado</strong> para el ticket <strong style="color: #2c3e50;">${nroTicket}</strong>. 
            Una vez generado, podrá subirlo al sistema para completar el proceso.
          </p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 1px solid #ffc107; border-radius: 10px; padding: 12px; margin-bottom: 15px;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fas fa-exclamation-triangle" style="color: #856404; font-size: 1rem;"></i>
            <span style="color: #856404; font-weight: 600; font-size: 13px;">Este proceso es obligatorio para continuar</span>
          </div>
        </div>
      </div>
    `,
    showCancelButton: false,
    confirmButtonText: `
      <i class="fas fa-file-contract me-2"></i>Generar Convenio Firmado
    `,
    cancelButtonText: `
      <i class="fas fa-times me-2"></i>Cancelar
    `,
    confirmButtonColor: "#ffc107",
    cancelButtonColor: "#6c757d",
    buttonsStyling: true,
    customClass: {
      popup: "swal-convenio-modal",
      confirmButton: "swal-convenio-confirm",
      cancelButton: "swal-convenio-cancel",
    },
    width: 450,
    padding: "20px",
    background: "#ffffff",
    backdrop: "rgba(0,0,0,0.4)",
    allowOutsideClick: false,  // ✅ NO CERRAR CON CLIC FUERA
    allowEscapeKey: false,     // ✅ NO CERRAR CON ESC
    keydownListenerCapture: true, // ✅ CAPTURAR EVENTOS DE TECLADO
    showCloseButton: false,    // ✅ NO MOSTRAR BOTÓN X
    focusConfirm: true,        // ✅ ENFOCAR BOTÓN CONFIRMAR
    reverseButtons: false,     // ✅ ORDEN NORMAL DE BOTONES
    didOpen: () => {
      // ✅ APLICAR ESTILOS PERSONALIZADOS
      const popup = document.querySelector('.swal-convenio-modal');
      const confirmBtn = document.querySelector('.swal-convenio-confirm');
      const cancelBtn = document.querySelector('.swal-convenio-cancel');
      
      if (popup) {
        popup.style.borderRadius = '16px';
        popup.style.boxShadow = '0 8px 25px rgba(0,0,0,0.25)';
        popup.style.border = '2px solid #ffc107';
      }
      
      if (confirmBtn) {
        confirmBtn.style.fontSize = '14px';
        confirmBtn.style.padding = '10px 20px';
        confirmBtn.style.borderRadius = '8px';
        confirmBtn.style.fontWeight = '600';
        confirmBtn.style.boxShadow = '0 3px 10px rgba(255, 193, 7, 0.3)';
        confirmBtn.style.transition = 'all 0.2s ease';
      }
      
      if (cancelBtn) {
        cancelBtn.style.fontSize = '14px';
        cancelBtn.style.padding = '10px 20px';
        cancelBtn.style.borderRadius = '8px';
        cancelBtn.style.fontWeight = '500';
      }
      
      // ✅ PREVENIR CUALQUIER INTENTO DE CERRAR CON TECLADO
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.key === 'Enter' && event.ctrlKey) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          return false;
        }
      }, true);
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // ✅ SEGUIR EL CURSO ORIGINAL: ABRIR MODAL DE ACUERDO DE PAGO
      openPaymentAgreementModal(ticketId, nroTicket);
    }
  });
}

function openPaymentAgreementModal(ticketId, nroTicket) {
  // ✅ SEGUIR EL CURSO ORIGINAL: OBTENER DATOS Y ABRIR MODAL DE ACUERDO DE PAGO
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/documents/GetPaymentAgreementData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const res = JSON.parse(xhr.responseText);

        if (!res || !res.success || !res.rows) {
          Swal.fire({
            icon: "warning",
            title: "No se encontraron datos",
            text: "No se pudieron obtener los datos del ticket para generar el convenio.",
            confirmButtonColor: "#003594",
          });
          return;
        }

        const d = res.rows[0];

        // Generar número del convenio firmado
        const serialPos = d.serialpos || d.serial_pos || "";
        const lastFourSerialDigits = serialPos.slice(-4);
        const convenioNumero = `CF-${ticketId}-${lastFourSerialDigits}`;

        // Almacenar el número del convenio en una variable global
        window.currentConvenioNumero = convenioNumero;

        // ✅ LLENAR EL MODAL DE ACUERDO DE PAGO CON LOS DATOS
        fillPaymentAgreementModal(d);

        // ✅ MOSTRAR EL MODAL DE ACUERDO DE PAGO
        const paymentAgreementModal = new bootstrap.Modal(
          document.getElementById("paymentAgreementModal"),
          {
            backdrop: 'static',    // No cerrar al hacer clic fuera
            keyboard: false,       // No cerrar con Esc
            focus: true           // Mantener el foco
          }
        );

        paymentAgreementModal.show();

      } catch (error) {
        console.error("Error parsing JSON:", error);
        Swal.fire({
          icon: "error",
          title: "Error al procesar datos",
          text: "Hubo un error al procesar los datos del ticket.",
          confirmButtonColor: "#dc3545",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error del servidor",
        text: `Error ${xhr.status}: ${xhr.statusText}`,
        confirmButtonColor: "#dc3545",
      });
    }
  };

  xhr.onerror = function () {
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar al servidor para obtener los datos del ticket.",
      confirmButtonColor: "#dc3545",
    });
  };

  const data = `action=GetPaymentAgreementData&id_ticket=${ticketId}`;
  xhr.send(data);
}

function fillPaymentAgreementModal(data) {
  // ✅ LLENAR EL MODAL DE ACUERDO DE PAGO CON LOS DATOS DEL TICKET
  const today = new Date().toLocaleDateString("es-ES", {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // Datos básicos
  document.getElementById("pa_ticket_id").value = data.id_ticket || "";
  document.getElementById("pa_fecha").value = today;
  document.getElementById("pa_numero_ticket").value = data.nro_ticket || "";
  
  // Datos del cliente
  document.getElementById("pa_rif").value = data.coddocumento || "";
  document.getElementById("pa_razon_social").value = data.razonsocial  || "";
  
  // Datos del equipo
  document.getElementById("pa_ejecutivo_venta").value = data.ejecutivo || "";
  document.getElementById("pa_marca_equipo").value = data.desc_modelo  || "";
  document.getElementById("pa_serial").value = data.serialpos || "";
  document.getElementById("pa_status_pos").value = data.desc_estatus  || "";
  document.getElementById("pa_fecha_instalacion").value = data.fechainstalacion  || "";
  
  // Información del acuerdo
  document.getElementById("pa_saldo_deudor").value = "";
  document.getElementById("pa_propuesta").value = "";
  document.getElementById("pa_observaciones").value = "";
  document.getElementById("pa_acuerdo").value = "";
  
  // Establecer valores por defecto de configuración bancaria
  const paNumeroCuenta = document.getElementById('pa_numero_cuenta');
  if (paNumeroCuenta) {
    paNumeroCuenta.value = 'XXXX-XXXX-XX-XXXX';
    // Asegurar que el campo sea readonly (no editable por el usuario)
    paNumeroCuenta.setAttribute('readonly', 'readonly');
    paNumeroCuenta.style.backgroundColor = '#f8f9fa';
    paNumeroCuenta.style.cursor = 'not-allowed';
  }

  const paNombreEmpresa = document.getElementById('pa_nombre_empresa');
  if (paNombreEmpresa) {
    paNombreEmpresa.value = 'Inteligensa';
  }

  const paRifEmpresa = document.getElementById('pa_rif_empresa');
  if (paRifEmpresa) {
    paRifEmpresa.value = 'J-00291615-0';
  }

  const paBanco = document.getElementById('pa_banco');
  if (paBanco) {
    // Si es un select, dejar sin seleccionar por defecto
    if (paBanco.tagName === 'SELECT') {
      paBanco.value = '';
    } else {
      paBanco.value = '';
    }
  }

  const paCorreo = document.getElementById('pa_correo');
  if (paCorreo) {
    paCorreo.value = 'inteligensa@inteligensa.com';
  }
}

function processConvenioGeneration(ticketId, nroTicket) {
  // Obtener datos del ticket para generar el número del convenio
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/documents/GetPaymentAgreementData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const res = JSON.parse(xhr.responseText);

        if (!res || !res.success || !res.rows) {
          Swal.fire({
            icon: "warning",
            title: "No se encontraron datos",
            text: "No se pudieron obtener los datos del ticket para generar el convenio.",
            confirmButtonColor: "#003594",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          return;
        }

        const d = res.rows[0];

        // Generar número del convenio firmado
        const serialPos = d.serialpos || d.serial_pos || "";
        const lastFourSerialDigits = serialPos.slice(-4);
        const convenioNumero = `CF-${ticketId}-${lastFourSerialDigits}`;

        // Almacenar el número del convenio en una variable global
        window.currentConvenioNumero = convenioNumero;

        // ✅ MOSTRAR LOADING CON SWEETALERT2
        Swal.fire({
          title: '🔄 Generando Convenio...',
          html: `
            <div style="text-align: center; padding: 20px;">
              <div style="margin-bottom: 20px;">
                <i class="fas fa-cog fa-spin" style="font-size: 3rem; color: #ffc107;"></i>
              </div>
              <h4 style="color: #2c3e50; margin-bottom: 15px;">Procesando Documento</h4>
              <p style="color: #6c757d; margin: 0;">Por favor espere mientras se genera el documento del convenio...</p>
              <div style="margin-top: 20px;">
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; overflow: hidden;">
                  <div style="background: linear-gradient(90deg, #ffc107, #ffed4e); height: 100%; width: 0%; border-radius: 10px; animation: progress 2s ease-in-out infinite;"></div>
                </div>
              </div>
            </div>
            <style>
              @keyframes progress {
                0% { width: 0%; }
                50% { width: 70%; }
                100% { width: 100%; }
              }
            </style>
          `,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          showCloseButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Simular proceso de generación (reemplazar con llamada real a la API)
        setTimeout(() => {
          Swal.close();
          
          // ✅ MOSTRAR ÉXITO Y TRANSICIONAR
          Swal.fire({
            title: '✅ ¡Convenio Generado!',
            html: `
              <div style="text-align: center; padding: 20px;">
                <div style="margin-bottom: 20px;">
                  <i class="fas fa-check-circle" style="font-size: 4rem; color: #28a745;"></i>
                </div>
                <h4 style="color: #2c3e50; margin-bottom: 15px;">Documento Listo</h4>
                <p style="color: #6c757d; margin-bottom: 20px;">
                  El convenio firmado ha sido generado exitosamente.<br>
                  <strong>Número: ${convenioNumero}</strong>
                </p>
                <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px;">
                  <i class="fas fa-info-circle" style="color: #155724; margin-right: 8px;"></i>
                  <span style="color: #155724;">Ahora puede proceder a subir el documento</span>
                </div>
              </div>
            `,
            confirmButtonText: '<i class="fas fa-upload me-2"></i>Subir Documento',
            confirmButtonColor: '#28a745',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCloseButton: false,
          }).then(() => {
            // ✅ MOSTRAR MODAL DE SUBIR DOCUMENTO
            showUploadDocumentModal(ticketId, nroTicket);
          });
        }, 3000);
        
      } catch (error) {
        console.error("Error parsing JSON:", error);
        Swal.fire({
          icon: "error",
          title: "Error al procesar datos",
          text: "Hubo un error al procesar los datos del ticket.",
          confirmButtonColor: "#dc3545",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error del servidor",
        text: `Error ${xhr.status}: ${xhr.statusText}`,
        confirmButtonColor: "#dc3545",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  };

  xhr.onerror = function () {
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar al servidor para obtener los datos del ticket.",
      confirmButtonColor: "#dc3545",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  };

  const data = `action=GetPaymentAgreementData&id_ticket=${ticketId}`;
  xhr.send(data);
}