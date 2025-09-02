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
    const searchRifDiv = document.getElementById("SearchRif");
    const rifTipoSelect = document.getElementById("rifTipo");
    const rifInput = document.getElementById("rifInput");
    const buscarRifBtn = document.getElementById("buscarRif");
    const serialInput = document.getElementById("serialInput");
    const buscarSerialBtn = document.getElementById("buscarSerial");
    const razonInput = document.getElementById("RazonInput");
    const buscarRazonBtn = document.getElementById("buscarRazon");
    const inputsDateDiv = document.getElementById("inputsDate");
    const dateIniInput = document.getElementById("date-ini");
    const dateEndInput = document.getElementById("date-end");
    const buscarRangoBtn = document.getElementById("buscarRango");
    const errorDateIni = document.getElementById("errorDateIni");
    const errorDateEnd = document.getElementById("errorDateEnd");
    const selectRegions = document.getElementById("SelectRgions");
    const buscarRegionsBtn = document.getElementById("buscarRegions");

    // NUEVAS REFERENCIAS para búsqueda por estatus
    const buscarPorEstatusBtn = document.getElementById("buscarPorStatusBtn");
    const buscarPorEstatus = document.getElementById("buscarStatus");
    const buscarPorEstatusSelect = document.getElementById("SelectStatus");
     
    const resultsCard = document.querySelector(".card");

    // Función para ocultar todos los campos de búsqueda y limpiar mensajes de error
    function hideAllSearchInputs() {
        // Ocultar todos los inputs y botones específicos de cada tipo de búsqueda
        rifTipoSelect.style.display = "none";
        rifInput.style.display = "none";
        buscarRifBtn.style.display = "none";
        serialInput.style.display = "none";
        buscarSerialBtn.style.display = "none";

        razonInput.style.display = "none";
        razonInput.value = "";
        dateIniInput.value = "";
        dateEndInput.value = "";
        selectRegions.value = "";
        rifInput.value = "";
        serialInput.value = "";
        buscarRazonBtn.style.display = "none";

        inputsDateDiv.style.display = "none";
        dateIniInput.style.display = "none";
        dateEndInput.style.display = "none";
        buscarRangoBtn.style.display = "none";
        errorDateIni.style.display = "none";
        errorDateEnd.style.display = "none";

        selectRegions.style.display = "none";
        buscarRegionsBtn.style.display = "none";

        // NUEVO: Ocultar elementos de búsqueda por estatus
        buscarPorEstatusSelect.style.display = "none";
        buscarPorEstatus.style.display = "none";

        // Limpiar el contenido del card de resultados
        if (resultsCard) {
            resultsCard.style.display = "none";
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
            const rifCountTable = resultsCard.querySelector("#rifCountTable");
            if (rifCountTable) {
                rifCountTable.style.display = "none";
            }
        }
    }

    // Event Listeners para los botones de "Buscar por..."
    if (buscarPorRegionsBtn) {
        buscarPorRegionsBtn.addEventListener("click", function () {
            const welcomeMessage = document.getElementById("welcomeMessage");
            if (welcomeMessage) {
                welcomeMessage.style.visibility = "visible";
                welcomeMessage.style.opacity = "1";
            }
            
            hideAllSearchInputs();
            selectRegions.style.display = "block";
            buscarRegionsBtn.style.display = "block";
            resultsCard.style.display = "block";
            resultsCard.style.marginTop = "0%";
        });
    }

    if (buscarPorRangoBtn) {
        buscarPorRangoBtn.addEventListener("click", function () {
            const welcomeMessage = document.getElementById("welcomeMessage");
            if (welcomeMessage) {
                welcomeMessage.style.visibility = "visible";
                welcomeMessage.style.opacity = "1";
            }
            
            hideAllSearchInputs();
            inputsDateDiv.style.display = "flex";
            dateIniInput.style.display = "block";
            dateEndInput.style.display = "block";
            buscarRangoBtn.style.display = "block";
            resultsCard.style.marginTop = "-3%";

            errorDateIni.style.display = "none"; 
            errorDateEnd.style.display = "none";
            resultsCard.style.display = "block";
        });
    }

    if (buscarPorRazonBtn) {
        buscarPorRazonBtn.addEventListener("click", function () {
            const welcomeMessage = document.getElementById("welcomeMessage");
            if (welcomeMessage) {
                welcomeMessage.style.visibility = "visible";
                welcomeMessage.style.opacity = "1";
            }
            
            hideAllSearchInputs();
            razonInput.style.display = "block";
            buscarRazonBtn.style.display = "block";
            resultsCard.style.display = "block";
            resultsCard.style.marginTop = "0%";
        });
    }

    if (buscarPorRifBtn) {
        buscarPorRifBtn.addEventListener("click", function () {
            const welcomeMessage = document.getElementById("welcomeMessage");
            if (welcomeMessage) {
                welcomeMessage.style.visibility = "visible";
                welcomeMessage.style.opacity = "1";
            }
            
            hideAllSearchInputs();
            rifTipoSelect.style.display = "block";
            rifInput.style.display = "block";
            buscarRifBtn.style.display = "block";
            resultsCard.style.display = "block";
            resultsCard.style.marginTop = "5%";

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
            const welcomeMessage = document.getElementById("welcomeMessage");
            if (welcomeMessage) {
                welcomeMessage.style.visibility = "visible";
                welcomeMessage.style.opacity = "1";
            }
            
            hideAllSearchInputs();
            serialInput.style.display = "block";
            buscarSerialBtn.style.display = "block";
            resultsCard.style.display = "block";
            resultsCard.style.marginTop = "0%";
        });
    }

    // NUEVO: Event Listener para búsqueda por estatus
    if (buscarPorEstatusBtn) {
        buscarPorEstatusBtn.addEventListener("click", function () {
            const welcomeMessage = document.getElementById("welcomeMessage");
            if (welcomeMessage) {
                welcomeMessage.style.visibility = "visible";
                welcomeMessage.style.opacity = "1";
            }
            
            hideAllSearchInputs();
            buscarPorEstatusSelect.style.display = "block";
            buscarPorEstatus.style.display = "block";
            resultsCard.style.display = "block";
            resultsCard.style.marginTop = "0%";
        });
    }

    // Inicializar ocultando todos los campos
    hideAllSearchInputs();
});

