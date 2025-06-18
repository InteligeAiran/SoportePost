let globalSerial = "";
let globalRif = "";
let globalEstatusPos = ""; // O null, dependiendo de cómo quieras inicializarla

document.addEventListener("DOMContentLoaded", function () {
  // Estilo para el span "No file chosen"
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
        !["application/pdf", "image/jpeg", "image/jpg"].includes(file.type)
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
        !["application/pdf", "image/jpeg", "image/jpg"].includes(file.type)
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
    clearFormFields(); // Limpiar campos de ambos modales
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

  /*cerrarNivelFalla.off('click').on('click', function() { // Cierre Modal Nivel de Falla
        modal.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales
    });*/

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
      // Si quieres mostrar directamente un modal (Nivel 1 o Nivel 2)
      // en lugar del nivel de falla, puedes llamar a mostrarMiModal1() o mostrarMiModal() aquí.
      // Por ejemplo:
      // if (selectedValue === 'Sustitución de POS') {
      //     mostrarMiModal1('sustitucion');
      // } else if (selectedValue === 'Préstamo de POS') {
      //     mostrarMiModal('prestamo');
      // }
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
          if (InputRifModal2) InputRifModal2.value = globalRif;
          if (serialSelectModal2) {
            serialSelectModal2.innerHTML = `<input value="${globalSerial}">${globalSerial}</input>`;
            // Puedes seleccionar la opción si lo deseas:
            serialSelectModal2.value = globalSerial;
            getUltimateTicket(globalSerial);
            getInstalationDate(globalSerial);
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

function checkRif() {
  const input = document.getElementById("InputRif");
  const mensajeDivt = document.getElementById("rifMensaje");
  mensajeDivt.innerHTML = "";
  mensajeDivt.style.color = ""; // Limpia el color anterior

  if (input.value === "") {
    mensajeDivt.innerHTML = "Campo vacío";
    mensajeDivt.style.color = "red";
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/ValidateRif`);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          mensajeDivt.innerHTML = response.message;
          mensajeDivt.style.color = response.color;
          if (response.success) {
            getPosSerials(response.rif);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          mensajeDivt.innerHTML =
            "Error al procesar la respuesta del servidor.";
          mensajeDivt.style.color = "red";
        }
      } else if (xhr.status === 404) {
        mensajeDivt.innerHTML = "El RIF No Existe";
        mensajeDivt.style.color = "red";
      } else if (xhr.status === 400) {
        mensajeDivt.innerHTML = "Error: RIF no proporcionado";
        mensajeDivt.style.color = "red";
      } else {
        console.error("Error:", xhr.status, xhr.statusText);
        mensajeDivt.innerHTML = "Error de conexión con el servidor.";
        mensajeDivt.style.color = "red";
      }
    };

    xhr.onerror = function () {
      mensajeDivt.innerHTML = "Error de red al intentar verificar el RIF.";
      mensajeDivt.style.color = "red";
      console.error("Error de red");
    };

    const datos = `action=ValidateRif&rif=${encodeURIComponent(input.value)}`;
    xhr.send(datos);
  }
}

function checkRif1() {
  const input = document.getElementById("InputRif1");
  const mensajeDivt = document.getElementById("rifMensaje1");
  mensajeDivt.innerHTML = "";
  mensajeDivt.style.color = ""; // Limpia el color anterior

  if (input.value === "") {
    mensajeDivt.innerHTML = "Campo vacío";
    mensajeDivt.style.color = "red";
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/ValidateRif1`);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          mensajeDivt.innerHTML = response.message;
          mensajeDivt.style.color = response.color;
          if (response.success) {
            getPosSerials1(response.rif);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          mensajeDivt.innerHTML =
            "Error al procesar la respuesta del servidor.";
          mensajeDivt.style.color = "red";
        }
      } else if (xhr.status === 404) {
        mensajeDivt.innerHTML = "El RIF No Existe";
        mensajeDivt.style.color = "red";
      } else if (xhr.status === 400) {
        mensajeDivt.innerHTML = "Error: RIF no proporcionado";
        mensajeDivt.style.color = "red";
      } else {
        console.error("Error:", xhr.status, xhr.statusText);
        mensajeDivt.innerHTML = "Error de conexión con el servidor.";
        mensajeDivt.style.color = "red";
      }
    };

    xhr.onerror = function () {
      mensajeDivt.innerHTML = "Error de red al intentar verificar el RIF.";
      mensajeDivt.style.color = "red";
      console.error("Error de red");
    };

    const datos = `action=ValidateRif1&rif=${encodeURIComponent(input.value)}`;
    xhr.send(datos);
  }
}

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
// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener("DOMContentLoaded", getCoordinador);

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
                VerificarSucursales(rif);
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

function validarGarantiaReingreso(fechaUltimoTicket) {
  const resultadoElemento = document.getElementById(
    "resultadoGarantiaReingreso"
  );
  // Controlar visibilidad de los botones
  const botonExoneracion = document.getElementById("DownloadExo");
  const botonAnticipo = document.getElementById("DownloadAntici");
  // const animation = document.getElementById('animation');

  if (fechaUltimoTicket === "No disponible") {
    resultadoElemento.textContent = "Sin Garantía Por Reingreso";
    resultadoElemento.style.color = "";
    return null;
  } else {
    const fechaActual = new Date();
    const fechaTicket = new Date(fechaUltimoTicket);
    const diferencia = fechaActual.getTime() - fechaTicket.getTime();
    const meses = Math.ceil(diferencia / (1000 * 3600 * 24 * 30));

    if (meses <= 3) {
      Swal.fire({
        title: "¡Notificación!",
        text: "Tiene Garantía Por Reingreso.",
        icon: "warning",
        confirmButtonText: "OK",
        color: "black",
      });
      resultadoElemento.textContent = "Garantía por Reingreso aplica";
      resultadoElemento.style.color = "red";
      botonExoneracion.style.display = "none";
      botonAnticipo.style.display = "none";
      // animation.style.display = 'block';
      document.getElementById("checkExoneracion").style.display = "none";
      document.getElementById("checkExoneracionLabel").style.display = "none";
      document.getElementById("checkAnticipo").style.display = "none";
      document.getElementById("checkAnticipoLabel").style.display = "none";
      return 3;
    } else {
      resultadoElemento.textContent = "Sin Garantía Por Reingreso";
      resultadoElemento.style.color = "";
      botonExoneracion.style.display = "inline-block";
      botonAnticipo.style.display = "inline-block";
      // animation.style.display = 'none';

      return null;
    }
  }
}

