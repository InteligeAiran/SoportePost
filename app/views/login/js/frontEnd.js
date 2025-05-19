document.addEventListener('DOMContentLoaded', (event) => {
    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;
    console.log(`Ancho de la pantalla: ${anchoPantalla}px`);
    console.log(`Alto de la pantalla: ${altoPantalla}px`);
});

// Get the input field
var input1 = document.getElementById("username");
var input2 = document.getElementById("password");
var input3 = document.getElementById("email");

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
                    //userId = response.id_user; // Almacena el ID del usuario
                    //localStorage.setItem('userId', userId); // Guarda el userId en localStorage
                    //alert('userId: ' + userId); // Muestra el ID del usuario en una alerta
                    window.location.href = response.redirect;
                    if (response.message === 'ya existe una sesión activa.') {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sesión activa detectada',
                            text: response.message,
                            color: 'black'
                        });
                    }
                    // No necesitas otra alerta de "éxito" aquí si solo rediriges
                } else {
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
            //console.log(xhr.responseText);
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión activa detectada',
                    text: response.message,
                    color: 'black'
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
        } else if (xhr.status === 400) { // Manejar el código de estado 400 (Solicitud incorrecta - Datos faltantes o inválidos)
            //console.log(xhr.responseText);
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: response.message,
                    color: 'black'
                });
            } catch (error) {
                //console.error('Error parsing JSON (400):', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar respuesta (Solicitud incorrecta)',
                    text: 'Ocurrió un error al procesar la respuesta de la solicitud.',
                    color: 'black'
                });
            }
        } else if (xhr.status === 401) { // Manejar el código de estado 401 (No autorizado - Credenciales inválidas)
            //console.log(xhr.responseText);
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: response.message,
                    color: 'black'
                });
            } catch (error) {
                //console.error('Error parsing JSON (401):', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar respuesta (Credenciales inválidas)',
                    text: 'Ocurrió un error al procesar la respuesta de credenciales inválidas.',
                    color: 'black'
                });
            }
        } else if (xhr.status === 403) { // Manejar el código de estado 403 (Prohibido - Usuario bloqueado)
            //console.log(xhr.responseText);
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Cuenta bloqueada',
                    text: response.message,
                    color: 'black'
                });
            } catch (error) {
                //console.error('Error parsing JSON (403):', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar respuesta (Cuenta bloqueada)',
                    text: 'Ocurrió un error al procesar la respuesta de cuenta bloqueada.',
                    color: 'black'
                });
            }
        } else { // Manejar otros errores de conexión
            //console.error('Error:', xhr.status, xhr.statusText);
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

function checkEmail() {
    const input = document.getElementById('email');
    const mensajeDiv = document.getElementById('emailError');
    const mensajeDivt = document.getElementById('emailVerification');

    mensajeDiv.innerHTML = '';

    if (input.value === '') {
        mensajeDivt.innerHTML = 'Campo vacío'; // Muestra el mensaje en rojo directamente
        mensajeDivt.style.color = 'red';
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
                    timer: 3500, // Cierra el modal después de 2.5 segundos (2500 ms)
                    timerProgressBar: true, // Opcional: muestra una barra de progreso del tiempo
                    didOpen: () => {
                     Swal.showLoading();
                    },
                    willClose: () => {
                        setTimeout(() => {
                            location.reload(); // Recarga la página después del temporizador
                        }, 2500); // Espera 2.5 segundos (igual que el temporizador)
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
