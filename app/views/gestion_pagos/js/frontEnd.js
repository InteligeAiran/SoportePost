// Instancias de los modales de Bootstrap (las inicializaremos cuando el DOM esté listo)


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
let editPaymentModalInstance = null; // Global instance for edit payment modal
// --- CUSTOM STYLES FOR NON-BOOTSTRAP LOOK ---
const customSwalStyles = `
<style id="custom-swal-styles">
    .swal-premium-popup {
        border-radius: 16px !important;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
    }
    .swal-premium-title {
        color: #2c3e50 !important;
        font-weight: 600 !important;
        font-size: 1.5rem !important;
    }
    .swal-premium-confirm {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        border-radius: 8px !important;
        padding: 12px 30px !important;
        font-weight: 500 !important;
        letter-spacing: 0.5px !important;
        box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4) !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .swal-premium-confirm:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(118, 75, 162, 0.6) !important;
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
    }
    .swal-premium-cancel {
        background: #fff !important;
        color: #e74c3c !important;
        border: 2px solid #e74c3c !important;
        border-radius: 8px !important;
        padding: 10px 25px !important;
        font-weight: 600 !important;
        transition: all 0.2s ease !important;
    }
    .swal-premium-cancel:hover {
        background: #e74c3c !important;
        color: #fff !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4) !important;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 480px) {
        .swal-premium-popup {
            width: 90% !important;
            padding: 1rem !important;
        }
        .swal-premium-title {
            font-size: 1.25rem !important;
        }
        .swal-premium-confirm, .swal-premium-cancel {
            width: 100% !important;
            margin: 5px 0 !important;
        }
    }
</style>
`;
if (!document.getElementById('custom-swal-styles')) {
    $('head').append(customSwalStyles);
}

// Variables globales para la reasignación de tickets
let currentTicketNro = null;
let currentTicketData = null;
let currentBudgetAmount = null; // New global variable for budget amount

