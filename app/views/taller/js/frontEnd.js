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

                        // === ADD "CARGA DE LLAVE" COLUMN FIRST ===
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

    xhr.send();
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


