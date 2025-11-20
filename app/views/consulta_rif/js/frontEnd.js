let globalSerial = "";
let globalRif = "";
let globalRazon = "";
let globalEstatusPos = ""; // O null, dependiendo de cómo quieras inicializarla
// Variable global para controlar que el alerta de garantía se muestre solo una vez
let garantiaAlertShown = false;

// Variables para la cola de correos
let emailQueue = []; // Cola para almacenar las solicitudes de correo
let isProcessing = false; // Indicador de si se está procesando una solicitud

// FUNCIÓN PARA RESTAURAR EL ESTADO DE LA COORDINACIÓN
function restoreCoordinacionState() {
  const select = document.getElementById("AsiganrCoordinador");
  if (!select) return;

  // Obtener el estado actual de coordinaciones desde el servidor
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/getCoordinacion`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          // LIMPIAR EL SELECT ANTES DE POBLARLO
          select.innerHTML = '';

          if (
            Array.isArray(response.coordinaciones) &&
            response.coordinaciones.length > 0
          ) {
            // SI SOLO HAY UNA COORDINACIÓN, LA SELECCIONAMOS AUTOMÁTICAMENTE
            if (response.coordinaciones.length === 1) {
              const coordinacion = response.coordinaciones[0];
              const option = document.createElement("option");
              option.value = coordinacion.id_department;
              option.textContent = coordinacion.name_department;
              option.selected = true; // MARCA COMO SELECCIONADA
              select.appendChild(option);
              
              // DESHABILITAR EL SELECT YA QUE SOLO HAY UNA OPCIÓN
              select.disabled = true;
            
              
              // Remover texto anterior si existe
              const existingInfo = select.parentNode.querySelector(".form-text");
              if (existingInfo) {
                existingInfo.remove();
              }
              
              select.parentNode.appendChild(infoText);
              
            } else {
              // CÓDIGO PARA CUANDO HAY MÚLTIPLES COORDINACIONES (FUTURO)
              // ============================================================
              // Este código se ejecutará cuando en el futuro agreguen más coordinaciones
              // y quieras mostrar un dropdown con múltiples opciones
              
              // Agregar opción por defecto
              const defaultOption = document.createElement("option");
              defaultOption.value = "";
              defaultOption.textContent = "Seleccione Coordinación";
              select.appendChild(defaultOption);
              
              // Agregar cada coordinación como opción
              response.coordinaciones.forEach((coordinacion) => {
                const option = document.createElement("option");
                option.value = coordinacion.id_department;
                option.textContent = coordinacion.name_department;
                select.appendChild(option);
              });
              
              // Habilitar el select para que el usuario pueda elegir
              select.disabled = false;
              
              // Remover el texto explicativo si existe
              const existingInfo = select.parentNode.querySelector(".form-text");
              if (existingInfo) {
                existingInfo.remove();
              }
            }
            
          } else {
            // SI NO HAY COORDINACIONES DISPONIBLES
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay Coordinaciones disponibles";
            select.appendChild(option);
            select.disabled = true;
          }
          
        } else {
          console.error("Error al restaurar coordinaciones:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON al restaurar coordinaciones:", error);
      }
    } else {
      console.error("Error al restaurar coordinaciones:", xhr.status, xhr.statusText);
    }
  };

  const datos = `action=getCoordinacion`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", function () {
  // Estilo para el span "No file chosen"
    restoreCoordinacionState();

  // Precargar logo para exportes PDF
  try {
    if (!window.PDF_LOGO_DATAURL) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          window.PDF_LOGO_DATAURL = canvas.toDataURL('image/png');
        } catch (innerErr) {
          console.error('Error generando DataURL del logo PDF:', innerErr);
        }
      };
      const basePath = typeof APP_PATH === 'string' ? APP_PATH : '/';
      const normalizedBase = basePath.endsWith('/') ? basePath : basePath + '/';
      img.src = normalizedBase + 'app/public/img/Nota_Entrega/INTELIGENSA.PNG';
    }
  } catch (logoErr) {
    console.warn('No fue posible precargar el logo para PDF:', logoErr);
  }

  const noFileChosenStyle =
    "color: gray; font-style: italic; margin-left: 5px;";

  // Función para acortar el nombre del archivo, preservando la extensión
  function shortenFileName(fileName, maxLength = 15) {
    // Puedes ajustar maxLength
    const lastDotIndex = fileName.lastIndexOf(".");
    let nameWithoutExtension;
    let extension = "";

    if (lastDotIndex > -1) {
      nameWithoutExtension = fileName.substring(0, lastDotIndex);
      extension = fileName.substring(lastDotIndex);
    } else {
      nameWithoutExtension = fileName;
    }

    if (nameWithoutExtension.length > maxLength) {
      return (
        nameWithoutExtension.substring(0, maxLength - 3) + "..." + extension
      );
    }

    return fileName;
  }


  // Para el botón de Envío
  const cargarBtnEnvio = document.getElementById("DownloadEnvi");
  const envioInputFile = document.getElementById("EnvioInput");
  // 2. Asignar la referencia al span globalmente
  fileChosenSpanEnvio = document.createElement("span");
  fileChosenSpanEnvio.style.cssText = noFileChosenStyle;

  const envioButtonContainer = cargarBtnEnvio.parentNode;
  if (envioButtonContainer) {
    envioButtonContainer.appendChild(fileChosenSpanEnvio);
  }

  if (envioInputFile) {
    envioInputFile.addEventListener("change", function () {
      if (this.files.length > 0) {
        fileChosenSpanEnvio.textContent = shortenFileName(this.files[0].name);
        fileChosenSpanEnvio.style.cssText =
          "margin-left: 16%; margin-top: -1%; font-size: 12px; display: block; position: absolute;";
      } else {
        fileChosenSpanEnvio.textContent = "";
        fileChosenSpanEnvio.style.cssText = noFileChosenStyle;
      }
    });
  }

  // Para el botón de Exoneración
  const cargarBtnExo = document.getElementById("DownloadExo");
  const exoInputFile = document.getElementById("ExoneracionInput");
  // 2. Asignar la referencia al span globalmente
  fileChosenSpanExo = document.createElement("span");
  fileChosenSpanExo.style.cssText = noFileChosenStyle;

  const exoButtonContainer = cargarBtnExo.parentNode;
  if (exoButtonContainer) {
    exoButtonContainer.appendChild(fileChosenSpanExo);
  }

  if (exoInputFile) {
    exoInputFile.addEventListener("change", function () {
      var file = this.files[0];
      if (
        file &&
        !["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(file.type)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Alerta!",
          text: "Por favor, selecciona un archivo PDF, JPG o JPEG.",
          color: "black",
        });
        this.value = "";
        fileChosenSpanExo.textContent = "";
        fileChosenSpanExo.style.cssText = noFileChosenStyle;
      } else if (file) {
        fileChosenSpanExo.textContent = shortenFileName(file.name);
        fileChosenSpanExo.style.cssText =
          "margin-left: 16%; margin-top: -1%; font-size: 12px; display: block; position: absolute;";
      } else {
        fileChosenSpanExo.textContent = "";
        fileChosenSpanExo.style.cssText = noFileChosenStyle;
      }
    });
  }

  // Para el botón de Anticipo
  const cargarBtnAntici = document.getElementById("DownloadAntici");
  const anticiInputFile = document.getElementById("AnticipoInput");
  // 2. Asignar la referencia al span globalmente
  fileChosenSpanAntici = document.createElement("span");
  fileChosenSpanAntici.style.cssText = noFileChosenStyle;

  const anticiButtonContainer = cargarBtnAntici.parentNode;
  if (anticiButtonContainer) {
    anticiButtonContainer.appendChild(fileChosenSpanAntici);
  }

  if (anticiInputFile) {
    anticiInputFile.addEventListener("change", function () {
      var file = this.files[0];
      if (
        file &&
        !["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(file.type)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Alerta!",
          text: "Por favor, selecciona un archivo PDF, JPG o JPEG.",
          color: "black",
        });
        this.value = "";
        fileChosenSpanAntici.textContent = "";
        fileChosenSpanAntici.style.cssText = noFileChosenStyle;
      } else if (file) {
        fileChosenSpanAntici.textContent = shortenFileName(file.name);
        fileChosenSpanAntici.style.cssText =
          "margin-left: 16%; margin-top: -1%; font-size: 12px; display: block; position: absolute;";
      } else {
        fileChosenSpanAntici.textContent = "";
        fileChosenSpanAntici.style.cssText = noFileChosenStyle;
      }
    });
  }

  // Ocultar los inputs de archivo iniciales
  const inputFiles = document.querySelectorAll('input[type="file"]');
  inputFiles.forEach((input) => {
    input.style.display = "none";
  });

  // Eliminar los spans "No file chosen" originales (si existen del HTML inicial)
  // Esto es para limpiar cualquier span que pudieras haber tenido antes de implementar la creación dinámica.
  const originalFileChosenSpans = document.querySelectorAll("span#file-chosen");
  originalFileChosenSpans.forEach((span) => {
    span.remove();
  });
});

function inicializeModal() {
  var modal = $("#miModal"); // Modal Nivel 2
  var modal1 = $("#miModal1"); // Modal Nivel 1
  var spanNivelFalla = $("#cerrar-icon"); // Cierre Modal de Nivel Falla
  var spanFalla1 = $("#cerrar-iconNivel1"); // Cierre Modal Nivel 1
  var spanFalla2 = $("#cerraModal2");
  var indiceActual = 0;
  var cerrarNivelFalla = $("#cerrar"); // Botón de cerrar el modal de nivel de falla
  var cerraModalFalla1 = $("#buttonCerrar"); // Botón de cerrar el modal de nivel 1
  var cerraModalFalla2 = $("#buttonCerrar2");

  var ModalSerial = $("#ModalSerial"); // Para miModal (Nivel 2)
  var CerrarModalSerial = $("#closeDetailsPanelBtn"); // Botón de cerrar el modal de serial

  // Elementos del DOM (asegúrate de que existan en tu HTML)
  const createTicketFalla1Btn = document.getElementById(
    "createTicketFalla1Btn"
  );
  const createTicketFalla2Btn = document.getElementById(
    "createTicketFalla2Btn"
  );

  const InputRifModal1 = document.getElementById("InputRif1"); // Para miModal1 (Nivel 1)
  const serialSelectModal1 = document.getElementById("serialSelect1"); // Para miModal1 (Nivel 1)

  const InputRifModal2 = document.getElementById("InputRif"); // Para miModal (Nivel 2)
  const serialSelectModal2 = document.getElementById("serialSelect"); // Para miModal (Nivel 2)
  const InputRazon2 = document.getElementById("InputRazon"); // Para miModal (Nivel 2)

  var crearTicketDropdownItems = $("#crearTicketDropdown + ul.dropdown-menu a"); // Seleccionamos los items del dropdown

  function mostrarContenido(indice) {
    $("#detalle1, #detalle2, #detalle3").hide();
    if (indice === 0) {
      $("#detalle1").show();
    } else if (indice === 1) {
      $("#detalle2").show();
    } else if (indice === 2) {
      $("#detalle3").show();
    }
  }

  CerrarModalSerial.off("click").on("click", function () {
    // Cierre Modal Serial (BOTON DE CERRAR)
    ModalSerial.css("display", "none");
    clearFormFields(); // Limpiar campos de ambos modales
  });

  cerrarNivelFalla.off("click").on("click", function () {
    // Cierre Modal Nivel de Falla (BOTON DE CERRAR)
    nivelFallaModal.css("display", "none");
    clearFormFields(); // Limpiar campos de ambos modales
  });

  spanNivelFalla.off("click").on("click", function () {
    // Cierre Modal NIVEL FALLA (ICON-CERRAR)
    nivelFallaModal.css("display", "none");
    clearFormFields(); // Limpiar campos de ambos modales
  });

  cerraModalFalla1.off("click").on("click", function () {
    // Cierre Modal Nivel 1 (BOTON DE CERRAR)
    modal1.css("display", "none");
    clearFormFields(); // Limpiar campos de ambos modales
  });

  spanFalla1.off("click").on("click", function () {
    // Cierre Modal Nivel 1  (ICON-CERRAR)
    modal1.css("display", "none");
    clearFormFields(); // Limpiar campos de ambos modales
  });

  cerraModalFalla2.off("click").on("click", function () {
    // Cierre Modal falla 2 (BOTON DE CERRAR)
    modal.css("display", "none");
    restaurarVisibilidadCompleta();
    clearFormFields(); // Limpiar campos de ambos modales

    garantiaAlertShown = false;
    isInitialLoad = true;
  });

  spanFalla2.off("click").on("click", function () {
    // Cierre Modal falla 2 (ICON-CERRAR)
    modal.css("display", "none");
    clearFormFields(); // Limpiar campos de ambos modales
  });

  function cerrarNivelFallaModal() {
    clearFormFields(); // Limpiar campos de ambos modales
  }

  function mostrarMiModal(nivel) {
    // Muestra Modal Nivel 2 y limpia campos al mostrar
    modal.css("display", "block");
    indiceActual = 0;
    mostrarContenido(indiceActual);
    clearFormFields(); // Limpiar campos de ambos modales
  }

  function mostrarMiModal1(nivel) {
    // Muestra Modal Nivel 1 y limpia campos al mostrar
    modal1.css("display", "block");
    clearFormFields(); // Limpiar campos de ambos modales
  }

  crearTicketDropdownItems.off("click").on("click", function (event) {
    event.preventDefault(); // Evitar que el enlace navegue
    var selectedValue = $(this).data("value");

    if (selectedValue === "Soporte POS") {
      nivelFallaModal.css("display", "block");
    } else if (selectedValue) {
      // Aquí puedes implementar la lógica para mostrar el modal correspondiente
      // basado en la selección del dropdown. Por ejemplo, podrías tener
      // un modal diferente para cada tipo de ticket.
      Swal.fire({
        icon: "success",
        title: "Ticket seleccionado",
        text: "Se ha seleccionado: " + selectedValue,
        color: "black",
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Seleccione un motivo para crear ticket",
        color: "black",
      });
    }
  });

  // Event Listener para el botón "Crear Ticket Falla 1"
  if (createTicketFalla1Btn) {
    // Verifica si el botón existe
    createTicketFalla1Btn.addEventListener("click", () => {
      if (globalSerial && globalRif) {
        // Asegura que tenemos los datos
        if (
          globalEstatusPos !== "Equipo Desafiliado" &&
          globalEstatusPos !== "Equipo Inactivo"
        ) {
          if (InputRifModal1) InputRifModal1.value = globalRif;
          if (serialSelectModal1) {
            serialSelectModal1.innerHTML = `<input value="${globalSerial}">${globalSerial} disable</input>`;
            // Puedes seleccionar la opción si lo deseas:
            serialSelectModal1.value = globalSerial;

            // Y luego, para deshabilitarlo:
            serialSelectModal1.disabled = true;
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "No se puede crear un ticket",
            text: " " + globalEstatusPos + ".",
            allowOutsideClick: false, // El usuario no puede cerrar el modal haciendo clic fuera
            // Configuración para el botón de confirmación
            showConfirmButton: true, // Mostrar el botón de confirmación
            confirmButtonText: "Okay", // Texto del botón
            confirmButtonColor: "#003594", // Color del botón (opcional, este es el azul predeterminado de SweetAlert)
            color: "black", // Color del texto (opcional, este es el negro predeterminado de SweetAlert)
          });
          const miModalInstance = new bootstrap.Modal(
            document.getElementById("miModal1")
          );
          miModalInstance.hide();
          preventDefault();
        }
        // Abre el modal miModal1
        const miModal1Instance = new bootstrap.Modal(
          document.getElementById("miModal1")
        );
        miModal1Instance.show();
      } else {
        alert(
          "Por favor, selecciona un POS y asegúrate de tener RIF y Serial para crear el ticket."
        );
      }
    });
  }

  // Event Listener para el botón "Crear Ticket Falla 2"
  if (createTicketFalla2Btn) {
    // Verifica si el botón existe
    createTicketFalla2Btn.addEventListener("click", () => {
      if (globalSerial && globalRif) {
        // Asegura que tenemos los datos
        if (
          globalEstatusPos !== "Equipo Desafiliado" &&
          globalEstatusPos !== "Equipo Inactivo"
        ) {
          if (InputRifModal2) 
            InputRifModal2.value = globalRif;
            InputRazon2.value = globalRazon;
          if (serialSelectModal2) {
            serialSelectModal2.innerHTML = `<input value="${globalSerial}">${globalSerial}</input>`;
            // Puedes seleccionar la opción si lo deseas:
            serialSelectModal2.value = globalSerial;
            getUltimateTicket(globalSerial);
            getInstalationDate(globalSerial);
          }
           // NUEVO: CARGAR COORDINACIONES ANTES DE MOSTRAR EL MODAL
          restoreCoordinacionState();
        } else {
          Swal.fire({
            icon: "warning",
            title: "No se puede crear un ticket",
            text: " " + globalEstatusPos + ".",
            allowOutsideClick: false, // El usuario no puede cerrar el modal haciendo clic fuera
            // Configuración para el botón de confirmación
            showConfirmButton: true, // Mostrar el botón de confirmación
            confirmButtonText: "Okay", // Texto del botón
            confirmButtonColor: "#003594", // Color del botón (opcional, este es el azul predeterminado de SweetAlert)
            color: "black", // Color del texto (opcional, este es el negro predeterminado de SweetAlert)
          });
          const miModalInstance = new bootstrap.Modal(
            document.getElementById("miModal")
          );
          miModalInstance.hide();
          preventDefault();
        }
        // Abre el modal miModal
        const miModalInstance = new bootstrap.Modal(
          document.getElementById("miModal")
        );
        miModalInstance.show();
      } else {
        alert(
          "Por favor, selecciona un POS y asegúrate de tener RIF y Serial para crear el ticket."
        );
      }
    });
  }
  $(window)
    .off("click")
    .on("click", function (event) {
      if (event.target == modal[0]) {
        // Clic fuera de Modal Nivel 2
        modal.css("display", "none");
      } else if (event.target == modal1[0]) {
        // Clic fuera de Modal Nivel 1
        modal1.css("display", "none");
        // Clic fuera del Selector de Nivel
        nivelFallaModal.css("display", "none");
      }
    });

  btnAnterior.off("click").on("click", function () {
    if (indiceActual > 0) {
      indiceActual--;
      mostrarContenido(indiceActual);
    }
  });

  btnSiguiente.off("click").on("click", function () {
    if (indiceActual < 2) {
      indiceActual++;
      mostrarContenido(indiceActual);
    }
  });
}

$(document).ready(function () {
  inicializeModal();
});

// Obtener los elementos del DOM una sola v
const inputEnvio1 = document.getElementById("DownloadEnvi");
const inputEnvio = document.getElementById("EnvioInput");
const inputExoneracion = document.getElementById("ExoneracionInput");
const inputExoneracion1 = document.getElementById("DownloadExo");
const inputAnticipo = document.getElementById("AnticipoInput");
const inputAnticipo1 = document.getElementById("DownloadAntici");

/* CAMPO 1 FALLA*/
$(document).ready(function () {
  $.mask.definitions["~"] = "[JVEG]"; // Permite J o V
  $("#InputRif").mask("~9?99999999");
});
/* END CAMPO 1 FALLA*/

/* CAMPO 2 FALLA*/
$(document).ready(function () {
  $.mask.definitions["~"] = "[JVEG]"; // Permite J o V
  $("#InputRif1").mask("~9?99999999");
});
/* END CAMPO 2 FALLA*/

function getPosSerials1(rif) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPosSerials1`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("serialSelect1");
          select.innerHTML = '<option value="">Seleccione un serial</option>'; // Limpiar y agregar la opción por defecto
          if (Array.isArray(response.serials) && response.serials.length > 0) {
            response.serials.forEach((item) => {
              // Cambiamos 'serial' a 'item' para representar cada objeto
              const option = document.createElement("option");
              option.value = item.serial; // Accedemos a la propiedad 'serial' del objeto
              option.textContent = item.serial; // Accedemos a la propiedad 'serial' del objeto
              select.appendChild(option);
            });
          } else {
            // Si no hay seriales, puedes mostrar un mensaje en el select o dejarlo vacío
          }
        } else {
          document.getElementById("rifMensaje").innerHTML +=
            "<br>Error al obtener los seriales.";
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de seriales.";
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      document.getElementById("rifMensaje").innerHTML +=
        "<br>Error de conexión con el servidor para seriales.";
    }
  };

  const datos = `action=GetPosSerials1&rif=${encodeURIComponent(rif)}`;
  xhr.send(datos);
}

/*function getFailure() {
  const xhr = new XMLHttpRequest();
    xhr.open('POST', 'app/views/Tecnico/consulta_rif/backEnd.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('FallaSelect1');
                    select.innerHTML = '<option value="">Seleccione la falla</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.failures) && response.failures.length > 0) {
                        response.failures.forEach(failure => { // Cambiar 'failures' a 'failure'
                            const option = document.createElement('option');
                            option.value = failure.id_failure;
                            option.textContent = failure.name_failure;
                            select.appendChild(option);
                        });
                    } else {
                        // Si no hay seriales, puedes mostrar un mensaje en el select o dejarlo vacío
                    }
                } else {
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener los seriales.';
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la respuesta de seriales.';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para seriales.';
        }
    };

    const datos = `action=GetFailure&rif=${encodeURIComponent()}`;
    xhr.send(datos);
}*/

