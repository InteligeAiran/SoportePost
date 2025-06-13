let modalInstance;
let currentTicketId = null;

function getTicketData() {
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
          const modalElement = document.getElementById("staticBackdrop");
          const detailsPanel = document.getElementById("ticket-details-panel"); // Referencia al panel de detalles

          // Limpiar el panel de detalles al cargar nuevos datos de la tabla
          detailsPanel.innerHTML =
            "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

          const dataForDataTable = [];

          TicketData.forEach((data) => {
            dataForDataTable.push([
              data.id_ticket,
              data.rif,
              data.razonsocial_cliente,
              data.create_ticket,
              data.name_accion_ticket,
              data.nro_ticket,
              // Acciones
              `
                            <button id="myUniqueAssingmentButton"
                                class="btn btn-sm btn-assign-tech"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Asignar Técnico"
                                data-ticket-id="${data.id_ticket}"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/></svg>
                            </button>`,
            ]);
          });

          // Inicialización de DataTables
          const dataTableInstance = $("#tabla-ticket").DataTable({
            data: dataForDataTable,
            scrollX: "200px",
            responsive: false,
            pagingType: "simple_numbers",
            lengthMenu: [[5, 10], ['5', '10']],      
            autoWidth: false,
            columns: [
              { title: "ID ticket" },
              { title: "RIF" },
              { title: "Raz&oacuten Social" },
              { title: "Fecha Creacion" },
              { title: "Acción Ticket" },
              { title: "Nro Ticket" },
              { title: "Acciones", orderable: false },
            ],
            language: {
              lengthMenu: "Mostrar _MENU_ Registros",
              emptyTable: "No hay Resultados disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
              infoEmpty: "No hay datos disponibles",
              infoFiltered: " de _MAX_ Disponibles",
              search: "Buscar:",
              loadingRecords: "Buscando...",
              processing: "Procesando...",
              paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior",
              },
            },
            // ************ CAMBIOS CLAVE AQUI ************
            // ... tu configuración de DataTables ...
            dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
            initComplete: function (settings, json) {
                const buttonsHtml = `
                    <button id="btn-asignados" class="btn btn-primary me-2">Asignados</button>
                    <button id="btn-por-asignar" class="btn btn-secondary">Por Asignar</button>
                `;
                $(".dt-buttons-container").html(buttonsHtml);

                // ************* INICIO CAMBIOS PARA LOS BOTONES *************

                // Función para manejar la selección de botones
                function setActiveButton(activeButtonId) {
                    // Remover clases de los botones y añadir las clases correctas
                    $("#btn-asignados").removeClass("btn-primary btn-secondary");
                    $("#btn-por-asignar").removeClass("btn-primary btn-secondary");

                    if (activeButtonId === "btn-asignados") {
                        $("#btn-asignados").addClass("btn-primary");
                        $("#btn-por-asignar").addClass("btn-secondary");
                    } else {
                        $("#btn-asignados").addClass("btn-secondary");
                        $("#btn-por-asignar").addClass("btn-primary");
                    }
                }

                // Inicialmente, establecer "Asignados" como activo (porque el filtro por defecto lo será)
                setActiveButton("btn-asignados");

                $("#btn-asignados").on("click", function () {
                    dataTableInstance
                        .column(4)
                        .search("Asignado al Técnico")
                        .draw();
                    setActiveButton("btn-asignados"); // Llamar a la función para actualizar el estilo
                });

                $("#btn-por-asignar").on("click", function () {
                    dataTableInstance
                        .column(4)
                        .search("Asignado al Coordinador")
                        .draw();
                    setActiveButton("btn-por-asignar"); // Llamar a la función para actualizar el estilo
                });
                // ************* FIN CAMBIOS PARA LOS BOTONES *************
            },
// ... el resto de tu configuración de DataTables ...
            // ************ FIN CAMBIOS CLAVE ************
          });

          $("#tabla-ticket").resizableColumns();

          $("#tabla-ticket tbody")
            .off("click", "tr")
            .on("click", "tr", function () {
              const tr = $(this);
              const rowData = dataTableInstance.row(tr).data();

              if (!rowData) {
                return;
              }

              $("#tabla-ticket tbody tr").removeClass("table-active");
              tr.addClass("table-active");

              const ticketId = rowData[0];

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
                    imgElement.src =
                      '__DIR__ . "/../../../public/img/consulta_rif/POS/mantainment.png';
                    imgElement.alt = "Serial no disponible";
                  }
                }
              } else {
                detailsPanel.innerHTML =
                  "<p>No se encontraron detalles para este ticket.</p>";
              }
            });

          $("#tabla-ticket tbody")
            .off("click", ".btn-assign-tech")
            .on("click", ".btn-assign-tech", function (e) {
              e.stopPropagation();
              const ticketId = $(this).data("ticket-id");
              currentTicketId = ticketId;
              const modalBootstrap = new bootstrap.Modal(modalElement, {
                backdrop: "static",
              });
              modalInstance = modalBootstrap;
              modalBootstrap.show();
            });
        } else {
          tbody.innerHTML = '<tr><td colspan="9">Error al cargar</td></tr>';
          console.error("Error:", response.message);
        }
      } catch (error) {
        tbody.innerHTML =
          '<tr><td colspan="9">Error al procesar la respuesta</td></tr>';
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      tbody.innerHTML =
        '<tr><td colspan="9">No se encontraron usuarios</td></tr>';
    } else {
      tbody.innerHTML = '<tr><td colspan="9">Error de conexión</td></tr>';
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td colspan="9">Error de conexión</td></tr>';
    console.error("Error de red");
  };
  const datos = `action=GetTicketData`;
  xhr.send(datos);
}

