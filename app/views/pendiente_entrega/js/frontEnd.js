let currentTicketIdForConfirmTaller = null;
let currentNroTicketForConfirmTaller = null; // <--- NUEVA VARIABLE PARA EL NÚMERO DE TICKET
let confirmInTallerModalInstance = null;
let currentSerialPosForConfirmTaller = null; // <--- NUEVA VARIABLE PARA EL SERIAL POS

document.addEventListener("DOMContentLoaded", function () {
    // --- Referencias a elementos estáticos del DOM (que siempre están presentes al cargar la página) ---
    // Modal para Subir Documento
    const modalElementUpload = document.getElementById("uploadDocumentModal");
    const cerrarBotonUpload = document.getElementById("CerrarBoton"); // Botón 'Cerrar' del modal de subida
    const iconoCerrarUpload = document.getElementById("icon-close"); // Icono 'x' del modal de subida
    const inputFile = document.getElementById("documentFile");
    const modalTicketIdSpanUpload = modalElementUpload ? modalElementUpload.querySelector("#modalTicketId") : null; // Encuentra el span dentro de su modal
    const confirmInTallerModalElement = document.getElementById("confirmInRosalModal");
    const CerramodalBtn = document.getElementById("CerrarButtonTallerRecib");


    // Modal para Visualizar Documento
    const modalElementView = document.getElementById("viewDocumentModal");
    const cerrarBotonView = document.getElementById("modalCerrarshow"); // Botón 'Cerrar' del modal de visualización
    const iconoCerrarView = document.getElementById("btn-close"); // Icono 'x' del modal de visualización
    const modalTicketIdSpanView = modalElementView ? modalElementView.querySelector("#viewModalTicketId") : null; // Encuentra el span dentro de su modal

    // Instancias de Modales de Bootstrap (si usas Bootstrap JS para controlarlos)
    let bsUploadModal = null;
    let bsViewModal = null;

    if (modalElementUpload) {
        bsUploadModal = new bootstrap.Modal(modalElementUpload, { keyboard: false }); // Habilita cierre con ESC
    }
    if (modalElementView) {
        bsViewModal = new bootstrap.Modal(modalElementView, { keyboard: false }); // Habilita cierre con ESC
    }

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

    // Variable para almacenar el ID del ticket
    let currentTicketId = null;

    // Función para mostrar el modal de subida
function showUploadModal(ticketId) {
        currentTicketId = ticketId; // Guarda el ID del ticket
        if (modalTicketIdSpanUpload) {
            modalTicketIdSpanUpload.textContent = currentTicketId;
        }

        // Aquí puedes cargar la imagen previa, etc.
        if (inputFile) {
            inputFile.value = ""; // Limpiar el input de archivo al abrir
            const imagePreview = document.getElementById("imagePreview");
            if (imagePreview) {
                imagePreview.src = "#";
                imagePreview.style.display = "none";
            }
        }

        if (bsUploadModal) {
            bsUploadModal.show(); // Usa el método de Bootstrap para mostrar el modal
        } else {
            console.error("Error: Instancia de Bootstrap Modal para 'uploadDocumentModal' no creada.");
            // Si no usas Bootstrap JS, aquí iría tu lógica manual de mostrarModal
            modalElementUpload.style.display = "block";
            setTimeout(() => {
                modalElementUpload.classList.add("show");
            }, 10);
            let backdrop = document.querySelector(".manual-modal-backdrop");
            if (!backdrop) {
                backdrop = document.createElement("div");
                backdrop.classList.add("manual-modal-backdrop", "fade");
                document.body.appendChild(backdrop);
            }
            setTimeout(() => {
                backdrop.classList.add("show");
            }, 10);
            document.body.classList.add("modal-open");
            modalElementUpload.setAttribute("aria-hidden", "false");
        }
}

// Función para mostrar el modal de visualización
function showViewModal(ticketId, nroTicket, imageUrl, pdfUrl) {
        currentTicketId = ticketId; // Guarda el ID del ticket
        currentNroTicket = nroTicket; // Guarda el número de ticket
        if (modalTicketIdSpanView) {
            modalTicketIdSpanView.textContent = currentNroTicket;
        }

        const imageViewPreview = document.getElementById("imageViewPreview");
        const pdfViewViewer = document.getElementById("pdfViewViewer");

        if (imageUrl) {
            imageViewPreview.src = imageUrl;
            imageViewPreview.style.display = "block";
            pdfViewViewer.style.display = "none";
        } else if (pdfUrl) {
            // Aquí puedes usar una librería como PDF.js o simplemente un <iframe>
            pdfViewViewer.innerHTML = `<iframe src="${pdfUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
            pdfViewViewer.style.display = "block";
            imageViewPreview.style.display = "none";
        } else {
            // No hay URL, mostrar un mensaje o limpiar
            imageViewPreview.style.display = "none";
            pdfViewViewer.style.display = "none";
            document.getElementById("viewDocumentMessage").textContent = "No hay documento disponible para este ticket.";
            document.getElementById("viewDocumentMessage").classList.remove("hidden");
        }

        if (bsViewModal) {
            bsViewModal.show(); // Usa el método de Bootstrap para mostrar el modal
        } else {
            console.error("Error: Instancia de Bootstrap Modal para 'viewDocumentModal' no creada.");
            // Lógica manual si no usas Bootstrap JS
            modalElementView.style.display = "block";
            setTimeout(() => {
                modalElementView.classList.add("show");
            }, 10);
            let backdrop = document.querySelector(".manual-modal-backdrop");
            if (!backdrop) {
                backdrop = document.createElement("div");
                backdrop.classList.add("manual-modal-backdrop", "fade");
                document.body.appendChild(backdrop);
            }
            setTimeout(() => {
                backdrop.classList.add("show");
            }, 10);
            document.body.classList.add("modal-open");
            modalElementView.setAttribute("aria-hidden", "false");
        }
}

// Función para cerrar el modal de subida
function closeUploadModalAndClean() {
        if (bsUploadModal) {
            bsUploadModal.hide(); // Usa el método de Bootstrap para ocultar el modal
        } else {
            // Lógica manual si no usas Bootstrap JS
            if (!modalElementUpload) return;
            modalElementUpload.classList.remove("show");
            setTimeout(() => {
                modalElementUpload.style.display = "none";
                modalElementUpload.setAttribute("aria-hidden", "true");
                document.body.classList.remove("modal-open");
                const backdrop = document.querySelector(".manual-modal-backdrop");
                if (backdrop) {
                    backdrop.classList.remove("show");
                    setTimeout(() => {
                        backdrop.remove();
                    }, 150);
                }
            }, 150);
        }
        if (inputFile) {
            inputFile.value = "";
            const imagePreview = document.getElementById("imagePreview");
            if (imagePreview) {
                imagePreview.src = "#";
                imagePreview.style.display = "none";
            }
        }
        currentTicketId = null; // Restablecer el ID del ticket
}

    // Función para cerrar el modal de visualización
    function closeViewModalAndClean() {
        if (bsViewModal) {
            bsViewModal.hide(); // Usa el método de Bootstrap para ocultar el modal
        } else {
            // Lógica manual si no usas Bootstrap JS
            if (!modalElementView) return;
            modalElementView.classList.remove("show");
            setTimeout(() => {
                modalElementView.style.display = "none";
                modalElementView.setAttribute("aria-hidden", "true");
                document.body.classList.remove("modal-open");
                const backdrop = document.querySelector(".manual-modal-backdrop");
                if (backdrop) {
                    backdrop.classList.remove("show");
                    setTimeout(() => {
                        backdrop.remove();
                    }, 150);
                }
            }, 150);
        }
        const imageViewPreview = document.getElementById("imageViewPreview");
        const pdfViewViewer = document.getElementById("pdfViewViewer");
        if (imageViewPreview) {
            imageViewPreview.src = "#";
            imageViewPreview.style.display = "none";
        }
        if (pdfViewViewer) {
            pdfViewViewer.innerHTML = "";
            pdfViewViewer.style.display = "none";
        }
        document.getElementById("viewDocumentMessage").classList.add("hidden"); // Oculta el mensaje
        currentTicketId = null; // Restablecer el ID del ticket
    }


    // --- Event Listeners para elementos estáticos del DOM (cierres de modales, etc.) ---
    if (cerrarBotonUpload) {
        cerrarBotonUpload.addEventListener("click", closeUploadModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'CerrarBoton' no encontrado para el modal de subida.");
    }

    if (iconoCerrarUpload) {
        iconoCerrarUpload.addEventListener("click", closeUploadModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'icon-close' no encontrado para el modal de subida.");
    }

    if (cerrarBotonView) {
        cerrarBotonView.addEventListener("click", closeViewModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'modalCerrarshow' no encontrado para el modal de visualización.");
    }

    if (iconoCerrarView) {
        iconoCerrarView.addEventListener("click", closeViewModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'btn-close' no encontrado para el modal de visualización.");
    }

    // --- Delegación de eventos para botones generados dinámicamente ---
    // Este listener escuchará clics en todo el documento
    document.addEventListener("click", function (event) {
        // Delegación para el botón "Subir Documento" (openModalButton)
        const openUploadBtn = event.target.closest("#openModalButton");
        if (openUploadBtn) {
            event.preventDefault(); // Previene el comportamiento por defecto del botón
            const idTicket = openUploadBtn.dataset.idTicket;
            showUploadModal(idTicket);
            return; // Detiene la ejecución para no procesar otros botones
        }

        // Delegación para el botón "Ver Imagen" (o similar, con ID 'viewimage')
        // Asume que el botón de ver imagen tiene un ID 'viewimage' y un data-url-document
        const openViewBtn = event.target.closest("#viewimage"); // O la clase CSS que uses
        if (openViewBtn) {
            event.preventDefault();
            const idTicket = openViewBtn.dataset.idTicket;
            const nroTicket = openViewBtn.dataset.nroTicket; // Asegúrate de que este atributo exista en tu botón dinámico
            const documentUrl = openViewBtn.dataset.urlDocument; // Asegúrate de que este atributo exista en tu botón dinámico
            const documentType = openViewBtn.dataset.documentType; // 'image' o 'pdf'

            if (documentType === 'image') {
                showViewModal(idTicket, nroTicket, documentUrl, null);
            } else if (documentType === 'pdf') {
                showViewModal(idTicket, nroTicket, null, documentUrl);
            } else {
                console.warn("Tipo de documento no especificado para la visualización.");
                showViewModal(idTicket, nroTicket, null, null); // Abre el modal sin contenido
            }
            return;
        }

        // Cierre del modal al hacer clic fuera de él (en el backdrop)
        // Solo si estás usando tu lógica manual de backdrop. Bootstrap maneja esto automáticamente.
        // Si usas Bootstrap, puedes eliminar esta sección.
        const backdrop = document.querySelector(".manual-modal-backdrop");
        if (backdrop && event.target === backdrop) {
            if (modalElementUpload && modalElementUpload.classList.contains("show")) {
                closeUploadModalAndClean();
            }
            if (modalElementView && modalElementView.classList.contains("show")) {
                closeViewModalAndClean();
            }
        }
    });

    // --- Manejo del input de archivo para previsualización ---
    if (inputFile) {
        inputFile.addEventListener('change', function() {
            const imagePreview = document.getElementById("imagePreview");
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = "#";
                imagePreview.style.display = "none";
            }
        });
    }
});

// Función para verificar si un ticket tiene componentes asociados usando XMLHttpRequest
function checkTicketComponents(ticketId, serialPos, regionName) {
    const xhr = new XMLHttpRequest();
    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/HasComponents`;

    xhr.open("POST", apiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const validationResponse = JSON.parse(xhr.responseText);
                if (validationResponse.success && validationResponse.hasComponents) {
                    console.log(validationResponse.message);
                    // Si el ticket ya tiene componentes, muestra el modal de selección
                    showSelectComponentsModal(ticketId, regionName, serialPos);
                } else {
                    // Si NO tiene componentes, muestra la advertencia
                    const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-exclamation-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>`;
                    Swal.fire({
                        html: `<div class="custom-modal-body-content">
                                    <div class="mb-4">
                                        ${customWarningSvg}
                                    </div>
                                    <p class="h4 mb-3" style="color: black;">El POS con serial: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> no tiene componentes cargados.</p>
                                    <p class="h5" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; font-size: 80%; color: #007bff;">¿Desea enviar a la región sin componentes?</p>
                                </div>`,
                        showCancelButton: true,
                        confirmButtonText: "Enviar",
                        cancelButtonText: "Cancelar",
                        confirmButtonColor: "#003594",
                        focusConfirm: false,
                        allowOutsideClick: false,
                    }).then((warningResult) => {
                        if (warningResult.isConfirmed) {
                            sendToRegionWithoutComponent(ticketId, serialPos);
                        }
                    });
                }
            } catch (e) {
                console.error('Error al parsear la respuesta JSON del servidor:', e);
                Swal.fire('Error de Validación', 'Respuesta del servidor inválida. Intente de nuevo.', 'error');
            }
        } else {
            console.error('Error en la solicitud AJAX:', xhr.status, xhr.statusText);
            Swal.fire('Error de Validación', 'No se pudo verificar si el ticket tiene componentes. Intente de nuevo.', 'error');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red al intentar verificar los componentes.');
        Swal.fire('Error de red', 'No se pudo conectar con el servidor para la validación.', 'error');
    };

    // Corregimos el nombre del parámetro de 'id_ticket' a 'ticketId' para que coincida con el backend
    const dataToSend = `action=HasComponents&ticketId=${ticketId}`;
    xhr.send(dataToSend);
}


function getTicketDataFinaljs() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketDataFinal`);
  const detailsPanel = document.getElementById("ticket-details-panel");

  const tableElement = document.getElementById("tabla-ticket");
  const theadElement = tableElement
    ? tableElement.getElementsByTagName("thead")[0]
    : null;
  const tbodyElement = tableElement
    ? tableElement.getElementsByTagName("tbody")[0]
    : null;
  const tableContainer = document.querySelector(".table-responsive");

  // Define column titles strictly based on your SQL function's output
  const columnTitles = {
    //id_ticket: "ID Ticket",
    nro_ticket: "Nro Ticket",
    full_name_tecnico1: "Técnico Gestión", // CORREGIDO
   // create_ticket: "Fecha Creación",
    serial_pos: "Serial POS",
    rif: "Rif",
    name_failure: "Falla",
    // id_level_failure: "Nivel Falla", // ELIMINADO
    full_name_coord: "Coordinador", // CORREGIDO
    fecha_envio_coordinador: "Fecha Envío Coordinador", // ELIMINADO
    fecha_envio_a_taller: "Fecha Envío a Taller",
    name_status_ticket: "Estatus Ticket",
    //name_process_ticket: "Proceso Ticket",
    name_status_payment: "Estatus Pago",
    name_status_lab: "Estatus Taller", // CORREGIDO
    name_accion_ticket: "Acción Ticket",
    full_name_tecnico2: "Técnico 2", // CORREGIDO
    fecha_assignado_al_tecnico2: "Fecha Asignado al Técnico 2", // ELIMINADO
    envio_a_taller: "Fecha Envío a Taller", // ELIMINADO
    status_taller: "Estatus Taller", // ELIMINADO
    name_status_domiciliacion: "Estatus Domiciliación", // CORREGIDO
    date_send_torosal_fromlab: "Fecha Envío Torosal Lab", // CORREGIDO
    fecha_llaves_enviada: "Fecha de Llaves Enviadas", // CORREGIDO
    fecha_carga_llaves: "Fecha Carga Llaves", // CORREGIDO
    date_receivefrom_desti: "Fecha Envío a Destino", // CORREGIDO
    confirmreceive: "Confirmar Recibido", // AÑADIDO
    //fecha_instalacion: "Fecha Instalación", // Añadido
    //estatus_inteliservices: "Estatus Inteliservices", // Añadido
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

                // Lógica para aplicar estilo al estado del ticket
               /* if (key === "name_status_ticket") {
                  columnDef.render = function (data, type, row) {
                    let statusText = String(data || "").trim();
                    let statusColor = "gray";

                    switch (statusText) {
                      case "Abierto":
                        statusColor = "#4CAF50"; // Verde
                        break;
                      case "En proceso":
                        statusColor = "#2196F3"; // Azul
                        break;
                      default:
                        if (statusText === "") {
                          return "";
                        }
                        statusColor = "#9E9E9E"; // Gris si no hay match
                        break;
                    }
                    return `<span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>`;
                  };
                }*/

                const displayLengthForTruncate = 25; // Define la longitud a la que truncar el texto

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
           // ... (código anterior hasta la columna "Acción")

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
                    const currentStatusLab = (row.status_taller || "").trim();
                    const name_accion_ticket = (row.name_accion_ticket || "").trim();
                    const name_status_domiciliacion = (row.name_status_domiciliacion || "").trim();
                    const nombre_estado_cliente = (row.name_region || "").trim();
                    
                    // ** VALOR OBTENIDO DE LA FUNCIÓN getdataticketfinal() **
                    // Verifica si la cadena de tipos de documentos incluye 'Envio_Destino'
                    const hasEnvioDestinoDocument = row.document_types_available && row.document_types_available.includes('Envio_Destino');
                    const isDocumentMissing = !hasEnvioDestinoDocument || hasEnvioDestinoDocument === null || hasEnvioDestinoDocument === '';

                    let actionButton = '';

                    // Prioridad 1: Validar si el ticket está en espera de ser recibido en el Rosal
                    if (name_accion_ticket === "En espera de confirmar recibido en el Rosal") {
                        actionButton = `<button type="button" class="btn btn-warning btn-sm received-ticket-btn"
                                            data-id-ticket="${idTicket}"
                                            data-serial-pos="${serialPos}"
                                            data-nro-ticket="${nroTicket}">
                                            <i class="fas fa-hand-holding-box"></i> Recibido
                                        </button>`;
                    }
                    // Prioridad 2: Validar si el ticket es de Caracas o Miranda y está Reparado
                    else if (currentStatusLab === "Reparado" && (nombre_estado_cliente === "Caracas" || nombre_estado_cliente === "Miranda" ||  nombre_estado_cliente === "Distrito Capital" || nombre_estado_cliente === "Vargas")) {
                        actionButton = `<button type="button" class="btn btn-primary btn-sm deliver-ticket-btn"
                                            data-id-ticket="${idTicket}"
                                            data-serial-pos="${serialPos}"
                                            data-nro-ticket="${nroTicket}">
                                            Entregar al Cliente
                                        </button>`;
                    }else {
                        const commonConditions = (currentStatusLab === "Reparado" && name_status_domiciliacion === "Solvente" && nombre_estado_cliente !== "Caracas" || nombre_estado_cliente !== "Miranda" ||  nombre_estado_cliente !== "Distrito Capital" || nombre_estado_cliente !== "Vargas" );
                        if (commonConditions && isDocumentMissing) {
                            actionButton = `<button type="button" id="openModalButton" class="btn btn-info btn-sm upload-document-btn"
                                                data-id-ticket="${idTicket}"
                                                data-nro-ticket="${nroTicket}"
                                                data-bs-toggle="modal"
                                                data-bs-target="#uploadDocumentModal">
                                                Subir Documento
                                            </button>`;
                        }
                        // Si cumple las condiciones base y YA se subió el documento
                       if (commonConditions && hasEnvioDestinoDocument) {
                          actionButton = `<button type="button" class="btn btn-success btn-sm send-to-region-btn"
                                              data-id-ticket="${idTicket}"
                                              data-region-name="${nombre_estado_cliente}"
                                              data-serial-pos="${serialPos}"
                                              data-nro-ticket="${nroTicket}">
                                              Enviar a Región: ${nombre_estado_cliente}
                                          </button>`;
                      }     
                    }
                    return actionButton;
                },
            });

            // Añadir la columna "Llaves"
            columnsConfig.push({
                data: null,
                title: "Llaves",
                orderable: false,
                searchable: false,
                className: "dt-body-center",
                render: function (data, type, row) {
                    const idTicket = row.id_ticket;
                    const verificacionDeLlaves = row.id_status_key; // CORREGIDO: Usar confirmreceive
                    const accionllaves = row.name_accion_ticket;
                    const fechaLlavesEnviada = row.date_sendkey; // CORREGIDO: Usar date_sendkey
                    const fechaCargaLlaves = row.date_receivekey; // CORREGIDO: Usar date_receivekey

                    // Lógica para el checkbox "Cargar Llave"
                    // shouldShowLoadKeyCheckbox ahora se basa en 'confirmreceive'
                    const shouldShowLoadKeyCheckbox = !(verificacionDeLlaves === false || verificacionDeLlaves === 'f'); // Si NO están confirmadas
                        if (shouldShowLoadKeyCheckbox && accionllaves == "Llaves Cargadas" && fechaLlavesEnviada != "NULL" && fechaCargaLlaves != "NULL") {
                            return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}" 
                                    title="Llaves Cargadas"
                                    checked disabled>`;
                                    
                        }else if (verificacionDeLlaves === false || verificacionDeLlaves === 'f' && accionllaves === "Llaves Cargadas" && fechaLlavesEnviada == null) {
                            return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}" 
                                    title="Llaves Cargadas En el Rosal" checked disabled>`; // Sin marcar y habilitado
                        } else {
                           return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}" 
                                    title="Confirmar Carga De llaves">`;
                        }
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
                    const nroTicket = row.nro_ticket;
                    const accionllaves = row.name_accion_ticket; // Necesitas esta variable para la condición
                    const hasEnvioDestinoDocument = row.document_types_available && row.document_types_available.includes('Envio_Destino');


                    // "cuando el status de name_accion_ticket sea: Llaves Cargadas me tiene que aparecer un boton para subir una imagen"
                    if (hasEnvioDestinoDocument) {
                        return `<button type="button" id="viewimage" class="btn btn-success btn-sm See_imagen"
                                data-id-ticket="${idTicket}"
                                data-nro-ticket="${nroTicket}"
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

                  dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
                          initComplete: function (settings, json) {
                              const dataTableInstance = this.api(); // Obtén la instancia de la API de DataTables
                              const buttonsHtml = `
                                  <button id="btn-por-asignar" class="btn btn-secondary me-2" title="Tickets en espera de confirmar recibido en el Rosal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                                      <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                    </svg>
                                  </button>

                                  <button id="btn-asignados" class="btn btn-secondary me-2" title="Tickets en el Rosal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
                                      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
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

                              // Inicialmente, establecer "Asignados" como activo y aplicar el filtro
                                  dataTableInstance.columns().search('').draw(false);
                                  dataTableInstance.column(10).search("En espera de confirmar recibido en el Rosal", true).draw();
                                  dataTableInstance.column(17).visible(false);
                                  dataTableInstance.column(17).visible(true);
                                  dataTableInstance.column(18).visible(true);
                                  dataTableInstance.column(19).visible(true);
                                  dataTableInstance.column(20).visible(true);
                                  setActiveButton("btn-por-asignar");


                                  $("#btn-por-asignar").on("click", function () {
                                  dataTableInstance.columns().search('').draw(false);
                                  dataTableInstance.column(10).search("En espera de confirmar recibido en el Rosal", true).draw();
                                  dataTableInstance.column(17).visible(true);
                                  dataTableInstance.column(18).visible(true);
                                  dataTableInstance.column(19).visible(true);
                                  dataTableInstance.column(20).visible(true);
                                  setActiveButton("btn-por-asignar");
                              });

                              // Tus event listeners de clic están correctos
                              $("#btn-asignados").on("click", function () {
                                  dataTableInstance.columns().search('').draw(false);
                                  dataTableInstance.column(10).search("^En el Rosal$", true, false).draw();
                                  dataTableInstance.column(17).visible(true);
                                  dataTableInstance.column(18).visible(true);
                                  dataTableInstance.column(19).visible(true);
                                  dataTableInstance.column(20).visible(true);                                  
                                    setActiveButton("btn-asignados");
                              });

                              $("#btn-recibidos").on("click", function () {
                              dataTableInstance.columns().search('').draw(false);
                              dataTableInstance.column(10).search("Entregado a Cliente", true).draw();
                              dataTableInstance.column(17).visible(false);
                              dataTableInstance.column(18).visible(false);
                              dataTableInstance.column(19).visible(false);
                              dataTableInstance.column(20).visible(false);
                              setActiveButton("btn-recibidos");
                            });
                              

                           $("#btn-devuelto").on("click", function () {
                              dataTableInstance.columns().search('').draw(false);
                              dataTableInstance.column(8).search("Enviado devuelta al Rosal").draw();

                              // Obtener todos los botones de carga de llave y ocultarlos
                              document.querySelectorAll(".load-key-button").forEach(button => {
                                  button.style.display = "none";
                              });

                              document.querySelectorAll(".receive-key-checkbox").forEach(checkbox => {
                                  checkbox.style.display = "none"; // Ocultar checkboxes
                              });

                              setActiveButton("btn-devuelto");
                            });
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
                              confirmButtonText: "Confirmar",
                            color: "black",
                            confirmButtonColor: "#003594",
                            cancelButtonText: "Cancelar",
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
                .off("click", ".send-to-region-btn")
                .on("click", ".send-to-region-btn", function (e) {
                    e.stopPropagation();

                    const ticketId = $(this).data("id-ticket");
                    const serialPos = $(this).data("serial-pos") || "";
                    const nroTicket = $(this).data("nro-ticket");
                    const regionName = $(this).data("region-name");

                    const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                    
                    Swal.fire({
                        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                                    <div class="custom-modal-header-content">Confirmación de Envío a Región</div>
                                </div>`,
                        html: `<div class="custom-modal-body-content">
                                    <div class="mb-4">
                                        ${customWarningSvg}
                                    </div> 
                                    <p class="h4 mb-3" style="color: black;">¿Seguro que desea enviar el Ticket Nro: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> a la región: ${regionName}?</p> 
                                    <p class="h5" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; font-size: 70%; color: #007bff;">Esta acción cambiará el estado del ticket a "Enviado a Región"</p>
                                </div>`,
                        confirmButtonText: "Continuar",
                        color: "black",
                        confirmButtonColor: "#003594",
                        cancelButtonText: "Cancelar",
                        focusConfirm: false,
                        allowOutsideClick: false,
                        showCancelButton: true,
                        allowEscapeKey: false,
                        keydownListenerCapture: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Llama a la función que usa XMLHttpRequest para la validación
                            checkTicketComponents(ticketId, serialPos, regionName);
                        }
                    });
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
                                currentSerialPosForConfirmTaller = serialPos; // Asegúrate de que serial_pos esté definido

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
  const datos = `action=GetTicketDataFinal`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getTicketDataFinaljs);

/**
 * Muestra un modal de SweetAlert para seleccionar componentes antes de enviar el ticket.
 * La función primero obtiene los componentes de la base de datos y luego muestra el modal.
 * @param {string} ticketId El ID del ticket que se está procesando.
 * @param {string} regionName El nombre de la región a la que se enviará el ticket.
 * 
 */

function showSelectComponentsModal(ticketId, regionName, serialPos) {
    const serial_Pos = serialPos;

    // La API URL debe ser la que devuelve la lista de componentes asociados.
    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetComponents`;

    const xhr = new XMLHttpRequest();
    // Cambiamos el método a POST para enviar el ticketId
    xhr.open("POST", apiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                const components = response.components;

                let componentsHtml = '';
                // Verifica que `components` sea un array antes de iterar
                if (Array.isArray(components) && components.length > 0) {
                    components.forEach(comp => {
                        // Lógica para pre-seleccionar y deshabilitar el checkbox
                        const isSelected = comp.is_selected === 't';
                        const isChecked = isSelected ? 'checked' : '';
                        const isDisabled = isSelected ? 'disabled' : '';
                        componentsHtml += `
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="${comp.id_component}" id="component-${comp.id_component}" style="accent-color: #007bff;" ${isChecked} ${isDisabled}>
                                <label class="form-check-label" style="width: 80%;" for="component-${comp.id_component}">
                                    ${comp.name_component}
                                </label>
                            </div>
                        `;
                    });
                } else {
                    componentsHtml = '<p class="text-danger">No se encontraron componentes asociados.</p>';
                }

                const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                Swal.fire({
                    title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                                <div class="custom-modal-header-content">Enviar a la Región ${regionName}</div>
                            </div>`,
                    html: `
                        <div class="custom-modal-body-content">
                            <div class="mb-4">
                                ${customWarningSvg}
                            </div> 
                            <p class="h5 mb-3" style="color: black;">Seleccione los componentes que serán enviados junto al POS:<span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; font-size: 70%; color: #007bff;">${serial_Pos}</span></p>
                            <div id="components-list" style="margin-left: 28%;" class="text-left mt-3">
                                ${componentsHtml}
                            </div>
                        </div>`,
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar Envío',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: "#003594",
                    preConfirm: () => {
                        const selectedComponents = [];
                        // Lógica corregida: Selecciona los checkboxes marcados que NO están deshabilitados.
                        const checkboxes = Swal.getPopup().querySelectorAll('input[type="checkbox"]:checked:not([disabled])');
                        checkboxes.forEach(checkbox => {
                            selectedComponents.push(checkbox.value);
                        });
                        return selectedComponents;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        sendToRegion(ticketId, result.value, serial_Pos);
                    }
                });
            } catch (e) {
                // Captura el error de parseo y muestra un mensaje más claro
                console.error("Error al parsear la respuesta JSON del servidor:", e);
                Swal.fire('Error', 'No se pudieron cargar los componentes. Intente de nuevo más tarde.', 'error');
            }
        } else {
            Swal.fire('Error', 'No se pudo obtener la lista de componentes.', 'error');
        }
    };
    xhr.onerror = function() {
        Swal.fire('Error de red', 'No se pudo conectar con el servidor para obtener los componentes.', 'error');
    };
    const dataToSendString = `ticketId=${ticketId}`; // Adaptado para enviar ticketId en el body.
    xhr.send(dataToSendString);
}

