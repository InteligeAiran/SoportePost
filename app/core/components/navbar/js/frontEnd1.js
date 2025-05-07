`document.addEventListener('DOMContentLoaded', function() {
    const sidenav = document.getElementById('sidenav-main');
    const body = document.querySelector('body');
    const filterToggle = document.getElementById('filter-toggle');
    const soportePosLink = document.querySelector('#crearTicketDropdown + .dropdown-menu a[data-value="Soporte POS"]');


    // Función para mostrar/ocultar el sidebar
    function toggleSidenav() {
        sidenav.classList.toggle('active');
        body.classList.toggle('sidenav-open');
    }

    // **NUEVO EVENTO CONDICIONAL PARA OCULTAR EL SIDEBAR AL CLICAR EN "Soporte POS"**
    if (soportePosLink && filterToggle && window.innerWidth <= 1199) {
        soportePosLink.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleSidenav();
        });
    }

    // Evento para el botón de filtro
    if (filterToggle) {
        filterToggle.addEventListener('click', toggleSidenav);
    }

    // Cerrar el sidebar si se hace clic fuera de él en pantallas pequeñas (opcional)
    body.addEventListener('click', function(event) {
        if (window.innerWidth <= 1199 && sidenav.classList.contains('active') && !sidenav.contains(event.target) && event.target !== filterToggle) {
            toggleSidenav();
        }
    });



    // **NUEVO CÓDIGO PARA CERRAR EL SIDEBAR AL CARGAR LA PÁGINA EN PANTALLAS PEQUEÑAS**
    if (window.innerWidth <= 1199) {
        sidenav.classList.remove('active');
        body.classList.remove('sidenav-open');
    }

    // Función para marcar el enlace activo (tu código existente)
    const currentPath = window.location.pathname;
    const base_path = '/SoportePost/';

    function setActiveLink(linkId, href) {
        const link = document.getElementById(linkId);
        if (link && currentPath === base_path + href) {
            link.classList.add('active');
        }
    }

    setActiveLink('inicio-link', 'dashboard2');
    setActiveLink('tickets-link', 'pages/tables.html');
    setActiveLink('rif-link', 'consulta_rif');
    setActiveLink('estadisticas-link', 'pages/profile.html');

})`

document.addEventListener('DOMContentLoaded', function() {
    // Estilo para el span "No file chosen"
    const noFileChosenStyle = 'color: gray; font-style: italic; margin-left: 5px;';

    // Para el botón de Envío
    const cargarBtnEnvio = document.getElementById('DownloadEnvi');
    const envioInputFile = document.getElementById('EnvioInput');
    const fileChosenSpanEnvio = document.createElement('span');
    fileChosenSpanEnvio.style.cssText = noFileChosenStyle;

    const envioButtonContainer = cargarBtnEnvio.parentNode;
    if (envioButtonContainer) {
        envioButtonContainer.appendChild(fileChosenSpanEnvio);
    }

    // MODIFICACIÓN IMPORTANTE:
    if (cargarBtnEnvio && envioInputFile) {
        cargarBtnEnvio.addEventListener('click', function(event) {
            event.preventDefault(); // Evita la recarga si el botón es de tipo submit (aunque no lo parece)
            envioInputFile.click(); // Simula el clic en el input file
        });
    }

    if (envioInputFile) {
        envioInputFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileChosenSpanEnvio.textContent = this.files[0].name;
                fileChosenSpanEnvio.style.cssText = 'margin-left: 5px; font-size: 9px; display: block;'; // Remover estilo de "no file"
            } else {
                fileChosenSpanEnvio.style.cssText = noFileChosenStyle;
            }
        });
    }

    // Para el botón de Exoneración
    const cargarBtnExo = document.getElementById('DownloadExo');
    const exoInputFile = document.getElementById('ExoneracionInput');
    const fileChosenSpanExo = document.createElement('span');
    fileChosenSpanExo.style.cssText = noFileChosenStyle;

    const exoButtonContainer = cargarBtnExo.parentNode;
    if (exoButtonContainer) {
        exoButtonContainer.appendChild(fileChosenSpanExo);
    }

    if (cargarBtnExo && exoInputFile) {
        cargarBtnExo.addEventListener('click', function() {
            event.preventDefault(); // Evita la recarga si el botón es de tipo submit (aunque no lo parece)
            exoInputFile.click(); // Simula el clic en el input file
        });
    }

    if (exoInputFile) {
        exoInputFile.addEventListener('change', function() {
            var file = this.files[0];
            if (file && !(['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type))) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Alerta!',
                    text: 'Por favor, selecciona un archivo PDF, JPG o JPEG.',
                    color: 'black'
                });
                this.value = ''; // Limpiar el valor del input
                fileChosenSpanExo.style.cssText = noFileChosenStyle;
            } else if (file) {
                fileChosenSpanExo.textContent = file.name;
                fileChosenSpanExo.style.cssText = 'margin-left: 5px; font-size: 9px; display: block;'; // Remover estilo de "no file"
            } else {
                fileChosenSpanExo.style.cssText = noFileChosenStyle;
            }
        });
    }

    // Para el botón de Anticipo
    const cargarBtnAntici = document.getElementById('DownloadAntici');
    const anticiInputFile = document.getElementById('AnticipoInput');
    const fileChosenSpanAntici = document.createElement('span');
    fileChosenSpanAntici.style.cssText = noFileChosenStyle;

    const anticiButtonContainer = cargarBtnAntici.parentNode;
    if (anticiButtonContainer) {
        anticiButtonContainer.appendChild(fileChosenSpanAntici);
    }

    if (cargarBtnAntici && anticiInputFile) {
        cargarBtnAntici.addEventListener('click', function() {
            event.preventDefault(); // Evita la recarga si el botón es de tipo submit (aunque no lo parece)
            anticiInputFile.click(); // Simula el clic en el input file
        });
    }

    if (anticiInputFile) {
        anticiInputFile.addEventListener('change', function() {
            var file = this.files[0];
            if (file && !(['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type))) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Alerta!',
                    text: 'Por favor, selecciona un archivo PDF, JPG o JPEG.',
                    color: 'black'
                });
                this.value = ''; // Limpiar el valor del input
                fileChosenSpanAntici.style.cssText = noFileChosenStyle;
            } else if (file) {
                fileChosenSpanAntici.textContent = file.name;
                fileChosenSpanAntici.style.cssText = 'margin-left: 5px; font-size: 9px; display: block;'; // Remover estilo de "no file"
            } else {
                fileChosenSpanAntici.style.cssText = noFileChosenStyle;
            }
        });
    }

    // Ocultar los inputs de archivo iniciales
    const inputFiles = document.querySelectorAll('input[type="file"]');
    inputFiles.forEach(input => {
        input.style.display = 'none';
    });

    // Eliminar los spans "No file chosen" originales
    const originalFileChosenSpans = document.querySelectorAll('span#file-chosen');
    originalFileChosenSpans.forEach(span => {
        span.remove();
    });
});

