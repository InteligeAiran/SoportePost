/**
 * Genera el HTML de los iconos SVG basado en el nombre del módulo/submódulo.
 * @param {string} name El nombre del módulo o submódulo.
 * @returns {string} El string SVG del icono.
 */
function getIconSvgForName(name) {
  let iconSvg = "";
  switch (name) {
    case "Inicio":
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill me-2" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.505a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/></svg>`;
      break;
    case "Gestión de Tickets":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ticket-fill me-2" viewBox="0 0 16 16"><path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3z"/></svg>';
      break;
    case "Consultas y Reportes":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search me-2" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>';
      break;
    case "Administración":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>';
      break;
    case "Configuración":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill me-2" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg>';
      break;
    case "Crear Ticket":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square-fill me-2" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/></svg>';
      break;
    case "Gestión Coordinador":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill me-2" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm-3-1s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm-4-5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m11 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/></svg>';
      break;
    case "Gestión Técnicos":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-workspace me-2" viewBox="0 0 16 16"><path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/><path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"/></svg>';
      break;
    case "Gestión Taller":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools me-2" viewBox="0 0 16 16"><path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529.026z"/></svg>';
      break;
    case "Gestión Rosal":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck-front-fill me-2" viewBox="0 0 16 16"><path d="M3.5 0A2.5 2.5 0 0 0 1 2.5v9c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2v-9A2.5 2.5 0 0 0 12.5 0zM3 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.9c0 .625-.562 1.092-1.17.994C10.925 7.747 9.208 7.5 8 7.5s-2.925.247-3.83.394A1.008 1.008 0 0 1 3 6.9zm1 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2m8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2m-5-2h2a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2"/></svg>';
      break;
    case "Consulta General": // Este es un submódulo pero tiene sus propios subsubmódulos
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search me-2" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>';
      break;
    case "Verificación de Solvencia":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>';
      break;
    case "Gestión Usuario":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-gear me-2" viewBox="0 0 16 16"><path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/></svg>';
      break;
    case "Gestión Comercial":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-coin me-2" viewBox="0 0 16 16"><path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/></svg>';
      break;
    case "Centro de Solicitudes":
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-briefcase-fill me-2" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5"/><path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z"/></svg>'
      break;
    case "Gestión Regiones":
      iconSvg ='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe-americas me-2" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z"/></svg>'
    break
    case "Consulta Rif":
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-vcard-fill me-2" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9 1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5M9 8a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4A.5.5 0 0 0 9 8m1 2.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5m-1 2C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 0 2 13h6.96q.04-.245.04-.5M7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0"/></svg>'
    break;
    case "Reporte Ticket":
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ticket-detailed-fill me-2" viewBox="0 0 16 16"><path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4 1a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m0 5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5M4 8a1 1 0 0 0 1 1h6a1 1 0 1 0 0-2H5a1 1 0 0 0-1 1"/></svg>'
    break;
    case "Documentos":
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive-fill me-2" viewBox="0 0 16 16"><path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z"/></svg>'
    break;
    case "Periférico POS":
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-seam-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003zM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461z"/></svg>';
    break;
    case "Cerrar Sesión":
    iconSvg ='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/><path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/></svg>';
    break;
    case "Sustitución de POS":
    case "Préstamo de POS":
    case "Desafiliación de POS":
    case "Migración de Bancos":
    case "Cambio de Razón Social":
    default:
      iconSvg = "";
  }
  return iconSvg;
}

/**
 * Función genérica refactorizada para manejar dropdowns personalizados.
 * Ahora, cuando un dropdown se abre, verifica si debe cargar dinámicamente sus hijos.
 * @param {HTMLElement} toggleElement El elemento que activa el dropdown (ej. un <a>).
 * @param {HTMLElement} menuElement El menú desplegable (ej. un <ul>) asociado al toggle.
 * @param {string} [moduleId=null] El ID del módulo padre para la carga de submódulos, si aplica.
 */
function setupCustomDropdown(toggleElement, menuElement, moduleId = null) {
  if (!toggleElement || !menuElement) {
    console.warn(
      "setupCustomDropdown: Elementos toggle o menu no encontrados.",
      { toggleElement, menuElement }
    );
    return;
  }

  // Evitar adjuntar múltiples listeners al mismo elemento
  // Se usa removeEventListener para limpiar si se vuelve a llamar para el mismo elemento (ej. en recarga)
  toggleElement.removeEventListener("click", toggleHandler);
  document.removeEventListener("click", closeHandler); // Eliminar el listener global para este menú específico antes de añadirlo de nuevo

  // Handler para el clic en el elemento que activa el dropdown
  function toggleHandler(event) {
    event.preventDefault();
    event.stopPropagation(); // Evita que el clic se propague al document y cierre otros menús inmediatamente

    // Cierra otros dropdowns abiertos, excepto los padres del actual
    document.querySelectorAll(".dropdown-menu.show").forEach((openMenu) => {
      // Cierra solo si no es el menú actual, ni un padre del menú actual, ni un hijo del menú actual
      if (
        openMenu !== menuElement &&
        !menuElement.contains(openMenu) &&
        !openMenu.contains(menuElement)
      ) {
        openMenu.classList.remove("show");
        const relatedToggle = openMenu.previousElementSibling;
        if (relatedToggle) {
          relatedToggle.classList.remove("active");
          relatedToggle.setAttribute("aria-expanded", "false");
        }
      }
    });

    // Alterna la visibilidad del menú actual
    menuElement.classList.toggle("show");
    toggleElement.classList.toggle("active");
    toggleElement.setAttribute(
      "aria-expanded",
      menuElement.classList.contains("show")
    );

    // Si el menú se acaba de abrir Y tiene un moduleId asociado
    // Y sus submódulos no han sido cargados aún (controlado por data-submodules-loaded)
    if (
      menuElement.classList.contains("show") &&
      moduleId &&
      menuElement.dataset.submodulesLoaded !== "true"
    ) {
      //console.log(`🎯 CLICK EN DROPDOWN - Iniciando carga de submódulos para módulo ID: ${moduleId}`);
      loadSubmodulesForModule(moduleId, menuElement);
    } else if (menuElement.dataset.submodulesLoaded === "true") {
      //console.log(`🎯 CLICK EN DROPDOWN - Submódulos ya cargados para módulo ID: ${moduleId}`);
    }

    // Asegura que los menús padres permanezcan abiertos y activos (o se abran si estaban cerrados)
    let currentParentMenu = toggleElement.closest(".dropdown-menu");
    while (currentParentMenu) {
      currentParentMenu.classList.add("show");
      const parentToggle = currentParentMenu.previousElementSibling;
      if (parentToggle) {
        parentToggle.classList.add("active");
        parentToggle.setAttribute("aria-expanded", "true");
      }
      currentParentMenu =
        currentParentMenu.closest("li.dropend")?.closest(".dropdown-menu") ||
        currentParentMenu
          .closest("li.nav-item.dropdown")
          ?.closest(".dropdown-menu");
    }
  }

  // Handler para cerrar el dropdown cuando se hace clic fuera
  function closeHandler(event) {
    if (
      !toggleElement.contains(event.target) &&
      !menuElement.contains(event.target)
    ) {
      menuElement.classList.remove("show");
      toggleElement.classList.remove("active");
      toggleElement.setAttribute("aria-expanded", "false");
    }
  }

  toggleElement.addEventListener("click", toggleHandler);
  document.addEventListener("click", closeHandler);
}

