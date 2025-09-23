let ModalTimelineInstance = null; // Variable para la instancia del modal de línea de tiempo

let usuariosAcciones = {
  coordinador: {
    modulo: 'asignar_tecnico',
    modalId: 'asignadoTecnicoModal', // Replace with actual modal ID
    buttonId: 'btn-asignados',
    filterTerm: 'Recibido por la Coordinación|Asignado a la Coordinación',
    acciones: [3, 4],
  },

  tecnico: {
    modulo: 'tecnico',
    modalId: 'tecnicoModal', // Replace with actual modal ID (e.g., for Recibido/Reasignado)
    buttonId: 'btn-recibidos',
    filterTerm: 'Asignado al Técnico|Recibido por el Técnico|Reasignado al Técnico|Entregado a Cliente',
    acciones: [6, 10, 11, 16], // Added 11 for Reasignado al Técnico
  },

  // Add other roles as needed, e.g., for Entregado a Cliente
  cliente: {
    modulo: 'region',
    modalId: 'entregadoClienteModal', // From your provided HTML
    buttonId: 'btn-devuelto',
    filterTerm: 'Entregado a Cliente',
    acciones: [16], // Adjust id_accion_ticket as needed
  },

  taller: {
    modulo: 'taller',
    modalId: 'enviadoTallerModal', // Replace with actual modal ID
    buttonId: 'btn-por-asignar',
    filterTerm: 'Enviado a taller|En Taller|En espera confirmación carga de llaves',
    acciones: [7, 15, 8], // Adjust id_accion_ticket as needed
  },
};

function redirigirPorAccion(idStatusAccion, idTicket, nroTicket) {
  console.log(`Redirigiendo para acción: ${idStatusAccion}, Ticket ID: ${idTicket}, Nro Ticket: ${nroTicket}`);
  for (const usuario in usuariosAcciones) {
    if (usuariosAcciones[usuario].acciones.includes(idStatusAccion)) {
      const modulo = usuariosAcciones[usuario].modulo;
      const url = `${modulo}?id_ticket=${idTicket}&nro_ticket=${encodeURIComponent(nroTicket)}`;
      window.location.href = url; // Perform the redirect
      return;
    }
  }
  // If no matching action is found
  console.log(`Acción ${idStatusAccion} no encontrada. No se pudo redirigir.`);
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: `Acción ${idStatusAccion} no encontrada. No se pudo redirigir.`,
    confirmButtonText: 'Ok',
    confirmButtonColor: '#003594',
    color: 'black'
  });
}


// Variable para almacenar todos los tickets cargados (sin filtrar)
let allOpenTickets = [];
let allProcessTickets = []; // Separar datos para tickets en proceso
let allResolvedTickets = [];
let allTallerTickets = [];// Variables globales para almacenar los tickets comerciales y manejar la búsqueda
let allComercialTickets = [];
let allIndividualTickets = [];
let allRegionTickets = [];
let allInporceesReparacionTickets = []; // ��NUEVO: Tickets en proceso de reparación
let allReparadoTickets = []; // Global variable to store all repaired tickets
let allPendienteRepuestoTickets = []; // Global variable to store all pending spare parts tickets
let allEntregadoClienteTickets = []; // Global variable to store all tickets delivered to client
let allIrreparableTickets = []; // Global variable to store all irreparable tickets

let currentRegion = null; // Variable global para almacenar la región actual en el modal de región
let currentMonth = null;
let currentStatus = null;

let allIrreparableTicketsSearchHandler = null; // Global variable for search handler
let allEntregadoClienteTicketsSearchHandler = null; // Global variable for search handler
let allPendienteRepuestoTicketsSearchHandler = null; // Global variable for search handler
let allReparadoTicketsSearchHandler = null; // Global variable for search handler
let allInporceesReparacionTicketsSearchHandler = null; // ��NUEVO: Tickets en proceso de reparación
let regionTicketSearchHandler = null;
let monthlyTicketSearchHandler = null;
let comercialTicketSearchHandler = null;
let tallerTicketSearchHandler = null;
let ticketSearchHandler = null;
let resolvedTicketSearchHandler = null;

/*document.addEventListener("DOMContentLoaded", (event) => {
  const anchoPantalla = window.innerWidth;
  const altoPantalla = window.innerHeight;
  console.log(`Ancho de la pantalla: ${anchoPantalla}px`);
  console.log(`Alto de la pantalla: ${altoPantalla}px`);
});*/


// --- Helpers de API: construcción de URL y parseo seguro de JSON ---
function buildApiUrl(actionPath) {
  // Si el servidor NO tiene habilitado mod_rewrite, usa index.php?url=
  const base = `${ENDPOINT_BASE}${APP_PATH}`;
  const direct = `${base}api/reportes/${actionPath}`;
  if (window.SERVER_REWRITE_DISABLED === true) {
    return `${base}index.php?url=api/reportes/${actionPath}`;
  }
  return direct;
}

async function fetchJsonByAction(actionPath, fetchOptions = {}) {
  const url = buildApiUrl(actionPath);
  let res;
  try {
    res = await fetch(url, fetchOptions);
  } catch (e) {
    throw e;
  }

  // Si 404 y no usamos index.php, reintenta con index.php?url=
  if (res.status === 404 && window.SERVER_REWRITE_DISABLED !== true) {
    const fallbackUrl = `${ENDPOINT_BASE}${APP_PATH}api/reportes/${actionPath}`;
    res = await fetch(fallbackUrl, fetchOptions);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`Respuesta no-JSON para ${actionPath}:`, text);
    throw new Error('Invalid JSON');
  }
}

function showNoDataMessage(container, message = "No hay datos disponibles.") {
  if (container) {
    container.innerHTML = `
      <div class="text-center text-muted py-5">
        <div class="d-flex flex-column align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
          </svg>
          <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
          <p class="text-muted mb-0">${message}</p>
        </div>
      </div>`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // --- Referencias a los elementos HTML de los Modales ---
  const monthlyTicketsModalElement = document.getElementById("monthlyTicketsModal");
  const regionTicketsModalElement = document.getElementById("RegionTicketsModal");
  const openTicketsModalElement = document.getElementById("OpenTicketModal");
  const resolveTicketsModalElement = document.getElementById("ResolveTicketsModal");
  const sendTallerTicketsModalElement = document.getElementById("SendTallerTicketsModal"); // ¡NUEVO MODAL!
  const processTicketModalElement = document.getElementById("ProcessTicketsModal"); // ��NUEVO MODAL!
  const gestionCoordinadorModalElement = document.getElementById("DetalleTicketComercial"); // ��NUEVO MODAL!
  const EntregadoClienteModalElement = document.getElementById("entregadoClienteModal"); // ��NUEVO MODAL!


  const ModalReparacion = document.getElementById("procesoReparacionModal"); // ��NUEVO ELEMENTO!
  const ModalReparado = document.getElementById("ReparadosModal"); // ��NUEVO ELEMENTO!
  const ModalPendienteRepuesto = document.getElementById("pendienterespuestoModal"); // ��NUEVO ELEMENTO!
  const ModalTikIrreparable = document.getElementById("IrreparableModal"); // ��NUEVO ELEMENTO!
  const timelineModalElement = document.getElementById("TimelineModal");

  // --- Instancias de Bootstrap Modals (declaradas para ser accesibles globalmente dentro de este scope) ---
  let monthlyTicketsModalInstance = null;
  let regionTicketsModalInstance = null;
  let openTicketsModalInstance = null;
  let resolveTicketsModalInstance = null;
  let sendTallerTicketsModalInstance = null; // ¡NUEVA INSTANCIA!
  let ModalProcesoReparacion = null; // ��NUEVO ELEMENTO!
  let ModalReparados = null; // ��NUEVO ELEMENTO!
  let ModalPendiRepuesto = null; // ��NUEVO ELEMENTO!
  let ModalIrreparable = null; // ��NUEVO ELEMENTO!
  let ModalprocessTicketsModalInstance = null; // ��NUEVO ELEMENTO!
  let modal_gestionCoordinadorInstance = null; // ��NUEVO ELEMENTO!
  let EntregadoClienteModalInstance = null; // ��NUEVO ELEMENTO!

  if(EntregadoClienteModalElement) {
    EntregadoClienteModalInstance = new bootstrap.Modal(EntregadoClienteModalElement);
  }
  
  if(gestionCoordinadorModalElement){
    modal_gestionCoordinadorInstance = new bootstrap.Modal(gestionCoordinadorModalElement);
  }

  if (timelineModalElement) {
      ModalTimelineInstance = new bootstrap.Modal(timelineModalElement);
    }

  // --- Inicializar las instancias de los modales (UNA SOLA VEZ al cargar la página) ---
  if (monthlyTicketsModalElement) {  
    monthlyTicketsModalInstance = new bootstrap.Modal(monthlyTicketsModalElement);
  }

  if (regionTicketsModalElement) {
    regionTicketsModalInstance = new bootstrap.Modal(regionTicketsModalElement);
  }

  if (openTicketsModalElement) {
    openTicketsModalInstance = new bootstrap.Modal(openTicketsModalElement);
  }

  if (resolveTicketsModalElement) {
    resolveTicketsModalInstance = new bootstrap.Modal(
      resolveTicketsModalElement
    );
  }

  if (sendTallerTicketsModalElement) {
    // ¡NUEVO!
    sendTallerTicketsModalInstance = new bootstrap.Modal(
      sendTallerTicketsModalElement
    );
  }

  if(processTicketModalElement) {
    ModalprocessTicketsModalInstance = new bootstrap.Modal(processTicketModalElement);
  }

  if (ModalReparacion) {
    // ��NUEVO!
    ModalProcesoReparacion = new bootstrap.Modal(ModalReparacion);
  }

  if (ModalReparado) {
    // ��NUEVO!
    ModalReparados = new bootstrap.Modal(ModalReparado);
  }

  if(ModalPendienteRepuesto) {
    modalPendienteRepa = new bootstrap.Modal(ModalPendienteRepuesto);
  }

  if(ModalTikIrreparable) {
    ModalIrreparable = new bootstrap.Modal(ModalTikIrreparable);
  }
  // --- Event Listeners para ABRIR Modales (desde tarjetas/botones) ---

  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('view-timeline-btn')) {
      event.preventDefault(); // Evita el comportamiento predeterminado del enlace/botón

      const ticketId = event.target.dataset.idTicket;
      document.getElementById('timelineTicketId').textContent = ticketId;
     loadTicketTimeline(ticketId); // Carga los datos específicos del ticket en el modal

      const timelineModalElement = document.getElementById("TimelineModal");
      if (timelineModalElement) {
        ModalTimelineInstance = new bootstrap.Modal(timelineModalElement); // ¡Aquí se recrea la instancia!
        ModalTimelineInstance.show();
      } else {
        console.error("Error: Elemento TimelineModal no encontrado para crear instancia. No se puede mostrar el modal de línea de tiempo.");
      }
    }
  });

  const EntregadoClienteCard = document.getElementById("OpenModalEntregadoCliente");
  if(EntregadoClienteCard && EntregadoClienteModalInstance) {
    EntregadoClienteCard.addEventListener("click", function(event) {
      event.preventDefault();
      EntregadoClienteModalInstance.show();
      loadEntregadoClienteDetails();
    });
  } else {
    console.error("Error: EntregadoClienteCard o EntregadoClienteModalInstance no encontrados.");
  }

  // 1. Abrir monthlyTicketsModal
  const monthlyTicketsCard = document.getElementById("monthlyTicketsCard");
  if (monthlyTicketsCard && monthlyTicketsModalInstance) {
    monthlyTicketsCard.addEventListener("click", function (event) {
      event.preventDefault();
      monthlyTicketsModalInstance.show();
      loadMonthlyTicketDetails();
    });
  } else {
    console.error("monthlyTicketsCard o monthlyTicketsModal no encontrados.");
  }

  // 2. Abrir OpenTicketModal
  const TicketsOpenCard = document.getElementById("Card-Ticket-open");
  if (TicketsOpenCard && openTicketsModalInstance) {
    TicketsOpenCard.addEventListener("click", function (event) {
      event.preventDefault();
      openTicketsModalInstance.show();
      loadOpenTicketDetails();
    });
  } else {
    console.error("TicketsOpenCard o OpenTicketModal no encontrados.");
  }

  // 3. Abrir RegionTicketsModal
  const regionTicketsCard = document.getElementById("RegionTicketsCard");
  if (regionTicketsCard && regionTicketsModalInstance) {
    regionTicketsCard.addEventListener("click", function (event) {
      event.preventDefault();
      regionTicketsModalInstance.show();
      loadRegionTicketDetails();
    });
  } else {
    console.error("RegionTicketsCard o RegionTicketsModal no encontrados.");
  }

  // 4. Abrir ResolveTicketsModal
  // Nota: Habías cambiado el ID a "Card-resolve-ticket" aquí. Lo mantengo.
  const resolveTicketsCard = document.getElementById("Card-resolve-ticket");
  if (resolveTicketsCard && resolveTicketsModalInstance) {
    resolveTicketsCard.addEventListener("click", function (event) {
      event.preventDefault();
      resolveTicketsModalInstance.show();
      loadResolveTicketDetails();
    });
  } else {
    console.error("Card-resolve-ticket o ResolveTicketsModal no encontrados.");
  }

  // 5. Abrir SendTallerTicketsModal (¡NUEVO!)
  // ASUMO: Que la tarjeta para este modal tendrá el ID "Card-Send-To-Taller".
  const sendTallerTicketsCard = document.getElementById("Card-Send-To-Taller");
  if (sendTallerTicketsCard && sendTallerTicketsModalInstance) {
    sendTallerTicketsCard.addEventListener("click", function (event) {
      event.preventDefault();
      sendTallerTicketsModalInstance.show();
      loadTallerTicketDetails(); // Nueva función para cargar detalles
    });
  } else {
    console.error(
      "Card-Send-To-Taller o SendTallerTicketsModal no encontrados."
    );
  }

  const OpenModalReparacion = document.getElementById("ModalPostReparacion");
  if (OpenModalReparacion && ModalProcesoReparacion) {
    OpenModalReparacion.addEventListener("click", function (event) {
      event.preventDefault();
      ModalProcesoReparacion.show();
      loadIndividualProceessReparacion(); // Nueva función para cargar detalles del proceso de reparación
      // Aquí puedes agregar código para mostrar los detalles del ticket de reparación
    });
  } else {
    console.error(
      "OpenModalReparacion o ModalProcesoReparacion no encontrados."
    );
  }

  const OpenModalReparado = document.getElementById("OpenModalPostReparado");
  if (OpenModalReparado && ModalReparados) {
    OpenModalReparado.addEventListener("click", function (event) {
      event.preventDefault();
      ModalReparados.show();
      loadIndividualReparado(); // Nueva función para cargar detalles del ticket de reparación
      // Aquí puedes agregar código para mostrar los detalles del ticket de reparación
    });
  } else {
    console.error(
      "OpenModalReparado o ModalReparados no encontrados."
    );
  }

  const openModalGestionComercial = document.getElementById("Card-Comercial-Ticket");
  if (openModalGestionComercial && modal_gestionCoordinadorInstance) {
    openModalGestionComercial.addEventListener("click", function (event) {
      event.preventDefault();
      modal_gestionCoordinadorInstance.show();
      loadDetalleTicketComercial(); // Nueva función para cargar detalles del ticket de reparación
      // Aquí puedes agregar código para mostrar los detalles del ticket de reparación
    });
  } else {
    console.error(
      "openModalGestionComercial o modal_gestionCoordinadorInstance no encontrados."
    );
  }

  function forceCloseTimelineModal() {
    const modalElement = document.getElementById("TimelineModal");
    if (modalElement) {
        modalElement.classList.remove('show');
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.style.display = 'none';

        const backdrop = document.querySelector('.modal-backdrop.show');
        if (backdrop) {
            backdrop.remove();
        }

        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Importante: Eliminar la instancia de Bootstrap para que se recree.
        if (ModalTimelineInstance) {
            ModalTimelineInstance.dispose(); // Libera los eventos y recursos de Bootstrap
            ModalTimelineInstance = null; // Establece a null para que se pueda recrear
        }

        console.log("Cierre forzado del modal de línea de tiempo.");
    } else {
        console.error("No se encontró el elemento #TimelineModal para cierre forzado.");
    }
  }

  const cerrarModalEntregadoacliente = document.getElementById("ModalEntregadoClienteCerrar");
  if(cerrarModalEntregadoacliente && EntregadoClienteModalInstance) {
    cerrarModalEntregadoacliente.addEventListener("click", function() {
      EntregadoClienteModalInstance.hide();
    });
  }

  const cerraTimeLineModal = document.getElementById("CloseCerrarTimeline");
  const iconCerrarTimeLine = document.getElementById("IconCloseTimeline");
  // Cómo usarla en tus listeners (reemplazando ModalTimelineInstance.hide()):
  if (cerraTimeLineModal && ModalTimelineInstance) { // Mantén la condición ModalTimelineInstance para asegurar que ya se inicializó
    cerraTimeLineModal.addEventListener('click', function() {
      forceCloseTimelineModal(); // Llama a la función de cierre forzado
      // No necesitas el console.log de la instancia aquí, ya que el control es manual.
    });
  }

  if (iconCerrarTimeLine && ModalTimelineInstance) {
    iconCerrarTimeLine.addEventListener('click', function() {
      forceCloseTimelineModal(); // Llama a la función de cierre forzado
    });
  }


  const OpenModalPendienteRepuesto = document.getElementById("OpenModalPendienteRepuesto");
  if (OpenModalPendienteRepuesto && modalPendienteRepa) {
    OpenModalPendienteRepuesto.addEventListener("click", function (event) {
      event.preventDefault();
      modalPendienteRepa.show();
      loadIndividualPendienteRepuesto(); // Nueva función para cargar detalles del ticket de reparación
      // Aquí puedes agregar código para mostrar los detalles del ticket de reparación
    });
  }

  const OpenModalIrreparable = document.getElementById("OpenModalIrreparable");

  if (OpenModalIrreparable && ModalIrreparable) {
    OpenModalIrreparable.addEventListener("click", function (event) {
      event.preventDefault();
      ModalIrreparable.show();
      loadIndividualIrreparable(); // Nueva función para cargar detalles del ticket de reparación
      // Aquí puedes agregar código para mostrar los detalles del ticket de reparación
    });
  }

  const OpenModalProcess = document.getElementById("Card-Ticket-process");

  if (OpenModalProcess && ModalprocessTicketsModalInstance) {
    OpenModalProcess.addEventListener("click", function (event) {
      event.preventDefault();
      ModalprocessTicketsModalInstance.show();
      loadIndividualProceess(); // Nueva función para cargar detalles del proceso de reparación
      // Aquí puedes agregar código para mostrar los detalles del ticket de reparación
    }); 
  } else {
    console.error(
      "OpenModalProcess o ModalProcesoReparacion no encontrados."
    );
  }
  
  function forceCleanupAfterModalClose() {
    // Quitar la clase 'modal-open' del body si persiste
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
      // Restablecer overflow y padding-right si fueron modificados por Bootstrap
      document.body.style.overflow = ''; 
      document.body.style.paddingRight = ''; 
    }

    // Eliminar cualquier backdrop residual que tenga la clase 'show' (visible)
    const backdrops = document.querySelectorAll('.modal-backdrop.show');
    if (backdrops.length > 0) {
      backdrops.forEach(backdrop => {
        backdrop.remove();
      });
    }
  }
  // --- Event Listeners para CERRAR Modales (desde botones dentro del modal) ---

  const cerrarModalComecial = document.getElementById("ModalComercialDetalle");

  if(cerrarModalComecial && modal_gestionCoordinadorInstance) {
    cerrarModalComecial.addEventListener("click", function() {
      modal_gestionCoordinadorInstance.hide();
    });
  }

  // 1. Botones de cierre para monthlyTicketsModal
  const cerrarMonthly = document.getElementById("ModalStadisticMonth");

  if (cerrarMonthly && monthlyTicketsModalInstance) {
    cerrarMonthly.addEventListener("click", function () {
      monthlyTicketsModalInstance.hide();
    });
  }

  // 2. Botones de cierre para RegionTicketsModal
  const cerrarRegion = document.getElementById("ModalStadisticRegion");

  if (cerrarRegion && regionTicketsModalInstance) {
    cerrarRegion.addEventListener("click", function () {
      regionTicketsModalInstance.hide();
    });
  }

  // 3. Botones de cierre para OpenTicketModal
  const cerrarOpen = document.getElementById("ModalOpen");

  if (cerrarOpen && openTicketsModalInstance) {
        cerrarOpen.addEventListener("click", function () {
            openTicketsModalInstance.hide();
            // AÑADE ESTE CÓDIGO AQUÍ PARA QUE SE EJECUTE AL CLIC DEL BOTÓN "Cerrar"
            forceCleanupAfterModalClose();
        });
    }

  // 4. Botones de cierre para ResolveTicketsModal
  const cerrarResolve = document.getElementById("ModalResolveRegion");

  if (cerrarResolve && resolveTicketsModalInstance) {
    cerrarResolve.addEventListener("click", function () {
      resolveTicketsModalInstance.hide();
    });
  }

  // 5. Botones de cierre para SendTallerTicketsModal (¡NUEVO!)
  const cerrarTaller = document.getElementById("ModalTallerRegion"); // El ID de tu botón "Cerrar" en el footer

  if (cerrarTaller && sendTallerTicketsModalInstance) {
    cerrarTaller.addEventListener("click", function () {
      sendTallerTicketsModalInstance.hide();
    });
  }

  // 6. Botones de cierre para processTicketModalElement (��NUEVO!)
  const cerrarProcess = document.getElementById("ModalProcess"); // El ID de tu botón "Cerrar" en el footer

  if (cerrarProcess && ModalprocessTicketsModalInstance) {
    cerrarProcess.addEventListener("click", function () {
      ModalprocessTicketsModalInstance.hide();
      forceCleanupAfterModalClose(); // <-- Se llama aquí
    });
  }

  const cerrarPenReparacion = document.getElementById("ModalProcessReparacion");

  if (cerrarPenReparacion && ModalProcesoReparacion) {
    cerrarPenReparacion.addEventListener("click", function () {
      ModalProcesoReparacion.hide();
    });
  }

  const cerrarPenReparado = document.getElementById("ModalReparado");

  if (cerrarPenReparado && ModalReparados) {
    cerrarPenReparado.addEventListener("click", function () {
      ModalReparados.hide();
    });
  }

  const cerrarPenPendienteRepuesto = document.getElementById(
    "ModalPendiRespuu"
  );

  if(cerrarPenPendienteRepuesto && modalPendienteRepa) {
    cerrarPenPendienteRepuesto.addEventListener("click", function () {
      modalPendienteRepa.hide();
    });
  }

  const cerrarPenIrreparable = document.getElementById(
    "ModalIrreparableTik"
  );

  if (cerrarPenIrreparable && ModalIrreparable) {
    cerrarPenIrreparable.addEventListener("click", function () {
      ModalIrreparable.hide();
    });
  }

  // A. Clics dentro de monthlyTicketsContent
  const monthlyTicketsContent = document.getElementById("monthlyTicketsContent");

  if (monthlyTicketsContent) {
    monthlyTicketsContent.addEventListener("click", function (event) {
      const clickedButton = event.target.closest(".monthly-tickets-detail");
      if (clickedButton) {
        const month = clickedButton.dataset.month;
        const status = clickedButton.dataset.status;
        const count = clickedButton.dataset.count;

        if (parseInt(count) > 0) {
          loadIndividualTicketDetails(month, status);
        } else {
          Swal.fire({
            icon: "info",
            title: "Sin Tickets",
            html: `No hay tickets ${status.toLowerCase()}s en la fecha <strong>${month}</strong>.`,
            confirmButtonText: "Ok",
            confirmButtonColor: "#003594",
          });
        }
      }
    });
  }

  // B. Clics dentro de RegionTicketsContent
  const regionTicketsContent = document.getElementById("RegionTicketsContent");
  if (regionTicketsContent) {
    regionTicketsContent.addEventListener("click", function (event) {
      const clickedButton = event.target.closest(
        ".region-tickets-total-detail"
      );
      if (clickedButton) {
        const region = clickedButton.dataset.region;
        const count = clickedButton.dataset.count;

        if (parseInt(count) > 0) {
          loadIndividualRegionTicketDetails(region);
        } else {
          Swal.fire({
            icon: "info",
            title: "Sin Tickets",
            html: `No hay tickets para la región de <strong>${region}</strong>.`,
            confirmButtonText: "Ok",
            confirmButtonColor: "#003594",
          });
        }
      }
    });
  }

  // D. Clics dentro de TallerTicketsContent (¡NUEVO! Si aplicara)
  const tallerTicketsContent = document.getElementById("TallerTicketsContent");
  if (tallerTicketsContent) {
    tallerTicketsContent.addEventListener("click", function (event) {
      const clickedButton = event.target.closest(".taller-ticket-detail"); // Clase de tus botones dentro de este modal
      if (clickedButton) {
        const ticketId = clickedButton.dataset.ticketId;
        // Si necesitas cargar más detalles de un ticket específico en el taller:
        // loadSpecificTallerTicketDetails(ticketId);
        console.log(`Clic en detalle de ticket de taller, ID: ${ticketId}`);
      }
    });
  }
});

