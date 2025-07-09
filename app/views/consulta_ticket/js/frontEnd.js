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
  const buscarPorRifBtn = document.getElementById("buscarPorRifBtn");
  const rifInput = document.getElementById("rifInput");
  const buscarRif = document.getElementById("buscarRif");
  const rifCountTableCard = document.querySelector(".card");
  const selectInputRif = document.getElementById("rifTipo");
  const inputRif = document.getElementById("rifInput");
  const messageErrorDate = document.getElementById("errorDateEnd");
  const messageErrorDateIni = document.getElementById("errorDateIni");

  const buscarPorSerialBtn = document.getElementById("buscarPorSerialBtn");
  const serialInput = document.getElementById("serialInput");
  const buscarSerial = document.getElementById("buscarSerial");
  const serialCountTableCard = document.querySelector(".card");

  const buscarPorRazonBtn = document.getElementById("buscarPorNombreBtn");
  const razonInput = document.getElementById("RazonInput");
  const buscarRazon = document.getElementById("buscarRazon");
  const razonCountTableCard = document.querySelector(".card");

  const buscarPorRangoBtn = document.getElementById("buscarPorRangoBtn");
  const Rangoinput = document.getElementById("date-ini");
  const Rangoinput1 = document.getElementById("date-end");
  const BuscarRango = document.getElementById("buscarRango");
  const rangoCountTableCard = document.querySelector(".card");

  const buscarPorRegionsBtn = document.getElementById("buscarPorRegionsBtn");
  const buscarRegions = document.getElementById("buscarRegions");
  const SelectRgions = document.getElementById("SelectRgions");
  const regionCountTableCard = document.querySelector(".card");

  const inputsDate = document.getElementById("inputsDate");

  if (buscarPorRegionsBtn && regionCountTableCard) {
    buscarPorRegionsBtn.addEventListener("click", function () {
      regionCountTableCard.style.display = "block"; // Muestra la tabla
      buscarRegions.style.display = "block"; // Muestra el input
      SelectRgions.style.display = "block"; // Oculta el botón

      selectInputRif.style.display = "none"; // Muestra el select
      buscarRif.style.display = "none"; // Oculta el botón
      rifInput.style.display = "none"; // Muestra el input
      serialInput.style.display = "none"; // Oculta el botón
      buscarSerial.style.display = "none"; // Oculta el botón

      Rangoinput.style.display = "none"; // Muestra el input
      BuscarRango.style.display = "none"; // Oculta el botón
      Rangoinput1.style.display = "none"; // Muestra el input

      razonInput.style.display = "none"; // Muestra el input
      buscarRazon.style.display = "none"; // Oculta el botón
      messageErrorDate.style.display = "none"; // Oculta el mensaje de error
      messageErrorDateIni.style.display = "none"; // Oculta el mensaje de error
      inputsDate.style.display = "none"; // Oculta los inputs de fecha

      if (regionCountTableCard) {
        razonCountTableCard.innerHTML = ""; // Limpia el contenido del contenedor de resultados de la razón social
        serialCountTableCard.innerHTML = ""; // Limpia el contenido del contenedor de resultados de la serial
        rangoCountTableCard.innerHTML = ""; // Limpia el contenido del contenedor de resultados del rango
        // Si es una tabla, podrías necesitar limpiar el tbody:
        // const tableBody = regionResultsContainer.querySelector('tbody');
        // if (tableBody) {
        //     tableBody.innerHTML = '';
        // }
      }
      // =======================================================
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla."); // Para verificar si los elementos se seleccionan
  }

  if (buscarPorRangoBtn && rangoCountTableCard) {
    buscarPorRangoBtn.addEventListener("click", function () {
      rangoCountTableCard.style.display = "block"; // Muestra la tabla
      Rangoinput.style.display = "block"; // Muestra el input
      BuscarRango.style.display = "block"; // Oculta el botón
      Rangoinput1.style.display = "block"; // Muestra el input
      messageErrorDate.style.display = "block"; // Oculta el mensaje de error
      messageErrorDateIni.style.display = "block"; // Oculta el mensaje de error

      razonInput.style.display = "none"; // Muestra el input
      buscarRazon.style.display = "none"; // Oculta el botón
      inputsDate.style.display = "block"; // Oculta los inputs de fecha

      selectInputRif.style.display = "none"; // Muestra el select
      buscarRif.style.display = "none"; // Oculta el botón
      rifInput.style.display = "none"; // Muestra el input*/

      serialInput.style.display = "none"; // Oculta el botón
      buscarSerial.style.display = "none"; // Oculta el botón
      buscarRegions.style.display = "none"; // Muestra el input
      SelectRgions.style.display = "none"; // Oculta el botón
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla."); // Para verificar si los elementos se seleccionan
  }

  if (buscarPorRazonBtn && razonCountTableCard) {
    buscarPorRazonBtn.addEventListener("click", function () {
      razonCountTableCard.style.display = "block"; // Muestra la tabla
      razonInput.style.display = "block"; // Muestra el input
      buscarRazon.style.display = "block"; // Oculta el botón
      

      selectInputRif.style.display = "none"; // Muestra el select
      buscarRif.style.display = "none"; // Oculta el botón
      rifInput.style.display = "none"; // Muestra el input*/
      inputsDate.style.display = "block"; // Oculta los inputs de fecha

      serialInput.style.display = "none"; // Oculta el botón
      buscarSerial.style.display = "none"; // Oculta el botón

      Rangoinput.style.display = "none"; // Muestra el input
      BuscarRango.style.display = "none"; // Oculta el botón
      Rangoinput1.style.display = "none"; // Muestra el input
      buscarRegions.style.display = "none"; // Muestra el input
      SelectRgions.style.display = "none"; // Oculta el botón
      messageErrorDate.style.display = "none"; // Oculta el mensaje de error
      messageErrorDateIni.style.display = "none"; // Oculta el mensaje de error
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla."); // Para verificar si los elementos se seleccionan
  }

  if (buscarPorRifBtn && rifCountTableCard) {
    buscarPorRifBtn.addEventListener("click", function () {
      rifCountTableCard.style.display = "block"; // Muestra la tabla
      rifInput.style.display = "block"; // Muestra el input

      $("#rifInput").keyup(function () {
        let string = $("#rifInput").val();
        $("#rifInput").val(string.replace(/ /g, ""));
      });

      if (rifInput) {
        rifInput.addEventListener("input", function () {
          // Cambiado de keyup a input
          // Asegura que solo sean dígitos. Elimina cualquier cosa que no sea un número.
          this.value = this.value.replace(/\D/g, "");
        });
      }

      selectInputRif.style.display = "block"; // Muestra el select
      buscarRif.style.display = "block"; // Oculta el botón
      buscarSerial.style.display = "none"; // Oculta el botón

      serialInput.style.display = "none";
      buscarRazon.style.display = "none"; // Oculta el botón
      razonInput.style.display = "none"; // Oculta el botón
      inputsDate.style.display = "none"; // Oculta los inputs de fecha

      Rangoinput.style.display = "none"; // Muestra el input
      BuscarRango.style.display = "none"; // Oculta el botón
      Rangoinput1.style.display = "none"; // Muestra el input
      buscarRegions.style.display = "none"; // Muestra el input
      SelectRgions.style.display = "none"; // Oculta el botón
      messageErrorDate.style.display = "none"; // Oculta el mensaje de error
      messageErrorDateIni.style.display = "none"; // Oculta el mensaje de error

      // Lógica para limpiar los datos anteriores de la búsqueda por región
      // =======================================================
      if (rifCountTableCard) {
        razonCountTableCard.innerHTML = ""; // Limpia el contenido del contenedor de resultados de la razón social
        serialCountTableCard.innerHTML = ""; // Limpia el contenido del contenedor de resultados de la serial
        rangoCountTableCard.innerHTML = ""; // Limpia el contenido del contenedor de resultados del rango

        // Si es una tabla, podrías necesitar limpiar el tbody:
        // const tableBody = regionResultsContainer.querySelector('tbody');
        // if (tableBody) {
        //     tableBody.innerHTML = '';
        // }
      }
      // =======================================================
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla."); // Para verificar si los elementos se seleccionan
  }

  if (buscarPorSerialBtn) {
    buscarPorSerialBtn.addEventListener("click", function () {
      serialCountTableCard.style.display = "block"; // Muestra la tabla
      serialInput.style.display = "block"; // Muestra el input
      buscarSerial.style.display = "block"; // Oculta el botón
      selectInputRif.style.display = "none"; // Muestra el select
      rifInput.style.display = "none"; // Muestra el input
      buscarRif.style.display = "none"; // Oculta el botón
      buscarRazon.style.display = "none"; // Oculta el botón
      razonInput.style.display = "none"; // Oculta el botón

      Rangoinput.style.display = "none"; // Muestra el input
      BuscarRango.style.display = "none"; // Oculta el botón
      Rangoinput1.style.display = "none"; // Muestra el input
      buscarRegions.style.display = "none"; // Muestra el input
      SelectRgions.style.display = "none"; // Oculta el botón
      messageErrorDate.style.display = "none"; // Oculta el mensaje de error
      messageErrorDateIni.style.display = "none"; // Oculta el mensaje de error

      if (serialCountTableCard) {
        razonCountTableCard.innerHTML = ""; // Limpia el contenido del contenedor de resultados de la razón social
        rifCountTableCard.innerHTML = ""; // Limpia el contenido del contenedor de resultados de la serial
        rangoCountTableCard.innerHTML = ""; // Limpia el contenido del contenedor de resultados del rango
        // Si es una tabla, podrías necesitar limpiar el tbody:
        // const tableBody = regionResultsContainer.querySelector('tbody');
        // if (tableBody) {
        //     tableBody.innerHTML = '';
        // }
      }
      // =======================================================
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla."); // Para verificar si los elementos se seleccionan
  }
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
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchRegionData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Obtener el contenedor principal donde irá la tabla. Asumo que es el mismo .card
  // que usas para todas las búsquedas.
  const mainTableCard = document.querySelector(".card");

  // Si mainTableCard no existe, no podemos continuar. Asegúrate de que este elemento base siempre esté en tu HTML.
  if (!mainTableCard) {
    console.error(
      "Error: El contenedor principal de tablas (.card) no se encontró."
    );
    return;
  }

  let rifCountTable = document.getElementById("rifCountTable");

  xhr.onload = function () {
    // Limpiar cualquier mensaje de error o "no data" previo del contenedor principal
    // Asegúrate de que solo borras los mensajes y no otros elementos importantes dentro del card
    mainTableCard.querySelectorAll("p").forEach((p) => p.remove());

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        // Siempre remover la tabla existente antes de crear una nueva, si existe
        if (rifCountTable) {
          // Si ya es una instancia de DataTables, destrúyela primero
          if ($.fn.DataTable.isDataTable(rifCountTable)) {
            $(rifCountTable).DataTable().destroy();
          }
          rifCountTable.remove();
          rifCountTable = null; // Resetear la referencia
        }

        if (response.success && response.ticket && response.ticket.length > 0) {
          const TicketData = response.ticket;
          console.log(TicketData);

          // Crear la tabla si no existe (o después de haber sido removida)
          rifCountTable = document.createElement("table");
          rifCountTable.id = "rifCountTable";
          rifCountTable.className =
            "table table-striped table-bordered table-hover table-sm"; // Clases de Bootstrap
          mainTableCard.appendChild(rifCountTable); // Añadir la tabla al contenedor principal

          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
          rifCountTable.appendChild(thead);
          rifCountTable.appendChild(tbody);

          const columnTitles = {
            id_ticket: "ID Ticket",
            create_ticket: "Create Ticket",
            name_status_ticket: "Status Ticket",
            rif_empresa: "Rif Empresa",
            name_process_ticket: "Process Ticket",
            name_status_payment: "Estatus Pago",
            full_name_tecnico: "Tecnico",
            name_accion_ticket: "Accion Ticket",
            full_name_coordinador: "Coordinador",
            id_level_failure: "Level Failure",
            full_name_tecnicoassignado: "Tecnico Asignado",
            serial_pos: "Serial POS",
            name_failure: "Failure",
            downl_exoneration: "Exoneración",
            downl_payment: "Pago Anticipo",
            downl_send_to_rosal: "Enviado a Rosal",
            downl_send_fromrosal: "Enviado desde Rosal A destino",
            date_send_lab: "Fecha Envío Lab",
            date_send_torosal_fromlab: "Fecha Envío arosal",
            name_status_domiciliacion: "Estatus Domiciliación",
            date_sendkey: "Fecha Envío Key",
            date_receivekey: "Fecha Recibo Key",
            date_receivefrom_desti: "Fecha Recibo Destino",
          };

          const visibleColumns = new Set();
          const allColumns = Object.keys(TicketData[0] || {});

          allColumns.forEach((key) => {
            const hasData = TicketData.some(
              (item) =>
                item[key] !== null &&
                item[key] !== undefined &&
                item[key] !== ""
            );
            if (hasData) {
              visibleColumns.add(key);
            }
          });

          const columnsConfig = [];
          const headerRow = thead.insertRow();
          for (const key of visibleColumns) {
            const th = document.createElement("th");
            th.textContent = columnTitles[key] || key;
            headerRow.appendChild(th);
            const columnDef = {
              data: key,
              title: columnTitles[key] || key,
              defaultContent: "",
            };
            if (
              [
                "downl_exoneration",
                "downl_payment",
                "downl_send_to_rosal",
                "downl_send_fromrosal",
              ].includes(key)
            ) {
              columnDef.render = (data) => (data === "Sí" ? "Sí" : "No");
            }
            columnsConfig.push(columnDef);
          }

          // DataTables manejará la adición de filas, no es necesario hacer un loop para insertarlas manualmente
          // TicketData.forEach(item => {
          //     const row = tbody.insertRow();
          //     for (const key of visibleColumns) {
          //         const cell = row.insertCell();
          //         cell.textContent = item[key] !== null && item[key] !== undefined ? item[key] : '';
          //     }
          // });

          $("rifCountTable").DataTable({
            scrollCollapse: true,
            scrollX: "300px",
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
          $(rifCountTable).resizableColumns();
          mainTableCard.style.display = "block"; // Asegúrate de que el contenedor de la tabla sea visible
        } else {
          // Si no hay datos o la respuesta es falsa, mostrar mensaje y ocultar/remover tabla
          if (rifCountTable) {
            if ($.fn.DataTable.isDataTable(rifCountTable)) {
              $(rifCountTable).DataTable().destroy();
            }
            rifCountTable.remove();
            rifCountTable = null;
          }
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No hay datos disponibles.";
          mainTableCard.appendChild(noDataMessage);
          mainTableCard.style.display = "block"; // Mantener el contenedor visible para el mensaje
          console.warn(
            "No se encontraron datos o la respuesta no fue exitosa."
          );
        }
      } catch (error) {
        if (rifCountTable) {
          if ($.fn.DataTable.isDataTable(rifCountTable)) {
            $(rifCountTable).DataTable().destroy();
          }
          rifCountTable.remove();
          rifCountTable = null;
        }
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta.";
        mainTableCard.appendChild(errorMessage);
        mainTableCard.style.display = "block";
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      if (rifCountTable) {
        if ($.fn.DataTable.isDataTable(rifCountTable)) {
          $(rifCountTable).DataTable().destroy();
        }
        rifCountTable.remove();
        rifCountTable = null;
      }
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No se encontraron datos.";
      mainTableCard.appendChild(noDataMessage);
      mainTableCard.style.display = "block";
    } else {
      if (rifCountTable) {
        if ($.fn.DataTable.isDataTable(rifCountTable)) {
          $(rifCountTable).DataTable().destroy();
        }
        rifCountTable.remove();
        rifCountTable = null;
      }
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error de conexión.";
      mainTableCard.appendChild(errorMessage);
      mainTableCard.style.display = "block";
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    if (rifCountTable) {
      if ($.fn.DataTable.isDataTable(rifCountTable)) {
        $(rifCountTable).DataTable().destroy();
      }
      rifCountTable.remove();
      rifCountTable = null;
    }
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de red.";
    mainTableCard.appendChild(errorMessage);
    mainTableCard.style.display = "block";
    console.error("Error de red");
  };
  const RegionSelectValue = document.getElementById("SelectRgions").value;
  const datos = `action=SearchRegionData&id_region=${encodeURIComponent(
    RegionSelectValue
  )}`;
  xhr.send(datos);
}

function SendRif() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchRifData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Obtener el contenedor principal donde irá la tabla. Asumo que es el mismo .card
  const mainTableCard = document.querySelector(".card"); // O el ID específico de tu contenedor principal de tablas

  // Si mainTableCard no existe, no podemos continuar. Deberías asegurarte de que este elemento base siempre esté en tu HTML.
  if (!mainTableCard) {
    console.error(
      "Error: El contenedor principal de tablas (.card) no se encontró."
    );
    return;
  }

  let rifCountTable = document.getElementById("rifCountTable");

  xhr.onload = function () {
    // Limpiar cualquier mensaje de error o "no data" previo del contenedor principal
    mainTableCard.querySelectorAll("p").forEach((p) => p.remove());

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        // Siempre remover la tabla existente antes de crear una nueva, si existe
        if (rifCountTable) {
          // Si ya es una instancia de DataTables, destrúyela primero
          if ($.fn.DataTable.isDataTable(rifCountTable)) {
            $(rifCountTable).DataTable().destroy();
          }
          rifCountTable.remove();
          rifCountTable = null; // Resetear la referencia
        }

        if (response.success && response.ticket && response.ticket.length > 0) {
          const TicketData = response.ticket;
          console.log(TicketData);

          // Crear la tabla si no existe (o después de haber sido removida)
          rifCountTable = document.createElement("table");
          rifCountTable.id = "rifCountTable";
          rifCountTable.className =
            "table table-striped table-bordered table-hover table-sm"; // Clases de Bootstrap
          mainTableCard.appendChild(rifCountTable); // Añadir la tabla al contenedor principal

          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
          rifCountTable.appendChild(thead);
          rifCountTable.appendChild(tbody);

          const columnTitles = {
            id_ticket: "ID Ticket",
            create_ticket: "Fecha Creacion Ticket",
            name_status_ticket: "Estatus Ticket",
            rif_empresa: "Rif Empresa",
            name_process_ticket: "Proceso Ticket",
            name_status_payment: "Estatus Pago",
            full_name_tecnico: "Tecnico",
            name_accion_ticket: "Accion Ticket",
            full_name_coordinador: "Coordinador",
            id_level_failure: "Nivel Falla",
            full_name_tecnicoassignado: "Tecnico Asignado",
            serial_pos: "Serial POS",
            name_failure: "Falla",
            downl_exoneration: "Exoneración",
            downl_payment: "Pago Anticipo",
            downl_send_to_rosal: "Enviado a Rosal",
            downl_send_fromrosal: "Enviado desde Rosal A destino",
            date_send_lab: "Fecha Envío Lab",
            date_send_torosal_fromlab: "Fecha Envío arosal",
            name_status_domiciliacion: "Estatus Domiciliación",
            date_sendkey: "Fecha Envío Key",
            date_receivekey: "Fecha Recibo Key",
            date_receivefrom_desti: "Fecha Recibo Destino",
          };

          const visibleColumns = new Set();
          const allColumns = Object.keys(TicketData[0] || {});

          allColumns.forEach((key) => {
            const hasData = TicketData.some(
              (item) =>
                item[key] !== null &&
                item[key] !== undefined &&
                item[key] !== ""
            );
            if (hasData) {
              visibleColumns.add(key);
            }
          });

          const columnsConfig = [];
          const headerRow = thead.insertRow();
          for (const key of visibleColumns) {
            const th = document.createElement("th");
            th.textContent = columnTitles[key] || key;
            headerRow.appendChild(th);
            const columnDef = {
              data: key,
              title: columnTitles[key] || key,
              defaultContent: "",
            };
            if (
              [
                "downl_exoneration",
                "downl_payment",
                "downl_send_to_rosal",
                "downl_send_fromrosal",
              ].includes(key)
            ) {
              columnDef.render = (data) => (data === "Sí" ? "Sí" : "No");
            }
            columnsConfig.push(columnDef);
          }

          // DataTables manejará la adición de filas, no es necesario hacer un loop para insertarlas manualmente
          // TicketData.forEach(item => {
          //     const row = tbody.insertRow();
          //     for (const key of visibleColumns) {
          //         const cell = row.insertCell();
          //         cell.textContent = item[key] !== null && item[key] !== undefined ? item[key] : '';
          //     }
          // });

          $(rifCountTable).DataTable({
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
          $(rifCountTable).resizableColumns();
          mainTableCard.style.display = "block"; // Asegúrate de que el contenedor de la tabla sea visible
        } else {
          // Si no hay datos o la respuesta es falsa, mostrar mensaje y ocultar/remover tabla
          if (rifCountTable) {
            // Si ya es una instancia de DataTables, destrúyela primero
            if ($.fn.DataTable.isDataTable(rifCountTable)) {
              $(rifCountTable).DataTable().destroy();
            }
            rifCountTable.remove();
            rifCountTable = null;
          }
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No hay datos disponibles.";
          mainTableCard.appendChild(noDataMessage);
          mainTableCard.style.display = "block"; // Mantener el contenedor visible para el mensaje
          console.warn(
            "No se encontraron datos o la respuesta no fue exitosa."
          );
        }
      } catch (error) {
        if (rifCountTable) {
          if ($.fn.DataTable.isDataTable(rifCountTable)) {
            $(rifCountTable).DataTable().destroy();
          }
          rifCountTable.remove();
          rifCountTable = null;
        }
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta.";
        mainTableCard.appendChild(errorMessage);
        mainTableCard.style.display = "block";
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      if (rifCountTable) {
        if ($.fn.DataTable.isDataTable(rifCountTable)) {
          $(rifCountTable).DataTable().destroy();
        }
        rifCountTable.remove();
        rifCountTable = null;
      }
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No se encontraron datos.";
      mainTableCard.appendChild(noDataMessage);
      mainTableCard.style.display = "block";
    } else {
      if (rifCountTable) {
        if ($.fn.DataTable.isDataTable(rifCountTable)) {
          $(rifCountTable).DataTable().destroy();
        }
        rifCountTable.remove();
        rifCountTable = null;
      }
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error de conexión.";
      mainTableCard.appendChild(errorMessage);
      mainTableCard.style.display = "block";
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    if (rifCountTable) {
      if ($.fn.DataTable.isDataTable(rifCountTable)) {
        $(rifCountTable).DataTable().destroy();
      }
      rifCountTable.remove();
      rifCountTable = null;
    }
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de red.";
    mainTableCard.appendChild(errorMessage);
    mainTableCard.style.display = "block";
    console.error("Error de red");
  };

  const SelectRifTio = document.getElementById("rifTipo").value;
  const RifInputValue = document.getElementById("rifInput").value;
  const rif = SelectRifTio + RifInputValue;
  const datos = `action=SearchRifData&rif=${encodeURIComponent(rif)}`;
  xhr.send(datos);
}

function SendSerial() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchSerialData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Obtener el contenedor principal donde irá la tabla. Asumo que es el mismo .card
  const mainTableCard = document.querySelector(".card"); // O el ID específico de tu contenedor principal de tablas

  // Si mainTableCard no existe, no podemos continuar. Deberías asegurarte de que este elemento base siempre esté en tu HTML.
  if (!mainTableCard) {
    console.error(
      "Error: El contenedor principal de tablas (.card) no se encontró."
    );
    return;
  }

  let rifCountTable = document.getElementById("rifCountTable");

  xhr.onload = function () {
    // Limpiar cualquier mensaje de error o "no data" previo del contenedor principal
    mainTableCard.querySelectorAll("p").forEach((p) => p.remove());

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        // Siempre remover la tabla existente antes de crear una nueva, si existe
        if (rifCountTable) {
          // Si ya es una instancia de DataTables, destrúyela primero
          if ($.fn.DataTable.isDataTable(rifCountTable)) {
            $(rifCountTable).DataTable().destroy();
          }
          rifCountTable.remove();
          rifCountTable = null; // Resetear la referencia
        }

        if (response.success && response.ticket && response.ticket.length > 0) {
          const TicketData = response.ticket;
          console.log(TicketData);

          // Crear la tabla si no existe (o después de haber sido removida)
          rifCountTable = document.createElement("table");
          rifCountTable.id = "rifCountTable";
          rifCountTable.className =
            "table table-striped table-bordered table-hover table-sm"; // Clases de Bootstrap
          mainTableCard.appendChild(rifCountTable); // Añadir la tabla al contenedor principal

          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
          rifCountTable.appendChild(thead);
          rifCountTable.appendChild(tbody);

          const columnTitles = {
            id_ticket: "ID Ticket",
            create_ticket: "Create Ticket",
            name_status_ticket: "Status Ticket",
            rif_empresa: "Rif Empresa",
            name_process_ticket: "Process Ticket",
            name_status_payment: "Estatus Pago",
            full_name_tecnico: "Tecnico",
            name_accion_ticket: "Accion Ticket",
            full_name_coordinador: "Coordinador",
            id_level_failure: "Level Failure",
            full_name_tecnicoassignado: "Tecnico Asignado",
            serial_pos: "Serial POS",
            name_failure: "Failure",
            downl_exoneration: "Exoneración",
            downl_payment: "Pago Anticipo",
            downl_send_to_rosal: "Enviado a Rosal",
            downl_send_fromrosal: "Enviado desde Rosal A destino",
            date_send_lab: "Fecha Envío Lab",
            date_send_torosal_fromlab: "Fecha Envío arosal",
            name_status_domiciliacion: "Estatus Domiciliación",
            date_sendkey: "Fecha Envío Key",
            date_receivekey: "Fecha Recibo Key",
            date_receivefrom_desti: "Fecha Recibo Destino",
          };

          const visibleColumns = new Set();
          const allColumns = Object.keys(TicketData[0] || {});

          allColumns.forEach((key) => {
            const hasData = TicketData.some(
              (item) =>
                item[key] !== null &&
                item[key] !== undefined &&
                item[key] !== ""
            );
            if (hasData) {
              visibleColumns.add(key);
            }
          });

          const columnsConfig = [];
          const headerRow = thead.insertRow();
          for (const key of visibleColumns) {
            const th = document.createElement("th");
            th.textContent = columnTitles[key] || key;
            headerRow.appendChild(th);
            const columnDef = {
              data: key,
              title: columnTitles[key] || key,
              defaultContent: "",
            };
            if (
              [
                "downl_exoneration",
                "downl_payment",
                "downl_send_to_rosal",
                "downl_send_fromrosal",
              ].includes(key)
            ) {
              columnDef.render = (data) => (data === "Sí" ? "Sí" : "No");
            }
            columnsConfig.push(columnDef);
          }

          // DataTables manejará la adición de filas, no es necesario hacer un loop para insertarlas manualmente
          // TicketData.forEach(item => {
          //     const row = tbody.insertRow();
          //     for (const key of visibleColumns) {
          //         const cell = row.insertCell();
          //         cell.textContent = item[key] !== null && item[key] !== undefined ? item[key] : '';
          //     }
          // });

          $(rifCountTable).DataTable({
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
          $(rifCountTable).resizableColumns();
          mainTableCard.style.display = "block"; // Asegúrate de que el contenedor de la tabla sea visible
        } else {
          // Si no hay datos o la respuesta es falsa, mostrar mensaje y ocultar/remover tabla
          if (rifCountTable) {
            // Si ya es una instancia de DataTables, destrúyela primero
            if ($.fn.DataTable.isDataTable(rifCountTable)) {
              $(rifCountTable).DataTable().destroy();
            }
            rifCountTable.remove();
            rifCountTable = null;
          }
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No hay datos disponibles.";
          mainTableCard.appendChild(noDataMessage);
          mainTableCard.style.display = "block"; // Mantener el contenedor visible para el mensaje
          console.warn(
            "No se encontraron datos o la respuesta no fue exitosa."
          );
        }
      } catch (error) {
        if (rifCountTable) {
          if ($.fn.DataTable.isDataTable(rifCountTable)) {
            $(rifCountTable).DataTable().destroy();
          }
          rifCountTable.remove();
          rifCountTable = null;
        }
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta.";
        mainTableCard.appendChild(errorMessage);
        mainTableCard.style.display = "block";
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      if (rifCountTable) {
        if ($.fn.DataTable.isDataTable(rifCountTable)) {
          $(rifCountTable).DataTable().destroy();
        }
        rifCountTable.remove();
        rifCountTable = null;
      }
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No se encontraron datos.";
      mainTableCard.appendChild(noDataMessage);
      mainTableCard.style.display = "block";
    } else {
      if (rifCountTable) {
        if ($.fn.DataTable.isDataTable(rifCountTable)) {
          $(rifCountTable).DataTable().destroy();
        }
        rifCountTable.remove();
        rifCountTable = null;
      }
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error de conexión.";
      mainTableCard.appendChild(errorMessage);
      mainTableCard.style.display = "block";
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    if (rifCountTable) {
      if ($.fn.DataTable.isDataTable(rifCountTable)) {
        $(rifCountTable).DataTable().destroy();
      }
      rifCountTable.remove();
      rifCountTable = null;
    }
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de red.";
    mainTableCard.appendChild(errorMessage);
    mainTableCard.style.display = "block";
    console.error("Error de red");
  };

  const serial = document.getElementById("serialInput").value;
  const datos = `action=SearchSerialData&serial=${encodeURIComponent(serial)}`;
  xhr.send(datos);
}

function SendRango() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchRangeDate`); // Asume esta ruta para tu backend
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Obtener el contenedor principal donde irá la tabla. Asumo que es el mismo .card
  const mainTableCard = document.querySelector(".card"); // O el ID específico de tu contenedor principal de tablas

  // Si mainTableCard no existe, no podemos continuar. Deberías asegurarte de que este elemento base siempre esté en tu HTML.
  if (!mainTableCard) {
    console.error(
      "Error: El contenedor principal de tablas (.card) no se encontró."
    );
    return;
  }

  let rifCountTable = document.getElementById("rifCountTable");

  xhr.onload = function () {
    // Limpiar cualquier mensaje de error o "no data" previo del contenedor principal
    mainTableCard.querySelectorAll("p").forEach((p) => p.remove());

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        // Siempre remover la tabla existente antes de crear una nueva, si existe
        if (rifCountTable) {
          // Si ya es una instancia de DataTables, destrúyela primero
          if ($.fn.DataTable.isDataTable(rifCountTable)) {
            $(rifCountTable).DataTable().destroy();
          }
          rifCountTable.remove();
          rifCountTable = null; // Resetear la referencia
        }

        if (response.success && response.ticket && response.ticket.length > 0) {
          const TicketData = response.ticket;
          console.log(TicketData);

          // Crear la tabla si no existe (o después de haber sido removida)
          rifCountTable = document.createElement("table");
          rifCountTable.id = "rifCountTable";
          rifCountTable.className =
            "table table-striped table-bordered table-hover table-sm"; // Clases de Bootstrap
          mainTableCard.appendChild(rifCountTable); // Añadir la tabla al contenedor principal

          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
          rifCountTable.appendChild(thead);
          rifCountTable.appendChild(tbody);

          const columnTitles = {
            id_ticket: "ID Ticket",
            create_ticket: "Create Ticket",
            name_status_ticket: "Status Ticket",
            rif_empresa: "Rif Empresa",
            name_process_ticket: "Process Ticket",
            name_status_payment: "Estatus Pago",
            full_name_tecnico: "Tecnico",
            name_accion_ticket: "Accion Ticket",
            full_name_coordinador: "Coordinador",
            id_level_failure: "Level Failure",
            full_name_tecnicoassignado: "Tecnico Asignado",
            serial_pos: "Serial POS",
            name_failure: "Failure",
            downl_exoneration: "Exoneración",
            downl_payment: "Pago Anticipo",
            downl_send_to_rosal: "Enviado a Rosal",
            downl_send_fromrosal: "Enviado desde Rosal A destino",
            date_send_lab: "Fecha Envío Lab",
            date_send_torosal_fromlab: "Fecha Envío arosal",
            name_status_domiciliacion: "Estatus Domiciliación",
            date_sendkey: "Fecha Envío Key",
            date_receivekey: "Fecha Recibo Key",
            date_receivefrom_desti: "Fecha Recibo Destino",
          };

          const visibleColumns = new Set();
          const allColumns = Object.keys(TicketData[0] || {});

          allColumns.forEach((key) => {
            const hasData = TicketData.some(
              (item) =>
                item[key] !== null &&
                item[key] !== undefined &&
                item[key] !== ""
            );
            if (hasData) {
              visibleColumns.add(key);
            }
          });

          const columnsConfig = [];
          const headerRow = thead.insertRow();
          for (const key of visibleColumns) {
            const th = document.createElement("th");
            th.textContent = columnTitles[key] || key;
            headerRow.appendChild(th);
            const columnDef = {
              data: key,
              title: columnTitles[key] || key,
              defaultContent: "",
            };
            if (
              [
                "downl_exoneration",
                "downl_payment",
                "downl_send_to_rosal",
                "downl_send_fromrosal",
              ].includes(key)
            ) {
              columnDef.render = (data) => (data === "Sí" ? "Sí" : "No");
            }
            columnsConfig.push(columnDef);
          }

          // DataTables manejará la adición de filas, no es necesario hacer un loop para insertarlas manualmente
          // TicketData.forEach(item => {
          //     const row = tbody.insertRow();
          //     for (const key of visibleColumns) {
          //         const cell = row.insertCell();
          //         cell.textContent = item[key] !== null && item[key] !== undefined ? item[key] : '';
          //     }
          // });

          $(rifCountTable).DataTable({
            scrollY: "200px",
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
          $(rifCountTable).resizableColumns();
          mainTableCard.style.display = "block"; // Asegúrate de que el contenedor de la tabla sea visible
        } else {
          // Si no hay datos o la respuesta es falsa, mostrar mensaje y ocultar/remover tabla
          if (rifCountTable) {
            // Si ya es una instancia de DataTables, destrúyela primero
            if ($.fn.DataTable.isDataTable(rifCountTable)) {
              $(rifCountTable).DataTable().destroy();
            }
            rifCountTable.remove();
            rifCountTable = null;
          }
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No hay datos disponibles.";
          mainTableCard.appendChild(noDataMessage);
          mainTableCard.style.display = "block"; // Mantener el contenedor visible para el mensaje
          console.warn(
            "No se encontraron datos o la respuesta no fue exitosa."
          );
        }
      } catch (error) {
        if (rifCountTable) {
          if ($.fn.DataTable.isDataTable(rifCountTable)) {
            $(rifCountTable).DataTable().destroy();
          }
          rifCountTable.remove();
          rifCountTable = null;
        }
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta.";
        mainTableCard.appendChild(errorMessage);
        mainTableCard.style.display = "block";
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      if (rifCountTable) {
        if ($.fn.DataTable.isDataTable(rifCountTable)) {
          $(rifCountTable).DataTable().destroy();
        }
        rifCountTable.remove();
        rifCountTable = null;
      }
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No se encontraron datos.";
      mainTableCard.appendChild(noDataMessage);
      mainTableCard.style.display = "block";
    } else {
      if (rifCountTable) {
        if ($.fn.DataTable.isDataTable(rifCountTable)) {
          $(rifCountTable).DataTable().destroy();
        }
        rifCountTable.remove();
        rifCountTable = null;
      }
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error de conexión.";
      mainTableCard.appendChild(errorMessage);
      mainTableCard.style.display = "block";
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    if (rifCountTable) {
      if ($.fn.DataTable.isDataTable(rifCountTable)) {
        $(rifCountTable).DataTable().destroy();
      }
      rifCountTable.remove();
      rifCountTable = null;
    }
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de red.";
    mainTableCard.appendChild(errorMessage);
    mainTableCard.style.display = "block";
    console.error("Error de red");
  };

  // Obtener los valores de los inputs de fecha
  const initialDate = document.getElementById("date-ini").value;
  const endDate = document.getElementById("date-end").value;
  // Preparar los datos a enviar al backend
  const datos = `action=SearchRangeDate&initial=${encodeURIComponent(
    initialDate
  )}&second=${encodeURIComponent(endDate)}`;
  console
  xhr.send(datos);
}
