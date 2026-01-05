let globalSerial = "";
let globalRif = "";
let globalRazon = "";
let globalEstatusPos = ""; // O null, dependiendo de cómo quieras inicializarla
// Variable global para controlar que el alerta de garantía se muestre solo una vez
let garantiaAlertShown = false;

// Variables para la cola de correos
let emailQueue = []; // Cola para almacenar las solicitudes de correo
let isProcessing = false; // Indicador de si se está procesando una solicitud

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
          
        }
      } catch (error) {
      }
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
        }
      };
      const basePath = typeof APP_PATH === 'string' ? APP_PATH : '/';
      const normalizedBase = basePath.endsWith('/') ? basePath : basePath + '/';
      img.src = normalizedBase + 'app/public/img/Nota_Entrega/INTELIGENSA.PNG';
    }
  } catch (logoErr) {
  }

  const noFileChosenStyle =
    "color: gray; font-style: italic; margin-left: 5px;";


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
      const file = this.files[0];
      if (file) {
        // IMPORTANTE: Guardar el archivo en una variable global para preservarlo
        window.archivoEnvioPreservado = file;
        console.log("Archivo de envío guardado globalmente:", file.name);
        
        fileChosenSpanEnvio.textContent = shortenFileName(file.name);
        fileChosenSpanEnvio.style.cssText =
          "margin-left: 15%; margin-top: -1%; font-size: 9px; display: block; position: absolute; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
      } else {
        window.archivoEnvioPreservado = null;
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
        !["application/pdf", "image/jpg", "image/png"].includes(file.type)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Alerta!",
          text: "Por favor, selecciona un archivo PDF, JPG o PNG.",
          color: "black",
        });
        this.value = "";
        fileChosenSpanExo.textContent = "";
        fileChosenSpanExo.style.cssText = noFileChosenStyle;
        // Limpiar también la variable global
        window.archivoExoneracionPreservado = null;
      } else if (file) {
        // IMPORTANTE: Guardar el archivo en una variable global para preservarlo
        window.archivoExoneracionPreservado = file;
        console.log("Archivo de exoneración guardado globalmente:", file.name);
        
        fileChosenSpanExo.textContent = shortenFileName(file.name);
        fileChosenSpanExo.style.cssText =
          "margin-left: 15%; margin-top: -1%; font-size: 9px; display: block; position: absolute; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
      } else {
        // Limpiar también la variable global
        window.archivoExoneracionPreservado = null;
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

  // Inicializar variables globales para preservar archivos
  window.archivoEnvioPreservado = null;
  window.archivoExoneracionPreservado = null;
  window.archivoAnticipoPreservado = null;
  
  // NOTA: Los event listeners para EnvioInput y ExoneracionInput ya están configurados arriba
  // (líneas ~170 y ~201) y ahora incluyen la preservación de archivos en variables globales.

  if (anticiInputFile) {
    anticiInputFile.addEventListener("change", function () {
      var file = this.files[0];
      if (
        file &&
        !["application/pdf", "image/jpg", "image/png"].includes(file.type)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Alerta!",
          text: "Por favor, selecciona un archivo PDF, JPG o PNG.",
          color: "black",
        });
        this.value = "";
        fileChosenSpanAntici.textContent = "";
        fileChosenSpanAntici.style.cssText = noFileChosenStyle;
        // Limpiar también la variable global
        window.archivoAnticipoPreservado = null;
        // Deshabilitar el botón si el archivo no es válido
        if (typeof updateAnticipoButtonState === "function") {
          updateAnticipoButtonState();
        }
      } else if (file) {
        // IMPORTANTE: Guardar el archivo en una variable global para preservarlo
        window.archivoAnticipoPreservado = file;
        console.log("Archivo de anticipo guardado globalmente:", file.name);
        
        fileChosenSpanAntici.textContent = shortenFileName(file.name);
        fileChosenSpanAntici.style.cssText =
          "margin-left: 45%; font-size: 9px; color: gray; position: absolute; display: block; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
        // Habilitar el botón cuando se carga un archivo válido
        if (typeof updateAnticipoButtonState === "function") {
          updateAnticipoButtonState();
        }
      } else {
        // Limpiar también la variable global
        window.archivoAnticipoPreservado = null;
        fileChosenSpanAntici.textContent = "";
        fileChosenSpanAntici.style.cssText = noFileChosenStyle;
        // Deshabilitar el botón si no hay archivo
        if (typeof updateAnticipoButtonState === "function") {
          updateAnticipoButtonState();
        }
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
    
    // Ocultar el icono de detalles de pago cuando se cierra el modal
    const iconoAgregarInfoContainer = document.getElementById("iconoAgregarInfoContainer");
    const iconoAgregarInfo = document.getElementById("iconoAgregarInfo");
    if (iconoAgregarInfoContainer) {
      iconoAgregarInfoContainer.style.display = "none";
    }
    if (iconoAgregarInfo) {
      iconoAgregarInfo.style.visibility = "hidden";
      iconoAgregarInfo.style.opacity = "0";
      iconoAgregarInfo.style.display = "none";
    }
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
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de seriales.";
      }
    } else {
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
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la respuesta de seriales.';
            }
        } else {
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
        }
      } catch (error) {
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de las fallas.";
      }
    } else {
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
            
            // Agregar event listener al select después de cargar las opciones
            select.addEventListener("change", function() {
              if (typeof updateDocumentTypeVisibility === 'function') {
                updateDocumentTypeVisibility();
              }
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
        }
      } catch (error) {
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de las fallas.";
      }
    } else {
      document.getElementById("rifMensaje").innerHTML +=
        "<br>Error de conexión con el servidor para las fallas.";
    }
  };

  const datos = `action=GetFailure2`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getFailure2);

// Función para manejar la visibilidad de Exoneración y Anticipo según la falla seleccionada
function updateDocumentTypeVisibility() {
  const fallaSelect2 = document.getElementById("FallaSelect2");
  const checkExoneracionContainer = document.getElementById("checkExoneracionContainer");
  const checkAnticipoContainer = document.getElementById("checkAnticipoContainer");
  
  if (!fallaSelect2 || !checkExoneracionContainer || !checkAnticipoContainer) {
    return;
  }
  
  const idFailure = fallaSelect2.value ? parseInt(fallaSelect2.value) : null;
  const isActualizacionSoftware = idFailure === 9;
  const isSinLlavesDukpt = idFailure === 12;
  const isFallaSinPago = isActualizacionSoftware || isSinLlavesDukpt;
  
  if (isFallaSinPago) {
    // Ocultar los radio buttons de Exoneración y Anticipo
    checkExoneracionContainer.style.display = 'none';
    checkAnticipoContainer.style.display = 'none';
    
    // Desmarcar los radio buttons si estaban seleccionados
    const checkExoneracion = document.getElementById("checkExoneracion");
    const checkAnticipo = document.getElementById("checkAnticipo");
    if (checkExoneracion) {
      checkExoneracion.checked = false;
    }
    if (checkAnticipo) {
      checkAnticipo.checked = false;
    }
    
    // Limpiar los archivos si estaban cargados
    const exoneracionInput = document.getElementById("ExoneracionInput");
    const anticipoInput = document.getElementById("AnticipoInput");
    if (exoneracionInput) {
      exoneracionInput.value = '';
    }
    if (anticipoInput) {
      anticipoInput.value = '';
    }
    
    // Limpiar archivos preservados globalmente
    window.archivoExoneracionPreservado = null;
    window.archivoAnticipoPreservado = null;
    
    // Ocultar botones de carga si estaban visibles
    const botonCargaExoneracion = document.getElementById("botonCargaExoneracion");
    const botonCargaAnticipo = document.getElementById("botonCargaAnticipo");
    if (botonCargaExoneracion) {
      botonCargaExoneracion.style.display = 'none';
    }
    if (botonCargaAnticipo) {
      botonCargaAnticipo.style.display = 'none';
    }
    
    // Actualizar visibilidad del icono de detalles de pago
    if (typeof updateIconoAgregarInfoVisibility === 'function') {
      updateIconoAgregarInfoVisibility();
    }
  } else {
    // Mostrar los radio buttons si no es Actualización de Software ni Sin Llaves/Dukpt Vacío
    checkExoneracionContainer.style.display = '';
    checkAnticipoContainer.style.display = '';
  }
  
  // Actualizar UpdateGuarantees para recalcular el id_status_payment
  if (typeof UpdateGuarantees === 'function') {
    UpdateGuarantees();
  }
}

// Agregar event listener al FallaSelect2 cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
  const fallaSelect2 = document.getElementById("FallaSelect2");
  if (fallaSelect2) {
    fallaSelect2.addEventListener("change", updateDocumentTypeVisibility);
  }
});


/**
 * Realiza una solicitud AJAX para obtener el estatus de un pago
 * y lo muestra en el campo de texto con id="estatus".
 *
 * NOTA: Asume que el backend (GetEstatusPago) devolverá un JSON
 * con una propiedad 'estatus_pago' (o similar) en caso de éxito.
 */

/**
 * Realiza una solicitud AJAX para obtener el estatus de un pago
 * y lo muestra en el campo de texto con id="estatus".
 */

