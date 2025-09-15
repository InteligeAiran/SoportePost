/*document.addEventListener('DOMContentLoaded', (event) => {
    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;
    console.log(`Ancho de la pantalla: ${anchoPantalla}px`);
    console.log(`Alto de la pantalla: ${altoPantalla}px`);
});*/

// Get the input field
var input1 = document.getElementById("username");
var input2 = document.getElementById("password");
var input3 = document.getElementById("restoreUsername");

// Execute a function when the user presses a key on the keyboard
input1.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("BtnLogin").click();
  }
}); 

jQuery('#clickme').on('click', function() {
    jQuery('#password').attr('type', function(index, attr) {
      return attr == 'text' ? 'password' : 'text';
    })
})

input2.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("BtnLogin").click();
    }
});

input3.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("Sendmail").click();
    }
  });
  

$("#username").keyup(function(){
    let string = $("#username").val();
    $("#username").val(string.replace(/ /g, ""))
});

$("#password").keyup(function(){
    let string = $("#password").val();
    $("#password").val(string.replace(/ /g, ""))
});

$("#email").keyup(function(){
    let string = $("#email").val();
    $("#email").val(string.replace(/ /g, ""))
});

function SendForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/access`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) { // Manejar códigos de éxito (2xx)
            console.log(xhr.responseText);
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Si response.success es true y no es un 409, siempre redirige
                    // El mensaje de 'ya existe una sesión activa.' debe ser manejado por el 409
                    window.location.href = response.redirect;
                } else {
                    // Manejar otros casos donde success es false (ej. credenciales incorrectas, etc.)
                    Swal.fire({
                        icon: 'error',
                        title: 'No se puede iniciar sesión',
                        text: response.message,
                        color: 'black'
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                console.log(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el servidor',
                    text: 'Ocurrió un error al procesar la respuesta del servidor.',
                    color: 'black'
                });
            }
        } else if (xhr.status === 409) { // Manejar el código de estado 409 (Conflicto - Sesión activa)
            try {
                const response = JSON.parse(xhr.responseText);
                // Aquí, y solo aquí, se muestra la alerta con la opción de forzar sesión
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión activa detectada',
                    text: response.message + ' ¿Deseas cerrar la sesión anterior y abrir una nueva?',
                    color: 'black',
                    showCancelButton: true,
                    confirmButtonColor: '#003594',
                    cancelButtonColor: 'rgba(195, 43, 43, 1)',
                    confirmButtonText: 'Sí, Abrir Nueva Sesión',
                    cancelButtonText: 'No, Mantener Anterior'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const forceLoginXHR = new XMLHttpRequest();
                        forceLoginXHR.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/access`);
                        forceLoginXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        
                        forceLoginXHR.onload = function() {
                            if (forceLoginXHR.status >= 200 && forceLoginXHR.status < 300) {
                                try {
                                    const forceResponse = JSON.parse(forceLoginXHR.responseText);
                                  if (forceResponse.success) {
                                        Swal.fire({
                                            title: '¡Sesión Cerrada!', // Título
                                            text: 'La sesión anterior ha sido cerrada y se ha iniciado una nueva.', // Mensaje
                                            icon: 'success', // Icono
                                            // Para el color del texto, se recomienda usar customClass y CSS:
                                            // customClass: {
                                            //     popup: 'my-swal-popup-black-text' // Define esta clase en tu CSS
                                            // },
                                            // En tu CSS: .my-swal-popup-black-text { color: black; }

                                            // Si el color 'black' era para el título, puedes usar:
                                            color: 'black', // Esto cambia el color del texto del título.

                                            confirmButtonText: 'Ok', // Texto del botón de confirmación
                                            confirmButtonColor: '#003594 ' // Color del botón de confirmación
                                        }).then(() => {
                                            // Esta función se ejecuta después de que el usuario hace clic en "Ok"
                                            window.location.href = forceResponse.redirect;
                                        });
                                    } else {
                                        Swal.fire(
                                            'Error al Forzar Sesión',
                                            forceResponse.message || 'No se pudo iniciar una nueva sesión.',
                                            'error'
                                        );
                                    }
                                } catch (e) {
                                    console.error('Error parsing JSON for force login (409):', e);
                                    Swal.fire(
                                        'Error',
                                        'Problema al procesar la respuesta de forzar inicio de sesión (409).',
                                        'error'
                                    );
                                }
                            } else {
                                Swal.fire(
                                    'Error',
                                    'No se pudo conectar con el servidor para forzar el inicio de sesión (409).',
                                    'error'
                                );
                            }
                        };

                        forceLoginXHR.onerror = function() {
                            Swal.fire(
                                'Error de Red',
                                'No se pudo completar la solicitud para forzar el inicio de sesión (409).',
                                'error'
                            );
                        };

                        const forceDatos = `action=access&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&force_new_session=true`;
                        forceLoginXHR.send(forceDatos);

                    } else {
                         Swal.fire({ // <-- Inicia un objeto para las opciones
                            icon: 'info', // El icono ya está bien
                            title: 'Operación Cancelada', // El título ya está bien
                            text: 'Se mantendrá la sesión anterior activa.', // El texto ya está bien
                            color: 'black', // <-- Esto es una propiedad del objeto de configuración
                            confirmButtonText: 'Ok', // <-- Esto es una propiedad del objeto de configuración
                            confirmButtonColor: '#003594' // <-- Esto es una propiedad del objeto de configuración
                        }); // <-- Cierra el objeto de configuración
                    }
                });
            } catch (error) {
                console.error('Error parsing JSON (409):', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar respuesta (Sesión activa)',
                    text: 'Ocurrió un error al procesar la respuesta de sesión activa.',
                    color: 'black'
                });
            }
        } else if (xhr.status === 400) {
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: response.message,
                    color: 'black'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar respuesta (Solicitud incorrecta)',
                    text: 'Ocurrió un error al procesar la respuesta de la solicitud.',
                    color: 'black'
                });
            }
        } else if (xhr.status === 401) {
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: response.message,
                    color: 'black'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar respuesta (Credenciales inválidas)',
                    text: 'Ocurrió un error al procesar la respuesta de credenciales inválidas.',
                    color: 'black'
                });
            }
        } else if (xhr.status === 403) {
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Cuenta bloqueada',
                    text: response.message,
                    color: 'black'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar respuesta (Cuenta bloqueada)',
                    text: 'Ocurrió un error al procesar la respuesta de cuenta bloqueada.',
                    color: 'black'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor.',
                color: 'black'
            });
        }
    };
    const datos = `action=access&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    xhr.send(datos);
}

function checkUser() {
    const input = document.getElementById('username');
    const mensajeDiv = document.getElementById('usernameError');
    const mensajeDivt = document.getElementById('usernameVerification');

    mensajeDiv.innerHTML = '';

    if (input.value === '') {
        mensajeDivt.innerHTML = 'Campo vacío'; // Muestra el mensaje en rojo directamente
        mensajeDivt.style.color = 'red';
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/checkUser`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    mensajeDivt.innerHTML = response.message;
                    mensajeDivt.style.color = response.color; // Aplica el color del mensaje
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    mensajeDiv.innerHTML = 'Error al procesar la respuesta del servidor.';
                }
            } else {
                console.error('Error:', xhr.status, xhr.statusText);
                mensajeDiv.innerHTML = 'Error de conexión con el servidor.';
            }
        };

        const datos = `action=checkUsername&username=${encodeURIComponent(input.value)}`;
        xhr.send(datos);
    }
}

