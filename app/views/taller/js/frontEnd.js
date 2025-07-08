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
        razonsocial_cliente: "Razón Social",
        full_name_tecnicoassignado: "Técnico Asignado",
        fecha_envio_a_taller: "Fecha Envío a Taller",
        name_status_payment: "Estatus Pago",
        name_status_lab: "Estatus Taller",
        name_accion_ticket: "Acción Ticket",
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
                                /*if (key === "name_status_ticket") {
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
                                columnsConfig.push(columnDef);
                            }
                        }

                        // Añadir la columna de "Acciones" al final
                        columnsConfig.push({
                            data: null,
                            title: "Acciones",
                            orderable: false,
                            searchable: false,
                            width: "8%",
                            render: function (data, type, row) {
                                const idTicket = row.id_ticket;
                                const currentStatus = row.name_status_lab;

                                if (currentStatus !== "Reparado" && currentStatus !== "Irreparable") {
                                    return `<button type="button" id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-btn" 
                                                data-bs-toggle="modal" 
                                                data-bs-target="#changeStatusModal" 
                                                data-id="${idTicket}" 
                                                data-current-status="${currentStatus}">
                                                Cambiar Estatus
                                            </button>`;
                                } else {
                                    return `<button class="btn btn-secondary btn-sm" disabled>Cerrado</button>`;
                                }
                            },
                        });

                        // === ADD "CARGA DE LLAVE" COLUMN ===
                        // It's a calculated column, so its data source is `null`
                        columnsConfig.push({
                            data: null,
                            title: "Carga de Llave",
                            orderable: false,
                            searchable: false,
                            visible: true,
                            className: "dt-body-center",
                            render: function (data, type, row) {
                                // Verifica si el ticket ya tiene una fecha de recepción de llave
                                const hasReceiveKeyDate = row.date_receivekey !== null && row.date_receivekey !== undefined && String(row.date_receivekey).trim() !== '';

                                if (row.name_status_lab === "Reparado") {
                                    // Si ya tiene fecha de recepción, lo marca y deshabilita
                                    return `<input type="checkbox" class="receive-key-checkbox" data-id-ticket="${row.id_ticket}" ${hasReceiveKeyDate ? 'checked disabled' : ''}>`;
                                } else {
                                    return "";
                                }
                            },
                        });

                        // Initialize DataTables
                        const dataTableInstance = $(tableElement).DataTable({ // <--- Changed var to const and made it accessible
                            scrollX: '200px',
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
                                info: "Mostrando página _PAGE_ de _PAGES_ ( _TOTAL_ registro(s) )",
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

                                // The ticketId here needs to match the actual data property (id_ticket)
                                // since rowData is now an object, not an array by index.
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
                                                '__DIR__ . "/../../../public/img/consulta_rif/POS/mantainment.png';
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

    xhr.send();
}

    function formatTicketDetailsPanel(d) {
    // d es el objeto `data` completo del ticket

    // La imageUrl inicial puede ser una imagen de "cargando" o un placeholder.
    const initialImageUrl = "assets/img/loading-placeholder.png"; // Asegúrate de tener esta imagen
    const initialImageAlt = "Cargando imagen del dispositivo...";

    return `<div class="container-fluid">
                <div class="row mb-3 align-items-center">
                    <div class="col-md-3 text-center">
                        <div id="device-image-container" class="p-2">
                        <img id="device-ticket-image" src="${initialImageUrl}" alt="${initialImageAlt}" class="img-fluid rounded" style="max-width: 120px; height: auto; object-fit: contain;">
                        </div>
                    </div>
                    <div class="col-md-9">
                        <h4 style = "color: black;">Ticket #${d.id_ticket}</h4>
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
                                <strong><div>Fecha Instalación:</div></strong><br>
                                ${d.fecha_instalacion}
                            </div>
                            <div class="col-sm-6 mb-2">
                                <strong><div>Creación ticket:</div></strong><br>
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
                        <h5 style = "color: black;">Gestión / Historial:</h5>
                        <div id="ticket-history-content">
                            <p>Selecciona un ticket para cargar su historial.</p>
                        </div>
                    </div>
                </div>
            </div>
        `};


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
    url: `${ENDPOINT_BASE}${APP_PATH}api/historical/GetTicketHistory`,
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
          headerStyle = "background-color: #212529;"; // Gris claro de Bootstrap 'light'
          textColor = "color: #212529;"; // Texto oscuro de Bootstrap 'dark'
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

// Call getTicketData when the document is ready using jQuery
$(document).ready(function () {
    getTicketData();

    // --- NUEVA LÓGICA PARA EL CHECKBOX DE "CARGA DE LLAVE" ---
    $('#tabla-ticket').on('change', '.receive-key-checkbox', function() {
        const checkbox = $(this);
        const idTicket = checkbox.data('id-ticket');

        if (checkbox.is(':checked')) {
            Swal.fire({
            title: "¿Seguro que ya cargaste las llaves?",
            text: "Esta acción registrará la fecha de recepción de la llave.",
            icon: "warning",
            showCancelButton: true,
            showCloseButton: true, // Agrega esta línea para mostrar el botón de cerrar (X)
            confirmButtonColor: "#003594",
            confirmButtonClass: 'swal2-confirm-hover-green', // Clase personalizada para el hover
            cancelButtonColor: "#6c757d", // Color inicial gris (ajusta si quieres otro color inicial)
            cancelButtonClass: 'swal2-cancel-hover-red', // Clase personalizada para el hover
            confirmButtonText: "Sí, cargar fecha",
            cancelButtonText: "Cancelar",
            color: "#000000" // Color del texto general del modal
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma, llamar a la función para guardar la fecha
                    saveKeyReceiveDate(idTicket);
                } else {
                    // Si el usuario cancela, desmarcar el checkbox
                    checkbox.prop('checked', false);
                }
            });
        }
        // Si el checkbox se desmarca, no hacemos nada o puedes añadir otra lógica si lo necesitas.
    });

    // --- NUEVA FUNCIÓN PARA ENVIAR LA FECHA AL SERVIDOR ---
    function saveKeyReceiveDate(idTicket) {
        const id_user = document.getElementById("userId").value; // Asumiendo que tienes el ID del usuario logueado

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateKeyReceiveDate`); // Nuevo endpoint
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = function() {
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
                            "No se pudo guardar la fecha: " + (response.message || "Error desconocido"),
                            "error"
                        );
                        // Desmarcar el checkbox si falla el guardado
                        $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop('checked', false);
                    }
                } catch (error) {
                    Swal.fire(
                        "Error",
                        "Error al procesar la respuesta del servidor.",
                        "error"
                    );
                    $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop('checked', false);
                    console.error("Error parsing JSON for key date update:", error);
                }
            } else {
                Swal.fire(
                    "Error",
                    `Error de conexión: ${xhr.status} ${xhr.statusText}`,
                    "error"
                );
                $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop('checked', false);
                console.error("Error in XHR for key date update:", xhr.status, xhr.statusText);
            }
        };

        xhr.onerror = function() {
            Swal.fire(
                "Error de red",
                "No se pudo conectar con el servidor para guardar la fecha.",
                "error"
            );
            $(`.receive-key-checkbox[data-id-ticket="${idTicket}"]`).prop('checked', false);
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

                        if (response.success === true) {
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

                            // *** IMPORTANTE: Elimina estas líneas de tu código original, ya que las acciones
                            // se moverán al bloque .then() del SweetAlert o serán manejadas por location.reload()
                            // hideCustomModal(); // Ya no es necesario
                            // getTicketData(); // Ya no es necesario aquí
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
                            errorMessageDiv.innerHTML = `Error ${xhr.status}: ${errorMsg || xhr.statusText
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
                    console.log("Select:", select);

                    select.innerHTML = '<option value="" disabled selected hidden>Seleccione</option>'; // Limpiar y agregar la opción por defecto
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

document.addEventListener("DOMContentLoaded", getStatusLab);


