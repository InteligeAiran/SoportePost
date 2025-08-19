/*document.addEventListener("DOMContentLoaded", function () {
  const flatpickrInputs = document.querySelectorAll(".flatpickr-input");

  flatpickrInputs.forEach((input) => {
    flatpickr(input, {
      dateFormat: "d/m/Y", // Define el formato como dd/mm/yyyy
      allowInput: true, // Permite escribir directamente en el input
      clickOpens: true, // Abre el calendario al hacer clic en el input
      // Puedes añadir más opciones aquí si lo necesitas
    });
  });

  $("#serialInput").keyup(function () {
    let string = $("#serialInput").val();
    $("#serialInput").val(string.replace(/ /g, ""));
  });

  // Función de validación genérica para la fecha
  function validateYear(inputElementId, errorMessageId) {
    const inputElement = document.getElementById(inputElementId);
    const errorMessageElement = document.getElementById(errorMessageId);
    const dateString = inputElement.value;

    // Limpiar mensajes y clases de error antes de revalidar
    errorMessageElement.textContent = "";
    inputElement.classList.remove("border-red-500");

    // Si el campo está vacío, no se valida (pero podría considerarse un error si es un campo requerido)
    if (dateString.trim() === "") {
      // Podrías poner un mensaje aquí si el campo es obligatorio
      // errorMessageElement.textContent = 'Este campo es obligatorio.';
      // inputElement.classList.add('border-red-500');
      return true; // O false, dependiendo si el campo puede estar vacío
    }

        // Expresión regular para validar el formato DD/MM/YYYY
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        

        if (!datePattern.test(dateString)) {
          errorMessageElement.textContent = "Formato DD/MM/AAAA inválido.";
          inputElement.classList.add("border-red-500");
          return false;
        }

    const parts = dateString.split("/");
    const inputDay = parseInt(parts[0], 10); // Día
    const inputMonth = parseInt(parts[1], 10); // Mes
    const inputYear = parseInt(parts[2], 10); // Año

    const currentYear = new Date().getFullYear();

    // Validar el rango básico de la fecha (mes 1-12, día 1-31)
    if (inputMonth < 1 || inputMonth > 12 || inputDay < 1 || inputDay > 31) {
      errorMessageElement.textContent =
        "Fecha inválida (Mes o Día fuera de rango).";
      inputElement.classList.add("border-red-500");
      return false;
    }

    // Validación de días en meses específicos y años bisiestos
    const date = new Date(inputYear, inputMonth - 1, inputDay);
    if (
      date.getFullYear() !== inputYear ||
      date.getMonth() + 1 !== inputMonth ||
      date.getDate() !== inputDay
    ) {
      errorMessageElement.textContent =
        "Fecha inválida (Día no corresponde al mes o año bisiesto).";
      inputElement.classList.add("border-red-500");
      return false;
    }

    // Validación principal: el año no puede ser mayor al actual
    if (inputYear > currentYear) {
      errorMessageElement.textContent = `El año no puede ser mayor a ${currentYear}.`;
      inputElement.classList.add("border-red-500");
      return false;
    }

    // Si todo es válido
    errorMessageElement.textContent = ""; // Limpiar mensaje de error
    inputElement.classList.remove("border-red-500"); // Quitar clase de error
    return true;
  }

  // Asignar la función de validación a los eventos 'blur' (cuando el campo pierde el foco)
  // y 'input' (mientras se escribe)
  document.getElementById("date-ini").addEventListener("blur", function () {
    validateYear("date-ini", "errorDateIni"); // Corregido: 'errorFechaInicio' -> 'errorDateIni'
  });
  document.getElementById("date-end").addEventListener("blur", function () {
    // Corregido: 'fechaFin' -> 'date-end'
    validateYear("date-end", "errorDateEnd"); // Corregido: 'errorFechaFin' -> 'errorDateEnd'
  });

  // Limpiar el mensaje de error mientras el usuario escribe
  document.getElementById("date-ini").addEventListener("input", function () {
    document.getElementById("errorDateIni").textContent = ""; // Corregido: 'errorFechaInicio' -> 'errorDateIni'
    this.classList.remove("border-red-500");
  });
  document.getElementById("date-end").addEventListener("input", function () {
    document.getElementById("errorDateEnd").textContent = ""; // Corregido: 'errorFechaFin' -> 'errorDateEnd'
    this.classList.remove("border-red-500");
  });*/