document.addEventListener("DOMContentLoaded", function () {
  console.log("--> DOMContentLoaded FIRED in frontEnd.js <--"); // DEBUG

  // Inicializar las instancias de los modales de Bootstrap para poder controlarlos con JS
  const viewDocumentModalInstance = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
  
  const modalPagoElement = document.getElementById("modalPagoPresupuesto");
  if (modalPagoElement) {
      modalPagoPresupuestoInstance = new bootstrap.Modal(modalPagoElement, { keyboard: false });
      
      // Reset form on close
      modalPagoElement.addEventListener('hidden.bs.modal', resetFormPago);
  }

  const modalRechazoInstance = new bootstrap.Modal(document.getElementById('modalRechazo'));
  const botonCerrarmotivo = document.getElementById('CerrarModalMotivoRechazo');
  const confirmarRechazoModal = new bootstrap.Modal(document.getElementById('modalConfirmacionRechazo'), {keyboard: false});
  const modalConfirmacionRechazoBtn = document.getElementById('modalConfirmacionRechazoBtn');

  // 1. Manejar el evento de clic en el botón "Rechazar Documento"
  // (Removido por solicitud del usuario en este módulo)

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
            // MODIFICACION: Validacion anterior comentada para permitir pagos multiples/sin presupuesto explícito
            /*
            const idStatusPayment = data.id_status_payment ? parseInt(data.id_status_payment) : null;
            if ((data.presupuesto === 'Si' || data.presupuesto === 'Sí') && idStatusPayment !== 1 && idStatusPayment !== 3) {
            */
            // Se muestra SIEMPRE (Comportamiento solicitado: "lo haré visible SIEMPRE")
            if (true) { 
              actionButtonsHtml += `
                  <button type="button" id="btnPaymentBudget" class="btn generate-presupuesto-btn" 
                    data-ticket-id="${data.id_ticket}" 
                    data-serial-pos="${data.serial_pos}" 
                    data-nro-ticket="${data.nro_ticket}" 
                    data-budget-amount="${data.budget_amount || 0}"
                    data-razon-social="${data.razonsocial_cliente || ''}"
                    data-rif="${data.rif || ''}"
                    data-telefono="${data.telefono_cliente || ''}"
                    data-estatus-pos="${data.estatus_inteliservices || ''}"
                    data-has-presupuesto="${data.presupuesto || 'No'}"
                    title="Agregar pagos" 
                    style="background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); border: none; border-radius: 25px; padding: 8px 16px; box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3); transition: all 0.3s ease; position: relative; overflow: hidden;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-plus-lg" viewBox="0 0 16 16" style="display: inline-block;">
                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                      </svg>
                      <span class="presupuesto-text" style="display: none; margin-left: 8px; color: white; font-weight: 600; white-space: nowrap;">Agregar pagos</span>
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
              $(".dt-buttons-container").addClass("d-flex").html('');

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
// Función para mostrar el modal de visualización (modificada para usar los elementos del DOM)
function showViewModal(ticketId, nroTicket, imageUrl, pdfUrl, documentName, fromSelector = true, customTitle = null) {
  const modalElementView = document.getElementById("viewDocumentModal");
  const modalTitleView = document.getElementById("viewDocumentModalLabel"); // The H5 title
  const modalTicketIdSpanView = modalElementView.querySelector("#viewModalTicketId");
  const imageViewPreview = document.getElementById("imageViewPreview");
  const pdfViewViewer = document.getElementById("pdfViewViewer");
  const messageContainer = document.getElementById("viewDocumentMessage");
  const nameDocumento = document.getElementById("NombreImage");
  const BotonCerrarModal = document.getElementById("CerrarModalVizualizar");
  const BotonCerrarModalSelect = document.getElementById("BotonCerrarSelectDocument");

  currentTicketId = ticketId;
  currentNroTicket = nroTicket;
  
  if (customTitle) {
    modalTitleView.innerHTML = customTitle;
  } else {
    modalTitleView.innerHTML = `Visualizando Documento - Ticket: <span id="viewModalTicketId">${currentNroTicket}</span>`;
  }

  // Limpiar vistas y mensajes
  imageViewPreview.style.display = "none";
  pdfViewViewer.style.display = "none";
  messageContainer.textContent = "";
  messageContainer.classList.add("hidden");

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
  
  // Usamos onclick para limpiar listeners anteriores y manejar la lógica condicional
  BotonCerrarModal.onclick = function () {
    // Ocultar el modal de visualización
    viewDocumentModal.hide();
                
    // Mostrar nuevamente el modal de selección SOLO si venimos de él
    if (fromSelector) {
        setTimeout(() => {
          visualizarImagenModal.show();
        }, 300); 
    }
  };

  BotonCerrarModalSelect.addEventListener('click', function () {
    // Ocultar el modal de visualización
    visualizarImagenModal.hide();
    
  });
}

/**
 * View a payment receipt.
 * Optimized: Uses parameters from JOIN or fallback.
 */
window.viewPaymentReceipt = function(path, mime, name, recordNumber) {
    if (!path) {
        Swal.fire("Atención", "Este pago no tiene un comprobante digital adjunto.", "info");
        return;
    }

    const receiptName = name || 'Comprobante de Pago';
    const isPdf = (mime && mime.includes('pdf')) || path.toLowerCase().endsWith('.pdf');
    
    // Custom title for payments as requested by the user
    const title = recordNumber ? `Pago - Nro. Registro: <span class="badge bg-light text-primary">${recordNumber}</span>` : 'Pago';
    
    if (isPdf) {
        showViewModal('', '', null, path, receiptName, false, title);
    } else {
        showViewModal('', '', path, null, receiptName, false, title);
    }
};

/**
 * Robustly clean file paths for document viewing.
 * Extracts the relative part from absolute disk paths.
 */
function cleanFilePath(filePath) {
    if (!filePath) return null;

    // 1. Normalize all slashes to forward slashes first
    let path = filePath.replace(/\\/g, '/');

    // 2. Extract path after the storage root (Documentos_SoportePost)
    // We look for 'Documentos_SoportePost' regardless of case
    const rootMarker = "Documentos_SoportePost/";
    const index = path.toLowerCase().indexOf(rootMarker.toLowerCase());
    
    if (index !== -1) {
        path = path.substring(index + rootMarker.length);
    } else {
        // Fallback: If root marker not found, try to find by common segments
        const segments = path.split('/');
        const pagosIndex = segments.findIndex(s => s.toLowerCase() === 'pagos' || s.toLowerCase() === 'anticipo');
        if (pagosIndex !== -1 && pagosIndex > 0) {
            // Keep segments from the serial onwards (usually root/SERIAL/TICKET/Pagos/FILE)
            path = segments.slice(pagosIndex - 2).join('/');
        }
    }

    // 3. Construct the web URL
    // Use ENDPOINT_BASE if HOST is not defined (standard in this app)
    let baseUrl = "";
    if (typeof HOST !== 'undefined' && HOST) {
        baseUrl = `http://${HOST}/Documentos/`;
    } else if (typeof ENDPOINT_BASE !== 'undefined') {
        // ENDPOINT_BASE usually points to the app root, e.g., http://localhost/SoportePost/
        // Documentos are served from a virtual directory /Documentos/ at the server root
        const origin = new URL(ENDPOINT_BASE).origin;
        baseUrl = `${origin}/Documentos/`;
    } else {
        baseUrl = "/Documentos/";
    }

    return baseUrl + path;
}

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
            const serialPos = btnPayment.getAttribute("data-serial-pos"); // Capture serial
            const budgetAmount = btnPayment.getAttribute("data-budget-amount"); // Capture budget amount
            const razonSocial = btnPayment.getAttribute("data-razon-social");
            const rif = btnPayment.getAttribute("data-rif");
            const telefono = btnPayment.getAttribute("data-telefono");
            const estatusPos = btnPayment.getAttribute("data-estatus-pos");
            const hasPresupuesto = btnPayment.getAttribute("data-has-presupuesto");
            
            // Llamar a la función para abrir el modal (Patrón de Gestión Rosal)
            openModalPagoPresupuesto(nroTicket, ticketId, serialPos, budgetAmount, razonSocial, rif, telefono, estatusPos, hasPresupuesto);
            
            // Cargar el historial de pagos para este ticket
            loadPaymentHistory(nroTicket);
            
            // Cargar el monto total abonado
            loadTotalPaid(nroTicket, budgetAmount);
            
            return;
        }
    });

    const CerramodalBtn = document.getElementById("btnCerrarPagoPresupuesto");
    if (CerramodalBtn) {
        CerramodalBtn.addEventListener("click", function () {
            // El modal se cierra automáticamente por data-bs-dismiss="modal"
            // Pero podemos añadir limpieza adicional si fuera necesario.
            console.log("Cerrando modal de pago presupuesto...");
            resetDocumentoPagoUI();
        });
    }

    // LISTENER PARA EL INPUT DE DOCUMENTO DE PAGO
    const documentoPagoInput = document.getElementById("documentoPago");
    if (documentoPagoInput) {
        documentoPagoInput.addEventListener("change", function(e) {
            const fileNameDisplay = document.getElementById("fileNameDocumentoPago");
            const textDisplay = document.getElementById("textDocumentoPago");
            const iconDisplay = document.getElementById("iconDocumentoPago");
            const labelDisplay = document.getElementById("labelDocumentoPago");
            
            if (this.files && this.files.length > 0) {
                const file = this.files[0];
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = file.name;
                    fileNameDisplay.classList.remove("d-none");
                }
                if (textDisplay) textDisplay.classList.add("d-none");
                
                if (iconDisplay) {
                    iconDisplay.className = "fas fa-check-circle fa-2x text-success";
                }
                if (labelDisplay) {
                    labelDisplay.style.borderColor = "#28a745";
                    labelDisplay.style.backgroundColor = "#e8f5e9";
                }
            } else {
                resetDocumentoPagoUI();
            }
        });
    }

    function resetDocumentoPagoUI() {
        const input = document.getElementById("documentoPago");
        const fileNameDisplay = document.getElementById("fileNameDocumentoPago");
        const textDisplay = document.getElementById("textDocumentoPago");
        const iconDisplay = document.getElementById("iconDocumentoPago");
        const labelDisplay = document.getElementById("labelDocumentoPago");
        
        if (input) input.value = "";
        
        if (fileNameDisplay) {
            fileNameDisplay.textContent = "";
            fileNameDisplay.classList.add("d-none");
        }
        if (textDisplay) textDisplay.classList.remove("d-none");
        
        if (iconDisplay) {
            iconDisplay.className = "fas fa-camera fa-2x text-secondary";
        }
        if (labelDisplay) {
            labelDisplay.style.borderColor = "#cbd5e0"; 
            labelDisplay.style.backgroundColor = "#f8f9fa";
        }
    }

    // VALIDACION DE MONTO LIMITE (PRESUPUESTO)
    const btnGuardarPago = document.getElementById("btnGuardarPagoPresupuesto");
    if (btnGuardarPago) {
        btnGuardarPago.addEventListener("click", function(e) {
            // Obtenemos los valores globales actualizados por loadTotalPaid
            const totalPagado = window.currentTotalPaid || 0;
            const presupuestoTotal = window.currentBudgetAmount || 0;
            
            // Obtenemos el monto que intenta agregar el usuario (Monto REF en USD)
            const montoRefInput = document.getElementById("montoRef");
            let montoNuevo = 0;
            
            if (montoRefInput) {
                montoNuevo = parseFloat(montoRefInput.value) || 0;
            }
            
            // Validamos solo si tenemos un presupuesto definido mayor a 0
            if (presupuestoTotal > 0) {
                const nuevoTotal = totalPagado + montoNuevo;
                const excedente = nuevoTotal - presupuestoTotal;
                
                // Margen de error pequeño para flotantes (0.01)
                if (excedente > 0.01) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // Previene otros listeners de guardado
                    
                    Swal.fire({
                        title: 'Excede el Presupuesto',
                        html: `
                            <div class="text-start">
                                <p>No se puede agregar este pago porque excede el monto total del presupuesto.</p>
                                <ul style="list-style: none; padding: 0;">
                                    <li><strong>Presupuesto Total:</strong> $${presupuestoTotal.toFixed(2)}</li>
                                    <li><strong>Total Abonado:</strong> $${totalPagado.toFixed(2)}</li>
                                    <li><strong>Nuevo Pago:</strong> $${montoNuevo.toFixed(2)}</li>
                                    <hr>
                                    <li class="text-danger"><strong>Total Resultante:</strong> $${nuevoTotal.toFixed(2)}</li>
                                    <li class="text-danger"><strong>Excedente:</strong> $${excedente.toFixed(2)}</li>
                                </ul>
                            </div>
                        `,
                        icon: 'warning',
                        confirmButtonText: 'Entendido'
                    });
                    
                    return false;
                }
            }
            
            
            // Si pasa la validación, procedemos a enviar los datos
            console.log("Validación de presupuesto exitosa. Enviando pago...");
            
            // Recolectar datos
            const formData = new FormData();
            formData.append('action', 'InsertPaymentRecord');
            formData.append('nro_ticket', window.currentNroTicket || '');
            formData.append('serial_pos', window.currentSerialPos || '');
            
            const userId = document.getElementById('id_user_pago') ? document.getElementById('id_user_pago').value : '';
            formData.append('user_loader', userId);
            
            // Campos del formulario
            // Payment Method Select - Save NAME (text) not ID (value)
            const formaPagoElem = document.getElementById("formaPago");
            let paymentMethodText = '';
            if (formaPagoElem && formaPagoElem.selectedIndex >= 0 && formaPagoElem.value !== "") {
                paymentMethodText = formaPagoElem.options[formaPagoElem.selectedIndex].text;
            }
            formData.append('payment_method', paymentMethodText);
            
            const monedaElem = document.getElementById("moneda");
            formData.append('currency', monedaElem ? monedaElem.value.toUpperCase() : 'BS');
            
            const montoBsElem = document.getElementById("montoBs");
            formData.append('amount_bs', montoBsElem ? montoBsElem.value : '0');
            
            const montoRefElem = document.getElementById("montoRef");
            formData.append('reference_amount', montoRefElem ? montoRefElem.value : '0');
            
            const referenciaElem = document.getElementById("referencia");
            formData.append('payment_reference', referenciaElem ? referenciaElem.value : '');
            
            const fechaPagoElem = document.getElementById("fechaPago");
            formData.append('payment_date', fechaPagoElem ? fechaPagoElem.value : '');
            
            const depositanteElem = document.getElementById("depositante");
            formData.append('depositor', depositanteElem ? depositanteElem.value : '');
            
            const obsElem = document.getElementById("obsAdministracion");
            formData.append('observations', obsElem ? obsElem.value : '');
            
            const registroElem = document.getElementById("registro");
            formData.append('record_number', registroElem ? registroElem.value : '');
            
            // Bancos
            const bancoOrigenElem = document.getElementById("bancoOrigen");
            if (bancoOrigenElem && bancoOrigenElem.offsetParent !== null) {
                 formData.append('origen_bank', bancoOrigenElem.options[bancoOrigenElem.selectedIndex].text);
            }
            
            const bancoDestinoElem = document.getElementById("bancoDestino");
            if (bancoDestinoElem && bancoDestinoElem.offsetParent !== null) {
                 formData.append('destination_bank', bancoDestinoElem.options[bancoDestinoElem.selectedIndex].text);
            }
            
            // Pago Movil
            const origenRifTipo = document.getElementById("origenRifTipo");
            if(origenRifTipo) formData.append('origen_rif_tipo', origenRifTipo.value);
            
            const origenRifNumero = document.getElementById("origenRifNumero");
            if(origenRifNumero) formData.append('origen_rif_numero', origenRifNumero.value);
            
            const origenTelefono = document.getElementById("origenTelefono");
            if(origenTelefono) formData.append('origen_telefono', origenTelefono.value);
            
            const destinoRifTipo = document.getElementById("destinoRifTipo");
            if(destinoRifTipo) formData.append('destino_rif_tipo', destinoRifTipo.value);
            
            const destinoRifNumero = document.getElementById("destinoRifNumero");
            if(destinoRifNumero) formData.append('destino_rif_numero', destinoRifNumero.value);
            
            const destinoTelefono = document.getElementById("destinoTelefono");
            if(destinoTelefono) formData.append('destino_telefono', destinoTelefono.value);
            
            // Documento de Pago (Nuevo)
            const documentoPagoInput = document.getElementById('documentoPago');
            if (documentoPagoInput && documentoPagoInput.files.length > 0) {
                formData.append('payment_doc', documentoPagoInput.files[0]);
            }

            // --- FRONTEND VALIDATION (PREMIUM STYLE) ---
            let missingFieldsCreate = [];
            
            // 1. Payment Method
            if (!paymentMethodText || paymentMethodText.trim() === "" || paymentMethodText === "Seleccione") {
                missingFieldsCreate.push("Forma de Pago");
            }
            
            // 2. Currency
            if (!monedaElem || !monedaElem.value) {
                missingFieldsCreate.push("Moneda");
            }
            
            // 3. Amount (Check if at least one amount is provided)
            const valBs = montoBsElem ? parseFloat(montoBsElem.value) : 0;
            const valRef = montoRefElem ? parseFloat(montoRefElem.value) : 0;
            if (valBs <= 0 && valRef <= 0) {
                missingFieldsCreate.push("Monto (Bs o USD)");
            }
            
            // 4. Reference
            if (!referenciaElem || !referenciaElem.value.trim()) {
                missingFieldsCreate.push("Referencia");
            }
            
            // 5. Depositor
            if (!depositanteElem || !depositanteElem.value.trim()) {
                missingFieldsCreate.push("Depositante");
            }

            // 6. Documento de Pago (Mandatory)
            if (!documentoPagoInput || documentoPagoInput.files.length === 0) {
                missingFieldsCreate.push("Adjunte El Documento");
            }

            if (missingFieldsCreate.length > 0) {
                let errorHtml = '<ul style="text-align: left; margin-bottom: 0;">';
                missingFieldsCreate.forEach(field => {
                    errorHtml += `<li>${field}</li>`;
                });
                errorHtml += '</ul>';

                Swal.fire({
                    title: 'Campos Incompletos',
                    html: `Por favor complete los siguientes datos:<br>${errorHtml}`,
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    buttonsStyling: false,
                    customClass: {
                        popup: 'swal-premium-popup',
                        title: 'swal-premium-title',
                        confirmButton: 'swal-premium-confirm'
                    }
                });
                return; // STOP execution
            }
            
            // Enviar AJAX
            btnGuardarPago.disabled = true;
            btnGuardarPago.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Guardando...';
            
            fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/InsertPaymentRecord`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {

                    // --- LOGICA DE SUBIDA DE IMAGEN (INJECTED INTO FETCH) ---
                    console.log(">>> IMAGEN: Pago registrado. Verificando archivo para subir...");
                    const fileInput = document.getElementById("documentoPago");
                    
                    if (fileInput && fileInput.files.length > 0) {
                        console.log(">>> IMAGEN: Archivo detectado. Preparando subida...");
                        const file = fileInput.files[0];
                        const formDataImg = new FormData();
                        
                        // Acción NUEVA y DEDICADA
                        formDataImg.append("action", "UploadPaymentDoc"); 
                        // Intentar obtener Nro Ticket de varias fuentes
                        let nroTicketToSend = window.currentNroTicket || '';
                        if (!nroTicketToSend) {
                            const ticketSpan = document.getElementById("viewModalTicketId"); // Span en modal consultar
                            if (ticketSpan) nroTicketToSend = ticketSpan.textContent.trim();
                        }
                        if (!nroTicketToSend) {
                            const ticketNumeroSpan = document.getElementById("ticketNumeroPago"); // Span en modal pago presupuesto
                            if (ticketNumeroSpan) {
                                let parts = ticketNumeroSpan.textContent.split('#');
                                if (parts.length > 1) {
                                    nroTicketToSend = parts[1].trim();
                                } else {
                                     nroTicketToSend = ticketNumeroSpan.textContent.replace('Ticket #', '').trim();
                                }
                            }
                        }
                        
                        console.log(">>> DEBUG IMAGEN: nroTicketToSend final:", nroTicketToSend);
                        formDataImg.append("nro_ticket", nroTicketToSend);
                        
                        // Usar el valor STRING del input 'registro'
                        const registroElem = document.getElementById("registro");
                        const registroVal = registroElem ? registroElem.value : data.id_payment;
                        formDataImg.append("record_number", registroVal);
                       
                        const userId = document.getElementById('id_user_pago') ? document.getElementById('id_user_pago').value : '';
                        formDataImg.append("user_loader", userId);
                        formDataImg.append("payment_doc", file);

                        const xhrImg = new XMLHttpRequest();
                        const apiUrlImg = (typeof ENDPOINT_BASE !== 'undefined' ? ENDPOINT_BASE + APP_PATH : '') + "api/consulta/UploadPaymentDoc";
                        
                        xhrImg.open("POST", apiUrlImg, true);
                        
                        xhrImg.onload = function() {
                            if (xhrImg.status === 200) {
                                try {
                                    const dataImg = JSON.parse(xhrImg.responseText);
                                    if(dataImg.success) {
                                        console.log(">>> IMAGEN: Subida EXITOSA.");
                                    } else {
                                        console.warn(">>> IMAGEN: Error en respuesta:", dataImg.message);
                                    }
                                } catch(e) { 
                                    console.error(">>> IMAGEN: Error parseando respuesta", e); 
                                }
                            } else {
                                console.error(">>> IMAGEN: Error HTTP:", xhrImg.status);
                            }
                        };
                        xhrImg.send(formDataImg);
                    } else {
                        console.log(">>> IMAGEN: No se seleccionó archivo (input vacío).");
                    }
                    // ----------------------------------------------------

                    Swal.fire({
                        title: '¡Pago Registrado!',
                        html: `
                            <div style="text-align: center;">
                                <div style="font-size: 4rem; color: #28a745; margin-bottom: 15px;">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <h4 style="color: #333; font-weight: 600; margin-bottom: 10px;">Operación Exitosa</h4>
                                <p style="color: #666; font-size: 1.1rem;">El pago se ha procesado y guardado correctamente en el expediente.</p>
                            </div>
                        `,
                        icon: null, // Custom HTML icon used
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#28a745',
                        background: '#fff',
                        customClass: {
                            popup: 'rounded-4 shadow-lg',
                            confirmButton: 'px-4 py-2 rounded-3'
                        },
                        timer: 3000,
                        timerProgressBar: true
                    }).then(() => {
                        // Recargar historial y totales
                        loadPaymentHistory(window.currentNroTicket);
                        loadTotalPaid(window.currentNroTicket, window.currentBudgetAmount);
                        
                        // LIMPIAR SOLO DATOS VARIABLES DE LA TRANSACCIÓN
                        const inputsToClear = [
                            "montoBs", "montoRef", "referencia", 
                            "obsAdministracion", "registro", "documentoPago"
                        ];
                        inputsToClear.forEach(id => {
                            const el = document.getElementById(id);
                            if(el) el.value = "";
                        });

                        // Selects a default (Reiniciamos solo moneda, bancos de transferencia y forma de pago)
                        // MANTENEMOS: origenRifTipo, destinoRifTipo, origenBanco (datos constantes del cliente/empresa)
                        const selectsToReset = ["moneda", "bancoOrigen", "bancoDestino", "formaPago"];
                        selectsToReset.forEach(id => {
                            const el = document.getElementById(id);
                            if(el) el.selectedIndex = 0;
                        });

                        // Restaurar botón
                        btnGuardarPago.disabled = false;
                        btnGuardarPago.innerHTML = '<i class="fas fa-save me-2"></i>Guardar Pago';
                        resetDocumentoPagoUI(); // Resetear UI del archivo
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'Error al guardar el pago.'
                    });
                    btnGuardarPago.disabled = false;
                    btnGuardarPago.innerHTML = '<i class="fas fa-save me-2"></i>Guardar Pago';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Red',
                    text: 'Hubo un problema al conectar con el servidor.'
                });
                btnGuardarPago.disabled = false;
                btnGuardarPago.innerHTML = '<i class="fas fa-save me-2"></i>Guardar Pago';
            });
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

      // 5. Botón Ver Presupuesto (Directo) - Nuevo Requerimiento
    const btnVerPresupuesto = document.getElementById("btnVerPresupuestoModal");
    if (btnVerPresupuesto) {
        btnVerPresupuesto.addEventListener("click", function(e) {
             e.preventDefault();
             e.stopPropagation();
             
             if (!currentTicketNro) {
                 Swal.fire("Error", "No se ha identificado el número de ticket.", "error");
                 return;
             }

             // Configurar globales para el visualizador (necesario para showViewModal)
             currentTicketNroForImage = currentTicketNro;
             currentTicketIdForImage = currentTicketId;

             // Fetch directo del documento tipo 'presupuesto'
             // Reutilizamos la lógica de GetDocumentByType
             fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetDocumentByType`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body: `action=GetDocumentByType&ticketId=${currentTicketNro}&documentType=presupuesto`
             })
             .then(response => response.json())
             .then(data => {
                  if (data.success) {
                       const document = data.document;
                       const filePath = document.file_path;
                       const mimeType = document.mime_type;
                       const fileName = document.original_filename;
                       
                       if (mimeType.startsWith('image/')) {
                            showViewModal(currentTicketIdForImage, currentTicketNroForImage, filePath, null, fileName, false);
                       } else if (mimeType === 'application/pdf') {
                            showViewModal(currentTicketIdForImage, currentTicketNroForImage, null, filePath, fileName, false);
                       } else {
                            Swal.fire("Aviso", "Tipo de documento no soportado para visualización directa.", "warning");
                       }
                  } else {
                       Swal.fire({
                            icon: 'warning',
                            title: 'Aviso',
                            text: `No se encontró documento de presupuesto: ${data.message || ''}`,
                            confirmButtonColor: '#003594'
                       });
                  }
             })
             .catch(error => {
                  console.error('Error fetching budget:', error);
                  Swal.fire("Error", "Error al obtener el documento.", "error");
             });
        });
    }

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

    // 4. Guardar Pago
    const btnGuardarPago = document.getElementById("btnGuardarPagoPresupuesto");
    if (btnGuardarPago) {
        btnGuardarPago.addEventListener("click", function(e) {
             e.preventDefault();
             e.stopPropagation();
             savePayment();
        });
    }

});

