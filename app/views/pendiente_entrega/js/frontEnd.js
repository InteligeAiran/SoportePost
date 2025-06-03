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
    full_name_tecnico1: "Nombre Técnico 1",
    create_ticket: "Fecha Creacion",
    serial_pos: "Serial POS",
    rif: "RIF",
    name_failure: "Falla",
    id_level_failure: "Nivel Falla",
    full_name_coord: "Nombre Coordinador",
    fecha_envio_coordinador: "Fecha Envío Coordinador",
    name_status_payment: "Estatus Pago",
    full_name_tecnico2: "Nombre Técnico 2",
    fecha_assignado_al_tecnico2: "Fecha Asignado al Técnico 2",
    envio_a_taller: "Envío a Taller",
    fecha_envio_a_taller: "Fecha Envío a Taller",
    name_process_ticket: "Proceso Ticket",
    status_taller: "Estatus Taller",
    name_accion_ticket: "Acción Ticket",
    fecha_carga_llaves: "Fecha Carga Llaves",
    verificacion_de_solvencia: "Verificacion de Solvencia",
    name_status_domiciliacion: "Estatus Domiciliación",
    name_status_ticket: "Estatus Ticket",
    fecha_carga_llaves: "Fecha Carga Llaves",
    fecha_envio_destino: "Fecha Envio a Destino",
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
                      case "Enviado a taller":
                        statusColor = "#2196F3"; // Azul
                        break;
                      case "actualizacion de cifrado":
                        statusColor = "#FF9800"; // Naranja
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
                columnsConfig.push(columnDef);
              }
            }

            // Añadir la columna "Acciones" al final
            columnsConfig.push({
              data: null, // Esta columna no mapea directamente a un campo de datos
              title: "Acciones",
              orderable: false,
              searchable: false,
              width: "8%",
              render: function (data, type, row) {
                const idTicket = row.id_ticket;
                const currentStatusLab = row.name_status_lab; // Estatus del taller (e.g., 'Reparado', 'Irreparable')
                const currentAccionTicket = row.name_accion_ticket; // Estatus de la acción del ticket (e.g., 'Llaves Cargadas')
                const verificaSolvencia = row.verificacion_de_solvencia; // Estatus de la verificación de solvencia (e.g., 'Si', 'No')

                // "cuando el status de name_accion_ticket sea: Llaves Cargadas me tiene que aparecer un boton para subir una imagen"
                if (
                  (currentAccionTicket === "Llaves Cargadas",
                  currentStatusLab === "Reparado",
                  verificaSolvencia === "Verificado")
                ) {
                  return `<button type="button" id= "openModalButton" class="btn btn-info btn-sm upload-document-btn"
                        data-id-ticket="${idTicket}"
                        data-bs-toggle="modal"
                        data-bs-target="#uploadDocumentModal">
                        Subir Documento
                    </button>`;
                } else {
                  // Si el estatus del laboratorio es "Reparado" o "Irreparable"
                  // y no es "Llaves Cargadas", muestra el botón "Cerrado"
                  return `<button type="button" class="btn btn-secondary btn-sm disabled">Falta Requisitos</button>`;
                }
              },
            });

            columnsConfig.push({
              data: null, // Esta columna no mapea directamente a un campo de datos
              title: "Imagen",
              orderable: false,
              searchable: false,
              width: "8%",
              render: function (data, type, row) {
                const idTicket = row.id_ticket;

                // "cuando el status de name_accion_ticket sea: Llaves Cargadas me tiene que aparecer un boton para subir una imagen"
                if (idTicket) {
                  return `<button type="button" id="viewimage" class="btn btn-success btn-sm See_imagen"
                        data-id-ticket="${idTicket}"
                        data-bs-toggle="modal"
                        data-bs-target="#viewDocumentModal"> Ver Imagen
                    </button>`;
                } else {
                  // Si el estatus del laboratorio es "Reparado" o "Irreparable"
                  // y no es "Llaves Cargadas", muestra el botón "Cerrado"
                  return `<button type="button" class="btn btn-secondary btn-sm disabled">No hay imagen</button>`;
                }
              },
            });

            // === ADD "CARGA DE LLAVE" COLUMN FIRST ===
            // It's a calculated column, so its data source is `null`

            // Initialize DataTables
            const dataTable = $(tableElement).DataTable({
              responsive: true,
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
                lengthMenu: "Mostrar _MENU_ registros",
                emptyTable: "No hay datos disponibles en la tabla",
                zeroRecords: "No se encontraron resultados para la búsqueda",
                info: "Mostrando página _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
                infoEmpty: "No hay datos disponibles",
                infoFiltered: "(Filtrado de _MAX_ datos disponibles)",
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