document.addEventListener("DOMContentLoaded", function () {
    // Referencias a los elementos
    const buscarPorRangoBtn = document.getElementById("buscarPorRangoBtn");
    const buscarPorSerialBtn = document.getElementById("buscarPorSerialBtn");
    const buscarPorRifBtn = document.getElementById("buscarPorRifBtn");
    const buscarPorRegionsBtn = document.getElementById("buscarPorRegionsBtn");
    const buscarPorRazonBtn = document.getElementById("buscarPorNombreBtn"); 
    const searchRifDiv = document.getElementById("SearchRif"); // Contenedor principal de los inputs de búsqueda
    const rifTipoSelect = document.getElementById("rifTipo");
    const rifInput = document.getElementById("rifInput");
    const buscarRifBtn = document.getElementById("buscarRif");
    const serialInput = document.getElementById("serialInput");
    const buscarSerialBtn = document.getElementById("buscarSerial");
    const razonInput = document.getElementById("RazonInput");
    const buscarRazonBtn = document.getElementById("buscarRazon");
    const inputsDateDiv = document.getElementById("inputsDate"); // El div que contiene los inputs de fecha
    const dateIniInput = document.getElementById("date-ini");
    const dateEndInput = document.getElementById("date-end");
    const buscarRangoBtn = document.getElementById("buscarRango");
    const errorDateIni = document.getElementById("errorDateIni");
    const errorDateEnd = document.getElementById("errorDateEnd");
    const selectRegions = document.getElementById("SelectRgions");
    const buscarRegionsBtn = document.getElementById("buscarRegions");
    const resultsCard = document.querySelector(".card"); // El contenedor principal para los resultados (la tabla)

    // Función para ocultar todos los campos de búsqueda y limpiar mensajes de error
    function hideAllSearchInputs() {
        // Ocultar todos los inputs y botones específicos de cada tipo de búsqueda
        rifTipoSelect.style.display = "none";
        rifInput.style.display = "none";
        buscarRifBtn.style.display = "none";

        serialInput.style.display = "none";
        buscarSerialBtn.style.display = "none";

        razonInput.style.display = "none";
        buscarRazonBtn.style.display = "none";

        inputsDateDiv.style.display = "none"; // Oculta el contenedor completo de fecha
        dateIniInput.style.display = "none"; // Asegura que los inputs individuales también se oculten si no están dentro de inputsDateDiv
        dateEndInput.style.display = "none";
        buscarRangoBtn.style.display = "none";
        errorDateIni.style.display = "none";
        errorDateEnd.style.display = "none";

        selectRegions.style.display = "none";
        buscarRegionsBtn.style.display = "none";

        // Limpiar el contenido del card de resultados
        if (resultsCard) {
            resultsCard.style.display = "none"; // Oculta el card de resultados
            // Si la tabla DataTables está inicializada aquí, deberías destruirla antes de limpiar el HTML
            // Por ejemplo: if ($.fn.DataTable.isDataTable('#rifCountTable')) { $('#rifCountTable').DataTable().destroy(); }
            resultsCard.innerHTML = `
                <div class="table-responsive">
                    <table id="rifCountTable" style="display: none;">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td colspan="15">No hay datos</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            // Vuelve a ocultar la tabla rifCountTable dentro del card
            const rifCountTable = resultsCard.querySelector("#rifCountTable");
            if (rifCountTable) {
                rifCountTable.style.display = "none";
            }
        }
    }

    // Event Listeners para los botones de "Buscar por..."
    if (buscarPorRegionsBtn) {
        buscarPorRegionsBtn.addEventListener("click", function () {
            hideAllSearchInputs(); // Oculta todos los demás
            selectRegions.style.display = "block";
            buscarRegionsBtn.style.display = "block";
            resultsCard.style.display = "block"; // Muestra el card de resultados
            // Lógica para cargar regiones
        });
    }

    if (buscarPorRangoBtn) {
        buscarPorRangoBtn.addEventListener("click", function () {
            hideAllSearchInputs(); // Oculta todos los demás
            inputsDateDiv.style.display = "flex"; // ¡IMPORTANTE! Vuelve a poner display: flex;
            dateIniInput.style.display = "block";
            dateEndInput.style.display = "block";
            buscarRangoBtn.style.display = "block";
            // No mostrar los mensajes de error inicialmente
            errorDateIni.style.display = "none"; 
            errorDateEnd.style.display = "none";
            resultsCard.style.display = "block"; // Muestra el card de resultados
        });
    }

    if (buscarPorRazonBtn) { // Asumiendo que este es el botón correcto para buscar por Razon Social
        buscarPorRazonBtn.addEventListener("click", function () {
            hideAllSearchInputs(); // Oculta todos los demás
            razonInput.style.display = "block";
            buscarRazonBtn.style.display = "block";
            resultsCard.style.display = "block"; // Muestra el card de resultados
        });
    }

    if (buscarPorRifBtn) {
        buscarPorRifBtn.addEventListener("click", function () {
            hideAllSearchInputs(); // Oculta todos los demás
            rifTipoSelect.style.display = "block";
            rifInput.style.display = "block";
            buscarRifBtn.style.display = "block";
            resultsCard.style.display = "block"; // Muestra el card de resultados

            // Lógica para validación de input de RIF
            $("#rifInput").keyup(function () {
                let string = $("#rifInput").val();
                $("#rifInput").val(string.replace(/ /g, ""));
            });

            if (rifInput) {
                rifInput.addEventListener("input", function () {
                    this.value = this.value.replace(/\D/g, "");
                });
            }
        });
    }

    if (buscarPorSerialBtn) {
        buscarPorSerialBtn.addEventListener("click", function () {
            hideAllSearchInputs(); // Oculta todos los demás
            serialInput.style.display = "block";
            buscarSerialBtn.style.display = "block";
            resultsCard.style.display = "block"; // Muestra el card de resultados
        });
    }
    hideAllSearchInputs();
});

function getRegionUsuarios() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/users/GetRegionUsers`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("SelectRgions");

          select.innerHTML = "";

          select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
          if (
            Array.isArray(response.regionusers) &&
            response.regionusers.length > 0
          ) {
            response.regionusers.forEach((regionusers) => {
              const option = document.createElement("option");
              option.value = regionusers.idreg;
              option.textContent = regionusers.desc_reg;
              select.appendChild(option);
            });
          } else {
            // Si no hay fallas, puedes mostrar un mensaje en el select
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay información disponible";
            select.appendChild(option);
          }
        } else {
          document.getElementById("rifMensaje").innerHTML +=
            "<br>Error al obtener los datos.";
          console.error("Error al obtener las fallas:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la información.";
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      document.getElementById("rifMensaje").innerHTML +=
        "<br>Error de conexión con el servidor para los áreas.";
    }
  };

  const datos = `action=GetRegionUsers`; // Cambia la acción para que coincida con el backend
  xhr.send(datos);
}

// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener("DOMContentLoaded", getRegionUsuarios);

function SendRegions() {
  const RegionSelectValue = document.getElementById("SelectRgions").value;

  // Mover la validación al principio para detener la ejecución si no hay región
  if (!RegionSelectValue) {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "Por favor, selecciona una región antes de buscar.",
      color: "black",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#003594",
    });
    return;
  }

  const mainTableCard = document.querySelector(".card");
  if (!mainTableCard) {
    console.error("Error: El contenedor principal de tablas (.card) no se encontró.");
    return;
  }
  
  // Limpiar cualquier mensaje de error o "no data" previo del contenedor principal
  mainTableCard.querySelectorAll("p").forEach((p) => p.remove());

  // Lógica para destruir DataTables y limpiar la tabla de forma segura
  const rifCountTable = document.getElementById("rifCountTable");
  if (rifCountTable && $.fn.DataTable.isDataTable(rifCountTable)) {
    $(rifCountTable).DataTable().destroy();
    rifCountTable.remove(); // Remueve completamente la tabla antigua
  }
  
  // Opcional: mostrar un mensaje de "cargando..." mientras se busca
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Buscando datos...";
  loadingMessage.className = "text-center text-muted";
  mainTableCard.appendChild(loadingMessage);

  mainTableCard.style.display = "block";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchRegionData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    // Eliminar el mensaje de carga
    if(loadingMessage) {
        loadingMessage.remove();
    }

    // Buscar de nuevo la referencia a la tabla, ya que pudo ser removida
    const existingTable = document.getElementById("rifCountTable");
    if (existingTable) {
        if ($.fn.DataTable.isDataTable(existingTable)) {
            $(existingTable).DataTable().destroy();
        }
        existingTable.remove();
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success && response.ticket && response.ticket.length > 0) {
          const TicketData = response.ticket;
          
          // Crea la tabla y sus elementos
          const newTable = document.createElement("table");
          newTable.id = "rifCountTable";
          newTable.className = "table table-striped table-bordered table-hover table-sm";
          mainTableCard.appendChild(newTable);

          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
          newTable.appendChild(thead);
          newTable.appendChild(tbody);

          // Lógica para crear las columnas y el thead
          const columnsConfig = [];
          const headerRow = thead.insertRow();
          const visibleKeys = new Set();
          
          Object.keys(TicketData[0]).forEach(key => {
              if (TicketData.some(item => item[key] !== null && item[key] !== undefined && item[key] !== "")) {
                  visibleKeys.add(key);
              }
          });
          
          const columnTitles = {
            id_ticket: "ID Ticket",
            create_ticket: "Create Ticket",
            name_status_ticket: "Status Ticket",
            rif_empresa: "Rif",
            razonsocial_cliente: "Razón Social",
            serial_pos: "Serial POS",
            name_failure: "Descripción de Fallas",
            name_process_ticket: "Process Ticket",
            name_status_payment: "Estatus Pago",
            full_name_tecnico: "Tecnico",
            name_accion_ticket: "Accion Ticket",
            full_name_coordinador: "Coordinador",
            id_level_failure: "Nivel de Falla",
            full_name_tecnicoassignado: "Técnico Asignado",
            downl_exoneration: "Exoneración",
            downl_payment: "Pago Anticipo",
            downl_send_to_rosal: "Enviado a Rosal",
            downl_send_fromrosal: "Enviado desde Rosal a destino",
            date_send_lab: "Fecha Envío Lab",
            date_send_torosal_fromlab: "Fecha Envío a rosal",
            name_status_domiciliacion: "Estatus Domiciliación",
            date_sendkey: "Fecha Envío Key",
            date_receivekey: "Fecha Recibo Key",
            date_receivefrom_desti: "Fecha Recibo Destino",
          };

          for (const key of visibleKeys) {
              const th = document.createElement("th");
              th.textContent = columnTitles[key] || key;
              headerRow.appendChild(th);
              
              const columnDef = {
                  data: key,
                  title: columnTitles[key] || key,
                  defaultContent: "",
              };
              if (["downl_exoneration", "downl_payment", "downl_send_to_rosal", "downl_send_fromrosal"].includes(key)) {
                  columnDef.render = (data) => (data === "Sí" ? "Sí" : "No");
              }
              columnsConfig.push(columnDef);
          }

          // Inicialización de DataTables
          $(newTable).DataTable({
            scrollCollapse: true,
            scrollX: true,
            responsive: false,
            scrollY: '60vh', // Altura fija para el cuerpo de la tabla
            fixedHeader: true, // Fijar el encabezado
            autoWidth: false, // Deshabilitar autoWidth para mejor control
            data: TicketData,
            columns: columnsConfig,
            pagingType: "simple_numbers",
            lengthMenu: [5],
            language: {
              lengthMenu: "Mostrar _MENU_ registros",
              emptyTable: "No hay datos disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
              infoEmpty: "No hay datos disponibles",
              infoFiltered: "(Filtrado de _MAX_ datos disponibles)",
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
          });
          $(newTable).resizableColumns();

        } else {
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para la región seleccionada.";
          mainTableCard.appendChild(noDataMessage);
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta.";
        mainTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
      }
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error de conexión con el servidor.";
      mainTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    if(loadingMessage) {
        loadingMessage.remove();
    }
    const existingTable = document.getElementById("rifCountTable");
    if (existingTable && $.fn.DataTable.isDataTable(existingTable)) {
        $(existingTable).DataTable().destroy();
        existingTable.remove();
    }
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de red. Verifica tu conexión.";
    mainTableCard.appendChild(errorMessage);
    console.error("Error de red");
  };

  const datos = `action=SearchRegionData&id_region=${encodeURIComponent(RegionSelectValue)}`;
  xhr.send(datos);
}