const inputEnvio1 = document.getElementById('DownloadEnvi');
const inputEnvio = document.getElementById('EnvioInput');
const inputExoneracion = document.getElementById('ExoneracionInput');
const inputExoneracion1 = document.getElementById('DownloadExo');
const inputAnticipo = document.getElementById('AnticipoInput');
const inputAnticipo1 = document.getElementById('DownloadAntici');

// Evento para redimensionar la ventana (opcional, para asegurar el estado correcto al cambiar el tamaño)
window.addEventListener('resize', function() {
    const sidenav = document.getElementById('sidenav-main');
    const body = document.querySelector('body');
    if (window.innerWidth > 1199) {
        sidenav.classList.remove('active');
        body.classList.remove('sidenav-open');
    } else if (!body.classList.contains('sidenav-open')) {
        sidenav.classList.remove('active'); // Asegura que esté oculto en mobile si no está abierto
    }
});

document.addEventListener('DOMContentLoaded', function() {
const crearTicketDropdown = document.getElementById('crearTicketDropdown');
const dropdownMenu = crearTicketDropdown.nextElementSibling;

if (crearTicketDropdown && dropdownMenu) {
    crearTicketDropdown.addEventListener('click', function(event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('show');
        this.classList.toggle('active'); // Opcional: Puedes usar esta clase para otros estilos si lo necesitas
    });

    document.addEventListener('click', function(event) {
        if (!crearTicketDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
            crearTicketDropdown.classList.remove('active'); // Opcional
        }
    });
}
});

function inicializeModal() {
    var modal = $("#miModal"); // Modal Nivel 2
    var modal1 = $("#miModal1"); // Modal Nivel 1
    var spanNivelFalla = $("#cerrar-icon");     // Cierre Modal de Nivel Falla
    var spanFalla1 = $("#cerrar-iconNivel1");    // Cierre Modal Nivel 1
    var spanFalla2 = $("#cerraModal2");
    var btnAnterior = $("#anterior");
    var btnSiguiente = $("#siguiente");
    var indiceActual = 0;
    var nivelFallaModal = $("#nivelFallaModal");
    var cerrarNivelFalla = $("#cerrar"); // Botón de cerrar el modal de nivel de falla
    var cerraModalFalla1 = $("#buttonCerrar"); // Botón de cerrar el modal de nivel 1
    var cerraModalFalla2 = $("#buttonCerrar2")
    

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
    
    cerrarNivelFalla.off('click').on('click', function() { // Cierre Modal Nivel de Falla (BOTON DE CERRAR)
        nivelFallaModal.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales
    });

    spanNivelFalla.off('click').on('click', function() { // Cierre Modal NIVEL FALLA (ICON-CERRAR)
        nivelFallaModal.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales
    });

    cerraModalFalla1.off('click').on('click', function() { // Cierre Modal Nivel 1 (BOTON DE CERRAR)
        modal1.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales
    });

    spanFalla1.off('click').on('click', function() { // Cierre Modal Nivel 1  (ICON-CERRAR)
        modal1.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales
    });

    cerraModalFalla2.off('click').on('click', function() { // Cierre Modal falla 2 (BOTON DE CERRAR)
        modal.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales
    });

    spanFalla2.off('click').on('click', function() { // Cierre Modal falla 2 (ICON-CERRAR)
        modal.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales
    });

    function cerrarNivelFallaModal() {
        nivelFallaModal.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales
    }

 
    
    function mostrarMiModal(nivel) { // Muestra Modal Nivel 2 y limpia campos al mostrar
        modal.css("display", "block");
        indiceActual = 0;
        mostrarContenido(indiceActual);
        clearFormFields(); // Limpiar campos de ambos modales
    }

    function mostrarMiModal1(nivel) { // Muestra Modal Nivel 1 y limpia campos al mostrar
        modal1.css("display", "block");
        clearFormFields(); // Limpiar campos de ambos modales
    }   

    /*cerrarNivelFalla.off('click').on('click', function() { // Cierre Modal Nivel de Falla
        modal.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales
    });*/



    crearTicketDropdownItems.off('click').on('click', function(event) {
        event.preventDefault(); // Evitar que el enlace navegue
        var selectedValue = $(this).data('value');

        if (selectedValue === 'Soporte POS') {
            nivelFallaModal.css("display", "block");
        } else if (selectedValue) {
            // Aquí puedes implementar la lógica para mostrar el modal correspondiente
            // basado en la selección del dropdown. Por ejemplo, podrías tener
            // un modal diferente para cada tipo de ticket.
            Swal.fire({
                icon: 'success',
                title: 'Ticket seleccionado',
                text: 'Se ha seleccionado: ' + selectedValue,
                color: 'black'
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
                icon: 'warning',
                title: 'Seleccione un motivo para crear ticket',
                color: 'black'
            });
        }
    });

    $("#nivel1Btn").off('click').on('click', function() {
        cerrarNivelFallaModal();
        mostrarMiModal1('nivel1'); // Esta función ya establece display: block para modal1
    });


    $("#nivel2Btn").off('click').on('click', function() {
        cerrarNivelFallaModal();
        mostrarMiModal('nivel2'); // Esta función ya establece display: block para modal
    });

    $(window).off('click').on('click', function(event) {
        if (event.target == modal[0]) { // Clic fuera de Modal Nivel 2
            modal.css("display", "none");
            nivelFallaModal.css("display", "none");
        } else if (event.target == modal1[0]) { // Clic fuera de Modal Nivel 1
            modal1.css("display", "none");
            nivelFallaModal.css("display", "none");
        } else if (event.target == nivelFallaModal[0]) { // Clic fuera del Selector de Nivel
            nivelFallaModal.css("display", "none");
        }
    });

    btnAnterior.off('click').on('click', function() {
        if (indiceActual > 0) {
            indiceActual--;
            mostrarContenido(indiceActual);
        }
    });

    btnSiguiente.off('click').on('click', function() {
        if (indiceActual < 2) {
            indiceActual++;
            mostrarContenido(indiceActual);
        }
    });
}

