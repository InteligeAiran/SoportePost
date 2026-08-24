function formatFecha(fechaStr) {
  if (!fechaStr) return "Sin conexión registrada";
  const fecha = new Date(fechaStr.replace(" ", "T"));
  if (isNaN(fecha.getTime())) return fechaStr;
  return fecha.toLocaleString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statCard(etiqueta, valor) {
  return `
    <div class="detalle-stat-card">
      <h6>${etiqueta}</h6>
      <p>${valor}</p>
    </div>
  `;
}

function iniciales(nombreCompleto) {
  return nombreCompleto
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join("");
}

function mostrarDetalleConexion(usuario) {
  const panel = document.getElementById("detalle-conexion-panel");
  panel.innerHTML = `
    <div class="d-flex align-items-center gap-3 mb-3">
      <div class="perfil-avatar">${iniciales(usuario.full_name)}</div>
      <div>
        <h5 class="mb-1" style="color: black;">${usuario.full_name}</h5>
        <span class="perfil-rol-badge">${usuario.name_rol}</span>
      </div>
    </div>
    ${statCard("Usuario", usuario.usuario)}
    ${statCard("Correo", usuario.correo || "-")}
    ${statCard("Última Conexión", formatFecha(usuario.ultima_conexion))}
    ${statCard("IP", usuario.ultima_ip || "-")}
  `;
}

function cargarUsuariosMonitoreo() {
  const tbody = document.getElementById("tabla-monitoreo-usuarios-body");
  tbody.innerHTML = "";

  if ($.fn.DataTable.isDataTable("#tabla-monitoreo-usuarios")) {
    $("#tabla-monitoreo-usuarios").DataTable().destroy();
  }

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/users/GetUsuariosMonitoreo`);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (!response.success) {
          tbody.innerHTML = `<tr><td colspan="5">${response.message || "Error al cargar los usuarios"}</td></tr>`;
          return;
        }

        // No se inserta ninguna fila manual para el caso vacío: se deja el
        // tbody real vacío y DataTables muestra su propio "emptyTable".
        // Insertar una fila con colspan aquí y luego inicializar DataTables
        // rompe el conteo de columnas (provoca su warning "unknown parameter").
        response.usuarios.forEach((usuario) => {
          const row = tbody.insertRow();
          row.style.cursor = "pointer";
          row.insertCell().textContent = usuario.full_name;
          row.insertCell().textContent = usuario.usuario;
          row.insertCell().textContent = usuario.name_rol;
          row.insertCell().textContent = formatFecha(usuario.ultima_conexion);

          const accionesCell = row.insertCell();
          const btnVerAcciones = document.createElement("button");
          btnVerAcciones.type = "button";
          btnVerAcciones.className = "btn btn-sm btn-primary";
          btnVerAcciones.textContent = "Ver Acciones";
          btnVerAcciones.onclick = function (e) {
            e.stopPropagation();
            verAccionesUsuario(usuario.id_user, usuario.full_name);
          };
          accionesCell.appendChild(btnVerAcciones);

          // Click en cualquier parte de la fila (fuera del botón) muestra
          // el correo/última conexión/IP en el panel de la derecha.
          row.addEventListener("click", () => mostrarDetalleConexion(usuario));
        });

        $("#tabla-monitoreo-usuarios").DataTable({
          responsive: true,
          pagingType: "simple_numbers",
          lengthMenu: [5, 10, 25],
          language: {
            lengthMenu: "Mostrar _MENU_ registros",
            emptyTable: "No hay usuarios disponibles",
            zeroRecords: "No se encontraron resultados para la búsqueda",
            info: "Mostrando página _PAGE_ de _PAGES_ ( _TOTAL_ registro(s) )",
            infoEmpty: "No hay datos disponibles",
            infoFiltered: "(Filtrado de _MAX_ datos disponibles)",
            search: "Buscar:",
            paginate: {
              first: "Primero",
              last: "Último",
              next: "Siguiente",
              previous: "Anterior",
            },
          },
        });
      } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5">Error al procesar la respuesta</td></tr>';
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 403) {
      tbody.innerHTML = '<tr><td colspan="5">No autorizado para ver este módulo.</td></tr>';
    } else {
      tbody.innerHTML = `<tr><td colspan="5">Error de conexión (código ${xhr.status})</td></tr>`;
      console.error("GetUsuariosMonitoreo error", xhr.status, xhr.responseText);
    }
  };

  xhr.onerror = function () {
    tbody.innerHTML = '<tr><td colspan="5">Error de red</td></tr>';
  };

  xhr.send();
}

const ACCION_BADGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4 1a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m0 5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5M4 8a1 1 0 0 0 1 1h6a1 1 0 1 0 0-2H5a1 1 0 0 0-1 1"/></svg>`;
const DOCUMENTO_BADGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zm0-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zm0-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1z"/></svg>`;

// El "estatus" solo es un estado real de ticket (Abierto/En proceso/Cerrado)
// para eventos tipo "accion"; en eventos tipo "documento" ese mismo campo
// trae el nombre del archivo, así que no se colorea.
function getEstatusBadgeClass(accion) {
  if (accion.tipo === "documento") return null;
  const estatus = (accion.estatus || "").toLowerCase();
  if (estatus.includes("cerrado")) return "accion-estatus-cerrado";
  if (estatus.includes("proceso")) return "accion-estatus-proceso";
  if (estatus.includes("abierto")) return "accion-estatus-abierto";
  if (estatus.includes("rechaz") || estatus.includes("cancel")) return "accion-estatus-rechazado";
  return "accion-estatus-neutro";
}

function verAccionesUsuario(id_user, nombreCompleto) {
  // Se usa SweetAlert2 en vez de un modal de Bootstrap: el proyecto no
  // carga ninguna hoja de estilos de Bootstrap (siempre está comentada en
  // todas las vistas), así que un .modal de Bootstrap sale sin fondo ni
  // backdrop. SweetAlert2 trae su propio estilo completo y es el patrón
  // que ya usa el resto de la app para todos sus diálogos.
  Swal.fire({
    // Sin "title": el header real va como HTML propio dentro de "html"
    // (barra de color, ver .acciones-swal-header), porque el título plano
    // de SweetAlert2 se veía como si fuera parte del texto de la
    // descripción de abajo.
    html: `
      <div class="acciones-swal-header">Acciones sobre tickets — ${nombreCompleto}</div>
      <div class="acciones-swal-body">
        <p class="text-muted small text-start">Incluye cambios de estatus sobre tickets (crear, aprobar, entregar, etc.) y cargas de documentos de Envío, Envío a Destino y Presupuesto. No cubre otras acciones del sistema fuera del flujo de tickets.</p>
        <input type="text" id="filtro-ticket-input" class="form-control mb-2" placeholder="Buscar por número de ticket..." style="display: none;">
        <div id="acciones-usuario-container" style="max-height: 55vh; overflow-y: auto; text-align: left;">
          <p class="text-center text-muted">Cargando...</p>
        </div>
      </div>
    `,
    width: "700px",
    color: "black",
    confirmButtonText: "Cerrar",
    confirmButtonColor: "#003594",
    focusConfirm: false,
    customClass: {
      popup: "acciones-swal-popup",
      container: "acciones-swal-container",
    },
    didOpen: () => {
      cargarAccionesUsuario(id_user);
    },
  });
}

function cargarAccionesUsuario(id_user) {
  const container = document.getElementById("acciones-usuario-container");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/users/GetAccionesUsuario`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (!response.success) {
          container.innerHTML = `<p class="text-center text-muted">${response.message || "Error al cargar las acciones"}</p>`;
          return;
        }

        if (response.acciones.length === 0) {
          container.innerHTML = '<p class="text-center text-muted">Este usuario no tiene acciones registradas sobre tickets.</p>';
          return;
        }

        // Mismo lenguaje visual que el historial de tickets del dashboard
        // (badge + tarjeta), pero agrupado por ticket: cada ticket es su
        // propia sección con encabezado, y adentro un timeline solo con
        // sus eventos (en vez de una sola lista larga mezclando tickets).
        const totalDocumentos = response.acciones.filter((a) => a.tipo === "documento").length;
        const totalAcciones = response.acciones.length - totalDocumentos;

        // response.acciones ya viene ordenado por fecha DESC desde el
        // backend, así que el Map queda naturalmente ordenado por el
        // ticket con el evento más reciente primero.
        const grupos = new Map();
        response.acciones.forEach((accion) => {
          if (!grupos.has(accion.nro_ticket)) {
            grupos.set(accion.nro_ticket, []);
          }
          grupos.get(accion.nro_ticket).push(accion);
        });

        // Un usuario activo puede fácilmente tener acciones sobre 20-30
        // tickets distintos — con todos los grupos expandidos a la vez el
        // modal se vuelve una lista imposible de recorrer. Se colapsan
        // todos menos el primero (el ticket con la acción más reciente),
        // igual que el patrón "timeline-collapsible" que ya usa el
        // historial de tickets del dashboard, y se agrega un buscador por
        // número de ticket cuando hay varios.
        const gruposHtml = Array.from(grupos.entries())
          .map(([nroTicket, eventos], index) => {
            const itemsTicket = eventos
              .map((accion) => {
                const esDocumento = accion.tipo === "documento";
                const badge = esDocumento ? DOCUMENTO_BADGE_SVG : ACCION_BADGE_SVG;
                const badgeClase = esDocumento ? "accion-badge accion-badge-documento" : "accion-badge";
                const claseEstatus = getEstatusBadgeClass(accion);
                const estatusHtml = claseEstatus
                  ? `<span class="accion-estatus-badge ${claseEstatus}">${accion.estatus || "-"}</span>`
                  : `${accion.estatus || "-"}`;
                return `
                  <li>
                    <div class="${badgeClase}">${badge}</div>
                    <div class="accion-card">
                      <div class="accion-card-header">
                        <small>${formatFecha(accion.fecha)}</small>
                      </div>
                      <div class="accion-titulo">${accion.accion || "-"}</div>
                      <div class="accion-subtexto">${esDocumento ? "📎 " : ""}${estatusHtml}</div>
                    </div>
                  </li>
                `;
              })
              .join("");

            const expandido = index === 0;
            return `
              <div class="ticket-grupo" data-nro-ticket="${nroTicket}">
                <div class="ticket-grupo-header${expandido ? " expandido" : ""}">
                  <span class="accion-ticket-pill">Ticket ${nroTicket}</span>
                  <span class="ticket-grupo-count">${eventos.length} evento(s)</span>
                  <span class="ticket-grupo-chevron">▾</span>
                </div>
                <ul class="accion-timeline" style="${expandido ? "" : "display: none;"}">${itemsTicket}</ul>
              </div>
            `;
          })
          .join("");

        const resumen = `
          <div class="acciones-resumen">
            <span>${grupos.size} ticket(s)</span>
            <span>${totalAcciones} cambio(s) de estatus</span>
            <span>${totalDocumentos} documento(s) cargado(s)</span>
          </div>
        `;

        container.innerHTML = `${resumen}${gruposHtml}`;

        container.querySelectorAll(".ticket-grupo-header").forEach((header) => {
          header.addEventListener("click", () => {
            const lista = header.nextElementSibling;
            const abierto = header.classList.toggle("expandido");
            lista.style.display = abierto ? "" : "none";
          });
        });

        // Con muchos tickets, dejar el buscador visible para saltar
        // directo al que se necesita en vez de colapsar/expandir uno por
        // uno.
        const filtroInput = document.getElementById("filtro-ticket-input");
        if (grupos.size > 5) {
          filtroInput.style.display = "";
          filtroInput.value = "";
          filtroInput.oninput = () => {
            const filtro = filtroInput.value.trim().toLowerCase();
            container.querySelectorAll(".ticket-grupo").forEach((grupo) => {
              const coincide = grupo.dataset.nroTicket.toLowerCase().includes(filtro);
              grupo.style.display = coincide ? "" : "none";
              if (coincide && filtro) {
                grupo.querySelector(".ticket-grupo-header").classList.add("expandido");
                grupo.querySelector(".accion-timeline").style.display = "";
              }
            });
          };
        } else {
          filtroInput.style.display = "none";
        }
      } catch (error) {
        container.innerHTML = '<p class="text-center text-muted">Error al procesar la respuesta</p>';
        console.error("Error parsing JSON:", error);
      }
    } else {
      container.innerHTML = `<p class="text-center text-muted">Error de conexión (código ${xhr.status})</p>`;
      console.error("GetAccionesUsuario error", xhr.status, xhr.responseText);
    }
  };

  xhr.onerror = function () {
    container.innerHTML = '<p class="text-center text-muted">Error de red</p>';
  };

  xhr.send(`id_user=${encodeURIComponent(id_user)}`);
}

document.addEventListener("DOMContentLoaded", cargarUsuariosMonitoreo);
