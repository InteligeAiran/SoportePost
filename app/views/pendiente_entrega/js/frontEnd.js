document.addEventListener("DOMContentLoaded", function () {
    // --- Referencias a elementos estáticos del DOM (que siempre están presentes al cargar la página) ---
    // Modal para Subir Documento
    const modalElementUpload = document.getElementById("uploadDocumentModal");
    const cerrarBotonUpload = document.getElementById("CerrarBoton"); // Botón 'Cerrar' del modal de subida
    const iconoCerrarUpload = document.getElementById("icon-close"); // Icono 'x' del modal de subida
    const inputFile = document.getElementById("documentFile");
    const modalTicketIdSpanUpload = modalElementUpload ? modalElementUpload.querySelector("#modalTicketId") : null; // Encuentra el span dentro de su modal

    // Modal para Visualizar Documento
    const modalElementView = document.getElementById("viewDocumentModal");
    const cerrarBotonView = document.getElementById("modalCerrarshow"); // Botón 'Cerrar' del modal de visualización
    const iconoCerrarView = document.getElementById("btn-close"); // Icono 'x' del modal de visualización
    const modalTicketIdSpanView = modalElementView ? modalElementView.querySelector("#viewModalTicketId") : null; // Encuentra el span dentro de su modal

    // Instancias de Modales de Bootstrap (si usas Bootstrap JS para controlarlos)
    let bsUploadModal = null;
    let bsViewModal = null;

    if (modalElementUpload) {
        bsUploadModal = new bootstrap.Modal(modalElementUpload, { keyboard: true }); // Habilita cierre con ESC
    }
    if (modalElementView) {
        bsViewModal = new bootstrap.Modal(modalElementView, { keyboard: true }); // Habilita cierre con ESC
    }

    // Variable para almacenar el ID del ticket
    let currentTicketId = null;

    // --- Funciones para abrir/cerrar modales (Usando Bootstrap JS si es posible, o tu manual) ---
    // Si estás utilizando data-bs-toggle="modal", estas funciones solo necesitarían actualizar el contenido
    // y luego llamar a bsUploadModal.show() / bsUploadModal.hide().

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
    function showViewModal(ticketId, imageUrl, pdfUrl) {
        currentTicketId = ticketId; // Guarda el ID del ticket
        if (modalTicketIdSpanView) {
            modalTicketIdSpanView.textContent = currentTicketId;
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
            const documentUrl = openViewBtn.dataset.urlDocument; // Asegúrate de que este atributo exista en tu botón dinámico
            const documentType = openViewBtn.dataset.documentType; // 'image' o 'pdf'

            if (documentType === 'image') {
                showViewModal(idTicket, documentUrl, null);
            } else if (documentType === 'pdf') {
                showViewModal(idTicket, null, documentUrl);
            } else {
                console.warn("Tipo de documento no especificado para la visualización.");
                showViewModal(idTicket, null, null); // Abre el modal sin contenido
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

    // --- Lógica para el botón de "Subir" (uploadFileBtn) ---
    const uploadFileButton = document.getElementById("uploadFileBtn");
    if (uploadFileButton) {
        uploadFileButton.addEventListener('click', function() {
            const file = inputFile.files[0];
            if (file && currentTicketId) {
                const formData = new FormData();
                formData.append('document', file);
                formData.append('ticketId', currentTicketId);

                // Aquí iría tu llamada AJAX para subir el archivo
                // Ejemplo con fetch API:
                fetch('/api/upload-document', { // Reemplaza con tu endpoint real
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    const uploadMessage = document.getElementById("uploadMessage");
                    if (data.success) {
                        uploadMessage.textContent = "Documento subido exitosamente.";
                        uploadMessage.classList.remove("hidden");
                        uploadMessage.style.color = "green";
                        // Puedes cerrar el modal o recargar la tabla después de un éxito
                        // setTimeout(closeUploadModalAndClean, 2000);
                        // Recargar DataTables si es necesario
                        // $('#myDataTable').DataTable().ajax.reload();
                    } else {
                        uploadMessage.textContent = "Error al subir documento: " + (data.message || "Error desconocido.");
                        uploadMessage.classList.remove("hidden");
                        uploadMessage.style.color = "red";
                    }
                })
                .catch(error => {
                    console.error('Error en la subida:', error);
                    const uploadMessage = document.getElementById("uploadMessage");
                    uploadMessage.textContent = "Error de red o servidor.";
                    uploadMessage.classList.remove("hidden");
                    uploadMessage.style.color = "red";
                });
            } else {
                alert("Por favor, selecciona un archivo y asegúrate de que el ID del ticket esté disponible.");
            }
        });
    }
});

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
    id_ticket: "ID Ticket",
    nro_ticket: "Nro Ticket",
    full_name_tecnico: "Técnico Gestión", // CORREGIDO
    create_ticket: "Fecha Creación",
    serial_pos: "Serial POS",
    rif: "Rif",
    name_failure: "Falla",
    // id_level_failure: "Nivel Falla", // ELIMINADO
    full_name_coordinador: "Coordinador", // CORREGIDO
    // fecha_envio_coordinador: "Fecha Envío Coordinador", // ELIMINADO
    fecha_envio_a_taller: "Fecha Envío a Taller",
    name_status_ticket: "Estatus Ticket",
    name_process_ticket: "Proceso Ticket",
    name_status_payment: "Estatus Pago",
    name_status_lab: "Estatus Taller", // CORREGIDO
    name_accion_ticket: "Acción Ticket",
    full_name_tecnicoassignado: "Técnico 2", // CORREGIDO
    // fecha_assignado_al_tecnico2: "Fecha Asignado al Técnico 2", // ELIMINADO
    // envio_a_taller: "Envío a Taller", // ELIMINADO
    date_send_torosal_fromlab: "Fecha Envío Torosal Lab", // CORREGIDO
    date_sendkey: "Fecha de Llaves Enviadas", // CORREGIDO
    date_receivekey: "Fecha Carga Llaves", // CORREGIDO
    date_receivefrom_desti: "Fecha Envío a Destino", // CORREGIDO
    confirmreceive: "Confirmar Recibido", // AÑADIDO
    fecha_instalacion: "Fecha Instalación", // Añadido
    estatus_inteliservices: "Estatus Inteliservices", // Añadido
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
                if (key === "name_status_ticket") {
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
                }
                // ************* APLICAR LÓGICA DE TRUNCADO A FALLA *************
                if (key === "name_failure") {
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
                    const name_status_payment = row.name_status_payment;
                    const currentStatusLab = row.name_status_lab; // CORREGIDO: Usar name_status_lab de SQL
                    const verificacionDeLlaves = row.confirmreceive; // CORREGIDO: Usar confirmreceive de SQL
                    const accionllaves = row.name_accion_ticket;

                    // Lógica para mostrar el checkbox de carga de llaves o el botón de "Subir Documento"
                    if (verificacionDeLlaves === true || verificacionDeLlaves === 't') { // Si ya está confirmado (llaves cargadas)
                        if (accionllaves !== "Llaves Cargadas") {
                            // Esto debería ser el caso si confirmreceive es true pero accionllaves no lo refleja
                            return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}" 
                                    title="Confirmar Carga De llaves">`;
                        } else {
                            return `<button type="button" class="btn btn-success btn-sm" disabled>Llaves Cargadas</button>`;
                        }
                    } else if ((name_status_payment === "Pendiente Por Cargar Documentos" || name_status_payment === "Pendiente Por Cargar Documento(Pago anticipo o Exoneracion)" || name_status_payment === "Pendiente Por Cargar Documento(PDF Envio ZOOM)") && currentStatusLab === "Reparado") {
                        return `<button type="button" id="openModalButton" class="btn btn-info btn-sm upload-document-btn"
                                    data-id-ticket="${idTicket}"
                                    data-bs-toggle="modal"
                                    data-bs-target="#uploadDocumentModal">
                                    Subir Documento
                                </button>`;
                    } else {
                        return `<button type="button" class="btn btn-secondary btn-sm disabled">Falta Requisitos</button>`;
                    }
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
                    const verificacionDeLlaves = row.confirmreceive; // CORREGIDO: Usar confirmreceive
                    const accionllaves = row.name_accion_ticket;
                    const fechaLlavesEnviada = row.date_sendkey; // CORREGIDO: Usar date_sendkey
                    const fechaCargaLlaves = row.date_receivekey; // CORREGIDO: Usar date_receivekey

                    // Lógica para el checkbox "Cargar Llave"
                    // shouldShowLoadKeyCheckbox ahora se basa en 'confirmreceive'
                    const shouldShowLoadKeyCheckbox = !(verificacionDeLlaves === true || verificacionDeLlaves === 't'); // Si NO están confirmadas
                    if (shouldShowLoadKeyCheckbox) {
                        if (accionllaves !== "Llaves Cargadas") {
                            return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}" 
                                    title="Confirmar Carga De llaves">`;
                        } else if (fechaLlavesEnviada !== null && fechaCargaLlaves === null) { // Llaves Enviadas pero no Cargadas
                            return `<button type="button" class="btn btn-success btn-sm" disabled>En espera de Confirmar Carga de llaves</button>`;
                        } else {
                            // Este else captura casos donde shouldShowLoadKeyCheckbox es true, pero las condiciones internas no se cumplen.
                            // Podría ser un estado intermedio o no esperado.
                            return `<button type="button" class="btn btn-secondary btn-sm disabled">Estado de Llaves No Definido</button>`;
                        }
                    } else {
                        // Esto se ejecuta si verificacionDeLlaves es TRUE o 't' (llaves ya cargadas/verificadas)
                        return `<input type="checkbox" class="receive-key-checkbox" 
                                data-id-ticket="${idTicket}" 
                                data-nro-ticket="${row.nro_ticket}" 
                                title="Llaves Cargadas" 
                                checked disabled>`; // Marcado y deshabilitado
                    }
                },
            });

            // Añadir la columna "Imagen"
            columnsConfig.push({
                data: null,
                title: "Imagen",
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
                                data-bs-target="#viewDocumentModal"> Ver Imagen
                            </button>`;
                    } else {
                        // Si el estatus no es "Llaves Cargadas", muestra "No hay imagen"
                        return `<button type="button" class="btn btn-secondary btn-sm disabled">No hay imagen</button>`;
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

           // ************* INICIO: LÓGICA PARA EL CHECKBOX "CARGAR LLAVE" *************
           $("#tabla-ticket tbody")
                .off("change", ".receive-key-checkbox") // <--- Usamos 'change' para checkboxes
                .on("change", ".receive-key-checkbox", function (e) {
                    e.stopPropagation(); // Evita propagación del evento

                    const ticketId = $(this).data("id-ticket");
                    const nroTicket = $(this).data("nro-ticket");
                    const isChecked = $(this).is(":checked"); // Verifica si el checkbox está marcado

                    // Solo actuamos si el checkbox ha sido marcado
                    if (isChecked) {
                        Swal.fire({
                            icon: "question",
                            title: "¿Confirmar Carga de Llaves?",
                            text: `¿Desea marcar el Ticket Nro: ${nroTicket} como "Llaves Cargadas". Esta acción registrará la fecha de la carga de llaves?`,
                            confirmButtonText: "Sí, Confirmar",
                            color: "black",
                            confirmButtonColor: "#003594",
                            cancelButtonText: "No, cancelar",
                            showCancelButton: true,
                            focusConfirm: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showCloseButton: true,
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
            // ************* FIN: LÓGICA PARA EL CHECKBOX "CARGAR LLAVE" *************

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
            // === END CLICK EVENT LISTENER ===

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

document.addEventListener("DOMContentLoaded", function () {
  // Obtén las referencias a los elementos del DOM que SÍ ESTÁN PRESENTES AL CARGAR LA PÁGINA
  const cerrarBoton = document.getElementById("CerrarBoton");
  const iconoCerrar = document.getElementById("icon-close");
  const inputFile = document.getElementById("documentFile");
  const modalElement = document.getElementById("uploadDocumentModal");
  const modalTicketIdSpan = document.getElementById("modalTicketId");

    document.addEventListener("click", function (event) {
        // Verifica si el elemento que fue clickeado (o su ancestro) tiene el ID 'openModalButton'
        // Puedes usar event.target o event.closest()
        const clickedButton = event.target.closest("#openModalButton");

        if (clickedButton) {
            // Se hizo clic en un botón con el ID 'openModalButton'
            event.preventDefault(); // Opcional: evita el comportamiento por defecto si es necesario

            const idTicket = clickedButton.dataset.idTicket; // Accede al data-id-ticket

            if (modalTicketIdSpan) {
                modalTicketIdSpan.textContent = idTicket;
            }

            // Si el modal no se abre automáticamente con data-bs-toggle, puedes hacerlo manualmente:
            const uploadDocumentModal = new bootstrap.Modal(modalElement);
            uploadDocumentModal.show();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {


  document.addEventListener("click", function (event) {
    // Verifica si el elemento que fue clickeado (o su ancestro) tiene el ID 'openModalButton'
    // Puedes usar event.target o event.closest()
    const clickedButton = event.target.closest("#viewimage");

    if (clickedButton) {
      // Se hizo clic en un botón con el ID 'openModalButton'
      event.preventDefault(); // Opcional: evita el comportamiento por defecto si es necesario

      const idTicket = clickedButton.dataset.idTicket; // Accede al data-id-ticket

      if (modalTicketIdSpan) {
        modalTicketIdSpan.textContent = idTicket;
      }

      // Si el modal no se abre automáticamente con data-bs-toggle, puedes hacerlo manualmente:
      const viewDocumentModal1 = new bootstrap.Modal(modalElement1);
      viewDocumentModal1.show();
    }
  });
});

$(document).ready(function () {
  // 1. Declaración de referencias a elementos del DOM usando jQuery
  // Deben estar declaradas al inicio de $(document).ready para que sean accesibles en todo el bloque.
  const $uploadDocumentModalElement = $("#uploadDocumentModal"); // <-- Este es el modal DIV
  const $modalTicketIdSpan = $("#modalTicketId");
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

      try {
        const uploadUrl = `${ENDPOINT_BASE}${APP_PATH}api/reportes/uploadDocument`;

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showMessage("Documento subido exitosamente!", "success");
          if (uploadDocumentModalInstance) {
            // Usar la instancia creada previamente
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
  // Instancia el modal de Bootstrap una vez que el DOM esté cargado
  const viewDocumentBootstrapModal = new bootstrap.Modal(
    viewDocumentModalElement
  );

  const viewModalTicketIdSpan = document.getElementById("viewModalTicketId");
  const imageViewPreview = document.getElementById("imageViewPreview");
  const pdfViewViewer = document.getElementById("pdfViewViewer");
  const viewDocumentMessage = document.getElementById("viewDocumentMessage"); // Para mensajes de carga/error en el modal de vista

  // --- ¡CORRECCIÓN CRÍTICA! Define tus constantes de ruta aquí ---
  // Asegúrate de que `APP` esté definida en tu PHP y se imprima correctamente aquí.
  // Ejemplo: Si tu APP es "http://localhost/tu_proyecto/"
  const ENDPOINT_ROOT = `${ENDPOINT_BASE}`; // Ejemplo: 'http://localhost'
  const APP_RELATIVE_PATH = `${APP_PATH}`; // Ejemplo: '/SoportePost/'

  // La URL base completa para tu aplicación
  const ENDPOINT_BASE1 = ENDPOINT_ROOT + APP_RELATIVE_PATH; // Esto resultará en 'http://localhost/SoportePost/'

  const API_DOCUMENTS_PATH = "api/reportes/"; // La ruta dentro de tu APP donde está tu controlador PHP de API
  // --- FIN DE LA CORRECCIÓN CRÍTICA ---

  // --- Función auxiliar para mostrar el documento en el MODAL DE VISUALIZACIÓN ---
  function displayDocumentInViewModal(filePath, mimeType) {
    imageViewPreview.style.display = "none";
    pdfViewViewer.style.display = "none";
    viewDocumentMessage.classList.add("hidden");

    // CONSTRUYE LA URL COMPLETA DE LA IMAGEN/PDF
    // Ahora `ENDPOINT_BASE` está definida y podemos usarla.
    // Asegúrate de que `ENDPOINT_BASE` termine con una barra '/' y que `filePath` empiece con una.
    // Si `filePath` ya tiene una barra al inicio, `replace(/^\//, '')` la quita para evitar '//'.
    const fullFilePath = ENDPOINT_BASE1 + filePath.replace(/^\//, "");

    // Puedes agregar un console.log aquí para depurar y ver la URL completa que se está generando
    if (mimeType.startsWith("image/")) {
      imageViewPreview.src = fullFilePath; // Usa la URL completa
      imageViewPreview.style.display = "block";
    } else if (mimeType === "application/pdf") {
      pdfViewViewer.innerHTML = `<embed src="${fullFilePath}" type="application/pdf" width="100%" height="100%">`; // Usa la URL completa
      pdfViewViewer.style.display = "block";
    } else {
      viewDocumentMessage.classList.remove("hidden", "success");
      viewDocumentMessage.classList.add("error");
      viewDocumentMessage.textContent =
        "Tipo de archivo no soportado para previsualización directa.";
    }
  }

  // --- Listener para el evento 'click' en el botón 'Ver Imagen' ---
  document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("See_imagen")) {
      const button = event.target;
      const idTicket = button.getAttribute("data-id-ticket");

      // Mostrar el modal programáticamente
      viewDocumentBootstrapModal.show();

      // 1. Limpiar y preparar el modal de visualización
      viewModalTicketIdSpan.textContent = idTicket;
      imageViewPreview.src = "#";
      imageViewPreview.style.display = "none";
      pdfViewViewer.innerHTML = "";
      pdfViewViewer.style.display = "none";
      viewDocumentMessage.classList.add("hidden");
      viewDocumentMessage.textContent = "";

      // 2. Mostrar un mensaje de carga
      viewDocumentMessage.classList.remove("hidden", "success", "error");
      viewDocumentMessage.textContent = "Cargando documento...";
      viewDocumentMessage.classList.add("info");

      // 3. Preparar los datos a enviar al backend
      const formData = new FormData();
      formData.append("ticket_id", idTicket); // ¡Asegúrate que coincida con tu API!
      formData.append("action", "getDocument");

      // 4. Construir la URL de la API correctamente
      // ¡CORRECCIÓN AQUÍ! Usa las constantes definidas al inicio.
      const getDocumentUrl = `${ENDPOINT_BASE1}${API_DOCUMENTS_PATH}getDocument`;
      console.log(`URL de la API para obtener documento: ${getDocumentUrl}`);

      // 5. Realizar la petición HTTP POST
      fetch(getDocumentUrl, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            // Si la respuesta no es OK, intenta leer el texto para un mejor depurado
            return response.text().then((text) => {
              throw new Error(
                "Error de red al cargar documento. Respuesta del servidor: " +
                  text
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Datos recibidos de la API:", data); // Para depurar la respuesta completa
          if (data.success && data.document && data.document.row) {
            // Accede a `data.document.row`
            const documentPath = data.document.row.file_path; // <--- ¡CORRECCIÓN! Acceder a `row.file_path`
            const mimeType = data.document.row.mime_type; // <--- ¡CORRECCIÓN! Acceder a `row.mime_type`
            displayDocumentInViewModal(documentPath, mimeType);
            viewDocumentMessage.style.display = "none";
          } else {
            viewDocumentMessage.classList.remove("hidden", "success");
            viewDocumentMessage.classList.add("error");
            viewDocumentMessage.textContent =
              data.message ||
              "No se encontró ningún documento para este ticket o el formato de respuesta es incorrecto.";
          }
        })
        .catch((error) => {
          console.error("Error en la petición Fetch:", error); // Muestra el error completo en la consola
          viewDocumentMessage.classList.remove("hidden", "success");
          viewDocumentMessage.classList.add("error");
          viewDocumentMessage.textContent =
            "Error al cargar el documento: " + error.message;
        });
    }
  });
});