function GetEmailByUsername() {
    const usernameInput = document.getElementById('restoreUsername');
    const emailInput = document.getElementById('email');
    const usernameErrorDiv = document.getElementById('restoreUsernameError');
    const usernameVerificationDiv = document.getElementById('restoreUsernameVerification'); // Este div mostrará el mensaje

    // Clear previous messages and styles for username input
    usernameErrorDiv.innerHTML = '';
    usernameVerificationDiv.innerHTML = '';
    usernameVerificationDiv.style.color = '';
    usernameInput.style.borderColor = '';

    // Always clear the email input when a new username check starts
    emailInput.value = '';
    emailInput.style.borderColor = '';
    document.getElementById('emailError').innerHTML = '';
    document.getElementById('emailVerification').innerHTML = '';

    if (usernameInput.value.trim() === '') {
        usernameVerificationDiv.innerHTML = 'Campo de usuario vacío';
        usernameVerificationDiv.style.color = 'red';
        usernameInput.style.borderColor = 'red';
        return;
    }

    const xhr = new XMLHttpRequest();
    // La URL de tu API
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/getEmailByUsername`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) { // Éxito (HTTP 200)
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success && response.email) {
                    usernameVerificationDiv.innerHTML = 'Usuario encontrado. Email asociado cargado.';
                    usernameVerificationDiv.style.color = 'green';
                    usernameInput.style.borderColor = 'green';
                    emailInput.value = response.email;
                    emailInput.style.borderColor = 'green';
                } else {
                    // Si success es false (lo que pasa con status 404 en tu PHP),
                    // o email no es proporcionado (aunque el status sea 200, por si acaso)
                    usernameVerificationDiv.innerHTML = response.message || 'Usuario no encontrado o sin email asociado.';
                    usernameVerificationDiv.style.color = 'red';
                    usernameInput.style.borderColor = 'red';
                    emailInput.value = '';
                    emailInput.style.borderColor = 'red';
                }
            } catch (error) {
                console.error('Error parsing JSON for GetEmailByUsername:', error);
                usernameErrorDiv.innerHTML = 'Error al procesar la respuesta del servidor.';
                usernameInput.style.borderColor = 'red';
                emailInput.value = '';
                emailInput.style.borderColor = 'red';
            }
        } else if (xhr.status === 404) { // Manejo específico para "No encontrado"
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                usernameVerificationDiv.innerHTML = errorResponse.message || 'El usuario no existe.'; // Muestra el mensaje del servidor
                usernameVerificationDiv.style.color = 'red';
                usernameInput.style.borderColor = 'red';
                emailInput.value = '';
                emailInput.style.borderColor = 'red';
            } catch (error) {
                console.error('Error parsing JSON for 404 response:', error);
                usernameErrorDiv.innerHTML = 'Usuario no encontrado';
                usernameInput.style.borderColor = 'red';
                emailInput.value = '';
                emailInput.style.borderColor = 'red';
            }
        } else { // Otros errores HTTP (ej. 500 Internal Server Error, 400 Bad Request, etc.)
            console.error('Error en GetEmailByUsername:', xhr.status, xhr.statusText);
            usernameErrorDiv.innerHTML = 'Error de conexión con el servidor. Código: ' + xhr.status; // Más descriptivo
            usernameInput.style.borderColor = 'red';
            emailInput.value = '';
            emailInput.style.borderColor = 'red';
        }
    };
    xhr.onerror = function() { // Maneja errores de red puros (sin respuesta del servidor)
        console.error('Network Error for GetEmailByUsername');
        usernameErrorDiv.innerHTML = 'Error de red. No se pudo conectar con el servidor.';
        usernameInput.style.borderColor = 'red';
        emailInput.value = '';
        emailInput.style.borderColor = 'red';
    };

    const datos = `action=getEmailByUsername&username=${encodeURIComponent(usernameInput.value)}`;
    xhr.send(datos);
}

function checkEmail() {
    const input = document.getElementById('email');
    const mensajeDiv = document.getElementById('emailError');
    const mensajeDivt = document.getElementById('emailVerification');

    mensajeDiv.innerHTML = '';
    mensajeDivt.innerHTML = '';
    mensajeDivt.style.color = ''; // Resetear el color del mensaje
    input.style.borderColor = ''; // Resetear el borde a su estado original

    if (input.value.trim() === '') { // Usar .trim() para quitar espacios en blanco
        mensajeDivt.innerHTML = 'Campo vacío';
        mensajeDivt.style.color = 'red';
        input.style.borderColor = 'red'; // Pone el borde rojo
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/checkEmail`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    mensajeDivt.innerHTML = response.message;
                    mensajeDivt.style.color = response.color; // Aplica el color del mensaje
                     input.style.borderColor = response.color; // Pone el borde rojo
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    mensajeDiv.innerHTML = 'Error al procesar la respuesta del servidor.';
                }
            } else {
                console.error('Error:', xhr.status, xhr.statusText);
                mensajeDiv.innerHTML = 'Error de conexión con el servidor.';
            }
        };
        const datos = `action=checkEmail&email=${encodeURIComponent(input.value)}`;
        xhr.send(datos);
    }
}

