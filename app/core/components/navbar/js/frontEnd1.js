// Definiciones globales (si es que ENDPOINT_BASE y APP_PATH son globales)
// Asegúrate de que estas variables estén definidas antes de usarlas,
// por ejemplo, en un script separado o directamente en tu HTML <head> o antes de este script.
// const ENDPOINT_BASE = "http://localhost:8080/"; // Ejemplo, ajusta a tu ruta real
// const APP_PATH = "mi-app/"; // Ejemplo, ajusta a tu ruta real
document.addEventListener("DOMContentLoaded", function () {
    // --- Función genérica refactorizada para manejar dropdowns personalizados ---
    function setupCustomDropdown(toggleElement, menuElement) {
        if (!toggleElement || !menuElement) {
            return;
        }

        toggleElement.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            document.querySelectorAll(".dropdown-menu.show").forEach((openMenu) => {
                if (openMenu !== menuElement && !menuElement.contains(openMenu) && !openMenu.contains(menuElement)) {
                    openMenu.classList.remove("show");
                    const relatedToggle = openMenu.previousElementSibling;
                    if (relatedToggle) {
                        relatedToggle.classList.remove("active");
                        relatedToggle.setAttribute("aria-expanded", "false");
                    }
                }
            });

            menuElement.classList.toggle("show");
            toggleElement.classList.toggle("active");
            toggleElement.setAttribute(
                "aria-expanded",
                menuElement.classList.contains("show")
            );

            const parentDropdownMenu = toggleElement.closest(".dropdown-menu");
            if (parentDropdownMenu) {
                const parentToggle = parentDropdownMenu.previousElementSibling;
                if (parentToggle && !parentDropdownMenu.classList.contains("show")) {
                     parentDropdownMenu.classList.add("show");
                     parentToggle.classList.add("active");
                     parentToggle.setAttribute("aria-expanded", "true");
                }
            }
        });

        document.addEventListener("click", function (event) {
            if (
                !toggleElement.contains(event.target) &&
                !menuElement.contains(event.target)
            ) {
                menuElement.classList.remove("show");
                toggleElement.classList.remove("active");
                toggleElement.setAttribute("aria-expanded", "false");
            }
        });
    }

    // --- Configurar todos los dropdowns ---

    // 1. Dropdown "Gestión de Tickets"
    const gestionTicketsAnchor = document.getElementById("gestionTicketsDropdown");
    const gestionTicketsUl = gestionTicketsAnchor ? gestionTicketsAnchor.nextElementSibling : null;
    setupCustomDropdown(gestionTicketsAnchor, gestionTicketsUl);

    // 2. Sub-dropdown "Crear Ticket" (dentro de Gestión de Tickets)
    const crearTicketSubAnchor = document.getElementById("crearTicketSubDropdown");
    const crearTicketSubUl = crearTicketSubAnchor ? crearTicketSubAnchor.nextElementSibling : null;
    setupCustomDropdown(crearTicketSubAnchor, crearTicketSubUl);

    // 3. Dropdown principal "Consultas y Reportes"
    const consultasReportesAnchor = document.getElementById("consultasReportesDropdown");
    const consultasReportesUl = consultasReportesAnchor ? consultasReportesAnchor.nextElementSibling : null;
    setupCustomDropdown(consultasReportesAnchor, consultasReportesUl);
    
    // 4. Sub-dropdown "Consultas General" (dentro de "Consultas y Reportes")
    const consultasGeneralAnchor = document.getElementById("Reportes"); 
    const consultasGeneralUl = consultasGeneralAnchor ? consultasGeneralAnchor.nextElementSibling : null;
    setupCustomDropdown(consultasGeneralAnchor, consultasGeneralUl);


    // 5. Dropdown "Administración" (este ya existía)
    const administracionAnchor = document.getElementById("administracionDropdown");
    const administracionUl = administracionAnchor ? administracionAnchor.nextElementSibling : null;
    setupCustomDropdown(administracionAnchor, administracionUl);

    // 6. ¡NUEVO DROPDOWN! "Sistema"
    const sistemaAnchor = document.getElementById("sistemaDropdown");
    const sistemaUl = sistemaAnchor ? sistemaAnchor.nextElementSibling : null;
    setupCustomDropdown(sistemaAnchor, sistemaUl);


    // --- Resto de tu código (sidebar, active links, y HideNavbar) ---

    // === Sidebar functionality ===
    const sidenav = document.getElementById("sidenav-main");
    const body = document.querySelector("body");
    const filterToggle = document.getElementById("filter-toggle");

    const soportePosLink = document.querySelector('a[data-value="Soporte POS"]');
    const consultaRifLink = document.getElementById('rif-link');
    const verificacionSolvenciaLink = document.getElementById('domiciliacion');
    // Agregamos los nuevos enlaces para el sidebar toggle
    const gestionUsersLink = document.getElementById('gestion_users');
    const cerrarLink = document.getElementById('cerrar-link');


    function toggleSidenav() {
        if (sidenav) {
            sidenav.classList.toggle("active");
            body.classList.toggle("sidenav-open");
        }
    }

    if (soportePosLink && filterToggle && window.innerWidth <= 1199) {
        soportePosLink.addEventListener("click", toggleSidenav);
    }
    if (consultaRifLink && filterToggle && window.innerWidth <= 1199) {
        consultaRifLink.addEventListener("click", toggleSidenav);
    }
    if (verificacionSolvenciaLink && filterToggle && window.innerWidth <= 1199) {
        verificacionSolvenciaLink.addEventListener("click", toggleSidenav);
    }
    // Añadir los nuevos enlaces al toggle del sidebar
    if (gestionUsersLink && filterToggle && window.innerWidth <= 1199) {
        gestionUsersLink.addEventListener("click", toggleSidenav);
    }
    if (cerrarLink && filterToggle && window.innerWidth <= 1199) {
        cerrarLink.addEventListener("click", toggleSidenav);
    }

    if (filterToggle) {
        filterToggle.addEventListener("click", toggleSidenav);
    }

    body.addEventListener("click", function (event) {
        if (
            window.innerWidth <= 1199 &&
            sidenav &&
            sidenav.classList.contains("active") &&
            !sidenav.contains(event.target) &&
            event.target !== filterToggle
        ) {
            toggleSidenav();
        }
    });

    if (window.innerWidth <= 1199 && sidenav) {
        sidenav.classList.remove("active");
        body.classList.remove("sidenav-open");
    }

    // === Active link highlighting logic ===
    const currentPath = window.location.pathname;
    const base_path = "/SoportePost/"; 

    function setActiveLink(linkId, href) {
        const link = document.getElementById(linkId);
        if (link && currentPath === base_path + href) {
            link.classList.add("active");
            
            let currentElement = link;
            while (currentElement) {
                const parentDropdownMenu = currentElement.closest('.dropdown-menu');
                if (parentDropdownMenu) {
                    const parentToggle = parentDropdownMenu.previousElementSibling;
                    if (parentToggle) {
                        parentToggle.classList.add('active');
                        parentToggle.setAttribute('aria-expanded', 'true');
                        parentDropdownMenu.classList.add('show');
                    }
                    // Subir al siguiente nivel de padre (li.nav-item.dropdown o li.dropend)
                    currentElement = parentDropdownMenu.closest('li.nav-item.dropdown') || parentDropdownMenu.closest('li.dropend');
                } else {
                    currentElement = null; // No más padres dropdown
                }
            }
        }
    }

    setActiveLink("inicio-link", "dashboard");
    setActiveLink("tickets-link", "consulta_ticket");
    setActiveLink("rif-link", "consulta_rif");
    setActiveLink("estadisticas-link", "pages/profile.html"); 
    setActiveLink("assignment-ticket", "asignar_tecnico");
    setActiveLink("tecnico", "tecnico");
    setActiveLink("gestion_users", "gestionusers"); // YA TENÍAS ESTE, AHORA DENTRO DEL NUEVO DROPDOWN
    setActiveLink("taller", "taller");
    setActiveLink("pendiente_entrega", "pendiente_entrega");
    setActiveLink('domiciliacion', 'domiciliacion');
    setActiveLink('cerrar-link', 'cerrar_session'); // Nuevo enlace para Cerrar Sesión

    const soportePosHtmlLink = document.querySelector('a[data-value="Soporte POS"]');
    if (soportePosHtmlLink && soportePosHtmlLink.id) {
        setActiveLink(soportePosHtmlLink.id, "soporte_pos");
    } else if (soportePosHtmlLink) {
        console.warn("Soporte POS link does not have an ID for setActiveLink. Consider adding id='soporte-pos-link' to it.");
    }


    // === HideNavbar (Permission logic removed as requested) ===
    const userIdElement = document.getElementById("id_user");
    const userId = userIdElement ? userIdElement.value : null;
    const ENDPOINT_BASE = "/"; 
    const APP_PATH = "SoportePost/"; 

    function HideNavbar() {
        const navbar = document.getElementById("sidenav-main");

        if (!userId) {
            console.log("Usuario no autenticado (ID de usuario no encontrado).");
            if (navbar) navbar.style.display = "block"; 
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/users/checkStatus`);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    const userStatus = response.isVerified;

                    if (userStatus && userStatus.id_status === "1") {
                        if (navbar) {
                            navbar.style.display = "none";
                        }
                        const newPasswordModalElement = document.getElementById("newPasswordModal");
                        if (newPasswordModalElement) {
                            // new bootstrap.Modal(newPasswordModalElement).show();
                        } else {
                            console.error("El modal 'newPasswordModal' no se encontró en el DOM.");
                        }
                    } else {
                        if (navbar) {
                            navbar.style.display = "block"; 
                        }
                    }
                } catch (error) {
                    console.error("Error parsing JSON or processing response:", error);
                    if (navbar) navbar.style.display = "block";
                }
            } else {
                console.error("Error al verificar estatus del usuario:", xhr.status, xhr.statusText);
                if (navbar) navbar.style.display = "block"; 
            }
        };
        xhr.onerror = function () {
            console.error("Network Error al verificar estatus del usuario.");
            if (navbar) navbar.style.display = "block";
        };

        const datos = `action=checkStatus&userId=${encodeURIComponent(userId)}`;
        xhr.send(datos);
    }

    HideNavbar();
});

/*document.addEventListener("DOMContentLoaded", function () {
  // === Variables para la funcionalidad del Sidebar ===
  const sidenav = document.getElementById("sidenav-main");
  const body = document.querySelector("body");
  const filterToggle = document.getElementById("filter-toggle"); // Asumo que este es el botón que abre/cierra el sidebar

  // Asumo que estos son los enlaces específicos dentro de otros dropdowns que quieres que cierren el sidebar
  const soportePosLink = document.querySelector(
    '#crearTicketDropdown + .dropdown-menu a[data-value="Soporte POS"]'
  );
  const consultaRifLink = document.querySelector(
    '#Reportes + .dropdown-menu a[href="consulta_rif"]'
  );

  // === Lógica del Sidebar (Mantenida de tu código) ===
  function toggleSidenav() {
    if (sidenav) {
      sidenav.classList.toggle("active");
      body.classList.toggle("sidenav-open");
    }
  }

  if (soportePosLink && filterToggle && window.innerWidth <= 1199) {
    soportePosLink.addEventListener("click", function (event) {
      // No uses event.stopPropagation() aquí si este enlace está dentro de un dropdown de Bootstrap,
      // ya que podría impedir que el dropdown se cierre. Bootstrap ya maneja el cierre al hacer clic en un item.
      // Solo toggle el sidebar si es lo que quieres.
      toggleSidenav();
    });
  }

  if (consultaRifLink && filterToggle && window.innerWidth <= 1199) {
    consultaRifLink.addEventListener("click", function (event) {
      // Lo mismo que arriba: no event.stopPropagation() a menos que sea estrictamente necesario
      toggleSidenav();
    });
  }

  
  if (filterToggle) {
    filterToggle.addEventListener("click", toggleSidenav);
  }

  // Cerrar el sidebar si se hace clic fuera de él en pantallas pequeñas
  body.addEventListener("click", function (event) {
    if (
      window.innerWidth <= 1199 &&
      sidenav &&
      sidenav.classList.contains("active") &&
      !sidenav.contains(event.target) &&
      event.target !== filterToggle
    ) {
      toggleSidenav();
    }
  });

  // Cerrar el sidebar al cargar la página en pantallas pequeñas
  if (window.innerWidth <= 1199 && sidenav) {
    sidenav.classList.remove("active");
    body.classList.remove("sidenav-open");
  }

  // === Lógica para marcar el enlace activo ===
  const currentPath = window.location.pathname;
  const base_path = "/SoportePost/"; // Asegúrate de que esta ruta base sea correcta

  function setActiveLink(linkId, href) {
    const link = document.getElementById(linkId);
    if (link && currentPath === base_path + href) {
      link.classList.add("active");
    }
  }

  setActiveLink("inicio-link", "dashboard");
  setActiveLink("tickets-link", "pages/tables.html");
  setActiveLink("rif-link", "consulta_rif");
  setActiveLink("estadisticas-link", "pages/profile.html");
  setActiveLink("assignment-ticket", "asignar_tecnico");
  setActiveLink("tecnico", "tecnico");
  setActiveLink("gestion_users", "gestionusers"); // Asegúrate que este ID exista en tu HTML
  setActiveLink("taller", "taller");
  setActiveLink("pendiente_entrega", "pendiente_entrega");
  setActiveLink('domiciliacion', 'domiciliacion'); // Nuevo: Marcar como activo "Verificación de Solvencia"


  // === Lógica de los Dropdowns Personalizados (SI NO USAN data-bs-toggle) ===
  // ATENCIÓN: Solo usa esta sección si tienes dropdowns que NO SON DE BOOTSTRAP
  // y necesitan ser abiertos/cerrados manualmente.
  // Si tus elementos con ID 'crearTicketDropdown' y 'Reportes' tienen data-bs-toggle,
  // ENTONCES ELIMINA ESTOS BLOQUES, ya que Bootstrap los manejará.

  const customCrearTicketDropdown = document.getElementById(
    "crearTicketDropdown"
  ); // Asumo que este ID existe en tu HTML
  const customCrearTicketMenu = customCrearTicketDropdown
    ? customCrearTicketDropdown.nextElementSibling
    : null;

  if (customCrearTicketDropdown && customCrearTicketMenu) {
    customCrearTicketDropdown.addEventListener("click", function (event) {
      event.preventDefault(); // Mantenemos esto si *no* es un dropdown de Bootstrap
      customCrearTicketMenu.classList.toggle("show");
      this.classList.toggle("active"); // Opcional
    });

    document.addEventListener("click", function (event) {
      if (
        !customCrearTicketDropdown.contains(event.target) &&
        !customCrearTicketMenu.contains(event.target)
      ) {
        customCrearTicketMenu.classList.remove("show");
        customCrearTicketDropdown.classList.remove("active"); // Opcional
      }
    });
  }

  const customReportesDropdown = document.getElementById("Reportes"); // Asumo que este ID existe en tu HTML
  const customReportesMenu = customReportesDropdown
    ? customReportesDropdown.nextElementSibling
    : null;

  if (customReportesDropdown && customReportesMenu) {
    customReportesDropdown.addEventListener("click", function (event) {
      event.preventDefault(); // Mantenemos esto si *no* es un dropdown de Bootstrap
      customReportesMenu.classList.toggle("show");
      this.classList.toggle("active"); // Opcional
    });

    document.addEventListener("click", function (event) {
      if (
        !customReportesDropdown.contains(event.target) &&
        !customReportesMenu.contains(event.target)
      ) {
        customReportesMenu.classList.remove("show");
        customReportesDropdown.classList.remove("active"); // Opcional
      }
    });
  }

  const administracionMenuItem = document.getElementById('administracionMenuItem');

if (administracionMenuItem && administracionUl) {
    // Solo tiene un hijo directo, 'Verificación de Solvencia'. Si está oculto, oculta el padre.
    const verificacionSolvenciaVisible = domiciliacionLink && domiciliacionLink.closest('li').style.display !== 'none';

    if (!verificacionSolvenciaVisible) {
        administracionMenuItem.style.display = 'none';
    } else {
        administracionMenuItem.style.display = 'block';
    }
}
  
  

  // === Lógica de Permisos y Ocultar/Mostrar Navbar ===
  // Asegúrate de que 'id_user' sea un elemento <input> o similar con un valor
  const userIdElement = document.getElementById("id_user");
  const userId = userIdElement ? userIdElement.value : null;

  function HideNavbar() {
    const navbar = document.getElementById("sidenav-main");

    if (!userId) {
      console.log(
        "Usuario no autenticado (ID de usuario no encontrado), ocultando elementos."
      );
      updateNavbar({}); // Ocultar todo si no hay usuario logueado
      if (navbar) navbar.style.display = "block"; // Asegúrate de si debe ser block o none por defecto
      return; // Salir si no hay ID de usuario
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/users/checkStatus`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          const userStatus = response.isVerified;

          if (userStatus && userStatus.id_status === "1") {
            // Suponemos que "1" significa no verificado o requiere acción
            if (navbar) {
              navbar.style.display = "none"; // Oculta la barra de navegación
            } else {
              console.error(
                "La barra de navegación 'sidenav-main' no se encontró en el DOM."
              );
            }
            const newPasswordModalElement =
              document.getElementById("newPasswordModal");
            if (newPasswordModalElement) {
              new bootstrap.Modal(newPasswordModalElement).show();
            } else {
              console.error(
                "El modal 'newPasswordModal' no se encontró en el DOM."
              );
            }
          } else if (userStatus && userStatus.id_status !== "1") {
            // Si el usuario ya está verificado
            if (navbar) {
              navbar.style.display = "block"; // Muestra la barra de navegación
            } else {
              console.error(
                "La barra de navegación 'sidenav-main' no se encontró en el DOM."
              );
            }
          } else {
            // Manejar caso donde userStatus o id_status no son lo esperado
            console.warn("Estado de usuario inesperado:", userStatus);
            if (navbar) navbar.style.display = "block"; // Por defecto, mostrar
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // Swal.fire es una función externa, asegúrate de que SweetAlert2 esté incluido
          if (typeof Swal !== "undefined") {
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al procesar la respuesta del servidor.",
              icon: "error",
              confirmButtonText: "OK",
              color: "black",
            });
          }
        }
      } else {
        console.error(
          "Error al verificar estatus del usuario:",
          xhr.status,
          xhr.statusText
        );
        if (typeof Swal !== "undefined") {
          Swal.fire({
            title: "Error",
            text: "Error de conexión con el servidor al verificar el estatus.",
            icon: "error",
            confirmButtonText: "OK",
            color: "black",
          });
        }
      }
    };
    xhr.onerror = function () {
      console.error("Network Error al verificar estatus del usuario.");
      if (typeof Swal !== "undefined") {
        Swal.fire({
          title: "Error de red",
          text: "No se pudo conectar al servidor.",
          icon: "error",
          confirmButtonText: "OK",
          color: "black",
        });
      }
    };

    const datos = `action=checkStatus&userId=${encodeURIComponent(userId)}`;
    xhr.send(datos);
  }

  function updateNavbar(permissions) {
    function hasPermission(viewName) {
      return permissions?.[viewName] === true;
    }

    // Dropdown "Crear Ticket" (el sub-dropdown bajo "Gestión de Tickets" si tiene id="crearTicketSubDropdown")
    // No hay necesidad de controlar este con JS si tiene data-bs-toggle="dropdown"
    // Los items internos se controlan por permiso
    const crearTicketSubDropdown = document.getElementById(
      "crearTicketSubDropdown"
    );
    const crearTicketSubMenu = crearTicketSubDropdown
      ? crearTicketSubDropdown.nextElementSibling
      : null;

    const soportePosItem = crearTicketSubMenu
      ?.querySelector('a[data-value="Soporte POS"]')
      ?.closest("li");
    const sustitucionPosItem = crearTicketSubMenu
      ?.querySelector('a[data-value="Sustitución de POS"]')
      ?.closest("li");
    const prestamoPosItem = crearTicketSubMenu
      ?.querySelector('a[data-value="Préstamo de POS"]')
      ?.closest("li");
    const desafiliacionPosItem = crearTicketSubMenu
      ?.querySelector('a[data-value="Desafiliación de POS"]')
      ?.closest("li");
    const migracionBancosItem = crearTicketSubMenu
      ?.querySelector('a[data-value="Migración de Bancos"]')
      ?.closest("li");
    const cambioRazonSocialItem = crearTicketSubMenu
      ?.querySelector('a[data-value="Cambio de Razón Social"]')
      ?.closest("li");

    if (soportePosItem) {
      soportePosItem.style.display = hasPermission("Soporte_Pos")
        ? "block"
        : "none";
    }
    if (sustitucionPosItem) {
      sustitucionPosItem.style.display = hasPermission("Sustitucion_Pos")
        ? "block"
        : "none";
    }
    if (prestamoPosItem) {
      prestamoPosItem.style.display = hasPermission("Prestamo_Pos")
        ? "block"
        : "none";
    }
    if (desafiliacionPosItem) {
      desafiliacionPosItem.style.display = hasPermission("Desafiliacion_Pos")
        ? "block"
        : "none";
    }
    if (migracionBancosItem) {
      migracionBancosItem.style.display = hasPermission("Migracion_Bancos")
        ? "block"
        : "none";
    }
    if (cambioRazonSocialItem) {
      cambioRazonSocialItem.style.display = hasPermission("Cambio_RazonSocial")
        ? "block"
        : "none";
    }
    

    // Dropdown "Consultas General" (si existe y tiene ID 'Reportes')
    const consultasDropdown = document.getElementById("Reportes"); // <-- Esto es el ID que usas en tu JS
    const consultasMenu = consultasDropdown
      ? consultasDropdown.nextElementSibling
      : null;

    const consultaRifItem = consultasMenu
      ?.querySelector('a[data-value="Consulta Rif"]')
      ?.closest("li");
    const reportesTicketsItem = consultasMenu
      ?.querySelector('a[data-value="Reportes Tickets"]')
      ?.closest("li");

    if (consultaRifItem) {
      consultaRifItem.style.display = hasPermission("Consulta_Rif")
        ? "block"
        : "none";
    }
    if (reportesTicketsItem) {
      reportesTicketsItem.style.display = hasPermission("Reportes_Tickets")
        ? "block"
        : "none";
    }

    // Muestra/Oculta otros elementos directamente relacionados con permisos
    // Para 'assignment-ticket'
    const assignmentTicketLink = document.getElementById("assignment-ticket");
    if (assignmentTicketLink) {
      const assignmentTicketParentLi = assignmentTicketLink.closest("li");
      if (assignmentTicketParentLi) {
        assignmentTicketParentLi.style.display = hasPermission(
          "asignar_tecnico"
        )
          ? "block"
          : "none";
      }
    }

    // Para 'tecnico'
    const tecnicoLink = document.getElementById("tecnico");
    if (tecnicoLink) {
      const tecnicoParentLi = tecnicoLink.closest("li");
      if (tecnicoParentLi) {
        tecnicoParentLi.style.display = hasPermission("tecnico")
          ? "block"
          : "none";
      }
    }

    // Para 'taller'
    const tallerLink = document.getElementById("taller");
    if (tallerLink) {
      const tallerParentLi = tallerLink.closest("li");
      if (tallerParentLi) {
        tallerParentLi.style.display = hasPermission("taller")
          ? "block"
          : "none";
      }
    }

    // Para 'pendiente_entrega'
    const pendienteEntregaLink = document.getElementById("pendiente_entrega");
    if (pendienteEntregaLink) {
      const pendienteEntregaParentLi = pendienteEntregaLink.closest("li");
      if (pendienteEntregaParentLi) {
        pendienteEntregaParentLi.style.display = hasPermission(
          "pendiente_entrega"
        )
          ? "block"
          : "none";
      }
    }
    // Asegúrate de agregar cualquier otro ID o selector que necesites aquí
  }

      const domiciliacionLink = document.getElementById('domiciliacion');
if (domiciliacionLink) {
    const domiciliacionParentLi = domiciliacionLink.closest('li');
    if (domiciliacionParentLi) {
        domiciliacionParentLi.style.display = hasPermission('Verificacion_Solvencia') ? 'block' : 'none';
    }
}

  // === Ejecución al cargar el DOM ===
  HideNavbar(); // Llama a la función para verificar el estatus del usuario al cargar la página
});*/

// === Evento para redimensionar la ventana (Fuera de DOMContentLoaded) ===
// Este listener no necesita estar dentro de DOMContentLoaded ya que se ejecuta solo una vez.
window.addEventListener("resize", function () {
  const sidenav = document.getElementById("sidenav-main");
  const body = document.querySelector("body");
  if (window.innerWidth > 1199) {
    if (sidenav) sidenav.classList.remove("active");
    if (body) body.classList.remove("sidenav-open");
  } else if (sidenav && body && !body.classList.contains("sidenav-open")) {
    sidenav.classList.remove("active"); // Asegura que esté oculto en mobile si no está abierto
  }
});

