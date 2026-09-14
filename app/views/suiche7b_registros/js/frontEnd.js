// Modulo "Afiliaciones Suiche 7B": listado de comercios ya afiliados por
// Inteligensa. Reutiliza el mismo endpoint que ya usaba el modal en
// consulta_rif (api/consulta/GetSuiche7BRegistros).

function cargarListadoSuiche7B(search) {
  const loading = document.getElementById("suiche7bListadoLoading");
  const table = document.getElementById("suiche7bListadoTable");
  const tbody = document.getElementById("suiche7bListadoTbody");
  if (tbody) tbody.innerHTML = "";
  if (table) table.style.display = "none";
  if (loading) {
    loading.textContent = "Cargando afiliaciones...";
    loading.style.display = "block";
  }

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetSuiche7BRegistros?search=${encodeURIComponent(search || "")}`);
  xhr.onload = function () {
    try {
      const response = JSON.parse(xhr.responseText);
      if (response.success && response.registros && response.registros.length > 0) {
        if (tbody) {
          response.registros.forEach((reg) => {
            const tr = document.createElement("tr");
            const celdas = [
              reg.rif,
              reg.razon_social,
              reg.banco,
              reg.seriales,
              reg.telefono_afiliacion,
              reg.agente,
              reg.creado_en ? new Date(reg.creado_en).toLocaleString("es-VE") : "",
            ];
            celdas.forEach((valor) => {
              const td = document.createElement("td");
              td.textContent = valor || "—";
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
        }
        if (loading) loading.style.display = "none";
        if (table) table.style.display = "table";
      } else if (loading) {
        loading.textContent = "No hay afiliaciones registradas todavía.";
      }
    } catch (e) {
      if (loading) loading.textContent = "No se pudo cargar el listado.";
    }
  };
  xhr.onerror = function () {
    if (loading) loading.textContent = "No se pudo cargar el listado.";
  };
  xhr.send();
}

document.addEventListener("DOMContentLoaded", function () {
  const buscarBtn = document.getElementById("suiche7bListadoBuscarBtn");
  const buscarInput = document.getElementById("suiche7bListadoBuscar");

  if (buscarBtn) {
    buscarBtn.addEventListener("click", () => {
      cargarListadoSuiche7B(buscarInput ? buscarInput.value.trim() : "");
    });
  }
  if (buscarInput) {
    buscarInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        cargarListadoSuiche7B(buscarInput.value.trim());
      }
    });
  }

  cargarListadoSuiche7B("");
});
