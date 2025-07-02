/*document.addEventListener("DOMContentLoaded", (event) => {
  const anchoPantalla = window.innerWidth;
  const altoPantalla = window.innerHeight;
  console.log(`Ancho de la pantalla: ${anchoPantalla}px`);
  console.log(`Alto de la pantalla: ${altoPantalla}px`);
});*/

document.addEventListener("DOMContentLoaded", function () {
  // --- Referencias a los elementos HTML de los Modales ---
  const monthlyTicketsModalElement = document.getElementById("monthlyTicketsModal");
  const regionTicketsModalElement = document.getElementById("RegionTicketsModal");
  const openTicketsModalElement = document.getElementById("OpenTicketModal");
  const resolveTicketsModalElement = document.getElementById("ResolveTicketsModal");
  const sendTallerTicketsModalElement = document.getElementById("SendTallerTicketsModal"); // ¡NUEVO MODAL!
  const processTicketModalElement = document.getElementById("ProcessTicketsModal"); // ��NUEVO MODAL!


  const ModalReparacion = document.getElementById("procesoReparacionModal"); // ��NUEVO ELEMENTO!
  const ModalReparado = document.getElementById("ReparadosModal"); // ��NUEVO ELEMENTO!
  const ModalPendienteRepuesto = document.getElementById("pendienterespuestoModal"); // ��NUEVO ELEMENTO!
  const ModalTikIrreparable = document.getElementById("IrreparableModal"); // ��NUEVO ELEMENTO!


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

  // 1. Botones de cierre para monthlyTicketsModal
  const cerrarMonthly = document.getElementById("ModalStadisticMonth");
  const iconMonthly = document.getElementById("ModalStadisticMonthIcon");

  if (cerrarMonthly && monthlyTicketsModalInstance) {
    cerrarMonthly.addEventListener("click", function () {
      monthlyTicketsModalInstance.hide();
    });
  }

  if (iconMonthly && monthlyTicketsModalInstance) {
    iconMonthly.addEventListener("click", function () {
      monthlyTicketsModalInstance.hide();
    });
  }

  // 2. Botones de cierre para RegionTicketsModal
  const cerrarRegion = document.getElementById("ModalStadisticRegion");
  const iconRegion = document.getElementById("ModalStadisticRegionIcon");

  if (cerrarRegion && regionTicketsModalInstance) {
    cerrarRegion.addEventListener("click", function () {
      regionTicketsModalInstance.hide();
    });
  }

  if (iconRegion && regionTicketsModalInstance) {
    iconRegion.addEventListener("click", function () {
      regionTicketsModalInstance.hide();
    });
  }

  // 3. Botones de cierre para OpenTicketModal
  const cerrarOpen = document.getElementById("ModalOpen");
  const iconOpen = document.getElementById("ModalOpenIcon");

  if (cerrarOpen && openTicketsModalInstance) {
        cerrarOpen.addEventListener("click", function () {
            openTicketsModalInstance.hide();
            // AÑADE ESTE CÓDIGO AQUÍ PARA QUE SE EJECUTE AL CLIC DEL BOTÓN "Cerrar"
            forceCleanupAfterModalClose();
        });
    }

    if (iconOpen && openTicketsModalInstance) {
        iconOpen.addEventListener("click", function () {
            openTicketsModalInstance.hide();
            // AÑADE ESTE CÓDIGO AQUÍ PARA QUE SE EJECUTE AL CLIC DEL ICONO "X"
            forceCleanupAfterModalClose();
        });
    }

  // 4. Botones de cierre para ResolveTicketsModal
  const cerrarResolve = document.getElementById("ModalResolveRegion");
  const iconResolve = document.getElementById("ModalResolveIcon");

  if (cerrarResolve && resolveTicketsModalInstance) {
    cerrarResolve.addEventListener("click", function () {
      resolveTicketsModalInstance.hide();
    });
  }

  if (iconResolve && resolveTicketsModalInstance) {
    iconResolve.addEventListener("click", function () {
      resolveTicketsModalInstance.hide();
    });
  }

  // 5. Botones de cierre para SendTallerTicketsModal (¡NUEVO!)
  const cerrarTaller = document.getElementById("ModalTallerRegion"); // El ID de tu botón "Cerrar" en el footer
  const iconTaller = document.getElementById("ModalTallerIcon"); // El ID de tu botón "x" en el header

  if (cerrarTaller && sendTallerTicketsModalInstance) {
    cerrarTaller.addEventListener("click", function () {
      sendTallerTicketsModalInstance.hide();
    });
  }

  if (iconTaller && sendTallerTicketsModalInstance) {
    iconTaller.addEventListener("click", function () {
      sendTallerTicketsModalInstance.hide();
    });
  }

  // 6. Botones de cierre para processTicketModalElement (��NUEVO!)
  const cerrarProcess = document.getElementById("ModalProcess"); // El ID de tu botón "Cerrar" en el footer
  const iconProcess = document.getElementById("ModalProcessIcon"); // El ID de tu botón "x" en el header

  if (cerrarProcess && ModalprocessTicketsModalInstance) {
    cerrarProcess.addEventListener("click", function () {
      ModalprocessTicketsModalInstance.hide();
    });
  }

  if (iconProcess && ModalprocessTicketsModalInstance) {
    iconProcess.addEventListener("click", function () {
      ModalprocessTicketsModalInstance.hide();
    });
  }

  const cerrarPenReparacion = document.getElementById("ModalProcessReparacion");
  const iconPenReparacion = document.getElementById(
    "ModalProcessReparacionIcon"
  );

  if (cerrarPenReparacion && ModalProcesoReparacion) {
    cerrarPenReparacion.addEventListener("click", function () {
      ModalProcesoReparacion.hide();
    });
  }

  if (iconPenReparacion && ModalProcesoReparacion) {
    iconPenReparacion.addEventListener("click", function () {
      ModalProcesoReparacion.hide();
    });
  }

  const cerrarPenReparado = document.getElementById("ModalReparado");
  const iconPenReparado = document.getElementById(
    "ModalReparadoIcon"
  );

  if (cerrarPenReparado && ModalReparados) {
    cerrarPenReparado.addEventListener("click", function () {
      ModalReparados.hide();
    });
  }

  if (iconPenReparado && ModalReparados) {
    iconPenReparado.addEventListener("click", function () {
      ModalReparados.hide();
    });
  }

  const cerrarPenPendienteRepuesto = document.getElementById(
    "ModalPendiRespuu"
  );
  const iconPenPendienteRepuesto = document.getElementById(
    "ModalpendiRespIcon"
  );

  if(cerrarPenPendienteRepuesto && modalPendienteRepa) {
    cerrarPenPendienteRepuesto.addEventListener("click", function () {
      modalPendienteRepa.hide();
    });
  }

  if (iconPenPendienteRepuesto && modalPendienteRepa) {
    iconPenPendienteRepuesto.addEventListener("click", function () {
      modalPendienteRepa.hide();
    });
  }

  const cerrarPenIrreparable = document.getElementById(
    "ModalIrreparableTik"
  );
  const iconPenIrreparable = document.getElementById(
    "ModalIrreparabltikIcon"
  );

  if (cerrarPenIrreparable && ModalIrreparable) {
    cerrarPenIrreparable.addEventListener("click", function () {
      ModalIrreparable.hide();
    });
  }

  if (iconPenIrreparable && ModalIrreparable) {
    iconPenIrreparable.addEventListener("click", function () {
      ModalIrreparable.hide();
    });
  }

  // A. Clics dentro de monthlyTicketsContent
  const monthlyTicketsContent = document.getElementById(
    "monthlyTicketsContent"
  );
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
            confirmButtonText: "Entendido",
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
            confirmButtonText: "Entendido",
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

function loadIndividualProceess() {
    const timelineModalElement = document.getElementById("TimelineModal");
      let ModalTimelineInstance = null; // Variable para la instancia del modal de línea de tiempo

        if (timelineModalElement) {
    ModalTimelineInstance = new bootstrap.Modal(timelineModalElement);
  }



  const contentDiv = document.getElementById("ProcessTicketsContent");
  contentDiv.innerHTML = "<p>Cargando información de los POS en Proceso..</p>";
  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsInProcess`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        // Asigna el HTML directamente
        contentDiv.innerHTML = formatProcessTicketsDetails(data.details);

        // NUEVO: Delegación del evento para los botones "Ver Flujo de Trabajo"
        // Escucha en el contenedor padre (contentDiv) y verifica si el clic fue en un botón con la clase 'view-timeline-btn'
        contentDiv.addEventListener('click', function(event) {
          if (event.target.classList.contains('view-timeline-btn')) {
            const ticketId = event.target.dataset.idTicket;
            document.getElementById('timelineTicketId').textContent = ticketId; // Establece el ID del ticket en el título del modal
            loadTicketTimeline(ticketId);
            ModalTimelineInstance.show();
          }
        });

      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles de Taller: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error(
          "Error en los datos de la API para Taller:",
          data.message
        );
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
        "<p>Error de red al cargar los detalles de Taller. Por favor, intente de nuevo más tarde.</p>";
      console.error("Error fetching taller details:", error);
    });
}


function formatProcessTicketsDetails(details){
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <h5>POS Irreparables</h5>
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
                    Ticket #<strong>${ticket.id_ticket || "N/A"}</strong>
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

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Laboratorio:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_status_lab || "N/A"
                        }</dd>
                        
                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${
                          ticket.date_create_ticket
                        }</dd> <!-- Usar la variable formateada -->
                    </dl>
                      <button class="btn btn-info btn-sm mt-3 view-timeline-btn" data-id-ticket="${ticket.id_ticket}">Ver Flujo del Ticket</button>
                </div>
            </div>
        `;
  });
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

// 8. NUEVO: Función para formatear los datos de la línea de tiempo en HTML
function formatTimeline(timelineData) {
    let html = '<ul class="timeline">';

    timelineData.forEach((item, index) => {
        const isInitialEntryBool = String(item.is_initial_entry).toLowerCase() === 't' || item.is_initial_entry === true;
        const changedByUsername = item.changedby_username || 'N/A';
        const formattedDate = item.changedstatus_at ? new Date(item.changedstatus_at).toLocaleString('es-VE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'N/A';

        const invertedClass = (index % 2 === 1) ? 'timeline-inverted' : '';

        let changeDescription = '';
        let changesDetectedInDescription = false; // Bandera para saber si se añadió algo significativo a la descripción

        const currentTecnicoN2 = item.full_name_tecnico_n2_actual || 'No Asignado';
        const previousTecnicoN2 = item.full_name_tecnico_n2_anterior || 'No Asignado';

        if (isInitialEntryBool) {
            let initiatorName = item.full_name_tecnico_n1_ticket !== 'No Asignado' ? item.full_name_tecnico_n1_ticket : changedByUsername;
            changeDescription = `Ticket iniciado o abierto por el técnico <strong>${initiatorName}</strong>. `;
            if (item.new_status_name && item.new_status_name !== 'Desconocido') {
                 changeDescription += `Estado inicial: <strong>${item.new_status_name}</strong>. `;
            }
            if (item.new_action_name && item.new_action_name !== 'Desconocida') {
                 changeDescription += `Acción inicial: <strong>${item.new_action_name}</strong>. `;
            }
            changesDetectedInDescription = true; // La entrada inicial siempre tiene descripción
        } else {
            // Cambios de Estado Principal
            if (item.old_status_name && item.new_status_name && item.old_status_name !== item.new_status_name) {
                changeDescription += `Cambio de estado: <strong>${item.old_status_name}</strong> a <strong>${item.new_status_name}</strong>. `;
                changesDetectedInDescription = true;
            }
            // Cambios de Acción Principal
            if (item.old_action_name && item.new_action_name && item.old_action_name !== item.new_action_name) {
                changeDescription += `Cambio de acción: <strong>${item.old_action_name}</strong> a <strong>${item.new_action_name}</strong>. `;
                changesDetectedInDescription = true;
            }

            // Lógica para mostrar cambio de Técnico N2 en la descripción
            if (item.new_action_name === 'Reasignado al Técnico') {
                if (currentTecnicoN2 !== 'No Asignado' && previousTecnicoN2 !== 'No Asignado' && currentTecnicoN2 !== previousTecnicoN2) {
                    changeDescription += `Técnico reasignado de <strong>${previousTecnicoN2}</strong> a <strong>${currentTecnicoN2}</strong>. `;
                    changesDetectedInDescription = true;
                } else if (currentTecnicoN2 !== 'No Asignado' && previousTecnicoN2 === 'No Asignado') {
                    // Si es Reasignado pero no había un técnico N2 anterior registrado
                    changeDescription += `<strong>Asignado al Técnico: ${currentTecnicoN2}</strong>. `;
                    changesDetectedInDescription = true;
                }
            } else if (item.new_action_name === 'Asignado al Técnico') {
                // Solo si la acción es "Asignado al Técnico" y hay un técnico actual válido
                if (currentTecnicoN2 !== 'No Asignado') {
                    changeDescription += `<strong>Asignado al Técnico: ${currentTecnicoN2}</strong>. `;
                    changesDetectedInDescription = true;
                }
            }

            // Resto de los cambios de estado (laboratorio, domiciliación, pago)
            if (item.old_status_lab_name && item.new_status_lab_name && item.old_status_lab_name !== item.new_status_lab_name) {
                changeDescription += `Cambio de estado de laboratorio: <strong>${item.old_status_lab_name}</strong> a <strong>${item.new_status_lab_name}</strong>. `;
                changesDetectedInDescription = true;
            }
            if (item.old_status_domiciliacion_name && item.new_status_domiciliacion_name && item.old_status_domiciliacion_name !== item.new_status_domiciliacion_name) {
                changeDescription += `Cambio de estado de domiciliación: <strong>${item.old_status_domiciliacion_name}</strong> a <strong>${item.new_status_domiciliacion_name}</strong>. `;
                changesDetectedInDescription = true;
            }
            if (item.old_status_payment_name && item.new_status_payment_name && item.old_status_payment_name !== item.new_status_payment_name) {
                changeDescription += `Cambio de estado de pago: <strong>${item.old_status_payment_name}</strong> a <strong>${item.new_status_payment_name}</strong>. `;
                changesDetectedInDescription = true;
            }

            // Si no se detectaron cambios específicos para la descripción (y no es la primera entrada)
            if (!changesDetectedInDescription) {
                changeDescription = 'Actualización general del ticket.';
            }
        }

        html += `
            <li class="${invertedClass}">
                <div class="timeline-badge"><i class="fa fa-check"></i></div>
                <div class="timeline-panel">
                    <div class="timeline-heading">
                        <h4 class="timeline-title">Actualizado por: ${changedByUsername}</h4>
                        <p><small class="text-muted"><i class="fa fa-clock-o"></i> ${formattedDate}</small></p>
                    </div>
                    <div class="timeline-body">
                        <p>${changeDescription}</p>
                        <p><strong>Coordinador:</strong> ${item.full_name_coordinador_ticket || 'No Asignado'}</p>
                        
                        ${isInitialEntryBool && item.full_name_tecnico_n1_ticket !== 'No Asignado' // Mostrar Técnico N1 solo en la primera gestión si está asignado
                            ? `<p><strong>Técnico N1:</strong> ${item.full_name_tecnico_n1_ticket}</p>`
                            : ''
                        }
                        
                        ${!isInitialEntryBool && // NO mostrar el Técnico N2 Actual en la primera gestión como un párrafo separado (ya se maneja en la descripción inicial si aplica)
                          currentTecnicoN2 !== 'No Asignado' && // Asegurarse de que haya un Técnico N2 asignado
                          (item.new_action_name === 'Asignado al Técnico' || item.new_action_name === 'Reasignado al Técnico') // Mostrar solo si la acción es 'Asignado al Técnico' o 'Reasignado al Técnico'
                            ? `<p><strong>Técnico N2 Actual:</strong> ${currentTecnicoN2}</p>`
                            : ''
                        }
                    </div>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    return html;
}

function loadIndividualIrreparable(){
  const contentDiv = document.getElementById("IrreparableTikModalTicketsContent");
  contentDiv.innerHTML =
    "<p>Cargando información de los POS Irreparables..</p>"; // Mensaje de carga
  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsIrreparables`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
      })
    .then((data) => {
      if (data.success) {
        contentDiv.innerHTML = formatIrreparableTicketsDetails(data.details); // Renderizar los datos
        } else {
          contentDiv.innerHTML =
            "<p>Error al cargar los detalles de Taller: " +
            (data.message || "Error desconocido") +
            "</p>";
        console.error(
          "Error en los datos de la API para Taller:",
          data.message
        );
         }
    })
    .catch((error) => {
      contentDiv.innerHTML =
        "<p>Error de red al cargar los detalles de Taller. Por favor, intente de nuevo más tarde.</p>";
      console.error("Error fetching taller details:", error);
    }); 
}

function formatIrreparableTicketsDetails(details){
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <h5>POS Irreparables</h5>
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
                    Ticket #<strong>${ticket.id_ticket || "N/A"}</strong>
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

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Accion Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.name_accion_ticket || "N/A"
                        }</dd>

                        <dt class="col-sm-4">Estatus Laboratorio:</dt>
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

function loadIndividualPendienteRepuesto(){
  const contentDiv = document.getElementById("PendienteRespuesModalTicketsContent");
  contentDiv.innerHTML =
    "<p>Cargando información de los POS Pendiente de Respuesta..</p>"; // Mensaje de carga
  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsPendientesPorRepuestos`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
      })
    .then((data) => {
      if (data.success) {
        contentDiv.innerHTML = formatPendinRespueTicketsDetails(data.details); // Renderizar los datos

      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles de Taller: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error(
          "Error en los datos de la API para Taller:",
          data.message
        );
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
        "<p>Error de red al cargar los detalles de Taller. Por favor, intente de nuevo más tarde.</p>";
      console.error("Error fetching taller details:", error);
    });
}

function formatPendinRespueTicketsDetails(details){
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <h5>POS Pendiente Por Repuestos</h5>
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
                    Ticket #<strong>${ticket.id_ticket || "N/A"}</strong>
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

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
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

function loadIndividualReparado(){
  const contentDiv = document.getElementById("ReparadoModalTicketsContent");
  contentDiv.innerHTML =
    "<p>Cargando información de los POS Reparado..</p>"; // Mensaje de carga
  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsYaEstanReparados`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        contentDiv.innerHTML = formatReparadoTicketsDetails(data.details); // Renderizar los datos

      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles de Taller: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error(
          "Error en los datos de la API para Taller:",
          data.message
        );
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
        "<p>Error de red al cargar los detalles de Taller. Por favor, intente de nuevo más tarde.</p>";
      console.error("Error fetching taller details:", error);
    });
}

