/*document.addEventListener('DOMContentLoaded', (event) => {
    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;
    console.log(`Ancho de la pantalla: ${anchoPantalla}px`);
    console.log(`Alto de la pantalla: ${altoPantalla}px`);
});*/

let emailQueue = []; // Cola para almacenar las solicitudes de correo
let isProcessing = false; // Indicador de si se está procesando una solicitud

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
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
       clearTimeout(timeoutId);
       timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Función principal para verificar usuario con Promise
async function checkUser() {
    const input = document.getElementById('username');
    const mensajeDiv = document.getElementById('usernameError');
    const mensajeDivt = document.getElementById('usernameVerification');

    // Limpiar mensajes y clases previas
    mensajeDiv.innerHTML = '';
    mensajeDivt.innerHTML = '';
    mensajeDivt.classList.remove('loading', 'error', 'success');
      
    if (input.value === '') {
        mensajeDivt.innerHTML = 'Campo vacío';
        mensajeDivt.classList.add('error');

        return;
    }

    // Mostrar spinner y texto de carga
    mensajeDivt.innerHTML = `
    <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Cargando, por favor espere...</span>
    </div> 
    `;
    mensajeDivt.classList.add('loading');

    try {
        const response = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/users/checkUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `action=checkUsername&username=${encodeURIComponent(input.value)}`
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // --- LIMPIEZA CLAVE ---
            mensajeDivt.classList.remove('loading'); 
        // ---------------------

        const data = await response.json();
        mensajeDivt.innerHTML = data.message;
       // Aplicar clase basada en el color (asumiendo que data.color es 'green' para success, 'red' para error)
       console.log(data.color);
        if (data.color === "green") {
          mensajeDivt.classList.add('success');
        } else if (data.color === 'red') {
          mensajeDivt.classList.add('error');
        } else {
          // Fallback por si hay otros colores
          mensajeDivt.style.color = data.color;
        }

    } catch (error) {
        console.error('Error en la petición:', error);
        mensajeDiv.innerHTML = 'Error de conexión con el servidor.';
        mensajeDivt.classList.add('error');
    }
}

// Versión con debounce (500ms de espera después de tipear)
const debouncedCheckUser = debounce(checkUser, 500);

async function GetEmailByUsername() {
    const usernameInput = document.getElementById('restoreUsername');
    const emailInput = document.getElementById('email');
    const usernameErrorDiv = document.getElementById('restoreUsernameError');
    const usernameVerificationDiv = document.getElementById('restoreUsernameVerification'); 

    // 1. Limpieza inicial
    usernameErrorDiv.innerHTML = '';
    usernameVerificationDiv.innerHTML = '';
    usernameVerificationDiv.classList.remove('loading', 'error', 'success');
    
    emailInput.value = '';
    emailInput.style.borderColor = '';
    document.getElementById('emailError').innerHTML = '';
    document.getElementById('emailVerification').innerHTML = '';
    
    const username = usernameInput.value.trim();

    if (username === '') {
        usernameVerificationDiv.innerHTML = 'Campo de usuario vacío';
        usernameVerificationDiv.classList.add('error');
        usernameInput.style.borderColor = 'red';
        return;
    }

    // 2. Mostrar Spinner y 'loading'
    usernameVerificationDiv.innerHTML = `
        <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Cargando, por favor espere...</span>
        </div> 
    `;
    usernameVerificationDiv.classList.add('loading');

    try {
        const bodyData = `action=getEmailByUsername&username=${encodeURIComponent(username)}`;
        
        const response = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/users/getEmailByUsername`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyData
        });
        
        // --- SECCIÓN CLAVE ---
        
        // 3. Manejo de error de servidor (ej. 500, o si la ruta del API falla y devuelve un 404 real)
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}. Hubo un problema de conexión con la API.`);
        }

        const data = await response.json();

        // 4. Limpieza de 'loading' y procesamiento de respuesta JSON
        usernameVerificationDiv.classList.remove('loading'); 

        // Aplicar mensaje y estilos basados en data.success
        usernameVerificationDiv.innerHTML = data.message || (data.success ? 'Usuario encontrado.' : 'Usuario no encontrado.');

        if (data.success && data.email) {
            // ÉXITO: Usuario encontrado (success: true)
            usernameVerificationDiv.classList.add('success');
            usernameInput.style.borderColor = 'green';
            emailInput.value = data.email;
            emailInput.style.borderColor = 'green';
        } else {
            // FALLO DE DATOS: Usuario no encontrado (success: false)
            usernameVerificationDiv.classList.add('error');
            usernameInput.style.borderColor = 'red';
            emailInput.value = '';
            emailInput.style.borderColor = 'red';
        }

    } catch (error) {
        // 5. Manejo de errores de red, parseo, o error fatal (500)
        usernameVerificationDiv.classList.remove('loading');
        console.error('Error en la petición GetEmailByUsername:', error);
        
        usernameErrorDiv.innerHTML = 'Error de conexión con el servidor.';
        usernameVerificationDiv.classList.add('error');
        usernameInput.style.borderColor = 'red';
        emailInput.value = '';
        emailInput.style.borderColor = 'red';
    }
}