function handleTicketSearch(event, ticketArray, containerId) {
    const inputEl = event && event.target ? event.target : null;
    if (!inputEl) return;

    const searchTerm = inputEl.value.trim();
    const searchTermLower = searchTerm.toLowerCase();
    const searchTermDigits = searchTerm.replace(/\D/g, '');
    let filteredTickets = [];

    if (searchTerm === '') {
        // Usa las variables globales para el mes y el estado
        const contentDiv = document.getElementById(containerId);
        if (contentDiv) {
            displayFilteredTickets(ticketArray, containerId, currentMonth, currentStatus);
        }
        return;
    } else {
        filteredTickets = (ticketArray || []).filter(ticket => {
            // Construir variantes de fecha
            const originalDate = (ticket.date_create_ticket || '').trim();
            const originalDateLower = originalDate.toLowerCase();
            const dateOnly = originalDateLower.substring(0, 10);
            const dateOnlySlashes = dateOnly.replace(/-/g, '/');
            const localizedDate = originalDate
                ? new Date(originalDate.replace(/-/g, '/')).toLocaleDateString('es-ES', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                }).toLowerCase()
                : '';
            const dateDigits = originalDate.replace(/\D/g, '');

            const matchesDate = (
                dateOnly.includes(searchTermLower) ||
                dateOnlySlashes.includes(searchTermLower) ||
                localizedDate.includes(searchTermLower) ||
                (searchTermDigits !== '' && dateDigits.includes(searchTermDigits))
            );

            return (
                (ticket.nro_ticket || '').toLowerCase().includes(searchTermLower) ||
                (ticket.serial_pos || ticket.serial_pos_cliente || '').toLowerCase().includes(searchTermLower) ||
                (ticket.razon_social_cliente || '').toLowerCase().includes(searchTermLower) ||
                (ticket.rif_empresa || ticket.rif_cliente || '').toLowerCase().includes(searchTermLower) ||
                (ticket.name_modelopos_cliente || '').toLowerCase().includes(searchTermLower) ||
                (ticket.name_status_payment || '').toLowerCase().includes(searchTermLower) ||
                (ticket.name_accion_ticket || '').toLowerCase().includes(searchTermLower) ||
                (ticket.status_name_ticket || '').toLowerCase().includes(searchTermLower) ||
                (ticket.name_status_domiciliacion || '').toLowerCase().includes(searchTermLower) ||
                (ticket.name_status_lab || '').toLowerCase().includes(searchTermLower) ||
                matchesDate
            );
        });
    }
    // Pasa los parámetros a displayFilteredTickets
    displayFilteredTickets(filteredTickets, containerId, currentMonth, currentStatus);
}

function displayFilteredTickets(ticketsToDisplay, containerId, month = null, status = null) {
  const contentDiv = document.getElementById(containerId);

  if (!contentDiv) {
    showNoDataMessage(contentDiv, "No se encontraron el containerId.");
    return;
  }

  if (!ticketsToDisplay || ticketsToDisplay.length === 0) {
    showNoDataMessage(contentDiv, "No se encontraron tickets con los criterios de búsqueda.");
    return;
  }

  if (!ticketsToDisplay || ticketsToDisplay.length === 0) {
    // Solo mostrar mensaje de "no datos" si realmente no hay tickets en la base de datos
    // Si es una búsqueda vacía, no mostrar nada (se manejará en el event listener)
    if (containerId === 'OpenTicketModalContent' && allOpenTickets && allOpenTickets.length > 0) {
      // Si hay tickets en allOpenTickets pero la búsqueda está vacía, no mostrar mensaje
      return;
    }
    showNoDataMessage(contentDiv, "No se encontraron tickets con los criterios de búsqueda.");
    return;
  }

  // Usar la función de formato adecuada según el contenedor
  if (containerId === 'ProcessTicketsContent') {
    contentDiv.innerHTML = formatProcessTicketsDetails(ticketsToDisplay);
  } else if (containerId === 'ResolveTicketsContent') {
    contentDiv.innerHTML = formatResolveDetails(ticketsToDisplay);
  } else if (containerId === 'ReparacionModalTicketsContent') {
    contentDiv.innerHTML = formatProcessReparacionDetails(ticketsToDisplay);
  }else if (containerId === 'TallerTicketsContent') {
    contentDiv.innerHTML = formatTallerDetails(ticketsToDisplay);
  }else if (containerId === 'PendienteRespuesModalTicketsContent') {
    contentDiv.innerHTML = formatPendinRespueTicketsDetails(ticketsToDisplay);
  }else if (containerId === 'ReparadoModalTicketsContent') {
    contentDiv.innerHTML = formatReparadoTicketsDetails(ticketsToDisplay);
  }else if (containerId === 'EntregadoClienteModalTicketsContent') {
    contentDiv.innerHTML = formatEntregadoClienteDetails(ticketsToDisplay);
  }else if (containerId === 'IrreparableTikModalTicketsContent') {
    contentDiv.innerHTML = formatIrreparableTicketsDetails(ticketsToDisplay);
  } else if(containerId === 'ComercialTicketsContent') {
    contentDiv.innerHTML = formatDetalleTicketComercial(ticketsToDisplay);
  } else if(containerId === 'RegionTicketsContent') {
    // Si se llama desde la búsqueda, usa la función de formato individual de región
    if (currentRegion) {
         contentDiv.innerHTML = formatIndividualRegionTickets(ticketsToDisplay, currentRegion);
    } else {
         // Si no se ha pasado región, probablemente sea la carga inicial
         contentDiv.innerHTML = formatRegionDetails(ticketsToDisplay);
    }
  } else if(containerId === 'monthlyTicketsContent') {
    // Si se llama desde la búsqueda, usa la función de formato individual
    if (currentMonth && currentStatus) {
         contentDiv.innerHTML = formatIndividualTickets(ticketsToDisplay, currentMonth, currentStatus);
    } else {
         // Si no se han pasado mes y status, probablemente sea la carga inicial
         contentDiv.innerHTML = formatMonthlyDetails(ticketsToDisplay);
    }
  } else if(containerId === 'OpenTicketModalContent') {
    // Para tickets abiertos, usar formatOpenDetails
    const htmlContent = formatOpenDetails(ticketsToDisplay);
    contentDiv.innerHTML = htmlContent;
  } else {
    // Si no coincide con ninguno, usar formatOpenDetails como fallback
    const htmlContent = formatOpenDetails(ticketsToDisplay);
    contentDiv.innerHTML = htmlContent;
  }
  attachMarkReceivedListeners();
}

function loadIndividualIrreparable() {
    const contentDiv = document.getElementById("IrreparableTikModalTicketsContent");
    const searchInput = document.getElementById("ticketSearchInputIrreparable");

    contentDiv.innerHTML = "<p>Cargando información de los POS Irreparables...</p>"; // Loading message
    searchInput.value = ''; // Clear the search input on reload

    fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsIrreparables`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                allIrreparableTickets = data.details; // Store all irreparable tickets
                displayFilteredTickets(allIrreparableTickets, 'IrreparableTikModalTicketsContent'); // Display all tickets initially

                // Add event listener for search input with stable reference
                if (allIrreparableTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allIrreparableTicketsSearchHandler);
                }
                allIrreparableTicketsSearchHandler = (e) => {
                    handleTicketSearch(e, allIrreparableTickets, 'IrreparableTikModalTicketsContent');
                };
                searchInput.addEventListener('input', allIrreparableTicketsSearchHandler);
            } else {
                contentDiv.innerHTML =
                    "<p>Error al cargar los detalles de tickets irreparables: " +
                    (data.message || "Error desconocido") +
                    "</p>";
                console.error(
                    "Error en los datos de la API para tickets irreparables:",
                    data.message
                );
                allIrreparableTickets = []; // Clear on error
                if (allIrreparableTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allIrreparableTicketsSearchHandler);
                    allIrreparableTicketsSearchHandler = null;
                }
            }
        })
        .catch((error) => {
            contentDiv.innerHTML =
                `<div class="text-center text-muted py-5">
                    <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay tickets en Taller con estatus irreparable.</p>
                    </div>
                </div>`;
            console.error("Error fetching irreparable ticket details:", error);
            allIrreparableTickets = []; // Clear on error
            if (allIrreparableTicketsSearchHandler) {
                searchInput.removeEventListener('input', allIrreparableTicketsSearchHandler);
                allIrreparableTicketsSearchHandler = null;
            }
        });
}

function formatIrreparableTicketsDetails(details){
if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <div class="ticket-details-list mt-3">
    `;

  details.forEach((ticket) => {
    // <-- ¡Corregido aquí! Ahora usa 'details'
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Documento:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_payment || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${
                          ticket.date_create_ticket
                        }</dd> <!-- Usar la variable formateada -->
                    </dl>
                </div>
            </div>
        `;
  });
  html += `
        </div>
    `;
  return html;
}

function loadIndividualPendienteRepuesto() {
    const contentDiv = document.getElementById("PendienteRespuesModalTicketsContent");
    const searchInput = document.getElementById("ticketSearchInputRequiereRepuesto");

    contentDiv.innerHTML = "<p>Cargando información de los POS Pendientes por Repuestos...</p>"; // Loading message
    searchInput.value = ''; // Clear the search input on reload

    fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsPendientesPorRepuestos`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                allPendienteRepuestoTickets = data.details; // Store all pending spare parts tickets
                displayFilteredTickets(allPendienteRepuestoTickets, 'PendienteRespuesModalTicketsContent'); // Display all tickets initially
                attachMarkReceivedListeners(); // Attach listeners to "Mark as Received" buttons

                // Add event listener for search input with stable reference
                if (allPendienteRepuestoTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allPendienteRepuestoTicketsSearchHandler);
                }
                allPendienteRepuestoTicketsSearchHandler = (e) => {
                    handleTicketSearch(e, allPendienteRepuestoTickets, 'PendienteRespuesModalTicketsContent');
                };
                searchInput.addEventListener('input', allPendienteRepuestoTicketsSearchHandler);
            } else {
                contentDiv.innerHTML =
                    "<p>Error al cargar los detalles de tickets pendientes por repuestos: " +
                    (data.message || "Error desconocido") +
                    "</p>";
                console.error(
                    "Error en los datos de la API para tickets pendientes por repuestos:",
                    data.message
                );
                allPendienteRepuestoTickets = []; // Clear on error
                if (allPendienteRepuestoTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allPendienteRepuestoTicketsSearchHandler);
                    allPendienteRepuestoTicketsSearchHandler = null;
                }
            }
        })
        .catch((error) => {
            contentDiv.innerHTML =
                `<div class="text-center text-muted py-5">
                    <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay tickets en Taller con estatus pendiente por repuestos.</p>
                    </div>
                </div>`;
            console.error("Error fetching pendiente repuesto ticket details:", error);
            allPendienteRepuestoTickets = []; // Clear on error
            if (allPendienteRepuestoTicketsSearchHandler) {
                searchInput.removeEventListener('input', allPendienteRepuestoTicketsSearchHandler);
                allPendienteRepuestoTicketsSearchHandler = null;
            }
        });
}

function formatPendinRespueTicketsDetails(details){
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <div class="ticket-details-list mt-3">
    `;

  details.forEach((ticket) => {
    // <-- ¡Corregido aquí! Ahora usa 'details'
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Documento:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_payment || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>
                        
                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${
                          ticket.date_create_ticket
                        }</dd> <!-- Usar la variable formateada -->
                    </dl>
                </div>
            </div>
        `;
  });
  html += `
        </div>
    `;
  return html;
}