function formatReparadoTicketsDetails(details){
if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <h5>POS Reparados</h5>
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
                    Ticket #<strong>${ticket.id_ticket || "N/A"}</strong>
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

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
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

function getTicketProcessReparacion() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketsProcessReparacionCount`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById("CountProcessReparacion").textContent =
            response.count; // Selecciona por ID
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTicketsProcessReparacionCount";
  xhr.send(datos);
}

function getTicketReparados() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketsReparadosCount`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById("ReparadopsCount").textContent =
            response.count; // Selecciona por ID
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTicketsReparadosCount";
  xhr.send(datos);
}

function getTicketPendienteRepuesto() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketPendienteRepuestoCount`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById("PendientePorRepuesto").textContent =
            response.count; // Selecciona por ID
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTicketPendienteRepuestoCount";
  xhr.send(datos);
}

function getTicketIrreparables() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketIrreparablesCount`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById("CountIrreparable").textContent =
            response.count; // Selecciona por ID
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTicketIrreparablesCount";
  xhr.send(datos);
}

function loadIndividualProceessReparacion() {
  const contentDiv = document.getElementById("ReparacionModalTicketsContent");
  contentDiv.innerHTML =
    "<p>Cargando información de los POS en proceso de reparaci&oacuten..</p>"; // Mensaje de carga
  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketsPendienteReparacion`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        contentDiv.innerHTML = formatProcessReparacionDetails(data.details); // Renderizar los datos
      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles de Taller: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error(
          "Error en los datos de la API para Taller:",
          data.message
        );
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
        "<p>Error de red al cargar los detalles de Taller. Por favor, intente de nuevo más tarde.</p>";
      console.error("Error fetching taller details:", error);
    });
}

function formatProcessReparacionDetails(details) {
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <h5>POS En Proceso De reparaci&oacuten</h5>
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
                    Ticket #<strong>${ticket.id_ticket || "N/A"}</strong>
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

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
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

function loadTallerTicketDetails() {
  const contentDiv = document.getElementById("TallerTicketsContent");
  contentDiv.innerHTML = "<p>Cargando información de Tickets de Taller...</p>"; // Mensaje de carga
  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTallerTicketsForCard`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        contentDiv.innerHTML = formatTallerDetails(data.details); // Renderizar los datos
      } else {
        contentDiv.innerHTML =
          "<p>Error al cargar los detalles de Taller: " +
          (data.message || "Error desconocido") +
          "</p>";
        console.error(
          "Error en los datos de la API para Taller:",
          data.message
        );
      }
    })
    .catch((error) => {
      contentDiv.innerHTML =
        "<p>Error de red al cargar los detalles de Taller. Por favor, intente de nuevo más tarde.</p>";
      console.error("Error fetching taller details:", error);
    });
  // TODO: Agregar más lógica para mostrar los detalles de tickets de taller
  //...
}

