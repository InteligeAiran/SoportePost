function soloNumeros(e)
{
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum == 8) || (keynum == 46))
        return true;

    return /\d/.test(String.fromCharCode(keynum));
}


correosvalidos=0
function validarEmail(elemento){
  // document.getElementById('updatoscontacto').disabled=true;
  var texto = document.getElementById(elemento.id).value;
  var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  var per =0;
   if(document.getElementById(elemento.id).value == "") {
      document.getElementById(elemento.id).style = 'border-color:none;';

   }
   else if (!regex.test(texto)) {
      document.getElementById("resultcorreo").innerHTML = "Correo invalido";
      // document.getElementById('updatoscontacto').disabled=true;
      document.getElementById(elemento.id).style = 'border-color:red;';   
       if (elemento.id=='email') { per=1; }
       correosvalidos=1;

      }

   else if (regex.test(texto) || (per ==0)){
      // document.getElementById('updatoscontacto').disabled=false;
      document.getElementById("resultcorreo").innerHTML = "";
      document.getElementById(elemento.id).style = 'border-color:green;';

    correosvalidos=0
  }
}

    function soloLetras(e) {
        key = e.keyCode || e.which;
        tecla = String.fromCharCode(key).toString();
    letras = "áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";//Se define todo el abecedario que se quiere mostrar.
    especiales = [8, 37, 39, 46, 6, 32]; //Es la validacion del KeyCodes, que teclas recibe el campo de texto.
    tecla_especial = false
    for(var i in especiales) {
        if(key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if(letras.indexOf(tecla) == -1 && !tecla_especial){
        return false;
    }
}


// function nameUsuario(){
//     const nombreusuario=document.getElementById('nombreuser').value;
//     const apellidousuario=document.getElementById('apellidouser').value;
//     const nameusers=document.getElementById('usuario').value;

//     const inicialnombre=nombreusuario.substr(0, 1);

//          if (nombreusuario!='' && apellidousuario!='') {

//          const idusuario=inicialnombre+apellidousuario;
//             //console.log(idusuario);

//             document.getElementById("usuario").value=idusuario;
//         }
//   }


function nameUsuario() {
    const nombreusuario = document.getElementById('nombreuser').value.trim();
    const apellidousuario = document.getElementById('apellidouser').value.trim();
    const usuarioInput = document.getElementById('usuario');
    const usuarioStatusDiv = document.getElementById('usuario-status');

    usuarioStatusDiv.innerHTML = '';
    // No limpiamos el input de usuario aquí, lo actualizaremos con la sugerencia

    if (nombreusuario === '' || apellidousuario === '') {
        usuarioInput.value = ''; // Limpiar si los campos base están vacíos
        return;
    }

    // --- Parte de la validación AJAX ---
    const checkUsernameEndpoint = `${ENDPOINT_BASE}${APP_PATH}api/users/checkUsernameAvailability`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', checkUsernameEndpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.suggested_username) { // Siempre usaremos la sugerencia que venga del backend
                    usuarioInput.value = response.suggested_username; // ¡Actualiza el input con la sugerencia del backend!

                    if (response.available) {
                        //usuarioStatusDiv.innerHTML = '<span style="color: green;">Nombre de usuario disponible.</span>';
                        usuarioInput.classList.remove('is-invalid');
                        usuarioInput.classList.add('is-valid');
                    } else {
                        // Si no está disponible pero hay sugerencia (ej. YQUIJADA -> YAQUIJADA)
                        //usuarioStatusDiv.innerHTML = '<span style="color: red;">.response.suggested_username.</span>';
                        //usuarioStatusDiv.innerHTML = '<span style="color: green;">Nombre de usuario disponible.</span>';
                        usuarioInput.classList.add('is-valid');
                        usuarioInput.classList.remove('is-invalid');
                    }
                } else {
                    // Si no hay suggested_username (ej. error fatal en el SP)
                    usuarioInput.value = ''; // Limpiar si no hay sugerencia válida
                    usuarioStatusDiv.innerHTML = '<span style="color: orange;">${response.message || Error al verificar disponibilidad.}</span>';
                    usuarioInput.classList.remove('is-valid');
                    usuarioInput.classList.add('is-invalid');
                }
            } catch (error) {
                console.error('Error parsing JSON for username check:', error);
                usuarioInput.value = '';
                usuarioStatusDiv.innerHTML = '<span style="color: orange;">Error al verificar disponibilidad.</span>';
                usuarioInput.classList.remove('is-valid');
                usuarioInput.classList.add('is-invalid');
            }
        } else {
            console.error('Error en el servidor al verificar usuario:', xhr.status, xhr.statusText);
            usuarioInput.value = '';
            usuarioStatusDiv.innerHTML = '<span style="color: orange;">Error de conexión al verificar usuario.</span>';
            usuarioInput.classList.remove('is-valid');
            usuarioInput.classList.add('is-invalid');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red al verificar usuario.');
        usuarioInput.value = '';
        usuarioStatusDiv.innerHTML = '<span style="color: orange;">Error de red al verificar usuario.</span>';
        usuarioInput.classList.remove('is-valid');
        usuarioInput.classList.add('is-invalid');
    };

    // ¡ENVÍA NOMBRE Y APELLIDO AL BACKEND!
    xhr.send(`nombre=${encodeURIComponent(nombreusuario)}&apellido=${encodeURIComponent(apellidousuario)}`);
}



