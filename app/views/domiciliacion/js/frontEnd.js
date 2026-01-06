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
        
        // Mostrar el botón de adjuntar/visualizar documento si el status es 4 (Deudor - Convenio Firmado) o 6 (Convenio Firmado Aprovado)
        if (currentStatusDomiciliacion == 4) {
            // Verificar si ya tiene documento de convenio
            const tieneConvenio = row.convenio_firmado === "Sí";
            
            if (tieneConvenio) {
                // Si ya tiene convenio, mostrar solo botón para visualizar (sin botón de cambiar estatus)
                return `
                    <div class="d-flex gap-1">
                        <button type="button" class="btn btn-info btn-sm visualizar-documento-btn" 
                            data-id="${idTicket}" 
                            data-nro-ticket="${row.nro_ticket}"
                            data-convenio-url="${row.convenio_url || ''}"
                            data-convenio-filename="${row.convenio_filename || ''}"
                            data-serial="${row.serial_pos || ''}"
                            data-current-status-id="${currentStatusDomiciliacion}"
                            data=
                            title="Visualizar Documento de Convenio">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                            </svg>
                        </button>
                    </div>`;
            } else {
                // Si no tiene convenio, mostrar solo botón para adjuntar (sin botón de cambiar estatus)
                return `
                    <div class="d-flex gap-1">
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
        } else if (currentStatusDomiciliacion == 6) {
            // Si el estatus es 6 (Convenio Firmado Aprovado), mostrar solo botón para visualizar
            return `
                <div class="d-flex gap-1">
                    <button type="button" class="btn btn-info btn-sm visualizar-documento-btn" 
                        data-id="${idTicket}" 
                        data-nro-ticket="${row.nro_ticket}"
                        data-convenio-url="${row.convenio_url || ''}"
                        data-convenio-filename="${row.convenio_filename || ''}"
                        data-serial="${row.serial_pos || ''}"
                        data-current-status-id="${currentStatusDomiciliacion}"
                        data=
                        title="Visualizar Documento de Convenio">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>
                    </button>
                </div>`;
        } else if (currentStatusDomiciliacion == 7) {
            // Si el estatus es 7 (Convenio Firmado Rechazado), mostrar botón para visualizar y adjuntar
            return `
                <div class="d-flex gap-1">
                    <button type="button" class="btn btn-info btn-sm visualizar-documento-btn" 
                        data-id="${idTicket}" 
                        data-nro-ticket="${row.nro_ticket}"
                        data-convenio-url="${row.convenio_url || ''}"
                        data-convenio-filename="${row.convenio_filename || ''}"
                        data-serial="${row.serial_pos || ''}"
                        data-current-status-id="${currentStatusDomiciliacion}"
                        data=
                        title="Visualizar Documento de Convenio">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-sm adjuntar-documento-btn" 
                        style="background-color: #fd7e14; border-color: #fd7e14; color: white;"
                        data-id="${idTicket}" 
                        data-nro-ticket="${row.nro_ticket}"
                        data-convenio-filename="${row.convenio_filename || ''}"
                        data-convenio-fecha="${row.convenio_fecha || ''}"
                        data-convenio-url="${row.convenio_url || ''}"
                        data-serial-pos="${row.serial_pos || ''}"
                        data-motivo-rechazo="${row.motivo_rechazo || ''}"
                        data-current-status-id="${currentStatusDomiciliacion}"
                        title="Adjuntar Documento de Convenio">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"></path>
                        </svg>
                    </button>
                </div>`;
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
                  // Limpiar funciones de búsqueda personalizadas
                  $.fn.dataTable.ext.search.pop();
                }

                // Función para buscar automáticamente el primer botón con datos

                function findFirstButtonWithData() {
                  // Debug: Ver todos los datos disponibles
                  const allData = dataTableInstance.rows().data().toArray();
                  
                  // Debug: Ver el ticket específico si existe
                  const targetTicket = allData.find(row => row.nro_ticket === nroTicket);
                  
                  const searchTerms = [
                    { button: "btn-pendiente-revisar", term: "^1$", column: 5, status: "Pendiente", action: "Pendiente Por revisar domiciliacion" },
                    { button: "btn-solvente", term: "^2$", column: 5, status: "Solvente", action: "Tickets Solventes" },
                    { button: "btn-gestion-comercial", term: "^3$", column: 5, status: "Gestión Comercial", action: "Gestión Comercial" },
                    { button: "btn-convenio-firmado", term: "^(4|6|7)$", column: 5, status: "Convenio Firmado", action: "Deudor - Convenio Firmado - Convenio Firmado Aprovado - Convenio Firmado Rechazado" },
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
                  if (checkDataExists(dataTableInstance, "^2$", 5)) {
                    clearFilters(dataTableInstance);
                    dataTableInstance.column(5).search("^2$", true, false).draw();
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
                  clearFilters(dataTableInstance);
                  
                  // Usar una función de búsqueda personalizada para incluir estatus 4, 6 y 7
                  $.fn.dataTable.ext.search.push(
                    function(settings, data, dataIndex) {
                      // Solo aplicar este filtro en nuestra tabla
                      if (settings.nTable.id !== 'tabla-ticket') {
                        return true;
                      }
                      
                      // Obtener el valor de la columna 5 (id_status_domiciliacion)
                      const statusId = parseInt(data[5]) || 0;
                      
                      // Incluir solo estatus 4, 6 y 7
                      return statusId === 4 || statusId === 6 || statusId === 7;
                    }
                  );
                  
                  dataTableInstance.draw();
                  setActiveButton("btn-convenio-firmado");
                  showActionsColumn();
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
                  const currentStatusId = $(this).data("current-status-id");
                  const BotonRechazo = document.getElementById('RechazoDocumento');
                  const BotonAprobar = document.getElementById('approveTicketFromImage');
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
                  
                  // ✅ OCULTAR BOTÓN DE APROBAR SI EL ESTATUS ES 6 (Convenio Firmado Aprovado)
                  // ✅ MOSTRAR BOTÓN DE APROBAR SI EL ESTATUS ES 7 (Convenio Firmado Rechazado)
                  if (currentStatusId == 6) {
                      if (BotonAprobar) {
                          BotonAprobar.style.display = 'none';
                      }
                  } else if (currentStatusId == 7) {
                      // Para estatus 7, mostrar botón de aprobar
                      if (BotonAprobar) {
                          BotonAprobar.style.display = 'block';
                      }
                      // Ocultar botón de rechazar para estatus 7
                      if (BotonRechazo) {
                          BotonRechazo.style.display = 'none';
                      }
                  } else {
                      if (BotonAprobar) {
                          BotonAprobar.style.display = 'block';
                      }
                  }
                  
                // ✅ OCULTAR BOTÓN DE RECHAZAR SI EL ESTATUS ES 7 O SI YA ESTÁ RECHAZADO
                if (currentStatusId == 7 || ticketRechazado === true || ticketRechazado === 't' || ticketRechazado === 'true') {
                  if (BotonRechazo) {
                      BotonRechazo.style.display = 'none';
                  }
                } else {
                  if (BotonRechazo) {
                      BotonRechazo.style.display = 'block';
                  }
                }

                  // Determinar si es PDF o imagen basándose en la extensión
                  const fileExtension = convenioFilename.toLowerCase().split('.').pop();
                  const isPdf = fileExtension === 'pdf';
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
                  
                  if (isPdf) {
                      // Es un PDF
                      showViewModal(ticketId, nroTicket, null, convenioUrl, convenioFilename, currentStatusId);
                  } else if (isImage) {
                      // Es una imagen
                      showViewModal(ticketId, nroTicket, convenioUrl, null, convenioFilename, currentStatusId);
                  } else {
                      // Tipo de archivo no reconocido, intentar como PDF
                      showViewModal(ticketId, nroTicket, null, convenioUrl, convenioFilename, currentStatusId);
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

  const generateNotaEntregaBtn = document.getElementById("generateNotaEntregaBtn");
  if (generateNotaEntregaBtn) {
    generateNotaEntregaBtn.addEventListener("click", function () {
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
  }
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

function showUploadDocumentModal(ticketId = null, nroTicket = null, currentStatusId = null, convenioFilename = '', convenioFecha = '', convenioUrl = '', serialPos = '', motivoRechazo = '') {
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
  const uploadFormElement = document.getElementById("uploadForm");

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

  // ✅ MOSTRAR INFORMACIÓN DEL DOCUMENTO RECHAZADO SI EL ESTATUS ES 7 (ESTILO IGUAL A DOCUMENTOS POR APROBAR)
  const rejectedDocumentInfo = document.getElementById("rejectedDocumentInfo");
  const generateNotaEntregaBtn = document.getElementById("generateNotaEntregaBtn");
  
  if (currentStatusId == 7 && rejectedDocumentInfo && uploadFormElement) {
    // Usar el motivo de rechazo directamente desde los datos de la tabla (igual que documentos_aprobar)
    const motivoRechazoFinal = motivoRechazo || 'No especificado';
    
    // Crear el HTML con el mismo diseño que Documentos Por Aprobar
    const infoHtml = `
      <div class="alert mb-3" id="CartWrong" role="alert" style="background: linear-gradient(135deg, #6f42c1, #007bff); color: white; border: none;">
        <h6 class="alert-heading">Documento Rechazado</h6>
        <p class="mb-1"><strong>Serial POS:</strong> ${serialPos || 'No disponible'}</p>
        <p class="mb-1"><strong>Tipo de Documento:</strong> convenio_firmado</p>
        <p class="mb-0"><strong>Motivo de Rechazo:</strong> <span class="motivo-rechazo-highlight">${motivoRechazoFinal}</span></p>
      </div>
    `;
    
    // Eliminar cualquier alerta previa
    const existingInfo = uploadFormElement.querySelector('#CartWrong');
    if (existingInfo) {
      existingInfo.remove();
    }
    
    // Insertar la nueva alerta al inicio del formulario
    uploadFormElement.insertAdjacentHTML('afterbegin', infoHtml);
    rejectedDocumentInfo.style.display = "block";
    
    // ✅ MOSTRAR BOTÓN DE GENERAR CONVENIO FIRMADO CUANDO EL ESTATUS ES 7
    if (generateNotaEntregaBtn) {
      generateNotaEntregaBtn.style.display = "block";
    }
  } else {
    // Ocultar la alerta si no es estatus 7
    if (rejectedDocumentInfo) {
      rejectedDocumentInfo.style.display = "none";
      // Eliminar cualquier alerta previa
      const existingInfo = uploadFormElement ? uploadFormElement.querySelector('#CartWrong') : null;
      if (existingInfo) {
        existingInfo.remove();
      }
    }
    
    // ✅ OCULTAR BOTÓN DE GENERAR CONVENIO FIRMADO SI NO ES ESTATUS 7
    if (generateNotaEntregaBtn) {
      generateNotaEntregaBtn.style.display = "none";
    }
  }

  // Limpiar campos del modal y estados de validación
  const documentFileInput = document.getElementById("documentFile");
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
  
  if (uploadFormElement) {
    uploadFormElement.classList.remove("was-validated");
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
      const currentStatusId = $(this).data("current-status-id");
      const convenioFilename = $(this).data("convenio-filename") || '';
      const convenioFecha = $(this).data("convenio-fecha") || '';
      const convenioUrl = $(this).data("convenio-url") || '';
      const serialPos = $(this).data("serial-pos") || '';
      const motivoRechazo = $(this).data("motivo-rechazo") || '';

      // Usar la función showUploadDocumentModal con los parámetros correctos
      showUploadDocumentModal(idTicket, nroTicket, currentStatusId, convenioFilename, convenioFecha, convenioUrl, serialPos, motivoRechazo);

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

        let newStatusId = modalNewStatusDomiciliacionSelect.value;
        
        // ✅ LÓGICA ESPECIAL: Si el estatus actual es 1 y se selecciona "Deudor", cambiar a estatus 3
        const currentStatusId = window.currentDomiciliacionStatusId;
        const selectedOption = modalNewStatusDomiciliacionSelect.options[modalNewStatusDomiciliacionSelect.selectedIndex];
        const isDeudorOption = selectedOption.getAttribute('data-is-deudor') === 'true' || 
                               selectedOption.textContent === 'Deudor' ||
                               (selectedOption.textContent.includes('Deudor') && 
                                !selectedOption.textContent.includes('Convenio') && 
                                !selectedOption.textContent.includes('Desafiliado'));
        
        if (currentStatusId == 1 && isDeudorOption) {
          // Cambiar el newStatusId a 3 (Gestión Comercial - Espera Respuesta Cliente)
          newStatusId = "3";
        }

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
          // ✅ Si convertimos "Deudor" a estatus 3, obtener el nombre correcto del estatus 3
          let newStatusName;
          if (currentStatusId == 1 && isDeudorOption && newStatusId === "3") {
            // Buscar la opción con valor 3 en el select para obtener su nombre
            const status3Option = Array.from(modalNewStatusDomiciliacionSelect.options).find(
              opt => opt.value === "3"
            );
            newStatusName = status3Option ? status3Option.text : "Gestión Comercial - Espera Respuesta Cliente";
          } else {
            newStatusName =
              modalNewStatusDomiciliacionSelect.options[
                modalNewStatusDomiciliacionSelect.selectedIndex
              ].text;
          }

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
  
  // Guardar el currentStatusId en una variable global para usarlo en el event listener
  window.currentDomiciliacionStatusId = currentStatusIdToExclude;

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
            // Encontrar el ID del estatus "Deudor" (sin "Convenio Firmado" ni "Desafiliado")
            let deudorStatusId = null;
            response.estatus.forEach((status) => {
              if (status.name_status_domiciliacion === 'Deudor' || 
                  (status.name_status_domiciliacion.includes('Deudor') && 
                   !status.name_status_domiciliacion.includes('Convenio') && 
                   !status.name_status_domiciliacion.includes('Desafiliado'))) {
                deudorStatusId = status.id_status_domiciliacion;
              }
            });

            response.estatus.forEach((status) => {
              // *** AQUÍ ESTÁ LA LÓGICA CLAVE: FILTRAR LA OPCIÓN ACTUAL POR ID ***
              if (status.id_status_domiciliacion != currentStatusIdToExclude) {
                
                // ✅ LÓGICA ESPECIAL: Cuando el estatus actual es 1 (Pendiente revisar domiciliacion)
                // Solo mostrar Solvente (2) y Deudor
                if (currentStatusIdToExclude == 1) {
                  if (status.id_status_domiciliacion != 2 && status.id_status_domiciliacion != deudorStatusId) {
                    return; // Saltar este estatus
                  }
                }
                
                // ✅ LÓGICA ESPECIAL: Cuando el estatus actual es 3 (Gestión Comercial - Espera Respuesta Cliente)
                // Mostrar: Solvente (2), Deudor - Convenio Firmado (4) y Deudor - Desafiliado con Deuda (5)
                // NO mostrar: Deudor básico, estatus 1, ni estatus 3
                if (currentStatusIdToExclude == 3) {
                  // Excluir estatus 1, 3, y Deudor básico
                  if (status.id_status_domiciliacion == 1 || 
                      status.id_status_domiciliacion == 3 ||
                      status.id_status_domiciliacion == deudorStatusId) {
                    return; // Saltar estatus 1, 3, y Deudor básico
                  }
                  // Solo permitir estatus 2 (Solvente), 4 y 5
                  if (status.id_status_domiciliacion != 2 && 
                      status.id_status_domiciliacion != 4 && 
                      status.id_status_domiciliacion != 5) {
                    return; // Saltar cualquier otro estatus que no sea 2, 4 o 5
                  }
                }
                
                // ✅ SIMPLE: Si no tiene documento, ocultar los estatus de convenio aprobado/rechazado
                if (convenioFirmado !== 'Sí' && 
                    (status.name_status_domiciliacion.includes('Convenio Firmado Aprovado') || 
                     status.name_status_domiciliacion.includes('Convenio Firmado Rechazado'))) {
                  return; // Saltar este estatus
                }
                
                const option = document.createElement("option");

                option.value = status.id_status_domiciliacion;
                
                // Guardar el ID de Deudor en un atributo data para referencia
                if (status.id_status_domiciliacion == deudorStatusId) {
                  option.setAttribute('data-is-deudor', 'true');
                }

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

            // ✅ LÓGICA ESPECIAL: Si el estatus actual es 1 y se selecciona "Deudor", mostrar campo de observaciones
            // porque se convertirá a estatus 3
            const currentStatusId = window.currentDomiciliacionStatusId;
            const selectedOption = this.options[this.selectedIndex];
            const isDeudorOption = selectedOption.getAttribute('data-is-deudor') === 'true' || 
                                   selectedOption.textContent === 'Deudor' ||
                                   (selectedOption.textContent.includes('Deudor') && 
                                    !selectedOption.textContent.includes('Convenio') && 
                                    !selectedOption.textContent.includes('Desafiliado'));
            
            if (selectedValue === "3" || (currentStatusId == 1 && isDeudorOption)) {
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
              // ✅ CERRAR EL MODAL DE SUBIDA PRIMERO
              uploadDocumentModalInstance.hide();

              // ✅ OBTENER DATOS DEL DOCUMENTO RECIÉN SUBIDO
              const filePath = result.file_path || '';
              const originalFilename = result.original_filename || '';
              const mimeType = result.mime_type || '';
              const nroTicketValue = nroTicket || idTicketElement.getAttribute("data-nro-ticket");
              
              // ✅ DETERMINAR SI ES PDF O IMAGEN
              const fileExtension = originalFilename.toLowerCase().split('.').pop();
              const isPdf = fileExtension === 'pdf';
              const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
              
              // ✅ CONSTRUIR LA URL COMPLETA DEL DOCUMENTO USANDO LA FUNCIÓN EXISTENTE
              function cleanFilePath(filePath) {
                if (!filePath) return null;
                let cleanPath = filePath.replace(/\\/g, '/');
                const pathSegments = cleanPath.split('Documentos_SoportePost/');
                if (pathSegments.length > 1) {
                  cleanPath = pathSegments[1];
                }
                // Usar window.location.origin para obtener el host dinámicamente
                return `${window.location.origin}/Documentos/${cleanPath}`;
              }
              
              const fullUrl = cleanFilePath(filePath);
              
              // ✅ RECARGAR LA TABLA PRIMERO PARA ACTUALIZAR EL ESTATUS
              searchDomiciliacionTickets();
              
              // ✅ MOSTRAR MENSAJE DE ÉXITO Y LUEGO EL MODAL
              Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "Documento subido exitosamente.",
                confirmButtonColor: "#003594",
                confirmButtonText: "Ok",
                color: "black",
              }).then(() => {
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
        const idTicketValue = document.getElementById("id_ticket") ? document.getElementById("id_ticket").value : null;
        const nroTicketValue = document.getElementById("id_ticket") ? document.getElementById("id_ticket").getAttribute("data-nro-ticket") : null;
        
        if (!idTicketValue) {
          Swal.fire({
            icon: "warning",
            title: "Ticket no disponible",
            text: "No se encontró el ID del ticket para generar el acuerdo de pago.",
            confirmButtonColor: '#003594'
          });
          return;
        }

        // Cerrar el modal de subir documento
        if (uploadDocumentModalInstance) {
          uploadDocumentModalInstance.hide();
        }

        // Mostrar el modal de generar convenio usando la función correcta
        showGenerateConvenioModal(idTicketValue, nroTicketValue);
        return;
        
        // Obtener datos del ticket para el acuerdo de pago (código anterior - ya no se usa)

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
      // ✅ OCULTAR Y ELIMINAR ALERTA DE DOCUMENTO RECHAZADO AL CERRAR EL MODAL
      const rejectedDocumentInfo = document.getElementById("rejectedDocumentInfo");
      const uploadForm = document.getElementById("uploadForm");
      if (rejectedDocumentInfo) {
        rejectedDocumentInfo.style.display = "none";
      }
      // Eliminar cualquier alerta previa
      if (uploadForm) {
        const existingInfo = uploadForm.querySelector('#CartWrong');
        if (existingInfo) {
          existingInfo.remove();
        }
      }
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
            
            window.location.reload();
          }, 500);
        } else {
          // Si el usuario presiona "Cerrar"
          // Limpiar el iframe
          if (iframe && iframe.parentNode) {
            document.body.removeChild(iframe);
          }
          
          window.location.reload();
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

function showViewModal(ticketId, nroTicket, imageUrl, pdfUrl, documentName, currentStatusId = null) {
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

    // ✅ MANEJAR BOTONES SEGÚN EL ESTATUS
    const BotonAprobar = document.getElementById('approveTicketFromImage');
    const BotonRechazo = document.getElementById('RechazoDocumento');
    
    // Ocultar/mostrar botones según el estatus
    if (currentStatusId == 6) {
        // Estatus 6: Ocultar botón de aprobar y rechazar
        if (BotonAprobar) {
            BotonAprobar.style.display = 'none';
        }
        if (BotonRechazo) {
            BotonRechazo.style.display = 'none';
        }
    } else if (currentStatusId == 7) {
        // Estatus 7: Mostrar botón de aprobar, ocultar rechazar
        if (BotonAprobar) {
            BotonAprobar.style.display = 'block';
        }
        if (BotonRechazo) {
            BotonRechazo.style.display = 'none';
        }
    } else {
        // Otros estatus: Mostrar ambos botones normalmente
        if (BotonAprobar) {
            BotonAprobar.style.display = 'block';
        }
        if (BotonRechazo) {
            BotonRechazo.style.display = 'block';
        }
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

// ✅ FUNCIÓN PARA OBTENER EL MOTIVO DE RECHAZO DEL DOCUMENTO RECHAZADO
function getMotivoRechazoDocumento(ticketId, nroTicket, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/getMotivoRechazoDocumento`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    let motivoRechazo = "No especificado";
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success && response.motivo) {
          motivoRechazo = response.motivo.name_motivo_rechazo || "No especificado";
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
    // Llamar al callback con el motivo de rechazo
    if (typeof callback === 'function') {
      callback(motivoRechazo);
    }
  };

  xhr.onerror = function () {
    if (typeof callback === 'function') {
      callback("No especificado");
    }
  };

  const datos = `action=getMotivoRechazo&ticketId=${encodeURIComponent(ticketId)}&nroTicket=${encodeURIComponent(nroTicket || '')}&documentType=convenio_firmado`;
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