function formatTallerDetails(details) {
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <h5>Tickets En Taller</h5>
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
                    Ticket #<strong>${ticket.id_ticket || "N/A"}</strong>
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

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
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

function loadResolveTicketDetails() {
  const contentDiv = document.getElementById("ResolveTicketsContent");
  contentDiv.innerHTML = "<p>Cargando información de Tickets Resueltos...</p>"; // Mensaje de carga

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetResolveTicketsForCard`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        contentDiv.innerHTML = formatResolveDetails(data.details); // Renderizar los datos
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
        "<p>Error de red al cargar los detalles regionales. Por favor, intente de nuevo más tarde.</p>";
      console.error("Error fetching regional details:", error);
    });
}

// Para el campo "Nueva Contraseña"


function formatResolveDetails(details) {
  if (!Array.isArray(details)) {
    console.error("Expected 'details' to be an array, but received:", details);
    return "<p>Formato de datos inesperado.</p>";
  }

  let html = `
        <h5>Tickets Resueltos</h5>
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
                    Ticket #<strong>${ticket.id_ticket || "N/A"}</strong>
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

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${
                          ticket.status_name_ticket || "N/A"
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

function getTicketOpen() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketAbiertoCount`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById("TicketsAbiertos").textContent =
            response.count; // Selecciona por ID
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTicketAbiertoCount";
  xhr.send(datos);
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

// Variable para almacenar todos los tickets cargados (sin filtrar)
let allOpenTickets = [];

// Función para cargar los detalles de los tickets abiertos
function loadOpenTicketDetails() {
    const contentDiv = document.getElementById("OpenTicketModalContent");
    const searchInput = document.getElementById("ticketSearchInput");

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
                displayFilteredTickets(allOpenTickets); // Mostrar todos al principio
                attachMarkReceivedListeners(); // Adjuntar listeners a los botones "Marcar como Recibido"

                // Añadir event listener para el input de búsqueda
                searchInput.removeEventListener('input', handleTicketSearch); // Eliminar listener previo si existe
                searchInput.addEventListener('input', handleTicketSearch); // Adjuntar nuevo listener
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
                searchInput.removeEventListener('input', handleTicketSearch);
            }
        })
        .catch((error) => {
            contentDiv.innerHTML =
                "<p>Error de red al cargar los detalles de tickets. Por favor, intente de nuevo más tarde.</p>";
            console.error("Error fetching open ticket details:", error);
            allOpenTickets = []; // Limpiar por si hubo error
            searchInput.removeEventListener('input', handleTicketSearch);
        });
}

// NUEVA función para manejar la búsqueda en tiempo real
function handleTicketSearch() {
    const searchTerm = this.value.toLowerCase().trim(); // Obtener el texto del input y normalizarlo
    let filteredTickets = [];

    if (searchTerm === '') {
        filteredTickets = allOpenTickets; // Si está vacío, mostrar todos
    } else {
        filteredTickets = allOpenTickets.filter(ticket => {
            // Convierte todos los campos relevantes a minúsculas para la comparación
            return (
                ticket.serial_pos_cliente.toLowerCase().includes(searchTerm) ||
                ticket.razon_social_cliente.toLowerCase().includes(searchTerm) ||
                ticket.rif_cliente.toLowerCase().includes(searchTerm) ||
                ticket.name_modelopos_cliente.toLowerCase().includes(searchTerm) ||
                ticket.status_name_ticket.toLowerCase().includes(searchTerm) ||
                ticket.name_accion_ticket.toLowerCase().includes(searchTerm) ||
                ticket.date_create_ticket.toLowerCase().includes(searchTerm)
            );
        });
    }
    displayFilteredTickets(filteredTickets); // Mostrar los tickets filtrados
}

// Función para mostrar los tickets (llamada por loadOpenTicketDetails y handleTicketSearch)
function displayFilteredTickets(ticketsToDisplay) {
    const contentDiv = document.getElementById("OpenTicketModalContent");
    if (!ticketsToDisplay || ticketsToDisplay.length === 0) {
        contentDiv.innerHTML = "<p>No se encontraron tickets con los criterios de búsqueda.</p>";
        return;
    }
    contentDiv.innerHTML = formatOpenDetails(ticketsToDisplay);
    attachMarkReceivedListeners(); // Volver a adjuntar listeners después de cada renderizado
    attachViewDocumentListeners(); // Adjuntar listeners a los botones de ver documento
}


// Asegúrate de que esta función esté definida en el ámbito global (no dentro de otro bloque)
// Asegúrate de que esta función esté definida globalmente
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

        // Los IDs de status_payment 10, 11, 1 y 3 se asocian con botones de "ver documento".
        // El `data-ticket-id` se usa para pasar el ID del ticket a `handleViewDocumentClick`.
      if (showDocumentButtons) {
          if (statusPaymentId === 10) { 
              documentButtonsHtml = `
                  <button class="btn btn-info btn-sm view-document-btn"
                          data-ticket-id="${ticket.id_ticket}">
                      Mostrar Documento de Envio ZOOM
                  </button>
              `;
          } else if (statusPaymentId === 11) { 
              documentButtonsHtml = `
                  <button class="btn btn-info btn-sm view-document-btn"
                          data-ticket-id="${ticket.id_ticket}">
                      Mostrar Pago/Exoneración
                  </button>
              `;
          } else if (statusPaymentId === 1 || statusPaymentId === 3) {
              documentButtonsHtml = `
                  <button class="btn btn-info btn-sm view-document-btn"
                          data-ticket-id="${ticket.id_ticket}">
                      Mostrar Documento Envío
                  </button>
              `;
          }
        }

        ////////////////////////////// CAMBIAR A QUE SOLO EL 4 QU E ES "COORDINADOR" CANDO EL SISTEMA SE TERMINE ////////////////////////////////////////////////////////////
          if (currentUserRole === 1 || currentUserRole === 4) { 
            markReceivedButtonHtml = `
              <button type="button" class="btn btn-success ms-2 mark-received-btn" id="mark-received-btn-${ticket.id_ticket}">
                Marcar como Recibido
              </button>
            `;
          }
        ////////////////////////////// CAMBIAR A QUE SOLO EL 4 QU E ES "COORDINADOR" CANDO EL SISTEMA SE TERMINE ////////////////////////////////////////////////////////////

        
        htmlContent += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    Ticket #<strong>${ticket.id_ticket || 'N/A'}</strong>
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

                        <dt class="col-sm-4">Documentos:</dt>
                        <dd class="col-sm-8">${ticket.name_status_payment || 'N/A'}</dd>

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${ticket.status_name_ticket || 'N/A'}</dd>

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

    return htmlContent;
}


// Nueva función para adjuntar listeners a los botones de ver documento
// Es CRUCIAL que esta función se llame CADA VEZ que el contenido de los tickets se recarga en el DOM.
function attachViewDocumentListeners() {
    // Selecciona todos los botones con la clase 'view-document-btn' dentro del contenedor de tickets abiertos
    const viewDocumentButtons = document.querySelectorAll("#OpenTicketModalContent .view-document-btn");

    viewDocumentButtons.forEach(button => {
        // Es una buena práctica remover el listener antes de añadirlo para evitar duplicados,
        // especialmente si esta función se llama varias veces (ej. al recargar la lista de tickets).
        button.removeEventListener('click', handleViewDocumentClick); // Remover si ya existe
        button.addEventListener('click', handleViewDocumentClick); // Adjuntar el nuevo
    });
}


// NUEVA función para adjuntar los event listeners (reconfirmada)
function attachMarkReceivedListeners() {
    // Eliminar listeners previos para evitar duplicados si se llama varias veces
    document.querySelectorAll('.mark-received-btn').forEach(button => {
        button.removeEventListener('click', handleMarkTicketReceivedClick);
    });
    // Adjuntar nuevos listeners
    document.querySelectorAll('.mark-received-btn').forEach(button => {
        button.addEventListener('click', handleMarkTicketReceivedClick);
    });
}

// Wrapper para pasar el ticketId directamente
function handleMarkTicketReceivedClick() {
    const ticketId = this.dataset.ticketId;
    handleMarkTicketReceived(ticketId);
}

// Función para manejar la lógica de marcar como recibido (como antes)
async function handleMarkTicketReceived(ticketId) {
    if (!confirm(`¿Estás seguro de que quieres marcar el Ticket #${ticketId} como recibido?`)) {
        return; // El usuario canceló
    }

    try {
        const response = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/tickets/markReceived`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ticket_id: ticketId })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert(`Ticket #${ticketId} marcado como recibido exitosamente.`);
            $('#OpenTicketModal').modal('hide'); // Cierra el modal
            loadOpenTicketDetails(); // Recarga los tickets abiertos para reflejar el cambio
            // También podrías necesitar recargar el conteo de tickets si tienes un dashboard
        } else {
            alert(`Error al marcar el Ticket #${ticketId} como recibido: ${data.message || 'Error desconocido'}`);
            console.error('Error marking ticket received:', data.message);
        }
    } catch (error) {
        alert('Error de red al intentar marcar el ticket como recibido.');
        console.error('Network error marking ticket received:', error);
    }
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

function getTicketPercentage() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketPercentage`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          // Convertir el string a número y redondear a 2 decimales
          // parseFloat convierte el string a un número flotante
          // toFixed(2) redondea a 2 decimales y devuelve un string
          const percentage = parseFloat(response.count);
          const displayPercentage = percentage.toFixed(2); // Redondea a 2 decimales

          const percentageSpan = document.getElementById("TicketPorcentOpen");

          // Aquí usamos displayPercentage para mostrar, pero percentage (el número original) para la lógica del signo y color
          percentageSpan.textContent =
            (percentage > 0 ? "+" : "") + displayPercentage + "%";

          if (percentage >= 50) {
            // Usamos el número original para la comparación
            percentageSpan.classList.remove("text-success");
            percentageSpan.classList.add("text-danger");
          } else {
            percentageSpan.classList.remove("text-danger");
            percentageSpan.classList.add("text-success");
          }
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON for percentage:", error);
      }
    } else {
      console.error("Error fetching percentage:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTicketPercentage";
  xhr.send(datos);
}

// Llama a la función getTicketPercentage() cuando la página se cargue
window.addEventListener("load", () => {
  getTicketOpen();
  getTicketPercentage(); // Agrega esta línea
});

function getTicketResolve() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketsResueltosCount`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById("TicketsResuelto").textContent =
            response.count; // Selecciona por ID
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTicketsResueltosCount";
  xhr.send(datos);
}