function levelTecnico(){
    var idtipousuario=document.getElementById('tipousers').value;
    var infoDiv=document.getElementById('nivel').value;

    
    if (idtipousuario==3) {
        $('#nivel').css('display', 'block');
    } else {

        $('#nivel').css('display', 'none') ;
    }

}


function levelTecnicoEditar(){

    var idtipousuario=document.getElementById('edit_tipousers').value;
    var infoDiv=document.getElementById('nivelEditar').value;
    console.log(idtipousuario);

    
    if (idtipousuario==3) {
        $('#nivelEditar').css('display', 'block');
    } else {

        $('#nivelEditar').css('display', 'none') ;
    }

}


function getUserData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${ENDPOINT_BASE}${APP_PATH}api/users/GetUsers`);
    //xhr.open('POST', 'http://localhost/SoportePost/api/GetTipoUsers'); // Asi estaba antes de cambiarlo
    
    //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    const tbody = document.getElementById('table-ticket-body');
    
    // Limpia la tabla ANTES de la nueva búsqueda
    tbody.innerHTML = '';

    // Destruye DataTables si ya está inicializado
    if ($.fn.DataTable.isDataTable('#tabla-ticket')) {
        $('#tabla-ticket').DataTable().destroy();
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
                    const userData = response.users; // Cambia el nombre de la variable aquí

                    userData.forEach(data => { // Usa un nombre diferente para el elemento individual
                        const row = tbody.insertRow();
                        const id_secuencialCell = row.insertCell();
                        const id_userCell = row.insertCell();
                        const full_nameCell = row.insertCell();
                        const usernameCell = row.insertCell();
                        const cedulaCell = row.insertCell();
                        const emailCell = row.insertCell();
                        const statusCell = row.insertCell();
                        const RolCell = row.insertCell();
                        const areaCell = row.insertCell();
                        const tipo_userCell = row.insertCell();
                        const name_regionCell = row.insertCell();
                        const moduloCell = row.insertCell(); // Nueva celda para las acciones
                        const actionsCell = row.insertCell();


                        id_secuencialCell.textContent = data.secuencial; // Accede a las propiedades del 'item'
                        id_userCell.textContent = data.id_user; // Accede a las propiedades del 'item'
                        full_nameCell.textContent = data.full_name;
                        usernameCell.textContent = data.usuario;
                        cedulaCell.textContent = data.cedula;
                        emailCell.textContent = data.correo;
                        statusCell.textContent = data.status_texto;
                        RolCell.textContent = data.name_rol;
                        areaCell.textContent = data.name_area;
                        tipo_userCell.textContent = data.name_level;
                        name_regionCell.textContent = data.name_region;

                        const moduloButton = document.createElement('button');
                        moduloButton.textContent = 'Asignar';
                        moduloButton.classList.add('btn', 'btn-sm', 'btn-link'); // Añade clases de Bootstrap para estilo
                        moduloCell.appendChild(moduloButton);

                        // Crear los botones
                        const modifyButton = document.createElement('button');
                        modifyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>';
                        modifyButton.classList.add('btn', 'btn-xs', 'btn-primary', 'me-1'); // Añade clases de Bootstrap para estilo
 
                        // Añadir los botones a la celda de acciones
                        actionsCell.appendChild(modifyButton);
                        //actionsCell.appendChild(statusButton);


                        modifyButton.onclick = function() {
                          
                         const idusuario = data.id_user;
                            console.log(idusuario);
                         $('#ModalEditUsers').modal('show'); // abrir
                         VerUsuario(idusuario);
                        };


                        moduloButton.onclick = function() {
                         const idusuario= data.id_user;
                         $('#ModalModulos').modal('show'); // abrir
                         VerModulos(idusuario);
                        };

                    });

                    // Inicialización de DataTables
                    if ($.fn.DataTable.isDataTable('#tabla-ticket')) {
                        $('#tabla-ticket').DataTable().destroy();
                    }
                    $('#tabla-ticket').DataTable({
                        responsive: true,
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
                        },

                "columnDefs": [
                 {
                       "targets": [ 1],
                       "visible": false,
                   }
               ],    
                        dom: 'Bfrtip',
                        buttons: [
                        {
                            text: '<button data-toggle="modal" data-target="#ModalAggUsers" class="btn btn-primary" type="button">Crear Usuario</button>'
                        }
                        ]
                    });
                    $('#tabla-ticket').resizableColumns();

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
    const datos = `action=GetUsers`;
    xhr.send(datos);
}

document.addEventListener('DOMContentLoaded', getUserData);


// Funcion para mostrar las area para crear usuarios 
function getAreaUsuarios() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/GetAreaUsers`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                

    xhr.onload = function() {

        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('areausers');

                    select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.area) && response.area.length > 0) {
                        response.area.forEach(coordinador => {
                            const option = document.createElement('option');
                            option.value = coordinador.idarea;
                            option.textContent = coordinador.desc_area;
                            select.appendChild(option);
                        });
                    } else {
                        // Si no hay fallas, puedes mostrar un mensaje en el select
                        const option = document.createElement('option');
                        option.value = '';
                        option.textContent = 'No hay Áreas disponibles';
                        select.appendChild(option);
                    }
                } else {
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener las áreas.';
                    console.error('Error al obtener las fallas:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la respuesta de los áreas.';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para los áreas.';
        }
    };

    const datos = `action=GetAreaUsers`; // Cambia la acción para que coincida con el backend
    xhr.send(datos);
}

// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener('DOMContentLoaded', getAreaUsuarios);


//FUNCION PARA MOSTRAR TIPO DE USUARIOS 
function getTipoUsuarios() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/GetTipoUsers`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {

        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('tipousers');
 
                    select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.tipousers) && response.tipousers.length > 0) {
                        response.tipousers.forEach(tipousers => {
                            const option = document.createElement('option');
                            option.value = tipousers.idtipo;
                            option.textContent = tipousers.desc_tipo;
                            select.appendChild(option);
                        });
                    } else {
                        // Si no hay fallas, puedes mostrar un mensaje en el select
                        const option = document.createElement('option');
                        option.value = '';
                        option.textContent = 'No hay información disponible';
                        select.appendChild(option);
                    }
                } else {
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener los datos.';
                    console.error('Error al obtener las fallas:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la información.';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para los áreas.';
        }
    };

    const datos = `action=GetTipoUsers`; // Cambia la acción para que coincida con el backend
    xhr.send(datos);
}

// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener('DOMContentLoaded', getTipoUsuarios);



//FUNCION PARA MOSTRAR LA LISTA DE REGIONES
function getRegionUsuarios() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST',  `${ENDPOINT_BASE}${APP_PATH}api/users/GetRegionUsers`);
   
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {

        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const select = document.getElementById('regionusers');
 
                    select.innerHTML = '<option value="">Seleccione</option>'; // Limpiar y agregar la opción por defecto
                    if (Array.isArray(response.regionusers) && response.regionusers.length > 0) {
                        response.regionusers.forEach(regionusers => {
                            const option = document.createElement('option');
                            option.value = regionusers.idreg;
                            option.textContent = regionusers.desc_reg;
                            select.appendChild(option);
                        });
                    } else {
                        // Si no hay fallas, puedes mostrar un mensaje en el select
                        const option = document.createElement('option');
                        option.value = '';
                        option.textContent = 'No hay información disponible';
                        select.appendChild(option);
                    }
                } else {
                    document.getElementById('rifMensaje').innerHTML += '<br>Error al obtener los datos.';
                    console.error('Error al obtener las fallas:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                document.getElementById('rifMensaje').innerHTML += '<br>Error al procesar la información.';
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
            document.getElementById('rifMensaje').innerHTML += '<br>Error de conexión con el servidor para los áreas.';
        }
    };

    const datos = `action=GetRegionUsers`; // Cambia la acción para que coincida con el backend
    xhr.send(datos);
}

// Llama a la función para cargar las fallas cuando la página se cargue
document.addEventListener('DOMContentLoaded', getRegionUsuarios);

document.getElementById('btnGuardarUsers').addEventListener('click', function() {
    GuardarUsuariosNew();
});

function GuardarUsuariosNew() {
    const nombre_usuario = document.getElementById('nombreuser').value;
    const apellido_usuario = document.getElementById('apellidouser').value;
    const tipo_doc = document.getElementById('tipodoc').value;
    const documento = document.getElementById('documento').value;
    const iusuario = document.getElementById('usuario').value;
    const correo = document.getElementById('email').value;
    const area_usuario = document.getElementById('areausers').value;
    const tipo_usuario = document.getElementById('tipousers').value;
    const regionusers = document.getElementById('regionusers').value;
    const id_nivel = document.getElementById('idnivel').value;
    const id_user = document.getElementById('id_user').value

    const identificacion=tipo_doc+documento;

    // Validaciones generales
    if (!nombre_usuario && !apellido_usuario && !documento && !correo && !area_usuario && !tipo_usuario && !regionusers) {
        alertify.error('Los campos no pueden estar vacios')
        return;
    }

    //alert(nombre_usuario + apellido_usuario + iusuario + identificacion + correo + area_usuario + tipo_usuario + regionusers + id_nivel);

    // Agregar datos al formData
    const formData = new FormData();
    formData.append('nombreuser', nombre_usuario);
    formData.append('apellidouser', apellido_usuario);
    //formData.append('tipodoc', tipo_doc);
    //formData.append('coddocumento', documento);
    formData.append('usuario', iusuario);
    formData.append('email', correo);
    formData.append('areausers', area_usuario);
    formData.append('tipousers', tipo_usuario);
    formData.append('regionusers', regionusers);
    formData.append('identificacion', identificacion);
    formData.append('id_user', id_user);
    formData.append('id_nivel', id_nivel);
    formData.append('action', 'GuardarUsuarios');


    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/GuardarUsuarios`);


    
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
                            // setTimeout(() => {
                                location.reload();
                            //   }, 1000);
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