function getFailure() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetFailure1`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("FallaSelect1");

          select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
          if (
            Array.isArray(response.failures) &&
            response.failures.length > 0
          ) {
            response.failures.forEach((failure) => {
              const option = document.createElement("option");
              option.value = failure.id_failure;
              option.textContent = failure.name_failure;
              select.appendChild(option);
            });
          } else {
            // Si no hay fallas, puedes mostrar un mensaje en el select
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay fallas disponibles";
            select.appendChild(option);
          }
        } else {
          document.getElementById("rifMensaje").innerHTML +=
            "<br>Error al obtener las fallas.";
          console.error("Error al obtener las fallas:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de las fallas.";
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      document.getElementById("rifMensaje").innerHTML +=
        "<br>Error de conexión con el servidor para las fallas.";
    }
  };

  const datos = `action=GetFailure1`; // Cambia la acción para que coincida con el backend
  xhr.send(datos);
}
// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener("DOMContentLoaded", getFailure);

function getFailure2() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetFailure2`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("FallaSelect2");
          select.innerHTML = '<option value="">Seleccione la falla</option>';
          if (
            Array.isArray(response.failures) &&
            response.failures.length > 0
          ) {
            response.failures.forEach((failure) => {
              const option = document.createElement("option");
              option.value = failure.id_failure;
              option.textContent = failure.name_failure;
              select.appendChild(option);
            });
          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay fallas disponibles";
            select.appendChild(option);
          }
        } else {
          document.getElementById("rifMensaje").innerHTML +=
            "<br>Error al obtener las fallas.";
          console.error("Error al obtener las fallas:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de las fallas.";
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      document.getElementById("rifMensaje").innerHTML +=
        "<br>Error de conexión con el servidor para las fallas.";
    }
  };

  const datos = `action=GetFailure2`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getFailure2);

function getCoordinador() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetCoordinador`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("AsiganrCoordinador");

          select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
          if (
            Array.isArray(response.coordinadores) &&
            response.coordinadores.length > 0
          ) {
            response.coordinadores.forEach((coordinador) => {
              const option = document.createElement("option");
              option.value = coordinador.id_user;
              option.textContent = coordinador.full_name;
              select.appendChild(option);
            });
          } else {
            // Si no hay fallas, puedes mostrar un mensaje en el select
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay Coordinador disponibles";
            select.appendChild(option);
          }
        } else {
          document.getElementById("rifMensaje").innerHTML +=
            "<br>Error al obtener los Coordinadores.";
          console.error("Error al obtener las fallas:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de los Coordinadores.";
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      document.getElementById("rifMensaje").innerHTML +=
        "<br>Error de conexión con el servidor para los Coordinadores.";
    }
  };

  const datos = `action=GetCoordinador`; // Cambia la acción para que coincida con el backend
  xhr.send(datos);
}

//document.addEventListener("DOMContentLoaded", getCoordinador);

function getCoordinacion() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/getCoordinacion`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("AsiganrCoordinador");

          // LIMPIAR EL SELECT ANTES DE POBLARLO
          select.innerHTML = '';

          if (
            Array.isArray(response.coordinaciones) &&
            response.coordinaciones.length > 0
          ) {
            // SI SOLO HAY UNA COORDINACIÓN, LA SELECCIONAMOS AUTOMÁTICAMENTE
            if (response.coordinaciones.length === 1) {
              const coordinacion = response.coordinaciones[0];
              const option = document.createElement("option");
              option.value = coordinacion.id_department;
              option.textContent = coordinacion.name_department;
              option.selected = true; // MARCA COMO SELECCIONADA
              select.appendChild(option);
              
              // DESHABILITAR EL SELECT YA QUE SOLO HAY UNA OPCIÓN
              select.disabled = true;
              
              // AGREGAR UN TEXTO EXPLICATIVO
              const infoText = document.createElement("small");
              infoText.className = "form-text text-muted";
              infoText.textContent = "Solo hay una coordinación disponible, se ha seleccionado automáticamente";
              select.parentNode.appendChild(infoText);
              
            } else {
              // CÓDIGO PARA CUANDO HAY MÚLTIPLES COORDINACIONES (FUTURO)
              // ============================================================
              // Este código se ejecutará cuando en el futuro agreguen más coordinaciones
              // y quieras mostrar un dropdown con múltiples opciones
              
              // Agregar opción por defecto
              const defaultOption = document.createElement("option");
              defaultOption.value = "";
              defaultOption.textContent = "Seleccione Coordinación";
              select.appendChild(defaultOption);
              
              // Agregar cada coordinación como opción
              response.coordinaciones.forEach((coordinacion) => {
                const option = document.createElement("option");
                option.value = coordinacion.id_department;
                option.textContent = coordinacion.name_department;
                select.appendChild(option);
              });
              
              // Habilitar el select para que el usuario pueda elegir
              select.disabled = false;
              
              // Remover el texto explicativo si existe
              const existingInfo = select.parentNode.querySelector(".form-text");
              if (existingInfo) {
                existingInfo.remove();
              }
            }
            
          } else {
            // SI NO HAY COORDINACIONES DISPONIBLES
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay Coordinaciones disponibles";
            select.appendChild(option);
            select.disabled = true;
          }
          
        } else {
          // MANEJO DE ERRORES
          document.getElementById("rifMensaje").innerHTML +=
            "<br>Error al obtener las Coordinaciones.";
          console.error("Error al obtener las coordinaciones:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de las Coordinaciones.";
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      document.getElementById("rifMensaje").innerHTML +=
        "<br>Error de conexión con el servidor para las Coordinaciones.";
    }
  };

  const datos = `action=getCoordinacion`;
  xhr.send(datos);
}

// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener("DOMContentLoaded", getCoordinacion);

let fechaUltimoTicketGlobal = null;
let fechaInstalacionGlobal = null;

function getPosSerials(rif) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPosSerials`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    const mensajeDiv = document.getElementById("rifMensaje");

    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const select = document.getElementById("serialSelect");
          select.innerHTML = '<option value="">Seleccione un serial</option>';

          if (Array.isArray(response.serials) && response.serials.length > 0) {
            response.serials.forEach((item) => {
              // Cambiamos 'serial' a 'item' para representar cada objeto
              const option = document.createElement("option");
              option.value = item.serial; // Accedemos a la propiedad 'serial' del objeto
              option.textContent = item.serial; // Accedemos a la propiedad 'serial' del objeto
              select.appendChild(option);
            });
            // Añadir el event listener solo una vez DESPUÉS de poblar el select
            select.onchange = function () {
              // Usar onchange para reemplazar el listener
              const selectedSerial = serialSelect.value;
              if (selectedSerial) {
                getUltimateTicket(selectedSerial);
                getInstalationDate(selectedSerial);
              }
            };
          }
        } else {
          mensajeDiv.innerHTML += "<br>" + response.message;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        mensajeDiv.innerHTML +=
          "<br>Error al procesar la respuesta de seriales.";
      }
    } else if (xhr.status === 404) {
      mensajeDiv.innerHTML +=
        "<br>No se encontraron seriales para el RIF proporcionado.";
    } else if (xhr.status === 400) {
      try {
        const response = JSON.parse(xhr.responseText);
        mensajeDiv.innerHTML += "<br>" + response.message;
      } catch (parseError) {
        mensajeDiv.innerHTML += "<br>Error en la solicitud de seriales.";
        console.error("Error parsing 400 response:", parseError);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      mensajeDiv.innerHTML +=
        "<br>Error de conexión con el servidor para seriales.";
    }
  };

  xhr.onerror = function () {
    document.getElementById("rifMensaje").innerHTML +=
      "<br>Error de red al intentar obtener los seriales.";
    console.error("Error de red");
  };

  const datos = `action=GetPosSerials&rif=${encodeURIComponent(rif)}`;
  xhr.send(datos);
}

function getUltimateTicket(serial) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetUltimateTicket`); // Asegúrate de usar la ruta correcta de tu API
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response && response.success) {
          if (response.fecha !== null) {
            fechaUltimoTicketGlobal = response.fecha;
            document.getElementById("ultimateTicketInput").value =
              response.fecha;
            validarGarantiaReingreso(response.fecha);
          } else if (response.message === "No tiene ticket") {
            fechaUltimoTicketGlobal = "No disponible";
            document.getElementById("ultimateTicketInput").value =
              "No disponible";
            validarGarantiaReingreso("No disponible");
          } else {
            fechaUltimoTicketGlobal = "No disponible";
            document.getElementById("ultimateTicketInput").value =
              "No disponible";
            validarGarantiaReingreso("No disponible");
            console.warn(
              "Respuesta exitosa sin fecha o mensaje esperado:",
              response
            );
          }
        } else {
          console.error("Error:", response.message);
          Swal.fire({
            title: "Error",
            text: "Error al obtener la fecha del último ticket.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        Swal.fire({
          title: "Error",
          text: "Error al procesar la respuesta del servidor.",
          icon: "error",
          confirmButtonText: "OK",
          color: "black",
        });
      }
    } else if (xhr.status === 400) {
      try {
        const response = JSON.parse(xhr.responseText);
        Swal.fire({
          title: "Advertencia",
          text: response.message, // Mostrar el mensaje "No tiene ticket"
          icon: "warning",
          confirmButtonText: "OK",
          color: "black",
        });
        document.getElementById("ultimateTicketInput").value = "No disponible";
        fechaUltimoTicketGlobal = "No disponible";
        validarGarantiaReingreso("No disponible");
      } catch (error) {
        console.error("Error parsing JSON for 400:", error);
        Swal.fire({
          title: "Error",
          text: "Error en la solicitud de la fecha del último ticket.",
          icon: "error",
          confirmButtonText: "OK",
          color: "black",
        });
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
      Swal.fire({
        title: "Error",
        text: "Error de conexión con el servidor.",
        icon: "error",
        confirmButtonText: "OK",
        color: "black",
      });
    }
  };
  const datos = `action=GetUltimateTicket&serial=${encodeURIComponent(serial)}`;
  xhr.send(datos);
}

function getInstalationDate(serial) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetInstallPosDate`); // Asegúrate de usar la ruta correcta de tu API
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response && response.success) {
          const fecha = response.fecha;
          document.getElementById("InputFechaInstall").value =
            fecha !== null ? fecha : "No disponible";
          fechaInstalacionGlobal = fecha;
          validarGarantiaInstalacion(fecha !== null ? fecha : "No disponible");
        } else {
          document.getElementById("InputFechaInstall").value = "No disponible";
          fechaInstalacionGlobal = null;
          validarGarantiaInstalacion("No disponible");
          console.error(
            "Error:",
            response
              ? response.message
              : "Respuesta de éxito falsa sin mensaje."
          );
        }
      } catch (error) {
        document.getElementById("InputFechaInstall").value = "No disponible";
        fechaInstalacionGlobal = null;
        validarGarantiaInstalacion("No disponible");
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 400) {
      try {
        const response = JSON.parse(xhr.responseText);
        document.getElementById("InputFechaInstall").value = "No disponible";
        fechaInstalacionGlobal = null;
        validarGarantiaInstalacion("No disponible");
        console.warn("Advertencia:", response.message);
        // Puedes mostrar un mensaje al usuario si lo deseas, por ejemplo, con Swal.fire()
      } catch (error) {
        document.getElementById("InputFechaInstall").value = "No disponible";
        fechaInstalacionGlobal = null;
        validarGarantiaInstalacion("No disponible");
        console.error("Error parsing JSON for 400:", error);
      }
    } else {
      document.getElementById("InputFechaInstall").value = "No disponible";
      fechaInstalacionGlobal = null;
      validarGarantiaInstalacion("No disponible");
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    document.getElementById("InputFechaInstall").value = "No disponible";
    fechaInstalacionGlobal = null;
    validarGarantiaInstalacion("No disponible");
    console.error("Error de red al intentar obtener la fecha de instalación.");
  };

  const datos = `action=GetInstallPosDate&serial=${encodeURIComponent(serial)}`;
  xhr.send(datos);
}

// Variable global para controlar que el alerta de garantía se muestre solo una vez
let isInitialLoad = true;

function validarGarantiaReingreso(fechaUltimoTicket) {
  const resultadoElemento = document.getElementById("resultadoGarantiaReingreso");
  const botonExoneracion = document.getElementById("DownloadExo");
  const botonAnticipo = document.getElementById("DownloadAntici");

  if (fechaUltimoTicket === "No disponible") {
    resultadoElemento.textContent = "Sin Garantía Por Reingreso";
    resultadoElemento.style.color = "";
    return null;
  } else {
    const fechaActual = new Date();
    const fechaTicket = new Date(fechaUltimoTicket);
    const diferencia = fechaActual.getTime() - fechaTicket.getTime();
    const meses = Math.ceil(diferencia / (1000 * 3600 * 24 * 30));

    if (meses <= 1) {
      resultadoElemento.textContent = "Garantía por Reingreso aplica";
      resultadoElemento.style.color = "red";

      const checkExoneracion = document.getElementById("checkExoneracionContainer");
      const checkAnticipo = document.getElementById("checkAnticipoContainer");
      const checkEnvio = document.getElementById("checkEnvioContainer");

      if (checkExoneracion) checkExoneracion.style.display = "none";
      if (checkAnticipo) checkAnticipo.style.display = "none";
      if (checkEnvio) checkEnvio.style.display = "block";
      
      return 3;
    } else {
      resultadoElemento.textContent = "Sin Garantía Por Reingreso";
      resultadoElemento.style.color = "";
      if (checkExoneracion) checkExoneracion.style.display = "block";
      if (checkAnticipo) checkAnticipo.style.display = "block";
      if (checkEnvio) checkEnvio.style.display = "block";
      return null;
    }
  }
}

function validarGarantiaInstalacion(fechaInstalacion) {
  const resultadoElemento = document.getElementById("resultadoGarantiaInstalacion");
  const botonExoneracion = document.getElementById("DownloadExo");
  const botonAnticipo = document.getElementById("DownloadAntici");

  if (fechaInstalacion === "No disponible") {
    resultadoElemento.textContent = "Sin Garantía de Instalación";
    resultadoElemento.style.color = "";
    return null;
  } else {
    const fechaActual = new Date();
    const fechaInstalacionDate = new Date(fechaInstalacion);
    const diferencia = fechaActual.getTime() - fechaInstalacionDate.getTime();
    const meses = Math.ceil(diferencia / (1000 * 3600 * 24 * 30));

    if (meses <= 6) {
      resultadoElemento.textContent = "Garantía por Instalación aplica";
      resultadoElemento.style.color = "red";
      
      if (botonExoneracion) botonExoneracion.style.display = "none";
      if (botonAnticipo) botonAnticipo.style.display = "none";
      
      const checkExoneracion = document.getElementById("checkExoneracion");
      const checkExoneracionLabel = document.getElementById("checkExoneracionLabel");
      const checkAnticipo = document.getElementById("checkAnticipo");
      const checkAnticipoLabel = document.getElementById("checkAnticipoLabel");
      
      if (checkExoneracion) checkExoneracion.style.display = "none";
      if (checkExoneracionLabel) checkExoneracionLabel.style.display = "none";
      if (checkAnticipo) checkAnticipo.style.display = "none";
      if (checkAnticipoLabel) checkAnticipoLabel.style.display = "none";
      
      return 1;
    } else {
      resultadoElemento.textContent = "Sin Garantía de Instalación";
      resultadoElemento.style.color = "";
      if (botonExoneracion) botonExoneracion.style.display = "inline-block";
      if (botonAnticipo) botonAnticipo.style.display = "inline-block";
      return null;
    }
  }
}

function UpdateGuarantees() {
  const idStatusPaymentReingreso = validarGarantiaReingreso(fechaUltimoTicketGlobal);
  const idStatusPaymentInstalacion = validarGarantiaInstalacion(fechaInstalacionGlobal);

  // Obtener elementos con validación de existencia
  const inputExoneracion = document.getElementById("ExoneracionInput");
  const inputAnticipo = document.getElementById("AnticipoInput");
  const inputEnvio = document.getElementById("EnvioInput");

  // Validar que los elementos existan antes de acceder a .files
  let archivoExoneracion = null;
  let archivoAnticipo = null;
  let archivoEnvio = null;

  if (inputExoneracion && inputExoneracion.files.length > 0) {
    archivoExoneracion = inputExoneracion.files[0];
  }
  if (inputAnticipo && inputAnticipo.files.length > 0) {
    archivoAnticipo = inputAnticipo.files[0];
  }
  if (inputEnvio && inputEnvio.files.length > 0) {
    archivoEnvio = inputEnvio.files[0];
  }
  
  const uploadNowRadio = document.getElementById("uploadNow");
  const uploadPendingRadio = document.getElementById("uploadPending");

  const checkEnvio = document.getElementById("checkEnvio");
  const checkExoneracion = document.getElementById("checkExoneracion");
  const checkAnticipo = document.getElementById("checkAnticipo");

  // NUEVO: Verificar si es Caracas, Miranda, Vargas o Distrito Capital (región 1)
  const checkEnvioContainer = document.getElementById("checkEnvioContainer");
  const isCaracasMiranda = checkEnvioContainer && checkEnvioContainer.style.display === "none";

  let idStatusPayment;

  // Primero, verifica las garantías principales
  if (idStatusPaymentReingreso === 3) {
    idStatusPayment = 3;
  } else if (idStatusPaymentInstalacion === 1) {
    idStatusPayment = 1;
  } else {
    // PRIMERO: Validar si es de estados que no necesitan envío
    if (isCaracasMiranda) {
      const tieneAnticipo = checkAnticipo && checkAnticipo.checked === true &&  archivoAnticipo && archivoAnticipo instanceof File;
      const tieneExoneracion = checkExoneracion && checkExoneracion.checked === true && archivoExoneracion &&  archivoExoneracion instanceof File;
              
      if (tieneExoneracion) {
        idStatusPayment = 5; // Exoneración pendiente por revisión
      } else if (tieneAnticipo) {
        idStatusPayment = 7; // Pago anticipo pendiente por revisión
      } else {
        idStatusPayment = 10; // Pendiente por cargar documento (exoneración o anticipo)
      }
    } else {
      // SEGUNDO: Para otras regiones que sí necesitan envío
      if (uploadPendingRadio && uploadPendingRadio.checked) {
        idStatusPayment = 9;
      } else if (uploadNowRadio && uploadNowRadio.checked) {
        const tieneExoneracion = checkExoneracion && checkExoneracion.checked && archivoExoneracion;
        const tieneAnticipo = checkAnticipo && checkAnticipo.checked && archivoAnticipo;
        const tieneEnvio = checkEnvio && checkEnvio.checked && archivoEnvio;

        if (tieneExoneracion && tieneEnvio) {
          idStatusPayment = 5; // Exoneración + Envío = Pendiente por revisión
        } else if (tieneAnticipo && tieneEnvio) {
          idStatusPayment = 7; // Anticipo + Envío = Pago anticipo pendiente por revisión
        } else if (tieneExoneracion && !tieneEnvio) {
          idStatusPayment = 11; // Solo exoneración = Pendiente por cargar envío
        } else if (tieneAnticipo && !tieneEnvio) {
          idStatusPayment = 11; // Solo anticipo = Pendiente por cargar envío
        } else if (tieneEnvio && !tieneExoneracion && !tieneAnticipo) {
          idStatusPayment = 10; // Solo envío = Pendiente por cargar documento
        } else {
          idStatusPayment = 10; // Pendiente por cargar documento
        }
      } else {
        idStatusPayment = 9;
      }
    }
  }

  // MOSTRAR ALERTA SOLO EN LA CARGA INICIAL O CUANDO SE CAMBIA DE SERIAL
  if (isInitialLoad && !garantiaAlertShown) {
    if (idStatusPayment === 3) {
      Swal.fire({
        title: "¡Notificación!",
        text: "Tiene Garantía Por Reingreso.",
        icon: "warning",
        confirmButtonText: "OK",
        color: "black",
      });
      garantiaAlertShown = true;
    } else if (idStatusPayment === 1) {
      Swal.fire({
        title: "¡Notificación!",
        text: "Tiene Garantía Por Instalacion.",
        icon: "warning",
        confirmButtonText: "OK",
        color: "black",
      });
      garantiaAlertShown = true;
    }
  }
  return idStatusPayment;
}

// Función para resetear el flag cuando sea necesario
function resetGarantiaAlert() {
  garantiaAlertShown = false;
  isInitialLoad = true;
}

// Resetear cuando se cambie de serial
$(document).ready(function() {
  $('#serialSelect').on('change', function() {
    garantiaAlertShown = false;
    isInitialLoad = true; // Permitir mostrar alerta en nuevo serial
  });
  
  // Resetear al cargar la página
  garantiaAlertShown = false;
  isInitialLoad = true;
  
  // Marcar que ya no es la carga inicial después de un breve delay
  setTimeout(() => {
    isInitialLoad = false;
  }, 1000);
});

// Función para marcar que ya no es la carga inicial
function markAsNotInitialLoad() {
  isInitialLoad = false;
}

// Función para mostrar alerta de garantía manualmente (opcional)
function showGarantiaAlert() {
  const idStatusPaymentReingreso = validarGarantiaReingreso(fechaUltimoTicketGlobal);
  const idStatusPaymentInstalacion = validarGarantiaInstalacion(fechaInstalacionGlobal);
  
  if (idStatusPaymentReingreso === 3) {
      Swal.fire({
        title: "¡Notificación!",
        text: "Tiene Garantía Por Reingreso.",
        icon: "warning",
        confirmButtonText: "OK",
        color: "black",
      });
  } else if (idStatusPaymentInstalacion === 1) {
      Swal.fire({
        title: "¡Notificación!",
        text: "Tiene Garantía Por Instalacion.",
        icon: "warning",
        confirmButtonText: "OK",
        color: "black",
      });
    }
}

// NUEVO: Función para forzar la verificación de garantía al cargar la página
function checkGarantiaOnLoad() {
  // Ejecutar UpdateGuarantees para mostrar el alerta inicial
  const idStatusPayment = UpdateGuarantees();
}

// NUEVO: Ejecutar la verificación cuando se carga la página
$(document).ready(function() {
  // Esperar un poco para que todos los elementos estén cargados
  setTimeout(() => {
    checkGarantiaOnLoad();
  }, 500);
});

function VerificarSucursales(rif) {
    const xhrSucursales = new XMLHttpRequest();
    xhrSucursales.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/VerifingBranches`);
    xhrSucursales.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhrSucursales.onload = function () {
        if (xhrSucursales.status === 200) {
            const responseSucursales = JSON.parse(xhrSucursales.responseText);
            try {
                if (responseSucursales.success) {
                    const idRegion = responseSucursales.id_region;
                    const idRegionNumero = parseInt(idRegion, 10);

                    // Referencia al div que contiene el botón de carga de PDF
                    const botonCargaPDFEnvDiv = document.getElementById("botonCargaPDFEnv");

                    const checkEnvioContainer = document.getElementById("checkEnvioContainer"); // Usando el ID sugerido
                    const checkExoneracionContainer = document.getElementById("checkExoneracionContainer");
                    const checkAnticipoContainer = document.getElementById("checkAnticipoContainer");

                    if (idRegionNumero === 1) { // Si es Caracas
                        if (botonCargaPDFEnvDiv) {
                            botonCargaPDFEnvDiv.style.display = "none";
                        }
                        if (checkEnvioContainer) {
                            checkEnvioContainer.style.display = "none";
                            checkExoneracionContainer.style.display = "block"; // Ocultar el checkbox de exoneración
                            checkAnticipoContainer.style.display = "block"; // Ocultar el checkbox de antic
                        }
                      }else{
                        checkAnticipoContainer.style.display = "block"; // Ocultar el checkbox de anticipo
                        checkExoneracionContainer.style.display = "block"; // Ocultar el checkbox de ex
                        checkEnvioContainer.style.display = "block"; // Mostrar el checkbox de envío
                      }
                } else {
                    console.error(
                        "Error al verificar las sucursales:",
                        responseSucursales ? responseSucursales.message : "Error desconocido"
                    );
                }
            } catch (error) {
                console.error("Error al procesar la respuesta del servidor:", error);
                console.log("Respuesta del servidor completa (para depurar):", xhrSucursales.responseText);
            }
        } else {
            console.error(
                "Error en la petición para verificar sucursales. Status:",
                xhrSucursales.status,
                xhrSucursales.responseText
            );
        }
    };

    xhrSucursales.onerror = function() {
        console.error("Error de red en la petición para verificar sucursales.");
        // Asegúrate de que los elementos se muestren si hay un error de re
    };

    const datosSucursales = `action=VerifingBranches&rif=${encodeURIComponent(rif)}`;
    xhrSucursales.send(datosSucursales);
}

