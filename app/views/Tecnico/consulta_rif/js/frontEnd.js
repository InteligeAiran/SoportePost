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

    if (cargarBtnEnvio && envioInputFile) {
        cargarBtnEnvio.addEventListener('click', function() {
            envioInputFile.click(); // Simula el clic en el input file
        });
    }

    if (envioInputFile) {
        envioInputFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileChosenSpanEnvio.textContent = this.files[0].name;
                fileChosenSpanEnvio.style.cssText = 'margin-left: 5px; font-size: 11px; display: block;'; // Remover estilo de "no file"
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
                fileChosenSpanExo.style.cssText = 'margin-left: 5px; font-size: 11px; display: block;'; // Remover estilo de "no file"
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
                fileChosenSpanAntici.style.cssText = 'margin-left: 5px; font-size: 11px; display: block;'; // Remover estilo de "no file"
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


//Llamar a la función PHP usando fetch    SESSION EXPIRE DEL USER
fetch('/SoportePost/app/controllers/consulta_rif.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
})
.then(response => response.json())
.then(data => {
    if (data.expired_sessions) {
        //alert(data.message);
        window.location.href = data.redirect;
    }

    // Agregar lógica de recarga automática con verificación
    if (data.sessionLifetime) {
        if (Number.isInteger(data.sessionLifetime)) {
            setTimeout(function() {
                location.reload(true); // Forzar recarga desde el servidor
            }, data.sessionLifetime * 1000); // sessionLifetime está en segundos
        } else {
            console.error("sessionLifetime no es un entero válido:", data.sessionLifetime);
        }
    }
})
.catch(error => {
    console.error('Error:', error);
});
//// END  SESSION EXPIRE DEL USER

function inicializeModal() {
    var modal = $("#miModal"); // Modal Nivel 2
    var modal1 = $("#miModal1"); // Modal Nivel 1
    var span = $(".cerrar");   // Cierre Modal Nivel 2
    var span1 = $(".cerrar1"); // Cierre Modal Nivel 1
    var btnAnterior = $("#anterior");
    var btnSiguiente = $("#siguiente");
    var indiceActual = 0;
    var nivelFallaModal = $("#nivelFallaModal");
    var crearTicketSelect = $("#crearTicketSelect");

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

    crearTicketSelect.off('change').on('change', function() {
        if (this.value === 'Soporte POS') {
            nivelFallaModal.css("display", "block");
            crearTicketSelect.val('Crear Ticket');
        } else if (this.value === 'Crear Ticket') {
            Swal.fire({
                icon: 'warning',
                title: 'Seleccione un motivo para crear ticket',
                color: 'black'
            });
            crearTicketSelect.val('Crear Ticket');
        } else{
            crearTicketSelect.val('Crear Ticket');
        }
    });

    $("#nivel1Btn").off('click').on('click', function() {
        cerrarNivelFallaModal();
        mostrarMiModal1('nivel1'); // Esta función ya establece display: block para modal1
    });

    span1.off('click').on('click', function() { // Cierre Modal Nivel 1
        nivelFallaModal.css("display", "none");
        modal1.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales   
        // No necesitas ocultar modal (Nivel 2) aquí, ya que solo estás cerrando el Nivel 1
    });

    $("#nivel2Btn").off('click').on('click', function() {
        cerrarNivelFallaModal();
        mostrarMiModal('nivel2'); // Esta función ya establece display: block para modal
    });

    span.off('click').on('click', function() { // Cierre Modal Nivel 2
        modal.css("display", "none");
        nivelFallaModal.css("display", "none");
        clearFormFields(); // Limpiar campos de ambos modales   
        // No necesitas ocultar modal1 (Nivel 1) aquí
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

    // Limpiar campos de Modal Nivel 1 (miModal1)
    document.getElementById('FallaSelect1').value = '';
    document.getElementById('InputRif1').value = '';
    document.getElementById('serialSelect1').value = '';
    document.getElementById('FallaSelectt1').value = '1'; // Restablecer a Nivel 1 por defecto (o '')
}

function SendDataFailure1() {
    // Obtener el valor del botón "Nivel 1"
    const nivelFalla = document.getElementById('FallaSelectt1').value;
    // Obtener otros datos del modal (RIF, serial, descripción)
    const serial =  document.getElementById("serialSelect1").value; // Usar serialSelect
    const falla = document.getElementById('FallaSelect1').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/SaveDataFalla');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Asegúrate de que esto esté presente

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // **MOVER LA LÓGICA DEL CORREO AQUÍ**
                    const xhrEmail = new XMLHttpRequest();
                    xhrEmail.open('POST', 'http://localhost:8080/SoportePost/api/email/send_ticket1');
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
    const datos = `action=SaveDataFalla&serial=${encodeURIComponent(serial)}&falla=${encodeURIComponent(falla)}&nivelFalla=${encodeURIComponent(nivelFalla)}`;
    xhr.send(datos);
}

/*function fetchSerialData(serial, detalleId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'app/views/Tecnico/consulta_rif/backEnd.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Identifica la tabla según el detalleId
    const tablaId = "serialCountTable" + (detalleId.charAt(0).toUpperCase() + detalleId.slice(1));
    const tbody = document.getElementById(tablaId).getElementsByTagName('tbody')[0];

    tbody.innerHTML = '';

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.serial && response.serial.length > 0) {
                    const serialData = response.serial[0];

                    for (const key in serialData) {
                        const tr = document.createElement('tr');
                        const th = document.createElement('th');
                        const td = document.createElement('td');

                        const formattedKey = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

                        th.textContent = formattedKey;
                        td.textContent = serialData[key];

                        tr.appendChild(th);
                        tr.appendChild(td);
                        tbody.appendChild(tr);
                    }

                    // Inicializa DataTables (si es necesario)
                    $(document).ready(function() {
                        if ($.fn.DataTable.isDataTable('#' + tablaId)) {
                            $('#' + tablaId).DataTable().destroy();
                        }

                        $('#' + tablaId).DataTable({
                            responsive: true,
                            "pagingType": "simple_numbers",
                            autoWidth: false,
                            "language": { /* ... tu configuración de idioma ... */ /*}*/
                       /* });
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="2">No se encontraron datos para este serial.</td></tr>';
                }
            } catch (error) {
                tbody.innerHTML = '<tr><td colspan="2">Error al procesar la respuesta.</td></tr>';
                console.error('Error parsing JSON:', error);
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="2">Error de conexión.</td></tr>';
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function() {
        tbody.innerHTML = '<tr><td colspan="2">Error de conexión.</td></tr>';
        console.error('Error de red');
    };

    const datos = `action=SearchSerial&serial=${encodeURIComponent(serial)}`;
    xhr.send(datos);
}*/
inicializeModal();


/* CAMPO LOGIN*/
$(document).ready(function() {
    $.mask.definitions['~'] = '[JVEG]'; // Permite J o V
    $('#rifInput').mask('~9?99999999');
});
/* END CAMPO LOGIN*/

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


// Get the input field
var input1 = document.getElementById("rifInput");

// Execute a function when the user presses a key on the keyboard
input1.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("buscarRif").click();
  }
}); 