$("#confirmTallerBtn").on("click", function () {
    const ticketIdToConfirm = currentTicketIdForConfirmTaller;
    const nroTicketToConfirm = currentNroTicketForConfirmTaller; // Si necesitas el nro_ticket aquí
    const serialPosToConfirm = currentSerialPosForConfirmTaller; // Si necesitas el serial_pos aquí

    if (ticketIdToConfirm) {
      updateTicketStatusInRosal(ticketIdToConfirm, nroTicketToConfirm, serialPosToConfirm);
      if (confirmInTallerModalInstance) {
        confirmInTallerModalInstance.hide();
      }
    } else {
      console.error("ID de ticket no encontrado para confirmar en taller.");
    }
});

function updateTicketStatusInRosal(ticketId, nroTicketToConfirm, serialPosToConfirm) {
  const id_user = document.getElementById("userId").value;
  const nro_ticket = nroTicketToConfirm;
  const serial_pos = serialPosToConfirm;

  const dataToSendString = `action=UpdateStatusToReceiveInRosal&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(ticketId)}`;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateStatusToReceiveInRosal`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success === true) {
          Swal.fire({
            title: "¡Éxito!",
            html:  `El Pos con el serial <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serial_pos}</span> asociado al Nro de ticket: <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> ha sido marcado como recibido en Gestión Rosal correctamente.`,
            icon: "success",
            confirmButtonText: "¡Entendido!", // SweetAlert2 uses confirmButtonText
            confirmButtonColor: "#003594", // SweetAlert2 uses confirmButtonColor
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

function MarkDateKey(ticketId, nroTicket) {
  const id_user = document.getElementById("userId").value;
  const nro_ticket = nroTicket;
    if (!ticketId) {
        console.error("El ID del ticket no puede ser nulo o indefinido.");
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo marcar la fecha de la llave. ID de ticket no proporcionado.",
        });
        return; // Detener la ejecución si no hay ID de ticket
    }
    const dataToSendString = `action=MarkKeyAsReceived&id_ticket=${encodeURIComponent(ticketId)}&id_user=${encodeURIComponent(id_user)}`;

    const xhr = new XMLHttpRequest();
    // Ajusta esta URL a la ruta de tu endpoint de API en el backend
    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/MarkKeyAsReceived`; // O el nombre de tu endpoint

    xhr.open("POST", apiUrl, true); // true para asíncrono
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        if (response.success === true) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Éxito!",
                        text: `La fecha de la carga de llaves al POS asociado al Nro de ticket: ${nro_ticket} fue registrada correctamente.`,
                        confirmButtonText: "Aceptar", // <-- OPCIONAL: Puedes personalizar el texto del botón
                        allowOutsideClick: false, // <-- ELIMINAR O COMENTAR esta línea
                        color: "black", // <-- ELIMINAR O COMENTAR esta línea
                       confirmButtonColor: "#003594", // <-- ELIMINAR O COMENTAR esta línea
                    }).then((result) => {
                        // Verifica si el botón de confirmación fue presionado
                        if (result.isConfirmed) {
                            location.reload(); // Recarga la página después de que el usuario haga clic en Aceptar
                        }
                    });
                  } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response.message || "No se pudo marcar la fecha de la llave.",
                    });
                }
            } catch (error) {
                console.error("Error al parsear la respuesta JSON:",error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al procesar la respuesta del servidor.",
                });
            }
        } else {
            console.error("Error en la solicitud:", xhr.status, xhr.statusText);
            Swal.fire({
                icon: "error",
                title: "Error de Servidor",
                text: `El servidor respondió con el estado: ${xhr.status} ${xhr.statusText}`,
            });
        }
    };

    xhr.onerror = function () {
        console.error("Error de red al intentar marcar la fecha de la llave.");
        Swal.fire({
            icon: "error",
            title: "Error de Red",
            text: "No se pudo conectar con el servidor. Verifica tu conexión.",
        });
    };

    // Envía el id_ticket como JSON en el cuerpo de la solicitud
    xhr.send(dataToSendString);
}