function validarGarantiaInstalacion(fechaInstalacion) {
  const resultadoElemento = document.getElementById(
    "resultadoGarantiaInstalacion"
  );
  // Controlar visibilidad de los botones
  const botonExoneracion = document.getElementById("DownloadExo");
  const botonAnticipo = document.getElementById("DownloadAntici");
  //const animation = document.getElementById('animation');

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
      Swal.fire({
        title: "¡Notificación!",
        text: "Tiene Garantía Por Instalación.",
        icon: "warning",
        confirmButtonText: "OK",
        color: "black",
      });
      resultadoElemento.textContent = "Garantía por Instalación aplica";
      resultadoElemento.style.color = "red";
      botonExoneracion.style.display = "none";
      botonAnticipo.style.display = "none";
      document.getElementById("checkExoneracion").style.display = "none";
      document.getElementById("checkExoneracionLabel").style.display = "none";
      document.getElementById("checkAnticipo").style.display = "none";
      document.getElementById("checkAnticipoLabel").style.display = "none";

      // animation.style.display = 'block';

      return 1;
    } else {
      resultadoElemento.textContent = "Sin Garantía de Instalación";
      resultadoElemento.style.color = "";
      botonExoneracion.style.display = "inline-block";
      botonAnticipo.style.display = "inline-block";
      //animation.style.display = 'none';

      return null;
    }
  }
}

function UpdateGuarantees() {
  const idStatusPaymentReingreso = validarGarantiaReingreso(
    fechaUltimoTicketGlobal
  );
  const idStatusPaymentInstalacion = validarGarantiaInstalacion(
    fechaInstalacionGlobal
  );

  const inputExoneracion = document.getElementById("ExoneracionInput");
  const inputAnticipo = document.getElementById("AnticipoInput");
  const inputEnvio = document.getElementById("EnvioInput"); // Asegúrate de tener esta referencia

  const archivoExoneracion = inputExoneracion.files[0];
  const archivoAnticipo = inputAnticipo.files[0];
  const archivoEnvio = inputEnvio.files[0]; // Referencia al archivo de envío

  const uploadNowRadio = document.getElementById("uploadNow"); // Radio button "Sí"
  const uploadPendingRadio = document.getElementById("uploadPending"); // Radio button "No"

  const checkEnvio = document.getElementById("checkEnvio");
  const checkExoneracion = document.getElementById("checkExoneracion");
  const checkAnticipo = document.getElementById("checkAnticipo");

  let idStatusPayment;

  // Primero, verifica las garantías principales
  if (idStatusPaymentReingreso === 3) {
    // Garantia Reingreso Aplica
    idStatusPayment = 3;
  } else if (idStatusPaymentInstalacion === 1) {
    // Garantia Instalacion Aplica
    idStatusPayment = 1;
  } else {
    // No hay garantía principal, la lógica de ID_STATUS_PAYMENT dependerá de la carga de documentos

    if (uploadPendingRadio && uploadPendingRadio.checked) {
      // Si se marcó "No (Pendiente por cargar documentos)"
      idStatusPayment = 9; // Pendiente Por Cargar Documentos
    } else if (uploadNowRadio && uploadNowRadio.checked) {
      // Si se marcó "Sí" para cargar documentos
      // Evaluar combinaciones y prioridades según lo que FALTA o se CARGA

      // Prioridad alta: Exoneración o Anticipo cargados (ID 5 o 7)
      if (
        checkExoneracion.checked &&
        archivoExoneracion &&
        checkEnvio.checked &&
        archivoEnvio
      ) {
        idStatusPayment = 5; // Pago Exoneracion Pendiente por Revision
      } else if (
        checkAnticipo.checked &&
        archivoAnticipo &&
        checkEnvio.checked &&
        archivoEnvio
      ) {
        idStatusPayment = 7; // Pago Anticipo Pendiente por Revision
      }
      // Si no se cargó Exoneración ni Anticipo, pero se marcaron sus checkboxes sin archivos
      // O si se marcó "Sí" pero no se marcó ningún checkbox de doc.
      else if (
        checkExoneracion.checked &&
        archivoExoneracion &&
        !checkAnticipo.checked &&
        !archivoAnticipo &&
        !checkEnvio.checked &&
        !archivoEnvio
      ) {
        idStatusPayment = 11; // Pendiente Por Cargar Documento(Pago anticipo o Exoneracion)
      }
      // Si solo se marcó y/o cargó el PDF de Envío
      else if (
        !checkEnvio.checked &&
        archivoAnticipo &&
        !checkExoneracion.checked &&
        !archivoExoneracion &&
        checkAnticipo.checked &&
        !archivoEnvio
      ) {
        idStatusPayment = 11; // Pendiente Por Cargar Documento(PDF Envio ZOOM)
      }
      // Caso por defecto si se eligió "Sí" pero no se cumple ninguna de las condiciones anteriores
      // Podría ser un escenario donde no se ha seleccionado ningún archivo después de marcar "Sí",
      // o un archivo de envío que no tiene un ID específico.
      else {
        idStatusPayment = 10; // Predeterminado a pendiente de pago anticipo/exoneración si no hay otra clara
      }
    } else {
      // Esto es un caso por defecto, si no se ha seleccionado ninguna opción de radio button
      // o un estado intermedio que no debería ocurrir si la UI está bien controlada.
      // Podríamos asignar un valor predeterminado o lanzar un error si es un estado inválido.
      idStatusPayment = 9; // O cualquier otro ID por defecto que consideres, ej: 10
    }
  }

  // Mostrar alertas (este bloque se mantiene igual)
  if (idStatusPayment === 3) {
    // Garantia Reingreso Aplica
    Swal.fire({
      title: "¡Notificación!",
      text: "Tiene Garantía Por Reingreso.",
      icon: "warning",
      confirmButtonText: "OK",
      color: "black",
    });
  } else if (idStatusPayment === 1) {
    // Garantia Instalacion Aplica
    Swal.fire({
      title: "¡Notificación!",
      text: "Tiene Garantía Por Instalacion.",
      icon: "warning",
      confirmButtonText: "OK",
      color: "black",
    });
  }

  return idStatusPayment;
}