function SendRif() {
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.style.display = "none";
  }

  const tipoRif = document.getElementById("rifTipo").value;
  const numeroRif = document.getElementById("rifInput").value.trim();
  const rifCompleto = tipoRif + numeroRif;

  // Mover la validación al principio para detener la ejecución si no hay RIF
  if (!numeroRif) {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "Por favor, ingresa un RIF antes de buscar.",
      color: "black",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#003594",
    });
    return;
  }

  const razonCountTableCard = document.querySelector(".card");
  if (!razonCountTableCard) {
    console.error("Error: El contenedor principal de tablas (.card) no se encontró.");
    return;
  }
  
  // Limpiar cualquier mensaje de error o "no data" previo del contenedor principal
  razonCountTableCard.querySelectorAll("p").forEach((p) => p.remove());

  // **Lógica para destruir DataTables y limpiar la tabla de forma segura**
  // Destruye la instancia de DataTables si ya existe
  const rifCountTable = document.getElementById("rifCountTable");
  if (rifCountTable && $.fn.DataTable.isDataTable(rifCountTable)) {
    $(rifCountTable).DataTable().destroy();
    rifCountTable.remove(); // Remueve completamente la tabla antigua
  }
  
  // Opcional: mostrar un mensaje de "cargando..." mientras se busca
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Buscando datos...";
  loadingMessage.className = "text-center text-muted";
  razonCountTableCard.appendChild(loadingMessage);

  razonCountTableCard.style.display = "block";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchRifData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    // Eliminar el mensaje de carga
    if(loadingMessage) {
        loadingMessage.remove();
    }

    // Buscar de nuevo la referencia a la tabla, ya que pudo ser removida
    const existingTable = document.getElementById("rifCountTable");
    if (existingTable) {
        if ($.fn.DataTable.isDataTable(existingTable)) {
            $(existingTable).DataTable().destroy();
        }
        existingTable.remove();
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success && response.ticket && response.ticket.length > 0) {
          const TicketData = response.ticket;
          
          // Crea la tabla y sus elementos
          const newTable = document.createElement("table");
          newTable.id = "rifCountTable";
          newTable.className = "table table-striped table-bordered table-hover table-sm";
          razonCountTableCard.appendChild(newTable);

          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
          newTable.appendChild(thead);
          newTable.appendChild(tbody);

          // Lógica para crear las columnas y el thead
          const columnsConfig = [];
          const headerRow = thead.insertRow();
          const visibleKeys = new Set();
          
          Object.keys(TicketData[0]).forEach(key => {
              if (TicketData.some(item => item[key] !== null && item[key] !== undefined && item[key] !== "")) {
                  visibleKeys.add(key);
              }
          });
          
          const columnTitles = {
              // ... Tus títulos de columna
              id_ticket: "ID Ticket",
              create_ticket: "Fecha Creación Ticket",
              name_status_ticket: "Estatus Ticket",
              rif_empresa: "Rif",
              razonsocial_cliente: "Razón Social",
              name_process_ticket: "Proceso Ticket",
              name_status_payment: "Estatus Pago",
              full_name_tecnico: "Usuario Gestión",
              name_accion_ticket: "Acción Ticket",
              full_name_coordinador: "Coordinador",
              id_level_failure: "Nivel de Falla",
              full_name_tecnicoassignado: "Técnico Asignado",
              serial_pos: "Serial POS",
              name_failure: "Descripción de Fallas",
              downl_exoneration: "Exoneración",
              downl_payment: "Pago Anticipo",
              downl_send_to_rosal: "Enviado a Rosal",
              downl_send_fromrosal: "Enviado desde Rosal a destino",
              date_send_lab: "Fecha Envío Lab",
              date_send_torosal_fromlab: "Fecha Envío a rosal",
              name_status_domiciliacion: "Estatus Domiciliación",
              date_sendkey: "Fecha Envío Key",
              date_receivekey: "Fecha Recibo Key",
              date_receivefrom_desti: "Fecha Recibo Destino",
          };

          for (const key of visibleKeys) {
              const th = document.createElement("th");
              th.textContent = columnTitles[key] || key;
              headerRow.appendChild(th);
              
              const columnDef = {
                  data: key,
                  title: columnTitles[key] || key,
                  defaultContent: "",
              };
              if (["downl_exoneration", "downl_payment", "downl_send_to_rosal", "downl_send_fromrosal"].includes(key)) {
                  columnDef.render = (data) => (data === "Sí" ? "Sí" : "No");
              }
              columnsConfig.push(columnDef);
          }

          // Inicialización de DataTables
          $(newTable).DataTable({
            responsive: false,
            data: TicketData,
            columns: columnsConfig,
            pagingType: "simple_numbers",
            lengthMenu: [5],
            autoWidth: false,
            language: {
              lengthMenu: "Mostrar _MENU_ registros",
              emptyTable: "No hay datos disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
              infoEmpty: "No hay datos disponibles",
              infoFiltered: "(Filtrado de _MAX_ datos disponibles)",
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
          });
          $(newTable).resizableColumns();

        } else {
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para el RIF ingresado.";
          razonCountTableCard.appendChild(noDataMessage);
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta.";
        razonCountTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
      }
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error de conexión con el servidor.";
      razonCountTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    if(loadingMessage) {
        loadingMessage.remove();
    }
    const existingTable = document.getElementById("rifCountTable");
    if (existingTable && $.fn.DataTable.isDataTable(existingTable)) {
        $(existingTable).DataTable().destroy();
        existingTable.remove();
    }
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de red. Verifica tu conexión.";
    razonCountTableCard.appendChild(errorMessage);
    console.error("Error de red");
  };

  const datos = `action=SearchRifData&rif=${encodeURIComponent(rifCompleto)}`;
  xhr.send(datos);
}