$(document).ready(function () {
  // 1. Declaración de referencias a elementos del DOM usando jQuery
  // Deben estar declaradas al inicio de $(document).ready para que sean accesibles en todo el bloque.
  const $uploadDocumentModalElement = $("#uploadDocumentModal"); // <-- Este es el modal DIV
  const $modalTicketIdSpan = $("#id_ticket");
  const $documentFileInput = $("#documentFile");
  const $imagePreview = $("#imagePreview");
  const $uploadFileBtn = $("#uploadFileBtn"); // <-- Este es el botón "Subir" dentro del modal
  const $uploadMessage = $("#uploadMessage");

  // Asegúrate de que ENDPOINT_BASE y APP_PATH estén definidos globalmente en el HTML
  // Si no, podrías definirlas aquí directamente si conoces las rutas estáticas:
  // const ENDPOINT_BASE = '/';
  // const APP_PATH = 'app/';

  // Función para mostrar mensajes
  function showMessage(message, type) {
    // Asegúrate de que el elemento existe antes de manipularlo
    if ($uploadMessage.length) {
      $uploadMessage.text(message);
      $uploadMessage
        .removeClass()
        .addClass(
          `message-box mt-2 p-2 rounded text-sm ${
            type === "success"
              ? "bg-green-100 text-green-700"
              : type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`
        );
      $uploadMessage.show(); // Asegúrate de que el mensaje sea visible
    }
  }

  // 2. Comprobar si el elemento del modal existe antes de crear la instancia
  // Esta instancia del modal debe crearse UNA VEZ, fuera del listener de clic,
  // pero dentro del $(document).ready
  let uploadDocumentModalInstance; // Declara la variable para la instancia del modal

  if ($uploadDocumentModalElement.length) {
    uploadDocumentModalInstance = new bootstrap.Modal(
      $uploadDocumentModalElement[0]
    ); // Crea la instancia de Bootstrap Modal
  }

  // 3. Listener para el clic en los botones "Subir Documento" en la tabla
  // Usamos delegación de eventos con $(document).on('click', ...)
  // para los botones generados dinámicamente por DataTables.
  $(document).on("click", ".upload-document-btn", function () {
    // Verifica si la instancia del modal se creó correctamente
    if (uploadDocumentModalInstance) {
      const idTicket = $(this).data("id-ticket"); // Obtiene data-id-ticket del botón clicado

      // Rellena el modal con los datos del ticket
      if ($modalTicketIdSpan.length) $modalTicketIdSpan.text(idTicket);

      // Limpia campos del modal
      if ($documentFileInput.length) $documentFileInput.val("");
      if ($imagePreview.length) {
        $imagePreview.hide();
        $imagePreview.attr("src", "#"); // Limpiar src de la imagen
      }
      if ($uploadMessage.length) {
        $uploadMessage.text("");
        $uploadMessage.hide(); // Ocultar mensaje
      }

      // ABRIR EL MODAL EXPLICITAMENTE
      uploadDocumentModalInstance.show();
    } else {
      console.error(
        "Error: Instancia de modal 'uploadDocumentModal' no encontrada. Asegúrate de que el elemento HTML del modal existe y Bootstrap JS está cargado."
      );
    }
  });

  // 4. Previsualización de la imagen seleccionada (ya estaba bien estructurado)
  if ($documentFileInput.length) {
    $documentFileInput.on("change", function () {
      const file = this.files[0];

      if (file) {
        if (file.type.startsWith("image/") || file.type === "application/pdf") {
          const reader = new FileReader();
          reader.onload = function (e) {
            if (file.type.startsWith("image/")) {
              $imagePreview.attr("src", e.target.result);
              $imagePreview.show();
            } else {
              $imagePreview.hide();
              $imagePreview.attr("src", "#");
              showMessage(
                "Archivo PDF seleccionado. No se muestra previsualización.",
                "info"
              );
            }
          };
          reader.readAsDataURL(file);
          $uploadMessage.hide(); // Limpiar mensajes si el archivo es válido
        } else {
          $documentFileInput.val("");
          $imagePreview.attr("src", "#");
          showMessage(
            "Tipo de archivo no permitido. Solo imágenes (JPG, PNG, GIF) o PDF.",
            "error"
          );
        }
      } else {
        $imagePreview.hide();
        $imagePreview.attr("src", "#");
        $uploadMessage.hide();
      }
    });
  }

  // 5. Evento para el botón de subir archivo (dentro del modal)
  if ($uploadFileBtn.length) {
    $uploadFileBtn.on("click", async function () {
      const file = $documentFileInput[0].files[0];
      const idTicket = $modalTicketIdSpan.text();
      const id_user = document.getElementById("userId").value; // Aquí se debe obtener el id_user del usuario logueado
      if (!file) {
        showMessage("Por favor, seleccione un archivo para subir.", "error");
        return;
      }

      showMessage("Subiendo documento...", "info");

      const formData = new FormData();
      formData.append("ticket_id", idTicket);
      formData.append("document_file", file);
      // *** AÑADIR EL MIME TYPE DEL ARCHIVO AL formData ***
      formData.append("mime_type", file.type);
      formData.append("action", "uploadDocument"); // Ya estaba aquí, pero se mantiene para la claridad
      formData.append("id_user", id_user); // Aquí se debe obtener el id_user del usuario logueado
      formData.append("document_type", "Envio_Destino");


      try {
        const uploadUrl = `${ENDPOINT_BASE}${APP_PATH}api/reportes/uploadDocument`;

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok && result.success) {
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: `El Documento ha sido guardado exitosamente.`,
            confirmButtonText: "Aceptar", // <-- OPCIONAL: Puedes personalizar el texto del botón
            allowOutsideClick: false, // <-- ELIMINAR O COMENTAR esta línea
            color: "black", // <-- ELIMINAR O COMENTAR esta línea
            confirmButtonColor: "#003594", // <-- ELIMINAR O COMENTAR esta línea
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload(); // Recarga la página después de que el usuario haga clic en Aceptar
            }
          });
           if (uploadDocumentModalInstance) {  
            uploadDocumentModalInstance.hide();
          }
          // Opcional: $('#tuTablaID').DataTable().ajax.reload();
        } else {
          showMessage(
            `Error al subir documento: ${
              result.message || "Error desconocido."
            }`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error en la subida:", error);
        showMessage("Error de conexión al subir el documento.", "error");
      }
    });
  }

  // 6. Evento que se dispara cuando el modal se ha ocultado completamente
  if ($uploadDocumentModalElement.length) {
    $uploadDocumentModalElement.on("hidden.bs.modal", function () {
      // Limpiar todo después de que el modal se oculta
      if ($modalTicketIdSpan.length) $modalTicketIdSpan.text("");
      if ($documentFileInput.length) $documentFileInput.val("");
      if ($imagePreview.length) {
        $imagePreview.hide();
        $imagePreview.attr("src", "#");
      }
      if ($uploadMessage.length) {
        $uploadMessage.text("");
        $uploadMessage.hide();
      }
    });
  }
}); // Cierre correcto de $(document).ready