let cargaSeleccionada = null; // Puede ser 'exoneracion', 'anticipo' o null

document.getElementById("DownloadExo").addEventListener("click", function (event) {
    event.stopPropagation(); // Detener la propagación del evento
    cargaSeleccionada = "exoneracion";
    
    // Validación de exoneración AL HACER CLIC en "Cargar Exoneracion"
    const inputExoneracion = document.getElementById("ExoneracionInput");
    const archivoExoneracion = inputExoneracion.files;
    const inputExoneracion1 = document.getElementById("DownloadExo"); // El botón

    if (archivoExoneracion.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Archivo muy grande",
        text: "El archivo de exoneración no debe superar los 5MB.",
        color: "black",
      });
      return;
    }
});

document.getElementById("DownloadAntici").addEventListener("click", function (event) {
  event.stopPropagation(); // Detener la propagación del evento
  cargaSeleccionada = "anticipo";
    
  // Validación de anticipo AL HACER CLIC en "Cargar PDF Anticipo"
  const inputAnticipo = document.getElementById("AnticipoInput");
  const archivoAnticipo = inputAnticipo.files[0];
  const inputAnticipo1 = document.getElementById("DownloadAntici"); // El botón

  // NUEVA VALIDACIÓN: Verificar tamaño del archivo de anticipo
  if (archivoAnticipo.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: "warning",
      title: "Archivo muy grande",
      text: "El archivo de anticipo no debe superar los 5MB.",
      color: "black",
    });
    return;
  }
});

// NUEVA VALIDACIÓN: Para el botón de envío (checkbox)
document.getElementById("DownloadEnvi").addEventListener("click", function (event) {
  event.stopPropagation(); // Detener la propagación del evento
  cargaSeleccionada = "envio";
    
  // Validación de envío AL HACER CLIC en "Cargar PDF Envío"
  const inputEnvio = document.getElementById("EnvioInput");
  const archivoEnvio = inputEnvio.files[0];
  const inputEnvio1 = document.getElementById("DownloadEnvi"); // El botón

  // NUEVA VALIDACIÓN: Verificar tamaño del archivo de envío
  if (archivoEnvio.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: "warning",
      title: "Archivo muy grande",
      text: "El archivo de envío no debe superar los 5MB.",
      color: "black",
    });
    return;
  }
});

document.getElementById("DownloadAntici").addEventListener("click", function (event) {
  // ELIMINAR ESTAS LÍNEAS - Ya no son necesarias con radio buttons
  // document.getElementById("DownloadExo").style.display = "none";
  // document.getElementById("ExoneracionInput").style.display = "none";
    
  event.stopPropagation(); // Detener la propagación del evento
  cargaSeleccionada = "anticipo";
    
  // Validación de anticipo AL HACER CLIC en "Cargar PDF Anticipo"
  const inputAnticipo = document.getElementById("AnticipoInput");
  const archivoAnticipo = inputAnticipo.files[0];
  const inputAnticipo1 = document.getElementById("DownloadAntici"); // El botón

  // Puedes agregar aquí validación de tamaño para el archivo de anticipo si es necesario
});

document.getElementById("DownloadAntici").addEventListener("click", function (event) {
    document.getElementById("DownloadExo").style.display = "none";
    document.getElementById("ExoneracionInput").style.display = "none";
    event.stopPropagation(); // Detener la propagación del evento
    cargaSeleccionada = "anticipo";
    // Aquí puedes agregar la lógica para mostrar el input de anticipo

    // Validación de anticipo AL HACER CLIC en "Cargar PDF Anticipo"
    const inputAnticipo = document.getElementById("AnticipoInput");
    const archivoAnticipo = inputAnticipo.files[0];
    const inputAnticipo1 = document.getElementById("DownloadAntici"); // El botón

    /*if (inputAnticipo1.style.display !== "none" && !archivoAnticipo) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: 'Por favor, seleccione el PDF de anticipo después de hacer click en "Cargar PDF Anticipo".',
        color: "black",
      });
      return; // Importante: Detener la ejecución si la validación falla
    }*/

    // Puedes agregar aquí validación de tamaño para el archivo de anticipo si es necesario

    // Si la validación pasa, puedes continuar con alguna otra lógica aquí si es necesario
    //console.log("Validación de anticipo pasada.");
});

function verificarTicketEnProceso(serial) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/CheckTicketEnProceso`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            resolve(response);
          } else {
            reject(response.message || "Error al verificar ticket en proceso");
          }
        } catch (error) {
          reject("Error al procesar la respuesta del servidor");
        }
      } else {
        reject(`Error del servidor: ${xhr.status}`);
      }
    };

    xhr.onerror = function () {
      reject("Error de conexión");
    };

    const datos = `action=CheckTicketEnProceso&serial=${encodeURIComponent(serial)}`;
    xhr.send(datos);
  });
}

function SendDataFailure2(idStatusPayment) {
  // AHORA: Obtener el valor (ID) y el texto de la falla
  const fallaSelect = document.getElementById("FallaSelect2");
  const descrpFailure_id = fallaSelect.value; // El valor (ID) de la falla
  const descrpFailure_text =
    fallaSelect.options[fallaSelect.selectedIndex].text; // El TEXTO visible de la falla

  const id_user = document.getElementById("id_user").value;
  const rif = document.getElementById("InputRif").value;
  const razonsocial = document.getElementById("InputRazon").value;
  const serial = document.getElementById("serialSelect").value;
  const selectElement = document.getElementById("AsiganrCoordinador");
  const coordinador = selectElement.value;

  // Finalmente, para obtener el texto de la opción seleccionada:
  // selectElement.options es una colección de todas las opciones.
  // selectElement.selectedIndex es el índice de la opción actualmente seleccionada.
  const coordinadorNombre =
    selectElement.options[selectElement.selectedIndex].text;

  const nivelFallaSelect = document.getElementById("FallaSelectt2");
  const nivelFallaValue = nivelFallaSelect.value; // El ID del nivel de falla
  const nivelFallaText =
    nivelFallaSelect.options[nivelFallaSelect.selectedIndex].text; // El texto del nivel de falla

  const uploadNowRadio = document.getElementById("uploadNow");

  // Obtener referencias a los inputs de archivo y sus botones asociados
  const inputEnvio = document.getElementById("EnvioInput");
  const inputExoneracion = document.getElementById("ExoneracionInput");
  const inputAnticipo = document.getElementById("AnticipoInput");

  const archivoEnvio = inputEnvio.files[0];
  const archivoExoneracion = inputExoneracion.files[0];
  const archivoAnticipo = inputAnticipo.files[0];
  
  // EJECUTAR VALIDACIONES ANTES DE CONTINUAR
  if (!validateTicketCreation()) {
    return; // Detener la ejecución si hay errores
  }
  
  const botonCargaPDFEnv = document.getElementById("botonCargaPDFEnv");
  const botonCargaExoneracion = document.getElementById("botonCargaExoneracion");
  const botonCargaAnticipo = document.getElementById("botonCargaAnticipo");

  // Validaciones generales de campos obligatorios
  if (
    !descrpFailure_id ||
    !rif ||
    !serial ||
    !coordinador ||
    !nivelFallaValue
  ) {
    Swal.fire({
      icon: "warning",
      title: "Campos requeridos",
      text: "Por favor, complete todos los campos obligatorios (Falla).",
      color: "black",
      confirmButtonText: "Ok",
      confirmButtonColor: "#003594",
    });
    return;
  }

  // VERIFICAR SI YA EXISTE UN TICKET EN PROCESO PARA ESTE SERIAL
  verificarTicketEnProceso(serial)
    .then((response) => {
      if (response.ticket_en_proceso) {
        const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;

        Swal.fire({
          html: `<div class="custom-modal-body-content">
            <div class="mb-4 text-center">
              ${customWarningSvg}
            </div> 
    
            <div class="alert alert-warning border-0 mb-3" role="alert">
              <div class="d-flex align-items-center">
                <i class="fas fa-ban text-danger me-2"></i>
                <strong><span style = "color: white;">No se puede crear un nuevo ticket</span></strong>
              </div>
            </div>
    
            <div class="info-section mb-3">
              <p class="text-muted mb-2">
                Ya existe un ticket en proceso para el serial:
              </p>
              <div class="serial-badge">
                <i class="fas fa-microchip me-2"></i>
                <strong>${serial}</strong>
              </div>
            </div>
    
        <div class="ticket-details-card">
          <div class="text-primary bg-gradient-primary">
            <h6 class="mb-0">
              <i class="fas fa-info-circle text-primary me-2"></i>
              Detalles del Ticket Existente
            </h6>
          </div>
          <div class="card-body p-0">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="detail-label">
                  <i class="fas fa-ticket-alt text-primary me-2"></i>
                  Nro. Ticket:
                </span>
                <span class="detail-value badge bg-primary">${response.numero_ticket}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="detail-label">
                  <i class="fas fa-circle text-success me-2"></i>
                  Estado:
                </span>
                <span class="detail-value badge bg-success">${response.estado_ticket}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="detail-label">
                  <i class="fas fa-calendar-alt text-info me-2"></i>
                  Fecha Creación:
                </span>
                <span class="detail-value badge bg-info">${response.fecha_creacion}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="detail-label">
                  <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                  Falla:
                </span>
                <span class="detail-value failure-text">${response.falla}</span>
              </li>
            </ul>
          </div>
        </div>
    
        <div class="alert alert-danger border-0 mt-3" role="alert">
          <div class="d-flex align-items-center">
            <i class="fas fa-clock text-danger me-2"></i>
            <strong><span style = "color: white;">Debe esperar a que este ticket se complete antes de crear uno nuevo.</strong></span>
          </div>
        </div>
      </div>`,
  
      // Estilos personalizados
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-html'
      },
      
      // Configuración del modal
      width: '600px',
      showConfirmButton: true,
      confirmButtonText: '<i class="fas fa-check me-2"></i>Entendido',
      confirmButtonColor: '#003594',
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
  
      // Animaciones
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
      }
    });
        return; // Detener la ejecución
      }
      continuarCreacionTicket();
    })
    .catch((error) => {
      console.error("Error al verificar ticket en proceso:", error);
      Swal.fire({
        icon: "error",
        title: "Error de Verificación",
        text: "No se pudo verificar si existe un ticket en proceso. Por favor, intente nuevamente.",
        color: "black",
      });
    });

  // Función que continúa con la creación del ticket
  function continuarCreacionTicket() {
    // Crear FormData
    const formData = new FormData();
    formData.append("falla_id", descrpFailure_id);
    formData.append("falla_text", descrpFailure_text);
    formData.append("serial", serial);
    formData.append("coordinador", coordinador);
    formData.append("nivelFalla", nivelFallaValue);
    formData.append("nivelFalla_text", nivelFallaText);
    formData.append("id_status_payment", idStatusPayment);
    formData.append("id_user", id_user);
    formData.append("rif", rif);
    formData.append("coordinadorNombre", coordinadorNombre);

    // NUEVO: Agregar información de documentos cargados
    const checkEnvio = document.getElementById("checkEnvio");
    const checkExoneracion = document.getElementById("checkExoneracion");
    const checkAnticipo = document.getElementById("checkAnticipo");

    if (uploadNowRadio.checked) {
      // Documentos que se están cargando ahora
      if (checkEnvio.checked && archivoEnvio) {
        formData.append("archivoEnvio", archivoEnvio);
        formData.append("documento_envio", "Sí"); // NUEVO: Marcar que se cargó envío
      }
      if (checkExoneracion.checked && archivoExoneracion) {
        formData.append("archivoExoneracion", archivoExoneracion);
        formData.append("documento_exoneracion", "Sí"); // NUEVO: Marcar que se cargó exoneración
      }
      if (checkAnticipo.checked && archivoAnticipo) {
        formData.append("archivoAnticipo", archivoAnticipo);
        formData.append("documento_anticipo", "Sí"); // NUEVO: Marcar que se cargó anticipo
      }
    }

    formData.append("action", "SaveDataFalla2");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SaveDataFalla2`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            // CORREO ELIMINADO: No se envía correo al crear el ticket
            console.log(`📧 Ticket creado: ${response.ticket_data.Nr_ticket}. Correo NO enviado (solo al cerrar ticket).`);

            // Mostrar el primer modal (Guardado exitoso)
            Swal.fire({
              icon: "success",
              title: "Guardado exitoso",
              text: response.message,
              color: "black",
              timer: 2500,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
              willClose: () => {
                const ticketData = response.ticket_data;
                const beautifulHtmlContent =
                 `<div style="text-align: left; padding: 15px;">
                    <h3 style="color: #0056b3; margin-bottom: 15px; text-align: center;">🔧 ¡Ticket Generado! 🔧</h3>
                    <p style="font-size: 1.1em; margin-bottom: 10px;">
                        <strong>🎫 Nro. de Ticket:</strong> <span style="font-weight: bold; color: #d9534f;">${ticketData.Nr_ticket}</span>
                    </p>
                   <p style="margin-bottom: 8px;">
                        <strong>📅 Fecha de Creación:</strong> ${ticketData.date_create_ticket}
                    </p>
                    <p style="margin-bottom: 8px;">
                        <strong>⚙️ Serial del Equipo:</strong> ${ticketData.serial}
                    </p>
                    <p style="margin-bottom: 8px;">
                        <strong>❌ Falla Reportada:</strong> ${ticketData.falla_text}
                    </p>
                    <p style="margin-bottom: 8px;">
                        <strong> 🔍  Nivel de Falla:</strong> ${ticketData.nivelFalla_text}
                    </p>
                    <p style="margin-bottom: 8px;">
                        <strong>🏢 RIF:</strong> ${ticketData.rif || "N/A"}
                    </p>
                    <p style="margin-bottom: 8px;">
                      <strong>🏢Razon Social:</strong> ${globalRazon || "N/A"}
                    </p>
                    <p style="margin-bottom: 8px;">
                        <strong>👤 Usuario Gestión:</strong> ${ticketData.user_gestion || "N/A"}
                    </p>
                    <p style="margin-bottom: 8px;">
                        <strong>🧑‍💻 Coordinación Asignada:</strong> ${ticketData.coordinador || "N/A"}
                    </p>
                    <p style="margin-bottom: 8px;">
                        <strong>📁 Estado de Documentos:</strong> <span style="color: darkblue; font-weight: bold;">${ticketData.status_payment || "N/A"}</span>
                    </p>
                    <strong>
                      <p style="font-size: 0.9em; color: black; margin-top: 20px; text-align: center;">
                        Ticket creado exitosamente.<br>
                        <h7><strong>El Estatus del Ticket es:</strong> <span style = "color: #28a745"; font-weight: bold;">${ticketData.status_text}</span></h7>
                      </p>
                    </strong>
                  </div>`;
        Swal.fire({
          icon: "success",
          title: "Detalles del Ticket",
          html: beautifulHtmlContent,
          color: "black",
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#003594",
          showConfirmButton: false,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: true,
          cancelButtonText: "Asociar Componentes",
          cancelButtonColor: "#28a745",
        }).then((result) => {
          if (result.isConfirmed) {
            $("#miModal").css("display", "none");
            setTimeout(() => {
            }, 1000);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
              $("#miModal").css("display", "none");
              
            const ticketId = ticketData.id_ticket_creado;
            console.log(`Ticket ID: ${ticketId}`);
            const serialPos = ticketData.serial;
            
            abrirModalComponentes({
              dataset: {
                idTicket: ticketId,
                serialPos: serialPos
              }
            });
          }
          });
                },
              });
         
       } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: response.message,
                color: "black",
              });
            }
          } catch (error) {
            console.error("Error parsing JSON (200 OK) for SaveDataFalla2:", error);
            console.log(xhr.responseText);
            Swal.fire({
              icon: "error",
              title: "Error en el servidor",
              text: "Ocurrió un error al procesar la respuesta del servidor.",
              color: "black",
            });
          }
        } else if (xhr.status === 400) {
          try {
            const response = JSON.parse(xhr.responseText);
            Swal.fire({
              icon: "warning",
              title: "Error de Solicitud",
              text: response.message,
              color: "black",
            });
          } catch (error) {
            console.error(
              "Error parsing JSON (400 Bad Request) for SaveDataFalla2:",
              error
            );
            Swal.fire({
              icon: "warning",
              title: "Error en la solicitud",
              text: "Se encontraron problemas con los datos enviados. Por favor, revise y reintente.",
              color: "black",
            });
          }
        } else if (xhr.status === 429) {
          try {
            const response = JSON.parse(xhr.responseText);
            Swal.fire({
              icon: "warning",
              title: "Demasiadas Solicitudes",
              text: response.message,
              color: "black",
              confirmButtonText: "Ok",
              confirmButtonColor: "#003594",
            });
          } catch (error) {
            console.error(
              "Error al parsear JSON (429 Too Many Requests) for SaveDataFalla2:",
              error
            );
            Swal.fire({
              icon: "warning",
              title: "Error de Validación de Tiempo",
              text: "Ha intentado crear un ticket demasiado pronto. Por favor, espere y reintente.",
              color: "black",
              confirmButtonText: "OK",
            });
          }
        } else if (xhr.status === 500) {
          try {
            const response = JSON.parse(xhr.responseText);
            Swal.fire({
              icon: "error",
              title: "Error del Servidor",
              text: response.message,
              color: "black",
            });
          } catch (error) {
            console.error(
              "Error parsing JSON (500 Internal Server Error) for SaveDataFalla2:",
              error
            );
            Swal.fire({
              icon: "error",
              title: "Error interno del servidor",
              text: "Ocurrió un error inesperado en el servidor al intentar guardar los datos. Por favor, contacte a soporte.",
              color: "black",
            });
          }
        } else {
          console.error(
            "Error inesperado en la respuesta del servidor (SaveDataFalla2). Código de estado:",
            xhr.status,
            "Respuesta:",
            xhr.responseText
          );
          Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: `Ocurrió un error al comunicarse con el servidor. Código de estado: ${xhr.status}.`,
            color: "black",
          });
        }
      };
      xhr.onerror = function () {
        console.error("Error de red al enviar la solicitud XHR (SaveDataFalla2).");
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet o intenta de nuevo más tarde.",
          color: "black",
        });
      };
      xhr.send(formData);
    }
}