/**
 * Función para abrir el modal de pago de presupuesto (Patrón Gestión Rosal)
 * @param {string} nroTicket - El número de ticket
 * @param {string} ticketId - El ID del ticket
 * @param {string} serialPos - El Serial del POS (opcional)
 * @param {string} budgetAmount - El Monto del Presupuesto (opcional)
 * @param {string} razonSocial - Razón Social del Cliente (opcional)
 * @param {string} rif - RIF del Cliente (opcional)
 * @param {string} telefono - Teléfono del Cliente (opcional)
 */
/**
 * Función para abrir el modal de pago de presupuesto (Patrón Gestión Rosal)
 * @param {string} nroTicket - El número de ticket
 * @param {string} ticketId - El ID del ticket
 * @param {string} serialPos - El Serial del POS (opcional)
 * @param {string} budgetAmount - El Monto del Presupuesto (opcional)
 * @param {string} razonSocial - Razón Social del Cliente (opcional)
 * @param {string} rif - RIF del Cliente (opcional)
 * @param {string} telefono - Teléfono del Cliente (opcional)
 * @param {string} estatusPos - Estatus del POS (opcional)
 * @param {string} hasPresupuesto - Si tiene presupuesto ('Si'/'No')
 */
function openModalPagoPresupuesto(nroTicket, ticketId, serialPos, budgetAmount, razonSocial, rif, telefono, estatusPos, hasPresupuesto) {
    currentTicketId = ticketId;
    currentTicketNro = nroTicket;

    // Limpiar formulario y resetear estado visual
    const formPago = document.getElementById("formPagoPresupuesto");
    if(formPago) formPago.reset();

    // Validar razonSocial
    if (!razonSocial || razonSocial === "undefined" || razonSocial === "null") {
        razonSocial = "";
    }
    // Validar rif
    if (!rif || rif === "undefined" || rif === "null") {
        rif = "";
    }
    // Validar telefono
    if (!telefono || telefono === "undefined" || telefono === "null") {
        telefono = "";
    }
    // Validar estatusPos
    if (!estatusPos || estatusPos === "undefined" || estatusPos === "null") {
        estatusPos = "No disponible";
    }

    // --- VISIBILITY LOGIC FOR EXTRA DOCUMENT BUTTON ---
    const containerExtra = document.querySelector(".container-extra");
    if (containerExtra) {
        if (hasPresupuesto === 'Si' || hasPresupuesto === 'Sí') {
            containerExtra.style.display = 'block';
        } else {
            containerExtra.style.display = 'none';
        }
    }

    // --- POPULATE BLOCK 1: CLIENT INFO ---
    const displayRazonSocial = document.getElementById("displayRazonSocial");
    if(displayRazonSocial) displayRazonSocial.value = razonSocial;

    const displayRif = document.getElementById("displayRif");
    if(displayRif) displayRif.value = rif;

    const displaySerialPos = document.getElementById("serialPosPago");
    if(displaySerialPos) displaySerialPos.value = serialPos || "No disponible";

    const displayEstatusPos = document.getElementById("displayEstatusPos");
    if(displayEstatusPos) displayEstatusPos.value = estatusPos;

    // --- POPULATE BLOCK 2: PAYMENT INFO ---
    
    // Depositante (defaults to Client Name)
    const depositanteInput = document.getElementById("depositante");
    if (depositanteInput) {
         depositanteInput.value = razonSocial;
    }
    
    // RIF Field (Banking Details - Hidden by default but good to pre-fill)
    const origenRifNumero = document.getElementById("origenRifNumero");
    if (origenRifNumero && rif) {
        // Attempt to split Type and Number if possible
        const parts = rif.split('-');
        if (parts.length > 1) {
             const typeSelect = document.getElementById("origenRifTipo");
             if(typeSelect) typeSelect.value = parts[0];
             origenRifNumero.value = parts[1];
        } else {
             origenRifNumero.value = rif;
        }
    }

    const origenTelefono = document.getElementById("origenTelefono");
    if (origenTelefono && telefono) {
        origenTelefono.value = telefono;
    }

    // Fecha Carga (Auto-set to Today)
    const fechaCargaInput = document.getElementById("fechaCarga");
    if(fechaCargaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaCargaInput.value = today;
    }


    // Robust Parsing and Logging
    console.log("openModalPagoPresupuesto called. raw budgetAmount:", budgetAmount);
    if (budgetAmount) {
        // Remove currency symbols, handle comma decimals
        let cleanAmount = budgetAmount.toString().replace('$', '').replace(/\s/g, ''); 
        // If it uses comma for decimal, replace (e.g. 10,50 -> 10.50)
        if (cleanAmount.includes(',') && !cleanAmount.includes('.')) {
             cleanAmount = cleanAmount.replace(',', '.');
        }
        currentBudgetAmount = parseFloat(cleanAmount);
        console.log("Parsed currentBudgetAmount:", currentBudgetAmount);
        
        // Store context globally for save handler
        window.currentNroTicket = nroTicket;
        window.currentSerialPos = serialPos;
        
        // Populate inputs
        const montoRefInput = document.getElementById("montoRef");
        if(montoRefInput) montoRefInput.value = currentBudgetAmount.toFixed(2);
        
        // DEFAULT CURRENCY TO USD (force calculation)
        const monedaSelect = document.getElementById("moneda");
        if (monedaSelect) {
            monedaSelect.value = "usd";
            // Trigger calculation immediately if possible
             if (typeof handleCurrencyChange === 'function') {
                 handleCurrencyChange();
             }
        }
        
        // Reset suffixes
        const montoBsSuffix = document.getElementById("montoBsSuffix");
        if(montoBsSuffix) montoBsSuffix.style.display = "none";
        const montoRefSuffix = document.getElementById("montoRefSuffix");
        if(montoRefSuffix) montoRefSuffix.style.display = "none";
        
    } else {
        currentBudgetAmount = null;
        console.log("currentBudgetAmount set to null");
    }


    // Pre-populate Budget Amount
    if (budgetAmount) {
        const montoRefInput = document.getElementById("montoRef");
        if (montoRefInput) {
            montoRefInput.value = parseFloat(budgetAmount).toFixed(2);
            // Trigger calculation for BS if needed
             // Dispatch input event to trigger listeners (e.g., calculateUsdToBs, updateMontoEquipo)
            montoRefInput.dispatchEvent(new Event('input'));
        }
        // Force update of the display just in case
        const montoEquipoElement = document.getElementById("montoEquipo");
        if (montoEquipoElement) {
             montoEquipoElement.textContent = "$" + parseFloat(budgetAmount).toFixed(2);
        }
    } else {
        // Clear if no budget amount
        const montoEquipoElement = document.getElementById("montoEquipo");
        if (montoEquipoElement) {
             montoEquipoElement.textContent = "$0.00";
        }
    }
    
    // Header Info
    // Update the ticket badge in the new header structure
    const ticketHeader = document.getElementById("ticketNumeroPago");
    if(ticketHeader) ticketHeader.textContent = "Ticket #" + nroTicket;

    
    // Fecha Pago Default (Hoy)
    const inputFecha = document.getElementById("fechaPago");
    if(inputFecha) {
         const today = new Date().toISOString().split('T')[0];
         inputFecha.value = today;
         loadExchangeRateToday(today);
    }
    
    // Reset visual state (Hide dynamic fields)
    const bancoContainer = document.getElementById("bancoFieldsContainer");
    if(bancoContainer) bancoContainer.style.display = 'none';
    
    const pagoMovilContainer = document.getElementById("pagoMovilFieldsContainer");
    if(pagoMovilContainer) pagoMovilContainer.style.display = 'none';
    
    const monedaSelect = document.getElementById("moneda");
    if(monedaSelect) {
         monedaSelect.removeAttribute("disabled");
         monedaSelect.value = ""; // Force reset selection
    }
    
    // Ensure both amount fields are disabled on modal open
    const montoBsInput = document.getElementById("montoBs");
    const montoRefInput = document.getElementById("montoRef");
    if(montoBsInput) {
        montoBsInput.disabled = true;
        montoBsInput.style.backgroundColor = "#e9ecef";
        montoBsInput.style.cursor = "not-allowed";
    }
    if(montoRefInput) {
        montoRefInput.disabled = true;
        montoRefInput.style.backgroundColor = "#e9ecef";
        montoRefInput.style.cursor = "not-allowed";
    }
    
    // Cargar métodos de pago y bancos
    loadPaymentMethods();
    loadBancos();

    // Set globals for image viewer if needed
    currentTicketNroForImage = nroTicket;
    currentIdTicketForImage = ticketId;

    // Cargar el estatus del pago
    getPagoEstatus(nroTicket);

    // Mostrar el modal usando la instancia global
    if (modalPagoPresupuestoInstance) {
        modalPagoPresupuestoInstance.show();
    } else {
        console.error("Instancia de modalPagoPresupuestoInstance no inicializada.");
        // Fallback
        const modalEl = document.getElementById("modalPagoPresupuesto");
        if(modalEl) {
             const manualModal = new bootstrap.Modal(modalEl);
             manualModal.show();
        }
    }
}

