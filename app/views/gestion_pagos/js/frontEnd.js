// Instancias de los modales de Bootstrap (las inicializaremos cuando el DOM esté listo)
console.log("--> frontEnd.js LOADED <--"); // DEBUG

let modalInstance;
let currentTicketId = null;
let modalInstanceCoordinator;
let confirmReassignModalInstance = null;
let selectTechnicianModalInstance = null;
let inputTecnicoActual = null;
let currentTicketIdForImage = null;
let currentTicketNroForImage = null;
let DocumentType = null;

let currentTicketOldTechnicianId = null; 
let EnvioInput = null;
let ExoInput = null;
let PagoInput = null;
let modalPagoPresupuestoInstance = null; // Global instance for the payment modal

// Variables globales para la reasignación de tickets
let currentTicketNro = null;
let currentTicketData = null;

document.addEventListener("DOMContentLoaded", function () {
  console.log("--> DOMContentLoaded FIRED in frontEnd.js <--"); // DEBUG

  // Inicializar las instancias de los modales de Bootstrap para poder controlarlos con JS
  const viewDocumentModalInstance = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
  
  const modalPagoElement = document.getElementById("modalPagoPresupuesto");
  if (modalPagoElement) {
      modalPagoPresupuestoInstance = new bootstrap.Modal(modalPagoElement, { keyboard: false });
  }

  const modalRechazoInstance = new bootstrap.Modal(document.getElementById('modalRechazo'));
  const botonCerrarmotivo = document.getElementById('CerrarModalMotivoRechazo');
  const confirmarRechazoModal = new bootstrap.Modal(document.getElementById('modalConfirmacionRechazo'), {keyboard: false});
  const modalConfirmacionRechazoBtn = document.getElementById('modalConfirmacionRechazoBtn');

  // Obtener el botón de rechazo del DOM
  const rechazoDocumentoBtn = document.getElementById('RechazoDocumento');

  // 1. Manejar el evento de clic en el botón "Rechazar Documento"
  // La lógica es: cerrar el modal actual y luego abrir el nuevo.
  if (rechazoDocumentoBtn) {
    rechazoDocumentoBtn.addEventListener('click', function () {
      // Cierra el modal de visualización
      viewDocumentModalInstance.hide();

      // Abre el modal de rechazo
      modalRechazoInstance.show();
    });
  }

  if(modalConfirmacionRechazoBtn){
    modalConfirmacionRechazoBtn.addEventListener('click', function () {
      confirmarRechazoModal.hide();
    });
  }

  document.getElementById("confirmarRechazoBtn").addEventListener("click", function() {
    // Opcional: Obtén el texto del motivo seleccionado para mostrarlo en el modal
    const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");
    const motivoSeleccionadoTexto = motivoRechazoSelect.options[motivoRechazoSelect.selectedIndex].text;


    document.getElementById("motivoSeleccionadoTexto").textContent = motivoSeleccionadoTexto;
  });

  if (botonCerrarmotivo) {
    botonCerrarmotivo.addEventListener('click', function () {
      // Ocultar el modal de rechazo
      modalRechazoInstance.hide();
    })
  }

  // 2. Lógica para el modal de rechazo
  const motivoRechazoSelect = document.getElementById('motivoRechazoSelect');
  const otroMotivoContainer = document.getElementById('otroMotivoContainer');
  const confirmarRechazoBtn = document.getElementById('confirmarRechazoBtn');

  // Mostrar u ocultar el campo de texto "Otro" según la selección
  /*if (motivoRechazoSelect) {
    motivoRechazoSelect.addEventListener('change', function () {
      if (motivoRechazoSelect.value === '4') {
        otroMotivoContainer.style.display = 'block';
      } else {
        otroMotivoContainer.style.display = 'none';
      }
    });
  }*/

  // Evento click para el botón "Confirmar Rechazo"
  $("#confirmarRechazoBtn").off("click").on("click", function() {
    const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");

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

  const selectTechnicianModalInstance = new bootstrap.Modal(
    document.getElementById("selectTechnicianModal"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );


  // El resto de tus event listeners...
  // Inicializar instancias de los modales de Bootstrap
  confirmReassignModalInstance = new bootstrap.Modal(
    document.getElementById("confirmReassignModal"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );

  const buttoncerrar = document.getElementById("noConfirm");

  if (buttoncerrar && confirmReassignModalInstance) {
    buttoncerrar.addEventListener("click", function () {
      confirmReassignModalInstance.hide(); // Oculta el modal de confirmación
    });
  }

  const bottonOpenModal = document.getElementById("confirmReassignYesBtn");
  const bottonCerrar = document.getElementById("ButtonCancel");

  // !!! AQUI ES DONDE ESTÁ EL CAMBIO CRÍTICO !!!
  if (bottonOpenModal && confirmReassignModalInstance) {
    bottonOpenModal.addEventListener("click", async function () {
      // Agrega 'async' aquí
      confirmReassignModalInstance.hide(); // Oculta el modal de confirmación

      // Solo si tenemos un currentTicketId, intentamos cargar los datos del técnico
      if (currentTicketId) {
        try {
          // Carga los datos del técnico ANTES de mostrar el modal de selección
          // AWAIT es crucial aquí para esperar que la promesa se resuelva
          await getTechnicianData(currentTicketId);
          getTecnico21(inputTecnicoActual);
          selectTechnicianModalInstance.show(); // Muestra el modal de selección de técnico
        } catch (error) {
          console.error(
            "Error al cargar datos de técnicos para reasignación:",
            error
          );
          alert(
            "No se pudieron cargar los técnicos para reasignar. Por favor, intente de nuevo."
          );
        }
      } else {
        console.error("Error: No se ha seleccionado un ticket para reasignar.");
        alert("No se pudo reasignar el ticket. Seleccione uno de la tabla.");
      }
    });
  }

  if (bottonCerrar && selectTechnicianModalInstance) {
    bottonCerrar.addEventListener("click", function () {
      selectTechnicianModalInstance.hide(); // Oculta el modal de selección de técnico
      // Limpia los valores de los elementos en el modal de selección de técnico
      const technicianSelect = document.getElementById("technicianSelect");
      const currentTechnicianName = document.getElementById("currentTechnicianDisplay")
      const dateoldtec = document.getElementById("currentAssignmentDateDisplay");
      const currentRegionTec = document.getElementById("currentRegion");
      const inputRegnew = document.getElementById("InputRegionUser2");
      technicianSelect.value = "";
      currentTechnicianName.textContent = "";
      dateoldtec.textContent = "";
      currentRegionTec.textContent = "";
      inputRegnew.value = "";

    });
  }

  // Referencias a elementos dentro de los modales
  const ticketNumberSpan = document.getElementById("ticketNumberSpan");
  const ticketserialPos = document.getElementById("ticketserialPos");
  const currentTechnicianName = document.getElementById("currentTechnicianName");
  const confirmReassignYesBtn = document.getElementById("confirmReassignYesBtn");
  const assignTechnicianBtn = document.getElementById("assignTechnicianBtn");

  // Evento para el botón "Sí" del modal de confirmación
  confirmReassignYesBtn.addEventListener("click", async function () {
    confirmReassignModalInstance.hide(); // Oculta el modal de confirmación
  });

  // Evento para el botón "Asignar" del modal de selección de técnico
  // Evento para el botón "Asignar" del modal de selección de técnico
assignTechnicianBtn.addEventListener("click", async function () {
  const newTechnicianId = technicianSelect.value;
  const newTechnicianName = technicianSelect.options[technicianSelect.selectedIndex].textContent;

  if (newTechnicianId) {
    // Deshabilitar botón para evitar múltiples clics
    assignTechnicianBtn.disabled = true;
    assignTechnicianBtn.textContent = "Asignando...";

    try {
      const success = await reassignTicket(currentTicketId, newTechnicianId);

      if (success) {
        const emailSuccess = await sendReassignmentEmails(
          currentTicketId,
          currentTicketOldTechnicianId,
          newTechnicianId
        );
        Swal.fire({
          icon: "success",
          title: "¡Reasignación Exitosa!",
          html: `El Ticket <span style="border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${currentTicketNro}</span> ha sido reasignado con éxito a <span style="border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${newTechnicianName}</span>.`,
          confirmButtonText: "Ok",
          color: "black",
          confirmButtonColor: "#003594",
        }).then(() => {
          location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error al reasignar el ticket ${currentTicketNro}. Por favor, intente de nuevo.`,
          confirmButtonText: "Aceptar",
          color: "black",
          confirmButtonColor: "#003594",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Ocurrió un error al reasignar el ticket ${currentTicketNro}: ${error.message}`,
        confirmButtonText: "Aceptar",
        color: "black",
        confirmButtonColor: "#003594",
      });
    } finally {
      selectTechnicianModalInstance.hide();
      assignTechnicianBtn.disabled = false;
      assignTechnicianBtn.textContent = "Asignar";
    }
  } else {
    Swal.fire({
      title: "Notificación!",
      text: "Debe seleccionar un técnico para reasignar el ticket.",
      icon: "warning",
      confirmButtonText: "Aceptar",
      color: "black",
      confirmButtonColor: "#003594",
    });
  }
});

// Función para enviar correos de reasignación (convertida a async/await)
async function sendReassignmentEmails(ticketId, oldTechnicianId, newTechnicianId) {
  try {

    const xhrEmail = new XMLHttpRequest();
    const url = `${ENDPOINT_BASE}${APP_PATH}api/email/send_reassignment_email`;
    const params = `action=send_reassignment_email&ticket_id=${encodeURIComponent(
      ticketId
    )}&old_technician_id=${encodeURIComponent(
      oldTechnicianId
    )}&new_technician_id=${encodeURIComponent(newTechnicianId)}`;

    xhrEmail.open("POST", url);
    xhrEmail.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Convertir xhrEmail a Promise para usar await
    const response = await new Promise((resolve, reject) => {
      xhrEmail.onload = function () {
        if (xhrEmail.status === 200) {
          try {
            const responseEmail = JSON.parse(xhrEmail.responseText);
            resolve(responseEmail);
          } catch (error) {
            reject(error);
          }
        } else {
          console.error("DEBUG: Error en la solicitud HTTP:", {
            status: xhrEmail.status,
            statusText: xhrEmail.statusText,
            responseText: xhrEmail.responseText,
          });
          reject(new Error(`HTTP error! status: ${xhrEmail.status}`));
        }
      };

      xhrEmail.onerror = function () {
        reject(new Error("Error de red"));
      };

      xhrEmail.send(params);
    });

    if (response.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
});

document.addEventListener("DOMContentLoaded", function () {
  getTicketDataCoordinator(); // Llama a la función para cargar los datos

  // Obtén la referencia al botón cerrar FUERA de la función getTicketData y del bucle
  const cerrar = document.getElementById("close-button");
  const assignButton = document.getElementById("assingment-button"); // Obtén el botón "Asignar"
  const inputRegion = document.getElementById("InputRegion"); // Obtén el input de región

  // Agrega el event listener al botón cerrar
  cerrar.addEventListener("click", function () {
    if (modalInstance) {
      modalInstance.hide();
      currentTicketId = null; // Limpia el ID del ticket al cerrar el modal
      inputRegion.value = ""; // Limpia el campo de región al cerrar el modal
    }
    document.getElementById("idSelectionTec").value = "";
  });
  // Agrega el event listener al botón "Asignar"
  assignButton.addEventListener("click", AssignTicket);
});

function getTicketDataCoordinator() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketData`);

  const tbody = document.getElementById("tabla-ticket").getElementsByTagName("tbody")[0];

  // Read nro_ticket from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const nroTicket = urlParams.get('nro_ticket');

  // Destruye DataTables si ya está inicializado
  if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
    $("#tabla-ticket").DataTable().destroy();
    tbody.innerHTML = "";
  }

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

          const modalElement = document.getElementById("staticBackdrop");
          if (modalElement) {
            modalInstanceCoordinator = new bootstrap.Modal(modalElement, {
              backdrop: "static",
              keyboard: false,
            });

            const closebutton = document.getElementById("close-button");
            const closeIcon = document.getElementById("Close-icon");
            const SelectReg = document.getElementById("idSelectionTec");
            const InputReg = document.getElementById("InputRegion");

            if (closebutton && SelectReg && modalInstanceCoordinator) {
              closebutton.addEventListener("click", function () {
                modalInstanceCoordinator.hide();
                InputReg.value = "";
              });
            }

            if (closeIcon && SelectReg && modalInstanceCoordinator) {
              closeIcon.addEventListener("click", function () {
                modalInstanceCoordinator.hide();
                InputReg.value = "";
              });
            }
          } else {
            console.error("El elemento 'staticBackdrop' (modal de asignación) no fue encontrado en el DOM.");
          }

          const detailsPanel = document.getElementById("ticket-details-panel");
          detailsPanel.innerHTML = "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

          const dataForDataTable = [];

          TicketData.forEach((data) => {
            let actionButtonsHtml = "";
            currentTicketNroForImage = data.nro_ticket;

            // FILTRO: Solo mostrar tickets con presupuesto (REMOVED BY REQUEST)
             /* if (data.ticket_tiene_presupuesto !== 't' && data.ticket_tiene_presupuesto !== true) {
                return; // Saltar este ticket si no tiene presupuesto
            } */

            // Lógica para los botones de acción - REMOVED BY REQUEST
            // Buttons for id_accion_ticket 4, 3, 6, 10 were removed here.
            
            /* 
            if (data.id_accion_ticket === '4') { ... } 
            else if (data.id_accion_ticket === '3') { ... }
            else if (data.id_accion_ticket === '6' || data.id_accion_ticket === '10') { ... }
            */


            // BOTON AGREGAR PAGO COMPLETO PRESUPUESTO
            // Solo mostrar si tiene presupuesto cargado y NO es garantía (id_status_payment 1 o 3)
            const idStatusPayment = data.id_status_payment ? parseInt(data.id_status_payment) : null;
            if ((data.presupuesto === 'Si' || data.presupuesto === 'Sí') && idStatusPayment !== 1 && idStatusPayment !== 3) {
              actionButtonsHtml += `
                  <button type="button" id="btnPaymentBudget" class="btn generate-presupuesto-btn" 
                    data-ticket-id="${data.id_ticket}" 
                    data-serial-pos="${data.serial_pos}" 
                    data-nro-ticket="${data.nro_ticket}" 
                    title="Presupuesto" 
                    style="background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); border: none; border-radius: 25px; padding: 8px 16px; box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3); transition: all 0.3s ease; position: relative; overflow: hidden;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-file-earmark-text" viewBox="0 0 16 16" style="display: inline-block;">
                        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"></path>
                        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5"></path>
                      </svg>
                      <span class="presupuesto-text" style="display: none; margin-left: 8px; color: white; font-weight: 600; white-space: nowrap;">Presupuesto</span>
                  </button>
              `;
            }

            if (data.envio === 'Si' || data.exoneracion === 'Si' || data.anticipo === 'Si' || data.presupuesto === 'Si' || data.pago === 'Si') {
              actionButtonsHtml += `
                <button id="botonMostarImage" class="btn btn-sm btn-view-image" data-bs-placement="top" title="Visualizar Documentos"
                  data-ticket-id="${data.id_ticket}"
                  data-nro-ticket="${data.nro_ticket}"
                  data-envio="${data.envio}"
                  data-exoneracion="${data.exoneracion}"
                  data-pago="${data.pago}"
                  data-presupuesto="${data.presupuesto}"
                  data-rechazado="${data.rechazado}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                    <path d="M.046 8.5C.138 7.042 1.517 5.0 8 5.0s7.862 2.042 7.954 3.5c-.092 1.458-1.472 3.5-7.954 3.5S.138 9.958.046 8.5M13 8a5 5 0 1 0-10 0 5 5 0 0 0 10 0"/>
                  </svg>
                </button>
              `;
            } else {
              actionButtonsHtml += `
                <button type="button" id="botonMostarNoImage" class="btn btn-secondary btn-sm" title="No hay Documentos a visualizar" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-x-fill" viewBox="0 0 16 16">
                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.854 7.146 8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 1 1 .708-.708"/>
                  </svg>
                </button>
              `;
            }

            dataForDataTable.push([
              data.id_ticket,
              data.nro_ticket,
              data.rif,
              data.serial_pos,
              data.razonsocial_cliente,
              data.name_accion_ticket,
              data.full_name_tecnico_n2_actual,
              actionButtonsHtml,
            ]);
          });

        const rowCountForOverlay = dataForDataTable.length;
        if (rowCountForOverlay > 0 && typeof showLoadingOverlay === "function") {
          const tableJQ = $("#tabla-ticket");
          showLoadingOverlay(`Renderizando ${rowCountForOverlay} tickets...`);
          const handleDraw = () => {
            tableJQ.off("draw.dt", handleDraw);
            if (typeof hideLoadingOverlay === "function") {
              hideLoadingOverlay();
            }
          };
          tableJQ.on("draw.dt", handleDraw);
          setTimeout(() => {
            tableJQ.off("draw.dt", handleDraw);
            if (typeof hideLoadingOverlay === "function") {
              hideLoadingOverlay();
            }
          }, Math.min(8000, Math.max(1500, rowCountForOverlay * 6)));
        } else if (typeof hideLoadingOverlay === "function") {
          hideLoadingOverlay();
        }

          // Inicialización de DataTables
          const dataTableInstance = $("#tabla-ticket").DataTable({
            data: dataForDataTable,
            scrollX: "200px",
            responsive: false,
            pagingType: "simple_numbers",
            lengthMenu: [[5, 10], ["5", "10"]],
            autoWidth: true,
            autoheight: true,
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
              { title: "Rif" },
              { title: "Serial POS" },
              {
                title: "Razón Social",
                render: function (data, type, row) {
                  if (type === "display") {
                    return `<span class="truncated-cell" data-full-text="${data}">${data}</span>`;
                  }
                  return data;
                },
              },
              { title: "Acción Ticket" },
              { title: "Técnico Asignado", visible: false },
              { title: "Acciones", orderable: false },
            ],
            language: {
              lengthMenu: "Mostrar _MENU_ Registros",
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
            },
            dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
            initComplete: function (settings, json) {
              const api = this.api();
              const buttonsHtml = `
                <button id="btn-por-asignar" class="btn btn-primary me-2" title="Tickets por Asignar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/>
                  </svg>
                </button>
                <button id="btn-recibidos" class="btn btn-secondary me-2" title="Tickets recibidos por la Coordinación">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                    <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/>
                    <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                  </svg>
                </button>
                <button id="btn-asignados" class="btn btn-secondary me-2" title="Tickets Asignados">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                  </svg>
                </button>
                <button id="btn-reasignado" class="btn btn-secondary me-2" title="Tickets Reasignados">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16">
                    <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
                  </svg>
                </button>`;
              $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

              function setActiveButton(activeButtonId) {
                $("#btn-por-asignar, #btn-recibidos, #btn-asignados, #btn-reasignado")
                  .removeClass("btn-primary").addClass("btn-secondary");
                $(`#${activeButtonId}`).removeClass("btn-secondary").addClass("btn-primary");
              }

              function checkDataExists(searchTerm) {
                api.columns().search('').draw(false);
                api.column(6).visible(false);
                api.column(7).visible(true);
                api.column(5).search(searchTerm, true, false).draw();
                const rowCount = api.rows({ filter: 'applied' }).count();
                return rowCount > 0;
              }

              function findFirstButtonWithData() {
                const searchTerms = [
                  { button: "btn-por-asignar", term: "Asignado a la Coordinación", status: "Abierto", action: "Asignado a la Coordinación" },
                  { button: "btn-recibidos", term: "Recibido por la Coordinación", status: "Abierto", action: "Recibido por la Coordinación" },
                  { button: "btn-asignados", term: "Asignado al Técnico|Recibido por el Técnico", status: "En proceso", action: ["Asignado al Técnico", "Recibido por el Técnico"] },
                  { button: "btn-reasignado", term: "Reasignado al Técnico", status: "En proceso", action: "Reasignado al Técnico" }
                ];

                let fallbackConfig = null;
                let ticketFoundConfig = null;
                let ticketFound = false;

                for (const config of searchTerms) {
                  const hasData = checkDataExists(config.term);

                  if (!hasData) {
                    continue;
                  }

                  if (!fallbackConfig) {
                    fallbackConfig = config;
                  }

                  if (nroTicket) {
                    const filteredRows = api.rows({ filter: 'applied' }).data().toArray();
                    const hasTicket = filteredRows.some(row => {
                      const ticketNumber = Array.isArray(row) ? row[1] : row?.nro_ticket;
                      return ticketNumber === nroTicket;
                    });

                    if (hasTicket) {
                      ticketFoundConfig = config;
                      ticketFound = true;
                      break;
                    }
                  } else {
                    ticketFoundConfig = config;
                    break;
                  }
                }

                if (!ticketFoundConfig && fallbackConfig) {
                  ticketFoundConfig = fallbackConfig;
                }

                if (ticketFoundConfig) {
                  // Reaplicar el filtro seleccionado para garantizar el estado correcto
                  checkDataExists(ticketFoundConfig.term);

                  if (ticketFoundConfig.button === "btn-asignados") {
                    api.column(6).visible(true);
                  } else {
                    api.column(6).visible(false);
                  }
                  api.column(7).visible(true);
                  setActiveButton(ticketFoundConfig.button);
                  showTicketStatusIndicator(ticketFoundConfig.status, ticketFoundConfig.action);

                  if (nroTicket) {
                    if (ticketFound) {
                      api.search(nroTicket).draw(false);
                      $('.dataTables_filter input').val(nroTicket);
                      api.rows().every(function () {
                        const rowData = this.data();
                        const ticketNumber = Array.isArray(rowData) ? rowData[1] : rowData?.nro_ticket;
                        if (ticketNumber === nroTicket) {
                          $(this.node()).addClass('table-active');
                          this.node().scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                          $(this.node()).removeClass('table-active');
                        }
                      });
                    } else {
                      api.search('').draw(false);
                      $('.dataTables_filter input').val('');
                      api.rows().every(function () {
                        $(this.node()).removeClass('table-active');
                      });
                      Swal.fire({
                        icon: 'warning',
                        title: 'Ticket no encontrado',
                        text: `El ticket ${nroTicket} no se encuentra en los datos disponibles.`,
                        confirmButtonText: 'Ok',
                        color: 'black',
                        confirmButtonColor: '#003594'
                      });
                    }
                  }
                  return true;
                }

                api.columns().search('').draw(false);
                api.column(6).visible(false);
                api.column(7).visible(true);
                api.column(5).search("NO_DATA_FOUND").draw();
                setActiveButton("btn-por-asignar");
                showTicketStatusIndicator("Cerrado", "Sin datos");
                tbody.innerHTML = `
                  <tr>
                    <td colspan="14" class="text-center text-muted py-5">
                      <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                          <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay tickets para Asignar a Técnico en este momento.</p>
                      </div>
                    </td>
                  </tr>`;
                if (nroTicket) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Ticket no encontrado',
                    text: `El ticket ${nroTicket} no se encuentra en los datos disponibles.`,
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#003594'
                  });
                }
                return false;
              }

              // Determine the correct filter button based on the current module
              const currentPath = window.location.pathname.split('/').pop().replace('.html', '');
              const buttonMapping = {
                'asignar_tecnico': 'btn-por-asignar',
                'recibidos_coordinacion': 'btn-recibidos',
                'asignados_tecnico': 'btn-asignados',
                'reasignado_tecnico': 'btn-reasignado'
              };
              const activeButton = buttonMapping[currentPath] || 'btn-por-asignar';

              // Initialize with the correct filter and nro_ticket search
              // findFirstButtonWithData(); // Disabled by user request

              // Event listeners para los botones
              $("#btn-por-asignar").on("click", function () {
                if (checkDataExists("Asignado a la Coordinación")) {
                  api.columns().search('').draw(false);
                  api.column(6).visible(false);
                  api.column(7).visible(true);
                  api.column(5).search("Asignado a la Coordinación").draw();
                  setActiveButton("btn-por-asignar");
                  showTicketStatusIndicator("Abierto", "Asignado a la Coordinación");
                  if (nroTicket) api.search(nroTicket).draw(false);
                } else {
                  findFirstButtonWithData();
                }
              });

              $("#btn-recibidos").on("click", function () {
                if (checkDataExists("Recibido por la Coordinación")) {
                  api.columns().search('').draw(false);
                  api.column(6).visible(false);
                  api.column(7).visible(true);
                  api.column(5).search("Recibido por la Coordinación").draw();
                  setActiveButton("btn-recibidos");
                  showTicketStatusIndicator("Abierto", "Recibido por la Coordinación");
                  if (nroTicket) api.search(nroTicket).draw(false);
                } else {
                  findFirstButtonWithData();
                }
              });

              $("#btn-asignados").on("click", function () {
                const searchTerm = "Asignado al Técnico|Recibido por el Técnico";
                if (checkDataExists(searchTerm)) {
                  api.columns().search('').draw(false);
                  api.column(6).visible(true);
                  api.column(7).visible(true);
                  api.column(5).search(searchTerm).draw();
                  setActiveButton("btn-asignados");
                  showTicketStatusIndicator("En proceso", ["Asignado al Técnico", "Recibido por el Técnico"]);
                  if (nroTicket) api.search(nroTicket).draw(false);
                } else {
                  findFirstButtonWithData();
                }
              });

              $("#btn-reasignado").on("click", function () {
                if (checkDataExists("Reasignado al Técnico")) {
                  api.columns().search('').draw(false);
                  api.column(6).visible(true);
                  api.column(7).visible(false);
                  api.column(5).search("Reasignado al Técnico").draw();
                  setActiveButton("btn-reasignado");
                  showTicketStatusIndicator("En proceso", "Reasignado al Técnico");
                  if (nroTicket) api.search(nroTicket).draw(false);
                } else {
                  findFirstButtonWithData();
                }
              });
            },
          });

          $("#tabla-ticket").resizableColumns();

          $("#tabla-ticket tbody")
            .off("click", "tr")
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
                    imgElement.src = '/public/img/consulta_rif/POS/mantainment.png';
                    imgElement.alt = "Serial no disponible";
                  }
                }
              } else {
                detailsPanel.innerHTML = "<p>No se encontraron detalles para este ticket.</p>";
              }
            });

          $("#tabla-ticket tbody")
            .off("click", ".truncated-cell, .expanded-cell")
            .on("click", ".truncated-cell, .expanded-cell", function (e) {
              e.stopPropagation();
              const $cellSpan = $(this);
              const fullText = $cellSpan.data("full-text");
              const displayLength = 25;
              if ($cellSpan.hasClass("truncated-cell")) {
                $cellSpan.removeClass("truncated-cell").addClass("expanded-cell").text(fullText);
              } else if ($cellSpan.hasClass("expanded-cell")) {
                $cellSpan.removeClass("expanded-cell").addClass("truncated-cell");
                $cellSpan.text(fullText.length > displayLength ? fullText.substring(0, displayLength) + "..." : fullText);
              }
            });

          $("#tabla-ticket tbody")
            .off("click", ".btn-received-coord")
            .on("click", ".btn-received-coord", function (e) {
              e.stopPropagation();
              const ticketId = $(this).data("ticket-id");
              const nroTicket = $(this).data("nro-ticket");
              const serialPos = $(this).data("serial-pos");
              markTicketAsReceived(ticketId, nroTicket, serialPos);
            });

          $("#tabla-ticket tbody")
            .off("click", ".btn-assign-tech")
            .on("click", ".btn-assign-tech", function (e) {
              e.stopPropagation();
              const ticketId = $(this).data("ticket-id");
              const nroTicket = $(this).data("nro-ticket");
              const serialPos = $(this).data("serial-pos");
              currentTicketId = ticketId;
              currentTicketNroForAssignment = nroTicket;
              currentTicketSerialPosForAssignment = serialPos;
              if (modalInstanceCoordinator) {
                modalInstanceCoordinator.show();
              } else {
                console.error("Error: La instancia del modal de asignación no está disponible.");
              }
            });

          $("#tabla-ticket tbody")
            .off("click", ".btn-reassign-tech")
            .on("click", ".btn-reassign-tech", function (e) {
              e.stopPropagation();
              currentTicketId = $(this).data("ticket-id");
              currentTicketNro = $(this).data("nro-ticket");
              currentserialPos = $(this).data("serial-pos");
              ticketNumberSpan.textContent = currentTicketNro;
              ticketserialPos.textContent = currentserialPos;
              confirmReassignModalInstance.show();
            });

          $("#tabla-ticket tbody")
            .off("click", ".btn-view-image")
            .on("click", ".btn-view-image", function (e) {
              e.stopPropagation();
              const ticketId = $(this).data("ticket-id");
              const nroTicket = $(this).data("nro-ticket");

              const pagoValor = $(this).data("pago");
              const presupuestoValor = $(this).data("presupuesto");
              const ticketRechazado = $(this).data("rechazado");
              const BotonRechazo = document.getElementById('RechazoDocumento');
              BotonRechazo.style.display = 'none';
              currentTicketIdForImage = ticketId;
              currentTicketNroForImage = nroTicket;
              const VizualizarImage = document.getElementById('visualizarImagenModal');
              const visualizarImagenModal = new bootstrap.Modal(VizualizarImage, { keyboard: false });
              document.getElementById('BotonCerrarSelectDocument').onclick = () => visualizarImagenModal.hide();

              const PagoInputModal = document.getElementById('imagenPago');
              const PagoLabelModal = document.getElementById('labelPago');
              const PresupuestoInputModal = document.getElementById('imagenPresupuesto');
              const PresupuestoLabelModal = document.getElementById('labelPresupuesto');

              if (pagoValor === 'Sí' || pagoValor === 'Si') {
                PagoInputModal.style.display = 'block';
                PagoLabelModal.style.display = 'block';
              } else {
                PagoInputModal.style.display = 'none';
                PagoLabelModal.style.display = 'none';
              }
              if (presupuestoValor === 'Si' || presupuestoValor === 'Sí') {
                if (PresupuestoInputModal && PresupuestoLabelModal) {
                    PresupuestoInputModal.style.display = 'block';
                    PresupuestoLabelModal.style.display = 'block';
                }
              } else {
                if (PresupuestoInputModal && PresupuestoLabelModal) {
                    PresupuestoInputModal.style.display = 'none';
                    PresupuestoLabelModal.style.display = 'none';
                }
              }
              const btnConfirmar = document.getElementById('btnConfirmarVisualizacion');
              const btnConfirmarClone = btnConfirmar.cloneNode(true);
              btnConfirmar.parentNode.replaceChild(btnConfirmarClone, btnConfirmar);
              btnConfirmarClone.addEventListener('click', function () {
                const selectedOption = document.querySelector('input[name="opcionImagen"]:checked')?.value;
                if (!selectedOption) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Selección Requerida',
                    text: 'Por favor, elija un tipo de documento para visualizar.',
                    confirmButtonText: 'Ok',
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
                getMotivos(selectedOption);
                fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetDocumentByType`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body: `action=GetDocumentByType&ticketId=${currentTicketNroForImage}&documentType=${selectedOption}`
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                      const document = data.document;
                      const filePath = document.file_path;
                      const mimeType = document.mime_type;
                      const fileName = document.original_filename;
                      if (mimeType.startsWith('image/')) {
                        showViewModal(currentTicketIdForImage, currentTicketNroForImage, filePath, null, fileName);
                      } else if (mimeType === 'application/pdf') {
                        showViewModal(currentTicketIdForImage, currentTicketNroForImage, null, filePath, fileName);
                      } else {
                        showViewModal(currentTicketIdForImage, currentTicketNroForImage, null, null, "Tipo de documento no soportado");
                      }
                      visualizarImagenModal.hide();
                    } else {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Error',
                        text: `No se pudo obtener el documento: ${data.message || 'Error desconocido'}`,
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
                      text: 'Error al obtener el documento',
                      confirmButtonText: 'Ok',
                      color: 'black',
                      confirmButtonColor: '#003594'
                    });
                  });
              });
              visualizarImagenModal.show();
            });
        } else {
          hideTicketStatusIndicator();
          tbody.innerHTML = '<tr><td>Error al cargar</td></tr>';
          console.error("Error:", response.message);
        }
      } catch (error) {
        hideTicketStatusIndicator();
        tbody.innerHTML = '<tr><td>Error al procesar la respuesta</td></tr>';
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      hideTicketStatusIndicator();
      tbody.innerHTML = `
        <tr>
          <td colspan="14" class="text-center text-muted py-5">
            <div class="d-flex flex-column align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
              <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
              <p class="text-muted mb-0">No hay tickets para Asignar a Técnico en este momento.</p>
            </div>
          </td>
        </tr>`;
    } else {
      tbody.innerHTML = '<tr><td>Error de conexión</td></tr>';
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    hideTicketStatusIndicator();
    tbody.innerHTML = '<tr><td>Error de conexión</td></tr>';
    console.error("Error de red");
  };

  const datos = `action=GetTicketData`;
  xhr.send(datos);
}

function getTechnicianData(ticketIdToFetch) {
  // Cambié el nombre del parámetro para evitar cualquier posible confusión

  // Validar que ticketIdToFetch no es un objeto Event
  if (typeof ticketIdToFetch === "object" && ticketIdToFetch !== null) {
    if (ticketIdToFetch.type && ticketIdToFetch.target) {
      // Podría ser un objeto Event
      console.error(
        "ERROR CRÍTICO: Se intentó pasar un objeto Event a getTechnicianData. Esto no debería ocurrir."
      );
      alert(
        "Error interno: No se pudo procesar el ID del ticket. Contacte a soporte."
      );
      return Promise.reject(
        new Error("Invalid ticket ID: received an event object.")
      );
    }
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const API_URL_GET_TECHNICIANS = `${ENDPOINT_BASE}${APP_PATH}api/users/GetTechniciansAndCurrentTicketTechnician`;

    xhr.open("POST", API_URL_GET_TECHNICIANS);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const inputNtecnico = document.getElementById("currentTechnicianDisplay");
          const inputFecha = document.getElementById("currentAssignmentDateDisplay");
          const inputRegion = document.getElementById("currentRegion");
          const technicianSelect = document.getElementById("technicianSelect");

          if (response.success) {
            // *** ESTA ES LA LÍNEA CRÍTICA ***
            // 1. Asigna el valor del técnico actual a la variable global 'inputTecnicoActual'
            inputTecnicoActual = response.technicians.full_tecnicoassig1 || "No Asignado";
            currentTicketOldTechnicianId = response.technicians.id_tecnico;


            // 2. Luego, usa inputTecnicoActual (o directamente response.technicians.full_tecnicoassig1) para actualizar el DOM
            // Ya tienes 'inputNtecnico' que es la referencia a "currentTechnicianDisplay"
            if (inputNtecnico) { // Reutiliza inputNtecnico que ya está declarado
              inputNtecnico.innerHTML = inputTecnicoActual; // Usa la variable global que ya tiene el valor
            }

            // Continuar con las otras actualizaciones del DOM
            inputFecha.innerHTML = response.technicians.fecha_asignacion || "N/A";
            inputRegion.innerHTML = response.technicians.name_region || "N/A";

          } else {
            // Si la respuesta no es exitosa, asegúrate de que inputTecnicoActual también se maneje
            inputTecnicoActual = "No Asignado"; // Establece un valor predeterminado
            if (inputNtecnico) {
              inputNtecnico.innerHTML = "No Asignado";
            }
            inputFecha.innerHTML = "N/A";
            inputRegion.innerHTML = "N/A";
            if (technicianSelect) { // Asegúrate de que technicianSelect existe antes de intentar acceder a .value
              technicianSelect.value = "";
            }
            console.error("Error en la respuesta de la API:", response.message);
          }
          resolve(response);
        } catch (error) {
          console.error("Error parsing JSON para obtener técnicos:", error);
          reject(error);
        }
      } else {
        console.error(
          "Error en la solicitud para obtener técnicos:",
          xhr.status,
          xhr.statusText
        );
        reject(new Error(`HTTP error! status: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      console.error("Error de red al intentar obtener técnicos.");
      reject(new Error("Error de red"));
    };

    const dataToSend = `action=GetTechniciansAndCurrentTicketTechnician&ticket_id=${ticketIdToFetch}`;
    xhr.send(dataToSend);
  });
}