function VerUsuario(idusuario) {
    var infoDiv=document.getElementById('nivelEditar').value;


    const xhrUsuario = new XMLHttpRequest();
    xhrUsuario.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/GetMostrarUsuarioEdit`);
    xhrUsuario.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // const selectAreas = document.getElementById('edit_areausers');
    // selectAreas.innerHTML = '';
   
    xhrUsuario.onload = function() {
        const responseUsuario = JSON.parse(xhrUsuario.responseText);
        if (responseUsuario.success && responseUsuario.users && Array.isArray(responseUsuario.users) && responseUsuario.users.length > 0) {
            const userData = responseUsuario.users[0];
            $("#idusuario_edit").val(userData.id_usuario);
            $("#edit_nombreuser").val(userData.inombre);
            $("#edit_apellidouser").val(userData.iapellido);
            $("#edit_documento").val(userData.documentoo);
            $("#edit_usuario").val(userData.usuario);
            $("#edit_email").val(userData.correo);
            $("#edit_regionusers").val(userData.idreg);
            $("#edit_tipousers").val(userData.name_rol);
            $("#edit_idnivel").val(userData.idlevel);

            if (userData.idrol==3) {
                console.log(userData.idrol);
                    $('#nivelEditar').css('display', 'block');
                } else {

                    $('#nivelEditar').css('display', 'none') ;
                }

            obtenerAreas(userData.iid_area);
            obtenerRegion(userData.idreg);
            obtenerRol(userData.idrol);
        } else {
            console.error("Error al obtener la información del usuario o el formato de la respuesta es incorrecto:", responseUsuario);
            // Aquí podrías añadir lógica para manejar el error, como mostrar un mensaje al usuario
        }
    };

    const id_user = idusuario;
    const datosUsuario = `action=GetMostrarUsuarioEdit&id_user=${encodeURIComponent(id_user)}`;
    xhrUsuario.send(datosUsuario);
}

function obtenerAreas(idAreaSeleccionada) {
    const xhrAreas = new XMLHttpRequest();
    xhrAreas.open('GET', `${ENDPOINT_BASE}${APP_PATH}api/users/GetAreaUsers`); // Cambié a GET
    xhrAreas.onload = function() {
        const responseAreas = JSON.parse(xhrAreas.responseText);
        //console.log('Respuesta de GetAreaUsers:', responseAreas); // Agregué un log para inspeccionar la respuesta
        if (responseAreas.success && responseAreas.area && Array.isArray(responseAreas.area)) {
            const listaDeAreas = responseAreas.area; // Cambié el nombre para claridad

            const selectAreas = document.getElementById('edit_areausers');

            listaDeAreas.forEach(area => {
                const option = document.createElement('option');
                option.value = area.idarea; // Usando el nombre de propiedad del backend
                option.textContent = area.desc_area; // Usando el nombre de propiedad del backend
                if (area.idarea == idAreaSeleccionada) { // Comparando con el ID del backend
                    option.selected = true;
                    //console.log('Opción seleccionada:', area.desc_area); // Para verificar si se selecciona alguna
                }
                selectAreas.appendChild(option);
            });
        } else {
            console.error("Error al obtener la lista de áreas o el formato de la respuesta es incorrecto:", responseAreas);
        }
    };
    xhrAreas.send();
}


function obtenerRegion(idRegionSelect) {
    const xhrRegion = new XMLHttpRequest();
    xhrRegion.open('GET', `${ENDPOINT_BASE}${APP_PATH}api/users/GetRegionUsers`); // Cambié a GET
    xhrRegion.onload = function() {
        const responseRegion = JSON.parse(xhrRegion.responseText);
        //console.log('Respuesta de GetRegionUsers:', responseRegion); // Agregué un log para inspeccionar la respuesta
        if (responseRegion.success && responseRegion.regionusers && Array.isArray(responseRegion.regionusers)) {
            const listaDeAreas = responseRegion.regionusers; // Cambié el nombre para claridad

            const selectRegion = document.getElementById('edit_regionusers');

            listaDeAreas.forEach(regionusers => {
                const option = document.createElement('option');
                option.value = regionusers.idreg; // Usando el nombre de propiedad del backend
                option.textContent = regionusers.desc_reg; // Usando el nombre de propiedad del backend
                if (regionusers.idreg == idRegionSelect) { // Comparando con el ID del backend
                    option.selected = true;
                    //console.log('Opción seleccionada:', regionusers.desc_reg); // Para verificar si se selecciona alguna
                }
                selectRegion.appendChild(option);
            });
        } else {
            console.error("Error al obtener la lista de regiones o el formato de la respuesta es incorrecto:", responseRegion);
        }
    };
    xhrRegion.send();
}


function obtenerRol(idTipoUserSelect) {
    const xhrTipoU = new XMLHttpRequest();
    xhrTipoU.open('GET', `${ENDPOINT_BASE}${APP_PATH}api/users/GetTipoUsers`); // Cambié a GET
    xhrTipoU.onload = function() {
        const responseTipoU = JSON.parse(xhrTipoU.responseText);
        //console.log('Respuesta de GetTipoUsers:', responseTipoU); // Agregué un log para inspeccionar la respuesta
        if (responseTipoU.success && responseTipoU.tipousers && Array.isArray(responseTipoU.tipousers)) {
            const listaTipoU = responseTipoU.tipousers; // Cambié el nombre para claridad

            const selectTipoU = document.getElementById('edit_tipousers');

            listaTipoU.forEach(tipousers => {
                const option = document.createElement('option');
                option.value = tipousers.idtipo; // Usando el nombre de propiedad del backend
                option.textContent = tipousers.desc_tipo; // Usando el nombre de propiedad del backend
                if (tipousers.idtipo == idTipoUserSelect) { // Comparando con el ID del backend
                    option.selected = true;
                    //console.log('Opción seleccionada:', tipousers.desc_tipo); // Para verificar si se selecciona alguna
                }
                selectTipoU.appendChild(option);
            });
        } else {
            console.error("Error al obtener la lista de tipo de usuarios o el formato de la respuesta es incorrecto:", responseTipoU);
        }
    };
    xhrTipoU.send();
}



document.getElementById('btnEditarUsers').addEventListener('click', function() {
    EditarUsuarios();
});


function EditarUsuarios() {
    const idusuario_edit = document.getElementById('idusuario_edit').value;
    const nombre_usuario = document.getElementById('edit_nombreuser').value;
    const apellido_usuario = document.getElementById('edit_apellidouser').value;
    const tipo_doc = document.getElementById('tipodoc').value;
    const documento = document.getElementById('edit_documento').value;
    const iusuario = document.getElementById('edit_usuario').value;
    const correo = document.getElementById('edit_email').value;
    const area_usuario = document.getElementById('edit_areausers').value;
    const regionusers = document.getElementById('edit_regionusers').value;
    const tipo_usuario = document.getElementById('edit_tipousers').value;
    const id_nivel = document.getElementById('edit_idnivel').value;
    const usuariocarga = document.getElementById('id_user').value
    
    const identificacion=tipo_doc+documento;

        console.log(idusuario_edit);
    //alert(nombre_usuario +'/'+ apellido_usuario +'/'+ iusuario +'/'+ documento +'/'+ correo +'/'+ area_usuario +'/'+ tipo_usuario +'/'+ regionusers);


    // // Agregar datos al formData
    const formData = new FormData();
    formData.append('idusuario_edit', idusuario_edit);
    formData.append('edit_nombreuser', nombre_usuario);
    formData.append('edit_apellidouser', apellido_usuario);
    //formData.append('tipodoc', tipo_doc);
    //formData.append('coddocumento', documento);
    formData.append('identificacion', identificacion);
    formData.append('usuario', iusuario);
    formData.append('edit_email', correo);
    formData.append('edit_areausers', area_usuario);
    formData.append('edit_regionusers', regionusers);
    formData.append('edit_tipousers', tipo_usuario);
    formData.append('edit_idnivel', id_nivel);
    formData.append('id_user', usuariocarga);


    formData.append('action', 'EditarUsuarios');

    // Depuración
    /*for (const [key, value] of formData.entries()) {
        console.log(${key}:, value);
    }
    console.log(formData);*/

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/EditarUsuarios`);
     
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {                  
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'El usuario ha sido modificado exitosamente',
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


function VerModulos(idusuario) {

    const id_usuario = idusuario;

const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/ModuloUsers`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //xhr.open('POST', 'http://localhost/SoportePost/api/GetTipoUsers'); // Asi estaba antes de cambiarlo
    
    //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    const tbody = document.getElementById('tabla-modulo-body');
    
    // Limpia la tabla ANTES de la nueva búsqueda
    tbody.innerHTML = '';

    // Destruye DataTables si ya está inicializado
    if ($.fn.DataTable.isDataTable('#tabla-modulo')) {
        $('#tabla-modulo').DataTable().destroy();
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
                    const userData = response.users; // Cambia el nombre de la variable aquí

                    userData.forEach(data => { // Usa un nombre diferente para el elemento individual
                        const row = tbody.insertRow();
                        const id_secuencialCell = row.insertCell();
                        const id_userCell = row.insertCell();
                        const modulosCell = row.insertCell();
                        

                        id_secuencialCell.textContent = data.idmodulo; // Accede a las propiedades del 'item'
                        id_userCell.textContent = data.desc_modulo; // Accede a las propiedades del 'item'
                        //full_nameCell.textContent = data.full_name;
                        

                        const idCheck = document.createElement('input');
                        idCheck.type = 'checkbox';
                        // Es CRÍTICO darle un ID, especialmente si vas a usar un <label> asociado
                        idCheck.id = 'checkModulo'; // Un ID único y descriptivo
                        idCheck.name = 'moduloAccion'; // Nombre para enviar en formularios


                        if (data.estatus === 't') {
                            idCheck.checked = true;
                            idCheck.value = '0'; // Nombre para enviar en formularios
                        } else {
                            idCheck.checked = false; // Explícito para claridad, aunque es el valor por defecto
                            idCheck.value = '1';
                        }

                        modulosCell.appendChild(idCheck);


                        idCheck.onclick = function() {
                         const iusuario= idusuario;
                         const idmodulo= data.idmodulo;
                         const idcheck= data.estatus;

                         $('#ModalModulos').modal('show'); // abrir
                         AsignacionModulo(idmodulo,iusuario, idcheck);
                        };

                    });

                    //console.log('Datos de usuario insertados:', userData); // Agrega esta línea


                    // Inicialización de DataTables
                    if ($.fn.DataTable.isDataTable('#tabla-modulo')) {
                        $('#tabla-modulo').DataTable().destroy();
                    }
                    $('#tabla-modulo').resizableColumns();

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
    const datos = `action=ModuloUsers&id_usuario=${encodeURIComponent(id_usuario)}`;
    xhr.send(datos);
}

document.addEventListener('DOMContentLoaded', VerModulos);




function AsignacionModulo(idmodulo,iusuario, idcheck){


const id_modulo = idmodulo;
const id_usuario = iusuario;
const idcheck_value= idcheck; 

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/AsignacionModulo`); // Asegúrate de que esta sea la ruta correcta en tu backend
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Asignado',
                        text: response.message,
                        color: 'black',
                        timer: 2500,
                        allowOutsideClick: false,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        // willClose: () => {
                        //     setTimeout(() => {
                        //         location.reload(); // Recarga la página después del temporizador
                        //     }, 1000);
                        // }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al asignar el modulo',
                        text: response.message,
                        color: 'black'
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el servidor',
                    text: 'Ocurrió un error al procesar la respuesta.',
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
    const datos = `action=AsignacionModulo&id_modulo=${encodeURIComponent(id_modulo)}&id_usuario=${encodeURIComponent(id_usuario)}&idcheck_value=${encodeURIComponent(idcheck_value)}`;
    xhr.send(datos);
}


function closedModal() {

    $('#edit_areausers').empty();
    $('#edit_regionusers').empty();
    $('#edit_tipousers').empty();
    $('#edit_idnivel').empty();

}


function closedModalCreated() {
    $('#nombreuser').val('');
    $('#apellidouser').val('');
    $('#documento').val('');
    $('#usuario').val('');
    $('#email').val('');
    $('#areausers').val('');
    $('#regionusers').val('');
    $('#tipousers').val('');
    $('#idnivel').val('');

}