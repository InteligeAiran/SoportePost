/*document.addEventListener("DOMContentLoaded", (event) => {
  const anchoPantalla = window.innerWidth;
  const altoPantalla = window.innerHeight;
  console.log(`Ancho de la pantalla: ${anchoPantalla}px`);
  console.log(`Alto de la pantalla: ${altoPantalla}px`);
});*/

document.addEventListener("DOMContentLoaded", function () {

  // Obtén la referencia al botón cerrar FUERA de la función getTicketData y del bucle
  const cerrar = document.getElementById("ModalStadisticMonth");
  const icon = document.getElementById("ModalStadisticMonthIcon");

  const modalElement = document.getElementById("monthlyTicketsModal");

  // Agrega el event listener al botón cerrar
  cerrar.addEventListener("click", function () {
    if (modalElement) {
      modalElement.style.display = 'none';
      modalElement.style.backdropFilter = 'none'; // Asegúrate de que el backdrop no esté visible
      modalElement.classList.remove("show"); // Elimina la clase 'show' para ocultar el modal
      document.body.classList.remove("modal-open"); // Elimina la clase 'modal-open' del body
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove(); // Elimina el backdrop si existe
      }
    }
  });

  icon.addEventListener("click", function () {
    if (modalElement) {
      modalElement.style.display = 'none';
      modalElement.style.backdropFilter = 'none'; // Asegúrate de que el backdrop no esté visible
      modalElement.classList.remove("show"); // Elimina la clase 'show' para ocultar el modal
      document.body.classList.remove("modal-open"); // Elimina la clase 'modal-open' del body
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove(); // Elimina el backdrop si existe
      }
    }
  });
});

// Para el campo "Nueva Contraseña"
jQuery('#clickme1').on('click', function () {
  jQuery('#newPassword').attr('type', function (index, currentAttr) {
    // Si el tipo actual es 'password', cámbialo a 'text' (mostrar).
    // Si no (es decir, es 'text'), cámbialo a 'password' (ocultar).
    return currentAttr === 'password' ? 'text' : 'password';
  });
});

// Para el campo "Confirmar Contraseña"
jQuery('#clickme').on('click', function () {
  jQuery('#confirmNewPassword').attr('type', function (index, currentAttr) {
    // Misma lógica para el campo de confirmación.
    return currentAttr === 'password' ? 'text' : 'password';
  });
});

$("#newPassword").keyup(function () {
  let string = $("#newPassword").val();
  $("#newPassword").val(string.replace(/ /g, ""))
});
$("#confirmNewPassword").keyup(function () {
  let string = $("#confirmNewPassword").val();
  $("#confirmNewPassword").val(string.replace(/ /g, ""))
});
//Llamar a la función PHP usando fetch    SESSION EXPIRE DEL USER
fetch("/SoportePost/app/controllers/dashboard.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text(); // Obtener la respuesta como texto primero
  })
  .then((responseText) => {
    if (responseText) {
      try {
        console.log("Response text:", responseText); // Mostrar la respuesta para depuración
        const data = JSON.parse(responseText); // Intentar parsear como JSON
        if (data.expired_sessions) {
          window.location.href = data.redirect;
        }

        if (data.sessionLifetime && typeof data.sessionLifetime === "number") {
          setTimeout(function () {
            location.reload(true);
          }, data.sessionLifetime * 1000);
        } else {
          console.error("Invalid sessionLifetime:", data.sessionLifetime);
        }
      } catch (error) {
        console.error("JSON parse error:", error);
        console.log("Response text:", responseText); // Mostrar la respuesta para depuración
      }
    } else {
      console.error("Empty response from server");
    }
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });

//// END  SESSION EXPIRE DEL USER

// Asegúrate de que ENDPOINT_BASE y APP_PATH estén definidos globalmente.
// Por ejemplo:
// const ENDPOINT_BASE = "http://localhost/";
// const APP_PATH = "your_app_path/";