function getTicketsResueltosPercentage() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketsResueltosPercentage`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          // 1. Convertir el string a número
          const percentage = parseFloat(response.count);

          // 2. Redondear a 2 decimales y almacenar en displayPercentage
          const displayPercentage = percentage.toFixed(2);

          const percentageSpan = document.getElementById(
            "ticketResueltoPercentage"
          );

          // Usar displayPercentage para mostrar y percentage (el número original) para la lógica de color
          percentageSpan.textContent =
            (percentage > 0 ? "+" : "") + displayPercentage + "%";

          // === CAMBIO CLAVE AQUÍ ===
          // Definir el umbral: si el porcentaje de tickets resueltos es menor que esto, será rojo.
          // Si es igual o mayor, será verde.
          const thresholdForGood = 50; // Quieres que sea verde si es >= 50%

          if (percentage < thresholdForGood) {
            // Si es MENOR que el umbral (50%), es "malo" (rojo)
            percentageSpan.classList.remove("text-success"); // Asegúrate de quitar la clase verde
            percentageSpan.classList.add("text-danger"); // Añadir la clase roja
          } else {
            // Si es MAYOR O IGUAL que el umbral (50%), es "bueno" (verde)
            percentageSpan.classList.remove("text-danger"); // Asegúrate de quitar la clase roja
            percentageSpan.classList.add("text-success"); // Añadir la clase verde
          }
          // =========================
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error(
          "Error parsing JSON for Tickets Resueltos percentage:",
          error
        );
      }
    } else {
      console.error(
        "Error fetching Tickets Resueltos percentage:",
        xhr.status,
        xhr.statusText
      );
    }
  };

  const datos = "action=getTicketsResueltosPercentage";
  xhr.send(datos);
}

// Llama a las funciones cuando la página se cargue
window.addEventListener("load", () => {
  getTicketResolve();
  getTicketsResueltosPercentage(); // Agrega esta línea
});

function getTicketTotal() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketsTotalCount`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById("TotalTicket").textContent = response.count; // Selecciona por ID
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTicketsTotalCount";
  xhr.send(datos);
}