$(document).ready(function() {
    inicializeModal();
});

function clearFormFields() {
    // Limpiar campos de Modal Nivel 2 (miModal)
    document.getElementById('FallaSelect2').value = '';
    document.getElementById('InputRif').value = '';
    document.getElementById('serialSelect').value = '';
    document.getElementById('AsiganrCoordinador').value = '';
    document.getElementById('FallaSelectt2').value = '2'; // Restablecer a Nivel 2 por defecto (o '')
    document.getElementById('EnvioInput').value = '';
    document.getElementById('ExoneracionInput').value = '';
    document.getElementById('AnticipoInput').value = '';
    document.getElementById('rifMensaje1').innerHTML = ''; // Limpiar mensaje de error
    document.getElementById('rifMensaje').innerHTML = ''; // Limpiar mensaje de error


    // Limpiar campos de Modal Nivel 1 (miModal1)
    document.getElementById('FallaSelect1').value = '';
    document.getElementById('InputRif1').value = '';
    document.getElementById('serialSelect1').value = '';
    document.getElementById('FallaSelectt1').value = '1'; // Restablecer a Nivel 1 por defecto (o '')
}

function SendDataFailure1() {
    // Obtener el valor del botón "Nivel 1"
    const nivelFalla = document.getElementById('FallaSelectt1').value;
    const serial     =  document.getElementById("serialSelect1").value; // Usar serialSelect
    const falla      = document.getElementById('FallaSelect1').value;
    const id_user    = document.getElementById('id_user').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/SaveDataFalla`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Asegúrate de que esto esté presente

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // **MOVER LA LÓGICA DEL CORREO AQUÍ**
                    const xhrEmail = new XMLHttpRequest();
                    xhrEmail.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/send_ticket1`);
                    xhrEmail.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                    xhrEmail.onload = function() {
                        if (xhrEmail.status === 200) {
                            const responseEmail = JSON.parse(xhrEmail.responseText);
                            // Puedes manejar la respuesta del envío de correo aquí si es necesario
                            console.log('Respuesta del envío de correo:', responseEmail);
                        } else {
                            console.error('Error al solicitar el envío de correo:', xhrEmail.status);
                        }
                    };

                    xhrEmail.onerror = function() {
                        console.error('Error de red al solicitar el envío de correo.');
                    };

                    xhrEmail.send(); // No necesitas enviar datos adicionales si tu backend ya tiene la información
                    // **FIN DE LA LÓGICA DEL CORREO**

                    Swal.fire({
                        icon: 'success',
                        title: 'Guardado exitoso',
                        text: response.message,
                        color: 'black',
                        timer: 2500,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        willClose: () => {
                            setTimeout(() => {
                                location.reload(); // Recarga la página después del temporizador
                            }, 1000);
                        }
                    });
                    $("#miModal1").css("display", "none"); // Cerrar modal
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al guardar',
                        text: response.message,
                        color: 'black'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar la respuesta',
                    text: error.message,
                    color: 'black'
                });
            }
        } else if (xhr.status === 400) {
            // El backend devolvió un error de "Bad Request" (campos vacíos)
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: response.message, // Mostrar el mensaje "Hay un campo vacio." del backend
                    color: 'black'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Error en la solicitud',
                    text: 'Se encontraron problemas con los datos enviados.',
                    color: 'black'
                });
            }
        } else if (xhr.status === 500) {
            // El backend devolvió un error interno del servidor
            try {
                const response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error del servidor',
                    text: response.message, // Mostrar el mensaje "Error al guardar los datos de falla." del backend
                    color: 'black'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error del servidor',
                    text: 'Ocurrió un error al intentar guardar los datos.',
                    color: 'black'
                });
            }
        } else {
            // Otros errores de conexión o estados HTTP no manejados
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: `Ocurrió un error al comunicarse con el servidor. Código de estado: ${xhr.status}`,
                color: 'black'
            });
        }
    };

    xhr.onerror = function() {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            color: 'black'
        });
    };
    const datos = `action=SaveDataFalla&serial=${encodeURIComponent(serial)}&falla=${encodeURIComponent(falla)}&nivelFalla=${encodeURIComponent(nivelFalla)}&id_user=${encodeURIComponent(id_user)}`;
    xhr.send(datos);
}

/* CAMPO 1 FALLA*/
$(document).ready(function() {
    $.mask.definitions['~'] = '[JVEG]'; // Permite J o V
    $('#InputRif').mask('~9?99999999');
});
/* END CAMPO 1 FALLA*/