/*document.getElementById("SendForm2").addEventListener("click", function () {
  const idStatusPayment = UpdateGuarantees();
  SendDataFailure2(idStatusPayment);
});*/

function VerificarSucursales(rif) {
  const xhrSucursales = new XMLHttpRequest();
  xhrSucursales.open("POST", "app/views/Tecnico/consulta_rif/backEnd.php");
  xhrSucursales.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  xhrSucursales.onload = function () {
    if (xhrSucursales.status === 200) {
      const responseSucursales = JSON.parse(xhrSucursales.responseText);
      try {
        if (responseSucursales.success) {
          const idRegion = responseSucursales.id_region;
          const botonCargarEnvio =
            document.getElementById("DownloadEnvi").parentNode;
          const idRegionNumero = parseInt(idRegion, 10); // Convertir a entero (base 10)

          if (idRegionNumero === 1) {
            botonCargarEnvio.style.display = "none";
          } else {
            botonCargarEnvio.style.display = "block";
          }
        } else {
          console.error(
            "Error al verificar las sucursales:",
            responseSucursales
              ? responseSucursales.message
              : "Error desconocido"
          );
          // En caso de error, podrías mostrar el botón por defecto o tener otra lógica
          const botonCargarEnvio =
            document.getElementById("DownloadEnvi").parentNode;
          botonCargarEnvio.style.display = "block";
        }
      } catch (error) {
        console.log("Respuesta del servidor:", responseSucursales); // Ver la respuesta completa para depurar
      }
    } else {
      console.error(
        "Error en la petición para verificar sucursales. Status:",
        xhrSucursales.status
      );
    }
  };

  const datosSucursales = `action=VerifingBranches&rif=${encodeURIComponent(
    rif
  )}`;
  xhrSucursales.send(datosSucursales);
}

let cargaSeleccionada = null; // Puede ser 'exoneracion', 'anticipo' o null

document
  .getElementById("DownloadExo")
  .addEventListener("click", function (event) {
    document.getElementById("DownloadAntici").style.display = "none";
    document.getElementById("AnticipoInput").style.display = "none";
    event.stopPropagation(); // Detener la propagación del evento
    cargaSeleccionada = "exoneracion";
    // Validación de exoneración AL HACER CLIC en "Cargar Exoneracion"
    const inputExoneracion = document.getElementById("ExoneracionInput");
    const archivoExoneracion = inputExoneracion.files[0];
    const inputExoneracion1 = document.getElementById("DownloadExo"); // El botón

    // if (inputExoneracion1.style.display !== 'none' && !archivoExoneracion) {
    //     Swal.fire({
    //         icon: 'warning',
    //         title: 'Campo requerido',
    //         text: 'Por favor, seleccione el PDF de exoneración después de hacer click en \"Cargar Exoneración\".',
    //         color: 'black'
    //     });
    //     return; // Importante: Detener la ejecución si la validación falla
    // }

    if (archivoExoneracion.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Archivo muy grande",
        text: "El archivo de exoneración no debe superar los 5MB.",
        color: "black",
      });
      return; // Importante: Detener la ejecución si la validación falla
    }

    // Si la validación pasa, puedes continuar con alguna otra lógica aquí si es necesario
    //console.log("Validación de exoneración pasada.");
  });

