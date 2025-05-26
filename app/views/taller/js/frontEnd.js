function getTicketData() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketDataLab`);

  const tableElement = document.getElementById("tabla-ticket");
  // Asegúrate de que estos elementos existan en tu HTML
  // Si no existen, estas líneas podrían causar un error
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
    create_ticket: "Fecha Creacion",
    serial_pos: "Serial POS",
    full_name_tecnicoassignado: "Técnico Asignado",
    fecha_envio_a_taller: "Fecha Envío a Taller",
    name_process_ticket: "Proceso Ticket",
    name_status_payment: "Estatus Pago",
    name_status_lab: "Estatus Taller",
    name_accion_ticket: "Acción Ticket",
    name_status_ticket: "Estatus Ticket",
    name_failure: "Falla",
    date_send_torosal_fromlab: "Fecha Envío a Rosal",
    date_sendkey: "Fecha Envío Key",
    date_receivekey: "Fecha Recibo Key",
    date_receivefrom_desti: "Fecha Recibo Destino",
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
              // Limpiar headers y body solo si el elemento existe
              if (theadElement) theadElement.innerHTML = ""; // Clear old headers
              if (tbodyElement) tbodyElement.innerHTML = ""; // Clear old body
            }

            // Determine all possible columns from the data (based on the first row)
            const allDataKeys = Object.keys(TicketData[0] || {});

            const columnsConfig = [];

            // Build the column configuration for DataTables
            // Iterate over the keys defined in columnTitles to maintain order and ensure correct titles
            for (const key in columnTitles) {
              // Only include if the key actually exists in the data from the API
              if (allDataKeys.includes(key)) {
                // La columna es visible si al menos una fila tiene datos significativos
                const isVisible = TicketData.some((item) => {
                  const value = item[key];
                  // Considera "con datos" si el valor NO es null, NO es undefined, y
                  // si es una cadena, no está vacía o solo con espacios.
                  return (
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
                  );
                });

                const columnDef = {
                  data: key,
                  title: columnTitles[key],
                  defaultContent: "", // Muestra una cadena vacía si el valor es null o undefined
                  visible: isVisible,
                };

                // Lógica para aplicar estilo al estado del ticket
                if (key === "name_status_ticket") {
                  columnDef.render = function (data, type, row) {
                    let statusText = String(data || "").trim(); // Asegurarse de que data sea string y trim
                    let statusColor = "gray"; // Color por defecto

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
                      // Agrega más casos según tus estatus y colores deseados
                      // case 'Cerrado':
                      //     statusColor = '#F44336'; // Rojo
                      //     break;
                      default:
                        if (statusText === "") {
                          // Si el valor es vacío o solo espacios, se muestra como vacío
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

            // Añadir la columna de "Acciones" al final
            columnsConfig.push({
              data: null,
              title: "Acciones",
              orderable: false,
              searchable: false,
              width: "8%",
              render: function (data, type, row) {
                const idTicket = row.id_ticket;
                const currentStatus = row.name_status_lab; // Asegúrate de usar la propiedad correcta para el estatus

                if (currentStatus !== "Cerrado") {
                  // *** ESTE ES EL CAMBIO CLAVE ***
                  // Añade los atributos data-bs-toggle y data-bs-target directamente al botón.
                  // La clase `open-status-modal-btn` ya no es estrictamente necesaria para abrir el modal
                  // (Bootstrap lo hace con los data-bs-toggle/target), pero la mantendremos si la usas para otra lógica.
                  return `<button type="button"  id="BtnChange" class="btn btn-primary btn-sm cambiar-estatus-btn" 
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
                  className: "btn btn-secondary", // Add Bootstrap styling to the button
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
                  // Language for buttons, specifically colvis
                  colvis: "Visibilidad de Columna",
                },
              },
            });

            if (tableContainer) {
              tableContainer.style.display = ""; // Show the table container
            }
          } else {
            // Si no hay TicketData o está vacío
            if (tableContainer) {
              tableContainer.innerHTML = "<p>No hay datos disponibles.</p>";
              tableContainer.style.display = "";
            }
          }
        } else {
          // Si response.success es false
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
        // Error al parsear JSON
        if (tableContainer) {
          tableContainer.innerHTML = "<p>Error al procesar la respuesta.</p>";
          tableContainer.style.display = "";
        }
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      // Manejo de error 404
      if (tableContainer) {
        tableContainer.innerHTML =
          "<p>No se encontraron datos (API endpoint no encontrado).</p>";
        tableContainer.style.display = "";
      }
    } else {
      // Otros errores HTTP
      if (tableContainer) {
        tableContainer.innerHTML = `<p>Error de conexión: ${xhr.status} ${xhr.statusText}</p>`;
        tableContainer.style.display = "";
      }
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    // Error de red
    if (tableContainer) {
      tableContainer.innerHTML = "<p>Error de red.</p>";
      tableContainer.style.display = "";
    }
    console.error("Error de red");
  };

  xhr.send();
}

// Call getTicketData when the document is ready using jQuery
$(document).ready(function () {
  getTicketData();

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
  const modalCommentsInput = changeStatusModal
    ? changeStatusModal.querySelector("#modalComments")
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
        modalNewStatusSelect.value = currentStatus;
      }
      if (modalCommentsInput) {
        modalCommentsInput.value = "";
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
              Swal.fire({
                title: "¡Éxito!",
                text: "Estatus del ticket actualizado correctamente.",
                icon: "success",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#28a745",
                color: "black",
                timer: 1500,
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

      const datos = `action=UpdateTicketStatus&id_ticket=${idTicket}&id_new_status=${newStatus}`;
      xhr.send(datos);
    }
  }
});

function getStatusLab() {
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
              const option = document.createElement("option");
              option.value = status.id_status_lab;
              option.textContent = status.name_status_lab;
              select.appendChild(option);
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