/**
 * Obtiene el estatus del pago basado en el número de ticket.
 * @param {string} nroTicket - El número de ticket para consultar el estatus.
 */
function getPagoEstatus(nroTicket) {
    const estatusInput = document.getElementById("estatus");
    const paymentIdInput = document.getElementById("payment_id_to_save");

    if (!estatusInput || !paymentIdInput) {
        console.error("DEBUG getPagoEstatus: Elementos necesarios no encontrados.");
        return;
    }

    // Estado inicial de carga
    estatusInput.value = "Cargando estatus...";
    paymentIdInput.value = "";

    // console.log("DEBUG getPagoEstatus: Solicitando para Ticket:", nroTicket);

    const xhr = new XMLHttpRequest();
    // Reutilizamos el endpoint existente en consultaApi
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetEstatusPagoAutomatizado`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        // console.log("DEBUG getPagoEstatus: Respuesta recibida. Status:", xhr.status);
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                // console.log("DEBUG getPagoEstatus: Data parsed:", response);
                
                const responseData = response.estatus_pago || response.data;
                
                if (response.success && Array.isArray(responseData) && responseData.length > 0) {
                    const pagoData = responseData[0];
                    
                    paymentIdInput.value = pagoData.id_status_payment;
                    estatusInput.value = pagoData.name_status_payment;
                    
                    // console.log("DEBUG getPagoEstatus: Estatus asignado:", pagoData.name_status_payment);
                } else {
                    estatusInput.value = 'Pendiente por pagar';
                    paymentIdInput.value = "7"; // Status 7 por defecto
                    console.warn("DEBUG getPagoEstatus: Sin datos o formato incorrecto. Response:", response);
                }
            } catch (error) {
                console.error("DEBUG getPagoEstatus: Error processing JSON or data:", error, xhr.responseText);
                estatusInput.value = 'Error de procesamiento.';
            }
        } else {
            estatusInput.value = `Error (HTTP ${xhr.status})`;
        }
    };

    xhr.onerror = function() {
        console.error("DEBUG getPagoEstatus: Error de red");
        estatusInput.value = "Error de red";
    };

    const datos = `action=GetEstatusPagoAutomatizado&nro_ticket=${encodeURIComponent(nroTicket || "")}`;
    xhr.send(datos);
}

/**
 * Carga el historial de pagos para un ticket específico.
 * @param {string} nroTicket - Número de ticket
 */
function loadPaymentHistory(nroTicket) {
    const tableBody = document.getElementById("paymentHistoryBody");
    
    if (!tableBody) {
        console.error("DEBUG loadPaymentHistory: Elemento paymentHistoryBody no encontrado.");
        return;
    }

    // Show loading state
    tableBody.innerHTML = `
        <tr>
            <td colspan="10" class="text-center text-muted" style="padding: 20px;">
                <i class="fas fa-spinner fa-spin me-1"></i>Cargando historial...
            </td>
        </tr>
    `;

    // console.log("DEBUG loadPaymentHistory: Solicitando historial para Ticket:", nroTicket);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPaymentsByTicket`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        // console.log("DEBUG loadPaymentHistory: Respuesta recibida. Status:", xhr.status);
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                // console.log("DEBUG loadPaymentHistory: Data parsed:", response);
                
                if (response.success && Array.isArray(response.payments) && response.payments.length > 0) {
                    let rows = '';
                    response.payments.forEach((payment, index) => {
                        // Format date
                        const paymentDate = payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('es-VE') : 'N/A';
                        
                        // Format amounts
                        const amountBs = payment.amount_bs ? parseFloat(payment.amount_bs).toFixed(2) : '0.00';
                        const refAmount = payment.reference_amount ? parseFloat(payment.reference_amount).toFixed(2) : '0.00';
                        
                        // Check confirmation status
                        const rawConf = payment.confirmation_number;
                        console.log("DEBUG Payment ID " + payment.id_payment_record + " ConfNum:", rawConf, "Type:", typeof rawConf);
                        
                        // Postgres might return 't'/'f' or boolean. Check for truthy confirmed state.
                        // Postgres might return 't'/'f' or boolean. Check for truthy confirmed state.
                        let isConfirmed = (rawConf === true || rawConf === 't' || rawConf === 'true' || rawConf === 1 || rawConf === '1');
                        if (rawConf === 'f' || rawConf === 'false') {
                            isConfirmed = false;
                        }
                        
                        let actionBtn = '';
                        const viewIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
</svg>`;

                        // ALWAYS show the view button as requested by the user icon
                        // Now using data from SQL JOIN (no extra AJAX needed)
                        // CRITICAL: Normalize slashes HERE to prevent backslashes from being treated as escapes in onclick
                        const receiptPath = (payment.receipt_path || '').replace(/\\/g, '/');
                        const receiptMime = payment.receipt_mime || '';
                        const receiptName = payment.receipt_name || 'Comprobante';
                        
                        actionBtn += `<button type="button" class="btn btn-sm btn-link text-success p-0 m-0 me-2" onclick="viewPaymentReceipt('${receiptPath}', '${receiptMime}', '${receiptName}', '${payment.record_number}')" title="Ver Comprobante">${viewIcon}</button>`;

                        if (!isConfirmed) {
                             // Use type="button" to prevent form submission behavior
                             const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg>`;
                             actionBtn += `<button type="button" class="btn btn-sm btn-link text-primary p-0 m-0" onclick="editPayment('${payment.record_number}')" title="Editar Pago">${editIcon}</button>`;
                        }
                        
                        rows += `
                            <tr>
                                <td style="padding: 8px;">${index + 1}</td>
                                <td style="padding: 8px;">${payment.record_number || 'N/A'}</td>
                                <td style="padding: 8px;">${paymentDate}</td>
                                <td style="padding: 8px;">${payment.payment_method || 'N/A'}</td>
                                <td style="padding: 8px;">${payment.currency || 'N/A'}</td>
                                <td style="padding: 8px;">${amountBs}</td>
                                <td style="padding: 8px;">${refAmount}</td>
                                <td style="padding: 8px;">${payment.payment_reference || 'N/A'}</td>
                                <td style="padding: 8px;">${payment.depositor || 'N/A'}</td>
                                <td style="padding: 8px; text-align: center;">${actionBtn}</td>
                            </tr>
                        `;
                    });
                    tableBody.innerHTML = rows;
                    console.log("DEBUG loadPaymentHistory: Tabla poblada con", response.payments.length, "registros.");
                } else {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="10" class="text-center text-muted" style="padding: 20px;">
                                <i class="fas fa-info-circle me-1"></i>No hay pagos registrados
                            </td>
                        </tr>
                    `;
                    console.log("DEBUG loadPaymentHistory: Sin datos de pagos.");
                }
            } catch (error) {
                console.error("DEBUG loadPaymentHistory: Error processing JSON:", error, xhr.responseText);
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="10" class="text-center text-danger" style="padding: 20px;">
                            <i class="fas fa-exclamation-triangle me-1"></i>Error al procesar datos
                        </td>
                    </tr>
                `;
            }
        } else {
            console.error("DEBUG loadPaymentHistory: Error HTTP", xhr.status);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center text-danger" style="padding: 20px;">
                        <i class="fas fa-exclamation-triangle me-1"></i>Error al cargar historial (HTTP ${xhr.status})
                    </td>
                </tr>
            `;
        }
    };

    xhr.onerror = function() {
        console.error("DEBUG loadPaymentHistory: Error de red");
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-danger" style="padding: 20px;">
                    <i class="fas fa-exclamation-triangle me-1"></i>Error de red
                </td>
            </tr>
        `;
    };

    const datos = `action=GetPaymentsByTicket&nro_ticket=${encodeURIComponent(nroTicket || "")}`;
    xhr.send(datos);
}