document
  .getElementById("DownloadAntici")
  .addEventListener("click", function (event) {
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

function SendDataFailure2(idStatusPayment) {
  // AHORA: Obtener el valor (ID) y el texto de la falla
  const fallaSelect = document.getElementById("FallaSelect2");
  const descrpFailure_id = fallaSelect.value; // El valor (ID) de la falla
  const descrpFailure_text =
    fallaSelect.options[fallaSelect.selectedIndex].text; // El TEXTO visible de la falla

  const id_user = document.getElementById("id_user").value;
  const rif = document.getElementById("InputRif").value;
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
  const archivoExoneracion = inputExoneracion.files[0]; // <-- Corregido
  const archivoAnticipo = inputAnticipo.files[0]; // <-- Corregido

  const botonCargaPDFEnv = document.getElementById("botonCargaPDFEnv");
  const botonCargaExoneracion = document.getElementById(
    "botonCargaExoneracion"
  );
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
      text: "Por favor, complete todos los campos obligatorios (Falla, RIF, Serial, Coordinador, Nivel de Falla).",
      color: "black",
    });
    return;
  }

  // Validaciones de archivos CONDICIONALES si se eligió "Sí" para cargar ahora
  if (uploadNowRadio.checked) {
    const checkEnvio = document.getElementById("checkEnvio");
    const checkExoneracion = document.getElementById("checkExoneracion");
    const checkAnticipo = document.getElementById("checkAnticipo");

    if (checkEnvio.checked && !archivoEnvio) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: 'Por favor, seleccione el PDF de Envío después de marcar "Cargar PDF Envío".',
        color: "black",
      });
      return;
    }
    if (checkExoneracion.checked && !archivoExoneracion) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: 'Por favor, seleccione el PDF de Exoneración después de marcar "Cargar Exoneración".',
        color: "black",
      });
      return;
    }
    if (checkAnticipo.checked && !archivoAnticipo) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: 'Por favor, seleccione el PDF del Anticipo después de marcar "Cargar PDF Anticipo".',
        color: "black",
      });
      return;
    }
  }

  // Crear FormData
  const formData = new FormData();
  formData.append("falla_id", descrpFailure_id); // Enviamos el ID de la falla
  formData.append("falla_text", descrpFailure_text); // ¡Y el texto de la falla!
  formData.append("serial", serial);
  formData.append("coordinador", coordinador);
  formData.append("nivelFalla", nivelFallaValue);
  formData.append("nivelFalla_text", nivelFallaText);
  formData.append("id_status_payment", idStatusPayment); // Viene de UpdateGuarantees()
  formData.append("id_user", id_user);
  formData.append("rif", rif);
  formData.append("coordinadorNombre", coordinadorNombre); // Añadir el nombre del coordinador

  // Añadir archivos a FormData SOLO si 'uploadNow' está checked Y el checkbox correspondiente está marcado
  if (uploadNowRadio.checked) {
    const checkEnvio = document.getElementById("checkEnvio");
    const checkExoneracion = document.getElementById("checkExoneracion");
    const checkAnticipo = document.getElementById("checkAnticipo");

    if (checkEnvio.checked && archivoEnvio) {
      formData.append("archivoEnvio", archivoEnvio);
    }
    if (checkExoneracion.checked && archivoExoneracion) {
      formData.append("archivoExoneracion", archivoExoneracion);
    }
    if (checkAnticipo.checked && archivoAnticipo) {
      formData.append("archivoAnticipo", archivoAnticipo);
    }
  }
  formData.append("action", "SaveDataFalla2"); // Acción para el backend

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SaveDataFalla2`);
  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          // Lógica del correo para Nivel 2
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
              const responseEmail = JSON.parse(xhrEmail.responseText);
            } else {
              console.error(
                "Error al solicitar el envío de correo:",
                xhrEmail.status,
                xhrEmail.responseText
              );
              Swal.fire({
                icon: "error",
                title: "Error al enviar correo",
                text: "Hubo un problema al intentar enviar el correo al coordinador.",
                color: "black",
              });
            }
          };
          xhrEmail.onerror = function () {
            console.error("Error de red al solicitar el envío de correo.");
            Swal.fire({
              icon: "error",
              title: "Error de conexión",
              text: "No se pudo conectar con el servidor para enviar el correo.",
              color: "black",
            });
          };
          const params = `id_coordinador=${encodeURIComponent(coordinador)}`;
          xhrEmail.send(params);

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
              const beautifulHtmlContent = `
                                <div style="text-align: left; padding: 15px;">
    <h3 style="color: #0056b3; margin-bottom: 15px; text-align: center;">🔧 ¡Ticket Generado! 🔧</h3>
    <p style="font-size: 1.1em; margin-bottom: 10px;">
        <strong>🎫 Nro. de Ticket:</strong> <span style="font-weight: bold; color: #d9534f;">${
          ticketData.Nr_ticket
        }</span>
    </p>
    <p style="margin-bottom: 8px;">
        <strong>⚙️ Serial del Equipo:</strong> ${ticketData.serial}
    </p>
    <p style="margin-bottom: 8px;">
        <strong>📝 Falla Reportada (Texto):</strong> ${ticketData.falla_text}
    </p>
    <p style="margin-bottom: 8px;">
        <strong>📊 Nivel de Falla (Texto):</strong> ${
          ticketData.nivelFalla_text
        }
    </p>
    <p style="margin-bottom: 8px;">
        <strong>🏢 RIF Cliente:</strong> ${ticketData.rif || "N/A"}
    </p>
    <p style="margin-bottom: 8px;">
        <strong>👤 Usuario Gesti&oacuten:</strong> ${
          ticketData.user_gestion || "N/A"
        }
    </p>
    <p style="margin-bottom: 8px;">
        <strong>🧑‍💻 Coordinador Asignado:</strong> ${
          ticketData.coordinador || "N/A"
        }
    </p>
    <strong>
        <p style="font-size: 0.9em; color: #6c757d; margin-top: 20px; text-align: center;">
            Se ha enviado una notificación por correo electrónico.
        </p>
    </strong>