function getRegionUsuarios() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/getRegionTicket`);

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

function getEstatusTicket() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/getEstatusTicket`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("SelectStatus");

          select.innerHTML = "";

          select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
          if (
            Array.isArray(response.Estatus) &&
            response.Estatus.length > 0
          ) {
            response.Estatus.forEach((Estatu) => {
              const option = document.createElement("option");
              option.value = Estatu.id_status_ticket;
              option.textContent = Estatu.name_status_ticket;
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

document.addEventListener("DOMContentLoaded", getEstatusTicket);



function SendRegions() {
  // Get the welcome message element and show it at the start
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.style.visibility = "visible";
    welcomeMessage.style.opacity = "1";
  }

  const RegionSelectValue = document.getElementById("SelectRgions").value;
  const selectElement = document.getElementById("SelectRgions");
  const selectedOptionIndex = selectElement.selectedIndex;
  const regionName = selectElement.options[selectedOptionIndex].text;

  // Mover la validación al principio para detener la ejecución si no hay región
  if (!RegionSelectValue) {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "Por favor, Seleccione una región.",
      color: "black",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#003594",
    });
    // Show the welcome message if validation fails
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
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
          // Hide the welcome message when data is found successfully
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "hidden";
            welcomeMessage.style.opacity = "0";
          }
          
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
              buttons: [{
              extend: "excelHtml5",
              footer: true,
              text: "Excel",
            }, ],
            scrollY: '60vh', // Altura fija para el cuerpo de la tabla
            fixedHeader: true, // Fijar el encabezado
            autoWidth: false, // Deshabilitar autoWidth para mejor control
            data: TicketData,
            columns: columnsConfig,
            pagingType: "simple_numbers",
            lengthMenu: [5, 10, 20, 50], // Opciones del length menu
            pageLength: 5, // Página por defecto
            language: {
              lengthMenu: "Mostrar _MENU_ registros",
              emptyTable: "No hay datos disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
              infoEmpty: "No hay Registros disponibles",
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

             dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-spreadsheet-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v4h12V2a2 2 0 0 0-2-2m2 7h-4v2h4zm0 3h-4v2h4zm0 3h-4v2h4zm0 3h-4v3h2a2 2 0 0 0 2-2zm-5 3v-3H6v3zm-4 0v-3H2v1a2 2 0 0 0 2 2zm-3-4h3v-2H2zm0-3h3V7H2zm4 0V7h3v2zm0 1h3v2H6z"/>
                    </svg>Excel`,
                    title: `${regionName}`,
                    className: 'btn-excel-modern',
                    attr: {
                        id: 'btn-excel-modern-id',
                        title: 'Exportar a Excel'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para Excel
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo
                                    if (data.length > 100) {
                                        data = data.substring(0, 97) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    customize: function(xlsx) {
                        var sheet = xlsx.xl.worksheets['Consulta_por_región' + '.xml'];
                        
                        // Ajustar ancho de columnas
                        $('col', sheet).each(function(index) {
                            if (index === 1 || index === 7 || index === 8) {
                                $(this).attr('width', 50);
                            } else if (index === 0 || index === 2 || index === 3 || index === 4 || index === 5) {
                                $(this).attr('width', 20);
                            } else {
                                $(this).attr('width', 25);
                            }
                        });
                        
                        // Ajustar altura de filas
                        $('row', sheet).each(function(index) {
                            if (index === 0) {
                                $(this).attr('ht', 30);
                            } else {
                                let hasDateWithWarranty = false;
                                $('c', this).each(function() {
                                    let cellValue = $(this).text();
                                    if (cellValue && (cellValue.includes('Sin garantia') || cellValue.includes('Sin garantía'))) {
                                        hasDateWithWarranty = true;
                                    }
                                });
                                
                                if (hasDateWithWarranty) {
                                    $(this).attr('ht', 80);
                                } else {
                                    $(this).attr('ht', 60);
                                }
                            }
                        });
                    }
                },
                {
                    extend: 'pdfHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M9.5 12a.5.5 0 0 1-1 0V4a.5.5 0 0 1 1 0v8zm2.5.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v8z"/>
                    </svg>PDF`,
                    title: `${regionName}`,
                    className: 'btn-pdf-modern',
                    attr: {
                        id: 'btn-pdf-modern-id',
                        title: 'Exportar a PDF'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para PDF
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo para PDF
                                    if (data.length > 60) {
                                        data = data.substring(0, 57) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    // Configuración SIMPLIFICADA y ESTABLE para PDF
                    customize: function(doc) {
                        // Solo configuraciones básicas que no causan errores
                        doc.pageOrientation = 'landscape';
                        doc.pageSize = 'A4';
                        doc.pageMargins = [10, 20, 10, 20];
                        
                        // Estilos básicos
                        doc.styles.tableHeader = {
                            fillColor: '#2E86AB',
                            color: 'white',
                            fontSize: 6,
                            bold: true
                        };
                        
                        doc.defaultStyle = {
                            fontSize: 7,
                            lineHeight: 1.1
                        };
                        
                        // Título
                        doc.header = function(currentPage, pageCount) {
                            return {
                                text: `${regionName}`,
                                alignment: 'center',
                                fontSize: 14,
                                bold: true,
                                margin: [0, 10, 0, 0]
                            };
                        };
                        
                        // Pie de página
                        doc.footer = function(currentPage, pageCount) {
                            return {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                                alignment: 'center',
                                fontSize: 10,
                                margin: [0, 0, 0, 10]
                            };
                        };
                        
                        // NO configurar widths ni body - dejar que se ajuste automáticamente
                    }
                }
            ]
          });
          $(newTable).resizableColumns();

        } else {
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para la región seleccionada.";
          mainTableCard.appendChild(noDataMessage);
          // Show the welcome message if no data found
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "visible";
            welcomeMessage.style.opacity = "1";
          }
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta del servidor.";
        mainTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
        // Show the welcome message if there's an error
        if (welcomeMessage) {
          welcomeMessage.style.visibility = "visible";
          welcomeMessage.style.opacity = "1";
        }
      }
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "No hay datos en su búsqueda.";
      mainTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
      // Show the welcome message if there's a connection error
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }
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
    errorMessage.textContent = "Error de conexión de red. Verifique su conexión a internet.";
    mainTableCard.appendChild(errorMessage);
    console.error("Error de red");
    // Show the welcome message if there's a network error
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
  };

  const datos = `action=SearchRegionData&id_region=${encodeURIComponent(RegionSelectValue)}`;
  xhr.send(datos);
}