function getPagoEstatus() {
    const estatusInput = document.getElementById("estatus");
    const paymentIdInput = document.getElementById("payment_id_to_save"); // <-- Nuevo elemento

    if (!estatusInput || !paymentIdInput) { // Verificar ambos
        console.error("Error: Elementos necesarios para el estatus no encontrados.");
        return;
    }
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetEstatusPago`); 
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    if (
                        Array.isArray(response.estatus_pago) &&
                        response.estatus_pago.length > 0
                    ) {
                        const pagoData = response.estatus_pago[0];
                        
                        // 1. Guardar el ID del pago en el campo oculto
                        paymentIdInput.value = pagoData.id_status_payment; // <-- Guardando el ID
                        
                        // 2. Mostrar el nombre del estatus en el campo visible
                        estatusInput.value = pagoData.name_status_payment;
                        
                        console.log("ID del Pago cargado en campo oculto:", pagoData.id_status_payment);
                    } else {
                        estatusInput.value = 'Estatus no encontrado en la respuesta.';
                    }
                } else {
                    estatusInput.value = 'Error al obtener estatus (API: false)';
                }
            } catch (error) {
                console.error("Error al procesar la respuesta JSON:", error);
                estatusInput.value = 'Error de procesamiento de datos.';
            }
        } else {
            estatusInput.value = `Error de conexión (HTTP ${xhr.status})`;
        }
    };
    const datos = `action=GetEstatusPago`; 
    // Nota: Si GetEstatusPago requiere un parámetro (como el ID del usuario o referencia), debes agregarlo a 'datos'
    xhr.send(datos);
}

// Ejemplo de cómo se llamaría:
// document.addEventListener("DOMContentLoaded", getPagoEstatus);

// 6. Llama a la función para cargar el estatus cuando la página se cargue
document.addEventListener("DOMContentLoaded", getPagoEstatus);

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
        }
      } catch (error) {
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de los Coordinadores.";
      }
    } else {
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
        }
      } catch (error) {
        document.getElementById("rifMensaje").innerHTML +=
          "<br>Error al procesar la respuesta de las Coordinaciones.";
      }
    } else {
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
      }
    } else {
      mensajeDiv.innerHTML +=
        "<br>Error de conexión con el servidor para seriales.";
    }
  };

  xhr.onerror = function () {
    document.getElementById("rifMensaje").innerHTML +=
      "<br>Error de red al intentar obtener los seriales.";
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
          }
        } else {
          Swal.fire({
            title: "Error",
            text: "Error al obtener la fecha del último ticket.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
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
        Swal.fire({
          title: "Error",
          text: "Error en la solicitud de la fecha del último ticket.",
          icon: "error",
          confirmButtonText: "OK",
          color: "black",
        });
      }
    } else {
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
        }
      } catch (error) {
        document.getElementById("InputFechaInstall").value = "No disponible";
        fechaInstalacionGlobal = null;
        validarGarantiaInstalacion("No disponible");
      }
    } else if (xhr.status === 400) {
      try {
        const response = JSON.parse(xhr.responseText);
        document.getElementById("InputFechaInstall").value = "No disponible";
        fechaInstalacionGlobal = null;
        validarGarantiaInstalacion("No disponible");
        // Puedes mostrar un mensaje al usuario si lo deseas, por ejemplo, con Swal.fire()
      } catch (error) {
        document.getElementById("InputFechaInstall").value = "No disponible";
        fechaInstalacionGlobal = null;
        validarGarantiaInstalacion("No disponible");
      }
    } else {
      document.getElementById("InputFechaInstall").value = "No disponible";
      fechaInstalacionGlobal = null;
      validarGarantiaInstalacion("No disponible");
    }
  };

  xhr.onerror = function () {
    document.getElementById("InputFechaInstall").value = "No disponible";
    fechaInstalacionGlobal = null;
    validarGarantiaInstalacion("No disponible");
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

  // Verificar si es "Actualización de Software" (id_failure = 9) o "Sin Llaves/Dukpt Vacío" (id_failure = 12)
  const fallaSelect2 = document.getElementById("FallaSelect2");
  const idFailure = fallaSelect2 ? parseInt(fallaSelect2.value) : null;
  const isActualizacionSoftware = idFailure === 9;
  const isSinLlavesDukpt = idFailure === 12;
  const isFallaSinPago = isActualizacionSoftware || isSinLlavesDukpt;

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
  
  // Si es "Actualización de Software" o "Sin Llaves/Dukpt Vacío", manejar lógica especial
  if (isFallaSinPago) {
    if (uploadNowRadio && uploadNowRadio.checked) {
      const tieneEnvio = checkEnvio && checkEnvio.checked && archivoEnvio;
      
      if (tieneEnvio) {
        // Si se carga SOLO el documento de envío
        idStatusPayment = 16; // No necesita anticipo o exoneración por el tipo de falla
      } else {
        // Si NO se carga el documento de envío (sin importar si hay otros documentos o no)
        idStatusPayment = 11; // Pendiente Por Cargar Documento(PDF Envio ZOOM)
      }
    } else {
      // Si no se carga ningún documento ahora (uploadPendingRadio) o no se selecciona opción
      // Para Actualización de Software, siempre se necesita el envío, así que es 11
      idStatusPayment = 11; // Pendiente Por Cargar Documento(PDF Envio ZOOM)
    }
    return idStatusPayment;
  }

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
                }
            } catch (error) {
            }
        } else {
        }
    };

    xhrSucursales.onerror = function() {
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
    // Ocultar el contenedor del botón de exoneración, no el botón directamente
    const botonCargaExoneracion = document.getElementById("botonCargaExoneracion");
    if (botonCargaExoneracion) {
      botonCargaExoneracion.style.display = "none";
    }
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
});

function verificarPagoExisteHoy(serial_pos) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/CheckPaymentExistsToday`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    const data = `action=CheckPaymentExistsToday&serial_pos=${encodeURIComponent(serial_pos)}`;
    
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            resolve(response.exists);
          } else {
            resolve(false);
          }
        } catch (e) {
          console.error("Error al parsear respuesta:", e);
          resolve(false);
        }
      } else {
        console.error("Error en la petición:", xhr.status);
        resolve(false);
      }
    };

    xhr.onerror = function () {
      console.error("Error de red al verificar pago");
      resolve(false);
    };

    xhr.send(data);
  });
}

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

  // Guardar los archivos ANTES de cualquier validación que pueda afectar el estado
  // IMPORTANTE: Leer los archivos INMEDIATAMENTE al inicio de la función, antes de cualquier otra operación
  // PRIORIDAD: Usar archivos preservados globalmente primero, luego intentar leer del input
  
  // Para Envío
  let archivoEnvio = window.archivoEnvioPreservado || null;
  if (!archivoEnvio && inputEnvio && inputEnvio.files && inputEnvio.files.length > 0) {
    archivoEnvio = inputEnvio.files[0];
    window.archivoEnvioPreservado = archivoEnvio;
  }
  
  // Para Exoneración
  let archivoExoneracion = window.archivoExoneracionPreservado || null;
  if (!archivoExoneracion && inputExoneracion && inputExoneracion.files && inputExoneracion.files.length > 0) {
    archivoExoneracion = inputExoneracion.files[0];
    window.archivoExoneracionPreservado = archivoExoneracion;
  }
  
  // Para Anticipo, verificar de múltiples formas porque puede perderse
  let archivoAnticipo = null;
  
  // PRIORIDAD 1: Intentar usar el archivo preservado globalmente (más confiable)
  if (window.archivoAnticipoPreservado) {
    archivoAnticipo = window.archivoAnticipoPreservado;
    console.log("Usando archivo de anticipo preservado globalmente:", archivoAnticipo.name);
  }
  
  // PRIORIDAD 2: Si no hay archivo preservado, intentar leer del input
  if (!archivoAnticipo && inputAnticipo) {
    // Primero intentar leer del files array
    if (inputAnticipo.files && inputAnticipo.files.length > 0) {
      archivoAnticipo = inputAnticipo.files[0];
      // Guardar en la variable global para futuras referencias
      window.archivoAnticipoPreservado = archivoAnticipo;
    }
    // Si no hay archivo pero el input tiene valor, el archivo podría estar ahí
    if (!archivoAnticipo && inputAnticipo.value) {
      // Intentar leer de nuevo
      if (inputAnticipo.files && inputAnticipo.files.length > 0) {
        archivoAnticipo = inputAnticipo.files[0];
        window.archivoAnticipoPreservado = archivoAnticipo;
      }
    }
  }
  
  // Debug: Verificar que los archivos se guardaron correctamente
  console.log("DEBUG SendDataFailure2 - Archivos guardados:", {
    archivoEnvio: archivoEnvio ? archivoEnvio.name : null,
    archivoExoneracion: archivoExoneracion ? archivoExoneracion.name : null,
    archivoAnticipo: archivoAnticipo ? archivoAnticipo.name : "NO HAY ARCHIVO",
    inputAnticipoValue: inputAnticipo ? inputAnticipo.value : "NO HAY VALOR",
    inputAnticipoFilesLength: inputAnticipo && inputAnticipo.files ? inputAnticipo.files.length : 0,
    checkAnticipo: document.getElementById("checkAnticipo") ? document.getElementById("checkAnticipo").checked : false,
    inputAnticipoExists: !!inputAnticipo
  });
  
  // ADVERTENCIA: Si el checkbox está marcado pero no hay archivo, alertar
  const checkAnticipo = document.getElementById("checkAnticipo");
  if (checkAnticipo && checkAnticipo.checked && !archivoAnticipo) {
    console.error("ADVERTENCIA CRÍTICA: El checkbox de Anticipo está marcado pero NO se detectó el archivo. Esto puede causar problemas en la validación.");
  }
  
  // EJECUTAR VALIDACIONES ANTES DE CONTINUAR
  if (!validateTicketCreation()) {
    return; // Detener la ejecución si hay errores - los archivos ya están guardados en las variables
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
        hideExportLoading();
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
      hideExportLoading();
      // continuarCreacionTicket() ahora es async
      // Pasar los archivos guardados como parámetros para preservarlos
      continuarCreacionTicket(archivoEnvio, archivoExoneracion, archivoAnticipo).catch((error) => {
        console.error("Error en continuarCreacionTicket:", error);
      });
    })
    .catch((error) => {
      hideExportLoading(); // Ensure loading is hidden on error
      Swal.fire({
        icon: "error",
        title: "Error de Verificación",
        text: "No se pudo verificar si existe un ticket en proceso. Por favor, intente nuevamente.",
        color: "black",
      });
    });

  // Función que continúa con la creación del ticket
  async function continuarCreacionTicket(archivoEnvioGuardado, archivoExoneracionGuardado, archivoAnticipoGuardado) {
    // NUEVO: Agregar información de documentos cargados
    const checkEnvio = document.getElementById("checkEnvio");
    const checkExoneracion = document.getElementById("checkExoneracion");
    const checkAnticipo = document.getElementById("checkAnticipo");
    
    // Usar los archivos guardados que se pasaron como parámetros, o intentar leerlos del DOM como respaldo
    const inputAnticipo = document.getElementById("AnticipoInput");
    
    // PRIORIDAD: Usar el archivo guardado primero (viene de SendDataFailure2 antes de cualquier validación)
    let archivoAnticipoActual = archivoAnticipoGuardado;
    
    // Si no hay archivo guardado, intentar leerlo del DOM como respaldo
    if (!archivoAnticipoActual && inputAnticipo) {
      if (inputAnticipo.files && inputAnticipo.files.length > 0) {
        archivoAnticipoActual = inputAnticipo.files[0];
      }
      // También verificar el valor del input como último recurso
      if (!archivoAnticipoActual && inputAnticipo.value) {
        console.warn("ADVERTENCIA: Input tiene valor pero no se detecta el archivo. Valor:", inputAnticipo.value);
      }
    }
    
    const tieneAnticipoCargado = checkAnticipo && checkAnticipo.checked && archivoAnticipoActual;
    
    // Debug mejorado: Log para verificar el estado
    console.log("DEBUG continuarCreacionTicket:", {
      checkAnticipoChecked: checkAnticipo ? checkAnticipo.checked : false,
      archivoAnticipoGuardado: archivoAnticipoGuardado ? archivoAnticipoGuardado.name : null,
      inputAnticipoValue: inputAnticipo ? inputAnticipo.value : null,
      inputAnticipoFilesLength: inputAnticipo && inputAnticipo.files ? inputAnticipo.files.length : 0,
      archivoAnticipoActual: archivoAnticipoActual ? archivoAnticipoActual.name : null,
      tieneAnticipoCargado: tieneAnticipoCargado
    });
    
    // Debug mejorado: Log para verificar el estado
    console.log("DEBUG continuarCreacionTicket:", {
      checkAnticipoChecked: checkAnticipo ? checkAnticipo.checked : false,
      archivoAnticipoGuardado: archivoAnticipoGuardado ? archivoAnticipoGuardado.name : "NO HAY ARCHIVO GUARDADO",
      inputAnticipoValue: inputAnticipo ? inputAnticipo.value : null,
      inputAnticipoFilesLength: inputAnticipo && inputAnticipo.files ? inputAnticipo.files.length : 0,
      archivoAnticipoActual: archivoAnticipoActual ? archivoAnticipoActual.name : "NO HAY ARCHIVO ACTUAL",
      tieneAnticipoCargado: tieneAnticipoCargado
    });
    
    // Obtener uploadNowRadio dentro de la función para asegurar que esté disponible
    const uploadNowRadioLocal = document.getElementById("uploadNow");
    
    // VALIDACIÓN: Verificar relación entre anticipo y detalles de pago
    // Solo validar si se seleccionó "Sí" para cargar documentos ahora
    // EXCEPCIÓN: Si es "Actualización de Software" (id_failure = 9) o "Sin Llaves/Dukpt Vacío" (id_failure = 12), NO se requiere anticipo ni detalles de pago
    const fallaSelect2 = document.getElementById("FallaSelect2");
    const idFailure = fallaSelect2 ? parseInt(fallaSelect2.value) : null;
    const isActualizacionSoftware = idFailure === 9;
    const isSinLlavesDukpt = idFailure === 12;
    const isFallaSinPago = isActualizacionSoftware || isSinLlavesDukpt;
    
    if (uploadNowRadioLocal && uploadNowRadioLocal.checked && !isFallaSinPago) {
      // Verificar si hay pago registrado hoy para este serial en la tabla temporal
      const existePago = await verificarPagoExisteHoy(serial);
      
      // CASO 1: Anticipo cargado PERO NO hay detalles de pago registrados
      if (tieneAnticipoCargado && !existePago) {
        Swal.fire({
          icon: "warning",
          title: "<strong style='font-size: 24px; color: #d9534f;'>Detalles de Pago Requeridos</strong>",
          html: `
            <div style="text-align: center; padding: 10px 0;">
              <p style="font-size: 16px; color: #333; margin-bottom: 15px; line-height: 1.6;">
                Ha cargado el documento de <strong>Anticipo</strong>, pero aún no ha registrado los detalles del pago.
              </p>
              <p style="font-size: 15px; color: #666; margin-bottom: 20px;">
                Por favor, haga clic en el icono <span style="color: #003594;">📋</span> <strong>"Detalles de Pago"</strong> 
                para registrar la información del anticipo antes de guardar el ticket.
              </p>
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>⚠️ Importante:</strong> El ticket no se puede crear sin los detalles del pago cuando el documento de anticipo está cargado.
                </p>
              </div>
            </div>
          `,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#003594",
          confirmButtonClass: "swal2-confirm-custom",
          width: "600px",
          padding: "2rem",
          customClass: {
            popup: "swal2-popup-custom",
            title: "swal2-title-custom",
            htmlContainer: "swal2-html-custom"
          },
          color: "#333",
          background: "#ffffff",
          backdrop: "rgba(0, 0, 0, 0.4)"
        });
        return; // Detener la ejecución
      }
      
      // CASO 2: NO hay anticipo cargado PERO SÍ hay detalles de pago registrados
      if (!tieneAnticipoCargado && existePago) {
        // Debug adicional antes de mostrar el error
        console.error("ERROR: Se detectó pago pero NO anticipo. Estado completo:", {
          checkAnticipoChecked: checkAnticipo ? checkAnticipo.checked : false,
          archivoAnticipoGuardado: archivoAnticipoGuardado ? archivoAnticipoGuardado.name : "NO HAY ARCHIVO GUARDADO",
          inputAnticipoValue: inputAnticipo ? inputAnticipo.value : "NO HAY VALOR",
          inputAnticipoFiles: inputAnticipo && inputAnticipo.files ? inputAnticipo.files.length : 0,
          archivoAnticipoActual: archivoAnticipoActual ? archivoAnticipoActual.name : "NO HAY ARCHIVO ACTUAL",
          tieneAnticipoCargado: tieneAnticipoCargado,
          existePago: existePago
        });
        
        Swal.fire({
          icon: "warning",
          title: "<strong style='font-size: 24px; color: #d9534f;'>Documento de Anticipo Requerido</strong>",
          html: `
            <div style="text-align: center; padding: 10px 0;">
              <p style="font-size: 16px; color: #333; margin-bottom: 15px; line-height: 1.6;">
                Ha registrado los <strong>detalles del pago</strong>, pero aún no ha cargado el documento de <strong>Anticipo</strong>.
              </p>
              <p style="font-size: 15px; color: #666; margin-bottom: 20px;">
                Por favor, haga clic en el botón <span style="color: #003594;">📄</span> <strong>"Adjunte Documento Anticipo"</strong> 
                para cargar el documento correspondiente antes de guardar el ticket.
              </p>
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>⚠️ Importante:</strong> El ticket no se puede crear sin el documento de anticipo cuando los detalles del pago están registrados.
                </p>
              </div>
            </div>
          `,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#003594",
          confirmButtonClass: "swal2-confirm-custom",
          width: "600px",
          padding: "2rem",
          customClass: {
            popup: "swal2-popup-custom",
            title: "swal2-title-custom",
            htmlContainer: "swal2-html-custom"
          },
          color: "#333",
          background: "#ffffff",
          backdrop: "rgba(0, 0, 0, 0.4)"
        });
        return; // Detener la ejecución
      }
    }

    // Crear FormData
    // El id_status_payment ya fue calculado en UpdateGuarantees() y pasado como parámetro
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

    // Usar uploadNowRadioLocal que se obtuvo al inicio de la función
    if (uploadNowRadioLocal && uploadNowRadioLocal.checked) {
      // Documentos que se están cargando ahora
      // Usar los archivos guardados que se pasaron como parámetros, o los preservados globalmente
      const archivoEnvioFinal = archivoEnvioGuardado || window.archivoEnvioPreservado || null;
      if (checkEnvio && checkEnvio.checked && archivoEnvioFinal) {
        formData.append("archivoEnvio", archivoEnvioFinal);
        formData.append("documento_envio", "Sí"); // NUEVO: Marcar que se cargó envío
      }
      
      const archivoExoneracionFinal = archivoExoneracionGuardado || window.archivoExoneracionPreservado || null;
      if (checkExoneracion && checkExoneracion.checked && archivoExoneracionFinal) {
        formData.append("archivoExoneracion", archivoExoneracionFinal);
        formData.append("documento_exoneracion", "Sí"); // NUEVO: Marcar que se cargó exoneración
      }
      
      // Usar archivoAnticipoActual que puede venir del parámetro, del preservado globalmente, o del DOM
      const archivoAnticipoFinal = archivoAnticipoActual || archivoAnticipoGuardado || window.archivoAnticipoPreservado || null;
      if (checkAnticipo && checkAnticipo.checked && archivoAnticipoFinal) {
        formData.append("archivoAnticipo", archivoAnticipoFinal);
        formData.append("documento_anticipo", "Sí"); // NUEVO: Marcar que se cargó anticipo
      }
    }

    formData.append("action", "SaveDataFalla2");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SaveDataFalla2`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        // ⚠️ FIX: OCULTAR EL OVERLAY GLOBAL INMEDIATAMENTE DESPUÉS DEL ÉXITO DE LA XHR
        if (typeof window.hideLoadingOverlay === 'function') {
          window.hideLoadingOverlay(true); 
        }
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            // NOTA: El correo se enviará después de guardar componentes (si se asocian) o al cerrar el modal (si no se asocian)
            // Esto evita que se envíe dos veces

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
                const navbar = document.getElementById("sidenav-main");
                if (navbar) {
                  navbar.style.display = "none";
                }
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
            // Enviar correo cuando el usuario cierra el modal sin asociar componentes
            setTimeout(() => {
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
                    const message = responseEmail.message || '';
                    const correoTecnicoEnviado = message.includes('Correo del técnico enviado');
                    if (responseEmail.success || correoTecnicoEnviado) {
                      console.log("✅ Correo enviado exitosamente");
                    } else {
                      console.error("❌ Error al enviar correo (Nivel 2):", responseEmail.message);
                    }
                  } catch (error) {
                    console.error("❌ Error al parsear respuesta del correo (Nivel 2):", error);
                  }
                }
              };
              xhrEmail.onerror = function () {
                console.error("Error de red al solicitar el envío de correo.");
              };
              const paramsEmail = `id_user=${encodeURIComponent(id_user)}`;
              xhrEmail.send(paramsEmail);
            }, 500);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
              $("#miModal").css("display", "none");
              
            const ticketId = ticketData.id_ticket_creado;
            const serialPos = ticketData.serial;
            
            abrirModalComponentes({
              dataset: {
                idTicket: ticketId,
                serialPos: serialPos
              }
            });
            // El correo se enviará después del toast de componentes (en guardarComponentesSeleccionados)
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
            Swal.fire({
              icon: "error",
              title: "Error interno del servidor",
              text: "Ocurrió un error inesperado en el servidor al intentar guardar los datos. Por favor, contacte a soporte.",
              color: "black",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: `Ocurrió un error al comunicarse con el servidor. Código de estado: ${xhr.status}.`,
            color: "black",
          });
        }
      };
      xhr.onerror = function () {
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
    
    // Obtener los botones de carga para verificar su visibilidad
    const botonCargaPDFEnv = document.getElementById('botonCargaPDFEnv');
    const botonCargaExoneracion = document.getElementById('botonCargaExoneracion');
    const botonCargaAnticipo = document.getElementById('botonCargaAnticipo');
    
    const uploadNowRadio = document.getElementById('uploadNow');
    
    // Si no se eligió "Cargar ahora", no hay validaciones de archivos
    if (!uploadNowRadio || !uploadNowRadio.checked) {
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
    
    // NUEVA VALIDACIÓN: Verificar visibilidad de botones y requerir archivos correspondientes
    // Si el botón está visible, el archivo debe estar cargado
    
    // Función auxiliar para verificar si un elemento está visible
    function isElementVisible(element) {
        if (!element) return false;
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               element.offsetWidth > 0 && 
               element.offsetHeight > 0;
    }
    
    // Validar Envío: Si el botón está visible, debe haber archivo
    if (isElementVisible(botonCargaPDFEnv)) {
        const tieneArchivoEnvio = inputEnvio && inputEnvio.files && inputEnvio.files.length > 0;
        // También verificar el archivo preservado globalmente
        const archivoEnvioPreservado = window.archivoEnvioPreservado || null;
        if (!tieneArchivoEnvio && !archivoEnvioPreservado) {
        Swal.fire({
            icon: "warning",
            title: "Campo requerido",
                text: "Por favor, seleccione el Documento de Envío después de marcar \"Cargar De Envío\".",
            color: "black",
            confirmButtonText: "OK",
            confirmButtonColor: "#003594",
        });
        return false;
        }
    }
    
    // Validar Exoneración: Si el botón está visible, debe haber archivo
    if (isElementVisible(botonCargaExoneracion)) {
        const tieneArchivoExoneracion = inputExoneracion && inputExoneracion.files && inputExoneracion.files.length > 0;
        // También verificar el archivo preservado globalmente
        const archivoExoneracionPreservado = window.archivoExoneracionPreservado || null;
        if (!tieneArchivoExoneracion && !archivoExoneracionPreservado) {
        Swal.fire({
            icon: "warning",
            title: "Campo requerido",
                text: "Por favor, seleccione el Documento de Exoneración después de marcar \"Cargar De Exoneración\".",
            color: "black",
            confirmButtonText: "OK",
            confirmButtonColor: "#003594",
        });
        return false;
        }
    }
    
    // Validar Anticipo: Si el botón está visible, debe haber archivo
    // NOTA: La validación completa de Anticipo (con pago) se hace en continuarCreacionTicket()
    // Pero aquí validamos que si el botón está visible, el archivo debe estar cargado
    // EXCEPCIÓN: Si es "Actualización de Software" (id_failure = 9) o "Sin Llaves/Dukpt Vacío" (id_failure = 12), NO se requiere anticipo
    const fallaSelect2 = document.getElementById("FallaSelect2");
    const idFailure = fallaSelect2 ? parseInt(fallaSelect2.value) : null;
    const isActualizacionSoftware = idFailure === 9;
    const isSinLlavesDukpt = idFailure === 12;
    const isFallaSinPago = isActualizacionSoftware || isSinLlavesDukpt;
    
    if (!isFallaSinPago && isElementVisible(botonCargaAnticipo)) {
        const tieneArchivoAnticipo = inputAnticipo && inputAnticipo.files && inputAnticipo.files.length > 0;
        // También verificar el archivo preservado globalmente
        const archivoAnticipoPreservado = window.archivoAnticipoPreservado || null;
        if (!tieneArchivoAnticipo && !archivoAnticipoPreservado) {
        Swal.fire({
            icon: "warning",
            title: "Campo requerido",
                text: "Por favor, seleccione el Documento de Anticipo después de marcar \"Cargar De Anticipo\".",
            color: "black",
            confirmButtonText: "OK",
            confirmButtonColor: "#003594",
        });
        return false;
        }
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
    
    // NO validar tipo de archivo de Anticipo aquí - se valida en continuarCreacionTicket()
    // La validación de Anticipo se hace después de verificar si existe el pago en la tabla temporal
    
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

  // Referencias adicionales
  const iconoAgregarInfo = document.getElementById("iconoAgregarInfo");
  const iconoAgregarInfoContainer = document.getElementById("iconoAgregarInfoContainer");
  const modalAgregarDatosPago = document.getElementById("modalAgregarDatosPago");
  const btnCancelarModalPago = document.getElementById("btnCancelarModalPago");
  const btnCancelarModalPagoFooter = document.getElementById("btnCancelarModalPagoFooter");
  const disabledTooltipAnticipo = document.getElementById("disabledTooltipAnticipo");

  // Función para actualizar la visibilidad del icono de agregar información
  // El icono aparece cuando "Anticipo" está seleccionado Y "Sí" está marcado en "¿Deseas cargar los documentos ahora?"
  function updateIconoAgregarInfoVisibility() {
    // Verificar que todos los elementos existan
    if (!iconoAgregarInfoContainer || !checkAnticipo || !uploadNowRadio || !checkEnvio || !checkExoneracion) {
      return;
    }
    
      // El icono aparece cuando:
      // 1. El radio "Sí" está marcado (uploadNowRadio.checked)
    // 2. El checkbox "Anticipo" está seleccionado (checkAnticipo.checked)
    // 3. El checkbox "Exoneración" NO está seleccionado (checkExoneracion.checked === false)
    // NOTA: "Envío" puede estar seleccionado junto con "Anticipo", no afecta la visibilidad del icono
    // El icono solo se oculta si se selecciona "Exoneración"
    const debeMostrarIcono = uploadNowRadio.checked && 
                              checkAnticipo.checked && 
                              !checkExoneracion.checked;
    
    if (debeMostrarIcono) {
        iconoAgregarInfoContainer.style.display = "block";
        if (iconoAgregarInfo) {
          iconoAgregarInfo.style.visibility = "visible";
          iconoAgregarInfo.style.opacity = "1";
          iconoAgregarInfo.style.pointerEvents = "auto";
          iconoAgregarInfo.style.display = "inline-block";
        }
      } else {
        iconoAgregarInfoContainer.style.display = "none";
        if (iconoAgregarInfo) {
          iconoAgregarInfo.style.visibility = "hidden";
          iconoAgregarInfo.style.opacity = "0";
          iconoAgregarInfo.style.display = "none";
      }
    }
  }

  // Función para actualizar el estado del botón de anticipo
  function updateAnticipoButtonState() {
    if (downloadAnticiBtn && anticipoInput) {
      // Mantener el botón siempre habilitado
        downloadAnticiBtn.disabled = false;
        downloadAnticiBtn.style.opacity = "1";
        downloadAnticiBtn.style.cursor = "pointer";
        if (disabledTooltipAnticipo) {
          disabledTooltipAnticipo.style.display = "none";
      }
    }
  }

  // Función para actualizar la visibilidad de las opciones de carga de documentos (checkboxes y sus botones)
  function updateDocumentUploadVisibility() {
    if (uploadNowRadio.checked) {
      documentUploadOptions.style.display = "block";
      // Llamar a esta función para actualizar la visibilidad de los botones individuales
      updateFileUploadButtonVisibility();
      // Actualizar la visibilidad del icono (aparece cuando Anticipo está seleccionado)
      updateIconoAgregarInfoVisibility();
    } else {
      documentUploadOptions.style.display = "none";
      // Ocultar el icono cuando se selecciona "No"
      if (iconoAgregarInfoContainer) {
        iconoAgregarInfoContainer.style.display = "none";
      }
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
      // El botón de anticipo siempre permanece habilitado
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
    const uploadNowChecked = uploadNowRadio ? uploadNowRadio.checked : false;
    
    if (botonCargaPDFEnv) {
    botonCargaPDFEnv.style.display =
        uploadNowChecked && checkEnvio && checkEnvio.checked ? "flex" : "none";
    }
    if (botonCargaExoneracion) {
      const exoneracionChecked = checkExoneracion ? checkExoneracion.checked : false;
    botonCargaExoneracion.style.display =
        uploadNowChecked && exoneracionChecked ? "flex" : "none";
    }
    if (botonCargaAnticipo) {
    botonCargaAnticipo.style.display =
        uploadNowChecked && checkAnticipo && checkAnticipo.checked ? "flex" : "none";
    }
    
    // Actualizar el estado del botón de anticipo cuando se muestra (siempre habilitado)
    if (uploadNowRadio.checked && checkAnticipo.checked) {
      // El botón siempre permanece habilitado
          updateAnticipoButtonState();
      } else {
      // Si no se muestra, el botón sigue habilitado pero oculto
      if (downloadAnticiBtn) {
        // Mantener habilitado siempre
        downloadAnticiBtn.disabled = false;
        downloadAnticiBtn.style.opacity = "0.6";
        downloadAnticiBtn.style.cursor = "not-allowed";
        if (disabledTooltipAnticipo) {
          disabledTooltipAnticipo.style.display = "block";
        }
      }
    }
    
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
        // Deshabilitar el botón cuando se deselecciona
        updateAnticipoButtonState();
    }
  }

// NUEVA FUNCIÓN: Limpiar input de archivo
function clearFileInput(inputId) {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
        fileInput.value = "";
        // Limpiar también las variables globales correspondientes
        if (typeof window !== 'undefined') {
            if (inputId === "EnvioInput") {
                window.archivoEnvioPreservado = null;
            } else if (inputId === "ExoneracionInput") {
                window.archivoExoneracionPreservado = null;
            } else if (inputId === "AnticipoInput") {
                window.archivoAnticipoPreservado = null;
            }
        }
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
    // Actualizar visibilidad del icono cuando cambia Envío (se oculta si se selecciona Envío)
    updateIconoAgregarInfoVisibility();
    
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
        clearFileInput("EnvioInput");
        clearFileSpan(fileChosenSpanEnvio);
        // Verificar nuevamente si el icono debe mostrarse después de deseleccionar
        updateIconoAgregarInfoVisibility();
    }
});

if (checkExoneracion) {
checkExoneracion.addEventListener("change", function() {
        console.warn("checkExoneracion cambiado. checked:", this.checked, "uploadNowRadio.checked:", uploadNowRadio ? uploadNowRadio.checked : "undefined");
    updateFileUploadButtonVisibility();
        // Actualizar visibilidad del icono cuando cambia Exoneración (se oculta si se selecciona Exoneración, se muestra si se deselecciona y solo Anticipo está seleccionado)
        updateIconoAgregarInfoVisibility();
    
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
        clearFileInput("ExoneracionInput");
        clearFileSpan(fileChosenSpanExo);
            // Verificar nuevamente si el icono debe mostrarse después de deseleccionar
            updateIconoAgregarInfoVisibility();
    }
});
}

  checkAnticipo.addEventListener("change", function() {
    updateFileUploadButtonVisibility();
    
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
        clearFileInput("AnticipoInput");
        clearFileSpan(fileChosenSpanAntici);
        if (typeof updateAnticipoButtonState === "function") {
          updateAnticipoButtonState();
        }
    } else {
      // Si se selecciona, mostrar el botón pero deshabilitado hasta que se cargue un archivo
      if (typeof updateAnticipoButtonState === "function") {
        updateAnticipoButtonState();
      }
    }
    
    // Actualizar la visibilidad del icono cuando se selecciona/deselecciona Anticipo
    // Usar setTimeout para asegurar que el estado se actualice después de que el DOM se actualice
    setTimeout(function() {
        updateIconoAgregarInfoVisibility();
    }, 10);
  });

  // --- Event Listeners ---

  // Event listeners para los radio buttons
  uploadNowRadio.addEventListener("change", function() {
    updateDocumentUploadVisibility();
    updateIconoAgregarInfoVisibility();
  });
  uploadLaterRadio.addEventListener("change", function() {
    updateDocumentUploadVisibility();
    // El icono se oculta cuando se selecciona "No"
    updateIconoAgregarInfoVisibility();
  });

  // NOTA: Las variables globales y event listeners para preservar archivos ya están inicializados
  // en el DOMContentLoaded más arriba (líneas ~235-310). No duplicar aquí.

  // Función para limpiar todos los campos del formulario de datos de pago
  function limpiarFormularioDatosPago() {
    const formAgregarDatosPago = document.getElementById("formAgregarDatosPago");
    if (formAgregarDatosPago) {
      // Limpiar todos los campos del formulario
      const fechaPago = document.getElementById("fechaPago");
      const formaPago = document.getElementById("formaPago");
      const moneda = document.getElementById("moneda");
      const montoRef = document.getElementById("montoRef");
      const montoBs = document.getElementById("montoBs");
      const referencia = document.getElementById("referencia");
      const depositante = document.getElementById("depositante");
      const confirmacion = document.getElementById("confirmacion");
      const obsAdministracion = document.getElementById("obsAdministracion");
      const obsComercial = document.getElementById("obsComercial");
      const registro = document.getElementById("registro");
      const fechaCarga = document.getElementById("fechaCarga");
      const estatus = document.getElementById("estatus");
      const serialPosPago = document.getElementById("serialPosPago");
      const montoEquipo = document.getElementById("montoEquipo");
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      const bancoFieldsContainer = document.getElementById("bancoFieldsContainer");
      const pagoMovilFieldsContainer = document.getElementById("pagoMovilFieldsContainer");
      
      // Limpiar campos de texto e inputs
      if (fechaPago) fechaPago.value = "";
      if (formaPago) formaPago.value = "";
      if (referencia) referencia.value = "";
      if (depositante) depositante.value = "";
      if (confirmacion) confirmacion.value = "";
      if (obsAdministracion) obsAdministracion.value = "";
      if (obsComercial) obsComercial.value = "";
      if (registro) registro.value = "";
      // NO limpiar fechaCarga - debe mantener la fecha de hoy automáticamente
      // La fecha se establece automáticamente cuando se abre el modal
      if (estatus) estatus.value = "";
      if (serialPosPago) serialPosPago.value = "";
      
      // Resetear el select de moneda a "Seleccionar" y desbloquearlo
      if (moneda) {
        moneda.value = "";
        moneda.disabled = false;
        moneda.removeAttribute("disabled");
        moneda.style.backgroundColor = "";
        moneda.style.cursor = "";
      }
      
      // Ocultar campos de banco y limpiarlos
      const bancoOrigen = document.getElementById("bancoOrigen");
      const bancoDestino = document.getElementById("bancoDestino");
      
      if (bancoFieldsContainer) {
        bancoFieldsContainer.style.display = "none";
      }
      if (bancoOrigen) {
        bancoOrigen.value = "";
        bancoOrigen.required = false;
      }
      if (bancoDestino) {
        bancoDestino.value = "";
        bancoDestino.required = false;
      }
      
      // Ocultar y limpiar campos de Pago Móvil
      if (pagoMovilFieldsContainer) {
        pagoMovilFieldsContainer.style.display = "none";
      }
      if (typeof limpiarCamposPagoMovil === 'function') {
        limpiarCamposPagoMovil();
      }
      
      // Resetear campos de Monto Bs y Monto REF a "0.00" y deshabilitarlos
      if (montoBs) {
        montoBs.value = "0.00";
        montoBs.disabled = true;
        montoBs.setAttribute("disabled", "disabled");
        // Remover listeners de conversión
        montoBs.removeEventListener("input", calculateBsToUsd);
        montoBs.removeEventListener("keyup", calculateBsToUsd);
        montoBs.removeEventListener("blur", formatBsDecimal);
      }
      
      if (montoRef) {
        montoRef.value = "0.00";
        montoRef.disabled = true;
        montoRef.setAttribute("disabled", "disabled");
        // Remover listeners de conversión
        montoRef.removeEventListener("input", calculateUsdToBs);
        montoRef.removeEventListener("keyup", calculateUsdToBs);
        montoRef.removeEventListener("blur", formatUsdDecimal);
        montoRef.removeEventListener("input", updateMontoEquipo);
        montoRef.removeEventListener("keyup", updateMontoEquipo);
      }
      
      // Ocultar sufijos de moneda
      if (montoBsSuffix) {
        montoBsSuffix.style.display = "none";
      }
      if (montoRefSuffix) {
        montoRefSuffix.style.display = "none";
      }
      
      // Resetear el monto del equipo a "$0.00"
      if (montoEquipo) {
        montoEquipo.textContent = "$0.00";
      }
      
      // Resetear el formulario (método alternativo)
      formAgregarDatosPago.reset();
      
      // Asegurar que los valores se mantengan después del reset
      // (el reset puede limpiar los valores que establecimos, así que los reestablecemos)
      // Usar setTimeout para asegurar que se ejecute después del reset
      setTimeout(function() {
        if (montoBs) {
          montoBs.value = "0.00";
          montoBs.disabled = true;
          montoBs.setAttribute("disabled", "disabled");
          montoBs.removeAttribute("readonly");
        }
        if (montoRef) {
          montoRef.value = "0.00";
          montoRef.disabled = true;
          montoRef.setAttribute("disabled", "disabled");
          montoRef.removeAttribute("readonly");
        }
        if (moneda) {
          moneda.value = "";
        }
        // Asegurar que los sufijos estén ocultos
        if (montoBsSuffix) {
          montoBsSuffix.style.display = "none";
          montoBsSuffix.style.visibility = "hidden";
        }
        if (montoRefSuffix) {
          montoRefSuffix.style.display = "none";
          montoRefSuffix.style.visibility = "hidden";
        }
        if (montoEquipo) {
          montoEquipo.textContent = "$0.00";
        }
      }, 10);
    }
  }

  // Función para generar número de registro único
  // Opciones de formato disponibles:
  // 1. Pago{4 últimos de referencia}_{4 últimos de serial} (formato actual: Pago0945_4354)
  // 2. REG-{4 últimos de referencia}-{4 últimos de serial}
  // 3. {Año}-{4 últimos de referencia}-{4 últimos de serial}
  // 4. {Fecha YYYYMMDD}-{4 últimos de referencia}-{4 últimos de serial}
  // 5. PA-{Timestamp corto}-{4 últimos de serial}
  function generateRegistrationNumber(formatType = 1) {
    const referenciaInput = document.getElementById("referencia");
    const serialPosPagoInput = document.getElementById("serialPosPago");
    const registroInput = document.getElementById("registro");
    
    if (!referenciaInput || !serialPosPagoInput || !registroInput) {
      return;
    }

    const referencia = referenciaInput.value.trim();
    const serial = serialPosPagoInput.value.trim();

    // Validar que ambos campos tengan al menos 4 caracteres
    if (!referencia || referencia.length < 4) {
      return;
    }

    if (!serial || serial.length < 4) {
      return;
    }

    // Obtener los últimos 4 dígitos/caracteres de referencia y serial
    // Para referencia: solo números, rellenar con ceros a la izquierda si es necesario
    const ultimos4Referencia = referencia.slice(-4).replace(/\D/g, ''); // Solo números
    const refFinal = ultimos4Referencia.length >= 4 
      ? ultimos4Referencia 
      : ultimos4Referencia.padStart(4, '0'); // Rellenar con ceros si tiene menos de 4 dígitos
    
    // Para serial: últimos 4 caracteres (pueden ser números o letras)
    const ultimos4Serial = serial.slice(-4);

    let numeroRegistro = "";

    switch(formatType) {
      case 1: // Pago{4 últimos de referencia}_{4 últimos de serial}
        numeroRegistro = `Pago${refFinal}_${ultimos4Serial}`;
        break;
      case 2: // REG-{4 últimos de referencia}-{4 últimos de serial}
        numeroRegistro = `REG-${refFinal}-${ultimos4Serial}`;
        break;
      case 3: // {Año}-{4 últimos de referencia}-{4 últimos de serial}
        const año = new Date().getFullYear();
        numeroRegistro = `${año}-${refFinal}-${ultimos4Serial}`;
        break;
      case 4: // {Fecha YYYYMMDD}-{4 últimos de referencia}-{4 últimos de serial}
        const fecha = new Date();
        const fechaStr = fecha.getFullYear() + 
                        String(fecha.getMonth() + 1).padStart(2, '0') + 
                        String(fecha.getDate()).padStart(2, '0');
        numeroRegistro = `${fechaStr}-${refFinal}-${ultimos4Serial}`;
        break;
      case 5: // PA-{Timestamp corto}-{4 últimos de serial}
        const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
        numeroRegistro = `PA-${timestamp}-${ultimos4Serial}`;
        break;
      default:
        numeroRegistro = `Pago${refFinal}_${ultimos4Serial}`;
    }

    registroInput.value = numeroRegistro;
  }

  // Función para validar que solo se ingresen números (BLOQUEA completamente caracteres no numéricos)
  function validateNumericInput(event) {
    // Permitir teclas de control (backspace, delete, tab, escape, enter, etc.)
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    
    if (allowedKeys.includes(event.key)) {
      return true;
    }
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (event.ctrlKey || event.metaKey) {
      if (['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())) {
        return true;
      }
    }
    
    // BLOQUEAR todo lo que no sea número (0-9)
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    return true;
  }

  // Función para validar campos numéricos con decimales (monto Bs y Monto REF)
  function validateNumericField(event) {
    const input = event.target;
    // Permitir teclas de control
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    
    if (allowedKeys.includes(event.key)) {
      return true;
    }
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (event.ctrlKey || event.metaKey) {
      if (['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())) {
        return true;
      }
    }
    
    // BLOQUEAR todo lo que no sea número (0-9) o punto decimal (.)
    if (!/^[0-9.]$/.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    // Evitar múltiples puntos decimales
    if (event.key === '.' && input.value.includes('.')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    return true;
  }

  // Función para limpiar el input en tiempo real (elimina cualquier carácter no permitido)
  function cleanNumericInput(event) {
    const input = event.target;
    const originalValue = input.value;
    // Eliminar todo lo que no sea número
    const cleaned = originalValue.replace(/\D/g, '');
    if (originalValue !== cleaned) {
      input.value = cleaned;
    }
  }

  // Función para limpiar el input de decimales en tiempo real
  function cleanDecimalInput(event) {
    const input = event.target;
    const originalValue = input.value;
    // ✅ Guardar la posición del cursor antes de modificar el valor
    const cursorPosition = input.selectionStart || 0;
    
    // Verificar si el valor solo contiene caracteres válidos (números y máximo un punto)
    const isValidFormat = /^[0-9]*\.?[0-9]*$/.test(originalValue);
    const pointCount = (originalValue.match(/\./g) || []).length;
    
    // Si el formato es válido y tiene máximo un punto, no hacer nada (evitar interferir con escritura normal)
    if (isValidFormat && pointCount <= 1) {
      return;
    }
    
    // Eliminar todo lo que no sea número o punto
    let cleaned = originalValue.replace(/[^0-9.]/g, '');
    // Asegurar solo un punto decimal
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    if (originalValue !== cleaned) {
      // ✅ Calcular la nueva posición del cursor de manera más precisa
      // Contar caracteres válidos antes de la posición del cursor en el valor original
      let validCharsBeforeCursor = 0;
      let hasPointBeforeCursor = false;
      
      for (let i = 0; i < cursorPosition && i < originalValue.length; i++) {
        const char = originalValue[i];
        if (/[0-9]/.test(char)) {
          validCharsBeforeCursor++;
        } else if (char === '.' && !hasPointBeforeCursor) {
          validCharsBeforeCursor++;
          hasPointBeforeCursor = true;
        }
      }
      
      // La nueva posición del cursor será igual a los caracteres válidos contados
      let newCursorPosition = validCharsBeforeCursor;
      
      // Asegurar que la posición esté dentro de los límites del valor limpiado
      newCursorPosition = Math.min(newCursorPosition, cleaned.length);
      
      input.value = cleaned;
      
      // ✅ Restaurar la posición del cursor después de actualizar el valor
      // Usar requestAnimationFrame para asegurar que el DOM se actualice primero
      requestAnimationFrame(function() {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    }
  }

  // Configurar validación de campos numéricos
  function setupNumericValidation() {
    // Campo de referencia: solo números (BLOQUEA completamente)
    const referenciaInput = document.getElementById("referencia");
    if (referenciaInput) {
      referenciaInput.addEventListener("keydown", validateNumericInput);
      referenciaInput.addEventListener("input", cleanNumericInput);
      referenciaInput.addEventListener("paste", function(e) {
        e.preventDefault();
        e.stopPropagation();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const numericOnly = paste.replace(/\D/g, '');
        referenciaInput.value = numericOnly;
        referenciaInput.dispatchEvent(new Event('input'));
      });
    }

    // Campos de Monto Bs y Monto REF: solo números y punto decimal (BLOQUEA completamente)
    const montoBsInput = document.getElementById("montoBs");
    const montoRefInput = document.getElementById("montoRef");
    
    if (montoBsInput) {
      montoBsInput.addEventListener("keydown", validateNumericField);
      montoBsInput.addEventListener("input", cleanDecimalInput);
      montoBsInput.addEventListener("paste", function(e) {
        e.preventDefault();
        e.stopPropagation();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        // Permitir solo números y un punto decimal
        let numericOnly = paste.replace(/[^0-9.]/g, '');
        // Asegurar solo un punto decimal
        const parts = numericOnly.split('.');
        if (parts.length > 2) {
          numericOnly = parts[0] + '.' + parts.slice(1).join('');
        }
        montoBsInput.value = numericOnly;
        montoBsInput.dispatchEvent(new Event('input'));
      });
    }

    if (montoRefInput) {
      montoRefInput.addEventListener("keydown", validateNumericField);
      montoRefInput.addEventListener("input", cleanDecimalInput);
      montoRefInput.addEventListener("paste", function(e) {
        e.preventDefault();
        e.stopPropagation();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        // Permitir solo números y un punto decimal
        let numericOnly = paste.replace(/[^0-9.]/g, '');
        // Asegurar solo un punto decimal
        const parts = numericOnly.split('.');
        if (parts.length > 2) {
          numericOnly = parts[0] + '.' + parts.slice(1).join('');
        }
        montoRefInput.value = numericOnly;
        montoRefInput.dispatchEvent(new Event('input'));
      });
    }
  }

  // Configurar generación automática del número de registro
  function setupAutoRegistrationNumber() {
    const referenciaInput = document.getElementById("referencia");
    const serialPosPagoInput = document.getElementById("serialPosPago");
    
    if (!referenciaInput || !serialPosPagoInput) {
      return;
    }

    // Función que se ejecuta cuando cambian los campos
    const updateRegistrationNumber = () => {
      // Usar formato 1 por defecto (Pago{ref}_{serial})
      // Cambiar este número (1-5) para usar otro formato
      generateRegistrationNumber(1);
    };

    // Agregar listeners a los campos
    referenciaInput.addEventListener("input", updateRegistrationNumber);
    referenciaInput.addEventListener("blur", updateRegistrationNumber);
    serialPosPagoInput.addEventListener("input", updateRegistrationNumber);
    serialPosPagoInput.addEventListener("blur", updateRegistrationNumber);

    // También generar cuando el modal se muestra si ya hay valores
    const modal = document.getElementById("modalAgregarDatosPago");
    if (modal) {
      modal.addEventListener("shown.bs.modal", function() {
        // Cargar la tasa de cambio del día de hoy cuando se abre el modal
        if (typeof loadExchangeRateToday === 'function') {
          loadExchangeRateToday();
        }
        
        // Pequeño delay para asegurar que los valores estén cargados
        setTimeout(() => {
          if (referenciaInput.value && serialPosPagoInput.value) {
            updateRegistrationNumber();
          }
        }, 100);
      });
    }
  }

  // Función para cerrar el modal y limpiar campos
  function cerrarModalYLimpiar() {
    // Limpiar el formulario ANTES de cerrar el modal
    limpiarFormularioDatosPago();
    
    // Asegurar que los sufijos estén ocultos y los campos estén en estado inicial
    setTimeout(function() {
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      const montoBs = document.getElementById("montoBs");
      const montoRef = document.getElementById("montoRef");
      const moneda = document.getElementById("moneda");
      
      if (montoBsSuffix) {
        montoBsSuffix.style.display = "none";
        montoBsSuffix.style.visibility = "hidden";
      }
      if (montoRefSuffix) {
        montoRefSuffix.style.display = "none";
        montoRefSuffix.style.visibility = "hidden";
      }
      if (montoBs) {
        montoBs.value = "0.00";
        montoBs.disabled = true;
        montoBs.setAttribute("disabled", "disabled");
      }
      if (montoRef) {
        montoRef.value = "0.00";
        montoRef.disabled = true;
        montoRef.setAttribute("disabled", "disabled");
      }
      if (moneda) {
        moneda.value = "";
      }
    }, 50);
    
    // Cerrar el modal con transición suave
    const modalElement = document.getElementById("modalAgregarDatosPago");
    if (modalElement) {
      // Agregar clase de fade out para la transición
      modalElement.classList.add("fade-out");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.classList.add("fade-out");
      }
      
      // Esperar a que termine la animación (300ms) antes de cerrar completamente
      setTimeout(function() {
        // Usar método directo que siempre funciona
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          try {
            // Crear nueva instancia y cerrar
            const modal = new bootstrap.Modal(modalElement);
            modal.hide();
            // También forzar el cierre manualmente por si acaso
            setTimeout(function() {
              modalElement.style.display = "none";
              modalElement.classList.remove("show", "fade-out");
              document.body.classList.remove("modal-open");
              const backdrop = document.querySelector(".modal-backdrop");
              if (backdrop) {
                backdrop.remove();
              }
            }, 100);
          } catch (error) {
            // Fallback manual directo
            modalElement.style.display = "none";
            modalElement.classList.remove("show", "fade-out");
            document.body.classList.remove("modal-open");
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) {
              backdrop.remove();
            }
          }
        } else if (typeof $ !== 'undefined' && $.fn.modal) {
          $(modalElement).modal('hide');
          modalElement.classList.remove("fade-out");
        } else {
          // Fallback manual - método más directo
          modalElement.style.display = "none";
          modalElement.classList.remove("show", "fade-out");
          document.body.classList.remove("modal-open");
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) {
            backdrop.remove();
          }
        }
      }, 300); // Duración de la animación de fade out
    }
    
    // El botón de anticipo siempre permanece habilitado, incluso al cancelar
    if (downloadAnticiBtn) {
      downloadAnticiBtn.disabled = false;
      downloadAnticiBtn.style.opacity = "1";
      downloadAnticiBtn.style.cursor = "pointer";
    }
    
    // Limpiar el input de archivo
    if (anticipoInput) {
      anticipoInput.value = "";
      updateAnticipoButtonState();
    }
    
    // Actualizar la visibilidad del icono (se ocultará si no se cumplen las condiciones)
    setTimeout(function() {
      updateIconoAgregarInfoVisibility();
    }, 100);
  }

  // Event listeners para el modal de agregar datos de pago
  if (btnCancelarModalPago) {
    btnCancelarModalPago.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      cerrarModalYLimpiar();
    });
  }

  if (btnCancelarModalPagoFooter) {
    btnCancelarModalPagoFooter.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      cerrarModalYLimpiar();
    });
  }

  // Función para guardar el pago
  /**
 * Guarda un pago mediante una solicitud AJAX, utilizando SweetAlert
 * para las validaciones y las notificaciones de resultado.
 */

function savePayment() {
    // Obtener todos los valores del formulario
    const serialPosPago = document.getElementById("serialPosPago");
    const idUser = document.getElementById("id_user_pago");
    const fechaPago = document.getElementById("fechaPago");
    const fechaCarga = document.getElementById("fechaCarga");
    const formaPago = document.getElementById("formaPago");
    const moneda = document.getElementById("moneda");
    const montoBs = document.getElementById("montoBs");
    const montoRef = document.getElementById("montoRef");
    const referencia = document.getElementById("referencia");
    const obsAdministracion = document.getElementById("obsAdministracion");
    const registro = document.getElementById("registro");
    const bancoOrigen = document.getElementById("bancoOrigen");
    const bancoDestino = document.getElementById("bancoDestino");
    const depositante = document.getElementById("depositante");
    // Obtener el ID del pago guardado en el campo oculto
    const paymentIdInput = document.getElementById("payment_id_to_save");
    const paymentId = paymentIdInput ? paymentIdInput.value : null;

    // --- 1. VALIDACIONES DEL FORMULARIO (Solo los campos requeridos) ---
    
    // Validar Fecha Pago
    if (!fechaPago || !fechaPago.value || fechaPago.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe seleccionar la fecha de pago.',
            confirmButtonColor: '#3085d6'
        });
        if (fechaPago) fechaPago.focus();
        return;
    }

    // Validar Forma de Pago
    if (!formaPago || !formaPago.value || formaPago.value === "" || formaPago.value === "0") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe seleccionar una forma de pago.',
            confirmButtonColor: '#3085d6'
        });
        if (formaPago) formaPago.focus();
        return;
    }

    // Obtener el ID y texto del método de pago seleccionado para validaciones condicionales
    const selectedPaymentMethodId = parseInt(formaPago.value);
    const paymentMethodText = formaPago.options[formaPago.selectedIndex].textContent;
    const selectedPaymentMethodName = paymentMethodText.toLowerCase();

    // Validaciones condicionales según el método de pago
    // Si es Transferencia (ID = 2), validar bancos
    if (selectedPaymentMethodId === 2) {
        if (!bancoOrigen || !bancoOrigen.value || bancoOrigen.value === "" || bancoOrigen.value === "0") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe seleccionar un banco de origen para Transferencia.',
                confirmButtonColor: '#3085d6'
            });
            if (bancoOrigen) bancoOrigen.focus();
            return;
        }

        if (!bancoDestino || !bancoDestino.value || bancoDestino.value === "" || bancoDestino.value === "0") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe seleccionar un banco de destino para Transferencia.',
                confirmButtonColor: '#3085d6'
            });
            if (bancoDestino) bancoDestino.focus();
            return;
        }
    }

    // Si es Pago Móvil (ID = 5), validar campos del origen
    if (selectedPaymentMethodId === 5) {
        const origenRifTipo = document.getElementById("origenRifTipo");
        const origenRifNumero = document.getElementById("origenRifNumero");
        const origenTelefono = document.getElementById("origenTelefono");
        const origenBanco = document.getElementById("origenBanco");

        if (!origenRifTipo || !origenRifTipo.value || origenRifTipo.value === "" || origenRifTipo.value === "0") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe seleccionar el tipo de RIF del origen para Pago Móvil.',
                confirmButtonColor: '#3085d6'
            });
            if (origenRifTipo) origenRifTipo.focus();
            return;
        }

        if (!origenRifNumero || !origenRifNumero.value || origenRifNumero.value.trim() === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe ingresar el número de RIF del origen para Pago Móvil.',
                confirmButtonColor: '#3085d6'
            });
            if (origenRifNumero) origenRifNumero.focus();
            return;
        }

        if (!origenTelefono || !origenTelefono.value || origenTelefono.value.trim() === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe ingresar el número telefónico del origen para Pago Móvil.',
                confirmButtonColor: '#3085d6'
            });
            if (origenTelefono) origenTelefono.focus();
            return;
        }

        if (!origenBanco || !origenBanco.value || origenBanco.value === "" || origenBanco.value === "0") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe seleccionar el banco del origen para Pago Móvil.',
                confirmButtonColor: '#3085d6'
            });
            if (origenBanco) origenBanco.focus();
            return;
        }
    }

    // Validar Moneda
    if (!moneda || !moneda.value || moneda.value === "" || moneda.value === "0") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe seleccionar una moneda.',
            confirmButtonColor: '#3085d6'
        });
        if (moneda) moneda.focus();
        return;
    }

    // Validar Monto en Bolívares (debe ser mayor a 0)
    if (!montoBs || !montoBs.value || montoBs.value.trim() === "" || montoBs.value === "0" || montoBs.value === "0.00") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'El monto en Bolívares es obligatorio y debe ser mayor a 0.',
            confirmButtonColor: '#3085d6'
        });
        if (montoBs) montoBs.focus();
        return;
    }
    
    // Validar que el monto sea un número válido y mayor a 0
    const montoBsValue = parseFloat(montoBs.value.replace(/,/g, ''));
    if (isNaN(montoBsValue) || montoBsValue <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Valor Inválido',
            text: 'El monto en Bolívares debe ser un número mayor a 0.',
            confirmButtonColor: '#3085d6'
        });
        if (montoBs) montoBs.focus();
        return;
    }

    // Validar Referencia
    if (!referencia || !referencia.value || referencia.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe ingresar el número de referencia.',
            confirmButtonColor: '#3085d6'
        });
        if (referencia) referencia.focus();
        return;
    }

    // Validar Depositante
    if (!depositante || !depositante.value || depositante.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe ingresar el nombre del depositante.',
            confirmButtonColor: '#3085d6'
        });
        if (depositante) depositante.focus();
        return;
    }

    // Validar Fecha Carga
    if (!fechaCarga || !fechaCarga.value || fechaCarga.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe seleccionar la fecha de carga.',
            confirmButtonColor: '#3085d6'
        });
        if (fechaCarga) fechaCarga.focus();
        return;
    }

    // Las variables paymentMethodText, selectedPaymentMethodName y selectedPaymentMethodId ya están definidas arriba

    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
        Swal.fire({
            icon: 'error',
            title: 'Error de Configuración',
            text: 'Variables de entorno (ENDPOINT_BASE o APP_PATH) no definidas.',
            confirmButtonColor: '#d33'
        });
        return;
    }
    
    // --- 2. PREPARACIÓN DE DATOS ---

    // Obtener campos de Pago Móvil si están visibles
    const destinoRifTipo = document.getElementById("destinoRifTipo");
    const destinoRifNumero = document.getElementById("destinoRifNumero");
    const destinoTelefono = document.getElementById("destinoTelefono");
    const destinoBanco = document.getElementById("destinoBanco");
    
    // Determinar si es Pago Móvil (ID = 5 o por nombre)
    const isPagoMovil = selectedPaymentMethodId === 5 || selectedPaymentMethodName.includes("móvil") || selectedPaymentMethodName.includes("movil");
    
    // Reutilizar variables ya declaradas en validaciones
    let origenRifTipo, origenRifNumero, origenTelefono, origenBanco;
    if (isPagoMovil) {
        origenRifTipo = document.getElementById("origenRifTipo");
        origenRifNumero = document.getElementById("origenRifNumero");
        origenTelefono = document.getElementById("origenTelefono");
        origenBanco = document.getElementById("origenBanco");
    }
    
    // Determinar origen_bank y destination_bank según el tipo de pago
    let origenBankValue = null;
    let destinationBankValue = null;
    
    if (isPagoMovil) {
      // Para Pago Móvil, usar los bancos de los campos específicos
      origenBankValue = origenBanco && origenBanco.value ? origenBanco.options[origenBanco.selectedIndex].textContent : null;
      destinationBankValue = destinoBanco && destinoBanco.value ? destinoBanco.options[destinoBanco.selectedIndex].textContent : null;
    } else {
      // Para Transferencia, usar los campos de banco existentes
      origenBankValue = bancoOrigen && bancoOrigen.value ? bancoOrigen.options[bancoOrigen.selectedIndex].textContent : null;
      destinationBankValue = bancoDestino && bancoDestino.value ? bancoDestino.options[bancoDestino.selectedIndex].textContent : null;
    }

    // Preparar datos para enviar
    // Función auxiliar para agregar hora a una fecha si solo tiene la fecha
    function addTimeToDate(dateString) {
        if (!dateString) return null;
        // Si ya tiene hora (contiene espacio y dos puntos), retornar tal cual
        if (dateString.includes(' ') && dateString.includes(':')) {
            return dateString;
        }
        // Si solo tiene la fecha (formato YYYY-MM-DD), agregar la hora actual
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${dateString} ${hours}:${minutes}:${seconds}`;
    }

    const formData = new URLSearchParams();
    formData.append("serial_pos", serialPosPago.value);
    formData.append("user_loader", idUser ? idUser.value : null);
    // Agregar hora a payment_date si solo tiene la fecha
    const paymentDateWithTime = fechaPago && fechaPago.value ? addTimeToDate(fechaPago.value) : null;
    formData.append("payment_date", paymentDateWithTime);
    formData.append("origen_bank", origenBankValue);
    formData.append("destination_bank", destinationBankValue);
    formData.append("payment_method", paymentMethodText);
    formData.append("currency", moneda.value === "bs" ? "BS" : "USD");
    formData.append("reference_amount", montoRef && montoRef.value ? parseFloat(montoRef.value) : null);
    formData.append("amount_bs", montoBsValue);
    formData.append("payment_reference", referencia ? referencia.value : null);
    formData.append("depositor", depositante.value ? depositante.value : null);
    formData.append("observations", obsAdministracion ? obsAdministracion.value : null);
    formData.append("record_number", registro ? registro.value : null);
    // Agregar hora a loadpayment_date si solo tiene la fecha, o usar hora actual si no hay valor
    const loadPaymentDateWithTime = fechaCarga && fechaCarga.value ? addTimeToDate(fechaCarga.value) : new Date().toISOString().slice(0, 19).replace('T', ' ');
    formData.append("loadpayment_date", loadPaymentDateWithTime);
    formData.append("confirmation_number", false);
    formData.append("payment_id", paymentId);
    
    // Agregar campos de Pago Móvil si es ese método de pago
    if (isPagoMovil) {
      formData.append("destino_rif_tipo", destinoRifTipo ? destinoRifTipo.value : null);
      formData.append("destino_rif_numero", destinoRifNumero ? destinoRifNumero.value : null);
      formData.append("destino_telefono", destinoTelefono ? destinoTelefono.value : null);
      formData.append("destino_banco", destinoBanco && destinoBanco.value ? destinoBanco.options[destinoBanco.selectedIndex].textContent : null);
      formData.append("origen_rif_tipo", origenRifTipo ? origenRifTipo.value : null);
      formData.append("origen_rif_numero", origenRifNumero ? origenRifNumero.value : null);
      formData.append("origen_telefono", origenTelefono ? origenTelefono.value : null);
      formData.append("origen_banco", origenBanco && origenBanco.value ? origenBanco.options[origenBanco.selectedIndex].textContent : null);
    }

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/SavePayment";

    // --- 3. SOLICITUD AJAX CON MANEJO DE RESPUESTA (Sustitución de alert() por SweetAlert) ---
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                
                if (data.success) {
                    // Obtener valores formateados para el informe
                    const fechaPagoFormatted = fechaPago && fechaPago.value ? new Date(fechaPago.value).toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A';
                    const fechaCargaFormatted = fechaCarga && fechaCarga.value ? new Date(fechaCarga.value).toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A';
                    const montoBsFormatted = montoBsValue ? montoBsValue.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
                    const montoRefFormatted = montoRef && montoRef.value ? parseFloat(montoRef.value).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';
                    const monedaText = moneda && moneda.value === 'bs' ? 'Bolívares (Bs)' : moneda && moneda.value === 'usd' ? 'Dólares (USD)' : 'N/A';
                    
                    // Construir HTML del informe empresarial
                    const paymentReportHtml = `
                        <div style="text-align: left; padding: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 8px;">
                            <!-- Encabezado -->
                            <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #28a745;">
                                <h3 style="color: #28a745; margin: 0; font-size: 1.5em; font-weight: 700;">
                                    <i class="fas fa-check-circle" style="margin-right: 8px;"></i>Pago Registrado Exitosamente
                                </h3>
                                <p style="color: #6c757d; margin: 8px 0 0 0; font-size: 0.9em;">
                                    Registro temporal guardado correctamente
                                </p>
                            </div>
                            
                            <!-- Información Principal -->
                            <div style="background: #ffffff; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                    <i class="fas fa-fingerprint" style="color: #28a745; font-size: 1.2em; margin-right: 10px; width: 25px;"></i>
                                    <div>
                                        <strong style="color: #495057; font-size: 0.85em;">ID de Registro Temporal:</strong>
                                        <span style="color: #212529; font-weight: 700; font-size: 1.1em; margin-left: 8px;">#${data.id_payment_record || 'N/A'}</span>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <i class="fas fa-barcode" style="color: #007bff; font-size: 1.2em; margin-right: 10px; width: 25px;"></i>
                                    <div>
                                        <strong style="color: #495057; font-size: 0.85em;">Serial POS:</strong>
                                        <span style="color: #212529; font-weight: 600; margin-left: 8px;">${serialPosPago ? serialPosPago.value : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Detalles del Pago -->
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                                <h4 style="color: #495057; margin: 0 0 15px 0; font-size: 1.1em; font-weight: 600; border-bottom: 2px solid #dee2e6; padding-bottom: 8px;">
                                    <i class="fas fa-money-bill-wave" style="margin-right: 8px; color: #28a745;"></i>Detalles del Pago
                                </h4>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                    <div style="background: #ffffff; padding: 10px; border-radius: 4px;">
                                        <strong style="color: #6c757d; font-size: 0.8em; display: block; margin-bottom: 4px;">Método de Pago</strong>
                                        <span style="color: #212529; font-weight: 600; font-size: 0.95em;">${paymentMethodText || 'N/A'}</span>
                                    </div>
                                    <div style="background: #ffffff; padding: 10px; border-radius: 4px;">
                                        <strong style="color: #6c757d; font-size: 0.8em; display: block; margin-bottom: 4px;">Moneda</strong>
                                        <span style="color: #212529; font-weight: 600; font-size: 0.95em;">${monedaText}</span>
                                    </div>
                                    <div style="background: #ffffff; padding: 10px; border-radius: 4px;">
                                        <strong style="color: #6c757d; font-size: 0.8em; display: block; margin-bottom: 4px;">Monto en Bolívares</strong>
                                        <span style="color: #28a745; font-weight: 700; font-size: 1.1em;">Bs. ${montoBsFormatted}</span>
                                    </div>
                                    ${montoRef && montoRef.value ? `
                                    <div style="background: #ffffff; padding: 10px; border-radius: 4px;">
                                        <strong style="color: #6c757d; font-size: 0.8em; display: block; margin-bottom: 4px;">Monto de Referencia</strong>
                                        <span style="color: #007bff; font-weight: 700; font-size: 1.1em;">USD ${montoRefFormatted}</span>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- Información Adicional -->
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                                <h4 style="color: #495057; margin: 0 0 15px 0; font-size: 1.1em; font-weight: 600; border-bottom: 2px solid #dee2e6; padding-bottom: 8px;">
                                    <i class="fas fa-info-circle" style="margin-right: 8px; color: #007bff;"></i>Información Adicional
                                </h4>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-calendar-alt" style="margin-right: 5px;"></i>Fecha de Pago
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${fechaPagoFormatted}</span>
                                    </div>
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-calendar-check" style="margin-right: 5px;"></i>Fecha de Carga
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${fechaCargaFormatted}</span>
                                    </div>
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-hashtag" style="margin-right: 5px;"></i>Referencia
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${referencia ? referencia.value : 'N/A'}</span>
                                    </div>
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-user" style="margin-right: 5px;"></i>Depositante
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${depositante ? depositante.value : 'N/A'}</span>
                                    </div>
                                    ${registro && registro.value ? `
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-book" style="margin-right: 5px;"></i>Número de Registro
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${registro.value}</span>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- Nota Informativa -->
                            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; border-radius: 4px; margin-top: 15px;">
                                <p style="margin: 0; color: #856404; font-size: 0.9em; line-height: 1.5;">
                                    <i class="fas fa-info-circle" style="margin-right: 6px;"></i>
                                    <strong>Nota:</strong> Este registro se guardará automáticamente en la tabla principal cuando se cree el ticket correspondiente. 
                                    <strong style="color: #dc3545;">Si no se carga el ticket correspondiente, este registro será eliminado.</strong>
                                </p>
                            </div>
                        </div>
                    `;
                    
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        html: paymentReportHtml,
                        width: '650px',
                        showConfirmButton: true,
                        confirmButtonText: '<i class="fas fa-check"></i> Aceptar',
                        confirmButtonColor: '#28a745',
                        customClass: {
                            popup: 'swal2-popup-custom',
                            htmlContainer: 'swal2-html-container-custom'
                        },
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        }
                    }).then(() => {
                        // Cerrar el modal de pago pero NO limpiar el formulario principal
                        // Solo cerrar el modal de datos de pago, no afectar los documentos cargados
                        const modalElement = document.getElementById("modalAgregarDatosPago");
                        if (modalElement) {
                            // Verificar si Bootstrap 5 está disponible
                            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                                try {
                                    const modal = bootstrap.Modal.getInstance(modalElement);
                                    if (modal) {
                                        modal.hide();
                                    } else {
                                        const newModal = new bootstrap.Modal(modalElement);
                                        newModal.hide();
                                    }
                                } catch (e) {
                                    // Si falla, usar método manual
                                    console.warn("Error al cerrar modal con Bootstrap, usando método manual:", e);
                                    modalElement.style.display = 'none';
                                    modalElement.classList.remove('show');
                                    document.body.classList.remove('modal-open');
                                    const backdrop = document.querySelector('.modal-backdrop');
                                    if (backdrop) {
                                        backdrop.remove();
                                    }
                                }
                            } else {
                                // Fallback manual si Bootstrap no está disponible
                                modalElement.style.display = 'none';
                                modalElement.classList.remove('show');
                                document.body.classList.remove('modal-open');
                                const backdrop = document.querySelector('.modal-backdrop');
                                if (backdrop) {
                                    backdrop.remove();
                                }
                            }
                        }
                        // Solo limpiar el formulario de pago, NO los documentos del formulario principal
                        if (typeof limpiarFormularioDatosPago === 'function') {
                            limpiarFormularioDatosPago();
                        }
                        // NO llamar a cerrarModalYLimpiar() porque podría limpiar documentos del formulario principal
                        
                        // IMPORTANTE: Verificar que los documentos del formulario principal NO se hayan perdido
                        const inputAnticipoVerificacion = document.getElementById("AnticipoInput");
                        if (inputAnticipoVerificacion) {
                            console.log("VERIFICACIÓN después de cerrar modal de pago:", {
                                inputAnticipoValue: inputAnticipoVerificacion.value,
                                inputAnticipoFilesLength: inputAnticipoVerificacion.files ? inputAnticipoVerificacion.files.length : 0,
                                checkAnticipoChecked: document.getElementById("checkAnticipo") ? document.getElementById("checkAnticipo").checked : false
                            });
                        }
                    });
                    
                    // Log para depuración (visible en consola del navegador)
                    console.warn('Pago guardado exitosamente:', {
                        id_payment_record: data.id_payment_record,
                        serial_pos: serialPosPago ? serialPosPago.value : 'N/A',
                        payment_method: paymentMethodText,
                        amount_bs: montoBs ? montoBs.value : 'N/A',
                        message: 'Registro guardado en temp_payment_uploads'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al Guardar',
                        text: 'Error al guardar el pago: ' + (data.message || "Error desconocido del servidor."),
                        confirmButtonColor: '#d33'
                    });
                }
            } catch (error) {
                console.error('Error al parsear respuesta del servidor:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Procesamiento',
                    text: 'Error al procesar la respuesta del servidor (JSON inválido).',
                    confirmButtonColor: '#d33'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: `Error al comunicarse con el servidor (HTTP Status: ${xhr.status}).`,
                confirmButtonColor: '#d33'
            });
        }
    };
    
    xhr.onerror = function() {
        Swal.fire({
            icon: 'error',
            title: 'Error de Red',
            text: 'Error de red al intentar guardar el pago.',
            confirmButtonColor: '#d33'
        });
    };
    
    xhr.send(formData.toString());
}

  // Event listener para el botón de guardar
  const btnGuardarDatosPago = document.getElementById("btnGuardarDatosPago");
  if (btnGuardarDatosPago) {
    btnGuardarDatosPago.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      savePayment();
    });
  }

  // Event listener para cuando se cierra el modal (por cualquier método)
  // Función para cargar los métodos de pago desde la API
  function loadPaymentMethods() {
    const formaPagoSelect = document.getElementById("formaPago");
    if (!formaPagoSelect) {
      return;
    }

    // Verificar que las variables estén definidas
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
      return;
      return;
    }

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetPaymentMethods";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          
          if (data.success && data.payment_methods && data.payment_methods.length > 0) {
            // Limpiar opciones existentes
            formaPagoSelect.innerHTML = '<option value="">Seleccione</option>';
            
            // Agregar opciones desde la base de datos
            data.payment_methods.forEach(function(method) {
              const option = document.createElement("option");
              option.value = method.id_payment_method;
              option.textContent = method.payment_method_name;
              option.setAttribute("data-id", method.id_payment_method);
              formaPagoSelect.appendChild(option);
            });
            
            // Configurar listener para detectar cuando se selecciona "Transferencia" (id = 2)
            // Usar setTimeout para asegurar que el DOM esté listo
            setTimeout(function() {
              setupFormaPagoListener();
            }, 100);
            
          } else {
            var errorMsg = data.message || "Sin mensaje";
            // Mantener al menos la opción "Seleccione"
            if (formaPagoSelect.innerHTML.trim() === "") {
              formaPagoSelect.innerHTML = '<option value="">Seleccione</option>';
            }
          }
        } catch (error) {
        }
      } else {
      }
    };
    
    xhr.onerror = function() {
    };
    
    xhr.send();
  }

      loadPaymentMethods();

  // Función para cargar los bancos desde la API
  function loadBancos() {
    const bancoOrigenSelect = document.getElementById("bancoOrigen");
    const bancoDestinoSelect = document.getElementById("bancoDestino");
    
    if (!bancoOrigenSelect || !bancoDestinoSelect) {
      return;
    }

    // Verificar que las variables estén definidas
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
      return;
      return;
    }

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetBancos";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          
          if (data.success && data.bancos && data.bancos.length > 0) {
            // Limpiar opciones existentes
            bancoOrigenSelect.innerHTML = '<option value="">Seleccione</option>';
            bancoDestinoSelect.innerHTML = '<option value="">Seleccione</option>';
            
            // Agregar opciones desde la base de datos
            data.bancos.forEach(function(banco) {
              const optionOrigen = document.createElement("option");
              optionOrigen.value = banco.codigobanco;
              optionOrigen.textContent = banco.ibp;
              bancoOrigenSelect.appendChild(optionOrigen);
              
              const optionDestino = document.createElement("option");
              optionDestino.value = banco.codigobanco;
              optionDestino.textContent = banco.ibp;
              bancoDestinoSelect.appendChild(optionDestino);
            });
            
          } else {
            var errorMsg = data.message || "Sin mensaje";
            // Mantener al menos la opción "Seleccione"
            if (bancoOrigenSelect.innerHTML.trim() === "") {
              bancoOrigenSelect.innerHTML = '<option value="">Seleccione</option>';
            }
            if (bancoDestinoSelect.innerHTML.trim() === "") {
              bancoDestinoSelect.innerHTML = '<option value="">Seleccione</option>';
            }
          }
        } catch (error) {
        }
      } else {
      }
    };
    
    xhr.onerror = function() {
    };
    
    xhr.send();
  }

  // Variable global para almacenar la tasa de cambio
  let exchangeRate = null;

  // Función para cargar la tasa de cambio desde la API
  function loadExchangeRate() {
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
      return;
      return;
    }

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRate";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success && data.exchange_rate && data.exchange_rate.tasa_dolar) {
            exchangeRate = parseFloat(data.exchange_rate.tasa_dolar);
          } else {
            exchangeRate = null;
          }
        } catch (error) {
          exchangeRate = null;
        }
      } else {
        exchangeRate = null;
      }
    };
    
    xhr.onerror = function() {
      exchangeRate = null;
    };
    
    xhr.send();
  }

  // Función para cargar la tasa de cambio del día de hoy o de una fecha específica
  // Si se proporciona una fecha, carga la tasa para esa fecha; si no, carga la del día de hoy
  function loadExchangeRateToday(fecha = null) {
    console.log("=== loadExchangeRateToday INICIO ===");
    console.log("Fecha recibida como parámetro:", fecha);
    console.log("Tipo de fecha:", typeof fecha);
    
    // Si no se proporciona fecha, intentar obtenerla del input
    if (!fecha) {
      const fechaPagoInput = document.getElementById("fechaPago");
      if (fechaPagoInput && fechaPagoInput.value) {
        fecha = fechaPagoInput.value;
        console.log("Fecha obtenida del input fechaPago:", fecha);
      }
    }
    
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
      console.error("ENDPOINT_BASE o APP_PATH no están definidos");
      return;
    }

    // Si se proporciona una fecha, usar el endpoint de fecha específica
    let apiUrl;
    let dataToSend;
    
    if (fecha) {
      apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateByDate";
      dataToSend = "action=GetExchangeRateByDate&fecha=" + encodeURIComponent(fecha);
      console.log("Usando endpoint GetExchangeRateByDate con fecha:", fecha);
    } else {
      apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateToday";
      dataToSend = null;
      console.log("Usando endpoint GetExchangeRateToday (sin fecha)");
    }
    
    console.log("URL final:", apiUrl);
    console.log("Datos a enviar:", dataToSend);
    const tasaDisplayValue = document.getElementById("tasaDisplayValue");
    const fechaTasaDisplay = document.getElementById("fechaTasaDisplay");

    // Mostrar estado de carga
    if (tasaDisplayValue) {
      tasaDisplayValue.textContent = "Cargando Tasa...";
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
      console.log("loadExchangeRateToday - Fecha recibida como parámetro:", fecha);
      console.log("loadExchangeRateToday - URL:", apiUrl);
      console.log("loadExchangeRateToday - Datos enviados:", dataToSend);
      
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          
          // Debug: mostrar respuesta en consola
          console.log("Respuesta API:", fecha ? "GetExchangeRateByDate" : "GetExchangeRateToday", data);
          console.log("data.success:", data.success);
          console.log("data.exchange_rate:", data.exchange_rate);
          console.log("Fecha enviada al backend:", fecha);
          
          if (data.success && data.exchange_rate) {
            // Verificar si tasa_dolar existe
            const tasaValue = data.exchange_rate.tasa_dolar || null;
            
            if (tasaValue !== null && tasaValue !== undefined) {
              const tasa = parseFloat(tasaValue);
              
              if (!isNaN(tasa)) {
                exchangeRate = tasa; // Actualizar la variable global también
                
                // Mostrar la tasa formateada
                if (tasaDisplayValue) {
                  tasaDisplayValue.textContent = "Bs. " + tasa.toFixed(2);
                }
              } else {
                console.error("Error: tasa_dolar no es un número válido:", tasaValue);
                if (tasaDisplayValue) {
                  tasaDisplayValue.textContent = "Error en formato";
                }
              }
            } else {
              console.error("Error: tasa_dolar no encontrado en exchange_rate. Claves disponibles:", Object.keys(data.exchange_rate));
              if (tasaDisplayValue) {
                tasaDisplayValue.textContent = "No disponible";
              }
            }
            
            // Actualizar la fecha mostrada
            // Siempre mostrar la fecha que el usuario seleccionó en el input
            if (fechaTasaDisplay) {
              let fechaAmostrar;
              
              // Si se proporcionó una fecha (fecha seleccionada por el usuario), usar esa
              if (fecha) {
                fechaAmostrar = formatDateToDDMMYYYY(fecha);
              } else {
                // Si no se proporcionó fecha, intentar obtenerla del input
                const fechaPagoInput = document.getElementById("fechaPago");
                if (fechaPagoInput && fechaPagoInput.value) {
                  fechaAmostrar = formatDateToDDMMYYYY(fechaPagoInput.value);
                } else {
                  // Si no hay fecha en el input, usar la fecha de hoy
                  fechaAmostrar = formatDateToDDMMYYYY(new Date());
                }
              }
              
              fechaTasaDisplay.innerHTML = '<i class="fas fa-calendar-day me-1"></i>Tasa: ' + fechaAmostrar;
            }
          } else {
            if (tasaDisplayValue) {
              tasaDisplayValue.textContent = "No disponible";
            }
            if (fechaTasaDisplay) {
              const hoy = new Date();
              const fechaHoy = formatDateToDDMMYYYY(hoy);
              fechaTasaDisplay.innerHTML = '<i class="fas fa-calendar-day me-1"></i>Tasa: ' + fechaHoy;
            }
            exchangeRate = null;
            console.error("Error: No se pudo obtener la tasa. Respuesta completa:", JSON.stringify(data, null, 2));
          }
        } catch (error) {
          console.error("Error al parsear respuesta:", error);
          if (tasaDisplayValue) {
            tasaDisplayValue.textContent = "Error al cargar";
          }
          if (fechaTasaDisplay) {
            const hoy = new Date();
            const fechaHoy = formatDateToDDMMYYYY(hoy);
            fechaTasaDisplay.innerHTML = '<i class="fas fa-calendar-day me-1"></i>Tasa: ' + fechaHoy;
          }
          exchangeRate = null;
        }
      } else {
        console.error("Error HTTP:", xhr.status, xhr.responseText);
        if (tasaDisplayValue) {
          tasaDisplayValue.textContent = "Error de conexión (" + xhr.status + ")";
        }
        if (fechaTasaDisplay) {
          const hoy = new Date();
          const fechaHoy = formatDateToDDMMYYYY(hoy);
          fechaTasaDisplay.innerHTML = '<i class="fas fa-calendar-day me-1"></i>Tasa: ' + fechaHoy;
        }
        exchangeRate = null;
      }
    };
    
    xhr.onerror = function() {
      if (tasaDisplayValue) {
        tasaDisplayValue.textContent = "Error de red";
      }
      exchangeRate = null;
    };
    
    // Enviar datos si hay fecha, si no enviar null (para GetExchangeRateToday)
    xhr.send(dataToSend);
  }
  
  // Hacer la función globalmente accesible para los atributos onclick/onchange del HTML
  window.loadExchangeRateToday = loadExchangeRateToday;

  // COMENTADO: No cargar automáticamente la tasa al iniciar
  // La tasa se cargará cuando el usuario haga clic en el campo fechaPago
  // loadExchangeRateToday();

  // Función auxiliar para formatear fecha a DD/MM/YYYY
  function formatDateToDDMMYYYY(fecha) {
    if (!fecha) return '';
    
    // Si es string en formato YYYY-MM-DD
    if (typeof fecha === 'string' && fecha.includes('-')) {
      const partes = fecha.split('-');
      if (partes.length === 3) {
        // Asegurar que día y mes tengan 2 dígitos
        const dia = partes[2].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const año = partes[0];
        return dia + '/' + mes + '/' + año;
      }
    }
    
    // Si es un objeto Date
    if (fecha instanceof Date) {
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      return dia + '/' + mes + '/' + año;
    }
    
    // Intentar parsear como fecha
    const fechaObj = new Date(fecha);
    if (!isNaN(fechaObj.getTime())) {
      const dia = String(fechaObj.getDate()).padStart(2, '0');
      const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const año = fechaObj.getFullYear();
      return dia + '/' + mes + '/' + año;
    }
    
    return fecha; // Retornar original si no se puede formatear
  }

  // Función para cargar la tasa de cambio por fecha
  function loadExchangeRateByDate(fecha) {
    console.log("loadExchangeRateByDate llamada con fecha:", fecha);
    
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
      console.error("ENDPOINT_BASE o APP_PATH no están definidos");
      return;
    }

    if (!fecha) {
      console.error("Fecha vacía o inválida");
      return;
    }

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateByDate";
    console.log("URL de la API:", apiUrl);
    const tasaDisplayValue = document.getElementById("tasaDisplayValue");
    const fechaTasaDisplay = document.getElementById("fechaTasaDisplay");

    // Mostrar estado de carga
    if (tasaDisplayValue) {
      tasaDisplayValue.textContent = "Cargando Tasa...";
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          
          // Debug: mostrar respuesta en consola
          console.log("Respuesta API GetExchangeRateByDate:", data);
          console.log("data.success:", data.success);
          console.log("data.exchange_rate:", data.exchange_rate);
          
          if (data.success && data.exchange_rate) {
            const tasaValue = data.exchange_rate.tasa_dolar || null;
            
            if (tasaValue !== null && tasaValue !== undefined) {
              const tasa = parseFloat(tasaValue);
              
              if (!isNaN(tasa)) {
                exchangeRate = tasa; // Actualizar la variable global también
                
                // Mostrar la tasa formateada
                if (tasaDisplayValue) {
                  tasaDisplayValue.textContent = "Bs. " + tasa.toFixed(2);
                }
              } else {
                if (tasaDisplayValue) {
                  tasaDisplayValue.textContent = "Error en formato";
                }
              }
            } else {
              if (tasaDisplayValue) {
                tasaDisplayValue.textContent = "No disponible";
              }
            }
            
            // Actualizar la fecha mostrada en formato DD/MM/YYYY
            const fechaTasa = data.exchange_rate.fecha_tasa || fecha;
            if (fechaTasaDisplay) {
              const fechaFormateada = formatDateToDDMMYYYY(fechaTasa);
              fechaTasaDisplay.innerHTML = '<i class="fas fa-calendar-day me-1"></i>Tasa: ' + fechaFormateada;
            }
          } else {
            if (tasaDisplayValue) {
              tasaDisplayValue.textContent = "No disponible";
            }
            if (fechaTasaDisplay) {
              // Formatear la fecha ingresada en formato DD/MM/YYYY
              const fechaFormateada = formatDateToDDMMYYYY(fecha);
              fechaTasaDisplay.innerHTML = '<i class="fas fa-calendar-day me-1"></i>Tasa: ' + fechaFormateada;
            }
            exchangeRate = null;
          }
        } catch (error) {
          console.error("Error al parsear respuesta:", error);
          if (tasaDisplayValue) {
            tasaDisplayValue.textContent = "Error al cargar";
          }
          exchangeRate = null;
        }
      } else {
        console.error("Error HTTP:", xhr.status, xhr.responseText);
        try {
          const errorData = JSON.parse(xhr.responseText);
          console.error("Error detallado:", errorData);
          if (tasaDisplayValue) {
            tasaDisplayValue.textContent = "Error de conexión (" + xhr.status + ")";
          }
        } catch (e) {
          if (tasaDisplayValue) {
            tasaDisplayValue.textContent = "Error de conexión (" + xhr.status + ")";
          }
        }
        exchangeRate = null;
      }
    };
    
    xhr.onerror = function() {
      if (tasaDisplayValue) {
        tasaDisplayValue.textContent = "Error de red";
      }
      exchangeRate = null;
    };
    
    const data = "action=GetExchangeRateByDate&fecha=" + encodeURIComponent(fecha);
    xhr.send(data);
  }

  // Event listener para el campo fechaPago
  document.addEventListener('DOMContentLoaded', function() {
    const fechaPagoInput = document.getElementById('fechaPago');
    if (fechaPagoInput) {
      // Los eventos onclick y onchange ya están manejados directamente en el HTML
      // Pero mantenemos estos listeners como respaldo
      fechaPagoInput.addEventListener('change', function() {
        const fechaSeleccionada = this.value;
        console.log("Cambio en fechaPago - Fecha seleccionada:", fechaSeleccionada);
        if (fechaSeleccionada) {
          console.log("Cargando tasa para fecha:", fechaSeleccionada);
          loadExchangeRateToday(fechaSeleccionada);
        }
      });
      
      fechaPagoInput.addEventListener('click', function(e) {
        const fechaSeleccionada = this.value;
        console.log("Click en fechaPago - Fecha seleccionada:", fechaSeleccionada);
        if (fechaSeleccionada) {
          console.log("Cargando tasa para fecha:", fechaSeleccionada);
          loadExchangeRateToday(fechaSeleccionada);
        }
      });
      
      // También ejecutar cuando se hace focus (por si se selecciona con teclado)
      fechaPagoInput.addEventListener('focus', function() {
        const fechaSeleccionada = this.value;
        if (fechaSeleccionada) {
          loadExchangeRateToday(fechaSeleccionada);
        }
      });
    }
  });

  // Función para manejar el cambio de moneda
  function handleCurrencyChange() {
    const monedaSelect = document.getElementById("moneda");
    const montoBsInput = document.getElementById("montoBs");
    const montoRefInput = document.getElementById("montoRef");

    if (!monedaSelect || !montoBsInput || !montoRefInput) {
      return;
    }

    const selectedCurrency = monedaSelect.value;

    // Limpiar valores y listeners anteriores
    montoBsInput.removeEventListener("input", calculateBsToUsd);
    montoBsInput.removeEventListener("keyup", calculateBsToUsd);
    montoBsInput.removeEventListener("blur", formatBsDecimal);
    montoBsInput.removeEventListener("input", calculateUsdToBs);
    montoBsInput.removeEventListener("keyup", calculateUsdToBs);
    montoRefInput.removeEventListener("input", calculateBsToUsd);
    montoRefInput.removeEventListener("keyup", calculateBsToUsd);
    montoRefInput.removeEventListener("input", calculateUsdToBs);
    montoRefInput.removeEventListener("keyup", calculateUsdToBs);
    montoRefInput.removeEventListener("blur", formatUsdDecimal);

    if (selectedCurrency === "bs") {
      // Bolívares seleccionado: habilitar Monto Bs, bloquear Monto REF
      montoBsInput.removeAttribute("disabled");
      montoBsInput.removeAttribute("readonly");
      montoBsInput.required = true;
      montoBsInput.style.backgroundColor = "#fff";
      montoBsInput.style.cursor = "text";
      montoBsInput.style.opacity = "1";
      
      // Mostrar sufijo "Bs" en Monto Bs
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      if (montoBsSuffix) {
        montoBsSuffix.style.display = "block";
        montoBsSuffix.textContent = "Bs";
      }
      
      montoRefInput.setAttribute("disabled", "disabled");
      montoRefInput.removeAttribute("required");
      montoRefInput.value = "";
      montoRefInput.style.backgroundColor = "#e9ecef";
      montoRefInput.style.cursor = "not-allowed";
      montoRefInput.style.opacity = "0.6";
      
      // Ocultar sufijo "USD" en Monto REF
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      if (montoRefSuffix) {
        montoRefSuffix.style.display = "none";
      }

      // Remover listeners anteriores y agregar nuevos para calcular conversión a USD
      montoBsInput.removeEventListener("input", calculateBsToUsd);
      montoBsInput.removeEventListener("keyup", calculateBsToUsd);
      montoBsInput.removeEventListener("blur", formatBsDecimal);
      montoBsInput.removeEventListener("input", calculateUsdToBs);
      montoBsInput.addEventListener("input", calculateBsToUsd);
      montoBsInput.addEventListener("keyup", calculateBsToUsd);
      montoBsInput.addEventListener("blur", formatBsDecimal);
      
      // Agregar listener al campo Monto REF para actualizar Monto del Equipo cuando se calcula la conversión
      montoRefInput.removeEventListener("input", updateMontoEquipo);
      montoRefInput.removeEventListener("keyup", updateMontoEquipo);
      montoRefInput.addEventListener("input", updateMontoEquipo);
      montoRefInput.addEventListener("keyup", updateMontoEquipo);
      
      // Inicializar el campo Monto del Equipo
      updateMontoEquipo();
      
    } else if (selectedCurrency === "usd") {
      // Dólares seleccionado: bloquear Monto Bs, habilitar Monto REF
      montoBsInput.setAttribute("disabled", "disabled");
      montoBsInput.removeAttribute("required");
      montoBsInput.value = "";
      montoBsInput.style.backgroundColor = "#e9ecef";
      montoBsInput.style.cursor = "not-allowed";
      montoBsInput.style.opacity = "0.6";
      
      // Ocultar sufijo "Bs" en Monto Bs
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      if (montoBsSuffix) {
        montoBsSuffix.style.display = "none";
      }
      
      montoRefInput.removeAttribute("disabled");
      montoRefInput.removeAttribute("readonly");
      montoRefInput.required = true;
      montoRefInput.style.backgroundColor = "#fff";
      montoRefInput.style.cursor = "text";
      montoRefInput.style.opacity = "1";
      
      // Mostrar sufijo "USD" en Monto REF
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      if (montoRefSuffix) {
        montoRefSuffix.style.display = "block";
        montoRefSuffix.textContent = "USD";
      }

      // Remover listeners anteriores y agregar nuevos para calcular conversión a Bs
      montoRefInput.removeEventListener("input", calculateBsToUsd);
      montoRefInput.removeEventListener("input", calculateUsdToBs);
      montoRefInput.removeEventListener("keyup", calculateUsdToBs);
      montoRefInput.removeEventListener("blur", formatUsdDecimal);
      montoRefInput.addEventListener("input", calculateUsdToBs);
      montoRefInput.addEventListener("keyup", calculateUsdToBs);
      montoRefInput.addEventListener("blur", formatUsdDecimal);
      
      // Agregar listener al campo Monto REF para actualizar Monto del Equipo cuando se escribe directamente
      montoRefInput.removeEventListener("input", updateMontoEquipo);
      montoRefInput.removeEventListener("keyup", updateMontoEquipo);
      montoRefInput.addEventListener("input", updateMontoEquipo);
      montoRefInput.addEventListener("keyup", updateMontoEquipo);
      
      // Inicializar el campo Monto del Equipo
      updateMontoEquipo();
      
    } else {
      // Ninguna selección: deshabilitar ambos
      montoBsInput.setAttribute("disabled", "disabled");
      montoBsInput.removeAttribute("required");
      montoBsInput.value = "";
      montoBsInput.style.backgroundColor = "#e9ecef";
      montoBsInput.style.cursor = "not-allowed";
      montoBsInput.style.opacity = "0.6";
      
      // Ocultar sufijo "Bs" en Monto Bs
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      if (montoBsSuffix) {
        montoBsSuffix.style.display = "none";
      }
      
      montoRefInput.setAttribute("disabled", "disabled");
      montoRefInput.removeAttribute("required");
      montoRefInput.value = "";
      montoRefInput.style.backgroundColor = "#e9ecef";
      montoRefInput.style.cursor = "not-allowed";
      montoRefInput.style.opacity = "0.6";
      
      // Ocultar sufijo "USD" en Monto REF
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      if (montoRefSuffix) {
        montoRefSuffix.style.display = "none";
      }
      
    }
  }

  // Función para formatear el campo Monto Bs con 2 decimales
  function formatBsDecimal() {
    const montoBsInput = document.getElementById("montoBs");
    if (!montoBsInput || montoBsInput.disabled) {
      return;
    }

    const value = montoBsInput.value;
    if (value && value.trim() !== "") {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        montoBsInput.value = numValue.toFixed(2);
      }
    }
  }

  // Función para formatear el campo USD a 2 decimales cuando pierde el foco
  function formatUsdDecimal() {
    const montoRefInput = document.getElementById("montoRef");
    if (!montoRefInput || montoRefInput.disabled) {
      return;
    }

    const value = montoRefInput.value;
    if (value && value.trim() !== "") {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        montoRefInput.value = numValue.toFixed(2);
      }
    }
  }

  // Función para actualizar el campo "Monto del Equipo" con el valor de USD
  function updateMontoEquipo() {
    const montoRefInput = document.getElementById("montoRef");
    const montoEquipoElement = document.getElementById("montoEquipo");
    
    if (!montoRefInput || !montoEquipoElement) {
      return;
    }

    const montoUsd = parseFloat(montoRefInput.value) || 0;
    if (montoUsd > 0) {
      montoEquipoElement.textContent = "$" + montoUsd.toFixed(2);
    } else {
      montoEquipoElement.textContent = "$0.00";
    }
  }

  // Función para calcular conversión de Bs a USD
  function calculateBsToUsd() {
    const montoBsInput = document.getElementById("montoBs");
    const montoRefInput = document.getElementById("montoRef");

    if (!montoBsInput || !montoRefInput) {
      return;
    }

    if (!exchangeRate) {
      loadExchangeRate();
      // Esperar un momento y reintentar
      setTimeout(function() {
        if (exchangeRate) {
          calculateBsToUsd();
        } else {
          montoRefInput.value = "";
        }
      }, 500);
      return;
    }

    const montoBs = parseFloat(montoBsInput.value) || 0;
    
    if (montoBs > 0 && exchangeRate > 0) {
      const montoUsd = montoBs / exchangeRate;
      montoRefInput.value = montoUsd.toFixed(2);
      
      // Mostrar sufijo USD cuando se calcula la conversión
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      if (montoRefSuffix) {
        montoRefSuffix.style.display = "block";
        montoRefSuffix.textContent = "USD";
      }
      
      // ✅ NO formatear Monto Bs mientras el usuario está escribiendo
      // El formateo se hace solo cuando el campo pierde el foco (formatBsDecimal en blur)
      // Esto permite que el usuario escriba sin que el cursor se mueva al final
      
      // Actualizar el campo "Monto del Equipo"
      updateMontoEquipo();
      
    } else {
      montoRefInput.value = "";
      // ✅ NO formatear Monto Bs mientras el usuario está escribiendo
      // El formateo se hace solo cuando el campo pierde el foco (formatBsDecimal en blur)
      // Ocultar sufijo si no hay valor
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      if (montoRefSuffix) {
        montoRefSuffix.style.display = "none";
      }
      // Actualizar el campo "Monto del Equipo" a $0.00
      updateMontoEquipo();
    }
  }

  // Función para calcular conversión de USD a Bs
  function calculateUsdToBs() {
    const montoBsInput = document.getElementById("montoBs");
    const montoRefInput = document.getElementById("montoRef");

    if (!montoBsInput || !montoRefInput) {
      return;
    }

    if (!exchangeRate) {
      loadExchangeRate();
      // Esperar un momento y reintentar
      setTimeout(function() {
        if (exchangeRate) {
          calculateUsdToBs();
        } else {
          montoBsInput.value = "";
        }
      }, 500);
      return;
    }

    const montoUsd = parseFloat(montoRefInput.value) || 0;
    
    if (montoUsd > 0 && exchangeRate > 0) {
      const montoBs = montoUsd * exchangeRate;
      montoBsInput.value = montoBs.toFixed(2);
      
      // Mostrar sufijo Bs cuando se calcula la conversión
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      if (montoBsSuffix) {
        montoBsSuffix.style.display = "block";
        montoBsSuffix.textContent = "Bs";
      }
      
      // Actualizar el campo "Monto del Equipo"
      updateMontoEquipo();
      
    } else {
      montoBsInput.value = "";
      // Ocultar sufijo si no hay valor
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      if (montoBsSuffix) {
        montoBsSuffix.style.display = "none";
      }
      // Actualizar el campo "Monto del Equipo" a $0.00
      updateMontoEquipo();
    }
  }

  // Cargar métodos de pago cuando se abre el modal
  function setupPaymentMethodsLoader() {
    const modal = document.getElementById("modalAgregarDatosPago");
    if (!modal) {
      return;
    }

    // Usar el evento de Bootstrap 5
    modal.addEventListener("show.bs.modal", function() {
      loadExchangeRate();
      
      // INICIALIZAR campos de moneda en estado inicial (deshabilitados)
      const montoBs = document.getElementById("montoBs");
      const montoRef = document.getElementById("montoRef");
      const moneda = document.getElementById("moneda");
      const montoBsSuffix = document.getElementById("montoBsSuffix");
      const montoRefSuffix = document.getElementById("montoRefSuffix");
      
      // Resetear select de moneda a "Seleccionar"
      if (moneda) {
        moneda.value = "";
      }
      
      // Asegurar que los campos de Monto Bs y Monto REF estén deshabilitados y en "0.00"
      if (montoBs) {
        montoBs.value = "0.00";
        montoBs.disabled = true;
        montoBs.setAttribute("disabled", "disabled");
        // Remover cualquier listener que pueda estar activo
        montoBs.removeEventListener("input", calculateBsToUsd);
        montoBs.removeEventListener("keyup", calculateBsToUsd);
        montoBs.removeEventListener("blur", formatBsDecimal);
      }
      
      if (montoRef) {
        montoRef.value = "0.00";
        montoRef.disabled = true;
        montoRef.setAttribute("disabled", "disabled");
        // Remover cualquier listener que pueda estar activo
        montoRef.removeEventListener("input", calculateUsdToBs);
        montoRef.removeEventListener("keyup", calculateUsdToBs);
        montoRef.removeEventListener("blur", formatUsdDecimal);
        montoRef.removeEventListener("input", updateMontoEquipo);
        montoRef.removeEventListener("keyup", updateMontoEquipo);
      }
      
      // Ocultar sufijos de moneda
      if (montoBsSuffix) {
        montoBsSuffix.style.display = "none";
        montoBsSuffix.style.visibility = "hidden";
      }
      if (montoRefSuffix) {
        montoRefSuffix.style.display = "none";
        montoRefSuffix.style.visibility = "hidden";
      }
      
      // Ocultar campos de banco al abrir el modal
      const bancoFieldsContainer = document.getElementById("bancoFieldsContainer");
      const bancoOrigen = document.getElementById("bancoOrigen");
      const bancoDestino = document.getElementById("bancoDestino");
      
      if (bancoFieldsContainer) {
        bancoFieldsContainer.style.display = "none";
      }
      if (bancoOrigen) {
        bancoOrigen.value = "";
        bancoOrigen.required = false;
      }
      if (bancoDestino) {
        bancoDestino.value = "";
        bancoDestino.required = false;
      }
      
      // Ocultar campos de Pago Móvil al abrir el modal
      const pagoMovilFieldsContainer = document.getElementById("pagoMovilFieldsContainer");
      if (pagoMovilFieldsContainer) {
        pagoMovilFieldsContainer.style.display = "none";
      }
      if (typeof limpiarCamposPagoMovil === 'function') {
        limpiarCamposPagoMovil();
      }
      
      // Asegurar que el campo de moneda esté desbloqueado al abrir
      if (moneda) {
        moneda.disabled = false;
        moneda.removeAttribute("disabled");
        moneda.style.backgroundColor = "";
        moneda.style.cursor = "";
      }
      
      // Cargar el serial del modal anterior (Falla Nivel 2) si aún no está cargado
      const serialSelect = document.getElementById("serialSelect");
      const serialPosPago = document.getElementById("serialPosPago");
      
      if (serialSelect && serialPosPago && !serialPosPago.value) {
        const serialValue = serialSelect.value || "";
        serialPosPago.value = serialValue;
      }
    });

    modal.addEventListener("hidden.bs.modal", function() {
      // Limpiar el formulario cuando se cierra el modal
      limpiarFormularioDatosPago();
      
      // Asegurar que todo esté en estado inicial después de cerrar
      setTimeout(function() {
        const montoBsSuffix = document.getElementById("montoBsSuffix");
        const montoRefSuffix = document.getElementById("montoRefSuffix");
        const montoBs = document.getElementById("montoBs");
        const montoRef = document.getElementById("montoRef");
        const moneda = document.getElementById("moneda");
        const montoEquipoElement = document.getElementById("montoEquipo");
        
        // Ocultar sufijos completamente
        if (montoBsSuffix) {
          montoBsSuffix.style.display = "none";
          montoBsSuffix.style.visibility = "hidden";
        }
        if (montoRefSuffix) {
          montoRefSuffix.style.display = "none";
          montoRefSuffix.style.visibility = "hidden";
        }
        
        // Asegurar campos en estado inicial
        if (montoBs) {
          montoBs.value = "0.00";
          montoBs.disabled = true;
          montoBs.setAttribute("disabled", "disabled");
        }
        if (montoRef) {
          montoRef.value = "0.00";
          montoRef.disabled = true;
          montoRef.setAttribute("disabled", "disabled");
        }
        if (moneda) {
          moneda.value = "";
        }
        if (montoEquipoElement) {
          montoEquipoElement.textContent = "$0.00";
        }
      }, 100);
      
      // El botón siempre permanece habilitado, incluso al cerrar
      if (downloadAnticiBtn) {
        downloadAnticiBtn.disabled = false;
        downloadAnticiBtn.style.opacity = "1";
        downloadAnticiBtn.style.cursor = "pointer";
      }
      
      // Limpiar el input de archivo
      if (anticipoInput) {
        anticipoInput.value = "";
        updateAnticipoButtonState();
      }
      
      // Actualizar la visibilidad del icono basándose en las condiciones actuales
      setTimeout(function() {
        updateIconoAgregarInfoVisibility();
      }, 100);
    });
  }

  // Configurar el loader cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      setupPaymentMethodsLoader();
      // También configurar el listener del select de moneda directamente
      setupCurrencyListener();
      // Configurar listener de forma de pago
      setupFormaPagoListener();
      // Configurar generación automática del número de registro
      setupAutoRegistrationNumber();
      // Configurar validación de campos numéricos
      setupNumericValidation();
    });
  } else {
    setupPaymentMethodsLoader();
    setupCurrencyListener();
    setupFormaPagoListener();
    setupAutoRegistrationNumber();
    setupNumericValidation();
  }

  // También configurar si modalAgregarDatosPago ya está definido
  if (modalAgregarDatosPago) {
    setupPaymentMethodsLoader();
    setupCurrencyListener();
    setupFormaPagoListener();
    setupAutoRegistrationNumber();
    setupNumericValidation();
  }

  // Función para configurar el listener del select de forma de pago
  function setupFormaPagoListener() {
    const formaPagoSelect = document.getElementById("formaPago");
    if (!formaPagoSelect) {
      return;
    }

    // Remover listener anterior si existe
    formaPagoSelect.removeEventListener("change", handleFormaPagoChange);
    
    // Agregar nuevo listener
    formaPagoSelect.addEventListener("change", handleFormaPagoChange);
    
  }

  // Función para manejar el cambio en la forma de pago
  function handleFormaPagoChange() {
    const formaPagoSelect = document.getElementById("formaPago");
    const monedaSelect = document.getElementById("moneda");
    const bancoFieldsContainer = document.getElementById("bancoFieldsContainer");
    const bancoOrigen = document.getElementById("bancoOrigen");
    const bancoDestino = document.getElementById("bancoDestino");
    const pagoMovilFieldsContainer = document.getElementById("pagoMovilFieldsContainer");
    
    if (!formaPagoSelect || !monedaSelect) {
      return;
    }

    const selectedPaymentMethodId = parseInt(formaPagoSelect.value);
    const selectedOption = formaPagoSelect.options[formaPagoSelect.selectedIndex];
    const selectedPaymentMethodName = selectedOption ? selectedOption.textContent.trim() : "";
    
    // Si se selecciona "Transferencia" (id_payment_method = 2)
    if (selectedPaymentMethodId === 2) {
      
      // Establecer moneda en "Bolívares (Bs)"
      monedaSelect.value = "bs";
      
      // Bloquear el campo de moneda
      monedaSelect.disabled = true;
      monedaSelect.setAttribute("disabled", "disabled");
      monedaSelect.style.backgroundColor = "#e9ecef";
      monedaSelect.style.cursor = "not-allowed";
      
      // Mostrar campos de Banco Origen y Banco Destino
      if (bancoFieldsContainer) {
        bancoFieldsContainer.style.display = "block";
        // Asegurar que las clases de Bootstrap estén aplicadas
        if (!bancoFieldsContainer.classList.contains("row")) {
          bancoFieldsContainer.classList.add("row");
        }
        if (!bancoFieldsContainer.classList.contains("g-2")) {
          bancoFieldsContainer.classList.add("g-2");
        }
        
        // Cargar los bancos desde la base de datos
        loadBancos();
      }
      
      // Ocultar campos de Pago Móvil
      if (pagoMovilFieldsContainer) {
        pagoMovilFieldsContainer.style.display = "none";
        // Limpiar campos de Pago Móvil
        limpiarCamposPagoMovil();
      }
      
      // Hacer los campos de banco requeridos
      if (bancoOrigen) {
        bancoOrigen.required = true;
      }
      if (bancoDestino) {
        bancoDestino.required = true;
      }
      
      // Activar la lógica de conversión para Bolívares
      if (typeof handleCurrencyChange === 'function') {
        handleCurrencyChange();
      }
      
    } 
    // Si se selecciona "Pago Móvil" (detectar por nombre o ID)
    else if (selectedPaymentMethodName.toLowerCase().includes("móvil") || selectedPaymentMethodName.toLowerCase().includes("movil") || selectedPaymentMethodId === 3) {
      
      // Establecer moneda en "Bolívares (Bs)"
      monedaSelect.value = "bs";
      
      // Bloquear el campo de moneda
      monedaSelect.disabled = true;
      monedaSelect.setAttribute("disabled", "disabled");
      monedaSelect.style.backgroundColor = "#e9ecef";
      monedaSelect.style.cursor = "not-allowed";
      
      // Ocultar campos de Transferencia
      if (bancoFieldsContainer) {
        bancoFieldsContainer.style.display = "none";
      }
      if (bancoOrigen) {
        bancoOrigen.value = "";
        bancoOrigen.required = false;
      }
      if (bancoDestino) {
        bancoDestino.value = "";
        bancoDestino.required = false;
      }
      
      // Mostrar campos de Pago Móvil
      if (pagoMovilFieldsContainer) {
        pagoMovilFieldsContainer.style.display = "block";
        
        // Establecer valores por defecto del Destino y bloquearlos
        const destinoRifTipo = document.getElementById("destinoRifTipo");
        const destinoRifNumero = document.getElementById("destinoRifNumero");
        const destinoTelefono = document.getElementById("destinoTelefono");
        const destinoBanco = document.getElementById("destinoBanco");
        
        if (destinoRifTipo) {
          destinoRifTipo.value = "J";
          destinoRifTipo.disabled = true;
          destinoRifTipo.setAttribute("disabled", "disabled");
          destinoRifTipo.style.backgroundColor = "#e9ecef";
          destinoRifTipo.style.cursor = "not-allowed";
        }
        if (destinoRifNumero) {
          destinoRifNumero.value = "002916150";
          destinoRifNumero.readOnly = true;
          destinoRifNumero.setAttribute("readonly", "readonly");
          destinoRifNumero.style.backgroundColor = "#e9ecef";
          destinoRifNumero.style.cursor = "not-allowed";
        }
        if (destinoTelefono) {
          destinoTelefono.value = "04122632231";
          destinoTelefono.readOnly = true;
          destinoTelefono.setAttribute("readonly", "readonly");
          destinoTelefono.style.backgroundColor = "#e9ecef";
          destinoTelefono.style.cursor = "not-allowed";
        }
        if (destinoBanco) {
          destinoBanco.disabled = true;
          destinoBanco.setAttribute("disabled", "disabled");
          destinoBanco.style.backgroundColor = "#e9ecef";
          destinoBanco.style.cursor = "not-allowed";
        }
        
        // Cargar bancos en los selects de Pago Móvil (seleccionará Banesco automáticamente)
        loadBancosPagoMovil();
      }
      
      // Activar la lógica de conversión para Bolívares
      if (typeof handleCurrencyChange === 'function') {
        handleCurrencyChange();
      }
      
    } else {
      
      // Si se selecciona otra forma de pago
      // Desbloquear el campo de moneda
      monedaSelect.disabled = false;
      monedaSelect.removeAttribute("disabled");
      monedaSelect.style.backgroundColor = "";
      monedaSelect.style.cursor = "";
      
      // Ocultar campos de Banco Origen y Banco Destino (Transferencia)
      if (bancoFieldsContainer) {
        bancoFieldsContainer.style.display = "none";
      }
      
      // Ocultar campos de Pago Móvil
      if (pagoMovilFieldsContainer) {
        pagoMovilFieldsContainer.style.display = "none";
        limpiarCamposPagoMovil();
      }
      
      // Limpiar y hacer opcionales los campos de banco
      if (bancoOrigen) {
        bancoOrigen.value = "";
        bancoOrigen.required = false;
      }
      if (bancoDestino) {
        bancoDestino.value = "";
        bancoDestino.required = false;
      }
      
    }
  }

  // Función para limpiar campos de Pago Móvil
  function limpiarCamposPagoMovil() {
    const destinoRifTipo = document.getElementById("destinoRifTipo");
    const destinoRifNumero = document.getElementById("destinoRifNumero");
    const destinoTelefono = document.getElementById("destinoTelefono");
    const destinoBanco = document.getElementById("destinoBanco");
    const origenRifTipo = document.getElementById("origenRifTipo");
    const origenRifNumero = document.getElementById("origenRifNumero");
    const origenTelefono = document.getElementById("origenTelefono");
    const origenBanco = document.getElementById("origenBanco");
    
    // Restaurar valores por defecto del Destino y bloquearlos
    if (destinoRifTipo) {
      destinoRifTipo.value = "J";
      destinoRifTipo.disabled = true;
      destinoRifTipo.setAttribute("disabled", "disabled");
      destinoRifTipo.style.backgroundColor = "#e9ecef";
      destinoRifTipo.style.cursor = "not-allowed";
    }
    if (destinoRifNumero) {
      destinoRifNumero.value = "002916150";
      destinoRifNumero.readOnly = true;
      destinoRifNumero.setAttribute("readonly", "readonly");
      destinoRifNumero.style.backgroundColor = "#e9ecef";
      destinoRifNumero.style.cursor = "not-allowed";
    }
    if (destinoTelefono) {
      destinoTelefono.value = "04122632231";
      destinoTelefono.readOnly = true;
      destinoTelefono.setAttribute("readonly", "readonly");
      destinoTelefono.style.backgroundColor = "#e9ecef";
      destinoTelefono.style.cursor = "not-allowed";
    }
    if (destinoBanco) {
      destinoBanco.disabled = true;
      destinoBanco.setAttribute("disabled", "disabled");
      destinoBanco.style.backgroundColor = "#e9ecef";
      destinoBanco.style.cursor = "not-allowed";
    }
    // El banco se seleccionará automáticamente cuando se carguen los bancos
    
    // Limpiar campos del Origen
    if (origenRifTipo) {
      origenRifTipo.value = "";
      origenRifTipo.disabled = false;
      origenRifTipo.removeAttribute("disabled");
      origenRifTipo.style.backgroundColor = "";
      origenRifTipo.style.cursor = "";
    }
    if (origenRifNumero) {
      origenRifNumero.value = "";
      origenRifNumero.readOnly = false;
      origenRifNumero.removeAttribute("readonly");
      origenRifNumero.style.backgroundColor = "";
      origenRifNumero.style.cursor = "";
    }
    if (origenTelefono) {
      origenTelefono.value = "";
      origenTelefono.readOnly = false;
      origenTelefono.removeAttribute("readonly");
      origenTelefono.style.backgroundColor = "";
      origenTelefono.style.cursor = "";
    }
    if (origenBanco) {
      origenBanco.value = "";
      origenBanco.disabled = false;
      origenBanco.removeAttribute("disabled");
      origenBanco.style.backgroundColor = "";
      origenBanco.style.cursor = "";
    }
  }

  // Función para cargar bancos en los selects de Pago Móvil
  function loadBancosPagoMovil() {
    const destinoBanco = document.getElementById("destinoBanco");
    const origenBanco = document.getElementById("origenBanco");
    
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
      return;
    }

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetBancos";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          
          if (data.success && data.bancos && data.bancos.length > 0) {
            // Limpiar y poblar destinoBanco
            if (destinoBanco) {
              destinoBanco.innerHTML = '<option value="">Seleccione</option>';
              let banescoFound = false;
              data.bancos.forEach(function(banco) {
                const option = document.createElement("option");
                option.value = banco.codigobanco || banco.id;
                const bancoName = banco.ibp || banco.nombre || banco.name;
                option.textContent = bancoName;
                // Seleccionar Banesco por defecto
                if (bancoName && bancoName.toLowerCase().includes("banesco")) {
                  option.selected = true;
                  banescoFound = true;
                }
                destinoBanco.appendChild(option);
              });
              
              // Bloquear el banco del destino después de cargar
              if (banescoFound) {
                destinoBanco.disabled = true;
                destinoBanco.setAttribute("disabled", "disabled");
                destinoBanco.style.backgroundColor = "#e9ecef";
                destinoBanco.style.cursor = "not-allowed";
              }
            }
            
            // Limpiar y poblar origenBanco
            if (origenBanco) {
              origenBanco.innerHTML = '<option value="">Seleccione</option>';
              data.bancos.forEach(function(banco) {
                const option = document.createElement("option");
                option.value = banco.codigobanco || banco.id;
                option.textContent = banco.ibp || banco.nombre || banco.name;
                origenBanco.appendChild(option);
              });
            }
          }
        } catch (error) {
        }
      }
    };
    
    xhr.onerror = function() {
    };
    
    xhr.send();
  }

   // Función para configurar el listener del select de moneda
  function setupCurrencyListener() {
    const monedaSelect = document.getElementById("moneda");
    if (monedaSelect) {
      // Remover listener anterior si existe
      monedaSelect.removeEventListener("change", handleCurrencyChange);
      // Agregar nuevo listener solo si no está deshabilitado
      if (!monedaSelect.disabled) {
        monedaSelect.addEventListener("change", function(e) {
          handleCurrencyChange();
        });
      }
      // Ejecutar una vez para establecer el estado inicial
      handleCurrencyChange();
    } else {
      // Si no existe, intentar de nuevo después de un delay
      setTimeout(setupCurrencyListener, 500);
    }
  }