function loadIndividualReparado() {
    const contentDiv = document.getElementById("ReparadoModalTicketsContent");
    const searchInput = document.getElementById("ticketSearchInputReparado");

    contentDiv.innerHTML = "<p>Cargando información de los POS Reparados...</p>"; // Loading message
    searchInput.value = ''; // Clear the search input on reload

    fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsYaEstanReparados`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                allReparadoTickets = data.details; // Store all repaired tickets
                displayFilteredTickets(allReparadoTickets, 'ReparadoModalTicketsContent'); // Display all tickets initially
                attachMarkReceivedListeners(); // Attach listeners to "Mark as Received" buttons

                // Add event listener for search input with stable reference
                if (allReparadoTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allReparadoTicketsSearchHandler);
                }
                allReparadoTicketsSearchHandler = (e) => {
                    handleTicketSearch(e, allReparadoTickets, 'ReparadoModalTicketsContent');
                };
                searchInput.addEventListener('input', allReparadoTicketsSearchHandler);
            } else {
                contentDiv.innerHTML =
                    "<p>Error al cargar los detalles de tickets reparados: " +
                    (data.message || "Error desconocido") +
                    "</p>";
                console.error(
                    "Error en los datos de la API para tickets reparados:",
                    data.message
                );
                allReparadoTickets = []; // Clear on error
                if (allReparadoTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allReparadoTicketsSearchHandler);
                    allReparadoTicketsSearchHandler = null;
                }
            }
        })
        .catch((error) => {
            contentDiv.innerHTML =
                `<div class="text-center text-muted py-5">
                    <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay tickets en Taller con estatus reparado.</p>
                    </div>
                </div>`;
            console.error("Error fetching reparado ticket details:", error);
            allReparadoTickets = []; // Clear on error
            if (allReparadoTicketsSearchHandler) {
                searchInput.removeEventListener('input', allReparadoTicketsSearchHandler);
                allReparadoTicketsSearchHandler = null;
            }
        });
}

function formatReparadoTicketsDetails(details){
if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <div class="ticket-details-list mt-3">
    `;

  details.forEach((ticket) => {
    // <-- ¡Corregido aquí! Ahora usa 'details'
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white"  id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Documento:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_payment || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>
                        
                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${
                          ticket.date_create_ticket
                        }</dd> <!-- Usar la variable formateada -->
                    </dl>
                </div>
            </div>
        `;
  });
  return html;
}

function loadIndividualProceessReparacion() {
    const contentDiv = document.getElementById("ReparacionModalTicketsContent");
    const searchInput = document.getElementById("ticketSearchInputEnProceso");

    contentDiv.innerHTML = "<p>Cargando información de los POS en proceso de reparación...</p>"; // Mensaje de carga
    searchInput.value = ''; // Limpiar el campo de búsqueda al recargar

    fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsPendienteReparacion`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                allInporceesReparacionTickets = data.details; // Almacenar todos los tickets
                displayFilteredTickets(allInporceesReparacionTickets, 'ReparacionModalTicketsContent'); // Mostrar todos al principio

                // Añadir event listener para el input de búsqueda con referencia estable
                if (allInporceesReparacionTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allInporceesReparacionTicketsSearchHandler);
                }
                allInporceesReparacionTicketsSearchHandler = (e) => {
                    handleTicketSearch(e, allInporceesReparacionTickets, 'ReparacionModalTicketsContent');
                };
                searchInput.addEventListener('input', allInporceesReparacionTicketsSearchHandler);
            } else {
                contentDiv.innerHTML =
                    "<p>Error al cargar los detalles de tickets en proceso de reparación: " +
                    (data.message || "Error desconocido") +
                    "</p>";
                console.error(
                    "Error en los datos de la API para tickets en proceso de reparación:",
                    data.message
                );
                allInporceesReparacionTickets = []; // Limpiar por si hubo error
                if (allInporceesReparacionTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allInporceesReparacionTicketsSearchHandler);
                    allInporceesReparacionTicketsSearchHandler = null;
                }
            }
        })
        .catch((error) => {
            contentDiv.innerHTML =
                `<div class="text-center text-muted py-5">
                    <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay tickets en proceso de reparación.</p>
                    </div>
                </div>`;
            console.error("Error fetching reparacion ticket details:", error);
            allInporceesReparacionTickets = []; // Limpiar por si hubo error
            if (allInporceesReparacionTicketsSearchHandler) {
                searchInput.removeEventListener('input', allInporceesReparacionTicketsSearchHandler);
                allInporceesReparacionTicketsSearchHandler = null;
            }
        });
}

function formatProcessReparacionDetails(details) {
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <div class="ticket-details-list mt-3">
    `;

  details.forEach((ticket) => {
    // <-- ¡Corregido aquí! Ahora usa 'details'
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Documentos:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_payment || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>
                        
                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${
                          ticket.date_create_ticket
                        }</dd> <!-- Usar la variable formateada -->
                    </dl>
                </div>
            </div>
        `;
  });
  html += `
        </div>
    `;
  return html;
}

function loadIndividualTicketDetails(month, status) {
  const contentDiv = document.getElementById("monthlyTicketsContent");
  const searchInput = document.getElementById("ticketSearchInputMensual");

  // Almacenar el mes y el estado en variables globales
  currentMonth = month;
  currentStatus = status;

  contentDiv.innerHTML = `<p>Cargando tickets ${status.toLowerCase()}s en la fecha ${month}...</p>`;
  
  if (searchInput) {
    searchInput.value = '';
    searchInput.style.display = "inline-block";
  }

  // Usar la API fetch para la petición
  const dataToSend = new URLSearchParams({
    action: "GetIndividualTicketDetails",
    month: month,
    status: status,
  }).toString();

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetIndividualTicketDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: dataToSend,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        allIndividualTickets = data.details;
        displayFilteredTickets(allIndividualTickets, 'monthlyTicketsContent', currentMonth, currentStatus);
        
        if (searchInput) {
            if (monthlyTicketSearchHandler) {
                searchInput.removeEventListener('input', monthlyTicketSearchHandler);
            }
            monthlyTicketSearchHandler = (e) => {
                // Ya no necesitas pasar month y status, ya que son variables globales
                handleTicketSearch(e, allIndividualTickets, 'monthlyTicketsContent');
            };
            searchInput.addEventListener('input', monthlyTicketSearchHandler);
        }

      } else {
        contentDiv.innerHTML = `<p>Error al cargar el detalle de tickets ${status.toLowerCase()}s: ` + (data.message || "Error desconocido") + `</p>`;
        console.error("Error en los datos de la API para tickets individuales:", data.message);
        allIndividualTickets = [];
        if (searchInput && monthlyTicketSearchHandler) {
            searchInput.removeEventListener('input', monthlyTicketSearchHandler);
            monthlyTicketSearchHandler = null;
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching individual ticket details:", error);
      contentDiv.innerHTML = `<p>Error de red al cargar el detalle de tickets ${status.toLowerCase()}s. Por favor, intente de nuevo más tarde.</p>`;
      allIndividualTickets = [];
      if (searchInput && monthlyTicketSearchHandler) {
          searchInput.removeEventListener('input', monthlyTicketSearchHandler);
          monthlyTicketSearchHandler = null;
      }
    });
}

function formatIndividualTickets(tickets, month, status) {

  if (tickets.length === 0) {
    return `<p>No hay tickets ${status.toLowerCase()}s para ${month}.</p>
                <button class="btn btn-primary mt-3" onclick="loadMonthlyTicketDetails()">Volver al resumen</button>`;
  }

  let html = `
        <h5 style = "color:black;">Tickets ${status}s para ${month}</h5>
        <div class="ticket-details-list mt-3">
    `;

  tickets.forEach((ticket) => {
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Nivel Falla:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_level_failure || "No Aplica"
                        }</dd>

                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Documento:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_payment || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>
                        
                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${ticket.date_create_ticket}</dd>
                    </dl>
                </div>
            </div>
        `;
  });

  html += `
        </div>
        <button class="btn btn-primary mt-3" onclick="loadMonthlyTicketDetails()">Volver al resumen</button>
    `;
  return html;
}

function loadMonthlyTicketDetails() {
  const contentDiv = document.getElementById("monthlyTicketsContent");
  contentDiv.innerHTML = "<p>Cargando información...</p>"; // Mensaje de carga

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetMonthlyTicketDetails`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        contentDiv.innerHTML = formatMonthlyDetails(data.details); // Renderizar los datos
      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error("Error en los datos de la API:", data.message);
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
  `<tr>
        <td colspan="14" class="text-center text-muted py-5">
          <div class="d-flex flex-column align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
              <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
            <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
            <p class="text-muted mb-0">No hay tickets Abiertos para cargar la gráfica mensual.</p>
          </div>
        </td>
      </tr>`
      console.error("Error fetching monthly details:", error);
    });
}

function formatMonthlyDetails(details) {

  const SearchInput = document.getElementById('ticketSearchInputMensual');

  if (SearchInput) {
    SearchInput.style.display = 'none'; // Limpiar el campo de búsqueda
  }


  let html = `
        <p>Haz clic en el número de tickets para ver el detalle.</p>
        <table class="table table-striped table-bordered mt-3">
            <thead>
                <tr>
                    <th>Mes</th>
                    <th>Tickets Creados</th>
                    <th>Abiertos</th>
                    <th>En Proceso</th>
                    <th>Cerrados</th>
                </tr>
            </thead>
            <tbody>
    `;

  details.forEach((item) => {
    const monthName = item.month_name.trim();
    const year = item.year_month.substring(0, 4);

    html += `
            <tr>
                <td>${monthName} ${year}</td> 
                <td>${item.total_tickets_creados_mes}</td>
                <td>
                    <button class="btn btn-link p-0 monthly-tickets-detail" 
                            data-month="${item.year_month}" 
                            data-status="Abierto" 
                            data-count="${item.tickets_abiertos}">
                        ${item.tickets_abiertos}
                    </button>
                </td>
                <td>
                    <button class="btn btn-link p-0 monthly-tickets-detail" 
                            data-month="${item.year_month}" 
                            data-status="En proceso" 
                            data-count="${item.tickets_en_proceso}">
                        ${item.tickets_en_proceso}
                    </button>
                </td>
                <td>
                    <button class="btn btn-link p-0 monthly-tickets-detail" 
                            data-month="${item.year_month}" 
                            data-status="Cerrado" 
                            data-count="${item.tickets_cerrados}">
                        ${item.tickets_cerrados}
                    </button>
                </td>
            </tr>
        `;
  });

  html += `
            </tbody>
        </table>
        <p class="text-muted mt-3">Información extra sobre los tickets.</p>
    `;
  return html;
}

function loadOpenTicketDetails() {
    const contentDiv = document.getElementById("OpenTicketModalContent");
    const searchInput = document.getElementById("ticketSearchInputOpen");

    contentDiv.innerHTML = "<p>Cargando información de tickets Abiertos...</p>"; // Mensaje de carga
    searchInput.value = ''; // Limpiar el campo de búsqueda al recargar

    fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketOpenDetails`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                allOpenTickets = data.details; // Almacenar todos los tickets
                displayFilteredTickets(allOpenTickets, 'OpenTicketModalContent'); // Mostrar todos al principio
                attachMarkReceivedListeners(); // Adjuntar listeners a los botones "Marcar como Recibido"

                // Añadir event listener para el input de búsqueda con referencia estable
                if (ticketSearchHandler) {
                    searchInput.removeEventListener('input', ticketSearchHandler);
                }
                ticketSearchHandler = (e) => {
                    handleTicketSearch(e, allOpenTickets, 'OpenTicketModalContent');
                };
                searchInput.addEventListener('input', ticketSearchHandler);

            } else {
                contentDiv.innerHTML =
                    "<p>Error al cargar los detalles de tickets: " +
                    (data.message || "Error desconocido") +
                    "</p>";
                console.error(
                    "Error en los datos de la API para tickets abiertos:",
                    data.message
                );
                allOpenTickets = []; // Limpiar por si hubo error
                if (ticketSearchHandler) {
                    searchInput.removeEventListener('input', ticketSearchHandler);
                    ticketSearchHandler = null;
                }
            }
        })
        .catch((error) => {
            contentDiv.innerHTML =
                `<div class="text-center text-muted py-5">
                    <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay tickets Abiertos.</p>
                    </div>
                </div>`;
            console.error("Error fetching open ticket details:", error);
            allOpenTickets = []; // Limpiar por si hubo error
            if (ticketSearchHandler) {
                searchInput.removeEventListener('input', ticketSearchHandler);
                ticketSearchHandler = null;
            }
        });
}

// Asegúrate de que esta función exista y sea llamada después de cargar los tickets
function formatOpenDetails(details) {
      // Asegúrate de definir la variable currentUserRole en tu HTML antes de este script, por ejemplo:
      // 
      // O si el valor es numérico, sin comillas.
      //1 = SuperAdmin 
      //4 = Coordinador 
      //3 = Tecnico
      const showDocumentButtons = (currentUserRole === 1 || currentUserRole === 4 || currentUserRole === 3); // Rol de administrador o superadministrador;

    if (!details || details.length === 0) {
        return "<p>No hay tickets abiertos disponibles.</p>";
    }

    let htmlContent = '';

    details.forEach(ticket => {
        let documentButtonsHtml = '';
        let markReceivedButtonHtml = ''; // Variable para el botón "Marcar como Recibido"

        const statusPaymentId = parseInt(ticket.id_status_payment, 10);
        const accionTicket = ticket.name_accion_ticket;

        ////////////////////////////// CAMBIAR A QUE SOLO EL 4 QU E ES "COORDINADOR" CANDO EL SISTEMA SE TERMINE ////////////////////////////////////////////////////////////
          // Lógica corregida para el botón "Marcar como Recibido"
        if (accionTicket === 'Recibido por la Coordinación') {
            markReceivedButtonHtml = `
              <button type="button" class="btn btn-success ms-2 mark-received-btn" disabled>
                Ya está recibido
              </button>
            `;
        } else if (currentUserRole === 1 || currentUserRole === 4) {
            markReceivedButtonHtml = `
              <button type="button" class="btn btn-success ms-2 mark-received-btn" data-ticket-id="${ticket.id_ticket}" data-nro-ticket = "${ticket.nro_ticket}" data-serial-pos = ${ticket.serial_pos_cliente}>
                Marcar como Recibido
              </button>
            `;
        }
        ////////////////////////////// CAMBIAR A QUE SOLO EL 4 QU E ES "COORDINADOR" CANDO EL SISTEMA SE TERMINE ////////////////////////////////////////////////////////////

        
        htmlContent += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || 'N/A'}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${ticket.serial_pos_cliente || 'N/A'}</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${ticket.razon_social_cliente || 'N/A'}</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || 'N/A'}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${ticket.name_modelopos_cliente || 'N/A'}</dd>

                        <dt class="col-sm-4">Estatus Documentos:</dt>
                        <dd class="col-sm-8">${ticket.name_status_payment || 'N/A'}</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${ticket.status_name_ticket || 'N/A'}</dd>

                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${ticket.name_status_domiciliacion || 'N/A'}</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${ticket.name_status_lab || 'N/A'}</dd>

                        <dt class="col-sm-4">Acción Ticket:</dt>
                        <dd class="col-sm-8">${ticket.name_accion_ticket || 'N/A'}</dd>
                        
                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${ticket.date_create_ticket || 'N/A'}</dd>
                    </dl>
                    
                     <div class="mt-3 d-flex justify-content-end align-items-center flex-wrap">
                        ${documentButtonsHtml}
                        ${markReceivedButtonHtml}
                    </div>
                </div>
            </div>
        `;
    });
     htmlContent += `
        </div>
    `;
  return htmlContent;
}

function loadEntregadoClienteDetails() {
    const contentDiv = document.getElementById("EntregadoClienteModalTicketsContent");
    const searchInput = document.getElementById("ticketSearchInputEntregadoCliente");

    if(searchInput){
      searchInput.style.display = 'inline-block'; // Show the search input for this modal
   }

    if (!contentDiv || !searchInput) {
        console.error("DOM elements not found:", { contentDiv, searchInput });
        return;
    }

    contentDiv.innerHTML = "<p>Cargando información de tickets entregados al cliente...</p>"; // Loading message
    searchInput.value = ''; // Clear the search input on reload

    fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketEntregadoClienteDetails`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                allEntregadoClienteTickets = data.details || []; // Store all tickets, default to empty array
                displayFilteredTickets(allEntregadoClienteTickets, 'EntregadoClienteModalTicketsContent'); // Display all tickets initially
                attachMarkReceivedListeners(); // Attach listeners to "Mark as Received" buttons

                // Add event listener for search input with stable reference
                if (allEntregadoClienteTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allEntregadoClienteTicketsSearchHandler);
                }
                allEntregadoClienteTicketsSearchHandler = (e) => {
                    handleTicketSearch(e, allEntregadoClienteTickets, 'EntregadoClienteModalTicketsContent');
                };
                searchInput.addEventListener('input', allEntregadoClienteTicketsSearchHandler);
            } else {
                contentDiv.innerHTML =
                    "<p>Error al cargar los detalles de tickets entregados al cliente: " +
                    (data.message || "Error desconocido") +
                    "</p>";
                console.error(
                    "Error en los datos de la API para tickets entregados al cliente:",
                    data.message
                );
                allEntregadoClienteTickets = []; // Clear on error
                if (allEntregadoClienteTicketsSearchHandler) {
                    searchInput.removeEventListener('input', allEntregadoClienteTicketsSearchHandler);
                    allEntregadoClienteTicketsSearchHandler = null;
                }
            }
        })
        .catch((error) => {
            contentDiv.innerHTML =
                `<div class="text-center text-muted py-5">
                    <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay tickets entregados al cliente.</p>
                    </div>
                </div>`;
            console.error("Error fetching entregado cliente ticket details:", error);
            allEntregadoClienteTickets = []; // Clear on error
            if (allEntregadoClienteTicketsSearchHandler) {
                searchInput.removeEventListener('input', allEntregadoClienteTicketsSearchHandler);
                allEntregadoClienteTicketsSearchHandler = null;
            }
        });
}

function formatEntregadoClienteDetails(tickets) {
    if (!Array.isArray(tickets)) {
        console.error("Expected 'tickets' to be an array, but received:", tickets);
        return "<p>Formato de datos inesperado.</p>";
    }

    let html = `
        <div class="ticket-details-list mt-3">
    `;

    tickets.forEach((ticket) => {
        // Use the date as provided by the API (DD-MM-YYYY HH12:MI)
        const creationDate = ticket.date_create_ticket || "N/A";

        html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${ticket.serial_pos_cliente || "N/A"}</dd>
                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${ticket.razon_social_cliente || "N/A"}</dd>
                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>
                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${ticket.name_modelopos_cliente || "N/A"}</dd>
                        <dt class="col-sm-4">Estatus Documento:</dt>
                        <dd class="col-sm-8">${ticket.name_status_payment || "N/A"}</dd>
                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${ticket.status_name_ticket || "N/A"}</dd>
                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${ticket.name_status_domiciliacion || "N/A"}</dd>
                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${ticket.name_status_lab || "N/A"}</dd>
                        <dt class="col-sm-4">Acción Ticket:</dt>
                        <dd class="col-sm-8">${ticket.name_accion_ticket || "N/A"}</dd>
                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${creationDate}</dd>
                    </dl>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

function loadIndividualProceess() {
    const contentDiv = document.getElementById("ProcessTicketsContent");
    const searchInput = document.getElementById("ticketSearchInputProcess");

    contentDiv.innerHTML = "<p>Cargando información de los POS en Proceso..</p>";
    searchInput.value = ''; // Limpiar el campo de búsqueda al recargar

    fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsInProcess`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                allProcessTickets = data.details; // Guardar todos los tickets para búsqueda
                displayFilteredTickets(allProcessTickets, 'ProcessTicketsContent');

                // Eliminar listener previo si existe (necesita la misma referencia)
                if (ticketSearchHandler) {
                    searchInput.removeEventListener('input', ticketSearchHandler);
                }
                // Crear y registrar un handler con referencia estable
                ticketSearchHandler = (event) => {
                    handleTicketSearch(event, allProcessTickets, 'ProcessTicketsContent');
                };
                searchInput.addEventListener('input', ticketSearchHandler);
            } else {
                contentDiv.innerHTML =
                    "<p>Error al cargar los detalles de Taller: " +
                    (data.message || "Error desconocido") +
                    "</p>";
                console.error(
                    "Error en los datos de la API para Taller:",
                    data.message
                );
                allProcessTickets = [];
                if (ticketSearchHandler) {
                    searchInput.removeEventListener('input', ticketSearchHandler);
                    ticketSearchHandler = null;
                }
            }
        })
        .catch((error) => {
            contentDiv.innerHTML =
                `<div class="text-center text-muted py-5">
                    <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay tickets en proceso.</p>
                    </div>
                </div>`;
            console.error("Error fetching taller details:", error);
            allProcessTickets = [];
            if (ticketSearchHandler) {
                searchInput.removeEventListener('input', ticketSearchHandler);
                ticketSearchHandler = null;
            }
        });
}