function checkUserStatusAndPromptPassword() {
  const id_user = document.getElementById("userIdForPassword").value;

  const xhr = new XMLHttpRequest();
  // El endpoint de tu API que verifica el estatus del usuario logueado (desde la sesión)
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/users/checkStatus`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        const userStatus = response.isVerified; // Asignar un valor por defecto si no existe

        if (userStatus.id_status === "1") {
          const newPasswordModalElement = document.getElementById("newPasswordModal");

          if (newPasswordModalElement) {
            const modalBootstrap = new bootstrap.Modal(newPasswordModalElement, {
              backdrop: 'static'
              // Puedes añadir más opciones de configuración aquí si es necesario

            });
            modalInstance = modalBootstrap; // Asigna la instancia a la variable
            modalBootstrap.show();


            newPasswordModalElement.style.display = "block";
            newPasswordModalElement.style.opacity = "1"; // Si tienes transiciones, esto podría ayudar

            const modalUserIdInput = document.getElementById(
              "modalUserIdForPassword"
            );

            if (modalUserIdInput && userStatus.id_user) {
              // Asigna el ID del usuario que viene en la respuesta del backend
              modalUserIdInput.value = userStatus.id_user;
            } else {
              // Si el backend no devuelve userId en isVerified, usa el que ya tenías de la sesión inicial
              if (modalUserIdInput) {
                modalUserIdInput.value = id_user;
              }
            }

            // Si tienes un backdrop de Bootstrap, también deberías mostrarlo manualmente
            const modalBackdrop = document.querySelector(".modal-backdrop");
            if (modalBackdrop) {
              modalBackdrop.style.display = "block";
              modalBackdrop.style.opacity = ".5"; // Valor típico de opacidad para el backdrop
            } else {
              // Si no hay backdrop, considera añadir uno simple manualmente para oscurecer el fondo
              const createdBackdrop = document.createElement("div");
              createdBackdrop.classList.add("modal-backdrop", "fade", "show"); // Bootstrap classes
              createdBackdrop.style.display = "block";
              createdBackdrop.style.opacity = ".5";
              document.body.appendChild(createdBackdrop);
            }

            // También necesitas añadir la clase 'show' para las animaciones y visibilidad de Bootstrap
            newPasswordModalElement.classList.add("show");
            newPasswordModalElement.setAttribute("aria-modal", "true");
            newPasswordModalElement.setAttribute("role", "dialog");
            document.body.classList.add("modal-open"); // Añadir clase al body para evitar scroll
            Swal.fire({
              icon: "info",
              title: "Cambio de Contraseña Requerido",
              text:
                response.message ||
                "Por favor, ingrese una nueva contraseña para continuar.",
              allowOutsideClick: false, // El usuario no puede cerrar el modal haciendo clic fuera
              // showConfirmButton: false, // ¡Esta línea se elimina para mostrar el botón!
              // timer: 5000, // ¡Elimina el temporizador si quieres que el botón sea la única forma de cerrar!
              // timerProgressBar: true, // También elimina la barra de progreso del temporizador

              // Configuración para el botón de confirmación
              showConfirmButton: true, // Mostrar el botón de confirmación
              confirmButtonText: "Okay", // Texto del botón
              confirmButtonColor: "#003594", // Color del botón (opcional, este es el azul predeterminado de SweetAlert)
              color: "black", // Color del texto (opcional, este es el blanco predeterminado de SweetAlert)
            });
          } else {
            console.error(
              "Error: El modal 'newPasswordModal' no fue encontrado en el DOM."
            );
          }
        }
        // Si response.success es false o userStatus no es 1, no se hace nada más (no se abre el modal)
        // Aquí podrías añadir lógica para otros estatus si los hubiera.
        else if (!response.success) {
          console.warn(
            "Verificación de estatus fallida:",
            response.message || "Mensaje desconocido."
          );
          // Opcional: mostrar un SweetAlert de error o un mensaje en algún div general
          Swal.fire({
            icon: 'error',
            title: 'Error de Verificación',
            text: response.message || 'No se pudo verificar el estatus del usuario.',
          });
        }
      } catch (error) {
        console.error("Error parsing JSON for checkUserStatus:", error);
        // Si tienes un div para errores generales, puedes usarlo aquí
        // document.getElementById('generalErrorDiv').innerHTML = 'Error al procesar la respuesta del servidor.';
      }
    } else {
      console.error(
        "Error in checkUserStatus request:",
        xhr.status,
        xhr.statusText
      );
      // Si tienes un div para errores generales, puedes usarlo aquí
      // document.getElementById('generalErrorDiv').innerHTML = `Error de conexión: ${xhr.status} ${xhr.statusText}`;
    }
  };

  xhr.onerror = function () {
    console.error("Network error for checkUserStatus request.");
    // Si tienes un div para errores generales, puedes usarlo aquí
    // document.getElementById('generalErrorDiv').innerHTML = 'Error de red al verificar el estatus.';
  };

  // No se envía ningún dato de usuario explícito, ya que se recupera de la sesión en el backend
  // Podrías enviar un simple 'action' si tu API lo requiere para enrutamiento
  const datos = `action=checkStatus&userId=${encodeURIComponent(id_user)}`; // O simplemente "" si el endpoint no necesita action
  xhr.send(datos);
}

// --- Event Listeners y la Lógica del Botón 'Guardar Contraseña' del modal ---
// --- Event Listeners y la Lógica del Botón 'Guardar Contraseña' del modal ---
document.addEventListener("DOMContentLoaded", function () {
  checkUserStatusAndPromptPassword(); // Llama a la función para verificar el estatus del usuario al cargar la página

  const newPasswordModalElement = document.getElementById("newPasswordModal");

  if (newPasswordModalElement) {
    newPasswordModalElement.addEventListener("hidden.bs.modal", function () {
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmNewPassword").value = "";
      document.getElementById("passwordError").innerHTML = ""; // Limpiar mensajes de error
      document.getElementById("passwordVerification").innerHTML = ""; // Limpiar mensajes de verificación
      document.getElementById("confirmPasswordError").innerHTML = ""; // Limpiar mensajes de confirmación
      document.getElementById("modalUserIdForPassword").value = ""; // Limpiar ID si se usó

    });
  }

  // *** LÓGICA DEL BOTÓN 'Guardar Contraseña' del modal (Actualización de Contraseña) ***
  const submitNewPasswordBtn = document.getElementById("submitNewPasswordBtn");
  if (submitNewPasswordBtn) {
    submitNewPasswordBtn.addEventListener("click", function () {
      const newPasswordInput = document.getElementById("newPassword");
      const confirmNewPasswordInput =
        document.getElementById("confirmNewPassword");
      const newPassword = newPasswordInput.value.trim();
      const confirmNewPassword = confirmNewPasswordInput.value.trim();

      const passwordErrorDiv = document.getElementById("passwordError");
      const confirmPasswordErrorDiv = document.getElementById(
        "confirmPasswordError"
      );

      // Limpiar errores previos
      passwordErrorDiv.innerHTML = "";
      confirmPasswordErrorDiv.innerHTML = "";

      // Validaciones iniciales del frontend
      if (newPassword === "") {
        passwordErrorDiv.innerHTML =
          "La nueva contraseña no puede estar vacía.";
        passwordErrorDiv.style.color = "red";
        newPasswordInput.style.borderColor = "red";
        newPasswordInput.focus();
        return;
      } else {
        newPasswordInput.style.borderColor = "green"; // Limpiar el borde rojo
      }

      if (confirmNewPassword === "") {
        confirmPasswordErrorDiv.innerHTML = "Debe confirmar la contraseña.";
        confirmPasswordErrorDiv.style.color = "red";
        confirmNewPasswordInput.style.borderColor = "red";
        confirmNewPasswordInput.focus();
        return;
      } else {
        confirmNewPasswordInput.style.borderColor = "green"; // Limpiar el borde rojo
      }

      if (newPassword !== confirmNewPassword) {
        passwordErrorDiv.innerHTML = "Las contraseñas no coinciden.";
        passwordErrorDiv.style.color = "red";
        newPasswordInput.style.borderColor = "red";
        confirmPasswordErrorDiv.innerHTML = "Las contraseñas no coinciden.";
        confirmPasswordErrorDiv.style.color = "red";
        confirmNewPasswordInput.style.borderColor = "red";
        newPasswordInput.focus(); // O enfocar el segundo campo
        return;
      }

      // Opcional: Validaciones de complejidad de contraseña (ej. longitud mínima)
      if (newPassword.length < 8) {
        passwordErrorDiv.innerHTML =
          "La contraseña debe tener al menos 8 caracteres.";
        passwordErrorDiv.style.color = "red";
        newPasswordInput.style.borderColor = "red";
        newPasswordInput.focus();
        return;
      }
      // Puedes añadir más reglas (números, mayúsculas, símbolos) si es necesario

      // Mostrar un SweetAlert de carga mientras se procesa la solicitud
      Swal.fire({
        title: "Actualizando Contraseña...",
        text: "Por favor, espere un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Realizar la llamada AJAX para actualizar la contraseña
      const xhrUpdate = new XMLHttpRequest();
      const id_user = document.getElementById("modalUserIdForPassword").value;
      newPasswordInput.style.borderColor = "green"; // Limpiar el borde rojo
      confirmNewPasswordInput.style.borderColor = "green"; // Limpiar el borde rojo
      // Este es tu nuevo endpoint en el backend para la actualización
      xhrUpdate.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/users/updatePassword`
      );
      xhrUpdate.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );

      xhrUpdate.onload = function () {
        Swal.close(); // Cerrar el SweetAlert de carga

        if (xhrUpdate.status === 200) {
          try {
            const response = JSON.parse(xhrUpdate.responseText);

            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text:
                  response.message || "Contraseña actualizada correctamente.",
                color: "black", // Color del texto
                timer: 3000,
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
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text:
                  response.message || "No se pudo actualizar la contraseña.",
                color: "black",
              });
            }
          } catch (error) {
            console.error("Error parsing JSON for updatePassword:", error);
            Swal.fire({
              icon: "error",
              title: "Error de Respuesta",
              text: "Error al procesar la respuesta del servidor al actualizar la contraseña.",
              color: "black",
            });
          }
        } else {
          console.error(
            "Error updating password:",
            xhrUpdate.status,
            xhrUpdate.statusText
          );
          Swal.fire({
            icon: "error",
            title: "Error de Conexión",
            text: `Error ${xhrUpdate.status}: ${xhrUpdate.statusText ||
              "No se pudo conectar con el servidor para actualizar la contraseña."
              }`,
            color: "black",
          });
        }
      };

      xhrUpdate.onerror = function () {
        Swal.close(); // Cerrar el SweetAlert de carga
        console.error("Network error for updatePassword request.");
        Swal.fire({
          icon: "error",
          title: "Error de Red",
          text: "Error de red al intentar actualizar la contraseña. Verifique su conexión.",
          color: "black",
        });
      };

      // Envía la nueva contraseña al backend.
      // Recuerda: el ID del usuario debe recuperarse de la sesión en el backend para mayor seguridad.
      const datosUpdate = `action=updatePassword&newPassword=${encodeURIComponent(
        newPassword
      )}&userId=${encodeURIComponent(id_user)}`;
      xhrUpdate.send(datosUpdate);
    });
  }

  var myModal = document.getElementById("CloseIcon");
  var buttonCerrar = document.getElementById("Cerrar-botton");

  // Agrega un listener para el evento 'hidden.bs.modal'
  // Este evento se dispara cuando el modal ha terminado de ocultarse (después de la transición CSS)
  myModal.addEventListener("click", function () {
    // Redirige al usuario a la página de login
    window.location.href = "cerrar_session"; // Cambia 'login.php' por la ruta real de tu página de login
  });

  buttonCerrar.addEventListener("click", function () {
    // Redirige al usuario a la página de login
    window.location.href = "cerrar_session"; // Cambia 'login.php' por la ruta real de tu página de login
  });
});