// Función principal de validación para la creación de tickets
function validateTicketCreation() {
    // Obtener elementos del DOM
    const inputEnvio = document.getElementById('EnvioInput');
    const inputExoneracion = document.getElementById('ExoneracionInput');
    const inputAnticipo = document.getElementById('AnticipoInput');
    
    const checkEnvio = document.getElementById('checkEnvio');
    const checkExoneracion = document.getElementById('checkExoneracion');
    const checkAnticipo = document.getElementById('checkAnticipo');
    
    const uploadNowRadio = document.getElementById('uploadNow');
    
    // Si no se eligió "Cargar ahora", no hay validaciones de archivos
    if (!uploadNowRadio.checked) {
        return true;
    }
    
    // Verificar que al menos un checkbox esté marcado
    if (!checkEnvio.checked && !checkExoneracion.checked && !checkAnticipo.checked) {
        Swal.fire({
            title: "¡Notificación!",
            text: "Debe cargar los documentos pendientes.",
            icon: "warning",
            confirmButtonText: "OK",
            color: "black",
            confirmButtonColor: "#003594",
        });
        return false;
    }
    
    // Validaciones individuales de archivos
    const validacionEnvio = validateFileInput(inputEnvio, checkEnvio, 'Envío');
    if (!validacionEnvio.isValid) {
        Swal.fire({
            icon: "warning",
            title: "Campo requerido",
            text: validacionEnvio.message,
            color: "black",
            confirmButtonText: "OK",
            confirmButtonColor: "#003594",
        });
        return false;
    }
    
    const validacionExoneracion = validateFileInput(inputExoneracion, checkExoneracion, 'Exoneración');
    if (!validacionExoneracion.isValid) {
        Swal.fire({
            icon: "warning",
            title: "Campo requerido",
            text: validacionExoneracion.message,
            color: "black",
            confirmButtonText: "OK",
            confirmButtonColor: "#003594",
        });
        return false;
    }
    
    const validacionAnticipo = validateFileInput(inputAnticipo, checkAnticipo, 'Anticipo');
    if (!validacionAnticipo.isValid) {
        Swal.fire({
            icon: "warning",
            title: "Campo requerido",
            text: validacionAnticipo.message,
            color: "black",
            confirmButtonText: "OK",
            confirmButtonColor: "#003594",
        });
        return false;
    }
    
    // Validaciones adicionales de tipo y tamaño (opcional)
    if (checkEnvio.checked && inputEnvio.files[0]) {
        const validacionTipoEnvio = validateFileType(inputEnvio.files[0]);
        if (!validacionTipoEnvio.isValid) {
            Swal.fire({
                icon: "error",
                title: "Tipo de archivo no válido",
                text: validacionTipoEnvio.message,
                color: "black",
                confirmButtonText: "OK",
                confirmButtonColor: "#003594",
            });
            return false;
        }
        
        const validacionTamañoEnvio = validateFileSize(inputEnvio.files[0]);
        if (!validacionTamañoEnvio.isValid) {
            Swal.fire({
                icon: "error",
                title: "Archivo demasiado grande",
                text: validacionTamañoEnvio.message,
                color: "black",
                confirmButtonText: "OK",
                confirmButtonColor: "#003594",
            });
            return false;
        }
    }
    
    if (checkExoneracion.checked && inputExoneracion.files[0]) {
        const validacionTipoExo = validateFileType(inputExoneracion.files[0]);
        if (!validacionTipoExo.isValid) {
            Swal.fire({
                icon: "error",
                title: "Tipo de archivo no válido",
                text: validacionTipoExo.message,
                color: "black",
                confirmButtonText: "OK",
                confirmButtonColor: "#003594",
            });
            return false;
        }
    }
    
    if (checkAnticipo.checked && inputAnticipo.files[0]) {
        const validacionTipoAnt = validateFileType(inputAnticipo.files[0]);
        if (!validacionTipoAnt.isValid) {
            Swal.fire({
                icon: "error",
                title: "Tipo de archivo no válido",
                text: validacionTipoAnt.message,
                color: "black",
                confirmButtonText: "OK",
                confirmButtonColor: "#003594",
            });
            return false;
        }
    }
    
    // Si todas las validaciones pasan
    return true;
}

// Función para validar si un archivo está seleccionado
function validateFileInput(fileInput, checkbox, documentType) {
    if (checkbox.checked && (!fileInput.files || fileInput.files.length === 0)) {
        return {
            isValid: false,
            message: `Por favor, seleccione el Documento de ${documentType} después de marcar "Cargar De ${documentType}".`
        };
    }
    return { isValid: true };
}

// Función para validar el tipo de archivo
function validateFileType(file, allowedTypes = ['*/*']) {
    if (!file) return { isValid: true };
    
    // NUEVA LÓGICA: Aceptar cualquier tipo de archivo
    return { isValid: true };
}

// Función para validar el tamaño del archivo (ejemplo: máximo 10MB)
function validateFileSize(file, maxSizeMB = 10) {
    if (!file) return { isValid: true };
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            isValid: false,
            message: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB.`
        };
    }
    return { isValid: true };
}
// --- INICIALIZACIÓN Y MANEJO DE EVENTOS DEL DOM ---

document.addEventListener("DOMContentLoaded", function () {
  // --- Referencias a elementos del DOM ---
  const uploadNowRadio = document.getElementById("uploadNow");
  const uploadLaterRadio = document.getElementById("uploadLater");
  const documentUploadOptions = document.getElementById(
    "documentUploadOptions"
  );
  const checkEnvio = document.getElementById("checkEnvio");
  const checkExoneracion = document.getElementById("checkExoneracion");
  const checkAnticipo = document.getElementById("checkAnticipo");
  const botonCargaPDFEnv = document.getElementById("botonCargaPDFEnv");
  const botonCargaExoneracion = document.getElementById(
    "botonCargaExoneracion"
  );
  const botonCargaAnticipo = document.getElementById("botonCargaAnticipo");

  const envioInput = document.getElementById("EnvioInput");
  const exoneracionInput = document.getElementById("ExoneracionInput");
  const anticipoInput = document.getElementById("AnticipoInput");

  const downloadEnvioBtn = document.getElementById("DownloadEnvi");
  const downloadExoBtn = document.getElementById("DownloadExo");
  const downloadAnticiBtn = document.getElementById("DownloadAntici");

  const sendForm2Button = document.getElementById("SendForm2");

  // --- Funciones de Lógica de Visibilidad ---

  // Función para actualizar la visibilidad de las opciones de carga de documentos (checkboxes y sus botones)
  function updateDocumentUploadVisibility() {
    if (uploadNowRadio.checked) {
      documentUploadOptions.style.display = "block";
      // Llamar a esta función para actualizar la visibilidad de los botones individuales
      updateFileUploadButtonVisibility();
    } else {
      documentUploadOptions.style.display = "none";
      // Ocultar todos los botones de carga de archivos y limpiar checkboxes
      botonCargaPDFEnv.style.display = "none";
      botonCargaExoneracion.style.display = "none";
      botonCargaAnticipo.style.display = "none";
      checkEnvio.checked = false;
      checkExoneracion.checked = false;
      checkAnticipo.checked = false;
      // Limpiar los estados de archivo también
      document.getElementById("envioStatus").textContent = "";
      document.getElementById("exoneracionStatus").textContent = "";
      document.getElementById("anticipoStatus").textContent = "";
    }
    // Nota: Si necesitas que esta sección de carga de documentos se oculte si hay garantía activa,
    // tendrías que integrar esa lógica aquí o hacer que UpdateGuarantees() dispare un evento
    // o tenga un callback para afectar la visibilidad de documentUploadOptions.
    // Por ahora, solo se basa en los radio buttons.
  }

  // Función para actualizar la visibilidad de los botones individuales de carga de archivos
  // Función para actualizar la visibilidad de los botones individuales de carga de archivos
  // Función para actualizar la visibilidad de los botones individuales de carga de archivos
  function updateFileUploadButtonVisibility() {
    // Solo mostrar el botón si 'uploadNow' está marcado Y el checkbox/radio está marcado
    botonCargaPDFEnv.style.display =
      uploadNowRadio.checked && checkEnvio.checked ? "flex" : "none";
    botonCargaExoneracion.style.display =
      uploadNowRadio.checked && checkExoneracion.checked ? "flex" : "none";
    botonCargaAnticipo.style.display =
      uploadNowRadio.checked && checkAnticipo.checked ? "flex" : "none";
    
    // NUEVA FUNCIONALIDAD: Limpiar archivos cuando se deselecciona un checkbox/radio
    if (!checkEnvio.checked) {
        clearFileInput("EnvioInput");
        clearFileSpan(fileChosenSpanEnvio);
    }
    if (!checkExoneracion.checked) {
        clearFileInput("ExoneracionInput");
        clearFileSpan(fileChosenSpanExo);
    }
    if (!checkAnticipo.checked) {
        clearFileInput("AnticipoInput");
        clearFileSpan(fileChosenSpanAntici);
    }
}

// NUEVA FUNCIÓN: Limpiar input de archivo
function clearFileInput(inputId) {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
        fileInput.value = "";
    }
}

// NUEVA FUNCIÓN: Limpiar span que muestra el nombre del archivo
function clearFileSpan(fileSpan) {
    if (fileSpan) {
        fileSpan.textContent = "";
        fileSpan.style.cssText = "color: gray; font-style: italic; margin-left: 5px;";
    }
}

// Event listeners actualizados
checkEnvio.addEventListener("change", function() {
    updateFileUploadButtonVisibility();
    
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
        clearFileInput("EnvioInput");
        clearFileSpan(fileChosenSpanEnvio);
    }
});

checkExoneracion.addEventListener("change", function() {
    updateFileUploadButtonVisibility();
    
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
        clearFileInput("ExoneracionInput");
        clearFileSpan(fileChosenSpanExo);
    }
});

checkAnticipo.addEventListener("change", function() {
    updateFileUploadButtonVisibility();
    
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
        clearFileInput("AnticipoInput");
        clearFileSpan(fileChosenSpanAntici);
    }
});

  // --- Event Listeners ---

  // Event listeners para los radio buttons
  uploadNowRadio.addEventListener("change", updateDocumentUploadVisibility);
  uploadLaterRadio.addEventListener("change", updateDocumentUploadVisibility);

  checkEnvio.addEventListener("change", function() {
    updateFileUploadButtonVisibility();
      
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
      clearFileInput("EnvioInput");
      clearFileSpan(fileChosenSpanEnvio);
    }
  });

  checkExoneracion.addEventListener("change", function() {
    updateFileUploadButtonVisibility();
      
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
      clearFileInput("ExoneracionInput");
      clearFileSpan(fileChosenSpanExo);
    }
  });

  checkAnticipo.addEventListener("change", function() {
    updateFileUploadButtonVisibility();
      
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
      clearFileInput("AnticipoInput");
      clearFileSpan(fileChosenSpanAntici);
    }
  });

  // Handle button clicks to trigger file input click (simula un clic en el input de tipo file oculto)
  downloadEnvioBtn.addEventListener("click", () => envioInput.click());
  downloadExoBtn.addEventListener("click", () => exoneracionInput.click());
  downloadAnticiBtn.addEventListener("click", () => anticipoInput.click());

  // Event listener para el botón de envío principal del formulario
  sendForm2Button.addEventListener("click", function () {
    const idStatusPayment = UpdateGuarantees(); // Obtiene el estado de garantía/pago
    SendDataFailure2(idStatusPayment); // Envía los datos de la falla con ese estado
  });


  // --- Inicialización al Cargar la Página ---
  updateDocumentUploadVisibility(); // Establecer la visibilidad correcta de los elementos al cargar.

  // Puedes agregar aquí la lógica para cargar las opciones de tus selects
  // por ejemplo, si vienen de una API.
  // fetchFallas();
  // fetchSeriales();
  // fetchCoordinadores();

  // Ejemplo de cómo podrías establecer las fechas globales (reemplaza con tu lógica real)
  // Para probar, puedes usar fechas de hoy o pasadas:
  fechaUltimoTicketGlobal = ""; // O null si no hay último ticket
  fechaInstalacionGlobal = ""; // O null si no hay fecha de instalación

  // Actualiza los inputs de fecha (solo si existen y tienen valor)
  const ultimateTicketInput = document.getElementById("ultimateTicketInput");
  if (ultimateTicketInput && fechaUltimoTicketGlobal) {
    ultimateTicketInput.value = fechaUltimoTicketGlobal;
  }
  const inputFechaInstall = document.getElementById("InputFechaInstall");
  if (inputFechaInstall && fechaInstalacionGlobal) {
    inputFechaInstall.value = fechaInstalacionGlobal;
  }

  // Llama a UpdateGuarantees() al inicio para que las notificaciones de garantía
  // y la lógica de visibilidad de botones (si hay alguna dependencia inicial)
  // se apliquen al cargar el modal.
  UpdateGuarantees();

  // Si estás usando Bootstrap Modal, asegúrate de que el modal se inicialice correctamente.
  // Esto es común si lo abres con un botón que tiene data-bs-toggle="modal" y data-bs-target="#miModal".
  // Si lo abres programáticamente:
  // const myModal = new bootstrap.Modal(document.getElementById('miModal'));
  // myModal.show(); // Para mostrarlo
});

function SendDataFailure1() {
  // Obtener el valor del botón "Nivel 1"
  const nivelFallaSe = document.getElementById("FallaSelectt1");
  const nivelFalla = nivelFallaSe.value;
  const nivelFallaText = nivelFallaSe.options[nivelFallaSe.selectedIndex].text; // Captura el texto

  const serial = document.getElementById("serialSelect1").value; // Usar serialSelect
  const falla = document.getElementById("FallaSelect1").value;
  const id_user = document.getElementById("id_user").value;

  const fallaSelect = document.getElementById("FallaSelect1");
  const fallaValue = fallaSelect.value;
  const fallaText = fallaSelect.options[fallaSelect.selectedIndex].text; // Captura el texto
  console.log("SendDataFailure1: ", { nivelFalla, nivelFallaText, serial, falla, fallaText, id_user });
  // VERIFICAR SI YA EXISTE UN TICKET EN PROCESO PARA ESTE SERIAL
  verificarTicketEnProceso(serial)
    .then((response) => {
      if (response.ticket_en_proceso) {
        const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;

        Swal.fire({
          html: `<div class="custom-modal-body-content">
            <div class="mb-4 text-center">
              ${customWarningSvg}
            </div> 
    
            <div class="alert alert-warning border-0 mb-3" role="alert">
              <div class="d-flex align-items-center">
                <i class="fas fa-ban text-danger me-2"></i>
                <strong><span style = "color: white;">No se puede crear un nuevo ticket</span></strong>
              </div>
            </div>
    
            <div class="info-section mb-3">
              <p class="text-muted mb-2">
                Ya existe un ticket en proceso para el serial:
              </p>
              <div class="serial-badge">
                <i class="fas fa-microchip me-2"></i>
                <strong>${serial}</strong>
              </div>
            </div>
    
        <div class="ticket-details-card">
          <div class="text-primary bg-gradient-primary">
            <h6 class="mb-0">
              <i class="fas fa-info-circle text-primary me-2"></i>
              Detalles del Ticket Existente
            </h6>
          </div>
          <div class="card-body p-0">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="detail-label">
                  <i class="fas fa-ticket-alt text-primary me-2"></i>
                  Nro. Ticket:
                </span>
                <span class="detail-value badge bg-primary">${response.numero_ticket}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="detail-label">
                  <i class="fas fa-circle text-success me-2"></i>
                  Estado:
                </span>
                <span class="detail-value badge bg-success">${response.estado_ticket}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="detail-label">
                  <i class="fas fa-calendar-alt text-info me-2"></i>
                  Fecha Creación:
                </span>
                <span class="detail-value badge bg-info">${response.fecha_creacion}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="detail-label">
                  <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                  Falla:
                </span>
                <span class="detail-value failure-text">${response.falla}</span>
              </li>
            </ul>
          </div>
        </div>
    
        <div class="alert alert-danger border-0 mt-3" role="alert">
          <div class="d-flex align-items-center">
            <i class="fas fa-clock text-danger me-2"></i>
            <strong><span style = "color: white;">Debe esperar a que este ticket se complete antes de crear uno nuevo.</strong></span>
          </div>
        </div>
      </div>`,
  
      // Estilos personalizados
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-html'
      },
      
      // Configuración del modal
      width: '600px',
      showConfirmButton: true,
      confirmButtonText: '<i class="fas fa-check me-2"></i>Entendido',
      confirmButtonColor: '#003594',
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
  
      // Animaciones
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
      }
    });
        return; // Detener la ejecución
      }
      continuarCreacionTicket();
    })
    .catch((error) => {
      console.error("Error al verificar ticket en proceso:", error);
      Swal.fire({
        icon: "error",
        title: "Error de Verificación",
        text: "No se pudo verificar si existe un ticket en proceso. Por favor, intente nuevamente.",
        color: "black",
      });
    });

  // Función que continúa con la creación del ticket
  function continuarCreacionTicket() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SaveDataFalla`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // Asegúrate de que esto esté presente

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          // **MOVER LA LÓGICA DEL CORREO AQUÍ**
          const xhrEmail = new XMLHttpRequest();
          xhrEmail.open(
            "POST",
            `${ENDPOINT_BASE}${APP_PATH}api/email/send_ticket1`
          );
          xhrEmail.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );

          xhrEmail.onload = function () {
            if (xhrEmail.status === 200) {
              try {
              const responseEmail = JSON.parse(xhrEmail.responseText);
                console.log("📧 Respuesta del envío de correo (Nivel 1):", responseEmail);
                
                // Verificar si al menos un correo se envió exitosamente
                const message = responseEmail.message || '';
                const correoTecnicoEnviado = message.includes('Correo del técnico enviado');
                
                if (responseEmail.success || correoTecnicoEnviado) {
                  // Mostrar notificación toast de éxito DESPUÉS de enviar ambos correos
                  setTimeout(() => {
                    Swal.fire({
                      icon: "success",
                      title: "Correo Enviado",
                      text: `Correo de notificación (Nivel 1) enviado exitosamente para el ticket #${response.ticket_data.Nr_ticket} - Cliente: ${globalRazon} (${globalRif})`,
                      showConfirmButton: false,
                      confirmButtonText: "Cerrar",
                      confirmButtonColor: "#003594",
                      toast: true,
                      position: 'top-end',
                      color: 'black',
                      timer: 5000, // Se cierra automáticamente en 4 segundos
                      timerProgressBar: true
                    });
                  }, 500); // Delay de 3 segundos para que aparezca después del modal principal
            } else {
                  console.error("❌ Error al enviar correo (Nivel 1):", responseEmail.message);
                }
              } catch (error) {
                console.error("❌ Error al parsear respuesta del correo (Nivel 1):", error);
              }
            } else {
              console.error("❌ Error al solicitar el envío de correo (Nivel 1):", xhrEmail.status);
            }
          };

          xhrEmail.onerror = function () {
            console.error("Error de red al solicitar el envío de correo.");
          };
          const paramsEmail = `id_user=${encodeURIComponent(id_user)}`; // Asegúrate de enviar el ID del usuario para el correo
          xhrEmail.send(paramsEmail); // No necesitas enviar datos adicionales si tu backend ya tiene la información
          // **FIN DE LA LÓGICA DEL CORREO**
          Swal.fire({
            icon: "success",
            title: "Guardado exitoso",
            text: response.message,
            color: "black",
            timer: 2500,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
            willClose: () => {
              // Cuando el primer modal se cierra, mostramos el segundo modal "bonito"
              const ticketData = response.ticket_data; // Datos del ticket desde el backend
              // Construcción del contenido HTML para el modal de detalles
              // Usaremos un estilo más visual

             const beautifulHtmlContent = `
              <div style="text-align: left; padding: 15px;">
                  <h3 style="color: #0056b3; margin-bottom: 15px; text-align: center;">🔧 ¡Ticket Generado! 🔧</h3>
                  <p style="font-size: 1.1em; margin-bottom: 10px;">
                      <strong style="color: black;">🎫 Nro. de Ticket:</strong> <span style="font-weight: bold; color: #d9534f;">${
                          ticketData.Nr_ticket
                      }</span>
                  </p>
                  <p style="margin-bottom: 8px;">
                      <strong style="color: black;">📅 Fecha de Creación:</strong> <span>${
                          ticketData.date_create_ticket
                      }</span>
                  </p>
                  <p style="margin-bottom: 8px;">
                      <strong style="color: black;">👤 Usuario Gestión:</strong>  <span>${
                          ticketData.user_gestion || "N/A"
                      }</span>
                  </p>
                  <p style="margin-bottom: 8px;">
                      <strong style="color: black;">⚙️ Serial del Equipo:</strong>  <span>${
                          ticketData.serial
                      }</span>
                  </p>
                  <p style="margin-bottom: 8px;">
                      <strong style="color: black;">🚨 Falla Reportada:</strong>  <span>${
                          ticketData.falla_text
                      }</span>
                  </p>
                  <p style="margin-bottom: 8px;">
                      <strong style="color: black;">📊 Nivel de Falla:</strong>  <span>${
                          ticketData.nivelFalla_text
                      }</span>
                  </p>
                  <p style="margin-bottom: 8px;">
                      <strong style="color: black;">🏢 RIF Cliente:</strong>  <span>${
                          ticketData.rif || "N/A"
                      }</span>
                  </p>
                  <p style="margin-bottom: 8px;">
                      <strong style="color: black;">🏢Razon Social:</strong>  <span>${globalRazon || "N/A"}</span>
                  </p>
                  <strong>
                      <p style="font-size: 0.9em; color: black; margin-top: 20px; text-align: center;">
                          Se enviará una notificación por correo electrónico al agregar componentes.<br>
                          <h7 style="color: black;" font-weight: bold;>El Estatus del Ticket es: <span style="color: red;">${ticketData.status_text}</span></h7>
                      </p>
                  </strong>
              </div>`;
              Swal.fire({
                icon: "success", // Un icono de éxito también para este modal
                title: "Detalles del Ticket",
                html: beautifulHtmlContent, // Contenido HTML personalizado
                confirmButtonText: "Cerrar",
                confirmButtonColor: "#003594", // Botón de confirmación AZUL
                color: 'black',
                showClass: {
                  popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                  popup: "animate__animated animate__fadeOutUp",
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then(() => {
                // Este bloque de código se ejecuta DESPUÉS de que el usuario interactúa y el modal de SweetAlert2 se cierra.

                // Oculta tu modal personalizado (si lo tienes y estás usando jQuery)
                // Es crucial que esto se haga ANTES de la recarga.
                $("#miModal1").css("display", "none");
                $("#miModal").css("display", "none");
                // Establece un temporizador para recargar la página después de 2 segundos.
                setTimeout(() => {
                }, 1000); // 2000 milisegundos = 2 segundos
              }); // Este cierra el .then()
            },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al guardar",
            text: response.message,
            color: "black",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al procesar la respuesta",
          text: error.message,
          color: "black",
        });
      }
    } else if (xhr.status === 400) {
      // El backend devolvió un error de "Bad Request" (campos vacíos)
      try {
        const response = JSON.parse(xhr.responseText);
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: response.message, // Mostrar el mensaje "Hay un campo vacio." del backend
          color: "black",
          confirmButtonText: "Ok",
          confirmButtonColor: "#003594", // Botón de confirmación AZULs
        });
      } catch (error) {
        Swal.fire({
          icon: "warning",
          title: "Error en la solicitud",
          text: "Se encontraron problemas con los datos enviados.",
          color: "black",
        });
      }
    } else if (xhr.status === 429) {
      // Manejo específico para el código de estado 429 (Too Many Requests)
      try {
        const response = JSON.parse(xhr.responseText);
        Swal.fire({
          icon: "warning",
          title: "Demasiadas Solicitudes",
          text: response.message, // Muestra el mensaje específico del backend (ej. "Debes esperar X minutos...")
          color: "black",
          confirmButtonText: "Ok",
          confirmButtonColor: "#003594", // Botón de confirmación AZUL
        });
      } catch (error) {
        console.error("Error al parsear JSON (429 Too Many Requests):", error);
        Swal.fire({
          icon: "warning",
          title: "Error de Validación de Tiempo",
          text: "Ha intentado crear un ticket demasiado pronto. Por favor, espere y reintente.",
          color: "black",
          confirmButtonText: "OK",
        });
      }
    } else if (xhr.status === 500) {
      // El backend devolvió un error interno del servidor
      try {
        const response = JSON.parse(xhr.responseText);
        Swal.fire({
          icon: "error",
          title: "Error del servidor",
          text: response.message, // Mostrar el mensaje "Error al guardar los datos de falla." del backend
          color: "black",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error del servidor",
          text: "Ocurrió un error al intentar guardar los datos.",
          color: "black",
        });
      }
    } else {
      // Otros errores de conexión o estados HTTP no manejados
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: `Ocurrió un error al comunicarse con el servidor. Código de estado: ${xhr.status}`,
        color: "black",
      });
    }
  };

  xhr.onerror = function () {
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor.",
      color: "black",
    });
  };
  const rif = document.getElementById("InputRif1").value;
  const datos = `action=SaveDataFalla&serial=${encodeURIComponent(
    serial
  )}&falla=${encodeURIComponent(falla)}&nivelFalla=${encodeURIComponent(
    nivelFalla
  )}&id_user=${encodeURIComponent(id_user)}&rif=${encodeURIComponent(
    rif
  )}&falla_text=${encodeURIComponent(
    fallaText
  )}&nivelFalla_text=${encodeURIComponent(nivelFallaText)}`;
  xhr.send(datos);
  }
}