// Versión con debounce (500ms de espera después de tipear)
const debouncedCheckEmail = debounce(GetEmailByUsername, 500);

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
    const usernameInput = document.getElementById("restoreUsername");
    const emailInput = document.getElementById("email");

    const usernameErrorDiv = document.getElementById("restoreUsernameError");
    const usernameVerificationDiv = document.getElementById("restoreUsernameVerification");
    
    // 1. Limpiar el valor de los campos de entrada (IMPORTANTE: usar .value)
    usernameInput.value = ""; 
    emailInput.value = "";
    
    // 2. Limpiar los mensajes de error/verificación
    usernameErrorDiv.innerHTML = "";
    usernameVerificationDiv.innerHTML = "";
    
    // 3. Limpiar las clases de estado (loading, error, success) y bordes
    usernameVerificationDiv.classList.remove('loading', 'error', 'success');
    usernameInput.style.borderColor = ""; // Opcional: para quitar bordes de color
    emailInput.style.borderColor = "";   // Opcional: para quitar bordes de color

    // 4. Ocultar el modal
    modal.style.display = "none";
}

// Cuando el usuario hace clic en cualquier lugar fuera del modal, cerrarlo
window.onclick = function(event) {
    if (event.target == modal) {
        username.innerHTML = "";
        correo.innerHTML = "";
        modal.style.display = "none";
    }
}

// Manejar el envío del formulario (aquí iría la lógica para enviar el correo)
document.getElementById('restore_passForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    const correo = document.getElementById('correo').value;
    // Aquí puedes agregar tu lógica para enviar el correo con el enlace de restablecimiento
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
    
    // Agregar el correo a la cola
    emailQueue.push(email);
    
    // Procesar la cola si no hay una solicitud en curso
    if (!isProcessing) {
        processQueue();
    }
}

function processQueue() {
    if (emailQueue.length === 0) {
        isProcessing = false;
        return;
    }

    isProcessing = true;
    const email = emailQueue[0]; // Tomar el primer correo de la cola

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/resetPassword`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    mostrarCargando(); // Muestra el "cargando"
    xhr.timeout = 5000; // Timeout de 5 segundos

    xhr.onload = function() {
        ocultarCargando(); // Oculta el "cargando"
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Se ha enviado la nueva contraseña con éxito. Verifique su bandeja de entrada.',
                    text: response.message,
                    color: 'black',
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        setTimeout(() => {
                            location.reload();
                        }, 5000);
                    }
                });
                document.getElementById('modal').style.display = 'none';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar el correo',
                    text: response.message,
                    color: 'black'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al enviar el correo',
                text: 'Error en la solicitud. Por favor, inténtalo de nuevo.',
                color: 'black'
            });
        }

        // Remover el correo procesado de la cola
        emailQueue.shift();
        // Procesar la siguiente solicitud en la cola
        processQueue();
    };

    xhr.onerror = function() {
        ocultarCargando();
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor. Por favor, inténtalo de nuevo.',
            color: 'black'
        });
        // Remover el correo fallido de la cola
        emailQueue.shift();
        // Procesar la siguiente solicitud en la cola
        processQueue();
    };

    xhr.ontimeout = function() {
        ocultarCargando();
        Swal.fire({
            icon: 'error',
            title: 'Tiempo de espera agotado',
            text: 'La solicitud tomó demasiado tiempo. Por favor, inténtalo de nuevo.',
            color: 'black'
        });
        // Remover el correo fallido de la cola
        emailQueue.shift();
        // Procesar la siguiente solicitud en la cola
        processQueue();
    };
    const datos = `action=resetPassword&email=${encodeURIComponent(email)}`;
    xhr.send(datos);
}