// Obtener el modal
var modal = document.getElementById("modal");

// Obtener el enlace que abre el modal
var link = document.getElementById("link");

// Obtener el elemento <span> que cierra el modal
var span = document.getElementsByClassName("cerrar")[0];

// Función para abrir el modal
function ModalPass(event) {
    event.preventDefault(); // Evita que el enlace redirija
    modal.style.display = "flex";
}

// Cuando el usuario hace clic en <span> (x), cerrar el modal
span.onclick = function() {
    modal.style.display = "none";
}

// Cuando el usuario hace clic en cualquier lugar fuera del modal, cerrarlo
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Manejar el envío del formulario (aquí iría la lógica para enviar el correo)
document.getElementById('restore_passForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    const correo = document.getElementById('correo').value;
    // Aquí puedes agregar tu lógica para enviar el correo con el enlace de restablecimiento
    console.log('Correo para restablecer contraseña:', correo);
    modal.style.display = "none"; // Cerrar el modal después de enviar el correo
});

function mostrarCargando() {
    // Muestra el indicador de carga
    document.getElementById("loading-overlay").style.display = "flex";
}

function ocultarCargando() {
    document.getElementById('loading-overlay').style.display = 'none';
}

setTimeout(function() {
    ocultarCargando(); // Oculta el "cargando" después de 6 segundos
}, 6000);

