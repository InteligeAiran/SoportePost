document.addEventListener('DOMContentLoaded', (event) => {
    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;
    console.log(`Ancho de la pantalla: ${anchoPantalla}px`);
    console.log(`Alto de la pantalla: ${altoPantalla}px`);
});

function SendForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'app/views/login/backEnd.php'); // Asegúrate que esta ruta sea correcta
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        // Aquí puedes manejar la respuesta del servidor
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
              Swal.fire({
                  icon: 'success',
                  title: 'Inicio de sesión exitoso',
                  text: response.message,
                  color: 'black'
              });
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
          console.log(xhr.responseText) //para ver el error del backend.
          Swal.fire({
              icon: 'error',
              title: 'Error en el servidor',
              text: 'Ocurrió un error al procesar la respuesta del servidor.',
              color: 'black'
          });
        }

      } else {
        console.error('Error:', xhr.status, xhr.statusText);
        Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: 'No se pudo conectar con el servidor.',
              color: 'black'
          });
      }
    };

    const datos = `action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
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
        xhr.open('POST', 'app/views/login/backEnd.php');
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

// filepath: /c:/xampp/htdocs/SoportePost/app/views/login/js/frontEnd.js
function checkPass() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const mensajeDiv = document.getElementById('passwordError');
    const mensajeDivt = document.getElementById('passwordVerification');

    mensajeDiv.innerHTML = '';

    if (password === '') {
        mensajeDivt.innerHTML = 'Campo vacío'; // Muestra el mensaje en rojo directamente
        mensajeDivt.style.color = 'red';
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'app/views/login/backEnd.php');
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

        const datos = `action=checkPass&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
        xhr.send(datos);
    }
}