let currentTicketIdForConfirmTaller = null;
let currentNroTicketForConfirmTaller = null; // <--- NUEVA VARIABLE PARA EL NÚMERO DE TICKET
let confirmInTallerModalInstance = null;


document.addEventListener("DOMContentLoaded", function () {
        const confirmInTallerModalElement = document.getElementById("confirmInRosalModal");
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
});

$("#confirmTallerBtn").on("click", function () {
    const ticketIdToConfirm = currentTicketIdForConfirmTaller;
    // const nroTicketToConfirm = currentNroTicketForConfirmTaller; // Si necesitas el nro_ticket aquí

    if (ticketIdToConfirm) {
      updateTicketStatusInRegion(ticketIdToConfirm);
      if (confirmInTallerModalInstance) {
        confirmInTallerModalInstance.hide();
      }
    } else {
      console.error("ID de ticket no encontrado para confirmar en taller.");
    }
});

let regionsData = [];

// Esta función ahora sí recibe el ID del técnico como parámetro
function getRegionsByTechnician(technicianId) {
    if (!technicianId) {
        document.getElementById("region-name").textContent = "No Asignada";
        document.getElementById("states-container").style.display = "none";
        return;
    }

    const xhr = new XMLHttpRequest();
    // Usa POST porque el ID del técnico se envía en el cuerpo de la solicitud
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetRegionsByTechnician`); 
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.regions && response.regions.length > 0) {
                    regionsData = response.regions; // Almacena toda la respuesta
                    console.log("Regiones obtenidas para el técnico:", regionsData);
                    
                    const uniqueRegionNames = [...new Set(regionsData.map(r => r.name_region))];
                    document.getElementById("region-name").textContent = uniqueRegionNames.join(', ');
                    
                    document.getElementById("states-container").style.display = "none";
                } else {
                    document.getElementById("region-name").textContent = "No Asignada";
                    document.getElementById("states-container").style.display = "none";
                    console.error("Error al obtener la región del técnico:", response.message);
                }
            } catch (error) {
                console.error("Error parsing JSON para las regiones:", error);
                document.getElementById("region-name").textContent = "Error en la respuesta";
                document.getElementById("states-container").style.display = "none";
            }
        } else {
            console.error("Error:", xhr.status, xhr.statusText);
            document.getElementById("region-name").textContent = "Error de conexión";
            document.getElementById("states-container").style.display = "none";
        }
    };
    
    // Envía el cuerpo de la solicitud. ¡Esto es lo que faltaba!
    const datos = `action=GetRegionsByTechnician&id_tecnico=${technicianId}`; 
    xhr.send(datos);
}

// Evento de clic para mostrar los estados (este código está bien)
document.getElementById('region-display').addEventListener('click', function() {
    const statesContainer = document.getElementById("states-container");
    const statesList = document.getElementById("states-list");

    if (regionsData.length === 0) {
        return;
    }

    if (statesContainer.style.display === "none") {
        statesList.innerHTML = '';
        regionsData.forEach(region => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = region.name_state;
            statesList.appendChild(li);
        });
        statesContainer.style.display = "block";
    } else {
        statesContainer.style.display = "none";
    }
});

// AÑADE ESTE CÓDIGO para cargar los datos del técnico al inicio
document.addEventListener("DOMContentLoaded", function() {
    // Aquí debes obtener el ID del técnico actual
    // Por ejemplo, si tienes un input hidden con el ID del usuario logueado
    const currentTechnicianId = document.getElementById("userId").value; // Cambia "currentUserId" por el ID de tu input
    if (currentTechnicianId) {
        getRegionsByTechnician(currentTechnicianId);
    }
});

let globalTicketData = [];

function getTicketDataFinaljs() {
  const id_user = document.getElementById("userId").value;
  const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketDataRegion`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  const detailsPanel = document.getElementById("ticket-details-panel");

  const tableElement = document.getElementById("tabla-ticket");
  const theadElement = tableElement
    ? tableElement.getElementsByTagName("thead")[0]
    : null;
  const tbodyElement = tableElement
    ? tableElement.getElementsByTagName("tbody")[0]
    : null;
  const tableContainer = document.querySelector(".table-responsive");

   const columnTitles = {
        nro_ticket: "Nro Ticket",
        serial_pos: "Serial POS",
        rif: "Rif",
        name_failure: "Falla",
        full_name_tecnico: "Técnico Gestión",
        razonsocial_cliente: "Razón Social",
        name_status_ticket: "Estatus Ticket",
        name_process_ticket: "Proceso Ticket",
        name_accion_ticket: "Acción Ticket",
        name_status_payment: "Estatus Pago",
        nombre_estado_cliente: "Estado Cliente",
        full_name_tecnico_n2_actual: "Técnico 2",
        fecha_instalacion: "Fecha Instalación",
        estatus_inteliservices: "Estatus Inteliservices",
    };

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success) {
          const TicketData = response.ticket;

          if (TicketData && TicketData.length > 0) {
            // Destroy DataTables if it's already initialized on this table
            if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
              $("#tabla-ticket").DataTable().destroy();
              if (theadElement) theadElement.innerHTML = ""; // Clear old headers
              if (tbodyElement) tbodyElement.innerHTML = ""; // Clear old body
            }

            const allDataKeys = Object.keys(TicketData[0] || {});
            const columnsConfig = [];

            columnsConfig.push({
              title: "N°",
              orderable: false,
              searchable: false,
              render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
              },
            });

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

                const displayLengthForTruncate = 25;

                // ************* APLICAR LÓGICA DE TRUNCADO A FALLA *************
                if (key === "name_failure") {
                  columnDef.render = function (data, type, row) {
                    if (type === "display" || type === "filter") {
                      const fullText = String(data || "").trim();
                      if (fullText.length > displayLengthForTruncate) {
                        return `<span class="truncated-cell" data-full-text="${fullText}">${fullText.substring(
                         0,
                         displayLengthForTruncate
                        )
                      }...</span>`;
                     }
                     return fullText;
                    }
                    return data;
                  };
                }                   
                // ************* FIN: APLICAR LÓGICA DE TRUNCADO A FALLA *************

                // ************* APLICAR LÓGICA DE TRUNCADO A STATUS_PAYMENTS *************
                if (key === "name_status_payment") {
                  const displayLength = 25;
                  columnDef.render = function (data, type, row) {
                    const fullText = String(data || "").trim();
                    if (fullText.length > displayLength) {
                      return `<span class="truncated-cell" data-full-text="${fullText}">${fullText.substring(0, displayLength)}...</span>`;
                    } else {
                      return `<span class="full-text-cell" data-full-text="${fullText}">${fullText}</span>`;
                    }
                  };
                }
                // ************* FIN: APLICAR LÓGICA DE TRUNCADO A STATUS_PAYMENTS *************
                columnsConfig.push(columnDef);
              }
            }


            // Añadir la columna "Acción" al final
            columnsConfig.push({
                data: null,
                title: "Acción",
                orderable: false,
                searchable: false,
                className: "dt-body-center",
                render: function (data, type, row) {
                    const idTicket = row.id_ticket;
                    const serialPos = row.serial_pos;
                    const nroTicket = row.nro_ticket;
                    const name_status_payment = row.name_status_payment;
                    const currentStatusLab = row.status_taller;
                    const name_accion_ticket = (row.name_accion_ticket || "").trim();
                    
                    const name_status_domiciliacion = (row.name_status_domiciliacion || "").trim();
                    const nombre_estado_cliente = row.nombre_estado_cliente;
                    
                    const hasEnvioDestinoDocument = row.document_types_available && row.document_types_available.includes('Envio_Destino');

                    let actionButton = '';

                    // Prioridad 1: Validar si el ticket está en espera de ser recibido en el Rosal
                    if (name_accion_ticket === "En espera de confirmar recibido en Región") {
                        actionButton = `<button type="button" class="btn btn-warning btn-sm received-ticket-btn"
                                            data-id-ticket="${idTicket}"
                                            data-serial-pos="${serialPos}"
                                            data-nro-ticket="${nroTicket}">
                                            <i class="fas fa-hand-holding-box"></i> Recibido
                                        </button>`;
                    }
                   
                    return actionButton;
                },
            });


            // Añadir la columna "Imagen"
            columnsConfig.push({
                data: null,
                title: "Vizualizar Documentos",
                orderable: false,
                searchable: false,
                width: "8%",
                render: function (data, type, row) {
                    const idTicket = row.id_ticket;
                    const accionllaves = row.name_accion_ticket; // Necesitas esta variable para la condición

                    // "cuando el status de name_accion_ticket sea: Llaves Cargadas me tiene que aparecer un boton para subir una imagen"
                    if (accionllaves === "Llaves Cargadas") {
                        return `<button type="button" id="viewimage" class="btn btn-success btn-sm See_imagen"
                                data-id-ticket="${idTicket}"
                                data-bs-toggle="modal"
                                data-bs-target="#viewDocumentModal"> Ver Documento Cargados
                            </button>`;
                    } else {
                        // Si el estatus no es "Llaves Cargadas", muestra "No hay imagen"
                        return `<button type="button" class="btn btn-secondary btn-sm disabled">No hay Docuemntos Cargados</button>`;
                    }
                },
            });

            // Initialize DataTables
            const dataTableInstance = $(tableElement).DataTable({
              responsive: false,
              scrollX: "200px", // Considera usar true o un valor más dinámico como '100%'
              data: TicketData,
              columns: columnsConfig,
              pagingType: "simple_numbers",
              lengthMenu: [5, 10, 25, 50, 100],
              autoWidth: false,
              buttons: [
                {
                  extend: "colvis", // Column visibility button
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

               
                      });

                  $(document).on("click", ".deliver-ticket-btn", function () {
                    const idTicket = $(this).data("id-ticket");
                    const nroTicket = $(this).data("nro-ticket"); // Asegúrate de que el botón tenga este data-attribute
                    const serialPos = $(this).data("serial-pos"); // Asegúrate de que el botón tenga este data-attribute
                    const customDeliverSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                    const id_user = document.getElementById('userId').value;

                    // Lógica para mostrar el modal
                    Swal.fire({
                      title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                        <div class="custom-modal-header-content">Confirmación de Entrega al Cliente</div>
                      </div>`,
                      html: `<div class="custom-modal-body-content">
                        <div class="mb-4">
                          ${customDeliverSvg}
                        </div> 
                        <p class="h4 mb-3" style="color: black;">¿Desea marcar el dispositivo con serial <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> del Ticket Nro: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> como "Entregado al Cliente"?</p> 
                        <p class="h5" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">Esta acción registrará la fecha de entrega al cliente.</p>
                      </div>`,
                      confirmButtonText: "Sí, Confirmar Entrega",
                      color: "black",
                      confirmButtonColor: "#28a745", // Un color verde para la confirmación
                      cancelButtonText: "No, cancelar",
                      focusConfirm: false,
                      allowOutsideClick: false,
                      showCancelButton: true,
                      allowEscapeKey: false,
                      keydownListenerCapture: true,
                      screenX: false,
                      screenY: false,
                    }).then((result) => {
                      Swal.fire({
                          title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                            <div class="custom-modal-header-content">Detalles de la Entrega</div>
                      </div>`,
                      html: `<div class="custom-modal-body-content">
                        <p class="h4 mb-1" style="color: black;">Por favor, ingrese un comentario o un texto adicional sobre el Dispositivo a entregar con el Serial: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">${serialPos}</span> asociado al Nro de ticket: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">${nroTicket}</span>.</p>
                        <div class="form-group mb-3"><br>
                          <textarea id="comentarioEntrega" class="form-control" rows="3" placeholder="Escriba aquí cualquier detalle relevante sobre la entrega... O reparación del Equipo"></textarea>
                        </div>
                      </div>`,
                      showCancelButton: true,
                      confirmButtonText: 'Guardar y Completar',
                      cancelButtonText: 'Cancelar',
                      confirmButtonColor: '#003594', // Un color azul para el botón de guardar
                      color: "black",
                      focusConfirm: false,
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      keydownListenerCapture: true,
                      screenX: false,
                      screenY: false,
                      width: '600px', // Aumenta el ancho del modal
                      customClass: {
                        popup: 'no-scroll' // Una clase CSS que definiremos
                      },

                    preConfirm: () => {
                      const comentario = Swal.getPopup().querySelector('#comentarioEntrega').value.trim(); // .trim() elimina espacios en blanco
                        if (!comentario) {
                          Swal.showValidationMessage('El campo de texto no puede estar vacío.');
                          return false; // Retornar false evita que el modal se cierre
                        }
                        return { comentario: comentario };
                      }
                  }).then((resultFinal) => {
                      if (resultFinal.isConfirmed) {

                      const comentario = resultFinal.value.comentario;
                      const dataToSendString = `action=entregar_ticket&id_ticket=${encodeURIComponent(idTicket)}&comentario=${encodeURIComponent(comentario)}&id_user=${encodeURIComponent(id_user)}`;

                      const xhr = new XMLHttpRequest();
                      const url = `${ENDPOINT_BASE}${APP_PATH}api/consulta/entregar_ticket`;

                      xhr.open('POST', url, true);
                      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                      xhr.onload = function() {
                          if (xhr.status >= 200 && xhr.status < 300) {
                              // Petición exitosa
                            Swal.fire({
                              title: '¡Éxito!', 
                              html: `El Pos con el serial <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; ">${serialPos}</span> ha sido entregado con éxito, asociado al Nro de ticket: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span>.`,                                                            
                              icon: 'success',
                              color: "black",
                              confirmButtonColor: "#003594", // Un color azul para el botón de confirmación
                              confirmButtonText: 'Aceptar', 
                              showCloseButton: false, 
                              allowOutsideClick: false, 
                              allowEscapeKey: false, 
                              keydownListenerCapture: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                          } else {
                              // Petición fallida
                              Swal.fire('Error', 'Hubo un problema al conectar con el servidor. Código de estado: ' + xhr.status, 'error');
                          }
                      };
                      xhr.onerror = function() {
                          // Error de red
                          Swal.fire('Error de red', 'Hubo un problema con la conexión.', 'error');
                      };
                      // Envía la petición con los datos
                      xhr.send(dataToSendString);
                      } else if (resultFinal.dismiss === Swal.DismissReason.cancel) {
                          // El usuario canceló el segundo modal, no pasa nada
                          console.log("El usuario canceló el segundo modal.");
                      }
                  });
              });
          });


           // ************* INICIO: LÓGICA PARA EL CHECKBOX "CARGAR LLAVE" *************
           $("#tabla-ticket tbody")
                .off("change", ".receive-key-checkbox") // <--- Usamos 'change' para checkboxes
                .on("change", ".receive-key-checkbox", function (e) {
                    e.stopPropagation(); // Evita propagación del evento

                    const ticketId = $(this).data("id-ticket");
                    const nroTicket = $(this).data("nro-ticket");
                    const isChecked = $(this).is(":checked"); // Verifica si el checkbox está marcado
                    const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;

                    if (isChecked) {
                        Swal.fire({
                              title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                                        <div class="custom-modal-header-content">Confirmación de Carga de Llaves</div>
                                      </div>`,
                          html: `<div class="custom-modal-body-content">
                                  <div class="mb-4">
                                      ${customWarningSvg}
                                  </div> 
                                   <p class="h4 mb-3" style = "color: black;">¿Desea marcar el Ticket Nro: ${nroTicket} como "Llaves Cargadas".?</p> 
                                   <p class="h5" style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Esta acción registrará la fecha de la carga de llaves</p>`,
                              confirmButtonText: "Sí, Confirmar",
                            color: "black",
                            confirmButtonColor: "#003594",
                            cancelButtonText: "No, cancelar",
                            focusConfirm: false,
                            allowOutsideClick: false,
                            showCancelButton: true,
                            allowEscapeKey: false,
                            keydownListenerCapture: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                MarkDateKey(ticketId, nroTicket); // `false` indica que se cargaron las llaves
                                $(this).prop('checked', true);
                            } else {
                                $(this).prop('checked', false);
                            }
                        });
                    } else {
                        // Si el checkbox se desmarca, puedes añadir lógica aquí si es necesario
                        // Por ahora, no hace nada si se desmarca.
                    }
                });

                 $("#tabla-ticket tbody")
                            .off("click", ".received-ticket-btn")
                            .on("click", ".received-ticket-btn", function (e) {
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
            // ************* FIN: LÓGICA PARA EL CHECKBOX "CARGAR LLAVE" *************

            $("#tabla-ticket tbody").on("click", ".truncated-cell", function (e) {
              // Detiene la propagación del evento para que no se active el clic en la fila
              e.stopPropagation();

              const cell = $(this);
              const fullText = cell.data("full-text");
              const displayLength = 25; // Reutiliza la misma constante de longitud
              const currentText = cell.text();

              // Alterna entre el texto completo y el texto truncado
              if (currentText.endsWith("...")) {
                  cell.text(fullText);
              } else {
                  cell.text(fullText.substring(0, displayLength) + "...");
              }
          });

            // === ADD THE CLICK EVENT LISTENER FOR TABLE ROWS HERE ===
            $("#tabla-ticket tbody")
                .off("click", "tr") // .off() to prevent multiple bindings if called multiple times
                .on("click", "tr", function (e) {
                    // Asegúrate de que el clic no proviene de una celda truncable/expandible o de un botón.
                    if ($(e.target).hasClass('truncated-cell') || $(e.target).hasClass('full-text-cell') || $(e.target).is('button') || $(e.target).is('input[type="checkbox"]')) {
                        return; // Si el clic fue en la celda del checkbox o el botón, no activar el evento de la fila.
                    }

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
                                // Asegúrate de que esta ruta sea correcta en el contexto de tu JS
                                imgElement.src = '/public/img/consulta_rif/POS/mantainment.png';
                                imgElement.alt = "Serial no disponible";
                            }
                        }
                    } else {
                        detailsPanel.innerHTML =
                            "<p>No se encontraron detalles para este ticket.</p>";
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
        tableContainer.innerHTML = "<p>No se encontraron datos.</p>";
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
  const datos = `action=GetTicketDataRegion&id_user=${encodeURIComponent(id_user)}`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getTicketDataFinaljs);


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
                          ${d.fecha_instalacion || 'Sin datos'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div  style = "font-size: 77%;" >Fecha de Cierre ultimo Ticket:</div></strong>
                          ${d.fecha_cierre_anterior || 'Sin datos'}
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
                          ${d.full_name_tecnico1}
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
                    
                    // Lógica para el estilo del elemento actual (el primero en el historial)
                    const isCurrent = index === 0;

                    const prevItem = response.history[index + 1] || {};

                    const accionChanged = prevItem.name_accion_ticket && item.name_accion_ticket !== prevItem.name_accion_ticket;
                    const tecnicoChanged = prevItem.full_name_tecnico_n2_history && item.full_name_tecnico_n2_history !== prevItem.full_name_tecnico_n2_history;
                    const statusLabChanged = prevItem.name_status_lab && item.name_status_lab !== prevItem.name_status_lab;
                    const statusDomChanged = prevItem.name_status_domiciliacion && item.name_status_domiciliacion !== prevItem.name_status_domiciliacion;
                    const statusPaymentChanged = prevItem.name_status_payment && item.name_status_payment !== prevItem.name_status_payment;
                    const estatusTicketChanged = prevItem.name_status_ticket && item.name_status_ticket !== prevItem.name_status_ticket;

                    // Lógica para los estilos del encabezado
                    let headerStyle = isCurrent ? "background-color: #ffc107;" : "background-color: #5d9cec;";
                    let textColor = isCurrent ? "color: #343a40;" : "color: #ffffff;";

                    // Lógica para mostrar el estatus correcto según la acción del ticket
                    let statusDisplayText;
                    if (item.name_accion_ticket === "Enviado a taller" || item.name_accion_ticket === "En Taller") {
                        statusDisplayText = item.name_status_lab || "Desconocido";
                    } else {
                        statusDisplayText = item.name_status_ticket || "Desconocido";
                    }
                    const statusHeaderText = ` (${statusDisplayText})`;

                    historyHtml += `
                        <div class="card mb-3 custom-history-card">
                            <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3 collapsed" type="button"
                                            data-toggle="collapse" data-target="#${collapseId}"
                                            aria-expanded="false" aria-controls="${collapseId}"
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
                                                    <th class="text-start">Operador de Gestión:</th>
                                                    <td>${item.full_name_tecnico_gestion || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td>${item.full_name_coordinador || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Técnico Asignado:</th>
                                                    <td class="${tecnicoChanged ? "highlighted-change" : ""}">${item.full_name_tecnico_n2_history || "N/A"}</td>
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
            let errorMessage = '<p class="text-center text-danger">Error al cargar el historial.</p>';
            if (jqXHR.status === 0) {
                errorMessage = '<p class="text-center text-danger">Error de red: No se pudo conectar al servidor.</p>';
            } else if (jqXHR.status == 404) {
                errorMessage = '<p class="text-center text-danger">Recurso no encontrado. (Error 404)</p>';
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
        }
    });
}

function updateTicketStatusInRegion(ticketId) {
  const id_user = document.getElementById("userId").value;

  const dataToSendString = `action=UpdateStatusToReceiveInRegion&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(ticketId)}`;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateStatusToReceiveInRegion`
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
            title: "¡Éxito!",
            text: "El POS se encontrará en el taller como 'En Proceso de reparación'.",
            icon: "success",
            confirmButtonText: "¡Entendido!", // SweetAlert2 uses confirmButtonText
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