function SendRif() {
  // Get the welcome message element and show it at the start
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.style.visibility = "visible";
    welcomeMessage.style.opacity = "1";
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
    // Show the welcome message if validation fails
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
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
          // Hide the welcome message when data is found successfully
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "hidden";
            welcomeMessage.style.opacity = "0";
          }
          
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
              buttons: [{
              extend: "excelHtml5",
              footer: true,
              text: "Excel",
            }, ],
            lengthMenu: [5],
            autoWidth: false,
            scrollCollapse: true,
            scrollX: true,
            language: {
              lengthMenu: "Mostrar _MENU_ registros",
              emptyTable: "No hay datos disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
              infoEmpty: "No hay Registros disponibles",
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

            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-spreadsheet-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v4h12V2a2 2 0 0 0-2-2m2 7h-4v2h4zm0 3h-4v2h4zm0 3h-4v2h4zm0 3h-4v3h2a2 2 0 0 0 2-2zm-5 3v-3H6v3zm-4 0v-3H2v1a2 2 0 0 0 2 2zm-3-4h3v-2H2zm0-3h3V7H2zm4 0V7h3v2zm0 1h3v2H6z"/>
                    </svg>Excel`,
                    title: 'Busqueda por RIF',
                    className: 'btn-excel-modern',
                    attr: {
                        id: 'btn-excel-modern-id',
                        title: 'Exportar a Excel'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para Excel
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo
                                    if (data.length > 100) {
                                        data = data.substring(0, 97) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    customize: function(xlsx) {
                        var sheet = xlsx.xl.worksheets['sheet1.xml'];
                        
                        // Ajustar ancho de columnas
                        $('col', sheet).each(function(index) {
                            if (index === 1 || index === 7 || index === 8) {
                                $(this).attr('width', 50);
                            } else if (index === 0 || index === 2 || index === 3 || index === 4 || index === 5) {
                                $(this).attr('width', 20);
                            } else {
                                $(this).attr('width', 25);
                            }
                        });
                        
                        // Ajustar altura de filas
                        $('row', sheet).each(function(index) {
                            if (index === 0) {
                                $(this).attr('ht', 30);
                            } else {
                                let hasDateWithWarranty = false;
                                $('c', this).each(function() {
                                    let cellValue = $(this).text();
                                    if (cellValue && (cellValue.includes('Sin garantia') || cellValue.includes('Sin garantía'))) {
                                        hasDateWithWarranty = true;
                                    }
                                });
                                
                                if (hasDateWithWarranty) {
                                    $(this).attr('ht', 80);
                                } else {
                                    $(this).attr('ht', 60);
                                }
                            }
                        });
                    }
                },
                {
                    extend: 'pdfHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M9.5 12a.5.5 0 0 1-1 0V4a.5.5 0 0 1 1 0v8zm2.5.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v8z"/>
                    </svg>PDF`,
                    title: 'Busqueda por RIF',
                    className: 'btn-pdf-modern',
                    attr: {
                        id: 'btn-pdf-modern-id',
                        title: 'Exportar a PDF'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para PDF
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo para PDF
                                    if (data.length > 60) {
                                        data = data.substring(0, 57) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    // Configuración SIMPLIFICADA y ESTABLE para PDF
                    customize: function(doc) {
                        // Solo configuraciones básicas que no causan errores
                        doc.pageOrientation = 'landscape';
                        doc.pageSize = 'A4';
                        doc.pageMargins = [10, 20, 10, 20];
                        
                        // Estilos básicos
                        doc.styles.tableHeader = {
                            fillColor: '#2E86AB',
                            color: 'white',
                            fontSize: 6,
                            bold: true
                        };
                        
                        doc.defaultStyle = {
                            fontSize: 7,
                            lineHeight: 1.1
                        };
                        
                        // Título
                        doc.header = function(currentPage, pageCount) {
                            return {
                                text: 'Busqueda por RIF',
                                alignment: 'center',
                                fontSize: 14,
                                bold: true,
                                margin: [0, 10, 0, 0]
                            };
                        };
                        
                        // Pie de página
                        doc.footer = function(currentPage, pageCount) {
                            return {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                                alignment: 'center',
                                fontSize: 10,
                                margin: [0, 0, 0, 10]
                            };
                        };
                        
                        // NO configurar widths ni body - dejar que se ajuste automáticamente
                    }
                }
            ]
          });
          $(newTable).resizableColumns();

        } else {
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para el RIF ingresado.";
          razonCountTableCard.appendChild(noDataMessage);
          // Show the welcome message if no data found
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "visible";
            welcomeMessage.style.opacity = "1";
          }
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta del servidor.";
        razonCountTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
        // Show the welcome message if there's an error
        if (welcomeMessage) {
          welcomeMessage.style.visibility = "visible";
          welcomeMessage.style.opacity = "1";
        }
      }
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "No hay datos en su búsqueda.";
      razonCountTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
      // Show the welcome message if there's a connection error
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }
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
    errorMessage.textContent = "Error de conexión de red. Verifique su conexión a internet.";
    razonCountTableCard.appendChild(errorMessage);
    console.error("Error de red");
    // Show the welcome message if there's a network error
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
  };

  const datos = `action=SearchRifData&rif=${encodeURIComponent(rifCompleto)}`;
  xhr.send(datos);
}