function getTicketOpen() {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketAbiertoCount`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById('TicketsAbiertos').textContent = response.count; // Selecciona por ID
        } else {
          console.error('Error:', response.message);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else {
      console.error('Error:', xhr.status, xhr.statusText);
    }
  };

  const datos = 'action=getTicketAbiertoCount';
  xhr.send(datos);
}

function getTicketPercentage() {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketPercentage`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const percentage = response.percentage;
          const percentageSpan = document.getElementById('ticketPercentage');

          percentageSpan.textContent = (percentage > 0 ? '+' : '') + percentage + '%';

          if (percentage < 0) {
            percentageSpan.classList.remove('text-success');
            percentageSpan.classList.add('text-danger');
          } else {
            percentageSpan.classList.remove('text-danger');
            percentageSpan.classList.add('text-success');
          }
        } else {
          console.error('Error:', response.message);
        }
      } catch (error) {
        console.error('Error parsing JSON for percentage:', error);
      }
    } else {
      console.error('Error fetching percentage:', xhr.status, xhr.statusText);
    }
  };

  const datos = 'action=getTicketPercentage';
  xhr.send(datos);
}

// Llama a la función getTicketPercentage() cuando la página se cargue
window.addEventListener('load', () => {
  getTicketOpen();
  getTicketPercentage(); // Agrega esta línea
});

