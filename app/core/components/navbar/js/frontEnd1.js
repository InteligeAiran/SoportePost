document.addEventListener('DOMContentLoaded', function() {
    const sidenav = document.getElementById('sidenav-main');
    const body = document.querySelector('body');
    const filterToggle = document.getElementById('filter-toggle');
    const soportePosLink = document.querySelector('#crearTicketDropdown + .dropdown-menu a[data-value="Soporte POS"]');
    const consultaRifLink = document.querySelector('#Reportes + .dropdown-menu a[href="consulta_rif"]');



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

     // **NUEVO EVENTO CONDICIONAL PARA OCULTAR EL SIDEBAR AL CLICAR EN "Soporte POS"**
    if (consultaRifLink && filterToggle && window.innerWidth <= 1199) {
        consultaRifLink.addEventListener('click', function(event) {
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

    setActiveLink('inicio-link', 'dashboard');
    setActiveLink('tickets-link', 'pages/tables.html');
    setActiveLink('rif-link', 'consulta_rif');
    setActiveLink('estadisticas-link', 'pages/profile.html');

    setActiveLink('assignment-ticket', 'asignar_tecnico');
    setActiveLink('tecnico', 'tecnico');
    setActiveLink('gestion_users', 'gestionusers');
    setActiveLink('estadisticas-link', 'pages/profile.html');
    setActiveLink('taller', 'taller');
    setActiveLink('pendiente_entrega', 'pendiente_entrega');
});

document.addEventListener('DOMContentLoaded', function() {
    // Estilo para el span "No file chosen"
    const noFileChosenStyle = 'color: gray; font-style: italic; margin-left: 5px;';

    // Función para acortar el nombre del archivo, preservando la extensión
    function shortenFileName(fileName, maxLength = 15) { // Puedes ajustar maxLength
        const lastDotIndex = fileName.lastIndexOf('.');
        let nameWithoutExtension;
        let extension = '';

        // Separar el nombre del archivo de su extensión
        if (lastDotIndex > -1) {
            nameWithoutExtension = fileName.substring(0, lastDotIndex);
            extension = fileName.substring(lastDotIndex); // Incluye el punto
        } else {
            nameWithoutExtension = fileName;
        }

        // Acortar solo la parte del nombre sin la extensión
        if (nameWithoutExtension.length > maxLength) {
            return nameWithoutExtension.substring(0, maxLength - 3) + '...' + extension;
        }

        return fileName; // Si no es necesario acortar, retorna el nombre completo
    }

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
            event.preventDefault();
            envioInputFile.click();
        });
    }

    if (envioInputFile) {
        envioInputFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                // *** AQUÍ SE APLICA LA FUNCIÓN PARA ACORTAR EL NOMBRE ***
                fileChosenSpanEnvio.textContent = shortenFileName(this.files[0].name);
                fileChosenSpanEnvio.style.cssText = 'margin-left: 5px; font-size: 9px; display: block;';
            } else {
                fileChosenSpanEnvio.textContent = ''; // Limpiar si no hay archivo
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
            event.preventDefault();
            exoInputFile.click();
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
                this.value = '';
                fileChosenSpanExo.textContent = ''; // Limpiar si hay error
                fileChosenSpanExo.style.cssText = noFileChosenStyle;
            } else if (file) {
                // *** AQUÍ SE APLICA LA FUNCIÓN PARA ACORTAR EL NOMBRE ***
                fileChosenSpanExo.textContent = shortenFileName(file.name);
                fileChosenSpanExo.style.cssText = 'margin-left: 5px; font-size: 9px; display: block;';
            } else {
                fileChosenSpanExo.textContent = ''; // Limpiar si no hay archivo
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
            event.preventDefault();
            anticiInputFile.click();
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
                this.value = '';
                fileChosenSpanAntici.textContent = ''; // Limpiar si hay error
                fileChosenSpanAntici.style.cssText = noFileChosenStyle;
            } else if (file) {
                // *** AQUÍ SE APLICA LA FUNCIÓN PARA ACORTAR EL NOMBRE ***
                fileChosenSpanAntici.textContent = shortenFileName(file.name);
                fileChosenSpanAntici.style.cssText = 'margin-left: 5px; font-size: 9px; display: block;';
            } else {
                fileChosenSpanAntici.textContent = ''; // Limpiar si no hay archivo
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

document.addEventListener('DOMContentLoaded', function() {
    const reportesDropdown = document.getElementById('Reportes');
    const reportesMenu = reportesDropdown.nextElementSibling;

    if (reportesDropdown && reportesMenu) {
        reportesDropdown.addEventListener('click', function(event) {
            event.preventDefault();
            reportesMenu.classList.toggle('show');
            this.classList.toggle('active'); // Opcional
        });

        document.addEventListener('click', function(event) {
            if (!reportesDropdown.contains(event.target) && !reportesMenu.contains(event.target)) {
                reportesMenu.classList.remove('show');
                reportesDropdown.classList.remove('active'); // Opcional
            }
        });
    }
});


const userId = document.getElementById('id_user').value
    document.addEventListener('DOMContentLoaded', function() {
        //console.log('ID de usuario:', userId);
        if (userId > 0) {
            //console.log('URL de permisos:', ${ENDPOINT_BASE}${APP_PATH}/api/permissions/${userId});
            fetch(`${ENDPOINT_BASE}${APP_PATH}api/users/permissions/${userId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const permissions = data.permissions;
                        console.log('Permisos obtenidos:', permissions);
                        updateNavbar(permissions);
                    } else {
                        console.error('Error al obtener los permisos:', data.error);
                        updateNavbar({}); // Ocultar todo en caso de error
                    }
                })
                .catch(error => {
                    console.error('Error de red al obtener los permisos:', error);
                     updateNavbar({}); // Ocultar todo en caso de error de red
                });
        } else {
            console.log('Usuario no autenticado, ocultando elementos.');
            updateNavbar({}); // Ocultar todo si no hay usuario logueado
        }
    });

function updateNavbar(permissions) {
    // Función para verificar si el usuario tiene permiso para una vista
    function hasPermission(viewName) {
        return permissions?.[viewName] === true;
    }

    // **Dropdown "Crear Ticket" y sus sub-ítems**
    const crearTicketDropdown = document.getElementById('crearTicketDropdown');
    const crearTicketMenu = crearTicketDropdown?.nextElementSibling; // El ul.dropdown-menu siguiente

    const soportePosItem = crearTicketMenu?.querySelector('a[data-value="Soporte POS"]')?.closest('li');
    const sustitucionPosItem = crearTicketMenu?.querySelector('a[data-value="Sustitución de POS"]')?.closest('li');
    const prestamoPosItem = crearTicketMenu?.querySelector('a[data-value="Préstamo de POS"]')?.closest('li');
    const desafiliacionPosItem = crearTicketMenu?.querySelector('a[data-value="Desafiliación de POS"]')?.closest('li');
    const migracionBancosItem = crearTicketMenu?.querySelector('a[data-value="Migración de Bancos"]')?.closest('li');
    const cambioRazonSocialItem = crearTicketMenu?.querySelector('a[data-value="Cambio de Razón Social"]')?.closest('li');

    // Ocultar/Mostrar los sub-ítems de "Crear Ticket"
    if (soportePosItem) {
        soportePosItem.style.display = hasPermission('Soporte_Pos') ? 'block' : 'none';
    }
    if (sustitucionPosItem) {
        sustitucionPosItem.style.display = hasPermission('Sustitucion_Pos') ? 'block' : 'none';
    }
    if (prestamoPosItem) {
        prestamoPosItem.style.display = hasPermission('Prestamo_Pos') ? 'block' : 'none';
    }
    if (desafiliacionPosItem) {
        desafiliacionPosItem.style.display = hasPermission('Desafiliacion_Pos') ? 'block' : 'none';
    }
    if (migracionBancosItem) {
        migracionBancosItem.style.display = hasPermission('Migracion_Bancos') ? 'block' : 'none';
    }
    if (cambioRazonSocialItem) {
        cambioRazonSocialItem.style.display = hasPermission('Cambio_RazonSocial') ? 'block' : 'none';
    }

     // **Dropdown "Consultas General" y sus sub-ítems**
    const consultasDropdown = document.getElementById('Reportes');
    const consultasMenu = consultasDropdown?.nextElementSibling; // El ul.dropdown-menu siguiente

    const consultaRifItem = consultasMenu?.querySelector('a[data-value="Consulta Rif"]')?.closest('li');
    const reportesTicketsItem = consultasMenu?.querySelector('a[data-value="Reportes Tickets"]')?.closest('li');

    // Ocultar/Mostrar los sub-ítems de "Consultas General"
    if (consultaRifItem) {
        consultaRifItem.style.display = hasPermission('Consulta_Rif') ? 'block' : 'none';
    }

    if (reportesTicketsItem) {
        reportesTicketsItem.style.display = hasPermission('Reportes_Tickets') ? 'block' : 'none';
    }

    // **Enlace "Estadisticas Mis Tickets"**
    /*const estadisticasLinkLi = document.getElementById('estadisticas-link')?.closest('li');
    if (estadisticasLinkLi) {
        estadisticasLinkLi.style.display = hasPermission('estadisticas-link') ? 'block' : 'none';
    }

    // **Enlace "Asignar Ticket a Técnico"**
    const asignarTicketLinkLi = document.getElementById('assignment-ticket')?.closest('li');
    if (asignarTicketLinkLi) {
        asignarTicketLinkLi.style.display = hasPermission('asignar_tecnico') ? 'block' : 'none';
    }

    // **Enlace "Técnico"**
    const tecnicoLinkLi = document.querySelector('a[href="tecnico"]')?.closest('li');
    if (tecnicoLinkLi) {
        tecnicoLinkLi.style.display = hasPermission('tecnico') ? 'block' : 'none';
    }   */
}

function HideNavbar() {
  const id_user = document.getElementById("id_user").value;
  const navbar = document.getElementById("sidenav-main");


  const xhr = new XMLHttpRequest();
  // El endpoint de tu API que verifica el estatus del usuario logueado (desde la sesión)
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/users/checkStatus`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status === 200) {
        try {
            const response = JSON.parse(xhr.responseText);
            const userStatus = response.isVerified; // Asignar un valor por defecto si no existe

            if (userStatus.id_status === "1") {
               if (navbar) {
                    navbar.style.display = "none"; // Oculta la barra de navegación
                } else {
                    console.error("La barra de navegación no se encontró en el DOM.");
                }
            const newPasswordModalElement = document.getElementById("newPasswordModal");
                if (newPasswordModalElement) {
                    // Si el modal existe, lo mostramos
                    new bootstrap.Modal(newPasswordModalElement).show();
                } else {
                    console.error("El modal 'newPasswordModal' no se encontró en el DOM.");
                }
            } else if (userStatus.id_status != "1") {
                // Si el usuario ya está verificado, ocultamos la barra de navegación
                if (navbar) {
                    navbar.style.display = "block"; // Oculta la barra de navegación
                } else {
                    console.error("La barra de navegación no se encontró en el DOM.");
                }
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la respuesta del servidor.",
            icon: "error",
            confirmButtonText: "OK",
            color: "black",
            });
        }
    } else {
        console.error("Error:", xhr.status, xhr.statusText);
        Swal.fire({
            title: "Error",
            text: "Error de conexión con el servidor.",
            icon: "error",
            confirmButtonText: "OK",
            color: "black",
        });
    }
}
  const datos = `action=checkStatus&userId=${encodeURIComponent(id_user)}`; // O simplemente "" si el endpoint no necesita action
  xhr.send(datos);
}

// --- Event Listeners y la Lógica del Botón 'Guardar Contraseña' del modal ---
// --- Event Listeners y la Lógica del Botón 'Guardar Contraseña' del modal ---
document.addEventListener("DOMContentLoaded", function () {
  HideNavbar(); // Llama a la función para verificar el estatus del usuario al cargar la página
});