function SendSerial() {
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.style.display = "none";
  }

  const serialInput = document.getElementById("serialInput");
  const serialInputValue = serialInput.value.trim();

  // Mover la validación al principio para detener la ejecución si no hay serial
  if (!serialInputValue) {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "Por favor, ingrese un número de serie para buscar.",
      color: "black",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#003594",
    });
    return;
  }

  const razonCountTableCard = document.querySelector(".card");
  if (!razonCountTableCard) {
    console.error("Error: El contenedor principal de tablas (.card) no se encontró.");
    return;
  }
  
  // Limpiar cualquier mensaje de error o "no data" previo del contenedor principal
  razonCountTableCard.querySelectorAll("p").forEach((p) => p.remove());

  // **Lógica para destruir DataTables y limpiar la tabla de forma segura**
  // Destruye la instancia de DataTables si ya existe
  const rifCountTable = document.getElementById("rifCountTable");
  if (rifCountTable && $.fn.DataTable.isDataTable(rifCountTable)) {
    $(rifCountTable).DataTable().destroy();
    rifCountTable.remove(); // Remueve completamente la tabla antigua
  }
  
  // Opcional: mostrar un mensaje de "cargando..." mientras se busca
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Buscando datos...";
  loadingMessage.className = "text-center text-muted";
  razonCountTableCard.appendChild(loadingMessage);

  razonCountTableCard.style.display = "block";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchSerialData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    // Eliminar el mensaje de carga
    if(loadingMessage) {
        loadingMessage.remove();
    }
    
    // Buscar de nuevo la referencia a la tabla, ya que pudo ser removida
    const existingTable = document.getElementById("rifCountTable");
    if (existingTable) {
        if ($.fn.DataTable.isDataTable(existingTable)) {
            $(existingTable).DataTable().destroy();
        }
        existingTable.remove();
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success && response.ticket && response.ticket.length > 0) {
          const TicketData = response.ticket;

          // Crea la tabla y sus elementos
          const newTable = document.createElement("table");
          newTable.id = "rifCountTable";
          newTable.className = "table table-striped table-bordered table-hover table-sm";
          razonCountTableCard.appendChild(newTable);

          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
          newTable.appendChild(thead);
          newTable.appendChild(tbody);

          // Lógica para crear las columnas y el thead
          const columnsConfig = [];
          const headerRow = thead.insertRow();
          const visibleKeys = new Set();
          
          Object.keys(TicketData[0]).forEach(key => {
              if (TicketData.some(item => item[key] !== null && item[key] !== undefined && item[key] !== "")) {
                  visibleKeys.add(key);
              }
          });

          const columnTitles = {
              // ... Tus títulos de columna
              id_ticket: "ID Ticket",
              create_ticket: "Create Ticket",
              name_status_ticket: "Status Ticket",
              rif_empresa: "Rif",
              razonsocial_cliente: "Razón Social",
              name_process_ticket: "Process Ticket",
              name_status_payment: "Estatus Pago",
              full_name_tecnico: "Usuario Gestión",
              name_accion_ticket: "Accion Ticket",
              full_name_coordinador: "Coordinador",
              id_level_failure: "Nivel de Falla",
              full_name_tecnicoassignado: "Técnico Asignado",
              serial_pos: "Serial POS",
              name_failure: "Descripción de Fallas",
              downl_exoneration: "Exoneración",
              downl_payment: "Pago Anticipo",
              downl_send_to_rosal: "Enviado a Rosal",
              downl_send_fromrosal: "Enviado desde Rosal a destino",
              date_send_lab: "Fecha Envío Lab",
              date_send_torosal_fromlab: "Fecha Envío a rosal",
              name_status_domiciliacion: "Estatus Domiciliación",
              date_sendkey: "Fecha Envío Key",
              date_receivekey: "Fecha Recibo Key",
              date_receivefrom_desti: "Fecha Recibo Destino",
          };

          for (const key of visibleKeys) {
              const th = document.createElement("th");
              th.textContent = columnTitles[key] || key;
              headerRow.appendChild(th);
              
              const columnDef = {
                  data: key,
                  title: columnTitles[key] || key,
                  defaultContent: "",
              };
              if (["downl_exoneration", "downl_payment", "downl_send_to_rosal", "downl_send_fromrosal"].includes(key)) {
                  columnDef.render = (data) => (data === "Sí" ? "Sí" : "No");
              }
              columnsConfig.push(columnDef);
          }

          // Inicialización de DataTables
          $(newTable).DataTable({
            responsive: false,
            data: TicketData,
            columns: columnsConfig,
            pagingType: "simple_numbers",
            lengthMenu: [5],
            autoWidth: false,
            language: {
              lengthMenu: "Mostrar _MENU_ registros",
              emptyTable: "No hay datos disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
              infoEmpty: "No hay datos disponibles",
              infoFiltered: "(Filtrado de _MAX_ datos disponibles)",
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
          });
          $(newTable).resizableColumns();

        } else {
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para el serial ingresado.";
          razonCountTableCard.appendChild(noDataMessage);
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta.";
        razonCountTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
      }
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error de conexión con el servidor.";
      razonCountTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    if(loadingMessage) {
        loadingMessage.remove();
    }
    const existingTable = document.getElementById("rifCountTable");
    if (existingTable && $.fn.DataTable.isDataTable(existingTable)) {
        $(existingTable).DataTable().destroy();
        existingTable.remove();
    }
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de red. Verifica tu conexión.";
    razonCountTableCard.appendChild(errorMessage);
    console.error("Error de red");
  };

  const datos = `action=SearchSerialData&serial=${encodeURIComponent(serialInputValue)}`;
  xhr.send(datos);
}