/* CAMPO 2 FALLA*/
$(document).ready(function() {
    $.mask.definitions['~'] = '[JVEG]'; // Permite J o V
    $('#InputRif1').mask('~9?99999999');
});
/* END CAMPO 2 FALLA*/

function checkRif() {
    const input = document.getElementById('InputRif');
    const mensajeDivt = document.getElementById('rifMensaje');
    mensajeDivt.innerHTML = '';
    mensajeDivt.style.color = ''; // Limpia el color anterior

    if (input.value === '') {
        mensajeDivt.innerHTML = 'Campo vacío';
        mensajeDivt.style.color = 'red';
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/ValidateRif`);
       

        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    mensajeDivt.innerHTML = response.message;
                    mensajeDivt.style.color = response.color;
                    if (response.success) {
                        getPosSerials(response.rif);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    mensajeDivt.innerHTML = 'Error al procesar la respuesta del servidor.';
                    mensajeDivt.style.color = 'red';
                }
            } else if (xhr.status === 404) {
                mensajeDivt.innerHTML = 'El RIF No Existe';
                mensajeDivt.style.color = 'red';
            } else if (xhr.status === 400) {
                mensajeDivt.innerHTML = 'Error: RIF no proporcionado';
                mensajeDivt.style.color = 'red';
            } else {
                console.error('Error:', xhr.status, xhr.statusText);
                mensajeDivt.innerHTML = 'Error de conexión con el servidor.';
                mensajeDivt.style.color = 'red';
            }
        };

        xhr.onerror = function() {
            mensajeDivt.innerHTML = 'Error de red al intentar verificar el RIF.';
            mensajeDivt.style.color = 'red';
            console.error('Error de red');
        };

        const datos = `action=ValidateRif&rif=${encodeURIComponent(input.value)}`;
        xhr.send(datos);
    }
}

function checkRif1() {
    const input = document.getElementById('InputRif1');
    const mensajeDivt = document.getElementById('rifMensaje1');
    mensajeDivt.innerHTML = '';
    mensajeDivt.style.color = ''; // Limpia el color anterior

    if (input.value === '') {
        mensajeDivt.innerHTML = 'Campo vacío';
        mensajeDivt.style.color = 'red';
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/ValidateRif1`);
         
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    mensajeDivt.innerHTML = response.message;
                    mensajeDivt.style.color = response.color;
                    if (response.success) {
                        getPosSerials1(response.rif);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    mensajeDivt.innerHTML = 'Error al procesar la respuesta del servidor.';
                    mensajeDivt.style.color = 'red';
                }
            } else if (xhr.status === 404) {
                mensajeDivt.innerHTML = 'El RIF No Existe';
                mensajeDivt.style.color = 'red';
            } else if (xhr.status === 400) {
                mensajeDivt.innerHTML = 'Error: RIF no proporcionado';
                mensajeDivt.style.color = 'red';
            } else {
                console.error('Error:', xhr.status, xhr.statusText);
                mensajeDivt.innerHTML = 'Error de conexión con el servidor.';
                mensajeDivt.style.color = 'red';
            }
        };

        xhr.onerror = function() {
            mensajeDivt.innerHTML = 'Error de red al intentar verificar el RIF.';
            mensajeDivt.style.color = 'red';
            console.error('Error de red');
        };

        const datos = `action=ValidateRif1&rif=${encodeURIComponent(input.value)}`;
        xhr.send(datos);
    }
}

function getPosSerials1(rif) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/GetPosSerials1`);
    
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('serialSelect1');
                    select.innerHTML = '<option value="">Seleccione un serial</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.serials) && response.serials.length > 0) {
                        response.serials.forEach(item => { // Cambiamos 'serial' a 'item' para representar cada objeto
                            const option = document.createElement('option');
                            option.value = item.serial; // Accedemos a la propiedad 'serial' del objeto
                            option.textContent = item.serial; // Accedemos a la propiedad 'serial' del objeto
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
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/GetFailure1`);
    
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('FallaSelect1');

                    select.innerHTML = '<option value="">Seleccione la falla</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.failures) && response.failures.length > 0) {
                        response.failures.forEach(failure => {
                            const option = document.createElement('option');
                            option.value = failure.id_failure;
                            option.textContent = failure.name_failure;
                            select.appendChild(option);
                        });
                    } else {
                        // Si no hay fallas, puedes mostrar un mensaje en el select
                        const option = document.createElement('option');
                        option.value = '';
                        option.textContent = 'No hay fallas disponibles';
                        select.appendChild(option);
                    }
                } else {
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener las fallas.';
                    console.error('Error al obtener las fallas:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la respuesta de las fallas.';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para las fallas.';
        }
    };

    const datos = `action=GetFailure1`; // Cambia la acción para que coincida con el backend
    xhr.send(datos);
}
// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener('DOMContentLoaded', getFailure);

