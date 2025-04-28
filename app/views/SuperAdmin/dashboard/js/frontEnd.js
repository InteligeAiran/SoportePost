function getUserCount() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'app/views/SuperAdmin/dashboard/backEnd.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    document.getElementById('userCount').textContent = response.count; // Selecciona por ID
                } else {
                    console.error('Error:', response.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    const datos = 'action=getUserCount';
    xhr.send(datos);
}
// Llama a la función getUserCount() cuando la página se cargue
window.addEventListener('load', getUserCount());

function getUsers() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'app/views/SuperAdmin/dashboard/backEnd.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    const users = response.users; // DATOS DE USER EN ARRY {}
                    const tbody = document.getElementById('userCountTable').getElementsByTagName('tbody')[0];
                    tbody.innerHTML = '';

                    users.forEach(user => {
                        const row                  = tbody.insertRow();
                        const fullnameCell         = row.insertCell();
                        const usernameCell         = row.insertCell();
                        const cedulaCell           = row.insertCell();
                        const emailCell            = row.insertCell();
                        const registrationDateCell = row.insertCell();

                        fullnameCell.textContent          = user.full_name;
                        usernameCell.textContent         = user.username;
                        cedulaCell.textContent           = user.cedula;
                        emailCell.textContent            = user.email;
                        registrationDateCell.textContent = user.date_create;
                    });


                    $(document).ready( function () {
                        $('#userCountTable').DataTable({
                            responsive: true,
                            "pagingType": "simple_numbers",
                            "language": {
                                "emptyTable"     : "No hay Usuarios disponibles en la tabla",
                                "zeroRecords"    : "No se encontraron resultados para la búsqueda",
                                "info"           : "Mostrando pagina _PAGE_ de _PAGES_ ( _TOTAL_ Usuarios(s) )",
                                "infoEmpty"      : "No hay Usuarios disponibles",
                                "infoFiltered"   : "(Filtrado de _MAX_ Usuarios disponibles)",
                                "search"         : "Buscar:",
                                "loadingRecords" : "Buscando...",
                                "processing"     : "Procesando...",
                                "lengthMenu": 'Mostrar <select>'+
                                    '<option value="5">5</option>'+
                                    '<option value="10">10</option>'+
                                    '<option value="25">25</option>'+
                                    '<option value="50">50</option>'+
                                    '<option value="-1">Todos</option>'+
                                    '</select>',
                                "paginate": {
                                    "first"    : "Primero",
                                    "last"     : "Ultimo",
                                    "next"     : "Siguiente",
                                    "previous" : "Anterior"
                                }
                            }
                        });
                    } );
                } else {
                    tbody.innerHTML = '<tr><td colspan="3">Error al cargar</td></tr>';
                    console.error('Error:', response.message);
                }
            } catch (error) {
                tbody.innerHTML = '<tr><td colspan="3">Error al procesar la respuesta</td></tr>';
                console.error('Error parsing JSON:', error);
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="3">Error de conexión</td></tr>';
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function() {
        tbody.innerHTML = '<tr><td colspan="3">Error de conexión</td></tr>';
        console.error('Error de red');
    };

    const datos = 'action=getUsers';
    xhr.send(datos);
}

window.addEventListener('load', getUsers);