function loadResolveTicketDetails() {
  const contentDiv = document.getElementById("ResolveTicketsContent");
  const searchInput = document.getElementById("ticketSearchInputResolved");

  contentDiv.innerHTML = "<p>Cargando información de Tickets Resueltos...</p>"; // Mensaje de carga
  searchInput.value = ''; // Limpiar el campo de búsqueda al recargar

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetResolveTicketsForCard`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        allResolvedTickets = data.details; // Almacenar todos los tickets
        displayFilteredTickets(allResolvedTickets, 'ResolveTicketsContent'); // Mostrar todos al principio

        // Añadir event listener para el input de búsqueda con referencia estable
        if (resolvedTicketSearchHandler) {
          searchInput.removeEventListener('input', resolvedTicketSearchHandler);
        }
        resolvedTicketSearchHandler = (e) => {
          handleTicketSearch(e, allResolvedTickets, 'ResolveTicketsContent');
        };
        searchInput.addEventListener('input', resolvedTicketSearchHandler);

      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles de tickets: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error(
          "Error en los datos de la API para tickets resueltos:",
          data.message
        );
        allResolvedTickets = []; // Limpiar por si hubo error
        if (resolvedTicketSearchHandler) {
          searchInput.removeEventListener('input', resolvedTicketSearchHandler);
          resolvedTicketSearchHandler = null;
        }
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
        `<div class="text-center text-muted py-5">
            <div class="d-flex flex-column align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                    <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
                <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                <p class="text-muted mb-0">No hay tickets resueltos.</p>
            </div>
        </div>`;
      console.error("Error fetching resolved ticket details:", error);
      allResolvedTickets = []; // Limpiar por si hubo error
      if (resolvedTicketSearchHandler) {
        searchInput.removeEventListener('input', resolvedTicketSearchHandler);
        resolvedTicketSearchHandler = null;
      }
    });
}

function loadDetalleTicketComercial() {
  const contentDiv = document.getElementById("ComercialTicketsContent");
  const searchInput = document.getElementById("ticketSearchInputComercial");

  contentDiv.innerHTML = "<p>Cargando información de tickets Comerciales...</p>"; // Mensaje de carga
  searchInput.value = ''; // Limpiar el campo de búsqueda al recargar

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetDetalleTicketComercial`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        allComercialTickets = data.details; // Almacenar todos los tickets
        displayFilteredTickets(allComercialTickets, 'ComercialTicketsContent'); // Mostrar todos al principio

        // Añadir event listener para el input de búsqueda con referencia estable
        if (comercialTicketSearchHandler) {
          searchInput.removeEventListener('input', comercialTicketSearchHandler);
        }
        comercialTicketSearchHandler = (e) => {
          handleTicketSearch(e, allComercialTickets, 'ComercialTicketsContent');
        };
        searchInput.addEventListener('input', comercialTicketSearchHandler);

      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles de tickets: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error(
          "Error en los datos de la API para tickets comerciales:",
          data.message
        );
        allComercialTickets = []; // Limpiar por si hubo error
        if (comercialTicketSearchHandler) {
          searchInput.removeEventListener('input', comercialTicketSearchHandler);
          comercialTicketSearchHandler = null;
        }
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
        `<div class="text-center text-muted py-5">
            <div class="d-flex flex-column align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                    <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
                <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                <p class="text-muted mb-0">No hay tickets comerciales.</p>
            </div>
        </div>`;
      console.error("Error fetching commercial ticket details:", error);
      allComercialTickets = []; // Limpiar por si hubo error
      if (comercialTicketSearchHandler) {
        searchInput.removeEventListener('input', comercialTicketSearchHandler);
        comercialTicketSearchHandler = null;
      }
    });
}

function loadTallerTicketDetails() {
  const contentDiv = document.getElementById("TallerTicketsContent");
  const searchInput = document.getElementById("ticketSearchInputTaller");

  contentDiv.innerHTML = "<p>Cargando información de Tickets de Taller...</p>"; // Mensaje de carga
  searchInput.value = ''; // Limpiar el campo de búsqueda al recargar

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTallerTicketsForCard`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        allTallerTickets = data.details; // Almacenar todos los tickets
        console.log(data.details);
        displayFilteredTickets(allTallerTickets, 'TallerTicketsContent'); // Mostrar todos al principio
        attachMarkReceivedListeners(); // Adjuntar listeners a los botones "Marcar como Recibido"

        // Añadir event listener para el input de búsqueda con referencia estable
        if (tallerTicketSearchHandler) {
          searchInput.removeEventListener('input', tallerTicketSearchHandler);
        }
        tallerTicketSearchHandler = (e) => {
          handleTicketSearch(e, allTallerTickets, 'TallerTicketsContent');
        };
        searchInput.addEventListener('input', tallerTicketSearchHandler);

      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles de tickets: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error(
          "Error en los datos de la API para tickets de taller:",
          data.message
        );
        allTallerTickets = []; // Limpiar por si hubo error
        if (tallerTicketSearchHandler) {
          searchInput.removeEventListener('input', tallerTicketSearchHandler);
          tallerTicketSearchHandler = null;
        }
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
        `<div class="text-center text-muted py-5">
            <div class="d-flex flex-column align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                    <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
                <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                <p class="text-muted mb-0">No hay tickets en Taller.</p>
            </div>
        </div>`;
      console.error("Error fetching taller ticket details:", error);
      allTallerTickets = []; // Limpiar por si hubo error
      if (tallerTicketSearchHandler) {
        searchInput.removeEventListener('input', tallerTicketSearchHandler);
        tallerTicketSearchHandler = null;
      }
    });
}

function cerrarModalViewDocument(){
  const ModalViewImageElement = document.getElementById("viewDocumentModal"); // Modal para ver documentos de tickets
  let ModalView = null; // Modal para ver imagenes de tickets

  if (ModalViewImageElement) {
    ModalView = new bootstrap.Modal(ModalViewImageElement);
  }

  const CerrarModalView = document.getElementById("CerrarBotonImage");
  const IconModalView = document.getElementById("IconModalviewClose");

  if (CerrarModalView && ModalView) {
        CerrarModalView.addEventListener("click", function () {
          ModalViewImageElement.style.display = "none"; // Oculta el modal
             const backdrops = document.querySelectorAll('.modal-backdrop.show');
        if (backdrops.length > 0) {
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
        }
        });
    }

    if (IconModalView && ModalView) {
        IconModalView.addEventListener("click", function () {
                    ModalViewImageElement.style.display = "none"; // Oculta el modal

            const backdrops = document.querySelectorAll('.modal-backdrop.show');
        if (backdrops.length > 0) {
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
        }
        });
    }

}

function formatProcessTicketsDetails(details){
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <div class="ticket-details-list mt-3">
    `;

  details.forEach((ticket) => {
    // <-- ¡Corregido aquí! Ahora usa 'details'
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                         <dt class="col-sm-4">Estatus Documento:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_payment || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>
                        
                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${
                          ticket.date_create_ticket
                        }</dd> <!-- Usar la variable formateada -->
                    </dl>
                      <button class="btn btn-info btn-sm mt-3 view-timeline-btn" data-id-ticket="${ticket.id_ticket}" disabled>Ver Flujo del Ticket</button>
                </div>
            </div>
        `;
  });
   html += `
        </div>
    `;
  return html;
}

function loadTicketTimeline(ticketId) {
  // Usamos document.getElementById para mantener tu selección original
  const timelineContentDiv = document.getElementById("timelineContent");
  timelineContentDiv.innerHTML = "<p>Cargando flujo de trabajo...</p>"; // Mensaje de carga inicial

  // Reemplazamos fetch con $.ajax como solicitaste
  $.ajax({
    // La URL es la base de tu API, sin los parámetros GET en la URL misma
    url: `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketTimeline`,
    type: "POST", // ¡El método es POST!
    data: {
      // Los datos se envían como un objeto, jQuery los formateará automáticamente
      action: "GetTicketTimeline", // La acción que el backend esperará en $_POST['action']
      id_ticket: ticketId, // El ID del ticket que el backend esperará en $_POST['id_ticket']
    },
    dataType: "json", // Esperamos una respuesta JSON
    success: function (data) {
      if (data.success && data.details && data.details.length > 0) {
        // Mantiene la llamada a tu función original formatTimeline
        timelineContentDiv.innerHTML = formatTimeline(data.details);
                initializeTimelineClickHandlers();

      } else if (data.success && data.details && data.details.length === 0) {
        timelineContentDiv.innerHTML = "<p>No hay historial de cambios para este ticket.</p>";
      } else {
        timelineContentDiv.innerHTML =
          "<p>Error al cargar el flujo de trabajo: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error("Error en los datos de la API para el flujo de trabajo:", data.message);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      let errorMessage = '<p>Error al cargar el flujo de trabajo.</p>';
      if (jqXHR.status === 0) {
        errorMessage = '<p>Error de red: No se pudo conectar al servidor.</p>';
      } else if (jqXHR.status == 404) {
        errorMessage = '<p>Recurso de API no encontrado. (Error 404)</p>';
      } else if (jqXHR.status == 500) {
        errorMessage = '<p>Error interno del servidor. (Error 500)</p>';
      } else if (textStatus === "parsererror") {
        errorMessage = '<p>Error al procesar la respuesta del servidor (JSON inválido).</p>';
      } else if (textStatus === "timeout") {
        errorMessage = '<p>Tiempo de espera agotado al cargar el flujo de trabajo.</p>';
      } else if (textStatus === "abort") {
        errorMessage = '<p>Solicitud de flujo de trabajo cancelada.</p>';
      }
      timelineContentDiv.innerHTML = errorMessage;
      console.error("Error AJAX:", textStatus, errorThrown, jqXHR.responseText);
    },
  });
}

function formatTimeline(timelineData) {
    let html = '<ul class="timeline">';
drawTimelineLine()
    timelineData.forEach((item) => {
        const isInitialEntryBool = String(item.is_initial_entry).toLowerCase() === 't' || item.is_initial_entry === true;
        const changedByUsername = item.changedby_username || 'N/A';
        const formattedDate = item.changedstatus_at ? new Date(item.changedstatus_at).toLocaleString('es-VE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'N/A';

        let changeDescriptionHtml = ''; // Usaremos HTML para esta descripción
        const currentTecnicoN2 = item.full_name_tecnico_n2_actual || 'No Asignado';
        const previousTecnicoN2 = item.full_name_tecnico_n2_anterior || 'No Asignado'; // Ya tienes esta variable disponible
        const coordinatorName = item.full_name_coordinador_ticket || 'No Asignado';

        if (isInitialEntryBool) {
            let initiatorName = item.full_name_tecnico_n1_ticket !== 'No Asignado' ? changedByUsername : changedByUsername;
            changeDescriptionHtml += `<strong>Técnico Gestor:</strong> ${initiatorName}<br>`;
            
            if (item.new_status_name && item.new_status_name !== 'Desconocido') {
                changeDescriptionHtml += `<br><strong>Estado inicial: </strong><span style = "color: green">${item.new_status_name}</span><br>`;
            }
            if (item.new_action_name && item.new_action_name !== 'Desconocida') {
                changeDescriptionHtml += `<br><strong>Acción inicial:</strong> ${item.new_action_name}<br>`;
            }
            // Agregamos el Coordinador y Técnico N1 aquí si es la entrada inicial
            changeDescriptionHtml += `<br><strong>Coordinador:</strong> ${coordinatorName}<br>`;
            changeDescriptionHtml += `<br><strong>Comentario: </strong>El Ticket fue abierto y gestionado por el Técnico: <strong>${initiatorName}</strong> la cual se lo asignó al coordinador: <strong>${coordinatorName}</strong><br>`; 
        } else {
            // Cambios de Estado Principal
            if (item.old_status_name && item.new_status_name && item.old_status_name !== item.new_status_name) {
                changeDescriptionHtml += `<strong>Cambio de estado:</strong> De <span style = "color: green">${item.old_status_name}</span> a <span style = "color: #E1B002">${item.new_status_name}</span><br>`;
            }
            // Cambios de Acción Principal
            if (item.old_action_name && item.new_action_name && item.old_action_name !== item.new_action_name) {
                changeDescriptionHtml += `<br><strong>Cambio de acción:</strong> De ${item.old_action_name} a ${item.new_action_name}<br>`;
            }

            // Lógica para mostrar cambio de Técnico N2
            if (item.new_action_name === 'Reasignado al Técnico') {
                // Si hay un técnico anterior y uno actual, y son diferentes, muestra ambos
                if (previousTecnicoN2 !== 'No Asignado' && currentTecnicoN2 !== 'No Asignado' && previousTecnicoN2 !== currentTecnicoN2) {
                    changeDescriptionHtml += `<br><strong>Técnico Reasignado:</strong> Del Técnico: <strong>${previousTecnicoN2}</strong> al Técnico: <strong>${currentTecnicoN2}</strong><br>`;
                    changeDescriptionHtml += `<br><strong>Comentario: </strong>El Ticket fue reasignado del Técnico: <strong>${previousTecnicoN2}</strong> al Técnico: <strong>${currentTecnicoN2}</strong> por el coordinador: <strong>${coordinatorName}</strong><br>`;
                     // --- AÑADIDO AQUÍ: Mostrar el comentario de cambio de técnico si existe ---
                    if (item.comment_change_tec && item.comment_change_tec.trim() !== '') {
                        changeDescriptionHtml += `<br><strong>Motivo de la Reasignación:</strong> ${item.comment_change_tec}<br>`;
                    }
                }
            } else if (item.new_action_name === 'Asignado al Técnico') {
                if (currentTecnicoN2 !== 'No Asignado') {
                    changeDescriptionHtml += `<br><strong>Asignado al Técnico:</strong> <strong>${currentTecnicoN2}</strong><br>`;
                    changeDescriptionHtml += `<br><strong>Comentario: </strong>El Ticket fue Asignado al Técnico: <strong>${currentTecnicoN2}</strong> por el coordinador: <strong>${coordinatorName}</strong><br>`;
                }
            }else if (item.new_action_name === 'En espera de Confirmar Devolución') {
                changeDescriptionHtml += `<br><strong>Motivo de Devolución:</strong> ${item.comment_devolution}<br>`;
            }

            // Resto de los cambios de estado (taller, domiciliación, pago)
            if (item.old_status_lab_name && item.new_status_lab_name && item.old_status_lab_name !== item.new_status_lab_name) {
                changeDescriptionHtml += `<strong>Cambio estado taller:</strong> De "${item.old_status_lab_name}" a "${item.new_status_lab_name}"<br>`;
            }
            if (item.old_status_domiciliacion_name && item.new_status_domiciliacion_name && item.old_status_domiciliacion_name !== item.new_status_domiciliacion_name) {
                changeDescriptionHtml += `<strong>Cambio estado domiciliación:</strong> De "${item.old_status_domiciliacion_name}" a "${item.new_status_domiciliacion_name}"<br>`;
            }
            if (item.old_status_payment_name && item.new_status_payment_name && item.old_status_payment_name !== item.new_status_payment_name) {
                changeDescriptionHtml += `<strong>Cambio estado pago:</strong> De "${item.old_status_payment_name}" a "${item.new_status_payment_name}"<br>`;
            }
            
            // Si no se detecta ningún cambio específico, mostrar un mensaje genérico.
            if (!changeDescriptionHtml) {
                changeDescriptionHtml = 'Actualización general del ticket.<br>';
            }

            // Agregamos el Coordinador al final de los estados que no son de Reasignación o Asignación
            // Para evitar duplicación, solo agregamos si no es una acción de reasignación/asignación
            if (item.new_action_name !== 'Reasignado al Técnico' && item.new_action_name !== 'Asignado al Técnico') {
                changeDescriptionHtml += `<br><strong>Coordinador:</strong> ${coordinatorName}<br>`;
                if (currentTecnicoN2 !== 'No Asignado') {
                     changeDescriptionHtml += `<strong>Técnico Actual:</strong> ${currentTecnicoN2}<br>`;
                }
            }
        }
        
        const escapedFullContentDetails = changeDescriptionHtml.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

        html += `
            <li>
                <div class="timeline-badge"><i class="fa fa-check"></i></div>
                <div class="timeline-panel timeline-collapsible" data-full-content="${escapedFullContentDetails}">
                    <div class="timeline-heading">
                        <h4 class="timeline-title">Actualizado por: ${changedByUsername}</h4>
                        <p><small class="text-muted"><i class="fa fa-clock-o"></i> ${formattedDate}</small></p>
                    </div>
                    <div class="timeline-body" style="display: none;">
                    </div>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    return html;
}

// ---- NUEVA FUNCIÓN PARA INICIALIZAR LISTENERS ----
function initializeTimelineClickHandlers() {
    const timelineContainer = document.querySelector('.timeline');
    if (timelineContainer) {
        
        timelineContainer.addEventListener('click', (event) => {
            const panel = event.target.closest('.timeline-panel.timeline-collapsible');
            if (panel) { // Asegúrate de que hemos hecho clic en un panel colapsable
                const body = panel.querySelector('.timeline-body');
                const heading = panel.querySelector('.timeline-heading');
                const fullContent = panel.getAttribute('data-full-content');

                if (body.style.display === 'none') {
                    body.innerHTML = fullContent;
                    body.style.display = 'block';
                    panel.classList.add('expanded');
                    heading.style.display = 'none'; // Oculta el encabezado
                } else {
                    body.style.display = 'none';
                    body.innerHTML = '';
                    panel.classList.remove('expanded');
                    heading.style.display = 'block'; // Muestra el encabezado
                }
            }
        });
    }
}

$('#flowTicketModal').on('shown.bs.modal', function () {
  initializeTimelineClickHandlers();
});

function drawTimelineLine() {
    const timelineContainer = document.querySelector('.timeline'); // El <ul> con la clase 'timeline'
    // Asume que tus "círculos" o puntos de la línea de tiempo tienen la clase 'timeline-badge'
    const nodes = document.querySelectorAll('.timeline-badge'); 

    if (!timelineContainer || nodes.length < 2) {
        // No hay contenedor o no hay suficientes nodos para dibujar una línea
        return;
    }

    // Elimina cualquier línea existente para redibujar
    // ¡CORRECCIÓN AQUÍ! Busca '.timeline-horizontal-line' dentro de timelineContainer
    let existingLine = timelineContainer.querySelector('.timeline-horizontal-line');
    if (existingLine) {
        existingLine.remove();
    }

    // Crea el elemento de la línea
    const line = document.createElement('div');
    line.classList.add('timeline-horizontal-line');

    // Calcula la posición de la línea
    // Necesitamos que el contenedor de la línea tenga position: relative
    // Y los nodos también pueden serlo o estar posicionados de alguna manera.

    // Obtén las posiciones de los nodos relativos al contenedor padre (timelineContainer)
    const firstNodeRect = nodes[0].getBoundingClientRect();
    const lastNodeRect = nodes[nodes.length - 1].getBoundingClientRect();
    const containerRect = timelineContainer.getBoundingClientRect();

    // Calcula el punto de inicio y fin de la línea
    // Asegúrate de que los nodos estén visualmente alineados a una altura común
    // Si tus nodos tienen un alto y el badge está en el centro, ajusta 'top' o 'bottom'
    // Suponiendo que el centro vertical de tus nodos es donde quieres la línea
    const startX = (firstNodeRect.left + firstNodeRect.width / 2) - containerRect.left;
    const endX = (lastNodeRect.left + lastNodeRect.width / 2) - containerRect.left;

    // Posiciona la línea
    line.style.position = `absolute`; // Fundamental para posicionarla dentro del contenedor
    line.style.left = `${startX}px`;
    line.style.width = `${endX - startX}px`;
    line.style.height = `4px`; // Grosor de la línea
    line.style.backgroundColor = `#007bff`; // Color azul
    line.style.zIndex = `0`; // Debajo de los nodos (si los nodos tienen z-index > 0)
    line.style.top = `50%`; // Intenta centrar verticalmente, ajusta si es necesario
    line.style.transform = `translateY(-50%)`; // Ajuste para centrado vertical preciso

    timelineContainer.appendChild(line);
}

async function getTicketProcessReparacion() {
    try {
        const data = await fetchJsonByAction('getTicketsProcessReparacionCount', {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "action=getTicketsProcessReparacionCount",
        });

        if (data.success) {
            document.getElementById("CountProcessReparacion").textContent = data.count;
        } else {
            console.error("Error:", data.message);
        }
    } catch (error) {
        console.error("Error al obtener el conteo de tickets:", error);
    }
}

async function getTicketReparados() {
    try {
        const data = await fetchJsonByAction('getTicketsReparadosCount', {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "action=getTicketsReparadosCount",
        });

        if (data.success) {
            document.getElementById("ReparadopsCount").textContent = data.count;
        } else {
            console.error("Error:", data.message);
        }
    } catch (error) {
        console.error("Error al obtener el conteo de tickets reparados:", error);
    }
}

async function getTicketPendienteRepuesto() {
    try {
        const body = new URLSearchParams({ action: 'getTicketPendienteRepuestoCount' });
        const data = await fetchJsonByAction('getTicketPendienteRepuestoCount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        if (data.success) {
            document.getElementById("PendientePorRepuesto").textContent = data.count;
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch pending ticket count:", error);
    }
}

async function getTicketEntregadoCliente() {
    try {
        const body = new URLSearchParams({ action: 'getTicketEntregadoCliente' });
        const data = await fetchJsonByAction('getTicketEntregadoCliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        if (data.success) {
            document.getElementById("EntregadosCliente").textContent = data.count;
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch tickets delivered to client:", error);
    }
}

async function getTicketIrreparables() {
    try {
        const body = new URLSearchParams({ action: 'getTicketIrreparablesCount' });
        const data = await fetchJsonByAction('getTicketIrreparablesCount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        if (data.success) {
            document.getElementById("CountIrreparable").textContent = data.count;
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch irreparable ticket count:", error);
    }
}

function formatTallerDetails(details) {

  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <div class="ticket-details-list mt-3">
    `;

  details.forEach((ticket) => {
      let markReceivedButtonHtml = '';

    // <-- ¡Corregido aquí! Ahora usa 'details'
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

     const accionTicket = ticket.name_status_lab || "N/A";

        ////////////////////////////// CAMBIAR A QUE SOLO EL 4 QU E ES "COORDINADOR" CANDO EL SISTEMA SE TERMINE ////////////////////////////////////////////////////////////
          // Lógica corregida para el botón "Marcar como Recibido"
          if (accionTicket === 'En proceso de Reparación') {
              markReceivedButtonHtml = `
                <button type="button" class="btn btn-success ms-2 mark-received-btn" disabled>
                  Ya está recibido en Taller
                </button>
              `;
          }
          
          if ((currentUserRole === 1 || currentUserRole === 4) && accionTicket === "Recibido en Taller") {
                markReceivedButtonHtml = `
                  <button type="button" class="btn btn-success ms-2 mark-received-btnTaller" data-ticket-id="${ticket.id_ticket}" data-nro-ticket = "${ticket.nro_ticket}" data-serial-pos = ${ticket.serial_pos_cliente}>
                    Marcar como Recibido En Taller
                  </button>
                `;
          }

        ////////////////////////////// CAMBIAR A QUE SOLO EL 4 QU E ES "COORDINADOR" CANDO EL SISTEMA SE TERMINE ////////////////////////////////////////////////////////////
    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Documento:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_payment || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Domiciliacion:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>
                        
                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${
                          ticket.date_create_ticket
                        }</dd> <!-- Usar la variable formateada -->

                        
                     <div class="mt-3 d-flex justify-content-end align-items-center flex-wrap">
                        ${markReceivedButtonHtml}
                    </div>
                    </dl>
                </div>
            </div>
        `;
  });
   html += `
        </div>
    `;
  return html;
}

function formatResolveDetails(details) {
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <div class="ticket-details-list mt-3">
    `;

  details.forEach((ticket) => {
    // <-- ¡Corregido aquí! Ahora usa 'details'
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                      <dt class="col-sm-4">Nivel Falla:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_level_failure || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Documento:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_payment || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${
                          ticket.date_create_ticket
                        }</dd> <!-- Usar la variable formateada -->
                    </dl>
                </div>
            </div>
        `;
  });
  return html;
}

$("#newPassword").keyup(function () {
  let string = $("#newPassword").val();
  $("#newPassword").val(string.replace(/ /g, ""));
});

$("#confirmNewPassword").keyup(function () {
  let string = $("#confirmNewPassword").val();
  $("#confirmNewPassword").val(string.replace(/ /g, ""));
});

//Llamar a la función PHP usando fetch    SESSION EXPIRE DEL USER
fetch("/SoportePost/app/controllers/dashboard.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text(); // Obtener la respuesta como texto primero
  })
  .then((responseText) => {
    if (responseText) {
      try {
        console.log("Response text:", responseText); // Mostrar la respuesta para depuración
        const data = JSON.parse(responseText); // Intentar parsear como JSON
        if (data.expired_sessions) {
          window.location.href = data.redirect;
        }

        if (data.sessionLifetime && typeof data.sessionLifetime === "number") {
          setTimeout(function () {
            location.reload(true);
          }, data.sessionLifetime * 1000);
        } else {
          console.error("Invalid sessionLifetime:", data.sessionLifetime);
        }
      } catch (error) {
        console.error("JSON parse error:", error);
        console.log("Response text:", responseText); // Mostrar la respuesta para depuración
      }
    } else {
      console.error("Empty response from server");
    }
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });


