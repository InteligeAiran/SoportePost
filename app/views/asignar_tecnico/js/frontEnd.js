// Instancias de los modales de Bootstrap (las inicializaremos cuando el DOM esté listo)
let modalInstance;
let currentTicketId = null;
let modalInstanceCoordinator;
let confirmReassignModalInstance = null;
let selectTechnicianModalInstance = null;
let inputTecnicoActual = null;


// --- Función para obtener el técnico actual y la lista de técnicos ---
// --- DOMContentLoaded para inicializar los modales y eventos ---
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar instancias de los modales de Bootstrap
  confirmReassignModalInstance = new bootstrap.Modal(
    document.getElementById("confirmReassignModal"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  selectTechnicianModalInstance = new bootstrap.Modal(
    document.getElementById("selectTechnicianModal"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );

  const buttoncerrar = document.getElementById("noConfirm");

  if (buttoncerrar && confirmReassignModalInstance) {
    buttoncerrar.addEventListener("click", function () {
      confirmReassignModalInstance.hide(); // Oculta el modal de confirmación
    });
  }

  const bottonOpenModal = document.getElementById("confirmReassignYesBtn");
  const bottonCerrar = document.getElementById("ButtonCancel");

  // !!! AQUI ES DONDE ESTÁ EL CAMBIO CRÍTICO !!!
  if (bottonOpenModal && confirmReassignModalInstance) {
    bottonOpenModal.addEventListener("click", async function () {
      // Agrega 'async' aquí
      confirmReassignModalInstance.hide(); // Oculta el modal de confirmación

      // Solo si tenemos un currentTicketId, intentamos cargar los datos del técnico
      if (currentTicketId) {
        try {
          // Carga los datos del técnico ANTES de mostrar el modal de selección
          // AWAIT es crucial aquí para esperar que la promesa se resuelva
          await getTechnicianData(currentTicketId);
          getTecnico21(inputTecnicoActual);
          selectTechnicianModalInstance.show(); // Muestra el modal de selección de técnico
        } catch (error) {
          console.error(
            "Error al cargar datos de técnicos para reasignación:",
            error
          );
          alert(
            "No se pudieron cargar los técnicos para reasignar. Por favor, intente de nuevo."
          );
        }
      } else {
        console.error("Error: No se ha seleccionado un ticket para reasignar.");
        alert("No se pudo reasignar el ticket. Seleccione uno de la tabla.");
      }
    });
  }

  if (bottonCerrar && selectTechnicianModalInstance) {
    bottonCerrar.addEventListener("click", function () {
      selectTechnicianModalInstance.hide(); // Oculta el modal de selección de técnico
      // Limpia los valores de los elementos en el modal de selección de técnico
      const technicianSelect = document.getElementById("technicianSelect");
      const currentTechnicianName = document.getElementById("currentTechnicianDisplay")
      const dateoldtec = document.getElementById("currentAssignmentDateDisplay");
      const currentRegionTec = document.getElementById("currentRegion");
      const inputRegnew = document.getElementById("InputRegionUser2");
      technicianSelect.value = "";
      currentTechnicianName.textContent = "";
      dateoldtec.textContent = "";
      currentRegionTec.textContent = "";
      inputRegnew.value = "";

    });
  }

  // Referencias a elementos dentro de los modales
  const ticketNumberSpan = document.getElementById("ticketNumberSpan");
  const ticketserialPos = document.getElementById("ticketserialPos");
  const currentTechnicianName = document.getElementById(
    "currentTechnicianName"
  );
  const confirmReassignYesBtn = document.getElementById(
    "confirmReassignYesBtn"
  );
  const assignTechnicianBtn = document.getElementById("assignTechnicianBtn");

  // Evento para el botón "Sí" del modal de confirmación
  confirmReassignYesBtn.addEventListener("click", async function () {
    confirmReassignModalInstance.hide(); // Oculta el modal de confirmación
  });

  // Evento para el botón "Asignar" del modal de selección de técnico
  assignTechnicianBtn.addEventListener("click", async function () {
    const newTechnicianId = technicianSelect.value;
    const newTechnicianName = technicianSelect.options[technicianSelect.selectedIndex].textContent; // Para el alert

    if (newTechnicianId) {
      // Deshabilitar botón para evitar múltiples clics
      assignTechnicianBtn.disabled = true;
      assignTechnicianBtn.textContent = "Asignando...";

      try {
        const success = await reassignTicket(currentTicketId, newTechnicianId);

       if (success) {
          Swal.fire({
            icon: 'success',
            title: '¡Reasignación Exitosa!',
            text: `El Ticket ${currentTicketNro} ha sido reasignado con éxito a ${newTechnicianName}.`,
            confirmButtonText: 'Entendido',
            color: 'black',
            confirmButtonColor: '#003594'
          }).then(() => { // El .then() se ejecuta cuando el usuario hace clic en el botón
              location.reload(); // Recarga la página inmediatamente
          });
        } else {
          alert(
            `Error al reasignar el ticket ${currentTicketNro}. Por favor, intente de nuevo.`
          );
        }
      } catch (error) {
        console.error("Error al reasignar el ticket:", error);
        console.error(`Ocurrió un error al reasignar el ticket ${currentTicketNro}.`);
      } finally {
        selectTechnicianModalInstance.hide(); // Oculta el modal de selección
        assignTechnicianBtn.disabled = false;
        assignTechnicianBtn.textContent = "Asignar";
      }
    } else {
      Swal.fire({
        title: "Notificación!",
        text: "Debe seleccionar un técnico para reasignar el ticket.",
        icon: "warning",
        confirmButtonText: "Aceptar",
        color: "black",
        confirmButtonColor: "#003594",
      });
    }
  });
});

function getTicketDataCoordinator() {
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
          if (modalElement) {
            modalInstanceCoordinator = new bootstrap.Modal(modalElement, {
              backdrop: "static", // Para que no se cierre al hacer clic fuera
              keyboard: false, // Para que no se cierre con la tecla ESC
            });

            const closebutton = document.getElementById("close-button");
            const closeIcon = document.getElementById("Close-icon");
            const SelectReg = document.getElementById("idSelectionTec");
            const InputReg = document.getElementById("InputRegion");

            if (closebutton && SelectReg && modalInstanceCoordinator) {
              closebutton.addEventListener("click", function () {
                modalInstanceCoordinator.hide(); // Oculta el modal de cambio de estatus
                InputReg.value = "";
              });
            }

            if (closeIcon && SelectReg && modalInstanceCoordinator) {
              closeIcon.addEventListener("click", function () {
                modalInstanceCoordinator.hide(); // Oculta el modal de cambio de estatus
                InputReg.value = "";
              });
            }
          } else {
            console.error(
              "El elemento 'staticBackdrop' (modal de asignación) no fue encontrado en el DOM."
            );
          }

          const detailsPanel = document.getElementById("ticket-details-panel");

          detailsPanel.innerHTML =
            "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

          const dataForDataTable = [];

          TicketData.forEach((data) => {
            let actionButtonsHtml = ""; // Variable para construir los botones de acción

            // Lógica para los botones de acción
            if (data.name_accion_ticket === "Asignado al Coordinador") {
              // Acción 4
              actionButtonsHtml += `
                                <button id = "confirmreceived" class="btn btn-sm btn-info btn-received-coord mr-2"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Marcar como Recibido por Coordinador"
                                    data-ticket-id="${data.id_ticket}"
                                    data-nro-ticket="${data.nro_ticket}"
                                    data-serial-pos="${data.serial_pos}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>                                </button>
                                <button id="myUniqueAssingmentButton"
                                    class="btn btn-sm btn-assign-tech"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Asignar Técnico"
                                    data-ticket-id="${data.id_ticket}"
                                    data-nro-ticket="${data.nro_ticket}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/></svg>                                
                                  </button>
                            `;
            } else if (
              data.name_accion_ticket === "Recibido por el Coordinador"
            ) {
              // Acción 3
              actionButtonsHtml += `
                                <button style="display: none;" class="btn btn-sm btn-info btn-received-coord mr-2"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Ticket ya Recibido por Coordinador"
                                    data-ticket-id="${data.id_ticket}"
                                    data-nro-ticket="${data.nro_ticket}"
                                    Recibido
                                </button>
                                <button id="myUniqueAssingmentButton"
                                    class="btn btn-sm btn-assign-tech"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Asignar Técnico"
                                    data-ticket-id="${data.id_ticket}"
                                    data-nro-ticket="${data.nro_ticket}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/></svg>                               
                                  </button>
                            `;
            } else if (data.name_accion_ticket === "Asignado al Técnico") {
              actionButtonsHtml += `
                                <button id="reasingButton" class="btn btn-sm btn-primary btn-reassign-tech"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Reasignar Técnico"
                                    data-ticket-id="${data.id_ticket}"
                                    data-nro-ticket="${data.nro_ticket}"
                                    data-serial-pos="${data.serial_pos}">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16"><path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/></svg>
                                </button>
                            `;
            }
            // Puedes añadir más condiciones para otros estados si es necesario
            dataForDataTable.push([
              data.id_ticket,
              data.rif,
              data.serial_pos,
              data.razonsocial_cliente,
              data.name_accion_ticket,
              data.full_name_tecnico_n2_actual,
              actionButtonsHtml, // Usa la variable con los botones
            ]);
          });

          // Inicialización de DataTables
          const dataTableInstance = $("#tabla-ticket").DataTable({
            // <--- 'dataTableInstance' se declara aquí
            data: dataForDataTable,
            scrollX: "200px",
            responsive: false,
            pagingType: "simple_numbers",
            lengthMenu: [
              [5, 10],
              ["5", "10"],
            ],
            autoWidth: true,
            autoheight: true,
            columns: [
              { title: "N°", orderable: false, searchable: false,
                render: function (data, type, row, meta) {
                  return meta.row + meta.settings._iDisplayStart + 1;
                }
              },
              { title: "Rif" },
              { title: "Serial POS" },
              {
                title: "Raz&oacuten Social",
                render: function (data, type, row) {
                  if (type === "display") {
                    return `<span class="truncated-cell" data-full-text="${data}">${data}</span>`;
                  }
                  return data;
                },
              },
              { title: "Acción Ticket" },
              { title: "Técnico Asignado", visible: false }, // Oculta esta columna por defecto
              { title: "Acciones", orderable: false },
            ],
            language: {
              lengthMenu: "Mostrar _MENU_ Registros",
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
            dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
            initComplete: function (settings, json) {
              // Dentro de initComplete, 'this' se refiere a la tabla jQuery
              // y 'this.api()' devuelve la instancia de la API de DataTables.
              const api = this.api(); // <--- Correcto: Obtener la instancia de la API aquí

            // Esto es parte de tu inicialización de DataTables, probablemente dentro de 'initComplete'
            // o en un script que se ejecuta después de que la tabla está lista.
            const buttonsHtml = `
                                <button id="btn-por-asignar" class="btn btn-primary me-2" title="Tickets por Asignar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/>
                                    </svg>
                                </button>

                                <button id="btn-recibidos" class="btn btn-secondary me-2" title="Tickets recibidos por el Coordinador">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                                        <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                                    </svg>
                                </button>

                                <button id="btn-asignados" class="btn btn-secondary me-2" title="Tickets ya Asignados">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                    </svg>
                                </button>

                                <button id="btn-reasignado" class="btn btn-secondary me-2" title="Tickets Reasignados">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16">
                                        <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
                                    </svg>
                                </button>`;
            $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

            function setActiveButton(activeButtonId) {
                $("#btn-por-asignar")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");
                $("#btn-asignados")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");
                $("#btn-recibidos")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");
                $("#btn-reasignado")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");
                $(`#${activeButtonId}`)
                    .removeClass("btn-secondary")
                    .addClass("btn-primary");
            }

            api.columns().search('').draw(false);
            api.column(5).visible(false); // Oculta Técnico Asignado
            api.column(6).visible(true); // Limpia el filtro de Técnico Asignado
            api // <--- Usar 'api' en lugar de 'dataTableInstance'
                .column(4)
                .search("Asignado al Coordinador") // CAMBIO AQUÍ
                .draw();
            setActiveButton("btn-por-asignar"); // Activa el botón "Por Asignar" al inicio // CAMBIO AQUÍ

            $("#btn-asignados").on("click", function () {
                api.columns().search('').draw(false);
                api.column(5).visible(true); // Oculta Técnico Asignado
                api.column(6).visible(true); // Limpia el filtro de Técnico Asignado
                api // <--- Usar 'api' en lugar de 'dataTableInstance'
                    .column(4)
                    .search("^Asignado al Técnico$", true, false) // <-- Cambio aquí
                    .draw();
                setActiveButton("btn-asignados");
            });

            $("#btn-por-asignar").on("click", function () {
                api.columns().search('').draw(false);
                api.column(5).visible(false); // Índice 6 para "Técnico Asignado
                api.column(6).visible(true); // Limpia el filtro de Técnico Asignado
                api // <--- Usar 'api' en lugar de 'dataTableInstance'
                    .column(4)
                    .search("Asignado al Coordinador")
                    .draw();
                setActiveButton("btn-por-asignar");
            });

            $("#btn-recibidos").on("click", function () {
                api.columns().search('').draw(false);
                api.column(5).visible(false); // Índice 6 para "Técnico Asignado
                api.column(6).visible(true); // Limpia el filtro de Técnico Asignado
                api // <--- Usar 'api' en lugar de 'dataTableInstance'
                    .column(4)
                    .search("Recibido por el Coordinador")
                    .draw();
                setActiveButton("btn-recibidos");
            });

            $("#btn-reasignado").on("click", function () {
                api.columns().search('').draw(false);
                api.column(5).visible(true); // Índice 6 para "Técnico Asignado
                api.column(6).visible(false); // Limpia el filtro de Técnico Asignado
                api // <--- Usar 'api' en lugar de 'dataTableInstance'
                    .column(4)
                    .search("Reasignado al Técnico")
                    .draw();
                setActiveButton("btn-reasignado");
            });
            },
          });

          $("#tabla-ticket").resizableColumns();

          $("#tabla-ticket tbody")
          .off("click", "tr") // Desvincula handlers anteriores para evitar duplicados
          .on("click", "tr", function () {
              const tr = $(this);
              const rowData = dataTableInstance.row(tr).data(); // Aquí 'dataTableInstance' sí está disponible

              if (!rowData) {
                  return;
              }

              // **Estas dos líneas son las que hacen el resaltado**
              $("#tabla-ticket tbody tr").removeClass("table-active"); // Quita la clase de todas las filas
              tr.addClass("table-active"); // Añade la clase a la fila clicada

              const ticketId = rowData[0]; // Asume que el ID del ticket está en la primera columna

              const selectedTicketDetails = TicketData.find(
                  (t) => t.id_ticket == ticketId
              );

              if (selectedTicketDetails) {
                  // ... (resto de tu lógica para mostrar el panel de detalles)
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
                          // Corrección de la ruta de la imagen estática
                          imgElement.src = '/public/img/consulta_rif/POS/mantainment.png'; // Ruta relativa o absoluta accesible desde el navegador
                          imgElement.alt = "Serial no disponible";
                      }
                  }
              } else {
                  detailsPanel.innerHTML =
                      "<p>No se encontraron detalles para este ticket.</p>";
              }
          });

          $("#tabla-ticket tbody")
          .off("click", ".truncated-cell, .expanded-cell") // <--- Importante: Ahora escucha clics en AMBAS clases
          .on("click", ".truncated-cell, .expanded-cell", function (e) {
              e.stopPropagation();
              const $cellSpan = $(this);
              const fullText = $cellSpan.data("full-text");
              const displayLength = 25; // Define displayLength aquí para que esté disponible en ambos casos

              if ($cellSpan.hasClass("truncated-cell")) {
                  // Si está truncado, expandirlo
                  $cellSpan
                      .removeClass("truncated-cell")
                      .addClass("expanded-cell");
                  $cellSpan.text(fullText);
              } else if ($cellSpan.hasClass("expanded-cell")) { // <--- Añadimos esta condición para ser explícitos
                  // Si está expandido, truncarlo (si es necesario)
                  $cellSpan
                      .removeClass("expanded-cell")
                      .addClass("truncated-cell");
                  
                  if (fullText.length > displayLength) {
                      $cellSpan.text(fullText.substring(0, displayLength) + "...");
                  } else {
                      $cellSpan.text(fullText); // Si no necesita truncarse, mostrar el texto completo
                  }
              }
              // Si por alguna razón la celda no tiene ninguna de las dos clases, no hará nada.
          });

          // Evento click para el botón "POS Recibido"
          $("#tabla-ticket tbody")
            .off("click", ".btn-received-coord")
            .on("click", ".btn-received-coord", function (e) {
              e.stopPropagation();
              const ticketId = $(this).data("ticket-id");
              const nroTicket = $(this).data("nro-ticket");
              const serialPos = $(this).data("serial-pos");
              markTicketAsReceived(ticketId, nroTicket, serialPos);
            });

          // Evento click existente para el botón de Asignar Técnico
          $("#tabla-ticket tbody")
            .off("click", ".btn-assign-tech")
            .on("click", ".btn-assign-tech", function (e) {
              e.stopPropagation();
              const ticketId = $(this).data("ticket-id");
              const nroTicket = $(this).data("nro-ticket");
              currentTicketId = ticketId;
              currentTicketNroForAssignment = nroTicket;
              if (modalInstanceCoordinator) {
                modalInstanceCoordinator.show();
              } else {
                console.error(
                  "Error: La instancia del modal de asignación no está disponible."
                );
              }
            });

          $("#tabla-ticket tbody")
            .off("click", ".btn-reassign-tech")
            .on("click", ".btn-reassign-tech", function (e) {
              e.stopPropagation();
              currentTicketId = $(this).data("ticket-id");
              currentTicketNro = $(this).data("nro-ticket"); // Asegúrate de obtener el nro_ticket
              currentserialPos = $(this).data("serial-pos");
              ticketNumberSpan.textContent = currentTicketNro; // Muestra el número en el modal de confirmación
              ticketserialPos.textContent = currentserialPos; // Muestra el serial en el modal de confirmación
              confirmReassignModalInstance.show(); // Muestra el modal de confirmación
            });
        } else {
          tbody.innerHTML = '<tr><td>Error al cargar</td></tr>';
          console.error("Error:", response.message);
        }
      } catch (error) {
        tbody.innerHTML =
          '<tr><td>Error al procesar la respuesta</td></tr>';
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      tbody.innerHTML =
        '<tr><td>No se encontraron usuarios</td></tr>';
    } else {
      tbody.innerHTML = '<tr><td>Error de conexión</td></tr>';
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td>Error de conexión</td></tr>';
    console.error("Error de red");
  };
  const datos = `action=GetTicketData`;
  xhr.send(datos);
}