function SendEmail() {
    const email = document.getElementById('email').value;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/resetPassword`);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    mostrarCargando(); // Muestra el "cargando"

    xhr.onload = function() {
        ocultarCargando(); // Oculta el "cargando"
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Se ha enviado la nueva contraseña con éxito. Verifique su bandeja de entrada.',
                    text: response.message, // Muestra el mensaje específico del backend
                    color: 'black',
                    timer: 5000, // Cierra el modal después de 2.5 segundos (2500 ms)
                    timerProgressBar: true, // Opcional: muestra una barra de progreso del tiempo
                    didOpen: () => {
                     Swal.showLoading();
                    },
                    willClose: () => {
                        setTimeout(() => {
                            location.reload(); // Recarga la página después del temporizador
                        }, 5000); // Espera 2.5 segundos (igual que el temporizador)
                    }
                });
                document.getElementById('modal').style.display = 'none'; // Cierra el modal
                //mostrarModalCodigo(email); // Mostrar el modal para ingresar el código
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar el correo',
                    text: response.message, // Muestra el mensaje específico del backend
                    color: 'black'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al enviar el correo',
                text: 'Error en la solicitud. Por favor, inténtalo de nuevo.', // Mensaje genérico para errores de solicitud
                color: 'black'
            });
        }
    };
    const datos = `action=resetPassword&email=${encodeURIComponent(email)}`;
    xhr.send(datos);
}