function checkUserStatusAndPromptPassword() {
  const id_user = document.getElementById("userIdForPassword").value;

  const xhr = new XMLHttpRequest();
  // El endpoint de tu API que verifica el estatus del usuario logueado (desde la sesión)
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/users/checkStatus`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        const userStatus = response.isVerified; // Asignar un valor por defecto si no existe

        if (userStatus.id_status === "1") {
          const newPasswordModalElement =
            document.getElementById("newPasswordModal");

          if (newPasswordModalElement) {
            const modalBootstrap = new bootstrap.Modal(
              newPasswordModalElement,
              {
                backdrop: "static",
                // Puedes añadir más opciones de configuración aquí si es necesario
              }
            );
            modalInstance = modalBootstrap; // Asigna la instancia a la variable
            modalBootstrap.show();

            newPasswordModalElement.style.display = "block";
            newPasswordModalElement.style.opacity = "1"; // Si tienes transiciones, esto podría ayudar

            const modalUserIdInput = document.getElementById(
              "modalUserIdForPassword"
            );

            if (modalUserIdInput && userStatus.id_user) {
              // Asigna el ID del usuario que viene en la respuesta del backend
              modalUserIdInput.value = userStatus.id_user;
            } else {
              // Si el backend no devuelve userId en isVerified, usa el que ya tenías de la sesión inicial
              if (modalUserIdInput) {
                modalUserIdInput.value = id_user;
              }
            }

            // Si tienes un backdrop de Bootstrap, también deberías mostrarlo manualmente
            const modalBackdrop = document.querySelector(".modal-backdrop");
            if (modalBackdrop) {
              modalBackdrop.style.display = "block";
              modalBackdrop.style.opacity = ".5"; // Valor típico de opacidad para el backdrop
            } else {
              // Si no hay backdrop, considera añadir uno simple manualmente para oscurecer el fondo
              const createdBackdrop = document.createElement("div");
              createdBackdrop.classList.add("modal-backdrop", "fade", "show"); // Bootstrap classes
              createdBackdrop.style.display = "block";
              createdBackdrop.style.opacity = ".5";
              document.body.appendChild(createdBackdrop);
            }

            // También necesitas añadir la clase 'show' para las animaciones y visibilidad de Bootstrap
            newPasswordModalElement.classList.add("show");
            newPasswordModalElement.setAttribute("aria-modal", "true");
            newPasswordModalElement.setAttribute("role", "dialog");
            document.body.classList.add("modal-open"); // Añadir clase al body para evitar scroll
            Swal.fire({
              icon: "info",
              title: "Cambio de Contraseña Requerido",
              text:
                response.message ||
                "Por favor, ingrese una nueva contraseña para continuar.",
              allowOutsideClick: false, // El usuario no puede cerrar el modal haciendo clic fuera
              // showConfirmButton: false, // ¡Esta línea se elimina para mostrar el botón!
              // timer: 5000, // ¡Elimina el temporizador si quieres que el botón sea la única forma de cerrar!
              // timerProgressBar: true, // También elimina la barra de progreso del temporizador

              // Configuración para el botón de confirmación
              showConfirmButton: true, // Mostrar el botón de confirmación
              confirmButtonText: "Okay", // Texto del botón
              confirmButtonColor: "#003594", // Color del botón (opcional, este es el azul predeterminado de SweetAlert)
              color: "black", // Color del texto (opcional, este es el blanco predeterminado de SweetAlert)
            });
          } else {
            console.error(
              "Error: El modal 'newPasswordModal' no fue encontrado en el DOM."
            );
          }
        }
        // Si response.success es false o userStatus no es 1, no se hace nada más (no se abre el modal)
        // Aquí podrías añadir lógica para otros estatus si los hubiera.
        else if (!response.success) {
          console.warn(
            "Verificación de estatus fallida:",
            response.message || "Mensaje desconocido."
          );
          // Opcional: mostrar un SweetAlert de error o un mensaje en algún div general
          Swal.fire({
            icon: "error",
            title: "Error de Verificación",
            text:
              response.message ||
              "No se pudo verificar el estatus del usuario.",
          });
        }
      } catch (error) {
        console.error("Error parsing JSON for checkUserStatus:", error);
        // Si tienes un div para errores generales, puedes usarlo aquí
        // document.getElementById('generalErrorDiv').innerHTML = 'Error al procesar la respuesta del servidor.';
      }
    } else {
      console.error(
        "Error in checkUserStatus request:",
        xhr.status,
        xhr.statusText
      );
      // Si tienes un div para errores generales, puedes usarlo aquí
      // document.getElementById('generalErrorDiv').innerHTML = `Error de conexión: ${xhr.status} ${xhr.statusText}`;
    }
  };

  xhr.onerror = function () {
    console.error("Network error for checkUserStatus request.");
    // Si tienes un div para errores generales, puedes usarlo aquí
    // document.getElementById('generalErrorDiv').innerHTML = 'Error de red al verificar el estatus.';
  };

  // No se envía ningún dato de usuario explícito, ya que se recupera de la sesión en el backend
  // Podrías enviar un simple 'action' si tu API lo requiere para enrutamiento
  const datos = `action=checkStatus&userId=${encodeURIComponent(id_user)}`; // O simplemente "" si el endpoint no necesita action
  xhr.send(datos);
}

// --- Event Listeners y la Lógica del Botón 'Guardar Contraseña' del modal ---
// --- Event Listeners y la Lógica del Botón 'Guardar Contraseña' del modal ---
document.addEventListener("DOMContentLoaded", function () {
    // Asumo que checkUserStatusAndPromptPassword() es una función existente en tu código.
    checkUserStatusAndPromptPassword();

    const newPasswordModalElement = document.getElementById("newPasswordModal");

    if (newPasswordModalElement) {
        newPasswordModalElement.addEventListener("hidden.bs.modal", function () {
            // Limpiar campos y mensajes de error al cerrar el modal
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmNewPassword").value = "";
            document.getElementById("passwordError").innerHTML = "";
            document.getElementById("confirmPasswordError").innerHTML = "";
            document.getElementById("modalUserIdForPassword").value = ""; 

            // Limpiar estilos y mensajes de la leyenda al cerrar el modal
            const passwordRequirementsDiv = document.getElementById("passwordRequirements");
            if (passwordRequirementsDiv) {
                passwordRequirementsDiv.style.display = "none"; 
                const reqChecks = document.querySelectorAll(".password-legend li");
                reqChecks.forEach(li => {
                    li.classList.remove("valid", "invalid");
                    li.style.color = ""; 
                });
            }

            // Limpiar clases de borde al cerrar el modal
            document.getElementById("newPassword").classList.remove("error", "success");
            document.getElementById("confirmNewPassword").classList.remove("error", "success");

            // Ocultar el contenedor de la contraseña sugerida al cerrar el modal
            document.getElementById("suggestedPasswordContainer").style.display = "none";
            document.getElementById("suggestedPassword").textContent = "";
        });
    }

    // Lógica para mostrar/ocultar contraseña (los ojitos) - USANDO JQUERY
    // Esta función encapsula la lógica que me has proporcionado para el "ojito"
    const togglePasswordVisibility = (inputId, iconId) => {
        // Usar jQuery para seleccionar los elementos
        const $input = jQuery(`#${inputId}`);
        const $icon = jQuery(`#${iconId}`);

        if ($input.length && $icon.length) { // Check if elements exist with jQuery's .length
            $icon.on('click', function () {
                const currentType = $input.attr('type');
                // Aplica la lógica que me diste: si es 'password', cambia a 'text', si no, a 'password'
                $input.attr('type', currentType === 'password' ? 'text' : 'password');
                
                // Si quisieras cambiar el icono del ojo, lo harías aquí:
                // Por ejemplo, si tuvieras una clase 'bi-eye' y 'bi-eye-slash'
                // $icon.toggleClass('bi-eye bi-eye-slash');
            });
        }
    };

    // Aplica la funcionalidad de visibilidad a ambos campos de contraseña
    // ¡Asegúrate de que jQuery esté cargado ANTES de que este script se ejecute!
    togglePasswordVisibility('newPassword', 'clickme1');
    togglePasswordVisibility('confirmNewPassword', 'clickme'); // Se agrega la llamada para el segundo ojito aquí

    // Lógica de validación de contraseña en tiempo real para la leyenda
    const newPasswordInput = document.getElementById("newPassword"); 
    const passwordRequirementsDiv = document.getElementById("passwordRequirements");
    const lengthCheck = document.getElementById("lengthCheck");
    const uppercaseCheck = document.getElementById("uppercaseCheck");
    const lowercaseCheck = document.getElementById("lowercaseCheck");
    const numberCheck = document.getElementById("numberCheck");
    const specialCharCheck = document.getElementById("specialCharCheck");
    const passwordErrorDiv = document.getElementById("passwordError");

    // Elementos del generador de contraseña
    const generatePasswordBtn = document.getElementById("generatePasswordBtn");
    const suggestedPasswordContainer = document.getElementById("suggestedPasswordContainer");
    const suggestedPasswordSpan = document.getElementById("suggestedPassword");
    const copySuggestedPasswordBtn = document.getElementById("copySuggestedPasswordBtn");

    /**
     * Función para generar una contraseña aleatoria y robusta.
     * @param {number} length - Longitud deseada de la contraseña (se usará 8 en la llamada).
     * @returns {string} La contraseña generada.
     */
    function generateRandomPassword(length = 12) { 
        const chars = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            special: '!@#$%^&*' 
        };

        let password = '';
        
        // Asegurar al menos un carácter de cada tipo, si el espacio lo permite
        if (password.length < length) password += chars.lowercase.charAt(Math.floor(Math.random() * chars.lowercase.length));
        if (password.length < length) password += chars.uppercase.charAt(Math.floor(Math.random() * chars.uppercase.length));
        if (password.length < length) password += chars.numbers.charAt(Math.floor(Math.random() * chars.numbers.length));
        if (password.length < length) password += chars.special.charAt(Math.floor(Math.random() * chars.special.length));
        
        // Rellenar el resto de la longitud con caracteres aleatorios de todos los tipos combinados
        const allChars = chars.lowercase + chars.uppercase + chars.numbers + chars.special;
        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Mezclar la contraseña para que no siga un patrón predecible
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        return password;
    }

    // Listener para el botón "Generar Contraseña"
    if (generatePasswordBtn) {
        generatePasswordBtn.addEventListener("click", function() {
            const generatedPass = generateRandomPassword(8); // Generar 8 caracteres
            
            suggestedPasswordSpan.textContent = generatedPass;
            suggestedPasswordContainer.style.display = "block";

            newPasswordInput.value = generatedPass;
            document.getElementById("confirmNewPassword").value = generatedPass;
            
            const event = new Event('input');
            newPasswordInput.dispatchEvent(event);

            newPasswordInput.focus();
        });
    }

    // Listener para el botón "Copiar"
    if (copySuggestedPasswordBtn) {
        copySuggestedPasswordBtn.addEventListener("click", function() {
            const passwordToCopy = suggestedPasswordSpan.textContent;
            navigator.clipboard.writeText(passwordToCopy).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Copiado!',
                    text: 'La contraseña ha sido copiada al portapapeles.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                });
            }).catch(err => {
                console.error('Error al copiar la contraseña: ', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al Copiar',
                    text: 'No se pudo copiar la contraseña automáticamente. Intente seleccionarla y copiarla manualmente.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2500
                });
            });
        });
    }

    // Lógica de validación en tiempo real para la leyenda
    if (newPasswordInput && passwordRequirementsDiv) {
        newPasswordInput.addEventListener("focus", function() {
            passwordRequirementsDiv.style.display = "block";
        });

        newPasswordInput.addEventListener("blur", function() {
            if (passwordErrorDiv.innerHTML === "") {
                passwordRequirementsDiv.style.display = "none";
            }
        });

        newPasswordInput.addEventListener("input", function() {
            const password = newPasswordInput.value;

            const updateRequirement = (element, isValid) => {
                element.classList.toggle("valid", isValid);
                element.classList.toggle("invalid", !isValid);
            };

            updateRequirement(lengthCheck, password.length >= 8); 
            updateRequirement(uppercaseCheck, /[A-Z]/.test(password));
            updateRequirement(lowercaseCheck, /[a-z]/.test(password));
            updateRequirement(numberCheck, /\d/.test(password));
            updateRequirement(specialCharCheck, /[!@#$%^&*]/.test(password));

            if (passwordErrorDiv.innerHTML !== "" &&
                password.length >= 8 && 
                /[A-Z]/.test(password) &&
                /[a-z]/.test(password) &&
                /\d/.test(password) &&
                /[!@#$%^&*]/.test(password)) {
                
                passwordErrorDiv.innerHTML = "";
                newPasswordInput.classList.remove("error");
            }
        });
    }

    // LÓGICA DEL BOTÓN 'Guardar Contraseña' del modal (Actualización de Contraseña)
    const submitNewPasswordBtn = document.getElementById("submitNewPasswordBtn");
    if (submitNewPasswordBtn) {
        submitNewPasswordBtn.addEventListener("click", function () {
            const newPasswordInput = document.getElementById("newPassword");
            const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
            const newPassword = newPasswordInput.value.trim();
            const confirmNewPassword = confirmNewPasswordInput.value.trim();

            const passwordErrorDiv = document.getElementById("passwordError");
            const confirmPasswordErrorDiv = document.getElementById("confirmPasswordError");

            passwordErrorDiv.innerHTML = "";
            confirmPasswordErrorDiv.innerHTML = "";
            newPasswordInput.classList.remove("error", "success");
            confirmNewPasswordInput.classList.remove("error", "success");

            let hasError = false;

            passwordRequirementsDiv.style.display = "block"; 
            
            if (newPassword === "") {
                passwordErrorDiv.innerHTML = "La nueva contraseña no puede estar vacía.";
                newPasswordInput.classList.add("error");
                hasError = true;
            } else if (newPassword.length < 8) { 
                passwordErrorDiv.innerHTML = "La contraseña debe tener al menos 8 caracteres.";
                newPasswordInput.classList.add("error");
                hasError = true;
            } else if (!/[A-Z]/.test(newPassword)) {
                passwordErrorDiv.innerHTML = "La contraseña debe contener al menos una mayúscula.";
                newPasswordInput.classList.add("error");
                hasError = true;
            } else if (!/[a-z]/.test(newPassword)) {
                passwordErrorDiv.innerHTML = "La contraseña debe contener al menos una minúscula.";
                newPasswordInput.classList.add("error");
                hasError = true;
            } else if (!/\d/.test(newPassword)) {
                passwordErrorDiv.innerHTML = "La contraseña debe contener al menos un número.";
                newPasswordInput.classList.add("error");
                hasError = true;
            } else if (!/[!@#$%^&*]/.test(newPassword)) {
                passwordErrorDiv.innerHTML = "La contraseña debe contener al menos un carácter especial (!@#$%^&*).";
                newPasswordInput.classList.add("error");
                hasError = true;
            }
            
            if (!hasError && confirmNewPassword === "") {
                confirmPasswordErrorDiv.innerHTML = "Debe confirmar la contraseña.";
                confirmNewPasswordInput.classList.add("error");
                hasError = true;
            }

            if (!hasError && newPassword !== confirmNewPassword) {
                passwordErrorDiv.innerHTML = "Las contraseñas no coinciden.";
                newPasswordInput.classList.add("error");
                confirmPasswordErrorDiv.innerHTML = "Las contraseñas no coinciden.";
                confirmNewPasswordInput.classList.add("error");
                hasError = true;
            }
            
            if (hasError) {
                if (passwordErrorDiv.innerHTML !== "") {
                    newPasswordInput.focus();
                } else if (confirmPasswordErrorDiv.innerHTML !== "") {
                    confirmNewPasswordInput.focus();
                }
                return;
            } else {
                newPasswordInput.classList.add("success");
                confirmNewPasswordInput.classList.add("success");
                passwordRequirementsDiv.style.display = "none";
            }

            Swal.fire({
                title: "Actualizando Contraseña...",
                text: "Por favor, espere un momento.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const xhrUpdate = new XMLHttpRequest();
            const id_user = document.getElementById("modalUserIdForPassword").value;
            
            xhrUpdate.open(
                "POST",
                `${ENDPOINT_BASE}${APP_PATH}api/users/updatePassword`
            );
            xhrUpdate.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
            );

            xhrUpdate.onload = function () {
                Swal.close();

                newPasswordInput.classList.remove("success", "error"); 
                confirmNewPasswordInput.classList.remove("success", "error");

                if (xhrUpdate.status === 200) {
                    try {
                        const response = JSON.parse(xhrUpdate.responseText);

                        if (response.success) {
                            Swal.fire({
                                icon: "success",
                                title: "¡Éxito!",
                                text: response.message || "Contraseña actualizada correctamente.",
                                color: "black",
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: () => {
                                    Swal.showLoading();
                                },
                                willClose: () => {
                                    location.reload();
                                },
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: response.message || "No se pudo actualizar la contraseña.",
                                color: "black",
                            });
                        }
                    } catch (error) {
                        console.error("Error parsing JSON for updatePassword:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Error de Respuesta",
                            text: "Error al procesar la respuesta del servidor al actualizar la contraseña.",
                            color: "black",
                        });
                    }
                } else {
                    console.error(
                        "Error updating password:",
                        xhrUpdate.status,
                        xhrUpdate.statusText
                    );
                    Swal.fire({
                        icon: "error",
                        title: "Error de Conexión",
                        text: `Error ${xhrUpdate.status}: ${
                            xhrUpdate.statusText ||
                            "No se pudo conectar con el servidor para actualizar la contraseña."
                        }`,
                        color: "black",
                    });
                }
            };

            xhrUpdate.onerror = function () {
                Swal.close();
                console.error("Network error for updatePassword request.");
                Swal.fire({
                    icon: "error",
                    title: "Error de Red",
                    text: "Error de red al intentar actualizar la contraseña. Verifique su conexión.",
                    color: "black",
                });
            };

            const datosUpdate = `action=updatePassword&newPassword=${encodeURIComponent(
                newPassword
            )}&userId=${encodeURIComponent(id_user)}`;
            xhrUpdate.send(datosUpdate);
        });
    }

    var closeIcon = document.getElementById("CloseIcon");
    var buttonCerrar = document.getElementById("Cerrar-botton");
    var modalElement = document.getElementById("newPasswordModal"); 

    if (closeIcon) {
        closeIcon.addEventListener("click", function () {
            window.location.href = "cerrar_session";
        });
    }

    if (buttonCerrar) {
        buttonCerrar.addEventListener("click", function () {
            window.location.href = "cerrar_session";
        });
    }

    document.addEventListener('keyup', function(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            if (modalElement && modalElement.classList.contains('show')) {
                window.location.href = "cerrar_session";
            }
        }
    });
});

async function getTicketOpen() {
    try {
        const body = new URLSearchParams({ action: 'getTicketAbiertoCount' });
        const data = await fetchJsonByAction('getTicketAbiertoCount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        });

        if (data.success) {
            document.getElementById("TicketsAbiertos").textContent = data.count;
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch open ticket count:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
  // Referencia al elemento de la tarjeta de estadística para tickets regionales
  const TicketsOpenCard = document.getElementById("Card-Ticket-open");

  // Referencia al elemento del modal para tickets regionales
  const OpenTicketsModalElement = document.getElementById("OpenTicketModal");

  // Declarar la instancia del modal fuera del if/else para que sea accesible
  let OpenTicketsModalInstance = null;

  // Asegúrate de que ambos elementos existan antes de añadir el event listener
  if (TicketsOpenCard && OpenTicketsModalElement) {
    // **Crear la instancia del modal de Bootstrap una sola vez.**
    OpenTicketsModalInstance = new bootstrap.Modal(OpenTicketsModalElement);

    TicketsOpenCard.addEventListener("click", function (event) {
      // Evita el comportamiento predeterminado si el clic es en un enlace o botón.
      event.preventDefault();

      // Muestra el modal usando la instancia de Bootstrap
      OpenTicketsModalInstance.show();
      loadOpenTicketDetails(); // Carga los detalles regionales al abrir el modal
    });
  } else {
    console.error(
      "No se encontraron los elementos TicketsOpenCard o OpenTicketsModalElement."
    );
  }
});

function handleViewDocumentClick() {
    const ticketId = this.dataset.ticketId;

    // Obtener referencias a los elementos del modal de vista previa
    const viewDocumentModal = new bootstrap.Modal(document.getElementById('viewDocumentModal'));
    const viewModalTicketIdSpan = document.getElementById('viewModalTicketId');
    const imageViewPreview = document.getElementById('imageViewPreview');
    const pdfViewViewer = document.getElementById('pdfViewViewer');
    const viewDocumentMessage = document.getElementById('viewDocumentMessage');

    // Limpiar el contenido previo y ocultar elementos
    viewModalTicketIdSpan.textContent = ticketId; // Actualiza el ID del ticket en el modal
    imageViewPreview.style.display = 'none'; // Oculta la imagen
    imageViewPreview.src = '#'; // Limpia la fuente de la imagen
    pdfViewViewer.style.display = 'none'; // Oculta el visor de PDF
    pdfViewViewer.innerHTML = ''; // Limpia el contenido del visor de PDF
    viewDocumentMessage.style.display = 'none'; // Oculta mensajes
    viewDocumentMessage.innerHTML = '';

    // Muestra el modal de carga mientras se busca el documento
    Swal.fire({
        title: 'Cargando documento...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/getAttachments`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'blob'; // Esperamos una respuesta binaria (el archivo)

    xhr.onload = function () {
        Swal.close(); // Cerrar el mensaje de carga de Swal

        if (xhr.status === 200) { // Si la solicitud fue exitosa (código 200)
            const blob = xhr.response; // El archivo binario es el response del XHR
            const mimeType = blob.type; // Obtiene el tipo MIME del Blob (ej. "image/png", "application/pdf")
            const fileUrl = URL.createObjectURL(blob); // Crea una URL temporal en el navegador para el Blob

            viewDocumentModal.show(); // Muestra el modal de visualización del documento

            if (mimeType.startsWith('image/')) {
                // Si es una imagen
                imageViewPreview.src = fileUrl;
                imageViewPreview.style.display = 'block';
            } else if (mimeType === 'application/pdf') {
                // Si es un PDF
                const iframe = document.createElement('iframe');
                iframe.src = fileUrl;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.style.border = 'none';
                pdfViewViewer.appendChild(iframe);
                pdfViewViewer.style.display = 'block';
            } else {
                // Para otros tipos de archivos no directamente visualizables
                viewDocumentMessage.innerHTML = `Tipo de archivo no compatible para vista previa: <strong>${mimeType}</strong>. <a href="${fileUrl}" target="_blank" download="documento">Haz clic aquí para descargar.</a>`;
                viewDocumentMessage.style.display = 'block';
            }
        } else { // Si hubo un error (xhr.status no es 200, ej. 400, 404, 500)
            // Intentar leer la respuesta como texto para ver si es un JSON de error
            // Necesitamos un FileReader porque xhr.responseType fue 'blob'
            const reader = new FileReader();
            reader.onload = function() {
                let errorMessage = `Error al obtener el documento: ${xhr.status} ${xhr.statusText}`;
                try {
                    const errorResponse = JSON.parse(reader.result);
                    errorMessage = `<p>Error del servidor: ${errorResponse.message || 'Error desconocido'}</p>`;
                } catch (e) {
                    // No es JSON, o el JSON es inválido, usar el error HTTP genérico
                    console.error("No es una respuesta JSON de error válida o error de parseo:", reader.result, e);
                }
                viewDocumentMessage.innerHTML = errorMessage;
                viewDocumentMessage.style.display = 'block';
                viewDocumentModal.show(); // Mostrar el modal con el mensaje de error
                console.error("Respuesta de error:", xhr.status, xhr.statusText, reader.result);
            };
            // Si xhr.response es un Blob (aunque sea un Blob de error), léelo como texto
            // Si el error de la API no devuelve un Blob (ej. se cuelga), xhr.response podría ser null
            if (xhr.response) {
                reader.readAsText(xhr.response);
            } else {
                // Si no hay respuesta blob, muestra un mensaje de error genérico
                viewDocumentMessage.innerHTML = `<p>Error al obtener el documento: ${xhr.status} ${xhr.statusText}. No se recibió respuesta.</p>`;
                viewDocumentMessage.style.display = 'block';
                viewDocumentModal.show();
                console.error("No se recibió respuesta del servidor para el error.");
            }
        }
    };

    xhr.onerror = function () {
        Swal.close();
        console.error("Network error for attachments request.");
        viewDocumentMessage.innerHTML = '<p>Error de red al intentar obtener los documentos adjuntos.</p>';
        viewDocumentMessage.style.display = 'block';
        viewDocumentModal.show();
    };

    // Serializar los datos a una cadena URL-encoded
    const dataToSend = `case=getAttachments&ticketId=${encodeURIComponent(ticketId)}`;
    xhr.send(dataToSend); // Envía la cadena
}

// Evento para limpiar el modal cuando se oculta
const viewDocumentModalElement = document.getElementById('viewDocumentModal');
if (viewDocumentModalElement) {
    viewDocumentModalElement.addEventListener('hidden.bs.modal', function () {
        // Revocar la URL del objeto Blob para liberar memoria
        const currentImageUrl = imageViewPreview.src;
        const currentPdfUrl = pdfViewViewer.querySelector('iframe') ? pdfViewViewer.querySelector('iframe').src : null;

        if (currentImageUrl && currentImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(currentImageUrl);
        }
        if (currentPdfUrl && currentPdfUrl.startsWith('blob:')) {
            URL.revokeObjectURL(currentPdfUrl);
        }

        // Limpiar elementos
        imageViewPreview.style.display = 'none';
        imageViewPreview.src = '#';
        pdfViewViewer.style.display = 'none';
        pdfViewViewer.innerHTML = '';
        viewDocumentMessage.style.display = 'none';
        viewDocumentMessage.innerHTML = '';
    });
}

// NUEVA función para adjuntar los event listeners (reconfirmada)
function attachMarkReceivedListeners() {
  document.querySelectorAll('.mark-received-btn').forEach(button => {
    button.removeEventListener('click', handleMarkTicketReceivedClick);
  });

  document.querySelectorAll('.mark-received-btn').forEach(button => {
    button.addEventListener('click', handleMarkTicketReceivedClick);
  });

  document.querySelectorAll('.mark-received-btnTaller').forEach(button => {
    button.removeEventListener('click', handleMarkTicketReceivedClickTaller);
  });

  document.querySelectorAll('.mark-received-btnTaller').forEach(button => {
    button.addEventListener('click', handleMarkTicketReceivedClickTaller);
  });
}

function handleMarkTicketReceivedClickTaller() {
  const ticketId = $(this).data("ticket-id");
  const nroTicket = $(this).data("nro-ticket");
  const serialPos = $(this).data("serial-pos");
  markTicketAsReceivedTaller(ticketId, nroTicket, serialPos);
}

// Wrapper para pasar el ticketId directamente
function handleMarkTicketReceivedClick() {
  const ticketId = $(this).data("ticket-id");
  const nroTicket = $(this).data("nro-ticket");
  const serialPos = $(this).data("serial-pos");
  markTicketAsReceived(ticketId, nroTicket, serialPos);
}

// Función para manejar la lógica de marcar como recibido (como antes)
function markTicketAsReceived(ticketId, nroTicket, serialPos) {
  // Asegúrate de que nroTicket esté como parámetro
  const id_user = document.getElementById("userIdForPassword").value;
  // SVG que quieres usar
  const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
  Swal.fire({
    // El nuevo texto del header va aquí
    title: `Confirmación de recibido`, // Texto fijo para el encabezado
    // El contenido del cuerpo (SVG y texto explicativo) va en 'html'
    html: `${customWarningSvg}<p class="mt-3" id = "textConfirm">¿Deseas Marcar el ticket Nro: <span id = "NroTicketConfirReceiCoord">${nroTicket}</span> Asociado el Pos: <span id = "NroTicketConfirReceiCoord">${serialPos}</span> como recibido? 
    </p><p id = "textConfirmp">Esta acción registrará la fecha de recepción y habilitará la asignación de técnico en el módulo Gestión Coordinador.</p>`,
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
                allowOutsideClick: false,
                allowEscapeKey: false,
                keydownListenerCapture: true
              }).then(() => {
                window.location.reload();
              });
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
      const data = `action=MarkTicketReceived&ticket_id=${ticketId}&id_user=${encodeURIComponent(id_user)}`;
      xhr.send(data);
    }
  });
}


// Asegúrate de que loadOpenTicketDetails se llama cuando el modal se muestra.
// Si ya tienes un trigger para abrir el modal, añade esto:
$('#OpenTicketModal').on('show.bs.modal', function (e) {
    loadOpenTicketDetails();
});

// O si el modal se abre con un clic en tu tarjeta de "Tickets Abiertos":
document.getElementById('Card-Ticket-open').addEventListener('click', function() {
    loadOpenTicketDetails();
    // Asumiendo que ya tienes la lógica para abrir el modal,
    // por ejemplo, con data-bs-toggle="modal" data-bs-target="#OpenTicketModal"
    // en tu HTML, esta línea no sería necesaria aquí.
    // Si lo abres con JS, asegúrate de llamar a $('#OpenTicketModal').modal('show');
});

async function getTicketPercentage() {
    try {
        const actionPath = 'getTicketPercentage';
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'getTicketPercentage'
            })
        };

        // Usa fetchJsonByAction para manejar la llamada a la API
        const data = await fetchJsonByAction(actionPath, fetchOptions);

        if (data.success) {
            const percentage = parseFloat(data.count);
            const displayPercentage = percentage.toFixed(2);
            const percentageSpan = document.getElementById("TicketPorcentOpen");
            
            // Lógica para el signo y el texto
            percentageSpan.textContent = `${percentage > 0 ? "+" : ""}${displayPercentage}%`;

            // Lógica para el color
            if (percentage >= 50) {
                percentageSpan.classList.remove("text-success");
                percentageSpan.classList.add("text-danger");
            } else {
                percentageSpan.classList.remove("text-danger");
                percentageSpan.classList.add("text-success");
            }
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        // En caso de error (red, JSON, etc.), establecemos un valor por defecto
        const percentageSpan = document.getElementById("TicketPorcentOpen");
        percentageSpan.textContent = "+0.00%";
        percentageSpan.classList.remove("text-success");
        percentageSpan.classList.add("text-danger");
        console.error("Failed to fetch ticket percentage:", error);
    }
}