document.addEventListener("DOMContentLoaded", function () {
    // --- Referencias a elementos del MODAL DE VISUALIZACIÓN ---
    const viewDocumentModalElement = document.getElementById("viewDocumentModal");
    const viewDocumentBootstrapModal = new bootstrap.Modal(viewDocumentModalElement);

    const viewModalTicketIdSpan = document.getElementById("viewModalTicketId");
    const imageViewPreview = document.getElementById("imageViewPreview");
    const pdfViewViewer = document.getElementById("pdfViewViewer");
    const viewDocumentMessage = document.getElementById("viewDocumentMessage");
    const nameDocumento = document.getElementById("NombreImage");

    // Función auxiliar para mostrar el documento en el MODAL
function displayDocumentInViewModal(filePath, mimeType, originalName) {
    imageViewPreview.style.display = "none";
    pdfViewViewer.style.display = "none";
    viewDocumentMessage.classList.add("hidden");
    viewDocumentMessage.textContent = "";
    nameDocumento.textContent = originalName;

    // 1. Limpiar la ruta: Eliminar el prefijo 'D:/' y las barras invertidas
    // `filePath` sigue llegando con la ruta completa del disco.
    let documentPathFromBackend = filePath;
    
    // Primero, reemplaza las barras invertidas con barras normales para estandarizar
    documentPathFromBackend = documentPathFromBackend.replace(/\\/g, '/');

    // Después, elimina el prefijo `D:/uploads_tickets/` para que solo quede el resto de la ruta.
    // Esto asume que el Alias de Apache es `/uploads` y el archivo está en `D:/uploads_tickets/`.
    // La parte `uploads_tickets/` no se debe incluir en la URL si el `Alias` ya lo hace.
    const pathSegments = documentPathFromBackend.split('uploads_tickets/');
    if (pathSegments.length > 1) {
        documentPathFromBackend = pathSegments[1];
    }

    // 2. Construir la URL con la ruta limpia
    // El Alias de Apache `/uploads` ya apunta a `D:/uploads_tickets/`, por lo que la URL final no debe repetir la carpeta.
    const fullUrl = `http://localhost:8080/uploads/${documentPathFromBackend}`;

    if (mimeType.startsWith("image/")) {
        // Asegúrate de que `verImage` se haya declarado correctamente, ya sea con `let` o `const`
        const verImage = document.getElementById("verImage");
        imageViewPreview.src = fullUrl;
        //verImage.href = fullUrl;
        imageViewPreview.style.display = "block";
    } else if (mimeType === "application/pdf") {
        pdfViewViewer.innerHTML = `<embed src="${fullUrl}" type="application/pdf" width="100%" height="100%">`;
        pdfViewViewer.style.display = "block";
    }
}


    // --- Listener para el evento 'click' en el botón 'Ver Imagen' ---
    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("See_imagen")) {
            const button = event.target;
            const idTicket = button.getAttribute("data-id-ticket");
            const nro_ticket = button.getAttribute("data-nro-ticket");
            const documentType = button.getAttribute("data-document-type");

            viewDocumentBootstrapModal.show();

            // Limpiar y preparar el modal
            viewModalTicketIdSpan.textContent = nro_ticket;
            imageViewPreview.src = "#";
            imageViewPreview.style.display = "none";
            pdfViewViewer.innerHTML = "";
            pdfViewViewer.style.display = "none";
            viewDocumentMessage.classList.add("hidden");

            // Mostrar mensaje de carga
            viewDocumentMessage.classList.remove("hidden");
            viewDocumentMessage.textContent = "Cargando documento...";
            viewDocumentMessage.classList.add("info");

            // Preparar los datos a enviar
            const dataToSendString = `action=getDocument&ticket_id=${encodeURIComponent(idTicket)}&document_type=${encodeURIComponent(documentType)}`;

            // Realizar la petición con XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/getDocument`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log("Datos recibidos de la API:", data);

                        // **CORREGIDO:** Acceder al primer elemento del array 'document'
                        if (data.success && data.document && data.document.length > 0) { 
                            const documentData = data.document[0];
                            const documentPath = documentData.file_path;
                            const mimeType = documentData.mime_type;
                            const nameoriginal = documentData.original_filename

                            
                            // Llama a la función que mostrará el documento
                            displayDocumentInViewModal(documentPath, mimeType, nameoriginal);
                            viewDocumentMessage.style.display = "none";
                        } else {
                            viewDocumentMessage.classList.remove("hidden");
                            viewDocumentMessage.classList.add("error");
                            viewDocumentMessage.textContent = data.message || "Documento no encontrado.";
                        }
                    } catch (e) {
                        console.error("Error al parsear la respuesta JSON:", e);
                        viewDocumentMessage.classList.remove("hidden");
                        viewDocumentMessage.classList.add("error");
                        viewDocumentMessage.textContent = "Error al procesar la respuesta del servidor.";
                    }
                } else {
                    console.error("Error en la petición XMLHttpRequest:", xhr.status, xhr.statusText);
                    viewDocumentMessage.classList.remove("hidden");
                    viewDocumentMessage.classList.add("error");
                    viewDocumentMessage.textContent = `Error del servidor: ${xhr.status} - ${xhr.statusText}`;
                }
            };

            xhr.onerror = function () {
                console.error("Error de red en la petición XMLHttpRequest.");
                viewDocumentMessage.classList.remove("hidden");
                viewDocumentMessage.classList.add("error");
                viewDocumentMessage.textContent = "Error de red.";
            };

            xhr.send(dataToSendString);
        }
    });
});