function getTicketResolve() {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketsResueltosCount`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById('TicketsResuelto').textContent = response.count; // Selecciona por ID
        } else {
          console.error('Error:', response.message);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else {
      console.error('Error:', xhr.status, xhr.statusText);
    }
  };

  const datos = 'action=getTicketsResueltosCount';
  xhr.send(datos);
}

function getTicketsResueltosPercentage() {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketsResueltosPercentage`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const percentage = response.percentage;
          const percentageSpan = document.getElementById('ticketResueltoPercentage');

          percentageSpan.textContent = (percentage > 0 ? '+' : '') + percentage + '%';

          if (percentage < 0) {
            percentageSpan.classList.remove('text-success');
            percentageSpan.classList.add('text-danger');
          } else {
            percentageSpan.classList.remove('text-danger');
            percentageSpan.classList.add('text-success');
          }
        } else {
          console.error('Error:', response.message);
        }
      } catch (error) {
        console.error('Error parsing JSON for Tickets Resueltos percentage:', error);
      }
    } else {
      console.error('Error fetching Tickets Resueltos percentage:', xhr.status, xhr.statusText);
    }
  };

  const datos = 'action=getTicketsResueltosPercentage';
  xhr.send(datos);
}

// Llama a las funciones cuando la página se cargue
window.addEventListener('load', () => {
  getTicketResolve();
  getTicketsResueltosPercentage(); // Agrega esta línea
});