// Llama a la función getTicketPercentage() cuando la página se cargue
window.addEventListener("load", async () => {
    await getTicketOpen();
    await getTicketPercentage();
});


async function getTicketResolve() {
    try {
        const actionPath = 'getTicketsResueltosCount';
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'getTicketsResueltosCount'
            })
        };

        // Usa fetchJsonByAction para manejar la llamada a la API
        const data = await fetchJsonByAction(actionPath, fetchOptions);

        if (data.success) {
            document.getElementById("TicketsResuelto").textContent = data.count;
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch resolved ticket count:", error);
    }
}

async function getTicketsResueltosPercentage() {
    const percentageSpan = document.getElementById("ticketResueltoPercentage");
    const thresholdForGood = 50;

    try {
        const body = new URLSearchParams({ action: 'getTicketsResueltosPercentage' });
        const data = await fetchJsonByAction('getTicketsResueltosPercentage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        let percentage = 0;
        let displayPercentage = "0.00";

        if (data.success && data.count !== null && data.count !== undefined && data.count !== '') {
            const parsedPercentage = parseFloat(data.count);
            if (!isNaN(parsedPercentage)) {
                percentage = parsedPercentage;
                displayPercentage = percentage.toFixed(2);
            }
        }

        percentageSpan.textContent = `+${displayPercentage}%`;

        if (percentage < thresholdForGood) {
            percentageSpan.classList.remove("text-success");
            percentageSpan.classList.add("text-danger");
        } else {
            percentageSpan.classList.remove("text-danger");
            percentageSpan.classList.add("text-success");
        }

        if (!data.success) {
            console.error("Server Error:", data.message);
        }

    } catch (error) {
        // En caso de error, mostramos 0.00% y aplicamos el estilo de error
        percentageSpan.textContent = "+0.00%";
        percentageSpan.classList.remove("text-success");
        percentageSpan.classList.add("text-danger");
        console.error("Failed to fetch resolved ticket percentage:", error);
    }
}

async function getTicketsgestionComercialporcent() {
    const percentageSpan = document.getElementById("PorcentGestionComercial");
    const thresholdForGood = 50;

    try {
        const body = new URLSearchParams({ action: 'getTicketsgestioncomercialPorcent' });
        const data = await fetchJsonByAction('getTicketsgestioncomercialPorcent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        let percentage = 0;
        let displayPercentage = "0.00";

        if (data.success && data.count !== null && data.count !== undefined && data.count !== '') {
            const parsedPercentage = parseFloat(data.count);
            if (!isNaN(parsedPercentage)) {
                percentage = parsedPercentage;
                displayPercentage = percentage.toFixed(2);
            }
        }

        percentageSpan.textContent = `+${displayPercentage}%`;

        if (percentage < thresholdForGood) {
            percentageSpan.classList.remove("text-success");
            percentageSpan.classList.add("text-danger");
        } else {
            percentageSpan.classList.remove("text-danger");
            percentageSpan.classList.add("text-success");
        }

        if (!data.success) {
            console.error("Server Error:", data.message);
        }

    } catch (error) {
        percentageSpan.textContent = "+0.00%";
        percentageSpan.classList.remove("text-success");
        percentageSpan.classList.add("text-danger");
        console.error("Failed to fetch commercial management percentage:", error);
    }
}

// Llama a las funciones cuando la página se cargue
window.addEventListener("load", async () => {
  await getTicketResolve();
  await getTicketsResueltosPercentage(); // Agrega esta línea
});

async function getTicketTotal() {
    try {
        const body = new URLSearchParams({ action: 'getTicketsTotalCount' });
        const data = await fetchJsonByAction('getTicketsTotalCount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        });

        if (data.success) {
            document.getElementById("TotalTicket").textContent = data.count;
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch total ticket count:", error);
    }
}

async function getTicketGestionComercial() {
    try {
        const actionPath = 'getTicketGestionComercialCount';
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'getTicketGestionComercialCount'
            })
        };

        // Usa fetchJsonByAction para manejar la llamada a la API
        const data = await fetchJsonByAction(actionPath, fetchOptions);

        if (data.success) {
            document.getElementById("ticketGestionComercialCount").textContent = data.count;
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch commercial management ticket count:", error);
    }
}

async function getTicketTotalSendTotaller() {
    try {
        const body = new URLSearchParams({ action: 'getTicketsSendTallerTotalCount' });
        const data = await fetchJsonByAction('getTicketsSendTallerTotalCount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        });

        if (data.success) {
            document.getElementById("TotalEnviadoTaller").textContent = data.count;
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch total tickets sent to shop:", error);
    }
}

async function getTotalTicketsPercentageOFSendTaller() {
    const percentageSpan = document.getElementById("PorcentSendToTaller");
    const thresholdForGood = 50;

    try {
        const actionPath = 'getTotalTicketsPercentageSendToTaller';
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'getTotalTicketsPercentageSendToTaller'
            })
        };

        // Use fetchJsonByAction to handle the fetch call and JSON parsing
        const data = await fetchJsonByAction(actionPath, fetchOptions);

        let percentage = 0;
        let displayPercentage = "0.00";

        if (data.success && data.porcent !== null && data.porcent !== undefined && data.porcent !== '') {
            const parsedPercentage = parseFloat(data.porcent);
            if (!isNaN(parsedPercentage)) {
                percentage = parsedPercentage;
                displayPercentage = percentage.toFixed(2);
            }
        }

        percentageSpan.textContent = `+${displayPercentage}%`;

        if (percentage < thresholdForGood) {
            percentageSpan.classList.remove("text-success");
            percentageSpan.classList.add("text-danger");
        } else {
            percentageSpan.classList.remove("text-danger");
            percentageSpan.classList.add("text-success");
        }

        if (!data.success) {
            console.error("Server Error:", data.message);
        }

    } catch (error) {
        percentageSpan.textContent = "+0.00%";
        percentageSpan.classList.remove("text-success");
        percentageSpan.classList.add("text-danger");
        console.error("Failed to fetch total tickets percentage sent to shop:", error);
    }
}

async function getTotalPorcentageticket_in_process() {
    const percentageSpan = document.getElementById("Process_Tickets");
    const thresholdForGood = 50;

    try {
        const actionPath = 'getTotalTicketsPercentageinprocess';
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'getTotalTicketsPercentageinprocess'
            })
        };

        // Use fetchJsonByAction to handle the fetch call and JSON parsing
        const data = await fetchJsonByAction(actionPath, fetchOptions);

        let percentage = 0;
        let displayPercentage = "0.00";

        if (data.success && data.porcent !== null && data.porcent !== undefined && data.porcent !== '') {
            const parsedPercentage = parseFloat(data.porcent);
            if (!isNaN(parsedPercentage)) {
                percentage = parsedPercentage;
                displayPercentage = percentage.toFixed(2);
            }
        }

        percentageSpan.textContent = `+${displayPercentage}%`;

        if (percentage < thresholdForGood) {
            percentageSpan.classList.remove("text-success");
            percentageSpan.classList.add("text-danger");
        } else {
            percentageSpan.classList.remove("text-danger");
            percentageSpan.classList.add("text-success");
        }

        if (!data.success) {
            console.error("Server Error:", data.message);
        }

    } catch (error) {
        percentageSpan.textContent = "+0.00%";
        percentageSpan.classList.remove("text-success");
        percentageSpan.classList.add("text-danger");
        console.error("Failed to fetch tickets in process percentage:", error);
    }
}