function SendSerial() {
  // Get the welcome message element and show it at the start
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.style.visibility = "visible";
    welcomeMessage.style.opacity = "1";
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
    // Show the welcome message if validation fails
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
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
          // Hide the welcome message when data is found successfully
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "hidden";
            welcomeMessage.style.opacity = "0";
          }
          
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
            buttons: [{
              extend: "excelHtml5",
              footer: true,
              text: "Excel",
            }, ],
            pagingType: "simple_numbers",
            lengthMenu: [5],
            autoWidth: false,
            scrollCollapse: true,
            scrollX: true,
            language: {
              lengthMenu: "Mostrar _MENU_ registros",
              emptyTable: "No hay datos disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
              infoEmpty: "No hay Registros disponibles",
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

            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-spreadsheet-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v4h12V2a2 2 0 0 0-2-2m2 7h-4v2h4zm0 3h-4v2h4zm0 3h-4v2h4zm0 3h-4v3h2a2 2 0 0 0 2-2zm-5 3v-3H6v3zm-4 0v-3H2v1a2 2 0 0 0 2 2zm-3-4h3v-2H2zm0-3h3V7H2zm4 0V7h3v2zm0 1h3v2H6z"/>
                    </svg>Excel`,
                    title: 'Busqueda por Serial',
                    className: 'btn-excel-modern',
                    attr: {
                        id: 'btn-excel-modern-id',
                        title: 'Exportar a Excel'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para Excel
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo
                                    if (data.length > 100) {
                                        data = data.substring(0, 97) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    customize: function(xlsx) {
                        var sheet = xlsx.xl.worksheets['Busqueda_Por_Serial.xml'];
                        
                        // Ajustar ancho de columnas
                        $('col', sheet).each(function(index) {
                            if (index === 1 || index === 7 || index === 8) {
                                $(this).attr('width', 50);
                            } else if (index === 0 || index === 2 || index === 3 || index === 4 || index === 5) {
                                $(this).attr('width', 20);
                            } else {
                                $(this).attr('width', 25);
                            }
                        });
                        
                        // Ajustar altura de filas
                        $('row', sheet).each(function(index) {
                            if (index === 0) {
                                $(this).attr('ht', 30);
                            } else {
                                let hasDateWithWarranty = false;
                                $('c', this).each(function() {
                                    let cellValue = $(this).text();
                                    if (cellValue && (cellValue.includes('Sin garantia') || cellValue.includes('Sin garantía'))) {
                                        hasDateWithWarranty = true;
                                    }
                                });
                                
                                if (hasDateWithWarranty) {
                                    $(this).attr('ht', 80);
                                } else {
                                    $(this).attr('ht', 60);
                                }
                            }
                        });
                    }
                },
                {
                    extend: 'pdfHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M9.5 12a.5.5 0 0 1-1 0V4a.5.5 0 0 1 1 0v8zm2.5.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v8z"/>
                    </svg>PDF`,
                    title: 'Busqueda por Serial',
                    className: 'btn-pdf-modern',
                    attr: {
                        id: 'btn-pdf-modern-id',
                        title: 'Exportar a PDF'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para PDF
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo para PDF
                                    if (data.length > 60) {
                                        data = data.substring(0, 57) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    // Configuración SIMPLIFICADA y ESTABLE para PDF
                    customize: function(doc) {
                        // Solo configuraciones básicas que no causan errores
                        doc.pageOrientation = 'landscape';
                        doc.pageSize = 'A4';
                        doc.pageMargins = [10, 20, 10, 20];
                        
                        // Estilos básicos
                        doc.styles.tableHeader = {
                            fillColor: '#2E86AB',
                            color: 'white',
                            fontSize: 6,
                            bold: true
                        };
                        
                        doc.defaultStyle = {
                            fontSize: 7,
                            lineHeight: 1.1
                        };
                        
                        // Título
                        doc.header = function(currentPage, pageCount) {
                            return {
                                text: 'Busqueda por Serial',
                                alignment: 'center',
                                fontSize: 14,
                                bold: true,
                                margin: [0, 10, 0, 0]
                            };
                        };
                        
                        // Pie de página
                        doc.footer = function(currentPage, pageCount) {
                            return {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                                alignment: 'center',
                                fontSize: 10,
                                margin: [0, 0, 0, 10]
                            };
                        };
                        
                        // NO configurar widths ni body - dejar que se ajuste automáticamente
                    }
                }
            ]
          });
          $(newTable).resizableColumns();

        } else {
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para el serial ingresado.";
          razonCountTableCard.appendChild(noDataMessage);
          // Show the welcome message if no data found
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "visible";
            welcomeMessage.style.opacity = "1";
          }
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta del servidor.";
        razonCountTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
        // Show the welcome message if there's an error
        if (welcomeMessage) {
          welcomeMessage.style.visibility = "visible";
          welcomeMessage.style.opacity = "1";
        }
      }
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "No hay Datos en su búsqueda.";
      razonCountTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
      // Show the welcome message if there's a connection error
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }
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
    errorMessage.textContent = "Error de conexión de red. Verifique su conexión a internet.";
    razonCountTableCard.appendChild(errorMessage);
    console.error("Error de red");
    // Show the welcome message if there's a network error
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
  };

  const datos = `action=SearchSerialData&serial=${encodeURIComponent(serialInputValue)}`;
  xhr.send(datos);
}