function getTicketTotal() {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTicketsTotalCount`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.getElementById('TotalTicket').textContent = response.count; // Selecciona por ID
        } else {
          console.error('Error:', response.message);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else {
      console.error('Error:', xhr.status, xhr.statusText);
    }
  };

  const datos = 'action=getTicketsTotalCount';
  xhr.send(datos);
}

function getTotalTicketsPercentage() {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/getTotalTicketsPercentage`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const percentage = response.percentage;
          const percentageSpan = document.getElementById('totalTicketPercentage');

          percentageSpan.textContent = (percentage > 0 ? '+' : '') + percentage + '%';

          if (percentage < 0) {
            percentageSpan.classList.remove('text-success');
            percentageSpan.classList.add('text-danger');
          } else {
            percentageSpan.classList.remove('text-danger');
            percentageSpan.classList.add('text-success');
          }
        } else {
          console.error('Error:', response.message);
        }
      } catch (error) {
        console.error('Error parsing JSON for Total Tickets percentage:', error);
      }
    } else {
      console.error('Error fetching Total Tickets percentage:', xhr.status, xhr.statusText);
    }
  };

  const datos = 'action=getTotalTicketsPercentage';
  xhr.send(datos);
}

// Llama a las funciones cuando la página se cargue
window.addEventListener('load', () => {
  getTicketTotal();
  getTotalTicketsPercentage(); // Agrega esta línea
});

document.addEventListener('DOMContentLoaded', function () {
  // Referencia al elemento de la tarjeta de estadística
  const monthlyTicketsCard = document.getElementById('monthlyTicketsCard');

  // Referencia al elemento del modal
  const monthlyTicketsModalElement = document.getElementById('monthlyTicketsModal');

  // Asegúrate de que ambos elementos existan antes de añadir el event listener
  if (monthlyTicketsCard && monthlyTicketsModalElement) {
    monthlyTicketsCard.addEventListener('click', function (event) {
      // Evita el comportamiento predeterminado si el clic es en un enlace o botón.
      // Aunque monthlyTicketsCard es un div, es una buena práctica si en el futuro
      // se convierte en un elemento interactivo con un comportamiento por defecto.
      event.preventDefault();

      // Crea una instancia del modal de Bootstrap y muéstralo
      const monthlyTicketsModal = new bootstrap.Modal(monthlyTicketsModalElement);
      monthlyTicketsModal.show();
      loadMonthlyTicketDetails();
    });
  } else {
    console.error('No se encontraron los elementos monthlyTicketsCard o monthlyTicketsModal.');
  }

  // *** NUEVO: Event listener delegado para los botones de detalle de tickets ***
  const monthlyTicketsContent = document.getElementById('monthlyTicketsContent');
  if (monthlyTicketsContent) {
    monthlyTicketsContent.addEventListener('click', function (event) {
      // Verifica si el clic fue en un botón con la clase 'monthly-tickets-detail'
      const clickedButton = event.target.closest('.monthly-tickets-detail');
      if (clickedButton) {
        const month = clickedButton.dataset.month; // Ej: "2025-04"
        const status = clickedButton.dataset.status; // Ej: "Abierto", "En proceso", "Cerrado"
        const count = clickedButton.dataset.count; // Ej: "1"

        // Solo si hay tickets para mostrar, llamamos a la función de carga de detalles
        if (parseInt(count) > 0) {
          loadIndividualTicketDetails(month, status);
        } else {
          // Opcional: mostrar un mensaje si no hay tickets
          Swal.fire({
            icon: 'info', // Puedes usar 'success', 'error', 'warning', 'info', 'question'
            title: 'Sin Tickets',
            html: `No hay tickets ${status.toLowerCase()}s en la fecha <strong>${month}</strong>.`,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#003594' // Esto es un color HEX para rojo (como el de Bootstrap danger)
          });        
      }
      }
    });
  }
});