async function getTotalTicketsInProcess() {
    try {
        const body = new URLSearchParams({ action: 'getTotalTicketsInProcess' });
        const data = await fetchJsonByAction('getTotalTicketsInProcess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        });

        if (data.success) {
            document.getElementById("ProcessTicketNumber").textContent = data.count;
        } else {
            console.error("Server Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch tickets in process count:", error);
    }
}

// Llama a las funciones cuando la página se cargue
window.addEventListener("load", async () => {
  await getTicketTotal();
  await getTicketTotalSendTotaller();
  await getTotalTicketsPercentageOFSendTaller();
  await getTotalTicketsInProcess();
  await getTotalPorcentageticket_in_process();
});

function loadRegionTicketDetails() {
  const contentDiv = document.getElementById("RegionTicketsContent");
  contentDiv.innerHTML = "<p>Cargando información regional...</p>"; // Mensaje de carga

  fetch(
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetMonthlyCreatedTicketsForChartForState`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        contentDiv.innerHTML = formatRegionDetails(data.details); // Renderizar los datos
      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles regionales: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error(
          "Error en los datos de la API para regiones:",
          data.message
        );
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
         `<tr>
        <td colspan="14" class="text-center text-muted py-5">
          <div class="d-flex flex-column align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
              <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
            <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
            <p class="text-muted mb-0">No hay tickets para mostrar gráfica regional.</p>
          </div>
        </td>
      </tr>`
      console.error("Error fetching regional details:", error);
    });
}

// Función para formatear la tabla de tickets por región (ajustada)
function formatRegionDetails(details) {
  const InputSearch = document.getElementById("ticketSearchInputRegion");
  
  if (InputSearch) {
    InputSearch.style.display = "none"; // Mostrar el input de búsqueda
  }

  let html = `
        <p>Haz clic en el número de tickets para ver el detalle de todos los tickets en esa región.</p>
        <table class="table table-striped table-bordered mt-3">
            <thead>
                <tr>
                    <th>Región</th>
                    <th>Tickets Realizados</th>
                </tr>
            </thead>
            <tbody>
    `;

  details.forEach((item) => {
    html += `
            <tr>
                <td>${item.region_name || "N/A"}</td>
                <td>
                    <button class="btn btn-link p-0 region-tickets-total-detail"
                            data-region="${item.region_name}"
                            data-count="${item.total_tickets || 0}">
                        ${item.total_tickets || 0}
                    </button>
                </td>
            </tr>
        `;
  });

  html += `
            </tbody>
        </table>
        <p class="text-muted mt-3">Resumen de tickets realizados por región.</p>
    `;
  return html;
}

// Función para formatear los tickets individuales por región
function formatIndividualRegionTickets(tickets, region) {
  const InputSearch = document.getElementById("ticketSearchInputRegion");

  if (InputSearch) {
    InputSearch.style.display = "inline-block"; // Mostrar el input de búsqueda
  }

  if (tickets.length === 0) {
    return `<p>No hay tickets para la región ${region}.</p>
                  <button class="btn btn-primary mt-3" onclick="loadRegionTicketDetails()">Volver al resumen regional</button>`;
  }

  let html = `
        <h5 style = "color:black;">Tickets para la región: ${region}</h5>
        <div class="ticket-details-list mt-3">
    `;

  // Asegúrate de que las propiedades del objeto `ticket` coincidan con lo que tu API de detalles individuales devuelve
  tickets.forEach((ticket) => {
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white" id = "Cardticket" data-ticket-id="${ticket.id_ticket}" data-nro-ticket="${ticket.nro_ticket}" data-id-accion-ticket = "${ticket.id_accion_ticket}">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                <dl class="row mb-0">
                    <dt class="col-sm-4">Region:</dt>
                        <dd class="col-sm-8">${
                          ticket.region_ticket || "N/A"
                        }</dd>

                    
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>
                        
                        
                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${ticket.date_create_ticket}</dd>
                    </dl>
                </div>
            </div>
        `;
  });

  html += `
        </div>
        <button class="btn btn-primary mt-3" onclick="loadRegionTicketDetails()">Volver al resumen regional</button>
    `;
  return html;
}

function loadIndividualRegionTicketDetails(region) {
  const contentDiv = document.getElementById("RegionTicketsContent");
  const searchInput = document.getElementById("ticketSearchInputRegion");

  // Almacenar la región en variable global
  currentRegion = region;

  let loadingMessage = `Cargando tickets para la región ${region}...`;
  contentDiv.innerHTML = `<p>${loadingMessage}</p>`;
  
  if (searchInput) {
    searchInput.value = '';
    searchInput.style.display = "inline-block";
  }

  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetIndividualTicketDetailsByRegion`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success && response.details) {
          allRegionTickets = response.details; // Almacenar todos los tickets
          displayFilteredTickets(allRegionTickets, 'RegionTicketsContent', currentMonth, currentStatus);
          
          // Añadir event listener para el input de búsqueda
          if (searchInput) {
            if (regionTicketSearchHandler) {
              searchInput.removeEventListener('input', regionTicketSearchHandler);
            }
            regionTicketSearchHandler = (e) => {
              handleTicketSearch(e, allRegionTickets, 'RegionTicketsContent');
            };
            searchInput.addEventListener('input', regionTicketSearchHandler);
          }
        } else {
          contentDiv.innerHTML =
            `<p>Error al cargar el detalle de tickets: ` +
            (response.message || "Error desconocido") +
            `</p>`;
          console.error(
            "Error en los datos de la API para tickets individuales por región:",
            response.message
          );
          allRegionTickets = [];
          if (searchInput && regionTicketSearchHandler) {
            searchInput.removeEventListener('input', regionTicketSearchHandler);
            regionTicketSearchHandler = null;
          }
        }
      } catch (error) {
        console.error(
          "Error parsing JSON for individual regional ticket details:",
          error
        );
        contentDiv.innerHTML = `<p>Error de procesamiento de datos al cargar el detalle de tickets.</p>`;
        allRegionTickets = [];
        if (searchInput && regionTicketSearchHandler) {
          searchInput.removeEventListener('input', regionTicketSearchHandler);
          regionTicketSearchHandler = null;
        }
      }
    } else {
      console.error(
        "Error fetching individual regional ticket details:",
        xhr.status,
        xhr.statusText
      );
      contentDiv.innerHTML = `<p>Error de red al cargar el detalle de tickets. Por favor, intente de nuevo más tarde.</p>`;
      allRegionTickets = [];
      if (searchInput && regionTicketSearchHandler) {
        searchInput.removeEventListener('input', regionTicketSearchHandler);
        regionTicketSearchHandler = null;
      }
    }
  };

  xhr.onerror = function () {
    console.error(
      "Network error during individual regional ticket details fetch."
    );
    contentDiv.innerHTML = `<p>Error de conexión al cargar el detalle de tickets.</p>`;
    allRegionTickets = [];
    if (searchInput && regionTicketSearchHandler) {
      searchInput.removeEventListener('input', regionTicketSearchHandler);
      regionTicketSearchHandler = null;
    }
  };

  // Prepara los datos a enviar: solo la región
  let dataToSend = `action=GetIndividualTicketDetailsByRegion&region=${encodeURIComponent(
    region
  )}`;
  xhr.send(dataToSend);
}

let monthlyTicketsChartInstance; // Variable global para la instancia del gráfico
let monthlyTicketsChartInstanceForState;

// Función para mostrar mensajes de error con mejor formato
function displayChartErrorMessage(chartId, message, type = 'info') {
    const chartContainer = document.getElementById(chartId).parentNode;
    let errorMessageDiv = chartContainer.querySelector('.chart-error-message');

    if (!errorMessageDiv) {
        errorMessageDiv = document.createElement('div');
        errorMessageDiv.className = 'chart-error-message';
        errorMessageDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%);
            color: #495057;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
            z-index: 10;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            backdrop-filter: blur(5px);
        `;
        chartContainer.style.position = 'relative';
        chartContainer.appendChild(errorMessageDiv);
    }

    // Crear contenido del mensaje con icono y texto
    errorMessageDiv.innerHTML = `
        <div style="margin-bottom: 15px;">
            ${type === 'error' ? 
                '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' :
                '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
            }
        </div>
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: ${type === 'error' ? '#dc3545' : '#495057'};">
            ${message}
        </div>
        <div style="font-size: 14px; color: #6c757d; opacity: 0.8;">
            ${type === 'error' ? 'Cree tickets para Vizualizar datos' : 'No hay información disponible'}
        </div>
    `;
    
    errorMessageDiv.style.display = 'flex';
}

// Función para ocultar mensajes de error
function hideChartErrorMessage(chartId) {
    const chartContainer = document.getElementById(chartId).parentNode;
    const errorMessageDiv = chartContainer.querySelector('.chart-error-message');
    if (errorMessageDiv) {
        errorMessageDiv.style.display = 'none';
    }
}