$("#rifInput").keyup(function(){
    let string = $("#rifInput").val();
    $("#rifInput").val(string.replace(/ /g, ""))
});


function SendRif() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/SearchRif');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const tbody = document.getElementById('rifCountTable').getElementsByTagName('tbody')[0];

    // Limpia la tabla ANTES de la nueva búsqueda
    tbody.innerHTML = '';

    // Destruye DataTables si ya está inicializado
    if ($.fn.DataTable.isDataTable('#rifCountTable')) {
        $('#rifCountTable').DataTable().destroy();
    }

    // Limpia la tabla usando removeChild
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const rifData = response.rif; // Cambia el nombre de la variable aquí

                    rifData.forEach(item => { // Usa un nombre diferente para el elemento individual
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
                        const enlaceSerial = document.createElement('a');
                        enlaceSerial.textContent = item.serial_pos;
                        enlaceSerial.style.color = 'blue';
                        enlaceSerial.style.textDecoration = 'underline';
                        enlaceSerial.style.cursor = 'pointer';
                        serial_posCell.appendChild(enlaceSerial);

                        // Modal de detalles del serial (tu código existente)
                        const modalSerial = document.getElementById('ModalSerial');
                        const spanSerialClose = document.getElementById('ModalSerial-close');
                        enlaceSerial.onclick = function() {
                            modalSerial.style.display = 'block';
                            fetchSerialData(item.serial_pos);
                        }
                        spanSerialClose.onclick = function() {
                            modalSerial.style.display = 'none';
                        }
                        window.onclick = function(event) {
                            if (event.target == modalSerial) {
                                modalSerial.style.display = 'none';
                            }
                        }

                        fechainstallCell.textContent = item.fechainstalacion;
                        afiliacionCell.textContent = item.afiliacion;


                        //TEXTO EN LA VISTA
                        const fechaInstalacion = new Date(item.fechainstalacion);
                        const ahora = new Date();
                        const diffEnMilisegundos = ahora.getTime() - fechaInstalacion.getTime();
                        const diffEnMeses = diffEnMilisegundos / (1000 * 60 * 60 * 24 * 30.44);

                        const garantiaLabel = document.createElement('span');
                        garantiaLabel.style.fontSize = '12px';
                        garantiaLabel.style.fontWeight = 'bold';
                        garantiaLabel.style.display = 'block';
                        garantiaLabel.style.marginTop = '5px';
                        garantiaLabel.style.width = '100px';
                        let garantiaTexto = '';
                        let garantiaClase = '';

                        if (diffEnMeses <= 6 && diffEnMeses >= 0) {
                            garantiaTexto = 'Garantía Instalación (6 meses)';
                            garantiaClase = 'garantia-activa';
                            garantiaDetectada = true;
                        } else {
                            garantiaTexto = 'Sin garantía';
                            garantiaClase = 'sin-garantia';
                        }

                        garantiaLabel.textContent = garantiaTexto;
                        garantiaLabel.className = garantiaClase;
                        fechainstallCell.appendChild(document.createElement('br'));
                        fechainstallCell.appendChild(garantiaLabel);
                        //END TEXTO EN LA VISTA

                        bancoCell.textContent = item.banco;
                        directionCell.textContent = item.direccion_instalacion;
                        estadoCell.textContent = item.estado;
                        municipioCell.textContent = item.municipio;
                    });

                    // Inicialización de DataTables
                    if ($.fn.DataTable.isDataTable('#rifCountTable')) {
                        $('#rifCountTable').DataTable().destroy();
                    }
                    $('#rifCountTable').DataTable({
                        responsive: false,
                        "pagingType": "simple_numbers",
                        "lengthMenu": [5],
                        autoWidth: false,
                        "language": {
                            "lengthMenu": "Mostrar _MENU_ registros", // Esta línea es la clave
                            "emptyTable": "No hay datos disponibles en la tabla",
                            "zeroRecords": "No se encontraron resultados para la búsqueda",
                            "info": "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
                            "infoEmpty": "No hay datos disponibles",
                            "infoFiltered": "(Filtrado de _MAX_ datos disponibles)",
                            "search": "Buscar:",
                            "loadingRecords": "Buscando...",
                            "processing": "Procesando...",
                            "paginate": {
                                "first": "Primero",
                                "last": "Último",
                                "next": "Siguiente",
                                "previous": "Anterior"
                            }
                        }
                    });
                    $('#rifCountTable').resizableColumns();

                } else {
                    tbody.innerHTML = '<tr><td colspan="11">Error al cargar</td></tr>';
                    console.error('Error:', response.message);
                }
            } catch (error) {
                tbody.innerHTML = '<tr><td colspan="11">Error al procesar la respuesta</td></tr>';
                console.error('Error parsing JSON:', error);
            } 
        }else if (xhr.status === 404) {
                tbody.innerHTML = '<tr><td colspan="11">No se encontraron usuarios</td></tr>';
        } else {
            tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };
    xhr.onerror = function() {
        tbody.innerHTML = '<tr><td colspan="11">Error de conexión</td></tr>';
        console.error('Error de red');
    };
    const rifInputValue = document.getElementById('rifInput').value;
    const datos = `action=SearchRif&rif=${encodeURIComponent(rifInputValue)}`;
    xhr.send(datos);
}