checkEnvio.addEventListener("change", function() {
    updateFileUploadButtonVisibility();
    // Actualizar visibilidad del icono (se oculta si se selecciona Envío, se muestra si se deselecciona y solo Anticipo está seleccionado)
    updateIconoAgregarInfoVisibility();
      
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
        clearFileInput("EnvioInput");
        clearFileSpan(fileChosenSpanEnvio);
        // Verificar nuevamente si el icono debe mostrarse después de deseleccionar
        updateIconoAgregarInfoVisibility();
    }
});


  checkAnticipo.addEventListener("change", function() {
    updateFileUploadButtonVisibility();
    // Actualizar la visibilidad del icono cuando se selecciona/deselecciona Anticipo
    updateIconoAgregarInfoVisibility();
      
    // Si se deselecciona, limpiar inmediatamente el archivo
    if (!this.checked) {
      clearFileInput("AnticipoInput");
      clearFileSpan(fileChosenSpanAntici);
      updateAnticipoButtonState();
    } else {
      // Si se selecciona, mostrar el botón pero deshabilitado hasta que se cargue un archivo
      updateAnticipoButtonState();
    }
  });

  // Handle button clicks to trigger file input click (simula un clic en el input de tipo file oculto)
  downloadEnvioBtn.addEventListener("click", () => envioInput.click());
  downloadExoBtn.addEventListener("click", () => exoneracionInput.click());
  
  // Event listener para el botón de anticipo con validación de estado
  if (downloadAnticiBtn) {
    downloadAnticiBtn.addEventListener("click", function(e) {
      if (this.disabled) {
        e.preventDefault();
        e.stopPropagation();
        // Mostrar tooltip cuando se intenta hacer click en el botón deshabilitado
        if (disabledTooltipAnticipo) {
          disabledTooltipAnticipo.style.display = "block";
          setTimeout(() => {
            if (disabledTooltipAnticipo) {
              disabledTooltipAnticipo.style.display = "none";
            }
          }, 3000);
        }
        return false;
      } else {
        anticipoInput.click();
      }
    });

    // Mostrar tooltip al hacer hover sobre el botón deshabilitado
    downloadAnticiBtn.addEventListener("mouseenter", function() {
      if (this.disabled && disabledTooltipAnticipo) {
        disabledTooltipAnticipo.style.display = "block";
      }
    });

    downloadAnticiBtn.addEventListener("mouseleave", function() {
      if (disabledTooltipAnticipo) {
        disabledTooltipAnticipo.style.display = "none";
      }
    });
  }

  // Event listener para el botón de envío principal del formulario
  sendForm2Button.addEventListener("click", function () {
    const idStatusPayment = UpdateGuarantees(); // Obtiene el estado de garantía/pago
    SendDataFailure2(idStatusPayment); // Envía los datos de la falla con ese estado
  });


  // --- Inicialización al Cargar la Página ---
  updateDocumentUploadVisibility(); // Establecer la visibilidad correcta de los elementos al cargar.
  
  // Función para actualizar el icono cuando el modal se muestra
  function actualizarIconoAlMostrarModal() {
    setTimeout(function() {
      updateIconoAgregarInfoVisibility();
    }, 200);
  }
  
  // Forzar la actualización del icono después de un pequeño delay para asegurar que el DOM esté completamente cargado
  actualizarIconoAlMostrarModal();
  
  // Event listener para cuando el modal "miModal" se muestra
  const miModalElement = document.getElementById("miModal");
  if (miModalElement) {
    miModalElement.addEventListener("shown.bs.modal", function() {
      // Actualizar la visibilidad del icono cuando el modal se muestra
      setTimeout(function() {
        updateIconoAgregarInfoVisibility();
      }, 200);
      // Asegurar que el botón de anticipo esté deshabilitado al mostrar el modal
      updateAnticipoButtonState();
    });
    
    // Event listener para cuando el modal "miModal" se oculta (se cierra)
    miModalElement.addEventListener("hidden.bs.modal", function() {
      // Ocultar el icono de detalles de pago cuando se cierra el modal
      const iconoAgregarInfoContainer = document.getElementById("iconoAgregarInfoContainer");
      const iconoAgregarInfo = document.getElementById("iconoAgregarInfo");
      if (iconoAgregarInfoContainer) {
        iconoAgregarInfoContainer.style.display = "none";
      }
      if (iconoAgregarInfo) {
        iconoAgregarInfo.style.visibility = "hidden";
        iconoAgregarInfo.style.opacity = "0";
        iconoAgregarInfo.style.display = "none";
      }
    });
  }
  
  // Event listener para abrir el modal cuando se hace clic en el icono
  if (iconoAgregarInfo) {
    iconoAgregarInfo.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Obtener el serial del modal anterior (Falla Nivel 2)
      const serialSelect = document.getElementById("serialSelect");
      const serialPosPago = document.getElementById("serialPosPago");
      
      if (serialSelect && serialPosPago) {
        const serialValue = serialSelect.value || "";
        serialPosPago.value = serialValue;
      } else {
        console.warn("No se encontró el campo serialSelect o serialPosPago");
        if (serialPosPago) {
          serialPosPago.value = "";
        }
      }
      
      // Establecer la fecha de hoy automáticamente en el campo fechaCarga
      const fechaCarga = document.getElementById("fechaCarga");
      if (fechaCarga) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        fechaCarga.value = `${year}-${month}-${day}`;
      }
      
      const modalElement = document.getElementById("modalAgregarDatosPago");
      if (modalElement) {
        // Verificar si Bootstrap está disponible
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          // Usar Bootstrap 5 para abrir el modal
          try {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          } catch (error) {
            console.error("Error al abrir modal con Bootstrap:", error);
            // Fallback manual
            modalElement.style.display = "block";
            modalElement.classList.add("show");
            document.body.classList.add("modal-open");
            const existingBackdrop = document.querySelector(".modal-backdrop");
            if (!existingBackdrop) {
              const backdrop = document.createElement("div");
              backdrop.className = "modal-backdrop fade show";
              document.body.appendChild(backdrop);
            }
          }
        } else if (typeof $ !== 'undefined' && $.fn.modal) {
          // Fallback para Bootstrap 4 o jQuery
          $(modalElement).modal('show');
        } else {
          // Fallback manual
          modalElement.style.display = "block";
          modalElement.classList.add("show");
          document.body.classList.add("modal-open");
          const existingBackdrop = document.querySelector(".modal-backdrop");
          if (!existingBackdrop) {
            const backdrop = document.createElement("div");
            backdrop.className = "modal-backdrop fade show";
            document.body.appendChild(backdrop);
          }
        }
      } else {
        console.error("No se encontró el elemento modal con ID: modalAgregarDatosPago");
      }
    });
    
    // También agregar un hover effect para mejor UX (solo si es SVG)
    if (iconoAgregarInfo.tagName === "svg" || iconoAgregarInfo.tagName === "SVG") {
      iconoAgregarInfo.addEventListener("mouseenter", function() {
        this.style.fill = "#0d6efd";
        this.style.transform = "scale(1.1)";
      });
      
      iconoAgregarInfo.addEventListener("mouseleave", function() {
        this.style.fill = "#17a2b8";
        this.style.transform = "scale(1)";
      });
    } else {
      // Si es un icono de FontAwesome, usar color en lugar de fill
      iconoAgregarInfo.addEventListener("mouseenter", function() {
        this.style.color = "#0d6efd";
        this.style.transform = "scale(1.1)";
      });
      
      iconoAgregarInfo.addEventListener("mouseleave", function() {
        this.style.color = "#17a2b8";
        this.style.transform = "scale(1)";
      });
    }
  }
  
  // Asegurar que el botón de anticipo esté siempre habilitado al inicio
  if (downloadAnticiBtn) {
    downloadAnticiBtn.disabled = false;
    downloadAnticiBtn.style.opacity = "1";
    downloadAnticiBtn.style.cursor = "pointer";
  }
  
  // Establecer la fecha de hoy automáticamente cuando se abre el modal de datos de pago
  const modalAgregarDatosPagoElement = document.getElementById("modalAgregarDatosPago");
  if (modalAgregarDatosPagoElement) {
    modalAgregarDatosPagoElement.addEventListener("shown.bs.modal", function() {
      // Cargar la tasa de cambio del día de hoy cuando se abre el modal
      if (typeof loadExchangeRateToday === 'function') {
        loadExchangeRateToday();
      }
      
      const fechaCarga = document.getElementById("fechaCarga");
      if (fechaCarga) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        fechaCarga.value = `${year}-${month}-${day}`;
      }
    });
  }
  
  // Asegurar que el icono se actualice al cargar la página
  setTimeout(function() {
    updateIconoAgregarInfoVisibility();
  }, 500);
  
  // Luego llamar a la función que verifica el estado (siempre habilitado)
  updateAnticipoButtonState();

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

  const textarea = document.getElementById("explicacionFalla");
  const descrpFailure_text = textarea.options ? textarea.options[textarea.selectedIndex].text  : textarea.value;

  const serial = document.getElementById("serialSelect1").value; // Usar serialSelect
  const falla = document.getElementById("FallaSelect1").value;
  const id_user = document.getElementById("id_user").value;

  const fallaSelect = document.getElementById("FallaSelect1");
  const fallaValue = fallaSelect.value;
  const fallaText = fallaSelect.options[fallaSelect.selectedIndex].text; // Captura el texto

  if (
    // Campos que ya estabas verificando:
    !descrpFailure_text || 
    descrpFailure_text.trim() === "" || 
    !nivelFalla || 
    nivelFalla === "" || 
    !nivelFallaText || 
    nivelFallaText.trim() === "" || 
    nivelFallaText === "Seleccione" || 
    
    // ⚠️ AÑADE ESTAS VALIDACIONES FALTANTES:
    !serial || // Valida Serial
    serial.trim() === "" ||
    !falla || // Valida el ID de la Falla
    falla === "" ||
    falla === "Seleccione" // Si "Seleccione" es el valor por defecto
) {
    // ⚠️ FIX: Ocultar el overlay ANTES de mostrar el Swal y salir
    if (typeof hideExportLoading === 'function') {
        hideExportLoading(); 
    }
    
    // Puedes actualizar el mensaje para que sea más claro sobre qué falta.
    Swal.fire({
      icon: "warning",
      title: "Campos requeridos",
      text: "Por favor, complete todos los campos obligatorios: Falla y Descripción.",
      color: "black",
      confirmButtonText: "OK",
      confirmButtonColor: "#003594",
    });
    return; // Detener la ejecución si la validación falla
}

  // VERIFICAR SI YA EXISTE UN TICKET EN PROCESO PARA ESTE SERIAL
  verificarTicketEnProceso(serial)
    .then((response) => {
      if (response.ticket_en_proceso) {
        // 🚨 FIX: Llamar al cierre forzado del Overlay.
        if (typeof window.hideLoadingOverlay === 'function') {
            window.hideLoadingOverlay(true); // Pasar 'true' para forzar el cierre inmediato
        }
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
      hideExportLoading();
      continuarCreacionTicket();
    })
    .catch((error) => {
      hideExportLoading(); // Ensure loading is hidden on error
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
          // ⚠️ FIX: OCULTAR EL OVERLAY GLOBAL INMEDIATAMENTE DESPUÉS DEL ÉXITO DE LA XHR
          if (typeof window.hideLoadingOverlay === 'function') {
            window.hideLoadingOverlay(true); 
          }

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
                
                // Verificar si al menos un correo se envió exitosamente
                const message = responseEmail.message || '';
                const correoTecnicoEnviado = message.includes('Correo del técnico enviado');
                
                if (responseEmail.success || correoTecnicoEnviado) {
                  showLoadingOverlay("Enviando correo...");
              
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
                      timer: 3500, // Se cierra automáticamente en 4 segundos
                      timerProgressBar: true,
                      backdrop: false,
                      allowOutsideClick: true,
                      customClass: {
                          container: 'super-toast-z-index'
                      },
                      // 🎉 NUEVA PROPIEDAD: Ejecutar código al cerrarse
                      didClose: () => {
                          // Aquí se ejecuta el código cuando el toast desaparece
                          window.location.reload(); 
                      }
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
              const ticketData = response.ticket_data; // Datos del ticket desde el backend

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
                timer: 4500,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                },
                color: 'black',
                showClass: {
                  popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                  popup: "animate__animated animate__fadeOutUp",
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
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
  const datos = `action=SaveDataFalla&serial=${encodeURIComponent(serial)}&falla=${encodeURIComponent(falla)}&nivelFalla=${encodeURIComponent(nivelFalla)}&id_user=${encodeURIComponent(id_user)}&rif=${encodeURIComponent(rif)}&falla_text=${encodeURIComponent(fallaText)}&nivelFalla_text=${encodeURIComponent(nivelFallaText)}&descrpFailure_text=${encodeURIComponent(descrpFailure_text)}`;
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

  const explicacionFalla = document.getElementById("explicacionFalla");
  if (explicacionFalla) explicacionFalla.value = "";

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
  }
  if (checkAnticipoContainer) {
    checkAnticipoContainer.style.display = "block";
  }
  if (checkEnvioContainer) {
    checkEnvioContainer.style.display = "block";
  }

  // Restaurar botones de descarga
  const downloadExo = document.getElementById("DownloadExo");
  const downloadAntici = document.getElementById("DownloadAntici");
  
  if (downloadExo) {
    downloadExo.style.display = "inline-block";
  }
  if (downloadAntici) {
    downloadAntici.style.display = "inline-block";
  }

  // Restaurar checkboxes individuales
  const checkExoneracion = document.getElementById("checkExoneracion");
  const checkExoneracionLabel = document.getElementById("checkExoneracionLabel");
  const checkAnticipo = document.getElementById("checkAnticipo");
  const checkAnticipoLabel = document.getElementById("checkAnticipoLabel");
  
  if (checkExoneracion) {
    checkExoneracion.style.display = "block";
  }
  if (checkExoneracionLabel) {
    checkExoneracionLabel.style.display = "block";
  }
  if (checkAnticipo) {
    checkAnticipo.style.display = "block";
  }
  if (checkAnticipoLabel) {
    checkAnticipoLabel.style.display = "block";
  }

  // Restaurar elementos de garantía
  const resultadoGarantiaReingreso = document.getElementById("resultadoGarantiaReingreso");
  const resultadoGarantiaInstalacion = document.getElementById("resultadoGarantiaInstalacion");
  
  if (resultadoGarantiaReingreso) {
    resultadoGarantiaReingreso.textContent = "Sin Garantía Por Reingreso";
    resultadoGarantiaReingreso.style.color = "";
  }
  
  if (resultadoGarantiaInstalacion) {
    resultadoGarantiaInstalacion.textContent = "Sin Garantía de Instalación";
    resultadoGarantiaInstalacion.style.color = "";
  }

  // Restaurar opciones de carga de documentos
  const documentUploadOptions = document.getElementById("documentUploadOptions");
  if (documentUploadOptions) {
    documentUploadOptions.style.display = "none"; // Por defecto oculto hasta que se seleccione "Sí"
  }

  // Restaurar botones de carga
  const botonCargaPDFEnv = document.getElementById("botonCargaPDFEnv");
  const botonCargaExoneracion = document.getElementById("botonCargaExoneracion");
  const botonCargaAnticipo = document.getElementById("botonCargaAnticipo");
  
  if (botonCargaPDFEnv) {
    botonCargaPDFEnv.style.display = "none";
  }
  if (botonCargaExoneracion) {
    botonCargaExoneracion.style.display = "none";
  }
  if (botonCargaAnticipo) {
    botonCargaAnticipo.style.display = "none";
  }

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

// === GLOBAL LOADING OVERLAY FUNCTIONS ===

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
  // Usar setTimeout para asegurar que el overlay se muestre inmediatamente
  setTimeout(function() {
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
        z-index: 99999;
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
      loadingOverlay.style.zIndex = '99999';
    }
  }, 0);
}

// Función para ocultar el overlay de carga
function hideExportLoading() {
  const loadingOverlay = document.getElementById('export-loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
    loadingOverlay.style.zIndex = '-1';
  }
}

// Variable global para rastrear el tiempo de inicio de la exportación y el timeout
let exportStartTime = null;
let exportTimeoutId = null;
let downloadDetected = false;

// Función para detectar cuando comienza la descarga
function detectDownloadStart() {
    downloadDetected = false;
    let hideTimeout = null;
    
    // Función para ocultar el overlay cuando se detecta la descarga
    const hideAfterDownload = function() {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
        // Esperar 3 segundos después de detectar la descarga para dar tiempo a que termine
        hideTimeout = setTimeout(function() {
            hideExportLoading();
            if (exportTimeoutId) {
                clearTimeout(exportTimeoutId);
                exportTimeoutId = null;
            }
            downloadDetected = true;
        }, 3000);
    };
    
    // Detectar cuando la ventana pierde el foco (suele pasar cuando se inicia la descarga)
    const blurHandler = function() {
        if (!downloadDetected) {
            hideAfterDownload();
            window.removeEventListener('blur', blurHandler);
        }
    };
    
    window.addEventListener('blur', blurHandler);
    
    // También verificar si hay cambios en el DOM que indiquen descarga
    const observer = new MutationObserver(function() {
        // Verificar si hay elementos de descarga o iframes creados
        const downloadIndicators = document.querySelectorAll('a[download], iframe[src*="blob"], iframe[src*="data:"]');
        if (downloadIndicators.length > 0 && !downloadDetected) {
            hideAfterDownload();
            observer.disconnect();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // También monitorear cuando la ventana recupera el foco (después de la descarga)
    const focusHandler = function() {
        if (!downloadDetected) {
            // Si la ventana recupera el foco después de perderlo, probablemente la descarga comenzó
            setTimeout(function() {
                if (!downloadDetected) {
                    hideAfterDownload();
                }
            }, 2000);
        }
        window.removeEventListener('focus', focusHandler);
    };
    
    window.addEventListener('focus', focusHandler);
    
    // Limpiar después de 60 segundos si no se detecta nada
    setTimeout(function() {
        observer.disconnect();
        window.removeEventListener('blur', blurHandler);
        window.removeEventListener('focus', focusHandler);
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
    }, 60000);
}

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
                    filename: () => {
                        const tipoRif = document.getElementById('rifTipo')?.value || 'V';
                        const numeroRif = document.getElementById('rifInput')?.value?.trim() || '';
                        const rifCompleto = numeroRif ? `${tipoRif}${numeroRif}` : 'SIN_RIF';
                        const fecha = new Date().toISOString().split('T')[0];
                        return `REPORTE EMPRESA - RIF ${rifCompleto.trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, '_')} ${fecha}`;
                    },
                    title: () => {
                        return 'REPORTE DE EMPRESA POR RIF';
                    },
                    className: 'btn-excel-modern',
                    attr: {
                        id: 'btn-excel-modern-id',
                        title: 'Exportar a Excel'
                    },
                    action: function(e, dt, button, config) {
                        // Limpiar timeout anterior si existe
                        if (exportTimeoutId) {
                            clearTimeout(exportTimeoutId);
                        }
                        
                        // Mostrar overlay inmediatamente
                        showExportLoading();
                        exportStartTime = Date.now();
                        
                        // Iniciar detección de descarga
                        detectDownloadStart();
                        
                        // Calcular delay basado en número de registros (fallback si no se detecta descarga)
                        const rowCount = dt.rows({search: 'applied'}).count();
                        // Para Excel: aproximadamente 100ms por registro, mínimo 5 segundos, máximo 30 segundos
                        const delay = Math.min(Math.max(rowCount * 100, 5000), 30000);
                        
                        // Llamar a la acción por defecto de forma asíncrona
                        setTimeout(function() {
                            $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);
                        }.bind(this), 100);
                        
                        // Ocultar overlay después del delay calculado (fallback)
                        exportTimeoutId = setTimeout(function() {
                            if (!downloadDetected) {
                                hideExportLoading();
                                exportTimeoutId = null;
                            }
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
                        // Limpiar timeout anterior si existe
                        if (exportTimeoutId) {
                            clearTimeout(exportTimeoutId);
                        }
                        
                        // Mostrar overlay inmediatamente
                        showExportLoading();
                        exportStartTime = Date.now();
                        
                        // Iniciar detección de descarga
                        detectDownloadStart();
                        
                        // Calcular delay basado en número de registros (fallback si no se detecta descarga)
                        const rowCount = dt.rows().count();
                        // Para PDF: aproximadamente 150ms por registro, mínimo 5 segundos, máximo 30 segundos
                        const delay = Math.min(Math.max(rowCount * 150, 5000), 30000);
                        
                        // Llamar a la acción por defecto de forma asíncrona
                        setTimeout(function() {
                            $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, button, config);
                        }.bind(this), 100);
                        
                        // Ocultar overlay después del delay calculado (fallback)
                        exportTimeoutId = setTimeout(function() {
                            if (!downloadDetected) {
                                hideExportLoading();
                                exportTimeoutId = null;
                            }
                        }, delay);
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
    }
  };

  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td colspan="11" class="text-center">Error de red.</td></tr>';
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
                    filename: () => {
                        const serialInput = document.getElementById('serialInput');
                        const serialInputValue = serialInput?.value?.trim() || 'SIN_SERIAL';
                        const fecha = new Date().toISOString().split('T')[0];
                        return `REPORTE EMPRESA - SERIAL ${serialInputValue.trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, '_')} ${fecha}`;
                    },
                    title: () => {
                        return 'REPORTE DE EMPRESA POR SERIAL';
                    },
                    className: 'btn-excel-modern',
                    attr: {
                        id: 'btn-excel-modern-id',
                        title: 'Exportar a Excel'
                    },
                    action: function(e, dt, button, config) {
                        // Limpiar timeout anterior si existe
                        if (exportTimeoutId) {
                            clearTimeout(exportTimeoutId);
                        }
                        
                        // Mostrar overlay inmediatamente
                        showExportLoading();
                        exportStartTime = Date.now();
                        
                        // Iniciar detección de descarga
                        detectDownloadStart();
                        
                        // Calcular delay basado en número de registros (fallback si no se detecta descarga)
                        const rowCount = dt.rows({search: 'applied'}).count();
                        // Para Excel: aproximadamente 100ms por registro, mínimo 5 segundos, máximo 30 segundos
                        const delay = Math.min(Math.max(rowCount * 100, 5000), 30000);
                        
                        // Llamar a la acción por defecto de forma asíncrona
                        setTimeout(function() {
                            $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);
                        }.bind(this), 100);
                        
                        // Ocultar overlay después del delay calculado (fallback)
                        exportTimeoutId = setTimeout(function() {
                            if (!downloadDetected) {
                                hideExportLoading();
                                exportTimeoutId = null;
                            }
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
                        // Limpiar timeout anterior si existe
                        if (exportTimeoutId) {
                            clearTimeout(exportTimeoutId);
                        }
                        
                        // Mostrar overlay inmediatamente
                        showExportLoading();
                        exportStartTime = Date.now();
                        
                        // Calcular delay basado en número de registros
                        const rowCount = dt.rows().count();
                        // Para PDF: aproximadamente 200ms por registro, mínimo 8 segundos, máximo 1 minuto (60,000ms)
                        const delay = Math.min(Math.max(rowCount * 200, 8000), 60000);
                        
                        // Llamar a la acción por defecto de forma asíncrona
                        setTimeout(function() {
                            $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, button, config);
                        }.bind(this), 100);
                        
                        // Ocultar overlay después del delay calculado
                        exportTimeoutId = setTimeout(function() {
                            hideExportLoading();
                            exportTimeoutId = null;
                        }, delay);
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
              filename: () => {
                  const razon = document.getElementById('RazonInput')?.value?.trim() || 'SIN_RAZON_SOCIAL';
                  const razonLimpia = razon.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50).toUpperCase();
                  const fecha = new Date().toISOString().split('T')[0];
                  return `REPORTE CONSULTA - CONTEOS_RAZON_SOCIAL ${razonLimpia}_${fecha}`;
              },
              title: () => {
                  return 'Conteos por Razón Social';
              },
              action: function(e, dt, button, config) {
                  // Limpiar timeout anterior si existe
                  if (exportTimeoutId) {
                      clearTimeout(exportTimeoutId);
                  }
                  
                  // Mostrar overlay inmediatamente
                  showExportLoading();
                  exportStartTime = Date.now();
                  
                  // Iniciar detección de descarga
                  detectDownloadStart();
                  
                  // Calcular delay basado en número de registros (fallback si no se detecta descarga)
                  const rowCount = dt.rows({search: 'applied'}).count();
                  // Para Excel: aproximadamente 100ms por registro, mínimo 5 segundos, máximo 30 segundos
                  const delay = Math.min(Math.max(rowCount * 100, 5000), 30000);
                  
                  // Llamar a la acción por defecto de forma asíncrona
                  setTimeout(function() {
                      $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);
                  }.bind(this), 100);
                  
                  // Ocultar overlay después del delay calculado (fallback)
                  exportTimeoutId = setTimeout(function() {
                      if (!downloadDetected) {
                          hideExportLoading();
                          exportTimeoutId = null;
                      }
                  }, delay);
              },
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
                    filename: () => {
                        const razon = document.getElementById('RazonInput')?.value?.trim() || 'SIN_RAZON_SOCIAL';
                        const razonLimpia = razon.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50).toUpperCase();
                        const fecha = new Date().toISOString().split('T')[0];
                        return `REPORTE CONSULTA - RAZON_SOCIAL ${razonLimpia}_${fecha}`;
                    },
                    title: () => {
                        return 'Búsqueda por Razón Social';
                    },
                    className: 'btn-excel-modern',
                    attr: {
                        id: 'btn-excel-modern-id',
                        title: 'Exportar a Excel'
                    },
                    action: function(e, dt, button, config) {
                        // Limpiar timeout anterior si existe
                        if (exportTimeoutId) {
                            clearTimeout(exportTimeoutId);
                        }
                        
                        // Mostrar overlay inmediatamente
                        showExportLoading();
                        exportStartTime = Date.now();
                        
                        // Iniciar detección de descarga
                        detectDownloadStart();
                        
                        // Calcular delay basado en número de registros (fallback si no se detecta descarga)
                        const rowCount = dt.rows({search: 'applied'}).count();
                        // Para Excel: aproximadamente 100ms por registro, mínimo 5 segundos, máximo 30 segundos
                        const delay = Math.min(Math.max(rowCount * 100, 5000), 30000);
                        
                        // Llamar a la acción por defecto de forma asíncrona
                        setTimeout(function() {
                            $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);
                        }.bind(this), 100);
                        
                        // Ocultar overlay después del delay calculado (fallback)
                        exportTimeoutId = setTimeout(function() {
                            if (!downloadDetected) {
                                hideExportLoading();
                                exportTimeoutId = null;
                            }
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
                        // Limpiar timeout anterior si existe
                        if (exportTimeoutId) {
                            clearTimeout(exportTimeoutId);
                        }
                        
                        // Mostrar overlay inmediatamente
                        showExportLoading();
                        exportStartTime = Date.now();
                        
                        // Iniciar detección de descarga
                        detectDownloadStart();
                        
                        // Calcular delay basado en número de registros (fallback si no se detecta descarga)
                        const rowCount = dt.rows().count();
                        // Para PDF: aproximadamente 150ms por registro, mínimo 5 segundos, máximo 30 segundos
                        const delay = Math.min(Math.max(rowCount * 150, 5000), 30000);
                        
                        // Llamar a la acción por defecto de forma asíncrona
                        setTimeout(function() {
                            $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, button, config);
                        }.bind(this), 100);
                        
                        // Ocultar overlay después del delay calculado (fallback)
                        exportTimeoutId = setTimeout(function() {
                            if (!downloadDetected) {
                                hideExportLoading();
                                exportTimeoutId = null;
                            }
                        }, delay);
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
      // Show the welcome message on other HTTP errors
      if (welcomeMessage) {
        welcomeMessage.style.visibility = "visible";
        welcomeMessage.style.opacity = "1";
      }
    }
  };

  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td colspan="11" class="text-center">Error de red.</td></tr>';
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
                      filename: () => {
                          const serial = globalSerial || 'SIN_SERIAL';
                          const fecha = new Date().toISOString().split('T')[0];
                          return `REPORTE CONSULTA - DETALLE_SERIAL ${serial.toUpperCase()}_${fecha}`;
                      },
                      title: () => {
                          return 'Reporte de Detalle de Serial';
                      },
                      action: function(e, dt, button, config) {
                          // Limpiar timeout anterior si existe
                          if (exportTimeoutId) {
                              clearTimeout(exportTimeoutId);
                          }
                          
                          // Mostrar overlay inmediatamente
                          showExportLoading();
                          exportStartTime = Date.now();
                          
                          // Iniciar detección de descarga
                          detectDownloadStart();
                          
                          // Calcular delay basado en número de registros (fallback si no se detecta descarga)
                          const rowCount = dt.rows({search: 'applied'}).count();
                          // Para Excel: aproximadamente 100ms por registro, mínimo 5 segundos, máximo 30 segundos
                          const delay = Math.min(Math.max(rowCount * 100, 5000), 30000);
                          
                          // Llamar a la acción por defecto de forma asíncrona
                          setTimeout(function() {
                              $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);
                          }.bind(this), 100);
                          
                          // Ocultar overlay después del delay calculado (fallback)
                          exportTimeoutId = setTimeout(function() {
                              if (!downloadDetected) {
                                  hideExportLoading();
                                  exportTimeoutId = null;
                              }
                          }, delay);
                      },
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
      }
    } else {
      tbody.innerHTML = '<tr><td colspan="2">Error de conexión.</td></tr>';
    }
  };

  xhr.onerror = function () {
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
      }
    } else {
    }
  };

  xhr.onerror = function () {
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
  // Incluir todos los checkboxes marcados, incluso los deshabilitados (como "Equipo")
  const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:checked');
  const selectAllCheckbox = document.getElementById('selectAllComponents');

  contadorComponentes.textContent = checkboxes.length;

  // Para el checkbox "Seleccionar todos", solo considerar los habilitados
  const allCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:not([disabled])');
  const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
  const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);

  if (selectAllCheckbox) {
  selectAllCheckbox.checked = allChecked;
  selectAllCheckbox.indeterminate = someChecked && !allChecked;
  }
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
                    // ⚠️ FIX: OCULTAR EL OVERLAY GLOBAL INMEDIATAMENTE DESPUÉS DEL ÉXITO DE LA XHR
                    if (typeof window.hideLoadingOverlay === 'function') {
                      window.hideLoadingOverlay(true); 
                    }
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
                                            timerProgressBar: true,
                                            backdrop: false,
                                            allowOutsideClick: true,
                                            customClass: {
                                              container: 'super-toast-z-index'
                                            },
                                        });
                                        setTimeout(() => {
                                            hideLoadingOverlay();
                                            window.location.reload();
                                        }, emailToastDuration + 2000);
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
                                timerProgressBar: true,
                                backdrop: false,
                                allowOutsideClick: true,
                                customClass: {
                                  container: 'super-toast-z-index'
                                },
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

                    // Verificar si hay componentes seleccionados
                    const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]');
                    const hasSelectedComponents = Array.from(checkboxes).some(cb => cb.checked);
                    
                    // Si no hay componentes seleccionados, marcar automáticamente "Equipo" y deshabilitarlo
                    if (!hasSelectedComponents && checkboxes.length > 0) {
                        // Buscar el componente "Equipo" en las filas de la tabla
                        const rows = tbodyComponentes.querySelectorAll('tr');
                        rows.forEach(row => {
                            const componentName = row.querySelector('td:last-child')?.textContent?.trim() || '';
                            const checkbox = row.querySelector('input[type="checkbox"]');
                            
                            // Si el nombre contiene "Equipo" (case insensitive) y el checkbox no está deshabilitado
                            if (componentName.toLowerCase().includes('equipo') && checkbox && !checkbox.disabled) {
                                checkbox.checked = true;
                                checkbox.disabled = true; // Deshabilitar para que no se pueda desmarcar
                            }
                        });
                    }

                    // Finalmente, muestra el modal de Bootstrap
                    modalComponentes.show();
                    const navbar = document.getElementById("sidenav-main");
                    if (navbar) {
                      navbar.style.display = "none";
                    }

                    // Llama a actualizar contador después de cargar los componentes
                    setTimeout(() => {
                    actualizarContador();
                    }, 100);

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

            // Incluir todos los checkboxes marcados, incluso los deshabilitados (como "Equipo")
            const checkboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]:checked');
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

            // --- INICIO DE LA LÓGICA AGREGADA ---
            // Verificar si todos los componentes ya están registrados (marcados y deshabilitados)
            // Esto solo aplica cuando TODOS los componentes están marcados Y deshabilitados (ya guardados previamente)
            const allCheckboxes = tbodyComponentes.querySelectorAll('input[type="checkbox"]');
            const allDisabledAndChecked = Array.from(allCheckboxes).every(cb => cb.checked && cb.disabled);

            // Solo bloquear si TODOS los componentes están marcados y deshabilitados
            // Esto significa que ya fueron guardados previamente y no hay nada nuevo que guardar
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

            // Si llegamos aquí, hay componentes seleccionados y no todos están ya registrados
            // Permitir guardar (incluye el caso donde "Equipo" está marcado automáticamente y deshabilitado)
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
        return;
    }

    isProcessing = true;
    const emailData = emailQueue[0]; // Tomar el primer correo de la cola


    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/send_ticket2`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.timeout = 10000; // Timeout de 10 segundos

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    
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
                            color: 'black',
                            backdrop: false,
                            allowOutsideClick: true,
                            customClass: {
                              container: 'super-toast-z-index'
                            },
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
        
        // Procesar la siguiente solicitud en la cola
        if (emailQueue.length > 0) {
            // Pequeña pausa antes del siguiente correo (1 segundo)
            setTimeout(() => {
                processEmailQueue();
            }, 1000);
        } else {
            isProcessing = false;
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
    if (emailQueue.length > 0) {
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