/**
 * Construye y retorna un elemento LI con su ANCHOR y posibles iconos.
 * Se utiliza para módulos, submódulos y sub-submódulos.
 * IMPORTANTE: No adjunta data-bs-toggle o aria-expanded aquí, eso lo maneja setupCustomDropdown.
 * @param {object} itemData Datos del elemento.
 * @param {string} type Tipo de elemento ('module', 'submodule', 'subsubmodule').
 * @returns {HTMLLIElement} El elemento LI construido.
 */
function buildMenuItem(itemData, type) {
  const listItem = document.createElement("li");
  const anchor = document.createElement("a");

  let itemName = "";
  let itemUrl = "#"; // Default URL, adjust as needed
  let iconHtml = "";

  if (type === "module") {
    itemName = itemData.desc_modulo;
    iconHtml = getIconSvgForName(itemName);

    listItem.className = "nav-item";
    // Remove dropdown related classes/attributes for now
    anchor.className = "nav-link d-flex align-items-center"; // No dropdown-toggle
    anchor.id = `module-link-${itemData.idmodulo}`;
    anchor.href = `#${itemName.toLowerCase().replace(/\s+/g, "-")}`; // Example: #gestion-de-tickets

    const heading = document.createElement("h6");
    heading.className = "nav-link-text ms-3";
    heading.style.color = "white";
    heading.style.margin = "0";
    heading.textContent = itemName;

    anchor.innerHTML = iconHtml;
    anchor.appendChild(heading);
  }
  // No 'submodule' or 'subsubmodule' type handling for this simplified version

  listItem.appendChild(anchor);
  return listItem;
}

function buildMenuItem(itemData, type) {
  const listItem = document.createElement("li");
  const anchor = document.createElement("a");

  const itemName =
    itemData.name_module ||
    itemData.name_sub_module ||
    itemData.name_subsub_module ||
    "";
  const safeName = itemName.toLowerCase().replace(/[^a-z0-9]/g, "");

  let itemUrl = "#";

  if (type === "module") {
    listItem.className = "nav-item dropdown mt-3";
    anchor.className = "nav-link dropdown-toggle d-flex align-items-center";
    anchor.id = `${safeName}Dropdown`;
    itemUrl = itemData.url_module || "#";

    const heading = document.createElement("h6");
    heading.style.color = "white";
    heading.style.margin = "0";
    /*heading.style.paddingLeft = '.5rem';*/
    heading.className = "flex-grow-1";
    heading.textContent = itemName;
    anchor.innerHTML = itemData.icon_svg || getIconSvgForName(itemName);
    anchor.appendChild(heading);

    // Almacena el ID del módulo en el LI para futura referencia
    listItem.setAttribute("data-module-id", itemData.id_module);
  } else if (type === "submodule") {
    anchor.className = "dropdown-item";
    anchor.id = `${safeName}SubDropdown`;
    itemUrl = itemData.url_sub_module || "#";
    anchor.innerHTML = itemData.icon_svg || getIconSvgForName(itemName);
    anchor.innerHTML += itemName;

    if (itemData.subsub_modules && itemData.subsub_modules.length > 0) {
      listItem.classList.add("dropend");
      anchor.classList.add("dropdown-toggle");

      const dropdownIndicator = document.createElement("span");
      dropdownIndicator.className = "dropdown-indicator ms-auto";
      // Asegúrate de que la clase 'dropdown-arrow' esté aquí
      dropdownIndicator.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right dropdown-arrow m-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>';

      anchor.appendChild(dropdownIndicator);
    }
  } else if (type === "subsubmodule") {
    anchor.className = "dropdown-item";
    itemUrl = itemData.url_subsub_module || "#";
    anchor.textContent = itemName;
    anchor.setAttribute("data-value", itemName);
  }

  anchor.href = itemUrl;
  listItem.appendChild(anchor);
  return listItem;
}

/**
 * Construye un menú desplegable (UL) con los elementos de sub-nivel.
 * @param {Array} items Array de submódulos o sub-submódulos.
 * @param {string} parentAnchorId ID del ancla padre (ej. "gestionTicketsDropdown").
 * @param {string} itemType Tipo de elementos a construir ('submodule' o 'subsubmodule').
 * @returns {HTMLUListElement} El elemento UL del menú desplegable.
 */
