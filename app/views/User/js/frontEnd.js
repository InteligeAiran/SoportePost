function getUserData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://${ENDPOINT_BASE}${APP_PATH}api/GetUsers`);
    
    //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    const tbody = document.getElementById('table-user').getElementsByTagName('tbody')[0];
    
    // Limpia la tabla ANTES de la nueva búsqueda
    tbody.innerHTML = '';

    // Destruye DataTables si ya está inicializado
    if ($.fn.DataTable.isDataTable('#table-user-bod')) {
        $('#table-user-bod').DataTable().destroy();
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
                    if ($.fn.DataTable.isDataTable('#table-user')) {
                        $('#table-user').DataTable().destroy();
                    }
                    $('#table-user').DataTable({
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
                    $('#table-user').resizableColumns();

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
//console.log('FrontEnd.js loaded successfully!');