/**
 * Carga el monto total abonado para un ticket específico.
 * @param {string} nroTicket - Número de ticket
 * @param {number} budgetAmount - Monto del presupuesto
 */
function loadTotalPaid(nroTicket, budgetAmount) {
    const montoAbonadoElement = document.getElementById("montoAbonado");
    const montoRestanteElement = document.getElementById("montoRestante");
    
    if (!montoAbonadoElement || !montoRestanteElement) {
        console.error("DEBUG loadTotalPaid: Elementos no encontrados.");
        return;
    }

    // Show loading state
    montoAbonadoElement.textContent = "Cargando...";
    montoRestanteElement.textContent = "Calculando...";

    console.log("DEBUG loadTotalPaid: Solicitando total para Ticket:", nroTicket);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTotalPaidByTicket`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        console.log("DEBUG loadTotalPaid: Respuesta recibida. Status:", xhr.status);
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                console.log("DEBUG loadTotalPaid: Data parsed:", response);
                
                if (response.success) {
                    const totalPaid = parseFloat(response.total_paid) || 0;
                    const totalBudget = parseFloat(response.total_budget) || 0;
                    
                    // If total budget is 0, fallback to passed parameter (though API should return it)
                    const budgetToUse = totalBudget > 0 ? totalBudget : (parseFloat(budgetAmount) || 0);
                    
                    const remaining = Math.max(0, budgetToUse - totalPaid);
                    
                    // Store in global variable for validation
                    window.currentTotalPaid = totalPaid;
                    window.currentBudgetAmount = budgetToUse;
                    
                    // Update display
                    montoAbonadoElement.textContent = `$${totalPaid.toFixed(2)}`;
                    montoRestanteElement.textContent = `Restante: $${remaining.toFixed(2)}`;
                    
                    // Button control logic
                    const btnGuardarPago = document.getElementById("btnGuardarPagoPresupuesto");
                    if (btnGuardarPago) {
                        // Only block if budget is set (>0) AND remaining is 0 or less
                        if (budgetToUse > 0 && remaining <= 0.00) {
                            btnGuardarPago.disabled = true;
                            btnGuardarPago.innerHTML = '<i class="fas fa-check-circle me-2"></i>Pagado Completo';
                            btnGuardarPago.classList.remove('btn-primary');
                            btnGuardarPago.classList.add('btn-secondary');
                            btnGuardarPago.style.background = '#6c757d'; // Force gray override
                        } else {
                            btnGuardarPago.disabled = false;
                            btnGuardarPago.innerHTML = '<i class="fas fa-save me-2"></i>Guardar Pago';
                            btnGuardarPago.classList.add('btn-primary');
                            btnGuardarPago.classList.remove('btn-secondary');
                            btnGuardarPago.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }
                    }
                    
                    console.log("DEBUG loadTotalPaid: Total Abonado:", totalPaid, "Presupuesto Total:", budgetToUse, "Restante:", remaining);
                } else {
                    montoAbonadoElement.textContent = "$0.00";
                    montoRestanteElement.textContent = `Restante: $${(parseFloat(budgetAmount) || 0).toFixed(2)}`;
                    console.warn("DEBUG loadTotalPaid: Response no exitosa:", response);
                }
            } catch (error) {
                console.error("DEBUG loadTotalPaid: Error processing JSON:", error, xhr.responseText);
                montoAbonadoElement.textContent = "Error";
                montoRestanteElement.textContent = "Error";
            }
        } else {
            console.error("DEBUG loadTotalPaid: Error HTTP", xhr.status);
            montoAbonadoElement.textContent = "Error";
            montoRestanteElement.textContent = "Error";
        }
    };

    xhr.onerror = function() {
        console.error("DEBUG loadTotalPaid: Error de red");
        montoAbonadoElement.textContent = "Error de red";
        montoRestanteElement.textContent = "Error de red";
    };

    const datos = `action=GetTotalPaidByTicket&nro_ticket=${encodeURIComponent(nroTicket || "")}`;
    xhr.send(datos);
}

// =================================================================================
// FUNCONALIDAD DE PAGO AVANZADA (PORTADA DE CONSULTA_RIF)
// =================================================================================

function loadPaymentMethods() {
    const formaPagoSelect = document.getElementById("formaPago");
    if (!formaPagoSelect) return;
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") return;

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetPaymentMethods";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success && data.payment_methods && data.payment_methods.length > 0) {
            formaPagoSelect.innerHTML = '<option value="">Seleccione</option>';
            data.payment_methods.forEach(function(method) {
              const option = document.createElement("option");
              option.value = method.id_payment_method;
              option.textContent = method.payment_method_name;
              option.setAttribute("data-id", method.id_payment_method);
              formaPagoSelect.appendChild(option);
            });
            setTimeout(function() { setupFormaPagoListener(); }, 100);
          }
        } catch (error) {}
      }
    };
    xhr.send();
}

function loadBancos() {
    const bancoOrigenSelect = document.getElementById("bancoOrigen");
    const bancoDestinoSelect = document.getElementById("bancoDestino");
    if (!bancoOrigenSelect || !bancoDestinoSelect) return;
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") return;

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetBancos";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success && data.bancos && data.bancos.length > 0) {
            bancoOrigenSelect.innerHTML = '<option value="">Seleccione</option>';
            bancoDestinoSelect.innerHTML = '<option value="">Seleccione</option>';
            data.bancos.forEach(function(banco) {
              const optionOrigen = document.createElement("option");
              optionOrigen.value = banco.codigobanco;
              optionOrigen.textContent = banco.ibp;
              bancoOrigenSelect.appendChild(optionOrigen);

              const optionDestino = document.createElement("option");
              optionDestino.value = banco.codigobanco;
              optionDestino.textContent = banco.ibp;
              bancoDestinoSelect.appendChild(optionDestino);
            });
          }
        } catch (error) {}
      }
    };
    xhr.send();
}

let exchangeRate = null;

function loadExchangeRate() {
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") return;
    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRate";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success && data.exchange_rate && data.exchange_rate.tasa_dolar) {
            exchangeRate = parseFloat(data.exchange_rate.tasa_dolar);
          } else {
            exchangeRate = null;
          }
        } catch (error) { exchangeRate = null; }
      }
    };
    xhr.send();
}

function loadExchangeRateToday(fecha = null) {
    if (!fecha) {
      const fechaPagoInput = document.getElementById("fechaPago");
      if (fechaPagoInput && fechaPagoInput.value) {
        fecha = fechaPagoInput.value;
      }
    }
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") return;

    let apiUrl;
    let dataToSend;
    if (fecha) {
      apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateByDate";
      dataToSend = "action=GetExchangeRateByDate&fecha=" + encodeURIComponent(fecha);
    } else {
      apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateToday";
      dataToSend = null;
    }
    
    const tasaDisplayValue = document.getElementById("tasaDisplayValue");
    const fechaTasaDisplay = document.getElementById("fechaTasaDisplay");
    
    if (tasaDisplayValue) tasaDisplayValue.textContent = "Cargando Tasa...";

    if (tasaDisplayValue) tasaDisplayValue.textContent = "Cargando Tasa...";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          console.log("loadExchangeRateToday response:", data); // DEBUG
          if (data.success && data.exchange_rate) {
            const tasaValue = data.exchange_rate.tasa_dolar || null;
            if (tasaValue !== null) {
               const tasa = parseFloat(tasaValue);
               if (!isNaN(tasa)) {
                 exchangeRate = tasa;
                 console.log("Exchange Rate set to:", exchangeRate); // DEBUG
                 if (tasaDisplayValue) tasaDisplayValue.textContent = "Bs. " + tasa.toFixed(2);
                 
                 // TRIGGER UPDATE IF MODAL OPEN
                 if (currentBudgetAmount !== null) { // Only if we have a budget loaded
                     console.log("Triggering handleCurrencyChange from loadExchangeRateToday");
                     handleCurrencyChange(); 
                 }
               }
            }
            if (fechaTasaDisplay) {
               fechaTasaDisplay.innerHTML = '<i class="fas fa-calendar-day me-1"></i>Tasa: ' + (fecha ? formatDateToDDMMYYYY(fecha) : formatDateToDDMMYYYY(new Date()));
            }
          } else {
             if (tasaDisplayValue) tasaDisplayValue.textContent = "No disponible";
          }
        } catch (error) { 
            console.error("Error parsing exchange rate:", error);
            if (tasaDisplayValue) tasaDisplayValue.textContent = "Error"; 
        }
      }
    };
    xhr.send(dataToSend);
}

window.loadExchangeRateToday = loadExchangeRateToday;

function formatDateToDDMMYYYY(fecha) {
    if (!fecha) return '';
    if (typeof fecha === 'string' && fecha.includes('-')) {
      const partes = fecha.split('-');
      if (partes.length === 3) return partes[2] + '/' + partes[1] + '/' + partes[0];
    }
    if (fecha instanceof Date) {
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      return dia + '/' + mes + '/' + año;
    }
    return fecha;
}

function handleCurrencyChange() {
    const monedaSelect = document.getElementById("moneda");
    const montoBsInput = document.getElementById("montoBs");
    const montoRefInput = document.getElementById("montoRef");
    if (!monedaSelect || !montoBsInput || !montoRefInput) return;

    const selectedCurrency = monedaSelect.value;
    
    // DEBUG LOG
    console.log("handleCurrencyChange run. Currency:", selectedCurrency, "Budget:", currentBudgetAmount, "Rate:", exchangeRate);

    // Remove listeners
    montoBsInput.removeEventListener("input", calculateBsToUsd);
    montoBsInput.removeEventListener("keyup", calculateBsToUsd);
    montoBsInput.removeEventListener("blur", formatBsDecimal);
    montoBsInput.removeEventListener("input", calculateUsdToBs);
    montoBsInput.removeEventListener("keyup", calculateUsdToBs);
    montoRefInput.removeEventListener("input", calculateBsToUsd);
    montoRefInput.removeEventListener("keyup", calculateBsToUsd);
    montoRefInput.removeEventListener("input", calculateUsdToBs);
    montoRefInput.removeEventListener("keyup", calculateUsdToBs);
    montoRefInput.removeEventListener("blur", formatUsdDecimal);

    if (selectedCurrency === "bs") {
      montoBsInput.removeAttribute("disabled");
      montoBsInput.required = true;
      montoBsInput.style.backgroundColor = "#fff";
      montoRefInput.setAttribute("disabled", "disabled");
      
      // LOGIC FOR BUDGET PRE-FILL
      if (currentBudgetAmount > 0 && exchangeRate > 0) {
          montoBsInput.value = (currentBudgetAmount * exchangeRate).toFixed(2);
          montoRefInput.value = currentBudgetAmount.toFixed(2); // Keep reference
      } else {
          montoRefInput.value = "";
      }
      
      montoRefInput.style.backgroundColor = "#e9ecef";
      
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      if(montoBsSuffix) montoBsSuffix.style.display = "block";
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      if(montoRefSuffix) montoRefSuffix.style.display = "none";

      montoBsInput.addEventListener("input", calculateBsToUsd);
      montoBsInput.addEventListener("keyup", calculateBsToUsd);
      montoBsInput.addEventListener("blur", formatBsDecimal);
      
      // Update equipo amount listener for calculated REF
      montoRefInput.addEventListener("change", updateMontoEquipo); // Monitor hidden change? 
      // Actually calculateBsToUsd updates the value, so we should call updateMontoEquipo inside it.
      
      updateMontoEquipo();

    } else if (selectedCurrency === "usd") {
      montoBsInput.setAttribute("disabled", "disabled");
      
      // LOGIC FOR BUDGET PRE-FILL
      if (currentBudgetAmount > 0 && exchangeRate > 0) {
          montoRefInput.value = currentBudgetAmount.toFixed(2);
          montoBsInput.value = (currentBudgetAmount * exchangeRate).toFixed(2); // Show calculated BS
      } else {
          montoBsInput.value = "";
      }
      
      montoBsInput.style.backgroundColor = "#e9ecef";
      montoRefInput.removeAttribute("disabled");
      montoRefInput.required = true;
      montoRefInput.style.backgroundColor = "#fff";
      
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      if(montoBsSuffix) montoBsSuffix.style.display = "none";
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      if(montoRefSuffix) montoRefSuffix.style.display = "block";

      montoRefInput.addEventListener("input", calculateUsdToBs);
      montoRefInput.addEventListener("keyup", calculateUsdToBs);
      montoRefInput.addEventListener("blur", formatUsdDecimal);
      
      // Update equipo amount listener for direct input
      montoRefInput.addEventListener("input", updateMontoEquipo);
      montoRefInput.addEventListener("keyup", updateMontoEquipo);
      
      updateMontoEquipo();

    } else {
      montoBsInput.setAttribute("disabled", "disabled");
      montoRefInput.setAttribute("disabled", "disabled");
    }
}

function calculateBsToUsd() {
    const montoBsInput = document.getElementById("montoBs");
    const montoRefInput = document.getElementById("montoRef");
    const fechaPago = document.getElementById("fechaPago");
    
    if (!exchangeRate) {
      if(fechaPago) loadExchangeRateToday(fechaPago.value);
      setTimeout(function() { if (exchangeRate) calculateBsToUsd(); }, 500);
      return;
    }
    const montoBs = parseFloat(montoBsInput.value) || 0;
    if (montoBs > 0 && exchangeRate > 0) {
      montoRefInput.value = (montoBs / exchangeRate).toFixed(2);
      
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      if(montoRefSuffix) { montoRefSuffix.style.display = "block"; montoRefSuffix.textContent = "USD"; }
      
      updateMontoEquipo();
    } else {
      montoRefInput.value = "";
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      if(montoRefSuffix) { montoRefSuffix.style.display = "none"; } // Hide suffix if no value
      updateMontoEquipo();
    }
}

function calculateUsdToBs() {
    const montoBsInput = document.getElementById("montoBs");
    const montoRefInput = document.getElementById("montoRef");
    const fechaPago = document.getElementById("fechaPago");

    if (!exchangeRate) {
      if(fechaPago) loadExchangeRateToday(fechaPago.value); 
      setTimeout(function() { if (exchangeRate) calculateUsdToBs(); }, 500);
      return;
    }
    const montoUsd = parseFloat(montoRefInput.value) || 0;
    if (montoUsd > 0 && exchangeRate > 0) {
      montoBsInput.value = (montoUsd * exchangeRate).toFixed(2);
      
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      if(montoBsSuffix) { montoBsSuffix.style.display = "block"; montoBsSuffix.textContent = "Bs"; }
      
      updateMontoEquipo();
    } else {
      montoBsInput.value = "";
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      if(montoBsSuffix) { montoBsSuffix.style.display = "none"; } // Hide suffix if no value
      updateMontoEquipo();
    }
}

function formatBsDecimal() {
    const input = document.getElementById("montoBs");
    if (input && input.value) {
        const val = parseFloat(input.value);
        if (!isNaN(val)) input.value = val.toFixed(2);
    }
}
function formatUsdDecimal() {
    const input = document.getElementById("montoRef");
    if (input && input.value) {
        const val = parseFloat(input.value);
        if (!isNaN(val)) input.value = val.toFixed(2);
    }
}

function updateMontoEquipo() {
    const montoRefInput = document.getElementById("montoRef");
    const montoEquipoElement = document.getElementById("montoEquipo");
    
    if (!montoRefInput || !montoEquipoElement) {
      return;
    }

    const montoUsd = parseFloat(montoRefInput.value) || 0;
    if (montoUsd > 0) {
      montoEquipoElement.textContent = "$" + montoUsd.toFixed(2);
    } else {
      montoEquipoElement.textContent = "$0.00";
    }
}

function setupCurrencyListener() {
    const monedaSelect = document.getElementById("moneda");
    if(monedaSelect) {
        monedaSelect.removeEventListener("change", handleCurrencyChange);
        monedaSelect.addEventListener("change", handleCurrencyChange);
    }
}

function setupFormaPagoListener() {
    const formaPagoSelect = document.getElementById("formaPago");
    if(formaPagoSelect) {
        formaPagoSelect.removeEventListener("change", handleFormaPagoChange);
        formaPagoSelect.addEventListener("change", handleFormaPagoChange);
    }
}

function handleFormaPagoChange() {
    const formaPagoSelect = document.getElementById("formaPago");
    const monedaSelect = document.getElementById("moneda");
    const bancoFieldsContainer = document.getElementById("bancoFieldsContainer");
    const bancoOrigen = document.getElementById("bancoOrigen");
    const bancoDestino = document.getElementById("bancoDestino");
    const pagoMovilFieldsContainer = document.getElementById("pagoMovilFieldsContainer");

    if (!formaPagoSelect || !monedaSelect) return;
    const selectedId = parseInt(formaPagoSelect.value);
    const selectedText = formaPagoSelect.options[formaPagoSelect.selectedIndex].textContent.toLowerCase();

    if (selectedId === 2) { // Transferencia
        monedaSelect.value = "bs";
        monedaSelect.setAttribute("disabled", "disabled");
        if(bancoFieldsContainer) bancoFieldsContainer.style.display = "flex"; // flex for row
        loadBancos();
        if(pagoMovilFieldsContainer) pagoMovilFieldsContainer.style.display = "none";
        limpiarCamposPagoMovil();
        handleCurrencyChange();
    } else if (selectedText.includes("móvil") || selectedText.includes("movil") || selectedId === 5) { // Pago Movil
        monedaSelect.value = "bs";
        monedaSelect.setAttribute("disabled", "disabled");
        if(bancoFieldsContainer) bancoFieldsContainer.style.display = "none";
        if(pagoMovilFieldsContainer) {
            pagoMovilFieldsContainer.style.display = "block";
            loadBancosPagoMovil();
        }
        
        // Disable specific Destino fields as per consulta_rif
        const destinoRifTipo = document.getElementById("destinoRifTipo");
        const destinoRifNumero = document.getElementById("destinoRifNumero");
        const destinoTelefono = document.getElementById("destinoTelefono");
        
        if(destinoRifTipo) { destinoRifTipo.value = "J"; destinoRifTipo.disabled = true; }
        if(destinoRifNumero) { destinoRifNumero.value = "002916150"; destinoRifNumero.readOnly = true; }
        if(destinoTelefono) { destinoTelefono.value = "04122632231"; destinoTelefono.readOnly = true; }
        
        handleCurrencyChange();
    } else {
        monedaSelect.removeAttribute("disabled");
        if(bancoFieldsContainer) bancoFieldsContainer.style.display = "none";
        if(pagoMovilFieldsContainer) pagoMovilFieldsContainer.style.display = "none";
        limpiarCamposPagoMovil();
        handleCurrencyChange();
    }
}

function limpiarCamposPagoMovil() {
    const pagoMovilInputs = document.querySelectorAll("#pagoMovilFieldsContainer input, #pagoMovilFieldsContainer select");
    pagoMovilInputs.forEach(input => {
        // Reset values but keep generic structure? 
        // Actually consulta_rif resets specific IDs
        if(input.id !== "destinoRifTipo" && input.id !== "destinoRifNumero" && input.id !== "destinoTelefono") {
            input.value = "";
        }
    });
}

function loadBancosPagoMovil() {
    const destinoBanco = document.getElementById("destinoBanco");
    const origenBanco = document.getElementById("origenBanco");
    
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") return;

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetBancos";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success && data.bancos) {
             if(destinoBanco) {
                 destinoBanco.innerHTML = '<option value="">Seleccione</option>';
                 data.bancos.forEach(b => {
                     const opt = document.createElement("option");
                     opt.value = b.codigobanco;
                     opt.textContent = b.ibp;
                     if(b.ibp.toLowerCase().includes("banesco")) opt.selected = true;
                     destinoBanco.appendChild(opt);
                 });
             }
             if(origenBanco) {
                 origenBanco.innerHTML = '<option value="">Seleccione</option>';
                 data.bancos.forEach(b => {
                     const opt = document.createElement("option");
                     opt.value = b.codigobanco;
                     opt.textContent = b.ibp;
                     origenBanco.appendChild(opt);
                 });
             }
          }
        } catch(e) {}
      }
    };
    xhr.send();
}

function savePayment() {
    const serialPosPago = document.getElementById("serialPosPago");
    const idUser = document.getElementById("id_user_pago");
    const fechaPago = document.getElementById("fechaPago");
    const formaPago = document.getElementById("formaPago");
    const moneda = document.getElementById("moneda");
    const montoBs = document.getElementById("montoBs");
    const montoRef = document.getElementById("montoRef");
    const referencia = document.getElementById("referencia");
    const depositante = document.getElementById("depositante");
    const fechaCarga = document.getElementById("fechaCarga");
    const obsAdministracion = document.getElementById("obsAdministracion");
    const bancoOrigen = document.getElementById("bancoOrigen");
    const bancoDestino = document.getElementById("bancoDestino");

    // Validations (Simplified)
    const documentoPagoInput = document.getElementById('documentoPago');
    if (!fechaPago.value || !formaPago.value || !moneda.value || !referencia.value || !depositante.value || !documentoPagoInput || documentoPagoInput.files.length === 0) {
         Swal.fire("Campos Incompletos", "Por favor complete los campos obligatorios y Adjunte El Documento de pago.", "error");
         return;
    }
    
    // Configurar Payment ID para la API (usamos null porque es nuevo pago o el existing modal no lo tiene)
    const paymentId = null; 

    // Prepare FormData
    const formData = new URLSearchParams();
    if(serialPosPago) formData.append("serial_pos", serialPosPago.value);
    if(idUser) formData.append("user_loader", idUser.value);
    formData.append("payment_date", fechaPago.value + " " + new Date().toLocaleTimeString('en-GB'));
    
    // Bancos logic
    let origenBankVal = null;
    let destBankVal = null;
    const selectedText = formaPago.options[formaPago.selectedIndex].textContent.toLowerCase();
    
    if (selectedText.includes("móvil") || selectedText.includes("movil")) {
         const bancoOr = document.getElementById("origenBanco");
         const bancoDes = document.getElementById("destinoBanco");
         if(bancoOr && bancoOr.selectedIndex >= 0) origenBankVal = bancoOr.options[bancoOr.selectedIndex].textContent;
         if(bancoDes && bancoDes.selectedIndex >= 0) destBankVal = bancoDes.options[bancoDes.selectedIndex].textContent;
         
         // Append Pago Movil specifics
         formData.append("origen_telefono", document.getElementById("origenTelefono").value);
         formData.append("origen_rif_numero", document.getElementById("origenRifNumero").value);
         // ... add other fields if API requires them specifically or just rely on standard fields
    } else if (parseInt(formaPago.value) === 2) { // Transferencia
         if(bancoOrigen && bancoOrigen.selectedIndex >= 0) origenBankVal = bancoOrigen.options[bancoOrigen.selectedIndex].textContent;
         if(bancoDestino && bancoDestino.selectedIndex >= 0) destBankVal = bancoDestino.options[bancoDestino.selectedIndex].textContent;
    }

    formData.append("origen_bank", origenBankVal);
    formData.append("destination_bank", destBankVal);
    formData.append("payment_method", formaPago.options[formaPago.selectedIndex].textContent);
    formData.append("currency", moneda.value === 'bs' ? 'BS' : 'USD');
    formData.append("reference_amount", montoRef && montoRef.value ? montoRef.value : 0);
    formData.append("amount_bs", montoBs && montoBs.value ? montoBs.value.replace(/,/g, '') : 0);
    formData.append("payment_reference", referencia.value);
    formData.append("depositor", depositante.value);
    if(obsAdministracion) formData.append("observations", obsAdministracion.value);
    formData.append("loadpayment_date", fechaCarga && fechaCarga.value ? fechaCarga.value : new Date().toISOString().split('T')[0]);
    formData.append("confirmation_number", false);
    formData.append("payment_id", paymentId);
    
    // Add currentTicketId if available (Crucial for linking to existing ticket in gestion_pagos context if backend supports it)
    // Note: The original SavePayment in consulta_rif might NOT take ticket_id, but saves to temp. 
    // We hope the backend handles it or we might need to update the backend. 
    // For now we send what we have.
    
    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/SavePayment";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                if (data.success) {

                    // --- LOGICA DE SUBIDA DE IMAGEN (DUPLICADA - COMENTADA) ---
                    /*
                    console.log("Pago registrado. Intentando subir imagen...");
                    // CORRECCIÓN: El ID en el HTML es 'documentoPago', no 'soportePago'
                    const fileInput = document.getElementById("documentoPago");
                    
                    if (fileInput && fileInput.files.length > 0) {
                        // ... Logica movida al listener principal ...
                    } else {
                        console.log("No se seleccionó archivo para subir.");
                        // Swal.fire("Atención", "El pago se guardó, pero NO se detectó ningún documento adjunto para subir. Asegúrate de seleccionarlo.", "info");
                    }
                    */
                    // ----------------------------------------------------

                    Swal.fire({
                        title: "¡Pago Registrado!",
                        text: "El pago se ha registrado correctamente.",
                        icon: "success",
                        confirmButtonColor: "#003594"
                    }).then(() => {
                        if(modalPagoPresupuestoInstance) modalPagoPresupuestoInstance.hide();
                         // Refresh table if needed
                         if(typeof getTicketDataCoordinator === 'function') getTicketDataCoordinator();
                         if(typeof loadPaymentsTable === 'function') loadPaymentsTable(currentTicketNro);
                    });
                } else {
                    Swal.fire("Error", data.message || "Error al guardar", "error");
                }
            } catch (e) { Swal.fire("Error", "Respuesta inválida del servidor", "error"); }
        } else {
            Swal.fire("Error", "Error de conexión", "error");
        }
    };
    xhr.send(formData.toString());
}

// Initial setup for listeners that don't depend on modal open
document.addEventListener("DOMContentLoaded", function() {
    setupCurrencyListener();
    initializeDocumentNameGenerator();
    setupPaymentModalCloseListener();
});

function setupPaymentModalCloseListener() {
    const buttons = [
        document.getElementById('btnClosePagoPresupuesto'),
        document.getElementById('btnCancelarPagoPresupuesto')
    ];

    buttons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                // First try using the global instance used to open it 
                if (typeof modalPagoPresupuestoInstance !== 'undefined' && modalPagoPresupuestoInstance) {
                    modalPagoPresupuestoInstance.hide();
                } else {
                    // Fallbacks if global instance is missing
                    const el = document.getElementById('modalPagoPresupuesto');
                    if (el) {
                        if (typeof $ !== 'undefined' && $(el).modal) {
                             $(el).modal('hide');
                        } else {
                            try {
                                const manualInstance = new bootstrap.Modal(el);
                                manualInstance.hide();
                            } catch(e) { console.error(e); }
                        }
                    }
                }
            });
        }
    });
}

function initializeDocumentNameGenerator() {
    const referenciaInput = document.getElementById("referencia");
    const registroInput = document.getElementById("registro");
    const serialPosInput = document.getElementById("serialPosPago");
    
    if (referenciaInput && registroInput) {
        referenciaInput.addEventListener("input", function() {
            const refValue = this.value.trim();
            const serialValue = serialPosInput ? serialPosInput.value.trim() : "";
            
            if (refValue && serialValue) {
                // Get last 4 digits of reference
                const refLast4 = refValue.slice(-4);
                // Get last 4 digits of serial
                const serialLast4 = serialValue.slice(-4);
                // Generate: Pago + ref4digits + _ + serial4digits
                registroInput.value = `Pago${refLast4}_${serialLast4}`;
            } else if (refValue) {
                // If only reference is available, just use it
                registroInput.value = `${refValue}`;
            } else {
                registroInput.value = "";
            }
        });
    }
}

/**
 * Resets the Payment Form to its initial state.
 * Clears inputs, hides dynamic sections, and resets custom UI elements.
 */
function resetFormPago() {
    console.log("--> Resetting Payment Form <--"); 
    const form = document.getElementById('formPagoPresupuesto');
    if (form) form.reset();

    // Reset currency suffixes
    const bsSuffix = document.getElementById('montoBsSuffix');
    const refSuffix = document.getElementById('montoRefSuffix');
    if (bsSuffix) bsSuffix.style.display = 'none';
    if (refSuffix) refSuffix.style.display = 'none';

    // Hide dynamic containers
    const bancosContainer = document.getElementById('bancoFieldsContainer');
    const pagoMovilContainer = document.getElementById('pagoMovilFieldsContainer');
    if (bancosContainer) bancosContainer.style.display = 'none';
    if (pagoMovilContainer) pagoMovilContainer.style.display = 'none';
    
    // Clear dynamic fields that might not reset correctly with form.reset() if they were populated via JS
    // (e.g., if value attribute wasn't updated in DOM, just property)
    // Explicitly clearing some key fields to be safe
    document.querySelectorAll('#bancoFieldsContainer select, #pagoMovilFieldsContainer input').forEach(el => el.value = '');
}

/**
 * Global edit payment function
 * @param {number} id - The ID of the payment record
 */
/**
 * Global edit payment function
 * @param {number} id - The ID of the payment record
 */
/**
 * Global edit payment function
 * @param {string} recordNumber - The record number (nro de registro)
 */
window.editPayment = function(recordNumber) {
    console.log("Edit payment clicked for Record Number:", recordNumber);
    
    // 1. Fetch Payment Data via XMLHttpRequest
    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetPaymentByRecordNumber";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.payment) {
                    const p = response.payment;
                    
                    // 2. Populate Modal Fields
                    $('#edit_payment_id').val(p.id_payment_record); // Still keep internal ID for update precision
                    // Fix date format: Extract YYYY-MM-DD from YYYY-MM-DD HH:MM:SS
                    let rawDate = p.payment_date || "";
                    if (rawDate.includes(" ")) {
                        rawDate = rawDate.split(" ")[0];
                    }
                    $('#edit_fechaPago').val(rawDate);
                    
                    // Load Exchange Rate for this date
                    loadEditExchangeRate(rawDate);
                    
                    $('#edit_referencia').val(p.payment_reference);
                    $('#edit_depositante').val(p.depositor);
                    $('#edit_obsAdministracion').val(p.observations);
                    $('#edit_montoBs').val(p.amount_bs);
                    $('#edit_montoRef').val(p.reference_amount);
                    
                    if ($('#edit_formaPago option').length <= 1) {
                        $('#formaPago option').clone().appendTo('#edit_formaPago');
                    }
                    // Select Payment Method by Text (since backend saves Name not ID)
                    if (p.payment_method) {
                        $('#edit_formaPago option').each(function() {
                            if ($(this).text().trim().toLowerCase() === p.payment_method.trim().toLowerCase()) {
                                $(this).prop('selected', true);
                                return false; // break
                            }
                        });
                    }

                    // Moneda & Visibility
                    $('#edit_moneda').val(p.currency.toLowerCase());
                    handleEditMonedaChange(p.currency.toLowerCase());
                    
                    // Trigger Payment Method Change to show correct fields
                    handleEditFormaPagoChange();

                    // Populate Mobile Payment Fields if visible (and if data exists)
                     if(p.origen_rif_numero) $('#edit_origenRifNumero').val(p.origen_rif_numero);
                     if(p.origen_telefono) $('#edit_origenTelefono').val(p.origen_telefono);

                    // 3. Show Modal
                    var el = document.getElementById('editPaymentModal');
                    // Store instance globally to control it later
                    editPaymentModalInstance = new bootstrap.Modal(el);
                    editPaymentModalInstance.show();
                    
                } else {
                    Swal.fire('Error', response.message || 'No se pudo cargar la información del pago.', 'error');
                }
            } catch (e) {
                console.error("JSON Parse error:", e);
                Swal.fire('Error', 'Respuesta inválida del servidor.', 'error');
            }
        } else {
            Swal.fire('Error', 'Error HTTP ' + xhr.status, 'error');
        }
    };
    
    xhr.onerror = function() {
        Swal.fire('Error', 'Error de conexión al buscar el pago.', 'error');
    };
    
    xhr.send(`record_number=${encodeURIComponent(recordNumber)}`);
};

// --- NEW HELPER FOR EDIT MODAL ---
function handleEditFormaPagoChange() {
    const formaPagoSelect = document.getElementById("edit_formaPago");
    const monedaSelect = document.getElementById("edit_moneda");
    const bancoFieldsContainer = document.getElementById("edit_bancoFieldsContainer");
    const pagoMovilFieldsContainer = document.getElementById("edit_pagoMovilFieldsContainer");
    
    // Only proceed if elements exist
    if (!formaPagoSelect || !monedaSelect) return;

    // Safety Check: If no option selected, return
    if (formaPagoSelect.selectedIndex === -1) return;

    const selectedId = parseInt(formaPagoSelect.value) || 0;
    const selectedOption = formaPagoSelect.options[formaPagoSelect.selectedIndex];
    const selectedText = selectedOption ? selectedOption.textContent.toLowerCase() : "";

    // Reset visibility first
    if(bancoFieldsContainer) bancoFieldsContainer.style.display = "none";
    if(pagoMovilFieldsContainer) pagoMovilFieldsContainer.style.display = "none";

    // Logic similar to CREATE modal
    if (selectedId === 2) { // Transferencia
        monedaSelect.value = "bs";
        monedaSelect.setAttribute("disabled", "disabled");
        if(bancoFieldsContainer) bancoFieldsContainer.style.display = "flex"; 
        
        // Ensure options are loaded if empty (simple clone from main if needed or fetch)
        // For now relying on main 'loadBancos' or existing options
        if($('#edit_bancoOrigen option').length <= 1) {
             $('#bancoOrigen option').clone().appendTo('#edit_bancoOrigen');
        }
        if($('#edit_bancoDestino option').length <= 1) {
             $('#bancoDestino option').clone().appendTo('#edit_bancoDestino');
        }

        handleEditMonedaChange("bs");

    } else if (selectedText.includes("móvil") || selectedText.includes("movil") || selectedId === 5) { // Pago Movil
        monedaSelect.value = "bs";
        monedaSelect.setAttribute("disabled", "disabled");
        
        if(pagoMovilFieldsContainer) pagoMovilFieldsContainer.style.display = "flex";
        
        handleEditMonedaChange("bs");
        
    } else {
        // Other methods (Cash, Zelle etc)
        monedaSelect.removeAttribute("disabled");
        handleEditMonedaChange(monedaSelect.value);
    }
}

// Attach listener to Edit Payment Method Select
$('#edit_formaPago').change(function() {
    handleEditFormaPagoChange();
});

// Helper to handle field visibility in Edit Mode
function handleEditMonedaChange(currency) {
    const isBs = (currency === 'bs' || currency === 'bolivares');
    const isUsd = (currency === 'usd' || currency === 'dolares');

    if (isBs) {
        $('#edit_montoBs').prop('disabled', false).css('background-color', '#fff');
        // Do NOT clear val() here, just disable. User wants to see the Ref amount even if paying in Bs.
        $('#edit_montoRef').prop('disabled', true).css('background-color', '#e9ecef'); 
    } else if (isUsd) {
        // Do NOT clear val() here.
        $('#edit_montoBs').prop('disabled', true).css('background-color', '#e9ecef');
        $('#edit_montoRef').prop('disabled', false).css('background-color', '#fff');
    } else {
         // Default or empty
        $('#edit_montoBs').prop('disabled', true);
        $('#edit_montoRef').prop('disabled', true);
    }
}

// Event Listener for Moneda Change in Edit Modal
$('#edit_moneda').change(function() {
    handleEditMonedaChange($(this).val());
});

// Save Update
$('#btnUpdatePayment').click(function() {
    const id = $('#edit_payment_id').val();
    const ticketId = $('#ticketIdPago').val();

    const data = {
        id_payment: id,
        payment_method: $('#edit_formaPago option:selected').text().trim(),
        currency: $('#edit_moneda').val().toUpperCase(),
        amount_bs: $('#edit_montoBs').val(),
        reference_amount: $('#edit_montoRef').val(),
        payment_reference: $('#edit_referencia').val(),
        depositor: $('#edit_depositante').val(),
        origen_bank: $('#edit_bancoOrigen').val(),
        destination_bank: $('#edit_bancoDestino').val(),
        // New Mobile Payment Fields
        origen_rif_numero: $('#edit_origenRifNumero').val(),
        origen_telefono: $('#edit_origenTelefono').val()
    };

    // Detailed Validation
    let missingFields = [];
    if (!data.payment_method) missingFields.push("Forma de Pago");
    if (!data.currency) missingFields.push("Moneda");
    if (!data.reference_amount && !data.amount_bs) missingFields.push("Monto (Bs o USD)");
    if (!data.payment_reference) missingFields.push("Referencia");
    if (!data.depositor) missingFields.push("Depositante");

    if (missingFields.length > 0) {
        let errorHtml = '<ul style="text-align: left; margin-bottom: 0;">';
        missingFields.forEach(field => {
            errorHtml += `<li>${field}</li>`;
        });
        errorHtml += '</ul>';

        Swal.fire({
            title: 'Campos Incompletos',
            html: `Por favor complete los siguientes datos:<br>${errorHtml}`,
            icon: 'error',
            confirmButtonText: 'Entendido',
            buttonsStyling: false,
            customClass: {
                popup: 'swal-premium-popup',
                title: 'swal-premium-title',
                confirmButton: 'swal-premium-confirm'
            }
        });
        return;
    }

    Swal.fire({
        title: 'Confirmación',
        html: "<span style='color: #555; font-size: 1.1em;'>¿Desea aplicar los cambios a este pago?</span><br><div style='margin-top:10px; font-size: 0.9em; color: #888;'>Se guardará un registro de auditoría.</div>",
        icon: 'info', // Changed to info/question for cleaner look, icon color overridden by CSS usually
        showCancelButton: true,
        confirmButtonText: 'Sí, Actualizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        background: '#fff',
        backdrop: `rgba(0,0,123,0.1)`, // Custom light backdrop
        customClass: {
            popup: 'swal-premium-popup',
            title: 'swal-premium-title',
            confirmButton: 'swal-premium-confirm',
            cancelButton: 'swal-premium-cancel'
        },
        buttonsStyling: false // IMPORTANT: Disables SweetAlert's default styles (and Bootstrap's interference)
    }).then((result) => {
        if (result.isConfirmed) {
            const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/UpdatePayment";
            const xhr = new XMLHttpRequest();
            xhr.open("POST", apiUrl);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            Swal.fire({
                                title: '¡Actualizado!',
                                icon: 'success',
                                html: `
                                    <div style="text-align: center;">
                                        <h4 style="color: #333; font-weight: 600; margin-bottom: 10px;">Cambios Guardados</h4>
                                        <p style="color: #666; font-size: 1.1rem;">${response.message || 'El pago se ha actualizado correctamente.'}</p>
                                    </div>
                                `,
                                showConfirmButton: true,
                                confirmButtonText: '<i class="fas fa-check-circle me-2"></i>Entendido',
                                customClass: {
                                    popup: 'swal-premium-popup',
                                    title: 'swal-premium-title',
                                    confirmButton: 'swal-premium-confirm'
                                },
                                buttonsStyling: false
                            });
                            
                            if (editPaymentModalInstance) {
                                editPaymentModalInstance.hide();
                            } else {
                                $('#editPaymentModal').modal('hide');
                            }
                            
                            // Use parsed ticketId or fallback to global currentTicketNro
                            const refreshTicketId = ticketId || currentTicketNro;
                            console.log("Refreshing tables for Ticket:", refreshTicketId);

                            if (refreshTicketId) {
                                loadPaymentHistory(refreshTicketId);
                                loadTotalPaid(refreshTicketId);
                            }
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: response.message,
                                icon: 'error',
                                confirmButtonText: 'Aceptar',
                                customClass: {
                                    popup: 'swal-premium-popup',
                                    title: 'swal-premium-title',
                                    confirmButton: 'swal-premium-confirm'
                                },
                                buttonsStyling: false
                            });
                        }
                    } catch (e) {
                        Swal.fire({
                            title: 'Error',
                            text: 'Respuesta inválida del servidor.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            customClass: {
                                popup: 'swal-premium-popup',
                                title: 'swal-premium-title',
                                confirmButton: 'swal-premium-confirm'
                            },
                            buttonsStyling: false
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error HTTP ' + xhr.status,
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        customClass: {
                            popup: 'swal-premium-popup',
                            title: 'swal-premium-title',
                            confirmButton: 'swal-premium-confirm'
                        },
                        buttonsStyling: false
                    });
                }
            };
            
            xhr.onerror = function() {
                Swal.fire({
                    title: 'Error',
                    text: 'Error de conexión.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'swal-premium-popup',
                        title: 'swal-premium-title',
                        confirmButton: 'swal-premium-confirm'
                    },
                    buttonsStyling: false
                });
            };
            
            // Convert data object to URLSearchParams for easier encoding
            const params = new URLSearchParams();
            for (let key in data) {
                params.append(key, data[key]);
            }
            xhr.send(params.toString());
        }
    });
});

// Listener for Close/Cancel Button in Edit Modal
$('#btnCancelEditPayment').click(function() {
    // 1. Reset Form
    document.getElementById('formEditPayment').reset();
    
    // 2. Hide Dynamic Containers
    $('#edit_bancoFieldsContainer').hide();
    $('#edit_pagoMovilFieldsContainer').hide();
    
    // 3. Close Modal using Global Instance
    if (editPaymentModalInstance) {
        editPaymentModalInstance.hide();
    } else {
        // Fallback
        $('#editPaymentModal').modal('hide');
    }
});

// --- CURRENCY CONVERSION LOGIC FOR EDIT MODAL ---

function loadEditExchangeRate(date) {
    if (!date) return;
    
    // Reuse existing API endpoint
    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateByDate";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.exchange_rate) {
                    editExchangeRate = parseFloat(response.exchange_rate.tasa_dolar);
                    console.log("Edit Mode Rate loaded:", editExchangeRate);
                    // Recalculate if values exist
                    if ($('#edit_moneda').val().toLowerCase() === 'bs') {
                         calculateEditBsToUsd();
                    } else {
                         calculateEditUsdToBs();
                    }
                } else {
                    editExchangeRate = null;
                }
            } catch (e) {
                console.error("Rate parse error", e);
            }
        }
    };
    xhr.send("fecha=" + date);
}

function calculateEditBsToUsd() {
    if (!editExchangeRate) return;
    
    const montoBs = parseFloat($('#edit_montoBs').val()) || 0;
    if (montoBs > 0) {
        $('#edit_montoRef').val((montoBs / editExchangeRate).toFixed(2));
    }
}

function calculateEditUsdToBs() {
    if (!editExchangeRate) return;
    
    const montoUsd = parseFloat($('#edit_montoRef').val()) || 0;
    if (montoUsd > 0) {
        $('#edit_montoBs').val((montoUsd * editExchangeRate).toFixed(2));
    }
}

// BIND EVENTS
$('#edit_fechaPago').change(function() {
    loadEditExchangeRate($(this).val());
});

$('#edit_montoBs').on('input keyup', function() {
    if ($('#edit_moneda').val().toLowerCase() === 'bs') {
        calculateEditBsToUsd();
    }
});

$('#edit_montoRef').on('input keyup', function() {
    if ($('#edit_moneda').val().toLowerCase().includes('usd')) {
        calculateEditUsdToBs();
    }
});

console.log("frontEnd.js fully loaded with editPayment logic");