function clearFormFields() {
  // --- Limpiar checkboxes ---
  const checkEnvio = document.getElementById("checkEnvio");
  const checkExoneracion = document.getElementById("checkExoneracion");
  const checkAnticipo = document.getElementById("checkAnticipo");

  if (checkEnvio) checkEnvio.checked = false;
  if (checkExoneracion) checkExoneracion.checked = false;
  if (checkAnticipo) checkAnticipo.checked = false;

  // --- Limpiar los elementos DIV que muestran el nombre del archivo ---
  clearFileSpan(fileChosenSpanEnvio);
  clearFileSpan(fileChosenSpanExo);
  clearFileSpan(fileChosenSpanAntici);

  // --- Limpiar campos de Modal Nivel 2 (miModal) ---
  const fallaSelect2 = document.getElementById("FallaSelect2");
  if (fallaSelect2) {
    fallaSelect2.value = "";
  }

  const inputRif = document.getElementById("InputRif");
  if (inputRif) inputRif.value = "";

  const serialSelect = document.getElementById("serialSelect");
  if (serialSelect) serialSelect.value = "";

  // --- NUEVO: NO LIMPIAR LA COORDINACIÓN, SOLO RESTAURAR SU ESTADO ---
  // En lugar de limpiar, vamos a restaurar el estado de la coordinación
  restoreCoordinacionState();

  const fallaSelectt2 = document.getElementById("FallaSelectt2");
  if (fallaSelectt2) fallaSelectt2.value = "2";

  const rifMensaje1 = document.getElementById("rifMensaje1");
  if (rifMensaje1) rifMensaje1.innerHTML = "";

  const rifMensaje = document.getElementById("rifMensaje");
  if (rifMensaje) rifMensaje.innerHTML = "";

  const inputRazon = document.getElementById("InputRazon");
  if (inputRazon) inputRazon.value = "";

  // --- Limpiar campos de Modal Nivel 1 (miModal1) ---
  const fallaSelect1 = document.getElementById("FallaSelect1");
  if (fallaSelect1) fallaSelect1.value = "";

  const inputRif1 = document.getElementById("InputRif1");
  if (inputRif1) inputRif1.value = "";

  const serialSelect1 = document.getElementById("serialSelect1");
  if (serialSelect1) serialSelect1.value = "";

  const fallaSelectt1 = document.getElementById("FallaSelectt1");
  if (fallaSelectt1) fallaSelectt1.value = "1";

  // --- Restablecer radio buttons y checkboxes ---
  const uploadNowRadio = document.getElementById("uploadNow");
  const uploadLaterRadio = document.getElementById("uploadLater");

  if (uploadLaterRadio) uploadLaterRadio.checked = true;
  if (uploadNowRadio) uploadNowRadio.checked = false;

  // --- NUEVO: RESTAURAR COMPLETAMENTE LA VISIBILIDAD DE TODOS LOS ELEMENTOS ---
  restaurarVisibilidadCompleta();

  // --- Actualizar visibilidad de documentos ---
  if (typeof updateDocumentUploadVisibility === "function") {
    updateFileUploadButtonVisibility();
  } else {
    // Fallback
    const documentUploadOptions = document.getElementById("documentUploadOptions");
    if (documentUploadOptions) documentUploadOptions.style.display = "none";
    
    const botonCargaPDFEnv = document.getElementById("botonCargaPDFEnv");
    const botonCargaExoneracion = document.getElementById("botonCargaExoneracion");
    const botonCargaAnticipo = document.getElementById("botonCargaAnticipo");
    
    if (botonCargaPDFEnv) botonCargaPDFEnv.style.display = "none";
    if (botonCargaExoneracion) botonCargaExoneracion.style.display = "none";
    if (botonCargaAnticipo) botonCargaAnticipo.style.display = "none";
  }

  // --- Limpiar status divs ---
  const envioStatusDiv = document.getElementById("envioStatus");
  const exoneracionStatusDiv = document.getElementById("exoneracionStatus");
  const anticipoStatusDiv = document.getElementById("anticipoStatus");
  
  if (envioStatusDiv) envioStatusDiv.textContent = "";
  if (exoneracionStatusDiv) envioStatusDiv.textContent = "";
  if (anticipoStatusDiv) anticipoStatusDiv.textContent = "";
}

// NUEVA FUNCIÓN: Restaurar completamente la visibilidad de todos los elementos
function restaurarVisibilidadCompleta() {
  // Restaurar contenedores de checkboxes
  const checkExoneracionContainer = document.getElementById("checkExoneracionContainer");
  const checkAnticipoContainer = document.getElementById("checkAnticipoContainer");
  const checkEnvioContainer = document.getElementById("checkEnvioContainer");
  
  if (checkExoneracionContainer) {
    checkExoneracionContainer.style.display = "block";
    console.log("checkExoneracionContainer restaurado");
  }
  if (checkAnticipoContainer) {
    checkAnticipoContainer.style.display = "block";
    console.log("checkAnticipoContainer restaurado");
  }
  if (checkEnvioContainer) {
    checkEnvioContainer.style.display = "block";
    console.log("checkEnvioContainer restaurado");
  }

  // Restaurar botones de descarga
  const downloadExo = document.getElementById("DownloadExo");
  const downloadAntici = document.getElementById("DownloadAntici");
  
  if (downloadExo) {
    downloadExo.style.display = "inline-block";
    console.log("downloadExo restaurado");
  }
  if (downloadAntici) {
    downloadAntici.style.display = "inline-block";
    console.log("downloadAntici restaurado");
  }

  // Restaurar checkboxes individuales
  const checkExoneracion = document.getElementById("checkExoneracion");
  const checkExoneracionLabel = document.getElementById("checkExoneracionLabel");
  const checkAnticipo = document.getElementById("checkAnticipo");
  const checkAnticipoLabel = document.getElementById("checkAnticipoLabel");
  
  if (checkExoneracion) {
    checkExoneracion.style.display = "block";
    console.log("checkExoneracion restaurado");
  }
  if (checkExoneracionLabel) {
    checkExoneracionLabel.style.display = "block";
    console.log("checkExoneracionLabel restaurado");
  }
  if (checkAnticipo) {
    checkAnticipo.style.display = "block";
    console.log("checkAnticipo restaurado");
  }
  if (checkAnticipoLabel) {
    checkAnticipoLabel.style.display = "block";
    console.log("checkAnticipoLabel restaurado");
  }

  // Restaurar elementos de garantía
  const resultadoGarantiaReingreso = document.getElementById("resultadoGarantiaReingreso");
  const resultadoGarantiaInstalacion = document.getElementById("resultadoGarantiaInstalacion");
  
  if (resultadoGarantiaReingreso) {
    resultadoGarantiaReingreso.textContent = "Sin Garantía Por Reingreso";
    resultadoGarantiaReingreso.style.color = "";
    console.log("resultadoGarantiaReingreso restaurado");
  }
  
  if (resultadoGarantiaInstalacion) {
    resultadoGarantiaInstalacion.textContent = "Sin Garantía de Instalación";
    resultadoGarantiaInstalacion.style.color = "";
    console.log("resultadoGarantiaInstalacion restaurado");
  }

  // Restaurar opciones de carga de documentos
  const documentUploadOptions = document.getElementById("documentUploadOptions");
  if (documentUploadOptions) {
    documentUploadOptions.style.display = "none"; // Por defecto oculto hasta que se seleccione "Sí"
    console.log("documentUploadOptions restaurado");
  }

  // Restaurar botones de carga
  const botonCargaPDFEnv = document.getElementById("botonCargaPDFEnv");
  const botonCargaExoneracion = document.getElementById("botonCargaExoneracion");
  const botonCargaAnticipo = document.getElementById("botonCargaAnticipo");
  
  if (botonCargaPDFEnv) {
    botonCargaPDFEnv.style.display = "none";
    console.log("botonCargaPDFEnv restaurado");
  }
  if (botonCargaExoneracion) {
    botonCargaExoneracion.style.display = "none";
    console.log("botonCargaExoneracion restaurado");
  }
  if (botonCargaAnticipo) {
    botonCargaAnticipo.style.display = "none";
    console.log("botonCargaAnticipo restaurado");
  }

  console.log("Visibilidad completa restaurada");
}

function clearFileSpan(spanElement) {
  if (spanElement) spanElement.textContent = "";
}

/* CAMPO RIF*/
  $(document).ready(function () {
    $("#rifInput").mask("9?99999999"); // Máscara solo para la parte numérica
  });
/* END CAMPO RIF*/

function obtenerRifCompleto() {
  const tipoRif = $("#rifTipo").val();
  const numeroRif = $("#rifInput").val();
  return tipoRif + numeroRif;
}

// Ejemplo de cómo podrías usar la función para obtener el RIF completo al hacer clic en "Buscar"
$(".btn-primary").on("click", function () {
  const rifCompleto = obtenerRifCompleto();
  // Aquí puedes realizar la búsqueda con el 'rifCompleto'
});

// Get the input field
var input1 = document.getElementById("rifInput");
var input2 = document.getElementById("serialInput");
var input3 = document.getElementById("RazonInput");

// Execute a function when the user presses a key on the keyboard
input1.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("buscarRif").click();
  }
});

input2.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("buscarSerial").click();
  }
});

input3.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("buscarRazon").click();
  }
});

$("#rifInput").keyup(function () {
  let string = $("#rifInput").val();
  $("#rifInput").val(string.replace(/ /g, ""));
});

function SendRif() {
  // Get the welcome message element
  const welcomeMessage = document.getElementById("welcomeMessage");
  // Hide the welcome message at the start of the function
  if (welcomeMessage) {
    welcomeMessage.style.visibility = "visible";
    welcomeMessage.style.opacity = "1";
  }

  const tipoRif = document.getElementById("rifTipo").value;
  const numeroRif = document.getElementById("rifInput").value.trim();
  const rifCompleto = tipoRif + numeroRif;

  // **Verificación para campos vacíos**
  if (!numeroRif) {
    Swal.fire({
      title: "Atención",
      text: "Debes ingresar un número de RIF.",
      icon: "warning",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      keydownListenerCapture: true,
      color: "black",
      confirmButtonColor: "#003594",
    });
    // Show the welcome message if validation fails
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
    return; // Detiene la ejecución de la función
  }

  if (welcomeMessage) {
    welcomeMessage.style.visibility = "visible";
    welcomeMessage.style.opacity = "1";
  }


  // Si el campo no está vacío, el resto de la función se ejecuta
  const razonCountTableCard = document.querySelector(".card");
  razonCountTableCard.style.display = "block"; // Muestra la tabla

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchRif`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  const tbody = document .getElementById("rifCountTable").getElementsByTagName("tbody")[0];

     if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }


  // Destruye DataTables si ya está inicializado
  if ($.fn.DataTable.isDataTable("#rifCountTable")) {
    $("#rifCountTable").DataTable().destroy();
  }


  // Limpia la tabla ANTES de la nueva búsqueda
  tbody.innerHTML = "";

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "hidden";
        welcomeMessage.style.opacity = "0";
      }
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success && response.rif && response.rif.length > 0) {
          const rifData = response.rif;
          rifData.forEach((item) => {
            const row = tbody.insertRow();
            const id_clienteCell = row.insertCell();
            const razonsocialCell = row.insertCell();
            const rifCell = row.insertCell();
            const name_modeloposCell = row.insertCell();
            const serial_posCell = row.insertCell();
            const desc_posCell = row.insertCell();
            const afiliacionCell = row.insertCell();
            const fechainstallCell = row.insertCell();
            const bancoCell = row.insertCell();
            const directionCell = row.insertCell();
            const estadoCell = row.insertCell();
            const municipioCell = row.insertCell();

            id_clienteCell.textContent = item.id_cliente;
            razonsocialCell.textContent = item.razonsocial;
            rifCell.textContent = item.rif;
            name_modeloposCell.textContent = item.name_modelopos;
            
            // Crear el enlace para el número de serie
            const enlaceSerial = document.createElement("a");
            enlaceSerial.textContent = item.serial_pos;
            enlaceSerial.style.color = "blue";
            enlaceSerial.style.textDecoration = "underline";
            enlaceSerial.style.cursor = "pointer";
            serial_posCell.appendChild(enlaceSerial);
            desc_posCell.textContent = item.desc_pos;

            // Modal de detalles del serial (tu código existente)
            const modalSerial = document.getElementById("ModalSerial");
            const spanSerialClose = document.getElementById("ModalSerial-close");
            enlaceSerial.onclick = function () {
              modalSerial.style.display = "block";
              fetchSerialData(item.serial_pos, item.rif, item.razonsocial);
            };
            spanSerialClose.onclick = function () {
              modalSerial.style.display = "none";
            };
            window.onclick = function (event) {
              if (event.target == modalSerial) {
                modalSerial.style.display = "none";
              }
            };
            
            fechainstallCell.textContent = item.fechainstalacion;
            afiliacionCell.textContent = item.afiliacion;

            // Lógica de la garantía
            const fechaInstalacion = new Date(item.fechainstalacion);
            const ahora = new Date();
            const diffEnMilisegundos = ahora.getTime() - fechaInstalacion.getTime();
            const diffEnMeses = diffEnMilisegundos / (1000 * 60 * 60 * 24 * 30.44);

            const garantiaLabel = document.createElement("span");
            garantiaLabel.style.fontSize = "10px";
            garantiaLabel.style.fontWeight = "bold";
            garantiaLabel.style.display = "block";
            garantiaLabel.style.marginTop = "5px";
            garantiaLabel.style.width = "173px";
            let garantiaTexto = "";
            let garantiaClase = "";

            if (diffEnMeses <= 6 && diffEnMeses >= 0) {
              garantiaTexto = "Garantía Instalación (6 meses)";
              garantiaClase = "garantia-activa";
            } else {
              garantiaTexto = "Sin garantía";
              garantiaClase = "sin-garantia";
            }

            garantiaLabel.textContent = garantiaTexto;
            garantiaLabel.className = garantiaClase;
            fechainstallCell.appendChild(document.createElement("br"));
            fechainstallCell.appendChild(garantiaLabel);

            bancoCell.textContent = item.banco;
            directionCell.textContent = item.direccion_instalacion;
            estadoCell.textContent = item.estado;
            municipioCell.textContent = item.municipio;
          });

          // === FUNCIÓN SEGURA PARA CONVERTIR CUALQUIER VALOR A TEXTO (usada en DataTables y PDF) ===
          function safeValue(value) {
              if (value === null || value === undefined || value === '') {
                  return 'N/A';
              }
              if (typeof value === 'object') {
                  // Si es un objeto Date
                  if (value instanceof Date) {
                      return value.toLocaleDateString('es-VE');
                  }
                  // Si tiene una propiedad que sea string (como en Laravel Carbon)
                  if (value.date || value.timezone || value.formatted) {
                      return value.date || value.formatted || 'N/A';
                  }
                  // Si es un objeto plano, intenta convertirlo
                  try {
                      const str = JSON.stringify(value);
                      if (str === '{}' || str === '[]') return 'N/A';
                      return str;
                  } catch (e) {
                      return 'N/A';
                  }
              }
              return String(value).trim() || 'N/A';
          }

          // Función para crear y mostrar el overlay de carga
          function showExportLoading() {
            // Verificar si ya existe el overlay
            let loadingOverlay = document.getElementById('export-loading-overlay');
            if (!loadingOverlay) {
              loadingOverlay = document.createElement('div');
              loadingOverlay.id = 'export-loading-overlay';
              loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.95);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px);
              `;
              
              const spinner = document.createElement('div');
              spinner.style.cssText = `
                width: 80px;
                height: 80px;
                border: 6px solid #f3f3f3;
                border-top: 6px solid #003594;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              `;
              
              const message = document.createElement('h4');
              message.textContent = 'Generando documento...';
              message.style.cssText = `
                color: #003594;
                margin-bottom: 10px;
                font-weight: 600;
              `;
              
              const subMessage = document.createElement('p');
              subMessage.textContent = 'Por favor espere, esto puede tardar unos momentos';
              subMessage.style.cssText = `
                color: #666;
                font-size: 14px;
              `;
              
              loadingOverlay.appendChild(spinner);
              loadingOverlay.appendChild(message);
              loadingOverlay.appendChild(subMessage);
              document.body.appendChild(loadingOverlay);
            } else {
              loadingOverlay.style.display = 'flex';
            }
          }
          
          // Función para ocultar el overlay de carga
          function hideExportLoading() {
            const loadingOverlay = document.getElementById('export-loading-overlay');
            if (loadingOverlay) {
              loadingOverlay.style.display = 'none';
            }
          }

          // Inicialización de DataTables
          if ($.fn.DataTable.isDataTable("#rifCountTable")) {
            $("#rifCountTable").DataTable().destroy();

          }
          $("#rifCountTable").DataTable({

            responsive: false,
            pagingType: "simple_numbers",
            lengthMenu: [5],
            autoWidth: false,
            language: {
              lengthMenu: "Mostrar _MENU_ Registros",
              emptyTable: "No hay Registros disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "_TOTAL_ Registros",
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
                                        // Buscar fecha (formato YYYY-MM-DD)
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia; // Salto de línea para separar
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
                        var sheet = xlsx.xl.worksheets['Consulta_por_Rif.xml'];
                        
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
                        
                        // Ajustar altura de filas - MAYOR altura para fecha con garantía
                        $('row', sheet).each(function(index) {
                            if (index === 0) {
                                $(this).attr('ht', 30); // Header
                            } else {
                                // Verificar si la fila tiene fecha con garantía
                                let hasDateWithWarranty = false;
                                $('c', this).each(function() {
                                    let cellValue = $(this).text();
                                    if (cellValue && (cellValue.includes('Sin garantia') || cellValue.includes('Sin garantía'))) {
                                        hasDateWithWarranty = true;
                                    }
                                });
                                
                                if (hasDateWithWarranty) {
                                    $(this).attr('ht', 80); // Mayor altura para fecha + garantía
                                } else {
                                    $(this).attr('ht', 60); // Altura normal
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
                    filename: `REPORTE EMPRESA - RIF ${rifCompleto.trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, '_')} ${new Date().toISOString().split('T')[0]}`,
                    className: 'btn-pdf-modern',
                    attr: { id: 'btn-pdf-modern-id', title: 'Exportar a PDF' },
                    action: function(e, dt, button, config) {
                        showExportLoading();
                        $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, button, config);
                        const delay = Math.min(Math.max(dt.rows().count() * 20, 4000), 18000);
                        setTimeout(hideExportLoading, delay);
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: { body: (data) => safeValue(data) }
                    },
                    customize: function(doc) {
                        const logoDataUrl = window.PDF_LOGO_DATAURL;
                        const hasLogo = typeof logoDataUrl === 'string' && logoDataUrl.startsWith('data:');
                        if (hasLogo) {
                            doc.images = doc.images || {};
                            doc.images.logo_inteligensa = logoDataUrl;
                        }

                        const rif = rifCompleto.trim().toUpperCase() || 'SIN_RIF';
                        const fechaGen = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });
                        const fullName = document.getElementById('Full_name')?.value || 'USUARIO DESCONOCIDO';

                        doc.pageMargins = [40, 130, 40, 80];
                        doc.pageSize = 'A4';
                        doc.defaultStyle = { fontSize: 9.5 };
                        doc.styles = {
                            title: { fontSize: 16, bold: true, color: '#1f4e8c', alignment: 'center', margin: [0, 0, 0, 25] },
                            subtitle: { fontSize: 12, bold: true, color: '#003594', alignment: 'center', margin: [0, 5, 0, 15] },
                            noteTitle: { fontSize: 10.5, bold: true, color: '#d32f2f', margin: [0, 0, 0, 4] },
                            noteText: { fontSize: 9.2, italics: true, color: '#424242', margin: [0, 0, 0, 6] },
                            generatedOSD: { fontSize: 8, color: '#666', italics: true },
                            ticketTitle: { fontSize: 13, bold: true, color: '#1f4e8c', margin: [0, 8, 0, 6] },
                            ticketSubtitle: { fontSize: 9.5, color: '#555', margin: [0, 0, 0, 8] }
                        };

                        doc.header = function() {
                            return {
                                margin: [40, 20, 40, 10],
                                stack: [
                                    hasLogo
                                        ? {
                                            columns: [
                                                { image: 'logo_inteligensa', width: 85 },
                                                { text: 'RIF: J-00291615-0', alignment: 'right', bold: true, color: '#1f4e8c', fontSize: 10.5 }
                                            ]
                                        }
                                        : {
                                            columns: [
                                                { text: 'INTELIGENSA', alignment: 'left', bold: true, color: '#1f4e8c', fontSize: 14 },
                                                { text: 'RIF: J-00291615-0', alignment: 'right', bold: true, color: '#1f4e8c', fontSize: 10.5 }
                                            ]
                                        },
                                    { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 515, y2: 8, lineWidth: 1.3, lineColor: '#003594' }] },
                                    { text: 'Urbanización El Rosal. Av. Francisco de Miranda\nEdif. Centro Sudamérica PH-A Caracas. Edo. Miranda', alignment: 'center', fontSize: 8.5, color: '#555', margin: [0, 8, 0, 8] },
                                    { text: 'REPORTE DE EMPRESA POR RIF', style: 'title' },
                                    { text: `RIF: ${rif}`, style: 'subtitle' }
                                ]
                            };
                        };

                        doc.footer = function(currentPage, pageCount) {
                            return {
                                margin: [40, 20],
                                columns: [
                                    hasLogo ? { image: 'logo_inteligensa', width: 55, opacity: 0.7 } : { text: 'INTELIGENSA', bold: true, color: '#1f4e8c', fontSize: 9 },
                                    { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 8.5, color: '#666' }
                                ]
                            };
                        };

                        const originalContent = doc.content;
                        doc.content = [];

                        doc.content.push({
                            stack: [
                                { text: 'Nota importante', style: 'noteTitle' },
                                { text: 'Los campos que aparecen como "N/A" indican que no existe información disponible para ese dato.', style: 'noteText' },
                                { text: `Documento Generado por: ${fullName} - ${fechaGen}`, style: 'generatedOSD' }
                            ],
                            alignment: 'left',
                            margin: [0, 15, 0, 12],
                            background: '#f8f9fa',
                            fillColor: '#f8f9fa'
                        });

                        const stripHtml = (input) => {
                            if (input === null || input === undefined) return 'N/A';
                            if (typeof input === 'object') {
                                if (typeof input.text === 'string') input = input.text;
                                else if (Array.isArray(input)) input = input.join(' ');
                                else input = input.toString();
                            }
                            const text = String(input)
                                .replace(/<[^>]*>/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim();
                            return text || 'N/A';
                        };

                        try {
                            const table = originalContent.find(item => item.table);
                            if (table && table.table.body.length > 1) {
                                const headerRow = table.table.body[0];
                                const dataRows = table.table.body.slice(1);

                                dataRows.forEach((row, idx) => {
                                    const kv = [];
                                    let idTicket = '', razonRow = '', rifRow = '', serialRow = '';

                                    headerRow.forEach((h, i) => {
                                        const label = stripHtml(h.text || h);
                                        const value = stripHtml(row[i]);

                                        if (label.toLowerCase().includes('id ticket') || label.toLowerCase().includes('id cliente')) idTicket = value;
                                        if (label.toLowerCase().includes('razón social') || label.toLowerCase().includes('razon social')) razonRow = value;
                                        if (label.toLowerCase().includes('rif')) rifRow = value;
                                        if (label.toLowerCase().includes('serial')) serialRow = value;

                                        kv.push([
                                            { text: label || '-', bold: true, color: '#1f4e8c', fontSize: 9, margin: [8, 4] },
                                            { text: value || 'N/A', fontSize: 9, margin: [0, 4] }
                                        ]);
                                    });

                                    const subtitleParts = [];
                                    if (razonRow && razonRow !== 'N/A') subtitleParts.push(razonRow);
                                    if (rifRow && rifRow !== 'N/A') subtitleParts.push(`RIF: ${rifRow}`);
                                    const subtitleText = subtitleParts.join(' • ');

                                    doc.content.push({
                                        stack: [
                                            { text: `Empresa ${idTicket || (idx + 1)}`, style: 'ticketTitle' },
                                            ...(subtitleText ? [{ text: subtitleText, style: 'ticketSubtitle' }] : []),
                                            {
                                                table: { widths: [160, '*'], body: kv },
                                                layout: {
                                                    fillColor: i => i % 2 === 0 ? '#f8f9fa' : '#ffffff',
                                                    hLineWidth: () => 0.6,
                                                    vLineWidth: () => 0,
                                                    hLineColor: () => '#c8d6ef',
                                                    paddingLeft: () => 10,
                                                    paddingRight: () => 10
                                                }
                                            }
                                        ],
                                        margin: [0, 8, 0, 30],
                                        pageBreak: idx > 0 && idx % 3 === 0 ? 'before' : undefined
                                    });
                                });
                            } else {
                                doc.content = originalContent;
                            }
                        } catch (err) {
                            console.error("Error transformando PDF por RIF:", err);
                            doc.content = originalContent;
                        }
                    }
                }
            ]
          });

          $("#rifCountTable").resizableColumns();
        } else {
          // Si no hay datos, muestra un mensaje de "no encontrado"
          tbody.innerHTML = '<tr><td colspan="11" class="text-center">No se encontraron datos para el RIF ingresado.</td></tr>';
          // Show the welcome message if no data found
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "visible";
            welcomeMessage.style.opacity = "1";
          }
        }
      } catch (error) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center">Error al procesar la respuesta.</td></tr>';
        console.error("Error parsing JSON:", error);
        // Show the welcome message if there's an error
        if (welcomeMessage) {
          welcomeMessage.style.visibility = "visible";
          welcomeMessage.style.opacity = "1";
        }
      }
    } else if (xhr.status === 404) {
      tbody.innerHTML = '<tr><td colspan="11" class="text-center">No se encontraron usuarios.</td></tr>';
    } else {
      tbody.innerHTML = '<tr><td colspan="11" class="text-center">Error de conexión.</td></tr>';
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td colspan="11" class="text-center">Error de red.</td></tr>';
    console.error("Error de red");
  };
  
  const datos = `action=SearchRif&rif=${encodeURIComponent(rifCompleto)}`;
  xhr.send(datos);
}