// *** NUEVA FUNCIÓN: Para cargar los detalles de tickets individuales ***
function loadIndividualTicketDetails(month, status) {
  const contentDiv = document.getElementById('monthlyTicketsContent');
  contentDiv.innerHTML = `<p>Cargando tickets ${status.toLowerCase()}s en la fecha ${month}...</p>`; // Mensaje de carga

  const xhr = new XMLHttpRequest();
  // Use POST as requested, so the parameters will be sent in the request body
  xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetIndividualTicketDetails`);
  // Set the Content-Type header to indicate that we're sending URL-encoded data
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success && response.details) {
          // Función para formatear los tickets individuales
          contentDiv.innerHTML = formatIndividualTickets(response.details, month, status);
        } else {
          // Check for data.message in case of API error, or provide a generic one
          contentDiv.innerHTML = `<p>Error al cargar el detalle de tickets ${status.toLowerCase()}s: ` + (response.message || 'Error desconocido') + `</p>`;
          console.error('Error en los datos de la API para tickets individuales:', response.message);
        }
      } catch (error) {
        console.error('Error parsing JSON for individual ticket details:', error);
        contentDiv.innerHTML = `<p>Error de procesamiento de datos al cargar el detalle de tickets ${status.toLowerCase()}s.</p>`;
      }
    } else {
      console.error('Error fetching individual ticket details:', xhr.status, xhr.statusText);
      contentDiv.innerHTML = `<p>Error de red al cargar el detalle de tickets ${status.toLowerCase()}s. Por favor, intente de nuevo más tarde.</p>`;
    }
  };

  // Handle network errors
  xhr.onerror = function () {
    console.error('Network error during individual ticket details fetch.');
    contentDiv.innerHTML = `<p>Error de conexión al cargar el detalle de tickets ${status.toLowerCase()}s.</p>`;
  };

  // Prepare the data to be sent in the request body
  // encodeURIComponent is crucial for sending parameters in URL-encoded format
  const dataToSend = `action=GetIndividualTicketDetails&month=${encodeURIComponent(month)}&status=${encodeURIComponent(status)}`;
  xhr.send(dataToSend);
}

// *** NUEVA FUNCIÓN: Para formatear la tabla de tickets individuales (VERTICAL) ***
function formatIndividualTickets(tickets, month, status) {
  if (tickets.length === 0) {
    return `<p>No hay tickets ${status.toLowerCase()}s para ${month}.</p>
                <button class="btn btn-primary mt-3" onclick="loadMonthlyTicketDetails()">Volver al resumen</button>`;
  }

  let html = `
        <h5>Tickets ${status}s para ${month}</h5>
        <div class="ticket-details-list mt-3">
    `;

  tickets.forEach(ticket => {
    // Formatear la fecha de creación del ticket para una mejor visualización
    const creationDate = ticket.date_create_ticket ? new Date(ticket.date_create_ticket).toLocaleString() : 'N/A';

    html += `
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    Ticket #<strong>${ticket.id_ticket || 'N/A'}</strong>
                </div>
                <div class="card-body">
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Serial POS:</dt>
                        <dd class="col-sm-8">${ticket.serial_pos_ticket || 'N/A'}</dd>

                        <dt class="col-sm-4">Razón Social Cliente:</dt>
                        <dd class="col-sm-8">${ticket.razon_social_cliente || 'N/A'}</dd>

                        <dt class="col-sm-4">Rif Cliente:</dt>
                        <dd class="col-sm-8">${ticket.rif_cliente || 'N/A'}</dd>

                        <dt class="col-sm-4">Modelo POS:</dt>
                        <dd class="col-sm-8">${ticket.name_modelopos_cliente || 'N/A'}</dd>

                        <dt class="col-sm-4">Estado Ticket:</dt>
                        <dd class="col-sm-8">${ticket.status_name_ticket || 'N/A'}</dd>
                        
                        <dt class="col-sm-4">Fecha Creación:</dt>
                        <dd class="col-sm-8">${ticket.date_create_ticket}</dd>
                    </dl>
                </div>
            </div>
        `;
  });

  html += `
        </div>
        <button class="btn btn-primary mt-3" onclick="loadMonthlyTicketDetails()">Volver al resumen</button>
    `;
  return html;
}

function loadMonthlyTicketDetails() {
  const contentDiv = document.getElementById('monthlyTicketsContent');
  contentDiv.innerHTML = '<p>Cargando información...</p>'; // Mensaje de carga

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetMonthlyTicketDetails`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        contentDiv.innerHTML = formatMonthlyDetails(data.details); // Renderizar los datos
      } else {
        contentDiv.innerHTML = '<p>Error al cargar los detalles: ' + (data.message || 'Error desconocido') + '</p>';
        console.error('Error en los datos de la API:', data.message);
      }
    })
    .catch(error => {
      contentDiv.innerHTML = '<p>Error de red al cargar los detalles. Por favor, intente de nuevo más tarde.</p>';
      console.error('Error fetching monthly details:', error);
    });
}