function buildDropdownMenu(items, parentAnchorId, itemType) {
  const ul = document.createElement("ul");
  ul.className = "dropdown-menu";
  ul.setAttribute("aria-labelledby", parentAnchorId);

  items.forEach((item) => {
    const li = buildMenuItem(item, itemType);

    if (
      itemType === "submodule" &&
      item.subsub_modules &&
      item.subsub_modules.length > 0
    ) {
      const subSubUl = buildDropdownMenu(
        item.subsub_modules,
        li.querySelector("a").id,
        "subsubmodule"
      );
      li.appendChild(subSubUl);
      // IMPORTANTE: Inicializar dropdowns para los submódulos que tienen sub-submódulos
      setupCustomDropdown(li.querySelector("a"), subSubUl);
    }
    ul.appendChild(li);
  });
  return ul;
}

/**
 * Realiza la carga dinámica de submódulos y sub-submódulos para un módulo dado.
 * Se espera una respuesta JSON con un array 'sub_modules'.
 * @param {string} moduleId El ID del módulo principal cuyos submódulos se cargarán.
 * @param {HTMLUListElement} targetUlElement El elemento <ul> donde se insertarán los submódulos.
 */

function loadSubmodulesForModule(moduleId, targetUlElement) {
  // Verifica si los submódulos ya fueron cargados para evitar peticiones redundantes
  if (targetUlElement.dataset.submodulesLoaded === "true") {
    //console.log(`🔄 Submódulos para el módulo ${moduleId} ya cargados.`);
    return;
  }

 // console.log(`🔍 SOLICITANDO SUBMÓDULOS para módulo ID: ${moduleId}`);
  targetUlElement.innerHTML =
    '<div class="p-2 text-white-50">Cargando submódulos...</div>';

  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/getSubmodulesForModule`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
       // console.log(`📡 Respuesta recibida para módulo ${moduleId}:`, response);

        // AQUÍ ESTÁ EL CAMBIO CLAVE: Usa 'response.submodules' en lugar de 'response.sub_modules'
        if (response.success && Array.isArray(response.submodules)) {
          // <-- CAMBIO AQUÍ
          targetUlElement.innerHTML = ""; // Limpia el mensaje de carga
          if (response.submodules.length === 0) {
            // <-- Y AQUÍ
            //console.log(`📭 No hay submódulos disponibles para módulo ${moduleId}`);
            targetUlElement.innerHTML =
              '<div class="p-2 text-white-50">No hay submódulos disponibles.</div>';
          } else {
            //console.log(`📋 Cargando ${response.submodules.length} submódulos para módulo ${moduleId}:`);
            // Construye los submódulos y sus posibles sub-submódulos
            response.submodules.forEach((sub_module, index) => {
              // <-- Y AQUÍ
              //console.log(`  📦 Submódulo ${index + 1}: "${sub_module.desc_submodulo || sub_module.name_sub_module || 'Sin nombre'}" (ID: ${sub_module.id_submodulo || sub_module.id_sub_module || 'N/A'})`);
              const li = buildMenuItem(sub_module, "submodule");
              targetUlElement.appendChild(li);
              //console.log(`  ✅ Submódulo "${sub_module.desc_submodulo || sub_module.name_sub_module || 'Sin nombre'}" - LISTO`);

              // Si este submódulo tiene sub-submódulos, inicializa su dropdown
              if (
                sub_module.subsub_modules &&
                sub_module.subsub_modules.length > 0
              ) {
                //console.log(`    🔗 Submódulo tiene ${sub_module.subsub_modules.length} sub-submódulos`);
                const subSubUl = buildDropdownMenu(
                  sub_module.subsub_modules,
                  li.querySelector("a").id,
                  "subsubmodule"
                );
                li.appendChild(subSubUl);
                // Inicializar el dropdown para este submódulo con sub-submódulos
                setupCustomDropdown(li.querySelector("a"), subSubUl);
              }
            });
            //console.log(`🎉 TODOS LOS SUBMÓDULOS cargados para módulo ${moduleId}`);
          }
          targetUlElement.dataset.submodulesLoaded = "true"; // Marca como cargado
        } else {
          console.error(
            "❌ Formato de respuesta inválido para submódulos: Se esperaba 'success: true' y un array 'submodules'.",
            response
          ); // Actualiza el mensaje de error para reflejar el nombre correcto
          targetUlElement.innerHTML =
            '<div class="p-2 text-danger">Error al cargar submódulos.</div>';
          if (typeof Swal !== "undefined") {
            Swal.fire({
              title: "Error",
              text: "Formato de respuesta de submódulos inesperado.",
              icon: "error",
              confirmButtonText: "OK",
              color: "black",
            });
          }
        }
      } catch (error) {
        console.error(
          "❌ Error al analizar la respuesta JSON de submódulos:",
          error
        );
        targetUlElement.innerHTML =
          '<div class="p-2 text-danger">Error al procesar datos.</div>';
        if (typeof Swal !== "undefined") {
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar los submódulos del servidor.",
            icon: "error",
            confirmButtonText: "OK",
            color: "black",
          });
        }
      }
    } else {
      console.error(
        `❌ Error al obtener submódulos para el módulo ${moduleId}: ${xhr.status} ${xhr.statusText}`
      );
      targetUlElement.innerHTML = `<div class="p-2 text-danger">Error ${xhr.status} al cargar.</div>`;
      if (typeof Swal !== "undefined") {
        Swal.fire({
          title: "Error",
          text: `Error de conexión con el servidor al cargar submódulos: ${xhr.status}`,
          icon: "error",
          confirmButtonText: "OK",
          color: "black",
        });
      }
    }
  };

  xhr.onerror = function () {
    console.error("❌ Network Error al cargar los submódulos.");
    targetUlElement.innerHTML =
      '<div class="p-2 text-danger">Error de red.</div>';
    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "Error de red",
        text: "No se pudo conectar al servidor para cargar los submódulos.",
        icon: "error",
        confirmButtonText: "OK",
        color: "black",
      });
    }
  };

  const datos = `action=getSubmodulesForModule&id_module=${encodeURIComponent(
    moduleId
  )}`;
  //console.log(`📤 Enviando petición para módulo ${moduleId}:`, datos);
  xhr.send(datos);
}

/**
 * Fetches main modules and initializes their custom dropdowns.
 */
async function loadFullNavbar(options = {}) {
    const {
        method = "POST",
        apiPath = "api/consulta/getModulesUsers", // This endpoint returns main modules
    } = options;

    const navbarNav = document.getElementById("main-navbar-nav");
    if (!navbarNav) {
        console.error(
            "Elemento con ID 'main-navbar-nav' no encontrado. No se puede poblar la barra de navegación."
        );
        hideLoadingOverlay();
        return;
    }

    const id_usuario_element = document.getElementById("id_user");
    if (!id_usuario_element) {
        console.error(
            "Elemento con ID 'id_user' no encontrado. Asegúrate de que existe en tu HTML."
        );
        hideLoadingOverlay();
        return;
    }
    const id_usuario = id_usuario_element.value;

    // Limpiar navbar y agregar elementos estáticos
    navbarNav.innerHTML = "";
    updateLoadingProgress(10, 'Preparando navegación...');
    
    // Agregar "Inicio"
    const inicioLi = document.createElement("li");
    inicioLi.className = "nav-item";
    inicioLi.id = "inicio-link";
    const inicioAnchor = document.createElement("a");
    inicioAnchor.className = "nav-link";
    inicioAnchor.href = "dashboard";
    inicioAnchor.innerHTML =
        getIconSvgForName("Inicio") +
        '<h6 class="nav-link-text ms-3" style="color:white; margin:0; padding-left:.5rem;">Inicio</h6>';
    inicioLi.appendChild(inicioAnchor);
    navbarNav.appendChild(inicioLi);

    const hrAfterInicio = document.createElement("hr");
    hrAfterInicio.className = "horizontal dark my-3";
    navbarNav.appendChild(hrAfterInicio);

    updateLoadingProgress(20, 'Cargando módulos principales...');

    try {
        const url = `${ENDPOINT_BASE}${APP_PATH}${apiPath}`;
        const body = new URLSearchParams({
            action: "getModulesUsers",
            id_usuario: id_usuario,
        });

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body,
        });

        // Función auxiliar para agregar el botón "Cerrar Sesión"
        const addLogoutButton = () => {
            updateLoadingProgress(85, 'Agregando opciones finales...');

            // Agregar "Cerrar Sesión" al final
            const logoutLi = document.createElement("li");
            logoutLi.className = "nav-item";
            const logoutAnchor = document.createElement("a");
            logoutAnchor.className = "nav-link";
            logoutAnchor.id = "cerrar-session-link";
            logoutAnchor.href = "cerrar_session";

            const logoutIcon = getIconSvgForName("Cerrar Sesión");
            const logoutText = document.createElement("h6");
            logoutText.className = "nav-link-text ms-3";
            logoutText.textContent = "Cerrar Sesión";
            logoutText.style.color = "white";
            logoutText.style.margin = "11%";
            logoutText.style.paddingLeft = ".5rem";

            logoutAnchor.innerHTML = logoutIcon;
            logoutAnchor.appendChild(logoutText);
            logoutLi.appendChild(logoutAnchor);
            navbarNav.appendChild(logoutLi);
        };

        // Intentar parsear la respuesta JSON
        let data;
        try {
            data = await response.json();
        } catch (e) {
            // Si no se puede parsear, lanzar error
            if (!response.ok) {
                throw new Error(`Error al obtener módulos: ${response.status} ${response.statusText}`);
            }
            throw new Error("Error al procesar la respuesta del servidor.");
        }

        updateLoadingProgress(40, 'Procesando módulos...');

        // Verificar si el usuario no tiene módulos asignados (404 o success: false)
        if ((!response.ok && response.status === 404) || (data && !data.success && data.message)) {
            if (data.message && data.message.includes("No hay módulos disponibles")) {
                updateLoadingProgress(100, 'Finalizando...');
                setTimeout(() => {
                    hideLoadingOverlay();
                }, 1000);
                
                // Agregar el botón "Cerrar Sesión" incluso sin módulos
                addLogoutButton();
                
                if (typeof Swal !== "undefined") {
                    Swal.fire({
                        title: "Sin módulos asignados",
                        text: "No tiene módulos asignados. Por favor, contacte al administrador del sistema.",
                        icon: "info",
                        confirmButtonText: "OK",
                        color: "black",
                    });
                }
                return;
            }
        }

        if (!response.ok) {
            throw new Error(`Error al obtener módulos: ${response.status} ${response.statusText}`);
        }

        if (data.success && Array.isArray(data.modules)) {
            const modulesData = data.modules.filter(module => module.activo === "t");
            const totalModules = modulesData.length;
            
            updateLoadingProgress(50, `Cargando ${totalModules} módulos...`);

            // Cargar módulos secuencialmente con delay
            //console.log(`🚀 INICIANDO CARGA SECUENCIAL DE ${totalModules} MÓDULOS`);
            for (let index = 0; index < modulesData.length; index++) {
                const module = modulesData[index];
                const progressIncrement = 30 / totalModules; // 30% del progreso total para módulos
                const currentProgress = 50 + (index * progressIncrement);
                
                //console.log(`📦 Cargando módulo ${index + 1}/${totalModules}: "${module.desc_modulo}" (ID: ${module.idmodulo})`);
                updateLoadingProgress(Math.round(currentProgress), `Cargando módulo: ${module.desc_modulo}...`);
                
                // Crear el módulo
                const mainLi = buildMenuItem(module, "module");
                const mainAnchor = mainLi.querySelector("a");
                const subUl = document.createElement("ul");
                subUl.className = "dropdown-menu";
                subUl.setAttribute("aria-labelledby", mainAnchor.id);
                subUl.setAttribute("data-submodules-loaded", "false");
                subUl.innerHTML = '<div class="p-2 text-white-50">Cargando...</div>';
                mainLi.appendChild(subUl);

                setupCustomDropdown(mainAnchor, subUl, module.idmodulo);
                navbarNav.appendChild(mainLi);

                //console.log(`✅ Módulo "${module.desc_modulo}" - LISTO`);

                // Agregar separador HR si no es el último módulo
                if (index < modulesData.length - 1) {
                    const hr = document.createElement("hr");
                    hr.className = "horizontal dark my-3";
                    navbarNav.appendChild(hr);
                }

                // Delay entre módulos para no sobrecargar el servidor
                if (index < modulesData.length - 1) {
                   // console.log(`⏳ Esperando 200ms antes del siguiente módulo...`);
                    await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
                }
            }
            //console.log(`🎉 TODOS LOS MÓDULOS CARGADOS SECUENCIALMENTE`);

            // Agregar "Cerrar Sesión" al final cuando hay módulos
            addLogoutButton();

            updateLoadingProgress(95, 'Finalizando configuración...');

            // Pequeño delay final para que se vea el 95%
            await new Promise(resolve => setTimeout(resolve, 300));

            updateLoadingProgress(100, '¡Dashboard listo!');
            
            // Ocultar overlay después de un momento
            setTimeout(() => {
                hideLoadingOverlay();
            }, 1000);

        } else {
            console.error("Formato de respuesta inválido:", data);
            updateLoadingProgress(100, 'Error en la carga');
            setTimeout(() => {
                hideLoadingOverlay();
            }, 1000);
            
            // Agregar el botón "Cerrar Sesión" incluso en caso de error
            addLogoutButton();
            
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    title: "Error",
                    text: "Formato de respuesta de módulos inesperado.",
                    icon: "error",
                    confirmButtonText: "OK",
                    color: "black",
                });
            }
        }
    } catch (error) {
        console.error("Error al procesar la respuesta o de red:", error);
        updateLoadingProgress(100, 'Error en la carga');
        setTimeout(() => {
            hideLoadingOverlay();
        }, 1000);
        
        // Agregar el botón "Cerrar Sesión" incluso en caso de error de red
        const logoutLi = document.createElement("li");
        logoutLi.className = "nav-item";
        const logoutAnchor = document.createElement("a");
        logoutAnchor.className = "nav-link";
        logoutAnchor.id = "cerrar-session-link";
        logoutAnchor.href = "cerrar_session";

        const logoutIcon = getIconSvgForName("Cerrar Sesión");
        const logoutText = document.createElement("h6");
        logoutText.className = "nav-link-text ms-3";
        logoutText.textContent = "Cerrar Sesión";
        logoutText.style.color = "white";
        logoutText.style.margin = "11%";
        logoutText.style.paddingLeft = ".5rem";

        logoutAnchor.innerHTML = logoutIcon;
        logoutAnchor.appendChild(logoutText);
        logoutLi.appendChild(logoutAnchor);
        navbarNav.appendChild(logoutLi);
        
        const errorMessage = error.message.includes("HTTP")
            ? `Error de conexión con el servidor: ${error.message}`
            : "Ocurrió un error al procesar los módulos del servidor.";

        if (typeof Swal !== "undefined") {
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
                color: "black",
            });
        }
    }
}

// --- Resto de tu código (sidebar, active links, y HideNavbar) ---
// (Mantengo tu código original aquí abajo sin cambios para que lo integres tú)
document.addEventListener("DOMContentLoaded", function () {
  // === Sidebar functionality ===
  const sidenav = document.getElementById("sidenav-main");
  const body = document.querySelector("body");
  const filterToggle = document.getElementById("filter-toggle");

  const soportePosLink = document.querySelector('a[data-value="Soporte POS"]');
  const consultaRifLink = document.getElementById("rif-link");
  const verificacionSolvenciaLink = document.getElementById("domiciliacion");
  const gestionUsersLink = document.getElementById("gestion_users");
  const cerrarLink = document.getElementById("cerrar-link");

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
        const parentDropdownMenu = currentElement.closest(".dropdown-menu");
        if (parentDropdownMenu) {
          const parentToggle = parentDropdownMenu.previousElementSibling;
          if (parentToggle) {
            parentToggle.classList.add("active");
            parentToggle.setAttribute("aria-expanded", "true");
            parentDropdownMenu.classList.add("show");
          }
          currentElement =
            parentDropdownMenu.closest("li.nav-item.dropdown") ||
            parentDropdownMenu.closest("li.dropend");
        } else {
          currentElement = null; // No más padres dropdown
        }
      }
    }
  }

  // Estas llamadas deben ocurrir DESPUÉS de que los módulos dinámicos hayan sido poblados.
  // Es mejor moverlas dentro de un callback de `loadFullNavbar` o asegurarte de que `loadFullNavbar`
  // se complete primero. Por ahora, las dejo aquí pero tenlo en cuenta.
  setActiveLink("inicio-link", "dashboard");
  setActiveLink("tickets-link", "consulta_ticket"); // Asegúrate que 'tickets-link' exista dinámicamente si es un sub-submódulo.
  setActiveLink("rif-link", "consulta_rif");
  setActiveLink("estadisticas-link", "pages/profile.html");
  setActiveLink("assignment-ticket", "asignar_tecnico");
  setActiveLink("tecnico", "tecnico");
  setActiveLink("gestion_users", "gestionusers");
  setActiveLink("taller", "taller");
  setActiveLink("pendiente_entrega", "pendiente_entrega");
  setActiveLink("domiciliacion", "domiciliacion");
  setActiveLink("cerrar-link", "cerrar_session");

  const soportePosHtmlLink = document.querySelector(
    'a[data-value="Soporte POS"]'
  );
  if (soportePosHtmlLink && soportePosHtmlLink.id) {
    setActiveLink(soportePosHtmlLink.id, "soporte_pos");
  } else if (soportePosHtmlLink) {
    console.warn(
      "Soporte POS link does not have an ID for setActiveLink. Consider adding id='soporte-pos-link' to it."
    );
  }

  // === HideNavbar (Permission logic removed as requested) ===
  const userIdElement = document.getElementById("id_user");
  const userId = userIdElement ? userIdElement.value : null;
  // OJO: Estas variables ya están definidas arriba en el script principal.
  // Asegúrate de no re-declararlas si ya son globales.
  // const ENDPOINT_BASE = "/";
  // const APP_PATH = "SoportePost/";

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
            const newPasswordModalElement =
              document.getElementById("newPasswordModal");
            if (newPasswordModalElement) {
              // new bootstrap.Modal(newPasswordModalElement).show();
            } else {
              console.error(
                "El modal 'newPasswordModal' no se encontró en el DOM."
              );
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
        console.error(
          "Error al verificar estatus del usuario:",
          xhr.status,
          xhr.statusText
        );
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

// Carga la barra de navegación principal cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
  //console.log(`🌟 INICIANDO SISTEMA DE CARGA SECUENCIAL DE MÓDULOS`);
  
  // Mostrar overlay de carga
  showLoadingOverlay();
  //console.log(`📱 Modal de carga mostrado`);
  
  // Iniciar progreso automático
  startLoadingProgress();
  //console.log(`⚡ Progreso automático iniciado`);
  
  // Cargar navbar secuencialmente
// console.log(`🚀 Iniciando carga de navbar...`);
  await loadFullNavbar();
  //console.log(`✅ Carga de navbar completada`);
  
  // Detener progreso automático
  stopLoadingProgress();
 // console.log(`🏁 Sistema de carga secuencial FINALIZADO`);
});

// Function to build menu items (main modules or submodules)
function buildMenuItem(itemData, type) {
  const listItem = document.createElement("li");
  const anchor = document.createElement("a");

  let itemName = "";
  let itemUrl = "#";
  let iconHtml = "";
  let iconElement = null; // To hold the parsed icon HTML as an element

  if (type === "module") {
    itemName = itemData.desc_modulo;
    iconHtml = getIconSvgForName(itemName);

    listItem.className = "nav-item";
    anchor.className = "nav-link dropdown-toggle d-flex align-items-center";
    anchor.id = `module-link-${itemData.idmodulo}`;
    anchor.setAttribute("data-bs-toggle", "dropdown");
    anchor.setAttribute("aria-expanded", "false");
    anchor.setAttribute("role", "button");
    anchor.href = "#";

    const heading = document.createElement("h6");
    heading.className = "nav-link-text ms-3";
    heading.style.color = "white";
    heading.style.margin = "0";
    heading.textContent = itemName;

    // Create a temporary div to parse the iconHtml string into actual DOM elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = iconHtml;
    if (tempDiv.firstElementChild) {
      // If there's an actual element parsed
      anchor.appendChild(tempDiv.firstElementChild);
    }
    anchor.appendChild(heading);
  } else if (type === "submodule") {
    itemName = itemData.desc_submodulo; // This is correct based on image_e2ed1d.png
    iconHtml = getIconSvgForName(itemName);

    listItem.className = "";
    anchor.className = "dropdown-item d-flex align-items-center";
    anchor.id = `submodule-link-${itemData.id_submodulo}`; // This is correct based on image_e2ed1d.png
    itemUrl = `/SoportePost/${itemData.url_archivo}`; // Ensure consistent URL naming
    anchor.href = itemUrl;

    const textSpan = document.createElement("span");
    textSpan.textContent = itemName; // Set the text

    // Append the icon first if it exists
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = iconHtml;
    if (tempDiv.firstElementChild) {
      anchor.appendChild(tempDiv.firstElementChild);
    }

    // Then append the text span
    anchor.appendChild(textSpan);

    // OPTIONAL: Add a little margin between icon and text for submodules if needed
    // textSpan.style.marginLeft = '0.5rem';

    // --- Debugging helper (remove after testing) ---
    // console.log(`Submodule created: ${itemName}`, anchor);
    // anchor.style.backgroundColor = 'yellow'; // To see where the element is
    // textSpan.style.color = 'red'; // To force text color
    // --- End Debugging helper ---
  }

  listItem.appendChild(anchor);
  return listItem;
}

// Function to load submodules for a specific module ID
function loadSubmodulesForModule(moduleId, menuElement) {
  if (menuElement.dataset.submodulesLoaded === "true") {
    //console.log(`Submódulos para el módulo ${moduleId} ya cargados.`);
    return; // Already loaded, do nothing
  }

  //console.log(`Cargando submódulos para el módulo ID: ${moduleId}`);
  menuElement.innerHTML =
    '<div class="p-2 text-white-50">Cargando submódulos...</div>'; // Loading feedback

  const id_usuario_element = document.getElementById("id_user");
  const id_usuario = id_usuario_element ? id_usuario_element.value : null;

  if (!id_usuario) {
    console.error("ID de usuario no encontrado para cargar submódulos.");
    menuElement.innerHTML =
      '<div class="p-2 text-danger">Error: Usuario no identificado.</div>';
    return;
  }

  const xhrSubmodules = new XMLHttpRequest();
  // Adjust this API path to your actual submodule endpoint
  const submodulesApiPath = `api/consulta/getSubmodulesForModule`; // Your actual endpoint

  xhrSubmodules.open("POST", `${ENDPOINT_BASE}${APP_PATH}${submodulesApiPath}`);
  xhrSubmodules.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  xhrSubmodules.onload = function () {
    if (xhrSubmodules.status === 200) {
      try {
        const response = JSON.parse(xhrSubmodules.responseText);
        //console.log(`Respuesta de submódulos para ${moduleId}:`, response);

        if (response.success && Array.isArray(response.submodules)) {
          menuElement.innerHTML = ""; // Clear loading message

          if (response.submodules.length === 0) {
            menuElement.innerHTML =
              '<div class="p-2 text-white-50">No hay submódulos activos.</div>';
          } else {
            response.submodules.forEach((submodule) => {
              // Only add if submodule is active (status_submod === 't')
              if (submodule.activo === "t") {
                // Ensure 't' matches your API
                const li = buildMenuItem(submodule, "submodule");
                menuElement.appendChild(li);
              } else {
                //console.log(`Submódulo ${submodule.desc_submodulo} (ID: ${submodule.id_submodulo}) está inactivo y no se mostrará.`);
              }
            });
          }
          menuElement.dataset.submodulesLoaded = "true"; // Mark as loaded successfully
        } else {
          console.error(
            `Formato de respuesta inválido para submódulos de ${moduleId}:`,
            response
          );
          menuElement.innerHTML =
            '<div class="p-2 text-danger">Error al cargar submódulos.</div>';
        }
      } catch (error) {
        console.error(
          `Error al analizar la respuesta JSON de submódulos para ${moduleId}:`,
          error
        );
        menuElement.innerHTML =
          '<div class="p-2 text-danger">Error de formato en datos de submódulos.</div>';
      }
    } else {
      console.error(
        `Error al obtener submódulos para ${moduleId}: ${xhrSubmodules.status} ${xhrSubmodules.statusText}`
      );
      menuElement.innerHTML = `<div class="p-2 text-danger">Error de conexión: ${xhrSubmodules.status}.</div>`;
    }
  };
  xhrSubmodules.onerror = function () {
    console.error(`Network Error al cargar submódulos para ${moduleId}.`);
    menuElement.innerHTML = '<div class="p-2 text-danger">Error de red.</div>';
  };

  const datos = `action=getSubmodulesForModule&moduleId=${encodeURIComponent(
    moduleId
  )}&id_usuario=${encodeURIComponent(id_usuario)}`;
  xhrSubmodules.send(datos);
}

// --- // --- // --- // --- // --- // --- // --- // --- // --- // --- // --- // --- // --- // --- // ---

// --- Funciones para manipular la UI y guardar en LocalStorage ---

function sidebarColor(element) {
  const newColor = element.getAttribute("data-color");
  const sidebar = document.getElementById("sidenav-main"); // Tu sidebar tiene este ID
  // Si tu navbar principal también necesita cambiar de color, identifica su ID o clase y manipúlalo aquí.
  // Por ahora, nos enfocamos en el sidenav ya que es donde las clases de color se aplican en tu HTML.

  if (sidebar) {
    // Elimina clases de color previas del sidenav
    sidebar.classList.remove(
      "bg-gradient-primary",
      "bg-gradient-dark",
      "bg-gradient-info",
      "bg-gradient-success",
      "bg-gradient-warning",
      "bg-gradient-danger",
      "bg-white",
      "bg-default"
    ); // Asegúrate de quitar bg-white y bg-default también si aplican
    // Agrega la nueva clase de color
    sidebar.classList.add(`bg-gradient-${newColor}`);
    // Para Argon Dashboard, el color del sidebar se aplica directamente con bg-gradient-{color}
  }

  // Guarda el color seleccionado en LocalStorage
  localStorage.setItem("sidebarColor", newColor);

  // Actualiza el estado visual de los badges (activo/inactivo) en el panel de configuración
  document.querySelectorAll(".badge-colors .badge").forEach((badge) => {
    badge.classList.remove("active");
  });
  element.classList.add("active");
}

function sidebarType(element) {
  const newTypeClass = element.getAttribute("data-class"); // Esto será 'bg-white' o 'bg-default'
  const sidebar = document.getElementById("sidenav-main"); // Tu sidebar tiene este ID

  if (sidebar) {
    // Elimina las clases de tipo previas
    sidebar.classList.remove("bg-white", "bg-default");
    // Agrega la nueva clase de tipo
    sidebar.classList.add(newTypeClass);
  }

  // Guarda el tipo seleccionado en LocalStorage
  localStorage.setItem("sidebarType", newTypeClass);

  // Actualiza el estado visual de los botones de tipo
  document
    .querySelectorAll('[onclick="sidebarType(this)"]')
    .forEach((button) => {
      button.classList.remove("active");
    });
  element.classList.add("active");
}

function navbarFixed(element) {
  const isChecked = element.checked;
  // Debes identificar el elemento de tu navbar principal (el de arriba)
  // En Argon Dashboard, a menudo es un <nav class="navbar navbar-main"> o similar
  // Si no tienes un ID, puedes usar una clase general como .navbar-main
  const navbar = document.querySelector(".navbar-main"); // Ajusta este selector si es diferente

  if (navbar) {
    if (isChecked) {
      // Asegúrate de que esta sea la clase correcta para fijar el navbar en Argon
      navbar.classList.add("position-sticky", "top-1", "z-index-sticky");
      navbar.classList.remove("position-absolute"); // Si se usa position-absolute por defecto
    } else {
      navbar.classList.remove("position-sticky", "top-1", "z-index-sticky");
      navbar.classList.add("position-absolute"); // Si se usa position-absolute por defecto
    }
  }
  localStorage.setItem("navbarFixed", isChecked);
}

function darkMode(element) {
  const isChecked = element.checked;
  if (isChecked) {
    document.body.classList.add("dark-version"); // Esta clase generalmente se aplica al body
  } else {
    document.body.classList.remove("dark-version");
  }
  localStorage.setItem("darkMode", isChecked);
}

// --- Cargar las preferencias al inicio de la página (DEBE EJECUTARSE EN CADA MÓDULO) ---
document.addEventListener("DOMContentLoaded", () => {
  // Cargar color del sidebar
  const savedColor = localStorage.getItem("sidebarColor");
  if (savedColor) {
    const sidebar = document.getElementById("sidenav-main"); // Tu sidebar
    if (sidebar) {
      // Limpia todas las posibles clases de color y tipo antes de aplicar la guardada
      sidebar.classList.remove(
        "bg-gradient-primary",
        "bg-gradient-dark",
        "bg-gradient-info",
        "bg-gradient-success",
        "bg-gradient-warning",
        "bg-gradient-danger",
        "bg-white",
        "bg-default"
      );
      sidebar.classList.add(`bg-gradient-${savedColor}`);
      // También activa el badge correspondiente en el panel de configuración
      const activeBadge = document.querySelector(
        `.badge-colors .badge[data-color="${savedColor}"]`
      );
      if (activeBadge) {
        // Desactiva cualquier otro badge activo y activa el correcto
        document.querySelectorAll(".badge-colors .badge").forEach((badge) => {
          badge.classList.remove("active");
        });
        activeBadge.classList.add("active");
      }
    }
  } else {
    // Si no hay color guardado, asegúrate de que el "primary" esté activo por defecto si es tu estilo inicial
    const defaultBadge = document.querySelector(
      ".badge-colors .badge.bg-gradient-primary"
    );
    if (defaultBadge) {
      defaultBadge.classList.add("active");
    }
  }

  // Cargar tipo de sidebar (Claro/Oscuro - bg-white/bg-default)
  const savedType = localStorage.getItem("sidebarType");
  if (savedType) {
    const sidebar = document.getElementById("sidenav-main"); // Tu sidebar
    if (sidebar) {
      sidebar.classList.remove("bg-white", "bg-default"); // Quita las clases de tipo
      sidebar.classList.add(savedType);
      const activeButton = document.querySelector(
        `[onclick="sidebarType(this)"][data-class="${savedType}"]`
      );
      if (activeButton) {
        // Desactiva cualquier otro botón activo y activa el correcto
        document
          .querySelectorAll('[onclick="sidebarType(this)"]')
          .forEach((button) => {
            button.classList.remove("active");
          });
        activeButton.classList.add("active");
      }
    }
  } else {
    // Si no hay tipo guardado, activa el botón "Azul" (bg-white) por defecto
    const defaultTypeButton = document.querySelector(
      '[onclick="sidebarType(this)"][data-class="bg-white"]'
    );
    if (defaultTypeButton) {
      defaultTypeButton.classList.add("active");
    }
  }

  // Cargar estado de Navbar Fija
  const savedNavbarFixed = localStorage.getItem("navbarFixed");
  const navbarFixedCheckbox = document.getElementById("navbarFixed");
  const navbar = document.querySelector(".navbar-main"); // Tu navbar superior

  if (navbarFixedCheckbox && navbar) {
    if (savedNavbarFixed !== null) {
      const isFixed = savedNavbarFixed === "true";
      navbarFixedCheckbox.checked = isFixed;
      if (isFixed) {
        navbar.classList.add("position-sticky", "top-1", "z-index-sticky");
        navbar.classList.remove("position-absolute");
      } else {
        navbar.classList.remove("position-sticky", "top-1", "z-index-sticky");
        navbar.classList.add("position-absolute");
      }
    } else {
      // Si no hay nada guardado, asegura que el checkbox refleje el estado inicial del navbar.
      // Por ejemplo, si tu navbar es fija por defecto, marca el checkbox.
      // Esto es más complejo ya que necesitarías saber el estado CSS inicial.
      // Una opción simple es que, si no hay preferencia, el checkbox esté desmarcado por defecto.
      navbarFixedCheckbox.checked = false; // Asume que no es fijo si no hay preferencia guardada.
      navbar.classList.remove("position-sticky", "top-1", "z-index-sticky");
      navbar.classList.add("position-absolute");
    }
  }

  // Cargar estado de Dark Mode
  const savedDarkMode = localStorage.getItem("darkMode");
  const darkModeCheckbox = document.getElementById("dark-version");
  if (darkModeCheckbox) {
    if (savedDarkMode !== null) {
      const isDarkMode = savedDarkMode === "true";
      darkModeCheckbox.checked = isDarkMode;
      if (isDarkMode) {
        document.body.classList.add("dark-version");
      } else {
        document.body.classList.remove("dark-version");
      }
    } else {
      // Si no hay preferencia, el checkbox se desmarca por defecto (modo claro)
      darkModeCheckbox.checked = false;
      document.body.classList.remove("dark-version");
    }
  }
});

// ==================== SISTEMA DE CARGA SECUENCIAL DE MÓDULOS ====================

// Variables globales para el control de carga
let loadingProgress = 0;
let loadingStatus = '';
let loadingInterval = null;

// Función para actualizar el progreso y estado del loading
function updateLoadingProgress(progress, status) {
    const progressBar = document.querySelector('.loading-progress-bar');
    const statusElement = document.getElementById('loading-status');
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    if (statusElement) {
        statusElement.textContent = status;
    }
    
   // console.log(`📊 PROGRESO: ${progress}% - ${status}`);
    
    loadingProgress = progress;
    loadingStatus = status;
}

// Función para mostrar/ocultar el modal de carga
function showLoadingOverlay() {
    const overlay = document.getElementById('dashboard-loading-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        updateLoadingProgress(0, 'Inicializando...');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('dashboard-loading-overlay');
    if (overlay) {
        // Esperar un momento para que el usuario vea el 100%
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }
}

// Función para simular progreso automático durante la carga
function startLoadingProgress() {
    let progress = 0;
    const maxProgress = 90; // Máximo 90% automático, el resto se completa manualmente
    const increment = 1;
    const interval = 60; // Cada 60ms incrementa 1%
    
    loadingInterval = setInterval(() => {
        if (progress < maxProgress) {
            progress += increment;
            updateLoadingProgress(progress, 'Cargando sistema...');
        }
    }, interval);
}

function stopLoadingProgress() {
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
}