/**
 * Envía los datos del ticket y los componentes seleccionados a la API regional.
 * Muestra un modal de SweetAlert2 con el resultado de la operación.
 * @param {string} ticketId El ID del ticket a enviar.
 * @param {Array<string>} selectedComponents Un array con los IDs de los componentes seleccionados.
 * @param {string} serial_Pos El número de serie del POS.
 */
function sendToRegion(ticketId, selectedComponents, serial_Pos) { 
    const id_ticket = ticketId;
    const id_user = document.getElementById("userId").value; // Obtiene el ID del usuario desde el formulario
    const component = selectedComponents;
    const pos_serial = serial_Pos;

    const regionalApiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToRegion`; // Reemplaza con la URL real de tu API
    const dataToSendString = `action=SendToRegion&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(id_ticket)}&components=${encodeURIComponent(component)}&pos_serial=${encodeURIComponent(pos_serial)}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", regionalApiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        Swal.close(); // Cierra el modal de carga

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                  Swal.fire({
                    title: "¡Éxito!",
                    html: `El Pos: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serial_Pos}</span> Fue enviado a la región con el componente seleccionado.`,
                    icon: "success",
                    confirmButtonText: "Entendido",
                    color: "black",
                    confirmButtonColor: "#003594",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.reload();
                    }
                  });
                } else {
                    Swal.fire('Error', response.message || 'Hubo un problema al enviar el ticket.', 'error');
                }
            } catch (e) {
                Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
            }
        } else {
            Swal.fire('Error', `Error en la solicitud: ${xhr.status} ${xhr.statusText}`, 'error');
        }
    };

    xhr.onerror = function() {
        Swal.close(); // Cierra el modal de carga en caso de error de red
        Swal.fire('Error de red', 'No se pudo conectar con el servidor. Intente de nuevo más tarde.', 'error');
    };

    xhr.send(dataToSendString);
}

