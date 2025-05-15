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

      // document.getElementById('updatoscontacto').disabled=false;
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


function nameUsuario(){
    const nombreusuario=document.getElementById('nombreuser').value;
    const apellidousuario=document.getElementById('apellidouser').value;
    const nameusers=document.getElementById('usuario').value;

    const inicialnombre=nombreusuario.substr(0, 1);

         if (nombreusuario!='' && apellidousuario!='') {

         const idusuario=inicialnombre+apellidousuario;
            //console.log(idusuario);

            document.getElementById("usuario").value=idusuario;
        }
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
                        const actionsCell = row.insertCell(); // Nueva celda para las acciones


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

                        // Crear los botones
                        const modifyButton = document.createElement('button');
                        modifyButton.textContent = 'Modificar';
                        modifyButton.classList.add('btn', 'btn-sm', 'btn-primary', 'me-2'); // Añade clases de Bootstrap para estilo

                        const statusButton = document.createElement('button');
                        statusButton.textContent = 'Cambiar Status';
                        statusButton.classList.add('btn', 'btn-sm', 'btn-info'); // Añade clases de Bootstrap para estilo

                        // Añadir los botones a la celda de acciones
                        actionsCell.appendChild(modifyButton);
                        actionsCell.appendChild(statusButton);
                    });

                    //console.log('Datos de usuario insertados:', userData); // Agrega esta línea


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
                        dom: 'Bfrtip',
                        buttons: [
                        {
                            text: '<button data-toggle="modal" data-target="#ModalAggUsers"class="btn btn-primary" type="button">Crear Usuario</button>'
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

//console.log(regionusers);
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