function getTicketTotalSendTotaller() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketsSendTallerTotalCount`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById("TotalEnviadoTaller").textContent =
            response.count; // Selecciona por ID
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTicketsSendTallerTotalCount";
  xhr.send(datos);
}

function getTotalTicketsPercentageOFSendTaller() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTotalTicketsPercentageSendToTaller`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const percentage = parseFloat(response.porcent);

          // 2. Redondear a 2 decimales y almacenar en displayPercentage
          const displayPercentage = percentage.toFixed(2);

          const percentageSpan = document.getElementById("PorcentSendToTaller");

          // Usar displayPercentage para mostrar y percentage (el número original) para la lógica de color
          percentageSpan.textContent =
            (percentage > 0 ? "+" : "") + displayPercentage + "%";

          // === CAMBIO CLAVE AQUÍ ===
          // Definir el umbral: si el porcentaje de tickets resueltos es menor que esto, será rojo.
          // Si es igual o mayor, será verde.
          const thresholdForGood = 50; // Quieres que sea verde si es >= 50%

          if (percentage < thresholdForGood) {
            // Si es MENOR que el umbral (50%), es "malo" (rojo)
            percentageSpan.classList.remove("text-success"); // Asegúrate de quitar la clase verde
            percentageSpan.classList.add("text-danger"); // Añadir la clase roja
          } else {
            // Si es MAYOR O IGUAL que el umbral (50%), es "bueno" (verde)
            percentageSpan.classList.remove("text-danger"); // Asegúrate de quitar la clase roja
            percentageSpan.classList.add("text-success"); // Añadir la clase verde
          }
          // =========================
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error(
          "Error parsing JSON for Total Tickets percentage:",
          error
        );
      }
    } else {
      console.error(
        "Error fetching Total Tickets percentage:",
        xhr.status,
        xhr.statusText
      );
    }
  };

  const datos = "action=getTotalTicketsPercentageSendToTaller";
  xhr.send(datos);
}

function getTotalPorcentageticket_in_process() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTotalTicketsPercentageinprocess`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const percentage = parseFloat(response.porcent);

          // 2. Redondear a 2 decimales y almacenar en displayPercentage
          const displayPercentage = percentage.toFixed(2);

          const percentageSpan = document.getElementById("Process_Tickets");

          // Usar displayPercentage para mostrar y percentage (el número original) para la lógica de color
          percentageSpan.textContent =
            (percentage > 0 ? "+" : "") + displayPercentage + "%";

          // === CAMBIO CLAVE AQUÍ ===
          // Definir el umbral: si el porcentaje de tickets resueltos es menor que esto, será rojo.
          // Si es igual o mayor, será verde.
          const thresholdForGood = 50; // Quieres que sea verde si es >= 50%

          if (percentage < thresholdForGood) {
            // Si es MENOR que el umbral (50%), es "malo" (rojo)
            percentageSpan.classList.remove("text-success"); // Asegúrate de quitar la clase verde
            percentageSpan.classList.add("text-danger"); // Añadir la clase roja
          } else {
            // Si es MAYOR O IGUAL que el umbral (50%), es "bueno" (verde)
            percentageSpan.classList.remove("text-danger"); // Asegúrate de quitar la clase roja
            percentageSpan.classList.add("text-success"); // Añadir la clase verde
          }
          // =========================
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error(
          "Error parsing JSON for Total Tickets percentage:",
          error
        );
      }
    } else {
      console.error(
        "Error fetching Total Tickets percentage:",
        xhr.status,
        xhr.statusText
      );
    }
  };

  const datos = "action=getTotalTicketsPercentageinprocess";
  xhr.send(datos);
}

function getTotalTicketsInProcess() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTotalTicketsInProcess`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById("ProcessTicketNumber").textContent = response.count; // Selecciona por ID
        } else {
          console.error("Error:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  const datos = "action=getTotalTicketsInProcess";
  xhr.send(datos);
}

// Llama a las funciones cuando la página se cargue
window.addEventListener("load", () => {
  getTicketTotal();
  getTicketTotalSendTotaller();
  getTotalTicketsPercentageOFSendTaller();
  getTotalTicketsInProcess();
  getTotalPorcentageticket_in_process();
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
        "<p>Error de red al cargar los detalles regionales. Por favor, intente de nuevo más tarde.</p>";
      console.error("Error fetching regional details:", error);
    });
}