// *** FUNCIÓN CORREGIDA: Para formatear la tabla de tickets mensuales ***
function formatMonthlyDetails(details) {
  let html = `
        <p>Haz clic en el número de tickets para ver el detalle.</p>
        <table class="table table-striped table-bordered mt-3">
            <thead>
                <tr>
                    <th>Mes</th>
                    <th>Tickets Creados</th>
                    <th>Abiertos</th>
                    <th>En Proceso</th>
                    <th>Cerrados</th>
                </tr>
            </thead>
            <tbody>
    `;

  details.forEach(item => {
    const monthName = item.month_name.trim();
    const year = item.year_month.substring(0, 4);

    html += `
            <tr>
                <td>${monthName} ${year}</td> 
                <td>${item.total_tickets_creados_mes}</td>
                <td>
                    <button class="btn btn-link p-0 monthly-tickets-detail" 
                            data-month="${item.year_month}" 
                            data-status="Abierto" 
                            data-count="${item.tickets_abiertos}">
                        ${item.tickets_abiertos}
                    </button>
                </td>
                <td>
                    <button class="btn btn-link p-0 monthly-tickets-detail" 
                            data-month="${item.year_month}" 
                            data-status="En proceso" 
                            data-count="${item.tickets_en_proceso}">
                        ${item.tickets_en_proceso}
                    </button>
                </td>
                <td>
                    <button class="btn btn-link p-0 monthly-tickets-detail" 
                            data-month="${item.year_month}" 
                            data-status="Cerrado" 
                            data-count="${item.tickets_cerrados}">
                        ${item.tickets_cerrados}
                    </button>
                </td>
            </tr>
        `;
  });

  html += `
            </tbody>
        </table>
        <p class="text-muted mt-3">Información extra sobre tendencias y análisis.</p>
    `;
  return html;
}

let monthlyTicketsChartInstance; // Variable global para la instancia del gráfico