// Función para limpiar datos HTML
function cleanHtmlData(data) {
    if (typeof data !== 'string') return data;
    
    // Remover todas las etiquetas HTML
    data = data.replace(/<[^>]*>/g, '');
    
    // Limpiar caracteres especiales
    data = data.replace(/&nbsp;/g, ' ');
    data = data.replace(/&amp;/g, '&');
    data = data.replace(/&lt;/g, '<');
    data = data.replace(/&gt;/g, '>');
    data = data.replace(/&quot;/g, '"');
    
    // Limpiar saltos de línea y espacios
    data = data.replace(/\n/g, ' ').trim();
    data = data.replace(/\s+/g, ' ');
    
    // Limpiar texto específico
    data = data.replace(/Sin garantía/g, 'Sin garantia');
    
    return data;
}

// **Función para obtener el RIF completo**
function obtenerRifCompleto() {
  const tipoRif = document.getElementById("rifTipo").value;
  const numeroRif = document.getElementById("rifInput").value.trim();
  return tipoRif + numeroRif;
}

function SendSerial() {
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.style.visibility = "visible";
    welcomeMessage.style.opacity = "1";
  }

  const serialInput = document.getElementById("serialInput");
  const serialInputValue = serialInput.value.trim();

  // 1. Validar la entrada de usuario al principio
  if (!serialInputValue) {
    Swal.fire({
      title: "Atención",
      text: "Debes ingresar un número de serie",
      icon: "warning",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      keydownListenerCapture: true,
      color: "black",
      confirmButtonColor: "#003594",
    });
    // Volver a mostrar el mensaje de bienvenida si la validación falla
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

  // 2. Limpiar la tabla existente (si la hay) y mensajes antes de la nueva petición
  let rifCountTable = document.getElementById("rifCountTable");
  if (rifCountTable) {
    // Si ya es una instancia de DataTables, destrúyela primero
    if ($.fn.DataTable.isDataTable(rifCountTable)) {
      $(rifCountTable).DataTable().destroy();
    }
    rifCountTable.remove(); // Elimina la tabla del DOM
  }
  mainTableCard.querySelectorAll("p").forEach((p) => p.remove()); // Limpia mensajes de error/estado

  // Opcional: mostrar un mensaje de "cargando..."
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Buscando datos...";
  loadingMessage.className = "text-center text-muted";
  mainTableCard.appendChild(loadingMessage);

  // **ATENCIÓN:** Se ha eliminado la línea para hacer la tarjeta visible aquí
  // mainTableCard.style.display = "block";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchSerialData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    // Eliminar el mensaje de carga
    if (loadingMessage) {
      loadingMessage.remove();
    }
    
    // **Añadir la lógica para limpiar la tabla existente y los mensajes aquí**
    // **Es más seguro hacerlo dentro del onload para evitar duplicación**
    let existingTable = document.getElementById("rifCountTable");
    if (existingTable) {
      if ($.fn.DataTable.isDataTable(existingTable)) {
        $(existingTable).DataTable().destroy();
      }
      existingTable.remove();
    }
    mainTableCard.querySelectorAll("p").forEach((p) => p.remove());

    if (xhr.status >= 200 && xhr.status < 300) {
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "hidden";
        welcomeMessage.style.opacity = "0";
      }
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success && response.serialData && response.serialData.length > 0) {
          // **ATENCIÓN:** Mover la línea para hacer la tarjeta visible a este bloque
          mainTableCard.style.display = "block";

          // 3. Crear la tabla y poblar los datos
          const newTable = document.createElement("table");
          newTable.id = "rifCountTable";
          newTable.className = "table table-striped table-bordered table-hover table-sm";
          mainTableCard.appendChild(newTable);

          const data = response.serialData;
          const columnsConfig = [
            { data: "id_cliente", title: "ID Cliente" },
            { data: "razonsocial", title: "Razón Social" },
            { data: "rif", title: "RIF" },
            { data: "name_modelopos", title: "Modelo POS" },
            {
              data: "serial_pos",
              title: "Serial POS",
              render: function (data, type, row) {
                return `<a href="#" class="serial-link">${data}</a>`;
              },
            },
            {data: "desc_pos", title: "Estatus del Equipo"},
            { data: "afiliacion", title: "N° Afiliación" },
            { 
              data: "fechainstalacion", 
              title: "Fecha Instalación",
              render: function(data, type, row) {
                const fechaInstalacion = new Date(data);
                const ahora = new Date();
                const diffEnMeses = (ahora.getFullYear() - fechaInstalacion.getFullYear()) * 12 + (ahora.getMonth() - fechaInstalacion.getMonth());
                const garantiaTexto = (diffEnMeses <= 6) ? "Garantía Instalación (6 meses)" : "Sin garantía";
                const garantiaClase = (diffEnMeses <= 6) ? "garantia-activa" : "sin-garantia";
                return `<span>${data}</span><br><span class="${garantiaClase}" style="font-size: 10px; font-weight: bold; display: block; margin-top: 5px;">${garantiaTexto}</span>`;
              }
            },
            { data: "banco", title: "Banco" },
            { data: "direccion_instalacion", title: "Dirección Instalación" },
            { data: "estado", title: "Estado" },
            { data: "municipio", title: "Municipio" },
          ];

            // Lógica para crear las columnas y el thead
           // === FUNCIÓN SEGURA PARA CONVERTIR CUALQUIER VALOR A TEXTO (usada en DataTables y PDF) ===
          function safeValue(value) {
              if (value === null || value === undefined || value === '') {
                  return 'N/A';
              }
              if (typeof value === 'object') {
                  // Si es un objeto Date
                  if (value instanceof Date) {
                      return value.toLocaleDateString('es-VE');
                  }
                  // Si tiene una propiedad que sea string (como en Laravel Carbon)
                  if (value.date || value.timezone || value.formatted) {
                      return value.date || value.formatted || 'N/A';
                  }
                  // Si es un objeto plano, intenta convertirlo
                  try {
                      const str = JSON.stringify(value);
                      if (str === '{}' || str === '[]') return 'N/A';
                      return str;
                  } catch (e) {
                      return 'N/A';
                  }
              }
              return String(value).trim() || 'N/A';
          }

                    // Función para crear y mostrar el overlay de carga
          function showExportLoading() {
            // Verificar si ya existe el overlay
            let loadingOverlay = document.getElementById('export-loading-overlay');
            if (!loadingOverlay) {
              loadingOverlay = document.createElement('div');
              loadingOverlay.id = 'export-loading-overlay';
              loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.95);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px);
              `;
              
              const spinner = document.createElement('div');
              spinner.style.cssText = `
                width: 80px;
                height: 80px;
                border: 6px solid #f3f3f3;
                border-top: 6px solid #003594;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              `;
              
              const message = document.createElement('h4');
              message.textContent = 'Generando documento...';
              message.style.cssText = `
                color: #003594;
                margin-bottom: 10px;
                font-weight: 600;
              `;
              
              const subMessage = document.createElement('p');
              subMessage.textContent = 'Por favor espere, esto puede tardar unos momentos';
              subMessage.style.cssText = `
                color: #666;
                font-size: 14px;
              `;
              
              loadingOverlay.appendChild(spinner);
              loadingOverlay.appendChild(message);
              loadingOverlay.appendChild(subMessage);
              document.body.appendChild(loadingOverlay);
            } else {
              loadingOverlay.style.display = 'flex';
            }
          }
          
          // Función para ocultar el overlay de carga
          function hideExportLoading() {
            const loadingOverlay = document.getElementById('export-loading-overlay');
            if (loadingOverlay) {
              loadingOverlay.style.display = 'none';
            }
          }

          $(newTable).DataTable({
            responsive: false,
            fixedHeader: true,
            data: data,
            columns: columnsConfig,
            pagingType: "simple_numbers",
            lengthMenu: [5],
            autoWidth: false,
            language: {
              lengthMenu: "Mostrar _MENU_ Registros",
              emptyTable: "No hay Registros disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "_TOTAL_ Registros",
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
                    title: 'Búsqueda por Serial',
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
                                        // Buscar fecha (formato YYYY-MM-DD)
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia; // Salto de línea para separar
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
                        var sheet = xlsx.xl.worksheets['Consulta_por_Serial.xml'];
                        
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
                        
                        // Ajustar altura de filas - MAYOR altura para fecha con garantía
                        $('row', sheet).each(function(index) {
                            if (index === 0) {
                                $(this).attr('ht', 30); // Header
                            } else {
                                // Verificar si la fila tiene fecha con garantía
                                let hasDateWithWarranty = false;
                                $('c', this).each(function() {
                                    let cellValue = $(this).text();
                                    if (cellValue && (cellValue.includes('Sin garantia') || cellValue.includes('Sin garantía'))) {
                                        hasDateWithWarranty = true;
                                    }
                                });
                                
                                if (hasDateWithWarranty) {
                                    $(this).attr('ht', 80); // Mayor altura para fecha + garantía
                                } else {
                                    $(this).attr('ht', 60); // Altura normal
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
  
  filename: `REPORTE EMPRESA - SERIAL ${serialInputValue.trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, '_')} ${new Date().toISOString().split('T')[0]}`,
                    className: 'btn-pdf-modern',
  attr: { id: 'btn-pdf-modern-id', title: 'Exportar a PDF' },
  action: function(e, dt, button, config) {
    showExportLoading();
    $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, button, config);
    const delay = Math.min(Math.max(dt.rows().count() * 20, 4000), 18000);
    setTimeout(hideExportLoading, delay);
                    },
                    exportOptions: {
                        columns: ':visible',
    format: { body: (data) => safeValue(data) }
  },
  customize: function(doc) {
    const logoDataUrl = window.PDF_LOGO_DATAURL;
    const hasLogo = typeof logoDataUrl === 'string' && logoDataUrl.startsWith('data:');
    if (hasLogo) {
      doc.images = doc.images || {};
      doc.images.logo_inteligensa = logoDataUrl;
    }

    const serial = serialInputValue.trim().toUpperCase() || 'SIN_SERIAL';
    const fechaGen = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });
    const fullName = document.getElementById('Full_name')?.value || 'USUARIO DESCONOCIDO';

    doc.pageMargins = [40, 130, 40, 80];
    doc.pageSize = 'A4';
    doc.defaultStyle = { fontSize: 9.5 };
    doc.styles = {
      title: { fontSize: 16, bold: true, color: '#1f4e8c', alignment: 'center', margin: [0, 0, 0, 25] },
      subtitle: { fontSize: 12, bold: true, color: '#003594', alignment: 'center', margin: [0, 5, 0, 15] },
      noteTitle: { fontSize: 10.5, bold: true, color: '#d32f2f', margin: [0, 0, 0, 4] },
      noteText: { fontSize: 9.2, italics: true, color: '#424242', margin: [0, 0, 0, 6] },
      generatedOSD: { fontSize: 8, color: '#666', italics: true },
      ticketTitle: { fontSize: 13, bold: true, color: '#1f4e8c', margin: [0, 8, 0, 6] },
      ticketSubtitle: { fontSize: 9.5, color: '#555', margin: [0, 0, 0, 8] }
    };

    doc.header = function() {
                            return {
        margin: [40, 20, 40, 10],
        stack: [
          hasLogo
            ? {
                columns: [
                  { image: 'logo_inteligensa', width: 85 },
                  { text: 'RIF: J-00291615-0', alignment: 'right', bold: true, color: '#1f4e8c', fontSize: 10.5 }
                ]
              }
            : {
                columns: [
                  { text: 'INTELIGENSA', alignment: 'left', bold: true, color: '#1f4e8c', fontSize: 14 },
                  { text: 'RIF: J-00291615-0', alignment: 'right', bold: true, color: '#1f4e8c', fontSize: 10.5 }
                ]
              },
          { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 515, y2: 8, lineWidth: 1.3, lineColor: '#003594' }] },
          { text: 'Urbanización El Rosal. Av. Francisco de Miranda\nEdif. Centro Sudamérica PH-A Caracas. Edo. Miranda', alignment: 'center', fontSize: 8.5, color: '#555', margin: [0, 8, 0, 8] },
          { text: 'REPORTE DE EMPRESA POR SERIAL', style: 'title' },
          { text: `Serial: ${serial}`, style: 'subtitle' }
        ]
      };
    };

                        doc.footer = function(currentPage, pageCount) {
                            return {
        margin: [40, 20],
        columns: [
          hasLogo ? { image: 'logo_inteligensa', width: 55, opacity: 0.7 } : { text: 'INTELIGENSA', bold: true, color: '#1f4e8c', fontSize: 9 },
          { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 8.5, color: '#666' }
        ]
      };
    };

    const originalContent = doc.content;
    doc.content = [];

    doc.content.push({
      stack: [
        { text: 'Nota importante', style: 'noteTitle' },
        { text: 'Los campos que aparecen como "N/A" indican que no existe información disponible para ese dato.', style: 'noteText' },
        { text: `Documento Generado por: ${fullName} - ${fechaGen}`, style: 'generatedOSD' }
      ],
      alignment: 'left',
      margin: [0, 15, 0, 12],
      background: '#f8f9fa',
      fillColor: '#f8f9fa'
    });

    const stripHtml = (input) => {
      if (input === null || input === undefined) return 'N/A';
      if (typeof input === 'object') {
        if (typeof input.text === 'string') input = input.text;
        else if (Array.isArray(input)) input = input.join(' ');
        else input = input.toString();
      }
      const text = String(input)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text || 'N/A';
    };

    try {
      const table = originalContent.find(item => item.table);
      if (table && table.table.body.length > 1) {
        const headerRow = table.table.body[0];
        const dataRows = table.table.body.slice(1);

        dataRows.forEach((row, idx) => {
          const kv = [];
          let idTicket = '', razonRow = '', rifRow = '', serialRow = '';

          headerRow.forEach((h, i) => {
            const label = stripHtml(h.text || h);
            const value = stripHtml(row[i]);

            if (label.toLowerCase().includes('id ticket') || label.toLowerCase().includes('id cliente')) idTicket = value;
            if (label.toLowerCase().includes('razón social') || label.toLowerCase().includes('razon social')) razonRow = value;
            if (label.toLowerCase().includes('rif')) rifRow = value;
            if (label.toLowerCase().includes('serial')) serialRow = value;

            kv.push([
              { text: label || '-', bold: true, color: '#1f4e8c', fontSize: 9, margin: [8, 4] },
              { text: value || 'N/A', fontSize: 9, margin: [0, 4] }
            ]);
          });

          const subtitleParts = [];
          if (razonRow && razonRow !== 'N/A') subtitleParts.push(razonRow);
          if (rifRow && rifRow !== 'N/A') subtitleParts.push(`RIF: ${rifRow}`);
          const subtitleText = subtitleParts.join(' • ');

          doc.content.push({
            stack: [
              { text: `Empresa ${idTicket || (idx + 1)}`, style: 'ticketTitle' },
              ...(subtitleText ? [{ text: subtitleText, style: 'ticketSubtitle' }] : []),
              {
                table: { widths: [160, '*'], body: kv },
                layout: {
                  fillColor: i => i % 2 === 0 ? '#f8f9fa' : '#ffffff',
                  hLineWidth: () => 0.6,
                  vLineWidth: () => 0,
                  hLineColor: () => '#c8d6ef',
                  paddingLeft: () => 10,
                  paddingRight: () => 10
                }
              }
            ],
            margin: [0, 8, 0, 30],
            pageBreak: idx > 0 && idx % 3 === 0 ? 'before' : undefined
          });
        });
      } else {
        doc.content = originalContent;
      }
    } catch (err) {
      console.error("Error transformando PDF por serial:", err);
      doc.content = originalContent;
    }
                    }
                }
            ]
          });
          $(newTable).resizableColumns();

          // 4. Delegar el evento de clic del enlace del serial
          $(newTable).on("click", "a.serial-link", function (e) {
            e.preventDefault();
            const rowData = $(newTable).DataTable().row($(this).parents("tr")).data();
            const modalSerial = document.getElementById("ModalSerial");
            modalSerial.style.display = "block";
            fetchSerialData(rowData.serial_pos, rowData.rif, rowData.razonsocial);
          });
        } else {
          // Si no hay datos, mostrar un mensaje y la imagen de bienvenida
          const noDataMessage = document.createElement("p");
          noDataMessage.textContent = "No se encontraron datos para el serial ingresado.";
          mainTableCard.appendChild(noDataMessage);
          if (welcomeMessage) {
            welcomeMessage.style.visibility = "visible";
            welcomeMessage.style.opacity = "1";
          }
        }
      } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error al procesar la respuesta.";
        mainTableCard.appendChild(errorMessage);
        console.error("Error parsing JSON:", error);
        if (welcomeMessage) {
          welcomeMessage.style.visibility = "visible";
          welcomeMessage.style.opacity = "1";
        }
      }
    } else {
      // Manejar errores HTTP
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error de conexión con el servidor.";
      mainTableCard.appendChild(errorMessage);
      console.error("Error:", xhr.status, xhr.statusText);
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }
    }
  };

  xhr.onerror = function () {
    if (loadingMessage) {
      loadingMessage.remove();
    }
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error de red. Verifique su conexión.";
    mainTableCard.appendChild(errorMessage);
    console.error("Error de red");
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
  };

  const datos = `action=SearchSerialData&serial=${encodeURIComponent(serialInputValue)}`;
  xhr.send(datos);
}