function formatTicketDetailsPanel(d) {
    // d es el objeto `data` completo del ticket

    // La imageUrl inicial puede ser una imagen de "cargando" o un placeholder.
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
                    <h4>Ticket #${d.id_ticket}</h4>
                    <hr class="mt-2 mb-3">
                    <div class="row">
                        <div class="col-sm-6 mb-2">
                            <strong><div>Serial POS:</div></strong><br>
                            ${d.serial_pos}
                        </div>
                        <div class="col-sm-6 mb-2">
                             <strong><div>Estatus POS:</div></strong><br>
                            ${d.estatus_inteliservices}
                        </div>
                        <div class="col-sm-6 mb-2">
                             <strong><div>Fecha Instalación POS:</div></strong><br>
                            ${d.fecha_instalacion}
                        </div>
                        <div class="col-sm-6 mb-2">
                             <strong><div>Fecha Creación ticket:</div></strong><br>
                            ${d.create_ticket}
                        </div>
                        <div class="col-sm-6 mb-2">
                             <strong><div>Usuario Gestión:</div></strong><br>
                            ${d.full_name_tecnico}
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-12">
                    <div class="row">
                        <div class="col-sm-4 mb-2">
                             <strong><div>Acción:</div></strong><br>
                            ${d.name_accion_ticket}
                        </div>
                        <div class="col-sm-8 mb-2">
                             <strong><div>Falla:</div></strong><br>
                            ${d.name_failure}
                        </div>
                        <div class="col-sm-4 mb-2">
                             <strong><div>Proceso:</div></strong><br>
                            ${d.name_process_ticket}
                        </div>
                        <div class="col-sm-8 mb-2">
                             <strong><div>Estatus Ticket:</div></strong><br>
                            ${d.name_status_ticket}
                        </div>
                    </div>
                </div>
            </div>

            <hr class="mt-2 mb-3">

            <div class="row">
                <div class="col-12">
                    <h5>Gestión / Historial:</h5>
                    <div id="ticket-history-content">
                        <p>Selecciona un ticket para cargar su historial.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
// =============================================================================
// Función para descargar y mostrar la imagen del dispositivo
// Ahora adaptada para actualizar la imagen en el panel de detalles del ticket.
// =============================================================================
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

// Opcional: Función para cargar historial si tienes una API separada para ello

function loadTicketHistory(ticketId) {
  // 1. Obtener el contenedor del historial y mostrar mensaje de carga (usando jQuery)
  const historyPanel = $("#ticket-history-content");
  historyPanel.html(
    '<p class="text-center text-muted">Cargando historial...</p>'
  ); // Usar .html() de jQuery

  // 2. Crear y configurar la solicitud AJAX (usando jQuery.ajax)
  $.ajax({
    url: `${ENDPOINT_BASE}${APP_PATH}api/historical/GetTicketHistory`,
    type: "POST",
    data: {
      // jQuery formatea esto automáticamente a 'application/x-www-form-urlencoded'
      action: "GetTicketHistory",
      id_ticket: ticketId,
    },
    dataType: "json", // Le decimos a jQuery que esperamos una respuesta JSON
    success: function (response) {
      console.log("Historial recibido:", response.history);

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
          headerStyle = "background-color: #212529;"; // Gris claro de Bootstrap 'light'
          textColor = "color: #212529;"; // Texto oscuro de Bootstrap 'dark'
          statusHeaderText = ""; // Sin texto extra por defecto

          if (item.name_status_ticket) {
            console.log(item.name_status_ticket);
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

          historyHtml += `
                        <div class="card mb-3 custom-history-card"> <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                            data-toggle="collapse" data-target="#${collapseId}"
                                            aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="${collapseId}"
                                            style="${textColor}">
                                        ${item.fecha_de_cambio} - ${item.name_accion_ticket}${statusHeaderText}
                                    </button>
                                </h2>
                            </div>
                            <div id="${collapseId}" class="collapse ${index === 0 ? 'show' : ''}"
                                aria-labelledby="${headingId}" data-parent="#ticketHistoryAccordion">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <th class="text-start" style="width: 40%;">Fecha y Hora:</th>
                                                    <td>${item.fecha_de_cambio || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Acción:</th>
                                                    <td>${item.name_accion_ticket || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Operador de Gestión:</th>
                                                    <td>${item.full_name_tecnico_gestion || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td>${item.full_name_coordinador || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Ticket:</th>
                                                    <td>${item.name_status_ticket || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Laboratorio:</th>
                                                    <td>${item.name_status_lab || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Domiciliación:</th>
                                                    <td>${item.name_status_domiciliacion || 'N/A'}</td>
                                                </tr>
                                                 <tr>
                                                    <th class="text-start">Estatus Pago:</th>
                                                    <td>${item.name_status_payment || 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        });

        historyHtml += "</div>"; // Cierre del acordeón principal
        historyPanel.html(historyHtml); // Insertar el HTML generado (con jQuery)

        // === IMPORTANTE: RE-INICIALIZAR COMPONENTES DE BOOTSTRAP SI ES NECESARIO ===
        // Para Bootstrap 4, los atributos data-toggle/data-parent usualmente se "enganchan"
        // automáticamente si jQuery y Bootstrap JS están cargados.
        // No necesitas una inicialización explícita como en Bootstrap 5.
        // El problema suele ser que los atributos data-toggle/data-parent están mal,
        // o jQuery/Bootstrap JS no están cargados.

        // Reiniciar tooltips (si usas Bootstrap 4, la sintaxis es diferente para dispose/init)
        if ($.fn && $.fn.tooltip) {
          // Para Bootstrap 4, los tooltips se manejan así:
          $('[data-toggle="tooltip"]').tooltip("dispose"); // Asegúrate de que el atributo es data-toggle
          $('[data-toggle="tooltip"]').tooltip(); // Y se inicializan con data-toggle
        }

        // Aquí no se necesita `new bootstrap.Collapse` porque eso es para JS nativo de Bootstrap 5.
        // Con jQuery y Bootstrap 4, la magia ocurre a través de los atributos data-toggle y data-parent
        // una vez que el HTML está en el DOM y las librerías cargadas.
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

document.addEventListener("DOMContentLoaded", function () {
  getTicketData(); // Llama a la función para cargar los datos

  // Obtén la referencia al botón cerrar FUERA de la función getTicketData y del bucle
  const cerrar = document.getElementById("close-button");
  const icon = document.getElementById("Close-icon");
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

  icon.addEventListener("click", function () {
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
//console.log('FrontEnd.js loaded successfully!');

function AssignTicket() {
  const id_tecnico_asignado = document.getElementById("idSelectionTec").value;
  /*console.log('ID del ticket a asignar:', currentTicketId); // Agrega un log más descriptivo
    console.log('ID del ticket a asignar:', currentTicketId); // Agrega un log más descriptivo*/

  if (!currentTicketId || !id_tecnico_asignado) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, selecciona un ticket antes de asignar un técnico.",
      color: "black",
    });
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/AssignTicket`); // Asegúrate de que esta sea la ruta correcta en tu backend
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Asignado",
            text: response.message,
            color: "black",
            timer: 2500,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
            willClose: () => {
              setTimeout(() => {
                location.reload(); // Recarga la página después del temporizador
              }, 3000);
            },
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

function getTecnico2() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTecnico2`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("idSelectionTec");

          select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
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

            // Agregar un event listener para cuando se cambia la selección del técnico
            select.addEventListener("change", function () {
              const selectedTecnicoId = this.value;
              if (selectedTecnicoId) {
                GetRegionUser(selectedTecnicoId);
              } else {
                document.getElementById("InputRegion").value = ""; // Limpiar el campo de región si no se selecciona nada
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

  const datos = `action=GetTecnico2`; // Asegúrate de que esta acción en el backend devuelva los técnicos filtrados
  xhr.send(datos);
}

// Llama a la función para cargar las fallas cuando la página se cargue

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
          const region = response.regionusers || ""; // Asegúrate de que la respuesta contenga la regió

          if (region) {
            inputRegion.value = region;
          } else {
            inputRegion.value = ""; // Limpiar el campo si no hay región
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
  console.log("ID del usuario para obtener la región:", id_user);
  const datos = `action=GetRegionUsersAssign&id_user=${encodeURIComponent(
    id_user
  )}`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getTecnico2);