function formatTicketDetailsPanel(d) {
  // d es el objeto `data` completo del ticket

  const initialImageUrl = "assets/img/loading-placeholder.png"; // Asegúrate de tener esta imagen
  const initialImageAlt = "Cargando imagen del dispositivo...";

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
                            ${d.fecha_instalacion}
                        </div>
                        <div class="col-sm-6 mb-2">
                             <br><strong><div>Creación ticket:</div></strong>
                            ${d.create_ticket}
                        </div>
                        <div class="col-sm-6 mb-2">
                             <br><strong><div>Usuario Gestión:</div></strong>
                            ${d.full_name_tecnico}
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-12">
                    <div class="row">
                        <div class="col-sm-4 mb-2">
                            <strong><div>Acción:</div></strong>
                            <span class = "Accion-ticket">${d.name_accion_ticket}</span>
                        </div>
                         <div class="col-sm-8 mb-2" style = "margin-left: -7%;">
                          <strong><div>Falla Reportada:</div></strong>
                          <span class="falla-reportada-texto">${d.name_failure}</span>
                        </div>
                        <div class="col-sm-8 mb-2">
                             <br><strong><div>Estatus Ticket:</div></strong>
                            ${d.name_status_ticket}
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
    // 1. Obtener el contenedor del historial y mostrar mensaje de carga (usando jQuery)
    const historyPanel = $("#ticket-history-content");
    historyPanel.html(
        '<p class="text-center text-muted">Cargando historial...</p>'
    ); // Usar .html() de jQuery

    // 2. Crear y configurar la solicitud AJAX (usando jQuery.ajax)
    $.ajax({
        url: `${ENDPOINT_BASE}${APP_PATH}api/historical/GetTicketHistory1`,
        type: "POST",
        data: {
            // jQuery formatea esto automáticamente a 'application/x-www-form-urlencoded'
            action: "GetTicketHistory",
            id_ticket: ticketId,
        },
        dataType: "json", // Le decimos a jQuery que esperamos una respuesta JSON
        success: function (response) {
            // Verificar si la respuesta es exitosa y contiene historial
            if (response.success && response.history && response.history.length > 0) {
                let historyHtml = '<div class="accordion" id="ticketHistoryAccordion">'; // Contenedor del acordeón

                // Iterar sobre cada item del historial para construir el HTML
                response.history.forEach((item, index) => {
                    const collapseId = `collapseHistoryItem_${ticketId}_${index}`;
                    const headingId = `headingHistoryItem_${ticketId}_${index}`;

                    let statusHeaderClass = "";
                    let statusHeaderText = "";

                    // **Colores por defecto si no hay coincidencia o si el estado es nulo/vacío**
                    let headerStyle = "background-color: #212529;"; // Gris oscuro (cambiado de "Gris claro" a #212529 para contrastar)
                    let textColor = "color: #212529;"; // Texto oscuro 
                    statusHeaderText = ""; // Sin texto extra por defecto

                    if (item.name_status_ticket) {
                        const statusLower = item.name_status_ticket.toLowerCase();
                        if (statusLower.includes("abierto")) {
                            headerStyle = "background-color: #5d9cec;"; // Azul claro/celeste
                            textColor = "color: #ffffff;"; // Texto blanco
                            statusHeaderText = " (Abierto)";
                        } else if (
                            statusLower.includes("cerrado") ||
                            statusLower.includes("resuelto")
                        ) {
                            headerStyle = "background-color: #28a745;"; // Verde
                            textColor = "color: #ffffff;"; // Texto blanco
                            statusHeaderText = " (Cerrado)";
                        } else if (
                            statusLower.includes("pendiente") ||
                            statusLower.includes("en proceso")
                        ) {
                            headerStyle = "background-color: #ffc107;"; // Amarillo
                            textColor = "color: #343a40;"; // Texto oscuro
                            statusHeaderText = " (En Proceso)";
                        } else if (
                            statusLower.includes("cancelado") ||
                            statusLower.includes("rechazado")
                        ) {
                            headerStyle = "background-color: #dc3545;"; // Rojo
                            textColor = "color: #ffffff;"; // Texto blanco
                            statusHeaderText = " (Cancelado)";
                        } else if (statusLower.includes("espera")) {
                            headerStyle = "background-color: #6c757d;"; // Gris
                            textColor = "color: #ffffff;"; // Texto blanco
                            statusHeaderText = " (En Espera)";
                        }
                    }

                    // Esta lógica sobrescribe el color y texto de la última gestión (index === 0)
                    if (index === 0) {
                        // Es la última gestión (la "actual")
                        headerStyle = "background-color: #ffc107;"; // Amarillo
                        textColor = "color: #343a40;"; // Texto oscuro
                        statusHeaderText = ` (${item.name_status_ticket || "Desconocido"})`; // Agrega el estatus actual o 'Desconocido' si no existe. 
                    } else {
                        // Son gestiones pasadas
                        headerStyle = "background-color: #5d9cec;"; // Azul claro/celeste
                        textColor = "color: #ffffff;"; // Texto blanco
                        // Se mantiene el statusHeaderText determinado anteriormente, o se deja vacío.
                    }

                    historyHtml += `
                        <div class="card mb-3 custom-history-card"> 
                            <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                        data-toggle="collapse" data-target="#${collapseId}"
                                        aria-expanded="${index === 0 ? "true" : "false"}" 
                                        aria-controls="${collapseId}"
                                        style="${textColor}">
                                        ${item.fecha_de_cambio} - ${item.name_accion_ticket}${statusHeaderText}
                                    </button>
                                </h2>
                            </div>
                            <div id="${collapseId}" class="collapse ${index === 0 ? "show" : ""}"
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
                                                    <td>${item.name_accion_ticket || "N/A"}</td>
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
                                                    <th class="text-start">Estatus Ticket:</th>
                                                    <td>${item.name_status_ticket || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Laboratorio:</th>
                                                    <td>${item.name_status_lab || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Domiciliación:</th>
                                                    <td>${item.name_status_domiciliacion || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start" style="word-wrap: break-word; overflow-wrap: break-word;">Estatus Pago:</th>
                                                    <td>${item.name_status_payment || "N/A"}</td>
                                                </tr>
                                                
                                                ${item.name_status_lab === "Pendiente por repuesto" ? `
                                                    <tr>
                                                        <th class="text-start" style="word-wrap: break-word; overflow-wrap: break-word; font-size: 80%">Fecha Estimada de la Llegada de repuesto:</th>
                                                        <td>${item.new_repuesto_date || "N/A"}</td>
                                                    </tr>
                                                ` : ''}
                                                </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                });

                historyHtml += "</div>"; // Cierre del acordeón principal
                historyPanel.html(historyHtml); // Insertar el HTML generado (con jQuery)

                // Reiniciar tooltips (si usas Bootstrap 4)
                if ($.fn && $.fn.tooltip) {
                    $('[data-toggle="tooltip"]').tooltip("dispose"); 
                    $('[data-toggle="tooltip"]').tooltip(); 
                }
            } else {
                historyPanel.html(
                    '<p class="text-center text-muted">No hay historial disponible para este ticket.</p>'
                );
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            let errorMessage =
                '<p class="text-center text-danger">Error al cargar el historial.</p>';
            if (jqXHR.status === 0) {
                errorMessage =
                    '<p class="text-center text-danger">Error de red: No se pudo conectar al servidor.</p>';
            } else if (jqXHR.status == 404) {
                errorMessage =
                    '<p class="text-center text-danger">Recurso no encontrado. (Error 404)</p>';
            } else if (jqXHR.status == 500) {
                errorMessage =
                    '<p class="text-center text-danger">Error interno del servidor. (Error 500)</p>';
            } else if (textStatus === "parsererror") {
                errorMessage =
                    '<p class="text-center text-danger">Error al procesar la respuesta del servidor (JSON inválido).</p>';
            } else if (textStatus === "timeout") {
                errorMessage =
                    '<p class="text-center text-danger">Tiempo de espera agotado al cargar el historial.</p>';
            } else if (textStatus === "abort") {
                errorMessage =
                    '<p class="text-center text-danger">Solicitud de historial cancelada.</p>';
            }
            historyPanel.html(errorMessage);
            console.error("Error AJAX:", textStatus, errorThrown, jqXHR.responseText);
        },
    });
}