function fetchSerialData(serial) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/SearchSerial');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    const tbody = document.getElementById('serialCountTable').getElementsByTagName('tbody')[0];

    // Limpia el contenido de la tabla antes de agregar nuevos datos
    tbody.innerHTML = '';

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.serial && response.serial.length > 0) {
                    const serialData = response.serial[0];

                    // Construye la tabla vertical, omitiendo las propiedades vacías
                    for (const key in serialData) {
                        if (serialData.hasOwnProperty(key) && serialData[key] !== null && serialData[key] !== undefined && serialData[key] !== "") {
                            const tr = document.createElement('tr');
                            const th = document.createElement('th');
                            const td = document.createElement('td');

                            const formattedKey = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

                            th.textContent = formattedKey;
                            td.textContent = serialData[key];
                            td.setAttribute('data-column-name', formattedKey);

                            tr.appendChild(th);
                            tr.appendChild(td);
                            tbody.appendChild(tr);
                        }
                    }

                    // Actualiza la imagen del modal
                    downloadImageModal(serial);

                    // Destruye la instancia de DataTables antes de volver a inicializarla
                    $(document).ready(function() {
                        if ($.fn.DataTable.isDataTable('#serialCountTable')) {
                            $('#serialCountTable').DataTable().destroy();
                        }
                        $('#serialCountTable').DataTable({
                            responsive: true,
                            "pagingType": "simple_numbers",
                            autoWidth: false,
                            "language": {
                                "emptyTable": "No hay datos disponibles en la tabla",
                                "zeroRecords": "No se encontraron resultados para la búsqueda",
                                "info": "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ dato(s) )",
                                "infoEmpty": "No hay datos disponibles",
                                "infoFiltered": "(Filtrado de _MAX_ datos disponibles)",
                                "search": "Buscar:",
                                "loadingRecords": "Buscando...",
                                "processing": "Procesando...",
                                "lengthMenu": 'Mostrar <select><option value="5">5</option><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="-1">Todos</option></select>',
                                "paginate": {
                                    "first": "Primero",
                                    "last": "Ultimo",
                                    "next": "Siguiente",
                                    "previous": "Anterior"
                                }
                            }
                        });
                    });
                } else {
                    tbody.innerHTML = '<tr><td colspan="2">No se encontraron datos para este serial.</td></tr>';
                }
            } catch (error) {
                tbody.innerHTML = '<tr><td colspan="2">Error al procesar la respuesta.</td></tr>';
                console.error('Error parsing JSON:', error);
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="2">Error de conexión.</td></tr>';
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error('Error de red');
    };

    const datos = `action=SearchSerial&serial=${encodeURIComponent(serial)}`;
    xhr.send(datos);
}


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
        xhr.open('POST', 'http://localhost:8080/SoportePost/api/ValidateRif');
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
        xhr.open('POST', 'http://localhost:8080/SoportePost/api/ValidateRif1');
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
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/GetPosSerials1');
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
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/GetFailure1');
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
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/GetFailure2');
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
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/GetCoordinador');
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