async function reassignTicket(ticketId, newTechnicianId) {
  try {
    const xhr = new XMLHttpRequest();
    const id_user = document.getElementById("id_user").value; // Asumiendo que tienes el ID del usuario logueado
    const comment = document.getElementById("reassignObservation").value; // Asumiendo que tienes el comentario del usuario
    const API_URL_REASSIGN = `${ENDPOINT_BASE}${APP_PATH}api/users/ReassignTicket`;

    xhr.open("POST", API_URL_REASSIGN);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    const dataToSend = `action=ReassignTicket&ticket_id=${ticketId}&new_technician_id=${newTechnicianId}&id_user=${id_user}&comment=${comment}`;

    // Convertir el callback de xhr a una promesa para usar await
    const response = await new Promise((resolve, reject) => {
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.success);
          } catch (error) {
            console.error("Error parsing JSON para reasignar ticket:", error);
            reject(error);
          }
        } else {
          console.error(
            "Error en la solicitud para reasignar ticket:",
            xhr.status,
            xhr.statusText
          );
          reject(new Error(`HTTP error! status: ${xhr.status}`));
        }
      };

      xhr.onerror = function () {
        console.error("Error de red al intentar reasignar ticket.");
        reject(new Error("Error de red"));
      };

      xhr.send(dataToSend);
    });

    return response;
  } catch (error) {
    throw error; // Relanzar el error para que pueda ser manejado por el llamador
  }
}