function SendRazon() {
  // Get the welcome message element
  const welcomeMessage = document.getElementById("welcomeMessage");
  // Hide the welcome message at the start of the function
  if (welcomeMessage) {
    welcomeMessage.style.visibility = "visible";
    welcomeMessage.style.opacity = "1";
  }
  
  const razonInput = document.getElementById("RazonInput");
  const razonInputValue = razonInput.value.trim(); // Obtiene el valor y elimina espacios en blanco

  // **Verificación para campo vacío**
  if (!razonInputValue) {
    Swal.fire({
      title: "Atención",
      text: "Debes ingresar una Razón Social",
      icon: "warning",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      keydownListenerCapture: true,
      color: "black",
      confirmButtonColor: "#003594",
    });
    // Show the welcome message if validation fails
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
    return; // Detiene la ejecución de la función
  }

  // Si el campo no está vacío, el resto de la función se ejecuta
  const razonCountTableCard = document.querySelector(".card");
  razonCountTableCard.style.display = "block"; // Muestra la tabla

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchRazonData`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  const tbody = document.getElementById("rifCountTable").getElementsByTagName("tbody")[0];

  // Destruye DataTables si ya está inicializado
  if ($.fn.DataTable.isDataTable("#rifCountTable")) {
    $("#rifCountTable").DataTable().destroy();
  }

 const inputRazon = document.getElementById('RazonInput');
  const nombreRazon = (inputRazon?.value || '').trim() || 'SIN_RAZON';
  const slugRazon = nombreRazon.replace(/[^a-zA-Z0-9]/g, '_');

  // Limpia la tabla ANTES de la nueva búsqueda
  tbody.innerHTML = "";
  
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
        if (welcomeMessage) {
          welcomeMessage.style.visibility = "hidden";
          welcomeMessage.style.opacity = "0";
        }
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success && response.RazonData && response.RazonData.length > 0) {
          response.RazonData.forEach((item) => {
            const row = tbody.insertRow();
            const id_clienteCell = row.insertCell();
            const razonsocialCell = row.insertCell();
            const rifCell = row.insertCell();
            const name_modeloposCell = row.insertCell();
            const serial_posCell = row.insertCell();
            serial_posCell.className = 'serial-pos-column'; // AÑADE ESTA LÍNEA

            const desc_posCell = row.insertCell();
            const afiliacionCell = row.insertCell();
            const fechainstallCell = row.insertCell();
            const bancoCell = row.insertCell();
            const directionCell = row.insertCell();
            const estadoCell = row.insertCell();
            const municipioCell = row.insertCell();

            id_clienteCell.textContent = item.id_cliente;
            razonsocialCell.textContent = item.razonsocial;
            rifCell.textContent = item.rif;
            name_modeloposCell.textContent = item.name_modelopos;

            // Crear el enlace para el número de serie
            const enlaceSerial = document.createElement("a");
            enlaceSerial.textContent = item.serial_pos;
            enlaceSerial.style.color = "blue";
            enlaceSerial.style.textDecoration = "underline";
            enlaceSerial.style.cursor = "pointer";
            serial_posCell.appendChild(enlaceSerial);
            desc_posCell.textContent = item.desc_pos;

            // Modal de detalles del serial (tu código existente)
            const modalSerial = document.getElementById("ModalSerial");
            const spanSerialClose = document.getElementById("ModalSerial-close");
            enlaceSerial.onclick = function () {
              modalSerial.style.display = "block";
              fetchSerialData(item.serial_pos, item.rif, item.razonsocial);
            };
            spanSerialClose.onclick = function () {
              modalSerial.style.display = "none";
            };
            window.onclick = function (event) {
              if (event.target == modalSerial) {
                modalSerial.style.display = "none";
              }
            };
            
            fechainstallCell.textContent = item.fechainstalacion;
            afiliacionCell.textContent = item.afiliacion;

            // Lógica de la garantía
            const fechaInstalacion = new Date(item.fechainstalacion);
            const ahora = new Date();
            const diffEnMilisegundos = ahora.getTime() - fechaInstalacion.getTime();
            const diffEnMeses = diffEnMilisegundos / (1000 * 60 * 60 * 24 * 30.44);

            const garantiaLabel = document.createElement("span");
            garantiaLabel.style.fontSize = "10px";
            garantiaLabel.style.fontWeight = "bold";
            garantiaLabel.style.display = "block";
            garantiaLabel.style.marginTop = "5px";
            garantiaLabel.style.width = "173px";
            let garantiaTexto = "";
            let garantiaClase = "";

            if (diffEnMeses <= 6 && diffEnMeses >= 0) {
              garantiaTexto = "Garantía Instalación (6 meses)";
              garantiaClase = "garantia-activa";
            } else {
              garantiaTexto = "Sin garantía";
              garantiaClase = "sin-garantia";
            }

            garantiaLabel.textContent = garantiaTexto;
            garantiaLabel.className = garantiaClase;
            fechainstallCell.appendChild(document.createElement("br"));
            fechainstallCell.appendChild(garantiaLabel);

            bancoCell.textContent = item.banco;
            directionCell.textContent = item.direccion_instalacion;
            estadoCell.textContent = item.estado;
            municipioCell.textContent = item.municipio;
          });

          // Lógica para crear las columnas y el thead
           // === FUNCIÓN SEGURA PARA CONVERTIR CUALQUIER VALOR A TEXTO (usada en DataTables y PDF) ===
          function safeValue(value) {
              if (value === null || value === undefined || value === '') {
                  return 'N/A';
              }
              if (typeof value === 'object') {
                  // Si es un objeto Date
                  if (value instanceof Date) {
                      return value.toLocaleDateString('es-VE');
                  }
                  // Si tiene una propiedad que sea string (como en Laravel Carbon)
                  if (value.date || value.timezone || value.formatted) {
                      return value.date || value.formatted || 'N/A';
                  }
                  // Si es un objeto plano, intenta convertirlo
                  try {
                      const str = JSON.stringify(value);
                      if (str === '{}' || str === '[]') return 'N/A';
                      return str;
                  } catch (e) {
                      return 'N/A';
                  }
              }
              return String(value).trim() || 'N/A';
          }

          // Agregar animación CSS para el spinner si no existe
          if (!document.getElementById('export-loading-spinner-style')) {
            const style = document.createElement('style');
            style.id = 'export-loading-spinner-style';
            style.textContent = `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `;
            document.head.appendChild(style);
          }

          // Función para crear y mostrar el overlay de carga
          function showExportLoading() {
            // Verificar si ya existe el overlay
            let loadingOverlay = document.getElementById('export-loading-overlay');
            if (!loadingOverlay) {
              loadingOverlay = document.createElement('div');
              loadingOverlay.id = 'export-loading-overlay';
              loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.95);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px);
              `;
              
              const spinner = document.createElement('div');
              spinner.style.cssText = `
                width: 80px;
                height: 80px;
                border: 6px solid #f3f3f3;
                border-top: 6px solid #003594;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              `;
              
              const message = document.createElement('h4');
              message.textContent = 'Generando documento...';
              message.style.cssText = `
                color: #003594;
                margin-bottom: 10px;
                font-weight: 600;
              `;
              
              const subMessage = document.createElement('p');
              subMessage.textContent = 'Por favor espere, esto puede tardar unos momentos';
              subMessage.style.cssText = `
                color: #666;
                font-size: 14px;
              `;
              
              loadingOverlay.appendChild(spinner);
              loadingOverlay.appendChild(message);
              loadingOverlay.appendChild(subMessage);
              document.body.appendChild(loadingOverlay);
            } else {
              loadingOverlay.style.display = 'flex';
            }
          }
          
          // Función para ocultar el overlay de carga
          function hideExportLoading() {
            const loadingOverlay = document.getElementById('export-loading-overlay');
            if (loadingOverlay) {
              loadingOverlay.style.display = 'none';
            }
          }

          // Inicialización de DataTables
          if ($.fn.DataTable.isDataTable("#rifCountTable")) {
            $("#rifCountTable").DataTable().destroy();
          }
          $("#rifCountTable").DataTable({
            dom: "Blfrtip",
            buttons: [{
              extend: "excelHtml5",
              footer: true,
              text: "Excel",
            }, ],
            responsive: false,
            pagingType: "simple_numbers",
            lengthMenu: [5, 10, 20, 50], // Opciones del length menu
            pageLength: 5, // Página por defecto
            scrollY: '400px', // Altura fija para el scroll vertical
            scrollCollapse: true, // Permite que la tabla se ajuste si hay pocos datos
            fixedHeader: true, // Fija el encabezado durante el scroll
            autoWidth: false,
            fixedHeader: true,
            language: {
              lengthMenu: "Mostrar _MENU_ Registros",
              emptyTable: "No hay Registros disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "_TOTAL_ Registros",
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
                    title: 'Búsqueda por Razón Social',
                    className: 'btn-excel-modern',
                    attr: {
                        id: 'btn-excel-modern-id',
                        title: 'Exportar a Excel'
                    },
                    action: function(e, dt, button, config) {
                        showExportLoading();
                        // Llamar a la acción por defecto
                        $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);
                        // Ocultar después de un tiempo razonable (ajustar según necesidad)
                        // El tiempo depende de la cantidad de datos
                        const rowCount = dt.rows({search: 'applied'}).count();
                        const delay = Math.min(Math.max(rowCount * 10, 2000), 10000); // Entre 2 y 10 segundos
                        setTimeout(function() {
                            hideExportLoading();
                        }, delay);
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
                                        // Buscar fecha (formato YYYY-MM-DD)
                                        const dateMatch = data.match(/\d{4}-\d{2}-\d{2}/);
                                        if (dateMatch) {
                                            const fecha = dateMatch[0];
                                            const garantia = data.includes('Sin garantia') ? 'Sin garantia' : 'Sin garantía';
                                            return fecha + '\n' + garantia; // Salto de línea para separar
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
                        var sheet = xlsx.xl.worksheets['Consuta_Por_RazonSocial.xml'];
                        
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
                        
                        // Ajustar altura de filas - MAYOR altura para fecha con garantía
                        $('row', sheet).each(function(index) {
                            if (index === 0) {
                                $(this).attr('ht', 30); // Header
                            } else {
                                // Verificar si la fila tiene fecha con garantía
                                let hasDateWithWarranty = false;
                                $('c', this).each(function() {
                                    let cellValue = $(this).text();
                                    if (cellValue && (cellValue.includes('Sin garantia') || cellValue.includes('Sin garantía'))) {
                                        hasDateWithWarranty = true;
                                    }
                                });
                                
                                if (hasDateWithWarranty) {
                                    $(this).attr('ht', 80); // Mayor altura para fecha + garantía
                                } else {
                                    $(this).attr('ht', 60); // Altura normal
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
  
  filename: `REPORTE EMPRESA - RAZÓN SOCIAL ${slugRazon.toUpperCase()} ${new Date().toISOString().split('T')[0]}`,
                    className: 'btn-pdf-modern',
  attr: { id: 'btn-pdf-modern-id', title: 'Exportar a PDF' },
                    action: function(e, dt, button, config) {
                        showExportLoading();
                        $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, button, config);
    const delay = Math.min(Math.max(dt.rows().count() * 20, 4000), 18000);
    setTimeout(hideExportLoading, delay);
                    },
                    exportOptions: {
                        columns: ':visible',
    format: { body: (data) => safeValue(data) }
  },
  customize: function(doc) {
    const logoDataUrl = window.PDF_LOGO_DATAURL;
    const hasLogo = typeof logoDataUrl === 'string' && logoDataUrl.startsWith('data:');
    if (hasLogo) {
      doc.images = doc.images || {};
      doc.images.logo_inteligensa = logoDataUrl;
    }

    const razonSocial = nombreRazon.toUpperCase();
    const fechaGen = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });
    const fullName = document.getElementById('Full_name')?.value || 'USUARIO DESCONOCIDO';

    doc.pageMargins = [40, 130, 40, 80];
    doc.pageSize = 'A4';
    doc.defaultStyle = { fontSize: 9.5 };
    doc.styles = {
      title: { fontSize: 16, bold: true, color: '#1f4e8c', alignment: 'center', margin: [0, 0, 0, 25] },
      subtitle: { fontSize: 12, bold: true, color: '#003594', alignment: 'center', margin: [0, 5, 0, 15] },
      noteTitle: { fontSize: 10.5, bold: true, color: '#d32f2f', margin: [0, 0, 0, 4] },
      noteText: { fontSize: 9.2, italics: true, color: '#424242', margin: [0, 0, 0, 6] },
      generatedOSD: { fontSize: 8, color: '#666', italics: true },
      ticketTitle: { fontSize: 13, bold: true, color: '#1f4e8c', margin: [0, 8, 0, 6] },
      ticketSubtitle: { fontSize: 9.5, color: '#555', margin: [0, 0, 0, 8] }
    };

    doc.header = function() {
                            return {
        margin: [40, 20, 40, 10],
        stack: [
          hasLogo
            ? {
                columns: [
                  { image: 'logo_inteligensa', width: 85 },
                  { text: 'RIF: J-00291615-0', alignment: 'right', bold: true, color: '#1f4e8c', fontSize: 10.5 }
                ]
              }
            : {
                columns: [
                  { text: 'INTELIGENSA', alignment: 'left', bold: true, color: '#1f4e8c', fontSize: 14 },
                  { text: 'RIF: J-00291615-0', alignment: 'right', bold: true, color: '#1f4e8c', fontSize: 10.5 }
                ]
              },
          { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 515, y2: 8, lineWidth: 1.3, lineColor: '#003594' }] },
          { text: 'Urbanización El Rosal. Av. Francisco de Miranda\nEdif. Centro Sudamérica PH-A Caracas. Edo. Miranda', alignment: 'center', fontSize: 8.5, color: '#555', margin: [0, 8, 0, 8] },
          { text: 'REPORTE DE EMPRESA POR RAZÓN SOCIAL', style: 'title' },
          { text: `Razón Social: ${razonSocial}`, style: 'subtitle' }
        ]
      };
    };

                        doc.footer = function(currentPage, pageCount) {
                            return {
        margin: [40, 20],
        columns: [
          hasLogo ? { image: 'logo_inteligensa', width: 55, opacity: 0.7 } : { text: 'INTELIGENSA', bold: true, color: '#1f4e8c', fontSize: 9 },
          { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 8.5, color: '#666' }
        ]
      };
    };

    const originalContent = doc.content;
    doc.content = [];

    doc.content.push({
      stack: [
        { text: 'Nota importante', style: 'noteTitle' },
        { text: 'Los campos que aparecen como "N/A" indican que no existe información disponible para ese dato.', style: 'noteText' },
        { text: `Documento Generado por: ${fullName} - ${fechaGen}`, style: 'generatedOSD' }
      ],
      alignment: 'left',
      margin: [0, 15, 0, 12],
      background: '#f8f9fa',
      fillColor: '#f8f9fa'
    });

    const stripHtml = (input) => {
      if (input === null || input === undefined) return 'N/A';
      if (typeof input === 'object') {
        if (typeof input.text === 'string') input = input.text;
        else if (Array.isArray(input)) input = input.join(' ');
        else input = input.toString();
      }
      const text = String(input)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text || 'N/A';
    };

    try {
      const table = originalContent.find(item => item.table);
      if (table && table.table.body.length > 1) {
        const headerRow = table.table.body[0];
        const dataRows = table.table.body.slice(1);

        dataRows.forEach((row, idx) => {
          const kv = [];
          let idTicket = '', razonRow = '', rifRow = '', serialRow = '';

          headerRow.forEach((h, i) => {
            const label = stripHtml(h.text || h);
            const value = stripHtml(row[i]);

            if (label.toLowerCase().includes('id ticket')) idTicket = value;
            if (label.toLowerCase().includes('razón social') || label.toLowerCase().includes('razon social')) razonRow = value;
            if (label.toLowerCase().includes('rif')) rifRow = value;
            if (label.toLowerCase().includes('serial')) serialRow = value;

            kv.push([
              { text: label || '-', bold: true, color: '#1f4e8c', fontSize: 9, margin: [8, 4] },
              { text: value || 'N/A', fontSize: 9, margin: [0, 4] }
            ]);
          });

          const subtitleParts = [];
          if (razonRow && razonRow !== 'N/A') subtitleParts.push(razonRow);
          if (rifRow && rifRow !== 'N/A') subtitleParts.push(`RIF: ${rifRow}`);
          const subtitleText = subtitleParts.join(' • ');

          doc.content.push({
            stack: [
              { text: `Empresa ${idTicket || (idx + 1)}`, style: 'ticketTitle' },
              ...(subtitleText ? [{ text: subtitleText, style: 'ticketSubtitle' }] : []),
              {
                table: { widths: [160, '*'], body: kv },
                layout: {
                  fillColor: i => i % 2 === 0 ? '#f8f9fa' : '#ffffff',
                  hLineWidth: () => 0.6,
                  vLineWidth: () => 0,
                  hLineColor: () => '#c8d6ef',
                  paddingLeft: () => 10,
                  paddingRight: () => 10
                }
              }
            ],
            margin: [0, 8, 0, 30],
            pageBreak: idx > 0 && idx % 3 === 0 ? 'before' : undefined
          });
        });
      } else {
        doc.content = originalContent;
      }
    } catch (err) {
      console.error("Error transformando PDF por razón social:", err);
      doc.content = originalContent;
    }
                    }
                }
            ]
          });
          $("#rifCountTable").resizableColumns();
        } else {
          // Si no hay datos, muestra un mensaje de "no encontrado"
          tbody.innerHTML = '<tr><td colspan="11" class="text-center">No se encontraron datos para la razón social ingresada.</td></tr>';
              // Show the welcome message if no data is found
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
        }
      } catch (error) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center">Error al procesar la respuesta.</td></tr>';
        console.error("Error parsing JSON:", error);
        // Show the welcome message on parsing error
        if (welcomeMessage) {
          welcomeMessage.style.visibility = "visible";
          welcomeMessage.style.opacity = "1";
        }
      }
    } else if (xhr.status === 404) {
      tbody.innerHTML = '<tr><td colspan="11" class="text-center">No se encontraron usuarios.</td></tr>';
      // Show the welcome message on 404 error
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }
    } else {
      tbody.innerHTML = '<tr><td colspan="11" class="text-center">Error de conexión.</td></tr>';
      console.error("Error:", xhr.status, xhr.statusText);
      // Show the welcome message on other HTTP errors
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }
    }
  };

  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td colspan="11" class="text-center">Error de red.</td></tr>';
    console.error("Error de red");
    // Show the welcome message on network error
    if (welcomeMessage) {
      welcomeMessage.style.visibility = "visible";
      welcomeMessage.style.opacity = "1";
    }
  };

  const datos = `action=SearchRazonData&RazonSocial=${encodeURIComponent(razonInputValue)}`;
  xhr.send(datos);
}

// Lógica para cerrar el modal de serial fuera de la función principal
const modalSerial = document.getElementById("ModalSerial");
const spanSerialClose = document.getElementById("ModalSerial-close");

if (spanSerialClose) {
  spanSerialClose.onclick = function () {
    modalSerial.style.display = "none";
  };
}
window.onclick = function (event) {
  if (event.target == modalSerial) {
    modalSerial.style.display = "none";
  }
};