function sendToRegionWithoutComponent(ticketId, serial_Pos) {
    const id_ticket = ticketId;
    const id_user = document.getElementById("userId").value; // Obtiene el ID del usuario desde el formulario

    const regionalApiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/sendToRegionWithoutComponent`; // Reemplaza con la URL real de tu API
    const dataToSendString = `action=sendToRegionWithoutComponent&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(id_ticket)}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", regionalApiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        Swal.close(); // Cierra el modal de carga
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                  Swal.fire({
                    title: "¡Éxito!",
                    html: `El Pos: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serial_Pos}</span> Fue enviado a la región sin componentes.`,
                    icon: "success",
                    confirmButtonText: "Entendido",
                    color: "black",
                    confirmButtonColor: "#003594",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.reload();
                    }
                  });
                } else {
                    Swal.fire('Error', response.message || 'Hubo un problema al enviar el ticket.', 'error');
                }
            } catch (e) {
                Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
            }
        } else {
          Swal.fire('Error', `Error en la solicitud: ${xhr.status} ${xhr.statusText}`, 'error');
        }
    }; 
    xhr.onerror = function() {
        Swal.close(); // Cierra el modal de carga en caso de error de red
        Swal.fire('Error de red', 'No se pudo conectar con el servidor. Intente de nuevo más tarde.', 'error');
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
            // Revisa la consola del navegador para ver la respuesta completa del servidor.
            console.log("Respuesta del servidor:", response);

            // Verifica si la respuesta es exitosa y contiene datos de historial.
            if (response.success && response.history && response.history.length > 0) {
                let historyHtml = '<div class="accordion" id="ticketHistoryAccordion">';

                response.history.forEach((item, index) => {
                    const collapseId = `collapseHistoryItem_${ticketId}_${index}`;
                    const headingId = `headingHistoryItem_${ticketId}_${index}`;

                    const isLatest = index === 0;
                    const isExpanded = false;

                    const prevItem = response.history[index + 1] || {};

                    // -- CORRECCIÓN PARA ESPACIOS EN BLANCO Y ESPACIOS DE NO SEPARACIÓN --
                    // Reemplazamos todos los caracteres de espacio en blanco, incluyendo los de no separación,
                    // con un espacio normal, y luego usamos trim() para asegurar una comparación precisa.
                    const cleanString = (str) => str ? str.replace(/\s/g, ' ').trim() : null;

                    const itemAccion = cleanString(item.name_accion_ticket);
                    const prevAccion = cleanString(prevItem.name_accion_ticket);
                    const accionChanged = prevAccion && itemAccion !== prevAccion;

                    const itemTecnico = cleanString(item.full_name_tecnico_n2_history);
                    const prevTecnico = cleanString(prevItem.full_name_tecnico_n2_history);
                    const tecnicoChanged = prevTecnico && itemTecnico !== prevTecnico;

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

                    const showComponents = itemAccion === 'Actualización de Componentes' && itemComponents;

                    let headerStyle = isLatest ? "background-color: #ffc107;" : "background-color: #5d9cec;";
                    let textColor = isLatest ? "color: #343a40;" : "color: #ffffff;";
                    const statusHeaderText = ` (${item.name_status_ticket || "Desconocido"})`;

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
                                                    <th class="text-start">Operador de Gestión:</th>
                                                    <td>${item.full_name_tecnico_gestion || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td>${item.full_name_coordinador || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Tecnico Asignado:</th>
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
                                                ${showComponents ? `
                                                    <tr>
                                                        <th class="text-start">Componentes Asociados:</th>
                                                        <td class="${componentsChanged ? "highlighted-change" : ""}">${item.components_list}</td>
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
                // Si la respuesta es exitosa pero no hay historial, muestra este mensaje.
                historyPanel.html('<p class="text-center text-muted">No hay historial disponible para este ticket.</p>');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Revisa la consola para obtener detalles sobre por qué falló la llamada AJAX.
            console.error("Error completo de AJAX:", {
                jqXHR: jqXHR,
                textStatus: textStatus,
                errorThrown: errorThrown,
            });
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
        },
    });
}