// Ejecutar esto una vez al cargar la página o cuando se abre la vista del historial
function markTicketAsReceived(ticketId, nroTicket, serialPos) {
  // Asegúrate de que nroTicket esté como parámetro
  const id_user = document.getElementById("id_user").value;
  // SVG que quieres usar
  const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
  Swal.fire({
    // El nuevo texto del header va aquí
    title: `Confirmación de recibido`, // Texto fijo para el encabezado
    // El contenido del cuerpo (SVG y texto explicativo) va en 'html'
    html: `${customWarningSvg}<p class="mt-3" id = "textConfirm">¿Deseas Marcar el ticket Nro: <span id = "NroTicketConfirReceiCoord">${nroTicket}</span> Asociado el Pos: <span id = "NroTicketConfirReceiCoord">${serialPos}</span> como recibido? 
    </p><p id = "textConfirmp">Esta acción registrará la fecha de recepción y habilitará la asignación de técnico.</p>`,
    showCancelButton: true,
    confirmButtonColor: "#003594",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Recibir Pos",
    cancelButtonText: "Cancelar",
    color: "black",
    customClass: {
      popup: "swal2-custom-header-popup", // Clase principal para el popup
      title: "swal2-custom-title", // Clase para el título (para estilizarlo en CSS)
      content: "custom-content", // Puedes mantener esta si la usas para el contenido del cuerpo
      actions: "custom-actions",
      confirmButton: "swal2-confirm-receive-ticket-class",
      cancelButton: "swal2-cancel-receive-ticket-class",
    },
    didOpen: (popup) => {
      const confirmBtn = popup.querySelector(
        ".swal2-confirm-receive-ticket-class"
      );
      const cancelBtn = popup.querySelector(
        ".swal2-cancel-receive-ticket-class"
      );

      if (confirmBtn) {
        confirmBtn.id = "swal2-confirm-receive-ticket-id";
      }
      if (cancelBtn) {
        cancelBtn.id = "swal2-cancel-receive-ticket-id";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/historical/MarkTicketReceived`
      ); // Necesitas una nueva ruta de API para esto
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              Swal.fire({
                title: "¡Recibido!",
                html: `El ticket Nr: <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> ha sido marcado como recibido.`,
                icon: "success",
                color: "black",
                confirmButtonColor: "#003594",
              });
              getTicketDataCoordinator();
              if (modalInstanceCoordinator) {
                modalInstanceCoordinator.hide();
              } else {
                console.error(
                  "No se pudo cerrar el modal: la instancia no está disponible."
                );
              }
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
            console.error(
              "Error parsing JSON for markTicketAsReceived:",
              error
            );
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

      const data = `action=MarkTicketReceived&ticket_id=${ticketId}&id_user=${encodeURIComponent(
        id_user
      )}`;
      xhr.send(data);
    }
  });
}

function AssignTicket() {
  const id_tecnico_asignado = document.getElementById("idSelectionTec").value;

  if (!currentTicketId || !id_tecnico_asignado) {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Por favor, selecciona un técnico antes de asignar.",
      color: "black",
      confirmButtonText: "Ok",
      confirmButtonColor: "#003594",
    });
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/AssignTicket`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: response.message,
            html: `El Pos asociado <span style="border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${currentTicketSerialPosForAssignment}</span> al nro de ticket: <span style="border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${currentTicketNroForAssignment}</span> ha sido asignado correctamente.`,
            color: "black",
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#003594",
          }).then((result) => {
            if (result.isConfirmed) {
              getTicketDataCoordinator();
              if (modalInstanceCoordinator) {
                modalInstanceCoordinator.hide();
                document.getElementById("InputRegion").value = "";
              }
            }
          });
          document.getElementById("idSelectionTec").value = "";
          currentTicketId = null;
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al asignar",
            text: response.message,
            color: "black",
          });
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        Swal.fire({
          icon: "error",
          title: "Error en el servidor",
          text: "Ocurrió un error al procesar la respuesta.",
          color: "black",
        });
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor.",
        color: "black",
      });
    }
  };
  const datos = `action=AssignTicket&id_ticket=${encodeURIComponent(
    currentTicketId
  )}&id_tecnico=${encodeURIComponent(id_tecnico_asignado)}`;
  xhr.send(datos);
}