function fetchSerialData(serial, rif,razonsocial) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchSerial`);

  console.log(razonsocial);
  globalSerial = serial;
  globalRif = rif;
  globalRazon = razonsocial;
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  const tbody = document
    .getElementById("serialCountTable")
    .getElementsByTagName("tbody")[0];

  // Limpia el contenido de la tabla antes de agregar nuevos datos
  tbody.innerHTML = "";

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success && response.serial && response.serial.length > 0) {
          const serialData = response.serial[0];

          // Construye la tabla vertical, omitiendo las propiedades vacías
          for (const key in serialData) {
            if (
              serialData.hasOwnProperty(key) &&
              serialData[key] !== null &&
              serialData[key] !== undefined &&
              serialData[key] !== ""
            ) {
              const tr = document.createElement("tr");
              const th = document.createElement("th");
              const td = document.createElement("td");

              const formattedKey = key
                .replace(/_/g, " ")
                .replace(/([A-Z])/g, " $1")
                .trim();

              th.textContent = formattedKey;
              td.textContent = serialData[key];
              td.setAttribute("data-column-name", formattedKey);

              // Obtén referencias a los botones
              const createTicketFalla1Btn = document.getElementById("createTicketFalla1Btn");
              const createTicketFalla2Btn = document.getElementById("createTicketFalla2Btn");
              const descEstatus=document.getElementById("txtDescripcion");

              // Verifica si los botones existen antes de intentar manipularlos
              if (createTicketFalla1Btn && createTicketFalla2Btn) {
                // Si la clave es 'Estatus_pos' y el valor es 'Equipo Desafiliado' o 'Equipo Inactivo'
                if (key === "Estatus_Pos") {
                  globalEstatusPos = serialData[key]; // ¡Aquí se asigna el valor!

                  // El resto de tu lógica para poner la fila en rojo
                  if (
                    serialData[key] === "Equipo Desafiliado" ||
                    serialData[key] === "Equipo Inactivo"
                  ) {
                    tr.id = `status-row-${serialData.Serial_pos || "unknown"}`; // Esto es para la fila, no para los botones.

                    // Ocultar los botones:
                    createTicketFalla1Btn.style.display = "none"; // Oculta el primer botón
                    createTicketFalla2Btn.style.display = "none"; // Oculta el segundo botón
                    
                    // Crear mensaje elegante para equipo desafiliado
                    descEstatus.innerHTML = `
                      <div class="alert alert-danger d-flex align-items-center mb-0" style="
                        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                        border: none;
                        border-radius: 12px;
                        padding: 16px 20px;
                        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
                        color: white;
                        font-weight: 500;
                        font-size: 14px;
                        margin: 0;
                        border-left: 4px solid #dc3545;
                      ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill me-3" viewBox="0 0 16 16" style="flex-shrink: 0;">
                          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        <div>
                          <strong>El equipo no se encuentra instalado</strong><br>
                          <small style="opacity: 0.9;">No puede generar tickets en este momento</small>
                        </div>
                      </div>
                    `;

                  } else {
                    // Si el estatus NO es "Equipo Desafiliado" ni "Equipo Inactivo", asegúrate de que los botones estén visibles:
                    createTicketFalla1Btn.style.display = "block"; // Restablece el display a su valor por defecto
                    createTicketFalla2Btn.style.display = "block"; // Restablece el display a su valor por defecto
                    
                    // Limpiar el mensaje de estado
                    descEstatus.innerHTML = "";
                  }
                }
              } else {
                console.warn(
                  "Los botones de creación de ticket no fueron encontrados en el DOM."
                );
              }
              tr.appendChild(th);
              tr.appendChild(td);
              tbody.appendChild(tr);
            }
          }
          downloadImageModal(serial);
          VerificarSucursales(rif);

          // --- MODIFICACIÓN CLAVE AQUÍ ---
          $(document).ready(function () {
            if ($.fn.DataTable.isDataTable("#serialCountTable")) {
              $("#serialCountTable").DataTable().destroy();
            }
            $("#serialCountTable").DataTable({
              responsive: true,
              pagingType: "simple_numbers",
              autoWidth: false,
              language: {
                emptyTable: "No hay Registros disponibles en la tabla",
                zeroRecords: "No se encontraron resultados para la búsqueda",
                info: "_TOTAL_ Registros",
                infoEmpty: "No hay datos disponibles",
                infoFiltered: "(Filtrado de _MAX_ Registros disponibles)",
                search: "Buscar:",
                loadingRecords: "Buscando...",
                processing: "Procesando...",
                lengthMenu:
                  'Mostrar <select><option value="5">5</option><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="-1">Todos</option></select>',
                paginate: {
                  first: "Primero",
                  last: "Ultimo",
                  next: "Siguiente",
                  previous: "Anterior",
                },
              },
              dom: 'Bfrtip', // Añade 'B' para incluir los botones
              buttons: [
                  {
                      extend: 'excelHtml5',
                      text: 'Excel',
                      title: 'Reporte', 
                  }
              ]
            });
          });
        } else {
          tbody.innerHTML =
            '<tr><td colspan="2">No se encontraron datos para este serial.</td></tr>';
        }
      } catch (error) {
        tbody.innerHTML =
          '<tr><td colspan="2">Error al procesar la respuesta.</td></tr>';
        console.error("Error parsing JSON:", error);
      }
    } else {
      tbody.innerHTML = '<tr><td colspan="2">Error de conexión.</td></tr>';
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    console.error("Error de red");
  };

  const datos = `action=SearchSerial&serial=${encodeURIComponent(serial)}`;
  xhr.send(datos);
}

function downloadImageModal(serial) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPhoto`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        //console.log(response);
        if (response.success) {
          const srcImagen = response.rutaImagen;
          const claseImagen = response.claseImagen; // Obtener la clase CSS
          const imgElement = document.querySelector("#ModalSerial img");
          if (imgElement) {
            imgElement.src = srcImagen;
            imgElement.className = claseImagen; // Aplicar la clase CSS  
          } else {
            console.error("No se encontró el elemento img en el modal.");
          }
        } else {
          console.error("Error al obtener la imagen:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    console.error("Error de red");
  };

  const datos = `action=GetPhoto&serial=${encodeURIComponent(serial)}`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", function () {
  const buscarPorRifBtn = document.getElementById("buscarPorRifBtn");
  const rifInput = document.getElementById("rifInput");
  const buscarRif = document.getElementById("buscarRif");
  const rifCountTableCard = document.querySelector(".card");
  const selectInputRif = document.getElementById("rifTipo");

  const buscarPorSerialBtn = document.getElementById("buscarPorSerialBtn");
  const serialInput = document.getElementById("serialInput");
  const buscarSerial = document.getElementById("buscarSerial");
  const serialCountTableCard = document.querySelector(".card");

  const buscarPorRazonBtn = document.getElementById("buscarPorNombreBtn");
  const razonInput = document.getElementById("RazonInput");
  const buscarRazon = document.getElementById("buscarRazon");
  const razonCountTableCard = document.querySelector(".card");
  
  if (rifInput) rifInput.value = "";
  if (serialInput) serialInput.value = "";
  if (razonInput) razonInput.value = "";

  if (buscarPorRazonBtn && razonCountTableCard) {
    buscarPorRazonBtn.addEventListener("click", function () {
      // Limpiar todos los inputs antes de mostrar los nuevos
      if (rifInput) rifInput.value = "";
      if (serialInput) serialInput.value = "";
      if (razonInput) razonInput.value = "";
      razonCountTableCard.style.marginTop = "0%"; // Asegúrate de que la fila sea visible
      razonCountTableCard.style.display = "none";
      razonInput.style.display = "block";
      buscarRazon.style.display = "block";
      selectInputRif.style.display = "none";
      buscarRif.style.display = "none";
      rifInput.style.display = "none";
      serialInput.style.display = "none";
      buscarSerial.style.display = "none";
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla.");
  }

  if (buscarPorRifBtn && rifCountTableCard) {
    buscarPorRifBtn.addEventListener("click", function () {
      // Limpiar todos los inputs antes de mostrar los nuevos
      if (rifInput) rifInput.value = "";
      if (serialInput) serialInput.value = "";
      if (razonInput) razonInput.value = "";
      
      rifCountTableCard.style.display = "none";
      razonCountTableCard.style.marginTop = "5%"; // Asegúrate de que la fila sea visible
      rifInput.style.display = "block";
      selectInputRif.style.display = "block";
      buscarRif.style.display = "block";
      buscarSerial.style.display = "none";
      serialInput.style.display = "none";
      buscarRazon.style.display = "none";
      razonInput.style.display = "none";
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla.");
  }

  if (buscarPorSerialBtn && serialCountTableCard) {
    buscarPorSerialBtn.addEventListener("click", function () {
      // Limpiar todos los inputs antes de mostrar los nuevos
      if (rifInput) rifInput.value = "";
      if (serialInput) serialInput.value = "";
      if (razonInput) razonInput.value = "";
      razonCountTableCard.style.marginTop = "0%"; // Asegúrate de que la fila sea visible
      serialCountTableCard.style.display = "none";
      serialInput.style.display = "block";
      buscarSerial.style.display = "block";
      selectInputRif.style.display = "none";
      rifInput.style.display = "none";
      buscarRif.style.display = "none";
      buscarRazon.style.display = "none";
      razonInput.style.display = "none";
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla.");
  }
});

// Obtén una referencia al modal y al tbody de la tabla
const modalComponentesEl = document.getElementById('modalComponentes');
const tbodyComponentes = document.getElementById('tbodyComponentes');
const contadorComponentes = document.getElementById('contadorComponentes');
const botonCargarComponentes = document.getElementById('hiperbinComponents');
/*const ModalBotonCerrar = document.getElementById('BotonCerrarModal');*/

// Inicializa el modal de Bootstrap una sola vez.
const modalComponentes = new bootstrap.Modal(modalComponentesEl, {
  keyboard: false,
  backdrop:'static'
});

/*if (ModalBotonCerrar) {
  ModalBotonCerrar.addEventListener('click', function () {
    limpiarSeleccion();
    window.location.reload();
  });
}*/

// Escuchar el evento 'show.bs.modal' para resetear el estado del modal cada vez que se abre
modalComponentesEl.addEventListener('show.bs.modal', function () {
  // Limpiar el contador y el checkbox de "seleccionar todos" cada vez que se abra el modal
  document.getElementById('selectAllComponents').checked = false;
  contadorComponentes.textContent = '0';
  
  // OCULTAR EL NAVBAR/SIDEBAR PARA EVITAR QUE EL USUARIO SALGA DEL PROCESO
  const sidenavMain = document.getElementById('sidenav-main');
  if (sidenavMain) {
    sidenavMain.style.display = 'none';
    sidenavMain.style.visibility = 'hidden';
    sidenavMain.style.opacity = '0';
    sidenavMain.style.width = '0';
    sidenavMain.style.transition = 'all 0.3s ease';
  }
  
  // También ocultar el botón de toggle del navbar en móviles
  const filterToggle = document.getElementById('filter-toggle');
  if (filterToggle) {
    filterToggle.style.display = 'none';
  }
  
  // Ajustar el contenido principal para que ocupe todo el ancho
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.marginLeft = '0';
    mainContent.style.transition = 'margin-left 0.3s ease';
  }
});

// Escuchar el evento 'hidden.bs.modal' para restaurar el navbar cuando se cierre el modal
modalComponentesEl.addEventListener('hidden.bs.modal', function () {
  // MOSTRAR EL NAVBAR/SIDEBAR NUEVAMENTE
  const sidenavMain = document.getElementById('sidenav-main');
  if (sidenavMain) {
    sidenavMain.style.display = '';
    sidenavMain.style.visibility = '';
    sidenavMain.style.opacity = '';
    sidenavMain.style.width = '';
  }
  
  // Mostrar el botón de toggle del navbar en móviles
  const filterToggle = document.getElementById('filter-toggle');
  if (filterToggle) {
    filterToggle.style.display = '';
  }
  
  // Restaurar el margen del contenido principal
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.marginLeft = '';
  }
});

// Función para actualizar el contador de componentes seleccionados
function actualizarContador() {
  const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:checked:not([disabled])');
  const selectAllCheckbox = document.getElementById('selectAllComponents');

  contadorComponentes.textContent = checkboxes.length;

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
    const modulo = 'Creación Ticket';
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/SaveComponents`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    // **MOVER LA LÓGICA DEL CORREO AQUÍ**
                    const xhrEmail = new XMLHttpRequest();
                    xhrEmail.open(
                        "POST",
                        `${ENDPOINT_BASE}${APP_PATH}api/email/send_ticket2`
                    );
                    xhrEmail.setRequestHeader(
                        "Content-Type",
                        "application/x-www-form-urlencoded"
                    );

                    xhrEmail.onload = function () {
                        if (xhrEmail.status === 200) {
                            try {
                                const responseEmail = JSON.parse(xhrEmail.responseText);
                                console.log("📧 Respuesta del envío de correo (Nivel 2):", responseEmail);
                                
                                // Verificar si al menos un correo se envió exitosamente
                                const message = responseEmail.message || '';
                                const correoTecnicoEnviado = message.includes('Correo del técnico enviado');
                                
                                if (responseEmail.success || correoTecnicoEnviado) {
                                    // Obtener el número de ticket de la respuesta (ahora viene directamente en response.nro_ticket)
                                    const nroTicketEmail = response.nro_ticket || 
                                                          response.ticket_data?.nro_ticket || 
                                                          response.ticket_data?.Nr_ticket || 
                                                          response.ticket_data?.ticket_number ||
                                                          response.Nr_ticket || 
                                                          response.ticket_number || 
                                                          ticketId;
                                    
                                    // Mostrar notificación toast de éxito DESPUÉS de enviar ambos correos
                                    const emailToastDuration = 4000;
                                    setTimeout(() => {
                                        showLoadingOverlay("Enviando correo...");
                                        Swal.fire({
                                            icon: "success",
                                            title: "Correo Enviado",
                                            text: `Correo de notificación (Nivel 2) enviado exitosamente para el ticket #${nroTicketEmail} - Cliente: ${globalRazon} (${globalRif})`,
                                            showConfirmButton: false,
                                            confirmButtonText: "Cerrar",
                                            confirmButtonColor: "#003594",
                                            toast: true,
                                            position: 'top-end',
                                            color: 'black',
                                            timer: emailToastDuration, // Se cierra automáticamente en 5 segundos
                                            timerProgressBar: true
                                        });
                                        setTimeout(() => {
                                            hideLoadingOverlay();
                                            window.location.reload();
                                        }, emailToastDuration + 200);
                                    }, 500); // Delay de 500ms para que aparezca después del modal principal
                                } else {
                                    console.error("❌ Error al enviar correo (Nivel 2):", responseEmail.message);
                                    hideLoadingOverlay();
                                }
                            } catch (error) {
                                console.error("❌ Error al parsear respuesta del correo (Nivel 2):", error);
                                hideLoadingOverlay();
                            }
                        } else {
                            console.error("❌ Error al solicitar el envío de correo (Nivel 2):", xhrEmail.status);
                            hideLoadingOverlay();
                        }
                    };

                    xhrEmail.onerror = function () {
                        console.error("Error de red al solicitar el envío de correo.");
                        hideLoadingOverlay();
                    };
                    const paramsEmail = `id_user=${encodeURIComponent(id_user)}`; // Asegúrate de enviar el ID del usuario para el correo
                    xhrEmail.send(paramsEmail); // No necesitas enviar datos adicionales si tu backend ya tiene la información
                    // **FIN DE LA LÓGICA DEL CORREO**
                    
                    // Obtener el número de ticket de la respuesta (ahora viene directamente en response.nro_ticket)
                    const nroTicket = response.nro_ticket || 
                                     response.ticket_data?.nro_ticket || 
                                     response.ticket_data?.Nr_ticket || 
                                     response.ticket_data?.ticket_number ||
                                     response.Nr_ticket || 
                                     response.ticket_number || 
                                     ticketId;
                    
                    console.log(`📧 Componentes guardados para ticket: ${nroTicket}. Correo enviado.`);
                    
                    Swal.fire({
                        title: '¡Éxito!',
                        html: `Los componentes del Pos <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> han sido guardados correctamente.`,
                        icon: 'success',
                        showConfirmButton: false,
                        color: 'black',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        keydownListenerCapture: true,
                        timer: 3000, // Se cierra automáticamente en 3 segundos
                        timerProgressBar: true
                    }).then(() => {
                        modalComponentes.hide();
                        // Mostrar toast después de cerrar el modal - SOLO PARA COMPONENTES
                        setTimeout(() => {
                            showLoadingOverlay("Mostrando notificaciones...");
                            Swal.fire({
                                icon: "success",
                                title: "✅ Componentes Agregados",
                                text: `Componentes del POS ${serialPos} agregados exitosamente al ticket #${nroTicket}`,
                                showConfirmButton: false,
                                confirmButtonText: "Cerrar",
                                confirmButtonColor: "#003594",
                                toast: true,
                                position: 'top-end',
                                color: 'black',
                                timer: 3000, // Se cierra automáticamente en 4 segundos
                                timerProgressBar: true
                            });
                        }, 500); // Delay de 500ms después de cerrar el modal
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
    
    const dataToSend = `action=SaveComponents&ticketId=${ticketId}&serialPos=${serialPos}&selectedComponents=${encodeURIComponent(JSON.stringify(selectedComponents))}&id_user=${encodeURIComponent(id_user)}&modulo=${encodeURIComponent(modulo)}`;
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
                    const navbar = document.getElementById("sidenav-main");
                    if (navbar) {
                      navbar.style.display = "none";
                    }

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
                    text: 'Debes seleccionar al menos un componente nuevo para guardar. Si el usuario no tiene accesorios, selecciona al menos el componente "Equipo".',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#003594',
                });
                return;
            }
            guardarComponentesSeleccionados(ticketId, selectedComponents, serialPos);
        }

        // Event listener para el botón de cerrar el modal
        /*if (e.target && e.target.id === 'BotonCerrarModal') {
            modalComponentes.hide();
        }*/

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
    /*const modalCerrarComponnets = document.getElementById('BotonCerrarModal');*/
    const ticketId = boton.dataset.idTicket;
    const serialPos = boton.dataset.serialPos;

    const regionName = obtenerRegionName();

    if (!ticketId) {
        Swal.fire({
            title: 'Atención',
            text: 'No se pudo obtener el ID del ticket.',
            icon: 'warning',
            confirmButtonText: 'Ok',
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
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594',
        });
        return;
    }

    /*if(modalCerrarComponnets){
      modalCerrarComponnets.addEventListener('click', function() {
        modalComponentes.hide();
      });
    }*/
    showSelectComponentsModal(ticketId, regionName, serialPos);
}

// ========================================
// FUNCIONES DE COLA DE CORREOS
// ========================================

function processEmailQueue() {
    if (emailQueue.length === 0) {
        isProcessing = false;
        console.log("✅ Cola de correos vacía. Procesamiento detenido.");
        return;
    }

    isProcessing = true;
    const emailData = emailQueue[0]; // Tomar el primer correo de la cola

    console.log(`🔄 Procesando correo para ticket: ${emailData.ticketData.Nr_ticket}`);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/send_ticket2`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.timeout = 10000; // Timeout de 10 segundos

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    console.log(`✅ Correo enviado exitosamente para ticket: ${emailData.ticketData.Nr_ticket}`, response.message);
                    
                    // Mostrar notificación de éxito
                    if (typeof Swal !== "undefined") {
                        Swal.fire({
                            icon: "success",
                            title: "Correo Enviado",
                            text: `Correo de notificación enviado exitosamente para el ticket #${emailData.ticketData.Nr_ticket} - Cliente: ${globalRazon} (${globalRif})`,
                            timer: 3000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end',
                            color: 'black'
                        });
                    }
                } else {
                    console.error(`❌ Error al enviar correo para ticket ${emailData.ticketData.Nr_ticket}:`, response.message);
                }
            } catch (error) {
                console.error(`❌ Error al parsear respuesta de correo para ticket ${emailData.ticketData.Nr_ticket}:`, error);
            }
        } else {
            console.error(`❌ Error HTTP en envío de correo para ticket ${emailData.ticketData.Nr_ticket}:`, xhr.status);
        }

        // Remover el correo procesado de la cola
        emailQueue.shift();
        console.log(`📧 Correo removido de la cola. Restantes: ${emailQueue.length}`);
        
        // Procesar la siguiente solicitud en la cola
        if (emailQueue.length > 0) {
            // Pequeña pausa antes del siguiente correo (1 segundo)
            setTimeout(() => {
                processEmailQueue();
            }, 1000);
        } else {
            isProcessing = false;
            console.log("🎉 Todos los correos de la cola han sido procesados.");
        }
    };

    xhr.onerror = function() {
        console.error(`❌ Error de red al enviar correo para ticket ${emailData.ticketData.Nr_ticket}`);
        
        if (typeof Swal !== "undefined") {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: `No se pudo conectar con el servidor para enviar el correo del ticket #${emailData.ticketData.Nr_ticket}.`,
                color: 'black',
                timer: 5000,
                timerProgressBar: true
            });
        }
        
        // Remover el correo fallido de la cola
        emailQueue.shift();
        console.log(`📧 Correo fallido removido de la cola. Restantes: ${emailQueue.length}`);
        
        // Procesar la siguiente solicitud en la cola
        if (emailQueue.length > 0) {
            setTimeout(() => {
                processEmailQueue();
            }, 2000); // Pausa más larga en caso de error
        } else {
            isProcessing = false;
        }
    };

    xhr.ontimeout = function() {
        console.error(`⏰ Timeout al enviar correo para ticket ${emailData.ticketData.Nr_ticket}`);
        
        if (typeof Swal !== "undefined") {
            Swal.fire({
                icon: 'error',
                title: 'Tiempo de espera agotado',
                text: `La solicitud de envío de correo para el ticket #${emailData.ticketData.Nr_ticket} tomó demasiado tiempo.`,
                color: 'black',
                timer: 5000,
                timerProgressBar: true
            });
        }
        
        // Remover el correo fallido de la cola
        emailQueue.shift();
        console.log(`📧 Correo con timeout removido de la cola. Restantes: ${emailQueue.length}`);
        
        // Procesar la siguiente solicitud en la cola
        if (emailQueue.length > 0) {
            setTimeout(() => {
                processEmailQueue();
            }, 2000); // Pausa más larga en caso de timeout
        } else {
            isProcessing = false;
        }
    };
    
    const params = `id_user=${encodeURIComponent(emailData.id_user)}`;
    xhr.send(params);
}

// Función para mostrar el estado de la cola (opcional, para debugging)
function mostrarEstadoCola() {
    console.log(`📊 Estado de la cola de correos:`);
    console.log(`   - Correos en cola: ${emailQueue.length}`);
    console.log(`   - Procesando: ${isProcessing ? 'Sí' : 'No'}`);
    
    if (emailQueue.length > 0) {
        console.log(`   - Próximo correo: Ticket #${emailQueue[0].ticketData.Nr_ticket}`);
    }
    
    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: 'info',
            title: 'Estado de Cola de Correos',
            html: `
                <div style="text-align: left;">
                    <p><strong>Correos en cola:</strong> ${emailQueue.length}</p>
                    <p><strong>Procesando:</strong> ${isProcessing ? 'Sí' : 'No'}</p>
                    ${emailQueue.length > 0 ? `<p><strong>Próximo correo:</strong> Ticket #${emailQueue[0].ticketData.Nr_ticket}</p>` : ''}
                </div>
            `,
            color: 'black',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#003594'
        });
    }
}

// Exponer función globalmente para debugging (opcional)
window.mostrarEstadoCola = mostrarEstadoCola;