function getFailure2() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/GetFailure2`);
    
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('FallaSelect2');
                    select.innerHTML = '<option value="">Seleccione la falla</option>';
                    if (Array.isArray(response.failures) && response.failures.length > 0) {
                        response.failures.forEach(failure => {
                            const option = document.createElement('option');
                            option.value = failure.id_failure;
                            option.textContent = failure.name_failure;
                            select.appendChild(option);
                        });
                    } else {
                        const option = document.createElement('option');
                        option.value = '';
                        option.textContent = 'No hay fallas disponibles';
                        select.appendChild(option);
                    }
                } else {
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener las fallas.';
                    console.error('Error al obtener las fallas:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la respuesta de las fallas.';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para las fallas.';
        }
    };

    const datos = `action=GetFailure2`;
    xhr.send(datos);
}

document.addEventListener('DOMContentLoaded', getFailure2);

function getCoordinador() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST',  `${ENDPOINT_BASE}${APP_PATH}api/GetCoordinador`);
   
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('AsiganrCoordinador');

                    select.innerHTML = '<option value="">Seleccione el Coordinador</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.coordinadores) && response.coordinadores.length > 0) {
                        response.coordinadores.forEach(coordinador => {
                            const option = document.createElement('option');
                            option.value = coordinador.id_user;
                            option.textContent = coordinador.full_name;
                            select.appendChild(option);
                        });
                    } else {
                        // Si no hay fallas, puedes mostrar un mensaje en el select
                        const option = document.createElement('option');
                        option.value = '';
                        option.textContent = 'No hay Coordinador disponibles';
                        select.appendChild(option);
                    }
                } else {
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener los Coordinadores.';
                    console.error('Error al obtener las fallas:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la respuesta de los Coordinadores.';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para los Coordinadores.';
        }
    };

    const datos = `action=GetCoordinador`; // Cambia la acción para que coincida con el backend
    xhr.send(datos);
}
// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener('DOMContentLoaded', getCoordinador);

let fechaUltimoTicketGlobal = null;
let fechaInstalacionGlobal = null;

function getPosSerials(rif) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST',  `${ENDPOINT_BASE}${APP_PATH}api/GetPosSerials`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        const mensajeDiv = document.getElementById('rifMensaje');

        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('serialSelect');
                    select.innerHTML = '<option value="">Seleccione un serial</option>';

                    if (Array.isArray(response.serials) && response.serials.length > 0) {
                        response.serials.forEach(item => { // Cambiamos 'serial' a 'item' para representar cada objeto
                            const option = document.createElement('option');
                            option.value = item.serial; // Accedemos a la propiedad 'serial' del objeto
                            option.textContent = item.serial; // Accedemos a la propiedad 'serial' del objeto
                            select.appendChild(option);
                        });
                        // Añadir el event listener solo una vez DESPUÉS de poblar el select
                        select.onchange = function() { // Usar onchange para reemplazar el listener
                            const selectedSerial = serialSelect.value;
                            if (selectedSerial) {
                                getUltimateTicket(selectedSerial);
                                getInstalationDate(selectedSerial);
                                VerificarSucursales(rif);
                            }
                        };
                    }
                } else {
                    mensajeDiv.innerHTML += '<br>' + response.message;
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                mensajeDiv.innerHTML += '<br>Error al procesar la respuesta de seriales.';
            }
        } else if (xhr.status === 404) {
            mensajeDiv.innerHTML += '<br>No se encontraron seriales para el RIF proporcionado.';
        } else if (xhr.status === 400) {
            try {
                const response = JSON.parse(xhr.responseText);
                mensajeDiv.innerHTML += '<br>' + response.message;
            } catch (parseError) {
                mensajeDiv.innerHTML += '<br>Error en la solicitud de seriales.';
                console.error('Error parsing 400 response:', parseError);
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            mensajeDiv.innerHTML += '<br>Error de conexión con el servidor para seriales.';
        }
    };

    xhr.onerror = function() {
        document.getElementById('rifMensaje').innerHTML += '<br>Error de red al intentar obtener los seriales.';
        console.error('Error de red');
    };

    const datos = `action=GetPosSerials&rif=${encodeURIComponent(rif)}`;
    xhr.send(datos);
}

function getUltimateTicket(serial) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST',  `${ENDPOINT_BASE}${APP_PATH}api/GetUltimateTicket`); // Asegúrate de usar la ruta correcta de tu API
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response && response.success) {
                        if (response.fecha !== null) {
                            fechaUltimoTicketGlobal = response.fecha;
                            document.getElementById('ultimateTicketInput').value = response.fecha;
                            validarGarantiaReingreso(response.fecha);
                        } else if (response.message === 'No tiene ticket') {
                            fechaUltimoTicketGlobal = 'No disponible';
                            document.getElementById('ultimateTicketInput').value = 'No disponible';
                            validarGarantiaReingreso('No disponible');
                        } else {
                            fechaUltimoTicketGlobal = 'No disponible';
                            document.getElementById('ultimateTicketInput').value = 'No disponible';
                            validarGarantiaReingreso('No disponible');
                            console.warn('Respuesta exitosa sin fecha o mensaje esperado:', response);
                        }
                    } else {
                        console.error('Error:', response.message);
                        Swal.fire({
                            title: 'Error',
                            text: 'Error al obtener la fecha del último ticket.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al procesar la respuesta del servidor.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        color: 'black'
                    });
                }
            } else if (xhr.status === 400) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    Swal.fire({
                        title: 'Advertencia',
                        text: response.message, // Mostrar el mensaje "No tiene ticket"
                        icon: 'warning',
                        confirmButtonText: 'OK',
                        color: 'black'
                    });
                    document.getElementById('ultimateTicketInput').value = 'No disponible';
                    fechaUltimoTicketGlobal = 'No disponible';
                    validarGarantiaReingreso('No disponible');
                } catch (error) {
                    console.error('Error parsing JSON for 400:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Error en la solicitud de la fecha del último ticket.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        color: 'black'
                    });
                }
            } else {
                console.error('Error:', xhr.status, xhr.statusText);
                Swal.fire({
                    title: 'Error',
                    text: 'Error de conexión con el servidor.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    color: 'black'
                });
            }
        };
        const datos = `action=GetUltimateTicket&serial=${encodeURIComponent(serial)}`;
        xhr.send(datos);
    }

    function getInstalationDate(serial) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST',  `${ENDPOINT_BASE}${APP_PATH}api/GetInstallPosDate`); // Asegúrate de usar la ruta correcta de tu API
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response && response.success) {
                        const fecha = response.fecha;
                        document.getElementById('InputFechaInstall').value = fecha !== null ? fecha : 'No disponible';
                        fechaInstalacionGlobal = fecha;
                        validarGarantiaInstalacion(fecha !== null ? fecha : 'No disponible');
                    } else {
                        document.getElementById('InputFechaInstall').value = 'No disponible';
                        fechaInstalacionGlobal = null;
                        validarGarantiaInstalacion('No disponible');
                        console.error('Error:', response ? response.message : 'Respuesta de éxito falsa sin mensaje.');
                    }
                } catch (error) {
                    document.getElementById('InputFechaInstall').value = 'No disponible';
                    fechaInstalacionGlobal = null;
                    validarGarantiaInstalacion('No disponible');
                    console.error('Error parsing JSON:', error);
                }
            } else if (xhr.status === 400) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    document.getElementById('InputFechaInstall').value = 'No disponible';
                    fechaInstalacionGlobal = null;
                    validarGarantiaInstalacion('No disponible');
                    console.warn('Advertencia:', response.message);
                    // Puedes mostrar un mensaje al usuario si lo deseas, por ejemplo, con Swal.fire()
                } catch (error) {
                    document.getElementById('InputFechaInstall').value = 'No disponible';
                    fechaInstalacionGlobal = null;
                    validarGarantiaInstalacion('No disponible');
                    console.error('Error parsing JSON for 400:', error);
                }
            } else {
                document.getElementById('InputFechaInstall').value = 'No disponible';
                fechaInstalacionGlobal = null;
                validarGarantiaInstalacion('No disponible');
                console.error('Error:', xhr.status, xhr.statusText);
            }
        };
    
        xhr.onerror = function() {
            document.getElementById('InputFechaInstall').value = 'No disponible';
            fechaInstalacionGlobal = null;
            validarGarantiaInstalacion('No disponible');
            console.error('Error de red al intentar obtener la fecha de instalación.');
        };
    
        const datos = `action=GetInstallPosDate&serial=${encodeURIComponent(serial)}`;
        xhr.send(datos);
    }

function validarGarantiaReingreso(fechaUltimoTicket) {
    const resultadoElemento = document.getElementById('resultadoGarantiaReingreso');
    // Controlar visibilidad de los botones
    const botonExoneracion = document.getElementById('DownloadExo');
    const botonAnticipo = document.getElementById('DownloadAntici');
   // const animation = document.getElementById('animation');
 

    if (fechaUltimoTicket === 'No disponible') {
        resultadoElemento.textContent = 'Sin Novedad';
        resultadoElemento.style.color = '';
        return null;
    } else {
        const fechaActual = new Date();
        const fechaTicket = new Date(fechaUltimoTicket);
        const diferencia = fechaActual.getTime() - fechaTicket.getTime();
        const meses = Math.ceil(diferencia / (1000 * 3600 * 24 * 30));

        if (meses <= 3) {
            Swal.fire({
                title: '¡Notificación!',
                text: 'Tiene Garantía Por Reingreso.',
                icon: 'warning',
                confirmButtonText: 'OK',
                color: 'black'
            });
            resultadoElemento.textContent = 'Garantía por Reingreso aplica';
            resultadoElemento.style.color = 'red';
            botonExoneracion.style.display = 'none';
            botonAnticipo.style.display = 'none';
           // animation.style.display = 'block';  
            return 3;
        } else {
            resultadoElemento.textContent = 'Sin Novedad';
            resultadoElemento.style.color = '';
            botonExoneracion.style.display = 'inline-block';
            botonAnticipo.style.display = 'inline-block';
           // animation.style.display = 'none';  

            return null;
        }
    }
}

function validarGarantiaInstalacion(fechaInstalacion) {
    const resultadoElemento = document.getElementById('resultadoGarantiaInstalacion');
     // Controlar visibilidad de los botones
     const botonExoneracion = document.getElementById('DownloadExo');
     const botonAnticipo = document.getElementById('DownloadAntici');
     //const animation = document.getElementById('animation');
 

    if (fechaInstalacion === 'No disponible') {
        resultadoElemento.textContent = 'Sin Novedad';
        resultadoElemento.style.color = '';
        return null;
    } else {
        const fechaActual = new Date();
        const fechaInstalacionDate = new Date(fechaInstalacion);
        const diferencia = fechaActual.getTime() - fechaInstalacionDate.getTime();
        const meses = Math.ceil(diferencia / (1000 * 3600 * 24 * 30));

        if (meses <= 6) {
            Swal.fire({
                title: '¡Notificación!',
                text: 'Tiene Garantía Por Instalacion.',
                icon: 'warning',
                confirmButtonText: 'OK',
                color: 'black'
            });
            resultadoElemento.textContent = 'Garantía por Instalacion aplica';
            resultadoElemento.style.color = 'red';
            botonExoneracion.style.display = 'none';
            botonAnticipo.style.display = 'none';
           // animation.style.display = 'block';
            
            return 1;
        } else {
            resultadoElemento.textContent = 'Sin novedad';
            resultadoElemento.style.color = '';
            botonExoneracion.style.display = 'inline-block';
            botonAnticipo.style.display = 'inline-block';
            //animation.style.display = 'none';  

            return null;
        }
    }
}

function UpdateGuarantees() {
    const idStatusPaymentReingreso = validarGarantiaReingreso(fechaUltimoTicketGlobal);
    const idStatusPaymentInstalacion = validarGarantiaInstalacion(fechaInstalacionGlobal);
    const inputExoneracion = document.getElementById('ExoneracionInput');
    const inputAnticipo = document.getElementById('AnticipoInput');
    const archivoExoneracion = inputExoneracion.files[0];
    const archivoAnticipo = inputAnticipo.files[0];


   // console.log(idStatusPaymentReingreso, idStatusPaymentInstalacion);
    let idStatusPayment;

    //console.log(idStatusPayment);
    if (idStatusPaymentReingreso === 3) {
        idStatusPayment = 3;
    } else if (idStatusPaymentInstalacion === 1) {
        idStatusPayment = 1;
    } else {
        // No hay garantía, determinar si se debe enviar exoneración o anticipo
        const botonExoneracion = document.getElementById('DownloadExo');
        const botonAnticipo = document.getElementById('DownloadAntici');

        if (botonExoneracion.style.display !== 'none' && archivoExoneracion) {
            idStatusPayment = 5; // Exoneración
        } else if (botonAnticipo.style.display !== 'none' && archivoAnticipo) {
            idStatusPayment = 7; // Anticipo
        } else {
            idStatusPayment = 2; // Ninguna garantía y ningún botón visible (caso raro, pero manejado)
        }
    }

    // Mostrar alertas después de determinar el valor de idStatusPayment
    if (idStatusPayment === 3) {
        Swal.fire({
            title: '¡Notificación!',
            text: 'Tiene Garantía Por Reingreso.',
            icon: 'warning',
            confirmButtonText: 'OK',
            color: 'black'
        });
    } else if (idStatusPayment === 1) {
        Swal.fire({
            title: '¡Notificación!',
            text: 'Tiene Garantía Por Instalacion.',
            icon: 'warning',
            confirmButtonText: 'OK',
            color: 'black'
        });
    }

    // Controlar visibilidad de los botones
    const botonExoneracion = document.getElementById('DownloadExo');
    const botonAnticipo = document.getElementById('DownloadAntici');

    if (idStatusPayment === 3 || idStatusPayment === 1) {
        botonExoneracion.style.display = 'none';
        botonAnticipo.style.display = 'none';
    } else {
        botonExoneracion.style.display = 'inline-block';
        botonAnticipo.style.display = 'inline-block';
    }

    return idStatusPayment; // Retornar el idStatusPayment
}

document.getElementById('SendForm2').addEventListener('click', function() {
    const idStatusPayment = UpdateGuarantees();
    SendDataFailure2(idStatusPayment);
});

function VerificarSucursales(rif) {
    const xhrSucursales = new XMLHttpRequest();
    xhrSucursales.open('POST', 'app/views/Tecnico/consulta_rif/backEnd.php');
    xhrSucursales.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhrSucursales.onload = function() {
        if (xhrSucursales.status === 200) {
            const responseSucursales = JSON.parse(xhrSucursales.responseText);
            try {
                if (responseSucursales.success) {
                    const idRegion = responseSucursales.id_region;
                    const botonCargarEnvio = document.getElementById('DownloadEnvi').parentNode;
                    const idRegionNumero = parseInt(idRegion, 10); // Convertir a entero (base 10)

                    if (idRegionNumero === 1) {
                        botonCargarEnvio.style.display = 'none';
                    } else {
                        botonCargarEnvio.style.display = 'block';
                    }
                } else {
                    console.error("Error al verificar las sucursales:", responseSucursales ? responseSucursales.message : 'Error desconocido');
                    // En caso de error, podrías mostrar el botón por defecto o tener otra lógica
                    const botonCargarEnvio = document.getElementById('DownloadEnvi').parentNode;
                    botonCargarEnvio.style.display = 'block';
                }
            } catch (error) {
                console.log("Respuesta del servidor:", responseSucursales); // Ver la respuesta completa para depurar
            }
        } else {
            console.error("Error en la petición para verificar sucursales. Status:", xhrSucursales.status);
        }
    };

    const datosSucursales = `action=VerifingBranches&rif=${encodeURIComponent(rif)}`;
    xhrSucursales.send(datosSucursales);
}

let cargaSeleccionada = null; // Puede ser 'exoneracion', 'anticipo' o null

document.getElementById('DownloadExo').addEventListener('click', function(event) {
    document.getElementById('DownloadAntici').style.display = 'none';
    document.getElementById('AnticipoInput').style.display = 'none';
    event.stopPropagation(); // Detener la propagación del evento
    cargaSeleccionada = 'exoneracion';
    // Validación de exoneración AL HACER CLIC en "Cargar Exoneracion"
    const inputExoneracion = document.getElementById('ExoneracionInput');
    const archivoExoneracion = inputExoneracion.files[0];
    const inputExoneracion1 = document.getElementById('DownloadExo'); // El botón

    if (inputExoneracion1.style.display !== 'none' && !archivoExoneracion) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Por favor, seleccione el PDF de exoneración después de hacer click en \"Cargar Exoneración\".',
            color: 'black'
        });
        return; // Importante: Detener la ejecución si la validación falla
    }

    if (archivoExoneracion.size > 5 * 1024 * 1024) {
        Swal.fire({ icon: 'warning', title: 'Archivo muy grande', text: 'El archivo de exoneración no debe superar los 5MB.', color: 'black' });
        return; // Importante: Detener la ejecución si la validación falla
    }

    // Si la validación pasa, puedes continuar con alguna otra lógica aquí si es necesario
    //console.log("Validación de exoneración pasada.");
});

document.getElementById('DownloadAntici').addEventListener('click', function(event) {
    document.getElementById('DownloadExo').style.display = 'none';
    document.getElementById('ExoneracionInput').style.display = 'none';
    event.stopPropagation(); // Detener la propagación del evento
    cargaSeleccionada = 'anticipo';
    // Aquí puedes agregar la lógica para mostrar el input de anticipo

    // Validación de anticipo AL HACER CLIC en "Cargar PDF Anticipo"
    const inputAnticipo = document.getElementById('AnticipoInput');
    const archivoAnticipo = inputAnticipo.files[0];
    const inputAnticipo1 = document.getElementById('DownloadAntici'); // El botón

    if (inputAnticipo1.style.display !== 'none' && !archivoAnticipo) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Por favor, seleccione el PDF de anticipo después de hacer click en \"Cargar PDF Anticipo\".',
            color: 'black'
        });
        return; // Importante: Detener la ejecución si la validación falla
    }

    // Puedes agregar aquí validación de tamaño para el archivo de anticipo si es necesario

    // Si la validación pasa, puedes continuar con alguna otra lógica aquí si es necesario
    //console.log("Validación de anticipo pasada.");
});

function SendDataFailure2(idStatusPayment) {
    const descrpFailure = document.getElementById('FallaSelect2').value;
    const id_user = document.getElementById('id_user').value;
    const rif = document.getElementById('InputRif').value;
    const serial = document.getElementById('serialSelect').value;
    const coordinador = document.getElementById('AsiganrCoordinador').value;
    const archivoEnvio = inputEnvio.files[0];
    const nivelFalla = document.getElementById('FallaSelectt2').value;
    const inputEnvio1 = document.getElementById('DownloadEnvi');
    const inputExoneracion = document.getElementById('ExoneracionInput');
    const archivoExoneracion = inputExoneracion.files[0];
    const inputExoneracion1 = document.getElementById('DownloadExo');
    const inputAnticipo = document.getElementById('AnticipoInput');
    const archivoAnticipo = inputAnticipo.files[0];
    const inputAnticipo1 = document.getElementById('DownloadAntici');
    const envioButtonContainer = document.querySelector('#DownloadEnvi').parentNode; // Contenedor del botón de envío


    // Validaciones generales
    if (!descrpFailure) {
        Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor, seleccione una falla.', color: 'black' });
        return;
    }
    if (!rif) {
        Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor, Coloque un RIF.', color: 'black' });
        return;
    }
    if (!serial) {
        Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor, seleccione un serial.', color: 'black' });
        return;
    }
    if (!coordinador) {
        Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor, seleccione un coordinador.', color: 'black' });
        return;
    }

    //console.log(envioButtonContainer);

    // Validación condicional para el archivo de envío
    if (envioButtonContainer && envioButtonContainer.style.display !== 'none' && !archivoEnvio) {
        Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor, seleccione el PDF de envío después de hacer click en \"Cargar\".', color: 'black' });
        return;
    }

    // Validación condicional para el archivo de exoneración (justo antes de formData)
    if (inputExoneracion1 && inputExoneracion1.style.display !== 'none' && !archivoExoneracion && cargaSeleccionada !== 'anticipo') {
        Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor, seleccione el PDF de Exoneracion después de hacer click en \"Cargar\".', color: 'black' });
        return;
    }
    //console.log(cargaSeleccionada);         
    // Validación condicional para el archivo de exoneración (justo antes de formData)
    if (inputAnticipo1 && inputAnticipo1.style.display !== 'none'  && !archivoAnticipo && cargaSeleccionada !== 'exoneracion') {
        Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor, seleccione el PDF del Anticipo después de hacer click en \"Cargar\".', color: 'black' });
        return;
    }


    // Agregar datos al formData
    const formData = new FormData();
    formData.append('descrpFailure', descrpFailure);
    formData.append('serial', serial);
    formData.append('coordinador', coordinador);
    formData.append('nivelFalla', nivelFalla);
    formData.append('id_status_payment', idStatusPayment);
    formData.append('id_user', id_user);
    
    console.log(descrpFailure, serial, coordinador, nivelFalla, idStatusPayment, id_user);
    if (envioButtonContainer.style.display !== 'none' && archivoEnvio) {
        formData.append('archivoEnvio', archivoEnvio);
    }

    if (inputExoneracion1.style.display !== 'none' && cargaSeleccionada === 'exoneracion') {
        if (!archivoExoneracion) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'Por favor, seleccione el PDF de exoneración después de hacer click en \"Cargar Exoneración\".',
                color: 'black'
            });
            return; // Importante: Detener la ejecución si la validación falla
        } else {
            formData.append('archivoExoneracion', archivoExoneracion);
        }
    }

    if (inputAnticipo1.style.display !== 'none' && cargaSeleccionada === 'anticipo') {
        if (!archivoAnticipo) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'Por favor, seleccione el PDF de Anticipo después de hacer click en \"Cargar Anticipo\".',
                color: 'black'
            });
            return; // Importante: Detener la ejecución si la validación falla
        } else {
            formData.append('archivoAnticipo', archivoAnticipo);
        }
    }

    formData.append('action', 'SaveDataFalla2');

    // Depuración
    /*for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    console.log(formData);*/

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/SaveDataFalla2`);
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // **MOVER LA LÓGICA DEL CORREO AQUÍ**
                    const xhrEmail = new XMLHttpRequest();
                    xhrEmail.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/send_ticket2`);
                    xhrEmail.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Importante para enviar datos como formulario

                    xhrEmail.onload = function() {
                        if (xhrEmail.status === 200) {
                            const responseEmail = JSON.parse(xhrEmail.responseText);
                            console.log('Respuesta del envío de correo:', responseEmail);
                            // Puedes mostrar un mensaje adicional si el correo se envió correctamente
                        } else {
                            console.error('Error al solicitar el envío de correo:', xhrEmail.status);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al enviar correo',
                                text: 'Hubo un problema al intentar enviar el correo al coordinador.',
                                color: 'black'
                            });
                        }
                    };

                    xhrEmail.onerror = function() {
                        console.error('Error de red al solicitar el envío de correo.');
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de conexión',
                            text: 'No se pudo conectar con el servidor para enviar el correo.',
                            color: 'black'
                        });
                    };

                    // **ENVIAMOS EL ID DEL COORDINADOR COMO PARÁMETRO EN LA PETICIÓN**
                    const params = `id_coordinador=${encodeURIComponent(coordinador)}`;
                    xhrEmail.send(params);
                    // **FIN DE LA LÓGICA DEL CORREO**
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Guardado exitoso',
                        text: response.message,
                        color: 'black',
                        timer: 1500,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        willClose: () => {
                            setTimeout(() => {
                                location.reload();
                            }, 1000);
                        }
                    });
                    $("#miModal").css("display", "none");
                } else {
                    Swal.fire({ icon: 'error', title: 'Error', text: response.message, color: 'black' });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                console.log(xhr.responseText);
                Swal.fire({ icon: 'error', title: 'Error en el servidor', text: 'Ocurrió un error al procesar la respuesta del servidor.', color: 'black' });
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', color: 'black' });
        }
    };
    xhr.send(formData);
}