function getTecnico21(tecnicoActualParaFiltrar) { // Nuevo parámetro
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTecnico2`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select2 = document.getElementById("technicianSelect");

          select2.innerHTML = '<option value="">Seleccione</option>';

          if (
            Array.isArray(response.tecnicos) &&
            response.tecnicos.length > 0
          ) {
            response.tecnicos.forEach((tecnico) => {
              if (tecnico.full_name !== tecnicoActualParaFiltrar) {
                const option2 = document.createElement("option");
                option2.value = tecnico.id_user;
                option2.textContent = tecnico.full_name;
                select2.appendChild(option2);
              } else {
              }
            });

            select2.addEventListener("change", function () {
              const selectedTecnicoId = this.value;
              if (selectedTecnicoId) {
                GetRegionUser(selectedTecnicoId);
              } else {
                document.getElementById("InputRegionUser2").value = "";
              }
            });

          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay Técnicos Disponibles";
            select.appendChild(option);
            select2.appendChild(option.cloneNode(true));
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

  const datos = `action=GetTecnico2`;
  xhr.send(datos);
}

function getTecnico2() { // Nuevo parámetro
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTecnico2`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("idSelectionTec");
          const select2 = document.getElementById("technicianSelect");

          select.innerHTML = '<option value="">Seleccione</option>';

          if (
            Array.isArray(response.tecnicos) &&
            response.tecnicos.length > 0
          ) {
            response.tecnicos.forEach((tecnico) => {
              const option = document.createElement("option");
              option.value = tecnico.id_user;
              option.textContent = tecnico.full_name;
              select.appendChild(option);


            });

            // Event Listeners (no cambian)
            select.addEventListener("change", function () {
              const selectedTecnicoId = this.value;
              if (selectedTecnicoId) {
                GetRegionUser(selectedTecnicoId);
              } else {
                document.getElementById("InputRegion").value = "";
              }
            });

          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay Técnicos Disponibles";
            select.appendChild(option);
            select2.appendChild(option.cloneNode(true));
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

  const datos = `action=GetTecnico2`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getTecnico2);

function GetRegionUser(id_user) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/users/GetRegionUsersAssign`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const inputRegion = document.getElementById("InputRegion");
          const inputRegionUser2 = document.getElementById("InputRegionUser2");
          const region = response.regionusers || "";

          if (region) {
            inputRegion.value = region;
            inputRegionUser2.value = region; // Asignar la región al campo según el técnico seleccionado
          } else {
            inputRegion.value = ""; // Limpiar el campo si no hay región
            inputRegionUser2.value = ""; // Limpiar el campo si no hay región
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, selecciona un ticket antes de asignar un técnico.",
            color: "black",
          });
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de la región del técnico.";
        document.getElementById("InputRegion").value = "";
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      document.getElementById("rifMensaje").innerHTML +=
        "<br>Error de conexión con el servidor para la región del técnico.";
      document.getElementById("InputRegion").value = "";
    }
  };
  const datos = `action=GetRegionUsersAssign&id_user=${encodeURIComponent(
    id_user
  )}`;
  xhr.send(datos);
}

// Función adaptada para cargar los motivos
function getMotivos(documentType) {
  const xhr = new XMLHttpRequest();

  // Muestra un mensaje de carga en el select
  const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");
  motivoRechazoSelect.innerHTML = '<option value="">Cargando...</option>';

  DocumentType = documentType;

  // Aquí cambiamos el endpoint para apuntar a la API de motivos
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetMotivos`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          // Apuntamos al select de motivos
          const select = document.getElementById("motivoRechazoSelect");

          // Limpiamos el select antes de agregar nuevas opciones
          select.innerHTML = '<option value="">Seleccione</option>';

          // La respuesta debe tener un array llamado 'motivos'
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
  const datos = `action=GetMotivos&documentType=${documentType}`;
  xhr.send(datos);
}

