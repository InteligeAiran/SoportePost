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

let EnvioInput = null;
let ExoInput = null;
let PagoInput = null;


document.addEventListener("DOMContentLoaded", function () {

  // Inicializar las instancias de los modales de Bootstrap para poder controlarlos con JS
  const viewDocumentModalInstance = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
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
  const currentTechnicianName = document.getElementById(
    "currentTechnicianName"
  );
  const confirmReassignYesBtn = document.getElementById(
    "confirmReassignYesBtn"
  );
  const assignTechnicianBtn = document.getElementById("assignTechnicianBtn");

  // Evento para el botón "Sí" del modal de confirmación
  confirmReassignYesBtn.addEventListener("click", async function () {
    confirmReassignModalInstance.hide(); // Oculta el modal de confirmación
  });

  // Evento para el botón "Asignar" del modal de selección de técnico
  assignTechnicianBtn.addEventListener("click", async function () {
    const newTechnicianId = technicianSelect.value;
    const newTechnicianName = technicianSelect.options[technicianSelect.selectedIndex].textContent; // Para el alert

    if (newTechnicianId) {
      // Deshabilitar botón para evitar múltiples clics
      assignTechnicianBtn.disabled = true;
      assignTechnicianBtn.textContent = "Asignando...";

      try {
        const success = await reassignTicket(currentTicketId, newTechnicianId);

        if (success) {
          Swal.fire({
            icon: 'success',
            title: '¡Reasignación Exitosa!',
            html: `El Ticket <span style="border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${currentTicketNro}</span> ha sido reasignado con éxito a <span style="border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${newTechnicianName}</span>.`,
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
          }).then(() => { // El .then() se ejecuta cuando el usuario hace clic en el botón
            location.reload(); // Recarga la página inmediatamente
          });
        } else {
          alert(
            `Error al reasignar el ticket ${currentTicketNro}. Por favor, intente de nuevo.`
          );
        }
      } catch (error) {
        console.error("Error al reasignar el ticket:", error);
        console.error(`Ocurrió un error al reasignar el ticket ${currentTicketNro}.`);
      } finally {
        selectTechnicianModalInstance.hide(); // Oculta el modal de selección
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

  const tbody = document
    .getElementById("tabla-ticket")
    .getElementsByTagName("tbody")[0];

  // Destruye DataTables si ya está inicializado
  if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
    $("#tabla-ticket").DataTable().destroy();
    tbody.innerHTML = ""; // Limpia el tbody después de destruir DataTables
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
              backdrop: "static", // Para que no se cierre al hacer clic fuera
              keyboard: false, // Para que no se cierre con la tecla ESC
            });

            const closebutton = document.getElementById("close-button");
            const closeIcon = document.getElementById("Close-icon");
            const SelectReg = document.getElementById("idSelectionTec");
            const InputReg = document.getElementById("InputRegion");

            if (closebutton && SelectReg && modalInstanceCoordinator) {
              closebutton.addEventListener("click", function () {
                modalInstanceCoordinator.hide(); // Oculta el modal de cambio de estatus
                InputReg.value = "";
              });
            }

            if (closeIcon && SelectReg && modalInstanceCoordinator) {
              closeIcon.addEventListener("click", function () {
                modalInstanceCoordinator.hide(); // Oculta el modal de cambio de estatus
                InputReg.value = "";
              });
            }
          } else {
            console.error(
              "El elemento 'staticBackdrop' (modal de asignación) no fue encontrado en el DOM."
            );
          }

          const detailsPanel = document.getElementById("ticket-details-panel");

          detailsPanel.innerHTML =
            "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

          const dataForDataTable = [];

          TicketData.forEach((data) => {
            let actionButtonsHtml = ""; // Variable para construir los botones de acción
            currentTicketNroForImage =  data.nro_ticket;

            // Lógica para los botones de acción
            if (data.id_accion_ticket === '4' ) {
              // Acción = Asignado a la Coordinación
              actionButtonsHtml += `
                <button id = "confirmreceived" class="btn btn-sm btn-info btn-received-coord mr-2"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Marcar como Recibido por Coordinador"
                  data-ticket-id="${data.id_ticket}"
                  data-nro-ticket="${data.nro_ticket}"
                  data-serial-pos="${data.serial_pos}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>
                </button>
                <button id="myUniqueAssingmentButton"
                  class="btn btn-sm btn-assign-tech"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Asignar Técnico"
                  data-ticket-id="${data.id_ticket}"
                  data-nro-ticket="${data.nro_ticket}"
                  data-serial-pos="${data.serial_pos}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/></svg>
                </button>
              `;
            } else if (
              data.id_accion_ticket === '3'
            ) {
              // Acción = Recibido por la Coordinación
              actionButtonsHtml += `
                <button id="myUniqueAssingmentButton"
                  class="btn btn-sm btn-assign-tech"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Asignar Técnico"
                  data-ticket-id="${data.id_ticket}"
                  data-nro-ticket="${data.nro_ticket}"
                  data-serial-pos="${data.serial_pos}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/></svg>
                </button>
              `;
            } else if (data.id_accion_ticket === '6' || data.id_accion_ticket === '10') {

              // "Asignado al Técnico" &  "Recibido por el Técnico"

              actionButtonsHtml += `
                <button id="reasingButton" class="btn btn-sm btn-primary btn-reassign-tech"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Reasignar Técnico"
                  data-ticket-id="${data.id_ticket}"
                  data-nro-ticket="${data.nro_ticket}"
                  data-serial-pos="${data.serial_pos}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16"><path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/></svg>
                </button>
              `;
            }

            // Nuevo botón para visualizar imagen
           
           if (data.envio === 'Sí' || data.exoneracion === 'Sí' || data.pago === 'Sí') {
              actionButtonsHtml += `
                <button id="botonMostarImage" class="btn btn-sm btn-view-image" data-bs-placement="top" title="Visualizar Documentos"
                  data-ticket-id="${data.id_ticket}"
                  data-nro-ticket="${data.nro_ticket}"
                  data-envio="${data.envio}"
                  data-exoneracion="${data.exoneracion}"
                  data-pago="${data.pago}"
                  data-rechazado="${data.rechazado}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                    <path d="M.046 8.5C.138 7.042 1.517 5.0 8 5.0s7.862 2.042 7.954 3.5c-.092 1.458-1.472 3.5-7.954 3.5S.138 9.958.046 8.5M13 8a5 5 0 1 0-10 0 5 5 0 0 0 10 0"/>
                  </svg>
                </button>
              `;
            } else {
              // Si no hay ningún documento ('Sí'), muestra el botón deshabilitado
              actionButtonsHtml += `
                <button type="button" id = "botonMostarNoImage" class="btn btn-secondary btn-sm" title="No hay Documentos a vizualizar" disabled>
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
              actionButtonsHtml, // Usa la variable con los botones
            ]);
          });

          // Inicialización de DataTables
          const dataTableInstance = $("#tabla-ticket").DataTable({
            // <--- 'dataTableInstance' se declara aquí
            data: dataForDataTable,
            scrollX: "200px",
            responsive: false,
            pagingType: "simple_numbers",
            lengthMenu: [
              [5, 10],
              ["5", "10"],
            ],
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
                title: "Raz&oacuten Social",
                render: function (data, type, row) {
                  if (type === "display") {
                    return `<span class="truncated-cell" data-full-text="${data}">${data}</span>`;
                  }
                  return data;
                },
              },
              { title: "Acción Ticket" },
              { title: "Técnico Asignado", visible: false }, // Oculta esta columna por defecto
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
                    <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
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
                $("#btn-por-asignar")
                  .removeClass("btn-primary")
                  .addClass("btn-secondary");
                $("#btn-asignados")
                  .removeClass("btn-primary")
                  .addClass("btn-secondary");
                $("#btn-recibidos")
                  .removeClass("btn-primary")
                  .addClass("btn-secondary");
                $("#btn-reasignado")
                  .removeClass("btn-primary")
                  .addClass("btn-secondary");
                $(`#${activeButtonId}`)
                  .removeClass("btn-secondary")
                  .addClass("btn-primary");
              }

              // Función para verificar si hay datos en una búsqueda específica
              function checkDataExists(searchTerm) {
                api.columns().search('').draw(false);
                api.column(6).visible(false);
                api.column(7).visible(true);
                
                const filteredData = api.column(5).search(searchTerm, true, false).draw();
                const rowCount = api.rows({ filter: 'applied' }).count();
                
                return rowCount > 0;
              }

              // Función para buscar automáticamente el primer botón con datos
              function findFirstButtonWithData() {
                const searchTerms = [
                  { button: "btn-por-asignar", term: "Asignado a la Coordinación" , status: "Abierto", action: "Asignado a la Coordinación"},
                  { button: "btn-recibidos", term: "Recibido por la Coordinación",  status: "Abierto", action: "Recibido por la Coordinación"},
                  // CORREGIDO: Usar expresión que funcione para ambos
                  { button: "btn-asignados", term: "Asignado al Técnico|Recibido por el Técnico", status: "En proceso", action: ["En espera de confirmar recibido en Región", "Recibido por la Coordinación"]},
                  { button: "btn-reasignado", term: "Reasignado al Técnico", status: "En proceso", action: "Reasignado al Técnico"}
                ];

                for (let i = 0; i < searchTerms.length; i++) {
                  const { button, term, status, action} = searchTerms[i];
                  
                  if (checkDataExists(term)) {
                    // Si hay datos, aplicar la búsqueda y activar el botón
                    api.columns().search('').draw(false);
                    
                    if (button === "btn-asignados") {
                      api.column(6).visible(true);
                    } else {
                      api.column(6).visible(false);
                    }
                    
                    api.column(7).visible(true);
                    api.column(5).search(term, true, false).draw();
                    setActiveButton(button);
                    showTicketStatusIndicator(status, action);
                    return true; // Encontramos datos
                  }
                }
                
                // Si no hay datos en ningún botón, mostrar mensaje
                api.columns().search('').draw(false);
                api.column(6).visible(false);
                api.column(7).visible(true);
                api.column(5).search("NO_DATA_FOUND").draw();
                setActiveButton("btn-por-asignar");
                showTicketStatusIndicator("Cerrado", "Sin datos");

                
                // Mostrar mensaje de que no hay datos
                const tbody = document.querySelector("#tabla-ticket tbody");
                if (tbody) {
                  tbody.innerHTML = `<tr>
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
                }
                
                return false;
              }

              // Ejecutar la búsqueda automática al inicializar
              findFirstButtonWithData();

              // Event listeners para los botones (mantener la funcionalidad manual)
              $("#btn-asignados").on("click", function () {
                // CORREGIDO: Usar expresión que funcione para ambos
                const searchTerm = "Asignado al Técnico|Recibido por el Técnico";
                
                if (checkDataExists(searchTerm)) {
                  api.columns().search('').draw(false);
                  api.column(6).visible(true);
                  api.column(7).visible(true);
                  api.column(5).search(searchTerm, true, false).draw();
                  setActiveButton("btn-asignados");
                  showTicketStatusIndicator("En proceso", ["Asignado al Técnico", "Recibido por el Técnico"]);
                } else {
                  // Si no hay datos, buscar en el siguiente botón
                  findFirstButtonWithData();
                }
              });

              $("#btn-por-asignar").on("click", function () {
                if (checkDataExists("Asignado a la Coordinación")) {
                  api.columns().search('').draw(false);
                  api.column(6).visible(false);
                  api.column(7).visible(true);
                  api.column(5).search("Asignado a la Coordinación").draw();
                  setActiveButton("btn-por-asignar");
                  showTicketStatusIndicator("Abierto", "Asignado a la Coordinación");
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
                } else {
                  findFirstButtonWithData();
                }
              });
            },
          });

          $("#tabla-ticket").resizableColumns();

          $("#tabla-ticket tbody")
            .off("click", "tr") // Desvincula handlers anteriores para evitar duplicados
            .on("click", "tr", function () {
              const tr = $(this);
              const rowData = dataTableInstance.row(tr).data(); // Aquí 'dataTableInstance' sí está disponible

              if (!rowData) {
                return;
              }

              // **Estas dos líneas son las que hacen el resaltado**
              $("#tabla-ticket tbody tr").removeClass("table-active"); // Quita la clase de todas las filas
              tr.addClass("table-active"); // Añade la clase a la fila clicada

              const ticketId = rowData[0]; // Asume que el ID del ticket está en la primera columna

              const selectedTicketDetails = TicketData.find(
                (t) => t.id_ticket == ticketId
              );

              if (selectedTicketDetails) {
                // ... (resto de tu lógica para mostrar el panel de detalles)
                detailsPanel.innerHTML = formatTicketDetailsPanel(
                  selectedTicketDetails
                );
                loadTicketHistory(ticketId, currentTicketNroForImage);
                if (selectedTicketDetails.serial_pos) {
                  downloadImageModal(selectedTicketDetails.serial_pos);
                } else {
                  const imgElement = document.getElementById(
                    "device-ticket-image"
                  );
                  if (imgElement) {
                    // Corrección de la ruta de la imagen estática
                    imgElement.src = '/public/img/consulta_rif/POS/mantainment.png'; // Ruta relativa o absoluta accesible desde el navegador
                    imgElement.alt = "Serial no disponible";
                  }
                }
              } else {
                detailsPanel.innerHTML =
                  "<p>No se encontraron detalles para este ticket.</p>";
              }
            });

          $("#tabla-ticket tbody")
            .off("click", ".truncated-cell, .expanded-cell") // <--- Importante: Ahora escucha clics en AMBAS clases
            .on("click", ".truncated-cell, .expanded-cell", function (e) {
              e.stopPropagation();
              const $cellSpan = $(this);
              const fullText = $cellSpan.data("full-text");
              const displayLength = 25; // Define displayLength aquí para que esté disponible en ambos casos

              if ($cellSpan.hasClass("truncated-cell")) {
                // Si está truncado, expandirlo
                $cellSpan
                  .removeClass("truncated-cell")
                  .addClass("expanded-cell");
                $cellSpan.text(fullText);
              } else if ($cellSpan.hasClass("expanded-cell")) { // <--- Añadimos esta condición para ser explícitos
                // Si está expandido, truncarlo (si es necesario)
                $cellSpan
                  .removeClass("expanded-cell")
                  .addClass("truncated-cell");

                if (fullText.length > displayLength) {
                  $cellSpan.text(fullText.substring(0, displayLength) + "...");
                } else {
                  $cellSpan.text(fullText); // Si no necesita truncarse, mostrar el texto completo
                }
              }
              // Si por alguna razón la celda no tiene ninguna de las dos clases, no hará nada.
            });

          // Evento click para el botón "POS Recibido"
          $("#tabla-ticket tbody")
            .off("click", ".btn-received-coord")
            .on("click", ".btn-received-coord", function (e) {
              e.stopPropagation();
              const ticketId = $(this).data("ticket-id");
              const nroTicket = $(this).data("nro-ticket");
              const serialPos = $(this).data("serial-pos");
              markTicketAsReceived(ticketId, nroTicket, serialPos);
            });

          // Evento click existente para el botón de Asignar Técnico
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
                console.error(
                  "Error: La instancia del modal de asignación no está disponible."
                );
              }
            });

          $("#tabla-ticket tbody")
            .off("click", ".btn-reassign-tech")
            .on("click", ".btn-reassign-tech", function (e) {
              e.stopPropagation();
              currentTicketId = $(this).data("ticket-id");
              currentTicketNro = $(this).data("nro-ticket"); // Asegúrate de obtener el nro_ticket
              currentserialPos = $(this).data("serial-pos");
              ticketNumberSpan.textContent = currentTicketNro; // Muestra el número en el modal de confirmación
              ticketserialPos.textContent = currentserialPos; // Muestra el serial en el modal de confirmación
              confirmReassignModalInstance.show(); // Muestra el modal de confirmación
            });

          // Evento click para el nuevo botón "Visualizar Imagen"
        $("#tabla-ticket tbody")
          .off("click", ".btn-view-image")
          .on("click", ".btn-view-image", function (e) {
          e.stopPropagation();

          // Obtener datos del botón
          const ticketId = $(this).data("ticket-id");
          const nroTicket = $(this).data("nro-ticket");
          const envioValor = $(this).data("envio");
          const exoValor = $(this).data("exoneracion");
          const pagoValor = $(this).data("pago");

          // Datos de rechazo
          const Enviorechazo = $(this).data("envio_rechazado");
          const Exoneracionrechazo = $(this).data("exo_rechazado");
          const PagoRechazo = $(this).data("pago_rechazado");
          const EnvdestinoRechazo = $(this).data("envdestino_rechazado");
          
          // NUEVA VALIDACIÓN: Usar la columna de la función SQL
          const ticketTieneDocumentosRechazados = $(this).data("ticket-rechazados");
          const ticketRechazado = $(this).data("rechazado");

          const BotonRechazo = document.getElementById('RechazoDocumento');
          
          // --- INICIO CÓDIGO CORREGIDO PARA MOSTRAR/OCULTAR EL BOTÓN ---
          // Al abrir el modal, ocultamos el botón por defecto para luego mostrarlo si es necesario
          BotonRechazo.style.display = 'none';

          // Guardar en variables globales
          currentTicketIdForImage = ticketId;
          currentTicketNroForImage = nroTicket;

          const VizualizarImage = document.getElementById('visualizarImagenModal');
          const visualizarImagenModal = new bootstrap.Modal(VizualizarImage, { keyboard: false });

          document.getElementById('BotonCerrarSelectDocument').onclick = () => visualizarImagenModal.hide();

          const EnvioInputModal = document.getElementById('imagenEnvio');
          const EnvioLabelModal = document.getElementById('labelEnvio');
          const ExoInputModal = document.getElementById('imagenExoneracion');
          const ExoLabelModal = document.getElementById('labelExo');
          const PagoInputModal = document.getElementById('imagenPago');
          const PagoLabelModal = document.getElementById('labelPago');

          // Muestra u oculta los radio buttons basándose en los valores del botón
          if (envioValor === 'Sí') {
              EnvioLabelModal.style.display = 'block';
              EnvioInputModal.style.display = 'block';
          } else {
              EnvioLabelModal.style.display = 'none';
              EnvioInputModal.style.display = 'none';
          }

          if (exoValor === 'Sí') {
              ExoInputModal.style.display = 'block';
              ExoLabelModal.style.display = 'block';
          } else {
              ExoInputModal.style.display = 'none';
              ExoLabelModal.style.display = 'none';
          }

          if (pagoValor === 'Sí') {
              PagoInputModal.style.display = 'block';
              PagoLabelModal.style.display = 'block';
          } else {
              PagoInputModal.style.display = 'none';
              PagoLabelModal.style.display = 'none';
          }

          // REMOVER event listeners anteriores para evitar duplicados
          const btnConfirmar = document.getElementById('btnConfirmarVisualizacion');

          // Clonar elementos para remover event listeners
          const btnConfirmarClone = btnConfirmar.cloneNode(true);

          btnConfirmar.parentNode.replaceChild(btnConfirmarClone, btnConfirmar);

          // Botón para cerrar el modal de visualización

          // Evento para el botón confirmar visualización
          btnConfirmarClone.addEventListener('click', function () {
              const selectedOption = document.querySelector('input[name="opcionImagen"]:checked').value;

              if (!selectedOption) {
                  Swal.fire({
                      icon: 'warning',
                      title: 'Selección Requerida',
                      text: `Por favor, elija un tipo de documento para visualizar.`,
                      confirmButtonText: 'Ok',
                      color: 'black',
                      confirmButtonColor: '#003594'
                  });
                  return;
              }
              
              // NUEVA VALIDACIÓN SIMPLIFICADA: Verificar si el ticket tiene documentos rechazados
              if (ticketRechazado === true || ticketRechazado === 't' || ticketRechazado === 'true') {
                  // Si el ticket ya tiene documentos rechazados, NO mostrar botón de rechazo
                  BotonRechazo.style.display = 'none';
              } else {
                  // Si el ticket NO tiene documentos rechazados, SÍ mostrar botón de rechazo
                  BotonRechazo.style.display = 'block';
              }
              
              getMotivos(selectedOption);

              // Llamar a la API para obtener el documento
              fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetDocumentByType`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: `action=GetDocumentByType&ticketId=${currentTicketNroForImage}&documentType=${selectedOption}`
              })
                  .then(response => response.json())
                  .then(data => {
                      if (data.success) {
                          const document = data.document;
                          const filePath = document.file_path;
                          const mimeType = document.mime_type;
                          const fileName = document.original_filename;

                          // Determinar si es imagen o PDF
                          if (mimeType.startsWith('image/')) {
                              showViewModal(currentTicketIdForImage, currentTicketNroForImage, filePath, null, fileName);
                          } else if (mimeType === 'application/pdf') {
                              showViewModal(currentTicketIdForImage, currentTicketNroForImage, null, filePath, fileName);
                          } else {
                              showViewModal(currentTicketIdForImage, currentTicketNroForImage, null, null, "Tipo de documento no soportado");
                          }

                          // Ocultar el modal de selección
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
          // MOSTRAR el modal
          visualizarImagenModal.show();
        });
        } else {
          hideTicketStatusIndicator();
          tbody.innerHTML = '<tr><td>Error al cargar</td></tr>';
          console.error("Error:", response.message);
        }
      } catch (error) {
        hideTicketStatusIndicator();
        tbody.innerHTML =
          '<tr><td>Error al procesar la respuesta</td></tr>';
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      hideTicketStatusIndicator();
      tbody.innerHTML =`<tr>
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

function reassignTicket(ticketId, newTechnicianId) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const id_user = document.getElementById("id_user").value; // Asumiendo que tienes el ID del usuario logueado
    const comment = document.getElementById("reassignObservation").value; // Asumiendo que tienes el comentario del usuario
    const API_URL_REASSIGN = `${ENDPOINT_BASE}${APP_PATH}api/users/ReassignTicket`;

    xhr.open("POST", API_URL_REASSIGN);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

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

    const dataToSend = `action=ReassignTicket&ticket_id=${ticketId}&new_technician_id=${newTechnicianId}&id_user=${id_user}&comment=${comment}`;
    xhr.send(dataToSend);
  });
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
                            <i class="bi bi-box-seam-fill me-1"></i> Cargar Componentes del Dispositivo
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
function loadTicketHistory(ticketId, currentTicketNroForImage) {
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
                        <button class="btn btn-secondary" onclick="printHistory('${ticketId}', '${encodeURIComponent(JSON.stringify(response.history))}', '${currentTicketNroForImage}')">
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
                                                        <th class="text-start">Componentes Asociados:</th>
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

function printHistory(ticketId, historyEncoded, currentTicketNroForImage) {
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
            text = `${diffWeeks}W ${diffDays % 7}D`;
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

    let itemsHtml = '';
    history.forEach((item, index) => {
        const previous = history[index + 1] || null;
        const elapsed = previous ? calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio) : null;
        const elapsedText = elapsed ? elapsed.text : 'N/A';

        itemsHtml += `
            <div style="border: 1px solid #ddd; border-radius: 6px; margin: 10px 0; padding: 12px;">
                <div style="font-weight: bold; color: #003594; margin-bottom: 6px;">${cleanString(item.fecha_de_cambio) || 'N/A'} - ${cleanString(item.name_accion_ticket) || 'N/A'} (${cleanString(item.name_status_ticket) || 'N/A'})</div>
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
                        ${cleanString(item.components_list) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Componentes</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.components_list)}</td></tr>` : ''}
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
        `;
    });

    const printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="text-align:center;">
                <h2 style="color: #003594; margin-bottom: 6px;">Historial del Ticket</h2>
                <p style="margin: 0 0 8px 0;"><strong>Ticket Nro:</strong> ${currentTicketNroForImage}</p>
                <p style="margin: 0 0 14px 0; color: #555;">Fecha de Impresión: ${new Date().toLocaleString()}</p>
                <p style="margin: 0 0 14px 0; color: #6c757d; font-size: 12px;">Nota: En la columna "Tiempo desde gestión anterior" con un valor "N/A" indica que la gestión se realizó en menos de 1 minuto.</p>
            </div>
            ${itemsHtml || '<p style="text-align:center; color:#666;">Sin historial disponible.</p>'}
        </div>
    `;

    const printWindow = window.open('', '', 'height=800,width=1024');
    printWindow.document.write('<html><head><title>Historial del Ticket</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000; }');
    printWindow.document.write('h2 { color: #003594; }');
    printWindow.document.write('@media print { body { -webkit-print-color-adjust: exact; } }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
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
const modalComponentesEl = document.getElementById('modalComponentes');
const tbodyComponentes = document.getElementById('tbodyComponentes');
const contadorComponentes = document.getElementById('contadorComponentes');
const botonCargarComponentes = document.getElementById('hiperbinComponents');
const ModalBotonCerrar = document.getElementById('BotonCerrarModal');

// Inicializa el modal de Bootstrap una sola vez.
const modalComponentes = new bootstrap.Modal(modalComponentesEl, {
  keyboard: false,
  backdrop: 'static'
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
  xhr.onload = function () {
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

  xhr.onerror = function () {
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

  xhr.onload = function () {
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

  xhr.onerror = function () {
    Swal.fire('Error de red', 'No se pudo conectar con el servidor para obtener los componentes.', 'error');
  };

  xhr.send(dataToSendString);
}

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

  if (modalCerrarComponnets) {
    modalCerrarComponnets.addEventListener('click', function () {
      modalComponentes.hide();
    });
  }
  showSelectComponentsModal(ticketId, regionName, serialPos);
}

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
    return `http://localhost/Documentos/${cleanPath}`;
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
                              console.log('Correo rechazo enviado:', responseEmail.message || 'OK');
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
});


function getTicketStatusVisual(statusTicket, accionTicket) {
  let statusClass = '';
  let statusText = '';
  let statusIcon = '';
  
  if (statusTicket === 'Abierto' || 
      accionTicket === 'Asignado a la Coordinación' ||
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
  
  // Si accionTicket es un array, usar el primer elemento
  const actionToUse = Array.isArray(accionTicket) ? accionTicket[0] : accionTicket;
  
  const { statusClass, statusText, statusIcon } = getTicketStatusVisual(statusTicket, actionToUse);
  
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