function downloadImageModal(serial) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/GetPhoto');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const srcImagen = response.rutaImagen;
                    const claseImagen = response.claseImagen; // Obtener la clase CSS
                    const imgElement = document.querySelector('#ModalSerial img');
                    if (imgElement) {
                        imgElement.src = srcImagen;
                        imgElement.className = claseImagen; // Aplicar la clase CSS
                    } else {
                        console.error('No se encontró el elemento img en el modal.');
                    }
                    if (imgElement) {
                        imgElement.src = rutaImagen;
                    } else {
                        console.error('No se encontró el elemento img en el modal.');
                    }
                } else {
                    console.error('Error al obtener la imagen:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error('Error de red');
    };

    const datos = `action=GetPhoto&serial=${encodeURIComponent(serial)}`;
    xhr.send(datos);
}

let fechaUltimoTicketGlobal = null;
let fechaInstalacionGlobal = null;

function getPosSerials(rif) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/GetPosSerials');
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
        xhr.open('POST', 'http://localhost:8080/SoportePost/api/GetUltimateTicket'); // Asegúrate de usar la ruta correcta de tu API
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
        xhr.open('POST', 'http://localhost:8080/SoportePost/api/GetInstallPosDate'); // Asegúrate de usar la ruta correcta de tu API
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
    const animation = document.getElementById('animation');
 

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
            animation.style.display = 'block';  
            return 3;
        } else {
            resultadoElemento.textContent = 'Sin Novedad';
            resultadoElemento.style.color = '';
            botonExoneracion.style.display = 'inline-block';
            botonAnticipo.style.display = 'inline-block';
            animation.style.display = 'none';  

            return null;
        }
    }
}

function validarGarantiaInstalacion(fechaInstalacion) {
    const resultadoElemento = document.getElementById('resultadoGarantiaInstalacion');
     // Controlar visibilidad de los botones
     const botonExoneracion = document.getElementById('DownloadExo');
     const botonAnticipo = document.getElementById('DownloadAntici');
     const animation = document.getElementById('animation');
 

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
            animation.style.display = 'block';
            
            return 1;
        } else {
            resultadoElemento.textContent = 'Sin novedad';
            resultadoElemento.style.color = '';
            botonExoneracion.style.display = 'inline-block';
            botonAnticipo.style.display = 'inline-block';
            animation.style.display = 'none';  

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
    xhr.open('POST', 'http://localhost:8080/SoportePost/api/SaveDataFalla2');
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
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