// Función para cargar los detalles de tickets individuales por región (sin estado inicial)

// Función para formatear la tabla de tickets por región (ajustada)
function formatRegionDetails(details) {
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
  if (tickets.length === 0) {
    return `<p>No hay tickets para la región ${region}.</p>
                  <button class="btn btn-primary mt-3" onclick="loadRegionTicketDetails()">Volver al resumen regional</button>`;
  }

  let html = `
        <h5>Tickets para la región ${region}</h5>
        <div class="ticket-details-list mt-3">
    `;

  // Asegúrate de que las propiedades del objeto `ticket` coincidan con lo que tu API de detalles individuales devuelve
  tickets.forEach((ticket) => {
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    Ticket #<strong>${ticket.id_ticket || "N/A"}</strong>
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
  // status es opcional ahora
  const contentDiv = document.getElementById("RegionTicketsContent");
  let loadingMessage = `Cargando tickets para la región ${region}...`;
  if (region) {
    loadingMessage = `Cargando tickets para la región ${region}...`;
  }
  contentDiv.innerHTML = `<p>${loadingMessage}</p>`;

  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetIndividualTicketDetailsByRegion`
  ); // Asumiendo que este endpoint puede filtrar solo por región
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success && response.details) {
          // Llama a la función de formateo de tickets individuales por región
          contentDiv.innerHTML = formatIndividualRegionTickets(
            response.details,
            region
          );
        } else {
          contentDiv.innerHTML =
            `<p>Error al cargar el detalle de tickets: ` +
            (response.message || "Error desconocido") +
            `</p>`;
          console.error(
            "Error en los datos de la API para tickets individuales por región:",
            response.message
          );
        }
      } catch (error) {
        console.error(
          "Error parsing JSON for individual regional ticket details:",
          error
        );
        contentDiv.innerHTML = `<p>Error de procesamiento de datos al cargar el detalle de tickets.</p>`;
      }
    } else {
      console.error(
        "Error fetching individual regional ticket details:",
        xhr.status,
        xhr.statusText
      );
      contentDiv.innerHTML = `<p>Error de red al cargar el detalle de tickets. Por favor, intente de nuevo más tarde.</p>`;
    }
  };

  xhr.onerror = function () {
    console.error(
      "Network error during individual regional ticket details fetch."
    );
    contentDiv.innerHTML = `<p>Error de conexión al cargar el detalle de tickets.</p>`;
  };

  // Prepara los datos a enviar: solo la región
  let dataToSend = `action=GetIndividualTicketDetailsByRegion&region=${encodeURIComponent(
    region
  )}`;
  // Si tu API GetIndividualTicketDetailsByRegion puede filtrar por status, puedes añadirlo aquí
  xhr.send(dataToSend);
}

// *** NUEVA FUNCIÓN: Para cargar los detalles de tickets individuales ***
function loadIndividualTicketDetails(month, status) {
  const contentDiv = document.getElementById("monthlyTicketsContent");
  contentDiv.innerHTML = `<p>Cargando tickets ${status.toLowerCase()}s en la fecha ${month}...</p>`; // Mensaje de carga

  const xhr = new XMLHttpRequest();
  // Use POST as requested, so the parameters will be sent in the request body
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetIndividualTicketDetails`
  );
  // Set the Content-Type header to indicate that we're sending URL-encoded data
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success && response.details) {
          // Función para formatear los tickets individuales
          contentDiv.innerHTML = formatIndividualTickets(
            response.details,
            month,
            status
          );
        } else {
          // Check for data.message in case of API error, or provide a generic one
          contentDiv.innerHTML =
            `<p>Error al cargar el detalle de tickets ${status.toLowerCase()}s: ` +
            (response.message || "Error desconocido") +
            `</p>`;
          console.error(
            "Error en los datos de la API para tickets individuales:",
            response.message
          );
        }
      } catch (error) {
        console.error(
          "Error parsing JSON for individual ticket details:",
          error
        );
        contentDiv.innerHTML = `<p>Error de procesamiento de datos al cargar el detalle de tickets ${status.toLowerCase()}s.</p>`;
      }
    } else {
      console.error(
        "Error fetching individual ticket details:",
        xhr.status,
        xhr.statusText
      );
      contentDiv.innerHTML = `<p>Error de red al cargar el detalle de tickets ${status.toLowerCase()}s. Por favor, intente de nuevo más tarde.</p>`;
    }
  };

  // Handle network errors
  xhr.onerror = function () {
    console.error("Network error during individual ticket details fetch.");
    contentDiv.innerHTML = `<p>Error de conexión al cargar el detalle de tickets ${status.toLowerCase()}s.</p>`;
  };

  // Prepare the data to be sent in the request body
  // encodeURIComponent is crucial for sending parameters in URL-encoded format
  const dataToSend = `action=GetIndividualTicketDetails&month=${encodeURIComponent(
    month
  )}&status=${encodeURIComponent(status)}`;
  xhr.send(dataToSend);
}

// *** NUEVA FUNCIÓN: Para formatear la tabla de tickets individuales (VERTICAL) ***
function formatIndividualTickets(tickets, month, status) {
  if (tickets.length === 0) {
    return `<p>No hay tickets ${status.toLowerCase()}s para ${month}.</p>
                <button class="btn btn-primary mt-3" onclick="loadMonthlyTicketDetails()">Volver al resumen</button>`;
  }

  let html = `
        <h5>Tickets ${status}s para ${month}</h5>
        <div class="ticket-details-list mt-3">
    `;

  tickets.forEach((ticket) => {
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket
      ? new Date(ticket.date_create_ticket).toLocaleString()
      : "N/A";

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    Ticket #<strong>${ticket.id_ticket || "N/A"}</strong>
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
        "<p>Error de red al cargar los detalles. Por favor, intente de nuevo más tarde.</p>";
      console.error("Error fetching monthly details:", error);
    });
}