</div>
`;

              Swal.fire({
                icon: "success",
                title: "Detalles del Ticket",
                html: beautifulHtmlContent,
                color: "black",
                confirmButtonText: "Cerrar",
                confirmButtonColor: "#003594",
                showClass: {
                  popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                  popup: "animate__animated animate__fadeOutUp",
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then(() => {
                location.reload(); // Recarga la página después de cerrar el modal de detalles
              });

              // Considera no usar jQuery si ya estás usando Vanilla JS para todo.
              $("#miModal").css("display", "none"); // Oculta el modal principal si está usando jQuery
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
          confirmButtonText: "Entendido",
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
  function updateFileUploadButtonVisibility() {
    // Solo mostrar el botón si 'uploadNow' está marcado Y el checkbox está marcado
    // Usamos 'flex' para mantener la alineación si usas display:flex en el padre del botón
    botonCargaPDFEnv.style.display =
      uploadNowRadio.checked && checkEnvio.checked ? "flex" : "none";
    botonCargaExoneracion.style.display =
      uploadNowRadio.checked && checkExoneracion.checked ? "flex" : "none";
    botonCargaAnticipo.style.display =
      uploadNowRadio.checked && checkAnticipo.checked ? "flex" : "none";
  }

  // --- Event Listeners ---

  // Event listeners para los radio buttons
  uploadNowRadio.addEventListener("change", updateDocumentUploadVisibility);
  uploadLaterRadio.addEventListener("change", updateDocumentUploadVisibility);

  // Event listeners para los checkboxes
  checkEnvio.addEventListener("change", updateFileUploadButtonVisibility);
  checkExoneracion.addEventListener("change", updateFileUploadButtonVisibility);
  checkAnticipo.addEventListener("change", updateFileUploadButtonVisibility);

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
              const responseEmail = JSON.parse(xhrEmail.responseText);
              // Puedes manejar la respuesta del envío de correo aquí si es necesario
              console.log("Respuesta del envío de correo:", responseEmail);
            } else {
              console.error(
                "Error al solicitar el envío de correo:",
                xhrEmail.status
              );
            }
          };

          xhrEmail.onerror = function () {
            console.error("Error de red al solicitar el envío de correo.");
          };

          xhrEmail.send(); // No necesitas enviar datos adicionales si tu backend ya tiene la información
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
                                        <strong>🎫 Nro. de Ticket:</strong> <span style="font-weight: bold; color: #d9534f;">${
                                          ticketData.Nr_ticket
                                        }</span>
                                    </p>
                                    <p style="margin-bottom: 8px;">
                                        <strong>👤 Usuario Gesti&oacuten:</strong> ${
                                          ticketData.user_gestion || "N/A"
                                        }
                                    </p>
                                    <p style="margin-bottom: 8px;">
                                        <strong>⚙️ Serial del Equipo:</strong> ${
                                          ticketData.serial
                                        }
                                    </p>
                                    <p style="margin-bottom: 8px;">
                                        <strong>🚨 Falla Reportada:</strong> ${
                                          ticketData.falla_text
                                        }
                                    </p>
                                    <p style="margin-bottom: 8px;">
                                        <strong>📊 Nivel de Falla:</strong> ${
                                          ticketData.nivelFalla_text
                                        }
                                    </p>
                                    <p style="margin-bottom: 8px;">
                                        <strong>🏢 RIF Cliente:</strong> ${
                                          ticketData.rif || "N/A"
                                        }
                                    </p>
                                    <strong><p style="font-size: 0.9em; color: black; margin-top: 20px; text-align: center;">
                                        Se ha enviado una notificación por correo electrónico.<br>
                                        <h7>El Estatus del Ticket es: ${
                                          ticketData.status_text
                                        }</h7>
                                    </p></strong>
                                </div>`;
              Swal.fire({
                icon: "success", // Un icono de éxito también para este modal
                title: "Detalles del Ticket",
                html: beautifulHtmlContent, // Contenido HTML personalizado
                confirmButtonText: "Cerrar",
                confirmButtonColor: "#003594", // Botón de confirmación AZUL
                showClass: {
                  popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                  popup: "animate__animated animate__fadeOutUp",
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then(() => {
                location.reload(); // Recarga la página después de cerrar este modal
              });

              $("#miModal1").css("display", "none"); // Cerrar el modal de entrada
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
          confirmButtonText: "Entendido",
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

// Asegúrate de que las funciones updateDocumentUploadVisibility y updateFileUploadButtonVisibility
// estén definidas en el ámbito global o accesibles desde clearFormFields, como en el ejemplo que te di antes.

function clearFormFields() {
  console.log("clearFormFields() ha sido llamada para resetear el formulario.");

  // Limpiar campos de Modal Nivel 2 (miModal)
  const fallaSelect2 = document.getElementById("FallaSelect2");
  if (fallaSelect2) fallaSelect2.value = "";

  const inputRif = document.getElementById("InputRif");
  if (inputRif) inputRif.value = "";

  const serialSelect = document.getElementById("serialSelect");
  if (serialSelect) serialSelect.value = "";

  const asignarCoordinador = document.getElementById("AsiganrCoordinador");
  if (asignarCoordinador) asignarCoordinador.value = "";

  const fallaSelectt2 = document.getElementById("FallaSelectt2");
  if (fallaSelectt2) fallaSelectt2.value = "2"; // Restablecer a Nivel 2 por defecto (o '')

  const rifMensaje1 = document.getElementById("rifMensaje1");
  if (rifMensaje1) rifMensaje1.innerHTML = "";

  const rifMensaje = document.getElementById("rifMensaje");
  if (rifMensaje) rifMensaje.innerHTML = "";

  // --- Función auxiliar para limpiar un input de tipo file ---
  function clearFileInput(fileInputId) {
    const oldFileInput = document.getElementById(fileInputId);
    if (oldFileInput) {
      const newFileInput = oldFileInput.cloneNode(true);
      oldFileInput.parentNode.replaceChild(newFileInput, oldFileInput);
    }
  }

  // --- Limpiar los input type="file" ---
  clearFileInput("EnvioInput");
  clearFileInput("ExoneracionInput");
  clearFileInput("AnticipoInput");

  // --- Limpiar los elementos DIV que muestran el nombre del archivo ---
  const envioStatusDiv = document.getElementById("envioStatus");
  if (envioStatusDiv) {
    envioStatusDiv.textContent = "";
  }

  const exoneracionStatusDiv = document.getElementById("exoneracionStatus");
  if (exoneracionStatusDiv) {
    exoneracionStatusDiv.textContent = "";
  }

  const anticipoStatusDiv = document.getElementById("anticipoStatus");
  if (anticipoStatusDiv) {
    anticipoStatusDiv.textContent = "";
  }

  // --- Restablecer los radio buttons y checkboxes de carga de documentos ---
  const uploadNowRadio = document.getElementById("uploadNow");
  const uploadLaterRadio = document.getElementById("uploadLater");
  const checkEnvio = document.getElementById("checkEnvio");
  const checkExoneracion = document.getElementById("checkExoneracion");
  const checkAnticipo = document.getElementById("checkAnticipo");
  const documentUploadOptions = document.getElementById(
    "documentUploadOptions"
  );

  // 1. Marcar el radio button "No" (Pendiente por cargar documentos)
  // ESTA ES LA CORRECCIÓN CLAVE
  if (uploadLaterRadio) {
    uploadLaterRadio.checked = true; // <-- ¡Ahora sí, marca "No"!
  }
  // Asegurarse de que "Sí" no esté marcado
  if (uploadNowRadio) {
    uploadNowRadio.checked = false; // <-- Asegura que "Sí" esté desmarcado
  }

  // 2. Desmarcar todos los checkboxes de documentos
  if (checkEnvio) {
    checkEnvio.checked = false;
  }
  if (checkExoneracion) {
    checkExoneracion.checked = false;
  }
  if (checkAnticipo) {
    checkAnticipo.checked = false;
  }

  // 3. Llamar a la función de visibilidad para que todo se oculte correctamente
  // y los botones se reinicien.
  // Es crucial que 'updateDocumentUploadVisibility' esté disponible globalmente.
  if (typeof updateDocumentUploadVisibility === "function") {
    updateFileUploadButtonVisibility();
  } else {
    // Fallback si la función no está disponible globalmente
    // Esto debería ocultar la sección de opciones y los botones individuales
    if (documentUploadOptions) {
      documentUploadOptions.style.display = "none";
    }
    const botonCargaPDFEnv = document.getElementById("botonCargaPDFEnv");
    const botonCargaExoneracion = document.getElementById(
      "botonCargaExoneracion"
    );
    const botonCargaAnticipo = document.getElementById("botonCargaAnticipo");
    if (botonCargaPDFEnv) botonCargaPDFEnv.style.display = "none";
    if (botonCargaExoneracion) botonCargaExoneracion.style.display = "none";
    if (botonCargaAnticipo) botonCargaAnticipo.style.display = "none";
  }

  // Limpiar campos de Modal Nivel 1 (miModal1)
  const fallaSelect1 = document.getElementById("FallaSelect1");
  if (fallaSelect1) fallaSelect1.value = "";

  const inputRif1 = document.getElementById("InputRif1");
  if (inputRif1) inputRif1.value = "";

  const serialSelect1 = document.getElementById("serialSelect1");
  if (serialSelect1) serialSelect1.value = "";

  const fallaSelectt1 = document.getElementById("FallaSelectt1");
  if (fallaSelectt1) fallaSelectt1.value = "1"; // Restablecer a Nivel 1 por defecto (o '')
}

/*function clearFormFields() {
  // Limpiar campos de Modal Nivel 2 (miModal)
  document.getElementById("FallaSelect2").value = "";
  document.getElementById("InputRif").value = "";
  document.getElementById("serialSelect").value = "";
  document.getElementById("AsiganrCoordinador").value = "";
  document.getElementById("FallaSelectt2").value = "2"; // Restablecer a Nivel 2 por defecto (o '')
  document.getElementById("rifMensaje1").innerHTML = ""; // Limpiar mensaje de error
  document.getElementById("rifMensaje").innerHTML = ""; // Limpiar mensaje de error

  // --- Función auxiliar para limpiar un input de tipo file ---
  function clearFileInput(fileInputId) {
    const oldFileInput = document.getElementById(fileInputId);
    if (oldFileInput) {
      const newFileInput = oldFileInput.cloneNode(true);
      oldFileInput.parentNode.replaceChild(newFileInput, oldFileInput);
    }
  }

  // --- Limpiar los input type="file" ---
  clearFileInput("EnvioInput");
  clearFileInput("ExoneracionInput");
  clearFileInput("AnticipoInput");

  // --- ADICIONAL: Limpiar los SPAN dinámicamente creados que muestran el nombre del archivo ---
  // Verifica si las variables globales están definidas antes de intentar acceder a ellas
  if (fileChosenSpanEnvio) {
    fileChosenSpanEnvio.textContent = "";
    fileChosenSpanEnvio.style.cssText =
      "color: gray; font-style: italic; margin-left: 5px;"; // Restablece el estilo si quieres
  }
  if (fileChosenSpanExo) {
    fileChosenSpanExo.textContent = "";
    fileChosenSpanExo.style.cssText =
      "color: gray; font-style: italic; margin-left: 5px;";
  }
  if (fileChosenSpanAntici) {
    fileChosenSpanAntici.textContent = "";
    fileChosenSpanAntici.style.cssText =
      "color: gray; font-style: italic; margin-left: 5px;";
  }
  // --- Fin de limpieza de spans de texto ---

  // Limpiar campos de Modal Nivel 1 (miModal1)
  document.getElementById("FallaSelect1").value = "";
  document.getElementById("InputRif1").value = "";
  document.getElementById("serialSelect1").value = "";
  document.getElementById("FallaSelectt1").value = "1"; // Restablecer a Nivel 1 por defecto (o '')

  // Si también tienes inputs de archivo en el Modal Nivel 1 y sus displays de texto, límpialos aquí
  // clearFileInput("IdDeTuInputDeArchivoNivel1");
  // if (fileChosenSpanNivel1) { fileChosenSpanNivel1.textContent = ''; }
}


fetch("/SoportePost/app/controllers/consulta_rif.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    if (data.expired_sessions) {
      //alert(data.message);
      window.location.href = data.redirect;
    }

    // Agregar lógica de recarga automática con verificación
    if (data.sessionLifetime) {
      if (Number.isInteger(data.sessionLifetime)) {
        setTimeout(function () {
          location.reload(true); // Forzar recarga desde el servidor
        }, data.sessionLifetime * 1000); // sessionLifetime está en segundos
      } else {
        console.error(
          "sessionLifetime no es un entero válido:",
          data.sessionLifetime
        );
      }
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
//// END  SESSION EXPIRE DEL USER

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
  const razonCountTableCard = document.querySelector(".card");
  razonCountTableCard.style.display = "block"; // Muestra la tabla

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchRif`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  const tbody = document
    .getElementById("rifCountTable")
    .getElementsByTagName("tbody")[0];

  // Limpia la tabla ANTES de la nueva búsqueda
  tbody.innerHTML = "";

  // Destruye DataTables si ya está inicializado
  if ($.fn.DataTable.isDataTable("#rifCountTable")) {
    $("#rifCountTable").DataTable().destroy();
  }

  // Limpia la tabla usando removeChild
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success) {
          const rifData = response.rif; // Cambia el nombre de la variable aquí

          rifData.forEach((item) => {
            // Usa un nombre diferente para el elemento individual
            const row = tbody.insertRow();
            const id_clienteCell = row.insertCell();
            const razonsocialCell = row.insertCell();
            const rifCell = row.insertCell();
            const name_modeloposCell = row.insertCell();
            const serial_posCell = row.insertCell();
            const afiliacionCell = row.insertCell();
            const fechainstallCell = row.insertCell();
            const bancoCell = row.insertCell();
            const directionCell = row.insertCell();
            const estadoCell = row.insertCell();
            const municipioCell = row.insertCell();

            id_clienteCell.textContent = item.id_cliente; // Accede a las propiedades del 'item'
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

            // Modal de detalles del serial (tu código existente)
            const modalSerial = document.getElementById("ModalSerial");
            const spanSerialClose =
              document.getElementById("ModalSerial-close");
            enlaceSerial.onclick = function () {
              modalSerial.style.display = "block";
              fetchSerialData(item.serial_pos, item.rif);
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

            //TEXTO EN LA VISTA
            const fechaInstalacion = new Date(item.fechainstalacion);
            const ahora = new Date();
            const diffEnMilisegundos =
              ahora.getTime() - fechaInstalacion.getTime();
            const diffEnMeses =
              diffEnMilisegundos / (1000 * 60 * 60 * 24 * 30.44);

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
              garantiaDetectada = true;
            } else {
              garantiaTexto = "Sin garantía";
              garantiaClase = "sin-garantia";
            }

            garantiaLabel.textContent = garantiaTexto;
            garantiaLabel.className = garantiaClase;
            fechainstallCell.appendChild(document.createElement("br"));
            fechainstallCell.appendChild(garantiaLabel);
            //END TEXTO EN LA VISTA

            bancoCell.textContent = item.banco;
            directionCell.textContent = item.direccion_instalacion;
            estadoCell.textContent = item.estado;
            municipioCell.textContent = item.municipio;
          });

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
              lengthMenu: "Mostrar _MENU_ Registros", // Esta línea es la clave
              emptyTable: "No hay Registros disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ Registro(s) )",
              infoEmpty: "No hay Registros disponibles",
              infoFiltered: "(Filtrado de _MAX_ Registros disponibles)",
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
          $("#rifCountTable").resizableColumns();
        } else {
          tbody.innerHTML =
            '<tr><td colspan="11">No se ha encontrado resultados</td></tr>';
          console.error("Error:", response.message);
        }
      } catch (error) {
        tbody.innerHTML =
          '<tr><td colspan="11">Error al procesar la respuesta</td></tr>';
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      tbody.innerHTML =
        '<tr><td colspan="11">No se encontraron usuarios</td></tr>';
    } else {
      tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
    console.error("Error de red");
  };
  const rifInputValue = obtenerRifCompleto();
  const datos = `action=SearchRif&rif=${encodeURIComponent(rifInputValue)}`;
  xhr.send(datos);
}

function SendSerial() {
  const razonCountTableCard = document.querySelector(".card");

  razonCountTableCard.style.display = "block"; // Muestra la tabla

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchSerialData`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  const tbody = document
    .getElementById("rifCountTable")
    .getElementsByTagName("tbody")[0];

  const tipoRif = $("#rifTipo").val();
  const numeroRif = $("#rifInput").val();
  const rifCompleto = tipoRif + numeroRif;
  console.log("Buscar RIF:", rifCompleto);

  // Limpia la tabla ANTES de la nueva búsqueda
  tbody.innerHTML = "";

  // Destruye DataTables si ya está inicializado
  if ($.fn.DataTable.isDataTable("#rifCountTable")) {
    $("#rifCountTable").DataTable().destroy();
  }

  // Limpia la tabla usando removeChild
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success) {
          const serialData = response.serialData; // Cambia el nombre de la variable aquí

          serialData.forEach((item) => {
            // Usa un nombre diferente para el elemento individual
            const row = tbody.insertRow();
            const id_clienteCell = row.insertCell();
            const razonsocialCell = row.insertCell();
            const rifCell = row.insertCell();
            const name_modeloposCell = row.insertCell();
            const serial_posCell = row.insertCell();
            const afiliacionCell = row.insertCell();
            const fechainstallCell = row.insertCell();
            const bancoCell = row.insertCell();
            const directionCell = row.insertCell();
            const estadoCell = row.insertCell();
            const municipioCell = row.insertCell();

            id_clienteCell.textContent = item.id_cliente; // Accede a las propiedades del 'item'
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

            // Modal de detalles del serial (tu código existente)
            const modalSerial = document.getElementById("ModalSerial");
            const spanSerialClose =
              document.getElementById("ModalSerial-close");
            enlaceSerial.onclick = function () {
              modalSerial.style.display = "block";
              fetchSerialData(item.serial_pos, item.rif);
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

            //TEXTO EN LA VISTA
            const fechaInstalacion = new Date(item.fechainstalacion);
            const ahora = new Date();
            const diffEnMilisegundos =
              ahora.getTime() - fechaInstalacion.getTime();
            const diffEnMeses =
              diffEnMilisegundos / (1000 * 60 * 60 * 24 * 30.44);

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
              garantiaDetectada = true;
            } else {
              garantiaTexto = "Sin garantía";
              garantiaClase = "sin-garantia";
            }

            garantiaLabel.textContent = garantiaTexto;
            garantiaLabel.className = garantiaClase;
            fechainstallCell.appendChild(document.createElement("br"));
            fechainstallCell.appendChild(garantiaLabel);
            //END TEXTO EN LA VISTA

            bancoCell.textContent = item.banco;
            directionCell.textContent = item.direccion_instalacion;
            estadoCell.textContent = item.estado;
            municipioCell.textContent = item.municipio;
          });

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
              lengthMenu: "Mostrar _MENU_ Registros", // Esta línea es la clave
              emptyTable: "No hay Registros disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ Registro(s) )",
              infoEmpty: "No hay Registros disponibles",
              infoFiltered: "(Filtrado de _MAX_ Registros disponibles)",
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
          $("#rifCountTable").resizableColumns();
        } else {
          tbody.innerHTML = '<tr><td colspan="11">Error al cargar</td></tr>';
          console.error("Error:", response.message);
        }
      } catch (error) {
        tbody.innerHTML =
          '<tr><td colspan="11">Error al procesar la respuesta</td></tr>';
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      tbody.innerHTML =
        '<tr><td colspan="11">No se encontraron usuarios</td></tr>';
    } else {
      tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
    console.error("Error de red");
  };
  const serialInputValue = document.getElementById("serialInput").value;
  const datos = `action=SearchSerialData&serial=${encodeURIComponent(
    serialInputValue
  )}`;
  xhr.send(datos);
}

function SendRazon() {
  const razonCountTableCard = document.querySelector(".card");

  razonCountTableCard.style.display = "block"; // Muestra la tabla

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchRazonData`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  const tbody = document
    .getElementById("rifCountTable")
    .getElementsByTagName("tbody")[0];

  // Limpia la tabla ANTES de la nueva búsqueda
  tbody.innerHTML = "";

  // Destruye DataTables si ya está inicializado
  if ($.fn.DataTable.isDataTable("#rifCountTable")) {
    $("#rifCountTable").DataTable().destroy();
  }

  // Limpia la tabla usando removeChild
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success) {
          const RazonData = response.RazonData; // Cambia el nombre de la variable aquí

          RazonData.forEach((item) => {
            // Usa un nombre diferente para el elemento individual
            const row = tbody.insertRow();
            const id_clienteCell = row.insertCell();
            const razonsocialCell = row.insertCell();
            const rifCell = row.insertCell();
            const name_modeloposCell = row.insertCell();
            const serial_posCell = row.insertCell();
            const afiliacionCell = row.insertCell();
            const fechainstallCell = row.insertCell();
            const bancoCell = row.insertCell();
            const directionCell = row.insertCell();
            const estadoCell = row.insertCell();
            const municipioCell = row.insertCell();

            id_clienteCell.textContent = item.id_cliente; // Accede a las propiedades del 'item'
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

            // Modal de detalles del serial (tu código existente)
            const modalSerial = document.getElementById("ModalSerial");
            const spanSerialClose =
              document.getElementById("ModalSerial-close");
            enlaceSerial.onclick = function () {
              modalSerial.style.display = "block";
              fetchSerialData(item.serial_pos, item.rif);
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

            //TEXTO EN LA VISTA
            const fechaInstalacion = new Date(item.fechainstalacion);
            const ahora = new Date();
            const diffEnMilisegundos =
              ahora.getTime() - fechaInstalacion.getTime();
            const diffEnMeses =
              diffEnMilisegundos / (1000 * 60 * 60 * 24 * 30.44);

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
              garantiaDetectada = true;
            } else {
              garantiaTexto = "Sin garantía";
              garantiaClase = "sin-garantia";
            }

            garantiaLabel.textContent = garantiaTexto;
            garantiaLabel.className = garantiaClase;
            fechainstallCell.appendChild(document.createElement("br"));
            fechainstallCell.appendChild(garantiaLabel);
            //END TEXTO EN LA VISTA

            bancoCell.textContent = item.banco;
            directionCell.textContent = item.direccion_instalacion;
            estadoCell.textContent = item.estado;
            municipioCell.textContent = item.municipio;
          });

          // Inicialización de DataTables
          if ($.fn.DataTable.isDataTable("#rifCountTable")) {
            $("#rifCountTable").DataTable().destroy();
          }

          $("#rifCountTable").DataTable({
            dom: "Bfrtip",
            buttons: [
              {
                extend: "excelHtml5",
                footer: true,
                text: "Excel",
              },
            ],

            responsive: false,
            pagingType: "simple_numbers",
            lengthMenu: [5],
            autoWidth: false,
            language: {
              lengthMenu: "Mostrar _MENU_ Registros", // Esta línea es la clave
              emptyTable: "No hay Registros disponibles en la tabla",
              zeroRecords: "No se encontraron resultados para la búsqueda",
              info: "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ Registro(s) )",
              infoEmpty: "No hay Registros disponibles",
              infoFiltered: "(Filtrado de _MAX_ Registros disponibles)",
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
          $("#rifCountTable").resizableColumns();
        } else {
          tbody.innerHTML = '<tr><td colspan="11">Error al cargar</td></tr>';
          console.error("Error:", response.message);
        }
      } catch (error) {
        tbody.innerHTML =
          '<tr><td colspan="11">Error al procesar la respuesta</td></tr>';
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      tbody.innerHTML =
        '<tr><td colspan="11">No se encontraron usuarios</td></tr>';
    } else {
      tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
    console.error("Error de red");
  };
  const RazonInputValue = document.getElementById("RazonInput").value;
  const datos = `action=SearchRazonData&RazonSocial=${encodeURIComponent(
    RazonInputValue
  )}`;
  xhr.send(datos);
}

function fetchSerialData(serial, rif) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/SearchSerial`);

  globalSerial = serial;
  globalRif = rif;
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
              const createTicketFalla1Btn = document.getElementById(
                "createTicketFalla1Btn"
              );
              const createTicketFalla2Btn = document.getElementById(
                "createTicketFalla2Btn"
              );

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

                    // Si prefieres usar clases de Bootstrap (por ejemplo, d-none):
                    // createTicketFalla1Btn.classList.add('d-none');
                    // createTicketFalla2Btn.classList.add('d-none');

                    // Si usas el contenedor de botones:
                    // if (buttonsContainer) {
                    //     buttonsContainer.style.display = 'none';
                    //     // O buttonsContainer.classList.add('d-none');
                    // }
                  } else {
                    // Si el estatus NO es "Equipo Desafiliado" ni "Equipo Inactivo", asegúrate de que los botones estén visibles:
                    createTicketFalla1Btn.style.display = "block"; // Restablece el display a su valor por defecto
                    createTicketFalla2Btn.style.display = "block"; // Restablece el display a su valor por defecto

                    // O si usas clases de Bootstrap:
                    // createTicketFalla1Btn.classList.remove('d-none');
                    // createTicketFalla2Btn.classList.remove('d-none');

                    // Si usas el contenedor de botones:
                    // if (buttonsContainer) {
                    //     buttonsContainer.style.display = '';
                    //     // O buttonsContainer.classList.remove('d-none');
                    // }
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

          // Actualiza la imagen del modal
          downloadImageModal(serial);

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
                info: "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ Registro(s) )",
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
          if (imgElement) {
            imgElement.src = rutaImagen;
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

  if (buscarPorRazonBtn && razonCountTableCard) {
    buscarPorRazonBtn.addEventListener("click", function () {
      razonCountTableCard.style.display = "none"; // Muestra la tabla
      razonInput.style.display = "block"; // Muestra el input
      buscarRazon.style.display = "block"; // Oculta el botón
      selectInputRif.style.display = "none"; // Muestra el select
      buscarRif.style.display = "none"; // Oculta el botón
      rifInput.style.display = "none"; // Muestra el input*/
      serialInput.style.display = "none"; // Oculta el botón
      buscarSerial.style.display = "none"; // Oculta el botón
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla."); // Para verificar si los elementos se seleccionan
  }

  if (buscarPorRifBtn && rifCountTableCard) {
    buscarPorRifBtn.addEventListener("click", function () {
      rifCountTableCard.style.display = "none"; // Muestra la tabla
      rifInput.style.display = "block"; // Muestra el input
      selectInputRif.style.display = "block"; // Muestra el select
      buscarRif.style.display = "block"; // Oculta el botón

      buscarSerial.style.display = "none"; // Oculta el botón
      serialInput.style.display = "none";
      buscarRazon.style.display = "none"; // Oculta el botón
      razonInput.style.display = "none"; // Oculta el botón
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla."); // Para verificar si los elementos se seleccionan
  }

  if (buscarPorSerialBtn && serialCountTableCard) {
    buscarPorSerialBtn.addEventListener("click", function () {
      serialCountTableCard.style.display = "none"; // Muestra la tabla
      serialInput.style.display = "block"; // Muestra el input
      buscarSerial.style.display = "block"; // Oculta el botón
      selectInputRif.style.display = "none"; // Muestra el select
      rifInput.style.display = "none"; // Muestra el input
      buscarRif.style.display = "none"; // Oculta el botón
      buscarRazon.style.display = "none"; // Oculta el botón
      razonInput.style.display = "none"; // Oculta el botón
    });
  } else {
    console.log("Error: No se encontraron el botón o la tabla."); // Para verificar si los elementos se seleccionan
  }
});
//Llamar a la función PHP usando fetch    SESSION EXPIRE DEL USE