function getTechnicianData(ticketIdToFetch) {
  // Cambié el nombre del parámetro para evitar cualquier posible confusión

  // Validar que ticketIdToFetch no es un objeto Event
  if (typeof ticketIdToFetch === "object" && ticketIdToFetch !== null) {
    if (ticketIdToFetch.type && ticketIdToFetch.target) {
      // Podría ser un objeto Event
      console.error(
        "ERROR CRÍTICO: Se intentó pasar un objeto Event a getTechnicianData. Esto no debería ocurrir."
      );
      alert(
        "Error interno: No se pudo procesar el ID del ticket. Contacte a soporte."
      );
      return Promise.reject(
        new Error("Invalid ticket ID: received an event object.")
      );
    }
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const API_URL_GET_TECHNICIANS = `${ENDPOINT_BASE}${APP_PATH}api/users/GetTechniciansAndCurrentTicketTechnician`;

    xhr.open("POST", API_URL_GET_TECHNICIANS);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const inputNtecnico = document.getElementById("currentTechnicianDisplay");
          const inputFecha = document.getElementById("currentAssignmentDateDisplay");
          const inputRegion = document.getElementById("currentRegion");
          const technicianSelect = document.getElementById("technicianSelect");

          if (response.success) {
            // *** ESTA ES LA LÍNEA CRÍTICA ***
            // 1. Asigna el valor del técnico actual a la variable global 'inputTecnicoActual'
            inputTecnicoActual = response.technicians.full_tecnicoassig1 || "No Asignado";

            // 2. Luego, usa inputTecnicoActual (o directamente response.technicians.full_tecnicoassig1) para actualizar el DOM
            // Ya tienes 'inputNtecnico' que es la referencia a "currentTechnicianDisplay"
            if (inputNtecnico) { // Reutiliza inputNtecnico que ya está declarado
              inputNtecnico.innerHTML = inputTecnicoActual; // Usa la variable global que ya tiene el valor
            }

            // Continuar con las otras actualizaciones del DOM
            inputFecha.innerHTML = response.technicians.fecha_asignacion || "N/A";
            inputRegion.innerHTML = response.technicians.name_region || "N/A";

          } else {
            // Si la respuesta no es exitosa, asegúrate de que inputTecnicoActual también se maneje
            inputTecnicoActual = "No Asignado"; // Establece un valor predeterminado
            if (inputNtecnico) {
                inputNtecnico.innerHTML = "No Asignado";
            }
            inputFecha.innerHTML = "N/A";
            inputRegion.innerHTML = "N/A";
            if (technicianSelect) { // Asegúrate de que technicianSelect existe antes de intentar acceder a .value
                technicianSelect.value = "";
            }
            console.error("Error en la respuesta de la API:", response.message);
          }
          resolve(response);
        } catch (error) {
          console.error("Error parsing JSON para obtener técnicos:", error);
          reject(error);
        }
      } else {
        console.error(
          "Error en la solicitud para obtener técnicos:",
          xhr.status,
          xhr.statusText
        );
        reject(new Error(`HTTP error! status: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      console.error("Error de red al intentar obtener técnicos.");
      reject(new Error("Error de red"));
    };

    const dataToSend = `action=GetTechniciansAndCurrentTicketTechnician&ticket_id=${ticketIdToFetch}`;
    xhr.send(dataToSend);
  });
}

function reassignTicket(ticketId, newTechnicianId) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const id_user = document.getElementById("id_user").value; // Asumiendo que tienes el ID del usuario logueado
    const comment = document.getElementById("reassignObservation").value; // Asumiendo que tienes el comentario del usuario
    const API_URL_REASSIGN = `${ENDPOINT_BASE}${APP_PATH}api/users/ReassignTicket`;

    xhr.open("POST", API_URL_REASSIGN);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.success);
        } catch (error) {
          console.error("Error parsing JSON para reasignar ticket:", error);
          reject(error);
        }
      } else {
        console.error(
          "Error en la solicitud para reasignar ticket:",
          xhr.status,
          xhr.statusText
        );
        reject(new Error(`HTTP error! status: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      console.error("Error de red al intentar reasignar ticket.");
      reject(new Error("Error de red"));
    };

    const dataToSend = `action=ReassignTicket&ticket_id=${ticketId}&new_technician_id=${newTechnicianId}&id_user=${id_user}&comment=${comment}`;
    xhr.send(dataToSend);
  });
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
                          ${d.full_name_tecnico}
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
                        <div class="col-sm-6 mb-2">
                          <button type="button" class="btn btn-link p-0" id="hiperbinComponents" data-id-ticket = ${d.id_ticket}" data-serial-pos = ${d.serial_pos}>
                            <i class="bi bi-box-seam-fill me-1"></i> Cargar Componentes del Dispositivo
                          </button>
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

            // *** CAMBIO CLAVE AQUÍ ***
            // Usamos una variable para el color y otra para el estado de expansión.
            // La primera gestion (index === 0) tiene el color especial.
            const isLatest = index === 0;
            // Pero la cartilla del acordeón siempre estará cerrada por defecto.
            const isExpanded = false;

            // Obtener el registro anterior para la comparación
            const prevItem = response.history[index + 1] || {};

            // --- Lógica para determinar si un campo ha cambiado ---
            const accionChanged = prevItem.name_accion_ticket && item.name_accion_ticket !== prevItem.name_accion_ticket;
            const tecnicoChanged = prevItem.full_name_tecnico_n2_history && item.full_name_tecnico_n2_history !== prevItem.full_name_tecnico_n2_history;
            const statusLabChanged = prevItem.name_status_lab && item.name_status_lab !== prevItem.name_status_lab;
            const statusDomChanged = prevItem.name_status_domiciliacion && item.name_status_domiciliacion !== prevItem.name_status_domiciliacion;
            const statusPaymentChanged = prevItem.name_status_payment && item.name_status_payment !== prevItem.name_status_payment;
            const estatusTicketChanged = prevItem.name_status_ticket && item.name_status_ticket !== prevItem.name_status_ticket;

            // --- Lógica de colores (ahora usa isLatest) ---
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
        },
    });
}

