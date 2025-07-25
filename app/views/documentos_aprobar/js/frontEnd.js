let currentSelectedTicket = null;

function getTicketAprovalDocument() {
    const id_user = document.getElementById("userId").value; // Obtener el ID del usuario

    const xhr = new XMLHttpRequest();
    // Pasa el id_user como parámetro de consulta a tu endpoint
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/tickets-pending-document-approval`);
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
    // Asumiendo que 'viewDocumentsBtn' es un botón fuera de la tabla si lo usas
    const viewDocumentsBtn = document.getElementById("viewDocumentsBtn"); 

    // Actualiza columnTitles con las nuevas columnas
    const columnTitles = {
        id_ticket: "ID Ticket",
        nro_ticket: "Nro Ticket",
        serial_pos: "Serial POS",
        name_status_payment: "Estatus Pago",
    };


    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const TicketData = response.tickets;

                    if (TicketData && TicketData.length > 0) {
                        if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
                            $("#tabla-ticket").DataTable().destroy();
                            if (theadElement) theadElement.innerHTML = "";
                            if (tbodyElement) tbodyElement.innerHTML = "";
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
                                columnsConfig.push(columnDef);
                            }
                        }

                        // --- AÑADIR COLUMNA DE ACCIONES ---
                        columnsConfig.push({
                            data: null, // No se asocia a una columna de datos directa
                            title: "Acciones",
                            orderable: false, // No permitir ordenar por esta columna
                            render: function (data, type, row) {
                                const idTicket = row.id_ticket;
                                return `
                                    <button class="btn btn-info btn-sm view-image-btn" data-id="${idTicket}" data-bs-toggle="modal" data-bs-target="#visualizarImagenModal" title="Visualizar Imágenes">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                        </svg>
                                    </button>
                                `;
                                // El botón de aprobación estará en el modal de visualización de imagen
                            },
                        });
                        // --- FIN DE AÑADIR COLUMNA ---

                        const dataTableInstance = $(tableElement).DataTable({
                            responsive: false,
                            scrollX: "200px",
                            data: TicketData,
                            columns: columnsConfig,
                            pagingType: "simple_numbers",
                            lengthMenu: [5, 10, 25, 50, 100],
                            autoWidth: false,
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
                            },
                        });

                        $("#tabla-ticket tbody")
                            .off("click", "tr") // .off() para prevenir múltiples enlaces si se llama varias veces
                            .on("click", "tr", function (e) {
                                // Asegúrate de que el clic no proviene de una celda de acción (botones, SVG, etc.)
                                if ($(e.target).hasClass('truncated-cell') || $(e.target).hasClass('full-text-cell') || $(e.target).is('button') || $(e.target).is('svg') || $(e.target).is('path') || $(e.target).is('input[type="checkbox"]')) {
                                    return;
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
                                            imgElement.src = '/public/img/consulta_rif/POS/mantainment.png';
                                            imgElement.alt = "Serial no disponible";
                                        }
                                    }

                                    if (viewDocumentsBtn) {
                                        viewDocumentsBtn.style.display = "block";
                                    }

                                } else {
                                    detailsPanel.innerHTML =
                                        "<p>No se encontraron detalles para este ticket.</p>";
                                    if (viewDocumentsBtn) {
                                        viewDocumentsBtn.style.display = "none";
                                    }
                                }
                            });

                        // Evento para el botón "Visualizar Imágenes" en la tabla
                        $("#tabla-ticket tbody").on("click", ".view-image-btn", function () {
                            const ticketId = $(this).data("id");
                            const myModal = new bootstrap.Modal(document.getElementById('visualizarImagenModal'));
                            visualizarImagenModal.setAttribute('data-ticket-id', ticketId); 

                            // Preseleccionar 'Imagen del Envío' por defecto
                            document.getElementById('imagenEnvio').checked = true;
                            document.getElementById('imagenExoneracion').checked = false;
                            document.getElementById('imagenPago').checked = false;

                            myModal.show();                            
                        });

                        if (tableContainer) {
                            tableContainer.style.display = "";
                        }
                    } else {
                        if (tableContainer) {
                            tableContainer.innerHTML = "<p>No hay datos disponibles.</p>";
                            tableContainer.style.display = "";
                        }
                        if (viewDocumentsBtn) {
                            viewDocumentsBtn.style.display = "none";
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
                    console.error("Error desde la API:", response.message);
                    if (viewDocumentsBtn) {
                        viewDocumentsBtn.style.display = "none";
                    }
                }
            } catch (error) {
                if (tableContainer) {
                    tableContainer.innerHTML = "<p>Error al procesar la respuesta.</p>";
                    tableContainer.style.display = "";
                }
                console.error("Error al parsear JSON:", error);
                if (viewDocumentsBtn) {
                    viewDocumentsBtn.style.display = "none";
                }
            }
        } else if (xhr.status === 404) {
            if (tableContainer) {
                tableContainer.innerHTML = "<p>No se encontraron datos.</p>";
                tableContainer.style.display = "";
            }
            if (viewDocumentsBtn) {
                viewDocumentsBtn.style.display = "none";
            }
        } else {
            if (tableContainer) {
                tableContainer.innerHTML = `<p>Error de conexión: ${xhr.status} ${xhr.statusText}</p>`;
                tableContainer.style.display = "";
            }
            console.error("Error:", xhr.status, xhr.statusText);
            if (viewDocumentsBtn) {
                viewDocumentsBtn.style.display = "none";
            }
        }
    };

    xhr.onerror = function () {
        if (tableContainer) {
            tableContainer.innerHTML = "<p>Error de red.</p>";
            tableContainer.style.display = "";
        }
        console.error("Error de red");
        if (viewDocumentsBtn) {
            viewDocumentsBtn.style.display = "none";
        }
    };
    const datos = `action=tickets-pending-document-approval&id_user=${encodeURIComponent(id_user)}`;
    xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getTicketAprovalDocument);


  document.addEventListener('DOMContentLoaded', function () {
      // Definiciones de constantes globales (ajusta estas rutas a tu configuración real)
      const ENDPOINT_BASE = 'http://localhost/'; 
      const APP_PATH = 'SoportePost/'; 

      const visualizarImagenModalElement = document.getElementById('visualizarImagenModal');
      const imageApprovalModalElement = document.getElementById('imageApprovalModal');
      const closeImageApprovalModalBtn = document.getElementById('closeImageApprovalModalBtn');
      const closeImagevisualizarModalBtn = document.getElementById('closeImagevisualizarModalBtn');
      const btnVisualizarImagen = document.getElementById('btnVisualizarImagen');
      
      // Cambiamos 'ticketImagePreview' para que sea un contenedor flexible
      // donde podamos insertar la imagen o el objeto PDF.
      // En tu HTML, asegúrate de que 'ticketImagePreview' sea el <img> tag.
      // Y necesitamos un contenedor padre para el <img> y el <embed>/<object>.
      const ticketImagePreview = document.getElementById('ticketImagePreview'); // El elemento img
      const mediaViewerContainer = document.getElementById('mediaViewerContainer'); // El div contenedor

      const currentTicketIdDisplay = document.getElementById('currentTicketIdDisplay');
      const currentImageTypeDisplay = document.getElementById('currentImageTypeDisplay');
      const approveTicketFromImage = document.getElementById('approveTicketFromImage');

      // Instancias de Bootstrap Modal
      const visualizarImagenModal = new bootstrap.Modal(visualizarImagenModalElement);
      const imageApprovalModal = new bootstrap.Modal(imageApprovalModalElement);

      // Listener para abrir el modal desde los botones de la tabla
      $("#tabla-ticket tbody").on("click", ".view-image-btn", function () {
          const ticketId = $(this).data("id"); 
          visualizarImagenModalElement.setAttribute('data-ticket-id', ticketId); 

          // Preseleccionar 'Imagen del Envío' por defecto
          document.getElementById('imagenEnvio').checked = true;
          document.getElementById('imagenExoneracion').checked = false;
          document.getElementById('imagenPago').checked = false;

          visualizarImagenModal.show(); 
      });


      // Listener para el botón "Visualizar Imagen" dentro del primer modal
      btnVisualizarImagen.addEventListener('click', function() {
          const selectedRadio = document.querySelector('input[name="opcionImagen"]:checked');
          const ticketId = visualizarImagenModalElement.getAttribute('data-ticket-id');

          // Limpiar el contenido previo del visor antes de cargar nuevo contenido
          mediaViewerContainer.innerHTML = ''; 
          ticketImagePreview.style.display = 'none'; // Ocultar la img por defecto

          if (selectedRadio && ticketId) {
              const selectedImageType = selectedRadio.value;
              
              const imageUrlEndpoint = `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetImageToAproval`; 
              const data = `action=GetImageToAproval&ticketId=${ticketId}&imageType=${selectedImageType}`; 

              const xhr = new XMLHttpRequest();
              xhr.open('POST', imageUrlEndpoint, true);
              xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
              xhr.responseType = 'blob'; // Es crucial para recibir el archivo binario

              xhr.onload = function() {
                  if (xhr.status >= 200 && xhr.status < 300) {
                      const response = xhr.response; 
                      
                      if (response instanceof Blob) {
                          const fileType = response.type;
                          const objectUrl = URL.createObjectURL(response);
                          
                          // Guardar el objectUrl para revocarlo más tarde
                          imageApprovalModalElement.dataset.currentObjectUrl = objectUrl;

                          if (fileType.startsWith('image/')) {

                            console.log('Blob de imagen recibido:', response);
                            ticketImagePreview.src = objectUrl;
                            ticketImagePreview.alt = `Imagen de ${selectedImageType} para Ticket ID: ${ticketId}`;
                            ticketImagePreview.style.display = 'block'; // Mostrar la imagen
                            mediaViewerContainer.appendChild(ticketImagePreview); // Asegurarse de que el img esté en el contenedor

                          } else if (fileType === 'application/pdf') {

                          ticketImagePreview.style.display = 'none'; // Ocultar la imagen si es PDF
                          const pdfViewer = document.createElement('embed');
                          pdfViewer.src = objectUrl;
                          pdfViewer.type = 'application/pdf';
                          pdfViewer.style.width = '100%';
                          pdfViewer.style.height = '100%';
                          pdfViewer.alt = `Documento PDF para Ticket ID: ${ticketId}`;
                          mediaViewerContainer.appendChild(pdfViewer); // Añadir el visor de PDF al contenedor

                          } else if (fileType === 'application/json' || fileType === 'text/plain') {
                              // Manejar respuestas de error que vienen como JSON o texto
                              const reader = new FileReader();
                              reader.onload = function() {
                                  let errorMessage = 'Error desconocido al obtener el documento.';
                                  try {
                                      if (fileType === 'application/json') {
                                          const errorJson = JSON.parse(reader.result);
                                          errorMessage = errorJson.message || errorMessage;
                                          console.error('Error del servidor (JSON parseado desde Blob):', errorMessage, errorJson);
                                      } else {
                                          errorMessage = reader.result || errorMessage;
                                          console.error('Error del servidor (mensaje desde Blob texto):', errorMessage);
                                      }
                                  } catch (e) {
                                      console.error('Error al parsear el contenido del Blob:', e, reader.result);
                                      errorMessage = `Error al procesar la respuesta del servidor: ${reader.result.substring(0, 100)}...`;
                                  }
                                  ticketImagePreview.src = '/public/img/imagen_no_disponible.png';
                                  ticketImagePreview.alt = `Error: ${errorMessage}`;
                                  ticketImagePreview.style.display = 'block';
                                  mediaViewerContainer.appendChild(ticketImagePreview);
                                  // Eliminar cualquier <embed> previo si existía
                                  const existingEmbed = mediaViewerContainer.querySelector('embed');
                                  if (existingEmbed) existingEmbed.remove();
                              };
                              reader.onerror = function() {
                                  console.error('Error al leer el Blob de respuesta.');
                                  ticketImagePreview.src = '/public/img/imagen_no_disponible.png';
                                  ticketImagePreview.alt = 'Error al procesar la respuesta del servidor.';
                                  ticketImagePreview.style.display = 'block';
                                  mediaViewerContainer.appendChild(ticketImagePreview);
                              };
                              reader.readAsText(response); 
                          } else {
                              console.error('Tipo de respuesta inesperado del servidor:', fileType, response);
                              ticketImagePreview.src = '/public/img/imagen_no_disponible.png';
                              ticketImagePreview.alt = 'Error: Tipo de documento no soportado.';
                              ticketImagePreview.style.display = 'block';
                              mediaViewerContainer.appendChild(ticketImagePreview);
                          }
                      } else {
                          console.error('La respuesta no es un Blob:', response);
                          ticketImagePreview.src = '/public/img/imagen_no_disponible.png';
                          ticketImagePreview.alt = 'Error: Respuesta inesperada del servidor.';
                          ticketImagePreview.style.display = 'block';
                          mediaViewerContainer.appendChild(ticketImagePreview);
                      }
                  } else {
                      console.error(`Error al cargar el documento: HTTP ${xhr.status} ${xhr.statusText}`);
                      const errorResponseBlob = xhr.response; 
                      if (errorResponseBlob instanceof Blob) {
                          const reader = new FileReader();
                          reader.onload = function() {
                              let errorMessage = `Error HTTP ${xhr.status}: ${xhr.statusText}`;
                              try {
                                  const parsedError = JSON.parse(reader.result);
                                  if (parsedError && parsedError.message) {
                                      errorMessage = parsedError.message;
                                      console.error('Mensaje de error del servidor (JSON de error):', errorMessage);
                                  } else {
                                      errorMessage = reader.result; 
                                      console.error('Mensaje de error del servidor (texto):', errorMessage);
                                  }
                              } catch (e) {
                                  errorMessage = reader.result; 
                                  console.error('Mensaje de error del servidor (texto crudo):', errorMessage);
                              }
                              ticketImagePreview.src = '/public/img/imagen_no_disponible.png';
                              ticketImagePreview.alt = `Error: ${errorMessage}`;
                              ticketImagePreview.style.display = 'block';
                              mediaViewerContainer.appendChild(ticketImagePreview);
                          };
                          reader.onerror = function() {
                              console.error('Error al leer el Blob de error como texto.');
                              ticketImagePreview.src = '/public/img/imagen_no_disponible.png';
                              ticketImagePreview.alt = 'Error en la comunicación con el servidor.';
                              ticketImagePreview.style.display = 'block';
                              mediaViewerContainer.appendChild(ticketImagePreview);
                          };
                          reader.readAsText(errorResponseBlob);
                      } else {
                          ticketImagePreview.src = '/public/img/imagen_no_disponible.png';
                          ticketImagePreview.alt = `Error HTTP ${xhr.status}: ${xhr.statusText}`;
                          ticketImagePreview.style.display = 'block';
                          mediaViewerContainer.appendChild(ticketImagePreview);
                      }
                  }
              };

              xhr.onerror = function() {
                  console.error('Error de red al intentar cargar el documento.');
                  ticketImagePreview.src = '/public/img/imagen_no_disponible.png';
                  ticketImagePreview.alt = 'Error de red.';
                  ticketImagePreview.style.display = 'block';
                  mediaViewerContainer.appendChild(ticketImagePreview);
              };

              xhr.send(data);

              currentTicketIdDisplay.textContent = ticketId;
              currentImageTypeDisplay.textContent = selectedImageType.charAt(0).toUpperCase() + selectedImageType.slice(1);
              approveTicketFromImage.setAttribute('data-ticket-id', ticketId);

              imageApprovalModal.show(); 

          } else {
              alert('Por favor, seleccione una opción de imagen y asegúrese de que el ID del ticket esté disponible.');
          }
      });

      // Listener para revocar Object URL cuando el modal de aprobación se cierra
      imageApprovalModalElement.addEventListener('hidden.bs.modal', function () {
          const currentObjectUrl = imageApprovalModalElement.dataset.currentObjectUrl; // Usamos el nuevo atributo data
          if (currentObjectUrl) {
              URL.revokeObjectURL(currentObjectUrl);
              console.log('Object URL revocada:', currentObjectUrl);
              delete imageApprovalModalElement.dataset.currentObjectUrl; // Limpiar el atributo data

              // Limpiar el contenido del contenedor del visor
              mediaViewerContainer.innerHTML = ''; 
              ticketImagePreview.src = ''; // Asegurar que la imagen también se limpia
              ticketImagePreview.alt = 'Vista previa del documento'; 
              ticketImagePreview.style.display = 'none'; // Ocultar el img después de limpiar
              mediaViewerContainer.appendChild(ticketImagePreview); // Volver a añadir el img para la próxima vez
          }
      });

      // Listeners para los botones "Cerrar" (sin cambios significativos aquí)
      if (closeImageApprovalModalBtn) {
          closeImageApprovalModalBtn.addEventListener('click', function() {
              imageApprovalModal.hide();
          });
      }

      if (closeImagevisualizarModalBtn) {
          closeImagevisualizarModalBtn.addEventListener('click', function() {
              visualizarImagenModal.hide(); 

              // Limpia los radios al cerrar el modal de selección de imagen
              const radioEnvio = document.getElementById('imagenEnvio');
              if (radioEnvio) {
                  radioEnvio.checked = true; 
                  document.getElementById('imagenExoneracion').checked = false;
                  document.getElementById('imagenPago').checked = false;
              }
          });
      }

    // Listener para el botón 'Aprobar Ticket' (si es necesario)
    if (approveTicketFromImage) { 
        approveTicketFromImage.addEventListener('click', function() {
            const ticketIdToApprove = this.getAttribute('data-ticket-id'); 
            if (ticketIdToApprove) {
                console.log('Aprobar ticket:', ticketIdToApprove);
                // Implementa aquí la lógica para aprobar el ticket
            } else {
                console.error('No se pudo obtener el Ticket ID para aprobar.');
            }
        });
    }


    // Listener para limpiar la imagen al cerrar el modal de aprobación
    imageApprovalModalElement.addEventListener('hidden.bs.modal', function () {
        ticketImagePreview.src = ''; 
        ticketImagePreview.alt = 'Imagen de consulta'; 
    });
});

// Nota importante: Asegúrate de que el HTML del botón en la tabla use `data-id`
// como lo estás usando en `$(this).data("id")`.
// Y el modal debe ser `data-bs-target="#visualizarImagenModal"`

    // Listeners para los botones "Cerrar" de ambos modales
    // Asegúrate de que los IDs 'closeImageApprovalModalBtn' y 'closeImagevisualizarModalBtn' existan en tu HTML
    if (closeImageApprovalModalBtn) {
        closeImageApprovalModalBtn.addEventListener('click', function() {
            imageApprovalModal.hide();
        });
    }

   

    // Aquí irían otros event listeners o funciones relacionados con el frontend.
    // Por ejemplo, el listener para el botón 'Aprobar Ticket' si lo tienes.
    approveTicketFromImage.addEventListener('click', function() {
        const ticketIdToApprove = approveTicketFromImage.getAttribute('data-ticket-id');
        if (ticketIdToApprove) {
            // Lógica para aprobar el ticket
            console.log('Aprobar ticket:', ticketIdToApprove);
            // Aquí puedes hacer otra llamada AJAX para enviar el estado de aprobación al backend
            // imageApprovalModal.hide(); // Ocultar el modal después de la aprobación
        } else {
            console.error('No se pudo obtener el Ticket ID para aprobar.');
        }
    });


    // Listener para revocar Object URL cuando el modal de imagen se cierra
    imageApprovalModalElement.addEventListener('hidden.bs.modal', function () {
        const currentObjectUrl = ticketImagePreview.dataset.objectUrl;
        if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
            console.log('Object URL revocada:', currentObjectUrl);
            delete ticketImagePreview.dataset.objectUrl; // Limpiar el atributo data
            ticketImagePreview.src = ''; // Opcional: limpiar la imagen
        }
    });

    // Listeners para los botones "Cerrar" (sin cambios, pero asegúrate de que los IDs existan)
    if (closeImageApprovalModalBtn) {
        closeImageApprovalModalBtn.addEventListener('click', function() {
            imageApprovalModal.hide();
        });
    }




    // Opcional: Puedes añadir más lógica aquí para el botón 'Aprobar Ticket' si lo necesitas
    // approveTicketFromImage.addEventListener('click', function() {
    //     const ticketIdToApprove = this.getAttribute('data-id');
    //     // Lógica para aprobar el ticket...
    //     console.log('Aprobar ticket con ID:', ticketIdToApprove);
    //     imageApprovalModal.hide(); // Cerrar el modal después de la acción
    // });


    // Puedes añadir más lógica aquí para el botón 'Aprobar Ticket' si lo necesitas
    // approveTicketFromImage.addEventListener('click', function() {
    //     const ticketIdToApprove = this.getAttribute('data-id');
    //     // Lógica para aprobar el ticket...
    //     console.log('Aprobar ticket con ID:', ticketIdToApprove);
    //     imageApprovalModal.hide(); // Cerrar el modal después de la acción
    // });

    approveTicketFromImage.addEventListener('click', function() {
        const ticketIdToApprove = this.getAttribute('data-id'); 

        if (ticketIdToApprove) {
            handleTicketApproval(ticketIdToApprove, true); 

            let approvalModalInstance = bootstrap.Modal.getInstance(imageApprovalModal);
            if (!approvalModalInstance) {
                approvalModalInstance = new bootstrap.Modal(imageApprovalModal);
            }
            approvalModalInstance.hide();
        } else {
            console.log('Error: No se pudo obtener el ID del ticket para aprobar.');
        }
    });

    /**
     * handleTicketApproval(id, approve)
     * Implementación para enviar la solicitud de aprobación/rechazo al servidor.
     */
    window.handleTicketApproval = function(id, approve) {
        console.log(`Ticket ${id} ha sido ${approve ? 'APROBADO' : 'RECHAZADO'}.`);
        
        fetch(`${ENDPOINT_BASE}${APP_PATH}api/tickets/update-status`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                ticket_id: id, 
                status: approve ? 'aprobado' : 'rechazado' 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Ticket procesado con éxito: ' + data.message);
                getTicketAprovalDocument(); 
            } else {
                alert('Error al procesar ticket: ' + (data.message || 'Mensaje desconocido.'));
                console.error('Error del servidor:', data.message);
            }
        })
        .catch(error => {
            console.error('Error al enviar la solicitud de aprobación/rechazo:', error);
            alert('Ocurrió un error al procesar el ticket. Por favor, inténtelo de nuevo.');
        });
    };

    // Asegúrate de que 'ENDPOINT_BASE' y 'APP_PATH' estén definidos globalmente.
    // const ENDPOINT_BASE = "http://localhost/";
    // const APP_PATH = "my_app/";


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