function SendRango() {
  const initialDate = document.getElementById("date-ini").value;
  const endDate = document.getElementById("date-end").value;

  if (!initialDate || !endDate) {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "Por favor, ingrese un rango de fechas antes de buscar.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#003594",
      color: "black",
    });
    return;
  }

  const razonCountTableCard = document.querySelector(".card");
  if (!razonCountTableCard) {
    console.error("Error: El contenedor principal de tablas (.card) no se encontró.");
    return;
  }

  // **Destruye la instancia de DataTables y limpia la tabla si existe**
  let rifCountTable = document.getElementById("rifCountTable");
  if ($.fn.DataTable.isDataTable(rifCountTable)) {
    $(rifCountTable).DataTable().destroy();
  }
  // Remueve la tabla completamente para recrearla con nuevos encabezados (opcional, pero seguro)
  if (rifCountTable) {
      rifCountTable.remove();
      rifCountTable = null;
  }

  // Muestra el contenedor de la tabla
  razonCountTableCard.style.display = "block";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchRangeDate`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    // Limpia los mensajes de error previos
    razonCountTableCard.querySelectorAll("p").forEach((p) => p.remove());

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success && response.ticket && response.ticket.length > 0) {
          const TicketData = response.ticket;
          
          // Crea la tabla y sus elementos
          rifCountTable = document.createElement("table");
          rifCountTable.id = "rifCountTable";
          rifCountTable.className = "table table-striped table-bordered table-hover table-sm";
          razonCountTableCard.appendChild(rifCountTable);

          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
          rifCountTable.appendChild(thead);
          rifCountTable.appendChild(tbody);

          // Lógica para crear las columnas y el thead
          const columnsConfig = [];
          const headerRow = thead.insertRow();
          const visibleKeys = new Set();
          
          Object.keys(TicketData[0]).forEach(key => {
              if (TicketData.some(item => item[key] !== null && item[key] !== undefined && item[key] !== "")) {
                  visibleKeys.add(key);
              }
          });

          const columnTitles = {
              // ... Tus títulos de columna
              id_ticket: "ID Ticket",
              create_ticket: "Create Ticket",
              name_status_ticket: "Status Ticket",
              rif_empresa: "Rif",
              razonsocial_cliente: "Razón Social",
              name_process_ticket: "Process Ticket",
              name_status_payment: "Estatus Pago",
              full_name_tecnico: "Usuario Gestión",
              name_accion_ticket: "Accion Ticket",
              full_name_coordinador: "Coordinador",
              id_level_failure: "Nivel de Falla",
              full_name_tecnicoassignado: "Técnico Asignado",
              serial_pos: "Serial POS",
              name_failure: "Descripción de Fallas",
              downl_exoneration: "Exoneración",
              downl_payment: "Pago Anticipo",
              downl_send_to_rosal: "Enviado a Rosal",
              downl_send_fromrosal: "Enviado desde Rosal a destino",
              date_send_lab: "Fecha Envío Lab",
              date_send_torosal_fromlab: "Fecha Envío a rosal",
              name_status_domiciliacion: "Estatus Domiciliación",
              date_sendkey: "Fecha Envío Key",
              date_receivekey: "Fecha Recibo Key",
              date_receivefrom_desti: "Fecha Recibo Destino",
          };

          for (const key of visibleKeys) {
              const th = document.createElement("th");
              th.textContent = columnTitles[key] || key;
              headerRow.appendChild(th);
              
              const columnDef = {
                  data: key,
                  title: columnTitles[key] || key,
                  defaultContent: "",
              };
              if (["downl_exoneration", "downl_payment", "downl_send_to_rosal", "downl_send_fromrosal"].includes(key)) {
                  columnDef.render = (data) => (data === "Sí" ? "Sí" : "No");
              }
              columnsConfig.push(columnDef);
          }

          // Inicialización de DataTables
          $(rifCountTable).DataTable({
            scrollCollapse: true,
            scrollX: true,
            responsive: false,
            scrollY: '60vh',
            fixedHeader: true,
            autoWidth: false,
            data: TicketData,
            columns: columnsConfig,
            pagingType: "simple_numbers",
            lengthMenu: [5],
            language: {
              lengthMenu: "Mostrar _MENU_ registros",
              emptyTable: "No hay datos disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
              infoEmpty: "No hay datos disponibles",
              infoFiltered: "(Filtrado de _MAX_ datos disponibles)",
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
          });
          $(rifCountTable).resizableColumns();

        } else {
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para el rango de fechas seleccionado.";
          razonCountTableCard.appendChild(noDataMessage);
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta.";
        razonCountTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
      }
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error de conexión con el servidor.";
      razonCountTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    razonCountTableCard.querySelectorAll("p").forEach((p) => p.remove());
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de red. Verifica tu conexión.";
    razonCountTableCard.appendChild(errorMessage);
    console.error("Error de red");
  };

  const datos = `action=SearchRangeDate&initial=${encodeURIComponent(initialDate)}&second=${encodeURIComponent(endDate)}`;
  xhr.send(datos);
}