document.addEventListener("DOMContentLoaded", function () {
  getTicketDataCoordinator(); // Llama a la función para cargar los datos

  // Obtén la referencia al botón cerrar FUERA de la función getTicketData y del bucle
  const cerrar = document.getElementById("close-button");
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
  // Agrega el event listener al botón "Asignar"
  assignButton.addEventListener("click", AssignTicket);
});
//console.log('FrontEnd.js loaded successfully!');

function markTicketAsReceived(ticketId, nroTicket, serialPos) {
  // Asegúrate de que nroTicket esté como parámetro
  const id_user = document.getElementById("id_user").value;
  // SVG que quieres usar
  const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
  Swal.fire({
    // El nuevo texto del header va aquí
    title: `Confirmación de recibido`, // Texto fijo para el encabezado
    // El contenido del cuerpo (SVG y texto explicativo) va en 'html'
    html: `${customWarningSvg}<p class="mt-3" id = "textConfirm">¿Deseas Marcar el ticket Nro: <span id = "NroTicketConfirReceiCoord">${nroTicket}</span> Asociado el Pos: <span id = "NroTicketConfirReceiCoord">${serialPos}</span> como recibido? 
    </p><p id = "textConfirmp">Esta acción registrará la fecha de recepción y habilitará la asignación de técnico.</p>`,
    showCancelButton: true,
    confirmButtonColor: "#003594",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Recibir Pos",
    cancelButtonText: "Cancelar",
    color: "black",
    customClass: {
      popup: "swal2-custom-header-popup", // Clase principal para el popup
      title: "swal2-custom-title", // Clase para el título (para estilizarlo en CSS)
      content: "custom-content", // Puedes mantener esta si la usas para el contenido del cuerpo
      actions: "custom-actions",
      confirmButton: "swal2-confirm-receive-ticket-class",
      cancelButton: "swal2-cancel-receive-ticket-class",
    },
    didOpen: (popup) => {
      const confirmBtn = popup.querySelector(
        ".swal2-confirm-receive-ticket-class"
      );
      const cancelBtn = popup.querySelector(
        ".swal2-cancel-receive-ticket-class"
      );

      if (confirmBtn) {
        confirmBtn.id = "swal2-confirm-receive-ticket-id";
      }
      if (cancelBtn) {
        cancelBtn.id = "swal2-cancel-receive-ticket-id";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/historical/MarkTicketReceived`
      ); // Necesitas una nueva ruta de API para esto
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              Swal.fire({
                title: "¡Recibido!",
                text: "El ticket N" + nroTicket + " ha sido marcado como recibido.",
                icon: "success",
                color: "black",
                confirmButtonColor: "#2703f4ff",
              });
              getTicketDataCoordinator();
              if (modalInstanceCoordinator) {
                modalInstanceCoordinator.hide();
              } else {
                console.error(
                  "No se pudo cerrar el modal: la instancia no está disponible."
                );
              }
            } else {
              Swal.fire(
                "Error",
                response.message ||
                  "Hubo un error al marcar el ticket como recibido.",
                "error"
              );
            }
          } catch (error) {
            Swal.fire(
              "Error",
              "Error al procesar la respuesta del servidor.",
              "error"
            );
            console.error(
              "Error parsing JSON for markTicketAsReceived:",
              error
            );
          }
        } else {
          Swal.fire(
            "Error",
            `Error al conectar con el servidor: ${xhr.status} ${xhr.statusText}`,
            "error"
          );
          console.error(
            "Error en markTicketAsReceived:",
            xhr.status,
            xhr.statusText
          );
        }
      };
      xhr.onerror = function () {
        Swal.fire(
          "Error",
          "Error de red al intentar marcar el ticket como recibido.",
          "error"
        );
        console.error("Network error for markTicketAsReceived");
      };

      const data = `action=MarkTicketReceived&ticket_id=${ticketId}&id_user=${encodeURIComponent(
        id_user
      )}`;
      xhr.send(data);
    }
  });
}

function AssignTicket() {
  const id_tecnico_asignado = document.getElementById("idSelectionTec").value;

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
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/AssignTicket`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: response.message,
            text: "El Pos asociado al nro ticket: " + currentTicketNroForAssignment + " ha sido asignado correctamente.",
            color: "black",
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#003594",
          }).then((result) => {
            if (result.isConfirmed) {
              getTicketDataCoordinator();
              if (modalInstanceCoordinator) {
                modalInstanceCoordinator.hide();
              }
            }
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

// Asegúrate de que esta variable sea global y esté definida antes de llamar a getTecnico2()
// Por ejemplo:
// let inputTecnicoActual = null; // Inicialízala a null o a una cadena vacía al principio
// Y luego, cuando obtengas la información del ticket, la actualizas:
// inputTecnicoActual = response.technicians.full_tecnicoassig1 || "No Asignado";

function getTecnico21(tecnicoActualParaFiltrar) { // Nuevo parámetro
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTecnico2`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select2 = document.getElementById("technicianSelect");

                    select2.innerHTML = '<option value="">Seleccione</option>';

                    if (
                        Array.isArray(response.tecnicos) &&
                        response.tecnicos.length > 0
                    ) {
                        response.tecnicos.forEach((tecnico) => {
                            if (tecnico.full_name !== tecnicoActualParaFiltrar) {
                                const option2 = document.createElement("option");
                                option2.value = tecnico.id_user;
                                option2.textContent = tecnico.full_name;
                                select2.appendChild(option2);
                            } else {
                            }
                        });

                        select2.addEventListener("change", function () {
                            const selectedTecnicoId = this.value;
                            if (selectedTecnicoId) {
                                GetRegionUser(selectedTecnicoId);
                            } else {
                                document.getElementById("InputRegionUser2").value = "";
                            }
                        });

                    } else {
                        const option = document.createElement("option");
                        option.value = "";
                        option.textContent = "No hay Técnicos Disponibles";
                        select.appendChild(option);
                        select2.appendChild(option.cloneNode(true));
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

    const datos = `action=GetTecnico2`;
    xhr.send(datos);
}

function getTecnico2() { // Nuevo parámetro
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTecnico2`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById("idSelectionTec");
                    const select2 = document.getElementById("technicianSelect");

                    select.innerHTML = '<option value="">Seleccione</option>';

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

                        // Event Listeners (no cambian)
                        select.addEventListener("change", function () {
                            const selectedTecnicoId = this.value;
                            if (selectedTecnicoId) {
                                GetRegionUser(selectedTecnicoId);
                            } else {
                                document.getElementById("InputRegion").value = "";
                            }
                        }); 

                    } else {
                        const option = document.createElement("option");
                        option.value = "";
                        option.textContent = "No hay Técnicos Disponibles";
                        select.appendChild(option);
                        select2.appendChild(option.cloneNode(true));
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

    const datos = `action=GetTecnico2`;
    xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getTecnico2);

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
          const inputRegionUser2 = document.getElementById("InputRegionUser2");
          const region = response.regionusers || "";

          if (region) {
            inputRegion.value = region;
            inputRegionUser2.value = region; // Asignar la región al campo según el técnico seleccionado
          } else {
            inputRegion.value = ""; // Limpiar el campo si no hay región
            inputRegionUser2.value = ""; // Limpiar el campo si no hay región
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
  const datos = `action=GetRegionUsersAssign&id_user=${encodeURIComponent(
    id_user
  )}`;
  xhr.send(datos);
}

// Obtén una referencia al modal y al tbody de la tabla
const modalComponentesEl = document.getElementById('modalComponentes');
const tbodyComponentes = document.getElementById('tbodyComponentes');
const contadorComponentes = document.getElementById('contadorComponentes');
const botonCargarComponentes = document.getElementById('hiperbinComponents');
const ModalBotonCerrar = document.getElementById('BotonCerrarModal');

// Inicializa el modal de Bootstrap una sola vez.
const modalComponentes = new bootstrap.Modal(modalComponentesEl, {
    keyboard: false,
    backdrop:'static'
});

// Escuchar el evento 'show.bs.modal' para resetear el estado del modal cada vez que se abre
modalComponentesEl.addEventListener('show.bs.modal', function () {
    // Limpiar el contador y el checkbox de "seleccionar todos" cada vez que se abra el modal
    document.getElementById('selectAllComponents').checked = false;
    contadorComponentes.textContent = '0';
});

// Función para actualizar el contador de componentes seleccionados
function actualizarContador() {
    // Solo cuenta los checkboxes que están checked y que NO están deshabilitados
    const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:checked:not([disabled])');
    const selectAllCheckbox = document.getElementById('selectAllComponents');
    
    // Actualizar contador
    contadorComponentes.textContent = checkboxes.length;
    
    // Actualizar estado del checkbox "seleccionar todos"
    // Solo consideramos los checkboxes que NO están deshabilitados para esta lógica
    const allCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:not([disabled])');
    const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
    const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
    
    selectAllCheckbox.checked = allChecked;
    selectAllCheckbox.indeterminate = someChecked && !allChecked;
}

// Función para limpiar la selección de componentes
function limpiarSeleccion() {
    // Solo desmarca los checkboxes que NO están deshabilitados
    const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:not([disabled])');
    checkboxes.forEach(cb => cb.checked = false);
    
    document.getElementById('selectAllComponents').checked = false;
    contadorComponentes.textContent = '0';
}

// CORRECCIÓN PRINCIPAL: Se modificó la función para que reciba los componentes seleccionados
function guardarComponentesSeleccionados(ticketId, selectedComponents, serialPos) {
    const id_user = document.getElementById('id_user').value;
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/SaveComponents`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    Swal.fire({
                        title: '¡Éxito!',
                        html: `Los componentes del Pos <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> han sido guardados correctamente.`,
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        color: 'black',
                        confirmButtonColor: '#003594',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        keydownListenerCapture: true
                    }).then(() => {
                        modalComponentes.hide();
                        window.location.reload(); 
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.message || 'Error al guardar los componentes.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al procesar la respuesta del servidor.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } else {
            Swal.fire({
                title: 'Error del Servidor',
                text: `Error al comunicarse con el servidor. Código: ${xhr.status}`,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };
    
    xhr.onerror = function() {
        Swal.fire({
            title: 'Error de Red',
            text: 'No se pudo conectar con el servidor.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    };
    
    const dataToSend = `action=SaveComponents&ticketId=${ticketId}&serialPos=${serialPos}&selectedComponents=${encodeURIComponent(JSON.stringify(selectedComponents))}&id_user=${encodeURIComponent(id_user)}`;
    xhr.send(dataToSend);
}

// Función para obtener el ticket ID (ajusta según tu estructura)
function obtenerTicketId() {
    return currentTicketId;
}

// Función para obtener el nombre de la región (ajusta según tu estructura)
function obtenerRegionName() {
    const regionSelect = document.getElementById('AsiganrCoordinador');
    if (regionSelect && regionSelect.selectedOptions.length > 0) {
        return regionSelect.selectedOptions[0].text;
    }
    return 'Sin región asignada';
}

// FUNCIÓN PRINCIPAL PARA CARGAR Y MOSTRAR EL MODAL
function showSelectComponentsModal(ticketId, regionName, serialPos) {
    const xhr = new XMLHttpRequest();

    // Limpia el contenido previo y muestra un mensaje de carga
    tbodyComponentes.innerHTML = `<tr><td colspan="2" class="text-center text-muted">Cargando componentes...</td></tr>`;
    
    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetComponents`;
    const dataToSendString = `action=GetComponents&ticketId=${ticketId}`;

    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success && response.components) {
                    const components = response.components;
                    let componentsHtml = '';
                    
                    if (components.length > 0) {
                        components.forEach(comp => {
                            // Ahora verificamos si `comp.is_selected` es 't' para marcar y deshabilitar
                            const isChecked = comp.is_selected === 't' ? 'checked' : '';
                            const isDisabled = comp.is_selected === 't' ? 'disabled' : '';
                            
                            componentsHtml += `
                                <tr>
                                  <td>
                                    <input type="checkbox" class="form-check-input" value="${comp.id_component}" ${isChecked} ${isDisabled}>
                                    </td>
                                  <td>${comp.name_component}</td>
                                </tr>
                            `;
                        });
                        
                        document.getElementById('btnGuardarComponentes').dataset.ticketId = ticketId;
                        document.getElementById('btnGuardarComponentes').dataset.serialPos = serialPos;

                    } else {
                        componentsHtml = `<tr><td colspan="2" class="text-center text-muted">No se encontraron componentes.</td></tr>`;
                    }
                    
                    tbodyComponentes.innerHTML = componentsHtml;
                    document.getElementById('modalComponentesLabel').innerHTML = `
                        <i class="bi bi-box-seam-fill me-2"></i>Lista de Componentes del Dispositivo <span class="badge bg-secondary">${serialPos}</span>
                    `;

                    // Finalmente, muestra el modal de Bootstrap
                    modalComponentes.show();

                    // Llama a actualizar contador después de cargar los componentes
                    actualizarContador();

                } else {
                    Swal.fire('Error', response.message || 'No se pudieron obtener los componentes.', 'error');
                }
            } catch (e) {
                Swal.fire('Error de Procesamiento', 'Hubo un problema al procesar la respuesta del servidor.', 'error');
            }
        } else {
            Swal.fire('Error del Servidor', `No se pudo comunicar con el servidor. Código: ${xhr.status}`, 'error');
        }
    };

    xhr.onerror = function() {
        Swal.fire('Error de red', 'No se pudo conectar con el servidor para obtener los componentes.', 'error');
    };
    
    xhr.send(dataToSendString);
}

// Espera a que el DOM esté completamente cargado para asegurarse de que los elementos existen
// Espera a que el DOM esté completamente cargado para asegurarse de que los elementos existen
document.addEventListener('DOMContentLoaded', function () {
    const modalComponentesEl = document.getElementById('modalComponentes');
    const modalComponentes = new bootstrap.Modal(modalComponentesEl, { keyboard: false });

    // Escucha el evento `click` en el documento y usa delegación.
    document.addEventListener('click', function (e) {
        // Verifica si el clic proviene del botón con el ID 'hiperbinComponents'
        if (e.target && e.target.id === 'hiperbinComponents' || e.target.closest('#hiperbinComponents')) {
            const botonClicado = e.target.closest('#hiperbinComponents');
            if (botonClicado) {
                // Llama a la función que abre el modal, pasándole el botón como argumento
                abrirModalComponentes(botonClicado);
            }
        }

        // Event listener para el botón "Limpiar Selección" (usando delegación)
        if (e.target && e.target.closest('.btn-outline-secondary.btn-sm') && e.target.closest('.modal-body')) {
            limpiarSeleccion();
        }

        // Event listener para el botón "Guardar Componentes"
        if (e.target && e.target.id === 'btnGuardarComponentes') {
            const ticketId = e.target.dataset.ticketId;
            const serialPos = e.target.dataset.serialPos;

            // --- INICIO DE LA LÓGICA AGREGADA ---
            const allCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]');
            const allDisabledAndChecked = Array.from(allCheckboxes).every(cb => cb.checked && cb.disabled);

            if (allCheckboxes.length > 0 && allDisabledAndChecked) {
                Swal.fire({
                    title: '¡Información!',
                    html: `Todos los componentes del Pos <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> ya están registrados.`,
                    icon: 'info',
                    confirmButtonText: 'Aceptar',
                    color: 'black',
                    confirmButtonColor: '#003594'
                });
                return; // Detiene la ejecución para no intentar guardar
            }
            // --- FIN DE LA LÓGICA AGREGADA ---

            const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:checked:not([disabled])');
            const selectedComponents = Array.from(checkboxes).map(cb => cb.value);

            if (selectedComponents.length === 0) {
                Swal.fire({
                    title: 'Atención',
                    text: 'Debes seleccionar al menos un componente nuevo para guardar.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido',
                    color: 'black',
                    confirmButtonColor: '#003594',
                });
                return;
            }
            guardarComponentesSeleccionados(ticketId, selectedComponents, serialPos);
        }

        // Event listener para el botón de cerrar el modal
        if (e.target && e.target.id === 'BotonCerrarModal') {
            modalComponentes.hide();
        }

        // Event listener para el checkbox "Seleccionar Todos"
        if (e.target && e.target.id === 'selectAllComponents') {
            const isChecked = e.target.checked;
            const enabledCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:not([disabled])');
            
            enabledCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            
            actualizarContador();
        }

        // Event listener para checkboxes individuales de componentes
        if (e.target && e.target.type === 'checkbox' && e.target.closest('#tbodyComponentes')) {
            actualizarContador();
        }
    });
  });

function abrirModalComponentes(boton) {

    const modalCerrarComponnets = document.getElementById('BotonCerrarModal');
    const ticketId = boton.dataset.idTicket;
    const serialPos = boton.dataset.serialPos;

    const regionName = obtenerRegionName();

    if (!ticketId) {
        Swal.fire({
            title: 'Atención',
            text: 'No se pudo obtener el ID del ticket.',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            color: 'black',
            confirmButtonColor: '#003594',
        });
        return;
    }

    if (!serialPos) {
        Swal.fire({
            title: 'Atención',
            text: 'No hay serial disponible para este ticket.',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            color: 'black',
            confirmButtonColor: '#003594',
        });
        return;
    }

    if(modalCerrarComponnets){
      modalCerrarComponnets.addEventListener('click', function() {
        modalComponentes.hide();
      });
    }
    showSelectComponentsModal(ticketId, regionName, serialPos);
}