function formatDetalleTicketComercial(details) {
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <div class="ticket-details-list mt-3">
    `;

  details.forEach((ticket) => {
    // <-- ¡Corregido aquí! Ahora usa 'details'
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    Ticket #<strong>${ticket.nro_ticket || "N/A"}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.serial_pos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${
                          ticket.razon_social_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || "N/A"}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_modelopos_cliente || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Documento:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_payment || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Taller:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Domiciliación:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_domiciliacion || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${
                          ticket.date_create_ticket
                        }</dd> <!-- Usar la variable formateada -->
                    </dl>
                </div>
            </div>
        `;
  });
  return html;
}

async function loadMonthlyCreatedTicketsChart() {
    // Array para los colores de fondo con degradado
    const gradientColors = [
        { start: "rgba(41, 128, 185, 0.9)", end: "rgba(52, 152, 219, 0.9)" },
        { start: "rgba(44, 62, 80, 0.9)", end: "rgba(52, 73, 94, 0.9)" },
        { start: "rgba(39, 174, 96, 0.9)", end: "rgba(46, 204, 113, 0.9)" },
        { start: "rgba(22, 160, 133, 0.9)", end: "rgba(26, 188, 156, 0.9)" },
        { start: "rgba(243, 156, 18, 0.9)", end: "rgba(241, 196, 15, 0.9)" },
        { start: "rgba(230, 126, 34, 0.9)", end: "rgba(211, 84, 0, 0.9)" },
        { start: "rgba(142, 68, 173, 0.9)", end: "rgba(155, 89, 182, 0.9)" },
        { start: "rgba(231, 76, 60, 0.9)", end: "rgba(192, 57, 43, 0.9)" },
        { start: "rgba(39, 174, 96, 0.9)", end: "rgba(46, 204, 113, 0.9)" },
        { start: "rgba(127, 140, 141, 0.9)", end: "rgba(149, 165, 166, 0.9)" },
        { start: "rgba(31, 44, 58, 0.9)", end: "rgba(41, 61, 81, 0.9)" },
        { start: "rgba(52, 152, 219, 0.9)", end: "rgba(93, 173, 226, 0.9)" },
    ];

    // Array para los colores del borde
    const borderColors = [
        "rgba(41, 128, 185, 1)", "rgba(44, 62, 80, 1)", "rgba(39, 174, 96, 1)",
        "rgba(22, 160, 133, 1)", "rgba(243, 156, 18, 1)", "rgba(230, 126, 34, 1)",
        "rgba(142, 68, 173, 1)", "rgba(231, 76, 60, 1)", "rgba(39, 174, 96, 1)",
        "rgba(127, 140, 141, 1)", "rgba(31, 44, 58, 1)", "rgba(52, 152, 219, 1)",
    ];

    const chartCanvasId = "chart-line";
    const ctx = document.getElementById(chartCanvasId).getContext("2d");

    // Ocultar mensaje de error previo
    hideChartErrorMessage(chartCanvasId);

    try {
        // Usa fetchJsonByAction para manejar la llamada a la API
        const data = await fetchJsonByAction('GetMonthlyCreatedTicketsForChart');

        if (data.success && data.details && data.details.length > 0) {
            const labels = data.details.map((item) => `${item.month_name} ${item.year_month.substring(0, 4)}`);
            const chartData = data.details.map((item) => item.total_tickets_creados_mes);

            // Destruir el gráfico si ya existe una instancia
            if (monthlyTicketsChartInstance) {
                monthlyTicketsChartInstance.destroy();
            }

            monthlyTicketsChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Total de Tickets Creados",
                        data: chartData,
                        backgroundColor: function (context) {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;
                            if (!chartArea) {
                                // Fallback sólido en el primer render para evitar barras invisibles
                                const fallbackColors = [
                                    "rgba(52, 152, 219, 0.7)", "rgba(52, 73, 94, 0.7)", "rgba(46, 204, 113, 0.7)",
                                    "rgba(26, 188, 156, 0.7)", "rgba(241, 196, 15, 0.7)", "rgba(211, 84, 0, 0.7)",
                                    "rgba(155, 89, 182, 0.7)", "rgba(192, 57, 43, 0.7)", "rgba(46, 204, 113, 0.7)",
                                    "rgba(149, 165, 166, 0.7)", "rgba(41, 61, 81, 0.7)", "rgba(93, 173, 226, 0.7)"
                                ];
                                return fallbackColors[context.dataIndex % fallbackColors.length];
                            }

                            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                            const index = context.dataIndex;
                            const colorInfo = gradientColors[index % gradientColors.length];

                            if (colorInfo) {
                                gradient.addColorStop(0, colorInfo.start);
                                gradient.addColorStop(1, colorInfo.end);
                            } else {
                                gradient.addColorStop(0, "rgba(0,0,0,0.7)");
                                gradient.addColorStop(1, "rgba(0,0,0,0.5)");
                            }
                            return gradient;
                        },
                        borderColor: borderColors,
                        borderWidth: 1,
                        categoryPercentage: 0.7,
                        barPercentage: 0.8,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: "#6c757d", font: { size: 12 } },
                            grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
                        },
                        x: {
                            ticks: { color: "#6c757d", font: { size: 12 } },
                            grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
                        },
                    },
                    plugins: {
                        legend: { display: true, labels: { color: "#343a40" } },
                        tooltip: { backgroundColor: "rgba(0,0,0,0.7)", titleColor: "white", bodyColor: "white" },
                    },
                },
            });
            // Forzar actualización tras el primer layout para asegurar degradados
            setTimeout(() => {
                try { monthlyTicketsChartInstance.update(); } catch (_) {}
            }, 200);
        } else {
            console.warn("No hay datos disponibles para el gráfico de tickets creados por mes o la respuesta no fue exitosa.");
            if (monthlyTicketsChartInstance) {
                monthlyTicketsChartInstance.destroy();
            }
            displayChartErrorMessage(chartCanvasId, "No hay tickets creados este mes", 'info');
        }
    } catch (error) {
        console.error("Error al cargar los datos del gráfico de tickets creados por mes:", error);
        if (monthlyTicketsChartInstance) {
            monthlyTicketsChartInstance.destroy();
        }
        displayChartErrorMessage(chartCanvasId, "No hay datos en la gráfica", 'error');
    }
}

async function updateTicketMonthlyPercentageChange() {
  const porcentElement = document.getElementById("porcent");

  if (porcentElement) porcentElement.textContent = "Cargando...";

  try {
    // Usa fetchJsonByAction para obtener los datos de la API
    // La función se encarga de la llamada fetch, la validación de la respuesta
    // y el análisis del JSON.
    const data = await fetchJsonByAction("GetMonthlyTicketPercentageChange");

    // ** CAMBIO CRÍTICO AQUÍ: Accede directamente a data.porcent **
    let percentage = data.porcent; // Toma el número directamente

    let textContent = "";
    let color = "gray";

    if (percentage === null || isNaN(percentage)) {
      textContent = `N/A`;
    } else {
      const roundedPercentage = Math.round(percentage); // Redondea al entero más cercano

      if (roundedPercentage >= 0) {
        textContent = `+${roundedPercentage}% más`;
        color = "green";
      } else {
        textContent = `${roundedPercentage}% menos`;
        color = "red";
      }
    }

    if (porcentElement) {
      porcentElement.textContent = textContent;
      porcentElement.style.color = color;
    }
  } catch (error) {
    if (porcentElement) {
      porcentElement.textContent = "0%"; // Valor por defecto en caso de error
      porcentElement.style.color = "grey";
    }
    console.error("Failed to fetch monthly ticket percentage:", error);
  }
}

async function loadMonthlyCreatedTicketsChartForState() {
    // Array para los colores de fondo con degradado para los estados/regiones (7 colores distintos)
    const gradientColorsForState = [
        { start: "rgba(46, 116, 181, 0.9)", end: "rgba(74, 160, 217, 0.9)" },
        { start: "rgba(46, 204, 113, 0.9)", end: "rgba(77, 219, 137, 0.9)" },
        { start: "rgba(155, 89, 182, 0.9)", end: "rgba(189, 119, 218, 0.9)" },
        { start: "rgba(0, 128, 128, 0.9)", end: "rgba(0, 178, 178, 0.9)" },
        { start: "rgba(204, 102, 0, 0.9)", end: "rgba(255, 153, 51, 0.9)" },
        { start: "rgba(90, 100, 110, 0.9)", end: "rgba(130, 140, 150, 0.9)" },
        { start: "rgba(231, 76, 60, 0.9)", end: "rgba(241, 148, 138, 0.9)" },
    ];

    // Array para los colores del borde para los estados/regiones
    const borderColorsForState = [
        "rgba(46, 116, 181, 1)",
        "rgba(46, 204, 113, 1)",
        "rgba(155, 89, 182, 1)",
        "rgba(0, 128, 128, 1)",
        "rgba(204, 102, 0, 1)",
        "rgba(90, 100, 110, 1)",
        "rgba(231, 76, 60, 1)",
    ];

    const chartCanvasId = "ticketsChart";
    const ctx = document.getElementById(chartCanvasId).getContext("2d");

    // Ocultar mensaje de error previo
    hideChartErrorMessage(chartCanvasId);

    try {
        // Use fetchJsonByAction to handle the API call
        const data = await fetchJsonByAction('GetMonthlyCreatedTicketsForChartForState');

        if (data.success && data.details && data.details.length > 0) {
            const labels = data.details.map((item) => `${item.region_name}`);
            const chartData = data.details.map((item) => item.total_tickets);

            // If a chart instance already exists, destroy it before creating a new one
            if (monthlyTicketsChartInstanceForState) {
                monthlyTicketsChartInstanceForState.destroy();
            }

            monthlyTicketsChartInstanceForState = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Total de Tickets Creados por Región",
                        data: chartData,
                        backgroundColor: function (context) {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;
                            if (!chartArea) {
                                const fallbackColors = [
                                    "rgba(74, 160, 217, 0.7)", "rgba(77, 219, 137, 0.7)", "rgba(189, 119, 218, 0.7)",
                                    "rgba(0, 178, 178, 0.7)", "rgba(255, 153, 51, 0.7)", "rgba(130, 140, 150, 0.7)",
                                    "rgba(241, 148, 138, 0.7)"
                                ];
                                return fallbackColors[context.dataIndex % fallbackColors.length];
                            }

                            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                            const index = context.dataIndex;
                            const colorInfo = gradientColorsForState[index % gradientColorsForState.length];

                            if (colorInfo) {
                                gradient.addColorStop(0, colorInfo.start);
                                gradient.addColorStop(1, colorInfo.end);
                            } else {
                                gradient.addColorStop(0, "rgba(100,100,100,0.7)");
                                gradient.addColorStop(1, "rgba(150,150,150,0.5)");
                            }
                            return gradient;
                        },
                        borderColor: borderColorsForState,
                        borderWidth: 1,
                        categoryPercentage: 0.7,
                        barPercentage: 0.8,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: "#6c757d", font: { size: 12 } },
                            grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
                        },
                        x: {
                            ticks: { color: "#6c757d", font: { size: 12 } },
                            grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
                        },
                    },
                    plugins: {
                        legend: { display: true, labels: { color: "#343a40" } },
                        tooltip: { backgroundColor: "rgba(0,0,0,0.7)", titleColor: "white", bodyColor: "white" },
                    },
                },
            });
            setTimeout(() => {
                try { monthlyTicketsChartInstanceForState.update(); } catch (_) {}
            }, 200);
        } else {
            console.warn("No hay datos disponibles para el gráfico de tickets creados por región o la respuesta no fue exitosa.");
            if (monthlyTicketsChartInstanceForState) {
                monthlyTicketsChartInstanceForState.destroy();
            }
            displayChartErrorMessage(chartCanvasId, "No hay tickets por región disponibles", 'info');
        }
    } catch (error) {
        console.error("Error al cargar los datos del gráfico de tickets creados por región:", error);
        if (monthlyTicketsChartInstanceForState) {
                monthlyTicketsChartInstanceForState.destroy();
            }
        displayChartErrorMessage(chartCanvasId, "No hay tickets en la gráfica", 'error');
    }
}

async function getTicketCounts() {
    const tbodyCounts = document.getElementById("ticketCountsBody");

    // Mostrar estado de carga
    tbodyCounts.innerHTML = `
        <tr>
            <td colspan="2" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">
                Cargando resumen de tickets...
            </td>
        </tr>
    `;

    try {
        const data = await fetchJsonByAction('GetTicketCounts');


        // Limpiar el contenido de la tabla antes de renderizar
        tbodyCounts.innerHTML = '';

        if (data.success && Array.isArray(data.counts) && data.counts.length > 0) {
            data.counts.forEach(item => {
                const tr = document.createElement('tr');
                const moduleName = item.name_accion_ticket;
                tr.innerHTML = `
                    <td class="px-5 py-5 border-b border-gray-200 text-sm">${moduleName}</td>
                    <td class="px-5 py-5 border-b border-gray-200 text-sm">${item.total_tickets}</td>
                `;
                tbodyCounts.appendChild(tr);
            });
        } else {
            // Manejar caso sin datos o error de servidor
            const errorMessage = data.success ?
                "No hay tickets en los módulos seleccionados." :
                "Error al cargar conteos.";

            tbodyCounts.innerHTML = `
                <tr>
                    <td colspan="2" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">
                        ${errorMessage}
                    </td>
                </tr>
            `;
            console.error("Server Error:", data.message || errorMessage);
        }
    } catch (error) {
        // Manejar errores de red o de parseo de JSON
        tbodyCounts.innerHTML = `
            <tr>
                <td colspan="2" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">
                    Error al obtener datos.
                </td>
            </tr>
        `;
        console.error("Failed to fetch ticket counts:", error);
    }
}

// Llama a esta función para cargar el gráfico cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async  function () {
  await loadMonthlyCreatedTicketsChart();
  await loadMonthlyCreatedTicketsChartForState();
  await updateTicketMonthlyPercentageChange();
  await getTicketProcessReparacion();
  await getTicketReparados();
  await getTicketPendienteRepuesto();
  await  getTicketIrreparables();
  await getTicketCounts(); // Para la tabla de conteos
  await getTicketsgestionComercialporcent();
  await getTicketGestionComercial();
  await getTicketEntregadoCliente();
});

function showErrorMessage(title, message) {
  Swal.fire({
    title: title,
    html: `
      <div class="text-center text-muted">
        <div class="d-flex flex-column align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#dc3545" class="bi bi-exclamation-triangle mb-3" viewBox="0 0 16 16">
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
          </svg>
          <h5 class="text-muted mb-2">${title}</h5>
          <p class="text-muted mb-0">${message}</p>
        </div>
      </div>`,
    icon: "error",
    confirmButtonText: "Ok",
    confirmButtonColor: "#003594",
    color: "black"
  });
}

function markTicketAsReceivedTaller(ticketId, nroTicket, serialPos) {
  // Validar parámetros
  if (!ticketId || !nroTicket || !serialPos) {
    console.error("Parámetros inválidos:", { ticketId, nroTicket, serialPos });
    showErrorMessage("Error de Validación", "Faltan parámetros requeridos (ID de ticket, número de ticket o serial).");
    return;
  }

  const id_user = document.getElementById("userIdForPassword")?.value;
  if (!id_user) {
    console.error("El elemento userIdForPassword no se encuentra en el DOM o está vacío.");
    showErrorMessage("Error de Validación", "No se pudo obtener el ID del usuario.");
    return;
  }

  const dataToSendString = `action=UpdateStatusToReceiveInTaller&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(ticketId)}&nro_ticket=${encodeURIComponent(nroTicket)}&serial_pos=${encodeURIComponent(serialPos)}`;

  const customWarningSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16">
      <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/>
    </svg>`;

  Swal.fire({
    title: "Confirmación de recibido",
    html: `
      ${customWarningSvg}
      <p class="mt-3">¿Deseas marcar el ticket Nro: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> asociado al POS: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> como recibido en el taller?</p>
      <p><span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 80%">Esta acción registrará la fecha de recepción en taller y habilitará los Estatus Correspondientes del Taller.</p></span>`,
    showCancelButton: true,
    confirmButtonColor: "#003594",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Recibir POS",
    cancelButtonText: "Cancelar",
    color: "black",
    customClass: {
      popup: "swal2-custom-header-popup",
      title: "swal2-custom-title",
      content: "custom-content",
      actions: "custom-actions",
      confirmButton: "swal2-confirm-receive-ticket-class",
      cancelButton: "swal2-cancel-receive-ticket-class"
    },
    didOpen: (popup) => {
      const confirmBtn = popup.querySelector(".swal2-confirm-receive-ticket-class");
      const cancelBtn = popup.querySelector(".swal2-cancel-receive-ticket-class");
      if (confirmBtn) confirmBtn.id = "swal2-confirm-receive-ticket-id";
      if (cancelBtn) cancelBtn.id = "swal2-cancel-receive-ticket-id";
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateStatusToReceiveInTaller`);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText || "{}");

            if (response.success === true || response.success === "true") {
              Swal.fire({
                title: "¡Notificación!",
                html: `El POS se encontrará en el taller como <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">En Proceso de reparación</span>.`,
                icon: "success",
                confirmButtonText: "Ok",
                confirmButtonColor: "#003594",
                color: "black",
                customClass: {
                  confirmButton: "BtnConfirmacion"
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  location.reload();
                }
              });
            } else {
              console.warn("La API retornó éxito: falso o un valor inesperado:", response);
              showErrorMessage("Error", response.message || "No se pudo actualizar el ticket.");
            }
          } catch (error) {
            console.error("Error al analizar la respuesta JSON:", error);
            showErrorMessage("Error de Procesamiento", "Hubo un problema al procesar la respuesta del servidor.");
          }
        } else {
          console.error("Error al actualizar el estado (HTTP):", xhr.status, xhr.statusText, xhr.responseText);
          showErrorMessage("Error del Servidor", `No se pudo comunicar con el servidor. Código: ${xhr.status}`);
        }
      };

      xhr.onerror = function () {
        console.error("Error de red al intentar actualizar el ticket.");
        showErrorMessage("Error de Conexión", "Hubo un problema de red. Por favor, inténtalo de nuevo.");
      };

      xhr.send(dataToSendString);
    }
  });
}

document.addEventListener('click', function(event) {
    // 1. Identifica el elemento clicado
    const targetCard = event.target.closest('#Cardticket');

    // 2. Comprueba si el clic fue dentro de una tarjeta con la clase '.card-ticket'
    if (targetCard) {
        // 3. Extrae los datos del elemento (no del evento)
        const idAccionTicket = parseInt(targetCard.getAttribute('data-id-accion-ticket'));
        const idTicket = targetCard.getAttribute('data-ticket-id');
        const nroTicket = targetCard.getAttribute('data-nro-ticket');

        // 4. Llama a tu función de redirección
        redirigirPorAccion(idAccionTicket, idTicket, nroTicket);
    }
});