// *** FUNCIÓN CORREGIDA: Para formatear la tabla de tickets mensuales ***
function formatMonthlyDetails(details) {
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
        <p class="text-muted mt-3">Información extra sobre tendencias y análisis.</p>
    `;
  return html;
}

let monthlyTicketsChartInstance; // Variable global para la instancia del gráfico
let monthlyTicketsChartInstanceForState;

function loadMonthlyCreatedTicketsChart() {
  // Array para los colores de fondo con degradado (ej. para Chart.js)
  // Cada objeto contiene los colores de inicio y fin para el degradado de una barra.
  const gradientColors = [
    // Enero: Azul Oscuro a Azul Medio
    { start: "rgba(41, 128, 185, 0.9)", end: "rgba(52, 152, 219, 0.9)" },
    // Febrero: Azul Marino Oscuro a Azul Grisáceo
    { start: "rgba(44, 62, 80, 0.9)", end: "rgba(52, 73, 94, 0.9)" },
    // Marzo: Verde Esmeralda Oscuro a Verde Esmeralda
    { start: "rgba(39, 174, 96, 0.9)", end: "rgba(46, 204, 113, 0.9)" },
    // Abril: Turquesa Oscuro a Turquesa Brillante
    { start: "rgba(22, 160, 133, 0.9)", end: "rgba(26, 188, 156, 0.9)" },
    // Mayo: Naranja-Amarillo a Amarillo Dorado
    { start: "rgba(243, 156, 18, 0.9)", end: "rgba(241, 196, 15, 0.9)" },
    // Junio: Naranja a Naranja Oscuro
    { start: "rgba(230, 126, 34, 0.9)", end: "rgba(211, 84, 0, 0.9)" },
    // Julio: Púrpura Profundo a Púrpura Medio
    { start: "rgba(142, 68, 173, 0.9)", end: "rgba(155, 89, 182, 0.9)" },
    // Agosto: Rojo-Rosa a Rojo Oscuro
    { start: "rgba(231, 76, 60, 0.9)", end: "rgba(192, 57, 43, 0.9)" },
    // Septiembre: Verde Bosque Oscuro a Verde Bosque
    { start: "rgba(39, 174, 96, 0.9)", end: "rgba(46, 204, 113, 0.9)" },
    // Octubre: Gris Oscuro Azulado a Gris Claro Azulado
    { start: "rgba(127, 140, 141, 0.9)", end: "rgba(149, 165, 166, 0.9)" },
    // Noviembre: Azul Muy Oscuro a Azul Más Oscuro
    { start: "rgba(31, 44, 58, 0.9)", end: "rgba(41, 61, 81, 0.9)" },
    // Diciembre: Azul Brillante a Azul Más Claro
    { start: "rgba(52, 152, 219, 0.9)", end: "rgba(93, 173, 226, 0.9)" },
  ];

  // Array para los colores del borde (generalmente un tono más oscuro o el color inicial del degradado)
  const borderColors = [
    "rgba(41, 128, 185, 1)", // Enero
    "rgba(44, 62, 80, 1)", // Febrero
    "rgba(39, 174, 96, 1)", // Marzo
    "rgba(22, 160, 133, 1)", // Abril
    "rgba(243, 156, 18, 1)", // Mayo
    "rgba(230, 126, 34, 1)", // Junio
    "rgba(142, 68, 173, 1)", // Julio
    "rgba(231, 76, 60, 1)", // Agosto
    "rgba(39, 174, 96, 1)", // Septiembre
    "rgba(127, 140, 141, 1)", // Octubre
    "rgba(31, 44, 58, 1)", // Noviembre
    "rgba(52, 152, 219, 1)", // Diciembre
  ];

  const ctx = document.getElementById("chart-line").getContext("2d");

  fetch(
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetMonthlyCreatedTicketsForChart`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success && data.details && data.details.length > 0) {
        const labels = data.details.map(
          (item) => `${item.month_name} ${item.year_month.substring(0, 4)}`
        ); // "Enero 2024"
        const chartData = data.details.map(
          (item) => item.total_tickets_creados_mes
        );

        // Si ya existe una instancia del gráfico, la destruimos antes de crear una nueva
        if (monthlyTicketsChartInstance) {
          monthlyTicketsChartInstance.destroy();
        }

        monthlyTicketsChartInstance = new Chart(ctx, {
          type: "bar", // Puedes probar 'line' para ver la tendencia también
          data: {
            labels: labels, // Nombres de los meses como etiquetas
            datasets: [
              {
                label: "Total de Tickets Creados",
                data: chartData, // Los totales de tickets creados por mes
                backgroundColor: function (context) {
                  // Aquí es donde creamos el degradado para cada barra
                  const chart = context.chart;
                  const { ctx, chartArea } = chart;

                  if (!chartArea) {
                    // Esto sucede en la carga inicial del gráfico
                    return;
                  }

                  // Crea el degradado vertical desde la parte inferior de la barra hasta la superior
                  const gradient = ctx.createLinearGradient(
                    0,
                    chartArea.bottom,
                    0,
                    chartArea.top
                  );

                  const index = context.dataIndex; // Índice del mes actual
                  const colorInfo =
                    gradientColors[index % gradientColors.length]; // Usamos % para repetir los colores si hay más de 12 meses

                  if (colorInfo) {
                    gradient.addColorStop(0, colorInfo.start); // Color de inicio (abajo)
                    gradient.addColorStop(1, colorInfo.end); // Color final (arriba)
                  } else {
                    // Color de fallback si no se encuentra información de color
                    gradient.addColorStop(0, "rgba(0,0,0,0.7)");
                    gradient.addColorStop(1, "rgba(0,0,0,0.5)");
                  }

                  return gradient;
                },
                borderColor: borderColors, // Los bordes pueden ser colores sólidos
                borderWidth: 1,
                categoryPercentage: 0.7,
                barPercentage: 0.8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: "#6c757d",
                  font: { size: 12 },
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                  drawBorder: false,
                },
              },
              x: {
                ticks: {
                  color: "#6c757d",
                  font: { size: 12 },
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                  drawBorder: false,
                },
              },
            },
            plugins: {
              legend: {
                display: true, // Mostrar la leyenda para el nombre del dataset
                labels: { color: "#343a40" },
              },
              tooltip: {
                backgroundColor: "rgba(0,0,0,0.7)",
                titleColor: "white",
                bodyColor: "white",
              },
            },
          },
        });
      } else {
        console.warn(
          "No hay datos disponibles para el gráfico de tickets creados por mes o la respuesta no fue exitosa."
        );
        // Destruir el gráfico si no hay datos para mostrar un lienzo vacío
        if (monthlyTicketsChartInstance) {
          monthlyTicketsChartInstance.destroy();
        }
        // O mostrar un mensaje en el canvas si es posible
        ctx.fillText(
          "No hay datos para mostrar.",
          ctx.canvas.width / 2,
          ctx.canvas.height / 2
        );
      }
    })
    .catch((error) => {
      console.error(
        "Error al cargar los datos del gráfico de tickets creados por mes:",
        error
      );
      if (monthlyTicketsChartInstance) {
        monthlyTicketsChartInstance.destroy();
      }
      ctx.fillText(
        "Error al cargar el gráfico.",
        ctx.canvas.width / 2,
        ctx.canvas.height / 2
      );
    });
}