// Obtén una referencia al modal y al tbody de la tabla


// Espera a que el DOM esté completamente cargado para asegurarse de que los elementos existen
// Espera a que el DOM esté completamente cargado para asegurarse de que los elementos existen
// --- INICIALIZACIÓN Y LISTENERS DEL DOM ---

// Espera a que el DOM esté completamente cargado para asegurarse de que los elementos existen
document.addEventListener('DOMContentLoaded', function () {
    // Definición de variables clave (debe estar en el scope donde se usan)
    // Se asume que 'tbodyComponentes' y 'modalComponentes' están definidas
    // Si no están definidas globalmente, deben definirse aquí:
    /*
    const tbodyComponentes = document.getElementById('tbodyComponentes');
    const modalComponentesEl = document.getElementById('modalComponentes');
    const modalComponentes = new bootstrap.Modal(modalComponentesEl, { keyboard: false });
    */

    // Asumiendo que 'modalComponentesEl' y 'modalComponentes' existen/son accesibles
    // Asumiendo que 'modalComponentesEl' y 'modalComponentes' existen/son accesibles
    const modalComponentesEl = document.getElementById('modalComponentes');
    let modalComponentes = null;
    if (modalComponentesEl) {
        modalComponentes = new bootstrap.Modal(modalComponentesEl, { keyboard: false });
    }
    const tbodyComponentes = document.getElementById('tbodyComponentes');


    // Escucha el evento click en el documento y usa delegación.
    document.addEventListener('click', function (e) {
        
        // 1. Botón para abrir el modal ('hiperbinComponents')


        // 2. Botón "Limpiar Selección"
        if (e.target && e.target.closest('.btn-outline-secondary.btn-sm') && e.target.closest('.modal-body')) {
            limpiarSeleccion();
        }

        // 3. Botón "Guardar Componentes"


        // 4. Botón de cerrar el modal
        if (e.target && e.target.id === 'BotonCerrarModal') {
            modalComponentes.hide();
        }

        // 5. Checkbox "Seleccionar Todos"


        // 6. Checkboxes individuales de componentes

    });
});



