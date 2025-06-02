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
                   return `<button type="button" class="btn btn-info btn-sm upload-document-btn"
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

// Después de inicializar tu DataTable
$(document).ready(function() {
    // 1. Declaración de referencias a elementos del DOM usando jQuery
    // Deben estar declaradas al inicio de $(document).ready para que sean accesibles en todo el bloque.
    const $uploadDocumentModalElement = $('#uploadDocumentModal'); // <-- Este es el modal DIV
    const $modalTicketIdSpan = $('#modalTicketId');
    const $documentFileInput = $('#documentFile');
    const $imagePreview = $('#imagePreview');
    const $uploadFileBtn = $('#uploadFileBtn'); // <-- Este es el botón "Subir" dentro del modal
    const $uploadMessage = $('#uploadMessage');

    // Asegúrate de que ENDPOINT_BASE y APP_PATH estén definidos globalmente en el HTML
    // Si no, podrías definirlas aquí directamente si conoces las rutas estáticas:
    // const ENDPOINT_BASE = '/';
    // const APP_PATH = 'app/';

    // Función para mostrar mensajes
    function showMessage(message, type) {
        // Asegúrate de que el elemento existe antes de manipularlo
        if ($uploadMessage.length) {
            $uploadMessage.text(message);
            $uploadMessage.removeClass().addClass(`message-box mt-2 p-2 rounded text-sm ${type === 'success' ? 'bg-green-100 text-green-700' : type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`);
            $uploadMessage.show(); // Asegúrate de que el mensaje sea visible
        }
    }

    // 2. Comprobar si el elemento del modal existe antes de crear la instancia
    // Esta instancia del modal debe crearse UNA VEZ, fuera del listener de clic,
    // pero dentro del $(document).ready
    let uploadDocumentModalInstance; // Declara la variable para la instancia del modal

    if ($uploadDocumentModalElement.length) {
        uploadDocumentModalInstance = new bootstrap.Modal($uploadDocumentModalElement[0]); // Crea la instancia de Bootstrap Modal
    }

    // 3. Listener para el clic en los botones "Subir Documento" en la tabla
    // Usamos delegación de eventos con $(document).on('click', ...)
    // para los botones generados dinámicamente por DataTables.
    $(document).on('click', '.upload-document-btn', function () {
        // Verifica si la instancia del modal se creó correctamente
        if (uploadDocumentModalInstance) {
            const idTicket = $(this).data('id-ticket'); // Obtiene data-id-ticket del botón clicado

            // Rellena el modal con los datos del ticket
            if ($modalTicketIdSpan.length) $modalTicketIdSpan.text(idTicket);

            // Limpia campos del modal
            if ($documentFileInput.length) $documentFileInput.val('');
            if ($imagePreview.length) {
                $imagePreview.hide();
                $imagePreview.attr('src', '#'); // Limpiar src de la imagen
            }
            if ($uploadMessage.length) {
                $uploadMessage.text('');
                $uploadMessage.hide(); // Ocultar mensaje
            }

            // ABRIR EL MODAL EXPLICITAMENTE
            uploadDocumentModalInstance.show();
        } else {
            console.error("Error: Instancia de modal 'uploadDocumentModal' no encontrada. Asegúrate de que el elemento HTML del modal existe y Bootstrap JS está cargado.");
        }
    });


    // 4. Previsualización de la imagen seleccionada (ya estaba bien estructurado)
    if ($documentFileInput.length) {
        $documentFileInput.on('change', function() {
            const file = this.files[0];

            if (file) {
                if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (file.type.startsWith('image/')) {
                            $imagePreview.attr('src', e.target.result);
                            $imagePreview.show();
                        } else {
                            $imagePreview.hide();
                            $imagePreview.attr('src', '#');
                            showMessage('Archivo PDF seleccionado. No se muestra previsualización.', 'info');
                        }
                    };
                    reader.readAsDataURL(file);
                    $uploadMessage.hide(); // Limpiar mensajes si el archivo es válido
                } else {
                    $documentFileInput.val('');
                    $imagePreview.attr('src', '#');
                    showMessage('Tipo de archivo no permitido. Solo imágenes (JPG, PNG, GIF) o PDF.', 'error');
                }
            } else {
                $imagePreview.hide();
                $imagePreview.attr('src', '#');
                $uploadMessage.hide();
            }
        });
    }

    // 5. Evento para el botón de subir archivo (dentro del modal)
    if ($uploadFileBtn.length) {
        $uploadFileBtn.on('click', async function() {
            const file = $documentFileInput[0].files[0];
            const idTicket = $modalTicketIdSpan.text();

            if (!file) {
                showMessage('Por favor, seleccione un archivo para subir.', 'error');
                return;
            }

            showMessage('Subiendo documento...', 'info');

            const formData = new FormData();
            formData.append('ticket_id', idTicket);
            formData.append('document_file', file);
            // *** AÑADIR EL MIME TYPE DEL ARCHIVO AL formData ***
            formData.append('mime_type', file.type);
            formData.append('action', 'uploadDocument'); // Ya estaba aquí, pero se mantiene para la claridad

            try {
                const uploadUrl = `${ENDPOINT_BASE}${APP_PATH}api/reportes/uploadDocument`;
                
                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showMessage('Documento subido exitosamente!', 'success');
                    if (uploadDocumentModalInstance) { // Usar la instancia creada previamente
                        uploadDocumentModalInstance.hide();
                    }
                    // Opcional: $('#tuTablaID').DataTable().ajax.reload();
                } else {
                    showMessage(`Error al subir documento: ${result.message || 'Error desconocido.'}`, 'error');
                }
            } catch (error) {
                console.error('Error en la subida:', error);
                showMessage('Error de conexión al subir el documento.', 'error');
            }
        });
    }

    // 6. Evento que se dispara cuando el modal se ha ocultado completamente
    if ($uploadDocumentModalElement.length) {
        $uploadDocumentModalElement.on('hidden.bs.modal', function() {
            // Limpiar todo después de que el modal se oculta
            if ($modalTicketIdSpan.length) $modalTicketIdSpan.text('');
            if ($documentFileInput.length) $documentFileInput.val('');
            if ($imagePreview.length) {
                $imagePreview.hide();
                $imagePreview.attr('src', '#');
            }
            if ($uploadMessage.length) {
                $uploadMessage.text('');
                $uploadMessage.hide();
            }
        });
    }
}); // Cierre correcto de $(document).ready