async function updateTicketMonthlyPercentageChange() {
  const porcentElement = document.getElementById("porcent");

  if (porcentElement) porcentElement.textContent = "Cargando...";

  try {
    const response = await fetch(
      `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetMonthlyTicketPercentageChange`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // ** CAMBIO CRÍTICO AQUÍ: Accede directamente a data.porcent **
    let percentage = data.porcent; // Toma el número directamente

    let textContent = "";
    let color = "gray";

    if (percentage === null || isNaN(percentage)) {
      // Aunque ya verificamos que es número, mantenemos isNaN por si acaso
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
  }
}

function loadMonthlyCreatedTicketsChartForState() {
  // Array para los colores de fondo con degradado para los estados/regiones (7 colores distintos)
  const gradientColorsForState = [
    // Región 1: Azul Profundo a Azul Cielos
    { start: "rgba(46, 116, 181, 0.9)", end: "rgba(74, 160, 217, 0.9)" },
    // Región 2: Verde Esmeralda a Verde Claro
    { start: "rgba(46, 204, 113, 0.9)", end: "rgba(77, 219, 137, 0.9)" },
    // Región 3: Púrpura Vibrante a Lavanda
    { start: "rgba(155, 89, 182, 0.9)", end: "rgba(189, 119, 218, 0.9)" },
    // Región 4: Cian Oscuro a Cian Claro
    { start: "rgba(0, 128, 128, 0.9)", end: "rgba(0, 178, 178, 0.9)" },
    // Región 5: Oro Oxidado a Amarillo Naranja
    { start: "rgba(204, 102, 0, 0.9)", end: "rgba(255, 153, 51, 0.9)" },
    // Región 6: Gris Azulado Profundo a Gris Claro
    { start: "rgba(90, 100, 110, 0.9)", end: "rgba(130, 140, 150, 0.9)" },
    // Región 7: Rojo Vivo a Rosa Salmón
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

  const ctx = document.getElementById("ticketsChart").getContext("2d");

  fetch(
    `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetMonthlyCreatedTicketsForChartForState`
  ) // <-- Asegúrate de que tu API exponga esta función SQL
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success && data.details && data.details.length > 0) {
        const labels = data.details.map((item) => `${item.region_name}`);
        const chartData = data.details.map((item) => item.total_tickets);

        // Si ya existe una instancia del gráfico, la destruimos antes de crear una nueva
        if (monthlyTicketsChartInstanceForState) {
          monthlyTicketsChartInstanceForState.destroy();
        }

        monthlyTicketsChartInstanceForState = new Chart(ctx, {
          type: "bar", // Puedes probar 'line' para ver la tendencia también
          data: {
            labels: labels, // Nombres de las regiones como etiquetas
            datasets: [
              {
                label: "Total de Tickets Creados por Región",
                data: chartData, // Los totales de tickets creados por región
                backgroundColor: function (context) {
                  const chart = context.chart;
                  const { ctx, chartArea } = chart;

                  if (!chartArea) {
                    return;
                  }

                  const gradient = ctx.createLinearGradient(
                    0,
                    chartArea.bottom,
                    0,
                    chartArea.top
                  );

                  const index = context.dataIndex;
                  // Usamos el operador módulo para ciclar a través de los colores si hay más regiones que colores definidos
                  const colorInfo =
                    gradientColorsForState[
                      index % gradientColorsForState.length
                    ];

                  if (colorInfo) {
                    gradient.addColorStop(0, colorInfo.start);
                    gradient.addColorStop(1, colorInfo.end);
                  } else {
                    // Color de fallback
                    gradient.addColorStop(0, "rgba(100,100,100,0.7)");
                    gradient.addColorStop(1, "rgba(150,150,150,0.5)");
                  }

                  return gradient;
                },
                borderColor: borderColorsForState, // Los bordes pueden ser colores sólidos
                borderWidth: 1,
                categoryPercentage: 0.7,
                barPercentage: 0.8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: "#6c757d",
                  font: { size: 12 },
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                  drawBorder: false,
                },
              },
              x: {
                ticks: {
                  color: "#6c757d",
                  font: { size: 12 },
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                  drawBorder: false,
                },
              },
            },
            plugins: {
              legend: {
                display: true, // Mostrar la leyenda para el nombre del dataset
                labels: { color: "#343a40" },
              },
              tooltip: {
                backgroundColor: "rgba(0,0,0,0.7)",
                titleColor: "white",
                bodyColor: "white",
              },
            },
          },
        });
      } else {
        console.warn(
          "No hay datos disponibles para el gráfico de tickets creados por región o la respuesta no fue exitosa."
        );
        // Destruir el gráfico si no hay datos para mostrar un lienzo vacío
        if (monthlyTicketsChartInstanceForState) {
          monthlyTicketsChartInstanceForState.destroy();
        }
        // O mostrar un mensaje en el canvas si es posible
        ctx.fillText(
          "No hay datos para mostrar.",
          ctx.canvas.width / 2,
          ctx.canvas.height / 2
        );
      }
    })
    .catch((error) => {
      console.error(
        "Error al cargar los datos del gráfico de tickets creados por región:",
        error
      );
      if (monthlyTicketsChartInstanceForState) {
        monthlyTicketsChartInstanceForState.destroy();
      }
      ctx.fillText(
        "Error al cargar el gráfico.",
        ctx.canvas.width / 2,
        ctx.canvas.height / 2
      );
    });
}

function getTicketCounts() {
    const xhrCounts = new XMLHttpRequest();
    xhrCounts.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketCounts`);

    const tbodyCounts = document.getElementById("ticketCountsBody");
    
    tbodyCounts.innerHTML = `
        <tr>
            <td colspan="2" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">
                Cargando resumen de tickets...
            </td>
        </tr>
    `;

    xhrCounts.onload = function () {
        if (xhrCounts.status >= 200 && xhrCounts.status < 300) {
            try {
                const response = JSON.parse(xhrCounts.responseText);
                if (response.success && Array.isArray(response.counts)) { // Asegúrate de que es un array
                    const counts = response.counts;
                    tbodyCounts.innerHTML = ''; 

                    if (counts.length === 0) {
                        tbodyCounts.innerHTML = '<tr><td colspan="2" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">No hay tickets en los módulos seleccionados.</td></tr>';
                        return;
                    }

                    // Puedes definir un orden de visualización si lo necesitas,
                    // o simplemente iterar sobre los datos tal como vienen de la DB (ya ordenados por ID).
                    const displayOrderMap = {
                        4: 'Gestión Técnico',
                        6: 'Gestión Técnico (Secundario)', // Si 6 es diferente de 4, asigna un nombre claro
                        7: 'Gestión Taller',
                        8: 'Proceso Carga Llaves',
                        9: 'Llaves Cargadas',
                        5: 'Cerrados'
                    };

                    // Si quieres ordenar por un orden específico, puedes crear un array de los IDs
                    // y luego buscar en 'counts'. De lo contrario, simplemente itera 'counts'.
                    // Por simplicidad, iteraremos directamente sobre 'counts' ya que el SQL lo ordena por ID.
                    counts.forEach(item => {
                        const tr = document.createElement('tr');
                        // Usamos name_accion_ticket directamente, pero puedes usar displayOrderMap[item.id_accion_ticket]
                        // si quieres sobrescribir el nombre de la DB o asegurarte de un orden específico.
                        const moduleName = item.name_accion_ticket; 
                        
                        tr.innerHTML = `
                            <td class="px-5 py-5 border-b border-gray-200 text-sm">${moduleName}</td>
                            <td class="px-5 py-5 border-b border-gray-200 text-sm">${item.total_tickets}</td>
                        `;
                        tbodyCounts.appendChild(tr);
                    });

                } else {
                    tbodyCounts.innerHTML = '<tr><td colspan="2" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">Error al cargar conteos.</td></tr>';
                    console.error("Error al cargar conteos:", response.message);
                }
            } catch (error) {
                tbodyCounts.innerHTML = '<tr><td colspan="2" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">Error al procesar conteos.</td></tr>';
                console.error("Error parsing JSON for counts:", error);
            }
        } else {
            tbodyCounts.innerHTML = '<tr><td colspan="2" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">Error de conexión al obtener conteos.</td></tr>';
            console.error("Error al obtener conteos:", xhrCounts.status, xhrCounts.statusText);
        }
    };
    xhrCounts.onerror = function () {
        tbodyCounts.innerHTML = '<tr><td colspan="2" class="px-5 py-5 border-b border-gray-200 text-sm text-center text-gray-500">Error de red al obtener conteos.</td></tr>';
        console.error("Error de red al obtener conteos.");
    };
    xhrCounts.send();
}

// Llama a esta función para cargar el gráfico cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  loadMonthlyCreatedTicketsChart();
  loadMonthlyCreatedTicketsChartForState();
  updateTicketMonthlyPercentageChange();
  getTicketProcessReparacion();
  getTicketReparados();
  getTicketPendienteRepuesto();
  getTicketIrreparables();
  getTicketCounts(); // Para la tabla de conteos
  // ... (resto de tu código DOMContentLoaded para modals, estadísticas de cards, etc.)
});