// Función auxiliar para determinar el tipo de documento
function getDocumentType(url) {
  if (!url) {
    return null;
  }

  const lowerUrl = url.toLowerCase();
  if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg') || lowerUrl.endsWith('.png') || lowerUrl.endsWith('.gif')) {
    return 'image';
  } else if (lowerUrl.endsWith('.pdf')) {
    return 'pdf';
  } else {
    return null;
  }
}

// Función para mostrar el modal de visualización (modificada para usar los elementos del DOM)
function showViewModal(ticketId, nroTicket, imageUrl, pdfUrl, documentName) {
  const modalElementView = document.getElementById("viewDocumentModal");
  const modalTicketIdSpanView = modalElementView.querySelector("#viewModalTicketId");
  const imageViewPreview = document.getElementById("imageViewPreview");
  const pdfViewViewer = document.getElementById("pdfViewViewer");
  const messageContainer = document.getElementById("viewDocumentMessage");
  const nameDocumento = document.getElementById("NombreImage");
  const BotonCerrarModal = document.getElementById("CerrarModalVizualizar");
  const BotonCerrarModalSelect = document.getElementById("BotonCerrarSelectDocument");

  currentTicketId = ticketId;
  currentNroTicket = nroTicket;
  modalTicketIdSpanView.textContent = currentNroTicket;

  // Limpiar vistas y mensajes
  imageViewPreview.style.display = "none";
  pdfViewViewer.style.display = "none";
  messageContainer.textContent = "";
  messageContainer.classList.add("hidden");

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

  if (imageUrl) {
    // Es una imagen
    const fullUrl = cleanFilePath(imageUrl);

    imageViewPreview.src = fullUrl;
    imageViewPreview.style.display = "block";
    nameDocumento.textContent = documentName;

  } else if (pdfUrl) {
    // Es un PDF
    const fullUrl = cleanFilePath(pdfUrl);

    pdfViewViewer.innerHTML = `<iframe src="${fullUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
    pdfViewViewer.style.display = "block";
    nameDocumento.textContent = documentName;

  } else {
    // No hay documento
    messageContainer.textContent = "No hay documento disponible para este ticket.";
    messageContainer.classList.remove("hidden");
    nameDocumento.textContent = "";
  }

  const viewDocumentModal = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
  const VizualizarImage = document.getElementById('visualizarImagenModal');
  const visualizarImagenModal = new bootstrap.Modal(VizualizarImage, { keyboard: false });
  viewDocumentModal.show();
  
  BotonCerrarModal.addEventListener('click', function () {
    // Ocultar el modal de visualización
    viewDocumentModal.hide();
                
    // Mostrar nuevamente el modal de selección
    setTimeout(() => {
      visualizarImagenModal.show();
    }, 300); //
  });

  BotonCerrarModalSelect.addEventListener('click', function () {
    // Ocultar el modal de visualización
    visualizarImagenModal.hide();
    
  });
};

const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");

// --- Delegación de eventos para botones generados dinámicamente (Patrón del usuario) ---
    document.addEventListener("click", function (event) {
        
        // Delegación para el botón "Pago Presupuesto"
        const btnPayment = event.target.closest("#btnPaymentBudget");
        
        if (btnPayment) {
            console.log("Click detected on #btnPaymentBudget (Native JS Delegation)"); // DEBUG
            event.preventDefault();
            
            const ticketId = btnPayment.getAttribute("data-ticket-id");
            const nroTicket = btnPayment.getAttribute("data-nro-ticket");
            
            // Llamar a la función para abrir el modal (Patrón de Gestión Rosal)
            openModalPagoPresupuesto(nroTicket, ticketId);
            return;
        }
    });

    const CerramodalBtn = document.getElementById("btnCerrarPagoPresupuesto");
    if (CerramodalBtn) {
        CerramodalBtn.addEventListener("click", function () {
            // El modal se cierra automáticamente por data-bs-dismiss="modal"
            // Pero podemos añadir limpieza adicional si fuera necesario.
            console.log("Cerrando modal de pago presupuesto...");
        });
    }

    // 2. Evento Toggle Moneda
    const radiosPago = document.querySelectorAll('input[name="metodoPagoPresupuesto"]');
    radiosPago.forEach(radio => {
        radio.addEventListener('change', function() {
            const simbolo = document.getElementById("monedaSimbolo");
            if(simbolo) simbolo.textContent = this.value === 'bs' ? 'Bs' : '$';
        });
    });

// Crea una instancia del modal de confirmación de rechazo (si no lo has hecho ya)
const confirmarRechazoModal = new bootstrap.Modal(document.getElementById('modalConfirmacionRechazo'));

// Evento para el botón de confirmar la acción de rechazo dentro del modal
document.getElementById('btnConfirmarAccionRechazo').addEventListener('click', function () {
    const ticketId = currentTicketIdForImage; // Usamos el ID del ticket actual
    const nroticket = currentTicketNroForImage; // Usamos el número de ticket actual
    const motivoId = motivoRechazoSelect.value; // Obtenemos el ID del motivo seleccionado
    const id_user = document.getElementById('id_user').value; // Obtenemos el ID del usuario
    const documentType = DocumentType; // Aquí usamos la variable global


    // Opcional: Cerrar el modal de confirmación mientras se procesa la solicitud
    confirmarRechazoModal.hide();

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
    const datos = `action=rechazarDocumento&ticketId=${encodeURIComponent(ticketId)}&motivoId=${encodeURIComponent(motivoId)}&nroTicket=${encodeURIComponent(nroticket)}&id_user=${encodeURIComponent(id_user)}&documentType=${encodeURIComponent(documentType)}`; // Ajusta los datos a tu script de backend
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/rechazarDocumento`); // Ajusta la URL a tu script de backend
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
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
                      // Parámetros necesarios para PHP
                      const params =  `action=send_reject_document&id_user=${encodeURIComponent(id_user)}&documentType=${encodeURIComponent(documentType)}`

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

    // --- EVENTOS PAGO PRESUPUESTO ---

    // Inicializar Modal de Pago Presupuesto - REMOVED TO INSTANTIATE ON CLICK
    /*
    const modalPagoPresupuestoElement = document.getElementById("modalPagoPresupuesto");
    let modalPagoPresupuesto = null;
    if (modalPagoPresupuestoElement) {
        modalPagoPresupuesto = new bootstrap.Modal(modalPagoPresupuestoElement);
    }
    */
      

    // 3. Evento Visualizar Presupuesto desde el Modal de Pago
    const btnVerPresupuesto = document.getElementById("btnVisualizarPresupuestoModal");
    if (btnVerPresupuesto) {
        btnVerPresupuesto.addEventListener("click", function() {
             const documentType = 'presupuesto';
             
             fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetDocumentByType`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body: `action=GetDocumentByType&ticketId=${currentTicketNro}&documentType=${documentType}`
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                      const document = data.document;
                      const filePath = document.file_path;
                      const mimeType = document.mime_type;
                      const fileName = document.original_filename;
                      
                      if (mimeType.startsWith('image/')) {
                        showViewModal(currentTicketId, currentTicketNro, filePath, null, fileName);
                      } else if (mimeType === 'application/pdf') {
                        showViewModal(currentTicketId, currentTicketNro, null, filePath, fileName);
                      } else {
                        Swal.fire("Error", "Tipo de documento no soportado", "error");
                      }
                    } else {
                        Swal.fire("Aviso", data.message || "No se encontró documento de presupuesto.", "warning");
                    }
                  })
                  .catch(error => {
                      console.error("Error fetching budget doc:", error);
                      Swal.fire("Error", "Error al buscar el documento.", "error");
                  });
        });
    }

    // 4. Guardar Pago
    const btnGuardarPago = document.getElementById("btnGuardarPagoPresupuesto");
    if (btnGuardarPago) {
        btnGuardarPago.addEventListener("click", function() {
            const monto = document.getElementById("montoPagoPresupuesto").value;
            const referencia = document.getElementById("referenciaPagoPresupuesto").value;
            const banco = document.getElementById("bancoPagoPresupuesto").value;
            const metodo = document.querySelector('input[name="metodoPagoPresupuesto"]:checked').value;

            if (!monto || !referencia || !banco) {
                Swal.fire("Error", "Por favor complete todos los campos obligatorios", "error");
                return;
            }

            console.log("Guardando pago:", { ticket: currentTicketNro, monto, referencia, banco, metodo });
            
            Swal.fire({
                title: "Éxito",
                text: "Pago registrado correctamente (Simulación)",
                icon: "success",
                confirmButtonColor: "#003594"
            }).then(() => {
                if(modalPagoPresupuesto) modalPagoPresupuesto.hide();
            });
        });
    }
});

/**
 * Función para abrir el modal de pago de presupuesto (Patrón Gestión Rosal)
 * @param {string} nroTicket - El número de ticket
 * @param {string} ticketId - El ID del ticket
 */
function openModalPagoPresupuesto(nroTicket, ticketId) {
    currentTicketId = ticketId;
    currentTicketNro = nroTicket;

    // Limpiar formulario y resetear estado visual
    const formPago = document.getElementById("formPagoPresupuesto");
    if(formPago) formPago.reset();
    
    const inputTicket = document.getElementById("pagoPresupuestoTicket");
    if(inputTicket) inputTicket.value = nroTicket;
    
    const radioBs = document.getElementById("metodoPagoBs");
    if(radioBs) radioBs.checked = true;
    
    const simbolo = document.getElementById("monedaSimbolo");
    if(simbolo) simbolo.textContent = "Bs";
    
    // Set globals for image viewer if needed
    currentTicketNroForImage = nroTicket;
    currentIdTicketForImage = ticketId;

    // Mostrar el modal usando la instancia global
    if (modalPagoPresupuestoInstance) {
        modalPagoPresupuestoInstance.show();
    } else {
        console.error("Instancia de modalPagoPresupuestoInstance no inicializada.");
    }
}