function SendStatus() {
  // Get the welcome message element and show it at the start
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.style.visibility = "visible";
    welcomeMessage.style.opacity = "1";
  }

  const EstatusSelectValue = document.getElementById("SelectStatus").value;
  const selectElement = document.getElementById("SelectStatus");
  const selectedOptionIndex = selectElement.selectedIndex;
  const EstatusName = selectElement.options[selectedOptionIndex].text;




  // Mover la validación al principio para detener la ejecución si no hay serial
  if (!EstatusSelectValue) {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "Por favor, Seleccione un Estatus.",
      color: "black",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#003594",
    });
    // Show the welcome message if validation fails
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
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
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/SearchEstatusData`);
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
          // Hide the welcome message when data is found successfully
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "hidden";
            welcomeMessage.style.opacity = "0";
          }
          
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
            buttons: [{
              extend: "excelHtml5",
              footer: true,
              text: "Excel",
            }, ],
            pagingType: "simple_numbers",
            lengthMenu: [5],
            autoWidth: false,
            scrollCollapse: true,
            scrollX: true,
            language: {
              lengthMenu: "Mostrar _MENU_ registros",
              emptyTable: "No hay datos disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
              infoEmpty: "No hay Registros disponibles",
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

            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-spreadsheet-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v4h12V2a2 2 0 0 0-2-2m2 7h-4v2h4zm0 3h-4v2h4zm0 3h-4v2h4zm0 3h-4v3h2a2 2 0 0 0 2-2zm-5 3v-3H6v3zm-4 0v-3H2v1a2 2 0 0 0 2 2zm-3-4h3v-2H2zm0-3h3V7H2zm4 0V7h3v2zm0 1h3v2H6z"/>
                    </svg>Excel`,
                    title: `${EstatusName}`,
                    className: 'btn-excel-modern',
                    attr: {
                        id: 'btn-excel-modern-id',
                        title: 'Exportar a Excel'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para Excel
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo
                                    if (data.length > 100) {
                                        data = data.substring(0, 97) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    customize: function(xlsx) {
                        var sheet = xlsx.xl.worksheets['Busqueda_Por_Estatus.xml'];
                        
                        // Ajustar ancho de columnas
                        $('col', sheet).each(function(index) {
                            if (index === 1 || index === 7 || index === 8) {
                                $(this).attr('width', 50);
                            } else if (index === 0 || index === 2 || index === 3 || index === 4 || index === 5) {
                                $(this).attr('width', 20);
                            } else {
                                $(this).attr('width', 25);
                            }
                        });
                        
                        // Ajustar altura de filas
                        $('row', sheet).each(function(index) {
                            if (index === 0) {
                                $(this).attr('ht', 30);
                            } else {
                                let hasDateWithWarranty = false;
                                $('c', this).each(function() {
                                    let cellValue = $(this).text();
                                    if (cellValue && (cellValue.includes('Sin garantia') || cellValue.includes('Sin garantía'))) {
                                        hasDateWithWarranty = true;
                                    }
                                });
                                
                                if (hasDateWithWarranty) {
                                    $(this).attr('ht', 80);
                                } else {
                                    $(this).attr('ht', 60);
                                }
                            }
                        });
                    }
                },
                {
                    extend: 'pdfHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M9.5 12a.5.5 0 0 1-1 0V4a.5.5 0 0 1 1 0v8zm2.5.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v8z"/>
                    </svg>PDF`,
                    title: `${EstatusName}`,
                    className: 'btn-pdf-modern',
                    attr: {
                        id: 'btn-pdf-modern-id',
                        title: 'Exportar a PDF'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para PDF
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo para PDF
                                    if (data.length > 60) {
                                        data = data.substring(0, 57) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    // Configuración SIMPLIFICADA y ESTABLE para PDF
                    customize: function(doc) {
                        // Solo configuraciones básicas que no causan errores
                        doc.pageOrientation = 'landscape';
                        doc.pageSize = 'A4';
                        doc.pageMargins = [10, 20, 10, 20];
                        
                        // Estilos básicos
                        doc.styles.tableHeader = {
                            fillColor: '#2E86AB',
                            color: 'white',
                            fontSize: 6,
                            bold: true
                        };
                        
                        doc.defaultStyle = {
                            fontSize: 7,
                            lineHeight: 1.1
                        };
                        
                        // Título
                        doc.header = function(currentPage, pageCount) {
                            return {
                                text: `${EstatusName}`,
                                alignment: 'center',
                                fontSize: 14,
                                bold: true,
                                margin: [0, 10, 0, 0]
                            };
                        };
                        
                        // Pie de página
                        doc.footer = function(currentPage, pageCount) {
                            return {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                                alignment: 'center',
                                fontSize: 10,
                                margin: [0, 0, 0, 10]
                            };
                        };
                        
                        // NO configurar widths ni body - dejar que se ajuste automáticamente
                    }
                }
            ]
          });
          $(newTable).resizableColumns();

        } else {
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para el estatus seleccionado.";
          razonCountTableCard.appendChild(noDataMessage);
          // Show the welcome message if no data found
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "visible";
            welcomeMessage.style.opacity = "1";
          }
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta del servidor.";
        razonCountTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
        // Show the welcome message if there's an error
        if (welcomeMessage) {
          welcomeMessage.style.visibility = "visible";
          welcomeMessage.style.opacity = "1";
        }
      }
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "No hay Datos en su búsqueda.";
      razonCountTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
      // Show the welcome message if there's a connection error
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }
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
    errorMessage.textContent = "Error de conexión de red. Verifique su conexión a internet.";
    razonCountTableCard.appendChild(errorMessage);
    console.error("Error de red");
    // Show the welcome message if there's a network error
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
  };

  const datos = `action=SearchSerialData&estatus=${encodeURIComponent(EstatusSelectValue)}`;
  xhr.send(datos);
}

function SendRango() {
  // Get the welcome message element and show it at the start
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.style.visibility = "visible";
    welcomeMessage.style.opacity = "1";
  }

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
    // Show the welcome message if validation fails
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
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
          // Hide the welcome message when data is found successfully
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "hidden";
            welcomeMessage.style.opacity = "0";
          }
          
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
            buttons: [{
              extend: "excelHtml5",
              footer: true,
              text: "Excel",
            }, ],
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
              info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
              infoEmpty: "No hay Registros disponibles",
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

            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-spreadsheet-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v4h12V2a2 2 0 0 0-2-2m2 7h-4v2h4zm0 3h-4v2h4zm0 3h-4v2h4zm0 3h-4v3h2a2 2 0 0 0 2-2zm-5 3v-3H6v3zm-4 0v-3H2v1a2 2 0 0 0 2 2zm-3-4h3v-2H2zm0-3h3V7H2zm4 0V7h3v2zm0 1h3v2H6z"/>
                    </svg>Excel`,
                    title: 'Búsqueda por Rango De Fecha',
                    className: 'btn-excel-modern',
                    attr: {
                        id: 'btn-excel-modern-id',
                        title: 'Exportar a Excel'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para Excel
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo
                                    if (data.length > 100) {
                                        data = data.substring(0, 97) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    customize: function(xlsx) {
                        var sheet = xlsx.xl.worksheets['Consulta_Por_Rango_Fecha.xml'];
                        
                        // Ajustar ancho de columnas
                        $('col', sheet).each(function(index) {
                            if (index === 1 || index === 7 || index === 8) {
                                $(this).attr('width', 50);
                            } else if (index === 0 || index === 2 || index === 3 || index === 4 || index === 5) {
                                $(this).attr('width', 20);
                            } else {
                                $(this).attr('width', 25);
                            }
                        });
                        
                        // Ajustar altura de filas
                        $('row', sheet).each(function(index) {
                            if (index === 0) {
                                $(this).attr('ht', 30);
                            } else {
                                let hasDateWithWarranty = false;
                                $('c', this).each(function() {
                                    let cellValue = $(this).text();
                                    if (cellValue && (cellValue.includes('Sin garantia') || cellValue.includes('Sin garantía'))) {
                                        hasDateWithWarranty = true;
                                    }
                                });
                                
                                if (hasDateWithWarranty) {
                                    $(this).attr('ht', 80);
                                } else {
                                    $(this).attr('ht', 60);
                                }
                            }
                        });
                    }
                },
                {
                    extend: 'pdfHtml5',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf-fill me-2" viewBox="0 0 16 16">
                      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M9.5 12a.5.5 0 0 1-1 0V4a.5.5 0 0 1 1 0v8zm2.5.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v8z"/>
                    </svg>PDF`,
                    title: 'Búsqueda por Rango De Fecha',
                    className: 'btn-pdf-modern',
                    attr: {
                        id: 'btn-pdf-modern-id',
                        title: 'Exportar a PDF'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            header: function(data, columnIdx) {
                                if (typeof data === 'string') {
                                    return data.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
                                }
                                return data;
                            },
                            body: function(data, row, column, node) {
                                if (typeof data === 'string') {
                                    // Remover HTML
                                    data = data.replace(/<[^>]*>/g, '');
                                    data = data.replace(/\n/g, ' ').trim();
                                    data = data.replace(/\s+/g, ' ');
                                    
                                    // Separar fecha y garantía para PDF
                                    if (data.includes('Sin garantia') || data.includes('Sin garantía')) {
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia;
                                        }
                                    }
                                    
                                    // Truncar texto muy largo para PDF
                                    if (data.length > 60) {
                                        data = data.substring(0, 57) + '...';
                                    }
                                }
                                return data;
                            }
                        }
                    },
                    // Configuración SIMPLIFICADA y ESTABLE para PDF
                    customize: function(doc) {
                        // Solo configuraciones básicas que no causan errores
                        doc.pageOrientation = 'landscape';
                        doc.pageSize = 'A4';
                        doc.pageMargins = [10, 20, 10, 20];
                        
                        // Estilos básicos
                        doc.styles.tableHeader = {
                            fillColor: '#2E86AB',
                            color: 'white',
                            fontSize: 6,
                            bold: true
                        };
                        
                        doc.defaultStyle = {
                            fontSize: 5,
                            lineHeight: 1.1
                        };
                        
                        // Título
                        doc.header = function(currentPage, pageCount) {
                            return {
                                text: 'Consulta por Rango de Fecha',
                                alignment: 'center',
                                fontSize: 14,
                                bold: true,
                                margin: [0, 10, 0, 0]
                            };
                        };
                        
                        // Pie de página
                        doc.footer = function(currentPage, pageCount) {
                            return {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                                alignment: 'center',
                                fontSize: 10,
                                margin: [0, 0, 0, 10]
                            };
                        };
                        
                        // NO configurar widths ni body - dejar que se ajuste automáticamente
                    }
                }
            ]
          });
          $(rifCountTable).resizableColumns();

        } else {
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para el rango de fechas seleccionado.";
          razonCountTableCard.appendChild(noDataMessage);
          // Show the welcome message if no data found
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "visible";
            welcomeMessage.style.opacity = "1";
          }
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta del servidor.";
        razonCountTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
        // Show the welcome message if there's an error
        if (welcomeMessage) {
          welcomeMessage.style.visibility = "visible";
          welcomeMessage.style.opacity = "1";
        }
      }
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "No hay datos en su búsqueda.";
      razonCountTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
      // Show the welcome message if there's a connection error
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }
    }
  };

  xhr.onerror = function () {
    razonCountTableCard.querySelectorAll("p").forEach((p) => p.remove());
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de conexión de red. Verifique su conexión a internet.";
    razonCountTableCard.appendChild(errorMessage);
    console.error("Error de red");
    // Show the welcome message if there's a network error
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
  };

  const datos = `action=SearchRangeDate&initial=${encodeURIComponent(initialDate)}&second=${encodeURIComponent(endDate)}`;
  xhr.send(datos);
}
