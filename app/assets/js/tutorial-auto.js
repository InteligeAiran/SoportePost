document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tutorial') !== 'active') return;

    // Extraer el nombre del submódulo desde la URL
    // Ej: "/SoportePost/consulta_rif" → "consulta_rif"
    const path = window.location.pathname;
    const match = path.match(/\/SoportePost\/([^/]+)\/?$/i);
    if (!match) return;

    const submoduleKey = match[1].trim();
    if (!submoduleKey) return;

    // Mapa de submódulos → funciones de tutorial
    const tutorials = {
        'consulta_rif': startConsultaRIFTutorial,
        'reporte_ticket': startReporteTicketTutorial,
        'crear_ticket': startCrearTicketTutorial,
        'asignar_tecnico': startAsignarTecnicoTutorial,
        'gestion_tecnicos': startGestionTecnicosTutorial,
        // Agrega más aquí
    };

    const startFn = tutorials[submoduleKey];

    // Ejecutar con pequeño delay
    setTimeout(() => {
        if (startFn && typeof startFn === 'function') {
            startFn();
        } else {
            console.warn(`No hay tutorial para: ${submoduleKey}`);
            // Opcional: mostrar mensaje genérico
            // alert('Tutorial no disponible para este módulo.');
        }

        // Limpiar URL (quitar ?tutorial=active)
        const cleanPath = path.replace(/[?&]tutorial=active/, '');
        history.replaceState({}, '', cleanPath);
    }, 800);
});