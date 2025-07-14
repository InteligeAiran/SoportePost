let currentTicketIdForConfirmTaller = null;
let currentNroTicketForConfirmTaller = null; // <--- NUEVA VARIABLE PARA EL NÚMERO DE TICKET
let confirmInTallerModalInstance = null;

$(document).ready(function () {
  // 1. Obtener el elemento del modal por su ID
  const confirmInTallerModalElement = document.getElementById(
    "confirmInTallerModal"
  );
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

  // Evento para manejar el clic en el botón "Confirmar" dentro del modal
  $("#confirmTallerBtn").on("click", function () {
    const ticketIdToConfirm = currentTicketIdForConfirmTaller;
    // const nroTicketToConfirm = currentNroTicketForConfirmTaller; // Si necesitas el nro_ticket aquí

    if (ticketIdToConfirm) {
      updateTicketStatusInTaller(ticketIdToConfirm);
      // Cierra el modal usando la instancia
      if (confirmInTallerModalInstance) {
        confirmInTallerModalInstance.hide();
      }
    } else {
      console.error("ID de ticket no encontrado para confirmar en taller.");
    }
  });

  // Llama a getTicketData() para cargar la tabla inicialmente
  getTicketData();
});

function getTicketData() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketDataLab`);

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
    rif: "Rif",
    razonsocial_cliente: "Razón Social", // Columna donde aplicaremos el truncado
    full_name_tecnicoassignado: "Técnico Asignado",
    fecha_envio_a_taller: "Fecha Envío a Taller",
    name_status_payment: "Estatus Pago",
    name_accion_ticket: "Acción Ticket",
    name_status_lab: "Estatus Taller",
    date_send_torosal_fromlab: "Fecha Envío a Rosal",
    date_sendkey: "Fecha Envío Llave",
    date_receivekey: "Fecha Recibo Llave",
    date_receivefrom_desti: "Fecha Recibo Destino",
  };

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success) {
          const TicketData = response.ticket;
          const detailsPanel = document.getElementById("ticket-details-panel"); // Referencia al panel de detalles

          // Limpiar el panel de detalles al cargar nuevos datos de la tabla
          detailsPanel.innerHTML =
            "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

          if (TicketData && TicketData.length > 0) {
            // Destroy DataTables if it's already initialized on this table
            if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
              $("#tabla-ticket").DataTable().destroy();
              if (theadElement) theadElement.innerHTML = ""; // Clear old headers
              if (tbodyElement) tbodyElement.innerHTML = ""; // Clear old body
            }

            const allDataKeys = Object.keys(TicketData[0] || {});
            const columnsConfig = [];
            const displayLengthForTruncate = 25; // Define la longitud a la que truncar el texto

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

                // Lógica para aplicar truncado/expansión a 'razonsocial_cliente'
                if (key === "razonsocial_cliente") {
                  columnDef.render = function (data, type, row) {
                    if (type === "display" || type === "filter") {
                      const fullText = String(data || "").trim();
                      if (fullText.length > displayLengthForTruncate) {
                        return `<span class="truncated-cell" data-full-text="${fullText}">${fullText.substring(
                          0,
                          displayLengthForTruncate
                        )}...</span>`;
                      }
                      return fullText;
                    }
                    return data;
                  };
                }
                // Puedes añadir más 'if' para otras columnas que quieras truncar
                /*
                                else if (key === "otra_columna_larga") {
                                    columnDef.render = function (data, type, row) {
                                        if (type === 'display' || type === 'filter') {
                                            const fullText = String(data || "").trim();
                                            if (fullText.length > displayLengthForTruncate) {
                                                return `<span class="truncated-cell" data-full-text="${fullText}">${fullText.substring(0, displayLengthForTruncate)}...</span>`;
                                            }
                                            return fullText;
                                        }
                                        return data;
                                    };
                                }
                                */

                columnsConfig.push(columnDef);
              }
            }

            // Añadir la columna de "Acciones" al final
            columnsConfig.push({
              data: null,
              title: "Acciones",
              orderable: false,
              searchable: false,
              width: "12%", // Aumentamos el ancho para que quepan ambos botones
              render: function (data, type, row) {
                const idTicket = row.id_ticket;
                const currentStatus = row.name_status_lab;
                const nroTicket = row.nro_ticket; // <--- OBTENEMOS EL NÚMERO DE TICKET AQUÍ
                const confirmTaller = row.confirmreceive;

                let buttonsHtml = "";

                // Prioritize final states or pending confirmations
                if (currentStatus === "Reparado") {
                  buttonsHtml += `<button class="btn btn-warning btn-sm" disabled>Reparado</button>`;
                } else if (currentStatus === "Irreparable") {
                  buttonsHtml += `<button class="btn btn-danger btn-sm" disabled>Irreparable</button>`;
                } else if (
                  currentStatus === "Recibido en Taller" ||
                  confirmTaller === "f"
                ) {
                  // This is the state where the ticket is in the workshop but hasn't been confirmed yet
                  buttonsHtml += `
                                         <button type="button" id = "CheckConfirmTaller"  class="btn btn-warning btn-sm confirm-waiting-btn"
                                            title="En espera de confirmar en el taller"  data-id-ticket="${idTicket}" data-nro-ticket="${nroTicket}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16">
                                                <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"/>
                                            </svg>
                                        </button>
                                    `;
                } else {
                  buttonsHtml += `
                                         <button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-btn ms-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#changeStatusModal"
                                            data-id="${idTicket}"
                                            data-current-status="${currentStatus}">
                                            Cambiar Estatus
                                        </button>
                                    `;
                }

                return buttonsHtml;
              },
            });

            // === ADD "CARGA DE LLAVE" COLUMN ===
            columnsConfig.push({
              data: null,
              title: "Carga de Llave",
              orderable: false,
              searchable: false,
              visible: true,
              className: "dt-body-center",
              render: function (data, type, row) {
                const hasReceiveKeyDate =
                  row.date_receivekey !== null &&
                  row.date_receivekey !== undefined &&
                  String(row.date_receivekey).trim() !== "";

                if (row.name_status_lab === "Reparado") {
                  return `<input type="checkbox" class="receive-key-checkbox" data-id-ticket="${
                    row.id_ticket
                  }" ${hasReceiveKeyDate ? "checked disabled" : ""}>`;
                } else {
                  return "";
                }
              },
            });

            // Initialize DataTables
            const dataTableInstance = $(tableElement).DataTable({
              scrollX: "200px",
              responsive: false,
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

            // ************* INICIO: LÓGICA PARA TRUNCAR/EXPANDIR TEXTO (Aplicada DESPUÉS de la inicialización de DataTables) *************
            $("#tabla-ticket tbody")
              .off("click", ".truncated-cell, .expanded-cell") // Usa .off() para evitar múltiples listeners
              .on("click", ".truncated-cell, .expanded-cell", function (e) {
                e.stopPropagation(); // Evita que el clic en la celda active el clic de la fila completa
                const $cellSpan = $(this);
                const fullText = $cellSpan.data("full-text"); // Obtiene el texto completo del atributo data-

                if ($cellSpan.hasClass("truncated-cell")) {
                  $cellSpan
                    .removeClass("truncated-cell")
                    .addClass("expanded-cell");
                  $cellSpan.text(fullText);
                } else {
                  $cellSpan
                    .removeClass("expanded-cell")
                    .addClass("truncated-cell");
                  // Asegúrate de que displayLengthForTruncate sea accesible o defínela aquí de nuevo
                  const displayLength = 25; // La misma longitud de truncado usada en el render
                  if (fullText.length > displayLength) {
                    $cellSpan.text(
                      fullText.substring(0, displayLength) + "..."
                    );
                  } else {
                    $cellSpan.text(fullText); // Si el texto es corto, no debería tener "...", solo el texto completo
                  }
                }
              });
            // ************* FIN: LÓGICA PARA TRUNCAR/EXPANDIR TEXTO *************

            // === ADD THE CLICK EVENT LISTENER FOR TABLE ROWS HERE ===
            $("#tabla-ticket tbody")
              .off("click", "tr") // .off() to prevent multiple bindings if called multiple times
              .on("click", "tr", function () {
                const tr = $(this);
                const rowData = dataTableInstance.row(tr).data();

                if (!rowData) {
                  return;
                }

                $("#tabla-ticket tbody tr").removeClass("table-active");
                tr.addClass("table-active");

                const ticketId = rowData.id_ticket; // <--- IMPORTANT CHANGE HERE

                const selectedTicketDetails = TicketData.find(
                  (t) => t.id_ticket == ticketId
                );

                if (selectedTicketDetails) {
                  // Make sure detailsPanel, formatTicketDetailsPanel, loadTicketHistory,
                  // and downloadImageModal are defined and accessible in this scope.
                  // For example: const detailsPanel = document.getElementById("yourDetailsPanelId");
                  // You might need to pass them as arguments to getTicketData or declare them globally.
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
                      imgElement.src =
                        '__DIR__ . "/../../../public/img/consulta_rif/POS/mantainment.png'; // Corrige esta ruta si es JS puro y no PHP
                      imgElement.alt = "Serial no disponible";
                    }
                  }
                } else {
                  detailsPanel.innerHTML =
                    "<p>No se encontraron detalles para este ticket.</p>";
                }
              });
            // === END CLICK EVENT LISTENER ===

            $("#tabla-ticket tbody")
              .off("click", ".confirm-waiting-btn")
              .on("click", ".confirm-waiting-btn", function (e) {
                e.stopPropagation();
                const ticketId = $(this).data("id-ticket");
                const nroTicket = $(this).data("nro-ticket");

                // Almacenar en las variables globales
                currentTicketIdForConfirmTaller = ticketId;
                currentNroTicketForConfirmTaller = nroTicket;

                // Opcional: poner el ID y Nro de ticket en los inputs hidden del modal como respaldo
                $("#modalTicketIdConfirmTaller").val(ticketId);
                $("#modalHiddenNroTicketConfirmTaller").val(nroTicket);

                // Actualiza el texto del modal con el número de ticket
                $("#modalTicketIdConfirmTaller").text(nroTicket);

                // ¡CAMBIO CLAVE AQUÍ! Usa la instancia del modal para mostrarlo
                if (confirmInTallerModalInstance) {
                  confirmInTallerModalInstance.show();
                } else {
                  console.error(
                    "La instancia del modal 'confirmInTallerModal' no está disponible."
                  );
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

  xhr.send();
}

function updateTicketStatusInTaller(ticketId) {
  const id_user = document.getElementById("userId").value;

  const dataToSendString = `action=UpdateStatusToReceiveInTaller&id_user=${encodeURIComponent(
    id_user
  )}&id_ticket=${encodeURIComponent(ticketId)}`;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateStatusToReceiveInTaller`
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
            text: "El ticket ha sido marcado como 'En Proceso de reparación'.",
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

 const changeStatusModal = document.getElementById("changeStatusModal");
  // Estas variables son cruciales porque son accesibles para changeStatusTicket
  const estatusActualInput = changeStatusModal
    ? changeStatusModal.querySelector("#modalCurrentStatus")
    : null;
  const modalTicketIdInput = changeStatusModal
    ? changeStatusModal.querySelector("#modalTicketId")
    : null;
  const modalNewStatusSelect = changeStatusModal
    ? changeStatusModal.querySelector("#modalNewStatus")
    : null;
  const modalSubmitBtn = changeStatusModal
    ? changeStatusModal.querySelector("#saveStatusChangeBtn")
    : null; // CORREGIDO AQUÍ

  const updateTicketStatusForm = changeStatusModal
    ? changeStatusModal.querySelector("#changeStatusForm")
    : null; // CORREGIDO AQUÍ

 function showCustomModal(currentStatus, idTicket) {
      if (estatusActualInput) {
        estatusActualInput.value = currentStatus;
      }

      if (modalTicketIdInput) {
        // Aquí usamos directamente idTicket, que es un parámetro de la función
        modalTicketIdInput.value = idTicket;
      }

      if (modalNewStatusSelect) {
        modalNewStatusSelect.setAttribute(
          "data-current-status-name",
          currentStatus
        );
        // Llamamos a getStatusLab SOLO CUANDO se abre el modal para filtrar.
        getStatusLab(currentStatus); // Pasamos el estatus actual para filtrar
      }

      changeStatusModal.classList.add("show");
      changeStatusModal.style.display = "block";
      changeStatusModal.setAttribute("aria-modal", "true");
      changeStatusModal.setAttribute("role", "dialog");

      document.body.classList.add("modal-open");
      const backdrop = document.createElement("div");
      backdrop.classList.add("modal-backdrop", "fade", "show");
      backdrop.id = "custom-modal-backdrop";
      document.body.appendChild(backdrop);
    }

    function hideCustomModal() {
      changeStatusModal.classList.remove("show");
      changeStatusModal.style.display = "none";
      changeStatusModal.removeAttribute("aria-modal");
      changeStatusModal.removeAttribute("role");

      document.body.classList.remove("modal-open");
      const backdrop = document.getElementById("custom-modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    }

// Call getTicketData when the document is ready using jQuery
$(document).ready(function () {

  // --- NUEVA LÓGICA PARA EL CHECKBOX DE "CARGA DE LLAVE" ---
  $("#tabla-ticket").on("change", ".receive-key-checkbox", function () {
    const checkbox = $(this);
    const idTicket = checkbox.data("id-ticket");

    if (checkbox.is(":checked")) {
      Swal.fire({
        title: "¿Seguro que ya cargaste las llaves?",
        text: "Esta acción registrará la fecha de recepción de la llave.",
        icon: "warning",
        showCancelButton: true,
        showCloseButton: true, // Agrega esta línea para mostrar el botón de cerrar (X)
        confirmButtonColor: "#003594",
        confirmButtonClass: "swal2-confirm-hover-green", // Clase personalizada para el hover
        cancelButtonColor: "#6c757d", // Color inicial gris (ajusta si quieres otro color inicial)
        cancelButtonClass: "swal2-cancel-hover-red", // Clase personalizada para el hover
        confirmButtonText: "Sí, cargar fecha",
        cancelButtonText: "Cancelar",
        color: "#000000", // Color del texto general del modal
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, llamar a la función para guardar la fecha
          saveKeyReceiveDate(idTicket);
        } else {
          // Si el usuario cancela, desmarcar el checkbox
          checkbox.prop("checked", false);
        }
      });
    }
    // Si el checkbox se desmarca, no hacemos nada o puedes añadir otra lógica si lo necesitas.
  });

  // --- NUEVA FUNCIÓN PARA ENVIAR LA FECHA AL SERVIDOR ---
  function saveKeyReceiveDate(idTicket) {
    const id_user = document.getElementById("userId").value; // Asumiendo que tienes el ID del usuario logueado

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateKeyReceiveDate`
    ); // Nuevo endpoint
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            Swal.fire({
              title: "¡Registrado!",
              text: "La fecha de recepción de llave ha sido guardada.",
              icon: "success",
              confirmButtonText: "Entendido",
              color: "black",
            }).then(() => {
              // Opcional: Recargar los datos de la tabla para ver el cambio
              getTicketData();
            });
          } else {
            Swal.fire(
              "Error",
              "No se pudo guardar la fecha: " +
                (response.message || "Error desconocido"),
              "error"
            );
            // Desmarcar el checkbox si falla el guardado
            $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop(
              "checked",
              false
            );
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "Error al procesar la respuesta del servidor.",
            "error"
          );
          $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop(
            "checked",
            false
          );
          console.error("Error parsing JSON for key date update:", error);
        }
      } else {
        Swal.fire(
          "Error",
          `Error de conexión: ${xhr.status} ${xhr.statusText}`,
          "error"
        );
        $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop(
          "checked",
          false
        );
        console.error(
          "Error in XHR for key date update:",
          xhr.status,
          xhr.statusText
        );
      }
    };

    xhr.onerror = function () {
      Swal.fire(
        "Error de red",
        "No se pudo conectar con el servidor para guardar la fecha.",
        "error"
      );
      $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop(
        "checked",
        false
      );
      console.error("Network error for key date update.");
    };

    const data = `action=UpdateKeyReceiveDate&id_ticket=${idTicket}&id_user=${id_user}`; // Puedes enviar el id_user si lo necesitas para auditoría
    xhr.send(data);
  }

  const changeStatusModal = document.getElementById("changeStatusModal");
  // Estas variables son cruciales porque son accesibles para changeStatusTicket
  const estatusActualInput = changeStatusModal
    ? changeStatusModal.querySelector("#modalCurrentStatus")
    : null;
  const modalTicketIdInput = changeStatusModal
    ? changeStatusModal.querySelector("#modalTicketId")
    : null;
  const modalNewStatusSelect = changeStatusModal
    ? changeStatusModal.querySelector("#modalNewStatus")
    : null;
  const modalSubmitBtn = changeStatusModal
    ? changeStatusModal.querySelector("#saveStatusChangeBtn")
    : null; // CORREGIDO AQUÍ

  const updateTicketStatusForm = changeStatusModal
    ? changeStatusModal.querySelector("#changeStatusForm")
    : null; // CORREGIDO AQUÍ

  if (changeStatusModal) {
    // === Función para mostrar el modal ===
    function showCustomModal(currentStatus, idTicket) {
      if (estatusActualInput) {
        estatusActualInput.value = currentStatus;
      }

      if (modalTicketIdInput) {
        // Aquí usamos directamente idTicket, que es un parámetro de la función
        modalTicketIdInput.value = idTicket;
      }

      if (modalNewStatusSelect) {
        modalNewStatusSelect.setAttribute(
          "data-current-status-name",
          currentStatus
        );
        // Llamamos a getStatusLab SOLO CUANDO se abre el modal para filtrar.
        getStatusLab(currentStatus); // Pasamos el estatus actual para filtrar
      }

      changeStatusModal.classList.add("show");
      changeStatusModal.style.display = "block";
      changeStatusModal.setAttribute("aria-modal", "true");
      changeStatusModal.setAttribute("role", "dialog");

      document.body.classList.add("modal-open");
      const backdrop = document.createElement("div");
      backdrop.classList.add("modal-backdrop", "fade", "show");
      backdrop.id = "custom-modal-backdrop";
      document.body.appendChild(backdrop);
    }

    function hideCustomModal() {
      changeStatusModal.classList.remove("show");
      changeStatusModal.style.display = "none";
      changeStatusModal.removeAttribute("aria-modal");
      changeStatusModal.removeAttribute("role");

      document.body.classList.remove("modal-open");
      const backdrop = document.getElementById("custom-modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    }

    document.body.addEventListener("click", function (event) {
      let button = event.target.closest(".cambiar-estatus-btn");
      if (button) {
        const idTicket = button.getAttribute("data-id");
        const currentStatus = button.getAttribute("data-current-status");
        showCustomModal(currentStatus, idTicket);
      }
    });

    const closeButton = changeStatusModal.querySelector(
      '[data-bs-dismiss="modal"]'
    );
    if (closeButton) {
      closeButton.addEventListener("click", hideCustomModal);
    }

    document.body.addEventListener("click", function (event) {
      if (event.target && event.target.id === "custom-modal-backdrop") {
        hideCustomModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        changeStatusModal.classList.contains("show")
      ) {
        hideCustomModal();
      }
    });

    // === Lógica para enviar el formulario del modal ===
    if (updateTicketStatusForm) {
      modalSubmitBtn.addEventListener("click", function (event) {
        // Escuchamos el 'submit' del formulario
        event.preventDefault();
        changeStatusTicket(); // Llama a la función changeStatusTicket
      });
    }

    const closebutton = document.getElementById("CerrarBoton");
    if (closebutton) {
      document.addEventListener("click", function (event) {
        if (event.target === closebutton) {
          changeStatusModal.style.display = "none";
          changeStatusModal.classList.remove("show");
          document.body.classList.remove("modal-open");
          const backdrop = document.getElementById("custom-modal-backdrop");
          if (backdrop) {
            backdrop.remove();
          }
        }
      });
    }
  }

  // === Función changeStatusTicket (con la validación de SweetAlert) ===
  function changeStatusTicket() {
    const idTicket = modalTicketIdInput.value;
    const newStatus = modalNewStatusSelect.value;
    const id_user = document.getElementById("userId").value;

    const errorMessageDiv = changeStatusModal.querySelector("#errorMessage");
    if (errorMessageDiv) {
      errorMessageDiv.style.display = "none";
      errorMessageDiv.innerHTML = "";
    }

    // === VALIDACIÓN DEL CAMPO "NUEVO ESTATUS" con SweetAlert ===
    if (!newStatus || newStatus === "" || newStatus === "0") {
      // Asegúrate que "0" es tu valor para "no seleccionado"
      Swal.fire({
        title: "Notificación",
        text: 'No se puede tener un campo de estatus vacío. Por favor, selecciona un "Nuevo Estatus".',
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#003594", // Color del botón
        color: "black", // Color del texto
      });
      console.warn("Validación frontend: El estatus nuevo está vacío.");
      return; // Detener la ejecución si la validación falla
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateTicketStatus`
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onload = function () {
        const errorMessageDiv =
          changeStatusModal.querySelector("#errorMessage");
        if (errorMessageDiv) {
          errorMessageDiv.style.display = "none"; // Ocultar mensaje de error anterior al iniciar la nueva solicitud
          errorMessageDiv.innerHTML = "";
        }

        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              // Si la respuesta es exitosa, muestra el SweetAlert de éxito
              Swal.fire({
                title: "¡Éxito!",
                text: "Estatus del ticket actualizado correctamente.",
                icon: "success",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#28a745",
                color: "black",
                timer: 3500,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                },
                // willClose ya no tiene location.reload() si quieres un flujo más suave
                // Si QUERES recargar la página, manten el location.reload() y elimina lo de abajo.
                willClose: () => {
                  location.reload();
                },
              });
              getTicketData();
            } else {
              // Si el estado es 200 pero success es false (esto no debería pasar con tu API que usa 404/500 para fallos)

              // pero es una buena práctica manejarlo por si acaso.

              if (errorMessageDiv) {
                errorMessageDiv.innerHTML =
                  "Error inesperado: " +
                  (response.message || "La operación no fue exitosa.");

                errorMessageDiv.style.display = "block";
              }

              console.error(
                "Error al actualizar estatus (200 OK pero success:false):",
                response.message
              );
            }
          } catch (error) {
            console.error(
              "Error parsing JSON response for status update:",
              error
            );

            if (errorMessageDiv) {
              errorMessageDiv.innerHTML =
                "Error al procesar la respuesta del servidor (JSON inválido).";

              errorMessageDiv.style.display = "block";
            }
          }
        } else {
          // Manejo de errores basado en el código de estado HTTP de la API

          let errorMsg = "Error en la solicitud.";

          try {
            const response = JSON.parse(xhr.responseText);

            if (response.message) {
              errorMsg = response.message; // Usar el mensaje de la API si está presente
            }
          } catch (e) {
            // Si la respuesta no es JSON o no se puede parsear

            console.warn("No se pudo parsear la respuesta de error como JSON.");
          }

          if (xhr.status === 404) {
            // Específico para tu caso 'No se encontraron datos'

            if (errorMessageDiv) {
              errorMessageDiv.innerHTML = `Error ${xhr.status}: ${errorMsg}`;

              errorMessageDiv.style.display = "block";
            }

            console.error(
              "Error 404: No se encontraron datos para actualizar.",
              errorMsg
            );
          } else if (xhr.status === 500) {
            // Específico para tu caso 'El estatus esta vacio'

            if (errorMessageDiv) {
              errorMessageDiv.innerHTML = `Error ${xhr.status}: ${errorMsg}`;

              errorMessageDiv.style.display = "block";
            }

            console.error("Error 500: Error interno del servidor.", errorMsg);
          } else {
            // Otros códigos de estado de error (400, 401, etc.)

            if (errorMessageDiv) {
              errorMessageDiv.innerHTML = `Error ${xhr.status}: ${
                errorMsg || xhr.statusText
              }`;

              errorMessageDiv.style.display = "block";
            }

            console.error(
              "Error inesperado en la solicitud:",
              xhr.status,
              xhr.statusText,
              errorMsg
            );
          }
        }
      };

      xhr.onerror = function () {
        console.error("Network error during status update request.");

        const errorMessageDiv =
          changeStatusModal.querySelector("#errorMessage");

        if (errorMessageDiv) {
          errorMessageDiv.innerHTML =
            "Error de red. Asegúrate de estar conectado a internet.";

          errorMessageDiv.style.display = "block";
        }
      };

      const datos = `action=UpdateTicketStatus&id_ticket=${idTicket}&id_new_status=${newStatus}&id_user=${id_user}`;
      xhr.send(datos);
    }
  }
});

function getStatusLab(currentStatusNameToExclude = null) {
  // Acepta un parámetro opcional
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetStatusLab`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("modalNewStatus");

          select.innerHTML =
            '<option value="" disabled selected hidden>Seleccione</option>'; // Limpiar y agregar la opción por defecto
          if (Array.isArray(response.estatus) && response.estatus.length > 0) {
            response.estatus.forEach((status) => {
              // *** AQUÍ ESTÁ LA LÓGICA CLAVE: FILTRAR LA OPCIÓN ACTUAL ***
              if (status.name_status_lab !== currentStatusNameToExclude) {
                const option = document.createElement("option");
                option.value = status.id_status_lab;
                option.textContent = status.name_status_lab;
                select.appendChild(option);
              }
            });
          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay Técnicos Disponibles";
            select.appendChild(option);
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

  const datos = `action=GetStatusLab`; // Asegúrate de que esta acción en el backend devuelva los técnicos filtrados
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de modales
  getStatusLab(); // Asegúrate de que esta función carga el select correctamente

  const changeStatusModal = new bootstrap.Modal(document.getElementById("changeStatusModal"));
  const rescheduleModal = new bootstrap.Modal( document.getElementById("rescheduleModal"));
  const renewalModal = new bootstrap.Modal(document.getElementById("renewalModal"));

  // Elementos del modal de cambio de estatus
  const modalNewStatusSelect = document.getElementById("modalNewStatus");
  const modalTicketIdInput = document.getElementById("modalTicketId"); // Tu input hidden existente en changeStatusModal
  const modalCurrentStatusInput = document.getElementById("modalCurrentStatus"); // Input para el estatus actual

  // Elementos del modal de reagendamiento (rescheduleModal)
  const rescheduleDateInput = document.getElementById("rescheduleDate");
  const dateError = document.getElementById("dateError");
  const saveRescheduleDateBtn = document.getElementById("saveRescheduleDate");

  // NUEVOS elementos para el modal de renovación (renewalModal)
  const renewalModalMessage = document.getElementById("renewalModalMessage");
  const renewalModalTicketId = document.getElementById("renewalModalTicketId");
  const renewalModalCurrentStatusName = document.getElementById(
    "renewalModalCurrentStatusName"
  );
  const renewalModalCurrentStatusId = document.getElementById(
    "renewalModalCurrentStatusId"
  );
  const renewalDateInput = document.getElementById("renewalDate");
  const renewalDateError = document.getElementById("renewalDateError");
  const renewDateBtn = document.getElementById("renewDateBtn");
  const sendToCommercialBtn = document.getElementById("sendToCommercialBtn");
  const changeStatusFromRenewalBtn = document.getElementById(
    "changeStatusFromRenewalBtn"
  ); // Nuevo botón

  // Cola de tickets vencidos para mostrar modales secuencialmente
  let overdueTicketsQueue = [];

  // Función para procesar el siguiente ticket en la cola
  function processNextOverdueTicket() {
    if (overdueTicketsQueue.length > 0) {
    // Si hay un solo ticket, muestra el modal
    if (overdueTicketsQueue.length === 1) {
        const ticket = overdueTicketsQueue[0];
        
        // --- Primer Modal: Notificación y Opciones ---
        Swal.fire({
            title: "Notificación",
            html: `Al ticket con el Nro. <b>${ticket.nro_ticket}</b> se le ha vencido el tiempo de espera para la llegada de los repuestos (Fecha anterior: ${ticket.repuesto_date}). ¿Desea colocar otra fecha, enviar a gestión comercial o cambiar el estatus del ticket?<br>
            <br><div class="swal-custom-button-container">
              <button id="changeStatusButton" class="custom-status-button">Cambiar Estatus del Ticket</button>
            </div>`,
            showDenyButton: true, // Para "Enviar a Gestión Comercial"
            denyButtonText: "Enviar a Gestión Comercial",
            showConfirmButton: true, // Para "Renovar Fecha"
            confirmButtonText: "Renovar Fecha",
            focusConfirm: false,
            allowOutsideClick: false, 
            allowEscapeKey: false,
            showCloseButton: true,
            keydownListenerCapture: true,
            color: "black",
            customClass: {
              confirmButton: 'btn-renovar', // Clase para "Renovar Fecha"
              denyButton: 'btn-gestion-comercial', // Clase para "Enviar a Gestión Comercial"
              // Aseguramos que el modal principal también tenga una clase si lo necesitas
              popup: 'notification-modal-custom'
            },
            didOpen: () => {
                // Obtenemos el botón personalizado dentro del modal
                const changeStatusBtn = document.getElementById('changeStatusButton');

                if (changeStatusBtn) {
                    changeStatusBtn.addEventListener('click', () => {
                      Swal.close();
                      const current_status_lab_name = ticket.current_status_lab_name || ticket.estatus_actual || "Desconocido";
                      showCustomModal(current_status_lab_name, ticket.id_ticket);
                    });
                }
            },
        }).then((result) => {
            
            if (result.isConfirmed) {
                // --- Lógica para "Renovar Fecha" (Abre un segundo modal) ---
                
                Swal.fire({
                    title: "Renovar Fecha de la llegada de Repuestos",
                    html: `
                        <b>Coloque Nueva Fecha:</b><br>
                        <input type="date" id="swal-input-date-renew" class="swal2-input">
                    `,
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Guardar Fecha",
                    focusConfirm: false,
                    color: "black",
                    allowOutsideClick: false, 
                    allowEscapeKey: false,
                    showCloseButton: true,
                    keydownListenerCapture: true,

                    customClass: {
                      // Asigna una clase a la ventana modal (swal2-popup)
                      popup: 'modal-with-backdrop-filter', 
                      // Asigna una clase al telón de fondo (swal2-container)
                      container: 'swal2-container-custom' 
                    },
                    
                    // Asignar IDs a los botones usando didOpen
                    didOpen: (modalElement) => {
                      const confirmButton = modalElement.querySelector('.swal2-confirm');
                      const cancelButton = modalElement.querySelector('.swal2-cancel');

                      if (confirmButton) {
                        confirmButton.id = 'ButtonGuardarFecha';
                      }

                      if (cancelButton) {
                        cancelButton.id = 'ButtonCancelarFecha';
                      }
                    },

                    // Validamos la fecha con las restricciones
                    preConfirm: () => {
                        const newDateStr = document.getElementById("swal-input-date-renew").value;
                        // 1. Validar que se haya seleccionado una fecha
                        if (!newDateStr) {
                            Swal.showValidationMessage("Por favor, selecciona una fecha.");
                            return false;
                        }

                        // Convertir la fecha seleccionada y la fecha actual a objetos Date
                        const selectedDate = new Date(newDateStr + 'T00:00:00'); 
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        // 2. Restricción de año: Solo permite el año actual.
                        const currentYear = today.getFullYear();
                        const selectedYear = selectedDate.getFullYear();

                        if (selectedYear !== currentYear) {
                            Swal.showValidationMessage("Solo puedes seleccionar fechas dentro del año actual.");
                            return false;
                        }

                        // 3. Restricción de rango de 3 meses (del pasado y del futuro)
                        const threeMonthsAgo = new Date(today);
                        threeMonthsAgo.setMonth(today.getMonth() - 3);

                        const threeMonthsLater = new Date(today);
                        threeMonthsLater.setMonth(today.getMonth() + 3);

                        if (selectedDate < threeMonthsAgo || selectedDate > threeMonthsLater) {
                            Swal.showValidationMessage("Por favor, selecciona una fecha dentro de un rango de 3 meses de la fecha actual.");
                            return false;
                        }

                        // Si todas las validaciones pasan, retornamos los datos
                        return {
                            ticketId: ticket.id_ticket,
                            newDate: newDateStr, // Usamos la cadena de fecha original para el envío
                        };
                    }
                }).then((renewResult) => {
                    const ticketId = renewResult.value.ticketId;
                    const newRepuestoDate = renewResult.value.newDate;
                    const id_user = document.getElementById("userId");

                    if (renewResult.isConfirmed) {                        
                        const datos = `action=UpdateRepuestoDate2&id_ticket=${ticketId}&newDate=${newRepuestoDate}&id_user=${id_user.value}`;
                        const xhr = new XMLHttpRequest();
                        const endpoint = `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateRepuestoDate2`;
                        xhr.open("POST", endpoint, true);
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                        xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                // Solicitud exitosa
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Éxito',
                                    text: `la Fecha de la llegada de repuesto para el Ticket Nro: ${ticket.nro_ticket} fue renovada correctamente.`,
                                    confirmButtonText: 'Aceptar', 
                                    color: 'black',
                                    confirmButtonColor: '#003594',
                                    allowOutsideClick: false, 
                                    allowEscapeKey: false,
                                    showCloseButton: true,
                                    keydownListenerCapture: true,
                                });
                            } else {
                                // Error en la solicitud HTTP
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Hubo un problema al actualizar la fecha de repuesto. Inténtalo de nuevo.',
                                    footer: `Status: ${xhr.status}`
                                });
                            }
                            overdueTicketsQueue.shift();
                            processNextOverdueTicket();
                        };

                        xhr.onerror = function() {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error de conexión',
                            text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
                          });
                          overdueTicketsQueue.shift();
                          processNextOverdueTicket();
                        };
                        xhr.send(datos);
                        Swal.showLoading();
                    } else {
                        console.log("Renovación de fecha cancelada.");      
                        overdueTicketsQueue.shift();
                        processNextOverdueTicket();
                    }
                });
            } else if (result.isDenied) {
               Swal.fire({
                        title: 'Confirmación',
                        text: `¿Seguro que desea enviar el ticket Nro: ${ticket.nro_ticket} a Gestión Comercial?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, enviar',
                        cancelButtonText: 'Cancelar',
                        color: 'black',
                        allowOutsideClick: false, 
                        allowEscapeKey: false,
                        showCloseButton: true,
                        keydownListenerCapture: true,
                        customClass: {
                            confirmButton: 'btn-gestion-comercial', // O un estilo de confirmación
                            cancelButton: 'btn-cancelar' // O un estilo de cancelación
                        }
                    }).then((confirmResult) => {
                        const ticketId = ticket.id_ticket;
                        const id_user = document.getElementById("userId");

                        if (confirmResult.isConfirmed) {
                          const datos = `action=SendToComercial&id_ticket=${ticketId}&id_user=${id_user.value}`;
                          const xhr = new XMLHttpRequest();
                          const endpoint = `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToComercial`;
                          xhr.open("POST", endpoint, true);
                          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                          xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                              Swal.fire({
                                  icon: 'success',
                                  title: 'Éxito',
                                  text: `El ticket Nro: ${ticket.nro_ticket} ha sido enviado a Gestión Comercial`,
                                  confirmButtonText: 'Aceptar', 
                                  color: 'black',
                                  confirmButtonColor: '#003594',
                                  allowOutsideClick: false, 
                                  allowEscapeKey: false,
                                  showCloseButton: true,
                                  keydownListenerCapture: true,
                              }).then((result) => {
                                  if (result.isConfirmed) {
                                      // Recarga la página
                                      window.location.reload(); 
                                  }
                              });
                                                          
                              } else {
                                  // Error en la solicitud HTTP
                                  Swal.fire({
                                      icon: 'error',
                                      title: 'Error',
                                      text: 'Hubo un problema al actualizar la fecha de repuesto. Inténtalo de nuevo.',
                                      footer: `Status: ${xhr.status}`
                                  });
                              }
                              overdueTicketsQueue.shift();
                              processNextOverdueTicket();
                          };

                          xhr.onerror = function() {
                            Swal.fire({
                              icon: 'error',
                              title: 'Error de conexión',
                              text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
                            });
                            overdueTicketsQueue.shift();
                            processNextOverdueTicket();
                          };
                          xhr.send(datos);
                          Swal.showLoading();
                        } else {
                            console.log("Envío a Gestión Comercial cancelado.");
                            overdueTicketsQueue.shift();
                            processNextOverdueTicket();
                        }
                    });

                } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                    // --- Lógica para "Cerrar" (si se usa la X o se hace clic fuera si allowOutsideClick está habilitado) ---
                    console.log("Modal cerrado.");
                    
                    // Después de cerrar, procesamos el siguiente ticket
                    overdueTicketsQueue.shift();
                    processNextOverdueTicket();
                }
            });
      } else {
        // Logic for multiple tickets: Use a select dropdown
        const inputOptions = {};
        overdueTicketsQueue.forEach((ticket) => {
          inputOptions[
            ticket.id_ticket
          ] = `Ticket Nro: ${ticket.nro_ticket} (Vencido el: ${ticket.repuesto_date})`;
        });

        Swal.fire({
          title: "Notificación",
          html: `Tienes ${overdueTicketsQueue.length} tickets con la Fecha Estimada de la Llegada de Repuestos Vencida.<br>
                    <br>Por favor, selecciona un ticket para realizar una acción:<br>`,
          input: "select",
          inputOptions: inputOptions,
          inputPlaceholder: "Selecciona un ticket",
          showCancelButton: true,
          cancelButtonText: "Cerrar",
          allowOutsideClick: false,
          color: "black",
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve();
              } else {
                resolve("Debes seleccionar un ticket.");
              }
            });
          },
          // AÑADE ESTO:
          customClass: {
            popup: "my-custom-select-modal", // Agrega una clase al popup principal
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const selectedTicketId = result.value;
            const selectedTicket = overdueTicketsQueue.find(
              (t) => t.id_ticket === selectedTicketId
            );

            if (selectedTicket) {
              // Show the specific action modal for the selected ticket
              showActionModalForTicket(selectedTicket);
            } else {
              // This shouldn't happen if inputOptions are correctly built
              console.error("Ticket seleccionado no encontrado en la cola.");
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            console.log("Modal de selección cerrado.");
            overdueTicketsQueue = []; // Clear the queue if user cancels main selection modal
          }
        });
      }
    } else {
      console.log("No hay más tickets vencidos para procesar.");
    }
  }

  // Evento para cuando el renewalModal se oculta (procesa el siguiente)
  document
    .getElementById("renewalModal")
    .addEventListener("hidden.bs.modal", function () {
      processNextOverdueTicket(); // Al cerrar un modal, intenta abrir el siguiente
    });

  // Función para consultar todos los tickets con fecha de repuesto vencida
  function checkAllOverdueRepuestoTickets() {
    const xhr = new XMLHttpRequest();
    // ESTE ES EL NUEVO ENDPOINT QUE DEBES CREAR EN TU BACKEND
    xhr.open(
      "POST",
      `${ENDPOINT_BASE}${APP_PATH}api/consulta/getOverdueRepuestoTickets`
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (
            response.success &&
            Array.isArray(response.tickets) &&
            response.tickets.length > 0
          ) {
            overdueTicketsQueue = response.tickets; // Llenar la cola
            console.log("Tickets vencidos encontrados:", response);
            processNextOverdueTicket(); // Iniciar el procesamiento de la cola
          } else {
            console.log(
              "No hay tickets con fecha de repuesto vencida o error al obtenerlos."
            );
            // Opcional: Mostrar un SweetAlert si no hay tickets vencidos
            // Swal.fire({
            //     icon: 'info',
            //     title: 'Sin Notificaciones',
            //     text: 'No hay tickets pendientes por repuesto con fecha vencida.',
            //     timer: 3000,
            //     timerProgressBar: true
            // });
          }
        } catch (error) {
          console.error(
            "Error al parsear JSON de tickets vencidos:",
            error,
            xhr.responseText
          );
          Swal.fire({
            icon: "error",
            title: "Error de Datos",
            text: "Hubo un problema al procesar la información de tickets vencidos.",
          });
        }
      } else {
        console.error(
          "Error de conexión al obtener tickets vencidos:",
          xhr.status,
          xhr.statusText
        );
      
      }
    };
    xhr.onerror = function () {
      console.error("Error de red al obtener tickets vencidos.");
      Swal.fire({
        icon: "error",
        title: "Error de Red",
        text: "Problema de conexión al obtener tickets vencidos.",
      });
    };
    const datos = `action=getOverdueRepuestoTickets`; // Ajusta el action si es necesario
    xhr.send(datos); // Ajusta el action si es necesario
  }

  // ... (resto de tu código, incluyendo overdueTicketsQueue y processNextOverdueTicket) ...

  // Function to show the action modal for a specific ticket
  // ... (resto de tu código, incluyendo overdueTicketsQueue y processNextOverdueTicket) ...

  function showActionModalForTicket(ticket) {
    Swal.fire({
      title: "Notificacion",
      html: `El ticket con el Nro. <b>${ticket.nro_ticket}</b> se le ha vencido el tiempo de espera para la llegada de los repuestos (Fecha anterior: ${ticket.repuesto_date}). ¿Deseas poner otra fecha, enviar a gestión comercial o cambiar el estatus del ticket?<br><br>
               <div id="dateInputContainer" style="display: none;">
                   <b>Selecciona Nueva Fecha de Repuesto:</b><br>
                   <input type="date" id="swal-input-date" class="swal2-input">
               </div>`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      showDenyButton: true,
      denyButtonText: "Enviar a Gestión Comercial",
      showConfirmButton: true,
      confirmButtonText: "Renovar Fecha",
      color: "black",
      footer:
        '<button id="btn-change-status" class="swal2-styled">Cambiar Estatus del Ticket</button>',
      focusConfirm: false,
      allowOutsideClick: false,
      allowEscapeKey: false,

      preConfirm: () => {
        const dateInputContainer =
          document.getElementById("dateInputContainer");
        const newDateInput = document.getElementById("swal-input-date");
        const confirmBtn = Swal.getConfirmButton();

        // Fase 1: Mostrar el input de fecha
        if (dateInputContainer.style.display === "none") {
          dateInputContainer.style.display = "block"; // Mostrar el contenedor de la fecha
          newDateInput.focus(); // Opcional: enfocar el input de fecha
          if (confirmBtn) {
            confirmBtn.textContent = "Confirmar Renovación"; // Cambiar texto del botón
          }

          // Establecer el min y max del input type="date"
          const today = new Date();
          const minDate = today.toISOString().split("T")[0];

          const threeMonthsLater = new Date();
          threeMonthsLater.setMonth(today.getMonth() + 3);
          const maxDate = threeMonthsLater.toISOString().split("T")[0];

          newDateInput.setAttribute("min", minDate);
          newDateInput.setAttribute("max", maxDate);

          return false; // Mantiene el modal abierto
        } else {
          // Fase 2: Validar y procesar la fecha
          const newDate = newDateInput.value;

          if (!newDate) {
            return false;
          }

          const selectedDate = new Date(newDate + "T00:00:00");
          const today = new Date();
          const todayNormalized = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );

          const maxAllowedDate = new Date(
            today.getFullYear(),
            today.getMonth() + 3,
            today.getDate()
          );

          // --- VALIDACIONES ---
          // 1. No permitir fechas anteriores al día actual.
          if (selectedDate < todayNormalized) {
            return false;
          }

          // 2. No permitir fechas que excedan 3 meses a partir del día actual.
          if (selectedDate > maxAllowedDate) {
            return false;
          }

          // Si todas las validaciones pasan
          return {
            action: "renew",
            ticketId: ticket.id_ticket,
            newDate: newDate,
          };
        }
      },

      didOpen: (modalElement) => {
        const changeStatusButton =
          modalElement.querySelector("#btn-change-status");
        if (changeStatusButton) {
          changeStatusButton.addEventListener("click", () => {
            Swal.close();
            console.log("Cambiar estatus del ticket:", ticket.id_ticket);
            Swal.fire(
              "Estatus Cambiado",
              `El estatus del ticket ${ticket.nro_ticket} ha sido cambiado.`,
              "success"
            );
            overdueTicketsQueue = overdueTicketsQueue.filter(
              (t) => t.id_ticket !== ticket.id_ticket
            );
            processNextOverdueTicket();
          });
        }
        // Asegurar que el texto del botón de confirmar sea el inicial al abrir el modal
        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn) {
          confirmBtn.textContent = "Renovar Fecha";
        }
        // Asegurarse de que el contenedor de fecha esté oculto al abrir el modal
        const dateInputContainer =
          document.getElementById("dateInputContainer");
        if (dateInputContainer) {
          dateInputContainer.style.display = "none";
        }
        // Asegurarse de limpiar el input y los mensajes de error de SweetAlert
        const newDateInput = document.getElementById("swal-input-date");
        if (newDateInput) {
          newDateInput.value = "";
        }
        // ************ ESTA LÍNEA ES LA CLAVE PARA ELIMINAR EL SIGNO DE EXCLAMACIÓN INICIAL ************
      },
    }).then((result) => {
      // ... (resto de tu then callback) ...
      if (result.isConfirmed || result.isDenied) {
        overdueTicketsQueue = overdueTicketsQueue.filter(
          (t) => t.id_ticket !== ticket.id_ticket
        );
        processNextOverdueTicket();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        overdueTicketsQueue = overdueTicketsQueue.filter(
          (t) => t.id_ticket !== ticket.id_ticket
        );
        processNextOverdueTicket();
      }
    });
  }

  // Llama a esta función al cargar la página para buscar tickets vencidos
  checkAllOverdueRepuestoTickets();

  // === Lógica de Eventos Existente (ajustada para usar los nuevos elementos) ===

  // Evento para detectar el cambio en el select de Nuevo Estatus (changeStatusModal)
  modalNewStatusSelect.addEventListener("change", function () {
    const selectedOptionText =
      this.options[this.selectedIndex].textContent.trim();
    console.log("Opción seleccionada:", selectedOptionText);

    if (selectedOptionText === "Pendiente por repuesto") {
      // Asegúrate de la ortografía
      changeStatusModal.hide();
      rescheduleModal.show();

      // Configura la fecha mínima y máxima para el input date (ya existente)
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const currentDay = today.getDate();

      const minDate = new Date(currentYear, currentMonth, currentDay);
      rescheduleDateInput.min = minDate.toISOString().split("T")[0];

      const maxDate = new Date(currentYear, currentMonth + 3, currentDay);
      if (maxDate.getMonth() !== (currentMonth + 3) % 12) {
        maxDate.setDate(0);
      }
      rescheduleDateInput.max = maxDate.toISOString().split("T")[0];

      rescheduleDateInput.value = "";
      dateError.style.display = "none";
    }
  });

  // Validar la fecha cuando se seleccione o cambie en rescheduleModal
  rescheduleDateInput.addEventListener("change", function () {
    // ... (Tu lógica de validación de fecha existente para rescheduleDateInput) ...
    const selectedDate = new Date(this.value);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    selectedDate.setFullYear(currentYear);

    const maxMonth = (currentMonth + 3) % 12;
    const maxYear = currentMonth + 3 >= 12 ? currentYear + 1 : currentYear;

    const maxAllowedDate = new Date(maxYear, maxMonth + 1, 0);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    maxAllowedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      dateError.textContent =
        "La fecha seleccionada no puede ser anterior a hoy.";
      dateError.style.display = "block";
      saveRescheduleDateBtn.disabled = true;
    } else if (selectedDate > maxAllowedDate) {
      dateError.textContent =
        "La fecha no puede exceder 3 meses a partir del mes actual.";
      dateError.style.display = "block";
      saveRescheduleDateBtn.disabled = true;
    } else {
      dateError.style.display = "none";
      saveRescheduleDateBtn.disabled = false;
    }
  });

  // Lógica para el botón "Guardar Fecha" en el modal de reagendamiento (rescheduleModal)
  saveRescheduleDateBtn.addEventListener("click", function () {
    if (
      rescheduleDateInput.checkValidity() &&
      !saveRescheduleDateBtn.disabled
    ) {
      const id_status_lab = 5;
      const selectedDate = rescheduleDateInput.value;
      const ticketId = modalTicketIdInput.value; // Usar el ID del ticket del modal principal
      const id_user = document.getElementById("userId").value; // Usar el ID del usuario logueado
      if (!ticketId) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ID de ticket no disponible para guardar la fecha.",
        });
        return;
      }

      console.log(
        `Sending Ticket ID: ${ticketId}, New Repuesto Date: ${selectedDate} to backend.`
      );
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/consulta/updateRepuestoDate`
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                html: `Fecha de repuesto guardada con éxito: ${selectedDate}. <span style="color: red; font-weight: bold;">Debe guardar el estatus apenas cierre este modal.</span>`,
                showConfirmButton: true, // Asegura que el botón de confirmación sea visible
                confirmButtonText: 'Cerrar', // Opcional: Personaliza el texto del botón
                confirmButtonColor: '#3085d6', // Opcional: Personaliza el color del botón
                color: 'black', // Opcional: Personaliza el color de fondo del modal
              }).then(() => {
                rescheduleModal.hide();
                location.reload(); 
                // Aquí podrías recargar la tabla de tickets o actualizar solo ese ticket en la UI
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text:
                  "Error al guardar la fecha de repuesto: " +
                  (response.message || "Mensaje de error no disponible."),
              });
            }
          } catch (e) {
            Swal.fire({
              icon: "error",
              title: "Error de Servidor",
              text: "Error al procesar la respuesta del servidor.",
            });
            console.error(
              "Error al parsear la respuesta JSON:",
              e,
              xhr.responseText
            );
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error de Conexión",
            text: `Error de conexión o servidor: ${xhr.status} - ${xhr.statusText}`,
          });
        }
      };
      xhr.onerror = function () {
        Swal.fire({
          icon: "error",
          title: "Error de Red",
          text: "No se pudo conectar con el servidor.",
        });
      };
      const data = `action=updateRepuestoDate&ticket_id=${ticketId}&repuesto_date=${selectedDate}&id_user=${id_user}&id_status_lab=${id_status_lab}`;
      xhr.send(data);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Campo Requerido",
        text: "Por favor, selecciona una fecha válida.",
      });
      dateError.textContent = "Por favor, selecciona una fecha válida.";
      dateError.style.display = "block";
    }
  });

  // Validar la fecha cuando se seleccione o cambie en renewalModal (YA EXISTENTE)
  renewalDateInput.addEventListener("change", function () {
    // ... (Tu lógica de validación de fecha existente para renewalDateInput) ...
    const selectedDate = new Date(this.value);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    selectedDate.setFullYear(currentYear);

    const maxMonth = (currentMonth + 3) % 12;
    const maxYear = currentMonth + 3 >= 12 ? currentYear + 1 : currentYear;

    const maxAllowedDate = new Date(maxYear, maxMonth + 1, 0);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    maxAllowedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      renewalDateError.textContent =
        "La fecha seleccionada no puede ser anterior a hoy.";
      renewalDateError.style.display = "block";
      renewDateBtn.disabled = true;
    } else if (selectedDate > maxAllowedDate) {
      renewalDateError.textContent =
        "La fecha no puede exceder 3 meses a partir del mes actual.";
      renewalDateError.style.display = "block";
      renewDateBtn.disabled = true;
    } else {
      renewalDateError.style.display = "none";
      renewDateBtn.disabled = false;
    }
  });

  // "Renovar" button logic in renewalModal
  renewDateBtn.addEventListener("click", function () {
    if (renewalDateInput.checkValidity() && !renewDateBtn.disabled) {
      const newRenewalDate = renewalDateInput.value;
      const ticketId = renewalModalTicketId.value; // Obtiene el ID del ticket del input hidden del modal

      if (!ticketId) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ID de ticket no disponible para renovar la fecha.",
        });
        return;
      }

      console.log(
        `Renovando fecha de repuesto para Ticket ID: ${ticketId} a: ${newRenewalDate}`
      );
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/conuslta/renewRepuestoDate`
      ); // Endpoint para renovar
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "¡Renovado!",
                text:
                  "Fecha de repuesto renovada con éxito a: " + newRenewalDate,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              }).then(() => {
                renewalModal.hide(); // Oculta el modal actual
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text:
                  "Error al renovar la fecha: " +
                  (response.message || "Mensaje de error no disponible."),
              });
            }
          } catch (e) {
            Swal.fire({
              icon: "error",
              title: "Error de Servidor",
              text: "Error al procesar la respuesta del servidor.",
            });
            console.error(
              "Error al parsear la respuesta JSON:",
              e,
              xhr.responseText
            );
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error de Conexión",
            text: `Error de conexión o servidor: ${xhr.status} - ${xhr.statusText}`,
          });
        }
      };
      xhr.onerror = function () {
        Swal.fire({
          icon: "error",
          title: "Error de Red",
          text: "No se pudo conectar con el servidor.",
        });
      };
      const data = `action=renewRepuestoDate&ticket_id=${ticketId}&new_repuesto_date=${newRenewalDate}&id_user=${id_user}`;
      xhr.send(data);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Campo Requerido",
        text: "Por favor, selecciona una fecha válida para renovar.",
      });
      renewalDateError.textContent =
        "Por favor, selecciona una fecha válida para renovar.";
      renewalDateError.style.display = "block";
    }
  });

  // "Enviar a Gestión Comercial" button logic in renewalModal
  sendToCommercialBtn.addEventListener("click", function () {
    const ticketId = renewalModalTicketId.value; // Obtiene el ID del ticket del input hidden del modal

    if (!ticketId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de ticket no disponible para enviar a gestión comercial.",
      });
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas enviar el ticket ${ticketId} a Gestión Comercial?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Enviando Ticket ID: ${ticketId} a Gestión Comercial.`);
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${ENDPOINT_BASE}${APP_PATH}api/ticket/sendToCommercial`
        ); // Endpoint para enviar a comercial
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        xhr.onload = function () {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.success) {
                Swal.fire({
                  icon: "success",
                  title: "¡Enviado!",
                  text: "Ticket enviado a Gestión Comercial.",
                  timer: 2000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                }).then(() => {
                  renewalModal.hide(); // Oculta el modal actual
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text:
                    "Error al enviar a Gestión Comercial: " +
                    (response.message || "Mensaje de error no disponible."),
                });
              }
            } catch (e) {
              Swal.fire({
                icon: "error",
                title: "Error de Servidor",
                text: "Error al procesar la respuesta del servidor.",
              });
              console.error(
                "Error al parsear la respuesta JSON:",
                e,
                xhr.responseText
              );
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Error de Conexión",
              text: `Error de conexión o servidor: ${xhr.status} - ${xhr.statusText}`,
            });
          }
        };
        xhr.onerror = function () {
          Swal.fire({
            icon: "error",
            title: "Error de Red",
            text: "No se pudo conectar con el servidor.",
          });
        };
        const data = `action=sendToCommercial&ticket_id=${ticketId}`;
        xhr.send(data);
      }
    });
  });

  // NUEVO: "Cambiar Estatus del Ticket" button logic in renewalModal
  changeStatusFromRenewalBtn.addEventListener("click", function () {
    const ticketId = renewalModalTicketId.value; // Obtiene el ID del ticket actual
    const currentStatusName = renewalModalCurrentStatusName.value;
    const currentStatusId = renewalModalCurrentStatusId.value; // Si lo necesitas para pre-seleccionar

    if (!ticketId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de ticket no disponible para cambiar estatus.",
      });
      return;
    }

    // 1. Ocultar el modal de renovación
    renewalModal.hide();

    // 2. Pre-llenar el modal de cambio de estatus
    modalTicketIdInput.value = ticketId;
    modalCurrentStatusInput.value = currentStatusName; // Mostrar el estatus actual

    // 3. (Opcional) Re-cargar las opciones del select de estatus, excluyendo el actual
    // Si tu getStatusLab ya excluye el currentStatusNameToExclude, puedes usarlo aquí.
    // O si quieres que muestre todos, simplemente no pases el parámetro.
    getStatusLab(currentStatusName); // Si getStatusLab filtra, pasa el nombre actual.

    // 4. Mostrar el modal de cambio de estatus
    changeStatusModal.show();
  });
});
