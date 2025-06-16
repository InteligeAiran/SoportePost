  /**
         * Genera el HTML de los iconos SVG basado en el nombre del módulo/submódulo.
         * @param {string} name El nombre del módulo o submódulo.
         * @returns {string} El string SVG del icono.
         */
        function getIconSvgForName(name) {
            let iconSvg = '';
            switch (name) {
                case "Gestión de Tickets":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ticket-fill me-2" viewBox="0 0 16 16"><path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3z"/></svg>';
                    break;
                case "Consultas y Reportes":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search me-2" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>';
                    break;
                case "Administración":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>';
                    break;
                case "Configuración":
                    iconSvg ='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg>';
                    break;
                case "Crear Ticket":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square-fill me-2" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/></svg>';
                    break;
                case "Gestión Coordinador":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill me-2" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm-3-1s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm-4-5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m11 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/></svg>';
                    break;
                case "Gestión Técnicos":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-workspace me-2" viewBox="0 0 16 16"><path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/><path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"/></svg>';
                    break;
                case "Gestión Taller":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools me-2" viewBox="0 0 16 16"><path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529.026z"/></svg>';
                    break;
                case "Pendiente por Entregar":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck-front-fill me-2" viewBox="0 0 16 16"><path d="M3.5 0A2.5 2.5 0 0 0 1 2.5v9c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2v-9A2.5 2.5 0 0 0 12.5 0zM3 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.9c0 .625-.562 1.092-1.17.994C10.925 7.747 9.208 7.5 8 7.5s-2.925.247-3.83.394A1.008 1.008 0 0 1 3 6.9zm1 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2m8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2m-5-2h2a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2"/></svg>';
                    break;
                case "Consulta General": // Este es un submódulo pero tiene sus propios subsubmódulos
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search me-2" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>';
                    break;
                case "Verificación de Solvencia":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-stack me-2" viewBox="0 0 16 16"><path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/></svg>';
                    break;
                case "Gestión Usuario":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-gear me-2" viewBox="0 0 16 16"><path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/></svg>';
                    break;
                case "Cerrar Sesión":
                    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/><path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/></svg>';
                    break;
                case "Sustitución de POS":
                case "Préstamo de POS":
                case "Desafiliación de POS":
                case "Migración de Bancos":
                case "Cambio de Razón Social":
                case "Consulta de Rif":
                case "Reportes Tickets":
                default:
                    iconSvg = '';
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
                console.warn('setupCustomDropdown: Elementos toggle o menu no encontrados.', { toggleElement, menuElement });
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
                    if (openMenu !== menuElement && !menuElement.contains(openMenu) && !openMenu.contains(menuElement)) {
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
                if (menuElement.classList.contains("show") && moduleId && menuElement.dataset.submodulesLoaded !== 'true') {
                    console.log(`Dropdown abierto para el módulo ${moduleId}. Cargando submódulos...`);
                    loadSubmodulesForModule(moduleId, menuElement);
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
                    currentParentMenu = currentParentMenu.closest("li.dropend")?.closest(".dropdown-menu") || currentParentMenu.closest("li.nav-item.dropdown")?.closest(".dropdown-menu");
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
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');

            const itemName = itemData.name_module || itemData.name_sub_module || itemData.name_subsub_module || '';
            const safeName = itemName.toLowerCase().replace(/[^a-z0-9]/g, '');

            let itemUrl = '#';

            if (type === 'module') {
                listItem.className = 'nav-item dropdown mt-3';
                anchor.className = 'nav-link dropdown-toggle d-flex align-items-center';
                anchor.id = `${safeName}Dropdown`;
                itemUrl = itemData.url_module || '#';

                const heading = document.createElement('h6');
                heading.style.color = 'white';
                heading.style.margin = '0';
                heading.style.paddingLeft = '.5rem';
                heading.className = 'flex-grow-1';
                heading.textContent = itemName;
                anchor.innerHTML = itemData.icon_svg || getIconSvgForName(itemName);
                anchor.appendChild(heading);

                // Almacena el ID del módulo en el LI para futura referencia
                listItem.setAttribute('data-module-id', itemData.id_module);

            } else if (type === 'submodule') {
                anchor.className = 'dropdown-item';
                anchor.id = `${safeName}SubDropdown`;
                itemUrl = itemData.url_sub_module || '#';
                anchor.innerHTML = itemData.icon_svg || getIconSvgForName(itemName);
                anchor.innerHTML += itemName;

                if (itemData.subsub_modules && itemData.subsub_modules.length > 0) {
                    listItem.classList.add('dropend');
                    anchor.classList.add('dropdown-toggle'); // Necesario para que setupCustomDropdown lo identifique
                }

            } else if (type === 'subsubmodule') {
                anchor.className = 'dropdown-item';
                itemUrl = itemData.url_subsub_module || '#';
                anchor.textContent = itemName;
                anchor.setAttribute('data-value', itemName);
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
            const ul = document.createElement('ul');
            ul.className = 'dropdown-menu';
            ul.setAttribute('aria-labelledby', parentAnchorId);

            items.forEach(item => {
                const li = buildMenuItem(item, itemType);

                if (itemType === 'submodule' && item.subsub_modules && item.subsub_modules.length > 0) {
                    const subSubUl = buildDropdownMenu(item.subsub_modules, li.querySelector('a').id, 'subsubmodule');
                    li.appendChild(subSubUl);
                    // IMPORTANTE: Inicializar dropdowns para los submódulos que tienen sub-submódulos
                    setupCustomDropdown(li.querySelector('a'), subSubUl);
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
            if (targetUlElement.dataset.submodulesLoaded === 'true') {
                console.log(`Submódulos para el módulo ${moduleId} ya cargados.`);
                return;
            }

            targetUlElement.innerHTML = '<div class="p-2 text-white-50">Cargando submódulos...</div>';

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/getSubmodulesForModule`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = function () {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);

                        // AQUÍ ESTÁ EL CAMBIO CLAVE: Usa 'response.submodules' en lugar de 'response.sub_modules'
                        if (response.success && Array.isArray(response.submodules)) { // <-- CAMBIO AQUÍ
                            targetUlElement.innerHTML = ''; // Limpia el mensaje de carga
                            if (response.submodules.length === 0) { // <-- Y AQUÍ
                                targetUlElement.innerHTML = '<div class="p-2 text-white-50">No hay submódulos disponibles.</div>';
                            } else {
                                // Construye los submódulos y sus posibles sub-submódulos
                                response.submodules.forEach(sub_module => { // <-- Y AQUÍ
                                    const li = buildMenuItem(sub_module, 'submodule');
                                    targetUlElement.appendChild(li);

                                    // Si este submódulo tiene sub-submódulos, inicializa su dropdown
                                    if (sub_module.subsub_modules && sub_module.subsub_modules.length > 0) {
                                        const subSubUl = buildDropdownMenu(sub_module.subsub_modules, li.querySelector('a').id, 'subsubmodule');
                                        li.appendChild(subSubUl);
                                        // Inicializar el dropdown para este submódulo con sub-submódulos
                                        setupCustomDropdown(li.querySelector('a'), subSubUl);
                                    }
                                });
                            }
                            targetUlElement.dataset.submodulesLoaded = 'true'; // Marca como cargado
                            console.log(`Submódulos para el módulo ${moduleId} cargados exitosamente.`);

                        } else {
                            console.error("Formato de respuesta inválido para submódulos: Se esperaba 'success: true' y un array 'submodules'.", response); // Actualiza el mensaje de error para reflejar el nombre correcto
                            targetUlElement.innerHTML = '<div class="p-2 text-danger">Error al cargar submódulos.</div>';
                            if (typeof Swal !== "undefined") {
                                Swal.fire({ title: "Error", text: "Formato de respuesta de submódulos inesperado.", icon: "error", confirmButtonText: "OK", color: "black" });
                            }
                        }
                    } catch (error) {
                        console.error("Error al analizar la respuesta JSON de submódulos:", error);
                        targetUlElement.innerHTML = '<div class="p-2 text-danger">Error al procesar datos.</div>';
                        if (typeof Swal !== "undefined") {
                            Swal.fire({ title: "Error", text: "Ocurrió un error al procesar los submódulos del servidor.", icon: "error", confirmButtonText: "OK", color: "black" });
                        }
                    }
                } else {
                    console.error(
                        `Error al obtener submódulos para el módulo ${moduleId}: ${xhr.status} ${xhr.statusText}`
                    );
                    targetUlElement.innerHTML = `<div class="p-2 text-danger">Error ${xhr.status} al cargar.</div>`;
                    if (typeof Swal !== "undefined") {
                        Swal.fire({ title: "Error", text: `Error de conexión con el servidor al cargar submódulos: ${xhr.status}`, icon: "error", confirmButtonText: "OK", color: "black" });
                    }
                }
            };

            xhr.onerror = function () {
                console.error("Network Error al cargar los submódulos.");
                targetUlElement.innerHTML = '<div class="p-2 text-danger">Error de red.</div>';
                if (typeof Swal !== "undefined") {
                    Swal.fire({ title: "Error de red", text: "No se pudo conectar al servidor para cargar los submódulos.", icon: "error", confirmButtonText: "OK", color: "black" });
                }
            };

            const datos = `action=getSubmodulesForModule&id_module=${encodeURIComponent(moduleId)}`;
            xhr.send(datos);
        }

        /**
         * Fetches main modules and initializes their custom dropdowns.
         */
        function loadFullNavbar(options = {}) {
            const {
                method = 'POST',
                apiPath = 'api/consulta/getModules' // Este endpoint solo debe devolver los módulos principales
            } = options;

            const navbarNav = document.getElementById('main-navbar-nav');
            if (!navbarNav) {
                console.error("Elemento con ID 'main-navbar-nav' no encontrado. No se puede poblar la barra de navegación.");
                return;
            }

            // Limpia los módulos dinámicos existentes, manteniendo solo "Inicio" y la primera HR
            const initialItems = Array.from(navbarNav.children).filter(child =>
                child.id === 'inicio-link' || (child.tagName === 'LI' && child.querySelector('#inicio-link')) ||
                (child.tagName === 'HR' && child.previousElementSibling && child.previousElementSibling.id === 'inicio-link')
            );
            navbarNav.innerHTML = ''; // Limpia todo
            initialItems.forEach(item => navbarNav.appendChild(item)); // Re-agrega "Inicio" y su HR

            const xhr = new XMLHttpRequest();
            xhr.open(method, `${ENDPOINT_BASE}${APP_PATH}${apiPath}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = function () {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);

                        if (response.success && Array.isArray(response.modules)) {
                            const modulesData = response.modules;

                            modulesData.forEach((module, index) => {
                                const mainLi = buildMenuItem(module, 'module');
                                const mainAnchor = mainLi.querySelector('a');

                                // Crea el UL vacío para los submódulos
                                const subUl = document.createElement('ul');
                                subUl.className = 'dropdown-menu';
                                subUl.setAttribute('aria-labelledby', mainAnchor.id);
                                subUl.setAttribute('data-submodules-loaded', 'false'); // Marca como no cargado
                                subUl.innerHTML = '<div class="p-2 text-white-50">Cargando...</div>'; // Mensaje inicial de carga
                                mainLi.appendChild(subUl);

                                // IMPORTANTE: Inicializa tu dropdown CUSTOM para este módulo principal
                                // Pasa el ID del módulo para que setupCustomDropdown lo use al abrir
                                setupCustomDropdown(mainAnchor, subUl, module.id_module);

                                navbarNav.appendChild(mainLi);

                                if (index < modulesData.length - 1) {
                                    const hr = document.createElement('hr');
                                    hr.className = 'horizontal dark my-3';
                                    navbarNav.appendChild(hr);
                                }
                            });

                             // Una vez que todos los módulos dinámicos se han cargado, añade "Cerrar Sesión" al final
                            const logoutLi = document.createElement('li');
                            logoutLi.className = 'nav-item';
                            const logoutAnchor = document.createElement('a');
                            logoutAnchor.className = 'nav-link';
                            logoutAnchor.id = 'cerrar-session-link';
                            logoutAnchor.href = 'cerrar_session';
                            
                            const logoutIcon = getIconSvgForName("Cerrar Sesión");
                            const logoutText = document.createElement('h6');
                            logoutText.className = 'nav-link-text ms-3';
                            logoutText.textContent = 'Cerrar Sesión';
                            logoutText.style.color = 'white'; // Asegurar el color blanco
                            logoutText.style.margin = '0'; // Eliminar márgenes si los añade Argon Dashboard por defecto
                            logoutText.style.paddingLeft = '.5rem'; // Añadir padding si es necesario

                            logoutAnchor.innerHTML = logoutIcon; // Insertar el SVG
                            logoutAnchor.appendChild(logoutText); // Añadir el texto después del SVG
                            logoutLi.appendChild(logoutAnchor);
                            navbarNav.appendChild(logoutLi);


                            // ***************************************************************
                            // Mueve la inicialización de los dropdowns estáticos de tu JS original
                            // que manejan los sub-submódulos que NO se cargan dinámicamente
                            // (ej. "Sustitución de POS", "Consulta de Rif", etc. si los mantienes estáticos).
                            // Si TODOS los niveles ahora son dinámicos, esta sección de tu JS original
                            // (const gestionTicketsAnchor, etc.) no sería necesaria o se reemplazaría
                            // por la lógica dinámica recursiva.
                            //
                            // En tu caso, dado que 'Crear Ticket' tiene sub-submódulos estáticos,
                            // o si 'Consultas General' tiene sub-submódulos estáticos,
                            // aquí DEBES asegurarte que esos dropdowns se inicien una vez que sus padres dinámicos
                            // hayan sido cargados.
                            //
                            // Sin embargo, con la nueva lógica, buildDropdownMenu() y loadSubmodulesForModule()
                            // ya se encargan de inicializar los dropdowns de los submódulos (con sub-submódulos).
                            // Así que las líneas de `setupCustomDropdown` para `crearTicketSubAnchor`,
                            // `consultasGeneralAnchor` etc. que tenías, DEBERÍAN SER ELIMINADAS
                            // si estás construyendo todo dinámicamente como en la función `buildDropdownMenu`.
                            // Solo mantén los setupCustomDropdown para los elementos principales o los que
                            // no sean generados por buildDropdownMenu/loadSubmodulesForModule.
                            // ***************************************************************

                        } else {
                            console.error("Formato de respuesta inválido: Se esperaba 'success: true' y un array 'modules'.", response);
                            if (typeof Swal !== "undefined") {
                                Swal.fire({ title: "Error", text: "Formato de respuesta de módulos inesperado.", icon: "error", confirmButtonText: "OK", color: "black" });
                            }
                        }
                    } catch (error) {
                        console.error("Error al analizar la respuesta JSON de los módulos:", error);
                        if (typeof Swal !== "undefined") {
                            Swal.fire({ title: "Error", text: "Ocurrió un error al procesar los módulos del servidor.", icon: "error", confirmButtonText: "OK", color: "black" });
                        }
                    }
                } else {
                    console.error(
                        `Error al obtener módulos: ${xhr.status} ${xhr.statusText}`
                    );
                    if (typeof Swal !== "undefined") {
                        Swal.fire({ title: "Error", text: `Error de conexión con el servidor al cargar módulos: ${xhr.status}`, icon: "error", confirmButtonText: "OK", color: "black" });
                    }
                }
            };

            xhr.onerror = function () {
                console.error("Network Error al cargar los módulos.");
                if (typeof Swal !== "undefined") {
                    Swal.fire({ title: "Error de red", text: "No se pudo conectar al servidor para cargar los módulos.", icon: "error", confirmButtonText: "OK", color: "black" });
                }
            };

            const datos = `action=getModules`;
            xhr.send(datos);
        }

        // --- Resto de tu código (sidebar, active links, y HideNavbar) ---
        // (Mantengo tu código original aquí abajo sin cambios para que lo integres tú)
        document.addEventListener("DOMContentLoaded", function () {
            // === Sidebar functionality ===
            const sidenav = document.getElementById("sidenav-main");
            const body = document.querySelector("body");
            const filterToggle = document.getElementById("filter-toggle");

            const soportePosLink = document.querySelector('a[data-value="Soporte POS"]');
            const consultaRifLink = document.getElementById('rif-link');
            const verificacionSolvenciaLink = document.getElementById('domiciliacion');
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
                            currentElement = parentDropdownMenu.closest('li.nav-item.dropdown') || parentDropdownMenu.closest('li.dropend');
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
            setActiveLink('domiciliacion', 'domiciliacion');
            setActiveLink('cerrar-link', 'cerrar_session');

            const soportePosHtmlLink = document.querySelector('a[data-value="Soporte POS"]');
            if (soportePosHtmlLink && soportePosHtmlLink.id) {
                setActiveLink(soportePosHtmlLink.id, "soporte_pos");
            } else if (soportePosHtmlLink) {
                console.warn("Soporte POS link does not have an ID for setActiveLink. Consider adding id='soporte-pos-link' to it.");
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

        // Carga la barra de navegación principal cuando el DOM esté completamente cargado
        document.addEventListener('DOMContentLoaded', () => {
            loadFullNavbar(); // Llama a la función para cargar los módulos principales
        }); 