function loadMonthlyCreatedTicketsChart() {
  const ctx = document.getElementById('chart-line').getContext('2d');

  fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetMonthlyCreatedTicketsForChart`) // <-- Asegúrate de que tu API exponga esta función SQL
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success && data.details && data.details.length > 0) {
        const labels = data.details.map(item => `${item.month_name} ${item.year_month.substring(0, 4)}`); // "Enero 2024"
        const chartData = data.details.map(item => item.total_tickets_creados_mes);

        // Si ya existe una instancia del gráfico, la destruimos antes de crear una nueva
        if (monthlyTicketsChartInstance) {
          monthlyTicketsChartInstance.destroy();
        }

        monthlyTicketsChartInstance = new Chart(ctx, {
          type: 'bar', // Puedes probar 'line' para ver la tendencia también
          data: {
            labels: labels, // Nombres de los meses como etiquetas
            datasets: [{
              label: 'Total de Tickets Creados',
              data: chartData, // Los totales de tickets creados por mes
              backgroundColor: [
                'rgba(75, 192, 192, 0.8)',  // Turquesa (por ejemplo, para "Abiertos")
                'rgba(255, 206, 86, 0.8)',  // Amarillo (por ejemplo, para "En proceso")
                'rgba(255, 99, 132, 0.8)'   // Rojo (por ejemplo, para "Cerrados")
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1,
              categoryPercentage: 0.7,
              barPercentage: 0.8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#6c757d',
                  font: { size: 12 }
                },
                grid: {
                  color: 'rgba(0,0,0,0.05)',
                  drawBorder: false
                }
              },
              x: {
                ticks: {
                  color: '#6c757d',
                  font: { size: 12 }
                },
                grid: {
                  color: 'rgba(0,0,0,0.05)',
                  drawBorder: false
                }
              }
            },
            plugins: {
              legend: {
                display: true, // Mostrar la leyenda para el nombre del dataset
                labels: { color: '#343a40' }
              },
              tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: 'white',
                bodyColor: 'white'
              }
            }
          }
        });
        console.log('Gráfico de tickets creados por mes cargado con éxito.');

      } else {
        console.warn('No hay datos disponibles para el gráfico de tickets creados por mes o la respuesta no fue exitosa.');
        // Destruir el gráfico si no hay datos para mostrar un lienzo vacío
        if (monthlyTicketsChartInstance) {
          monthlyTicketsChartInstance.destroy();
        }
        // O mostrar un mensaje en el canvas si es posible
        ctx.fillText("No hay datos para mostrar.", ctx.canvas.width / 2, ctx.canvas.height / 2);
      }
    })
    .catch(error => {
      console.error('Error al cargar los datos del gráfico de tickets creados por mes:', error);
      if (monthlyTicketsChartInstance) {
        monthlyTicketsChartInstance.destroy();
      }
      ctx.fillText("Error al cargar el gráfico.", ctx.canvas.width / 2, ctx.canvas.height / 2);
    });
}

// Asegúrate de que ENDPOINT_BASE y APP_PATH estén definidos
// const ENDPOINT_BASE = 'http://localhost:8080/';
// const APP_PATH = 'your-app-path/';

async function updateTicketMonthlyPercentageChange() {
    const porcentElement = document.getElementById('porcent'); 
    
    if (porcentElement) porcentElement.textContent = 'Cargando...'; 

    try {
        const response = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/reportes/GetMonthlyTicketPercentageChange`); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Respuesta completa de la API:", data); // Esto te mostrará la estructura real: { success: true, porcent: -50.0... }

        // ** CAMBIO CRÍTICO AQUÍ: Accede directamente a data.porcent **
            let percentage = data.porcent; // Toma el número directamente

            let textContent = '';
            let color = 'gray'; 

            if (percentage === null || isNaN(percentage)) { // Aunque ya verificamos que es número, mantenemos isNaN por si acaso
                textContent = `N/A`; 
            } else {
                const roundedPercentage = Math.round(percentage); // Redondea al entero más cercano
                
                if (roundedPercentage >= 0) {
                    textContent = `+${roundedPercentage}% más`;
                    color = 'green';
                } else {
                    textContent = `${roundedPercentage}% menos`;
                    color = 'red';
                }
            }
            
            if (porcentElement) {
                porcentElement.textContent = textContent;
                porcentElement.style.color = color;
            }
    } catch (error) {
        if (porcentElement) {
            porcentElement.textContent = '0%'; // Valor por defecto en caso de error
            porcentElement.style.color = 'grey';
        }
    }
}


// Llama a esta función para cargar el gráfico cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  loadMonthlyCreatedTicketsChart();
  updateTicketMonthlyPercentageChange();
  // ... (resto de tu código DOMContentLoaded para modals, estadísticas de cards, etc.)
});