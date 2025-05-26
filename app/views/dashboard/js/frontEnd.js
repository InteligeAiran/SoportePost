/*document.addEventListener("DOMContentLoaded", (event) => {
  const anchoPantalla = window.innerWidth;
  const altoPantalla = window.innerHeight;
  console.log(`Ancho de la pantalla: ${anchoPantalla}px`);
  console.log(`Alto de la pantalla: ${altoPantalla}px`);
});*/

// Para el campo "Nueva Contraseña"
jQuery('#clickme1').on('click', function() {
    jQuery('#newPassword').attr('type', function(index, currentAttr) {
        // Si el tipo actual es 'password', cámbialo a 'text' (mostrar).
        // Si no (es decir, es 'text'), cámbialo a 'password' (ocultar).
        return currentAttr === 'password' ? 'text' : 'password';
    });
});

// Para el campo "Confirmar Contraseña"
jQuery('#clickme').on('click', function() {
    jQuery('#confirmNewPassword').attr('type', function(index, currentAttr) {
        // Misma lógica para el campo de confirmación.
        return currentAttr === 'password' ? 'text' : 'password';
    });
});

$("#newPassword").keyup(function(){
    let string = $("#newPassword").val();
    $("#newPassword").val(string.replace(/ /g, ""))
});
$("#confirmNewPassword").keyup(function(){
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
          // Swal.fire({
          //     icon: 'error',
          //     title: 'Error de Verificación',
          //     text: response.message || 'No se pudo verificar el estatus del usuario.',
          // });
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
            text: `Error ${xhrUpdate.status}: ${
              xhrUpdate.statusText ||
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
